# CTO 技术判断：Agent 契约六要素 Schema 与双轨消费方案

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W28/CTO-20260709-001-agent-contract-schema.md
- syncMode: audit-record
- lastSyncedAt: 2026-07-09
- owner: ChiefTechnologyOfficer
- relatesTo: ITEM-20260709-001（Copilot-host vs TriMC 迭代策略选择）、ITEM-20260708-001（TriMC 最小部署拓扑）

---

## 技术判断

**APPROVE CPO 规格桥接模型。** 从技术可行性维度，策略明确：

1. **当前阶段不切 TriMC**——TriMC v0.1.0（CodeGraph: 17 files, 82 nodes）尚未建立 agent runtime，切换等于用木板换桥墩。
2. **也不死守散文式 agent.md**——散文格式无法被 TriMC 的 policy-gate 安全模型消费。tool scope、risk level、审批要求必须结构化，否则自动化编排的安全边界不可验证。
3. **建规格层是正确的中间态**——一层结构化真源，两边各自加载。copilot-host 侧验证语义正确性，TriMC 侧在 v0.2.0 接入规格解析。

### 两轨翻译成本 vs 直接跳 TriMC 风险成本

| | 两轨翻译模型 | 规格桥接模型 |
|---|---|---|
| **当前 copilot-host 侧成本** | 每次变更需人工翻译散文规格为两套格式 | 只更新一份结构化规格 |
| **TriMC 接入成本** | 需在 TriMC 侧实现散文解析 + 安全语义提取（不可靠） | TriMC 直接消费结构化字段，policy-gate 可自动拦截 |
| **agent 新增成本** | 需写 agent.md + 人工配置 TriMC 注册表 | 写一份规格文件，双轨自动可用 |
| **安全合规成本** | 散文无法自证 tool scope，依赖人工 review | schema 层面即可校验工具边界 |

**结论：直接跳 TriMC 的风险成本（v0.1.0 不能跑 agent + 安全层空白）远大于规格桥接的建桥成本（schema 定义 + 5 agent 转写）。**

---

## Agent 契约六要素 Schema（初稿）

### 字段定义

```yaml
# ── Agent 契约 Schema v1 draft ──
# 文件名约定: <agent-id>.contract.yaml
# 存储位置: 待定（建议 module/docs/registry/agents/<agent-id>.contract.yaml）

contract:
  version: "1.0"
  type: agent-contract
  agent_id: "CEOChiefOfStaff"             # 唯一标识，对应 copilot-host name 字段

identity:                                  # 要素 1: 身份
  display_name: "小贾"                     # 工作名
  family: "Role"                           # Registry | Role
  role: "CEOChiefOfStaff"
  description: "CEO 总助，经营待办面维护与调度中枢"
  user_invocable: true                     # 用户是否可直接 @ 调用

responsibilities:                          # 要素 2: 职责
  - "维护公司级经营记录的收口与同步"
  - "将 CEO 决策翻译为可执行日程"
  - "协调 CPO/CTO 的 overdue 推动"
  priority: "high"                         # high | medium | low

decision_rights:                           # 要素 3: 决策权
  approve:                                 # 可批准
    - "经营记录格式变更"
    - "事项状态流转 (active/frozen/closed)"
  escalate:                                # 需升级
    - "模块边界变化 → BusinessStrategy → CEO"
    - "审批基线偏离 → CEO"
  forbidden:                               # 禁止决策
    - "模块代码实现方案"
    - "产品功能优先级排序"

collaborators:                             # 要素 4: 协作者
  reports_to: "CEO"
  peers: ["ChiefProductOfficer", "ChiefTechnologyOfficer"]
  supervises: []                           # 当前不管理下属 agent

tools:                                     # 要素 5: 工具
  - name: "read"
    scope: ["docs/", ".github/", "*.md"]
    risk_level: "low"
    requires_approval: false
    runtime_equivalent: "openclaw:fs:read" # copilot-host 不需要，TriMC 侧用于路由
  - name: "search"
    scope: ["docs/", ".github/"]
    risk_level: "low"
    requires_approval: false
    runtime_equivalent: "openclaw:search:grep"
  - name: "edit"
    scope: ["docs/workflow/operating-records/"]
    risk_level: "medium"
    requires_approval: true                # policy-gate 拦截需人工确认
    runtime_equivalent: "openclaw:fs:write"
  - name: "execute"
    scope: ["scripts/"]
    risk_level: "high"
    requires_approval: true
    runtime_equivalent: "openclaw:shell:exec"

io_contract:                               # 要素 6: 输入输出
  inputs:
    - type: "user_message"                 # 用户自然语言指令
    - type: "operating_record"             # OP-*.json 经营记录
      source: "docs/workflow/operating-records/"
    - type: "registry_query"               # registry 查询结果
      source: "docs/registry/"
  outputs:
    - type: "operating_record_update"      # 经营记录更新
    - type: "status_report"                # 状态报告
    - type: "escalation"                   # 升级通知
```

### 字段必填/可选矩阵

| 字段组 | 必填 | 说明 |
|--------|------|------|
| identity | 全部 | 无身份 agent 不可注册 |
| responsibilities | 至少 1 条 | 可追加但不能为空 |
| decision_rights | approve + escalate + forbidden 至少各 1 条 | 决策边界是 policy-gate 输入 |
| collaborators | reports_to 必填 | peers/supervises 可选 |
| tools | 至少 1 个 | 无工具 agent 等于纯聊天 |
| tools.scope | 必填（每 tool） | 无 scope 视为 risk_level=high |
| tools.requires_approval | 必填（每 tool） | 默认 true（安全保守） |
| tools.runtime_equivalent | 可选 | copilot-host 侧忽略，TriMC 侧用于路由 |
| io_contract.inputs | 至少 1 条 | 不声明输入等于无契约 |
| io_contract.outputs | 至少 1 条 | 不声明输出等于无契约 |

### Tools risk_level 分层规则

| risk_level | 定义 | 举例 | policy-gate 行为 |
|------------|------|------|------------------|
| low | 只读，作用域限定在文档/配置 | read, search, view, glob | 自动放行 |
| medium | 可写，作用域限定在非关键路径 | edit（operating-records/） | 首次使用确认 |
| high | 可写/可执行，作用域涉及代码或系统 | execute, edit（src/） | 每次拦截确认 |
| critical | 网络/资金/密钥操作 | 暂无人持有 | 双人审批 |

---

## 交付计划

| 阶段 | 交付物 | 负责人 | 依赖 | 门禁 |
|------|--------|--------|------|------|
| **D1**（本文件） | Schema v1 初稿（六要素字段定义、必填矩阵、tools 分层规则） | CTO | 无 | CPO 审阅格式可用性 |
| **D2**（7/12 前） | 5 核心 agent 契约 YAML 转写第一版 | CPO（规格转写）+ CTO（schema 监督） | D1 完成 | 5 份 YAML 通过 schema 校验 |
| **D3**（7/14 前） | copilot-host 侧规格加载验证 | CTO | D2 完成 | 5 agent 在 copilot-host 下行为与转写前一致 |
| **D4**（TriMC v0.2.0） | TriMC 侧 contract resolver 实现 | CTO | TriMC v0.2.0 就绪 | 至少 1 agent 的契约可被 TriMC 解析并注册到 policy-gate |

### 实现顺序约束

```
Schema v1 ──→ 5 agent 转写 ──→ copilot-host 验证 ──→ [等待 TriMC v0.2.0] ──→ TriMC 接入
   ↑              ↑                    ↑                         ↑
 本文件         CPO 主责            CTO 主责              不在当前 sprint
```

---

## 风险与缓解

| 风险 | 等级 | 缓解 | 升级条件 |
|------|------|------|----------|
| TriMC v0.2.0 消费能力不足 | **高** | D3 先在 copilot-host 侧闭环，TriMC 接入不成不阻塞当前迭代。TriMC 侧只需解析 schema 文件即可，不需要完整 agent runtime。 | TriMC v0.3.0 仍无法解析 |
| Schema 字段过度工程化 | 中 | 本稿只定义六要素 + tools 分层。不定义通用 DSL、不定义行为语义描述语言。后续扩展走 schema 版本号增量（v1→v2）。 | 字段数超过 50 或出现嵌套递归定义 |
| 5 agent 转写工作量超预期 | 中 | 转写不是重写——每个 agent 约 30-50 行 YAML。散文部分保留为 `instructions:` 附加字段。 | 单个 agent 转写超过 2 小时 |
| copilot-host 侧无法消费 YAML 契约 | 低 | `.agent.md` frontmatter 本就是 YAML，schema 字段可直接嵌入 frontmatter 或并存为 `.contract.yaml`。 | copilot 不支持自定义 frontmatter 字段 |
| 两轨 tools 语义不一致 | 中 | `runtime_equivalent` 字段建立显式映射。copilot-host 侧忽略此字段，TriMC 侧按映射路由。差异记录在 schema 附表中。 | 出现无法映射的 tool 且两轨行为不可对账 |

---

## 发布姿态

在以下条件全部满足前，不宣布"规格桥接层已就绪"：

1. Schema v1 经 CPO + CTO 双签
2. 5 核心 agent 完成契约转写并通过 schema 校验
3. copilot-host 侧 5 agent 行为 regression 通过（与转写前等价）
4. [后置] TriMC v0.2.0 contract resolver 至少解析 1 agent 成功

### 即日可交付（本文件已覆盖）
- Schema v1 初稿 ✅
- tools risk_level 分层规则 ✅
- 5 agent 转写模板（见 schema 字段定义，可直接套用）

### 不承诺交付
- TriMC v0.2.0 的具体上线日期（依赖 TriMC 自身成熟度演进）
- "通用 agent DSL"（超出 MVP 范围）
- copilot-host 侧自动加载 YAML 契约的机制（需评估 copilot 平台限制，可能走并存模式）

---

## 使用依据

| 依据 | 来源 | 具体引用 |
|------|------|----------|
| 当前阶段基线 | business-strategy-state.md | Phase 0/1 之间，agent 体系围绕首批试点闭环 |
| TriMC 定位 | business-strategy-state.md §特别边界 | TriMC 是统一运行面；研发工作流与服务域执行都是它的运行切片 |
| TriMC 代码成熟度 | code-state.md §CodeGraph | 17 files，82 nodes，144 edges；仅覆盖 src/ + test/ 自研面 |
| copilot-host agent 格式 | .github/agents/*.agent.md | YAML frontmatter (name, description, tools, user-invocable) + 散文 body |
| TriMC 部署拓扑 | ITEM-20260708-001 | Phase 2 = agent 格式桥接 + TriDev IPD 流水线接入 |
| CPO 产品判断 | CPO-20260709-001 | 不选边，建桥。规格层统一真源，双轨各自消费 |
| 安全模型差异 | ITEM-20260709-001 总助分析 | Copilot 内置确认 vs TriMC policy-gate 三层拦截；结构化 tool scope 是 policy-gate 前提 |
