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

// ssh 绝对路径——daemon 环境（TriMLC cron 执行体）PATH 无 ssh，spawnSync 'ssh' ENOENT（11:40 拍实证；首修 11:54 未 commit 被并行 git 操作洗掉·14:37 拍复发实证=未提交修复必洗，当场 commit）
const SSH_EXE = 'C:/Program Files/Git/usr/bin/ssh.exe';
// spawnSync 数组参数不过本地 shell——远端命令原样交 ssh，零引号地狱
function ssh(host, remoteCmd, timeoutMs = 40000) {
  const r = spawnSync(SSH_EXE, ['-o', 'ConnectTimeout=12', host, remoteCmd], {
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

// ② sg MMC 三探针 + m-duty-* 全组 pane（一管 ssh；CEO 11:00 令：重点=duty 组谁在干活，自动发现非硬编码）
{
  const r = ssh(
    SG,
    `echo 'h8712:'$(curl -s -m 4 http://127.0.0.1:8712/healthz | head -c 150); echo; ` +
      `echo 'lognew:'$(ls -t --time-style='+%H:%M:%S' -l /var/lib/trimc/cron/logs/ 2>/dev/null | head -2 | tail -1 | awk '{print $6}'); ` +
      `echo 'sgnow:'$(date '+%H:%M:%S'); echo '---duty---'; ` +
      `for s in $(su - fleet -c "tmux ls -F '#S'" 2>/dev/null | grep '^m-duty-'); do echo "===SEAT:$s==="; su - fleet -c "tmux capture-pane -t $s -p 2>/dev/null | tail -6"; done`,
    45000,
  );
  if (r.ok) {
    const m = r.out.match(/h8712:(.*)\s+lognew:(\S+)\nsgnow:(\S+)(?:[\s\S]*---duty---\n?([\s\S]*))?/);
    if (m) {
      probes.mmc = `8712${m[1]} | logs 最新=${m[2]} (sg now=${m[3]})`;
      // m-duty-* 全组逐席判态（CEO 11:00 令：duty 组为重点）
      // 判据（11:17 勘）：尾 6 行有 ❯ 行=候令（输入框在底）；✻ 行须排除「Brewed for」完成行（过去式≠在干活）
      const paneState = (pane) => {
        const tail = pane.split('\n').slice(-6).join('\n');
        if (/^❯/m.test(tail)) return { label: '候令', busy: false };
        if (/✻/.test(tail) && !/✻\s*\S+ed for/.test(tail)) return { label: '处理中', busy: true };
        if (/✻/.test(tail)) return { label: '完成待命', busy: false };
        return { label: `态不明（尾：${tail.split('\n').slice(-2).join(' / ').slice(0, 80)}）`, busy: false };
      };
      const dutySeg = (m[4] || '').trim();
      const dutyParts = [];
      let dutyBusyAny = false;
      if (dutySeg) {
        const blocks = dutySeg.split(/^===SEAT:(m-duty-[^=\n]+)===$/m);
        for (let i = 1; i + 1 < blocks.length; i += 2) {
          const st = paneState(blocks[i + 1].trim());
          dutyParts.push(`${blocks[i].trim()}=${st.label}`);
          if (st.busy) dutyBusyAny = true;
        }
      }
      probes.duty = dutyParts.length ? dutyParts.join('·') : (dutySeg ? `段解析失败（${dutySeg.slice(0, 80)}）` : '无 m-duty-* 会话');
      probes.dutyBusy = dutyBusyAny;
    } else {
      probes.mmc = `读数解析失败: ${r.out.slice(0, 150)}`;
      probes.duty = '解析失败';
      probes.dutyBusy = false;
    }
  } else {
    probes.mmc = `ssh 失败: ${r.err}`;
    probes.duty = 'ssh 失败不可判';
    probes.dutyBusy = false;
  }
}

// ③ 本机 8711（TriRLC·R面本地域·11:27 CEO 勘正后改位）+ 河源 trirmc（服务域）
{
  try {
    const r = await fetch('http://127.0.0.1:8711/healthz', { signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    probes.rlc = `ok=${j.ok} uptime_h=${Math.round((j.uptime || 0) / 3600)} cron=${j.cron?.jobCount ?? '?'} mc_link=${j.mc_link}`;
  } catch (e) {
    probes.rlc = `探针失败: ${String(e).slice(0, 120)}`;
  }
  const r = ssh(RHY, `echo 'trirmc:'$(systemctl is-active trirmc 2>/dev/null)`, 30000);
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
const dutyLine = `**sg duty 组（重点）**：${probes.duty}`;
const localLine = seats.err
  ? `本地 12 席扫描失败（${seats.err}）`
  : activeLocal.length ? `本地在干活：${activeLocal.join('、')}` : '本地 12 席全空闲';
const L = [];
L.push(`**节拍（daemon 版）${ts}**`);
L.push('');
L.push(`**⓪ 全席现态**：${totalBusy > 0 ? `**非空闲·${totalBusy} 席在干活**` : '全席空闲'}——${dutyLine}；${localLine}（附注）`);
L.push('');
L.push(`**① 双树**：sg 试水树=done 收口（认账毕）；LG-066=v3 生效态候 17:50 窗`);
L.push(`**② 四口**：8713 TriMLC ${probes.mlc}`);
L.push(`　　8711 TriRLC（本机·R面本地域）：${probes.rlc}`);
L.push(`　　河源 TriRMC（服务域）：${probes.rhy}`);
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
