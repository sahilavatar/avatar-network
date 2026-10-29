import { QuizQuestion, TopicMastery, TeachingStyle } from '../types';

const STORAGE_KEY = 'lumen_progress_v1';

const topicTitle = (q: QuizQuestion) =>
  q.passageSnippet?.trim() ||
  q.topicId
    .replace(/^[a-z]+-(u\d+-)?/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/** Records one answered question, adding the topic if the student hasn't practiced it before */
export function recordAnswer(topics: TopicMastery[], question: QuizQuestion, isCorrect: boolean): TopicMastery[] {
  const existing = topics.find((t) => t.topicId === question.topicId);
  const base: TopicMastery = existing ?? {
    topicId: question.topicId,
    subject: question.subject,
    title: topicTitle(question),
    attempts: 0,
    correct: 0,
    accuracy: 0,
    lastPracticed: 'Not yet',
    status: 'new',
    recommendedAction: ''
  };

  const attempts = base.attempts + 1;
  const correct = base.correct + (isCorrect ? 1 : 0);
  const accuracy = Math.round((correct / attempts) * 100) / 100;
  const updated: TopicMastery = {
    ...base,
    attempts,
    correct,
    accuracy,
    lastPracticed: new Date().toLocaleDateString(),
    status: accuracy >= 0.8 ? 'mastered' : accuracy < 0.6 ? 'struggling' : 'review_needed'
  };

  return existing ? topics.map((t) => (t.topicId === question.topicId ? updated : t)) : [...topics, updated];
}

/** Adapts the teaching style to real results; defaults to guided before any practice */
export function accuracyForStyle(topics: TopicMastery[]): number {
  const practiced = topics.filter((t) => t.attempts > 0);
  if (practiced.length === 0) return 0.75;
  const attempts = practiced.reduce((sum, t) => sum + t.attempts, 0);
  const correct = practiced.reduce((sum, t) => sum + t.correct, 0);
  return correct / attempts;
}

export function loadProgress<T>(fallback: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as T;
  } catch {
    // Unreadable or unavailable storage: start fresh
  }
  return fallback;
}

export function saveProgress(progress: unknown) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable; progress stays in memory for this visit
  }
}

export type { TeachingStyle };
