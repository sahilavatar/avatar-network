import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, SquarePen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubjectId, TeachingStyle, ChatMessage, SourceDocument, Passage, TopicMastery, QuizQuestion, Persona, CreateAvatarPayload } from './types';
import { EXPERT_PERSONAS, INITIAL_SOURCES, INITIAL_PASSAGES, INITIAL_TOPIC_MASTERY } from './data/curriculumData';
import { TUTOR_KNOWLEDGE_FOLDERS } from './data/knowledgeFolders';
import { searchVectorIndex } from './services/embeddingGemma';
import {
  generateTutorResponse,
  generateQuizFeedback,
  generateGroundedQuiz,
  selectRelevantHits,
  determineAdaptiveStyle,
  contextUsage,
  asksAboutOwnNotes,
  asksAboutNotebookAccess,
  describeNotebook
} from './services/gemmaGeneration';
import { aiWorkerClient, ModelWorkerState } from './services/aiWorkerClient';
import { getPassageVectors } from './services/embeddingCache';
import { resolveConversationalContext } from './services/textSearch';
import { chunkDocumentText, saveUpload, updateUploadSource, deleteUpload, clearUploads, loadUploads } from './services/vectorStore';
import { extractTextFromPdf } from './services/pdfExtractor';
import { stripPdfBoilerplate } from './services/textCleanup';
import { generateQuizFromContext, findCuratedQuizQuestion } from './services/quizGenerator';
import { parseExamQuestions, chunkDocumentPreservingQuestions } from './services/examParser';
import { recordAnswer, accuracyForStyle, loadProgress, saveProgress } from './services/progress';
import { dispatchNativeJsTool } from './services/nativeEngines/engineDispatcher';
import { applyAccentTheme } from './services/accentTheme';
import {
  Conversation,
  newConversation,
  loadConversations,
  saveConversation,
  deleteConversation,
  clearConversations
} from './services/conversations';
import { Goal, loadGoals, saveGoals, goalPromptLines } from './services/goals';
import { createBackup, backupFileName, parseBackup, describeBackup, restoreBackup, readLastBackup, markBackedUp } from './services/backup';
import {
  SkillsState,
  loadSkills,
  saveSkills,
  toggleSkill,
  addCustomSkill,
  removeCustomSkill,
  enabledSkillIds,
  enabledCalculators,
  skillInstructions,
  emptySkillsState
} from './services/skills';
import { Sidebar } from './components/layout/Sidebar';
import { RightRail, RightPanelId, RIGHT_PANELS } from './components/layout/RightRail';
import { MessageList } from './components/chat/MessageList';
import { Composer } from './components/chat/Composer';
import { AvatarSwitcher, AvatarOption } from './components/chat/AvatarSwitcher';
import { NotebookPopover } from './components/chat/NotebookPopover';
import { EmptyState } from './components/chat/EmptyState';
import { GoalsPanel } from './components/panels/GoalsPanel';
import { SkillsPanel } from './components/panels/SkillsPanel';
import { MyAvatarPanel, ThemePreference } from './components/panels/MyAvatarPanel';
import { ModelsModal } from './components/ModelsModal';
import { Sheet } from './components/ui/overlays';
import { ProgressRing } from './components/ui/ProgressRing';
import { SetupCard } from './components/onboarding/SetupCard';
import { useDeviceReport } from './components/onboarding/useSetupState';
import { downloadBytesFor, formatGb } from './services/modelConfig';
import { PassageViewerSheet } from './components/PassageViewerSheet';
import { KnowledgeFolderModal } from './components/KnowledgeFolderModal';
import { CreateAvatarModal } from './components/CreateAvatarModal';

const SAMPLE_SUBJECTS: { id: SubjectId; label: string; icon: string }[] = [
  { id: 'algebra', label: 'Algebra', icon: '📐' },
  { id: 'biology', label: 'Biology', icon: '🧬' },
  { id: 'history', label: 'History', icon: '🏛️' },
  { id: 'chemistry', label: 'Chemistry', icon: '⚗️' }
];

const THEME_KEY = 'avatar_theme';

function loadThemePreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    // Earlier versions stored an explicit toggle as lumen_dark
    const legacy = localStorage.getItem('lumen_dark');
    if (legacy !== null) return legacy === 'true' ? 'dark' : 'light';
  } catch {
    // Storage unavailable: follow the OS
  }
  return 'system';
}

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // Unreadable storage: use the fallback
  }
  return fallback;
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable; the change lasts for this visit
  }
};

export default function App() {
  // Theme
  const [theme, setTheme] = useState<ThemePreference>(loadThemePreference);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches));
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  const changeTheme = (next: ThemePreference) => {
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
      localStorage.removeItem('lumen_dark');
    } catch {
      // Storage unavailable; the choice lasts for this visit
    }
  };

  // Avatars
  const [currentSubject, setCurrentSubject] = useState<SubjectId>('notes');
  const [customPersonas, setCustomPersonas] = useState<Record<string, Persona>>(() => readJson('lumen_custom_personas', {}));
  const [customSubjects, setCustomSubjects] = useState<{ id: SubjectId; label: string; icon: string }[]>(() => readJson('lumen_custom_subjects', []));
  const allSubjects = [{ id: 'notes' as SubjectId, label: 'My Notes', icon: '📝' }, ...SAMPLE_SUBJECTS, ...customSubjects];
  const allPersonas: Record<SubjectId, Persona> = { ...EXPERT_PERSONAS, ...customPersonas };
  const sampleIds = new Set(SAMPLE_SUBJECTS.map((s) => s.id));
  const avatarOptions: AvatarOption[] = allSubjects
    .filter((s) => allPersonas[s.id])
    .map((s) => ({ id: s.id, persona: allPersonas[s.id], sample: sampleIds.has(s.id) }));

  // Knowledge
  const [sources, setSources] = useState<SourceDocument[]>(INITIAL_SOURCES);
  const [passages, setPassages] = useState<Passage[]>(INITIAL_PASSAGES);

  // Progress, goals and skills
  const [masteryData, setMasteryData] = useState<Record<SubjectId, TopicMastery[]>>(() => loadProgress(INITIAL_TOPIC_MASTERY));
  useEffect(() => saveProgress(masteryData), [masteryData]);
  const [goals, setGoals] = useState<Goal[]>(loadGoals);
  useEffect(() => saveGoals(goals), [goals]);
  const [skills, setSkills] = useState<SkillsState>(loadSkills);
  useEffect(() => saveSkills(skills), [skills]);

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const savedVersions = useRef(new Map<string, number>());
  useEffect(() => {
    let cancelled = false;
    loadConversations()
      .then((saved) => {
        if (cancelled) return;
        saved.forEach((c) => savedVersions.current.set(c.id, c.updatedAt));
        setConversations((prev) => [...prev, ...saved.filter((c) => !prev.some((p) => p.id === c.id))]);
      })
      .catch((err) => console.warn('Could not load saved chats:', err));
    return () => {
      cancelled = true;
    };
  }, []);
  // Persist chats whose content changed; streaming tokens don't bump updatedAt, so they're saved once complete
  useEffect(() => {
    conversations.forEach((c) => {
      if (savedVersions.current.get(c.id) === c.updatedAt) return;
      savedVersions.current.set(c.id, c.updatedAt);
      saveConversation(c).catch((err) => console.warn('Could not save chat:', err));
    });
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;
  const messages = activeConversation?.messages ?? [];

  const updateConversation = (id: string, fn: (c: Conversation) => Conversation) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  const appendTo = (id: string, msg: ChatMessage) =>
    updateConversation(id, (c) => ({ ...c, messages: [...c.messages, msg], updatedAt: Date.now() }));
  const patchIn = (id: string, msgId: string, patch: Partial<ChatMessage>, done = false) =>
    updateConversation(id, (c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === msgId ? { ...m, ...patch } : m)),
      updatedAt: done ? Date.now() : c.updatedAt
    }));
  /** The open chat if it belongs to this Avatar, otherwise a new one */
  const ensureConversation = (subject: SubjectId, firstText: string): string => {
    if (activeConversation && activeConversation.avatarId === subject) return activeConversation.id;
    const created = newConversation(subject, firstText);
    setConversations((prev) => [created, ...prev]);
    setActiveConversationId(created.id);
    return created.id;
  };

  // Model
  const [modelState, setModelState] = useState<ModelWorkerState>(aiWorkerClient.getState());
  useEffect(() => {
    const unsubscribe = aiWorkerClient.subscribe(setModelState);
    // Returning visitors load the models from the browser cache automatically
    if (aiWorkerClient.getState().previouslyDownloaded) aiWorkerClient.start().catch(() => undefined);
    return unsubscribe;
  }, []);
  const modelReady = modelState.status === 'ready';
  const modelLoading = modelState.status === 'loading';
  const device = useDeviceReport();
  const startModel = () => aiWorkerClient.start().catch(() => undefined);

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [followUpChips, setFollowUpChips] = useState<string[]>([]);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState<RightPanelId | null>(null);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [createAvatarOpen, setCreateAvatarOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [viewingPassage, setViewingPassage] = useState<Passage | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);
  const showNotice = useCallback((text: string) => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  }, []);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Load saved uploads (all Avatars) after the built-in sample notebooks
  useEffect(() => {
    let cancelled = false;
    loadUploads()
      .then(({ sources: saved, passages: savedPassages }) => {
        if (cancelled || saved.length === 0) return;
        setSources((prev) => [...prev, ...saved.filter((src) => !prev.some((p) => p.id === src.id))]);
        setPassages((prev) => [...prev, ...savedPassages.filter((p) => !prev.some((q) => q.id === p.id))]);
      })
      .catch((err) => console.warn('Could not load saved uploads:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  const currentPersona = allPersonas[currentSubject] || EXPERT_PERSONAS.notes;
  const hasPracticeBank = !!TUTOR_KNOWLEDGE_FOLDERS[currentSubject];
  const avatarSources = sources.filter((s) => s.subject === currentSubject);
  const enabledSourceIds = new Set(sources.filter((s) => s.enabled).map((s) => s.id));
  const activePassagesFor = (subject: SubjectId) => passages.filter((p) => p.subject === subject && enabledSourceIds.has(p.srcId));
  const activeNotesCount = activePassagesFor(currentSubject).length;
  const avatarGoals = goals.filter((g) => g.avatarId === currentSubject);
  const teachingStyleFor = (subject: SubjectId): TeachingStyle => determineAdaptiveStyle(accuracyForStyle(masteryData[subject] || []));

  // Tint the interface with the active Avatar's color
  useEffect(() => {
    applyAccentTheme(currentPersona.accentColor);
  }, [currentPersona.accentColor]);

  // Embed the active Avatar's passages in the background so the first question doesn't wait on them
  useEffect(() => {
    if (!modelReady) return;
    getPassageVectors(passages.filter((p) => p.subject === currentSubject)).catch((err) => console.warn('Background embedding failed:', err));
  }, [modelReady, currentSubject, passages]);

  // ---- Knowledge ----

  const handleToggleSource = (sourceId: string) => {
    const target = sources.find((src) => src.id === sourceId);
    if (!target) return;
    const toggled = { ...target, enabled: !target.enabled };
    setSources((prev) => prev.map((src) => (src.id === sourceId ? toggled : src)));
    if (toggled.kind === 'upload') updateUploadSource(toggled).catch((err) => console.warn('Could not save change:', err));
  };

  /** Adds files to an Avatar's notebook: the current one, or a just-created one whose persona isn't in state yet */
  const handleFileUpload = async (fileList: FileList | File[], target?: { subject: SubjectId; name: string }) => {
    const subject = target?.subject ?? currentSubject;
    const notebookOwner = target?.name ?? allPersonas[subject]?.name ?? 'your';
    const newSources: SourceDocument[] = [];
    const newPassages: Passage[] = [];

    for (const [fIdx, file] of Array.from(fileList).entries()) {
      try {
        const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');
        // PDFs lose running headers, contents pages and near-empty pages before they're split into passages
        const text = isPdf ? stripPdfBoilerplate(await extractTextFromPdf(file)) : await file.text();
        if (!text || text.trim().length < 20) {
          showNotice(`Couldn't find readable text in ${file.name}`);
          continue;
        }
        const docId = `up-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}-${fIdx}`;
        const exam = parseExamQuestions(text, docId, file.name, subject);
        const chunks = chunkDocumentPreservingQuestions(text, docId, file.name, subject, exam.questions);
        newSources.push({
          id: docId,
          subject,
          title: file.name,
          shortTitle: file.name.length > 22 ? `${file.name.slice(0, 21)}…` : file.name,
          kind: 'upload',
          author: 'Your upload',
          license: 'Private On-Device',
          passagesCount: chunks.length,
          tokens: chunks.reduce((acc, c) => acc + c.tokens, 0),
          enabled: true,
          dateAdded: new Date().toLocaleDateString(),
          isExam: exam.isExam,
          parsedQuestions: exam.questions,
          docSummary: exam.summary
        });
        newPassages.push(...chunks);
        showNotice(
          exam.questions.length > 0
            ? `Added ${file.name} with ${exam.questions.length} practice questions`
            : `Added ${file.name} to ${notebookOwner}'s notebook`
        );
      } catch (err) {
        console.error('File parsing error:', err);
        showNotice(`Couldn't read ${file.name}`);
      }
    }

    if (newSources.length === 0) return;
    setSources((prev) => [...prev, ...newSources]);
    setPassages((prev) => [...prev, ...newPassages]);
    // Persist; the files stay usable for this visit even if the browser refuses to store them
    const results = await Promise.allSettled(newSources.map((src) => saveUpload(src, newPassages)));
    if (results.some((r) => r.status === 'rejected')) showNotice('Saved for this visit only — your browser storage is full or blocked');
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources((prev) => prev.filter((src) => src.id !== sourceId));
    setPassages((prev) => prev.filter((p) => p.srcId !== sourceId));
    deleteUpload(sourceId).catch((err) => console.warn('Could not delete saved upload:', err));
    showNotice('Removed from the notebook');
  };

  const handleOpenPassage = (passageId: string) => {
    const p = passages.find((item) => item.id === passageId);
    if (p) setViewingPassage(p);
  };
  const handleViewSource = (sourceId: string) => {
    const first = passages.find((p) => p.srcId === sourceId);
    if (first) setViewingPassage(first);
  };

  // ---- Chat ----

  // The question being answered right now; Stop marks it cancelled, even before the model starts
  const activeRequest = useRef<{ cancelled: boolean } | null>(null);
  const handleStop = () => {
    if (activeRequest.current) activeRequest.current.cancelled = true;
    aiWorkerClient.abort();
  };

  const handleSendMessage = (userText: string, subjectOverride?: SubjectId) => {
    const subject = subjectOverride ?? currentSubject;
    const previousHistory = activeConversation?.avatarId === subject ? activeConversation.messages : [];
    const convId = ensureConversation(subject, userText);
    appendTo(convId, { id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role: 'user', text: userText, timestamp: Date.now() });
    return respond(convId, subject, userText, previousHistory);
  };

  /** Answers a question already shown in the chat; also used for the question queued during setup */
  const respond = async (convId: string, subject: SubjectId, userText: string, previousHistory: ChatMessage[]) => {
    const persona = allPersonas[subject] || EXPERT_PERSONAS.notes;
    const teachingStyle = teachingStyleFor(subject);
    const append = (msg: ChatMessage) => appendTo(convId, msg);
    setFollowUpChips([]);
    setIsGenerating(true);
    const request = { cancelled: false };
    activeRequest.current = request;
    const stoppedNote = () => append({ id: `stopped-${Date.now()}`, role: 'system', text: 'Stopped.', timestamp: Date.now() });
    const responseId = `gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    // Calculators and practice questions work without the model; anything else waits for it
    const offerSetup = () => append({ id: `setup-${Date.now()}`, role: 'setup', text: '', timestamp: Date.now(), setup: { question: userText } });

    try {
      const activePassages = activePassagesFor(subject);
      const lower = userText.toLowerCase();
      const isQuizRequest = lower.includes('quiz me') || lower.includes('practice question') || lower.includes('test me on');

      // A calculator match is answered exactly and instantly; a 1B model adds nothing reliable to it
      const tool = isQuizRequest ? null : dispatchNativeJsTool(userText, subject, enabledCalculators(skills, subject));
      if (tool) {
        append({
          id: responseId,
          role: 'persona',
          text: `The built-in calculator worked this out exactly: ${tool.result}.`,
          timestamp: Date.now(),
          toolExecution: tool
        });
        setFollowUpChips(['Explain the method behind this answer', 'Give me a similar problem to try']);
        return;
      }

      // Keep follow-ups like "explain that in more depth" anchored to the previous topic
      const { resolvedSearchQuery, anchorTopic, isDeepDive, isClarification } = resolveConversationalContext(userText, previousHistory, undefined, activePassages);
      const retrieve = () => searchVectorIndex(resolvedSearchQuery, activePassages, subject, 3);

      if (isQuizRequest) {
        // Verified questions first (course banks, then curated); only then a model-written one from a passage
        let question = generateQuizFromContext(userText, activePassages, sources, subject) || findCuratedQuizQuestion(userText, persona);
        if (!question && !aiWorkerClient.isReady()) return offerSetup();
        if (!question) {
          const topPassage = selectRelevantHits(await retrieve())[0]?.passage;
          if (request.cancelled) return stoppedNote();
          if (topPassage) {
            showNotice(`${persona.name.split(' ')[0]} is writing a question…`);
            question = await generateGroundedQuiz(anchorTopic || userText, topPassage, subject);
            if (request.cancelled) return stoppedNote();
          }
        }
        append(
          question
            ? { id: `quiz-${Date.now()}`, role: 'quiz', text: 'Practice question', timestamp: Date.now(), quizData: { question, answered: false } }
            : {
                id: responseId,
                role: 'persona',
                text: "I couldn't find material on that topic to build a reliable question from. Try naming a topic from this Avatar's notebook, or add your notes and ask me to quiz you on them.",
                timestamp: Date.now()
              }
        );
        return;
      }

      // Nothing uploaded yet: say so plainly rather than let the model describe notes that don't exist
      const avatarUploads = sources.filter((s) => s.subject === subject && s.enabled);
      if (activePassages.length === 0 && asksAboutOwnNotes(userText)) {
        append({
          id: responseId,
          role: 'persona',
          text: `You haven't added any notes to ${persona.name.split(' ')[0]}'s notebook yet${avatarUploads.length === 0 && sources.some((s) => s.subject === subject) ? ' (or they are all switched off)' : ''}. Upload a PDF, TXT or Markdown file with the + button and ask me again, or ask me anything and I'll answer from general knowledge.`,
          timestamp: Date.now()
        });
        return;
      }

      // "Do you have access to my practice exam?" is answered from the notebook itself, exactly
      if (asksAboutNotebookAccess(userText)) {
        append({ id: responseId, role: 'persona', text: describeNotebook(persona.name.split(' ')[0], sources.filter((s) => s.subject === subject)), timestamp: Date.now() });
        return;
      }

      if (!aiWorkerClient.isReady()) return offerSetup();
      const retrieval = await retrieve();
      if (request.cancelled) return stoppedNote();

      // Placeholder message that fills in as tokens stream
      append({ id: responseId, role: 'persona', text: '', timestamp: Date.now(), aiGenerated: true });

      const response = await generateTutorResponse({
        query: userText,
        persona,
        retrieval,
        teachingStyle,
        sources,
        history: previousHistory,
        goals: goalPromptLines(goals, subject),
        notebook: { passages: activePassages.length, titles: avatarUploads.map((s) => s.title) },
        skills: skillInstructions(skills, subject),
        resolvedTopic: anchorTopic,
        isDeepDive,
        isClarification,
        onToken: (text) => patchIn(convId, responseId, { text })
      });

      setFollowUpChips(response.suggestedFollowUps);
      patchIn(
        convId,
        responseId,
        {
          text: response.answerText + (response.interrupted ? ' …' : ''),
          citations: response.citations,
          metrics: {
            model: response.model,
            tokensIn: response.tokensIn,
            tokensOut: response.tokensOut,
            retrievalLatencyMs: retrieval.latencyMs,
            vectorSimilarity: retrieval.hits[0]?.semanticSimilarity || 0,
            groundednessScore: response.groundednessScore,
            teachingStyle
          }
        },
        true
      );
    } catch (err) {
      console.error('Failed to generate response:', err);
      const errorText = `Sorry, the on-device model hit an error and couldn't answer (${err instanceof Error ? err.message : String(err)}). Please try again.`;
      updateConversation(convId, (c) => ({
        ...c,
        updatedAt: Date.now(),
        messages: c.messages.some((m) => m.id === responseId)
          ? c.messages.map((m) => (m.id === responseId ? { ...m, text: errorText } : m))
          : [...c.messages, { id: responseId, role: 'persona', text: errorText, timestamp: Date.now() }]
      }));
    } finally {
      if (activeRequest.current === request) activeRequest.current = null;
      setIsGenerating(false);
    }
  };

  // When the model becomes ready: drop setup cards and answer the question that was waiting for it
  const prevModelStatus = useRef(modelState.status);
  const freshDownload = useRef(false);
  useEffect(() => {
    const prev = prevModelStatus.current;
    prevModelStatus.current = modelState.status;
    if (modelState.status === 'loading' && prev !== 'loading') freshDownload.current = !modelState.previouslyDownloaded;
    if (modelState.status !== 'ready' || prev === 'ready') return;
    if (freshDownload.current) showNotice('On-device AI is ready');

    const waiting = conversations
      .filter((c) => c.messages.some((m) => m.role === 'setup'))
      .sort((a, b) => (b.id === activeConversationId ? 1 : 0) - (a.id === activeConversationId ? 1 : 0) || b.updatedAt - a.updatedAt);
    if (waiting.length === 0) return;
    setConversations((list) => list.map((c) => (waiting.some((w) => w.id === c.id) ? { ...c, messages: c.messages.filter((m) => m.role !== 'setup') } : c)));

    const target = waiting[0];
    const setupIdx = target.messages.map((m) => m.role).lastIndexOf('setup');
    const question = target.messages[setupIdx]?.setup?.question;
    if (!question) return;
    const before = target.messages.slice(0, setupIdx).filter((m) => m.role !== 'setup');
    const userIdx = before.map((m) => m.role === 'user' && m.text === question).lastIndexOf(true);
    respond(target.id, target.avatarId, question, userIdx >= 0 ? before.slice(0, userIdx) : before);
    // Runs on status changes only; the other values are read at that moment
  }, [modelState.status]);

  const dismissSetup = (convId: string, msgId: string) =>
    updateConversation(convId, (c) => ({
      ...c,
      updatedAt: Date.now(),
      messages: c.messages.map((m) => (m.id === msgId && m.setup ? { ...m, setup: { ...m.setup, dismissed: true } } : m))
    }));

  // Correctness comes from the answer key; the model only explains it
  const handleAnswerQuiz = async (messageId: string, optionIndex: number) => {
    if (!activeConversation || isGenerating) return;
    const convId = activeConversation.id;
    const subject = activeConversation.avatarId;
    const target = activeConversation.messages.find((m) => m.id === messageId);
    if (!target?.quizData || target.quizData.answered) return;

    const question = target.quizData.question;
    const isCorrect = question.options[optionIndex]?.isCorrect || false;
    const persona = allPersonas[subject] || EXPERT_PERSONAS.notes;
    const teachingStyle = teachingStyleFor(subject);
    setMasteryData((prev) => ({ ...prev, [subject]: recordAnswer(prev[subject] || [], question, isCorrect) }));

    const feedbackId = `feedback-${Date.now()}`;
    updateConversation(convId, (c) => ({
      ...c,
      updatedAt: Date.now(),
      messages: [
        ...c.messages.map((m) =>
          m.id === messageId && m.quizData ? { ...m, quizData: { ...m.quizData, selectedOptionIndex: optionIndex, answered: true } } : m
        ),
        { id: feedbackId, role: 'persona', text: '', timestamp: Date.now(), aiGenerated: aiWorkerClient.isReady() }
      ]
    }));
    const correct = question.options.find((o) => o.isCorrect);
    const fallbackText = `${isCorrect ? 'Correct!' : `Not quite — the answer is ${correct?.label}.`} ${question.explanation}`.trim();

    if (!aiWorkerClient.isReady()) {
      patchIn(convId, feedbackId, { text: fallbackText }, true);
      return;
    }
    setIsGenerating(true);
    try {
      const feedback = await generateQuizFeedback(question, optionIndex, persona, teachingStyle, (text) => patchIn(convId, feedbackId, { text }));
      patchIn(
        convId,
        feedbackId,
        {
          text: feedback.text,
          metrics: {
            model: feedback.model,
            tokensIn: feedback.inputTokens,
            tokensOut: feedback.outputTokens,
            retrievalLatencyMs: 0,
            vectorSimilarity: 0,
            groundednessScore: 0,
            teachingStyle
          }
        },
        true
      );
    } catch (err) {
      console.error('Failed to generate quiz feedback:', err);
      patchIn(convId, feedbackId, { text: fallbackText, aiGenerated: false }, true);
    } finally {
      setIsGenerating(false);
    }
    setFollowUpChips(['Quiz me on the next question', 'Explain this concept in more depth']);
  };

  const handlePracticeQuestion = (q: QuizQuestion) => {
    setCurrentSubject(q.subject);
    const convId = ensureConversation(q.subject, `Practice: ${q.topicId}`);
    appendTo(convId, { id: `quiz-${Date.now()}`, role: 'quiz', text: 'Practice question', timestamp: Date.now(), quizData: { question: q, answered: false } });
    setPracticeOpen(false);
  };

  const handleAskAboutQuestion = (q: QuizQuestion) => {
    setCurrentSubject(q.subject);
    setPracticeOpen(false);
    handleSendMessage(`Can you explain this practice problem: "${q.question}"`, q.subject);
  };

  // ---- Navigation ----

  const startNewChat = () => {
    setActiveConversationId(null);
    setFollowUpChips([]);
    setLeftOpen(false);
  };

  const selectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    setCurrentSubject(conv.avatarId);
    setActiveConversationId(id);
    setFollowUpChips([]);
    setLeftOpen(false);
  };

  const removeConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    savedVersions.current.delete(id);
    deleteConversation(id).catch((err) => console.warn('Could not delete chat:', err));
    if (id === activeConversationId) setActiveConversationId(null);
  };

  // Switching Avatar mid-chat starts a new chat with that Avatar, since each has its own notebook
  const switchAvatar = (id: SubjectId) => {
    if (id === currentSubject) return;
    setCurrentSubject(id);
    if (activeConversation && activeConversation.messages.length > 0) setActiveConversationId(null);
    setFollowUpChips([]);
  };

  // ---- Avatars, goals, skills, settings ----

  const handleCreateAvatar = (payload: CreateAvatarPayload) => {
    let subjectId: SubjectId = payload.subjectId;
    if (payload.subjectMode === 'new' && payload.newSubjectName) {
      subjectId = payload.newSubjectName.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') || `custom_${Date.now()}`;
      const subject = { id: subjectId, label: payload.newSubjectName, icon: payload.newSubjectIcon || '📚' };
      setCustomSubjects((prev) => {
        const next = prev.some((s) => s.id === subjectId) ? prev : [...prev, subject];
        writeJson('lumen_custom_subjects', next);
        return next;
      });
    }

    const fallbackPrompt = `You are ${payload.name}, an encouraging and knowledgeable study assistant.`;
    const persona: Persona = {
      id: `persona-${Date.now()}`,
      name: payload.name,
      title: payload.title,
      subject: subjectId,
      avatar: payload.avatarEmoji || '🎓',
      avatarUrl: payload.avatarUrl,
      bio: payload.bio,
      quote: payload.quote || 'Ready when you are.',
      accentColor: payload.accentColor || '#6366f1',
      toneDescription: payload.toneDescription,
      scaffoldingPrompt: payload.customInstructions || fallbackPrompt,
      guidedPrompt: payload.customInstructions || fallbackPrompt,
      masteryPrompt: payload.customInstructions || fallbackPrompt,
      customInstructions: payload.customInstructions,
      tasks: payload.tasks,
      isCustom: true
    };
    setCustomPersonas((prev) => {
      const next = { ...prev, [subjectId]: persona };
      writeJson('lumen_custom_personas', next);
      return next;
    });

    if (payload.supportingDocContent?.trim()) {
      const docTitle = payload.supportingDocTitle || `${payload.name}'s notes`;
      const docId = `up-custom-${Date.now()}`;
      const chunks = chunkDocumentText(payload.supportingDocContent, docId, docTitle, subjectId);
      const doc: SourceDocument = {
        id: docId,
        subject: subjectId,
        title: docTitle,
        shortTitle: docTitle.slice(0, 24),
        kind: 'upload',
        author: 'Your upload',
        license: 'Private On-Device',
        passagesCount: chunks.length,
        tokens: chunks.reduce((sum, p) => sum + p.tokens, 0),
        enabled: true,
        dateAdded: new Date().toLocaleDateString()
      };
      setSources((prev) => [doc, ...prev]);
      setPassages((prev) => [...chunks, ...prev]);
      saveUpload(doc, chunks).catch(() => showNotice('Saved for this visit only — your browser storage is full or blocked'));
    }

    setCurrentSubject(subjectId);
    setActiveConversationId(null);
    showNotice(`${payload.name} is ready`);
    // Files picked in the form go through the normal upload path: PDF text, practice questions, saving
    if (payload.files?.length) handleFileUpload(payload.files, { subject: subjectId, name: payload.name });
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // Decorative only
    }
  };

  const addGoal = (g: { title: string; details?: string; targetDate?: string }) =>
    setGoals((prev) => [...prev, { id: `goal-${Date.now().toString(36)}`, avatarId: currentSubject, createdAt: Date.now(), done: false, ...g }]);

  const handleResetData = async () => {
    if (!window.confirm('Delete all your notes, chats, goals, skills, progress and custom Avatars from this device? This can\'t be undone, so save a backup first if you might want them back. The downloaded AI model is kept.')) return;
    await Promise.allSettled([clearUploads(), clearConversations()]);
    ['lumen_progress_v1', 'lumen_custom_personas', 'lumen_custom_subjects', 'avatar_goals_v1', 'avatar_skills_v1'].forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Storage unavailable; nothing persisted to remove
      }
    });
    savedVersions.current.clear();
    setSources(INITIAL_SOURCES);
    setPassages(INITIAL_PASSAGES);
    setMasteryData(INITIAL_TOPIC_MASTERY);
    setCustomPersonas({});
    setCustomSubjects([]);
    setConversations([]);
    setActiveConversationId(null);
    setGoals([]);
    setSkills(emptySkillsState());
    setCurrentSubject('notes');
    setRightPanel(null);
    showNotice('Your notes, chats and progress were deleted from this device');
  };

  const [lastBackup, setLastBackup] = useState<number | null>(readLastBackup);
  const handleExportBackup = async () => {
    try {
      const backup = await createBackup();
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = backupFileName();
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      markBackedUp();
      setLastBackup(readLastBackup());
      showNotice(`Backup downloaded: ${describeBackup(backup).split(', saved')[0]}`);
    } catch (err) {
      console.error('Backup failed:', err);
      showNotice("Couldn't create the backup");
    }
  };

  const handleRestoreBackup = async (file: File) => {
    let backup;
    try {
      backup = parseBackup(await file.text());
    } catch (err) {
      showNotice(err instanceof Error ? err.message : "Couldn't read that file");
      return;
    }
    if (!window.confirm(`Restore ${describeBackup(backup)}?\n\nThis replaces the notes, chats, Avatars, goals, skills and progress on this device. The AI model is kept.`)) return;
    try {
      await restoreBackup(backup);
      // Start fresh from the restored data
      window.location.reload();
    } catch (err) {
      showNotice(err instanceof Error ? err.message : "Couldn't restore the backup");
    }
  };

  const handleRemoveModel = async () => {
    if (!window.confirm('Remove the downloaded AI model from this device? You can download it again from Models.')) return;
    await aiWorkerClient.clearCache();
    showNotice('AI model removed from this device');
  };

  const usage = contextUsage(messages);
  // Only said when it matters: before the first download, or when this device can't run the model
  const setupHint =
    modelState.status !== 'idle' || !device || modelState.previouslyDownloaded
      ? undefined
      : device.tier === 'unsuitable'
        ? 'This device can’t run the AI chat. Practice questions and calculators still work here.'
        : `The AI model downloads the first time you ask a question (≈${formatGb(downloadBytesFor(device.webgpu, device.shaderF16))}, once).`;
  const panelTitle = RIGHT_PANELS.find((p) => p.id === rightPanel)?.title ?? '';
  const activeGoalCount = avatarGoals.filter((g) => !g.done).length;

  const sidebar = (
    <Sidebar
      conversations={conversations}
      activeConversationId={activeConversationId}
      personas={allPersonas}
      modelReady={modelReady}
      modelProgress={modelLoading ? modelState.progressPct : null}
      onNewChat={startNewChat}
      onSelectConversation={selectConversation}
      onDeleteConversation={removeConversation}
      onOpenModels={() => {
        setLeftOpen(false);
        setModelsOpen(true);
      }}
    />
  );

  return (
    <div className="h-dvh flex bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {notice && (
        <div role="status" className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] py-2 px-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl text-sm font-medium animate-slide-down">
          {notice}
        </div>
      )}

      {/* Left bar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200/70 dark:border-slate-800">{sidebar}</aside>
      <Sheet open={leftOpen} onClose={() => setLeftOpen(false)} title="Menu" side="left">
        {sidebar}
      </Sheet>

      {/* Main chat */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5">
          <div className="flex items-center gap-1 min-w-0">
            <button
              type="button"
              onClick={() => setLeftOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{activeConversation?.title ?? `New chat with ${currentPersona.name}`}</h1>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={startNewChat}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="New chat"
            >
              <SquarePen className="w-5 h-5" />
            </button>
            <div className="flex xl:hidden items-center">
              <RightRail compact active={rightPanel} activeGoals={activeGoalCount} onOpen={setRightPanel} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-full">
            {messages.length === 0 ? (
              <EmptyState
                persona={currentPersona}
                notesCount={activeNotesCount}
                setupHint={setupHint}
                onUpload={() => uploadInputRef.current?.click()}
                onPrompt={(text) => handleSendMessage(text)}
              />
            ) : (
              <div className="pt-4">
                <MessageList
                  messages={messages}
                  persona={allPersonas[activeConversation?.avatarId ?? currentSubject] || currentPersona}
                  isGenerating={isGenerating}
                  onOpenPassage={handleOpenPassage}
                  onAnswerQuiz={handleAnswerQuiz}
                  renderSetup={(msg) =>
                    activeConversation && (
                      <SetupCard
                        avatarName={(allPersonas[activeConversation.avatarId] || currentPersona).name.split(' ')[0]}
                        device={device}
                        model={modelState}
                        dismissed={!!msg.setup?.dismissed}
                        onDownload={startModel}
                        onDismiss={() => dismissSetup(activeConversation.id, msg.id)}
                        onOpenModels={() => setModelsOpen(true)}
                      />
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 px-3 sm:px-6 pb-3 pt-2">
          <div className="max-w-3xl mx-auto">
            {followUpChips.length > 0 && !isGenerating && messages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto noscroll pb-2">
                {followUpChips.slice(0, 4).map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            <Composer
              placeholder={`Message ${currentPersona.name}`}
              canSend
              isGenerating={isGenerating}
              onSend={(text) => handleSendMessage(text)}
              onStop={handleStop}
              onUploadFiles={handleFileUpload}
              status={
                modelLoading && (
                  <button
                    type="button"
                    onClick={() => setModelsOpen(true)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs tabular-nums text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    aria-label={`Downloading the AI model, ${modelState.progressPct}%. Open Models`}
                  >
                    <ProgressRing pct={modelState.progressPct} />
                    <span className="hidden sm:inline">{modelState.progressPct}%</span>
                  </button>
                )
              }
              controls={
                <>
                  <AvatarSwitcher avatars={avatarOptions} activeId={currentSubject} onSelect={switchAvatar} onCreate={() => setCreateAvatarOpen(true)} />
                  <NotebookPopover
                    avatarName={currentPersona.name.split(' ')[0]}
                    sources={avatarSources}
                    usage={usage}
                    onToggle={handleToggleSource}
                    onDelete={handleDeleteSource}
                    onView={handleViewSource}
                    onUpload={() => uploadInputRef.current?.click()}
                    onOpenPracticeVault={hasPracticeBank ? () => setPracticeOpen(true) : undefined}
                  />
                </>
              }
            />
            <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
              Runs privately on your device. AI answers can make mistakes; check the sources.
            </p>
          </div>
        </div>
        <input
          ref={uploadInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFileUpload(e.target.files);
            e.target.value = '';
          }}
        />
      </main>

      {/* Right bar */}
      <aside className="hidden xl:flex w-[84px] shrink-0 flex-col items-center gap-1 py-3 border-l border-slate-200/70 dark:border-slate-800" aria-label="Avatar tools">
        <RightRail active={rightPanel} activeGoals={activeGoalCount} onOpen={setRightPanel} />
      </aside>
      <Sheet open={rightPanel !== null} onClose={() => setRightPanel(null)} title={panelTitle}>
        {rightPanel === 'goals' && (
          <GoalsPanel
            persona={currentPersona}
            goals={avatarGoals}
            onAdd={addGoal}
            onToggleDone={(id) => setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)))}
            onDelete={(id) => setGoals((prev) => prev.filter((g) => g.id !== id))}
          />
        )}
        {rightPanel === 'skills' && (
          <SkillsPanel
            persona={currentPersona}
            customSkills={skills.custom}
            enabledIds={enabledSkillIds(skills, currentSubject)}
            onToggle={(id) => setSkills((prev) => toggleSkill(prev, currentSubject, id))}
            onAddCustom={(name, instructions) => setSkills((prev) => addCustomSkill(prev, currentSubject, name, instructions))}
            onDeleteCustom={(id) => setSkills((prev) => removeCustomSkill(prev, id))}
          />
        )}
        {rightPanel === 'me' && (
          <MyAvatarPanel
            mastery={masteryData}
            subjects={allSubjects}
            theme={theme}
            onChangeTheme={changeTheme}
            onOpenPractice={() => {
              setRightPanel(null);
              setPracticeOpen(true);
            }}
            onResetData={handleResetData}
            onRemoveModel={handleRemoveModel}
            lastBackup={lastBackup}
            onExportBackup={handleExportBackup}
            onRestoreBackup={handleRestoreBackup}
          />
        )}
      </Sheet>

      <ModelsModal open={modelsOpen} onClose={() => setModelsOpen(false)} />
      <PassageViewerSheet
        passage={viewingPassage}
        sources={sources}
        onClose={() => setViewingPassage(null)}
        onQuizPassage={(p) => {
          setViewingPassage(null);
          handleSendMessage(`Quiz me on this passage: ${p.section}`);
        }}
        highlightTerms={[]}
      />
      <KnowledgeFolderModal
        isOpen={practiceOpen}
        onClose={() => setPracticeOpen(false)}
        currentSubject={hasPracticeBank ? currentSubject : 'chemistry'}
        onSelectQuestionForPractice={handlePracticeQuestion}
        onAskTutorAboutQuestion={handleAskAboutQuestion}
      />
      <CreateAvatarModal isOpen={createAvatarOpen} onClose={() => setCreateAvatarOpen(false)} onCreateAvatar={handleCreateAvatar} existingSubjects={allSubjects} />
    </div>
  );
}
