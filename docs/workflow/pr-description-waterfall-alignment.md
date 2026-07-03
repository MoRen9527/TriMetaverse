# PR 描述模板：瀑布对齐修正（TriMetaverse）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/pr-description-waterfall-alignment.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-03

## 最终直接使用版（推荐）

当前文件是 TriMetaverse PR 描述模板资产的本地真源，只提供瀑布对齐场景下的文案模板，不承担 TriCompany 公司级 workflow 书面真源职责。

### PR 标题

`docs(governance): 流程瀑布化与门禁一致性收敛`

### PR 首句（极简 80 字）

完成“白皮书→PRD→Spec→实施→测试→交付”主链统一，确保版本、产物、验收全程可追溯。

### Commit Message

`docs(workflow): align waterfall stages, gates, and audit artifact chain`

### Squash merge 提交正文（2 行）

Align workflow to a 10-stage waterfall model with strict review/version gates and PRD branching at INTELLIGENCE.  
Unify terminology and artifact causality chain across whitepaper, spec, runbook, matrix, config, and schema for full auditability.

---

## 标题建议

`docs(workflow): 对齐瀑布模型阶段与输入输出文档（INTELLIGENCE分叉 + DESIGNING/CODING重构）`

## 精简摘要（100~150字，可直接粘贴）

本次修正将流程按瀑布模型对齐：`INTELLIGENCE` 定位为需求阶段并负责 PRD 分叉，`DRAFTING` 更名为 `DESIGNING`，`IMPLEMENT+VERIFY-UNIT` 合并为 `CODING`，同时统一各阶段输入/输出文档与主因果链，确保规范、runbook、配置与 schema 一致可执行。

备选摘要：

完成 workflow 文档体系的瀑布化对齐：分叉点前移至 `INTELLIGENCE`，阶段重构为 `DESIGNING/CODING`，测试与发布阶段输入输出按经典模型统一；并同步术语、配置、schema 与执行清单，消除旧阶段名和链路语义漂移。

## 超短版（一句话副标题）

完成 workflow 瀑布化对齐：`INTELLIGENCE` 负责需求与分叉，`DESIGNING/CODING` 重构落地，并统一阶段输入输出与主因果链。

---

## 背景

本次 PR 目标是将现有流程文档按传统瀑布模型进行部分对齐修正，并统一阶段命名与文档流转逻辑，修正此前不一致点：

- `DISCOVERY` 定位为需求前准备（产出白皮书/商业需求上游文档）
- `INTELLIGENCE` 定位为需求阶段（产出 PRD/原型/用户故事，并负责分叉决策）
- `DRAFTING` 更名为 `DESIGNING`（设计阶段）
- `IMPLEMENT + VERIFY-UNIT` 合并为 `CODING`（编码阶段）
- `VERIFY-INTEGRATION` 对齐测试阶段
- `DEPLOYMENT` 对齐发布阶段

---

## 变更摘要

### 1) 阶段与分叉规则重构

- 主流程由 11 阶段收敛为 10 阶段
- 分叉触发点由 `DRAFTING` 前移至 `INTELLIGENCE`
- 分支流水线由
  - 旧：`IMPLEMENT -> VERIFY-UNIT -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE`
  - 新：`DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE`

### 2) 输入-输出文档对齐（瀑布映射）

- `INTELLIGENCE`：输入白皮书与需求证据，输出 PRD/原型/用户故事
- `DESIGNING`：输入 PRD/原型，输出架构文档/Spec/API 文档
- `CODING`：输入 Spec/API/UI，输出代码与单元验证结果
- `VERIFY-INTEGRATION`：输入 PRD/Spec/测试计划，输出测试报告与缺陷清单
- `DEPLOYMENT`：输入测试报告与发布清单，输出上线系统与部署文档

### 3) 因果链统一

主因果链统一为：

`白皮书 -> PRD -> 设计规格（Spec） -> 产品实施总结 -> 单元测试报告 -> 集成测试报告 -> 红队扫描报告 -> QA报告 -> 部署手册 -> Assurance报告 -> 交付验收报告`

---

## 影响文件（核心）

- `project.md`
- `tmv-whitepaper.md`
- `docs/workflow/workflow-engine-spec.md`
- `docs/workflow/workflow-runbook.md`
- `docs/workflow/phase-io-matrix.md`
- `docs/workflow/workflow-engine-config.example.yaml`
- `docs/workflow/phase-result.schema.json`
- `docs/workflow/review-release-chain.md`
- `docs/workflow/README.md`
- `docs/workflow/wsdd-v1.md`
- `docs/workflow/prd-branch-delivery-checklist.md`
- `docs/workflow/terminology.md`
- `docs/workflow/waterfall-migration-mapping.md`

---

## 兼容性与风险

- 历史阶段名 `DRAFTING / IMPLEMENT / VERIFY-UNIT` 进入历史术语，不再用于正式章节。
- 可能影响依赖旧阶段名的自动化脚本或外部引用，请同步检查。
- 已通过文档级一致性扫描（旧阶段名、旧门禁版本语义、主链术语漂移）。

---

## 验证清单

- [ ] `project.md` 阶段顺序与命名为新模型
- [ ] workflow 规范/手册/矩阵/配置/schema 已一致
- [ ] 主因果链在白皮书与 workflow 文档一致
- [ ] 术语源与严格模式规则仍生效
- [ ] 关键文档无错误

---

## 审阅建议

1. 先看 `waterfall-migration-mapping.md` 把握旧新映射
2. 再看 `project.md` 验证阶段与分叉规则
3. 最后抽查 `workflow-engine-spec.md`、`workflow-runbook.md`、`phase-io-matrix.md` 的输入输出一致性
