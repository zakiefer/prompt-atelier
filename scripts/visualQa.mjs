import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

/* global document, window */

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function parseViewport(value, fallback) {
  const match = String(value || "").match(/^(\d+)x(\d+)$/i);
  if (!match) return fallback;
  return { width: Number(match[1]), height: Number(match[2]) };
}

function scoreViewport(report) {
  return Math.max(
    0,
    Math.min(
      100,
      100 -
        (report.blank ? 34 : 0) -
        Math.min(24, report.consoleErrors.length * 8) -
        Math.min(18, report.requestFailures.length * 6) -
        Math.min(18, report.mediaIssues.length * 9) -
        Math.min(18, report.textIssues.length * 3) -
        Math.min(12, Math.max(0, report.overlaps.length - 8) * 3) -
        (report.horizontalOverflow ? 12 : 0),
    ),
  );
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const text = document.body?.innerText?.trim() || "";
    const visibleElements = Array.from(document.querySelectorAll("body *")).filter((element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && rect.width > 1 && rect.height > 1;
    });
    const textElements = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,label,li,span,input,textarea")).filter((element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && rect.width > 1 && rect.height > 1;
    });
    const textIssues = textElements
      .map((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const label = (element.textContent || element.getAttribute("aria-label") || element.getAttribute("placeholder") || element.tagName).trim().slice(0, 90);
        const isFormControl = /^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName);
        const clipsOverflow = style.overflow !== "visible" || style.overflowX !== "visible" || style.overflowY !== "visible";
        const clipped = !isFormControl && clipsOverflow && (element.scrollWidth > element.clientWidth + 4 || element.scrollHeight > element.clientHeight + 4);
        const outside = rect.right > viewportWidth + 2 || rect.left < -2 || rect.top < -2;
        return clipped || outside ? { tag: element.tagName.toLowerCase(), label, clipped, outside, rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) } } : null;
      })
      .filter(Boolean)
      .slice(0, 24);
    const overlapCandidates = textElements
      .map((element, index) => ({ element, index, rect: element.getBoundingClientRect(), label: (element.textContent || element.tagName).trim().slice(0, 70) }))
      .filter((item) => {
        const tag = item.element.tagName;
        const role = item.element.getAttribute("role") || "";
        const isInlineNoise = tag === "SPAN" || tag === "SMALL" || tag === "EM";
        return !isInlineNoise && role !== "presentation" && item.label.length >= 8 && item.rect.width > 16 && item.rect.height > 10 && item.rect.bottom > 0 && item.rect.top < viewportHeight && item.rect.right > 0 && item.rect.left < viewportWidth && item.label;
      });
    const overlaps = [];
    for (let i = 0; i < overlapCandidates.length; i += 1) {
      for (let j = i + 1; j < overlapCandidates.length; j += 1) {
        const a = overlapCandidates[i];
        const b = overlapCandidates[j];
        if (a.element.contains(b.element) || b.element.contains(a.element)) continue;
        const x = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
        const y = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
        const area = x * y;
        const minArea = Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height);
        if (minArea && area / minArea > 0.35) {
          overlaps.push({ a: a.label, b: b.label, overlapRatio: Number((area / minArea).toFixed(2)) });
        }
        if (overlaps.length >= 16) break;
      }
      if (overlaps.length >= 16) break;
    }
    const mediaIssues = [
      ...Array.from(document.images)
        .filter((image) => image.currentSrc && (!image.complete || image.naturalWidth === 0))
        .map((image) => ({ type: "image", src: image.currentSrc || image.src, issue: "not-loaded" })),
      ...Array.from(document.querySelectorAll("video"))
        .filter((video) => video.currentSrc && (video.error || video.readyState === 0))
        .map((video) => ({ type: "video", src: video.currentSrc || video.src, issue: video.error ? `error-${video.error.code}` : "not-ready" })),
    ].slice(0, 16);
    return {
      title: document.title,
      textLength: text.length,
      visibleElementCount: visibleElements.length,
      blank: text.length < 20 && visibleElements.length < 8,
      horizontalOverflow: document.documentElement.scrollWidth > viewportWidth + 2,
      mediaIssues,
      textIssues,
      overlaps,
    };
  });
}

async function checkViewport(browser, { apiToken, label, viewport, url, outDir, timeout }) {
  const page = await browser.newPage({ viewport });
  if (apiToken) {
    await page.addInitScript((token) => {
      window.localStorage.setItem("prompt-atelier-api-token", token);
    }, apiToken);
  }
  const consoleErrors = [];
  const consoleWarnings = [];
  const requestFailures = [];
  const badResponses = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
    if (message.type() === "warning") consoleWarnings.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("requestfailed", (request) => requestFailures.push({ url: request.url(), failure: request.failure()?.errorText || "request failed" }));
  page.on("response", (response) => {
    if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() });
  });
  const screenshotPath = join(outDir, `${label}.png`);
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: Math.min(timeout, 8000) }).catch(() => undefined);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    const inspection = await inspectPage(page);
    const report = {
      label,
      viewport,
      url: page.url(),
      screenshotPath,
      consoleErrors: consoleErrors.slice(0, 20),
      consoleWarnings: consoleWarnings.slice(0, 20),
      requestFailures: [...requestFailures, ...badResponses].slice(0, 20),
      ...inspection,
    };
    return { ...report, score: scoreViewport(report) };
  } catch (error) {
    const report = {
      label,
      viewport,
      url,
      screenshotPath,
      consoleErrors: [error instanceof Error ? error.message : String(error)],
      consoleWarnings,
      requestFailures,
      title: "",
      textLength: 0,
      visibleElementCount: 0,
      blank: true,
      horizontalOverflow: false,
      mediaIssues: [],
      textIssues: [],
      overlaps: [],
    };
    return { ...report, score: scoreViewport(report) };
  } finally {
    await page.close().catch(() => undefined);
  }
}

const url = argValue("--url");
if (!url) {
  console.error("Usage: npm run visual:qa -- --url http://127.0.0.1:5173 --out output/visual-qa/latest");
  process.exit(1);
}

const outDir = resolve(argValue("--out", "output/visual-qa/latest"));
const timeout = Number(argValue("--timeout", "30000"));
const apiToken = argValue("--api-token", process.env.PROMPT_LAB_API_TOKEN || "");
const viewports = [
  { label: "desktop", viewport: parseViewport(argValue("--desktop", "1440x1000"), { width: 1440, height: 1000 }) },
  { label: "mobile", viewport: parseViewport(argValue("--mobile", "390x844"), { width: 390, height: 844 }) },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const viewport of viewports) {
    results.push(await checkViewport(browser, { ...viewport, apiToken, url, outDir, timeout }));
  }
} finally {
  await browser.close().catch(() => undefined);
}

const score = Math.round(results.reduce((sum, result) => sum + result.score, 0) / Math.max(1, results.length));
const failedChecks = results.flatMap((result) => [
  result.blank ? `${result.label}: blank or near-blank render` : "",
  result.consoleErrors.length ? `${result.label}: ${result.consoleErrors.length} console/page error(s)` : "",
  result.requestFailures.length ? `${result.label}: ${result.requestFailures.length} request failure(s)` : "",
  result.mediaIssues.length ? `${result.label}: ${result.mediaIssues.length} media issue(s)` : "",
  result.textIssues.length ? `${result.label}: ${result.textIssues.length} clipped/outside text issue(s)` : "",
  result.overlaps.length >= 12 || (result.textIssues.length && result.overlaps.length) ? `${result.label}: ${result.overlaps.length} possible text overlap(s)` : "",
  result.horizontalOverflow ? `${result.label}: horizontal overflow` : "",
].filter(Boolean));
const report = {
  ok: failedChecks.length === 0,
  status: failedChecks.length ? "needs-review" : "passed",
  score,
  url,
  outDir,
  results,
  failedChecks,
  notes: failedChecks.length
    ? ["Automated visual QA found review items.", ...failedChecks.slice(0, 12)]
    : ["Desktop and mobile visual QA passed.", "Screenshots, console health, media integrity, nonblank render, text fit, and viewport fit were checked."],
  createdAt: new Date().toISOString(),
};

writeFileSync(join(outDir, "visual-qa-result.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
