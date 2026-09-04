# LG-006 额度接力设计草案（TriModel 多模型额度接力）

- sourceOfTruth: TriMetaverse/docs/execution/lg006-quota-relay-design-draft.md
- syncMode: draft｜lastSyncedAt: 2026-09-04
- 性质：LG-006 在册项设计面，出稿候裁不实施（压缩令件③）

## 一、现状锚（勘定在案）

- TriModel client fallback 链已存在但**顺序硬编码+深度截断**：MAX_FALLBACK_DEPTH=2（src/client.ts:9）——LG-032 期 F5 实证：tmv-deepseek-v4-flash 起步链 flash(0)→pro(1)→chat(2) 超深度截断，**链尾 deepseek-v4-flash 永不被调**（数学上无活出口）；
- keys 面 4 providers（deepseek/anthropic/openai/trimetaverse）；TRILC_LEAD_MODEL env 覆盖已落（LG-026 门禁④路径）；
- TriStaciss 8008=另一层 provider 池（LG-026 A 案），与 client 层 fallback 分层并行。

## 二、设计四件

1. **接力顺序配置化**：`TRIMODEL_FALLBACK_CHAIN` env（逗号分隔模型名有序表，如 `glm-5.3-flash,deepseek-v4-flash,deepseek-chat`）——显式指定即覆盖内置 tmv-* 链；未配置=现役 tmv-* 内置链不变（零破坏）；链长=表长，**MAX_FALLBACK_DEPTH 同步=链长-1**（F5 教训根治：深度截断不再吞链尾）。
2. **额度感知触发（换棒判据）**：错误分类表→自动下一棒——401/403（凭据失效）、429（限流）、5xx（上游故障）、额度尽错误码（provider 特定码表：deepseek 402-insufficient 等）触发 fallback；网络层超时计入（重试 1 次后换棒）；**正常响应永不换棒**（防误切）。
3. **换棒台账与可观测**：换棒事件落 token_stats 面（from_model→to_model+reason+ts）+日志显式行（与 TriStaciss reason 日志同款纪律）——额度接力可视化，防「静默降级」假成功形态（LG-030 期三连教训同族）。
4. **分层边界**：本设计=TriModel **client 层**接力；TriStaciss provider 池=服务层池——两层不混（client 接力选「打哪个服务」，Staciss 池选「服务内打哪个 provider」）；跨层联动候 v2。

## 三、实施位与排期（候裁）

- 落点=TriModel 仓 client.ts（fallback 循环+错误分类表）+TriRLC/TriPilot 消费端 env 透传；改动面小（一循环+一配置解析+一台账钩子）；
- 排期建议=Wave 0 同窗（与 contract parser v3.1 适配同批——两者同为 TriModel/TriRMC 消费面跟进项）；
- 候裁点：①链配置 env 名与作用域（全局 vs per-agent）；②错误分类表首版码集；③换棒台账落 token_stats 还是独立面。
