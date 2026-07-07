# IPD 开发文档体系与自动化流程说明

版本：V0.3
日期：2026-07-09
状态：当前 Copilot-host live 阶段基线总结（追平 intake 回退路径、reopen-intake CLI、流程回退图）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/ipd-document-system-overview.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-07-09
- upstreamSources:
  - TriCompany-copilot-host-assets/docs/workflow/integrated-product-development-flow.md（IPD 主流程真源）
  - TriCompany-copilot-host-assets/docs/workflow/ipd-company-baseline-checklist.md（基线分层与回写顺序）
  - TriCompany-copilot-host-assets/runtime/cognition/ipd_case_engine.py（stage contract 与自动化执行真源）
  - TriCompany-copilot-host-assets/runtime/cognition/chief_of_staff_ipd_case.py（CLI 调度入口）
  - TriCompany-copilot-host-assets/docs/training/ipd-usage-guide.md（IPD 使用教程）
  - TriCompany-copilot-host-assets/docs/training/IPD CASE术语.md（case 字段术语）
  - TriCompany-copilot-host-assets/docs/training/ipd-cli-and-code-workflow-beginner-course.md（CLI 小白教程）
  - TriMetaverse/docs/workflow/phase-io-matrix.md（十阶段 IO 矩阵）
  - TriMetaverse/docs/workflow/tricompany-phase-bridge.md（经营-研发桥接）
  - TriMC/src/heartbeat/（TriMC IPD 心跳监控实现）
- supportSyncRule: 任一 upstreamSources 发生稳定语义变更（阶段增删、岗位调整、contract 升级、产物清单变化、case 命名规则变化）后，当前摘要应在同轮或下一轮追平；若上游只是修正错字、补示例或改日期，不强制触发重写，但应检查示例与当前摘要是否仍对齐

当前文件是 TriMetaverse 对 TriCompany IPD 文档体系与自动化流程的中央索引摘要。它汇总了 `TriCompany` 源侧 IPD 主流程、基线清单、runtime engine、培训教程和术语文档的体系关系。它不是 TriCompany 公司级 IPD 书面真源的新增独立文件，冲突时以上游真源为准。

---

## 1. 总体架构：两条线、三层关系

### 1.1 IPD 双线闭环

TriCompany IPD 流程总名为 **"TriCompany IPD 双线闭环"**，包含两条工作线：

| 线 | 主责 | 作用 | caseCategory | referenceTheme |
|---|------|------|-------------|----------------|
| **市场雷达线** | CMO | 持续发现需求、市场信号、竞品变化、用户痛点；只形成机会候选，不直接启动开发 | —（非 case 形态） | — |
| **主动交付线** | CEO/总助 | 正式下发需求后，按十阶段推进到产品交付、运营和财务收口 | `project-delivery` | `PLATFORM` 等 |

两条线衔接：`市场雷达线 → CEO/总助决策 → 正式需求/任务 → 主动交付线`

### 1.2 主动交付线内部再分两条执行线

| 执行线 | caseCategory | 阶段链 | 目的 |
|--------|-------------|--------|------|
| **流程优化线** | `process-improvement` | `BACKLOG → SPRINT-PLANNING → SPRINT-EXECUTION → SPRINT-REVIEW → RETROSPECTIVE → VALIDATION-HANDOFF` | 完善 IPD 流程自身（intake、dispatch、签核、rollback、自动化等） |
| **项目交付线** | `project-delivery` | `DISCOVERY → INTELLIGENCE → DESIGNING → CODING → VERIFY-INTEGRATION → REDTEAM → QA → DEPLOYMENT → ASSURANCE → DELIVERY` | 使用已固化的 IPD 流程开发具体产品 |

### 1.3 三层职责分工

| 层 | 负责方 | 职责 |
|----|--------|------|
| **公司协同层** | TriCompany | 员工参与、资料组织、门禁完善、书面核签、跨岗位协同 |
| **流程执行层** | TriDev | 十阶段 phase engine、gate、evidence、版本包签发 |
| **本地编码层** | Tride | 本地编码智能体底座、CLI runtime、agentic orchestration（当 Tride 可用时接入；当前待初始化） |

**IPD 是同时包含公司协同层（TriCompany）、流程执行层（TriDev）与本地编码层（Tride）的统一交付体系**。`process-improvement`（IPD 自身流程优化线）可能针对这三层中任一位置进行优化；`project-delivery`（项目交付线）由三层共同协作完成交付。

---

## 2. 文档四层体系（A/B/C/D）

见 `TriCompany/docs/workflow/ipd-company-baseline-checklist.md`：

```
A 层：书面主真源 ──── 定义流程规则、阶段 contract、merge 语义
B 层：公司执行真源 ── runtime contract、validator、自动推进、签核语义
C 层：联审输入面 ─── 把 proving-ground 已验证能力整理为可审批对象
D 层：操作与实例面 ── 真实回填、through-pass 执行、批次记录
```

### 2.1 A 层：书面主真源

| 文件 | 角色 |
|------|------|
| `TriCompany-copilot-host-assets/docs/workflow/integrated-product-development-flow.md` | 公司级 IPD 主流程真源：阶段定义、岗位参与、gate、merge hook、回写原则 |
| `TriCompany-copilot-host-assets/docs/workflow/ipd-long-term-contract-solidification-list.md` | 长期 contract 联审收口清单：承接验证通过的能力，等待 CPO/CTO 审批升级 |

### 2.2 B 层：公司执行真源

| 文件 | 角色 |
|------|------|
| `TriCompany-copilot-host-assets/runtime/cognition/ipd_case_engine.py` | IPD stage contract 与 automation contract 的执行真源：阶段模板、标准动作、签核对象、evidence policy、自动推进语义 |
| `TriCompany-copilot-host-assets/runtime/cognition/chief_of_staff_ipd_case.py` | CLI 调度入口：task-intake、init、submit、signoff、status、step、rollback 等命令 |
| `TriCompany-copilot-host-assets/runtime/cognition/chief_of_staff_ipd_case_validation.py` | IPD 基线验证真源：回归、案例初始化、阶段自动化、主线验证 contract |

### 2.3 C 层：联审输入面

| 文件 | 角色 |
|------|------|
| `TriCompany-copilot-host-assets/docs/workflow/ipd-product-acceptance-contract-cpo-review.md` | CPO 产品验收 contract 审批稿 |
| `TriCompany-copilot-host-assets/docs/workflow/ipd-runtime-evidence-contract-cto-review.md` | CTO runtime/evidence contract 审批稿 |

### 2.4 D 层：操作与实例面

| 文件 | 角色 |
|------|------|
| `TriCompany-copilot-host-assets/docs/workflow/ipd-first-real-approval-backfill-runbook.md` | 真实审批回填操作手册 |
| `TriCompany-copilot-host-assets/docs/workflow/ipd-first-real-approval-through-pass-checklist.md` | through-pass 执行清单 |
| `TriCompany-copilot-host-assets/docs/workflow/ipd-first-real-approval-merge-candidate-matrix.md` | merge candidate 映射矩阵 |
| `TriCompany-copilot-host-assets/docs/workflow/ipd-first-real-approval-backfill-record-template.md` | 回填记录模板 |
| `TriCompany-copilot-host-assets/docs/workflow/ipd-first-real-approval-backfill-001.md` | 首轮回填实例 |
| `TriCompany-copilot-host-assets/docs/workflow/ipd-company-baseline-checklist.md` | 基线治理清单（本身是 D 层，但定义 A/B/C/D 分层规则） |

### 2.5 培训层补充

| 文件（源侧） | 文件（发布侧） | 角色 |
|------|------|------|
| `TriCompany/docs/training/ipd-usage-guide.md` | `TriCompany-copilot-host-assets/docs/training/ipd-usage-guide.md` | IPD 使用教程（面向 RAndDTrainer 与新人） |
| `TriCompany/docs/training/IPD CASE术语.md` | `TriCompany-copilot-host-assets/docs/training/IPD CASE术语.md` | IPD Case 字段详解（case 结构、七槽位、Web3 签名、心跳卡点） |
| `TriCompany/docs/training/ipd-cli-and-code-workflow-beginner-course.md` | `TriCompany-copilot-host-assets/docs/training/ipd-cli-and-code-workflow-beginner-course.md` | CLI 与代码工作流程小白教程（含心跳 CLI 命令） |

---

## 3. 自动化流程全景：节点、输入输出、谁在处理

### 3.1 总流程概览

```
CEO freeform 需求
       │
       ▼
┌──────────────┐   总助 CLI: task-intake
│  task-intake │   生成 case.json + intake-brief.json + clarificationSheet
└──────┬───────┘   处理方: CEOChiefOfStaff（补槽位）
       │               ┊
       ▼               ┊  ◀── reopen-intake / rollback --stage-key intake
┌──────────────┐   总助 CLI: init          ┊   （签核后想修改七槽位→回这里）
│     init     │   把 intake briefing 精调成可签版，补齐 7 个槽位
└──────┬───────┘   处理方: CEOChiefOfStaff
       │               ┊
       ▼               ┊  ◀── reopen-intake / rollback --stage-key intake
┌──────────────────┐   CLI: intake-approve     ┊
│  intake-approve  │   顺序: CEO 先签 → CEOChiefOfStaff 验证并签发
└──────┬───────────┘   处理方: CEO + CEOChiefOfStaff（web3 签名）
       │               未通过 → paused-intake-clarification
       │               ▲
       │               └── 已通过但七槽位不行 → reopen-intake（无 completed 护栏）
       │                   已有 completed stage → rollback --stage-key intake
       ▼
┌──────────────────┐
│  caseCategory 分支 │
└──────┬───────────┘
       │
  ┌────┴────┐              ┊
  │         │              ┊  TriMC heartbeat 扫描:
  ▼         ▼              ┊  · stage 审批待签 > 48h → ALERT
process-   project-        ┊  · stage 无产出 > 72h → ALERT
improve-   delivery        ┊  · stage 被 reject → ERROR
ment       (十阶段)         ┊
(敏捷六段)                  ┊
   │         │             ┊
   │    reject→resubmit    ┊  ◀── stage 驳回后 owner 重新 submit
   │         │             ┊
   │    rollback→          ┊  ◀── rollback --stage-key <任意阶段>
   │    任意前置阶段        ┊      回到 ceo-demand/intake/discovery/...
   │         │             ┊
   ▼         ▼             ┊
 交付      交付
```

**回退路径总结：**

| 场景 | CLI 命令 | 条件 |
|------|---------|------|
| 七槽位填错了，想回 intake 重填 | `reopen-intake --case-id <id> --note "原因"` | 无 completed stage |
| 同上，但已有 completed stage | `rollback --case-id <id> --stage-key intake --reason "原因"` | 无限制 |
| stage 被驳回，owner 重新提交 | `submit --case-id <id> --stage-key <key> ...` | stage 处于 rejected |
| 回退到任意前置阶段 | `rollback --case-id <id> --stage-key <key> --reason "原因"` | 无限制 |
| 回到 CEO demand 原点 | `rollback --case-id <id> --stage-key ceo-demand --reason "原因"` | 无限制 |

`reopen-intake` 是 `rollback --stage-key intake` 的安全封装：多了"无 completed stage"护栏，防止误删已完成工作。

### 3.2 流程优化线（process-improvement）六阶段

当前运行 case: `IPD-20260612-WORKFLOW-002`

| 阶段 | 输入 | 处理方 | 处理过程与深度 | 输出 | 签核 |
|------|------|--------|---------------|------|------|
| **BACKLOG** | intake briefing、优化需求 | CTO（当前默认） | 把 IPD 流程优化点拆成 backlog item；明确优先级、依赖和验收条件 | backlog items、优先级排序 | CEO → CEOChiefOfStaff |
| **SPRINT-PLANNING** | backlog、资源约束 | CTO | 选定本轮 sprint 要做的优化项；拆 task、估工期、定完成定义 | sprint plan、task breakdown | CEO → CEOChiefOfStaff |
| **SPRINT-EXECUTION** | sprint plan、源码 | CTO | 修改 runtime engine、CLI、validator 等 B 层执行真源；做 source-side 自测 | 代码改动、自测结果 | CEO → CEOChiefOfStaff |
| **SPRINT-REVIEW** | sprint execution 产物 | CTO + CPO | 审查本轮改动是否满足 backlog 验收条件；确认回写目标（A/B/C/D 层） | review 结论、回写计划 | CEO → CEOChiefOfStaff |
| **RETROSPECTIVE** | sprint 全流程记录 | CTO | 总结本轮做得好的、需改进的、遗留问题；形成下轮 backlog 输入 | retro 纪要、改进项 | CEO → CEOChiefOfStaff |
| **VALIDATION-HANDOFF** | 本轮全部产物 | CTO → 总助 | 确认流程优化已固化；输出到 project-delivery case 做实例验证的 handoff | handoff package | CEO → CEOChiefOfStaff |

**统一提交/签核模式**（每个阶段一致）：
1. owner 接到 work item → 2. owner `submit` 提交阶段产物（自动签 package hash）→ 3. CEO `signoff` → 4. CEOChiefOfStaff `signoff`（验证前序签名并签发版本号）→ 5. 系统自动进入下一阶段

### 3.3 项目交付线（project-delivery）十阶段

当前产品主线 case: `IPD-20260610-PLATFORM-001`（full-scope）
已验证基线 case: `IPD-20260611-PLATFORM-001`（全链路 proving-ground replay 已完成）

#### Gate A：需求到设计前（ceo-demand → task-dispatch → discovery → intelligence）

| 阶段 | phaseKey | 输入 | 处理方 | 处理过程与深度 | 关键产物 |
|------|----------|------|--------|---------------|----------|
| **Discovery** | DISCOVERY | 总助拆解的研发任务、intake briefing、上游业务背景 | **businessOwner**: CPO<br>**moduleExecutor**: TriDev<br>**参与**: CMO、CTO、CEO | CPO 全网搜索竞品与官方手册，下载到 `TriMetaverse/reference/discovery/<case-id>/`；自动生成五件套 markdown package；CMO 验证是否为市场真实需求（可冻结）；判断模块命中（既有/新模块） | `reference-source-catalog.json`、`DiscoveryReferenceFunctionalBrief`、`DiscoveryCompetitorLandscape`、`DiscoveryCommonCapabilityMatrix`、`DiscoveryHighlightOpportunityMemo`、`ModuleTargetingReport`、`NewModuleBaselineRelease`（如涉及） |
| **Intelligence** | INTELLIGENCE | DiscoveryReferenceFunctionalBrief（必须）、市场证据、运营约束、预算护栏 | **businessOwner**: CPO<br>**moduleExecutor**: TriDev<br>**参与**: CTO、CMO、COO、CFO | CTO 搜索开源代码落到 `TriMetaverse/reference/intelligence/<case-id>/`；建本地 CodeGraph；做 capability extraction；自动生成四件套 markdown package；CPO 收口正式 PRD；COO/CFO 补充运营与预算约束 | `reference-source-catalog.json`、`IntelligenceCapabilityExtractionMatrix`、`IntelligenceOpenSourceLandscape`、`IntelligenceCodegraphAnalysis`、`IntelligenceArchitectureOptionMemo`、正式 PRD、项目计划、验收标准 |

**Discovery → Intelligence 关键门禁**：没有 `DiscoveryReferenceFunctionalBrief` 不得进入 Intelligence；正式 PRD 只能基于 `IntelligenceCapabilityExtractionMatrix` 形成，不得直接照搬上游代码结构。

#### Gate B：设计到测试前（designing → coding → verify-integration）

| 阶段 | phaseKey | 输入 | 处理方 | 处理过程与深度 | 关键产物 |
|------|----------|------|--------|---------------|----------|
| **Designing** | DESIGNING | PRD、项目计划、验收标准 | **businessOwner**: CTO<br>**moduleExecutor**: TriDev<br>**参与**: CPO | 产出技术选型、系统架构、工程门禁、任务拆解、phase handoff、MVP 与 full-PRD phased plan；同时形成测试策略/测试用例基线、回归范围、安全与 redteam 前置设计 | `DesignArchitectureDecisionRecord`、`DesignTechStackSpec`、`DesignMVPPhasedPlan`、测试设计基线、安全设计说明 |
| **Coding** | CODING | Designing 架构、计划、测试基线 | **businessOwner**: CTO<br>**moduleExecutor**: TriDev<br>**参与**: CPO | 基于 Designing 执行开发实现；沉淀代码、测试资产、配置/迁移改动、失败/回滚记录 | 源码改动、测试资产、配置/迁移改动、产品实施总结 |
| **Verify-Integration** | VERIFY-INTEGRATION | Coding 产物 + Designing 测试基线 | **businessOwner**: CTO<br>**moduleExecutor**: TriDev<br>**参与**: CPO | 按 Designing 定义的测试基线执行系统级验证、集成测试、回归测试和缺陷收口 | 集成测试报告、缺陷清单、自动化测试脚本、质量评估报告 |

**Designing → Verify-Integration 关键门禁**：Designing 不只产出技术路线，还要同步产出测试基线和 security-by-design 输入；Verify-Integration 不临时想测什么测什么，而是按 Designing 阶段已定义的测试基线执行。

#### Gate C：安全到交付（redteam → qa → deployment → assurance → delivery）

| 阶段 | phaseKey | 输入 | 处理方 | 关键产物 |
|------|----------|------|--------|----------|
| **Redteam** | REDTEAM | Verify-Integration 通过产物 | **businessOwner**: CTO<br>**moduleExecutor**: TriDev | 红队扫描报告、风险分级清单（no critical 才通过） |
| **QA** | QA | Redteam 修复后产物 | **businessOwner**: CTO<br>**moduleExecutor**: TriDev<br>**参与**: CPO | QA 报告、QA scorecard、candidate delivery manifest/report（默认阈值 80 分） |
| **Deployment** | DEPLOYMENT | QA 通过产物 + 部署清单 | **businessOwner**: CTO<br>**moduleExecutor**: TriDev<br>**参与**: COO、CFO | 部署证据、发布说明、rollout plan、CI/CD/Docker/K8s 资产 |
| **Assurance** | ASSURANCE | Deployment 产物与环境 | **businessOwner**: CTO<br>**moduleExecutor**: TriDev<br>**参与**: COO、CFO | Assurance 报告、runtime observation、recovery validation、残余风险追踪 |
| **Delivery** | DELIVERY | 所有 Assurance 通过产物 | **businessOwner**: CPO<br>**moduleExecutor**: TriDev<br>**参与**: CEO、COO、CFO、CTO | final delivery manifest、final delivery report、版本化 gate package |

---

### 3.4 TriMC 心跳监控（Heartbeat）

TriMC 的心跳扫描器对所有 IPD case 做定期卡点检测，发现卡点后推送总助会话待办。当前阶段由总助手动触发编排，尚未接入 daemon 自动定时。

心跳覆盖四种卡点：Intake 待审批超时、Stage 审批待签超时、Stage 无产出超时、Stage 被驳回。详细阈值、CLI 用法与数据模型见源侧 `TriMC/src/heartbeat/` 及培训教程 `TriCompany/docs/training/IPD CASE术语.md`。

---

## 4. 双线配合闭环（核心运转机制）

```
┌─────────────────────────────────────────────────────────────┐
│                  IPD 自身优化与验证闭环                        │
│                                                             │
│  process-improvement case            project-delivery case  │
│  (IPD-20260612-WORKFLOW-002)    ←→   (IPD-20260610-PLATFORM)│
│         │                                    │               │
│         │  1. 修改 B 层执行真源               │               │
│         │  2. source-side 自测               │               │
│         │  3. 切片验证                       │               │
│         │                                    │               │
│         │ ──── 能力输出 ────→                │               │
│         │                    4. live replay / 产品主线消费   │
│         │                    5. Gate A / B / C 分段验证      │
│         │ ←── 缺陷回灌 ──────                │               │
│         │  6. 失败回退到对应阶段              │               │
│         │  7. 问题进入下轮 workflow sprint    │               │
│                                                             │
│  Agile 六段                        Ten-phase 十段            │
└─────────────────────────────────────────────────────────────┘
```

固定规则：
1. 先在独立 `process-improvement + WORKFLOW` case 里修流程
2. 做 source-side 自测与切片验证
3. 回到固定 `project-delivery` case（当前 `IPD-20260610-PLATFORM-001`）做 live replay
4. 合格 → 继续向后放行
5. 不合格 → 按缺陷来源回退到 `ceo-demand`、`task-dispatch`、`discovery` 或后续阶段
6. 失败点重新回灌到 workflow sprint case

---

## 5. 流程优化后的固定回写顺序

每次流程优化验证通过后，按以下顺序回写：

| 步骤 | 目标层 | 动作 |
|------|--------|------|
| 1 | B 层 | 先更新 `ipd_case_engine.py` + `chief_of_staff_ipd_case_validation.py`，确认 runtime contract 与 validation contract 成立 |
| 2 | A 层 | 更新 `integrated-product-development-flow.md`，把已批准的稳定语义写入长期流程 |
| 3 | C 层 | 若需要岗位联审，先形成审批输入，再决定哪些项能升级进 A/B 层 |
| 4 | D 层 | 更新操作文档、主链切换说明、training 教程、operating record |

**新实例默认继承规则**：新创建的 IPD 实例自动继承 A 层 + B 层的最新基线，不需要重复手工合入。

---

## 6. 入口节点与流转控制

### 6.1 三类入口（由 `_entry_checkpoint_for_case` 动态决定）

| 入口 | 标识 | 触发条件 | 驱动方 |
|------|------|----------|--------|
| **审批入口** | `ceo-demand` | intake 未批准 / 需要澄清 | CEO / 人工 |
| **自动化入口** | `task-dispatch` | 第一个 stage 刚激活、尚未提交产出 | AI / 系统自动 |
| **Handoff 入口** | stageKey（如 `discovery`） | 当前有正在执行的 stage | Stage 间自动流转 |

### 6.2 Case 状态推导

Case 级别状态由 Stage 级别状态自动推导（核心：`_recalculate_status`）：

```
intake 未批准 → awaiting-intake-approvals / paused-intake-clarification
intake 已批准 → stage=submitted → awaiting-stage-approvals
              → stage=in-progress → waiting-stage-output
              → stage=rejected → blocked
              → stage=frozen → paused-frozen
              → stage=completed + 无后续 → completed
              → stage=completed + 有后续 → 激活下一 stage
```

### 6.3 专业冻结权限

| 岗位 | 冻结窗口 | 条件 |
|------|----------|------|
| CEOChiefOfStaff | intake clarification sheet = ready-for-dispatch 后 | 项目可行性判断不通过 |
| CMO | Discovery 期间 | 调研后确认非市场真实需求 |
| CPO / CTO / COO / CFO | 各自负责阶段窗口内 | 产品/技术/运营/财务专业判断 |

`freeze`（paused-frozen）= 条件性暂停，可 unfreeze；`reject`（blocked）= 内容不被接受，需重提重签。

---

## 7. 运行态对象落点

所有运行态对象写入总助 workbench（不是中央真源文档）：

```
knowledge/employees/ceo-chief-of-staff/workbench/ipd/cases/<case-id>/
├── case.json              # case 主状态
├── intake-brief.json      # 入口 briefing
├── events.jsonl           # 事件流水
├── work-items/*.json      # 当前节点工作单
└── outputs/*.json         # owner 提交的节点产物
```

---

## 8. 桥接：经营对象 ↔ 研发流程

`docs/workflow/tricompany-phase-bridge.md` 定义了经营对象如何通过 `workflowRefs` 字段引用研发主流程的 `PhaseResult`、`runId`、`branchId`、`prdId`，支持六种关系枚举：`context-from`、`input-to`、`output-of`、`summarizes`、`blocks`、`depends-on`。

---

## 9. 当前阶段边界（重要约束）

- 当前 IPD 流程是 docs-first 的公司级流程设计，服务当前 Copilot-host live 阶段。
- CMO/CPO/COO/CFO/CTO 已上岗，但不代表完整授权矩阵、自动数据管道或自动财务系统已完成。
- TriDev 已具备 Copilot-host 本地开发执行可靠性切片，但不代表 ten-stage phase engine 在 source-side 全量拆开。
- autopilot 可自动执行十阶段链路并对接 TriDev 产物，但 PRD 分叉并行、多分支 delivery 聚合、完整岗位 adapter 仍未完成。
- **TriMC heartbeat 已接入**：心跳扫描器可手动/会话触发检测所有 IPD case 的卡点；编排和通知层由总助（小贾）手动协调，尚未接入 daemon 自动定时触发。
- 涉及正式宿主边界、长期模块边界或商业模式裁决时，应升级 `BusinessStrategy`。

---

## 10. 相关文档索引

| 文档 | 路径 |
|------|------|
| IPD 主流程真源 | `TriCompany-copilot-host-assets/docs/workflow/integrated-product-development-flow.md` |
| IPD 基线清单 | `TriCompany-copilot-host-assets/docs/workflow/ipd-company-baseline-checklist.md` |
| IPD 使用教程 | `TriCompany-copilot-host-assets/docs/training/ipd-usage-guide.md` |
| IPD Case 字段术语 | `TriCompany-copilot-host-assets/docs/training/IPD CASE术语.md` |
| CLI 小白教程 | `TriCompany-copilot-host-assets/docs/training/ipd-cli-and-code-workflow-beginner-course.md` |
| TriMC 心跳监控 | `TriMC/src/heartbeat/`（`models.py`、`checker.py`、`cli.py`） |
| Phase IO 矩阵 | `TriMetaverse/docs/workflow/phase-io-matrix.md` |
| 经营-研发桥接 | `TriMetaverse/docs/workflow/tricompany-phase-bridge.md` |
| 项目十阶段流程 | `TriMetaverse/project.md` |
| 赛博公司设计 | `TriMetaverse/tricompany.md` |
| 模块架构说明 | `TriMetaverse/docs/三元宇宙架构与模块说明.md` |
| 文档治理总览 | `TriMetaverse/docs/文档治理与真源文件系统.md` |
