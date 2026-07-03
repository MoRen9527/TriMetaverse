# TriTraining 培训讲义包

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/README.md
- publishedFrom: TriTraining/docs/training/README.md
- syncMode: published-summary
- publishTier: release-side-summary
- lastSyncedAt: 2026-06-14

## 1. 课程包定位

本目录当前用于承接中央 training 聚合面下的 `TriTraining` 模块培训讲义包。

当前文件只承担 TriMetaverse 中央 training 聚合面下的 `TriTraining` 培训包入口与摘要职责。`TriTraining` 模块自己的 training 真源已位于 `TriTraining/docs/training/README.md`；本页用于中央聚合、入口导航和跨模块培训引用，不作为模块 training 主真源。

当前边界采用“三层协作”理解：

1. `TriTraining/docs/training/`：负责 `TriTraining` 模块自己的 training 内容；是否作为当前阶段的 training 真源产生面，由 `CPO` / `CTO` 联审评估。
2. `TriAvatar + TriStaciss`：分别配合承接培训学院的 Web 前端入口和 API / 后端 / 沙箱协作面。
3. `TriMetaverse/docs/training/tritraining/`：只负责中央聚合面下的模块 training 包入口，与同级 `tricompany/` 作用相同。

当前 `TriMetaverse/docs/training/tritraining/` 不是全局 training 根目录的替代品，也不是模块真源或宿主支撑包；它只是中央聚合面下的 `TriTraining` 模块 training 包。

当前如果仍出现“Phase A / Web 优先切片 / 分阶段落地”这类表述，只描述培训学院当前的落地节奏，不改变 `TriTraining` 作为正式模块命名和主要实现承接面的边界。

## 2. 当前前后端承接关系

- 前端入口：`TriAvatar`
- 后端与沙箱：`TriStaciss`
- 当前 trainer 角色启用：`TriCompany / RAndDTrainer`
- 平台产品与架构真源：`TriMetaverse/docs/product/tritraining-platform-concept.md` 与 `TriMetaverse/docs/engineering/tritraining-platform-architecture.md`

当前讲义包先服务 Web 优先的 Phase A 培训学院切片；这描述的是当前落地节奏，不改变 `TriTraining` 作为培训学院主承载模块的命名与实现归属。现有课程正文若仍带有从 `TriCompany` 抽出的历史 `publishedFrom` 痕迹，属于迁移中的内容来源说明；后续应逐步回链到 `TriTraining/docs/training/`。

## 3. 首批课程

1. [Employee Source Kit CLI 从入口到工作流正式课程](./employee-source-kit-cli-course.md)
2. [Employee Source Kit CLI 实验手册](./employee-source-kit-cli-lab-manual.md)
3. [Employee Host Publish 发布链课程：source -> support -> binding](./employee-host-publish-pipeline-course.md)
4. [Employee Host Publish 发布链实验手册](./employee-host-publish-pipeline-lab-manual.md)

## 3.1 课程配套 contract

1. [TriTraining Lesson / Lab Contract 基线](./tritraining-lesson-lab-contract-baseline.md)
2. [Employee Source Kit CLI Lesson Contract](./employee-source-kit-cli-lesson-contract.md)
3. [Employee Source Kit CLI Lab Contract](./employee-source-kit-cli-lab-contract.md)
4. [Employee Host Publish Pipeline Lesson Contract](./employee-host-publish-pipeline-lesson-contract.md)
5. [Employee Host Publish Pipeline Lab Contract](./employee-host-publish-pipeline-lab-contract.md)

## 3.2 课程体系与迁移

1. [TriTraining AI 课程图谱](./tritraining-ai-course-graph.md)
2. [TriMetaverse 专题课程体系架构](./tritraining-trimetaverse-curriculum-architecture.md)
3. [TriTraining 课程包迁移计划](./training-pack-migration-plan.md)

## 3.3 前后端样板

1. [TriTraining AI 课程图谱](./tritraining-ai-course-graph.md)
2. [TriMetaverse 专题课程体系架构](./tritraining-trimetaverse-curriculum-architecture.md)
3. [TriAvatar Lesson Page JSON 样板](./employee-source-kit-cli-triavatar-lesson-page.example.json)
4. [TriStaciss Lab Submission JSON 样板](./employee-source-kit-cli-tristaciss-lab-submission.example.json)
5. [Employee Host Publish TriAvatar Lesson Page JSON 样板](./employee-host-publish-pipeline-triavatar-lesson-page.example.json)
6. [Employee Host Publish TriStaciss Lab Submission JSON 样板](./employee-host-publish-pipeline-tristaciss-lab-submission.example.json)

## 4. 当前课程包使用边界

1. 本包与同级 `TriMetaverse/docs/training/tricompany/` 作用相同，都是中央聚合面下的模块 training 包。
2. 本包不替代 `TriTraining/docs/training/`、`tmv-whitepaper.md`、`project.md`、`tricompany.md`、模块 `AGENTS.md`、模块 `README.md`、模块 `docs/registry/` 或真实源码。
3. 宿主侧若需要 published copy，应按真源发布链进入对应 host assets，例如 `TriTraining-copilot-host-assets`，而不是把本目录当作宿主支撑包。
4. 当前不得因为已有课程包就把培训学院整体落地状态写成既成完成；但 `TriTraining` 的模块命名和主要实现归属不再按临时候选目录处理。

## 5. 代码阅读规则

本包中的代码导读与 CLI 课程默认遵循以下规则：

1. 对现役代码模块做入口、调用链、依赖和变更热区摸底时，优先使用 `CodeGraph`。
2. `CodeGraph` 用于先识别结构，再进入定点源码阅读，而不是替代源码阅读本身。
3. 若模块当前属于低成熟 / 占位 / parser 不覆盖面，应明确写出 CodeGraph 缺口，而不是假装已完成语义索引。
4. `CodeGraph` 结论仍需由对应 `CodeRegistry` 和课程编写者做人类收口。

## 6. 下一步

1. 继续补 `source -> publish -> live -> runtime` 的工作流总览课程。
2. 基于当前两门 CLI / workflow 课程，继续扩展统一 lesson envelope 与 lab submission envelope。
3. 沿 `tritraining-ai-course-graph.md` 与 `tritraining-trimetaverse-curriculum-architecture.md`，把后续 project-run 小课继续挂接到统一课程图谱。
4. 继续为其他方向课程簇补第一批可发布课程，不急于一次写满。
