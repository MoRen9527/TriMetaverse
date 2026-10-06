---
name: session-forensics-basics
description: 本机 Claude 会话取证三要点——transcript 时间戳是 UTC、工具调用引擎事件指纹、PSReadLine 只收交互台
metadata: 
  node_type: memory
  type: project
  originSessionId: d7be6c8b-3fe9-49c2-810d-fd112b5be174
  modified: 2026-09-10T06:05:12.528Z
---

本机（TABLET-0BGCRCP5，win32）追溯"谁在何时执行了某命令"的取证要点（2026-09-10 8713 拉起源排查实证）：

1. **transcript 时间戳是 UTC**：`~/.claude/projects/<proj>/*.jsonl` 每行 `"timestamp"` 为 UTC，本地+08 事件要减 8h 再搜（本地 12:53 → UTC 04:53），否则搜不到或错归晚间会话。
2. **工具调用引擎事件指纹**：Claude Code PowerShell 工具每次调用=新 powershell.exe 进程 → Windows PowerShell 事件日志（Id 400）按调用逐条留 HostName=ConsoleHost 记录；单次引擎事件+数秒后进程落地=交互台人工敲入；引擎事件连发=agent 工具连调。
3. **PSReadLine 历史只收交互台**：`ConsoleHost_history.txt` 不含非交互工具调用；VS Code 集成终端另有 `Visual Studio Code Host_history.txt`；bash 非交互不写 `~/.bash_history`。
4. **命令落盘指纹**：`Start-Process -RedirectStandardOutput/-RedirectStandardError` 产出成对 stdout.log/stderr.log；`.cmd` 包装器惯用 `>> xxx.log 2>&1` 单文件；两套命名并存即两条拉起路径（见 [[trilc-daemon-restart-discipline]]，户口规范=W33 登记 Start-Process 方式）。

**Why:** 8713 拉起源排查中先按本地时点搜 transcript 落空一轮，PSReadLine 险些误导成"无人执行"；三要点齐用才定位到 transcript 内「提权复拉」证据。

**How to apply:** 追进程/命令来源时按 事件日志引擎窗 → transcript（UTC 换算后按时窗+命令指纹 grep）→ PSReadLine 仅作交互台旁证 的顺序取证。
