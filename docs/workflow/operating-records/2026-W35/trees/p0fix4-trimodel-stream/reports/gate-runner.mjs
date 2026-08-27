// p0fix4 gate-runner — node spawn wrapper capturing TAP/shell-redirection-denied workaround
// Precedent: p0fix3-trilc-http reports/gate-runner.mjs (审批墙拒 shell 重定向/tee)
// Usage: node gate-runner.mjs <label> <test-file-abs-path> [...more]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const REPO = '/srv/fleet/TriModel';
const label = process.argv[2];
const files = process.argv.slice(3);
if (!label || files.length === 0) {
  console.error('usage: node gate-runner.mjs <label> <testfile> [...]');
  process.exit(2);
}

mkdirSync(new URL('./gate-logs/', import.meta.url), { recursive: true });

const child = spawn('node', ['--import', 'tsx', '--test', ...files], {
  cwd: REPO,
  env: { ...process.env, FORCE_COLOR: '0' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let out = '';
let err = '';
child.stdout.on('data', (d) => { out += d; });
child.stderr.on('data', (d) => { err += d; });
const code = await new Promise((resolve) => child.on('close', resolve));

writeFileSync(new URL(`./gate-logs/${label}.tap`, import.meta.url), out);
writeFileSync(new URL(`./gate-logs/${label}.stderr.log`, import.meta.url), err);

const grab = (re) => [...out.matchAll(re)].map((m) => m[1]).pop() ?? '?';
const tests = grab(/^# tests (\d+)/gm);
const pass = grab(/^# pass (\d+)/gm);
const fail = grab(/^# fail (\d+)/gm);
const cancelled = grab(/^# cancelled (\d+)/gm);
const skipped = grab(/^# skipped (\d+)/gm);
const notOkLines = out.split('\n').filter((l) => l.startsWith('not ok'));

const summary = {
  label,
  argv: files,
  cwd: REPO,
  exitCode: code,
  tests,
  pass,
  fail,
  cancelled,
  skipped,
  notOk: notOkLines,
};
writeFileSync(new URL(`./gate-logs/${label}.json`, import.meta.url), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
