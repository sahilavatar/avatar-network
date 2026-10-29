import React, { useState, useRef } from 'react';
import { SubjectId, CreateAvatarPayload } from '../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  FileText,
  Check,
  Plus,
  Trash2,
  HelpCircle,
  Brain,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

interface CreateAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAvatar: (payload: CreateAvatarPayload) => void;
  existingSubjects: { id: SubjectId; label: string; icon: string }[];
}

const PRESET_EMOJIS = ['🎓', '🚀', '🔬', '🧠', '🏛️', '💻', '🎨', '🌌', '⚡', '📐', '📜', '⚗️'];

const PRESET_INSTRUCTION_TEMPLATES = [
  {
    label: 'Socratic Guide',
    text: 'Adopt a rigorous Socratic questioning style. Never give formulas or answers immediately; instead ask guided diagnostic questions that illuminate principles from first principles.'
  },
  {
    label: 'Exam Drillmaster',
    text: 'Focus on high-yield AP/standardized exam test-taking strategies. Break down tricky distractor choices, enforce precise terminology, and provide fast rubric scoring.'
  },
  {
    label: 'Intuitive Visualizer',
    text: 'Explain concepts through physical analogies, intuitive spatial reasoning, and real-world mechanisms before diving into technical jargon or formulas.'
  },
  {
    label: 'Patient Mentor',
    text: 'Maintain an encouraging, supportive, and accessible tone. Scaffolds complex ideas step-by-step with checkpoints to build student confidence.'
  }
];

const DEFAULT_TASK_SUGGESTIONS = [
  'Concept Deep-Dives',
  'Practice Problems',
  'Exam & FRQ Review',
  'Homework Diagnostics',
  'Step-by-Step Derivations',
  'Primary Source Analysis'
];

export const CreateAvatarModal: React.FC<CreateAvatarModalProps> = ({
  isOpen,
  onClose,
  onCreateAvatar,
  existingSubjects
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarEmoji, setAvatarEmoji] = useState('🎓');
  
  // Subject config
  const [subjectMode, setSubjectMode] = useState<'existing' | 'new'>('existing');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(
    existingSubjects[0]?.id || 'algebra'
  );
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('📚');

  // Instructions & Persona
  const [customInstructions, setCustomInstructions] = useState('');
  const [quote, setQuote] = useState('');
  const [toneDescription, setToneDescription] = useState('Inquisitive and rigorous');

  // Tasks
  const [selectedTasks, setSelectedTasks] = useState<string[]>([
    'Concept Deep-Dives',
    'Practice Problems'
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Supporting docs
  const [supportingDocTitle, setSupportingDocTitle] = useState('');
  const [supportingDocContent, setSupportingDocContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle avatar image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle document file upload (.txt, .md, .json, .csv)
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (!supportingDocTitle) {
        setSupportingDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSupportingDocContent(reader.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleToggleTask = (task: string) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter((t) => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskInput.trim() && !selectedTasks.includes(newTaskInput.trim())) {
      setSelectedTasks([...selectedTasks, newTaskInput.trim()]);
      setNewTaskInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: CreateAvatarPayload = {
      name: name.trim(),
      title: title.trim() || 'AI Teaching Fellow',
      avatarUrl: avatarUrl || undefined,
      avatarEmoji,
      subjectMode,
      subjectId: selectedSubjectId,
      newSubjectName: subjectMode === 'new' ? newSubjectName.trim() || 'Custom Studies' : undefined,
      newSubjectIcon: subjectMode === 'new' ? newSubjectIcon || '📚' : undefined,
      bio: customInstructions.trim() || `Personalized AI tutor specializing in ${subjectMode === 'new' ? newSubjectName : selectedSubjectId}.`,
      quote: quote.trim() || 'Let us explore and master this together.',
      customInstructions: customInstructions.trim(),
      tasks: selectedTasks,
      accentColor: '#6366f1',
      toneDescription: toneDescription.trim() || 'Supportive and intellectually rigorous',
      supportingDocTitle: supportingDocTitle.trim() || undefined,
      supportingDocContent: supportingDocContent.trim() || undefined
    };

    onCreateAvatar(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-4 shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl text-indigo-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Create New Tutor Avatar</h2>
              <p className="text-xs text-indigo-200/80">
                Design a custom AI persona with specialized knowledge, teaching instructions, and documents
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Section 1: Avatar Visual & Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              1. Avatar & Identity
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              {/* Preview Circle */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full border-2 border-indigo-500 overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-md">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">{avatarEmoji}</span>
                  )}
                </div>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm cursor-pointer"
                    title="Remove custom photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Upload Actions & Emoji presets */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Upload Image</span>
                  </button>
                  <span className="text-xs text-slate-400">or choose an emoji avatar:</span>
                </div>

                {/* Preset Emoji Picker */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setAvatarEmoji(emoji);
                        setAvatarUrl('');
                      }}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                        !avatarUrl && avatarEmoji === emoji
                          ? 'bg-indigo-100 dark:bg-indigo-900/60 ring-2 ring-indigo-500'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name and Title Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar / Tutor Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Maya Lin, Prof. Hawking, Coach Dave"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Title / Role
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quantum Physics Fellow & Socratic Mentor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Subject & Tasks */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              2. Subject & Focus Tasks
            </h3>

            {/* Subject Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setSubjectMode('existing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  subjectMode === 'existing'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Choose Existing Subject
              </button>
              <button
                type="button"
                onClick={() => setSubjectMode('new')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  subjectMode === 'new'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Create Custom Subject
              </button>
            </div>

            {/* Existing Subject Picker */}
            {subjectMode === 'existing' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {existingSubjects.map((sub) => {
                  const isSelected = selectedSubjectId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-xl">{sub.icon}</span>
                      <span className="text-xs font-bold truncate">{sub.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom Subject Form */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Subject Name *
                  </label>
                  <input
                    type="text"
                    required={subjectMode === 'new'}
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="e.g. Astrophysics, Microeconomics, Philosophy"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Emoji Icon
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={newSubjectIcon}
                    onChange={(e) => setNewSubjectIcon(e.target.value)}
                    placeholder="e.g. 🔭"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-center text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Focus Tasks Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Specialized Tasks & Objectives
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {DEFAULT_TASK_SUGGESTIONS.map((task) => {
                  const active = selectedTasks.includes(task);
                  return (
                    <button
                      key={task}
                      type="button"
                      onClick={() => handleToggleTask(task)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {task}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Task input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTask(e);
                    }
                  }}
                  placeholder="Add custom task (e.g. 'Lab Report Grading')..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTask}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Custom Instructions & Persona Behavior */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              3. Teaching Persona & Custom Instructions
            </h3>

            {/* Quick Templates */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">
                Quick persona presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_INSTRUCTION_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    type="button"
                    onClick={() => {
                      setCustomInstructions((prev) =>
                        prev ? `${prev}\n\n${tmpl.text}` : tmpl.text
                      );
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    <span>+ {tmpl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instructions Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom Instructions / System Prompt *
              </label>
              <textarea
                required
                rows={4}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Describe how this tutor should explain things, which pedagogical rules to follow, vocabulary preferences, or constraints..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Catchphrase & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Signature Motto / Catchphrase
                </label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="e.g. 'Every complex equation is just simple truths in disguise.'"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tone Descriptor
                </label>
                <input
                  type="text"
                  value={toneDescription}
                  onChange={(e) => setToneDescription(e.target.value)}
                  placeholder="e.g. Socratic, analytical, encouraging"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Supporting Documents & Knowledge Base */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                4. Supporting Documents & Knowledge Base (Optional)
              </h3>
              {supportingDocContent && (
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {supportingDocContent.length.toLocaleString()} chars loaded
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide textbook notes, a course syllabus, or reference material so your avatar can ground its answers with exact citations.
            </p>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              {/* Document Title & File Upload Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={supportingDocTitle}
                  onChange={(e) => setSupportingDocTitle(e.target.value)}
                  placeholder="Document Title (e.g. AP Bio Lecture Notes)"
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDocFileUpload}
                  accept=".txt,.md,.markdown,.json,.csv"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-xs cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{uploadedFileName ? 'Replace File' : 'Upload File (.txt, .md)'}</span>
                </button>
              </div>

              {uploadedFileName && (
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Loaded from: {uploadedFileName}</span>
                </div>
              )}

              {/* Direct Paste Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Paste Document Text Directly
                </label>
                <textarea
                  rows={4}
                  value={supportingDocContent}
                  onChange={(e) => setSupportingDocContent(e.target.value)}
                  placeholder="Paste syllabus, textbook excerpts, definitions, or exam guidelines here..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Tutor Avatar</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
