# LG-031 M/R 面语义矩阵定谳——联审议题卡（D-15 CPO+CTO 双席，LG-030 同款）

- sourceOfTruth: TriMetaverse/docs/execution/lg031-mr-matrix.md
- syncMode: source-only｜lastSyncedAt: 2026-09-04
- 状态：候双席意见件；边界=只勘定不改连接不改代码

## 一、CEO 模型提案（待 falsify/confirm 逐格）

**2×2**：纵轴=本/远端，横轴=M/R 面：
| | M 面 | R 面 |
| --- | --- | --- |
| 远端 | TriMMC（TriMC 改名/中央 MC） | TriRMC（河源） |
| 本地 | TriMLC（8713 通道） | TriRLC（8711 本机 daemon） |

**治理流向**：R 面不成熟→工作给 M 审核再合入；M 面成熟→可实验方案指导 R 改造。

## 二、实盘事实锚（勘定输入，LG-030/LG-026 在册+实证）

- LG-030 三查四定：8711 TriRLC 经 TRIMC_BASE_URL **上送 sg 中央面**（47.245.122.61:8710）；heyuan TriRMC（8.155.54.79）=周平面迁移自治执行点——「上送中央+R 面执行迁移」**双职责分属两节点**（8711 的上送对端竟是 M 面中央，非 R 面）。
- LG-026 在册：TriMLC（8713）停在**通道 Profile**（501 三 agent 宿主路由）；**letters 设施在 TriRLC**（组长岗信件全套）；TriRLC 内进程含 TriModel 消费（trimodel client）。
- 组件成熟度实据：M 面=编排 cron 引擎（orchestrate-tick/巡检/迁移）+中央 MC 自持；R 面=agent-core 执行+周迁移 cron+letters+组长岗（P1-P3 技术面闭环候 P4）。
- 治理实盘：D-15 联审门（功能模块双席门）/CHO 语义门（五件套签收）/组长验收（P1-P4 门禁）/LG-030 D-17 连接变更门。

## 三、四覆盖（双席逐项）

1. **2×2 逐格定谳**：四格各=组件名/角色/成熟度/连接关系——CEO 模型与实盘逐格对表（预计 falsify 点：本地 R 面 TriRLC 连的竟是远端 M 面中央，模型「R 面=R 面相连」隐含假设与 LG-030 实证冲突）。
2. **治理流向定谳**：CEO 流向提案（R 受限→M 审核合入/M 成熟→方案指导 R）vs 实盘（D-15/CHO 门/组长验收/迁移线）兼容性——成败笔或修正版（含「M/R 审核向」与实盘「M 面组长验收机制/D-15」映射）。
3. **命名/文档落点**：定谳入册点（whitepaper 拓扑节/README/code-state/纪律引用）——与 LG-030 六点不冲突（连接面实证已在册，本定谳=语义矩阵升级版）。
4. **在途链影响声明**：M0e 批 3/再生窗/LG-026 P4 预期无碍——声明确认即可（若有意料外影响即升级）。

## 四、材料索引

- LG-030 纪要：docs/execution/lg030-connectivity-survey.md（三查四定全链）
- LG-026 在册（letters 在 TriRLC/TriMLC 通道 Profile）：台账 LG-026 段
- whitepaper 图 3-8 图注（连接面实证已入）
- 治理实盘：D-15 v2/D-17/CHO 五件套签收状态机
## 五、定谳附录（BOD 全景扫描补实证 2026-09-04）

- **8711 全出站连接全景扫描**（PID 17148 实测）=唯一对端 47.245.122.61:8710（sg 中央），**零指向 8.155.54.79 河源连接**；TriRLC 配置/代码面 grep 河源 IP 零通信配置痕迹（唯一命中=README 描述行）——**TriRLC↔TriRMC 无直接通信通道**，协作全经 git 仓库间接（TriRMC cron 拉仓执行+操作约定非消息通道）。星形拓扑获全景级确证，「两对象职责分属」补最后一块实证。
