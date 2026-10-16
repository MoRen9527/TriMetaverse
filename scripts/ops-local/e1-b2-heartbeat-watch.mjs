#!/usr/bin/env node
// E1-4 b2 跨机心跳超时监测 job（sg 8712 TriMMC·spec 7bc56408b 精施工形·stateful v2）
// 挂点A（活体勘钉 2026-10-17）: TriMMC daemon 日志 mirror 行流——8713/宿主侧节点心跳
//   经隧道达 sg 8712 /internal/v1/heartbeat 后落日志（TABLET-* 真事件流·实时到达）；
//   内存 nodeHeartbeats 无读出端点（mirror/nodes|status|heartbeat/status 全 404 实勘）
//   ＋18710 隧道不在 sg 侧（ss 零命中）——日志流=唯一活体数据面（事件真值非推定）。
//   **跨 run 状态**: offset+last_activity_epoch 持久于 state——新字节含 mirror 行=心跳到达
//   （读时计·无行=静默·gap 累计真实）。
// 挂点B（活体勘钉 2026-10-17）: TriMMC notify API POST /internal/v1/notify
//   （源席=m-duty-cos 基建道·§149 代发链常态化）+ 落卷 fallback（window-reminders）。
// 判定: gap=now-last_activity_epoch；gap>60min(首夜候值·回填后调定)且未告警→告警拍
//      （文带分诊提示）；gap≤60min 且告警态→recovered 拍+清态。
// 纪律: D-24 TriMMC@sg(8712) 逐字·D-47 现查落款·值面零出机·幂等 job 侧 state（不回写台账）。
import fs from "node:fs";
import path from "node:path";

const LOG_PATH = process.env.LOG_PATH || "/tmp/trimc-run.log";
const DATA_DIR = process.env.STATE_DIR || "/home/fleet/.trilc"; // DATA_DIR(/var/lib/trimc) root 属主不可写实勘——state 迁 fleet 位·随卷注
const STATE_PATH = path.join(DATA_DIR, "e1-b2-heartbeat-watch-state.json");
const WARN_DIR = process.env.WARN_DIR || "/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W42/trees/window-reminders";
const THRESHOLD_MIN = Number(process.env.THRESHOLD_MIN || 60); // 首夜 60min 候值
const BASE = "http://127.0.0.1:8712";
const TOKEN = (fs.readFileSync("/srv/fleet/TriMMC/docker/.env", "utf-8").match(/^TRIMC_INTERNAL_TOKEN=(.+)$/m) || [])[1]?.replace(/^"|"$/g, "") || "";
const DAEMON_TAG = "TriMMC@sg(8712)";
const MIR = "[trimc:mirror] node ";

function iso(d = new Date()) { return d.toLocaleString("sv-SE", { timeZone: "Asia/Shanghai" }).replace(" ", "T") + "+08:00"; }

function loadState() { try { return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")); } catch { return { offset: 0, lastActivityEpoch: null, alerting: false }; } }
function saveState(s) { fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true }); fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 1)); }

async function notify(title, body) {
  let api = "skipped";
  try {
    const res = await fetch(`${BASE}/internal/v1/notify`, {
      method: "POST",
      headers: { "X-Internal-Token": TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ source_seat: "m-duty-cos", target_daemon: "trimlc", target_seat: "bod", urgent: "urgent", title, body }),
    });
    api = `notify_api=${res.status}`;
  } catch (e) { api = `notify_api_err=${e.message}`; }
  try {
    fs.mkdirSync(WARN_DIR, { recursive: true });
    fs.writeFileSync(path.join(WARN_DIR, `提醒-8713心跳-${iso().replace(/[:.]/g, "")}.md`),
      `# 窗提醒 · E1-4 b2 · 8713 心跳\n- ${title}\n- ${body}\n- 出向: ${api}\n- 观察者: ${DAEMON_TAG}\n- 拍发: ${iso()}（脚本内现查）\n- sourceOfTruth: 本卷（提醒流水·heartbeat 现势以 daemon 面为准）\n`);
  } catch (e) { console.error("warn volume fail:", e.message); }
  return api;
}

async function main() {
  const st = loadState();
  if (!fs.existsSync(LOG_PATH)) { console.log("idle: log absent"); saveState(st); return; }
  const size = fs.statSync(LOG_PATH).size;
  const off = Math.min(st.offset || 0, size);
  let activity = false;
  if (size > off) {
    const fresh = fs.readFileSync(LOG_PATH).slice(off).toString("utf-8", true);
    activity = fresh.includes(MIR);
    st.offset = size;
  }
  const nowMs = Date.now();
  if (activity) {
    st.lastActivityEpoch = nowMs;
    if (st.alerting) {
      st.alerting = false;
      const out = await notify("[E1-4 b2] 8713 心跳恢复", `gap 已回归 ≤${THRESHOLD_MIN}min（recovered 拍·告警态清除）——观察者 ${DAEMON_TAG} ${iso()}`);
      console.log(`RECOVERED (${out})`);
    }
  }
  const gapMin = st.lastActivityEpoch ? (nowMs - st.lastActivityEpoch) / 60000 : -1;
  if (gapMin >= 0 && gapMin > THRESHOLD_MIN && !st.alerting) {
    const body = `[E1-4 b2] 8713 心跳超时 ${Math.round(gapMin)}min（阈值 ${THRESHOLD_MIN}）——疑宿主睡眠（家族两案 10-12/10-16 先例）/或 daemon 死/隧道断——分诊: 8713 healthz 不可达即宿主面；sg 值席勿盲目重启对端`;
    const out = await notify(`[E1-4 b2] 8713 心跳超时 ${Math.round(gapMin)}min`, body);
    st.alerting = true; st.alertAt = iso(); st.gapAtFire = Math.round(gapMin);
    console.log(`ALERT gap=${Math.round(gapMin)}min (${out})`);
  } else {
    console.log(`ok gap=${Math.round(gapMin)}min alerting=${!!st.alerting} activity=${activity}`);
  }
  saveState(st);
}

main().catch((e) => { console.error("watch fail:", e.message); process.exit(1); });
