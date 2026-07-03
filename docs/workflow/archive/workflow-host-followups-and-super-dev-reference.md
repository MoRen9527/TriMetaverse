# Workflow 后续事项存档与 super-dev 参考基线

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/archive/workflow-host-followups-and-super-dev-reference.md
- publishedFrom: 当前文件（audit record）
- syncMode: audit-record
- publishTier: audit-record
- lastSyncedAt: 2026-06-04

## 0. 历史术语对齐说明（2026-04-09）

- 本文属于 archive 存档文档，最初写作时仍使用 `Workflow Main Controller` 等旧称。
- 在当前命名体系下，研发 10 阶段主流程主控统一命名为 `Development Main Controller`。
- 本文如果提到服务域主控，应以 `Task Main Controller` 为准，而不是历史性的 `Main Controller` 泛称。
- 文中涉及研发宿主迁移时，统一应理解为到 `TriMetaverse V1 正式上线切换阶段` 迁入 `Tride`。
- 若本文与现行真源冲突，以 `project.md`、`tricompany.md`、`docs/workflow/terminology.md` 与 `docs/workflow/workflow-host-integration.md` 为准。

## 1. 目的

本文件用于把当前暂停的两项后续工作先归档，避免后续继续推进时重新回忆上下文。

同时，本文件记录为什么要把 `super-dev` 引入到 `reference/`，以及未来恢复工作时的比对入口。

首轮对比输出见：`docs/workflow/archive/workflow-vs-super-dev-first-comparison.md`

宿主侧改造清单见：`docs/workflow/tride-model-adoption-checklist.md`

## 2. 当前冻结的两项后续工作

### 2.1 把宿主自动落盘契约真正下沉到 Tride

当前状态：

- `TriMetaverse/docs/workflow/workflow-host-integration.md` 已经定义了 `Development Main Controller` 的宿主输出责任。
- `TriMetaverse/docs/workflow/workflow-run-metadata.schema.json` 已经定义了 `run-metadata.json` 的结构。
- `TriMetaverse/docs/runs/run-2026-04-cycle-01/` 已经给出 documentation-backed 的结构化 run 样例。

后续真正要做的不是继续写概念文档，而是把这套契约接到 `TriMetaverse V1 正式上线切换阶段` 的正式宿主 `Tride`：

1. 明确 `Tride` 接收 workflow 执行请求时如何生成 `runId`
2. 真实生成 `run-metadata.json`
3. 按阶段写入根阶段与分支阶段 `PhaseResult`
4. 输出 `workflow-summary.md`、`delivery-manifest.json`、`delivery-report.md`

边界提醒：

- 该宿主不是 `TriMC`
- `TriMC` 仍然对应服务域 `Task Main Controller` 与虚拟公司 `Autonomy Main Controller` 的承载侧
- `Development Main Controller` 的切换后正式宿主仍然应落在 `Tride` 的工具能力层

### 2.2 把宿主写入策略与执行事件继续结构化

当前文档已经约束了最小输出责任，但还没有把宿主内部写入策略与执行事件定义成更细的 machine-readable 资产。

后续建议方向：

1. 为 run 生命周期事件建立统一事件结构
2. 区分“阶段开始 / 阶段完成 / 门禁失败 / 回流 / 交付完成”等事件类型
3. 明确写入策略是否采用追加事件流、阶段快照、或两者并存
4. 让结构化事件与 `docs/runs/` 的稳定产物保持可追溯映射

本项的目标不是替换 `PhaseResult`，而是补齐“宿主执行过程如何被机器读取和审计”的中间层。

## 3. 新引入的对比参考项目

已引入参考项目：

- 路径：`TriMetaverse/reference/super-dev/`
- 来源：`https://github.com/shangyankeji/super-dev`
- 当前快照提交：`332dc84e723bbcc4ae7841f3ef90c0d2efe2e369`

引入目的：

- 作为当前 TriMetaverse 开发工作流的对比和参考项目
- 不是立即采纳其工作流，也不是把本仓 workflow 直接替换为 `super-dev`
- 先做优劣势对比，再决定是否改进当前 workflow

## 4. 未来对比时重点看什么

建议至少比对以下 5 个维度：

1. 宿主接入模型：它如何把 CLI / IDE / 宿主能力接入同一套流程
2. 阶段编排模型：它如何表达阶段、恢复、跳转、继续执行
3. 治理与门禁：它如何表达质量门、审核、校验、回流
4. 交付产物：它是否输出稳定、可审计、可复盘的结构化工件
5. 知识与记忆：它如何把知识库、规则和项目上下文持续注入到流程中

如果后续要改进当前 workflow，应优先回答两个问题：

1. `super-dev` 是否在“宿主恢复 / 流程继续 / 阶段治理 / 证据沉淀”上明显强于当前方案
2. 这些优势是否能以不破坏现有 `docs/workflow/` 与 `docs/runs/` 契约的方式吸收进来

## 5. 恢复工作时的建议阅读顺序

下次继续之前，建议按下面顺序读档：

1. 先读本文件，恢复“为什么暂停”和“下一步到底比什么”
2. 再读 `TriMetaverse/docs/workflow/workflow-host-integration.md`
3. 再读 `TriMetaverse/docs/workflow/workflow-run-metadata.schema.json`
4. 再读 `TriMetaverse/docs/runs/README.md` 与 `run-2026-04-cycle-01/`
5. 最后进入 `TriMetaverse/reference/super-dev/` 看其宿主接入、阶段治理和交付证据设计

## 6. 当前结论

当前阶段先不继续实现 `Tride` 宿主侧自动落盘。

先完成两件事：

1. 把后续工作正式归档
2. 把 `super-dev` 作为工作流对比样本纳入 `reference/`

等完成对比后，再决定当前 workflow 是否需要收敛、替换部分机制，或继续保持现有契约不变。
