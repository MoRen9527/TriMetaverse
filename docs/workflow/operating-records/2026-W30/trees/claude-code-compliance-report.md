# Claude Code 吸收遵循度审计报告

版本：V1.0
日期：2026-07-24
状态：CEO 审阅待批
审计驱动：CEOChiefOfStaff（小贾）
联审成员：CPO（小乔）、CTO（小狄）
审计标准：原样复制 Claude Code 2.1.88 源码（CEO 指令 2026-07-24）

---

## 执行摘要

当前 TriLC TUI 实现（`app.ts` + `render.ts`，纯 `readline`）与 Claude Code 2.1.88 设计模式存在 **致命级偏离**。CPO + CTO 联合审计确认：必须在 5 个维度做根本性纠正。预计废弃 + 重建工时 **~9h**。

**核心结论**：
- ❌ 当前纯 readline 实现：**废弃**
- ✅ vendor Ink 引擎（156 文件已就位）：**继续使用，裁剪 CC 专属路径**
- ✅ Anthropic `/v1/messages`：**强制主路径，daemon 已就绪**
- ✅ Claude Code 组件树：**原样复制 ~14 组件族，CC 专属 ~50 组件排除**

---

## 第一部分：偏离清单（我们 vs Claude Code）

### 1.1 逐层对照

| 架构层 | Claude Code 2.1.88 | 我们当前实现 | 偏离度 | 严重度 |
|--------|-------------------|-------------|--------|--------|
| **入口** | `main.tsx` → Commander CLI → `launchRepl()` → `<App><REPL/></App>` | `render.ts` → 手工 `readline.createInterface()` | 100% | 🔴 致命 |
| **渲染引擎** | `src/ink/` 自研引擎（~80 文件：reconciler + Yoga flexbox + Screen 双缓冲 + ANSI diff/blit） | 无引擎，`process.stdout.write(ANSI)` | 100% | 🔴 致命 |
| **组件架构** | React 组件树（App → Messages → VirtualMessageList → MessageRow → MessageResponse → StreamingMarkdown） | 单文件 `app.ts`(143行)，零组件 | 100% | 🔴 致命 |
| **消息渲染** | `Messages.tsx`(267行) + `MessageRow.tsx` + `MessageResponse.tsx` + `StreamingMarkdown.tsx` | 内联 `renderDelta()` + 7 条正则 | 100% | 🔴 致命 |
| **输入系统** | `PromptInput` 家族（~21 文件）：多行编辑、历史搜索、粘贴处理、模式指示器 | 单行 `readline` 的 `rl.on('line')` | 100% | 🔴 致命 |
| **API 协议** | Anthropic `/v1/messages`（content_block_delta / content_block_start / tool_use） | OpenAI `/chat/completions`（choices[0].delta.content） | 100% | 🔴 致命 |
| **工具调用 UI** | `ToolUseLoader.tsx`（展开面板：tool name + args + result + duration） | 一行文本 `[tool] name ...` | 100% | 🔴 致命 |
| **流式渲染** | 增量 token → Markdown AST → 帧 diff → blit 屏幕 | SSE token → `stdout.write(token)` | 100% | 🔴 致命 |
| **虚拟滚动** | `VirtualMessageList.tsx`（diff/blit 增量，1000+ 条流畅） | 无，全量重绘 | 100% | 🔴 致命 |
| **Session 管理** | Session 持久化 + recovery + 多会话列表 | 无 session 概念 | 100% | 🔴 致命 |
| **Permission** | 完整权限询问 UI + policy 引擎 + `canUseTool` callback | 无 | 100% | 🔴 致命 |
| **Thinking 动画** | `Spinner.tsx` + SpinnerGlyph 帧动画 | 无（仅 `[cancelled]` 提示） | 100% | 🔴 致命 |
| **design-system** | ThemeProvider + ThemedBox + ThemedText + color palette | 硬编码 6 个 ANSI 颜色常量 | 100% | 🔴 致命 |

### 1.2 偏离统计

| 类别 | 偏离项数 | 致命(P0) | 严重(P1) |
|------|---------|----------|----------|
| 渲染引擎 | 3 | 3 | 0 |
| 组件架构 | 5 | 5 | 0 |
| 协议层 | 3 | 3 | 0 |
| 功能层 | 4 | 3 | 1 |
| **合计** | **15** | **14** | **1** |

---

## 第二部分：必须修正的偏离（P0）

### P0-1：废弃纯 readline 实现

| 项目 | 详情 |
|------|------|
| 当前状态 | `app.ts`(143行) + `render.ts`(32行) 纯 readline + process.stdout |
| 修正方案 | 删除 `.ts` 文件，重建 `.tsx` Ink/React 组件树 |
| 影响文件 | `src/tui/app.ts` → 🗑️, `src/tui/render.ts` → 🗑️ |
| 工时 | 0h（删除操作） |
| 责任人 | CTO 裁决 → FullStackDeveloper 执行 |

### P0-2：部署 vendor Ink 渲染引擎

| 项目 | 详情 |
|------|------|
| 当前状态 | vendor 156 文件已就位但未使用 |
| 修正方案 | 创建 `app.tsx` + `render.tsx` 作为 Ink 入口，调用 `vendor/ink/root.ts` 的 `createRoot`/`render` |
| 裁剪范围 | 移除多实例管理、文本选择、超链接渲染、Bun 优化路径、mtime 帧预算 → 预计 15-20MB 运行时 |
| 影响文件 | `src/tui/app.tsx` ✨, `src/tui/render.tsx` ✨ |
| 工时 | 2h |
| 责任人 | FullStackDeveloper |

### P0-3：切换 Anthropic `/v1/messages` 端点

| 项目 | 详情 |
|------|------|
| 当前状态 | `useChat.ts:30` 硬编码 `http://localhost:8711/chat/completions` |
| 修正方案 | 重写 SSE 客户端，消费 Anthropic `content_block_delta` / `content_block_start` 事件 |
| daemon 状态 | `TriLC/src/server/app.ts` line 677 已就绪，含 SSE 流式 + tool use 转换 |
| 影响文件 | `src/tui/hooks/useSSE.ts` ✏️ → `src/tui/hooks/useAnthropicSSE.ts` ✨ |
| 工时 | 1.5h |
| 责任人 | FullStackDeveloper |

### P0-4：原样复制消息组件树

| 项目 | 详情 |
|------|------|
| 当前状态 | 零组件，`app.ts` 内嵌 `renderDelta()` 函数 |
| 修正方案 | 从 `vendor/claude-code-tui/components/` 直接复制 Messages / MessageRow / MessageResponse / Markdown / VirtualMessageList → 适配导入路径 |
| 影响文件 | `src/tui/components/Messages.tsx` ✨, `MessageRow.tsx` ✨, `MessageResponse.tsx` ✨, `Markdown.tsx` ✨, `VirtualMessageList.tsx` ✨ |
| 工时 | 2h |
| 责任人 | FullStackDeveloper |

### P0-5：原样复制输入组件

| 项目 | 详情 |
|------|------|
| 修正方案 | 复制 `PromptInput.tsx` + `TextInput.tsx` + `design-system/` |
| 影响文件 | `src/tui/components/PromptInput.tsx` ✨, `TextInput.tsx` ✨ |
| 工时 | 1h |
| 责任人 | FullStackDeveloper |

### P0-6：实现 Session 持久化

| 项目 | 详情 |
|------|------|
| 修正方案 | 对接 daemon `GET /internal/v1/sessions` + `POST /internal/v1/sessions/recover` |
| 影响文件 | `src/tui/session/store.ts` ✨ |
| 工时 | 1h |
| 责任人 | FullStackDeveloper |

### P0-7：实现 Permission 基础

| 项目 | 详情 |
|------|------|
| 修正方案 | 简化 y/n 问答组件（Ink），复用 daemon permission tier |
| 影响文件 | `src/tui/components/PermissionPrompt.tsx` ✨ |
| 工时 | 1h |
| 责任人 | FullStackDeveloper |

### P0-8：原样复制 ToolUseLoader + Spinner

| 项目 | 详情 |
|------|------|
| 修正方案 | 复制 `ToolUseLoader.tsx` + `Spinner.tsx` |
| 影响文件 | `src/tui/components/ToolUseLoader.tsx` ✨, `Spinner.tsx` ✨ |
| 工时 | 0.5h |
| 责任人 | FullStackDeveloper |

---

## 第三部分：可接受的差异（说明理由）

| 差异项 | CC 原版 | TriLC 版本 | 理由 |
|--------|---------|-----------|------|
| **CC 专属组件** | Teams/MCP/Agents/Skills/AutoUpdater/Desktop*/IDE*/Onboarding/Teleport*/Coordinator*（~50 组件） | 全部排除 | CC 商业产品专属功能，TriLC 不承载 |
| **Stats/TokenWarning** | Token 统计 UI | 排除 | 运营监控面功能，不应进入用户交互 TUI |
| **ModelPicker** | 模型切换 UI | 排除 | TriLC 通过 TriModel 统一管理模型路由 |
| **Feedback/Surveys** | 反馈收集 | 排除 | 走 IPD 经营记录通道，不嵌入产品终端 |
| **Ink 多实例** | `instances.ts` 多实例管理 | 裁剪为单实例 | TriLC 只有 1 个 stdout，无需多实例 |
| **文本选择** | `ink/selection.ts` | 裁剪 | 终端 TUI 场景下不必要 |
| **超链接渲染** | `ink/termio/osc.ts` OSC 8 | 裁剪 | TriLC TUI 不需要终端超链接 |
| **Bun 优化** | `wrapAnsi.ts` Bun 快速路径 | 移除 | TriLC 运行于 Node.js 20+ |
| **Settings/ThemePicker** | 主题设置面板 | 排除 | MVP 不做主题系统 |
| **CC API 认证** | OAuth + API key 管理 | 替换为 TriLC 本地 daemon 直连 | TriLC 无远程 API 认证需求 |
| **MessageTimestamp** | 每条消息显示时间戳 | 排除 | MVP 不必要 |
| **Ctrl+O 展开** | 查看完整 transcript | 排除 | H2 功能 |
| **FpsMetrics** | 帧率监控 | 简化为空 Provider | 开发期可保留，生产禁用 |
| **GrowthBook** | A/B 测试 | 排除 | CC 商业产品功能 |

---

## 第四部分：修正路线图

```
Phase 1: 废弃 + 重建 (~9h)
├── T0: 删除当前纯 readline 实现 (0h)
│   └── 删除 app.ts, render.ts
├── T1: 创建 Ink 入口 (2h)
│   ├── app.tsx ← vendor/ink/root.ts createRoot + render
│   └── render.tsx ← process.stdin/stdout → Ink App
├── T2: Anthropic SSE 客户端 (1.5h)
│   ├── useAnthropicSSE.ts ← POST /v1/messages + content_block_delta 解析
│   └── useChat.ts 重写（Ink 状态管理）
├── T3: 原样复制消息组件 (2h)
│   ├── Messages.tsx, MessageRow.tsx, MessageResponse.tsx
│   ├── Markdown.tsx (StreamingMarkdown)
│   └── VirtualMessageList.tsx
├── T4: 原样复制输入 + 辅助组件 (1.5h)
│   ├── PromptInput.tsx, TextInput.tsx, design-system/
│   ├── Spinner.tsx, ToolUseLoader.tsx
├── T5: Session + Permission (2h)
│   ├── session/store.ts (对接 daemon sessions API)
│   └── PermissionPrompt.tsx (y/n 问答)
└── T6: 集成验证 (1h)
    └── tsc --noEmit + trilc chat 冒烟测试

Phase 2: 体验打磨 (H2, ~4h)
├── Ctrl+C 双段行为（复用 Ink exitOnCtrlC:false）
├── thinking 动画最终调优
├── 工具调用结果展开（当前折叠）
└── Session 自动命名

Phase 3: 持续优化 (L3)
├── Permission policy 缓存（"本次会话始终允许"）
├── 多行输入编辑
├── 历史搜索
└── 虚拟滚动性能基准
```

### 门禁条件

| 门禁 | 内容 | 责任人 |
|------|------|--------|
| G1 | `tsc --noEmit` 零错误 | FullStackDeveloper |
| G2 | `trilc chat` 启动 → daemon `/v1/messages` SSE 流式返回 → 终端渲染 | TestEngineer 小柯 |
| G3 | Session 持久化：退出重启 → 恢复上一会话 | TestEngineer 小柯 |
| G4 | Permission 询问：agent 请求执行命令 → y/n 交互 | TestEngineer 小柯 |
| G5 | 工具调用展示：agent 调用 read_file → ToolUseLoader 展开渲染 | TestEngineer 小柯 |

---

## 第五部分：风险与缓解

| 风险 | 等级 | 缓解 |
|------|------|------|
| 重建工时被低估 | 🟡 中 | 优先直接复制 vendor 文件，最小适配；CTO 跟踪进度 |
| Ink 引擎在 TriCade 内置终端下不兼容 | 🟡 中 | Phase 1 完成即做终端兼容性矩阵测试 |
| 当前 T2 测试报告可信度存疑 | 🔴 高 | Phase 1 完成后要求 **实盘验证**而非代码审查 |
| 过度裁剪导致引擎不稳定 | 🟡 中 | 只裁剪非核心路径（多实例/选择/超链接/Bun），保留 reconciler/layout/screen/renderer 核心 |
| 开发资源冲突 | 🟡 中 | 废弃旧代码后无冲突；CTO 需协调 FullStackDeveloper 时间 |

---

## 第六部分：签署

| 角色 | 裁决 | 签名 |
|------|------|------|
| **CPO 小乔** | APPROVE — P0 14 组件族 + Anthropic 强制 + 废弃 readline | ✅ (cpo-compliance-audit.md) |
| **CTO 小狄** | APPROVE — `/v1/messages` 切换 + vendor Ink 裁剪 + 废弃重建 ~9h | ✅ (cto-compliance-audit.md) |
| **总助 小贾** | APPROVE — 汇总完成，事实齐全，建议 CEO 放行 | ✅ (本报告) |

### 待 CEO 裁决

1. ☐ 批准废弃当前纯 readline 实现，启动原样复制重建
2. ☐ 批准 P0 修正清单（8 项）
3. ☐ 批准可接受差异清单（14 项）
4. ☐ 批准修正路线图（Phase 1 ~9h → Phase 2 ~4h → Phase 3 L3）
5. ☐ 确认 FullStackDeveloper 资源分配
6. ☐ 确认 T2 测试报告需要补做实盘验证

---

## 依据

- `TriLC/src/tui/app.ts`（当前偏离实现）
- `TriLC/src/tui/hooks/useChat.ts`（OpenAI 端点硬编码）
- `TriLC/vendor/claude-code-tui/`（156 文件基线，未使用）
- `TriLC/src/server/app.ts` line 677（daemon `/v1/messages` 端点，已就绪）
- `claude-code-2.1.88/source-repo/src/main.tsx`（CC 入口）
- `claude-code-2.1.88/source-repo/src/replLauncher.tsx`（CC TUI 启动器）
- `claude-code-2.1.88/source-repo/src/components/`（CC 组件目录）
- `claude-code-2.1.88/source-repo/src/ink/`（CC Ink 渲染引擎）
- `docs/workflow/operating-records/2026-W30/trilc-tui-cpo-review.md`（原 CPO 评审）
- `docs/workflow/operating-records/2026-W30/trilc-tui-cto-review.md`（原 CTO 评审）
- `docs/workflow/operating-records/2026-W30/trees/cpo-compliance-audit.md`（CPO 合规审计）
- `docs/workflow/operating-records/2026-W30/trees/cto-compliance-audit.md`（CTO 合规审计）
- `docs/三元宇宙架构与模块说明.md` §2（吸收链规则）
