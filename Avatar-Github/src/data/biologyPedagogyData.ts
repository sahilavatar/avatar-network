import { Passage, SourceDocument } from '../types';

/**
 * Sample teaching material for the Biology Avatar (Dr. Nia Thorne, a fictional persona), written for
 * Avatar Network: course topics, common misconceptions, lab investigations and free-response tips.
 */

export const BIOLOGY_PEDAGOGY_SOURCES: SourceDocument[] = [
  {
    id: 'bio-ced-framework',
    subject: 'biology',
    title: 'Sample guide: Biology course topics & skills',
    shortTitle: 'Biology course topics',
    kind: 'syllabus',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Biology course units, big ideas (evolution, energetics, information, systems) and science practices.'
  },
  {
    id: 'bio-misconceptions-guide',
    subject: 'biology',
    title: 'Sample guide: Common biology misconceptions',
    shortTitle: 'Biology misconceptions',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Diagnostic protocols correcting errors in plant respiration, dominant allele prevalence, teleological evolution, and ATP energetics.'
  },
  {
    id: 'bio-lab-inquiry-manual',
    subject: 'biology',
    title: 'Sample guide: Biology lab investigations',
    shortTitle: 'Biology labs',
    kind: 'notes',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    docSummary: 'Protocols for photosynthesis DCPIP reduction, cellular respiration micro-respirometers, gel electrophoresis, and enzyme kinetics.'
  },
  {
    id: 'bio-ap-vault',
    subject: 'biology',
    title: 'Sample practice questions: Biology (19)',
    shortTitle: 'Biology practice (19)',
    kind: 'textbook',
    author: 'Avatar Network',
    license: 'Sample content written for Avatar Network',
    passagesCount: 0,
    tokens: 0,
    enabled: true,
    isExam: true,
    docSummary: '19 hand-written biology practice questions with explanations.'
  }
];

export const BIOLOGY_PEDAGOGY_PASSAGES: Passage[] = [
  // 1. CED Framework
  {
    id: 'bio-ped-p1',
    subject: 'biology',
    srcId: 'bio-ced-framework',
    sourceTitle: 'Sample guide: Biology course topics & skills',
    section: '§1.1 The 4 Big Ideas and Unit Weighting in AP Biology',
    page: 10,
    text: 'AP Biology curriculum is structured around 4 Big Ideas: Big Idea 1 (Evolution: diversity of life driven by natural selection); Big Idea 2 (Energetics: living systems use energy to maintain order and homeostasis); Big Idea 3 (Information Storage and Transmission: DNA/RNA mechanisms and cellular signaling); and Big Idea 4 (Systems Interactions: emergent properties from molecular complexes to ecosystems). Exam weighting is concentrated in Unit 3 (Cellular Energetics: 12-16%), Unit 6 (Gene Expression and Regulation: 12-16%), and Unit 7 (Natural Selection: 13-20%).',
    tokens: 126,
    category: 'Curriculum & Standards'
  },
  {
    id: 'bio-ped-p2',
    subject: 'biology',
    srcId: 'bio-ced-framework',
    sourceTitle: 'Sample guide: Biology course topics & skills',
    section: '§1.2 The 6 Science Practices in High School Biology',
    page: 26,
    text: 'High school educators must train students in the 6 AP Biology Science Practices: SP 1 (Concept Explanation: describe biological concepts presented in visual representations); SP 2 (Visual Representations: analyze graphs, phylogenetic trees, and diagrams); SP 3 (Question and Method: design controlled experiments and identify negative controls); SP 4 (Representing and Describing Data); SP 5 (Statistical Tests & Math: Chi-Square goodness-of-fit, Hardy-Weinberg, rate calculations); and SP 6 (Argumentation: justify scientific claims with empirical biological evidence).',
    tokens: 122,
    category: 'Pedagogy & Science Practices'
  },

  // 2. Misconceptions
  {
    id: 'bio-misc-p1',
    subject: 'biology',
    srcId: 'bio-misconceptions-guide',
    sourceTitle: 'Sample guide: Common biology misconceptions',
    section: '§2.1 Misconception #1: Plants Do Photosynthesis; Animals Do Respiration',
    page: 18,
    text: 'Pervasive High School Misconception: Students believe plants only perform photosynthesis while animals perform cellular respiration, assuming plants do not need mitochondria or oxygen. Dr. Nia Thorne\'s Remediation: Plants are eukaryotes containing BOTH chloroplasts and mitochondria. Photosynthesis in chloroplasts produces glyceraldehyde-3-phosphate (G3P) and sucrose for carbon storage, but plant cells must respire 24/7 in their mitochondria to generate ATP for root ion uptake, active transport, and protein synthesis. At night, plants consume net O₂ through aerobic cellular respiration.',
    tokens: 128,
    category: 'Student Misconceptions'
  },
  {
    id: 'bio-misc-p2',
    subject: 'biology',
    srcId: 'bio-misconceptions-guide',
    sourceTitle: 'Sample guide: Common biology misconceptions',
    section: '§2.2 Misconception #2: Dominant Alleles Are Always More Prevalent in Populations',
    page: 32,
    text: 'Pervasive High School Misconception: Students assume that because an allele is "dominant," it must naturally spread, predominate, and become common in a gene pool over evolutionary time. Dr. Nia Thorne\'s Remediation: "Dominance" describes an allelic biochemical interaction in heterozygous individuals (one allele masks the phenotypic manifestation of another), NOT reproductive fitness or population frequency. For example, Huntington\'s disease and polydactyly are caused by dominant alleles, yet both exist at very low frequencies (<0.01%) in human populations.',
    tokens: 124,
    category: 'Student Misconceptions'
  },
  {
    id: 'bio-misc-p3',
    subject: 'biology',
    srcId: 'bio-misconceptions-guide',
    sourceTitle: 'Sample guide: Common biology misconceptions',
    section: '§2.3 Misconception #3: Lamarckian Teleology (Organisms Evolve "Because They Need To")',
    page: 46,
    text: 'Pervasive High School Misconception: Students write that bacteria "evolve resistance in order to survive antibiotics" or that giraffes "stretched their necks so their offspring could reach tall leaves." Dr. Nia Thorne\'s Remediation: Natural selection is strictly non-teleological (it has no intentional goal or foresight). Random mutations and sexual recombination introduce pre-existing genetic variation in the population PRIOR to environmental change. When an antibiotic is applied, it acts as a selective agent: individuals already possessing resistance survive and reproduce with higher differential fitness.',
    tokens: 130,
    category: 'Student Misconceptions'
  },
  {
    id: 'bio-misc-p4',
    subject: 'biology',
    srcId: 'bio-misconceptions-guide',
    sourceTitle: 'Sample guide: Common biology misconceptions',
    section: '§2.4 Misconception #4: ATP "Creates" Energy by Snapping Bonds',
    page: 60,
    text: 'Pervasive High School Misconception: Students assert that breaking the terminal phosphoanhydride bond of ATP "releases energy stored in the bond." Dr. Nia Thorne\'s Remediation: Breaking ANY chemical bond is strictly endothermic (requires energy input). The hydrolysis of ATP to ADP + Pi releases net free energy (-30.5 kJ/mol standard ΔG) because the product molecules (ADP and inorganic phosphate Pi) are resonance-stabilized and experience vastly reduced electrostatic repulsion between negatively charged oxygens, releasing more enthalpy upon solvent hydration than was invested to cleave the linkage.',
    tokens: 132,
    category: 'Student Misconceptions'
  },
  {
    id: 'bio-misc-p5',
    subject: 'biology',
    srcId: 'bio-misconceptions-guide',
    sourceTitle: 'Sample guide: Common biology misconceptions',
    section: '§2.5 Misconception #5: Mutations Are Exclusively Deleterious',
    page: 74,
    text: 'Pervasive High School Misconception: Students view all genetic mutations as debilitating diseases or defects. Dr. Nia Thorne\'s Remediation: Mutations are the ultimate and sole source of novel genetic variation in biological lineages. A mutation\'s fitness impact is context-dependent: many point mutations are synonymous (silent) due to codon degeneracy; others are neutral; and some provide critical adaptive advantages in changing environments (e.g., sickle cell heterozygote resistance to malaria, or lactase persistence in pastoral human societies).',
    tokens: 122,
    category: 'Student Misconceptions'
  },

  // 3. Guided Inquiry Labs
  {
    id: 'bio-lab-p1',
    subject: 'biology',
    srcId: 'bio-lab-inquiry-manual',
    sourceTitle: 'Sample guide: Biology lab investigations',
    section: '§3.1 Lab 4: Cellular Respiration in Germinating Peas',
    page: 20,
    text: 'Students use micro-respirometers with non-germinating and germinating peas submerged in water baths. Potassium hydroxide (KOH) is placed at the bottom to precipitate CO₂ into solid K₂CO₃ (2 KOH + CO₂ -> K₂CO₃ + H₂O). As germinating peas consume O₂ gas, container gas volume decreases, drawing a dye droplet inward. Glass beads serve as a negative control for temperature and atmospheric pressure fluctuations.',
    tokens: 108,
    category: 'Inquiry Labs & Protocols'
  },
  {
    id: 'bio-lab-p2',
    subject: 'biology',
    srcId: 'bio-lab-inquiry-manual',
    sourceTitle: 'Sample guide: Biology lab investigations',
    section: '§3.2 Lab 5: Photosynthesis and the Floating Leaf Disk Assay',
    page: 38,
    text: 'Students infiltrate spinach leaf disks with sodium bicarbonate (NaHCO₃) solution, removing gases from the spongy mesophyll until the disks sink. Upon illumination, the light-dependent reactions photolyze water and evolve O₂ gas into the spongy mesophyll lacunae, restoring buoyancy and causing disks to float. The effective time to 50% flotation (ET₅₀) provides a quantitative rate of photosynthetic oxygen evolution.',
    tokens: 104,
    category: 'Inquiry Labs & Protocols'
  }
];
