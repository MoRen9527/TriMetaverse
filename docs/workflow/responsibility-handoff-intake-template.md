# 岗位职责交接 Intake 模板

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/responsibility-handoff-intake-template.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

本模板用于在岗位启用、职责移交、acting owner 切换或 completion tracking 需要结构化跟踪时，发起一次标准 `RESPONSIBILITY_HANDOFF` 请求。

当前文件是 TriMetaverse intake 模板资产的本地真源，只负责自然语言交接请求的整理格式和发起入口；交接治理 owner、source-side 发布链与岗位启用边界仍以 TriCompany 对应岗位 / workflow 真源为准。

它不是正式记录本身，也不替代 `handoff-templates/responsibility-handoff.example.json`。
它的用途是先把自然语言交接需求整理成统一字段，再由当前交接治理 owner、公司级协调侧或相关专业负责人接手。

## 1. 当前阶段发起方式

当前阶段默认先提交给 `CEOChiefOfStaff` 代执行。

`ChiefHumanResourcesOfficer` 是该对象的默认治理设计 owner，但在其尚未独立 live 上岗前，实际执行与收口仍由 `CEOChiefOfStaff` 代管。

适用条件：

- 新固定员工岗位启用前，需要明确交接边界、acting owner 和验收条件。
- 某项长期职责要从临时 owner 切到正式岗位 owner。
- 某项岗位启用或 owner 切换会影响 workflow、registry、support payload、meeting discipline 或 host binding。
- 当前需要的不是单次动作项，而是一条可持续跟踪的交接治理对象。

### 当前阶段建议最小文本

```md
对象类型：RESPONSIBILITY_HANDOFF
治理设计 owner：ChiefHumanResourcesOfficer
当前代执行 owner：CEOChiefOfStaff

交接主题：
交接类别：role-onboarding / responsibility-transfer / acting-owner-transfer / workflow-owner-transfer / offboarding / other
前任 owner：
接手 owner：
当前 acting owner：
当前生效边界：
需要回链的真源文件：
涉及的支撑资产：

外层状态：draft / submitted / in-progress / blocked / completed
交接细分状态：drafted / ready-for-execution / in-progress / blocked / ready-for-acceptance / accepted / frozen

验收条件：
下一动作：
阻塞项：
升级条件：
补充说明：
```

## 2. 当前阶段治理边界

- `ChiefHumanResourcesOfficer` 是默认治理设计 owner。
- `CEOChiefOfStaff` 在 CHO 尚未独立上岗前负责代执行、排程、催办与收口。
- `ChiefProductOfficer`、`ChiefTechnologyOfficer` 和其他固定岗位只提供专业侧确认，不自动承担交接治理闭环 owner。
- 若交接事项触及中央边界变化、正式宿主切换或长期岗位重构，必须升级到 CEO 或 `BusinessStrategy`。
- 若当前只是 source-side 定义完成但 live 未绑定，必须明确写成 `source-side-not-live`，不得写成已 live 完成。

## 3. 专业侧协同方式

`RESPONSIBILITY_HANDOFF` 的核心不是“谁负责专业判断”，而是“谁负责交接闭环”。

只有以下问题已经收口清楚，才适合要求产品侧或技术侧给出专业确认：

- 前任 owner、接手 owner 和 acting owner 已明确。
- 生效边界已经明确，是 source-side、support 还是 live。
- 当前需要确认的是产品影响、技术影响、support asset 影响或 docs writeback 范围，而不是交接 owner 本身。

### 专业侧建议最小补充文本

```md
对象类型：RESPONSIBILITY_HANDOFF（专业侧确认）
专业侧角色：ChiefProductOfficer / ChiefTechnologyOfficer

已确认交接主题：
已确认前任 owner：
已确认接手 owner：
当前需要专业侧确认的问题：
- 产品边界 / 模块影响
- 技术实现 / support asset 影响
- docs 或 registry 回填范围
- 是否需要升级到 BusinessStrategy 或 CEO
```

## 4. 与结构化对象的对应关系

将上面的文本整理成正式 JSON 对象时，至少应映射到这些字段：

- `handoffSubject`
- `handoffCategory`
- `previousOwner`
- `incomingOwner`
- `actingOwner`
- `scope`
- `sourceOfTruthFiles`
- `completionTrackingStatus`
- `acceptanceCriteria`
- `nextAction`

如已明确支撑资产、阻塞项和升级条件，再补：

- `supportAssets`
- `blocker`
- `escalations`
- `notes`

外层 envelope 仍需补齐：

- `status`
- `ownerRole`
- `timebox`
- `summary`
- `relatedModules`
- `evidence`
- `nextActions`
- `approvals`

结构化样板见：

- `handoff-templates/responsibility-handoff.example.json`
- `responsibility-handoff.schema.json`
- `tricompany-handoff-objects.md`
- `TriCompany/docs/workflow/chief-human-resources-officer-handoff-governance.md`
