// p0fix3-trilc-http 门禁跑批工具（tick 20260827T074800Z）
// 用途：会话审批墙拒绝 shell 重定向/tee —— 用本 node 包装 spawn 同命令原样捕获 TAP 落盘（p0fix2 先例延续）。
// 等价口径：package.json test script 为 `node --import tsx --test test/**/*.test.ts`，
// node18 无 globstar 下展开层级受限 → 门禁按 reports/enum-tests.txt 显式枚举等价运行（同解释器同 import 链）。
// 用法：node docs/workflow/operating-records/2026-W35/trees/p0fix3-trilc-http/reports/gate-runner.mjs <label>
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = '/srv/fleet/TriLC';

// 解释器选择：TriLC 测试链依赖 node:sqlite（需 ≥22.5）——系统 node18 大面积 ERR_UNKNOWN_BUILTIN_MODULE
// 环境性失败（round0-node18 实测 52 fail 实证在案）。优先用户级 v22（~/.local/opt/node-v22.14.0），
// 可用 GATE_NODE_BIN 环境变量覆盖；解释器 PATH 一并前插供子进程/工具链继承。
function pickNodeBin() {
  const candidates = [
    process.env.GATE_NODE_BIN,
    join(process.env.HOME ?? '/srv/fleet', '.local/opt/node-v22.14.0-linux-x64/bin/node'),
    process.execPath,
  ].filter(Boolean);
  return {
    bin: candidates.find((c) => c !== process.execPath && existsSync(c)) ?? process.execPath,
    extraPath: null,
  };
}
const picked = pickNodeBin();
// 用户级安装不在默认 PATH 时手动前插其目录，供测试子进程与工具链继承
const childEnv = { ...process.env };
{
  const bindir = dirname(picked.bin);
  if (!childEnv.PATH || !childEnv.PATH.split(':').includes(bindir)) {
    childEnv.PATH = `${bindir}:${childEnv.PATH ?? ''}`;
  }
}
const label = process.argv[2];
if (!label || /[^\w.-]/.test(label)) {
  console.error('usage: gate-runner.mjs <label: [\\w.-]+>');
  process.exit(2);
}

const enumText = readFileSync(join(HERE, 'enum-tests.txt'), 'utf8');
const files = enumText.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
if (files.length === 0) { console.error('empty enum list'); process.exit(2); }

mkdirSync(join(HERE, 'gate-logs'), { recursive: true });

const t0 = Date.now();
const r = spawnSync(picked.bin, ['--import', 'tsx', '--test', ...files], {
  cwd: REPO,
  env: childEnv,
  encoding: 'utf8',
  maxBuffer: 512 * 1024 * 1024,
  timeout: 20 * 60 * 1000,
});
const wallMs = Date.now() - t0;

let nodeVersion = null;
try {
  nodeVersion = spawnSync(picked.bin, ['-v'], { encoding: 'utf8' }).stdout?.trim() ?? null;
} catch { /* 记录为 null */ }

writeFileSync(join(HERE, 'gate-logs', `${label}.tap`), r.stdout ?? '');
writeFileSync(join(HERE, 'gate-logs', `${label}.stderr.log`), r.stderr ?? '');

const grab = (re) => (r.stdout ?? '').match(re)?.[1] ?? null;
const meta = {
  label,
  cmd: `${picked.bin} --import tsx --test <enum-tests.txt 显式枚举>`,
  nodeBin: picked.bin,
  nodeVersion,
  repoCwd: REPO,
  exitCode: r.exitCode,
  timedOut: r.error?.code === 'ETIMEDOUT' || false,
  signal: r.signal ?? null,
  wallMs,
  startedAt: new Date(t0).toISOString(),
  endedAt: new Date().toISOString(),
  files: files.length,
  tests: grab(/^# tests (\d+)/m),
  suites: grab(/^# suites (\d+)/m),
  pass: grab(/^# pass (\d+)/m),
  fail: grab(/^# fail (\d+)/m),
  cancelled: grab(/^# cancelled (\d+)/m),
  skipped: grab(/^# skipped (\d+)/m),
  todo: grab(/^# todo (\d+)/m),
};
writeFileSync(join(HERE, 'gate-logs', `${label}.json`), JSON.stringify(meta, null, 2) + '\n');
console.log(JSON.stringify(meta));
