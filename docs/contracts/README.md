# Contracts Assets

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/contracts/README.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-15

当前文件是 TriMetaverse contracts 目录的本地索引真源，只负责说明本目录下的协议、契约、DDL 草案、迁移顺序和 schema 资产如何分工。它不是 TriCompany 公司级 workflow 书面主真源，也不替代具体子页面各自声明的 source / summary / audit 边界。

## 目录治理规则

当前 `TriMetaverse/docs/contracts/` 下的页面，默认只允许落入以下三类：

1. `source-only` 本地协议 / 契约 / schema / DDL / 索引策略真源：用于维护 `TriMetaverse` 自己的跨模块 API 契约、事件映射、任务协议、DDL 草案、schema、迁移顺序和数据策略。
2. `release-side-summary` 发布侧摘要：仅当某页已经在 `TriCompany` 或某个模块仓存在明确 source-side 契约真源，而中央需要保留摘要、引用入口或发布视角说明时使用。
3. `audit-record` 审计 / 演进记录：用于维护契约演进记录、比对结论、对齐纪要、专项收口和真实执行留痕。

不再使用 `central-summary` 作为默认文档定位。若某页本质属于 `TriMetaverse` 自己的协议、schema、DDL、迁移规则或接口契约，则应直接标记为本地真源，而不是伪装成“中央真源摘要页”。

## 真源判断顺序

新增或改写 `contracts` 文档时，默认按以下顺序判断：

1. 先判断该内容是否已经在 `TriCompany/docs/workflow/`、`TriCompany/docs/engineering/`、某个模块仓的现役接口文档，或对应 runtime / schema / manifest 中存在明确 source-side 真源。
2. 若已存在明确模块或公司级真源，则当前页只保留发布侧摘要、跨模块引用或中央协议视角，不再自称该内容的唯一公司级主真源。
3. 若不存在明确上游真源，但页面本身属于 `TriMetaverse` 的跨模块协议、契约、DDL 草案、schema、索引策略、迁移顺序或接口规范，则当前页直接作为本地真源维护。
4. 若页面记录的是对齐纪要、迁移收口、专项验证结果或版本演进留痕，则归入审计层，而不是公司级书面真源。

## 维护禁则

- 不要把 `TriMetaverse/docs/contracts/` 重新写成 `TriCompany` 公司级 workflow 或产品真源。
- 不要为了“统一口径”硬给本地协议页伪造一个并不存在的 `TriCompany` 单一真源。
- 不要把 schema、DDL 草案、迁移策略、命令清单或目录索引继续标成 `central-summary`。
- 不要把跨模块协议的实现细节直接写成某个模块已经正式落地的既成事实；应明确区分契约、草案、现役接口和待实现项。
