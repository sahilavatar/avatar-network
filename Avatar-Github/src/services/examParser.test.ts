/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { parseExamQuestions } from './examParser';

const exam = (withKey: boolean) => `Unit 3 Practice Test

1. Which organelle produces most of a cell's ATP?
A. Ribosome
B. Mitochondrion
C. Golgi apparatus
D. Lysosome
${withKey ? 'Answer: B' : ''}

2. Where does the Calvin cycle take place?
A. Thylakoid membrane
B. Cytoplasm
C. Stroma
D. Nucleus
${withKey ? 'Answer: C' : ''}
`;

describe('parseExamQuestions', () => {
  test('parses multiple-choice questions with stated answers', () => {
    const { questions } = parseExamQuestions(exam(true), 'doc', 'unit3-test.txt', 'biology');
    expect(questions).toHaveLength(2);
    expect(questions[0].options.find((o) => o.isCorrect)?.text).toBe('Mitochondrion');
    expect(questions[1].options.find((o) => o.isCorrect)?.text).toBe('Stroma');
  });

  test('never invents an answer key', () => {
    const { questions } = parseExamQuestions(exam(false), 'doc', 'unit3-test.txt', 'biology');
    expect(questions).toHaveLength(0);
  });

  test('plain notes produce no questions', () => {
    const notes =
      'Lab notebook, week 7.\n\nZorbium chloride is a fictional teaching compound used in our class. When heated above 412 degrees Celsius it turns bright teal and releases chlorine gas.';
    expect(parseExamQuestions(notes, 'doc', 'notes.txt', 'notes').questions).toHaveLength(0);
  });
});
