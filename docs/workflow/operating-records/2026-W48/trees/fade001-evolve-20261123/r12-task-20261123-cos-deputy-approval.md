# 任务书 r12-task-20261123·COS 代裁批（七席联审五缺陷+各席意见→修形件·M2 自证）

- sourceOfTruth: 本卷（COS 代批正身·r12-task·charter json 同目录 `charter-r12-task-20261123.json`）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47）
- 令源: CEO 追问（BOD 转达）「任务书呢，7 席的改进意见要形成任务书啊」——**M2 自证**：七席均分 73.49<95 → 任务书产生制触发（本轮 evolve 态）
- 时点: 写前现查 2026-11-23T03:07:55+0800（D-47 原值）
- 挂载: `trees/2026-W48/trees/fade001-evolve-20261123/`（下一轮 flip 后首轮执行）

## §一 · COS 代批五要件（D-86 §一·逐项钉）

1. **批件落卷**=本卷+charter json 同目录；
2. **三类判据零命中声明**：修形件=代码/流程改面可回滚·非重大不可逆／非系统硬约束／非 CEO 保留权——**M2 条款授权形**（<95 产生任务书·COS 代批=CEO 明示授权承 D-85 款④+D-86 精神）；「改 loop 机制本体」回呈项——本件=缺陷修形非机制本体改（flag 状态机/评分口径/阈值不动）→不触回呈①④；
3. **「COS 代批」显式字样**=本卷标题+charter `approver_pending: "COS"`；
4. **时点**=2026-11-23T03:07:55+0800；
5. **入台账**=COS 台账 843 笔随记。

## §二 · items 清单（10 条·每条五字段·json 正身见同目录）

| # | opinion_id | 标题 | 落码域 |
|---|---|---|---|
| 1 | R12-CAO-01 | 四类活件族去向固化（防四连） | 迁移器（COO 域·SDE）+CTO check |
| 2 | R12-CAO-02 | B4 可审性三缺回补（hash/runId/段独立件） | .shift-ade 扩展件（SDE） |
| 3 | R12-CPO-01 | B1 whitelist 族逐族对表 | 迁移器判据（SDE） |
| 4 | R12-CTO-01 | 门件固化（ignite ceo-ruling 落件+轮毕即落 SOP） | 值席+COO SOP |
| 5 | R12-CTO-02 | token 不进 sudo argv 修形 | SDE 执行面 |
| 6 | R12-CPO-02 | 出题改善三项（plan 必附件） | 段 3 出题面（CPO+FSD） |
| 7 | R12-COO-01 | carry_over 逐项清单入 .shift-ade | 迁移器（SDE） |
| 8 | R12-CFO-01 | 成本读数框架落地（返工/轮级两轴） | cost-log（CFO 面+CTO） |
| 9 | R12-CHO-01 | accountability 归属固化（轮面责任矩阵） | 轮卷模板（COS 汇总面） |
| 10 | R12-COS-01 | 门件生命周期 SOP 条款化（COS 流程面） | loop 规范（COS） |

**items 计数=10**·每条 verify/rollback 五字段全齐（json 校验过）。

## §三 · 根因勘（BOD 追问：joint-review-trigger 本应自动产 charter 而未产）

**如实勘注**：本轮七席联审=**COS 人工发起**（SendMessage 征集·非自动触发）——自动环（joint-review-trigger→生成器→charter）**未接线到「联审毕自动调生成器」环节**：P4 的 E3 钩子在 runner 内（round_runner 轮末），而本轮联审=**人工编排面**（非 runner 轮末钩链路）——**自动链缺口=「人工联审」→「自动生成器」之间无桥**。根因修建议：①联审触发器本体化（joint-review-trigger 脚本：联审卷落齐→自动调 generateCharterFromFile）②或人工联审形=生成器 CLI 直调（本次即手写 json 补位）——归 CTO 技术面定形（下轮前）。

## §四 · 挂载与执行

- 挂载点=`trees/2026-W48/trees/fade001-evolve-20261123/`（本目录·charter+批件）；
- `auto_dispatch: true`（下一轮 flip 后首轮执行·CEO 承 D-86 自动拾取授权）；
- 下一轮执行=按 items 逐条落码（各域如上表）→跑下一轮→七席再审→>95 判进化。

---
—— **COS 代批**（m-cos·M2 条款自证·CEO 明示授权形）·写前现查 2026-11-23T03:07:55+0800（D-47 原值）
