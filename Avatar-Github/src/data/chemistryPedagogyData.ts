import { Passage, SourceDocument } from '../types';

/**
 * Sample teaching material for the Chemistry Avatar (Dr. Kevin Chen, a fictional persona), written for
 * Avatar Network: course topics, common misconceptions, lab investigations and free-response tips.
 */

export const CHEMISTRY_PEDAGOGY_SOURCES: SourceDocument[] = [
  {
    id: 'chem-ced-framework',
    subject: 'chemistry',
    title: 'Sample guide: Chemistry course topics & skills',
    shortTitle: 'Chemistry course topics',
    kind: 'syllabus',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Chemistry course units, big ideas and science practices.'
  },
  {
    id: 'chem-misconceptions-guide',
    subject: 'chemistry',
    title: 'Sample guide: Common chemistry misconceptions',
    shortTitle: 'Chemistry misconceptions',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Diagnostic protocols for correcting pervasive high school student errors in thermodynamics, equilibrium, bonding, and kinetics.'
  },
  {
    id: 'chem-lab-inquiry-manual',
    subject: 'chemistry',
    title: 'Sample guide: Chemistry lab investigations',
    shortTitle: 'Chemistry labs',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Protocols for spectrophotometry, calorimetry, titration curves, kinetics rate laws, and voltaic cell electrochemistry.'
  },
  {
    id: 'chem-frq-rubrics-vault',
    subject: 'chemistry',
    title: 'Sample guide: Writing chemistry free responses',
    shortTitle: 'Chemistry free responses',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Scoring criteria for FRQ command terms ("justify", "explain using Coulombic attraction"), significant figures, and justification traps.'
  },
  {
    id: 'chem-ap-vault',
    subject: 'chemistry',
    title: 'Sample practice questions: Chemistry (43)',
    shortTitle: 'Chemistry practice (43)',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    isExam: true,
    docSummary: '43 hand-written chemistry practice questions with step-by-step explanations and answers.'
  }
];

export const CHEMISTRY_PEDAGOGY_PASSAGES: Passage[] = [
  // 1. CED Framework Passages
  {
    id: 'chem-ped-p1',
    subject: 'chemistry',
    srcId: 'chem-ced-framework',
    sourceTitle: 'Sample guide: Chemistry course topics & skills',
    section: '§1.1 Curricular Weighting & The 4 Big Ideas',
    page: 12,
    text: 'The AP Chemistry curriculum is anchored by 4 Big Ideas: (1) Scale, Proportion, and Quantity—chemical quantities can be described in moles, molarity, and stoichiometry; (2) Structure and Properties—properties of substances are determined by atomic structure and bonding geometries; (3) Transformations—macroscopic changes result from chemical rearrangements obeying conservation laws; and (4) Energy—thermodynamics dictates reaction favorability through enthalpy (ΔH) and entropy (ΔS). Exam weighting prioritizes Unit 3 (Intermolecular Forces: 18-22%), Unit 7 (Equilibrium: 7-9%), Unit 8 (Acids & Bases: 11-15%), and Unit 9 (Thermodynamics & Electrochemistry: 7-9%).',
    tokens: 118,
    category: 'Curriculum & Standards'
  },
  {
    id: 'chem-ped-p2',
    subject: 'chemistry',
    srcId: 'chem-ced-framework',
    sourceTitle: 'Sample guide: Chemistry course topics & skills',
    section: '§1.2 The 6 Science Practices in High School AP Chemistry',
    page: 24,
    text: 'High school educators must ground every unit in the 6 AP Science Practices: SP 1 (Models & Representations: particulate drawings of hydration shells, Lewis structures, energy diagrams); SP 2 (Question & Method: designing valid controlled experiments); SP 3 (Representing Data & Characteristics); SP 4 (Analyzing & Evaluating Data: Beer\'s Law calibration curves, integrated rate law linear plots); SP 5 (Solving Problems Using Mathematical Relationships: ICE tables, PV=nRT, Henderson-Hasselbalch, Nernst equation); and SP 6 (Developing Arguments & Justifications: using first-principles Coulomb\'s Law and intermolecular forces rather than simplistic octet rule jargon).',
    tokens: 124,
    category: 'Pedagogy & Science Practices'
  },
  {
    id: 'chem-ped-p3',
    subject: 'chemistry',
    srcId: 'chem-ced-framework',
    sourceTitle: 'Sample guide: Chemistry course topics & skills',
    section: '§1.3 Exam Architecture: Section I (MCQ) & Section II (FRQ)',
    page: 38,
    text: 'The AP Chemistry Exam lasts 3 hours and 15 minutes. Section I consists of 60 multiple-choice questions (90 minutes, 50% score weight). Section II consists of 7 free-response questions (105 minutes, 50% score weight): 3 long multi-part questions (10 points each) and 4 short focused questions (4 points each). Calculators (scientific or graphing) and the official AP Periodic Table / Formula Sheet are permitted throughout both sections. High school pacing requires students to average 1.5 minutes per MCQ and allocate approximately 23 minutes per long FRQ and 9 minutes per short FRQ.',
    tokens: 114,
    category: 'Exam Strategy'
  },

  // 2. Common Misconceptions Passages
  {
    id: 'chem-misc-p1',
    subject: 'chemistry',
    srcId: 'chem-misconceptions-guide',
    sourceTitle: 'Sample guide: Common chemistry misconceptions',
    section: '§2.1 Misconception #1: Bond Breaking vs Bond Forming Energetics',
    page: 15,
    text: 'Pervasive High School Misconception: "Breaking bonds releases energy because ATP holds high-energy bonds." Correct Pedagogical Clarification: Chemical bond breaking is ALWAYS strictly endothermic (ΔH > 0). It requires an input of electrostatic potential energy to overcome the Coulombic attraction between shared electrons and bonded positive nuclei. Conversely, bond formation is ALWAYS strictly exothermic (ΔH < 0), releasing potential energy as stable bonds form. ATP hydrolysis is exothermic overall only because the new bonds formed in ADP and inorganic phosphate (plus hydration enthalpy) release significantly more energy than was absorbed to break the phosphoanhydride linkage.',
    tokens: 126,
    category: 'Student Misconceptions'
  },
  {
    id: 'chem-misc-p2',
    subject: 'chemistry',
    srcId: 'chem-misconceptions-guide',
    sourceTitle: 'Sample guide: Common chemistry misconceptions',
    section: '§2.2 Misconception #2: Dynamic Chemical Equilibrium vs Concentration Equality',
    page: 29,
    text: 'Pervasive High School Misconception: "When a reaction reaches equilibrium, the concentrations of reactants and products are equal." Correct Pedagogical Clarification: Chemical equilibrium is defined by kinetic equality, NOT concentration equality. At equilibrium, the rate of the forward reaction equals the rate of the reverse reaction (r_forward = r_reverse). Consequently, the concentrations of reactants and products remain CONSTANT over time, but their ratio is determined solely by the equilibrium constant K = [Products] / [Reactants]. If K >> 1, products predominate; if K << 1, reactants predominate; rarely are concentrations identical.',
    tokens: 116,
    category: 'Student Misconceptions'
  },
  {
    id: 'chem-misc-p3',
    subject: 'chemistry',
    srcId: 'chem-misconceptions-guide',
    sourceTitle: 'Sample guide: Common chemistry misconceptions',
    section: '§2.3 Misconception #3: Acid Strength vs Acid Concentration',
    page: 44,
    text: 'Pervasive High School Misconception: "A concentrated weak acid (e.g. 12 M acetic acid) is a stronger acid than dilute strong acid (e.g. 0.001 M HCl)." Correct Pedagogical Clarification: Acid strength describes the thermodynamic degree of ionization (Ka or percent ionization α), which is independent of molarity. Strong acids (HCl, HBr, HI, HNO₃, HClO₄, H₂SO₄) ionize virtually 100% in aqueous solution. Weak acids ionize only partially (<5%). A 0.001 M HCl solution has [H⁺] = 0.001 M and pH = 3.0, whereas a 0.1 M acetic acid solution (Ka = 1.8 × 10⁻⁵) has [H⁺] ≈ 0.0013 M despite having 100× higher molarity.',
    tokens: 122,
    category: 'Student Misconceptions'
  },
  {
    id: 'chem-misc-p4',
    subject: 'chemistry',
    srcId: 'chem-misconceptions-guide',
    sourceTitle: 'Sample guide: Common chemistry misconceptions',
    section: '§2.4 Misconception #4: Le Châtelier Shifts & Inert Gas Addition',
    page: 58,
    text: 'Pervasive High School Misconception: "Adding an inert gas (e.g. helium or argon) increases total pressure, so the equilibrium must shift toward the side with fewer moles of gas." Correct Pedagogical Clarification: If an inert gas is added at CONSTANT VOLUME, the total pressure increases, but the partial pressures of the reacting gases remain completely unchanged (P_i = n_i RT / V). Because the partial pressures and molar concentrations are unaltered, the reaction quotient Q remains equal to K, and NO equilibrium shift occurs. A shift occurs ONLY if the inert gas is added at CONSTANT PRESSURE, which forces container volume to expand, diluting reactant and product partial pressures.',
    tokens: 132,
    category: 'Student Misconceptions'
  },
  {
    id: 'chem-misc-p5',
    subject: 'chemistry',
    srcId: 'chem-misconceptions-guide',
    sourceTitle: 'Sample guide: Common chemistry misconceptions',
    section: '§2.5 Misconception #5: Buffer Action & Buffer Capacity vs pH',
    page: 72,
    text: 'Pervasive High School Misconception: "A buffer solution always maintains a neutral pH of 7.0." Correct Pedagogical Clarification: A buffer is an aqueous solution containing comparable molar quantities of a conjugate acid-base pair (e.g., CH₃COOH and CH₃COO⁻). Buffers resist changes in pH upon addition of small amounts of strong acid or base, but their operational pH is governed by the Henderson-Hasselbalch equation: pH = pKa + log([A⁻]/[HA]). Buffers can be formulated across the entire pH spectrum (e.g., pH 3.8 for formic acid, pH 9.25 for ammonium/ammonia). Buffer capacity depends on the absolute molar concentrations of the conjugate pair, while buffer pH depends on their ratio.',
    tokens: 134,
    category: 'Student Misconceptions'
  },

  // 3. Guided Inquiry Labs Passages
  {
    id: 'chem-lab-p1',
    subject: 'chemistry',
    srcId: 'chem-lab-inquiry-manual',
    sourceTitle: 'Sample guide: Chemistry lab investigations',
    section: '§3.1 Lab 1: Spectrophotometry & Beer-Lambert Calibration Curves',
    page: 18,
    text: 'AP Chemistry Guided Inquiry Lab 1 explores the Beer-Lambert Law: A = ε·b·c. Students prepare standard dilutions of colored solutions (such as food dyes or CuSO₄), select the optimal analytical wavelength (λ_max) where absorbance is maximized, and construct a standard curve of absorbance vs molarity. Critical experimental error sources evaluated on the AP Exam include: (1) fingerprints or water droplets on the optical faces of the cuvette, which scatter incident light and artificially increase absorbance; (2) air bubbles trapped in the light path; and (3) failing to blank the spectrophotometer with pure solvent prior to measuring unknowns.',
    tokens: 122,
    category: 'Laboratory Inquiry'
  },
  {
    id: 'chem-lab-p2',
    subject: 'chemistry',
    srcId: 'chem-lab-inquiry-manual',
    sourceTitle: 'Sample guide: Chemistry lab investigations',
    section: '§3.2 Lab 4: Calorimetry, Heat Capacity & Hess\'s Law Verification',
    page: 45,
    text: 'In the coffee-cup calorimetry investigation, students measure enthalpy changes (q_rxn = -q_calorimeter = -(m_solution · c_water · ΔT + C_cal · ΔT)) for the dissolution of salts (NaOH, NH₄NO₃) and acid-base neutralizations. Hess\'s Law is validated by showing that the enthalpy of combustion of magnesium ribbon can be determined by combining the enthalpies of: (1) Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g); (2) MgO(s) + 2HCl(aq) → MgCl₂(aq) + H₂O(l); and (3) H₂(g) + 1/2 O₂(g) → H₂O(l). Major experimental errors include heat loss to the styrofoam cup and ambient air, resulting in calculated |ΔH| values smaller than literature standards.',
    tokens: 126,
    category: 'Laboratory Inquiry'
  },
  {
    id: 'chem-lab-p3',
    subject: 'chemistry',
    srcId: 'chem-lab-inquiry-manual',
    sourceTitle: 'Sample guide: Chemistry lab investigations',
    section: '§3.3 Lab 11: Acid-Base Titration Curves & Indicator Selection',
    page: 88,
    text: 'Using drop-counting pH sensors or burets, students titrate weak acids (acetic acid, KHP) with strong bases (NaOH) to generate complete titration curves. Students identify: (1) the initial pH determined by weak acid equilibrium; (2) the buffering region where pH changes gradually; (3) the half-equivalence point where [HA] = [A⁻] and pH = pKa; (4) the equivalence point where moles of base equal initial moles of acid, resulting in a basic pH (>7) due to conjugate base hydrolysis; and (5) post-equivalence excess base. An appropriate acid-base indicator must have its pKa / transition interval (pK_In ± 1) overlap the steep vertical equivalence pH inflection.',
    tokens: 128,
    category: 'Laboratory Inquiry'
  },

  // 4. FRQ Rubric Forensics Passages
  {
    id: 'chem-frq-p1',
    subject: 'chemistry',
    srcId: 'chem-frq-rubrics-vault',
    sourceTitle: 'Sample guide: Writing chemistry free responses',
    section: '§4.1 FRQ Rubric Forensics: Command Terms & Coulombic Justifications',
    page: 14,
    text: 'AP-style chemistry free-response rubrics typically differentiate between descriptive statements and mechanistic justifications. Students frequently forfeit points by writing "it wants 8 electrons" or "it has a stable octet." To earn full credit for periodic trends or lattice energies, students must cite: (1) Coulomb\'s Law (F ∝ q₁q₂ / r²); (2) Effective Nuclear Charge (Z_eff = Z - S): stating that moving across a period adds protons while core shielding remains constant; and (3) Principal Quantum Level (n): moving down a group adds electron shells, increasing average distance r from the nucleus and attenuating nuclear-electron attraction.',
    tokens: 124,
    category: 'FRQ Rubric Forensics'
  },
  {
    id: 'chem-frq-p2',
    subject: 'chemistry',
    srcId: 'chem-frq-rubrics-vault',
    sourceTitle: 'Sample guide: Writing chemistry free responses',
    section: '§4.2 FRQ Rubric Forensics: Significant Figures & Unit Conventions',
    page: 28,
    text: 'On AP Chemistry FRQs, one point across the 7 questions is formally designated as a significant figures point (typically on an analytical or stoichiometry calculation). Students are granted a tolerance of ±1 significant figure from the true answer based on input precision. Crucially, units must be explicitly included on all calculated numerical values. Common fatal errors that invalidate points include: reporting molar mass without g/mol, omitting units for the rate constant k (which change depending on overall reaction order: M¹⁻ⁿ s⁻¹), and confusing Joules (J) with kiloJoules (kJ) when calculating ΔG° = ΔH° - TΔS° or using Faraday\'s constant in ΔG° = -nFE°.',
    tokens: 126,
    category: 'FRQ Rubric Forensics'
  }
];
