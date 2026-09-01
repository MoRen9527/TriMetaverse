// ── E2E lib: TriRLC/TriMMC 端点封装 + 断言 + 测试集回写 ──
// 用法：suites/*.js require 本模块；runCase(id, fn) 执行断言并回写 e2e-test-suite.json 的 status
// 纪律（D-01）：suite 文件每完成一个立即保存；跑批结果由 runner 统一回写 JSON

const TRILC = process.env.E2E_TRILC_URL || 'http://127.0.0.1:8711';
const TRIMC = process.env.E2E_TRIMC_URL || 'http://47.245.122.61:8710';

// 2026-08-17：node 原生 fetch(undici) POST 对 daemon 部分端点返回 404（DEFECT-FETCH-404，登记待查）
// ——绕行：改用 node:http 实现（与 curl/VS Code 行为一致）
const { request } = require('node:http');
function req(baseUrl, path, opts = {}, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const u = new URL(baseUrl + path);
    const body = opts.body ?? null;
    const headers = { 'content-type': 'application/json', ...(opts.headers || {}) };
    if (body) headers['content-length'] = Buffer.byteLength(String(body));
    const r = request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: opts.method || 'GET', headers, timeout: timeoutMs }, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => { let json = null; try { json = JSON.parse(raw); } catch {} resolve({ status: res.statusCode, json, raw }); });
    });
    r.on('timeout', () => { r.destroy(); resolve({ status: 0, json: { error: 'timeout' }, raw: '' }); });
    r.on('error', (e) => resolve({ status: 0, json: { error: e.message }, raw: '' }));
    if (body) r.write(String(body));
    r.end();
  });
}
const daemon = {
  get: (p) => req(TRILC, p),
  post: (p, body) => req(TRILC, p, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  healthz: () => req(TRILC, '/healthz'),
  chainStatus: () => req(TRILC, '/internal/v1/init/chain/status'),
  roleCatalog: () => req(TRILC, '/internal/v1/init/role-catalog'),
  assemble: (ceoName, selections, entry = 'trilc-chat') => req(TRILC, '/internal/v1/init/assemble', { method: 'POST', body: JSON.stringify({ ceoName, selections, entry }) }),
  selfcheckRun: () => req(TRILC, '/internal/v1/init/selfcheck/run', { method: 'POST', body: '{}' }),
  syncRun: (entry = 'trilc-chat') => req(TRILC, '/internal/v1/init/sync/run', { method: 'POST', body: JSON.stringify({ entry }) }),
  syncStatus: () => req(TRILC, '/internal/v1/init/sync/status'),
  confirmCheck: () => req(TRILC, '/internal/v1/init/confirm/check'),
  confirm: () => req(TRILC, '/internal/v1/init/confirm', { method: 'POST', body: '{}' }),
  reset: (includeProject = false, purgeWorktree = false) => req(TRILC, '/internal/v1/init/reset', { method: 'POST', body: JSON.stringify({ includeProject, purgeWorktree }) }),
  firstCollab: (status) => req(TRILC, '/internal/v1/init/ready/first-collab', { method: 'POST', body: JSON.stringify({ status }) }),
  agents: () => req(TRILC, '/internal/v1/agents'),
};
const trimc = {
  healthz: () => req(TRIMC, '/healthz', {}, 20000),
  syncStatus: () => req(TRIMC, '/internal/v1/config/sync/status', {}, 20000),
  heartbeat: () => req(TRIMC, '/internal/v1/heartbeat', { method: 'POST', body: JSON.stringify({ nodeId: 'e2e-probe', state: 'degraded', queueSize: 0, uptimeSeconds: 1, agentCoreVersion: 'e2e' }) }, 20000),
};

// ── 断言 ──
function assert(cond, msg) { if (!cond) throw new Error(`ASSERT FAIL: ${msg}`); }
function assertEq(a, b, msg) { assert(a === b, `${msg}（${JSON.stringify(a)} != ${JSON.stringify(b)}）`); }
function assertIn(v, arr, msg) { assert(arr.includes(v), `${msg}（${v} 不在 [${arr}]）`); }

// ── 测试集回写（e2e-test-suite.json 的 status/lastRun/runner）──
const SUITE_PATH = require('node:path').resolve(__dirname, '../../../docs/execution/e2e-test-suite.json');
const fs = require('node:fs');
const results = [];
function record(id, status, detail) { results.push({ id, status, detail: (detail || '').slice(0, 200), at: new Date().toISOString() }); }
function flushResults(runnerName) {
  const suite = JSON.parse(fs.readFileSync(SUITE_PATH, 'utf8'));
  for (const r of results) {
    const c = suite.cases.find((x) => x.id === r.id);
    if (c) { c.status = r.status; c.lastRun = r.at; c.runner = runnerName; c.note = r.detail; }
  }
  fs.writeFileSync(SUITE_PATH, JSON.stringify(suite, null, 2) + '\n');
  const pass = results.filter((r) => r.status === 'pass').length;
  console.log(`\n[${runnerName}] ${pass}/${results.length} pass — suite JSON 已回写`);
  return { pass, total: results.length };
}

module.exports = { daemon, trimc, assert, assertEq, assertIn, record, flushResults, results };
