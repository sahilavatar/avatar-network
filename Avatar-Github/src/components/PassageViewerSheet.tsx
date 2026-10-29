import React, { useEffect } from 'react';
import { Passage, SourceDocument } from '../types';
import { X, BookOpen, HelpCircle, ShieldCheck } from 'lucide-react';

interface PassageViewerSheetProps {
  passage: Passage | null;
  sources: SourceDocument[];
  onClose: () => void;
  onQuizPassage: (passage: Passage) => void;
  highlightTerms?: string[];
}

export const PassageViewerSheet: React.FC<PassageViewerSheetProps> = ({
  passage,
  sources,
  onClose,
  onQuizPassage,
  highlightTerms = []
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (passage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passage, onClose]);

  if (!passage) return null;

  const sourceDoc = sources.find(s => s.id === passage.srcId);

  // Highlight keywords in passage text
  const renderHighlightedText = (text: string) => {
    if (!highlightTerms.length) return text;

    const regex = new RegExp(`\\b(${highlightTerms.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = highlightTerms.some(t => t.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={i}
            className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1 py-0.5 rounded font-semibold"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-800 animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-accent-600 dark:text-accent-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{sourceDoc?.shortTitle || passage.sourceTitle}</span>
              {passage.page && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Page {passage.page}</span>
                </>
              )}
            </div>
            <h2 id="sheet-title" className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {passage.section}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close passage viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <p className="whitespace-pre-line font-normal">
              {renderHighlightedText(passage.text)}
            </p>
          </div>

          {/* Metadata & Vector Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Embedding Dimension</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">256-d Dense Float32</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Passage Token Size</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">~{passage.tokens} tokens</span>
            </div>
          </div>

          {/* Privacy & Attribution Notice */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Local On-Device Retrieval</p>
              <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                Author: {sourceDoc?.author || 'Unknown'}. License: {sourceDoc?.license || 'Unknown'}. Vectorized and stored exclusively inside your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onQuizPassage(passage);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz me on this passage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
