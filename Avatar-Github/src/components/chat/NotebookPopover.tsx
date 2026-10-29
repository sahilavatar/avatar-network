import React, { useCallback, useRef, useState } from 'react';
import { BookOpen, Eye, FileText, Library, Plus, Trash2 } from 'lucide-react';
import { SourceDocument } from '../../types';
import { ContextUsage } from '../../services/gemmaGeneration';
import { useDismiss } from '../ui/overlays';

interface NotebookPopoverProps {
  avatarName: string;
  sources: SourceDocument[];
  usage: ContextUsage | null;
  onToggle: (sourceId: string) => void;
  onDelete: (sourceId: string) => void;
  onView: (sourceId: string) => void;
  onUpload: () => void;
  onOpenPracticeVault?: () => void;
}

const formatTokens = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

/** Knowledge connected to the active Avatar: switch sources on/off, add more, and see context use */
export const NotebookPopover: React.FC<NotebookPopoverProps> = ({
  avatarName,
  sources,
  usage,
  onToggle,
  onDelete,
  onView,
  onUpload,
  onOpenPracticeVault
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const enabledCount = sources.filter((s) => s.enabled).length;
  const barColor = !usage ? 'bg-slate-300' : usage.pct >= 80 ? 'bg-rose-500' : usage.pct >= 50 ? 'bg-amber-500' : 'bg-accent-500';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Notebook: ${enabledCount} of ${sources.length} sources on`}
        title="Notebook"
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Library className="w-[18px] h-[18px]" />
        {sources.length > 0 && <span className="text-xs font-medium tabular-nums">{enabledCount}</span>}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${avatarName}'s notebook`}
          className="absolute bottom-full mb-2 left-0 sm:left-auto sm:right-auto w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-40 animate-fade-in"
        >
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{avatarName}'s notebook</h3>
              <button
                type="button"
                onClick={onUpload}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-accent-700 dark:text-accent-300 hover:bg-accent-50 dark:hover:bg-accent-950/50 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add notes
              </button>
            </div>

            {/* Live context window use for this chat */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Context window</span>
                <span className="tabular-nums">
                  {usage ? `${formatTokens(usage.usedTokens)} / ${formatTokens(usage.windowTokens)} tokens · ${usage.pct}%` : 'Updates after the first answer'}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                role="progressbar"
                aria-label="Context window used by the latest answer"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={usage?.pct ?? 0}
              >
                <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.max(usage?.pct ?? 0, usage ? 2 : 0)}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                {usage?.historyTrimmed
                  ? 'This chat is long: only the most recent messages are sent with each question. Start a new chat for a fresh topic.'
                  : 'Each question sends instructions, recent messages and the most relevant passages, so notebooks can be any size.'}
              </p>
            </div>
          </div>

          <ul className="max-h-64 overflow-y-auto p-2">
            {sources.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                <FileText className="w-6 h-6 mx-auto mb-2 opacity-60" />
                No notes yet. Add PDFs or text files and {avatarName} will answer from them.
              </li>
            )}
            {sources.map((src) => (
              <li key={src.id} className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <button
                  type="button"
                  role="switch"
                  aria-checked={src.enabled}
                  aria-label={`Use ${src.title}`}
                  onClick={() => onToggle(src.id)}
                  className={`relative w-8 h-[18px] rounded-full shrink-0 transition-colors cursor-pointer ${src.enabled ? 'bg-accent-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${src.enabled ? 'left-4' : 'left-0.5'}`} />
                </button>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm truncate ${src.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{src.title}</span>
                  <span className="block text-[11px] text-slate-400">
                    {src.kind === 'upload' ? 'Your upload' : 'Sample content'} ·{' '}
                    {src.passagesCount > 0 ? `${src.passagesCount} passages` : `${src.parsedQuestions?.length ?? 0} practice questions`}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onView(src.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  aria-label={`View ${src.title}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                {src.kind === 'upload' && (
                  <button
                    type="button"
                    onClick={() => onDelete(src.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                    aria-label={`Delete ${src.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onOpenPracticeVault && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenPracticeVault();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-b-2xl cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Practice questions
            </button>
          )}
        </div>
      )}
    </div>
  );
};
