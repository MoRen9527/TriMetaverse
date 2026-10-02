#!/usr/bin/env node
// joint-review-remind.mjs — 公司需求池周六联审定时提醒（TriMLC 8713 cron spawn face）
// Batch: bod-pipeline-batch-16 件②（CEO 令 2026-10-02 20:35/20:39；COO 建制 10-02 晚）
// 令面: 每周六 12:00 触发三席（CPO/COO/CTO）联审提醒——读需求大表→联审→下周清单裁定
// 表正身: docs/workflow/operating-records/<当周>/company-demand-pool.md（跨周资产，随 weekly-plane-shift 平移不重建）
//
// 三钉 contract（照 hub-silent-detect.mjs 先例，hard）:
//   ① anchor-check failure speaks — 需求池文件定位失败 → error notify，never silent skip
//   ② send-failure not marked notified — state 只在 sendNotify resolve 后写入
//   ③ parse-failure never crashes job — process exits 0 always
//
// 提醒通道现形（如实）: targets=['bod'] = watchlist 唯一实证先例（TriMMC 名册目标形态）；
// 三席信箱直寻址未实证（seats.json 全员 bod-addressable:false）——toast/信箱=兜底网，
// pipe 主道=COO 在席转告（batch-16 件②读数已向 BOD/CPO 如实申报）。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendNotify } from "./lib/notify-sender.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const LOG_DIR = path.join(REPO_ROOT, ".fade", "probe-logs");
const LOG_FILE = path.join(LOG_DIR, "joint-review-remind.log");
const STATE_FILE = path.join(REPO_ROOT, ".fade", "tmp", "joint-review-remind-state.json");
const PLANE_ROOT = path.join(REPO_ROOT, "docs", "workflow", "operating-records");

const TARGETS = ["bod"]; // TriMMC 名册实证形态（watchlist 先例）；三席直寻址候 TriMMC 名册勘验
const SEATS_LINE = "CPO/COO/CTO 三席";

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
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch { /* 三钉③ */ }
}

/** 定位需求池现位: glob 各周目录取最大周号（跨周资产随迁移平移） */
function locatePoolFile() {
  try {
    const weeks = fs
      .readdirSync(PLANE_ROOT)
      .filter((d) => /^2026-W\d{2}$/.test(d))
      .sort();
    for (let i = weeks.length - 1; i >= 0; i--) {
      const cand = path.join(PLANE_ROOT, weeks[i], "company-demand-pool.md");
      if (fs.existsSync(cand)) return cand;
    }
  } catch { /* 三钉③ */ }
  return null;
}

async function main() {
  const state = readState();
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastSentDate === today) {
    appendLog(`skip: already sent today (${today}) — 防手动 run/catchup 重发`);
    return;
  }

  const pool = locatePoolFile();
  const poolRel = pool ? path.relative(REPO_ROOT, pool).replace(/\\/g, "/") : "(定位失败)";

  if (!pool) {
    // 三钉①: anchor failure speaks
    appendLog("anchor-miss: company-demand-pool.md 未定位到任何周目录 — error notify 照发");
  }

  const title = pool
    ? "【联审提醒】公司需求池周六联审（12:00）— 转 CPO/COO/CTO"
    : "【联审提醒·异常】需求池文件未定位 — 转 CPO/COO/CTO + BOD";
  const body = pool
    ? `周六 12:00 三席联审（${SEATS_LINE}）：①读需求池（${poolRel}）②逐行四态裁（进方案/进实现/挂起附理由/拒附理由）③定下周清单。裁决留痕入行。本提醒=joint-review-remind.mjs 自动触发（TriMLC 8713 cron，batch-16 件②）。`
    : `需求池文件未在任何周目录定位到（anchor-miss）——请 ${SEATS_LINE} 人工定位 company-demand-pool.md 现位并照常联审；本异常已记 log（joint-review-remind.log）。`;

  try {
    const r = await sendNotify({
      targets: TARGETS,
      title,
      body,
      attribution: "COO 联审定时任务（batch-16 件②，CEO 令 2026-10-02 20:35）",
    });
    if (r && r.ok) {
      state.lastSentDate = today;
      state.lastSentAt = nowIso();
      state.poolPath = poolRel;
      writeState(state);
      appendLog(`sent ok: targets=${TARGETS.join(",")} pool=${poolRel}`);
    } else {
      appendLog(`sent non-ok: ${JSON.stringify(r)} — state 未写（三钉②）`);
    }
  } catch (e) {
    // 三钉②: throw = 未送达，state 不写
    appendLog(`send fail: ${e.message} — state 未写（三钉②）`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    appendLog(`fatal (exiting 0 per 三钉③): ${e.message}`);
    process.exit(0);
  });
