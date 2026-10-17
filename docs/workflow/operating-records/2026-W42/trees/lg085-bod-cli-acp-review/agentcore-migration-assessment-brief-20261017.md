# agent-core 迁移评估工单 · harness 席组 × agent-core 常驻管理分层评估

- sourceOfTruth: 本单（BOD 立单·CEO 2026-10-17 18:14 派工令）
- syncMode: static（四席建议征集·产出并表候 2026-10-18 12:00 需求评审）
- lastSyncedAt: 2026-10-17T18:15:54+08:00（date 现查·写前跑）
- 派工令原文要旨（CEO）: 「如果用 claude code、codex、dsh 等 harness 做公司席组来干活，agent-core 可以成为常驻的公司管理，与非人格类 agent 开始交集了，甚至人格类 agent 偏运营+人格的都可以迁移到 agent-core，前提是他移植 openclaw 相关的功能，以及实际效果评估是否能优于前面的 harness。还有是否会打乱『运营件归消费侧自持——TriRLC 已示范这个分层范式』，需要更大范围的细致评估，这涉及公司产品架构的定位，可以先让 cpo、cto、cos 和 coo（运营角度）给出建议。」
- 背景卷: bod-agentcore-vs-claudecode-concept-brief-20261017.md（同目录·八节+增补四全景实锚）

## 一·评估命题

1. **分层形态**：harness（claude code/codex/dsh）承载席组施工 + agent-core 承载常驻公司管理（cron/巡检/催办/信箱/节拍等非人格 agent）——此分工是否成立、边界划哪。
2. **迁移序**：非人格类 agent 先交集（已发生：BOD 转报链/催办定时器=bod-tick 系）；人格类中「偏运营」者（COS/COO 的例行巡检面）是否迁 agent-core。
3. **前提工程**：agent-core 移植 openclaw 被裁件（渠道投递 delivery/隔离 agent/唤醒协调——reaper 与启动补跑 TriRLC/MLC 已自持补回）。
4. **效果对比**：agent-core 承载 vs 现 harness（claude code 13 席形/dsh 形）在常驻管理场景的实际效果——成本/稳定/可观测/维护面。
5. **范式张力**：是否打乱「运营件归消费侧自持——TriRLC 已示范」分层范式（内核薄·运营归消费侧）。
6. **产品架构定位**：TriMetaverse 产品面 agent-core 的定位（内部底座 vs 对外产品件）。

## 二·四席分工

| 席 | 评估角度 | 产出要求 |
| --- | --- | --- |
| m-cto | 技术架构：移植路径（三件工程量·隔离 agent 形）/harness 技术对比（claude code vs agent-core vs dsh 三引擎成本矩阵）/分层范式技术判读 | 建议书一页·结论先行 |
| m-cpo | 产品定位：agent-core 在产品面的定位（内部底座 or 对外件）/路线图位次/MVP 划线 | 建议书一页·结论先行 |
| m-cos | 治理流程：迁移后流转面/信箱/催办/挂账台账治理形态变化/审计与留痕影响 | 建议书一页·结论先行 |
| m-coo | 运营面：成本（token/维护人力）/节律（cron 形态）/值班与席位编排影响 | 建议书一页·结论先行 |

## 三·时限与收口

- **时限**：10-18（周日）11:30 前四席建议书回 BOD（信箱 target_seat='bod' 或 SendMessage 转呈）。
- **收口**：BOD 汇总并表→10-18 12:00 需求评审与 DEM-005/DEM-006 并表候裁。
- **口径纪律**：建议书事实引用须可溯源（源码/文档/commit）；无把握处明说；D-39 域内本单只征集不预裁——迁移与否 CEO 保留权项（产品架构定位面）。

—— BOD 2026-10-17 18:15:54 +0800（date 现查·写前跑）
