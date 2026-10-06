---
name: chaindrop-supply-chain-audit-20260810
description: ChainDrop npm 蠕虫（2026-08-04 爆发）全工作区审计结果——未受影响，证据链与后续观察项
metadata: 
  node_type: memory
  type: project
  originSessionId: bcce92fb-05d7-4399-ae19-b5725cff9b6b
  modified: 2026-08-10T14:59:57.522Z
---

2026-08-10 对 D:/Code/ai 全工作区（43 个目录、14 个有 manifest 的模块）执行 ChainDrop 供应链审计，**结论：无感染证据**。

**证据链**：① 所有 manifest/lock 无 umadev/@umacloud/其余已公布命名空间；② keyv 家族仅 TriModel（keyv@4.5.4 via eslint→file-entry-cache@8.0.0→flat-cache@4.0.1）与 4 个嵌套项目，均为合法版本、无 preinstall 脚本；openclaw lock 为 keyv@5.6.0/@cacheable@2.x 且未安装；③ 所有 node_modules 载荷扫描（setup.mjs/math_init.js/Math_Symbol.js）零命中；④ 12 个模块 npm audit 全量，告警均为长期普通漏洞（brace-expansion/js-yaml/esbuild/hono/vitest 等），无 ChainDrop 包；⑤ 全局及项目 Claude Code 配置无 hooks 后门，无恶意 tasks.json；⑥ ~/.bun 为 2026-01-26 官方安装的 bun@1.3.6（worm 载荷为 1.3.13）。

**观察项**：npm audit 普通漏洞按常规排期修；建议 npm install 常开 `--ignore-scripts` 并审查 lockfile 变动；TriModel/其它模块的 eslint 系依赖链保持原样即可。

**Why**: 8 月 4 日事件后环境是否需要视为失陷、是否需轮换凭据——此审计给出一致结论：不需要。
**How to apply**: 后续若有人问"之前查过 ChainDrop 吗"，引用此审计；如发生新安装或 lockfile 大变动，复查 keyv/umadev/@umacloud 与载荷文件扫描。
