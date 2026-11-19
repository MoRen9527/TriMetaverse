// SDE W3-E dry-run probe, self-probe form, target=m-cto (zero real delivery) 2026-11-20
// Assertions: (1) name-address unique hit m-cto/CTO (2) key form-face keyPresent+len (3) CONNECTED zero-write destroy (4) auth-availability face only
import { resolveWakeTargets, defaultConnectSocket, isPidAlive } from 'file:///D:/Code/ai/TriMLC/dist/server/seat-wake-wiring.js';
import { statSync } from 'node:fs';
const mask = (p) => p ? '…' + String(p).slice(-8) : null;

const targets = resolveWakeTargets({}, 'm-cto', 'ChiefTechnologyOfficer');
console.log('probe1 hits=' + targets.length);
for (const t of targets) {
  console.log('  target: name=m-cto agent=ChiefTechnologyOfficer pid=' + t.pid + ' status=' + t.status + ' alive=' + isPidAlive(t.pid) + ' socketSuffix=' + mask(t.socketPath));
}
if (targets.length === 1) {
  const t = targets[0];
  // probe2 key form-face
  if (t.keyPath) {
    try { const st = statSync(t.keyPath); console.log('probe2 keyPresent=true keyLen=' + st.size + 'B (auth-availability face only, value face never read)'); }
    catch (e) { console.log('probe2 STAT_FAIL ' + e.code); }
  } else console.log('probe2 keyPresent=false (no key file matched)');
  // probe3 connect zero-write destroy
  const t0 = Date.now();
  try {
    const sock = await defaultConnectSocket(t.socketPath);
    console.log('probe3 CONNECTED elapsedMs=' + (Date.now() - t0) + ' zeroWrite=true');
    sock.destroy(); console.log('probe3 destroyed ok');
  } catch (e) { console.log('probe3 CONNECT_FAIL code=' + (e && e.code)); }
}
console.log('dryrun-mcto done RC=0 (zero real delivery)');
