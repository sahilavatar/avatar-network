import { Persona, TeachingStyle, Passage, SourceDocument, QuizQuestion, ToolExecutionResult, SubjectId, ChatMessage } from '../types';
import { RetrievalResult, VectorSearchResult } from './embeddingGemma';
import { aiWorkerClient, ChatTurn } from './aiWorkerClient';
import { CHAT_MODEL } from './modelConfig';
import { extractPinpointSnippet } from './textSearch';

type HistoryMessage = { role: ChatMessage['role']; text: string };

export interface GenerationParams {
  query: string;
  persona: Persona;
  retrieval: RetrievalResult;
  teachingStyle: TeachingStyle;
  sources?: SourceDocument[];
  toolExecution?: ToolExecutionResult;
  // Prior conversation, excluding the current query
  history?: HistoryMessage[];
  // The student's active goals with this Avatar, one line each (see goals.ts)
  goals?: string[];
  // What's in the Avatar's notebook, so the model can say plainly when the notes don't cover a question
  notebook?: { passages: number; titles: string[] };
  // Instructions from the Avatar's enabled instruction skills (see skills.ts)
  skills?: string[];
  resolvedTopic?: string;
  isDeepDive?: boolean;
  onToken?: (textSoFar: string) => void;
}

export interface GenerationResponse {
  answerText: string;
  citations: {
    passageId: string;
    label: string;
    similarity: number;
  }[];
  tokensIn: number;
  tokensOut: number;
  groundednessScore: number;
  model: string;
  teachingStyle: TeachingStyle;
  suggestedFollowUps: string[];
  interrupted: boolean;
}

// EmbeddingGemma cosine similarity above which a passage is treated as on-topic. Calibrated on the
// built-in passages: on-topic questions scored 0.47–0.74, off-topic ones 0.11–0.43.
export const RELEVANCE_THRESHOLD = 0.45;
// Hybrid-score lift that signals an explicit target (e.g. "question 3" of an uploaded exam)
const EXPLICIT_TARGET_LIFT = 0.5;
const MAX_PASSAGE_CHARS = 900;
export const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_CHARS = 600;

/**
 * Determine adaptive teaching style based on real-time student accuracy
 */
export function determineAdaptiveStyle(accuracy: number): TeachingStyle {
  if (accuracy < 0.6) return 'scaffolding';
  if (accuracy <= 0.85) return 'guided';
  return 'mastery';
}

/**
 * Share of the answer's content words that also appear in the source passages
 */
export function calculateGroundedness(answer: string, passages: Passage[]): number {
  const words = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  const answerWords = words(answer);
  if (!passages.length || !answerWords.length) return 0;

  const sourceWords = new Set(passages.flatMap(p => words(p.text)));
  const supported = answerWords.filter(w => sourceWords.has(w)).length;
  return Math.round((supported / answerWords.length) * 100) / 100;
}

export function modelLabel(): string {
  const { device } = aiWorkerClient.getState();
  return `${CHAT_MODEL.label} · ${device === 'webgpu' ? 'WebGPU' : 'CPU (WASM)'}`;
}

export function selectRelevantHits(retrieval: RetrievalResult): VectorSearchResult[] {
  return retrieval.hits.filter(
    h => h.semanticSimilarity >= RELEVANCE_THRESHOLD || h.similarity - h.semanticSimilarity >= EXPLICIT_TARGET_LIFT
  );
}

// "§9.4 Vertex Form…" → " (§9.4)"; "Part 2" → " (Part 2)"
const sectionLabel = (section?: string) => {
  if (!section) return '';
  const numbered = section.match(/^§[\d.]+/);
  return ` (${numbered ? numbered[0] : truncate(section, 24)})`;
};

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

// Short, topic-neutral style instructions: a 1B model parrots the personas' longer
// example-laden style prompts into unrelated answers
const STYLE_INSTRUCTIONS: Record<TeachingStyle, string> = {
  scaffolding: 'The student is finding this hard. Explain step by step in simple words.',
  guided: 'Explain clearly, then give the student a hint or question so they reason through the next step themselves.',
  mastery: 'The student is doing well. Be concise and add one deeper idea to think about.'
};

function systemPrompt(persona: Persona, style: TeachingStyle, skills: string[] = []): string {
  const lines = [
    `You are ${persona.name}, a friendly ${persona.subject} tutor for a high school student. Your tone: ${persona.toneDescription}.`,
    STYLE_INSTRUCTIONS[style]
  ];
  if (persona.customInstructions) lines.push(persona.customInstructions);
  lines.push(...skills);
  lines.push(
    'Keep replies under 120 words. Write plain sentences: no headings, no bold, no lists. Use $...$ for formulas.',
    'If course notes are given, answer from them and cite them like [1]. If not, answer from general knowledge.',
    'Never describe or quote the student\'s notes unless they are shown to you.',
    'End with one short question that checks understanding.'
  );
  return lines.join('\n');
}

/** Gemma's chat template requires strictly alternating user/assistant turns that start with the user */
export function toAlternatingTurns(history: HistoryMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const msg of history) {
    if (msg.role !== 'user' && msg.role !== 'persona') continue;
    const text = msg.text?.trim();
    if (!text) continue;
    const role = msg.role === 'user' ? 'user' : 'assistant';
    const content = truncate(text, MAX_HISTORY_CHARS);
    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.content = `${last.content}\n\n${content}`;
    } else {
      turns.push({ role, content });
    }
  }
  while (turns.length && turns[0].role !== 'user') turns.shift();
  // Keep the most recent exchanges, still starting on a user turn
  let recent = turns.slice(-MAX_HISTORY_TURNS);
  while (recent.length && recent[0].role !== 'user') recent = recent.slice(1);
  // The current question is appended as the final user turn
  if (recent.length && recent[recent.length - 1].role === 'user') recent = recent.slice(0, -1);
  return recent;
}

function formatQuizForPrompt(q: QuizQuestion): string {
  const options = q.options.map(o => `${o.label}. ${o.text}`).join('\n');
  const correct = q.options.find(o => o.isCorrect);
  return [
    `Exam question${q.originalQuestionNumber ? ` ${q.originalQuestionNumber}` : ''}: ${q.question}`,
    options,
    correct ? `Answer key: ${correct.label} (guide the student toward it; reveal it only if they ask for the answer)` : '',
    q.explanation ? `Answer explanation: ${q.explanation}` : ''
  ].filter(Boolean).join('\n');
}

/** Whether the question is about the student's own uploads ("summarize my notes", "what's in my files") */
export function asksAboutOwnNotes(query: string): boolean {
  return /\b(my|these|the|uploaded)\s+(notes?|notebook|files?|uploads?|documents?|docs|handouts?|pdfs?|materials?|slides)\b/i.test(query);
}

/**
 * Builds the chat turns for a tutoring reply. Pure, so it can be tested without the model.
 * Layout matters for a 1B model: the question first, reference material labelled as not
 * written by the student, and the instruction last.
 */
export function buildTutorMessages(params: GenerationParams, relevant: VectorSearchResult[]): ChatTurn[] {
  const { query, persona, teachingStyle, toolExecution, goals = [], skills = [], resolvedTopic, isDeepDive } = params;
  const parts: string[] = [`Question from the student: ${query}`];

  if (toolExecution) {
    parts.push(
      `A calculator already solved this and showed the student the answer and working:\n${toolExecution.result}` +
        (toolExecution.steps.length ? `\n${toolExecution.steps.map(s => `- ${s}`).join('\n')}` : '')
    );
  }

  // With an exact calculator result, extra passages mostly add noise for a small model
  const notes = toolExecution ? relevant.slice(0, 1) : relevant;
  if (notes.length) {
    parts.push(
      'Notes from the student\'s course materials (the student did not write these):\n' +
        notes
          .map((hit, i) => {
            const p = hit.passage;
            return `[${i + 1}] ${p.sourceTitle}${p.section ? ` — ${p.section}` : ''}\n${truncate(p.text, MAX_PASSAGE_CHARS)}`;
          })
          .join('\n\n')
    );
  }

  if (!notes.length && !toolExecution && params.notebook) {
    const { passages, titles } = params.notebook;
    parts.push(
      passages === 0
        ? 'The student has not added any notes yet. Do not mention or describe their notes; answer from general knowledge.'
        : `None of the student's notes (${titles.slice(0, 4).join(', ')}) cover this question. Do not claim they do; answer from general knowledge and say in a few words that this isn't from their notes.`
    );
  }

  const exam = detectExamQuestionTarget(query, params.sources || []);
  if (exam) parts.push(formatQuizForPrompt(exam.question));
  if (goals.length) parts.push(`The student's goals with you:\n${goals.map(g => `- ${g}`).join('\n')}`);
  if (isDeepDive && resolvedTopic) parts.push(`The student wants a deeper explanation of: ${resolvedTopic}`);

  parts.push(
    toolExecution
      ? 'Now, in 2-4 sentences, explain the idea behind this method to the student. Do not do any calculations yourself.'
      : `Now reply to the student as their tutor${notes.length ? ', citing the notes like [1] where you use them' : ''}.`
  );

  return [
    { role: 'system', content: systemPrompt(persona, teachingStyle, skills) },
    ...toAlternatingTurns(params.history || []),
    { role: 'user', content: parts.join('\n\n') }
  ];
}

/**
 * Generates a tutoring reply with the on-device model, streaming text through onToken
 */
export async function generateTutorResponse(params: GenerationParams): Promise<GenerationResponse> {
  const relevant = selectRelevantHits(params.retrieval);
  const messages = buildTutorMessages(params, relevant);

  const result = await aiWorkerClient.generate(messages, { maxNewTokens: 280, temperature: 0.4, onToken: params.onToken });

  const cited = params.toolExecution ? relevant.slice(0, 1) : relevant;
  const citations = cited.map((hit, idx) => ({
    passageId: hit.passage.id,
    label: `[${idx + 1}] ${hit.passage.sourceTitle.split(':')[0]}${sectionLabel(hit.passage.section)}`,
    similarity: Math.round(hit.semanticSimilarity * 100) / 100,
    excerpt: extractPinpointSnippet(params.query, hit.passage, 80).text
  }));

  return {
    answerText: result.text,
    citations,
    tokensIn: result.inputTokens,
    tokensOut: result.outputTokens,
    groundednessScore: calculateGroundedness(result.text, cited.map(h => h.passage)),
    model: modelLabel(),
    teachingStyle: params.teachingStyle,
    suggestedFollowUps: generateContextualFollowUps(params.query, params.persona.subject, params.sources || [], params.goals?.[0], params.resolvedTopic),
    interrupted: result.interrupted
  };
}

/**
 * Builds the quiz-feedback prompt. The verdict comes from the answer key; the model only
 * explains it, so a small model can't get right and wrong mixed up.
 */
export function buildQuizFeedbackMessages(question: QuizQuestion, selectedIndex: number, persona: Persona, teachingStyle: TeachingStyle) {
  const selected = question.options[selectedIndex];
  const correct = question.options.find(o => o.isCorrect) || question.options[0];
  const isCorrect = !!selected?.isCorrect;
  const verdict = isCorrect
    ? `Correct — ${correct.label} is right.`
    : `Not quite. You chose ${selected?.label}, but the answer is ${correct.label}: ${correct.text}.`;

  const prompt = [
    `Multiple-choice question: ${question.question}`,
    question.options.map(o => `${o.label}. ${o.text}`).join('\n'),
    `Correct answer: ${correct.label}. ${correct.text}`,
    question.explanation ? `Answer key explanation: ${question.explanation}` : '',
    isCorrect
      ? `The student chose ${correct.label}, the correct answer. They have already been told they are right.`
      : `The student chose ${selected?.label} ("${selected?.text}"), which is wrong. They have already been told the correct answer is ${correct.label}.`,
    '',
    isCorrect
      ? `In 2-3 sentences, explain why ${correct.label} is correct, using the answer key explanation.`
      : `In 2-3 sentences, explain why ${selected?.label} is wrong and why ${correct.label} is correct, using the answer key explanation.`
  ].filter(Boolean).join('\n');

  const messages: ChatTurn[] = [
    { role: 'system', content: systemPrompt(persona, teachingStyle) },
    { role: 'user', content: prompt }
  ];
  return { messages, verdict, isCorrect };
}

/** Streams the tutor's feedback on a quiz answer, prefixed with the answer-key verdict */
export async function generateQuizFeedback(
  question: QuizQuestion,
  selectedIndex: number,
  persona: Persona,
  teachingStyle: TeachingStyle,
  onToken?: (textSoFar: string) => void
) {
  const { messages, verdict, isCorrect } = buildQuizFeedbackMessages(question, selectedIndex, persona, teachingStyle);
  const result = await aiWorkerClient.generate(messages, {
    maxNewTokens: 160,
    temperature: 0.3,
    onToken: text => onToken?.(`${verdict}\n\n${text}`)
  });
  return { ...result, text: `${verdict}\n\n${result.text}`, isCorrect, model: modelLabel() };
}

/** Parses and validates the model's JSON multiple-choice question */
export function parseGeneratedQuiz(raw: string): { question: string; options: string[]; answerIndex: number; explanation: string } | null {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    const obj = JSON.parse(raw.slice(start, end + 1));
    const question = typeof obj.question === 'string' ? obj.question.trim() : '';
    const options: string[] = Array.isArray(obj.options)
      ? obj.options.map((o: unknown) => String(o).replace(/^[A-D][.)]\s*/, '').trim())
      : [];
    const answerIndex = ['A', 'B', 'C', 'D'].indexOf(String(obj.answer || '').trim().charAt(0).toUpperCase());
    const explanation = typeof obj.explanation === 'string' ? obj.explanation.trim() : '';
    const distinct = new Set(options.map(o => o.toLowerCase())).size === 4;
    if (question.length < 10 || options.length !== 4 || options.some(o => !o) || !distinct || answerIndex < 0) return null;
    return { question, options, answerIndex, explanation };
  } catch {
    return null;
  }
}

/**
 * Writes a multiple-choice question grounded in one course passage.
 * Returns null if the model doesn't produce a valid question after a retry.
 */
export async function generateGroundedQuiz(topic: string, passage: Passage, subject: SubjectId): Promise<QuizQuestion | null> {
  const messages: ChatTurn[] = [
    {
      role: 'user',
      content: [
        'Write one multiple-choice question that tests understanding of the passage below. Use only facts stated in the passage.',
        `Topic the student asked about: ${topic}`,
        '',
        `Passage (${passage.sourceTitle}${passage.section ? `, ${passage.section}` : ''}):`,
        truncate(passage.text, 1400),
        '',
        'Reply with only JSON in exactly this shape:',
        '{"question": "...", "options": ["...", "...", "...", "..."], "answer": "A", "explanation": "..."}',
        'Exactly one option is correct. "answer" is the letter A, B, C or D of the correct option.'
      ].join('\n')
    }
  ];

  for (const temperature of [0, 0.7]) {
    const { text } = await aiWorkerClient.generate(messages, { maxNewTokens: 320, temperature });
    const parsed = parseGeneratedQuiz(text);
    if (parsed) {
      return {
        id: `q-gen-${Date.now()}`,
        subject,
        topicId: passage.section || topic,
        type: 'conceptual',
        question: parsed.question,
        options: parsed.options.map((t, i) => ({ label: 'ABCD'[i], text: t, isCorrect: i === parsed.answerIndex })),
        explanation: parsed.explanation,
        passageId: passage.id,
        passageSnippet: passage.section,
        difficulty: 'medium',
        sourceTitle: `Written by ${CHAT_MODEL.label} from ${passage.sourceTitle}`,
        sourceId: passage.srcId
      };
    }
  }
  return null;
}

/**
 * Detect if user is asking about a specific question from an uploaded exam
 */
function detectExamQuestionTarget(
  query: string,
  sources: SourceDocument[]
): { question: QuizQuestion; source: SourceDocument } | null {
  const qLower = query.toLowerCase();
  const qNumMatch = qLower.match(/(?:question|q|problem|number|#)\s*(\d+)/i);
  const targetNum = qNumMatch ? parseInt(qNumMatch[1], 10) : null;

  const examSources = sources.filter(s => s.enabled && s.parsedQuestions && s.parsedQuestions.length > 0);

  if (!examSources.length) return null;

  for (const exam of examSources) {
    const questions = exam.parsedQuestions || [];
    if (targetNum !== null) {
      const match = questions.find(q =>
        q.originalQuestionNumber === targetNum ||
        q.id.endsWith(`-${targetNum}`) ||
        q.id.endsWith(`q${targetNum}`)
      );
      if (match) {
        return { question: match, source: exam };
      }
    }

    if (qLower.includes('exam') || qLower.includes('practice test') || qLower.includes('vault problem') || qLower.includes('practice problem')) {
      if (exam.kind === 'upload' || exam.id === 'chem-ap-vault') {
        return { question: questions[0], source: exam };
      }
    }
  }

  return null;
}

/**
 * Generate contextual follow-ups tailored to the active topic
 */
function generateContextualFollowUps(
  query: string,
  subject: string,
  sources: SourceDocument[],
  activeGoal?: string,
  resolvedTopic?: string
): string[] {
  const q = `${query} ${resolvedTopic || ''}`.toLowerCase();
  const uploadedExams = sources.filter(s => s.kind === 'upload' && s.parsedQuestions && s.parsedQuestions.length > 0);

  if (activeGoal && (q.includes('goal') || q.includes('plan') || q.includes('target') || q.includes('today'))) {
    return [
      `Quiz me on ${activeGoal.split(/[:(]/)[0].trim()}`,
      `What should I focus on first for this goal?`,
      `Review key formulas for this goal`,
      `What are common traps on this topic?`
    ];
  }

  if (uploadedExams.length > 0) {
    const exam = uploadedExams[0];
    return [
      `Quiz me on ${exam.shortTitle}`,
      'Explain Question 1 on the exam',
      'Explain Question 2 on the exam',
      'What are the key concepts on my exam?'
    ];
  }

  if (q.includes('anti-federalist') || q.includes('antifederalist') || (q.includes('oppose') && q.includes('ratif')) || q.includes('brutus')) {
    return [
      'How did Federalist 10 answer the Anti-Federalists?',
      'What was Brutus No. 1\'s main objection?',
      'Why was a Bill of Rights added in 1791?',
      'Quiz me on the Ratification Debates'
    ];
  }

  if (q.includes('constitutional') || q.includes('federalist') || q.includes('articles of confederation') || q.includes('shays')) {
    return [
      'Why did Anti-Federalists oppose ratification?',
      'Explain the Great Compromise vs 3/5 Compromise',
      'How did Shays\' Rebellion trigger the convention?',
      'Quiz me on the Constitutional Convention'
    ];
  }

  if (q.includes('le chatelier') || q.includes('equilibrium')) {
    return [
      'What happens if temperature increases in exothermic reactions?',
      'How does volume change affect gas moles?',
      'Why doesn\'t a catalyst shift equilibrium?',
      'Quiz me on Le Chatelier\'s principle'
    ];
  }

  if (q.includes('civil war') || q.includes('gettysburg') || q.includes('emancipation')) {
    return [
      'What caused Fort Sumter and secession?',
      'Why was the Battle of Gettysburg a turning point?',
      'Explain the Reconstruction Amendments (13th, 14th, 15th)',
      'Quiz me on the Civil War'
    ];
  }

  if (q.includes('parabola') || q.includes('quadratic') || q.includes('vertex')) {
    return [
      'Solve 2x² - 4x - 6 = 0',
      'How does "a" affect width and opening direction?',
      'Find the vertex of y = 2(x - 3)² + 5',
      'Quiz me on quadratic graphs'
    ];
  }

  if (q.includes('photosynthesis') || q.includes('calvin') || q.includes('chloroplast')) {
    return [
      'What happens during water photolysis?',
      'Why is RuBisCO so important?',
      'Compare ATP yield in photosynthesis vs respiration',
      'Quiz me on plant energetics'
    ];
  }

  if (q.includes('orbital') || q.includes('electron') || q.includes('bond') || q.includes('molar')) {
    return [
      'Calculate molar mass of H2SO4',
      'How do σ and π bonds differ?',
      'Calculate bond order for N₂',
      'Quiz me on chemical bonding'
    ];
  }

  if (subject === 'history') {
    return ['Explain the primary causes', 'What were the major turning points?', 'Examine primary documents', 'Quiz me on this topic'];
  } else if (subject === 'algebra') {
    return ['Solve 2x + 6 = 14', 'Simplify fraction 48/64', 'Graph this on the coordinate plane', 'Quiz me on this topic'];
  } else if (subject === 'biology') {
    return ['Trace the cellular mechanism', 'Cross Bb x Bb with Punnett square', 'Explain with an analogy', 'Quiz me on this topic'];
  } else {
    return ['Calculate molar mass of H2SO4', 'Check units and dimensional analysis', 'Show lab application', 'Quiz me on this topic'];
  }
}

export interface ContextUsage {
  usedTokens: number;
  windowTokens: number;
  pct: number;
  // Older messages are no longer sent with each question
  historyTrimmed: boolean;
}

/** How full the model's context window was for the latest answer in this chat */
export function contextUsage(messages: ChatMessage[]): ContextUsage | null {
  const last = [...messages].reverse().find(m => m.aiGenerated && m.metrics?.tokensIn);
  if (!last?.metrics) return null;
  const usedTokens = last.metrics.tokensIn + last.metrics.tokensOut;
  const conversational = messages.filter(m => (m.role === 'user' || m.role === 'persona') && m.text).length;
  return {
    usedTokens,
    windowTokens: CHAT_MODEL.contextWindow,
    pct: Math.min(100, Math.round((usedTokens / CHAT_MODEL.contextWindow) * 1000) / 10),
    historyTrimmed: conversational > MAX_HISTORY_TURNS + 1
  };
}

