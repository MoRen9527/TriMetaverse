---
name: local-seat-relaunch-name-registration-gap
description: 本机席位 kill 后经 --resume+--name 重启，名址目录（ListAgents/SendMessage 入向）不重新注册——复活席只能单向外呼，入向找它须走剪贴板粘贴窗口通道
metadata: 
  node_type: memory
  type: project
  originSessionId: e11343a2-e97e-4a90-8c4a-5ac637545af8
  modified: 2026-09-16T19:31:01.234Z
---

2026-09-17 03:1x 实证（COS 受控压缩迁移窗）+03:29 根因闭环：本机席位进程被 kill 后，用 `claude --resume <名> -n <名> ...` 重启，**新进程不写会话注册 json、不进 ListAgents 名册、按名 SendMessage 不可达**（.key 生成、.json 缺；外呼正常=通信单向）。**根因（CEO 03:25 从窗口 banner 找到）=CLAUDE_CODE_CHILD_SESSION=1 环境遗传**：BOD 会话的 shell 子进程全带此标记，代起的 claude 被当子会话→不存转录、不注册名址。12 健康席对照=CEO 手起无标记。

**Why:** BOD 代起常驻进程时环境遗传子会话标记；非产品 bug。

**How to apply（已验证修复）：** 代起常驻 claude 前必清标记：`Remove-Item Env:CLAUDE_CODE_CHILD_SESSION; $env:CLAUDE_CODE_FORCE_SESSION_PERSISTENCE="1"` 再启动→注册 json 出现+名册 13/13+转录恢复。修复后转正令按名送达成功（双向通信复原）。

**How to apply:**
1. 入向触达复活席=**剪贴板粘贴通道**（唯一可靠）：`Set-Clipboard 文本` → AppActivate(窗口PID) → SendKeys('^v') → SendKeys('{ENTER}')；守卫纪律=激活 False 即中止不发。
2. SendKeys 直打文本不可靠三连：中文经 IME 组词变乱码（"ack"→"啊惭愧"实证）、{ENTER} 常被吞（双发/粘贴后才稳）、VS Code 多 tab 无法唯一定位——**文本走粘贴、回车要物理或双发**。
3. 压缩/迁移 SOP 配套：复活后第一件事发链路测试触发回合，确认外呼通；入向缺口候产品修复（Anthropic /feedback 候选）。
关联 [[bod-harness-automation-authorization]]（独立窗口唯一定位前置）、[[tmux-sendkeys-enter-trap]]（sg 侧同族回车吞噬）。
