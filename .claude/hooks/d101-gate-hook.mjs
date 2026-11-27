#!/usr/bin/env node
// D-101 权限闸与纪律机械闸 · PreToolUse 挂载 wrapper（hook 协议适配层）
// 令源：CEO 2026-11-28 00:35 令「纪律逃逸→机械拦截联动」（D-102·CAO 通知二·BOD 流转）
// 正身：TriCompany/scripts/ops/gate/d101-denied-retry-gate.mjs（判定·transcript 增量扫描·模式常量·自测·留痕）
// 职责：PreToolUse envelope(JSON) → 工具属 {Bash,PowerShell,Write,Edit} 时把 envelope 原样喂正身闸（stdin 管道）→ 转发退出码
// 退出码：2=BLOCK（stderr=拦截理由·模型可见当场退回）· 1=WARN（observe 留痕放行·用户可见）· 0=PASS
// 范围：只读本会话自己的 transcript（envelope.transcript_path）·不读他席会话
// 失效姿态：闸正身不可达=fail-open+stderr 显著留痕（纪律闸非权限闸·故障不停摆全席工具面）
// ⚠挂载=写项目 .claude/settings.json 的 hooks（权限/配置面）——须 CEO 直接确认·本件入库≠已挂载
// —— CTO 小狄 2026-11-28（D-46 零值面）

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GATE_REL = ['..', 'TriCompany', 'scripts', 'ops', 'gate', 'd101-denied-retry-gate.mjs'];
const TOOLS = new Set(['Bash', 'PowerShell', 'Write', 'Edit']);

function locateGate() {
  const candidates = [];
  const here = dirname(fileURLToPath(import.meta.url)); // <repo>/.claude/hooks
  if (process.env.TRI_COMPANY_ROOT) {
    candidates.push(resolve(process.env.TRI_COMPANY_ROOT, 'scripts', 'ops', 'gate', 'd101-denied-retry-gate.mjs'));
  }
  candidates.push(resolve(here, '..', '..', ...GATE_REL)); // 主检出形
  if (process.env.CLAUDE_PROJECT_DIR) {
    candidates.push(resolve(process.env.CLAUDE_PROJECT_DIR, ...GATE_REL)); // env 形（备）
  }
  candidates.push(resolve(here, '..', '..', '..', ...GATE_REL)); // worktree 深度形
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

function runGate(envelope, extraEnv) {
  const gatePath = locateGate();
  if (!gatePath) return { missing: true };
  const r = spawnSync(process.execPath, [gatePath], { input: envelope, encoding: 'utf8', timeout: 20000, env: extraEnv ? { ...process.env, ...extraEnv } : process.env });
  if (r.error) return { missing: true, error: r.error.message };
  return { status: r.status, stderr: (r.stderr || '').trim(), missing: false };
}

// ---------- 自测（挂载面：工具门控+envelope 透传+退出码转发+fail-open） ----------
function selftest() {
  const T = join(process.env.TEMP || '.', 'cto-d101-selftest', 'same.jsonl');
  if (!existsSync(T)) { console.log('SELFTEST-HOOK SKIP（正身自测样本未生成·先跑 node d101-denied-retry-gate.mjs --selftest）'); process.exit(0); }
  const env = (tool, input) => JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: tool, tool_input: input, cwd: 'D:\\Code\\ai\\TriMetaverse', transcript_path: T, session_id: 'selftest' });
  const cases = [
    ['同目标换工具·observe=退 1', env('PowerShell', { command: "Remove-Item -Recurse -Force 'D:\\Code\\ai\\TriCompany\\TriMetaverse'" }), 1],
    ['非破坏性 Bash=退 0', env('Bash', { command: 'ls docs' }), 0],
    ['范围外工具（Read）=退 0', JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Read', tool_input: { file_path: 'x' } }), 0],
    ['非 JSON envelope=退 0', 'not-json', 0],
  ];
  let fail = 0;
  for (const [name, envelope, want] of cases) {
    let got = 0;
    try {
      const obj = JSON.parse(envelope);
      if (TOOLS.has(obj.tool_name)) { const r = runGate(envelope, { TRI_GATE_LOG_DIR: join(process.env.TEMP || '.', 'cto-d101-selftest') }); got = r.missing ? 1 : r.status; } // 自测日志/状态写临时目录
    } catch { got = 0; }
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

let gated = false;
try { const obj = JSON.parse(envelope); gated = !!obj && TOOLS.has(obj.tool_name); } catch { gated = false; }
if (!gated || !envelope) process.exit(0); // 只对破坏性动词族可能出现的工具面负责

const r = runGate(envelope);
if (r.missing) {
  console.error(`[d101-gate] 闸正身不可达（TriCompany gate 缺失${r.error ? '·' + r.error : ''}）——放行+留痕·请报 CTO 修复`);
  process.exit(1);
}
if (r.status === 2) { console.error(r.stderr); process.exit(2); }
if (r.status === 1) { console.error(`[d101-gate WARN·已放行] ${r.stderr}`); process.exit(1); }
process.exit(0);
