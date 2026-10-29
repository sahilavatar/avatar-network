import React, { useState } from 'react';
import { CalendarClock, Check, Trash2 } from 'lucide-react';
import { Persona } from '../../types';
import { describeTimeframe, Goal } from '../../services/goals';

interface GoalsPanelProps {
  persona: Persona;
  goals: Goal[];
  onAdd: (goal: { title: string; details?: string; targetDate?: string }) => void;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}

const isoInDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const QUICK_TIMEFRAMES = [
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '1 month', days: 30 }
];

const input =
  'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500';

export const GoalsPanel: React.FC<GoalsPanelProps> = ({ persona, goals, onAdd, onToggleDone, onDelete }) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const active = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), details: details.trim() || undefined, targetDate: targetDate || undefined });
    setTitle('');
    setDetails('');
    setTargetDate('');
  };

  const GoalRow = ({ goal }: { goal: Goal }) => (
    <li className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
      <button
        type="button"
        onClick={() => onToggleDone(goal.id)}
        aria-label={goal.done ? `Mark "${goal.title}" as not done` : `Mark "${goal.title}" as done`}
        className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
          goal.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-accent-500'
        }`}
      >
        {goal.done && <Check className="w-3 h-3" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${goal.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{goal.title}</p>
        {goal.details && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{goal.details}</p>}
        {!goal.done && (
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <CalendarClock className="w-3.5 h-3.5" />
            {describeTimeframe(goal.targetDate)}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDelete(goal.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
        aria-label={`Delete goal "${goal.title}"`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );

  return (
    <div className="p-5 space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Tell {persona.name} what you're working towards. Active goals are shared with {persona.name.split(' ')[0]} in every question, so answers
        stay focused on them.
      </p>

      <form onSubmit={submit} className="space-y-2.5">
        <label className="block">
          <span className="sr-only">Goal</span>
          <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ace the Unit 3 test" maxLength={120} />
        </label>
        <label className="block">
          <span className="sr-only">Details</span>
          <textarea
            className={`${input} resize-none`}
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details (optional): topics, what you find hard…"
            maxLength={300}
          />
        </label>
        <div>
          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Timeframe</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_TIMEFRAMES.map((t) => {
              const value = isoInDays(t.days);
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTargetDate(targetDate === value ? '' : value)}
                  aria-pressed={targetDate === value}
                  className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                    targetDate === value
                      ? 'bg-accent-600 border-accent-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-accent-400'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
            <label className="flex items-center">
              <span className="sr-only">Target date</span>
              <input
                type="date"
                value={targetDate}
                min={isoInDays(0)}
                onChange={(e) => setTargetDate(e.target.value)}
                className="px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300"
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-40 text-white text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
        >
          Set goal for {persona.name.split(' ')[0]}
        </button>
      </form>

      <section aria-label="Active goals">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Active</h3>
        {active.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No goals yet.</p>
        ) : (
          <ul className="space-y-2">
            {active.map((g) => (
              <GoalRow key={g.id} goal={g} />
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section aria-label="Completed goals">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Completed</h3>
          <ul className="space-y-2">
            {done.map((g) => (
              <GoalRow key={g.id} goal={g} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
