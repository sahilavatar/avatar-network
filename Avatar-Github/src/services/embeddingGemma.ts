import { Passage, SubjectId } from '../types';

export interface VectorSearchResult {
  passage: Passage;
  // Hybrid score: semantic similarity plus keyword/title/intent boosts (used for ranking)
  similarity: number;
  // Pure EmbeddingGemma cosine similarity (used for relevance decisions)
  semanticSimilarity: number;
  tokens: number;
  matchedTerms: string[];
}

export interface RetrievalResult {
  hits: VectorSearchResult[];
  totalSearched: number;
  latencyMs: number;
  model: string;
  dimension: number;
}

// Stopwords to filter out noise
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are', 'was', 'were',
  'be', 'been', 'it', 'its', 'this', 'that', 'these', 'those', 'as', 'at', 'by', 'from', 'how', 'what',
  'why', 'when', 'where', 'which', 'who', 'does', 'do', 'did', 'can', 'could', 'would', 'should',
  'me', 'my', 'you', 'your', 'i', 'about', 'explain', 'tell', 'define', 'describe', 'give', 'show',
  'between', 'into', 'than', 'then', 'so', 'if', 'not', 'no', 'have', 'has', 'had', 'will', 'we', 'our'
]);

/**
 * Tokenize and normalize text into clean terms and subwords
 */
export function extractKeywords(text: string): string[] {
  const clean = text.toLowerCase().replace(/[^a-z0-9α-ω\-]/g, ' ');
  const raw = clean.split(/\s+/).filter(Boolean);
  const terms: string[] = [];

  for (const w of raw) {
    if (w.length > 2 && !STOPWORDS.has(w)) {
      terms.push(w);
    }
  }
  return terms;
}

/**
 * Calculate cosine similarity between two normalized vectors
 */
export function cosineSimilarity(u: number[], v: number[]): number {
  if (u.length !== v.length) return 0;
  let dot = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
  }
  return Math.max(0, Math.min(1, dot));
}

import { DOMAIN_RAG_REGISTRY } from './chemistryRagOptimizer';
import { embedQuery, getPassageVectors } from './embeddingCache';
import { EMBEDDING_MODEL } from './modelConfig';

/**
 * Retrieve the most relevant passages with EmbeddingGemma vectors, re-ranked by keyword and intent signals
 */
export async function searchVectorIndex(
  query: string,
  passages: Passage[],
  subject?: SubjectId,
  topK: number = 3
): Promise<RetrievalResult> {
  const startTime = performance.now();
  const domainRules = subject ? DOMAIN_RAG_REGISTRY[subject] : undefined;
  const domainNorm = domainRules ? domainRules.normalizeQuery(query) : null;
  const effectiveQuery = domainNorm ? domainNorm.cleanQuery : query;

  const eligible = subject ? passages.filter(p => p.subject === subject) : passages;
  const [queryVector, passageVectors] = await Promise.all([embedQuery(effectiveQuery), getPassageVectors(eligible)]);
  const baseTerms = extractKeywords(query);
  const queryTerms = domainNorm
    ? Array.from(new Set([...baseTerms, ...domainNorm.expandedTerms]))
    : baseTerms;

  const scored: VectorSearchResult[] = eligible.map(passage => {
    const passageVec = passageVectors.get(passage.id);
    const sim = passageVec ? cosineSimilarity(queryVector, passageVec) : 0;

    // Track matched terms across passage text, document title, and section
    const textLower = passage.text.toLowerCase();
    const titleLower = (passage.sourceTitle || '').toLowerCase();
    const sectionLower = (passage.section || '').toLowerCase();
    const fullContent = `${textLower} ${titleLower} ${sectionLower}`;
    const matched = queryTerms.filter(t => fullContent.includes(t));

    // Boost if query explicitly targets the document title (e.g., "practice exam", "pedagogy")
    const titleMatches = queryTerms.filter(t => titleLower.includes(t)).length;
    const titleBoost = titleMatches >= 1 ? Math.min(0.45, titleMatches * 0.15) : 0;

    // Check for question number targeting (e.g. "Question 1", "Q2", "Problem 45")
    const qNumMatch = query.match(/(?:question|q|problem|#)\s*(\d+)/i);
    let questionTargetBoost = 0;
    if (qNumMatch) {
      const qNum = qNumMatch[1];
      if (
        sectionLower.includes(`question ${qNum}`) ||
        textLower.includes(`[q${qNum}]`) ||
        textLower.includes(`question ${qNum}`) ||
        textLower.includes(`problem #${qNum}`) ||
        passage.id.endsWith(`-q${qNum}`)
      ) {
        questionTargetBoost = 0.55;
      }
    }

    // Boost if user says "it", "my exam", "the exam", "practice exam", "vault" and passage is from uploaded material
    const queryLower = query.toLowerCase();
    let uploadPreferenceBoost = 0;
    const isUploadPassage = passage.srcId.startsWith('up-') || passage.category === 'Practice Exam Question' || passage.category === 'Uploaded Material';
    if (isUploadPassage && (queryLower.includes('exam') || queryLower.includes('vault') || queryLower.includes('upload') || queryLower.includes('it') || queryLower.includes('quiz me') || queryLower.includes('my test') || queryLower.includes('practice'))) {
      uploadPreferenceBoost = 0.35;
    }

    // Domain-specific chemical & pedagogical intelligence boost
    const domainBoost = domainRules ? domainRules.calculateDomainBoost(query, passage, queryTerms) : 0;

    // Hybrid score boost if exact key terms are present
    const keywordBoost = Math.min(0.2, matched.length * 0.04);
    const combinedSimilarity = Math.min(0.99, sim + keywordBoost + titleBoost + questionTargetBoost + uploadPreferenceBoost + domainBoost);

    return {
      passage,
      similarity: combinedSimilarity,
      semanticSimilarity: sim,
      tokens: passage.tokens,
      matchedTerms: matched
    };
  });

  // Sort descending by similarity
  scored.sort((a, b) => b.similarity - a.similarity);

  const topHits = scored.slice(0, topK);
  const latencyMs = Math.round(performance.now() - startTime);

  return {
    hits: topHits,
    totalSearched: eligible.length,
    latencyMs: Math.max(1, latencyMs),
    model: EMBEDDING_MODEL.label,
    dimension: EMBEDDING_MODEL.dimension
  };
}
