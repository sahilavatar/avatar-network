// Deterministic Client-Side Native JavaScript Biology Engine
// Eliminates Gemma 3 1B hallucinations in genetics crosses, codons, and cellular energetics

export interface PunnettResult {
  parent1: string;
  parent2: string;
  grid: string[][];
  genotypes: Record<string, number>;
  genotypeRatios: string;
  phenotypeRatios: string;
  steps: string[];
}

export interface CodonTranslationResult {
  dnaSequence: string;
  mrnaSequence: string;
  aminoAcids: string[];
  chainString: string;
  steps: string[];
}

// Standard genetic code codon table
export const GENETIC_CODE: Record<string, string> = {
  AUG: 'Met (Start)',
  UUU: 'Phe', UUC: 'Phe',
  UUA: 'Leu', UUG: 'Leu', CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser', AGU: 'Ser', AGC: 'Ser',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  UAU: 'Tyr', UAC: 'Tyr',
  UAA: 'Stop', UAG: 'Stop', UGA: 'Stop',
  CAU: 'His', CAC: 'His',
  CAA: 'Gln', CAG: 'Gln',
  AAU: 'Asn', AAC: 'Asn',
  AAA: 'Lys', AAG: 'Lys',
  GAU: 'Asp', GAC: 'Asp',
  GAA: 'Glu', GAG: 'Glu',
  UGU: 'Cys', UGC: 'Cys',
  UGG: 'Trp',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg', AGA: 'Arg', AGG: 'Arg',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly'
};

export const solveMonohybridPunnett = (p1: string, p2: string, dominantTrait = 'Dominant', recessiveTrait = 'Recessive'): PunnettResult => {
  const g1 = [p1[0] || 'A', p1[1] || 'a'];
  const g2 = [p2[0] || 'A', p2[1] || 'a'];

  const grid: string[][] = [
    ['', g2[0], g2[1]],
    [g1[0], '', ''],
    [g1[1], '', '']
  ];

  const genotypes: Record<string, number> = {};

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const a1 = g1[r];
      const a2 = g2[c];
      // Normalize genotype so uppercase comes first
      const combo = (a1.toUpperCase() === a1 && a2.toLowerCase() === a2)
        ? `${a1}${a2}`
        : (a2.toUpperCase() === a2 && a1.toLowerCase() === a1)
        ? `${a2}${a1}`
        : a1 <= a2 ? `${a1}${a2}` : `${a2}${a1}`;

      grid[r + 1][c + 1] = combo;
      genotypes[combo] = (genotypes[combo] || 0) + 1;
    }
  }

  const genotypeRatios = Object.entries(genotypes)
    .map(([gt, count]) => `${gt}: ${count}/4 (${(count / 4) * 100}%)`)
    .join(', ');

  // Count dominant vs recessive phenotypes
  let dominantCount = 0;
  let recessiveCount = 0;
  for (const [gt, count] of Object.entries(genotypes)) {
    if (gt.split('').some((char) => char === char.toUpperCase() && char !== char.toLowerCase())) {
      dominantCount += count;
    } else {
      recessiveCount += count;
    }
  }

  const phenotypeRatios = `${dominantTrait} (${dominantCount}/4 or ${(dominantCount / 4) * 100}%) : ${recessiveTrait} (${recessiveCount}/4 or ${(recessiveCount / 4) * 100}%)`;

  const steps = [
    `Parent 1 Alleles: ${g1.join(', ')}`,
    `Parent 2 Alleles: ${g2.join(', ')}`,
    `Monohybrid Punnett Matrix Calculated (4 possible outcomes)`,
    `Genotypic Ratio: ${genotypeRatios}`,
    `Phenotypic Ratio: ${phenotypeRatios}`
  ];

  return {
    parent1: p1,
    parent2: p2,
    grid,
    genotypes,
    genotypeRatios,
    phenotypeRatios,
    steps
  };
};

export const translateDnaSequence = (rawDna: string): CodonTranslationResult => {
  const dna = rawDna.toUpperCase().replace(/[^ATCG]/g, '');

  // Transcribe to mRNA: A->U, T->A, C->G, G->C
  const mrna = dna
    .split('')
    .map((nt) => {
      if (nt === 'A') return 'U';
      if (nt === 'T') return 'A';
      if (nt === 'C') return 'G';
      if (nt === 'G') return 'C';
      return 'N';
    })
    .join('');

  // Translate in triplets
  const aminoAcids: string[] = [];
  const steps = [
    `Original DNA Template (3'→5'): ${dna}`,
    `Transcribed mRNA Strand (5'→3'): ${mrna}`
  ];

  for (let i = 0; i < mrna.length - 2; i += 3) {
    const codon = mrna.substring(i, i + 3);
    const aa = GENETIC_CODE[codon] || 'Unknown';
    aminoAcids.push(aa);
    steps.push(`Codon [${codon}] → ${aa}`);
    if (aa === 'Stop') break;
  }

  return {
    dnaSequence: dna,
    mrnaSequence: mrna,
    aminoAcids,
    chainString: aminoAcids.join(' - '),
    steps
  };
};
