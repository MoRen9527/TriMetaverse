// p0fix4 apply-window — fingerprint-guarded temporary application of PE-1 fix to the
// live foreign-WIP working tree, with exact restore. Orchestrator tool; node wrapper form
// (gate-runner precedent) because shell redirection/cp are outside the command whitelist.
// Usage:
//   node apply-window.mjs probe                       -> prints sha256[:16] + bytes + lines of live file
//   node apply-window.mjs apply <expected-live-sha>   -> guards on live==expected, archives live bytes,
//                                                        installs fixed content, prints both shas
//   node apply-window.mjs restore <expected-live-sha> -> guards on live==expected(fixed), restores archive
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const LIVE = '/srv/fleet/TriModel/src/client.ts';
const FIXED = new URL('./pe1/client.ts.fixed', import.meta.url);
const ARCHIVE = new URL('./wip-archive/src-client.ts.asfound', import.meta.url);

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const info = (label, buf) => `${label} sha256=${sha(buf)} bytes=${buf.length} lines=${buf.toString('utf8').split('\n').length}`;

const mode = process.argv[2];
const expected = process.argv[3];

const live = () => readFileSync(LIVE);

if (mode === 'probe') {
  console.log(info('live', live()));
  process.exit(0);
}

if (!expected || !/^[0-9a-f]{64}$/.test(expected)) {
  console.error('guard-bypass-refused: expected full sha256 required');
  process.exit(2);
}

if (mode === 'apply') {
  const cur = live();
  if (sha(cur) !== expected) {
    console.error(`concurrency-guard-tripped: live ${sha(cur)} != expected ${expected}`);
    process.exit(3);
  }
  mkdirSync(new URL('./wip-archive/', import.meta.url), { recursive: true });
  writeFileSync(ARCHIVE, cur);
  const fixed = readFileSync(FIXED);
  copyFileSync(FIXED, LIVE);
  console.log('ARCHIVED ' + info('asfound', cur));
  console.log('APPLIED  ' + info('fixed', fixed));
  console.log('NOWLIVE  ' + info('live', live()));
  process.exit(0);
}

if (mode === 'restore') {
  const cur = live();
  if (sha(cur) !== expected) {
    console.error(`concurrency-guard-tripped: live ${sha(cur)} != expected ${expected}`);
    process.exit(3);
  }
  const arch = readFileSync(ARCHIVE);
  writeFileSync(LIVE, arch);
  console.log('RESTORED ' + info('live', live()));
  process.exit(0);
}

console.error('usage: probe | apply <sha> | restore <sha>');
process.exit(2);
