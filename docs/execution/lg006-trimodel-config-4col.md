# LG-006 TriModel 配置读数四栏（CAO 登记簿补栏材料）

- sourceOfTruth: TriMetaverse/docs/execution/lg006-trimodel-config-4col.md
- syncMode: draft｜lastSyncedAt: 2026-09-09
- 性质：BOD ③线直办产出（CTO 席 3333 面勘出，转 CAO 登记簿补栏）

## 栏 1·keys 段表

- **权威源**：TriModel keys API（`src/api/keys.ts`）+ key-encryptor.ts 加密存储
- **刷新间隔**：900s（`TRIMODEL_KEY_REFRESH_INTERVAL_S ?? 900`）
- **API_TOKEN**：`process.env.TRIMODEL_API_TOKEN ?? ''`
- **默认模型**：`TRIMODEL_DEFAULT_MODEL ?? 'tmv-deepseek-v4-pro'`
- **providers 段**：keys 库经 key-encryptor.ts 加密存储（**明文不可直读**——加密库密钥持有者=CEO 授权面），providers 段结构含 anthropic 段（id.secret 复合形态）/openai 段（单段）/deepseek 段/openrouter 段四段（LG-030 勘定 4 providers）
- **活跃枚**：anthropic 段含 GLM 活枚（id.secret 复合=GLM anthropic 入口要求形态，ST 补勘实证 ALIVE）；openai 段含旧中央 token d2cd071c（sg TriMMC Unit 权威值同源）

## 栏 2·额度参数（relay.ts 额度接力）

- **MAX_FALLBACK_DEPTH** = 链长-1（F5 根治：深度截断不再吞链尾）
- **TRIMODEL_FALLBACK_CHAIN** env：顺序配置化（显式列举制，进池=运营决策禁自动发现）
- **RELAY_COOLDOWN_MS** = 60_000（60s 冷却窗，防回切抖动）
- **节点粒度**：模型@账号（同模型内账号级先行，账号穷尽再跨模型）
- **禁接力**：per-task ChatOptions.noRelay + per-agent TRIMODEL_NO_RELAY env 两层

## 栏 3·模型清单

| 模型名 | 状态 | 用途 |
| --- | --- | --- |
| glm-5.3-flash | ALIVE（probe 实证） | 值班位 probe 裁名+主力模型 |
| deepseek-v4-flash | ALIVE | fallback 链成员 |
| deepseek-v4-pro | ALIVE | fallback 链成员 |
| deepseek-chat | ALIVE | fallback 链成员（retire 注记过时实测可用） |
| tmv-deepseek-v4-flash | 路由别名 | → GLM/deepseek 上游 |
| tmv-deepseek-v4-pro | 路由别名 | → 同上 |
| tmv-deepseek-chat | 路由别名 | → 同上 |

## 栏 4·记账现状

- **tokenStats**：RelayEvent[]（内存态数组，relay.ts:58 独立模块）
- **recordRelayEvent(ev: RelayEvent)**（:62 接口）
- **字段**：from_model→to_model + reason + ts（换棒台账）
- **持久化**：候裁（独立模块 vs 内嵌——候裁点③ relay.ts 独立模块落法已裁=独立模块）
- **healthz 可观测**：rateLimitedCount 已上 8713 healthz（LG-032 b 窗 2 P4-d 项断言过）
