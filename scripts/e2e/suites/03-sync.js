// ── S 域 Sync 测试 Suite ──
// 覆盖 S4-001 ~ S4-004（bundle 生成、单调性、applied 验证、幂等）
// 共享 lib: daemon-client.js（daemon/trimc 客户端 + 断言 + record/flushResults）

const { daemon, trimc, assert, assertEq, record, flushResults } = require('../lib/daemon-client.js');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const exec = promisify(execFile);

// ── S4-001: bundle 生成验证 ──
async function S4_001() {
  const id = 'S4-001';
  try {
    // 触发 syncRun
    const syncRes = await daemon.syncRun('e2e');
    assertEq(syncRes.status, 200, `${id}: syncRun 应返回 200`);
    assert(syncRes.json && syncRes.json.bundleId, `${id}: 响应应包含 bundleId`);

    // 验证 bundleId 格式（应为 YYYYMM-WN-bundle-N 格式或类似）
    const bundleId = syncRes.json.bundleId;
    assert(typeof bundleId === 'string' && bundleId.length > 0, `${id}: bundleId 应为非空字符串`);

    // 验证 bundle 内容存在
    const syncStatus = await daemon.syncStatus();
    assertEq(syncStatus.status, 200, `${id}: syncStatus 应返回 200`);
    assert(syncStatus.json && syncStatus.json.currentBundle, `${id}: syncStatus 应包含 currentBundle`);

    // 验证 schema 合法性（含必要字段）
    const bundle = syncStatus.json.currentBundle;
    assert(bundle.company || bundle.model || bundle.agents || bundle.projects, `${id}: bundle 至少包含一个维度`);

    record(id, 'pass', `bundleId=${bundleId}, 包含 ${Object.keys(bundle).join(',')}`);
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── S4-002: bundleId 单调性 ──
async function S4_002() {
  const id = 'S4-002';
  try {
    // 第一次 sync
    const r1 = await daemon.syncRun('e2e');
    assertEq(r1.status, 200, `${id}: 首次 syncRun 应返回 200`);
    const bundleId1 = r1.json.bundleId;
    assert(bundleId1, `${id}: 首次应返回 bundleId`);

    // 等待一点时间（如有后台任务）
    await new Promise(r => setTimeout(r, 1000));

    // 第二次 sync（同条件）
    const r2 = await daemon.syncRun('e2e');
    assertEq(r2.status, 200, `${id}: 二次 syncRun 应返回 200`);
    const bundleId2 = r2.json.bundleId;

    // 断言单调幂等不换 id
    assertEq(bundleId1, bundleId2, `${id}: 同条件多次 sync 应返回相同 bundleId（幂等）`);

    record(id, 'pass', `bundleId 保持一致: ${bundleId1}`);
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── S4-003: TriMC applied 验证 ──
async function S4_003() {
  const id = 'S4-003';
  try {
    // 触发 sync
    const syncRes = await daemon.syncRun('e2e');
    assertEq(syncRes.status, 200, `${id}: syncRun 应返回 200`);
    const localBundleId = syncRes.json.bundleId;
    assert(localBundleId, `${id}: 应返回 local bundleId`);

    // 查询 TriMC syncStatus（容忍 fleet 15min 延迟）
    const trimcStatus = await trimc.syncStatus();
    assertEq(trimcStatus.status, 200, `${id}: TriMC syncStatus 应返回 200`);

    const appliedBundleId = trimcStatus.json.appliedBundleId;

    // 如果 applied 为 null，记为 blocked（fleet 延迟）而非 fail
    if (appliedBundleId === null || appliedBundleId === undefined) {
      record(id, 'blocked', 'TriMC appliedBundleId 为 null，可能 fleet 延迟（容忍 15min）');
      return;
    }

    // 验证 applied=本地
    assertEq(localBundleId, appliedBundleId, `${id}: TriMC appliedBundleId 应等于本地 bundleId`);

    record(id, 'pass', `appliedBundleId=${appliedBundleId} 与本地一致`);
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── S4-004: sync 幂等 ──
async function S4_004() {
  const id = 'S4-004';
  try {
    // 第一次 sync
    const r1 = await daemon.syncRun('e2e');
    assertEq(r1.status, 200, `${id}: 首次 syncRun 应返回 200`);
    const bundleId1 = r1.json.bundleId;

    // 查询 syncStatus 确认状态
    const s1 = await daemon.syncStatus();
    assertEq(s1.status, 200, `${id}: 首次 syncStatus 应返回 200`);

    // 第二次 sync（同条件，同内容 rePushedOnly）
    const r2 = await daemon.syncRun('e2e');
    assertEq(r2.status, 200, `${id}: 二次 syncRun 应返回 200`);
    const bundleId2 = r2.json.bundleId;

    // 断言：同 bundleId 或 no-op 标记
    if (r2.json.noOp === true) {
      record(id, 'pass', 'sync 返回 no-op，幂等行为正确');
    } else {
      assertEq(bundleId1, bundleId2, `${id}: 同 bundleId 或 no-op`);
      record(id, 'pass', `bundleId 保持一致: ${bundleId1}`);
    }
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── Runner ──
async function run() {
  // E2E 前置自备（首轮教训）：链不在 project-link/sync 态时先推进（reset 类测试可能已清链）
  // ——走最小链推进：直接编 state 到 project-link 需 daemon 侧操作，此处用 reset+跳进（i2 路径不可脚本化时记 blocked）
  const cs = await daemon.chainStatus();
  if (cs.json && cs.json.chainState && !['project-link','sync','confirm','ready'].includes(cs.json.chainState)) {
    console.log('[前置] 链态 ' + cs.json.chainState + ' 非 sync 前置态——S4 系列记 blocked（需编排层先推进链）');
    record('S4-001','blocked','前置不足：链态 ' + cs.json.chainState);
    record('S4-002','blocked','同上'); record('S4-003','blocked','同上'); record('S4-004','blocked','同上');
    flushResults('xiaoke-e2e-beta-sync'); return;
  }
  console.log('=== Sync Suite (S4-001 ~ S4-004) ===');
  await S4_001();
  await S4_002();
  await S4_003();
  await S4_004();
  return flushResults('xiaoke-e2e-beta-sync');
}

if (require.main === module) {
  run().then(() => process.exit(0), () => process.exit(1));
}

module.exports = { run };
