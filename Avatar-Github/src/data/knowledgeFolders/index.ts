import { KnowledgeFolder } from '../../types';
import { AP_CHEM_PROBLEM_BANK } from '../apChemistryProblemBank';
import { ALGEBRA_PROBLEM_BANK } from '../algebraProblemBank';
import { BIOLOGY_PROBLEM_BANK } from '../biologyProblemBank';
import { HISTORY_PROBLEM_BANK } from '../historyProblemBank';

/**
 * Knowledge Folder Registry
 * Dedicated master knowledge vaults for:
 * 1. Dr. Kevin Chen (AP Chemistry)
 * 2. Marcus Vance (Secondary & AP Precalculus Algebra)
 * 3. Dr. Nia Thorne (AP Biology)
 * 4. Prof. Arthur Sterling (AP US & World History)
 */

export const DR_KEVIN_CHEN_KNOWLEDGE_FOLDER: KnowledgeFolder = {
  id: 'folder-chem-kevin-chen',
  subject: 'chemistry',
  tutorId: 'kevin',
  tutorName: 'Dr. Kevin Chen',
  tutorTitle: 'Physical Chemist & Reaction Systems Mentor',
  title: 'Dr. Kevin Chen\'s AP Chemistry Master Knowledge Vault',
  shortDescription: `Sample chemistry material written for Avatar Network: ${AP_CHEM_PROBLEM_BANK.length} hand-written practice questions, misconception guides and free-response tips.`,
  icon: '⚗️',
  badge: `Chemistry · ${AP_CHEM_PROBLEM_BANK.length} questions · Sample content`,
  problemCount: AP_CHEM_PROBLEM_BANK.length,
  units: [
    {
      id: 'unit-1',
      unitNumber: 1,
      title: 'Atomic Structure & Properties',
      examWeightPct: '7–9%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Moles & Molar Mass', 'Mass Spectrometry', 'Elemental Composition', 'PES Binding Energy', 'Periodic Trends Z_eff', 'Valence & Coulombic Attractions'],
      cedStandards: ['AP Chem LO 1.1', 'AP Chem LO 1.2', 'AP Chem LO 1.5']
    },
    {
      id: 'unit-2',
      unitNumber: 2,
      title: 'Molecular & Ionic Compound Structure & Properties',
      examWeightPct: '7–9%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Lattice Energy', 'Potential Energy Curves', 'Lewis & Formal Charge', 'VSEPR Shapes', 'Hybridization (sp-sp³)', 'Alloys'],
      cedStandards: ['AP Chem LO 2.1', 'AP Chem LO 2.4', 'AP Chem LO 2.7']
    },
    {
      id: 'unit-3',
      unitNumber: 3,
      title: 'Intermolecular Forces & Properties',
      examWeightPct: '18–22%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['IMFs (LDF, Dipole, H-Bond)', 'Phase Changes', 'Ideal Gas Law (PV=nRT)', 'Dalton\'s Law', 'Kinetic Molecular Theory', 'Beer-Lambert Spectroscopy'],
      cedStandards: ['AP Chem LO 3.1', 'AP Chem LO 3.4', 'AP Chem LO 3.11']
    },
    {
      id: 'unit-4',
      unitNumber: 4,
      title: 'Chemical Reactions & Stoichiometry',
      examWeightPct: '7–9%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Net Ionic Equations', 'Representations of Reactions', 'Limiting Reactants', 'Percent Yield', 'Redox Half-Reactions', 'Acid-Base Neutralization'],
      cedStandards: ['AP Chem LO 4.2', 'AP Chem LO 4.5', 'AP Chem LO 4.7']
    },
    {
      id: 'unit-5',
      unitNumber: 5,
      title: 'Kinetics',
      examWeightPct: '7–9%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Reaction Rates', 'Differential Rate Laws', 'Integrated Rate Laws (0, 1, 2)', 'Half-Life Decay', 'Arrhenius & Activation Energy', 'Reaction Mechanisms & RDS'],
      cedStandards: ['AP Chem LO 5.1', 'AP Chem LO 5.3', 'AP Chem LO 5.7']
    },
    {
      id: 'unit-6',
      unitNumber: 6,
      title: 'Thermodynamics',
      examWeightPct: '7–9%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Endo vs Exothermic Processes', 'Calorimetry (q=mcΔT)', 'Hess\'s Law', 'Standard Enthalpies of Formation', 'Bond Enthalpies (Broken - Formed)', 'Energy Diagrams'],
      cedStandards: ['AP Chem LO 6.1', 'AP Chem LO 6.4', 'AP Chem LO 6.8']
    },
    {
      id: 'unit-7',
      unitNumber: 7,
      title: 'Equilibrium',
      examWeightPct: '7–9%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Equilibrium Constants (Kc & Kp)', 'Reaction Quotient Q vs K', 'Le Châtelier\'s Principle', 'Solubility Product (Ksp)', 'Common-Ion Effect', 'Precipitation Criterion'],
      cedStandards: ['AP Chem LO 7.1', 'AP Chem LO 7.3', 'AP Chem LO 7.11']
    },
    {
      id: 'unit-8',
      unitNumber: 8,
      title: 'Acids & Bases',
      examWeightPct: '11–15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['pH, pOH & Kw', 'Weak Acid Ka & Base Kb', 'Buffer Solutions', 'Henderson-Hasselbalch', 'Titration Curves & Half-Equivalence', 'Salt Hydrolysis'],
      cedStandards: ['AP Chem LO 8.1', 'AP Chem LO 8.4', 'AP Chem LO 8.8']
    },
    {
      id: 'unit-9',
      unitNumber: 9,
      title: 'Applications of Thermodynamics & Electrochemistry',
      examWeightPct: '7–9%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Entropy (ΔS)', 'Gibbs Free Energy (ΔG = ΔH - TΔS)', 'Thermodynamic vs Kinetic Control', 'Galvanic & Electrolytic Cells', 'Standard Cell Potential (E°)', 'Nernst Equation & Faraday\'s Law'],
      cedStandards: ['AP Chem LO 9.1', 'AP Chem LO 9.4', 'AP Chem LO 9.8']
    }
  ],
  pedagogyContext: {
    gradeLevel: 'High School AP Chemistry (Grades 10–12)',
    examFormat: 'Section I: 60 MCQs (90 min) | Section II: 7 FRQs (3 Long, 4 Short, 105 min)',
    commonMisconceptionsCount: 12,
    guidedLabsCount: 16,
    frqRubricsAvailable: true,
    differentiatedTeachingNotes: 'Tiered scaffolding: Beginner visual scale & dimensional analysis templates; Advanced Olympiad (USNCO) molecular orbital symmetry and multi-step equilibrium challenges.'
  }
};

export const MARCUS_VANCE_KNOWLEDGE_FOLDER: KnowledgeFolder = {
  id: 'folder-alg-marcus-vance',
  subject: 'algebra',
  tutorId: 'marcus',
  tutorName: 'Marcus Vance',
  tutorTitle: 'Pure Math & Algebraic Reasoning Fellow',
  title: 'Marcus Vance\'s Algebraic Reasoning Vault',
  shortDescription: 'Sample algebra material written for Avatar Network: linear systems, quadratic vertex geometry, polynomial factoring, and visual coordinate proofs.',
  icon: '📐',
  badge: `Algebra · ${ALGEBRA_PROBLEM_BANK.length} questions · Sample content`,
  problemCount: ALGEBRA_PROBLEM_BANK.length,
  units: [
    {
      id: 'alg-u1',
      unitNumber: 1,
      title: 'Linear Systems, Inequalities & Absolute Value',
      examWeightPct: '20%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Slope-Intercept', 'Elimination & Substitution', '3-Variable Systems', 'Linear Programming', 'Absolute Value Equations'],
      cedStandards: ['CCSS.MATH.HSA.REI.B.4', 'CCSS.MATH.HSA.CED.A.3']
    },
    {
      id: 'alg-u2',
      unitNumber: 2,
      title: 'Quadratic Equations, Complex Numbers & Vertex Form',
      examWeightPct: '25%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Quadratic Formula', 'Discriminant Δ Analysis', 'Completing the Square', 'Complex Arithmetic', 'Projectile Motion Optimization'],
      cedStandards: ['CCSS.MATH.HSF.IF.C.7.A', 'CCSS.MATH.HSN.CN.A.2']
    },
    {
      id: 'alg-u3',
      unitNumber: 3,
      title: 'Polynomial Factoring, Division & Rational Functions',
      examWeightPct: '25%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Zero Product Property', 'Synthetic Division & Remainder Theorem', 'Rational Zero Theorem', 'Asymptotes & Holes', 'Partial Fractions'],
      cedStandards: ['CCSS.MATH.HSA.SSE.B.3', 'CCSS.MATH.HSA.APR.B.2']
    },
    {
      id: 'alg-u4',
      unitNumber: 4,
      title: 'Exponential & Logarithmic Functions',
      examWeightPct: '15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Log Properties (Product, Quotient, Power)', 'Exponential Equations', 'Compound Interest (e^rt)', 'Extraneous Log Roots'],
      cedStandards: ['CCSS.MATH.HSF.LE.A.4', 'AP Precalc 2.1']
    },
    {
      id: 'alg-u5',
      unitNumber: 5,
      title: 'Sequences, Series & Conic Sections',
      examWeightPct: '15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Arithmetic & Geometric Sequences', 'Infinite Geometric Series', 'Binomial Theorem', 'Ellipses & Hyperbolas'],
      cedStandards: ['CCSS.MATH.HSF.BF.A.2', 'AP Precalc 3.2']
    }
  ],
  pedagogyContext: {
    gradeLevel: 'High School Honors Algebra / Precalculus (Grades 8–11)',
    examFormat: 'SAT Math / State Regents / AP Precalculus Alignment (Multiple Choice & Grid-In Justifications)',
    commonMisconceptionsCount: 10,
    guidedLabsCount: 6,
    frqRubricsAvailable: true,
    differentiatedTeachingNotes: 'Visual geometric area model scaffolding for students with equation anxiety; reverse substitution verification protocols.'
  }
};

export const DR_NIA_THORNE_KNOWLEDGE_FOLDER: KnowledgeFolder = {
  id: 'folder-bio-nia-thorne',
  subject: 'biology',
  tutorId: 'nia',
  tutorName: 'Dr. Nia Thorne',
  tutorTitle: 'Cellular & Evolutionary Systems Biologist',
  title: 'Dr. Nia Thorne\'s AP Biology Systems Vault',
  shortDescription: 'Sample biology material written for Avatar Network: cellular energetics, photosynthesis light/dark reactions, molecular genetics, replication forks, and Mendelian inheritance.',
  icon: '🧬',
  badge: `Biology · ${BIOLOGY_PROBLEM_BANK.length} questions · Sample content`,
  problemCount: BIOLOGY_PROBLEM_BANK.length,
  units: [
    {
      id: 'bio-u1',
      unitNumber: 1,
      title: 'Chemistry of Life & Macromolecules',
      examWeightPct: '8–11%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Water Polarity & H-Bonds', 'Macromolecule Synthesis', 'Protein Folding Levels', 'Nucleic Acid Directionality (5\' to 3\')'],
      cedStandards: ['AP Bio LO 1.1', 'AP Bio LO 1.2', 'AP Bio LO 1.4']
    },
    {
      id: 'bio-u2',
      unitNumber: 2,
      title: 'Cell Structure & Function',
      examWeightPct: '10–13%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Endosymbiosis', 'Surface Area-to-Volume Ratio', 'Membrane Permeability', 'Water Potential (Ψ = Ψs + Ψp)'],
      cedStandards: ['AP Bio LO 2.1', 'AP Bio LO 2.4', 'AP Bio LO 2.8']
    },
    {
      id: 'bio-u3',
      unitNumber: 3,
      title: 'Cellular Energetics',
      examWeightPct: '12–16%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Enzyme Catalysis & Inhibition', 'Photosystem II & Chemiosmosis', 'Calvin Cycle', 'Glycolysis, Krebs & ETC'],
      cedStandards: ['AP Bio LO 3.1', 'AP Bio LO 3.4', 'AP Bio LO 3.7']
    },
    {
      id: 'bio-u4',
      unitNumber: 4,
      title: 'Cell Communication & Cell Cycle',
      examWeightPct: '10–15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['GPCR & Kinase Cascades', 'Feedback Loops', 'Mitosis & Checkpoints', 'Cyclins & CDKs (MPF)'],
      cedStandards: ['AP Bio LO 4.1', 'AP Bio LO 4.3', 'AP Bio LO 4.7']
    },
    {
      id: 'bio-u5',
      unitNumber: 5,
      title: 'Heredity & Mendelian Genetics',
      examWeightPct: '8–11%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Meiosis & Crossing Over', 'Mendelian Dihybrid Crosses', 'Sex-Linked Pedigrees', 'Non-Nuclear Inheritance'],
      cedStandards: ['AP Bio LO 5.1', 'AP Bio LO 5.3', 'AP Bio LO 5.5']
    },
    {
      id: 'bio-u6',
      unitNumber: 6,
      title: 'Gene Expression & Regulation',
      examWeightPct: '12–16%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['DNA Replication Enzymes', 'Transcription & RNA Processing', 'Translation & Ribosomes', 'Operons & Epigenetic Acetylation'],
      cedStandards: ['AP Bio LO 6.1', 'AP Bio LO 6.4', 'AP Bio LO 6.7']
    },
    {
      id: 'bio-u7',
      unitNumber: 7,
      title: 'Natural Selection & Evolution',
      examWeightPct: '13–20%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Hardy-Weinberg Equilibrium', 'Genetic Drift & Bottlenecks', 'Phylogenetic Cladograms', 'Speciation Mechanisms'],
      cedStandards: ['AP Bio LO 7.1', 'AP Bio LO 7.4', 'AP Bio LO 7.9']
    },
    {
      id: 'bio-u8',
      unitNumber: 8,
      title: 'Ecology & Population Dynamics',
      examWeightPct: '10–15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Trophic Efficiency (10% Rule)', 'Population Growth (Logistic/Exponential)', 'Community Niches', 'Keystone Species Cascades'],
      cedStandards: ['AP Bio LO 8.1', 'AP Bio LO 8.3', 'AP Bio LO 8.6']
    }
  ],
  pedagogyContext: {
    gradeLevel: 'High School AP Biology (Grades 10–12)',
    examFormat: 'Section I: 60 MCQs (90 min) | Section II: 6 FRQs (2 Long, 4 Short, 90 min)',
    commonMisconceptionsCount: 12,
    guidedLabsCount: 13,
    frqRubricsAvailable: true,
    differentiatedTeachingNotes: 'Mnemonic pathway flowcharts and physical analog models bridging molecular active sites to ecosystem carrying capacities.'
  }
};

export const PROF_ARTHUR_STERLING_KNOWLEDGE_FOLDER: KnowledgeFolder = {
  id: 'folder-hist-arthur-sterling',
  subject: 'history',
  tutorId: 'arthur',
  tutorName: 'Prof. Arthur Sterling',
  tutorTitle: 'Comparative Historiographer & Archival Scholar',
  title: 'Prof. Arthur Sterling\'s Historiographical Archives',
  shortDescription: 'Sample history material written for Avatar Network: Mediterranean trade networks, Enlightenment constitutional philosophy, Civil War forensic amendments, and DBQ rubric master guides.',
  icon: '🏛️',
  badge: `History & civics · ${HISTORY_PROBLEM_BANK.length} questions · Sample content`,
  problemCount: HISTORY_PROBLEM_BANK.length,
  units: [
    {
      id: 'hist-u1',
      unitNumber: 1,
      title: 'Global Exchange Networks & Early Modern Statecraft (1200–1750)',
      examWeightPct: '15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Silk Road & Indian Ocean Monsoons', 'Ottoman Devshirme & Bureaucracy', 'Columbian Exchange Demographic Impact', 'Silver Trade Flows'],
      cedStandards: ['AP World 1.1', 'AP World 2.2', 'AP World 4.3']
    },
    {
      id: 'hist-u2',
      unitNumber: 2,
      title: 'Enlightenment Philosophy, Revolutions & Constitutional Frameworks',
      examWeightPct: '20%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['John Locke & Social Contract', 'Declaration of Independence', 'Federalist No. 10 & 51', '1787 Constitutional Compromises'],
      cedStandards: ['AP US Gov 1.1', 'AP US Gov 1.3', 'AP US History 3.2']
    },
    {
      id: 'hist-u3',
      unitNumber: 3,
      title: 'The American Civil War, Reconstruction & Constitutional Amendments',
      examWeightPct: '20%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Emancipation Proclamation Scope', '13th, 14th, 15th Amendments', 'Radical Reconstruction', 'Compromise of 1877 & Redeemers'],
      cedStandards: ['AP US History 5.5', 'AP US History 5.8', 'AP US History 5.11']
    },
    {
      id: 'hist-u4',
      unitNumber: 4,
      title: 'Industrialization, Corporate Monopolies & Gilded Age Reform',
      examWeightPct: '15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Standard Oil Horizontal Integration', 'Carnegie Steel Vertical Integration', 'Labor Unions & Pullman Strike', '16th–19th Progressive Amendments'],
      cedStandards: ['AP US History 6.1', 'AP US History 6.3', 'AP US History 7.2']
    },
    {
      id: 'hist-u5',
      unitNumber: 5,
      title: 'Global Conflicts, Totalitarianism & the Cold War Era',
      examWeightPct: '15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['George Kennan & Containment', 'Cuban Missile Crisis Brinkmanship', 'Marshall Plan', 'Vietnam & Antiwar Movement'],
      cedStandards: ['AP US History 8.2', 'AP US History 8.5', 'AP World 8.1']
    },
    {
      id: 'hist-u6',
      unitNumber: 6,
      title: 'Civil Rights Movements & Modern Constitutional Jurisprudence',
      examWeightPct: '15%',
      topicCount: 0, // counted from keyTopics below
      problemCount: 0, // counted from the question bank below
      keyTopics: ['Brown v. Board of Education (1954)', 'Civil Rights Act of 1964', 'Voting Rights Act of 1965', 'Warren Court Jurisprudence'],
      cedStandards: ['AP US History 8.10', 'AP US Gov 3.4', 'AP US Gov 4.2']
    }
  ],
  pedagogyContext: {
    gradeLevel: 'High School AP U.S. / World History (Grades 10–12)',
    examFormat: 'Section I: 55 MCQs (55 min) + 3 SAQs (40 min) | Section II: 1 DBQ + 1 LEQ (100 min)',
    commonMisconceptionsCount: 10,
    guidedLabsCount: 8,
    frqRubricsAvailable: true,
    differentiatedTeachingNotes: 'HIPP primary source forensics (Historical Situation, Intended Audience, Purpose, Point of View) and DBQ 7-point thesis crafting.'
  }
};

export const TUTOR_KNOWLEDGE_FOLDERS: Record<string, KnowledgeFolder> = {
  chemistry: DR_KEVIN_CHEN_KNOWLEDGE_FOLDER,
  algebra: MARCUS_VANCE_KNOWLEDGE_FOLDER,
  biology: DR_NIA_THORNE_KNOWLEDGE_FOLDER,
  history: PROF_ARTHUR_STERLING_KNOWLEDGE_FOLDER
};

// Per-unit question counts come from the actual banks (topic ids carry the unit, e.g. chem-u3-kmt)
const BANKS: Record<string, { topicId: string }[]> = {
  chemistry: AP_CHEM_PROBLEM_BANK,
  algebra: ALGEBRA_PROBLEM_BANK,
  biology: BIOLOGY_PROBLEM_BANK,
  history: HISTORY_PROBLEM_BANK
};
Object.values(TUTOR_KNOWLEDGE_FOLDERS).forEach((folder) => {
  const bank = BANKS[folder.subject] || [];
  folder.units.forEach((unit) => {
    unit.problemCount = bank.filter((q) => q.topicId.includes(`-u${unit.unitNumber}-`)).length;
    unit.topicCount = unit.keyTopics.length;
  });
});
