import React from 'react';
import { BarChart3, ChevronDown, Download, Monitor, Moon, Sun, Upload } from 'lucide-react';
import { SubjectId, TopicMastery } from '../../types';

export type ThemePreference = 'light' | 'dark' | 'system';

interface MyAvatarPanelProps {
  mastery: Partial<Record<SubjectId, TopicMastery[]>>;
  subjects: { id: SubjectId; label: string; icon: string }[];
  theme: ThemePreference;
  onChangeTheme: (theme: ThemePreference) => void;
  onOpenPractice: () => void;
  onResetData: () => void;
  onRemoveModel: () => void;
  // When this device last saved a backup, or null if never
  lastBackup: number | null;
  onExportBackup: () => void;
  onRestoreBackup: (file: File) => void;
}

const STATUS: Record<TopicMastery['status'], { label: string; className: string }> = {
  mastered: { label: 'Mastered', className: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60' },
  review_needed: { label: 'Keep practicing', className: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60' },
  struggling: { label: 'Needs review', className: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60' },
  new: { label: 'Not started', className: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' }
};

const FAQS = [
  {
    q: 'Where are my notes and chats stored?',
    a: 'Only in this browser on this device. Nothing is uploaded to a server, and nothing syncs between devices. Use Save backup to keep a copy, or to move your work to another browser with Restore backup.'
  },
  {
    q: 'Can my saved work disappear?',
    a: 'Yes, if this site\'s data is cleared: by clearing your browsing data, by the browser freeing up space, or in Safari, which can remove a site\'s data after about a week of not visiting it. Save a backup now and then so you can restore it.'
  },
  {
    q: 'Why does the AI need a download?',
    a: 'The AI runs on your device instead of in the cloud. The model (about 1.1–1.3 GB) downloads once and is cached, so later visits load it from your device instead of downloading again.'
  },
  {
    q: 'Why is it slow on my computer?',
    a: 'Without WebGPU the model runs on the CPU, which can take 1–3 minutes per answer. Chrome or Edge on a laptop with a recent graphics chip, or Safari 26 or later on a Mac, is much faster.'
  },
  {
    q: 'Can the AI be wrong?',
    a: 'Yes. It uses a small model, so check answers from your notes against the source passage shown under them, and treat answers marked general knowledge with extra care. Calculator answers are exact.'
  },
  {
    q: 'What do goals and skills do?',
    a: 'Active goals and enabled skills are sent to the Avatar with every question. Calculator skills decide which exact solvers can answer.'
  }
];

export const MyAvatarPanel: React.FC<MyAvatarPanelProps> = ({ mastery, subjects, theme, onChangeTheme, onOpenPractice, onResetData, onRemoveModel, lastBackup, onExportBackup, onRestoreBackup }) => {
  const restoreInput = React.useRef<HTMLInputElement>(null);
  const practiced = subjects
    .map((subject) => ({ subject, topics: (mastery[subject.id] || []).filter((t) => t.attempts > 0) }))
    .filter((g) => g.topics.length > 0);
  const all = practiced.flatMap((g) => g.topics);
  const attempts = all.reduce((sum, t) => sum + t.attempts, 0);
  const correct = all.reduce((sum, t) => sum + t.correct, 0);

  return (
    <div className="p-5 space-y-7">
      <section aria-labelledby="progress-heading">
        <h3 id="progress-heading" className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Progress
        </h3>
        {attempts === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center space-y-2">
            <BarChart3 className="w-6 h-6 mx-auto text-slate-400" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Answer practice questions to track your progress here.</p>
            <button type="button" onClick={onOpenPractice} className="text-sm font-semibold text-accent-700 dark:text-accent-300 hover:underline cursor-pointer">
              Open practice questions
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Answered', value: attempts },
                { label: 'Correct', value: correct },
                { label: 'Accuracy', value: `${Math.round((correct / attempts) * 100)}%` }
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                </div>
              ))}
            </div>
            {practiced.map(({ subject, topics }) => (
              <div key={subject.id} className="mt-4">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {subject.icon} {subject.label}
                </h4>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topics.map((t) => (
                    <li key={t.topicId} className="flex items-center justify-between gap-2 py-2">
                      <span className="min-w-0">
                        <span className="block text-sm text-slate-900 dark:text-white truncate">{t.title}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {t.correct} of {t.attempts} correct
                        </span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${STATUS[t.status].className}`}>
                        {STATUS[t.status].label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </section>

      <section aria-labelledby="data-heading" className="space-y-2">
        <h3 id="data-heading" className="text-sm font-semibold text-slate-900 dark:text-white">
          Your data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your notes, chats, Avatars, goals and progress are saved only in this browser. Clearing your browsing data deletes them, so
          keep a backup. Last backup: <span className="font-medium text-slate-700 dark:text-slate-300">{lastBackup ? new Date(lastBackup).toLocaleDateString() : 'never'}</span>.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onExportBackup}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            Save backup
          </button>
          <button
            type="button"
            onClick={() => restoreInput.current?.click()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Upload className="w-4 h-4 shrink-0" />
            Restore backup
          </button>
          <input
            ref={restoreInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Choose a backup file to restore"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onRestoreBackup(file);
              e.target.value = '';
            }}
          />
        </div>
      </section>

      <section aria-labelledby="settings-heading" className="space-y-4">
        <h3 id="settings-heading" className="text-sm font-semibold text-slate-900 dark:text-white">
          Settings
        </h3>
        <div>
          <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Theme</span>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800" role="radiogroup" aria-label="Theme">
            {(
              [
                { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={theme === opt.id}
                onClick={() => onChangeTheme(opt.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm cursor-pointer ${
                  theme === opt.id ? 'bg-white dark:bg-slate-700 shadow-sm font-medium text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={onRemoveModel}
            className="w-full text-left px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Remove downloaded AI model
            <span className="block text-xs text-slate-500 dark:text-slate-400">Frees about 1.1–1.3 GB. You can download it again from Models.</span>
          </button>
          <button
            type="button"
            onClick={onResetData}
            className="w-full text-left px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-sm text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            Delete my notes, chats and progress
            <span className="block text-xs text-rose-600/80 dark:text-rose-400/80">Removes everything you added on this device. The AI model is kept.</span>
          </button>
        </div>
      </section>

      <section aria-labelledby="faq-heading">
        <h3 id="faq-heading" className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          FAQs
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-2.5">
              <summary className="flex items-center justify-between gap-2 cursor-pointer list-none text-sm text-slate-800 dark:text-slate-200">
                {f.q}
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          <a href="privacy.html" className="underline">
            Privacy
          </a>{' '}
          ·{' '}
          <a href="about.html" className="underline">
            About Avatar Network
          </a>
        </p>
      </section>
    </div>
  );
};
