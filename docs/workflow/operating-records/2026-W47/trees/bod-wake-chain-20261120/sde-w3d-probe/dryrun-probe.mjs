// SDE W3-d dry-run probe (case-1 form, zero real delivery) 2026-11-20
// Assertions: (1) name-address unique hit (2) pipe CONNECTED zero-write 200ms destroy (3) key form-face only
// D-46: key value face never read into output; socketPath masked to tail 8 chars.
import { resolveBodTargets, defaultConnectSocket, isPidAlive } from 'file:///D:/Code/ai/TriMLC/dist/server/seat-wake-wiring.js';
import { statSync } from 'node:fs';

const mask = (p) => p ? '…' + String(p).slice(-8) : null;

// --- probe 1: name-address resolution ---
const targets = resolveBodTargets();
console.log('probe1 hits=' + targets.length);
for (const t of targets) {
  console.log('  target: name=bod agent=Board pid=' + t.pid + ' status=' + t.status + ' alive=' + isPidAlive(t.pid) + ' keyPresent=' + (t.keyPath ? true : false) + ' socketSuffix=' + mask(t.socketPath));
}

// --- probe 2: pipe connect, zero write, 200ms destroy ---
if (targets.length === 1) {
  const t0 = Date.now();
  try {
    const sock = await defaultConnectSocket(targets[0].socketPath);
    const elapsed = Date.now() - t0;
    console.log('probe2 CONNECTED state=' + sock.readyState + ' elapsedMs=' + elapsed + ' zeroWrite=true destroy next');
    sock.destroy();
    console.log('probe2 destroyed ok');
  } catch (e) {
    console.log('probe2 CONNECT_FAIL msg=' + String(e && e.code ? e.code : 'unknown') + ' (masked, no path echoed)');
  }
} else {
  console.log('probe2 SKIPPED (hits!=' + '1, no connect by fail-visible rule)');
}

// --- probe 3: key form-face only ---
if (targets.length === 1 && targets[0].keyPath) {
  try {
    const st = statSync(targets[0].keyPath);
    const bytes = st.size;
    console.log('probe3 keyPresent=true keyLen=' + bytes + 'B hex64=' + (bytes === 64 ? 'true' : 'false') + ' (form-face only, value face never read)');
  } catch (e) {
    console.log('probe3 STAT_FAIL code=' + (e && e.code));
  }
} else {
  console.log('probe3 SKIPPED (no unique target or keyPath absent)');
}
console.log('dryrun-probe done RC=0 (zero real delivery: connect-only, no write, destroy)');
