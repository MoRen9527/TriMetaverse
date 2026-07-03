# Employee Host Publish 发布链课程：source -> support -> binding

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-host-publish-pipeline-course.md
- publishedFrom: TriTraining/docs/training/employee-host-publish-pipeline-course.md
- syncMode: published-copy
- publishTier: central-training-course
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合课程副本

## 1. 课程定位

这门课讲的不是“再多一个 CLI”，而是当前 Copilot-host 阶段里最关键的一条发布链：

1. 源侧岗位定义如何被选中。
2. support payload 如何生成 role / employee / org / audit 四类 workspace。
3. binding profile 如何把源侧定义和当前宿主绑定事实连接起来。
4. 为什么这条链必须和 live 入口、runtime state、governance 回填分层。

当前课程面向 `TriTraining` 培训学院的 Web 优先 Phase A 切片：

- 课程前端展示与 lesson 入口：由 `TriAvatar` 配合承接。
- 实验结果提交、API 和沙箱承接：由 `TriStaciss` 配合承接。
- 课程内容真源与持续维护：当前位于 `TriTraining/docs/training/`；首批教学转译由 `TriCompany / RAndDTrainer` 协同支持。

## 2. 学完后应得到的结果

学完后，学习者至少应能回答：

1. `employee_host_publish` 为什么是 canonical wrapper，而不是可有可无的壳。
2. `HostObjectSetDefinition`、`GeneratedHostObjectSet`、binding profile 分别承载什么语义。
3. 为什么 support payload、binding profile、runtime namespace 不能混成一层。
4. 为什么当前发布链会强调 single employee、manifest upsert 和边界测试。
5. 为什么“生成成功”不等于“live agent 已自动启用”。

## 3. 理论方法与协议

本课默认先讲清 5 条稳定方法：

1. wrapper 编排：统一入口负责把生成 support payload 与写 binding profile 串成一条发布动作。
2. 定义驱动：真正决定输出的不是 CLI 文案，而是 `DECLARED_HOST_OBJECT_SETS` 与 `HostObjectSetDefinition`。
3. 支撑载荷分层：support payload 是宿主消费面，不是 source truth，也不是 runtime memory。
4. 绑定事实分层：binding profile 负责记录 host stage、live entry 和 support object 映射，不替代 live discovery 本身。
5. 验证先行：发布链必须同时有 focused unittest 和 workflow 文档约束，避免把当前阶段写成正式宿主切换。

## 4. 最小 MVP 路径

这门课的最小闭环，不是直接对当前 support root 做全量刷新，而是先跑聚焦验证路径：

```powershell
python -m unittest runtime.cognition.employee_host_publish_validation runtime.cognition.rd_trainer_host_object_generation_validation runtime.cognition.employee_host_binding_profile_generation_validation
```

这条路径已经覆盖发布链的最小事实：

1. wrapper 会同时产出 support payload 与 binding profile。
2. generator 会写入 role / employee / org / audit workspace 与 manifest。
3. binding profile 会落到 `.github/binding-profiles/`。
4. 关键 live entry、display name、runtime namespace 与 boundary note 都有断言。

如果只是先看命令协议，再补看：

```powershell
python -m runtime.cognition.employee_host_publish --help
python -m runtime.cognition.employee_host_object_generation --help
python -m runtime.cognition.employee_host_binding_profile_generation --help
```

## 5. 由浅入深的拆解顺序

后续讲解默认按以下顺序：

1. 入口层：`__main__` 与 `main()`
2. 参数层：`--source-root`、`--support-root`、`--employee`
3. 编排层：`publish_declared_employee_host_assets(...)`
4. 定义层：`_selected_definitions(...)`、`DECLARED_HOST_OBJECT_SETS`、`HostObjectSetDefinition`
5. 生成层：`generate_host_object_set(...)`、`_write_workspace_readme(...)`、`_upsert_manifest(...)`
6. 绑定层：`write_host_binding_profiles(...)`、`_render_host_binding_profile(...)`
7. 验证与治理层：focused unittest 与 `host-object-publish-flow.md`

## 6. 代码查看默认规则

对现役代码模块，本课程默认要求：

1. 先用 `CodeGraph` 看入口、调用链、关键对象与测试锚点。
2. 再按 wrapper -> definition -> generation -> binding -> validation 的顺序做定点源码阅读。
3. 最后再把阅读结果写成课程或教学级代码文档。

也就是说，本课仍把 `CodeGraph-first, source-read-second, human-closeout-final` 作为默认拆码顺序。

## 7. 与培训学院前后端的关系

当前这门课是培训学院第一批“研发 workflow / publish chain”课程。

后续在平台里的承接关系建议为：

1. `TriAvatar` 负责课程列表、章节页、实验入口、步骤页和结果页。
2. `TriStaciss` 负责课程内容 API、实验提交 API、聚焦验证结果上报接口。
3. `TriTraining/docs/training/` 负责模块 training 真源；首批教学转译当前由 `TriCompany / RAndDTrainer` 协同支持。

## 8. 当前不写成已完成的事项

1. 不写成 wrapper 会自动完成 live discovery 启用。
2. 不写成所有员工对象发布已经等同正式宿主切换。
3. 不写成 runtime namespace 会在 support payload 生成时自动写入运行态内容。

## 9. 下一节课建议

最自然的续课是：

1. `TriMetaverse` 工作流 / project-run 里的 `source -> publish -> live -> runtime` 总览课。
2. `TriTraining` lesson / lab / project course contract 扩展课。
3. handoff / governance / acceptance 的增量收口课。

## 10. 对应平台 contract

本课当前已对应两份平台 contract：

1. `employee-host-publish-pipeline-lesson-contract.md`
2. `employee-host-publish-pipeline-lab-contract.md`
