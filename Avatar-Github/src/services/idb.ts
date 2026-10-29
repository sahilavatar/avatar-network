/**
 * Minimal promise wrapper around one IndexedDB object store with out-of-line keys.
 * Every operation degrades to a no-op (or empty result) when IndexedDB is unavailable,
 * e.g. in some private-browsing modes, so callers never have to special-case it.
 */

const done = (tx: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

export function idbStore<T>(dbName: string, storeName: string) {
  let dbPromise: Promise<IDBDatabase | null> | null = null;

  const open = () => {
    if (!dbPromise) {
      dbPromise = new Promise((resolve) => {
        try {
          const req = indexedDB.open(dbName, 1);
          req.onupgradeneeded = () => req.result.createObjectStore(storeName);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    }
    return dbPromise;
  };

  return {
    async getMany(keys: string[]): Promise<Map<string, T>> {
      const found = new Map<string, T>();
      const db = await open();
      if (!db || keys.length === 0) return found;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      keys.forEach((key) => {
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result !== undefined) found.set(key, req.result as T);
        };
      });
      await done(tx).catch(() => undefined);
      return found;
    },

    async getAll(): Promise<T[]> {
      const db = await open();
      if (!db) return [];
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      await done(tx).catch(() => undefined);
      return (req.result as T[]) || [];
    },

    async putMany(entries: [string, T][]): Promise<void> {
      const db = await open();
      if (!db || entries.length === 0) return;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      entries.forEach(([key, value]) => store.put(value, key));
      await done(tx);
    },

    async delete(key: string): Promise<void> {
      const db = await open();
      if (!db) return;
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(key);
      await done(tx);
    },

    async clear(): Promise<void> {
      const db = await open();
      if (!db) return;
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).clear();
      await done(tx);
    }
  };
}
