import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (arg.startsWith("--")) {
    const key = arg.slice(2);
    const next = process.argv[index + 1];
    if (next && !next.startsWith("--")) {
      args.set(key, next);
      index += 1;
    } else {
      args.set(key, "true");
    }
  }
}

const url = args.get("url") || "http://127.0.0.1:4173";
const outDir = resolve(args.get("out") || "output/playwright/hosted-smoke");
const shouldOpenTrain = args.get("train") === "true";
const targetUrl = new URL(url);
if (shouldOpenTrain) {
  targetUrl.searchParams.set("tab", "train");
}
const expectedHeadings = [
  "All-in product runway",
  "Learning machine control plane",
  "Next product layer",
  "Autonomous proof loop",
  "Prompt generator v3",
  "Training export readiness",
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

try {
  await page.goto(targetUrl.toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => undefined);

  const waitForTrainContent = () =>
    page.waitForFunction("(document.body.textContent || '').includes('Learning machine control plane')", null, { timeout: 20_000 });

  if (shouldOpenTrain) {
    const deepLinkWorked = await waitForTrainContent().then(() => true).catch(() => false);
    if (!deepLinkWorked) {
      await page.waitForSelector("button.tab", { timeout: 10_000 });
      const trainButton = page.locator("button.tab").filter({ hasText: /^Train$/ }).first();
      if (await trainButton.count()) {
        await trainButton.click();
        await waitForTrainContent();
      }
    }
  }

  const pageText = () => page.evaluate("document.body.textContent || ''");

  if (shouldOpenTrain && !(await pageText()).includes("Learning machine control plane")) {
    const trainButton = page.locator("button.tab").filter({ hasText: /^Train$/ }).first();
    if (await trainButton.count()) {
      await trainButton.click();
      await waitForTrainContent();
    }
  }

  const bodyText = await pageText();
  const missing = expectedHeadings.filter((heading) => !bodyText.includes(heading));
  const screenshotPath = join(outDir, "hosted-smoke.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });

  if (missing.length) {
    throw new Error(`Hosted smoke missing heading(s): ${missing.join(", ")}`);
  }

  console.log(JSON.stringify({
    ok: true,
    url: targetUrl.toString(),
    train: shouldOpenTrain,
    checked: expectedHeadings,
    screenshot: screenshotPath,
  }, null, 2));
} finally {
  await browser.close();
}
