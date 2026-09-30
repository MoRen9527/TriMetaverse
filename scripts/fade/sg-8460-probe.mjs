// sg-8460-probe.mjs — D-15 8460 缓解位在位性探测执行体（CTO 派工 2026-09-30 05:0x，CEO 04:57 批①实施）
// 执行位: sg TriMMC 8710 job `every 21600000ms`（6h，日 4 轮；TriMMC 即生效型零重启零 allowlist——
//   2026-09-30 实勘: src/cron 十件零白名单, addJob 写 store 后 executor.tick() 即时入调度）。
// 双锚只读（CTO 五要目②）:
//   锚①8460 在位性 = `systemctl is-active bigmodel-h1-proxy.service` === 'active' 且 `ss -tln` 含 ':8460' 监听
//   锚②proxy.log 当日(UTC)行数 >= 2（9-25 起低活基线 4-5 行/日；2=下破告警线，候 7 日校准；低行数≠故障盲区）
// 告警通道（五要目③）: LG-036 notify 信箱双跳——契约同 ledger-watchlist-patrol notify()：
//   sg 面 loopback http://127.0.0.1:8710 + /etc/trimc-internal-token 直读（trimc 主进程身份）；
//   bod 目标必 target_daemon='trimlc'（'trimmc' 系 sg 值席专用, 400 daemon_seat_mismatch 勘正 2026-09-29）。
// 异常才发（正常轮静默落 log）；探测只报异常不定谳（五要目④）——异常触发值席照
//   docs/execution/fade-007-incident-sop.md 链 2a9b5e94 实测定谳。
// 回滚锚（五要目⑤）: TriMMC job enabled=false PATCH 即停（command 不变；TriMMC 零 allowlist 无 403 面）。
// log: <REPO>/.fade/probe-logs/sg-8460-probe.log（append 一行/轮；.fade=非 git 面）。
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const pExec = promisify(execFile);
const REPO = '/srv/fleet/TriMetaverse';
const LOG_DIR = path.join(REPO, '.fade/probe-logs');
const LOG_FILE = path.join(LOG_DIR, 'sg-8460-probe.log');
const SERVICE = 'bigmodel-h1-proxy.service';
const PORT = 8460;
const PROXY_LOG = '/opt/bigmodel-h1-proxy/proxy.log';
const MIN_DAILY_LINES = 2; // 下破告警线（7 日校准期 2026-09-30 起）
const SEAT_TARGET = 'bod';

function stamp() { return new Date().toISOString(); }
function err(msg) { console.error(`[sg-8460-probe][ERROR] ${stamp()} ${msg}`); }

async function run(cmd, args) {
  try { const { stdout } = await pExec(cmd, args, { timeout: 8000 }); return { ok: true, out: stdout }; }
  catch (e) { return { ok: false, out: (e.stdout ?? '') + (e.stderr ?? '') + e.message }; }
}

async function notify(title, body) {
  let token = '';
  try { token = fs.readFileSync('/etc/trimc-internal-token', 'utf8').trim(); } catch { /* 出声在调用侧 */ }
  if (!token) return { ok: false, detail: 'notify skip: token missing' };
  try {
    const res = await fetch('http://127.0.0.1:8710/internal/v1/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Token': token },
      body: JSON.stringify({ source_seat: 'm-cos', target_daemon: 'trimlc', targets: [SEAT_TARGET], urgent: 'normal', title, body }),
    });
    return { ok: res.status >= 200 && res.status < 300, detail: `http=${res.status}` };
  } catch (e) { return { ok: false, detail: `notify fail: ${e.message}` }; }
}

// ── 锚①8460 在位性（两证齐=在位；systemctl/ss 自身失败=判据失败须出声, 禁静默当正常） ──
const svc = await run('systemctl', ['is-active', SERVICE]);
const svcActive = svc.ok && svc.out.trim() === 'active';
const ssOut = await run('ss', ['-tln']);
const portLine = ssOut.ok ? ssOut.out.split('\n').find((l) => l.includes(`:${PORT} `)) : undefined;
const portListening = Boolean(portLine);

// ── 锚②proxy.log 当日(UTC)行数（读失败=判据失败出声） ──
let dailyLines = -1;
let linesErr = '';
try {
  const today = stamp().slice(0, 10);
  dailyLines = fs.readFileSync(PROXY_LOG, 'utf8').split('\n').filter((l) => l.startsWith(today)).length;
} catch (e) { linesErr = e.message; }

// ── 判定 ──
const alerts = [];
if (!svc.ok) alerts.push(`SERVICE_CHECK_FAIL: systemctl unreadable (${svc.out.trim().slice(0, 80)})`);
else if (!svcActive) alerts.push(`SERVICE_DOWN: ${SERVICE} state=${svc.out.trim() || 'unknown'}`);
if (!ssOut.ok) alerts.push(`PORT_CHECK_FAIL: ss unreadable`);
else if (!portListening) alerts.push(`PORT_NOT_LISTENING: ${PORT} 无监听`);
if (linesErr) alerts.push(`PROXYLOG_READ_FAIL: ${linesErr.slice(0, 80)}`);
else if (dailyLines < MIN_DAILY_LINES) alerts.push(`LOW_DAILY_LINES: 当日(UTC) ${dailyLines} 行 < ${MIN_DAILY_LINES} 下破线（7 日校准期内）`);

const verdict = alerts.length ? 'ALERT' : 'OK';

// ── 落 log（每轮一行, 正常轮到此为止=静默） ──
try {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, `${stamp()} VERDICT=${verdict} service=${svc.ok ? svc.out.trim() : 'check-fail'} port=${portListening ? 'LISTEN' : 'NONE'} dailyLines=${dailyLines} alerts=${alerts.length ? alerts.join(' | ') : 'none'}\n`);
} catch (e) { err(`log append fail: ${e.message}`); }

// ── 异常才 notify（含双锚读数+分诊指针） ──
if (alerts.length) {
  const body = [
    `[D-15 8460 探测] ${stamp()} 双锚读数:`,
    `锚①在位性: systemd=${svc.ok ? svc.out.trim() : 'check-fail'} / 8460监听=${portListening ? 'YES' : 'NO'}`,
    `锚②proxy.log 当日(UTC)行数: ${linesErr ? `读失败(${linesErr.slice(0, 60)})` : dailyLines}（下破线 ${MIN_DAILY_LINES}，基线 4-5）`,
    `异常: ${alerts.join('；')}`,
    `分诊指针: 定谳须实测（探测只报不定谳）照 docs/execution/fade-007-incident-sop.md 链 2a9b5e94；`,
    `systemd down→查 service 日志 journalctl -u ${SERVICE}；8460 无监听→查进程；低行数=低活观察非故障（值席裁）`,
    `回滚锚: TriMMC job sg-8460-probe enabled=false PATCH 即停。`,
  ].join('\n');
  const r = await notify('[sg-8460-probe] 8460 缓解位在位性异常', body);
  if (!r.ok) err(`ALERT notify fail: ${r.detail}`);
  console.log(`probe done: ${verdict} notified=${r.ok ? 'yes' : 'no'} (${r.detail})`);
} else {
  console.log(`probe done: OK (service=active port=LISTEN dailyLines=${dailyLines})`);
}
