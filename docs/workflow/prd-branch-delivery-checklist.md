# PRD 分叉执行落地清单（INTELLIGENCE 后）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/prd-branch-delivery-checklist.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-06

目标：从 PRD 产出后，将每个 PRD 独立分叉执行为一条可交付流水线，实现并行推进与分布式交付。

---

## 1. 执行模型（固定）

每个 PRD 分支统一执行：

`DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE`

规则：

- 分支间并行。
- 分支内串行。
- 只回流失败分支。
- 全部分支通过 ASSURANCE 后，统一进入 DELIVERY。

---

## 2. 运行前清单（研发工作流）

- [ ] `tmv-whitepaper.md` 已定版或有可追溯变更记录。
- [ ] `docs/prd/README.md` 已列出本轮 PRD 范围。
- [ ] `workflow-engine-config.yaml` 已设置 `prdBranchPipeline.enable=true`。
- [ ] 已定义 run-id：`docs/runs/<run-id>/`。
- [ ] 已定义分支并行上限（`branchParallelism`）。
- [ ] 已启用渐进式增量：`allowProgressivePrd=true`。
- [ ] 已配置触发源：`DISCOVERY / INTELLIGENCE`。

## 2.1 渐进式触发清单（主线）

- [ ] DISCOVERY 阶段产物已人工审核通过并签发 `WP-v*`（首次需有版本号，非首次需版本变更）。
- [ ] DISCOVERY 更新白皮书后，已触发 INTELLIGENCE 内容增量刷新（不在本阶段产出 PRD）。
- [ ] INTELLIGENCE 阶段产物（PRD/原型/用户故事）已人工审核通过，并签发 PRD 版本号（如 `PRD001-v1.0.0`，首次需有版本号，非首次需版本变更）。
- [ ] INTELLIGENCE 手工新增 PRD 后，已写入 PRD 注册表并创建分支。
- [ ] 新分支创建前，已拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论，并已确认目标落位仓与目标 `docs/` 根。
- [ ] 新分支创建时，已在解析出的目标落位点建立 `模块六层文档协同系统` 最小入口：`docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/`。
- [ ] 已参考 `prd-branch-minimal-directory-template.md` 建立最小目录或确认现有目录已等价覆盖。
- [ ] 本轮新增或改写的正式文档已区分：`文档同步元信息` 用于真源 / 发布层级字段，`文档头信息` 用于 `版本 / 日期 / 状态 / 负责人` 等普通顶部说明。
- [ ] 每次触发均在对应 `phase-result` 写入 `prdDelta`。

---

## 3. PRD 分支任务清单（逐个 PRD）

对当前激活 PRD 逐项勾选（实验阶段默认仅 `PRD001基础平台`）：

### 3.1 DESIGNING

- [ ] 对应 PRD 已人工审核通过并具备 PRD 版本号（非首次需版本已变更）。
- [ ] 当前执行目录与 `ChiefProductOfficer` 当前阶段模块设计 / 归属结论一致。
- [ ] `模块六层文档协同系统` 的最小入口已完成，分支初始化不再处于 `待补齐`。
- [ ] 本阶段评审若提出“补文档元信息”，已按 `文档同步元信息` 处理，而不是只补 `状态 / 负责人 / 更新时间` 等头部说明。
- [ ] `docs/product/REQUIREMENTS.md` / `STATE.md` 已能回连当前 PRD 范围与验收口径。
- [ ] `docs/engineering/DESIGN.md` 已建立当前分支的 Spec 入口。
- [ ] `docs/execution/<branch-id>/designing/PLAN.md` 已创建。
- [ ] 设计文档（架构/模块/Spec/API）完成且与 PRD 一致。
- [ ] 产物落盘：`docs/runs/<run-id>/<branch-id>/DESIGNING.phase-result.json`。

### 3.2 CODING

- [ ] 功能代码完成并可运行。
- [ ] 单元测试执行完成且阻断级失败为 0。
- [ ] `docs/execution/<branch-id>/coding/` 已补齐当前阶段 `PLAN.md` / `SUMMARY.md` / `VERIFICATION.md`。
- [ ] `docs/engineering/STATE.md` 已同步当前实现状态、主要风险或阻塞。
- [ ] 产物落盘：`docs/runs/<run-id>/<branch-id>/CODING.phase-result.json`。

### 3.3 VERIFY-INTEGRATION

- [ ] 集成测试执行完成。
- [ ] 核心链路通过。
- [ ] 接口兼容性通过。
- [ ] `docs/execution/<branch-id>/verify-integration/` 已补齐当前阶段 `PLAN.md` / `SUMMARY.md` / `VERIFICATION.md`。
- [ ] 产物落盘：`docs/runs/<run-id>/<branch-id>/VERIFY-INTEGRATION.phase-result.json`。

### 3.4 REDTEAM

- [ ] 对抗审查执行完成。
- [ ] `critical` 风险为 0。
- [ ] 风险清单与修复证据齐全。
- [ ] `docs/execution/<branch-id>/redteam/` 已补齐当前阶段 `PLAN.md` / `SUMMARY.md` / `VERIFICATION.md`。
- [ ] 产物落盘：`docs/runs/<run-id>/<branch-id>/REDTEAM.phase-result.json`。

### 3.5 QA

- [ ] 质量评分完成。
- [ ] `score >= threshold`（默认 80）或有明确豁免记录。
- [ ] `docs/execution/<branch-id>/qa/` 已补齐当前阶段 `PLAN.md` / `SUMMARY.md` / `VERIFICATION.md`。
- [ ] 产物落盘：`docs/runs/<run-id>/<branch-id>/QA.phase-result.json`。

### 3.6 DEPLOYMENT

- [ ] 分支部署资产生成并基础校验通过。
- [ ] CI/CD、Docker、K8s 资产可追溯。
- [ ] `docs/execution/<branch-id>/deployment/` 已补齐当前阶段 `PLAN.md` / `SUMMARY.md` / `VERIFICATION.md`。
- [ ] `docs/workflow/README.md` 或对应流程文档已补入该分支使用的发布 / handoff / 回滚机制入口。
- [ ] 产物落盘：`docs/runs/<run-id>/<branch-id>/DEPLOYMENT.phase-result.json`。

### 3.7 ASSURANCE

- [ ] 漏洞测试通过。
- [ ] 压力测试通过。
- [ ] 安全测试通过。
- [ ] 回归测试通过。
- [ ] `docs/execution/<branch-id>/assurance/` 已补齐当前阶段 `PLAN.md` / `SUMMARY.md` / `VERIFICATION.md`。
- [ ] `docs/registry/product-state.md` 与 `docs/registry/code-state.md` 已同步稳定结论或显式标记待确认。
- [ ] 产物落盘：`docs/runs/<run-id>/<branch-id>/ASSURANCE.phase-result.json`。

---

## 4. 聚合交付清单（主线 DELIVERY）

- [ ] 全部 PRD 分支 `ASSURANCE=passed`。
- [ ] 生成 `delivery-manifest.json`（包含所有 PRD 分支产物索引）。
- [ ] 生成 `delivery-report.md`（汇总每个 PRD 分支结论）。
- [ ] 生成 `artifacts/release.zip`。
- [ ] 输出 `docs/runs/<run-id>/workflow-summary.md`。
- [ ] 若进入仓库发布候选或紧急修复，分支切换与回灌已对齐 `docs/branching-release-policy.md`（`release/*` / `hotfix/*` / `main` / `dev` 闭环）。

---

## 5. 回流策略（分支级）

- CODING 失败：回流该 PRD 的 DESIGNING。
- VERIFY-INTEGRATION 失败：回流该 PRD 的 CODING。
- REDTEAM 失败：回流该 PRD 的 CODING 或 VERIFY-INTEGRATION。
- QA 失败：回流该 PRD 的 CODING / VERIFY-INTEGRATION / REDTEAM。
- DEPLOYMENT 失败：回流该 PRD 的 CODING 或 QA。
- ASSURANCE 失败：回流该 PRD 的 QA 或 DEPLOYMENT。

---

## 6. 本轮 PRD 分支看板（模板）

| PRD | DESIGNING | CODING | VERIFY-INTEGRATION | REDTEAM | QA | DEPLOYMENT | ASSURANCE | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PRD001基础平台 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | 首分支 |

---

## 7. PRD 增量登记（模板）

| 时间 | 来源阶段 | 变化类型 | PRD ID | 下游触发 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 2026-03-04 00:00 | DISCOVERY | updated-content | - | INTELLIGENCE | 不直接新增PRD |
| 2026-03-04 00:00 | INTELLIGENCE | added | PRD001基础平台 | NEW_BRANCH | 首分支 |
