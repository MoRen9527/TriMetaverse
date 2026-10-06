---
name: tmux-capture-suggestion-ghost-line
description: tmux capture-pane 判读纪律——❯ 后的文字可能是 claude code 的暗示提示（ghost suggestion）非真实输入，Enter/C-c 对它全部无效
metadata:
  node_type: memory
  type: project
  originSessionId: e11343a2-e97e-4a90-8c4a-5ac637545af8
  modified: 2026-09-19T19:29:50.828Z
---

2026-09-20 03:2x CEO 指正（BOD 误判实证）：

- tmux capture-pane 看席位界面，`❯` 后出现的文字**可能是 claude code 的暗示提示**（基于会话上下文的 next-action 建议），**不是用户敲的、也不是输入缓冲里的真实输入**。
- 实证：sg m-duty-cos 面显示"❯ 执行 C-3 root 链…"，BOD 误判为"有人敲了一半待提交"，连发 Enter×3+补发+C-c+重发全部无效——因为**根本没有输入存在**，C-c 也清不掉（UI 会重新渲染暗示层）。
- **判定法**：真实输入的提交有痕迹（thinking 标记/对话流出现新条目）；暗示提示永远静止在输入行，任何按键后原样还在=暗示层。send-keys 文本+Enter 后 capture 无 thinking=大概率被吞或本无输入，先换判据再重试。
- **采纳机制（CEO 03:29 补授）**：暗示提示**按 Tab 键才变为真实输入**（文本进入输入缓冲），之后再 Enter 提交。远程采纳暗示=send-keys Tab+Enter 两步；直接 Enter 对暗示层无效。
- **推论**：capture-pane 判读席位状态时，输入行文字不可作为"席位想做什么/有人下过什么令"的证据——暗示是 UI 生成的，不代表任何人的意图。

**How to apply:** 远程判读席位（sg send-keys 留痕制、capture 巡检）时：①❯ 后文字一律先疑暗示层；②验证真实提交只认 thinking/对话流增量；③想给席位发指令就发完整新文本+Enter 补丁，别试图"提交"已显示的文字。关联 [[tmux-sendkeys-enter-trap]]（Enter 吞噬坑——本条是其上游判读修正：有些"吞"根本不是吞，是无物可提交）。