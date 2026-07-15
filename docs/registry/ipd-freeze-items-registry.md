# IPD Through-Pass FREEZE 项目登记表

版本：V1.0
日期：2026-07-10
状态：active
维护者：ChiefTechnologyOfficer（小狄）
来源：W27 through-pass baseline（CPO + CTO 联合审批，2026-07-03）

## 文档定位

本文是 CARRY-005 决策 D2 的交付物，登记 W27 IPD through-pass baseline 中 5 项被标记为 FREEZE 的审批项。
这些项目：语义成立（原则已批准），但实现细节仍依赖 proving-ground 或需后续 sprint 定版，不随 through-pass 进入主流程固化。

## 真源溯源

- CPO 审批稿真源：`TriCompany/docs/workflow/ipd-product-acceptance-contract-cpo-review.md` §12.2
- CTO 审批稿真源：`TriCompany/docs/workflow/ipd-runtime-evidence-contract-cto-review.md` §13.2
- through-pass 执行实例：`TriCompany/docs/workflow/ipd-first-real-approval-backfill-001.md`
- 长期固化总清单：`TriCompany/docs/workflow/ipd-long-term-contract-solidification-list.md`
- 合并目标流程：`TriCompany/docs/workflow/integrated-product-development-flow.md`（主流程 V0.8）

## 汇总

| # | 来源 | 审批项 | Merge Hook | Freeze 原因 | 解冻条件 |
|---|------|--------|------------|-------------|----------|
| F1 | CPO | QA 具体分值阈值 | `CPO-QA-Delivery-Contract` | 各分数维度的具体阈值需后续 sprint 基于真实 case 数据定版 | 积累 ≥3 个真实 QA case 的分值分布后，由 CPO 提案具体阈值 |
| F2 | CPO | 一票否决维度列表 | `CPO-QA-Delivery-Contract` | 哪些维度属于一票否决项需后续 sprint 定版 | 由 CPO 基于产品风险矩阵确定一票否决维度列表并完成审批 |
| F3 | CPO | candidate→final delivery 门槛 | `CPO-QA-Delivery-Contract` | candidate delivery 升级为 final delivery 的门槛条件需后续 sprint 定版 | 在首次真实 final delivery 前，由 CPO 提案门槛条件并完成审批 |
| F4 | CTO | default seed / mnemonic 细节 | `CTO-Signing-Release-Contract` | 当前 seed/mnemonic 为 proving-ground 样例，实现细节不能作为长期 contract 固化 | TriMC 正式上线后，由 CTO 基于正式 runtime 环境重新设计 seed 管理方案 |
| F5 | CTO | local-only deployment strategy 细节 | `CTO-Evidence-Policy-Contract` | 当前 local-only 策略仅证明 proving-ground 可回放，不能直接升级为长期默认部署方案 | TriDeployment 具备多环境部署能力后，由 CTO 提案正式部署策略矩阵 |

## 分项详情

### F1: QA 具体分值阈值

- **来源文件**：`TriCompany/docs/workflow/ipd-product-acceptance-contract-cpo-review.md`
- **来源段落**：§12.2 审批结果表第 8 行
- **Merge Hook**：`CPO-QA-Delivery-Contract`
- **当前状态**：FREEZE
- **Freeze 原因**：QA Scorecard 的 5 个维度（功能完整性、体验质量、技术质量、内容就绪、交付合规）已进入 through-pass，但每个维度的具体数值阈值尚未定版
- **阻塞影响**：不影响 QA 阶段执行和评分，但评分结果是否通过（PASS/FAIL）的判定标准尚不明确
- **解冻条件**：积累 ≥3 个真实 QA case 的分值分布数据后，由 CPO 提案具体阈值方案
- **关联 artifacts**：`ipd_case_engine.py` 中的 `QaScorecard` schema

### F2: 一票否决维度列表

- **来源文件**：`TriCompany/docs/workflow/ipd-product-acceptance-contract-cpo-review.md`
- **来源段落**：§12.2 审批结果表第 9 行
- **Merge Hook**：`CPO-QA-Delivery-Contract`
- **当前状态**：FREEZE
- **Freeze 原因**：各维度之间的权重关系和哪些维度属于一票否决项，需基于产品风险矩阵确定
- **阻塞影响**：不影响评分执行，但一票否决机制（某一维度不达标则整体不过）的触发规则缺失
- **解冻条件**：由 CPO 基于产品风险矩阵确定一票否决维度列表，完成审批后解冻
- **关联 artifacts**：QA Scorecard 维度权重设计

### F3: candidate→final delivery 门槛

- **来源文件**：`TriCompany/docs/workflow/ipd-product-acceptance-contract-cpo-review.md`
- **来源段落**：§12.2 审批结果表第 10 行
- **Merge Hook**：`CPO-QA-Delivery-Contract`
- **当前状态**：FREEZE
- **Freeze 原因**：candidate delivery 满足什么条件才能升格为 final delivery，这一门槛需在首次真实交付前确定
- **阻塞影响**：不影响 candidate delivery 的产生，但 delivery 升格流程无法闭环
- **解冻条件**：在首次真实 final delivery 前，由 CPO 提案门槛条件（含 QA 分值和 Assurance 观察）并完成审批
- **关联 artifacts**：`ipd_case_engine.py` 中的 `release` 对象、`finalIssuerRole` 签核链

### F4: default seed / mnemonic 细节

- **来源文件**：`TriCompany/docs/workflow/ipd-runtime-evidence-contract-cto-review.md`
- **来源段落**：§13.2 审批结果表第 8 行
- **Merge Hook**：`CTO-Signing-Release-Contract`
- **当前状态**：FREEZE
- **Freeze 原因**：当前 proving-ground 的 default seed / mnemonic 是开发测试用样例值。simulated wallet 的签名原则已 APPROVE（through-pass），但具体 seed 生成与管理方案不能在 proving-ground 阶段固化为长期 contract
- **阻塞影响**：不影响 proving-ground 内签核链运作，但不允许将当前 seed 细节写入正式文档或对外暴露
- **解冻条件**：TriMC 正式上线后，基于正式 runtime 环境重新设计 seed 生成、存储与轮换方案
- **关联 artifacts**：`ipd_case_engine.py` 中的 `simulated wallet`、`signatureChain`、`packageHash`

### F5: local-only deployment strategy 细节

- **来源文件**：`TriCompany/docs/workflow/ipd-runtime-evidence-contract-cto-review.md`
- **来源段落**：§13.2 审批结果表第 10 行
- **Merge Hook**：`CTO-Evidence-Policy-Contract`
- **当前状态**：FREEZE
- **Freeze 原因**：当前 local-only 部署策略仅用于证明 proving-ground 环境可回放，不足以作为长期默认部署方案。Deployment 与 Assurance 双阶段分层已 APPROVE（through-pass），但具体部署策略矩阵需在多环境能力就绪后再确定
- **阻塞影响**：不影响 proving-ground 内部署验证，但不允许将 local-only 写入为长期部署策略
- **解冻条件**：TriDeployment 具备多环境部署能力后，由 CTO 提案正式部署策略矩阵（含 local / staging / production 分层方案）
- **关联 artifacts**：`ipd_case_engine.py` 中的 `Deployment` / `Assurance` 阶段 contract、TriDeployment registry

## 与长期固化总清单的关系

`TriCompany/docs/workflow/ipd-long-term-contract-solidification-list.md` 是 IPD contract 的长期固化追踪总清单。
当前 5 项 FREEZE 应回灌到该清单中，作为"待解冻"条目管理。

回灌状态（截至 2026-07-10）：
- F1~F3（CPO FREEZE）：待 CPO 回灌到长期清单 §5/§6
- F4~F5（CTO FREEZE）：待 CTO 回灌到长期清单 §7

## 关联决策

- **CARRY-005 D2**：定位/重建 5 项 FREEZE 的独立文件实体 — 本文件即 D2 交付物
- **CARRY-005 D1**：追认 CARRY-002 的 7/9 口头裁定 — 与本文无关
- **CARRY-005 D3**：基础设施模块先于产品面模块推进 — 与本文无关
- **CARRY-005 D4**：TriModel 多 provider（B 方案：预留架构接口） — 与本文无关

## 变更日志

- 2026-07-10 V1.0：CTO（小狄）完成 D2 定位，从 TriCompany CPO/CTO 审批稿真源提取 5 项 FREEZE，建立独立登记文件
