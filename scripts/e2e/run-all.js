#!/usr/bin/env node
// ── E2E 统一跑批入口 ──
// 用法：node scripts/e2e/run-all.js [--suite 01,02] [--live]
//   --suite  只跑指定 suite（逗号分隔编号）
//   --live   实际执行断言（缺省 dry：只加载模块检查导出）
// 结果由各 suite 的 record() 累积，flushResults 回写 e2e-test-suite.json

const path = require('node:path');
const suites = ['01-init-chain', '03-sync', '04-git', '08-verify', '05-concurrent', '06-failure', '07-cross-reset', '09-agents-conflict', '02-reset']; // 02-reset 破坏性（清链）放尾——首轮教训：reset 先跑污染 sync 前置

async function main() {
  const args = process.argv.slice(2);
  const live = args.includes('--live');
  const suiteArg = args.find((a) => a.startsWith('--suite'));
  const only = suiteArg ? suiteArg.split('=')[1]?.split(',') || args[args.indexOf(suiteArg) + 1]?.split(',') : null;
  const toRun = only ? suites.filter((s) => only.some((o) => s.startsWith(o))) : suites;

  console.log(`[run-all] ${live ? 'LIVE' : 'DRY'} 模式，suites: ${toRun.join(', ')}`);
  const summary = [];
  for (const name of toRun) {
    try {
      const mod = require(path.join(__dirname, 'suites', `${name}.js`));
      const entry = typeof mod.main === 'function' ? mod.main : (typeof mod.run === 'function' ? mod.run : null);
      if (live && entry) {
        console.log(`\n=== ${name} ===`);
        await entry();
      } else {
        const cases = Object.keys(mod).filter((k) => k.startsWith('case_') || /^[SRECM][d]-/.test(k) || k === 'run');
        console.log(`${name}: 模块 OK（${cases.length} 用例导出，dry 跳过执行）`);
        summary.push({ suite: name, status: 'loaded', cases: cases.length });
      }
    } catch (err) {
      console.error(`${name}: 加载失败 — ${err.message}`);
      summary.push({ suite: name, status: 'load-error', error: err.message });
    }
  }
  console.log('\n[run-all] 汇总:', JSON.stringify(summary));
}

main().catch((e) => { console.error('[run-all] fatal:', e); process.exit(1); });
