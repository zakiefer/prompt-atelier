import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const next = process.argv[index + 1];
  if (next && !next.startsWith("--")) {
    args.set(key, next);
    index += 1;
  } else {
    args.set(key, "true");
  }
}

const baseUrl = args.get("url") || "http://127.0.0.1:4173/";
const outDir = resolve(args.get("out") || "output/playwright/visual-regression");
const readyTimeoutMs = Number(args.get("ready-timeout-ms") || 45_000);
const screenshots = [];
const consoleErrors = [];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on("console", (message) => {
  if (message.type() === "error") {
    consoleErrors.push(message.text());
  }
});
page.on("pageerror", (error) => {
  consoleErrors.push(error.message);
});

try {
  await goto(page, baseUrl);
  await capture(page, "learner-compose", "Paste, score, improve, battle, prove, export.");
  await openLearnerTab(page, "Review");
  await capture(page, "learner-review", "Prompt diff editor");
  await openLearnerTab(page, "Export");
  await capture(page, "learner-export", "Export center");

  const trainUrl = new URL(baseUrl);
  trainUrl.searchParams.set("tab", "train");
  await goto(page, trainUrl.toString());
  await page.waitForFunction(() => (globalThis.document.body.textContent || "").includes("Train focus summary"), null, { timeout: readyTimeoutMs });
  await capture(page, "train-first-viewport", "Train focus summary");

  await page.setViewportSize({ width: 390, height: 900 });
  await goto(page, baseUrl);
  await capture(page, "learner-mobile-compose", "Make me a website prompt");

  const actionableConsoleErrors = consoleErrors.filter((message) => !/Failed to load resource: the server responded with a status of 401/i.test(message));
  if (actionableConsoleErrors.length) {
    throw new Error(`Visual regression smoke saw console/page errors: ${actionableConsoleErrors.slice(0, 5).join(" | ")}`);
  }

  const manifest = {
    ok: true,
    url: baseUrl,
    checkedAt: new Date().toISOString(),
    ignoredConsoleErrors: consoleErrors.length - actionableConsoleErrors.length,
    screenshots,
  };
  await writeFile(join(outDir, "latest.json"), JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify(manifest, null, 2));
} finally {
  await context.close();
  await browser.close();
}

async function goto(targetPage, url) {
  await targetPage.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await targetPage.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => undefined);
}

async function openLearnerTab(targetPage, label) {
  const button = targetPage.locator(".learner-jump-nav button").filter({ hasText: new RegExp(`^\\s*\\d*\\s*${label}`) }).first();
  if (!(await button.count())) {
    throw new Error(`Missing learner tab button: ${label}`);
  }
  await button.click();
  await targetPage.waitForTimeout(250);
}

async function capture(targetPage, name, expectedText) {
  await targetPage.waitForFunction((text) => (globalThis.document.body.textContent || "").includes(text), expectedText, { timeout: readyTimeoutMs });
  const overflow = await targetPage.evaluate(() => ({
    scrollWidth: globalThis.document.documentElement.scrollWidth,
    clientWidth: globalThis.document.documentElement.clientWidth,
    scrollHeight: globalThis.document.documentElement.scrollHeight,
    clientHeight: globalThis.document.documentElement.clientHeight,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 4) {
    throw new Error(`${name} has horizontal overflow: ${overflow.scrollWidth} > ${overflow.clientWidth}`);
  }
  const path = join(outDir, `${name}.png`);
  await targetPage.screenshot({ path, fullPage: false });
  screenshots.push({ name, path, ...overflow });
}
