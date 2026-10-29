import React, { useState, useMemo } from 'react';
import { SubjectId, QuizQuestion } from '../types';
import { TUTOR_KNOWLEDGE_FOLDERS } from '../data/knowledgeFolders';
import { AP_CHEM_PROBLEM_BANK } from '../data/apChemistryProblemBank';
import { ALGEBRA_PROBLEM_BANK } from '../data/algebraProblemBank';
import { BIOLOGY_PROBLEM_BANK } from '../data/biologyProblemBank';
import { HISTORY_PROBLEM_BANK } from '../data/historyProblemBank';
import { DOMAIN_RAG_REGISTRY } from '../services/chemistryRagOptimizer';
import {
  Folder,
  X,
  BookOpen,
  Award,
  Layers,
  Search,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FlaskConical,
  PlayCircle,
  MessageSquare,
  Cpu,
  Compass,
  FileText,
  Binary,
  Microscope,
  Landmark
} from 'lucide-react';

interface KnowledgeFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject: SubjectId;
  onSelectQuestionForPractice?: (q: QuizQuestion) => void;
  onAskTutorAboutQuestion?: (q: QuizQuestion) => void;
}

interface MisconceptionItem {
  id: string;
  title: string;
  error: string;
  remediation: string;
}

interface LabExplorationItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  keySkills: string[];
}

export const KnowledgeFolderModal: React.FC<KnowledgeFolderModalProps> = ({
  isOpen,
  onClose,
  currentSubject,
  onSelectQuestionForPractice,
  onAskTutorAboutQuestion
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(currentSubject || 'chemistry');
  const [activeTab, setActiveTab] = useState<'problems' | 'pedagogy' | 'units' | 'rag'>('problems');
  
  React.useEffect(() => {
    if (currentSubject) {
      setSelectedSubject(currentSubject);
    }
  }, [currentSubject, isOpen]);

  // Problem bank filters
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<number | 'all'>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const folder = TUTOR_KNOWLEDGE_FOLDERS[selectedSubject] || TUTOR_KNOWLEDGE_FOLDERS.chemistry;
  const ragRules = DOMAIN_RAG_REGISTRY[selectedSubject] || DOMAIN_RAG_REGISTRY.chemistry;

  // Dynamically select problem bank for the current subject
  const currentSubjectProblemBank = useMemo(() => {
    switch (selectedSubject) {
      case 'algebra':
        return ALGEBRA_PROBLEM_BANK;
      case 'biology':
        return BIOLOGY_PROBLEM_BANK;
      case 'history':
        return HISTORY_PROBLEM_BANK;
      case 'chemistry':
      default:
        return AP_CHEM_PROBLEM_BANK;
    }
  }, [selectedSubject]);

  // Filter problems for selected subject
  const filteredProblems = useMemo(() => {
    return currentSubjectProblemBank.filter(q => {
      // Unit filter
      if (selectedUnitFilter !== 'all') {
        const uNum = String(selectedUnitFilter);
        const matchesUnit =
          q.topicId.includes(`u${uNum}`) ||
          q.question.includes(`Unit ${uNum}`) ||
          (q.passageSnippet && q.passageSnippet.includes(`Unit ${uNum}`));
        if (!matchesUnit) return false;
      }
      // Difficulty filter
      if (selectedDifficultyFilter !== 'all' && q.difficulty !== selectedDifficultyFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const fullContent = (
          q.question + ' ' +
          q.explanation + ' ' +
          (q.passageSnippet || '') + ' ' +
          (q.originalQuestionNumber || '') + ' ' +
          q.topicId
        ).toLowerCase();
        if (!fullContent.includes(queryLower)) return false;
      }
      return true;
    });
  }, [currentSubjectProblemBank, selectedUnitFilter, selectedDifficultyFilter, searchQuery]);

  // Tutor-specific pedagogical philosophies
  const tutorPhilosophy = useMemo(() => {
    switch (selectedSubject) {
      case 'algebra':
        return {
          title: 'Marcus Vance\'s Visual & Structural Algebra Philosophy',
          quote: '"Mathematics is not an assembly line of symbol-pushing; it is learning to see invariant structures through changes. When students visualize quadratic parabolas as geometric transformations and rational functions as balance ratios between polynomials, equation anxiety dissolves into predictive confidence."',
          accentIcon: <Binary className="w-5 h-5 text-blue-500" />
        };
      case 'biology':
        return {
          title: 'Dr. Nia Thorne\'s Mechanistic & Evolutionary Systems Philosophy',
          quote: '"Biology is fundamentally mechanistic: structure dictates function at every scale, from the hydrogen bonding of a peptide backbone to the trophic flux of an entire biome. By training students to trace energetic pathways and selective pressures, we replace rote memorization with predictive scientific models."',
          accentIcon: <Microscope className="w-5 h-5 text-emerald-500" />
        };
      case 'history':
        return {
          title: 'Prof. Arthur Sterling\'s Archival Forensics & Historiographical Philosophy',
          quote: '"History is not a ledger of dates; it is an argument between perspectives preserved in the ink of primary sources. We must train students not merely to memorize facts, but to cross-examine documents forensically using the HIPP method—interrogating whose interests were served, whose voices were omitted, and how broader structural currents conditioned individual agency."',
          accentIcon: <Landmark className="w-5 h-5 text-amber-500" />
        };
      case 'chemistry':
      default:
        return {
          title: 'Dr. Kevin Chen\'s High School AP Chemistry Instructional Philosophy',
          quote: '"High school students often experience chemistry as an arbitrary collection of memorized formulas. Our pedagogical role is to anchor every concept in two fundamental physical invariants: Coulomb\'s Law (electrostatic attractions between charges) and the Thermodynamic Drive (systems seek minimum enthalpy ΔH and maximum entropy ΔS)."',
          accentIcon: <FlaskConical className="w-5 h-5 text-accent-500" />
        };
    }
  }, [selectedSubject]);

  // Tutor-specific common diagnostic misconceptions
  const subjectMisconceptions: MisconceptionItem[] = useMemo(() => {
    switch (selectedSubject) {
      case 'algebra':
        return [
          {
            id: 'alg-misc-1',
            title: 'Freshmen Exponent Fallacy: (a + b)² = a² + b²',
            error: 'Students distribute exponents across addition, omitting the middle term 2ab.',
            remediation: 'Marcus Vance\'s Remediation: Use geometric area models. A square of side (a + b) partitions into an a² square, two ab rectangles (2ab), and a b² square. Omitting 2ab loses up to 50% of magnitude in real numbers.'
          },
          {
            id: 'alg-misc-2',
            title: 'Illegal Cancellation of Additive Terms: (x + 5) / 5 = x + 1',
            error: 'Students cancel identical numbers across fraction bars regardless of addition.',
            remediation: 'Marcus Vance\'s Remediation: Division is the inverse of multiplication, not addition. You can only cancel common multiplicative factors. Test with numbers: (10 + 5)/5 = 15/5 = 3, whereas cancelling gives 10 + 1 = 11.'
          },
          {
            id: 'alg-misc-3',
            title: 'Dividing by Variable without Zero Check: x² = 6x => x = 6',
            error: 'Students divide both sides by x, discarding root x = 0 and dividing by zero.',
            remediation: 'Marcus Vance\'s Remediation: Enforce the Zero Product Property: move terms to one side, x² - 6x = 0, and factor x(x - 6) = 0. Both roots x = 0 and x = 6 emerge cleanly.'
          },
          {
            id: 'alg-misc-4',
            title: 'Negative Exponent Sign Confusion: x⁻² = -x²',
            error: 'Students interpret a negative exponent as making the overall number negative.',
            remediation: 'Marcus Vance\'s Remediation: A negative in the exponent is an inverse operation command (reciprocal), not an arithmetic sign: x⁻ⁿ = 1 / xⁿ. If x > 0, 1/xⁿ is strictly positive.'
          },
          {
            id: 'alg-misc-5',
            title: 'Squaring Both Sides Introduces Extraneous Solutions',
            error: 'Students assume symbolic manipulation always preserves domain validity without verifying roots.',
            remediation: 'Marcus Vance\'s Remediation: Squaring is not one-to-one (both (-3)² and 3² equal 9). Always plug candidate roots back into original radical expressions to discard extraneous solutions.'
          }
        ];
      case 'biology':
        return [
          {
            id: 'bio-misc-1',
            title: 'Plants Only Photosynthesize; Animals Respire',
            error: 'Students assume plant cells have chloroplasts instead of mitochondria.',
            remediation: 'Dr. Nia Thorne\'s Remediation: Plant cells contain BOTH chloroplasts and mitochondria. Chloroplasts synthesize carbohydrates, but plant cells must respire 24/7 in mitochondria to generate ATP for root ion uptake and biosynthesis.'
          },
          {
            id: 'bio-misc-2',
            title: 'Dominant Alleles Are Always More Common in Populations',
            error: 'Students assume "dominant" means an allele naturally spreads and takes over.',
            remediation: 'Dr. Nia Thorne\'s Remediation: Dominance is an allelic interaction in heterozygotes, not reproductive fitness. Huntington\'s disease and polydactyly are dominant, yet exist at tiny frequencies (<0.01%).'
          },
          {
            id: 'bio-misc-3',
            title: 'Lamarckian Teleology: Organisms Evolve "Because They Need To"',
            error: 'Students write that bacteria adapt intentionally in order to survive drugs.',
            remediation: 'Dr. Nia Thorne\'s Remediation: Natural selection is non-teleological. Random mutations create genetic variation BEFORE environmental shifts. Antibiotics act as selective filters, not evolutionary causes.'
          },
          {
            id: 'bio-misc-4',
            title: 'ATP "Creates" Energy by Snapping Bonds',
            error: 'Students assert that breaking the high-energy bond in ATP releases stored energy.',
            remediation: 'Dr. Nia Thorne\'s Remediation: Bond breaking is strictly endothermic. Hydrolysis is exergonic because product bonds (ADP + Pi) are in a lower potential energy state with reduced electrostatic charge repulsion.'
          },
          {
            id: 'bio-misc-5',
            title: 'Mutations Are Exclusively Deleterious',
            error: 'Students view all genetic mutations as debilitating diseases.',
            remediation: 'Dr. Nia Thorne\'s Remediation: Mutations are the sole source of novel genetic alleles. Many are synonymous (silent); others provide vital adaptive value under changing selective pressures (e.g., sickle cell trait vs malaria).'
          }
        ];
      case 'history':
        return [
          {
            id: 'hist-misc-1',
            title: 'Historical Inevitability & Hindsight Determinism',
            error: 'Students assume events happened because they "had to" (e.g. colonies destined for independence).',
            remediation: 'Prof. Arthur Sterling\'s Remediation: History is contingency and human agency. In 1774, most colonial leaders sought imperial commonwealth reform, not independence. Treat turning points as fragile decision spaces.'
          },
          {
            id: 'hist-misc-2',
            title: 'Monocausal Reductionism (Single Isolated Triggers)',
            error: 'Attributing complex conflicts to a single spark (e.g. WWI caused only by Franz Ferdinand).',
            remediation: 'Prof. Arthur Sterling\'s Remediation: Synthesize immediate catalysts with structural preconditions: alliances, imperial rivalries, economic industrial shifts, and ideological tensions.'
          },
          {
            id: 'hist-misc-3',
            title: 'Primary Source Credulity (Treating Archival Texts as Pure Fact)',
            error: 'Assuming that because an author was there, their primary account is objective truth.',
            remediation: 'Prof. Arthur Sterling\'s Remediation: Every primary text is an interested artifact. Conquistadors exaggerated gold to King Charles V to secure royal governorships. Cross-examine author motives using HIPP.'
          },
          {
            id: 'hist-misc-4',
            title: 'Presentism: Judging Historical Actors by 21st-Century Norms',
            error: 'Dismissing Enlightenment or ancient thinkers for not adopting modern sociopolitical standards.',
            remediation: 'Prof. Arthur Sterling\'s Remediation: Contextualize actors within the intellectual frontiers, material constraints, and cultural worldviews of their specific century without excusing past atrocities.'
          },
          {
            id: 'hist-misc-5',
            title: 'Conflating Free Soil Anti-Slavery with Racial Equality in 1860',
            error: 'Assuming northern anti-slavery voting blocs held modern civil rights egalitarian views.',
            remediation: 'Prof. Arthur Sterling\'s Remediation: The 1860 Free Soil platform opposed Western slavery expansion primarily to protect white wage labor from competing with enslaved labor. Radical abolitionists were a contested minority.'
          }
        ];
      case 'chemistry':
      default:
        return [
          {
            id: 'chem-misc-1',
            title: 'Bond Breaking Releases Energy',
            error: 'Students confuse metabolic coupling (ATP hydrolysis) with chemical bond energy.',
            remediation: 'Dr. Kevin Chen\'s Remediation: Breaking bonds is ALWAYS endothermic (ΔH > 0). Forming bonds is ALWAYS exothermic (ΔH < 0). ATP yields net heat because products ADP and Pi form stronger bonds with solvent water.'
          },
          {
            id: 'chem-misc-2',
            title: 'Equilibrium Means Equal Concentrations',
            error: 'Students assume reactants and products must reach 50/50 equality at equilibrium.',
            remediation: 'Dr. Kevin Chen\'s Remediation: Equilibrium is kinetic equality (rate_forward = rate_reverse), NOT concentration equality. Concentrations stay constant, but their ratio is governed by K.'
          },
          {
            id: 'chem-misc-3',
            title: 'Acid Strength Equals Concentration',
            error: 'Students assume a 12 M weak acid is stronger than 0.001 M strong acid.',
            remediation: 'Dr. Kevin Chen\'s Remediation: Strength describes percent ionization Ka (thermodynamic property), while concentration is molarity. A 0.001 M HCl solution ionizes 100%, producing higher [H+] than concentrated acetic acid.'
          },
          {
            id: 'chem-misc-4',
            title: 'Inert Gas Addition Shifts Equilibrium',
            error: 'Students assume adding helium increases total pressure, so equilibrium must shift.',
            remediation: 'Dr. Kevin Chen\'s Remediation: If added at constant volume, partial pressures of reacting gases do not change (Pi = ni RT/V). Thus Q remains equal to K, and no shift occurs.'
          },
          {
            id: 'chem-misc-5',
            title: 'Buffers Always Maintain Neutral pH 7.0',
            error: 'Students believe buffers reset any solution to neutral pH 7.',
            remediation: 'Dr. Kevin Chen\'s Remediation: Buffers resist pH change, but operational pH is governed by pKa + log([A-]/[HA]). Buffers operate across the entire pH scale based on the conjugate pair selected.'
          }
        ];
    }
  }, [selectedSubject]);

  // Tutor-specific guided inquiry labs / forensics
  const subjectLabs: LabExplorationItem[] = useMemo(() => {
    switch (selectedSubject) {
      case 'algebra':
        return [
          {
            id: 'alg-lab-1',
            title: 'Lab 1: Dynamic Parabola Vertex Transformations',
            subtitle: 'Coordinate Geometry & Symmetries',
            description: 'Exploration of parameters a, h, and k in y = a(x - h)² + k. Students map how horizontal shifts reverse sign and investigate extreme value optimization.',
            keySkills: ['Vertex Form', 'Axis of Symmetry', 'Vertical Stretch/Compression', 'Roots Conjugates']
          },
          {
            id: 'alg-lab-2',
            title: 'Lab 2: Polynomial Zero Multiplicity & Graph Topology',
            subtitle: 'Higher-Degree Curve Modeling',
            description: 'Analyzing behavior at real roots (x - r)ᵐ: odd multiplicities cross the axis with inflection at m=3, while even multiplicities produce tangential bounces.',
            keySkills: ['Multiplicity Behavior', 'End Behavior Dominance', 'Synthetic Division Checks', 'Rational Asymptotes']
          }
        ];
      case 'biology':
        return [
          {
            id: 'bio-lab-1',
            title: 'AP Lab 4: Cellular Respiration in Germinating Peas',
            subtitle: 'Micro-respirometer Manometry',
            description: 'Using potassium hydroxide (KOH) to precipitate CO₂ into solid K₂CO₃, measuring net O₂ consumption rate across germinating vs non-germinating seeds at differing temperatures.',
            keySkills: ['KOH CO2 Precipitation', 'Oxygen Uptake Rate', 'Negative Glass Bead Controls', 'Q10 Temperature Coefficient']
          },
          {
            id: 'bio-lab-2',
            title: 'AP Lab 5: Photosynthetic Flotation of Leaf Disks',
            subtitle: 'Spongy Mesophyll Gas Exchange',
            description: 'Infiltrating leaf disks with sodium bicarbonate (NaHCO₃) to induce sinking, then measuring time to 50% flotation (ET₅₀) as photosynthetic photolysis produces O₂ gas.',
            keySkills: ['ET50 Flotation Rate', 'Photolysis O2 Evolution', 'Bicarbonate Carbon Source', 'Light Intensity Gradients']
          }
        ];
      case 'history':
        return [
          {
            id: 'hist-lab-1',
            title: 'Forensics 1: The HIPP Primary Archival Protocol',
            subtitle: 'Four-Lens Document Cross-Examination',
            description: 'Interrogating primary artifacts through Historical Situation, Intended Audience, Purpose, and Point of View (HIPP) to identify rhetorical incentives and omissions.',
            keySkills: ['Historical Situation', 'Intended Audience Targeting', 'Rhetorical Purpose', 'Point of View Biases']
          },
          {
            id: 'hist-lab-2',
            title: 'Forensics 2: DBQ 7-Point Master Rubric Architecture',
            subtitle: 'AP History High-Score Synthesis',
            description: 'Deconstructing the 7-point DBQ rubric: thesis formulation, historical contextualization, using 6 documents to support claims, outside evidence, and sourcing complexity.',
            keySkills: ['Defensible Thesis', 'Contextualization Preconditions', 'Sourcing 3 Documents', 'Complex Understanding']
          }
        ];
      case 'chemistry':
      default:
        return [
          {
            id: 'chem-lab-1',
            title: 'AP Lab 1: Spectrophotometry & Beer\'s Law Curves',
            subtitle: 'Optical Absorbance & Concentration',
            description: 'Constructing absorbance calibration curves (A = ε·b·c) for colored complexes, evaluating optical errors from fingerprints, cuvette scratches, and wavelength selection.',
            keySkills: ['Beer-Lambert Law', 'Analytical λ_max', 'Solvent Blanking', 'Optical Cuvette Forensics']
          },
          {
            id: 'chem-lab-2',
            title: 'AP Lab 10: Titration Curves & Buffer Capacities',
            subtitle: 'Equilibrium & Half-Equivalence',
            description: 'Measuring pH during weak acid / strong base titrations, demonstrating that pH = pKa at the half-equivalence point where [HA] = [A-].',
            keySkills: ['Titration Inflection', 'Half-Equivalence pH = pKa', 'Buffer Capacity Zones', 'Indicator Selection']
          }
        ];
    }
  }, [selectedSubject]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-accent-950 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0 border-b border-white/10">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {folder.icon}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-accent-500/20 text-accent-300 border border-accent-400/30">
                  {folder.badge}
                </span>
                <span className="text-xs text-slate-300">
                  Tutor: <strong>{folder.tutorName}</strong> ({folder.tutorTitle})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 truncate">
                {folder.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-1">
                {folder.shortDescription}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scalable Tutor Vault Switcher */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <Folder className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Tutor Knowledge Vault:
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(['chemistry', 'algebra', 'biology', 'history'] as const).map(sub => {
              const f = TUTOR_KNOWLEDGE_FOLDERS[sub];
              const isSelected = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(sub);
                    setSelectedUnitFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-accent-600 text-white shadow-xs font-bold'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span className="capitalize">{f.tutorName.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75 font-mono">({f.problemCount} Qs)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Inner Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('problems')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'problems'
                ? 'border-accent-600 text-accent-600 dark:text-accent-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Problems Bank ({folder.problemCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pedagogy')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'pedagogy'
                ? 'border-accent-600 text-accent-600 dark:text-accent-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Pedagogy & Misconceptions ({subjectMisconceptions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('units')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'units'
                ? 'border-accent-600 text-accent-600 dark:text-accent-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curriculum Units & Standards ({folder.units.length} Units)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rag')}
            className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'rag'
                ? 'border-accent-600 text-accent-600 dark:text-accent-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Domain RAG Optimizer ({ragRules.subject})</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-5">
          
          {/* TAB 1: PRACTICE PROBLEMS BANK */}
          {activeTab === 'problems' && (
            <div className="space-y-4">
              {/* Problem Stats Banner */}
              <div className="p-4 rounded-2xl bg-accent-50/80 dark:bg-accent-950/40 border border-accent-100 dark:border-accent-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent-600 text-white font-bold font-mono">
                    {folder.problemCount}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {folder.tutorName}'s sample practice questions
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Hand-written multiple-choice questions with worked explanations, across {folder.units.length} course units.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                    Matching: <strong>{filteredProblems.length}</strong>
                  </span>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Search Bar */}
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords, formulas, or problem #..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Unit Filter */}
                <div className="sm:col-span-4">
                  <select
                    value={selectedUnitFilter}
                    onChange={(e) => setSelectedUnitFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 font-medium"
                  >
                    <option value="all">All {folder.units.length} Units (Complete Vault)</option>
                    {folder.units.map((u) => (
                      <option key={u.id} value={u.unitNumber}>
                        Unit {u.unitNumber}: {u.title} ({u.examWeightPct})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedDifficultyFilter}
                    onChange={(e) => setSelectedDifficultyFilter(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 font-medium"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Target Level)</option>
                    <option value="hard">Hard (Mastery / AP 5)</option>
                  </select>
                </div>
              </div>

              {/* Problems Virtualized List */}
              <div className="space-y-3">
                {filteredProblems.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                    No questions match the current search or unit filter for {folder.tutorName}. Try resetting filters.
                  </div>
                ) : (
                  filteredProblems.slice(0, 50).map((problem) => {
                    const isExpanded = expandedQuestionId === problem.id;

                    return (
                      <div
                        key={problem.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-accent-300 dark:hover:border-accent-700 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-accent-100 dark:bg-accent-950/80 text-accent-800 dark:text-accent-300 font-mono text-[11px] font-bold">
                              #{problem.originalQuestionNumber || problem.id.split('-q')[1]}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                              {problem.passageSnippet}
                            </span>
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <span className={`text-[10px] font-bold uppercase ${
                              problem.difficulty === 'easy'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : problem.difficulty === 'medium'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {problem.difficulty}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {onSelectQuestionForPractice && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectQuestionForPractice(problem);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                                title="Practice this problem in Super Chat"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Quiz Me</span>
                              </button>
                            )}

                            {onAskTutorAboutQuestion && (
                              <button
                                type="button"
                                onClick={() => {
                                  onAskTutorAboutQuestion(problem);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                                title={`Ask ${folder.tutorName} to explain this problem`}
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Explain</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setExpandedQuestionId(isExpanded ? null : problem.id)}
                              className="text-xs text-accent-600 dark:text-accent-400 font-semibold hover:underline px-2 py-1"
                            >
                              {isExpanded ? 'Hide' : 'Details'}
                            </button>
                          </div>
                        </div>

                        {/* Question Text */}
                        <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                          {problem.question}
                        </p>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {problem.options.map((opt) => (
                            <div
                              key={opt.label}
                              className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                                isExpanded && opt.isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-700 shadow-xs flex items-center justify-center font-bold text-[10px] shrink-0">
                                {opt.label}
                              </span>
                              <span className="min-w-0 flex-1 leading-snug">
                                {opt.text}
                              </span>
                              {isExpanded && opt.isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Expanded Explanation */}
                        {isExpanded && (
                          <div className="p-3.5 rounded-xl bg-accent-50/70 dark:bg-slate-800 border border-accent-100 dark:border-accent-900/40 text-xs space-y-1.5 animate-fade-in">
                            <span className="font-bold text-accent-900 dark:text-accent-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
                              <span>{folder.tutorName}'s Step-by-Step Derivation & Rubric Rationale:</span>
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                              {problem.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {filteredProblems.length > 50 && (
                  <div className="text-center py-3 text-xs text-slate-500 font-medium">
                    Showing top 50 of {filteredProblems.length} practice problems. Use unit filters or search to refine.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HIGH SCHOOL PEDAGOGY & MISCONCEPTIONS */}
          {activeTab === 'pedagogy' && (
            <div className="space-y-5">
              {/* Teaching Philosophy Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-500/10 via-accent-500/5 to-transparent border border-accent-200 dark:border-accent-900/60 space-y-2">
                <div className="flex items-center gap-2 text-accent-900 dark:text-accent-300 font-bold text-sm">
                  {tutorPhilosophy.accentIcon}
                  <span>{tutorPhilosophy.title}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {tutorPhilosophy.quote}
                </p>
                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2 flex-wrap border-t border-accent-100 dark:border-accent-900/40">
                  <span>Grade Target: {folder.pedagogyContext.gradeLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Exam Format: {folder.pedagogyContext.examFormat}</span>
                </div>
              </div>

              {/* Core Diagnostic Misconceptions */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>The {subjectMisconceptions.length} Most Pervasive Student Misconceptions & Diagnostic Fixes</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {subjectMisconceptions.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs"
                    >
                      <span className="font-bold text-rose-600 dark:text-rose-400 block">
                        ⚠️ Stumbling Block #{idx + 1}: "{item.title}"
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong>The Error:</strong> {item.error}
                      </p>
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                        {item.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guided Labs / Forensic Explorations */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-accent-500" />
                  <span>Interactive Explorations & Guided Protocol Standards</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {subjectLabs.map((lab) => (
                    <div
                      key={lab.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-xs">
                          {lab.title}
                        </span>
                        <span className="text-[11px] text-accent-600 dark:text-accent-400 font-medium">
                          {lab.subtitle}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {lab.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {lab.keySkills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CURRICULUM UNITS & STANDARDS */}
          {activeTab === 'units' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {folder.tutorName}'s Curricular Blueprint
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Organised across {folder.units.length} course units, with typical exam weightings.
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-accent-600 dark:text-accent-400 font-mono text-sm block">
                    {folder.units.reduce((acc, u) => acc + u.problemCount, 0)} Total Problems
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {folder.units.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-accent-300 dark:hover:border-accent-700 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-accent-600 dark:text-accent-400 font-mono">
                          Unit {unit.unitNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          Weight: {unit.examWeightPct}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                        {unit.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {unit.problemCount} Practice Problems · {unit.topicCount} Subtopics
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block">Core Topics:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-slate-400">
                        {unit.keyTopics.slice(0, 4).map((t, idx) => (
                          <li key={idx} className="truncate">{t}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitFilter(unit.unitNumber);
                        setActiveTab('problems');
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-accent-50 dark:hover:bg-accent-950/60 text-accent-600 dark:text-accent-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Unit Problems</span>
                      <PlayCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DOMAIN RAG OPTIMIZER & INGESTION ARCHITECTURE */}
          {activeTab === 'rag' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400 font-bold text-sm">
                  <Cpu className="w-4 h-4" />
                  <span>Domain RAG Optimizer for {folder.tutorName} ({ragRules.title})</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Standard vector embedding models degrade significantly when retrieving domain-specific academic materials due to arbitrary token splitting of formulas, LaTeX expressions, chemical structures, and historical date boundaries. Our domain RAG rules apply custom pre-retrieval normalization and pedagogical intent boosting.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-accent-600 dark:text-accent-400 block">
                    1. Syntax Normalization
                  </span>
                  <p className="text-slate-500 leading-relaxed">
                    {selectedSubject === 'chemistry' && 'Normalizes Unicode subscripts/superscripts (H₂O, SO₄²⁻) and thermodynamic variables (ΔH, ΔG, ΔS).'}
                    {selectedSubject === 'algebra' && 'Maps LaTeX expressions (\\frac, \\sqrt), powers (x², x³), and inequality symbols (≤, ≥) to uniform tokens.'}
                    {selectedSubject === 'biology' && 'Standardizes nucleotide sequences, codon tables, enzyme nomenclatures, and ATP/ADP phosphorylation ratios.'}
                    {selectedSubject === 'history' && 'Parses century ranges (16th c., 1787, 1865), constitutional amendments (14th Amendment), and treaty citations.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-accent-600 dark:text-accent-400 block">
                    2. Boundary Preservation
                  </span>
                  <p className="text-slate-500 leading-relaxed">
                    {selectedSubject === 'chemistry' && 'Preserves reversible reactions (⇌) and stoichiometric balances across single chunk windows.'}
                    {selectedSubject === 'algebra' && 'Guarantees systems of equations and algebraic factorizations remain uncut across token windows.'}
                    {selectedSubject === 'biology' && 'Keeps biochemical metabolic pathways (glycolysis, Calvin cycle) intact as coherent reaction sets.'}
                    {selectedSubject === 'history' && 'Preserves primary document excerpts alongside their HIPP sourcing metadata.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-accent-600 dark:text-accent-400 block">
                    3. Pedagogy Intent Routing
                  </span>
                  <p className="text-slate-500 leading-relaxed">
                    Detects when educator or student asks about misconceptions, lab protocols, or scoring rubrics, applying a <strong>+0.40</strong> relevance boost to authoritative pedagogical passages.
                  </p>
                </div>
              </div>

              {/* Live Query Simulation Card */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Active Domain Normalization Engine:
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Subject target: <strong className="text-accent-600 dark:text-accent-400 capitalize">{selectedSubject}</strong> · Registered handler: <code>DOMAIN_RAG_REGISTRY.{selectedSubject}</code>
                </p>
                <div className="text-[11px] text-slate-500">
                  Every query directed to {folder.tutorName} in Super Chat passes through this pipeline before vector search, ensuring zero loss of domain terms.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>{folder.icon}</span>
            <span>{folder.title} · Active Master Knowledge Vault</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
