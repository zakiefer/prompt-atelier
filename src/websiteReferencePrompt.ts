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

export type WebsiteReferencePromptResult = {
  score: number;
  title: string;
  summary: string;
  warnings: string[];
  sections: string[];
  prompt: string;
};

const secretPattern = /(sk-ant|sk-proj|api[_-]?key|bearer\s+[a-z0-9._-]{16,}|password|secret|token)/i;

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

export function buildWebsiteReferencePrompt(input: WebsiteReferenceInput, learnedRules: string[] = []): WebsiteReferencePromptResult {
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
  const ruleBlock = learnedRules.length
    ? learnedRules.slice(0, 6).map((rule) => `- ${rule}`).join("\n")
    : "- Use exact implementation values instead of vague taste words.\n- Include desktop and mobile QA, interaction states, and no-go rules.";

  const sections = [
    `Reference source: ${normalizedUrl || "Add URL before build"} (${referenceName}).`,
    `New target: ${newBrand} - ${newOffer}.`,
    `Audience: ${audience}.`,
    `Keep: ${keep}`,
    `Change: ${change}`,
  ];

  const prompt = [
    `Build a new website prompt for "${newBrand}" using ${referenceName} as a reference, not as a clone.`,
    "",
    "SOURCE WEBSITE REFERENCE",
    `- Reference URL: ${normalizedUrl || "[paste the current website URL]"}`,
    `- Reference label: ${referenceName}`,
    "- Use the source only for layout intelligence, interaction ideas, content density, hierarchy, motion pacing, and responsive behavior.",
    "- Do not copy protected copy, brand marks, proprietary imagery, exact visual identity, private data, or hidden implementation details.",
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
    "Add acceptance gates: desktop and mobile screenshots, console health, no framework overlay, no clipped text, no scroll traps, keyboard focus check, dropdown/menu theme check, media render proof, and comparison notes explaining how the new site is inspired by the reference without cloning it.",
    "",
    "LEARNED PROMPT RULES TO APPLY",
    ruleBlock,
    "",
    "REFERENCE OBSERVATION NOTES",
    pageNotes,
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
