/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
  addCustomSkill,
  DEFAULT_SKILL_IDS,
  emptySkillsState,
  enabledCalculators,
  removeCustomSkill,
  skillInstructions,
  toggleSkill
} from './skills';
import { daysLeft, describeTimeframe, goalPromptLines, type Goal } from './goals';
import { groupByRecency, titleFrom, type Conversation } from './conversations';
import { dispatchNativeJsTool } from './nativeEngines/engineDispatcher';
import { buildTutorMessages, contextUsage, MAX_HISTORY_TURNS } from './gemmaGeneration';
import { EXPERT_PERSONAS } from '../data/curriculumData';
import type { ChatMessage } from '../types';

describe('skills', () => {
  test('Avatars start with every calculator and no instruction skills', () => {
    const state = emptySkillsState();
    expect(enabledCalculators(state, 'notes')).toEqual(new Set(['math', 'chemistry', 'biology', 'timeline']));
    expect(skillInstructions(state, 'notes')).toEqual([]);
    expect(DEFAULT_SKILL_IDS).toHaveLength(4);
  });

  test('turning off a calculator stops it from answering', () => {
    const state = toggleSkill(emptySkillsState(), 'algebra', 'calc-math');
    expect(enabledCalculators(state, 'algebra').has('math')).toBe(false);
    expect(dispatchNativeJsTool('Solve 2x + 6 = 14', 'algebra', enabledCalculators(state, 'algebra'))).toBeNull();
    // Other Avatars are unaffected
    expect(enabledCalculators(state, 'biology').has('math')).toBe(true);
  });

  test('instruction skills and custom skills reach the prompt', () => {
    let state = toggleSkill(emptySkillsState(), 'notes', 'socratic');
    state = addCustomSkill(state, 'notes', 'Spanish', 'Answer in Spanish.');
    expect(skillInstructions(state, 'notes')).toHaveLength(2);
    expect(skillInstructions(state, 'notes')).toContain('Answer in Spanish.');

    const prompt = buildTutorMessages(
      {
        query: 'Hi',
        persona: EXPERT_PERSONAS.notes,
        retrieval: { hits: [], totalSearched: 0, latencyMs: 0, model: '', dimension: 256 },
        teachingStyle: 'guided',
        skills: skillInstructions(state, 'notes')
      },
      []
    );
    expect(prompt[0].content).toContain('Answer in Spanish.');

    const removed = removeCustomSkill(state, state.custom[0].id);
    expect(skillInstructions(removed, 'notes')).not.toContain('Answer in Spanish.');
  });
});

describe('goals', () => {
  const today = new Date(2026, 9, 28);
  const goal = (over: Partial<Goal>): Goal => ({ id: 'g', avatarId: 'biology', title: 'Ace the unit 3 test', createdAt: 0, done: false, ...over });

  test('timeframes count whole days', () => {
    expect(daysLeft('2026-11-02', today)).toBe(5);
    expect(describeTimeframe('2026-10-28', today)).toBe('Due today');
    expect(describeTimeframe('2026-10-29', today)).toBe('Due tomorrow');
    expect(describeTimeframe('2026-10-26', today)).toBe('2 days overdue');
    expect(describeTimeframe(undefined, today)).toBe('No deadline');
  });

  test('only active goals for this Avatar go into the prompt', () => {
    const lines = goalPromptLines(
      [
        goal({ targetDate: '2026-11-02', details: 'focus on mitosis' }),
        goal({ id: 'done', done: true }),
        goal({ id: 'other', avatarId: 'history' })
      ],
      'biology',
      today
    );
    expect(lines).toEqual(['Ace the unit 3 test (5 days left, by 2026-11-02): focus on mitosis']);
  });
});

describe('conversations', () => {
  test('titles come from the first line of the first message', () => {
    expect(titleFrom('  Why did the Anti-Federalists oppose ratification?\nmore')).toBe('Why did the Anti-Federalists oppose ratificatio…');
    expect(titleFrom('Short question')).toBe('Short question');
    expect(titleFrom('   ')).toBe('New chat');
  });

  test('recents are grouped by day, newest first', () => {
    const now = new Date(2026, 9, 28, 15).getTime();
    const chat = (id: string, updatedAt: number): Conversation => ({ id, avatarId: 'notes', title: id, createdAt: updatedAt, updatedAt, messages: [] });
    const groups = groupByRecency([chat('old', now - 30 * 86_400_000), chat('earlier', now - 3600_000), chat('latest', now), chat('week', now - 3 * 86_400_000)], now);
    expect(groups.map((g) => [g.label, g.items.map((c) => c.id)])).toEqual([
      ['Today', ['latest', 'earlier']],
      ['Previous 7 days', ['week']],
      ['Older', ['old']]
    ]);
  });
});

describe('contextUsage', () => {
  const msg = (role: ChatMessage['role'], over: Partial<ChatMessage> = {}): ChatMessage => ({ id: Math.random().toString(), role, text: 'x', timestamp: 0, ...over });
  const answer = (tokensIn: number, tokensOut: number) =>
    msg('persona', {
      aiGenerated: true,
      metrics: { model: '', tokensIn, tokensOut, retrievalLatencyMs: 0, vectorSimilarity: 0, groundednessScore: 0, teachingStyle: 'guided' }
    });

  test('is unknown before the first AI answer', () => {
    expect(contextUsage([msg('user')])).toBeNull();
  });

  test('uses the latest answer and flags trimmed history', () => {
    const usage = contextUsage([msg('user'), answer(1000, 200), msg('user'), answer(3000, 276)]);
    expect(usage).toMatchObject({ usedTokens: 3276, windowTokens: 32768, pct: 10, historyTrimmed: false });

    const long = Array.from({ length: MAX_HISTORY_TURNS + 2 }, (_, i) => (i % 2 ? answer(500, 50) : msg('user')));
    expect(contextUsage(long)?.historyTrimmed).toBe(true);
  });
});
