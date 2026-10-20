# D' 主线架构定稿 · TriRLC TUI 接 dsh ACP 协议面（独立进程形）· 2026-10-20

- sourceOfTruth: 本卷（docs/execution/dprime-tui-acp-architecture-20261020.md）
- syncMode: static（架构定稿·BOD 2026-10-20 18:19:47 接续准令·CEO 11:28 窗位令在案）
- lastSyncedAt: 2026-10-20T10:21:09Z（+8=18:21:09 北京·date 现查原值粘贴·D-47 机械闸）
- 前卷承接: cto-p0prime-acp-resume-closeout-20261020.md（半绿定谳）· cto-dprime-plugin-vs-standalone-assessment-20261020.md（独立进程形裁定）

## §一 定稿判断

**TriRLC TUI 经 `useAcpSession` hook 接 `dsh --profile acp` 子进程（ACP v1 标准协议面）**——TUI 自建段同段续聊（P0' 绿侧）·web 存量段历史回看交 web 端（红侧降级·BOD 收执认）。

四条关键裁决：

1. **不引入 @agentclientprotocol/sdk 依赖**——该包为 agent 侧服务 SDK；客户端只需 newline-delimited JSON-RPC 帧层（5 请求+1 通知·~200 行）自写，对齐 TriRLC 自研形态（fork ink 先例）·零依赖树膨胀。
2. **后端选择点=CLI flag**：`trirlc tui --acp` 切 useAcpSession，缺省维持 useChat（daemon 8711 Anthropic 面）不动——现役链路零回归风险。
3. **session 生命周期**：启动 `session/list{cwd}`→有段则 `resume` 最新（「打开就聊」）·无段 `session/new`；正常退出 `session/close`（P0' 实证 close 后段仍 resumable·释放运行态不删历史）。
4. **历史显示 v1=续挂+新交互**（transcript 只读渲染留 P2 候选·评估卷 §三 两案裁决）。

## §二 构件与映射

| 构件 | 落点 | 职责 |
| --- | --- | --- |
| acp-client.ts | TriRLC `src/tui/acp/` | spawn(DSH_BIN,['--profile','acp'])·JSON-RPC 帧编解码·pending map·notification 分发·硬超时+stderr 捕获（4KB 上限） |
| useAcpSession.ts | TriRLC `src/tui/hooks/` | 对齐 useChat 对外接口形（messages/blocks+send+requestState）·session 生命周期·update 流→ContentBlock 映射 |
| CLI 接线 | cli.ts+app.tsx | `--acp` flag→hook 选择；app.tsx 注意 @ts-nocheck 现状（Phase 2 补类型挂账在案·本段不扩债） |

**session/update → UI 映射表**（REGR-005 有序块模型为靶）：

| ACP update 类型 | UI 靶 |
| --- | --- |
| agent_message_chunk | text block 增量（流式） |
| agent_thought_chunk | thinking（ThinkingLine） |
| tool_call | tool_use block 新建（pending） |
| tool_call_update | toolStatus 更新+tool_result block（ToolCallLine/ToolResultLine） |
| plan | TodoPanel |
| usage_update | StatusLine token 读数 |
| user_message_chunk | 忽略（本地已 echo） |

**帧形锚**（@agentclientprotocol/sdk dist/schema/types.gen.d.ts·河源 2026-10-20 实勘）：InitializeRequest{protocolVersion:1,clientInfo}·NewSessionRequest{cwd,mcpServers:[]}·ResumeSessionRequest{sessionId,cwd,mcpServers?}·PromptRequest{sessionId,prompt:[ContentBlock]}·SessionNotification{sessionId,update{sessionUpdate 判别}}。prompt response 自带 settlement（stopReason）无需 idle 猜测。

## §三 施工划分与门禁

**段 1（连夜段·零模型调用·FSD）**：
1. acp-client.ts 帧层+spawn 管理——单测用**假子进程流注入**（不 spawn 真 dsh）
2. useAcpSession.ts 映射 hook——单测假 update 流全类型覆盖
3. CLI 接线+app.tsx flag 分支
4. **门禁**：`npm run check`（tsc --noEmit）绿+单测绿+假事件流端到端一案（new→chunk 流→tool_call→settle 全链断言 blocks 序）

**段 2（候窗·真实调用·锁空闲段）**：真 dsh 联调（spawn 真进程·DeepSeek 调用面）+渲染走查——**非作者手测+UI 交付渲染验证门照守**（jsdom 首启链冒烟+新端点真链路案）；部署面（Windows dsh 装机形态/凭据装载）候 SDE 排窗，不 block 段 1。

**回滚姿态**：`--acp` 为纯新增分支，缺省链路不动——回滚=不传 flag，零卸载成本；段 1 全部代码可 revert 单独不伤现役。

## §四 边界与纪律

- 现役 13 席库零触碰（TUI 默认操作用户 cwd·slug 天然隔离；D-46：acp-client debug 日志只记 method+sessionId+update 类型，零内容面零凭据面）。
- 零模型调用段（段 1）不落 DeepSeek 高峰约束；段 2 真实调用锁空闲段（工作日 12-14/18 后+周末·落高峰过 CFO 质疑报警面）。
- 观察项随线留痕（BOD 转录在卷）：存量段续聊上游修 findLog（issue 候）·反向可见性（web 看 TUI 段）未验。
- **存量段通道勘补（2026-10-20 19:2x 遥审·A2 窗2 卷对表）**：除 (a) 上游修 findLog 与 (b) transcript 只读渲染外，**(c) 程序化直投通道=LG-087 #7 gateway 客户端已交付**（TriRMC `scripts/dsh-gateway-client.mjs`·ac5f01a·web session controller 按 sessionId 直投不经 findLog→对 `session-` 前缀存量段可投·隔离 8799 端到端绿·现役活体候单席探针·卷=rduty-a2-window2-closeout-20261020）。(c) 系程序化面非 TUI 交互面——TUI 场景仍 (a)/(b)，公司级「向 web 席投递」能力面由 (c) 覆盖；#3（mailbox 桥）并入 D' 段 1 销账不另起（触发需求复活时在 (c) 上包触发层）。

## §五 使用依据

- BOD 2026-10-20 18:19:47 接续准令（照修正形态开工=准）·CEO 11:28 窗位令
- P0' 毕报卷（§一 半绿定谳·§三 源码级拒因）·D' 评估卷（§四 独立进程形裁定·§五 时段编排）
- TriRLC 实勘：src/tui/ 结构（fork ink·hooks 8 件·components 9 件）·useChat.ts 接口形（REGR-005 ContentBlock）·app.tsx @ts-nocheck 现状·tech-design.md T1 基线
- dsh 协议实锚：@agentclientprotocol/sdk 五帧形+dsh-acp/lib/index.js（resumeSession L1208-1216）

—— CTO 小狄（落款 date 现查原值 2026-10-20 18:21:09 +0800·发毕对表）
