import { Passage, QuizQuestion, SubjectId, SourceDocument, Persona } from '../types';
import { matchStrictTopic, extractPinpointSnippet } from './textSearch';

/**
 * Intelligent Quiz Generator
 * Generates dynamic, grounded quiz questions directly from student-uploaded documents,
 * parsed practice exams, or the curricular base knowledge base.
 */
export function generateQuizFromContext(
  query: string,
  passages: Passage[],
  sources: SourceDocument[],
  subject: SubjectId,
  usedQuestionIds?: Set<string>
): QuizQuestion | null {
  const qLower = query.toLowerCase();

  // 1. Check for specific question number reference in user query (e.g. "question 2", "q3", "problem 1")
  const qNumMatch = qLower.match(/(?:question|q|problem|number|#)\s*(\d+)/i);
  const targetQNum = qNumMatch ? parseInt(qNumMatch[1], 10) : null;

  // 2. Identify candidate sources for this subject
  const subjectSources = sources.filter((s) => s.subject === subject && s.enabled);
  const uploadedSources = subjectSources.filter((s) => s.kind === 'upload');

  // Check if query is explicitly or implicitly referring to an upload:
  // "it", "my upload", "the exam", "the pdf", "vault", "practice test", "my notes", etc.
  const isUploadReferenced =
    qLower.includes('upload') ||
    qLower.includes('exam') ||
    qLower.includes('pdf') ||
    qLower.includes('vault') ||
    qLower.includes('notes') ||
    qLower.includes('test') ||
    qLower.includes(' it') ||
    qLower.startsWith('it') ||
    qLower.includes('this document') ||
    uploadedSources.length > 0;

  // 3. Detect if query is requesting a specific topic (e.g. "American Revolution", "Civil War", "Photosynthesis")
  const cleanedTopicQuery = qLower
    .replace(/(?:quiz me on|test me on|practice question on|ask me about|quiz on|give me a question on|give me a problem on|practice problem on)/gi, '')
    .trim();
  const hasSpecificTopicRequest = cleanedTopicQuery.length > 3 && !['it', 'this', 'upload', 'test', 'exam', 'notes'].includes(cleanedTopicQuery);

  // 4. PRIORITY A: Draw directly from parsed exam questions or curated problem bank sources
  const sourcesWithQuestions = subjectSources.filter((s) => s.parsedQuestions && s.parsedQuestions.length > 0);
  if (sourcesWithQuestions.length > 0) {
    const sortedSources = [...sourcesWithQuestions].sort((a, b) => {
      if (isUploadReferenced) {
        if (a.kind === 'upload' && b.kind !== 'upload') return -1;
        if (b.kind === 'upload' && a.kind !== 'upload') return 1;
      }
      return 0;
    });

    for (const src of sortedSources) {
      const qList = src.parsedQuestions || [];

      // If a specific question number was requested (e.g. "Question 42", "#105"):
      if (targetQNum !== null) {
        const matchQ = qList.find(
          (q) => q.originalQuestionNumber === targetQNum || q.id.endsWith(`-${targetQNum}`) || q.id.endsWith(`q${targetQNum}`)
        );
        if (matchQ) return matchQ;
      }

      // Check if user specifically mentioned a unit (e.g. "Unit 3", "Unit 8")
      const unitMatch = qLower.match(/unit\s*([1-9])/i);
      let candidatePool = qList;
      if (unitMatch) {
        const uNum = unitMatch[1];
        const unitFiltered = qList.filter(q => q.topicId.includes(`u${uNum}`) || q.question.includes(`Unit ${uNum}`));
        if (unitFiltered.length > 0) {
          candidatePool = unitFiltered;
        }
      }

      // STRICT TOPIC MATCHING:
      if (hasSpecificTopicRequest) {
        const strictMatches = candidatePool.filter(q => {
          const fullContent = `${q.question} ${q.topicId} ${q.explanation || ''} ${q.passageSnippet || ''}`;
          const res = matchStrictTopic(cleanedTopicQuery, fullContent);
          if (res.isStrictMatch) return true;

          // Also check explicit multi-word substring match in topic or question
          const qTopic = (q.passageSnippet || q.topicId || '').toLowerCase();
          if (cleanedTopicQuery.split(/\s+/).length >= 2 && qTopic.includes(cleanedTopicQuery)) {
            return true;
          }
          return false;
        });

        if (strictMatches.length > 0) {
          const unasked = strictMatches.filter((q) => !usedQuestionIds || !usedQuestionIds.has(q.id));
          const pool = unasked.length > 0 ? unasked : strictMatches;
          return pool[Math.floor(Math.random() * pool.length)];
        }

        // If the user asked for a specific topic and NO strict match exists in this source,
        // DO NOT fall back to an unrelated question! Continue to next source or return null.
        continue;
      }

      // General request without specific topic: pick from candidate pool
      const unasked = candidatePool.filter((q) => !usedQuestionIds || !usedQuestionIds.has(q.id));
      const pool = unasked.length > 0 ? unasked : candidatePool;
      const selected = pool[Math.floor(Math.random() * pool.length)];
      if (selected) return selected;
    }
  }

  // 5. PRIORITY B: Check if any uploaded passages exist and synthesize a question
  const uploadedPassages = passages.filter(
    (p) => p.subject === subject && (p.srcId.startsWith('up-') || p.category === 'Uploaded Material')
  );

  if (isUploadReferenced && uploadedPassages.length > 0) {
    const passage = uploadedPassages[Math.floor(Math.random() * uploadedPassages.length)];
    const synthesized = synthesizeQuestionFromPassage(passage, subject);
    if (synthesized) return synthesized;
  }

  // 6. PRIORITY C: Match by specific topic query in base knowledge passages
  const eligiblePassages = passages.filter((p) => p.subject === subject);
  if (eligiblePassages.length > 0 && hasSpecificTopicRequest) {
    const topicMatchingPassages = eligiblePassages.filter((p) => {
      const pText = (p.text + ' ' + p.section + ' ' + (p.category || '')).toLowerCase();
      const res = matchStrictTopic(cleanedTopicQuery, pText);
      return res.isStrictMatch;
    });

    if (topicMatchingPassages.length > 0) {
      const chosenPassage = topicMatchingPassages[Math.floor(Math.random() * topicMatchingPassages.length)];
      return synthesizeQuestionFromPassage(chosenPassage, subject);
    }
  }

  // Return null so the general knowledge on-device synthesis engine can generate a targeted question
  return null;
}

/**
 * Synthesize a clean, academically rigorous question from textbook or notes text
 * Distractors are drawn strictly from the relevant domain, NEVER from unrelated subjects!
 */
function synthesizeQuestionFromPassage(passage: Passage, subject: SubjectId): QuizQuestion {
  const sentences = passage.text
    .replace(/([.?!])\s*(?=[A-Z0-9])/g, '$1|')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 240);

  const targetSentence = sentences[Math.floor(Math.random() * sentences.length)] || passage.text.slice(0, 160);

  // Subject-specific vocabulary pools for realistic, contextually relevant distractors
  const subjectTermPools: Record<SubjectId, Record<string, string[]>> = {
    algebra: {
      default: [
        'Discriminant (b² - 4ac)', 'Vertex Form y = a(x - h)² + k', 'Quadratic Formula', 'Parabola Axis of Symmetry',
        'Zero Product Property', 'Difference of Squares', 'Linear Elimination', 'Slope-Intercept Form',
        'Rational Root Theorem', 'Horizontal Asymptote', 'Vertical Asymptote', 'Removable Discontinuity',
        'Logarithmic Power Rule', 'Exponential Growth Constant', 'System of Linear Equations'
      ]
    },
    biology: {
      default: [
        'Photosystem II Photolysis', 'RuBisCO Carbon Fixation', 'Thylakoid Electrochemical Gradient', 'Stroma Calvin Cycle',
        'Cellular Glycolysis', 'Mitochondrial Matrix Krebs Cycle', 'ATP Synthase Chemiosmosis', 'Xylem Lignified Tracheids',
        'Phloem Sieve-Tube Elements', 'DNA Helicase Unwinding', 'DNA Polymerase III 5\' to 3\' Synthesis', 'Okazaki Fragments Ligase',
        'Mendelian Law of Segregation', 'Dihybrid 9:3:3:1 Phenotypic Ratio', 'Natural Selection Differential Fitness'
      ]
    },
    history: {
      default: [
        'Emancipation Proclamation of 1863', 'Battle of Gettysburg', 'Fort Sumter Bombardment', 'Reconstruction 13th Amendment',
        'Fourteenth Amendment Equal Protection', 'Fifteenth Amendment Voting Rights', 'Federalist No. 10 Commercial Republic',
        'Separation of Powers (Montesquieu)', 'Lockean Social Contract Theory', 'Venetian Galley Muda Ledgers',
        'Mare Nostrum Mediterranean Network', 'Overland Silk Road Caravan', 'Normandy D-Day Allied Landings', 'Battle of Midway'
      ]
    },
    chemistry: {
      default: [
        'Hund’s Rule of Maximum Multiplicity', 'Pauli Exclusion Principle', 'Molecular Orbital Destructive Antibonding',
        'Constructive Bonding Orbital', 'Bond Order Calculation', 'Stoichiometric Limiting Reactant',
        'Theoretical Yield Calculation', 'Ideal Gas Law PV = nRT', 'Kinetic Molecular Theory',
        'Electronegativity Periodic Trend', 'First Ionization Energy', 'Atomic Radius Contraction',
        'Enthalpy of Formation (ΔH)', 'Gibbs Free Energy Spontaneity (ΔG)', 'Le Chatelier’s Equilibrium Shift'
      ]
    }
  };

  const pool = subjectTermPools[subject]?.default || subjectTermPools.algebra.default;

  // Find if sentence contains one of our key terms
  let testedTerm = pool.find((term) => {
    const rawWord = term.split(/[\s\(\)]/)[0].toLowerCase();
    return targetSentence.toLowerCase().includes(rawWord);
  });

  if (!testedTerm) {
    // Extract a capitalized technical noun phrase from the sentence
    const capMatches = targetSentence.match(/\b[A-Z][a-z]{3,}(?:\s+[A-Z][a-z]{3,})*\b/g);
    testedTerm = (capMatches && capMatches[0]) || pool[0];
  }

  // Create cloze prompt
  const regex = new RegExp(`\\b${testedTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
  let clozeStem = targetSentence.replace(regex, '__________');

  if (clozeStem === targetSentence) {
    // If exact regex match failed, pick first 2 capitalized words
    const words = targetSentence.split(' ');
    if (words.length > 5) {
      testedTerm = words[Math.floor(words.length / 2)];
      clozeStem = targetSentence.replace(testedTerm, '__________');
    }
  }

  // Pick 3 distractors strictly from the same subject pool
  const distractors = pool
    .filter((t) => t.toLowerCase() !== testedTerm?.toLowerCase())
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const rawOptions = [
    { text: testedTerm, isCorrect: true },
    ...distractors.map((d) => ({ text: d, isCorrect: false }))
  ];

  // Shuffle options
  const correctIdx = Math.floor(Math.random() * 4);
  const [correctOpt] = rawOptions.splice(0, 1);
  rawOptions.splice(correctIdx, 0, correctOpt);

  const options = rawOptions.map((opt, i) => ({
    label: String.fromCharCode(65 + i),
    text: opt.text,
    isCorrect: i === correctIdx
  }));

  return {
    id: `q-dyn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    subject,
    topicId: passage.category || 'Curricular Practice',
    type: 'conceptual',
    question: `Fill in the blank based on ${passage.sourceTitle}: "${clozeStem}"`,
    options,
    explanation: `From ${passage.sourceTitle} (${passage.section}): "${targetSentence}"`,
    passageId: passage.id,
    passageSnippet: targetSentence,
    difficulty: 'medium',
    sourceTitle: passage.sourceTitle
  };
}

/**
 * Curated, hand-written questions for common topics that have no course passage to quiz from.
 * Returns null when the request doesn't match one.
 */
export function findCuratedQuizQuestion(
  query: string,
  persona: Persona
): QuizQuestion | null {
  const qLower = query.toLowerCase();
  const engineSource = 'Avatar Network curated question bank';

  // 1. History: American Revolution
  if (qLower.includes('american revolution') || qLower.includes('revolutionary war') || qLower.includes('stamp act') || qLower.includes('saratoga') || qLower.includes('declaration of independence')) {
    return {
      id: `q-gk-amrev-${Date.now()}`,
      subject: 'history',
      topicId: 'The American Revolution (1765–1783)',
      type: 'conceptual',
      question: `Historical Stimulus: "The turning point of the American Revolutionary War was sealed not in the skirmishes around Philadelphia, but on the forested bluffs overlooking the Hudson River at Saratoga in October 1777."\n\nWhy was the American victory at the Battle of Saratoga the critical geopolitical catalyst for American independence?`,
      options: [
        { label: 'A', text: 'It convinced the French monarchy to formally enter the war as an American ally, securing essential naval power, troops, and loans', isCorrect: true },
        { label: 'B', text: 'It forced Parliament to unconditionally recognize American independence and withdraw all British regular troops', isCorrect: false },
        { label: 'C', text: 'It allowed General Washington to conquer Montreal and absorb Canada as the fourteenth American state', isCorrect: false },
        { label: 'D', text: 'It destroyed the entirety of the British Royal Navy stationed in New York Harbor', isCorrect: false }
      ],
      explanation: `${persona.name}'s Analysis: Before Saratoga, Benjamin Franklin could not convince the French court of Louis XVI to risk war with Britain. The surrender of British General John Burgoyne's 6,000-man army proved the Continental Army was capable of winning conventional field battles. In early 1778, France signed the Treaty of Alliance, turning a colonial rebellion into a global imperial war that forced Britain to defend London and the Caribbean, ultimately leading to the French naval blockade at Yorktown (1781).`,
      difficulty: 'medium',
      passageId: 'gk-amrev-p1',
      sourceTitle: engineSource,
      sourceId: 'lumen-curated-history'
    };
  }

  // 2. History: US Constitution & Enlightenment
  if (qLower.includes('constitution') || qLower.includes('federalist') || qLower.includes('bill of rights') || qLower.includes('1787')) {
    return {
      id: `q-gk-const-${Date.now()}`,
      subject: 'history',
      topicId: 'The Constitutional Convention of 1787',
      type: 'conceptual',
      question: `In Federalist No. 10, James Madison argued that the most effective institutional mechanism for preventing the tyranny of a majority faction in a republic is:`,
      options: [
        { label: 'A', text: 'Extending the sphere of a large republic, multiplying diverse economic and regional interests so no single faction can easily coordinate a majority', isCorrect: true },
        { label: 'B', text: 'Eliminating private property to prevent unequal distributions of wealth', isCorrect: false },
        { label: 'C', text: 'Banning all political associations and newspapers through constitutional decree', isCorrect: false },
        { label: 'D', text: 'Adopting pure direct democracy modeled on the ancient Athenian assembly', isCorrect: false }
      ],
      explanation: `${persona.name}'s Analysis: Madison observed that the latent causes of faction are sewn into human nature. Because you cannot destroy liberty without being worse than the disease, you must control its effects. In an extended republic with millions of citizens across diverse states, factions remain localized and cannot easily combine to oppress minorities.`,
      difficulty: 'medium',
      passageId: 'gk-const-p1',
      sourceTitle: engineSource,
      sourceId: 'lumen-curated-history'
    };
  }

  // 3. History: Civil War & Reconstruction
  if (qLower.includes('civil war') || qLower.includes('lincoln') || qLower.includes('gettysburg') || qLower.includes('emancipation')) {
    return {
      id: `q-gk-civilwar-${Date.now()}`,
      subject: 'history',
      topicId: 'The American Civil War & Emancipation (1861–1865)',
      type: 'conceptual',
      question: `Abraham Lincoln's Emancipation Proclamation (effective January 1, 1863) legally applied to which specific jurisdictions?`,
      options: [
        { label: 'A', text: 'Exclusively to territories and states in active rebellion against the United States, utilizing commander-in-chief wartime powers', isCorrect: true },
        { label: 'B', text: 'All slaveholding areas including loyal border states like Kentucky and Maryland', isCorrect: false },
        { label: 'C', text: 'Only to enslaved people who escaped across Union military picket lines', isCorrect: false },
        { label: 'D', text: 'Exclusively in Washington D.C. and the federal territories', isCorrect: false }
      ],
      explanation: `${persona.name}'s Analysis: Lincoln relied on his Article II commander-in-chief military authority to seize enemy war resources. He deliberately did not touch slavery in loyal border states to avoid driving them into secession. Total legal abolition required the ratification of the 13th Amendment in December 1865.`,
      difficulty: 'medium',
      passageId: 'gk-civilwar-p1',
      sourceTitle: engineSource,
      sourceId: 'lumen-curated-history'
    };
  }

  // 4. Biology: Photosynthesis
  if (qLower.includes('photosynthesis') || qLower.includes('calvin cycle') || qLower.includes('chloroplast') || qLower.includes('light reaction')) {
    return {
      id: `q-gk-photo-${Date.now()}`,
      subject: 'biology',
      topicId: 'Photosynthesis & Solar Bioenergetics',
      type: 'conceptual',
      question: `During the light-dependent reactions of photosynthesis within the thylakoid membrane, what is the primary source of replacement electrons for Photosystem II (P680)?`,
      options: [
        { label: 'A', text: 'The photolysis (splitting) of water molecules, which releases molecular oxygen (O2) and protons (H+)', isCorrect: true },
        { label: 'B', text: 'The reduction of carbon dioxide (CO2) by RuBisCO in the stroma', isCorrect: false },
        { label: 'C', text: 'The oxidation of NADPH in the Calvin cycle', isCorrect: false },
        { label: 'D', text: 'Thermal breakdown of glucose in the mitochondrial matrix', isCorrect: false }
      ],
      explanation: `${persona.name}'s Analysis: When photon absorption excites P680 reaction center chlorophyll molecules in Photosystem II, electrons are passed down the electron transport chain. The oxygen-evolving complex strips replacement electrons from water: 2H2O -> 4H+ + 4e- + O2. This photolysis is the origin of Earth's atmospheric oxygen!`,
      difficulty: 'medium',
      passageId: 'gk-photo-p1',
      sourceTitle: engineSource,
      sourceId: 'lumen-curated-biology'
    };
  }

  // 5. Biology: Cellular Respiration
  if (qLower.includes('respiration') || qLower.includes('glycolysis') || qLower.includes('krebs') || qLower.includes('mitochondria') || qLower.includes('atp')) {
    return {
      id: `q-gk-resp-${Date.now()}`,
      subject: 'biology',
      topicId: 'Cellular Respiration & Chemiosmosis',
      type: 'conceptual',
      question: `In eukaryotic cellular respiration, what is the immediate driving force that powers ATP Synthase to generate ATP during oxidative phosphorylation?`,
      options: [
        { label: 'A', text: 'The proton-motive force (electrochemical H+ gradient) across the inner mitochondrial membrane', isCorrect: true },
        { label: 'B', text: 'Direct covalent transfer of phosphate groups from glucose', isCorrect: false },
        { label: 'C', text: 'The active transport of sodium-potassium ATPase pumps in the cytosol', isCorrect: false },
        { label: 'D', text: 'Enzymatic cleavage of carbon dioxide in the citric acid cycle', isCorrect: false }
      ],
      explanation: `${persona.name}'s Analysis: As high-energy electrons from NADH and FADH2 traverse the electron transport chain complexes (I, III, IV), protons are pumped into the intermembrane space. The resulting proton gradient rushes back into the mitochondrial matrix through ATP Synthase via chemiosmosis, inducing rotary conformational changes that phosphorylate ADP into ATP.`,
      difficulty: 'medium',
      passageId: 'gk-resp-p1',
      sourceTitle: engineSource,
      sourceId: 'lumen-curated-biology'
    };
  }

  // 6. Algebra: Quadratic Equations & Quadratics
  if (qLower.includes('quadratic') || qLower.includes('discriminant') || qLower.includes('parabola') || qLower.includes('vertex')) {
    return {
      id: `q-gk-quad-${Date.now()}`,
      subject: 'algebra',
      topicId: 'Quadratic Functions & The Discriminant',
      type: 'conceptual',
      question: `For the quadratic equation ax^2 + bx + c = 0, what does a negative discriminant (b^2 - 4ac < 0) tell us about the graph of y = ax^2 + bx + c?`,
      options: [
        { label: 'A', text: 'The parabola has no real x-intercepts and lies entirely above or below the x-axis, yielding two complex conjugate roots', isCorrect: true },
        { label: 'B', text: 'The parabola passes through the origin (0, 0) with a slope of zero', isCorrect: false },
        { label: 'C', text: 'The parabola has exactly one repeated real rational root at its vertex', isCorrect: false },
        { label: 'D', text: 'The parabola is inverted into a hyperbola', isCorrect: false }
      ],
      explanation: `${persona.name}'s Analysis: Under the quadratic formula x = (-b +- sqrt(b^2 - 4ac)) / (2a), the square root of a negative value produces imaginary units (+- i). Geometrically, this means the parabola never intersects the real x-axis, remaining strictly above (if a > 0) or below (if a < 0).`,
      difficulty: 'easy',
      passageId: 'gk-quad-p1',
      sourceTitle: engineSource,
      sourceId: 'lumen-curated-algebra'
    };
  }

  return null;
}

