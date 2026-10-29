/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { accuracyForStyle, recordAnswer } from './progress';
import type { QuizQuestion } from '../types';

const question = (topicId: string, passageSnippet?: string): QuizQuestion => ({
  id: 'q',
  subject: 'chemistry',
  topicId,
  type: 'conceptual',
  question: '?',
  options: [],
  explanation: '',
  passageId: 'p',
  passageSnippet,
  difficulty: 'easy'
});

describe('recordAnswer', () => {
  test('adds a topic the student had not practiced', () => {
    const topics = recordAnswer([], question('chem-u3-kinetic-molecular-theory'), true);
    expect(topics).toHaveLength(1);
    expect(topics[0]).toMatchObject({ attempts: 1, correct: 1, accuracy: 1, status: 'mastered', title: 'Kinetic Molecular Theory' });
  });

  test('prefers the question passage title when available', () => {
    expect(recordAnswer([], question('chem-u3-kmt', 'Unit 3: Gases'), false)[0].title).toBe('Unit 3: Gases');
  });

  test('updates an existing topic', () => {
    let topics = recordAnswer([], question('t'), true);
    topics = recordAnswer(topics, question('t'), false);
    topics = recordAnswer(topics, question('t'), false);
    expect(topics).toHaveLength(1);
    expect(topics[0]).toMatchObject({ attempts: 3, correct: 1, accuracy: 0.33, status: 'struggling' });
  });
});

describe('accuracyForStyle', () => {
  test('defaults to the guided band before any practice', () => {
    expect(accuracyForStyle([])).toBe(0.75);
  });

  test('uses real answers only', () => {
    const topics = recordAnswer(recordAnswer([], question('a'), true), question('a'), false);
    expect(accuracyForStyle(topics)).toBe(0.5);
  });
});
