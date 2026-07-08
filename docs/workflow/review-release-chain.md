# 顺序审核发布链（Discovery -> Intelligence -> Designing）

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/integrated-product-development-flow.md
- syncMode: published-summary
- lastSyncedAt: 2026-06-15

目的：将白皮书、情报产物、PRD 计划串成严格审核发布链，杜绝未审核伪产物进入后续实施。

当前文件只承担 TriMetaverse 发布侧摘要职责。赛博公司当前阶段的顺序审核发布链、PRD 分支初始化与 docs bootstrap 真源，以 TriCompany 的 [integrated-product-development-flow.md](../../../TriCompany/docs/workflow/integrated-product-development-flow.md) 为准；本页用于发布侧摘要、跨模块引用和口径镜像，不作为公司级 IPD 主真源。

---

## 1. 强制顺序

1. `DISCOVERY` 人工审核通过后签发 `WP-v*`
2. `INTELLIGENCE` 人工审核通过后签发黄皮书版本 `YP-v*`
3. `INTELLIGENCE` 人工审核通过后以 PRD 版本号（如 `PRD001-v1.0.0`）作为推进依据
4. 仅“已审核且有版本号（非首次需版本变更）”的 PRD 可创建分支进入 DESIGNING
5. PRD 分支创建后，必须先拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，再在该结论对应的目标落位点建立或更新该分支对应的 `模块六层文档协同系统` 入口，至少覆盖 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/` 的最小落位

任一步未通过：禁止进入下一步。

补充门禁：版本号禁止预置，必须由人工审核通过后签发；阶段推进需满足“首次存在版本号”或“非首次版本号已变更”。

补充门禁：若 PRD 已审核但尚未形成当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，或尚未在目标落位点完成最小 docs 落位，则视为“分支初始化未完成”，不能算正式进入 `DESIGNING`。

---

## 2. 版本号规范

- 白皮书版本：`WP-v<major>.<minor>.<patch>`
- 黄皮书版本：`YP-v<major>.<minor>.<patch>`
- PRD 版本：`PRD<id>-v<major>.<minor>.<patch>`（示例：`PRD001-v1.0.0`）
- PRD 分支版本（建议）：`PRD001-v<major>.<minor>.<patch>`

---

## 3. 审核记录最小字段

- `review.status`：`approved`
- `review.version`：符合阶段版本号规范
- `review.reviewId`
- `review.approvedBy`
- `review.approvedAt`

以上字段应写入对应 `phase-result`。

---

## 4. 执行原则

- `DISCOVERY` 负责需求上游文档（白皮书）沉淀，不直接产出 PRD。
- `INTELLIGENCE` 是唯一 PRD 产出与分支决策点。
- `INTELLIGENCE` 之后的每个 PRD 分支，默认使用当前阶段 `ChiefProductOfficer` 模块设计所确认的归属模块 / 项目的 `模块六层文档协同系统` 承接真源、执行证据、培训导读与收口；`CEOChiefOfStaff` 只负责公司级任务分派、催办、升级与收口；十阶段主线负责流程和门禁，该系统负责分支的具体落地。
- 文档因果链固定为：白皮书（项目级） -> PRD（产品级） -> 设计规格（Spec，设计级） -> 产品实施总结（实施级） -> 单元测试报告（单元测试级） -> 集成测试报告（测试级） -> 红队扫描报告（安全测试级） -> QA报告（质量评估级） -> 部署手册（发布级） -> Assurance报告（保障级） -> 交付验收报告（交付级）。
- 推荐把分支执行目录直接对齐主线阶段名：`designing`、`coding`、`verify-integration`、`redteam`、`qa`、`deployment`、`assurance`；如需更细执行节奏，应作为这些标准阶段目录下的二级结构，而不是另起一套主阶段名。
- 分支实施与测试部署可并行，但最终统一 DELIVERY 交付。
