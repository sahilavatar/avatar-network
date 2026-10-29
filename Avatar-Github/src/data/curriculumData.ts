import { Persona, SourceDocument, Passage, QuizQuestion, TopicMastery, SubjectId } from '../types';
import { CHEMISTRY_PEDAGOGY_SOURCES, CHEMISTRY_PEDAGOGY_PASSAGES } from './chemistryPedagogyData';
import { AP_CHEM_PROBLEM_BANK } from './apChemistryProblemBank';
import { ALGEBRA_PEDAGOGY_SOURCES, ALGEBRA_PEDAGOGY_PASSAGES } from './algebraPedagogyData';
import { ALGEBRA_PROBLEM_BANK } from './algebraProblemBank';
import { BIOLOGY_PEDAGOGY_SOURCES, BIOLOGY_PEDAGOGY_PASSAGES } from './biologyPedagogyData';
import { BIOLOGY_PROBLEM_BANK } from './biologyProblemBank';
import { HISTORY_PEDAGOGY_SOURCES, HISTORY_PEDAGOGY_PASSAGES } from './historyPedagogyData';
import { HISTORY_PROBLEM_BANK } from './historyProblemBank';

export const EXPERT_PERSONAS: Record<SubjectId, Persona> = {
  // Default notebook for the student's own uploads
  notes: {
    id: 'avatar',
    name: 'Avatar',
    title: 'Your private study assistant',
    subject: 'notes',
    avatar: '📝',
    avatarUrl: 'brand/icon-192.png',
    bio: 'Answers questions from the notes you upload, with the source passage for every answer. Runs entirely in your browser.',
    quote: 'Upload your notes and ask me anything about them.',
    accentColor: '#6366f1',
    toneDescription: 'Clear, encouraging, concise',
    scaffoldingPrompt: '',
    guidedPrompt: '',
    masteryPrompt: ''
  },
  algebra: {
    id: 'marcus',
    name: 'Marcus Vance',
    title: 'Pure Math & Algebraic Reasoning Fellow',
    subject: 'algebra',
    avatar: '📐',
    avatarUrl: 'avatars/algebra.jpg',
    faceDescription: 'Scholar with dark hair, neat beard, olive green cable-knit sweater, maroon studio backdrop',
    bio: 'Former high-school Olympiad coach and visual mathematics instructor. Believes every polynomial tells a geometric story.',
    quote: 'Mathematics is not about memorizing symbols; it is learning to see invariant structures through changes.',
    accentColor: '#3B82F6',
    toneDescription: 'Conversational, structured, visual-spatial, patient',
    scaffoldingPrompt: 'Speak in fluid, natural paragraphs without rigid bold headers. Break down the equation into conversational steps and provide visual coordinate analogies before giving formulas.',
    guidedPrompt: 'Guide the student conversationally to identify the discriminant or key coefficients. Validate their algebraic logic warmly and ask them to verify through reverse substitution.',
    masteryPrompt: 'Challenge the student through natural dialogue to generalize roots, analyze complex conjugates, or synthesize transformations.'
  },
  biology: {
    id: 'nia',
    name: 'Dr. Nia Thorne',
    title: 'Cellular & Evolutionary Systems Biologist',
    subject: 'biology',
    avatar: '🧬',
    avatarUrl: 'avatars/biology.jpg',
    faceDescription: 'Scholar with long dreadlocks, grey ribbed turtleneck sweater, vibrant orange studio backdrop',
    bio: 'Postdoctoral researcher in plant biochemistry and AP Biology curriculum consultant. Loves bridging micro-molecules to ecosystems.',
    quote: 'Structure determines function—from the folding of a ribosome to the branching of xylem veins in a canopy.',
    accentColor: '#10B981',
    toneDescription: 'Warm, curious, mechanistic, conversational, mnemonic-rich',
    scaffoldingPrompt: 'Explain concepts in conversational prose rather than stiff bullet outlines. Use everyday analogies like rechargeable batteries for ATP and postal codes for vesicles.',
    guidedPrompt: 'Guide the student through cause-and-effect flowcharts in conversational language. If an enzyme is inhibited, what happens to the downstream intermediate?',
    masteryPrompt: 'Engage in experimental design through natural discussion: pose hypothetical knockout mutations and explore physiological shifts together.'
  },
  history: {
    id: 'arthur',
    name: 'Prof. Arthur Sterling',
    title: 'Comparative Historiographer & Archival Scholar',
    subject: 'history',
    avatar: '🏛️',
    avatarUrl: 'avatars/history.jpg',
    faceDescription: 'Scholar with wavy blonde hair, trimmed beard, red and black plaid flannel shirt, forest green studio backdrop',
    bio: 'Archival historian specializing in trade networks, constitutional development, and primary document forensics.',
    quote: 'History is not a ledger of dates; it is an argument between perspectives preserved in the ink of primary sources.',
    accentColor: '#F59E0B',
    toneDescription: 'Conversational, storytelling, contextual, inquisitive, forensic',
    scaffoldingPrompt: 'Speak like an engaging historian telling a story. Avoid bullet headers with bold text; anchor events around human incentives and archival context.',
    guidedPrompt: 'Ask the student conversationally to corroborate two viewpoints: how did Venetian merchants view maritime trade versus Ottoman administrators in 1483?',
    masteryPrompt: 'Prompt historiographical critiques through natural dialogue: compare technological causality with institutional economic forces during the Reformation.'
  },
  chemistry: {
    id: 'kevin',
    name: 'Dr. Kevin Chen',
    title: 'Physical Chemist & Reaction Systems Mentor',
    subject: 'chemistry',
    avatar: '⚗️',
    avatarUrl: 'avatars/chemistry.jpg',
    faceDescription: 'Young East Asian scholar with undercut fade haircut, sleek black zip-up jacket, sage green studio backdrop',
    bio: 'Laboratory educator passionate about reaction kinetics, orbital hybridization, and first-principles energy conservation.',
    quote: 'Nature is lazy and disorderly: systems always seek minimum enthalpy and maximum entropy.',
    accentColor: '#8B5CF6',
    toneDescription: 'Conversational, energetic, lab-grounded, physical intuition, encouraging',
    scaffoldingPrompt: 'Speak in warm, conversational paragraphs without markdown bold headers. Use balancing scales and lab analogies for stoichiometry and dimensional analysis.',
    guidedPrompt: 'Guide the student conversationally to spot the limiting reactant. Encourage them to reason through the mole-ratio bridge before computing theoretical yield.',
    masteryPrompt: 'Engage the student in a peer-to-peer lab dialogue exploring where the ideal gas model breaks down at high pressures and cryogenic temperatures.'
  }
};

// Passage counts and sizes are filled in from INITIAL_PASSAGES below
const SAMPLE_SOURCES: SourceDocument[] = [
  // Algebra
  {
    id: 'alg-core',
    subject: 'algebra',
    title: 'Sample notes: Algebra foundations',
    shortTitle: 'Algebra foundations',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  {
    id: 'alg-notes',
    subject: 'algebra',
    title: 'Sample study guide: Algebra formulas',
    shortTitle: 'Algebra study guide',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  // Biology
  {
    id: 'bio-core',
    subject: 'biology',
    title: 'Sample notes: Cellular energy & genetics',
    shortTitle: 'Cell energy & genetics',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  {
    id: 'bio-notes',
    subject: 'biology',
    title: 'Sample notes: Biochemical pathways',
    shortTitle: 'Biochemical pathways',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  // History
  {
    id: 'hist-core',
    subject: 'history',
    title: 'Sample notes: Trade networks, statecraft & U.S. history',
    shortTitle: 'Trade, statecraft & U.S. history',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  {
    id: 'hist-notes',
    subject: 'history',
    title: 'Sample notes: Civics & constitutional history',
    shortTitle: 'Civics & constitution',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  // Chemistry
  {
    id: 'chem-core',
    subject: 'chemistry',
    title: 'Sample notes: Atoms, orbitals & reactions',
    shortTitle: 'Atoms & reactions',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  {
    id: 'chem-notes',
    subject: 'chemistry',
    title: 'Sample notes: Stoichiometry & thermodynamics',
    shortTitle: 'Stoichiometry & thermo',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true
  },
  ...ALGEBRA_PEDAGOGY_SOURCES.map(s =>
    s.id === 'alg-ap-vault' ? { ...s, parsedQuestions: ALGEBRA_PROBLEM_BANK } : s
  ),
  ...BIOLOGY_PEDAGOGY_SOURCES.map(s =>
    s.id === 'bio-ap-vault' ? { ...s, parsedQuestions: BIOLOGY_PROBLEM_BANK } : s
  ),
  ...HISTORY_PEDAGOGY_SOURCES.map(s =>
    s.id === 'hist-ap-vault' ? { ...s, parsedQuestions: HISTORY_PROBLEM_BANK } : s
  ),
  ...CHEMISTRY_PEDAGOGY_SOURCES.map(s =>
    s.id === 'chem-ap-vault' ? { ...s, parsedQuestions: AP_CHEM_PROBLEM_BANK } : s
  )
];

export const INITIAL_PASSAGES: Passage[] = [
  // ALGEBRA PASSAGES
  {
    id: 'alg-p1',
    subject: 'algebra',
    srcId: 'alg-core',
    sourceTitle: 'Sample notes: Algebra foundations',
    section: '§9.3 The Quadratic Formula and the Discriminant',
    page: 614,
    text: 'For any quadratic equation in standard form ax² + bx + c = 0 with a ≠ 0, the solutions are given by x = (-b ± √(b² - 4ac)) / (2a). The radicand b² - 4ac is called the discriminant. If b² - 4ac > 0, there are two distinct real solutions; if b² - 4ac = 0, there is exactly one repeated real solution (the vertex touches the x-axis); if b² - 4ac < 0, there are two complex conjugate solutions.',
    tokens: 94,
    category: 'Quadratic Equations'
  },
  {
    id: 'alg-p2',
    subject: 'algebra',
    srcId: 'alg-core',
    sourceTitle: 'Sample notes: Algebra foundations',
    section: '§9.4 Vertex Form and Parabolic Symmetry',
    page: 628,
    text: 'A parabola given by y = a(x - h)² + k has its vertex at (h, k) and an axis of symmetry along the vertical line x = h. The parameter "a" controls both the direction of opening (upward if a > 0, downward if a < 0) and the vertical stretch factor. If |a| > 1, the parabola is narrower than the parent function y = x²; if 0 < |a| < 1, the curve is compressed vertically.',
    tokens: 92,
    category: 'Parabolas & Functions'
  },
  {
    id: 'alg-p3',
    subject: 'algebra',
    srcId: 'alg-notes',
    sourceTitle: 'Sample study guide: Algebra formulas',
    section: '§4.1 Factoring Polynomials and Zero Product Property',
    page: 45,
    text: 'The Zero Product Property asserts that if ab = 0, then a = 0 or b = 0 (or both). Factoring a trinomial ax² + bx + c into linear binomials (px + q)(rx + s) transforms an addition problem into a product, allowing roots to be resolved directly by equating each linear factor to zero. Common patterns include difference of squares (a² - b² = (a-b)(a+b)) and perfect square trinomials.',
    tokens: 88,
    category: 'Polynomial Factoring'
  },
  {
    id: 'alg-p4',
    subject: 'algebra',
    srcId: 'alg-core',
    sourceTitle: 'Sample notes: Algebra foundations',
    section: '§4.5 Systems of Linear Equations in Two Variables',
    page: 284,
    text: 'A system of linear equations in two variables can be solved through graphing, substitution, or elimination. The solution represents the point of intersection (x, y) of the lines. If the lines are parallel, slopes are equal and y-intercepts differ, resulting in zero solutions (inconsistent system). If the lines coincide, there are infinitely many solutions (dependent system).',
    tokens: 78,
    category: 'Systems of Equations'
  },

  // BIOLOGY PASSAGES
  {
    id: 'bio-p1',
    subject: 'biology',
    srcId: 'bio-core',
    sourceTitle: 'Sample notes: Cellular energy & genetics',
    section: '§8.2 Photosynthesis: Light-Dependent Reactions',
    page: 242,
    text: 'Photosynthesis occurs in chloroplasts. The light-dependent reactions take place across the thylakoid membrane, where chlorophyll absorbs photons to excite electrons in Photosystem II. Photolysis of water releases O₂ as a byproduct and generates protons. The electron transport chain pumps protons into the thylakoid lumen, creating an electrochemical gradient that drives ATP synthase to synthesize ATP and reduces NADP⁺ to NADPH.',
    tokens: 85,
    category: 'Photosynthesis'
  },
  {
    id: 'bio-p2',
    subject: 'biology',
    srcId: 'bio-core',
    sourceTitle: 'Sample notes: Cellular energy & genetics',
    section: '§8.3 The Calvin Cycle & Carbon Fixation',
    page: 251,
    text: 'The light-independent reactions (Calvin cycle) occur in the stroma of the chloroplast. The enzyme RuBisCO catalyzes the fixation of CO₂ onto ribulose-1,5-bisphosphate (RuBP). Using ATP and NADPH produced during the light reactions, 3-PGA is reduced into glyceraldehyde-3-phosphate (G3P). For every three cycles, one G3P molecule exits to form glucose, while the remaining molecules regenerate RuBP.',
    tokens: 83,
    category: 'Photosynthesis'
  },
  {
    id: 'bio-p3',
    subject: 'biology',
    srcId: 'bio-core',
    sourceTitle: 'Sample notes: Cellular energy & genetics',
    section: '§7.2 Cellular Respiration & ATP Yield',
    page: 210,
    text: 'Cellular respiration oxidizes glucose through four major phases: Glycolysis (cytoplasm, net 2 ATP, 2 NADH), Pyruvate Oxidation (mitochondrial matrix), the Citric Acid (Krebs) Cycle (matrix, 2 ATP, 6 NADH, 2 FADH₂), and Oxidative Phosphorylation (inner membrane cristae). Chemiosmosis driven by the proton gradient yields approximately 28-32 ATP per glucose molecule, using oxygen as the terminal electron acceptor.',
    tokens: 84,
    category: 'Cellular Respiration'
  },
  {
    id: 'bio-p4',
    subject: 'biology',
    srcId: 'bio-notes',
    sourceTitle: 'Sample notes: Biochemical pathways',
    section: '§3.4 Plant Vascular Architecture: Xylem vs Phloem',
    page: 78,
    text: 'Vascular plants transport water and solutes through specialized tissues. Xylem consists of dead, lignified tracheids and vessel elements that transport water and inorganic minerals unidirectionally upward from roots to leaves via transpiration pull and cohesion-tension forces. Phloem consists of living sieve-tube elements and companion cells that translocate organic sugars bidirectionally from source to sink via hydrostatic pressure flow.',
    tokens: 81,
    category: 'Plant Physiology'
  },

  // HISTORY PASSAGES
  {
    id: 'hist-p1',
    subject: 'history',
    srcId: 'hist-core',
    sourceTitle: 'Sample notes: Trade networks, statecraft & U.S. history',
    section: '§11.2 Mediterranean & Silk Road Trade Networks',
    page: 345,
    text: 'During the classical and post-classical eras, the Mediterranean Sea served as Mare Nostrum ("Our Sea"), connecting Rome, Alexandria, Carthage, and Constantinople through maritime merchant vessels transporting olive oil, wine, grain, and metals. Simultaneously, the overland Silk Road linked Chang\'an to Antioch, exchanging silk, porcelain, spices, and paper alongside Buddhist and Islamic philosophical traditions.',
    tokens: 76,
    category: 'Trade & Commerce'
  },
  {
    id: 'hist-p2',
    subject: 'history',
    srcId: 'hist-notes',
    sourceTitle: 'Sample notes: Civics & constitutional history',
    section: '§4.3 The Venetian Commerce Ledger of 1483',
    page: 112,
    text: 'Venice dominated late medieval maritime trade through state-regulated galley convoys (muda) and double-entry bookkeeping. Merchant ledgers from 1483 record extensive purchases of pepper and cloves from Ottoman ports like Alexandria and Aleppo, resold across Western Europe at substantial premiums. This Venetian-Ottoman trade monopoly stimulated Portuguese and Spanish navigators to seek oceanic routes around Africa to India.',
    tokens: 77,
    category: 'Renaissance & Trade'
  },
  {
    id: 'hist-p3',
    subject: 'history',
    srcId: 'hist-core',
    sourceTitle: 'Sample notes: Trade networks, statecraft & U.S. history',
    section: '§14.1 The Enlightenment and Democratic Governance',
    page: 472,
    text: 'The European Enlightenment popularized concepts of natural rights, social contracts, and popular sovereignty. John Locke argued that government authority derives from the consent of the governed to protect life, liberty, and property. Baron de Montesquieu proposed the tripartite separation of executive, legislative, and judicial powers to prevent despotism, which directly inspired the framing of the 1787 United States Constitution.',
    tokens: 78,
    category: 'Enlightenment & Civics'
  },
  {
    id: 'hist-p4',
    subject: 'history',
    srcId: 'hist-core',
    sourceTitle: 'Sample notes: Trade networks, statecraft & U.S. history',
    section: '§15.1 The Outbreak of the American Civil War (1861)',
    page: 420,
    text: 'The American Civil War (1861–1865) arose primarily from long-standing sectional disputes over chattel slavery, states\' rights, and federal authority following the election of Abraham Lincoln in November 1860. Beginning with South Carolina, eleven Southern slaveholding states seceded to form the Confederate States of America under Jefferson Davis. Armed conflict erupted on April 12, 1861, when Confederate batteries bombarded the federal garrison at Fort Sumter in Charleston Harbor, compelling Lincoln to call for 75,000 Union volunteers.',
    tokens: 95,
    category: 'American Civil War'
  },
  {
    id: 'hist-p5',
    subject: 'history',
    srcId: 'hist-notes',
    sourceTitle: 'Sample notes: Civics & constitutional history',
    section: '§15.3 The Emancipation Proclamation and the Turning Point at Gettysburg',
    page: 438,
    text: 'On January 1, 1863, President Abraham Lincoln issued the Emancipation Proclamation, declaring all enslaved people in Confederate-held territories to be "forever free" and authorizing African American enlistment in the Union military. Six months later, the Battle of Gettysburg (July 1–3, 1863) halted Confederate General Robert E. Lee\'s invasion of the North, inflicting over 50,000 casualties. Coupled with Ulysses S. Grant\'s capture of Vicksburg on July 4, 1863, the Union secured control of the Mississippi River and turned the tide of the war.',
    tokens: 102,
    category: 'American Civil War'
  },
  {
    id: 'hist-p6',
    subject: 'history',
    srcId: 'hist-core',
    sourceTitle: 'Sample notes: Trade networks, statecraft & U.S. history',
    section: '§16.2 Reconstruction and the Constitutional Amendments',
    page: 456,
    text: 'Following Lee\'s surrender at Appomattox Court House in April 1865, the Reconstruction Era reshaped the American constitutional framework through three Civil War Amendments: the Thirteenth Amendment (1865) abolished slavery throughout the United States, the Fourteenth Amendment (1868) established birthright citizenship and equal protection under the law, and the Fifteenth Amendment (1870) prohibited denying voting rights based on race.',
    tokens: 88,
    category: 'Reconstruction & Civics'
  },
  {
    id: 'hist-p7',
    subject: 'history',
    srcId: 'hist-core',
    sourceTitle: 'Sample notes: Trade networks, statecraft & U.S. history',
    section: '§7.3 The Constitutional Convention & The Federalist Papers',
    page: 184,
    text: 'The 1787 Philadelphia Constitutional Convention replaced the weak Articles of Confederation with a federal republic balancing state and national authority. In Federalist No. 10, James Madison argued that a large commercial republic protects against the tyranny of factions by multiplying competing interests. In Federalist No. 51, Madison defended checks and balances, asserting that "ambition must be made to counteract ambition" through the separation of legislative, executive, and judicial powers.',
    tokens: 92,
    category: 'Constitutional Foundations'
  },
  {
    id: 'hist-p8',
    subject: 'history',
    srcId: 'hist-notes',
    sourceTitle: 'Sample notes: Civics & constitutional history',
    section: '§24.2 World War II & Allied Mobilization',
    page: 588,
    text: 'World War II (1939–1945) pitted the Allied Powers (United States, Great Britain, Soviet Union) against the Axis Powers (Nazi Germany, Imperial Japan, Fascist Italy). Following the attack on Pearl Harbor on December 7, 1941, American industrial mobilization produced unprecedented armaments. Pivotal turning points included the Battle of Midway in the Pacific (1942), the Battle of Stalingrad on the Eastern Front (1943), and the D-Day Normandy landings (June 6, 1944).',
    tokens: 94,
    category: '20th Century Conflicts'
  },
  {
    id: 'hist-p9',
    subject: 'history',
    srcId: 'hist-core',
    sourceTitle: 'Sample notes: Trade networks, statecraft & U.S. history',
    section: '§7.4 The Anti-Federalists & The Ratification Debates of 1787–1788',
    page: 192,
    text: 'During the 1787–1788 ratification debates, Anti-Federalists (prominently Patrick Henry, George Mason, and the essayist Brutus) opposed the proposed Constitution on several fundamental grounds: (1) Fear of Consolidated National Tyranny: Drawing on Montesquieu, they argued an extensive republic would inevitably destroy state sovereignty and replicate British monarchical overreach; (2) Omission of an Explicit Bill of Rights: The draft contained no protections for individual liberties such as free speech, trial by jury, or protection against searches; (3) Excessive Powers: They contested the Necessary and Proper Clause, direct federal taxation, and peacetime standing armies. Ratification was secured only when Federalists pledged to immediately introduce a Bill of Rights in the First Congress.',
    tokens: 128,
    category: 'Constitutional Foundations'
  },
  {
    id: 'hist-p10',
    subject: 'history',
    srcId: 'hist-notes',
    sourceTitle: 'Sample notes: Civics & constitutional history',
    section: '§7.1 The Articles of Confederation & Shays\' Rebellion (1786)',
    page: 176,
    text: 'America\'s first governing charter, the Articles of Confederation (1781–1789), intentionally created a weak unicameral legislature with no executive, no federal judiciary, and no authority to levy direct taxes or regulate interstate commerce. In autumn 1786, debt-ridden Massachusetts farmers led by Revolutionary War veteran Daniel Shays shut down county debt courts to prevent farm foreclosures. Because the Confederation Congress lacked funds and authority to dispatch military forces, the rebellion exposed the fatal vulnerability of the confederation, directly precipitating the 1787 Philadelphia Constitutional Convention.',
    tokens: 112,
    category: 'Constitutional Foundations'
  },

  // ALGEBRA EXPANDED PASSAGES
  {
    id: 'alg-p5',
    subject: 'algebra',
    srcId: 'alg-core',
    sourceTitle: 'Sample notes: Algebra foundations',
    section: '§10.2 Exponential Growth & Logarithmic Inverse Properties',
    page: 702,
    text: 'An exponential function has the form f(x) = abˣ where a ≠ 0, b > 0, and b ≠ 1. If b > 1, the curve exhibits exponential growth; if 0 < b < 1, it demonstrates exponential decay. Logarithmic functions are the inverse of exponentials: y = log_b(x) if and only if bʸ = x. Fundamental logarithmic laws include the product rule log_b(xy) = log_b(x) + log_b(y), the quotient rule log_b(x/y) = log_b(x) - log_b(y), and the power rule log_b(xᵖ) = p · log_b(x).',
    tokens: 96,
    category: 'Exponentials & Logarithms'
  },
  {
    id: 'alg-p6',
    subject: 'algebra',
    srcId: 'alg-notes',
    sourceTitle: 'Sample study guide: Algebra formulas',
    section: '§7.4 Rational Expressions and Asymptotic Behavior',
    page: 156,
    text: 'A rational function R(x) = P(x) / Q(x) consists of a ratio of polynomials where Q(x) ≠ 0. The domain excludes all real numbers where the denominator vanishes. Vertical asymptotes occur at real zeros of Q(x) that are not cancelled by factors in P(x). If a factor cancels completely, it creates a removable discontinuity (hole). Horizontal asymptotes are determined by comparing the degrees of P(x) and Q(x).',
    tokens: 86,
    category: 'Rational Functions'
  },

  // BIOLOGY EXPANDED PASSAGES
  {
    id: 'bio-p5',
    subject: 'biology',
    srcId: 'bio-core',
    sourceTitle: 'Sample notes: Cellular energy & genetics',
    section: '§14.2 DNA Semiconservative Replication & Enzymatic Fork',
    page: 388,
    text: 'DNA replication is semiconservative: each daughter duplex contains one original template strand and one newly synthesized strand. Replication begins at origins of replication where DNA helicase unwinds the double helix, creating replication forks. DNA polymerase III synthesizes the leading strand continuously in the 5\' to 3\' direction, while the lagging strand is synthesized discontinuously in short Okazaki fragments, which are subsequently joined by DNA ligase.',
    tokens: 92,
    category: 'Molecular Genetics'
  },
  {
    id: 'bio-p6',
    subject: 'biology',
    srcId: 'bio-notes',
    sourceTitle: 'Sample notes: Biochemical pathways',
    section: '§12.1 Mendelian Inheritance & Punnett Square Ratios',
    page: 320,
    text: 'Gregor Mendel formulated the Law of Segregation and the Law of Independent Assortment through pea plant breeding experiments. In a monohybrid cross between two heterozygous individuals (Aa × Aa), the genotypic ratio is 1 AA : 2 Aa : 1 aa, producing a classic 3:1 dominant-to-recessive phenotypic ratio. Dihybrid crosses of unlinked genes (AaBb × AaBb) segregate independently to produce a 9:3:3:1 phenotypic ratio.',
    tokens: 88,
    category: 'Genetics & Heredity'
  },

  // CHEMISTRY PASSAGES
  {
    id: 'chem-p1',
    subject: 'chemistry',
    srcId: 'chem-core',
    sourceTitle: 'Sample notes: Atoms, orbitals & reactions',
    section: '§6.3 Atomic Orbitals and Quantum Numbers',
    page: 312,
    text: 'Electrons occupy atomic orbitals defined by quantum numbers: principal (n), angular momentum (l for s, p, d, f subshells), magnetic (ml), and spin (ms). According to the Pauli Exclusion Principle, no two electrons in an atom can have the same four quantum numbers. Hund\'s rule states that electrons singly occupy degenerate orbitals with parallel spins before pairing, minimizing electron-electron repulsion.',
    tokens: 83,
    category: 'Atomic Structure'
  },
  {
    id: 'chem-p2',
    subject: 'chemistry',
    srcId: 'chem-core',
    sourceTitle: 'Sample notes: Atoms, orbitals & reactions',
    section: '§8.4 Molecular Orbital Theory: Bonding & Antibonding',
    page: 420,
    text: 'Molecular orbital (MO) theory describes chemical bonding via Linear Combination of Atomic Orbitals (LCAO). Constructive overlap of atomic wavefunctions yields low-energy bonding orbitals (σ and π), where electron density concentrates between nuclei. Destructive interference creates high-energy antibonding orbitals (σ* and π*) with nodal planes of zero probability density. Bond order equals 1/2(bonding electrons - antibonding electrons).',
    tokens: 82,
    category: 'Chemical Bonding'
  },
  {
    id: 'chem-p3',
    subject: 'chemistry',
    srcId: 'chem-notes',
    sourceTitle: 'Sample notes: Stoichiometry & thermodynamics',
    section: '§3.1 Stoichiometric Mole Ratios and Limiting Reactants',
    page: 38,
    text: 'Chemical equations must be balanced to obey the Law of Conservation of Mass. Stoichiometric coefficients represent molar ratios. In a reaction with non-stoichiometric starting quantities, the limiting reactant is completely consumed first, restricting the maximum theoretical yield of product. Percent yield is calculated as (actual yield / theoretical yield) × 100%.',
    tokens: 68,
    category: 'Stoichiometry'
  },
  {
    id: 'chem-p4',
    subject: 'chemistry',
    srcId: 'chem-core',
    sourceTitle: 'Sample notes: Atoms, orbitals & reactions',
    section: '§9.2 The Ideal Gas Law & Kinetic Molecular Theory',
    page: 480,
    text: 'The Ideal Gas Law PV = nRT combines Boyle\'s Law (P ∝ 1/V), Charles\'s Law (V ∝ T), and Avogadro\'s Law (V ∝ n) with the universal gas constant R (0.08206 L·atm/(mol·K) or 8.314 J/(mol·K)). Kinetic Molecular Theory assumes gas particles possess negligible volume compared to the container, undergo perfectly elastic collisions, and exert no attractive intermolecular forces. Real gases deviate at high pressures and low temperatures.',
    tokens: 92,
    category: 'Gas Laws'
  },
  {
    id: 'chem-p5',
    subject: 'chemistry',
    srcId: 'chem-notes',
    sourceTitle: 'Sample notes: Stoichiometry & thermodynamics',
    section: '§6.5 Periodic Trends: Electronegativity & Ionization Energy',
    page: 110,
    text: 'Periodic trends arise from effective nuclear charge (Z_eff) and electron shielding. First ionization energy and electronegativity generally increase across a period from left to right as Z_eff increases, and decrease down a group as principal quantum level n increases. Atomic radius exhibits the inverse trend: decreasing across a period due to stronger nuclear pull and increasing down a group due to additional electron shells.',
    tokens: 89,
    category: 'Periodic Trends'
  },
  {
    id: 'chem-p6',
    subject: 'chemistry',
    srcId: 'chem-core',
    sourceTitle: 'Sample notes: Atoms, orbitals & reactions',
    section: '§13.3 Le Chatelier\'s Principle & Equilibrium Disturbances',
    page: 630,
    text: 'Le Chatelier\'s principle states that when a dynamic equilibrium system is subjected to a disturbance (stress), the system shifts in the direction that counteracts the stress. For exothermic reactions (ΔH < 0), adding thermal energy drives equilibrium toward reactants; for endothermic reactions (ΔH > 0), adding heat shifts equilibrium toward products. Increasing total pressure by reducing volume shifts the system toward the side with fewer gas moles. Catalysts accelerate forward and reverse reaction rates identically, leaving the equilibrium position and constant K unaffected.',
    tokens: 104,
    category: 'Chemical Equilibrium'
  },
  {
    id: 'bio-p7',
    subject: 'biology',
    srcId: 'bio-core',
    sourceTitle: 'Sample notes: Cellular energy & genetics',
    section: '§8.4 RuBisCO Carboxylase/Oxygenase & Photorespiration in Plants',
    page: 258,
    text: 'RuBisCO is the primary carbon-fixing enzyme in the Calvin cycle, but it possesses dual affinity for both CO₂ (carboxylase activity) and O₂ (oxygenase activity). When hot, arid conditions force plants to close stomata to prevent dehydration, internal CO₂ levels drop while O₂ accumulates. RuBisCO binds oxygen instead, triggering photorespiration—a metabolic pathway that consumes ATP and organic carbon without producing glucose. To mitigate this inefficiency, C4 plants and CAM plants evolved specialized biochemical adaptations that concentrate CO₂ around RuBisCO.',
    tokens: 108,
    category: 'Photosynthesis'
  },
  {
    id: 'alg-p7',
    subject: 'algebra',
    srcId: 'alg-notes',
    sourceTitle: 'Sample study guide: Algebra formulas',
    section: '§9.5 The Discriminant (Δ = b² - 4ac) & Complex Conjugate Roots',
    page: 634,
    text: 'The discriminant Δ = b² - 4ac determines the geometric and numerical character of quadratic roots without fully solving the equation: (1) If Δ > 0, there are two distinct real roots, meaning the parabola intersects the horizontal x-axis at two points; (2) If Δ = 0, there is exactly one repeated real root, signifying the parabola\'s vertex lies directly on the x-axis; (3) If Δ < 0, the square root produces imaginary terms (±i√|Δ|), yielding two complex conjugate roots (a ± bi) where the parabola never crosses the x-axis.',
    tokens: 112,
    category: 'Quadratic Equations'
  },
  ...ALGEBRA_PEDAGOGY_PASSAGES,
  ...BIOLOGY_PEDAGOGY_PASSAGES,
  ...HISTORY_PEDAGOGY_PASSAGES,
  ...CHEMISTRY_PEDAGOGY_PASSAGES
];

export const INITIAL_SOURCES: SourceDocument[] = SAMPLE_SOURCES.map((src) => {
  const own = INITIAL_PASSAGES.filter((p) => p.srcId === src.id);
  return { ...src, passagesCount: own.length, tokens: own.reduce((sum, p) => sum + p.tokens, 0) };
});


// Progress starts empty and only changes when the student answers practice questions
export const INITIAL_TOPIC_MASTERY: Record<SubjectId, TopicMastery[]> = {
  notes: [],
  algebra: [
    {
      topicId: 'alg-quad',
      subject: 'algebra',
      title: 'Quadratic Formula & Discriminant',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Challenge: Solve non-standard equations with complex conjugates'
    },
    {
      topicId: 'alg-parabola',
      subject: 'algebra',
      title: 'Parabolas & Vertex Transformations',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Focus: Identify vertex coordinates (h, k) and horizontal shifts'
    },
    {
      topicId: 'alg-poly',
      subject: 'algebra',
      title: 'Polynomial Factoring & Zero Product',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Practice: Difference of squares and trinomial grouping'
    },
    {
      topicId: 'alg-sys',
      subject: 'algebra',
      title: 'Linear Systems Elimination & Matrices',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Review: Inconsistent vs dependent systems'
    }
  ],
  biology: [
    {
      topicId: 'bio-photo',
      subject: 'biology',
      title: 'Light Reactions & Photolysis',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Synthesis: Trace electron transport from water to NADPH'
    },
    {
      topicId: 'bio-calvin',
      subject: 'biology',
      title: 'Calvin Cycle & Carbon Fixation',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Focus: Role of RuBisCO and regeneration of RuBP'
    },
    {
      topicId: 'bio-resp',
      subject: 'biology',
      title: 'Cellular Respiration & Chemiosmosis',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Practice: Compare ATP yield across glycolysis vs oxidative phosphorylation'
    },
    {
      topicId: 'bio-vasc',
      subject: 'biology',
      title: 'Plant Vascular Tissues (Xylem vs Phloem)',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Review: Transpiration pull vs pressure-flow hypothesis'
    }
  ],
  history: [
    {
      topicId: 'hist-trade',
      subject: 'history',
      title: 'Mediterranean & Silk Road Networks',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Synthesis: Compare overland caravan risks vs maritime galley costs'
    },
    {
      topicId: 'hist-venice',
      subject: 'history',
      title: 'Venetian 1483 Commerce & Ottoman Relations',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Focus: Trace how the spice monopoly triggered Iberian Atlantic voyages'
    },
    {
      topicId: 'hist-enlight',
      subject: 'history',
      title: 'Enlightenment & Separation of Powers',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Review: Locke’s social contract vs Montesquieu’s checks and balances'
    }
  ],
  chemistry: [
    {
      topicId: 'chem-orb',
      subject: 'chemistry',
      title: 'Quantum Numbers & Electron Configurations',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Challenge: Predict paramagnetic vs diamagnetic electronic states'
    },
    {
      topicId: 'chem-mo',
      subject: 'chemistry',
      title: 'Molecular Orbitals & Bonding/Antibonding',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Focus: Calculate bond order and identify nodal planes in antibonding orbitals'
    },
    {
      topicId: 'chem-stoich',
      subject: 'chemistry',
      title: 'Stoichiometry & Limiting Reactants',
      attempts: 0,
      correct: 0,
      accuracy: 0,
      lastPracticed: 'Not yet',
      status: 'new',
      recommendedAction: 'Practice: Theoretical vs actual yield with dimensional analysis'
    }
  ]
};

export const INITIAL_QUIZZES: QuizQuestion[] = [
  // Algebra Quizzes
  {
    id: 'q-alg-1',
    subject: 'algebra',
    topicId: 'alg-quad',
    type: 'conceptual',
    question: 'In the quadratic equation 2x² - 4x + 2 = 0, what does the discriminant reveal about the nature of the roots?',
    options: [
      { label: 'A', text: 'b² - 4ac = 0, so there is exactly one repeated real rational root.', isCorrect: true },
      { label: 'B', text: 'b² - 4ac > 0, so there are two distinct real irrational roots.', isCorrect: false },
      { label: 'C', text: 'b² - 4ac < 0, so there are two complex conjugate roots.', isCorrect: false },
      { label: 'D', text: 'The discriminant cannot be evaluated without dividing by 2 first.', isCorrect: false }
    ],
    explanation: 'b² - 4ac = (-4)² - 4(2)(2) = 16 - 16 = 0. When the discriminant is 0, the parabola touches the x-axis at its vertex, yielding exactly one repeated real root: x = -b/(2a) = 4/4 = 1.',
    passageId: 'alg-p1',
    passageSnippet: 'If b² - 4ac = 0, there is exactly one repeated real solution (the vertex touches the x-axis).',
    difficulty: 'medium'
  },
  {
    id: 'q-alg-2',
    subject: 'algebra',
    topicId: 'alg-parabola',
    type: 'conceptual',
    question: 'The vertex of the parabola y = -3(x + 4)² + 7 is located at which coordinate, and in which direction does it open?',
    options: [
      { label: 'A', text: 'Vertex at (4, 7), opening upward', isCorrect: false },
      { label: 'B', text: 'Vertex at (-4, 7), opening downward because a = -3', isCorrect: true },
      { label: 'C', text: 'Vertex at (-4, -7), opening downward', isCorrect: false },
      { label: 'D', text: 'Vertex at (3, -4), opening upward', isCorrect: false }
    ],
    explanation: 'In vertex form y = a(x - h)² + k, (x + 4) means h = -4 and k = 7. Since the coefficient a = -3 is negative, the parabola is reflected across the horizontal axis and opens downward.',
    passageId: 'alg-p2',
    passageSnippet: 'A parabola given by y = a(x - h)² + k has its vertex at (h, k)... opening downward if a < 0.',
    difficulty: 'easy'
  },
  {
    id: 'q-alg-3',
    subject: 'algebra',
    topicId: 'alg-poly',
    type: 'cloze',
    question: 'Complete the theorem: The _____ asserts that if a product of factors equals zero (ab = 0), at least one factor must be zero.',
    options: [
      { label: 'A', text: 'Zero Product Property', isCorrect: true },
      { label: 'B', text: 'Fundamental Theorem of Arithmetic', isCorrect: false },
      { label: 'C', text: 'Distributive Axiom', isCorrect: false },
      { label: 'D', text: 'Quadratic Mean Equality', isCorrect: false }
    ],
    explanation: 'The Zero Product Property allows us to solve factored polynomial equations like (x - 3)(x + 5) = 0 by setting x - 3 = 0 or x + 5 = 0.',
    passageId: 'alg-p3',
    passageSnippet: 'The Zero Product Property asserts that if ab = 0, then a = 0 or b = 0.',
    difficulty: 'easy'
  },

  // Biology Quizzes
  {
    id: 'q-bio-1',
    subject: 'biology',
    topicId: 'bio-photo',
    type: 'conceptual',
    question: 'During the light-dependent reactions of photosynthesis, what is the immediate source of electrons that replaces those excited in Photosystem II?',
    options: [
      { label: 'A', text: 'Photolysis of water molecules (H₂O), which also releases oxygen gas', isCorrect: true },
      { label: 'B', text: 'Oxidation of glucose in the stroma', isCorrect: false },
      { label: 'C', text: 'Direct absorption of CO₂ by chlorophyll', isCorrect: false },
      { label: 'D', text: 'Reduction of NADP⁺ by ATP synthase', isCorrect: false }
    ],
    explanation: 'An enzyme associated with Photosystem II splits water molecules into 2H⁺, 2e⁻, and 1/2 O₂. These electrons replenish Photosystem II reaction center P680.',
    passageId: 'bio-p1',
    passageSnippet: 'Photolysis of water releases O₂ as a byproduct and generates protons.',
    difficulty: 'medium'
  },
  {
    id: 'q-bio-2',
    subject: 'biology',
    topicId: 'bio-calvin',
    type: 'conceptual',
    question: 'Which enzyme is responsible for catalyzing the initial carbon fixation step in the Calvin cycle?',
    options: [
      { label: 'A', text: 'ATP Synthase', isCorrect: false },
      { label: 'B', text: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase)', isCorrect: true },
      { label: 'C', text: 'DNA Polymerase III', isCorrect: false },
      { label: 'D', text: 'Phosphofructokinase', isCorrect: false }
    ],
    explanation: 'RuBisCO fixes carbon dioxide onto RuBP (ribulose-1,5-bisphosphate) to form unstable 6-carbon intermediates that break down into 3-PGA.',
    passageId: 'bio-p2',
    passageSnippet: 'The enzyme RuBisCO catalyzes the fixation of CO₂ onto ribulose-1,5-bisphosphate (RuBP).',
    difficulty: 'medium'
  },
  {
    id: 'q-bio-3',
    subject: 'biology',
    topicId: 'bio-vasc',
    type: 'conceptual',
    question: 'How does water transport in plant xylem differ fundamentally from sugar transport in phloem?',
    options: [
      { label: 'A', text: 'Xylem cells are dead at maturity and transport water unidirectionally; phloem consists of living cells and moves solutes bidirectionally', isCorrect: true },
      { label: 'B', text: 'Xylem moves sugars downward while phloem moves water upward', isCorrect: false },
      { label: 'C', text: 'Xylem requires metabolic ATP at every vessel while phloem is completely passive', isCorrect: false },
      { label: 'D', text: 'Both tissues consist only of living sieve tubes with identical flow directions', isCorrect: false }
    ],
    explanation: 'Xylem tracheids and vessel elements lose their living cytoplasm at maturity to become rigid hollow tubes for transpiration-driven water flow. Phloem sieve-tube elements remain alive, supported by companion cells.',
    passageId: 'bio-p4',
    passageSnippet: 'Xylem consists of dead, lignified tracheids... Phloem consists of living sieve-tube elements and companion cells.',
    difficulty: 'medium'
  },

  // History Quizzes
  {
    id: 'q-hist-1',
    subject: 'history',
    topicId: 'hist-venice',
    type: 'conceptual',
    question: 'How did the Venetian-Ottoman monopoly on Mediterranean spice and luxury trade directly influence European history in the late 15th century?',
    options: [
      { label: 'A', text: 'It forced Iberian powers (Portugal & Spain) to seek alternative oceanic routes around Africa and across the Atlantic', isCorrect: true },
      { label: 'B', text: 'It caused all European nations to abandon maritime commerce and focus solely on agriculture', isCorrect: false },
      { label: 'C', text: 'It immediately sparked the French Revolution in 1485', isCorrect: false },
      { label: 'D', text: 'It halted paper and printing press production across Italy', isCorrect: false }
    ],
    explanation: 'Because Venetian merchants controlled eastern spice imports through Ottoman intermediaries, prices were exorbitant in Western Europe. This economic pressure prompted Prince Henry the Navigator, Vasco da Gama, and Columbus to seek oceanic bypasses.',
    passageId: 'hist-p2',
    passageSnippet: 'This Venetian-Ottoman trade monopoly stimulated Portuguese and Spanish navigators to seek oceanic routes around Africa to India.',
    difficulty: 'medium'
  },
  {
    id: 'q-hist-2',
    subject: 'history',
    topicId: 'hist-enlight',
    type: 'conceptual',
    question: 'Which Enlightenment political philosopher formulated the doctrine of the tripartite separation of powers into executive, legislative, and judicial branches?',
    options: [
      { label: 'A', text: 'Baron de Montesquieu', isCorrect: true },
      { label: 'B', text: 'Thomas Hobbes', isCorrect: false },
      { label: 'C', text: 'Jean-Jacques Rousseau', isCorrect: false },
      { label: 'D', text: 'Niccolò Machiavelli', isCorrect: false }
    ],
    explanation: 'Montesquieu argued in "The Spirit of the Laws" (1748) that liberty is preserved only when governmental authority is distributed among distinct branches that check and balance one another.',
    passageId: 'hist-p3',
    passageSnippet: 'Baron de Montesquieu proposed the tripartite separation of executive, legislative, and judicial powers to prevent despotism.',
    difficulty: 'easy'
  },
  {
    id: 'q-hist-3',
    subject: 'history',
    topicId: 'hist-civilwar',
    type: 'conceptual',
    question: 'What were the primary constitutional turning points of the Reconstruction Era following the American Civil War?',
    options: [
      { label: 'A', text: 'The 13th Amendment (abolishing slavery), 14th Amendment (birthright citizenship & equal protection), and 15th Amendment (voting rights)', isCorrect: true },
      { label: 'B', text: 'The Articles of Confederation and the Northwest Ordinance', isCorrect: false },
      { label: 'C', text: 'The Missouri Compromise and the Kansas-Nebraska Act', isCorrect: false },
      { label: 'D', text: 'The Monroe Doctrine and the Roosevelt Corollary', isCorrect: false }
    ],
    explanation: 'The three Civil War Amendments transformed the Constitution: the 13th abolished slavery, the 14th established national citizenship and equal protection, and the 15th protected voting rights.',
    passageId: 'hist-p6',
    passageSnippet: 'The Reconstruction Era reshaped the American constitutional framework through three Civil War Amendments: the Thirteenth, Fourteenth, and Fifteenth Amendments.',
    difficulty: 'medium'
  },
  {
    id: 'q-hist-4',
    subject: 'history',
    topicId: 'hist-civilwar',
    type: 'conceptual',
    question: 'Why were the twin Union victories at Gettysburg and Vicksburg in July 1863 considered the decisive turning points of the Civil War?',
    options: [
      { label: 'A', text: 'Gettysburg repelled Robert E. Lee’s Northern invasion while Vicksburg gave the Union complete control of the Mississippi River, dividing the Confederacy', isCorrect: true },
      { label: 'B', text: 'They resulted in immediate peace treaties signed in Richmond that same week', isCorrect: false },
      { label: 'C', text: 'They prompted Great Britain to officially join the Confederate war effort', isCorrect: false },
      { label: 'D', text: 'They ended all military action west of the Appalachian Mountains', isCorrect: false }
    ],
    explanation: 'Gettysburg ended the Confederacy’s ability to wage aggressive offensives into Northern territory, while Grant’s siege of Vicksburg severed Confederate supply lines across the Mississippi River.',
    passageId: 'hist-p5',
    passageSnippet: 'Coupled with Ulysses S. Grant’s capture of Vicksburg on July 4, 1863, the Union secured control of the Mississippi River and turned the tide of the war.',
    difficulty: 'medium'
  },
  {
    id: 'q-hist-5',
    subject: 'history',
    topicId: 'hist-fed',
    type: 'conceptual',
    question: 'In Federalist No. 10, how did James Madison argue that a large commercial republic protects liberty against the dangers of factional tyranny?',
    options: [
      { label: 'A', text: 'By multiplying diverse economic and religious interests across a vast territory, making it difficult for an oppressive majority faction to unite', isCorrect: true },
      { label: 'B', text: 'By eliminating all political parties through federal censorship', isCorrect: false },
      { label: 'C', text: 'By giving the executive branch absolute veto power over state laws', isCorrect: false },
      { label: 'D', text: 'By restricting voting exclusively to military officers', isCorrect: false }
    ],
    explanation: 'Madison argued that rather than trying to destroy the causes of factions (which would destroy liberty), a large republic controls their effects by encompassing a multiplicity of interests.',
    passageId: 'hist-p7',
    passageSnippet: 'James Madison argued that a large commercial republic protects against the tyranny of factions by multiplying competing interests.',
    difficulty: 'hard'
  },

  // Additional Biology Quizzes
  {
    id: 'q-bio-4',
    subject: 'biology',
    topicId: 'bio-resp',
    type: 'conceptual',
    question: 'Which stage of cellular respiration produces the vast majority of ATP molecules, and what mechanism drives it?',
    options: [
      { label: 'A', text: 'Oxidative phosphorylation via chemiosmosis driven by an electrochemical proton gradient across the inner mitochondrial membrane', isCorrect: true },
      { label: 'B', text: 'Glycolysis in the cytoplasm through substrate-level phosphorylation only', isCorrect: false },
      { label: 'C', text: 'The citric acid cycle in the matrix via direct photon capture', isCorrect: false },
      { label: 'D', text: 'Lactic acid fermentation during anaerobic bursts', isCorrect: false }
    ],
    explanation: 'Oxidative phosphorylation generates approximately 26–28 of the 30–32 ATP molecules per glucose using electron transport chain complexes and ATP synthase chemiosmosis.',
    passageId: 'bio-p3',
    passageSnippet: 'Chemiosmosis driven by the proton gradient yields approximately 28-32 ATP per glucose molecule, using oxygen as the terminal electron acceptor.',
    difficulty: 'medium'
  },
  {
    id: 'q-bio-5',
    subject: 'biology',
    topicId: 'bio-dna',
    type: 'conceptual',
    question: 'Why is the lagging strand synthesized discontinuously in Okazaki fragments during DNA replication?',
    options: [
      { label: 'A', text: 'DNA polymerase can only add nucleotides in the 5\' to 3\' direction, so the lagging strand must be synthesized away from the advancing replication fork', isCorrect: true },
      { label: 'B', text: 'Helicase unwinds the lagging strand in reverse bursts', isCorrect: false },
      { label: 'C', text: 'RNA primers can only bind to adenine bases on the lagging strand', isCorrect: false },
      { label: 'D', text: 'The lagging strand contains uracil instead of thymine', isCorrect: false }
    ],
    explanation: 'Because DNA strands are antiparallel and DNA polymerase III only synthesizes in the 5\' to 3\' direction, the lagging strand template running 5\' to 3\' into the fork must be synthesized in short fragments.',
    passageId: 'bio-p5',
    passageSnippet: 'DNA polymerase III synthesizes the leading strand continuously... while the lagging strand is synthesized discontinuously in short Okazaki fragments.',
    difficulty: 'hard'
  },
  {
    id: 'q-bio-6',
    subject: 'biology',
    topicId: 'bio-genetics',
    type: 'conceptual',
    question: 'What phenotypic ratio is expected in the F2 generation of a Mendelian dihybrid cross (AaBb × AaBb) involving two unlinked, independently assorting genes?',
    options: [
      { label: 'A', text: '9 dominant-dominant : 3 dominant-recessive : 3 recessive-dominant : 1 recessive-recessive', isCorrect: true },
      { label: 'B', text: '3 dominant : 1 recessive', isCorrect: false },
      { label: 'C', text: '1 : 2 : 1 genotypic ratio', isCorrect: false },
      { label: 'D', text: 'All offspring show intermediate codominant phenotypes', isCorrect: false }
    ],
    explanation: 'Independent assortment of two heterozygous gene pairs (Aa × Aa yields 3:1; Bb × Bb yields 3:1) multiplies to yield the classic 9:3:3:1 phenotypic ratio.',
    passageId: 'bio-p6',
    passageSnippet: 'Dihybrid crosses of unlinked genes (AaBb × AaBb) segregate independently to produce a 9:3:3:1 phenotypic ratio.',
    difficulty: 'medium'
  },

  // Additional Algebra Quizzes
  {
    id: 'q-alg-4',
    subject: 'algebra',
    topicId: 'alg-sys',
    type: 'conceptual',
    question: 'What does it mean geometrically and algebraically when a system of two linear equations has zero solutions?',
    options: [
      { label: 'A', text: 'The lines are parallel with identical slopes and different y-intercepts (inconsistent system)', isCorrect: true },
      { label: 'B', text: 'The lines intersect at the origin (0, 0)', isCorrect: false },
      { label: 'C', text: 'The lines coincide and share all points (dependent system)', isCorrect: false },
      { label: 'D', text: 'The slopes are negative reciprocals forming perpendicular lines', isCorrect: false }
    ],
    explanation: 'Parallel lines never intersect. Because they have the exact same slope but different y-intercepts, no coordinate pair (x, y) satisfies both equations simultaneously.',
    passageId: 'alg-p4',
    passageSnippet: 'If the lines are parallel, slopes are equal and y-intercepts differ, resulting in zero solutions (inconsistent system).',
    difficulty: 'easy'
  },
  {
    id: 'q-alg-5',
    subject: 'algebra',
    topicId: 'alg-exp',
    type: 'conceptual',
    question: 'According to logarithmic laws, how can the expression log₂(x³ / y) be rewritten in expanded form?',
    options: [
      { label: 'A', text: '3 · log₂(x) - log₂(y)', isCorrect: true },
      { label: 'B', text: 'log₂(3x) / log₂(y)', isCorrect: false },
      { label: 'C', text: '3 · (log₂(x) + log₂(y))', isCorrect: false },
      { label: 'D', text: 'log₂(x) · log₂(y) - 3', isCorrect: false }
    ],
    explanation: 'Using the quotient rule log_b(A/B) = log_b(A) - log_b(B) and the power rule log_b(Aᵖ) = p · log_b(A), log₂(x³/y) expands to log₂(x³) - log₂(y) = 3·log₂(x) - log₂(y).',
    passageId: 'alg-p5',
    passageSnippet: 'Fundamental logarithmic laws include the quotient rule log_b(x/y) = log_b(x) - log_b(y), and the power rule log_b(xᵖ) = p · log_b(x).',
    difficulty: 'medium'
  },

  // Additional Chemistry Quizzes
  {
    id: 'q-chem-3',
    subject: 'chemistry',
    topicId: 'chem-stoich',
    type: 'conceptual',
    question: 'In a chemical reaction, what defines the "limiting reactant" and how does it determine product yield?',
    options: [
      { label: 'A', text: 'It is the reactant completely consumed first based on stoichiometric mole ratios, restricting the maximum theoretical yield', isCorrect: true },
      { label: 'B', text: 'It is always the reactant with the smallest initial mass in grams', isCorrect: false },
      { label: 'C', text: 'It is the catalyst that speeds up the reaction rate without being consumed', isCorrect: false },
      { label: 'D', text: 'It is the product that precipitates out of aqueous solution first', isCorrect: false }
    ],
    explanation: 'The limiting reactant is governed by molar proportions in the balanced equation, not mass alone. Once it is fully consumed, product synthesis ceases, setting theoretical yield.',
    passageId: 'chem-p3',
    passageSnippet: 'The limiting reactant is completely consumed first, restricting the maximum theoretical yield of product.',
    difficulty: 'medium'
  },
  {
    id: 'q-chem-4',
    subject: 'chemistry',
    topicId: 'chem-gas',
    type: 'conceptual',
    question: 'Under what physical conditions do real gases deviate most significantly from ideal behavior described by PV = nRT?',
    options: [
      { label: 'A', text: 'High pressures and low temperatures, where molecular volume and intermolecular attractions cannot be neglected', isCorrect: true },
      { label: 'B', text: 'Low pressures and high temperatures', isCorrect: false },
      { label: 'C', text: 'Standard Temperature and Pressure (STP) only', isCorrect: false },
      { label: 'D', text: 'Whenever the gas is noble and monatomic', isCorrect: false }
    ],
    explanation: 'At high pressures, gas particles are crowded together and their finite volume becomes significant. At low temperatures, kinetic energy drops and intermolecular attractions pull particles together.',
    passageId: 'chem-p4',
    passageSnippet: 'Kinetic Molecular Theory assumes gas particles possess negligible volume... Real gases deviate at high pressures and low temperatures.',
    difficulty: 'medium'
  },
  {
    id: 'q-chem-5',
    subject: 'chemistry',
    topicId: 'chem-trends',
    type: 'conceptual',
    question: 'Why does electronegativity generally increase across a period from left to right on the periodic table?',
    options: [
      { label: 'A', text: 'Effective nuclear charge (Z_eff) increases with no increase in shielding shells, pulling bonding electrons more strongly', isCorrect: true },
      { label: 'B', text: 'The number of occupied electron shells doubles across each period', isCorrect: false },
      { label: 'C', text: 'Atomic radius expands, giving valence electrons more space to move', isCorrect: false },
      { label: 'D', text: 'Mass number decreases from alkali metals to halogens', isCorrect: false }
    ],
    explanation: 'Moving across a period adds protons to the nucleus while electrons enter the same valence shell. Greater effective nuclear charge draws electron clouds closer, increasing electronegativity.',
    passageId: 'chem-p5',
    passageSnippet: 'First ionization energy and electronegativity generally increase across a period from left to right as Z_eff increases.',
    difficulty: 'medium'
  },
  ...AP_CHEM_PROBLEM_BANK
];
