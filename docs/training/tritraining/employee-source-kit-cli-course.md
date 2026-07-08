# Employee Source Kit CLI 从入口到工作流正式课程

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-source-kit-cli-course.md
- syncMode: published-copy
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合课程副本

## 1. 课程定位

这门课讲的不是单独一个 Python 文件，而是：

1. 一个 CLI 如何从入口进入业务逻辑。
2. 一个 CLI 如何把 source 定义、校验、binding、support payload 与 live agent 工作流串起来。
3. 研发新人如何用一套稳定方法拆解后续其他 CLI 与 workflow。

当前课程面向 `TriTraining` 培训学院的 Web 优先 Phase A 切片：

- 课程前端展示与 lesson 入口：由 `TriAvatar` 配合承接。
- 实验结果提交、API 和沙箱承接：由 `TriStaciss` 配合承接。
- 课程内容真源与持续维护：当前位于 `TriTraining/docs/training/`；首批教学转译由 `TriCompany / RAndDTrainer` 协同支持。

## 2. 学完后应得到的结果

学完后，学习者至少应能回答：

1. `if __name__ == "__main__"` 为什么这样写。
2. `argparse`、subparser、业务函数、dataclass 分别在 CLI 里扮演什么角色。
3. 为什么 `employee_source_kit` 不只是“生成文件脚本”，而是岗位发布链的一环。
4. 为什么 source truth、support payload、runtime state 必须分层。
5. 一个 CLI 如何与 agent/workflow 协同，而不是孤立存在。

## 3. 理论方法与协议

本课默认先讲清 5 条稳定方法：

1. 命令分发：入口负责命令协议，业务函数负责真实逻辑。
2. 数据建模：输入、输出、校验问题和校验结果都要结构化。
3. Source 与 Runtime 分层：源侧岗位契约不能混入当前宿主消费记录。
4. 契约校验：生成成功不等于结构合格，必须再做边界验证。
5. 发布链协作：source kit 之后还有 binding profile、support payload 和 live discovery。

## 4. 最小 MVP 路径

课程的最小闭环不是 `generate`，而是先跑：

```powershell
python -m runtime.cognition.employee_source_kit validate --source-root . --employee-id rd-trainer
```

这条路径已经包含完整 CLI 闭环：

1. 进入主入口。
2. 解析命令。
3. 分发到 `validate` 业务函数。
4. 计算 source kit 路径。
5. 校验文件存在、必须标记和禁止标记。
6. 返回退出码。

## 5. 由浅入深的拆解顺序

后续讲解默认按以下顺序：

1. 入口层：`__main__` 与 `main()`
2. 参数层：`argparse` 和 subparser
3. 业务层：`generate_employee_source_kit(...)` / `validate_employee_source_kit(...)`
4. 路径层：`normalize_workspace_id(...)` 与 workspace path 规则
5. 渲染层：`_render_source_kit(...)` 与五件套输出
6. 校验层：forbidden / required marker
7. 发布层：`employee_host_publish` 与 `host_object_generation`

## 6. 代码查看默认规则

对现役代码模块，本课程默认要求：

1. 先用 `CodeGraph` 看结构。
2. 再按入口、调用链和对象关系做定点源码阅读。
3. 最后再把阅读结果写成课程或教学级代码文档。

也就是说，本课把 `CodeGraph-first, source-read-second, human-closeout-final` 作为默认拆码顺序。

## 7. 与培训学院前后端的关系

当前这门课是培训学院的第一批“研发 CLI / workflow”课程。

后续在平台里的承接关系建议为：

1. `TriAvatar` 负责课程列表、章节页、实验入口、进度页和结果页。
2. `TriStaciss` 负责课程内容 API、实验提交 API、代码运行或实验结果提交接口。
3. `TriTraining/docs/training/` 负责模块 training 真源；首批教学转译当前由 `TriCompany / RAndDTrainer` 协同支持。

## 8. 当前不写成已完成的事项

1. 不写成 `TriTraining` 培训学院已经整体完成落地。
2. 不写成课程平台前后端已经全部实现。
3. 不写成所有 lesson contract、进度系统和实验沙箱都已落地。

## 9. 下一节课建议

最自然的续课已经落成：

1. [Employee Host Publish 发布链课程：source -> support -> binding](./employee-host-publish-pipeline-course.md)
2. [Employee Host Publish 发布链实验手册](./employee-host-publish-pipeline-lab-manual.md)
3. 这两份内容把 `employee_host_publish`、`host_object_generation` 与 `binding profile` 的下游发布链补上。
4. 它们承接的是 source -> support -> binding 的完整下一跳。

## 10. 对应平台 contract

本课当前已对应两份平台 contract：

1. `employee-source-kit-cli-lesson-contract.md`
2. `employee-source-kit-cli-lab-contract.md`
