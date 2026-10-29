import React from 'react';
import { Paperclip } from 'lucide-react';
import { Persona, SubjectId } from '../../types';
import { AvatarImage } from '../ui/overlays';

const STARTERS: Partial<Record<SubjectId, string[]>> = {
  notes: ['Summarize the main ideas in my notes', 'Quiz me on my notes', 'What key terms should I know?', 'Explain the hardest part simply'],
  algebra: ['Quiz me on quadratic equations', 'Solve 2x² - 4x - 6 = 0', 'Explain completing the square', 'How does the discriminant work?'],
  biology: ['Quiz me on photosynthesis', 'Punnett square Bb x Bb', 'Explain cellular respiration simply', 'How does Hardy-Weinberg work?'],
  history: ['Why did the Anti-Federalists oppose ratification?', 'Quiz me on the Constitution', 'What caused Shays’ Rebellion?', 'How do I score well on a DBQ?'],
  chemistry: ['Molar mass of H2SO4', 'Explain Le Chatelier’s principle', 'Quiz me on gas laws', 'What is bond order?']
};

interface EmptyStateProps {
  persona: Persona;
  notesCount: number;
  // One quiet line about the AI setup, only when it matters (see App)
  setupHint?: string;
  onUpload: () => void;
  onPrompt: (text: string) => void;
}

// No welcome screen or requirements card: people land in the chat and can start right away
export const EmptyState: React.FC<EmptyStateProps> = ({ persona, notesCount, setupHint, onUpload, onPrompt }) => {
  const starters = STARTERS[persona.subject] ?? STARTERS.notes!;
  return (
    <div className="min-h-full flex flex-col items-center justify-center text-center py-10 animate-fade-in">
      <AvatarImage src={persona.avatarUrl} emoji={persona.avatar} name={persona.name} size={56} rounded="rounded-2xl" decorative />
      <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">What would you like to study?</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        {persona.name} · {persona.title}
      </p>

      {notesCount === 0 ? (
        <button
          type="button"
          onClick={onUpload}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <Paperclip className="w-4 h-4" />
          Add your notes to get started
        </button>
      ) : (
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPrompt(s)}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {setupHint && <p className="mt-6 max-w-md text-xs text-slate-500 dark:text-slate-400">{setupHint}</p>}
    </div>
  );
};
