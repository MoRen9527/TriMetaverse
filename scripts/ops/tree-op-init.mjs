#!/usr/bin/env node
// tree-op 落卷立死 · 生成/校验工具（CEO 2026-11-22 令·CTO 技术形·C 项最小形）
// 令源：CEO 执行序列 C 项「tree-op 落卷立死（tree-op.json 生成工具/校验——实测 W47 28 树全缺须工具化立死）」
// 现役 schema 参照：2026-W29/trees/*/tree-op.json = { nodes: [{nodeId, agent, status, action, delivery, completedAt}] }
// 用法：
//   node scripts/ops/tree-op-init.mjs --check <treesRoot>      清点缺 tree-op 的树（有缺 rc=1·清单 stdout）
//   node scripts/ops/tree-op-init.mjs --backfill <treesRoot>  为缺失树补最小骨架（backfilled:true 标记·不覆盖现有）
//   node scripts/ops/tree-op-init.mjs <treeDir>               新树骨架（该树无 tree-op 才写）
// 立死判据（下游消费面）：树目录存在 → tree-op.json 必在（--check rc=0 为绿）

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const MODE = process.argv[2];
const ROOT = process.argv[3];

function nowP0800() {
  const d = new Date(Date.now() + 8 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}+0800`;
}

function treeDirs(root) {
  return readdirSync(root)
    .map((n) => join(root, n))
    .filter((p) => {
      try { return statSync(p).isDirectory(); } catch { return false; }
    });
}

function minimal(treeName, backfilled) {
  return {
    schema_version: '1.0.0',
    tree: treeName,
    ...(backfilled ? { backfilled: true } : {}),
    created_at: nowP0800(),
    nodes: [],
  };
}

function main() {
  if (!MODE || MODE === '-h' || MODE === '--help') {
    console.error('用法: --check <treesRoot> | --backfill <treesRoot> | <treeDir>');
    process.exit(2);
  }

  if (MODE === '--check') {
    if (!ROOT) { console.error('--check 需 treesRoot'); process.exit(2); }
    const missing = [];
    let okCnt = 0;
    for (const d of treeDirs(ROOT)) {
      const f = join(d, 'tree-op.json');
      if (!existsSync(f)) { missing.push(basename(d)); continue; }
      try { JSON.parse(readFileSync(f, 'utf8').replace(/^﻿/, '')); okCnt++; }
      catch { missing.push(`${basename(d)}(invalid-json)`); }
    }
    console.log(`[tree-op-check] trees=${okCnt + missing.length} ok=${okCnt} missing=${missing.length}`);
    for (const m of missing) console.log(`  MISSING: ${m}`);
    process.exit(missing.length ? 1 : 0);
  }

  if (MODE === '--backfill') {
    if (!ROOT) { console.error('--backfill 需 treesRoot'); process.exit(2); }
    const done = [];
    for (const d of treeDirs(ROOT)) {
      const f = join(d, 'tree-op.json');
      if (existsSync(f)) continue;
      writeFileSync(f, JSON.stringify(minimal(basename(d), true), null, 2) + '\n', 'utf8');
      done.push(basename(d));
    }
    console.log(`[tree-op-backfill] written=${done.length}`);
    for (const m of done) console.log(`  WROTE: ${m}`);
    process.exit(0);
  }

  // 单树 init
  const f = join(MODE, 'tree-op.json');
  if (existsSync(f)) { console.log(`[tree-op-init] exists, skip: ${f}`); process.exit(0); }
  writeFileSync(f, JSON.stringify(minimal(basename(MODE), false), null, 2) + '\n', 'utf8');
  console.log(`[tree-op-init] ok → ${f}`);
}

main();
