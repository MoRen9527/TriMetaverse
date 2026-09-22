# TASK-LAUNCH-WD-01 执行读数（SDE 承办）

- date 现查: 2026-09-22 13:36:44 +0800（星期二）
- 任务书: `TriMetaverse-worktrees/board/docs/workflow/operating-records/2026-W39/task-launcher-workingdir-param.md`（wt/board 树 fc62580d；BOD/CEO 13:24 批）
- 承办: SDE 小布（经 m-cos 流转）；截点 2026-09-23 12:00+08:00（本读数成时提前约 22.5h）
- 树指针: 本件=承办席所在树 `docs/workflow/operating-records/2026-W39/task-launch-wd01-readings.md`

## 一、改动读数

| 件 | 仓/笔 | 内容 |
|---|---|---|
| `TriCompany/scripts/ops/launch/launch-seat.windows.ps1` | TC `e59b444` | param 增 `[string]$WorkingDir = "D:\Code\ai\TriMetaverse"`（默认主仓向后兼容）+ 第15行 `Set-Location $WorkingDir` + 手册路径 `"$WorkingDir/.claude/compass/$Manual.session.md"` + 头注参数说明一行；diff 5+/3− |
| `TriCompany/scripts/ops/sync/sync.ps1` | TC `4cd12eb` | 追平锚 C 执行中暴露既有空值炸（`$dstText` 从未赋值），修一行恢复 LG-035 §3 设计功能（独立成笔，归因披露见回执） |
| `docs/execution/windows-seat-remote-control-runbook.md` | TMV（姊妹笔，SHA 见回报） | §三 实操捷径段后补 worktree 起席用法一行（含 `-WorkingDir` 示例） |

## 二、验收锚 A：干跑三案输出原文（临时副本 claude 行→输出语句，未真拉席）

**案1（无 `-WorkingDir`，默认回归）**：
```
SETLOC=D:\Code\ai\TriMetaverse
MANUAL=D:\Code\ai\TriMetaverse/.claude/compass/chief-administrative-officer.session.md
MANUAL_EXISTS=True
```
→ 目标=主仓（与原硬编码第15行逐字一致）；手册=主仓 compass 同一文件（EXISTS 实证）；回归不破 ✓

**案2（`-WorkingDir D:\Code\ai\TriMetaverse-worktrees\board`）**：
```
SETLOC=D:\Code\ai\TriMetaverse-worktrees\board
MANUAL=D:\Code\ai\TriMetaverse-worktrees\board/.claude/compass/chief-administrative-officer.session.md
MANUAL_EXISTS=True
```
→ 目标=该 worktree；手册=该树 compass（存在性实证，跨树版本错位防线成立）✓

**案3（三条 env 卫生语句改后原样在位）**：
```
14:Remove-Item Env:CLAUDE_CODE_CHILD_SESSION -ErrorAction SilentlyContinue
15:Get-ChildItem Env: | Where-Object Name -like "CLAUDE*" | Remove-Item -ErrorAction SilentlyContinue
16:$env:CLAUDE_CODE_FORCE_SESSION_PERSISTENCE = "1"
```
→ 三条逐字在位（清 CHILD_SESSION / 清 CLAUDE* / 设 FORCE=1）✓

## 三、解析冒烟与编码态（D-09 面）

- **pwsh 7.6.6（真实运行时解释器，watchdog 拉席链 `wt→pwsh -File` 实证）**：改后 `PARSE_ERRORS=0` ✓
- **powershell 5.1 对照组**：改后 1 错、**原版同 1 错**（GBK 误读无 BOM 中文注释产生幻影 `)`）——既有条件非本单引入；部署位运行时=pwsh，该错不影响生产链
- **BOM**：改后首 3 字节 `23 20 e7`（保持 7ceab65 事故根修后的无 BOM 原态）✓

## 四、验收锚 C：部署位追平读数

- 首跑 sync.ps1 EXECUTE **即炸**：`$dstText` 空值方法调用（第 56 行）——既有潜伏 bug（`$dstText` 无读入行，首个已存在部署件即终停，launch-seat 未及处理）；`4cd12eb` 修一行后重跑成功
- 重跑读数（17 件）：`updated: launch-seat.ps1`（本单目标件）+ 9 件 `identical`（幂等锚正常）+ 6 件 .vbs 「直写嫌疑（缺生成标记）」警告（设计内「先发现再定性」跳过，**归 ops-sync 批 owner 候定性**，本单不碰）
- **部署位内容级验证**（`.fade/launch-seat.ps1`）：标记头（:1）+ `-WorkingDir` 参数（:13）+ `Set-Location $WorkingDir`（:18）+ 手册跟随（:19）全在位 ✓

## 五、边界守约

未动：launch-m-cos.windows.ps1 / .claude/seats.json / seats-operations.json launchEnvPolicy / copilot-host-assets 知识件 / 未真拉席 / sg 侧零涉 ✓

## 六、回滚方案（未启用）

- 脚本笔：`git revert e59b444` + 重跑 sync.ps1 即部署位回退（追平机制已修复可用，双向可逆）
- sync.ps1 修复笔：`git revert 4cd12eb` 独立可逆
- runbook 笔：TMV revert 单笔
