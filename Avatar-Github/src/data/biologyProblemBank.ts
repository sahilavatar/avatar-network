import { QuizQuestion } from '../types';

/**
 * Sample biology practice questions (19), hand-written for Avatar Network across eight units.
 * Topic ids carry the unit (bio-u1-…), which the practice folder uses to count questions per unit.
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
    id: `apbio-q${tpl.qNum}`,
    subject: 'biology',
    topicId: tpl.topicId,
    type: 'conceptual',
    question: tpl.question,
    options: tpl.options,
    explanation: tpl.explanation,
    passageId: tpl.passageId,
    passageSnippet: `AP Biology Unit ${tpl.unit}: ${tpl.topic}`,
    difficulty: tpl.difficulty,
    sourceTitle: 'Sample practice questions: Biology (19)',
    sourceId: 'bio-ap-vault',
    originalQuestionNumber: tpl.qNum
  };
}

export const BIOLOGY_PROBLEM_BANK: QuizQuestion[] = [
  // ==========================================
  // UNIT 1: CHEMISTRY OF LIFE (Q1 - Q16)
  // ==========================================
  buildQuestion({
    qNum: 1,
    unit: 1,
    topic: 'Hydrogen Bonding & Cohesion in Water',
    topicId: 'bio-u1-water',
    question: 'Water exhibits high surface tension and transpirational pull in vascular plants primarily because of which intermolecular property?',
    options: [
      { label: 'A', text: 'Hydrogen bonding between partially negative oxygen and partially positive hydrogen atoms', isCorrect: true },
      { label: 'B', text: 'Covalent peptide bonds formed along the carbon skeleton', isCorrect: false },
      { label: 'C', text: 'Ionic attraction between dissolved mineral salts', isCorrect: false },
      { label: 'D', text: 'Hydrophobic exclusions pushing nonpolar molecules together', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Water is a polar molecule due to oxygen\'s high electronegativity. The resulting dipole allows water molecules to form hydrogen bonds with up to four neighbors, producing cohesion (water-water attraction driving xylem capillary rise) and adhesion (water-cellulose attraction to xylem cell walls).',
    difficulty: 'easy',
    passageId: 'bio-ped-p1'
  }),
  buildQuestion({
    qNum: 2,
    unit: 1,
    topic: 'Protein Structure Levels',
    topicId: 'bio-u1-protein-structure',
    question: 'A mutation alters a single hydrophilic glutamate residue to a hydrophobic valine on the exterior surface of a polypeptide. Which structural level is DIRECTLY altered first, and what is the downstream physiological consequence?',
    options: [
      { label: 'A', text: 'Primary sequence changes first, triggering hydrophobic collapse that alters tertiary folding (as in sickle cell anemia)', isCorrect: true },
      { label: 'B', text: 'Secondary alpha helices unwind into beta sheets exclusively', isCorrect: false },
      { label: 'C', text: 'Peptide bonds between amino acids are cleaved by hydrolysis', isCorrect: false },
      { label: 'D', text: 'Quaternary structure is abolished while tertiary structure remains unaffected', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: The amino acid substitution alters primary structure directly (the covalent sequence of residues). Because valine has a nonpolar aliphatic side chain, placing it in an aqueous exterior causes aberrant hydrophobic interactions, distorting tertiary folding and causing hemoglobin S molecules to aggregate into rigid fibers under low oxygen.',
    difficulty: 'medium',
    passageId: 'bio-ped-p1'
  }),
  buildQuestion({
    qNum: 3,
    unit: 1,
    topic: 'Nucleic Acid Directionality',
    topicId: 'bio-u1-nucleic-acids',
    question: 'During DNA replication and transcription, new nucleotides are covalently joined to which specific chemical moiety of the growing strand?',
    options: [
      { label: 'A', text: 'The free 3\' hydroxyl (-OH) group of the deoxyribose or ribose ring', isCorrect: true },
      { label: 'B', text: 'The free 5\' phosphate group via condensation synthesis', isCorrect: false },
      { label: 'C', text: 'The nitrogenous base ring at the 1\' carbon position', isCorrect: false },
      { label: 'D', text: 'The hydrogen atom at the 2\' position of deoxyribose', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: DNA and RNA polymerases synthesize exclusively in the 5\' to 3\' direction because DNA polymerase requires a free 3\'-OH nucleophile to attack the alpha-phosphate of an incoming deoxynucleoside triphosphate (dNTP), releasing pyrophosphate (PPi) to drive the phosphodiester linkage.',
    difficulty: 'easy',
    passageId: 'bio-ped-p1'
  }),

  // ==========================================
  // UNIT 2: CELL STRUCTURE & TRANSPORT (Q17 - Q32)
  // ==========================================
  buildQuestion({
    qNum: 17,
    unit: 2,
    topic: 'Water Potential & Osmosis',
    topicId: 'bio-u2-water-potential',
    question: 'A plant cell with a solute potential (Ψs) of -0.45 MPa and pressure potential (Ψp) of +0.20 MPa is placed in an open beaker of sucrose solution with Ψs = -0.60 MPa. In which direction will water flow net?',
    options: [
      { label: 'A', text: 'Net water flows OUT of the cell into the beaker (cell total Ψ = -0.25 MPa > beaker Ψ = -0.60 MPa)', isCorrect: true },
      { label: 'B', text: 'Net water flows INTO the cell, increasing turgor pressure', isCorrect: false },
      { label: 'C', text: 'No net movement occurs because the cell is already at osmotic equilibrium', isCorrect: false },
      { label: 'D', text: 'Sucrose molecules rapidly diffuse into the cell until concentrations equalize', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Total water potential Ψ = Ψs + Ψp. For the plant cell: Ψ_cell = -0.45 + 0.20 = -0.25 MPa. For the open beaker: Ψp = 0, so Ψ_beaker = -0.60 + 0 = -0.60 MPa. Water always moves spontaneously from higher (less negative) water potential toward lower (more negative) water potential. Since -0.25 MPa > -0.60 MPa, water exits the cell, inducing plasmolyis.',
    difficulty: 'medium',
    passageId: 'bio-ped-p2'
  }),
  buildQuestion({
    qNum: 18,
    unit: 2,
    topic: 'Endosymbiotic Theory Evidence',
    topicId: 'bio-u2-endosymbiosis',
    question: 'Which piece of empirical evidence most strongly supports the endosymbiotic origin of mitochondria and chloroplasts from ancestral prokaryotes?',
    options: [
      { label: 'A', text: 'They possess circular, non-histone DNA genomes and divide independently by binary fission-like processes', isCorrect: true },
      { label: 'B', text: 'Their inner membranes contain cellulose and chitin structural matrices', isCorrect: false },
      { label: 'C', text: 'They synthesize their own nuclear envelope during eukaryotic mitosis', isCorrect: false },
      { label: 'D', text: 'They rely entirely on cytoplasmic 80S ribosomes for all internal proteins', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Mitochondria and chloroplasts share key prokaryotic homologies: circular double-stranded DNA genomes without histones, prokaryotic-like 70S ribosomes sensitive to bacterial antibiotics (e.g. chloramphenicol), double membranes where the inner leaflet mimics bacterial lipid composition (cardiolipin), and autonomous binary division.',
    difficulty: 'easy',
    passageId: 'bio-ped-p2'
  }),
  buildQuestion({
    qNum: 19,
    unit: 2,
    topic: 'Surface Area-to-Volume Ratio',
    topicId: 'bio-u2-sa-vol',
    question: 'Cell A is a cube with side length 2 µm. Cell B is a cube with side length 6 µm. How does the surface area-to-volume (SA/V) ratio of Cell A compare to Cell B, and what is its physiological significance?',
    options: [
      { label: 'A', text: 'Cell A has SA/V = 3.0 µm⁻¹ while Cell B has 1.0 µm⁻¹; Cell A diffuses nutrients and wastes across its membrane far more efficiently', isCorrect: true },
      { label: 'B', text: 'Cell B has a higher SA/V ratio, allowing it to support higher metabolic rates per unit volume', isCorrect: false },
      { label: 'C', text: 'Both cells have identical SA/V ratios because both are cubic geometries', isCorrect: false },
      { label: 'D', text: 'Cell A will burst due to excessive osmotic influx driven by its small size', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: For a cube, SA = 6s² and V = s³, so SA/V = 6/s. For Cell A (s = 2 µm): SA/V = 6/2 = 3.0 µm⁻¹. For Cell B (s = 6 µm): SA/V = 6/6 = 1.0 µm⁻¹. As linear dimensions increase, volume scales by s³ while surface area scales by s², dramatically reducing membrane transport capacity per unit of cytoplasmic volume.',
    difficulty: 'medium',
    passageId: 'bio-ped-p2'
  }),

  // ==========================================
  // UNIT 3: CELLULAR ENERGETICS (Q33 - Q48)
  // ==========================================
  buildQuestion({
    qNum: 33,
    unit: 3,
    topic: 'Competitive vs Noncompetitive Inhibition',
    topicId: 'bio-u3-enzyme-inhibition',
    question: 'An investigator adds an inhibitor to an enzyme-catalyzed reaction. At saturating substrate concentrations ([S] >> Km), the reaction rate (Vmax) reaches the exact same maximum velocity as the uninhibited control, but the apparent Km increases. What type of inhibitor was added?',
    options: [
      { label: 'A', text: 'A competitive inhibitor that reversibly binds the enzyme\'s active site', isCorrect: true },
      { label: 'B', text: 'A noncompetitive allosteric inhibitor that decreases catalytic turnover (kcat)', isCorrect: false },
      { label: 'C', text: 'An irreversible suicide inhibitor forming covalent adducts', isCorrect: false },
      { label: 'D', text: 'A feedback activator altering enzyme quaternary state', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Competitive inhibitors bind reversibly to the catalytic active site, competing directly with substrate. When substrate concentration is raised high enough, substrate out-competes the inhibitor for active sites, restoring Vmax to 100%. However, achieving half-maximal velocity requires higher [S], shifting apparent Km upward.',
    difficulty: 'medium',
    passageId: 'bio-ped-p3'
  }),
  buildQuestion({
    qNum: 34,
    unit: 3,
    topic: 'Photosynthesis Light Reactions & Chemiosmosis',
    topicId: 'bio-u3-chemiosmosis',
    question: 'If a chemical compound creates proton pores exclusively across the thylakoid membrane (acting as an uncoupler), what immediate effect will occur in an illuminated chloroplast?',
    options: [
      { label: 'A', text: 'Electron transport continues and NADPH is generated, but ATP synthesis ceases', isCorrect: true },
      { label: 'B', text: 'Photolysis of water ceases immediately and oxygen evolution halts', isCorrect: false },
      { label: 'C', text: 'The Calvin cycle rate accelerates because proton accumulation is relieved', isCorrect: false },
      { label: 'D', text: 'Chlorophyll molecules stop absorbing photons in Photosystem II', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Uncouplers dissipate the proton electrochemical gradient (ΔpH) across the thylakoid membrane without directly inhibiting the electron transport chain carriers. Consequently, electrons still flow from H2O to NADP+ (producing O2 and NADPH), but ATP synthase lacks the proton-motive force required to phosphorylate ADP to ATP.',
    difficulty: 'hard',
    passageId: 'bio-ped-p3'
  }),
  buildQuestion({
    qNum: 35,
    unit: 3,
    topic: 'Final Electron Acceptor in Aerobic Respiration',
    topicId: 'bio-u3-cellular-respiration',
    question: 'In eukaryotic cellular respiration, what is the ultimate fate of electrons transferred along the mitochondrial electron transport chain (Complexes I-IV)?',
    options: [
      { label: 'A', text: 'They combine with molecular oxygen (O₂) and protons (H⁺) to form water (H₂O)', isCorrect: true },
      { label: 'B', text: 'They are accepted by NAD⁺ to regenerate NADH in the mitochondrial matrix', isCorrect: false },
      { label: 'C', text: 'They reduce pyruvate into lactic acid during oxidative phosphorylation', isCorrect: false },
      { label: 'D', text: 'They are pumped through ATP synthase to rotate the c-ring catalytic rotor', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Molecular oxygen (O2) is the terminal electron acceptor in aerobic respiration at Complex IV (cytochrome c oxidase). Four electrons and four matrix protons reduce one O2 molecule to form two water molecules: O2 + 4e- + 4H+ -> 2 H2O. Without oxygen, the ETC backs up, NADH accumulates, and the Krebs cycle halts.',
    difficulty: 'easy',
    passageId: 'bio-ped-p3'
  }),

  // ==========================================
  // UNIT 4: CELL COMMUNICATION & CELL CYCLE (Q49 - Q64)
  // ==========================================
  buildQuestion({
    qNum: 49,
    unit: 4,
    topic: 'Signal Transduction Amplification',
    topicId: 'bio-u4-signal-cascade',
    question: 'In a G-protein coupled receptor (GPCR) pathway, how can a single epinephrine hormone molecule stimulate the release of hundreds of millions of glucose molecules from glycogen in a liver cell?',
    options: [
      { label: 'A', text: 'Through an enzymatic phosphorylation cascade where each activated enzyme turns over thousands of downstream substrates', isCorrect: true },
      { label: 'B', text: 'Epinephrine enters the nucleus and transcribes millions of glycogen copies directly', isCorrect: false },
      { label: 'C', text: 'Adenylyl cyclase acts as an ion channel allowing millions of glucose ions to enter', isCorrect: false },
      { label: 'D', text: 'Epinephrine molecules multiply by autocatalysis inside the cytosol', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Multi-step signal transduction cascades provide exponential signal amplification. One active GPCR activates many G-alpha proteins; each G-alpha activates adenylyl cyclase, which synthesizes thousands of cAMP second messengers; cAMP activates Protein Kinase A (PKA); each active kinase phosphorylates multiple downstream kinases (e.g. phosphorylase kinase -> glycogen phosphorylase).',
    difficulty: 'medium',
    passageId: 'bio-ped-p4'
  }),
  buildQuestion({
    qNum: 50,
    unit: 4,
    topic: 'Cyclins and CDKs in Cell Cycle Checkpoints',
    topicId: 'bio-u4-cell-cycle',
    question: 'Progression through the G2/M phase cell cycle checkpoint requires which regulatory molecular event?',
    options: [
      { label: 'A', text: 'Binding of accumulated M-cyclin to Cyclin-Dependent Kinase (CDK) to form active MPF', isCorrect: true },
      { label: 'B', text: 'Continuous synthesis and destruction of CDK enzymes at each checkpoint', isCorrect: false },
      { label: 'C', text: 'Complete replication of homologous chromosomes into haploid tetrads', isCorrect: false },
      { label: 'D', text: 'Degradation of p53 tumor suppressor protein to zero concentration', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: CDK concentrations remain constant throughout the cell cycle. Activity is regulated by the periodic oscillation of cyclin protein levels. During G2, M-cyclin accumulates and binds to CDK, forming Maturation-Promoting Factor (MPF). Active MPF phosphorylates nuclear lamins (triggering nuclear envelope breakdown) and condensins (condensing chromatin). After metaphase, cyclin is ubiquitinated and degraded, turning MPF off.',
    difficulty: 'hard',
    passageId: 'bio-ped-p4'
  }),

  // ==========================================
  // UNIT 5: HEREDITY (Q65 - Q80)
  // ==========================================
  buildQuestion({
    qNum: 65,
    unit: 5,
    topic: 'Dihybrid Cross Independent Assortment',
    topicId: 'bio-u5-mendelian',
    question: 'Two heterozygous pea plants (AaBb × AaBb) are crossed, where gene A and gene B are located on separate, unlinked chromosomes. What fraction of offspring are expected to exhibit the dominant phenotype for gene A and recessive phenotype for gene B?',
    options: [
      { label: 'A', text: '3/16', isCorrect: true },
      { label: 'B', text: '9/16', isCorrect: false },
      { label: 'C', text: '1/16', isCorrect: false },
      { label: 'D', text: '6/16', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: For unlinked genes, events are independent: P(Dominant A) = 3/4 (from AA or Aa); P(Recessive B) = 1/4 (from bb). By the multiplication rule of probability for independent assortment: P(A_ and bb) = (3/4) × (1/4) = 3/16. (Classic 9:3:3:1 phenotypic ratio).',
    difficulty: 'easy',
    passageId: 'bio-ped-p5'
  }),
  buildQuestion({
    qNum: 66,
    unit: 5,
    topic: 'Sex-Linked Pedigree Forensics',
    topicId: 'bio-u5-sex-linked',
    question: 'A phenotypically normal woman whose father had hemophilia A (an X-linked recessive disorder) marries an unaffected male. What is the probability that their first child will be an affected son?',
    options: [
      { label: 'A', text: '1/4 (25%)', isCorrect: true },
      { label: 'B', text: '1/2 (50%)', isCorrect: false },
      { label: 'C', text: '0%', isCorrect: false },
      { label: 'D', text: '1/8 (12.5%)', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Because the woman\'s father had hemophilia (XʰY), she inherited his mutant Xʰ chromosome, making her an obligate carrier: XᴴXʰ. Her husband is unaffected: XᴴY. The punnett cross yields: XᴴXᴴ (normal female, 1/4), XᴴXʰ (carrier female, 1/4), XᴴY (normal male, 1/4), XʰY (affected male, 1/4). The probability of an affected son among all children is 1/4 (or 50% if restricted to male offspring).',
    difficulty: 'medium',
    passageId: 'bio-ped-p5'
  }),

  // ==========================================
  // UNIT 6: GENE EXPRESSION & REGULATION (Q81 - Q96)
  // ==========================================
  buildQuestion({
    qNum: 81,
    unit: 6,
    topic: 'The Lac Operon Negative Control',
    topicId: 'bio-u6-operon',
    question: 'In E. coli, what occurs at the lac operon when lactose is abundant and glucose is scarce?',
    options: [
      { label: 'A', text: 'Allolactose binds the lac repressor causing it to dissociate from the operator, and high cAMP allows CAP to bind the promoter, driving maximal transcription', isCorrect: true },
      { label: 'B', text: 'The repressor binds tightly to the promoter, preventing RNA polymerase from transcribing lacZ', isCorrect: false },
      { label: 'C', text: 'Glucose directly phosphorylates beta-galactosidase to speed lactose cleavage', isCorrect: false },
      { label: 'D', text: 'The entire operon is methylated into condensed heterochromatin', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Dual regulation controls the lac operon. Lactose availability produces inducer allolactose, which alters repressor conformation so it releases the operator (derepression). Low glucose triggers adenylyl cyclase to synthesize cAMP; cAMP binds CAP (catabolite activator protein), which binds upstream of the promoter to assist RNA polymerase recruitment, resulting in high-level transcription.',
    difficulty: 'hard',
    passageId: 'bio-ped-p6'
  }),
  buildQuestion({
    qNum: 82,
    unit: 6,
    topic: 'Eukaryotic Epigenetic Modification',
    topicId: 'bio-u6-epigenetics',
    question: 'How does histone acetylation typically affect gene transcription in eukaryotic cells?',
    options: [
      { label: 'A', text: 'It neutralizes positive charges on lysine residues, loosening chromatin into euchromatin to facilitate transcription factor binding', isCorrect: true },
      { label: 'B', text: 'It condenses chromatin into heterochromatin, silencing downstream promoter regions', isCorrect: false },
      { label: 'C', text: 'It induces point mutations in the TATA box sequence', isCorrect: false },
      { label: 'D', text: 'It causes alternative splicing of pre-mRNA introns', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Histone tails are rich in positively charged lysine amino acids that tightly grip the negatively charged phosphate backbone of DNA. Histone acetyltransferases (HATs) attach acetyl groups, neutralizing the positive charge. This electrostatic relaxation opens chromatin from compact heterochromatin into accessible euchromatin, granting transcription factors and RNA polymerase II access to promoter sequences.',
    difficulty: 'medium',
    passageId: 'bio-ped-p6'
  }),

  // ==========================================
  // UNIT 7: NATURAL SELECTION (Q97 - Q110)
  // ==========================================
  buildQuestion({
    qNum: 97,
    unit: 7,
    topic: 'Hardy-Weinberg Equilibrium Calculations',
    topicId: 'bio-u7-hardy-weinberg',
    question: 'In a large, randomly mating population of wildflowers in Hardy-Weinberg equilibrium, 9% of individuals display the recessive white petal phenotype (aa). What percentage of the population is expected to be heterozygous (Aa) purple carriers?',
    options: [
      { label: 'A', text: '42%', isCorrect: true },
      { label: 'B', text: '49%', isCorrect: false },
      { label: 'C', text: '30%', isCorrect: false },
      { label: 'D', text: '18%', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Given q² = 0.09 (frequency of homozygous recessive aa). Therefore, allele frequency q = √0.09 = 0.30. Because p + q = 1, dominant allele frequency p = 1 - 0.30 = 0.70. The heterozygous frequency is 2pq = 2(0.70)(0.30) = 0.42 or 42%.',
    difficulty: 'easy',
    passageId: 'bio-ped-p7'
  }),
  buildQuestion({
    qNum: 98,
    unit: 7,
    topic: 'Genetic Drift and Bottleneck Effect',
    topicId: 'bio-u7-genetic-drift',
    question: 'A wildfire destroys 98% of an isolated rodent population on an island. The surviving generation exhibits significantly reduced genetic variation and altered allele frequencies compared to the ancestral population. Which evolutionary mechanism produced this change?',
    options: [
      { label: 'A', text: 'Genetic drift through a population bottleneck event', isCorrect: true },
      { label: 'B', text: 'Directional natural selection favoring fire-resistant genotypes', isCorrect: false },
      { label: 'C', text: 'High rates of gene flow from neighboring mainland populations', isCorrect: false },
      { label: 'D', text: 'Balanced polymorphism maintained by heterozygote advantage', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: A population bottleneck is a catastrophic reduction in population size caused by random environmental events rather than differential fitness. The surviving sample is non-representative of the original gene pool due to random sampling error (genetic drift), resulting in fixation or loss of alleles irrespective of adaptive value.',
    difficulty: 'easy',
    passageId: 'bio-ped-p7'
  }),

  // ==========================================
  // UNIT 8: ECOLOGY (Q111 - Q125)
  // ==========================================
  buildQuestion({
    qNum: 111,
    unit: 8,
    topic: 'Trophic Efficiency & 10% Rule',
    topicId: 'bio-u8-trophic-efficiency',
    question: 'In a temperate deciduous forest ecosystem, primary producers generate 20,000 kcal/m²/year of net primary productivity. Approximately how much energy will be incorporated into the biomass of secondary consumers (carnivores feeding on herbivores)?',
    options: [
      { label: 'A', text: '200 kcal/m²/year', isCorrect: true },
      { label: 'B', text: '2,000 kcal/m²/year', isCorrect: false },
      { label: 'C', text: '20 kcal/m²/year', isCorrect: false },
      { label: 'D', text: '10,000 kcal/m²/year', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: Ecological trophic transfer efficiency typically averages ~10% across trophic levels due to metabolic respiration, heat loss, and unconsumed biomass. Primary producers: 20,000 kcal -> Primary consumers (herbivores, 10%): 2,000 kcal -> Secondary consumers (carnivores, 10% of 2,000): 200 kcal/m²/year.',
    difficulty: 'easy',
    passageId: 'bio-ped-p8'
  }),
  buildQuestion({
    qNum: 112,
    unit: 8,
    topic: 'Keystone Species Trophic Cascades',
    topicId: 'bio-u8-keystone-species',
    question: 'When sea otters are experimentally removed from a Pacific kelp forest community, sea urchin populations explode and overgraze kelp beds, transforming the ecosystem into a barren rock substrate. This ecological interaction demonstrates that sea otters act as:',
    options: [
      { label: 'A', text: 'A keystone predator exerting top-down control that preserves biodiversity', isCorrect: true },
      { label: 'B', text: 'A dominant primary producer providing the bulk of community biomass', isCorrect: false },
      { label: 'C', text: 'An invasive competitor disrupting native benthic succession', isCorrect: false },
      { label: 'D', text: 'A pioneer species facilitating mutualistic nitrogen fixation', isCorrect: false }
    ],
    explanation: 'Dr. Nia Thorne\'s Mechanism: A keystone species is an organism that has a disproportionately large impact on community structure relative to its numerical abundance or biomass. By preying upon sea urchins (herbivores), sea otters prevent urchins from decimation of kelp forests, sustaining habitat for hundreds of fish, invertebrate, and marine mammal species in a classic top-down trophic cascade.',
    difficulty: 'easy',
    passageId: 'bio-ped-p8'
  })
];
