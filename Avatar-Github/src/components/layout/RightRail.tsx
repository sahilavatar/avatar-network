import React from 'react';
import { CircleUserRound, Target, Wand2 } from 'lucide-react';

export type RightPanelId = 'goals' | 'skills' | 'me';

export const RIGHT_PANELS: { id: RightPanelId; label: string; title: string; icon: React.ReactNode }[] = [
  { id: 'goals', label: 'Goals', title: 'Set goals', icon: <Target className="w-5 h-5" /> },
  { id: 'skills', label: 'Skills', title: 'Add skills', icon: <Wand2 className="w-5 h-5" /> },
  { id: 'me', label: 'My Avatar', title: 'My Avatar', icon: <CircleUserRound className="w-5 h-5" /> }
];

interface RightRailProps {
  active: RightPanelId | null;
  activeGoals: number;
  onOpen: (id: RightPanelId) => void;
  // Compact icon-only buttons for the mobile header
  compact?: boolean;
}

export const RightRail: React.FC<RightRailProps> = ({ active, activeGoals, onOpen, compact }) => (
  <>
    {RIGHT_PANELS.map((p) => (
      <button
        key={p.id}
        type="button"
        onClick={() => onOpen(p.id)}
        aria-label={p.title}
        aria-pressed={active === p.id}
        title={p.title}
        className={`relative flex flex-col items-center gap-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
          compact ? 'p-2' : 'w-16 py-2.5'
        } ${active === p.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : ''}`}
      >
        {p.icon}
        {!compact && <span className="text-[11px] font-medium">{p.label}</span>}
        {p.id === 'goals' && activeGoals > 0 && (
          <span className={`absolute ${compact ? 'top-1 right-1' : 'top-1.5 right-3'} min-w-4 h-4 px-1 rounded-full bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center`}>
            {activeGoals}
          </span>
        )}
      </button>
    ))}
  </>
);
