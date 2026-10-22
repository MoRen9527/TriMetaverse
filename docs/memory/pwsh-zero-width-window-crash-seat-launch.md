---
name: pwsh-zero-width-window-crash-seat-launch
description: pwsh 7.6.6 零宽/最小化窗更新通知 FailFast 崩溃族+席位启动通道正形（真宽窗+父环境 UPDATECHECK=Off+零历史用 -n 禁 --resume）
metadata:
  node_type: memory
  type: project
  originSessionId: 50732373-9235-4fa8-a720-15be03e6c2a0
  modified: 2026-10-20T14:51:46.150Z
---

pwsh 7.6.6 更新通知零宽窗崩溃族（2026-10-20 m-pm 上线故障实证）：

**坑面**：`Start-Process pwsh -WindowStyle Minimized`（零宽窗）启动→pwsh 启动时渲染更新通知 `ShowUpdateNotification`→`String.PadRight(totalWidth=-17)`→`Environment.FailFast`（退出码 0x80131623）宿主 pane 死；pane 提示「Ctrl+D 关闭或 Enter 重新启动」但 **Enter 只起裸 pwsh，恢复不了已死的子进程 TUI**。claude.exe 子进程 detached 幸存（进程活+名址在册+TUI 失窗）。

**正形**：
1. 席位/TUI 宿主**禁用 `-WindowStyle Minimized` 通道**——用真宽度窗（wt new-tab 同 13 席 watchdog 通道，或 Start-Process 正常窗）
2. `POWERSHELL_UPDATECHECK='Off'` 必须设**父环境**（Start-Process 前设好让子 pwsh 继承）——更新横幅在 pwsh 启动时渲染，早于 `-File` 脚本执行，启动器脚本内设=太晚
3. 宿主崩后修复序：杀 detached 旧实例（防双实例）→正形通道重起

**resume 零命中判据链**（同窗二坑）：`claude --resume <名>` 弹 `No sessions match`=盘上无该 customTitle 的 jsonl。先盘勘再动作：扫 `~/.claude/projects/` 全目录 jsonl 创建时间+customTitle 值面。**空会话零内容=零写盘**（transcript 随首条消息/hook 流量才落盘）——新席 idle 一段时选无 jsonl 是常态，非持久化回归；此时**零历史正形=全新 `-n` 注册形**（seats.json launchCommand 同款），`--resume` 必卡选择器。丢历史面评估：idle 席零派工=仅丢首轮状态条（bootstrap 重发）。

关联：[[local-seat-relaunch-name-registration-gap]]（名址注册 env 正形）、[[resume-title-cross-project-ambiguity]]（resume 同名歧义族）、[[fourth-type-cross-reload-persistence]]。
