# TriTraining Lesson / Lab Contract 基线

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/tritraining-lesson-lab-contract-baseline.md
- publishedFrom: TriTraining/docs/training/tritraining-lesson-lab-contract-baseline.md
- syncMode: published-copy
- publishTier: central-training-contract-baseline
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合 contract 基线副本

## 1. 文档定位

本文用于定义 `TriTraining` 在当前 Web 优先 Phase A 中的最小课程 contract 基线。

目标不是现在就写成已实现的 API、页面或数据库，而是先把培训学院需要的课程对象结构钉住，让：

1. `TriCompany` 的 trainer/source-side 课程产出可被抽出。
2. `TriAvatar` 有稳定的前端页面组织字段可用。
3. `TriStaciss` 有稳定的课程 API / lab submission / result contract 可对接。

## 2. 当前边界

当前默认边界是：

1. `TriTraining/docs/training/`：维护培训学院模块自己的课程、contract、实验手册与课程图谱真源。
2. `TriMetaverse/docs/training/tritraining/`：维护中央聚合面下的模块 training 包入口与已发布聚合内容。
3. `TriAvatar`：承接课程页、实验页、进度页和结果页。
4. `TriStaciss`：承接课程内容 API、实验提交 API、结果回写接口和后续沙箱接口。

当前仍不得把这条 contract 直接写成“平台前后端已实现”。

## 3. Lesson Contract 最小字段

每一门可发布课程，至少应具备以下字段：

1. `contractType`
2. `courseId`
3. `lessonId`
4. `title`
5. `summary`
6. `audience`
7. `difficulty`
8. `estimatedMinutes`
9. `prerequisites`
10. `learningObjectives`
11. `contentBlocks`
12. `sourceRefs`
13. `codegraphHints`
14. `completionSignals`
15. `nextLessonRefs`
16. `labRefs`

## 4. Lesson Contract 含义说明

### 4.1 面向 `TriAvatar` 的前端页字段

`TriAvatar` 当前优先关心：

1. 课程标题与摘要
2. 目标用户与难度
3. 学习目标
4. 内容块顺序
5. 页面内 checkpoint
6. 跳转到 lab 的 CTA
7. 课后进度与完成信号

因此 `contentBlocks` 至少应支持：

1. `overview`
2. `theory`
3. `mvp`
4. `call-chain`
5. `workflow`
6. `production-consideration`
7. `reflection`

### 4.2 面向 `TriStaciss` 的后端字段

`TriStaciss` 当前优先关心：

1. lesson 标识
2. 可返回的内容块数组
3. lesson 版本
4. sourceRefs
5. completion signal
6. lab 关联关系

也就是说，后端当前更像是“结构化课程内容服务”，而不是一次性把全部页面逻辑塞进去。

## 5. Lab Contract 最小字段

每一个实验页或练习页，至少应具备以下字段：

1. `contractType`
2. `courseId`
3. `labId`
4. `title`
5. `objective`
6. `executionMode`
7. `estimatedMinutes`
8. `prerequisites`
9. `stepContracts`
10. `submissionEnvelope`
11. `reviewRubric`
12. `sourceRefs`
13. `codegraphTargets`
14. `frontendViewNeeds`
15. `backendApiNeeds`

## 6. Lab Contract 含义说明

### 6.1 面向 `TriAvatar` 的实验页字段

`TriAvatar` 当前优先关心：

1. step 卡片顺序
2. 每步目标
3. 需要执行的命令或动作
4. 预期输出
5. 复盘题
6. 当前完成状态

### 6.2 面向 `TriStaciss` 的实验接口字段

`TriStaciss` 当前优先关心：

1. 实验标识与 step 标识
2. 学员提交内容
3. 观察到的输出
4. 退出码或结果状态
5. 反思题答案
6. 助教判定结果

## 7. 当前执行模式

当前 Web 优先 Phase A 先采用两段式：

1. `guided-local`：学员在本地或现有宿主执行命令，平台记录步骤与结果。
2. `manual-capture`：学员手工提交输出与反思题，后端只承接结构化结果。

`remote-sandbox`、`project-run`、自动评分和受控工作区重置，属于后续可扩展模式，不应写成已完成事实。

## 8. CodeGraph 规则

在 lesson 和 lab 中，只要目标模块已有可用 `CodeGraph`，默认先提供：

1. 入口定位
2. 调用链定位
3. 关键对象定位
4. 依赖关系定位

然后再让学习者进入源码细读。

如果模块没有可用 `CodeGraph`，contract 必须显式写出缺口，不允许静默跳过。

## 9. 第一批推荐对象

当前第一批推荐先从 CLI / workflow 课切入，因为它天然适合拆成：

1. 课程页
2. 实验页
3. 结果页
4. review 页

当前首个实例就是：

1. `employee-source-kit-cli-lesson-contract.md`
2. `employee-source-kit-cli-lab-contract.md`

当前首个对接样板就是：

1. `employee-source-kit-cli-triavatar-lesson-page.example.json`
2. `employee-source-kit-cli-tristaciss-lab-submission.example.json`
