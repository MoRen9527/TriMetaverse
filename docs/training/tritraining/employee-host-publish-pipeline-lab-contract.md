# Employee Host Publish Pipeline Lab Contract

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-host-publish-pipeline-lab-contract.md
- syncMode: published-copy
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合 lab contract 副本

## 1. Contract 身份

- `contractType`: `lab`
- `courseId`: `tritraining-cli-002`
- `labId`: `employee-host-publish-pipeline-guided-lab`
- `title`: `Employee Host Publish Pipeline Guided Lab`
- `objective`: 让学习者从 help -> focused validation -> 调用链 -> 产物关系图 -> wrapper/split command 对比 -> 治理边界，完整跑通一次发布链学习闭环。
- `executionMode`: `guided-local + manual-capture`
- `estimatedMinutes`: `50-80`

## 2. 先修要求

1. 已完成对应 lesson 阅读。
2. 已知道 `employee_host_publish` 的最小角色定位。
3. 已理解当前实验优先验证聚焦测试与结构边界，不默认写成 live support root 正式刷新。

## 3. Step Contracts

### 3.1 step-01-help-surface

- 目标：看清命令面。
- 动作：运行三条 `--help`。
- 输出：记录 wrapper 与两个 split command 各自负责什么。

### 3.2 step-02-focused-validation

- 目标：跑最小安全闭环。
- 动作：执行三组 focused unittest。
- 输出：记录哪些断言覆盖了 manifest、binding profile、display name、runtime namespace 与 live entry status。

### 3.3 step-03-call-chain

- 目标：写出最小调用链。
- 动作：阅读入口与编排函数。
- 输出：wrapper -> generator / binding 的最小调用链文字版。

### 3.4 step-04-artefact-map

- 目标：把 object set、workspace README、manifest、binding profile 的关系画出来。
- 动作：结合源码和测试断言梳理产物结构。
- 输出：一张 artefact map 或等价文字说明。

### 3.5 step-05-wrapper-vs-split

- 目标：明确 canonical wrapper 与 split command 的职责边界。
- 动作：对比 `employee_host_publish`、`employee_host_object_generation`、`employee_host_binding_profile_generation`。
- 输出：三者职责分工表。

### 3.6 step-06-governance-boundary

- 目标：写出当前阶段明确不承诺的边界。
- 动作：回看 workflow 文档中的 not-do 与治理说明。
- 输出：至少三条不能越界承诺的结论。

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

1. wrapper 入口定位目标
2. definition / generator / binding profile 关键对象定位目标
3. manifest upsert 与 runtime namespace 生成点定位目标
4. 若无索引则显式显示 “当前无可用 CodeGraph / parser 不覆盖”

## 7. 助教评分 rubric

当前最小评分维度为：

1. 是否能正确描述三个命令面的差异
2. 是否能解释为什么 focused unittest 是安全 MVP
3. 是否能写出正确的最小调用链
4. 是否能讲清 object set / manifest / binding profile 关系
5. 是否能说清当前阶段不做项

## 8. 当前不写成已完成的事项

1. 不写成 live discovery 已自动更新。
2. 不写成 support payload 生成等于 TriMC 服务器正式版上线。
3. 不写成 runtime state 已被自动填充。

## 9. 来源线索

1. `TriTraining/docs/training/employee-host-publish-pipeline-lab-manual.md`
2. `TriCompany/runtime/cognition/employee_host_publish.py`
3. `TriCompany/runtime/cognition/host_object_generation.py`
4. `TriCompany/runtime/cognition/employee_host_binding_profile_generation.py`
5. `TriCompany-copilot-host-assets/docs/workflow/host-object-publish-flow.md`

## 10. 当前后端样板

当前 `TriStaciss` 实验提交接口字段样板见：

1. `TriTraining/docs/training/employee-host-publish-pipeline-tristaciss-lab-submission.example.json`
