#!/usr/bin/env node
// D-47 时刻纪律机械闸 · SendMessage PreToolUse 挂载 wrapper（hook 协议适配层）
// 令源：CEO 2026-10-22 11:18 裁语「挂」（BOD 流转·裁语锚 08cbcb3c2 dev+sg bare 双验绿）
// 正身：TriCompany/scripts/ops/gate/d47-timestamp-gate.mjs（v1 · d62fa1474 · 零改）
//       派工源=COO 2026-10-21 19:22:15 派工单（承 CAO 二十四案终判）
// 职责：PreToolUse envelope(JSON) → 抽 tool_input.message → spawn 正身闸（stdin 管道·闸内 new Date()=现查时刻）→ 转发退出码
// 退出码：2=BLOCK（stderr=拦截理由，模型可见并当场改正重发）· 1=WARN（stderr 留痕放行·用户可见）· 0=PASS
// 失效姿态：闸正身不可达=fail-open+stderr 显著留痕（纪律闸非权限闸·故障不停摆全席通信·留痕保证可见可修）
// 路径解析：本件随仓 git 面——双机同构（本机 D:/Code/ai ↔ sg /srv/fleet）由 repo 相对位自解，双机零分支
// —— CTO 小狄 2026-10-22（D-46 零值面·家族二十五案谱系）

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GATE_REL = ['..', 'TriCompany', 'scripts', 'ops', 'gate', 'd47-timestamp-gate.mjs'];

function locateGate() {
  const candidates = [];
  const here = dirname(fileURLToPath(import.meta.url)); // <repo>/.claude/hooks
  candidates.push(resolve(here, '..', '..', ...GATE_REL)); // repo 根起推（主形）
  if (process.env.CLAUDE_PROJECT_DIR) {
    candidates.push(resolve(process.env.CLAUDE_PROJECT_DIR, ...GATE_REL)); // env 形（备）
  }
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

function runGate(message, nowArg) {
  const gatePath = locateGate();
  if (!gatePath) return { missing: true };
  const args = nowArg ? [gatePath, '--now', nowArg] : [gatePath];
  const r = spawnSync(process.execPath, args, { input: message, encoding: 'utf8', timeout: 10000 });
  return { status: r.status, stderr: (r.stderr || '').trim(), missing: false };
}

// ---------- 自测（挂载面全链：envelope 形+退出码转发+fail-open） ----------
// 案值与 now 无关设计：违例案（掩码/未来时刻）任意当下皆命中；真值案取固定过去秒
function selftest() {
  const cases = [
    ['违例掩码(落款 11:37:3x 秒位·家族实锚形)', '落款 date 现查原值 2026-10-22 11:37:3x +0800', 2],
    ['违例倒挂(落款 23:59:59 未来)', '落款 date 现查原值 2026-10-22 23:59:59 +0800', 2],
    ['真值(固定过去秒 10:00:07)', '落款 date 现查原值 2026-10-22 10:00:07 +0800', 0],
    ['envelope 无 message 字段(放行)', null, 0],
  ];
  let fail = 0;
  for (const [name, message, want] of cases) {
    let got;
    if (message === null) {
      got = 0; // wrapper 对无 message envelope 直接放行（本件 L60 分支）
    } else {
      const r = runGate(message);
      got = r.missing ? 1 : r.status;
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

let message = null;
try {
  const obj = JSON.parse(envelope);
  const ti = obj && obj.tool_input;
  if (ti && typeof ti.message === 'string') message = ti.message;
} catch { /* 非 JSON=envelope 异常 */ }

if (message === null) {
  process.exit(0); // 无信文可判（非 SendMessage 形/空信）→ 放行（闸只对有信文面负责）
}

const r = runGate(message);
if (r.missing) {
  console.error('[d47-gate] 闸正身不可达（TriCompany gate 缺失）——放行+留痕·请报 CTO 修复');
  process.exit(1);
}
if (r.status === 2) {
  console.error(`D-47 闸拦截（退回重写）——指纹：\n${r.stderr}\n正形=写前跑 date 现查→落款整串粘贴原值→发毕重跑对表（禁手写任何时刻字符）`);
  process.exit(2);
}
if (r.status === 1) {
  console.error(`[d47-gate WARN 留痕·已放行] ${r.stderr}`);
  process.exit(1);
}
process.exit(0);
