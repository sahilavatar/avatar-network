import { Passage } from '../types';
import { aiWorkerClient } from './aiWorkerClient';
import { EMBEDDING_MODEL } from './modelConfig';
import { idbStore } from './idb';

/**
 * Passage vectors from EmbeddingGemma, kept in memory and persisted to
 * IndexedDB so each passage is embedded once per model, not once per search.
 * Keys include a hash of the text, so edited passages re-embed automatically.
 */
const store = idbStore<number[]>('lumen-embeddings', 'vectors');
const memory = new Map<string, number[]>();

function hashText(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  }
  return (h >>> 0).toString(36);
}

const keyFor = (p: Passage) => `${EMBEDDING_MODEL.id}|${p.id}|${hashText(p.text)}`;

export const documentText = (p: Passage) => `${EMBEDDING_MODEL.documentPrefix(p.section)}${p.text}`;

/** Returns a vector for every passage, embedding only the ones never seen before. */
export async function getPassageVectors(passages: Passage[]): Promise<Map<string, number[]>> {
  const keys = passages.map(keyFor);
  const missingFromMemory = keys.filter((k) => !memory.has(k));

  if (missingFromMemory.length > 0) {
    const stored = await store.getMany(missingFromMemory);
    stored.forEach((vector, key) => memory.set(key, vector));
  }

  const toEmbed = passages.filter((_, i) => !memory.has(keys[i]));
  if (toEmbed.length > 0) {
    const vectors = await aiWorkerClient.embed(toEmbed.map(documentText));
    const entries: [string, number[]][] = toEmbed.map((p, i) => [keyFor(p), vectors[i]]);
    entries.forEach(([key, vector]) => memory.set(key, vector));
    // Vectors are a cache: if saving fails they're simply recomputed next visit
    await store.putMany(entries).catch(() => undefined);
  }

  const result = new Map<string, number[]>();
  passages.forEach((p, i) => {
    const vector = memory.get(keys[i]);
    if (vector) result.set(p.id, vector);
  });
  return result;
}

export async function embedQuery(query: string): Promise<number[]> {
  const [vector] = await aiWorkerClient.embed([`${EMBEDDING_MODEL.queryPrefix}${query}`]);
  return vector;
}
