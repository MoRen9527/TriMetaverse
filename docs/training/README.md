# TriMetaverse Training 索引

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/training/README.md
- syncMode: source-only
- lastSyncedAt: 2026-06-14

- 当前状态：当前为中央 training 索引、聚合与治理摘要仓。
- 本目录用于承接岗位、模块、代码和流程导读的中央聚合面，不替代各模块 source truth，也不替代培训学院平台产品真源。

当前文件是 TriMetaverse 中央 training 聚合目录的本地索引真源，只负责 training 聚合入口、目录分工和使用边界；它不替代各模块 `docs/training/` 真源，也不承担 TriCompany 公司级 workflow 书面真源职责。

## 已启用专题

- [TriCompany 培训讲义包](./tricompany/README.md)
- [TriTraining 培训讲义包](./tritraining/README.md)

## TriTraining 发布侧摘要

以下页面用于承接 TriTraining 课程与 contract 的中央发布侧摘要：

1. [Employee Source Kit CLI 从入口到工作流](./employee-source-kit-cli-course.md)
2. [Employee Host Publish 发布链：source -> support -> binding](./employee-host-publish-pipeline-course.md)
3. [Employee Source Kit CLI Lesson Contract](./employee-source-kit-cli-lesson-contract.md)
4. [Employee Source Kit CLI Lab Contract](./employee-source-kit-cli-lab-contract.md)
5. [Employee Host Publish Pipeline Lesson Contract](./employee-host-publish-pipeline-lesson-contract.md)
6. [Employee Host Publish Pipeline Lab Contract](./employee-host-publish-pipeline-lab-contract.md)
7. [Employee Source Kit CLI 实验手册](./employee-source-kit-cli-lab-manual.md)
8. [Employee Host Publish 发布链实验手册](./employee-host-publish-pipeline-lab-manual.md)
9. [TriTraining AI 课程图谱](./tritraining-ai-course-graph.md)
10. [TriMetaverse 专题课程体系架构](./tritraining-trimetaverse-curriculum-architecture.md)
11. [TriTraining 课程包迁移计划](./training-pack-migration-plan.md)

样板与基线：

1. [TriTraining Lesson / Lab Contract 基线](./tritraining/tritraining-lesson-lab-contract-baseline.md)
2. [Employee Source Kit CLI TriAvatar Lesson Page 样板](./tritraining/employee-source-kit-cli-triavatar-lesson-page.example.json)
3. [Employee Source Kit CLI TriStaciss Lab Submission 样板](./tritraining/employee-source-kit-cli-tristaciss-lab-submission.example.json)
4. [Employee Host Publish Pipeline TriAvatar Lesson Page 样板](./tritraining/employee-host-publish-pipeline-triavatar-lesson-page.example.json)
5. [Employee Host Publish Pipeline TriStaciss Lab Submission 样板](./tritraining/employee-host-publish-pipeline-tristaciss-lab-submission.example.json)

## 目录分工

当前 training 目录按三层分工理解：

1. `各模块/docs/training/`：模块自己的 training 真源；默认用于该模块的研发培训、模块导读、代码导读和接手路径。
2. `TriCompany/docs/training/` 与 `TriTraining/docs/training/`：分别负责各自模块的 training 内容；不互相代写，也不直接兼任中央聚合面。
3. `TriMetaverse/docs/training/`：中央 training 聚合面；负责把已经形成的模块 training 包、专题课程包和跨模块导读收口成统一入口。

当前根目录只负责中央索引与聚合；下层目录按模块 / 专题拆分。

- `tricompany/`：TriCompany 模块培训讲义包。
- `tritraining/`：TriTraining 模块培训讲义包。它与 `tricompany/` 作用相同，都是中央 training 聚合面下的模块 training 包入口，不额外承担真源或宿主功能。

## 使用边界

- training 文档负责 onboarding、导读和知识捏合，不替代 `tmv-whitepaper.md`、`project.md`、`tricompany.md`、模块 source docs 或 registry 真源。
- 当 training 文档与上游真源冲突时，以上游真源为准；training 需要回链出处，而不是自创事实。
- 当前培训学院按低耦合理解分工：`TriTraining` 负责主要实现承载，`TriAvatar` 负责前端入口协作，`TriStaciss` 负责后端 / API / 沙箱协作；`TriCompany` 当前只承接本模块 training 内容，由 `RAndDTrainer` 负责产出。若宿主侧需要 published copy，应按真源发布链进入对应 host assets，例如 `TriTraining-copilot-host-assets`。
