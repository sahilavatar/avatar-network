import { ChatMessage, SubjectId } from '../types';
import { idbStore } from './idb';

/** One chat with one Avatar. Saved on the device and listed under Recents. */
export interface Conversation {
  id: string;
  avatarId: SubjectId;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

const store = idbStore<Conversation>('avatar-network-chats', 'conversations');

export function newConversation(avatarId: SubjectId, firstMessage: string, now = Date.now()): Conversation {
  return {
    id: `chat-${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    avatarId,
    title: titleFrom(firstMessage),
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

/** A short title from the first message, like frontier chat apps */
export function titleFrom(text: string, max = 48): string {
  const firstLine = text.trim().split('\n')[0].replace(/\s+/g, ' ');
  if (!firstLine) return 'New chat';
  return firstLine.length > max ? `${firstLine.slice(0, max - 1).trimEnd()}…` : firstLine;
}

export async function loadConversations(): Promise<Conversation[]> {
  const all = await store.getAll();
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export const saveConversation = (c: Conversation) => store.putMany([[c.id, c]]);
export const deleteConversation = (id: string) => store.delete(id);
export const clearConversations = () => store.clear();
/** Replaces all saved chats, for restoring a backup */
export async function replaceConversations(list: Conversation[]): Promise<void> {
  await store.clear();
  await store.putMany(list.map((c) => [c.id, c]));
}

export interface RecentGroup {
  label: string;
  items: Conversation[];
}

/** Groups chats into Today / Previous 7 days / Older, newest first */
export function groupByRecency(conversations: Conversation[], now = Date.now()): RecentGroup[] {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const today = startOfToday.getTime();
  const weekAgo = today - 7 * 86_400_000;

  const groups: RecentGroup[] = [
    { label: 'Today', items: [] },
    { label: 'Previous 7 days', items: [] },
    { label: 'Older', items: [] }
  ];
  [...conversations]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((c) => {
      const group = c.updatedAt >= today ? groups[0] : c.updatedAt >= weekAgo ? groups[1] : groups[2];
      group.items.push(c);
    });
  return groups.filter((g) => g.items.length > 0);
}
