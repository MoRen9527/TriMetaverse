# Claude Code 功能规格基线（还原度对标需求源）

> **来源**：Anthropic 官方文档 + 社区权威整理（CEOChiefOfStaff 代 CPO 小乔调研，因 CPO agent 无 WebSearch 工具）
> **日期**：2026-07-29
> **用途**：作为 TriLC TUI 还原度审计的需求基线，供 CTO 小狄做覆盖率对比、FullStack 小全做实现优先级
> **调研方式**：WebSearch（官方域名 code.claude.com / docs.anthropic.com 被网络策略拦截，无法 WebFetch；以下综合多源搜索结果整理）

---

## 1. Slash 命令体系（官方 50+）

### 1.1 核心命令（高优先级）
| 命令 | 功能 | TriLC 现状 |
|------|------|-----------|
| `/help` | 显示帮助与可用命令 | ✅ 有 |
| `/compact [instructions]` | 压缩历史为摘要省 token | ❌ stub（未实现） |
| `/clear` | 清空对话重开 | ✅ 有 |
| `/resume` | 按 ID/名称/交互选择恢复会话 | ⚠️ 有 --resume flag，无 /resume 命令 |
| `/model` | 切换模型 | ⚠️ 只读显示，无切换 |

### 1.2 会话/上下文命令
| 命令 | 功能 | TriLC 现状 |
|------|------|-----------|
| `/branch` | 会话分支 | ❌ 无 |
| `/rewind` | 回退到历史点 | ❌ 无 |
| `/continue` | 继续 | ❌ 无 |
| `/context` | 显示上下文占用 | ❌ 无 |
| `/usage` | 用量统计 | ❌ 无 |

### 1.3 项目/计划命令
| 命令 | 功能 | TriLC 现状 |
|------|------|-----------|
| `/init` | 生成 CLAUDE.md | ❌ 无 |
| `/add` `/remove` | 加/移目录 | ❌ 无 |
| `/plan` | 进入计划模式 | ❌ 无 |
| `/review` | 代码审查 | ❌ 无 |
| `/effort` | 设置推理强度 | ❌ 无 |
| `/workflow` | 工作流 | ❌ 无 |
| `/advisor` | advisor 工具开关 | ❌ 无 |
| `/permissions` | 权限管理 | ❌ 无 |

---

## 2. 内置工具体系（官方 15+）

| 工具 | 功能 | TriLC 现状 |
|------|------|-----------|
| `Read` | 读文件 | ✅ 有 |
| `Write` | 写文件 | ✅ 有 |
| `Edit` | 精确替换 | ✅ 有 |
| `MultiEdit` | 多处编辑 | ❌ 无 |
| `NotebookRead` | 读 Jupyter | ❌ 无 |
| `NotebookEdit` | 编辑 Jupyter | ❌ 无 |
| `Glob` | 文件匹配 | ✅ 有 |
| `Grep` | 内容搜索 | ✅ 有 |
| `LS` | 列目录 | ❌ 无 |
| `Bash` | 执行命令 | ✅ 有（shell_exec） |
| `Task` | 启动 subagent | ⚠️ agent-core 有，TUI 未暴露 |
| `TodoWrite` | 任务清单 | ❌ 无 |
| `WebSearch` | 网页搜索 | ❌ 无 |
| `WebFetch` | 抓取网页 | ❌ 无 |
| `exit_plan_mode` | 退出计划模式 | ❌ 无 |

**覆盖率**：6/15 = 40%

---

## 3. 高级特性

| 特性 | 功能 | TriLC 现状 |
|------|------|-----------|
| **Hooks** | 动作前后执行 shell（自动格式化/lint） | ❌ 无 |
| **MCP** | Model Context Protocol 外接服务器 | ❌ 无 |
| **Subagents** | 专用子代理（Task 工具驱动） | ⚠️ 底层有，无 TUI 入口 |
| **Skills** | 打包指令集（/skill 调用） | ❌ 无 |
| **Permissions** | ask/allow/deny 权限模型 | ❌ 无（daemon 无交互层） |
| **Plan mode** | 先规划后执行 | ❌ 无 |
| **CLAUDE.md** | 持久记忆/项目指令 | ❌ 无 |
| **IDE 集成** | VS Code/JetBrains 扩展 | ❌ 无 |
| **Sessions** | 会话持久化 | ✅ 有 |
| **状态行** | model/cwd/git/ctx% | ⚠️ 仅 model/cwd/tokens |
| **主题** | 颜色体系 | ✅ 有 design-system |
| **diff 渲染** | Edit/Write 变更 diff | ❌ 无 |
| **TodoWrite UI** | 任务清单可视化 | ❌ 无 |

---

## 4. 还原度初步评估

| 维度 | CC | TriLC | 覆盖率 |
|------|----|----|--------|
| 核心工具 | 15 | 6 | 40% |
| Slash 命令 | 50+ | 8 | ~16% |
| 高级特性 | 13 | 3 (sessions/theme/状态行部分) | ~23% |
| 输入/编辑 | 完整 | 光标+历史+命令+多行 | ~60% |
| 消息渲染 | 完整 | Markdown+blocks+工具+分层 | ~65% |

**综合还原度估算：~45%**（此前 "~70%" 是 CC 渲染层对齐度，非功能覆盖率）

---

## 5. 移植约束（关键发现）

`vendor/cc-tui/` 仅 5 个文件：`figures.ts/js`, `useBlink.ts`, `ToolUseLoader.tsx`, `Cursor.ts`。全部是**渲染层**。

**CC 核心逻辑源码（工具系统/权限/会话/hooks/MCP/subagents）未 vendor**。CC 是闭源产品，完整源码不可得。移植现实路径：
- **A级**（直接复制）：仅渲染层 5 文件（已做）
- **B级**（提取核心 shim）：从 `@anthropic-ai/claude-code` npm 包 bundle 逆向（⚠️ 有版权风险，需后续自研化）
- **C级**（参考语义重写）：基于官方文档行为描述重写（安全，还原度依赖文档精度）

---

## 6. 建议优先级（待 CTO 小狄源码侧确认后定稿）

**P2 立即可做（C级参考重写，高性价比）**：
1. `/compact` 真实实现（上下文压缩）
2. `TodoWrite` 工具 + UI（任务清单，CC 招牌功能）
3. `Task`/subagent TUI 入口（底层已有）
4. 状态行补 git 分支 + ctx%
5. diff 渲染（Edit/Write 变更可视化）
6. `LS`/`MultiEdit` 工具（小补丁）
7. CLAUDE.md 记忆加载
8. `/init` 生成 CLAUDE.md

**P3 依赖外部（需架构）**：
- Permissions 权限模型（需 daemon ask/allow/deny 层）
- Hooks（需事件钩子架构）
- MCP（需协议实现）
- Skills（需打包格式）
- Plan mode（需状态机）
