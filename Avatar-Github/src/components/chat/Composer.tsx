import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Plus, Square } from 'lucide-react';

interface ComposerProps {
  placeholder: string;
  // Sending needs the chat model; uploading and switching don't
  canSend: boolean;
  isGenerating: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onUploadFiles: (files: FileList) => void;
  // Avatar switcher and notebook controls, rendered next to the upload button
  controls: React.ReactNode;
  // Ambient status shown next to the send button, e.g. download progress
  status?: React.ReactNode;
}

export const Composer: React.FC<ComposerProps> = ({ placeholder, canSend, isGenerating, onSend, onStop, onUploadFiles, controls, status }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Grow with the content up to a limit, like frontier chat apps
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  const submit = () => {
    const value = text.trim();
    if (!value || !canSend || isGenerating) return;
    onSend(value);
    setText('');
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus-within:border-slate-300 dark:focus-within:border-slate-600 transition-colors">
      <label htmlFor="composer-input" className="sr-only">
        Message
      </label>
      <textarea
        id="composer-input"
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        className="block w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-[15px] leading-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
      />
      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <div className="flex items-center gap-0.5 min-w-0">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Upload notes (PDF, TXT, MD)"
            title="Upload notes"
          >
            <Plus className="w-5 h-5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.txt,.md"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) onUploadFiles(e.target.files);
              e.target.value = '';
            }}
          />
          {controls}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {status}
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Stop generating"
              title="Stop"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim() || !canSend}
              className="w-9 h-9 rounded-full bg-accent-600 hover:bg-accent-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
