# 任务书呈批件 **v5**·charter-20261124T122210Z（**12 items=11+生成器drop收敛**）＋DP-049 合并施工批

- sourceOfTruth: 本卷+`/srv/fleet/TriRMC/fade001-runs/shift-W48-resume18-20261124T120128Z/charter-20261124T122210Z.json`（5393B·schema 1.0.0·BOD 20:33 转全文）
- 令源: CEO 20:3x「**等任务书批了一起走修**」（BOD 20:32）+「DP 取号修 normalizer 那 1 行，批」
- 时点: 写前现查 2026-11-24T20:36+0800（D-47 原值）

## §一 · 基本信息

| 字段 | 值 |
|---|---|
| charter_id | rN-task-20261124（source.run_id=**resume18**·5 items） |
| status | pending_approval（**候 CEO 批**） |
| items | **5 条**（cos/coo/cao/cpo/cto 各 1） |
| aggregation | items_before=7·items_included=**12**（5 原+2 捞回+1 判卷面+3 A/F/H+1 生成器收敛·CEO 令） |
| 批复时点位 | `approval_comment: ______` ／ `approval_time: ______` |

## §二 · items 清单（5 条）

| # | opinion_id | 要点 | 落点 |
|---|---|---|---|
| 1 | cos-1 | **verify 强制 runId/strict fail-closed**（`--run-id`/`--strict` 必填·对不上即 fail·retry 编号隔离主键） | verify.py |
| 2 | coo-1 | **plan 时标先行窗口+实测落点对表**（planned/actual 双录·不许树时间戳冒充·超 480s 入 window_conflicts） | plan_enricher.py |
| 3 | cao-1 | **意见转条款入册+生效时点**（铸条款号+commit+effective_at·deferred→adopted） | CAO 条款册 |
| 4 | cpo-1 | **七席尾段联审落卷 fail-closed**（close 前强制七席·opinions_in==7·缺一席 partial 不发 notify_done） | close 链 |
| 5 | cto-1 | **统一 run_id 与 retry 账本**（`-retry1` 挪 retry_seq/retry_of·verify.run_id 补正名） | runtime |
| **6** | **RESTORED-1**（原 drop-1·**CEO 捞回**） | **`close.upgrade_list 12 条缺陷逐条绑定主责席与责任面`**（原文照录·施工细则候批） | close 链 |
| **7** | **RESTORED-2**（原 drop-2·**CEO 捞回**） | **`补无人值守余额不可得 fail-safe`**（原文照录·施工细则候批） | cost 面 |
| **8** | **score-fail-closed**（CEO 已批「要」） | **判卷面落卷 fail-closed**：`subjective-score.json` 缺席→**不再 pending 改 partial**（不发 notify_done·与 cpo-1 同形） | score 链 |
| **9** | **A→plan-freeze**（CEO 审过并入） | **拍前冻结件** `plan-freeze.json`（COS 席规划期产·plan 有机产物）——**复算判据**：程序逐树重算 md5/size/counts 对表模型声明·不一致=fail·缺席 fail-closed | plan_skill |
| **10** | **F→close-acceptance**（CEO 审过并入） | **告警汇总件** `close-acceptance.json`（COS 席收口·**对过程数据验收非重采**）——**复算判据**：程序读告警日志复算 total/by_family/max_latency·verdict 程序判 | close_skill |
| **11** | **H→拆分**（CEO 审过并入） | plan 登记值守计划（谁/拍频/窗）+close 验收对表——**复算判据**：程序读 patrol log 重数拍频对表·缺对表 fail-closed | plan+close |
| **12** | **生成器 drop 收敛**（CEO 批「收敛形」） | **a=每席保底 1 条+总上限保留（建议 10）**／**b/d 保留**（dropped 标 `opinion_id｜title` 源头+捞回溯源）／**c 取消**（保底即公平）——落点 **charter_generator L134-135**（现 `slice(0,5)` 全局硬截断→保底+上限逻辑） | charter_generator |

## §三 · dropped 2 条已捞回（CEO 20:4x 令「dropped 两条捞回来，并进任务书等批」）

charter aggregation（**原文直引·SDE 交付 e435482ec 附**）：`{"items_before":7, "items_included":5, "dropped":["close.upgrade_list 12 条缺陷逐条绑定主责席与责任面","补无人值守余额不可得 fail-safe"]}`：
- **drop-1**：`close.upgrade_list 12 条缺陷逐条绑定主责席与责任面`
- **drop-2**：`补无人值守余额不可得 fail-safe`

**⚠️另附注（SDE 发现·候 CEO 判）**：charter source **`opinion_ids=[cos-1,coo-1,cao-1,cpo-1,cto-1]`——7 席中 `cho`/`cfo` 意见未入**——三种可能：①其意见无改进项（通过）②生成器 filtrate 掉 ③其意见未生成——**候核**（cpo-1 的「七席尾段 fail-closed·opinions_in==7」item 正指此缺口——**本 charter 自身即该缺口的实例**）。
**COS 注**：两条均为 resume18 轮末生成器 filtrate 结果——**如 CEO 要捞回，可在批时句「捞回 drop-1/2」**（我面据批语入施工批）。

## §四 · DP-049（合并批·已毕先施工）

- **DP-049=normalizer 1 行修**：**已施工先毕**（**3a265f1**·CTO 验收）——**批后留验**（不重施工·核锚引用）。
- CEO 令：「DP 取号修 normalizer 那 1 行，批」=正式追认。

## §五 · DP-042~049 进度账（本轮施工批全景）

| DP | 件 | 状态 |
|---|---|---|
| DP-042 | A+B 热修（prompt spec+parse 加固） | 已毕 |
| DP-043 | 锚表接线+charter-203018Z 5 items | 01/02 毕·03 D-96 入册·04 台账面毕 |
| DP-044 | CEO 五令批面（DCA/tick/COO 运维职责/round_count） | 已办（source-agents 生效 ba1382c→6cf248a） |
| DP-045 | **c3 双修 P0**（dry_run 穿门） | **已毕**（57393fa+423987c·14 passed·24/24） |
| DP-046 | dce 开关（DCE_EXECUTE=1） | 施工 92275220·**候验收** |
| DP-047 | migrate argv 完整性 | **已毕**（177b56f·26/26+19） |
| DP-048 | prompt cap 修 | **已毕**（7bd43fa·10 passed） |
| DP-049 | normalizer 1 行 | **已毕**（3a265f1·批后留验） |

## §六 · 呈批链

本卷+BOD 转呈 CEO——**批后统一施工**（charter 5 items + DP-049 留验核 + DP-046 验收收口）——**一次呈批·一次施工**（CEO「等任务书批了一起走修」）。

---
—— COS 小贾（m-cos·出稿不代批·M4-v2）·写前现查 2026-11-24T20:36+0800（D-47 原值）

## §七 · A/F/H 改造细则（**CEO 21:1x 审过「合理，并入任务书一并等批」**·全文附录）

**细则稿**：`cos-afh-refactor-detail-20261124.md`（**8ef38a699**·COS 面出行细则）。
**要点**：
- **A→plan_skill 拍前冻结件**（plan-freeze.json：md5/值面/基线声明·COS 席规划期产·**plan 有机产物**）
- **F→close_skill 告警汇总件**（close-acceptance.json：过程告警计数/时延·**对过程数据验收非重采**）
- **H→拆分**（plan 登记值守计划+close 验收对表）
- **三族 manual→pass/fail**（机判附件·**缺席=fail-closed**·与判卷面同形=四件同规则）
**§七 已审过并入 v4**（items 9/10/11+四件同规则）——**skill 件=声明候选·机判=程序复算对表·不一致=fail**（CEO 勘正）。

---
—— COS 小贾·v3 附 写前现查 2026-11-24T21:06+0800

## §八 · 改进项上限三层现状备忘（BOD 实读·CEO 21:2x 令写入）

| 层 | 代码锚 | 现状 |
|---|---|---|
| **7 席联审层** | `loop_joint_review_spawn` **L113-115** | **每席 ≥1 条**（可写「本席无改进」no-improvement 占位）·**无每席上限** |
| **段 7 评分层** | `score_skill_spawn` **L42/L49** | **每席 ≤3 条**（可选·缺=合规范本） |
| **charter 层（问题所在）** | `charter_generator` **L134-135** | **全局前 5 条硬截断**（`slice(0,5)`）——**不是每席一条** |
| **收敛后（item 12）** | 同上改 | **每席保底 1 条+总上限 10**（超限 drop 带来源标 `opinion_id｜title`+捞回溯源） |

**诊断**：三层上限各自合理（联审保下限/评分限上限/charter 错在全局截断）——**item 12 修 charter 层**（保底+总限）·联审/评分两层不动。

---
—— COS 小贾·v5 附 写前现查 2026-11-24T21:26+0800
