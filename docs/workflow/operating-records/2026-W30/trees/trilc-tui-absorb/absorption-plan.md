# TriLC CLI TUI 吸收方案 — 联合收口文档

> 文档编号：`trilc-tui-absorb-3`
> 树节点：`trilc-tui-absorb`
> 收口人：总助 小贾（CEOChiefOfStaff）
> 日期：2026-07-24
> 状态：**收口完成**
> 父节点：CPO 评审（`trilc-tui-absorb-1`）+ CTO 评审（`trilc-tui-absorb-2`）
> 上游：CEO 指令 → 联审简报 `trilc-tui-absorb-review-brief.md`

---

## 前置核查

| # | 核查项 | 结论 |
|---|--------|------|
| 0 | 工作路径核查 | 本方案写入 `docs/workflow/operating-records/2026-W30/trees/trilc-tui-absorb/`，合规 |
| 1 | CEO 输入 | "为 TriLC 包装类似 Claude Code 的 TUI 终端交互界面" |
| 2 | CPO 评审 | ✅ 已阅 — 五组件 MVP，模块归属 TriLC CLI 扩展，红线明确 |
| 3 | CTO 评审 | ✅ 已阅 — 自研 Ink 引擎 vendor 吸收，HTTP SSE 集成，门禁 4 条 |
| 4 | 联审简报 | ✅ 已阅 — CPO/CTO 评审条目均已覆盖，无遗漏 |
| 5 | 吸收链规则 | ✅ `docs/三元宇宙架构与模块说明.md` §2，reference→vendor→src/tui |
| 6 | BusinessStrategy | 不需咨询（不引入新模块、不改变模块边界） |
| 7 | 跨模块影响 | 无（TriPilot/TriMC 不受影响） |

---

## 一、模块归属裁决

> **裁决（CPO APPROVE）：TriLC 附属 CLI 扩展 `trilc chat`，非独立模块。**

TriLC 已被 Business Strategy 定位为"本地人机协作主入口"，`trilc` CLI 是其用户交互面。TUI 只是把 HTTP API 的调用从 `curl` 升级为终端交互式对话——本质是同一个 daemon 的第三种交互通道。对标 Claude Code 范式：`trilc`（无子命令或 `trilc chat`）→ 进入 TUI 交互模式。

**实现约束：**
- 代码路径：`TriLC/src/tui/`，扩展 `src/cli.ts` 的 `chat` 子命令
- 不得单独建仓、独立 npm 包或独立 registry entity
- 产品事实更新到 `TriLC/docs/registry/product-state.md`

---

## 二、MVP 功能范围

### 2.1 CPO 最终裁决：P0 五组件闭环

> **输入框 + 消息列表 + 流式 Markdown 渲染 + thinking 动画 → 连接 TriLC agent loop SSE 端点，完成一轮"用户输入 → agent 思考 → 工具调用（折叠）→ 回复流式展示"完整闭环。**

### 2.2 组件分级总表

| 分级 | 组件 | 映射到 TriLC | 裁决 |
|------|------|-------------|------|
| 🔴 **P0** | **PromptInput** | 用户输入框 | MVP 必须 |
| 🔴 **P0** | **Messages / MessageRow** | 消息列表 | MVP 必须 |
| 🔴 **P0** | **MessageResponse** | SSE 流式增量渲染 | MVP 必须 |
| 🔴 **P0** | **Markdown** | 终端 Markdown 渲染（代码块、粗体、链接） | MVP 必须 |
| 🔴 **P0** | **Spinner / thinking 动画** | "思考中…" 状态指示 | MVP 必须。**不可砍。** 无反馈 = 用户以为卡死。Claude Code 的 thinking 动画是其 TUI 最可见的品牌特征之一 |
| 🟡 P1 | ToolUseLoader | 工具调用明细 UI | H2 追加。MVP 降级为一行动态文本 `[工具] read_file(xxx) ✓` |
| 🟡 P1 | VirtualMessageList | 虚拟滚动 | H2 追加。对话 <100 条时性能收益不明显 |
| 🟡 P1 | FileEditToolDiff | Agent 编辑文件 diff | H2 追加。MVP 降级为 `[已编辑 file.ts]` 通知 |
| 🟡 P1 | SessionPreview | 会话浏览器 UI | H2 追加。MVP 用 `trilc chat --resume <id>` CLI 参数恢复 |
| ⚪ P2+ | Stats / TokenWarning | Token 统计 | 砍掉。运营监控面，不应进用户交互 TUI |
| ⚪ P2+ | ModelPicker | 模型切换 | 砍掉。TriLC 通过 TriModel 统一路由 |
| ⚪ P2+ | Onboarding | 新用户引导 | 砍掉。用 `trilc chat --help` + README 覆盖 |
| ⚪ P2+ | Settings / ThemePicker | 设置/主题 | 砍掉。MVP 不做主题系统 |
| ⚪ P2+ | HistorySearchDialog | 历史搜索 | 砍掉。H3 功能，终端 TUI 搜索体验天然受限 |
| ⚪ P2+ | Permissions 系列 | 权限审批 UI | 砍掉。CLI 工具走 stderr + y/n 确认 |
| ⚪ P2+ | StatusLine | 底部状态栏 | 砍掉。过度设计，状态合入 Spinner 区域 |
| ❌ P3 | Feedback / Surveys | 反馈/调查 | 砍掉。走 IPD 经营记录通道 |

### 2.3 最小 UX 布局（单屏四元素）

```
┌─────────────────────────────────────────┐
│  [user] 帮我整理本周工作                  │  ← PromptInput (底部固定)
│                                         │
│  ⣾ 思考中...                            │  ← Spinner (等待态)
│                                         │
│  ## 本周工作总结                         │  ← MessageResponse (流式 Markdown)
│  1. 完成了 TriCade MSI 打包...            │
│  2. ...                                  │
│                                         │
│  [工具] read_file(work-log.md) ✓         │  ← Tool 状态 (折叠一行)
│                                         │
│  > 还有什么需要我帮忙的吗？               │  ← 最终回复
│                                         │
│  ─────────────────────────────────────  │
│  > _                                    │  ← PromptInput (就绪态)
└─────────────────────────────────────────┘
```

### 2.4 CPO 红线清单（不做的东西）

| 红线项 | 理由 |
|--------|------|
| ❌ 文件树侧栏 | TriPilot 独有功能，TUI 不重复 |
| ❌ 可视化 diff | TriPilot 独有功能，TUI 不重复 |
| ❌ 多会话并行面板 | MVP 单会话模式 |
| ❌ 多轮并行对话 | MVP 单会话模式 |
| ❌ VS Code 扩展联动 | TriPilot 独有功能 |
| ❌ Stats / TokenWarning | 运营监控面，不进入用户交互 |
| ❌ ModelPicker | TriModel 统一路由 |
| ❌ Onboarding 交互式向导 | `--help` + README 覆盖 |
| ❌ Settings / ThemePicker | MVP 不做主题系统 |
| ❌ StatusLine | 过度设计 |
| ❌ Feedback / Surveys | 走 IPD 经营记录通道 |
| ❌ 任何 TriPilot 独有的功能 | TUI = 终端场景，TriPilot = IDE 场景，互补不重叠 |
| ❌ P0 五组件之外的新增组件 | 任何新增需 CPO re-approve |

---

## 三、vendor 冻结清单

### 3.1 重大发现（CTO）

**Claude Code 2.1.88 不使用 npm `ink` 包。** 它的终端 UI 渲染层是一个**完全自研的终端渲染引擎**，位于 `src/ink/`（约 80 个文件），核心依赖 `react` (v19) + `react-reconciler` + `yoga-layout`（原生模块）。这意味着：
1. 不能简单地 `npm install ink`
2. 必须吸收整个 `src/ink/` 作为 vendor 冻结基线
3. 公开 npm `ink` 与本自定义渲染引擎 API 不兼容

### 3.2 🔴 Tier 1 — 渲染引擎核心（必须冻结，~50 文件）

TUI 的物理基础，缺一不可。

| # | 文件/目录 | 用途 |
|---|-----------|------|
| 1 | `src/ink/ink.tsx` | 渲染引擎入口 |
| 2 | `src/ink/renderer.ts` | React reconciler 适配器 |
| 3 | `src/ink/reconciler.ts` | 自定义 React reconciler |
| 4 | `src/ink/screen.ts` | 终端屏幕缓冲区管理 |
| 5 | `src/ink/terminal.ts` | 终端 I/O 抽象 |
| 6 | `src/ink/render-node-to-output.ts` | 组件树 → ANSI 输出 |
| 7 | `src/ink/render-to-screen.ts` | diff/blit 屏幕更新 |
| 8 | `src/ink/dom.ts` | DOM 抽象 |
| 9 | `src/ink/output.ts` | 输出管理 |
| 10 | `src/ink/root.ts` | 根节点创建 createRoot/render |
| 11 | `src/ink/instances.ts` | 多实例生命周期 |
| 12 | `src/ink/selection.ts` | 文本选择 |
| 13 | `src/ink/focus.ts` | 焦点管理 |
| 14 | `src/ink/frame.ts` | 渲染帧调度 |
| 15 | `src/ink/colorize.ts` | ANSI 颜色处理 |
| 16 | `src/ink/styles.ts` | Flexbox 样式属性映射 |
| 17 | `src/ink/measure-text.ts` | 文本测量（含 CJK） |
| 18 | `src/ink/stringWidth.ts` | Unicode 字符宽度 |
| 19 | `src/ink/wrap-text.ts` | 终端宽度内自动换行 |
| 20 | `src/ink/log-update.ts` | 渲染帧日志 |
| 21-24 | `src/ink/layout/yoga.ts` | Yoga 布局引擎绑定（原生模块） |
| 25 | `src/ink/layout/engine.ts` | 布局计算引擎 |
| 26 | `src/ink/layout/node.ts` | 布局节点 |
| 27 | `src/ink/layout/geometry.ts` | 几何计算 |
| 28-31 | `src/ink/components/Box.tsx` | Flexbox 容器 |
| 32 | `src/ink/components/Text.tsx` | 文本组件 |
| 33 | `src/ink/components/ScrollBox.tsx` | 滚动容器 |
| 34 | `src/ink/components/App.tsx` | 应用根组件 |
| 35 | `src/ink/components/AppContext.ts` | 应用上下文 |
| 36 | `src/ink/components/StdinContext.ts` | 标准输入上下文 |
| 37 | `src/ink/components/TerminalSizeContext.tsx` | 终端尺寸上下文 |
| 38-45 | `src/ink/events/*` | 事件系统（键盘/鼠标/焦点/终端） |
| 46-50 | `src/ink/hooks/*` | React hooks（useInput/useApp/useTerminalSize） |
| 51-55 | `src/ink/termio/*` | 终端 I/O 协议（CSI/DEC/OSC/ANSI 转义码） |

### 3.3 🟡 Tier 2 — 核心 UI 组件（建议冻结，~15 文件）

MVP 消息流和输入框的直接依赖。

| # | 文件/目录 | 用途 | MVP 必要性 |
|---|-----------|------|-----------|
| 1 | `src/ink.ts` | CC 的 Ink wrapper（ThemeProvider 包裹） | 🔴 必须 |
| 2 | `src/components/Messages.tsx` | 消息列表容器 | 🔴 必须 |
| 3 | `src/components/Message.tsx` | 消息渲染分发 | 🔴 必须 |
| 4 | `src/components/MessageRow.tsx` | 消息行布局 | 🔴 必须 |
| 5 | `src/components/MessageResponse.tsx` | 助手响应包装 | 🔴 必须 |
| 6 | `src/components/Markdown.tsx` | 终端 Markdown 渲染 | 🔴 必须 |
| 7 | `src/components/TextInput.tsx` | 文本输入基类 | 🔴 必须 |
| 8 | `src/components/PromptInput/PromptInput.tsx` | 输入框主组件 | 🔴 必须 |
| 9 | `src/components/design-system/` | ThemeProvider/ThemedBox/ThemedText/color | 🔴 必须 |
| 10 | `src/hooks/useTerminalSize.ts` | 终端尺寸 hook | 🔴 必须 |
| 11 | `src/components/VirtualMessageList.tsx` | 虚拟滚动 | 🟡 建议 |
| 12 | `src/components/MarkdownTable.tsx` | Markdown 表格 | 🟡 建议 |
| 13 | `src/components/Spinner/` | 加载动画 | 🟡 建议 |
| 14 | `src/components/PromptInput/inputPaste.ts` | 粘贴处理 | 🟡 建议 |
| 15 | `src/hooks/useSettings.ts` | 设置 hook | 🟡 建议 |
| 16 | `src/cli/print.ts` | 纯文本 fallback | 🟡 建议 |

### 3.4 ⚪ Tier 3 — 砍掉（TriLC 不需要）

| 文件/目录 | 砍掉理由 |
|-----------|---------|
| `src/components/App.tsx` | CC 专属（IDE 集成、自动更新） |
| `src/components/Onboarding.tsx` | CC 专属引导 |
| `src/components/Permissions/*` | TriLC 用 bypassPermissions |
| `src/components/Settings/*` | CC 设置面板 |
| `src/components/ModelPicker.tsx` | 模型固定走 TriModel |
| `src/components/Feedback*.tsx` | 反馈走 IPD 通道 |
| `src/components/ToolUseLoader.tsx` | MVP 降级为一行动态文本 |
| `src/components/agents/*` | CC 子代理系统 |
| `src/components/mcp/*` | MCP 服务器 |
| `src/components/teams/*` | CC 协作模式 |
| `src/components/skills/*` | CC skill 系统 |
| `src/components/tasks/*` | CC 任务列表 |
| `src/components/Desktop*.tsx` | 桌面集成 |
| `src/components/ide/*` | IDE 状态指示 |
| `src/components/AutoUpdater*.tsx` | TriLC 走 TriCade 分发 |
| `src/main.tsx` | CC 入口（TriLC 用自己 CLI） |

---

## 四、技术架构

### 4.1 技术栈选型（CTO APPROVE）

Claude Code 自研 Ink 引擎（vendor 吸收）— 不引入 npm `ink`。

| 对比维度 | CC 自研 Ink ✅ | npm `ink` 7.1.1 | 纯 readline |
|----------|---------------|-----------------|-------------|
| API 兼容 | 与 CC 源码完全一致 | 不同 API，需大量适配 | 需自建全部 |
| 虚拟滚动 | VirtualMessageList 已实现 | 需自行实现 | 不可行 |
| 组件生态 | Box/Text/ScrollBox 等 | 不同实现 | 无 |
| 性能 | diff/blit 屏幕更新 | 全量重渲染 | 无优化 |
| 维护成本 | vendor 冻结不动，只改 TriLC 层 | 需从零学习 | 极高 |
| React 依赖 | react 19 + react-reconciler | react 18/19 | 无 React |

### 4.2 集成方式（CTO APPROVE）

HTTP API SSE（`localhost:8711`），与 TriPilot 同协议路径。

```
┌──────────────────────────────────────────────────┐
│  TriCade 内置终端（xterm.js / PowerShell / Git Bash）│
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  trilc chat (TUI)                          │  │
│  │  ┌──────────┐  ┌───────────┐  ┌────────┐  │  │
│  │  │PromptInput│  │ Messages  │  │Spinner │  │  │
│  │  └──────────┘  └───────────┘  └────────┘  │  │
│  │         │              ▲                   │  │
│  │         ▼              │ SSE event-stream  │  │
│  │  ┌──────────────┐      │                   │  │
│  │  │ api-client.ts│──────┘                   │  │
│  │  └──────┬───────┘                          │  │
│  └─────────┼──────────────────────────────────┘  │
│            │ HTTP POST /chat/completions          │
│            │ Accept: text/event-stream            │
│            ▼                                      │
│  ┌────────────────────────────────────────────┐  │
│  │  TriLC Daemon (:8711)                      │  │
│  │  ┌──────────┐  ┌────────────┐             │  │
│  │  │agent-core│──│TriModel    │─── TriMC    │  │
│  │  └──────────┘  └────────────┘   (fallback)│  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**调用链：**
```
用户输入 → TUI PromptInput
    → POST http://127.0.0.1:8711/chat/completions
    → Accept: text/event-stream
    → SSE 事件流解析
    → Message 组件增量渲染
```

**选择理由（与 CTO-008-M/CTO-008-P 一致）：**
1. TriLC daemon 是独立进程，TUI 作为 thin client 通过 HTTP 调用，进程隔离
2. daemon 已实现完整 SSE，TUI 直接消费即可获得实时增量渲染
3. TriMC fallback 透明，TUI 完全无感知
4. TriPilot 已通过同一 HTTP API 路径完成 SSE 流式验证

**Ctrl+C 行为：** 第一次 → 取消当前 agent 任务（`POST /internal/v1/sessions/{id}/cancel`）；第二次 → 退出 TUI。

### 4.3 真实实现路径

```
TriLC/
├── vendor/claude-code-tui/     # 冻结基线（只读，不修改）
│   ├── ink/                    # Tier 1：~50 渲染引擎文件
│   ├── ink.ts                  # Tier 2：CC wrapper（参考）
│   └── components/             # Tier 2：~15 核心 UI 组件（参考）
│
├── src/tui/                    # 真实实现（自研薄适配层）
│   ├── app.tsx                 # TriLC TUI 应用主组件
│   ├── messages-panel.tsx      # 消息列表面板
│   ├── input-panel.tsx         # 输入面板
│   ├── markdown-renderer.ts    # Markdown 渲染适配
│   ├── spinner.tsx             # 加载指示器
│   ├── api-client.ts           # TriLC HTTP API SSE 客户端
│   └── index.ts                # `trilc chat` 命令入口
│
└── src/cli.ts                  # 扩展现有 CLI，添加 `chat` 子命令
```

---

## 五、终端兼容矩阵

### 5.1 兼容性总表

| Shell 环境 | VT/ANSI | Unicode | 颜色 | 风险评估 |
|-----------|---------|---------|------|---------|
| **TriCade Electron 终端（xterm.js）** | ✅ 完整 | ✅ | ✅ TrueColor | 🟢 低风险 |
| **PowerShell (Windows Terminal)** | ✅ xterm-256color | ✅ | ✅ TrueColor | 🟢 低风险 |
| **PowerShell (conhost)** | ✅ Win10+ VT | ✅ | ✅ 256 色 | 🟢 低风险 |
| **Git Bash (Mintty)** | ✅ 完整 | ✅ | ✅ TrueColor | 🟢 低风险 |
| **WSL** | ✅ 完整 | ✅ | ✅ TrueColor | 🟢 低风险 |
| **cmd.exe** | ✅ Win10 1607+ | ⚠️ 部分需 chcp 65001 | ✅ 256 色 | 🟡 中低风险 |

### 5.2 推荐优先级

1. 🥇 **TriCade 内置终端**（xterm.js，最一致）
2. 🥈 **PowerShell (Windows Terminal)**
3. 🥉 **Git Bash (Mintty)**
4. ⚠️ **cmd.exe**（仅基础英文支持；中文需 `chcp 65001`，标记为 known limitation）

### 5.3 已知风险与缓解

| 风险 | 影响 | 缓解 |
|------|------|------|
| cmd.exe Unicode | 中文乱码 | `chcp 65001` 自动设置；文档注明推荐 PowerShell/Git Bash |
| Yoga 原生模块 | TriCade Electron Node.js 不兼容 | 优先纯 JS fallback（`yoga-layout-prebuilt`）；vendor 保留原生绑定供后续 |
| 终端尺寸查询 | 部分模拟器不支持 CSI 查询 | CC renderer.ts 已有 `process.stdout.columns/rows` fallback |
| 鼠标事件 | cmd.exe 不支持鼠标 | MVP 纯键盘交互，不需要鼠标 |
| Alt/Ctrl 组合键 | 不同终端编码不同 | CC parse-keypress.ts 已处理多数差异 |
| SSE 流中断 | 终端挂起时连接断开 | daemon session-store 支持 `POST /sessions/{id}/recover` |

---

## 六、打包影响

### 6.1 新增依赖

| 依赖 | 解压体积 | 说明 |
|------|---------|------|
| `react` v19 | ~168 KB | 运行时 |
| `react-reconciler` | ~1,643 KB | CC 自研 Ink 的 reconciler 运行时 |
| `marked` | ~80 KB | Markdown 解析 |
| `chalk` | ~43 KB | 终端颜色 |
| CC Ink 引擎（vendor 编译后） | ~800 KB | ~50 TS 文件编译产物 |
| TriLC TUI 实现（src/tui） | ~50 KB | 薄适配层 |
| **合计（新增）** | **~3.0 MB** | 解压后体积 |

### 6.2 构建影响

- TriLC 当前 `node_modules/` 约 15 MB → 新增后约 18 MB
- MSI 增量预估：**+2-3 MB**（经压缩后）
- Node.js ≥20.0.0 版本一致，零冲突
- 无需修改 TriCade 构建脚本（TriLC 的 `npm install` 已存在）
- vendor 源码（编译前）不打包，仅编译产物进 `dist/`
- `package.json` 新增依赖：`react`, `react-reconciler`, `marked`, `chalk`

---

## 七、实施路线图（6.5-9.5h）

### Phase T0：vendor 基线建立（0.5h）

| Step | 动作 | 产出 |
|------|------|------|
| T0.0 | 复制 CC TUI 源码到 `TriMetaverse/reference/claude-code-2.1.88/` | reference 入仓 |
| T0.1 | 从 reference 提取 → `TriLC/vendor/claude-code-tui/` | vendor 基线 |
| T0.2 | `TriLC/.gitignore` 确认 vendor/ 排除规则 | 配置 |
| T0.3 | `TriLC/tsconfig.json` 新增 paths 别名映射 | 编译配置 |

**门禁：** `ls TriLC/vendor/claude-code-tui/ink/ink.tsx` 存在 ✅

### Phase T1：核心渲染 MVP（3-4h）

| Step | 动作 | 产出 |
|------|------|------|
| T1.1 | 建立 `src/tui/app.tsx`（最小 App 组件） | TUI 应用壳 |
| T1.2 | 建立 `src/tui/api-client.ts`（SSE 客户端） | HTTP SSE 通信层 |
| T1.3 | 建立 `src/tui/messages-panel.tsx`（消息渲染） | 消息列表 |
| T1.4 | 建立 `src/tui/input-panel.tsx`（输入框） | 用户输入 |
| T1.5 | 建立 `src/tui/markdown-renderer.ts` | Markdown 渲染 |
| T1.6 | 扩展 `src/cli.ts`（添加 `trilc chat` 子命令） | CLI 入口 |
| T1.7 | 新增 `package.json` 依赖（react, react-reconciler, marked, chalk） | 依赖安装 |

**门禁：** 发送 "hello" → 收到 AI SSE 流式回复 → 终端可见 ✅

### Phase T2：体验打磨（2-3h）

| Step | 动作 | 产出 |
|------|------|------|
| T2.1 | 虚拟滚动（基于 vendor VirtualMessageList） | 长对话性能 |
| T2.2 | 加载动画（基于 vendor Spinner） | thinking 指示器 |
| T2.3 | 历史消息恢复（`GET /sessions` → 上次对话） | 会话恢复 |
| T2.4 | Ctrl+C 中断 + 会话持久化 | 交互健壮性 |
| T2.5 | 纯文本 fallback 模式（`--print`） | 非 TUI 模式 |

**门禁：** 30+ 条消息无明显卡顿；`Ctrl+C` 中断后 daemon 状态正常 ✅

### Phase T3：打包与兼容（1-2h）

| Step | 动作 | 产出 |
|------|------|------|
| T3.1 | TriCade MSI 集成确认（`trilc chat` 加入 PATH） | MSI 打包 |
| T3.2 | PowerShell/cmd/Git Bash 三终端冒烟测试 | 兼容验证 |
| T3.3 | Electron 终端（xterm.js）冒烟测试 | TriCade 验证 |
| T3.4 | 更新 TriLC README 和用户文档 | 文档 |

**门禁：** 三种 shell 下 `trilc chat` 均能正常启动和对话 ✅

---

## 八、门禁条件（4 条 CTO 门禁）

| # | 门禁 | 状态 | 说明 |
|---|------|------|------|
| ① | **先补 reference 入仓** | ⬜ 待执行 | `TriMetaverse/reference/claude-code-2.1.88/` 必须存在才能开始 vendor 提取 |
| ② | **Yoga 用纯 JS 替代原生** | ⬜ 待执行 | 先用 `yoga-layout-prebuilt`（纯 JS）跑通 MVP；vendor 中保留原生绑定供后续优化 |
| ③ | **cmd.exe 中文标记为 known limitation** | ⬜ 待执行 | 文档注明推荐使用 PowerShell / Git Bash；中文场景自动 `chcp 65001` |
| ④ | **时间预算 6.5-9.5h** | ⬜ 待监控 | T0 (0.5h) + T1 (3-4h) + T2 (2-3h) + T3 (1-2h)；超预算时严格 MVP 裁剪 |

---

## 九、风险总表

| 风险 | 严重度 | 缓解 |
|------|--------|------|
| TriLC daemon 崩溃导致会话丢失 | 🟡 中 | 依赖 TWF-001 任务树恢复 + `POST /sessions/recover` |
| CC Ink 引擎 ~50 文件，vendor 管理复杂 | 🟡 中 | vendor 冻结不动；只在 `src/tui/` 薄封装；CodeGraph 排除 vendor/ |
| Yoga 原生模块不兼容 TriCade Node.js | 🟡 中 | 先用纯 JS fallback；vendor 保留原生绑定 |
| MVP 范围蔓延（"再加一个组件…"） | 🔴 高 | CPO 已明确 P0 五组件上限；任何新增需 CPO re-approve |
| PromptInput 耦合 CC 专属逻辑太深 | 🟡 中 | MVP 直接复用核心 + 替换 CC 特定 hooks 为 noop |
| TUI 与 TriCade 内置终端 ANSI 不兼容 | 🟡 中 | T3 三终端冒烟测试；CC 已验证 PS/Git Bash |
| 总实现时间超预算 | 🟡 中 | 严格 MVP 裁剪；Tier 3 全部砍掉；T2 优先虚拟滚动 |
| cmd.exe Unicode 乱码 | 🟢 低 | `chcp 65001`；known limitation 文档标注 |

---

## 十、联合裁决签署

| 裁决项 | CPO 裁决 | CTO 裁决 | 最终 |
|--------|----------|----------|------|
| **模块归属** | APPROVE — TriLC CLI 扩展 `trilc chat`，非独立模块 | APPROVE — 路径写在 `TriLC/src/tui/` | ✅ 一致 |
| **MVP 范围** | APPROVE — P0 五组件，P1 四组件 H2 追加 | APPROVE — Tier 2 核心组件对齐 CPO 五组件 | ✅ 一致 |
| **技术栈** | N/A（产品面） | APPROVE — CC 自研 Ink 引擎 vendor 吸收 | ✅ |
| **集成方式** | N/A（产品面） | APPROVE — HTTP API SSE `localhost:8711` | ✅ |
| **vendor 冻结** | N/A（产品面） | Tier 1（~50 文件）+ Tier 2（~15 文件） | ✅ |
| **打包影响** | APPROVE — 委托 CTO | APPROVE — +3 MB 解压，Node.js ≥20 | ✅ |
| **终端兼容** | APPROVE — 委托 CTO | APPROVE — PS/Git Bash/Electron ✅, cmd.exe chcp 65001 | ✅ |
| **与 TriPilot 区分** | APPROVE — 互补不重叠 | N/A（产品面） | ✅ 一致 |

### 总体收口裁决：**APPROVE**

CPO 与 CTO 评审结论完全一致，无分歧。吸收路径可行，技术风险可控。附带 4 条 CTO 门禁条件 + CPO 红线清单，进入执行阶段。

---

## 十一、下一步

1. **CTO（小狄）**：执行 Phase T0，补 reference 入仓 + vendor 基线建立（0.5h）
2. **CTO（小狄）**：T0 完成后启动 Phase T1 MVP 核心开发（3-4h）
3. **总助（小贾）**：更新 `tree-op.json` 中 `trilc-tui-absorb-3` 节点状态为 `done`
4. **CPO（小乔）**：CTO 确定 vendor 冻结后，补审 Tier 2 文件清单是否包含非 MVP 组件
5. **总助（小贾）**：回填 W30 未决事项，标记 trilc-tui 树为收口完成

---

## 依据

| 依据 | 来源 |
|------|------|
| CPO 产品评审 | `docs/workflow/operating-records/2026-W30/trilc-tui-cpo-review.md` |
| CTO 技术评审 | `docs/workflow/operating-records/2026-W30/trilc-tui-cto-review.md` |
| 联审简报 | `docs/workflow/operating-records/2026-W30/trilc-tui-absorb-review-brief.md` |
| 吸收链规则 | `docs/三元宇宙架构与模块说明.md` §2 |
| BusinessStrategy | `docs/registry/business-strategy-state.md` — TriLC Phase 1 L1 |
| TriLC 产品状态 | `TriLC/docs/registry/product-state.md` |
| TriLC daemon API | `TriLC/src/server/app.ts`（CTO-008-M 已实现） |
| Claude Code 2.1.88 源码 | `D:\OneDrive\Code\ai\claude-code-2.1.88\source-repo\` |
| 树操作计划 | `docs/workflow/operating-records/2026-W30/trees/trilc-tui-absorb/tree-op.json` |
