# CTO 补充建议书 · MC/LC 抽层评估+路标五步技术复核（实勘版）· 2026-10-17

- sourceOfTruth: 本卷（trees/lg085-bod-cli-acp-review/cto-mclc-extraction-roadmap-review-20261017.md）
- syncMode: static（增补派工两命题+清单件·挂 10-18 12:00 评审与并表卷 86c7382a6 同窗）
- lastSyncedAt: 2026-10-17T11:12:50Z（+8=19:12:50 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: BOD 增补派工（19:11）·概念卷增补五 ec24b49c8（§10.4/10.5 已读正身）

## 结论先行

1. **MC/LC 抽层：BOD 预判「方向合理·不急预先抽」认同**，实勘增补一层关键事实——**结构级共性已高度就绪（超概念面预期）·真成本在行为级分野**；抽层前置加一道「内容级共性实勘门」（天级·产出真共性/假同构双清单）。
2. **路标五步依赖序合理**，步3（工具面/MCP 厚化）=关键路径与最大不确定；步4 判据勘验对象更新——soul-loader 双 MC 在案（实勘·勘正「R 面彩蛋」表述），「第二消费者」判据从「等出现」变「勘现势」。
3. MC/LC 共性清单实勘版随卷（§三）——零成本登记完成。

## ① MC/LC 抽层技术判读（四仓 src 顶层实勘 19:1x）

| 实勘读数 | 内容 | 判读 |
| --- | --- | --- |
| MC 对结构 | TriRMC/src 24 目录 ⊂ TriMMC/src 27 目录（差集仅 daemon/internal-token/notify 三件·RMC 真子集） | MC 面非「两个独立 daemon 的共性」而是**近乎同一份代码的两份 fork**——MC 抽层实际语义=主干重统一；增量面收敛谈判（三件去留）是前置 |
| LC 对结构 | MLC 39 项 vs RLC 37 项·同名 95%·差集仅 4 项（power-monitor 单侧·power-keepalive↔power-follower 改名·notify/letter-store 场景差） | 结构准备度极高；**电源面恰是分叉最重处**（单侧独有+改名分叉）——「LC=电源面共性」抽层候选里核心件现处分叉形态，先收敛才谈抽层 |
| soul-loader | MMC 与 RMC **双面在案**（目录级） | 勘正概念卷 9.1「R 面彩蛋」表述（非 R 独有）；人格装载判据见 §②步4 |
| mcp/ | MLC 与 RLC 双面同名在案 | 步3 MCP 厚化有自家实现先例可参照（先勘两面 mcp 实现再定 agent-core 侧方案） |

**判读**：BOD 四理由（cron 分野/fork 演化/用出来的抽象/月级工程量）全部站得住，实勘再加三条：

1. **结构 vs 行为分层**：cron 行为分野（TriMMC/MLC/TriRLC addJob 分野在册·F-3 家族性）是**行为级**分野——结构合并易·行为统一难。「分野藏进 flag」警告的精确形态=行为级；「用出来的抽象」判据应落在**行为级实勘**：哪些行为两面真同形消费，行为勘验才见分晓（目录同名可掩盖内容分叉——fork 后各自改过的文件级 diff 未勘）。
2. **前置门**：抽层施工前加「内容级共性实勘门」——双仓 diff 级勘验（天级）·产出=真共性清单（可抽）/假同构清单（先收敛分野或保留本地件）双清单。无此门则工程量预估失真。
3. **三层抽象警戒**：现已有 agent-core 内核层，再加 MC-core/LC-core=daemon→域层→内核三层——消费面未厚时第三层是理解成本负资产；MC/LC 抽层与路标步2（例行件迁移后消费面变厚）天然同窗评估，不单独开窗。

**工程量复核**：搬代码非成本大头（结构就绪）；真实成本=内容级实勘（天级）+分野收敛谈判（电源面/notify 面/三件增量面）+四面回归双跑验证——BOD 月级预估合理，P50 月级·P90 双月级（含双跑窗）。

## ② 路标五步技术复核（依赖序/工程量/门禁）

| 步 | 内容 | 工程量 | 依赖 | 门禁（出口判据） |
| --- | --- | --- | --- | --- |
| 1 | P3 双案实测 | 周-双周级 | 无（可即开勘） | 三读数全绿（误催率/补跑成功率/轮均 token）+判断力质量抽检 |
| 2 | 例行件迁移 | 双周级 | 步1 绿 | 迁移件零回归缺陷+原 harness 侧退役双跑窗 |
| 3 | 工具面/skills/MCP 厚化 | **月级起·关键路径** | 步2 | **MCP 兼容优先**（生态复用>自建协议·参照两面 mcp/ 先例）；工具面覆盖率对表（现役 harness 工具清单 vs agent-core 面·施工/管理两组分列） |
| 4 | 人格承载（soul-loader 入包） | 周-双周级（入包本身）·质量门另计 | 步3 工具面够厚 | 双盲对照质量门（同题 harness vs agent-core·CPO 面参与判读）；**判据勘验对象更新：soul-loader 双 MC 目录级在案——「第二消费者」从「等出现」变「内容级勘验现势」·可能已近满足·随步1 窗一并勘** |
| 5 | 四域切换裁剪 | 双周级（切换本身） | 步4 全绿+治理条款落 | 照 B14 形四锚门（静态+机制锚+席义锚+稳态——B 系收官刚实证的门形复用） |

总时长：季度级（乐观）-半年级（含门禁窗）·**步门制推进不设硬时点**。每步「≥2 面消费才进包/≥2 daemon 消费才抽层」判据条款化随批。

## ③ MC/LC 抽层候选清单（实勘版·零成本登记）

**MC 候选**（第一消费者=TriRMC·第二=TriMMC）：agent-loop/comm/config-sync/context-builder/contracts/cron/heartbeat/memory-injector/mirror/node-bridge/observability/orchestration/pipeline/policy-gate/prompt-cache/server/soul-loader/task-controller/tool-gater/types（17 目录级同名·内容级同形度候实勘门）。
**LC 候选**（第一消费者=TriRLC·第二=TriMLC）：company/config/context-adapter/contracts/crash-handler/cron/daemon/event-queue/heartbeat/local-node/localbus/mcp/mirror/planner/project/runtime/server/services/session-store/skills/sync/task-runtime/toolbus/tools/tray/trimc-auth/tui/update/wallet-upgrade（29 目录级同名）。
**分野件**（不抽·保留本地或先收敛）：MC 侧 daemon/internal-token/notify（MMC 增量）·LC 侧 power-monitor（MLC 独有）/power-keepalive↔power-follower（改名分叉·先收敛实现）/notify vs letter-store（场景件：拍信面 vs 信箱面）。

## 风险与门禁

- **假同构风险**：目录同名掩盖内容分叉（fork 后各自改过）——抽层前置内容级实勘门（§①第 2 条）为硬门。
- **电源面收敛先行**：power-keepalive↔power-follower 改名分叉是 LC 抽层最小闭环试点候选（两件小·分野明确·收敛即验「分野收敛谈判」流程）——候步2 窗顺带评估，不单独开窗。
- 步3 关键路径失速风险：MCP 兼容面若现役 MCP 资产接入不顺，回落自建协议决策点须回本席裁决（选型门）。

## 使用依据

- BOD 增补派工 19:11·概念卷增补五 ec24b49c8（§10.4/10.5 正身已读）·并表卷 86c7382a6
- 四仓 src 顶层实勘（19:1x·D:/Code/ai/ 四兄弟目录 ls 对表·读数原样录入 §①/§③）
- 本席建议书 b0a84b26d（三引擎矩阵/三读数门禁）·cron 行为分野记忆条目（TriMMC/MLC/TriRLC addJob 分野在册）

—— CTO 小狄（落款 date 现查原值 2026-10-17 19:12:50 +0800·发毕对表）
