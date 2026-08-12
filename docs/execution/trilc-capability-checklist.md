# TriLC 能力验证清单（Capability Checklist）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/trilc-capability-checklist.md
- syncMode: source-only
- lastSyncedAt: 2026-08-12T22:00:00+08:00

> 版本：v2026.W33.9
> 日期：2026-08-11（2026-08-12 更新：...v2026.W33.8 M2 第五轮——C15 v2 + 2.4 + 2.5 通过；v2026.W33.9 M2 第六轮——2.1/2.2 任务闭环跨域端到端通过）
> 日期：2026-08-11（2026-08-12 更新：v2026.W33.2 新增「CC 特性对标层」+ 治理条目；v2026.W33.3 M2 第一轮验收——C12/C13、条目 2.3 通过；v2026.W33.4 M2 第二轮验收——C8/C9 权限模式矩阵与权限规则通过；v2026.W33.5 收口门禁规则生效；v2026.W33.6 M2 第三轮验收——C10 MCP server 接入与发现通过；v2026.W33.7 M2 第四轮——C1 通过、C15 手动 compact 落地；v2026.W33.8 M2 第五轮——C15 v2 自动 compact 通过 + 2.4 超时上报通过 + 2.5 degraded 通过）
> 状态：正式版（CEO 确认签发）
> 适用范围：TriLC 能力验证期（M2），TriMC 舰队审核、TriLC 受验
> owner：TriMC 舰队（审核方） / TriLC（受验方）
> 关联：`docs/workflow/operating-records/2026-W33/project-ai-community-weekly-2026-W33.md` 决策登记块（M2 里程碑）
> 前置：M0（服务器仓 + git 同步链路）与 M1（舰队自由对话 + TriMC 编排 MVP）通过后启动
> 版本说明：v2026.W33.2 新增两层之一——§二.5「CC 特性对标层」（TriLC 作为 claude code 等价物必须学会的能力，M4 源码替换前提）；治理条目 1.5（回滚执行）与 6.4（会话初始化器）并入对应域，编号顺延；v2026.W33.3 M2 第一轮验收收口（C12/C13 模型路由与降级通过）

## 一、目标与机制

**目标**：TriLC 目前能力未稳定，不能独立承担工作。在 TriMC 的监督下，TriLC 通过**真实研发工作**逐步覆盖本清单全部能力项；**全部打勾并通过 TriMC 审核**后，TriLC 获得独立承担工作资格，进入生产双跑形态（TriLC + TriMC 互为 fallback）。

**机制**：

1. **验证 = 真实研发任务覆盖，不是模拟测试**。TriLC 每完成一个实际任务（修 bug、跑构建、做健康检查、更新 OP 记录等），TriMC 舰队核对本次工作覆盖了哪些能力项、质量是否达标，达标才打勾。
2. **审核方是 TriMC 舰队**（服务器域），受验方是 TriLC（Windows 本地域）。TriMC 派任务 → TriLC 执行 → 结果回传 → TriMC 审核打勾。
3. **验证位置标注**：每项标注"服务器可验"（舰队在服务器仓直接核验）或"本地验后回传"（构建链/MSI 等 Windows 专属操作，TriLC 本地执行后回传产物与日志）。
4. **完成证据**：每项打勾时登记证据（任务 ID / commit / 日志路径 / 审核结论），证据缺失不算通过。
5. 清单维护：TriMC 舰队审核后更新本文件（状态 + 证据），TriLC 与本地侧可读。

## 二、能力清单

### 1. 基础执行域

| # | 能力项 | 通过标准 | 验证位置 | 状态 | 完成证据 |
| --- | --- | --- | --- | --- | --- |
| 1.1 | git 多仓操作 | 六仓 status/diff/commit/branch/merge 全程正确，无误提交、无误丢 | 服务器可验 | 未开始 | — |
| 1.2 | 文件读写规范 | UTF-8 写入、完整绝对路径、大文件分块（周共学 2.1.6 纪律） | 服务器可验 | 未开始 | — |
| 1.3 | 命令 spawn 与错误处理 | node/npm/ps1 调用正确，子进程失败被捕获并上报，无假阳性日志（W30 教训：不能只看 spawn 返回） | 服务器可验 | 未开始 | — |
| 1.4 | 编码纪律 | 无 Set-Content 默认编码事故、无 LF/CRLF 混写事故（W30 2.6 教训） | 服务器可验 | 未开始 | — |
| 1.5 | 回滚执行 | 按审核指令**精确回滚指定 commit**（`git revert <sha>` 或等价，不整仓回退）：回滚后验证工作区干净（`git status`）、相关文件恢复指定状态、回传结果与证据。"谁破坏谁回滚，批准权在审核者"——未经 TriMC 舰队批准不得自行回滚他人变更 | 服务器可验 | 未开始 | — |

### 2. 任务闭环域

| # | 能力项 | 通过标准 | 验证位置 | 状态 | 完成证据 |
| --- | --- | --- | --- | --- | --- |
| 2.1 | 接任务 | 通过 HTTP 契约（`/internal/v1/tasks/submit`）接收 TriMC 派发的任务 | 服务器可验 | **通过** | M2 第六轮验收：TriMC TriLCDispatchExecutor 三步执行 (submit→SSE consume→callback, TriMC 0277313) + TriLC /tasks/submit 端点 (session 持久化 + SSE stream + connectionState)；小柯全链路代码追踪验证通过，TaskController 5 态状态机正确 |
| 2.2 | 执行与回传 | task_done/task_error 语义正确；**终止错误绝不发送伪 task_done**（W30 教训） | 服务器可验 | **通过** | M2 第六轮验收：C13 四层 task_error 防线 (已通过) + TriMC taskResultCallback → completeTask/failTask 回写 + TriLC SSE stream task_done/error 映射 + 2.4 error 状态语义；小柯 254 回归零退化，全链路 11 场景分析通过 |
| 2.3 | 模型路由 fallback 链完整性 | 所有 fallback 末端模型必须在注册表内；provider 全挂时产生真实 task_error，**绝不发伪 task_done**（W30：模拟断 TriStaciss 实测"Unknown model"事故） | 服务器可验 | **通过** | M2 第一轮验收：TriLC 94ceae8+0de39ad（validateModelAgainstRegistry 预验证 + 四层 task_error 防线 + validateModelRegistry 启动检查）+ TriMC 1df2311（FALLBACK_MAP tmv-* 扩展）+ TriModel 43/43 测试通过（含 21 C12/C13 专项）。详见 docs/execution/trilc-capability-checklist.md §C12/C13 |
| 2.4 | 超时与失败上报 | 超时/失败主动上报，不静默、不无限重试 | 服务器可验 | **通过** | M2 第五轮验收：session status 'error' 语义（task_error → error，interrupted 保留恢复路径，TriLC `bb4ee8a`）；小柯 254/254 内覆盖 |
| 2.5 | degraded 模式 | TriMC 不可达时本地续跑，恢复后状态对齐（互为 fallback 契约） | 服务器可验 | **通过** | M2 第五轮验收：degraded 完善——local 状态 + 持久化 + 退避 + 通知（TriLC `0cbd25b`）；与 C13（模型 provider 降级）边界分明；小柯 254/254 内覆盖 |

### 3. 工程门禁域

| # | 能力项 | 通过标准 | 验证位置 | 状态 | 完成证据 |
| --- | --- | --- | --- | --- | --- |
| 3.1 | 构建通过 | `npm run build` / `npx tsc --noEmit` 无错误 | 服务器可验 | 未开始 | — |
| 3.2 | 测试通过 | `npm test` 全绿，新增代码有测试覆盖 | 服务器可验 | 未开始 | — |
| 3.3 | diff 审查质量 | 提交信息规范、变更最小化、无垃圾文件混入 | 服务器可验 | 未开始 | — |
| 3.4 | 安装态意识 | 开发态与安装态差异被正确识别（W30：源码能跑 ≠ 安装态能跑） | 本地验后回传 | 未开始 | — |

### 4. 跨模块域

| # | 能力项 | 通过标准 | 验证位置 | 状态 | 完成证据 |
| --- | --- | --- | --- | --- | --- |
| 4.1 | sibling 仓库引用 | `../TriLC`、`../TriCode`、`../TriCompany` 等跨仓路径解析正确 | 服务器可验 | 未开始 | — |
| 4.2 | contracts 加载 | 12 份合同完整加载，system prompt 非空（TriCade 内置路径 + 源码工作区双路径） | 本地验后回传 | 未开始 | — |
| 4.3 | 六仓健康检查 | `git-six-repo-health-check.ps1` 运行与问题修复闭环 | 本地验后回传 | 未开始 | — |

### 5. 生产链域（全部本地验后回传）

| # | 能力项 | 通过标准 | 验证位置 | 状态 | 完成证据 |
| --- | --- | --- | --- | --- | --- |
| 5.1 | MSI 构建全链路 | build-desktop.ps1 从源码到 MSI/ZIP 一次成功，staging 干净（W30：残留文件混包事故） | 本地验后回传 | 未开始 | — |
| 5.2 | 安装态验证 | 安装后 daemon 启动、`/healthz` 200、12/12 agent + prompt 可用 | 本地验后回传 | 未开始 | — |
| 5.3 | 服务管理 | nssm/计划任务注册、卸载、状态查询正确 | 本地验后回传 | 未开始 | — |
| 5.4 | 升级与回滚 | 版本升级规则正确（同版本不覆盖、新版本可升级）、回滚预案可执行 | 本地验后回传 | 未开始 | — |

### 6. 运营纪律域

| # | 能力项 | 通过标准 | 验证位置 | 状态 | 完成证据 |
| --- | --- | --- | --- | --- | --- |
| 6.1 | OP 记录更新 | 周记、tree 节点按周更节奏更新，无断更 | 服务器可验 | 未开始 | — |
| 6.2 | 周会输入输出 | 按议程提供进度/阻塞输入，会议纪要收口 | 服务器可验 | 未开始 | — |
| 6.3 | 任务树状态同步 | tree-op 节点状态与真实工作一致（不夸大、不滞后） | 服务器可验 | 未开始 | — |
| 6.4 | 会话初始化器 | onboarding 改造：合同加载（员工合同 YAML → 运行时配置）/ 五件套装配（soul/记忆/技能/工具/合同）/ 工作目录就绪；**本地与服务器双端各一份**（互为 fallback 都要能拉员工上岗——本地 TriLC 与服务器官方 claude 舰队同源合同、同源五件套） | 服务器可验 + 本地验后回传 | 未开始 | — |

## 二.5、CC 特性对标层（v2026.W33.2 新增）

> 定位：执行器能力层（§二 1-6 域）之上，TriLC 作为 **claude code 等价物**必须学会的能力层——这是 M4 源码替换的前提。每项三列：TriLC 现状（有/无/部分 + 证据）、差距（缺什么）、优先级（M2 受验必需 / M3 生产必需 / M4 替换必需）。
> 对标基座：官方 claude code 2.1.227（服务器已部署，M1 实测通道：spawn `claude --bg` / `claude agents --json` / `claude -p --resume --fork-session`）。
> 验证位置标注同 §二：服务器可验（TriMC 舰队在服务器仓直接核验）或本地验后回传。

| # | 对标项 | TriLC 现状（证据） | 差距 | 优先级 |
| --- | --- | --- | --- | --- |
| C1 | 会话 start/resume | **通过**：M2 第四轮验收——小柯独立验证 69/69 全过（覆盖验证包 9 场景：跨重启恢复、跨目录恢复、session-store 持久化/类型/safety-check 全链路；测试文件 `test/c1-session-resume.test.ts`） | 差距已闭环（resume 正确性验证完成） | M2 受验必需 |
| C2 | 会话 fork | **部分**：`src/tui/fork.tsx`（UI 层存在） | fork 数据层未闭环（复制会话上下文为新会话） | M3 生产必需 |
| C3 | 后台会话生命周期（--bg 等价） | **无**：daemon 仅守护服务，无会话粒度后台化 | 后台会话 spawn/枚举/停止（对标 `claude --bg` + `claude agents`） | M3 生产必需 |
| C4 | SendMessage 跨会话 | **部分**：`src/tools/send-message.ts`（A 级复制 CC，localbus 进程内；注释明示 cross-daemon 不可用） | 跨 daemon / 跨机消息（对接 TriMC session-bridge 通道） | M3 生产必需 |
| C5 | ListAgents / 会话寻址 | **部分**：TriMC 侧 `session-bridge.listAgents()`（agents --json）已 MVP | TriLC 侧无会话枚举 API（自报能力/状态） | M3 生产必需 |
| C6 | agent teams / mailbox | **无**：send-message 注释明确无 mailbox/teammate 系统 | teammate 生命周期、邮箱、组队协议 | M4 替换必需 |
| C7 | hook 系统 | **无**：grep hook 仅命中 TUI React hooks（useBlink 等），非 CC hook 生命周期 | PreToolUse / PostToolUse / Stop / SubagentStop / PermissionRequest 注册与事件 | M3 生产必需 |
| C8 | 权限模式矩阵 | **通过**：M2 第二轮验收——agent-core PermissionMode 6 种 (default/acceptEdits/auto/dontAsk/bypassPermissions/plan) + 决策管线 10 步 (TriMC 7faa18b)；TriLC CLI --permission-mode + plan-mode 双层防护架构 (TriLC a50e039)；小柯 86 用例全通过，6 种模式语义正确；3 条非阻塞观察项 (Bash/shell_exec 名称、Glob 边界、acceptEdits 归类) 已登记 | 差距已闭环 | M2 受验必需 |
| C9 | 权限规则与 -p 非交互 | **通过**：M2 第二轮验收——agent-core PermissionEngine.additionalDirectories + isPathInBoundary 路径标准化 (TriMC 08ced77/da17d97)；TriLC PermissionStore v2 双向 allow/deny + v1 自动迁移 + CLI --allow/--deny/--add-dir/-p + buildSessionPermissionRules (TriLC 5112017)；小柯 12 用例全通过，ask→deny 确定性拒绝、规则优先级、content filter 全部正确 | 差距已闭环 | M2 受验必需 |
| C10 | MCP server 接入/发现 | **通过**：M2 第三轮验收——TriLC CLI `trilc mcp add/remove/list/status` + mcp-config 持久化 (TriLC 6b45b08)；McpClientManager per-tool 注册 `mcp__<server>__<tool>` + connectServer/disconnectServer 动态接入 + daemon 5 端点 (TriLC 8ddcb94)；agent-core unregister (TriMC 0620290) + isMcpWriteTool/isMcpFileTool MCP 管线检测 + BUG-C10-01 前缀剥离修复 (92a373a)；小柯 39 专项 + 86 回归全通过，3 条非阻塞观察项 (parseToolName 正则、disconnectAll 清理、dontAsk pathless MCP 工具) 已登记 | 差距已闭环 | M2 受验必需 |
| C11 | TUI / 交互 | **有**：`src/tui/`（ink + termio + useCursorInput/useSSE） | 光标/IME 细节、历史、渲染兼容性 | M3 生产必需 |
| C12 | 模型路由多 provider/fallback | **通过**：M2 第一轮验收——R1 FALLBACK_MAP 扩展 (TriMC 1df2311: 新增 4 条 tmv-* 条目, 双层 fallback 架构注释)；R2 启动注册表检查 (TriLC 0de39ad: validateModelRegistry() 启动时检查 defaultModel+criticalFallbacks, 缺失 WARNING 不阻断)；TriLC validateModelAgainstRegistry() 请求时预验证 (94ceae8)；TriModel buildRegistry() fallback 链已修正 (W30 根因 tmv-deepseek-chat→deepseek-chat 改为 →deepseek-v4-flash) | 差距已闭环 | M2 受验必需 |
| C13 | 模型降级（degraded） | **通过**：M2 第一轮验收——四层 task_error 防线（L1 预验证→L2 terminalError break→L3 post-loop return→L4 空输出 guard→L5 outer catch），task_error 后绝无伪 task_done；degraded 三态日志 `[trilc:conn]` / `[trilc:model] degraded` / `[trilc:model] CRITICAL` 可辨；recovery 事件监听 tier=2 降级日志 (TriLC 0de39ad) | 差距已闭环 | M2 受验必需 |
| C14 | CLAUDE.md / 记忆注入 | **部分**：`src/context-adapter/adapter.ts`（neutral-local-context 薄层） | CLAUDE.md 自动发现/加载、记忆注入深度（对标 TriMC memory-injector/context-builder） | M3 生产必需 |
| C15 | compaction | **通过**：M2 第四+五轮——手动 compact（`801f72b`/`f5f54c2`）+ 自动触发 v2 事件驱动零循环依赖（`0a5fc49`，解决 c9b85d2 循环依赖卡点）；小柯 254/254 全过；摘要质量对齐待验（观察项） | 差距已闭环 | M2 受验必需 |
| C16 | 远程控制与渠道 | **无** | Remote Control（REST/WS 附加会话）、--channels 渠道 | M3 生产必需 |
| C17 | 构建与打包 | **有**：`src/daemon/`（schtasks/launchd/systemd/watchdog）+ TriCade 侧 MSI | 无（TriCade 已产 MSI/ZIP；本地域项） | M3 生产必需 |

## 三、通过门槛

- 全部能力项状态 = 通过，且每项有完成证据；
- TriMC 舰队出具独立审核结论（覆盖质量、错误处理、纪律遵守）；
- 达到门槛后：TriLC 获得独立承担工作资格 → 进入 M3 生产双跑（生产仓 = TriLC + TriMC 互为 fallback）。

## 四、M0 双仓同步机制（前置环境）

- **服务器目录**：`/srv/git/<repo>.git`（裸仓，接收本地 push）+ `/srv/fleet/<repo>`（舰队工作克隆，从裸仓 pull）。
- **同步纪律**：
  1. git 是唯一同步通道；服务器仓 = 审核面，**舰队不直接改 main**；
  2. 写方向单主体：本地 → 裸仓 → 舰队克隆；反向（舰队改动/审核结论）走 PR 式合并回本地；
  3. 构建链在 Windows 本地执行，产物/日志经回传机制（任务结果）供舰队审核。

## 五、维护规则

- 更新人：TriMC 舰队（审核通过后即时更新对应行状态 + 证据）；
- 频率：随实际研发任务自然推进，无固定周期；
- 变更：能力项增删由 CEO 确认，验证标准变更由舰队提出、CEO 审批；
- **收口门禁 v2（v2026.W33.5 起，2026-08-12 CEO 定案，v2 补充最终报告规则）**：每轮收口 = 判定 + 清单登记 + **push 三仓同步** + **最终报告**四件事，缺一不算收口。
  - push 动作由**编排层统一执行**（团队 agent 本地完成工作后 push 步骤执行不稳定——已观测：C12/C13 轮小狄、C8/C9 与 C10 轮小贾；push 列为运营已知项，收口时编排层复核 `git ls-remote` 与舰队克隆状态后补齐）。
  - **最终报告由编排层代生成**：PASS 信号到达后 10 分钟内无 agent 正式报告，编排层直接按清单状态收口——判定与登记落进文档即视为事实发生，不依赖 agent 回话（已观测：团队 agent 收口不回报为常态，小狄 1 次、小贾 3 次，工作均已完成、仅叙事缺失）。
