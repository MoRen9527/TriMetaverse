// ── R+C 域故障测试 Suite ──
// 框架级实现：坏 token 探测（TRILC_DATA_DIR 隔离实例）、daemon 中途杀（记录步骤断言由编排层执行）
// 共享 lib: daemon-client.js（daemon/trimc 客户端 + 断言 + record/flushResults）

const { daemon, assert, assertEq, record, flushResults } = require('../lib/daemon-client.js');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { existsSync } = require('node:fs');
const path = require('node:path');
const exec = promisify(execFile);

// ── 框架：坏 token 探测 ──
async function BAD_TOKEN_DETECTION() {
  const id = 'BAD-TOKEN-FRAMEWORK';
  try {
    // TODO: 环境标记与隔离实例配置
    // 需要编排层提供：
    //   1. E2E_BAD_TOKEN_DIR: 隔离的 TRILC_DATA_DIR 目录（含坏 token 配置）
    //   2. E2E_ISOLATED_PORT: 隔离实例端口（避免与主 daemon 冲突）
    //   3. 启动脚本路径：trilc daemon start --data-dir <E2E_BAD_TOKEN_DIR> --port <E2E_ISOLATED_PORT>

    const badTokenDir = process.env.E2E_BAD_TOKEN_DIR;
    const isolatedPort = process.env.E2E_ISOLATED_PORT;

    if (!badTokenDir || !isolatedPort) {
      record(id, 'blocked', '需环境变量 E2E_BAD_TOKEN_DIR + E2E_ISOLATED_PORT（编排层配置隔离实例）');
      return;
    }

    // 框架代码（TODO: 环境就绪后激活）
    /*
    // 启动隔离实例（坏 token）
    await exec('trilc', ['daemon', 'start', '--data-dir', badTokenDir, '--port', isolatedPort]);

    // 等待实例启动
    await new Promise(r => setTimeout(r, 3000));

    // 探测坏 token 行为
    const badDaemon = {
      get: (p) => req(`http://127.0.0.1:${isolatedPort}`, p),
      healthz: () => req(`http://127.0.0.1:${isolatedPort}`, '/healthz'),
      syncRun: () => req(`http://127.0.0.1:${isolatedPort}`, '/internal/v1/init/sync/run', { method: 'POST', body: JSON.stringify({ entry: 'e2e' }) }),
    };

    const health = await badDaemon.healthz();
    assertEq(health.status, 503, `${id}: 坏 token 实例应返回 503（降级）`);

    const sync = await badDaemon.syncRun();
    assertEq(sync.status, 401, `${id}: 坏 token sync 应返回 401（未授权）`);

    // 清理隔离实例
    await exec('trilc', ['daemon', 'stop', '--port', isolatedPort]);

    record(id, 'pass', '坏 token 探测：503 降级 + 401 拒绝');
    */

    record(id, 'blocked', '框架已就绪，等待编排层提供隔离环境（E2E_BAD_TOKEN_DIR + E2E_ISOLATED_PORT）');
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── 框架：daemon 中途杀 ──
async function DAEMON_KILL_DURING_OPERATION() {
  const id = 'DAEMON-KILL-FRAMEWORK';
  try {
    // TODO: 环境标记与编排层断言
    // 需要编排层提供：
    //   1. E2E_TEST_MODE: 标记测试运行（区分真 daemon 与测试实例）
    //   2. 进程标识与恢复机制（杀后重启用于下一测试）
    //   3. 断言执行：杀操作后由编排层验证面板错误提示（本框架仅记录杀步骤）

    const testMode = process.env.E2E_TEST_MODE;
    if (!testMode) {
      record(id, 'blocked', '需环境变量 E2E_TEST_MODE（编排层标记测试运行）');
      return;
    }

    // 框架代码（TODO: 编排层就绪后激活）
    /*
    // 记录杀前状态（selfcheck 进行中）
    const beforeStatus = await daemon.chainStatus();
    assertEq(beforeStatus.status, 200, `${id}: 杀前应能查询 chainStatus`);

    // 记录步骤：杀进程
    // 由编排层执行：trilc daemon stop（或 taskkill /F /PID <pid>）
    console.log(`[${id}] 记录步骤：杀 daemon 进程（由编排层执行）`);

    // 断言由编排层执行：
    //   1. 面板/CLI 应显示连接失败或明确错误提示
    //   2. 重启后应能恢复或明确重开始
    console.log(`[${id}] 断言移交编排层：验证面板错误提示 + 重启恢复`);

    record(id, 'pass', '框架已记录杀步骤，断言由编排层执行');
    */

    record(id, 'blocked', '框架已就绪，等待编排层配置测试模式（E2E_TEST_MODE）+ 断言执行');
  } catch (e) {
    record(id, 'fail', e.message);
  }
}

// ── Runner ──
async function run() {
  console.log('=== Failure Suite (框架：坏 token 探测 + daemon 中途杀) ===');
  await BAD_TOKEN_DETECTION();
  await DAEMON_KILL_DURING_OPERATION();
  return flushResults('xiaoke-e2e-gamma-failure');
}

if (require.main === module) {
  run().then(() => process.exit(0), () => process.exit(1));
}

module.exports = { run };
