# Employee Capability Standard Contract

## Document Metadata

- canonicalSource: TriMetaverse/docs/registry/employee-capability-contract.md
- version: 1.0.0
- lastUpdated: 2026-07-12
- owner: CompanyGovernanceRegistry (CAO)
- appliesTo: All TriCompany employees

## Purpose

本文件定义 TriCompany 所有员工的通用能力合约（Employee Capability Contract）。合约独立于宿主特定格式（`.agent.md` 或 `.prompt.md`），在宿主切换时由 contract resolver 解析重建 agent 能力骨架。

## Contract Schema

```yaml
# TriCompany Employee Capability Contract Schema v1.0.0
# 适用于所有 Role Agent 的 source-agent 定义。
# 管理岗（management）覆盖 11 项能力条目；专家岗（specialist）覆盖 9 项。

employee_contract:
  meta:
    employee_id: string          # 员工唯一标识，与 source-agent 文件名一致
    display_name: string         # 工作名称
    role_type: management | specialist
    version: semver

  # === REQUIRED: ALL ROLES ===

  cognition_layers:              # 认知分层约束
    soul: string                 # soul.agent.md 文件路径（相对于 source-agents 目录）
    memory: string               # memory.agent.md 文件路径
    colleagues: string           # colleagues.agent.md 文件路径
    social: string               # social.agent.md 文件路径

  mission:                       # 使命
    - string                     # 可执行、可验证的使命条目（1-4 条）

  core_responsibilities:         # 核心职责
    - string                     # 具体职责（5-8 条），禁止抽象空话

  work_landing_points:           # 当前工作落点
    - path: string               # 文档路径
      description: string

  source_of_truth:               # 真源系统
    order:                       # 真源查询顺序
      - source: string
        path: string
    cross_references:            # 交叉引用
      - when: string             # 触发条件
        consult: string          # 应查询的 registry/文档

  fixed_pre_checks:              # 固定前置核查
    - id: 0                      # item 0: 工作路径核查（强制）
      description: "工作路径核查：接手他人事项前先确认路径在正确模块目录下"
    - id: number
      description: string

  work_takeover_rules:           # 工作接手规则
    path_check: boolean          # 接手前核查路径
    correction_flow: string      # 发现路径污染时的修正流程
    known_sibling_paths:         # 已知同级模块路径
      - string
    version_diff_required: boolean # 接手前人工作需标注版本差

  guardrails:                    # 行为护栏
    - string                     # 禁止退化条款 + 路径核查条款

  default_output_structure:      # 默认输出结构
    sections:
      - name: string
        description: string

  # === OPTIONAL: MANAGEMENT ROLES ===

  decision_trichotomy:           # 决策三分法（管理岗）
    approve:                     # APPROVE 条件
      - string
    freeze:                      # FREEZE 条件
      - string
    escalate:                    # ESCALATE 条件
      - string

  central_closeout_routing:      # 中央收口路由（管理岗）
    owner_of: string             # 收口 owner 职责
    routes:
      - when: string
        to: string
    escalation: string           # 升级链路

  # === OPTIONAL: SPECIALIST ROLES ===

  specialist_sections:           # 专家岗特有节
    - name: string
      description: string
```

## Contract Instance Registry

已有 contract yaml 实例通过 `TriCompany/docs/registry/<AgentID>.contract.yaml` 独立维护。本文件仅定义 schema 和基准约束。

| Agent | Contract File | Role Type | Coverage |
|---|---|---|---|
| CEOChiefOfStaff | `TriCompany/docs/registry/CEOChiefOfStaff.contract.yaml` | management | 11/11 |
| ChiefProductOfficer | `TriCompany/docs/registry/ChiefProductOfficer.contract.yaml` | management | 11/11 |
| ChiefTechnologyOfficer | `TriCompany/docs/registry/ChiefTechnologyOfficer.contract.yaml` | management | 11/11 |
| ChiefAdministrativeOfficer | `TriCompany/docs/registry/ChiefAdministrativeOfficer.contract.yaml` | management | 11/11 |
| ChiefHumanResourcesOfficer | `TriCompany/docs/registry/ChiefHumanResourcesOfficer.contract.yaml` | management | 11/11 |
| ChiefFinancialOfficer | `TriCompany/docs/registry/ChiefFinancialOfficer.contract.yaml` | management | 11/11 |
| ChiefMarketingOfficer | `TriCompany/docs/registry/ChiefMarketingOfficer.contract.yaml` | management | 11/11 |
| ChiefOperatingOfficer | `TriCompany/docs/registry/ChiefOperatingOfficer.contract.yaml` | management | 11/11 |
| RAndDTrainer | `TriCompany/docs/registry/RAndDTrainer.contract.yaml` | specialist | 9/9 |

## Migration Guarantee

- 合约条款独立于宿主运行时格式；切换宿主时，新的 contract resolver 根据 schema 解析重建 agent 指令。
- 路径治理规则（固定前置核查 item 0 + 工作接手规则）通过 `fixed_pre_checks[0]` 和 `work_takeover_rules` clause 固化。
- 四层记忆（cognition_layers）通过 source-agents 五件套携带，不依赖宿主具体记忆实现。

## Sources

- `TriMetaverse/docs/registry/company-governance-state.md`
- `TriCompany/.github/source-agents/ceo-chief-of-staff/` (template)
- `TriCompany/docs/registry/CEOChiefOfStaff.contract.yaml`
