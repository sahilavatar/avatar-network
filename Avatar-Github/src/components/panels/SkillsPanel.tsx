import React, { useState } from 'react';
import { Calculator, GraduationCap, Sparkles, Trash2 } from 'lucide-react';
import { Persona } from '../../types';
import { BUILT_IN_SKILLS, Skill } from '../../services/skills';

interface SkillsPanelProps {
  persona: Persona;
  customSkills: Skill[];
  enabledIds: string[];
  onToggle: (skillId: string) => void;
  onAddCustom: (name: string, instructions: string) => void;
  onDeleteCustom: (skillId: string) => void;
}

const input =
  'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500';

export const SkillsPanel: React.FC<SkillsPanelProps> = ({ persona, customSkills, enabledIds, onToggle, onAddCustom, onDeleteCustom }) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const enabled = new Set(enabledIds);

  const Row = ({ skill }: { skill: Skill }) => (
    <li className="flex items-start gap-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{skill.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{skill.description}</p>
      </div>
      {skill.custom && (
        <button
          type="button"
          onClick={() => onDeleteCustom(skill.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
          aria-label={`Delete skill "${skill.name}"`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled.has(skill.id)}
        aria-label={`${skill.name} for ${persona.name}`}
        onClick={() => onToggle(skill.id)}
        className={`relative w-9 h-5 rounded-full shrink-0 mt-0.5 transition-colors cursor-pointer ${enabled.has(skill.id) ? 'bg-accent-600' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled.has(skill.id) ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </li>
  );

  const sections = [
    {
      title: 'Calculators',
      icon: <Calculator className="w-4 h-4" />,
      note: 'Exact answers with worked steps. When one matches a question, it answers instead of the AI.',
      skills: BUILT_IN_SKILLS.filter((s) => s.kind === 'calculator')
    },
    {
      title: 'Teaching skills',
      icon: <GraduationCap className="w-4 h-4" />,
      note: 'Change how the Avatar answers.',
      skills: BUILT_IN_SKILLS.filter((s) => s.kind === 'instruction')
    },
    {
      title: 'Your skills',
      icon: <Sparkles className="w-4 h-4" />,
      note: 'Instructions you write. Available to every Avatar; switch them on per Avatar.',
      skills: customSkills
    }
  ];

  return (
    <div className="p-5 space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400">Choose what {persona.name} can do. Changes apply to {persona.name.split(' ')[0]} only.</p>

      {sections.map((section) => (
        <section key={section.title} aria-label={section.title}>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
            {section.icon}
            {section.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{section.note}</p>
          {section.skills.length > 0 && (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {section.skills.map((skill) => (
                <Row key={skill.id} skill={skill} />
              ))}
            </ul>
          )}
        </section>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !instructions.trim()) return;
          onAddCustom(name, instructions);
          setName('');
          setInstructions('');
        }}
        className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
      >
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Create a skill</h3>
        <label className="block">
          <span className="sr-only">Skill name</span>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name, e.g. Spanish practice" maxLength={40} />
        </label>
        <label className="block">
          <span className="sr-only">Instructions</span>
          <textarea
            className={`${input} resize-none`}
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="What should the Avatar do? e.g. Reply in simple Spanish and translate key terms."
            maxLength={300}
          />
        </label>
        <button
          type="submit"
          disabled={!name.trim() || !instructions.trim()}
          className="w-full py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-40 text-white text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
        >
          Add skill to {persona.name.split(' ')[0]}
        </button>
      </form>
    </div>
  );
};
