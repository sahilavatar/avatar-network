// Deterministic Client-Side Native JavaScript History Timeline Engine
// Eliminates hallucinated historical sequencing with exact chronological ordering, century math, and date intervals

export interface HistoricalEventItem {
  id: string;
  year: number;
  era: 'BCE' | 'CE';
  title: string;
  region: string;
  significance: string;
}

export interface TimelineDeltaResult {
  earlierEvent: string;
  laterEvent: string;
  yearsApart: number;
  centuriesApart: number;
  chronologicalOrder: string[];
  steps: string[];
}

export const getCenturyString = (year: number, era: 'BCE' | 'CE' = 'CE'): string => {
  const c = Math.ceil(Math.abs(year) / 100);
  const suffix = (n: number) => {
    if (n % 10 === 1 && n !== 11) return `${n}st`;
    if (n % 10 === 2 && n !== 12) return `${n}nd`;
    if (n % 10 === 3 && n !== 13) return `${n}rd`;
    return `${n}th`;
  };
  return `${suffix(c)} Century ${era}`;
};

export const calculateHistoricalDistance = (
  year1: number,
  era1: 'BCE' | 'CE',
  name1: string,
  year2: number,
  era2: 'BCE' | 'CE',
  name2: string
): TimelineDeltaResult => {
  // Normalize to integer on timeline where 1 BCE = 0 or -1
  const pos1 = era1 === 'BCE' ? -year1 : year1;
  const pos2 = era2 === 'BCE' ? -year2 : year2;

  const earlier = pos1 <= pos2 ? { name: name1, pos: pos1, year: year1, era: era1 } : { name: name2, pos: pos2, year: year2, era: era2 };
  const later = pos1 <= pos2 ? { name: name2, pos: pos2, year: year2, era: era2 } : { name: name1, pos: pos1, year: year1, era: era1 };

  const delta = Math.abs(pos2 - pos1);
  const centuries = Number((delta / 100).toFixed(1));

  const steps = [
    `Event 1: ${name1} (${year1} ${era1}) → ${getCenturyString(year1, era1)}`,
    `Event 2: ${name2} (${year2} ${era2}) → ${getCenturyString(year2, era2)}`,
    `Chronological Order: ${earlier.name} (${earlier.year} ${earlier.era}) preceded ${later.name} (${later.year} ${later.era})`,
    `Exact Temporal Interval: ${delta} years (${centuries} centuries apart)`
  ];

  return {
    earlierEvent: `${earlier.name} (${earlier.year} ${earlier.era})`,
    laterEvent: `${later.name} (${later.year} ${later.era})`,
    yearsApart: delta,
    centuriesApart: centuries,
    chronologicalOrder: [
      `${earlier.name} (${earlier.year} ${earlier.era})`,
      `${later.name} (${later.year} ${later.era})`
    ],
    steps
  };
};

export const sortHistoricalEvents = (events: HistoricalEventItem[]): HistoricalEventItem[] => {
  return [...events].sort((a, b) => {
    const posA = a.era === 'BCE' ? -a.year : a.year;
    const posB = b.era === 'BCE' ? -b.year : b.year;
    return posA - posB;
  });
};
