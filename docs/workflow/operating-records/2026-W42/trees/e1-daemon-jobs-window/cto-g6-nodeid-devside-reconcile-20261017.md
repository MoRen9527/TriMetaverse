# G6 路5③ dev 侧对表小勘卷·nodeId 键错位候选收口（CTO·只读零改动）

- sourceOfTruth: 本卷（trees/e1-daemon-jobs-window/cto-g6-nodeid-devside-reconcile-20261017.md）
- syncMode: static（小勘毕报卷·照链回 COS/COO·收记即销 watchlist g6-nodeid-local-reconcile）
- lastSyncedAt: 2026-10-17T14:16:16+08:00（date 现查写前跑·D-47）
- 令源: COS 14:07 工单派转（BOD 13:57 G6 转 dev 面对表项路 5③）·树指针=g6-handler-round2-readout-20261017.md（5a4a92adc·sg 五路卷）+e1b2 spec 7bc56408b
- 范围铁则: 本地配置/源码只读小勘·不施工不改动·零服务触碰 ✓

## §一 dev 侧上报 nodeId 值面（sg 卷路 5③ 留白半边·钉死）

| 项 | 读数 | 依据 |
| --- | --- | --- |
| 生成位 | `TriMLC src/config/env.ts:154`：`process.env.TRILC_NODE_ID ?? \`${hostname()}-${process.pid}\`` ——**默认形态=hostname-pid，含 pid** | 源码直读 |
| TRILC_NODE_ID 覆盖键 | 8713 启动链 `trimlc-daemon-channel.cmd` 键名清单实勘**无 TRILC_NODE_ID** → 走默认形态 | cmd 只读 grep（键名清点·值面零回显） |
| 现役值 | `TABLET-0BGCRCP5-10832`（R1 restart 后 pid 10832）·restart 前=`TABLET-0BGCRCP5-30340` | channel.log 启动行「daemon started for TABLET-0BGCRCP5-10832」+R1 卷双段 pid 实证 |
| 发送链同源性 | heartbeat（ConnectionManager `nodeId: env.nodeId`·app.ts:1473）与 mirror pusher（构造注入同源·pusher.ts:71 `nodeId: this.nodeId`）**两链同一 env.nodeId 值** | 源码直读 |
| 发送侧 nodeId 恒在性 | 两链 payload **构造性必含 nodeId**（env.nodeId 启动生成非空：hostname()+pid 皆非空）→ sg 卷路 1 发现①「nodeId 缺席静默 200」分支**对现役 TriMLC 发送端不可达**（防御面留 sg 侧即可） | 源码直读 |

- **键身份语义勘正（对 sg 卷增补二「平板节点」定性候选）**：`TABLET-0BGCRCP5-<pid>` 键族=**本机 dev 宿主自身**（hostname=TABLET-0BGCRCP5）上 TriRLC 族 daemon 的 nodeId 键（8713/8711 各以自己 pid 入键）——非第三方平板设备。`-30xxx` 行区与 R1 卷基线 pid 30340 值面吻合=**8713 旧 key 翻转行高概率**（8711 R2 键轮换 40364→26472 同机理 12:54-12:55 窗）；精确行级配对归 sg 日志终判（本席不越机断言·D-24）。

## §二 键错位候选定性：现役形态不成立·风险面真实

- **sg 卷路 5③ 机理为条件式**（「watch 侧**若**按现役名过滤而上报端仍发旧名键→观测面恒空」）。
- **现役 watch 脚本实测**（本地副本 scripts/ops-local/e1-b2-heartbeat-watch.mjs·spec 7bc56408b 精施工形 stateful v2）：挂点 A=`/tmp/trimc-run.log` 字节流增量读+`MIR="[trimc:mirror] node "` **前缀行包含匹配**——**零 nodeId 过滤面**（对任意 nodeId 的翻转行一律计活动）。
- **判定：键错位候选在现役 watch 实现上不成立**（条件式前提「按 nodeId 过滤」不存在）——sg 侧「稳态不可见」机理（翻转行 only）才是真观测面约束，nodeId 值面不是。
- **风险面如实留档**：nodeId 含 pid → **每次 daemon restart 键必轮换**（30340→10832 已实证）。TriMMC 侧 nodeHeartbeats/tasks 双 Map 均以 nodeId 为键成分、零校验零归一（sg 卷路 5③ 已勘）、旧 key 无清理面（unknown 后 scanStale 跳过 store.ts:85；tasks 旧 key 行残留）——任何**未来**按 nodeId 等值过滤/配对的消费面（含人工对表、GET mirror?nodeId= 查询）踩旧键必空转。现役消费受害位=零（无读出端点+watch 无过滤），建设挂点 A（E1-4 v2）时**须同步定键策略**（等值匹配不可用·候选=hostname 前缀匹配或「最新键=活跃键」取法），否则 v2 落地即踩本轮已勘明的坑。

## §三 机理增量：键轮换=翻转行系统性制造源（对「时通时断」画像的第三分支）

- R1/R2 双 restart 在观测面的效应链：旧 key 停更→scanStaleNodes（默认 staleMs=30s·store.ts:79）判 stale→unknown **打行一次**→新 key 首拍新建+连续 2 拍（recordNodeHeartbeat consecutiveHbs≥2·store.ts:55-58）→**recovered 行**。
- 即：**每次 daemon restart 必产「stale→unknown+recovered」翻转行对**——12:53:17 recovered 行（state lastActivityEpoch 配对已钉 sg 增补二）即此机理产物。sg 卷「时通时断」画像的机理分支由两支（真醒断×翻转行 only 交窗）扩为三支：+**键轮换翻转对**（restart 伴生·非真故障事件）。观察者侧建议：翻转行解读时先对 daemon restart 时线（channel.log 启动行），防把键轮换对误读为节点 flap。

## §四 14:08 拍分诊（今日新增事件·观测面语义错位定性）

- **宿主活性旁证**：本席会话 12:56-14:07 持续施工（P 系四裁+本小勘）=宿主无睡眠段强旁证 → 「宿主睡眠」候选弱化；8713 心跳链大概率未断。
- **时线**：lastActivityEpoch=12:53:17（R1 recovered 行）→+60min=13:53:17 阈达。NOTIFY gap 读数=60min 整（非 75min）→ **13:08 附近存在一次翻转行刷新**（候选源：8711 R2 键轮换对 12:54-12:55 时点不合 / mc_link 抖动翻转 / 旧 key 迟到 stale 行——sg 日志行时戳终判，本地不越机断言）→ 14:08 巡检拍 gap 复超 60min 发告警；14:08:19 recovered=新翻转行到达清态。
- **定性**：14:08 告警大概率=**观测面缺口形态的假警候选**（健康稳态在「翻转行 only」面天然静默·§二/§三机理）——**告警文语义正名**：现观测面对象=「60min 无节点状态翻转行」≠「60min 无心跳」，告警文「心跳超时」系系统性语义错位，分诊提示（疑宿主睡眠/daemon 死/隧道断）未覆盖「稳态静默」这一最高频真因。终判材料=sg 侧 trimc-run.log 13:53-14:08 行区+state 文件值面（归 sg 值席对表）。

## §五 修复方向候选④（E1-4 v2 三选项并列补充·候排窗裁·本席不施工）

sg 卷三选项（①GET heartbeats 端点②in-process job③TriMLC sidecar）之外，源码面勘出**候选④：TriMMC heartbeat handler 收单处加一行日志**（app.ts:626 附近·`[trimc:mirror] node heartbeat: ${nodeId} state=${state}` 形·含时戳）——watch 现役字节流挂点 A **零改动**直接可见健康稳态，观测面语义即归正（新字节含行=心跳到达真值）。

- 优：最小 diff（一行）·零 TriMLC 侧改动·零新端点/新文件面·watch 脚本不动（sg 侧零部署面除 TriMMC restart）
- 代价：日志量 ≈2880 行/日（30s/拍·~100B/行 ≈300KB/日·/tmp 轮转面候 sg 勘）；TriMMC restart 照纪律走
- 对比：①需新端点+watch 改 HTTP 探测·②改 TriMMC job 架构·③TriMLC+sg 双侧改——④在 diff 最小性与语义归正上均优，**本席技术判=候选④列为 v2 首选**，优劣终裁归 E1-4 v2 排窗（COO 派工面）。

## §六 使用依据

- TriMLC 源码：src/config/env.ts:154·src/mirror/pusher.ts（71/63 全读）·src/server/app.ts（1473/1421-1433 recentWake 投影段）·src/local-node/node.ts:70-93
- TriMMC 源码：src/server/app.ts:349-386（mirror 收单）/601-638（heartbeat 收单·零日志实证）/427-432（query 过滤）；src/mirror/store.ts（19-20 键形/41-59 record+recovered/78-96 scanStale/108-169 mirror 静默/175-180 markUnknown）
- watch 脚本本地副本：scripts/ops-local/e1-b2-heartbeat-watch.mjs（sg 活体副本一致性候 sg 对表·D-24）
- sg 卷五路+增补二：g6-handler-round2-readout-20261017.md（5a4a92adc）·e1b2 spec 7bc56408b
- 本席 R1/R2 卷（pid 双段实证）：cto-r1r2-restart-window-record-20261017.md（fed74af3b）
- 派工令：COS 14:07 工单（BOD 13:57 令源）·watchlist g6-nodeid-local-reconcile（60min 闸 14:00 起——本卷 14:16 落=闸内 ✓）

—— CTO 小狄（落款 date 现查原值 2026-10-17 14:16:16 +0800·发毕对表）
