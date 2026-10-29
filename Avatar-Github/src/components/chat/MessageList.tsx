import React, { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ExternalLink, Calculator } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, Persona } from '../../types';
import { naturalizeConversationalText } from '../../services/conversationalSpeech';
import { AvatarImage } from '../ui/overlays';

/**
 * Render message content conversationally without raw asterisks or rigid markdown leaks
 */
function renderConversationalContent(text: string, isUser: boolean) {
  if (!text) return null;
  const clean = isUser ? text : naturalizeConversationalText(text);
  const paragraphs = clean.split(/\n\n+/);

  return (
    <div className="space-y-3 font-sans">
      {paragraphs.map((p, pIdx) => {
        const trimmed = p.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          return (
            <h4 key={pIdx} className="font-semibold text-slate-900 dark:text-white mt-1">
              {trimmed.replace(/^#+\s+/, '')}
            </h4>
          );
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={pIdx} className="pl-3 py-1 border-l-2 border-accent-400 text-slate-600 dark:text-slate-300 italic">
              {formatInlineSpans(trimmed.replace(/^>\s+/, ''))}
            </blockquote>
          );
        }

        const lines = trimmed.split('\n');
        return (
          <p key={pIdx}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {formatInlineSpans(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parse and render inline spans (bold, italic, code, math)
 */
function formatInlineSpans(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|(?<![\w*])\*[^*\s](?:[^*\n]*[^*\s])?\*(?![\w*])|\$[^$]+\$)/g);

  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded-md text-[0.9em] font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && part.length >= 3) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      return (
        <span key={idx} className="font-mono text-[0.92em] px-1 rounded bg-accent-50 dark:bg-accent-950/50 text-accent-800 dark:text-accent-200">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

interface MessageListProps {
  messages: ChatMessage[];
  persona: Persona;
  isGenerating: boolean;
  onOpenPassage: (passageId: string) => void;
  onAnswerQuiz: (messageId: string, optionIndex: number) => void;
  // Content for role 'setup' messages; null hides the message
  renderSetup?: (msg: ChatMessage) => React.ReactNode;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, persona, isGenerating, onOpenPassage, onAnswerQuiz, renderSetup }) => {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isGenerating]);

  const last = messages[messages.length - 1];
  const waitingForFirstToken = isGenerating && !(last?.role === 'persona' && (last.text || last.toolExecution));

  return (
    <div className="space-y-7 pb-6" aria-live="polite">
      {messages.map((msg) => {
        if (msg.role === 'persona' && !msg.text && !msg.toolExecution) return null;

        if (msg.role === 'setup') {
          const content = renderSetup?.(msg);
          if (!content) return null;
          return (
            <div key={msg.id} className="flex items-start gap-3 animate-fade-in">
              <AvatarImage src={persona.avatarUrl} emoji={persona.avatar} name={persona.name} size={28} />
              <div className="flex-1 min-w-0 text-[15px] leading-7 text-slate-800 dark:text-slate-200">{content}</div>
            </div>
          );
        }

        if (msg.role === 'system') {
          return (
            <p key={msg.id} className="text-center text-xs text-slate-400 dark:text-slate-500">
              {msg.text}
            </p>
          );
        }

        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[15px] leading-7 whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          );
        }

        if (msg.role === 'quiz' && msg.quizData) {
          const q = msg.quizData.question;
          const { answered, selectedOptionIndex } = msg.quizData;
          return (
            <div key={msg.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-accent-700 dark:text-accent-300">Practice question</span>
                <span className="text-slate-500 dark:text-slate-400 truncate">{q.sourceTitle || q.passageSnippet}</span>
              </div>
              <p className="text-[15px] font-medium text-slate-900 dark:text-white leading-7">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  let style = 'border-slate-200 dark:border-slate-700 hover:border-accent-400 hover:bg-accent-50/50 dark:hover:bg-accent-950/30';
                  if (answered) {
                    if (opt.isCorrect) style = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-700';
                    else if (idx === selectedOptionIndex) style = 'border-rose-300 bg-rose-50 dark:bg-rose-950/50 dark:border-rose-800';
                    else style = 'border-slate-200 dark:border-slate-800 opacity-60';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={answered || isGenerating}
                      onClick={() => {
                        onAnswerQuiz(msg.id, idx);
                        if (opt.isCorrect) {
                          try {
                            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
                          } catch {
                            // Decorative only
                          }
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-sm flex items-start gap-3 transition-colors cursor-pointer disabled:cursor-default text-slate-800 dark:text-slate-200 ${style}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold shrink-0">
                        {opt.label}
                      </span>
                      <span className="flex-1 pt-0.5">{opt.text}</span>
                      {answered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {answered && idx === selectedOptionIndex && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {answered && q.explanation && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-6 whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-3">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        }

        // Avatar reply
        return (
          <div key={msg.id} className="flex items-start gap-3">
            <AvatarImage src={persona.avatarUrl} emoji={persona.avatar} name={persona.name} size={28} />
            <div className="flex-1 min-w-0 text-[15px] leading-7 text-slate-800 dark:text-slate-200">
              {msg.toolExecution && (
                <div className="mb-3 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                      <Calculator className="w-3.5 h-3.5" />
                      {msg.toolExecution.toolName.replace(/^JavaScript /, '')}
                    </span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">Exact</span>
                  </div>
                  <div className="px-3 py-2.5 font-mono text-sm font-semibold text-slate-900 dark:text-white">{msg.toolExecution.result}</div>
                  {msg.toolExecution.steps.length > 0 && (
                    <ol className="px-3 pb-3 pl-8 list-decimal space-y-0.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {msg.toolExecution.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  )}
                </div>
              )}

              {renderConversationalContent(msg.text, false)}

              {msg.citations?.[0]?.excerpt && (
                <button
                  type="button"
                  onClick={() => onOpenPassage(msg.citations![0].passageId)}
                  className="mt-3 w-full text-left pl-3 py-2 pr-2 border-l-2 border-accent-400 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg text-[13px] leading-5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="block font-semibold text-accent-700 dark:text-accent-300 mb-0.5">From {msg.citations[0].label}</span>
                  “{msg.citations[0].excerpt}”
                </button>
              )}

              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {msg.citations.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onOpenPassage(c.passageId)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:border-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors cursor-pointer"
                      title="Open this passage"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              {msg.aiGenerated && msg.text && (
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {msg.citations?.length
                    ? 'AI answer from your notes, generated on your device. It can make mistakes, so check it against the sources.'
                    : 'General knowledge, not from your notes. AI answer generated on your device; it can make mistakes.'}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {waitingForFirstToken && (
        <div className="flex items-center gap-3">
          <AvatarImage src={persona.avatarUrl} emoji={persona.avatar} name={persona.name} size={28} />
          <div className="flex items-center gap-1.5" aria-label={`${persona.name} is thinking`}>
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce [animation-delay:0.15s]" />
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};
