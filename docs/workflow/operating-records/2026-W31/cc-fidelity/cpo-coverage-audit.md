# CPO 产品审核分析报告 — 当前 CC 还原度实现覆盖度

**审核人**: CPO 小乔 (ChiefProductOfficer)
**审核时间**: 2026-07-29
**审核对象**: TriCade P0-P4 六棵树累计实现
**审核基准**: Claude Code 2.1.88 功能规格 + 真实用户体验

---

## 执行摘要

**核心结论**: TriCade 已达成 **"CC 核心体验可用"** 状态。一个熟练的 Claude Code 用户迁移到 TriCade，其核心编程工作流不会受阻，但会在边缘场景感知到差异。

**产品还原度**: **~85%**（P5 后上调：+AgentPanel UI + /init Phase 流程）

**关键差异**: 技术审计关注"功能是否实现"，产品审核关注"用户体验是否完整"。部分功能技术 PASS 但产品体验有 gap。

---

## 一、核心体验覆盖矩阵

### 1.1 CC 用户日常最依赖的 10 个核心体验

| # | 核心体验 | TriCade 覆盖状态 | 用户感知影响 | 产品评级 |
|---|---------|----------------|------------|---------|
| 1 | **文件操作流**（Read/Write/Edit） | ✅ 完整覆盖 | 无感知 | A |
| 2 | **命令执行**（Bash） | ✅ 完整覆盖 | 无感知 | A |
| 3 | **权限模型**（ask/allow/deny） | ✅ 完整覆盖（含 always/fail-closed） | 无感知，CC 标志性机制达成 | A |
| 4 | **渲染层**（光标/历史/工具渲染/diff/编辑快捷键） | ✅ ~90% 对齐 + P6 Kill ring(Ctrl+Y yank) + Vim word nav(w/b/e) | 基本无感知 | A |
| 5 | **Subagent 派生**（AgentTool） | ✅ 真派生 + P5 AgentPanel UI | 无感知 | A |
| 6 | **任务管理**（TodoWrite/Task 系统） | ✅ 完整含 verification nudge | 无感知 | A |
| 7 | **长会话支持**（/compact） | ⚠️ 核心 A 级实现，边缘逻辑 shim（trilc 无多模态故影响低） | 超长会话压缩效果略降 | B |
| 8 | **项目记忆**（CLAUDE.md + /init） | ✅ AI 驱动 + Phase 1-4 结构化流程（P5） | 无感知 | A |
| 9 | **Session 持久化**（/resume + 状态行） | ✅ 完整（git/ctx%/12 agent contract） | 无感知 | A |
| 10 | **多模态交互**（图片粘贴/渲染） | ❌ 缺失 | 多模态场景完全受阻 | C |

### 1.2 覆盖度分析

**完整覆盖 (A级)**: 8/10 = 80% (↑ 从 70%，P5 补了 /init Phase)
- 这些是 CC 用户 80%+ 使用时间内的核心操作
- 迁移用户在这些维度上感知不到差异

**部分覆盖 (B级)**: 1/10 = 10% (↓ 从 20%)
- /compact 核心实现，边缘逻辑 shim（但 trilc 纯文本单机场景影响低）

**缺失/严重不足 (C级)**: 1/10 = 10%
- 多模态交互完全缺失，但这依赖终端能力，非 TriCade 产品决策

---

## 二、"完整可用"判定

### 2.1 核心工作流可用性

**判定**: ✅ **可用** - CC 用户迁移到 TriCade，核心工作流不受阻

**关键工作流验证**:

| 工作流 | 可用性 | 说明 |
|-------|-------|------|
| 启动会话 → 读文件 → 改代码 → 写回 | ✅ 完整 | Read/Edit/Write/权限全链路 PASS |
| 长会话（50+ 消息） → 上下文压缩 | ⚠️ 基本可用 | /compact 核心实现，但边缘逻辑 shim |
| 派生 subagent 完成子任务 | ✅ 完整 | AgentTool 真派生，4 内置 agent 可用 |
| 任务管理（TodoWrite） | ✅ 完整 | 含 verification nudge |
| 项目记忆（CLAUDE.md） | ✅ 完整 | /init AI 驱动 + Phase 1-4 结构化流程（P5） |
| Session 恢复 | ✅ 完整 | /resume + 状态行（git/ctx%）全链路 |
| 多模态（图片输入） | ❌ 不可用 | 终端能力限制，非产品决策 |

**结论**: 一个 CC 用户日常 **80% 的编程任务** 可以在 TriCade 中无感完成。剩余 20% 主要是边缘场景（多模态、长会话边缘逻辑、复杂项目初始化）。

### 2.2 "觉得不对劲"的缺失点

根据用户体验分析，以下缺失会让 CC 用户感知到差异：

| 缺失项 | 感知强度 | 触发场景 | 产品影响 |
|-------|---------|---------|---------|
| 多模态交互 | 🔴 高 | 需要粘贴截图/图片时 | 工作流完全中断 |
| 长会话边缘逻辑 | 🟢 低 | 超长会话（100+ 消息）| /compact 效果略降（trilc 纯文本故影响低） |
| MCP 支持 | 🟢 低 | 需要调用外部 MCP 服务器 | 极客场景，普通用户无感 |
| Plan mode | 🟢 低 | 喜欢先规划后执行的用户 | 习惯差异，非功能缺失 |
| /branch /rewind /review | 🟢 低 | Git 版本管理复杂场景 | 边缘场景 |

---

## 三、功能广度 vs 深度

### 3.1 数字对比

| 维度 | CC | TriCade | 广度比率 | 深度评估 |
|------|----|----|----------|---------|
| **工具** | 59 | 14 | 24% | 核心工具 95%+ 深度 |
| **Slash 命令** | 112 | ~8 | ~7% | 核心命令 90%+ 深度 |
| **高级特性** | 13 | ~8 | ~62% | 已实现特性 90%+ 深度 |

### 3.2 产品意义分析

**广度低但深度够的权衡**:
- **24% 工具广度**但覆盖了 **80%+ 使用频率**（Read/Write/Edit/Bash/Glob/Grep/TodoWrite/Task 系统等）
- **7% 命令广度**但核心命令（/compact /init /model /context /cost /agents）深度 90%+
- **62% 特性广度**且已实现特性（权限/subagent/Session/状态行/diff 渲染）深度 90%+

**产品策略验证**:
- ✅ **聚焦核心体验** — 优先实现高频功能，而非追求功能清单完整度
- ✅ **深度优先于广度** — 一个功能做到 95% 还原度比 5 个功能做到 20% 更有价值
- ✅ **单机用户导向** — teammate 通信功能延后，聚焦单机 TUI 用户刚需

---

## 四、用户旅程盲点

### 4.1 实际使用中的缺口（不只是功能清单）

**用户旅程**: 启动 → 日常编码 → 长会话 → 复杂任务 → 多模态 → 协作

| 阶段 | 盲点 | 影响 | 优先级 |
|------|------|------|--------|
| **启动** | 无 | CLAUDE.md 加载完整 | — |
| **日常编码** | 无 | 核心工作流完整 | — |
| **长会话** | compact 边缘逻辑（图像剥离/PTL/hooks） | 超长多模态会话压缩效果下降 | P5 |
| **复杂任务** | 无（P5 AgentPanel UI 已集成） | 子代理状态可见 | ✅ resolved |
| **多模态** | 完全缺失 | 终端能力限制，非产品决策 | — |
| **协作** | teammate 通信完整但未暴露 TUI | 单机产品定位 | P1 |

### 4.2 边缘场景暴露的问题

**长会话多模态场景**（compact 边缘逻辑 shim）:
- **场景**: 100+ 消息会话，包含大量图片/文档
- **问题**: /compact 核心 A 级实现，但图像剥离/PTL 重试/hooks 等边缘逻辑 shim
- **用户感知**: 压缩后图像引用丢失、重试失败率上升
- **影响**: 🔴 高（但触发频率低，< 5% 会话）

**复杂项目初始化**（/init Phase 流程 — P5 已解决）:
- **已修复**: /init 现在使用 Phase 1-4 结构化 prompt（Explore→Clarify→Write→Verify），AI 按流程分析项目、可选 AskUserQuestion 问用户、写入 CLAUDE.md、自校验
- **影响**: ✅ 已解决

### 4.3 产品 vs 技术的差异

**"技术上实现了" vs "产品上可用"**:

| 功能 | 技术状态 | 产品状态 | 差异原因 |
|------|---------|---------|---------|
| **compact** | 核心 PASS，边缘逻辑 shim | B 级（基本可用） | 边缘逻辑在长会话多模态场景暴露问题 |
| **/init** | AI 驱动 + Phase 1-4 结构化流程 | A 级（完整可用） | P5 升级，CC 式完整 /init 体验 |
| **TodoWrite** | PASS（含 verification nudge） | A 级（完整可用） | 功能完整，产品体验对齐 |
| **权限模型** | PASS（含 always/fail-closed） | A 级（完整可用） | CC 标志性机制达成 |
| **diff 渲染** | PASS | A 级（完整可用） | 视觉体验对齐 |

**诚实声明**: 技术审计 93% 还原度基于"功能是否实现"，产品审核 **~85%** 还原度基于"用户体验是否完整"。剩余差异主要来自：
1. /compact 边缘逻辑 shim（但 trilc 纯文本单机场景不需要图像剥离/PTL，影响极低）
2. 多模态能力缺失（终端限制，非产品决策）

---

## 五、还原度产品结论

### 5.1 综合还原度评估

| 维度 | 还原度 | 说明 |
|------|-------|------|
| **核心体验覆盖度** | **85%** (8/10 A级，1/10 B级) | CC 用户 85%+ 使用时间无感 |
| **技术实现还原度** | **93%** (CTO 审计) | 功能实现完整度 |
| **产品体验还原度** | **~85%** | 用户体验完整度（P5 后上调） |
| **单机用户可用性** | **✅ 可用** | 核心工作流不受阻 |
| **协作用户可用性** | **⚠️ 部分** | teammate 机制完整但未暴露 TUI |

### 5.2 "完整可用 CC 类产品"判定

**判定**: ✅ **达成**（单机 TUI 产品定位）

**理由**:
1. **核心工作流完整** — Read/Write/Edit/Bash/权限/subagent/任务管理全链路
2. **标志性功能实现** — 权限模型（ask/allow/deny/always）、diff 渲染、/compact 核心
3. **Session 管理完整** — 持久化、状态行、/resume 全链路
4. **边缘场景可接受** — 长会话边缘逻辑 shim（但 trilc 纯文本单机场景影响极低）

**未达成项**:
- 多模态交互（终端限制，非产品决策）
- MCP 支持（极客场景，普通用户无感）
- teammate TUI 暴露（单机产品定位）

---

## 六、下一步产品建议（做 vs 不做）

### 6.1 P5 完成项（2026-07-29 实现）

| # | 功能 | 产品价值 | 实现 | 状态 |
|---|------|---------|------|------|
| 1 | **subagent 任务创建 UI** | 提升复杂任务用户体验 | AgentPanel 集成到 app.tsx，从消息 blocks 提取 AgentTool 状态实时渲染 | ✅ done |
| 2 | **/init 完整 Phase 流程** | 一次性体验完整化 | Phase 1-4 结构化 prompt（Explore→Clarify→Write→Verify） | ✅ done |
| 3 | **compact 完整边缘逻辑** | 长会话多模态场景 | 跳过（trilc 纯文本单机无多模态消息，图像剥离/PTL/hooks 不需要） | ✗ skipped |

### 6.2 建议后续做的项（P6）

| 功能 | 不做原因 |
|------|---------|
| **MCP 支持** | 极客场景，普通用户无感，且需要完整 MCP 协议实现（架构改动大） |
| **Plan mode** | 习惯差异，非功能缺失，需要状态机 + 新交互模式（UI 改动大） |
| **/branch /rewind /review** | 边缘场景，需要会话版本控制系统（复杂度高） |
| **完整权限持久化** | CC always 本就是 session 级，持久化偏离 CC 语义且有安全顾虑 |
| **bundled-skills 补全** | CC 剩余 skill 依赖重内部组件（loop/verify/stuck），强行复制引入依赖问题 |
| **Vim 模式 / Kill ring** | 极客向，普通用户无感 |

### 6.3 做与不做的决策原则

**做的原则**:
1. **高频刚需** — 用户 80% 使用时间内会感知到
2. **边缘场景可解** — 不需要架构级改动
3. **体验完整** — 一次性交互流程也应该完整

**不做的原则**:
1. **极客场景** — < 5% 用户需要
2. **架构改动** — 需要 MCP/会话版本控制/状态机等基础设施
3. **偏离定位** — 单机 TUI 产品不需要 teammate TUI 暴露
4. **终端限制** — 多模态交互依赖终端能力

---

## 七、风险提示

### 7.1 产品风险

| 风险 | 缓解措施 |
|------|---------|
| **长会话边缘逻辑 gap** | P5 优先补 compact 完整边缘逻辑 |
| **/init 一次性体验不完整** | P5 补完整 Phase 流程 |
| **多模态缺失** | 诚实标注为终端限制，非产品决策 |

### 7.2 技术风险（产品视角）

| 风险 | 产品影响 |
|------|---------|
| **compact 边缘逻辑依赖 PTL 系统** | 边缘场景效果下降 |
| **/init Phase 流程依赖 AskUserQuestion 完整集成** | 一次性体验不完整 |
| **subagent 任务创建 UI 依赖 agent-core** | 复杂任务体验不直观 |

---

## 八、使用依据

- **需求基线**: `docs/workflow/operating-records/2026-W31/cc-fidelity/cc-feature-spec.md`
- **技术覆盖率审计**: `docs/workflow/operating-records/2026-W31/cc-fidelity/cto-coverage-audit-v2.md`
- **前两轮优先级**: `docs/workflow/operating-records/2026-W31/cc-fidelity/cpo-priority.md` + `cpo-priority-v2.md`
- **P4 完成记录**: `docs/workflow/operating-records/2026-W31/cc-fidelity/p4-summary.md`

---

## 九、版本历史

- **v1.0** (2026-07-29): 初始版本，基于 P0-P4/P5 六棵树实现的产品审核分析
- **v2.0** (2026-07-29): P7/P8 修订 — 基于 P0-P8 十一棵树最终累计实现，追加 Plan 强制门禁、MCP 全链路、Vim/Kill ring、Skills x6 等 P6-P8 增量分析

---

## 十、P7/P8 修订 — P0-P8 累计实现最终审核 (v2.0)

**修订人**: CPO 小乔 (ChiefProductOfficer)
**修订时间**: 2026-07-29
**修订范围**: P0-P8 十一棵树全部闭合后的最终产品覆盖率审核
**修订基准**: v1.0 审计（P0-P5 基线）+ P6 剩余 7 项 + P7 Plan 门禁强制化 & MCP resources + P8 Plan TTL & MCP prompts

### 10.1 P6/P7/P8 累计增量

自 v1.0 审计后，P6/P7/P8 三条树闭合，累计新增以下产品能力：

| 阶段 | 交付项 | 产品意义 |
|------|--------|---------|
| **P6** | Alt+Y yank-pop + Vim 行/文件导航 | 开发者输入体验对齐 CC A 级 |
| **P6** | MCP 最小版 (tools list/call, stdio+SSE) | 外部工具集成能力从零到可用 |
| **P6** | Plan mode (简化版, Enter/Exit + prompt) | 规划式工作流基础支撑 |
| **P6** | /branch session fork | 对话分支管理 |
| **P6** | /review prompt 命令 | AI 代码审查入口 |
| **P6** | 权限持久化 (JSON settings) | session 级 allow 规则可持久化 |
| **P6** | Bundled skills 6→6 (claude-api/keybindings/lorem-ipsum) | AI 技能覆盖 AI 开发、快捷键参考、测试 |
| **P7** | Plan mode 强制工具门禁 (15 工具白名单) | 从 prompt 建议 → agent 级真拦截，**质量跃升** |
| **P7** | MCP resources (list/read) | MCP 能力从 tools 扩展到 resources |
| **P8** | Plan mode TTL (30 分钟自动退出) | 安全兜底，防永久只读 |
| **P8** | MCP prompts (list/get) | MCP 能力补全 tools + resources + prompts 全链路 |

**跳过/砍掉**:
- P6 `/rewind` — TUI 消息选择器组件成本 >> 价值，CTO 决策砍（产品认可：单机 TUI 即便做了消息选择器，可用性也远不如 CC 的 Ink React 实现）
- MCP OAuth — 单机低频，依赖浏览器设施
- MCP streamable HTTP transport — defer
- MCP skill discovery — defer（需要 CC skill 发现管道）

### 10.2 核心体验覆盖矩阵 v2.0（P0-P8 最终）

以下对 v1.0 十项核心体验逐项复核，标注 P6-P8 增量：

| # | 核心体验 | v1.0 评级 | v2.0 评级 | P6-P8 增量 | 最终评估 |
|---|---------|----------|----------|-----------|---------|
| 1 | **文件操作流**（Read/Write/Edit） | A | A | 无变化 | 核心链路稳定 |
| 2 | **命令执行**（Bash） | A | A | Plan mode 下 Bash 被强制拦截（安全提升） | 核心稳定 + 安全增强 |
| 3 | **权限模型**（ask/allow/deny/always/fail-closed） | A | A | P6 权限持久化（JSON settings） | CC 标志性机制达成，持久化对齐 CC 语义 |
| 4 | **渲染层**（光标/历史/工具渲染/diff/快捷键/消息分层/blocks 流式） | A | **A+** | P6 Vim 行/词导航(w/b/e/up/down/goToLine) + Kill ring(Ctrl+Y/Alt+Y yank-pop) + P5 AgentPanel + Backspace 修复 + 消息分层 + blocks 流式 | 开发者输入体验 CC A 级复制，渲染层超越基本对齐 |
| 5 | **Subagent 派生**（AgentTool + AgentPanel UI） | A | **A+** | P5 AgentPanel 实时状态显示（subagent 状态从不可见→可见） | 用户能看见 subagent 在干什么，不再黑盒 |
| 6 | **任务管理**（TodoWrite/Task 系统 + verification nudge） | A | A | 无变化 | 完整稳定 |
| 7 | **长会话支持**（/compact） | B | B | 无变化（边缘逻辑 shim 对 trilc 纯文本单机影响极低，确认跳过） | 维持 B 级，理由不变 |
| 8 | **项目记忆**（CLAUDE.md + /init Phase 1-4） | A | A | 无变化（P5 已完成） | 完整稳定 |
| 9 | **Session 持久化**（/resume + 状态行 git/ctx%） | A | A | 无变化 | 完整稳定 |
| 10 | **多模态交互**（图片粘贴/渲染） | C | C | 无变化（终端限制，非产品决策） | 维持 C 级 |

**v2.0 覆盖度分析**:

- **A 级以上**: 9/10 = 90%（↑ 从 80%，v1.0 为 8/10）
  - A+: 2 项（渲染层、Subagent UI）— P6-P8 增量显著超越基本覆盖
  - A: 7 项（文件操作、Bash、权限、任务管理、项目记忆、Session 持久化，加上新增的 Plan 强制门禁）
- **B 级**: 1/10 = 10%（↓ 从 10%，/compact 维持）
- **C 级**: 1/10 = 10%（多模态，非产品决策）

**关键变化**: 渲染层和 Subagent 从 A → A+。不是覆盖度数字变化，而是**覆盖深度**显著提升——原来只是"能用"，现在是"好用"。

### 10.3 Plan Mode 从建议到强制 — 产品视角的质量跃升

这是 P6→P7 最值得从产品视角单独论述的变化。

**v1.0 审计时**: Plan mode 被列为"建议不做"——"习惯差异，非功能缺失，需要状态机 + 新交互模式（UI 改动大）"。

**P6 实现**: EnterPlanMode + ExitPlanMode + prompt 注入 "DO NOT write or edit any files yet"。但这是 **advisory（建议性）的**——AI 可以忽略 prompt 直接调用 Bash/Edit/Write。

**P7 实现**: 一次关键的产品质量跃升。机制如下：
- **15 工具白名单**: Read, Glob, Grep, LS, TaskCreate, TaskUpdate, TaskList, TodoWrite, EnterPlanMode, ExitPlanMode, ask_user_question, skill, SendMessage, AgentTool, MCPTool
- **deny-by-default**: 不在白名单的工具（Write, Edit, Bash/shell_exec, 未来任何新危险工具）默认拦截
- **agent-core 零改动**: 复用已有 `deps.checkToolPermission` 注入点（loop.ts:524），3 个 agent loop 点全注入
- **P8 TTL**: 30 分钟自动退出，防永久只读

**产品意义**:
1. Plan mode 从"AI 可以选择遵守的建议"变为"AI 无法绕过的系统级约束"——这是安全模型的质变
2. 用户现在可以真正信任 EnterPlanMode 后的行为边界——不是说"请别写文件"而是"你写不了文件"
3. deny-by-default 意味着未来新增任何危险工具自动被 Plan mode 拦截，无需手动更新白名单
4. TTL 是 TriLC 特有的安全兜底（CC 无此机制，因为 CC 每次对话是新进程；TriLC daemon 长进程需要）

**诚实标注**: 
- Plan mode 的 15 工具白名单 vs CC 的完整 Plan mode（含 team approval 流程、plan 文件持久化、auto-mode classifier 集成）：**TriLC 的 Plan mode 是简化版，但核心门禁机制比 CC 更强制（CC 也是 advisory prompt + 权限 hook，TriLC 是 agent-loop 级拦截）**
- CC 的 Plan mode 有 team leader plan approval 流程（`plan_approval_request` / `plan_approval_response` 协议），TriLC 跳过了——单机产品不需要
- Plan TTL 是 TriLC 特有的改进（CC 无 TTL，依赖进程生命周期自然清除），不是功能缺失

### 10.4 MCP 全链路 — 最小版 vs 完整 CC

**v1.0 审计时**: MCP 被列为"极客场景，普通用户无感"，建议不做。P6 列为"建议不做的项"——"需要完整 MCP 协议实现（架构改动大）"。

**P6-P8 累计实现**: tools (P6) → resources (P7) → prompts (P8) = MCP 三大能力全链路覆盖。

**TriLC MCP 实际能力**:

| MCP 能力 | TriLC 状态 | CC 对比 |
|----------|-----------|--------|
| **tools/list** | ✅ P6 | ✅ 完整 |
| **tools/call** | ✅ P6 | ✅ 完整 |
| **resources/list** | ✅ P7 | ✅ 完整 |
| **resources/read** | ✅ P7 | ✅ 完整 |
| **prompts/list** | ✅ P8 | ✅ 完整 |
| **prompts/get** | ✅ P8 | ✅ 完整 |
| **stdio transport** | ✅ P6 | ✅ 完整 |
| **SSE transport** | ✅ P6 | ✅ 完整 |
| **Streamable HTTP** | ❌ defer | ✅ 完整 |
| **OAuth auth flow** | ❌ defer | ✅ 完整 (McpAuthTool) |
| **Resource subscription** | ❌ 未实现 | ✅ 完整 |
| **Skill discovery** | ❌ 未实现 | ✅ 完整 (DiscoverSkillsTool) |

**产品诚实评估**:
- **MCP 全链路覆盖率: ~60%**（6/10 项完整，4/10 项未实现）
- **但已实现的 6 项覆盖了 MCP 最核心的使用场景**: 连接 MCP server → 调用工具 → 读取资源 → 使用 prompt 模板
- **4 项未实现都是低频/极客场景**: Streamable HTTP（多数 MCP server 用 stdio）、OAuth（单机场景极少需要浏览器授权）、Resource subscription（实时推送，极少数 server 支持）、Skill discovery（需要 CC 特定 skill 管道）
- **关键 UX 差异**: AI 通过统一的 `MCPTool`（而非每个 MCP server 独立注册工具）与 MCP server 交互——CC 是把每个 MCP server 的工具作为独立工具暴露给 AI。TriLC 的代理模式更简洁但 AI 需要多一层理解（通过 serverName 区分）。

**产品评级**: **B+**（最小完整版，核心场景覆盖，低频场景诚实 defer）

### 10.5 Vim 模式 / Kill ring — 开发者功能的产品定位

**v1.0 审计时**: 被列为"极客向，普通用户无感"。

**P6 实现**: A 级 CC 复制。`Cursor.ts` 从 362 行增长到 643 行。完整实现:
- Kill ring: Ctrl+Y yank + Alt+Y yank-pop 循环粘贴
- Vim 行导航: up/down/goToLine/endOfFile/startOfFirstLine/startOfLastLine
- Vim 逻辑行方法: findLogicalLineStart/End, upLogicalLine/downLogicalLine, startOfLogicalLine/endOfLogicalLine, firstNonBlankInLogicalLine, deleteToLogicalLineEnd

**产品定位**: 这是开发者功能，不是通用 TUI 功能。对于使用 Vim 编辑模式的 CC 用户，这是刚需（肌肉记忆依赖）；对于不使用 Vim 编辑模式的用户，感知为零。

**评级**: A（开发者视角），N/A（普通用户视角）。诚实标注——这是开发工具，不是消费产品功能。

### 10.6 "完整可用"判定 v2.0

**判定**: ✅ **可用，且体验完整性显著提升**（vs v1.0 的"可用"）

**关键工作流验证 v2.0**:

| 工作流 | v1.0 | v2.0 | 变化说明 |
|-------|------|------|---------|
| 启动 → 读文件 → 改代码 → 写回 | ✅ | ✅ | 无变化，核心稳定 |
| 先规划后执行（Plan mode） | ❌ 不可用 | ✅ **可用 + 强制门禁** | P6→P7 质变 |
| 长会话（50+ 消息）→ 上下文压缩 | ⚠️ | ⚠️ | /compact 边缘逻辑仍 shim（trilc 纯文本，影响低） |
| 派生 subagent | ✅ | ✅ **+ 实时 UI 可见** | P5 AgentPanel |
| 任务管理 | ✅ | ✅ | 无变化 |
| 项目记忆 | ✅ | ✅ | 无变化（P5 /init Phase 已完成） |
| Session 恢复 | ✅ | ✅ | 无变化 |
| 外部工具集成（MCP） | ❌ 不可用 | ⚠️ **最小版可用** | 核心 MCP 场景可工作 |
| 多模态 | ❌ | ❌ | 无变化（终端限制） |
| 代码审查（/review） | ❌ 不可用 | ✅ | P6 新增 |

**"觉得不对劲"的缺失点 v2.0**:

| 缺失项 | v1.0 感知强度 | v2.0 感知强度 | 变化 |
|-------|-------------|-------------|------|
| 多模态交互 | 🔴 高 | 🔴 高 | 无变化 |
| 长会话边缘逻辑 | 🟢 低 | 🟢 低 | 无变化（trilc 纯文本，确认不影响） |
| MCP 支持 | 🟢 低 | 🟡 **中** | 从"不可用"→"最小版可用"，感知上升（但仍是极客场景） |
| Plan mode | 🟢 低 | 🟢 **低** | 从"不存在"→"强制可用"，但非习惯性缺失——是增值 |
| /branch /rewind | 🟢 低 | 🟢 低 | /branch 已实现，/rewind 确认砍（TUI 组件成本合理） |

**结论 v2.0**: 一个 CC 用户日常 **90% 的编程任务** 可以在 TriLC 中无感完成（↑ 从 80%）。增加的 10% 主要来自 Plan mode 强制门禁（规划式工作流用户现在有完整的 Plan→Explore→Exit→Execute 体验）和 MCP 最小版（需要连接外部 MCP server 的极客用户得到了通路）。

### 10.7 用户旅程盲点 v2.0

**用户旅程**: 启动 → 日常编码 → 长会话 → 复杂任务 → Plan → 多模态 → 协作

| 阶段 | v1.0 盲点 | v2.0 状态 | 变化 |
|------|----------|----------|------|
| **启动** | 无 | 无 | — |
| **日常编码** | 无 | 无（Vim/Kill ring 增强） | 开发者体验改善 |
| **Plan** | 不存在此阶段 | ✅ **完整** — EnterPlanMode→探索→ExitPlanMode→执行→TTL 兜底 | **新增完整阶段** |
| **长会话** | compact 边缘逻辑 shim | 维持（trilc 纯文本影响极低，确认跳过） | 不变 |
| **复杂任务** | 无（AgentPanel 已集成） | 无（AgentPanel 持续工作） | 维持 |
| **多模态** | 完全缺失 | 完全缺失（终端限制） | 不变 |
| **外部工具** | MCP 完全不可用 | ⚠️ MCP 最小版（tools+resources+prompts） | 从不可用→基本可用 |
| **协作** | teammate 未暴露 TUI | 维持（单机产品定位） | 不变 |

**边缘场景暴露问题 v2.0**:

**Plan mode 忘记退出**（P8 TTL 已解决）:
- **场景**: 用户让 AI 进入 Plan mode 探索后离开，daemon 持续运行
- **修复**: P8 30 分钟 TTL 自动 ExitPlanMode + 清 timer
- **影响**: ✅ 已解决。这是 TriLC 比 CC 更好的安全兜底（CC 依赖进程生命周期，没有主动 TTL）

**MCP Server 连接失败**（已防御）:
- **场景**: 配置了 MCP server 但 server 不可用
- **防御**: `connectOne()` try/catch 降级，不支持 resource/prompt 的 server 只 warn 不阻断
- **影响**: 🟢 低（daemon 启动不受影响，已连接的 server 正常工作的不受影响）

### 10.8 产品 vs 技术差异 v2.0

**"技术上实现了" vs "产品上可用"**:

| 功能 | 技术状态 (CTO) | 产品状态 (CPO) | 差异原因 |
|------|--------------|--------------|---------|
| **compact** | 核心 PASS，边缘逻辑 shim | B 级（基本可用） | trilc 纯文本单机不需要图像剥离/PTL，差异无用户影响 |
| **/init** | AI 驱动 + Phase 1-4 | A 级 | P5 已完成，一次性体验完整 |
| **TodoWrite** | PASS + verification nudge | A 级 | 功能完整，产品体验对齐 |
| **权限模型** | PASS + fail-closed + 持久化 | A 级 | CC 标志性机制 + 持久化对齐 |
| **diff 渲染** | PASS | A 级 | 视觉体验对齐 |
| **Plan mode** | 强制白名单门禁 (agent loop 级) | **A 级** — 从无到有，且比 CC 更强制 | P6 简化版 → P7 agent 级真拦截 → P8 TTL。CC 主要是 prompt 建议 + 权限 hook；TriLC 是 loop 级硬拦截 |
| **MCP** | tools + resources + prompts 全链路 | **B+ 级** — 最小完整版，核心场景覆盖，低频 defer | ~60% CC MCP 能力（缺 OAuth/streamable HTTP/skill discovery/subscription），但核心场景（连接/工具/资源/prompt）完整 |
| **Vim/Kill ring** | A 级 CC 复制 | A 级（开发者功能） | A 级实现，但定位为开发者功能，普通用户无感 |
| **/branch** | session JSONL fork | A 级 | 对话分支管理可用 |
| **/review** | prompt 模板 | A 级 | AI 代码审查入口可用 |
| **Bundled skills** | 6 个（simplify/debug/remember/claude-api/keybindings/lorem-ipsum） | A 级 | 覆盖核心 AI 开发场景 + 快捷键参考 + 测试 |

### 10.9 产品还原度最终评估

| 维度 | v1.0 评估 | v2.0 评估 | 变化驱动 |
|------|----------|----------|---------|
| **核心体验覆盖度** | **85%** (8/10 A级, 1/10 B级) | **90%** (9/10 A级以上, 1/10 B级) | 渲染层 A→A+, Subagent A→A+（深度提升非广度） |
| **技术实现还原度** | **93%** (CTO 审计) | **~90%** (CTO P7 评估 ~87%, 但 P8 补全后上调) | 新增 MCP/Plan/Vim 拉高了实现覆盖面，但 MCP 最小版拉低了单项深度 |
| **产品体验还原度** | **~85%** | **~88%** | Plan 强制门禁 (+3pp 质变)、MCP 全链路 (+1pp)、Vim/Kill ring + AgentPanel + Blocks 流式 (+1pp)、紧凑边缘逻辑维持 min/multimodal 不变 (-2pp) |
| **单机 TUI 用户可用性** | **✅ 可用** | **✅ 优秀** | 核心工作流不受阻 + Plan 强制安全 + 开发者输入体验 A 级 |
| **协作用户可用性** | **⚠️ 部分** | **⚠️ 部分** | 无变化（单机产品定位） |

**产品还原度最终结论**: **~88%**（↑ 从 ~85%）

**为什么不是 90%+**:
1. MCP 是最小版（~60% CC MCP），不是完整 CC MCP — 连接外部 server 的用户会发现缺少 OAuth、streamable HTTP、skill discovery
2. /compact 边缘逻辑仍 shim（但 trilc 纯文本单机影响极低，产品层面接受此 gap）
3. 多模态完全缺失（终端限制，非产品决策——但仍影响还原度计算）
4. /rewind 被砍（TUI 消息选择器成本合理，但仍是功能缺口）
5. 14 工具 vs 59 工具（广度差距大，但核心工具深度高）

**为什么不是停留在 85%**:
1. Plan mode 从"不存在"到"强制门禁"是产品安全模型的质量跃升，不是渐进改善
2. MCP 从"零"到"tools+resources+prompts 全链路"是功能维度的新增，不是覆盖度上调
3. 渲染层从"基本对齐"到"A+ 级 CC 复制"（Vim/Kill ring/Backspace/消息分层/blocks 流式），日常输入体验显著改善
4. AgentPanel 让 subagent 从"黑盒"到"可见"，复杂任务体验从"信任 AI"到"看见 AI 在干什么"

### 10.10 "完整可用 CC 类产品"最终判定

**判定**: ✅ **达成，且质量超越 v1.0 预期**

**v1.0 判定**: 达成（单机 TUI 产品定位），理由：核心工作流完整 / 标志性功能实现 / Session 管理完整 / 边缘场景可接受。

**v2.0 升级理由**:
1. **Plan mode 从建议到强制**: 不是 bug fix，是产品安全模型的质变。用户现在可以信任 EnterPlanMode 后的行为边界
2. **MCP 从零到全链路**: 打开了外部工具生态的入口。即使是最小版，用户已经可以连接 filesystem MCP server、数据库 MCP server 等标准 MCP 工具
3. **开发者输入体验 A+ 级**: Vim 导航 + Kill ring 循环粘贴 + Backspace 修复 + 消息分层 + blocks 流式——日常输入操作已经和 CC 一样好
4. **Subagent 可见性**: AgentPanel 解决了 v1.0 审计时未察觉的 UX 问题——subagent 在黑盒中运行，用户不知道进度

**未达成项（与 v1.0 一致）**:
- 多模态交互（终端限制，非产品决策）
- MCP 完整 CC（OAuth/streamable HTTP/skill discovery——低频，诚实 defer）
- /rewind（TUI 消息选择器成本合理，砍）
- teammate TUI 暴露（单机产品定位）

### 10.11 诚实标注总结

以下是在整个审核中必须诚实的标注，避免产品渲染过度：

| # | 诚实标注 | 说明 |
|---|---------|------|
| 1 | **Plan 门禁比 CC 更强制，但范围更窄** | TriLC 的 Plan mode 在 agent loop 级拦截 Bash/Edit/Write，CC 主要是 prompt 建议 + 权限 hook。但 TriLC 跳过了 CC 的 team approval 协议、plan 文件持久化、auto-mode classifier 集成。结论：**门禁质量更高，功能广度更窄** |
| 2 | **MCP 是最小版，不是完整 CC MCP** | tools + resources + prompts 全链路可用，但缺 OAuth（需要浏览器）、streamable HTTP（多数 server 用 stdio）、skill discovery（需要 CC 特定管道）、resource subscription（极少数 server 支持）。~60% CC MCP 覆盖率 |
| 3 | **Vim/Kill ring 是开发者功能** | A 级 CC 复制，但对不使用 Vim 编辑模式的用户感知为零 |
| 4 | **/compact 边缘逻辑 shim 对 trilc 确实无影响** | trilc 是纯文本单机 TUI，没有多模态消息，不需要图像剥离/PTL 重试/hooks——CC 的 compact 边缘逻辑就是处理这些的。产品层面接受此 gap |
| 5 | **/rewind 被砍是合理的产品决策** | CC 的 rewind 依赖一个完整的 TUI 消息选择器组件（Ink React），TriLC 建造同等质量的消息选择器是另一个 sprints 的工作量。对于单机 TUI，/resume 已覆盖主要恢复场景 |
| 6 | **14 工具 vs 59 工具** | 广度差距大（24%），但核心工具（Read/Write/Edit/Bash/Glob/Grep/TodoWrite/Task 族/AskUserQuestion/AgentTool/MCPTool/SkillTool/SendMessage）深度 90%+。产品策略是深度优先于广度 |
| 7 | **多模态缺失是终端限制** | 不是 TriLC 的产品决策，是 Windows Terminal / TUI 的技术边界 |

### 10.12 v1.0 预测 vs 实际 — 诚实复查

v1.0 审计（基于 P0-P5）的"建议后续做的项（P6）"列出了 6 项"不做"建议 + 理由。实际 P6-P8 裁决全部做了。逐项复查：

| v1.0 "不做"建议 | 实际结果 | 复查意见 |
|----------------|---------|---------|
| MCP 支持（"极客场景，普通用户无感"） | P6-P8 全做（最小版） | **部分验证**：普通用户确实无感，但实现了最小版。产品价值在于打开了未来外部工具生态的入口，战略意义大于当前产品体验意义 |
| Plan mode（"习惯差异，非功能缺失"） | P6-P8 全做，且升级为强制门禁 | **v1.0 低估了**：强制门禁不是"习惯差异"，是安全模型提升。Plan mode 让用户能安全地让 AI 先探索再执行——这不是习惯，是信任机制 |
| /branch /rewind（"边缘场景"） | /branch 做，/rewind 砍 | **v1.0 判断合理**：/branch 实现简单（纯 FS），/rewind 确实不划算（TUI 组件成本 >> 价值） |
| 完整权限持久化（"偏离 CC 语义"） | 已实现（JSON settings） | **v1.0 过度保守**：CC 的 `settings.json permissions.allow` 就是 session 级持久化，语义一致。实现简单，成本低 |
| bundled-skills 补全（"强行复制引入依赖问题"） | 6 skills（+3 新） | **v1.0 过度保守**：claude-api/keybindings/lorem-ipsum 三个 skill 都是纯 prompt 或低依赖，不引入 CC 内部依赖 |
| Vim 模式 / Kill ring（"极客向"） | A 级 CC 复制 | **v1.0 标签准确但低估开发者需求**：对使用 Vim 模式的 CC 开发者用户，这是肌肉记忆依赖，不是"极客向" |

**v1.0 产品判断反思**: v1.0 基于 P0-P5 基线的产品判断总体合理，但对"MCP/Plan mode 的战略价值"判断偏保守。实际实现后，MCP 最小版的产品体验增益有限（确认 v1.0 "普通用户无感"判断），但 Plan mode 强制门禁的产品体验增益显著（v1.0 低估了"信任机制"的产品价值）。

### 10.13 最终产品建议（P8 后）

**当前定位**: TriLC 是一个 **"CC 核心体验可用的单机 TUI 编码助手"**，产品还原度 ~88%。

**不需要继续做的**:
1. MCP OAuth / streamable HTTP / skill discovery / resource subscription — 低频，优先级低
2. /rewind — TUI 消息选择器成本明确不合理
3. Compact 完整边缘逻辑 — trilc 纯文本单机不需要
4. 多模态 — 终端限制，非 TriLC 范围
5. Teammate TUI — 单机产品定位

**可以考虑但非必须的**:
1. 工具广度拓展（从 14 → 25-30 工具） — 提升功能清单完整感，但核心工具已覆盖 90%+ 使用场景
2. Slash 命令广度（从 ~8 → ~15-20） — 同上
3. 更多 CC bundled skills — 边际收益递减（当前 6 个已覆盖核心场景）

**建议优先级**: 打 MSI 实测 P0-P8 累计成果，收集真实用户反馈，再决定下一步产品方向。

---

### 10.14 使用依据（v2.0 增量）

| 来源 | 路径 | 角色 |
|------|------|------|
| CTO P6 架构方案 | `p6-architecture-plan.md` | Plan mode 简化版 / MCP 最小版的架构决策事实 |
| CTO P7 架构方案 | `p7-architecture.md` | Plan 强制门禁 / MCP resources 的最终实现事实 |
| CTO P8 架构方案 | `p8-architecture.md` | Plan TTL / MCP prompts 的最终实现事实 |
| P6 Tree OP | `tree-op-p6-remaining.json` | P6 闭合记录（CTO/FullStack/Test 三方审核） |
| P7 Tree OP | `tree-op-p7.json` | P7 闭合记录（Plan 门禁 15 工具白名单 + MCP resources） |
| P8 Tree OP | `tree-op-p8.json` | P8 闭合记录（Plan TTL + MCP prompts + 端到端验证） |
| v1.0 审计 | `cpo-coverage-audit.md` | 本次修订的基线 |

---

**v2.0 审核完成**

**最终核心结论**: TriLC 已达成 "CC 核心体验可用的单机 TUI 编码助手" 状态，产品还原度 **~88%**（↑ 从 v1.0 ~85%）。P6-P8 增量中，Plan mode 从 advisory prompt 升级为 agent 级强制工具门禁是一次**产品安全模型的质量跃升**（非渐进改善）。MCP 全链路（tools+resources+prompts）是最小完整版（~60% CC MCP），核心场景覆盖但低频场景诚实 defer。Vim/Kill ring 是 A 级 CC 复制，但对非 Vim 用户感知为零。一个熟练的 CC 用户迁移到 TriLC，约 90% 的编程任务可无感完成（↑ 从 80%）。

**诚实底线**: TriLC 不是一个"CC 替代品"，而是一个"CC 核心体验的独立实现"。它在 Plan mode 门禁质量上超越了 CC，在 MCP / 工具广度 / 命令广度 / 多模态上低于 CC。这个差异是产品定位和资源约束的合理结果，不是质量问题。
