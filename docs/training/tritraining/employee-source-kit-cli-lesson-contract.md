# Employee Source Kit CLI Lesson Contract

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-source-kit-cli-lesson-contract.md
- publishedFrom: TriTraining/docs/training/employee-source-kit-cli-lesson-contract.md
- syncMode: published-copy
- publishTier: central-training-lesson-contract
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合 lesson contract 副本

## 1. Contract 身份

- `contractType`: `lesson`
- `courseId`: `tritraining-cli-001`
- `lessonId`: `employee-source-kit-cli-intro`
- `title`: `Employee Source Kit CLI 从入口到工作流`
- `summary`: 把一个 Python CLI 从 `__main__`、`argparse`、业务函数、校验逻辑一路讲到 source -> binding -> support -> live 工作流。
- `audience`: 研发新人、trainer、CTO、CodeRegistry、需要理解 agent/source/binding 链路的技术协作者
- `difficulty`: `foundation-to-intermediate`
- `estimatedMinutes`: `45-60`

## 2. 先修要求

1. 知道 Python CLI 的最基本调用方式。
2. 知道 source truth 和 runtime state 不是同一个层。
3. 对 `TriCompany`、`TriTraining`、`TriAvatar`、`TriStaciss` 的最小边界有基本认识。

## 3. 学习目标

完成本 lesson 后，学习者至少应能：

1. 解释 `if __name__ == "__main__"` 与 `SystemExit(main())` 的作用。
2. 解释 `argparse`、subparser、业务函数、dataclass 的角色分工。
3. 解释为什么 `employee_source_kit` 不是孤立脚本，而是岗位发布链的一环。
4. 解释 source truth、support payload、runtime state 的分层必要性。
5. 解释为什么现役代码模块默认先用 `CodeGraph` 拆入口和调用链。

## 4. 内容块 contract

### 4.1 `overview`

- 目标：先讲结果，告诉学习者这门课最终在解释什么系统效果。
- 前端展示：hero + summary card
- 关键问题：这个 CLI 最终实现了什么效果？

### 4.2 `theory`

- 目标：解释命令分发、数据建模、source/runtime 分层、契约校验、发布链协作。
- 前端展示：concept cards
- 关键问题：为什么不能把所有逻辑堆进入口？

### 4.3 `mvp`

- 目标：先跑最小 `validate` 路径。
- 前端展示：command card + expected output
- 关键问题：为什么 `validate` 是最小闭环？

### 4.4 `call-chain`

- 目标：把最小调用链讲清楚。
- 前端展示：call-chain timeline
- 关键问题：`__main__ -> main -> parse_args -> validate` 各层分别做什么？

### 4.5 `workflow`

- 目标：把 source kit 放回 source -> binding -> support -> live 的完整链路。
- 前端展示：workflow diagram card
- 关键问题：为什么一份 `.agent.md` 不等于完整 agent 工作流？

### 4.6 `production-consideration`

- 目标：解释覆盖保护、输入规范化、退出码、边界校验和测试。
- 前端展示：risk / quality checklist
- 关键问题：成熟 CLI 的工程质量体现在哪里？

### 4.7 `reflection`

- 目标：要求学习者复述稳定心智模型。
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

1. `employee_source_kit.py` 的入口定位
2. `main()` 到 `generate/validate` 的调用链
3. `knowledge_workspace.py` 中 `normalize_workspace_id(...)` 的位置
4. `employee_host_publish.py` 与 `host_object_generation.py` 的发布链位置

## 8. 完成信号

学习者完成本 lesson 后，至少应交付：

1. 一条最小调用链
2. 一条完整工作流链
3. 三个生产级设计点

## 9. 配套 Lab

对应实验 contract：

- `employee-source-kit-cli-lab-contract.md`

## 10. 来源线索

1. `TriTraining/docs/training/employee-source-kit-cli-course.md`
2. `TriCompany/docs/training/LearningToPractice/CLI/employee-source-kit-cli-course.md`
3. `TriCompany/runtime/cognition/employee_source_kit.py`

## 11. 当前前端样板

当前 `TriAvatar` 课程页字段样板见：

1. `TriTraining/docs/training/employee-source-kit-cli-triavatar-lesson-page.example.json`
