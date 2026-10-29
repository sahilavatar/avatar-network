import { Passage, SourceDocument, SubjectId } from '../types';
import { idbStore } from './idb';

// Key prefix used by earlier versions that kept uploads in localStorage
const STORAGE_PREFIX = 'lumen_v2_';

export interface VectorStoreState {
  passages: Passage[];
  sources: SourceDocument[];
}

/**
 * Split text into semantic chunks with overlap
 */
export function chunkDocumentText(
  text: string,
  docId: string,
  sourceTitle: string,
  subject: SubjectId,
  targetWords: number = 110
): Passage[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const chunks: Passage[] = [];
  let currentWords: string[] = [];
  let chunkIndex = 1;

  for (const para of paragraphs) {
    const sentences = para.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [para];

    for (const sent of sentences) {
      const words = sent.trim().split(/\s+/).filter(Boolean);
      if (currentWords.length + words.length > targetWords && currentWords.length > 20) {
        const chunkText = currentWords.join(' ');
        const passageId = `${docId}-chunk-${chunkIndex++}`;
        chunks.push({
          id: passageId,
          subject,
          srcId: docId,
          sourceTitle,
          section: `Part ${chunkIndex - 1}`,
          text: chunkText,
          tokens: Math.round(chunkText.length / 4),
          category: 'Uploaded Material'
        });
        // 20% overlap
        currentWords = currentWords.slice(Math.floor(currentWords.length * 0.8));
      }
      currentWords.push(...words);
    }
  }

  if (currentWords.length > 10) {
    const chunkText = currentWords.join(' ');
    const passageId = `${docId}-chunk-${chunkIndex}`;
    chunks.push({
      id: passageId,
      subject,
      srcId: docId,
      sourceTitle,
      section: `Part ${chunkIndex}`,
      text: chunkText,
      tokens: Math.round(chunkText.length / 4),
      category: 'Uploaded Material'
    });
  }

  return chunks;
}

export interface StoredUpload {
  source: SourceDocument;
  passages: Passage[];
}

// Uploads live in IndexedDB: localStorage's ~5 MB cap can't hold real PDFs
const uploads = idbStore<StoredUpload>('avatar-network-uploads', 'uploads');

/** Saves one uploaded document with its passages. Throws if the browser refuses to store it. */
export async function saveUpload(source: SourceDocument, passages: Passage[]): Promise<void> {
  await uploads.putMany([[source.id, { source, passages: passages.filter((p) => p.srcId === source.id) }]]);
}

/** Persists a change to an upload's metadata, such as enabling or disabling it */
export async function updateUploadSource(source: SourceDocument): Promise<void> {
  const existing = (await uploads.getMany([source.id])).get(source.id);
  if (existing) await uploads.putMany([[source.id, { ...existing, source }]]);
}

export async function deleteUpload(sourceId: string): Promise<void> {
  await uploads.delete(sourceId);
}

export async function clearUploads(): Promise<void> {
  await uploads.clear();
}

/** Every saved upload as stored, for backups */
export async function exportUploads(): Promise<StoredUpload[]> {
  return uploads.getAll();
}

/** Replaces all saved uploads, for restoring a backup */
export async function replaceUploads(list: StoredUpload[]): Promise<void> {
  await uploads.clear();
  await uploads.putMany(list.map((u) => [u.source.id, u]));
}

/** Loads every saved upload across all notebooks */
export async function loadUploads(): Promise<{ sources: SourceDocument[]; passages: Passage[] }> {
  await migrateLegacyUploads();
  const all = await uploads.getAll();
  return {
    sources: all.map((u) => u.source),
    passages: all.flatMap((u) => u.passages)
  };
}

/** Moves uploads saved by earlier versions (localStorage, per subject) into IndexedDB */
async function migrateLegacyUploads(): Promise<void> {
  let keys: string[];
  try {
    keys = Object.keys(localStorage).filter((k) => k.startsWith(`${STORAGE_PREFIX}sources_`));
  } catch {
    return;
  }

  for (const sourcesKey of keys) {
    const subject = sourcesKey.slice(`${STORAGE_PREFIX}sources_`.length);
    const passagesKey = `${STORAGE_PREFIX}passages_${subject}`;
    try {
      const sources: SourceDocument[] = JSON.parse(localStorage.getItem(sourcesKey) || '[]');
      const passages: (Passage & { embedding?: unknown })[] = JSON.parse(localStorage.getItem(passagesKey) || '[]');
      await uploads.putMany(
        sources
          .filter((src) => src?.id)
          .map((src) => [
            src.id,
            {
              source: { ...src, subject: src.subject || subject },
              // Older builds stored fake hash vectors; real ones live in embeddingCache
              passages: passages
                .filter((p) => p?.srcId === src.id)
                .map(({ embedding: _legacy, ...p }) => ({ ...p, subject: p.subject || subject }))
            }
          ])
      );
      localStorage.removeItem(sourcesKey);
      localStorage.removeItem(passagesKey);
    } catch (err) {
      console.warn(`Could not migrate saved uploads for ${subject}:`, err);
    }
  }
}

/**
 * Calculate total token stats across all enabled documents
 */
export function calculateVectorStorageStats(passages: Passage[], sources: SourceDocument[], subject: SubjectId) {
  const enabledSourceIds = new Set(sources.filter(s => s.subject === subject && s.enabled).map(s => s.id));
  const activePassages = passages.filter(p => p.subject === subject && enabledSourceIds.has(p.srcId));

  const totalTokens = activePassages.reduce((sum, p) => sum + p.tokens, 0);
  const totalPassages = activePassages.length;
  const textbookTokens = activePassages
    .filter(p => {
      const src = sources.find(s => s.id === p.srcId);
      return src?.kind === 'textbook';
    })
    .reduce((sum, p) => sum + p.tokens, 0);

  const notesTokens = activePassages
    .filter(p => {
      const src = sources.find(s => s.id === p.srcId);
      return src?.kind === 'notes';
    })
    .reduce((sum, p) => sum + p.tokens, 0);

  const uploadTokens = activePassages
    .filter(p => {
      const src = sources.find(s => s.id === p.srcId);
      return src?.kind === 'upload';
    })
    .reduce((sum, p) => sum + p.tokens, 0);

  return {
    totalTokens,
    totalPassages,
    textbookTokens,
    notesTokens,
    uploadTokens,
    activeSourcesCount: enabledSourceIds.size
  };
}
