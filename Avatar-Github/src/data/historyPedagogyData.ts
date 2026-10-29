import { Passage, SourceDocument } from '../types';

/**
 * Sample teaching material for the History Avatar (Prof. Arthur Sterling, a fictional persona), written for
 * Avatar Network: course periods, common misconceptions, primary-source analysis and essay tips.
 */

export const HISTORY_PEDAGOGY_SOURCES: SourceDocument[] = [
  {
    id: 'hist-ced-framework',
    subject: 'history',
    title: 'Sample guide: History course periods & skills',
    shortTitle: 'History course periods',
    kind: 'syllabus',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'History course periods, reasoning processes (comparison, causation, continuity and change) and historical thinking skills.'
  },
  {
    id: 'hist-misconceptions-guide',
    subject: 'history',
    title: 'Sample guide: Common history misconceptions',
    shortTitle: 'History misconceptions',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Diagnostic protocols correcting pervasive student errors: chronological inevitability, monocausal economic reductionism, and primary source credulity.'
  },
  {
    id: 'hist-forensics-manual',
    subject: 'history',
    title: 'Sample guide: Analysing primary sources (HIPP)',
    shortTitle: 'Primary sources (HIPP)',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Methodological framework for analyzing Historical Situation, Intended Audience, Purpose, and Point of View (HIPP) in primary texts and visuals.'
  },
  {
    id: 'hist-dbq-rubrics-vault',
    subject: 'history',
    title: 'Sample guide: Writing document-based essays',
    shortTitle: 'Document-based essays',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'How document-based essays are usually scored: thesis, contextualization, document evidence, outside evidence, sourcing and complexity.'
  },
  {
    id: 'hist-ap-vault',
    subject: 'history',
    title: 'Sample practice questions: History (19)',
    shortTitle: 'History practice (19)',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    isExam: true,
    docSummary: '19 hand-written stimulus-based history practice questions with source excerpts and explanations.'
  }
];

export const HISTORY_PEDAGOGY_PASSAGES: Passage[] = [
  // 1. CED Framework
  {
    id: 'hist-ped-p1',
    subject: 'history',
    srcId: 'hist-ced-framework',
    sourceTitle: 'Sample guide: History course periods & skills',
    section: '§1.1 The 3 Reasoning Processes in AP History',
    page: 12,
    text: 'Historical inquiry is organized around 3 core reasoning processes: (1) Comparison (identifying similarities and differences across geographic regions or social movements); (2) Causation (distinguishing between immediate triggers and long-term structural preconditions, analyzing both primary effects and unintended consequences); and (3) Continuity and Change Over Time / CCOT (tracing persistent institutional cultural currents alongside profound political or technological ruptures).',
    tokens: 116,
    category: 'Curriculum & Standards'
  },
  {
    id: 'hist-ped-p2',
    subject: 'history',
    srcId: 'hist-ced-framework',
    sourceTitle: 'Sample guide: History course periods & skills',
    section: '§1.2 The 6 Historical Thinking Skills',
    page: 25,
    text: 'High school educators must anchor history instruction in 6 Historical Thinking Skills: Skill 1 (Developments & Processes: identify and explain historical developments); Skill 2 (Sourcing and Situation: analyze source point of view, purpose, historical situation, and audience); Skill 3 (Claims and Evidence in Sources); Skill 4 (Contextualization: connect developments to broader regional or global processes); Skill 5 (Making Connections through comparison, causation, and CCOT); and Skill 6 (Argumentation: construct a nuanced, evidence-based historical argument).',
    tokens: 122,
    category: 'Pedagogy & Science Practices'
  },

  // 2. Misconceptions
  {
    id: 'hist-misc-p1',
    subject: 'history',
    srcId: 'hist-misconceptions-guide',
    sourceTitle: 'Sample guide: Common history misconceptions',
    section: '§2.1 Misconception #1: Historical Inevitability & Hindsight Determinism',
    page: 16,
    text: 'Pervasive High School Misconception: Students assume historical events unfolded because they "had to" (e.g., "The American colonies were always destined to rebel" or "The Soviet Union was doomed to collapse in 1991"). Prof. Arthur Sterling\'s Remediation: History is contingency, human agency, and structural friction—never pre-scripted inevitability. In 1774, the vast majority of colonial elites sought reconciliation within the British imperial commonwealth, not independence. Teach students to examine turning points as fragile decision spaces where alternate paths were actively debated.',
    tokens: 126,
    category: 'Student Misconceptions'
  },
  {
    id: 'hist-misc-p2',
    subject: 'history',
    srcId: 'hist-misconceptions-guide',
    sourceTitle: 'Sample guide: Common history misconceptions',
    section: '§2.2 Misconception #2: Monocausal Reductionism (Attributing Complex Events to One Factor)',
    page: 30,
    text: 'Pervasive High School Misconception: Students reduce monumental transformations to single isolated triggers (e.g. "The Civil War was caused only by tariffs" or "WWI happened only because of Franz Ferdinand\'s assassination"). Prof. Arthur Sterling\'s Remediation: High-scoring historical reasoning requires multi-causal synthesis. Ferdinand\'s assassination was an immediate catalyst that detonated decades of accumulated structural preconditions: interlocking alliance webs, militarism, imperial competition, and Balkan nationalism.',
    tokens: 120,
    category: 'Student Misconceptions'
  },
  {
    id: 'hist-misc-p3',
    subject: 'history',
    srcId: 'hist-misconceptions-guide',
    sourceTitle: 'Sample guide: Common history misconceptions',
    section: '§2.3 Misconception #3: Primary Source Credulity (Treating Archival Documents as Pure Fact)',
    page: 44,
    text: 'Pervasive High School Misconception: Students believe that because a document is an original primary source (e.g., an imperial royal decree or a conquistador\'s letter), its claims must be objectively true. Prof. Arthur Sterling\'s Remediation: Every primary text is an interested artifact created by a human actor with specific incentives, biases, and audiences. Hernán Cortés\'s letters to King Charles V exaggerated Aztec gold and his own military command to justify unlawful conquest and extract royal governorship titles. Students must interrogate what the author chose to omit.',
    tokens: 130,
    category: 'Student Misconceptions'
  },
  {
    id: 'hist-misc-p4',
    subject: 'history',
    srcId: 'hist-misconceptions-guide',
    sourceTitle: 'Sample guide: Common history misconceptions',
    section: '§2.4 Misconception #4: Presentism (Judging Historical Actors by 21st-Century Norms)',
    page: 58,
    text: 'Pervasive High School Misconception: Students judge figures of antiquity, the Enlightenment, or the 19th century through the ethical frameworks and technological assumptions of the 2020s. Prof. Arthur Sterling\'s Remediation: Presentism destroys historical empathy and contextual analysis. While historians must never apologize for past atrocities, we must evaluate actors within the intellectual constraints, cultural worldviews, and material possibilities of their specific era.',
    tokens: 114,
    category: 'Student Misconceptions'
  },
  {
    id: 'hist-misc-p5',
    subject: 'history',
    srcId: 'hist-misconceptions-guide',
    sourceTitle: 'Sample guide: Common history misconceptions',
    section: '§2.5 Misconception #5: Conflating Abolitionism with Racial Equality in 1860',
    page: 72,
    text: 'Pervasive High School Misconception: Students assume that northern anti-slavery sentiment in 1860 was identical to modern civil rights egalitarianism. Prof. Arthur Sterling\'s Remediation: The Free Soil movement that formed the core of the 1860 Republican platform opposed the expansion of slavery into Western territories primarily to protect white wage laborers from competition with unfree labor ("Free Soil, Free Speech, Free Labor, Free Men"). True radical abolitionists advocating full civil equality (such as Frederick Douglass and Thaddeus Stevens) represented a contested minority wing.',
    tokens: 126,
    category: 'Student Misconceptions'
  },

  // 3. Archival Forensics (HIPP Method)
  {
    id: 'hist-lab-p1',
    subject: 'history',
    srcId: 'hist-forensics-manual',
    sourceTitle: 'Sample guide: Analysing primary sources (HIPP)',
    section: '§3.1 The HIPP Sourcing Protocol for Document Analysis',
    page: 18,
    text: 'In the HIPP protocol, students subject archival evidence to 4 forensic lenses: (H) Historical Situation: What broader regional or geopolitical events surrounded the document\'s creation? (I) Intended Audience: To whom was the author communicating, and how did that shape their rhetoric? (P) Purpose: What specific political, financial, or religious action did the author intend to provoke? (P) Point of View: How do the author\'s social class, gender, race, or profession color their perspective?',
    tokens: 120,
    category: 'Inquiry Labs & Protocols'
  },
  {
    id: 'hist-lab-p2',
    subject: 'history',
    srcId: 'hist-dbq-rubrics-vault',
    sourceTitle: 'Sample guide: Writing document-based essays',
    section: '§3.2 DBQ 7-Point Master Scoring Breakdown',
    page: 35,
    text: 'The AP History Document-Based Question (DBQ) evaluates 7 distinct points: (1) Thesis/Claim (1 pt: defensible claim establishing a line of reasoning); (2) Contextualization (1 pt: connects prompt to broader historical processes immediately preceding or during the era); (3) Evidence from Documents (2 pts: uses 3 docs to address topic [1 pt], or supports argument with 6 docs [2 pts]); (4) Outside Evidence (1 pt: provides specific historical evidence beyond the prompt); (5) Sourcing (1 pt: explains HIPP for at least 3 documents); and (6) Complexity (1 pt: demonstrates complex understanding through counter-arguments, multiple perspectives, or cross-era synthesis).',
    tokens: 138,
    category: 'Scoring Forensics'
  }
];
