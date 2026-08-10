# TriLC CLI TUI 吸收方案 — CPO+CTO 联审简报

日期：2026-07-24
来源：CEO 指令，总助（小贾）驱动联审
树节点：`trilc-tui-absorb`（tree-nodes-export.json）

---

## 一、背景

CEO 要求：为 TriLC 包装一个类似 Claude Code 的 TUI（终端交互界面），让用户可以直接在 TriCade 内置终端里用 `trilc` 命令进入交互式 AI 对话界面（类似 Claude Code 的体验），而非只能发 HTTP 请求。

### 当前状态

- TriLC daemon 已提供完整 HTTP API（localhost:8711）
- `trilc` CLI 已支持 `start/stop/status/run` 等 daemon 管理命令
- TriCade MSI v0.2.4 已将 `trilc` 加入系统 PATH
- 用户目前只能用 curl 调 API，**没有交互式终端体验**

### TriLC 现有 HTTP API（可直接对接）

| 端点 | 用途 |
|------|------|
| `GET /healthz` | 健康检查 |
| `POST /chat/completions` | OpenAI 兼容 + SSE 流式 |
| `POST /v1/messages` | Anthropic Messages API + SSE 流式 |
| `POST /internal/v1/agent` | Agent loop 入口（SSE/JSON 双模式） |
| `POST /internal/v1/tasks/submit` | 提交任务 → 返回 sessionId |
| `GET /internal/v1/sessions/{id}/stream` | SSE 事件流 |
| `GET /internal/v1/sessions` | 会话列表 |
| `POST /internal/v1/sessions/recover` | 恢复中断会话 |
| `POST /internal/v1/sessions/{id}/cancel` | 取消任务 |
| `GET /internal/v1/agents` | Agent 列表 |

---

## 二、Claude Code 2.1.88 TUI 参考架构

### 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 终端渲染 | **Ink**（React for Terminal UI） | ~200+ React 组件在 `components/` |
| CLI 解析 | **Commander** + **chalk** | 命令行参数与颜色 |
| 入口 | `main.tsx` → CLI 参数 → Ink render | React 组件树渲染到终端 |
| 核心组件 | Messages / PromptInput / VirtualMessageList / Markdown | 消息列表 + 输入框 + 虚拟滚动 + Markdown 渲染 |
| 流式输出 | SSE 事件驱动渲染 | 实时增量更新 |
| 架构分层 | CLI handlers → Ink components → API client → daemon | 四层解耦 |

### 关键组件清单（用于 MVP 筛选）

| 组件 | 功能 | MVP 必要性 |
|------|------|-----------|
| Messages / MessageRow | 消息列表 + 逐条渲染 | 🔴 必须 |
| PromptInput / TextInput | 用户输入框 | 🔴 必须 |
| VirtualMessageList | 长对话虚拟滚动 | 🟡 建议（性能） |
| Markdown | Markdown → 终端格式 | 🔴 必须 |
| MessageResponse | 流式内容渲染 | 🔴 必须 |
| ToolUseLoader / FallbackToolUseErrorMessage | 工具调用状态展示 | 🟡 建议 |
| Spinner / thinking 动画 | 等待状态指示 | 🟡 建议 |
| Stats / TokenWarning | Token 统计 / 警告 | ⚪ 可选 |
| ModelPicker | 模型切换 | ⚪ 可选 |
| Onboarding | 新用户引导 | ⚪ 可选 |
| Settings / ThemePicker | 设置 / 主题 | ⚪ 可选 |
| HistorySearchDialog | 历史搜索 | ⚪ 可选 |
| FileEditToolDiff | 文件编辑 diff 展示 | 🟡 建议 |
| Permissions 系列 | 权限审批 UI | ⚪ 可选 |
| StatusLine | 状态栏 | ⚪ 可选 |
| Feedback / Surveys | 反馈 / 调查 | ❌ 砍掉 |

---

## 三、吸收链规则检查

来源：`docs/三元宇宙架构与模块说明.md` §2

```
TriMetaverse/reference/ → 模块/vendor/ → 模块真实实现
     只读留档              冻结基线         自研代码
```

### 当前差距

| 步骤 | 状态 | 行动 |
|------|------|------|
| Step 1: `TriMetaverse/reference/claude-code-2.1.88/` | ❌ 未执行 | 需从 `../claude-code-2.1.88/source-repo/` 复制 |
| Step 2: `TriLC/vendor/claude-code-tui/` | ❌ 未执行 | 需从 reference 提取 TUI 相关代码冻结 |
| Step 3: `TriLC/src/tui/` | ❌ 未执行 | 真实实现 |

---

## 四、CPO 评审条目（小乔）

请回答以下四个问题，并给出产品裁决：

1. **产品定位**：这个 TUI 是 TriLC 的附属 CLI 工具，还是独立模块？理由？
2. **MVP 范围**：参考 §二 组件清单，哪些必须吸收？哪些砍掉？给出 MVP 功能列表。
3. **UX 目标**：最少需要多少交互元素？（输入框？消息列表？工具调用展示？thinking 动画？）
4. **与 TriPilot 的区分**：TriPilot 是 VS Code webview 聊天，TriLC TUI 是终端 CLI 聊天。两者定位如何区分？是否互补还是重复？

---

## 五、CTO 评审条目（小狄）

请回答以下五个问题，并给出技术裁决：

1. **吸收路径**：`TriMetaverse/reference/claude-code-2.1.88/ → TriLC/vendor/claude-code-tui/ → TriLC/src/tui/` 是否合理？vendor 应冻结哪些文件？
2. **技术栈选择**：Ink (React) vs blessed / neo-blessed / 纯 Node.js readline？给出推荐和理由（考虑与 TriLC 现有 TypeScript/Node.js 技术栈的匹配）。
3. **集成方式**：直接调用 TriLC HTTP API vs IPC (pipe/socket) vs 进程内嵌入 agent-core？给出推荐和理由。
4. **MSI 打包**：Ink + React 依赖体积评估、Node.js 版本兼容性（当前 TriLC 要求 ≥20.0.0）、对 TriCade MSI 安装包的影响。
5. **终端兼容性**：TriCade 内置终端环境（PowerShell vs cmd vs Git Bash）对 Ink 渲染的兼容性评估（ANSI 转义码、Unicode、颜色支持等）。

---

## 六、联合输出要求

CPO + CTO 评审完成后，总助将汇总为一份《TriLC CLI TUI 吸收方案文档》，包含：

1. 模块归属裁决
2. MVP 功能范围
3. vendor 冻结清单
4. 技术架构选型
5. 实施路线图（分阶段）

---

## 七、前置核查摘要（总助已完成）

| 核查项 | 结论 |
|--------|------|
| 模块归属 | TriLC — 本地人机协作主入口的 CLI 扩展，非新模块 |
| 吸收链合规 | 需先补 reference 入仓，再 vendor 冻结，再实现 |
| 现有资产 | TriLC daemon HTTP API 完备，TUI 为纯前端终端渲染 |
| 跨模块影响 | 无（不涉及 TriPilot/TriMC 变更） |
| BusinessStrategy | 不需咨询（不引入新模块、不改变模块边界） |
