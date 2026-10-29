/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
  asksAboutOwnNotes,
  buildQuizFeedbackMessages,
  buildTutorMessages,
  parseGeneratedQuiz,
  RELEVANCE_THRESHOLD,
  selectRelevantHits,
  toAlternatingTurns
} from './gemmaGeneration';
import { EXPERT_PERSONAS } from '../data/curriculumData';
import type { Passage, QuizQuestion } from '../types';
import type { RetrievalResult } from './embeddingGemma';

const passage = (id: string, text: string): Passage => ({
  id,
  subject: 'history',
  srcId: 'src',
  sourceTitle: 'Civics Archive',
  section: `§${id}`,
  text,
  tokens: 10
});

const retrieval = (scores: number[]): RetrievalResult => ({
  hits: scores.map((s, i) => ({ passage: passage(`p${i}`, `text ${i}`), similarity: s, semanticSimilarity: s, tokens: 10, matchedTerms: [] })),
  totalSearched: scores.length,
  latencyMs: 1,
  model: 'test',
  dimension: 256
});

describe('selectRelevantHits', () => {
  test('keeps only passages above the calibrated threshold', () => {
    const hits = selectRelevantHits(retrieval([0.7, RELEVANCE_THRESHOLD + 0.01, 0.3]));
    expect(hits.map((h) => h.passage.id)).toEqual(['p0', 'p1']);
  });

  test('keeps explicitly targeted passages even with low semantic similarity', () => {
    const r = retrieval([0.2]);
    r.hits[0].similarity = 0.8; // e.g. "question 3" of an uploaded exam
    expect(selectRelevantHits(r)).toHaveLength(1);
  });
});

describe('toAlternatingTurns', () => {
  test('starts with the user, alternates, and drops quiz/system messages', () => {
    const turns = toAlternatingTurns([
      { role: 'persona', text: 'Welcome!' },
      { role: 'user', text: 'Q1' },
      { role: 'user', text: 'Q1 again' },
      { role: 'quiz', text: 'Practice Question' },
      { role: 'persona', text: 'A1' },
      { role: 'user', text: 'Q2' }
    ]);
    expect(turns.map((t) => t.role)).toEqual(['user', 'assistant']);
    expect(turns[0].content).toBe('Q1\n\nQ1 again');
  });
});

describe('buildTutorMessages', () => {
  const persona = EXPERT_PERSONAS.history;

  test('labels course notes as not written by the student and asks for citations', () => {
    const r = retrieval([0.7]);
    const messages = buildTutorMessages({ query: 'Why?', persona, retrieval: r, teachingStyle: 'guided' }, selectRelevantHits(r));
    const last = messages[messages.length - 1].content;
    expect(messages[0].role).toBe('system');
    expect(last.startsWith('Question from the student: Why?')).toBe(true);
    expect(last).toContain('the student did not write these');
    expect(last).toContain('[1] Civics Archive');
    expect(last).toContain('citing the notes');
  });

  test('with a calculator result, asks only for the idea behind the method', () => {
    const r = retrieval([0.7, 0.6]);
    const messages = buildTutorMessages(
      {
        query: 'Solve 2x + 6 = 14',
        persona,
        retrieval: r,
        teachingStyle: 'guided',
        toolExecution: { toolName: 'Linear', badge: '', input: '', result: 'x = 4', steps: ['2x = 8', 'x = 4'], explanation: '' }
      },
      selectRelevantHits(r)
    );
    const last = messages[messages.length - 1].content;
    expect(last).toContain('x = 4');
    expect(last).toContain('Do not do any calculations yourself');
    expect(last).not.toContain('[2]');
  });

  test('with no notes uploaded, tells the model not to describe any', () => {
    const r = retrieval([]);
    const messages = buildTutorMessages(
      { query: 'What is in my notes?', persona, retrieval: r, teachingStyle: 'guided', notebook: { passages: 0, titles: [] } },
      []
    );
    const last = messages[messages.length - 1].content;
    expect(last).toContain('has not added any notes');
    expect(last).not.toContain('citing the notes');
  });

  test('when notes exist but none match, names them and asks for a plain admission', () => {
    const r = retrieval([0.2]);
    const messages = buildTutorMessages(
      { query: 'What is mitosis?', persona, retrieval: r, teachingStyle: 'guided', notebook: { passages: 12, titles: ['unit3.pdf'] } },
      selectRelevantHits(r)
    );
    const last = messages[messages.length - 1].content;
    expect(last).toContain("None of the student's notes (unit3.pdf) cover this question");
  });
});

describe('asksAboutOwnNotes', () => {
  test('matches questions about the student\'s uploads', () => {
    expect(asksAboutOwnNotes('What is in my notes?')).toBe(true);
    expect(asksAboutOwnNotes('Summarize the uploaded PDF')).toBe(true);
    expect(asksAboutOwnNotes('Quiz me on these handouts')).toBe(true);
  });
  test('ignores ordinary questions', () => {
    expect(asksAboutOwnNotes('What caused the French Revolution?')).toBe(false);
    expect(asksAboutOwnNotes('Explain musical notes')).toBe(false);
  });
});

describe('buildQuizFeedbackMessages', () => {
  const question: QuizQuestion = {
    id: 'q',
    subject: 'biology',
    topicId: 'bio-u1-x',
    type: 'conceptual',
    question: 'What splits water in photosynthesis?',
    options: [
      { label: 'A', text: 'Photosystem II', isCorrect: true },
      { label: 'B', text: 'RuBisCO', isCorrect: false }
    ],
    explanation: 'The oxygen-evolving complex of PSII splits water.',
    passageId: 'p',
    difficulty: 'easy'
  };

  test('the verdict comes from the answer key, not the model', () => {
    const wrong = buildQuizFeedbackMessages(question, 1, EXPERT_PERSONAS.biology, 'guided');
    expect(wrong.isCorrect).toBe(false);
    expect(wrong.verdict).toBe('Not quite. You chose B, but the answer is A: Photosystem II.');

    const right = buildQuizFeedbackMessages(question, 0, EXPERT_PERSONAS.biology, 'guided');
    expect(right.isCorrect).toBe(true);
    expect(right.verdict).toStartWith('Correct');
  });
});

describe('parseGeneratedQuiz', () => {
  test('accepts a valid question, even wrapped in prose or code fences', () => {
    const raw = 'Sure!\n```json\n{"question": "Which gas is released?", "options": ["A. O2", "CO2", "N2", "H2"], "answer": "A", "explanation": "Water splitting releases O2."}\n```';
    expect(parseGeneratedQuiz(raw)).toEqual({
      question: 'Which gas is released?',
      options: ['O2', 'CO2', 'N2', 'H2'],
      answerIndex: 0,
      explanation: 'Water splitting releases O2.'
    });
  });

  test.each([
    ['not JSON at all'],
    ['{"question": "Which gas?", "options": ["O2", "CO2", "N2"], "answer": "A"}'],
    ['{"question": "Which gas?", "options": ["O2", "O2", "N2", "H2"], "answer": "A"}'],
    ['{"question": "Which gas?", "options": ["O2", "CO2", "N2", "H2"], "answer": "E"}']
  ])('rejects %s', (raw) => {
    expect(parseGeneratedQuiz(raw)).toBeNull();
  });
});
