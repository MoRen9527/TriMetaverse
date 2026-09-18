# binding 收尾线·BOD 验收锚补充（CEO 两批入线）

- sourceOfTruth: 本件（binding 收尾线第三件输入；CPO 半部=binding-profile-claude-gap-cpo-view.md、CTO 半部=host-binding-gap-cto-opinion.md 之后）
- syncMode: static
- lastSyncedAt: 2026-09-19 03:2x
- 上位令: CEO 2026-09-19 03:22 两批（「把这条验收锚补充转给 binding 收尾执行线」「lg025 红，挂」）
- 派工席: Board（BOD）

## 批①：源侧 agent-body binding 声明校准入验收锚

**背景**：B4/走查续审 CPO 源侧发现，`source-agents/<席>/agent-body.agent.md` 两处 binding 声明（CPO 件 :11「宿主绑定事实由各宿主 binding profile 承载（不入源侧固化）」与 :27「宿主 binding 事实由 binding profile 承载，不入本件」）：

- 作为**设计原则句**准确（机构实存：单点真源 13 席 profile+生成管线；claude hostEntries 13/13 已立）；
- 作为**现状描述**为期票（CPO gap 件 F2-F5：阶段字段陈旧/主指针偏置/支持面盲区）；
- **措辞瑕疵**：「各宿主 binding profile」语法暗示每宿主一份，与已定谳形态（否决镜像树、单文件双宿主）相抵。

**CEO 批**：纳入 binding 收尾窗验收锚。执行口径=收尾窗同窗校准 13 席 agent-body 两处声明措辞为「**宿主绑定层（binding profile，单点双宿主）承载**」，与 CPO 件 §四锚 4（session-body 渲染指针校准）同窗——agent-body 与 session-body 同属渲染源头件，漏 agent-body=校准半截。

## 批②：lg025 红挂本线候独立批

**红象**：契约结构面红——source-agents 席 contract.yaml `paths` 缺 `session_body` 键（validator 既有备案，非认知层执行引入，读数 402/399/2/1 中在案）。

**CEO 批**：挂 binding 收尾线候独立批。理由=契约 paths 结构面与本线 schema v0.2 追平同域（contract.yaml/validator 同面），收尾窗内一并消红，勿散线。

## 验收锚累计（本线执行窗候立时生效）

| # | 锚 | 来源 |
|---|---|---|
| 1 | profile 单点可答某席 claude 宿主 live 入口/阶段/支持面，零借 copilot 字段 | CPO 件 §四 |
| 2 | 13/13 无孤立 current-copilot-host-live 残留 | CPO 件 §四 |
| 3 | 两 manifest claude 记录非零（13 agents+session bodies 对表） | CPO 件 §四 |
| 4 | session-body 渲染指针随窗校准（借位引用消失） | CPO 件 §四 |
| **5** | **13 席 agent-body :11/:27 binding 声明措辞校准为「宿主绑定层（binding profile，单点双宿主）承载」** | **本件批①** |
| **6** | **lg025 红（paths 缺 session_body 键）消红，validator 该族零红** | **本件批②** |

## 边界

- 本件为验收锚补充非执行令；binding 收尾执行窗（三件收尾：schema v0.2/manifest 补登/governedBy 补依+锚 5/6）候 BOD 排窗另令。
- 锚 5 校准走源侧→渲染链（agent-body 为渲染源头），禁手工拷贝位改。
