#!/usr/bin/env node
// ── 共学周记 ADE CLI（DCE + Close 确定性执行体）──
// 规范：docs/workflow/operating-records/项目级 AI 共学周记/ade-journal-recording-spec.md
// 链路：事件/prompt 触发 → agent Qualify + 草拟 entry.json → 本 CLI qualify/append → close
//
// 用法：
//   node journal-cli.mjs init                       # 建当周草稿骨架（已存在则报 already）
//   node journal-cli.mjs qualify --entry entry.json # 机械资格检查（结构+脱敏扫描）
//   node journal-cli.mjs append  --entry entry.json # 按固定格式追加为下一个 2.n
//   node journal-cli.mjs close   [--week 2026-W34]  # 收口五查 + 终态
//
// 环境变量：TRIMV_JOURNAL_ROOT 覆盖 operating-records 根（测试隔离用）。

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const RECORDS_ROOT = process.env.TRIMV_JOURNAL_ROOT
  ?? join(SCRIPT_DIR, '..', '..', 'docs', 'workflow', 'operating-records');
const SPEC_DIR = join(RECORDS_ROOT, '项目级 AI 共学周记');
const RUN_LOG = join(SPEC_DIR, 'journal-run-log.jsonl');

// ── 周解析：active 优先（OP index status=active / latestActiveWeek），回退最大周号 ──
function listWeekDirs() {
  return readdirSync(RECORDS_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^2026-W\d+$/.test(e.name))
    .map((e) => e.name);
}
function weekNum(w) { return parseInt(w.slice(w.indexOf('W') + 1), 10); }
function resolveCurrentWeek() {
  const dirs = listWeekDirs();
  if (dirs.length === 0) throw new Error(`operating-records 下无 2026-Wnn 周目录（root=${RECORDS_ROOT}）`);
  const active = [];
  for (const d of dirs) {
    const opFiles = readdirSync(join(RECORDS_ROOT, d)).filter((f) => /^OP-.*\.json$/.test(f));
    for (const f of opFiles) {
      try {
        const j = JSON.parse(readFileSync(join(RECORDS_ROOT, d, f), 'utf8'));
        if (j.status === 'active' || j.latestActiveWeek === true) { active.push(d); break; }
      } catch { /* 坏 index 跳过 */ }
    }
  }
  const pool = active.length > 0 ? active : dirs;
  return pool.sort((a, b) => weekNum(a) - weekNum(b)).at(-1);
}
function journalPath(week) {
  return join(RECORDS_ROOT, week, `project-ai-community-weekly-${week}.md`);
}

// ── entry.json 固定字段 ──
const FIELDS = ['title', 'phenomenon', 'detail', 'solution', 'impact', 'projExp', 'modelSelfCheck'];
const FIELD_LABELS = {
  phenomenon: '现象', detail: '具体表现', solution: '解决方案', impact: '问题影响',
  projExp: '项目经验', modelSelfCheck: '模型自查',
};
// 脱敏扫描：API key 类高危形态（命中即 REJECTED，语义脱敏仍归 agent/CEO 裁决）
const SENSITIVE_PATTERNS = [
  [/sk-[A-Za-z0-9]{16,}/, '疑似 API key（sk-…）'],
  [/(api[_-]?key|secret|password|token)\s*[:=]\s*["']?[A-Za-z0-9_\-]{12,}/i, '疑似凭据赋值'],
];

function loadEntry(p) {
  const raw = readFileSync(p, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch (e) { throw new Error(`entry.json 解析失败: ${e.message}`); }
  const problems = [];
  for (const f of FIELDS) {
    if (typeof j[f] !== 'string' || !j[f].trim()) problems.push(`缺字段或为空: ${f}`);
  }
  if (j.title && j.title.length > 60) problems.push(`title 超 60 字（现 ${j.title.length}）`);
  return { entry: j, problems };
}

function scanSensitive(entry) {
  const hits = [];
  const all = FIELDS.map((f) => entry[f] ?? '').join('\n');
  for (const [re, label] of SENSITIVE_PATTERNS) {
    if (re.test(all)) hits.push(label);
  }
  return hits;
}

// ── 固定格式渲染（DCE 核心：格式由代码保证，不靠 agent 纪律）──
function renderEntry(entry, n) {
  const body = (s) => String(s ?? '').trim().replace(/\s*\n\s*/g, '\n  ');
  return `### 2.${n} ${entry.title.trim()}

- ${FIELD_LABELS.phenomenon}：
  ${body(entry.phenomenon)}
- ${FIELD_LABELS.detail}：
  ${body(entry.detail)}
- ${FIELD_LABELS.solution}：
  ${body(entry.solution)}
- ${FIELD_LABELS.impact}：
  ${body(entry.impact)}

当前经验：

- ${FIELD_LABELS.projExp}：
  ${body(entry.projExp)}
- ${FIELD_LABELS.modelSelfCheck}：
  ${body(entry.modelSelfCheck)}
`;
}

let AUDIT_LOG_ERROR = null;
function logRun(rec) {
  try {
    if (!existsSync(SPEC_DIR)) mkdirSync(SPEC_DIR, { recursive: true });
    writeFileSync(RUN_LOG, JSON.stringify({ runId: randomUUID().slice(0, 8), ts: new Date().toISOString(), ...rec }) + '\n', { flag: 'a' });
  } catch (e) {
    // 升档裁定⑦：吞错改告警——防 score S5 误判 FAIL 冤枉好 run（envelope 记 audit_log_error）
    AUDIT_LOG_ERROR = `journal-run-log 写入失败: ${e.message}`;
    console.error(`WARN: ${AUDIT_LOG_ERROR}`);
  }
}

function nextEntryNo(md) {
  const nums = [...md.matchAll(/^### 2\.(\d+)\s/gm)].map((m) => parseInt(m[1], 10));
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

function bumpSyncedAt(md) {
  const today = new Date().toISOString().slice(0, 10);
  return md.replace(/^(- lastSyncedAt:).*$/m, `$1 ${today}`);
}

// ── 命令 ──
function cmdBegin(title) {
  // ADE 登记段：程序去重提示 + 生成 runId（贯穿 qualify→append→close 的执行链）
  const week = resolveCurrentWeek();
  const p = journalPath(week);
  let dup = null;
  if (title && existsSync(p)) {
    const md = readFileSync(p, 'utf8');
    if (new RegExp(`^### 2\\.\\d+ ${String(title).trim().replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*$`, 'm').test(md)) dup = '同题条目已存在';
  }
  const runId = randomUUID().slice(0, 8);
  logRun({ action: 'begin', runId, week, title: title ?? null, dupHint: dup });
  if (dup) {
    console.log(`ESCALATED: ${dup}（${p}）——修订走 CEO 明确指令，勿重复登记`);
    process.exit(3);
  }
  console.log(`RUN ${runId} week=${week}`);
  console.log(p);
}

function readRunLog() {
  if (!existsSync(RUN_LOG)) return [];
  return readFileSync(RUN_LOG, 'utf8').split('\n').filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function cmdInit() {
  const week = resolveCurrentWeek();
  const p = journalPath(week);
  if (existsSync(p)) { console.log(`BLOCKED: 当周文件已存在 ${p}（init 只建缺失草稿）`); process.exit(2); }
  mkdirSync(dirname(p), { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const skel = `# 项目级 AI 共学周记 — ${week}

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/${week}/project-ai-community-weekly-${week}.md
- syncMode: audit-record
- lastSyncedAt: ${today}

> 记录人：小贾（CEOChiefOfStaff）
> 日期：${today}

---

## 2. 本周观察到的大模型能力问题与体验
`;
  writeFileSync(p, skel);
  logRun({ action: 'init', week, path: p });
  console.log(`APPENDED(init): ${p}`);
}

function cmdQualify(entryPath, runId) {
  const { entry, problems } = loadEntry(entryPath);
  const hits = scanSensitive(entry);
  for (const p of problems) console.log(`FAIL ${p}`);
  for (const h of hits) console.log(`SENSITIVE ${h}`);
  if (problems.length > 0) { console.log('REJECTED: 结构不完整（ESCALATED → agent 补字段）'); logRun({ action: 'qualify', verdict: 'REJECTED', problems, runId: runId ?? null }); process.exit(1); }
  if (hits.length > 0) { console.log('ESCALATED: 命中脱敏扫描，需 agent/CEO 裁决脱敏'); logRun({ action: 'qualify', verdict: 'ESCALATED', hits, runId: runId ?? null }); process.exit(3); }
  console.log('QUALIFIED: 结构完整，脱敏扫描通过（语义四问仍归 agent）');
  logRun({ action: 'qualify', verdict: 'QUALIFIED', runId: runId ?? null });
}

function cmdAppend(entryPath, runId, revisionArg) {
  const { entry, problems } = loadEntry(entryPath);
  if (problems.length > 0) { console.log(`REJECTED: ${problems.join('; ')}`); process.exit(1); }
  if (revisionArg) {
    // RETRY revision 路径（升档裁定：本 run 条目改动须有 revision 行授权——他人/已签发绝对禁区）
    const chain = readRunLog().filter((r) => r.runId === runId);
    const targetNo = parseInt(revisionArg, 10);
    const prior = chain.find((r) => r.action === 'append' && r.verdict === 'APPENDED' && r.entryNo === targetNo);
    if (!prior) {
      console.log(`REJECTED: revision 越权——runId ${runId} 链上无 entryNo=${targetNo} 的 APPENDED 行（仅本 run 产出条目可 revision）`);
      logRun({ action: 'append', subtype: 'revision', verdict: 'REJECTED', week: resolveCurrentWeek(), runId: runId ?? null, entryNo: targetNo });
      process.exit(1);
    }
    const week = resolveCurrentWeek();
    const p = journalPath(week);
    const md = readFileSync(p, 'utf8');
    const headRe = new RegExp(`^### 2\\.${targetNo} [^\n]*$`, 'm');
    const hm = md.match(headRe);
    if (!hm) { console.log(`BLOCKED: 找不到条目 2.${targetNo}（revision 目标缺失）`); process.exit(2); }
    const start = md.indexOf(hm[0]);
    const rest = md.slice(start + hm[0].length);
    const nxt = rest.search(/^### 2\.\d+ |^## /m);
    const end = start + hm[0].length + (nxt >= 0 ? nxt : rest.length);
    const rendered = renderEntry(entry, targetNo);
    const out = bumpSyncedAt(md.slice(0, start) + rendered + '\n' + md.slice(end).replace(/^\n+/, '\n'));
    writeFileSync(p, out);
    console.log(`REVISED: ${p} 条目 2.${targetNo}「${entry.title.trim()}」（revision，评分驱动修订）`);
    logRun({ action: 'append', subtype: 'revision', verdict: 'REVISED', week, entryNo: targetNo, title: entry.title.trim(), path: p, runId: runId ?? null });
    return;
  }
  const week = resolveCurrentWeek();
  const p = journalPath(week);
  if (!existsSync(p)) { console.log(`BLOCKED: 当周文件不存在 ${p} —— 先运行 init`); logRun({ action: 'append', verdict: 'BLOCKED', week, runId: runId ?? null }); process.exit(2); }
  const md = readFileSync(p, 'utf8');
  if (entry.title && new RegExp(`^### 2\\.\\d+ ${entry.title.trim().replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*$`, 'm').test(md)) {
    console.log('BLOCKED: 同题条目已存在（去重）——如需修订走 CEO 明确指令'); logRun({ action: 'append', verdict: 'BLOCKED-dup', week, runId: runId ?? null }); process.exit(2);
  }
  const n = nextEntryNo(md);
  const rendered = renderEntry(entry, n);
  // 插入点：最后一个 ### 2.n 条目之后、下一个 ## 级标题之前（无则 EOF）
  const headings = [...md.matchAll(/^##\s/gm)].map((m) => m.index);
  const lastEntryMatches = [...md.matchAll(/^### 2\.\d+\s/gm)];
  let insertAt = md.length;
  if (lastEntryMatches.length > 0) {
    const lastEntryEnd = lastEntryMatches.at(-1).index;
    const nextH2 = headings.find((h) => h > lastEntryEnd);
    insertAt = nextH2 ?? md.length;
  } else {
    // 无条目：插到「## 2.」标题之后
    const sec2 = md.match(/^## 2\..*$/m);
    if (!sec2) { console.log('BLOCKED: 找不到「## 2.」节标题（文件结构异常）'); process.exit(2); }
    insertAt = sec2.index + sec2[0].length + 1;
  }
  const out = bumpSyncedAt(md.slice(0, insertAt).replace(/\n*$/, '\n\n') + rendered + '\n' + md.slice(insertAt).replace(/^\n+/, ''));
  writeFileSync(p, out);
  console.log(`APPENDED: ${p} 条目 2.${n}「${entry.title.trim()}」`);
  logRun({ action: 'append', verdict: 'APPENDED', week, entryNo: n, title: entry.title.trim(), path: p, runId: runId ?? null });
}

function cmdClose(weekArg, runId, verdictArg, noteArg) {
  // Close CLI：校验 agent 裁决（Close Skill 输出）+ 收口五查 + 持久化终态。
  // --run 存在时要求裁决值合法且 run 链完整（begin→qualify→append 同 runId）。
  const week = weekArg ?? resolveCurrentWeek();
  const p = journalPath(week);
  const checks = [];
  const ok = (name, pass, note = '') => { checks.push(`${pass ? 'PASS' : 'FAIL'} C-${name}${note ? `（${note}）` : ''}`); return pass; };
  let all = true;
  if (!existsSync(p)) {
    console.log(`BLOCKED: ${p} 不存在`); logRun({ action: 'close', verdict: 'BLOCKED', week, runId: runId ?? null }); process.exit(2);
  }
  // 裁决校验（ADE：Close CLI 是裁决的确定性校验者，不是裁决的发起者）
  if (runId) {
    const origVerdict = verdictArg;
    const verdictNorm = (verdictArg ?? '').toLowerCase();
    const VALID = ['approved', 'escalated', 'retry']; // 三态（FROZEN 留口正名后扩值——2026-08-28 裁定）
    if (!VALID.includes(verdictNorm)) {
      console.log(`REJECTED: --verdict 必须是 ${VALID.join('|')}（agent Close Skill 的语义裁决；FROZEN 留口）`); process.exit(1);
    }
    const chain = readRunLog().filter((r) => r.runId === runId);
    const has = (a) => chain.some((r) => r.action === a);
    all = ok('0 run 链完整', has('begin') && has('append'), `begin=${has('begin')} qualify=${has('qualify')} append=${has('append')}`) && all;
    all = ok('0b agent 裁决在案', VALID.includes(verdictNorm), `verdict=${verdictNorm}`) && all;
    // RETRY→APPROVED 前置（裁定 2②）：retry 行后同 runId 须有 score PASS 行（重评必经，机器可校验）
    const retryRows = chain.filter((r) => r.action === 'close' && r.verdict === 'RETRY');
    if (verdictNorm === 'approved' && retryRows.length > 0) {
      const lastRetryTs = retryRows.at(-1).ts;
      const passAfter = chain.some((r) => r.action === 'score' && r.verdict === 'PASS' && r.ts > lastRetryTs);
      if (!passAfter) {
        console.log('REJECTED: RETRY→APPROVED 前置不满足——retry 行后同 runId 须有 score PASS 行（重评必经）');
        logRun({ action: 'close', verdict: 'REJECTED', week, runId, agentVerdict: verdictNorm, note: 'approve-precondition-fail' });
        process.exit(1);
      }
    }
    // 程序化三态（裁定 8）：agent 裁 approved 但最近 score FAIL（无后继 PASS）→ 校验者裁 RETRY
    const scoreRows = chain.filter((r) => r.action === 'score');
    const lastScore = scoreRows.at(-1);
    let effective = verdictNorm;
    if (verdictNorm === 'approved' && lastScore && lastScore.verdict === 'FAIL') {
      effective = 'retry';
      console.log('NOTE: agent 裁 approved 但评分未达线（最近 score FAIL）——校验者裁 RETRY');
    }
    if (effective === 'escalated') {
      console.log(`CLOSE ${week}:`);
      for (const c of checks) console.log('  ' + c);
      console.log('ESCALATED（agent 语义裁决：需 CEO 处理）');
      logRun({ action: 'close', verdict: 'ESCALATED', week, runId, agentVerdict: origVerdict, note: noteArg ?? null });
      process.exit(3);
    }
    if (effective === 'retry') {
      console.log(`CLOSE ${week}:`);
      for (const c of checks) console.log('  ' + c);
      console.log('RETRY（评分未达线——按 items 修订后 append --revision 重评）');
      logRun({ action: 'close', verdict: 'RETRY', week, runId, agentVerdict: origVerdict, note: noteArg ?? null });
      process.exit(4);
    }
  }
  const md = readFileSync(p, 'utf8');
  all = ok('1 路径在当周目录', p.includes(join(RECORDS_ROOT, week))) && all;
  const entries = [...md.matchAll(/^### 2\.(\d+)\s.*$/gm)];
  let structOk = entries.length > 0;
  for (const labels of [['现象', '具体表现', '解决方案', '问题影响'], ['项目经验', '模型自查']]) {
    for (const l of labels) if (!md.includes(l)) structOk = false;
  }
  all = ok('2 条目五件结构', structOk, `${entries.length} 条`) && all;
  all = ok('3 元信息+记录人行', /^## 文档同步元信息$/m.test(md) && /sourceOfTruth:/.test(md) && /^> 记录人：/m.test(md)) && all;
  const today = new Date().toISOString().slice(0, 10);
  all = ok('4 lastSyncedAt 为今日', new RegExp(`^- lastSyncedAt: ${today}$`, 'm').test(md)) && all;
  let clean = false;
  try {
    const st = execFileSync('git', ['status', '--porcelain', '--', p], { cwd: join(RECORDS_ROOT, '..', '..', '..'), encoding: 'utf8' });
    clean = st.trim() === '';
  } catch { clean = false; /* 非 git 环境 */ }
  all = ok('5 git 已提交', clean, clean ? '' : '未提交（或明示由编排层补）') && all;
  console.log(`CLOSE ${week}:`);
  for (const c of checks) console.log('  ' + c);
  const verdict = all ? 'APPROVED' : 'ESCALATED';
  console.log(verdict);
  logRun({ action: 'close', verdict, week, runId: runId ?? null, agentVerdict: verdictArg ?? null, note: noteArg ?? null });
  process.exit(all ? 0 : 1);
}

// ── Score 段（升档裁定落地：确定性覆盖检查 S1-S7，正典链追加段）──
function entryBlocks(md) {
  // 返回 [{no, title, body}] 依出现序
  const heads = [...md.matchAll(/^### 2\.(\d+) (.*)$/gm)];
  return heads.map((m, i) => {
    const bodyStart = m.index + m[0].length;
    let bodyEnd;
    if (i + 1 < heads.length) bodyEnd = heads[i + 1].index;
    else {
      const nx = md.slice(bodyStart).search(/^## /m);
      bodyEnd = nx >= 0 ? bodyStart + nx : md.length;
    }
    return { no: parseInt(m[1], 10), title: m[2].trim(), body: md.slice(bodyStart, bodyEnd) };
  });
}

function cmdScore(weekArg, runIdArg, jsonFlag, skillJsonPath) {
  const week = weekArg ?? resolveCurrentWeek();
  const p = journalPath(week);
  if (!existsSync(p)) { console.log(`BLOCKED: ${p} 不存在`); logRun({ action: 'score', verdict: 'BLOCKED', week, runId: runIdArg ?? null }); process.exit(2); }
  const md = readFileSync(p, 'utf8');
  const chain = runIdArg ? readRunLog().filter((r) => r.runId === runIdArg) : [];
  const items = [];
  const add = (id, pass, weight, evidence, extra) => items.push({ id, score: pass ? weight : 0, max: weight, pass, evidence_ref: evidence, omission: !pass, ...(extra ?? {}) });

  // 条目定位（裁定 S5 补强细则）：runId 链上最近 APPENDED 行的 entryNo+title
  const appends = chain.filter((r) => r.action === 'append' && r.verdict === 'APPENDED');
  const lastAppend = appends.at(-1);
  const blocks = entryBlocks(md);
  const block = lastAppend ? blocks.find((b) => b.no === lastAppend.entryNo) : undefined;

  // S1 五件结构（本次 2.n 逐件解析，裁定 5）
  let s1 = false; const s1Miss = [];
  if (block) {
    const lines = block.body.split('\n');
    const bodyAfter = (prefix) => {
      const i = lines.findIndex((l) => l.trim().startsWith(prefix));
      if (i < 0) return null;
      for (let j = i + 1; j < lines.length; j++) {
        const t = lines[j].trim();
        if (t !== '') return t;
        if (lines[j].startsWith('- ') || lines[j].startsWith('当前经验') || lines[j].startsWith('## ')) return null;
      }
      return null;
    };
    for (const pre of ['- 现象：', '- 具体表现：', '- 解决方案：', '- 问题影响：', '- 项目经验：', '- 模型自查：', '当前经验：']) {
      const b = bodyAfter(pre);
      if (b === null) s1Miss.push(pre.replace(/[:：]/g, ''));
    }
    s1 = s1Miss.length === 0;
  } else { s1Miss.push('本次 run 条目未定位（无 APPENDED 行或条目缺失）'); }
  add('S1', s1, 20, p + (block ? `#2.${block.no}` : ''), s1Miss.length ? { missing: s1Miss } : undefined);

  // S2 元信息头+lastSyncedAt 当日
  const today = new Date().toISOString().slice(0, 10);
  const s2 = /^## 文档同步元信息$/m.test(md) && /sourceOfTruth:/.test(md) && new RegExp(`^- lastSyncedAt: ${today}$`, 'm').test(md);
  add('S2', s2, 10, p + '#header');

  // S3 落盘路径在当周目录
  const s3 = p.includes(join(RECORDS_ROOT, week));
  add('S3', s3, 10, p);

  // S4 同题去重+2.x 序号唯一（断号=告警不计分，裁定 5）
  const titles = blocks.map((b) => b.title);
  const dupTitles = titles.filter((t, i) => titles.indexOf(t) !== i);
  const nos = blocks.map((b) => b.no).sort((a, b) => a - b);
  const gaps = [];
  for (let i = 0; i < nos.length - 1; i++) if (nos[i + 1] !== nos[i] + 1) gaps.push(`${nos[i]}→${nos[i + 1]}`);
  const s4 = dupTitles.length === 0 && new Set(nos).size === nos.length;
  add('S4', s4, 10, `${blocks.length} 条目`, { ...(dupTitles.length ? { dup: dupTitles } : {}), ...(gaps.length ? { seq_gap_warning: gaps } : {}) });

  // S5 run 链完整（begin+qualify QUALIFIED+append APPENDED；QUALIFIED 必须入链，裁定 5——W35 BLOCKED 样本实证必要性）
  const hasBegin = chain.some((r) => r.action === 'begin');
  const hasQual = chain.some((r) => r.action === 'qualify' && r.verdict === 'QUALIFIED');
  const s5 = Boolean(runIdArg && hasBegin && hasQual && appends.length > 0);
  add('S5', s5, 15, `${RUN_LOG} runId=${runIdArg ?? '(未提供)'}`, { begin: hasBegin, qualified: hasQual, appended: appends.length > 0 });

  // S6 脱敏复核（对落盘条目文本重扫）
  const blockText = block ? block.body : '';
  const hits2 = [];
  for (const [re, label] of SENSITIVE_PATTERNS) if (re.test(blockText)) hits2.push(label);
  add('S6', block ? hits2.length === 0 : false, 5, block ? `#2.${block.no}` : 'n/a', hits2.length ? { hits: hits2 } : undefined);

  // S7 守恒基线（裁定 2①）：非本 run 产物条目 diff 零变化——期望集=run-log 全历史 APPENDED/REVISED 按 entryNo 最新 title；本 run 条目改动须 revision 授权（S4/revision 链校验）
  const allLog = readRunLog();
  const expected = new Map();
  for (const r of allLog) {
    if (r.action === 'append' && (r.verdict === 'APPENDED' || r.verdict === 'REVISED') && r.entryNo != null) {
      expected.set(r.entryNo, { title: r.title, runId: r.runId });
    }
  }
  const actual = new Map(blocks.map((b) => [b.no, b.title]));
  const s7miss = [];
  for (const [no, exp] of expected) {
    if (no === lastAppend?.entryNo) continue; // 本 run 条目（revision 授权域）
    if (!actual.has(no) || actual.get(no) !== exp.title) s7miss.push(`2.${no}`);
  }
  const extra = [];
  for (const [no] of actual) if (!expected.has(no)) extra.push(`2.${no}`);
  const s7 = s7miss.length === 0 && extra.length === 0;
  add('S7', s7, 10, `${RUN_LOG}`, { ...(s7miss.length ? { changed_others: s7miss } : {}), ...(extra.length ? { unregistered: extra } : {}) });

  // W 语义分合并（可选 --skill-json：{w1..w4} 各 0-5；W4 含通用性+对外口径双判问，裁定 6）
  let w = null; let total = null;
  if (skillJsonPath && existsSync(skillJsonPath)) {
    try {
      const j = JSON.parse(readFileSync(skillJsonPath, 'utf8'));
      w = ['w1', 'w2', 'w3', 'w4'].map((k) => Math.max(0, Math.min(5, parseInt(j[k], 10) || 0)));
      total = items.reduce((a, i) => a + i.score, 0) + w.reduce((a, b) => a + b, 0);
    } catch { console.error('WARN: --skill-json 解析失败，W 分未合并'); }
  }
  const allPass = items.every((i) => i.pass);
  const verdict = allPass && (total === null || total >= 90) ? 'PASS' : 'FAIL';
  logRun({ action: 'score', verdict, week, runId: runIdArg ?? null, subtotal_s: items.reduce((a, i) => a + i.score, 0), total, omission: !allPass });

  if (jsonFlag) {
    try { sys_stdout_utf8(); } catch {}
    console.log(JSON.stringify({
      protocol: 'journal-score', version: '1.0', mode: 'score',
      check_time: new Date().toISOString(), week, runId: runIdArg ?? null,
      status: verdict, summary: { items_total: items.length, items_failed: items.filter((i) => !i.pass).length, omission: !allPass, errors: 0 },
      items, w_scores: w, total, threshold: { must_pass: 'S1-S7', total_min: 90 },
      audit_log_error: AUDIT_LOG_ERROR,
      errors: [],
    }, null, 2));
  } else {
    console.log(`SCORE ${week}:`);
    for (const i of items) console.log(`  ${i.pass ? 'PASS' : 'FAIL'} ${i.id} ${i.score}/${i.max}（${i.evidence_ref}）`);
    if (w) console.log(`  W [${w.join('/')}] = ${w.reduce((a, b) => a + b, 0)}/20`);
    console.log(`${verdict}（S ${items.reduce((a, i) => a + i.score, 0)}/80${total !== null ? `；total ${total}/100` : '；W 未合并——总分门槛 90 含 W≥10'}）`);
  }
  process.exit(0);
}
function sys_stdout_utf8() { /* node 输出默认 utf8，占位对齐 patrol 惯例 */ }
const [, , cmd, ...rest] = process.argv;
const arg = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};
const argsHas = (name) => rest.includes(name);
try {
  switch (cmd) {
    case 'begin': cmdBegin(arg('--title')); break;
    case 'init': cmdInit(); break;
    case 'qualify': cmdQualify(arg('--entry'), arg('--run')); break;
    case 'append': cmdAppend(arg('--entry'), arg('--run'), arg('--revision')); break;
    case 'score': cmdScore(arg('--week'), arg('--run'), argsHas('--json'), arg('--skill-json')); break;
    case 'close': cmdClose(arg('--week'), arg('--run'), arg('--verdict'), arg('--note')); break;
    default:
      console.error('用法: journal-cli.mjs begin [--title] | init | qualify --entry <json> [--run id] | append --entry <json> [--run id] [--revision <entryNo>] | score [--week] --run <id> [--json] [--skill-json <path>] | close [--week] [--run id --verdict approved|escalated|retry --note ...]');
      process.exit(64);
  }
} catch (e) {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
}
