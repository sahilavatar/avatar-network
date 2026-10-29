// Deterministic Client-Side Native JavaScript Math Engine
// Eliminates Gemma 3 1B arithmetic hallucinations with exact symbolic & numeric computation

export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  hasRealRoots: boolean;
  root1: string;
  root2: string;
  vertex: { x: number; y: number };
  steps: string[];
}

export interface LinearResult {
  a: number;
  b: number;
  c: number;
  solution: number;
  steps: string[];
}

export interface FractionResult {
  numerator: number;
  denominator: number;
  reducedNumerator: number;
  reducedDenominator: number;
  decimal: number;
  mixedNumber?: string;
  steps: string[];
}

export interface GradeResult {
  correct: number;
  total: number;
  percentage: number;
  letterGrade: string;
  masteryTier: string;
  gpaEquivalent: number;
}

export const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

export const solveQuadratic = (a: number, b: number, c: number): QuadraticResult => {
  if (a === 0) {
    throw new Error('Coefficient "a" cannot be 0 in a quadratic equation.');
  }

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);

  const steps: string[] = [
    `Standard Form: ${a === 1 ? '' : a === -1 ? '-' : a}x² ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0`,
    `Identify coefficients: a = ${a}, b = ${b}, c = ${c}`,
    `Compute Discriminant (Δ = b² - 4ac): (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}`
  ];

  let root1 = '';
  let root2 = '';
  const hasRealRoots = discriminant >= 0;

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-b + sqrtD) / (2 * a);
    const r2 = (-b - sqrtD) / (2 * a);
    root1 = Number.isInteger(r1) ? String(r1) : r1.toFixed(4);
    root2 = Number.isInteger(r2) ? String(r2) : r2.toFixed(4);
    steps.push(`Δ > 0: Two distinct real roots exist.`);
    steps.push(`x₁ = (-(${b}) + √${discriminant}) / (2·${a}) = (${-b} + ${Number.isInteger(sqrtD) ? sqrtD : sqrtD.toFixed(3)}) / ${2 * a} = ${root1}`);
    steps.push(`x₂ = (-(${b}) - √${discriminant}) / (2·${a}) = (${-b} - ${Number.isInteger(sqrtD) ? sqrtD : sqrtD.toFixed(3)}) / ${2 * a} = ${root2}`);
  } else if (discriminant === 0) {
    const r = -b / (2 * a);
    root1 = Number.isInteger(r) ? String(r) : r.toFixed(4);
    root2 = root1;
    steps.push(`Δ = 0: Exactly one repeated real root.`);
    steps.push(`x = -b / 2a = -(${b}) / (2·${a}) = ${root1}`);
  } else {
    const realPart = (-b / (2 * a));
    const imagPart = (Math.sqrt(-discriminant) / (2 * a));
    const realStr = Number.isInteger(realPart) ? String(realPart) : realPart.toFixed(3);
    const imagStr = Number.isInteger(Math.abs(imagPart)) ? String(Math.abs(imagPart)) : Math.abs(imagPart).toFixed(3);
    root1 = `${realStr} + ${imagStr}i`;
    root2 = `${realStr} - ${imagStr}i`;
    steps.push(`Δ < 0: No real roots. Two complex conjugate roots.`);
    steps.push(`x = (-b ± i√|Δ|) / 2a = ${root1} and ${root2}`);
  }

  steps.push(`Parabola Vertex (h, k): (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`);

  return {
    a,
    b,
    c,
    discriminant,
    hasRealRoots,
    root1,
    root2,
    vertex: { x: Number(vertexX.toFixed(3)), y: Number(vertexY.toFixed(3)) },
    steps
  };
};

export const solveLinear = (a: number, b: number, c: number): LinearResult => {
  if (a === 0) {
    throw new Error('Coefficient "a" cannot be 0.');
  }
  const solution = (c - b) / a;
  return {
    a,
    b,
    c,
    solution: Number(solution.toFixed(4)),
    steps: [
      `Equation: ${a}x + (${b}) = ${c}`,
      `Subtract ${b} from both sides: ${a}x = ${c - b}`,
      `Divide both sides by ${a}: x = ${solution.toFixed(4)}`
    ]
  };
};

export const simplifyFraction = (num: number, den: number): FractionResult => {
  if (den === 0) throw new Error('Denominator cannot be 0');
  const divisor = gcd(num, den);
  const reducedNum = num / divisor;
  const reducedDen = den / divisor;
  const decimal = num / den;

  const steps = [
    `Original Fraction: ${num}/${den}`,
    `Greatest Common Divisor (GCD): ${divisor}`,
    `Reduced Fraction: ${reducedNum}/${reducedDen}`,
    `Decimal Equivalent: ${decimal.toFixed(4)}`
  ];

  let mixedNumber: string | undefined;
  if (Math.abs(reducedNum) >= reducedDen && reducedDen !== 1) {
    const whole = Math.floor(reducedNum / reducedDen);
    const remainder = reducedNum % reducedDen;
    if (remainder !== 0) {
      mixedNumber = `${whole} ${remainder}/${reducedDen}`;
      steps.push(`Mixed Number: ${mixedNumber}`);
    }
  }

  return {
    numerator: num,
    denominator: den,
    reducedNumerator: reducedNum,
    reducedDenominator: reducedDen,
    decimal,
    mixedNumber,
    steps
  };
};

export const calculateGradePrecision = (correct: number, total: number): GradeResult => {
  if (total <= 0) return { correct: 0, total: 0, percentage: 0, letterGrade: 'N/A', masteryTier: 'Unscored', gpaEquivalent: 0 };
  const percentage = Math.round((correct / total) * 10000) / 100; // 2 decimal precision

  let letter = 'F';
  let gpa = 0.0;
  let mastery = 'Struggling';

  if (percentage >= 93) { letter = 'A'; gpa = 4.0; mastery = 'Mastered'; }
  else if (percentage >= 90) { letter = 'A-'; gpa = 3.7; mastery = 'Mastered'; }
  else if (percentage >= 87) { letter = 'B+'; gpa = 3.3; mastery = 'Proficient'; }
  else if (percentage >= 83) { letter = 'B'; gpa = 3.0; mastery = 'Proficient'; }
  else if (percentage >= 80) { letter = 'B-'; gpa = 2.7; mastery = 'Review Needed'; }
  else if (percentage >= 75) { letter = 'C+'; gpa = 2.3; mastery = 'Review Needed'; }
  else if (percentage >= 70) { letter = 'C'; gpa = 2.0; mastery = 'Needs Attention'; }
  else { letter = 'F'; gpa = 0.0; mastery = 'Critical Intervention'; }

  return {
    correct,
    total,
    percentage,
    letterGrade: letter,
    masteryTier: mastery,
    gpaEquivalent: gpa
  };
};

// Safe arithmetic expression parser
export const evaluateSafeArithmetic = (expr: string): { result: number; expression: string } | null => {
  try {
    const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    // Only allow digits, basic operators, parens, decimal points, and spaces
    if (!/^[0-9+\-*/().\s^%]+$/.test(sanitized)) {
      return null;
    }
    // Handle power symbol
    const jsExpr = sanitized.replace(/\^/g, '**');
    // Safe evaluation via Function with restricted context
    const fn = new Function(`"use strict"; return (${jsExpr})`);
    const val = fn();
    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      return { result: Number(val.toFixed(4)), expression: expr };
    }
    return null;
  } catch (e) {
    return null;
  }
};
