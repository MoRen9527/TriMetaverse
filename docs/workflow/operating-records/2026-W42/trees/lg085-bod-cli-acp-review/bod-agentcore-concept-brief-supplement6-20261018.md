# 概念卷增补六·CEO 10-18 09:56 六问答复与指示落卷

- sourceOfTruth: 本卷（BOD 落卷·CEO 2026-10-18 09:56 六连问）
- syncMode: static（增补卷·同目录概念卷十节之续）
- lastSyncedAt: 2026-10-18T09:58:54+08:00（date 现查·shell 注入零手打）

## 一·CEO 六问与 BOD 答复/处置

**问 1（N 进程 vs 单 daemon）**：CEO 认同 N 进程局部故障优于 1 daemon 单点；裁定——仍走 daemon+n 进程最分散风险，源码级维护各席 agent 使恢复快于 claude code 拉起；**TriRLC 单 daemon 承载全会话热态=单点故障设计缺陷**，目标形态=daemon（管理面/监督者）+每会话独立子进程。
→ 处置：裁定记档；评估派 CTO（问 2 并单）。

**问 2（agent-core 每会话子进程）**：评估派工 CTO——子进程生命周期/崩溃隔离/监督者形态/工程量，候 12:00 评审并表。

**问 3（job 与人格席进程模型配合）**：评估派工 CTO——融为一体的单进程模型（两种生命周期）vs 分席配合（job 短命池+人格席长驻池），候评审裁。

**问 4（TriRLC 会话分野+抽层缓议）**：BOD 实勘（本地工作副本源码级）——TriRLC **已有多会话分野**：session-store（SQLite）多会话存储、CLI 支持 --resume <id>/--list-sessions（cli.ts L41-59,L533-556）、server 侧 createSession 多点调用（app.ts L2907/3296/3370/3435/3643）、getSessionByCloudId 云会话映射——**非「任一 CLI 接入同一会话」**。但全会话热态同住 daemon 单进程（问 1 单点缺陷实体）。CEO 判：**暂不抽层**·待共同之处增多再说·CTO 评估记共性清单（与 CTO 10-17 实勘门「内容级双仓 diff 硬门」同构·双清单=共性+分野）。
→ 处置：抽层缓议入候裁区；共性/分野双清单派 CTO（问 3 并单）。

**问 5（四域全切语义修订）**：CEO 裁——四域全切**只需可行即可，未必真去切；harness 多样性=R 面+M 面联合优势（灵活性）**。路标五步步 5 语义从「四域切换裁剪」改写为「可行性证毕+多样性保持」——全切从目标降为可行性演示。

**问 6（soul-loader 双 LC 在案?）**：BOD 本地工作副本勘验——TriMLC **零命中**·TriRLC **零命中**·TriMMC 1 处（src/pipeline/assemble.ts）·TriRMC 1 处（src/pipeline/assemble.ts）。**双 LC 不在案·四面分布=「MC 有 LC 无」**（人格装载器仍系 MC 侧件）。CTO 对 sg/河源副本复核候卷。

## 二·对既有候裁案的影响

- 候裁案 1（形态采纳）：CEO 增补——agent-core 侧目标形态亦为 daemon 监督者+N 子进程（单点缺陷修正），与 harness 侧 N 席进程形对齐。
- 候裁案 3（门禁）/迁移序：不变。
- MC/LC 抽层：**缓议定谳**（CEO 裁）——共性/分野双清单为复活判据基。
- 路标五步：步 5 语义改写（问 5）；步 4 判据不变（双 MC 已在案）。

## 三·执行记录

- 派工 CTO：09:58:08（四项并单·11:30 时限·候 12:00 评审并表）
- 实勘件：TriRLC src/cli.ts + src/session-store/store.ts + src/server/app.ts；四面 soul-loader grep（soul-loader|soulLoader|soul_loader · src 树）

——BOD（date 现查原值粘贴：2026-10-18 09:58:54 +0800·shell 注入零手打）
