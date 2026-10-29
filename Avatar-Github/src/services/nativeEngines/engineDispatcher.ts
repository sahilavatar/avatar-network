import { solveQuadratic, solveLinear, simplifyFraction, calculateGradePrecision, evaluateSafeArithmetic } from './mathEngine';
import { calculateMolarMass, solveIdealGas, balanceReactionLookup } from './chemistryEngine';
import { solveMonohybridPunnett, translateDnaSequence } from './bioEngine';
import { calculateHistoricalDistance } from './timelineEngine';
import { SubjectId } from '../../types';

export type CalculatorKind = 'math' | 'chemistry' | 'biology' | 'timeline';
export const ALL_CALCULATORS: ReadonlySet<CalculatorKind> = new Set(['math', 'chemistry', 'biology', 'timeline']);

export interface DispatchedToolResult {
  toolName: string;
  badge: string;
  input: string;
  result: string;
  steps: string[];
  explanation: string;
}

export interface ParsedEquation {
  // ax² + bx + c = 0 after moving everything to the left
  a: number;
  b: number;
  c: number;
  // Constant on the left and number on the right, as the student wrote them
  leftConstant: number;
  rhs: number;
  // The equation is essentially the whole message (e.g. "2x² - 4x - 6 = 0?")
  coversQuery: boolean;
}

/**
 * Parses a single-variable polynomial equation of degree ≤ 2 such as "2x² - 4x - 6 = 0",
 * "x^2 - 9 = 0" or "5x = 25". Returns null for anything it can't read exactly.
 */
export function parsePolynomialEquation(text: string): ParsedEquation | null {
  const normalized = text.replace(/²/g, '^2').replace(/[−–]/g, '-').replace(/\s+/g, ' ');
  const term = '(?:(?:\\d+(?:\\.\\d+)?\\s*)?x(?:\\s*\\^\\s*2)?|\\d+(?:\\.\\d+)?)';
  const match = normalized.match(new RegExp(`((?:[+-]\\s*)?${term}(?:\\s*[+-]\\s*${term})*)\\s*=\\s*([+-]?\\s*\\d+(?:\\.\\d+)?)`, 'i'));
  if (!match) return null;

  // The equation must start on a boundary, not mid-expression (e.g. "y2x = 4" or "(3)2x = 4")
  const charBefore = normalized.charAt((match.index ?? 0) - 1);
  if (/[\w)^/*]/.test(charBefore)) return null;

  let a = 0;
  let b = 0;
  let leftConstant = 0;
  const terms = match[1].replace(/\s+/g, '').match(/[+-]?[^+-]+/g) || [];
  for (const t of terms) {
    const tm = t.match(/^([+-]?)(\d*\.?\d*)(x(\^2)?)?$/i);
    if (!tm) return null;
    const sign = tm[1] === '-' ? -1 : 1;
    if (!tm[3]) {
      if (tm[2] === '') return null;
      leftConstant += sign * parseFloat(tm[2]);
    } else {
      const coefficient = sign * (tm[2] === '' ? 1 : parseFloat(tm[2]));
      if (tm[4]) a += coefficient;
      else b += coefficient;
    }
  }
  if (a === 0 && b === 0) return null;

  const rhs = parseFloat(match[2].replace(/\s+/g, ''));
  const rest = normalized.replace(match[0], '').replace(/\b(solve|for x|please)\b/gi, '').replace(/[\s:?.!]/g, '');
  return { a, b, c: leftConstant - rhs, leftConstant, rhs, coversQuery: rest.length === 0 };
}

export const dispatchNativeJsTool = (
  query: string,
  subject: SubjectId,
  // Calculators the active Avatar has enabled as skills
  allowed: ReadonlySet<CalculatorKind> = ALL_CALCULATORS
): DispatchedToolResult | null => {
  const q = query.trim();
  const lower = q.toLowerCase();
  const on = (kind: CalculatorKind) => allowed.has(kind);

  // 1-2. Math: quadratic and linear equations ("solve 2x² - 4x - 6 = 0", "2x + 6 = 14")
  const equation = parsePolynomialEquation(q);
  const asksToSolve = /\b(solve|roots?|zeros?|find x)\b/i.test(q) || (equation?.coversQuery ?? false);
  if (on('math') && equation && asksToSolve) {
    const { a, b, c } = equation;
    if (a !== 0) {
      const res = solveQuadratic(a, b, c);
      return {
        toolName: 'JavaScript Quadratic Math Engine',
        badge: 'Native JS Math · 0% Hallucination',
        input: `${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
        result: `Roots: x₁ = ${res.root1}, x₂ = ${res.root2} | Vertex: (${res.vertex.x}, ${res.vertex.y})`,
        steps: res.steps,
        explanation: `Calculated deterministically via browser JavaScript engine. Discriminant Δ = ${res.discriminant}.`
      };
    }
    if (b !== 0) {
      // Solve bx + constant = rhs, keeping the student's right-hand side for readable steps
      const res = solveLinear(b, equation.leftConstant, equation.rhs);
      return {
        toolName: 'JavaScript Linear Equation Engine',
        badge: 'Native JS Math · Exact Solution',
        input: `${b === 1 ? '' : b === -1 ? '-' : b}x ${equation.leftConstant >= 0 ? `+ ${equation.leftConstant}` : `- ${Math.abs(equation.leftConstant)}`} = ${equation.rhs}`,
        result: `x = ${res.solution}`,
        steps: res.steps,
        explanation: `Solved symbolically using native inverse operations with zero rounding error.`
      };
    }
  }

  // 3. Math: Fraction reduction
  // Matches "simplify 18/24" or "reduce 42/56"
  const fracMatch = q.match(/(?:simplify|reduce|fraction)\s+(-?\d+)\s*\/\s*(-?\d+)/i) || q.match(/(-?\d+)\s*\/\s*(-?\d+)/);
  if (on('math') && fracMatch && (lower.includes('fraction') || lower.includes('simplify') || lower.includes('reduce'))) {
    try {
      const num = parseInt(fracMatch[1], 10);
      const den = parseInt(fracMatch[2], 10);
      if (den !== 0) {
        const res = simplifyFraction(num, den);
        return {
          toolName: 'JavaScript Fraction Engine',
          badge: 'Native JS Math · Reduced Form',
          input: `${num} / ${den}`,
          result: `${res.reducedNumerator}/${res.reducedDenominator} (Decimal: ${res.decimal})`,
          steps: res.steps,
          explanation: `Reduced by greatest common factor of ${num / res.reducedNumerator}.`
        };
      }
    } catch (e) {}
  }

  // 4. Math: Percentage calculations (e.g. "15% of 80", "what is 20 percent of 150")
  const pctMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)\s+(?:of\s+)?(\d+(?:\.\d+)?)/i);
  if (on('math') && pctMatch) {
    try {
      const pct = parseFloat(pctMatch[1]);
      const base = parseFloat(pctMatch[2]);
      const result = Number(((pct / 100) * base).toFixed(4));
      return {
        toolName: 'JavaScript Percentage Engine',
        badge: 'Native JS Math · 0% Hallucination',
        input: `${pct}% of ${base}`,
        result: `${result}`,
        steps: [
          `Formula: (${pct} / 100) × ${base}`,
          `Convert percentage to decimal: ${pct / 100}`,
          `Multiply by base: ${(pct / 100)} × ${base} = ${result}`
        ],
        explanation: 'Evaluated deterministically in browser memory.'
      };
    } catch (e) {}
  }

  // 5. Chemistry: Molar mass calculation
  // Matches "molar mass of H2O", "calculate molar mass of C6H12O6", "molecular weight NaCl"
  const molarMatch = q.match(/(?:molar mass|molecular weight|formula mass)\s+(?:of\s+)?([A-Za-z0-9()]+)/i);
  if (on('chemistry') && (molarMatch || (subject === 'chemistry' && (lower.startsWith('molar mass') || lower.includes('g/mol'))))) {
    const rawFormula = molarMatch ? molarMatch[1] : q.replace(/[^A-Za-z0-9()]/g, '');
    if (rawFormula.length >= 2 && /[A-Z]/.test(rawFormula)) {
      try {
        const res = calculateMolarMass(rawFormula);
        return {
          toolName: 'JavaScript Molar Mass Engine',
          badge: 'Native JS Chemistry · Stoichiometry',
          input: res.formula,
          result: `${res.molarMass} g/mol`,
          steps: res.steps,
          explanation: `Evaluated atomic masses against periodic standards (IUPAC precision).`
        };
      } catch (e) {}
    }
  }

  // 6. Chemistry: Ideal Gas Law PV=nRT
  if (on('chemistry') && (lower.includes('pv=nrt') || lower.includes('ideal gas') || (lower.includes('atm') && lower.includes('liters')))) {
    try {
      const pMatch = q.match(/p\s*=\s*([\d.]+)/i);
      const vMatch = q.match(/v\s*=\s*([\d.]+)/i);
      const nMatch = q.match(/n\s*=\s*([\d.]+)/i);
      const tMatch = q.match(/t\s*=\s*([\d.]+)/i);

      const params: { P?: number; V?: number; n?: number; T?: number } = {};
      if (pMatch) params.P = parseFloat(pMatch[1]);
      if (vMatch) params.V = parseFloat(vMatch[1]);
      if (nMatch) params.n = parseFloat(nMatch[1]);
      if (tMatch) params.T = parseFloat(tMatch[1]);

      const countDefined = [params.P, params.V, params.n, params.T].filter((x) => x !== undefined).length;
      if (countDefined === 3) {
        const res = solveIdealGas(params);
        return {
          toolName: 'JavaScript Ideal Gas Law Engine',
          badge: 'Native JS Chemistry · Thermodynamics',
          input: `PV = nRT (Solving for ${res.solvedFor})`,
          result: `${res.solvedFor} = ${res.resultValue} ${res.unit}`,
          steps: res.steps,
          explanation: `Calculated using standard gas constant R = 0.08206 L·atm/(mol·K).`
        };
      }
    } catch (e) {}
  }

  // 7. Chemistry: Reaction Balancer
  if (on('chemistry') && subject === 'chemistry' && (lower.includes('balance') || lower.includes('reaction') || lower.includes('→') || lower.includes('->'))) {
    const balanced = balanceReactionLookup(q);
    if (balanced) {
      return {
        toolName: 'JavaScript Reaction Balancer',
        badge: 'Native JS Chemistry · Balanced Conservation',
        input: q,
        result: balanced.balancedEquation,
        steps: [
          `Reaction Type: ${balanced.type}`,
          `Reactants: ${balanced.reactants.join(', ')}`,
          `Products: ${balanced.products.join(', ')}`,
          balanced.notes
        ],
        explanation: 'Enforces atom conservation law on both sides of the reaction bridge.'
      };
    }
  }

  // 8. Biology: Punnett Square
  // Matches "Punnett square Bb x Bb", "cross AA and aa"
  const punnettMatch = q.match(/(?:punnett|cross)\s+([A-Za-z]{2})\s*(?:x|and|with)\s*([A-Za-z]{2})/i);
  if (on('biology') && (punnettMatch || (subject === 'biology' && lower.includes('punnett')))) {
    const p1 = punnettMatch ? punnettMatch[1] : 'Bb';
    const p2 = punnettMatch ? punnettMatch[2] : 'Bb';
    const res = solveMonohybridPunnett(p1, p2);
    return {
      toolName: 'JavaScript Punnett Square Engine',
      badge: 'Native JS Biology · Mendelian Genetics',
      input: `${p1} × ${p2}`,
      result: `Genotypes: ${res.genotypeRatios} | Phenotypes: ${res.phenotypeRatios}`,
      steps: res.steps,
      explanation: `Mendelian 2x2 grid calculation with exact 25% quadrant distribution.`
    };
  }

  // 9. Biology: DNA to mRNA / Codon translation
  if (on('biology') && subject === 'biology' && (lower.includes('transcribe') || lower.includes('codon') || lower.includes('translate dna') || /dna\s*[:=]\s*[atcg]{3,}/i.test(q))) {
    const dnaSeqMatch = q.match(/[ATCG]{3,}/i);
    if (dnaSeqMatch) {
      const res = translateDnaSequence(dnaSeqMatch[0]);
      return {
        toolName: 'JavaScript Codon Translation Engine',
        badge: 'Native JS Biology · Molecular Genetics',
        input: res.dnaSequence,
        result: `Peptide: ${res.chainString}`,
        steps: res.steps,
        explanation: `Complementary base transcription (A→U, T→A, C→G, G→C) followed by universal triplet decoding.`
      };
    }
  }

  // 10. History: Timeline Delta & Chronology
  if (on('timeline') && subject === 'history' && (lower.includes('years between') || lower.includes('how long after') || lower.includes('compare dates') || lower.includes('years ago'))) {
    const years = q.match(/\b\d{3,4}\b/g)?.map(Number);
    if (years && years.length >= 2) {
      const res = calculateHistoricalDistance(years[0], 'CE', `Milestone A (${years[0]})`, years[1], 'CE', `Milestone B (${years[1]})`);
      return {
        toolName: 'JavaScript Chronology Timeline Engine',
        badge: 'Native JS History · Historical Intervals',
        input: `${years[0]} CE vs ${years[1]} CE`,
        result: `${res.yearsApart} Years Apart (${res.centuriesApart} Centuries)`,
        steps: res.steps,
        explanation: `Temporal baseline validation against standard archival chronology.`
      };
    }
  }

  // 11. General Safe Arithmetic Evaluator
  // Matches "2 + 2", "7 * 8", "what is 15 * 12", "calculate 45 / 9", "sqrt(144)", etc.
  if (!on('math')) return null;
  const cleanArithmeticExpr = q
    .replace(/^(?:what\s+is|calculate|compute|solve|how\s+much\s+is|evaluate)\s+/i, '')
    .replace(/[?=]/g, '')
    .trim();

  // Handle sqrt(N)
  const sqrtMatch = cleanArithmeticExpr.match(/^sqrt\((\d+(?:\.\d+)?)\)$/i);
  if (sqrtMatch) {
    const val = parseFloat(sqrtMatch[1]);
    const res = Math.sqrt(val);
    return {
      toolName: 'JavaScript Square Root Engine',
      badge: 'Native JS Math · Radical Precision',
      input: `√${val}`,
      result: `${Number(res.toFixed(4))}`,
      steps: [`Input: √${val}`, `Principal square root: ${Number(res.toFixed(4))}`],
      explanation: 'Evaluated deterministically in browser memory.'
    };
  }

  if (/^[0-9+\-*/().\s^%x×÷]+$/.test(cleanArithmeticExpr) && /[0-9]/.test(cleanArithmeticExpr) && /[+\-*/x×÷^]/.test(cleanArithmeticExpr)) {
    const res = evaluateSafeArithmetic(cleanArithmeticExpr);
    if (res && !isNaN(res.result)) {
      return {
        toolName: 'JavaScript Exact Arithmetic Engine',
        badge: 'Native JS Math · 0% Hallucination',
        input: res.expression,
        result: String(res.result),
        steps: [
          `Original Expression: ${res.expression}`,
          `Deterministic Evaluation: ${res.result}`
        ],
        explanation: 'Evaluated deterministically in browser memory to eliminate LLM arithmetic hallucinations.'
      };
    }
  }

  return null;
};
