import { Passage, QuizQuestion, SubjectId } from '../types';

export interface ParsedExamResult {
  isExam: boolean;
  questions: QuizQuestion[];
  detectedTopic: string;
  summary: string;
}

/**
 * Detect whether a document or file is an exam, test, or practice problem set
 */
export function isExamDocument(text: string, title: string): boolean {
  const titleLower = title.toLowerCase();
  const textSample = text.slice(0, 3000).toLowerCase();

  const titleSignals = [
    'exam', 'test', 'quiz', 'practice', 'midterm', 'final',
    'worksheet', 'assessment', 'ap_', 'sat_', 'psat', 'sample'
  ];

  if (titleSignals.some(s => titleLower.includes(s))) {
    return true;
  }

  // Count question markers in text
  const questionNumberMatches = text.match(/(?:^|\n)\s*(?:question\s*\d+|\d+[\.\)]|\bq\d+[\.\:])/gi);
  const mcqOptionMatches = text.match(/(?:^|\n)\s*(?:\([A-Da-d]\)|[A-Da-d][\.\)])\s+[A-Za-z0-9]/g);

  if ((questionNumberMatches && questionNumberMatches.length >= 2) ||
      (mcqOptionMatches && mcqOptionMatches.length >= 4) ||
      textSample.includes('multiple choice') ||
      textSample.includes('answer key') ||
      textSample.includes('select the best answer')) {
    return true;
  }

  return false;
}

/**
 * Parse an answer key section if present at the end or inline in the document
 * e.g., "Answer Key: 1. A, 2. B, 3. C" or "1: B\n2: C"
 */
function extractAnswerKeyMap(text: string): Map<number, string> {
  const keyMap = new Map<number, string>();

  // Look for dedicated Answer Key section
  const keySectionRegex = /(?:answer\s*key|solutions?|correct\s*answers?)[\s\:\-]+([\s\S]+)$/i;
  const sectionMatch = text.match(keySectionRegex);
  const searchBlock = sectionMatch ? sectionMatch[1] : text;

  // Pattern: 1. A or 1: B or 1) C or Q1: D
  const pairRegex = /(?:(?:question\s*|q)?(\d+)[\.\:\-\)]\s*\(?([A-Da-d])\)?)/gi;
  let match: RegExpExecArray | null;

  while ((match = pairRegex.exec(searchBlock)) !== null) {
    const qNum = parseInt(match[1], 10);
    const ansLetter = match[2].toUpperCase();
    if (qNum > 0 && !keyMap.has(qNum)) {
      keyMap.set(qNum, ansLetter);
    }
  }

  return keyMap;
}

/**
 * High-precision parser for student exam / practice questions from text or PDF
 */
export function parseExamQuestions(
  text: string,
  docId: string,
  docTitle: string,
  subject: SubjectId
): ParsedExamResult {
  const isExam = isExamDocument(text, docTitle);
  const questions: QuizQuestion[] = [];
  const answerKeyMap = extractAnswerKeyMap(text);

  // Normalize line endings
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into candidate blocks: Split by question numbers like "\n1. ", "\n2) ", "\nQuestion 3:"
  const rawBlocks = cleanText.split(/(?=(?:^|\n)\s*(?:question\s*\d+|\b\d{1,2}[\.\)]|\bq\d{1,2}[\.\:]))\s*/i);

  let qIndex = 1;

  for (const block of rawBlocks) {
    const trimmed = block.trim();
    if (trimmed.length < 25) continue;

    // Check if this block looks like a question
    const qHeaderMatch = trimmed.match(/^(?:question\s*(\d+)|\b(\d{1,2})[\.\)]|\bq(\d{1,2})[\.\:])\s*[:\.]?\s*([\s\S]+)/i);

    let qNum = qIndex;
    let questionBody = trimmed;

    if (qHeaderMatch) {
      qNum = parseInt(qHeaderMatch[1] || qHeaderMatch[2] || qHeaderMatch[3], 10) || qIndex;
      questionBody = qHeaderMatch[4] ? qHeaderMatch[4].trim() : trimmed;
    }

    // Extract options: A), B), C), D) or A. B. C. D. or (A) (B) (C) (D)
    const rawOptionsList: { letter: string; text: string }[] = [];
    const lines = questionBody.split('\n');
    let firstOptLineIndex = -1;

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li].trim();
      const optMatch = line.match(/^(?:\(?([A-Da-d])\)?[.\)]\s*|\b([A-Da-d])\.\s+)(.+)$/);
      if (optMatch) {
        if (firstOptLineIndex === -1) firstOptLineIndex = li;
        rawOptionsList.push({
          letter: (optMatch[1] || optMatch[2]).toUpperCase(),
          text: optMatch[3].trim()
        });
      }
    }

    let parsedStem = questionBody;
    let options: { label: string; text: string; isCorrect: boolean }[] = [];

    // Check if inline answer is specified in the question block, e.g. "Answer: B"
    const inlineAnsMatch = trimmed.match(/(?:answer|correct\s*option)[\s\:\-]+([A-Da-d])/i);
    const correctLetterFromInline = inlineAnsMatch ? inlineAnsMatch[1].toUpperCase() : null;
    const correctLetterFromKey = answerKeyMap.get(qNum) || null;
    const definitiveCorrectLetter = correctLetterFromInline || correctLetterFromKey;

    // Only questions with a stated answer (inline or in an answer key) become gradable practice
    // questions; guessing a key would grade students against a made-up answer
    if (rawOptionsList.length >= 2 && definitiveCorrectLetter) {
      if (firstOptLineIndex > 0) {
        parsedStem = lines.slice(0, firstOptLineIndex).join('\n').trim();
      } else {
        parsedStem = lines[0] || questionBody;
      }

      // Clean up question stem
      parsedStem = parsedStem.replace(/^(?:question\s*\d+[\.\:]?|\d+[\.\)])\s*/i, '').trim();

      // Ensure stem has content
      if (parsedStem.length < 5) {
        parsedStem = `Problem ${qNum}: Examine the provided options and select the correct answer:`;
      }

      const letterMap = ['A', 'B', 'C', 'D'];
      options = rawOptionsList.slice(0, 4).map((m, idx) => {
        const letter = (m.letter || letterMap[idx]).toUpperCase();
        let optText = m.text || '';
        optText = optText.replace(/(?:answer|explanation)[\s\:\-].*$/i, '').trim();
        return { label: letter, text: optText, isCorrect: letter === definitiveCorrectLetter };
      });

      // The stated answer must be one of the parsed options
      if (!options.some(o => o.isCorrect)) continue;

      // Extract any explanation text in block
      const explMatch = trimmed.match(/(?:explanation|rationale|solution)[\s\:\-]+([^\n]+)/i);
      const explanation = explMatch
        ? explMatch[1].trim()
        : `Drawn directly from Question ${qNum} in ${docTitle}. Review the question stem and source material for the complete concept.`;

      questions.push({
        id: `q-exam-${docId}-${qNum}`,
        subject,
        topicId: `Exam: ${docTitle}`,
        type: 'conceptual',
        question: `[Q${qNum}] ${parsedStem}`,
        options,
        explanation,
        passageId: `${docId}-q-${qNum}`,
        passageSnippet: trimmed.slice(0, 240),
        difficulty: 'medium',
        sourceTitle: docTitle,
        sourceId: docId,
        originalQuestionNumber: qNum
      });

      qIndex++;
    }
  }

  // Topic detection
  let detectedTopic = `${subject.toUpperCase()} Practice Exam`;
  if (cleanText.toLowerCase().includes('photosynthesis')) detectedTopic = 'Photosynthesis & Energetics';
  else if (cleanText.toLowerCase().includes('parabola') || cleanText.toLowerCase().includes('quadratic')) detectedTopic = 'Quadratic Functions';
  else if (cleanText.toLowerCase().includes('civil war')) detectedTopic = 'American Civil War & Reconstruction';
  else if (cleanText.toLowerCase().includes('stoichiometry')) detectedTopic = 'Stoichiometry & Mole Calculations';
  else if (cleanText.toLowerCase().includes('dna') || cleanText.toLowerCase().includes('genetics')) detectedTopic = 'Molecular Genetics';

  return {
    isExam: questions.length > 0 || isExam,
    questions,
    detectedTopic,
    summary: questions.length > 0
      ? `Successfully extracted ${questions.length} questions from ${docTitle}. Ready for interactive quizzes with instant tutor guidance.`
      : `Indexed ${docTitle} into local vector memory for contextual tutoring.`
  };
}

/**
 * Intelligent chunker that keeps exam questions together in intact passages
 */
export function chunkDocumentPreservingQuestions(
  text: string,
  docId: string,
  docTitle: string,
  subject: SubjectId,
  parsedQuestions: QuizQuestion[]
): Passage[] {
  const passages: Passage[] = [];

  // 1. If questions were parsed, create a dedicated passage for each question
  // This guarantees that vector search for "Question 1" or question concepts matches cleanly!
  if (parsedQuestions.length > 0) {
    parsedQuestions.forEach((q, idx) => {
      const qPassageText = `${q.question}\nOptions:\n${q.options.map(o => `${o.label}) ${o.text}`).join('\n')}\nExplanation: ${q.explanation}`;
      passages.push({
        id: `${docId}-q-${idx + 1}`,
        subject,
        srcId: docId,
        sourceTitle: docTitle,
        section: `Question ${q.originalQuestionNumber || idx + 1}`,
        text: qPassageText,
        tokens: Math.round(qPassageText.length / 4),
        category: 'Practice Exam Question'
      });
    });
  }

  // 2. Also chunk the general text for broad RAG retrieval
  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 30);

  let currentWords: string[] = [];
  let chunkIndex = 1;

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (currentWords.length + words.length > 120 && currentWords.length > 25) {
      const chunkText = currentWords.join(' ');
      passages.push({
        id: `${docId}-chunk-${chunkIndex}`,
        subject,
        srcId: docId,
        sourceTitle: docTitle,
        section: `Section ${chunkIndex}`,
        text: chunkText,
        tokens: Math.round(chunkText.length / 4),
        category: 'Study Material'
      });
      chunkIndex++;
      currentWords = currentWords.slice(Math.floor(currentWords.length * 0.75));
    }
    currentWords.push(...words);
  }

  if (currentWords.length > 10) {
    const chunkText = currentWords.join(' ');
    passages.push({
      id: `${docId}-chunk-${chunkIndex}`,
      subject,
      srcId: docId,
      sourceTitle: docTitle,
      section: `Section ${chunkIndex}`,
      text: chunkText,
      tokens: Math.round(chunkText.length / 4),
      category: 'Study Material'
    });
  }

  return passages;
}
