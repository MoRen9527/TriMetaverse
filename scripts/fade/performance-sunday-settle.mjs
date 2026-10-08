#!/usr/bin/env node
// performance-sunday-settle.mjs — 绩效周日结算窗叫醒（TriMLC 8713 cron spawn face）
// 依据: 编排卷 trees/performance-scoring-revival-01/coo-orchestration-20261007.md §一/§三
//       （LG-068 绩效复活；BOD 2026-10-07 23:41 裁断「按你案执行」；首跑 2026-10-11 21:00）
// 令面: 每周日 21:00 notify BOD（W4x 周指针+两动作提醒）——job notify BOD 即正身
//       「呈 BOD 观察」输出条款的机械落地；pipe 主道=COO 在席转告 CHO+COS（§三转告链，
//       本脚本不直接寻址 CHO/COS——seats.json 全员 bod-addressable:false 未实证直寻址）。
// 正身: TriCompany/docs/workflow/performance-scoring-workflow.md（2026-09-18 生效）
//
// 三钉 contract（照 joint-review-remind.mjs 先例，hard）:
//   ① anchor-check failure speaks — 当周经营记录目录定位失败 → error notify，never silent skip
//   ② send-failure not marked notified — STATE 只在 sendNotify resolve 后写入
//   ③ parse-failure never crashes job — process exits 0 always
//
// 通道现形（照录先例如实）: targets=['bod'] = watchlist/joint-review-remind 唯一实证形态；
// toast/信箱=兜底网，pipe 主道=COO 在席转告。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendNotify } from "./lib/notify-sender.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const LOG_DIR = path.join(REPO_ROOT, ".fade", "probe-logs");
const LOG_FILE = path.join(LOG_DIR, "performance-sunday-settle.log");
const STATE_FILE = path.join(REPO_ROOT, ".fade", "tmp", "performance-sunday-settle-state.json");
const PLANE_ROOT = path.join(REPO_ROOT, "docs", "workflow", "operating-records");

const TARGETS = ["bod"]; // TriMMC 名册实证形态（watchlist/joint-review-remind 先例）

function nowIso() {
  return new Date().toISOString();
}

/** ISO 周标签——返回 { full: '2026-W41'（目录名形）, short: 'W41'（周指针形） }。
 *  ISO 年随 ISO 周走（跨年边界如 12-29 归次年 W01，目录年与 ISO 年不劈叉）。 */
function isoWeekTag(d) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((dt - yearStart) / 86400000 + 1) / 7);
  const short = `W${String(weekNo).padStart(2, "0")}`;
  return { full: `${dt.getUTCFullYear()}-${short}`, short };
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

/** 定位当周经营记录目录: docs/workflow/operating-records/<YYYY>-Wnn/ */
function locateWeekDir(fullTag) {
  try {
    const dir = path.join(PLANE_ROOT, fullTag);
    if (fs.existsSync(dir)) return dir;
  } catch { /* 三钉③ */ }
  return null;
}

async function main() {
  const state = readState();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (state.lastSentDate === today) {
    appendLog(`skip: already sent today (${today}) — 防手动 run/catchup 重发`);
    return;
  }

  const { full: weekTag, short: weekShort } = isoWeekTag(now);
  const weekDir = locateWeekDir(weekTag);
  const weekRel = weekDir ? path.relative(REPO_ROOT, weekDir).replace(/\\/g, "/") : "(定位失败)";

  if (!weekDir) {
    // 三钉①: anchor failure speaks
    appendLog(`anchor-miss: ${weekTag} 经营记录目录未定位 — error notify 照发`);
  }

  const title = weekDir
    ? `【绩效结算窗】${weekTag} 周日结算窗到（21:00）— 呈 BOD 观察`
    : `【绩效结算窗·异常】${weekTag} 经营记录目录未定位 — 呈 BOD 观察`;
  const body = weekDir
    ? `绩效周日结算窗到（${weekTag}）。两动作提醒：①CHO 周期结算——效率源=当周每日读数行 [scoring-eff] 行汇引；成本源=BUDGET_CHECK 触线台账（CFO 面现役留痕直引）；事件账=当周树卷事件按正身四要素计分。②结算毕报落当周经营记录 scoring-ledger-${weekShort.toLowerCase()}.md+知会 COS 收口+回执 COO。本提醒=performance-sunday-settle.mjs 自动触发（TriMLC 8713 cron，LG-068 首跑）。pipe 主道：COO 在席转告 CHO+COS。`
    : `当周（${weekTag}）经营记录目录未在任何周目录定位到（anchor-miss）——请人工定位 docs/workflow/operating-records/ 当周目录现位并照常走结算两动作（CHO 结算+COS 收口）；本异常已记 log（performance-sunday-settle.log）。`;

  try {
    const r = await sendNotify({
      targets: TARGETS,
      title,
      body,
      attribution: "绩效周日结算定时任务（LG-068，BOD 2026-10-07 23:41 裁断）",
    });
    if (r && r.ok) {
      state.lastSentDate = today;
      state.lastSentAt = nowIso();
      state.weekTag = weekTag;
      state.weekPath = weekRel;
      writeState(state);
      appendLog(`sent ok: targets=${TARGETS.join(",")} week=${weekRel}`);
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
