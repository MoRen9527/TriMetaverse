#!/usr/bin/env node
// bod-tick-runner.mjs — BOD 半小时节拍 daemon 化执行体（BOD 2026-10-09 令，8713 TriMLC cron 挂载）
// 正形：五段+值席状态段探针 → 拍报落盘（tick-latest.md 滚动 + tick-log-YYYYMMDD.md 追加）
// 纪律：时刻现查禁推算；token 值面禁进拍报；任一探针挂≠全拍炸（逐段 try/catch）
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';

const SG = 'M-SG-47.245.122.61';
const RHY = 'R-HY-8.155.54.79';
const REPO = 'D:/Code/ai/TriMetaverse';
// 13 席名册（CEO 10:34 令：节拍须报全席在岗态，一席在干活=非空闲）
const LOCAL_SEATS = ['m-cho', 'm-cfo', 'm-rdt', 'm-cto', 'm-sde', 'm-ste', 'm-cpo', 'm-cmo', 'm-coo', 'm-cao', 'm-cos', 'm-cso'];
const ACTIVE_MS = 120_000; // transcript mtime 120s 内有写=会话在干活

// 本机 12 席探针：扫 transcript jsonl，活跃者读头 4KB 提 customTitle 归席位
function scanLocalSeats() {
  const root = 'C:/Users/jedih/.claude/projects';
  const active = new Set();
  try {
    const now = Date.now();
    for (const proj of readdirSync(root)) {
      let files = [];
      try { files = readdirSync(`${root}/${proj}`).filter((f) => f.endsWith('.jsonl')); } catch { continue; }
      for (const f of files) {
        try {
          const st = statSync(`${root}/${proj}/${f}`);
          if (now - st.mtimeMs > ACTIVE_MS) continue;
          const head = readFileSync(`${root}/${proj}/${f}`, { encoding: 'utf8' }).slice(0, 4096);
          const m = head.match(/"customTitle":"(m-[a-z]+)"/);
          if (m && LOCAL_SEATS.includes(m[1])) active.add(m[1]);
        } catch { /* 单文件失败不炸 */ }
      }
    }
  } catch (e) {
    return { err: String(e).slice(0, 100), active: [] };
  }
  return { active: LOCAL_SEATS.filter((s) => active.has(s)) };
}

// spawnSync 数组参数不过本地 shell——远端命令原样交 ssh，零引号地狱
function ssh(host, remoteCmd, timeoutMs = 40000) {
  const r = spawnSync('ssh', ['-o', 'ConnectTimeout=12', host, remoteCmd], {
    encoding: 'utf8',
    timeout: timeoutMs,
    windowsHide: true,
  });
  if (r.error) return { ok: false, out: '', err: String(r.error).slice(0, 200) };
  if (r.status !== 0 && !r.stdout) return { ok: false, out: '', err: (r.stderr || `exit ${r.status}`).slice(0, 200) };
  return { ok: true, out: (r.stdout || '').trim(), err: (r.stderr || '').slice(0, 200) };
}

function nowBeijing() {
  // date 现查制：node 取本机时钟（本机=北京时间），禁推算
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function isoWeekLabel() {
  const d = new Date();
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

// ── 探针段 ──
const probes = {};

// ① 8713 healthz
{
  try {
    const r = await fetch('http://127.0.0.1:8713/healthz', { signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    const p = j.power || {};
    probes.mlc = `ok=${j.ok} uptime_s=${j.uptime} notifyFailures=${p.notifyFailures} pwr=${p.percent}% ac=${p.acOnline} gate=${p.gate}`;
  } catch (e) {
    probes.mlc = `探针失败: ${String(e).slice(0, 120)}`;
  }
}

// ② sg MMC 三探针 + 值席 pane（一管 ssh）
{
  const r = ssh(
    SG,
    `echo 'h8712:'$(curl -s -m 4 http://127.0.0.1:8712/healthz | head -c 150); echo; ` +
      `echo 'lognew:'$(ls -t --time-style='+%H:%M:%S' -l /var/lib/trimc/cron/logs/ 2>/dev/null | head -2 | tail -1 | awk '{print $6}'); ` +
      `echo 'sgnow:'$(date '+%H:%M:%S'); echo '---pane---'; su - fleet -c "tmux capture-pane -t m-duty-cos -p 2>/dev/null | tail -6"`,
    45000,
  );
  if (r.ok) {
    const m = r.out.match(/h8712:(.*)\s+lognew:(\S+)\nsgnow:(\S+)(?:[\s\S]*---pane---\n?([\s\S]*))?/);
    if (m) {
      probes.mmc = `8712${m[1]} | logs 最新=${m[2]} (sg now=${m[3]})`;
      const pane = (m[4] || '').trim();
      // 值席状态粗判：busy 动画行（✻ …）/ ❯ 空框=候令
      if (/✻|Crystallizing|Scampering|Brewing|Pondering|Forging/.test(pane)) { probes.duty = `在役·处理中（pane 动画行在）`; probes.dutyBusy = true; }
      else if (/^❯\s*$/m.test(pane) || pane.includes('❯')) { probes.duty = `在役·候令（❯ 空框）`; probes.dutyBusy = false; }
      else { probes.duty = `在役·态不明（pane 尾：${pane.split('\n').slice(-2).join(' / ').slice(0, 120)}）`; probes.dutyBusy = false; }
    } else {
      probes.mmc = `读数解析失败: ${r.out.slice(0, 150)}`;
      probes.duty = '解析失败';
    }
  } else {
    probes.mmc = `ssh 失败: ${r.err}`;
    probes.duty = 'ssh 失败不可判';
  }
}

// ③ 河源 8711 + trirmc
{
  const r = ssh(
    RHY,
    `echo 'r8711:'$(curl -s -m 4 -w '%{http_code}' -o /dev/null http://127.0.0.1:8711/healthz); echo 'trirmc:'$(systemctl is-active trirmc 2>/dev/null)`,
    30000,
  );
  probes.rhy = r.ok ? r.out.replace(/\n/g, ' | ') : `ssh 失败: ${r.err}`;
}

// ④ 大表计数
{
  try {
    const raw = JSON.parse(readFileSync(`${REPO}/docs/workflow/hub-state/in-progress.json`, 'utf8'));
    const items = Array.isArray(raw) ? raw : raw.tasks || raw.items || Object.values(raw)[0];
    const open = items.filter((i) => i.status === 'open');
    probes.board = `total=${items.length} open=${open.length}`;
  } catch (e) {
    probes.board = `读失败: ${String(e).slice(0, 100)}`;
  }
}

// ── 拍报组装 ──
const ts = nowBeijing();
const seats = scanLocalSeats();
const activeLocal = seats.active || [];
const dutyBusy = probes.dutyBusy === true;
const totalBusy = activeLocal.length + (dutyBusy ? 1 : 0);
const seatLine = seats.err
  ? `本机席扫描失败（${seats.err}）`
  : activeLocal.length ? `本机在干活：${activeLocal.join('、')}` : '本机 12 席全空闲';
const L = [];
L.push(`**节拍（daemon 版）${ts}**`);
L.push('');
L.push(`**⓪ 全席现态（13 席）**：${totalBusy > 0 ? `**非空闲·${totalBusy} 席在干活**` : '全席空闲'}——${seatLine}；sg 值席=${probes.duty}`);
L.push('');
L.push(`**① 双树**：sg 试水树=done 收口（认账毕）；LG-066=v3 生效态候 17:50 窗`);
L.push(`**② 三链**：8713 ${probes.mlc}`);
L.push(`　　TriRMC/TriRLC（河源）：${probes.rhy}`);
L.push(`**③ MMC**：${probes.mmc}`);
L.push(`**④ 大表**：${probes.board}`);
L.push(`**⑤ 卡什么**：（daemon 版无信件面，事件面以拍报差异与本机席转录为准）`);
const report = L.join('\n') + '\n';

// ── 落盘 ──
const week = isoWeekLabel();
const dir = `${REPO}/docs/workflow/operating-records/${week}/trees/bod-tick`;
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/tick-latest.md`, report, 'utf8');
appendFileSync(`${dir}/tick-log-${ts.slice(0, 10)}.md`, report + '\n', 'utf8');
console.log(`[bod-tick] ${ts} report written -> ${dir}/tick-latest.md`);
