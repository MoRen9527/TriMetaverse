# P6 剩余 8 项 — CTO 架构方案

**作者**: 小狄 (CTO)
**日期**: 2026-07-29
**状态**: APPROVE (架构方案完成, 路由 FullStackDeveloper 实现)
**依据**: CEO W31 裁决"全做"，CTO 逐项出架构方案后路由

---

## 前置核查记录

0. **工作路径核查**: 所有工作落点在 `TriLC/` (同级模块)，无路径污染。TriLC 自身 Cursor.ts、MeasuredText.ts 均在 TriLC/src 下。
1. **CEO 输入**: "P6 剩余 8 项必须全做，CTO 先出架构方案"
2. **中央 BusinessStrategy**: 当前阶段 TriLC 是核心交付模块，CC 还原度 P6 是 W31 优先级
3. **技术真源**: `TriCompany/docs/engineering/DESIGN.md` → `metacognition-architecture.md` → `docs/registry/code-state.md`
4. **模块 Code Registry**: `TriLC/` 模块级 code-state.md 记录当前还原度状态
5. **发布/testing readiness**: TriDev registry 确认为 P6 验证打假 stage，TestEngineer 负责

---

## 总体评估摘要

| # | 项目 | CC源码行数 | 移植级别 | 可行性 | 新代码估算 | 依赖基础设施 |
|---|------|-----------|---------|--------|-----------|-------------|
| 1 | Alt+Y yank-pop | ~50 行 (状态管理) | **A** | 直接可做 | ~20 行 | 无 (全部已有) |
| 2 | Vim 行/文件导航 | ~200 行 (方法) | **A** | 直接可做 | ~150 行 | 无 (全部已有) |
| 3 | MCP 支持 | ~3000+ 行 (全套) | **C** | 需铺基础设施 | ~500-800 行 | `@modelcontextprotocol/sdk` + MCP 连接管理器 |
| 4 | Plan mode | ~600 行 (双工具) | **B** | 需铺基础设施 | ~200-300 行 | agent 状态机 + 工具限制 + 系统提示注入 |
| 5 | /branch | ~300 行 (纯 FS) | **B** | 需铺基础设施 | ~250 行 | 会话 transcript 持久化 |
| 5b | /rewind | ~15 行 (wrapper) | **C** | 建议砍 | — | 消息选择器 TUI 组件 (重大) |
| 6 | /review | ~58 行 (prompt) | **A** | 直接可做 | ~30 行 | 无 |
| 7 | 权限持久化 | ~概念 (settings.json allow 数组) | **A/B** | 可做 | ~150-200 行 | settings JSON 读写 |
| 8 | bundled-skills 补全 | ~各 skill 独立 | **A/B** | 选择性移植 | ~300 行 (3-4 新 skill) | 无 (纯 prompt) |

**诚实结论**: MCP 和 /rewind 是目前成本最高的两项。MCP 的全套 CC 基础设施对 TriLC 是 greenfield，但 `@modelcontextprotocol/sdk` 本身是纯 Node + JSON-RPC，可做"最小 MCP"。/rewind 的 TUI 消息选择器 + git 状态恢复是另一个项目范围，建议砍。

---

## 逐项详细评估

### 1. Alt+Y yank-pop (kill ring 循环粘贴)

**CC 源码**: `vendor/claude-code-full/src/utils/Cursor.ts` 第 21-103 行
- `lastYankStart` / `lastYankLength` / `lastActionWasYank` 模块级状态变量 (L22-24)
- `recordYank()` — 记录 yank 位置和长度 (L80-85)
- `canYankPop()` — 检查 kill ring 是否有 >=2 条可循环 (L87-89)
- `yankPop()` — 返回下一个 kill ring 项目 + 位置/长度信息用于替换 (L91-103)

**TriLC 现状**: Kill ring 系统 A级 完整移植。
- `Cursor.ts` L13-49: 完整的 kill ring 状态 (pushToKillRing, getLastKill, yankPop, updateYankLength, canYankPop 全部存在)
- `useCursorInput.ts` L180-188: Ctrl+Y yank 实现 (getLastKill + insert + updateYankLength)
- **缺失**: Alt+Y (Meta+Y) keybinding — 需要在 useCursorInput 的 key.meta 分支中处理 `char === 'y'`
- **缺失**: yank-pop 的替换逻辑 — 不是简单的 `insert()`，而是替换上一次 yank 插入的文本

**移植方式**: 在 `useCursorInput.ts` 的 Meta 键处理分支中添加:
```typescript
if (char === 'y') {
  const result = yankPop();
  if (result) {
    // Replace previous yank text (at lastYankStart, of lastYankLength)
    // with the new kill ring item. Then update lastYankLength.
    const before = prev.text.slice(0, result.start);
    const after = prev.text.slice(result.start + result.length);
    return Cursor.fromText(before + result.text + after, columns, result.start + result.text.length);
  }
}
```

**但实际实现更简单**: yankPop 返回 `{ text, start, length }` 三字段——start 和 length 是上一次 yank 的位置和长度。用 `modifyText` 语义即可：创建 start 位置的光标，删除 length 个字符，插入新文本。

**架构决策**: **A级复制 — 做**。所有状态函数已就位，只需一个 keybinding handler。~20 行新代码。零依赖。

**移植级别**: A — 直接复制 CC 语义，所有依赖已满足。

---

### 2. Vim 行/文件导航

**CC 源码**: `vendor/claude-code-full/src/utils/Cursor.ts`
- `up()` (L353-375) — 依赖 getWrappedText(), getPosition(), getOffset()
- `down()` (L377-408) — 同上
- `goToLine()` (L1022-1032) — 纯字符串 split('\n')，不依赖 MeasuredText 换行模型
- `endOfFile()` (L1034-1036) — 一行: `new Cursor(this.measuredText, this.text.length)`
- `startOfFirstLine()` (L1004-1007) — 一行: `new Cursor(this.measuredText, 0)`
- `startOfLastLine()` (L1008-1020) — 用 lastIndexOf('\n') 纯字符串操作
- `firstNonBlankInLine()` (L444-453) — 依赖 getWrappedText() + getOffset()
- 逻辑行方法 (L463-553): findLogicalLineStart(), findLogicalLineEnd(), upLogicalLine(), downLogicalLine(), startOfLogicalLine(), endOfLogicalLine(), firstNonBlankInLogicalLine(), deleteToLogicalLineEnd() — 全部使用 `text.indexOf('\n')` 纯字符串操作，不依赖 MeasuredText 换行模型

**TriLC 现状**:
- `firstNonBlankInLine()` 已完整移植 (Cursor.ts L144-153)
- `MeasuredText.ts` 完整 A级 移植: getWrappedText(), getPositionFromOffset(), getOffsetFromPosition(), getLineLength(), lineCount, nextOffset, prevOffset, snapToGraphemeBoundary — 全部存在且准确
- **缺失**: up(), down(), goToLine(), endOfFile(), startOfFirstLine(), startOfLastLine(), 全部逻辑行方法

**依赖分析**:
- `up()` / `down()` → 需要 `getPosition()`, `getOffset()`, `getWrappedText()`, `lineCount` → **全部已存在** (MeasuredText A级)
- `goToLine()` → 只依赖 `this.text.split('\n')` → **无外部依赖**
- `endOfFile()` → 只依赖 `this.text.length` → **无外部依赖**
- 逻辑行方法 → 只依赖 `text.indexOf('\n')` / `text.lastIndexOf('\n')` + `nextOffset`/`prevOffset` + `snapToGraphemeBoundary` → **全部已存在**

**架构决策**: **A级复制 — 做**。所有依赖已在 TriLC Cursor.ts 和 MeasuredText.ts 中完整满足。直接复制 CC 方法体。唯一需适配的是 import 路径和类型注解。~150 行新代码（方法体 + useCursorInput keybindings）。

**Keybinding 映射**:
- `up()` → Ctrl+P (已有，history up) 冲突？CC 中 Ctrl+P 是 historyUp，C-k 是 up。TriLC 需要 Meta+K (或 Alt+Up) 用于 move-up。
- `down()` → Ctrl+N (已有，history down) 冲突？同上。
- 实际建议: 在输入框中用 `Ctrl+Up` / `Ctrl+Down` 映射到 up/down（与 CC 一致）；`Ctrl+Home`→startOfFirstLine, `Ctrl+End`→endOfFile, `Ctrl+G`→goToLine (弹出输入)

**移植级别**: A — 直接复制，无新增依赖。

---

### 3. MCP 支持

**CC 源码**: 两层的架构
- **工具层** (thin): `tools/MCPTool/MCPTool.ts` (78 行, 骨架), `tools/ListMcpResourcesTool/` (~125 行), `tools/ReadMcpResourceTool/` (~160 行), `tools/McpAuthTool/` (~215 行), `tools/DiscoverSkillsTool/` (仅常量)
- **基础设施层** (heavy): `services/mcp/client.ts` (~1500+ 行) — MCP SDK 客户端管理、连接生命周期、重连、工具前缀注册、LRU 缓存、OAuth 流程。深度耦合 CC 的 AppState (React)、工具注册管道、CLI 特定的 UI 组件。

**CC MCP 基础设施依赖链**:
```
MCPTool (skeleton)
  → mcpClient.ts (真实的工具注册/调用实现)
    → services/mcp/client.ts (连接管理)
      → @modelcontextprotocol/sdk (官方 Typescript SDK)
        → Client, StdioClientTransport, SSEClientTransport, StreamableHTTPClientTransport
      → CC AppState (React state management)
      → CC Tool pipeline (buildTool / toolMatchesName)
      → CC Permission system
    → MCPConnectionManager.tsx (React UI 管理)
    → useManageMCPConnections.ts (React hook)
```

**TriLC 现状**: 零 MCP 基础设施。`@trimetaverse/agent-core` 提供工具注册和 agent loop，但无 MCP 概念。

**可行性分析**:
- `@modelcontextprotocol/sdk` 是纯 Node.js 包，TriLC 可直接安装使用 → **无平台障碍**
- 核心协议是 JSON-RPC (2.0) over stdio/SSE/streamable HTTP → **纯网络/进程协议，无浏览器依赖**
- CC 的 `services/mcp/client.ts` 不可直接复制——深度耦合 CC 的 AppState、React hooks、CLI 特定 UI → **需要从零构建 TriLC 的 MCP 层**

**最小可行 MCP 设计方案**:
```
TriLC MCP (recommended: 500-800 lines)
├── src/services/mcp/
│   ├── McpClientManager.ts    — 连接生命周期 (stdio + SSE only)
│   ├── McpToolProxy.ts         — 将 MCP 工具代理为 TriLC Tool 接口
│   ├── McpConfigLoader.ts      — 从 settings/mcp.json 读取服务器配置
│   └── McpTypes.ts             — 共享类型
├── adds to package.json: @modelcontextprotocol/sdk
└── wiring in cli.ts / daemon.ts
```

**范围建议** (MVP):
- [x] stdio transport (本地进程 MCP server)
- [x] SSE transport (远程 MCP server, 无 OAuth)
- [ ] Streamable HTTP transport (defer)
- [ ] OAuth auth flow (McpAuthTool) — **defer to P7+** (需要浏览器交互)
- [ ] Resource listing (ListMcpResourcesTool) — **defer** (需要额外 integration)
- [ ] Resource reading (ReadMcpResourceTool) — **defer**
- [ ] MCP skill discovery (DiscoverSkillsTool) — **defer** (需要 CC skill 发现管道)
- [x] 动态工具注册 (MCP server tools → TriLC agent tools)
- [x] 工具执行代理 (MCPTool 调用 → MCP server → result)
- [x] 基本错误处理和重连

**架构决策**: **C级 — 需铺基础设施，但可做最小版**。
- 不移植 CC 的 MCPClient (成本太高，耦合太深)
- 直接用 `@modelcontextprotocol/sdk` 构建 TriLC 独立的 MCP 连接管理器
- MVP: stdio + SSE, 工具暴露, 基本连接管理 (~500-800 行)
- Defer: OAuth, resources, skill discovery → P7+

**基础设施成本**: 4-5 个新文件, 1 个新 npm 依赖, tool 代理适配层。中。

**替代方案**: 如果 TriLC 产品定位是"单机 TUI 编码助手"且没有多 MCP server 需求，可以推迟到 P7+。但 CEO 要求做，故采用最小可行方案。

**移植级别**: C (需重铺基础设施, 但缩小范围后实际可行)

---

### 4. Plan mode

**CC 源码**:
- `tools/EnterPlanModeTool/EnterPlanModeTool.ts` (127 行) — 状态机切换: `toolPermissionContext.mode` 从 'default' → 'plan'
- `tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts` (494 行) — 恢复模式 + plan 验证 + team leader 审批流程 + auto-mode classifier 集成
- `tools/EnterPlanModeTool/constants.ts` — 工具名常量
- `tools/EnterPlanModeTool/prompt.ts` — 提示词
- 依赖: `bootstrap/state.js` (handlePlanModeTransition), `utils/permissions/PermissionUpdate.js` (applyPermissionUpdate), `utils/permissions/permissionSetup.js` (prepareContextForPlanMode), `utils/permissions/autoModeState.js` (autoMode classifier)

**核心机制**:
1. Agent 调用 EnterPlanMode → toolPermissionContext.mode 置为 'plan'
2. Plan mode 下: 工具限制 (write tools 被禁止或需要 approval) + 系统提示注入 ("DO NOT write or edit any files")
3. Agent 调用 ExitPlanMode → 恢复 prePlanMode (可能是 'default' 或 'auto')，恢复被剥离的权限规则
4. 对 teammate agents: plan 写入文件，发送 plan_approval_request 给 team lead

**TriLC 现状**:
- `@trimetaverse/agent-core` 有 permission mode 概念 (agentLoop 的 `permissionMode` 选项)
- 无 plan mode 概念，无 EnterPlanMode/ExitPlanMode 对应工具
- 无 prePlanMode 恢复机制
- 无 team-leader plan approval 流程

**简化设计方案**:
```
Plan Mode (TriLC 简化版, ~200-300 lines)
├── EnterPlanModeTool      — 切换到 plan mode, 注入 "do not write files" prompt
├── ExitPlanModeTool       — 恢复 default mode
├── Plan mode state        — AgentLoopOptions.planMode: boolean
├── Tool restriction       — plan mode 下 write tools 标记为 read-only
└── (skip) Team approval   — 单机 TUI 不需要 multi-agent plan approval
```

**跳过的 CC 功能** (MVP):
- team-leader plan approval 流程 (单机产品不需要)
- plan 文件持久化 (getPlanFilePath / writeFile)
- auto-mode classifier 集成 (TriLC 无 auto-mode)
- plan verification hook (CC 特有)
- transcript classifier 特征门 (CC 特有)

**架构决策**: **B级 — 做简化版**。
- Core: permissionMode toggle + tool restriction mask + system prompt injection
- 跳过: team approval, plan files, auto-mode classifier integration
- 成本: 2 个新工具文件 + useChat/agentLoop 状态扩展 + tool 限制逻辑。~200-300 行

**移植级别**: B (需铺基础设施但范围可控)

---

### 5. /branch (conversation fork)

**CC 源码**: `commands/branch/branch.ts` (297 行) + `commands/branch/index.ts` (15 行)
- `/branch` 是 conversation session fork (不是 git branch——之前理解有误)
- 创建 fork: 从当前 transcript JSONL 复制所有消息到新 session UUID 的 transcript 文件
- 保留原始 metadata (timestamps, gitBranch 等) + 添加 forkedFrom tracing
- 自定义标题 (collision 检测) + 自动 resume 进入 fork
- 纯文件系统操作: readFile → 解析 JSONL → 重写 sessionId → writeFile → resume

**不是 git worktree**: CC 的 `/branch` 不创建 git worktree。它只是复制对话 transcript 到新 session。这是 session-level forking，不是 code-level branching。

**TriLC 现状**:
- `session-store/` 模块存在但需要检查是否支持 transcript 持久化到磁盘
- 当前 session 管理可能是内存-based
- 需要: session transcript 持久化 + session listing + session resume + fork 逻辑

**但 rewind 完全不同**:
- `commands/rewind/rewind.ts` (13 行) — 调用 `context.openMessageSelector()` 
- `context.openMessageSelector` 是 TUI 消息选择器组件——在 transcript 中选择一个点回到之前的对话状态
- 这个 TUI 组件在 CC 中是完整的 UI 功能 (消息列表滚动/选择/确认)
- TriLC 没有这个消息选择器 TUI 组件，建造它是另一个 sprints 的工作量

**架构决策**:
- `/branch`: **B级 — 做**。前提条件是 TriLC 需要有 JSONL-based session transcript 持久化。如果没有，这是前提基础设施。fork 逻辑本身是纯 FS 操作 (~250 行可移植)。
- `/rewind`: **C级 → 建议砍**。`openMessageSelector()` 是一个完整的 TUI 组件。没有它，rewind 命令是一个无实现的壳。建造消息选择器的成本远超 P6 范围。

**实施前提**: 先确认 TriLC 是否有 session transcript 持久化。若没有，需要先建 session transcript storage。

**移植级别**: /branch = B (需 session storage 基础设施), /rewind = C → CUT

---

### 5b. /rewind — 独立评估 + 砍的建议

**CC 源码**: `commands/rewind/rewind.ts` (13 行核心逻辑) + `commands/rewind/index.ts` (13 行命令注册)
- 核心调用: `context.openMessageSelector()`
- openMessageSelector 是 TUI 第一类组件: 显示 transcript 消息列表, 支持键盘导航, 用户选择恢复点
- CC 中 openMessageSelector 的实现依赖: Ink React 组件 + transcript React state + 自定义 UI 渲染
- rewind 的"恢复"不只是对话恢复——还涉及 git 状态恢复 (file snapshots/diffs)

**TriLC 缺失**:
1. 消息选择器 TUI 组件 (重大 UI 开发)
2. Transcript 持久化和检索
3. Git 状态恢复基础设施

**建议**: **CUT**。这三个缺失项每一个都是独立的功能。消息选择器组件是另一个 mini-project。在 P6 时间约束下不值得。

---

### 6. /review

**CC 源码**: `commands/review.ts` (58 行)
- `type: 'prompt'` 命令 — 一个纯 prompt 模板
- 提示模型: 运行 `gh pr list` → `gh pr view <number>` → `gh pr diff <number>` → 分析 diff → 输出代码审查
- 无特殊工具、无内部依赖、无 UI 组件
- 唯一"依赖"是 `gh` CLI 已在用户机器上 (模型通过 shell 工具调用)

**TriLC 现状**: 已有 AI 对话 + shell 工具。添加 prompt 命令的基础设施已存在。

**架构决策**: **A级复制 — 做**。一行命令定义 + 一个 prompt 模板。~30 行代码。最简单的项。

**移植方式**: 直接复制 CC 的 LOCAL_REVIEW_PROMPT 模板，用 TriLC 的命令注册机制注册 `/review` 命令。无需任何基础设施变更。

**移植级别**: A (零依赖，直接复制)

---

### 7. 完整权限持久化

**CC 机制**: `settings.json` 中 `permissions.allow` 数组
```json
{
  "permissions": {
    "allow": [
      { "toolName": "Bash", "matcher": "npm test", "behavior": "allow" },
      { "toolName": "Bash", "matcher": "git (push|pull)", "behavior": "allow" }
    ]
  }
}
```
- 仅当用户显式选择 "Always allow" 时才添加到 allow 列表
- Session 级 always-allow 在退出时丢失
- PermissionRule: `{ toolName: string, matcher: string (regex), behavior: 'allow' | 'deny' }`

**TriLC 现状**: Session 级 always-allow (P3 实现)。无持久化。

**CC 的 PermissionStore 概念** (scattered in `utils/permissions/`):
- `loadAllowRules()` — 从 settings.json 加载
- `saveAllowRule()` — 用户显式添加 → 写入 settings.json
- `removeAllowRule()` — 用户移除
- `matchPermissionRule()` — 检查 tool input 是否匹配已保存规则

**TriLC 实现方案**:
```
PermissionStore (TriLC, ~150-200 lines)
├── src/services/permissions/
│   ├── PermissionStore.ts     — load/save allow rules from trilc-settings.json
│   ├── PermissionRule.ts      — types: { toolName, matcher, behavior, createdAt }
│   └── integration with       — usePendingInteraction.ts / agent loop
│       existing permission check
├── Settings file: ~/.trilc/settings.json (or project-local .trilc/settings.json)
└── UI: "Always allow" 选项存入 PermissionStore
```

**命名**: CC 用 `permissions.allow`，TriLC 用顶级 `allowRules` 或同级结构，但语义一致。

**架构决策**: **A/B级 — 做**。概念是 A 级 (简单 JSON 读写)，但 TriLC 的 permission check pipeline 集成是 B 级 (需要追踪现有的 permission hook 机制)。~150-200 行。

**注意**: CC 的 allow 规则不是自动生成的——只有用户显式操作时才添加。TriLC 保持相同语义。

**移植级别**: A/B (概念简单，集成需要理解现有 permission pipeline)

---

### 8. Bundled-skills 补全

**CC 源码**: 20 个 bundled skills 在 `skills/bundled/`
- 注册: `bundledSkills.ts` (221 行)
- 初始化: `skills/bundled/index.ts` (79 行，initBundledSkills)

**TriLC 现状**: 3 个 skills (simplify, debug, remember) — 均已完成移植和适配

**逐 skill 评估**:

| CC Skill | 代码行数 | 类型 | 移植可行性 | 决策 |
|----------|---------|------|-----------|------|
| **claude-api** | 197 行 + 247KB 嵌入文档 | 纯 prompt + 静态文档文件 | **可做** (需要 bundle 文档内容) | **DO** — 高价值，核心 AI 开发技能 |
| **keybindings** | 340 行 | 引用 CC 内部 keybinding schema/constants | **需适配** — CC 特定 keybinding 枚举不适合 TriLC | **ADAPT** — 改写为 TriLC keybinding 参考 |
| **loremIpsum** | 283 行 | 纯文本生成 (ant-only gate) | **可做** (去掉 ant-only gate) | **DO (低优先级)** — 测试用 |
| **skillify** | 198 行 | 依赖 CC session memory API + message API | **不可做** — ANT-only + CC API 依赖 | **SKIP** |
| **verify** | 30 行 | 引用 CC plan mode 工具常量 | **不可做** — 依赖 plan mode (项目 #4) | **SKIP** (等到 plan mode 就位后再考虑) |
| **batch** | 125 行 | 依赖 Agent tool + plan mode + git worktree | **不可做** — 依赖 #4 + #5 + CC agent 基础设施 | **SKIP** |
| **stuck** | 79 行 | CC 专有诊断 (读取 CC debug 日志, 发 Slack) | **不可做** — TriLC 无等价 debug 日志 | **SKIP** |
| **dream** | ? (feature-gated) | KAIROS feature gate | **不可做** — internal CC feature | **SKIP** |
| **loop** | ? | AGENT_TRIGGERS feature gate | **不可做** — internal CC feature | **SKIP** |
| **scheduleRemoteAgents** | ? | AGENT_TRIGGERS_REMOTE gate | **不可做** — internal CC feature | **SKIP** |
| **hunter** | ? | REVIEW_ARTIFACT feature gate | **不可做** — internal CC feature | **SKIP** |
| **updateConfig** | ? | CC settings 专有 | **不可做** — CC 特定 | **SKIP** |
| **claudeInChrome** | ? | CC-in-chrome 功能 | **不可做** — CC 特定 | **SKIP** |
| **runSkillGenerator** | ? | RUN_SKILL_GENERATOR feature gate | **不可做** — internal CC feature | **SKIP** |

**待添加** (3-4 个新 skill):
1. **claude-api**: 最高价值，247KB 嵌入文档移植需要存为 TriLC 的静态资源文件。CC 用 lazy import 机制——TriLC 可类似。标记为文件型 bundled skill (`.files` 字段)。
2. **keybindings (adapted)**: 改写 CC 版本，去掉 CC-specific 的 keybinding schema/constants，替换为 TriLC 的键盘快捷键参考。可做纯 prompt skill（无嵌入文档）。
3. **loremIpsum**: 简单可做，但优先级最低（无 product 需求）。建议标记为可选。

**架构决策**: **A/B级 — 选择性添加 3 个新 skill**。
- claude-api: B级 (需要嵌入文档 bundle 基础设施)
- keybindings: A级 (纯 prompt, ~50 行适配)
- loremIpsum: A级 (纯代码, 直接复制)
- 全部其他 CC skills: 跳过 (内部功能、ANT-only、或 CC API 依赖)

**移植级别**: A/B (纯 prompt skills = A级; 有文件的 skills = B级需要文档提取基础设施)

---

## 实施顺序 (低依赖 → 中依赖 → 高依赖)

### Phase 1: 低依赖独立项 (先做, 快赢)

| 顺序 | 项目 | 级别 | 代码量 | 依赖 | 
|------|------|------|--------|------|
| 1 | `#6 /review` | A | ~30 行 | 无 |
| 2 | `#1 Alt+Y yank-pop` | A | ~20 行 | 无 |
| 3 | `#2 Vim line/file nav` | A | ~150 行 | 无 |

**理由**: 这三个零依赖，直接在现有 Cursor.ts 和 useCursorInput.ts 上添加。可在一个 session 内完成。验证快（运行时测试光标移动即可）。

### Phase 2: 中依赖项

| 顺序 | 项目 | 级别 | 代码量 | 依赖 |
|------|------|------|--------|------|
| 4 | `#7 权限持久化` | A/B | ~200 行 | 需要理解现有 permission pipeline |
| 5 | `#8 bundled-skills 补全` | A/B | ~300 行 | claude-api 需要文档 bundle 基础设施 |

**理由**: 权限持久化需要新文件 (PermissionStore)，但概念简单。bundled skills 的 claude-api 有 247KB 嵌入文档需要处理。

### Phase 3: 高依赖/需铺基础设施项

| 顺序 | 项目 | 级别 | 代码量 | 依赖 |
|------|------|------|--------|------|
| 6 | `#4 Plan mode` | B | ~300 行 | agent 状态机扩展 + 工具限制 |
| 7 | `#5 /branch` | B | ~250 行 | session transcript 持久化 (前提) |
| 8 | `#3 MCP 支持 (最小版)` | C | ~800 行 | `@modelcontextprotocol/sdk` + MCP 连接管理器 + tool 代理 |

**理由**: 这些需要新基础设施。Plan mode 和 /branch 各需 1 个前提条件。MCP 需要最多的新代码和外部依赖。

### 不做的项

| 项目 | 原因 |
|------|------|
| `#5b /rewind` | TUI 消息选择器组件 + git 状态恢复 → P6 成本>>价值。建议推到独立 feature phase。 |

---

## 风险与缓解

### 风险 1: MCP 基础设施膨胀
- **风险**: 初始"最小 MCP"设计在实现时可能演变为与 CC 同等复杂的系统
- **缓解**: 严格的 MVP gate — stdio+SSE only, 工具代理 only。所有 defer 项 (OAuth/resources/skill discovery) 标记为 P7+ feature flags。MCP 管理器代码上限 1000 行

### 风险 2: Plan mode 与 agent-core 的集成
- **风险**: agent-core (`@trimetaverse/agent-core`) 的 permission 机制可能不支持运行时 mode 切换
- **缓解**: 先做 agent-core capability audit (确认 permissionMode 是否支持运行时变更)。如果不支持，用 system prompt injection + tool filter 两层机制替代

### 风险 3: session transcript 存储未就绪
- **风险**: `/branch` 依赖 session transcript JSONL 存储。如果 TriLC 目前没有 transcript 到磁盘的持久化，必须先建这个
- **缓解**: 在做 /branch 之前先 audit session-store 模块。如果缺失，单独建 session transcript storage 作为 Phase 2.5 前提项

### 风险 4: claude-api skill 文档 bundle
- **风险**: 247KB 嵌入文档可能不适合 TriLC 的资源加载机制
- **缓解**: 用 CC 同款 lazy import 模式。文档作为静态 `.ts` 文件在首次使用时导入。如果太大，拆分为 per-language 文件

---

## 发布姿态

所有项实现后，必须通过以下门禁才能标记 P6 完成:

1. **tsc 零错误**: `npx tsc --noEmit` 通过
2. **运行时验证** (TestEngineer): 每个实现的项有实测结果
   - Alt+Y: 实测 kill ring 循环
   - Vim 导航: 实测 up/down/goToLine/endOfFile
   - MCP: 实测至少一个 stdio MCP server 连接和工具调用
   - Plan mode: 实测 EnterPlanMode → 工具限制 → ExitPlanMode 状态恢复
   - /branch: 实测 fork 创建 + resume
   - /review: 实测 prompt 生成
   - 权限: 实测持久 allow 规则跨 session 保留
3. **还原度报告**: 与 CC 行为对比（手动测试）。差异点记录在 code-state.md

---

## 使用依据

| 来源 | 路径 | 角色 |
|------|------|------|
| CEO 裁决 | W31 agent message | "全做"决策 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/utils/Cursor.ts` | #1 #2 源码事实 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/tools/MCPTool/` | #3 源码事实 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/services/mcp/client.ts` | #3 基础设施事实 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/tools/EnterPlanModeTool/` + `ExitPlanModeTool/` | #4 源码事实 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/commands/branch/branch.ts` | #5 源码事实 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/commands/rewind/rewind.ts` | #5b 源码事实 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/commands/review.ts` | #6 源码事实 |
| CC 源码 | `TriLC/vendor/claude-code-full/src/skills/bundled/` (全部 20 个) | #8 源码事实 |
| TriLC 源码 | `TriLC/src/tui/utils/Cursor.ts` | #1 #2 现有状态 |
| TriLC 源码 | `TriLC/src/tui/utils/MeasuredText.ts` | #1 #2 依赖验证 |
| TriLC 源码 | `TriLC/src/tui/hooks/useCursorInput.ts` | #1 #2 集成点 |
| TriLC 源码 | `TriLC/src/skills/bundled-skills.ts` | #8 现有状态 |
| TriLC 源码 | `TriLC/src/local-node/node.ts` | #4 agent loop 集成点 |
| 项目真源 | `TriCompany/docs/engineering/DESIGN.md` | 架构决策框架 |
| 模块真源 | `TriLC/docs/registry/code-state.md` | 还原度基线 |
| Tree OP | `tree-op-p6-remaining.json` | 任务定义 |

---

## 路由

本架构方案完成后:
- **路由到**: FullStackDeveloper (p6-remaining-2)
- **实现顺序**: 严格按 Phase 1 → 2 → 3
- **每个 phase 完成后**: TestEngineer 验证 (p6-remaining-3)
- **全部完成后**: CTO 终审 (p6-remaining-4)
- **如需讨论架构决策**: 升到 CEOChiefOfStaff
- **MCP 技术方案如有争议**: 与 CPO 对齐产品范围后再定

---

*CTO 小狄 | 2026-07-29 | TriCompany Engineering | p6-architecture-plan.md v1.0.0*
