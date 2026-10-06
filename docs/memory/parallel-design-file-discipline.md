---
name: parallel-design-file-discipline
description: 写 docs/execution/ 联合设计文档前必须先 git log 查该路径并行线落盘，磁盘列表会滞后于并行提交
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-14T04:32:01.117Z
---

2026-08-14 init-to-collab-design.md 事件：并行线（xiaogiao-init 产品面 + 编排层补提交）已把联合终稿 v2026.W34.3 落盘提交（80f34b7d），我（CTO 继任实例 xiaodi-m2-4）开工时 Glob/ls 未见该文件，未查 git log 直接 Write 覆盖为 v2026.W34.1 初稿；编排层随后把我「落盘未提交」的文件补提交（02c05459），收口提交 ca7b7c36 一度把文件回退到初稿，最终 cd0ef286 修复回终稿。终稿未受损，但产生了三次提交的来回。

**Why:** 本仓库多 agent 并行工作：编排层会快速补提交「落盘未提交」的文件；磁盘 Glob/ls 只是某一时刻快照，不代表该路径没有他人更新、更不代表 HEAD 已收口。我写作前只查了磁盘未查 git，且未先 Read 已有文件。

**How to apply:**
1. 写入任何 docs/execution/ 或联合文档前：`git log --oneline -5 -- <path>` + 文件已存在则先 Read 再决定覆盖还是补充。
2. 发现文件已是更新版本时，把自己的内容按「修正记录/补充节」并入，不整体覆盖。
3. 交付后验证：`git rev-parse HEAD:<path>` blob 与工作树 diff 核对，确认工作树即预期版本。
4. 覆盖已发生时主动声明并回滚到前一版本内容，不等仲裁。

关联：[[fact-citation-source-required]]
