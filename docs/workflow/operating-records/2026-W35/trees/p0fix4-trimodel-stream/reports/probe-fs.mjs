// p0fix4 fs-permission probe — identity + target writability forensics
import { statSync } from 'node:fs';
import { accessSync, constants as C } from 'node:fs';

const targets = [
  '/srv/fleet/TriModel/src',
  '/srv/fleet/TriModel/src/client.ts',
  '/srv/fleet/TriModel/.git',
  '/srv/fleet/TriModel/node_modules/.package-lock.json',
  '/srv/fleet/TriModel/test',
];
console.log(JSON.stringify({
  uid: typeof process.getuid === 'function' ? process.getuid() : null,
  gid: typeof process.getgid === 'function' ? process.getgid() : null,
  euid: typeof process.geteuid === 'function' ? process.geteuid() : null,
  groups: typeof process.getgroups === 'function' ? process.getgroups() : null,
}, null, 2));
for (const t of targets) {
  try {
    const s = statSync(t);
    let acc = {};
    try { accessSync(t, C.W_OK); acc.w_ok = true; } catch { acc.w_ok = false; }
    try { accessSync(t, C.R_OK); acc.r_ok = true; } catch { acc.r_ok = false; }
    console.log(`${t} uid=${s.uid} gid=${s.gid} mode=${s.mode.toString(8)} ${JSON.stringify(acc)}`);
  } catch (e) {
    console.log(`${t} ERR ${e.code}`);
  }
}
