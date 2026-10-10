#!/usr/bin/env node
// eligibility-gate.mjs — DEM-003 资格门三查判读（影子期·只读数不拦截）
//
// 三查正身（CTO 方案稿 cto-window-a-gate-three-checks-plan-20261010.md §一 + COO 提案 A/C 对表）：
//   查一 结构 schema : 树头部三件套(sourceOfTruth/syncMode/lastSyncedAt)+owner(COS 起始位)
//                      +准入标记(AUTOMATION-READY 两态)+节点六要素齐+树尾 COS 收口段
//   查二 自含 resolve: 输入料指针逐条 resolve（路径实存+@hash 可解）·零悬空
//   查三 锚机读化   : 完成判据=值面断言形(禁人工叙述型)+失败行为=停/报/回滚
//                      +节点段内零待裁零确认点（全文级命中列 WARN 人工复核）
//
// 节点格式约定（模板 v1 建议形·候 COO 拆树模板 v1 对表校准）:
//   节点段以 `### 节点` 或 `#### 节点` 或 `- [ ]`/`1.` 列表项开头，
//   六要素以行内键值表示: 执行者:/输入:/动作:/输出:/完成判据:/失败行为:
//
// 红线: 零写面（只读扫树·输出仅 stdout 或显式 --out 指定路径）·零网络·token/值面零接触。
// 用法: node scripts/fade/eligibility-gate.mjs <tree-file.md> [--out <json-path>]
//       node scripts/fade/eligibility-gate.mjs --selftest   （内置双向自证）

import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, isAbsolute } from 'node:path';

const REPO_ROOT = resolve(new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

// ---------- 判据 schema ----------

const HEADER_REQUIRED = ['sourceOfTruth', 'syncMode', 'lastSyncedAt'];
const NODE_KEYS = ['执行者', '输入', '动作', '输出', '完成判据', '失败行为'];
const PENDING_WORDS = ['候裁', '待裁', '待确认', '候 CEO', '候 BOD', '候联审', '人工拍板', '待拍板'];
const ASSERT_WORDS = ['grep', 'assert', 'expect', 'json', 'schema', '读数', 'md5', 'sha', 'exit', '退出码', '阈值', '==', '≥', '≤', 'mtime', '值面', '断言', 'commit', '对表', '等于', '非空'];
const ABORT_WORDS = ['停', '报', '回滚', '即停', '不滑步'];

function linesOf(text) { return text.split(/\r?\n/); }

// ---------- 查一 结构 schema ----------

function check1Schema(text) {
  const lines = linesOf(text);
  const evidence = [];
  const fail = [];

  for (const k of HEADER_REQUIRED) {
    const hit = lines.some((l) => l.trim().startsWith('- ') && l.includes(`${k}:`));
    (hit ? evidence : fail).push(`头部字段 ${k}: ${hit ? '在位' : '缺失'}`);
  }
  const ownerHit = lines.some((l) => /^\s*[-*]?\s*owner\s*[:：]/.test(l) || l.includes('owner（COS'));
  (ownerHit ? evidence : fail).push(`owner 起始位: ${ownerHit ? '在位' : '缺失（模板 v1 要件）'}`);

  const readyHit = /AUTOMATION-READY/.test(text);
  (readyHit ? evidence : fail).push(`准入标记 AUTOMATION-READY: ${readyHit ? '在位' : '缺失（模板 v1 要件）'}`);

  // 节点解析：`### 节点…`/`#### 节点…` 段，或含 ≥4 个六要素键的连续块
  const nodes = [];
  let cur = null;
  for (const l of lines) {
    const h = l.match(/^#{3,4}\s*(节点|node)/i);
    if (h) { if (cur) nodes.push(cur); cur = { head: l.trim(), keys: new Set() }; continue; }
    if (cur) {
      for (const k of NODE_KEYS) {
        if (new RegExp(`^\\s*[-*]?\\s*${k}\\s*[:：]`).test(l)) cur.keys.add(k);
      }
      const done = l.match(/^#{1,4}\s/);
      if (done && !/^#{3,4}\s*(节点|node)/i.test(l)) { nodes.push(cur); cur = null; }
    }
  }
  if (cur) nodes.push(cur);

  if (nodes.length === 0) {
    fail.push('节点段: 零命中（无 `### 节点` 形段——模板 v1 建议形·候模板推广）');
  } else {
    for (const [i, n] of nodes.entries()) {
      const missing = NODE_KEYS.filter((k) => !n.keys.has(k));
      if (missing.length === 0) evidence.push(`节点#${i + 1}「${n.head}」六要素齐`);
      else fail.push(`节点#${i + 1}「${n.head}」缺要素: ${missing.join('、')}`);
    }
  }

  const closeHit = /^#{1,4}\s*(收口|COS 收口)/m.test(text) || /树尾\s*COS\s*收口段/.test(text);
  (closeHit ? evidence : fail).push(`树尾 COS 收口段: ${closeHit ? '在位' : '缺失'}`);

  return { pass: fail.length === 0, evidence, fail };
}

// ---------- 查二 自含 resolve ----------

function extractPointers(text) {
  const out = new Set();
  // 判据边界（v1 定稿·自指/待产物豁免）:
  //   sourceOfTruth 行=自指声明非输入依赖；输出 行=待产物（产出后才有）——两行不提取。
  //   查二审对象=输入料指针（依赖物）·「零悬空依赖」语义域。
  const skipRe = /^\s*[-*]?\s*(sourceOfTruth|输出)\s*[:：]/;
  const pathRe = /(?:trees|docs|scripts|src|test)\/[\w\-./]+\.\w+|[A-Za-z]:[\/\\][\w\-. \\/]+\.\w+/g;
  for (const l of linesOf(text)) {
    if (skipRe.test(l)) continue;
    for (const m of l.matchAll(pathRe)) out.add(m[0]);
    for (const m of l.matchAll(/@([0-9a-f]{7,40})\b/g)) out.add(`@${m[1]}`);
  }
  return [...out];
}

// v1.1 解析路由（W41 干跑校准增量·2026-10-11 栏 A）:
//   R1 直解析        : 绝对路径 / 仓根相对
//   R2 周平面短形     : `trees/...` = 周平面 cwd 惯例（tools-ctx-cwd-baseline 族）→
//                      尝试 docs/workflow/operating-records/*/trees/... 全周扫描
//   R3 兄弟仓根尝试   : src|test|docs|scripts 开头失败路径 → 遍历兄弟仓根拼接
//                      （跨仓指针族：树文档引 TriRLC/TriMLC/TriModel 等仓内路径·机位断言=dev 布局）
const SIBLING_ROOTS = ['TriRLC', 'TriMLC', 'TriModel', 'TriCode', 'TriPilot', 'TriCompany', 'TriRMC', 'TriMMC'];
const SIBLINGS_BASE = resolve(REPO_ROOT, '..');

function resolvePointer(p) {
  if (p.startsWith('@')) {
    const h = p.slice(1);
    try {
      execFileSync('git', ['cat-file', '-e', h, '--'], { cwd: REPO_ROOT, stdio: 'pipe' });
      return { ok: true };
    } catch { return { ok: false, why: 'hash 不可解（git cat-file 失败）' }; }
  }
  // R1 直解析
  const cand = isAbsolute(p) ? p : resolve(REPO_ROOT, p);
  if (existsSync(cand)) return { ok: true };
  // R2 周平面短形
  if (p.startsWith('trees/')) {
    const orRoot = resolve(REPO_ROOT, 'docs/workflow/operating-records');
    try {
      for (const week of readdirSync(orRoot)) {
        if (existsSync(resolve(orRoot, week, p))) return { ok: true };
      }
    } catch { /* orRoot 不存在则跳过 */ }
  }
  // R3 兄弟仓根尝试
  if (/^(src|test|docs|scripts)\//.test(p)) {
    for (const sib of SIBLING_ROOTS) {
      if (existsSync(resolve(SIBLINGS_BASE, sib, p))) return { ok: true };
    }
  }
  return { ok: false, why: '路径不可解（R1 仓根/R2 周平面/R3 兄弟仓三路由均未命中）' };
}

function check2Resolve(text) {
  const pointers = extractPointers(text);
  const ok = []; const dangling = [];
  for (const p of pointers) {
    const r = resolvePointer(p);
    (r.ok ? ok : dangling).push(`${p}${r.ok ? '' : ' ← ' + r.why}`);
  }
  return {
    pass: dangling.length === 0,
    evidence: [`指针共 ${pointers.length} 条·可解 ${ok.length}·悬空 ${dangling.length}`],
    fail: dangling.slice(0, 20),
  };
}

// ---------- 查三 锚机读化 ----------

function nodeBodies(text) {
  const lines = linesOf(text);
  const bodies = [];
  let cur = null;
  for (const l of lines) {
    if (/^#{3,4}\s*(节点|node)/i.test(l)) { if (cur) bodies.push(cur); cur = { head: l.trim(), body: [] }; continue; }
    if (cur) {
      if (/^#{1,2}\s/.test(l)) { bodies.push(cur); cur = null; continue; }
      cur.body.push(l);
    }
  }
  if (cur) bodies.push(cur);
  return bodies;
}

function check3Anchors(text) {
  const evidence = []; const fail = []; const warn = [];
  const bodies = nodeBodies(text);

  if (bodies.length === 0) {
    fail.push('无节点段可判读（查三依赖节点段）');
  } else {
    for (const [i, n] of bodies.entries()) {
      const bodyText = n.body.join('\n');
      const crit = bodyText.match(/^\s*[-*]?\s*完成判据\s*[:：]\s*(.+)$/m);
      if (!crit) { fail.push(`节点#${i + 1}「${n.head}」缺完成判据行`); continue; }
      const v = crit[1];
      const assertive = ASSERT_WORDS.filter((w) => v.toLowerCase().includes(w.toLowerCase())).length >= 1;
      if (assertive) evidence.push(`节点#${i + 1} 完成判据=断言形（命中: ${v.slice(0, 40)}…）`);
      else fail.push(`节点#${i + 1} 完成判据疑人工叙述型（无断言词）: 「${v.slice(0, 50)}」`);

      const fb = bodyText.match(/^\s*[-*]?\s*失败行为\s*[:：]\s*(.+)$/m);
      if (!fb) { fail.push(`节点#${i + 1} 缺失败行为行`); continue; }
      const abortive = ABORT_WORDS.some((w) => fb[1].includes(w));
      if (abortive) evidence.push(`节点#${i + 1} 失败行为=停/报形`);
      else fail.push(`节点#${i + 1} 失败行为无 停/报/回滚 词: 「${fb[1].slice(0, 50)}」`);

      for (const w of PENDING_WORDS) {
        if (bodyText.includes(w)) fail.push(`节点#${i + 1} 节点段内含待裁词「${w}」（零待裁红线）`);
      }
    }
  }

  // 全文级待裁词=WARN（历史叙述段合法·人工复核定性）
  for (const w of PENDING_WORDS) {
    const m = linesOf(text).map((l, idx) => (l.includes(w) ? idx + 1 : null)).filter(Boolean);
    if (m.length) warn.push(`全文级「${w}」命中 ${m.length} 行（L${m.slice(0, 5).join(',L')}…）——历史叙述段合法·人工复核定性`);
  }

  return { pass: fail.length === 0, evidence, fail, warn };
}

// ---------- 主判读 ----------

export function judge(text) {
  const c1 = check1Schema(text);
  const c2 = check2Resolve(text);
  const c3 = check3Anchors(text);
  const allPass = c1.pass && c2.pass && c3.pass;
  return {
    schema_version: 'eligibility-gate/v1',
    ts_hint: '由调用方填 date 现查原值（脚本不取时·禁估读）',
    file: null,
    checks: { c1_schema: c1, c2_resolve: c2, c3_anchor: c3 },
    readiness_suggestion: allPass ? 'AUTOMATION-READY（建议值·机先判人后签·COS 签挂为准）' : 'FAIL（影子期只读数不拦截·人工复核）',
    warn: c3.warn,
  };
}

// ---------- CLI ----------

function selftest() {
  const good = `# 测试任务书（fixture 好树）
- sourceOfTruth: 本件（trees/x/task.md）
- syncMode: static
- lastSyncedAt: 2026-10-11T03:00:00+08:00
- owner: COS（起始位）
- 准入标记: AUTOMATION-READY（含人工段：签挂为人工）

### 节点 1 · 复制配置
- 执行者: FSD
- 输入: scripts/fade/eligibility-gate.mjs
- 动作: cp src.json dst.json
- 输出: dst.json + commit
- 完成判据: grep -c key dst.json == 1 值面对表
- 失败行为: 即停+报 COO，回滚锚=备份还原

## 收口
- 销账判据: 全节点完成判据绿
`;
  const bad = `# 缺料树（fixture 坏树）
- syncMode: static

### 节点 1 · 看看情况
- 执行者: FSD
- 输入: trees/x/ghost-missing.md
- 动作: 观察后处理
- 输出: 口头汇报
- 完成判据: 看起来正常即可
- 失败行为: 随机应变（候 CEO 裁）
`;
  const g = judge(good); const b = judge(bad);
  const ok1 = g.checks.c1_schema.pass && g.checks.c2_resolve.pass && g.checks.c3_anchor.pass;
  const ok2 = !b.checks.c1_schema.pass || !b.checks.c2_resolve.pass || !b.checks.c3_anchor.pass;
  const pass = ok1 && ok2;
  const out = { selftest: pass ? 'PASS（好树全 PASS+坏树复现 FAIL=双向验证过）' : 'FAIL', good: { readiness: g.readiness_suggestion, c1: g.checks.c1_schema.pass, c2: g.checks.c2_resolve.pass, c3: g.checks.c3_anchor.pass }, bad: { readiness: b.readiness_suggestion, c1_fails: b.checks.c1_schema.fail, c2_fails: b.checks.c2_resolve.fail, c3_fails: b.checks.c3_anchor.fail } };
  console.log(JSON.stringify(out, null, 2));
  process.exit(pass ? 0 : 1);
}

const argv = process.argv.slice(2);
if (argv[0] === '--selftest') { selftest(); }
else {
  const file = argv[0];
  if (!file) { console.error('用法: node eligibility-gate.mjs <tree-file.md> [--out <json>] | --selftest'); process.exit(2); }
  const abs = isAbsolute(file) ? file : resolve(process.cwd(), file);
  const text = readFileSync(abs, 'utf8');
  const r = judge(text);
  r.file = abs;
  const outPathIdx = argv.indexOf('--out');
  const json = JSON.stringify(r, null, 2);
  if (outPathIdx > -1 && argv[outPathIdx + 1]) { writeFileSync(argv[outPathIdx + 1], json, 'utf8'); console.log(`[eligibility-gate] 判读写出 → ${argv[outPathIdx + 1]}`); }
  else console.log(json);
}
