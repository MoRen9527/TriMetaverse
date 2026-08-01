# P7 Architecture — Plan 工具门禁强制化 + MCP Resources

**作者**: CTO 小狄
**日期**: 2026-07-29 (W31)
**状态**: APPROVE (架构可行，最小改动落地)
**优先级**: P7
**关联模块**: TriLC
**关联节点**: tree-op-p7.json (cc-fidelity-p7)

---

## 范围确认

CEO 裁决 P7 聚焦两项高价值改进：

1. **Plan mode 完整工具门禁** — 从 prompt 建议升级为 agent 级工具白名单强制
2. **MCP resources 支持** — 最小补充 resources/list + resources/read

跳过：MCP OAuth（单机低频）、端到端 MCP 测试（需外部 server）。

---

## #1 Plan Mode 完整工具门禁

### 当前状态 (P6)

| 层 | 文件 | 状态 |
|---|---|---|
| Plan mode 标志 | `TriLC/src/tools/plan-mode.ts:19-23` | `planModeActive` 模块级 boolean，EnterPlanMode 设 true，ExitPlanMode 设 false |
| Prompt 注入 | `plan-mode.ts:119-131` | EnterPlanMode 返回 JSON 含 `"DO NOT write or edit any files yet"` 文本 |
| Agent loop 工具执行 | `agent-core/src/loop.ts:462-558` | 两层门禁：permissionEngine.decide() (L476) + deps.checkToolPermission() (L524) |
| 实际拦截 | 无 | AI 可以忽略 prompt 指令直接调用 Bash/Edit/Write |

**结论**：P6 的 Plan mode 是纯 advisory（建议性）的——标志存在，但没有任何机制在工具执行前检查它。

### 现有门禁基础设施分析

agent-core 的 `loop.ts` 在工具执行前有两条门禁路径：

```typescript
// [路径1] Line 476 — permissionEngine (P3)
const engineDecision = permissionEngine.decide(tc.function.name, args);
if (!engineDecision.allowed) { /* yield tool_blocked, continue */ }

// [路径2] Line 524 — deps.checkToolPermission (dep injection)
if (deps.checkToolPermission) {
    const tierPermission = deps.checkToolPermission(tc.function.name, tier, options.toolSpecs);
    if (!tierPermission.allowed) { /* yield tool_blocked, continue */ }
}

// [路径3] Line 542 — 实际执行
const resultContent = await executeTool(tc.function.name, args);
```

关键事实：

- **`canUseTool()` / `filterToolsForTier()`** (`permissions.ts:93-112`) — 静态 tier 映射 (main/subagent/coordinator)，不适用于运行时 Plan mode 动态白名单。
- **`deps.checkToolPermission`** (`loop.ts:94`) 是 agent-core 预留的依赖注入点，签名为 `(toolName, tier, toolSpecs?) => { allowed, reason? }`，当前 TriLC 的 `app.ts` **未使用此回调**（3 个 `loopOptions` 构造点均无 `deps` 字段）。
- **`deps.checkToolPermission`** 在 permissionEngine 通过后才调用，恰好用作"permission engine 放行后的额外限制层"。

### canUseTool/filterToolsForTier 能否被 Plan mode 直接复用？

**结论：不能直接复用，但可以共享设计模式。**

| 特性 | canUseTool/filterToolsForTier | Plan mode 需求 |
|---|---|---|
| 判定维度 | tier 级别 (main/subagent/coordinator) | boolean 标志 (planModeActive) |
| 映射表 | 静态 `TOOL_TIER_ALLOWLIST` | 运行时动态白名单 |
| 应用时机 | loop 启动时过滤工具定义 (`getToolDefinitions(tier)`) | 每次工具执行前检查 |
| 逻辑 | 级别比较 (`required <= current`) | 白名单成员判断 |

`filterToolsForTier` 不合适，因为 Plan mode 不应该在 loop 启动时就过滤掉工具定义（模型应该仍然"看到" Write/Edit 等工具，否则会破坏 tool-calling 兼容性）。Plan mode 应该在执行时拦截。

### 架构方案

**策略**: 使用 `AgentLoopDeps.checkToolPermission` 作为 Plan mode 守卫的注入点。

这是最小改动方案——对 agent-core 零改动，仅在 TriLC 的 `app.ts` 中注入一个 `deps.checkToolPermission` 回调。

#### Plan mode 工具白名单

```
┌──────────────────────────────────────────────────────────────┐
│ Read, Glob, Grep, LS       ← 文件读取族 (P7允许)             │
│ ExitPlanMode               ← 退出Plan mode (P7允许)          │
│ EnterPlanMode              ← 幂等进入 (P7允许)               │
│ TaskCreate, TaskUpdate,     ← 任务规划工具 (P7允许)           │
│   TaskList, TodoWrite                                      │
│ AskUserQuestion            ← 用户交互 (P7允许)               │
│ SkillTool                  ← 技能调用 (P7允许)               │
│ SendMessage                ← 队友沟通 (P7允许)               │
│ AgentTool                  ← 子agent探索 (P7允许)            │
│ MCPTool                    ← MCP读操作 (P7允许)              │
├──────────────────────────────────────────────────────────────┤
│ Write, Edit                ← 文件写入 (PLAN MODE 拦截)       │
│ Bash / shell_exec          ← Shell执行 (PLAN MODE 拦截)      │
│ (未来新增的危险工具)        ← 默认拦截 (安全优先)             │
└──────────────────────────────────────────────────────────────┘
```

白名单设计原则：
- **安全优先**：不在白名单的工具默认拦截（而非默认放行）
- **探索友好**：允许 Read/Glob/Grep/LS + 子agent + 任务管理 + MCP 读操作

#### 改动文件清单

```
改动文件（共3个文件, agent-core 零改动）:

1. TriLC/src/tools/plan-mode.ts
   - 导出 PLAN_MODE_WHITELIST: Set<string>
   - 导出 isPlanModeActive() 已存在 (L21)
   - 无需新增函数，白名单常量即可

2. TriLC/src/server/app.ts
   - 在 3 个 loopOptions 构造点 (L820, L1085, L1206) 注入 deps.checkToolPermission
   - 回调逻辑：if (isPlanModeActive() && !PLAN_MODE_WHITELIST.has(toolName)) → blocked
   - 提取为公共函数避免三处重复（如 buildPlanModeToolPermissionCheck）

3. TriLC/src/index.ts
   - 确保 plan-mode.ts 在 app.ts 启动前已 import（当前 L86 已是动态 import）
   - 无额外改动（已在 P6 完成 plan-mode 注册）
```

#### 关键代码流

```
用户请求 → app.ts 创建 AgentLoopOptions
  → deps: {
      checkToolPermission: (toolName, tier, toolSpecs) => {
        // Step 1: 检查 tier 权限（agent-core canUseTool 复用）
        const tierResult = canUseTool(toolName, tier);
        if (!tierResult.allowed) return tierResult;
        
        // Step 2: Plan mode 白名单检查（新增）
        if (isPlanModeActive() && !PLAN_MODE_WHITELIST.has(toolName)) {
          return {
            allowed: false,
            reason: `Plan mode active: tool "${toolName}" is blocked. Only read/plan tools allowed. Use ExitPlanMode to resume full capabilities.`
          };
        }
        
        return { allowed: true };
      }
    }
  → agentLoop(options)
    → streamChat() → model 返回 tool_calls
    → for each tool_call:
        → permissionEngine.decide()         // P3 权限引擎
        → deps.checkToolPermission()        // Plan mode 守卫 ← 新增
        → executeTool()                     // 实际执行
```

调用链：
```
EnterPlanMode handler (plan-mode.ts L112)
  → planModeActive = true
  → 后续所有 tool_call 经过 agentLoop L524 deps.checkToolPermission
  → 非白名单工具被拦截 → yield tool_blocked (L527-539)
  
ExitPlanMode handler (plan-mode.ts L149)
  → planModeActive = false
  → deps.checkToolPermission 不再拦截 → 恢复正常
```

#### 风险与缓解

| 风险 | 等级 | 缓解 |
|---|---|---|
| **忘记 ExitPlanMode 导致永久只读** | LOW | 单 process 生命周期内有效，进程重启自动清除。`resetPlanMode()` 已导出可供外部清理。可选：加 TTL（如 30min 自动过期），但 P7 不做——保持简单，等实测反馈。 |
| **全局标志线程安全** | NONE | TriLC 单进程单用户 Node.js event loop，无并发工具执行。`planModeActive` 是普通 boolean，读写均为同步操作，无竞态。 |
| **tool_blocked 事件能否被客户端正确理解** | LOW | `tool_blocked` 事件类型已在 agent-core `AgentEvent` 定义 (loop.ts:157)，已在 permission engine blocked 路径使用 (L488-498, L506-519)，格式一致。 |
| **Plan mode 中 TaskCreate 等工具是否应允许** | LOW | 规划阶段应允许创建/更新任务。若后续发现任务工具被滥用，可缩小白名单。 |
| **AgentTool 在 Plan mode 中的递归风险** | LOW | AgentTool 启动子 agent 时传自己的 tier（通常是 subagent），子 agent 的 loop 也会经过同一个 `checkToolPermission` → Plan mode 守卫在子 agent loop 中继续生效。 |

### 决策

**APPROVE** — 最小改动方案：
- agent-core 零改动
- 3 个 TriLC 文件，净增码量 ~40 行
- 复用已有 `deps.checkToolPermission` 注入点 + `tool_blocked` 事件类型
- 不引入新依赖

---

## #2 MCP Resources 支持

### 当前状态 (P6)

| 能力 | 文件 | 状态 |
|---|---|---|
| MCP 连接管理 | `TriLC/src/mcp/mcp-client.ts` | `McpClientManager` 类，支持 stdio + SSE transport |
| Tools 发现 | `mcp-client.ts:104` | `client.listTools()` → `MCPToolDef[]` |
| Tools 调用 | `mcp-client.ts:153-181` | `client.callTool()` → 文本结果 |
| MCPTool 注册 | `TriLC/src/tools/mcp-tool.ts` | 单个 `MCPTool`，通过 `serverName` 区分操作 |

当前 `McpClientManager.connectOne()` (`mcp-client.ts:75-118`) 只调用 `client.listTools()`，未调用 `client.listResources()`。

### MCP SDK 能力确认

SDK 版本：`@modelcontextprotocol/sdk@1.30.0`

`Client` 类 (`dist/esm/client/index.js`) 已有完整 resources API：

```typescript
// Line 459
async listResources(params?, options?): Promise<ListResourcesResult>
// Line 462  
async listResourceTemplates(params?, options?): Promise<ListResourceTemplatesResult>
// Line 465
async readResource(params, options?): Promise<ReadResourceResult>
```

关键注意点：
- `listResources` 和 `readResource` 内部会调用 `assertCapabilityForMethod()` (L349-360)，会检查 server 的 `capabilities.resources` 字段
- 如果 server 不支持 resources 能力，调用会 throw Error（不是静默失败）
- 需要在 connect 时检查 server capabilities 决定是否暴露 resources 功能

### 架构方案

**策略**: 扩展 `McpClientManager` + 扩展 `mcp-tool.ts`，遵循 P6 已有的命名约定和代理模式。

#### 改动文件清单

```
1. TriLC/src/mcp/mcp-client.ts
   + MCPResourceDef 接口（mirror MCPToolDef）
   + McpClientManager.listAllResources(): MCPResourceDef[]
   + McpClientManager.readResource(serverName, uri): Promise<string>
   + McpClientManager.getResourceServerNames(): string[]
   + McpClientManager.totalResourceCount(): number
   - connectOne() 中追加 client.listResources() 调用

2. TriLC/src/tools/mcp-tool.ts
   + 扩展 MCPTool handler:
     serverName === 'mcp__resources' → 列出所有 resources（按 server 分组）
     serverName === 'mcp__resources__read' → 读取指定 resource（需 toolName=uri）
   + 无需新注册独立 tool（复用已有 MCPTool）
```

#### 数据流

```
MCP Server (e.g. filesystem)
  → initialize → capabilities.resources = { ... }
  → resources/list → [{ uri: "file:///...", name: "...", mimeType: "..." }]
  → resources/read { uri: "file:///..." } → [{ type: "text", text: "..." }]

McpClientManager.connectOne()
  → client.listTools()     // P6 已有
  → client.listResources() // P7 新增 → MCPResourceDef[]
  
AI 调用 MCPTool:
  { serverName: "mcp__resources", toolName: "list", arguments: {} }
  → mcpManager.listAllResources() → JSON
  
  { serverName: "mcp__resources__read", toolName: "file:///...", arguments: {} }
  → mcpManager.readResource("mcp__resources__read", "file:///...") → text/JSON
```

Wait — re-examining MCPTool 的命名约定。当前约定是 `mcp__{serverName}__{toolName}`。对于 resources，没有"server-level"的概念（一个 server 可能有多个 resources），所以可以使用：

- `serverName: "mcp__resources"` → 列出所有 server 的 resources
- `serverName: "mcp__resources__<serverName>"` → 读取特定 server 的指定 resource（toolName=uri）

实际上更简单的设计：

```
MCPTool (已有工具):
  serverName: "mcp__resources"    → 列出所有 resources
  serverName: "mcp__resources"    → toolName="read" + arguments.uri="..." → 读取
```

这样 `MCPTool` 的 handler 中检测 `serverName === 'mcp__resources'` 时走 resource 逻辑。

#### 成本评估

| 维度 | 评估 |
|---|---|
| 新增代码量 | ~60 行（mcp-client.ts ~40 行 + mcp-tool.ts ~20 行） |
| agent-core 改动 | 0 |
| 新依赖 | 0（SDK 已有 API） |
| tsc 影响 | 无 breaking change，类型安全 |
| 测试需求 | 需要至少一个支持 resources 的 MCP server（如 filesystem）做集成验证 |
| 风险 | LOW — SDK API 稳定，纯代理模式，只读操作 |

#### 风险

| 风险 | 等级 | 缓解 |
|---|---|---|
| Server 不支持 resources → connectOne 中 listResources 抛异常 | MEDIUM | `connectOne()` 中 try/catch 包裹 `listResources()`，不支持时降级为空列表 + warn 日志，不阻断 tools 功能 |
| Resource URI 格式不统一 | LOW | 透传 server 返回的 URI，不做转换 |
| Resource 内容过大 | MEDIUM | 与 `callTool` 一致，结果转为文本字符串。大文件可能撑爆 context。建议在 readResource 中截断超大结果（如 > 100KB），未来可加参数控制。P7 先做基础功能，不引入复杂限制。 |

### 决策

**APPROVE** — 最小补充：
- 2 个文件改动，净增码量 ~60 行
- 复用已有 `MCPTool` 注册和 `McpClientManager` 的连接管理
- SDK API 已就绪，纯代理模式

---

## 交付计划

### 实现顺序

```
Phase 1: Plan 工具门禁 (FullStackDeveloper)
  ├── Step 1.1: plan-mode.ts — 导出 PLAN_MODE_WHITELIST
  ├── Step 1.2: app.ts — 提取 buildPlanModeToolPermissionCheck()
  ├── Step 1.3: app.ts — 3 个 loopOptions 构造点注入 deps.checkToolPermission
  └── Step 1.4: tsc --noEmit 验证零错误

Phase 2: MCP Resources (FullStackDeveloper)
  ├── Step 2.1: mcp-client.ts — 新增 listResources/readResource/resourceCount
  ├── Step 2.2: mcp-client.ts — connectOne 中追加 listResources 调用
  ├── Step 2.3: mcp-tool.ts — 扩展 handler 支持资源子命令
  └── Step 2.4: tsc --noEmit 验证零错误

Phase 3: 验证打假 (TestEngineer)
  ├── Plan 门禁实测: EnterPlanMode → Bash 被拒 → ExitPlanMode → Bash 恢复
  └── MCP resources 实测: 连接 filesystem server → list → read

Phase 4: CTO 终审 (ChiefTechnologyOfficer)
  └── 架构合规 + 还原度评估
```

### 质量门禁

| 门禁 | Phase |
|---|---|
| `tsc --noEmit` 零错误 | Phase 1 + 2 |
| Plan mode 实测：EnterPlanMode 后 Bash/Edit/Write 被拒绝 | Phase 3 |
| Plan mode 实测：ExitPlanMode 后恢复 | Phase 3 |
| MCP resources：list 返回非空数组 + read 返回文本内容 | Phase 3 |
| 回归：非 Plan mode 下所有工具正常 | Phase 3 |

---

## 使用依据

| 依据 | 路径 |
|---|---|
| CEO 裁决范围 | `tree-op-p7.json` node p7-0 |
| agent-core loop 工具执行流 | `TriMC/packages/agent-core/src/loop.ts:462-558` |
| agent-core canUseTool/filterToolsForTier | `TriMC/packages/agent-core/src/permissions.ts:77-112` |
| Plan mode 当前实现 | `TriLC/src/tools/plan-mode.ts` |
| MCP Client Manager 当前实现 | `TriLC/src/mcp/mcp-client.ts` |
| MCP Tool 当前实现 | `TriLC/src/tools/mcp-tool.ts` |
| MCP SDK Client class (resources API) | `@modelcontextprotocol/sdk@1.30.0 dist/esm/client/index.js:459-472` |
| TriLC loopOptions 构造点 | `TriLC/src/server/app.ts` L820, L1085, L1206 |
| agent-core deps.checkToolPermission 注入点 | `TriMC/packages/agent-core/src/loop.ts:94,524` |
| tool_blocked 事件类型 | `TriMC/packages/agent-core/src/loop.ts:157` |
