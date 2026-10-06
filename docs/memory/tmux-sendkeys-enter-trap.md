---
name: tmux-sendkeys-enter-trap
description: BOD 经 ssh+tmux send-keys 向 sg 席位派工：文本后附带的 Enter 常被 bracketed paste 吞掉——须补发独立 Enter 并 capture-pane 验证
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a5ed9f38-bd2c-4cfe-abb3-38fd5a72abdd
  modified: 2026-09-14T08:30:30.690Z
---

BOD 经 `ssh M-SG ... tmux send-keys -t m-duty-XXX "文本" Enter` 向 sg 值席派工/留痕时，**Enter 常被 bracketed paste 模式吞掉**——消息停在输入框、会话不收。须补发一条独立 `tmux send-keys -t m-duty-XXX Enter` 才提交。两次实证（2026-09-14 15:0x 派工夜航01 / 18:2x hermes 留痕，均由 CEO 从窗口看出）。

**Why:** 静默失败——"看起来发了"实际卡在输入框，派工悬空无人知；人眼（CEO 看窗口）是最后防线。

**How to apply:** 每次 send-keys 后 `tmux capture-pane -p` 验证输入框已清空（❯ 后为空=已提交）；未清空即补发独立 Enter 再验。本地席走 SendMessage 无此坑（见 [[m004-seat-dispatch-via-sendmessage]]）；此坑仅 sg tmux 面。sg 直连操作后须在 m-duty-cos 留痕（CEO 2026-09-14 定的审计折中制）。

**【tmux 起 claude 管道坑 2026-09-21】**tmux 里脚本起 claude（交互）时，脚本内 `claude … | tee 日志` 会因 **stdout 非 TTY 使 claude 自动进 --print 模式**（报 Input must be provided…using --print 秒退）——tmux 内起 claude **禁管道接 stdout**，日志靠 tmux capture-pane 取。另：新寻址名首起 **--resume 必失败**（无历史会话），须先 `claude -n <名>` 交互首起建会话（headless -p 创建的会话不进 resume 名册，除非 FORCE_SESSION_PERSISTENCE=1）。
