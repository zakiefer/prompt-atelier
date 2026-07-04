const LOCAL_API_BASE = "http://127.0.0.1:8787";
const API_BASE_KEY = "prompt-atelier-api-base";
const API_TOKEN_KEY = "prompt-atelier-api-token";

function normalizeApiBase(value: string | undefined) {
  return (value || "").trim().replace(/\/+$/, "");
}

function isLoopbackHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function getApiBase() {
  const envBase = normalizeApiBase(import.meta.env.VITE_PROMPT_ATELIER_API_BASE);
  if (typeof window === "undefined") return envBase || LOCAL_API_BASE;
  const storedBase = normalizeApiBase(window.localStorage.getItem(API_BASE_KEY) || "");
  if (storedBase) return storedBase;
  if (envBase) return envBase;
  return isLoopbackHost(window.location.hostname) ? LOCAL_API_BASE : "";
}

export function setApiBase(value: string) {
  if (typeof window === "undefined") return;
  const normalized = normalizeApiBase(value);
  if (normalized) window.localStorage.setItem(API_BASE_KEY, normalized);
  else window.localStorage.removeItem(API_BASE_KEY);
}

export function getApiToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(API_TOKEN_KEY) || "";
}

export function setApiToken(value: string) {
  if (typeof window === "undefined") return;
  const normalized = value.trim();
  if (normalized) window.localStorage.setItem(API_TOKEN_KEY, normalized);
  else window.localStorage.removeItem(API_TOKEN_KEY);
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBase = getApiBase();
  if (!apiBase) {
    throw new Error("Prompt Atelier API is not configured. Set a hosted API base or run the app locally with npm run api.");
  }
  const token = getApiToken();
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  dataDir?: string;
  authRequired?: boolean;
  allowedOrigin?: string;
  rateLimitPerMinute?: number;
  skill: {
    installed: boolean;
    path: string;
    size: number;
    updatedAt: string;
  };
  collections: string[];
};

export type ApiEvent = {
  id: number;
  kind: string;
  detail: unknown;
  createdAt: string;
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

export function getApiEvents(limit = 30) {
  return requestJson<{ ok: boolean; events: ApiEvent[] }>(`/api/events?limit=${limit}`);
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

export function runVisualQa(url: string, out?: string) {
  return requestJson<{ ok: boolean; parsed: unknown; stdout: string; stderr: string }>("/api/visual/qa", {
    method: "POST",
    body: JSON.stringify({ url, out }),
  });
}

export function importResult<TBuildRun, TScreenshot, TLineage>(result: unknown) {
  return requestJson<ApiResultImport<TBuildRun, TScreenshot, TLineage>>("/api/result/import", {
    method: "POST",
    body: JSON.stringify({ result }),
  });
}

export function evaluateWithModel(payload: { prompt: string; memory?: string; context?: unknown; settings?: Record<string, unknown>; imageDataUrl?: string }) {
  return requestJson<Record<string, unknown>>("/api/model/evaluate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createTrainingRun(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/training/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function evaluateWithModelCache(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/model/evaluate-cached", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function analyzeCorpusViaApi(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/corpus/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function runBenchmarkV2ViaApi(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/benchmark/v2", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createEvaluationArtifact(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/artifact/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getModelSettings() {
  return requestJson<Record<string, boolean>>("/api/model/settings");
}
