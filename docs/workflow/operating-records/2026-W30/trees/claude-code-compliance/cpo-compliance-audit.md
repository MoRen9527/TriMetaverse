# Claude Code 吸收遵循度 — CPO 产品审计

- 审计人：CPO 小乔
- 日期：2026-07-24
- 树节点：`claude-code-compliance`，node: `claude-code-compliance-1`
- 上游：CEO 指令 + 总助（小贾）审计简报
- 裁决类型：**ESCALATE × 1 + APPROVE × 3 + FREEZE × 2**

---

## 前置核查

| # | 核查项 | 结论 |
|---|--------|------|
| 0 | 工作路径 | ✅ 合规：写入 `docs/workflow/operating-records/2026-W30/trees/claude-code-compliance/`，不进入模块源码目录 |
| 0.5 | 归属路由 | ✅ 产品范围/PRD → CPO 收口；本审计属产品判断，在授权范围内 |
| 1 | CEO 最新输入 | "尽量复制 Claude Code 2.1.88 源码，不要自己臆想实现" + 审计四问 |
| 2 | BusinessStrategy | 不需咨询：TriLC 已在 Phase 1 L1 模块表中，TUI 为 TriLC 附属 CLI 扩展，不引入新模块 |
| 3 | 产品真源 | `docs/product/STATE.md`：TriLC 处于 DISCOVERY 阶段；`TriLC/docs/registry/product-state.md`：本地人机协作主入口 |
| 4 | 模块 Registry | TriLC product-state.md 已确认 CLI TUI 为附属扩展；TriLC daemon HTTP API 完备（含 `/v1/messages` Anthropic 端点） |
| 5 | 治理边界 | 本审计不涉及授权矩阵变更；TUI 归属裁决已在 trilc-tui-absorb 中 APPROVE |

---

## 关键发现：当前实现的三层偏离

在进入审计四问之前，先明确偏离事实的全景。当前实现（`trilc-tui-impl`，FullStackDeveloper 小全执行）**不是"部分执行了已批准方案"——而是从头到尾走了完全不同的路径**：

### 偏离全景图

```
已批准方案（CPO+CTO, trilc-tui-absorb）     实际实现（小全, trilc-tui-impl）
─────────────────────────────────────────   ────────────────────────────────
渲染引擎: vendor Ink（自研 reconciler+Yoga） → 纯 readline + stdout 手动 ANSI
API 协议: daemon HTTP API                   → OpenAI /chat/completions
SSE 格式: 同 daemon 协议                    → OpenAI choices[0].delta.content
组件架构: React 组件树（Box/Text/...）       → 单文件 app.ts 143 行
文件数:   ~45 核心文件 + 组件                 → 2 文件（app.ts + render.ts）
依赖:     react/react-reconciler/marked/     → 零新增依赖
         yoga-layout-prebuilt/chalk
```

三层偏离的严重度分析：

| 层 | 偏离性质 | 恢复成本 | 是否阻塞 |
|----|---------|---------|---------|
| **L1: 渲染引擎** | 从 vendor Ink（156 文件已就位）降级为纯 readline | 中（vendor 已在，需重写 app.tsx 组件树） | 🔴 阻塞——CEO 明确要求"尽量复制 CC 源码" |
| **L2: API 协议** | 从 Anthropic `/v1/messages`（daemon line 677 已实现）改为 OpenAI `/chat/completions` | 低（daemon 两端点并存，改 useChat.ts 约 20 行） | 🟡 需修正——但 L2 可独立于 L1 先行修正 |
| **L3: 组件缺失** | Session/Permission/ToolUse/VirtualScroll 全部缺失 | 高（需在 Ink 引擎基础上逐个实现） | 🟡 部分 MVP 可裁剪，见 Q3 |

---

## 审计一问：Claude Code 组件清单 vs 我们零组件 — P0/P1/P2 分级

### Claude Code 2.1.88 真实组件树

基于 CC 2.1.88 源码（`src/components/` + `src/ink/components/`），不是基于 npm `ink` 包的臆想：

```
main.tsx → Commander CLI → launchRepl() → <App> → <REPL>
  ├── Messages.tsx（267行）→ 消息列表容器
  │   └── VirtualMessageList.tsx → 虚拟滚动 + 只渲染可见行
  │       └── MessageRow.tsx → 单条消息布局（用户/助手/系统）
  │           ├── MessageResponse.tsx → 助手响应包装（⎿ 前缀）
  │           │   └── StreamingMarkdown → 流式 Markdown 渲染
  │           └── [用户消息：纯文本]
  ├── PromptInput.tsx（主输入框，~200行）
  │   ├── inputPaste.ts → 粘贴处理
  │   ├── HistorySearch → 历史搜索（Ctrl+R）
  │   ├── ModePicker → 模式切换（普通/计划/代码）
  │   └── ~7 个其他子组件（语法高亮输入、多行编辑、文件引用等）
  ├── ToolUseLoader.tsx → 完整工具调用 UI（展开/折叠、参数显示、状态动画）
  ├── Spinner/ → thinking 动画（SpinnerGlyph + GlimmerMessage）
  ├── Permissions/ → 权限询问 UI（allow/deny/always allow）
  ├── SessionPreview → 会话历史浏览器
  ├── StatusLine → 底部状态栏（模型名、token 数、会话时长）
  └── [CC 专属，不吸收]
      ├── App.tsx → CC 应用容器（IDE 集成、AutoUpdater、Teleport）
      ├── Onboarding.tsx → CC 新手引导
      ├── Settings/ → CC 设置面板
      ├── ModelPicker.tsx → CC 模型切换器
      ├── Desktop*.tsx → 桌面集成
      ├── ide/ → IDE 状态指示
      ├── agents/ → 子代理系统
      ├── mcp/ → MCP 服务器
      ├── teams/ → 协作模式
      ├── skills/ → Skill 系统
      ├── tasks/ → 任务列表
      ├── AutoUpdater*.tsx → 自动更新
      └── Feedback*.tsx → 反馈/调查
```

### 重新分级（基于"尽量复制 CC 源码"指令）

原 CPO 评审（`trilc-tui-cpo-review.md`）给出 P0=5 组件（PromptInput + Messages/MessageRow + MessageResponse + Markdown + Spinner），P1=4 组件。但 CEO 的新指令"尽量复制 CC 源码"向上修正了遵循度要求。以下重新分级考虑了两个维度：**(a) CC 源码原样复制必要性 (b) TriLC 产品场景适配**。

#### 🔴 P0 — 必须按 CC 源码原样吸收（8 组件，比原 P0 多 3 个）

| # | 组件 | CC 源文件 | 原分级 | 新分级 | 升级理由 |
|---|------|----------|--------|--------|---------|
| 1 | **Ink 渲染引擎** | `src/ink/`（50+ 文件） | P0（隐式） | 🔴 P0 | CEO 明确"不要自己臆想实现"。vendor 156 文件已就位，是"复制 CC 源码"的物理基础 |
| 2 | **Messages** | `Messages.tsx`（267行） | P0 | 🔴 P0 | 消息容器，不可替代 |
| 3 | **MessageRow** | `MessageRow.tsx` | P0 | 🔴 P0 | 消息行布局 |
| 4 | **MessageResponse** | `MessageResponse.tsx` | P0 | 🔴 P0 | 助手响应（`⎿` 前缀） |
| 5 | **StreamingMarkdown** | CC Markdown 组件族 | P0 | 🔴 P0 | 流式 Markdown 渲染，当前实现仅 7 条正则，严重降级 |
| 6 | **PromptInput** | `PromptInput.tsx`（~200行 + ~10 子组件） | P0 | 🔴 P0 | 唯一交互入口 |
| 7 | **Spinner** | `Spinner/`（SpinnerGlyph + GlimmerMessage） | P0 | 🔴 P0 | CEO 指令点名的 thinking 动画；原 CPO 已裁决 P0 不可砍 |
| 8 | **VirtualMessageList** | `VirtualMessageList.tsx` | 🟡 P1 | 🔴 P0 | **新升级**。CEO 审计简报点名缺失；CC 源码中 VirtualMessageList 与 Messages 耦合（Messages.tsx 直接依赖它），"复制 CC 源码"意味着必须一起吸收 |

**升级 VirtualMessageList 的理由**：
- CC 的 `Messages.tsx` 第 1-267 行内直接使用 `VirtualMessageList` 作为子组件——它不是"可选性能优化"，而是 CC 消息列表的**架构组件**。要"原样复制" Messages.tsx，就必须同时复制 VirtualMessageList.tsx。
- 即使 TriLC 初期对话量不大，从 CC 源码复制角度，砍掉 VirtualMessageList 就需重写 Messages.tsx——这正是 CEO 要避免的"臆想实现"。

#### 🟡 P1 — H2 追加，但必须用 CC 源码而非自研（5 组件）

| # | 组件 | CC 源文件 | 原分级 | 新分级 | 说明 |
|---|------|----------|--------|--------|------|
| 9 | **ToolUseLoader** | `ToolUseLoader.tsx` | 🟡 P1 | 🟡 P1 | CC 工具调用 UI。原 CPO 裁决赛折叠为一行，但 CEO 点名缺失。**约束**：若实现，必须吸收 CC 源码，不自研简化版 |
| 10 | **SessionPreview** | `SessionPreview` | 🟡 P1 | 🟡 P1 | CC 会话历史。CEO 点名缺失。TriLC daemon 已有 `/sessions` 端点。**约束**：吸收 CC 源码 |
| 11 | **Permissions** | `Permissions/` | ⚪ P2（砍掉） | 🟡 P1 | **新升级**。CEO 点名缺失。CC 的权限询问是工具调用安全门禁。TriLC 当前用 `bypassPermissions`，但长期必须有权限 UI。**约束**：吸收 CC 源码，但 `trilc` CLI 场景下可先映射为终端 stderr + y/n |
| 12 | **FileEditToolDiff** | `FileEditToolDiff` | 🟡 P1 | 🟡 P1 | 文件编辑 diff 展示 |
| 13 | **StatusLine** | `StatusLine` | ⚪ P2（砍掉） | 🟡 P1 | **新升级**。CC 底部状态栏含模型名/token 数，是终端 TUI 的关键 context 信号 |

#### ⚪ P2+ — 明确砍掉（11 类，CC 专属/TriLC 不需要）

| # | 组件/类别 | CC 源文件 | 砍掉理由 |
|---|----------|----------|---------|
| 14 | **App.tsx（CC 版）** | `src/components/App.tsx` | CC 专属容器：IDE 集成、AutoUpdater、Teleport。TriLC 用自建 `app.tsx` |
| 15 | **Onboarding** | `Onboarding.tsx` | CC 新手引导。TriLC 用 `--help` + README 覆盖 |
| 16 | **Settings / ThemePicker** | `Settings/*` | CC 设置面板。MVP 不做主题系统 |
| 17 | **ModelPicker** | `ModelPicker.tsx` | 模型切换。TriLC 通过 TriModel 统一路由，TUI 不暴露模型选择 |
| 18 | **Desktop 集成** | `Desktop*.tsx` | CC 桌面集成（IDE 连接等）。TriLC 是独立 CLI |
| 19 | **IDE 集成** | `ide/*` | CC IDE 状态指示。TriLC 不嵌入 IDE |
| 20 | **Agents（子代理）** | `agents/*` | CC 子代理系统。TriLC 由 daemon agent-core 管理 agent 路由 |
| 21 | **MCP 服务器** | `mcp/*` | CC MCP 集成。TriLC 不依赖 MCP 协议 |
| 22 | **Teams（协作）** | `teams/*` | CC 协作模式。TriLC 单人使用 |
| 23 | **Skills 系统** | `skills/*` | CC skill 市场。TriLC 走 TriSkill 未来统一 |
| 24 | **AutoUpdater** | `AutoUpdater*.tsx` | CC 自动更新。TriLC 走 TriCade MSI 分发 |
| 25 | **Feedback / Surveys** | `Feedback*.tsx` | CC 反馈/调查。TriLC 走 IPD 经营记录通道 |
| 26 | **Tasks（任务列表）** | `tasks/*` | CC 任务管理面板。TriLC daemon 已有 session 管理 |
| 27 | **HistorySearchDialog** | `HistorySearchDialog` | 历史搜索弹窗。P2+：终端 TUI 里搜索体验受限 |
| 28 | **Stats / TokenWarning** | `Stats`, `TokenWarning` | 运营监控面，不应进入用户交互 TUI（原 CPO 裁决维持） |

### 分级汇总

| 分级 | 数量 | 含义 |
|------|------|------|
| 🔴 P0 | **8** | MVP 必须按 CC 源码原样吸收（+3 vs 原 5） |
| 🟡 P1 | **5** | H2 追加，但必须走 CC 源码路径，不臆想 |
| ⚪ P2+ | **14 类** | 明确砍掉（CC 专属/TriLC 不需要） |

---

## 审计二问：三个强制要求的产品影响

CEO 指令蕴含的三个强制要求：

### 要求 1：Anthropic `/v1/messages` 主路径

**当前状态**：
- TriLC daemon **已实现** Anthropic `/v1/messages` 端点（line 677+）：接受 `model/messages/system/max_tokens/stream/tools` 参数，返回 Anthropic 格式 SSE（`content_block_delta`/`content_block_start`/`message_delta`/`message_stop`）
- 当前实现 `useChat.ts:30` 使用 `/chat/completions`（OpenAI 格式）
- 当前实现 `useSSE.ts` 解析 `choices[0].delta.content`（OpenAI SSE 格式）

**产品影响**：🟢 **低**。daemon 两端点并存，无需新增 daemon 能力。改动范围：
- `useChat.ts`：端点从 `/chat/completions` → `/v1/messages`（1 行）
- `useSSE.ts`：SSE 帧解析从 OpenAI `choices[0].delta.content` → Anthropic `content_block_delta.delta.text`（约 30 行重写）
- 请求体格式适配：`messages: [...]` → Anthropic `messages: [{role, content}]` + `system: string`（10 行）

**裁决**：`APPROVE` — 低风险、低成本、daemon 能力已就绪。**必须在修正轮优先执行**，因为这是"复制 CC 源码"的协议基础。

### 要求 2：Ink 引擎原样（vendor Ink 而非 npm ink）

**当前状态**：
- Vendor 156 文件已就位：`TriLC/vendor/claude-code-tui/`（ink/ 98 + components/ 57 + ink.ts 1）
- CTO 已确认：CC 自研 Ink ≠ npm `ink` 包，API 不兼容
- CTO tech-design.md 已设计 45 文件最小子集 + 9 个 Shim 替换方案
- 小柯 smoke test（`test-report.md`）确认 Yoga 引擎 OK
- **当前实现完全未使用 vendor Ink，走了纯 readline 路径**

**产品影响**：🟡 **中**。vendor 已在，但需从零重建组件树：
- 放弃当前 `app.ts`（143 行）+ `render.ts`（32 行）= 共 175 行纯 readline 实现
- 重建 `src/tui/` 下的 React 组件树（app.tsx + messages-panel.tsx + input-panel.tsx + markdown-renderer.ts + spinner.tsx + api-client.ts）
- 引入 npm 依赖：react、react-reconciler、marked、chalk、yoga-layout-prebuilt（约 +3MB）
- CTO 估计 T1 MVP 3-4h 可完成核心渲染

**裁决**：`APPROVE` — 必要但可管理。Vendor 基线已就位，CTO 设计已完备，smoke test 已通过。唯一浪费的是小全已投入的 175 行 readline 实现。

### 要求 3：组件树完整复制（从"五组件自研"到"CC 源码结构复制"）

**当前状态**：
- 原 CPO 批准方案：5 组件（PromptInput + Messages + MessageResponse + Markdown + Spinner），大部分重写极简版，不直接使用 vendor 组件源码
- 当前实现：0 组件，单文件 143 行内嵌 `renderDelta()` 函数
- CEO 新指令：组件树尽量原样复制

**产品影响**：🔴 **高**。这是三个要求中对 MVP 范围影响最大的：

| 维度 | 原 CPO 方案（五组件自研） | 新要求（CC 源码复制） | 差异 |
|------|--------------------------|---------------------|------|
| P0 组件数 | 5 | 8（+VirtualMessageList + Ink 引擎 + StreamingMarkdown） | +60% |
| 吸收策略 | 大部分重写极简版 | 尽量原样复制，只做 Shim 替换 | 策略翻转 |
| Messages.tsx | 轻量版（约 50 行） | 复制 CC Messages.tsx（267 行）+ 依赖链 | +5x 复杂度 |
| PromptInput.tsx | 极简单行（约 30 行） | 复制 CC PromptInput.tsx（~200 行 + ~10 子组件） | +10x 复杂度 |
| Markdown | 7 条正则 | 复制 CC Markdown 组件族（marked + ANSI 转换） | 完整度飞跃 |
| 实施时间 | CTO 估计 3-4h（T1） | 估计 6-10h（需消化 CC 组件依赖链） | 2-3x |
| 长期收益 | 低（自研代码后续与 CC 上游分叉） | 高（CC 上游更新时可 diff 合并） | 质的差异 |

**裁决**：**ESCALATE** — 组件树完整复制对 MVP 边界有重大影响，超出 CPO 单方面裁决范围。升级理由：
1. **原 CPO 裁决的 P0 五组件大部分是"重写极简版"而非"复制 CC 源码"**——这与 CEO 新指令冲突
2. **实施时间从 3-4h 膨胀到 6-10h**，需要 CEO 确认是否接受
3. **PromptInput 全量复制（~200 行 + 10 子组件）vs 极简重写（30 行）** 是典型的"抄代码 vs 抄体验"决策
4. 建议 CEO 在以下两个选项中裁决：

> **选项 A（激进遵循）**：P0 八组件全部从 CC 源码复制，PromptInput 全量（200 行 + 子组件），Messages 全量（267 行 + VirtualMessageList）。估计 6-10h。
>
> **选项 B（务实遵循）**：P0 八组件中，Ink 引擎 + Messages/MessageRow/MessageResponse/StreamingMarkdown/VirtualMessageList/Spinner 走 CC 源码复制；PromptInput 走重写极简版（单行输入不复制 10 个子组件因为粘贴/历史/模式切换在 CLI 场景不必要）。估计 4-6h。

---

## 审计三问：MVP 重新定义

### 问题：P0 是否从五组件扩展到包含 Session/Permission/ToolUse/VirtualScroll？

**逐一裁决**：

| 组件 | 是否进入 P0 | 裁决 | 理由 |
|------|------------|------|------|
| **VirtualMessageList** | ✅ 是 | `APPROVE` — 升入 P0 | CC Messages.tsx 架构依赖；复制 Messages 就必须复制它 |
| **ToolUseLoader** | ❌ 否 | `FREEZE` — 维持 P1 | Agent 工具调用在 `trilc chat` MVP 阶段可折叠为一行文本（原 CPO 裁决维持）。但**若实现必须走 CC 源码** |
| **Session 管理** | ❌ 否 | `FREEZE` — 维持 P1 | TriLC daemon 已有 `/sessions` API + `--resume` CLI 参数；SessionPreview UI 在 <20 会话时不必要 |
| **Permissions** | ❌ 否 | `FREEZE` — 维持 P1 | TriLC CLI 场景下 `bypassPermissions` 可接受；权限确认走终端 stderr + y/n。但**长期必须吸收 CC Permissions 源码** |

### 重新定义的 MVP（V2）

```
MVP V2 = 原 P0 五组件
       + VirtualMessageList（架构依赖，升入 P0）
       + StreamingMarkdown（替换手写正则，升入 P0）
       + Anthropic /v1/messages 协议（替换 OpenAI）
       + Ink 引擎 vendor 吸收（替换纯 readline）
       = 共 8 个 P0 强制项
```

**一句话 MVP**：

> **基于 vendor Ink 引擎（CC 自研 reconciler + Yoga）+ Anthropic `/v1/messages` SSE 协议，复制 CC 的 Messages → VirtualMessageList → MessageRow → MessageResponse → StreamingMarkdown → Spinner 六组件消息渲染链，加上 PromptInput 输入组件，完成"用户输入 → SSE 流式 → 虚拟滚动消息列表 → Markdown 渲染 → thinking 动画"完整闭环。ToolUse 折叠一行，Session/Permission 推迟至 H2。**

### MVP 验证门禁（V2）

| 门禁 | 验证内容 | V1 要求 | V2 要求 |
|------|---------|---------|---------|
| G1 | 消息发送 + SSE 流式响应 | ✅ | ✅ 协议改为 Anthropic `/v1/messages` |
| G2 | Markdown 渲染 | 7 条正则（粗体/斜体/代码/标题/列表/引用） | CC Markdown 组件族（marked + ANSI，含代码块高亮） |
| G3 | 虚拟滚动 | 无要求 | 30+ 条消息无全量重绘 |
| G4 | thinking 动画 | P0 但未实现 | SpinnerGlyph（CC 源码） |
| G5 | 终端兼容性 | 未验证 | PowerShell ✅ / Git Bash ✅ / cmd.exe ⚠️（chcp 65001）|
| G6 | Ctrl+C 中断 + daemon 恢复 | ✅ 已实现（app.ts:123-139） | 维持，不退化 |

---

## 审计四问：Claude Code 组件可裁剪项 — CC 专属功能排除清单

以下为完整排除清单，分为"永久砍掉"和"推迟到 Phase 2+"两类：

### ❌ 永久砍掉（TriLC 架构不需要）

| 类别 | CC 源文件/目录 | 砍掉理由 | 替代方案 |
|------|---------------|---------|---------|
| **IDE 集成** | `Desktop*.tsx`, `ide/*` | TriLC 是独立 CLI，不嵌入 VS Code | 不需要 |
| **自动更新** | `AutoUpdater*.tsx` | TriLC 走 TriCade MSI 分发 | TriCade installer |
| **协作模式** | `teams/*` | TriLC 单人使用 | 不需要 |
| **子代理** | `agents/*` | TriLC daemon agent-core 管理 | daemon 内部路由 |
| **MCP 服务器** | `mcp/*` | TriLC 不依赖 MCP 协议 | 不需要 |
| **Skill 市场** | `skills/*` | 走 TriSkill 未来统一 | TriSkill 模块 |
| **新手引导** | `Onboarding.tsx` | `trilc chat --help` + README 覆盖 | 文档 |
| **反馈/调查** | `Feedback*.tsx` | 走 IPD 经营记录通道 | operating-records |
| **Token 统计** | `Stats`, `TokenWarning` | 运营监控面，不进入交互 UI | daemon 日志 |

### 🟡 推迟到 Phase 2+（MVP 后评估）

| 类别 | CC 源文件/目录 | 推迟理由 | 触发条件 |
|------|---------------|---------|---------|
| **设置面板** | `Settings/*` | MVP 不做主题系统 | 用户反馈需要个性化 |
| **模型切换** | `ModelPicker.tsx` | TriModel 统一路由 | 多 provider 场景需要用户显式选择 |
| **任务列表** | `tasks/*` | daemon session 管理已覆盖 | 用户需要可视化任务管理 |
| **历史搜索** | `HistorySearchDialog` | 终端 TUI 搜索体验受限 | 会话 >50 个，CLI 恢复体验下降 |
| **文件引用** | PromptInput 文件拖拽/引用子组件 | CLI 场景无拖拽 | GUI 宿主（TriPilot）场景 |

### ✅ 保留但适配（CC 源码需 Shim 替换的部分）

| CC 源文件 | CC 依赖 | Shim 策略 | 状态 |
|-----------|---------|----------|------|
| `ink/layout/yoga.ts` | `src/native-ts/yoga-layout/` (CC 私有) | → `yoga-layout-prebuilt` npm | CTO 已设计，待验证 |
| `ink/stringWidth.ts` | `getGraphemeSegmenter` (CC util) | → `Intl.Segmenter` (Node 20+ 原生) | ✅ Node 20 原生支持 |
| `ink/terminal.ts` | `semver` (CC util) | → 删除 progress reporting，MVP 不需要 | 可直接裁剪 |
| `ink/ink.tsx` | `flushInteractionTime` (CC state) | → noop | ✅ |
| `ink/ink.tsx` | `logForDebugging` (CC debug) | → `() => {}` (noop) | ✅ |
| ThemeProvider | `vendor/ink.ts` 包裹层 | → 直接用 `vendor/ink/root.ts` 的 createRoot | CTO 已验证可行 |

---

## 修正优先级与路线图

### 紧急修正（本轮 W30，必须执行）

| 优先级 | 修正项 | 影响文件 | 估计 |
|--------|--------|---------|------|
| 🔴 P0-1 | API 协议：`/chat/completions` → `/v1/messages` | `useChat.ts` + `useSSE.ts` | 0.5-1h |
| 🔴 P0-2 | 渲染引擎：纯 readline → vendor Ink | `app.ts`→`app.tsx`，`render.ts`→`render.tsx` | 3-5h |
| 🔴 P0-3 | 组件树：Messages/MessageRow/MessageResponse/StreamingMarkdown 从 CC 复制 | 新增 4-5 文件 | 2-3h |
| 🔴 P0-4 | VirtualMessageList 从 CC 复制 | 新增 1 文件 | 1-2h |
| 🔴 P0-5 | Spinner 从 CC 复制 | 新增 1 文件 | 0.5-1h |

### H2 追加（W31+）

| 优先级 | 功能 | 触发条件 |
|--------|------|---------|
| 🟡 P1-1 | PromptInput 全量（粘贴/历史/多行） | 用户反馈单行不够用 |
| 🟡 P1-2 | ToolUseLoader 从 CC 复制 | Agent 工具调用频繁，需要可视化 |
| 🟡 P1-3 | SessionPreview 从 CC 复制 | 会话 >20 个 |
| 🟡 P1-4 | Permissions 从 CC 复制 | 安全审计要求 |
| 🟡 P1-5 | StatusLine | 用户体验需要 context 信号 |

---

## 风险与升级

| 风险 | 等级 | 说明 | 建议 |
|------|------|------|------|
| 组件树复制范围争议 | 🔴 高 | PromptInput 全量 vs 极简是"抄代码 vs 抄体验"的典型张力 | **ESCALATE 到 CEO**：在选项 A（激进）和选项 B（务实）中二选一 |
| 实施时间膨胀 | 🟡 中 | V2 MVP 估计 6-10h，原计划 3-4h，+150% | CEO 确认是否接受延期 |
| 小全的 175 行 readline 代码 | 🟢 低 | 全部废弃，但投入量小，损失可控 | 归档为 `tui-poc-readline/` 参考 |
| `trilc-tui-polish` 树污染 | 🟡 中 | 第三棵树（polish）可能在错误基线上叠加工作 | 冻结 polish 树，等 compliance 修正完成后再继续 |
| daemon `/v1/messages` 端点成熟度 | 🟡 中 | 该端点已实现但未经 TUI 实际调用验证 | 先做 smoke test：curl 调 `/v1/messages` → 确认 SSE 帧格式 |
| Yoga 原生模块兼容性 | 🟡 中 | `yoga-layout-prebuilt` 在 TriCade Electron Node.js 下未验证 | CTO 已设计纯 JS fallback；优先走纯 JS 路径 |

---

## 裁决签署

| 裁决项 | 结果 | 说明 |
|--------|------|------|
| P0 组件分级 | `APPROVE` | 8 组件（+3 vs 原 5）：Messages + MessageRow + MessageResponse + StreamingMarkdown + PromptInput + Spinner + VirtualMessageList + Ink 引擎 |
| Anthropic `/v1/messages` | `APPROVE` | 低风险、daemon 已就绪，P0-1 优先执行 |
| Ink 引擎 vendor 吸收 | `APPROVE` | Vendor 156 文件已就位，CTO 设计完备 |
| 组件树完整复制范围 | **ESCALATE** | CEO 需裁决：选项 A（激进，全量复制 PromptInput 等）vs 选项 B（务实，PromptInput 极简，其余走 CC 源码） |
| Session 管理 | `FREEZE` | 维持 P1，daemon API 已覆盖基本需求 |
| Permissions | `FREEZE` | 维持 P1，CLI 场景 bypassPermissions 可接受 |
| ToolUseLoader | `FREEZE` | 维持 P1，MVP 折叠一行 |
| CC 专属排除清单 | `APPROVE` | 11 类永久砍掉 + 5 类推迟到 Phase 2+ |
| `trilc-tui-polish` 树 | `FREEZE` | 冻结等待 compliance 修正完成，避免在错误基线上叠加 |

---

---

## 补充裁决：共享 Contract 体系与 Claude CLI 的产品定位修正

> **触发**：CEO 2026-07-25 发现 — `TriCompany/source-agents/*/*.contract.yaml`（12 份）存活且被 `contract-resolver.ts` 运行时代载。
> **补充日期**：2026-07-25

### 核查确认

| 事实 | 确认 |
|------|------|
| Contract 文件数量 | ✅ 12 份，覆盖全部已上岗 Role Agent + BusinessStrategy |
| Contract 结构 | v2 格式：`agent_id` + `paths`（五件套索引）+ `decision_rights` + `runtime_baseline` |
| 运行时加载 | ✅ `TriLC/src/config/contract-resolver.ts`（227 行）：遍历 `source-agents/` → 读取五件套 → 组装 system prompt |
| 当前宿主基线 | 全部 12 份 contract 的 `runtime_baseline.host: copilot-host` |
| 跨宿主设计 | ✅ `employee-capability-contract.md` 明确：「合约独立于宿主特定格式，在宿主切换时由 contract resolver 解析重建 agent 能力骨架」 |
| TriMC 迁移标记 | 全部 `tri_mc_status: planned`，`tri_mc_migration_ready: false` |

### 产品影响：TUI 定位从"daemon 薄客户端"升格为"contract-aware agent 终端"

当前原 CPO 方案将 TUI 定位为：

```
User → trilc chat → daemon HTTP API → agent-core → model
                     (thin client)
```

但共享 contract 体系存活意味着 Claude CLI 的**正确架构**是：

```
User → trilc chat → contract-resolver（加载 agent 身份）
                 → agent loop（system prompt 来自 contract）
                 → Anthropic /v1/messages → model
                 
         ↑ 共享层 ↑
TriCompany/source-agents/*.contract.yaml
         ↓        ↓
    Copilot-host  Claude CLI
    (现有 live)   (新建终端宿主)
```

### 裁决：**ESCALATE** — TUI 产品分类需从"TriLC CLI 扩展"修正为"contract-aware 终端代理运行时"

| 维度 | 原 CPO 方案（trilc-tui-absorb） | 修正后（含 contract 发现） |
|------|-------------------------------|--------------------------|
| **产品分类** | TriLC CLI 子命令（附属工具） | Claude CLI = contract 体系的新宿主终端 |
| **Agent 身份** | 不携带 agent 身份（通用聊天） | 通过 contract-resolver 加载指定 agent 的 system prompt |
| **与 Copilot-host 关系** | 无关（纯 daemon 消费者） | **共享 contract 层**，两个宿主消费同一份 agent 定义 |
| **runtime_baseline** | 不存在 | 需新增 `host: claude-cli` 支持 |
| **发布管道** | 独立（TUI 代码在 `TriLC/src/tui/`） | 共享：contract 层是唯一真源；Claude CLI 是 contract 的消费者，不需要自己的 agent 定义 |

### 对 MVP 的追加要求

在原 P0 八组件基础上，新增一项 contract 集成要求：

| # | 要求 | 优先级 | 说明 |
|---|------|--------|------|
| P0-6 | **Contract 感知**：`trilc chat` 启动时通过 `--agent <id>` 参数指定 agent 身份，TUI 调用 `contract-resolver` 加载对应 system prompt | 🔴 P0 | 这是"共享合同层驱动两个宿主"的最小可行验证。不要求 UI 暴露 agent 切换（MVP 阶段单 agent 模式），但底层必须走 contract-resolver 而非硬编码 |

**不改动项**（MVP 阶段保持简单）：
- 不要求 TUI 支持多 agent 并行
- 不要求 TUI 暴露 `agent list` 或 agent 切换 UI
- 不要求修改 contract.yaml 的 `runtime_baseline` 字段（先消费现有 contract，不加新字段）
- TUI 的 agent 身份默认值：`ceo-chief-of-staff`（总助是最常用的终端对话 agent）

### 为什么这改变了产品分类

原方案中 TUI 被定位为「TriLC daemon 的第三种交互通道」（curl → CLI daemon 管理 → TUI 交互对话）。但 contract 体系存活的事实表明：

1. **Claude CLI 不是 daemon 的薄客户端**——它是一个**可以独立解析 agent 身份的终端运行时**。即使 daemon 未启动，TUI 理论上也能加载 contract + 直连 Anthropic API（虽然 MVP 阶段通过 daemon 更简单）。
2. **与 Copilot-host 的关系不是"无关"**——两者是同一 contract 层的两个宿主，共享 agent 定义真源。这意味着 Claude CLI 的 agent 行为应与 Copilot-host 语义等价（同一份 system prompt）。
3. **`trilc chat` 不是通用聊天工具**——它是带有 agent 身份的终端代理入口。用户启动的不是"AI 聊天"，而是"与 CEO 总助（小贾）在终端对话"。

### 与迭代策略的一致性

此发现与 CPO-008 迭代策略（`product-state.md` §Iteration Strategy）完全一致：

> "新 agent 一律走 contract YAML 格式，确保双轨兼容"
> "Copilot-host ←─ contract YAML ──→ TriMC (在建宿主)"

Claude CLI 是这个双轨架构的**第三轨**——不是替代 Copilot-host 或 TriMC，而是 contract 体系的第三个消费端。

### 裁决签署（补充）

| 补充裁决项 | 结果 | 说明 |
|-----------|------|------|
| TUI 产品分类 | **ESCALATE** | 从"TriLC CLI 子命令"修正为"contract-aware 终端代理运行时"。需 CEO 确认命名与定位 |
| Contract 集成 | `APPROVE` | P0-6 追加：`trilc chat --agent <id>` 通过 contract-resolver 加载 agent 身份 |
| 发布管道架构 | `APPROVE` | Claude CLI 不建独立 agent 定义管道；消费现有 contract 层 |
| `runtime_baseline` 扩展 | `FREEZE` | 先不加 `claude-cli` host 字段；MVP 阶段消费现有 copilot-host contract |

---

## 使用依据

| 依据 | 来源 |
|------|------|
| 吸收链规则 | `docs/三元宇宙架构与模块说明.md` §2 |
| CEO 指令 | `docs/workflow/operating-records/2026-W30/trees/claude-code-compliance-audit-brief.md` |
| CEO 补充发现 (2026-07-25) | `TriCompany/source-agents/*/*.contract.yaml`（12 份存活） |
| Contract 体系 | `docs/registry/employee-capability-contract.md` |
| Contract resolver | `TriLC/src/config/contract-resolver.ts`（运行时加载） |
| 迭代策略 | `docs/registry/product-state.md` §Iteration Strategy（双轨 contract YAML） |
| 原 CPO 评审 | `docs/workflow/operating-records/2026-W30/trilc-tui-cpo-review.md` |
| 原 CTO 评审 | `docs/workflow/operating-records/2026-W30/trilc-tui-cto-review.md` |
| CTO 技术设计 | `TriLC/src/tui/tech-design.md` |
| 当前实现 | `TriLC/src/tui/app.ts` (143 行) + `render.ts` (32 行) + `useChat.ts` (152 行) + `useSSE.ts` (148 行) |
| Vendor 基线 | `TriLC/vendor/claude-code-tui/`（156 文件） |
| TriLC daemon | `TriLC/src/server/app.ts`（`/v1/messages` 于 line 677+） |
| 模块边界 | `docs/registry/business-strategy-boundaries.md`（TriLC = 本地人机协作主入口） |
| 产品状态 | `TriLC/docs/registry/product-state.md` |
| 中央产品状态 | `docs/registry/product-state.md`（TriLC Phase 1 L1） |
