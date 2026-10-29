import { SubjectId } from '../types';
import { CalculatorKind } from './nativeEngines/engineDispatcher';

/**
 * Skills an Avatar can use. Calculator skills switch the exact built-in solvers on or off;
 * instruction skills add a short instruction to the Avatar's prompt. Custom skills are
 * instruction skills the user writes.
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  kind: 'calculator' | 'instruction';
  calculator?: CalculatorKind;
  instructions?: string;
  custom?: boolean;
}

export const BUILT_IN_SKILLS: Skill[] = [
  {
    id: 'calc-math',
    name: 'Math calculator',
    description: 'Solves equations, fractions, percentages and arithmetic exactly, with worked steps.',
    kind: 'calculator',
    calculator: 'math'
  },
  {
    id: 'calc-chemistry',
    name: 'Chemistry calculator',
    description: 'Molar mass, ideal gas law and common reaction balancing.',
    kind: 'calculator',
    calculator: 'chemistry'
  },
  {
    id: 'calc-biology',
    name: 'Biology calculator',
    description: 'Punnett squares and DNA-to-protein translation.',
    kind: 'calculator',
    calculator: 'biology'
  },
  {
    id: 'calc-timeline',
    name: 'Timeline calculator',
    description: 'Years between historical dates.',
    kind: 'calculator',
    calculator: 'timeline'
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Ends answers with two or three quick question-and-answer flashcards.',
    kind: 'instruction',
    instructions: 'After answering, add 2-3 short flashcards in the form "Q: … / A: …" covering the key facts.'
  },
  {
    id: 'explain-simply',
    name: 'Explain simply',
    description: 'Plain words and an everyday analogy, as if to a younger student.',
    kind: 'instruction',
    instructions: 'Use simple, everyday words and one concrete analogy, as if explaining to a 12-year-old.'
  },
  {
    id: 'socratic',
    name: 'Socratic tutor',
    description: 'Guides with questions instead of giving the full answer straight away.',
    kind: 'instruction',
    instructions: 'Do not give the full answer immediately. Ask one guiding question at a time and let the student work it out.'
  },
  {
    id: 'exam-prep',
    name: 'Exam prep',
    description: 'Points out common exam traps and how questions on the topic are usually asked.',
    kind: 'instruction',
    instructions: 'Point out one common exam mistake on this topic and how exam questions about it are usually phrased.'
  }
];

export const DEFAULT_SKILL_IDS = BUILT_IN_SKILLS.filter((s) => s.kind === 'calculator').map((s) => s.id);

export interface SkillsState {
  // Enabled skill ids per Avatar; Avatars without an entry use DEFAULT_SKILL_IDS
  enabled: Partial<Record<SubjectId, string[]>>;
  custom: Skill[];
}

const STORAGE_KEY = 'avatar_skills_v1';

export const emptySkillsState = (): SkillsState => ({ enabled: {}, custom: [] });

export function loadSkills(): SkillsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...emptySkillsState(), ...JSON.parse(raw) };
  } catch {
    // Unreadable or unavailable storage: start with defaults
  }
  return emptySkillsState();
}

export function saveSkills(state: SkillsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable; skills last for this visit
  }
}

export const allSkills = (state: SkillsState): Skill[] => [...BUILT_IN_SKILLS, ...state.custom];

export const enabledSkillIds = (state: SkillsState, avatarId: SubjectId): string[] =>
  state.enabled[avatarId] ?? DEFAULT_SKILL_IDS;

export function toggleSkill(state: SkillsState, avatarId: SubjectId, skillId: string): SkillsState {
  const current = enabledSkillIds(state, avatarId);
  const next = current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId];
  return { ...state, enabled: { ...state.enabled, [avatarId]: next } };
}

export function addCustomSkill(state: SkillsState, avatarId: SubjectId, name: string, instructions: string): SkillsState {
  const skill: Skill = {
    id: `custom-${Date.now().toString(36)}`,
    name: name.trim(),
    description: instructions.trim(),
    kind: 'instruction',
    instructions: instructions.trim(),
    custom: true
  };
  const withSkill = { ...state, custom: [...state.custom, skill] };
  // A new skill is switched on for the Avatar it was created from
  return toggleSkill(withSkill, avatarId, skill.id);
}

export function removeCustomSkill(state: SkillsState, skillId: string): SkillsState {
  const enabled: SkillsState['enabled'] = {};
  Object.entries(state.enabled).forEach(([avatar, ids]) => {
    enabled[avatar] = (ids || []).filter((id) => id !== skillId);
  });
  return { enabled, custom: state.custom.filter((s) => s.id !== skillId) };
}

/** Calculators the Avatar may run */
export function enabledCalculators(state: SkillsState, avatarId: SubjectId): Set<CalculatorKind> {
  const ids = new Set(enabledSkillIds(state, avatarId));
  return new Set(
    BUILT_IN_SKILLS.filter((s) => s.kind === 'calculator' && ids.has(s.id)).map((s) => s.calculator as CalculatorKind)
  );
}

/** Prompt instructions from the Avatar's enabled instruction skills */
export function skillInstructions(state: SkillsState, avatarId: SubjectId): string[] {
  const ids = new Set(enabledSkillIds(state, avatarId));
  return allSkills(state)
    .filter((s) => s.kind === 'instruction' && ids.has(s.id) && s.instructions)
    .map((s) => s.instructions as string);
}
