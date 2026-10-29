import { QuizQuestion } from '../types';

/**
 * Sample history practice questions (19), hand-written for Avatar Network across six units.
 * Topic ids carry the unit (hist-u1-…), which the practice folder uses to count questions per unit.
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
    id: `aphist-q${tpl.qNum}`,
    subject: 'history',
    topicId: tpl.topicId,
    type: 'conceptual',
    question: tpl.question,
    options: tpl.options,
    explanation: tpl.explanation,
    passageId: tpl.passageId,
    passageSnippet: `AP History Unit ${tpl.unit}: ${tpl.topic}`,
    difficulty: tpl.difficulty,
    sourceTitle: 'Sample practice questions: History (19)',
    sourceId: 'hist-ap-vault',
    originalQuestionNumber: tpl.qNum
  };
}

export const HISTORY_PROBLEM_BANK: QuizQuestion[] = [
  // ==========================================
  // UNIT 1: GLOBAL NETWORKS & EARLY STATECRAFT (Q1 - Q20)
  // ==========================================
  buildQuestion({
    qNum: 1,
    unit: 1,
    topic: 'Indian Ocean Maritime Commerce',
    topicId: 'hist-u1-trade',
    question: 'Historical Stimulus: "The merchants of Malacca, Cambay, and Calicut calculate their departures precisely by the seasonal reversal of winds, loading their dhows with pepper, silk, and porcelain while waiting in diaspora ports for the monsoon shifts." (Tomé Pires, Suma Oriental, c. 1515)\n\nWhich environmental factor most directly enabled the flourishing of the Indian Ocean trade network described above?',
    options: [
      { label: 'A', text: 'Predictable seasonal monsoon wind patterns that dictated maritime sailing schedules and diasporic merchant settlements', isCorrect: true },
      { label: 'B', text: 'The development of steam-powered navigation across the Red Sea', isCorrect: false },
      { label: 'C', text: 'A single centralized imperial currency enforced by the Ming court', isCorrect: false },
      { label: 'D', text: 'The construction of continuous overland canal networks linking the Mediterranean to Gujarat', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Indian Ocean trade prior to 1750 was defined by ecological maritime rhythms: southwest summer monsoons blew ships northeast toward India and Southeast Asia, while northeast winter monsoons carried them back toward the Swahili Coast and Arabia. This rhythm fostered vibrant diasporic merchant enclaves (Arab, Persian, Jewish, Gujarati) with high degree of cultural diffusion.',
    difficulty: 'easy',
    passageId: 'hist-ped-p1'
  }),
  buildQuestion({
    qNum: 2,
    unit: 1,
    topic: 'Columbian Exchange Demographic Impacts',
    topicId: 'hist-u1-columbian-exchange',
    question: 'Which of the following was the most catastrophic demographic consequence of the Columbian Exchange for indigenous populations in the Americas during the 16th century?',
    options: [
      { label: 'A', text: 'Epidemic devastation caused by Afro-Eurasian pathogens (smallpox, measles, influenza) to which Native Americans had no acquired immunological resistance', isCorrect: true },
      { label: 'B', text: 'Famine caused by the total replacement of native maize with European rye', isCorrect: false },
      { label: 'C', text: 'Mass voluntary emigration to European commercial centers', isCorrect: false },
      { label: 'D', text: 'Immediate eradication of all native languages due to Spanish royal printing edicts', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Centuries of geographic isolation meant Indigenous American populations lacked acquired immunological immunity to Afro-Eurasian crowd pathogens. Historians estimate that within 100 to 150 years of Columbus\'s 1492 landfall, native populations declined by 80% to 90% (the "Great Dying"), profoundly facilitating Spanish and Portuguese imperial conquest and encomienda labor extraction.',
    difficulty: 'easy',
    passageId: 'hist-ped-p1'
  }),
  buildQuestion({
    qNum: 3,
    unit: 1,
    topic: 'Ottoman Devshirme & Imperial Administration',
    topicId: 'hist-u1-ottoman',
    question: 'The Ottoman Empire utilized the devshirme levy system primarily to accomplish which state-building objective?',
    options: [
      { label: 'A', text: 'To recruit an elite, loyal bureaucratic and military corps (Janissaries) beholden directly to the Sultan rather than aristocratic rivals', isCorrect: true },
      { label: 'B', text: 'To convert all provincial subjects to Sunni Islam within three generations', isCorrect: false },
      { label: 'C', text: 'To finance Venetian maritime trading fleets in the eastern Mediterranean', isCorrect: false },
      { label: 'D', text: 'To dismantle traditional Islamic millet autonomy for religious minorities', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Under the devshirme, Christian boys from the Balkans were levied, educated in Istanbul, and converted to Islam to serve as Grand Viziers, provincial governors, or elite Janissary infantry. Because these officials had no hereditary land base or entrenched familial noble ties, their political loyalty belonged exclusively to the Sultan, checking the power of rival Turkish landed nobility.',
    difficulty: 'medium',
    passageId: 'hist-ped-p1'
  }),

  // ==========================================
  // UNIT 2: ENLIGHTENMENT & CONSTITUTIONS (Q21 - Q40)
  // ==========================================
  buildQuestion({
    qNum: 21,
    unit: 2,
    topic: 'John Locke & Natural Rights in the Declaration of Independence',
    topicId: 'hist-u2-locke',
    question: 'Historical Stimulus: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed..."\n\nThomas Jefferson\'s formulation in the 1776 Declaration reflects which core philosophical tenet of John Locke\'s Second Treatise of Civil Government?',
    options: [
      { label: 'A', text: 'The social contract theory holding that legitimate sovereignty arises solely from the consent of the governed to protect fundamental natural rights', isCorrect: true },
      { label: 'B', text: 'Thomas Hobbes\'s defense of absolute monarchical sovereignty to prevent the state of nature', isCorrect: false },
      { label: 'C', text: 'The divine right of magistrates sanctioned through clerical ordination', isCorrect: false },
      { label: 'D', text: 'Jean-Jacques Rousseau\'s complete subordination of individual property to the general will', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Jefferson directly imported John Locke\'s foundational premises: (1) individuals possess natural rights (life, liberty, property/happiness); (2) government is a conditional contract formed to safeguard those rights; and (3) when a government exhibits a long train of abuses that violates this trust, the governed possess the moral right to alter or abolish it.',
    difficulty: 'easy',
    passageId: 'hist-ped-p2'
  }),
  buildQuestion({
    qNum: 22,
    unit: 2,
    topic: 'Federalist No. 10 & Factional Control',
    topicId: 'hist-u2-federalist10',
    question: 'In Federalist No. 10, James Madison argued that the most effective institutional safeguard against the dangers of majority faction in a democratic society is:',
    options: [
      { label: 'A', text: 'Extending the sphere of a large federal republic, multiplying diverse economic interests so no single faction can easily coalesce into a tyrannical majority', isCorrect: true },
      { label: 'B', text: 'Outlawing political parties and interest groups by constitutional amendment', isCorrect: false },
      { label: 'C', text: 'Establishing a small direct democracy modeled on ancient Athenian city-states', isCorrect: false },
      { label: 'D', text: 'Granting the executive branch unilateral veto power over state supreme courts', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Madison argued that the causes of faction are "sown in the nature of man" (especially unequal distribution of property) and cannot be eliminated without destroying liberty. Therefore, a large extended republic controls the effects of faction by sheer geographic and economic diversity: local majorities cannot easily communicate or coordinate across states to oppress minority interests.',
    difficulty: 'medium',
    passageId: 'hist-ped-p2'
  }),
  buildQuestion({
    qNum: 23,
    unit: 2,
    topic: 'The 1787 Constitutional Compromises',
    topicId: 'hist-u2-great-compromise',
    question: 'The Great (Connecticut) Compromise resolved the fundamental deadlock at the 1787 Constitutional Convention by creating:',
    options: [
      { label: 'A', text: 'A bicameral legislature with proportional representation in the House of Representatives and equal representation (two senators) in the Senate', isCorrect: true },
      { label: 'B', text: 'Direct popular election of the President alongside a single-house legislature', isCorrect: false },
      { label: 'C', text: 'The immediate abolition of the international slave trade in exchange for tariff protections', isCorrect: false },
      { label: 'D', text: 'A rotational presidency shared between northern and southern governors', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: The convention stalled between the Virginia Plan (favoring populous states through proportional representation) and the New Jersey Plan (favoring small states through equal state votes). Roger Sherman of Connecticut engineered the dual compromise: the House satisfied population-weighted democracy, while the Senate guaranteed state equality.',
    difficulty: 'easy',
    passageId: 'hist-ped-p2'
  }),
  buildQuestion({
    qNum: 24,
    unit: 2,
    topic: 'The American Revolution: The Stamp Act Crisis & Taxation Without Representation',
    topicId: 'hist-u2-american-revolution-stamp-act',
    question: 'Historical Stimulus: "The Parliament of Great Britain cannot constitutionally impose taxes upon the people of this continent, who are not and cannot be represented in the House of Commons. Such taxation violates the fundamental rights of Englishmen." (Resolutions of the Stamp Act Congress, 1765)\n\nWhy did colonial resistance to the Stamp Act of 1765 mark a critical ideological turning point leading to the American Revolution?',
    options: [
      { label: 'A', text: 'It was the first direct internal tax levied on colonies without local legislative consent, uniting diverse colonies through non-importation boycotts and ideological opposition to Parliament', isCorrect: true },
      { label: 'B', text: 'It forced colonial militias to dissolve immediately and surrender their firearms to British regular officers', isCorrect: false },
      { label: 'C', text: 'It demanded that all colonial governors swear oaths of allegiance to the French monarchy', isCorrect: false },
      { label: 'D', text: 'It prohibited any transatlantic trade with the Caribbean sugar islands', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Prior to 1765, Britain relied primarily on external trade duties under the Navigation Acts (salutary neglect). The Stamp Act was Parliament\'s first direct internal tax on everyday paper documents (contracts, newspapers, wills) in the American colonies to pay off Seven Years\' War debts. Colonists rejected Parliament\'s claim of "virtual representation," forming the Stamp Act Congress, Sons of Liberty, and enforcing widespread non-importation agreements that forced Parliament\'s repeal while solidifying colonial inter-colonial political solidarity.',
    difficulty: 'medium',
    passageId: 'hist-ped-p2'
  }),
  buildQuestion({
    qNum: 25,
    unit: 2,
    topic: 'The American Revolution: Battle of Saratoga & The French Alliance',
    topicId: 'hist-u2-american-revolution-saratoga',
    question: 'The American victory over General John Burgoyne at the Battle of Saratoga (October 1777) is widely characterized by historians as the turning point of the American Revolutionary War primarily because it:',
    options: [
      { label: 'A', text: 'Convinced the French monarchy (Treaty of Alliance of 1778) to provide vital military, financial, and naval assistance to the Continental Army', isCorrect: true },
      { label: 'B', text: 'Led directly to the immediate capture of King George III in London', isCorrect: false },
      { label: 'C', text: 'Concluded all active land combat across the thirteen American states', isCorrect: false },
      { label: 'D', text: 'Forced Spain to immediately surrender its Florida and Louisiana territories to the Continental Congress', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Prior to Saratoga, Benjamin Franklin struggled in Paris to secure formal French intervention because the Bourbon monarchy hesitated to back a losing rebellion. General Horatio Gates and Benedict Arnold\'s decisive victory at Saratoga proved the Continental Army could defeat British regulars in pitched field combat. In early 1778, France signed the Treaty of Amity and Commerce and Treaty of Alliance, transforming an insurrection into an international global war that forced Britain to divert naval forces to protect the English Channel and West Indies, culminating in de Grasse\'s naval blockade at Yorktown.',
    difficulty: 'easy',
    passageId: 'hist-ped-p2'
  }),
  buildQuestion({
    qNum: 26,
    unit: 2,
    topic: 'The American Revolution: Thomas Paine\'s Common Sense & Revolutionary Ideology',
    topicId: 'hist-u2-american-revolution-common-sense',
    question: 'Published in January 1776, Thomas Paine\'s pamphlet "Common Sense" exerted an unprecedented catalytic influence on the American revolutionary movement by:',
    options: [
      { label: 'A', text: 'Rejecting the concept of hereditary monarchy in plain vernacular prose and making the moral and economic case for total colonial independence', isCorrect: true },
      { label: 'B', text: 'Proposing a permanent military dictatorship under General George Washington', isCorrect: false },
      { label: 'C', text: 'Urging colonists to accept British parliamentary taxation in return for seats in the House of Lords', isCorrect: false },
      { label: 'D', text: 'Calling for an alliance with the Russian Empire against Spanish Florida', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Until early 1776, most colonial leaders maintained the legal fiction that Parliament and corrupt ministers were to blame, not King George III, and sought reconciliation within the British Empire. Paine shattered this taboo by directly assailing the crown as a "royal brute" and arguing that an island cannot rule a continent. Written in vigorous biblical and colloquial language accessible to ordinary artisans and farmers, Common Sense sold over 150,000 copies, crystallizing public sentiment for the Declaration of Independence six months later.',
    difficulty: 'medium',
    passageId: 'hist-ped-p2'
  }),
  buildQuestion({
    qNum: 27,
    unit: 2,
    topic: 'The American Revolution: Articles of Confederation & Shays\' Rebellion',
    topicId: 'hist-u2-articles-of-confederation',
    question: 'Which systemic structural weakness in the Articles of Confederation (1781–1789) was most dramatically exposed by Shays\' Rebellion in western Massachusetts (1786–1787)?',
    options: [
      { label: 'A', text: 'The national government lacked constitutional authority to levy taxes directly or raise a federal army to maintain domestic tranquility, creating economic instability', isCorrect: true },
      { label: 'B', text: 'The Articles established an overly powerful supreme court that overturned all state laws', isCorrect: false },
      { label: 'C', text: 'The executive president wielded unilateral authority to declare war without congressional approval', isCorrect: false },
      { label: 'D', text: 'The central government forced all states to adopt a single paper currency backed by gold', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Under the Articles of Confederation, the national government was a "firm league of friendship" with no independent executive branch, no national judiciary, and no power to levy direct taxes or regulate interstate commerce. When debt-ridden Revolutionary War veteran farmers led by Daniel Shays shut down debtor courts in Massachusetts, the Confederation Congress was powerless to send troops. This crisis alarmed nationalists like George Washington and Alexander Hamilton, directly catalyzing the call for the Constitutional Convention in Philadelphia.',
    difficulty: 'hard',
    passageId: 'hist-ped-p2'
  }),

  // ==========================================
  // UNIT 3: CIVIL WAR & RECONSTRUCTION (Q41 - Q60)
  // ==========================================
  buildQuestion({
    qNum: 41,
    unit: 3,
    topic: 'Emancipation Proclamation Constitutional Scope',
    topicId: 'hist-u3-emancipation',
    question: 'Abraham Lincoln\'s Emancipation Proclamation (January 1, 1863) legally liberated enslaved people in which specific geographic jurisdictions?',
    options: [
      { label: 'A', text: 'Exclusively in territories and states currently in active rebellion against the United States, utilizing commander-in-chief war powers', isCorrect: true },
      { label: 'B', text: 'Throughout the entire United States, including loyal Border States (Kentucky, Maryland, Missouri, Delaware)', isCorrect: false },
      { label: 'C', text: 'Only in Union-occupied areas of Tennessee and coastal North Carolina', isCorrect: false },
      { label: 'D', text: 'Exclusively for enslaved individuals who enlisted directly in the Union Navy', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Lincoln derived constitutional authority for the proclamation strictly from his Article II commander-in-chief military powers during wartime to seize enemy property used to wage war. Because the Constitution protected property rights in peace, Lincoln did not touch slavery in the loyal Border States (e.g. Maryland, Missouri) for fear of driving them into secession; total constitutional abolition required the 13th Amendment in 1865.',
    difficulty: 'medium',
    passageId: 'hist-ped-p3'
  }),
  buildQuestion({
    qNum: 42,
    unit: 3,
    topic: 'The 14th Amendment & Equal Protection',
    topicId: 'hist-u3-14th-amendment',
    question: 'The primary constitutional purpose of Section 1 of the Fourteenth Amendment (1868) was to:',
    options: [
      { label: 'A', text: 'Overturn the Dred Scott decision by establishing birthright citizenship and prohibiting states from denying due process or equal protection of the laws', isCorrect: true },
      { label: 'B', text: 'Abolish involuntary servitude throughout the states and territories', isCorrect: false },
      { label: 'C', text: 'Guarantee universal adult voting rights regardless of sex or race', isCorrect: false },
      { label: 'D', text: 'Redistribute confiscated Confederate plantations to formerly enslaved freedmen', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Chief Justice Taney in Dred Scott v. Sandford (1857) held that Black individuals could never be United States citizens. The Fourteenth Amendment fundamentally restructured American federalism: it defined all persons born or naturalized in the U.S. as citizens and prohibited states from depriving any person of life, liberty, or property without due process or denying equal protection.',
    difficulty: 'easy',
    passageId: 'hist-ped-p3'
  }),
  buildQuestion({
    qNum: 43,
    unit: 3,
    topic: 'The Compromise of 1877 & End of Reconstruction',
    topicId: 'hist-u3-reconstruction-end',
    question: 'The informal political resolution of the disputed 1876 presidential election between Rutherford B. Hayes and Samuel Tilden resulted in:',
    options: [
      { label: 'A', text: 'The withdrawal of federal troops from the South, effectively abandoning political protections for freedmen and ushering in the Jim Crow era', isCorrect: true },
      { label: 'B', text: 'The formal repeal of the 15th Amendment by the Southern Democratic caucus', isCorrect: false },
      { label: 'C', text: 'A nationwide military draft to annex Mexican border territories', isCorrect: false },
      { label: 'D', text: 'The partition of Texas into three separate congressional states', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: In the Compromise of 1877, Southern Democrats agreed not to filibuster Hayes\'s certification before the electoral commission in return for the withdrawal of remaining federal occupation troops from South Carolina, Louisiana, and Florida. This ended Radical Reconstruction, leaving state governments under the control of white conservative "Redeemers".',
    difficulty: 'medium',
    passageId: 'hist-ped-p3'
  }),

  // ==========================================
  // UNIT 4: INDUSTRIALIZATION & REFORM (Q61 - Q80)
  // ==========================================
  buildQuestion({
    qNum: 61,
    unit: 4,
    topic: 'Gilded Age Corporate Consolidation',
    topicId: 'hist-u4-monopolies',
    question: 'John D. Rockefeller\'s Standard Oil famously pioneered horizontal integration during the late 19th century by:',
    options: [
      { label: 'A', text: 'Buying out or undercutting competitor oil refineries to control a dominant market share of a single stage of production', isCorrect: true },
      { label: 'B', text: 'Controlling every step from crude drilling to pipeline distribution and retail barrels', isCorrect: false },
      { label: 'C', text: 'Distributing company stock evenly among factory labor unions', isCorrect: false },
      { label: 'D', text: 'Petitioning the federal government to fix interstate freight rates under the ICC', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Horizontal integration involves acquiring or merging with direct rivals operating at the exact same production tier (refining), creating market dominance. Vertical integration (epitomized by Andrew Carnegie in steel) involves owning the entire supply chain from raw iron ore mines, rail cars, coke furnaces, to rolling mills.',
    difficulty: 'easy',
    passageId: 'hist-ped-p4'
  }),
  buildQuestion({
    qNum: 62,
    unit: 4,
    topic: 'Progressive Era Constitutional Amendments',
    topicId: 'hist-u4-progressive-amendments',
    question: 'Which sequence correctly pairs Progressive Era amendments with their respective reforms?',
    options: [
      { label: 'A', text: '16th (Graduated Income Tax), 17th (Direct Election of Senators), 18th (Prohibition), 19th (Women\'s Suffrage)', isCorrect: true },
      { label: 'B', text: '16th (Women\'s Suffrage), 17th (Income Tax), 18th (Senators), 19th (Prohibition)', isCorrect: false },
      { label: 'C', text: '16th (Direct Primary), 17th (Abolition of Poll Taxes), 18th (Suffrage), 19th (Bimetallism)', isCorrect: false },
      { label: 'D', text: '16th (Income Tax), 17th (Equal Rights Amendment), 18th (Civil Service), 19th (Suffrage)', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: The four Progressive Era constitutional amendments (1913-1920) reshaped American political democracy and revenue: 16th (1913, federal income tax), 17th (1913, direct popular election of U.S. Senators replacing state legislative appointment), 18th (1919, nationwide liquor prohibition), and 19th (1920, prohibition of voting denial based on sex).',
    difficulty: 'easy',
    passageId: 'hist-ped-p4'
  }),

  // ==========================================
  // UNIT 5: GLOBAL CONFLICTS & COLD WAR (Q81 - Q100)
  // ==========================================
  buildQuestion({
    qNum: 81,
    unit: 5,
    topic: 'George Kennan & Containment Doctrine',
    topicId: 'hist-u5-containment',
    question: 'George F. Kennan\'s "Long Telegram" (1946) and the subsequent "X Article" established which foundational premise of U.S. Cold War foreign policy?',
    options: [
      { label: 'A', text: 'The Soviet Union was driven by ideological insecurity to expand relentlessly, necessitating vigilant, patient containment at strategic perimeter points', isCorrect: true },
      { label: 'B', text: 'The United States should immediately initiate preemptive nuclear strikes against Soviet command centers (roll-back)', isCorrect: false },
      { label: 'C', text: 'The Soviet Union was fundamentally an economic partner suited for European free-trade integration', isCorrect: false },
      { label: 'D', text: 'The United States should retreat into Western Hemisphere isolationism and dissolve NATO', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Kennan analyzed Soviet conduct as rooted in traditional Russian imperial insecurity combined with Marxist-Leninist dogma. He argued that the USSR was opportunistic rather than suicidal, and that firm political, economic (Marshall Plan), and military containment would eventually cause the internal contradictions of the Soviet system to unravel without global war.',
    difficulty: 'medium',
    passageId: 'hist-ped-p5'
  }),
  buildQuestion({
    qNum: 82,
    unit: 5,
    topic: 'Cuban Missile Crisis & Brinkmanship',
    topicId: 'hist-u5-cuban-missile',
    question: 'During the October 1962 Cuban Missile Crisis, President John F. Kennedy resolved the immediate nuclear standoff with Soviet Premier Nikita Khrushchev by:',
    options: [
      { label: 'A', text: 'Instituting a naval "quarantine" of Cuba while secretly agreeing to withdraw U.S. Jupiter missiles from Turkey in exchange for Soviet missile dismantling in Cuba', isCorrect: true },
      { label: 'B', text: 'Launching a full-scale amphibious invasion of Havana with NATO ground troops', isCorrect: false },
      { label: 'C', text: 'Acceding to Soviet demands for the partition of West Berlin', isCorrect: false },
      { label: 'D', text: 'Submitting the dispute to the International Court of Justice without naval deployment', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Kennedy rejected the military Joint Chiefs\' advice for immediate airstrikes and an invasion. Instead, he deployed a naval "quarantine" (avoiding the belligerent term "blockade"). Secret backchannel diplomacy negotiated by Robert Kennedy and Soviet Ambassador Anatoly Dobrynin sealed the bilateral deal: the USSR publicly dismantled Cuban missiles, while the U.S. pledged not to invade Cuba and quietly removed obsolete Jupiter missiles from Turkey.',
    difficulty: 'medium',
    passageId: 'hist-ped-p5'
  }),

  // ==========================================
  // UNIT 6: CIVIL RIGHTS & CONSTITUTIONAL LAW (Q101 - Q120)
  // ==========================================
  buildQuestion({
    qNum: 101,
    unit: 6,
    topic: 'Brown v. Board of Education (1954)',
    topicId: 'hist-u6-brown-v-board',
    question: 'In the landmark unanimous ruling in Brown v. Board of Education of Topeka (1954), Chief Justice Earl Warren declared that segregated public educational facilities violate the Fourteenth Amendment because:',
    options: [
      { label: 'A', text: '"Separate educational facilities are inherently unequal," generating a sense of inferiority that damages minority children\'s development', isCorrect: true },
      { label: 'B', text: 'State spending per Black student was mathematically lower than spending per white student in Topeka', isCorrect: false },
      { label: 'C', text: 'Segregation violated the interstate commerce clause of Article I', isCorrect: false },
      { label: 'D', text: 'Private school vouchers were held unconstitutional under the establishment clause', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Brown v. Board explicitly dismantled the "separate but equal" doctrine of Plessy v. Ferguson (1896). The Warren Court relied significantly on modern sociological and psychological evidence (the Kenneth and Mamie Clark doll experiments) to establish that state-mandated racial segregation inherently creates psychological stigma and violates the Equal Protection Clause regardless of tangible facilities.',
    difficulty: 'easy',
    passageId: 'hist-ped-p6'
  }),
  buildQuestion({
    qNum: 102,
    unit: 6,
    topic: 'Voting Rights Act of 1965 Mechanism',
    topicId: 'hist-u6-voting-rights-act',
    question: 'The Voting Rights Act of 1965 transformed Southern electoral politics primarily by:',
    options: [
      { label: 'A', text: 'Banning literacy tests and establishing federal oversight (Section 5 preclearance) over jurisdictions with historic voting discrimination', isCorrect: true },
      { label: 'B', text: 'Lowering the constitutional voting age from 21 to 18 across all states', isCorrect: false },
      { label: 'C', text: 'Mandating that all state congressional districts be drawn by nonpartisan computer algorithms', isCorrect: false },
      { label: 'D', text: 'Abolishing the Electoral College in favor of national popular vote tallies', isCorrect: false }
    ],
    explanation: 'Prof. Arthur Sterling\'s Archival Analysis: Following the Selma marches, President Lyndon B. Johnson signed the VRA of 1965 into law. It outlawed discriminatory literacy tests and poll tests, dispatched federal voting registrars to counties with voter participation below 50%, and required covered states to obtain federal "preclearance" from the Department of Justice before changing election laws. Black voter registration surged dramatically within months.',
    difficulty: 'easy',
    passageId: 'hist-ped-p6'
  })
];
