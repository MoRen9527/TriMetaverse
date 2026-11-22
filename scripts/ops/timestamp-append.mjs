#!/usr/bin/env node
// D-47 根修最小形 · 带自动戳的 append 助手（CEO 2026-11-22 根因根修令·CTO 技术形）
// 令源：CEO「『15:4x』问题不是第一次查出·不是犯一次·要彻底解决·找根因根修」（BOD 转达·DEM-016 池审）
// 形裁：c 组合（a 自动戳最小形先落 · b 闸面扩围=Bash/Edit/Write 文本扫描候后续批）
// 行为：目标文件 + 内容（argv 文件或 stdin）→ 自动生成 [ts=<date现查 +0800>] 头 + append
//      —— 时点由本工具生成（禁手写文字时点=手写即违规的执法面从「人自觉」转「工具注入」）
// 用法：node scripts/ops/timestamp-append.mjs <目标文件> [内容文件]   （无内容文件则读 stdin）
//       node scripts/ops/timestamp-append.mjs <目标文件> -m "一行内容"
// 注意：内容照写零转换（UTF-8）；目标文件不存在=创建；append 形不覆盖。

import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const [, , target, srcOrFlag, inlineArg] = process.argv;

if (!target || target === '--help' || target === '-h') {
  console.error('用法: node scripts/ops/timestamp-append.mjs <目标文件> [内容文件] | -m "内容"');
  process.exit(2);
}

function nowP0800() {
  const d = new Date(Date.now() + 8 * 3600 * 1000); // UTC+8
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}+0800`;
}

let body = '';
if (srcOrFlag === '-m') {
  body = inlineArg ?? '';
} else if (srcOrFlag) {
  body = readFileSync(srcOrFlag, 'utf8');
} else {
  body = readFileSync(0, 'utf8'); // stdin
}

const ts = nowP0800();
const pre = existsSync(target) && readFileSync(target, 'utf8').length > 0 ? '\n' : '';
const block = `${pre}[ts=${ts}]\n${body.replace(/\r\n/g, '\n')}${body.endsWith('\n') ? '' : '\n'}`;
appendFileSync(target, block, 'utf8');
console.log(`[timestamp-append] ok → ${target} (ts=${ts}·${Buffer.byteLength(body, 'utf8')}B)`);
