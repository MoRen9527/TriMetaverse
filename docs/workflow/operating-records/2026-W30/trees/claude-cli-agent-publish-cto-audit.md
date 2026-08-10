# Claude CLI Agent 发布管道 — CTO 技术审计

> 审计人：CTO 小狄 | 日期：2026-07-25 | 树：CCAP

## 1. Claude CLI Agent 配置格式确认

### 1.1 精确 Schema（源码验证）

基于 `D:\Code\ai\claude-code-2.1.88\source-repo\` 源码审计，Claude CLI 的 agent 文件格式如下：

**文件位置**：`.claude/agents/<agentType>.md`

**YAML frontmatter 字段（完整）**：

| 字段 | 类型 | 必需 | 验证规则 | 对应 Copilot |
|------|------|------|---------|-------------|
| `name` | string | ✅ | 字母数字+连字符，3-50 字符，首尾不能是连字符 | `name`（⚠️ 需从 PascalCase 转 kebab-case） |
| `description` | string | ✅ | 至少 1 字符，建议 10-5000 字符 | `description` |
| `tools` | string (逗号分隔) | ❌ | 逗号分隔工具名列表；省略 = 全部工具可用 | `tools`（⚠️ 格式差异） |
| `model` | string | ❌ | 模型别名或 `inherit` | ❌ 无对应 |
| `effort` | string \| number | ❌ | `low/medium/high` 或整数 | ❌ 无对应 |
| `color` | string | ❌ | 预定义颜色名 | ❌ 无对应 |
| `memory` | string | ❌ | `user/project/local` | ❌ 无对应 |
| `permissionMode` | string | ❌ | 权限模式 | ❌ 无对应 |
| `maxTurns` | number | ❌ | 正整数，最大 agentic 回合数 | ❌ 无对应 |
| `skills` | string (逗号分隔) | ❌ | 预加载 skill 名列表 | ❌ 无对应 |
| `initialPrompt` | string | ❌ | agent 启动时前置注入的提示 | ❌ 无对应 |
| `background` | boolean | ❌ | `true/false`，后台模式 | ❌ 无对应 |
| `isolation` | string | ❌ | `worktree`（外部构建）/ `remote`（ant-only） | ❌ 无对应 |
| `mcpServers` | array | ❌ | MCP 服务器引用或内联定义 | ❌ 无对应 |
| `hooks` | object | ❌ | 会话级 hook 配置 | ❌ 无对应 |
| `disallowedTools` | string (逗号分隔) | ❌ | 禁止使用的工具列表 | ❌ 无对应 |

**Markdown body**：完整的 system prompt（20-10000 字符，少于 20 报 error，超过 10000 报 warning）。

### 1.2 `parseAgentFromMarkdown` 解析逻辑（源码审计）

```
1. loadMarkdownFilesForSubdir('agents', cwd) 
   → 扫描 .claude/agents/*.md
2. 对每个文件：
   a. 解析 YAML frontmatter
   b. 校验 name 和 description 存在
   c. 解析 tools → parseAgentToolsFromFrontmatter (逗号分隔)
   d. 解析 model / effort / color / memory / permissionMode / maxTurns / skills
   e. Markdown body → getSystemPrompt() 闭包
   f. 如果 memory 启用且 autoMemory 开启 → 自动注入 Write/Edit/Read 工具
3. getActiveAgentsFromList: 按优先级去重（built-in > plugin > user > project > flag > managed）
   → 同名 agent 以最高优先级为准
```

### 1.3 格式实例（转换后的 chief-product-officer）

```markdown
---
name: chief-product-officer
description: "适用场景：产品总裁、chief product officer、MVP 定义、产品优先级、需求池分析、定价假设、版本规划、商业化路径，或把信号转成可卖产品。"
tools: Bash, Read, Write, Edit, Glob, Grep
model: sonnet
---

你是 TriCompany 当前阶段已上岗的 `ChiefProductOfficer`，也就是赛博公司的产品总裁 Agent。

在实际对话里，你的工作名是 `小乔`。
（...完整的 Copilot agent.md Markdown body...）
```

**关键差异**：
- `name` 必须从 `ChiefProductOfficer`（PascalCase）转为 `chief-product-officer`（kebab-case）
- `tools` 从 YAML 数组 `[read, search, edit, execute]` 转为逗号分隔 `Bash, Read, Write, Edit, Glob, Grep`
- 无 `user-invocable` 字段 → 删除

**技术判断：APPROVE — 格式转换可行且可自动化**

---

## 2. 工具映射表

### 2.1 Copilot → Claude 核心映射

| Copilot 工具 | Claude CLI 工具 | 映射策略 | 备注 |
|-------------|----------------|---------|------|
| `read` | `Read` | **直接映射** | 文件读取，功能等价 |
| `search` | `Grep` + `Glob` | **拆分映射** | Copilot search 是模糊语义，Claude 拆为精确 grep（内容搜索）和 glob（文件名搜索） |
| `edit` | `Write` + `Edit` | **拆分映射** | Copilot edit 是统一编辑，Claude 拆为 Write（新建/覆写）和 Edit（精确替换） |

### 2.2 Claude 独有工具（Copilot 无对应）

| Claude CLI 工具 | 功能 | TriCompany agent 是否需要 | 建议 |
|----------------|------|--------------------------|------|
| `Bash` | 执行 shell 命令 | ✅ 高 | CTO/FullStack/Test 必需；CPO/CHO 可选 |
| `Glob` | 文件名模式搜索 | ✅ 高 | 替代 Copilot search 的文件查找部分 |
| `Grep` | 内容正则搜索 | ✅ 高 | 替代 Copilot search 的内容搜索部分 |
| `WebFetch` | 获取网页内容 | ⚠️ 中 | CPO/CMO 市场调研时可启用 |
| `WebSearch` | 网络搜索 | ⚠️ 中 | CPO/CMO 市场调研时可启用 |
| `Task` (Agent tool) | 调用子 agent | ✅ 高 | 编排必需；与 Copilot 的 Agent 调用等价 |
| `TodoWrite` | 任务列表管理 | ⚠️ 低 | 可选便利工具 |
| `AskUserQuestion` | 向用户提问 | ⚠️ 低 | 交互式确认场景 |

### 2.3 分岗位工具推荐

| Agent 角色 | 推荐工具集 |
|-----------|-----------|
| `ceo-chief-of-staff` | Bash, Read, Write, Edit, Glob, Grep, Task, TodoWrite |
| `chief-product-officer` | Read, Glob, Grep, Write, Edit, WebFetch |
| `chief-technology-officer` | Bash, Read, Write, Edit, Glob, Grep, Task |
| `full-stack-developer` | Bash, Read, Write, Edit, Glob, Grep |
| `test-engineer` | Bash, Read, Glob, Grep, Write |
| `chief-human-resources-officer` | Read, Write, Edit, Glob, Grep |
| `chief-administrative-officer` | Read, Write, Edit, Glob, Grep |
| 各 Registry agent | Read, Glob, Grep, Write, Edit |
| `chief-marketing-officer` | Read, Glob, Grep, Write, Edit, WebFetch, WebSearch |
| `chief-financial-officer` | Read, Glob, Grep, Write, Edit |
| `chief-operating-officer` | Read, Write, Edit, Glob, Grep, Task |
| `rd-trainer` | Read, Glob, Grep, Write, Edit |
| `business-strategy` | Read, Glob, Grep, Write, Edit |

### 2.4 映射自动化规则

```
Copilot read        → Claude Read
Copilot search      → Claude Glob + Grep
Copilot edit        → Claude Write + Edit
Copilot execute (如声明) → Claude Bash
```

**技术判断：APPROVE — 工具映射完整且可映射为转换脚本**

---

## 3. 发布自动化方案

### 3.1 转换脚本设计

**脚本位置**：`TriCompany/runtime/cognition/claude_agent_publish.py`

**流程**：

```
1. 读取 .github/agents/*.agent.md（17 个文件）
2. 对每个文件：
   a. 解析 YAML frontmatter
   b. 提取 name / description / tools / Markdown body
   c. 转换 name：PascalCase → kebab-case
      - ChiefProductOfficer → chief-product-officer
      - CEOChiefOfStaff → ceo-chief-of-staff  (⚠️ 特殊规则：CEO→ceo)
      - FullStackDeveloper → full-stack-developer
      - TriMetaverseProductRegistry → tri-metaverse-product-registry
   d. 转换 tools：根据 2.3 的分岗位映射表
   e. 移除 user-invocable 字段
   f. 可选：合并 soul + colleagues + social 摘要（CPO 建议的 L2 层）
   g. 生成 Claude CLI 格式的 YAML frontmatter + Markdown body
3. 写入 TriCompany-claude-host-assets/agents/<kebab-name>.md
4. 更新 TriCompany-claude-host-assets/claude-host-agent-manifest.json
```

### 3.2 命名转换规则

```python
# PascalCase → kebab-case 转换
# 特殊缩写保留大写 → 全小写
NAME_MAPPING = {
    "CEOChiefOfStaff": "ceo-chief-of-staff",      # CEO → ceo
    "ChiefProductOfficer": "chief-product-officer",
    "ChiefTechnologyOfficer": "chief-technology-officer",
    "ChiefHumanResourcesOfficer": "chief-human-resources-officer",
    "ChiefAdministrativeOfficer": "chief-administrative-officer",
    "ChiefFinancialOfficer": "chief-financial-officer",
    "ChiefMarketingOfficer": "chief-marketing-officer",
    "ChiefOperatingOfficer": "chief-operating-officer",
    "FullStackDeveloper": "full-stack-developer",
    "TestEngineer": "test-engineer",
    "RDAndTTrainer": "rd-trainer",
    "BusinessStrategy": "business-strategy",
    "CompanyGovernanceRegistry": "company-governance-registry",
    "TriMetaverseBusinessStrategyRegistry": "tri-metaverse-business-strategy-registry",
    "TriMetaverseProductRegistry": "tri-metaverse-product-registry",
    "TriMetaverseCodeRegistry": "tri-metaverse-code-registry",
}
```

### 3.3 基于 `employee_host_publish` 架构的复用

当前 `employee_host_publish` 已有以下可复用模块：
- `source kit scaffold/validation` → 验证源侧 agent 文件完整性
- `employee_host_object_generation` → 生成 support object payload
- `employee_host_binding_profile_generation` → 生成 binding profile

Claude 发布脚本可复用：
- `source kit validation` → 确保源侧 agent 有效再转换
- 统一的输出根目录约定（`--support-root` 参数模式）

**技术判断：APPROVE — 转换逻辑简单，可在 0.5 人天内实现脚本**

---

## 4. Claude 宿主五件套资产格式

### 4.1 `TriCompany-claude-host-assets/` 目录结构

```
TriCompany-claude-host-assets/
├── README.md
├── claude-host-agent-manifest.json        ← 发布清单（对标 host-object-manifest.json）
├── .gitignore
├── agents/                                 ← Claude CLI agent 定义
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
├── docs/                                   ← 支撑文档
│   ├── workflow/
│   │   └── claude-agent-publish-flow.md   ← 本文的 workflow 版本
│   └── registry/
│       └── claude-agent-mapping.md         ← 源侧→Claude 侧的映射表
└── knowledge/                              ← 可选：L2 内联合并的 soul/colleagues/social 源
    └── personas/
        ├── ceo-chief-of-staff-persona.md
        ├── chief-product-officer-persona.md
        └── ...
```

### 4.2 claude-host-agent-manifest.json 格式

```json
{
  "bundleId": "tricompany-claude-agent-publish-v0.1",
  "status": "active",
  "mode": "parallel-host-publish",
  "sourceRepo": "TriCompany",
  "sourceAgentDir": ".github/agents",
  "targetDir": "TriCompany-claude-host-assets/agents",
  "publishedAt": "2026-07-25T09:00:00+08:00",
  "agents": [
    {
      "sourceName": "CEOChiefOfStaff",
      "claudeName": "ceo-chief-of-staff",
      "sourceFile": ".github/agents/ceo-chief-of-staff.agent.md",
      "targetFile": "TriCompany-claude-host-assets/agents/ceo-chief-of-staff.md",
      "tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep", "Task", "TodoWrite"],
      "hasPersona": true,
      "lastSyncedAt": "2026-07-25T09:00:00+08:00"
    }
    // ... 其余 15 个 agent
  ],
  "preflightChecks": [
    "所有源侧 .github/agents/*.agent.md 文件存在且格式有效",
    "Claude CLI agent name 命名规则合规（kebab-case, 3-50 chars）",
    "工具映射表无缺失"
  ]
}
```

### 4.3 与 Copilot host-assets 的关系

| 资产类型 | Copilot 宿主 | Claude 宿主 | 策略 |
|---------|-------------|------------|------|
| Agent 定义文件 | `.github/agents/*.agent.md`（live 入口） | `TriCompany-claude-host-assets/agents/*.md`（发布副本） | **独立发布** |
| 员工知识空间 | `TriCompany-copilot-host-assets/knowledge/` | ❌ 不复制 | **不做冗余** |
| Binding profile | `TriCompany/.github/binding-profiles/*.json` | ❌ 不复制 | Claude 无对等机制 |
| 运行态 cognition | `.tricompany-cognition/**` | ❌ 不复制 | 宿主隔离 |
| 发布清单 | `host-object-manifest.json` | `claude-host-agent-manifest.json` | **平行 manifest** |
| 支撑文档 | `docs/workflow/` | `docs/workflow/`（发布副本） | **选择性同步** |

### 4.4 版本同步策略

```
源侧 .github/agents/*.agent.md  (canonical source)
       ├─── Copilot live entry:  TriMetaverse/.github/agents/*.agent.md
       ├─── Copilot host assets: TriCompany-copilot-host-assets/knowledge/...
       └─── Claude host assets:  TriCompany-claude-host-assets/agents/*.md
```

- 源侧 .agent.md 是唯一真源
- 两宿主均为**发布副本**（published copy），不持有独立真源
- 同步方向永远单向：源侧 → 宿主侧

**技术判断：APPROVE — 目录结构清晰、发布单向、无冗余**

---

## 5. 风险与缓解

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| Claude CLI 版本升级改 agent 格式 | 中 | frontmatter schema 由 Zod 定义，向后兼容概率高；在 manifest 中记录 Claude CLI 版本 |
| 命名冲突（如两个 agent 转 kebab-case 后重名） | 低 | 当前 16 个 agent 名称可区分；在转换脚本中检测重复 |
| Bash 工具权限问题 | 中 | 按岗位推荐工具集，非开发岗不授予 Bash；Claude 权限系统可在运行时控制 |
| Claude agent 与 Copilot agent 行为差异 | 低 | 二者使用相同的 system prompt body，行为差异主要来自工具差异（且 Claude 为超集） |

---

## 6. 使用依据

- Claude CLI agent 解析：`D:\Code\ai\claude-code-2.1.88\source-repo\src\tools\AgentTool\loadAgentsDir.ts`
- Claude CLI agent 格式化：`D:\Code\ai\claude-code-2.1.88\source-repo\src\components\agents\agentFileUtils.ts`（`formatAgentAsMarkdown`）
- Claude CLI agent 验证：`D:\Code\ai\claude-code-2.1.88\source-repo\src\components\agents\validateAgent.ts`
- Claude CLI agent 类型：`D:\Code\ai\claude-code-2.1.88\source-repo\src\components\agents\types.ts`
- Claude CLI 工具注册表：`D:\Code\ai\claude-code-2.1.88\source-repo\src\tools/`（完整工具列表）
- TriCompany 发布流程：`TriCompany/docs/workflow/host-object-publish-flow.md`
- employee_host_publish 架构：`TriCompany/runtime/cognition/employee_host_publish.py`
