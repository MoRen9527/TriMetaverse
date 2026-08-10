# Claude Code 吸收遵循度审计 — CPO 产品审计

审计人：CPO 小乔
日期：2026-07-24
来源：CEO 指令 "原样复制 Claude Code 2.1.88，不臆想"
裁决类型：`APPROVE`（产品事实齐全，偏差已定，需纠正）

---

## 一、核查摘要

| 核查项 | 结论 |
|--------|------|
| 模块归属 | 不变：TriLC 附属 CLI 扩展 |
| 原 CPO 评审 | 7/24 批准 P0 五组件 + vendor Ink 方案 |
| 实际实现 | 纯 readline，零 Ink，零组件，`components/` 目录为空 |
| CEO 新标准 | "尽量复制 2.1.88 源码" — 从"择优吸收"升级为"原样复制" |
| 产品定位 | Anthropic `/v1/messages` 主路径强制，OpenAI 仅兼容 |

---

## 二、Claude Code 2.1.88 完整组件清单 vs 我们实现了什么

### CC 组件总览（~120 个 TSX 文件）

| 分类 | CC 组件 | 数量 | 我们当前 |
|------|---------|------|---------|
| **消息系统** | Messages, MessageRow, MessageResponse, Message, MessageModel, MessageTimestamp, VirtualMessageList, StreamingMarkdown, MarkdownTable, ResumeTask | ~12 | **0** |
| **输入系统** | PromptInput 家族（PromptInput, PromptInputFooter, FooterLeftSide, FooterSuggestions, HelpMenu, ModeIndicator, QueuedCommands, StashNotice, ShimmeredInput, VoiceIndicator, HistorySearchInput） | ~21 | **0** |
| **工具调用** | ToolUseLoader, FallbackToolUseErrorMessage, FallbackToolUseRejectedMessage, FileEditToolDiff, FileEditToolUpdatedMessage, FileEditToolUseRejectedMessage | ~6 | **0** （`app.ts` 有 4 行文本替代） |
| **权限系统** | Permissions 系列（含 PermissionRequest, BypassPermissionsModeDialog, MCPServerApprovalDialog 等） | ~10 | **0** |
| **状态指示** | Spinner, Stats, TokenWarning, StatusLine, StatusNotices, MemoryUsageIndicator, AgentProgressLine | ~7 | **0** |
| **CC 专属** | 引导/IDE/自动更新/MCP/Teams/Agents/Skills/Teleport 等 | ~50 | N/A（明确排除） |
| **辅助 UI** | 搜索/设置/主题/快捷键提示/反馈等 | ~15 | **0** |

### 差距结论

**我们当前实现了：0 个 Claude Code 组件。**

`app.ts` 的全部 UI 代码 = 143 行，包含：
- 7 条正则 Markdown 渲染（替代 `StreamingMarkdown.tsx`）
- 硬编码 ANSI 颜色常量（替代 `design-system/` 主题系统）
- 内联 `renderDelta()` 函数（替代 `Messages.tsx` + `MessageRow.tsx` + `MessageResponse.tsx` 总计 ~1000+ 行）
- 一行 `[tool] name status` 文本（替代 `ToolUseLoader.tsx`）

这不是"简化的 TUI"，这是**完全不同的产品**。

---

## 三、MVP 重新定义：原样复制标准

基于 CEO "尽量复制 2.1.88 源码"标准，P0 必须从 5 组件扩展到以下核心组：

### 🔴 P0 — 必须原样复制（14 组件族）

| 组件族 | CC 对应源码 | 理由 |
|--------|------------|------|
| **Ink 渲染引擎** | `src/ink/` (~80 文件) | TUI 的物理基础，不可替换 |
| **App 根组件** | `components/App.tsx` | Provider 顶层（FpsMetrics + Stats + AppState） |
| **Messages 容器** | `components/Messages.tsx` | 消息列表核心容器 |
| **MessageRow** | `components/MessageRow.tsx` | 消息行渲染分发 |
| **MessageResponse** | `components/MessageResponse.tsx` | 助手回复包装 |
| **StreamingMarkdown** | `components/Markdown.tsx` | 流式终端 Markdown |
| **VirtualMessageList** | `components/VirtualMessageList.tsx` | 长对话性能 |
| **PromptInput** | `components/PromptInput/PromptInput.tsx` | 输入框核心 |
| **TextInput 基类** | `components/TextInput.tsx` | 输入基类 |
| **Spinner** | `components/Spinner/Spinner.tsx` | thinking 动画 |
| **ToolUseLoader** | `components/ToolUseLoader.tsx` | 工具调用 UI |
| **design-system** | `components/design-system/` | 主题/颜色/排版 |
| **Session 管理** | session 持久化 + recovery + 列表 | 对话连续性基础 |
| **Permission 询问** | `components/permissions/` 核心 | 安全基础 |

### 🟡 P1 — H2 追加（CC 原样但可裁剪精简）

| 组件族 | 可裁剪内容 |
|--------|-----------|
| FileEditToolDiff | CC 的 diff 展示（依赖 StructuredDiff），可裁为简化版 |
| MessageTimestamp | 消息时间戳（MVP 不必要） |
| TokenWarning | Token 统计（初期不展示） |
| ResumeTask | 任务恢复（需先有 session 基础） |

### ❌ 明确排除（CC 专属，TriLC 不需要）

完整列表见原 CTO 评审 Tier 3（`trilc-tui-cto-review.md` 第 150-172 行）：
Teams, MCP, Agents, Skills, AutoUpdater, Desktop*, IDE*, Onboarding, Feedback, Teleport*, Coordinator*, 等 — 全部排除。

---

## 四、Anthropic API 优先 vs OpenAI 兼容 — 产品定位

### 裁决：`APPROVE` — Anthropic `/v1/messages` 强制主路径

**理由：**

1. **Claude Code 原生协议 = Anthropic Messages API**。原样复制意味着 API 调用层也必须原样复制。Claude Code 的 message 类型系统（`content_block_start`/`content_block_delta`/`tool_use`/`tool_result`）是完整的 Claude 对话协议，不是简单的 "chat completion"。

2. **TriLC daemon 已就绪**。daemon line 677 起提供完整 `/v1/messages` 端点，含 SSE 流式、`system` prompt、`tools` 定义、`max_tokens` 等 Anthropic Messages API 核心字段。产品侧无阻塞。

3. **OpenAI `/chat/completions` 是降级兼容路径**。保留此端点仅供外部 OpenAI 生态客户端调用（如第三方工具），但 TriLC 自己的 TUI **必须**走 `/v1/messages`。

4. **SSE 事件格式不同**。Claude Code 的 Ink 组件（`MessageResponse`/`ToolUseLoader`/`StreamingMarkdown`）消费的是 Anthropic SSE 事件格式。如果继续用 OpenAI SSE 格式，这些组件需要大量适配——与"原样复制"目标矛盾。

### 产品定位声明

> **TriLC TUI 是 Claude Code CLI 体验的 TriMetaverse 本地化版本。**
> - 协议层：Anthropic `/v1/messages` 主路径（原样）
> - 渲染层：CC 自研 Ink 引擎（原样复制 vendor）
> - 组件层：CC Messages/PromptInput/ToolUseLoader 组件树（原样复制，CC 专属排除）
> - 兼容层：保留 `/chat/completions` 端点供外部客户端

---

## 五、当前纯 readline 实现的产品体验损失

| 体验维度 | CC 原版 | 当前 readline | 损失 |
|----------|---------|--------------|------|
| 流式渲染 | 增量 token → Markdown AST → 终端 ANSI diff → 帧渲染 | SSE token → 直接 stdout.write | 🔴 无格式 |
| 代码块 | 语法高亮 + 等宽 + 行号 | 无格式，原始文本 | 🔴 不可读 |
| Markdown | 完整表格/列表/粗体/引用/链接 | 7 条正则，仅覆盖 6 种语法 | 🔴 严重残缺 |
| 虚拟滚动 | diff/blit 增量渲染，1000+ 条流畅 | 全量重绘 | 🔴 长对话卡死 |
| 工具调用 | 展开面板（tool name + args + result + time） | `[tool] name ...` 一行 | 🔴 无法审查 |
| Thinking | 独立动画帧 + SpinnerGlyph | `[cancelled]` 仅取消提示 | 🔴 无等待反馈 |
| Permission | 交互式 y/n 询问 + canUseTool callback | 无 | 🔴 安全隐患 |
| Session | 恢复中断对话、历史浏览 | 无 | 🔴 崩溃即丢失 |
| 输入 | 多行编辑、粘贴处理、历史搜索 | 单行 readline | 🔴 严重受限 |

---

## 六、依赖与风险

| 依赖 | 状态 | 备注 |
|------|------|------|
| TriLC daemon `/v1/messages` | ✅ 就绪 | 含 SSE 流式 + tools 支持 |
| vendor Ink 引擎 | ✅ 就绪 | 156 文件，17 npm 依赖已安装 |
| Yoga 布局 | ✅ 就绪 | 烟雾测试通过 |
| CTO 技术设计 | ✅ 已产出 | 需按"原样复制"标准更新 |

| 风险 | 等级 | 缓解 |
|------|------|------|
| 重建组件树工时 | 🔴 高 | 优先直接复制 vendor，最小裁剪 |
| Ink 内存问题 | 🟡 中 | CTO 评估 + 裁剪 CC 专属路径 |
| 当前 readline 形成"已完成"假象 | 🔴 高 | 本审计明确标注为偏离，须废弃 |

---

## 七、产品裁决签署

| 裁决项 | 结果 |
|--------|------|
| MVP 范围 | P0 扩展至 14 组件族（Ink 引擎 + App + Messages 家族 + PromptInput 家族 + ToolUseLoader + Spinner + design-system + Session + Permission） |
| API 协议 | Anthropic `/v1/messages` 强制主路径 |
| 当前 readline 实现 | **废弃**，以 vendor Ink 原样复制替代 |
| 排除项 | CC 专属组件（Teams/MCP/Agents/AutoUpdater/IDE/Onboarding/Teleport 等），逐项标注理由 |

---

## 依据

- `docs/workflow/operating-records/2026-W30/trilc-tui-cpo-review.md`（原 CPO 评审）
- `TriLC/src/tui/app.ts`（当前偏离实现）
- `TriLC/vendor/claude-code-tui/`（156 文件基线，未使用）
- `claude-code-2.1.88/source-repo/src/main.tsx`（CC 入口）
- `claude-code-2.1.88/source-repo/src/components/`（CC 组件目录）
- `claude-code-2.1.88/source-repo/src/replLauncher.tsx`（CC TUI 启动器）
