#!/usr/bin/env node
// window-dispatch-remind.mjs — job ② minimal delivery (window-B batch 2026-10-11)
// Schedule: 09:00 / 18:00 +08 daily via TriMLC 8713 cron; COO ops-domain may
// retune via API PATCH without restart (not allowlist-locked beyond first POST).
// Transition shape, minimal investment per CTO gate verdict: reminder text to
// stdout (captured in cron execution_log) + one appended log line as the
// execution-chain evidence face. No alerting, no scanning logic in phase 1.
import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ts = new Date().toISOString();
const line = `[window-dispatch-remind] ${ts} reminder: check current window task charters & dispatch state (daily slots 09:00/18:00 +08)`;
console.log(line);
const logDir = path.join(process.env.LOCALAPPDATA ?? '.', 'trilc-channel');
try {
  mkdirSync(logDir, { recursive: true });
  appendFileSync(path.join(logDir, 'window-dispatch-remind.log'), line + '\n');
} catch (e) {
  console.error(`[window-dispatch-remind] log append failed: ${e?.message}`);
}
