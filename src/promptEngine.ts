export type PromptExample = {
  id: string;
  title: string;
  text: string;
  source: "seed" | "user" | "attachment";
  createdAt: string;
};

export type Feature = {
  label: string;
  count: number;
  examples: string[];
};

export type CategoryKey =
  | "stack"
  | "assets"
  | "typography"
  | "color"
  | "layout"
  | "motion"
  | "responsive"
  | "constraints"
  | "state"
  | "qa";

export type PromptProfile = {
  exampleCount: number;
  totalWords: number;
  averageWords: number;
  detailScore: number;
  categoryScores: Record<CategoryKey, number>;
  features: Record<CategoryKey, Feature[]>;
  learnedRules: string[];
  signaturePhrases: Feature[];
};

export type CorpusCurationCategory = "website-prompt" | "repo-task" | "code-review" | "raw-html" | "unknown";

export type CorpusCurationItem = {
  promptId: string;
  title: string;
  category: CorpusCurationCategory;
  confidence: number;
  recommendation: "learn" | "quarantine" | "review";
  reasons: string[];
};

export type CorpusCurationReport = {
  items: CorpusCurationItem[];
  counts: Record<CorpusCurationCategory | "learn" | "quarantine" | "review", number>;
  learnIds: string[];
  quarantineIds: string[];
  notes: string[];
};

export type PairwiseReviewRecord = {
  id: string;
  leftId: string;
  rightId: string;
  winnerId: string;
  loserId: string;
  reason: string;
  createdAt: string;
};

export type Evaluation = {
  score: number;
  categoryScores: Record<CategoryKey, number>;
  findings: string[];
  upgrades: string[];
};

export type DnaKey =
  | "visualSpecificity"
  | "technicalCompleteness"
  | "assetPrecision"
  | "motionState"
  | "responsiveDetail"
  | "constraintClarity"
  | "buildability";

export type DuplicateSignal = {
  kind: "none" | "near" | "exact";
  score: number;
  structuralScore?: number;
  reasons?: string[];
  match?: {
    id: string;
    title: string;
    source: PromptExample["source"];
  };
};

export type ArchetypeKey =
  | "cinematic-video-hero"
  | "liquid-glass-saas"
  | "product-commerce-hero"
  | "scroll-driven-archive"
  | "portfolio-agency"
  | "dashboard-saas"
  | "signup-interface"
  | "editorial-feature-section";

export type ArchetypeMatch = {
  key: ArchetypeKey;
  label: string;
  score: number;
  signals: string[];
};

export type ArchetypeCluster = ArchetypeMatch & {
  count: number;
  examples: string[];
};

export type PromptAnalysis = {
  title: string;
  wordCount: number;
  tags: string[];
  stack: string[];
  fonts: string[];
  colors: string[];
  assetCount: number;
  dna: Record<DnaKey, number>;
  archetypes: ArchetypeMatch[];
  duplicate: DuplicateSignal;
  recommendations: string[];
};

export type PromptTemplate = {
  id: string;
  title: string;
  bestFor: string;
  prompt: string;
};

export type StructuralSignature = {
  archetypes: string[];
  tags: string[];
  fonts: string[];
  stack: string[];
  assetBucket: string;
  headingBucket: string;
  classBucket: string;
};

export type CorpusHealth = {
  strengths: string[];
  gaps: string[];
  balance: Feature[];
  recommendations: string[];
};

export type ArchetypeMixOptions = {
  brandName: string;
  siteType: string;
  archetypes: string[];
  mood: string;
  constraints: string;
  includeAssets: boolean;
};

export type RecipeOptions = {
  industry: string;
  stack: string;
  layout: string;
  nav: string;
  motion: string;
  assets: string;
  strictness: number;
  brandName: string;
  audience: string;
};

export type QualityRubric = {
  cinematic: number;
  buildability: number;
  specificity: number;
  motion: number;
  restraint: number;
  accessibility: number;
};

export type PromptPack = {
  id: string;
  title: string;
  description: string;
  prompts: string[];
};

export type OutcomeRating = "unrated" | "great" | "okay" | "bad";

export type PromptStatus = "unrated" | "gold" | "good" | "experimental" | "avoid";

export type OutcomeRecord = {
  promptId: string;
  title: string;
  rating: OutcomeRating;
  status: PromptStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ScreenshotRecord = {
  id: string;
  promptId: string;
  title: string;
  url: string;
  notes: string;
  rating: OutcomeRating;
  createdAt: string;
};

export type SearchResult = {
  example: PromptExample;
  score: number;
  reasons: string[];
};

export type PromptDiffCategory = {
  key: CategoryKey | "archetypes" | "tags" | "fonts" | "colors";
  label: string;
  left: string[];
  right: string[];
  shared: string[];
  leftOnly: string[];
  rightOnly: string[];
};

export type PromptDiff = {
  similarity: number;
  summary: string[];
  categories: PromptDiffCategory[];
  mergedPrompt: string;
};

export type VisualQaItem = {
  label: string;
  score: number;
  notes: string[];
};

export type VisualQaReport = {
  score: number;
  items: VisualQaItem[];
  warnings: string[];
};

export type DriftReport = {
  score: number;
  warnings: string[];
  alignedSignals: string[];
  correctiveRules: string[];
};

export type InterviewBrief = {
  brandName: string;
  siteType: string;
  audience: string;
  goal: string;
  visualDirection: string;
  assets: string;
  stack: string;
  mustHaves: string;
  noGos: string;
  tone: string;
};

export type OutcomeSummary = {
  goldSignals: string[];
  avoidSignals: string[];
  notes: string[];
  counts: Record<OutcomeRating | PromptStatus, number>;
};

export type BuildStatus = "planned" | "running" | "passed" | "failed" | "needs-review";

export type FailureCategory =
  | "vague-layout"
  | "missing-assets"
  | "bad-mobile"
  | "too-many-libraries"
  | "text-overlap"
  | "weak-first-viewport"
  | "generic-design"
  | "runtime-error";

export type BuildRunRecord = {
  id: string;
  promptId: string;
  promptTitle: string;
  promptText: string;
  status: BuildStatus;
  resultUrl: string;
  folderPath: string;
  screenshotUrl: string;
  filesChanged: string;
  errors: string;
  notes: string;
  score: number;
  failureCategories: FailureCategory[];
  createdAt: string;
  updatedAt: string;
};

export type ResultScore = {
  score: number;
  checks: VisualQaItem[];
  failureCategories: FailureCategory[];
  recommendations: string[];
};

export type PromptMutation = {
  id: string;
  title: string;
  intent: string;
  prompt: string;
  score: number;
};

export type PromptRank = {
  example: PromptExample;
  score: number;
  dnaScore: number;
  outcomeBoost: number;
  originality: number;
  reasons: string[];
};

export type LocalEmbeddingIndex = {
  promptCount: number;
  weightedPromptCount: number;
  topTerms: Feature[];
  goldTerms: Feature[];
  avoidTerms: Feature[];
  notes: string[];
};

export type BuildRunnerPlan = {
  runId: string;
  runFolder: string;
  promptFile: string;
  handoff: string;
  commands: { label: string; command: string }[];
  nextSteps: string[];
};

export type ScreenshotQaReport = {
  score: number;
  items: VisualQaItem[];
  captureCommands: string[];
  notes: string[];
};

export type DnaCalibrationRow = {
  promptId: string;
  title: string;
  predicted: number;
  actual: number;
  delta: number;
};

export type DnaCalibrationReport = {
  predictedAverage: number;
  actualAverage: number;
  correlation: number;
  calibratedScore: number;
  rows: DnaCalibrationRow[];
  insights: string[];
};

export type CorpusDuplicateGroup = {
  kind: "exact" | "near";
  score: number;
  keep: PromptExample;
  matches: PromptExample[];
  reason: string;
};

export type CorpusCleaningReport = {
  exactDuplicates: CorpusDuplicateGroup[];
  nearDuplicates: CorpusDuplicateGroup[];
  weakPrompts: { example: PromptExample; score: number; reasons: string[] }[];
  archetypeBalance: { label: string; count: number; status: "dominant" | "healthy" | "thin" }[];
  recommendations: string[];
};

export type PromptCompilerInput = {
  roughIdea: string;
  brandName: string;
  siteType: string;
  audience: string;
  visualDirection: string;
  stack: string;
  assets: string;
  constraints: string;
};

export type CompiledPrompt = {
  prompt: string;
  score: number;
  sections: string[];
  assumptions: string[];
};

export type FailureMemoryReport = {
  categories: {
    category: FailureCategory;
    count: number;
    severity: number;
    prompts: string[];
    fix: string;
  }[];
  avoidRules: string[];
  promptPatch: string;
};

export type PromptTournament = {
  variants: PromptMutation[];
  finalists: PromptMutation[];
  recommendation: PromptMutation;
  scoringNotes: string[];
};

export type BuildQueueStatus = "queued" | "scaffolded" | "building" | "capturing" | "completed" | "failed";

export type BuildQueueJob = {
  id: string;
  promptId: string;
  promptTitle: string;
  promptText: string;
  variantTitle: string;
  status: BuildQueueStatus;
  runFolder: string;
  resultUrl: string;
  score: number;
  commands: { label: string; command: string }[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
};

export type PromptLineageNode = {
  id: string;
  parentId: string | null;
  promptId?: string;
  kind: "source" | "mutation" | "improved" | "compiled" | "tournament" | "build" | "outcome" | "screenshot";
  title: string;
  score: number;
  status: string;
  detail: string;
  createdAt: string;
};

export type ScoreBreakdown = {
  promptQuality: number;
  predictedBuild: number;
  actualResult: number;
  visualTaste: number;
  failureRisk: number;
  finalScore: number;
  notes: string[];
};

export type WeightedScoreComponents = {
  originality: number;
  buildability: number;
  visualTaste: number;
  exactness: number;
  mobile: number;
  outcomes: number;
};

export type VectorSearchResult = {
  example: PromptExample;
  score: number;
  reasons: string[];
};

export type SkillInstallPlan = {
  status: "unknown" | "exported" | "installable";
  targetPath: string;
  commands: string[];
  checklist: string[];
};

export type PromptImportCandidate = {
  id: string;
  title: string;
  text: string;
  sourceName: string;
  score: number;
  analysis: PromptAnalysis;
  summary: string[];
};

export type PromptMemoryExport = {
  markdown: string;
  json: string;
  sections: {
    title: string;
    items: string[];
  }[];
};

export type PromptDnaV2 = {
  overall: number;
  dimensions: {
    key: string;
    label: string;
    score: number;
    evidence: string[];
    fix: string;
  }[];
};

export type GoldenRecipe = {
  archetype: string;
  score: number;
  examples: string[];
  recipe: string[];
  avoid: string[];
};

export type PromptBattle = {
  variants: PromptMutation[];
  winner: PromptMutation;
  queuePlan: string[];
  explanation: string[];
};

export type DatasetVersion = {
  id: string;
  createdAt: string;
  label: string;
  counts: Record<string, number>;
  scores: Record<string, number>;
  notes: string[];
};

export type ReviewCandidate = {
  id: string;
  title: string;
  score: number;
  promptScore: number;
  resultScore: number;
  visualScore: number;
  status: PromptStatus | "missing";
  rating: OutcomeRating | "missing";
  evidence: string[];
  previewUrl: string;
};

export type GoldReviewReport = {
  left?: ReviewCandidate;
  right?: ReviewCandidate;
  winnerId?: string;
  loserId?: string;
  scoreDelta: number;
  learningUpdates: string[];
  notes: string[];
};

export type PromptWinSignal = {
  id: string;
  side: "left" | "right" | "shared";
  label: string;
  impact: number;
  detail: string;
};

export type PromptWinExplanationReport = {
  summary: string[];
  leftAdvantages: string[];
  rightAdvantages: string[];
  likelyWinningSignals: PromptWinSignal[];
  nextExperiment: string;
};

export type QualityGateCheck = {
  key: string;
  label: string;
  score: number;
  passed: boolean;
  evidence: string[];
  fix: string;
};

export type QualityGateReport = {
  score: number;
  ready: boolean;
  checks: QualityGateCheck[];
  blocking: string[];
  missing: string[];
  nextPromptPatch: string;
};

export type DatasetVersionComparison = {
  baseline?: DatasetVersion;
  current?: DatasetVersion;
  deltas: Record<string, number>;
  notes: string[];
};

export type GeneratorPreset = {
  id: string;
  title: string;
  archetype: string;
  bestFor: string;
  prompt: string;
  score: number;
  signals: string[];
};

export type ResultGalleryItem = {
  id: string;
  promptId: string;
  title: string;
  image: string;
  resultUrl: string;
  score: number;
  status: string;
  notes: string;
  createdAt: string;
};

export type ReusableMemoryPack = {
  markdown: string;
  json: string;
  sections: {
    title: string;
    count: number;
  }[];
};

export type PatternDashboardItem = {
  label: string;
  prompts: number;
  gold: number;
  avoid: number;
  averagePromptScore: number;
  averageResultScore: number;
  winRate: number;
  notes: string[];
};

export type PatternDashboardReport = {
  items: PatternDashboardItem[];
  summary: string[];
};

export type VisualRegressionReport = {
  score: number;
  checks: {
    label: string;
    passed: boolean;
    detail: string;
  }[];
  notes: string[];
};

export type PromptCoachReport = {
  score: number;
  diagnosis: string[];
  questions: string[];
  rewrittenPrompt: string;
};

export type ProjectExportPack = {
  markdown: string;
  json: string;
  sections: {
    title: string;
    count: number;
  }[];
};

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  stack: "Stack",
  assets: "Assets",
  typography: "Typography",
  color: "Color System",
  layout: "Layout Anatomy",
  motion: "Motion & State",
  responsive: "Responsive Rules",
  constraints: "Constraints",
  state: "Interactive Logic",
  qa: "Verification",
};

export const dnaLabels: Record<DnaKey, string> = {
  visualSpecificity: "Visual specificity",
  technicalCompleteness: "Technical completeness",
  assetPrecision: "Asset precision",
  motionState: "Motion/state detail",
  responsiveDetail: "Responsive detail",
  constraintClarity: "Constraint clarity",
  buildability: "Buildability",
};

const ARCHETYPES: Record<ArchetypeKey, { label: string; terms: string[] }> = {
  "cinematic-video-hero": {
    label: "Cinematic Video Hero",
    terms: ["video", "fullscreen", "hero", "autoplay", "loop", "muted", "playsinline", "cinematic"],
  },
  "liquid-glass-saas": {
    label: "Liquid Glass SaaS",
    terms: ["liquid-glass", "glassmorphic", "backdrop-filter", "saas", "navbar", "cta", "rounded-full"],
  },
  "product-commerce-hero": {
    label: "Product Commerce Hero",
    terms: ["product", "price", "cart", "shop", "commerce", "panel", "rating", "avatar"],
  },
  "scroll-driven-archive": {
    label: "Scroll-driven Archive",
    terms: ["scroll", "scrolltrigger", "gsap", "archive", "gallery", "outro", "marquee", "cursor"],
  },
  "portfolio-agency": {
    label: "Portfolio / Agency",
    terms: ["agency", "portfolio", "studio", "projects", "case", "creative", "work", "designer"],
  },
  "dashboard-saas": {
    label: "Dashboard SaaS",
    terms: ["dashboard", "analytics", "metrics", "platform", "workflow", "data", "automation", "insights"],
  },
  "signup-interface": {
    label: "Signup / Auth Interface",
    terms: ["sign up", "login", "password", "form", "input", "social", "account", "profile"],
  },
  "editorial-feature-section": {
    label: "Editorial Feature Section",
    terms: ["section", "cards", "feature", "grid", "static", "marketing", "subtitle", "badge"],
  },
};

const TAG_TERMS: Record<string, string[]> = {
  "video background": ["video", "mp4", "autoplay", "playsinline", "looping"],
  "liquid glass": ["liquid-glass", "glassmorphic", "backdrop-filter"],
  "mobile menu": ["hamburger", "mobile menu", "drawer", "overlay menu"],
  "scroll-driven": ["scrolltrigger", "scroll-driven", "usescroll", "scroll"],
  "marquee": ["marquee", "ticker", "infinite scrolling"],
  "product": ["product", "cart", "price", "shop", "commerce"],
  "dashboard": ["dashboard", "analytics", "metrics", "chart"],
  "portfolio": ["portfolio", "agency", "studio", "projects"],
  "signup": ["sign up", "login", "password", "form"],
  "plain css": ["plain css", "custom css", "no tailwind"],
  "hls": ["hls", "m3u8", "mux"],
  "gsap": ["gsap", "scrolltrigger"],
  "motion": ["framer motion", "motion/react", "motion.div"],
  "threejs": ["three.js", "threejs", "react-three-fiber"],
};

const KEYWORD_BANK: Record<CategoryKey, string[]> = {
  stack: [
    "react",
    "vite",
    "typescript",
    "tailwind",
    "framer-motion",
    "framer motion",
    "lucide-react",
    "shadcn",
    "cdn",
    "react 18",
  ],
  assets: [
    "url",
    "video",
    "image",
    "asset",
    "cloudfront",
    "figma.site",
    "background",
    "preload",
    "webp",
    "mp4",
  ],
  typography: [
    "font",
    "google fonts",
    "instrument serif",
    "inter",
    "kanit",
    "barlow",
    "playfair",
    "letterspacing",
    "tracking",
    "line-height",
  ],
  color: [
    "color",
    "background",
    "foreground",
    "hsl",
    "#",
    "rgba",
    "text-white",
    "primary",
    "muted",
    "gradient",
  ],
  layout: [
    "section",
    "navbar",
    "hero",
    "grid",
    "absolute",
    "relative",
    "z-index",
    "bottom",
    "left",
    "right",
    "max-w",
  ],
  motion: [
    "animation",
    "transition",
    "fade",
    "stagger",
    "requestanimationframe",
    "framer motion",
    "useinview",
    "usescroll",
    "keyframes",
    "duration",
  ],
  responsive: [
    "mobile",
    "responsive",
    "sm:",
    "md:",
    "lg:",
    "xl:",
    "breakpoint",
    "clamp",
    "100dvh",
    "hidden md",
  ],
  constraints: [
    "exactly",
    "no ",
    "must",
    "avoid",
    "critical",
    "do not",
    "match every detail",
    "no overlay",
    "default tailwind",
    "no extra",
  ],
  state: [
    "state",
    "useState",
    "useEffect",
    "ref",
    "listener",
    "mousemove",
    "resize",
    "navigate",
    "lock",
    "loop",
  ],
  qa: [
    "cleanup",
    "performance",
    "aria-label",
    "prefers-reduced-motion",
    "willchange",
    "lazy",
    "preload",
    "accessibility",
    "verify",
    "fallback",
  ],
};

const QUALITY_WEIGHTS: Record<CategoryKey, number> = {
  stack: 0.1,
  assets: 0.13,
  typography: 0.1,
  color: 0.1,
  layout: 0.16,
  motion: 0.13,
  responsive: 0.1,
  constraints: 0.08,
  state: 0.12,
  qa: 0.08,
};

const HEADING_PATTERNS = [
  /^#+\s+(.+)$/gm,
  /^([A-Z][A-Z\s&/-]{3,})$/gm,
  /^\d+\.\s+(.+)$/gm,
  /^SECTION\s+\d+[:\s-]+(.+)$/gim,
];

export const categoryLabels = CATEGORY_LABELS;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function titleFromPrompt(text: string, fallback = "Untitled prompt") {
  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return fallback;
  const cleaned = firstLine.replace(/^#+\s*/, "").replace(/^build prompt:\s*/i, "");
  return cleaned.length > 74 ? `${cleaned.slice(0, 71).trim()}...` : cleaned;
}

export function countWords(text: string) {
  return (text.match(/[A-Za-z0-9_'-]+/g) ?? []).length;
}

function countMatches(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.reduce((sum, term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = lower.match(new RegExp(escaped, "g"));
    return sum + (matches?.length ?? 0);
  }, 0);
}

function extractUrls(text: string) {
  return Array.from(new Set(text.match(/https?:\/\/[^\s)`\]]+/g) ?? []));
}

function extractHexColors(text: string) {
  return Array.from(new Set(text.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []));
}

function extractFontNames(text: string) {
  const knownFonts = [
    "Inter",
    "Instrument Serif",
    "DM Sans",
    "Urbanist",
    "Figtree",
    "Geist",
    "Outfit",
    "Poppins",
    "Source Serif 4",
    "Plus Jakarta Sans",
    "Readex Pro",
    "Helvetica Now Text",
    "DM Serif Display",
    "Barlow",
    "Fustat",
    "Manrope",
    "Cabin",
  ];
  const lower = text.toLowerCase();
  return knownFonts.filter((font) => lower.includes(font.toLowerCase()));
}

function normalizeForSimilarity(text: string) {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " url ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(text: string) {
  return new Set(
    normalizeForSimilarity(text)
      .split(" ")
      .filter((token) => token.length > 3),
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
}

function bucketCount(count: number) {
  if (count === 0) return "none";
  if (count <= 2) return "low";
  if (count <= 6) return "medium";
  return "high";
}

function setSimilarity(a: string[], b: string[]) {
  return jaccardSimilarity(new Set(a), new Set(b));
}

export function structureSignature(text: string): StructuralSignature {
  return {
    archetypes: analyzeArchetypeMatches(text)
      .filter((match) => match.score >= 25)
      .map((match) => match.key),
    tags: extractPromptTags(text),
    fonts: extractFontNames(text),
    stack: KEYWORD_BANK.stack
      .filter((term) => text.toLowerCase().includes(term))
      .map(normalizeTerm),
    assetBucket: bucketCount(extractUrls(text).length),
    headingBucket: bucketCount(extractHeadings(text).length),
    classBucket: bucketCount(extractClasses(text).length),
  };
}

export function structuralSimilarity(a: StructuralSignature, b: StructuralSignature) {
  const bucketScore =
    Number(a.assetBucket === b.assetBucket) * 0.1 +
    Number(a.headingBucket === b.headingBucket) * 0.08 +
    Number(a.classBucket === b.classBucket) * 0.07;

  return (
    setSimilarity(a.archetypes, b.archetypes) * 0.28 +
    setSimilarity(a.tags, b.tags) * 0.2 +
    setSimilarity(a.stack, b.stack) * 0.15 +
    setSimilarity(a.fonts, b.fonts) * 0.12 +
    bucketScore
  );
}

function semanticTokens(text: string) {
  const analysis = analyzePrompt(text);
  const signature = structureSignature(text);
  const words = Array.from(tokenSet(text)).filter((token) => token.length > 4);
  const weighted = [
    ...words,
    ...analysis.tags.flatMap((tag) => [tag, tag]),
    ...analysis.stack.flatMap((item) => [item.toLowerCase(), item.toLowerCase()]),
    ...analysis.fonts.map((font) => font.toLowerCase()),
    ...analysis.archetypes.flatMap((match) => [match.key, match.label.toLowerCase(), ...match.signals]),
    ...signature.archetypes,
    signature.assetBucket,
    signature.headingBucket,
    signature.classBucket,
  ];
  return new Set(weighted.map((token) => token.toLowerCase()).filter(Boolean));
}

function outcomeWeight(outcome?: OutcomeRecord) {
  if (!outcome) return 1;
  let weight = 1;
  if (outcome.rating === "great") weight += 0.25;
  if (outcome.rating === "bad") weight -= 0.22;
  if (outcome.status === "gold") weight += 0.3;
  if (outcome.status === "good") weight += 0.14;
  if (outcome.status === "experimental") weight -= 0.03;
  if (outcome.status === "avoid") weight -= 0.35;
  return Math.max(0.25, weight);
}

function unique(values: string[], limit = 12) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).slice(0, limit);
}

function extractCategorySignals(text: string, key: CategoryKey) {
  const lower = text.toLowerCase();
  const signals = KEYWORD_BANK[key].filter((term) => lower.includes(term)).map(normalizeTerm);
  if (key === "assets") signals.push(...extractUrls(text).map((url) => (url.includes(".mp4") ? "Video URL" : "Asset URL")));
  if (key === "color") signals.push(...extractHexColors(text));
  if (key === "typography") signals.push(...extractFontNames(text));
  if (key === "layout") signals.push(...extractHeadings(text).slice(0, 8), ...extractClasses(text).slice(0, 12));
  return unique(signals, 18);
}

function extractClasses(text: string) {
  return Array.from(
    new Set(
      text.match(
        /\b(?:text|bg|rounded|px|py|pt|pb|pl|pr|mt|mb|gap|grid|flex|absolute|relative|hidden|sm|md|lg|xl|z|w|h|max-w|min-h|tracking|leading)-\[[^\]]+\]|\b(?:text|bg|rounded|px|py|pt|pb|pl|pr|mt|mb|gap|grid|flex|absolute|relative|hidden|sm|md|lg|xl|z|w|h|max-w|min-h|tracking|leading)-[a-z0-9:/.[\]-]+/gi,
      ) ?? [],
    ),
  ).slice(0, 120);
}

function extractHeadings(text: string) {
  const found = new Set<string>();
  for (const pattern of HEADING_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const value = (match[1] ?? match[0]).trim().replace(/[:-]+$/, "");
      if (value.length >= 3 && value.length <= 80) found.add(value);
    }
  }
  return Array.from(found).slice(0, 40);
}

function pushFeature(map: Map<string, Feature>, label: string, exampleTitle: string, count = 1) {
  const key = label.trim();
  if (!key) return;
  const existing = map.get(key) ?? { label: key, count: 0, examples: [] };
  existing.count += count;
  if (!existing.examples.includes(exampleTitle)) existing.examples.push(exampleTitle);
  map.set(key, existing);
}

function makeFeatureList(map: Map<string, Feature>, limit = 12) {
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function scoreCategory(text: string, key: CategoryKey) {
  const matchCount = countMatches(text, KEYWORD_BANK[key]);
  const denseBonus = key === "layout" && extractHeadings(text).length > 4 ? 2 : 0;
  const urlBonus = key === "assets" ? Math.min(extractUrls(text).length, 8) : 0;
  const colorBonus = key === "color" ? Math.min(extractHexColors(text).length, 8) : 0;
  return Math.min(100, Math.round((matchCount + denseBonus + urlBonus + colorBonus) * 8));
}

export function classifyPromptForCuration(example: PromptExample): CorpusCurationItem {
  const text = `${example.title}\n${example.text}`.toLowerCase();
  const websiteSignals = [
    "landing page",
    "hero section",
    "navbar",
    "tailwind",
    "react",
    "vite",
    "css",
    "video background",
    "font",
    "responsive",
    "lucide",
    "framer",
    "motion",
    "single-page",
    "fullscreen",
  ].filter((signal) => text.includes(signal));
  const repoSignals = [
    "kapital-next",
    "hotfix",
    "pull request",
    "git ",
    "merge",
    "branch",
    "repo",
    "ci ",
    "commit",
    "staged",
    "smoke",
    "worktree",
  ].filter((signal) => text.includes(signal));
  const reviewSignals = ["code review", "reviewer", "findings", "regression", "bug risk"].filter((signal) => text.includes(signal));
  const htmlSignals = ["<!doctype html", "<html", "<head", "<style"].filter((signal) => text.includes(signal));

  let category: CorpusCurationCategory = "unknown";
  let recommendation: CorpusCurationItem["recommendation"] = "review";
  const reasons: string[] = [];
  let confidence = 42;

  if (repoSignals.length >= 2 && websiteSignals.length < 5) {
    category = "repo-task";
    recommendation = "quarantine";
    confidence = Math.min(98, 60 + repoSignals.length * 7);
    reasons.push(`Repo workflow signals: ${repoSignals.slice(0, 5).join(", ")}`);
  } else if (reviewSignals.length >= 2 && websiteSignals.length < 5) {
    category = "code-review";
    recommendation = "quarantine";
    confidence = Math.min(92, 58 + reviewSignals.length * 8);
    reasons.push(`Review workflow signals: ${reviewSignals.join(", ")}`);
  } else if (websiteSignals.length >= 4 || (htmlSignals.length && websiteSignals.length >= 2)) {
    category = htmlSignals.length ? "raw-html" : "website-prompt";
    recommendation = "learn";
    confidence = Math.min(98, 55 + websiteSignals.length * 5 + htmlSignals.length * 4);
    reasons.push(`Website build signals: ${websiteSignals.slice(0, 7).join(", ")}`);
  } else if (repoSignals.length) {
    category = "repo-task";
    recommendation = "review";
    confidence = Math.min(82, 45 + repoSignals.length * 6);
    reasons.push(`Possible repo task: ${repoSignals.slice(0, 4).join(", ")}`);
  } else {
    reasons.push("Not enough implementation or website-design signals.");
  }

  return {
    promptId: example.id,
    title: example.title,
    category,
    confidence,
    recommendation,
    reasons,
  };
}

export function curatePromptCorpus(
  examples: PromptExample[],
  decisions: Record<string, "learn" | "quarantine" | "review"> = {},
): CorpusCurationReport {
  const items = examples.map((example) => {
    const classified = classifyPromptForCuration(example);
    const override = decisions[example.id];
    return override ? { ...classified, recommendation: override, reasons: [`Manual override: ${override}`, ...classified.reasons] } : classified;
  });
  const counts = {
    "website-prompt": 0,
    "repo-task": 0,
    "code-review": 0,
    "raw-html": 0,
    unknown: 0,
    learn: 0,
    quarantine: 0,
    review: 0,
  } satisfies CorpusCurationReport["counts"];

  for (const item of items) {
    counts[item.category] += 1;
    counts[item.recommendation] += 1;
  }

  return {
    items,
    counts,
    learnIds: items.filter((item) => item.recommendation === "learn").map((item) => item.promptId),
    quarantineIds: items.filter((item) => item.recommendation === "quarantine").map((item) => item.promptId),
    notes: [
      `${counts.learn} prompt(s) are active learning material.`,
      `${counts.quarantine} prompt(s) are quarantined from recipe/memory generation.`,
      counts.review ? `${counts.review} prompt(s) need manual review.` : "No manual-review prompts detected.",
    ],
  };
}

export function analyzeCorpus(examples: PromptExample[]): PromptProfile {
  const featureMaps = Object.fromEntries(
    Object.keys(CATEGORY_LABELS).map((key) => [key, new Map<string, Feature>()]),
  ) as Record<CategoryKey, Map<string, Feature>>;
  const phraseMap = new Map<string, Feature>();
  const categoryTotals = Object.fromEntries(
    Object.keys(CATEGORY_LABELS).map((key) => [key, 0]),
  ) as Record<CategoryKey, number>;
  let totalWords = 0;

  for (const example of examples) {
    const text = example.text;
    const words = countWords(text);
    totalWords += words;

    for (const key of Object.keys(CATEGORY_LABELS) as CategoryKey[]) {
      categoryTotals[key] += scoreCategory(text, key);
    }

    for (const url of extractUrls(text)) {
      const kind = url.includes(".mp4") ? "Exact video URL" : "Exact image or asset URL";
      pushFeature(featureMaps.assets, kind, example.title);
    }

    for (const color of extractHexColors(text)) {
      pushFeature(featureMaps.color, color, example.title);
    }

    const lower = text.toLowerCase();
    for (const term of KEYWORD_BANK.stack) {
      if (lower.includes(term)) pushFeature(featureMaps.stack, normalizeTerm(term), example.title);
    }
    for (const term of ["inter", "instrument serif", "kanit", "barlow", "playfair display", "anton", "almarai"]) {
      if (lower.includes(term)) pushFeature(featureMaps.typography, normalizeTerm(term), example.title);
    }
    for (const term of [
      "liquid-glass",
      "glassmorphic",
      "noise-overlay",
      "bg-noise",
      "gradient",
      "dark cinematic",
      "raw video",
    ]) {
      if (lower.includes(term)) pushFeature(featureMaps.color, normalizeTerm(term), example.title);
    }
    for (const heading of extractHeadings(text)) {
      pushFeature(featureMaps.layout, heading, example.title);
    }
    for (const term of [
      "requestAnimationFrame",
      "Framer Motion",
      "fade-in",
      "fade-out",
      "stagger",
      "character-by-character",
      "scroll-driven",
      "word-by-word",
      "custom JS crossfade",
      "keyframes",
    ]) {
      if (lower.includes(term.toLowerCase())) pushFeature(featureMaps.motion, term, example.title);
    }
    for (const term of [
      "sm:",
      "md:",
      "lg:",
      "clamp()",
      "100dvh",
      "mobile-first",
      "hidden on mobile",
      "responsive breakpoints",
    ]) {
      if (lower.includes(term.toLowerCase())) pushFeature(featureMaps.responsive, term, example.title);
    }
    for (const term of ["NO overlay", "exactly", "must", "avoid", "default Tailwind", "no extra UI libraries"]) {
      if (lower.includes(term.toLowerCase())) pushFeature(featureMaps.constraints, term, example.title);
    }
    for (const term of [
      "activeIndex",
      "isAnimating",
      "mousemove",
      "resize",
      "useScroll",
      "useInView",
      "IntersectionObserver",
      "RevealLayer",
      "FadingVideo",
      "Magnet",
    ]) {
      if (lower.includes(term.toLowerCase())) pushFeature(featureMaps.state, term, example.title);
    }
    for (const term of [
      "cleanup",
      "aria-label",
      "prefers-reduced-motion",
      "willChange",
      "preload",
      "lazy loaded",
      "performance",
    ]) {
      if (lower.includes(term.toLowerCase())) pushFeature(featureMaps.qa, term, example.title);
    }

    for (const klass of extractClasses(text).slice(0, 24)) {
      pushFeature(featureMaps.layout, klass, example.title);
    }

    for (const phrase of [
      "Match every detail",
      "Here are the exact specifications",
      "No decorative blobs",
      "No dark overlay",
      "custom JavaScript fade system",
      "The video provides all visual depth",
      "Use these exactly",
      "complete specifications",
    ]) {
      if (lower.includes(phrase.toLowerCase())) pushFeature(phraseMap, phrase, example.title);
    }
  }

  const exampleCount = examples.length || 1;
  const categoryScores = Object.fromEntries(
    Object.entries(categoryTotals).map(([key, score]) => [
      key,
      Math.min(100, Math.round(score / exampleCount)),
    ]),
  ) as Record<CategoryKey, number>;

  const detailScore = Math.min(
    100,
    Math.round(
      Object.entries(categoryScores).reduce(
        (sum, [key, score]) => sum + score * QUALITY_WEIGHTS[key as CategoryKey],
        0,
      ),
    ),
  );

  const features = Object.fromEntries(
    Object.entries(featureMaps).map(([key, map]) => [key, makeFeatureList(map, 14)]),
  ) as Record<CategoryKey, Feature[]>;

  return {
    exampleCount: examples.length,
    totalWords,
    averageWords: examples.length ? Math.round(totalWords / examples.length) : 0,
    detailScore,
    categoryScores,
    features,
    learnedRules: buildLearnedRules(features, categoryScores),
    signaturePhrases: makeFeatureList(phraseMap, 8),
  };
}

export function detectDuplicatePrompt(text: string, examples: PromptExample[]): DuplicateSignal {
  const normalized = normalizeForSimilarity(text);
  const currentTokens = tokenSet(text);
  const currentStructure = structureSignature(text);
  let best: DuplicateSignal = { kind: "none", score: 0, structuralScore: 0, reasons: [] };

  for (const example of examples) {
    const candidate = normalizeForSimilarity(example.text);
    const exact = normalized.length > 0 && normalized === candidate;
    const wordingScore = exact ? 1 : jaccardSimilarity(currentTokens, tokenSet(example.text));
    const candidateStructure = structureSignature(example.text);
    const structuralScore = structuralSimilarity(currentStructure, candidateStructure);
    const score = exact ? 1 : Math.max(wordingScore, structuralScore);
    if (score > best.score) {
      const sharedArchetypes = currentStructure.archetypes.filter((key) => candidateStructure.archetypes.includes(key));
      const sharedTags = currentStructure.tags.filter((tag) => candidateStructure.tags.includes(tag)).slice(0, 4);
      const reasons = [
        exact ? "Exact normalized text match" : "",
        wordingScore >= 0.62 ? `Shared wording score ${Math.round(wordingScore * 100)}%` : "",
        structuralScore >= 0.72 ? `Shared structure score ${Math.round(structuralScore * 100)}%` : "",
        sharedArchetypes.length ? `Same archetype: ${sharedArchetypes.join(", ")}` : "",
        sharedTags.length ? `Shared tags: ${sharedTags.join(", ")}` : "",
      ].filter(Boolean);

      best = {
        kind: exact ? "exact" : wordingScore >= 0.62 || structuralScore >= 0.72 ? "near" : "none",
        score,
        structuralScore,
        reasons,
        match: {
          id: example.id,
          title: example.title,
          source: example.source,
        },
      };
    }
  }

  if (best.score < 0.62 && (best.structuralScore ?? 0) < 0.72) {
    return { kind: "none", score: best.score, structuralScore: best.structuralScore, match: best.match, reasons: best.reasons };
  }
  return best;
}

export function analyzeArchetypeMatches(text: string): ArchetypeMatch[] {
  const lower = text.toLowerCase();
  return Object.entries(ARCHETYPES)
    .map(([key, archetype]) => {
      const signals = archetype.terms.filter((term) => lower.includes(term));
      return {
        key: key as ArchetypeKey,
        label: archetype.label,
        score: Math.min(100, Math.round((signals.length / archetype.terms.length) * 100)),
        signals,
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}

export function analyzeArchetypeClusters(examples: PromptExample[]): ArchetypeCluster[] {
  const clusters = new Map<ArchetypeKey, ArchetypeCluster>();

  for (const example of examples) {
    const topMatches = analyzeArchetypeMatches(example.text).slice(0, 2);
    for (const match of topMatches) {
      const existing =
        clusters.get(match.key) ??
        ({
          ...match,
          count: 0,
          examples: [],
          signals: [],
          score: 0,
        } satisfies ArchetypeCluster);
      existing.count += 1;
      existing.score += match.score;
      existing.examples.push(example.title);
      existing.signals = Array.from(new Set([...existing.signals, ...match.signals])).slice(0, 8);
      clusters.set(match.key, existing);
    }
  }

  return Array.from(clusters.values())
    .map((cluster) => ({
      ...cluster,
      score: Math.round(cluster.score / cluster.count),
      examples: cluster.examples.slice(0, 5),
    }))
    .sort((a, b) => b.count - a.count || b.score - a.score);
}

export function extractPromptTags(text: string) {
  const lower = text.toLowerCase();
  const tags = Object.entries(TAG_TERMS)
    .filter(([, terms]) => terms.some((term) => lower.includes(term)))
    .map(([tag]) => tag);

  for (const term of KEYWORD_BANK.stack) {
    if (lower.includes(term)) tags.push(normalizeTerm(term));
  }

  return Array.from(new Set(tags)).slice(0, 12);
}

export function analyzePrompt(text: string, examples: PromptExample[] = []): PromptAnalysis {
  const evaluation = evaluatePrompt(text);
  const lower = text.toLowerCase();
  const stack = KEYWORD_BANK.stack
    .filter((term) => lower.includes(term))
    .map(normalizeTerm);
  const assetCount = extractUrls(text).length;
  const tags = extractPromptTags(text);
  const dna: Record<DnaKey, number> = {
    visualSpecificity: Math.min(100, Math.round((evaluation.categoryScores.layout + evaluation.categoryScores.color) / 2)),
    technicalCompleteness: evaluation.categoryScores.stack,
    assetPrecision: evaluation.categoryScores.assets,
    motionState: Math.min(100, Math.round((evaluation.categoryScores.motion + evaluation.categoryScores.state) / 2)),
    responsiveDetail: evaluation.categoryScores.responsive,
    constraintClarity: evaluation.categoryScores.constraints,
    buildability: Math.min(
      100,
      Math.round(
        (evaluation.categoryScores.stack +
          evaluation.categoryScores.layout +
          evaluation.categoryScores.constraints +
          evaluation.categoryScores.qa) /
          4,
      ),
    ),
  };

  return {
    title: titleFromPrompt(text, "Untitled prompt"),
    wordCount: countWords(text),
    tags,
    stack: Array.from(new Set(stack)),
    fonts: extractFontNames(text),
    colors: extractHexColors(text),
    assetCount,
    dna,
    archetypes: analyzeArchetypeMatches(text).slice(0, 4),
    duplicate: detectDuplicatePrompt(text, examples),
    recommendations: evaluation.upgrades,
  };
}

function normalizeTerm(term: string) {
  const lower = term.toLowerCase();
  const labels: Record<string, string> = {
    react: "React",
    vite: "Vite",
    typescript: "TypeScript",
    tailwind: "Tailwind CSS",
    "framer-motion": "Framer Motion",
    "framer motion": "Framer Motion",
    "lucide-react": "lucide-react",
    shadcn: "shadcn/ui",
    cdn: "CDN-only build",
    "react 18": "React 18",
    inter: "Inter",
    "instrument serif": "Instrument Serif",
    kanit: "Kanit",
    barlow: "Barlow",
    "playfair display": "Playfair Display",
    anton: "Anton",
    almarai: "Almarai",
    "liquid-glass": "Liquid glass CSS",
    glassmorphic: "Glassmorphic navigation",
    "noise-overlay": "SVG noise overlay",
    "bg-noise": "Noise texture background",
    gradient: "Gradient treatment",
    "dark cinematic": "Dark cinematic palette",
    "raw video": "Raw video, no overlay",
  };
  return labels[lower] ?? term;
}

function buildLearnedRules(features: Record<CategoryKey, Feature[]>, scores: Record<CategoryKey, number>) {
  const rules: string[] = [];

  rules.push("Start with the exact build target: framework, language, styling system, icon library, animation library, and any libraries that are explicitly not allowed.");
  rules.push("Name the visual signature up front: fullscreen video, cursor spotlight, carousel, sticky stack, marquee, glass navigation, or another single memorable mechanic.");
  rules.push("Specify fonts like implementation data: import method, weights, CSS variables or Tailwind extension, and which UI parts use each face.");
  rules.push("Write color as tokens and real values: hex, HSL, rgba, foreground/background, muted text, borders, and hover states.");
  rules.push("Describe the layout by section and layer order, including positioning, z-index, spacing, responsive breakpoints, and exact copy.");

  if (features.motion.length || scores.motion > 50) {
    rules.push("For motion, describe the state machine and timing, not only the feeling: refs, locks, requestAnimationFrame loops, delays, easing, cleanup, and reduced-motion behavior.");
  }
  if (features.assets.length) {
    rules.push("Use exact asset URLs whenever assets matter, and include object-fit, focal position, preload or lazy-loading behavior, and overlay rules.");
  }
  if (features.constraints.length) {
    rules.push("End with constraints and no-go rules: overlays, gradients, extra libraries, decorative effects, placeholder assets, or anything that would change the intended look.");
  }
  rules.push("Close with responsive expectations and verification notes so implementation quality is measurable, not left to taste.");

  return rules;
}

export function evaluatePrompt(text: string): Evaluation {
  const scores = Object.fromEntries(
    (Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => [key, scoreCategory(text, key)]),
  ) as Record<CategoryKey, number>;

  const score = Math.round(
    Object.entries(scores).reduce(
      (sum, [key, categoryScore]) => sum + categoryScore * QUALITY_WEIGHTS[key as CategoryKey],
      0,
    ),
  );

  const findings: string[] = [];
  const upgrades: string[] = [];

  for (const key of Object.keys(CATEGORY_LABELS) as CategoryKey[]) {
    if (scores[key] >= 72) findings.push(`${CATEGORY_LABELS[key]} is strongly specified.`);
    if (scores[key] < 35) upgrades.push(upgradeForCategory(key));
  }

  if (countWords(text) < 250) {
    upgrades.push("Expand the prompt into section-by-section implementation instructions; strong website prompts in this corpus are usually much more explicit.");
  }
  if (!extractUrls(text).length) {
    upgrades.push("Add exact video, image, or asset URLs when the design depends on specific visuals.");
  }
  if (!/(no|avoid|must|exact|critical|do not)/i.test(text)) {
    upgrades.push("Add hard constraints such as no overlays, no extra libraries, exact copy, or required interaction behavior.");
  }

  return {
    score,
    categoryScores: scores,
    findings: findings.slice(0, 8),
    upgrades: Array.from(new Set(upgrades)).slice(0, 10),
  };
}

function upgradeForCategory(key: CategoryKey) {
  const upgrades: Record<CategoryKey, string> = {
    stack: "Name the exact stack and dependency boundaries, including any banned libraries.",
    assets: "Add exact asset URLs, media behavior, object-fit, focal point, and preload or loop behavior.",
    typography: "Specify font imports, weights, CSS variables or Tailwind extensions, and exact heading/body usage.",
    color: "Define the color system with hex/HSL/rgba tokens, text states, borders, surfaces, and hover colors.",
    layout: "Break the prompt into named sections with layer order, z-index, spacing, alignment, and exact copy.",
    motion: "Specify animation timing, easing, delays, state changes, and cleanup behavior.",
    responsive: "Add mobile/tablet/desktop breakpoint behavior with Tailwind prefixes or clamp() values.",
    constraints: "Add no-go rules that protect the visual intent from unwanted overlays, gradients, stock assets, or extra UI.",
    state: "Describe interactive state, refs, event listeners, locks, and derived values for dynamic mechanics.",
    qa: "Add accessibility, reduced-motion, performance, preload/lazy-load, cleanup, and verification notes.",
  };
  return upgrades[key];
}

export type ComposeOptions = {
  brief: string;
  brandName: string;
  siteType: string;
  visualSignature: string;
  archetype: string;
  mood: string;
  outputFlavor: string;
  detailLevel: number;
  creativity: number;
  rigor: number;
  includeAssets: boolean;
  includeMotion: boolean;
  includeQA: boolean;
};

function topLabels(features: Feature[] | undefined, fallback: string[], count = 4) {
  const values = features?.map((feature) => feature.label).filter(Boolean) ?? [];
  return [...values, ...fallback].slice(0, count);
}

export function composePrompt(profile: PromptProfile, options: ComposeOptions) {
  const brand = options.brandName.trim() || "the brand";
  const brief = options.brief.trim() || "a premium website experience with a strong first viewport and a memorable interactive mechanic";
  const siteType = options.siteType.trim() || "single-page website";
  const signature = options.visualSignature.trim() || "fullscreen cinematic hero with one distinctive interaction";
  const archetype = options.archetype.trim() || "learned high-fidelity landing page";
  const mood = options.mood.trim() || "premium, precise, and buildable";
  const outputFlavor = options.outputFlavor.trim() || "Codex-build-ready";
  const detail = Math.max(1, Math.min(10, options.detailLevel));
  const creativity = Math.max(1, Math.min(10, options.creativity));
  const rigor = Math.max(1, Math.min(10, options.rigor));

  const stacks = topLabels(profile.features.stack, ["React 18", "TypeScript", "Vite", "Tailwind CSS", "lucide-react"], 5);
  const fonts = topLabels(profile.features.typography, ["Inter", "Instrument Serif"], 3);
  const layoutSignals = topLabels(profile.features.layout, ["Hero", "Navigation", "Section order", "Bottom content"], 5);
  const motionSignals = topLabels(profile.features.motion, ["Framer Motion", "requestAnimationFrame", "staggered reveal"], 4);
  const constraints = topLabels(profile.features.constraints, ["Match every detail", "No decorative blobs", "No extra UI libraries"], 4);

  const density = detail >= 8 ? "complete specifications" : detail >= 5 ? "implementation-ready specifications" : "clear build specifications";
  const motionDepth =
    options.includeMotion && rigor >= 7
      ? "Describe animation as stateful mechanics with exact delays, easing, refs/listeners, cleanup, and reduced-motion behavior."
      : "Describe entrance and hover animations with timing, easing, and trigger conditions.";
  const creativeMode =
    creativity >= 8
      ? "Give the concept one bold signature mechanic, but keep implementation details exact and buildable."
      : "Keep the design restrained, cinematic, and implementation-focused.";

  const assetBlock = options.includeAssets
    ? `\nASSET SYSTEM\n- Use exact production asset URLs for any video, image, GIF, or texture. If assets are not available yet, create clearly named placeholders like HERO_VIDEO_URL and describe object-fit, focal point, crop, preload, autoplay/loop/muted/playsInline behavior, and overlay rules.\n- For every visual asset, specify z-index/layer, dimensions or aspect ratio, object-position, and whether it should be preloaded, lazy-loaded, or manually looped.`
    : `\nASSET SYSTEM\n- Do not depend on unspecified stock imagery. If no assets are supplied, define the art direction and reserve named asset slots that can be replaced later.`;

  const qaBlock = options.includeQA
    ? `\nQUALITY BAR\n- Include accessibility labels for icon-only controls, keyboard/focus states for interactive elements, cleanup for event listeners or animation frames, and prefers-reduced-motion behavior.\n- Verify desktop and mobile behavior, text wrapping, video/image loading, and that the signature mechanic works without layout shift.\n- Hard no-go rules: no accidental overlays, no decorative blobs unless explicitly requested, no unlisted UI libraries, no placeholder boxes, no generic marketing sections.`
    : "";

  return `Build a ${siteType} for "${brand}" using ${stacks.join(" + ")}. ${density}: ${brief}

VISUAL SIGNATURE
Archetype: ${archetype}. Mood: ${mood}. Output flavor: ${outputFlavor}.
${signature}. ${creativeMode} State exactly what makes the first viewport memorable and which visual element carries depth.

TECH STACK
- Framework and language: ${stacks.slice(0, 3).join(", ")}.
- Styling and UI: ${stacks.slice(3).join(", ") || "Tailwind CSS with code-native components"}.
- Do not add libraries outside this list unless the prompt explicitly says so.

TYPOGRAPHY
- Load Google Fonts or local fonts explicitly. Use ${fonts.join(" + ")} as the starting pairing unless the brand direction requires another pair.
- Specify import method, available weights, global body font, display font, heading usage, letter spacing, line height, and responsive type scale.

COLOR SYSTEM
- Define background, foreground, muted text, borders, surfaces, accent, hover, and focus colors with exact hex/HSL/rgba values.
- If glass, video, or dark cinematic styling is used, define the glass background, blur, border trick, shadow, and overlay policy exactly.

LAYOUT & SECTION ORDER
- Start with the root wrapper and global body styles.
- Then describe each section in order. Use named sections such as ${layoutSignals.join(", ")}.
- For each section, specify position, display mode, width/height, padding, z-index layering, alignment, exact visible copy, controls, and responsive behavior.
- For navigation, list logo, links, CTA labels, hidden/mobile behavior, active states, hover states, and spacing.
${assetBlock}

INTERACTION & MOTION
${motionDepth}
- Use concrete values: durations in ms, delays, easing curves, transform values, opacity states, locks, derived indexes, cursor math, scroll ranges, and cleanup.
- Learned motion patterns to consider: ${motionSignals.join(", ")}.

RESPONSIVE RULES
- Define mobile, tablet, desktop, and wide viewport behavior with Tailwind prefixes, clamp(), aspect-ratio, 100dvh, or exact breakpoints.
- State which elements hide, reflow, resize, or change anchoring on small screens.

CONSTRAINTS
- ${constraints.join("\n- ")}
- Preserve exact copy, asset URLs, typography, colors, animation timing, and component anatomy.
- Avoid vague instructions like "make it modern" unless paired with exact implementation details.
${qaBlock}`;
}

export function rewritePrompt(text: string, profile: PromptProfile) {
  const analysis = analyzePrompt(text);
  const strongestArchetype = analysis.archetypes[0]?.label ?? "high-fidelity website";
  const missing = analysis.recommendations.slice(0, 5);
  const stack = analysis.stack.length ? analysis.stack.join(" + ") : topLabels(profile.features.stack, ["React", "Vite", "Tailwind CSS"], 3).join(" + ");
  const fonts = analysis.fonts.length ? analysis.fonts.join(" + ") : topLabels(profile.features.typography, ["Inter", "Instrument Serif"], 2).join(" + ");
  const constraints = topLabels(profile.features.constraints, ["Use exact values", "No unlisted UI libraries", "Preserve responsive behavior"], 4);
  const motion = topLabels(profile.features.motion, ["staggered reveal", "requestAnimationFrame where needed", "reduced-motion fallback"], 3);

  return `REWRITTEN HIGH-FIDELITY PROMPT

Create a ${strongestArchetype} experience using ${stack}. Use ${fonts} for typography unless the brand direction below requires a more specific pairing.

SOURCE INTENT
${text.trim() || "Describe the intended brand, product, audience, and visual direction here."}

IMPLEMENTATION SPEC
- Start with the exact stack, package boundaries, file structure, and global CSS setup.
- Define the root wrapper, background layer, navigation, hero content, supporting sections, and footer or bottom strip in build order.
- For every visible element, include exact copy, placement, z-index/layering, spacing, sizing, color values, hover/focus states, and responsive behavior.
- If media is part of the concept, provide exact asset URLs and specify autoplay/loop/muted/playsInline, object-fit, object-position, preload strategy, and overlay policy.
- Motion should be explicit: ${motion.join(", ")}. Include timing, easing, delays, state locks, event listeners, cleanup, and reduced-motion behavior.
- Constraints:
  - ${constraints.join("\n  - ")}

QUALITY CHECK
- Verify desktop and mobile layouts.
- Confirm text does not overlap, buttons retain stable dimensions, media loads, and interaction state is clear.
- Add ARIA labels for icon-only controls and keyboard/focus states for interactive elements.

GAPS TO FILL
${missing.length ? missing.map((item) => `- ${item}`).join("\n") : "- No major gaps detected; preserve the level of specificity."}`;
}

export function buildPromptTemplates(profile: PromptProfile): PromptTemplate[] {
  const stacks = topLabels(profile.features.stack, ["React", "TypeScript", "Vite", "Tailwind CSS"], 4).join(" + ");
  const fonts = topLabels(profile.features.typography, ["Inter", "Instrument Serif"], 2).join(" + ");
  const motion = topLabels(profile.features.motion, ["staggered reveal", "requestAnimationFrame loop"], 3).join(", ");
  const constraints = topLabels(profile.features.constraints, ["No extra UI libraries", "Use exact asset URLs"], 3);

  return [
    {
      id: "cinematic-hero",
      title: "Cinematic Video Hero",
      bestFor: "Premium landing pages with one strong first-viewport visual.",
      prompt: `Build a fullscreen cinematic hero for [BRAND] using ${stacks}. Load ${fonts}. Use a looping video background with exact asset URL [VIDEO_URL], autoplay, muted, loop, playsInline, object-cover, and an explicit overlay policy. Include a responsive navbar, hero headline, subtext, CTA row, and bottom supporting detail. Define exact colors, spacing, z-index layers, hover states, and responsive breakpoints. Motion: ${motion}. Constraints: ${constraints.join("; ")}.`,
    },
    {
      id: "liquid-glass-saas",
      title: "Liquid Glass SaaS",
      bestFor: "Software products, dashboards, security, AI, fintech, and workflow tools.",
      prompt: `Create a high-fidelity SaaS hero for [PRODUCT] using ${stacks}. Define a liquid-glass utility with rgba background, backdrop-filter blur, inset highlight, and masked gradient border. Include a pill navbar, clear value proposition, CTA pair, product proof/stat block, and responsive mobile menu. Specify fonts, exact colors, layout dimensions, glass states, icon library, and all hover/focus behavior. Add QA notes for mobile, keyboard, and reduced motion.`,
    },
    {
      id: "product-commerce",
      title: "Product Commerce Hero",
      bestFor: "CPG, wellness, pet, fashion, supplements, and launch pages.",
      prompt: `Build a product-led landing hero for [BRAND] using ${stacks}. Use exact product image URLs, a strong display headline, shop/cart navigation, CTA button, social proof, pricing/rating or stats, and a bottom panel/grid. Specify image aspect ratios, object-fit, overlap/bleed behavior, responsive mobile/tablet/desktop compositions, and staggered reveal timing. Preserve exact brand colors and no unlisted assets.`,
    },
    {
      id: "scroll-archive",
      title: "Scroll-driven Archive",
      bestFor: "Fashion, portfolio, editorial, and art-direction-heavy pages.",
      prompt: `Create a scroll-driven archive page for [BRAND] using ${stacks}. Define scroll phases, pinned layers, gallery layout algorithm, cursor or scrub interaction, outro overlay, and exact media assets. Use RAF or GSAP-style state descriptions with scroll ranges, transforms, scale/opacity rules, cleanup, and reduced-motion fallback. All overlays should specify pointer-events, mix-blend-mode, z-index, and responsive behavior.`,
    },
    {
      id: "auth-interface",
      title: "Signup / Registration Interface",
      bestFor: "Product onboarding, private beta, dashboards, and membership flows.",
      prompt: `Build a two-column registration interface for [PRODUCT] using ${stacks}. Include a visual/media panel, animated step/progress copy, social auth buttons, form fields, password helper/toggle, submit CTA, and mobile single-column behavior. Specify validation states, focus rings, button active states, responsive overflow behavior, and accessibility labels.`,
    },
  ];
}

function featureLabels(profile: PromptProfile, key: CategoryKey, fallback: string[], count = 5) {
  return topLabels(profile.features[key], fallback, count);
}

function formatBullets(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function analyzeCorpusHealth(
  examples: PromptExample[],
  clusters: ArchetypeCluster[],
  profile: PromptProfile,
): CorpusHealth {
  const tagMap = new Map<string, Feature>();
  for (const example of examples) {
    for (const tag of extractPromptTags(example.text)) {
      pushFeature(tagMap, tag, example.title);
    }
  }

  const balance = makeFeatureList(tagMap, 16);
  const countFor = (label: string) => balance.find((feature) => feature.label === label)?.count ?? 0;
  const strengths = [
    profile.categoryScores.layout >= 70 ? "Strong section anatomy and layer-order specificity." : "",
    profile.categoryScores.assets >= 70 ? "Exact media and asset handling is a clear corpus strength." : "",
    profile.categoryScores.motion >= 70 ? "Motion instructions usually include timing, state, and implementation mechanics." : "",
    profile.categoryScores.responsive >= 70 ? "Responsive behavior is regularly specified across breakpoints." : "",
    clusters.length >= 6 ? "Healthy archetype diversity across hero, SaaS, product, auth, archive, and feature patterns." : "",
  ].filter(Boolean);

  const gaps = [
    profile.categoryScores.qa < 55 ? "Quality assurance and accessibility checks are still under-specified." : "",
    profile.categoryScores.state < 55 ? "Interactive state logic could be made more explicit in more prompts." : "",
    countFor("dashboard") < 3 ? "Add more dashboard, data, and operational tool prompts." : "",
    countFor("plain css") < 2 ? "Add a few no-Tailwind or plain-CSS examples for stylistic range." : "",
    countFor("signup") < 3 ? "Add more form, auth, and onboarding interfaces." : "",
    countFor("scroll-driven") < 3 ? "Add scroll-driven/editorial systems to broaden motion vocabulary." : "",
  ].filter(Boolean);

  const videoCount = countFor("video background");
  const glassCount = countFor("liquid glass");
  const recommendations = [
    videoCount > examples.length * 0.45
      ? "Balance the video-heavy corpus with still-image, product UI, dashboard, and static section prompts."
      : "Keep using exact asset URLs, but continue adding non-video visual systems too.",
    glassCount > examples.length * 0.35
      ? "Liquid glass is a dominant taste rule; add examples that use matte, editorial, flat, or utility-first surfaces."
      : "Capture more reusable surface-system rules: glass, matte, solid, outline, and dense dashboard panels.",
    "Add negative examples or rubric notes for what makes a prompt vague, overdecorated, or hard to build.",
    "Keep saving generated winners into version history so taste can evolve without losing earlier directions.",
  ];

  return {
    strengths: strengths.length ? strengths : ["The corpus is large enough to extract practical prompt patterns."],
    gaps: gaps.length ? gaps : ["No urgent corpus gaps detected. Add examples for any new style direction you want to learn."],
    balance,
    recommendations,
  };
}

export function buildRubricNotes(rubric: QualityRubric) {
  const notes = [
    `Cinematic impact ${rubric.cinematic}/10: ${rubric.cinematic >= 8 ? "make the first viewport emotionally legible with one strong visual carrier" : "keep the visual idea clean and avoid overproducing the scene"}.`,
    `Buildability ${rubric.buildability}/10: ${rubric.buildability >= 8 ? "include file structure, dependency limits, exact CSS/classes, and implementation order" : "prioritize readable specs over exhaustive engineering detail"}.`,
    `Specificity ${rubric.specificity}/10: ${rubric.specificity >= 8 ? "use exact copy, tokens, spacing, dimensions, breakpoints, and asset behavior" : "name the key values while leaving room for interpretation"}.`,
    `Motion ${rubric.motion}/10: ${rubric.motion >= 8 ? "describe timing, easing, state locks, refs/listeners, cleanup, and reduced-motion behavior" : "limit motion to entrance and hover details"}.`,
    `Restraint ${rubric.restraint}/10: ${rubric.restraint >= 8 ? "state no-go rules for extra sections, blobs, overlays, unlisted libraries, and generic decoration" : "allow more exploratory visual flourishes"}.`,
    `Accessibility ${rubric.accessibility}/10: ${rubric.accessibility >= 8 ? "require labels, focus states, keyboard handling, contrast, and motion fallbacks" : "include basic semantic markup and focus behavior"}.`,
  ];

  return notes;
}

export function buildRecipePrompt(profile: PromptProfile, options: RecipeOptions, rubric?: QualityRubric) {
  const brand = options.brandName.trim() || "the product";
  const industry = options.industry.trim() || "premium SaaS";
  const stack = options.stack.trim() || featureLabels(profile, "stack", ["React", "TypeScript", "Vite", "Tailwind CSS"], 4).join(" + ");
  const layout = options.layout.trim() || "single full-viewport hero with a strong first-viewport composition";
  const nav = options.nav.trim() || "responsive navbar with desktop links, CTA, and mobile menu";
  const motion = options.motion.trim() || featureLabels(profile, "motion", ["staggered reveal", "hover scale", "reduced-motion fallback"], 3).join(", ");
  const assets = options.assets.trim() || "named asset slots with object-fit, focal point, z-index, and loading behavior";
  const strictness = Math.max(1, Math.min(10, options.strictness));
  const audience = options.audience.trim() || "builders who need an implementation-ready result";
  const rubricNotes = rubric ? `\nQUALITY RUBRIC\n${formatBullets(buildRubricNotes(rubric))}\n` : "";

  return `Create a high-fidelity website prompt for "${brand}", a ${industry} experience for ${audience}. Use ${stack}.

PROJECT SHAPE
- Page type: ${layout}.
- Navigation: ${nav}.
- Core sections: root shell, background/visual layer, navigation, hero copy, CTA system, supporting proof or feature strip, responsive mobile state.
- Output should be implementation-ready, with exact copy placeholders only where brand copy is unknown.

VISUAL DIRECTION
- Define the visual signature in one sentence before listing specs.
- Specify colors with exact hex/HSL/rgba tokens, typography imports and weights, surface treatments, spacing, radius, shadows, and z-index layers.
- Asset plan: ${assets}.

INTERACTION AND MOTION
- Motion system: ${motion}.
- Include durations, delays, easing, transform values, event listeners or refs where needed, cleanup, and prefers-reduced-motion behavior.
- Define hover, active, focus, open/closed, loading, and mobile-menu states.

RESPONSIVE AND BUILD RULES
- Describe mobile, tablet, desktop, and wide behavior with concrete breakpoints or clamp() values.
- Strictness level ${strictness}/10: ${strictness >= 8 ? "preserve exact values, ban unlisted libraries, and forbid extra decorative sections" : "keep the brief exact but allow modest implementation judgment"}.
- Include QA checks for text wrapping, media rendering, keyboard interaction, and mobile viewport fit.${rubricNotes}`;
}

export function mixArchetypes(
  profile: PromptProfile,
  clusters: ArchetypeCluster[],
  options: ArchetypeMixOptions,
  rubric?: QualityRubric,
) {
  const brand = options.brandName.trim() || "Hybrid Studio";
  const siteType = options.siteType.trim() || "single-page website";
  const mood = options.mood.trim() || "cinematic, precise, and restrained";
  const selected =
    clusters.filter((cluster) => options.archetypes.includes(cluster.key) || options.archetypes.includes(cluster.label)).slice(0, 3) ||
    [];
  const active = selected.length ? selected : clusters.slice(0, 2);
  const stack = featureLabels(profile, "stack", ["React", "TypeScript", "Vite", "Tailwind CSS"], 4).join(" + ");
  const fonts = featureLabels(profile, "typography", ["Inter", "Instrument Serif"], 3).join(" + ");
  const assetLine = options.includeAssets
    ? "Use exact asset URLs or named asset slots, and specify object-fit, focal point, loop/preload behavior, z-index, and overlay policy."
    : "Do not require external assets unless they are explicitly provided; reserve named slots instead.";
  const extraConstraints = options.constraints.trim();
  const rubricNotes = rubric ? `\nRUBRIC TARGETS\n${formatBullets(buildRubricNotes(rubric))}` : "";

  return `Build a ${siteType} for "${brand}" using ${stack}. Blend these learned archetypes into one coherent prompt: ${active
    .map((cluster) => cluster.label)
    .join(" + ")}.

CONCEPT
- Mood: ${mood}.
- Primary archetype: ${active[0]?.label ?? "High-Fidelity Landing Page"}.
- Secondary mechanics: ${active
    .slice(1)
    .map((cluster) => `${cluster.label} signals (${cluster.signals.slice(0, 4).join(", ")})`)
    .join("; ") || "use corpus-backed spacing, typography, and motion patterns"}.
- The final prompt should feel like one product, not a collage.

SPEC REQUIREMENTS
- Typography: load and assign ${fonts}; define heading, body, logo, and accent usage.
- Layout: describe root shell, background layer, navigation, hero composition, CTAs, supporting proof/features, and responsive reflow.
- Visual system: exact colors, surfaces, border/radius/shadow tokens, text hierarchy, and no-go decoration rules.
- Assets: ${assetLine}
- Motion: specify timing, easing, delays, state, cleanup, and reduced-motion behavior.
- Responsive: name mobile/tablet/desktop behavior and which elements hide, reflow, resize, or move.
- Constraints: ${extraConstraints || "no unlisted UI libraries, no vague stock art, no accidental overlays, no generic placeholder sections."}${rubricNotes}`;
}

export function buildPromptPacks(profile: PromptProfile, clusters: ArchetypeCluster[]): PromptPack[] {
  const stack = featureLabels(profile, "stack", ["React", "TypeScript", "Vite", "Tailwind CSS"], 4).join(" + ");
  const topCluster = clusters[0]?.label ?? "Cinematic Video Hero";
  const glassCluster = clusters.find((cluster) => cluster.key === "liquid-glass-saas")?.label ?? "Liquid Glass SaaS";
  const productCluster = clusters.find((cluster) => cluster.key === "product-commerce-hero")?.label ?? "Product Commerce Hero";

  return [
    {
      id: "saas-launch-pack",
      title: "SaaS Launch Pack",
      description: "Three build-ready prompts for AI, security, fintech, and productivity landing pages.",
      prompts: [
        composePrompt(profile, {
          brief: "a security-focused SaaS landing hero with proof stats, glass navigation, and a clear enterprise CTA",
          brandName: "SentinelForge",
          siteType: "full-screen SaaS landing page",
          visualSignature: "monochrome video or dashboard visual layer with restrained liquid glass controls",
          archetype: glassCluster,
          mood: "secure, technical, premium",
          outputFlavor: "production handoff",
          detailLevel: 9,
          creativity: 6,
          rigor: 9,
          includeAssets: true,
          includeMotion: true,
          includeQA: true,
        }),
        composePrompt(profile, {
          brief: "an AI productivity hero with a bottom logo marquee, precise dashboard overlays, and one signature automation visual",
          brandName: "Flowmint",
          siteType: "single-page SaaS hero",
          visualSignature: "centered value proposition above an animated product proof surface",
          archetype: "Dashboard SaaS",
          mood: "fast, clean, credible",
          outputFlavor: "Codex-build-ready",
          detailLevel: 8,
          creativity: 7,
          rigor: 8,
          includeAssets: true,
          includeMotion: true,
          includeQA: true,
        }),
        buildRecipePrompt(profile, {
          industry: "fintech stablecoin",
          stack,
          layout: "premium two-band hero with a trusted-by marquee and transaction proof cards",
          nav: "floating pill navbar with product, security, developers, pricing, and CTA",
          motion: "subtle fade-up, marquee, card hover, and reduced-motion fallback",
          assets: "product UI screenshots plus optional background video slot",
          strictness: 9,
          brandName: "Harbor USD",
          audience: "finance teams and developers",
        }),
      ],
    },
    {
      id: "cinematic-hero-pack",
      title: "Cinematic Hero Pack",
      description: "Atmospheric first-viewport prompts with exact media, typography, and motion rules.",
      prompts: [
        composePrompt(profile, {
          brief: "a travel brand hero with parallax video, editorial typography, and a bottom booking CTA",
          brandName: "Wanderful",
          siteType: "full-viewport cinematic hero",
          visualSignature: "fixed full-screen video with mouse parallax and a locked bottom CTA block",
          archetype: topCluster,
          mood: "transportive, editorial, refined",
          outputFlavor: "implementation spec",
          detailLevel: 9,
          creativity: 8,
          rigor: 8,
          includeAssets: true,
          includeMotion: true,
          includeQA: true,
        }),
        composePrompt(profile, {
          brief: "a wellness companion hero with no dark overlay, glass email capture, and responsive focal-point video",
          brandName: "Aurai",
          siteType: "full-screen mobile-responsive hero",
          visualSignature: "raw video background with glass nav and bottom-aligned email capture",
          archetype: topCluster,
          mood: "calm, intimate, premium",
          outputFlavor: "Codex-build-ready",
          detailLevel: 8,
          creativity: 6,
          rigor: 8,
          includeAssets: true,
          includeMotion: false,
          includeQA: true,
        }),
        mixArchetypes(profile, clusters, {
          brandName: "Organic Visions",
          siteType: "fullscreen cinematic hero",
          archetypes: ["cinematic-video-hero", "portfolio-agency"],
          mood: "mysterious, delicate, gallery-like",
          constraints: "white text only, no decorative blobs, mobile menu must be accessible",
          includeAssets: true,
        }),
      ],
    },
    {
      id: "product-story-pack",
      title: "Product Story Pack",
      description: "Commerce, wellness, and consumer-product prompts with inspection-friendly media.",
      prompts: [
        composePrompt(profile, {
          brief: "a premium supplement brand landing hero with product packaging, ingredient proof, and soft editorial typography",
          brandName: "TerraRoot",
          siteType: "consumer product landing page",
          visualSignature: "first viewport clearly shows the product, benefits, and purchase CTA without generic stock imagery",
          archetype: productCluster,
          mood: "natural, trustworthy, modern",
          outputFlavor: "implementation-ready",
          detailLevel: 8,
          creativity: 6,
          rigor: 8,
          includeAssets: true,
          includeMotion: true,
          includeQA: true,
        }),
        buildRecipePrompt(profile, {
          industry: "premium pet-care ecommerce",
          stack,
          layout: "single hero plus compact product feature grid",
          nav: "shop, story, reviews, support, cart CTA",
          motion: "gentle fade-up, image hover, CTA arrow motion",
          assets: "specific product imagery with aspect ratios and object-fit",
          strictness: 8,
          brandName: "CozyPaws",
          audience: "pet owners who want warm, credible product details",
        }),
        buildRecipePrompt(profile, {
          industry: "dental clinic",
          stack,
          layout: "trust-led service hero with appointment CTA and proof stats",
          nav: "services, doctors, reviews, insurance, book now",
          motion: "simple entrance animation and accessible mobile menu",
          assets: "real clinic/team imagery, no generic stock-like crops",
          strictness: 8,
          brandName: "Brightline Dental",
          audience: "patients comparing care options",
        }),
      ],
    },
    {
      id: "interface-systems-pack",
      title: "Interface Systems Pack",
      description: "Auth, dashboard, and utility prompts with stateful controls and QA checks.",
      prompts: [
        buildRecipePrompt(profile, {
          industry: "private beta onboarding",
          stack,
          layout: "two-column sign-up interface with media panel, steps, and form",
          nav: "minimal brand header inside the interface",
          motion: "staggered form reveal and active/tap states",
          assets: "video panel slot with no overlay unless specified",
          strictness: 9,
          brandName: "Aurora",
          audience: "new members activating a studio profile",
        }),
        composePrompt(profile, {
          brief: "an analytics dashboard SaaS hero with dense but polished operational UI surfaces",
          brandName: "Neuralyn",
          siteType: "dashboard SaaS landing page",
          visualSignature: "hero copy paired with a real dashboard composition, tabs, charts, and status cards",
          archetype: "Dashboard SaaS",
          mood: "quiet, utilitarian, premium",
          outputFlavor: "developer-ready",
          detailLevel: 9,
          creativity: 5,
          rigor: 9,
          includeAssets: false,
          includeMotion: true,
          includeQA: true,
        }),
        buildRecipePrompt(profile, {
          industry: "password manager",
          stack,
          layout: "full-screen hero with security proof, mobile menu, and CTA",
          nav: "vault, plans, install, news, help, account buttons",
          motion: "Framer Motion fade-up plus mobile sheet enter/exit",
          assets: "background video slot and custom SVG logo",
          strictness: 9,
          brandName: "VaultShield",
          audience: "privacy-conscious consumers",
        }),
      ],
    },
  ];
}

export function buildStyleGuide(profile: PromptProfile, clusters: ArchetypeCluster[], health: CorpusHealth) {
  const topCategories = Object.entries(profile.categoryScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([key, score]) => `${CATEGORY_LABELS[key as CategoryKey]}: ${score}`);
  const archetypes = clusters.slice(0, 7).map((cluster) => `${cluster.label}: ${cluster.count} prompts, ${cluster.score}% average match`);

  return `# Prompt Atelier Style Guide

Generated from ${profile.exampleCount} website prompts.

## Taste DNA

- Average prompt length: ${profile.averageWords} words.
- Detail score: ${profile.detailScore}/100.
- Strongest categories:
${formatBullets(topCategories)}

## Core Principles

${formatBullets(profile.learnedRules.slice(0, 8))}

## Archetypes To Reuse

${formatBullets(archetypes)}

## Signature Details

${formatBullets(profile.signaturePhrases.map((feature) => `${feature.label} (${feature.count})`))}

## Corpus Strengths

${formatBullets(health.strengths)}

## Corpus Gaps

${formatBullets(health.gaps)}

## Prompt Writing Rules

- Start with the exact stack, dependencies, and file/CSS setup.
- Describe the first viewport as a layered system: root, media or visual layer, overlays, navigation, hero copy, controls, and bottom details.
- Use exact copy, fonts, weights, colors, spacing, z-index, object-fit, object-position, responsive behavior, and state transitions.
- Explain motion with durations, easing, delays, trigger conditions, state locks, cleanup, and reduced-motion behavior.
- Add no-go rules for generic stock imagery, accidental overlays, decorative blobs, extra sections, and unlisted libraries.
- End with verification notes for desktop, mobile, accessibility, media loading, and text wrapping.
`;
}

export function buildOutcomeSummary(outcomes: OutcomeRecord[], examples: PromptExample[]): OutcomeSummary {
  const byId = new Map(examples.map((example) => [example.id, example]));
  const goodTexts = outcomes
    .filter((outcome) => outcome.rating === "great" || outcome.status === "gold" || outcome.status === "good")
    .map((outcome) => byId.get(outcome.promptId)?.text ?? "")
    .filter(Boolean);
  const avoidTexts = outcomes
    .filter((outcome) => outcome.rating === "bad" || outcome.status === "avoid")
    .map((outcome) => byId.get(outcome.promptId)?.text ?? "")
    .filter(Boolean);

  const collectSignals = (texts: string[]) => {
    const map = new Map<string, number>();
    for (const text of texts) {
      for (const signal of [
        ...extractPromptTags(text),
        ...analyzeArchetypeMatches(text).slice(0, 2).map((match) => match.label),
        ...extractFontNames(text),
      ]) {
        map.set(signal, (map.get(signal) ?? 0) + 1);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([signal, count]) => `${signal} (${count})`)
      .slice(0, 8);
  };

  const counts = {
    unrated: 0,
    great: 0,
    okay: 0,
    bad: 0,
    gold: 0,
    good: 0,
    experimental: 0,
    avoid: 0,
  } satisfies Record<OutcomeRating | PromptStatus, number>;

  for (const outcome of outcomes) {
    counts[outcome.rating] += 1;
    counts[outcome.status] += 1;
  }

  return {
    goldSignals: collectSignals(goodTexts),
    avoidSignals: collectSignals(avoidTexts),
    notes: outcomes
      .filter((outcome) => outcome.notes.trim())
      .slice(0, 8)
      .map((outcome) => `${outcome.title}: ${outcome.notes.trim()}`),
    counts,
  };
}

export function searchSimilarPrompts(query: string, examples: PromptExample[], outcomes: OutcomeRecord[] = []): SearchResult[] {
  const normalized = query.trim();
  if (!normalized) return [];
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const queryTokens = semanticTokens(normalized);
  const queryStructure = structureSignature(normalized);

  return examples
    .filter((example) => countWords(example.text) >= 50)
    .map((example) => {
      const textScore = jaccardSimilarity(queryTokens, semanticTokens(example.text));
      const structureScore = structuralSimilarity(queryStructure, structureSignature(example.text));
      const score = Math.min(100, Math.round((textScore * 0.68 + structureScore * 0.32) * 100 * outcomeWeight(outcomeMap.get(example.id))));
      const analysis = analyzePrompt(example.text);
      const sharedTags = extractPromptTags(normalized).filter((tag) => analysis.tags.includes(tag));
      const reasons = [
        sharedTags.length ? `Shared tags: ${sharedTags.slice(0, 4).join(", ")}` : "",
        analysis.archetypes[0] ? `Archetype: ${analysis.archetypes[0].label}` : "",
        outcomeMap.get(example.id)?.status === "gold" ? "Gold-standard prompt" : "",
        outcomeMap.get(example.id)?.rating === "great" ? "Rated great after build" : "",
      ].filter(Boolean);
      return { example, score, reasons };
    })
    .filter((result) => result.score > 8)
    .sort((a, b) => b.score - a.score || a.example.title.localeCompare(b.example.title))
    .slice(0, 12);
}

export function diffPrompts(left: PromptExample | string, right: PromptExample | string): PromptDiff {
  const leftText = typeof left === "string" ? left : left.text;
  const rightText = typeof right === "string" ? right : right.text;
  const leftTitle = typeof left === "string" ? "Left prompt" : left.title;
  const rightTitle = typeof right === "string" ? "Right prompt" : right.title;
  const leftAnalysis = analyzePrompt(leftText);
  const rightAnalysis = analyzePrompt(rightText);
  const baseCategories: PromptDiffCategory[] = [
    {
      key: "archetypes",
      label: "Archetypes",
      left: leftAnalysis.archetypes.map((match) => match.label),
      right: rightAnalysis.archetypes.map((match) => match.label),
      shared: [],
      leftOnly: [],
      rightOnly: [],
    },
    { key: "tags", label: "Tags", left: leftAnalysis.tags, right: rightAnalysis.tags, shared: [], leftOnly: [], rightOnly: [] },
    { key: "fonts", label: "Fonts", left: leftAnalysis.fonts, right: rightAnalysis.fonts, shared: [], leftOnly: [], rightOnly: [] },
    { key: "colors", label: "Colors", left: leftAnalysis.colors, right: rightAnalysis.colors, shared: [], leftOnly: [], rightOnly: [] },
    ...(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      left: extractCategorySignals(leftText, key),
      right: extractCategorySignals(rightText, key),
      shared: [],
      leftOnly: [],
      rightOnly: [],
    })),
  ];
  const categories: PromptDiffCategory[] = baseCategories.map((category) => {
    const shared = category.left.filter((item) => category.right.includes(item));
    return {
      ...category,
      shared,
      leftOnly: category.left.filter((item) => !shared.includes(item)),
      rightOnly: category.right.filter((item) => !shared.includes(item)),
    };
  });

  const similarity = Math.round(
    (jaccardSimilarity(semanticTokens(leftText), semanticTokens(rightText)) * 0.7 +
      structuralSimilarity(structureSignature(leftText), structureSignature(rightText)) * 0.3) *
      100,
  );
  const summary = [
    `${leftTitle} and ${rightTitle} are ${similarity}% similar.`,
    `${rightTitle} adds ${categories.flatMap((category) => category.rightOnly).slice(0, 5).join(", ") || "few unique explicit signals"}.`,
    `${leftTitle} preserves ${categories.flatMap((category) => category.leftOnly).slice(0, 5).join(", ") || "a similar structure"}.`,
  ];

  return {
    similarity,
    summary,
    categories,
    mergedPrompt: mergePromptDiff(leftTitle, leftText, rightTitle, rightText, categories),
  };
}

function mergePromptDiff(leftTitle: string, leftText: string, rightTitle: string, rightText: string, categories: PromptDiffCategory[]) {
  const strongestSignals = categories
    .flatMap((category) => [...category.shared.slice(0, 3), ...category.leftOnly.slice(0, 2), ...category.rightOnly.slice(0, 2)])
    .filter(Boolean)
    .slice(0, 24);

  return `MERGED HIGH-FIDELITY PROMPT

Blend the strongest implementation details from "${leftTitle}" and "${rightTitle}" into one coherent website prompt.

KEEP FROM BOTH
${formatBullets(unique(strongestSignals, 18))}

BASE INTENT
${leftText.trim().slice(0, 1600)}

ADDED STRENGTHS
${rightText.trim().slice(0, 1600)}

MERGE RULES
- Preserve exact stack, font, color, asset, layout, motion, responsive, and no-go details when they are compatible.
- If two specs conflict, choose the more buildable one and state the discarded alternative explicitly.
- Reorganize into: Stack, Fonts, Assets, Layout, Navigation, Hero, Motion, Responsive, Constraints, QA.
- Remove duplicate sentences and vague phrasing; keep exact values and copy.`;
}

export function auditVisualPrompt(text: string): VisualQaReport {
  const analysis = analyzePrompt(text);
  const lower = text.toLowerCase();
  const items: VisualQaItem[] = [
    {
      label: "First-viewport signal",
      score: /hero|first viewport|fullscreen|full-screen|above the fold/i.test(text) ? 86 : 42,
      notes: /brand|logo|headline|product|video|image/i.test(text)
        ? ["The prompt names visible first-screen signals."]
        : ["Name the exact first-viewport subject: product, person, place, UI, or motion asset."],
    },
    {
      label: "Asset specificity",
      score: Math.min(100, analysis.assetCount * 22 + analysis.dna.assetPrecision),
      notes: analysis.assetCount ? [`${analysis.assetCount} asset URL(s) detected.`] : ["Add exact URLs or named asset slots with focal-point rules."],
    },
    {
      label: "Mobile clarity",
      score: analysis.dna.responsiveDetail,
      notes: analysis.dna.responsiveDetail >= 60 ? ["Responsive behavior is specified."] : ["Add mobile, tablet, desktop, and wide behavior."],
    },
    {
      label: "Text overlap risk",
      score: /nowrap|whitespace-nowrap|fixed|absolute|top-\[|bottom-\[|left-\[/i.test(text) && !/wrap|clamp|responsive|mobile/i.test(text) ? 48 : 82,
      notes: ["Check absolute/fixed text, long headings, and button labels across mobile widths."],
    },
    {
      label: "Genericness risk",
      score: /exact|specific|url|font|rgba|hsl|px|duration|z-index|object-fit/i.test(text) ? 84 : 36,
      notes: /make it modern|clean and premium/i.test(text)
        ? ["Replace generic taste words with concrete layout, color, typography, and asset rules."]
        : ["Prompt includes concrete implementation language."],
    },
    {
      label: "Accessibility and QA",
      score: Math.max(analysis.dna.buildability, analysis.recommendations.length ? 55 : 80),
      notes: /aria|focus|keyboard|reduced-motion|verify/i.test(lower)
        ? ["QA/accessibility language is present."]
        : ["Add ARIA labels, focus states, reduced-motion, and browser verification notes."],
    },
  ];
  const score = Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
  const warnings = items.filter((item) => item.score < 60).map((item) => `${item.label}: ${item.notes[0]}`);

  return { score, items, warnings };
}

export function detectStyleDrift(text: string, profile: PromptProfile, health?: CorpusHealth, outcomes: OutcomeRecord[] = []): DriftReport {
  const analysis = analyzePrompt(text);
  const profileTags = new Set(Object.values(profile.features).flatMap((features) => features.slice(0, 6).map((feature) => feature.label.toLowerCase())));
  const promptSignals = [
    ...analysis.tags,
    ...analysis.stack,
    ...analysis.fonts,
    ...analysis.archetypes.map((match) => match.label),
    ...analysis.colors,
  ].map((signal) => signal.toLowerCase());
  const alignedSignals = promptSignals.filter((signal) =>
    Array.from(profileTags).some((profileSignal) => profileSignal.includes(signal) || signal.includes(profileSignal)),
  );
  const outcomeSummary = buildOutcomeSummary(outcomes, []);
  const avoidHits = outcomeSummary.avoidSignals.filter((signal) => text.toLowerCase().includes(signal.replace(/\s+\(\d+\)$/, "").toLowerCase()));
  const warnings = [
    analysis.wordCount < profile.averageWords * 0.55 ? "This prompt is much shorter than the learned corpus average." : "",
    analysis.dna.constraintClarity < 35 ? "Constraint clarity is drifting below the preferred style." : "",
    analysis.dna.assetPrecision < 35 && profile.categoryScores.assets > 50 ? "The corpus likes exact assets, but this prompt is asset-light." : "",
    avoidHits.length ? `Touches avoid-pattern signals: ${avoidHits.join(", ")}` : "",
    health?.gaps.some((gap) => gap.toLowerCase().includes("dashboard")) && analysis.tags.includes("dashboard")
      ? "Good: this prompt helps cover a known dashboard gap."
      : "",
  ].filter(Boolean);
  const correctiveRules = [
    analysis.dna.constraintClarity < 50 ? "Add no-go rules and exact preservation requirements." : "",
    analysis.dna.responsiveDetail < 50 ? "Add mobile/tablet/desktop behavior with concrete breakpoints." : "",
    analysis.assetCount === 0 ? "Add exact asset URLs or named slots with object-fit/focal point." : "",
    analysis.dna.motionState < 50 ? "Describe motion as timing, state, easing, cleanup, and reduced-motion behavior." : "",
  ].filter(Boolean);
  const score = Math.max(0, Math.min(100, 100 - warnings.length * 12 - correctiveRules.length * 5 + Math.min(20, alignedSignals.length * 3)));

  return {
    score,
    warnings: warnings.length ? warnings : ["No major taste drift detected."],
    alignedSignals: unique(alignedSignals, 10),
    correctiveRules: correctiveRules.length ? correctiveRules : ["Preserve current specificity and verify mobile/desktop behavior."],
  };
}

export function composeInterviewPrompt(profile: PromptProfile, brief: InterviewBrief, outcomes: OutcomeRecord[] = []) {
  const outcomeSummary = buildOutcomeSummary(outcomes, []);
  return `Create a high-fidelity website prompt for "${brief.brandName || "the brand"}".

BRIEF
- Site type: ${brief.siteType || "single-page landing page"}.
- Audience: ${brief.audience || "the target user"}.
- Goal: ${brief.goal || "make the first viewport clear, memorable, and buildable"}.
- Tone: ${brief.tone || "premium, precise, and implementation-ready"}.
- Visual direction: ${brief.visualDirection || "strong first-viewport composition with exact layout rules"}.

TECH AND ASSETS
- Stack: ${brief.stack || featureLabels(profile, "stack", ["React", "TypeScript", "Vite", "Tailwind CSS"], 4).join(" + ")}.
- Assets: ${brief.assets || "use exact URLs when available; otherwise define named asset slots with object-fit and focal points"}.

MUST-HAVES
${formatBullets((brief.mustHaves || "responsive navigation\nhero headline and CTA\nexact typography and colors\nmotion and QA notes").split("\n"))}

NO-GO RULES
${formatBullets((brief.noGos || "no generic stock imagery\nno decorative blobs unless requested\nno unlisted UI libraries\nno vague marketing filler").split("\n"))}

LEARNED TASTE
- Favor signals from successful prompts: ${outcomeSummary.goldSignals.join(", ") || "exact stack, assets, typography, motion, responsive rules, and constraints"}.
- Avoid signals from weak prompts: ${outcomeSummary.avoidSignals.join(", ") || "vague copy, missing assets, missing responsive behavior, and unverified interactions"}.

OUTPUT FORMAT
- Write the final prompt as Stack, Fonts, Color System, Assets, Layout, Navigation, Hero, Motion, Responsive, Constraints, and QA.
- Include exact copy, values, class-level details, state behavior, cleanup, and verification notes.`;
}

export function composeOutcomeAwarePrompt(
  profile: PromptProfile,
  options: ComposeOptions,
  outcomes: OutcomeRecord[],
  examples: PromptExample[],
) {
  const base = composePrompt(profile, options);
  const summary = buildOutcomeSummary(outcomes, examples);
  if (!outcomes.length) return base;

  return `${base}

OUTCOME LEARNING
- Prioritize successful signals: ${summary.goldSignals.join(", ") || "no gold signals saved yet"}.
- Avoid weak signals: ${summary.avoidSignals.join(", ") || "no avoid signals saved yet"}.
- Human notes to honor:
${summary.notes.length ? formatBullets(summary.notes) : "- No outcome notes saved yet."}`;
}

export function buildCodexSkill(
  profile: PromptProfile,
  clusters: ArchetypeCluster[],
  health: CorpusHealth,
  outcomes: OutcomeRecord[] = [],
) {
  const summary = buildOutcomeSummary(outcomes, []);
  return `---
name: website-prompt-atelier
description: Use when writing high-fidelity prompts for website, landing page, hero, SaaS, portfolio, product, dashboard, or frontend UI builds.
---

# Website Prompt Atelier

Use this skill to write implementation-ready website prompts in the user's preferred style.

## Core Taste

${formatBullets(profile.learnedRules.slice(0, 9))}

## Preferred Archetypes

${formatBullets(clusters.slice(0, 8).map((cluster) => `${cluster.label}: ${cluster.signals.slice(0, 6).join(", ")}`))}

## Successful Signals

${formatBullets(summary.goldSignals.length ? summary.goldSignals : ["Exact stack and dependency boundaries", "Specific media/assets", "Named sections", "Concrete motion and responsive rules"])}

## Avoid Signals

${formatBullets(summary.avoidSignals.length ? summary.avoidSignals : ["Vague requests like make it modern", "Unspecified stock imagery", "Extra UI libraries", "Missing mobile behavior"])}

## Corpus Health Notes

Strengths:
${formatBullets(health.strengths)}

Gaps to intentionally cover:
${formatBullets(health.gaps)}

## Prompt Format

Always structure final prompts with:

1. Stack and dependencies
2. Fonts and global CSS
3. Color system
4. Assets and media behavior
5. Layout and layer order
6. Navigation and interactive controls
7. Hero/section copy and exact styling
8. Motion/state mechanics
9. Responsive behavior
10. Constraints and QA

## Quality Bar

- Prefer exact values over adjectives.
- State no-go rules explicitly.
- Include accessibility labels and focus states for controls.
- Include reduced-motion and cleanup notes for animation/listener logic.
- Verify mobile and desktop text wrapping, media rendering, and interaction states.
`;
}

export function buildPromptMemoryExport({
  clusters,
  examples,
  failureMemory,
  health,
  index,
  outcomes,
  profile,
  scoreWeights,
}: {
  clusters: ArchetypeCluster[];
  examples: PromptExample[];
  failureMemory: FailureMemoryReport;
  health: CorpusHealth;
  index: LocalEmbeddingIndex;
  outcomes: OutcomeRecord[];
  profile: PromptProfile;
  scoreWeights: Record<string, number>;
}): PromptMemoryExport {
  const outcomeSummary = buildOutcomeSummary(outcomes, examples);
  const goldenExamples = examples
    .filter((example) => outcomes.some((outcome) => outcome.promptId === example.id && (outcome.status === "gold" || outcome.rating === "great")))
    .slice(0, 8);
  const fallbackExamples = goldenExamples.length ? goldenExamples : examples.filter((example) => countWords(example.text) > 120).slice(0, 8);
  const archetypeTemplates = clusters.slice(0, 8).map((cluster) => {
    const signals = cluster.signals.slice(0, 6).join(", ") || "specific stack, assets, layout, responsive, and QA signals";
    return `${cluster.label}: start with the exact stack, declare the visual mechanic, then lock fonts, colors, assets, layout, motion, responsive rules, constraints, and QA. Signals: ${signals}.`;
  });
  const scoringRubric = Object.entries(scoreWeights)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `${key}: ${value}`);
  const sections = [
    { title: "Prompt writing rules", items: profile.learnedRules.slice(0, 12) },
    { title: "Archetype templates", items: archetypeTemplates },
    { title: "Golden signals", items: outcomeSummary.goldSignals.length ? outcomeSummary.goldSignals : index.goldTerms.map((term) => term.label) },
    { title: "Avoid patterns", items: failureMemory.avoidRules.length ? failureMemory.avoidRules : outcomeSummary.avoidSignals },
    { title: "Golden examples", items: fallbackExamples.map((example) => `${example.title}: ${countWords(example.text)} words`) },
    { title: "Scoring rubric", items: scoringRubric },
    { title: "Corpus gaps", items: health.gaps },
  ];
  const markdown = `# Website Prompt Memory

Generated: ${new Date().toISOString()}
Examples: ${profile.exampleCount}
Average words: ${profile.averageWords}

${sections.map((section) => `## ${section.title}\n\n${formatBullets(section.items.length ? section.items : ["No signal learned yet."])}`).join("\n\n")}

## Failure Memory Patch

${failureMemory.promptPatch}

## Export Contract

- Use exact implementation values over adjectives.
- Preserve no-go rules from the prompt.
- Compare generated prompts against golden examples before running builds.
- After every build, import queue-result.json, score screenshots, and update gold/avoid outcomes.`;

  return {
    markdown,
    json: JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        rules: profile.learnedRules,
        archetypes: clusters,
        health,
        outcomes: outcomeSummary,
        failureMemory,
        index,
        scoreWeights,
        goldenExamples: fallbackExamples.map((example) => ({ id: example.id, title: example.title, text: example.text })),
      },
      null,
      2,
    ),
    sections,
  };
}

export function scorePromptDnaV2(
  prompt: PromptExample | undefined,
  result?: ResultScore,
  screenshotQa?: ScreenshotQaReport,
): PromptDnaV2 {
  const text = prompt?.text ?? "";
  const analysis = analyzePrompt(text);
  const category = evaluatePrompt(text).categoryScores;
  const urls = extractUrls(text);
  const classes = extractClasses(text);
  const dimensions = [
    {
      key: "exactAssets",
      label: "Exact assets",
      score: Math.min(100, urls.length * 18 + analysis.dna.assetPrecision * 0.52),
      evidence: urls.slice(0, 4).length ? urls.slice(0, 4) : ["No exact URLs detected"],
      fix: "Add exact media URLs, dimensions, object-fit, focal position, and fallback behavior.",
    },
    {
      key: "stackClarity",
      label: "Stack clarity",
      score: Math.min(100, analysis.stack.length * 18 + category.stack * 0.5),
      evidence: analysis.stack.length ? analysis.stack.slice(0, 6) : ["No explicit framework/dependency boundary"],
      fix: "Name framework, language, styling system, icons, animation libraries, and forbidden libraries.",
    },
    {
      key: "typography",
      label: "Typography specificity",
      score: Math.min(100, analysis.fonts.length * 16 + category.typography * 0.62),
      evidence: analysis.fonts.length ? analysis.fonts : ["No named fonts detected"],
      fix: "Declare font source, weights, CSS variables or Tailwind extension, and where each face is used.",
    },
    {
      key: "motionLogic",
      label: "Motion logic",
      score: Math.min(100, category.motion * 0.75 + category.state * 0.25),
      evidence: extractCategorySignals(text, "motion").slice(0, 6),
      fix: "Specify animation states, timing, easing, refs, cleanup, loop locks, and reduced-motion behavior.",
    },
    {
      key: "mobileRules",
      label: "Mobile rules",
      score: Math.min(100, category.responsive * 0.7 + (screenshotQa?.score ?? 0) * 0.3),
      evidence: extractCategorySignals(text, "responsive").slice(0, 6),
      fix: "Lock mobile layout, menu states, text wrapping, stable dimensions, and screenshot verification.",
    },
    {
      key: "constraints",
      label: "No-go constraints",
      score: category.constraints,
      evidence: extractCategorySignals(text, "constraints").slice(0, 6),
      fix: "State no overlays, no extra libraries, no placeholder assets, and other design boundaries explicitly.",
    },
    {
      key: "qaCompleteness",
      label: "QA completeness",
      score: Math.min(100, category.qa * 0.72 + (result?.score ?? 0) * 0.28),
      evidence: extractCategorySignals(text, "qa").slice(0, 6),
      fix: "Require lint/build, console checks, desktop/mobile screenshots, media rendering, and text-overlap checks.",
    },
    {
      key: "originality",
      label: "Originality",
      score: Math.min(100, analysis.archetypes[0]?.score ? 58 + analysis.archetypes.length * 7 + classes.length * 0.3 : 42),
      evidence: [analysis.archetypes[0]?.label ?? "Unclustered", `${classes.length} layout/class signals`],
      fix: "Add one distinctive but buildable mechanic beyond generic video/glass/hero patterns.",
    },
  ].map((item) => ({ ...item, score: Math.round(item.score), evidence: item.evidence.filter(Boolean).slice(0, 6) }));
  const overall = Math.round(dimensions.reduce((sum, item) => sum + item.score, 0) / dimensions.length);
  return { overall, dimensions };
}

export function distillGoldenRecipes(
  examples: PromptExample[],
  outcomes: OutcomeRecord[] = [],
  clusters: ArchetypeCluster[] = [],
): GoldenRecipe[] {
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const goldSet = examples.filter((example) => {
    const outcome = outcomeMap.get(example.id);
    return outcome?.status === "gold" || outcome?.rating === "great";
  });
  const source = goldSet.length ? goldSet : examples.filter((example) => countWords(example.text) > 100);
  const byArchetype = new Map<string, PromptExample[]>();
  for (const example of source) {
    const label = analyzePrompt(example.text).archetypes[0]?.label ?? "General high-fidelity prompt";
    byArchetype.set(label, [...(byArchetype.get(label) ?? []), example]);
  }
  return Array.from(byArchetype.entries())
    .map(([archetype, group]) => {
      const combined = group.map((example) => example.text).join("\n\n");
      const cluster = clusters.find((item) => item.label === archetype);
      return {
        archetype,
        score: Math.round(group.reduce((sum, example) => sum + evaluatePrompt(example.text).score, 0) / group.length),
        examples: group.slice(0, 5).map((example) => example.title),
        recipe: [
          `Open with the exact stack and dependency boundaries used by this archetype.`,
          `State the signature mechanic: ${cluster?.signals.slice(0, 4).join(", ") || analyzePrompt(combined).tags.slice(0, 4).join(", ") || "specific first viewport"}.`,
          `Lock fonts, colors, assets, layout layers, motion/state mechanics, responsive rules, constraints, and QA.`,
          `Use exact values and source URLs from the prompt instead of placeholder description.`,
        ],
        avoid: [
          !extractUrls(combined).length ? "Avoid asset-dependent prompts without exact URLs or fallbacks." : "",
          countMatches(combined, ["mobile", "responsive", "sm:", "md:", "lg:"]) < 2 ? "Avoid weak mobile instructions." : "",
          "Avoid generic mood words unless paired with implementation values.",
        ].filter(Boolean),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export function buildPromptBattle(
  source: string,
  profile: PromptProfile,
  outcomes: OutcomeRecord[] = [],
  result?: ResultScore,
): PromptBattle {
  const tournament = buildPromptTournament(source, profile, outcomes, result);
  const variants = tournament.variants.slice(0, 5);
  const winner = [...variants].sort((a, b) => b.score - a.score)[0] ?? tournament.recommendation;
  return {
    variants,
    winner,
    queuePlan: variants.map((variant, index) => `${index + 1}. Queue "${variant.title}" and compare desktop/mobile screenshots.`),
    explanation: [
      `Winner: ${winner.title} at ${winner.score}/100.`,
      "Battle mode scores prompt quality, visual QA readiness, result feedback, and failure-memory alignment.",
      "Run all variants, import queue-result.json, then mark the visual winner gold.",
    ],
  };
}

export function repairPromptFromFailure(
  source: string,
  profile: PromptProfile,
  failureMemory: FailureMemoryReport,
  result?: ResultScore,
  outcomes: OutcomeRecord[] = [],
) {
  const failures = result?.failureCategories.length ? result.failureCategories : failureMemory.categories.map((item) => item.category).slice(0, 4);
  const patch = failures.length
    ? failures.map((failure) => `${failure}: ${FAILURE_FIXES[failure]}`).join("\n- ")
    : failureMemory.promptPatch;
  return `${improvePromptWithLearning(source, profile, outcomes, result)}

AUTOMATED FAILURE REPAIR
- ${patch}

RE-RUN REQUIREMENTS
- Build in a fresh folder.
- Capture desktop and mobile screenshots.
- Verify no blank render, missing media, text overlap, mobile clipping, low contrast, or console errors.
- Import queue-result.json and mark the repaired variant gold only if the visual output improves.`;
}

export function createDatasetVersionSnapshot({
  buildRuns,
  examples,
  label,
  outcomes,
  score,
  screenshots,
}: {
  buildRuns: BuildRunRecord[];
  examples: PromptExample[];
  label: string;
  outcomes: OutcomeRecord[];
  score: ScoreBreakdown;
  screenshots: ScreenshotRecord[];
}): DatasetVersion {
  const id = `dataset-${slugify(label) || "version"}-${Date.now()}`;
  const gold = outcomes.filter((outcome) => outcome.status === "gold" || outcome.rating === "great").length;
  const avoid = outcomes.filter((outcome) => outcome.status === "avoid" || outcome.rating === "bad").length;
  return {
    id,
    createdAt: new Date().toISOString(),
    label,
    counts: {
      examples: examples.length,
      outcomes: outcomes.length,
      gold,
      avoid,
      buildRuns: buildRuns.length,
      screenshots: screenshots.length,
    },
    scores: {
      final: score.finalScore,
      promptQuality: score.promptQuality,
      predictedBuild: score.predictedBuild,
      actualResult: score.actualResult,
      failureRisk: score.failureRisk,
    },
    notes: [
      gold ? `${gold} gold/great examples influence generation.` : "No gold set yet.",
      avoid ? `${avoid} avoid/bad examples feed failure memory.` : "No avoid set yet.",
      screenshots.length ? "Screenshot evidence is present." : "Add screenshot evidence for stronger visual scoring.",
    ],
  };
}

function promptOutcome(outcomes: OutcomeRecord[], promptId: string) {
  return outcomes.find((outcome) => outcome.promptId === promptId);
}

function promptScreenshot(screenshots: ScreenshotRecord[], promptId: string) {
  return screenshots.find((screenshot) => screenshot.promptId === promptId);
}

function promptBuildRun(buildRuns: BuildRunRecord[], promptId: string) {
  return buildRuns.find((run) => run.promptId === promptId);
}

function reviewCandidate(
  prompt: PromptExample | undefined,
  outcomes: OutcomeRecord[],
  buildRuns: BuildRunRecord[],
  screenshots: ScreenshotRecord[],
): ReviewCandidate | undefined {
  if (!prompt) return undefined;
  const outcome = promptOutcome(outcomes, prompt.id);
  const screenshot = promptScreenshot(screenshots, prompt.id);
  const run = promptBuildRun(buildRuns, prompt.id);
  const promptScore = evaluatePrompt(prompt.text).score;
  const result = scoreResultArtifact(prompt, screenshot, run);
  const visual = auditVisualPrompt(prompt.text);
  const statusBoost = outcome?.status === "gold" ? 12 : outcome?.status === "avoid" ? -18 : outcome?.rating === "great" ? 8 : outcome?.rating === "bad" ? -12 : 0;
  const score = Math.max(0, Math.min(100, Math.round(promptScore * 0.42 + result.score * 0.38 + visual.score * 0.2 + statusBoost)));
  return {
    id: prompt.id,
    title: prompt.title,
    score,
    promptScore,
    resultScore: result.score,
    visualScore: visual.score,
    status: outcome?.status ?? "missing",
    rating: outcome?.rating ?? "missing",
    previewUrl: screenshot?.url || run?.screenshotUrl || run?.resultUrl || "",
    evidence: [
      `Prompt ${promptScore}`,
      `Result ${result.score}`,
      `Visual ${visual.score}`,
      outcome ? `${outcome.rating}/${outcome.status}` : "No human outcome yet",
      run?.status ? `Run ${run.status}` : "",
    ].filter(Boolean),
  };
}

export function buildGoldReviewReport({
  buildRuns,
  examples,
  leftId,
  outcomes,
  rightId,
  screenshots,
}: {
  buildRuns: BuildRunRecord[];
  examples: PromptExample[];
  leftId: string;
  outcomes: OutcomeRecord[];
  rightId: string;
  screenshots: ScreenshotRecord[];
}): GoldReviewReport {
  const leftPrompt = examples.find((example) => example.id === leftId) ?? examples[0];
  const rightPrompt = examples.find((example) => example.id === rightId) ?? examples.find((example) => example.id !== leftPrompt?.id);
  const left = reviewCandidate(leftPrompt, outcomes, buildRuns, screenshots);
  const right = reviewCandidate(rightPrompt, outcomes, buildRuns, screenshots);
  const winner = left && right ? (left.score >= right.score ? left : right) : left ?? right;
  const loser = left && right ? (winner?.id === left.id ? right : left) : undefined;
  const scoreDelta = winner && loser ? Math.abs(winner.score - loser.score) : 0;
  return {
    left,
    right,
    winnerId: winner?.id,
    loserId: loser?.id,
    scoreDelta,
    learningUpdates: [
      winner ? `Mark "${winner.title}" as gold/great to strengthen its stack, asset, layout, and QA language.` : "",
      loser ? `Mark "${loser.title}" as avoid/bad to feed failure memory and reduce repeated weak patterns.` : "",
      scoreDelta < 8 && winner && loser ? "Scores are close; capture screenshots or add reviewer notes before locking the label." : "",
      winner?.previewUrl ? "Winner has visual evidence attached." : "Attach a screenshot/result URL to make this decision more reliable.",
    ].filter(Boolean),
    notes: [
      left && right ? `Left ${left.score} vs right ${right.score}.` : "Select two prompts for a stronger review pair.",
      "Review actions reuse the existing outcome table, so recipes, DNA calibration, and memory exports update immediately.",
    ],
  };
}

export function explainPromptWin(
  left: PromptExample | undefined,
  right: PromptExample | undefined,
  outcomes: OutcomeRecord[],
  buildRuns: BuildRunRecord[],
  screenshots: ScreenshotRecord[],
): PromptWinExplanationReport {
  if (!left || !right) {
    return {
      summary: ["Select two prompts to explain the likely winner."],
      leftAdvantages: [],
      rightAdvantages: [],
      likelyWinningSignals: [],
      nextExperiment: "Pick two comparable prompts and attach outcome evidence.",
    };
  }
  const diff = diffPrompts(left, right);
  const leftReview = reviewCandidate(left, outcomes, buildRuns, screenshots);
  const rightReview = reviewCandidate(right, outcomes, buildRuns, screenshots);
  const leftEval = evaluatePrompt(left.text);
  const rightEval = evaluatePrompt(right.text);
  const signals: PromptWinSignal[] = [];
  for (const key of Object.keys(CATEGORY_LABELS) as CategoryKey[]) {
    const delta = rightEval.categoryScores[key] - leftEval.categoryScores[key];
    if (Math.abs(delta) >= 8) {
      signals.push({
        id: `category-${key}`,
        side: delta > 0 ? "right" : "left",
        label: CATEGORY_LABELS[key],
        impact: Math.abs(delta),
        detail: `${delta > 0 ? right.title : left.title} is stronger on ${CATEGORY_LABELS[key].toLowerCase()} by ${Math.abs(delta)} points.`,
      });
    }
  }
  for (const category of diff.categories) {
    if (category.leftOnly.length) {
      signals.push({
        id: `left-${category.key}`,
        side: "left",
        label: `${category.label} only on left`,
        impact: Math.min(30, category.leftOnly.length * 4),
        detail: category.leftOnly.slice(0, 5).join(", "),
      });
    }
    if (category.rightOnly.length) {
      signals.push({
        id: `right-${category.key}`,
        side: "right",
        label: `${category.label} only on right`,
        impact: Math.min(30, category.rightOnly.length * 4),
        detail: category.rightOnly.slice(0, 5).join(", "),
      });
    }
  }
  const sorted = signals.sort((a, b) => b.impact - a.impact).slice(0, 10);
  return {
    summary: [
      `${left.title}: ${leftReview?.score ?? 0} review score.`,
      `${right.title}: ${rightReview?.score ?? 0} review score.`,
      diff.summary[0] ?? "Prompt differences summarized from structure, tags, stack, fonts, and colors.",
    ],
    leftAdvantages: sorted.filter((signal) => signal.side === "left").slice(0, 5).map((signal) => `${signal.label}: ${signal.detail}`),
    rightAdvantages: sorted.filter((signal) => signal.side === "right").slice(0, 5).map((signal) => `${signal.label}: ${signal.detail}`),
    likelyWinningSignals: sorted,
    nextExperiment: "Create one variant that keeps the winner's strongest signals while patching the loser's highest-impact gaps.",
  };
}

export function buildQualityGateReport(
  prompt: PromptExample | undefined,
  result?: ResultScore,
  screenshotQa?: ScreenshotQaReport,
): QualityGateReport {
  const text = prompt?.text ?? "";
  const evaluation = evaluatePrompt(text);
  const analysis = analyzePrompt(text);
  const visual = auditVisualPrompt(text);
  const checks: QualityGateCheck[] = [
    {
      key: "stack",
      label: "Stack and dependency boundary",
      score: evaluation.categoryScores.stack,
      passed: evaluation.categoryScores.stack >= 55,
      evidence: analysis.stack,
      fix: "Name framework, language, styling system, icon library, animation library, and no-go dependencies.",
    },
    {
      key: "assets",
      label: "Exact assets and media rules",
      score: evaluation.categoryScores.assets,
      passed: evaluation.categoryScores.assets >= 60,
      evidence: extractUrls(text).slice(0, 5),
      fix: "Add exact URLs, object-fit, focal point, z-index, loading, and fallback behavior.",
    },
    {
      key: "layout",
      label: "First viewport layout",
      score: evaluation.categoryScores.layout,
      passed: evaluation.categoryScores.layout >= 62,
      evidence: extractHeadings(text).slice(0, 5),
      fix: "Specify container, nav, hero content, z-layers, fixed dimensions, and first-viewport priorities.",
    },
    {
      key: "typography",
      label: "Typography system",
      score: evaluation.categoryScores.typography,
      passed: evaluation.categoryScores.typography >= 55,
      evidence: analysis.fonts,
      fix: "Declare fonts, sources, weights, variables/classes, line-height, tracking, and where each font is used.",
    },
    {
      key: "responsive",
      label: "Mobile and responsive states",
      score: Math.round(evaluation.categoryScores.responsive * 0.7 + (screenshotQa?.score ?? 0) * 0.3),
      passed: evaluation.categoryScores.responsive >= 55,
      evidence: extractCategorySignals(text, "responsive").slice(0, 6),
      fix: "Add mobile-first breakpoints, menu behavior, text wrapping, stable dimensions, and screenshot checks.",
    },
    {
      key: "state",
      label: "Interaction and motion logic",
      score: Math.round((evaluation.categoryScores.motion + evaluation.categoryScores.state) / 2),
      passed: (evaluation.categoryScores.motion + evaluation.categoryScores.state) / 2 >= 50,
      evidence: [...extractCategorySignals(text, "motion"), ...extractCategorySignals(text, "state")].slice(0, 6),
      fix: "Specify state variables, event cleanup, animation timing, loop guards, and reduced-motion behavior.",
    },
    {
      key: "constraints",
      label: "Constraints and no-go rules",
      score: evaluation.categoryScores.constraints,
      passed: evaluation.categoryScores.constraints >= 55,
      evidence: extractCategorySignals(text, "constraints").slice(0, 6),
      fix: "State forbidden overlays, libraries, placeholders, palette drift, and unrelated sections explicitly.",
    },
    {
      key: "qa",
      label: "Verification ladder",
      score: Math.round(evaluation.categoryScores.qa * 0.6 + (result?.score ?? 0) * 0.4),
      passed: evaluation.categoryScores.qa >= 42,
      evidence: extractCategorySignals(text, "qa").slice(0, 6),
      fix: "Require lint/build, browser console, desktop/mobile screenshots, media rendering, and text-overlap checks.",
    },
    {
      key: "visual",
      label: "Visual taste readiness",
      score: visual.score,
      passed: visual.score >= 68,
      evidence: visual.items.map((item) => `${item.label} ${item.score}`).slice(0, 5),
      fix: "Add brand-specific visual direction, restrained palette, real assets, and concrete composition rules.",
    },
  ];
  const score = Math.round(checks.reduce((sum, check) => sum + check.score, 0) / checks.length);
  const blocking = checks.filter((check) => !check.passed && check.score < 45).map((check) => check.label);
  const missing = checks.filter((check) => !check.passed).map((check) => check.fix);
  return {
    score,
    ready: score >= 72 && blocking.length === 0,
    checks,
    blocking,
    missing,
    nextPromptPatch: missing.length
      ? `READY-TO-BUILD PATCH\n- ${missing.slice(0, 8).join("\n- ")}`
      : "READY-TO-BUILD PATCH\n- This prompt clears the current quality gate. Run it and attach screenshot evidence.",
  };
}

export function compareDatasetVersions(versions: DatasetVersion[]): DatasetVersionComparison {
  const current = versions[0];
  const baseline = versions[1];
  const keys = ["final", "promptQuality", "predictedBuild", "actualResult", "failureRisk", "examples", "outcomes", "gold", "avoid", "screenshots", "buildRuns"];
  const deltas = Object.fromEntries(
    keys.map((key) => {
      const currentValue = current?.scores[key] ?? current?.counts[key] ?? 0;
      const baselineValue = baseline?.scores[key] ?? baseline?.counts[key] ?? 0;
      return [key, currentValue - baselineValue];
    }),
  );
  return {
    baseline,
    current,
    deltas,
    notes: [
      current ? `Current version ${current.label} has final score ${current.scores.final ?? 0}.` : "Create a dataset version to begin comparison.",
      baseline ? `Baseline ${baseline.label} has final score ${baseline.scores.final ?? 0}.` : "Create a second version to see deltas.",
      deltas.final > 0 ? `Final score improved by ${deltas.final}.` : deltas.final < 0 ? `Final score dropped by ${Math.abs(deltas.final)}.` : "Final score unchanged or not enough versions yet.",
      deltas.avoid > 0 ? "Avoid labels increased; failure memory should be richer." : "",
    ].filter(Boolean),
  };
}

export function buildGeneratorPresets(
  profile: PromptProfile,
  clusters: ArchetypeCluster[],
  outcomes: OutcomeRecord[],
  result?: ResultScore,
): GeneratorPreset[] {
  const fallback = Object.values(ARCHETYPES).map((item) => ({ label: item.label, signals: item.terms, score: 62 }));
  const sources = (clusters.length ? clusters : fallback).slice(0, 8);
  return sources.map((source, index) => {
    const archetype = source.label;
    const prompt = composeOutcomeAwarePrompt(
      profile,
      {
        brief: `a ${archetype.toLowerCase()} that should reflect the best learned website prompts`,
        brandName: ["SignalForge", "Aetherlab", "Northline", "Vellum", "Orbitly", "Atelier Nova", "Vaultline", "Bloomark"][index] ?? "PromptForge",
        siteType: archetype.includes("Section") ? "single marketing section" : "single-page landing hero",
        visualSignature: source.signals.slice(0, 5).join(", ") || "specific first viewport with real assets",
        archetype,
        mood: "premium, exact, implementation-ready, and visually specific",
        outputFlavor: "Codex-build-ready preset",
        detailLevel: 9,
        creativity: 7,
        rigor: 9,
        includeAssets: true,
        includeMotion: true,
        includeQA: true,
      },
      outcomes,
      [],
    );
    return {
      id: `preset-${slugify(archetype) || index}`,
      title: archetype,
      archetype,
      bestFor: archetype.includes("Dashboard")
        ? "SaaS interfaces with product proof"
        : archetype.includes("Video")
          ? "Cinematic first-viewport websites"
          : archetype.includes("Signup")
            ? "Focused conversion flows"
            : "High-fidelity website generation",
      prompt,
      score: Math.min(100, Math.round((source.score ?? 60) * 0.65 + profile.detailScore * 0.25 + (result?.score ?? 50) * 0.1)),
      signals: source.signals.slice(0, 8),
    };
  });
}

export function buildResultGallery(
  examples: PromptExample[],
  buildRuns: BuildRunRecord[],
  screenshots: ScreenshotRecord[],
): ResultGalleryItem[] {
  const promptMap = new Map(examples.map((example) => [example.id, example]));
  const shotItems = screenshots.map((screenshot) => {
    const prompt = promptMap.get(screenshot.promptId);
    const run = promptBuildRun(buildRuns, screenshot.promptId);
    const score = scoreResultArtifact(prompt, screenshot, run).score;
    return {
      id: screenshot.id,
      promptId: screenshot.promptId,
      title: screenshot.title || prompt?.title || "Screenshot result",
      image: screenshot.url,
      resultUrl: run?.resultUrl ?? "",
      score,
      status: screenshot.rating,
      notes: screenshot.notes,
      createdAt: screenshot.createdAt,
    };
  });
  const runItems = buildRuns
    .filter((run) => run.screenshotUrl && !screenshots.some((screenshot) => screenshot.url === run.screenshotUrl))
    .map((run) => {
      const prompt = promptMap.get(run.promptId);
      return {
        id: run.id,
        promptId: run.promptId,
        title: run.promptTitle,
        image: run.screenshotUrl,
        resultUrl: run.resultUrl,
        score: scoreResultArtifact(prompt, undefined, run).score,
        status: run.status,
        notes: run.notes || run.errors,
        createdAt: run.updatedAt,
      };
    });
  return [...shotItems, ...runItems].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 24);
}

export function buildReusableMemoryPack({
  failureMemory,
  generatorPresets,
  goldenRecipes,
  promptMemory,
  qualityGate,
}: {
  failureMemory: FailureMemoryReport;
  generatorPresets: GeneratorPreset[];
  goldenRecipes: GoldenRecipe[];
  promptMemory: PromptMemoryExport;
  qualityGate: QualityGateReport;
}): ReusableMemoryPack {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    qualityGate,
    goldenRecipes,
    generatorPresets: generatorPresets.map(({ id, title, archetype, bestFor, score, signals }) => ({ id, title, archetype, bestFor, score, signals })),
    failureMemory,
    promptMemory: JSON.parse(promptMemory.json) as unknown,
  };
  const markdown = `# Website Prompt Memory Pack

## Quality Gate

Score: ${qualityGate.score}
Ready: ${qualityGate.ready ? "yes" : "no"}

${qualityGate.checks.map((check) => `- ${check.label}: ${check.score} (${check.passed ? "pass" : "needs work"})`).join("\n")}

## Golden Recipes

${goldenRecipes
  .slice(0, 8)
  .map((recipe) => `### ${recipe.archetype}\nScore: ${recipe.score}\n\n${recipe.recipe.map((item) => `- ${item}`).join("\n")}\n\nAvoid: ${recipe.avoid.join(", ") || "none"}`)
  .join("\n\n")}

## Generator Presets

${generatorPresets.map((preset) => `- ${preset.title}: ${preset.bestFor} (${preset.score})`).join("\n")}

## Failure Memory Patch

${failureMemory.promptPatch}

${promptMemory.markdown}
`;
  return {
    markdown,
    json: JSON.stringify(payload, null, 2),
    sections: [
      { title: "Quality gate checks", count: qualityGate.checks.length },
      { title: "Golden recipes", count: goldenRecipes.length },
      { title: "Generator presets", count: generatorPresets.length },
      { title: "Failure categories", count: failureMemory.categories.length },
      { title: "Prompt memory sections", count: promptMemory.sections.length },
    ],
  };
}

export function buildPatternDashboard(
  examples: PromptExample[],
  outcomes: OutcomeRecord[] = [],
  buildRuns: BuildRunRecord[] = [],
): PatternDashboardReport {
  const outcomeByPrompt = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const runsByPrompt = new Map<string, BuildRunRecord[]>();
  for (const run of buildRuns) {
    runsByPrompt.set(run.promptId, [...(runsByPrompt.get(run.promptId) || []), run]);
  }
  const rows = Object.entries(ARCHETYPES).map(([key, archetype]) => {
    const matched = examples.filter((example) => analyzeArchetypeMatches(example.text).some((match) => match.key === key));
    const promptScores = matched.map((example) => evaluatePrompt(example.text).score);
    const resultScores = matched.flatMap((example) => (runsByPrompt.get(example.id) || []).map((run) => run.score || 0)).filter(Boolean);
    const gold = matched.filter((example) => outcomeByPrompt.get(example.id)?.status === "gold" || outcomeByPrompt.get(example.id)?.rating === "great").length;
    const avoid = matched.filter((example) => outcomeByPrompt.get(example.id)?.status === "avoid" || outcomeByPrompt.get(example.id)?.rating === "bad").length;
    const prompts = matched.length;
    return {
      label: archetype.label,
      prompts,
      gold,
      avoid,
      averagePromptScore: prompts ? Math.round(promptScores.reduce((sum, value) => sum + value, 0) / prompts) : 0,
      averageResultScore: resultScores.length ? Math.round(resultScores.reduce((sum, value) => sum + value, 0) / resultScores.length) : 0,
      winRate: prompts ? Math.round((gold / prompts) * 100) : 0,
      notes: [
        prompts ? `${prompts} prompt(s) match this pattern.` : "No prompts match this pattern yet.",
        gold ? `${gold} gold/great outcome(s).` : "Needs ground-truth wins.",
        avoid ? `${avoid} avoid/bad outcome(s) to study.` : "No avoid labels yet.",
      ],
    } satisfies PatternDashboardItem;
  });
  const items = rows.filter((row) => row.prompts > 0).sort((a, b) => b.winRate - a.winRate || b.averagePromptScore - a.averagePromptScore);
  return {
    items,
    summary: [
      `${items.length} active pattern group(s).`,
      items[0] ? `${items[0].label} is currently strongest at ${items[0].winRate}% win rate.` : "Add labels to reveal winning prompt patterns.",
      "Use this report to decide which prompt structures should feed generator presets.",
    ],
  };
}

export function buildVisualRegressionReport(buildRuns: BuildRunRecord[] = [], screenshots: ScreenshotRecord[] = []): VisualRegressionReport {
  const screenshotByPrompt = new Map<string, ScreenshotRecord[]>();
  for (const screenshot of screenshots) screenshotByPrompt.set(screenshot.promptId, [...(screenshotByPrompt.get(screenshot.promptId) || []), screenshot]);
  const completed = buildRuns.filter((run) => run.status === "passed" || run.status === "needs-review");
  const failed = buildRuns.filter((run) => run.status === "failed");
  const missingScreenshots = buildRuns.filter((run) => !run.screenshotUrl && !(screenshotByPrompt.get(run.promptId) || []).length);
  const badScreenshots = screenshots.filter((screenshot) => screenshot.rating === "bad");
  const greatScreenshots = screenshots.filter((screenshot) => screenshot.rating === "great");
  const checks = [
    {
      label: "Run coverage",
      passed: buildRuns.length > 0,
      detail: buildRuns.length ? `${buildRuns.length} build run(s) recorded.` : "No build runs recorded yet.",
    },
    {
      label: "Screenshot coverage",
      passed: missingScreenshots.length === 0 && screenshots.length > 0,
      detail: missingScreenshots.length ? `${missingScreenshots.length} run(s) missing screenshots.` : `${screenshots.length} screenshot(s) attached.`,
    },
    {
      label: "Failure pressure",
      passed: failed.length <= Math.max(1, Math.floor(buildRuns.length * 0.25)),
      detail: `${failed.length} failed run(s), ${completed.length} completed/reviewable run(s).`,
    },
    {
      label: "Visual rating",
      passed: badScreenshots.length === 0 && greatScreenshots.length > 0,
      detail: `${greatScreenshots.length} great screenshot(s), ${badScreenshots.length} bad screenshot(s).`,
    },
  ];
  const score = Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
  return {
    score,
    checks,
    notes: [
      score >= 75 ? "Visual regression posture is healthy." : "Add captures and mark screenshot ratings before trusting prompt winners.",
      missingScreenshots.length ? "Capture missing runs before exporting a project pack." : "Screenshot evidence is linked for current runs.",
      failed.length ? "Repair failed runs and feed their errors into failure memory." : "No failed runs recorded.",
    ],
  };
}

export function buildPromptCoachReport(text: string, profile: PromptProfile, outcomes: OutcomeRecord[] = []): PromptCoachReport {
  const evaluation = evaluatePrompt(text);
  const visual = auditVisualPrompt(text);
  const weakCategories = Object.entries(evaluation.categoryScores)
    .filter(([, value]) => value < 45)
    .sort((a, b) => a[1] - b[1])
    .map(([key]) => key)
    .slice(0, 5);
  const questions = [
    weakCategories.includes("assets") ? "What exact video, image, logo, screenshot, or generated asset should define the first viewport?" : "",
    weakCategories.includes("typography") ? "Which fonts, weights, sizes, line heights, and import URLs should the build use?" : "",
    weakCategories.includes("layout") ? "How should the page be layered from background to navigation to content to proof surfaces?" : "",
    weakCategories.includes("responsive") ? "What should change on mobile, tablet, desktop, and wide desktop?" : "",
    weakCategories.includes("qa") ? "What screenshot, accessibility, and interaction checks prove the output worked?" : "",
  ].filter(Boolean);
  const outcomeRule = outcomes.filter((outcome) => outcome.rating === "great" || outcome.status === "gold")[0]?.notes || profile.learnedRules[0] || "Use exact implementation details and one memorable visual system.";
  const rewrittenPrompt = improvePromptWithLearning(text, profile, outcomes, {
    score: evaluation.score,
    checks: visual.items,
    failureCategories: [],
    recommendations: [outcomeRule, "Run as coached prompt."],
  });
  return {
    score: Math.round(evaluation.score * 0.7 + visual.score * 0.3),
    diagnosis: [
      `Static prompt score ${evaluation.score}; visual QA score ${visual.score}.`,
      weakCategories.length ? `Weakest categories: ${weakCategories.join(", ")}.` : "Core categories are covered.",
      `Best learned rule to apply: ${outcomeRule}`,
    ],
    questions: questions.length ? questions : ["What single output would prove this prompt is excellent?"],
    rewrittenPrompt,
  };
}

export function buildProjectExportPack({
  curation,
  modelEvaluations,
  prompt,
  promptMemory,
  qualityGate,
  visualRegression,
}: {
  curation: CorpusCurationReport;
  modelEvaluations: unknown[];
  prompt?: PromptExample;
  promptMemory: PromptMemoryExport;
  qualityGate: QualityGateReport;
  visualRegression: VisualRegressionReport;
}): ProjectExportPack {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    prompt,
    qualityGate,
    visualRegression,
    curation: {
      counts: curation.counts,
      notes: curation.notes,
    },
    modelEvaluations,
    promptMemory: JSON.parse(promptMemory.json) as unknown,
  };
  const markdown = `# Prompt Atelier Project Export

## Selected Prompt

${prompt ? `Title: ${prompt.title}\n\n${prompt.text}` : "No prompt selected."}

## Quality Gate

Score: ${qualityGate.score}
Ready: ${qualityGate.ready ? "yes" : "no"}

${qualityGate.blocking.map((item) => `- ${item}`).join("\n") || "- No blockers."}

## Visual Regression

Score: ${visualRegression.score}

${visualRegression.checks.map((check) => `- ${check.label}: ${check.passed ? "pass" : "needs work"} - ${check.detail}`).join("\n")}

## Curation

${curation.notes.map((note) => `- ${note}`).join("\n")}

## Model Evaluation

${modelEvaluations.slice(0, 12).map((item) => `- ${JSON.stringify(item)}`).join("\n")}

${promptMemory.markdown}
`;
  return {
    markdown,
    json: JSON.stringify(payload, null, 2),
    sections: [
      { title: "Prompt", count: prompt ? 1 : 0 },
      { title: "Quality gate", count: qualityGate.checks.length },
      { title: "Visual regression", count: visualRegression.checks.length },
      { title: "Model evaluations", count: modelEvaluations.length },
    ],
  };
}

export function classifyBuildFailures(input: string): FailureCategory[] {
  const lower = input.toLowerCase();
  const categories: FailureCategory[] = [];
  if (/layout|spacing|position|align|z-index|wrong place|off screen|overflow/.test(lower)) categories.push("vague-layout");
  if (/asset|image|video|404|not found|missing|placeholder|broken media/.test(lower)) categories.push("missing-assets");
  if (/mobile|responsive|small screen|viewport|hamburger|wrap/.test(lower)) categories.push("bad-mobile");
  if (/dependency|library|package|install|module|bundle/.test(lower)) categories.push("too-many-libraries");
  if (/overlap|collide|occlude|covered|text over/.test(lower)) categories.push("text-overlap");
  if (/first viewport|hero|cta|brand|above the fold|blank/.test(lower)) categories.push("weak-first-viewport");
  if (/generic|stock|boring|template|vague|not premium/.test(lower)) categories.push("generic-design");
  if (/error|exception|crash|failed|vite|typescript|runtime|console/.test(lower)) categories.push("runtime-error");
  return unique(categories, 8) as FailureCategory[];
}

export function scoreResultArtifact(
  prompt: PromptExample | undefined,
  screenshot?: ScreenshotRecord,
  run?: BuildRunRecord,
): ResultScore {
  const promptReport = auditVisualPrompt(prompt?.text ?? "");
  const combinedNotes = `${screenshot?.notes ?? ""}\n${run?.errors ?? ""}\n${run?.notes ?? ""}`;
  const failureCategories = classifyBuildFailures(combinedNotes || run?.status || "");
  const hasScreenshot = Boolean(screenshot?.url || run?.screenshotUrl);
  const hasUrl = Boolean(run?.resultUrl);
  const passed = run?.status === "passed" || screenshot?.rating === "great";
  const failed = run?.status === "failed" || screenshot?.rating === "bad";

  const checks: VisualQaItem[] = [
    {
      label: "Prompt readiness",
      score: promptReport.score,
      notes: [`Prompt-side visual QA is ${promptReport.score}/100.`],
    },
    {
      label: "Result capture",
      score: hasScreenshot ? 90 : 30,
      notes: [hasScreenshot ? "Screenshot/result image attached." : "Attach a screenshot URL or data URL for visual review."],
    },
    {
      label: "Inspectable URL",
      score: hasUrl ? 85 : 45,
      notes: [hasUrl ? "Result URL is recorded." : "Add a localhost or deployment URL for browser scoring."],
    },
    {
      label: "Failure clarity",
      score: failureCategories.length ? 78 : failed ? 35 : 82,
      notes: [failureCategories.length ? `Classified: ${failureCategories.join(", ")}` : "No failure category detected."],
    },
    {
      label: "Outcome signal",
      score: passed ? 92 : failed ? 35 : screenshot?.rating === "okay" || run?.status === "needs-review" ? 64 : 55,
      notes: [passed ? "Marked successful." : failed ? "Marked failed or bad." : "Needs a result rating."],
    },
  ];
  const score = Math.round(checks.reduce((sum, item) => sum + item.score, 0) / checks.length);
  const recommendations = [
    !hasScreenshot ? "Capture and attach a desktop and mobile screenshot." : "",
    !hasUrl ? "Record the running result URL so browser QA can verify it." : "",
    failureCategories.includes("bad-mobile") ? "Add stricter mobile breakpoint rules to the prompt." : "",
    failureCategories.includes("missing-assets") ? "Replace vague asset slots with exact URLs or fallback behavior." : "",
    failureCategories.includes("text-overlap") ? "Add stable dimensions, wrapping rules, and mobile text checks." : "",
    score < 70 ? "Run one improved prompt variant and compare screenshots." : "Save this as a gold example if the visual result matches the target.",
  ].filter(Boolean);

  return { score, checks, failureCategories, recommendations };
}

export function createBuildRunHandoff(prompt: PromptExample, run: Partial<BuildRunRecord> = {}) {
  const runId = run.id || `run-${slugify(prompt.title).slice(0, 42)}-${Date.now()}`;
  return `# Prompt Build Run

Run ID: ${runId}
Prompt: ${prompt.title}

## Build Prompt

${prompt.text}

## Expected Workflow

1. Create a fresh sandbox folder for this run.
2. Build the site exactly from the prompt.
3. Start the local dev server and record the URL.
4. Capture desktop and mobile screenshots.
5. Run browser QA for first viewport, media loading, text overlap, mobile fit, visible CTA, and console errors.
6. Paste the result URL, screenshot URL/path, files changed, errors, and notes back into Prompt Atelier.

## Result Fields

- Result URL: ${run.resultUrl ?? ""}
- Folder: ${run.folderPath ?? ""}
- Screenshot: ${run.screenshotUrl ?? ""}
- Files changed: ${run.filesChanged ?? ""}
- Errors: ${run.errors ?? ""}
- Notes: ${run.notes ?? ""}
`;
}

export function mutatePromptVariants(text: string, profile: PromptProfile, outcomes: OutcomeRecord[] = []): PromptMutation[] {
  const source = text.trim() || composePrompt(profile, {
    brief: "a premium website experience",
    brandName: "Variant",
    siteType: "single-page landing page",
    visualSignature: "strong first viewport with exact build rules",
    archetype: "Cinematic Video Hero",
    mood: "premium and buildable",
    outputFlavor: "variant",
    detailLevel: 8,
    creativity: 7,
    rigor: 8,
    includeAssets: true,
    includeMotion: true,
    includeQA: true,
  });
  const summary = buildOutcomeSummary(outcomes, []);
  const baseTail = `\n\nPreserve exact stack, copy, asset rules, responsive behavior, accessibility, and no-go constraints. Favor proven signals: ${summary.goldSignals.join(", ") || "exact assets, named sections, motion state, responsive rules"}. Avoid: ${summary.avoidSignals.join(", ") || "vague layout, missing assets, weak mobile rules"}.`;
  const variants = [
    {
      id: "more-cinematic",
      title: "More cinematic",
      intent: "Increase first-viewport atmosphere while keeping implementation details exact.",
      prefix: "Rewrite this prompt to be more cinematic and visually memorable. Add stronger media direction, typography hierarchy, and first-viewport composition rules.",
    },
    {
      id: "more-buildable",
      title: "More buildable",
      intent: "Make the prompt easier for an engineer to implement without guessing.",
      prefix: "Rewrite this prompt to be more buildable. Add file structure, state mechanics, dependency boundaries, QA checks, and exact implementation order.",
    },
    {
      id: "more-minimal",
      title: "More minimal",
      intent: "Reduce decorative excess and keep only high-value visual and technical detail.",
      prefix: "Rewrite this prompt to be more minimal and restrained. Remove ornamental clutter while preserving exact values and build constraints.",
    },
    {
      id: "more-original",
      title: "More original",
      intent: "Push the signature mechanic beyond common video/glass patterns.",
      prefix: "Rewrite this prompt to be more original. Add one distinctive but buildable interaction or composition idea that is not generic.",
    },
    {
      id: "more-exact",
      title: "More exact",
      intent: "Increase specificity for values, breakpoints, assets, and verification.",
      prefix: "Rewrite this prompt to be more exact. Add concrete values for spacing, colors, typography, z-index, assets, responsive behavior, motion timing, and verification.",
    },
  ];

  return variants.map((variant) => {
    const prompt = `${variant.prefix}\n\nSOURCE PROMPT\n${source}${baseTail}`;
    return {
      id: variant.id,
      title: variant.title,
      intent: variant.intent,
      prompt,
      score: evaluatePrompt(prompt).score,
    };
  });
}

export function improvePromptWithLearning(
  text: string,
  profile: PromptProfile,
  outcomes: OutcomeRecord[] = [],
  result?: ResultScore,
) {
  const rewritten = rewritePrompt(text, profile);
  const summary = buildOutcomeSummary(outcomes, []);
  const resultNotes = result
    ? `\nRESULT FEEDBACK\n- Score: ${result.score}/100\n- Failures: ${result.failureCategories.join(", ") || "none"}\n${formatBullets(result.recommendations)}`
    : "";

  return `${rewritten}

LEARNED OUTCOME RULES
- Boost these successful signals: ${summary.goldSignals.join(", ") || "exact asset behavior, named layer order, responsive rules, and QA notes"}.
- Avoid these weak signals: ${summary.avoidSignals.join(", ") || "vague layouts, missing assets, weak first viewport, and bad mobile behavior"}.
${summary.notes.length ? `- Human outcome notes:\n${formatBullets(summary.notes)}` : ""}
${resultNotes}

FINAL PASS
- Make the first viewport inspectable and distinctive.
- Include a desktop and mobile verification checklist.
- Add failure-prevention rules for missing assets, text overlap, bad mobile fit, and runtime errors.`;
}

export function rankPromptExamples(examples: PromptExample[], outcomes: OutcomeRecord[] = []): PromptRank[] {
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const semanticSets = examples.map((example) => ({ example, tokens: semanticTokens(example.text) }));

  return examples
    .filter((example) => countWords(example.text) >= 50)
    .map((example) => {
      const analysis = analyzePrompt(example.text);
      const dnaScore = Math.round(Object.values(analysis.dna).reduce((sum, score) => sum + score, 0) / Object.values(analysis.dna).length);
      const outcome = outcomeMap.get(example.id);
      const outcomeBoost = Math.round((outcomeWeight(outcome) - 1) * 100);
      const self = semanticSets.find((entry) => entry.example.id === example.id);
      const maxSimilarity = self
        ? Math.max(
            0,
            ...semanticSets
              .filter((entry) => entry.example.id !== example.id)
              .map((entry) => jaccardSimilarity(self.tokens, entry.tokens)),
          )
        : 0;
      const originality = Math.max(0, Math.round(100 - maxSimilarity * 100));
      const score = Math.max(0, Math.min(100, Math.round(dnaScore * 0.58 + originality * 0.18 + outcomeBoost * 0.24)));
      const reasons = [
        `${analysis.archetypes[0]?.label ?? "Unclustered"} archetype`,
        `${dnaScore} DNA`,
        `${originality} originality`,
        outcome?.status === "gold" ? "Gold set" : "",
        outcome?.rating === "great" ? "Great result" : "",
      ].filter(Boolean);
      return { example, score, dnaScore, outcomeBoost, originality, reasons };
    })
    .sort((a, b) => b.score - a.score || b.dnaScore - a.dnaScore)
    .slice(0, 30);
}

export function buildLocalEmbeddingIndex(examples: PromptExample[], outcomes: OutcomeRecord[] = []): LocalEmbeddingIndex {
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const termMap = new Map<string, Feature>();
  const goldMap = new Map<string, Feature>();
  const avoidMap = new Map<string, Feature>();
  let weightedPromptCount = 0;

  for (const example of examples) {
    if (countWords(example.text) < 50) continue;
    const outcome = outcomeMap.get(example.id);
    const weight = outcomeWeight(outcome);
    weightedPromptCount += weight;
    const terms = Array.from(semanticTokens(example.text)).filter((term) => term.length >= 4 && !/^\d+$/.test(term)).slice(0, 80);
    for (const term of terms) {
      pushFeature(termMap, term, example.title, Math.max(1, Math.round(weight * 2)));
      if (outcome?.status === "gold" || outcome?.rating === "great") pushFeature(goldMap, term, example.title);
      if (outcome?.status === "avoid" || outcome?.rating === "bad") pushFeature(avoidMap, term, example.title);
    }
  }

  return {
    promptCount: examples.filter((example) => countWords(example.text) >= 50).length,
    weightedPromptCount: Math.round(weightedPromptCount),
    topTerms: makeFeatureList(termMap, 18),
    goldTerms: makeFeatureList(goldMap, 12),
    avoidTerms: makeFeatureList(avoidMap, 12),
    notes: [
      "This is a local TF-IDF-style intent index built from prompt text, tags, archetypes, stack, fonts, and outcome weights.",
      "Gold/great prompts increase term weight; bad/avoid prompts reduce their influence in search and generation.",
      "Use this as the cheap local embedding layer until a real embedding provider is wired in.",
    ],
  };
}

function promptDnaAverage(text: string) {
  const dna = analyzePrompt(text).dna;
  return Math.round(Object.values(dna).reduce((sum, score) => sum + score, 0) / Object.values(dna).length);
}

function actualOutcomeScore(outcome?: OutcomeRecord, run?: BuildRunRecord, screenshot?: ScreenshotRecord) {
  const scores: number[] = [];
  if (outcome) {
    const ratingScore = outcome.rating === "great" ? 92 : outcome.rating === "okay" ? 68 : outcome.rating === "bad" ? 28 : 52;
    const statusScore =
      outcome.status === "gold"
        ? 98
        : outcome.status === "good"
          ? 82
          : outcome.status === "experimental"
            ? 58
            : outcome.status === "avoid"
              ? 20
              : 52;
    scores.push(Math.round((ratingScore + statusScore) / 2));
  }
  if (run) scores.push(run.score || (run.status === "passed" ? 86 : run.status === "failed" ? 24 : 55));
  if (screenshot) scores.push(screenshot.rating === "great" ? 88 : screenshot.rating === "okay" ? 64 : screenshot.rating === "bad" ? 26 : 52);
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function pearson(rows: DnaCalibrationRow[]) {
  if (rows.length < 2) return 0;
  const xMean = rows.reduce((sum, row) => sum + row.predicted, 0) / rows.length;
  const yMean = rows.reduce((sum, row) => sum + row.actual, 0) / rows.length;
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  for (const row of rows) {
    const x = row.predicted - xMean;
    const y = row.actual - yMean;
    numerator += x * y;
    xDenominator += x * x;
    yDenominator += y * y;
  }
  if (!xDenominator || !yDenominator) return 0;
  return Math.round((numerator / Math.sqrt(xDenominator * yDenominator)) * 100);
}

const FAILURE_FIXES: Record<FailureCategory, string> = {
  "vague-layout": "Add named sections, exact layer order, z-index, spacing, dimensions, and responsive alignment.",
  "missing-assets": "Use exact asset URLs or named fallback slots with object-fit, focal point, and loading behavior.",
  "bad-mobile": "Add mobile/tablet/desktop rules, stable dimensions, wrapping behavior, and mobile menu states.",
  "too-many-libraries": "Declare the allowed dependency list and explicitly ban extra UI/animation libraries.",
  "text-overlap": "Add wrapping rules, max-widths, clamp sizes, stable controls, and mobile screenshot checks.",
  "weak-first-viewport": "Make brand/product/place, headline, CTA, and primary media visible in the first viewport.",
  "generic-design": "Replace mood words with exact visual signature, typography, color, media, and layout values.",
  "runtime-error": "Add file structure, state cleanup, dependency versions, and build/browser verification commands.",
};

export function buildRunnerPlan(prompt: PromptExample | undefined, run?: BuildRunRecord): BuildRunnerPlan | undefined {
  if (!prompt) return undefined;
  const slug = slugify(prompt.title).slice(0, 48) || "prompt";
  const runId = run?.id || `run-${slug}`;
  const runFolder = run?.folderPath || `prompt-runs/${runId}`;
  const promptFile = `${runFolder}/prompt.md`;
  const captureOut = `${runFolder}/screenshots`;
  const resultUrl = run?.resultUrl || "http://127.0.0.1:5173";
  const partialRun = run ?? { id: runId, folderPath: runFolder, resultUrl, screenshotUrl: `${captureOut}/desktop.png` };

  return {
    runId,
    runFolder,
    promptFile,
    handoff: createBuildRunHandoff(prompt, partialRun),
    commands: [
      {
        label: "Create run folder",
        command: `npm run run:prompt -- --prompt-file ./prompt.md --title "${prompt.title.replace(/"/g, "'")}"`,
      },
      {
        label: "Build with Codex",
        command: `cd ${runFolder} && codex < codex-task.md`,
      },
      {
        label: "Capture desktop/mobile screenshots",
        command: `npm run capture:result -- --url ${resultUrl} --out ${captureOut}`,
      },
      {
        label: "Paste result JSON",
        command: `cat ${captureOut}/screenshot-result.json`,
      },
    ],
    nextSteps: [
      "Run the prompt in a fresh sandbox so implementation drift is isolated.",
      "Capture both desktop and mobile screenshots before rating the output.",
      "Paste URL, screenshot path, errors, files changed, and notes back into this Train tab.",
      "Promote great results to gold; mark weak patterns avoid so future prompts learn from them.",
    ],
  };
}

export function scoreScreenshotSet(
  prompt: PromptExample | undefined,
  screenshots: ScreenshotRecord[] = [],
  run?: BuildRunRecord,
): ScreenshotQaReport {
  const promptReport = auditVisualPrompt(prompt?.text ?? "");
  const desktop = screenshots.find((item) => /desktop|wide|1440|mac/i.test(`${item.title} ${item.notes}`));
  const mobile = screenshots.find((item) => /mobile|phone|390|375|small/i.test(`${item.title} ${item.notes}`));
  const hasRunCapture = Boolean(run?.screenshotUrl);
  const hasAny = Boolean(screenshots.length || hasRunCapture);
  const notesText = `${screenshots.map((item) => item.notes).join("\n")}\n${run?.notes ?? ""}\n${run?.errors ?? ""}`;
  const failures = classifyBuildFailures(notesText);
  const lowerNotes = notesText.toLowerCase();
  const blankRisk = /blank|empty|white screen|black screen|nothing rendered|no pixels|canvas blank/.test(lowerNotes);
  const overlapRisk = /overlap|clipping|cut off|overflow|cropped text|text overflow|wrapped badly/.test(lowerNotes);
  const mediaRisk = /video failed|image failed|asset missing|404|broken media|placeholder|not loaded/.test(lowerNotes);
  const contrastRisk = /contrast|unreadable|too faint|washed out|low opacity/.test(lowerNotes);
  const items: VisualQaItem[] = [
    {
      label: "Desktop capture",
      score: desktop || hasRunCapture ? 88 : hasAny ? 62 : 22,
      notes: [desktop || hasRunCapture ? "Desktop or primary screenshot is available." : "Capture a desktop first viewport."],
    },
    {
      label: "Mobile capture",
      score: mobile ? 88 : 28,
      notes: [mobile ? "Mobile screenshot is available." : "Capture a mobile viewport to catch wrapping and menu issues."],
    },
    {
      label: "Blank-page guard",
      score: blankRisk ? 18 : hasAny ? 88 : 42,
      notes: [blankRisk ? "Notes suggest a blank or empty render." : "No blank-render signal detected."],
    },
    {
      label: "Overflow/text overlap",
      score: overlapRisk || failures.includes("text-overlap") ? 28 : hasAny ? 84 : 48,
      notes: [overlapRisk ? "Notes mention clipping, overflow, or text overlap." : "No text overlap signal detected."],
    },
    {
      label: "Media and asset load",
      score: mediaRisk || failures.includes("missing-assets") ? 32 : hasAny ? 82 : 46,
      notes: [mediaRisk ? "Notes mention missing or failed media/assets." : "No media failure signal detected."],
    },
    {
      label: "Contrast/readability",
      score: contrastRisk ? 42 : hasAny ? 78 : 52,
      notes: [contrastRisk ? "Notes mention readability or contrast issues." : "No contrast warning detected."],
    },
    {
      label: "Prompt QA readiness",
      score: promptReport.score,
      notes: [`Prompt-side visual QA is ${promptReport.score}/100.`],
    },
    {
      label: "Failure notes",
      score: failures.length ? 62 : hasAny ? 82 : 44,
      notes: [failures.length ? `Detected: ${failures.join(", ")}` : "No screenshot failure notes detected."],
    },
  ];
  const score = Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
  const url = run?.resultUrl || "http://127.0.0.1:5173";
  const out = run?.folderPath ? `${run.folderPath}/screenshots` : "prompt-runs/latest/screenshots";

  return {
    score,
    items,
    captureCommands: [
      `npm run capture:result -- --url ${url} --out ${out}`,
      `npm run capture:result -- --url ${url} --out ${out} --desktop 1440x1000 --mobile 390x844`,
    ],
    notes: [
      score < 65 ? "Screenshot coverage is not strong enough for reliable learning yet." : "Screenshot coverage is ready to feed the learning loop.",
      "Name screenshot records desktop/mobile so the scorer can separate viewport evidence.",
      "Visual scoring checks blank renders, overflow, text overlap, missing media, contrast, mobile clipping, and failure notes.",
      ...failures.map((failure) => FAILURE_FIXES[failure]),
    ],
  };
}

export function calibrateDnaScores(
  examples: PromptExample[],
  outcomes: OutcomeRecord[] = [],
  buildRuns: BuildRunRecord[] = [],
  screenshots: ScreenshotRecord[] = [],
): DnaCalibrationReport {
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const runMap = new Map(buildRuns.map((run) => [run.promptId, run]));
  const screenshotMap = new Map(screenshots.map((screenshot) => [screenshot.promptId, screenshot]));
  const rows = examples
    .map((example) => {
      const actual = actualOutcomeScore(outcomeMap.get(example.id), runMap.get(example.id), screenshotMap.get(example.id));
      return {
        promptId: example.id,
        title: example.title,
        predicted: promptDnaAverage(example.text),
        actual,
        delta: actual ? actual - promptDnaAverage(example.text) : 0,
      };
    })
    .filter((row) => row.actual > 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const predictedAverage = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.predicted, 0) / rows.length) : 0;
  const actualAverage = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.actual, 0) / rows.length) : 0;
  const correlation = pearson(rows);
  const calibratedScore = rows.length ? Math.max(0, Math.min(100, Math.round(predictedAverage * 0.55 + actualAverage * 0.45))) : predictedAverage;

  return {
    predictedAverage,
    actualAverage,
    correlation,
    calibratedScore,
    rows,
    insights: [
      rows.length < 5 ? "Add at least five rated builds for meaningful DNA calibration." : `${rows.length} rated builds are feeding calibration.`,
      correlation >= 45
        ? "DNA score is becoming predictive of actual build quality."
        : correlation <= -20
          ? "DNA score is inverted against outcomes; review what you are marking gold."
          : "DNA score is descriptive more than predictive right now.",
      actualAverage > predictedAverage + 8
        ? "Your prompts are building better than their static DNA suggests; outcome weighting should boost them."
        : predictedAverage > actualAverage + 8
          ? "Prompts look strong on paper but need more result-proof constraints."
          : "Static prompt quality and actual results are broadly aligned.",
    ],
  };
}

export function buildCorpusCleaningReport(examples: PromptExample[], outcomes: OutcomeRecord[] = []): CorpusCleaningReport {
  const exactMap = new Map<string, PromptExample[]>();
  for (const example of examples) {
    const key = normalizeForSimilarity(example.text);
    const bucket = exactMap.get(key) ?? [];
    bucket.push(example);
    exactMap.set(key, bucket);
  }
  const exactDuplicates = Array.from(exactMap.values())
    .filter((bucket) => bucket.length > 1)
    .map((bucket) => ({
      kind: "exact" as const,
      score: 100,
      keep: bucket[0],
      matches: bucket.slice(1),
      reason: "Text normalizes to the same content.",
    }));

  const prepared = examples
    .filter((example) => countWords(example.text) >= 50)
    .slice(0, 120)
    .map((example) => ({
      example,
      tokens: semanticTokens(example.text),
      signature: structureSignature(example.text),
      words: countWords(example.text),
    }));
  const nearDuplicates: CorpusDuplicateGroup[] = [];
  for (let i = 0; i < prepared.length; i += 1) {
    for (let j = i + 1; j < prepared.length; j += 1) {
      const left = prepared[i];
      const right = prepared[j];
      const textScore = jaccardSimilarity(left.tokens, right.tokens);
      const structureScore = structuralSimilarity(left.signature, right.signature);
      const score = Math.round((textScore * 0.72 + structureScore * 0.28) * 100);
      if (score >= 82) {
        nearDuplicates.push({
          kind: "near",
          score,
          keep: left.words >= right.words ? left.example : right.example,
          matches: [left.words >= right.words ? right.example : left.example],
          reason: "High semantic and structural overlap.",
        });
      }
    }
  }

  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const weakPrompts = examples
    .map((example) => {
      const evaluation = evaluatePrompt(example.text);
      const outcome = outcomeMap.get(example.id);
      const reasons = [
        evaluation.score < 55 ? `Low evaluator score (${evaluation.score}).` : "",
        countWords(example.text) < 70 ? "Too short to teach detailed website prompting." : "",
        outcome?.status === "avoid" || outcome?.rating === "bad" ? "Marked as weak by outcome training." : "",
        !extractUrls(example.text).length && /video|image|asset|hero/i.test(example.text) ? "Mentions visual assets but has no exact URL." : "",
      ].filter(Boolean);
      return { example, score: evaluation.score, reasons };
    })
    .filter((item) => item.reasons.length)
    .sort((a, b) => a.score - b.score)
    .slice(0, 20);

  const archetypeCounts = new Map<string, number>();
  for (const example of examples) {
    const label = analyzePrompt(example.text).archetypes[0]?.label ?? "Unclustered";
    archetypeCounts.set(label, (archetypeCounts.get(label) ?? 0) + 1);
  }
  const average = examples.length / Math.max(1, archetypeCounts.size);
  const archetypeBalance = Array.from(archetypeCounts.entries())
    .map(([label, count]) => ({
      label,
      count,
      status: count > average * 1.75 ? ("dominant" as const) : count < Math.max(2, average * 0.45) ? ("thin" as const) : ("healthy" as const),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    exactDuplicates,
    nearDuplicates: nearDuplicates.slice(0, 20),
    weakPrompts,
    archetypeBalance,
    recommendations: [
      exactDuplicates.length ? "Remove exact duplicates or keep only the clearest/longest version." : "No exact duplicate cleanup needed.",
      nearDuplicates.length ? "Merge near-duplicates into stronger archetype exemplars." : "Near-duplicate pressure is low.",
      weakPrompts.length ? "Quarantine weak prompts or mark them avoid so generation learns around them." : "No weak prompts are currently obvious.",
      archetypeBalance.some((item) => item.status === "dominant")
        ? "Balance dominant archetypes with dashboard, product, auth, editorial, and plain-CSS examples."
        : "Archetype balance is reasonably healthy.",
    ],
  };
}

export function compilePromptFromBrief(
  input: PromptCompilerInput,
  profile: PromptProfile,
  outcomes: OutcomeRecord[] = [],
  result?: ResultScore,
): CompiledPrompt {
  const roughIdea = input.roughIdea.trim() || "a premium website experience with a memorable first viewport";
  const assumptions = [
    input.brandName.trim() ? "" : "Brand name was not supplied, so the compiler uses a neutral placeholder.",
    input.stack.trim() ? "" : "Stack was inferred from the corpus top stack signals.",
    input.assets.trim() ? "" : "Assets were treated as named slots because no exact URLs were supplied.",
    input.constraints.trim() ? "" : "Default no-go rules were added to prevent generic output.",
  ].filter(Boolean);
  const prompt = composeOutcomeAwarePrompt(
    profile,
    {
      brief: roughIdea,
      brandName: input.brandName || "Compiled Brand",
      siteType: input.siteType || "single-page landing page",
      visualSignature: input.visualDirection || "specific first-viewport composition with exact implementation rules",
      archetype: analyzeArchetypeMatches(`${roughIdea} ${input.visualDirection}`)[0]?.label || "High-Fidelity Landing Page",
      mood: "specific, polished, buildable, and result-tested",
      outputFlavor: "compiled Codex build prompt",
      detailLevel: 9,
      creativity: 7,
      rigor: 9,
      includeAssets: true,
      includeMotion: true,
      includeQA: true,
    },
    outcomes,
    [],
  );
  const additions = `\n\nCOMPILER BRIEF LOCKS\n- Audience: ${input.audience || "state the target audience in the final copy and interaction priorities"}.\n- Stack override: ${input.stack || "use the learned stack defaults only"}.\n- Asset instructions: ${input.assets || "define exact asset slots and fallback behavior"}.\n- Extra constraints: ${input.constraints || "no generic stock imagery, no unlisted libraries, no vague layout decisions"}.\n${result ? `- Current result feedback to avoid: ${result.failureCategories.join(", ") || "none"}. ${result.recommendations.join(" ")}` : ""}`;
  const finalPrompt = `${prompt}${additions}`;

  return {
    prompt: finalPrompt,
    score: evaluatePrompt(finalPrompt).score,
    sections: ["Stack", "Fonts", "Color", "Assets", "Layout", "Navigation", "Hero", "Motion", "Responsive", "Constraints", "QA"],
    assumptions,
  };
}

export function buildFailureMemory(
  outcomes: OutcomeRecord[] = [],
  buildRuns: BuildRunRecord[] = [],
  screenshots: ScreenshotRecord[] = [],
): FailureMemoryReport {
  const map = new Map<FailureCategory, { count: number; prompts: Set<string> }>();
  const push = (category: FailureCategory, prompt: string) => {
    const entry = map.get(category) ?? { count: 0, prompts: new Set<string>() };
    entry.count += 1;
    if (prompt) entry.prompts.add(prompt);
    map.set(category, entry);
  };

  for (const run of buildRuns) {
    for (const category of run.failureCategories.length ? run.failureCategories : classifyBuildFailures(`${run.errors}\n${run.notes}\n${run.status}`)) {
      push(category, run.promptTitle);
    }
  }
  for (const screenshot of screenshots) {
    for (const category of classifyBuildFailures(`${screenshot.title}\n${screenshot.notes}\n${screenshot.rating}`)) {
      push(category, screenshot.title);
    }
  }
  for (const outcome of outcomes) {
    if (outcome.rating === "bad" || outcome.status === "avoid") {
      for (const category of classifyBuildFailures(`${outcome.title}\n${outcome.notes}`)) push(category, outcome.title);
    }
  }

  const categories = Array.from(map.entries())
    .map(([category, entry]) => ({
      category,
      count: entry.count,
      severity: Math.min(100, entry.count * 18 + (category === "runtime-error" || category === "bad-mobile" ? 24 : 10)),
      prompts: Array.from(entry.prompts).slice(0, 5),
      fix: FAILURE_FIXES[category],
    }))
    .sort((a, b) => b.severity - a.severity || b.count - a.count);
  const avoidRules = categories.length
    ? categories.map((item) => `${item.category}: ${item.fix}`)
    : [
        "bad-mobile: always include mobile viewport, wrapping, menu, and text-fit rules.",
        "missing-assets: exact media URLs or named fallbacks are required.",
        "generic-design: every visual adjective needs concrete implementation values.",
      ];

  return {
    categories,
    avoidRules,
    promptPatch: `FAILURE MEMORY PATCH\n${formatBullets(avoidRules)}\n\nBefore finalizing, verify desktop, mobile, media loading, text overlap, CTA visibility, and console/build errors.`,
  };
}

export function buildPromptTournament(
  source: string,
  profile: PromptProfile,
  outcomes: OutcomeRecord[] = [],
  result?: ResultScore,
): PromptTournament {
  const mutations = mutatePromptVariants(source, profile, outcomes);
  const improved = improvePromptWithLearning(source, profile, outcomes, result);
  const variants: PromptMutation[] = [
    {
      id: "current-improved",
      title: "Improve with learned taste",
      intent: "Best all-around candidate that directly applies outcome and failure feedback.",
      prompt: improved,
      score: evaluatePrompt(improved).score,
    },
    ...mutations,
  ].map((variant) => {
    const visual = auditVisualPrompt(variant.prompt).score;
    const evaluation = evaluatePrompt(variant.prompt).score;
    const score = Math.round(evaluation * 0.56 + visual * 0.32 + (result ? Math.min(12, result.score / 10) : 6));
    return { ...variant, score: Math.min(100, score) };
  });
  const finalists = [...variants].sort((a, b) => b.score - a.score).slice(0, 2);
  const recommendation = finalists[0] ?? variants[0];

  return {
    variants,
    finalists,
    recommendation,
    scoringNotes: [
      "Tournament scoring blends prompt evaluator, visual QA, and current result feedback.",
      "Run the top two finalists through the build runner, then mark the better output gold.",
      "Keep the losing finalist as experimental if it adds a useful new signature mechanic.",
    ],
  };
}

export function createBuildQueueJob(
  prompt: PromptExample,
  variant?: Pick<PromptMutation, "title" | "prompt" | "score">,
  resultUrl = "http://127.0.0.1:5173",
): BuildQueueJob {
  const now = new Date().toISOString();
  const sourceText = variant?.prompt ?? prompt.text;
  const title = variant?.title || prompt.title;
  const slug = slugify(title).slice(0, 46) || "prompt";
  const id = `queue-${Date.now()}-${slug}`;
  const runFolder = `prompt-runs/${id}`;
  const promptFile = `${runFolder}/prompt.md`;
  const screenshotDir = `${runFolder}/screenshots`;
  const commands = [
    {
      label: "Export queue file",
      command: "Click Export queue in the Train tab to download prompt-lab-queue.json.",
    },
    {
      label: "Run queued build",
      command: `npm run run:queue -- --queue prompt-lab-queue.json --job ${id}`,
    },
    {
      label: "Capture result",
      command: `npm run capture:result -- --url ${resultUrl} --out ${screenshotDir}`,
    },
    {
      label: "Import result",
      command: `cat ${runFolder}/queue-result.json`,
    },
  ];

  return {
    id,
    promptId: prompt.id,
    promptTitle: prompt.title,
    promptText: sourceText,
    variantTitle: title,
    status: "queued",
    runFolder,
    resultUrl,
    score: variant?.score ?? evaluatePrompt(sourceText).score,
    commands,
    notes: [
      `Prompt file: ${promptFile}`,
      "The queue runner scaffolds a run folder, writes prompt.md, optionally runs PROMPT_LAB_BUILD_COMMAND, captures screenshots, and writes queue-result.json.",
      "Browser execution is local and explicit; paste queue-result.json back into Train to teach the corpus.",
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function exportBuildQueue(jobs: BuildQueueJob[]) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      jobs,
    },
    null,
    2,
  );
}

export function buildPromptLineage(
  prompt: PromptExample | undefined,
  history: { id: string; kind: string; title: string; text: string; score?: number; createdAt: string }[],
  buildRuns: BuildRunRecord[],
  outcomes: OutcomeRecord[],
  screenshots: ScreenshotRecord[],
): PromptLineageNode[] {
  if (!prompt) return [];
  const rootId = `lineage-source-${prompt.id}`;
  const nodes: PromptLineageNode[] = [
    {
      id: rootId,
      parentId: null,
      promptId: prompt.id,
      kind: "source",
      title: prompt.title,
      score: promptDnaAverage(prompt.text),
      status: "source",
      detail: "Original selected prompt.",
      createdAt: prompt.createdAt,
    },
  ];
  const relevantHistory = history
    .filter((version) => version.text.includes(prompt.title) || version.text.includes(prompt.text.slice(0, 120)) || version.title.includes(prompt.title))
    .slice(0, 12);
  for (const version of relevantHistory) {
    nodes.push({
      id: `lineage-version-${version.id}`,
      parentId: rootId,
      promptId: prompt.id,
      kind:
        version.kind === "mutation"
          ? "mutation"
          : version.kind === "improved"
            ? "improved"
            : version.kind === "compiled"
              ? "compiled"
              : version.kind === "tournament"
                ? "tournament"
                : "improved",
      title: version.title,
      score: version.score ?? evaluatePrompt(version.text).score,
      status: version.kind,
      detail: `${countWords(version.text)} words saved to version history.`,
      createdAt: version.createdAt,
    });
  }
  for (const run of buildRuns.filter((item) => item.promptId === prompt.id).slice(0, 8)) {
    nodes.push({
      id: `lineage-run-${run.id}`,
      parentId: rootId,
      promptId: prompt.id,
      kind: "build",
      title: run.promptTitle,
      score: run.score,
      status: run.status,
      detail: run.resultUrl || run.folderPath || "Build run recorded.",
      createdAt: run.createdAt,
    });
  }
  for (const outcome of outcomes.filter((item) => item.promptId === prompt.id).slice(0, 4)) {
    nodes.push({
      id: `lineage-outcome-${outcome.promptId}-${outcome.updatedAt}`,
      parentId: rootId,
      promptId: prompt.id,
      kind: "outcome",
      title: outcome.title,
      score: actualOutcomeScore(outcome),
      status: `${outcome.rating}/${outcome.status}`,
      detail: outcome.notes || "Outcome rating recorded.",
      createdAt: outcome.updatedAt,
    });
  }
  for (const screenshot of screenshots.filter((item) => item.promptId === prompt.id).slice(0, 6)) {
    nodes.push({
      id: `lineage-screenshot-${screenshot.id}`,
      parentId: rootId,
      promptId: prompt.id,
      kind: "screenshot",
      title: screenshot.title,
      score: screenshot.rating === "great" ? 88 : screenshot.rating === "okay" ? 64 : screenshot.rating === "bad" ? 26 : 52,
      status: screenshot.rating,
      detail: screenshot.notes || screenshot.url,
      createdAt: screenshot.createdAt,
    });
  }
  return nodes.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

export function scorePromptModel(
  prompt: PromptExample | undefined,
  resultScore: ResultScore,
  screenshotQa: ScreenshotQaReport,
  calibration: DnaCalibrationReport,
  failureMemory: FailureMemoryReport,
  scoreWeights: Record<string, number> = {},
): ScoreBreakdown {
  const promptQuality = prompt ? evaluatePrompt(prompt.text).score : 0;
  const visualTaste = prompt ? auditVisualPrompt(prompt.text).score : 0;
  const actualResult = resultScore.score;
  const predictedBuild = Math.round(promptQuality * 0.48 + visualTaste * 0.28 + Math.max(0, calibration.correlation) * 0.12 + screenshotQa.score * 0.12);
  const failureRisk = Math.min(100, failureMemory.categories.reduce((sum, item) => sum + item.severity, 0) / Math.max(1, failureMemory.categories.length || 1));
  const singleRank = prompt ? rankPromptExamples([prompt], [])[0] : undefined;
  const components: WeightedScoreComponents = {
    originality: prompt ? singleRank?.originality ?? promptDnaAverage(prompt.text) : 0,
    buildability: predictedBuild,
    visualTaste,
    exactness: promptQuality,
    mobile: screenshotQa.score,
    outcomes: actualResult,
  };
  const defaultWeights: WeightedScoreComponents = {
    originality: 12,
    buildability: 24,
    visualTaste: 18,
    exactness: 18,
    mobile: 10,
    outcomes: 18,
  };
  const weightedEntries = Object.entries(defaultWeights).map(([key, fallback]) => {
    const weight = Number.isFinite(scoreWeights[key]) ? scoreWeights[key] : fallback;
    return [key, Math.max(0, weight)] as const;
  });
  const weightTotal = weightedEntries.reduce((sum, [, weight]) => sum + weight, 0) || 1;
  const weightedScore = weightedEntries.reduce((sum, [key, weight]) => sum + components[key as keyof WeightedScoreComponents] * weight, 0) / weightTotal;
  const finalScore = Math.max(0, Math.min(100, Math.round(weightedScore - failureRisk * 0.05)));

  return {
    promptQuality,
    predictedBuild,
    actualResult,
    visualTaste,
    failureRisk: Math.round(failureRisk),
    finalScore,
    notes: [
      "Prompt quality is the static evaluator score.",
      "Predicted build blends static quality, visual QA, screenshot coverage, and DNA calibration.",
      "Actual result comes from recorded build/screenshot outcomes.",
      `Active weights: ${weightedEntries.map(([key, weight]) => `${key} ${weight}`).join(" / ")}.`,
      failureRisk > 45 ? "Failure risk is elevated; apply the failure-memory patch before running another build." : "Failure risk is under control.",
    ],
  };
}

function hashToken(token: string, dimensions: number) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % dimensions;
}

function vectorizeText(text: string, dimensions = 96) {
  const vector = new Array<number>(dimensions).fill(0);
  const tokens = Array.from(semanticTokens(text));
  for (const token of tokens) {
    const index = hashToken(token, dimensions);
    vector[index] += token.includes("-") || token.includes(" ") ? 1.8 : 1;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
}

function cosineSimilarity(a: number[], b: number[]) {
  let score = 0;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) score += a[index] * b[index];
  return score;
}

export function searchVectorPrompts(query: string, examples: PromptExample[], outcomes: OutcomeRecord[] = []): VectorSearchResult[] {
  const normalized = query.trim();
  if (!normalized) return [];
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const queryVector = vectorizeText(normalized);
  const queryTags = extractPromptTags(normalized);

  return examples
    .filter((example) => countWords(example.text) >= 50)
    .map((example) => {
      const analysis = analyzePrompt(example.text);
      const base = cosineSimilarity(queryVector, vectorizeText(example.text));
      const weighted = Math.min(100, Math.round(base * 100 * outcomeWeight(outcomeMap.get(example.id))));
      const shared = queryTags.filter((tag) => analysis.tags.includes(tag));
      return {
        example,
        score: weighted,
        reasons: [
          shared.length ? `Shared tags: ${shared.slice(0, 4).join(", ")}` : "",
          analysis.archetypes[0] ? `Vector archetype: ${analysis.archetypes[0].label}` : "",
          outcomeMap.get(example.id)?.status === "gold" ? "Gold weighted" : "",
        ].filter(Boolean),
      };
    })
    .filter((result) => result.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

export function buildSkillInstallPlan(codexSkill: string): SkillInstallPlan {
  const exported = codexSkill.trim().length > 100;
  return {
    status: exported ? "installable" : "unknown",
    targetPath: "~/.codex/skills/website-prompt-atelier/SKILL.md",
    commands: [
      "Download website-prompt-atelier-SKILL.md from the Train tab.",
      "npm run install:skill -- --file ./website-prompt-atelier-SKILL.md",
      "ls ~/.codex/skills/website-prompt-atelier/SKILL.md",
    ],
    checklist: [
      "Export the latest skill after marking new gold/avoid outcomes.",
      "Install it locally with the script command.",
      "Start a new Codex task and ask it to use the website-prompt-atelier skill.",
    ],
  };
}

export function exportCorpus(examples: PromptExample[]) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      prompts: examples,
    },
    null,
    2,
  );
}

function splitPromptBatch(raw: string) {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const marked = normalized
    .replace(/\n\s*#{1,3}\s*Files mentioned by the user:[\s\S]*?(?=\n\s*## My request for Codex:|\n\s*here is another|\n\s*Here is another|$)/gi, "\n")
    .replace(/\n\s*## My request for Codex:\s*/gi, "\n");
  const chunks = marked
    .split(/\n\s*(?:-{3,}|={3,}|(?:here\s+i[sz]\s+another(?:\s+one)?[,:\s]*)|(?:Here\s+i[sz]\s+another(?:\s+one)?[,:\s]*))\s*\n?/g)
    .map((chunk) => chunk.trim().replace(/^(?:prompt|build prompt|request):\s*/i, "").trim())
    .filter((chunk) => countWords(chunk) >= 10);
  return chunks.length ? chunks : [normalized];
}

export function parsePromptBatch(raw: string, sourceName = "pasted batch"): PromptImportCandidate[] {
  const text = raw.trim();
  if (!text) return [];
  try {
    return importCorpus(text).map((prompt, index) => {
      const analysis = analyzePrompt(prompt.text);
      return {
        id: prompt.id || `candidate-${Date.now()}-${index}`,
        title: prompt.title,
        text: prompt.text,
        sourceName,
        score: evaluatePrompt(prompt.text).score,
        analysis,
        summary: [
          `${analysis.wordCount} words`,
          analysis.stack.length ? `Stack: ${analysis.stack.slice(0, 4).join(", ")}` : "Stack not explicit",
          analysis.assetCount ? `${analysis.assetCount} asset(s)` : "No exact assets",
          analysis.archetypes[0]?.label ?? "No dominant archetype",
        ],
      };
    });
  } catch {
    return splitPromptBatch(text).map((chunk, index) => {
      const analysis = analyzePrompt(chunk);
      return {
        id: `candidate-${Date.now()}-${index}-${slugify(titleFromPrompt(chunk)).slice(0, 28)}`,
        title: titleFromPrompt(chunk, `Imported prompt ${index + 1}`),
        text: chunk,
        sourceName,
        score: evaluatePrompt(chunk).score,
        analysis,
        summary: [
          `${analysis.wordCount} words`,
          analysis.stack.length ? `Stack: ${analysis.stack.slice(0, 4).join(", ")}` : "Stack not explicit",
          analysis.assetCount ? `${analysis.assetCount} asset(s)` : "No exact assets",
          analysis.archetypes[0]?.label ?? "No dominant archetype",
        ],
      };
    });
  }
}

export function importCorpus(raw: string): PromptExample[] {
  const parsed = JSON.parse(raw) as { prompts?: PromptExample[] } | PromptExample[];
  const prompts = Array.isArray(parsed) ? parsed : parsed.prompts;
  if (!Array.isArray(prompts)) return [];
  return prompts
    .filter((prompt) => prompt?.text && prompt?.title)
    .map((prompt, index) => ({
      id: prompt.id || `imported-${index}-${Date.now()}`,
      title: prompt.title || titleFromPrompt(prompt.text, "Imported prompt"),
      text: prompt.text,
      source: "user" as const,
      createdAt: prompt.createdAt || new Date().toISOString(),
    }));
}
