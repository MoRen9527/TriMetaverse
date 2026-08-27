// p0fix4 sandbox-build — read-only mirror of TriModel src/+test/ into tree sandbox dir,
// overlaying PE-1 fixed client.ts and injecting guard suite; node_modules via symlink so
// upstream bare specifiers (dotenv) resolve through sandbox/../.. upward chain.
// W1 wall work-around: TriModel source trees are read-only for this uid — nothing here writes there.
import { cpSync, mkdirSync, copyFileSync, existsSync, symlinkSync, readdirSync } from 'node:fs';

const REPO = '/srv/fleet/TriModel';
const SB = new URL('./sandbox/', import.meta.url);

mkdirSync(new URL('src/', SB), { recursive: true });
mkdirSync(new URL('test/', SB), { recursive: true });

cpSync(`${REPO}/src`, new URL('src/', SB), { recursive: true });
cpSync(`${REPO}/test`, new URL('test/', SB), { recursive: true });

copyFileSync(`${REPO}/package.json`, new URL('package.json', SB));
copyFileSync(`${REPO}/tsconfig.json`, new URL('tsconfig.json', SB));

// OVERLAY 1: PE-1 fixed client.ts replaces mirrored one (the fix under verification)
copyFileSync(
  new URL('./pe1/client.ts.fixed', import.meta.url),
  new URL('src/client.ts', SB),
);
// OVERLAY 2: PE-T guard suite joins mirrored suites in sandbox/test/
copyFileSync(
  new URL('./guards/stream-fallback-guard.test.ts', import.meta.url),
  new URL('test/stream-fallback-guard.test.ts', SB),
);
// dependency resolution anchor
if (!existsSync(new URL('node_modules', SB))) {
  symlinkSync(`${REPO}/node_modules`, new URL('node_modules', SB), 'dir');
}

const count = (u) => readdirSync(u).length;
console.log(JSON.stringify({
  built: true,
  srcFiles: count(new URL('src/', SB)),
  testFiles: count(new URL('test/', SB)),
}));
