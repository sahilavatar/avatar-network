/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { BACKUP_FORMAT, backupFileName, describeBackup, parseBackup } from './backup';

const valid = {
  format: BACKUP_FORMAT,
  version: 1,
  exportedAt: '2026-10-29T12:00:00.000Z',
  uploads: [{ source: { id: 'up-1', title: 'notes.pdf' }, passages: [{ id: 'p1', srcId: 'up-1', text: 'hi' }] }],
  conversations: [{ id: 'c1', avatarId: 'notes', title: 'Hi', createdAt: 1, updatedAt: 1, messages: [] }],
  settings: { avatar_goals_v1: '[]', avatar_theme: 'dark' }
};

describe('parseBackup', () => {
  test('accepts a valid backup', () => {
    const b = parseBackup(JSON.stringify(valid));
    expect(b.uploads).toHaveLength(1);
    expect(b.conversations).toHaveLength(1);
    expect(b.settings.avatar_theme).toBe('dark');
  });

  test('keeps only known settings, so a file cannot write arbitrary storage keys', () => {
    const b = parseBackup(JSON.stringify({ ...valid, settings: { ...valid.settings, lumen_models_ready_v1: 'true', evil: 'x' } }));
    expect(Object.keys(b.settings).sort()).toEqual(['avatar_goals_v1', 'avatar_theme']);
  });

  test('rejects files that are not backups, with a readable message', () => {
    expect(() => parseBackup('not json')).toThrow("isn't valid JSON");
    expect(() => parseBackup('{"hello":1}')).toThrow("isn't an Avatar Network backup");
    expect(() => parseBackup(JSON.stringify({ ...valid, version: 99 }))).toThrow('newer version');
    expect(() => parseBackup(JSON.stringify({ ...valid, uploads: [{ source: {} }] }))).toThrow('damaged');
    expect(() => parseBackup(JSON.stringify({ ...valid, conversations: [{ id: 'c1' }] }))).toThrow('damaged');
  });
});

test('describeBackup and file name', () => {
  expect(describeBackup(parseBackup(JSON.stringify(valid)))).toMatch(/^1 uploaded file and 1 chat, saved on /);
  expect(backupFileName(new Date('2026-10-29T12:00:00Z'))).toBe('avatar-network-backup-2026-10-29.json');
});
