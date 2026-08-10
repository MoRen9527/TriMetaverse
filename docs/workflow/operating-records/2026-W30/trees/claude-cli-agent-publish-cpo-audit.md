# Claude CLI Agent 发布管道 — CPO 产品审计

> 审计人：CPO 小乔 | 日期：2026-07-25 | 树：CCAP

## 1. Agent 能力对标：Copilot vs Claude CLI

### 1.1 Agent 定义格式对照

| 维度 | Copilot (`.github/agents/*.agent.md`) | Claude CLI (`.claude/agents/*.md`) |
|------|---------------------------------------|------------------------------------|
| 格式 | YAML frontmatter + Markdown body | YAML frontmatter + Markdown body ✅ 一致 |
| 标识字段 | `name`（如 `ChiefProductOfficer`） | `name`（如 `chief-product-officer`）⚠️ 命名规则不同 |
| 触发描述 | `description` | `description`（Claude 内称 `whenToUse`）✅ 语义等价 |
| 工具声明 | `tools: [read, search, edit, execute]` | `tools: Bash, Read, Write, Edit, Glob, Grep`（逗号分隔）⚠️ 格式不同 |
| 用户可调用 | `user-invocable: true/false` | 无对应字段（默认所有 agent 可由 Agent tool 调用）⚠️ 语义差异 |
| 系统提示 | Markdown body（完整行为指令） | Markdown body（完整行为指令）✅ 一致 |
| 额外能力 | 无 | `model`, `effort`, `color`, `memory`, `permissionMode`, `maxTurns`, `skills`, `initialPrompt`, `background`, `isolation`, `mcpServers`, `hooks`, `disallowedTools` ⚠️ Claude 更丰富 |

### 1.2 功能差异矩阵（按 TriCompany 16 个 agent 逐一评估）

| Agent | Copilot 功能 | Claude CLI 功能 | 差异 | 产品判断 |
|-------|-------------|----------------|------|---------|
| `ceo-chief-of-staff` | 编排中枢、会议收口、registry 协同 | 同等可用 + 更多工具（Bash/Glob/Grep） | Claude 工具更强，编排能力无损 | **直接迁移** |
| `chief-product-officer` | 产品判断、MVP 定义、需求收敛 | 同等可用 + Glob/Grep 增强代码库探索 | 功能超集 | **直接迁移** |
| `chief-technology-officer` | 技术判断、交付路径、CodeGraph | 同等可用 + Bash 可执行脚本/构建 | 功能超集 | **直接迁移** |
| `chief-human-resources-officer` | 入职交接、handoff 治理 | 同等可用 | 无功能差异 | **直接迁移** |
| `chief-administrative-officer` | 公司制度、秘书处 | 同等可用 | 无功能差异 | **直接迁移** |
| `chief-financial-officer` | 财务分析 | 同等可用 | 无功能差异 | **直接迁移** |
| `chief-marketing-officer` | 市场分析 | 同等可用 | 无功能差异 | **直接迁移** |
| `chief-operating-officer` | 运营协调 | 同等可用 | 无功能差异 | **直接迁移** |
| `full-stack-developer` | 全栈开发 | 同等可用 + Bash 执行环境 | 功能增强 | **直接迁移** |
| `test-engineer` | 测试执行 | 同等可用 + Bash 运行测试套件 | 功能增强 | **直接迁移** |
| `rd-trainer` | 培训辅助 | 同等可用 | 无功能差异 | **直接迁移** |
| `business-strategy` | 商业战略 | 同等可用 | 无功能差异 | **直接迁移** |
| `CompanyGovernanceRegistry` | 治理注册表 | 同等可用 | 无功能差异 | **直接迁移** |
| `TriMetaverseBusinessStrategyRegistry` | BS 注册表 | 同等可用 | 无功能差异 | **直接迁移** |
| `TriMetaverseProductRegistry` | 产品注册表 | 同等可用 | 无功能差异 | **直接迁移** |
| `TriMetaverseCodeRegistry` | 代码注册表 | 同等可用 | 无功能差异 | **直接迁移** |

**产品结论**：16 个 agent **全部可直接迁移**，无功能性缺失。Claude CLI 的工具集（Bash、Glob、Grep、WebFetch、WebSearch、Task 系列）是 Copilot（read/search/edit）的**严格超集**，不存在 Copilot 能做但 Claude 做不了的事。唯一的"差异"是 Claude 多了能力，不是少了。

### 1.3 `user-invocable` 缺失的处理

Copilot 的 `user-invocable: true/false` 在 Claude CLI 中无直接对应。Claude 的 agent 发现机制是：所有 `.claude/agents/*.md` 中的 agent 自动可被 Agent tool 调用。

对产品的影响：
- 当前 16 个 agent 全部 `user-invocable: true`，所以**无实际差异**
- 如果未来需要"仅内部调用、不对用户暴露"的 agent，Claude 需要额外机制（如 `isHidden` flag 或 policy agent）
- **建议**：在未来 host-object-manifest 中引入 `discoverable: true/false` 字段，在转换脚本中过滤

**产品判断：APPROVE（可直接迁移，`user-invocable` 差异通过 manifest 层解决）**

---

## 2. 发布频率策略

### 2.1 当前 Copilot 发布节奏

```
源侧变更 → employee_host_publish → TriCompany-copilot-host-assets/ 更新 → host-object-manifest.json 刷新
```

触发条件：
- 五件套任一变更 → `employee_host_publish --employee <id>`
- Registry agent 变更 → 手动复制 `.agent.md` 到 live entry
- 实际频率：按需触发，无固定 schedule

### 2.2 Claude 发布频率建议

**方案 A：同步触发（推荐）**

源侧任一 agent 变更 → **同轮**执行 Copilot + Claude 双宿主发布

```
源侧 .github/agents/*.agent.md 变更
  ├─ employee_host_publish → TriCompany-copilot-host-assets/
  └─ claude_agent_publish → TriCompany-claude-host-assets/
```

- 优点：两宿主永远一致，无版本漂移
- 代价：每次变更多一步转换
- 适用：当前 16 个 agent 全部为固定岗位员工

**方案 B：异步批量（备选）**

源侧变更暂存，每周批量同步一次到 Claude 宿主侧

- 优点：减少发布频率
- 缺点：可能 Claude 侧落后于 Copilot 侧最多一周
- 适用：agent 变更不频繁时

**产品建议：采用方案 A（同步触发）**，理由：
1. 当前 agent 变更频率低（每月 ~3-5 次），同步成本可控
2. 两宿主同为研发用，版本一致降低认知负担
3. `source_publish_check` CLI（SPC-001 树）完成 Phase 1 后可自动化检测

**产品判断：APPROVE 方案 A，同步触发**

---

## 3. Claude 宿主侧五件套策略

### 3.1 问题定义

Copilot 宿主侧的完整员工对象发布路径为：

```
TriCompany/source-agents/<employee-id>/
  ├─ <id>.agent.md
  ├─ <id>.soul.md
  ├─ <id>.memory.md
  ├─ <id>.colleagues.md
  └─ <id>.social.md
         ↓ employee_host_publish
TriCompany-copilot-host-assets/knowledge/
  ├─ roles/<employee-id>/  (岗位知识：inbox/wiki/audit/workbench)
  └─ employees/<employee-id>/ (员工知识：inbox/wiki/audit/workbench)
```

Claude 宿主侧是否需要同样完整的五件套？还是仅需要 agent.md？

### 3.2 Claude CLI 的认知架构限制

Claude CLI 的 agent 机制与 Copilot 有本质差异：

| 认知维度 | Copilot 宿主 | Claude CLI 宿主 |
|---------|-------------|----------------|
| Agent 文件 | `.github/agents/*.agent.md` | `.claude/agents/*.md` |
| 身份层（soul） | live companion 文件或 support employee workspace | ⚠️ 无独立 soul 文件机制 → 需内联到 system prompt |
| 记忆层（memory） | `employee_host_publish` → knowledge/employees/*/wiki/ | ⚠️ Claude 有 `memory` frontmatter 字段（user/project/local 作用域），但机制不同 |
| 同事关系（colleagues） | knowledge/employees/*/wiki/ 或 runtime cognition | ⚠️ 无原生支持 → 需内联到 system prompt |
| 社交层（social） | knowledge/employees/*/wiki/ 或 runtime cognition | ⚠️ 无原生支持 → 需内联到 system prompt |
| 运行知识空间 | `TriCompany-copilot-host-assets/knowledge/` | ⚠️ 无对应 → 可用 `.claude/` 下文件或 agent memory |

### 3.3 产品建议：三级五件套策略

| 级别 | 内容 | Claude 侧处理方式 | 理由 |
|------|------|-------------------|------|
| **L1：核心必需** | agent.md 的完整 system prompt | 直接作为 `.claude/agents/<id>.md` 的 Markdown body | 这是 agent 的最小功能单元，Claude 原生支持 |
| **L2：内联合并** | soul + colleagues + social 的精简摘要 | 合并为一个 `## 角色身份与协作关系` section，嵌入 system prompt 末尾 | soul 的气质/口吻约束 + colleagues 的岗位关系 + social 的社交连续性，在 Claude 侧无法以独立文件消费，但必须在运行时可用 |
| **L3：宿主可选** | memory 的完整知识空间 | Claude 的 `memory` frontmatter + agent memory 机制 | Claude 有原生 agent memory（`memory: user/project/local`），但格式与 TriCompany 的 Hermes memory 不兼容。短期不强行对齐，长期在 Hermes 融合层做统一 recall 接口 |

### 3.4 具体方案

**Claude 宿主发布格式（每个 agent）：**

```markdown
---
name: chief-product-officer
description: "适用场景：产品总裁、MVP 定义、需求收敛、版本规划..."
tools: Bash, Read, Write, Edit, Glob, Grep
model: sonnet
---

<!-- L1: 完整的 agent.md system prompt -->
你是 TriCompany 当前阶段已上岗的 ChiefProductOfficer...
（完整 Copilot agent.md body）

<!-- L2: soul + colleagues + social 摘要 -->
## 角色身份与协作关系

### 身份气质（soul 摘要）
- 你是小乔，赛博公司的产品总裁 Agent
- 保持产品专家的专业口吻，不退化成客服或表单机器人
...

### 协作关系（colleagues 摘要）
- 向 CEO（磨人）汇报，通过总助（小贾）收口
- 与 CTO（小狄）形成产品-技术闭环
...

### 社交连续性（social 摘要）
- 参与每周 OP 会议
- 产品决策记录回写 ProductRegistry
...
```

**不在 Claude 宿主侧复制的内容：**
- 完整的 `source-agents/*/` 五件套原文 → 这些是源侧资产，仅需在 Copilot 宿主完整发布
- `knowledge/employees/*/wiki/` 运行消费记录 → 这些是动态数据，不属于静态 agent 定义
- `binding-profiles/*.json` → 这些是宿主 binding 事实，Claude 侧有自己独立的 agent 发现机制

**产品判断：APPROVE L1+L2 内联合并策略，L3 待 Hermes 融合层统一**

---

## 4. 风险与升级

| 风险 | 等级 | 缓解措施 | 升级条件 |
|------|------|---------|---------|
| Claude memory 与 Hermes memory 不兼容导致员工记忆断层 | 中 | 先在 Claude 侧用 `memory: user` 做独立记忆；Hermes 统一 recall 接口成熟后再桥接 | Claude 宿主切换为正式宿主时升级 |
| `user-invocable` 缺失导致敏感 agent 被意外调用 | 低 | 当前 16 个 agent 全部为公开可调用，无敏感 agent | 新增内部 agent 时升级 CHO |
| 双宿主发布同步失败导致版本漂移 | 中 | `source_publish_check` CLI 在 Phase 2 覆盖双宿主 diff 检测 | 连续 2 次同步失败时升级 CTO |

---

## 5. 使用依据

- Copilot agent 定义：`TriMetaverse/.github/agents/*.agent.md`（16 个）
- 宿主发布流程：`TriCompany/docs/workflow/host-object-publish-flow.md`
- Hermes 融合设计：`TriCompany/docs/workflow/hermes-copilot-host-migration.md`
- Claude CLI agent 格式：`D:\Code\ai\claude-code-2.1.88\source-repo\src\components\agents\agentFileUtils.ts`（`formatAgentAsMarkdown` 函数）
- Claude CLI agent schema：`D:\Code\ai\claude-code-2.1.88\source-repo\src\tools\AgentTool\loadAgentsDir.ts`（`AgentJsonSchema`）
