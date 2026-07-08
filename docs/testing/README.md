# Testing Assets

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/testing/README.md
- syncMode: source-only
- lastSyncedAt: 2026-06-15

当前文件是 TriMetaverse `docs/testing/` 目录的本地索引真源，只负责说明当前中央测试治理页的定位与维护规则。它不是 TriCompany 公司级 workflow、product 或 engineering 书面主真源，也不替代具体测试报告、模块仓测试文档或 TriDev / TriTest 的实现真源。

## 目录治理规则

当前 `TriMetaverse/docs/testing/` 下的页面，默认只允许落入以下三类：

1. `source-only` 本地测试治理 / 框架选型 / 模板 / 说明真源：用于维护跨模块测试分层、框架选型、环境建议、验证策略和统一测试治理口径。
2. `release-side-summary` 发布侧摘要：仅当某个测试策略、门禁规范或测试真源已在 `TriCompany`、`TriDev`、`TriTest` 或对应模块仓中有明确 source-side 文档，而中央需要保留摘要、引用入口或导航时使用。
3. `audit-record` 审计 / 验证记录：用于维护某轮专项验证、测试结论、覆盖率收口、稳定性复盘和真实执行留痕。

不再使用 `central-summary` 作为默认文档定位。若某页本质属于中央测试治理、跨模块测试框架判断或验证建议，则应直接标记为本地真源；若某页本质属于某个模块或公司级测试真源，则应优先回到对应 source-side 仓。

## 真源判断顺序

新增或改写 `testing/` 文档时，默认按以下顺序判断：

1. 先判断该内容是否已经在 `TriCompany`、`TriDev`、`TriTest` 或对应模块仓存在明确 source-side 真源。
2. 若已存在明确上游真源，则当前页只保留发布侧摘要、导航或中央引用口径，不再自称唯一真源。
3. 若不存在明确上游真源，但页面本身属于 TriMetaverse 的跨模块测试框架、测试分层、环境建议、治理规则或模板，则当前页直接作为本地真源维护。
4. 若页面记录的是某轮真实验证、专项测试、覆盖率收口或回归证据，则归入审计层，而不是公司级书面真源。

## 当前目录说明

- `fullstack-testing-framework-R04.md`：当前跨模块测试框架与环境方案本地真源。

## 维护禁则

- 不要把 `TriMetaverse/docs/testing/` 重新写成 `TriCompany` 公司级 workflow 或 product 真源。
- 不要把跨模块测试治理页伪造成某个并不存在的公司级统一测试主文档。
- 不要把测试模板、框架建议、验证说明或目录索引继续标成 `central-summary`。
- 不要把尚未在模块仓或 CI 中真实落地的测试能力写成已具备能力；应明确区分方案、建议、现役门禁与真实验证结果。
