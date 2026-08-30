# 官方 Agent SDK 文档快照（编排层 WebFetch 转录，供 E1/E2 子实例 Read）

- 取数时刻：2026-08-30T07:43Z（编排层 tick 20260830T074112Z 现场 WebFetch）
- 来源：`https://code.claude.com/docs/en/agent-sdk/overview`（overview 页全文要点转录）+ `https://code.claude.com/docs/en/agent-sdk/typescript`（TypeScript API 参考要点转录）
- 性质声明：本快照为 WebFetch 工具对官方文档的转录摘要（要点级，非字节级镜像）；子实例引用时应标注「转引自本快照」，如需逐字原文可由授权侧/后续节点复核原 URL。快照内容以取数时点页面为准。

## 一、SDK 定位与选型（overview 页）

- 官方定义：Agent SDK = 「把 Claude Code 的同一套工具、agent loop 与上下文管理做成可编程库」，运行在**你自己的进程内**，支持 Python 与 TypeScript。
- 官方选型表（逐字要点）：
  - 「Building an agent without implementing the tool loop yourself」→ **Agent SDK**（library，in your own process，Python/TypeScript）。
  - 「Doing interactive development or running one-off tasks from a terminal」→ **Claude Code CLI**。
  - 「Calling the API directly and implementing the tool loop yourself」→ **Client SDK**（直连 Anthropic API，自实现 tool loop）。
  - 「Running long-running or asynchronous agents without managing your own sandbox or session infrastructure」→ **Managed Agents**（hosted REST API，独立产品）。
- **关键边界（对 M 面评估最要紧）**：官方原文——「The SDK is available as a library for Python and TypeScript only. To drive the same agent loop from another language, run the CLI as a subprocess with the `-p` flag and `--output-format json`。」即：**非 Python/TS 宿主的官方推荐路径恰恰就是现 orchestrate_tick.py 在做的 CLI 子进程形态**。
- 能力面（Capabilities 表）：Built-in tools／Hooks／Subagents／MCP／Permissions／Sessions（「Maintain context across exchanges, resume or fork later」）／Skills, commands, and memory（自动从项目 `.claude/` 与 `~/.claude/` 加载）／Plugins。
- 认证边界（官方 Note，逐字要点）：「Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products…Use the API key authentication methods」——SDK 产品化输出须走 API key 认证，claude.ai 登录/限额未经批准不可对第三方提供。
- 许可：SDK 受 Anthropic Commercial Terms of Service 约束（商业条款，非开源许可）；品牌指引禁止把产品呈现为 "Claude Code"。
- Changelog 入口：TypeScript=`anthropics/claude-agent-sdk-typescript`（GitHub），Python=`anthropics/claude-agent-sdk-python`。

## 二、TypeScript API 面（typescript 页）

- 包名：`@anthropic-ai/claude-agent-sdk`。
- 核心入口：
  ```typescript
  function query({ prompt, options }: {
    prompt: string | AsyncIterable<SDKUserMessage>;
    options?: Options;
  }): Query;   // 返回 AsyncGenerator<SDKMessage, void>
  ```
- 流式输入：`prompt` 接受 `string | AsyncIterable<SDKUserMessage>`（双向流式）。
- Options 关键项（转录逐名）：
  - `systemPrompt: string | { type: 'preset'; preset: 'claude_code'; append?; excludeDynamicSections? }`
  - `allowedTools: string[]`（自动批准）／`disallowedTools: string[]`（裸名移除工具；scoped 规则如 `"Bash(rm *)"`）
  - `permissionMode: 'default' | 'bypassPermissions' | 'plan' | 'silent'`
  - `hooks: Partial<Record<HookEvent, HookCallbackMatcher[]>>`（SessionStart/Setup/SessionEnd/Notification/PreCompact/PostCompact 等）
  - `mcpServers: Record<string, McpServerConfig>`
  - 会话：`resume: string`／`forkSession: boolean`／`resumeSessionAt: string`（按消息 UUID 续跑）／`resumeDropsTurn`（v2.1.223+）／`persistSession: boolean`／`maxTurns: number`／`includePartialMessages: boolean`
  - 子代理：`agents: Record<string, AgentDefinition>`（name/instructions/description/systemPrompt/tools）
  - 执行环境：`cwd`／`settings`／`settingSources: SettingSource[]`／`executable: 'bun'|'deno'|'node'`／`additionalDirectories`／`env`
  - 预算与思考：`thinking: ThinkingConfig`（缺省 `{ type: 'adaptive' }`）／`taskBudget: { total: number }`／`maxBudgetUsd`／`effort: 'low'|'medium'|'high'|'xhigh'|'max'`
- 接收消息类型：`SDKSystemMessage`／`AssistantMessage`／`SDKUserMessage`／`SDKHookStartedMessage`／`SDKHookProgressMessage`／`SDKHookResponseMessage`／`StreamEvent`（partial message streaming events，细粒度流式）。
- 结构化输出：`outputFormat: { type: 'json_schema', schema: JSONSchema }`。
- **CLI 依赖形态（对迁移评估关键）**：TS SDK「No external `@anthropic-ai/claude-code` dependency required」——SDK 以 **optional dependency 形态捆绑 native Claude Code 二进制**；找不到二进制时报 `Native CLI binary for <platform>-<arch> not found`，解法=`pathToClaudeCodeExecutable` 指向独立安装的 `claude`，或 Bun 场景用 `extractFromBunfs()`。即：**SDK 并不消除对 Claude Code 运行时（native 二进制）的依赖，只是把子进程编排收进库内**。

## 三、与 M/R 两面评估直接相关的事实锚点

1. M 面宿主是 **Python**（orchestrate_tick.py）→ 若上 SDK 即用 Python SDK（`claude-agent-sdk` PyPI 包，同族 API）；官方对「其他语言」的指引=CLI 子进程（即现状形态）。
2. SDK 的本质收益=进程内 AsyncGenerator 消息流（`StreamEvent` partial streaming、结构化 `outputFormat`、`resume/forkSession`、hooks 回调）替代「stdout 重定向+JSON envelope 解析」；本质成本=引入 Anthropic 商业条款约束的闭源运行时依赖+Python/TS 宿主绑定。
3. R 面（TriRMC/TriRLC 线）的自研原则（tree-op notes：agent-core 不依赖任何单一宿主、为 dsh 稳定过渡做准备）与 SDK 的「Anthropic 运行时捆绑+商业条款」形态存在直接张力；SDK 亦不覆盖 R 面自有协议面（/v1/messages、权限引擎、工具注册——见 agent-core 源码）。
