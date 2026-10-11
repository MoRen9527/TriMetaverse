#!/usr/bin/env node
// glm-quota-obs.mjs — DEM-004 GLM Coding Plan quota observation row (schema v1)
// Job ① of window-B batch 2026-10-11. Schedule: daily 09:30 +08 via TriMLC 8713 cron.
//
// Endpoint verdict (FSD live test 2026-10-11, window-B prep segment, between
// date-check 00:02:42Z and dry-run row ts 00:10:17Z; CTO acceptance anchor
// "measured 200 + usage fields", NOT transcribed from BOD research卷):
//   GET https://open.bigmodel.cn/api/monitor/usage/quota/limit
//   Authorization: <key raw, no Bearer prefix>
//   -> { success, data: { level, limits: [ { type, unit, number, percentage,
//        nextResetTime(ms), detail } ] } }
//   unit:6/number:1 = 7-day window; unit:3/number:5 = 5-hour window;
//   TIME_LIMIT rows = Z.ai tool quotas, unrelated to plan tokens (skipped).
//
// Key: env GLM_CODING_KEY only (User scope). Never hardcoded, never in git,
// never echoed. Account field = "tail:<last8>" per CPO schema mask rule.
//
// Schema v1: CPO cpo-dem004-schema-v1-20261010.md @5ceb13e9 — five mandatory
// elements (plane/service_domain/account/model/metric_basis), ts machine-written,
// thresholds_snapshot snapshot-of-the-moment, pair_ref handover linkage.
//
// Degraded rules (CTO increment gate 1 — no silent fallback):
//   - thresholds file missing  => row still written, thresholds_snapshot =
//     {"status":"thresholds=missing"}, line_status = "unknown" (explicit).
//   - env key missing / endpoint fail / business error => stderr + exit, NO row.
//
// Phase-1 extra keys (fiveh_pct/fiveh_reset/weekly_reset/plan_level/fiveh_watch):
// same-line shape as CFO input sample; beyond CPO schema v1 field table —
// flagged for CPO v2 adoption or trim (see FSD window-B report tech-debt).
import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(HERE, 'glm-quota-obs.config.json');
const THRESHOLDS_PATH = path.join(HERE, 'glm-quota-obs.thresholds.json');

function expandPath(p) {
  return p.replace(/%([^%]+)%/g, (_, name) => process.env[name] ?? `%${name}%`);
}

function loadJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

// --- config (fail loud: config missing is a setup bug, no row) ---
const config = loadJson(CONFIG_PATH);

// --- key gate: missing key = no row, explicit ---
const key = process.env[config.keyEnvName] ?? '';
if (!key) {
  console.error(`[glm-quota-obs] FATAL env ${config.keyEnvName} missing - no row written`);
  process.exit(2);
}

// --- fetch quota (endpoint fail / business error = no row, explicit) ---
let res;
try {
  res = await fetch(config.endpoint, { headers: { Authorization: key } });
} catch (e) {
  console.error(`[glm-quota-obs] FATAL endpoint fetch failed: ${e?.message} - no row written`);
  process.exit(3);
}
if (!res.ok) {
  console.error(`[glm-quota-obs] FATAL endpoint HTTP ${res.status} - no row written`);
  process.exit(3);
}
const body = await res.json();
if (body?.success === false) {
  console.error(`[glm-quota-obs] FATAL endpoint business error code=${body.code} msg=${body.msg} - no row written`);
  process.exit(4);
}
const limits = Array.isArray(body?.data?.limits) ? body.data.limits : [];
const pick = (spec) =>
  limits.find((l) => l.type === 'TOKENS_LIMIT' && l.unit === spec.unit && l.number === spec.number);
const weekly = pick(config.weekly);
const fiveh = pick(config.fiveh);
if (!weekly || typeof weekly.percentage !== 'number') {
  console.error('[glm-quota-obs] FATAL weekly TOKENS_LIMIT row missing/no percentage - no row written');
  process.exit(5);
}

// --- thresholds (CTO gate 1: explicit missing, never silent) ---
let thresholds = null;
let thresholdsMissing = false;
try {
  if (existsSync(THRESHOLDS_PATH)) thresholds = loadJson(THRESHOLDS_PATH);
  else thresholdsMissing = true;
} catch {
  thresholdsMissing = true;
}

// --- prior row diff (same-anchor daily delta + reset detection) ---
const outFile = expandPath(config.outputFile);
mkdirSync(path.dirname(outFile), { recursive: true });
let prev = null;
if (existsSync(outFile)) {
  const lines = readFileSync(outFile, 'utf8').split('\n').filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const r = JSON.parse(lines[i]);
      if (r.usage_window === 'weekly' && typeof r.quota_used === 'number') { prev = r; break; }
    } catch { /* skip corrupt tail line */ }
  }
}
const now = new Date();
const SAME_ANCHOR_TOL_MS = 2 * 3600 * 1000; // ±2h around 24h earlier
const isSameAnchor = prev && prev.ts && (now - new Date(prev.ts) - 24 * 3600 * 1000) <= SAME_ANCHOR_TOL_MS
  && (now - new Date(prev.ts) - 24 * 3600 * 1000) >= -SAME_ANCHOR_TOL_MS;

// --- line status (explicit unknown / no-prior-anchor, never silent normal) ---
const lineStatus = { observe: 'unknown', warn: 'unknown', pause: 'unknown' };
let breach = false;
let dailyDelta = null;
if (!thresholdsMissing && thresholds) {
  lineStatus.observe = weekly.percentage >= thresholds.observe_weekly ? 'breach' : 'normal';
  if (isSameAnchor) {
    dailyDelta = weekly.percentage - prev.quota_used;
    lineStatus.warn = dailyDelta >= thresholds.warn_pace_daily ? 'breach' : 'normal';
    lineStatus.pause = dailyDelta >= thresholds.pause ? 'breach' : 'normal';
  } else {
    lineStatus.warn = 'no-prior-anchor';
    lineStatus.pause = 'no-prior-anchor';
  }
  breach = [lineStatus.observe, lineStatus.warn, lineStatus.pause].includes('breach');
}

// --- reset detection: prior pct higher than current => weekly window rolled ---
let resetFlag = false;
let pairRef = null;
if (prev && typeof prev.quota_used === 'number' && prev.quota_used > weekly.percentage) {
  resetFlag = true;
  pairRef = prev.row_id ?? null;
}

// --- row (schema v1 field order per CPO卷) ---
const pad = (n) => String(n).padStart(2, '0');
const localDate = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
const localHM = `${pad(now.getHours())}${pad(now.getMinutes())}`;
const row = {
  row_id: `obs-${localDate}-${localHM}-01`,
  schema_ver: 1,
  ts: now.toISOString(),
  source: 'bigmodel-usage-api/monitor-quota-limit',
  plane: config.plane,
  service_domain: config.service_domain,
  account: `tail:${key.slice(-8)}`,
  model: config.model,
  metric_basis: 'provider',
  quota_used: weekly.percentage,
  quota_total: 100,
  usage_window: 'weekly',
  thresholds_snapshot: thresholdsMissing
    ? { status: 'thresholds=missing' }
    : {
        observe_weekly: thresholds.observe_weekly,
        warn_pace_daily: thresholds.warn_pace_daily,
        pause: thresholds.pause,
        watch_5h: thresholds.watch_5h,
        slowdown: thresholds.slowdown,
        asof: thresholds.asof,
      },
  line_status: lineStatus,
  breach,
  reset_flag: resetFlag,
  pair_ref: pairRef,
  // phase-1 extra keys (CFO input line shape; flagged for CPO v2, see header)
  fiveh_pct: fiveh && typeof fiveh.percentage === 'number' ? fiveh.percentage : null,
  fiveh_reset: fiveh?.nextResetTime ? new Date(fiveh.nextResetTime).toISOString() : null,
  weekly_reset: weekly.nextResetTime ? new Date(weekly.nextResetTime).toISOString() : null,
  plan_level: body?.data?.level ?? null,
};
if (!thresholdsMissing && thresholds && fiveh && typeof fiveh.percentage === 'number') {
  row.fiveh_watch =
    fiveh.percentage >= thresholds.slowdown ? 'slowdown'
    : fiveh.percentage >= thresholds.watch_5h ? 'watch' : 'normal';
}

appendFileSync(outFile, JSON.stringify(row) + '\n');
const dl = dailyDelta === null ? 'n/a' : `${dailyDelta >= 0 ? '+' : ''}${dailyDelta}`;
console.log(`[glm-quota-obs] row=${row.row_id} weekly=${weekly.percentage}% fiveh=${row.fiveh_pct ?? 'n/a'}% dailyDelta=${dl} breach=${breach} reset=${resetFlag} thresholds=${thresholdsMissing ? 'missing' : 'loaded'}`);
