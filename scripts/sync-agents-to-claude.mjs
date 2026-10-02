// scripts/sync-agents-to-claude.mjs
// 把 .github/agents/*.agent.md（项目框架格式）同步为 .claude/agents/*.md（Claude Code 格式）。
//
// 解决历史同步引入的 4 类问题：
//   1. 去 UTF-8 BOM（CHO/RAndDTrainer/TriMetaverseProductRegistry 源带 BOM）
//   2. 补 frontmatter 开头 ---（business-strategy 源缺开头围栏）
//   3. tools 映射回 Claude Code 工具名
//        [read, search, edit]          -> [Read, Glob, Grep, Write, Edit]
//        [read, search, edit, execute] -> [Read, Glob, Grep, Write, Edit, Bash]
//   4. 删除 user-invocable（Claude Code 不用此字段）
//
// 用法： node scripts/sync-agents-to-claude.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, '.github', 'agents');
const DST = resolve(ROOT, '.claude', 'agents');

const TOOLS_MAP = {
  '[read, search, edit]': '[Read, Glob, Grep, Write, Edit]',
  '[read, search, edit, execute]': '[Read, Glob, Grep, Write, Edit, Bash]',
};

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function convert(text) {
  text = stripBom(text);
  const lines = text.split(/\r?\n/);

  const hasOpenFence = lines.length > 0 && lines[0].trim() === '---';
  const from = hasOpenFence ? 1 : 0;
  let end = -1;
  for (let i = from; i < lines.length; i++) {
    if (lines[i].trim() === '---') { end = i; break; }
  }
  if (end === -1) {
    // 无 frontmatter 结束围栏，按整段原样返回（仅已去 BOM）
    return { out: text, fenceAdded: false };
  }

  const fmLines = lines.slice(from, end);
  const bodyLines = lines.slice(end + 1);

  const outFm = [];
  let toolsMapped = false;
  for (const ln of fmLines) {
    if (/^user-invocable:\s*/.test(ln)) continue;
    const m = ln.match(/^tools:\s*(\[.*\])\s*$/);
    if (m) {
      const mapped = TOOLS_MAP[m[1]];
      if (mapped) { outFm.push('tools: ' + mapped); toolsMapped = true; continue; }
    }
    outFm.push(ln);
  }

  const out = '---\n' + outFm.join('\n') + '\n---\n' + bodyLines.join('\n');
  return { out, fenceAdded: !hasOpenFence, toolsMapped };
}

function main() {
  if (!existsSync(SRC)) { console.error('源目录不存在: ' + SRC); process.exit(1); }

  // ── 渲染前置断言（batch-07 随批·BOD 批准）：源侧旧名现役句族防复发门 ──
  // 语义：`.github/agents` 输入面中「写成 TriMC 正式 X」现役禁令句族超基线新增即拦
  // （exit 1）；存量基线=WO-A 后候扩裁清单（fsd/ste soul 句 2 处，2026-10-01），
  // 基线随正名批次递减更新。K 豁免=business-strategy 历史别名声明（自带禁现役化限定）。
  // 零渲染行为变更：门只读输入面，基线内放行照渲。
  {
    const LEGACY_FAMILY = /写成\s*TriMC\s*正式|写成TriMC正式/;
    const BASELINE = 2;
    // 冲突标记永久门（batch-14 件① 裁⑤升格）：渲染输入面零容忍——88a6988 类
    // 「冲突态 add/commit 入库」事故的常设防复发门（非基线递减形）。
    const CONFLICT_MARKERS = /^(<<<<<<< |>>>>>>> |=======$)/;
    const offenders = [];
    const conflictHits = [];
    for (const f of readdirSync(SRC)) {
      if (!f.endsWith('.agent.md')) continue;
      const lines = readFileSync(resolve(SRC, f), 'utf-8').split(/\r?\n/);
      lines.forEach((line, i) => {
        if (f.startsWith('business-strategy')) return; // K 豁免：仅旧名句族
        if (LEGACY_FAMILY.test(line)) offenders.push(`${f}:${i + 1}`);
        if (CONFLICT_MARKERS.test(line)) conflictHits.push(`${f}:${i + 1}`);
      });
    }
    if (conflictHits.length > 0) {
      console.error(`[sync][gate] 渲染输入面冲突标记检出（零容忍）——先解冲突再渲染：\n  ${conflictHits.join('\n  ')}`);
      process.exit(1);
    }
    if (offenders.length > BASELINE) {
      console.error(`[sync][gate] 源侧旧名现役句超基线（${offenders.length}>${BASELINE}）——先正名再渲染：\n  ${offenders.join('\n  ')}`);
      process.exit(1);
    }
    console.log(`[sync][gate] 冲突标记 0 ✓；旧名现役句 ${offenders.length}/${BASELINE}（基线内，放行）`);
  }

  mkdirSync(DST, { recursive: true });
  const files = readdirSync(SRC).filter(f => f.endsWith('.agent.md'));
  let n = 0;
  for (const f of files) {
    const name = f.replace(/\.agent\.md$/, '');
    const src = readFileSync(resolve(SRC, f), 'utf-8');
    const { out, fenceAdded, toolsMapped } = convert(src);
    writeFileSync(resolve(DST, name + '.md'), out, 'utf-8');
    const flags = [];
    if (src.charCodeAt(0) === 0xfeff) flags.push('BOM');
    if (fenceAdded) flags.push('fence');
    if (toolsMapped) flags.push('tools');
    console.log('  OK ' + name + '.md' + (flags.length ? '  [' + flags.join(',') + ']' : ''));
    n++;
  }
  console.log('\n已同步 ' + n + ' 个 agent -> .claude/agents/');
}

main();
