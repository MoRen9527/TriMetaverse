// LG-090 方向②·DEM-006 提前试点 · COS 催办巡拍 job —— 8713 TriMLC 站（首铸）
// 令源:   CEO 2026-10-17 13:48 令（BOD 转派·「今天先给 COS 挂催办定时器」）·
//         LG-090 跨域流转断链勘补项 方向②「超时查催自动化」daemon 常驻化
// 分工:   机械部分归本 job（30min 巡拍·超时判定·每拍一行数据留痕·催办信号产出）；
//         判断裁量归 COS 会话（对拍读信号→催办强度/升级链裁量→SendMessage 实催）——CEO「COS 只当大脑」分工形态。
// 数据流: patrol-watchlist.json（机读候收清单·COS 面维护·周目录路由）
//         → 30min 巡拍（超时=now-dispatchedAt>timeoutMin 且 status=pending 且 mode=enforce）
//         → 每拍一行 patrol-log.jsonl（拍时点/扫描项数/触发催办项/催办对象/回执情况）
//         → overdue 项写 patrol-due.json（催办信号·COS 会话对拍裁量输入）
// 契约:   防误催（CPO 初判+CEO 令③）：mode=enforce 才催；observe 项只记录（自然段观察类不催）；
//         催办节律=每 timeoutMin 一轮（同一项两轮之间不重复催·nudgeCount 递增供强度裁量）；
//         幂等=状态文件 DATA_DIR（防重启重催）；时区=Asia/Shanghai 显式钉死；空转零催照常落数据行（CEO 令④每拍一行）。
// 门禁对表: F-3 三查（201+nextRunAt 值面+enabled=true）+手动拍（run 200 ran:true）+首拍 PASS 值面断言
//         （patrol-log.jsonl 首行落盘+信号/空转形态正确）——ALLOWLIST 追加第 18 条随 restart 生效。
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const REPO = 'D:/Code/ai/TriMetaverse';
const DATA_DIR = process.env.TRILC_DATA_DIR || join(process.env.LOCALAPPDATA || '', 'trilc-channel');
const STATE_FILE = process.env.TRILC_CPT_STATE_PATH || join(DATA_DIR, 'cos-patrol-state.json');
const DAEMON_NAME = 'TriMLC@8713(win-m-cos-host)'; // D-24 机位断言头
const BJ_OFFSET_MS = 8 * 3600 * 1000; // Asia/Shanghai 恒 +8（无 DST）

// ── 北京时间工具（UTC+8 分量直取·禁本地时区依赖·E1-1 同构）──
function bjParts(ts) {
  const d = new Date(ts + BJ_OFFSET_MS);
  return {
    y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, day: d.getUTCDate(),
    h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds(),
  };
}
function bjIso(ts) {
  const p = bjParts(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${p.y}-${pad(p.m)}-${pad(p.day)}T${pad(p.h)}:${pad(p.mi)}:${pad(p.s)}+08:00`;
}
// ISO 周号（周目录路由·现役 W42 形态·E1-1 同构）
function isoWeek(ts) {
  const d = new Date(ts + BJ_OFFSET_MS);
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7; // Mon=0
  t.setUTCDate(t.getUTCDate() - dayNum + 3); // 本周四
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const fDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fDayNum + 3);
  const week = 1 + Math.round((t - firstThursday) / (7 * 24 * 3600 * 1000));
  return { year: t.getUTCFullYear(), week };
}

// ── 幂等状态（job 侧·防重启重催；只保留 7 天内键防膨胀）──
function loadState() {
  try {
    const st = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
    const nudges = {};
    for (const [k, v] of Object.entries(st.nudges || {})) {
      if (new Date(v.at).getTime() > cutoff) nudges[k] = v;
    }
    return { nudges };
  } catch {
    return { nudges: {} };
  }
}
function saveState(st) {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(st, null, 2) + '\n', 'utf-8');
}

// ── 主流程 ──
const now = Date.now();
const { year, week } = isoWeek(now);
const weekDir = join(REPO, 'docs', 'workflow', 'operating-records', `${year}-W${String(week).padStart(2, '0')}`, 'trees', 'cos-patrol-timer');
const watchlistPath = process.env.TRILC_CPT_WATCHLIST || join(weekDir, 'patrol-watchlist.json');
const logPath = process.env.TRILC_CPT_LOG || join(weekDir, 'patrol-log.jsonl');
const duePath = process.env.TRILC_CPT_DUE || join(weekDir, 'patrol-due.json');

// 清单缺失=空转（零催·落一行空转数据行照常留痕）
if (!existsSync(watchlistPath)) {
  const line = JSON.stringify({ beat: bjIso(now), scan: 0, due: [], nudged: [], idle: 'watchlist-missing' }) + '\n';
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, line, 'utf-8');
  console.log(`[cos-patrol] watchlist not found (idle): ${watchlistPath}`);
  process.exit(0);
}

let items = [];
try {
  const wl = JSON.parse(readFileSync(watchlistPath, 'utf-8'));
  items = Array.isArray(wl.items) ? wl.items : [];
} catch (e) {
  const line = JSON.stringify({ beat: bjIso(now), scan: 0, due: [], nudged: [], error: `watchlist-parse: ${String(e).slice(0, 120)}` }) + '\n';
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, line, 'utf-8');
  console.log(`[cos-patrol] watchlist parse error (idle): ${String(e).slice(0, 120)}`);
  process.exit(0);
}

const st = loadState();
const due = [];
const nudged = [];
for (const it of items) {
  if (it.status !== 'pending' || it.mode !== 'enforce') continue; // 只催 enforce+pending
  const dispTs = new Date(it.dispatchedAt).getTime();
  const timeoutMs = (Number(it.timeoutMin) || 60) * 60 * 1000;
  if (Number.isNaN(dispTs)) continue; // 解析失败跳过（宁缺勿造）
  const overdueMs = now - dispTs - timeoutMs;
  if (overdueMs <= 0) continue; // 未超时
  const key = `${it.id}`;
  const last = st.nudges[key];
  // 催办节律：首轮超时即催；此后每 timeoutMin 一轮（防 30min 拍频重复催）
  if (!last || now - new Date(last.at).getTime() >= timeoutMs) {
    const count = (last?.count || 0) + 1;
    st.nudges[key] = { at: bjIso(now), count };
    const entry = { id: it.id, to: it.nudge || it.owner || 'bod', nudgeCount: count, overdueMin: Math.round(overdueMs / 60000) };
    due.push(entry);
    nudged.push(entry.id);
  } else {
    // 催办间隔窗内：记录 overdue 但不重复催（大脑侧读 log 可见持续态）
    due.push({ id: it.id, to: it.nudge || it.owner || 'bod', nudgeCount: last.count, overdueMin: Math.round(overdueMs / 60000), repeatHold: true });
  }
}
if (nudged.length > 0) saveState(st);

// 催办信号文件（COS 会话对拍裁量输入·每拍全量覆盖=现势快照）
mkdirSync(dirname(duePath), { recursive: true });
writeFileSync(duePath, JSON.stringify({ beat: bjIso(now), due }) + '\n', 'utf-8');

// 每拍一行数据（CEO 令④：拍时点/扫描项数/触发催办项/催办对象/回执情况）
const line = JSON.stringify({
  beat: bjIso(now),
  scan: items.length,
  enforce: items.filter((i) => i.mode === 'enforce' && i.status === 'pending').length,
  due: due.map((d) => ({ id: d.id, to: d.to, nudgeCount: d.nudgeCount, overdueMin: d.overdueMin, repeatHold: !!d.repeatHold })),
  nudged,
  receipts: Object.fromEntries(items.map((i) => [i.id, i.receipt || 'pending'])),
}) + '\n';
mkdirSync(dirname(logPath), { recursive: true });
appendFileSync(logPath, line, 'utf-8');

console.log(`[cos-patrol] scan=${bjIso(now)} items=${items.length} due=${due.length} nudged=${nudged.length}`);
for (const d of due) console.log(`[cos-patrol] due: ${d.id} -> ${d.to} (#${d.nudgeCount}${d.repeatHold ? ' hold' : ''})`);
process.exit(0);
