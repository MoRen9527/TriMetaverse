---
name: bg-chain-cd-trap
description: bash 工具「cd X && 长命令 &」会使 cd 随链后台化——后续命令仍跑在旧 cwd，git status/ls/cat 全落错仓（2026-09-11 TriModel 三踩）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: bab3f873-4a67-4ab1-be8c-5b4f884623f5
  modified: 2026-09-11T12:26:08.100Z
---

Bash 工具坑：`cd /d/Code/ai/TriModel && cmd > log 2>&1 &` 中 `&` 使**整条 && 链后台执行**（含 cd），主 shell cwd 不变——其后的 `git status`/`ls`/`cat` 全部落回原仓（TriMetaverse），产生「文件丢失」「status 面错仓」假象。

**Why:** `&` 优先级低于 `&&`；后台 subshell 的 cd 不影响主 shell。

**How to apply:** 起后台服务用独立行 `cd X` + 换行 `cmd &`，或 subshell 包裹 `(cd X && cmd &)`；其后凡查文件/仓库状态，显式绝对路径（如 `ls /d/Code/ai/TriModel/xxx`）或先单独一条 `cd`。凡 status/ls 读数与预期矛盾，先查 cwd 再下结论。
