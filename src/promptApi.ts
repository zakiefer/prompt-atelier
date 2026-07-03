const DEFAULT_API_BASE = "http://127.0.0.1:8787";
const API_BASE_KEY = "prompt-atelier-api-base";

export function getApiBase() {
  if (typeof window === "undefined") return import.meta.env.VITE_PROMPT_ATELIER_API_BASE || DEFAULT_API_BASE;
  return window.localStorage.getItem(API_BASE_KEY) || import.meta.env.VITE_PROMPT_ATELIER_API_BASE || DEFAULT_API_BASE;
}

export function setApiBase(value: string) {
  if (typeof window === "undefined") return;
  const normalized = value.trim().replace(/\/+$/, "");
  if (normalized) window.localStorage.setItem(API_BASE_KEY, normalized);
  else window.localStorage.removeItem(API_BASE_KEY);
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as T;
  if (!response.ok) {
    const message = typeof payload === "object" && payload && "error" in payload ? String((payload as { error: unknown }).error) : response.statusText;
    throw new Error(message);
  }
  return payload;
}

export type ApiHealth = {
  ok: boolean;
  port: number;
  sqlitePath: string;
  skill: {
    installed: boolean;
    path: string;
    size: number;
    updatedAt: string;
  };
  collections: string[];
};

export type ApiResultImport<TBuildRun, TScreenshot, TLineage> = {
  ok: boolean;
  buildRun: TBuildRun;
  screenshot: TScreenshot | null;
  lineage: TLineage;
  collections: {
    buildRuns: TBuildRun[];
    screenshots: TScreenshot[];
    lineage: TLineage[];
  };
};

export function getApiHealth() {
  return requestJson<ApiHealth>("/api/health");
}

export function getApiCollections() {
  return requestJson<{ collections: Record<string, unknown> }>("/api/collections");
}

export function syncCollections(collections: Record<string, unknown>) {
  return requestJson<{ ok: boolean; collections: Record<string, unknown> }>("/api/collections", {
    method: "POST",
    body: JSON.stringify({ collections }),
  });
}

export function getTrainingSnapshot() {
  return requestJson<Record<string, unknown>>("/api/snapshot");
}

export function installSkill(content: string) {
  return requestJson<{ ok: boolean; skill: ApiHealth["skill"] }>("/api/skill/install", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function runQueue(
  queue: unknown,
  jobId = "",
  options: { agentCommand?: string; capture?: boolean; buildCommand?: string; install?: boolean; scaffold?: boolean } = {},
) {
  return requestJson<{ ok: boolean; parsed: unknown; stdout: string; stderr: string }>("/api/queue/run", {
    method: "POST",
    body: JSON.stringify({ queue, jobId, ...options }),
  });
}

export function captureResult(url: string, out?: string) {
  return requestJson<{ ok: boolean; parsed: unknown; stdout: string; stderr: string }>("/api/capture", {
    method: "POST",
    body: JSON.stringify({ url, out }),
  });
}

export function analyzeScreenshots(files: string[]) {
  return requestJson<{ ok: boolean; parsed: unknown; stdout: string; stderr: string }>("/api/visual/analyze", {
    method: "POST",
    body: JSON.stringify({ files }),
  });
}

export function importResult<TBuildRun, TScreenshot, TLineage>(result: unknown) {
  return requestJson<ApiResultImport<TBuildRun, TScreenshot, TLineage>>("/api/result/import", {
    method: "POST",
    body: JSON.stringify({ result }),
  });
}

export function evaluateWithModel(payload: { prompt: string; memory?: string; context?: unknown; settings?: Record<string, unknown> }) {
  return requestJson<Record<string, unknown>>("/api/model/evaluate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getModelSettings() {
  return requestJson<Record<string, boolean>>("/api/model/settings");
}
