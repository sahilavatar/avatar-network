import React, { useCallback, useRef, useState } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { Persona, SubjectId } from '../../types';
import { AvatarImage, useDismiss } from '../ui/overlays';

export interface AvatarOption {
  id: SubjectId;
  persona: Persona;
  sample: boolean;
}

interface AvatarSwitcherProps {
  avatars: AvatarOption[];
  activeId: SubjectId;
  onSelect: (id: SubjectId) => void;
  onCreate: () => void;
}

/** Composer chip that switches Avatars without leaving the chat, like a model picker */
export const AvatarSwitcher: React.FC<AvatarSwitcherProps> = ({ avatars, activeId, onSelect, onCreate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const active = avatars.find((a) => a.id === activeId) ?? avatars[0];
  const groups = [
    { label: 'Your Avatars', items: avatars.filter((a) => !a.sample) },
    { label: 'Sample Avatars', items: avatars.filter((a) => a.sample) }
  ].filter((g) => g.items.length > 0);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Avatar: ${active?.persona.name}. Change Avatar`}
        className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer max-w-[11rem]"
      >
        {active && <AvatarImage src={active.persona.avatarUrl} emoji={active.persona.avatar} name={active.persona.name} size={22} rounded="rounded-full" decorative />}
        <span className="truncate">{active?.persona.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Avatars"
          className="absolute bottom-full mb-2 left-0 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1.5 z-40 animate-fade-in"
        >
          <div className="max-h-80 overflow-y-auto">
            {groups.map((group) => (
              <div key={group.label} className="py-1">
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{group.label}</div>
                {group.items.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="option"
                    aria-selected={a.id === activeId}
                    onClick={() => {
                      onSelect(a.id);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <AvatarImage src={a.persona.avatarUrl} emoji={a.persona.avatar} name={a.persona.name} size={30} rounded="rounded-full" decorative />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-slate-900 dark:text-white truncate">{a.persona.name}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">{a.persona.title}</span>
                    </span>
                    {a.id === activeId && <Check className="w-4 h-4 text-accent-600 shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onCreate();
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-xl border-t border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span className="w-[30px] h-[30px] rounded-full border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </span>
            Create Avatar
          </button>
        </div>
      )}
    </div>
  );
};
