#!/usr/bin/env node
// hub-silent-detect.mjs — 900s silent-detection job (TriMLC 8713 cron spawn face)
// Batch: 09-30 evening silent-detection enablement (CTO 02:36 dispatch; FSD construction)
// Verdict basis: cto-bod-three-items-rm-verdict-20260929.md §三 (architecture) §八 (ledger schema)
//
// Consumption: docs/workflow/hub-state/in-progress.json (non-closed entries)
// Tiers:
//   all-silent ≤ 15min                     → healthy, clear state
//   all-silent > 15min                     → reminder-level nudge to the owner seat
//   all-silent > 30min AND no waiting reason → idle-escalate to COS (mailbox dual-hop)
//   duty seat (m-cos) transcript silent > 30min → duty-escalate direct to BOD (second hop)
// waiting reason = entry.status === 'waiting-window' (structured; note-text heuristics avoided)
//
// 三钉 contract (hard):
//   ① anchor-check failure speaks  — ledger missing / git plumbing failure → error notify, never silent skip
//   ② send-failure not marked notified — cooldown state written ONLY after sendNotify resolves
//   ③ parse-failure never crashes job — per-entry try/catch, process exits 0 always
//
// Grayscale week 1: 900s cadence, FSD reads execution_log daily first-round readings.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendNotify } from "./lib/notify-sender.mjs";
import { collectNodeSignals } from "./lib/tree-signals.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const LOG_DIR = path.join(REPO_ROOT, ".fade", "probe-logs");
const LOG_FILE = path.join(LOG_DIR, "hub-silent-detect.log");
const STATE_FILE = path.join(REPO_ROOT, ".fade", "tmp", "hub-silent-detect-state.json");
const LEDGER_FILE = path.join(REPO_ROOT, "docs", "workflow", "hub-state", "in-progress.json");

// thresholds (minutes) — verdict §三 tiers
const REMIND_MIN = 15;
const ESCALATE_MIN = 30;
const COOLDOWN_MIN = 30;

const DUTY_SEAT = "COS"; // 中枢值守 — duty second-hop target maps to m-cos transcript

function nowIso() {
  return new Date().toISOString();
}

function appendLog(line) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(LOG_FILE, `${nowIso()} ${line}\n`, "utf-8");
  } catch { /* 三钉③: logging must never crash the job */ }
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeState(state) {
  try {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    const tmp = `${STATE_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2), "utf-8");
    fs.renameSync(tmp, STATE_FILE); // atomic tmp+rename (precedent: watchlist-patrol)
  } catch (err) {
    appendLog(`ERROR writeState failed: ${err.message} (cooldown may repeat — acceptable)`);
  }
}

function readLedger() {
  // 锚①: ledger missing/unreadable = structural anchor failure → throw to main handler
  const raw = fs.readFileSync(LEDGER_FILE, "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("in-progress.json is not an array");
  return parsed;
}

async function notifyOrThrow({ targets, title, body, urgent }) {
  // 三钉②: this either resolves (state may be written) or throws (state untouched)
  // source_seat=m-duty-cos (duty system channel; CTO-ratified A-case) — the lib
  // guardrail enforces real-name attribution for mechanism-seat sends (fail-closed).
  return sendNotify({
    targets,
    title,
    body,
    urgent,
    attribution: "hub-silent-detect 900s job by FSD (m-fsd)",
    sourceSeat: "m-duty-cos",
    targetDaemon: "trimlc",
  });
}

async function main() {
  appendLog(`--- round start (pid ${process.pid}) ---`);
  const state = readState();
  const now = Date.now();
  const alerts = [];
  const healthy = [];
  const skipped = [];

  let entries;
  try {
    entries = readLedger();
  } catch (err) {
    // 锚①: speaks — but 三钉②: notification failure itself must not crash either
    appendLog(`ERROR ledger anchor failure: ${err.message}`);
    try {
      await notifyOrThrow({
        targets: ["m-cos"],
        title: "[silent-detect] 锚核查失败：in-progress.json 不可读",
        body: `hub-silent-detect 无法读取在办账（${err.message}）。本轮探测未执行，请核查 hub-state 文件状态。三钉①锚失败出声通知。`,
        urgent: "urgent",
      });
      appendLog("anchor-failure notify sent");
    } catch (e2) {
      appendLog(`ERROR anchor notify also failed: ${e2.message}`);
    }
    return; // exit 0 — 三钉③
  }

  const open = entries.filter((e) => e && e.status !== "closed");
  if (open.length === 0) {
    appendLog("ledger empty (all closed) — safe degrade, zero alerts"); // 空账=安全降级
    return;
  }

  for (const entry of open) {
    try {
      const id = String(entry.id || "(no-id)");
      const signals = collectNodeSignals({
        repoRoot: REPO_ROOT,
        treePath: entry.treePath,
        owner: entry.owner,
      });

      if (signals.seats.length === 0) {
        // owner 解析不出席位 → conservative skip (data-shape issue, log-only, no false alarm)
        skipped.push(`${id}: owner unresolvable ("${String(entry.owner).slice(0, 60)}")`);
        continue;
      }

      const silentMin =
        signals.newestMs === null ? Infinity : Math.floor((now - signals.newestMs) / 60000);

      if (silentMin <= REMIND_MIN) {
        healthy.push(`${id}: ${signals.seats.join("/")} silent ${silentMin}m (≤${REMIND_MIN})`);
        // clear prior alert state for this node — it recovered
        for (const k of Object.keys(state)) {
          if (k === id || k.startsWith(`${id}|`)) delete state[k];
        }
        continue;
      }

      const waitingReason = entry.status === "waiting-window";
      const level =
        silentMin > ESCALATE_MIN && !waitingReason ? "idle-escalate" : "reminder";

      const stateKey = `${id}|${level}`;
      const last = state[stateKey];
      if (last && now - last < COOLDOWN_MIN * 60000) {
        skipped.push(`${id}: ${level} in cooldown (last ${new Date(last).toISOString()})`);
        continue;
      }

      alerts.push({
        id,
        level,
        silentMin,
        seats: signals.seats,
        status: entry.status,
        perSource: signals.perSource,
        stateKey,
      });
    } catch (err) {
      // 锚①: per-entry anchor failure (e.g. git plumbing) speaks — as an alert row
      alerts.push({
        id: String(entry?.id || "(no-id)"),
        level: "anchor-error",
        error: err.message,
        stateKey: `${String(entry?.id || "no-id")}|anchor-error`,
      });
    }
  }

  // duty-seat second hop: duty seat transcript silent > ESCALATE_MIN → direct BOD
  try {
    const dutyMs = collectNodeSignals({
      repoRoot: REPO_ROOT,
      treePath: "",
      owner: DUTY_SEAT,
    }).perSource.transcript;
    const dutySilentMin = dutyMs === null ? Infinity : Math.floor((now - dutyMs) / 60000);
    const dutyKey = "duty-cos-silent";
    if (dutySilentMin > ESCALATE_MIN) {
      const last = state[dutyKey];
      if (!(last && now - last < COOLDOWN_MIN * 60000)) {
        alerts.push({
          id: dutyKey,
          level: "duty-escalate",
          silentMin: dutySilentMin,
          seats: ["m-cos"],
          perSource: { transcript: dutyMs },
          stateKey: dutyKey,
        });
      } else {
        skipped.push("duty-cos: escalate in cooldown");
      }
    } else {
      delete state[dutyKey];
      healthy.push(`duty-cos silent ${dutySilentMin}m (ok)`);
    }
  } catch (err) {
    appendLog(`ERROR duty-hop check failed: ${err.message}`); // 三钉③ degrade
  }

  // dispatch alerts
  const failCount = { n: 0 };
  for (const a of alerts) {
    let targets;
    let title;
    let urgent = "normal";
    if (a.level === "duty-escalate") {
      targets = ["bod"];
      title = `[silent-detect] 值席静默直报：中枢 m-cos 已静默 ${a.silentMin}min`;
      urgent = "urgent";
    } else if (a.level === "idle-escalate") {
      targets = ["m-cos"];
      title = `[silent-detect] idle 升级：${a.id}（${a.seats.join("/")}）静默 ${a.silentMin}min 无候办理由`;
    } else if (a.level === "anchor-error") {
      targets = ["m-cos"];
      title = `[silent-detect] 锚核查失败：${a.id}`;
      urgent = "urgent";
    } else {
      // reminder → owner seat itself (nudge)
      const aliasToOps = { FSD: "m-fsd", COS: "m-cos", CAO: "m-cao", CFO: "m-cfo", CHO: "m-cho", CMO: "m-cmo", COO: "m-coo", CPO: "m-cpo", CSO: "m-cso", CTO: "m-cto", RDT: "m-rdt", STE: "m-ste", SDE: "m-sde" };
      targets = a.seats.map((k) => aliasToOps[k] || k);
      title = `[silent-detect] 提醒：${a.id} 已静默 ${a.silentMin}min（阈值 ${REMIND_MIN}min）`;
    }

    const src = a.perSource
      ? Object.entries(a.perSource)
          .map(([k, v]) => `${k}=${v ? new Date(v).toISOString() : "n/a"}`)
          .join(" ")
      : a.error || "";
    const body =
      `条目=${a.id} 状态=${a.status || "-"} 级别=${a.level} 静默=${a.silentMin === Infinity ? "∞(无信号)" : a.silentMin + "min"}\n` +
      `信号源: ${src}\n` +
      `来源=hub-silent-detect 900s job（灰度第 1 周；三源 OR 豁免；冷却 ${COOLDOWN_MIN}min/节点/级）`;

    try {
      await notifyOrThrow({ targets, title, body, urgent });
      state[a.stateKey] = now; // 三钉②: only on success
      appendLog(`NOTIFIED ${a.level} ${a.id} -> [${targets.join(",")}]`);
    } catch (err) {
      failCount.n += 1;
      appendLog(`ERROR notify failed (${a.level} ${a.id}): ${err.message} — state NOT written (三钉②)`);
    }
  }

  writeState(state);
  appendLog(
    `round summary: open=${open.length} healthy=${healthy.length} alerts=${alerts.length} ` +
      `sendFails=${failCount.n} skipped=${skipped.length}` +
      (skipped.length ? ` | ${skipped.join(" ; ")}` : ""),
  );
  for (const h of healthy) appendLog(`  ok: ${h}`);
  // always exit 0 — 三钉③ (cron spawn face must not flag errors / trigger retry storms)
}

main().catch((err) => {
  appendLog(`FATAL-CAUGHT ${err.message} (exit 0 per 三钉③)`);
}).finally(() => {
  process.exit(0);
});
