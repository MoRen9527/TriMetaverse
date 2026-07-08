# Employee Source Kit CLI 实验手册

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/employee-source-kit-cli-lab-manual.md
- syncMode: published-copy
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合实验手册副本

## 1. 手册定位

本手册对应课程：

- `employee-source-kit-cli-course.md`

目标不是只看懂，而是让学习者真的跑一遍：

1. 看命令面。
2. 跑最小 MVP。
3. 追调用链。
4. 在临时目录做生成。
5. 手工制造错误。
6. 放回完整工作流。

## 2. 实验前提

当前实验仍以源码仓和命令行为准。

后续进入培训学院平台切片后，前后端承接建议为：

1. `TriAvatar`：承接实验入口、说明页、进度页、结果展示页。
2. `TriStaciss`：承接实验提交、代码片段执行或结果上报接口。

## 3. 代码查看前置规则

在正式读代码前，默认先做两步：

1. 用 `CodeGraph` 查看入口、调用链、关键对象和依赖关系。
2. 再去定点打开源码文件验证细节。

如果当前模块没有可用 CodeGraph 索引，实验记录里必须显式写出缺口，而不是直接跳过说明。

## 4. 最小实验路径

### 4.1 先看 help

```powershell
python -m runtime.cognition.employee_source_kit --help
python -m runtime.cognition.employee_source_kit generate --help
python -m runtime.cognition.employee_source_kit validate --help
```

### 4.2 再跑最小无副作用路径

```powershell
python -m runtime.cognition.employee_source_kit validate --source-root . --employee-id rd-trainer
```

### 4.3 再追最小调用链

```text
__main__ -> main -> parse_args -> validate_employee_source_kit -> source_kit_paths -> normalize_workspace_id
```

## 5. 标准实验动作

后续在平台里仍建议保留 6 类实验动作：

1. 看命令协议
2. 跑最小 MVP
3. 追调用链
4. 临时生成 source kit
5. 注入越界错误并复查
6. 放回 source -> binding -> support -> live 工作流

## 6. 助教判定标准

学习者至少需要做到：

1. 能解释为什么先用 CodeGraph 而不是一上来盲读所有源码。
2. 能解释 `validate` 为什么适合当 MVP。
3. 能说清 source truth 和 runtime state 的边界。
4. 能解释这个 CLI 为什么不是孤立脚本，而是工作流链条的一部分。

## 7. 后续实验页建议

进入 `TriTraining` Web 优先切片后，可把本手册拆成：

1. lesson page
2. practice page
3. answer check page
4. review summary page

其中前端页由 `TriAvatar` 承接，实验 API 与结果接口由 `TriStaciss` 承接。

## 8. 对应平台 contract

本手册当前对应：

1. `employee-source-kit-cli-lesson-contract.md`
2. `employee-source-kit-cli-lab-contract.md`
