---
name: tool-ctx-cwd-baseline
description: 新写文件工具必须以 ctx.cwd 为相对路径基准并补 ctx 传递断言（REQ-014b 口径）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-13T19:41:06.994Z
---

TriLC/TriMC 新写文件类工具时：handler 必须接收 `ctx?: ToolContext`（第二参），相对路径解析基准统一 `ctx?.cwd ?? process.cwd()`；shell-exec 类保留模型显式参数优先：`(args.cwd) || ctx?.cwd || process.cwd()`。同步补测试断言两型：ctx.cwd 相对路径解析基准命中 + ctx 缺失回退 process.cwd。

**Why:** 安装态 daemon 的 `process.cwd()` 是启动目录（schtasks/RegRun/主程序拉起方式不同 → cwd 漂移，历史分布 system32/Program Files/用户目录都有），模型会话的工作区语义在 agent-core 传的 ctx.cwd（REQ-014b，loop.js 已传，Write/Edit 工具已示范）。LS-CWD-DIAG-20260814-001 三层实证：LS/Read/Glob/Grep/ShellExec 忽略 ctx 用 process.cwd() → 安装态读写路径分裂，模型盲探 Documents。修复树 prod-grade-4-lscwd-fix（r4-1，commit TriLC a6df674 + TriMC 7e15ecf）已把五读工具全部统一。

**How to apply:** 新工具注册按 `file-write.ts` 模式写签名；测试按 `TriLC/test/tools-ctx-cwd.test.ts` 的两型断言结构；写路径提示类改动时注意 buildWeeklyPlaneHint 有两个互斥注入点（defaultSystemPrompt 内部 + tasks/submit 外部 append），只选一处叠加防双注入。
