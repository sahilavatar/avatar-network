/**
 * Backup and restore of everything a student adds. All of it lives only in this browser,
 * so clearing site data would otherwise lose it. The AI model and search vectors are left
 * out: they can be downloaded or rebuilt, and would make the file huge.
 */
import { Conversation, loadConversations, replaceConversations } from './conversations';
import { exportUploads, replaceUploads, StoredUpload } from './vectorStore';

export const BACKUP_FORMAT = 'avatar-network-backup';
export const BACKUP_VERSION = 1;

// localStorage entries a backup carries; anything else in a file is ignored
export const BACKUP_SETTING_KEYS = [
  'lumen_progress_v1',
  'lumen_custom_personas',
  'lumen_custom_subjects',
  'avatar_goals_v1',
  'avatar_skills_v1',
  'avatar_theme'
] as const;

// When this device last saved a backup (not itself backed up)
export const LAST_BACKUP_KEY = 'avatar_last_backup';

export interface Backup {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  uploads: StoredUpload[];
  conversations: Conversation[];
  settings: Partial<Record<(typeof BACKUP_SETTING_KEYS)[number], string>>;
}

function readSettings(): Backup['settings'] {
  const settings: Backup['settings'] = {};
  for (const key of BACKUP_SETTING_KEYS) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) settings[key] = value;
    } catch {
      // Storage unavailable: nothing to back up
    }
  }
  return settings;
}

export async function createBackup(now = new Date()): Promise<Backup> {
  const [uploads, conversations] = await Promise.all([exportUploads(), loadConversations()]);
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), uploads, conversations, settings: readSettings() };
}

export const backupFileName = (now = new Date()) => `avatar-network-backup-${now.toISOString().slice(0, 10)}.json`;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Parses and checks a backup file. Throws an Error with a message fit to show the student. */
export function parseBackup(text: string): Backup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("This file isn't an Avatar Network backup (it isn't valid JSON).");
  }
  if (!isObject(data) || data.format !== BACKUP_FORMAT) throw new Error("This file isn't an Avatar Network backup.");
  if (typeof data.version !== 'number' || data.version > BACKUP_VERSION) {
    throw new Error('This backup was made by a newer version of Avatar Network. Reload the page to update, then try again.');
  }
  const uploads = Array.isArray(data.uploads) ? data.uploads : null;
  const conversations = Array.isArray(data.conversations) ? data.conversations : null;
  if (!uploads || !conversations || !isObject(data.settings)) throw new Error('This backup is incomplete or damaged.');

  const validUpload = (u: unknown): u is StoredUpload =>
    isObject(u) && isObject(u.source) && typeof u.source.id === 'string' && Array.isArray(u.passages);
  const validConversation = (c: unknown): c is Conversation =>
    isObject(c) && typeof c.id === 'string' && typeof c.avatarId === 'string' && Array.isArray(c.messages);
  if (!uploads.every(validUpload) || !conversations.every(validConversation)) throw new Error('This backup is incomplete or damaged.');

  const settings: Backup['settings'] = {};
  for (const key of BACKUP_SETTING_KEYS) {
    const value = data.settings[key];
    if (typeof value === 'string') settings[key] = value;
  }
  return {
    format: BACKUP_FORMAT,
    version: data.version,
    exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : '',
    uploads,
    conversations,
    settings
  };
}

export function describeBackup(b: Backup): string {
  const count = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const date = b.exportedAt ? new Date(b.exportedAt).toLocaleDateString() : 'an unknown date';
  return `${count(b.uploads.length, 'uploaded file')} and ${count(b.conversations.length, 'chat')}, saved on ${date}`;
}

async function writeAll(b: Backup) {
  await replaceUploads(b.uploads);
  await replaceConversations(b.conversations);
  for (const key of BACKUP_SETTING_KEYS) {
    const value = b.settings[key];
    if (value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  }
}

/**
 * Replaces this device's data with the backup. If the browser refuses part of the write
 * (storage full), the previous data is put back and the error rethrown.
 */
export async function restoreBackup(b: Backup): Promise<void> {
  const previous = await createBackup();
  try {
    await writeAll(b);
  } catch (err) {
    await writeAll(previous).catch(() => undefined);
    throw new Error(`Couldn't restore the backup, so nothing was changed. ${err instanceof Error ? err.message : ''}`.trim());
  }
}

export function readLastBackup(): number | null {
  try {
    const v = Number(localStorage.getItem(LAST_BACKUP_KEY));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
}

export function markBackedUp(now = Date.now()) {
  try {
    localStorage.setItem(LAST_BACKUP_KEY, String(now));
  } catch {
    // Storage unavailable; the reminder just stays
  }
}
