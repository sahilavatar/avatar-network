import { QuizQuestion } from '../types';

/**
 * Sample chemistry practice questions (43), hand-written for Avatar Network across nine units.
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

// Helper to construct questions with strict metadata
function buildQuestion(tpl: ProblemTemplate): QuizQuestion {
  return {
    id: `apchem-q${tpl.qNum}`,
    subject: 'chemistry',
    topicId: tpl.topicId,
    type: 'conceptual',
    question: tpl.question,
    options: tpl.options,
    explanation: tpl.explanation,
    passageId: tpl.passageId,
    passageSnippet: `AP Chemistry Unit ${tpl.unit}: ${tpl.topic}`,
    difficulty: tpl.difficulty,
    sourceTitle: 'Sample practice questions: Chemistry (43)',
    sourceId: 'chem-ap-vault',
    originalQuestionNumber: tpl.qNum
  };
}

// AP Chemistry questions organized by unit
export const AP_CHEM_PROBLEM_BANK: QuizQuestion[] = [
  // ==========================================
  // UNIT 1: ATOMIC STRUCTURE & PROPERTIES
  // ==========================================
  buildQuestion({
    qNum: 1,
    unit: 1,
    topic: 'Moles & Molar Mass',
    topicId: 'chem-u1-moles',
    question: 'A 0.500 mol sample of calcium carbonate, CaCO₃ (molar mass = 100.09 g/mol), contains how many total oxygen atoms?',
    options: [
      { label: 'A', text: '3.01 × 10²³ oxygen atoms', isCorrect: false },
      { label: 'B', text: '9.03 × 10²³ oxygen atoms', isCorrect: true },
      { label: 'C', text: '1.81 × 10²⁴ oxygen atoms', isCorrect: false },
      { label: 'D', text: '6.02 × 10²³ oxygen atoms', isCorrect: false }
    ],
    explanation: 'Each formula unit of CaCO₃ contains 3 oxygen atoms. Therefore, 0.500 mol CaCO₃ contains 0.500 × 3 = 1.50 mol of oxygen atoms. (1.50 mol)(6.022 × 10²³ atoms/mol) = 9.03 × 10²³ oxygen atoms.',
    difficulty: 'easy',
    passageId: 'chem-u1-p1'
  }),
  buildQuestion({
    qNum: 2,
    unit: 1,
    topic: 'Mass Spectroscopy of Elements',
    topicId: 'chem-u1-mass-spec',
    question: 'The mass spectrum of elemental chlorine exhibits two major peaks at m/z = 35 (relative abundance ~75.77%) and m/z = 37 (relative abundance ~24.23%). What is the estimated average atomic mass of chlorine?',
    options: [
      { label: 'A', text: '35.45 amu', isCorrect: true },
      { label: 'B', text: '36.00 amu', isCorrect: false },
      { label: 'C', text: '35.00 amu', isCorrect: false },
      { label: 'D', text: '37.00 amu', isCorrect: false }
    ],
    explanation: 'Average atomic mass = (0.7577 × 35) + (0.2423 × 37) = 26.52 + 8.965 = 35.485 ≈ 35.45 amu. The mass spectrum directly reflects naturally occurring isotopic abundances.',
    difficulty: 'easy',
    passageId: 'chem-u1-p2'
  }),
  buildQuestion({
    qNum: 3,
    unit: 1,
    topic: 'Elemental Composition of Pure Substances',
    topicId: 'chem-u1-composition',
    question: 'An unknown hydrocarbon is determined to contain 85.6% carbon and 14.4% hydrogen by mass. What is its empirical formula?',
    options: [
      { label: 'A', text: 'CH', isCorrect: false },
      { label: 'B', text: 'CH₂', isCorrect: true },
      { label: 'C', text: 'CH₃', isCorrect: false },
      { label: 'D', text: 'C₂H₅', isCorrect: false }
    ],
    explanation: 'In 100 g: C = 85.6 g / 12.011 g/mol = 7.13 mol; H = 14.4 g / 1.008 g/mol = 14.28 mol. Ratio H:C = 14.28 / 7.13 ≈ 2.00. The empirical formula is CH₂.',
    difficulty: 'medium',
    passageId: 'chem-u1-p3'
  }),
  buildQuestion({
    qNum: 4,
    unit: 1,
    topic: 'Photoelectron Spectroscopy (PES)',
    topicId: 'chem-u1-pes',
    question: 'In the PES spectrum of nitrogen (atomic number 7), three peaks appear at binding energies 39.6 MJ/mol, 2.45 MJ/mol, and 1.40 MJ/mol. What subshell corresponds to the peak at 1.40 MJ/mol and how many electrons does it hold?',
    options: [
      { label: 'A', text: '1s subshell with 2 electrons', isCorrect: false },
      { label: 'B', text: '2s subshell with 2 electrons', isCorrect: false },
      { label: 'C', text: '2p subshell with 3 electrons', isCorrect: true },
      { label: 'D', text: '3s subshell with 1 electron', isCorrect: false }
    ],
    explanation: 'Nitrogen electron configuration is 1s² 2s² 2p³. The peak with the lowest binding energy (1.40 MJ/mol) is furthest from the nucleus (2p) and has a peak height corresponding to 3 electrons, 1.5× higher than the 1s and 2s peaks.',
    difficulty: 'medium',
    passageId: 'chem-u1-p4'
  }),
  buildQuestion({
    qNum: 5,
    unit: 1,
    topic: 'Periodic Trends: Ionization Energy',
    topicId: 'chem-u1-trends',
    question: 'Why does oxygen have a slightly lower first ionization energy (1314 kJ/mol) than nitrogen (1402 kJ/mol), despite having a higher nuclear charge?',
    options: [
      { label: 'A', text: 'Oxygen has more electron shielding shells than nitrogen.', isCorrect: false },
      { label: 'B', text: 'Oxygen removes an electron from a paired 2p orbital, where electron-electron repulsion lowers the energy required for ionization.', isCorrect: true },
      { label: 'C', text: 'Oxygen’s 2s subshell is full while nitrogen’s is half-filled.', isCorrect: false },
      { label: 'D', text: 'Oxygen has a smaller effective nuclear charge than nitrogen.', isCorrect: false }
    ],
    explanation: 'Nitrogen has a half-filled 2p³ subshell (all parallel spins in separate orbitals by Hund\'s rule). Oxygen has a 2p⁴ configuration with one paired orbital. Electron-electron repulsion in the doubly occupied 2p orbital destabilizes the electron, making it easier to remove.',
    difficulty: 'hard',
    passageId: 'chem-u1-p5'
  }),
  buildQuestion({
    qNum: 6,
    unit: 1,
    topic: 'Periodic Trends: Atomic & Ionic Radii',
    topicId: 'chem-u1-trends',
    question: 'Which of the following isoelectronic species has the smallest ionic radius: N³⁻, O²⁻, F⁻, or Na⁺?',
    options: [
      { label: 'A', text: 'N³⁻', isCorrect: false },
      { label: 'B', text: 'O²⁻', isCorrect: false },
      { label: 'C', text: 'F⁻', isCorrect: false },
      { label: 'D', text: 'Na⁺', isCorrect: true }
    ],
    explanation: 'All four species have 10 electrons (configuration 1s² 2s² 2p⁶). Na⁺ has 11 protons, pulling the 10 electrons most tightly with the greatest effective nuclear charge (Z_eff), resulting in the smallest radius.',
    difficulty: 'easy',
    passageId: 'chem-u1-p5'
  }),
  buildQuestion({
    qNum: 7,
    unit: 1,
    topic: 'Electron Configurations & Quantum Numbers',
    topicId: 'chem-u1-electron-config',
    question: 'What is the ground-state electron configuration of the transition metal cation Fe²⁺ (Z = 26)?',
    options: [
      { label: 'A', text: '[Ar] 4s² 3d⁴', isCorrect: false },
      { label: 'B', text: '[Ar] 3d⁶', isCorrect: true },
      { label: 'C', text: '[Ar] 4s¹ 3d⁵', isCorrect: false },
      { label: 'D', text: '[Ar] 3d⁴ 4s²', isCorrect: false }
    ],
    explanation: 'Neutral iron is [Ar] 4s² 3d⁶. Transition metals lose valence s-electrons first upon ionization. Removing two electrons removes the 4s² electrons, leaving [Ar] 3d⁶.',
    difficulty: 'medium',
    passageId: 'chem-u1-p1'
  }),
  buildQuestion({
    qNum: 8,
    unit: 1,
    topic: 'Aufbau Principle & Anomalies',
    topicId: 'chem-u1-electron-config',
    question: 'Which element exhibits an anomalous ground-state electron configuration due to the enhanced stability of a half-filled or fully filled d subshell?',
    options: [
      { label: 'A', text: 'Chromium (Cr, Z=24): [Ar] 4s¹ 3d⁵', isCorrect: true },
      { label: 'B', text: 'Titanium (Ti, Z=22): [Ar] 4s² 3d²', isCorrect: false },
      { label: 'C', text: 'Cobalt (Co, Z=27): [Ar] 4s² 3d⁷', isCorrect: false },
      { label: 'D', text: 'Zinc (Zn, Z=30): [Ar] 4s² 3d¹⁰', isCorrect: false }
    ],
    explanation: 'Chromium promotes one 4s electron to achieve a half-filled 3d⁵ subshell with lower interelectronic repulsion and exchange energy: [Ar] 4s¹ 3d⁵ rather than [Ar] 4s² 3d⁴.',
    difficulty: 'medium',
    passageId: 'chem-u1-p1'
  }),
  buildQuestion({
    qNum: 9,
    unit: 1,
    topic: 'Coulomb’s Law in Atomic Structure',
    topicId: 'chem-u1-coulomb',
    question: 'According to Coulomb\'s Law (F ∝ q₁q₂ / r²), why is the second ionization energy of magnesium (1451 kJ/mol) higher than its first ionization energy (738 kJ/mol)?',
    options: [
      { label: 'A', text: 'The second electron is removed from a core shell with n = 2.', isCorrect: false },
      { label: 'B', text: 'Removing the first electron decreases electron-electron shielding, increasing the effective nuclear charge felt by the remaining valence electron.', isCorrect: true },
      { label: 'C', text: 'The atomic radius expands after the first electron is removed.', isCorrect: false },
      { label: 'D', text: 'The nuclear charge of magnesium decreases by 1.', isCorrect: false }
    ],
    explanation: 'Removing an electron leaves 12 protons acting on 11 electrons. The decreased shielding causes the electron cloud to contract (smaller r) and increases Z_eff, requiring more energy to remove the second valence electron.',
    difficulty: 'medium',
    passageId: 'chem-u1-p5'
  }),
  buildQuestion({
    qNum: 10,
    unit: 1,
    topic: 'Beer-Lambert Law & Concentration',
    topicId: 'chem-u1-spectroscopy',
    question: 'A student measures the absorbance of a 0.040 M aqueous solution of CoCl₂ in a 1.00 cm pathlength cuvette and finds A = 0.60. What is the molar absorptivity (ε) of CoCl₂ at this wavelength?',
    options: [
      { label: 'A', text: '0.024 M⁻¹cm⁻¹', isCorrect: false },
      { label: 'B', text: '15 M⁻¹cm⁻¹', isCorrect: true },
      { label: 'C', text: '25 M⁻¹cm⁻¹', isCorrect: false },
      { label: 'D', text: '0.067 M⁻¹cm⁻¹', isCorrect: false }
    ],
    explanation: 'Beer-Lambert Law: A = ε·b·c. Rearranging: ε = A / (b·c) = 0.60 / (1.00 cm × 0.040 M) = 15 M⁻¹cm⁻¹.',
    difficulty: 'medium',
    passageId: 'chem-u1-p3'
  }),

  // ==========================================
  // UNIT 2: MOLECULAR & IONIC COMPOUND STRUCTURE & PROPERTIES
  // ==========================================
  buildQuestion({
    qNum: 61,
    unit: 2,
    topic: 'Types of Chemical Bonds',
    topicId: 'chem-u2-bonding',
    question: 'Based on electronegativity differences, which bond possesses the greatest percent ionic character?',
    options: [
      { label: 'A', text: 'C - H (ΔEN = 0.4)', isCorrect: false },
      { label: 'B', text: 'N - O (ΔEN = 0.5)', isCorrect: false },
      { label: 'C', text: 'K - F (ΔEN = 3.2)', isCorrect: true },
      { label: 'D', text: 'Si - O (ΔEN = 1.7)', isCorrect: false }
    ],
    explanation: 'Ionic character increases with electronegativity difference (ΔEN). Potassium (0.8) and Fluorine (4.0) have ΔEN = 3.2, resulting in virtually complete valence electron transfer.',
    difficulty: 'easy',
    passageId: 'chem-u2-p1'
  }),
  buildQuestion({
    qNum: 62,
    unit: 2,
    topic: 'Potential Energy & Internuclear Distance',
    topicId: 'chem-u2-pe-curve',
    question: 'On an internuclear potential energy diagram for a diatomic molecule (such as H₂), what does the depth of the potential energy well represent?',
    options: [
      { label: 'A', text: 'The bond length of the molecule', isCorrect: false },
      { label: 'B', text: 'The bond energy (bond dissociation energy) required to break the bond', isCorrect: true },
      { label: 'C', text: 'The repulsive force between the two nuclei', isCorrect: false },
      { label: 'D', text: 'The activation energy of a substitution reaction', isCorrect: false }
    ],
    explanation: 'The minimum on the potential energy curve corresponds to the equilibrium bond length (x-axis) and the bond dissociation energy (depth of the well below zero energy).',
    difficulty: 'medium',
    passageId: 'chem-u2-p2'
  }),
  buildQuestion({
    qNum: 63,
    unit: 2,
    topic: 'Lattice Energy & Coulomb’s Law',
    topicId: 'chem-u2-lattice',
    question: 'Which of the following ionic solids has the highest melting point and greatest lattice energy: NaCl, MgO, KCl, or BaO?',
    options: [
      { label: 'A', text: 'NaCl', isCorrect: false },
      { label: 'B', text: 'MgO', isCorrect: true },
      { label: 'C', text: 'KCl', isCorrect: false },
      { label: 'D', text: 'BaO', isCorrect: false }
    ],
    explanation: 'Lattice energy is proportional to (q₁·q₂) / r. In MgO, charges are +2 and -2 (product = 4), compared to +1/-1 in NaCl. Between MgO and BaO, Mg²⁺ has a significantly smaller ionic radius than Ba²⁺, maximizing Coulombic attraction.',
    difficulty: 'hard',
    passageId: 'chem-u2-p3'
  }),
  buildQuestion({
    qNum: 64,
    unit: 2,
    topic: 'Alloys: Interstitial vs Substitutional',
    topicId: 'chem-u2-alloys',
    question: 'Steel is formed by adding small carbon atoms into the crystalline lattice of iron atoms. How is steel classified and why is it harder than pure iron?',
    options: [
      { label: 'A', text: 'Substitutional alloy; carbon atoms replace iron in lattice sites.', isCorrect: false },
      { label: 'B', text: 'Interstitial alloy; small carbon atoms occupy spaces between iron atoms, hindering slip planes.', isCorrect: true },
      { label: 'C', text: 'Network covalent solid; covalent bonds link all iron and carbon atoms.', isCorrect: false },
      { label: 'D', text: 'Amorphous glass; lattice crystallinity is completely destroyed.', isCorrect: false }
    ],
    explanation: 'Carbon has a much smaller radius than iron, fitting into interstitial holes. This disrupts regular atomic slip planes, preventing deformation and making steel significantly harder and less malleable than pure iron.',
    difficulty: 'medium',
    passageId: 'chem-u2-p4'
  }),
  buildQuestion({
    qNum: 65,
    unit: 2,
    topic: 'Lewis Diagrams & Formal Charge',
    topicId: 'chem-u2-formal-charge',
    question: 'In the most stable Lewis structure for the thiocyanate ion, [SCN]⁻, what is the formal charge on the nitrogen atom?',
    options: [
      { label: 'A', text: '0', isCorrect: false },
      { label: 'B', text: '-1', isCorrect: true },
      { label: 'C', text: '+1', isCorrect: false },
      { label: 'D', text: '-2', isCorrect: false }
    ],
    explanation: 'In the optimal resonance structure (S=C=N)⁻ or (S-C≡N)⁻: with triple bond C≡N, N has 1 lone pair: Formal charge = 5 - 2 - 3 = 0, but S has 3 lone pairs (charge -1). However, nitrogen is more electronegative than sulfur (3.0 vs 2.5), so the dominant resonance form (S=C=N)⁻ gives N a formal charge of 5 - 4 - 2 = -1.',
    difficulty: 'hard',
    passageId: 'chem-u2-p5'
  }),
  buildQuestion({
    qNum: 66,
    unit: 2,
    topic: 'VSEPR Theory & Molecular Geometry',
    topicId: 'chem-u2-vsepr',
    question: 'What is the molecular geometry and approximate bond angle of sulfur tetrafluoride, SF₄?',
    options: [
      { label: 'A', text: 'Tetrahedral, 109.5°', isCorrect: false },
      { label: 'B', text: 'Square planar, 90°', isCorrect: false },
      { label: 'C', text: 'See-saw, <90° and <120°', isCorrect: true },
      { label: 'D', text: 'Trigonal bipyramidal, 120° and 90°', isCorrect: false }
    ],
    explanation: 'Sulfur in SF₄ has 34 valence electrons: 4 single bonds and 1 equatorial lone pair on sulfur (steric number 5, AX₄E). The lone pair repels equatorial and axial bonds, creating a distorted see-saw shape.',
    difficulty: 'medium',
    passageId: 'chem-u2-p5'
  }),
  buildQuestion({
    qNum: 67,
    unit: 2,
    topic: 'Hybridization & Sigma/Pi Bonds',
    topicId: 'chem-u2-hybridization',
    question: 'In a molecule of propyne (H₃C - C ≡ CH), what are the hybridization states of the three carbon atoms from left to right?',
    options: [
      { label: 'A', text: 'sp³, sp², sp', isCorrect: false },
      { label: 'B', text: 'sp³, sp, sp', isCorrect: true },
      { label: 'C', text: 'sp², sp², sp', isCorrect: false },
      { label: 'D', text: 'sp³, sp³, sp²', isCorrect: false }
    ],
    explanation: 'Carbon 1 (CH₃) has 4 single bonds: sp³ (tetrahedral). Carbon 2 and Carbon 3 share a triple bond (1 σ and 2 π bonds) with linear geometry: each has steric number 2 and is sp hybridized.',
    difficulty: 'medium',
    passageId: 'chem-u2-p6'
  }),

  // ==========================================
  // UNIT 3: INTERMOLECULAR FORCES & PROPERTIES
  // ==========================================
  buildQuestion({
    qNum: 121,
    unit: 3,
    topic: 'Intermolecular Forces & Boiling Points',
    topicId: 'chem-u3-imf',
    question: 'Which of the following compounds exhibits the highest normal boiling point: CH₄, CF₄, CCl₄, or CBr₄?',
    options: [
      { label: 'A', text: 'CH₄', isCorrect: false },
      { label: 'B', text: 'CF₄', isCorrect: false },
      { label: 'C', text: 'CCl₄', isCorrect: false },
      { label: 'D', text: 'CBr₄', isCorrect: true }
    ],
    explanation: 'All four molecules are nonpolar tetrahedrals governed by London dispersion forces. CBr₄ has the largest, most polarizable electron cloud (146 electrons), yielding the strongest dispersion forces and highest boiling point.',
    difficulty: 'easy',
    passageId: 'chem-u3-p1'
  }),
  buildQuestion({
    qNum: 122,
    unit: 3,
    topic: 'Hydrogen Bonding Criteria',
    topicId: 'chem-u3-imf',
    question: 'Which of the following molecules can form hydrogen bonds between identical molecules in a pure liquid?',
    options: [
      { label: 'A', text: 'CH₃ - O - CH₃ (dimethyl ether)', isCorrect: false },
      { label: 'B', text: 'CH₃ - CH₂ - OH (ethanol)', isCorrect: true },
      { label: 'C', text: 'CH₃ - F (fluoromethane)', isCorrect: false },
      { label: 'D', text: 'CH₃ - CHO (acetaldehyde)', isCorrect: false }
    ],
    explanation: 'Hydrogen bonding requires a hydrogen atom covalently bonded directly to a highly electronegative atom (N, O, or F). Ethanol has an -O-H bond. Dimethyl ether and fluoromethane lack H bonded directly to F or O.',
    difficulty: 'medium',
    passageId: 'chem-u3-p1'
  }),
  buildQuestion({
    qNum: 123,
    unit: 3,
    topic: 'Ideal Gas Law Calculations',
    topicId: 'chem-u3-gas-laws',
    question: 'A 2.24 L rigid container holds 0.100 mol of helium gas at 273 K. What is the pressure of the gas? (R = 0.08206 L·atm/(mol·K))',
    options: [
      { label: 'A', text: '0.50 atm', isCorrect: false },
      { label: 'B', text: '1.00 atm', isCorrect: true },
      { label: 'C', text: '2.00 atm', isCorrect: false },
      { label: 'D', text: '22.4 atm', isCorrect: false }
    ],
    explanation: 'P = nRT / V = (0.100 mol × 0.08206 L·atm/(mol·K) × 273.15 K) / 2.24 L = 1.00 atm. At STP (1 atm, 273 K), 1 mole of an ideal gas occupies 22.4 L; 0.100 mol occupies 2.24 L.',
    difficulty: 'easy',
    passageId: 'chem-u3-p2'
  }),
  buildQuestion({
    qNum: 124,
    unit: 3,
    topic: 'Dalton’s Law of Partial Pressures',
    topicId: 'chem-u3-gas-laws',
    question: 'A gas mixture in a 5.0 L container contains 0.40 mol of N₂ and 0.10 mol of O₂ at a total pressure of 2.50 atm. What is the partial pressure of O₂?',
    options: [
      { label: 'A', text: '0.25 atm', isCorrect: false },
      { label: 'B', text: '0.50 atm', isCorrect: true },
      { label: 'C', text: '1.00 atm', isCorrect: false },
      { label: 'D', text: '2.00 atm', isCorrect: false }
    ],
    explanation: 'Total moles = 0.40 + 0.10 = 0.50 mol. Mole fraction of O₂ (χ_O₂) = 0.10 / 0.50 = 0.20. Partial pressure P_O₂ = χ_O₂ × P_total = 0.20 × 2.50 atm = 0.50 atm.',
    difficulty: 'easy',
    passageId: 'chem-u3-p2'
  }),
  buildQuestion({
    qNum: 125,
    unit: 3,
    topic: 'Kinetic Molecular Theory & Speed Distribution',
    topicId: 'chem-u3-kmt',
    question: 'Two identical containers at the same temperature T hold equal masses of Neon (molar mass = 20.18 g/mol) and Argon (molar mass = 39.95 g/mol). Which statement is correct?',
    options: [
      { label: 'A', text: 'Argon atoms have a higher root-mean-square speed (v_rms) than Neon atoms.', isCorrect: false },
      { label: 'B', text: 'Neon and Argon atoms have identical average kinetic energies per particle.', isCorrect: true },
      { label: 'C', text: 'The pressure in the Argon container is higher than in the Neon container.', isCorrect: false },
      { label: 'D', text: 'Argon atoms collide with the container walls more frequently.', isCorrect: false }
    ],
    explanation: 'Average kinetic energy depends solely on temperature: KE_avg = (3/2)kT. Since both are at the same temperature, their average kinetic energies are identical. However, lighter Neon atoms have higher average velocity.',
    difficulty: 'medium',
    passageId: 'chem-u3-p3'
  }),
  buildQuestion({
    qNum: 126,
    unit: 3,
    topic: 'Real Gas Non-Ideality',
    topicId: 'chem-u3-kmt',
    question: 'Under which conditions does the measured pressure of a real gas deviate most significantly below the pressure predicted by the Ideal Gas Law?',
    options: [
      { label: 'A', text: 'High temperature and low pressure', isCorrect: false },
      { label: 'B', text: 'Low temperature and high pressure, where intermolecular attractions pull gas particles together', isCorrect: true },
      { label: 'C', text: 'High temperature and low volume', isCorrect: false },
      { label: 'D', text: 'When the gas particles undergo zero intermolecular collisions', isCorrect: false }
    ],
    explanation: 'At low temperatures and high pressures, gas particles move slowly and are close together. Attractive intermolecular forces pull particles toward each other, reducing the force of their impacts with the container wall below ideal values.',
    difficulty: 'hard',
    passageId: 'chem-u3-p3'
  }),

  // ==========================================
  // UNIT 4: CHEMICAL REACTIONS & STOICHIOMETRY
  // ==========================================
  buildQuestion({
    qNum: 181,
    unit: 4,
    topic: 'Net Ionic Equations',
    topicId: 'chem-u4-net-ionic',
    question: 'When aqueous solutions of lead(II) nitrate, Pb(NO₃)₂, and potassium iodide, KI, are mixed, what is the balanced net ionic equation?',
    options: [
      { label: 'A', text: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)', isCorrect: true },
      { label: 'B', text: 'K⁺(aq) + NO₃⁻(aq) → KNO₃(s)', isCorrect: false },
      { label: 'C', text: 'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)', isCorrect: false },
      { label: 'D', text: 'Pb²⁺(aq) + 2NO₃⁻(aq) + 2K⁺(aq) + 2I⁻(aq) → PbI₂(s) + 2K⁺(aq) + 2NO₃⁻(aq)', isCorrect: false }
    ],
    explanation: 'Potassium (K⁺) and nitrate (NO₃⁻) ions remain dissolved as spectators. Lead(II) and iodide ions precipitate as bright yellow lead(II) iodide: Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s).',
    difficulty: 'easy',
    passageId: 'chem-u4-p1'
  }),
  buildQuestion({
    qNum: 182,
    unit: 4,
    topic: 'Limiting Reactants & Theoretical Yield',
    topicId: 'chem-u4-stoich',
    question: 'Consider the reaction: 2Al(s) + 3Cl₂(g) → 2AlCl₃(s). If 0.40 mol of Al is reacted with 0.45 mol of Cl₂, what is the theoretical yield of AlCl₃ in moles?',
    options: [
      { label: 'A', text: '0.40 mol', isCorrect: false },
      { label: 'B', text: '0.30 mol', isCorrect: true },
      { label: 'C', text: '0.45 mol', isCorrect: false },
      { label: 'D', text: '0.15 mol', isCorrect: false }
    ],
    explanation: 'Moles of AlCl₃ from Al: 0.40 mol Al × (2 mol AlCl₃ / 2 mol Al) = 0.40 mol. Moles from Cl₂: 0.45 mol Cl₂ × (2 mol AlCl₃ / 3 mol Cl₂) = 0.30 mol. Cl₂ is the limiting reactant, yielding 0.30 mol AlCl₃.',
    difficulty: 'medium',
    passageId: 'chem-u4-p2'
  }),
  buildQuestion({
    qNum: 183,
    unit: 4,
    topic: 'Redox Reactions & Oxidation States',
    topicId: 'chem-u4-redox',
    question: 'In the reaction: 2MnO₄⁻(aq) + 5H₂C₂O₄(aq) + 6H⁺(aq) → 2Mn²⁺(aq) + 10CO₂(g) + 8H₂O(l), what is being oxidized and what is the change in its oxidation number?',
    options: [
      { label: 'A', text: 'Mn is oxidized from +7 to +2', isCorrect: false },
      { label: 'B', text: 'Carbon in oxalic acid is oxidized from +3 to +4', isCorrect: true },
      { label: 'C', text: 'Oxygen is oxidized from -2 to 0', isCorrect: false },
      { label: 'D', text: 'Hydrogen is oxidized from 0 to +1', isCorrect: false }
    ],
    explanation: 'In H₂C₂O₄, carbon has an oxidation state of +3 (2(+1) + 2(C) + 4(-2) = 0 → 2C = +6 → C = +3). In CO₂, carbon is +4. The increase from +3 to +4 represents oxidation (loss of electrons). Mn is reduced from +7 to +2.',
    difficulty: 'medium',
    passageId: 'chem-u4-p3'
  }),
  buildQuestion({
    qNum: 184,
    unit: 4,
    topic: 'Titration Stoichiometry',
    topicId: 'chem-u4-titration',
    question: 'A 25.00 mL sample of unknown H₂SO₄ requires 30.00 mL of 0.100 M NaOH to reach the phenolphthalein equivalence point: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. What is the molarity of H₂SO₄?',
    options: [
      { label: 'A', text: '0.0600 M', isCorrect: true },
      { label: 'B', text: '0.120 M', isCorrect: false },
      { label: 'C', text: '0.0300 M', isCorrect: false },
      { label: 'D', text: '0.240 M', isCorrect: false }
    ],
    explanation: 'Moles of NaOH = 0.03000 L × 0.100 M = 0.00300 mol. Moles of H₂SO₄ = 0.00300 mol NaOH × (1 mol H₂SO₄ / 2 mol NaOH) = 0.00150 mol. Molarity = 0.00150 mol / 0.02500 L = 0.0600 M.',
    difficulty: 'medium',
    passageId: 'chem-u4-p2'
  }),

  // ==========================================
  // UNIT 5: KINETICS
  // ==========================================
  buildQuestion({
    qNum: 246,
    unit: 5,
    topic: 'Differential Rate Laws & Orders',
    topicId: 'chem-u5-rate-law',
    question: 'For the reaction A + 2B → C, doubling [A] doubles the rate. Doubling [B] quadruples the rate. What is the overall order of the reaction and the units of the rate constant k?',
    options: [
      { label: 'A', text: '2nd order; units M⁻¹s⁻¹', isCorrect: false },
      { label: 'B', text: '3rd order; units M⁻²s⁻¹', isCorrect: true },
      { label: 'C', text: '1st order; units s⁻¹', isCorrect: false },
      { label: 'D', text: '4th order; units M⁻³s⁻¹', isCorrect: false }
    ],
    explanation: 'Order with respect to A is 1 (2¹ = 2). Order with respect to B is 2 (2² = 4). Rate = k[A]¹[B]². Overall order = 1 + 2 = 3. Units: Rate / ([M]³) = (M/s) / M³ = M⁻²s⁻¹.',
    difficulty: 'medium',
    passageId: 'chem-u5-p1'
  }),
  buildQuestion({
    qNum: 247,
    unit: 5,
    topic: 'Integrated Rate Laws & Half-Life',
    topicId: 'chem-u5-integrated-rates',
    question: 'A plot of 1/[A] versus time produces a straight line with a positive slope of 0.050 M⁻¹s⁻¹. What is the order of the reaction with respect to A, and what does the slope represent?',
    options: [
      { label: 'A', text: 'Zero order; slope = -k', isCorrect: false },
      { label: 'B', text: 'First order; slope = -k', isCorrect: false },
      { label: 'C', text: 'Second order; slope = +k', isCorrect: true },
      { label: 'D', text: 'Second order; slope = -k', isCorrect: false }
    ],
    explanation: 'The integrated second-order rate law is 1/[A]_t = kt + 1/[A]_0. A linear plot of 1/[A] vs time confirms second-order kinetics, where the slope equals the rate constant k.',
    difficulty: 'medium',
    passageId: 'chem-u5-p2'
  }),
  buildQuestion({
    qNum: 248,
    unit: 5,
    topic: 'Arrhenius Equation & Catalysts',
    topicId: 'chem-u5-catalysis',
    question: 'How does the addition of a catalyst increase the rate of a chemical reaction without altering the equilibrium constant K?',
    options: [
      { label: 'A', text: 'It increases the collision frequency between reactant molecules.', isCorrect: false },
      { label: 'B', text: 'It lowers the activation energy (Ea) equally for both the forward and reverse reactions by providing an alternate mechanism.', isCorrect: true },
      { label: 'C', text: 'It increases the overall enthalpy change (ΔH) of the reaction.', isCorrect: false },
      { label: 'D', text: 'It shifts the Maxwell-Boltzmann distribution curve to higher temperatures.', isCorrect: false }
    ],
    explanation: 'A catalyst provides an alternative pathway with a lower activation energy. Because Ea is reduced by the same amount for both forward and reverse directions, both rates increase proportionally, leaving K = k_forward / k_reverse unchanged.',
    difficulty: 'medium',
    passageId: 'chem-u5-p3'
  }),

  // ==========================================
  // UNIT 6: THERMODYNAMICS
  // ==========================================
  buildQuestion({
    qNum: 309,
    unit: 6,
    topic: 'Calorimetry & Specific Heat Capacity',
    topicId: 'chem-u6-calorimetry',
    question: 'A 50.0 g piece of metal at 100.0°C is dropped into 100.0 g of water (c = 4.184 J/(g·°C)) initially at 20.0°C. The final thermal equilibrium temperature is 24.0°C. Assuming no heat loss, what is the specific heat of the metal?',
    options: [
      { label: 'A', text: '0.44 J/(g·°C)', isCorrect: true },
      { label: 'B', text: '0.88 J/(g·°C)', isCorrect: false },
      { label: 'C', text: '0.22 J/(g·°C)', isCorrect: false },
      { label: 'D', text: '1.20 J/(g·°C)', isCorrect: false }
    ],
    explanation: 'q_water = m·c·ΔT = (100.0 g)(4.184 J/(g·°C))(24.0 - 20.0°C) = 1673.6 J. Heat lost by metal: -q_metal = 1673.6 J. c_metal = 1673.6 J / (50.0 g × (100.0 - 24.0°C)) = 1673.6 / (50.0 × 76.0) = 0.440 J/(g·°C).',
    difficulty: 'medium',
    passageId: 'chem-u6-p1'
  }),
  buildQuestion({
    qNum: 310,
    unit: 6,
    topic: 'Hess’s Law',
    topicId: 'chem-u6-hess',
    question: 'Given:\n(1) C(s) + O₂(g) → CO₂(g)   ΔH₁ = -393.5 kJ\n(2) 2CO(g) + O₂(g) → 2CO₂(g)   ΔH₂ = -566.0 kJ\nWhat is ΔH for the reaction: C(s) + 1/2 O₂(g) → CO(g)?',
    options: [
      { label: 'A', text: '-110.5 kJ', isCorrect: true },
      { label: 'B', text: '-676.5 kJ', isCorrect: false },
      { label: 'C', text: '+110.5 kJ', isCorrect: false },
      { label: 'D', text: '-283.0 kJ', isCorrect: false }
    ],
    explanation: 'Reverse reaction (2) and divide by 2: CO₂(g) → CO(g) + 1/2 O₂(g), ΔH = +283.0 kJ. Add to reaction (1): C(s) + O₂(g) → CO₂(g), ΔH = -393.5 kJ. Net ΔH = -393.5 + 283.0 = -110.5 kJ.',
    difficulty: 'medium',
    passageId: 'chem-u6-p2'
  }),
  buildQuestion({
    qNum: 311,
    unit: 6,
    topic: 'Bond Enthalpy Calculations',
    topicId: 'chem-u6-bonds',
    question: 'Why is the breaking of chemical bonds always an endothermic process (ΔH > 0)?',
    options: [
      { label: 'A', text: 'Bonds store potential energy that must be released as heat during breaking.', isCorrect: false },
      { label: 'B', text: 'Energy must be absorbed from the surroundings to overcome the electrostatic attraction between shared electrons and bonded nuclei.', isCorrect: true },
      { label: 'C', text: 'Entropy always decreases when bonds break into atoms.', isCorrect: false },
      { label: 'D', text: 'Breaking bonds releases kinetic energy into vibrational modes.', isCorrect: false }
    ],
    explanation: 'Bond breaking requires input of energy (endothermic) to overcome Coulombic attraction holding the nuclei together. Bond formation is always exothermic (releases energy). High school students frequently confuse this with metabolic ATP jargon.',
    difficulty: 'hard',
    passageId: 'chem-u6-p3'
  }),

  // ==========================================
  // UNIT 7: EQUILIBRIUM
  // ==========================================
  buildQuestion({
    qNum: 371,
    unit: 7,
    topic: 'Equilibrium Constant Expressions',
    topicId: 'chem-u7-equilibrium-const',
    question: 'For the heterogeneous equilibrium: CaCO₃(s) ⇌ CaO(s) + CO₂(g), what is the correct expression for Kp?',
    options: [
      { label: 'A', text: 'Kp = [CaO][CO₂] / [CaCO₃]', isCorrect: false },
      { label: 'B', text: 'Kp = P_CO₂', isCorrect: true },
      { label: 'C', text: 'Kp = P_CaO · P_CO₂ / P_CaCO₃', isCorrect: false },
      { label: 'D', text: 'Kp = 1 / P_CO₂', isCorrect: false }
    ],
    explanation: 'Pure solids and liquids have constant activities equal to 1 and are excluded from equilibrium constant expressions. Kp depends solely on the partial pressure of gaseous carbon dioxide: Kp = P_CO₂.',
    difficulty: 'easy',
    passageId: 'chem-u7-p1'
  }),
  buildQuestion({
    qNum: 372,
    unit: 7,
    topic: 'Le Châtelier’s Principle & Temperature',
    topicId: 'chem-u7-le-chatelier',
    question: 'For the exothermic synthesis of ammonia: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92 kJ, how will increasing the temperature affect the value of K and the equilibrium yield of NH₃?',
    options: [
      { label: 'A', text: 'K increases; yield of NH₃ increases.', isCorrect: false },
      { label: 'B', text: 'K decreases; yield of NH₃ decreases.', isCorrect: true },
      { label: 'C', text: 'K remains constant; yield of NH₃ shifts right.', isCorrect: false },
      { label: 'D', text: 'K decreases; yield of NH₃ remains unchanged.', isCorrect: false }
    ],
    explanation: 'Heat can be treated as a product in an exothermic reaction. Adding heat shifts the equilibrium in the endothermic direction (reverse), consuming NH₃ and decreasing the numerical value of K = [NH₃]² / ([N₂][H₂]³).',
    difficulty: 'medium',
    passageId: 'chem-u7-p2'
  }),
  buildQuestion({
    qNum: 373,
    unit: 7,
    topic: 'Solubility Product (Ksp) & Common-Ion Effect',
    topicId: 'chem-u7-ksp',
    question: 'The solubility product constant Ksp for AgCl is 1.8 × 10⁻¹⁰. How does the molar solubility of AgCl in 0.10 M NaCl compare to its solubility in pure water?',
    options: [
      { label: 'A', text: 'It is identical because Ksp is a constant at constant temperature.', isCorrect: false },
      { label: 'B', text: 'It is significantly lower in 0.10 M NaCl due to the common-ion effect (Cl⁻).', isCorrect: true },
      { label: 'C', text: 'It is higher because Na⁺ complexes with Ag⁺.', isCorrect: false },
      { label: 'D', text: 'It is doubled due to increased ionic strength.', isCorrect: false }
    ],
    explanation: 'In pure water, s = √(1.8 × 10⁻¹⁰) = 1.3 × 10⁻⁵ M. In 0.10 M NaCl, [Cl⁻] ≈ 0.10 M from NaCl. s = Ksp / 0.10 = 1.8 × 10⁻⁹ M. The common chloride ion drives the precipitation equilibrium to the left according to Le Châtelier.',
    difficulty: 'hard',
    passageId: 'chem-u7-p3'
  }),

  // ==========================================
  // UNIT 8: ACIDS & BASES & BUFFERS
  // ==========================================
  buildQuestion({
    qNum: 433,
    unit: 8,
    topic: 'Weak Acid Equilibria & Ka',
    topicId: 'chem-u8-acids',
    question: 'Acetic acid, CH₃COOH, has Ka = 1.8 × 10⁻⁵. What is the approximate pH of a 0.10 M solution of acetic acid?',
    options: [
      { label: 'A', text: '1.00', isCorrect: false },
      { label: 'B', text: '2.87', isCorrect: true },
      { label: 'C', text: '4.74', isCorrect: false },
      { label: 'D', text: '5.00', isCorrect: false }
    ],
    explanation: 'Ka = x² / (0.10 - x) ≈ x² / 0.10 = 1.8 × 10⁻⁵ → x² = 1.8 × 10⁻⁶ → x = [H⁺] = 1.34 × 10⁻³ M. pH = -log(1.34 × 10⁻³) ≈ 2.87.',
    difficulty: 'medium',
    passageId: 'chem-u8-p1'
  }),
  buildQuestion({
    qNum: 434,
    unit: 8,
    topic: 'Buffer Systems & Henderson-Hasselbalch',
    topicId: 'chem-u8-buffers',
    question: 'A buffer is prepared with 0.20 M nitrous acid (HNO₂, Ka = 4.0 × 10⁻⁴, pKa = 3.40) and 0.20 M sodium nitrite (NaNO₂). What is the pH of this buffer, and what happens when a small amount of strong acid (HCl) is added?',
    options: [
      { label: 'A', text: 'pH = 7.00; NO₂⁻ reacts with H⁺ to form HNO₂.', isCorrect: false },
      { label: 'B', text: 'pH = 3.40; NO₂⁻ acts as a conjugate base to consume added H⁺ with minimal pH change.', isCorrect: true },
      { label: 'C', text: 'pH = 1.00; buffer capacity is instantly exceeded.', isCorrect: false },
      { label: 'D', text: 'pH = 4.40; HNO₂ dissociates completely.', isCorrect: false }
    ],
    explanation: 'When [HA] = [A⁻], pH = pKa + log(1) = 3.40. Added H⁺ ions react with the conjugate base NO₂⁻ (H⁺ + NO₂⁻ → HNO₂), preserving the buffer pH within its optimal operational range (pKa ± 1).',
    difficulty: 'medium',
    passageId: 'chem-u8-p2'
  }),
  buildQuestion({
    qNum: 435,
    unit: 8,
    topic: 'Titration Curves & Equivalence Points',
    topicId: 'chem-u8-titrations',
    question: 'When titrating a 0.10 M weak acid (HA, pKa = 4.80) with 0.10 M NaOH, what is true at the half-equivalence point and at the equivalence point?',
    options: [
      { label: 'A', text: 'At half-equivalence: pH = 7.0; at equivalence: pH = 4.80', isCorrect: false },
      { label: 'B', text: 'At half-equivalence: pH = pKa = 4.80; at equivalence: pH > 7.0 due to hydrolysis of conjugate base A⁻', isCorrect: true },
      { label: 'C', text: 'At half-equivalence: [HA] = 0; at equivalence: pH = 7.0', isCorrect: false },
      { label: 'D', text: 'At half-equivalence: pH = 14.0; at equivalence: pH < 7.0', isCorrect: false }
    ],
    explanation: 'At half-equivalence, exactly half of HA has been converted to A⁻, so [HA] = [A⁻] and pH = pKa = 4.80. At the equivalence point, all HA has been converted to conjugate base A⁻, which undergoes basic hydrolysis (A⁻ + H₂O ⇌ HA + OH⁻), causing the equivalence point pH to be > 7.0.',
    difficulty: 'hard',
    passageId: 'chem-u8-p3'
  }),

  // ==========================================
  // UNIT 9: THERMODYNAMICS & ELECTROCHEMISTRY
  // ==========================================
  buildQuestion({
    qNum: 495,
    unit: 9,
    topic: 'Gibbs Free Energy & Spontaneity',
    topicId: 'chem-u9-gibbs',
    question: 'For a chemical process with ΔH > 0 (endothermic) and ΔS > 0 (entropy increase), under what condition is the reaction thermodynamically favorable (spontaneous)?',
    options: [
      { label: 'A', text: 'At all temperatures', isCorrect: false },
      { label: 'B', text: 'At high temperatures, where T·ΔS outweighs ΔH so that ΔG < 0', isCorrect: true },
      { label: 'C', text: 'At low temperatures only', isCorrect: false },
      { label: 'D', text: 'At no temperature', isCorrect: false }
    ],
    explanation: 'ΔG = ΔH - T·ΔS. When ΔH is positive and ΔS is positive, the -T·ΔS term is negative. At sufficiently high temperatures (T > ΔH / ΔS), the -T·ΔS term dominates, making ΔG negative (spontaneous).',
    difficulty: 'medium',
    passageId: 'chem-u9-p1'
  }),
  buildQuestion({
    qNum: 496,
    unit: 9,
    topic: 'Galvanic Cells & Standard Cell Potential',
    topicId: 'chem-u9-galvanic',
    question: 'Given the standard reduction potentials:\nZn²⁺ + 2e⁻ → Zn(s)   E° = -0.76 V\nCu²⁺ + 2e⁻ → Cu(s)   E° = +0.34 V\nWhat is the standard cell potential (E°_cell) for the spontaneous galvanic cell: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)?',
    options: [
      { label: 'A', text: '+0.42 V', isCorrect: false },
      { label: 'B', text: '+1.10 V', isCorrect: true },
      { label: 'C', text: '-1.10 V', isCorrect: false },
      { label: 'D', text: '+2.20 V', isCorrect: false }
    ],
    explanation: 'E°_cell = E°_cathode - E°_anode. Copper is reduced at the cathode (+0.34 V). Zinc is oxidized at the anode (-0.76 V). E°_cell = +0.34 V - (-0.76 V) = +1.10 V.',
    difficulty: 'easy',
    passageId: 'chem-u9-p2'
  }),
  buildQuestion({
    qNum: 497,
    unit: 9,
    topic: 'Nernst Equation & Concentration Cells',
    topicId: 'chem-u9-nernst',
    question: 'In the operational galvanic cell Zn(s) | Zn²⁺(aq, 0.010 M) || Cu²⁺(aq, 2.00 M) | Cu(s), how does the cell potential E compare to standard E°_cell (+1.10 V)?',
    options: [
      { label: 'A', text: 'E < E°_cell because ion concentrations differ from 1.0 M', isCorrect: false },
      { label: 'B', text: 'E > E°_cell because the reaction quotient Q = [Zn²⁺]/[Cu²⁺] = 0.010/2.00 = 0.0050 < 1, driving a greater driving force for electron flow', isCorrect: true },
      { label: 'C', text: 'E = 0 V because the cell is in dynamic equilibrium', isCorrect: false },
      { label: 'D', text: 'E = E°_cell because solids do not affect cell potential', isCorrect: false }
    ],
    explanation: 'By the Nernst equation: E = E° - (0.0592 / n) · log(Q). Here Q = 0.010 / 2.00 = 5.0 × 10⁻³. Since Q < 1, log(Q) is negative, which makes -(0.0592/2)·log(Q) positive, increasing E above +1.10 V.',
    difficulty: 'hard',
    passageId: 'chem-u9-p3'
  }),
  buildQuestion({
    qNum: 498,
    unit: 9,
    topic: 'Electrolysis & Faraday’s Law',
    topicId: 'chem-u9-electrolysis',
    question: 'A constant current of 5.00 A is passed through a molten solution of AlCl₃ for 965 seconds. How many grams of aluminum metal (molar mass = 26.98 g/mol) are deposited at the cathode? (Faraday constant F = 96,485 C/mol e⁻)',
    options: [
      { label: 'A', text: '0.450 g', isCorrect: true },
      { label: 'B', text: '1.35 g', isCorrect: false },
      { label: 'C', text: '0.900 g', isCorrect: false },
      { label: 'D', text: '2.70 g', isCorrect: false }
    ],
    explanation: 'Total charge q = I · t = 5.00 A × 965 s = 4825 C. Moles of electrons = 4825 C / 96485 C/mol e⁻ = 0.0500 mol e⁻. Reduction of Al³⁺: Al³⁺ + 3e⁻ → Al(s). Moles of Al = 0.0500 / 3 = 0.01667 mol. Mass of Al = 0.01667 mol × 26.98 g/mol = 0.450 g.',
    difficulty: 'hard',
    passageId: 'chem-u9-p4'
  })
];
