/**
 * Removes PDF boilerplate before text is split into passages: running headers and footers
 * repeated on most pages, contents pages, and pages with almost no text. Otherwise vague
 * questions match "Return to Table of Contents © 2017 …" and it gets shown as the source.
 * Works on the extractor's output, one "[Page N]" block per page.
 */

const PAGE_MARKER = /\[Page (\d+)\]\n/g;
// Digits vary between pages (page numbers), so they're ignored when comparing headers
const norm = (w: string) => w.toLowerCase().replace(/\d+/g, '#');

/**
 * Length of the running header (or footer) in words: the opening shared by the most pages,
 * taking the longest such opening. Preferring the most pages stops it from swallowing real
 * text that a few pages happen to start the same way.
 */
function repeatedEdge(pages: string[][], fromEnd: boolean, maxWords = 25): number {
  const minPages = Math.max(3, Math.ceil(pages.length * 0.5));
  if (pages.length < 3) return 0;
  let best = { k: 0, n: 0 };
  for (let k = 3; k <= maxWords; k++) {
    const counts = new Map<string, number>();
    for (const words of pages) {
      if (words.length <= k) continue;
      const key = (fromEnd ? words.slice(-k) : words.slice(0, k)).map(norm).join(' ');
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const n = Math.max(0, ...counts.values());
    if (n >= minPages && n >= best.n) best = { k, n };
  }
  return best.k;
}

const isContentsPage = (text: string) =>
  /\b(table of contents|contents)\b/i.test(text.slice(0, 200)) && ((text.match(/\.{4,}|…{2,}/g) || []).length >= 3 || (text.match(/\b\d{1,3}\b/g) || []).length > text.split(/\s+/).length * 0.25);

export function stripPdfBoilerplate(text: string): string {
  const parts = text.split(PAGE_MARKER);
  // parts: [before, num1, page1, num2, page2, ...]
  if (parts.length < 3) return text.replace(/Return to Table of Contents/gi, '').trim();

  const pages: { num: string; words: string[] }[] = [];
  for (let i = 1; i < parts.length; i += 2) pages.push({ num: parts[i], words: parts[i + 1].trim().split(/\s+/).filter(Boolean) });

  const strip = (fromEnd: boolean) => {
    const k = repeatedEdge(pages.map((p) => p.words), fromEnd);
    if (!k) return;
    const counts = new Map<string, number>();
    pages.forEach((p) => {
      if (p.words.length <= k) return;
      const key = (fromEnd ? p.words.slice(-k) : p.words.slice(0, k)).map(norm).join(' ');
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const header = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    pages.forEach((p) => {
      const edge = (fromEnd ? p.words.slice(-k) : p.words.slice(0, k)).map(norm).join(' ');
      if (edge === header) p.words = fromEnd ? p.words.slice(0, -k) : p.words.slice(k);
    });
  };
  strip(false);
  strip(true);

  const cleaned = pages
    .map((p) => ({ num: p.num, text: p.words.join(' ').replace(/Return to Table of Contents/gi, '').replace(/\s+/g, ' ').trim() }))
    .filter((p) => p.text.length > 0);
  const kept = cleaned.filter((p) => p.text.split(/\s+/).length >= 8 && !isContentsPage(p.text));
  // Never throw away the whole document: if every page is short, keep them all (still without headers)
  const result = kept.length ? kept : cleaned;
  if (result.length === 0) return text;
  return result.map((p) => `[Page ${p.num}]\n${p.text}`).join('\n\n');
}
