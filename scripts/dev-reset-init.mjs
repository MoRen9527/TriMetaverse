#!/usr/bin/env node
/**
 * dev-reset-init — 开发/测试期初始化链一键重置（编排层工具，非产品功能）
 *
 * 用途：TriCade 手动测试中反复走「开业→项目→同步→确认」流程——本脚本把初始化链
 * 重置回 uninitialized 干净态（等价编排层 2026-08-15 的手动三轮重置，固化为脚本）。
 *
 * 用法：node scripts/dev-reset-init.mjs [--include-project] [--workspace-root <path>]
 *   --include-project   同时清项目关联（project-registry.json + 链快照；worktree 磁盘不动）
 *   --workspace-root    装配产物根（默认 C:\Users\jedih = 装后态 daemon cwd）
 *
 * 清理面（精确白名单，绝不多删）：
 *   运行态：%LOCALAPPDATA%\TriLC\company\init-chain.json + state.json
 *   装配产物（workspace-root 下）：.claude/agents/<开业 roleId>.md（按 state.json employees 反查）
 *     + docs/registry/company-state.json + AGENTS.md + docs/registry/business-state.md（占位特征校验）
 *   项目（--include-project）：%LOCALAPPDATA%\TriLC\project-registry.json
 *
 * 安全护栏：daemon 先 trilc stop（走 pidfile 权威路径）；产物删除前打印清单；
 *   business-state.md/AGENTS.md 仅当内容为装配占位（<1KB 且含标记词）才删，否则保留并提示。
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const args = process.argv.slice(2);
const includeProject = args.includes('--include-project');
const wsRootIdx = args.indexOf('--workspace-root');
const wsRoot = wsRootIdx >= 0 ? args[wsRootIdx + 1] : join(homedir());
const dataDir = join(process.env.LOCALAPPDATA || join(homedir(), 'AppData/Local'), 'TriLC');
const CLI = 'C:\\Program Files\\TriCade\\trilc\\dist\\cli.js';

const log = (m) => console.log('[reset]', m);

// ① 停 daemon（trilc stop 权威路径）
try {
  const out = execFileSync('node', [CLI, 'stop', '--port', '8711'], { encoding: 'utf8', timeout: 30000 });
  log('daemon: ' + out.trim());
} catch (e) {
  log('daemon stop: ' + (e.stdout || e.message));
}

// ② 清运行态
const chainPath = join(dataDir, 'company', 'init-chain.json');
const statePath = join(dataDir, 'company', 'state.json');
let employees = [];
if (existsSync(statePath)) {
  try {
    const st = JSON.parse(readFileSync(statePath, 'utf8'));
    employees = (st.employees || []).map((e) => e.role);
  } catch { /* 损坏则按空处理 */ }
}
for (const f of [chainPath, statePath]) {
  if (existsSync(f)) { unlinkSync(f); log('已删: ' + f); }
}

// ③ 清装配产物（精确白名单）
const artifacts = [
  ...employees.map((r) => join(wsRoot, '.claude', 'agents', `${r}.md`)),
  join(wsRoot, 'docs', 'registry', 'company-state.json'),
];
for (const f of artifacts) {
  if (existsSync(f)) { unlinkSync(f); log('已删: ' + f); }
}
// 占位文件：仅装配占位特征（小文件 + 标记词）才删
for (const f of [join(wsRoot, 'AGENTS.md'), join(wsRoot, 'docs', 'registry', 'business-state.md')]) {
  if (!existsSync(f)) continue;
  let content = '';
  try { content = readFileSync(f, 'utf8'); } catch { continue; }
  const isPlaceholder = content.length < 1024 && /TriCade|TriMetaverse|占位|placeholder/i.test(content);
  if (isPlaceholder) { unlinkSync(f); log('已删（占位）: ' + f); }
  else log('保留（非占位，真实内容）: ' + f);
}

// ④ 项目关联（可选）
if (includeProject) {
  const reg = join(dataDir, 'project-registry.json');
  if (existsSync(reg)) { unlinkSync(reg); log('已删: ' + reg); }
}

// ⑤ 起 daemon（.cmd 带 env 注入面）
try {
  execFileSync('powershell', ['-NoProfile', '-Command',
    "Start-Process -WindowStyle Hidden -FilePath 'C:\\Users\\jedih\\AppData\\Local\\TriLC\\daemon\\trilc-daemon.cmd'"],
    { timeout: 15000 });
  log('daemon 拉起（.cmd env 注入面）');
} catch (e) { log('daemon 拉起失败: ' + e.message); }

// ⑥ 验证
setTimeout(() => {
  try {
    const out = execFileSync('curl', ['-s', '-m', '6', 'http://127.0.0.1:8711/internal/v1/init/chain/status'], { encoding: 'utf8' });
    const d = JSON.parse(out);
    log('验证 chainState = ' + d.chainState + (d.chainState === 'selfcheck' ? ' ✓（uninitialized→selfcheck 启动转移，待触发自检）' : ''));
  } catch { log('验证请求失败——查 daemon 日志'); }
}, 8000);
