# CTO P0 探针毕报 · D 案 SDK resume 语义定谳=红·降级预案启动 · 2026-10-20

- sourceOfTruth: 本卷（trees/rhy-seat-smoke/cto-p0-probe-closeout-20261020.md）
- syncMode: static（探针毕报·只评估零施工·BOD 2026-10-19 23:47 派令·护栏照单）
- lastSyncedAt: 2026-10-20T01:48:05Z（+8=09:48:05 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: BOD 2026-10-19 23:47:27「P0 探针照做（已派）·毕报随递定谳绿/红」·探针跨午夜执行（段 A 进程 1 于 19 日深夜·段 B 与收尾于 20 日晨·如实注）

## §一 定谳结论

**P0=红**：dsh `--profile sdk` 协议面 **resume 语义不成立**——对任何已知存在 id（SDK-created 与 web-created 同判）`session/prompt` 一律 `-32603 "session already exists"` 拒挂；协议全谱仅 3 请求（initialize/session/prompt/shutdown）**无 open/resume 方法**。SDK 形唯一能力=unknown 新 id lazily create 新会话（进程 1 实证绿）。

**对 D 主线含义**：TUI 接 SDK 形只能「每席新会话」——评估卷 v2 令核心目标「web 历史与终端续聊同段」**不达成**。触发评估卷 §四.1 预案，降级线评估见 §四。

## §二 探针读数（三跑全录·脚本 /tmp/p0/probe-a.mjs·协议字段全按 types.d.ts 实锚）

| 跑 | 面 | 读数 | 判 |
| --- | --- | --- | --- |
| 段 A 进程 1 | 隔离 HOME（/tmp/p0-home）·新 id `probe-a-1` | init→`{"serverInfo":{"name":"deepseek-harness-sdk-runtime","version":"0.0.1"}}`✓·prompt ack=`{"messageId":"7f686c53…"}`（durable receipt）✓·assistant/message 收流✓·user/message echo✓·status running→idle 全回合 3684ms✓ | **绿**（SDK 新建+事件流机制全通） |
| 段 A 进程 2 | 隔离 HOME·**同 id 独立进程二次挂载** | `-32603 session "probe-a-1" already exists`——非 resume 非 lazy-create，**拒绝** | **红**（known-existing id 拒挂定谳） |
| 段 B | 真实库（HOME=/home/fleet·cwd=r-duty-cos 工作区）·挂 web 建段 `session-64a715c5-052a-4042-8d4f-277034d4cb8d`（非现役段·BOD §七 headless 实证同段） | `-32603 "session … already exists"` 拒；**after 对表零写入**（transcript 35360B 未动·目录面无新增） | **红**（web-created 段同判拒·零写入兑现） |

## §三 机制面增量发现（对后续任一线均有价值）

1. **SDK 会话落库与 web 完全同构**：`<HOME>/.dsh/sessions/<cwd-slug>/<sessionId>/session.v4.jsonl.zstd` + projcache 条目（`storages/session_projcache/sessions/<id>.json`）——段 A 隔离库四件齐全活体验证 README 主张；同库兼容性对 A 线（官方 tui 发布后平滑切换）与 web 消费均无忧。
2. **sessionId=自由命名空间**：SDK-created 会话目录名=调用方给的 id 本身（`probe-a-1` 非 `session-<uuid>` 形）——TUI 侧自定义 id 可行。
3. **事件谱比评估卷五类富**：实测另有 permission/preset·sandbox/mode·approval/policy·turn/start·step/start·request/header·request/context·session/title·session-log-deepseek/delivery-accepted 等机制事件——D' 或 TUI 类形态的 StatusLine/交互映射素材更足。
4. **provider/model 现役默认实锚**：sdk profile dump=`deepseek-official`/`deepseek-flash`（credentials-local 读 $HOME/.dsh/.credentials.yaml）。旁证：/tmp/p0dbg-out.log（10-17 旧物非本探针）存一次更早的 SDK 尝试失败应答 `no adapter registered for provider "deepseek"`——provider 须带 `-official` 后缀，本探针经 dump 实锚避开。
5. **headless 与 sdk 分野定性**：同一 known-existing id——headless `--session-id` 续挂成立（BOD §七实证·CLI 层直挂路径），sdk 协议面拒挂（JSON-RPC runtime 拒「库已知会话」入内）——**两 profile 对 resume 的能力差是设计分野非版本缺陷**。

## §四 降级线评估（评估卷 §四.1 预案启动·呈 BOD 连同本卷转 CEO 候裁）

| 线 | 形 | 「同段续聊」 | 「打开就聊」 | 判 |
| --- | --- | --- | --- | --- |
| A 线（官方 tui） | 发布后 `--resume`（README L28 明文归终端应用） | ✓（预期） | ✓ | **升正解候选**——唯一天然达成双目标的形；代价=时间不可控 |
| C 形（headless） | `--session-id` 一次性问答 | ✓（BOD 实证） | ✗（非交互 TUI） | **过渡可用**——今晚即可用（CEO 23:32 已知形态） |
| D' 变体（TUI+新会话） | TUI 接 SDK·每席新会话 | ✗（历史分叉） | ✓ | 半达成候选——「打开就聊」达成·同段目标放弃；沉没成本已付（机制面读数 §三 全可复用） |
| D'' 变体（TUI 绕 SDK 自写持久化） | 直读/直写 v4 信封 | 理论可 | ✓ | **不荐**——重写 dsh 持久化栈+与官方演进冲突·人日翻倍起 |

**本席建议**：A 线升正解候选+C 形作过渡（现成可用）；D' 是否立项取决于 CEO 对「同段」目标的权重裁决——若「打开就聊」优先，D' 以 4-5 人日可交付（省去 resume 适配 1 人日·余同评估卷 §三）；若「同段」为硬目标，则 D' 无意义·候 A。**原主线（SDK 接线续挂形）撤案**。

## §五 边界合规声明（实锚）

- **现役栈零触碰**：段 B after 对表=transcript 35360B 未动+目录面无新增（§二 段 B 行）——**全程对现役 13 席库零写入**（比回执申报的「单条 append」写面更小：SDK 拒挂在写入发生前）·现役段零触碰·web 8791/daemon cron 零触碰。
- **D-46**：凭据 cp 不 cat（隔离 HOME 装载）·毕报零值面·探针脚本零凭据·事件日志只记 sessionId:type 不记内容；隔离 HOME 用毕全树删除（`/tmp/p0-home` 已 rm·CRED-REMOVED 断言）·stderr 零落。
- 隔离面残留：/tmp/p0（脚本+快照·零敏感）留置候 BOD 裁后复跑或自清；/tmp/p0dbg-*（10-17 旧物非本窗产物）未动。
- 施工面：全程零施工零入仓（脚本在 /tmp 非仓内）——本卷为唯一交付物。

## §六 使用依据

- BOD 派令 2026-10-19 23:47:27（P0 照做·毕报随递定谳）+评估卷 cto-d-tui-feasibility-assessment-20261019.md（§三 P0 定义/§四.1 预案）
- 协议实锚：dsh-sdk-protocol lib/types/types.d.ts 全文（3 请求 4 通知·L22-124）·dsh-llm TextBlock（L46-50）·sdk profile dump（provider/model/credentials 三段）
- 活体读数：探针三跑原样输出（§二表）·before/after 快照（/tmp/p0/probeB-before.txt+段 B after ls）·段 A 隔离库 find 全录
- BOD §七 headless 实证（54ce39685）为分野定性对照面

—— CTO 小狄（落款 date 现查原值 2026-10-20 09:48:05 +0800·发毕对表）
