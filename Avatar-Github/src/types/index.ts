export type SubjectId = 'algebra' | 'biology' | 'history' | 'chemistry' | (string & {});

export type TeachingStyle = 'scaffolding' | 'guided' | 'mastery';

export interface Persona {
  id: string;
  name: string;
  title: string;
  subject: SubjectId;
  avatar: string;
  avatarUrl?: string;
  faceDescription?: string;
  bio: string;
  quote: string;
  accentColor: string;
  toneDescription: string;
  scaffoldingPrompt: string;
  guidedPrompt: string;
  masteryPrompt: string;
  customInstructions?: string;
  tasks?: string[];
  isCustom?: boolean;
}

export interface CreateAvatarPayload {
  name: string;
  title: string;
  avatarUrl?: string;
  avatarEmoji: string;
  subjectMode: 'existing' | 'new';
  subjectId: SubjectId;
  newSubjectName?: string;
  newSubjectIcon?: string;
  bio: string;
  quote?: string;
  customInstructions: string;
  tasks: string[];
  accentColor: string;
  toneDescription: string;
  supportingDocTitle?: string;
  supportingDocContent?: string;
  // Notes uploaded while creating the Avatar (PDF, TXT, MD); added to its notebook like any upload
  files?: File[];
}

export interface ToolExecutionResult {
  toolName: string;
  badge: string;
  input: string;
  result: string;
  steps: string[];
  explanation: string;
}

export interface Passage {
  id: string;
  subject: SubjectId;
  srcId: string;
  sourceTitle: string;
  section: string;
  subSection?: string;
  page?: number;
  text: string;
  tokens: number;
  category?: string;
}

export interface SourceDocument {
  id: string;
  subject: SubjectId;
  title: string;
  shortTitle: string;
  kind: 'textbook' | 'notes' | 'upload' | 'syllabus';
  author: string;
  license: string;
  passagesCount: number;
  tokens: number;
  enabled: boolean;
  dateAdded?: string;
  isExam?: boolean;
  parsedQuestions?: QuizQuestion[];
  docSummary?: string;
}

export interface TopicMastery {
  topicId: string;
  subject: SubjectId;
  title: string;
  attempts: number;
  correct: number;
  accuracy: number; // 0 - 1
  lastPracticed: string;
  status: 'mastered' | 'review_needed' | 'struggling' | 'new';
  recommendedAction: string;
}

export interface QuizOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  subject: SubjectId;
  topicId: string;
  type: 'cloze' | 'conceptual' | 'synthesis';
  question: string;
  options: QuizOption[];
  explanation: string;
  passageId: string;
  passageSnippet?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceTitle?: string;
  sourceId?: string;
  originalQuestionNumber?: number | string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'persona' | 'quiz' | 'system' | 'setup';
  text: string;
  timestamp: number;
  // role 'setup': offers the model download in the chat; the question is answered once the model is ready
  setup?: { question: string; dismissed?: boolean };
  toolExecution?: ToolExecutionResult;
  citations?: {
    passageId: string;
    label: string;
    similarity: number;
    // The most relevant sentences of the passage, shown under the answer
    excerpt?: string;
  }[];
  // Written by the language model (as opposed to a calculator or the answer key)
  aiGenerated?: boolean;
  quizData?: {
    question: QuizQuestion;
    selectedOptionIndex?: number;
    answered: boolean;
  };
  metrics?: {
    model: string;
    tokensIn: number;
    tokensOut: number;
    retrievalLatencyMs: number;
    vectorSimilarity: number;
    groundednessScore: number;
    teachingStyle: TeachingStyle;
  };
}

export interface StudyDayPlan {
  dayNumber: number;
  title: string;
  topics: string[];
  estimatedMinutes: number;
  questionsCount: number;
  summary: string;
  completed: boolean;
}

export interface CustomStudentGoal {
  id: string;
  subject: SubjectId;
  title: string;
  presetKey?: string;
  customInstructions: string;
  targetDays: number;
  intensity: 'light' | 'standard' | 'intense';
  createdAt: number;
  status: 'active' | 'completed' | 'archived';
  daysPlan?: StudyDayPlan[];
}

export interface StudentProfile {
  name: string;
  gradeLevel: string;
  streakDays: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  studyTimeMinutes: number;
  activeTeachingStyle: TeachingStyle;
}

export interface KnowledgeUnit {
  id: string;
  unitNumber: number;
  title: string;
  examWeightPct: string;
  topicCount: number;
  problemCount: number;
  keyTopics: string[];
  cedStandards: string[];
}

export interface PedagogyContext {
  gradeLevel: string;
  examFormat: string;
  commonMisconceptionsCount: number;
  guidedLabsCount: number;
  frqRubricsAvailable: boolean;
  differentiatedTeachingNotes: string;
}

export interface KnowledgeFolder {
  id: string;
  subject: SubjectId;
  tutorId: string;
  tutorName: string;
  tutorTitle: string;
  title: string;
  shortDescription: string;
  icon: string;
  badge: string;
  problemCount: number;
  units: KnowledgeUnit[];
  pedagogyContext: PedagogyContext;
}

