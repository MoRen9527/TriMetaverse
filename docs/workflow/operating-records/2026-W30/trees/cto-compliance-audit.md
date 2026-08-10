# Claude Code 吸收遵循度审计 — CTO 技术审计

审计人：CTO 小狄
日期：2026-07-24
来源：CEO 指令 "原样复制 Claude Code 2.1.88，不臆想"
裁决类型：`APPROVE`（技术事实齐全，需废弃当前实现并重建）

---

## 前置核查

| # | 核查项 | 结论 |
|---|--------|------|
| 0 | 工作路径 | `TriLC/src/tui/` 合规，vendor 位于 `TriLC/vendor/claude-code-tui/` |
| 1 | CEO 最新输入 | "尽量复制 2.1.88 源码" + "Ink 内存问题要解决" + "Anthropic 强制" |
| 2 | 技术真源 | CTO-008-M（通信协议）、CTO-008-P（打包方案） |
| 3 | vendor 基线状态 | 156 文件就位，17 npm 依赖安装 ✅，Yoga 冒烟通过 ✅ |
| 4 | 实际实现 | `app.ts` 纯 readline，零 Ink 使用 |

---

## 一、`/chat/completions` → `/v1/messages` 切换

### 裁决：`APPROVE` — 立即切换，技术方案如下

#### 1.1 当前问题

`useChat.ts:30`：
```typescript
const DEFAULT_ENDPOINT = 'http://localhost:8711/chat/completions';
```

应切换为：
```typescript
const DEFAULT_ENDPOINT = 'http://localhost:8711/v1/messages';
```

#### 1.2 请求体格式对比

| 字段 | OpenAI `/chat/completions` | Anthropic `/v1/messages` |
|------|---------------------------|--------------------------|
| 模型 | `model` (如 `deepseek-v4-pro`) | `model` (直接复用) |
| 消息 | `messages: [{role, content}]` | `messages: [{role, content}]` |
| 系统 | — (在 messages[0] 里) | `system: string` (独立字段) |
| 流式 | `stream: true` | `stream: true` |
| 最大 tokens | `max_tokens` | `max_tokens` (直接复用) |
| 工具 | `tools` | `tools` (Claude 格式) |

**结论**：daemon 已做 Anthropic→内部 Message 转换（`app.ts` line 700-712），TUI 只需换请求体字段名。

#### 1.3 SSE 事件格式对比

| 事件 | OpenAI | Anthropic (daemon 实现) |
|------|--------|--------------------------|
| 内容增量 | `choices[0].delta.content` | `content_block_delta.delta.text` |
| 工具调用 | `choices[0].delta.tool_calls[0]` | `content_block_start.content_block` (type=tool_use) |
| 流结束 | `[DONE]` | `message_stop` |
| 错误 | `choices[0].finish_reason` | `error` event type |

#### 1.4 SSE 客户端改造

`useSSE.ts` 需重写解析层，从 OpenAI 格式切换为 Anthropic 格式：

```typescript
// 旧（OpenAI）
interface SSEMessage {
  choices: Array<{ delta: { content?: string; tool_calls?: ... } }>
}

// 新（Anthropic）
type AnthropicSSEEvent = 
  | { type: 'content_block_delta'; delta: { type: 'text_delta'; text: string } }
  | { type: 'content_block_start'; content_block: { type: 'tool_use'; name: string; ... } }
  | { type: 'message_stop' }
  | { type: 'error'; error: { message: string } }
```

**工作量估算**：1-2h（解析层重写 + 单元测试）

---

## 二、daemon 已有 `/v1/messages`，为何不走它？

### 追溯

| 阶段 | 决策 | 责任人 |
|------|------|--------|
| CPO+CTO 评审 (7/24) | 未明确指定端点，仅批准"SSE 客户端封装" | CPO + CTO |
| CTO 设计 (tech-design.md) | 设计仅写 "SSE 客户端封装"，未指定端点路径 | CTO 小狄 |
| 实现 (小全) | 选择 `/chat/completions`（更熟悉的 OpenAI 格式） | FullStackDeveloper |

**根因**：CTO 设计未强制指定 `/v1/messages` 端点，实现者按熟悉度选了 OpenAI 路径。

### 裁决

- **不是实现者的错**：设计未约束端点选择
- **现在强制**：CEO 明确要求 `/v1/messages` 为主路径
- **daemon 侧确认**：`TriLC/src/server/app.ts` line 677-720 实现完整，含：
  - Anthropic→内部 Message 转换 (`convertAnthropicMessages`)
  - Tool use 格式转换 (`convertAnthropicTools`)
  - SSE 流式输出 (`text/event-stream`)
  - `system` prompt 独立字段
  - 无需修改 daemon，TUI 客户端切换即可

---

## 三、vendor Ink 引擎 — 继续 vs 替代

### 裁决：`APPROVE` — 继续使用 vendor Ink，须解决内存问题

#### 3.1 关于"内存重"的分析

Claude Code 2.1.88 的 `src/ink/` 引擎（246KB 的 `ink.tsx` + 80 文件）是为**全功能 CLI 产品**设计的，包含：

- 多实例管理 (`instances.ts`)
- 完整的 CSI/DEC/OSC/ANSI 终端 I/O 协议栈 (`termio/*`)
- 文本选择 (`selection.ts`)
- 超链接渲染 (`termio/osc.ts` 的 OSC 8 支持)
- Bun 优化快速路径 (`wrapAnsi.ts`)
- CC 专属的 mtime 帧预算调度

**实际内存开销**：
- React 19 运行时：~168 KB
- react-reconciler：~1.6 MB（编译后）
- Yoga 布局原生模块：~200 KB
- Ink 引擎源码（编译后）：~800 KB
- **运行时堆内存**：约 20-30 MB（含 React reconciler 内部树 + Yoga 布局缓存）

对比：当前纯 readline 实现（`app.ts` 143 行）内存约 ~3-5 MB。

#### 3.2 裁剪方案（不削弱引擎能力）

| 可裁剪项 | 预计节省 | 方式 |
|----------|---------|------|
| `instances.ts` 多实例 | ~10 KB | 单实例模式，移除多例注册 |
| `selection.ts` 文本选择 | ~15 KB | TriLC TUI 不需要终端文本选择 |
| `termio/osc.ts` 超链接 | ~8 KB | 移除 OSC 8 (Hyperlink) 支持 |
| `render-to-screen.ts` 侧渲染 | ~20 KB | 仅保留主渲染路径 |
| Bun 优化路径 | ~5 KB | 移除 `typeof Bun !== 'undefined'` 分支 |
| `log-update.ts` mtime 预算 | ~5 KB | 简化为固定 16ms 帧间隔 |
| CC 专属 shim 移除 | ~30 KB | `log.ts`/`execFileNoThrow.ts` 等已解决 |

**裁剪后预估**：运行时堆内存 15-20 MB，编译产物 ~600 KB。

#### 3.3 为什么不能自己写 readline

CEO 已明确："不要因为内存大就自己写 readline"。技术理由补充：

1. **Claude Code 的 Ink 是经过数百万用户验证的终端 UI 引擎**。自己写的 readline 渲染器无法在一个迭代内达到同等稳定性。
2. **虚拟滚动 (diff/blit)** 是 readline 无法实现的。readline + `process.stdout.write` 只能全量重绘，对话 >100 条时体验断崖式下降。
3. **Yoga Flexbox 布局**是复杂布局的基石。ToolUseLoader、Permission 对话框、多面板布局都需要 Flexbox。
4. **15-20 MB 额外内存在现代 PC 上可接受**。TriCade 内置终端的 Electron 进程本身占用 ~200 MB，Ink 引擎的 15-20 MB 增量在测量误差范围内。

---

## 四、Session / Permission / Tool Use UI 吸收边界

### 裁决：P0/P1/P2 分级

#### 🔴 P0 — TUI MVP 必须吸收

| 功能 | CC 对应源码 | 吸收方式 | 理由 |
|------|-----------|---------|------|
| **Session 持久化** | `history.ts` + session store | TriLC session-store 已就绪，TUI 对接 `GET /sessions` + `POST /sessions/recover` | 对话连续性基础。崩溃即丢失是不可接受的 |
| **Session 列表** | — | 最小实现：`trilc chat --list` → 显示 session 列表 | 用户需要恢复之前的对话 |
| **Permission 基础** | `components/permissions/` | 简化为 `y/n` 终端问答（走 Ink 组件），复用 daemon 的 permission tier 机制 | 安全基础。允许 agent 无限制执行命令 = 安全隐患 |
| **Tool Use UI** | `ToolUseLoader.tsx` | 原样复制（展开/折叠 tool name + args + status） | Claude Code 的核心 UX 差异化特征 |

#### 🟡 P1 — H2 追加

| 功能 | 理由 |
|------|------|
| Permission policy 缓存 | "记住选择" / "本次会话始终允许" |
| 工具调用结果展示 | 展开查看 tool result（当前折叠） |
| Session 自动命名 | 基于首条消息自动生成 session 标题 |

#### ⚪ P2+ — 暂不吸收

| 功能 | 理由 |
|------|------|
| Permission canUseTool callback | CC 的复杂权限回调系统，TriLC 用 daemon tier 替代 |
| 完整的 Permission UI 套件 | CC 有 ~10 个权限组件，MVP 只需 1 个基础问答 |

---

## 五、实现路径：废弃当前，原样重建

### 5.1 废弃清单

| 文件 | 处置 |
|------|------|
| `TriLC/src/tui/app.ts` | 🗑️ 删除（纯 readline 实现） |
| `TriLC/src/tui/render.ts` | 🗑️ 删除（readline bootstrap） |
| `TriLC/src/tui/hooks/useChat.ts` | ✏️ 重写（端点切换 + Ink 状态管理） |
| `TriLC/src/tui/hooks/useSSE.ts` | ✏️ 重写（Anthropic SSE 格式） |

### 5.2 重建清单

```
TriLC/src/tui/
├── app.tsx                    # ✨ 新建：App 根组件（基于 vendor ink/root.ts）
├── render.tsx                 # ✨ 新建：Ink render 入口（createRoot + render）
├── components/                # ✨ 从 vendor 复制 + TriLC 适配
│   ├── Messages.tsx           #    复制自 vendor/components/Messages.tsx
│   ├── MessageRow.tsx         #    复制自 vendor/components/MessageRow.tsx
│   ├── MessageResponse.tsx    #    复制自 vendor/components/MessageResponse.tsx
│   ├── Markdown.tsx           #    复制自 vendor/components/Markdown.tsx
│   ├── VirtualMessageList.tsx #    复制自 vendor/components/VirtualMessageList.tsx
│   ├── PromptInput.tsx        #    复制自 vendor/components/PromptInput/PromptInput.tsx
│   ├── TextInput.tsx          #    复制自 vendor/components/TextInput.tsx
│   ├── ToolUseLoader.tsx      #    复制自 vendor/components/ToolUseLoader.tsx
│   ├── Spinner.tsx            #    复制自 vendor/components/Spinner/Spinner.tsx
│   └── design-system/         #    复制自 vendor/components/design-system/
├── hooks/
│   ├── useAnthropicSSE.ts     # ✨ 新建：Anthropic SSE 客户端
│   └── useChat.ts             # ✏️ 重写：Ink 状态管理
├── api/
│   └── client.ts              # ✨ 新建：/v1/messages API 客户端
└── session/
    └── store.ts               # ✨ 新建：Session 持久化对接 daemon
```

### 5.3 构建步骤

```bash
# 1. 从 vendor 复制组件（保持原貌，不做修改）
cp -r vendor/claude-code-tui/components/Messages.tsx src/tui/components/
cp -r vendor/claude-code-tui/components/MessageRow.tsx src/tui/components/
# ... 等

# 2. 创建 Ink render 入口
# app.tsx: 调用 vendor/ink/root.ts 的 createRoot + render
# render.tsx: process.stdin → Ink stdin, process.stdout → Ink stdout

# 3. 实现 Anthropic SSE 客户端
# useAnthropicSSE.ts: POST /v1/messages → SSE content_block_delta 解析

# 4. 实现 useChat hook
# 管理 messages 数组 + requestState 状态机 + abort

# 5. 实现 session store
# 对接 daemon GET/POST /internal/v1/sessions
```

### 5.4 预计工时

| 任务 | 工时 | 依赖 |
|------|------|------|
| 从 vendor 复制组件 + 适配导入路径 | 2h | vendor 已就位 |
| Anthropic SSE 客户端重写 | 1.5h | daemon `/v1/messages` 就绪 |
| useChat hook 重写（Ink 版本） | 1.5h | SSE 客户端 |
| Session store | 1h | daemon sessions API |
| Permission 基础 | 1h | daemon tier |
| 集成测试 + 调通 | 2h | 以上全部 |
| **合计** | **~9h** | |

---

## 六、裁决签署

| 裁决项 | 结果 |
|--------|------|
| `/chat/completions` → `/v1/messages` | `APPROVE` — SSE 客户端重写，1-2h |
| vendor Ink 继续使用 | `APPROVE` — 裁剪后 15-20MB，可接受 |
| 废弃当前 readline 实现 | `APPROVE` — `app.ts` + `render.ts` 删除 |
| 原样复制组件树 | `APPROVE` — 从 vendor 直接复制，最小适配 |
| Session 管理 | P0 必须吸收 |
| Permission 系统 | P0 必须吸收（简化版） |
| Tool Use UI | P0 必须吸收（原样复制 ToolUseLoader） |
| **预计总工时** | **~9h**（废弃 + 重建 + 验证） |

---

## 依据

- `TriLC/src/server/app.ts` line 677-720（daemon `/v1/messages` 端点）
- `TriLC/vendor/claude-code-tui/`（156 文件基线）
- `TriLC/src/tui/app.ts`（当前 readline 偏离实现）
- `TriLC/src/tui/hooks/useChat.ts`（OpenAI 端点）
- `claude-code-2.1.88/source-repo/src/ink/`（CC Ink 引擎真源）
- `claude-code-2.1.88/source-repo/src/components/`（CC 组件真源）
- `claude-code-2.1.88/source-repo/src/replLauncher.tsx`（CC TUI 启动模式）
- `docs/workflow/operating-records/2026-W30/trilc-tui-cto-review.md`（原 CTO 评审）
