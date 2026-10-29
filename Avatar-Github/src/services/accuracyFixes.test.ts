/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { asksAboutNotebookAccess, buildTutorMessages, describeNotebook, detectExamQuestionTarget } from './gemmaGeneration';
import { isClarificationRequest, resolveConversationalContext } from './textSearch';
import { stripPdfBoilerplate } from './textCleanup';
import { EXPERT_PERSONAS, INITIAL_SOURCES } from '../data/curriculumData';
import type { SourceDocument } from '../types';
import type { RetrievalResult } from './embeddingGemma';

const noHits: RetrievalResult = { hits: [], latencyMs: 0, model: 'test' } as unknown as RetrievalResult;

describe('exam question lookup', () => {
  test('mentioning an exam does not attach a question', () => {
    expect(detectExamQuestionTarget('Help me with the AP US History exam', INITIAL_SOURCES, 'history')).toBeNull();
    expect(detectExamQuestionTarget('do you have access to my uploaded practice exam', INITIAL_SOURCES, 'notes')).toBeNull();
  });
  test('only the current Avatar\'s sources are searched', () => {
    // The chemistry bank has a question 1; a history or notes chat must not get it
    expect(detectExamQuestionTarget('explain question 1', INITIAL_SOURCES, 'chemistry')).not.toBeNull();
    expect(detectExamQuestionTarget('explain question 1', INITIAL_SOURCES, 'notes')).toBeNull();
  });
  test('no chemistry question in a history prompt', () => {
    const msgs = buildTutorMessages({ query: "Let's tackle the AP US History exam", persona: EXPERT_PERSONAS.history, retrieval: noHits, teachingStyle: 'guided', sources: INITIAL_SOURCES }, []);
    expect(msgs[msgs.length - 1].content).not.toContain('Exam question');
  });
});

describe('clarification follow-ups', () => {
  test('recognises requests to re-explain', () => {
    for (const q of ["i don't understand", 'I dont get it', 'what do you mean?', 'explain that more simply', "I'm confused", 'huh?', 'can you clarify'])
      expect(isClarificationRequest(q)).toBe(true);
    for (const q of ['What is bond order?', 'Explain photosynthesis', 'What does ATP stand for?'])
      expect(isClarificationRequest(q)).toBe(false);
  });
  test('searches with the previous question, not "i don\'t understand"', () => {
    const history = [
      { role: 'user', text: 'What is bond order?' },
      { role: 'persona', text: 'Bond order equals half the difference between bonding and antibonding electrons.' }
    ];
    const r = resolveConversationalContext("i don't understand", history);
    expect(r.isClarification).toBe(true);
    expect(r.resolvedSearchQuery).toContain('What is bond order?');
  });
  test('asks the model to re-explain and never says the notes do not cover it', () => {
    const msgs = buildTutorMessages(
      { query: "i don't understand", persona: EXPERT_PERSONAS.chemistry, retrieval: noHits, teachingStyle: 'guided', isClarification: true, notebook: { passages: 12, titles: ['notes.pdf'] } },
      []
    );
    const last = msgs[msgs.length - 1].content;
    expect(last).toContain("didn't understand your previous answer");
    expect(last).not.toContain('None of the student');
  });
});

describe('notebook questions', () => {
  test('recognises questions about the notebook', () => {
    for (const q of ['do you have access to my uploaded practice exam', 'Can you see my notes?', 'what files do you have', 'what documents have I uploaded', 'did my upload work'])
      expect(asksAboutNotebookAccess(q)).toBe(true);
    for (const q of ['What is in my notes about mitosis?', 'Summarize my notes', 'What is bond order?', 'Do you know what photosynthesis is?'])
      expect(asksAboutNotebookAccess(q)).toBe(false);
  });
  test('lists the sources with passages and practice questions', () => {
    const src = (o: Partial<SourceDocument>) => ({ id: 'x', subject: 'notes', title: 't', shortTitle: 't', kind: 'upload', author: '', license: '', passagesCount: 0, tokens: 0, enabled: true, ...o }) as SourceDocument;
    const text = describeNotebook('Avatar', [
      src({ id: 'a', title: 'AP US History Practice Exam.pdf', passagesCount: 40, parsedQuestions: new Array(55).fill({}) }),
      src({ id: 'b', title: 'old.txt', enabled: false })
    ]);
    expect(text).toContain("Yes. Avatar's notebook has 1 source switched on (1 switched off)");
    expect(text).toContain('• AP US History Practice Exam.pdf (40 passages, 55 practice questions)');
    expect(describeNotebook('Avatar', [])).toContain('notebook is empty');
  });
});

describe('stripPdfBoilerplate', () => {
  const header = 'Return to Table of Contents © 2017 The College Board AP United States History Practice Exam';
  const topics = ['', '', '', 'colonial taxation and the Stamp Act protests of 1765 across the thirteen colonies', 'the Declaration of Independence and its Enlightenment ideas about natural rights', 'the Articles of Confederation and why a weak central government struggled', 'the Constitutional Convention and the compromises over representation and slavery'];
  const body = (n: number) => `Page ${n} content: this page explains ${topics[n]}, with primary sources and review questions for students.`;
  const pdf = [
    '[Page 1]\nAP United States History Practice Exam',
    `[Page 2]\n${header} Contents About AP ........ 3 Exam Overview ........ 4 Section I ........ 6 Section II ........ 20 Answer Key ........ 40`,
    ...[3, 4, 5, 6].map((n) => `[Page ${n}]\n${header} ${body(n)} ${n}`)
  ].join('\n\n');
  const cleaned = stripPdfBoilerplate(pdf);
  test('removes the running header from every page', () => {
    expect(cleaned).not.toContain('Return to Table of Contents');
    expect(cleaned).not.toContain('© 2017 The College Board');
  });
  test('drops the contents page and near-empty pages, keeps real content', () => {
    expect(cleaned).not.toContain('Exam Overview ........');
    expect(cleaned).not.toContain('[Page 1]');
    for (const n of [3, 4, 5, 6]) expect(cleaned).toContain(`[Page ${n}]\nPage ${n} content: this page explains ${topics[n].split(" ").slice(0, 3).join(" ")}`);
  });
  test('strips headers even when every page is short', () => {
    const short = [3, 4, 5, 6].map((n) => `[Page ${n}]\n${header} Short fact number ${n}.`).join('\n\n');
    const out = stripPdfBoilerplate(short);
    expect(out).not.toContain('Return to Table of Contents');
    expect(out).toContain('Short fact number 4.');
  });
  test('leaves text without boilerplate alone, and never empties a document', () => {
    const plain = '[Page 1]\nShort note.';
    expect(stripPdfBoilerplate(plain)).toBe(plain);
    expect(stripPdfBoilerplate('Plain text notes about cells and their organelles.')).toBe('Plain text notes about cells and their organelles.');
  });
});
