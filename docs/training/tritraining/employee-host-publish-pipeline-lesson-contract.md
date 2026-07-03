# Employee Host Publish Pipeline Lesson Contract

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-host-publish-pipeline-lesson-contract.md
- publishedFrom: TriTraining/docs/training/employee-host-publish-pipeline-lesson-contract.md
- syncMode: published-copy
- publishTier: central-training-lesson-contract
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合 lesson contract 副本

## 1. Contract 身份

- `contractType`: `lesson`
- `courseId`: `tritraining-cli-002`
- `lessonId`: `employee-host-publish-pipeline-intro`
- `title`: `Employee Host Publish 发布链：source -> support -> binding`
- `summary`: 把 canonical publish wrapper、support payload 生成、manifest upsert 与 binding profile 写出放到一条真实发布链里讲清楚。
- `audience`: 研发新人、trainer、CTO、CodeRegistry、需要理解宿主对象发布链的技术协作者
- `difficulty`: `intermediate`
- `estimatedMinutes`: `45-65`

## 2. 先修要求

1. 已完成 `Employee Source Kit CLI` 课程或等价理解。
2. 知道 source truth、support payload、runtime state 不是同一个层。
3. 对 `TriCompany`、`TriTraining`、`TriAvatar`、`TriStaciss` 的最小边界有基本认识。

## 3. 学习目标

完成本 lesson 后，学习者至少应能：

1. 解释 `employee_host_publish` 为什么是 canonical wrapper。
2. 解释 `HostObjectSetDefinition` 与 `GeneratedHostObjectSet` 的角色分工。
3. 解释 manifest、binding profile、runtime namespace 的分层必要性。
4. 解释为什么 focused unittest 适合作为发布链的最小学习闭环。
5. 解释为什么当前流程强调“support payload 生成”而不是“live agent 自动启用”。

## 4. 内容块 contract

### 4.1 `overview`

- 目标：先讲结果，告诉学习者 wrapper 最终把哪几类对象串起来。
- 前端展示：hero + summary card
- 关键问题：这一条发布链最终交付的到底是什么？

### 4.2 `theory`

- 目标：解释 wrapper 编排、定义驱动、payload 分层、binding 分层、治理边界。
- 前端展示：concept cards
- 关键问题：为什么 `employee_host_publish` 不能只被理解成“多跑了两个函数”？

### 4.3 `mvp`

- 目标：先跑 focused unittest 作为最小闭环。
- 前端展示：command card + expected output
- 关键问题：为什么本课的 MVP 不是直接刷新 live support root？

### 4.4 `call-chain`

- 目标：把 wrapper 到 generator / binding profile 的最小调用链讲清楚。
- 前端展示：call-chain timeline
- 关键问题：`publish_declared_employee_host_assets(...)` 真正负责哪一层？

### 4.5 `workflow`

- 目标：把 source definition、support payload、binding profile、manifest、workflow 文档放回完整链路。
- 前端展示：workflow diagram card
- 关键问题：为什么 support payload 生成完成后还需要治理回填？

### 4.6 `production-consideration`

- 目标：解释 manifest upsert、display name、live entry status、runtime namespace、not-do 边界和 focused validation。
- 前端展示：risk / quality checklist
- 关键问题：成熟发布链的工程质量体现在哪里？

### 4.7 `reflection`

- 目标：要求学习者复述当前阶段正确边界。
- 前端展示：reflection prompts

## 5. `TriAvatar` 前端承接字段

当前建议 `TriAvatar` 在 lesson 页至少承接：

1. `title`
2. `summary`
3. `audience`
4. `difficulty`
5. `estimatedMinutes`
6. `learningObjectives`
7. `contentBlocks`
8. `labRefs`
9. `completionSignals`

## 6. `TriStaciss` 后端承接字段

当前建议 `TriStaciss` 的 lesson content API 至少返回：

1. `courseId`
2. `lessonId`
3. `version`
4. `contentBlocks`
5. `sourceRefs`
6. `labRefs`
7. `completionSignals`

## 7. CodeGraph 提示字段

若目标模块已有可用 `CodeGraph`，当前 lesson 应显式提供：

1. `employee_host_publish.py` 的入口定位
2. `publish_declared_employee_host_assets(...)` 到 `generate_host_object_set(...)` / `write_host_binding_profiles(...)` 的调用链
3. `host_object_generation.py` 中 `HostObjectSetDefinition`、`GeneratedHostObjectSet`、`_upsert_manifest(...)` 的位置
4. 三个 focused validation 文件的测试锚点

## 8. 完成信号

学习者完成本 lesson 后，至少应交付：

1. 一条 wrapper 到 generator / binding 的最小调用链
2. 一张 object set / manifest / binding profile 关系图
3. 三个当前阶段不能越界承诺的点

## 9. 配套 Lab

对应实验 contract：

- `employee-host-publish-pipeline-lab-contract.md`

## 10. 来源线索

1. `TriTraining/docs/training/employee-host-publish-pipeline-course.md`
2. `TriCompany/runtime/cognition/employee_host_publish.py`
3. `TriCompany/runtime/cognition/host_object_generation.py`
4. `TriCompany/runtime/cognition/employee_host_binding_profile_generation.py`
5. `TriCompany/runtime/cognition/employee_host_publish_validation.py`
6. `TriCompany/runtime/cognition/rd_trainer_host_object_generation_validation.py`
7. `TriCompany/runtime/cognition/employee_host_binding_profile_generation_validation.py`
8. `TriCompany-copilot-host-assets/docs/workflow/host-object-publish-flow.md`

## 11. 当前前端样板

当前 `TriAvatar` 课程页字段样板见：

1. `TriTraining/docs/training/employee-host-publish-pipeline-triavatar-lesson-page.example.json`
