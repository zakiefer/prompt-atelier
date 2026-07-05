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
const readyTimeoutMs = Number(args.get("ready-timeout-ms") || 15_000);
const targetUrl = new URL(url);
if (shouldOpenTrain) {
  targetUrl.searchParams.set("tab", "train");
}
if (shouldOpenDemo) {
  targetUrl.searchParams.set("mode", "demo");
}
const trainHeadings = [
  "Train focus summary",
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
  "Paste, score, improve, battle, prove, export.",
  "Current project",
  "Workflow OS",
  "Mobile operator mode",
  "Generate great prompt",
  "Backend project sync",
  "Corpus health controls",
  "CI proof links",
  "Eval history",
  "Product intelligence",
  "Result gallery",
  "Visual repair loop",
  "Coverage intelligence",
  "Export studio",
  "Project timeline",
  "Taste profile versions",
  "CI proof status",
  "Next best action",
  "Automatic proof runner",
  "Guided start",
  "One-click prompt path",
  "Prompt quality report",
  "Learn from this prompt",
  "Workspace search",
  "Prompt lint fixes",
  "Import front door",
  "Project persistence",
  "Project history",
  "Proof-first action",
  "Brief builder",
  "Generated prompt section editor",
  "Prompt diagnosis",
  "One prompt run",
  "Style profiles",
  "Try sample prompts",
  "Prompt revision",
  "Prompt battle",
  "Proof learning plan",
  "Proof artifact vault",
  "Proof quality leaderboard",
  "Ingestion safety",
  "Strength gap plan",
  "Learned from similar prompts",
  "Outcome feedback loop",
  "Prompt diff editor",
  "House-format compiler",
  "Screenshot proof intake",
  "Target export differences",
  "Proof and deploy status",
  "Product changelog",
  "Production hardening",
  "Export deliverables",
  "Export target matrix",
  "Corpus safety",
  "Regression guard",
  "Benchmark battle",
  "Prompt recipe builder",
  "Target export presets",
  "Batch training review",
  "Export pack",
  "Fast corpus triage",
  "Corpus review queue",
  "Corpus quarantine queue",
  "Saved learner sessions",
  "Visual proof gallery",
  "Recent activity",
];
const demoHeadings = [
  "Website prompt learner",
  "Score it clearly, then revise it.",
  "Try sample prompts",
  "Better prompt",
  "Guided path",
  "Export pack",
];
const expectedHeadings = shouldOpenTrain ? trainHeadings : shouldOpenDemo ? demoHeadings : learnerHeadings;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  acceptDownloads: true,
  viewport: { width: 1440, height: 1200 },
  extraHTTPHeaders: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});
const page = await context.newPage();

try {
  await gotoTarget(page, targetUrl);

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
  const missing = await waitForExpectedHeadings(page, targetUrl, expectedHeadings, bodyText, readyTimeoutMs);
  const interactionState = !shouldOpenTrain && !shouldOpenDemo
    ? await runLearnerInteractions(page)
    : { checked: [], sessionCount: 0, historyCount: 0 };
  const screenshotPath = join(outDir, "hosted-smoke.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const panelState = shouldOpenTrain || !shouldOpenDemo
    ? await page.evaluate(() => {
        const pageDocument = globalThis.document;
        const requiredSections = new URL(globalThis.location.href).searchParams.get("tab") === "train"
          ? [
              "product-evolution",
              "train-focus-summary",
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
              "project-cockpit",
              "workflow-os",
              "mobile-operator",
              "production-command-center",
              "eval-history",
              "product-intelligence",
              "result-gallery",
              "visual-repair-loop",
              "coverage-intelligence",
              "export-studio",
              "project-timeline",
              "taste-profile-versions",
              "ci-proof-status",
              "learner-command-deck",
              "proof-runner-checklist",
              "beginner-prompt-path",
              "one-click-proof-rail",
              "prompt-quality-report",
              "training-impact",
              "advanced-workspace-tools",
              "workspace-search",
              "prompt-lint-fixes",
              "import-front-door",
              "project-persistence",
              "project-history",
              "guided-first-run",
              "prompt-diagnosis",
              "proof-first-action",
              "learner-section-editor",
              "style-profiles",
              "prompt-battle-flow",
              "one-prompt-run",
              "brief-builder",
              "strength-rewrite-plan",
              "corpus-neighbors",
              "prompt-diff-editor",
              "proof-learning-plan",
              "proof-intake",
              "proof-artifact-vault",
              "proof-quality-leaderboard",
              "ingestion-safety",
              "outcome-feedback-loop",
              "proof-deploy-status",
              "product-changelog",
              "production-hardening",
              "export-deliverables",
              "export-target-matrix",
              "export-target-differences",
              "corpus-safety",
              "learner-regression-guard",
              "house-compiler",
              "benchmark-battle",
              "recipe-builder",
              "target-export-presets",
              "batch-training-review",
              "learner-export-pack",
              "corpus-triage-toolbar",
              "corpus-review-queue",
              "corpus-quarantine",
              "learner-session-history",
              "visual-proof-gallery",
              "learner-activity",
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
    interactions: interactionState,
    visual: panelState,
    screenshots: {
      desktop: screenshotPath,
      mobile: join(outDir, "hosted-smoke-mobile.png"),
    },
  }, null, 2));
} finally {
  await context.close();
  await browser.close();
}

async function gotoTarget(page, target) {
  await page.goto(target.toString(), { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => undefined);
}

async function waitForExpectedHeadings(page, target, headings, initialText, timeoutMs) {
  const startedAt = Date.now();
  let bodyText = initialText;
  let missing = headings.filter((heading) => !bodyText.includes(heading));

  while (missing.length && Date.now() - startedAt < timeoutMs) {
    await page.waitForTimeout(3_000);
    const nextTarget = new URL(target.toString());
    nextTarget.searchParams.set("smokeReady", String(Date.now()));
    await gotoTarget(page, nextTarget);
    bodyText = await page.evaluate("document.body.textContent || ''");
    missing = headings.filter((heading) => !bodyText.includes(heading));
  }

  return missing;
}

async function runLearnerInteractions(page) {
  const checked = [];
  const sampleButton = page.locator(".sample-card").first();
  if (await sampleButton.count()) {
    await sampleButton.click();
    checked.push("sample prompt loaded");
  }

  const saveProjectButton = page.locator('[data-train-section="project-cockpit"] button').filter({ hasText: /Save project/ }).first();
  if (await saveProjectButton.count()) {
    await saveProjectButton.click();
    checked.push("project snapshot saved");
  }

  const generatePromptButton = page.locator('[data-train-section="production-command-center"] button').filter({ hasText: /Generate prompt/ }).first();
  if (await generatePromptButton.count()) {
    await generatePromptButton.click();
    await page.waitForFunction(() => (globalThis.localStorage.getItem("prompt-atelier-generated-prompts-v1") || "[]").includes("generated prompt"), null, { timeout: 5000 });
    checked.push("great prompt generated");
  }

  const corpusGoldButton = page.locator('[data-train-section="production-command-center"] button').filter({ hasText: /^gold$/i }).first();
  if (await corpusGoldButton.count()) {
    await corpusGoldButton.click();
    checked.push("corpus health labeled");
  }

  const projectProofButton = page.locator('[data-train-section="production-command-center"] button').filter({ hasText: /Run proof runner/ }).first();
  if (await projectProofButton.count()) {
    await projectProofButton.click();
    checked.push("project proof runner saved");
  }

  const syncProjectButton = page.locator('[data-train-section="production-command-center"] button').filter({ hasText: /Sync project/ }).first();
  if (await syncProjectButton.count()) {
    await syncProjectButton.click();
    checked.push("backend project sync attempted");
  }

  const productIntelligence = page.locator('[data-train-section="product-intelligence"]').first();
  if (await productIntelligence.count()) {
    const isOpen = await productIntelligence.evaluate((node) => node.hasAttribute("open"));
    if (!isOpen) {
      await productIntelligence.evaluate((node) => node.querySelector(":scope > summary")?.click());
      checked.push("product intelligence opened");
    }
  }

  const repairButton = page.locator('[data-train-section="visual-repair-loop"] button').filter({ hasText: /Build repair prompt/ }).first();
  if (await repairButton.count()) {
    await repairButton.click();
    await page.waitForFunction(() => Boolean(globalThis.localStorage.getItem("prompt-atelier-visual-repair-prompt-v1")), null, { timeout: 5000 });
    checked.push("visual repair prompt built");
  }

  const useRepairButton = page.locator('[data-train-section="visual-repair-loop"] button').filter({ hasText: /Use repair prompt/ }).first();
  if (await useRepairButton.count()) {
    await useRepairButton.click();
    checked.push("visual repair prompt used");
  }

  const saveTasteButton = page.locator('[data-train-section="taste-profile-versions"] button').filter({ hasText: /Save taste version/ }).first();
  if (await saveTasteButton.count()) {
    await saveTasteButton.click();
    await page.waitForFunction(() => {
      const raw = globalThis.localStorage.getItem("prompt-atelier-taste-profile-versions-v1") || "[]";
      try {
        return JSON.parse(raw).length > 0;
      } catch {
        return false;
      }
    }, null, { timeout: 5000 });
    checked.push("taste version saved");
  }

  const resultPromoteButton = page.locator('[data-train-section="result-gallery"] button').filter({ hasText: /Promote gold/ }).first();
  if (await resultPromoteButton.count()) {
    await resultPromoteButton.click();
    checked.push("result promoted gold");
  }

  const proofChecklistButton = page.locator('[data-train-section="proof-runner-checklist"] button').first();
  if (await proofChecklistButton.count()) {
    await proofChecklistButton.click();
    checked.push("proof checklist opened");
    await openLearnerTab(page, "Compose");
  }

  const learnSignalButton = page.locator('[data-train-section="training-impact"] button').filter({ hasText: /Learn signal/ }).first();
  if (await learnSignalButton.count()) {
    await learnSignalButton.click();
    checked.push("training signal saved");
  }

  const briefBuilder = page.locator('[data-train-section="brief-builder"]').first();
  if (await briefBuilder.count()) {
    const isOpen = await briefBuilder.evaluate((node) => node.hasAttribute("open"));
    if (!isOpen) {
      await briefBuilder.evaluate((node) => node.querySelector(":scope > summary")?.click());
      checked.push("brief builder opened");
    }
  }

  const briefButton = page.locator('[data-train-section="brief-builder"] button').filter({ hasText: /Use brief prompt/ }).first();
  if (await briefButton.count()) {
    await briefButton.click();
    checked.push("brief prompt loaded");
  }

  const generatedSectionDrawer = page.locator('[data-train-section="generated-section-drawer"]').first();
  if (await generatedSectionDrawer.count()) {
    const isOpen = await generatedSectionDrawer.evaluate((node) => node.hasAttribute("open"));
    if (!isOpen) {
      await generatedSectionDrawer.evaluate((node) => node.querySelector(":scope > summary")?.click());
      checked.push("generated section drawer opened");
    }
  }

  const sectionCopyButton = page.locator('[data-train-section="learner-section-editor"] button').filter({ hasText: /Copy all/ }).first();
  if (await sectionCopyButton.count()) {
    await sectionCopyButton.click();
    checked.push("section editor copied");
  }
  const sectionApplyButton = page.locator('[data-train-section="learner-section-editor"] button').filter({ hasText: /Apply edits/ }).first();
  if (await sectionApplyButton.count()) {
    await sectionApplyButton.click();
    checked.push("section editor applied");
  }

  const supportingIntelligence = page.locator('[data-train-section="supporting-prompt-intelligence"]').first();
  if (await supportingIntelligence.count()) {
    const isOpen = await supportingIntelligence.evaluate((node) => node.hasAttribute("open"));
    if (!isOpen) {
      await supportingIntelligence.evaluate((node) => node.querySelector(":scope > summary")?.click());
      checked.push("supporting intelligence opened");
    }
  }

  const profileButton = page.locator(".profile-chip").nth(1);
  if (await profileButton.count()) {
    await profileButton.click();
    checked.push("profile switched");
  }

  await openAppInspector(page, "Corpus");
  const corpusTextarea = page.locator(".import-box textarea").first();
  if (await corpusTextarea.count()) {
    await corpusTextarea.fill([
      "Build a React + TypeScript + Vite + Tailwind CSS fullscreen video hero for a design studio with exact fonts, colors, CTA states, mobile menu, and desktop/mobile QA.",
      "",
      "Build a product dashboard hero with exact charts, empty/loading states, responsive grid, keyboard focus, no placeholder assets, and screenshot verification.",
    ].join("\\n"));
    checked.push("corpus drawer opened");
  }
  const closeCorpusButton = page.locator('[aria-label="Close inspector"]').first();
  if (await closeCorpusButton.count()) {
    await closeCorpusButton.click();
    await page.waitForFunction(() => !globalThis.document.querySelector('[data-inspector="corpus"]')?.classList.contains("open"), null, { timeout: 5000 });
  }

  await openLearnerTab(page, "Review");

  const acceptButton = page.locator('[data-train-section="prompt-diff-editor"] button').filter({ hasText: /^Accept$/ }).first();
  if (await acceptButton.count()) {
    await acceptButton.click();
    checked.push("diff accepted");
  }

  const rejectButton = page.locator('[data-train-section="prompt-diff-editor"] button').filter({ hasText: /^Reject$/ }).first();
  if (await rejectButton.count()) {
    await rejectButton.click();
    checked.push("diff rejected");
  }

  const saveFeedbackButton = page.locator('[data-train-section="outcome-feedback-loop"] button').filter({ hasText: /Save feedback/ }).first();
  if (await saveFeedbackButton.count()) {
    await saveFeedbackButton.click();
    checked.push("outcome feedback saved");
  }

  const saveProofButton = page.locator('[data-train-section="proof-intake"] button').filter({ hasText: /Save proof/ }).first();
  if (await saveProofButton.count()) {
    await saveProofButton.click();
    checked.push("proof intake saved");
  }

  const saveSessionButton = page.locator('[data-learner-action="save-session"]').first();
  if (await saveSessionButton.count()) {
    await saveSessionButton.click();
    const persisted = await waitForLearnerPersistence(page, { minHistory: 1, minSessions: 1, timeoutMs: 10_000 });
    if (!persisted.ok) {
      await page.waitForTimeout(500);
      await saveSessionButton.click();
      await waitForLearnerPersistence(page, { minHistory: 1, minSessions: 1, timeoutMs: 10_000 });
    }
    checked.push("learner session saved");
  }

  await openLearnerTab(page, "Export");
  const exportCenterButton = page.locator('[data-learner-action="open-export-modal"]').first();
  if (await exportCenterButton.count()) {
    await exportCenterButton.click();
    checked.push("export center opened");
  }

  const presetCopyButton = page.locator('[data-learner-section="export-preset-preview"] button').filter({ hasText: /Copy preset/ }).first();
  if (await presetCopyButton.count()) {
    await presetCopyButton.click();
    checked.push("target preset copied");
  }

  await page.waitForFunction("document.body.textContent.includes('candidate') || document.body.textContent.includes('Corpus review queue')", null, { timeout: 5000 }).catch(() => undefined);
  const fastGoldButton = page.locator('[data-train-section="corpus-triage-toolbar"] button').filter({ hasText: /Gold selected/ }).first();
  if (await fastGoldButton.count()) {
    await fastGoldButton.click();
    checked.push("fast triage marked gold");
  }

  const goldButton = page.locator('[data-train-section="corpus-review-queue"] button').filter({ hasText: /^Gold$/ }).first();
  if (await goldButton.count()) {
    await goldButton.click();
    checked.push("corpus candidate marked gold");
  }

  const saveCompiledButton = page.locator('[data-train-section="house-compiler"] button').filter({ hasText: /^Save$/ }).first();
  if (await saveCompiledButton.count()) {
    await saveCompiledButton.click();
    checked.push("compiled prompt saved");
  }

  const saveWinnerButton = page.locator('[data-train-section="benchmark-battle"] button').filter({ hasText: /Save winner/ }).first();
  if (await saveWinnerButton.count()) {
    await saveWinnerButton.click();
    checked.push("benchmark winner saved");
  }

  const detailsButton = page.locator('[data-train-section="learner-session-history"] button').filter({ hasText: /^Details$/ }).first();
  if (await detailsButton.count()) {
    await detailsButton.click();
    checked.push("learner session details opened");
  }

  const reopenButton = page.locator('[data-train-section="learner-session-history"] button').filter({ hasText: /^Reopen$/ }).first();
  if (await reopenButton.count()) {
    await reopenButton.click();
    checked.push("learner session reopened");
  }

  const exportButton = page.locator('[data-train-section="learner-export-pack"] button').filter({ hasText: /^Export$/ }).first();
  if (await exportButton.count()) {
    const download = await Promise.all([
      page.waitForEvent("download", { timeout: 5000 }).catch(() => undefined),
      exportButton.click(),
    ]).then(([downloadResult]) => downloadResult);
    if (download) checked.push(`export downloaded:${download.suggestedFilename()}`);
  }

  const finalPersistence = await waitForLearnerPersistence(page, { minHistory: 2, minSessions: 1, timeoutMs: 15_000 });
  const state = finalPersistence.state;

  if (!checked.includes("project snapshot saved") || !checked.includes("great prompt generated") || !checked.includes("corpus health labeled") || !checked.includes("project proof runner saved") || !checked.includes("visual repair prompt built") || !checked.includes("taste version saved") || !checked.includes("training signal saved") || !checked.includes("profile switched") || !checked.includes("section editor applied") || !checked.includes("diff accepted") || !checked.includes("learner session saved") || !checked.includes("outcome feedback saved") || !checked.includes("proof intake saved")) {
    throw new Error(`Learner interaction smoke incomplete: ${checked.join(", ")}`);
  }
  if (state.sessionCount < 1) {
    throw new Error("Learner interaction smoke did not persist a learner session.");
  }
  if (state.historyCount < 2) {
    throw new Error("Learner interaction smoke did not persist saved prompt history.");
  }
  if (state.projectHistoryCount < 1) {
    throw new Error("Learner interaction smoke did not persist project history.");
  }
  if (state.generatedPromptCount < 1 || state.projectProofRunCount < 1 || state.evalHistoryCount < 2 || state.tasteVersionCount < 1 || !state.repairPromptReady) {
    throw new Error("Learner interaction smoke did not persist production project records.");
  }
  return { ...state, checked };
}

async function waitForLearnerPersistence(page, { minHistory, minSessions, timeoutMs }) {
  const startedAt = Date.now();
  let state = await readLearnerPersistenceState(page);
  while (Date.now() - startedAt < timeoutMs) {
    if (state.sessionCount >= minSessions && state.historyCount >= minHistory) {
      return { ok: true, state };
    }
    await page.waitForTimeout(250);
    state = await readLearnerPersistenceState(page);
  }
  return { ok: false, state };
}

async function readLearnerPersistenceState(page) {
  return page.evaluate(() => {
    const safeParse = (key) => {
      try {
        const value = JSON.parse(globalThis.localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
      } catch {
        return [];
      }
    };
    const sessions = safeParse("prompt-atelier-learner-sessions");
    const history = safeParse("prompt-atelier-version-history");
    const projectHistory = safeParse("prompt-atelier-project-history-v1");
    const generatedPrompts = safeParse("prompt-atelier-generated-prompts-v1");
    const projectProofRuns = safeParse("prompt-atelier-project-proof-runs-v1");
    const evalHistory = safeParse("prompt-atelier-eval-history-v1");
    const tasteVersions = safeParse("prompt-atelier-taste-profile-versions-v1");
    const repairPrompt = globalThis.localStorage.getItem("prompt-atelier-visual-repair-prompt-v1") || "";
    const activeProfile = globalThis.localStorage.getItem("prompt-atelier-active-learning-profile") || "";
    return {
      activeProfile,
      evalHistoryCount: evalHistory.length,
      generatedPromptCount: generatedPrompts.length,
      historyCount: history.length,
      projectHistoryCount: projectHistory.length,
      projectProofRunCount: projectProofRuns.length,
      repairPromptReady: repairPrompt.length > 200,
      sessionCount: sessions.length,
      tasteVersionCount: tasteVersions.length,
    };
  });
}

async function openLearnerTab(page, label) {
  const tabButton = page.locator('[data-train-section="guided-first-run"] button').filter({ hasText: label }).first();
  if (await tabButton.count()) {
    await tabButton.click();
    await page.waitForFunction((tabLabel) => {
      const buttons = [...globalThis.document.querySelectorAll('[data-train-section="guided-first-run"] button')];
      return buttons.some((button) => button.textContent?.includes(String(tabLabel)) && button.getAttribute("data-active") === "true");
    }, label, { timeout: 5000 });
  }
}

async function openAppInspector(page, label) {
  const inspectorButton = page.locator(".workspace-actions button").filter({ hasText: label }).first();
  if (await inspectorButton.count()) {
    await inspectorButton.click();
    await page.waitForFunction((inspectorLabel) => {
      const selector = String(inspectorLabel).toLowerCase().includes("corpus") ? '[data-inspector="corpus"]' : '[data-inspector="rules"]';
      return globalThis.document.querySelector(selector)?.classList.contains("open");
    }, label, { timeout: 5000 });
  }
}
