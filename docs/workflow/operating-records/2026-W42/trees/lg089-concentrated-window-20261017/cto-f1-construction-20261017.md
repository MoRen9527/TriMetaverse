# CTO 施工毕报卷 · F 件 b1 v2 唤醒补报+§六 recentWake（门禁读数全绿·生效候窗）· 2026-10-17

- sourceOfTruth: 本卷（trees/lg089-concentrated-window-20261017/cto-f1-construction-20261017.md）
- syncMode: static（毕报卷·链序 施工席→COO→COS→BOD·生效窗候 COO 段B 终排）
- lastSyncedAt: 2026-10-17T11:16:38+08:00（date 现查写前跑·D-47）
- 令源: CEO 11:00:25 两裁①（设计卷 353cc4ac3·COS 抽验绿）·§六增量批=COO 11:06 会签+COS 批文（D-39 全域授权面·事后呈报 CEO 随卷）
- 实现锚: **TriMLC 仓 commit 2a8daa8**（dev·4 files·+400/−20）·回滚锚=revert 2a8daa8

## §一 交付面（设计卷 §三 全兑现+实测增强两项）

| 面 | 落点/读数 |
| --- | --- |
| b1 v2 查询线 | wevtutil 拉取式（args 数组零 shell——Git Bash MSYS 路径改写坑不适用 node 侧·实测 RC=0·38ms）·506/507 混流 /c:10 /rd:true /f:xml |
| 时长判定 | **主判=507 EventData DurationInUs（OS 官方口径）**——实测 705.9s 段与配对 506 时刻互证吻合（设计卷原案纯配对法的增强·少一个失败模式）；fallback=配对差；双缺=null 不猜 |
| 状态机 | 首拍基线吸收（防 restart 重放历史段误报——生效窗自身要 restart）/同段重读幂等/浅睡 <5min 吸收不报/时长不可判吸收不报/达标报告 |
| v1 删除 | tick 冻结差值段（c8aebf3 L317-333）+POWER_WAKE_GAP_MS 常量全删——替代非并存 |
| 观测面 | snapshot/healthz 扩四字段：lastWakeSeenAt/lastHandledWakeAt/wakePollFailures/lastWakeReport——观测面自身可观测 |
| §六增量 | 心跳 payload **recentWake** 字段（{sleepAt,wakeAt,durationMinutes}·extraHeartbeat 注入缝·晚绑定·无报告段时零追加）——b2 料包 v2 数据源立 |
| 设计卷待实证点闭合 | 编码面：实测 UTF-8 单行 XML 无编码坑（设计卷 §二唯一待实证点·零改动需求） |

## §二 门禁读数（四绿+全量归因对照）

| 门禁 | 读数 |
| --- | --- |
| wake-events 新增单测 | **12/12 绿**（A 族解析 5+状态机 7·测试插曲一条：夹具时序自错初跑 11/12——SHALLOW 时刻早于 BIG 走旧段跳过分支非浅睡吸收分支，夹具改时序递进修正·如实记） |
| power-gate 现役回归 | **24/24 绿**（旧用例补 queryWakeEventsXml 缝注入 `NO_WAKE`——零断言语义变更仅依赖注入；未注入时 tick 首拍真 spawn wevtutil 致 4 用例时序后移假败·已修正） |
| npm run check / build | RC=0 / RC=0 |
| 全量 npm test | **694/699·5 败全既有**——stash 对照（改动前基线 682/699·6 败）逐条同名单：replay-flow.test.ts/P0 通道端到端/FADE-ASSESS-005 ×2/tui components.test.ts——第 6 项=wake-events 在基线态跑旧 src 的 stash 方法伪影（untracked 文件不随 stash）。**零新增失败**·既有 5 败跨 4 域与本件无交集·深勘不扩本件（候办挂账） |

## §三 半闭环如实声明（§六消费链）

- **本件只立数据源**：TriMLC 心跳 payload 带 recentWake 发出——TriMC 收单宽松解析不拒（TriMMC app.ts L601-637 勘实·零 schema 拒）✓
- **TriMC 存储面现役不落**：recordNodeHeartbeat 仅存 nodeId+state——recentWake 暂停留于收单侧内存丢弃
- **字段生效链=两步 sg 侧施工**（E1-4 料包 v2 承载·候勘钉批）：①TriMMC recordNodeHeartbeat 增存 recentWake+挂点透出 ②b2 判据 v2 读字段静默+清警——已列料包 v2 候勘项
- 不装全通：现役态字段为「发出但不落」半闭环，b2 判据 v2 上线前无消费面

## §四 生效窗与活体验收（候 COO 排程）

- 生效=一次 8713 restart（白名单①类·10-11 六步实操序）摊销两件（b1 v2+§六字段）——候段B 终排件（COO 11:06 口径：门禁毕✓+sg 勘钉回传候→终排出·窗位候 CEO 确认）
- 生效窗内完工锚预置：①build 产物对表 ②channel.log「power gate monitor started」+新 wake 观测行 ③healthz power.lastWake* 字段值面 ④（自然窗）recentWake 心跳字段首现
- **活体验收窗=生效后首个自然睡眠段捕获**（今晨实测自然睡眠高频：A1 卷三段+10:37:45-10:49:31 第四段）——单测绿≠活体验收，验收窗前不称 production-ready
- E1-5 同窗串行（COO ③提案）技术面意见：**认可**——附三前提：①顺序先 8713 后 8712→8711（8713 六步有当日实操先例+熟回滚锚·先行探路）②每 daemon 独立六步+独立完工锚不并账③窗长预算 20min（8713 段2 实测 6min+8711 同构 6min+互证读数余量）

## §五 使用依据

- CEO 11:00:25 两裁①·设计卷 353cc4ac3（COS 抽验绿 11:05）·§六批=COO 11:06 会签+COS 批文 11:07
- TriMLC 2a8daa8（src/power-monitor.ts/src/server/app.ts/test/power-gate.test.ts/test/wake-events.test.ts）
- wevtutil 实测（11:04·RC=0·38ms·DurationInUs 互证）·TriMMC 收单面勘（app.ts L601-637）
- 门禁读数全量（§二·11:08-11:15 现查）

—— CTO 小狄（落款 date 现查原值 2026-10-17 11:16:38 +0800·发毕对表）
