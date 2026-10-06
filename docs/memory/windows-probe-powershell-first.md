---
name: windows-probe-powershell-first
description: 本机探测/验证优先 PowerShell 工具——Git Bash 的 MSYS 路径转换会吃掉 /v 类参数（CEO 2026-08-28 质询后立）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3ce184e6-6a9a-42ee-a7a4-8410d4fb6576
  modified: 2026-08-28T06:13:42.781Z
---

CEO 质询（2026-08-28）：已设 CLAUDE_CODE_USE_POWERSHELL_TOOL，为何探测先用 Git Bash？——该设置只是**增加** PowerShell 工具，不禁用 Bash；选型是每次调用时自己的判断，当晚习惯性走了 bash 管道导致 reg query 的 `/v` 被 MSYS 转换成路径、token 读空、误判 401。

**How to apply:** Windows 原生操作（registry/env/服务/路径含反斜杠或 /v /d 类参数）一律优先 PowerShell 工具；Git Bash 仅用于 POSIX 管道与 ssh 场景。**纪律真源**：TriCompany/docs/workflow/engineering-disciplines.md **D-12**（2026-08-28 入册）。相关：[[orchestrator-hub-split]]、[[org-memory-governance-split]]
