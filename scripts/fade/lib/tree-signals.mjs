// tree-signals.mjs — three-source liveness signal reader for in-progress entries
// (silent-detection batch, verdict cto-bod-three-items-rm-verdict-20260929.md §三/§八).
//
// Sources (OR-exemption: any one fresh signal = seat not idle on that entry):
//   ① node-status.jsonl tail ts   — derived from entry.treePath's tree directory
//   ② tree git log tail commit ts — git -C <repo> log -1 --format=%cI -- <treeDir>
//   ③ seat transcript mtime       — ~/.claude/projects/<proj>/*.jsonl whose first
//     line customTitle matches the seat's opsName (freshest file wins)
//
// 三钉 contract:
//   ① anchor-check failures throw (caller notifies — 锚核查失败出声)
//   ③ parse failures never crash the job (collectNodeSignals degrades per-source,
//      returns { signals: {source: iso|null}, errors[] } — caller decides)

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

// opsName alias families — seat short-name → transcript customTitle candidates.
// SDE drift observed 2026-09-30: seats.json says m-dee, live transcript uses m-sde;
// both accepted (observation item, do not silently "fix" either side).
export const SEAT_ALIASES = {
  FSD: ["m-fsd"],
  COS: ["m-cos"],
  CAO: ["m-cao"],
  CFO: ["m-cfo"],
  CHO: ["m-cho"],
  CMO: ["m-cmo"],
  COO: ["m-coo"],
  CPO: ["m-cpo"],
  CSO: ["m-cso"],
  CTO: ["m-cto"],
  RDT: ["m-rdt"],
  STE: ["m-ste"],
  SDE: ["m-sde", "m-dee"],
};

const DEFAULT_PROJECT_DIR = path.join(
  process.env.USERPROFILE || "C:\\Users\\jedih",
  ".claude", "projects", "D--Code-ai-TriMetaverse",
);

/**
 * Extract seat alias keys from a free-form owner string.
 * 'SDE（施工，今天内窗）/COS（tracking+护栏复启用）' → ['SDE','COS']
 * Returns [] when nothing matches (caller: conservative skip, no false alarm).
 */
export function extractSeatKeys(ownerStr) {
  const s = String(ownerStr || "");
  const out = [];
  for (const key of Object.keys(SEAT_ALIASES)) {
    // word-ish boundary: seat short name must not be a substring of a longer token
    const re = new RegExp(`(^|[^A-Za-z])${key}([^A-Za-z]|$)`);
    if (re.test(s)) out.push(key);
  }
  return out;
}

/** Parse node-status ts variants: '2026-09-29T10:30+08:00' | '2026-09-30T14:20' | ISO. */
export function parseFlexibleTs(v) {
  if (!v) return null;
  const s = String(v).trim();
  let m = s.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/); // no tz → local (+08:00 M-plane)
  if (m) return new Date(`${m[1]}T${m[2]}:00+08:00`).getTime() || null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : null;
}

/** Source ①: tail node-status.jsonl ts for the tree dir implied by treePath. */
export function readNodeStatusTs(repoRoot, treePath) {
  if (!treePath) return null;
  // treePath variants: real path into trees/<name>/... , or prose ('（F-3 缺陷单候 FSD 批立树）').
  const m = String(treePath).match(
    /(docs\/workflow\/operating-records\/\d{4}-W\d+\/trees\/[^/（\\]+)/,
  );
  if (!m) return null; // prose pointer → no tree dir → source N/A (not an error)
  const treeDir = path.join(repoRoot, ...m[1].split("/"));
  const jsonl = path.join(treeDir, "node-status.jsonl");
  if (!fs.existsSync(jsonl)) return null;
  const raw = fs.readFileSync(jsonl, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return null;
  let tail = null;
  try {
    tail = JSON.parse(lines[lines.length - 1]);
  } catch {
    // 三钉③: malformed tail line — degrade, don't crash
    return null;
  }
  return parseFlexibleTs(tail?.ts);
}

/** Source ②: git log tail commit ts for the tree dir. Throws on git failure (锚①). */
export function readTreeGitTs(repoRoot, treePath) {
  const m = String(treePath || "").match(
    /(docs\/workflow\/operating-records\/\d{4}-W\d+\/trees\/[^/（\\]+)/,
  );
  if (!m) return null;
  const rel = m[1];
  try {
    const out = execFileSync(
      "git",
      ["-C", repoRoot, "log", "-1", "--format=%cI", "--", rel],
      { encoding: "utf-8", timeout: 15000 },
    ).trim();
    if (!out) return null;
    const t = Date.parse(out);
    return Number.isFinite(t) ? t : null;
  } catch (err) {
    // 锚核查失败出声: git plumbing failure is environmental — caller notifies.
    throw new Error(`tree-signals: git log failed for ${rel}: ${err.message}`);
  }
}

/** Source ③: freshest transcript mtime among alias names for one seat key. */
export function readTranscriptMtime(seatKey, projectDir = DEFAULT_PROJECT_DIR) {
  const aliases = SEAT_ALIASES[seatKey] || [];
  let best = null;
  let files = [];
  try {
    files = fs.readdirSync(projectDir).filter((f) => f.endsWith(".jsonl"));
  } catch {
    return null; // project dir missing → degrade (not a crash)
  }
  for (const f of files) {
    const full = path.join(projectDir, f);
    try {
      const first = fs.readFileSync(full, "utf8").split("\n", 1)[0];
      const obj = JSON.parse(first);
      const title = obj?.customTitle;
      if (!title || !aliases.includes(title)) continue;
      const mt = fs.statSync(full).mtimeMs;
      if (best === null || mt > best) best = mt;
    } catch {
      continue; // 三钉③: unreadable/foreign line — skip this file
    }
  }
  return best;
}

/**
 * Collect all three sources for one entry. Never throws for per-source degradation
 * except git plumbing failures (锚① propagates).
 * Returns { newestMs, perSource: {nodeStatus, treeGit, transcript}, seats: [alias] }.
 */
export function collectNodeSignals({ repoRoot, treePath, owner, projectDir }) {
  const seatKeys = extractSeatKeys(owner);
  const perSource = { nodeStatus: null, treeGit: null, transcript: null };

  perSource.nodeStatus = readNodeStatusTs(repoRoot, treePath);
  perSource.treeGit = readTreeGitTs(repoRoot, treePath);

  let newest = perSource.nodeStatus ?? null;
  if (perSource.treeGit && (newest === null || perSource.treeGit > newest)) {
    newest = perSource.treeGit;
  }
  for (const k of seatKeys) {
    const t = readTranscriptMtime(k, projectDir);
    if (t && (perSource.transcript === null || t > perSource.transcript)) {
      perSource.transcript = t;
    }
    if (t && (newest === null || t > newest)) newest = t;
  }

  return { newestMs: newest, perSource, seats: seatKeys };
}
