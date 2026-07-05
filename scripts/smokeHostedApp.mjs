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
const shouldOpenDemo = args.get("demo") === "true";
const targetUrl = new URL(url);
if (shouldOpenTrain) {
  targetUrl.searchParams.set("tab", "train");
}
if (shouldOpenDemo) {
  targetUrl.searchParams.set("mode", "demo");
}
const trainHeadings = [
  "Product evolution roadmap",
  "Prompt Learner mode",
  "Learning Memory v2",
  "Side-by-side result reviewer",
  "Holdout benchmark regression",
  "Prompt editor studio",
  "Project spaces",
  "Modular architecture cleanup",
  "Public demo experience",
  "Next product sprint",
  "Prompt Atelier Product OS",
  "Accessibility and QA scoring",
  "One guided training run",
  "Corpus cleanup mode",
  "Prompt battle autopilot",
  "Prompt template compiler",
  "Real result feedback loop",
  "Public demo simplification",
  "No-key local mode polish",
  "All-in product runway",
  "Learning machine control plane",
  "Next product layer",
  "Proof seeding runway",
  "Autonomous proof loop",
  "Prompt generator v3",
  "Preference review deck",
  "Training export readiness",
  "Public proof checklist",
  "Credential boundary audit",
];
const learnerHeadings = [
  "Paste, score, improve, prove, export.",
  "One-click better prompt",
  "Prompt diff editor",
  "House-format compiler",
  "Benchmark battle",
  "Batch training review",
  "Export pack",
];
const demoHeadings = [
  "Website prompt learner",
  "Learn its DNA, then make it sharper.",
  "Better prompt",
  "Guided path",
  "Export pack",
];
const expectedHeadings = shouldOpenTrain ? trainHeadings : shouldOpenDemo ? demoHeadings : learnerHeadings;

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
  const panelState = shouldOpenTrain || !shouldOpenDemo
    ? await page.evaluate(() => {
        const pageDocument = globalThis.document;
        const requiredSections = new URL(globalThis.location.href).searchParams.get("tab") === "train"
          ? [
              "product-evolution",
              "learner-mode",
              "memory-v2",
              "result-reviewer",
              "holdout",
              "editor-studio",
              "project-spaces",
              "architecture",
              "public-experience",
            ]
          : [
              "public-learner",
              "prompt-diff-editor",
              "house-compiler",
              "benchmark-battle",
              "batch-training-review",
              "learner-export-pack",
            ];
        return {
          missingSections: requiredSections.filter((section) => !pageDocument.querySelector(`[data-train-section="${section}"]`)),
          horizontalOverflow: pageDocument.documentElement.scrollWidth > pageDocument.documentElement.clientWidth + 4,
          safeCheckCount: pageDocument.querySelectorAll(".safe-check").length,
          scoreRingCount: pageDocument.querySelectorAll(".score-ring").length,
        };
      })
    : { missingSections: [], horizontalOverflow: false, safeCheckCount: 0, scoreRingCount: 0 };
  await page.setViewportSize({ width: 390, height: 900 });
  await page.screenshot({ path: join(outDir, "hosted-smoke-mobile.png"), fullPage: true });

  if (missing.length) {
    throw new Error(`Hosted smoke missing heading(s): ${missing.join(", ")}`);
  }
  if (panelState.missingSections.length) {
    throw new Error(`Hosted smoke missing Train section(s): ${panelState.missingSections.join(", ")}`);
  }
  if (panelState.horizontalOverflow) {
    throw new Error("Hosted smoke detected horizontal overflow in Train view.");
  }
  if (shouldOpenTrain && (panelState.safeCheckCount < 30 || panelState.scoreRingCount < 8)) {
    throw new Error(`Hosted smoke found weak visual structure: ${panelState.safeCheckCount} checks, ${panelState.scoreRingCount} score rings.`);
  }

  console.log(JSON.stringify({
    ok: true,
    url: targetUrl.toString(),
    demo: shouldOpenDemo,
    train: shouldOpenTrain,
    checked: expectedHeadings,
    visual: panelState,
    screenshots: {
      desktop: screenshotPath,
      mobile: join(outDir, "hosted-smoke-mobile.png"),
    },
  }, null, 2));
} finally {
  await browser.close();
}
