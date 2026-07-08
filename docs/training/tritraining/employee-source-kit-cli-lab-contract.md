# Employee Source Kit CLI Lab Contract

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-source-kit-cli-lab-contract.md
- syncMode: published-copy
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合 lab contract 副本

## 1. Contract 身份

- `contractType`: `lab`
- `courseId`: `tritraining-cli-001`
- `labId`: `employee-source-kit-cli-guided-lab`
- `title`: `Employee Source Kit CLI Guided Lab`
- `objective`: 让学习者从 help -> validate MVP -> 调用链 -> generate -> 故障注入 -> 工作流回连，完整跑通一次 CLI 学习闭环。
- `executionMode`: `guided-local + manual-capture`
- `estimatedMinutes`: `45-75`

## 2. 先修要求

1. 已完成对应 lesson 阅读。
2. 已知道 `employee_source_kit` 的最小角色定位。
3. 已理解当前实验优先在本地或临时目录运行，不默认写成远端沙箱已落地。

## 3. Step Contracts

### 3.1 step-01-help-surface

- 目标：看清命令面。
- 动作：运行三条 `--help`。
- 输出：记录有哪些子命令、哪些参数只属于 `generate`。

### 3.2 step-02-validate-mvp

- 目标：跑最小无副作用路径。
- 动作：执行 `validate --employee-id rd-trainer`。
- 输出：记录输入、处理、输出、验证四行摘要。

### 3.3 step-03-call-chain

- 目标：写出最小调用链。
- 动作：阅读入口与业务函数。
- 输出：最小调用链文字版。

### 3.4 step-04-generate-temp

- 目标：在临时目录执行一次 `generate`。
- 动作：生成一套新的 source kit。
- 输出：五件套路径 + 一段解释为什么生成后还要自动 `validate`。

### 3.5 step-05-boundary-failure

- 目标：故意制造越界错误。
- 动作：向 `memory.md` 注入消费记录标记，再执行 `validate`。
- 输出：错误结果 + 为什么被判越界。

### 3.6 step-06-workflow-link

- 目标：把 source kit 放回完整工作流。
- 动作：写出 source -> binding -> support -> live 的链条。
- 输出：一条完整工作流链与每层职责解释。

## 4. `TriAvatar` 前端实验页 contract

当前建议 `TriAvatar` 的实验页至少承接：

1. `labId`
2. `title`
3. `objective`
4. `stepContracts`
5. `expectedOutputs`
6. `reflectionPrompts`
7. `completionState`
8. `reviewSummary`

## 5. `TriStaciss` 后端接口 contract

当前建议 `TriStaciss` 的 lab submission API 至少承接：

1. `labId`
2. `stepId`
3. `learnerId` 或等价 session 标识
4. `observedOutput`
5. `exitCode`
6. `reflectionAnswer`
7. `attachments` 或等价 evidence refs
8. `reviewState`

## 6. CodeGraph 目标字段

当前 lab 如目标模块已有可用 `CodeGraph`，建议实验页预置：

1. 入口定位目标
2. 调用链定位目标
3. 发布链定位目标
4. 若无索引则显式显示 “当前无可用 CodeGraph / parser 不覆盖”

## 7. 助教评分 rubric

当前最小评分维度为：

1. 是否能正确描述命令面
2. 是否能解释为什么 `validate` 是 MVP
3. 是否能写出正确的最小调用链
4. 是否能解释一次越界错误
5. 是否能把 CLI 放回完整工作流

## 8. 当前不写成已完成的事项

1. 不写成远端沙箱已实现。
2. 不写成自动评分已实现。
3. 不写成实验记录系统已接入正式用户体系。

## 9. 来源线索

1. `TriTraining/docs/training/employee-source-kit-cli-lab-manual.md`
2. `TriCompany/docs/training/LearningToPractice/CLI/employee-source-kit-cli-lab-manual.md`
3. `TriCompany/runtime/cognition/employee_source_kit.py`

## 10. 当前后端样板

当前 `TriStaciss` 实验提交接口字段样板见：

1. `TriTraining/docs/training/employee-source-kit-cli-tristaciss-lab-submission.example.json`
