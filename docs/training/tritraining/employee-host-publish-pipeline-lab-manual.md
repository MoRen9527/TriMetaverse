# Employee Host Publish 发布链实验手册

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-host-publish-pipeline-lab-manual.md
- publishedFrom: TriTraining/docs/training/employee-host-publish-pipeline-lab-manual.md
- syncMode: published-copy
- publishTier: central-training-lab
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合实验手册副本

## 1. 手册定位

本手册对应课程：

- `employee-host-publish-pipeline-course.md`

目标不是只记住一个 wrapper 名字，而是让学习者真的跑清楚：

1. 看命令面。
2. 跑聚焦验证路径。
3. 追最小调用链。
4. 看 support payload 和 binding profile 产物。
5. 对比 wrapper 与 split command 的关系。
6. 写出当前阶段明确不承诺的边界。

## 2. 实验前提

当前实验仍以源码仓和命令行为准。

后续进入培训学院平台切片后，前后端承接建议为：

1. `TriAvatar`：承接实验入口、步骤页、进度页、结果展示页。
2. `TriStaciss`：承接实验提交、聚焦验证结果记录与后续 review API。

## 3. 代码查看前置规则

在正式读代码前，默认先做两步：

1. 用 `CodeGraph` 查看入口、关键对象、manifest 生成点、binding profile 生成点和测试锚点。
2. 再去定点打开源码文件验证细节。

如果当前模块没有可用 CodeGraph 索引，实验记录里必须显式写出缺口，而不是直接跳过说明。

## 4. 最小实验路径

### 4.1 先看 help

```powershell
python -m runtime.cognition.employee_host_publish --help
python -m runtime.cognition.employee_host_object_generation --help
python -m runtime.cognition.employee_host_binding_profile_generation --help
```

### 4.2 再跑聚焦验证路径

```powershell
python -m unittest runtime.cognition.employee_host_publish_validation runtime.cognition.rd_trainer_host_object_generation_validation runtime.cognition.employee_host_binding_profile_generation_validation
```

### 4.3 再追最小调用链

```text
__main__ -> main -> publish_declared_employee_host_assets -> generate_host_object_set / write_host_binding_profiles
```

## 5. 标准实验动作

后续在平台里仍建议保留 6 类实验动作：

1. 看命令协议
2. 跑聚焦验证路径
3. 追最小调用链
4. 画出 object set / manifest / binding profile 的关系图
5. 对比 wrapper 与 split command 的职责边界
6. 写出当前不做项与治理边界

## 6. 助教判定标准

学习者至少需要做到：

1. 能解释为什么本课先跑 focused unittest，而不是先对 live support root 做全量刷新。
2. 能解释 `employee_host_publish` 和两个 split command 的关系。
3. 能写出 `publish_declared_employee_host_assets -> generate_host_object_set / write_host_binding_profiles` 的最小调用链。
4. 能说清 support payload、binding profile、runtime namespace 的三层边界。
5. 能解释为什么当前流程仍需要 workflow 文档和治理回填。

## 7. 后续实验页建议

进入 `TriTraining` Web 优先切片后，可把本手册拆成：

1. lesson page
2. practice page
3. artefact map page
4. review summary page

其中前端页由 `TriAvatar` 承接，实验 API 与结果接口由 `TriStaciss` 承接。

## 8. 对应平台 contract

本手册当前对应：

1. `employee-host-publish-pipeline-lesson-contract.md`
2. `employee-host-publish-pipeline-lab-contract.md`
