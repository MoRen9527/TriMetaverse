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
