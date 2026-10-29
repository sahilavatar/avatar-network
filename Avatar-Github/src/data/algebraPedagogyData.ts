import { Passage, SourceDocument } from '../types';

/**
 * Sample teaching material for the Algebra Avatar (Marcus Vance, a fictional persona), written for
 * Avatar Network: course topics, common mistakes, graphing explorations and how to show work.
 */

export const ALGEBRA_PEDAGOGY_SOURCES: SourceDocument[] = [
  {
    id: 'alg-ccss-framework',
    subject: 'algebra',
    title: 'Sample guide: Algebra course topics & skills',
    shortTitle: 'Algebra course topics',
    kind: 'syllabus',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Algebra course topics, mathematical practices and reasoning skills.'
  },
  {
    id: 'alg-misconceptions-guide',
    subject: 'algebra',
    title: 'Sample guide: Common algebra mistakes',
    shortTitle: 'Algebra mistakes guide',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Diagnostic protocols for correcting pervasive algebraic errors: distribution over exponents, illegal fraction cancellation, and variable division.'
  },
  {
    id: 'alg-visual-labs-manual',
    subject: 'algebra',
    title: 'Sample guide: Graphing explorations',
    shortTitle: 'Graphing explorations',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Explorations for parabola vertex transformations, polynomial zero multiplicity behavior, and asymptotic decay.'
  },
  {
    id: 'alg-ap-vault',
    subject: 'algebra',
    title: 'Sample practice questions: Algebra (28)',
    shortTitle: 'Algebra practice (28)',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    isExam: true,
    docSummary: '28 hand-written algebra practice questions across linear systems, quadratics, polynomials, logarithms and series, with worked explanations.'
  }
];

export const ALGEBRA_PEDAGOGY_PASSAGES: Passage[] = [
  // 1. Framework Passages
  {
    id: 'alg-ped-p1',
    subject: 'algebra',
    srcId: 'alg-ccss-framework',
    sourceTitle: 'Sample guide: Algebra course topics & skills',
    section: '§1.1 Curricular Architecture & Invariant Mathematical Practices',
    page: 8,
    text: 'Algebraic reasoning is organized around 3 core pillars: (1) Seeing Structure in Expressions (interpreting terms, factors, and coefficients as geometric entities); (2) Reasoning with Equations and Inequalities (maintaining solution-set invariance under algebraic transformations); and (3) Building and Modeling Functions (analyzing rates of change, symmetries, and asymptotic boundaries). Educators must emphasize CCSS Standard for Mathematical Practice 7: Look for and make use of structure.',
    tokens: 112,
    category: 'Curriculum & Standards'
  },
  {
    id: 'alg-ped-p2',
    subject: 'algebra',
    srcId: 'alg-ccss-framework',
    sourceTitle: 'Sample guide: Algebra course topics & skills',
    section: '§1.2 Quadratic Invariance and the Geometry of the Discriminant',
    page: 22,
    text: 'The quadratic equation ax² + bx + c = 0 represents the intersection of the parabola y = ax² + bx + c with the horizontal line y = 0. The discriminant Δ = b² - 4ac governs the topological relationship: if Δ > 0, the parabola crosses the x-axis at two distinct real points; if Δ = 0, the parabola\'s vertex is tangent to the axis; if Δ < 0, the parabola floats entirely above or below the axis, producing two complex conjugate roots symmetric about the vertical axis of symmetry x = -b / (2a).',
    tokens: 120,
    category: 'Curriculum & Standards'
  },

  // 2. Misconceptions Passages
  {
    id: 'alg-misc-p1',
    subject: 'algebra',
    srcId: 'alg-misconceptions-guide',
    sourceTitle: 'Sample guide: Common algebra mistakes',
    section: '§2.1 Misconception #1: Freshmen Exponent Fallacy (a + b)² = a² + b²',
    page: 14,
    text: 'Pervasive High School Misconception: Students erroneously write (a + b)² = a² + b², distributing the exponent across addition as if it were multiplication. Marcus Vance\'s Remediation: Anchor students in geometric area models. A square of side (a + b) has area partitioned into four distinct sub-rectangles: an a × a square (a²), two a × b rectangles (2ab), and a b × b square (b²). The middle cross-term 2ab represents the physical overlap. Omitting 2ab loses up to 50% of the magnitude in real numbers.',
    tokens: 124,
    category: 'Student Misconceptions'
  },
  {
    id: 'alg-misc-p2',
    subject: 'algebra',
    srcId: 'alg-misconceptions-guide',
    sourceTitle: 'Sample guide: Common algebra mistakes',
    section: '§2.2 Misconception #2: Illegal Cancellation of Additive Terms',
    page: 28,
    text: 'Pervasive High School Misconception: In rational expressions such as (x + 5) / 5, students cross out the 5 to obtain "x" or "x + 1". Marcus Vance\'s Remediation: Division is the inverse operation of multiplication, NOT addition. One can only cancel common multiplicative FACTORS, never additive terms. Show the numerical counter-example: let x = 10; (10 + 5) / 5 = 15 / 5 = 3. If one cancels the 5, one gets 10 + 1 = 11, which is wildly incorrect. Teach students to factor out common terms first: (5(x/5 + 1)) / 5.',
    tokens: 122,
    category: 'Student Misconceptions'
  },
  {
    id: 'alg-misc-p3',
    subject: 'algebra',
    srcId: 'alg-misconceptions-guide',
    sourceTitle: 'Sample guide: Common algebra mistakes',
    section: '§2.3 Misconception #3: Dividing by a Variable and Losing Roots',
    page: 42,
    text: 'Pervasive High School Misconception: When solving x² = 6x, students divide both sides by x to arrive at x = 6, completely missing x = 0. Marcus Vance\'s Remediation: Dividing by an unknown variable x implicitly assumes x ≠ 0, throwing away a valid root and violating division by zero. Instead, mandate the Zero Product Property: move all terms to one side, x² - 6x = 0, and factor: x(x - 6) = 0. This immediately yields both branches: x = 0 or x = 6.',
    tokens: 114,
    category: 'Student Misconceptions'
  },
  {
    id: 'alg-misc-p4',
    subject: 'algebra',
    srcId: 'alg-misconceptions-guide',
    sourceTitle: 'Sample guide: Common algebra mistakes',
    section: '§2.4 Misconception #4: Negative Exponent Misinterpretation',
    page: 56,
    text: 'Pervasive High School Misconception: Students interpret x⁻² as a negative number (e.g. -x² or -2x). Marcus Vance\'s Remediation: A negative sign in the exponent is a directional command (reciprocal operation), NOT an arithmetic sign of value. Demonstrate through the quotient pattern of powers: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4. Each step decrements power by dividing by the base. Therefore, x⁻ⁿ = 1 / xⁿ. The result remains strictly positive if x > 0.',
    tokens: 122,
    category: 'Student Misconceptions'
  },
  {
    id: 'alg-misc-p5',
    subject: 'algebra',
    srcId: 'alg-misconceptions-guide',
    sourceTitle: 'Sample guide: Common algebra mistakes',
    section: '§2.5 Misconception #5: Squaring Both Sides Introduces Extraneous Roots',
    page: 70,
    text: 'Pervasive High School Misconception: Students believe every solution produced by symbolic algebra is valid, failing to check back in the original radical equation. Marcus Vance\'s Remediation: Squaring both sides is not a one-to-one mapping (e.g., (-3)² = 9 and (3)² = 9). This transformation broadens the solution set to include roots of the conjugate equation. When solving √(x + 3) = x - 3, squaring gives x + 3 = x² - 6x + 9 => x² - 7x + 6 = 0 => (x - 6)(x - 1) = 0. Testing x = 1 gives √4 = -2 (false). Only x = 6 is a true geometric root.',
    tokens: 130,
    category: 'Student Misconceptions'
  },

  // 3. Visual Labs Passages
  {
    id: 'alg-lab-p1',
    subject: 'algebra',
    srcId: 'alg-visual-labs-manual',
    sourceTitle: 'Sample guide: Graphing explorations',
    section: '§3.1 Lab 1: Dynamic Parabolic Transformations in Vertex Form',
    page: 16,
    text: 'In this interactive coordinate exploration, students adjust parameters a, h, and k in the vertex family y = a(x - h)² + k. Students record how (h, k) shifts the axis of symmetry and extreme value, while parameter a acts as a vertical dial: positive a creates a global minimum opening upward, negative a creates a maximum opening downward, and |a| > 1 contracts the parabola toward its axis.',
    tokens: 104,
    category: 'Inquiry Labs & Protocols'
  },
  {
    id: 'alg-lab-p2',
    subject: 'algebra',
    srcId: 'alg-visual-labs-manual',
    sourceTitle: 'Sample guide: Graphing explorations',
    section: '§3.2 Lab 2: Multiplicity of Polynomial Roots and Graph Topology',
    page: 34,
    text: 'Students investigate higher-order polynomials P(x) = (x - r₁)ᵐ¹ (x - r₂)ᵐ². When multiplicity m is odd (m = 1, 3), the graph cuts cleanly across the x-axis, exhibiting an inflection point at m = 3. When multiplicity m is even (m = 2, 4), the curve touches the x-axis tangentially and bounces back, maintaining its sign.',
    tokens: 96,
    category: 'Inquiry Labs & Protocols'
  }
];
