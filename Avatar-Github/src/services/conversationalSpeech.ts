/**
 * Conversational Speech & Natural Tone Optimization Engine
 *
 * Solves the two core issues:
 * 1. AI models and templates defaulting to markdown bold asterisks (**) on every keyword,
 *    bullet heading, or concept title, making dialogue look like an unformatted slide deck.
 * 2. Unnatural, rigid pedagogical phrasing (e.g. "*Socratic Checkpoint:*", "Visual & Conceptual Intuition:")
 *    replacing them with fluid, natural, human high school tutor dialogue.
 */

/**
 * Clean up text to limit excessive asterisks (**) and restore natural, conversational flow.
 */
export function naturalizeConversationalText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove robotic prefix tags and formal section headings
  cleaned = cleaned.replace(/\*Socratic Checkpoint:\*\s*/gi, '');
  cleaned = cleaned.replace(/Socratic Checkpoint:\s*/gi, '');
  cleaned = cleaned.replace(/\*\*Visual & Conceptual Intuition:\*\*\s*/gi, '');
  cleaned = cleaned.replace(/\*\*Step-by-Step Breakdown:\*\*\s*/gi, 'Here is how to think through it step-by-step:\n');
  cleaned = cleaned.replace(/\*\*Computational Derivation:\*\*\s*/gi, 'Here is the step-by-step breakdown:\n');
  cleaned = cleaned.replace(/\*\*Complete Mathematical Proof:\*\*\s*/gi, 'Here is the full derivation:\n');
  cleaned = cleaned.replace(/\*\*Core Concept:\*\*\s*/gi, '');
  cleaned = cleaned.replace(/\*\*Key Details & Mechanism:\*\*\s*/gi, '');
  cleaned = cleaned.replace(/\*\*Practical Takeaway:\*\*\s*/gi, '');
  cleaned = cleaned.replace(/\*\*Key Checkpoint:\*\*\s*/gi, 'Notice that ');
  cleaned = cleaned.replace(/\*\*Exam Forensics[^:]*:\*\*\s*/gi, 'On exams, keep in mind: ');
  cleaned = cleaned.replace(/\*\*Advanced Synthesis:\*\*\s*/gi, 'Looking at the bigger picture: ');

  // 2. Fix nested or malformed bolding like **** or ***
  cleaned = cleaned.replace(/\*{3,}/g, '**');

  // 3. Remove bolding around common filler words, question words, and option labels
  // e.g. **The Core Question**: -> The main question:
  cleaned = cleaned.replace(/\*\*(The Core Question|The Main Point|The Question)\*\*:\s*/gi, 'The main question to ask here is: ');
  cleaned = cleaned.replace(/\*\*(The Correct Answer|Correct Answer)\*\*:\s*/gi, 'The correct choice is ');
  cleaned = cleaned.replace(/\*\*Option\s+([A-D])\*\*:\s*/gi, 'Option $1: ');
  cleaned = cleaned.replace(/\*\*Option\s+([A-D])\*\*/gi, 'Option $1');

  // 4. De-emphasize bolding around single standard vocabulary words or phrases
  // e.g. "a **quadratic function** is" -> "a quadratic function is"
  cleaned = cleaned.replace(/\*\*([A-Za-z0-9\s,\-\/]{1,35})\*\*/g, (match, p1) => {
    const trimmed = p1.trim();
    // Keep bolding if it's a high-impact callout or formula label, otherwise make it clean natural text
    if (/^(Verified Result|Note|Warning|Important|Watch out)/i.test(trimmed)) {
      return `**${trimmed}**`;
    }
    // Convert to unbolded natural text
    return trimmed;
  });

  // 5. Clean up remaining standalone ** artifacts
  cleaned = cleaned.replace(/\*\*\s*\*\*/g, '');

  // 6. Ensure clean spacing between paragraphs
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * System prompt guidelines to include in LLM / Persona instructions
 * to proactively limit markdown bold and maintain natural tone.
 */
export const CONVERSATIONAL_PROMPT_CONSTRAINTS = `
### Conversational Voice & Formatting Rules:
1. Limit markdown bolding (**): Never bold common nouns, verbs, or entire sentences. Never use bold bullet headings like "**Definition:**" or "**Explanation:**".
2. Talk like a real, supportive teacher: Speak in natural, complete paragraphs with warm transitions ("Here's why that happens...", "Notice how...", "Think of it like...").
3. Avoid robotic tags: Do not write "Socratic Checkpoint:", "Curricular Context:", or "Key Takeaway:". Ask your follow-up questions naturally at the end of your explanation.
4. Keep math and science notation clean: Use LaTeX ($...$) for equations, but explain the reasoning in plain, conversational English.
5. Pacing: Break down ideas into conversational sentences rather than walls of bulleted lists with bold prefixes.
`.trim();
