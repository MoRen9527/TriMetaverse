// ── R+C 域并发测试 Suite ──
// 覆盖 R2-003（双入口同时 sync）、R3-003（双入口同时 reset）
// 共享 lib: daemon-client.js（daemon/trimc 客户端 + 断言 + record/flushResults）

const { daemon, assert, assertEq, record, flushResults } = require('../lib/daemon-client.js');

// ── R2-003: 双入口同时 sync（防重入 409 或幂等）──
async function R2_003() {
  const id = 'R2-003';
  try {
    // 并发触发两次 syncRun（模拟面板与 chat 同时操作）
    const [r1, r2] = await Promise.all([
      daemon.syncRun('e2e'),
      daemon.syncRun('e2e'),
    ]);

    // 预期：一个 200（成功）一个 409（Conflict，防重入）或均为 200（幂等）
    const success = (r1.status === 200 && r2.status === 409) || (r1.status === 409 && r2.status === 200);
    const idempotent = r1.status === 200 && r2.status === 200;

    assert(success || idempotent, `${id}: 并发 sync 应返回 (200+409) 或 (200+200)，实际 (${r1.status}+${r2.status})`);

    // 若均为 200，验证 bundleId 相同（幂等）
    if (idempotent) {
      assertEq(r1.json.bundleId, r2.json.bundleId, `${id}: 幂等场景 bundleId 应一致`);
      record(id, 'pass', `幂等：均 200，bundleId=${r1.json.bundleId}`);
    } else {
      const successRes = r1.status === 200 ? r1 : r2;
      record(id, 'pass', `防重入：200(${successRes.json.bundleId}) + 409`);
    }
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── R3-003: 双入口同时 reset（一成功一幂等）──
async function R3_003() {
  const id = 'R3-003';
  try {
    // 并发触发两次 reset（模拟面板与 chat 同时操作）
    const [r1, r2] = await Promise.all([
      daemon.reset(false, false),
      daemon.reset(false, false),
    ]);

    // 预期：均返回 200（幂等），chainState=selfcheck
    assertEq(r1.status, 200, `${id}: 首次 reset 应返回 200`);
    assertEq(r2.status, 200, `${id}: 二次 reset 应返回 200（幂等）`);

    // 验证 chainState=selfcheck
    assert(r1.json && r1.json.chainState === 'selfcheck', `${id}: 首次 reset chainState 应为 selfcheck`);
    assert(r2.json && r2.json.chainState === 'selfcheck', `${id}: 二次 reset chainState 应为 selfcheck`);

    record(id, 'pass', '并发 reset 幂等，chainState=selfcheck');
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── Runner ──
async function run() {
  console.log('=== Concurrent Suite (R2-003, R3-003) ===');
  await R2_003();
  await R3_003();
  return flushResults('xiaoke-e2e-gamma-concurrent');
}

if (require.main === module) {
  run().then(() => process.exit(0), () => process.exit(1));
}

module.exports = { run };
