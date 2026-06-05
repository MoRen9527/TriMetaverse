# R&D Workflow Host Integration

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/workflow-host-integration.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-03

## 1. 目标

本文件定义研发工作流的宿主如何把执行结果自动落盘到 `docs/runs/`。

作用域说明：

- 本文件只讨论研发工作流的宿主输出契约与切换边界，不再把研发工作流单列为 `Development Main Controller` 标准名。
- 它不定义赛博公司经营主工作流的角色结构，但会说明研发工作流如何与 `TriMC`、`TriHost` 和 PC 端软件协同。
- 当前 shadow 与当前阶段正式接管都先直接跑在 `copilot chat`，必要时可扩到 `copilot cli`；到 `TriMetaverse V1 正式上线切换阶段`，正式切换通过 `TriHost` 配置完成，而 `TriMC` 保持 agent 运行和交互核心。

本文件解决三类问题：

1. 当前宿主与切换后正式宿主分别是谁，以及优先顺序如何落地。
2. 宿主最少需要生成哪些文件，按什么顺序生成。
3. 如何让 `phaseResultRef`、`runId` 与宿主真实输出保持一致。
4. 宿主如何恢复未完成 run，以及如何处理确认门。

## 2. 宿主边界

当前试运行边界：

- 当前宿主：`copilot chat`
- 当前可扩展宿主：`copilot cli`
- 当前优先级：第一宿主，先用于让研发工作流在当前环境实际生效
- 当前状态：仓库内允许存在 documentation-backed 结构化 run 样例，用于验证目录规范与引用链
- 当前 machine-readable host id 统一使用 `copilot-chat`，若扩展到 CLI 则使用 `copilot-cli`

TriMetaverse V1 正式上线切换阶段边界：

- agent 运行与交互核心：`TriMC`
- 宿主适配与切换配置层：`TriHost`
- PC 端软件：`TriPilot + Tride + vscodium + CLI`（`copilot cli`、`opencode`、`claude code`、`codex`）
- 切换原则：保留当前已验证的输出契约与 machine-readable 资产，通过 `TriHost` 配置宿主与模型调用，而不是把研发工作流正式迁入 `Tride`

2026.04.22 14:31 修改备注：`Tride` 不再作为切换后的正式宿主，仅与 `TriPilot` 和 `vscodium` 集成为 PC 端软件层的一部分，并配合 `TriLC` 完成本地化任务和部分由服务域下发的任务。该层同时保留用户直接使用桌面自动化、PC 软件自动化与 `vibe coding` 的工具入口语义。执行工具统一视为 PC 端软件的一部分：`copilot cli`、`opencode`、`claude code`、`codex`。

说明：

- 研发工作流不再单列为三主控中的一条；它属于 `TriMC` 统一运行面里的研发执行切片。
- `TriMC` 是 agent 运行和交互核心，负责 runtime、planner、context 整理、tools 编排与模型调用协同。
- `TriHost` 负责统一宿主适配 contract，让同一套工作流输出契约可以在 `copilot chat`、`copilot cli` 以及后续宿主间平滑切换。
- `Tride` 不再承担正式宿主角色，而是 PC 端软件中的开发工具与集成层；该层既配合 `TriLC` 承接本地化任务，也可直接作为用户自用自动化和 `vibe coding` 的工作台。
- 不要把“当前在 `copilot chat` 跑通 shadow 与正式接管”误写成“`TriMC` 已完成正式切换”或“`TriHost` 已经落地实现”。

## 2.1 宿主优先顺序

当前执行顺序必须区分为两层：

1. 先在 `copilot chat` 中把研发工作流跑通，验证当前宿主的真实可执行性
2. 如有必要，把同一条当前宿主路径扩到 `copilot cli`
3. 到 `TriMetaverse V1 正式上线切换阶段`，再把已经稳定的宿主协议与 machine-readable 资产交给 `TriHost` 管理配置，并接入以 `TriMC` 为核心的正式运行面

这意味着当前阶段不应该为了切换后正式宿主而跳过现有宿主落地。

`TriHost` 的目标是把宿主切换与调用配置从工作流语义中抽离出来；`Tride` 的目标则是继续作为 PC 端开发工具层，而不是替代当前这一步对 Copilot 宿主的现实验证。

## 3. 宿主输出责任

研发工作流宿主最少应自动生成以下产物：

1. `docs/runs/<run-id>/run-metadata.json`
2. 根阶段 `PhaseResult`
3. 分支阶段 `PhaseResult`
4. `workflow-summary.md`
5. `delivery-manifest.json`
6. `delivery-report.md`
7. `artifacts/release.zip` 或同等交付占位产物

宿主不应只生成自然语言总结，而应优先保证结构化 JSON 先落盘。

在当前阶段，若当前 Copilot 宿主无法完整自动生成全部产物，也应先把最小 machine-readable 入口跑通，再逐步补齐切换阶段交给 `TriHost` 和 `TriMC` 协同承接所需的正式宿主能力。

## 4. 自动落盘顺序

建议顺序：

1. run 开始时创建 `run-metadata.json`
2. `DISCOVERY` 完成后写 `DISCOVERY.phase-result.json`
3. `INTELLIGENCE` 完成后写 `INTELLIGENCE.phase-result.json`
4. 每个 `branchId` 在首次进入分支阶段时创建目录
5. 每个分支阶段结束后更新对应 `<PHASE>.phase-result.json`
6. `DELIVERY` 前生成 `delivery-manifest.json` 草稿
7. `DELIVERY` 完成后更新 `DELIVERY.phase-result.json`、`delivery-report.md`、`workflow-summary.md`
8. run 结束后把 `run-metadata.json.status` 置为最终状态

## 5. 写入规则

- 使用 `docs/runs/README.md` 中定义的稳定目录布局。
- `runId` 必须与目录名一致。
- `branchId` 必须与分支目录名一致。
- 写入策略推荐为原子替换，不做半写入文件。
- 已完成 run 默认只允许补充派生汇总，不应改写历史阶段结果语义。

## 6. `run-metadata.json`

`run-metadata.json` 是宿主自动落盘的最小入口文件。

它至少应表达：

- `runId`
- `controller`
- `host`
- `generationMode`
- `status`
- `startedAt`
- `updatedAt`
- `mode`

结构定义见：`workflow-run-metadata.schema.json`

## 6.1 宿主运行状态与确认门状态

除 `run-metadata.json` 外，宿主还应维护两类 machine-readable 状态：

1. `workflow-host-run-state.schema.json`
2. `workflow-host-review-state.schema.json`

它们分别解决：

- 当前宿主如何知道 run 现在卡在哪
- 当前宿主如何知道哪一个确认门仍未通过

这两类状态不替代 `PhaseResult`，而是补足宿主恢复、继续和确认门处理所需的最小执行上下文。

## 6.2 当前第一宿主的最小可运行要求

在 `copilot chat` 中，最少应先做到：

1. 能识别当前 `runId`
2. 能识别当前 `phase`
3. 能识别当前是否处于 `docs_confirm` 或 `preview_confirm`
4. 能把当前 run 的结构化输出稳定写入 `docs/runs/`

即使这些能力会在 `TriMetaverse V1 正式上线切换阶段` 迁入 `TriHost` 配置下的正式运行面，当前第一宿主也必须先跑通这条最小闭环；若后续扩到 `copilot cli`，也应复用同一套最小状态语义。

## 6.3 恢复协议

宿主应提供等价于以下语义的恢复动作：

1. `start`：启动新 run
2. `resume`：恢复未完成 run
3. `continue`：继续当前 run 的当前阶段
4. `next`：返回当前唯一推荐的下一步

若宿主打开新会话时检测到 unfinished run 或 pending review state，应优先进入恢复路径，而不是退回普通聊天。

## 6.4 确认门协议

当前建议明确支持以下宿主确认门：

1. `docs_confirm`
2. `preview_confirm`

说明：

- `docs_confirm` 用于卡住三文档或等价上游设计资产的确认
- `preview_confirm` 用于卡住前端预览确认，避免过早沉入后端与交付

这两类 gate 是宿主交互门，不替代现有人工审核、版本签发和质量门禁。

## 7. 与样例 run 的关系

- `docs/runs/run-2026-04-cycle-01/` 是当前第一份结构化 run 样例。
- 它的用途是验证目录、schema 和 `phaseResultRef` 引用链。
- 它当前对应的第一宿主语境是 `copilot chat`，样例中的 host id 统一使用 `copilot-chat`。
- 后续宿主自动生成时，应复用同一目录规范，而不是另起一套输出布局。

## 8. 与 TriMC 和 TriHost 的衔接

到 `TriMetaverse V1 正式上线切换阶段` 接入 `TriMC + TriHost` 时，建议把以下能力视为最小闭环：

1. 宿主接收一次 workflow 执行请求并生成 `runId`
2. 宿主按阶段写入 `run-metadata.json` 和 `PhaseResult`
3. 宿主在 `delivery-manifest.json` 中输出全部产物索引
4. 宿主把 `phaseResultRef` 所需路径暴露给经营对象层使用
5. 宿主维护 run-state 与 review-state
6. 宿主支持 `resume / continue / next` 恢复语义
7. 宿主支持 `docs_confirm` 与 `preview_confirm` 两类确认门

当前缺口：

- `TriHost` 仓库里尚未看到专门的宿主适配 contract 或配置协议文件
- `TriSkill` 当前还是未来统一 skill 模块的占位，尚未承接 workflow skill contract
- 当前仍以 TriMetaverse 文档层先定义契约，并通过 `copilot chat` 维持 shadow 与当前阶段正式接管

## 9. 当前结论

到这一步，研发工作流的宿主自动落盘不再只是“以后再说”，而是已经具备：

- 稳定目录规范
- 结构化 run 样例
- 宿主输出责任与写入顺序
- `run-metadata.json` 机器可读入口

下一步最自然的是：

1. 先让 `copilot chat` 跑通当前第一宿主的最小闭环，必要时补到 `copilot cli`
2. 让 `TriHost` 定义宿主切换 contract，并明确 `copilot` 如何作为正式切换前的模拟主控调用模型
3. 让 `TriMC` 作为统一 agent runtime 承接正式运行面，同时保留 PC 端软件的开发工具协同能力
4. 继续把宿主写入策略、执行事件与 skill contract 结构化成 machine-readable 资产
