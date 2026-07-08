# 瀑布对齐迁移对照表（旧阶段名 -> 新阶段名）

日期：2026-03-05  
适用范围：TriMetaverse workflow 文档体系

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/waterfall-migration-mapping.md
- syncMode: source-only
- lastSyncedAt: 2026-06-03

---

## 1. 阶段迁移总览

当前文件是 TriMetaverse workflow 历史阶段迁移对照表的本地真源，只负责旧阶段名到新阶段名的迁移说明和审计兼容口径，不承担 TriCompany 公司级 workflow 书面真源职责。

| 旧模型阶段 | 新模型阶段 | 对齐说明 |
| --- | --- | --- |
| DISCOVERY | DISCOVERY（需求前准备） | 保留，定位为需求阶段上游文档沉淀（白皮书/商业需求背景）。 |
| INTELLIGENCE（情报增强） | INTELLIGENCE（需求阶段） | 职责上移为需求阶段核心，产出 PRD/原型/用户故事并作为分叉触发点。 |
| DRAFTING | DESIGNING（设计阶段） | 更名并收敛为“设计阶段”，输入 PRD+原型，输出架构/Spec/API 等设计资产。 |
| IMPLEMENT + VERIFY-UNIT | CODING（编码阶段） | 合并为单阶段，统一承载实现与单元级验证。 |
| VERIFY-INTEGRATION | VERIFY-INTEGRATION（测试阶段） | 名称保留，职责对齐系统测试阶段。 |
| DEPLOYMENT | DEPLOYMENT（发布阶段） | 名称保留，职责对齐发布阶段。 |
| REDTEAM / QA / ASSURANCE / DELIVERY | 同名保留 | 顺序不变，分别承担安全对抗、质量评估、发布后保障、交付聚合。 |

---

## 2. 分叉规则迁移

| 项目 | 旧规则 | 新规则 |
| --- | --- | --- |
| PRD 产出决策点 | DRAFTING | INTELLIGENCE |
| 分叉起点 | DRAFTING 之后 | INTELLIGENCE 之后 |
| 分支流水线 | IMPLEMENT -> VERIFY-UNIT -> VERIFY-INTEGRATION -> ... | DESIGNING -> CODING -> VERIFY-INTEGRATION -> ... |

---

## 3. 输入-输出对齐（按瀑布）

| 新阶段 | 输入（Input） | 核心输出（Output） |
| --- | --- | --- |
| INTELLIGENCE（需求） | 白皮书、市场/用户补充资料（可选） | PRD、原型图、用户故事地图、需求证据包 |
| DESIGNING（设计） | PRD、原型图 | 架构设计文档、技术方案报告、模块划分、数据库概念模型、Spec、API 文档 |
| CODING（编码） | Spec、API 文档、UI 设计稿 | 可运行源代码、单测代码与结果、代码注释、模块集成文档、产品实施总结 |
| VERIFY-INTEGRATION（测试） | PRD、Spec、测试计划、测试用例 | 测试报告、缺陷清单、自动化测试脚本、质量评估报告 |
| DEPLOYMENT（发布） | 测试报告、PRD、部署清单、运维手册 | 已上线系统、发布说明、用户手册、生产环境部署文档 |

---

## 4. 兼容与审计说明

- 旧阶段名 DRAFTING、IMPLEMENT、VERIFY-UNIT 视为历史术语，不再用于正式章节。
- 历史术语仅允许出现在术语表、变更记录、迁移对照表和自检命令中。
- 术语权威源仍为 `docs/workflow/terminology.md`。
