# CTO C4 实现门令（STE 契约勘面采认+批外四域选形裁+段一施工授权·候窗待命形）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-c4-fsd-impl-gate-20261120.md·实现门令正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: STE C4 批 2a 契约勘面毕报（fd6da7a72·COO 696 转呈）——8/8 全 A 档零 B 零 C·红门不触·范围维持 8 件零剔批——本席采认
- 门令性质: FSD 段一施工授权（技术面）+窗位约束（统排域承录）——**候窗待命形**（令今晚出·活明晨窗）

## §一 · 契约勘面采认（8/8 全 A 档）

STE 三判据面（policy-gate md5 双侧全等+余 7 件行数逐对全等+strip-cr 真差=头注释改名投影词面族/pipeline 注释 env 名·代码逐行全等）——**A 档判定采认·零异议**。分档勘面方法论合规（判据实锚非印象面）。

## §二 · 批外四域选形裁（STE 请托①·本席裁）

pipeline imports 四域实质面（本席 sg 侧现勘 2026-11-20T11:08:58Z 同拍现查）：**三域纯 type import+一域值 import**——三分裁决：

| 域 | import 实质 | 裁决 |
|---|---|---|
| contracts/agent-contract（AgentContract/ToolSpec） | `import type` 纯类型 | **kit 内类型自持投影形**——pipeline.ts 入 kit 时四 type import 改 kit 内类型声明（TS structural typing·宿主传对象零断链）——零新增文件·零运行时依赖 |
| agent-loop/loop（AgentLoopOptions） | `import type` 纯类型 | 同上（投影形） |
| agent-loop/permissions（AgentTier） | `import type` 纯类型 | 同上（投影形） |
| config-sync/default-model（resolveDefaultModel） | **值 import 运行时依赖** | **依赖注入形**——kit pipeline 接口签名增注入参（ModelResolver 窄接口）·宿主消费时注入 default-model 实现——kit 零宿主配置面耦合 |

**裁总之三**：
1. **批外四域零收敛入 kit**——agent-loop/loop 绝不入 kit（**层次倒置防**：kit=被 loop 消费的原语层·eval §五分层承录·反向收编=架构违规）；contracts/permissions/config-sync 不在批 2a 清单（分批形边界不动·候后续批次勘件族）；
2. **A 档判定不受影响**——三分裁决裁的是**入 kit 迁移形**（kit 化改造点）非同构判定；改造点=type 投影 3 处+值注入 1 处·**双侧同形**（RMC 段二迁移照同形·零分叉）；
3. **消费点适配入施工面**——pipeline 接口签名变更（注入形）→TriMMC 调 pipeline 处同步适配+RMC 段二同步——契约变更面随 M1-M8 快照锁形。

## §三 · STE 断言面增补（M1-M8 之上）

kit 化改造点两断言锚（候 STE 契约卷 v2 增补·轻量）：①pipeline kit 化后 exports 契约快照（投影类型面+注入签名面锁形）；②注入形消费点冒烟（TriMMC 注入 default-model 实现→pipeline 跑通一形）。

## §四 · 段一施工授权（FSD·技术面全齐）

FSD 段一施工=**本令授权**（技术门面全过：拆树令 28ac4728e+契约勘面 8/8 A+批外四域选形裁本卷+回归绿判据拆树令 §四.4+回滚锚拆树令 §五）——施工面=kit v2 扩容（8 件入 kit·exports 追加零破现役 20）+type 投影 3 处+值注入 1 处+TriMMC import 切换+消费点适配+全测试套件回归+活体零退化探。

**窗位约束（COO 统排域承录·零硬塞零抢跑）**：施工时点=明晨窗 CFO 切换实锚起算（统排件 §五）·GLM 75% 止损线联动（触线全线收手）——**本令今晚出=候窗待命态（明晨实锚齐即启·零再请令）**——消解「今晚出 or 明晨出」二选：出令时点与施工时点分离。

## §五 · 红门照役

C 档超半重裁门（拆树令 §五·本批 0 C 档不触）+红即停零二次硬试+D-46 值面（契约卷零 token 嵌面）+回滚锚三形（kit revert 段+TriMMC dist bak+unit 回旧 dist）。

## §六 · 使用依据

STE 契约勘面毕报（fd6da7a72·COO 696 转呈信面读数）+本席 sg pipeline imports 现勘（2026-11-20T11:08:58Z 同拍现查·四域 import 实质面三 type 一值实锚+四域文件位 2049B/4834B/4878B）+拆树令 28ac4728e（§四契约基准+§五门禁）+eval §五分层承录（loop×kit 互补分层）+COO 统排件 §五窗位+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T11:08:58Z（+8=2026-11-20 19:08:58·date 现查原值·D-47 正形）
