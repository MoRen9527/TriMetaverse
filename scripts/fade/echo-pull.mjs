#!/usr/bin/env node
// echo-pull.mjs — Q2 反向通道一期件②：M-service→M-local 回声拉取器（2026-10-15）
// 令源: CTO 派工单 046caf7cb（CEO 18:16 批）·技术卷 cto-q2-reverse-channel-tech.md §一/§三
// 执行位: 本机 TriMLC 8713 cron `every 300000ms`（5min；注册须 TRILC_CRON_COMMAND_ALLOWLIST
//   追加+daemon 重启——并今晚 19:00-20:00 sg 归一窗·token 轮换同窗单次冷启，FSD 候窗段）。
// 数据流（技术卷 §一）: sg TriMMC 出向队列（件① /internal/v1/echo/queue+ack）→本机本件
//   →POST 本机 TriMLC 8713 /internal/v1/notify（件③ 端点·advisory 服务端硬打标）→m-cos 消费
//   →本件对 sg ack 消账（防重复取）。
// 契约面（件①按此实现）:
//   GET  http://127.0.0.1:8712/internal/v1/echo/queue?consumer=mc-echo-pull
//        → 200 {ok:true, items:[{message_id, source_id, ts_machine, ref, text, title?}]}
//   POST http://127.0.0.1:8712/internal/v1/echo/ack  {message_id, consumer} → {ok:true}
// 红线技术形落点（派工单四红线）:
//   红线①: text>8KB=服务域 schema 破约→标疑+截断可见+ack（禁无限重拉）·零 file/binary 字段受理
//   红线②: 本件=白名单内唯一拉取器席（source_seat=mc-echo-pull·件③收箱白名单单值）
//   红线③: 落箱信全部 advisory:true（件③服务端强制·本件不提交 advisory 字段）
//   红线④: 三元组 {source_id,ts_machine,ref} 二次校验——缺/残=落箱+title 前缀 [标疑]（双闸第二闸）
// 时戳纪律: ts_machine=服务域机写 UTC Z（D-47 同源）；落箱第二时戳=件③ received_at；
//   双时戳差>10min=CPO 会签补强「超窗标疑」→title 前缀 [标疑](超窗 Xm)。
// 失败形态: 拉取败=下节律重试（幂等:message_id 透传→件③ duplicate=true→安全重 ack）；
//   连续 3 节律失败→notify-sender.mjs 链自告警（m-duty-cos 机制席+real-name attribution 守门）
//   ·30min 冷却；**armed 前（件①未部署期）404=「未开通」静默落 log 不计数**——首次成功拉取
//   即 armed，此后任何失败（含 404=路由回归）计数。
// D-46 值面: sg token 只在 sg 侧管道内展开（零落本机卷面/零进本机进程参数）；token 源=
//   /srv/fleet/TriMMC/docker/.env 的 TRIMC_INTERNAL_TOKEN（2026-10-15 token 轮换后 8712 时代
//   权威位；旧 /etc/trimc-internal-token 为 8710 时代残留·值已陈旧禁再读）；本机 token=
//   process.env.TRILC_INTERNAL_TOKEN（daemon cron 子进程继承，零硬编码零打印）；log 零 token
//   值零队列原文全文（只摘要）。
// 测试钩子（keeper 三 env 先例）: ECHO_PULL_TEST_ITEM='<queue item JSON>' 跳过 sg 腿直测本地
//   腿；ECHO_PULL_SG_HOST / ECHO_PULL_LOCAL_URL / ECHO_PULL_TARGET_SEAT / ECHO_PULL_DRYRUN=1。
// log: D:/Code/ai/TriMetaverse/.fade/probe-logs/echo-pull.log（append 一行/轮）
// state: D:/Code/ai/TriMetaverse/.fade/tmp/echo-pull-state.json
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from 'node:fs';
import { sendNotify } from './lib/notify-sender.mjs';

const REPO = 'D:/Code/ai/TriMetaverse';
const LOG_FILE = `${REPO}/.fade/probe-logs/echo-pull.log`;
const STATE_FILE = `${REPO}/.fade/tmp/echo-pull-state.json`;
const SG_HOST = process.env.ECHO_PULL_SG_HOST?.trim() || 'M-SG-47.245.122.61';
const LOCAL_BASE = (process.env.ECHO_PULL_LOCAL_URL?.trim() || 'http://127.0.0.1:8713').replace(/\/+$/, '');
const TARGET_SEAT = process.env.ECHO_PULL_TARGET_SEAT?.trim() || 'm-cos';
const DRYRUN = process.env.ECHO_PULL_DRYRUN === '1';
const TEST_ITEM = process.env.ECHO_PULL_TEST_ITEM?.trim() || '';
const SOURCE_SEAT = 'mc-echo-pull';
const CONSUMER = 'mc-echo-pull';
const MAX_BODY_BYTES = 8 * 1024;
const OVERWINDOW_MS = 10 * 60_000; // CPO 会签补强：双时戳差>10min 标疑
const FAIL_STREAK_ALARM = 3;       // 派工单：连续 N=3 节律失败告警
const ALARM_COOLDOWN_MS = 30 * 60_000;
// daemon 环境 PATH 无 ssh（bod-tick 11:40 拍 ENOENT 实证）——绝对路径为正形
const SSH_EXE = 'C:/Program Files/Git/usr/bin/ssh.exe';
const MSG_ID_RE = /^[A-Za-z0-9._:\-]{1,128}$/; // id 会插进远端 shell 命令串——严格白名单

function stamp() { return new Date().toISOString(); }
function log(msg) {
  try {
    mkdirSync(`${REPO}/.fade/probe-logs`, { recursive: true });
    appendFileSync(LOG_FILE, `${stamp()} ${msg}\n`);
  } catch { /* log 失败不炸主流程 */ }
}
function loadState() {
  try {
    if (existsSync(STATE_FILE)) {
      const s = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
      return { armed: Boolean(s.armed), failStreak: Number(s.failStreak) || 0, lastAlarmAt: String(s.lastAlarmAt || '') };
    }
  } catch { /* 坏 state 当全新起 */ }
  return { armed: false, failStreak: 0, lastAlarmAt: '' };
}
function saveState(s) {
  try {
    mkdirSync(`${REPO}/.fade/tmp`, { recursive: true });
    writeFileSync(STATE_FILE, `${JSON.stringify(s)}\n`);
  } catch (e) { log(`state save fail: ${String(e).slice(0, 80)}`); }
}

// ── sg 腿（token sg 侧管道内展开·零落本机）──
function sshRemote(remoteCmd, timeoutMs = 30000) {
  const r = spawnSync(SSH_EXE, ['-o', 'ConnectTimeout=12', '-o', 'BatchMode=yes', SG_HOST, remoteCmd], {
    encoding: 'utf8', timeout: timeoutMs, windowsHide: true,
  });
  if (r.error) return { ok: false, out: '', err: String(r.error).slice(0, 160) };
  if (r.status !== 0 && !r.stdout) return { ok: false, out: '', err: (r.stderr || `exit ${r.status}`).slice(0, 160) };
  return { ok: true, out: r.stdout || '', err: (r.stderr || '').slice(0, 160) };
}
/** curl -w 尾行状态码拆分：返回 {httpCode, body} */
function splitCurlW(out) {
  const idx = out.lastIndexOf('\n');
  if (idx < 0) return { httpCode: 0, body: out };
  const code = parseInt(out.slice(idx + 1).trim(), 10);
  return { httpCode: Number.isFinite(code) ? code : 0, body: out.slice(0, idx) };
}
function sgQueueGet() {
  const cmd = `curl -s -m 8 -w '\\n%{http_code}' -H "X-Internal-Token: $(grep -E '^TRIMC_INTERNAL_TOKEN=' /srv/fleet/TriMMC/docker/.env 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '\\r\\n')" "http://127.0.0.1:8712/internal/v1/echo/queue?consumer=${CONSUMER}"`;
  const r = sshRemote(cmd);
  if (!r.ok) return { kind: 'ssh_fail', detail: r.err };
  const { httpCode, body } = splitCurlW(r.out);
  if (httpCode === 404) return { kind: 'not_provisioned' };
  if (httpCode !== 200) return { kind: 'http_fail', detail: `HTTP ${httpCode}` };
  try {
    const doc = JSON.parse(body);
    if (!doc || doc.ok !== true || !Array.isArray(doc.items)) return { kind: 'schema_fail', detail: 'ok/items 形不符' };
    return { kind: 'ok', items: doc.items };
  } catch (e) { return { kind: 'schema_fail', detail: `JSON 解析败 ${String(e).slice(0, 60)}` }; }
}
function sgAck(messageId) {
  const cmd = `curl -s -m 8 -o /dev/null -w '%{http_code}' -X POST -H "X-Internal-Token: $(grep -E '^TRIMC_INTERNAL_TOKEN=' /srv/fleet/TriMMC/docker/.env 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '\\r\\n')" -H "Content-Type: application/json" -d '{"message_id":"${messageId}","consumer":"${CONSUMER}"}' "http://127.0.0.1:8712/internal/v1/echo/ack"`;
  const r = sshRemote(cmd);
  if (!r.ok) return { ok: false, detail: r.err };
  const code = parseInt(r.out.trim(), 10);
  return { ok: code >= 200 && code < 300, detail: `HTTP ${r.out.trim() || 'empty'}` };
}

// ── 本地腿（件③ 端点）──
async function localPostLetter(letter) {
  const token = process.env.TRILC_INTERNAL_TOKEN?.trim() || '';
  if (!token) return { ok: false, status: 0, detail: 'TRILC_INTERNAL_TOKEN absent (须由 8713 daemon cron 子进程继承)' };
  try {
    const res = await fetch(`${LOCAL_BASE}/internal/v1/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Token': token },
      body: JSON.stringify(letter),
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text().catch(() => '');
    return { ok: res.status >= 200 && res.status < 300, status: res.status, detail: text.slice(0, 160) };
  } catch (e) { return { ok: false, status: 0, detail: String(e).slice(0, 120) }; }
}

// ── 单 item 处理：三元组二次校验+超窗标疑+8KB 截断+落箱+消账 ──
function byteSlice(str, maxBytes) {
  const buf = Buffer.from(str, 'utf-8');
  if (buf.byteLength <= maxBytes) return { text: str, truncated: false };
  return { text: `${buf.subarray(0, maxBytes).toString('utf-8')}…[截断:服务域超8KB]`, truncated: true };
}
async function processItem(item, nowMs) {
  const reasons = [];
  const sourceId = typeof item?.source_id === 'string' ? item.source_id : '';
  const tsMachine = typeof item?.ts_machine === 'string' ? item.ts_machine : '';
  const ref = typeof item?.ref === 'string' ? item.ref : '';
  const text = typeof item?.text === 'string' ? item.text : '';
  // 红线④ 双闸第二闸：三元组缺/残=标疑落箱（不丢弃——标疑可见是判法，静默丢才是错）
  if (!sourceId || !tsMachine || !ref) {
    const missing = ['source_id', 'ts_machine', 'ref'].filter((k) => !(typeof item?.[k] === 'string' && item[k]));
    reasons.push(`缺三元组(${missing.join(',')})`);
  }
  let tsMs = Number.NaN;
  if (tsMachine) {
    tsMs = Date.parse(tsMachine);
    if (!Number.isFinite(tsMs)) reasons.push('ts_machine 非法');
  }
  // CPO 会签补强：双时戳差>10min 超窗标疑
  if (Number.isFinite(tsMs)) {
    const lag = nowMs - tsMs;
    if (lag > OVERWINDOW_MS) reasons.push(`超窗 ${Math.round(lag / 60000)}m`);
  }
  const big = byteSlice(text, MAX_BODY_BYTES - 512); // 预留元信息脚注位
  if (big.truncated) reasons.push('text 超8KB 已截断(红线①服务域破约)');
  const baseTitle = typeof item?.title === 'string' && item.title ? item.title : `[Q2回声] ${ref || sourceId || '(无ref)'}`;
  const title = reasons.length ? `[标疑](${reasons.join(';')}) ${baseTitle}`.slice(0, 200) : baseTitle.slice(0, 200);
  const footer = [
    big.text,
    '—',
    `source_id: ${sourceId || '(缺)'}`,
    `ts_machine: ${tsMachine || '(缺)'}（服务域 UTC Z）`,
    `ref: ${ref || '(缺)'}`,
    `拉取时刻: ${stamp()}（本机·落箱第二时戳=received_at）`,
  ].filter(Boolean).join('\n');
  const letter = {
    ...(typeof item?.message_id === 'string' && MSG_ID_RE.test(item.message_id) ? { message_id: item.message_id } : {}),
    source_seat: SOURCE_SEAT,
    target_seat: TARGET_SEAT,
    urgent: 'normal',
    title,
    body: footer,
  };
  if (DRYRUN) return { stored: true, acked: true, dryrun: true, reasons, title }; // dryrun 无消账面·不计败
  const posted = await localPostLetter(letter);
  if (!posted.ok) return { stored: false, acked: false, reasons, title, postDetail: posted.detail, postStatus: posted.status };
  const parsed = (() => { try { return JSON.parse(posted.detail); } catch { return {}; } })();
  const stored = parsed.stored !== false; // duplicate=true 也算已落（幂等）
  // 消账：id 合规才 ack（id 进远端命令串——非法字符禁入）；缺 id=无法消账→下节律重拉
  if (typeof item?.message_id !== 'string' || !MSG_ID_RE.test(item.message_id)) {
    return { stored, acked: false, reasons: [...reasons, 'message_id 缺/非法·未消账'], title };
  }
  const ack = sgAck(item.message_id);
  return { stored, acked: ack.ok, reasons, title, ackDetail: ack.detail };
}

// ── 告警（notify-sender 机制席链·attribution 硬门）──
async function alarm(detail) {
  const now = Date.now();
  try {
    await sendNotify({
      targets: ['bod'],
      urgent: 'urgent',
      title: `[echo-pull] Q2 回声拉取器连续 ${FAIL_STREAK_ALARM} 节律失败`,
      body: `[Q2件② 自告警] ${stamp()}\n失败形态: ${detail}\n行为: 已停等下节律自动重试（零倒补零代登记）；\n排障指针: log=${LOG_FILE}·state=${STATE_FILE}·sg 件① 端点健康（值席探）；\n恢复锚: 修复后连败自清（state failStreak 归零）·告警 30min 冷却。`,
      attribution: `echo-pull.mjs（Q2 一期件②拉取器自告警·FSD 小全施工位）`,
    });
    return true;
  } catch (e) {
    log(`alarm send fail: ${String(e).slice(0, 100)}`);
    return false;
  }
}

// ── 主流程 ──
const state = loadState();
const nowMs = Date.now();
let failure = null;

let pull;
if (TEST_ITEM) {
  // 测试钩子：跳过 sg 腿，直测本地腿（件① 未部署期本地腿活验用）
  try { pull = { kind: 'ok', items: [JSON.parse(TEST_ITEM)] }; }
  catch (e) { console.error(`ECHO_PULL_TEST_ITEM 非 JSON: ${String(e).slice(0, 80)}`); process.exit(2); }
} else {
  pull = sgQueueGet();
}

if (pull.kind === 'ok') {
  const results = [];
  for (const item of pull.items) {
    try { results.push(await processItem(item, nowMs)); }
    catch (e) { results.push({ stored: false, acked: false, reasons: [`处理异常 ${String(e).slice(0, 60)}`], title: '(异常)' }); }
  }
  const ackFails = results.filter((r) => r.stored && !r.acked);
  const postFails = results.filter((r) => !r.stored);
  if (postFails.length > 0) failure = `本地落箱败 ${postFails.length}/${results.length}（${postFails[0].postDetail || '?'}）`;
  else if (ackFails.length > 0) failure = `消账败 ${ackFails.length}/${results.length}（下节律幂等重拉·${ackFails[0].ackDetail || '?'}）`;
  log(`pull ok items=${pull.items.length} stored=${results.filter((r) => r.stored).length} acked=${results.filter((r) => r.acked).length} suspects=${results.filter((r) => r.reasons?.length).length}${results[0]?.title ? ` first="${results[0].title.slice(0, 60)}"` : ''}${failure ? ` FAIL=${failure}` : ''}`);
} else if (pull.kind === 'not_provisioned' && !state.armed) {
  log('queue 404（件① 未部署期·armed 前不计数）');
} else {
  failure = pull.kind === 'not_provisioned' ? 'queue 404（armed 后=路由回归）' : `${pull.kind}: ${pull.detail || ''}`;
  log(`pull fail: ${failure}`);
}

if (failure) {
  if (state.armed) state.failStreak += 1;
  else { state.armed = true; state.failStreak = 1; log('首次失败即 armed（首次成功拉取后才可能有此前 armed）'); }
} else if (pull.kind === 'ok') {
  state.armed = true;
  if (state.failStreak > 0) log(`恢复：连败 ${state.failStreak} 拍清零`);
  state.failStreak = 0;
}

if (state.armed && state.failStreak >= FAIL_STREAK_ALARM) {
  const since = state.lastAlarmAt ? nowMs - Date.parse(state.lastAlarmAt) : Number.POSITIVE_INFINITY;
  if (since >= ALARM_COOLDOWN_MS) {
    const sent = await alarm(failure || `连败 ${state.failStreak} 拍`);
    if (sent) { state.lastAlarmAt = stamp(); log(`ALARM sent（连败 ${state.failStreak}）`); }
  } else log(`ALARM 冷却中（上次 ${state.lastAlarmAt}·连败 ${state.failStreak}）`);
}
saveState(state);
console.log(`echo-pull done: armed=${state.armed} failStreak=${state.failStreak}${failure ? ` failure=${failure}` : ''}${DRYRUN ? ' [DRYRUN]' : ''}${TEST_ITEM ? ' [TEST-ITEM]' : ''}`);
