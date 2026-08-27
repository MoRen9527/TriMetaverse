// p0fix4 tsc runner — node spawn wrapper capturing tsc --noEmit output
// Precedent: gate-runner.mjs node spawn wrapper (shell redirection denied by approval wall)
// Usage: node tsc-runner.mjs <label> <project-dir>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const label = process.argv[2];
const projectDir = process.argv[3];
if (!label || !projectDir) {
  console.error('usage: node tsc-runner.mjs <label> <project-dir>');
  process.exit(2);
}

const child = spawn('/srv/fleet/TriModel/node_modules/.bin/tsc', ['--noEmit'], {
  cwd: projectDir,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let out = '';
let err = '';
child.stdout.on('data', (d) => { out += d; });
child.stderr.on('data', (d) => { err += d; });
const code = await new Promise((resolve) => child.on('close', resolve));

writeFileSync(new URL(`./gate-logs/${label}.tsc.log`, import.meta.url),
  `exitCode=${code}\nstdout:\n${out}\nstderr:\n${err}\n`);

console.log(JSON.stringify({
  label,
  cwd: projectDir,
  exitCode: code,
  stdoutLen: out.length,
  stderrLen: err.length,
  hasOutput: (out.length + err.length) > 0,
}));
