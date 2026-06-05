---
name: "dev-task"
description: "Stable alias for creating an IPD case from a development task and running autopilot until real execution evidence is required."
argument-hint: "任务描述，例如：排查 LiteLLM 接入异常并给出修复方案"
agent: "CEOChiefOfStaff"
tools: [read, execute]
---
你现在要执行一次“开发任务”下发动作（ASCII 稳定别名入口）。

默认触发方式：

```text
/dev-task 任务描述
```

兼容触发（若宿主支持）：

```text
/prompt 开发任务 任务描述
```

如果当前宿主不支持 slash prompt（出现 `Unknown command`），改用稳定入口：

```powershell
.\tmv.cmd dev-task "任务描述"
```

## 目标

把输入任务封装为 TriCompany IPD case，并默认继续自动推进到真实工程执行门前，对应稳定入口：

```powershell
.\tmv.cmd dev-task "任务描述"
```

## 执行规则

1. 若未提供“任务描述”，只补问一句最关键缺口：`请给出任务描述。`
2. 必须使用 `#execute/runInTerminal` 真正执行命令。
3. 默认在 `TriMetaverse` 根目录执行；Windows / PowerShell 推荐模板：

```powershell
Set-Location .
.\tmv.cmd dev-task "任务描述"
```

4. 若命令失败，不得假装成功；必须明确失败原因并给出下一步修复建议。
5. 除非 CEO 明确要求“记录”或“更新”，不要自动改写 registry 文档。

## 输出结构

## 任务受理确认
- 已受理任务描述。

## 执行结果
- `caseId`
- `intake.status`
- `autopilot.status`
- 若进入执行暂停：`autopilot.pendingStageKey`
- 若后续完成交付：`autopilot.delivery` / `release bundle` 相关路径

## 常用变体
- 只创建 intake：`.\tmv.cmd dev-task --intake-only "任务描述"`
- CEO 人工签核暂停：`.\tmv.cmd dev-task --manual-ceo-signoff "任务描述"`
- 显式指定 TriDev：`.\tmv.cmd dev-task --tridev-root D:\OneDrive\Code\ai\TriDev "任务描述"`
