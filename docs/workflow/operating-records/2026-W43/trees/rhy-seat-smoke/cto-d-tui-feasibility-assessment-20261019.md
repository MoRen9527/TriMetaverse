# CTO 立项评估卷 · D 案=TriRLC Ink TUI 接 dsh 会话库（可行性/人日/风险/工期/两线对比）· 2026-10-19

- sourceOfTruth: 本卷（trees/rhy-seat-smoke/cto-d-tui-feasibility-assessment-20261019.md）
- syncMode: static（立项评估·只评估零施工·BOD 23:3x 派工令·CEO 23:32 裁）
- lastSyncedAt: 2026-10-19T15:44:24Z（+8=23:44:24 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: CEO 2026-10-19 23:32「按 BOD 意见办，D 立项评估」→BOD 派工令（候选主案=TriLC 现成 Ink TUI 接 dsh 会话库·对照线=官方 tui 被动等待·两线并行不互斥）
- 边界照守：只评估零施工·现役栈零触碰·dsh SDK 面只读勘（-J sg 通道）·TriRLC TUI 代码只读勘·D-46 零值面。

## §一 结论先行

**建议有条件立项**：接线面正形存在且双端资产成熟（dsh `--profile sdk`=官方 stdio JSON-RPC harness 面·TriRLC Ink TUI=现役成品前端）——主干改造为「写一层 JSON-RPC 适配 hook+子进程管理」而非从零建 TUI。**前置 P0 探针（0.5 人日）**验证唯一未定谳面（SDK 对 web 建会话的 resume 语义）——探针绿进主线（合计 4-6 人日·1-2 周内可控达成「终端直挂」）；探针红降级评估（C 形 headless 或候 A 线）。

## §二 候选主案可行性（接线面勘验实锚）

### §2.1 dsh 侧：官方 SDK 面正形存在（河源实盘只读勘·0.2.0-rc.2）

| 件 | 实锚 | 形 |
| --- | --- | --- |
| `dsh --profile sdk` | dsh-sdk-app README（实盘在册） | **长驻 stdio JSON-RPC harness runtime**——stdout 保留给 newline-delimited JSON-RPC frames·继承 base 完整栈（adapters/tools/persistence/policy/settings/credentials）·**会话入库与 web 同库**（projection cache checkpoints SDK-created sessions for later consumers） |
| 协议 | dsh-sdk-protocol lib/types/types.d.ts（逐行读） | JSON-RPC 2.0 逐行帧·**3 请求**（`initialize`：provider/model/cwd/effort/maxTokens；`session/prompt`：sessionId+contentBlocks→durable enqueue receipt；`shutdown`）+**4 通知**（`session.event`：**runtime 全部会话逐事件流**·`session.status`：running/idle·`subagent.started/finished`） |
| sessionId 语义 | types.d.ts L59-61 原文 | 「The SDK-side session id; **an unknown id lazily creates** the agent+session pair」——known id 即用（续挂语义暗示）·**对 web 建会话的 resume 未文档化=P0 探针项** |
| 事件粒度 | dsh-session types.d.ts L442/L470 | SurfaceEventType 五类（system/developer/user/assistant/message+tool/result）·**assistant 事件内嵌 provider stream**（流式渲染有据）·SESSION_FORMAT_VERSION=4 信封稳定（ignorable guard 覆盖词汇增长） |
| sdk-minimal | README 实勘 | **排除适用**：deliberately excludes base/共享 persistence 栈（自带无压缩 JSONL 独立持久化）——**resume 现役 web 会话必须走完整 sdk-app 形** |
| headless 对照 | BOD 令文实证（§七树面未落存照·如实注） | `--session-id` 同库续挂 RC=0·transcript 同文件增长·session.lock 不拒第二挂载——**append-only JSONL 多进程共存已实证**（sdk 进程形同持久化栈·强旁证） |

### §2.2 TriRLC TUI 侧：现役成品前端（本机仓只读勘）

- **Ink 引擎成熟**：CC fork 引擎吸收 v0.9.0 完（src/tui/ink/ 45+ 文件·tech-design.md §1 全记录·React 19.2.8+react-reconciler 0.31 版本冲突已消）。
- **组件面全**：InputBox/Messages/Markdown/ToolCallLine/TodoPanel/AgentPanel/StatusLine/ThinkingLine/InteractionPrompt/ErrorMessage——聊天面/工具调用行/todo/交互确认全套现役。
- **hooks 层即接线层**：useChat/useSSE/useAnthropicSSE 并存——**后端协议已是多方言形态**（OpenAI SSE+Anthropic SSE）·再加一方言（dsh JSON-RPC）为同构扩展非架构突破。
- **现役耦合面（如实注）**：`trilc chat` 与 TriRLC daemon 会话/agent 契约/权限模式耦合（--agent/--resume/--permission-mode·init 模式项目流程）——**接 dsh 不复用这些**（dsh 侧 policy/人格/会话自理）·TUI 以「dsh 前端」形另立入口（见 §三施工形）。

### §2.3 接线架构（评估定形）

```
tmux r-duty-<席名>（CEO 直挂）
  └─ trilc dsh-tui --session <席现役会话id>   ← 新 CLI 入口（或独立 bin）
       ├─ spawn: dsh --profile sdk（子进程·stdin/stdout 管道·cwd=席工作区）
       ├─ 适配 hook useDshSession（替代 useChat）:
       │    initialize→session/prompt(现有sessionId)→session.event 流→组件映射
       │    （user/message→回显·assistant/message→Markdown 流·tool/result→ToolCallLine·
       │      system/developer→StatusLine·session.status→ThinkingLine/Spinner）
       └─ Ink 渲染循环（现役引擎组件 80%+ 零改复用）
```

**人格/历史语义**：web 与 TUI 同库同会话（dsh 持久化栈自理）——「web 历史与终端续聊同段」=v2 令原目标达成形；同席 web/tui 并发写面照「串行护栏」（BOD 实证 append-only 兼容·但应用层串行照守至并发语义勘明）。

## §三 工作量人日（FSD 线施工·本席架构+验收）

| 项 | 内容 | 人日 |
| --- | --- | --- |
| P0 探针（先行·gate） | 河源隔离工作区：spawn sdk 形→initialize→session/prompt 带 web 建会话 id→断言 transcript 增长+session.event 收流——**唯一未定谳面直验** | 0.5 |
| 适配 hook | useDshSession（JSON-RPC line client+子进程管理+5 类事件→组件映射+错误/断连处理） | 2 |
| CLI 入口 | `trilc dsh-tui`（或独立 bin）--session/--workspace 参数面+tmux 包装脚本（13 席名册驱动） | 0.5 |
| 组件对齐 | tool/result 事件词汇→ToolCallLine/TodoPanel 映射微调+assistant 流式渲染对齐（provider stream 解嵌） | 1 |
| 联调+门禁 | 1 席端到端（CEO 直挂路径实测）→13 席铺开·门禁=渲染冒烟+同库续聊断言+串行护栏验证+回滚预案 | 1-2 |
| **合计** | | **5-6 人日**（探针绿前提下·含门禁） |

## §四 风险清单

| # | 风险 | 级 | 缓解 |
| --- | --- | --- | --- |
| 1 | **SDK 对 web 建会话 resume 语义未定谳**（README 只写 SDK-created sessions 入 cache·known id 行为未文档化） | 高·可先验 | **P0 探针前置**（0.5 人日直验）——红则降级：新会话形（--session 不带现役 id·每席 TUI 新会话·历史不续）或候 A 线 |
| 2 | 事件粒度映射失真（tool/result 词汇与 TriRLC ToolCallLine 语义差） | 中 | §2.2 组件映射面已勘五类·联调门禁含渲染走查；先 1 席后 13 席 |
| 3 | 上游版本演进（0.2.1-rc.2 依赖表无 tui·官方 tui 发布后自建面重叠） | 中 | 两线并行定位=BOD 令原形；A 线发布后切换评估一次成型（同库·零数据迁移）——自建面沉没成本≤6 人日 |
| 4 | web/tui 同席并发写（session.lock 语义 BOD 已证不拒第二挂载·应用层语义未勘） | 低-中 | 串行护栏照守（v2 令原条款）·并发勘明前不放开 |
| 5 | TriRLC 双线分叉（本机 28 提交 vs sg tc001-canonical——src/tui 在本机线） | 低 | 施工前勘 TUI 代码所属线+合并基线·施工位单线落 |

## §五 工期建议

- **P0 探针**：0.5 人日（1 个工作窗内·候窗令即可开——零现役触碰·隔离工作区）。
- **主线**：探针绿后 5 人日±1（FSD 施工·本席架构 review+验收）——**1-2 周自然工期**（含联调门禁与 13 席铺开）。
- **节奏建议**：与 A2 窗（8712/8710 部署）错峰——A2 收口后开 D 窗，避免 r-duty 班组双线并行（班组现役 A2 施工中）。

## §六 两线对比（D 主案 vs A 对照线）

| 维 | D 案（自建接 sdk 面） | A 线（官方 tui 被动等待） |
| --- | --- | --- |
| 时间可控性 | **1-2 周可控达成** | 不可控（0.2.1 线未见·疑似未成型·r-duty-cos 勘 npm 全量无 tui） |
| 成本 | 5-6 人日 | 零施工成本·等待期「终端直挂」目标持续缺位 |
| 风险 | §四 五项（#1 探针可先验·余均有缓解） | 零工程风险·但官方 tui 形态/发布节奏不受控 |
| 目标达成 | 「打开就聊」直挂+同库续聊=v2 令全目标 | 发布后大概率一次成型（README L28 示例形已在） |
| 相互关系 | **并行不互斥**（BOD 令定形）：D 成=目标先达+A 发布后可平滑切换（同库零迁移）；D 探针红=A 线自动成为唯一线·沉没成本仅 0.5 人日 | — |

## §七 立项建议

**建议立项（有条件·两段式）**：
1. **即刻批 P0 探针**（0.5 人日·隔离工作区零现役触碰）——SDK resume 语义直验·探针卷落树三送。
2. **探针绿→批主线**（5 人日±1·FSD 施工本席验收·与 A2 错峰）；**探针红→D 案降级**（新会话形重评估或候 A）——裁决点前置·沉没成本最小化。

## §八 使用依据

- BOD 派工令（D 立项评估·接线面候选三形）+BOD 卷 bod-rduty-tmux-direct-dispatch-20261019.md（§五 dsh 勘定/§六受阻收执·54ce39685）+存照报告 rduty-blocked-report-20261019.md（r-duty-cos 初勘：TriLC TUI 后端=TriModel+agent-core 不接 dsh· Bundles 全集无 tui）
- 河源实盘只读勘（-J sg·本窗四发）：dsh-sdk-app/README.md·dsh-sdk-protocol/README.md+lib/types/types.d.ts（L25-90·sessionId 语义原文）·dsh-sdk-minimal/README.md·dsh-session/lib/types/types.d.ts（L442 SurfaceEventType/L470 provider stream）
- 本机 TriRLC 仓只读勘：src/tui/tech-design.md（v0.9.0 引擎吸收记录）·src/tui/components|hooks 全列·src/cli.ts chat 命令面
- BOD 令文面实证（headless --session-id RC=0·transcript 同文件增长·session.lock 不拒第二挂载——树面未落存照·如实注）
- 边界照守声明：本评估零施工·现役栈零触碰·dsh web 8791/13 席会话库/daemon cron 零触碰·D-46 零值面

—— CTO 小狄（落款 date 现查原值 2026-10-19 23:44:24 +0800·发毕对表）
