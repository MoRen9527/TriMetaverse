# TASK-VBS-PROVENANCE-01 执行读数（SDE 承办）

- date 现查: 2026-09-22 13:55:05 +0800（星期二）
- 任务书: `TriMetaverse-worktrees/board/docs/workflow/operating-records/2026-W39/task-charter-vbs-provenance-01.md`（wt/board 4a5e91d2；BOD 13:50 批）
- 承办: SDE 小布（经 m-cos 流转）；截点 2026-09-23 12:00+08:00（提前约 22h）
- 树指针: 本件=承办席所在树 `docs/workflow/operating-records/2026-W39/task-vbs-provenance-01-readings.md`

## 一、逐件定性表（6/6 全量，禁抽样达标）

六件定性**趋同**，逐件三态读数如下（src=`TriCompany/scripts/ops/<真源>`，dst=`TriMetaverse/.fade/<部署件>`）：

| # | 部署件 | 态1 内容 diff（归一 BOM/CRLF） | 态2 生成标记 | 态3 引用方 | 定性 | 处置 |
|---|---|---|---|---|---|---|
| 1 | seat-watchdog.vbs | 仅标记行 1 行差（`0a1`），功能零漂移 | 在·旧形（`' …sync.py maintained`） | 计划任务 `\Seat-Watchdog`（Ready） | sync.py 世代管线产物（非直写非漂移） | 应纳管·已入管 ✓ |
| 2 | msg-alert-watch.vbs | 同上（仅标记行差） | 同上 | `\MSG-Alert`（Ready） | 同上 | 应纳管·已入管 ✓ |
| 3 | msg-work-watch.vbs | 同上 | 同上 | `\MSG-Work-Watch`（Ready） | 同上 | 应纳管·已入管 ✓ |
| 4 | notify-poller.vbs | 同上 | 同上 | `\Notify-Poller`（Ready） | 同上 | 应纳管·已入管 ✓ |
| 5 | hourly-sync-alert.vbs | 同上 | 同上 | `\Sync-Alert`（Ready；D-29 惯例案例件） | 同上 | 应纳管·已入管 ✓ |
| 6 | seat-boot.vbs | 同上 | 同上 | 无任务挂载·人工引导形（引用面=sync map+自头注，无自动链可断） | 同上 | 应纳管·已入管 ✓ |

**误报机理**：六件标记在但为旧世代形（英文·`sync.py maintained`），现行 sync.ps1 `.Contains($marker)` 串不匹配 → 误判「缺生成标记」报直写嫌疑。**git 考古**：`e2ff079 fix(ops-sync): sync.py 生成标记按文件类型注入——VBS 毒化事故根修`——sync.py 世代已修过同款雷，sync.ps1 重写时教训丢失。

## 二、处置落地（三笔，独立成卷）

| 笔 | 仓/commit | 内容 |
|---|---|---|
| 毒化防线 | TC `29158d0` | sync.ps1 生成标记类型感知（.vbs→`'` 注释形，# 形对 VBS 是语法错误）+ VBS 写入无 BOM（保持生产字节形 `27 20 67` 起头）；承 e2ff079 教训移植 |
| 幂等修复 | TC `1f78619` | （处置执行中发现的附带缺陷，独立成笔披露）Set-Content 追加行终止符 → 写入件「永不 identical」每轮空转；统一 WriteAllText 字节精确写入，编码按型（vbs 无 BOM/其余带 BOM 维持现态） |
| 入管执行 | 部署位（非 git 面） | `sync.ps1 -Force` 首轮引导（脚本自documented 路径）→ 6 vbs updated（新形标记+零功能变化）；10 非目标件 identical 未触 |

边界符合性：sync.ps1 改动=补标记所需最小动作+同机制缺陷修复，两笔均独立成笔、边界条款预留口内；计划任务零改动（文件原位更新）。

## 三、验收锚：sync 复跑读数（全量原文）

**修复后 run1（launch-seat.ps1 收敛前最后一轮）**：
```
[sync] mode=EXECUTE files=17
[sync] updated: launch-seat.ps1
[sync] done
```
**修复后 run2（幂等实证，本单验收轮）**：
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
**WARNING_COUNT=0 / IDENTICAL=17 / UPDATED=0** —— 零警告锚 ✓，且超出锚面达成真幂等（sync.py 世代「幂等三跑实测达标」同标准）。

## 四、字节级验证

- 6 vbs 改后首 3 字节全 `27 20 67`（`' g` 起头·无 BOM·生产字节形保持）+ 首行=新形标记 `' generated from TriCompany/scripts/ops — 禁直写（sync.ps1 单向维护）` ✓
- parse smoke：毒化防线笔后 sync.ps1 双解释器 PWSH_ERRORS=0 / PS51_ERRORS=0 ✓

## 五、计划任务改前/改后读数（零改动证链）

- 改前（13:4x）：MSG-Alert/MSG-Work-Watch/Notify-Poller/Seat-Watchdog/Sync-Alert=Ready，TriModel-Watchdog=Disabled
- 改后（13:55）：**逐行一致**（同 5 Ready+1 Disabled，路径零变）——文件原位更新、零任务改动、链路完好 ✓

## 六、观察项（非本单范围，如实附卷）

- `\TriModel-Watchdog → .fade/trimodel-watchdog.vbs`（Disabled）：第 7 号 vbs 存在于部署位但**不在 sync map**（纳管圈外+任务停用）——候 ops-sync owner 勘：入 map、归档、或随 TriModel 线定性。
- sync.py 正身仍在 TC 仓（e2ff079 版）与 sync.ps1 并存——两代工具归一候 owner 裁。

## 七、回滚方案（未启用）

- `git revert 29158d0` / `1f78619` 各自独立可逆；部署位 6 vbs 可经 revert 后 -Force 轮回退至旧形标记态（内容恒等，零功能风险）；主树/任务链全程未动。
