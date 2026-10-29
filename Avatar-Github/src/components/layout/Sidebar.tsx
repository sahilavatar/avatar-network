import React from 'react';
import { Cpu, Info, SquarePen, Trash2 } from 'lucide-react';
import { Persona, SubjectId } from '../../types';
import { Conversation, groupByRecency } from '../../services/conversations';
import { AvatarImage } from '../ui/overlays';
import { ProgressRing } from '../ui/ProgressRing';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  personas: Partial<Record<SubjectId, Persona>>;
  modelReady: boolean;
  // Download progress while the model loads, otherwise null
  modelProgress: number | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenModels: () => void;
}

const navButton =
  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer';

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  personas,
  modelReady,
  modelProgress,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onOpenModels
}) => {
  const groups = groupByRecency(conversations);

  return (
    <nav className="h-full flex flex-col" aria-label="Chats">
      <div className="px-4 pt-4 pb-3 flex items-center gap-2.5">
        <img src="brand/icon-192.png" alt="" width={28} height={28} className="w-7 h-7 rounded-lg ring-1 ring-black/10 dark:ring-white/10" />
        <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">Avatar Network</span>
      </div>

      <div className="px-2 space-y-0.5">
        <button type="button" onClick={onNewChat} className={navButton}>
          <SquarePen className="w-[18px] h-[18px]" />
          New chat
        </button>
        <button type="button" onClick={onOpenModels} className={navButton}>
          <Cpu className="w-[18px] h-[18px]" />
          <span className="flex-1 text-left">Models</span>
          {modelProgress !== null ? (
            <ProgressRing pct={modelProgress} size={16} label={`Downloading model, ${modelProgress}%`} />
          ) : (
            <span
              className={`w-2 h-2 rounded-full ${modelReady ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              aria-label={modelReady ? 'Model ready' : 'Model not loaded'}
            />
          )}
        </button>
        <a href="about.html" className={navButton}>
          <Info className="w-[18px] h-[18px]" />
          About
        </a>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
        {groups.length === 0 && <p className="px-3 py-2 text-xs text-slate-400">Your chats will appear here.</p>}
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <h3 className="px-3 py-1 text-[11px] font-semibold text-slate-400">{group.label}</h3>
            <ul>
              {group.items.map((c) => {
                const persona = personas[c.avatarId];
                const active = c.id === activeConversationId;
                return (
                  <li key={c.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => onSelectConversation(c.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full flex items-center gap-2.5 pl-3 pr-9 py-2 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {persona && <AvatarImage src={persona.avatarUrl} emoji={persona.avatar} name={persona.name} size={18} rounded="rounded-full" decorative />}
                      <span className="truncate">{c.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteConversation(c.id)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                      aria-label={`Delete chat "${c.title}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};
