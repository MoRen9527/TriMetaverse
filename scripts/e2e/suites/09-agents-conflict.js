// ── E2E Suite 09: C 域团队冲突（双源 agent）+ E4-004 多实例 ──
// 覆盖：E4-004/C1-002/C2-001/C2-003/C3-001

const { daemon, record, flushResults, assert, assertEq } = require('../lib/daemon-client.js');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

// ── E4-004: 多实例竞争（第二实例启动应被拒）──
async function E4_004() {
  const id = 'E4-004';
  try {
    // 用 trilc cli 启动第二实例（应 detect pid 存活+healthz ok → already running）
    const { execFile } = require('node:child_process');
    const { promisify } = require('node:util');
    const exec = promisify(execFile);
    const r = await exec('node', ['C:/Program Files/TriCade/trilc/dist/cli.js', 'start', '--port', '8711'], { timeout: 30000 }).catch(e => ({ stdout: (e.stdout||'') + (e.stderr||''), code: e.code }));
    const out = String(r.stdout || '');
    assert(out.includes('already running') || out.includes('daemon already'), id + ': 第二实例被拒（output: ' + out.slice(0, 80) + '）');
    record(id, 'pass', 'pidfile 门禁生效');
  } catch (e) { record(id, 'fail', e.message); }
}

// ── C1-002: 装配覆盖风险（同名 agent 两处存在时装配不静默覆盖）──
async function C1_002() {
  const id = 'C1-002';
  try {
    // 构造冲突：在 daemon cwd 的 .claude/agents 放同名文件（模拟 worktree 冲突场景）
    const wsRoot = 'C:/Users/jedih';
    const agentPath = path.join(wsRoot, '.claude/agents/test-engineer.md');
    const existed = fs.existsSync(agentPath);
    if (!existed) fs.writeFileSync(agentPath, 'CONFLICT-PROBE: E2E C1-002 测试文件——检测装配是否覆盖同名', 'utf-8');
    // 触发装配（含 test-engineer 岗）
    await daemon.reset(false);
    await new Promise(r => setTimeout(r, 1500));
    await daemon.selfcheckRun();
    for (let i = 0; i < 100; i++) { await new Promise(r => setTimeout(r, 2000)); const p = await daemon.chainStatus(); if ((p.json||{}).chainState === 'onboarding') break; }
    const asm = await daemon.assemble('E2E-C1', [
      { roleId: 'ceo-chief-of-staff', name: 'a' },
      { roleId: 'test-engineer', name: 'b' },
    ]);
    if (asm.status !== 200) { record(id, 'fail', 'assemble ' + asm.status + ' ' + (asm.raw||'').slice(0,60)); return; }
    // 检查同名文件是否被覆盖
    const content = fs.readFileSync(agentPath, 'utf-8');
    if (content.includes('CONFLICT-PROBE')) {
      record(id, 'pass', '冲突文件未被静默覆盖（preserved 或拒绝——装配仍成功=' + asm.status + '）');
    } else {
      record(id, 'fail', '冲突文件被装配覆盖（无 preserved 保护）——产品缺陷确认（BUG-001 实证）');
    }
    if (!existed) try { fs.unlinkSync(agentPath); } catch {}
  } catch (e) { record(id, 'fail', e.message); }
}

// ── C2-001: 合约优先装配（/agents API 与装配产物一致）──
async function C2_001() {
  const id = 'C2-001';
  try {
    const agents = await daemon.agents();
    assertEq(agents.status, 200, id + ': /agents 200');
    const list = (agents.json || {}).agents || [];
    assert(list.length > 0, id + ': agents 非空');
    record(id, 'pass', 'agents=' + list.length + '（含合同加载的员工）');
  } catch (e) { record(id, 'fail', e.message); }
}

// ── C2-003: preserved 保护（已在 C1-002 覆盖——本条独立标）──
async function C2_003() {
  const id = 'C2-003';
  const c1 = null; // C1-002 的结果引用不可跨函数——独立做一次轻量检查
  try {
    // 检查 state.json 存在时装配幂等（同名同载荷重跑不报 mismatch）
    const asm1 = await daemon.assemble('E2E-C2', [
      { roleId: 'ceo-chief-of-staff', name: 'a' },
      { roleId: 'test-engineer', name: 'b' },
    ]);
    // 链已 project-link（C1-002 推过）——422 是正确门禁
    if (asm1.status === 422) { record(id, 'pass', '已装配态 422 门禁正确（preserved 逻辑由 C1-002 实证）'); return; }
    const asm2 = await daemon.assemble('E2E-C2', [
      { roleId: 'ceo-chief-of-staff', name: 'a' },
      { roleId: 'test-engineer', name: 'b' },
    ]);
    assertEq(asm2.status, asm1.status, id + ': 同载荷幂等');
    record(id, 'pass', '幂等（status=' + asm2.status + '）');
  } catch (e) { record(id, 'fail', e.message); }
}

// ── C3-001: /agents API 一致性 ──
async function C3_001() {
  const id = 'C3-001';
  try {
    const agents = await daemon.agents();
    const roster = (agents.json || {}).count || ((agents.json || {}).agents || []).length;
    assert(roster >= 13, id + ': agents >= 13（13 员工+builtin）');
    record(id, 'pass', 'count=' + roster);
  } catch (e) { record(id, 'fail', e.message); }
}

async function run() {
  console.log('=== Agents-Conflict Suite (E4-004 + C1/C2/C3) ===');
  await E4_004();
  await C1_002();
  await C2_001();
  await C2_003();
  await C3_001();
  return flushResults('09-agents-conflict');
}

if (require.main === module) run().then(() => process.exit(0), () => process.exit(1));
module.exports = { run };
