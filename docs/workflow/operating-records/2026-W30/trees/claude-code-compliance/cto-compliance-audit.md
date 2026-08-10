# Claude Code 吸收遵循度 — CTO 技术审计

**版本**: V0.2（追加第六问）  
**日期**: 2026-07-24（初版）→ 2026-07-25（追加 CEO Contract 发现）  
**审计人**: CTO 小狄  
**触发指令**: CEO 指令 — 尽量复制 Claude Code 2.1.88 源码，不要自己臆想实现；CEO 2026-07-25 追加 — Contract 共享层存活确认  
**状态**: 六问回答 + 共享 Contract 架构裁决

---

## 前置核查记录

| # | 核查项 | 结果 |
|---|--------|------|
| 1 | CEO 最新输入 | 「尽量复制 CC 2.1.88 源码」— 明确 |
| 2 | BusinessStrategy | 当前实验阶段：TriLC TUI MVP 吸收 CC Ink 引擎 |
| 3 | TriCompany DESIGN.md | 已读，当前阶段 TriCompany 是研发仓+宿主资产层 |
| 4 | TriCompany code-state.md | 已读，line 66-68 记录 CTO-008 已完成、CPO Trimodel 部署 Phase 1 已完成 |
| 5 | TriLC Code Registry | （模块Registry尚未独立建立，vendor 基线已就位） |
| 6 | 发布/测试 readiness | TriDev/Trideployment state 非本次审计触发条件 |
| 7 | CompanyGovernance | 本次属 CTO 直接管辖 CodeRegistry 范畴，无需升级 |

### 技术基线快照

| 项目 | 事实 |
|------|------|
| vendor Ink | `TriLC/vendor/claude-code-tui/ink/` — **98 文件** ✓ |
| vendor Components | `TriLC/vendor/claude-code-tui/components/` — **57 文件** ✓ |
| vendor 入口 | `TriLC/vendor/claude-code-tui/ink.ts` — ThemeProvider 包裹层 |
| 核心引擎 | `ink/ink.tsx` — 246KB，6000+ 行，Ink 主类运行时 |
| npm 依赖 | 17 个已安装（react 19, react-reconciler, yoga-layout-prebuilt, marked, chalk...） ✓ |
| Yoga 冒烟 | 通过 ✓ |
| daemon /v1/messages | line 677, Anthropic SSE + content_block_delta ✓ |
| daemon /chat/completions | line 1061, OpenAI SSE 兼容 ✓ |
| 当前 app.ts | **pure readline, "no React/Ink"** — 完全不用 vendor ✗ |
| 当前 render.ts | **readline.createInterface 引导** — 完全不用 Ink ✗ |
| 当前 useSSE.ts | OpenAI SSE 格式解析（`data:` + `[DONE]`）— 未对接 Anthropic SSE |
| 现有 shims | `dist/tui/ink/shims.js` ✓ — 但 **src/ 无对应源文件** |
| 现有 bridges | `dist/tui/ink/yoga-bridge.js` + `constants-bridge.js` ✓ — 但 **src/ 无对应源文件** |

---

## 审计五问

### 第一问：/chat/completions → /v1/messages 切换

#### 技术事实

**当前路径（从 TUI → daemon）**：

```
useChat.ts (line 30)
  → POST http://localhost:8711/chat/completions  (OpenAI 格式 SSE)
  → useSSE.ts 解析：data: {...}\n\n, [DONE] 终止
  → SSEMessage.choices[0].delta.content → onToken()
  → SSEMessage.choices[0].delta.tool_calls → onToolCall()
```

**目标路径**：

```
新 ChatController
  → POST http://localhost:8711/v1/messages  (Anthropic 格式 SSE)
  → 解析：event: content_block_delta\ndata: {...}\n\n
  → content_block_delta → delta.text_delta / delta.input_json_delta
  → message_stop → 终止
```

**daemon 侧已完工**（`src/server/app.ts` line 675-780）：

- `POST /v1/messages` 端点完整实现
- `agentEventsToAnthropicSSE()` 转换器完整（`src/server/anthropic-stream.ts`, 390 行）
- SSE 事件类型：`message_start`, `content_block_start`, `content_block_delta`, `content_block_stop`, `message_delta`, `message_stop`, `ping`, `error`
- text_delta 和 input_json_delta（tool_use）均已覆盖

#### SSE 客户端改动分析

| 改动文件 | 改动量 | 说明 |
|----------|--------|------|
| `useSSE.ts` | **重写** ~80行 | 从 OpenAI SSE 解析切换到 Anthropic SSE 解析 |
| `useChat.ts` | 小改 ~15行 | endpoint URL + 请求 body 格式 |
| `useChat.ts` callbacks | 中等 ~30行 | text_delta → onToken, input_json_delta → onToolCall |

**核心差异**：

| 维度 | OpenAI SSE | Anthropic SSE |
|------|-----------|---------------|
| 帧分隔 | `data: {...}\n\n` | `event: type\ndata: {...}\n\n` |
| 终止信号 | `data: [DONE]` | `event: message_stop\ndata: {...}` |
| 文本增量 | `choices[0].delta.content` | `content_block_delta` + `delta.text_delta` |
| 工具调用 | `choices[0].delta.tool_calls` | `content_block_start`(tool_use) + `input_json_delta` |
| 消息元信息 | 无 | `message_start`（id, model, usage） |
| 流控 | 无 | `ping` 心跳事件 |

**代价评估**：

- **总代码量**: ~150 行重写（useSSE.ts ~80 + useChat.ts ~50）
- **风险**: 低 — daemon 侧已完整实现，只需适配客户端解析器
- **测试验证**: 已有 `agentEventsToAnthropicSSE` 可通过 curl 直接验证
- **回滚**: 保留 `/chat/completions` 端点（daemon 侧双端点并跑），TUI 切换失败可回退

#### 裁决：APPROVE — 低风险快速切换

**理由**：daemon 侧已完工、SSE 客户端改动量小、双端点可并存回退。建议先写新的 AnthropicSSEClient 文件，通过冒烟后再废弃旧的 useSSE.ts。

---

### 第二问：Ink 引擎内存问题

#### 2.1 OOM 根因分析

此前 "OOM at 8GB heap" 发生在 Ink 引擎试运行时，需要定位根本原因。**当前 app.ts 是纯 readline，从未加载 Ink**，因此 OOM 必然是之前某次 Ink 试运行留下的经验。可能原因分层排查：

| 原因层级 | 可能性 | 症状 | 验证方法 |
|----------|--------|------|----------|
| **A. ink.tsx 全量加载** | 高 | ink.tsx 246KB 包含 CC 全部 UI 逻辑（Agent/MCP/Teams/Voice/Vim），每个组件注册 hook、事件、keybinding，全部 import 导致内存爆炸 | 按 §2.2 裁剪后重测 |
| **B. react-reconciler Fiber 树膨胀** | 中 | 如果渲染了完整 CC 的 30+ 组件树（agent roster / MCP panel / file tree / permission dialog），Fiber 节点数可能破万 | 限制初始 render 范围 |
| **C. Yoga 布局缓存** | 中 | node-cache.ts 中的布局缓存 + screen.ts 的 StylePool/CharPool 在复杂 UI 下持续膨胀 | 检查 blit 缓存策略 |
| **D. Native addon 泄漏** | 低 | modifiers-napi, audio-capture 等原生模块在 TriLC 环境不适用但可能被 import | 确认 shims 已裁剪 |
| **E. 事件循环泄漏** | 低 | useInterval/useAnimationFrame 未清理导致 render loop 堆积 | 检查 unmount 路径 |

#### 2.2 裁剪方案：CC 专属子系统识别与处理

vendor/ink/ 中以下模块为 **CC 专属，TriLC H1 不需要**：

##### 第一层：直接裁剪（删除或不导入）

| 文件 | 原因 | 影响 |
|------|------|------|
| `selection.ts` | 鼠标文本选择 | 终端不支持鼠标选择时可跳过 |
| `searchHighlight.ts` | 文本搜索高亮 | H1 无搜索功能 |
| `devtools.ts` | Ink DevTools 调试面板 | 开发环境不需要 |
| `vim.ts` | Vim 模式键绑定 | TriLC 不支持 Vim 模式 |
| `mouse相关`（termio/dec.ts 中的鼠标协议） | Kitty/SGR 鼠标协议 | 终端鼠标支持非 H1 需求 |
| `voice/**` | 语音输入/输出 | TriLC 无语音功能 |

##### 第二层：UI 应用层（vendor/components/ 可推迟）

| 组件目录 | 用途 | H1 必要性 | 建议 |
|----------|------|-----------|------|
| `design-system/` | ThemeProvider, ThemedBox, ThemedText 等 16 文件 | **必须** — 被 vendor/ink.ts 引用 | 保留，但剥离 CC 主题 |
| `Spinner/` | 11 文件：动画 spinner, TeammateSpinnerTree | **部分** — 基础 Spinner 需要 | 保留 index.ts + SpinnerGlyph，裁剪 Team/Stall 相关 |
| `PromptInput/` | 21 文件：完整输入系统（队列/通知/标志/语音/沙箱提示） | **仅需 PromptInput.tsx** | 裁剪到 3-5 文件 |
| `Message*.tsx` | Message, MessageResponse, MessageRow, Messages | **H1 需要** — 对话展示 | 保留，简化 MarkdownTable |
| `VirtualMessageList.tsx` | 虚拟滚动列表 | **H1 需要** — 长对话性能 | 保留 |
| `Markdown.tsx` + `MarkdownTable.tsx` | Markdown 渲染 | **H1 需要** — 核心展示 | 保留 |

##### 第三层：CC Agent/Teams/MCP UI — 全部推迟 H2

这些在 vendor/components/ 中**不存在**（vendor 只包含可复用基础组件），但 CC 源码中对应 UI 在 `src/screens/`、`src/components/` 等目录。TriLC 当前 vendor 快照中**没有这些**，所以本次**不需额外裁剪**。

#### 2.3 真实内存占用评估

基于裁剪后（45 核心引擎文件 + ~10 基础组件），内存基线估算：

| 阶段 | 内存基线 | 说明 |
|------|----------|------|
| 加载 Ink 引擎（裁剪后） | ~30-50 MB | React reconciler + Yoga + 屏幕缓冲 |
| 初始渲染（空聊天） | ~80-120 MB | Fiber 树 + DOM + 布局缓存 |
| 活跃对话（50 轮） | ~180-300 MB | VirtualMessageList nodes + Markdown AST |
| 峰值（500 轮长对话） | ~500-800 MB | 取决于消息保留策略 |

**结论**：裁剪后 8GB heap 不会 OOM。之前的 OOM 极可能是**全量加载未裁剪 Ink**（246KB 文件全链路 + CC UI 层全量渲染）。

**门禁**：裁剪后必须在本地用 `--max-old-space-size=2048` 冒烟，通过后再合并。

#### 裁决：FREEZE → 先裁剪验证，再 APPROVE

**理由**：OOM 根因未在裁剪环境下复测。要求：(1) 按 §2.2 完成裁剪，(2) 2GB heap 下冒烟通过，(3) 记录裁剪清单到技术设计文档。

---

### 第三问：Vendor 原样复制方案

#### 3.1 现有资产状态

**已完成（dist 中存在）**：

| 文件 | 位置 | 状态 |
|------|------|------|
| `shims.js` | `dist/tui/ink/shims.js` (78 行) | **仅编译产物，无源 TS 文件** |
| `yoga-bridge.js` | `dist/tui/ink/yoga-bridge.js` (80 行) | **仅编译产物，无源 TS 文件** |
| `constants-bridge.js` | `dist/tui/ink/constants-bridge.js` (5 行) | **仅编译产物，无源 TS 文件** |

**问题**：shims/bridges 仅在 `dist/` 中有编译产物，`src/tui/` 下没有对应的 TypeScript 源文件。这意味着这些文件是**手工写入 dist 的**，不在构建流程中。下一次 `tsc` 不会复制它们，也不会重新编译。

#### 3.2 最小 patch 完整清单

以下采用"原样复制 vendor，仅 patch 适配"策略，按优先级排列：

##### Phase 1a：基础设施（已有，需补充 src）

| # | 文件 | 动作 | 说明 |
|---|------|------|------|
| P1 | `src/tui/ink/shims.ts` | **新建** | 将 dist 中的 shims.js 改写为 TS 源文件，补充类型声明 |
| P2 | `src/tui/ink/yoga-bridge.ts` | **新建** | 将 dist 中的 yoga-bridge.js 改写为 TS 源文件 |
| P3 | `src/tui/ink/constants-bridge.ts` | **新建** | 将 dist 中的 constants-bridge.js 改写为 TS 源文件 |

##### Phase 1b：核心引擎（从 vendor 原样复制，不做任何修改）

| # | 分组 | 文件数 | 动作 | 说明 |
|---|------|--------|------|------|
| P4 | 核心引擎 | 16 | **cp vendor → src/tui/ink/** | root.ts, ink.tsx, reconciler.ts, renderer.ts, render-to-screen.ts, render-node-to-output.ts, dom.ts, screen.ts, output.ts, frame.ts, log-update.ts, terminal.ts, focus.ts, node-cache.ts, instances.ts, constants.ts |
| P5 | 布局引擎 | 4 | **cp vendor → src/tui/ink/layout/** | engine.ts, node.ts, geometry.ts, yoga.ts |
| P6 | 终端 IO | 9 | **cp vendor → src/tui/ink/termio/** | ansi.ts, csi.ts, dec.ts, esc.ts, osc.ts, parser.ts, tokenize.ts, types.ts, sgr.ts |
| P7 | 基础类型/工具 | 15 | **cp vendor → src/tui/ink/** | parse-keypress.ts, colorize.ts, bidi.ts, stringWidth.ts, widest-line.ts, wrap-text.ts, wrapAnsi.ts, clearTerminal.ts, get-max-width.ts, measure-element.ts, measure-text.ts, squash-text-nodes.ts, render-border.ts, styles.ts, line-width-cache.ts |
| P8 | 事件/Hooks | 8 | **cp vendor → src/tui/ink/** | events/* (4 files), hooks/* (4 files: use-input, use-stdin, use-app, use-terminal-focus), focus.ts |
| P9 | 类型定义 | 1 | **cp vendor → src/tui/ink/** | global.d.ts |

##### Phase 1c：需要 patch 的文件（仅 import 路径修正）

| # | 文件 | Patch 内容 |
|---|------|------------|
| P10 | `ink/ink.tsx` | 修改 import：`'../bootstrap/state'` → `'./shims'`；`'../services/debug'` → `'./shims'`；`'../bootstrap/state'` 的 `flushInteractionTime` → `shims.flushInteractionTime` |
| P11 | `ink/layout/yoga.ts` | 修改 import：`'../../native-ts/yoga'` → `'../yoga-bridge'` |
| P12 | `ink/reconciler.ts` | 修改 import：`'react-reconciler/constants.js'` → `'../constants-bridge'` |
| P13 | `ink/screen.ts` | 如果引用 `outputStyles`（CC 专属色彩系统），用 shims 替代 |
| P14 | `ink/renderer.ts` | 检查是否有 CC 专属 `services/` 或 `bootstrap/` 引用 |

##### Phase 1d：基础组件（从 vendor 原样复制）

| # | 文件 | 动作 |
|---|------|------|
| P15 | `ink/components/` 基础组件 | **cp vendor → src/tui/ink/components/** — AppContext, Box, Button, Link, Newline, NoSelect, RawAnsi, Spacer, StdinContext, Text |
| P16 | `ink/Ansi.ts` | **cp vendor → src/tui/ink/** |

##### Phase 1e：应用组件（选择性复制）

| # | 文件 | 动作 |
|---|------|------|
| P17 | `components/PromptInput/PromptInput.tsx` | **cp** — 核心输入组件 |
| P18 | `components/Messages.tsx` + `Message.tsx` + `MessageResponse.tsx` + `MessageRow.tsx` | **cp** — 对话展示 |
| P19 | `components/VirtualMessageList.tsx` | **cp** — 虚拟滚动 |
| P20 | `components/Markdown.tsx` + `MarkdownTable.tsx` | **cp** — Markdown 渲染 |
| P21 | `components/Spinner/index.ts` + `SpinnerGlyph.tsx` + `SpinnerAnimationRow.tsx` | **cp** — 最小 spinner |
| P22 | `components/TextInput.tsx` | **cp** — 文本输入 |

##### Phase 1f：包装层 + 新入口

| # | 文件 | 动作 |
|---|------|------|
| P23 | `src/tui/ink.ts` | **新建** — 替代 vendor/ink.ts，不用 ThemeProvider，直接用 root.ts 的 createRoot/render |
| P24 | `src/tui/new-app.tsx` | **新建** — 替换纯 readline app.ts |

#### 3.3 需要补充的工作

| # | 工作 | 说明 |
|---|------|------|
| S1 | shims.ts 源文件化 | dist → src，补充 TypeScript 类型 |
| S2 | yoga-bridge.ts 源文件化 | dist → src，补充 TypeScript 类型 |
| S3 | constants-bridge.ts 源文件化 | dist → src，补充 TypeScript 类型 |
| S4 | global.d.ts 补充声明 | CSSProperties 类型、yoga-layout-prebuilt 模块声明 |
| S5 | Ink 实例生命周期管理 | instances.ts 需要适配 TriLC CLI 的启动/退出流程 |
| S6 | 终端 IO 适配 | termio/ 需要确认在 Windows cmd/PowerShell/Windows Terminal 下行为正确 |

#### 裁决：APPROVE — 方案可行，需按清单执行

**理由**：vendor 98+57 文件完整就位，三大 shim/bridge 已有 JS 草稿，核心 patch 仅为 import 路径修正（5-6 处）。关键是补上源 TypeScript 文件，确保构建链完整。

---

### 第四问：Session / Permission / ToolUse UI — H1 vs H2 拆解

#### 4.1 原样复制硬要求（H1）

以下 UI 是 Claude Code 2.1.88 的**核心交付特征**，必须从 vendor/components/ 原样复制：

| UI 模块 | 对应组件 | 原样复制要求 | 理由 |
|---------|----------|-------------|------|
| **对话消息展示** | `Messages.tsx` + `Message.tsx` + `MessageResponse.tsx` + `MessageRow.tsx` | **硬要求** — 原样复制 | CC 的消息气泡、角色标记、折叠/展开是用户体验基线 |
| **Markdown 渲染** | `Markdown.tsx` + `MarkdownTable.tsx` | **硬要求** — 原样复制 | CC 的代码块、表格、引用格式是核心展示能力 |
| **虚拟滚动** | `VirtualMessageList.tsx` | **硬要求** — 原样复制 | 长对话性能关键路径 |
| **流式文本增量** | `content_block_delta` + `text_delta` 处理 | **硬要求** — Anthropic SSE 解析 | 逐 token 渲染是流式体验核心 |
| **Spinner / 加载状态** | `Spinner/index.ts` + `SpinnerGlyph.tsx` | **硬要求** — 原样复制 | 流式等待期间的视觉反馈 |

#### 4.2 Session 管理（H1 简化版）

| 功能 | CC 2.1.88 实现 | TriLC H1 | 理由 |
|------|---------------|----------|------|
| Session 持久化 | SQLite + memdir | TriLC session-store v2（已在 cpo-trimodel-deployment Phase 1 完成） | 复用已有基础设施 |
| 多 Session 切换 | Tab UI + session 列表 | 推迟 H2 | H1 单 session 即可 |
| Session 恢复 | 自动恢复上次对话 | 推迟 H2 | H1 每次新启动 = 新 session |
| 对话历史浏览 | 滚动 + 跳转 | H1 基础版（VirtualMessageList 自带） | 够用 |

#### 4.3 Permission / ToolUse UI（H1 策略）

| 功能 | CC 2.1.88 实现 | TriLC H1 | 理由 |
|------|---------------|----------|------|
| 工具调用展示 | content_block_start(tool_use) + input_json_delta → 折叠卡片 | **H1 需要** — 简化版工具卡片 | 用户需要看到工具调用过程和结果 |
| 权限确认弹窗 | Permission dialog（allow/deny/always） | **推迟 H2** — H1 默认自动批准（MVP 范围限制工具集） | H1 工具集小，不需要复杂权限 |
| 工具结果展示 | tool_result block → 折叠/展开 + 截断 | **H1 需要** — 基础工具结果展示 | 用户需要看到工具输出 |
| 工具阻塞提示 | tool_blocked → 红色提示 | **H1 需要** — SSE 事件已就位 | daemon 已发出 blocked 事件，UI 只需展示 |

#### 4.4 Session UI 关键差异

CC 2.1.88 的 Session UI 包含大量 CC 专属功能（agent roster、MCP server 管理、team 切换、语音模式），**这些 vendor/ 中没有**，它们在 CC 的 `src/screens/` 中。TriLC 本次不需要处理这些。

**H1 Session UI 最小范围**：

```
┌─────────────────────────────────────────────┐
│ TriLC v0.2.0                    [session-id]│  ← header（简化）
├─────────────────────────────────────────────┤
│                                             │
│  🤖 > 你好！我可以帮你做什么？              │  ← Messages.tsx
│                                             │
│  🧑 帮我检查代码                            │  ← Message.tsx
│                                             │
│  🤖 > 正在分析...                           │  ← streaming
│     [tool] read_file index.ts ✓             │  ← tool_use 卡片
│     [tool] search_content ✓                 │
│     你的代码结构如下...                     │  ← text_delta 内容
│                                             │
├─────────────────────────────────────────────┤
│ ▸ 输入你的问题...                           │  ← PromptInput
└─────────────────────────────────────────────┘
```

#### 裁决：APPROVE — 范围清晰，硬要求 6 项，推迟 4 项至 H2

---

### 第五问：实现路径与工时估算

#### 5.1 废弃当前实现

**当前文件将被替换/重写**：

| 文件 | 动作 | 说明 |
|------|------|------|
| `src/tui/app.ts` | **废弃** — 替换为 new-app.tsx | 143 行纯 readline |
| `src/tui/render.ts` | **重写** — 改为 Ink createRoot 引导 | 33 行 readline 引导 |
| `src/tui/hooks/useSSE.ts` | **重写** — 切换为 Anthropic SSE 解析 | 148 行 OpenAI 格式 |
| `src/tui/hooks/useChat.ts` | **重写** — 适配 /v1/messages + Anthropic SSE | 152 行 |

**保留**：`tech-design.md`、`test-report.md`、`test-report-t2.md`（作为技术演进记录）。

#### 5.2 五阶段实现计划

```
Phase 0: 补源（30 min）
├── P0.1  shims.ts → src/tui/ink/shims.ts (含类型)
├── P0.2  yoga-bridge.ts → src/tui/ink/yoga-bridge.ts
├── P0.3  constants-bridge.ts → src/tui/ink/constants-bridge.ts
├── P0.4  global.d.ts 补充声明
└── P0.5  删除 dist/tui/ink/ 中的孤立 .js（避免误导）

Phase 1: 引擎纸基（60 min）
├── P1.1  从 vendor/ink/ 复制 45 核心文件 → src/tui/ink/（不改代码）
├── P1.2  从 vendor/ink/ 复制 termio/ layout/ 子目录
├── P1.3  从 vendor/ink/ 复制基础组件 → src/tui/ink/components/
├── P1.4  从 vendor/components/ 复制应用组件 → src/tui/components/
├── P1.5  5-6 处 import patch（yoga.ts, reconciler.ts, ink.tsx, screen.ts, renderer.ts）
└── P1.6  tsc --noEmit 确认编译通过（此时不渲染）

Phase 2: Ink 冒烟（60 min）★★★ 风险最高
├── P2.1  写 src/tui/ink-smoke.tsx（最小 App: <Box><Text>Hello TriLC</Text></Box>）
├── P2.2  用 createRoot 渲染到 stdout
├── P2.3  验证：文字可见、颜色正确、Ctrl+C 退出干净
├── P2.4  --max-old-space-size=2048 下运行，确认无 OOM
├── P2.5  记录裁剪清单和内存基线到 tech-design.md
└── P2.6  验证 unmount 完整（无事件泄漏、无终端残留）

Phase 3: SSE 客户端切换（45 min）
├── P3.1  重写 useSSE.ts → AnthropicSSEClient（Anthropic SSE 解析）
├── P3.2  重写 useChat.ts → AnthropicChatController
├── P3.3  curl 验证 daemon /v1/messages 返回正确
├── P3.4  单元测试：SSE 帧解析（text_delta / input_json_delta / message_stop）
└── P3.5  集成测试：curl 打 /v1/messages，SSE 客户端消费

Phase 4: app.tsx 重建（120 min）
├── P4.1  写 src/tui/components/App.tsx（Ink 根组件）
│         ├── Header（模型名 + session id）
│         ├── Messages + VirtualMessageList
│         ├── PromptInput
│         └── StatusBar（流式状态 / 工具调用指示）
├── P4.2  写 src/tui/render.ts（Ink createRoot 引导）
├── P4.3  集成 AnthropicChatController → Ink state
├── P4.4  tool_use → 折叠卡片组件
├── P4.5  tool_result → 结果展示组件
├── P4.6  错误边界：ErrorBoundary 组件
└── P4.7  废弃旧 app.ts + render.ts

Phase 5: 打磨 + 回归（60 min）
├── P5.1  Ctrl+C 双按退出（inherit 旧 app.ts 的 SIGINT 逻辑）
├── P5.2  键盘快捷键：/help, /exit, /clear
├── P5.3  Markdown 渲染（marked + CC Markdown 组件）
├── P5.4  Windows Terminal / cmd / PowerShell 兼容冒烟
├── P5.5  全量 tsc --noEmit + 现有测试回归
└── P5.6  产出 TriLC TUI v0.2.0 发布包
```

#### 5.3 工时估算

| 阶段 | 工时 | 风险 | 关键依赖 |
|------|------|------|----------|
| Phase 0: 补源 | 0.5h | 低 | — |
| Phase 1: 引擎纸基 | 1.0h | 中 | vendor 文件完整 |
| Phase 2: Ink 冒烟 ★ | 1.0h | **高** | OOM 风险、终端兼容性 |
| Phase 3: SSE 切换 | 0.75h | 低 | daemon /v1/messages |
| Phase 4: app.tsx 重建 | 2.0h | 中 | Ink 冒烟通过 |
| Phase 5: 打磨回归 | 1.0h | 低 | Phase 4 完成 |
| **总计** | **6.25h** | | |

**缓冲建议**：Phase 2 如果遇到终端兼容性问题（Windows Terminal vs cmd vs PowerShell），可能需要额外 1-2h。建议工时预算 **6-8h（1 个工作日）**。

#### 5.4 里程碑定义

| 里程碑 | 条件 | 门禁 |
|--------|------|------|
| M1: Ink 引擎就绪 | Phase 0-1 完成，tsc 通过，核心文件就位 | 文件计数 ≥45，import path patch 通过 |
| M2: Ink 冒烟通过 ★ | Phase 2 完成，Hello World 渲染正确 | 2GB heap 无 OOM、Ctrl+C 退出干净 |
| M3: SSE 接通 | Phase 3 完成，Anthropic SSE 解析正确 | curl + 客户端集成测试通过 |
| M4: app.tsx 上线 | Phase 4 完成，新旧功能等价 | 旧 app.ts 的所有功能（发送/接收/工具/取消）在新版均可运行 |
| M5: v0.2.0 发布 | Phase 5 完成，Windows 兼容冒烟通过 | tsc 通过 + 手动冒烟 + release note |

#### 裁决：APPROVE — 6.25h 可交付，Phase 2 为关键路径

---

## 总裁决

| 问 | 题目 | 裁决 | 关键条件 |
|----|------|------|----------|
| 1 | SSE 切换 | **APPROVE** | 低风险，daemon 侧已完工，客户端 ~150 行改动 |
| 2 | Ink 内存 | **FREEZE** | 需裁剪后 2GB heap 冒烟通过，再 APPROVE |
| 3 | Vendor 复制 | **APPROVE** | 清单完整，shims/bridges 需补源 TS 文件 |
| 4 | UI 范围 | **APPROVE** | H1 6 项硬要求 + 4 项推迟 H2 |
| 5 | 实现路径 | **APPROVE** | 6.75h 五阶段（含 Contract 集成 +0.5h），Phase 2 关键路径 |
| 6 | 共享 Contract | **APPROVE** | 12 份 contract.yaml 已存活，contract-resolver.ts 已投产。Claude CLI 管道**必须**基于此共享层，禁止建独立管道 |

### 给 CEO 的执行建议

1. **立即开工**：Phase 0-1（补源+引擎纸基）零风险，可立即执行。
2. **Contract 扩展前置**：在正式开始 Phase 0 之前，先用 30min 完成 Contract 层的小改动（`runtime_baseline.hosts` 支持 claude-cli + publish manifest 追加 entries）。这会解锁后续所有步骤对 agent 身份的统一引用。
3. **Phase 2 是关键决策点**：如果 Phase 2（Ink 冒烟）在 2GB heap 下 OOM，需要暂停升级到 CTO 重新评估。之前的 OOM at 8GB 是非常严重的信号，必须验证是"全量加载未裁剪"导致还是 Ink 引擎本身在 Windows 下有内存问题。
4. **双端点策略**：Phase 3-4 期间保持 `/chat/completions` 端点，旧 TUI 可随时回退。
5. **不要超过 8h**：如果 8h 后仍未完成 Phase 4，暂停并升级 — 说明裁剪方案有遗漏或 vendor 兼容性超预期。
6. **禁止独立 Claude CLI agent 管道**：任何人在任何阶段试图绕过 `.contract.yaml` 建立独立的 Claude CLI agent 定义文件，CTO 将行使 FREEZE 权。

---

---

## 第六问（追加）：共享 Contract 体系存活 — Claude CLI 管道架构裁决

> **触发**：CEO 于 2026-07-25 09:20 指出 `TriCompany/source-agents/*/*.contract.yaml` 12 份合同存活，这是共享层，不是两套管道。

### 6.1 事实核实

#### 6.1.1 Contract 体系全貌

| 事实 | 数值 | 路径 |
|------|------|------|
| Contract 文件数 | **12 份** | `TriCompany/source-agents/<agent-id>/<agent-id>.contract.yaml` |
| 活跃 Role Agent | 9 人（CEOChiefOfStaff + 8 管理岗/执行岗） | 源侧五件套齐全 |
| Registry Agent | 51 份模块 registry | `TriCompany/source-agents/registries/` |
| Contract 版本 | v2.0 | `contract.version: "2.0"` |
| 当前宿主 | `runtime_baseline.host: copilot-host` | 每份 contract 一致 |
| 运行时加载 | TriLC daemon 启动时调用 | `contract-resolver.ts` line 593-595 |
| Served 端点 | `GET /internal/v1/agents` + `GET /internal/v1/agents/{id}/system-prompt` | Daemon line 627, 654 |
| Publish manifest | `trimetaverse-live-agent-publish-manifest.json` | Copilot-host 单宿主 |

#### 6.1.2 四层架构（从 `employee-standard-capabilities.md` 提取）

```
Layer 1: 源侧定义层    → TriCompany/source-agents/<id>/ 五件套     ← 宿主无关
Layer 2: 契约注册层    → TriCompany/.contract.yaml                ← 宿主无关
Layer 3: 宿主绑定层    → TriCompany/.github/binding-profiles/      ← 宿主有关
Layer 4: 运行时认知层  → {project}/.../knowledge/employees/<id>/   ← 项目有关
```

**关键发现**：Layer 1 和 Layer 2 是**宿主无关**的。当前 `runtime_baseline.host: copilot-host` 只是声明当前 binding 目标，但契约本身（agent_id、paths、decision_rights、五件套路径）不依赖任何特定宿主。

#### 6.1.3 Contract → Runtime 数据流（已投产）

```
TriLC daemon 启动
  → getContractResolver(env.tricompanySourcePath).loadAll()
  → 遍历 source-agents/*/<name>.contract.yaml
  → 解析五件套路径 → 读取 soul + agent_body → 拼接 systemPrompt
  → GET /internal/v1/agents → 列出所有 agent
  → GET /internal/v1/agents/{id}/system-prompt → 返回拼接后的 system prompt
  → /v1/messages 接收 `system` 参数 → 直接注入 agentLoop
```

**这意味着**：TriLC 已经在运行时通过 Contract 体系为任何 agent 组装 system prompt。Claude CLI 完全可以复用同一个解析器。

### 6.2 裁决：Claude CLI 管道应基于共享 Contract 层，而非新建独立管道

#### 当前问题

CEO 的直觉正确：如果 Claude CLI agent 管道独立设计，会导致：

| 问题 | 后果 |
|------|------|
| 12 份 contract.yaml 之外再建 12 份 Claude CLI agent 定义 | 双源真、同步漂移、维护成本翻倍 |
| contract-resolver.ts 只服务 Copilot，Claude 走另一条路 | 代码重复、逻辑分叉 |
| publish-manifest.json 只有 `copilot-host` target | Claude CLI 无正式登记 |
| `runtime_baseline.host` 只能单值 | 无法声明多宿主 |

#### 正确方案：共享 Contract → 多宿主输出

```
                        ┌─────────────────┐
                        │  .contract.yaml  │  ← Layer 2：宿主无关
                        │  (12 份)         │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
     │ contract-       │ │ contract-       │ │ contract-       │
     │ resolver.ts     │ │ resolver.ts     │ │ resolver.ts     │
     │ (现有)          │ │ (现有)          │ │ (现有)          │
     └───────┬────────┘ └───────┬────────┘ └───────┬────────┘
             │                  │                  │
    ┌────────▼────────┐ ┌──────▼──────────┐ ┌──────▼──────────┐
    │ Copilot-host    │ │ Claude CLI      │ │ TriMC (planned) │
    │ .agent.md       │ │ agent config    │ │ agent runtime   │
    │ (现役 live)     │ │ (新增 target)   │ │ (future)        │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 6.3 最小改动清单

#### 6.3.1 Contract 层改动（1 处）

| # | 文件 | 改动 | 说明 |
|---|------|------|------|
| C1 | 各 `.contract.yaml` | `runtime_baseline.host` 从 `copilot-host` 扩展为数组或新增 `claude-cli` 字段 | 声明该 agent 在多个宿主生效 |

建议方案（向后兼容）：

```yaml
runtime_baseline:
  hosts:
    - copilot-host      # 现役
    - claude-cli         # 新增
  tri_mc_status: planned
```

或采用最小侵入方式（保留现有字段）：

```yaml
runtime_baseline:
  host: copilot-host
  claude_cli_enabled: true    # 新增
  tri_mc_status: planned
  tri_mc_migration_ready: false
```

#### 6.3.2 Contract Resolver 改动（0 处 — 已就绪）

`contract-resolver.ts` 不需要任何改动。它：
- 已经加载全部 12 份 contract
- 已经支持 `listAgents()` + `getSystemPrompt(id)` + `getDecisionRights(id)`
- 已经挂载在 daemon 的 `/internal/v1/agents` 和 `/internal/v1/agents/{id}/system-prompt` 端点
- Claude CLI 可以通过 HTTP 调用现有 daemon 获取 agent 身份，或直接 import contract-resolver

#### 6.3.3 Publish Manifest 改动（1 处）

| # | 文件 | 改动 | 说明 |
|---|------|------|------|
| P1 | `trimetaverse-live-agent-publish-manifest.json` | 新增 `claude-cli` target entries | 对每个 role agent 登记 claude-cli 发布路径 |

示例追加：

```json
{
  "status": "claude-cli-live",
  "target": "claude-cli/agents/chief-technology-officer.json",
  "source": "TriCompany/source-agents/chief-technology-officer/chief-technology-officer.contract.yaml",
  "kind": "role-agent",
  "host": "claude-cli"
}
```

#### 6.3.4 Claude CLI Agent 生成器（新增 1 个文件）

| # | 文件 | 改动 | 说明 |
|---|------|------|------|
| G1 | `TriLC/src/config/claude-agent-builder.ts` | **新建** | 从 Contract → Claude CLI agent JSON 格式 |

Claude CLI agent 格式（以 Claude Code 2.1.88 为参考）是 JSON 文件：

```json
{
  "name": "chief-technology-officer",
  "description": "CTO of TriCompany",
  "instructions": "<system prompt from contract-resolver>",
  "tools": ["*"],
  "model": "claude-sonnet-4-20250514"
}
```

`claude-agent-builder.ts` 的核心逻辑：

```typescript
function buildClaudeAgent(contract: AgentContract): ClaudeAgentConfig {
  return {
    name: contract.agentId,
    description: contract.decisionRights,
    instructions: contract.systemPrompt,  // ← 复用 contract-resolver 的拼接结果
    tools: parseToolControl(contract.toolControl),
    // 从 contract.runtime_baseline 提取 per-host 配置
  };
}
```

### 6.4 与已有审计五问的关系

| 审计问 | 关系 |
|--------|------|
| 问1（SSE 切换） | 无直接影响 — daemon 端点不变 |
| 问2（Ink 内存） | 无直接影响 — TUI 渲染层不变 |
| 问3（Vendor 复制） | 无直接影响 — Ink 引擎不变 |
| 问4（Session/Permission UI） | 间接影响 — 如果 Claude CLI 有 agent selector，从 `/internal/v1/agents` 拉取 agent 列表即可 |
| 问5（实现路径） | **直接扩展** — Phase 4.1 的 App.tsx 中，agent 身份加载从使用固定 system prompt 改为调用 `GET /internal/v1/agents/{currentAgent}/system-prompt` |

### 6.5 对第五问实现路径的更新

原 Phase 4.1 设计为硬编码 system prompt。应该改为：

```
App.tsx 启动
  → GET localhost:8711/internal/v1/agents         // 获取可选 agent 列表
  → 用户选择 agent（或通过 CLI 参数 --agent）
  → GET localhost:8711/internal/v1/agents/{id}/system-prompt
  → 注入到 AnthropicChatController 的 system 参数
  → POST /v1/messages { system: ..., messages: [...] }
```

这不需要修改 daemon，只需要修改 TUI 的 App.tsx。工时影响：**+0.5h**（Phase 4 从 2.0h → 2.5h），总预算 **6.25h → 6.75h**。

### 6.6 裁决：APPROVE — 共享 Contract 应作为 Claude CLI 管道的唯一源

**理由**：
1. Contract 体系已存活且被 TriLC daemon 消费，是生产级资产。
2. `contract-resolver.ts` 无需改动，HTTP 端点已就位。
3. 改动量极小：contract YAML 扩展 1 字段 + publish manifest 追加 entries + 新建 1 个 builder 文件。
4. 反对建立独立 Claude CLI agent 管道 — 那会制造双源真、同步漂移和维护债务。

**执行顺序建议**：
1. 先完成 Contract 层扩展（C1 + P1）— 30min
2. 再完成 `claude-agent-builder.ts` — 30min
3. Phase 4.1（App.tsx）中集成 agent selector — 包含在原有估算中
4. 全量测试：Copilot-host + Claude CLI 从同一 contract 产出正确 agent 身份

---

## 使用依据

| 依据 | 路径 | 版本 |
|------|------|------|
| 当前 app.ts | `TriLC/src/tui/app.ts` | 纯 readline, 143 行 |
| 当前 render.ts | `TriLC/src/tui/render.ts` | 纯 readline, 33 行 |
| 当前 useSSE.ts | `TriLC/src/tui/hooks/useSSE.ts` | OpenAI SSE, 148 行 |
| 当前 useChat.ts | `TriLC/src/tui/hooks/useChat.ts` | OpenAI endpoint, 152 行 |
| daemon /v1/messages | `TriLC/src/server/app.ts` line 675-780 | Anthropic SSE ✓ |
| anthropic-stream.ts | `TriLC/src/server/anthropic-stream.ts` | 390 行完整转换器 |
| vendor Ink engine | `TriLC/vendor/claude-code-tui/ink/` | 98 文件 |
| vendor Components | `TriLC/vendor/claude-code-tui/components/` | 57 文件 |
| shims.js (dist) | `TriLC/dist/tui/ink/shims.js` | 78 行，无源 TS |
| yoga-bridge.js (dist) | `TriLC/dist/tui/ink/yoga-bridge.js` | 80 行，无源 TS |
| constants-bridge.js (dist) | `TriLC/dist/tui/ink/constants-bridge.js` | 5 行，无源 TS |
| package.json | `TriLC/package.json` | react 19, react-reconciler, yoga-layout-prebuilt ✓ |
| 技术设计 | `TriLC/src/tui/tech-design.md` | V0.1, 2026-07-24 |
| TriCompany DESIGN.md | `TriCompany/docs/engineering/DESIGN.md` | V0.1, 2026-04-16 |
| TriCompany code-state.md | `TriCompany/docs/registry/code-state.md` | 最后同步 2026-06-04 |
| TriCade v0.2.0 | `TriMetaverse/TriCade-Bundle-x64-0.2.0.wxs` | WiX installer |
| —— 第六问追加依据 —— | | |
| Contract YAML (×12) | `TriCompany/source-agents/<id>/<id>.contract.yaml` | v2.0, runtime_baseline.host: copilot-host |
| contract-resolver.ts | `TriLC/src/config/contract-resolver.ts` | 226 行, 运行时加载 |
| employee-standard-capabilities.md | `TriCompany/docs/workflow/employee-standard-capabilities.md` | V0.1, 四层架构 |
| employee-capability-sync-audit.md | `TriCompany/docs/workflow/employee-capability-sync-audit.md` | V0.1, 2026-07-12, 9 员工 4 链路完整 |
| host-object-publish-flow.md | `TriCompany/docs/workflow/host-object-publish-flow.md` | V0.1, 11 步发布流程 |
| live-agent-publish-manifest.json | `TriCompany/source-agents/registries/trimetaverse-live-agent-publish-manifest.json` | Copilot-host 单宿主 |
| TriLC env.ts | `TriLC/src/config/env.ts` | tricompanySourcePath 配置 |
| TriLC daemon app.ts (line 593-650) | `TriLC/src/server/app.ts` | Contract resolver 接入 + /internal/v1/agents 端点 |

---

*审计初版完成于 2026-07-24 21:30。第六问（共享 Contract 体系）追加于 2026-07-25 09:20。下次审计触发条件：Phase 2 Ink 冒烟完成或 8h 到达后未交付。*
