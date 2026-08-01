# P8 Architecture — Plan TTL + MCP Prompts

**作者**: CTO 小狄
**日期**: 2026-07-29 (W31)
**状态**: APPROVE (两项均 SDK 就绪，最小改动落地)
**优先级**: P8
**关联模块**: TriLC
**关联节点**: tree-op-p8.json (cc-fidelity-p8)

---

## 范围确认

CEO 裁决 P8 三项（实际只需 CTO 评估前两项——第三项是 TestEngineer 端到端验证，不涉及架构决策）：

1. **Plan mode 自动超时 TTL** — 防止忘记 ExitPlanMode 导致永久只读
2. **MCP prompts 支持** — 补充 prompts/list + prompts/get

跳过：MCP OAuth（单机低频）。

---

## #1 Plan Mode 自动超时 TTL

### 当前状态 (P7)

| 项 | 文件 | 行号 | 状态 |
|---|---|---|---|
| planModeActive 标志 | `TriLC/src/tools/plan-mode.ts` | L19 | `let planModeActive = false` |
| isPlanModeActive() | 同上 | L21-23 | 读访问 |
| resetPlanMode() | 同上 | L25-27 | 仅清除标志，无 timer 管理 |
| EnterPlanMode handler | 同上 | L143-162 | 设 `planModeActive = true`，无 timer |
| ExitPlanMode handler | 同上 | L180-192 | 设 `planModeActive = false`，无 timer |
| P7 工具门禁 | `app.ts` | deps.checkToolPermission | 依赖 `isPlanModeActive()` → 永久生效直到进程重启 |

**问题**: P7 的 Plan mode 工具门禁生效后，如果用户（或 AI）忘记调用 ExitPlanMode，daemon 进程持续运行期间永久处于只读状态。进程重启才清除。

### SDK / 基础设施确认

- `planModeActive` 是单进程单线程 Node.js 模块级 boolean，无并发问题
- `resetPlanMode()` 已导出可供外部调用
- Node.js 内置 `setTimeout` / `clearTimeout` 即可实现 TTL

### 架构方案

**策略**: 在 `plan-mode.ts` 的 EnterPlanMode handler 中启 timer，ExitPlanMode handler 中清 timer。30 分钟 TTL。

```
EnterPlanMode handler:
  planModeActive = true
  clear any existing timer
  planModeTimer = setTimeout(() => {
    planModeActive = false
    planModeTimer = null
    // 通知已通过 planModeActive 状态变化 + 下次工具调用会被放行来感知
    // 也可额外 log warn 到 stderr
  }, 30 * 60 * 1000)

ExitPlanMode handler:
  clearTimeout(planModeTimer)
  planModeTimer = null
  planModeActive = false

resetPlanMode():
  clearTimeout(planModeTimer)
  planModeTimer = null
  planModeActive = false
```

**30 分钟选择的理由**:
- Claude Code 的 Plan mode 不会自动退出（无 TTL），但 Claude Code 每次对话是新进程——TTL 自然由对话时长决定
- TriLC 是 daemon 长进程，需要人工 TTL
- 30 分钟足够 AI 做完整探索 + 输出计划；过长则失去 TTL 意义
- 可在未来通过环境变量或配置覆盖

#### 改动范围

```
仅 1 个文件:

TriLC/src/tools/plan-mode.ts
  + L19: let planModeTimer: ReturnType<typeof setTimeout> | null = null
  + L25-28: resetPlanMode() 增加 clearTimeout
  + L143-162: EnterPlanMode handler 增加 setTimeout
  + L180-192: ExitPlanMode handler 增加 clearTimeout

净增码量: ~12 行
agent-core 改动: 0
```

#### 风险

| 风险 | 等级 | 缓解 |
|---|---|---|
| TTL 太短，大项目探索不完整 | LOW | 30 分钟足够绝大多数场景。未来可加环境变量 `PLAN_MODE_TTL_MINUTES` |
| Timer 在 daemon 重启后失效 | NONE | 设计要求如此——重启就是 clean slate |
| 并发 EnterPlanMode | NONE | 单进程 event loop，同一个 AI 对话流中不会并发调用 |

### 决策

**APPROVE** — ~12 行改动，Node.js 内置能力，零依赖。

---

## #2 MCP Prompts 支持

### 当前状态 (P7)

| 能力 | 状态 |
|---|---|
| MCP tools (list/call) | P6 已完成 |
| MCP resources (list/read) | P7 已完成 |
| MCP prompts (list/get) | **未实现** |

### MCP SDK 能力确认

SDK 版本: `@modelcontextprotocol/sdk` (随参考 claude-code 2.1.88 版本)

`Client` class (`dist/esm/client/index.d.ts`) 已有完整 prompts API:

```typescript
// Line 292 — 列出所有 prompts
listPrompts(params?: ListPromptsRequest['params'], options?): Promise<{
  prompts: {
    name: string;
    description?: string;
    arguments?: { name: string; description?: string; required?: boolean }[];
    _meta?: { ... };
    icons?: { ... }[];
    title?: string;
  }[];
  nextCursor?: string;
}>

// Line 207 — 获取 prompt 消息
getPrompt(params: GetPromptRequest['params'], options?): Promise<{
  messages: {
    role: "user" | "assistant";
    content: TextContent | ImageContent | AudioContent | ResourceContent;
  }[];
  description?: string;
}>
```

确认: SDK 完全支持，API 签名与 `listTools`/`callTool` 和 `listResources`/`readResource` 模式一致。

### 架构方案

**策略**: 完全镜像 P7 resources 实现。在 `mcp-client.ts` 中追加 prompts 发现和代理，在 `mcp-tool.ts` 中追加 `mcp__prompts` 子命令。

不需要新工具注册——复用现有 `MCPTool`，通过 `serverName` 区分。

#### 设计

```
MCPTool handler 新增 serverName === 'mcp__prompts':

  toolName === 'list':
    → mcpManager.listAllPrompts() → JSON { servers, promptCount, promptsByServer }
  
  toolName === 'get':
    → 从 args 中取 promptName (也可选 promptArgs)
    → 查找 prompt 所属 server
    → mcpManager.getPrompt(serverName, promptName, promptArgs) → JSON { messages }
```

#### 改动范围

```
2 个文件:

1. TriLC/src/mcp/mcp-client.ts (~35 行)
   + MCPPromptDef 接口 (镜像 MCPResourceDef)
   + MCPConnection.prompts: MCPPromptDef[]
   + connectOne(): try/catch client.listPrompts() (镜像 resources)
   + listAllPrompts(): MCPPromptDef[]
   + getPrompt(serverName, name, args): Promise<string>
   + totalPromptCount(): number

2. TriLC/src/tools/mcp-tool.ts (~20 行)
   + MCPTool handler: serverName === 'mcp__prompts' → list / get 子命令
   + 更新 MCPTool description 提及 prompts 能力

净增码量: ~55 行
agent-core 改动: 0
```

#### 数据流

```
MCP Server (e.g. filesystem with prompts configured)
  → initialize → capabilities.prompts = { listChanged: true/false }
  → prompts/list → [{ name: "summarize", description: "...", arguments: [...] }]
  → prompts/get { name: "summarize", arguments: { file: "README.md" } }
    → { messages: [{ role: "user", content: { type: "text", text: "..." } }] }

McpClientManager.connectOne()
  → client.listTools()        // P6
  → client.listResources()    // P7
  → client.listPrompts()      // P8 新增 → MCPPromptDef[]

AI 调用:
  { serverName: "mcp__prompts", toolName: "list", arguments: {} }
  → 返回所有 prompts

  { serverName: "mcp__prompts", toolName: "get", arguments: { name: "summarize", args: { file: "..." } } }
  → 返回 prompt 消息 content
```

#### 与 P7 resources 的对比

| 维度 | Resources (P7) | Prompts (P8) |
|---|---|---|
| SDK API | `listResources` + `readResource` | `listPrompts` + `getPrompt` |
| 代理模式 | MCPTool serverName=`mcp__resources` | MCPTool serverName=`mcp__prompts` |
| 子命令 | list / read | list / get |
| 降级策略 | try/catch，不支持时 warn | try/catch，不支持时 warn |
| 返回格式 | text/JSON | messages (role+content) → JSON |
| 代码量 | ~60 行 | ~55 行 |

#### 风险

| 风险 | 等级 | 缓解 |
|---|---|---|
| Server 不支持 prompts → connectOne 中抛异常 | LOW | try/catch 包裹，不支持时降级为空列表 + warn |
| Prompt arguments 需要用户交互 | LOW | 透传 args，AI 自行填充。复杂交互场景留到后续 |
| getPrompt 返回 messages 过大 | LOW | 与 resources read 一致——透传结果不做截断。未来统一加 size limit |
| 与 resources 命名约定冲突 | NONE | `mcp__prompts` vs `mcp__resources` 完全正交 |

### 决策

**APPROVE** — SDK 已就绪，模式镜像 P7 resources:
- 2 个文件改动，净增 ~55 行
- 复用已有 MCPTool 注册和 McpClientManager 连接管理
- 零新依赖

---

## 交付计划

### 实现顺序

```
Phase 1: Plan TTL (FullStackDeveloper)
  └── plan-mode.ts: timer 管理 ~12 行

Phase 2: MCP Prompts (FullStackDeveloper)
  ├── mcp-client.ts: MCPPromptDef + listPrompts + getPrompt ~35 行
  └── mcp-tool.ts: mcp__prompts handler ~20 行

Phase 3: 验证 (TestEngineer)
  ├── Plan TTL: EnterPlanMode → 等 N 分钟 → auto-exit
  ├── MCP prompts: connect → list → get
  └── MCP 端到端: filesystem server → tools+resources+prompts 全链路

Phase 4: CTO 终审
```

### 质量门禁

| 门禁 | Phase |
|---|---|
| `tsc --noEmit` 零错误 | Phase 1 + 2 |
| Plan TTL: EnterPlanMode 后超时自动 exit | Phase 3 |
| Plan TTL: ExitPlanMode 前 timer 被清除 | Phase 3 |
| Plan TTL: 超时后工具写操作恢复可用 | Phase 3 |
| MCP prompts: list 返回非空数组 | Phase 3 |
| MCP prompts: get 返回 messages 文本 | Phase 3 |
| MCP 端到端: tools + resources + prompts 全通 | Phase 3 |

---

## 使用依据

| 依据 | 路径 |
|---|---|
| CEO 裁决范围 | `tree-op-p8.json` node p8-0 |
| Plan mode 当前实现 | `TriLC/src/tools/plan-mode.ts` |
| MCP Client Manager 当前实现 | `TriLC/src/mcp/mcp-client.ts` |
| MCP Tool 当前实现 | `TriLC/src/tools/mcp-tool.ts` |
| MCP SDK Client class (prompts API) | `@modelcontextprotocol/sdk dist/esm/client/index.d.ts:207,292` |
| P7 resources 参照模式 | `p7-architecture.md` #2 MCP Resources |
