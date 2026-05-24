# docs/runs 目录规范

## 1. 目标

本文件定义 `docs/runs/` 下真实执行记录与结构化 `PhaseResult` 产物的稳定目录约定。

本文件解决三类问题：

1. 哪些文件属于人工回填执行日志，哪些文件属于主流程稳定产物。
2. `phaseResultRef` 应该指向什么路径，不能指向什么路径。
3. `runId`、`branchId` 与 `PhaseResult` 文件如何在目录中保持一一对应。

## 2. 两类 run 资产

`docs/runs/` 允许同时存在两类资产：

- 人工回填执行日志：例如 `run-R04-2026-03-03-0025.md`
- 结构化执行产物目录：例如 `run-2026-04-cycle-01/`

二者都可保留，但用途不同：

- 人工回填执行日志用于记录计划、开发、验证、提交、周会与复盘过程。
- 结构化执行产物目录用于承载主控流程与分支流程产生的稳定 `PhaseResult`、交付清单与汇总文件。

`phaseResultRef` 只能引用第二类结构化执行产物目录中的 JSON 文件，不能引用 `run-R*.md` 这类人工回填日志。

## 3. 命名规则

### 3.1 `runId`

- `runId` 必须与 `docs/runs/<runId>/` 目录名保持完全一致。
- 推荐格式：`run-<date-or-cycle>-<slug>`。
- 示例：`run-2026-04-cycle-01`

### 3.2 `branchId`

- `branchId` 必须与 `docs/runs/<runId>/<branchId>/` 目录名保持完全一致。
- `branchId` 由 `INTELLIGENCE` 产出的 PRD 分支标识决定。
- 示例：`branch-prd-ai-content-trial`

### 3.3 `PhaseResult` 文件名

- `PhaseResult` 文件名统一为 `<PHASE>.phase-result.json`
- `PHASE` 必须使用 `phase-result.schema.json` 中定义的大写阶段名。

示例：

- `DISCOVERY.phase-result.json`
- `INTELLIGENCE.phase-result.json`
- `CODING.phase-result.json`
- `DELIVERY.phase-result.json`

## 4. 标准目录布局

结构化执行产物目录采用以下稳定布局：

```text
docs/runs/
  run-2026-04-cycle-01/
    DISCOVERY.phase-result.json
    INTELLIGENCE.phase-result.json
    DELIVERY.phase-result.json
    workflow-summary.md
    delivery-manifest.json
    delivery-report.md
    artifacts/
      release.zip
    branch-prd-ai-content-trial/
      DESIGNING.phase-result.json
      CODING.phase-result.json
      VERIFY-INTEGRATION.phase-result.json
      REDTEAM.phase-result.json
      QA.phase-result.json
      DEPLOYMENT.phase-result.json
      ASSURANCE.phase-result.json
```

规则：

- `DISCOVERY`、`INTELLIGENCE`、`DELIVERY` 默认存放在 `docs/runs/<runId>/` 根层。
- 分支阶段 `DESIGNING`、`CODING`、`VERIFY-INTEGRATION`、`REDTEAM`、`QA`、`DEPLOYMENT`、`ASSURANCE` 必须存放在对应 `branchId` 子目录。
- `workflow-summary.md`、`delivery-manifest.json`、`delivery-report.md` 作为整轮聚合产物存放在 `docs/runs/<runId>/` 根层。

## 5. `phaseResultRef` 规则

经营对象中的 `workflowRefs[].phaseResultRef` 必须满足以下要求：

1. 使用仓库根相对路径，且以 `docs/runs/` 开头。
2. 只指向 `.phase-result.json` 文件，不指向 Markdown 日志、清单模板或其他说明文件。
3. 若 `phase` 属于分支阶段，则路径中必须包含 `branchId` 子目录。
4. 若 `phase` 属于 `DISCOVERY`、`INTELLIGENCE` 或 `DELIVERY`，默认指向 run 根层文件。

示例：

- `docs/runs/run-2026-04-cycle-01/INTELLIGENCE.phase-result.json`
- `docs/runs/run-2026-04-cycle-01/branch-prd-ai-content-trial/CODING.phase-result.json`

以下引用视为非标准：

- `docs/runs/run-R04-2026-03-03-0025.md`
- `docs/runs/run-2026-04-cycle-01/workflow-summary.md`
- `docs/runs/run-2026-04-cycle-01/branches/PRD001/coding-result.json`

## 6. 与旧日志的并存规则

- 既有 `run-R*.md` 文件继续保留，作为人工执行与周会记录。
- 新的结构化执行产物目录不覆盖也不替代这些日志。
- 若同一轮既有人类执行日志，又有结构化主控产物，应通过正文中的 `runId` 或交叉链接保持对应关系。

## 7. 当前结论

到这一步，`docs/runs/` 已经区分为：

- 可人工回填的执行日志层
- 可被 `phaseResultRef` 稳定引用的结构化产物层

下一步最自然的是：

1. 让研发工作流执行产物按本规范落盘
1. 让更多经营对象独立 schema 吸收 `workflowRefs` 约束
1. 在真实运行样例中补齐 `runId`、`branchId` 与结构化产物目录的对应关系
