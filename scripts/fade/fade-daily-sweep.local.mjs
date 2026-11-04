// fade-daily-sweep.mjs — fade011-ew 凌晨窗形态单发脚本（30s watch 退役后的形态承接）
// 机位区隔：本文件=.local 副本（本机 8713 TriMLC 形·源形 bf414156d）——禁 sg 化覆盖本文件；sg 形=兄弟文件 fade-daily-sweep.mjs（sg 8712 面·CTO 裁 fade-sweep-8713-enoent-ruling 案②）

// 令源: CTO 实施单 2026-11-04T06:04:43Z（三项之一·脚本）·形态勘定正身:
//   docs/workflow/operating-records/2026-W45/trees/fade011-ew-daily-form/cto-survey-closeout.md §二
// 语义: POST /internal/v1/fade/runs（app.ts L1975 端点·body={runId,treeDir}·同步驱动至终态返回）
// runId: fade011-daily-<YYYYMMDD-HHMMSS>（+0800 时区·时分秒粒度=手动重跑各成一树）
// treeDir: 现行 ISO 周 operating-records 树（与 operating-records 周目录命名同构·ISO 周一为首日）
// D-46: token 从启动器 cmd 提取→变量→请求头直灌·值面零回显（stdout 只落状态码面）
// R4.3: 全部时刻进程内计算（零 spawn date）
import { readFileSync } from 'node:fs';

const CMD_FILE = 'C:/Users/jedih/AppData/Local/trimlc-daemon-channel.cmd';
const OP_ROOT = 'D:/Code/ai/TriMetaverse/docs/workflow/operating-records';
const PORT = 8713;

// +0800 固定偏移取北京时间分量（YYYYMMDD-HHMMSS）
function stampCST(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  const t = new Date(d.getTime() + 8 * 3600_000);
  return `${t.getUTCFullYear()}${p(t.getUTCMonth() + 1)}${p(t.getUTCDate())}-${p(t.getUTCHours())}${p(t.getUTCMinutes())}${p(t.getUTCSeconds())}`;
}

// ISO 8601 周（2026-W45 形·周一首日·W01=含当年第一个周四的那周）——operating-records 周目录同构
function isoWeekString(d = new Date()) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayNum = (t.getDay() + 6) % 7;
  t.setDate(t.getDate() - dayNum + 3);
  const isoYear = t.getFullYear();
  t.setDate(t.getDate() - 3);
  const jan4 = new Date(isoYear, 0, 4);
  const week1Mon = new Date(isoYear, 0, 4 - ((jan4.getDay() + 6) % 7));
  const week = 1 + Math.round((t.getTime() - week1Mon.getTime()) / 604_800_000);
  return `${isoYear}-W${String(week).padStart(2, '0')}`;
}

const suffix = stampCST();
const runId = `fade011-daily-${suffix}`;
const treeDir = `${OP_ROOT}/${isoWeekString()}/trees/fade011-ew-runs/fade011-daily-${suffix}`;

// token 提取（启动器先例形·值只进变量不进打印路径）
const cmdText = readFileSync(CMD_FILE, 'utf-8');
const m = cmdText.match(/^set TRILC_INTERNAL_TOKEN=(.+)$/m);
if (!m) {
  console.error('token-extract-fail (no TRILC_INTERNAL_TOKEN line in launcher cmd)');
  process.exit(1);
}
const token = m[1].trim();

let res, body = {};
try {
  res = await fetch(`http://127.0.0.1:${PORT}/internal/v1/fade/runs`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-internal-token': token },
    body: JSON.stringify({ runId, treeDir }),
  });
  body = await res.json().catch(() => ({}));
} catch (err) {
  console.error(`request-fail: ${err.message}`);
  process.exit(1);
}

// stdout 读数行（HTTP 码+created+finalState·D-46 值面零回显）
console.log(`runId=${runId} http=${res.status} created=${body.created} finalState=${body.finalState} gated=${body.gated} error=${body.error ?? '-'}`);
process.exit(res.status === 200 ? 0 : 1);
