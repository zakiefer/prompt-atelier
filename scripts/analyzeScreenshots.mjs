import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { inflateSync } from "node:zlib";
import { Buffer } from "node:buffer";

function argValues(name) {
  const values = [];
  for (let index = 0; index < process.argv.length; index += 1) {
    if (process.argv[index] === name && process.argv[index + 1]) values.push(process.argv[index + 1]);
  }
  return values;
}

function readUInt32(buffer, offset) {
  return buffer.readUInt32BE(offset);
}

function parsePng(file) {
  const buffer = readFileSync(file);
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error(`${file} is not a PNG.`);
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  let bitDepth = 0;
  const idat = [];
  while (offset < buffer.length) {
    const length = readUInt32(buffer, offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = readUInt32(data, 0);
      height = readUInt32(data, 4);
      bitDepth = data[8];
      colorType = data[9];
    }
    if (type === "IDAT") idat.push(data);
    if (type === "IEND") break;
    offset += length + 12;
  }
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!channels || bitDepth !== 8) {
    return { width, height, supported: false, samples: [], reason: `Unsupported PNG color type ${colorType} bit depth ${bitDepth}.` };
  }
  const inflated = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const rows = [];
  let inputOffset = 0;
  let previous = new Uint8Array(stride);
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const raw = new Uint8Array(inflated.subarray(inputOffset, inputOffset + stride));
    inputOffset += stride;
    const row = new Uint8Array(stride);
    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = previous[x] || 0;
      const upLeft = x >= channels ? previous[x - channels] || 0 : 0;
      const predictor = filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth(left, up, upLeft) : 0;
      row[x] = (raw[x] + predictor) & 255;
    }
    rows.push(row);
    previous = row;
  }
  const samples = [];
  const stepY = Math.max(1, Math.floor(height / 80));
  const stepX = Math.max(1, Math.floor(width / 80));
  for (let y = 0; y < height; y += stepY) {
    const row = rows[y];
    for (let x = 0; x < width; x += stepX) {
      const index = x * channels;
      samples.push([row[index], row[index + 1], row[index + 2], x, y]);
    }
  }
  return { width, height, supported: true, samples };
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function analyzeFile(file) {
  const path = resolve(file);
  if (!existsSync(path)) return { path, ok: false, error: "File not found." };
  const stat = statSync(path);
  const parsed = parsePng(path);
  if (!parsed.supported) return { path, ok: false, size: stat.size, width: parsed.width, height: parsed.height, error: parsed.reason };
  const brightness = parsed.samples.map(([r, g, b]) => (r + g + b) / 3);
  const average = brightness.reduce((sum, value) => sum + value, 0) / brightness.length;
  const variance = brightness.reduce((sum, value) => sum + (value - average) ** 2, 0) / brightness.length;
  const unique = new Set(parsed.samples.map(([r, g, b]) => `${Math.round(r / 8)}-${Math.round(g / 8)}-${Math.round(b / 8)}`)).size;
  const quadrants = [new Set(), new Set(), new Set(), new Set()];
  let edgeHits = 0;
  let edgeComparisons = 0;
  let brightSamples = 0;
  let darkSamples = 0;
  let previousBrightness = null;
  let previousY = null;
  for (const [r, g, b, x, y] of parsed.samples) {
    const value = (r + g + b) / 3;
    const quadrant = (y > parsed.height / 2 ? 2 : 0) + (x > parsed.width / 2 ? 1 : 0);
    quadrants[quadrant].add(`${Math.round(r / 12)}-${Math.round(g / 12)}-${Math.round(b / 12)}`);
    if (value > 246) brightSamples += 1;
    if (value < 10) darkSamples += 1;
    if (previousBrightness !== null && previousY === y) {
      edgeComparisons += 1;
      if (Math.abs(value - previousBrightness) > 32) edgeHits += 1;
    }
    previousBrightness = value;
    previousY = y;
  }
  const edgeActivity = edgeComparisons ? edgeHits / edgeComparisons : 0;
  const brightRatio = brightSamples / parsed.samples.length;
  const darkRatio = darkSamples / parsed.samples.length;
  const quietQuadrants = quadrants.filter((bucket) => bucket.size < 14).length;
  const blankRisk = unique < 18 || variance < 35 || stat.size < 12000;
  const lowContrastRisk = variance < 120;
  const darkRisk = average < 18;
  const brightRisk = average > 244;
  const whitespaceRisk = brightRatio > 0.86 && edgeActivity < 0.055;
  const quietRegionRisk = quietQuadrants >= 2 && unique < 42;
  const possibleTinyTextRisk = edgeActivity > 0.42 && variance < 900;
  const possibleBrokenMediaRisk = darkRatio > 0.46 && unique < 32;
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        92 -
          (blankRisk ? 42 : 0) -
          (lowContrastRisk ? 18 : 0) -
          (darkRisk || brightRisk ? 10 : 0) -
          (whitespaceRisk ? 12 : 0) -
          (quietRegionRisk ? 10 : 0) -
          (possibleTinyTextRisk ? 8 : 0) -
          (possibleBrokenMediaRisk ? 16 : 0),
      ),
    ),
  );
  return {
    path,
    file: basename(path),
    ok: true,
    size: stat.size,
    width: parsed.width,
    height: parsed.height,
    averageBrightness: Math.round(average),
    variance: Math.round(variance),
    uniqueColorBuckets: unique,
    edgeActivity: Number(edgeActivity.toFixed(3)),
    brightRatio: Number(brightRatio.toFixed(3)),
    darkRatio: Number(darkRatio.toFixed(3)),
    quietQuadrants,
    score,
    risks: [
      blankRisk ? "blank-or-low-detail" : "",
      lowContrastRisk ? "low-contrast" : "",
      darkRisk ? "very-dark" : "",
      brightRisk ? "very-bright" : "",
      whitespaceRisk ? "oversized-whitespace" : "",
      quietRegionRisk ? "quiet-regions" : "",
      possibleTinyTextRisk ? "possible-tiny-text-or-noise" : "",
      possibleBrokenMediaRisk ? "possible-broken-dark-media" : "",
    ].filter(Boolean),
    layoutHints: [
      edgeActivity < 0.04 ? "Low edge activity; verify that meaningful UI rendered." : "",
      brightRatio > 0.82 ? "Large bright area; check for excessive empty space." : "",
      quietQuadrants ? `${quietQuadrants} quiet quadrant(s); inspect for blank zones or missing content.` : "",
      possibleTinyTextRisk ? "High micro-edge density; inspect tiny text and overlap manually." : "",
    ].filter(Boolean),
  };
}

const files = [...argValues("--file"), ...argValues("--desktop"), ...argValues("--mobile")];
if (!files.length) {
  console.error("Usage: node scripts/analyzeScreenshots.mjs --file screenshot.png [--file mobile.png]");
  process.exit(1);
}

const results = files.map(analyzeFile);
const score = Math.round(results.reduce((sum, item) => sum + (item.score || 0), 0) / results.length);
console.log(JSON.stringify({ ok: results.every((item) => item.ok), score, results, createdAt: new Date().toISOString() }, null, 2));
