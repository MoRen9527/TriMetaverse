// F-1 分支独立验证（BOD 第二方法；CTO F-1 回修 1e07310 复审）
// 方法：钉位 TRIMODEL_CLAUDE_SETTINGS 指向临时文件 → 独立 server 实例（3999/4000）→ 真 HTTP POST。
// 两案：A=载体(API_KEY)存在→同写同值+幂等含载体；B=无载体→不新增键。全程不触真机 settings.json。
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const OUT = 'D:/Code/ai/TriMetaverse/docs/workflow/operating-records/2026-W38/fb-cto-f1-check-results.json';
const envText = readFileSync('D:/Code/ai/TriModel/.env', 'utf8');
const admin = envText.split(/\r?\n/).find((l) => l.startsWith('TRIMODEL_ADMIN_TOKEN='))?.split('=').slice(1).join('=').trim() ?? '';

const T = mkdtempSync(join(tmpdir(), 'fb-f1-'));
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const NEW = { base_url: 'https://new.example/anthropic', api_key: 'sk-new-0123456789abcdef', model: 'new-model[1M]' };

const fileA = join(T, 'settings-A.json');
writeFileSync(fileA, JSON.stringify({ env: { ANTHROPIC_BASE_URL: 'https://old.example/anthropic', ANTHROPIC_AUTH_TOKEN: 'old-token-0123456789', ANTHROPIC_API_KEY: 'old-apikey-0123456789', ANTHROPIC_MODEL: 'old-model', KEEP_ME: 'keep' }, model: 'opus', theme: 'dark' }, null, 2));
const fileB = join(T, 'settings-B.json');
writeFileSync(fileB, JSON.stringify({ env: { ANTHROPIC_BASE_URL: 'https://old.example/anthropic', ANTHROPIC_AUTH_TOKEN: 'old-token-0123456789', ANTHROPIC_MODEL: 'old-model' }, model: 'opus' }, null, 2));

function start(port, settingsFile) {
  return spawn(process.execPath, ['D:/Code/ai/TriModel/dist/src/server.js'], {
    env: { ...process.env, TRIMODEL_CLAUDE_SETTINGS: settingsFile, TRIMODEL_ADMIN_TOKEN: admin, TRIMODEL_PORT: String(port), TRIMODEL_HOST: '127.0.0.1' },
    cwd: T, stdio: 'ignore',
  });
}
const post = async (port, body) => (await fetch(`http://127.0.0.1:${port}/v1/config/claude-fallback/restore`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + admin }, body: JSON.stringify(body) })).json();
const waitUp = async (port) => { for (let i = 0; i < 50; i++) { try { await fetch(`http://127.0.0.1:${port}/v1/config/runtime-info`); return true; } catch { await new Promise((r) => setTimeout(r, 150)); } } return false; };

const results = [];
let srv = start(3999, fileA);
try {
  const up = await waitUp(3999);
  if (!up) throw new Error('server 3999 未起');
  const r1 = await post(3999, NEW);
  const a1 = JSON.parse(readFileSync(fileA, 'utf8'));
  results.push({ name: 'A1-载体存在=同写同值', pass: r1.ok === true && a1.env.ANTHROPIC_API_KEY === NEW.api_key && a1.env.ANTHROPIC_AUTH_TOKEN === NEW.api_key, detail: { api_key_updated: a1.env.ANTHROPIC_API_KEY === NEW.api_key } });
  results.push({ name: 'A2-非靶键保留', pass: a1.env.KEEP_ME === 'keep' && a1.model === 'opus' && a1.theme === 'dark', detail: {} });
  const shaA = sha(fileA);
  const r2 = await post(3999, NEW);
  results.push({ name: 'A3-幂等含载体', pass: r2.restored?.already_same === true && sha(fileA) === shaA, detail: { already_same: r2.restored?.already_same, sha_unchanged: sha(fileA) === shaA } });
} catch (err) { results.push({ name: 'A-fatal', pass: false, detail: { error: String(err) } }); } finally { srv.kill(); }

srv = start(4000, fileB);
try {
  const up = await waitUp(4000);
  if (!up) throw new Error('server 4000 未起');
  const r3 = await post(4000, NEW);
  const b1 = JSON.parse(readFileSync(fileB, 'utf8'));
  results.push({ name: 'B1-无载体=不新增键', pass: r3.ok === true && !('ANTHROPIC_API_KEY' in b1.env) && b1.env.ANTHROPIC_AUTH_TOKEN === NEW.api_key, detail: { api_key_added: 'ANTHROPIC_API_KEY' in b1.env } });
} catch (err) { results.push({ name: 'B-fatal', pass: false, detail: { error: String(err) } }); } finally { srv.kill(); }

const summary = { total: results.length, pass: results.filter((r) => r.pass).length, fail: results.filter((r) => !r.pass).map((r) => r.name) };
writeFileSync(OUT, JSON.stringify({ ts: new Date().toISOString(), results, summary }, null, 2));
// 清理放最后且容错（run1 教训：Windows 下 rm 在子进程退净前 EBUSY，且曾因顺序=清理先于落盘而丢结果）
try { rmSync(T, { recursive: true, force: true }); } catch { console.log('(temp 清理延迟：', T, ')'); }
console.log(JSON.stringify(summary, null, 2));
for (const r of results) if (!r.pass) console.log('FAIL', r.name, JSON.stringify(r.detail));
