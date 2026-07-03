import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function run(command, cwd, timeout = 120000) {
  if (!command) return { skipped: true, status: 0, stdout: "", stderr: "" };
  const result = spawnSync(command, { cwd, encoding: "utf8", shell: true, stdio: "pipe", timeout });
  return {
    skipped: false,
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.error?.message || result.stderr.trim(),
  };
}

function escapeTemplate(text) {
  return text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function writeScaffold(job, runDir) {
  const appDir = join(runDir, "implementation");
  const srcDir = join(appDir, "src");
  mkdirSync(srcDir, { recursive: true });
  writeFileSync(
    join(appDir, "package.json"),
    `${JSON.stringify(
      {
        name: `prompt-run-${job.id}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 80),
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite --host 127.0.0.1",
          build: "tsc -b && vite build",
          preview: "vite preview --host 127.0.0.1",
        },
        dependencies: {
          "@vitejs/plugin-react": "^4.7.0",
          "lucide-react": "^0.468.0",
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          typescript: "^5.9.3",
          vite: "^7.0.2",
        },
        devDependencies: {
          "@types/react": "^18.3.27",
          "@types/react-dom": "^18.3.7",
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(appDir, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${job.variantTitle}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  );
  writeFileSync(join(appDir, "tsconfig.json"), `${JSON.stringify({ compilerOptions: { target: "ES2020", useDefineForClassFields: true, lib: ["DOM", "DOM.Iterable", "ES2020"], allowJs: false, skipLibCheck: true, esModuleInterop: true, allowSyntheticDefaultImports: true, strict: true, forceConsistentCasingInFileNames: true, module: "ESNext", moduleResolution: "Node", resolveJsonModule: true, isolatedModules: true, noEmit: true, jsx: "react-jsx" }, include: ["src"], references: [] }, null, 2)}\n`);
  writeFileSync(
    join(appDir, "src", "main.tsx"),
    `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
  );
  writeFileSync(
    join(appDir, "src", "App.tsx"),
    `const prompt = \`${escapeTemplate(job.promptText.trim())}\`;

export default function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Prompt run scaffold</p>
        <h1>${escapeTemplate(job.variantTitle)}</h1>
        <p>This runnable Vite workspace is ready for a Codex agent to implement the website from the prompt below.</p>
        <a href="/prompt.md">Open prompt</a>
      </section>
      <pre>{prompt}</pre>
    </main>
  );
}
`,
  );
  writeFileSync(
    join(appDir, "src", "styles.css"),
    `* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f6f1; color: #101713; }
.shell { min-height: 100vh; display: grid; grid-template-columns: minmax(260px, 0.8fr) minmax(320px, 1.2fr); gap: 20px; padding: 24px; }
.hero, pre { background: rgba(255,255,255,0.86); border: 1px solid rgba(16,23,19,0.12); border-radius: 12px; box-shadow: 0 24px 80px rgba(16,23,19,0.08); }
.hero { align-content: end; display: grid; padding: 28px; }
.eyebrow { color: #0f7b65; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; }
h1 { font-size: clamp(2rem, 5vw, 4.5rem); line-height: 0.94; letter-spacing: -0.05em; margin: 0 0 16px; }
p { color: #53605a; line-height: 1.55; max-width: 48ch; }
a { align-items: center; background: #101713; border-radius: 999px; color: #fff; display: inline-flex; font-weight: 800; justify-content: center; margin-top: 20px; min-height: 42px; padding: 0 18px; text-decoration: none; width: fit-content; }
pre { margin: 0; overflow: auto; padding: 24px; white-space: pre-wrap; }
@media (max-width: 800px) { .shell { grid-template-columns: 1fr; padding: 12px; } }
`,
  );
  writeFileSync(join(appDir, "prompt.md"), `${job.promptText.trim()}\n`);
  return appDir;
}

function listFiles(root, prefix = "") {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .flatMap((entry) => {
      const fullPath = join(root, entry);
      const relative = prefix ? `${prefix}/${entry}` : entry;
      if (statSync(fullPath).isDirectory()) return listFiles(fullPath, relative);
      return relative;
    })
    .slice(0, 60);
}

const queuePath = resolve(argValue("--queue", "prompt-lab-queue.json"));
const onlyJob = argValue("--job");
const buildCommand = argValue("--build", process.env.PROMPT_LAB_BUILD_COMMAND || "");
const agentCommand = argValue("--agent", process.env.PROMPT_LAB_AGENT_COMMAND || "");
const capture = process.argv.includes("--capture");
const scaffold = process.argv.includes("--scaffold");
const installDeps = process.argv.includes("--install");

if (!existsSync(queuePath)) {
  console.error(`Queue file not found: ${queuePath}`);
  process.exit(1);
}

const payload = JSON.parse(readFileSync(queuePath, "utf8"));
const jobs = Array.isArray(payload.jobs) ? payload.jobs : [];
const selectedJobs = onlyJob ? jobs.filter((job) => job.id === onlyJob) : jobs;

if (!selectedJobs.length) {
  console.error(onlyJob ? `No job found with id: ${onlyJob}` : "Queue has no jobs.");
  process.exit(1);
}

const results = [];

for (const job of selectedJobs) {
  const runDir = resolve(job.runFolder || join("prompt-runs", job.id));
  mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, "prompt.md"), `${job.promptText.trim()}\n`);
  writeFileSync(
    join(runDir, "codex-task.md"),
    `# Autonomous Prompt Lab Job

Build this prompt exactly. Record result URL, screenshots, files changed, errors, and notes.

Job ID: ${job.id}
Variant: ${job.variantTitle}

## Prompt

${job.promptText.trim()}
`,
  );
  writeFileSync(
    join(runDir, "README.md"),
    `# ${job.variantTitle}

Agent-ready prompt lab run folder.

## Files

- prompt.md: the exact website prompt to build.
- codex-task.md: handoff for a fresh Codex thread.
- queue-result.json: generated after this runner completes.

## Workflow

1. Open this folder in a fresh Codex thread.
2. Build the website from prompt.md without changing the prompt intent.
3. Start the local app and record the URL.
4. Capture desktop and mobile screenshots.
5. Update queue-result.json with URL, screenshots, files changed, errors, and notes.
6. Import queue-result.json back into Prompt Atelier.
`,
  );

  const implementationDir = scaffold ? writeScaffold(job, runDir) : "";
  const buildCwd = implementationDir || runDir;
  const agentResult = run(agentCommand, runDir, 300000);
  const installResult = installDeps ? run("npm install", buildCwd, 180000) : { skipped: true, status: 0, stdout: "", stderr: "" };
  const effectiveBuildCommand = buildCommand || (scaffold && installDeps ? "npm run build" : "");
  const buildResult = run(effectiveBuildCommand, buildCwd, 180000);
  const screenshotDir = join(runDir, "screenshots");
  let captureResult = { skipped: true, status: 0, stdout: "", stderr: "" };
  if (capture && job.resultUrl) {
    captureResult = run(`npm run capture:result -- --url ${job.resultUrl} --out ${screenshotDir}`, process.cwd());
  }

  const status = agentResult.status === 0 && installResult.status === 0 && buildResult.status === 0 && captureResult.status === 0 ? "completed" : "failed";
  const result = {
    ...job,
    status,
    runFolder: runDir,
    screenshotUrl: existsSync(join(screenshotDir, "desktop.png")) ? join(screenshotDir, "desktop.png") : "",
    filesChanged: [implementationDir ? `implementation: ${listFiles(implementationDir).join(", ")}` : "", "prompt.md", "codex-task.md", "README.md", "queue-result.json"].filter(Boolean).join("\n"),
    errors: [agentResult.stderr, installResult.stderr, buildResult.stderr, captureResult.stderr].filter(Boolean).join("\n"),
    notes: [
      scaffold ? `Vite implementation scaffold written to ${implementationDir}.` : "Scaffold skipped. Pass --scaffold to create a runnable Vite workspace.",
      agentResult.skipped ? "Agent command skipped. Set PROMPT_LAB_AGENT_COMMAND or pass --agent." : "Agent command executed.",
      installResult.skipped ? "Dependency install skipped. Pass --install to install and enable automatic scaffold build." : "Dependencies installed.",
      buildResult.skipped ? "Build command skipped. Set PROMPT_LAB_BUILD_COMMAND or pass --build." : "Build command executed.",
      captureResult.skipped ? "Capture skipped. Pass --capture to run screenshot capture." : "Capture command executed.",
    ].join("\n"),
    updatedAt: new Date().toISOString(),
  };
  writeFileSync(join(runDir, "queue-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  results.push(result);
}

console.log(JSON.stringify({ queue: queuePath, processed: results.length, results }, null, 2));
