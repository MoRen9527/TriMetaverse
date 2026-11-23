# 任务书呈批件·charter-20261123T060521Z（M4-v2 出稿形首用·呈 CEO 批）

- sourceOfTruth: 本卷+同目录 charter-20261123T060521Z.json（a13fe3875·河源侧原文逐字节交付）
- 令源: CEO 附令「charter-060521Z 仍未获 CEO 批·备好呈批件·CEO 批后才施工（批前可先续跑轮次不改码）」+M4-v2（任务书一律呈 CEO 审批·COS 只出稿不代批）
- 时点: 写前现查 2026-11-23T15:32+0800（D-47 原值）

## §一 · 基本信息

| 字段 | 值 |
|---|---|
| charter_id | rN-task-20261123（源 run=resume4·generated 06:05:21Z） |
| status | pending_approval（**候 CEO 批**） |
| items | **7 条**（每条含 title/target/change/verify/rollback 五字段·JSON 校验过） |
| 批复时点位 | `approval_comment: ______` ／ `approval_time: ______`（**CEO 批面填**） |

## §二 · items 清单（7 条·源席视角）

| # | opinion_id | 要点 | target |
|---|---|---|---|
| 1 | cos-1 | 26 件 observed 清单/证据链补强 | plan.json#/keep/0..24 |
| 2 | coo-1 | W48 迁移 plan 的 id 分散问题收口 | plan.json |
| 3 | cao-1 | families 14 件补 owner/due/acceptance/depends_on | plan.json |
| 4 | cpo-1 | W48 实例 9 件 id 与 1 件散射的锚定 | plan.json |
| 5 | cto-1 | T1-1 run_id 正则合法化 resume 分形 | runtime/cognition |
| 6 | cho-1 | plan.json 的 RACI 责任矩阵+families 14 字段 | plan.json |
| 7 | cfo-1 | 迁移成本可结算（cost_settlement 面） | runtime/cognition |

## §三 · 出稿注记（COS 面·如实）

1. **覆盖对表注**：**item 5（cto-1·run_id 正则 resume 分形）已由 DP-20261123-016 修复**（a7e40af·四形正则+62 passed·CTO 验收）——批后施工时该项可对表既有 commit（不重复施工·验证锚引用）。
2. **与维度冻结的关系**：本 charter 出稿于 v1 表 ready 前（06:05 vs 14:24）——items 为 resume4 轮意见；v1 冻结表自下轮联审生效（不回溯本件）。
3. **批前续跑**照 CEO 令：resume5（已签`T073047Z`）可续跑不改码——本件批后施工。

## §四 · 呈批链

本卷+BOD 转呈 CEO（notify-mailbox 或 BOD 直转）——CEO 批（批语/时刻填上表）→施工派工（DP 三步）→下一轮点火。

---
—— COS 小贾（m-cos·出稿不代批·M4-v2 形）·写前现查 2026-11-23T15:32:05+0800（D-47 原值）
