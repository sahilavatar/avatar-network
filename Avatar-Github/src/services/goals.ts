import { SubjectId } from '../types';

/** A study goal the student sets for one Avatar; active goals are shared with that Avatar in every prompt */
export interface Goal {
  id: string;
  avatarId: SubjectId;
  title: string;
  details?: string;
  // ISO date (yyyy-mm-dd) the student wants to reach the goal by
  targetDate?: string;
  createdAt: number;
  done: boolean;
}

const STORAGE_KEY = 'avatar_goals_v1';

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Goal[];
  } catch {
    // Unreadable or unavailable storage: start with no goals
  }
  return [];
}

export function saveGoals(goals: Goal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch {
    // Storage unavailable; goals last for this visit
  }
}

const startOfDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

/** Whole days from today until the target date (negative once it has passed) */
export function daysLeft(targetDate: string, today: Date = new Date()): number {
  const [y, m, d] = targetDate.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - startOfDay(today)) / 86_400_000);
}

export function describeTimeframe(targetDate: string | undefined, today: Date = new Date()): string {
  if (!targetDate) return 'No deadline';
  const days = daysLeft(targetDate, today);
  if (days < 0) return `${-days} day${days === -1 ? '' : 's'} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days left`;
}

/** One line per active goal, for the Avatar's prompt */
export function goalPromptLines(goals: Goal[], avatarId: SubjectId, today: Date = new Date()): string[] {
  return goals
    .filter((g) => g.avatarId === avatarId && !g.done)
    .map((g) => {
      const when = g.targetDate ? ` (${describeTimeframe(g.targetDate, today).toLowerCase()}, by ${g.targetDate})` : '';
      return `${g.title}${when}${g.details ? `: ${g.details}` : ''}`;
    });
}
