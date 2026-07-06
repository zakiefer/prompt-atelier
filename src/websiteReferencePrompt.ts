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

function isGenericReferenceLabel(value: string) {
  return /^(current reference website|manual reference notes|reference|reference site|source site)$/i.test(clean(value));
}

function referenceHostLabel(value: string) {
  const normalized = normalizeReferenceUrl(value);
  if (!normalized) return "";
  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./i, "");
    const domain = host.split(".").filter(Boolean)[0] ?? "";
    return domain
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}

function referenceLabel(input: WebsiteReferenceInput, analysis?: WebsiteReferenceAnalysis) {
  const analyzedTitle = clean(analysis?.title ?? "");
  if (analyzedTitle && !isGenericReferenceLabel(analyzedTitle)) return analyzedTitle;
  const namedReference = clean(input.referenceName);
  if (namedReference && !isGenericReferenceLabel(namedReference)) return namedReference;
  return referenceHostLabel(input.url) || namedReference || "reference site";
}

function splitTitleParts(value: string) {
  return clean(value)
    .split(/\s+(?:[-–—|:·•]\s+)|\s*[|]\s*/g)
    .map((part) => clean(part))
    .filter(Boolean);
}

function looksGenericTitlePart(value: string) {
  return /^(home|homepage|welcome|official site|website|about|services|contact|index)$/i.test(clean(value));
}

function inferBusinessName(input: WebsiteReferenceInput, analysis?: WebsiteReferenceAnalysis) {
  const host = referenceHostLabel(input.url);
  const titleParts = isGenericReferenceLabel(analysis?.title ?? "") ? [] : splitTitleParts(analysis?.title ?? "");
  const usefulTitle = titleParts.find((part) => !looksGenericTitlePart(part) && countWords(part) <= 7)
    || titleParts.find((part) => !looksGenericTitlePart(part))
    || "";
  if (usefulTitle) return usefulTitle;
  const heading = analysis?.status === "ready"
    ? analysis.headings.find((value) => {
        const words = countWords(value);
        return words >= 1 && words <= 7 && !/^(welcome|home|services|about|contact|get started|learn more)$/i.test(clean(value));
      })
    : "";
  return clean(heading ?? "") || host || block(input.referenceName, "the business");
}

function firstUsefulPhrase(values: string[], reject: RegExp, minWords = 5) {
  return values.map(clean).find((value) => countWords(value) >= minWords && !reject.test(value)) || "";
}

function inferBusinessOffer(analysis?: WebsiteReferenceAnalysis, brand = "the business") {
  const combined = [
    analysis?.description,
    ...(analysis?.headings ?? []),
    ...(analysis?.sectionLabels ?? []),
    ...(analysis?.ctaLabels ?? []),
    ...(analysis?.navLabels ?? []),
  ].filter(Boolean).join(" ");
  const lower = combined.toLowerCase();
  const description = clean(analysis?.description ?? "");
  if (countWords(description) >= 5 && !/^(home|welcome)$/i.test(description)) return description;
  const headingOffer = firstUsefulPhrase(analysis?.headings ?? [], /^(home|welcome|contact|about|services)$/i, 4);
  if (headingOffer) return headingOffer;
  if (/roof|shingle|metal|storm|hail|wind|inspection|estimate/i.test(lower)) {
    return `${brand} provides shingle roofing, metal roofing, storm-damage inspections, and residential/commercial roofing services.`;
  }
  if (/cheer|tumbling|dance|all[-\s]?star|gymnast/i.test(lower)) {
    return `${brand} provides all-star cheer, dance, tumbling, and youth training programs.`;
  }
  if (/dentist|dental|orthodont|smile|clinic/i.test(lower)) {
    return `${brand} provides dental care, appointments, patient education, and trust-building clinic information.`;
  }
  if (/restaurant|menu|reservation|dining|cafe|bar/i.test(lower)) {
    return `${brand} provides a restaurant website for menu discovery, reservations, location details, and guest trust.`;
  }
  if (/real estate|homes|property|listing|realtor/i.test(lower)) {
    return `${brand} helps visitors explore properties, local expertise, listings, and lead-capture paths.`;
  }
  if (/saas|software|platform|automation|dashboard|analytics/i.test(lower)) {
    return `${brand} presents a software platform with product education, proof, feature detail, and conversion paths.`;
  }
  if (/agency|studio|portfolio|creative|design/i.test(lower)) {
    return `${brand} presents a creative services website with portfolio proof, service positioning, and inquiry paths.`;
  }
  return `A redesigned website for ${brand} that explains the business, services, proof, and conversion path discovered from the current site.`;
}

function inferAudience(analysis?: WebsiteReferenceAnalysis, brand = "the business") {
  const combined = [
    analysis?.description,
    ...(analysis?.headings ?? []),
    ...(analysis?.sectionLabels ?? []),
    ...(analysis?.navLabels ?? []),
  ].filter(Boolean).join(" ").toLowerCase();
  if (/roof|shingle|metal|storm|hail|wind|inspection|estimate/i.test(combined)) {
    return "Homeowners, rural property owners, commercial property managers, and storm-damage leads in the Tri-State area.";
  }
  if (/cheer|tumbling|dance|all[-\s]?star|gymnast/i.test(combined)) {
    return "Athletes, parents, families, and local teams evaluating programs, schedules, tryouts, and proof of trust.";
  }
  if (/dentist|dental|orthodont|smile|clinic/i.test(combined)) {
    return "New and returning patients comparing services, appointment options, insurance details, and clinic credibility.";
  }
  if (/restaurant|menu|reservation|dining|cafe|bar/i.test(combined)) {
    return "Guests deciding where to eat, what to order, how to book, and whether the venue fits the occasion.";
  }
  if (/real estate|homes|property|listing|realtor/i.test(combined)) {
    return "Buyers, sellers, renters, and local property leads evaluating listings, expertise, and next steps.";
  }
  if (/saas|software|platform|automation|dashboard|analytics/i.test(combined)) {
    return "Prospective customers, operators, and decision-makers evaluating product fit, proof, pricing, and onboarding.";
  }
  if (/agency|studio|portfolio|creative|design/i.test(combined)) {
    return "Prospective clients evaluating creative fit, credibility, case studies, services, and inquiry options.";
  }
  return `Prospective customers, returning clients, and visitors evaluating ${brand}.`;
}

function combinedReferenceText(analysis?: WebsiteReferenceAnalysis) {
  return [
    analysis?.title,
    analysis?.description,
    ...(analysis?.headings ?? []),
    ...(analysis?.navLabels ?? []),
    ...(analysis?.ctaLabels ?? []),
    ...(analysis?.sectionLabels ?? []),
  ].filter(Boolean).join(" ").toLowerCase();
}

function inferBusinessCategory(analysis?: WebsiteReferenceAnalysis) {
  const text = combinedReferenceText(analysis);
  if (/roof|shingle|metal|storm|hail|wind|inspection|estimate/i.test(text)) return "roofing";
  if (/cheer|tumbling|dance|all[-\s]?star|gymnast/i.test(text)) return "youth athletics";
  if (/dentist|dental|orthodont|smile|clinic/i.test(text)) return "dental clinic";
  if (/restaurant|menu|reservation|dining|cafe|bar/i.test(text)) return "restaurant";
  if (/real estate|homes|property|listing|realtor/i.test(text)) return "real estate";
  if (/saas|software|platform|automation|dashboard|analytics/i.test(text)) return "software product";
  if (/agency|studio|portfolio|creative|design/i.test(text)) return "creative services";
  return "local service business";
}

function sourceAssetEvidence(analysis?: WebsiteReferenceAnalysis) {
  const assets = (analysis?.assetHints ?? []).slice(0, 4).map((asset) => {
    const trimmed = clean(asset);
    return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  });
  return assets.length
    ? assets.map((asset, index) => `- Source asset ${index + 1}: ${asset}`).join("\n")
    : "- No source media URL was captured. Define explicit logo, hero image, gallery, and fallback slots.";
}

function cleanObservationNotes(value: string) {
  const next = clean(value);
  if (!next || /^Learned taste hints:/i.test(next)) {
    return "No manual observation notes were added; use the source URL analysis and screenshots as evidence.";
  }
  return next;
}

function concreteReferenceBrief(target: ReturnType<typeof referenceTarget>, analysis: WebsiteReferenceAnalysis, stack: string, assets: string) {
  const category = inferBusinessCategory(analysis);
  const sourceColors = (analysis.colorHints ?? []).slice(0, 8).join(", ") || "No source colors captured.";
  const sourceAssets = sourceAssetEvidence(analysis);
  const base = {
    category,
    stack: `Use ${stack.replace(/\.+$/, "")}. Keep the page buildable in one Vite app, with no backend, routing, CMS, Supabase, or placeholder feature prose unless explicitly requested.`,
    fonts: "Import Google Fonts: Sora weights 500/600/700 for headings and Inter weights 400/500/600 for body/UI. Set CSS variables --font-display: 'Sora', sans-serif and --font-body: 'Inter', sans-serif. Body uses Inter; h1-h3, logo, and large stats use Sora.",
    palette: "Use --background #F8F6F1, --foreground #171717, --surface #FFFFFF, --surface-muted #EFE9DD, --muted #5E5E5E, --line rgba(27,27,27,0.12), --brand #CE2029, --brand-dark #8E1319, --accent #F5B02E, and --success #2F6F4E. Keep source red as a brand cue but modernize the surrounding palette.",
    assets: `Use current-source assets only when the client owns them; otherwise replace with new licensed/generated roof, team, project, and texture imagery. Captured source color hints: ${sourceColors}.\n${sourceAssets}\nAsset plan from operator: ${assets}`,
    layout: [
      "Full homepage, not just a hero. Section order: sticky header, split hero, trust strip, services grid, storm-damage CTA band, financing/quick approval panel, project proof/gallery, customer commitment section, contact/estimate form, footer.",
      "Use max-w-7xl mx-auto px-5 sm:px-8 lg:px-12. Hero min-height: 88vh desktop and auto mobile with generous top padding.",
      "Hero layout: left copy column and right inspection card/photo stack on desktop; stacked on mobile.",
      "Use rounded-[20px] cards, crisp borders, white surfaces, and red/charcoal action areas. Avoid generic SaaS gradients.",
    ].join("\n- "),
    nav: "Header: logo/wordmark left, desktop links Home, Roofing Services, Storm Damage, Financing, Contact, and a right-side phone pill '(270) 454-4801'. Mobile uses Menu/X and a full-width themed drawer with the same links plus 'Free Estimates'.",
    copy: [
      `H1: "Roofing that protects the Tri-State area."`,
      `Eyebrow: "Shingles • Metal Roofing • Storm Damage"`,
      `Subtext: "${target.newBrand} handles shingle, metal, rural, residential, and commercial roofing with free inspections, fast estimates, and storm-damage support."`,
      `Primary CTA: "Get a free inspection"`,
      `Secondary CTA: "Call (270) 454-4801"`,
      `Trust strip labels: "Free estimates", "Storm damage help", "Financing options", "Residential + commercial"`,
      `Service cards: "Shingle Roofing", "Metal Roofing", "Storm Damage Repair", "Commercial Projects"`,
      `Storm CTA headline: "Hail, wind, or fallen tree damage?" with body "Start with a clear inspection, photo documentation, and a straightforward repair plan."`,
      `Financing panel headline: "Quick approval when the roof cannot wait."`,
      `Contact form fields: Name, Phone, Email, Project type, Message. Submit label: "Request my inspection".`,
    ].join("\n- "),
    motion: "Use simple fade-rise reveals at 0.7s ease-out with 0.08s stagger for hero copy/cards. Buttons use transition-transform hover:scale-[1.02] active:scale-[0.98]. Respect prefers-reduced-motion by disabling reveal transforms.",
    responsive: "Mobile: header stays compact, hero stacks with CTA buttons full-width, cards become one column, phone CTA remains visible, form fields stack, no horizontal overflow. Tablet: services grid 2 columns. Desktop: services grid 4 columns and split hero.",
    qa: "Verify desktop 1440px and mobile 390px screenshots, no clipped text, no horizontal overflow, no center-only scroll trap, visible focus rings, working mobile drawer, form labels/aria labels, and console with no errors.",
  };
  if (category !== "roofing") {
    return {
      ...base,
      palette: "Use --background #F8F6F1, --foreground #171717, --surface #FFFFFF, --surface-muted #EFE9DD, --muted #5E5E5E, --line rgba(27,27,27,0.12), --brand #CE2029, --brand-dark #8E1319, and --accent #F5B02E. Use source colors as evidence, then refine into a cleaner modern service-business palette.",
      copy: [
        `H1: "${target.newBrand} rebuilt for clearer trust, faster decisions, and stronger conversion."`,
        `Eyebrow: "${category.toUpperCase()} WEBSITE REDESIGN"`,
        `Subtext: "${target.newOffer}"`,
        `Primary CTA: "Start a conversation"`,
        `Secondary CTA: "Explore services"`,
        `Trust strip labels: "Clear services", "Local proof", "Fast contact", "Mobile-first"`,
        `Core sections: "Services", "Proof", "Process", "Customer questions", "Contact"`,
      ].join("\n- "),
    };
  }
  return base;
}

function referenceTarget(input: WebsiteReferenceInput, analysis?: WebsiteReferenceAnalysis) {
  const referenceName = referenceLabel(input, analysis);
  const hasBrand = Boolean(clean(input.newBrand));
  const hasOffer = countWords(input.newOffer) >= 5;
  const hasAudience = countWords(input.audience) >= 4;
  const inferredBrand = inferBusinessName(input, analysis);
  const inferredOffer = inferBusinessOffer(analysis, inferredBrand);
  const inferredAudience = inferAudience(analysis, inferredBrand);
  return {
    audience: block(input.audience, inferredAudience),
    brandInferred: !hasBrand,
    inferenceMode: !hasBrand || !hasOffer || !hasAudience,
    offerInferred: !hasOffer,
    audienceInferred: !hasAudience,
    hasAudience,
    hasBrand,
    hasOffer,
    newBrand: block(input.newBrand, inferredBrand),
    newOffer: block(input.newOffer, inferredOffer),
    referenceName,
  };
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
  return {
    url: "",
    referenceName: "current reference website",
    newBrand: "",
    newOffer: "",
    audience: "",
    stack: "React + TypeScript + Vite + Tailwind CSS with lucide-react icons. Add motion libraries only if the reference behavior requires them.",
    keep: `Keep the reference site's strongest structural patterns and translate them through ${profileLabel}.`,
    change: "Keep the real business identity and services, but rewrite the copy, refresh the visual system, improve the section strategy, and make the mobile conversion path clearer. Do not clone the source layout.",
    pageNotes: "",
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
  const target = referenceTarget(input);
  if (target.newBrand) score += target.hasBrand ? 8 : 6;
  if (target.newOffer && countWords(target.newOffer) >= 5) score += target.hasOffer ? 14 : 10;
  if (target.audience && countWords(target.audience) >= 4) score += target.hasAudience ? 8 : 6;
  if (target.inferenceMode) {
    warnings.push("Business details were inferred from the website. Review them if the source site title or copy is unclear.");
  }
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
  const score = scoreWebsiteReferenceInput(input);
  const analysis = activeAnalysis(input, context.analysis);
  const target = referenceTarget(input, analysis);
  const { audience, inferenceMode, newBrand, newOffer, referenceName } = target;
  const stack = block(input.stack, "React + TypeScript + Vite + Tailwind CSS");
  const keep = block(input.keep, "Preserve only the reference site's useful structure, pacing, hierarchy, and interaction ideas.");
  const change = block(input.change, "Create new copy, styling, media, assets, brand marks, and interaction details.");
  const pageNotes = cleanObservationNotes(input.pageNotes);
  const assets = block(input.assets, "Use new, licensed, generated, or provided assets only.");
  const constraints = block(input.constraints, "Do not copy private assets, protected copy, brand marks, secrets, or provider keys.");
  const concrete = concreteReferenceBrief(target, analysis, stack, assets);
  const screenshots = context.screenshots?.slice(0, 6) ?? [];
  const ruleBlock = learnedRules.length
    ? learnedRules.slice(0, 6).map((rule) => `- ${rule}`).join("\n")
    : "- Use exact implementation values instead of vague taste words.\n- Include desktop and mobile QA, interaction states, and no-go rules.";
  const analysisBlock = analysisIsReady(analysis)
    ? [
        `- Extracted status: ${analysis.status}`,
        `- Page title: ${analysis.title && !isGenericReferenceLabel(analysis.title) ? analysis.title : referenceName}`,
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
    `Mode: ${inferenceMode ? "site-inferred brief; optional overrides available" : "target brief ready"}.`,
    `Reference source: ${normalizedUrl || "Add URL before build"} (${referenceName}).`,
    `New target: ${newBrand} - ${newOffer}.`,
    `Audience: ${audience}.`,
    `Keep: ${keep}`,
    `Change: ${change}`,
    `Evidence: ${analysisIsReady(analysis) ? "URL analysis ready" : "manual analysis needed"} / ${screenshots.length} screenshot(s).`,
  ];

  const prompt = [
    `Create a redesigned website for "${newBrand}" using React + TypeScript + Vite + Tailwind CSS.`,
    `Use its current website (${referenceName}) as source evidence for the real business, services, trust signals, CTAs, visual cues, and conversion needs. The result must be a fresh implementation, not a clone.`,
    toneInstruction(context.variantTone),
    inferenceMode
      ? [
          "",
          "SITE-INFERRED BUSINESS BRIEF",
          "- The business name, offer/category, and audience were inferred from the current site's title, metadata, headings, navigation, CTAs, and domain.",
          "- Use these inferred details as the default brief. Treat manual brand/offer/audience fields as optional overrides.",
          "- If the source website has weak metadata, preserve the inferred assumptions in the prompt and ask the builder to verify them against screenshots before final copywriting.",
        ].join("\n")
      : "",
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
    `- Business/product${target.brandInferred ? " (inferred)" : ""}: ${newBrand}`,
    `- Offer/category${target.offerInferred ? " (inferred)" : ""}: ${newOffer}`,
    `- Audience${target.audienceInferred ? " (inferred)" : ""}: ${audience}`,
    `- What should carry over: ${keep}`,
    `- What must change: ${change}`,
    inferenceMode
      ? [
          "",
          "INFERRED DETAILS TO VERIFY",
          `- Business inference: "${newBrand}".`,
          `- Offer inference: "${newOffer}".`,
          `- Audience inference: "${audience}".`,
          "- Keep the business identity and real services from the source site, but rewrite all copy, sections, proof, CTAs, and layout instructions for a stronger new website.",
        ].join("\n")
      : "",
    "",
    "1. Stack and dependencies",
    concrete.stack,
    "Use lucide-react icons for all interface icons. Do not add shadcn/ui, Supabase, routing, or chart libraries. The first screen must be the usable website, not an explanation about the redesign.",
    "",
    "2. Fonts and global CSS",
    concrete.fonts,
    "Set html, body, #root to min-height: 100%; apply antialiased text rendering; use body background var(--background) and color var(--foreground).",
    "",
    "3. Color system",
    concrete.palette,
    "Buttons: primary bg var(--brand) text-white hover:bg var(--brand-dark); secondary bg var(--charcoal) text-white; ghost links text var(--foreground) hover:text var(--brand). Focus rings use 3px rgba(206,32,41,0.22).",
    "",
    "4. Assets and media behavior",
    concrete.assets,
    "Hero image: roof/project/team image, object-cover, rounded-[28px], aspect-[4/3] desktop and aspect-[16/11] mobile. Logo: keep the client-owned logo if available; otherwise build a clean text wordmark. Every image needs alt text and a neutral background fallback.",
    "",
    "5. Layout and layer order",
    concrete.layout,
    "Layer order: page background, subtle roofline/texture accent if used, sticky header z-30, hero/content z-10, mobile drawer z-50. Avoid nested cards inside cards.",
    "",
    "6. Navigation and interactive controls",
    concrete.nav,
    "Controls: all buttons need hover, active, focus-visible states. Mobile drawer opens with state, locks body scroll while open, closes on link click and Escape, and uses themed white/charcoal/red styling.",
    "",
    "7. Copy, sections, and exact styling",
    concrete.copy,
    "Styling: h1 text-5xl sm:text-6xl lg:text-7xl leading-[0.96] tracking-[-0.04em] max-w-4xl; body copy text-base sm:text-lg leading-relaxed text var(--muted); CTA row flex-col mobile and row desktop; service cards min-h-[220px].",
    "",
    "8. Motion and state mechanics",
    concrete.motion,
    "Do not use continuous decorative parallax unless the source media requires it. Motion should clarify hierarchy and interaction state.",
    "",
    "9. Responsive behavior",
    concrete.responsive,
    "Touch targets must be at least 44px high. Long phone/CTA labels must wrap cleanly or shrink inside their containers.",
    "",
    "10. Constraints and QA",
    `Constraints: ${constraints}`,
    "Inspired-not-cloned acceptance gates:",
    "- The business name, services, phone number, and client-owned brand assets may remain because this is a redesign for the same business.",
    "- Layout, copywriting, section strategy, typography, color treatment, interaction states, and responsive behavior must be visibly refreshed from the source.",
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
    summary: inferenceMode
      ? `Inferred ${newBrand}'s business brief from ${referenceName} and generated a redesign prompt from the current site.`
      : `Uses ${referenceName} as source evidence while producing a new implementation prompt for ${newBrand}.`,
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
  const target = referenceTarget(input, analysis);
  const checks: WebsiteReferenceCloneCheck[] = [
    {
      label: "Business target",
      ready: countWords(target.newBrand) >= 1,
      detail: target.hasBrand ? `${input.newBrand} is named as the build target.` : `${target.newBrand} was inferred from the source site.`,
    },
    {
      label: "New offer and audience",
      ready: countWords(target.newOffer) >= 5 && countWords(target.audience) >= 4,
      detail: "The prompt should say who the new site serves and what it offers.",
    },
    {
      label: "Explicit change list",
      ready: /new brand|new copy|new asset|new visual|rewrite|refresh|redesign|do not clone|not as a clone/i.test(input.change),
      detail: "The change field should require refreshed copy, visual system, assets, and mobile behavior.",
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
      label: "Redesign not clone",
      ready: /redesigned|new website|new site|not as a clone|rewrite all copy|stronger new website/i.test(prompt),
      detail: sourceHost ? `The source domain (${sourceHost}) can identify the current business, but layout, copy, and assets must be redesigned.` : "No source domain found.",
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
  const target = referenceTarget(input);
  const compact = [
    `Create a new website for ${target.newBrand} inspired by ${normalizeReferenceUrl(input.url) || "the provided reference URL"}.`,
    target.inferenceMode ? "Business details are inferred from the current website; verify them against the source analysis and screenshots before final copywriting." : "",
    `Use the reference for structure and interaction evidence only; clone-safety score is ${cloneScore.score}/100.`,
    result.prompt,
  ].filter(Boolean).join("\n\n");
  const json = {
    schema: "prompt-atelier.website-reference-export.v1",
    sourceUrl: normalizeReferenceUrl(input.url),
    inferenceMode: target.inferenceMode,
    newBrand: target.newBrand,
    originalNewBrandInput: input.newBrand,
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
  const target = referenceTarget(input);
  return [
    `Repair the website-reference prompt for ${target.newBrand}.`,
    target.inferenceMode ? "Business details were inferred from the current website; preserve or sharpen that inference instead of asking the user to retype the brief." : "",
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
  const target = referenceTarget(input, analysis);
  return {
    id: `reference-project-${Date.now()}`,
    title: `${target.newBrand} from ${target.referenceName}`,
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
