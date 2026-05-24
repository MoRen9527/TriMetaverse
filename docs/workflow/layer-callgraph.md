# TMV Workflow 分层与调用关系

## 1. 分层图（按职责）

```mermaid
flowchart TB
  A[方法层<br/>定义“为什么这样做”] --> B[规范层<br/>定义“系统如何判断”]
  B --> C[运行层<br/>定义“系统如何执行”]
  C --> D[运行产物层<br/>每轮证据与交付物]

  A1[wsdd-v1.md] --> A
  B1[workflow-engine-spec.md] --> B
  B2[phase-result.schema.json] --> B
  B3[quality-gates.schema.json] --> B
  C1[workflow-engine-config.yaml<br/>由example复制] --> C
  C2[workflow-runbook.md] --> C
  D1[docs/runs/<run-id>/**/*.phase-result.json] --> D
  D2[docs/runs/<run-id>/workflow-summary.md] --> D
  D3[docs/runs/<run-id>/delivery-manifest.json / delivery-report.md / artifacts/release.zip] --> D
```

## 2. 调用关系图（研发工作流执行时）

```mermaid
flowchart LR
  P[project.md<br/>10阶段流程定义] --> S[workflow-engine-spec.md]
  R[workflow/README.md<br/>资产入口] --> S
  R --> C[workflow-engine-config.yaml]
  R --> RB[workflow-runbook.md]

  S --> PRS[phase-result.schema.json]
  S --> QGS[quality-gates.schema.json]

  C --> E[TriMC 研发执行切片<br/>加载配置]
  S --> E
  PRS --> E
  QGS --> E
  RB --> E

  E --> X[按10阶段主线执行]
  X --> Y[在INTELLIGENCE后按PRD分叉]
  Y --> Y1[分支内串行: DESIGNING->CODING->VERIFY-INTEGRATION->REDTEAM->QA->DEPLOYMENT->ASSURANCE]
  Y1 --> Z[生成PhaseResult(branchId/prdId)并做门禁判定]
  Z --> O[输出run产物与交付产物]
```

## 3. 说明

- 本文档用于结构沟通与执行前对齐。
- 可执行逻辑以 `docs/workflow/` 目录内规范与配置文件为准。
