const DB_NAME = "prompt-atelier-db";
const DB_VERSION = 1;
const STORE_NAME = "collections";

export type CollectionKey =
  | "userPrompts"
  | "history"
  | "outcomes"
  | "screenshots"
  | "buildRuns"
  | "queueJobs"
  | "lineage"
  | "datasetVersions"
  | "curationDecisions"
  | "modelBatchEvaluations"
  | "pairwiseReviews"
  | "backupSnapshots"
  | "activeWorkspace"
  | "closedLoopRuns"
  | "benchmarkRuns"
  | "claudeHealthChecks"
  | "promptComparisons"
  | "screenshotPromptRuns"
  | "workspacePackRuns";

type StoredCollection<T> = {
  key: CollectionKey;
  value: T;
  updatedAt: string;
};

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "key" });
    };
    request.onerror = () => reject(request.error ?? new Error("Unable to open Prompt Atelier database."));
    request.onsuccess = () => resolve(request.result);
  });
}

async function withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);
    request.onerror = () => reject(request.error ?? new Error("Prompt Atelier database request failed."));
    request.onsuccess = () => resolve(request.result);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Prompt Atelier database transaction failed."));
    };
  });
}

export async function readCollection<T>(key: CollectionKey, fallback: T): Promise<T> {
  try {
    const result = await withStore<StoredCollection<T> | undefined>("readonly", (store) => store.get(key));
    return result?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function writeCollection<T>(key: CollectionKey, value: T): Promise<boolean> {
  try {
    await withStore<IDBValidKey>("readwrite", (store) =>
      store.put({ key, value, updatedAt: new Date().toISOString() } satisfies StoredCollection<T>),
    );
    return true;
  } catch {
    return false;
  }
}

export async function readAllCollections<T extends Partial<Record<CollectionKey, unknown>>>(fallback: T): Promise<T> {
  const entries = await Promise.all(
    (Object.keys(fallback) as CollectionKey[]).map(async (key) => [key, await readCollection(key, fallback[key] ?? [])] as const),
  );
  return Object.fromEntries(entries) as T;
}
