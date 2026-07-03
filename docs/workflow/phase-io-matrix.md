# TMV Workflow 阶段输入/输出矩阵（v1）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/phase-io-matrix.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-03

> 目的：用一页表格说明主线阶段与 PRD 分支阶段“读什么、判断什么、写什么、失败回哪”，并明确这些 PRD 分支如何通过 `模块六层文档协同系统` 落地。

当前文件是 TriMetaverse 研发工作流阶段矩阵的本地真源，只负责十阶段输入/输出/回流协议，不承担 TriCompany 公司级制度真源职责。

| 阶段 | 作用域 | 上游输入 | 系统关键判断 | 主要输出 | 门禁/通过条件 | 失败回流 |
| --- | --- | --- | --- | --- | --- | --- |
| DISCOVERY | 主线 | 白皮书基线资料、项目目录上下文 | 是否形成需求阶段可用的商业需求上游文档 | `tmv-whitepaper.md`、discovery上下文摘要、审核记录 | 人工审核通过后签发 `WP-v*`；首次需有版本号，非首次需版本变更，满足后进入 INTELLIGENCE | 无（首阶段） |
| INTELLIGENCE（需求） | 主线 | DISCOVERY 输出（白皮书）、市场/用户补充资料（可选） | 是否形成可分叉执行的 PRD（含版本），并满足需求完整性 | PRD（版本化）、线框图/原型图、用户故事地图、需求证据包、`prdDelta`、审核记录 | 人工审核通过后签发 PRD 版本（如 `PRD001-v1.0.0`）；首次需有版本号，非首次需版本变更；仅审核版 PRD 可分叉 | 回流 DISCOVERY |
| DESIGNING（设计） | PRD分支 | 对应 PRD、原型图 | 设计文档是否完整且可指导编码 | 系统架构设计文档、技术方案选型报告、高层模块划分图、数据库概念模型、详细设计文档（Spec）、接口 API 文档 | 设计资产齐备且与 PRD 一致 | 回流 INTELLIGENCE |
| CODING（编码） | PRD分支 | 详细设计文档（Spec）、接口 API 文档、UI 设计稿 | 编码与单元级验证是否通过 | 可运行源代码、单元测试代码与结果、代码注释、模块集成文档、产品实施总结 | 无阻断级编码/单测失败 | 回流该 PRD 的 DESIGNING |
| VERIFY-INTEGRATION（测试） | PRD分支 | PRD、Spec、测试计划、测试用例 | 系统测试与集成验证是否通过 | 测试报告、集成测试报告、缺陷清单、自动化测试脚本、质量评估报告 | 无阻断级测试失败 | 回流该 PRD 的 CODING |
| REDTEAM | PRD分支 | 对应 PRD 的 VERIFY-INTEGRATION 通过产物 | 是否存在可利用 `critical` 风险 | 红队扫描报告、风险分级清单 | 无 critical 才通过 | 回流该 PRD 的 CODING 或 VERIFY-INTEGRATION |
| QA | PRD分支 | 对应 PRD 的 REDTEAM 修复后产物 | 非对抗质量分是否 >= 阈值（默认80） | QA报告、质量结论 | `score >= threshold` 或显式 skip | 回流该 PRD 的 CODING / VERIFY-INTEGRATION / REDTEAM |
| DEPLOYMENT（发布） | PRD分支 | 测试报告、PRD、部署清单、运维手册 | 发布与部署是否成功且可追溯 | 已上线可运行系统、发布说明、用户手册、生产环境部署文档（含部署手册）、分支 CI/CD、Docker、K8s 资产 | 发布资产完整且可校验 | 回流该 PRD 的 CODING 或 QA |
| ASSURANCE | PRD分支 | 对应 PRD 的 DEPLOYMENT 产物与环境 | 漏洞/压力/安全/回归测试是否通过 | Assurance报告、分支专项测试报告、放行结论 | 无高危/严重阻断项 | 回流该 PRD 的 QA / DEPLOYMENT |
| DELIVERY | 主线聚合 | 全部 PRD 分支的 ASSURANCE 通过产物 | 聚合交付是否齐全、版本是否可追溯 | 交付验收报告、`delivery-manifest.json`、`delivery-report.md`、`release.zip` | 所有分支通过且交付件齐全 | 回流对应失败分支 |

---

## PRD 分支落位规则（模块六层文档协同系统）

- `INTELLIGENCE` 审核通过并签发版本号后的每个 PRD 分支，默认通过 `模块六层文档协同系统` 落地，而不是把设计、实施、测试和收口产物散落在临时文档或聊天记录中。
- 这里的“PRD 分支”特指由 `INTELLIGENCE` 审核后正式产出的产品分支；`workflowRefs` 中出现的 `feature/example-skill`、`feature/example-schedule` 一类 `branchId` 仍然只是通用分支标识，不默认适用本节的 docs bootstrap 硬要求。
- 在落地前，必须先拿到 PRD 的归属路由结论与目标落位仓；当前阶段由 `ChiefProductOfficer` 主责模块设计与归属方案，`CEOChiefOfStaff` 只负责公司级任务协调。既有模块能力落对应模块，新模块先建新模块根，只有项目根自身范围才落当前项目根 `docs/`。
- 推荐映射如下：
  - `docs/product/`：承接 PRD 范围、需求、原型映射、产品路线与产品状态。
  - `docs/engineering/`：承接 `DESIGNING` 的 Spec、架构、技术路线和技术状态。
  - `docs/execution/<prd-or-workstream>/<phase>/`：承接各 PRD 分支在 `designing`、`coding`、`verify-integration`、`redteam`、`qa`、`deployment`、`assurance` 的 `PLAN.md`、`SUMMARY.md`、`VERIFICATION.md`。
  - `docs/registry/`：承接分支形成稳定结论后的 business / product / code 状态回写。
  - `docs/workflow/`：承接分支 handoff、迁移、编排、发布或治理机制。
  - `docs/training/`：承接分支交付后的 onboarding、使用手册、流程导读与培训材料。
- 这意味着矩阵里的 `主要输出` 不只是“产物名称”，还隐含“这些产物必须进入对应 docs 层并接受后续阶段引用”。
- 若某 PRD 分支尚未形成当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，或尚未在目标落位点建好最小 docs 入口，则它不应被视为真正完成了分支初始化。

## 配套文件映射

- 规范：`workflow-engine-spec.md`
- 阶段结果结构：`phase-result.schema.json`
- 门禁结构：`quality-gates.schema.json`
- 运行手册：`workflow-runbook.md`
- 运行配置：`workflow-engine-config.example.yaml`

---

## 建议用法

1. 每轮执行前先复制本表，标注本轮目标与阈值。
2. 每阶段完成后补充对应证据路径。
3. 若触发回流，在同一行追加“回流原因/修复动作/复测结果”。
