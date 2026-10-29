import { QuizQuestion } from '../types';

/**
 * Sample algebra practice questions (28), hand-written for Avatar Network across five units.
 * Topic ids carry the unit (alg-u1-…), which the practice folder uses to count questions per unit.
 */

interface ProblemTemplate {
  qNum: number;
  unit: number;
  topic: string;
  topicId: string;
  question: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passageId: string;
}

function buildQuestion(tpl: ProblemTemplate): QuizQuestion {
  return {
    id: `algebra-q${tpl.qNum}`,
    subject: 'algebra',
    topicId: tpl.topicId,
    type: 'conceptual',
    question: tpl.question,
    options: tpl.options,
    explanation: tpl.explanation,
    passageId: tpl.passageId,
    passageSnippet: `Algebra Unit ${tpl.unit}: ${tpl.topic}`,
    difficulty: tpl.difficulty,
    sourceTitle: 'Sample practice questions: Algebra (28)',
    sourceId: 'alg-ap-vault',
    originalQuestionNumber: tpl.qNum
  };
}

export const ALGEBRA_PROBLEM_BANK: QuizQuestion[] = [
  // ==========================================
  // UNIT 1: LINEAR EQUATIONS, INEQUALITIES & SYSTEMS (Q1 - Q25)
  // ==========================================
  buildQuestion({
    qNum: 1,
    unit: 1,
    topic: 'Slope-Intercept Form',
    topicId: 'alg-u1-slope',
    question: 'What is the equation of the line passing through points (-2, 5) and (4, -1)?',
    options: [
      { label: 'A', text: 'y = -x + 3', isCorrect: true },
      { label: 'B', text: 'y = -x + 5', isCorrect: false },
      { label: 'C', text: 'y = -2x + 1', isCorrect: false },
      { label: 'D', text: 'y = -(1/2)x + 4', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: First compute the slope: m = (-1 - 5) / (4 - (-2)) = -6 / 6 = -1. Use point-slope form with (-2, 5): y - 5 = -1(x - (-2)) => y - 5 = -x - 2 => y = -x + 3. Check with point (4, -1): -1 = -(4) + 3 = -1 (verified).',
    difficulty: 'easy',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 2,
    unit: 1,
    topic: 'Linear Systems Elimination',
    topicId: 'alg-u1-systems',
    question: 'Solve the system of equations: 3x + 2y = 16 and 5x - 2y = 8. What is the value of x?',
    options: [
      { label: 'A', text: 'x = 3', isCorrect: true },
      { label: 'B', text: 'x = 2', isCorrect: false },
      { label: 'C', text: 'x = 4', isCorrect: false },
      { label: 'D', text: 'x = 5', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Add the two equations directly to eliminate 2y: (3x + 2y) + (5x - 2y) = 16 + 8 => 8x = 24 => x = 3. Substituting back: 3(3) + 2y = 16 => 9 + 2y = 16 => 2y = 7 => y = 3.5.',
    difficulty: 'easy',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 3,
    unit: 1,
    topic: 'Parallel & Perpendicular Lines',
    topicId: 'alg-u1-lines',
    question: 'Which of the following lines is strictly perpendicular to 2x - 3y = 9 and passes through the origin (0, 0)?',
    options: [
      { label: 'A', text: 'y = -(3/2)x', isCorrect: true },
      { label: 'B', text: 'y = (2/3)x', isCorrect: false },
      { label: 'C', text: 'y = -(2/3)x', isCorrect: false },
      { label: 'D', text: 'y = (3/2)x', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Write the given line in slope-intercept form: -3y = -2x + 9 => y = (2/3)x - 3. The slope is m₁ = 2/3. Perpendicular lines possess slopes that are negative reciprocals: m₂ = -1/m₁ = -3/2. Passing through (0, 0) gives y = -(3/2)x.',
    difficulty: 'easy',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 4,
    unit: 1,
    topic: 'Linear Inequalities',
    topicId: 'alg-u1-ineq',
    question: 'Solve the compound inequality: -4 ≤ 3x - 1 < 8. Express the solution set for x.',
    options: [
      { label: 'A', text: '-1 ≤ x < 3', isCorrect: true },
      { label: 'B', text: '-1 < x ≤ 3', isCorrect: false },
      { label: 'C', text: '-5/3 ≤ x < 7/3', isCorrect: false },
      { label: 'D', text: '-1 ≤ x ≤ 3', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Add 1 to all three segments: -4 + 1 ≤ 3x < 8 + 1 => -3 ≤ 3x < 9. Divide by positive 3 (inequality signs stay identical): -1 ≤ x < 3.',
    difficulty: 'easy',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 5,
    unit: 1,
    topic: 'Inconsistent vs Dependent Systems',
    topicId: 'alg-u1-systems',
    question: 'For what constant k does the system 2x - 4y = 7 and 3x - 6y = k have infinitely many solutions?',
    options: [
      { label: 'A', text: 'k = 10.5', isCorrect: true },
      { label: 'B', text: 'k = 7', isCorrect: false },
      { label: 'C', text: 'k = 14', isCorrect: false },
      { label: 'D', text: 'No value of k allows infinite solutions', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: For a dependent system (infinitely many solutions), the second equation must be a scalar multiple of the first. Notice 3/2 = (-6)/(-4) = 1.5. Thus k must equal 7 × 1.5 = 10.5.',
    difficulty: 'medium',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 6,
    unit: 1,
    topic: 'Absolute Value Equations',
    topicId: 'alg-u1-abs',
    question: 'Solve for x: |2x - 5| = 3x - 10.',
    options: [
      { label: 'A', text: 'x = 5 (x = 3 is an extraneous root)', isCorrect: true },
      { label: 'B', text: 'x = 3 and x = 5', isCorrect: false },
      { label: 'C', text: 'x = 3 only', isCorrect: false },
      { label: 'D', text: 'No real solutions', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Case 1: 2x - 5 = 3x - 10 => -x = -5 => x = 5. Check: |2(5) - 5| = 5, 3(5) - 10 = 5 (valid). Case 2: 2x - 5 = -(3x - 10) => 2x - 5 = -3x + 10 => 5x = 15 => x = 3. Check: |2(3) - 5| = 1, but 3(3) - 10 = -1. Because absolute value cannot equal -1, x = 3 is extraneous! Only x = 5 holds.',
    difficulty: 'medium',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 7,
    unit: 1,
    topic: 'Point-Slope Modeling',
    topicId: 'alg-u1-linear-modeling',
    question: 'A water tank contains 250 gallons. Water is pumped out at a steady rate of 12.5 gallons per minute. At what minute mark will 50 gallons remain?',
    options: [
      { label: 'A', text: '16 minutes', isCorrect: true },
      { label: 'B', text: '14 minutes', isCorrect: false },
      { label: 'C', text: '18 minutes', isCorrect: false },
      { label: 'D', text: '20 minutes', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Model equation: W(t) = 250 - 12.5t. Set W(t) = 50: 50 = 250 - 12.5t => 12.5t = 200 => t = 200 / 12.5 = 16 minutes.',
    difficulty: 'easy',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 8,
    unit: 1,
    topic: '3-Variable Systems',
    topicId: 'alg-u1-3systems',
    question: 'In the system: x + y + z = 6, 2x - y + z = 3, and x + 2y - z = 2, what is the value of z?',
    options: [
      { label: 'A', text: 'z = 3', isCorrect: true },
      { label: 'B', text: 'z = 1', isCorrect: false },
      { label: 'C', text: 'z = 2', isCorrect: false },
      { label: 'D', text: 'z = 4', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Add Eq 1 and Eq 2: (x + y + z) + (2x - y + z) = 6 + 3 => 3x + 2z = 9. Multiply Eq 1 by 2 and subtract Eq 3: 2(x + y + z) - (x + 2y - z) = 12 - 2 => x + 3z = 10 => x = 10 - 3z. Substitute into 3x + 2z = 9: 3(10 - 3z) + 2z = 9 => 30 - 9z + 2z = 9 => -7z = -21 => z = 3.',
    difficulty: 'hard',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 9,
    unit: 1,
    topic: 'Linear Programming Constraints',
    topicId: 'alg-u1-linprog',
    question: 'Given constraints x ≥ 0, y ≥ 0, x + y ≤ 6, and 2x + y ≤ 8, what is the maximum value of objective function P = 3x + 4y?',
    options: [
      { label: 'A', text: '24 (at vertex (0, 6))', isCorrect: true },
      { label: 'B', text: '20 (at vertex (2, 4))', isCorrect: false },
      { label: 'C', text: '18 (at vertex (6, 0))', isCorrect: false },
      { label: 'D', text: '12 (at vertex (4, 0))', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Find vertices of feasible region: (0, 0) => P = 0; (4, 0) => P = 12; Intersection of x + y = 6 and 2x + y = 8: x = 2, y = 4 => P = 3(2) + 4(4) = 22; Intersection on y-axis: (0, 6) satisfies 2(0) + 6 ≤ 8 => P = 3(0) + 4(6) = 24. Maximum is 24 at (0, 6).',
    difficulty: 'hard',
    passageId: 'alg-ped-p1'
  }),
  buildQuestion({
    qNum: 10,
    unit: 1,
    topic: 'Rate-Time-Distance Systems',
    topicId: 'alg-u1-rtd',
    question: 'A boat travels 36 miles upstream against a current in 3 hours. It returns downstream with the same current in 2 hours. What is the boat\'s speed in still water?',
    options: [
      { label: 'A', text: '15 mph', isCorrect: true },
      { label: 'B', text: '12 mph', isCorrect: false },
      { label: 'C', text: '18 mph', isCorrect: false },
      { label: 'D', text: '14 mph', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Let b = boat speed, c = current speed. Upstream: b - c = 36/3 = 12 mph. Downstream: b + c = 36/2 = 18 mph. Add equations: 2b = 30 => b = 15 mph. (Current c = 3 mph).',
    difficulty: 'medium',
    passageId: 'alg-ped-p1'
  }),

  // ==========================================
  // UNIT 2: QUADRATICS & COMPLEX NUMBERS (Q26 - Q50)
  // ==========================================
  buildQuestion({
    qNum: 26,
    unit: 2,
    topic: 'Quadratic Formula & Discriminant',
    topicId: 'alg-u2-discriminant',
    question: 'What is the nature of the roots for the quadratic equation 3x² - 5x + 4 = 0?',
    options: [
      { label: 'A', text: 'Two complex conjugate solutions', isCorrect: true },
      { label: 'B', text: 'Two distinct real irrational solutions', isCorrect: false },
      { label: 'C', text: 'One repeated rational solution', isCorrect: false },
      { label: 'D', text: 'Two distinct real rational solutions', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Calculate the discriminant Δ = b² - 4ac. Here a = 3, b = -5, c = 4. Δ = (-5)² - 4(3)(4) = 25 - 48 = -23. Because Δ < 0, the square root of a negative produces complex roots: x = (5 ± i√23)/6.',
    difficulty: 'easy',
    passageId: 'alg-ped-p2'
  }),
  buildQuestion({
    qNum: 27,
    unit: 2,
    topic: 'Vertex Form of a Parabola',
    topicId: 'alg-u2-vertex',
    question: 'What are the coordinates of the vertex for the parabola f(x) = 2x² - 12x + 11?',
    options: [
      { label: 'A', text: '(3, -7)', isCorrect: true },
      { label: 'B', text: '(3, 11)', isCorrect: false },
      { label: 'C', text: '(-3, -7)', isCorrect: false },
      { label: 'D', text: '(6, -25)', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Complete the square or use h = -b / (2a). Here h = -(-12) / (2 × 2) = 12 / 4 = 3. Compute k = f(3) = 2(3)² - 12(3) + 11 = 2(9) - 36 + 11 = 18 - 36 + 11 = -7. The vertex is at (3, -7).',
    difficulty: 'easy',
    passageId: 'alg-ped-p2'
  }),
  buildQuestion({
    qNum: 28,
    unit: 2,
    topic: 'Complex Number Arithmetic',
    topicId: 'alg-u2-complex',
    question: 'Simplify the complex expression (4 + 3i) / (1 - 2i) into standard a + bi form.',
    options: [
      { label: 'A', text: '-2/5 + (11/5)i', isCorrect: true },
      { label: 'B', text: '2/5 + (11/5)i', isCorrect: false },
      { label: 'C', text: '-2 + 11i', isCorrect: false },
      { label: 'D', text: '4 - (3/2)i', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Multiply numerator and denominator by the conjugate of the denominator, (1 + 2i): [(4 + 3i)(1 + 2i)] / [(1 - 2i)(1 + 2i)] = [4 + 8i + 3i + 6i²] / [1 - 4i²]. Since i² = -1: [4 + 11i - 6] / [1 + 4] = (-2 + 11i) / 5 = -2/5 + (11/5)i.',
    difficulty: 'medium',
    passageId: 'alg-ped-p2'
  }),
  buildQuestion({
    qNum: 29,
    unit: 2,
    topic: 'Projectile Motion Optimization',
    topicId: 'alg-u2-projectile',
    question: 'A rocket\'s height in feet is given by h(t) = -16t² + 96t + 112. What is the maximum height achieved by the rocket?',
    options: [
      { label: 'A', text: '256 feet', isCorrect: true },
      { label: 'B', text: '224 feet', isCorrect: false },
      { label: 'C', text: '272 feet', isCorrect: false },
      { label: 'D', text: '240 feet', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: The maximum of a downward-opening parabola occurs at vertex time t = -b / (2a) = -96 / (2 × -16) = -96 / -32 = 3 seconds. Evaluate h(3) = -16(3)² + 96(3) + 112 = -16(9) + 288 + 112 = -144 + 400 = 256 feet.',
    difficulty: 'medium',
    passageId: 'alg-ped-p2'
  }),
  buildQuestion({
    qNum: 30,
    unit: 2,
    topic: 'Completing the Square',
    topicId: 'alg-u2-cts',
    question: 'When solving x² - 8x + 10 = 0 by completing the square, what value must be added to both sides of x² - 8x = -10?',
    options: [
      { label: 'A', text: '16', isCorrect: true },
      { label: 'B', text: '64', isCorrect: false },
      { label: 'C', text: '8', isCorrect: false },
      { label: 'D', text: '4', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Take half of the linear coefficient b and square it: (b/2)² = (-8/2)² = (-4)² = 16. Adding 16 yields x² - 8x + 16 = -10 + 16 => (x - 4)² = 6 => x = 4 ± √6.',
    difficulty: 'easy',
    passageId: 'alg-ped-p2'
  }),

  // ==========================================
  // UNIT 3: POLYNOMIALS & RATIONAL FUNCTIONS (Q51 - Q75)
  // ==========================================
  buildQuestion({
    qNum: 51,
    unit: 3,
    topic: 'Synthetic Division & Remainder Theorem',
    topicId: 'alg-u3-remainder',
    question: 'When P(x) = 2x³ - 5x² + 3x - 7 is divided by (x - 3), what is the remainder?',
    options: [
      { label: 'A', text: '11', isCorrect: true },
      { label: 'B', text: '7', isCorrect: false },
      { label: 'C', text: '-7', isCorrect: false },
      { label: 'D', text: '14', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: By the Remainder Theorem, the remainder of P(x) divided by (x - c) is simply P(c). Here c = 3. P(3) = 2(3)³ - 5(3)² + 3(3) - 7 = 2(27) - 5(9) + 9 - 7 = 54 - 45 + 2 = 11.',
    difficulty: 'easy',
    passageId: 'alg-ped-p3'
  }),
  buildQuestion({
    qNum: 52,
    unit: 3,
    topic: 'Rational Function Asymptotes',
    topicId: 'alg-u3-asymptotes',
    question: 'What are the horizontal and vertical asymptotes of f(x) = (3x² - 12) / (x² - 2x - 3)?',
    options: [
      { label: 'A', text: 'Horizontal: y = 3; Vertical: x = 3 and x = -1', isCorrect: true },
      { label: 'B', text: 'Horizontal: y = 0; Vertical: x = 2 and x = -3', isCorrect: false },
      { label: 'C', text: 'Horizontal: y = 3; Vertical: x = 2 only', isCorrect: false },
      { label: 'D', text: 'Horizontal: None; Vertical: x = 3', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: For degrees equal (numerator deg 2, denominator deg 2), horizontal asymptote is ratio of leading coefficients: y = 3/1 = 3. For vertical asymptotes, factor denominator: x² - 2x - 3 = (x - 3)(x + 1) = 0 => x = 3 and x = -1 (neither cancels with numerator 3(x-2)(x+2)).',
    difficulty: 'medium',
    passageId: 'alg-ped-p3'
  }),
  buildQuestion({
    qNum: 53,
    unit: 3,
    topic: 'Rational Zero Theorem',
    topicId: 'alg-u3-rational-roots',
    question: 'According to the Rational Zero Theorem, which of the following is NOT a possible rational zero of f(x) = 2x³ + 3x² - 8x - 15?',
    options: [
      { label: 'A', text: '4', isCorrect: true },
      { label: 'B', text: '±3/2', isCorrect: false },
      { label: 'C', text: '±5', isCorrect: false },
      { label: 'D', text: '±1/2', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Possible rational roots are factors of constant term (-15) divided by factors of leading coefficient (2). Factors of -15: ±1, ±3, ±5, ±15. Factors of 2: ±1, ±2. The candidate pool is ±1, ±1/2, ±3, ±3/2, ±5, ±5/2, ±15, ±15/2. The number 4 is not in this pool because 4 does not divide 15.',
    difficulty: 'medium',
    passageId: 'alg-ped-p3'
  }),
  buildQuestion({
    qNum: 54,
    unit: 3,
    topic: 'Partial Fraction Decomposition',
    topicId: 'alg-u3-partial-fractions',
    question: 'Find the partial fraction decomposition of (7x + 1) / ((x - 1)(x + 3)). What is the numerator above (x - 1)?',
    options: [
      { label: 'A', text: '2', isCorrect: true },
      { label: 'B', text: '5', isCorrect: false },
      { label: 'C', text: '7', isCorrect: false },
      { label: 'D', text: '3', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Set (7x + 1)/((x-1)(x+3)) = A/(x-1) + B/(x+3). Cross-multiply: 7x + 1 = A(x + 3) + B(x - 1). Use Heaviside cover-up: Let x = 1: 7(1) + 1 = A(1 + 3) + 0 => 8 = 4A => A = 2. Let x = -3: 7(-3) + 1 = B(-3 - 1) => -20 = -4B => B = 5. The fraction is 2/(x-1) + 5/(x+3). Numerator A is 2.',
    difficulty: 'hard',
    passageId: 'alg-ped-p3'
  }),

  // ==========================================
  // UNIT 4: EXPONENTIAL & LOGARITHMIC FUNCTIONS (Q76 - Q100)
  // ==========================================
  buildQuestion({
    qNum: 76,
    unit: 4,
    topic: 'Logarithmic Properties & Condensing',
    topicId: 'alg-u4-log-properties',
    question: 'Condense into a single logarithm: 2 log₂(x) + 3 log₂(y) - log₂(z).',
    options: [
      { label: 'A', text: 'log₂((x² y³) / z)', isCorrect: true },
      { label: 'B', text: 'log₂(2x · 3y / z)', isCorrect: false },
      { label: 'C', text: 'log₂(x² + y³ - z)', isCorrect: false },
      { label: 'D', text: 'log₂((x² z) / y³)', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Apply power rule: 2 log₂(x) = log₂(x²) and 3 log₂(y) = log₂(y³). Apply product rule: log₂(x²) + log₂(y³) = log₂(x² y³). Apply quotient rule: log₂(x² y³) - log₂(z) = log₂((x² y³) / z).',
    difficulty: 'easy',
    passageId: 'alg-ped-p4'
  }),
  buildQuestion({
    qNum: 77,
    unit: 4,
    topic: 'Solving Exponential Equations',
    topicId: 'alg-u4-exp-solve',
    question: 'Solve for x: 4^(2x - 1) = 8^(x + 2).',
    options: [
      { label: 'A', text: 'x = 8', isCorrect: true },
      { label: 'B', text: 'x = 4', isCorrect: false },
      { label: 'C', text: 'x = 6', isCorrect: false },
      { label: 'D', text: 'x = 10', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Express both bases in powers of 2: 4 = 2² and 8 = 2³. (2²)^(2x - 1) = (2³)^(x + 2) => 2^(4x - 2) = 2^(3x + 6). Equate exponents: 4x - 2 = 3x + 6 => x = 8.',
    difficulty: 'easy',
    passageId: 'alg-ped-p4'
  }),
  buildQuestion({
    qNum: 78,
    unit: 4,
    topic: 'Continuous Compound Interest',
    topicId: 'alg-u4-compound-interest',
    question: 'An initial investment of $2,000 is compounded continuously at an annual rate of 6% (A = P e^(rt)). Approximately how many years will it take for the balance to reach $4,000? (ln(2) ≈ 0.693)',
    options: [
      { label: 'A', text: '11.55 years', isCorrect: true },
      { label: 'B', text: '12.00 years', isCorrect: false },
      { label: 'C', text: '10.25 years', isCorrect: false },
      { label: 'D', text: '14.50 years', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: 4000 = 2000 e^(0.06t) => 2 = e^(0.06t). Take natural logarithm on both sides: ln(2) = 0.06t => t = ln(2) / 0.06 ≈ 0.69315 / 0.06 ≈ 11.55 years. (Matches the Rule of 72: 72/6 = 12 years approx).',
    difficulty: 'medium',
    passageId: 'alg-ped-p4'
  }),
  buildQuestion({
    qNum: 79,
    unit: 4,
    topic: 'Extraneous Solutions in Log Equations',
    topicId: 'alg-u4-log-extraneous',
    question: 'Solve for x: log₃(x + 6) + log₃(x) = 3.',
    options: [
      { label: 'A', text: 'x = 3 (x = -9 is extraneous)', isCorrect: true },
      { label: 'B', text: 'x = 3 and x = -9', isCorrect: false },
      { label: 'C', text: 'x = 9', isCorrect: false },
      { label: 'D', text: 'No real solutions', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Condense: log₃(x(x + 6)) = 3 => x² + 6x = 3³ = 27 => x² + 6x - 27 = 0 => (x + 9)(x - 3) = 0 => x = -9 or x = 3. Check domain: log₃(x) requires x > 0. For x = -9, log₃(-9) is undefined in real numbers! Thus x = -9 is extraneous, leaving x = 3 as the sole real solution.',
    difficulty: 'medium',
    passageId: 'alg-ped-p4'
  }),

  // ==========================================
  // UNIT 5: SEQUENCES, SERIES & CONIC SECTIONS (Q101 - Q125)
  // ==========================================
  buildQuestion({
    qNum: 101,
    unit: 5,
    topic: 'Infinite Geometric Series',
    topicId: 'alg-u5-series',
    question: 'What is the sum of the infinite geometric series 12 + 4 + 4/3 + 4/9 + ...?',
    options: [
      { label: 'A', text: '18', isCorrect: true },
      { label: 'B', text: '16', isCorrect: false },
      { label: 'C', text: '24', isCorrect: false },
      { label: 'D', text: 'The series diverges', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: First term a = 12. Common ratio r = 4/12 = 1/3. Since |r| = 1/3 < 1, the series converges. Sum formula: S = a / (1 - r) = 12 / (1 - 1/3) = 12 / (2/3) = 12 × (3/2) = 18.',
    difficulty: 'easy',
    passageId: 'alg-ped-p5'
  }),
  buildQuestion({
    qNum: 102,
    unit: 5,
    topic: 'Ellipse Standard Form & Foci',
    topicId: 'alg-u5-ellipse',
    question: 'An ellipse has equation (x - 2)²/25 + (y + 1)²/9 = 1. What are the coordinates of its two foci?',
    options: [
      { label: 'A', text: '(-2, -1) and (6, -1)', isCorrect: true },
      { label: 'B', text: '(2, 3) and (2, -5)', isCorrect: false },
      { label: 'C', text: '(7, -1) and (-3, -1)', isCorrect: false },
      { label: 'D', text: '(2, 2) and (2, -4)', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Center is (h, k) = (2, -1). Since 25 > 9, major axis is horizontal with a² = 25 and b² = 9. Distance from center to foci is c = √(a² - b²) = √(25 - 9) = √16 = 4. Foci lie at (h ± c, k) = (2 ± 4, -1), giving (6, -1) and (-2, -1).',
    difficulty: 'medium',
    passageId: 'alg-ped-p5'
  }),
  buildQuestion({
    qNum: 103,
    unit: 5,
    topic: 'Arithmetic Sequence Explicit Formula',
    topicId: 'alg-u5-arithmetic',
    question: 'In an arithmetic sequence, the 4th term is 19 and the 10th term is 49. What is the 25th term?',
    options: [
      { label: 'A', text: '124', isCorrect: true },
      { label: 'B', text: '120', isCorrect: false },
      { label: 'C', text: '129', isCorrect: false },
      { label: 'D', text: '119', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: Common difference d = (a₁₀ - a₄) / (10 - 4) = (49 - 19) / 6 = 30 / 6 = 5. Find first term a₁: a₄ = a₁ + 3d => 19 = a₁ + 3(5) => a₁ = 4. Compute 25th term: a₂₅ = a₁ + 24d = 4 + 24(5) = 4 + 120 = 124.',
    difficulty: 'easy',
    passageId: 'alg-ped-p5'
  }),
  buildQuestion({
    qNum: 104,
    unit: 5,
    topic: 'Binomial Theorem Coefficient',
    topicId: 'alg-u5-binomial',
    question: 'What is the coefficient of x³ y⁴ in the expansion of (2x - y)⁷?',
    options: [
      { label: 'A', text: '280', isCorrect: true },
      { label: 'B', text: '-280', isCorrect: false },
      { label: 'C', text: '560', isCorrect: false },
      { label: 'D', text: '-560', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: General term formula in (a + b)ⁿ is C(n, k) a^(n-k) b^k. Here n = 7, a = 2x, b = -y. For x³ y⁴, choose k = 4: C(7, 4) × (2x)³ × (-y)⁴ = 35 × (8x³) × (y⁴) = 35 × 8 × x³ y⁴ = 280 x³ y⁴. The coefficient is 280.',
    difficulty: 'hard',
    passageId: 'alg-ped-p5'
  }),
  buildQuestion({
    qNum: 105,
    unit: 5,
    topic: 'Hyperbola Asymptotes',
    topicId: 'alg-u5-hyperbola',
    question: 'What are the equations of the asymptotes for the hyperbola x²/16 - y²/9 = 1?',
    options: [
      { label: 'A', text: 'y = ±(3/4)x', isCorrect: true },
      { label: 'B', text: 'y = ±(4/3)x', isCorrect: false },
      { label: 'C', text: 'y = ±(9/16)x', isCorrect: false },
      { label: 'D', text: 'y = ±(3/5)x', isCorrect: false }
    ],
    explanation: 'Marcus Vance\'s Derivation: For a horizontal hyperbola x²/a² - y²/b² = 1 centered at origin, the asymptotes are y = ±(b/a)x. Here a² = 16 (a = 4) and b² = 9 (b = 3). Therefore, asymptotes are y = ±(3/4)x.',
    difficulty: 'medium',
    passageId: 'alg-ped-p5'
  })
];
