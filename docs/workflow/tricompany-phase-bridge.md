# 经营对象与 PhaseResult 桥接规范

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/tricompany-phase-bridge.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-03

## 1. 目标

本文件定义赛博公司经营对象如何与研发主流程的 `PhaseResult`、`runId`、`branchId` 和 `prdId` 建立可追溯引用。

它解决的问题是：

1. 经营对象如何说明自己引用了哪一轮研发执行。
2. 经营复盘如何回溯到具体阶段结果。
3. 经营判断如何避免脱离研发主流程事实。

## 2. 设计原则

### 2.1 不替代 `PhaseResult`

- `PhaseResult` 仍然是研发主流程的阶段结果真源。
- 经营对象只负责引用，不复制整个阶段结果内容。

### 2.2 统一字段

- 经营对象通过 `workflowRefs` 字段引用研发主流程。
- `workflowRefs` 中的每个元素都应满足 `tricompany-phase-link.schema.json`。

### 2.3 最小必要引用

一期只要求引用以下最小字段：

- `runId`
- `phase`
- 必要时的 `branchId`
- 必要时的 `prdId`
- 可选的 `phaseResultRef`

### 2.4 稳定产物路径

- 若提供 `phaseResultRef`，必须引用 `docs/runs/` 下的结构化 `PhaseResult` JSON 产物。
- `phaseResultRef` 不应指向 `run-R*.md` 这类人工回填执行日志。
- 路径与命名规则以 `../runs/README.md` 为准。

### 2.5 branch-aware docs bootstrap 约定

- 当经营对象通过 `workflowRefs` 绑定某个 PRD 分支，并且该对象会直接驱动、阻断、评估或对外承诺 `DESIGNING -> ASSURANCE` 之间的执行时，除 `runId`、`branchId`、`prdId`、`phaseResultRef` 外，还应优先补充 `docsInitializationRequirements` 与 `docsBootstrapRefs`。
- `docsInitializationRequirements` 用于说明该 PRD 分支进入执行前，`模块五层文档协同系统` 至少应满足哪些条件。
- `docsBootstrapRefs` 用于引用目录样板、文档基线或已存在的模块真源，避免对象只知道引用了哪个分支，却不知道 docs 应该落在哪里。
- 这套约定适用于当前已吸收的 `MVP_DEFINITION`、`BUDGET_CHECK`、`ENGINEERING_TASK`、`SALES_PROGRESS`、`OPERATING_REVIEW`。
- 若 `branchId` 只是 `feature/example-skill`、`feature/example-schedule` 这类功能或宿主试运行分支，而不是 PRD 分支本身，则不默认要求 docs bootstrap 字段；只有当该对象同时负责 docs-backed 的实现落地时，才追加采用。

## 3. `workflowRefs` 字段

建议放在所有经营对象的顶层，与 `evidence` 并列。

### 用途

- 表示这个经营对象来自哪一轮研发流程上下文。
- 表示它依赖、总结、阻断或消费了哪个阶段结果。
- 表示它引用的是哪一个稳定落盘的 `PhaseResult` 产物。

### 关系枚举

| `relation` | 含义 |
| --- | --- |
| `context-from` | 经营对象把该阶段结果作为上下文 |
| `input-to` | 经营对象将成为该阶段输入 |
| `output-of` | 经营对象是在该阶段输出基础上形成的 |
| `summarizes` | 经营对象汇总了该阶段或多阶段结果 |
| `blocks` | 经营对象对该阶段形成阻断或冻结 |
| `depends-on` | 经营对象依赖该阶段先完成 |

## 4. 推荐桥接方式

### 4.1 `BOARD_DIRECTIVE`

- 通常引用 `DISCOVERY` 或 `INTELLIGENCE` 的经营上下文。
- 若当前轮以既有战略状态直接启动，也可以只有 `runId` 级别引用。

### 4.2 `OPERATING_PLAN`

- 至少引用当前轮 `DISCOVERY` / `INTELLIGENCE` 的上下文。
- 若已形成具体 PRD 分支，可加 `branchId` / `prdId`。

### 4.3 `MVP_DEFINITION`

- 推荐引用 `INTELLIGENCE` 或 `DESIGNING`。
- 若产品边界来自特定 PRD，应附带 `prdId`。
- 若该对象会直接触发 PRD 分支启动，建议同时带上 `docsInitializationRequirements` 与 `docsBootstrapRefs`，明确分支进入 `DESIGNING` 前的 docs bootstrap 前置条件。

### 4.4 `BUDGET_CHECK`

- 推荐引用 `MVP_DEFINITION` 对应的 `INTELLIGENCE` / `DESIGNING` 背景。
- 当预算冻结影响实现时，可增加 `blocks -> CODING` 等关系。
- 若预算判断会决定某个 PRD 分支能否正式进入 `DESIGNING` / `CODING`，建议同步带上 docs bootstrap 条件，避免预算判断与 docs readiness 脱节。

### 4.5 `ENGINEERING_TASK`

- 通常作为 `CODING` / `VERIFY-INTEGRATION` 的经营层前置对象。
- 推荐至少带上 `runId`、`branchId`、`prdId`。
- 若对象承担 PRD 分支启动或首次实现落地职责，应默认显式带上 `docsInitializationRequirements` 与 `docsBootstrapRefs`。

### 4.6 `SALES_PROGRESS`

- 推荐引用 `DELIVERY` 前后阶段，或引用其所依赖的 `MVP_DEFINITION` / `ENGINEERING_TASK` 所绑定的阶段链。
- 若对象中的对外承诺依赖某个 PRD 分支的交付 readiness，建议显式带上 docs bootstrap 条件，确保销售话术能回连 `docs/product/` 与 `docs/engineering/` 真源。

### 4.7 `OPERATING_REVIEW`

- 最适合使用 `summarizes`。
- 建议直接汇总本轮关键阶段，如 `INTELLIGENCE`、`CODING`、`VERIFY-INTEGRATION`、`DELIVERY`。
- 若复盘面向 PRD 分支执行质量，建议同时检查 execution 阶段目录、workflow 入口与 registry 回写是否完成，并用 docs bootstrap 字段把这类检查显式写入对象。

### 4.8 `SKILL_SPEC` / `SCHEDULE_SPEC`

- 这两类对象中的 `branchId` 可以是功能、技能或宿主试运行分支，不默认等同于 PRD 分支。
- 因此它们不自动继承 PRD 分支的 docs bootstrap 硬要求。
- 只有当某个技能或调度对象直接治理 docs-backed 的实现链，并且其 `branchId` 实际指向具体 PRD 分支时，才建议补充 `docsInitializationRequirements` 与 `docsBootstrapRefs`。

## 5. 样例

### 5.1 经营任务引用研发分支

```json
{
  "workflowRefs": [
    {
      "relation": "input-to",
      "phase": "CODING",
      "runId": "run-2026-04-cycle-01",
      "branchId": "branch-prd-ai-content-trial",
      "prdId": "PRD-AI-CONTENT-TRIAL",
      "phaseResultRef": "docs/runs/run-2026-04-cycle-01/branch-prd-ai-content-trial/CODING.phase-result.json",
      "note": "该经营对象为编码阶段提供经营边界与执行目标"
    }
  ]
}
```

### 5.2 经营复盘汇总多个阶段

```json
{
  "workflowRefs": [
    {
      "relation": "summarizes",
      "phase": "INTELLIGENCE",
      "runId": "run-2026-04-cycle-01",
      "branchId": "branch-prd-ai-content-trial",
      "prdId": "PRD-AI-CONTENT-TRIAL"
    },
    {
      "relation": "summarizes",
      "phase": "DELIVERY",
      "runId": "run-2026-04-cycle-01",
      "branchId": "branch-prd-ai-content-trial",
      "prdId": "PRD-AI-CONTENT-TRIAL"
    }
  ]
}
```

## 6. 当前结论

到这一步，经营对象已经不再只是通过自然语言“提到”研发主流程，而是可以通过统一桥接字段引用具体执行轮次和阶段；对 branch-aware 的高频经营对象，也已经补入 `模块五层文档协同系统` 的 docs bootstrap 约定。

下一步最自然的是：

1. 在更多经营对象样例中持续补齐 `workflowRefs`
2. 让研发工作流执行结果按 `docs/runs/` 规范稳定落盘
3. 仅在新的 branch-aware 对象真正需要治理 PRD 分支 docs readiness 时，再继续吸收 `docsInitializationRequirements` 与 `docsBootstrapRefs`
