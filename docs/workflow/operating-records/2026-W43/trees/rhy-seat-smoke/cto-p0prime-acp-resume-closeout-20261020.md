# CTO P0' 探针毕报 · ACP resume 定谳=机制绿+存量红（目录名代际差）· 2026-10-20

- sourceOfTruth: 本卷（trees/rhy-seat-smoke/cto-p0prime-acp-resume-closeout-20261020.md）
- syncMode: static（探针毕报·只评估零施工·BOD 2026-10-20 10:22 照稿准·11:32 窗位令 P0' 18:05 先行）
- lastSyncedAt: 2026-10-20T10:16:38Z（+8=18:16:38 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: CEO 11:28「D' 今晚18点以后，同上顺序开工」→BOD 11:32 转令（P0' 先行→毕报即送→主线随定谳接续）

## §一 定谳结论

**P0'=半绿，拆两半如实报**：

1. **ACP resume 机制面=绿**（隔离库 ACP-created 段全链实证）——`session/list`→`session/resume`→`session/prompt` settle→`session/close` 四断言全兑现，transcript 同文件增长（9154B→16680B）兑现「log restored without replaying old updates」契约。
2. **对 web 存量段=红**（真实库 64a715c5 拒挂·零写入兑现）——拒因**非** origin/parentSession/lock，源码级定谳根式=**存储目录名代际差**：web 建段目录名带 `session-` 前缀（`session-64a715c5-…`），ACP `session/resume` 的 `findLog` 按 `encodeSegment(裸id)` 目录寻址——**前缀目录物理不可寻址**（找到的路径≠裸 id 路径）→ stat=void → 判「session is not resumable」。

**对 D' 主线含义（BOD/CEO 裁决面）**：TUI 接 ACP 形下，**TUI 自建段的同段续聊=达成**（打开就聊+续挂自建段均绿）；**web 存量段续聊=不达成**（红·与 P0 SDK 形红不同拒因但同结论）；web 侧能否看到/打开 TUI 自建段=反向兼容，机制面（list 全扫按 header.id）预判可见，未验留观察项。

## §二 探针读数（三跑全录·脚本 /tmp/p0/probe-acp.mjs·帧形按 @agentclientprotocol/sdk 实锚）

| 跑 | 面 | 读数 | 判 |
| --- | --- | --- | --- |
| 段 A' 进程 1 | 隔离 HOME（/tmp/p0-home）·`session/new` 建 3bd54246 | init 含 agentCapabilities.sessionCapabilities={close,list,resume}✓·session/new→3bd54246-81c6-4916-964e-fd8ca6041120✓·prompt settle=`{stopReason:"end_turn"}` 3467ms✓·close✓·update 流=agent_message_chunk+usage_update | **绿**（ACP 新建+settlement+update 全通） |
| 段 A' 进程 2 | 同 id **独立进程二挂** | session/list count=1 contains-target=true✓·resume ok（返 session configOptions·restore 不拒）✓·prompt settle=`end_turn` 3317ms✓·close✓·update 流=agent_thought_chunk+agent_message_chunk+usage_update·**transcript 同文件 9154B→16680B** | **绿**（resume 四断言全兑现） |
| 段 B' | 真实库（HOME=/home/fleet·P0_CWD=r-duty-cos 工作区）·挂 web 建段 64a715c5 | session/list **count=2 contains-target=true**（在册）·resume→`-32602 "Invalid params: session is not resumable: 64a715c5-…"`·**after 对表零写入**（lock 0B+transcript 35360B mtime 尺寸全未动·prompt-FAIL 快退分支生效） | **红**（存量段拒·零写入兑现） |

## §三 拒因源码级定谳（dsh 0.2.0-rc.2 河源只读勘）

- **L1216 表层判据**（dsh-acp/lib/index.js）：`persisted===void 0 || origin==="subagent" || parentSession!==void 0` → not resumable。两段 header keys 完全一致（`createdAt,cwd,delegationDepth,id,isSeeded,type,version`）且**无 origin/parentSession 字段**，list 过滤同型条件还**放行**了 64a715c5——表层三判据矛盾，真因在 persisted 取值。
- **stat 链**（dsh-session-persistence-jsonl/lib/index.js L2536）：`findLog(id)` 返 void 即 stat 返 void。
- **findLog 寻址式**（L3360）：`join(project, encodeSegment(id))` 按**目录名**定位；`encodeSegment`（L853）对 uuid 字符集原样透传=**裸 id**。
- **目录名代际差实锚**：web 库 `ls`=`session-339b7b71-…`+`session-64a715c5-…`（**带前缀**）；隔离库 `ls`=`3bd54246-…`（**裸 id**·ACP 新建惯例）。裸 id 目录在前缀库中不存在 → findLog 空 → stat=void → 拒。
- **list/resume 分野**：`listArtifacts`（L3031）全扫所有 project 目录读 generation 文件 header，按 **header.id** 记身份——前缀目录照样在册（contains-target=true）；findLog 按**目录名**寻址——前缀段不可达。两路枚举不同源，list 在册+resume 拒挂的矛盾解消。
- **排除项**：非 session.lock（隔离段无 lock 也绿·真实段 lock 存在但拒因是寻址）；非 cwd 不匹配（validateWorkspaceParams 在先·header.cwd 与 slug 自洽）。

## §四 对 D' 主线含义（形修正建议·候 BOD/CEO 裁）

| 目标 | ACP 形下达成度 | 依据 |
| --- | --- | --- |
| 「打开就聊」（TUI 续挂上次段） | **达成**——限 TUI 自建段 | 段 A' 进程 2 实证 |
| 「同段续聊」（终端与 web 同段） | **半达成**——TUI 自建段在 TUI 侧可续；**web 存量段挂不上** | 段 B' 红判 |
| web 历史回看 | 不受损（web 端原样可用·两段历史分叉） | 库同构（P0 §三.1） |
| 反向：web 看得到 TUI 段？ | 机制面预判可见（list 全扫 header.id）·**未验留观察项** | §三 list/resume 分野 |

**本席建议**：D' 按「独立进程形+ACP 协议面」推进不变（评估卷 §四 结论不翻），形态定位修正为——**TUI 自建段同段续聊（绿）+web 存量段历史回看交 web 端（红侧降级）**。存量段续聊候选后手：(a) dsh 上游修 findLog 兼容前缀目录（报 issue 候上游·不可控）；(b) 历史显示案（transcript 只读渲染）覆盖回看需求。主线施工段划分照评估卷 §五（代码/hook 段零调用可连夜施·真实调用联调排空闲段）。

## §五 边界合规声明（实锚）

- **现役栈零触碰**：段 B' after 对表=lock+transcript mtime 尺寸逐字节同（§二）——全程对现役 13 席库**零写入**；web 8791/daemon cron 零触碰。
- **D-46**：凭据 cp 不 cat（隔离 HOME 装载）；本卷零值面；probe 脚本零凭据；update 流只记 sessionUpdate 类型；**CRED-REMOVED 已兑现**（/tmp/p0-home 全树删+find credentials 零命中+目录不存在）·stderr 日志已清。
- 隔离面残留：/tmp/p0（脚本 2 件+快照 3 件·零敏感）留置候 BOD 裁后自清；/tmp/p0dbg-*（10-17 旧物）未动。
- 施工面：全程零施工零入仓（脚本在 /tmp 非仓内）——本卷为唯一交付物。
- 时刻：探针执行段=2026-10-20 18:05-18:16 北京（空闲段合规·避 9-12/14-18 高峰·真实调用 3 次全落 18:00 后）。

## §六 使用依据

- BOD 2026-10-20 10:22:13 照稿准令+11:32 窗位令（CEO 11:28 原话）·评估卷 cto-dprime-plugin-vs-standalone-assessment-20261020.md（§三 P0' 定义）
- 协议实锚：dsh-acp/lib/index.js（L1208-1216 resumeSession·L1265-1267 list 过滤）·dsh-session-persistence-jsonl/lib/index.js（L2536 stat·L3031 listArtifacts·L3360 findLog·L853 encodeSegment·L3418 listProjectDirs）
- 活体读数：三跑原样输出（§二表）·两库目录名 ls 实锚（§三）·before/after 快照（/tmp/p0/）
- 前卷承接：cto-p0-probe-closeout-20261020.md（§三 库同构实证·§三.5 headless/sdk 分野）

—— CTO 小狄（落款 date 现查原值 2026-10-20 18:16:38 +0800·发毕对表）
