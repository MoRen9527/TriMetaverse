# CTO 建议书 · 每会话子进程形态+进程模型配合+双清单+soul-loader 复核（CEO 六问四项）· 2026-10-18

- sourceOfTruth: 本卷（trees/lg085-bod-cli-acp-review/cto-session-process-model-assessment-20261018.md）
- syncMode: static（CEO 09:56 六问四项技术评估·候 10-18 12:00 评审并表）
- lastSyncedAt: 2026-10-18T02:00:18Z（+8=10:00:18 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: BOD 派工 09:58·概念卷 ec24b49c8 系·本席 10-17 两卷（b0a84b26d/5c476799d）

## 结论先行

1. **①每会话子进程形态：方向采认**（CEO「单点故障属缺陷」裁成立——可用性架构缺陷定性·非数据安全缺陷：session-store 持久层在·daemon 死不丢历史·伤害窗=重启中断+热态重算 token）。施工分两段：**段1=job/短会话子进程化**（现 process-supervisor 扩展即达·低风险先行）·**段2=交互长会话子进程化**（IPC 面广·随 P3 双案窗后）——骨架周-双周级·含回归月级。
2. **②进程模型：统一模型·策略分池**——同一 worker 进程模型两种生命周期策略（job=短命池跑完即退·人格席=长驻池 attach+idle 休眠+激活重生）；分席双池无必要（资源画像现无冲突）·触发重评判据两条在卷。
3. **③交叉分布新勘**（实勘增量）：人格装载（soul-loader）=**MC 有 LC 无**·会话托管（session-store）=**LC 有 MC 无**——两层件交叉缺位=「暂不抽层」判据基的最强材料；LC 对 session-store 文件级四同名（index/safety-check/store/types）=真共性候选最厚处。
4. **④soul-loader 复核定谳**：四仓干净 HEAD（dirty=0）grep——MMC/RMC 各 soul-loader 目录+src/pipeline/assemble.ts 单点消费引用·MLC/RLC 零命中（目录也无）——**「MC 有 LC 无」定谳成立**·与 BOD 本地副本勘验一致。

## ① 每会话子进程形态评估（核心）

**技术本质**：现形=会话是 daemon 事件循环内的 async 对象（loop.ts 跑在 daemon 进程）；目标形=daemon 降格监督者（supervisor）·每会话独立子进程（node child_process 独立进程·**非 worker_threads**——后者共享堆不算故障隔离）。

| 评估面 | 读数 |
| --- | --- |
| 崩溃隔离收益 | 真——故障域从 daemon 级收窄到会话级；现形一个会话 run 撞坏 daemon 全席陪葬；M 面 claude 形=N 进程天然隔离·agent-core 现形系隔离性倒退·CEO 裁缺陷有理 |
| 会话热态分布 | 热态（prompt cache/运行时态）随子进程内存·持久态 session-store 共享——子进程死只丢该会话热态（故障收窄直接兑现） |
| 生命周期管理 | 按需 spawn（会话激活）+idle 休眠（进程退出·状态落库·唤醒重生）——**单会话休眠是子进程形独有优势**（daemon 内对象形做不了） |
| daemon 重启不杀子进程 | detached spawn+IPC 断连存活+新 daemon 重连 attach（pidfile/注册表发现）——技术成熟形（Erlang supervisor 树/进程池监管同构） |
| 与现 watchdog 差异 | watchdog=进程级保活（daemon 死拉起 daemon）·supervisor=会话级监管（子进程死重启子进程·指数退避+crash loop 熔断）——**两层守护并存不互替** |
| 工程量级 | agent-core 已有 process-supervisor（spawn/wait/cancel/scopeKey——概念卷 §六实锚）·扩展为长驻会话监管（attach/reconnect/crash 策略/休眠唤醒）；IPC 面（prompt 投递/流式回传/工具结果跨进程）是新面——**骨架周-双周级·含回归月级** |
| 风险 | IPC 化把现役 daemon 内直调改走进程边界（tools/shell-exec/letter-store 交互）——面广·分段施工降险 |

**施工两段**：段1=job/短会话子进程化（cron/heartbeat job 现经 runHeartbeatAgent 起会话——改走短命 worker·supervisor 语义直接复用·低风险）；段2=交互长会话子进程化（IPC 全面·随 P3 双案窗实测后）。每段门禁照 B 系形（静态+机制锚+席义锚+稳态）。

**一处校准（诚实评估义务）**：「缺陷」定性限可用性架构面；现形已有 watchdog+持久化+快恢复兜底·实际伤害窗=重启分钟级+热态重算成本·无数据丢失面。修复优先级=中高（段1 低成本可先行·不阻 12:00 评审其他候裁案）。

## ② job 与人格席进程模型：统一模型·策略分池

**形态建议**：统一 worker 进程模型·生命周期差异用 supervisor 策略参数化——job worker=短命池（跑完即退·scopeKey 互斥顶替=现 supervisor replaceExistingScope 语义直接复用）·人格席 worker=长驻池（attach 常驻+idle 休眠+激活重生）。

**理由**：①进程模型统一=一套 IPC/一套监管/一套工具注入——两套模型=维护双份；②生命周期差异是策略层（spawn 参数/退出条件/资源限额）非架构层；③演化兼容——job 升级持久会话（9.2 判据右侧）时改策略不改架构。

**分席重评触发判据**（现不触发）：①job 高频实测挤占人格席进程资源（CPU/内存争抢读数）；②安全域分化（job 需沙箱而人格席需宽权限或反之）。

## ③ TriRLC 共性/分野双清单（实勘版·四仓干净 HEAD）

**会话模型对照（新勘）**：

| 面 | 会话托管层 | 人格装载 | 判读 |
| --- | --- | --- | --- |
| TriMMC/TriRMC（MC 对） | **无 session-store**（双双） | soul-loader 目录+pipeline/assemble.ts 单点消费 | 机制面消费形：agent-loop 直驱+状态外置（job 执行·无会话持久需求） |
| TriMLC/TriRLC（LC 对） | session-store 双面在·**文件级四同名**（index/safety-check/store/types） | 零命中 | 完整 harness 消费形：会话持久+恢复链在 |

**交叉分布定谳**：人格装载 MC 有 LC 无·会话托管 LC 有 MC 无——两层件交叉缺位。这是「暂不抽层·待共同之处增多」判据基的最强材料：抽层的方向不是把对方缺的件硬搬过去补齐（MC 面机制消费可能永不需要 TUI 级会话）·而是 harness 化消费面变厚后看哪些件真被两面同形消费。

**行为级分野清单（在册汇总）**：F-3 cron addJob 分野（TriMMC/MLC/TriRLC 在册）·电源面分叉（power-keepalive↔power-follower 改名·power-monitor MLC 单侧）·notify/letter-store 场景件·会话层有/无（本卷新勘）·soul-loader 有/无（本卷定谳）。

**真共性清单（实勘门产物形态·三列）**：①结构同名面（已勘·MC 17 目录/LC 29 目录+session-store 四文件）；②行为级分野面（上列·抽层排除项）；③内容级同形面（**候勘**——同文件名≠同内容·双仓 diff 级实勘门产物·抽层施工前置硬门照 5c476799d 立场不变）。

## ④ soul-loader 双 LC 复核（定谳）

四仓 git HEAD 全干净（TriMMC 65aeae5/TriRMC a02d89b/TriMLC 2a8daa8/TriRLC d9a6254·dirty=0）工作区零脏——grep 复核可信：**MLC/RLC src 全树零命中（soul-loader 目录也不存在）·MMC/RMC 各 soul-loader 目录+src/pipeline/assemble.ts 单点消费引用**——「MC 有 LC 无」定谳成立·与 BOD 本地副本勘验逐点一致。概念卷 9.1「R 面彩蛋」勘正（e70ee7d2d）精确形态照录：双 MC 各 1 处 assemble.ts 消费。

## 步 5 语义改写随卷（CEO 问 5 裁·照录）

「四域全切只需可行·未必真切·harness 多样性=R+M 联合优势」——路标步 5 从「四域切换裁剪」改写为「**切换可行性就绪+按域按场景择优采选（多样性保留）**」：步 5 门禁不变（四锚门）·出口从「全切完成」改为「切换能力就绪认证+各域采选决策留痕」——与三引擎矩阵「分场景各优」判读自洽。

## 使用依据

- BOD 派工 09:58（四项+背景）·概念卷 ec24b49c8（§六 supervisor/§9/§10 实锚）·本席 10-17 两卷 b0a84b26d/5c476799d
- 实勘：四仓 src grep+ls+git HEAD（10:00 前·干净 HEAD·读数原样录入 §③④）
- 在册：F-3 cron 分野·daemon 机位矩阵·TriMMC/MLC/TriRLC addJob 分野记忆条

—— CTO 小狄（落款 date 现查原值 2026-10-18 10:00:18 +0800·发毕对表）
