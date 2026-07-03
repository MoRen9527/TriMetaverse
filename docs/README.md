# Docs Assets

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/README.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-15

当前文件是 TriMetaverse `docs/` 目录的本地索引真源，只负责说明中央文档层各子目录和根级页面的治理分工。它不是 TriCompany 公司级 workflow、product 或 engineering 书面主真源，也不替代子目录内各页面各自声明的 source / summary / audit 边界。

## 目录治理规则

当前 `TriMetaverse/docs/` 下的页面，默认只允许落入以下三类：

1. `source-only` 本地索引 / 协议 / 架构 / 模板 / 计划 / 清单 / runbook 真源：用于维护 `TriMetaverse` 自己的中央项目级架构说明、模块边界、跨模块契约、模板、计划、执行清单、训练聚合入口和运行说明。
2. `release-side-summary` 发布侧摘要：仅当某页已经在 `TriCompany` 或某个模块仓存在明确 source-side 真源，而中央需要保留摘要、引用入口或发布视角说明时使用。
3. `audit-record` 审计 / 留痕记录：用于维护运行记录、issue pack 收口、phase evidence、对齐结论和真实执行留痕。

不再使用 `central-summary` 作为默认文档定位。若某页本质属于 `TriCompany` 的公司级 product / engineering / workflow / training 真源，应优先回到 `TriCompany`；若某页本质属于 `TriMetaverse` 自己的中央协议、架构、模板、计划、清单或目录索引，则应直接标记为本地真源。

## 真源判断顺序

新增或改写 `docs/` 下页面时，默认按以下顺序判断：

1. 先判断该内容是否已经在 `TriCompany/docs/`、对应模块仓 `docs/`、现役 runtime / schema / manifest，或中央 `BusinessStrategy` 真源中存在明确 source-side 真源。
2. 若已存在明确上游真源，则当前页只保留发布侧摘要、跨模块引用、中央发布说明或入口导航，不再自称该内容的唯一公司级主真源。
3. 若不存在单一上游真源，但页面本身属于 `TriMetaverse` 的中央架构、模块边界、跨模块契约、模板、计划、issue pack、执行清单、索引或运行手册，则当前页直接作为本地真源维护。
4. 若页面记录的是真实运行记录、phase evidence、专项对齐纪要、基线快照或历史收口，则归入审计层，而不是公司级书面真源。

## 子目录分工

- `workflow/`：TriMetaverse workflow 协议、模板、样例、runbook 与发布侧 workflow 摘要。
- `registry/`：中央 strategy / governance / code / product 工作型登记层。
- `contracts/`：跨模块协议、schema、DDL 草案、迁移顺序与索引策略。
- `product/`、`engineering/`：若 `TriCompany` 已存在同名 source-side 真源，则当前目录优先保留发布侧摘要；无上游真源时才保留中央本地真源。
- `execution/`、`runs/`：当前中央执行目录索引、run 结构规范与审计记录承接层。
- `training/`：中央 training 聚合入口与跨模块培训导航层。
- `testing/`：跨模块测试框架、测试治理和验证策略说明。

## 维护禁则

- 不要把 `TriMetaverse/docs/` 重新写成 `TriCompany` 公司级真源的默认落点。
- 不要为了“统一口径”伪造一个并不存在的 `TriCompany` 单一真源去覆盖中央本地协议、架构、模板或计划页。
- 不要把目录索引、issue pack、模板、决策、清单、运行手册或协议草案继续标成 `central-summary`。
- 不要把尚未在模块仓或运行时落地的契约、计划或草案写成已完成实现；应明确区分中央判断、模块真源、发布摘要与审计记录。
