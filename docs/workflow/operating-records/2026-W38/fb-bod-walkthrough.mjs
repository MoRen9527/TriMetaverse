// BOD 非作者真机走查（任务书 20260915-fallback-button 验收锚①②）
// 流程：快照 → 真浏览器连 UI → 区块/现状断言 → 失败态（坏地址/短密钥零请求）→
//       真机写入（标记值）→ 落盘断言（11 键/其余字段保留/备份==原文件）→ 幂等复点 →
//       finally 恢复原文件（字节一致）→ 清测试备份 → 结果 JSON 落 W38。
// 密钥卫生：TRIMODEL_* 从 .env 读入内存，全程不打印；只打印布尔/哈希/标记值。
import { readFileSync, writeFileSync, copyFileSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CLAUDE_DIR = join(homedir(), '.claude');
const SETTINGS = join(CLAUDE_DIR, 'settings.json');
const OUT_JSON = 'D:/Code/ai/TriMetaverse/docs/workflow/operating-records/2026-W38/fb-bod-walkthrough-results.json';
const TIER_KEYS = ['ANTHROPIC_MODEL', 'ANTHROPIC_DEFAULT_FABLE_MODEL', 'ANTHROPIC_DEFAULT_FABLE_MODEL_NAME',
  'ANTHROPIC_DEFAULT_OPUS_MODEL', 'ANTHROPIC_DEFAULT_OPUS_MODEL_NAME', 'ANTHROPIC_DEFAULT_SONNET_MODEL',
  'ANTHROPIC_DEFAULT_SONNET_MODEL_NAME', 'ANTHROPIC_DEFAULT_HAIKU_MODEL', 'ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME'];
const TARGET_KEYS = ['ANTHROPIC_BASE_URL', 'ANTHROPIC_AUTH_TOKEN', ...TIER_KEYS];
const DUMMY = { url: 'https://open.bigmodel.cn/api/anthropic', key: 'sk-walkthrough-probe-0123456789abcdef', model: 'walkthrough-probe[1M]' };

const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const readEnvFile = () => {
  const o = {};
  for (const line of readFileSync(join(HERE, '..', '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) o[m[1]] = m[2].trim();
  }
  return o;
};

const results = { ts: new Date().toISOString(), settings_path: SETTINGS, steps: [], observations: [] };
const record = (name, pass, detail) => results.steps.push({ name, pass: !!pass, detail });

const admin = readEnvFile().TRIMODEL_ADMIN_TOKEN ?? '';
const apiTok = readEnvFile().TRIMODEL_API_TOKEN ?? '';
record('env-tokens-present', admin.length > 0, { admin_len: admin.length, api_len: apiTok.length });

const originalRaw = readFileSync(SETTINGS, 'utf8');
const originalSha = sha(SETTINGS);
const originalDoc = JSON.parse(originalRaw);
const bakBefore = new Set(readdirSync(CLAUDE_DIR).filter((f) => f.startsWith('settings.json.bak-')));

let writtenBackup = null;
let browser = null;

const { chromium } = await import('playwright-core');
async function launch() {
  const cacheRoot = join(process.env.LOCALAPPDATA, 'ms-playwright');
  for (const c of ['chromium-1228', 'chromium-1200', 'chromium-1194']) {
    const p = join(cacheRoot, c, 'chrome-win', 'chrome.exe');
    try { readFileSync(p); return await chromium.launch({ executablePath: p, headless: true }); } catch { /* next */ }
  }
  return await chromium.launch({ channel: 'chrome', headless: true });
}

let restoreSha = null;
try {
  browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  const pageErrors = [];
  let postCount = 0;
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('request', (r) => { if (r.method() === 'POST' && r.url().includes('claude-fallback/restore')) postCount++; });

  await page.goto('http://127.0.0.1:3333/ui', { waitUntil: 'networkidle' });
  await page.fill('#token', apiTok);
  await page.fill('#adminToken', admin);
  await page.click('#conn-save');
  await page.waitForTimeout(900);

  // A. 区块可见 + 现状展示（应=现势 deepseek）
  const zoneVisible = await page.isVisible('#fb-zone');
  const curText = (await page.textContent('#fb-current')) ?? '';
  record('A1-区块渲染', zoneVisible, { zone_visible: zoneVisible });
  const preBase = originalDoc.env?.ANTHROPIC_BASE_URL ?? '';
  const preModel = originalDoc.env?.ANTHROPIC_MODEL ?? '';
  record('A2-现状展示', curText.includes(preBase) && curText.includes(preModel) && curText.includes('****'),
    { shows_baseurl: curText.includes(preBase), shows_model: curText.includes(preModel), masked_tail: curText.includes('****') });

  // B1. 失败态：坏地址 → 行内人话、零写入
  await page.fill('#fb-baseurl', 'not-a-url');
  await page.fill('#fb-key', 'x'.repeat(24));
  await page.fill('#fb-model', 'm');
  await page.click('#fb-restore');
  await page.waitForTimeout(250);
  const msgBad = (await page.textContent('#fb-msg')) ?? '';
  record('B1-坏地址拒', msgBad.includes('http') && sha(SETTINGS) === originalSha && postCount === 0,
    { msg: msgBad, sha_unchanged: sha(SETTINGS) === originalSha, posts: postCount });

  // B2. 失败态：短密钥 → 本地拒零请求、零写入
  await page.fill('#fb-baseurl', DUMMY.url);
  await page.fill('#fb-key', 'short-key');
  await page.fill('#fb-model', 'm');
  await page.click('#fb-restore');
  await page.waitForTimeout(250);
  const msgShort = (await page.textContent('#fb-msg')) ?? '';
  record('B2-短密钥零请求', msgShort.includes('16') && postCount === 0 && sha(SETTINGS) === originalSha,
    { msg: msgShort, posts: postCount, sha_unchanged: sha(SETTINGS) === originalSha });

  // C. 真机写入（标记值）
  await page.fill('#fb-baseurl', DUMMY.url);
  await page.fill('#fb-key', DUMMY.key);
  await page.fill('#fb-model', DUMMY.model);
  await page.click('#fb-restore');
  await page.waitForFunction(() => (document.getElementById('fb-msg')?.textContent ?? '').includes('重启会话后生效'), null, { timeout: 6000 });
  const msgOk = (await page.textContent('#fb-msg')) ?? '';
  const afterRaw = readFileSync(SETTINGS, 'utf8');
  const afterDoc = JSON.parse(afterRaw);
  const aEnv = afterDoc.env ?? {};
  const oEnv = originalDoc.env ?? {};
  record('C1-写入三值', aEnv.ANTHROPIC_BASE_URL === DUMMY.url && aEnv.ANTHROPIC_AUTH_TOKEN === DUMMY.key
    && TIER_KEYS.every((k) => aEnv[k] === DUMMY.model), { url: aEnv.ANTHROPIC_BASE_URL, model: aEnv.ANTHROPIC_MODEL, tier_all_same: TIER_KEYS.every((k) => aEnv[k] === DUMMY.model) });
  const nonTargetEnvSame = Object.keys(oEnv).every((k) => TARGET_KEYS.includes(k) || aEnv[k] === oEnv[k]) && Object.keys(aEnv).length === Object.keys(oEnv).length;
  const topSame = Object.keys(originalDoc).every((k) => k === 'env' || JSON.stringify(afterDoc[k]) === JSON.stringify(originalDoc[k]))
    && Object.keys(afterDoc).length === Object.keys(originalDoc).length;
  record('C2-其余字段逐字保留', nonTargetEnvSame && topSame, { non_target_env_same: nonTargetEnvSame, top_level_same: topSame });
  const bakNew = readdirSync(CLAUDE_DIR).filter((f) => f.startsWith('settings.json.bak-') && !bakBefore.has(f));
  writtenBackup = bakNew.length === 1 ? join(CLAUDE_DIR, bakNew[0]) : null;
  record('C3-备份==原文件', bakNew.length === 1 && sha(writtenBackup) === originalSha,
    { backups_new: bakNew, backup_sha_matches_original: writtenBackup ? sha(writtenBackup) === originalSha : false });
  record('C4-无tmp残留', !existsSync(SETTINGS + '.tmp') && !existsSync(SETTINGS + '.tmp'), {});
  record('C5-成功文案', msgOk.includes('重启会话后生效'), { msg: msgOk });
  const keyCleared = (await page.inputValue('#fb-key')) === '';
  const curAfter = (await page.textContent('#fb-current')) ?? '';
  record('C6-密钥框清空+现状刷新', keyCleared && curAfter.includes(DUMMY.url) && curAfter.includes(DUMMY.model),
    { key_cleared: keyCleared, current_refreshed: curAfter.includes(DUMMY.url) && curAfter.includes(DUMMY.model) });

  // D. 幂等：同值复点 → 明示已是该值、不重写不新备份
  const shaWritten = sha(SETTINGS);
  await page.fill('#fb-baseurl', DUMMY.url);
  await page.fill('#fb-key', DUMMY.key);
  await page.fill('#fb-model', DUMMY.model);
  await page.click('#fb-restore');
  await page.waitForTimeout(600);
  const msgIdem = (await page.textContent('#fb-msg')) ?? '';
  const bakAfter2 = readdirSync(CLAUDE_DIR).filter((f) => f.startsWith('settings.json.bak-') && !bakBefore.has(f));
  record('D1-幂等明示不重写', (msgIdem.includes('已是') || msgIdem.includes('无需重写')) && sha(SETTINGS) === shaWritten && bakAfter2.length === 1,
    { msg: msgIdem, sha_unchanged: sha(SETTINGS) === shaWritten, backups: bakAfter2.length });

  results.observations.push({ page_errors: pageErrors, original_bytes: originalRaw.length, written_bytes: afterRaw.length, trailing_newline_before: originalRaw.endsWith('\n'), trailing_newline_after: afterRaw.endsWith('\n') });
} catch (err) {
  record('fatal', false, { error: String(err) });
} finally {
  if (browser) await browser.close().catch(() => {});
  // 恢复判定不依赖步序赋值（run1 教训：waitForFunction 超时路径漏恢复）——
  // 凡现文件含标记密钥，即找 sha==原文件的备份还原；找不到=写恢复件+高声报警。
  try {
    const nowRaw = readFileSync(SETTINGS, 'utf8');
    if (nowRaw.includes(DUMMY.key)) {
      const cands = readdirSync(CLAUDE_DIR).filter((f) => f.startsWith('settings.json.bak-') && !bakBefore.has(f));
      const good = cands.map((f) => join(CLAUDE_DIR, f)).find((p) => sha(p) === originalSha);
      if (good) { writtenBackup = good; copyFileSync(good, SETTINGS); restoreSha = sha(SETTINGS); }
      else { writeFileSync(SETTINGS + '.RECOVER-ME', originalRaw, 'utf8'); results.observations.push({ RECOVERY_NEEDED: true, recovery_file: SETTINGS + '.RECOVER-ME' }); }
      if (restoreSha === originalSha && writtenBackup) { try { unlinkSync(writtenBackup); results.observations.push({ test_backup_removed: true }); } catch { /* keep */ } }
    } else if (!restoreSha) {
      restoreSha = sha(SETTINGS); // 从未改动=原样即恢复态
    }
  } catch { /* keep */ }
}
record('R1-恢复原文件字节一致', restoreSha === originalSha, { restore_sha_matches: restoreSha === originalSha, restore_sha: restoreSha ? restoreSha.slice(0, 16) : null, original_sha: originalSha.slice(0, 16) });

results.summary = { total: results.steps.length, pass: results.steps.filter((s) => s.pass).length, fail: results.steps.filter((s) => !s.pass).map((s) => s.name) };
writeFileSync(OUT_JSON, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results.summary, null, 2));
for (const s of results.steps) if (!s.pass) console.log('FAIL:', s.name, JSON.stringify(s.detail));
