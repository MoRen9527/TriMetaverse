# CPO 产品优先级排序 — CC 还原度提升

> **日期**: 2026-07-29
> **CPO**: 小乔 (ChiefProductOfficer)
> **依据**: CEO 需求基线 (cc-feature-spec.md) + CTO 覆盖率审计 + vendor 技术事实
> **目标**: 将 TriLC 从 65-70% 还原度提升至 "完整可用 Claude Code 类产品"

---

## 决策原则

### CEO 目标（最高准则）
"让 trilc 作为一个完整的 claude code 类产品可用"。衡量标准：一个用过 Claude Code 的用户，用 TriLC 时会不会觉得"缺了关键东西"。

### 排序三维度
1. **用户感知强度**: 用过 CC 的用户是否立刻察觉缺失
2. **技术性价比**: A级现成代码 > C级简单重写 > B级架构改动
3. **普适性**: 普通用户受益 > 极客用户专用

---

## 批次1（P2 本轮实现）— 高性价比 + 高感知

### 排序结果（按优先级）

| # | 功能 | 产品价值理由 | 移植级别 | 预估难度 | 实现路径 |
|---|------|-------------|---------|---------|---------|
| 1 | **diff 渲染** | CC 最标志性 UX，Edit/Write 变更可视化是用户最常感知的"专业感"来源 | C级 | 中 | `tui/components/Markdown.tsx` 扩展，解析 tool_result 中的 diff 片段，用语法高亮渲染 |
| 2 | **TodoWrite 工具 + UI** | CC 招牌功能，任务清单是协作型 AI 编程的核心交互界面 | C级 | 中 | `src/tools/` 新建 `todo-write.ts` + `tui/components/TodoPanel.tsx`，复用 Task/TaskUpdate 工具定义 |
| 3 | **/compact 真实实现** | 长会话必备，避免 token 爆炸，是 CC 使用时长不受限的核心能力 | C级 | 低 | `src/cli.ts` compact 命令处理，调用 backend 的 summarization 接口，替换当前 stub |
| 4 | **状态行 git 分支 + ctx%** | 场景感知基础能力，用户需时刻知道"在哪个分支上工作" | C级 | 低 | `tui/components/StatusLine.tsx` 扩展，从 git 状态获取分支名，计算上下文百分比 |
| 5 | **/init + CLAUDE.md 记忆** | 项目持久记忆，CC 的"项目知识"基础，让会话有连续性 | C级 | 中 | `/init` 命令生成 CLAUDE.md 模板，启动时自动加载当前目录的 CLAUDE.md 作为 system prompt |
| 6 | **Task/SubAgent TUI 入口** | 底层已有 agent-core，仅需 TUI 暴露，高性价比 | C级 | 低 | `tui/components/` 新建 `AgentPanel.tsx`，显示 agent 状态和消息，复用现有 agent 通信机制 |
| 7 | **LS 工具** | 目录浏览是基础工具，与 Read/Edit 配合使用频率高 | C级 | 低 | `src/tools/` 新建 `file-ls.ts`，调用 fs.readdir，格式化输出 |
| 8 | **图片粘贴 + ImageRef chip** | Cursor.ts A级现成，顺手做，多模态交互基础 | A级 | 低 | `tui/utils/Cursor.ts` 已有完整实现，直接复制 `ImageRef` 组件和粘贴处理逻辑 |

### 实现细节摘要

#### 1. diff 渲染
- **改文件**: `tui/components/Markdown.tsx`
- **做法**: 检测 tool_result 中包含 `diff` 格式的文本，解析成 unified diff，用颜色区分 +/- 行
- **验证**: Edit/Write 后在消息里看到绿色/红色的高亮 diff

#### 2. TodoWrite 工具 + UI
- **改文件**: `src/tools/todo-write.ts` (新建), `tui/components/TodoPanel.tsx` (新建)
- **做法**: 工具定义复用 TaskCreate/TaskList/TaskUpdate 的 schema，TUI 用表格显示任务列表
- **验证**: `/todo` 命令打开任务面板，能创建/完成任务

#### 3. /compact 真实实现
- **改文件**: `src/cli.ts`
- **做法**: compact 命令调用 backend 的 summarize 接口，将历史消息压缩为摘要，替换现有 stub 实现
- **验证**: 长会话后 `/compact` 能成功压缩，后续消息引用摘要内容

#### 4. 状态行 git 分支 + ctx%
- **改文件**: `tui/components/StatusLine.tsx`
- **做法**: 执行 `git rev-parse --abbrev-ref HEAD` 获取分支，计算当前消息数 vs 最大上下文窗口
- **验证**: 状态行显示 `main | 45% | 128k tokens`

#### 5. /init + CLAUDE.md 记忆
- **改文件**: `src/cli.ts`, `src/config/`
- **做法**: `/init` 生成 CLAUDE.md 模板，启动时检测当前目录是否存在 CLAUDE.md，存在则追加到 system prompt
- **验证**: `/init` 生成文件，重启会话后 AI 记住项目约定

#### 6. Task/SubAgent TUI 入口
- **改文件**: `tui/components/AgentPanel.tsx` (新建), `tui/app.tsx`
- **做法**: 新组件显示 agent 状态，在主界面挂载到侧边或底部区域
- **验证**: 启动 subagent 后能看到独立的消息区域

#### 7. LS 工具
- **改文件**: `src/tools/file-ls.ts` (新建)
- **做法**: 调用 fs.readdir，格式化输出文件列表，支持 flag 控制详细程度
- **验证**: `ls -la` 命令返回目录内容

#### 8. 图片粘贴 + ImageRef chip
- **改文件**: `tui/utils/Cursor.ts` (复制), `tui/components/InputBox.tsx`
- **做法**: 从 vendor Cursor.ts 复制 ImageRef 组件和粘贴处理逻辑，集成到输入框
- **验证**: 粘贴图片后显示 `[Image: screenshot.png]` chip，可点击预览

---

## 批次2（P3 后续）— 架构依赖或极客向

| 功能 | 延后原因 |
|------|---------|
| **Permissions 权限模型** | 需 daemon 交互层 (ask/allow/deny)，架构改动大 |
| **Hooks** | 需事件钩子架构，在 tool call 前后执行 shell |
| **MCP 支持** | 需完整 MCP 协议实现和服务器连接管理 |
| **Plan mode** | 需状态机 + 新的交互模式，UI 改动较大 |
| **Skills** | 需打包格式和调用解析，依赖外部生态 |
| **Vim 模式** | 极客向，普通用户无感，Cursor.ts 虽有现成代码但非主线 |
| **Kill ring** | 极客向，普通用户无感 |
| **/branch /rewind** | 需会话版本控制系统，复杂度高 |
| **/context /usage** | 统计类命令，非核心交互路径 |
| **MultiEdit / Notebook 工具** | 使用场景相对小众，可后续补 |

---

## 预期成果

### 覆盖率提升
- **当前**: 65-70% (输入编辑 85%, 消息渲染 90%, 工具系统 40%, 会话上下文 75%)
- **批次1 完成后**: 预计提升至 **~80-85%**
  - 工具系统: 40% → ~55% (+TodoWrite, LS, Task UI)
  - 消息渲染: 90% → ~95% (+diff 渲染)
  - 会话上下文: 75% → ~90% (+/compact, /init, CLAUDE.md)
  - 状态行: 60% → ~85% (+git, ctx%)

### 用户体验提升
- **"完整可用" 标志**: 一个 CC 用户迁移到 TriLC 后，核心工作流不受阻碍
- **高感知功能补齐**: diff 渲染、任务清单、长会话支持是三个最明显的"专业感"来源
- **基础能力闭环**: 工具集 (Read/Write/Edit/LS/Grep/Glob/TodoWrite) 足够支撑日常编程任务

---

## 移交 FullStackDeveloper

批次1 清单已按优先级排序，每项包含：
- 产品价值理由（为什么重要）
- 移植级别（技术成本）
- 实现路径（改哪些文件、怎么做）

小全可按 #1 → #8 顺序实现，每项完成后自测验证。

---

## 风险提示

1. **diff 渲染性能**: 大 diff 可能导致 TUI 卡顿，需考虑分页或截断
2. **/compact 依赖 backend**: 如果后端无 summarization 接口，需降级为简单消息裁剪
3. **Task UI 复杂度**: agent 通信机制可能需重构，建议先做简单展示，再优化交互
4. **图片粘贴兼容性**: Terminal 对图片粘贴支持不统一，需测试主流终端

---

## 使用依据

- **需求基线**: `docs/workflow/operating-records/2026-W31/cc-fidelity/cc-feature-spec.md`
- **CTO 覆盖率审计**: tree-op.json fidelity-1 节点
- **技术事实**: vendor/cc-tui/utils/Cursor.ts 包含 Vim/Kill ring/ImageRef 完整实现
- **TriLC 源码结构**: src/tui/components/ (StatusLine, Markdown, InputBox 等), src/tools/ (现有 6 个工具)
