/**
 * gate-runner.mjs — p0fix2-trirmc-service 树用门禁执行器（编排层专用，非被测代码）。
 *
 * 背景：会话 Bash 白名单按命令首段匹配，`npm test --prefix …` 可通但 shell 重定向/
 * tee 均不可达，套件全量 TAP 过大导致终端截尾丢失汇总。本脚本以 node 直跑
 * （白名单 Bash(node:*) 形态）spawn 同一条 npm test 命令、原样捕获 stdout/stderr
 * 与退出码，落盘 TAP 至 reports/gate-logs/<label>.tap 并打印「not ok 全文 + 末尾
 * 汇总」，供编排层读数与 verify.md 取证。不改变被测行为本身。
 *
 * 用法：node gate-runner.mjs <label> [额外透传给 npm test 的参数…]
 */

import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const TRIRMC = '/srv/fleet/TriRMC';

const label = process.argv[2];
if (!label) {
  console.error('usage: node gate-runner.mjs <label> [extra npm test args...]');
  process.exit(2);
}
const extraArgs = process.argv.slice(3);

const startedAt = new Date().toISOString();
const res = spawnSync('npm', ['test', '--prefix', TRIRMC, ...extraArgs], {
  encoding: 'utf-8',
  maxBuffer: 256 * 1024 * 1024,
});
const endedAt = new Date().toISOString();

const out = `${res.stdout ?? ''}${res.stderr ?? ''}`;
writeFileSync(join(here, 'gate-logs', `${label}.tap`), out, 'utf-8');

// ── 判定行提取：not ok 全块 + 最后汇总段 ──
const lines = out.split('\n');
const notOkIdx = [];
lines.forEach((l, i) => {
  if (/^not ok /.test(l)) notOkIdx.push(i);
});

let printed = 0;
for (const i of notOkIdx) {
  const block = [];
  block.push(lines[i]);
  for (let j = i + 1; j < lines.length; j++) {
    if (/^ok |^not ok |^# Subtest|^1\.\./.test(lines[j])) break;
    block.push(lines[j]);
    if (block.length > 40) break;
  }
  console.log(block.join('\n'));
  printed += 1;
}

console.log('═'.repeat(72));
console.log(`gate-run label=${label} exitCode=${res.status ?? 'null(signal:' + res.signal + ')'}`);
console.log(`started=${startedAt} ended=${endedAt}`);
console.log('── tail 30 ──');
console.log(lines.slice(-30).join('\n'));
console.log('── 头部清单（shell 展开后实际测试文件序列由 node 输出无法还原；本处仅展示首行 banner）──');
console.log(lines[0] ?? '');
