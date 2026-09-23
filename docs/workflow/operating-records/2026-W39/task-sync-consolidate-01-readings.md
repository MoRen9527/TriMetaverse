# TASK-SYNC-CONSOLIDATE-01 执行读数（SDE 承办）

- date 现查: 2026-09-22 14:07:07 +0800（星期二）
- 任务书: `TriMetaverse-worktrees/board/docs/workflow/operating-records/2026-W39/task-charter-sync-consolidate-01.md`（wt/board e74486ee；BOD 14:05 批，CTO 方向判 14:02）
- 承办: SDE 小布（经 m-cos 流转）；截点 2026-09-23 12:00+08:00
- 树指针: 本件=承办席所在树 `docs/workflow/operating-records/2026-W39/task-sync-consolidate-01-readings.md`

## 锚A：sync.py 下架落笔

- TC commit **`e5c7f59`**：`git rm scripts/ops/sync/sync.py`（−110 行）+ sync.ps1 头注谱系注记（+10 行），下架与墓志铭同笔。
- 下架前勤：存活引用面扫描=**零功能依赖**（scripts/.git/hooks 全域唯一引用=sync.ps1:14 注释层历史归功，非调用链）；计划任务零涉（边界达标）。
- parse smoke：双解释器 PWSH_ERRORS=0 / PS51_ERRORS=0。

## 锚B：谱系注记在卷

- 位置：`TriCompany/scripts/ops/sync/sync.ps1` 头注（`# 用法` 行后新增谱系块）。
- 原文摘录：
  > 谱系注记（TASK-SYNC-CONSOLIDATE-01；CTO 判 2026-09-22 14:02「淘汰 py 保 ps1」）：前代 sync.py 三笔功绩谱系——f60106f（LG-035 立件·幂等三跑实测达标）→ e2ff079（VBS 毒化根修·标记类型感知首立）→ 7ceab65（BOM 归一批随件）；本笔已 git rm 下架（git 史即档）。防线遗产承接：29158d0（标记类型感知+VBS 无 BOM 写入）+ 1f78619（WriteAllText 字节精确幂等）。淘汰四条：①ps1=现役实证代，py 无剩余独有防线；②部署位=Windows 本机零运行时依赖同族生态；③双代并存=损害发生器（e2ff079→29158d0 自证）；④淘汰≠删除：git rm+本注记归档，功绩谱系留痕。

## 锚C：回归复跑读数（全量原文）

```
[sync] mode=EXECUTE files=17
[sync] identical: seat-watchdog.ps1
[sync] identical: seat-watchdog.vbs
[sync] identical: msg-alert-watch.ps1
[sync] identical: msg-alert-watch.vbs
[sync] identical: msg-work-watch.cmd
[sync] identical: msg-work-watch.vbs
[sync] identical: notify-poller.ps1
[sync] identical: notify-poller.vbs
[sync] identical: notify-track.ps1
[sync] identical: hourly-sync-alert.ps1
[sync] identical: hourly-sync-alert.vbs
[sync] identical: launch-m-cos.ps1
[sync] identical: launch-seat.ps1
[sync] identical: seat-boot.vbs
[sync] identical: bod-to-sg-dispatch.ps1
[sync] identical: admin-fix.ps1
[sync] identical: cleanup-narrative.py
[sync] done
```
**IDENTICAL=17 / WARNING=0 / UPDATED=0** —— 归一后首轮回归即真幂等 ✓

## 锚D：标记头全量检查读数

- 旧形残留 grep（`sync.py maintained` 全 .fade 域）：**零命中**（grep exit=1 无匹配，原文无输出行即证）；
- 新形标记在位：**17/17**（`generated from TriCompany/scripts/ops` 全数命中，MISSING=none），其中 .vbs 6 件=`'` 注释形、其余 11 件=`#` 形（类型感知世代）。

## 锚E：D-30 候选文案（脚本资产一代一实现）

> **D-30（候选）·脚本资产一代一实现原则**
> - **判语**：同一脚本资产位（同职责同部署面的工具件）任一时点只允许一个现役实现代；新代上位前必须完成旧代独有防线/功绩的**可证移植**（移植笔 commit 号留痕），并同步下架旧代（git rm+史注归档——git 史即档）。
> - **禁则**：①双实现代并存运行；②重写丢教训（新代未承接旧代事故修复即上线）。
> - **例外通道**：并行灰营（新旧代同跑比对新代达标后旧代限时下架）须 owner 明令+期限戳+对比读数随卷。
> - **首例**：sync 双代归一（LG-044，py 淘汰保 ps1，CTO 判 2026-09-22 14:02；移植链 e2ff079→29158d0/1f78619 可证）。
> - 状态：候选文案随卷——正式入册走纪律册流程（CAO 面），本单不强制。

## 边界守约

sync.ps1 功能逻辑零触（仅头注层注记）；trimodel 两件休眠裁示未碰；sg 零涉；计划任务零改动 ✓

## 回滚方案（未启用）

`git revert e5c7f59` 单笔即恢复双代并存态（sync.py 自 git 史复生+注记剥离）；部署位全程未动（17×identical 实证），零回滚面。
