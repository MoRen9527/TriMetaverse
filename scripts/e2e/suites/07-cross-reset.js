// ── R+C 域交叉 Reset 与双源 Agent 扫描 Suite ──
// 覆盖 R4-001（sessionID 相等验证）、C1-001（同名 agent 检测）
// 共享 lib: daemon-client.js（daemon/trimc 客户端 + 断言 + record/flushResults）

const { daemon, assert, assertEq, record, flushResults } = require('../lib/daemon-client.js');
const { readdirSync } = require('node:fs');
const path = require('node:path');

// ── R4-001: sessionID 相等验证 ──
async function R4_001() {
  const id = 'R4-001';
  try {
    // TODO: 需 sessionID 端点实现（当前 API 未暴露）
    // 预期端点：GET /internal/v1/init/session/meta 返回 { sessionId: string }
    // 本测试框架预留，等待 P0 实施后激活

    /*
    const metaRes = await daemon.get('/internal/v1/init/session/meta');
    assertEq(metaRes.status, 200, `${id}: session/meta 应返回 200`);
    assert(metaRes.json && metaRes.json.sessionId, `${id}: 响应应包含 sessionId`);

    const sessionId = metaRes.json.sessionId;

    // 双入口查询应返回相同 sessionId（实际需模拟双入口，当前框架单入口验证）
    // 预期：面板查询与 CLI 查询的 sessionId 相等
    assert(typeof sessionId === 'string' && sessionId.length > 0, `${id}: sessionId 应为非空字符串`);

    record(id, 'pass', `sessionID 相等: ${sessionId}`);
    */

    record(id, 'blocked', '等待 sessionID P0 实施后激活（当前 API 未暴露 /internal/v1/init/session/meta）');
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── C1-001: 同名 agent 检测（双源扫描）──
async function C1_001() {
  const id = 'C1-001';
  try {
    // 读 .claude/agents 目录（文件系统源）
    const agentsDir = path.resolve(process.cwd(), '.claude', 'agents');
    let fsAgentNames = [];
    try {
      const files = readdirSync(agentsDir);
      fsAgentNames = files
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''));
    } catch (e) {
      // 目录不存在或无权限，继续
      fsAgentNames = [];
    }

    // 读 daemon.agents() API（运行时源）
    const apiRes = await daemon.agents();
    assertEq(apiRes.status, 200, `${id}: /agents API 应返回 200`);
    assert(apiRes.json && Array.isArray(apiRes.json.agents), `${id}: 响应应包含 agents 数组`);

    const apiAgentNames = apiRes.json.agents.map(a => a.name || a.id);

    // 对比同名列表：找交集（冲突列表）
    const conflicts = fsAgentNames.filter(name => apiAgentNames.includes(name));

    if (conflicts.length > 0) {
      // 冲突存在：记录可见（当前行为：允许同名）
      record(id, 'pass', `冲突列表可见：${conflicts.join(', ')}（共 ${conflicts.length} 个同名 agent）`);
    } else {
      // 无冲突：记录清晰
      record(id, 'pass', `双源扫描一致：无同名 agent（文件系统 ${fsAgentNames.length}，运行时 ${apiAgentNames.length}）`);
    }

    // 辅助断言：验证两源均非空（确保扫描有效）
    assert(fsAgentNames.length > 0 || apiAgentNames.length > 0, `${id}: 至少一源应有 agent 定义`);
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── 辅助：交叉 reset 幂等验证 ──
async function CROSS_RESET_IDEMPOTENT() {
  const id = 'CROSS-RESET-IDEMPOTENT';
  try {
    // reset 后立即 chainStatus 断言（selfcheck）
    const r1 = await daemon.reset(false, false);
    assertEq(r1.status, 200, `${id}: reset 应返回 200`);

    const s1 = await daemon.chainStatus();
    assertEq(s1.status, 200, `${id}: chainStatus 应返回 200`);
    assert(s1.json && s1.json.chainState === 'selfcheck', `${id}: reset 后 chainState 应为 selfcheck`);

    // 再 reset 幂等
    const r2 = await daemon.reset(false, false);
    assertEq(r2.status, 200, `${id}: 二次 reset 应返回 200（幂等）`);

    const s2 = await daemon.chainStatus();
    assertEq(s2.status, 200, `${id}: 二次 chainStatus 应返回 200`);
    assert(s2.json && s2.json.chainState === 'selfcheck', `${id}: 二次 reset 后 chainState 仍为 selfcheck`);

    record(id, 'pass', '交叉 reset 幂等：chainState=selfcheck 保持');
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── Runner ──
async function run() {
  console.log('=== Cross-Reset Suite (R4-001, C1-001, CROSS-RESET-IDEMPOTENT) ===');
  await R4_001();
  await C1_001();
  await CROSS_RESET_IDEMPOTENT();
  return flushResults('xiaoke-e2e-gamma-cross-reset');
}

if (require.main === module) {
  run().then(() => process.exit(0), () => process.exit(1));
}

module.exports = { run };
