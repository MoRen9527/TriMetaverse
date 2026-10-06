---
name: nested-pwsh-command-dollar-escape
description: 一行式经外层 PowerShell 双引号转发（pwsh -Command "…$env:X='1'…"）时 $env: 被外层先展开成空，赋值变废命令 =1 报错——整条单引号或逐处反引号转义；正形=跑 .ps1 启动器脚本
metadata:
  node_type: memory
  type: project
  originSessionId: dbcbbfdd-8f7b-45c9-a948-52f845f18379
  modified: 2026-09-22T05:20:00.719Z
---

2026-09-22 13:10 BOD 启动实证：从外层 PS 提示符发 `pwsh -NoExit -Command "…; $env:CLAUDE_CODE_FORCE_SESSION_PERSISTENCE='1'; …"` → 报 `=1: 术语 '=1' 不会被识别…`。

**根因：** 双引号串由**外层** PS 先做变量展开（外层无此变量→空），里层 pwsh 收到的是 `='1'`；命令位 token 拼接（`=`+引号内 `1`）被当成命令名 `=1` 报错。赋值从未执行。链上 `;` 顺序执行不受影响：擦除/换目录/启动都成功，只丢 flag。

**How to apply（三条均实测）：**
1. 整条 payload 用**单引号**包裹，外层零展开；内部不需要引号处直接 `$env:X=1`（裸值）最省事。
2. 保持双引号则**每一处** `$` 前加反引号 `` ` ``——漏一处照空。
3. 正形=跑 `.ps1` 启动器脚本（正身 `TriCompany/scripts/ops/launch/launch-seat.windows.ps1`，已含清 CHILD_SESSION+全 CLAUDE*+设 flag），脚本体天生免疫此坑；但它写死 cd 主仓、无 worktree 目录参数（候立改进单）。

**伤害面校准：** 本案仅保险 flag 未设；子会话标记擦除在坏语句之前已生效，本会话转录 jsonl 正常在写+通信管道在位（非 09-17 名址缺口失败形态）。

**验证纪律附注：** 修法验证命令自身漏转义第二处 `$` 会造出假阴性（本案 C 首测即中招，复测 C2 才见真值）——验证工具须按同一转义纪律写，键在≠值对。

关联 [[local-seat-relaunch-name-registration-gap]]（该修复配方被压成 -Command 一行式即本案触发形态）。
