// LG-053 波①段2 非作者手测·五门 UI 流真浏览器走查（STE 小柯 2026-09-26）
// 非作者视角：playwright-core 驱动本机 chromium，真点击真渲染；全程只触 3399 临时域。
const fs = require('fs');
const path = require('path');
const pw = require('D:/Code/ai/TriModel/node_modules/playwright-core');

const SET = 'D:/tmp/ste-fb/settings.json';
const BASELINE = 'D:/tmp/ste-fb/settings.json.baseline.json';
const SHOTS = 'D:/tmp/ste-fb/shots';
fs.mkdirSync(SHOTS, { recursive: true });
const KEY = 'sk-ste-manual-abcdefghij';
const TOK = 'ste-manual-token-2026';
const BASE = 'http://127.0.0.1:3399';

const results = [];
function check(name, cond, note) {
  results.push({ name, ok: !!cond });
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (note ? '   | ' + note : ''));
}
function mtime(p) { return fs.statSync(p).mtimeMs; }
function norm(s) { return String(s).replace(/\r\n/g, '\n').trim(); }

function chromiumPath() {
  const root = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
  const dirs = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => parseInt(b.slice(9), 10) - parseInt(a.slice(9), 10));
  for (const d of dirs) for (const sub of ['chrome-win64', 'chrome-win']) {
    const p = path.join(root, d, sub, 'chrome.exe');
    if (fs.existsSync(p)) return p;
  }
  throw new Error('no chromium in ms-playwright cache');
}

(async () => {
  const t0 = Date.now();
  const browser = await pw.chromium.launch({ executablePath: chromiumPath(), headless: true });
  const page = await browser.newPage();
  const consoleErrors = []; const pageErrors = []; const previewPosts = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('request', (r) => { if (r.url().includes('claude-fallback/preview')) previewPosts.push(r.postData() || ''); });

  const msg = () => page.textContent('#fb-msg');
  const hint = () => page.textContent('#fb-step-hint');
  const restoreDisabled = () => page.evaluate(() => document.querySelector('#fb-restore').disabled);

  // ── 行0：首启渲染（追加件 d 渲染验证门载体）──
  await page.goto(BASE + '/ui', { waitUntil: 'domcontentloaded' });
  check('render-title', (await page.title()).includes('TriModel'), await page.title());
  check('render-fbzone', await page.locator('#fb-zone').isVisible());

  // 真用户连接路径：填两令牌→点连接
  await page.fill('#token', TOK);
  await page.fill('#adminToken', TOK);
  await page.click('#conn-save');
  await page.waitForTimeout(1200);
  const connLabel = await page.textContent('#conn-label');
  check('conn-connected', (connLabel || '').includes('已连接'), 'label=' + connLabel);

  // ── 门—：模板下拉加载 ──
  await page.waitForFunction(() => document.querySelectorAll('#fb-tpl option').length > 0 && document.querySelector('#fb-tpl').value !== '', null, { timeout: 8000 });
  const tplState = await page.evaluate(() => Array.from(document.querySelectorAll('#fb-tpl option')).map((o) => o.value + ':' + o.textContent + (o.disabled ? '[禁用]' : '[可选]')).join(' ; '));
  console.log('OBS   模板下拉现势: ' + tplState);
  const bigmodelVal = await page.evaluate(() => { const o = Array.from(document.querySelectorAll('#fb-tpl option')).find((x) => /bigmodel/i.test(x.value) || /bigmodel/i.test(x.textContent)); return o ? o.value : null; });
  check('gate0-bigmodel-present', !!bigmodelVal, 'value=' + bigmodelVal);
  if (bigmodelVal) await page.selectOption('#fb-tpl', bigmodelVal);
  const tplHint = await page.textContent('#fb-tpl-hint');
  console.log('OBS   模板提示: ' + tplHint);

  // ── 门②：只选模板不填凭据 → 预览 ──
  await page.fill('#fb-key', '');
  const pv0 = previewPosts.length;
  await page.click('#fb-preview');
  await page.waitForTimeout(400);
  check('gate2-human-msg', ((await msg()) || '').includes('API 密钥'), 'msg=' + (await msg()));
  check('gate2-no-request', previewPosts.length === pv0, 'preview 请求数增量=' + (previewPosts.length - pv0) + '（UI 侧提前拦截预期 0）');
  check('gate2-still-gated', (await restoreDisabled()) === true);
  // 服务端键名锁平行验证（页内 fetch，同源）
  const srvGate2 = await page.evaluate(async (tok) => {
    const r = await fetch('/v1/config/claude-fallback/preview', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + tok }, body: JSON.stringify({ base_url: 'https://open.bigmodel.cn/api/anthropic', api_key: '', model: 'glm-5.3-flash' }) });
    return { status: r.status, body: await r.text() };
  }, TOK);
  console.log('OBS   服务端空钥锁: HTTP ' + srvGate2.status + ' ' + srvGate2.body.slice(0, 200));

  // ── 门③：凭据健康（PLACEHOLDER / 3 字符）──
  await page.fill('#fb-key', 'PLACEHOLDER');
  await page.click('#fb-preview');
  await page.waitForTimeout(500);
  const g3msg = await msg();
  const g3diffHidden = await page.evaluate(() => document.querySelector('#fb-diff-box').hidden);
  check('gate3-placeholder-reject', !!(g3msg && g3msg.length > 0 && (await restoreDisabled()) === true && g3diffHidden), 'msg=' + g3msg + ' diffHidden=' + g3diffHidden);
  await page.fill('#fb-key', 'abc');
  await page.click('#fb-preview');
  await page.waitForTimeout(500);
  const g3bmsg = await msg();
  console.log('OBS   门③ 3字符现势: msg=' + g3bmsg + ' diffHidden=' + (await page.evaluate(() => document.querySelector('#fb-diff-box').hidden)) + ' gated=' + (await restoreDisabled()));
  console.log('OBS   门③ preview 请求增量（服务端拒，如实记）: ' + (previewPosts.length - pv0 - 0));

  // ── 门④：合法凭据预览（diff + 零写 + 解锁）──
  await page.fill('#fb-key', KEY);
  const m4a = mtime(SET);
  await page.click('#fb-preview');
  await page.waitForFunction(() => !document.querySelector('#fb-diff-box').hidden, null, { timeout: 8000 });
  const diffRows = await page.evaluate(() => Array.from(document.querySelectorAll('#fb-diff tbody tr')).map((tr) => Array.from(tr.children).map((td) => td.textContent).join(' | ')));
  console.log('OBS   门④ diff 行数=' + diffRows.length);
  for (const r of diffRows) console.log('OBS     diff: ' + r.replace(/\n/g, ' '));
  check('gate4-diff-shown', diffRows.length > 0);
  check('gate4-unlocked', (await restoreDisabled()) === false, 'hint=' + (await hint()));
  check('gate4-zero-write', mtime(SET) === m4a, 'settings mtime 未变');

  // ── 门①：写入（备份+清空+成功提示）──
  const baks0 = fs.readdirSync('D:/tmp/ste-fb').filter((f) => /^settings\.json\.bak-/.test(f));
  await page.click('#fb-restore');
  await page.waitForTimeout(1200);
  const wmsg = await msg();
  check('gate1-write-msg', ((await msg()) || '').includes('重启会话后生效'), 'msg=' + wmsg);
  check('gate1-key-cleared', (await page.inputValue('#fb-key')) === '');
  const baks1 = fs.readdirSync('D:/tmp/ste-fb').filter((f) => /^settings\.json\.bak-/.test(f));
  check('gate1-backup-created', baks1.length >= baks0.length + 1, '备份 ' + baks0.length + '→' + baks1.length + ' (' + baks1.join(', ') + ')');
  if (baks1.length > baks0.length) {
    const newBak = baks1.filter((f) => !baks0.includes(f))[0];
    const bakContent = norm(fs.readFileSync('D:/tmp/ste-fb/' + newBak, 'utf8'));
    check('gate1-backup-is-prewrite', bakContent === norm(fs.readFileSync(BASELINE, 'utf8')), '备份内容=写前原文（基线逐字比）');
  }
  const docNow = JSON.parse(fs.readFileSync(SET, 'utf8'));
  check('gate1-file-newvalues', /bigmodel/.test(docNow.env.ANTHROPIC_BASE_URL) && docNow.env.ANTHROPIC_MODEL === 'glm-5.3-flash' && docNow.env.KEEP_ME === 'untouched-value');
  await page.screenshot({ path: SHOTS + '/g1-after-write.png', fullPage: false });

  // ── 门控保持（本次修复 bug 位：成功路径不得自动恢复按钮）──
  check('gatekeep-disabled-after-success', (await restoreDisabled()) === true, '写入成功后按钮 disabled=' + (await restoreDisabled()));
  check('gatekeep-hint-reset', ((await hint()) || '').includes('写前先预览'), 'hint=' + (await hint()));
  check('gatekeep-diff-hidden', await page.evaluate(() => document.querySelector('#fb-diff-box').hidden));
  const m4b = mtime(SET);
  await page.click('#fb-restore', { force: true }).catch(() => {});
  await page.waitForTimeout(400);
  check('gatekeep-forceclick-noop', (await restoreDisabled()) === true && mtime(SET) === m4b, '强点无效+文件零触');
  // 须重新预览才能再写：重填钥→预览→解锁
  await page.fill('#fb-key', KEY);
  await page.click('#fb-preview');
  await page.waitForFunction(() => !document.querySelector('#fb-restore').disabled, null, { timeout: 8000 });
  check('gatekeep-repreview-unlock', (await restoreDisabled()) === false, '重新预览后解锁（须重预览语义成立）');

  // ── 追加件 a：同值重复写入（幂等短路/already_same 观察）──
  const baks2 = fs.readdirSync('D:/tmp/ste-fb').filter((f) => /^settings\.json\.bak-/.test(f)).length;
  await page.click('#fb-restore');
  await page.waitForTimeout(1200);
  const sameMsg = await msg();
  const baks3 = fs.readdirSync('D:/tmp/ste-fb').filter((f) => /^settings\.json\.bak-/.test(f)).length;
  console.log('OBS   追加a 同值复写: msg=' + sameMsg + ' 备份 ' + baks2 + '→' + baks3 + (baks3 > baks2 ? '（产了新备份）' : '（无新备份）'));
  console.log('OBS   追加a 记录口径: 以现役实际语义为准如实入报');

  // ── 写后复读（reload）──
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const cur = await page.textContent('#fb-current');
  check('replay-current-newvalues', /bigmodel/.test(cur || '') && /glm-5\.3-flash/.test(cur || ''), 'fb-current=' + (cur || '').replace(/\s+/g, ' '));
  check('replay-masked-key', /\*{4}ghij/.test(cur || ''), '掩码尾4=****ghij');
  check('replay-no-raw-key', !(cur || '').includes(KEY));
  await page.screenshot({ path: SHOTS + '/replay-after-reload.png', fullPage: true });

  // ── 回滚武装（两击确认→恢复写前原文）──
  await page.click('#fb-bak-list');
  await page.waitForFunction(() => !document.querySelector('#fb-bak-box').hidden && document.querySelectorAll('#fb-bak-box button').length > 0, null, { timeout: 8000 });
  const bakRows = await page.evaluate(() => Array.from(document.querySelectorAll('#fb-bak-box .row-form')).map((r) => r.textContent.trim()));
  console.log('OBS   备份清单行: ' + JSON.stringify(bakRows));
  const rb = page.locator('#fb-bak-box button').first();
  await rb.click();
  const armedTxt = (await rb.textContent());
  check('rollback-armed-once', /确认回滚/.test(armedTxt || ''), '一击后按钮=' + armedTxt + ' class=' + (await rb.getAttribute('class')));
  await page.screenshot({ path: SHOTS + '/rollback-armed.png', fullPage: false });
  await rb.click();
  await page.waitForTimeout(1500);
  const rbMsg = await msg();
  const cur2 = await page.textContent('#fb-current');
  const docAfterRb = JSON.parse(fs.readFileSync(SET, 'utf8'));
  check('rollback-msg', ((await msg()) || '').includes('已回滚'), 'msg=' + rbMsg);
  check('rollback-file-restored', docAfterRb.env.ANTHROPIC_MODEL === 'old-model' && /old\.example\.com/.test(docAfterRb.env.ANTHROPIC_BASE_URL));
  check('rollback-ui-restored', /old\.example\.com/.test(cur2 || '') && /old-model/.test(cur2 || ''), 'fb-current=' + (cur2 || '').replace(/\s+/g, ' '));

  // ── 401 人话（错令牌→预览/写入）──
  await page.fill('#adminToken', 'wrong-token-xxx');
  await page.click('#conn-save');
  await page.waitForTimeout(1000);
  await page.fill('#fb-key', KEY);
  await page.click('#fb-preview');
  await page.waitForTimeout(600);
  const u1msg = await msg();
  check('e401-preview-human', ((await msg()) || '').includes('管理令牌不正确'), 'msg=' + u1msg);
  check('e401-write-stays-gated', (await restoreDisabled()) === true, '401 后写钮保持禁用');
  const snap401 = fs.readFileSync(SET, 'utf8');
  const srv401 = await page.evaluate(async (k) => {
    const r = await fetch('/v1/config/claude-fallback/restore', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer wrong-token-xxx' }, body: JSON.stringify({ base_url: 'https://open.bigmodel.cn/api/anthropic', api_key: k, model: 'glm-5.3-flash' }) });
    return { status: r.status, body: await r.text() };
  }, KEY);
  check('e401-server-401', srv401.status === 401, 'HTTP ' + srv401.status + ' ' + srv401.body.slice(0, 120));
  check('e401-zero-write', fs.readFileSync(SET, 'utf8') === snap401, 'settings 零变化');
  // 复原连接态
  await page.fill('#adminToken', TOK);
  await page.click('#conn-save');
  await page.waitForTimeout(800);

  // ── 渲染验证门收口（追加件 d）：控制台零错误 + 页面错误零 ──
  check('render-console-errors', consoleErrors.length === 0, 'console.error=' + consoleErrors.length + (consoleErrors.length ? ' :: ' + consoleErrors.slice(0, 3).join(' :: ') : ''));
  check('render-page-errors', pageErrors.length === 0, 'pageerror=' + pageErrors.length + (pageErrors.length ? ' :: ' + pageErrors.slice(0, 3).join(' :: ') : ''));

  // ── 门⑤+审计：audit log 结构化+掩码（文件面核，此处只读出计数，全文检索在收尾步做）──
  const auditRaw = fs.readFileSync('D:/tmp/ste-fb/config-audit.log', 'utf8');
  const auditLines = auditRaw.trim().split('\n').filter(Boolean);
  check('audit-lines-exist', auditLines.length > 0, '审计行数=' + auditLines.length);
  console.log('OBS   审计样例（首2行+末3行）:');
  for (const l of auditLines.slice(0, 2)) console.log('OBS     ' + l.slice(0, 300));
  for (const l of auditLines.slice(-3)) console.log('OBS     ' + l.slice(0, 300));
  check('audit-no-raw-key', !auditRaw.includes(KEY), '全文件搜原始钥零命中');
  check('audit-masked-tail', /\*{4}ghij/.test(auditRaw), '密钥仅尾4位形态出现');
  check('audit-who-restore-present', /"who"\s*:/.test(auditRaw) || /who/.test(auditRaw), 'who 字段在位（回滚行 who 值随报告原样粘贴）');
  const rbLine = auditLines.reverse().find((l) => /rollback/i.test(l));
  if (rbLine) console.log('OBS   回滚审计行原样: ' + rbLine);

  const wall = ((Date.now() - t0) / 1000).toFixed(1);
  const fails = results.filter((r) => !r.ok);
  console.log('\n=== UI WALK: ' + (fails.length === 0 ? 'ALL PASS' : 'FAIL x' + fails.length + ': ' + fails.map((f) => f.name).join('; ')) + ' ===');
  console.log('=== 断言数=' + results.length + ' 走查墙钟=' + wall + 's（自动化驱动计时，非人手掐表——追加件 c 以此读数如实入报） ===');
  await browser.close();
  process.exit(fails.length === 0 ? 0 : 2);
})().catch((e) => { console.error('WALK-ABORT: ' + (e && e.stack || e)); process.exit(3); });
