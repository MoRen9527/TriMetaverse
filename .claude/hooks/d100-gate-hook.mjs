#!/usr/bin/env node
// D-100 工具入口纪律机械闸 · Bash PreToolUse 挂载 wrapper（hook 协议适配层）
// 令源：CEO 2026-11-28 00:35 令「纪律逃逸→机械拦截联动」（D-102·CAO 通知一·BOD 流转）
// 正身：TriCompany/scripts/ops/gate/d100-tool-entry-gate.mjs（判定·模式常量·自测·留痕）
// 职责：PreToolUse envelope(JSON) → tool_name=Bash 时抽 tool_input.command → spawn 正身闸（stdin 管道）→ 转发退出码
// 退出码：2=BLOCK（stderr=拦截理由·模型可见当场改写重发）· 1=WARN（observe 模式留痕放行·用户可见）· 0=PASS
// 失效姿态：闸正身不可达=fail-open+stderr 显著留痕（纪律闸非权限闸·故障不停摆全席工具面）
// ⚠挂载=写项目 .claude/settings.json 的 hooks（权限/配置面）——须 CEO 直接确认·本件入库≠已挂载
// —— CTO 小狄 2026-11-28（D-46 零值面）

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GATE_REL = ['..', 'TriCompany', 'scripts', 'ops', 'gate', 'd100-tool-entry-gate.mjs'];

function locateGate() {
  const candidates = [];
  const here = dirname(fileURLToPath(import.meta.url)); // <repo>/.claude/hooks
  if (process.env.TRI_COMPANY_ROOT) {
    candidates.push(resolve(process.env.TRI_COMPANY_ROOT, 'scripts', 'ops', 'gate', 'd100-tool-entry-gate.mjs'));
  }
  candidates.push(resolve(here, '..', '..', ...GATE_REL)); // 主检出形
  if (process.env.CLAUDE_PROJECT_DIR) {
    candidates.push(resolve(process.env.CLAUDE_PROJECT_DIR, ...GATE_REL)); // env 形（备）
  }
  candidates.push(resolve(here, '..', '..', '..', ...GATE_REL)); // worktree 深度形
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

function runGate(command, cwd, noLog) {
  const gatePath = locateGate();
  if (!gatePath) return { missing: true };
  const args = [gatePath, '--cwd', cwd || ''];
  if (noLog) args.push('--no-log'); // 自测不污染生产闸日志；真实挂载运行=留痕
  const r = spawnSync(process.execPath, args, { input: command, encoding: 'utf8', timeout: 10000 });
  if (r.error) return { missing: true, error: r.error.message };
  return { status: r.status, stderr: (r.stderr || '').trim(), stdout: (r.stdout || '').trim(), missing: false };
}

// ---------- 自测（挂载面：envelope 抽取+退出码转发+fail-open） ----------
function selftest() {
  const env = (tool, command) => JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: tool, tool_input: { command, file_path: 'x' }, cwd: 'D:\\Code\\ai\\TriMetaverse', session_id: 'selftest' });
  const cases = [
    ['Bash 内嵌 powershell·observe=退 1', env('Bash', 'powershell -File x.ps1'), 1],
    ['Bash 无 5.1=退 0', env('Bash', 'pwsh -NoProfile -File x.ps1'), 0],
    ['非 Bash 工具=退 0（不过闸）', env('PowerShell', 'powershell -File x.ps1'), 0],
    ['envelope 无 command=退 0', JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: {} }), 0],
    ['非 JSON envelope=退 0', 'not-json', 0],
  ];
  let fail = 0;
  for (const [name, envelope, want] of cases) {
    let got;
    let obj = null;
    try { obj = JSON.parse(envelope); } catch { got = 0; }
    if (obj) {
      const ti = obj.tool_input;
      if (obj.tool_name !== 'Bash' || !ti || typeof ti.command !== 'string') got = 0;
      else { const r = runGate(ti.command, obj.cwd, true); got = r.missing ? 1 : r.status; }
    }
    const ok = got === want;
    if (!ok) fail++;
    console.log(`${ok ? 'ok ' : 'FAIL'} [${name}] want=${want} got=${got}`);
  }
  console.log(fail ? `SELFTEST-HOOK FAIL (${fail})` : 'SELFTEST-HOOK ALL PASS');
  process.exit(fail ? 2 : 0);
}

if (process.argv.includes('--selftest')) selftest();

// ---------- hook 主路径 ----------

let envelope = '';
try { envelope = readFileSync(0, 'utf8'); } catch { /* stdin 空 */ }

let command = null;
let cwd = '';
try {
  const obj = JSON.parse(envelope);
  const ti = obj && obj.tool_input;
  if (obj && obj.tool_name === 'Bash' && ti && typeof ti.command === 'string') { command = ti.command; cwd = obj.cwd || ''; }
} catch { /* 非 JSON=envelope 异常 */ }

if (command === null) process.exit(0); // 只对 Bash 命令面负责

const r = runGate(command, cwd);
if (r.missing) {
  console.error(`[d100-gate] 闸正身不可达（TriCompany gate 缺失${r.error ? '·' + r.error : ''}）——放行+留痕·请报 CTO 修复`);
  process.exit(1);
}
if (r.status === 2) {
  console.error(r.stderr);
  process.exit(2);
}
if (r.status === 1) {
  console.error(`[d100-gate WARN·已放行] ${r.stderr}`);
  process.exit(1);
}
process.exit(0);
