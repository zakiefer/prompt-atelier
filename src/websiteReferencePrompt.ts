export type WebsiteReferenceInput = {
  url: string;
  referenceName: string;
  newBrand: string;
  newOffer: string;
  audience: string;
  stack: string;
  keep: string;
  change: string;
  pageNotes: string;
  assets: string;
  constraints: string;
};

export type WebsiteReferenceAnalysisStatus = "idle" | "ready" | "manual" | "error";

export type WebsiteReferenceAnalysis = {
  status: WebsiteReferenceAnalysisStatus;
  url: string;
  title: string;
  description: string;
  headings: string[];
  navLabels: string[];
  ctaLabels: string[];
  sectionLabels: string[];
  colorHints: string[];
  assetHints: string[];
  motionHints: string[];
  layoutHints: string[];
  responsiveHints: string[];
  extractedAt: string;
  error?: string;
};

export type WebsiteReferenceScreenshot = {
  id: string;
  label: string;
  name: string;
  dataUrl?: string;
  notes: string;
  width?: number;
  height?: number;
  createdAt: string;
};

export type WebsiteReferencePromptResult = {
  score: number;
  title: string;
  summary: string;
  warnings: string[];
  sections: string[];
  prompt: string;
};

export type WebsiteReferenceVariantTone = "faithful" | "bold" | "conversion";

export type WebsiteReferenceVariant = {
  id: WebsiteReferenceVariantTone;
  label: string;
  tone: WebsiteReferenceVariantTone;
  score: number;
  summary: string;
  prompt: string;
};

export type WebsiteReferenceCloneCheck = {
  label: string;
  ready: boolean;
  detail: string;
};

export type WebsiteReferenceCloneScore = {
  score: number;
  status: "ready" | "watch" | "blocked";
  checks: WebsiteReferenceCloneCheck[];
};

export type WebsiteReferenceExport = {
  id: "codex" | "v0" | "claude" | "lovable" | "raw" | "json";
  label: string;
  filename: string;
  content: string;
};

export type WebsiteReferenceProject = {
  id: string;
  title: string;
  url: string;
  input: WebsiteReferenceInput;
  analysis: WebsiteReferenceAnalysis;
  screenshots: WebsiteReferenceScreenshot[];
  result: WebsiteReferencePromptResult;
  variants: WebsiteReferenceVariant[];
  selectedVariantId: WebsiteReferenceVariantTone;
  cloneScore: WebsiteReferenceCloneScore;
  exports: WebsiteReferenceExport[];
  repairPrompt: string;
  createdAt: string;
};

export type WebsiteReferenceStudioResult = {
  result: WebsiteReferencePromptResult;
  variants: WebsiteReferenceVariant[];
  selectedVariant: WebsiteReferenceVariant;
  cloneScore: WebsiteReferenceCloneScore;
  exports: WebsiteReferenceExport[];
  repairPrompt: string;
  project: WebsiteReferenceProject;
};

export type WebsiteReferencePromptContext = {
  analysis?: WebsiteReferenceAnalysis;
  screenshots?: WebsiteReferenceScreenshot[];
  variantTone?: WebsiteReferenceVariantTone;
  repairNotes?: string;
};

const secretPattern = /(sk-ant|sk-proj|api[_-]?key|bearer\s+[a-z0-9._-]{16,}|password|secret|access[_-]?token|auth[_-]?token|token\s*[:=])/i;
const defaultExtractedAt = "browser";

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function block(value: string, fallback: string) {
  const next = clean(value);
  return next || fallback;
}

function countWords(value: string) {
  return clean(value).split(/\s+/).filter(Boolean).length;
}

function uniqueList(values: string[], limit = 8) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values) {
    const cleaned = clean(value).replace(/^[-*]\s*/, "");
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    next.push(cleaned);
    if (next.length >= limit) break;
  }
  return next;
}

function splitSignals(value: string, limit = 8) {
  return uniqueList(value.split(/\n|;|,|\.\s+/), limit);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalizeReferenceUrl(value: string) {
  const raw = clean(value);
  if (!raw) return "";
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const parsed = new URL(withProtocol);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return raw;
  }
}

export function createWebsiteReferenceInput(profile?: { label?: string; rules?: string[] }): WebsiteReferenceInput {
  const profileLabel = profile?.label ? `${profile.label} prompt craft` : "high-fidelity website prompt craft";
  const ruleHints = profile?.rules?.slice(0, 2).join("; ");
  return {
    url: "",
    referenceName: "current reference website",
    newBrand: "",
    newOffer: "",
    audience: "",
    stack: "React + TypeScript + Vite + Tailwind CSS with lucide-react icons. Add motion libraries only if the reference behavior requires them.",
    keep: `Keep the reference site's strongest structural patterns and translate them through ${profileLabel}.`,
    change: "Create a new brand, new copy, new visual system, new assets, and a cleaner mobile experience. Do not clone the source site.",
    pageNotes: ruleHints ? `Learned taste hints: ${ruleHints}` : "",
    assets: "Use new, explicitly provided, generated, or public-domain assets. If no assets are available, specify the asset slots and acceptance criteria instead of inventing placeholders.",
    constraints: "Do not include provider keys, private credentials, copied brand marks, copied proprietary copy, or hidden scraping code.",
  };
}

export function createEmptyWebsiteReferenceAnalysis(url = ""): WebsiteReferenceAnalysis {
  return {
    status: "idle",
    url: normalizeReferenceUrl(url),
    title: "",
    description: "",
    headings: [],
    navLabels: [],
    ctaLabels: [],
    sectionLabels: [],
    colorHints: [],
    assetHints: [],
    motionHints: [],
    layoutHints: [],
    responsiveHints: [],
    extractedAt: defaultExtractedAt,
  };
}

export function buildManualWebsiteReferenceAnalysis(input: WebsiteReferenceInput): WebsiteReferenceAnalysis {
  const notes = `${input.keep}\n${input.pageNotes}\n${input.assets}\n${input.constraints}`;
  const layoutHints = splitSignals(`${input.keep}\n${input.pageNotes}`, 8);
  const assetHints = splitSignals(input.assets, 6);
  const responsiveHints = splitSignals(input.pageNotes, 8).filter((hint) => /mobile|responsive|desktop|tablet|viewport|scroll|dropdown|menu/i.test(hint));
  const motionHints = splitSignals(input.pageNotes, 6).filter((hint) => /motion|animate|scroll|hover|transition|loop|fade|parallax/i.test(hint));
  const headings = splitSignals(input.pageNotes, 5).filter((hint) => hint.length > 8);
  return {
    status: notes.trim() ? "manual" : "idle",
    url: normalizeReferenceUrl(input.url),
    title: block(input.referenceName, "Manual reference notes"),
    description: block(input.pageNotes, "Manual notes are not filled yet."),
    headings: headings.length ? headings : splitSignals(input.keep, 4),
    navLabels: splitSignals(input.pageNotes, 8).filter((hint) => /nav|menu|dropdown|link|header/i.test(hint)),
    ctaLabels: splitSignals(input.pageNotes, 6).filter((hint) => /cta|button|sign|start|join|book|contact|demo/i.test(hint)),
    sectionLabels: splitSignals(input.pageNotes, 8).filter((hint) => /hero|section|card|footer|marquee|feature|panel|form/i.test(hint)),
    colorHints: splitSignals(input.pageNotes, 6).filter((hint) => /color|palette|dark|light|white|black|gray|purple|green|blue|glass/i.test(hint)),
    assetHints,
    motionHints,
    layoutHints,
    responsiveHints,
    extractedAt: defaultExtractedAt,
  };
}

function activeAnalysis(input: WebsiteReferenceInput, analysis?: WebsiteReferenceAnalysis) {
  if (analysis && analysis.status !== "idle") return analysis;
  return buildManualWebsiteReferenceAnalysis(input);
}

function formatList(values: string[], fallback: string) {
  return values.length ? values.map((value) => `- ${value}`).join("\n") : `- ${fallback}`;
}

function analysisIsReady(analysis?: WebsiteReferenceAnalysis) {
  return Boolean(analysis && (analysis.status === "ready" || analysis.status === "manual"));
}

export function scoreWebsiteReferenceInput(input: WebsiteReferenceInput) {
  let score = 0;
  const warnings: string[] = [];
  const normalizedUrl = normalizeReferenceUrl(input.url);

  if (/^https?:\/\//i.test(normalizedUrl)) score += 16;
  else warnings.push("Add a valid reference website URL.");

  if (clean(input.referenceName)) score += 6;
  if (countWords(input.newBrand) >= 1) score += 8;
  else warnings.push("Name the new brand or product.");
  if (countWords(input.newOffer) >= 5) score += 14;
  else warnings.push("Describe what the new site sells or explains.");
  if (countWords(input.audience) >= 4) score += 8;
  if (countWords(input.stack) >= 6) score += 10;
  if (countWords(input.keep) >= 8) score += 13;
  else warnings.push("Say what to preserve from the reference.");
  if (countWords(input.change) >= 8) score += 13;
  else warnings.push("Say what must change in the new site.");
  if (countWords(input.pageNotes) >= 8) score += 10;
  if (countWords(input.assets) >= 6) score += 8;
  if (countWords(input.constraints) >= 6) score += 8;

  const combined = Object.values(input).join("\n");
  if (secretPattern.test(combined)) {
    score -= 30;
    warnings.push("Possible secret or credential text detected. Remove it before exporting or training.");
  }
  if (/clone|exact copy|same logo|same copy/i.test(input.keep) && !/do not clone|new brand|new copy/i.test(input.change)) {
    score -= 12;
    warnings.push("Reference usage needs an anti-clone instruction.");
  }

  return { score: clampScore(score), warnings };
}

function toneInstruction(tone: WebsiteReferenceVariantTone | undefined) {
  if (tone === "bold") {
    return "Variant posture: make a visually bolder reinterpretation. Keep the reference's useful structure, but change composition, rhythm, palette, assets, and copy enough that it feels like a new creative direction.";
  }
  if (tone === "conversion") {
    return "Variant posture: optimize for conversion clarity. Preserve useful hierarchy, but sharpen CTA sequence, trust proof, forms, mobile path, and measurable acceptance gates.";
  }
  return "Variant posture: faithful structure, original execution. Preserve the reference's information architecture and pacing while replacing brand, copy, assets, palette, and implementation details.";
}

export function buildWebsiteReferencePrompt(
  input: WebsiteReferenceInput,
  learnedRules: string[] = [],
  context: WebsiteReferencePromptContext = {},
): WebsiteReferencePromptResult {
  const normalizedUrl = normalizeReferenceUrl(input.url);
  const referenceName = block(input.referenceName, "current reference website");
  const newBrand = block(input.newBrand, "the new brand");
  const newOffer = block(input.newOffer, "a new website experience inspired by the reference structure");
  const audience = block(input.audience, "the target audience for the new product or service");
  const stack = block(input.stack, "React + TypeScript + Vite + Tailwind CSS");
  const keep = block(input.keep, "Preserve only the reference site's useful structure, pacing, hierarchy, and interaction ideas.");
  const change = block(input.change, "Create new copy, styling, media, assets, brand marks, and interaction details.");
  const pageNotes = block(input.pageNotes, "Inspect the reference manually and record visible layout, navigation, media, motion, and responsive behavior before building.");
  const assets = block(input.assets, "Use new, licensed, generated, or provided assets only.");
  const constraints = block(input.constraints, "Do not copy private assets, protected copy, brand marks, secrets, or provider keys.");
  const score = scoreWebsiteReferenceInput(input);
  const analysis = activeAnalysis(input, context.analysis);
  const screenshots = context.screenshots?.slice(0, 6) ?? [];
  const ruleBlock = learnedRules.length
    ? learnedRules.slice(0, 6).map((rule) => `- ${rule}`).join("\n")
    : "- Use exact implementation values instead of vague taste words.\n- Include desktop and mobile QA, interaction states, and no-go rules.";
  const analysisBlock = analysisIsReady(analysis)
    ? [
        `- Extracted status: ${analysis.status}`,
        `- Page title: ${analysis.title || referenceName}`,
        `- Meta summary: ${analysis.description || "No meta description captured."}`,
        "",
        "Visible headings:",
        formatList(analysis.headings, "No headings captured; rely on manual inspection before build."),
        "",
        "Navigation and CTA labels:",
        formatList([...analysis.navLabels.slice(0, 5), ...analysis.ctaLabels.slice(0, 5)], "No nav or CTA labels captured."),
        "",
        "Layout, motion, and responsive hints:",
        formatList([...analysis.layoutHints, ...analysis.motionHints, ...analysis.responsiveHints], "Record layout, motion, and responsive behavior manually."),
        "",
        "Color and asset hints:",
        formatList([...analysis.colorHints, ...analysis.assetHints], "Replace all inspected assets with new licensed, generated, or provided assets."),
      ].join("\n")
    : "No automatic reference analysis yet. Inspect the URL manually, add screenshots, and record visible layout, hierarchy, motion, assets, and responsive behavior before implementation.";
  const screenshotBlock = screenshots.length
    ? screenshots.map((screenshot, index) => `- ${index + 1}. ${screenshot.label}: ${screenshot.name}${screenshot.width && screenshot.height ? ` (${screenshot.width}x${screenshot.height})` : ""}${screenshot.notes ? ` - ${screenshot.notes}` : ""}`).join("\n")
    : "- No screenshots attached yet. Capture desktop and mobile first-view evidence before build acceptance.";

  const sections = [
    `Reference source: ${normalizedUrl || "Add URL before build"} (${referenceName}).`,
    `New target: ${newBrand} - ${newOffer}.`,
    `Audience: ${audience}.`,
    `Keep: ${keep}`,
    `Change: ${change}`,
    `Evidence: ${analysisIsReady(analysis) ? "URL analysis ready" : "manual analysis needed"} / ${screenshots.length} screenshot(s).`,
  ];

  const prompt = [
    `Build a new website prompt for "${newBrand}" using ${referenceName} as a reference, not as a clone.`,
    toneInstruction(context.variantTone),
    "",
    "SOURCE WEBSITE REFERENCE",
    `- Reference URL: ${normalizedUrl || "[paste the current website URL]"}`,
    `- Reference label: ${referenceName}`,
    "- Use the source only for layout intelligence, interaction ideas, content density, hierarchy, motion pacing, and responsive behavior.",
    "- Do not copy protected copy, brand marks, proprietary imagery, exact visual identity, private data, or hidden implementation details.",
    "",
    "SOURCE URL ANALYSIS",
    analysisBlock,
    "",
    "SCREENSHOT EVIDENCE",
    screenshotBlock,
    "",
    "NEW SITE BRIEF",
    `- Brand/product: ${newBrand}`,
    `- Offer/category: ${newOffer}`,
    `- Audience: ${audience}`,
    `- What should carry over: ${keep}`,
    `- What must change: ${change}`,
    "",
    "1. Stack and dependencies",
    `Use ${stack}. Name every dependency, icon set, animation/runtime library, and any library that is explicitly not allowed. Keep the first screen a real usable website surface, not a marketing explanation page.`,
    "",
    "2. Fonts and global CSS",
    "Specify font import URLs or local font-face blocks, exact weights, CSS variables or Tailwind font extensions, body smoothing, root sizing, and which parts use each font. If the reference has distinct display/body voices, translate that split into a new type system.",
    "",
    "3. Color system",
    "Define background, foreground, muted text, border, surface, accent, hover, active, focus, and disabled colors with hex/HSL/rgba values. Preserve the reference's contrast logic and hierarchy, but use a new palette for the new brand.",
    "",
    "4. Assets and media behavior",
    `Asset plan: ${assets}`,
    "Describe every video/image/logo/icon slot with source rules, object-fit, focal point, load behavior, fallback behavior, and overlay rules. If a reference asset is inspected, describe its role and replace it with a new licensed/provided/generated asset.",
    "",
    "5. Layout and layer order",
    "Document the full section structure from top to bottom. Include max widths, grid/flex behavior, z-index/layer order, sticky/fixed regions, spacing, viewport rules, scroll behavior, and how the reference composition should be reinterpreted for the new site.",
    "",
    "6. Navigation and interactive controls",
    "Specify desktop and mobile navigation, dropdowns, menus, buttons, inputs, toggles, focus states, aria labels, disabled states, and hover/active transitions. Menus and dropdowns must match the new site's visual theme.",
    "",
    "7. Copy, sections, and exact styling",
    "Write the exact headline, subtext, CTAs, labels, badges, cards, stats, and footer/marquee content for the new brand. Provide class-level or CSS-level styling for each visible element, including sizes, line heights, tracking, radius, padding, and alignment.",
    "",
    "8. Motion and state mechanics",
    "Translate the reference motion into concrete state logic: animation triggers, duration, easing, stagger, loop behavior, requestAnimationFrame/ref cleanup when needed, reduced-motion handling, and interaction feedback. Avoid decorative motion that has no job.",
    "",
    "9. Responsive behavior",
    "Define mobile, tablet, desktop, and wide desktop behavior. Include text wrapping, nav collapse, media focal changes, card/grid changes, touch target sizes, scroll rules, and no horizontal overflow.",
    "",
    "10. Constraints and QA",
    `Constraints: ${constraints}`,
    "Inspired-not-cloned acceptance gates:",
    "- New brand name, copy, assets, color system, type scale, CTAs, and iconography are visibly different from the source.",
    "- The reference is cited only as evidence for structure, pacing, hierarchy, interaction behavior, and responsive decisions.",
    "- Desktop and mobile screenshots prove the new implementation has no clipped text, no horizontal overflow, no center-only scroll trap, and no framework error overlay.",
    "- Console health is clean; media renders nonblank; dropdowns and menus match the new theme; keyboard focus is visible.",
    "- A short comparison note explains what was preserved, what changed, and why the result is not a clone.",
    "",
    "LEARNED PROMPT RULES TO APPLY",
    ruleBlock,
    "",
    "REFERENCE OBSERVATION NOTES",
    pageNotes,
    context.repairNotes ? `\nREPAIR NOTES\n${context.repairNotes}` : "",
  ].join("\n");

  return {
    score: score.score,
    title: `${newBrand} from reference website`,
    summary: `Uses ${referenceName} as source evidence while producing a new implementation prompt for ${newBrand}.`,
    warnings: score.warnings,
    sections,
    prompt,
  };
}

export function scoreReferenceDifferentiation(
  input: WebsiteReferenceInput,
  prompt: string,
  analysis?: WebsiteReferenceAnalysis,
): WebsiteReferenceCloneScore {
  const combined = `${Object.values(input).join("\n")}\n${prompt}`;
  const normalizedUrl = normalizeReferenceUrl(input.url);
  let sourceHost = "";
  try {
    sourceHost = normalizedUrl ? new URL(normalizedUrl).hostname.replace(/^www\./, "") : "";
  } catch {
    sourceHost = "";
  }
  const referenceName = clean(input.referenceName);
  const checks: WebsiteReferenceCloneCheck[] = [
    {
      label: "New brand target",
      ready: countWords(input.newBrand) >= 1 && (!referenceName || !new RegExp(`\\b${referenceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(input.newBrand)),
      detail: input.newBrand ? `${input.newBrand} is named as the build target.` : "Name the new brand before export.",
    },
    {
      label: "New offer and audience",
      ready: countWords(input.newOffer) >= 5 && countWords(input.audience) >= 4,
      detail: "The prompt should say who the new site serves and what it offers.",
    },
    {
      label: "Explicit change list",
      ready: /new brand|new copy|new asset|new visual|do not clone|not as a clone/i.test(input.change),
      detail: "The change field should require new copy, visual system, assets, and mobile behavior.",
    },
    {
      label: "Protected source boundaries",
      ready: /do not copy|no cloned|protected|brand marks|proprietary|private/i.test(combined),
      detail: "The generated prompt must reject copied copy, marks, imagery, secrets, and hidden implementation details.",
    },
    {
      label: "Reference evidence",
      ready: analysisIsReady(analysis) || countWords(input.pageNotes) >= 10,
      detail: analysisIsReady(analysis) ? "URL/manual evidence is attached." : "Add URL analysis, screenshots, or manual notes.",
    },
    {
      label: "No domain carryover",
      ready: !sourceHost || !new RegExp(sourceHost.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(input.newBrand + input.newOffer),
      detail: sourceHost ? `The source domain (${sourceHost}) should not become the new brand.` : "No source domain found.",
    },
  ];
  let score = 36 + checks.filter((check) => check.ready).length * 10;
  if (/same logo|same copy|exact clone|pixel perfect clone|copy the source/i.test(combined)) score -= 28;
  if (secretPattern.test(combined)) score -= 24;
  const finalScore = clampScore(score);
  return {
    score: finalScore,
    status: finalScore >= 78 ? "ready" : finalScore >= 52 ? "watch" : "blocked",
    checks,
  };
}

export function buildWebsiteReferenceVariants(
  input: WebsiteReferenceInput,
  learnedRules: string[] = [],
  analysis?: WebsiteReferenceAnalysis,
  screenshots: WebsiteReferenceScreenshot[] = [],
): WebsiteReferenceVariant[] {
  const variants: { tone: WebsiteReferenceVariantTone; label: string; summary: string }[] = [
    { tone: "faithful", label: "Faithful structure", summary: "Closest to the reference layout logic while replacing brand, copy, assets, and palette." },
    { tone: "bold", label: "Bold reinterpretation", summary: "Uses the reference as evidence, then pushes composition, visual system, and motion further away." },
    { tone: "conversion", label: "Conversion path", summary: "Turns reference learning into a clearer CTA, proof, form, and mobile conversion sequence." },
  ];
  return variants.map((variant) => {
    const result = buildWebsiteReferencePrompt(input, learnedRules, { analysis, screenshots, variantTone: variant.tone });
    const cloneScore = scoreReferenceDifferentiation(input, result.prompt, analysis);
    const toneBonus = variant.tone === "bold" ? 4 : variant.tone === "conversion" ? 3 : 1;
    return {
      id: variant.tone,
      label: variant.label,
      tone: variant.tone,
      score: clampScore(Math.round(result.score * 0.62 + cloneScore.score * 0.38 + toneBonus)),
      summary: variant.summary,
      prompt: result.prompt,
    };
  });
}

export function buildWebsiteReferenceExports(
  input: WebsiteReferenceInput,
  result: WebsiteReferencePromptResult,
  variants: WebsiteReferenceVariant[],
  cloneScore: WebsiteReferenceCloneScore,
): WebsiteReferenceExport[] {
  const bestVariant = [...variants].sort((a, b) => b.score - a.score)[0] ?? variants[0];
  const compact = [
    `Create a new website for ${block(input.newBrand, "the new brand")} inspired by ${normalizeReferenceUrl(input.url) || "the provided reference URL"}.`,
    `Use the reference for structure and interaction evidence only; clone-safety score is ${cloneScore.score}/100.`,
    result.prompt,
  ].join("\n\n");
  const json = {
    schema: "prompt-atelier.website-reference-export.v1",
    sourceUrl: normalizeReferenceUrl(input.url),
    newBrand: input.newBrand,
    selectedVariant: bestVariant?.id,
    cloneScore,
    prompt: result.prompt,
    variants: variants.map(({ id, label, score, summary }) => ({ id, label, score, summary })),
  };
  return [
    {
      id: "codex",
      label: "Codex build",
      filename: "codex-reference-build-prompt.md",
      content: `${result.prompt}\n\nCODEX ACCEPTANCE\n- Implement, run lint/build, run rendered desktop/mobile proof, and report exact files changed.\n- Stop and report if source assets, secrets, or private APIs are required.`,
    },
    {
      id: "v0",
      label: "v0 prompt",
      filename: "v0-reference-website-prompt.md",
      content: compact.replace(/React \+ TypeScript \+ Vite \+ Tailwind CSS/gi, "React + Tailwind CSS"),
    },
    {
      id: "claude",
      label: "Claude artifact",
      filename: "claude-artifact-reference-prompt.md",
      content: `${compact}\n\nArtifact notes: keep everything in one artifact when possible, include accessibility labels, responsive states, and a short inspired-not-cloned comparison.`,
    },
    {
      id: "lovable",
      label: "Lovable prompt",
      filename: "lovable-reference-website-prompt.md",
      content: `${compact}\n\nLovable constraints: build the real first-screen experience, keep controls connected, avoid fake feature prose, and preserve the selected stack unless the tool requires an equivalent.`,
    },
    {
      id: "raw",
      label: "Raw spec",
      filename: "raw-reference-implementation-spec.md",
      content: result.prompt,
    },
    {
      id: "json",
      label: "JSON",
      filename: "website-reference-prompt.json",
      content: JSON.stringify(json, null, 2),
    },
  ];
}

export function buildWebsiteReferenceRepairPrompt(
  input: WebsiteReferenceInput,
  result: WebsiteReferencePromptResult,
  cloneScore: WebsiteReferenceCloneScore,
  screenshots: WebsiteReferenceScreenshot[] = [],
  notes = "",
) {
  const failingChecks = cloneScore.checks.filter((check) => !check.ready);
  return [
    `Repair the website-reference prompt for ${block(input.newBrand, "the new brand")}.`,
    "",
    "Current issue summary:",
    failingChecks.length
      ? failingChecks.map((check) => `- ${check.label}: ${check.detail}`).join("\n")
      : "- No clone-safety blockers remain; run visual proof and tighten any unclear implementation values.",
    screenshots.length
      ? `- Screenshot evidence attached: ${screenshots.map((item) => `${item.label} ${item.width && item.height ? `${item.width}x${item.height}` : ""}`.trim()).join(", ")}.`
      : "- Add desktop and mobile screenshots before final promotion.",
    notes ? `- Operator notes: ${notes}` : "",
    "",
    "Rewrite goals:",
    "- Preserve the source site's useful hierarchy, spacing rhythm, interaction ideas, and responsive decisions.",
    "- Replace brand, copy, color system, media/assets, CTAs, icons, and section content with original new-site decisions.",
    "- Add before/after comparison notes and explicit rendered QA gates.",
    "",
    "Current prompt to repair:",
    result.prompt,
  ].filter(Boolean).join("\n");
}

export function buildWebsiteReferenceProject(
  input: WebsiteReferenceInput,
  analysis: WebsiteReferenceAnalysis | undefined,
  screenshots: WebsiteReferenceScreenshot[],
  result: WebsiteReferencePromptResult,
  variants: WebsiteReferenceVariant[],
  selectedVariantId: WebsiteReferenceVariantTone,
  cloneScore: WebsiteReferenceCloneScore,
  exports: WebsiteReferenceExport[],
  repairPrompt: string,
): WebsiteReferenceProject {
  const createdAt = new Date().toISOString();
  return {
    id: `reference-project-${Date.now()}`,
    title: `${block(input.newBrand, "New site")} from ${block(input.referenceName, "reference")}`,
    url: normalizeReferenceUrl(input.url),
    input,
    analysis: activeAnalysis(input, analysis),
    screenshots,
    result,
    variants,
    selectedVariantId,
    cloneScore,
    exports,
    repairPrompt,
    createdAt,
  };
}

export function buildWebsiteReferenceStudio(
  input: WebsiteReferenceInput,
  learnedRules: string[] = [],
  analysis?: WebsiteReferenceAnalysis,
  screenshots: WebsiteReferenceScreenshot[] = [],
  selectedVariantId: WebsiteReferenceVariantTone = "faithful",
): WebsiteReferenceStudioResult {
  const active = activeAnalysis(input, analysis);
  const variants = buildWebsiteReferenceVariants(input, learnedRules, active, screenshots);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const result = buildWebsiteReferencePrompt(input, learnedRules, { analysis: active, screenshots, variantTone: selectedVariant.id });
  const cloneScore = scoreReferenceDifferentiation(input, result.prompt, active);
  const exports = buildWebsiteReferenceExports(input, result, variants, cloneScore);
  const repairPrompt = buildWebsiteReferenceRepairPrompt(input, result, cloneScore, screenshots);
  const project = buildWebsiteReferenceProject(input, active, screenshots, result, variants, selectedVariant.id, cloneScore, exports, repairPrompt);
  return { result, variants, selectedVariant, cloneScore, exports, repairPrompt, project };
}
