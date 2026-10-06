---
name: windows-schtasks-no-window
description: Windows 计划任务无窗纪律——powershell 直启必闪 conhost 黑窗；合格式=VBS/wscript 包装（Run 第二参=0）或 pythonw；正身=D-29
metadata: 
  node_type: memory
  type: feedback
  originSessionId: bab3f873-4a67-4ab1-be8c-5b4f884623f5
  modified: 2026-09-20T15:25:19.428Z
---

Windows 计划任务（schtasks）直启 powershell/cmd **必闪 conhost 黑窗**（GUI 会话干扰）。

**合格式**（D-29 已入册 engineering-disciplines.md，commit 5c6bbd8）：
- VBS/wscript 包装：`Run "...", 0, False`——第二参 **0=隐藏窗口**（Sync-Alert 惯例案例=.fade/hourly-sync-alert.vbs 包装，2026-09-18 20:2x 验证无窗）
- pythonw.exe（无窗 Python 变体）

**Why:** 本地 Windows 计划任务与 Linux cron 形态差异——Linux cron 天然无窗，Windows GUI 会话直启必闪窗；bare-fetch/worktree-guarded-ff 系 Linux 件无此问题，Windows 侧须单独记得。

**How to apply:** 本机新建计划任务时选 VBS 包装或 pythonw；审查既有 schtasks 清单时核启动壳形态（conhost 直启=缺陷）。

**【存量整改教训 2026-09-21】**D-29 入册时**只立了规则、没扫存量**——Notify-Poller（入册前 4 小时装的）直启闪屏又跑了半天，直到 CEO 亲眼看到才修。修正：**纪律入册动作必须伴随存量全扫整改**（本例：入册时应立即扫全部计划任务 action，直启者批量切 VBS——而非等每个受害者报障）。新装任务用 VBS 包装（已固化：notify-poller.vbs）。
