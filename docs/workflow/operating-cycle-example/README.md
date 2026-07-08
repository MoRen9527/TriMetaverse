# 赛博公司经营主工作流首轮样例包

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-cycle-example/README.md
- syncMode: source-only
- lastSyncedAt: 2026-06-04

## 1. 用途

本目录提供一条可顺序阅读的经营主工作流样例链，用来演示赛博公司如何围绕当前默认经营实验跑一轮最小闭环。

当前文件是 TriMetaverse 样例包目录的本地真源，只承接演示链路、教学说明和发布侧样例消费边界；它不代表 TriCompany 公司级 workflow 真源，也不代表任何真实经营执行结果。

该样例：

- 锚定当前默认经营实验：`AI 内容运营与增长微服务`
- 锚定当前优先模块：`TriMetaverse`、`TriPilot`、`Tride`、`vscodium`、`TriLC`、`TriStaciss`、`TriTest`、`TriDeployment`
- 仅作为演示样例，不代表真实经营记录、真实收入或真实已完成交付
- 复盘后可继续配合 `../handoff-templates/central-registry-closeout.example.json` 查看与本轮样例对应的跨模块事实收口样板

## 2. 样例顺序

按以下顺序阅读：

1. `board-directive.sample.json`
1. `operating-plan.sample.json`
1. `demand-intake.sample.json`
1. `prd-ownership-routing.sample.json`（仅当 PRD 归属未明、docs bootstrap 无法安全启动时插入）
1. `mvp-definition.sample.json`
1. `budget-check.sample.json`
1. `engineering-task.sample.json`
1. `sales-progress.sample.json`
1. `operating-review.sample.json`

如需查看本轮样例在复盘后的跨模块边界收口，可继续参考：

1. `../handoff-templates/central-registry-closeout.example.json`

## 3. 样例场景

本轮样例的核心问题是：

在不突破当前预算纪律的前提下，如何围绕 `AI 内容运营与增长微服务` 做出一轮最小可 收费试单包，并让经营层能完成从目标、产品、预算、交付到复盘的闭环。

在当前样例的延伸场景中，还要求明确：PC 端软件层既是用户可直接使用的自动化与 `vibe coding` 工具面，也需要与 `TriLC` 协同承接本地化任务；`vscodium` 相关新功能应优先视作上游周期性升级吸收，而不是默认记为本地新增能力。

## 4. 说明

- 本目录中的所有对象都遵循 `../tricompany-handoff-envelope.schema.json`。
- 若需要对真实执行做记录，应新建真实对象，而不是直接复用本目录样例。
- 若过程发生异常，应追加 `RISK_ESCALATION` 对象；本样例展示的是一条无重大阻断的 最小闭环。
