import { Passage } from '../types';
import { extractKeywords } from './embeddingGemma';

/**
 * Split text into discrete, semantically intact sentences
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  // Clean markdown noise and split by sentence terminators
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\n+/g, ' ');
  const rawSentences = cleaned.split(/(?<=[.?!])\s+(?=[A-Z0-9"'])/);
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 20);
}

export interface ExtractedSnippet {
  text: string;
  tokenCount: number;
  relevanceScore: number;
  sentenceCount: number;
  sourceTitle: string;
  section?: string;
  passageId: string;
}

/**
 * High-Precision Client-Side Snippet Pinpointer
 * Extracts the exact top 1-2 most relevant sentences (<80 tokens) from retrieved passages.
 * Scores sentences lexically: embedding every sentence on device would cost far more than it adds here.
 */
export function extractPinpointSnippet(
  query: string,
  passage: Passage,
  maxTokens: number = 80
): ExtractedSnippet {
  const queryWords = extractKeywords(query);
  const sentences = splitIntoSentences(passage.text);

  if (sentences.length === 0) {
    const fallbackText = passage.text.slice(0, 220);
    return {
      text: fallbackText,
      tokenCount: Math.round(fallbackText.length / 4),
      relevanceScore: 0.8,
      sentenceCount: 1,
      sourceTitle: passage.sourceTitle,
      section: passage.section,
      passageId: passage.id
    };
  }

  // Score each individual sentence
  const scoredSentences = sentences.map((sentence, idx) => {
    const sLower = sentence.toLowerCase();

    // 1. Lexical BM25-style keyword overlap
    let lexicalMatches = 0;
    queryWords.forEach(w => {
      if (sLower.includes(w)) lexicalMatches++;
    });
    const lexicalScore = queryWords.length > 0 ? lexicalMatches / queryWords.length : 0;

    // 2. Positional prior (first sentence of paragraph often contains topic sentence)
    const positionBoost = idx === 0 ? 0.08 : 0;

    const totalScore = lexicalScore + positionBoost;

    return {
      sentence,
      index: idx,
      score: totalScore,
      tokens: Math.round(sentence.length / 4)
    };
  });

  // Sort descending by relevance score
  scoredSentences.sort((a, b) => b.score - a.score);

  const best = scoredSentences[0];
  const selected: typeof scoredSentences = [best];
  let accumulatedTokens = best.tokens;

  // Attempt to attach an adjacent sentence if within maxTokens limit (for coherent 1-2 sentence context)
  const adjacent = scoredSentences.find(s => 
    s.index !== best.index && 
    Math.abs(s.index - best.index) === 1 && 
    (accumulatedTokens + s.tokens) <= maxTokens
  );

  if (adjacent) {
    selected.push(adjacent);
    accumulatedTokens += adjacent.tokens;
  }

  // Maintain original reading order
  selected.sort((a, b) => a.index - b.index);
  const snippetText = selected.map(s => s.sentence).join(' ');

  return {
    text: snippetText,
    tokenCount: accumulatedTokens,
    relevanceScore: best.score,
    sentenceCount: selected.length,
    sourceTitle: passage.sourceTitle,
    section: passage.section,
    passageId: passage.id
  };
}

/**
 * Strict Topic Matching Engine
 * Prevents false positives (e.g. matching "American" to Progressive Era when query is "American Revolution")
 */
export interface TopicMatchResult {
  isStrictMatch: boolean;
  matchedTopic: string;
  confidence: number;
}

// Canonical curriculum topic phrases for high-confidence strict matching
export const STRICT_TOPIC_REGISTRY: Record<string, string[]> = {
  'american revolution': [
    'american revolution', 'revolutionary war', 'stamp act', 'boston tea party',
    'declaration of independence', 'lexington and concord', 'saratoga', 'yorktown',
    'continental congress', 'george washington', 'thomas paine', 'common sense',
    'treaty of paris 1783', 'articles of confederation', 'intolerable acts'
  ],
  'us constitution': [
    'constitutional convention', '1787 constitution', 'great compromise',
    'three-fifths compromise', 'bill of rights', 'federalist papers',
    'separation of powers', 'checks and balances', 'james madison'
  ],
  'progressive era': [
    'progressive era', '17th amendment', '16th amendment', '19th amendment',
    'muckrakers', 'trust busting', 'theodore roosevelt', 'woodrow wilson',
    'pure food and drug act', 'settlement houses'
  ],
  'civil war': [
    'civil war', 'emancipation proclamation', 'gettysburg', 'fort sumter',
    'vicksburg', 'abraham lincoln', 'confederate', 'secession', 'antietam'
  ],
  'photosynthesis': [
    'photosynthesis', 'calvin cycle', 'light reaction', 'thylakoid',
    'chloroplast', 'rubisco', 'photosystem', 'photolysis', 'stroma'
  ],
  'cellular respiration': [
    'cellular respiration', 'glycolysis', 'krebs cycle', 'citric acid cycle',
    'electron transport chain', 'atp synthase', 'mitochondria', 'chemiosmosis'
  ],
  'genetics': [
    'mendelian', 'punnett square', 'meiosis', 'allele', 'dominant', 'recessive',
    'dna replication', 'transcription', 'translation', 'mrna', 'codon'
  ],
  'quadratic equations': [
    'quadratic formula', 'discriminant', 'parabola', 'vertex form',
    'factoring quadratics', 'completing the square', 'axis of symmetry'
  ],
  'linear equations': [
    'linear equation', 'slope-intercept', 'rate of change', 'system of equations',
    'point-slope form', 'y-intercept', 'parallel lines'
  ]
};

/**
 * Checks if a user query strictly matches a specific topic registry entry
 */
export function matchStrictTopic(query: string, candidateText: string): TopicMatchResult {
  const qLower = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const cLower = candidateText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

  for (const [topicKey, keywords] of Object.entries(STRICT_TOPIC_REGISTRY)) {
    // Check if query targets this topic
    const queryMatchesTopic = keywords.some(kw => qLower.includes(kw)) || qLower.includes(topicKey);
    if (!queryMatchesTopic) continue;

    // Check if candidate text matches the SAME topic
    const candidateMatchesTopic = keywords.some(kw => cLower.includes(kw)) || cLower.includes(topicKey);

    if (candidateMatchesTopic) {
      return {
        isStrictMatch: true,
        matchedTopic: topicKey,
        confidence: 0.95
      };
    } else {
      // Query wanted this topic, but candidate text is about something else
      return {
        isStrictMatch: false,
        matchedTopic: topicKey,
        confidence: 0.1
      };
    }
  }

  // Fallback to n-gram phrase matching
  const qWords = qLower.split(/\s+/).filter(w => w.length > 3);
  if (qWords.length >= 2) {
    const twoWordPhrase = `${qWords[0]} ${qWords[1]}`;
    if (cLower.includes(twoWordPhrase)) {
      return {
        isStrictMatch: true,
        matchedTopic: twoWordPhrase,
        confidence: 0.85
      };
    }
  }

  return {
    isStrictMatch: false,
    matchedTopic: 'general',
    confidence: 0.5
  };
}

/**
 * Extracts a clean, high-level topic title from user inputs or UI prompts.
 * Strips robotic prefixes like "Let's start today's focus on our target goal:".
 */
function toAcademicTitleCase(str: string): string {
  if (!str) return '';
  const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'vs', 'versus']);
  return str.split(/\s+/).map((word, idx) => {
    const lower = word.toLowerCase();
    if (lower.includes('-')) {
      return lower.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
    }
    if (idx > 0 && smallWords.has(lower)) {
      return lower;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export function extractCleanTopicTitle(query: string, fallbackTopic?: string): string {
  if (!query) return fallbackTopic || 'Core Concept';

  let clean = query.trim();
  clean = clean.replace(/^["'`]+|["'`]+$/g, '');

  const prefixes = [
    /^let's\s+start\s+today's\s+focus\s+on\s+our\s+target\s+goal:\s*/i,
    /^today's\s+focus\s+on\s+our\s+target\s+goal:\s*/i,
    /^target\s+goal:\s*/i,
    /^let's\s+start\s+today's\s+focus\s+on\s*/i,
    /^let's\s+focus\s+on:\s*/i,
    /^let's\s+focus\s+on\s*/i,
    /^focus\s+on:\s*/i,
    /^let's\s+work\s+on:\s*/i,
    /^let's\s+work\s+on\s*/i,
    /^let's\s+review:\s*/i,
    /^let's\s+review\s*/i,
    /^can\s+you\s+explain\s+to\s+me\s*/i,
    /^can\s+you\s+explain\s*/i,
    /^could\s+you\s+explain\s*/i,
    /^please\s+explain\s*/i,
    /^explain\s+to\s+me\s*/i,
    /^explain\s*/i,
    /^tell\s+me\s+about\s*/i,
    /^what\s+is\s+the\s*/i,
    /^what\s+is\s*/i,
    /^what\s+was\s+the\s*/i,
    /^what\s+was\s*/i,
    /^what\s+are\s+the\s*/i,
    /^what\s+are\s*/i,
    /^how\s+does\s+the\s*/i,
    /^how\s+does\s*/i,
    /^how\s+do\s*/i,
    /^why\s+did\s+the\s*/i,
    /^why\s+did\s*/i,
    /^why\s+do\s*/i,
    /^why\s+does\s*/i,
    /^why\s+is\s*/i,
    /^why\s+was\s*/i,
    /^why\s+were\s*/i,
    /^who\s+were\s+the\s*/i,
    /^who\s+was\s*/i,
    /^review\s+key\s+formulas\s+for\s*/i,
    /^review\s+key\s+concepts\s+for\s*/i
  ];

  for (const prefix of prefixes) {
    clean = clean.replace(prefix, '');
  }

  clean = clean.replace(/[?:!.]+$/, '').trim();

  // If clean became trivial or empty, use fallback
  if (!clean || clean.length < 3 || /^(this|that|it|this concept|more depth|concept)$/i.test(clean)) {
    return fallbackTopic || 'Core Concept';
  }

  return toAcademicTitleCase(clean);
}

/**
 * Checks whether a user message is an anaphoric follow-up, elaboration, or deep-dive request.
 */
export function isFollowUpOrDeepDiveQuery(query: string): {
  isFollowUp: boolean;
  isDeepDive: boolean;
  intent: 'deep-dive' | 'follow-up' | 'standard';
} {
  const q = query.trim().toLowerCase();

  const deepDiveRegexes = [
    /\b(explain\s+(this|it|that|the)?\s*concept\s+in\s+more\s+depth)\b/i,
    /\b(in\s+more\s+depth)\b/i,
    /\b(explain\s+in\s+(more\s+)?depth)\b/i,
    /\b(go\s+deeper)\b/i,
    /\b(tell\s+me\s+more(\s+about\s+(this|that|it))?)\b/i,
    /\b(elaborate(\s+on\s+(this|that|it))?)\b/i,
    /\b(can\s+you\s+elaborate)\b/i,
    /\b(more\s+details?)\b/i,
    /\b(explain\s+the\s+primary\s+causes)\b/i,
    /\b(what\s+were\s+the\s+major\s+turning\s+points)\b/i,
    /\b(examine\s+primary\s+documents)\b/i,
    /\b(give\s+(me\s+)?an?\s+example(\s+of\s+this)?)\b/i,
    /\b(why\s+did\s+(that|this)\s+happen)\b/i,
    /\b(how\s+did\s+(that|this)\s+work)\b/i,
    /\b(what\s+happened\s+next)\b/i,
  ];

  for (const regex of deepDiveRegexes) {
    if (regex.test(q)) {
      return { isFollowUp: true, isDeepDive: true, intent: 'deep-dive' };
    }
  }

  // Check for short queries with pronouns and no specific subject nouns
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length <= 6) {
    const hasDemonstrative = /\b(this|that|it|these|those)\b/i.test(q);
    const hasGenericContinuation = /\b(why|how|what|explain|more|detail|concept|elaborate|continue)\b/i.test(q);
    if (hasDemonstrative && hasGenericContinuation) {
      return { isFollowUp: true, isDeepDive: true, intent: 'deep-dive' };
    }
    if (/^(why\?|why\b|how\?|how come\?|and then\?|what else\?|tell me more\??)$/i.test(q)) {
      return { isFollowUp: true, isDeepDive: true, intent: 'deep-dive' };
    }
  }

  return { isFollowUp: false, isDeepDive: false, intent: 'standard' };
}

/**
 * Resolves conversational context and anaphora.
 * When a student asks a follow-up question, requests deeper explanation,
 * or inquires about a specific detail mentioned in a prior turn,
 * this anchors vector retrieval and topic continuity to the ongoing educational dialogue.
 */
const CLARIFICATION_PATTERNS = [
  /\b(?:do\s*n[o']?t|dont|do not|still don'?t)\s+(?:understand|get\s+it|get\s+that|follow)\b/i,
  /\bconfus(?:ed|ing)\b/i,
  /\bwhat\s+do(?:es)?\s+(?:you|that|it|this)\s+mean\b/i,
  /\b(?:explain|say|put)\s+(?:it|that|this)\s+(?:again|differently|another\s+way|more\s+simply|simpler)\b/i,
  /\b(?:simpler|more\s+simply|in\s+simple\s+terms|plain\s+english|eli5|dumb\s+it\s+down)\b/i,
  /\b(?:can|could)\s+you\s+clarify\b/i,
  /\bi'?m\s+(?:lost|confused)\b/i,
  /\bmakes?\s+no\s+sense\b/i,
  /^\s*(?:huh|what|wdym|\?+)\s*\??\s*$/i
];

/** "I don't understand", "explain that more simply"…: about the previous answer, not a new topic */
export function isClarificationRequest(query: string): boolean {
  return CLARIFICATION_PATTERNS.some((re) => re.test(query));
}

export function resolveConversationalContext(
  userText: string,
  history: Array<{ role: string; text: string; citations?: any[]; quizData?: any }>,
  activeGoal?: { title: string; customInstructions?: string } | null,
  activePassages?: Passage[]
): {
  resolvedSearchQuery: string;
  anchorTopic: string;
  isFollowUp: boolean;
  isDeepDive: boolean;
  // Asks to re-explain the previous answer; searched with the previous question instead of its own words
  isClarification: boolean;
  cleanUserQuery: string;
} {
  const followUpCheck = isFollowUpOrDeepDiveQuery(userText);
  const cleanTitle = extractCleanTopicTitle(userText);

  // 1. Traverse conversation backwards to extract the active anchor concept and previous explanation
  let anchorTopic = '';
  let lastPersonaText = '';

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];

    if (!lastPersonaText && msg.role === 'persona' && msg.text) {
      lastPersonaText = msg.text;
    }

    // A. If previous message had citations, look up the cited passage
    if (msg.citations && msg.citations.length > 0 && activePassages && !anchorTopic) {
      const citedPassageId = msg.citations[0].passageId;
      const foundPassage = activePassages.find(p => p.id === citedPassageId);
      if (foundPassage) {
        anchorTopic = foundPassage.section
          ? foundPassage.section.replace(/^§\d+(\.\d+)*\s*/, '')
          : foundPassage.sourceTitle;
      }
    }

    // B. Check for markdown headers in previous persona text (e.g. ### Constitutional Convention)
    if (!anchorTopic) {
      const headerMatch = msg.text.match(/###\s+([^\n\r#]+)/);
      if (headerMatch && headerMatch[1]) {
        const candidate = headerMatch[1].replace(/·.*$/, '').trim();
        if (candidate.length > 3 && !candidate.toLowerCase().includes('practice question')) {
          anchorTopic = candidate;
        }
      }
    }

    // C. Check for specific unit or curriculum labels in previous message text
    if (!anchorTopic) {
      const unitMatch = msg.text.match(/(?:Unit \d+:|target goal:)\s*([^\n\r.]+)/i);
      if (unitMatch && unitMatch[1]) {
        const candidate = unitMatch[1].trim();
        if (candidate.length > 5) {
          anchorTopic = candidate;
        }
      }
    }

    // D. Check for known historical / scientific anchor topics in text
    if (!anchorTopic) {
      const lowerText = msg.text.toLowerCase();
      if (lowerText.includes('constitutional convention') || lowerText.includes('federalist')) {
        anchorTopic = 'Constitutional Convention of 1787 & Federalist Debates';
      } else if (lowerText.includes('shays') || lowerText.includes('articles of confederation')) {
        anchorTopic = 'Articles of Confederation & Shays\' Rebellion';
      } else if (lowerText.includes('photosynthesis') || lowerText.includes('calvin cycle')) {
        anchorTopic = 'Photosynthesis & The Calvin Cycle';
      } else if (lowerText.includes('cellular respiration') || lowerText.includes('krebs')) {
        anchorTopic = 'Cellular Respiration & ATP Synthesis';
      } else if (lowerText.includes('quadratic') || lowerText.includes('parabola')) {
        anchorTopic = 'Quadratic Functions & Discriminant';
      } else if (lowerText.includes('civil war') || lowerText.includes('gettysburg')) {
        anchorTopic = 'American Civil War & Emancipation Proclamation';
      }
    }
  }

  // If still empty, fall back to activeGoal or general curriculum
  if (!anchorTopic && activeGoal) {
    anchorTopic = activeGoal.title.split(':')[0].trim();
  }

  // 2. Determine if the current query is an explicit deep dive, anaphoric follow-up, OR a topical follow-up question
  const qLower = userText.toLowerCase().trim();
  const lastPersonaLower = lastPersonaText.toLowerCase();

  // Check if query shares conceptual terms with the recent persona explanation
  const queryTerms = qLower.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  let mentionsPriorContext = false;
  if (lastPersonaLower && queryTerms.length > 0) {
    const overlapping = queryTerms.filter(t => lastPersonaLower.includes(t));
    if (overlapping.length >= 1) {
      mentionsPriorContext = true;
    }
  }

  const isQuestion = /\b(why|how|what|explain|tell|who|when|where|which|did|does|is|are|can|could|oppose|causes?)\b/i.test(qLower) || qLower.includes('?');
  const isTopicalFollowUp = followUpCheck.isFollowUp || (!!anchorTopic && (mentionsPriorContext || isQuestion));

  // Synthesize enriched query specifically for vector retrieval
  let resolvedSearchQuery = cleanTitle;
  if (anchorTopic) {
    if (followUpCheck.isDeepDive) {
      resolvedSearchQuery = `${anchorTopic} ${cleanTitle} causes debate compromises primary source analysis mechanisms`.trim();
    } else if (isTopicalFollowUp) {
      resolvedSearchQuery = `${cleanTitle} ${anchorTopic}`.trim();
    }
  }

  // "I don't understand" has no topic words of its own: search with the question being clarified
  const isClarification = isClarificationRequest(userText);
  if (isClarification) {
    const previousQuestion = [...history].reverse().find((m) => m.role === 'user' && m.text?.trim())?.text ?? '';
    resolvedSearchQuery = `${previousQuestion} ${anchorTopic}`.trim() || resolvedSearchQuery;
  }

  return {
    resolvedSearchQuery,
    anchorTopic: anchorTopic || cleanTitle,
    isFollowUp: isTopicalFollowUp || isClarification,
    isDeepDive: followUpCheck.isDeepDive,
    isClarification,
    cleanUserQuery: cleanTitle
  };
}

