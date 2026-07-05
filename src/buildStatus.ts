export type BuildStatusSnapshot = {
  commit: string;
  runId: string;
  runAttempt: string;
  workflow: string;
  deployedAt: string;
  pagesUrl: string;
  lastSmoke: string;
};

export const BUILD_STATUS: BuildStatusSnapshot = {
  commit: import.meta.env.VITE_COMMIT_SHA || "local",
  runId: import.meta.env.VITE_GITHUB_RUN_ID || "",
  runAttempt: import.meta.env.VITE_GITHUB_RUN_ATTEMPT || "",
  workflow: import.meta.env.VITE_WORKFLOW_NAME || "local build",
  deployedAt: import.meta.env.VITE_DEPLOYED_AT || "",
  pagesUrl: import.meta.env.VITE_PAGES_URL || "https://zakiefer.github.io/prompt-atelier/",
  lastSmoke: import.meta.env.VITE_LAST_SMOKE || "local verification pending",
};
