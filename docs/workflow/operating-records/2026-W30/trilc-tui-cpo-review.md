# TriLC CLI TUI 产品评审 — CPO 裁决

- 裁决人：CPO 小乔
- 日期：2026-07-24
- 来源：CEO 指令 → 总助（小贾）驱动 CPO+CTO 联审
- 关联文档：`trilc-tui-absorb-review-brief.md`（同目录联审简报）
- 裁决类型：`APPROVE`（产品事实齐全、模块成熟度足够、符合当前商业实验边界）

---

## 一、核查摘要

| 核查项 | 结论 |
|--------|------|
| 模块归属 | TriLC 附属 CLI 扩展，非新模块（与总助简报一致） |
| BusinessStrategy 咨询 | 不需（不引入新模块、不改变模块边界） |
| 吸收链合规 | 已确认 `reference/` → `vendor/` → `src/tui/` 三段吸收 |
| 现有资产 | TriLC daemon HTTP API 完备（9 个端点，含 SSE 流式 + agent loop） |
| 跨模块影响 | 无（不涉及 TriPilot/TriMC 变更） |
| 当前产品阶段 | TriLC 处于 Phase 1 L1（DISCOVERY），成熟度需继续细化 |

---

## 二、模块归属裁决

### 裁决：`APPROVE` — TriLC 附属 CLI 子命令，非独立模块

**理由：**

1. **TriLC 的架构定位已经是交互主入口**。Business Strategy 将 TriLC 定义为"本地人机协作主入口"、"分布式员工工位"，`trilc` CLI 是 TriLC 的用户交互面。TUI 只是把 HTTP API 的调用方式从 `curl` 升级为终端交互式对话——本质是同一个 daemon 的第三种交互通道（curl/API → CLI daemon 管理 → TUI 交互对话）。

2. **不满足独立模块的充分条件**。TUI 没有独立的商业职责、不引入新的模块边界、不产生独立的 registry 实体、不新增跨模块依赖。拆成独立模块只会制造不必要的模块碎片，增加同步成本。

3. **对标 Claude Code 的终端入口**。Claude Code 的 TUI（Ink React）本身就是其 CLI 的一部分，`claude` 命令的无参启动就是进入交互模式。TriLC 应遵循同样的范式：`trilc`（无子命令）→ 进入 TUI 交互模式。

### 实现约束

- TUI 代码路径：`TriLC/src/tui/`，作为 `cli.ts` 的新子命令（`trilc chat` 或 `trilc` 无参默认）
- 不得单独建仓、独立 npm 包或独立 registry entity
- 产品事实更新到 `TriLC/docs/registry/product-state.md`，不新增独立产品文件

---

## 三、MVP 范围裁决

### 裁决：`APPROVE` — 五组件 MVP，四组件 H2，其余砍掉

Claude Code 2.1.88 有 ~200 个 Ink React 组件。按 MVP 必要性分三档：

### 🔴 P0 — MVP 必须（5 组件）

| 组件 | 映射到 TriLC | 理由 |
|------|-------------|------|
| **PromptInput** | 用户输入框 | 唯一的交互入口，没有它 TUI 不成立 |
| **Messages / MessageRow** | 消息列表 | 对话可见性的基本载体 |
| **MessageResponse** | SSE 流式增量渲染 | TriLC 已有 `POST /internal/v1/agent` SSE 端点；流式体验是"像 Claude Code"的核心感知 |
| **Markdown** | 终端 Markdown 渲染（代码块、粗体、链接） | AI 回复几乎全是 Markdown；至少支持代码块高亮、粗体、列表 |
| **Spinner / thinking 动画** | "思考中…" 状态指示 | **关键 UX 信号**。无反馈 = 用户以为卡死。Claude Code 的 thinking 动画是其 TUI 最可见的品牌特征之一 |

### 🟡 P1 — H2 追加（4 组件）

| 组件 | MVP 砍掉理由 | H2 追加条件 |
|------|-------------|------------|
| **ToolUseLoader** | Agent loop 会调用工具，但 MVP 阶段可折叠为"工具调用中…"一行状态文本 | 用户反馈需要看到具体工具调用细节（tool name + args 摘要）时启动 |
| **VirtualMessageList** | 初期对话不会超过终端缓冲区长度；虚拟滚动性能收益在 <100 条消息时不明显 | 用户报告滚动卡顿或对话长度 >200 条时引入 |
| **FileEditToolDiff** | Agent 编辑文件时，终端里做语法高亮 diff 复杂度高；MVP 可降级为"[已编辑 file.ts]"通知 | 用户需要审查代码变更时，引入最小 diff（±行号 + 变更行文本，不要求语法高亮） |
| **SessionPreview** | TriLC 的 `GET /internal/v1/sessions` 端点已存在，但 MVP 阶段用户用 `trilc chat --resume <id>` 即可恢复，不需要 UI 浏览器 | 会话积累 >20 个，命令行恢复体验下降时引入 |

### ⚪/❌ P2+ — MVP 明确砍掉

| 组件 | 砍掉理由 |
|------|---------|
| Stats / TokenWarning | Token 统计属于运营监控面，不应进入用户交互 TUI；用户在对话中看到 token 计数只会增加认知负担 |
| ModelPicker | TriLC 通过 TriModel 统一管理模型路由；TUI 不做模型切换 UI |
| Onboarding | 新用户引导用 `trilc chat --help` 和 README 覆盖；不做交互式新手向导 |
| Settings / ThemePicker | MVP 阶段不做主题系统 |
| HistorySearchDialog | H3 功能；对话历史搜索在终端 TUI 里体验天然受限 |
| Permissions 系列 | `trilc` 作为 CLI 工具，权限审批走终端 stderr 输出 + y/n 确认，不需要 TUI 组件 |
| StatusLine | 终端底部状态栏过度设计；MVP 阶段状态合入 Spinner 区域 |
| Feedback / Surveys | 反馈走 IPD 经营记录通道，不嵌入产品终端 |

### MVP 功能清单（一句话）

> **输入框 + 消息列表 + 流式 Markdown 渲染 + thinking 动画 → 连接 TriLC agent loop SSE 端点，完成一轮"用户输入 → agent 思考 → 工具调用（折叠）→ 回复流式展示"完整闭环。**

---

## 四、最小 UX 裁决

### 必需交互元素（4 个）

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
│  [工具调用] 已读取 work-log.md            │  ← Tool 状态 (折叠一行)
│                                         │
│  > 还有什么需要我帮忙的吗？               │  ← 最终回复
│                                         │
│  ─────────────────────────────────────  │
│  > _                                    │  ← PromptInput (就绪态)
└─────────────────────────────────────────┘
```

### 关键 UX 决策

1. **thinking 动画不可砍**。这是 P0 而非 P1。Claude Code 和几乎所有 AI TUI 都有 thinking indicator。缺少它，用户在等待 SSE 首字节的 2-5 秒会以为程序卡死。

2. **工具调用折叠为一行**。MVP 阶段不展开工具调用面板。格式：`[工具] read_file(work-log.md) ✓`。用户不需要在终端里看到完整的 tool use JSON。

3. **代码块至少支持基本缩进和高亮**。AI 回复中最常见的 Markdown 元素是代码块（```）。不要求语法高亮引擎（如 Shiki），但至少保留缩进、等宽字体和语言标签。

4. **不支持多轮并行对话**。MVP 阶段单会话模式。`trilc chat` 打开即进入当前会话或新建。多会话切换走 `trilc chat --list` + `trilc chat --resume <id>` CLI 参数。

5. **Ctrl+C 行为**：第一次 Ctrl+C 尝试取消当前 agent 任务（调用 `/internal/v1/sessions/{id}/cancel`）；第二次 Ctrl+C 退出 TUI。

---

## 五、与 TriPilot 的定位区分

### 裁决：互补，不重叠，各自有清晰的不可替代场景

| 维度 | TriPilot（VS Code webview 聊天） | TriLC TUI（`trilc chat`） |
|------|----------------------------------|--------------------------|
| **环境** | VS Code / vscodium IDE 内 | 任意终端（TriCade 内置 / PowerShell / Git Bash / SSH） |
| **用户画像** | 在 IDE 中编码的开发者 | 终端优先用户、远程 SSH 场景、快速任务不需要开 IDE |
| **交互方式** | 图形化 webview，可点击、拖拽、多面板 | 纯键盘终端，单面板打字即聊 |
| **上下文能力** | 自动感知 IDE 打开的文件、光标位置、选区 | 用户显式指定（当前工作目录为默认上下文） |
| **任务类型** | "帮我重构这个函数"、"给这段代码写测试"（IDE 耦合任务） | "帮我查下当前目录的 git log"、"重启 TriLC daemon"（系统级/运维任务） |
| **离线/轻量** | 需要 VS Code 进程（~500MB 内存起步） | 只需要终端 + TriLC daemon（轻量，可 headless） |
| **竞品对标** | GitHub Copilot Chat、Cursor Chat | Claude Code CLI、aider CLI、tgpt |

### 为什么不能合二为一？

- **TriPilot 需要 VS Code 宿主**。用户在 SSH 到服务器、在 TriCade 内置终端、或在 Windows Terminal 里想做快速 AI 问答时，不会为此启动一个完整的 VS Code。
- **`trilc chat` 是 TriLC 的"第一性 CLI"**。TriLC 的 HTTP API 已经完备，TUI 是这些 API 的最自然消费者。如果用户只能用 curl 调 API 或者必须开 VS Code 才能聊天，TriLC 的"本地人机协作主入口"定位就是半残的。
- **TriPilot 的 VS Code webview 不擅长纯终端场景**。终端里的语法高亮、ANSI 颜色、流式增量渲染在 webview 里是降级体验；反过来，webview 的富交互（多面板、拖拽文件、图片预览）在终端 TUI 里也无法复现。

### 边界红线

- TUI **不做任何 TriPilot 独有的功能**：不做文件树侧栏、不做多会话并行面板、不做可视化 diff、不做 VS Code 扩展联动。
- TriPilot **不做终端模拟**：不内置 xterm.js 试图覆盖 `trilc chat` 的场景。
- 两者共享 TriLC daemon 后端，入口不同、交互模型不同，这是合理的产品矩阵架构。

---

## 六、依赖与风险

### 依赖检查

| 依赖 | 状态 | 备注 |
|------|------|------|
| TriLC HTTP API | ✅ 就绪 | 9 个端点，含 SSE 流式 + agent loop |
| TriLC daemon 稳定性 | 🟡 中等 | 当前仍处 DISCOVERY 阶段，daemon 崩溃恢复需 TWF-001 覆盖 |
| TriModel 模型路由 | 🟡 coding | TriLC 已作为 TriModel 消费者集成，但模型层自身仍在开发 |
| TriCade 内置终端兼容性 | 🟡 待验证 | CTO 需评估 ANSI/Unicode/颜色支持 |
| Node.js ≥20.0.0 | ✅ | 当前 TriLC 已要求 |
| 吸收链 `reference/` → `vendor/` | ❌ 未执行 | 需 CTO 先完成吸收链 Step 1-2 |

### 风险

| 风险 | 等级 | 缓解 |
|------|------|------|
| TriLC daemon 崩溃导致 TUI 会话丢失 | 中 | 依赖 TWF-001 任务树恢复 + `POST /internal/v1/sessions/recover` |
| Ink/React 依赖体积影响 TriCade MSI | 低 | CTO 评估；当前 TriLC MSI 体积已有留白 |
| TUI 与 TriCade 内置终端 ANSI 不兼容 | 中 | CTO 需做终端兼容性矩阵测试后再进入开发 |
| MVP 范围蔓延（"再加一个组件..."） | 高 | 本裁决明确 P0 五组件上限；任何新增需 CPO re-approve |

### 不需升级的事项

- 不需咨询 BusinessStrategy（TriLC 已在 Phase 1 L1 模块表中）
- 不需升级到 CEO（不改变商业模式、不引入新模块、不涉及宿主切换）

---

## 七、裁决签署

### 产品裁决

| 裁决项 | 结果 | 理由 |
|--------|------|------|
| **模块归属** | `APPROVE` | TriLC CLI 扩展，非独立模块 |
| **MVP 范围** | `APPROVE` | P0 五组件（PromptInput + Messages + MessageResponse + Markdown + Spinner），P1 四组件 H2 追加 |
| **最小 UX** | `APPROVE` | 单屏四元素布局；thinking 动画 P0 不可砍；工具调用折叠一行 |
| **与 TriPilot 区分** | `APPROVE` | 互补不重叠；TUI = 终端场景，TriPilot = IDE 场景 |
| **总体路线** | `APPROVE` | 吸收链先补 reference/ → vendor/ → src/tui/，CTO 确认技术栈后实施 |

### 下一步

1. **CTO**：完成吸收链 Step 1 (`reference/claude-code-2.1.88/`) → Step 2 (`TriLC/vendor/claude-code-tui/`) 冻结 → 技术栈评估（Ink vs 替代方案）
2. **总助（小贾）**：汇总 CPO+CTO 评审为《TriLC CLI TUI 吸收方案文档》，回填 W30 未决事项
3. **CPO**：CTO 确定技术栈后，补审 vendor 冻结文件清单是否包含非 MVP 组件，防止 scope creep

---

## 依据

- `TriMetaverse/docs/registry/business-strategy-state.md` — TriLC 为 Phase 1 L1 模块，"本地人机协作主入口"
- `TriMetaverse/docs/registry/business-strategy-boundaries.md` — TriLC 与 TriPilot 边界定义
- `TriMetaverse/docs/registry/product-state.md` — 最简可验证模型 + 模块成熟度表
- `TriMetaverse/docs/registry/business-strategy-module-map.md` — TriLC 模块职责定义
- `TriLC/docs/registry/product-state.md` — TriLC 当前产品范围与跨模块依赖
- `TriPilot/docs/registry/product-state.md` — TriPilot 双入口产品规格
- `TriLC/README.md` — TriLC 架构
- `TriLC/src/cli.ts` — 现有 CLI 命令集
- `docs/workflow/operating-records/2026-W30/trilc-tui-absorb-review-brief.md` — 总助联审简报
