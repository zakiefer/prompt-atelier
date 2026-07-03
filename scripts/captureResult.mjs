import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function parseViewport(value, fallback) {
  const match = value.match(/^(\d+)x(\d+)$/i);
  if (!match) return fallback;
  return { width: Number(match[1]), height: Number(match[2]) };
}

function runScreenshot(url, file, viewport) {
  const result = spawnSync(
    "npx",
    [
      "playwright",
      "screenshot",
      `--viewport-size=${viewport.width},${viewport.height}`,
      url,
      file,
    ],
    { encoding: "utf8", env: { ...process.env, CI: "1" }, stdio: "pipe", timeout: 20000 },
  );
  const fileCaptured = existsSync(file) && statSync(file).size > 0;
  return {
    ok: result.status === 0 || fileCaptured,
    status: result.status,
    timedOut: Boolean(result.error && result.error.code === "ETIMEDOUT"),
    fileCaptured,
    stdout: result.stdout.trim(),
    stderr: result.error && result.error.code === "ETIMEDOUT" ? "Timed out after 20s while capturing screenshot." : result.stderr.trim(),
  };
}

const url = argValue("--url");
if (!url) {
  console.error("Usage: npm run capture:result -- --url http://127.0.0.1:5173 --out prompt-runs/latest/screenshots");
  process.exit(1);
}

const outDir = resolve(argValue("--out", "prompt-runs/latest/screenshots"));
const desktop = parseViewport(argValue("--desktop", "1440x1000"), { width: 1440, height: 1000 });
const mobile = parseViewport(argValue("--mobile", "390x844"), { width: 390, height: 844 });

mkdirSync(outDir, { recursive: true });

const desktopPath = join(outDir, "desktop.png");
const mobilePath = join(outDir, "mobile.png");
const desktopResult = runScreenshot(url, desktopPath, desktop);
const mobileResult = runScreenshot(url, mobilePath, mobile);
const ok = desktopResult.ok && mobileResult.ok;
const score = ok ? 82 : desktopResult.ok || mobileResult.ok ? 48 : 18;
const now = new Date().toISOString();

const report = {
  url,
  outDir,
  desktop: { path: desktopPath, viewport: desktop, ...desktopResult },
  mobile: { path: mobilePath, viewport: mobile, ...mobileResult },
  score,
  status: ok ? "captured" : "failed",
  notes: ok
    ? [
        "Desktop and mobile screenshots captured.",
        "Import these paths into Prompt Atelier and rate the visual result.",
      ]
    : [
        "One or more screenshots failed. Confirm the dev server URL is reachable.",
        desktopResult.stderr,
        mobileResult.stderr,
      ].filter(Boolean),
  createdAt: now,
};

writeFileSync(join(outDir, "screenshot-result.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
