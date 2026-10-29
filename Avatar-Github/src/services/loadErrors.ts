/**
 * Turns the raw errors a model download or load can end with into advice a student can act on.
 * The raw text is still logged to the console for debugging.
 */
export function describeLoadError(raw: string): string {
  if (/quota|storage|disk|no space/i.test(raw)) {
    return 'Your browser ran out of storage space for this site. Free up some disk space, then try again.';
  }
  if (/out of memory|memory access out of bounds|allocation failed|array buffer allocation|Aborted\(\)/i.test(raw)) {
    return 'This device ran out of memory while loading the AI model. Close other tabs and apps, then try again.';
  }
  if (/fetch|network|connection|ERR_|load failed|timed? ?out|offline|aborted/i.test(raw)) {
    return 'The connection dropped. Check your internet, then try again: files that already finished downloading are kept.';
  }
  return `Something went wrong while loading the AI model (${raw}). Try again, or reload the page.`;
}
