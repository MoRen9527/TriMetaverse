// cron-allowlist.mjs — unified management for the TriMLC 8713 cron command allowlist.
// Single source of truth for the three strings added in the 09-30 evening batch
// (silent-detection enablement; verdict cto-bod-three-items-rm-verdict-20260929.md §三).
// The allowlist itself lives in %LOCALAPPDATA%\trimlc-daemon-channel.cmd as
// TRILC_CRON_COMMAND_ALLOWLIST=<comma-separated exact-match full strings>.
// This module only PARSES/VALIDATES/MERGES — it never writes the channel cmd.

// The three new-path strings (scripts/fade 真身化; COS-supplied byte-exact ×2 + mine):
export const NEW_ALLOWLIST_STRINGS = [
  "node D:/Code/ai/TriMetaverse/scripts/fade/tree-node-patrol.mjs",
  "node D:/Code/ai/TriMetaverse/scripts/fade/ledger-watchlist-patrol.mjs",
  "node D:/Code/ai/TriMetaverse/scripts/fade/hub-silent-detect.mjs",
];

// Legacy .fade shells — retained until COS retires the old jobs, then removed
// (debt marker: do NOT delete before job PATCH migration is confirmed done).
export const LEGACY_STRINGS = [
  "node D:/Code/ai/TriMetaverse/.fade/plane-shift-local-align.mjs",
  "node D:/Code/ai/TriMetaverse/.fade/tree-node-patrol.mjs",
  "node D:/Code/ai/TriMetaverse/.fade/ledger-watchlist-patrol.mjs",
  "powershell -NoProfile -ExecutionPolicy Bypass -File D:/Code/ai/TriMetaverse/.fade/trimodel-l2-stub.ps1",
  "wscript.exe D:\\Code\\ai\\TriMetaverse\\.fade\\trimodel-l3-toast.vbs",
];

export function parseAllowlist(lineValue) {
  return String(lineValue)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Validate that every NEW string is present in a (parsed) allowlist.
 * Returns { ok, missing[], present[] }.
 */
export function validateNewStrings(entries) {
  const set = new Set(entries);
  const missing = [];
  const present = [];
  for (const s of NEW_ALLOWLIST_STRINGS) {
    (set.has(s) ? present : missing).push(s);
  }
  return { ok: missing.length === 0, missing, present };
}

/**
 * Idempotently merge NEW strings into an existing raw allowlist line value.
 * Returns the merged line value (original order preserved, new entries appended).
 */
export function mergeNewStrings(rawLineValue) {
  const entries = parseAllowlist(rawLineValue);
  const set = new Set(entries);
  for (const s of NEW_ALLOWLIST_STRINGS) {
    if (!set.has(s)) entries.push(s);
  }
  return entries.join(",");
}

// CLI face: node cron-allowlist.mjs --check "<line>" | --merge "<line>"
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` ||
    process.argv[1]?.endsWith("cron-allowlist.mjs")) {
  const mode = process.argv[2];
  const line = process.argv[3] ?? "";
  if (mode === "--check") {
    const r = validateNewStrings(parseAllowlist(line));
    console.log(JSON.stringify(r, null, 2));
    process.exitCode = r.ok ? 0 : 1;
  } else if (mode === "--merge") {
    console.log(mergeNewStrings(line));
  } else {
    console.error("usage: node cron-allowlist.mjs --check \"<line>\" | --merge \"<line>\"");
    process.exitCode = 2;
  }
}
