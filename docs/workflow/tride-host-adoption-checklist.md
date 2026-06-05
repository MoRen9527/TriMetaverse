# TriHost 宿主适配与 PC 端软件接入清单（历史文件名保留）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/tride-host-adoption-checklist.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-03

## 1. 目的

本文件把前一轮 `TriMetaverse workflow vs super-dev` 对比，收敛成一份可执行的宿主侧改造清单。

目标不是恢复旧的三主控命名，而是明确：

1. 哪些能力应下沉到 `TriHost` 与 PC 端软件
2. 哪些能力必须继续留在 `TriMetaverse/docs/workflow/`
3. 两者之间的接口应该如何定义

## 2. 结论先行

应由 `TriHost` 承接的是“宿主适配与切换配置层”。

应由 PC 端软件承接的是“本地开发工具、用户入口与命令入口”。PC 端软件当前由 `TriPilot + Tride + vscodium + CLI` 组成。

必须继续留在 `TriMetaverse` 的是“流程真源、结构化审计契约与运行产物规范”。

换句话说：

- `TriMetaverse` 定义流程真源、阶段语义、门禁规则、结构化产物规范
- `TriHost` 提供宿主适配、切换配置、run 生命周期入口与宿主状态语义
- PC 端软件提供本地命令入口、知识 bootstrap、证据打包和开发工具协同

## 3. 保留在 TriMetaverse 的能力

以下内容不应迁移出 `TriMetaverse/docs/workflow/`：

1. 研发工作流与 10 阶段主流程定义
2. `PRDBranch` 的创建、并行和聚合语义
3. `DISCOVERY -> INTELLIGENCE -> DESIGNING` 的顺序审核发布链
4. 人工审核、版本签发、版本变更等硬门禁规范
5. `docs/runs/` 的稳定目录布局
6. `phase-result.schema.json`、`workflow-run-metadata.schema.json` 等结构化 schema
7. `phaseResultRef`、`runId`、`branchId` 的稳定引用语义
8. 经营对象与研发产物之间的 `workflowRefs` / `PhaseResult` 桥接规范

原因：

这些能力属于流程真源和审计真源，必须集中维护，不能分散到宿主实现细节中。

## 4. 下沉到 TriHost 和 PC 端软件的能力

以下内容应由 `TriHost` 或它配置下的宿主运行层承接。

### 4.1 run 生命周期入口

需要提供等价于下列语义的宿主入口：

1. `start`：创建新 run，生成 `runId`
2. `resume`：恢复未完成 run
3. `continue`：在当前 run 的当前阶段继续
4. `next`：只返回当前推荐下一步

最低要求：

- 新会话启动时，不默认退回普通聊天
- 先判断是否存在 unfinished run / review state
- 若存在，优先恢复当前 workflow 上下文

### 4.2 宿主 run-state 与 review-state

`TriHost` 需要维护或暴露 machine-readable 的宿主运行状态，而不是只依赖对话历史。

最低要求：

1. 记录当前 `runId`
2. 记录当前 `phase`
3. 记录当前 `branchId`（若处于分支阶段）
4. 记录当前待确认 gate
5. 记录最近一次宿主动作时间
6. 记录当前状态是 `running / waiting-confirmation / blocked / completed`

这层状态不替代 `PhaseResult`，而是补足“宿主如何知道现在卡在哪”。

### 4.3 本地知识 bootstrap

PC 端软件应在进入执行前增加硬 bootstrap。

1. 读取本地知识源
2. 读取已命中的知识 bundle 或等价缓存
3. 把命中的知识作为当前 run 的硬约束注入后续阶段

最低要求：

- 宿主必须知道本轮已读取哪些知识源
- 这些知识命中需要能被写入 run 元信息或附属证据
- 不能只靠“模型记住了”这种隐式状态

### 4.4 双确认门

`TriHost` 应增加两类宿主确认门：

1. `docs_confirm`
2. `preview_confirm`

解释：

- `docs_confirm`：三文档或等价上游设计资产未确认前，不应继续下游实施
- `preview_confirm`：前端预览未确认前，不应默认沉入后端与交付

注意：

这两类 gate 是宿主交互门，不替代 TriMetaverse 已有的人审与版本门禁。

### 4.5 证据打包命令

PC 端软件应提供低摩擦的宿主命令，用来触发证据收集与整理。

建议至少提供：

1. proof-pack 等价动作
2. review summary 等价动作
3. delivery manifest refresh 等价动作

但输出目标仍然是：

- `docs/runs/<runId>/delivery-manifest.json`
- `docs/runs/<runId>/delivery-report.md`
- 以及相关结构化 run 产物

### 4.6 宿主写入器

`TriHost` 配置下的宿主运行层需要实现与 `docs/runs/` 契约兼容的写入器。

最低要求：

1. 原子写入 `run-metadata.json`
2. 原子写入各阶段 `*.phase-result.json`
3. 能为分支阶段自动创建 `branchId` 子目录
4. 能在 run 结束时更新最终状态

## 5. 不下沉到 TriHost 的内容

以下内容不应由 `TriHost` 或 PC 端软件自行定义：

1. 自创新的主阶段集合替换当前 10 阶段
2. 自创新的 `branchId` 规则替换 `INTELLIGENCE` 产出的 PRD 分支
3. 自创新的 delivery 目录布局替换 `docs/runs/README.md`
4. 把 host rules 视为流程真源并覆盖 `docs/workflow/`
5. 把当前人审与版本门禁降级为普通“确认一下”交互

## 6. TriMetaverse 与 TriHost 的接口面

建议接口拆成 4 层。

### 6.1 输入层

由 `TriMetaverse` 提供：

- workflow config
- phase schema
- quality gates
- phase mapping

由 `TriHost` 或它配置下的宿主运行层读取并执行。

### 6.2 运行状态层

由 `TriHost` 维护或暴露：

- 当前 run-state
- review-state
- current gate
- knowledge bootstrap status

### 6.3 输出层

由 `TriHost` 配置下的宿主写入：

- `run-metadata.json`
- `*.phase-result.json`
- `workflow-summary.md`
- `delivery-manifest.json`
- `delivery-report.md`

由 `TriMetaverse` 定义路径和结构。

### 6.4 引用层

由 `TriMetaverse` 消费：

- `phaseResultRef`
- `workflowRefs`
- 经营对象桥接引用

## 7. 建议实现顺序

建议按下列 5 步实施：

1. 由 `TriMetaverse` 先补一份宿主 run-state / review-state schema
2. 在 `workflow-host-integration.md` 中补宿主恢复协议与确认门协议
3. 给 `TriHost` 增加最小 run-state 持久化与 `start/resume/continue/next` 入口
4. 由 `TriHost` 配置下的宿主实现 `docs/runs/` 兼容写入器
5. 最后再接入知识 bootstrap、proof-pack 与 `preview_confirm`

这样做的原因：

- 先把接口写稳
- 再把宿主能力接上
- 避免边写宿主边漂移流程语义

## 8. 验收清单

以下 8 项全部满足，才能认为 `TriHost` 已经接住宿主适配层：

1. 可以启动新 run 并生成稳定 `runId`
2. 可以在新会话恢复未完成 run
3. 可以识别当前 `phase`、`branchId` 和待确认 gate
4. 可以把知识 bootstrap 结果记录为 machine-readable 状态
5. 可以在 `docs_confirm` 和 `preview_confirm` 处阻止流程误推进
6. 可以原子写入 `docs/runs/` 结构化产物
7. 不破坏当前 `phaseResultRef` 与 `workflowRefs` 引用
8. 不改变 `TriMetaverse/docs/workflow/` 作为流程真源的地位

## 9. 当前建议

下一轮最值得先做的不是直接写完整运行层，而是先在 `TriMetaverse` 补两个契约文件：

1. 宿主 run-state / review-state schema
2. `workflow-host-integration.md` 的恢复协议与确认门协议扩展
