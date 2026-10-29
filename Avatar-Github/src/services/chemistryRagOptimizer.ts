import { Passage, SubjectId } from '../types';

/**
 * Universal Domain RAG Optimizer & Scalable Ingestion Pipeline
 * Implements best practices for indexing and retrieval across all 4 subjects:
 * 1. Chemistry: Formula Normalization, reaction boundary preservation, stoichiometry
 * 2. Algebra: LaTeX & exponent normalization, algebraic variable patterns, coordinate equations
 * 3. Biology: Biochemical pathway normalization, genetic codon notation, cellular organelle relations
 * 4. History: Primary source date & citation parsing, HIPP document sourcing, constitutional forensics
 * 5. Multi-Subject Pedagogy & Misconception Intent Routing
 */

export interface DomainRAGRules {
  subject: SubjectId;
  title: string;
  normalizeQuery: (query: string) => { cleanQuery: string; expandedTerms: string[]; formulaEntities: string[] };
  preserveEquationBoundaries?: (text: string) => string[];
  calculateDomainBoost: (query: string, passage: Passage, terms: string[]) => number;
}

// Map of Unicode subscripts and superscripts to ASCII
const UNICODE_SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '₊': '+', '₋': '-',
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-'
};

// Common AP Chemistry Abbreviations & expansions
const CHEM_ABBREVIATIONS: Record<string, string[]> = {
  pes: ['photoelectron spectroscopy', 'binding energy', 'core electrons'],
  imf: ['intermolecular forces', 'london dispersion', 'dipole dipole', 'hydrogen bonding'],
  vsepr: ['valence shell electron pair repulsion', 'molecular geometry', 'electron geometry'],
  ksp: ['solubility product constant', 'molar solubility', 'precipitation'],
  ka: ['acid dissociation constant', 'weak acid', 'ionization'],
  kb: ['base dissociation constant', 'weak base', 'hydroxide'],
  kw: ['autoionization of water', '1.0e-14', 'ph poh'],
  ice: ['initial change equilibrium table', 'equilibrium concentrations'],
  kmt: ['kinetic molecular theory', 'maxwell boltzmann', 'gas velocities'],
  rds: ['rate determining step', 'reaction mechanism', 'elementary step'],
  stp: ['standard temperature pressure', '273 k', '1 atm', '22.4 l'],
  galvanic: ['voltaic cell', 'spontaneous', 'standard cell potential', 'anode cathode'],
  electrolysis: ['faraday law', 'electrolytic cell', 'current time'],
  beer: ['beer lambert law', 'absorbance', 'spectrophotometry', 'molar absorptivity'],
  hess: ['hess law', 'enthalpy of reaction', 'thermochemical equation'],
  buffer: ['henderson hasselbalch', 'weak acid conjugate base', 'buffer capacity']
};

// Common Algebra Abbreviations & expansions
const ALG_ABBREVIATIONS: Record<string, string[]> = {
  discriminant: ['b^2 - 4ac', 'nature of roots', 'quadratic formula'],
  vertex: ['parabola turning point', '-b/(2a)', 'vertex form', 'axis of symmetry'],
  asymptote: ['rational function', 'vertical asymptote', 'horizontal asymptote', 'limits'],
  foil: ['first outside inside last', 'binomial multiplication', 'polynomial expansion'],
  cts: ['completing the square', 'perfect square trinomial', 'vertex form'],
  zpp: ['zero product property', 'factoring roots', 'polynomial zeros'],
  partial: ['partial fraction decomposition', 'rational functions', 'heaviside cover up'],
  extraneous: ['extraneous solution', 'radical equation', 'rational equation', 'domain restriction']
};

// Common Biology Abbreviations & expansions
const BIO_ABBREVIATIONS: Record<string, string[]> = {
  etc: ['electron transport chain', 'chemiosmosis', 'proton gradient', 'atp synthase'],
  atp: ['adenosine triphosphate', 'cellular energetics', 'phosphorylation'],
  rubisco: ['ribulose bisphosphate carboxylase', 'calvin cycle', 'carbon fixation', 'c3 photosynthesis'],
  pcr: ['polymerase chain reaction', 'dna amplification', 'taq polymerase'],
  hw: ['hardy weinberg equilibrium', 'allele frequency', 'p^2 + 2pq + q^2'],
  gpcr: ['g protein coupled receptor', 'signal transduction', 'camp secondary messenger'],
  cdk: ['cyclin dependent kinase', 'cell cycle checkpoints', 'mpf mitosis'],
  operon: ['lac operon', 'trp operon', 'transcriptional regulation', 'repressor operator'],
  dslip: ['dihybrid cross', 'independent assortment', '9:3:3:1 ratio']
};

// Common History Abbreviations & expansions
const HIST_ABBREVIATIONS: Record<string, string[]> = {
  hipp: ['historical situation', 'intended audience', 'purpose', 'point of view', 'archival forensics'],
  dbq: ['document based question', '7 point rubric', 'thesis contextualization sourcing complexity'],
  ccot: ['continuity and change over time', 'historical reasoning', 'long term shifts'],
  reconstruction: ['13th 14th 15th amendments', 'radical reconstruction', 'compromise of 1877', 'freedmen'],
  enlightenment: ['john locke', 'social contract', 'natural rights', 'montesquieu separation of powers'],
  containment: ['george kennan', 'cold war', 'truman doctrine', 'marshall plan', 'soviet expansion'],
  gilded: ['standard oil', 'carnegie steel', 'monopoly', 'horizontal integration', 'vertical integration'],
  vra: ['voting rights act of 1965', 'selma march', 'literacy tests', 'preclearance'],
  antifederalists: ['anti-federalists', 'bill of rights', 'brutus i', 'patrick henry', 'george mason', 'state sovereignty', 'ratification'],
  antifederalist: ['anti-federalist', 'bill of rights', 'brutus i', 'patrick henry', 'george mason', 'state sovereignty', 'ratification'],
  federalists: ['federalist papers', 'james madison', 'alexander hamilton', 'john jay', 'federalist 10', 'federalist 51'],
  ratification: ['constitutional convention 1787', 'anti-federalist opposition', 'bill of rights compromise', 'state sovereignty'],
  constitution: ['constitutional convention 1787', 'great compromise', 'bicameral', 'three-fifths compromise', 'bill of rights']
};

/**
 * Normalizes chemical formulas and greek symbols to bridge user query and vectorized corpus
 */
export function normalizeChemicalText(text: string): string {
  let normalized = text;
  for (const [unicode, ascii] of Object.entries(UNICODE_SUBSCRIPT_MAP)) {
    normalized = normalized.replaceAll(unicode, ascii);
  }
  normalized = normalized
    .replace(/ΔH/g, 'delta H enthalpy')
    .replace(/ΔG/g, 'delta G free energy')
    .replace(/ΔS/g, 'delta S entropy')
    .replace(/ΔT/g, 'delta T temperature change')
    .replace(/λ/g, 'lambda wavelength')
    .replace(/ε/g, 'epsilon molar absorptivity')
    .replace(/π/g, 'pi bond')
    .replace(/σ/g, 'sigma bond')
    .replace(/⇌|<=>|⇄/g, ' reversible reaction equilibrium ')
    .replace(/→|->/g, ' yields produces ');
  return normalized;
}

/**
 * Normalizes algebraic math expressions and LaTeX symbols
 */
export function normalizeAlgebraText(text: string): string {
  return text
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/√/g, 'sqrt')
    .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/±/g, '+/-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/≠/g, '!=');
}

/**
 * Extracts recognized chemical formula entities (e.g. H2O, Ca(OH)2, SO4^2-, NaCl, AlCl3)
 */
export function extractChemicalFormulas(text: string): string[] {
  const norm = normalizeChemicalText(text);
  const formulaRegex = /\b([A-Z][a-z]?\d*(?:\([A-Z][a-z]?\d*\)\d*)*[+-]?\d*)\b/g;
  const matches = norm.match(formulaRegex) || [];
  const commonWords = new Set(['in', 'at', 'no', 'he', 'as', 'am', 'is', 'be', 'so', 'to', 'or', 'an', 'on', 'if', 'it', 'me', 'my', 'we', 'up', 'do']);
  return matches.filter(m => {
    if (commonWords.has(m.toLowerCase())) return false;
    return /\d/.test(m) || m.includes('(') || m.includes('+') || m.includes('-') || (m.length > 2 && /[A-Z]/.test(m));
  });
}

/**
 * 1. Chemistry Domain RAG Rules
 */
export const CHEMISTRY_RAG_RULES: DomainRAGRules = {
  subject: 'chemistry',
  title: 'Chemistry & Reaction Systems RAG Optimizer',

  normalizeQuery: (query: string) => {
    const cleanNorm = normalizeChemicalText(query);
    const rawTerms = cleanNorm.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
    const expandedTerms: string[] = [...rawTerms];
    const formulaEntities = extractChemicalFormulas(query);

    for (const term of rawTerms) {
      if (CHEM_ABBREVIATIONS[term]) {
        expandedTerms.push(...CHEM_ABBREVIATIONS[term]);
      }
    }

    return { cleanQuery: cleanNorm, expandedTerms, formulaEntities };
  },

  calculateDomainBoost: (query: string, passage: Passage, _terms: string[]): number => {
    let boost = 0;
    const queryLower = query.toLowerCase();
    const passageTextLower = passage.text.toLowerCase();
    const passageTitleLower = (passage.sourceTitle || '').toLowerCase();
    const passageCategory = (passage.category || '').toLowerCase();

    // 1. Exact chemical formula match boost (+0.35)
    const formulas = extractChemicalFormulas(query);
    for (const f of formulas) {
      if (passage.text.includes(f) || normalizeChemicalText(passage.text).includes(f)) {
        boost += 0.35;
        break;
      }
    }

    // 2. High School Pedagogy / Misconception Intent Routing (+0.40)
    const pedagogySignals = ['teach', 'misconception', 'student error', 'confuse', 'pedagogy', 'lab', 'rubric', 'frq point', 'ced', 'scoring'];
    const isPedagogyQuery = pedagogySignals.some(s => queryLower.includes(s));
    const isPedagogyPassage =
      passageCategory.includes('pedagogy') ||
      passageCategory.includes('misconception') ||
      passageCategory.includes('laboratory') ||
      passageCategory.includes('rubric') ||
      passageTitleLower.includes('misconception') ||
      passageTitleLower.includes('ced');

    if (isPedagogyQuery && isPedagogyPassage) {
      boost += 0.40;
    }

    // 3. AP Chemistry Unit Targeting (+0.30)
    const unitMatch = queryLower.match(/unit\s*([1-9])/i);
    if (unitMatch) {
      const uNum = unitMatch[1];
      if (passage.section.includes(`Unit ${uNum}`) || passage.text.includes(`Unit ${uNum}`) || passage.id.includes(`u${uNum}`)) {
        boost += 0.30;
      }
    }

    return Math.min(0.55, boost);
  }
};

/**
 * 2. Algebra Domain RAG Rules
 */
export const ALGEBRA_RAG_RULES: DomainRAGRules = {
  subject: 'algebra',
  title: 'Algebraic Structures & Coordinate RAG Optimizer',

  normalizeQuery: (query: string) => {
    const cleanNorm = normalizeAlgebraText(query);
    const rawTerms = cleanNorm.toLowerCase().replace(/[^a-z0-9^]/g, ' ').split(/\s+/).filter(Boolean);
    const expandedTerms: string[] = [...rawTerms];

    for (const term of rawTerms) {
      if (ALG_ABBREVIATIONS[term]) {
        expandedTerms.push(...ALG_ABBREVIATIONS[term]);
      }
    }

    return { cleanQuery: cleanNorm, expandedTerms, formulaEntities: [] };
  },

  calculateDomainBoost: (query: string, passage: Passage, _terms: string[]): number => {
    let boost = 0;
    const queryLower = query.toLowerCase();
    const passageTextLower = passage.text.toLowerCase();
    const passageCategory = (passage.category || '').toLowerCase();

    // 1. Quadratic and variable structure boost (+0.35)
    if ((query.includes('^2') || query.includes('²') || queryLower.includes('quadratic')) &&
        (passageTextLower.includes('quadratic') || passageTextLower.includes('parabola') || passageTextLower.includes('discriminant'))) {
      boost += 0.35;
    }

    // 2. Pedagogy & Misconception routing (+0.40)
    const pedagogySignals = ['misconception', 'student error', 'confuse', 'cancel', 'factor', 'lab', 'proof', 'rubric', 'ccss'];
    if (pedagogySignals.some(s => queryLower.includes(s)) && (passageCategory.includes('misconceptions') || passageCategory.includes('inquiry'))) {
      boost += 0.40;
    }

    // 3. Unit matching
    const unitMatch = queryLower.match(/unit\s*([1-5])/i);
    if (unitMatch && (passage.section.includes(`Unit ${unitMatch[1]}`) || passage.id.includes(`u${unitMatch[1]}`))) {
      boost += 0.30;
    }

    return Math.min(0.55, boost);
  }
};

/**
 * 3. Biology Domain RAG Rules
 */
export const BIOLOGY_RAG_RULES: DomainRAGRules = {
  subject: 'biology',
  title: 'Cellular & Evolutionary Systems RAG Optimizer',

  normalizeQuery: (query: string) => {
    const cleanNorm = query;
    const rawTerms = cleanNorm.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
    const expandedTerms: string[] = [...rawTerms];

    for (const term of rawTerms) {
      if (BIO_ABBREVIATIONS[term]) {
        expandedTerms.push(...BIO_ABBREVIATIONS[term]);
      }
    }

    return { cleanQuery: cleanNorm, expandedTerms, formulaEntities: [] };
  },

  calculateDomainBoost: (query: string, passage: Passage, _terms: string[]): number => {
    let boost = 0;
    const queryLower = query.toLowerCase();
    const passageCategory = (passage.category || '').toLowerCase();

    // 1. Biological pathway term match (+0.35)
    const bioKeywords = ['photosynthesis', 'respiration', 'mitochondria', 'chloroplast', 'transcription', 'translation', 'allele', 'operon'];
    for (const kw of bioKeywords) {
      if (queryLower.includes(kw) && passage.text.toLowerCase().includes(kw)) {
        boost += 0.25;
        break;
      }
    }

    // 2. Pedagogy & Misconception routing (+0.40)
    const pedagogySignals = ['misconception', 'student error', 'teleological', 'lab', 'floating disk', 'respirometer', 'rubric', 'chi-square', 'practice'];
    if (pedagogySignals.some(s => queryLower.includes(s)) && (passageCategory.includes('misconceptions') || passageCategory.includes('inquiry') || passageCategory.includes('pedagogy'))) {
      boost += 0.40;
    }

    // 3. AP Bio Unit matching (Units 1-8)
    const unitMatch = queryLower.match(/unit\s*([1-8])/i);
    if (unitMatch && (passage.section.includes(`Unit ${unitMatch[1]}`) || passage.id.includes(`u${unitMatch[1]}`))) {
      boost += 0.30;
    }

    return Math.min(0.55, boost);
  }
};

/**
 * 4. History Domain RAG Rules
 */
export const HISTORY_RAG_RULES: DomainRAGRules = {
  subject: 'history',
  title: 'Archival & Historiographical RAG Optimizer',

  normalizeQuery: (query: string) => {
    const cleanNorm = query;
    const rawTerms = cleanNorm.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
    const expandedTerms: string[] = [...rawTerms];

    for (const term of rawTerms) {
      if (HIST_ABBREVIATIONS[term]) {
        expandedTerms.push(...HIST_ABBREVIATIONS[term]);
      }
    }

    return { cleanQuery: cleanNorm, expandedTerms, formulaEntities: [] };
  },

  calculateDomainBoost: (query: string, passage: Passage, _terms: string[]): number => {
    let boost = 0;
    const queryLower = query.toLowerCase();
    const passageCategory = (passage.category || '').toLowerCase();

    // 1. Year and chronological match (+0.35)
    const yearMatch = query.match(/\b(1[2-9]\d{2}|20\d{2})\b/);
    if (yearMatch && passage.text.includes(yearMatch[0])) {
      boost += 0.35;
    }

    // 2. Primary document / HIPP sourcing signals (+0.40)
    const hippSignals = ['hipp', 'sourcing', 'point of view', 'audience', 'purpose', 'historical situation', 'dbq', 'rubric', 'misconception', 'presentism'];
    if (hippSignals.some(s => queryLower.includes(s)) && (passageCategory.includes('misconceptions') || passageCategory.includes('inquiry') || passageCategory.includes('scoring'))) {
      boost += 0.40;
    }

    // 3. AP History Unit matching (Units 1-6)
    const unitMatch = queryLower.match(/unit\s*([1-6])/i);
    if (unitMatch && (passage.section.includes(`Unit ${unitMatch[1]}`) || passage.id.includes(`u${unitMatch[1]}`))) {
      boost += 0.30;
    }

    // 4. Constitutional & Ratification Debates (+0.40)
    const constSignals = ['constitution', 'ratif', 'federalist', 'anti-federalist', 'antifederalist', 'brutus', 'bill of rights', 'madison', 'hamilton', 'articles of confederation', 'shays'];
    const pTextLower = passage.text.toLowerCase();
    if (constSignals.some(s => queryLower.includes(s)) && (passage.category === 'Constitutional Foundations' || pTextLower.includes('constitution') || pTextLower.includes('federalist'))) {
      boost += 0.40;
    }

    return Math.min(0.55, boost);
  }
};

/**
 * Universal Subject Domain Indexer Registry
 */
export const DOMAIN_RAG_REGISTRY: Record<SubjectId, DomainRAGRules> = {
  chemistry: CHEMISTRY_RAG_RULES,
  algebra: ALGEBRA_RAG_RULES,
  biology: BIOLOGY_RAG_RULES,
  history: HISTORY_RAG_RULES
};

/**
 * Smart Chemistry Chunker: Preserves chemical equations and stoichiometric balances
 */
export function chunkChemistryDocument(
  text: string,
  docId: string,
  sourceTitle: string,
  targetWords: number = 120
): Passage[] {
  const normalizedText = normalizeChemicalText(text);
  const paragraphs = normalizedText.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const chunks: Passage[] = [];
  let chunkIdx = 1;

  for (const para of paragraphs) {
    const hasEquation = para.includes(' yields ') || para.includes(' reversible reaction ') || para.includes('→') || para.includes('⇌');
    
    if (hasEquation && para.split(/\s+/).length < 220) {
      chunks.push({
        id: `${docId}-chem-chunk-${chunkIdx++}`,
        subject: 'chemistry',
        srcId: docId,
        sourceTitle,
        section: `Reaction Section ${chunkIdx - 1}`,
        text: para,
        tokens: Math.round(para.length / 4),
        category: 'Chemical Reaction Context'
      });
      continue;
    }

    const words = para.split(/\s+/);
    for (let i = 0; i < words.length; i += targetWords - 20) {
      const chunkWords = words.slice(i, i + targetWords);
      if (chunkWords.length < 15) continue;
      const chunkText = chunkWords.join(' ');
      chunks.push({
        id: `${docId}-chem-chunk-${chunkIdx++}`,
        subject: 'chemistry',
        srcId: docId,
        sourceTitle,
        section: `Part ${chunkIdx - 1}`,
        text: chunkText,
        tokens: Math.round(chunkText.length / 4),
        category: 'Chemistry Concept'
      });
    }
  }

  return chunks;
}
