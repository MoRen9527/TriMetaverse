# TriCompany 可插拔模块产品决策

版本：V0.1
日期：2026-08-01
状态：CPO APPROVE（待 CEOChiefOfStaff 收口）
决策节点：tricade-3
作者：ChiefProductOfficer（小乔）

## 产品判断

TriCade 1.0 启动向导 Step 4"是否启用赛博公司模式？"已由 FullStack 实现（tricade-2），CTO 正在落地 contract-resolver + agents 端点 + CI/CD（tricade-1）。当前 TriCompany 源侧 13 员工的五件套和 contract YAML 链已完备，双侧实现基础成立。

本决策定义 TriCompany 作为可插拔模块的完整产品形态，覆盖加载形式、启用后 UX、启用/禁用语义、以及与其他 TriCade 功能的集成策略。

**整体判断：APPROVE 双层组合架构，Phase 1 走二进制启用/禁用，部分启用和高级集成延迟到 Phase 2。** 所有决策均不超出当前商业实验边界（TriCade 本地桌面端 + TriLC 独立运行），不触碰 TriMC 正式宿主切换。

---

## 决策 1：加载形式

### 结论：APPROVE 方案 C — 双层组合

TriCompany 以**双层组合**形式作为 TriCade 内置可插拔模块，两层协同但不独立分拆为单独安装包：

**UI 层（TriPilot / VSCodium 扩展）**
- 首次启动向导 Step 4（已实现：`welcome-setup.ts`）
- 后续 Phase 2 扩展：员工侧边栏、设置面板、`/agents` 展示
- 写入 `tripilot.tricompany.enabled` → `trilc-config.json`

**能力层（TriLC Daemon）**
- contract-resolver 从 `TriCompany/source-agents/` 加载 13 员工（已实现：`contract-resolver.ts`）
- system prompt 拼装（已实现：soul + agent_body → systemPrompt）
- AgentTool 路由到 TriCompany 员工（已实现：daemon `/internal/v1/agents` 查询 fallback）
- `/agents?scope=company|builtin|all` 端点（CTO tricade-1 正在落地）

### 否决的方案

| 方案 | 否决原因 |
|------|----------|
| **A: 纯 .vsix** | TriLC CLI 独立运行场景（不启动 VSCodium）无法使用 TriCompany 员工；纯扩展无法提供 agent 能力层 |
| **B: 纯 TriLC Skill** | CLI 用户体验差——没有可视化员工列表、设置面板、向导入口；TriCade 以 VSCodium 为主要用户入口，不应放弃 UI 层 |

### 关键设计原则

1. **TriCade 合包，不外拆**：两层随 TriCade 安装器一起交付，不提供单独的 TriCompany .vsix 或单独的 TriCompany skill 下载
2. **一个开关控制两层**：`tricompanyEnabled` 同时控制 TriPilot UI（侧边栏/员工展示）和 TriLC daemon（contract 加载）
3. **CLI 也可用**：纯 CLI 用户通过 `trilc-config.json` 手动设置 `tricompanyEnabled: true` 后，daemon 自动加载 contract agents，AgentTool 可路由，`/agents` 命令可用

---

## 决策 2：启用后的用户体验

### 结论：APPROVE Phase 1 最小 UX，Phase 2 扩展

#### Phase 1（当前）

**2.1 感知 13 员工的存在**

用户在 TriPilot 聊天中通过 `/agents` 斜杠命令感知员工列表。输出格式：

```
Available Agents:

── Built-in ──
  • code_explorer — 代码探索和分析
  • ... (共 4 个)

── TriCompany ──
  • ceo-chief-of-staff (小贾) — CEO 总助 / 会议收口 / 经营记录
  • chief-technology-officer (小狄) — 技术总裁 / 工程实现 owner
  • chief-product-officer (小乔) — 产品总裁 / 产品范围 owner
  • chief-human-resources-officer — 首席人力官
  • chief-administrative-officer — 首席审计官
  • chief-marketing-officer — 首席市场官
  • chief-operating-officer — 首席运营官
  • chief-financial-officer — 首席财务官
  • test-engineer (小柯) — 测试工程师 / 质量门禁
  • full-stack-developer (小全) — 全栈开发
  • rd-trainer (小吴) — 研发培训师
```

禁用 TriCompany 时，只显示 Built-in 4 个 agent。

**2.2 `/agents` 命令的 scope 筛选**

CTO 已在 tricade-1 规划 `/internal/v1/agents?scope=company|builtin|all`（待落地）。产品侧确认语义：

| scope | 行为（TriCompany 启用） | 行为（TriCompany 禁用） |
|-------|------------------------|------------------------|
| `all` (默认) | built-in 4 + company 13 = 17 个 | built-in 4 个 |
| `builtin` | built-in 4 个 | built-in 4 个 |
| `company` | company 13 个 | 空列表 + hint "TriCompany mode is disabled" |

**2.3 员工侧边栏**

Phase 1：**不做**。`/agents` 命令和 AgentTool 自动路由已满足 MVP 需求。

Phase 2 规划：VSCodium 侧边栏新增"TriCompany"视图，展示员工树：
```
TriCompany
├── 磨人 (CEO)
│   └── 小贾 (CEOChiefOfStaff)
│       ├── 管理层 (C-suite)
│       │   ├── 小狄 (CTO)
│       │   ├── 小乔 (CPO)
│       │   ├── (CHO)
│       │   ├── (CAO)
│       │   ├── (CMO)
│       │   ├── (COO)
│       │   └── (CFO)
│       └── 执行层
│           ├── 小全 (FullStackDeveloper)
│           └── 小柯 (TestEngineer)
└── 小吴 (RAndDTrainer)
```
- 每个员工显示在线状态、当前任务数
- 点击展开员工详情（角色说明、擅长领域、当前负载）
- 拖拽员工到聊天 → 自动填充 `@mention`

**2.4 员工调用方式**

- **推荐方式（Phase 1）**：AgentTool 自动路由。用户只需描述任务（"帮我审查这段代码"），AI 根据任务类型自动选择合适员工（CTO 审查代码、CPO 评估产品需求等）。AgentTool 已支持从 daemon `/internal/v1/agents` 查询 TriCompany contract agents。
- **可选方式（Phase 2）**：显式 `@mention`。用户输入 `@小狄 帮我审查这段代码` → 直接路由到指定员工。当前 AgentTool 的 `subagent_type` 参数已预留了按 agent_id 匹配的 fallback 逻辑。

---

## 决策 3：启用/禁用的产品语义

### 结论：APPROVE 二进制开关，部分启用延迟到 Phase 2

#### 3.1 "启用 TriCompany" 的语义

| 维度 | 行为 |
|------|------|
| Agent 加载 | TriLC daemon 启动时从 `TriCompany/source-agents/` 加载 13 个 contract agents |
| system prompt | 每个 agent 的 soul + agent_body 组装为完整 system prompt（已实现：contract-resolver） |
| `/agents` 命令 | `all` 和 `company` scope 返回 13 员工；`builtin` 仍只返回 4 个 |
| AgentTool 路由 | 可从 daemon `/internal/v1/agents` 匹配 TriCompany 员工并 spawn 子代理 |
| 治理文档 | **Phase 2**：注入 CompanyGovernanceRegistry、授权矩阵、ADE 协议到 agent context |
| 员工侧边栏 | **Phase 2**：VSCodium 侧边栏新增 TriCompany 视图 |
| 成本影响 | 无额外固定成本；按实际 token 消耗计费（后续 CFO 上线后跟踪） |

#### 3.2 "禁用 TriCompany" 的语义

| 维度 | 行为 |
|------|------|
| Agent 加载 | TriLC daemon 只加载 4 个 built-in agents（agent-core） |
| `/agents` 命令 | `all` ≡ `builtin` → 4 个 agent |
| AgentTool 路由 | 只在 4 个 built-in agents 范围内 spawn |
| TriCompany 文件 | 不清除 TriCompany/source-agents/ 目录；下次启用直接可用 |
| 治理文档 | 不注入 |
| 侧边栏 | 不显示 |

#### 3.3 "部分启用"（Phase 2 评估）

Phase 1 不提供部分启用。理由：
- MVP 需要明确的布尔开关来简化测试和文档
- 13 员工的五件套依赖关系是设计为全量加载的（colleagues 引用、reporting chain 依赖）
- 部分启用的边界（"C-suite 8 人" vs "全部 13 人" vs "按角色逐个勾选"）需要在 Phase 2 根据真实用户反馈再精确化

Phase 2 可考虑的细分策略：
1. **C-suite only 模式**：只加载 8 个管理层员工（CEO + COS + CTO + CPO + CHO + CAO + CMO + COO + CFO），不加载执行层（TestEngineer + FullStackDeveloper）和培训层（RAndDTrainer）
2. **按角色 toggle**：设置面板中每个角色可独立开关
3. **按项目 override**：特定项目可覆盖全局 TriCompany 设置

---

## 决策 4：与其他 TriCade 功能的集成

### 结论：分阶段 APPROVE

#### 4.1 项目创建集成（Phase 2 project_scaffold）

**APPROVE**：当 TriCompany 启用时，新项目创建应自动引用 TriCompany 治理模板。

具体行为：
- `tripilot.tricompany.enabled === true` 时，`tricade project init` 生成的项目骨架包含：
  - `.github/agents/` 目录（预填当前启用的员工 agent 文件）
  - `docs/product/`、`docs/engineering/`、`docs/registry/` 六件套骨架（预填模板文件）
  - `CONTRIBUTING.md` 包含 TriCompany IPD 流程引用和 review 规则
- `tripilot.tricompany.enabled === false` 时，生成标准最小项目骨架，不含 TriCompany 治理结构

触发时机：Phase 2 project_scaffold 功能落地时。当前 tricade-1/2/3 阶段不涉及。

#### 4.2 Cron Job 执行

**FREEZE**：Phase 1 不自动接入。TriCompany 员工参与 cron job 需要独立的编排设计。

原因：
- cron job 执行需要员工调度器（EmployeeScheduler）、成本控制器（CostController）、任务优先级系统——这些是 TriMC 编排层的职责，当前仅 Phase A 静态加载，尚未进入动态调度
- 让 13 个 agent 全部驻留在 cron 循环中会产生不可忽视的 token 成本和并发复杂度
- Phase 2 应设计"常驻员工"（Resident Employees）概念，只让 COS 和部分关键角色参与定时任务

当前 TriLC 已有 cron scheduler（`TriLC/src/cron/`）和 heartbeat（`TriLC/src/heartbeat/`），但这些是 TriLC 自身的基础设施定时任务（session reaper、mirror push），不是 TriCompany 员工调度。

#### 4.3 ADE 协议作为默认行为

**FREEZE**：Phase 1 不接入。ADE（Agent Delegation Engine / 员工委托协议）是 Phase 2 内容。

原因：
- tree-op 明确标注 tricade-4 的 next_agent 为 null（Phase 1 收口），ADE 上岗属于 Phase 2
- ADE 需要完整的员工间委托协议、决策路由、冲突仲裁——当前 AgentTool 只实现了单向 spawn，不是员工间双向委托
- Phase 1 的用户价值主张是"让用户看见和使用 13 个 AI 员工"，而不是"13 个 AI 员工自己互相协作"

Phase 2 接入规划：
- 当 TriCompany 启用 **且** ADE 协议可用时，AgentTool 的 sub-agent 应优先走 ADE 路由（带决策权限、审批链），而非直接 spawn
- ADE 可提升为系统级行为：当检测到需要跨角色决策时（如 CPO+CTO 联合审批），自动触发 ADE 多员工协作

---

## 依赖检查

| 依赖项 | 成熟度 | 状态 |
|--------|--------|------|
| TriLC contract-resolver | medium | `/src/config/contract-resolver.ts` 已实现，支持五件套加载 + system prompt 拼装 |
| TriLC AgentTool | medium | `/src/tools/agent-tool.ts` 已实现，支持 daemon contract agents fallback |
| TriLC daemon `/agents` 端点 | low→medium | CTO tricade-1 1.4 正在实现；AgentTool 已预留调用代码 |
| TriPilot welcome-setup.ts | medium | Step 4 已实现，写入 `tripilot.tricompany.enabled` + `trilc-config.json` |
| TriCompany source-agents | high | 13 员工五件套 + contract YAML 链完备 |
| EmployeeRegistry / EmployeeScheduler | low | Phase A 静态加载，动态调度未实现 → 影响 cron job 和 ADE 接入时机 |
| CompanyGovernanceRegistry | medium | 治理文档存在，但 Phase 1 不注入到 agent context → Phase 2 |

**总体判断**：Phase 1 的产品形态所需的技术依赖已基本到位（contract-resolver + AgentTool + welcome wizard）。agents 端点（CTO 1.4）是最后的关键缺失项，但产品决策不阻塞技术实现。

---

## 风险与升级

| 风险 | 严重度 | 缓解 |
|------|--------|------|
| Agents 端点未按时落地 | medium | AgentTool 已有 fallback 错误提示；不影响其他 Phase 1 交付物 |
| 13 员工全量加载的性能影响 | low | contract-resolver 为一次性加载 + 文件监听热重载；13 个 markdown 文件的加载开销可忽略 |
| "部分启用"的用户需求在 Phase 1 出现 | low | 明确文档将部分启用标记为 Phase 2；Phase 1 不承诺 |
| TriCompany 员工在不需要的场景中出现（如纯个人编码） | medium | 向导 Step 4 默认不勾选，用户主动 opt-in；禁用后完全不可见 |
| 用户误以为 13 员工 = 生产级组织运行完成 | high | `/agents` 展示时加注"研发阶段 / 非生产级"；Phase 2 侧边栏加状态标签 |

### 升级路径

以下情况需升级到 CEOChiefOfStaff：
- 任何触及 TriMC 正式宿主切换或"13 员工生产级 authZ"的产品声称
- 部分启用的早期实现需求（可能影响 Phase 2 优先级排期）
- TriCompany 需要作为独立 .vsix 对外分发的需求（触及 TriCade 商业模式）

---

## 使用依据

- `TriCompany/docs/product/PROJECT.md` V0.1（项目定位与范围）
- `TriCompany/docs/product/REQUIREMENTS.md` V0.1（核心需求）
- `TriCompany/docs/product/STATE.md` V0.1（当前产品阶段 Phase 1）
- `TriCompany/docs/registry/product-state.md`（产品角色矩阵、迭代策略、操作安全模型）
- `TriCompany/docs/registry/business-state.md`（模块商业角色与边界）
- `TriCompany/docs/registry/code-state.md`（实现健康度：contract-resolver + AgentTool + 五件套完备）
- `TriCompany/docs/registry/company-governance-state.md`（公司治理状态与术语规范）
- `TriMetaverse/docs/workflow/operating-records/2026-W31/trees/tricade-production-deploy/tree-op.json`（Phase 1 节点定义与依赖关系）
- `TriLC/src/config/trilc-profile.ts`（runtime profile：production/development）
- `TriLC/src/config/contract-resolver.ts`（agent contract 加载：五件套 → system prompt）
- `TriLC/src/config/env.ts`（`tricompanySourcePath` 解析逻辑）
- `TriLC/src/tools/agent-tool.ts`（AgentTool：sub-agent spawn + contract agents fallback）
- `TriPilot/src/welcome/welcome-setup.ts`（Step 4 向导：复选框 + `trilc-config.json` 持久化）
- `TriMC/src/orchestration/employee-registry.ts`（EmployeeRegistry Phase A 静态加载）
- `TriMC/src/orchestration/types.ts`（EmployeeRecord / RoutingDecision / DispatchResult 类型定义）
- `TriMC/src/contracts/agent-contract.ts`（AgentContract schema v1 标准类型）
