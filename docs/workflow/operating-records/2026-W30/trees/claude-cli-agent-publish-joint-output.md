# Claude CLI Agent 发布管道 — CPO+CTO 联合收口

> 收口人：CEOChiefOfStaff 小贾 | 日期：2026-07-25 | 树：CCAP | 节点：CCAP-3
> 
> 输入：CPO 产品审计（CCAP-1）+ CTO 技术审计（CCAP-2）

---

## 决策：APPROVE

事实齐全，边界清晰：Claude CLI agent 格式已通过源码验证、16 个 agent 全部可迁移、工具映射完整、发布流程可自动化且与现有 `employee_host_publish` 架构兼容。落在当前研发阶段边界内。

---

## 1. Claude CLI 发布管道架构设计

### 1.1 总体架构

```
                    源侧真源（canonical source）
          TriMetaverse/.github/agents/*.agent.md  (17 个)
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
              Copilot live  Copilot    Claude
              入口          host       host
                    │         │         │
                    ▼         ▼         ▼
          .github/   TriCompany-  TriCompany-
          agents/    copilot-    claude-
          *.agent.md host-assets/ host-assets/
                    │ knowledge/  agents/*.md
                    │ runtime/    claude-host-
                    │ vendor/     agent-
                    │             manifest.json
```

### 1.2 发布方向：单向源侧发布（ADE）

```
源侧 .github/agents/*.agent.md
    │
    ├─[现有]─── employee_host_publish ──→ TriCompany-copilot-host-assets/
    │
    └─[新增]─── claude_agent_publish ──→ TriCompany-claude-host-assets/
```

- **方向**：永远单向（源侧 → 宿主侧）
- **真源**：`.github/agents/*.agent.md` 是唯一真源
- **触发**：源侧 agent 变更 → 同轮执行双宿主发布
- **验证**：`source_publish_check` CLI（SPC-001 树 Phase 2）覆盖双宿主 diff

### 1.3 管道分层

| 层 | 职责 | 资产 |
|---|------|------|
| **源侧层（Source）** | agent 定义真源 | `.github/agents/*.agent.md` |
| **转换层（Transform）** | 格式转换 + 工具映射 + persona 合并 | `runtime/cognition/claude_agent_publish.py` |
| **宿主层（Host）** | Claude CLI 可消费的发布副本 | `TriCompany-claude-host-assets/agents/*.md` |
| **清单层（Manifest）** | 发布追踪 + 版本同步 | `claude-host-agent-manifest.json` |

---

## 2. `TriCompany-claude-host-assets/` 目录结构

```
TriCompany-claude-host-assets/
├── README.md                                  # 包说明
├── .gitignore
├── claude-host-agent-manifest.json             # 发布清单（对标 host-object-manifest.json）
│
├── agents/                                     # Claude CLI agent 定义（.claude/agents/*.md 发布副本）
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
│   ├── business-strategy.md
│   ├── company-governance-registry.md
│   ├── tri-metaverse-business-strategy-registry.md
│   ├── tri-metaverse-product-registry.md
│   └── tri-metaverse-code-registry.md
│
├── docs/                                       # 支撑文档（发布副本）
│   ├── workflow/
│   │   └── claude-agent-publish-flow.md        # 发布流程文档
│   └── registry/
│       └── claude-agent-mapping.md             # 源侧→Claude 映射表
│
└── knowledge/                                  # L2 persona 摘要（soul+colleagues+social）
    └── personas/
        ├── ceo-chief-of-staff-persona.md
        ├── chief-product-officer-persona.md
        ├── chief-technology-officer-persona.md
        ├── chief-human-resources-officer-persona.md
        └── ...
```

### 与 Copilot host-assets 的对照

| 维度 | Copilot | Claude |
|------|---------|--------|
| Agent 文件 | ❌ 在 TriMetaverse/.github/agents/（live） | ✅ 在 TriCompany-claude-host-assets/agents/ |
| 知识空间 | `knowledge/roles/` + `knowledge/employees/` | `knowledge/personas/`（仅 L2 摘要） |
| Runtime | `runtime/cognition/` | ❌ 不复制（运行态不进入发布包） |
| Manifest | `host-object-manifest.json` | `claude-host-agent-manifest.json` |
| Docs | `docs/workflow/`（完整） | `docs/workflow/`（精简发布副本） |

---

## 3. Agent 格式转换规范

### 3.1 Copilot → Claude 转换规则

**输入**：`TriMetaverse/.github/agents/<Name>.agent.md`

```yaml
---
name: ChiefProductOfficer
description: "适用场景：..."
tools: [read, search, edit, execute]
user-invocable: true
---
（Markdown body）
```

**输出**：`TriCompany-claude-host-assets/agents/chief-product-officer.md`

```markdown
---
name: chief-product-officer
description: "适用场景：产品总裁、chief product officer、MVP 定义、产品优先级、需求池分析、定价假设、版本规划、商业化路径，或把信号转成可卖产品。"
tools: Bash, Read, Write, Edit, Glob, Grep
model: sonnet
---

<!-- L1: 完整 agent system prompt -->
你是 TriCompany 当前阶段已上岗的 `ChiefProductOfficer`...
（完整的 Copilot agent.md Markdown body）

<!-- L2: soul + colleagues + social 摘要 -->
## 角色身份与协作关系
（persona 摘要内容）
```

### 3.2 字段转换规则

| Copilot 字段 | Claude 字段 | 转换逻辑 |
|-------------|------------|---------|
| `name` (PascalCase) | `name` (kebab-case) | 查表转换（见 §3.3） |
| `description` | `description` | 直接复制（⚠️ 转义双引号 `" → \"`、反斜杠 `\ → \\`） |
| `tools: [...]` (YAML 数组) | `tools: A, B, C` (逗号分隔) | 查表映射（见 §4）+ 格式转换 |
| `user-invocable` | ❌ 删除 | Claude 无此字段 |
| Markdown body | Markdown body | 直接复制 + 追加 L2 persona 摘要 |
| - | `model` | 默认 `sonnet` |
| - | `color` | 可选，当前不设置 |

### 3.3 命名映射表（完整）

```python
NAME_MAPPING = {
    "CEOChiefOfStaff":                      "ceo-chief-of-staff",
    "ChiefProductOfficer":                  "chief-product-officer",
    "ChiefTechnologyOfficer":               "chief-technology-officer",
    "ChiefHumanResourcesOfficer":           "chief-human-resources-officer",
    "ChiefAdministrativeOfficer":           "chief-administrative-officer",
    "ChiefFinancialOfficer":                "chief-financial-officer",
    "ChiefMarketingOfficer":                "chief-marketing-officer",
    "ChiefOperatingOfficer":                "chief-operating-officer",
    "FullStackDeveloper":                   "full-stack-developer",
    "TestEngineer":                         "test-engineer",
    "RAndDTrainer":                         "rd-trainer",
    "BusinessStrategy":                     "business-strategy",
    "CompanyGovernanceRegistry":            "company-governance-registry",
    "TriMetaverseBusinessStrategyRegistry": "tri-metaverse-business-strategy-registry",
    "TriMetaverseProductRegistry":          "tri-metaverse-product-registry",
    "TriMetaverseCodeRegistry":             "tri-metaverse-code-registry",
}
```

### 3.4 描述转义规则

Claude CLI 的 `formatAgentAsMarkdown` 对 `description` 做 YAML 双引号转义：
1. `\` → `\\`
2. `"` → `\"`  
3. `\n` → `\\n`

转换脚本必须在写入前执行这三步转义。

---

## 4. 工具映射表（完整）

### 4.1 分岗位工具集

| Agent (kebab-case) | Claude 工具 | 来源 |
|-------------------|------------|------|
| `ceo-chief-of-staff` | Bash, Read, Write, Edit, Glob, Grep, Task, TodoWrite | 编排中枢需全能力 |
| `chief-product-officer` | Read, Glob, Grep, Write, Edit, WebFetch | 产品分析为主 |
| `chief-technology-officer` | Bash, Read, Write, Edit, Glob, Grep, Task | 技术判断+编排 |
| `chief-human-resources-officer` | Read, Write, Edit, Glob, Grep | 文档为主 |
| `chief-administrative-officer` | Read, Write, Edit, Glob, Grep | 文档为主 |
| `chief-financial-officer` | Read, Glob, Grep, Write, Edit | 分析为主 |
| `chief-marketing-officer` | Read, Glob, Grep, Write, Edit, WebFetch, WebSearch | 市场调研需网络 |
| `chief-operating-officer` | Read, Write, Edit, Glob, Grep, Task | 运营协调 |
| `full-stack-developer` | Bash, Read, Write, Edit, Glob, Grep | 全栈开发 |
| `test-engineer` | Bash, Read, Glob, Grep, Write | 测试执行 |
| `rd-trainer` | Read, Glob, Grep, Write, Edit | 培训辅助 |
| `business-strategy` | Read, Glob, Grep, Write, Edit | 战略分析 |
| `company-governance-registry` | Read, Glob, Grep, Write, Edit | 注册表维护 |
| `tri-metaverse-business-strategy-registry` | Read, Glob, Grep, Write, Edit | 注册表维护 |
| `tri-metaverse-product-registry` | Read, Glob, Grep, Write, Edit | 注册表维护 |
| `tri-metaverse-code-registry` | Read, Glob, Grep, Write, Edit | 注册表维护 |

### 4.2 Copilot → Claude 工具语义映射

| Copilot | Claude | 语义 |
|---------|--------|------|
| `read` | `Read` | 文件读取 |
| `search` | `Glob` + `Grep` | 搜索=文件名匹配+内容匹配 |
| `edit` | `Write` + `Edit` | 编辑=新建/覆写+精确替换 |
| `execute` | `Bash` | 命令执行 |

---

## 5. 实施路线图

### Phase 1：最小可行发布（MVP）— 0.5 人天

| 步骤 | 产出 | 负责人 | 估时 |
|------|------|-------|------|
| P1.1 | 创建 `TriCompany-claude-host-assets/` 目录骨架 | CTO | 0.5h |
| P1.2 | 实现 `runtime/cognition/claude_agent_publish.py` 转换脚本 | CTO | 2h |
| P1.3 | 运行首次全量发布：源侧 16 个 agent → Claude 格式 | CTO | 0.5h |
| P1.4 | 生成 `claude-host-agent-manifest.json` | CTO | 0.5h |
| P1.5 | 手动验证 3 个核心 agent 在 Claude CLI 中可被发现和调用 | CTO | 1h |

**验收标准**：
- [ ] 16 个 `.claude/agents/*.md` 文件生成且格式合规
- [ ] `ceo-chief-of-staff` 在 Claude CLI 中可通过 `/agents` 命令发现
- [ ] `ceo-chief-of-staff` 被 Agent tool 调用后输出与 Copilot 一致的行为

### Phase 2：Persona 合并 + 完整性 — 0.5 人天

| 步骤 | 产出 | 负责人 | 估时 |
|------|------|-------|------|
| P2.1 | 为 16 个 agent 编写 L2 persona 摘要（soul+colleagues+social） | CPO + CHO | 2h |
| P2.2 | 转换脚本追加 persona 合并逻辑 | CTO | 1h |
| P2.3 | 更新 `claude-agent-mapping.md` 映射文档 | CTO | 0.5h |

**验收标准**：
- [ ] 每个 Claude agent 的系统提示末尾含 `## 角色身份与协作关系` section
- [ ] persona 内容与 Copilot 宿主侧 `knowledge/employees/*/wiki/` 一致（源侧同步）

### Phase 3：自动化 + 双宿主同步 — 1 人天

| 步骤 | 产出 | 负责人 | 估时 |
|------|------|-------|------|
| P3.1 | `source_publish_check` Phase 2：扩展覆盖 Claude 宿主 diff | CTO | 3h |
| P3.2 | 集成到 CI/工作流：源侧 agent 变更 → 自动触发双宿主发布 | CTO | 2h |
| P3.3 | 编写 `claude-agent-publish-flow.md` 发布流程文档 | CTO/小贾 | 1h |
| P3.4 | 端到端验证：修改一个 agent → 双宿主自动同步 → Claude CLI 可消费 | CTO | 2h |

**验收标准**：
- [ ] 修改 `chief-product-officer.agent.md` → Copilot + Claude 宿主均在同一会话内更新
- [ ] `source_publish_check` 报告显示双宿主同步状态
- [ ] 发布流程文档完整

### Phase 4（未来）：Hermes 融合层统一 — 待定

当 Hermes 融合层的统一 recall 接口成熟后：
- Claude agent memory 与 Copilot Hermes memory 桥接
- 统一的员工知识空间跨宿主同步
- 不纳入当前阶段路线图

---

## 6. 前置核查清单

- [x] CEO 最新输入：Claude CLI 发布管道联审需求
- [x] `.github/agents/` 17 个 agent 定义已核查（16 个员工 + 1 个总助本体 = 实际 16 个独立 agent）
- [x] `TriCompany-copilot-host-assets/` 现有结构已核查
- [x] `host-object-publish-flow.md` 发布流程已核查
- [x] `hermes-copilot-host-migration.md` 迁移策略已核查
- [x] Claude CLI 源码 agent 格式已核查（`loadAgentsDir.ts` + `agentFileUtils.ts` + `validateAgent.ts` + `types.ts`）
- [x] Claude CLI 工具注册表已核查（`src/tools/` 下 60+ 工具）
- [x] 现有 task tree 协议已核查（`dynamic-task-tree-protocol.md`）

---

## 7. 协调与升级

| 事项 | 状态 | 后续 |
|------|------|------|
| CPO 产品审计 | ✅ done | 结论已纳入本文 §3（五件套策略） |
| CTO 技术审计 | ✅ done | 结论已纳入本文 §1-5 |
| 转换脚本实现 | ⏳ 待启动 | CTO 小狄，根据路线图 Phase 1 |
| Persona 摘要编写 | ⏳ 待启动 | CPO 小乔 + CHO，Phase 2 |
| `source_publish_check` Phase 2 扩展 | ⏳ 待启动 | CTO 小狄，依赖 SPC-001 Phase 1 完成 |
| 双宿主同步 CI 集成 | ⏳ 待启动 | CTO 小狄，Phase 3 |
| Hermes 融合层统一 | 🔮 未来 | 不纳入当前路线图 |

---

## 8. 会后回填

- [ ] 更新 `docs/workflow/operating-records/2026-W30/OP-202607-W30-001.json`：新增 `claude-cli-agent-publish` 到 `activeTrees[]`
- [ ] 创建物理子目录 `trees/claude-cli-agent-publish/` 并移入本树所有文件
- [ ] 更新 `docs/workflow/tree-nodes-export.json`：登记 CCAP 树
- [ ] 提交：`git add` + `git commit "CCAP: Claude CLI Agent 发布管道 CPO+CTO 联审完成"`
- [ ] 更新 `TriCompany/.github/binding-profiles/ceo-chief-of-staff.json`（如需要）

---

## 9. 风险

| 风险 | 等级 | 当前状态 |
|------|------|---------|
| Claude CLI 版本升级改 agent 格式 | 低 | 基于 v2.1.88 源码验证，frontmatter schema 由 Zod 定义，向后兼容性强 |
| 转换脚本未实现前无法验证端到端 | 中 | Phase 1 优先实现 MVP 脚本 + 手动验证 3 个核心 agent |
| Persona 摘要质量影响 Claude agent 行为 | 中 | Phase 2 由 CPO+CHO 联合编写，确保与源侧一致 |
| Claude 宿主 agent 权限过于宽松 | 低 | 分岗位工具推荐已限定工具范围；Claude 运行时权限系统可进一步收紧 |

---

*本文为 CCAP 树联合收口节点（CCAP-3）交付物。*
