/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { INITIAL_PASSAGES, INITIAL_SOURCES } from './curriculumData';
import { TUTOR_KNOWLEDGE_FOLDERS } from './knowledgeFolders';

describe('sample content', () => {
  test('every sample source is credited to Avatar Network as sample content', () => {
    for (const src of INITIAL_SOURCES) {
      expect(src.author).toBe('Avatar Network');
      expect(src.title.startsWith('Sample ')).toBe(true);
    }
  });

  test('passage counts match the passages that exist', () => {
    for (const src of INITIAL_SOURCES) {
      expect(src.passagesCount).toBe(INITIAL_PASSAGES.filter((p) => p.srcId === src.id).length);
    }
  });

  test('every source has passages or practice questions', () => {
    for (const src of INITIAL_SOURCES) {
      expect(src.passagesCount + (src.parsedQuestions?.length ?? 0)).toBeGreaterThan(0);
    }
  });

  test('passage citations name their own source', () => {
    const titles = new Map(INITIAL_SOURCES.map((s) => [s.id, s.title]));
    for (const p of INITIAL_PASSAGES) expect(p.sourceTitle).toBe(titles.get(p.srcId) ?? `missing source ${p.srcId}`);
  });

  test('practice folders count the questions that exist', () => {
    for (const folder of Object.values(TUTOR_KNOWLEDGE_FOLDERS)) {
      expect(folder.units.reduce((sum, u) => sum + u.problemCount, 0)).toBe(folder.problemCount);
    }
  });
});
