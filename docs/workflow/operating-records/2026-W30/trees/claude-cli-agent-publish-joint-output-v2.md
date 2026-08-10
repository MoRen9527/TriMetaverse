# Claude CLI Agent 发布管道 — CPO+CTO 修正联合收口 (v2)

> 收口人：CEOChiefOfStaff 小贾 | 日期：2026-07-25 | 树：CCAP | 修正版
>
> **v1 → v2 修正原因**：CEO 指出共享 Contract 层（`source-agents/*/contract.yaml` v2.0）一直存在，正确路径是从 contract.yaml 驱动双宿主输出，而非从已组装的 `.agent.md` 做二次转换。v1 审计结论（格式映射、工具映射、目录结构）仍然有效，但**转换源**和**架构层次**需要修正。

---

## 前置核查（v2 补充）

- [x] CEO 最新输入：共享 Contract 体系已存在，不需要从 `.agent.md` 重新转换
- [x] `TriCompany/source-agents/*/contract.yaml`（v2.0 格式）— 12 份 agent 合同已核查
  - 结构：`contract.version/type/agent_id/family` + `paths.{soul, agent_body, agent_frontmatter, memory, colleagues_social}` + `decision_rights` + `runtime_baseline`
- [x] `TriCompany/docs/registry/employee-capability-contract.md` — 合约 schema（v1.0）已核查
- [x] `TriCompany/docs/registry/<Name>.contract.yaml` — v1.0 详细合同（12 份）已核查
- [x] 五件套原子文件：`soul.agent.md` / `agent-body.agent.md` / `agent-frontmatter.agent.md` / `memory.agent.md` / `colleagues.agent.md` / `social.agent.md` 已核查
- [x] `runtime_baseline.host` 当前值 = `copilot-host`，需扩展支持 `claude-host`

---

## 决策：APPROVE（修正架构）

v1 的 APPROVE 结论不变，但**转换源从 `.agent.md` 修正为 `contract.yaml`**。架构从"两套管道各自转换"修正为"一个共享合同层驱动两个宿主输出"。

---

## 1. 修正架构：Contract 驱动的双宿主发布

### 1.1 修正前的错误理解（v1）

```
❌ 错误架构（v1）：
.github/agents/*.agent.md（已组装）
  ├── employee_host_publish → Copilot host-assets
  └── claude_agent_publish → Claude host-assets
```

### 1.2 修正后的正确架构（v2）

```
✅ 正确架构（v2）：
TriCompany/source-agents/<employee-id>/contract.yaml（v2.0，host-independent）
  │
  ├── paths → source-agents/<employee-id>/*.agent.md（五件套原子文件）
  │     soul.agent.md          ← 身份气质
  │     agent-body.agent.md    ← 系统提示正文
  │     agent-frontmatter.agent.md ← YAML frontmatter
  │     memory.agent.md        ← 记忆层契约
  │     colleagues.agent.md    ← 同事关系契约
  │     social.agent.md        ← 社交层契约
  │
  └── contract-resolver ─────────────────────────────────
        │                                                 │
        ▼                                                 ▼
  Copilot target:                                  Claude target:
  .github/agents/<Name>.agent.md          TriCompany-claude-host-assets/agents/<kebab>.md
  (YAML frontmatter + full body)          (YAML frontmatter + full body + persona)
        │                                                 │
        ▼                                                 ▼
  TriCompany-copilot-host-assets/          TriCompany-claude-host-assets/
  (knowledge / runtime / vendor)           (knowledge/personas / docs)
```

### 1.3 `runtime_baseline` 扩展

当前 contract.yaml 的 `runtime_baseline`：

```yaml
runtime_baseline:
  host: copilot-host
  tri_mc_status: planned
  tri_mc_migration_ready: false
```

修正为：

```yaml
runtime_baseline:
  hosts:                          # 从单值扩展为列表
    - copilot-host
    - claude-host
  tri_mc_status: planned
  tri_mc_migration_ready: false
```

### 1.4 Contract 层真源关系

| 层 | 文件 | 角色 |
|---|------|------|
| **Contract 定义** | `source-agents/<id>/contract.yaml` | canonical source — host-independent agent 能力合同 |
| **原子五件套** | `source-agents/<id>/{soul,agent-body,agent-frontmatter,memory,colleagues,social}.agent.md` | 被 contract 引用的可组装零件 |
| **Copilot 组装产物** | `.github/agents/<Name>.agent.md` | contract-resolver（Copilot target）的输出 |
| **Claude 组装产物** | `TriCompany-claude-host-assets/agents/<kebab>.md` | contract-resolver（Claude target）的新增输出 |
| **v1 详细合同** | `docs/registry/<Name>.contract.yaml` | 人工可读的详细合同（v1.0 格式），包含完整 instructions、decision_rights、collaborators、tools、io_contract |

---

## 2. Contract → Claude 格式转换规范（修正）

### 2.1 转换源：contract.yaml + 原子五件套

**输入**：
```
source-agents/ceo-chief-of-staff/
  ├── contract.yaml             ← 转换入口（v2.0）
  ├── agent-frontmatter.agent.md ← name/description/tools/user-invocable
  ├── agent-body.agent.md       ← 完整系统提示正文
  ├── soul.agent.md             ← 身份气质
  ├── memory.agent.md           ← 记忆层契约
  ├── colleagues.agent.md       ← 同事关系
  └── social.agent.md           ← 社交层
```

### 2.2 Contract 字段 → Claude YAML frontmatter

| Contract 源 | Claude 目标 | 转换逻辑 |
|------------|------------|---------|
| `contract.agent_id` ("ceo-chief-of-staff") | `name` | 直接使用（contract 已是 kebab-case ✅） |
| frontmatter `description` | `description` | 提取 + YAML 双引号转义 |
| frontmatter `tools: [...]` | `tools: A, B, C` | 见 §4 工具映射表（分岗位） |
| `runtime_baseline.hosts` 含 `claude-host` | — | 验证发布资格 |
| — | `model` | 默认 `sonnet` |
| frontmatter `user-invocable` | ❌ 删除 | Claude 无此字段 |

### 2.3 五件套 → Claude Markdown body 组装

```
Claude agent body =
  agent-body.agent.md（完整系统提示正文）
  + "\n\n## 角色身份与协作关系\n\n"
  + "### 身份气质\n" + soul.agent.md（摘要/全文）
  + "\n### 记忆层契约\n" + memory.agent.md（摘要）
  + "\n### 同事关系\n" + colleagues.agent.md（摘要）
  + "\n### 社交连续性\n" + social.agent.md（摘要）
```

**关键优势**：contract.yaml 的 `agent_id` 已经是 kebab-case（`ceo-chief-of-staff`、`chief-product-officer`），**不需要 PascalCase → kebab-case 转换**！

### 2.4 命名一致性验证

| contract `agent_id` | Claude `name` | 是否一致 |
|---------------------|---------------|---------|
| `ceo-chief-of-staff` | `ceo-chief-of-staff` | ✅ |
| `chief-product-officer` | `chief-product-officer` | ✅ |
| `chief-technology-officer` | `chief-technology-officer` | ✅ |
| `chief-human-resources-officer` | `chief-human-resources-officer` | ✅ |
| `chief-administrative-officer` | `chief-administrative-officer` | ✅ |
| `chief-financial-officer` | `chief-financial-officer` | ✅ |
| `chief-marketing-officer` | `chief-marketing-officer` | ✅ |
| `chief-operating-officer` | `chief-operating-officer` | ✅ |
| `full-stack-developer` | `full-stack-developer` | ✅ |
| `test-engineer` | `test-engineer` | ✅ |
| `rd-trainer` | `rd-trainer` | ✅ |

> ⚠️ `business-strategy`（source-agents 目录下的单文件 agent，非 Role family）无 contract.yaml。Registry agent（16 个模块级）也无 contract.yaml。这两类需特殊处理（见 §5.6）。

---

## 3. `TriCompany-claude-host-assets/` 目录结构（不变）

目录结构设计与 v1 一致，仅转换源修正：

```
TriCompany-claude-host-assets/
├── README.md
├── .gitignore
├── claude-host-agent-manifest.json
├── agents/                                    ← contract-resolver (Claude target) 输出
│   ├── ceo-chief-of-staff.md
│   ├── chief-product-officer.md
│   ├── chief-technology-officer.md
│   ├── chief-human-resources-officer.md
│   ├── chief-administrative-officer.md
│   ├── chief-financial-officer.md
│   ├── chief-marketing-officer.md
│   ├── chief-operating-officer.md
│   ├── full-stack-developer.md
│   ├── test-engineer.md
│   ├── rd-trainer.md
│   ├── business-strategy.md                  ← 特殊：无 contract，从 .agent.md 直接转换
│   ├── company-governance-registry.md         ← 特殊：无 contract
│   ├── tri-metaverse-business-strategy-registry.md
│   ├── tri-metaverse-product-registry.md
│   └── tri-metaverse-code-registry.md
├── docs/
│   └── workflow/
│       └── claude-agent-publish-flow.md
└── knowledge/
    └── personas/                              ← 可选：五件套原子文件的完整副本
        ├── ceo-chief-of-staff-persona.md
        └── ...
```

---

## 4. 工具映射表（不变）

与 v1 完全一致。分岗位工具推荐集：

| Agent (contract agent_id) | Claude 工具 |
|---------------------------|------------|
| `ceo-chief-of-staff` | Bash, Read, Write, Edit, Glob, Grep, Task, TodoWrite |
| `chief-product-officer` | Read, Glob, Grep, Write, Edit, WebFetch |
| `chief-technology-officer` | Bash, Read, Write, Edit, Glob, Grep, Task |
| `chief-human-resources-officer` | Read, Write, Edit, Glob, Grep |
| `chief-administrative-officer` | Read, Write, Edit, Glob, Grep |
| `chief-financial-officer` | Read, Glob, Grep, Write, Edit |
| `chief-marketing-officer` | Read, Glob, Grep, Write, Edit, WebFetch, WebSearch |
| `chief-operating-officer` | Read, Write, Edit, Glob, Grep, Task |
| `full-stack-developer` | Bash, Read, Write, Edit, Glob, Grep |
| `test-engineer` | Bash, Read, Glob, Grep, Write |
| `rd-trainer` | Read, Glob, Grep, Write, Edit |

---

## 5. 实施路线图（修正）

### Phase 1：Contract 扩展 + Claude contract-resolver — 1 人天

| 步骤 | 产出 | 负责人 | 估时 |
|------|------|-------|------|
| P1.1 | 分析现有 contract-resolver 实现（定位 TriLC 或其他位置的解析逻辑） | CTO | 1h |
| P1.2 | 为 12 份 contract.yaml 扩展 `runtime_baseline.hosts: [copilot-host, claude-host]` | CPO | 0.5h |
| P1.3 | 实现 contract-resolver Claude target：contract.yaml → `.claude/agents/*.md` | CTO | 3h |
| P1.4 | 生成 12 份 Claude agent 文件到 `TriCompany-claude-host-assets/agents/` | CTO | 0.5h |
| P1.5 | 为无 contract 的 agent（business-strategy + registry agents）实现 `.agent.md` → Claude 格式的 fallback 转换 | CTO | 1h |
| P1.6 | 手动验证 3 个核心 agent 在 Claude CLI 中可用 | CTO | 1h |

**验收标准**：
- [ ] 12 份 contract.yaml 全部扩展 `hosts: [copilot-host, claude-host]`
- [ ] contract-resolver 可以从 contract.yaml 组装出 Claude-compatible agent 文件
- [ ] `ceo-chief-of-staff` 在 Claude CLI 中可通过 `/agents` 命令发现
- [ ] contract-resolver 输出与 Copilot `.agent.md` 行为一致（同源验证）

### Phase 2：完整性 + 双宿主同步 — 1 人天

| 步骤 | 产出 | 负责人 | 估时 |
|------|------|-------|------|
| P2.1 | `source_publish_check` Phase 2：对比 contract.yaml ↔ Copilot agent ↔ Claude agent 三方一致性 | CTO | 3h |
| P2.2 | 生成 `claude-host-agent-manifest.json`（基于 contract.yaml 的 `agent_id` + `version`） | CTO | 1h |
| P2.3 | 编写 `claude-agent-publish-flow.md` 发布流程文档 | 小贾 | 1h |
| P2.4 | 端到端验证：修改 contract.yaml → 双宿主 agent 自动同步 | CTO | 2h |

**验收标准**：
- [ ] contract.yaml 修改 → Copilot + Claude 宿主均在同一会话内更新
- [ ] `source_publish_check` 三方 diff 报告 0 差异
- [ ] 发布流程文档完整

### Phase 3：Contract Registry 统一 — 0.5 人天（未来可选）

| 步骤 | 产出 | 负责人 | 估时 |
|------|------|-------|------|
| P3.1 | 对照 v1 contract（`docs/registry/<Name>.contract.yaml`）验证 v2 contract 信息完整性 | CPO | 2h |
| P3.2 | 如发现 gap，补齐 v2 contract 的 `decision_rights` 和 `collaborators` 字段 | CPO | 1h |

---

## 6. v1 → v2 修正清单

| 修正项 | v1（错误） | v2（正确） |
|--------|-----------|-----------|
| 转换源 | `.github/agents/*.agent.md`（已组装产物） | `source-agents/*/contract.yaml` + 五件套原子文件 |
| 命名转换 | 需要 PascalCase → kebab-case 映射表 | contract `agent_id` 已是 kebab-case |
| 架构模式 | 两套管道各自从 `.agent.md` 转换 | 一个共享合同层驱动两个宿主输出 |
| runtime_baseline | 未提及 | `hosts: [copilot-host, claude-host]` |
| contract-resolver | 未提及 | 核心组件：contract → Claude 目标 |
| 工具映射 | ✅ 正确 | ✅ 不变 |
| 目录结构 | ✅ 正确 | ✅ 不变 |
| 实施路线图 | 基于 `.agent.md` 转换脚本 | 基于 contract-resolver 扩展 |

---

## 7. 协调与升级

| 事项 | 状态 | 后续 |
|------|------|------|
| CEO 发现共享 Contract 层 | ✅ 已接收并修正 | — |
| 定位 contract-resolver 实现（TriLC 或其它位置） | ⏳ 待确认 | CTO 在 Phase 1 P1.1 定位 |
| 12 份 contract.yaml `hosts` 扩展 | ⏳ 待启动 | CPO 在 Phase 1 P1.2 执行 |
| 无 contract 的 agent fallback | ⏳ 待启动 | CTO 在 Phase 1 P1.5 实现 |
| v1 → v2 变更同步到 `TriCompany-copilot-host-assets/` | 🔮 后续 | 确认 Copilot 宿主的 contract-resolver 是否需要同步更新 |

---

## 8. 风险

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| contract-resolver 位置未知（TriLC 找不到） | 中 | P1.1 在 TriMetaverse 全项目搜索 `contract-resolver`；如不存在，从零实现 |
| v1/v2 contract 双格式导致不一致 | 中 | P3.1 做交叉验证；长期统一为 v2.0 |
| business-strategy + registry agents 无 contract | 低 | P1.5 fallback 到 `.agent.md` 直接转换 |

---

*本文为 CCAP 树修正联合收口节点（CCAP-3 v2）交付物。v1 保留为 `claude-cli-agent-publish-joint-output.md` 作为审计轨迹。*
