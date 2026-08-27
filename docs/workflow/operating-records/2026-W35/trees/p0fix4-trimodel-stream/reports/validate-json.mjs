// p0fix4 json-validate — post-write parse check for ledger files (half-write hazard guard)
import { readFileSync } from 'node:fs';
const files = process.argv.slice(2);
let bad = 0;
for (const f of files) {
  try {
    JSON.parse(readFileSync(f, 'utf8'));
    console.log(`OK   ${f}`);
  } catch (e) {
    bad += 1;
    console.log(`FAIL ${f}: ${e.message}`);
  }
}
process.exit(bad ? 1 : 0);
