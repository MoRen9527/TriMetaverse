#!/usr/bin/env node
// E1-4 b2 跨机心跳超时监测 job（sg 8712 TriMMC·spec 7bc56408b 精施工形·stateful v3·b 案换源）
// 挂点A（b 案换源 2026-10-21·LG-085 假警修复 CTO 终裁）: GET /internal/v1/mirror/heartbeats
//   ——TriMMC 节点心跳表读出端点（store.listNodeHeartbeats·commit e8f0219）：
//   ageMs = now - lastSeenAt = 「自末次心跳到达」gap 真值。替代 v2 日志流 offset 形
//   （mirror 行=纯变化沿·稳定健康期零行→lastActivityEpoch 冻结→假超时·10-20 对平勘验实锚）。
//   nodeId 匹配：8713 daemon 重启 PID 后缀变——按主机名前缀 TABLET-0BGCRCP5 find·退 nodes[0]。
// 挂点B（不变）: TriMMC notify API POST /internal/v1/notify + 落卷 fallback（window-reminders）。
// token（D-46 正形·10-15 形维持）: 动态读 /srv/fleet/TriMMC/docker/.env——读不到/键缺=fail-closed
//   报错退出（禁空值兜底·CTO 终裁 2026-10-21）。
// 判定: gapMin=ageMs/60000；gap>60min 且未告警→告警拍；gap≤60min 且告警态→recovered 拍+清态。
//   端点 404/网络错→报错退出不落 state（fail-closed·不误判 recovered/告警）。
// 纪律: D-24 TriMMC@sg(8712) 逐字·D-47 现查落款·值面零出机·幂等 job 侧 state（不回写台账）。
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.STATE_DIR || "/home/fleet/.trilc";
const STATE_PATH = path.join(DATA_DIR, "e1-b2-heartbeat-watch-state.json");
const WARN_DIR = process.env.WARN_DIR || "/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W42/trees/window-reminders";
const THRESHOLD_MIN = Number(process.env.THRESHOLD_MIN || 60);
const BASE = "http://127.0.0.1:8712";
const NODE_PREFIX = "TABLET-0BGCRCP5"; // 8713 宿主主机名（nodeId=主机名-PID·PID 段自适应）
const DAEMON_TAG = "TriMMC@sg(8712)";

function iso(d = new Date()) { return d.toLocaleString("sv-SE", { timeZone: "Asia/Shanghai" }).replace(" ", "T") + "+08:00"; }

function loadToken() {
  // D-46 正形（CTO 终裁 2026-10-21）：读不到文件/键缺=报错退出，禁空值兜底。
  const raw = fs.readFileSync("/srv/fleet/TriMMC/docker/.env", "utf-8");
  const tok = (raw.match(/^TRIMC_INTERNAL_TOKEN=(.+)$/m) || [])[1]?.replace(/^"|"$/g, "");
  if (!tok) throw new Error("TRIMC_INTERNAL_TOKEN 缺失于 docker/.env —— fail-closed 退出");
  return tok;
}

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")); } catch { return { alerting: false }; }
}
function saveState(s) { fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true }); fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 1)); }

async function notify(TOKEN, title, body) {
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
  const TOKEN = loadToken();
  const res = await fetch(`${BASE}/internal/v1/mirror/heartbeats`, {
    headers: { "X-Internal-Token": TOKEN },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`heartbeats 端点 ${res.status} —— fail-closed 退出（不落 state）`);
  const data = await res.json();
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  const node = nodes.find((n) => String(n.nodeId || "").startsWith(NODE_PREFIX)) || nodes[0];
  if (!node) throw new Error("nodes 空（8713 首心跳未达或表清）—— fail-closed 退出");

  const st = loadState();
  const nowMs = Date.now();
  const gapMin = Math.max(0, node.ageMs / 60000); // gap 真值=ageMs（自末次心跳到达）
  const gapRound = Math.round(gapMin);

  if (gapMin > THRESHOLD_MIN && !st.alerting) {
    const body = `[E1-4 b2] 8713 心跳超时 ${gapRound}min（阈值 ${THRESHOLD_MIN}）——ageMs 真值形（b 案）——疑宿主睡眠（家族两案 10-12/10-16 先例）/或 daemon 死/隧道断——分诊: 8713 healthz 不可达即宿主面；sg 值席勿盲目重启对端`;
    const out = await notify(TOKEN, `[E1-4 b2] 8713 心跳超时 ${gapRound}min`, body);
    st.alerting = true; st.alertAt = iso(); st.gapAtFire = gapRound;
    console.log(`ALERT gap=${gapRound}min ageMs=${node.ageMs} (${out})`);
  } else if (gapMin <= THRESHOLD_MIN && st.alerting) {
    st.alerting = false;
    const out = await notify(TOKEN, "[E1-4 b2] 8713 心跳恢复", `gap 已回归 ≤${THRESHOLD_MIN}min（recovered 拍·告警态清除·ageMs=${node.ageMs}）——观察者 ${DAEMON_TAG} ${iso()}`);
    console.log(`RECOVERED (${out})`);
  } else {
    console.log(`ok gap=${gapRound}min ageMs=${node.ageMs} state=${node.state} unknown=${node.unknown} alerting=${!!st.alerting} node=${node.nodeId}`);
  }
  st.lastAgeMs = node.ageMs;
  saveState(st);
}

main().catch((e) => { console.error("watch fail:", e.message); process.exit(1); });
