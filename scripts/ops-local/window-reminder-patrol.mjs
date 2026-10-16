// E1-1 · 四 daemon 窗起提醒 job —— 8713 TriMLC 站（首铸）
// 方案稿: docs/execution/window-reminder-job-plan-20261014.md（CEO 2026-10-14 21:26 裁"四个 daemon 都立"·
//         LG-089 charter-2026-W42-005 E1-1 行施工·CEO 2026-10-17 02:36:49 三裁①认方案并窗）
// 数据流: window-ledger.md front-matter windows（机器可读·批后件③改版 schema 六字段）
//         → 5min 巡检判拍（窗起/窗毕 ±5min 容差）→ 落提醒卷（trees/window-reminders/）+ 状态记档
// 契约:   台账只读零回写（COO 唯一定笔位）；幂等键=窗id+拍类型（job 侧状态文件·防重启重发）；
//         时区=Asia/Shanghai 显式钉死（UTC+8 恒定无 DST·跨机不随宿主）；空转零落卷零噪音。
// 门禁对表: 新建 job 三查（201+next_run 值面+enabled=1）+触发实测（run 端点真链路）+幂等实测+
//         空台账实测+回滚实测（enabled=0）——addJob 面候 8713 restart 窗后（ALLOWLIST 追加随冷启生效）。
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const REPO = 'D:/Code/ai/TriMetaverse';
const DATA_DIR = process.env.TRILC_DATA_DIR || join(process.env.LOCALAPPDATA || '', 'trilc-channel');
const STATE_FILE = process.env.TRILC_WR_STATE_PATH || join(DATA_DIR, 'window-reminder-state.json');
const DAEMON_NAME = 'TriMLC@8713(win-m-cto-host)'; // D-24 机位断言头
const TOLERANCE_MS = 5 * 60 * 1000; // ±5min 容差（§1.2）
const BJ_OFFSET_MS = 8 * 3600 * 1000; // Asia/Shanghai 恒 +8（无 DST）

// ── 北京时间工具（UTC+8 分量直取·禁本地时区依赖）──
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
function bjStamp(ts) {
  const p = bjParts(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${p.y}${pad(p.m)}${pad(p.day)}-${pad(p.h)}${pad(p.mi)}${pad(p.s)}`;
}
// ISO 周号（周目录路由·现役 W42 形态）
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

// ── 台账 front-matter windows 轻解析（只取六字段模式行·note 长行自然忽略）──
function parseWindows(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return [];
  const wins = [];
  let cur = null;
  const fieldRe = /^\s+(id|type|start|end|owner|endReminder|state):\s*(.*)$/;
  for (const raw of fm[1].split(/\r?\n/)) {
    const newWin = raw.match(/^\s*-\s+id:\s*(.*)$/);
    if (newWin) {
      if (cur) wins.push(cur);
      cur = { id: stripQuote(newWin[1]) };
      continue;
    }
    const f = raw.match(fieldRe);
    if (f && cur) {
      const key = f[1];
      let val = stripQuote(f[2].trim());
      if (key === 'endReminder') val = val !== 'false';
      cur[key] = val;
    }
  }
  if (cur) wins.push(cur);
  return wins.filter((w) => w.id && w.start);
}
function stripQuote(s) {
  return s.replace(/^"(.*)"$/, '$1').trim();
}

// ── 幂等状态（job 侧·防重启重发；只保留 7 天内键防膨胀）──
function loadState() {
  try {
    const st = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
    const fired = {};
    for (const [k, v] of Object.entries(st.fired || {})) {
      if (new Date(v).getTime() > cutoff) fired[k] = v;
    }
    return { fired };
  } catch {
    return { fired: {} };
  }
}
function saveState(st) {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(st, null, 2) + '\n', 'utf-8');
}

// ── 提醒卷落盘（§三模板·tick-log 同构文件面投递）──
function emitReminder(kind, win, nowTs) {
  const { year, week } = isoWeek(nowTs);
  const root = process.env.TRILC_WR_REPO || REPO; // 测试缝：落卷根随 env 覆盖（生产缺省真仓）
  const dir = join(root, 'docs', 'workflow', 'operating-records', `${year}-W${String(week).padStart(2, '0')}`, 'trees', 'window-reminders');
  mkdirSync(dir, { recursive: true });
  const kindCn = kind === 'start' ? '窗起' : '窗毕';
  const action = kind === 'start' ? '候 owner 开窗确认' : '候 owner 收口确认';
  const file = join(dir, `${kind}-${win.id}-${bjStamp(nowTs)}.md`);
  const body = [
    `# 窗提醒 · ${kindCn} · ${win.id}`,
    `- 窗: ${win.id}（${win.type || 'unknown'}）`,
    `- 时段: ${win.start} ~ ${win.end || 'N/A'}`,
    `- owner: ${win.owner || 'N/A'}`,
    `- 提醒拍发: ${DAEMON_NAME} ${bjIso(nowTs)}（date 现查原值·D-47）`,
    `- 动作请示: ${kindCn}拍=${action}`,
    '- sourceOfTruth: 本卷（提醒流水·台账现势以 window-ledger.md 为准）',
    '',
  ].join('\n');
  writeFileSync(file, body, 'utf-8');
  return file;
}

// ── 主流程 ──
const now = Date.now();
const ledgerPath = process.env.TRILC_WR_LEDGER_PATH || (() => {
  const { year, week } = isoWeek(now);
  return join(REPO, 'docs', 'workflow', 'operating-records', `${year}-W${String(week).padStart(2, '0')}`, 'window-ledger.md');
})();
if (!existsSync(ledgerPath)) {
  console.log(`[window-reminder] ledger not found (idle): ${ledgerPath}`);
  process.exit(0);
}
const windows = parseWindows(readFileSync(ledgerPath, 'utf-8'));
const st = loadState();
const fired = [];
for (const w of windows) {
  if (w.state === 'done' || w.state === 'cancelled') continue; // cancelled 不提醒·done 已毕
  const startTs = new Date(w.start).getTime();
  if (Number.isNaN(startTs)) continue; // 解析失败跳过（宁缺勿造）
  const startKey = `${w.id}:start`;
  if (Math.abs(now - startTs) <= TOLERANCE_MS && !st.fired[startKey]) {
    st.fired[startKey] = bjIso(now);
    fired.push(emitReminder('start', w, now));
  }
  if (w.endReminder !== false && w.end) {
    const endTs = new Date(w.end).getTime();
    if (!Number.isNaN(endTs)) {
      const endKey = `${w.id}:end`;
      if (Math.abs(now - endTs) <= TOLERANCE_MS && !st.fired[endKey]) {
        st.fired[endKey] = bjIso(now);
        fired.push(emitReminder('end', w, now));
      }
    }
  }
}
if (fired.length > 0) saveState(st);
console.log(`[window-reminder] scan=${bjIso(now)} windows=${windows.length} fired=${fired.length}`);
for (const f of fired) console.log(`[window-reminder] emitted: ${f}`);
process.exit(0);
