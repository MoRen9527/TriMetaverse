# TriCade 实验→生产管线运行手册

版本：V0.1
日期：2026-08-01
状态：ACT1 — 实验标记与规则结晶规范

## 1. 概述

本手册定义了 TriCade Phase 3 实验→生产管线的标准流程：从实验标记、验证、规则结晶到注入的完整生命周期。

## 2. 实验生命周期

```
experimenting → verified → ready-for-injection → injected
```

### 2.1 experimenting

- **含义**：实验正在编写或进行中，结论尚未验证。
- **允许操作**：修改实验文件、变更实验设计、调整参数。
- **禁止操作**：基于实验结论修改生产规则或标准文档。
- **出口条件**：实验数据充分、结论可复现、至少一位相关岗位负责人确认。

### 2.2 verified

- **含义**：实验结论已通过验证，等待结晶为正式规则。
- **允许操作**：编写实验总结文档、与相关岗位对齐规则变更范围。
- **禁止操作**：在生产环境中启用实验性行为。
- **出口条件**：实验总结已写入 `docs/experiments/{topic}.md`，相关岗位签核通过。

### 2.3 ready-for-injection

- **含义**：规则已抽象完成，待注入到目标模块。
- **允许操作**：通过 `rule_injection check --scope {module}` 预检查差异。
- **禁止操作**：绕过 check 直接 sync。
- **出口条件**：`rule_injection check` 返回清晰差异列表，无未知冲突。

### 2.4 injected

- **含义**：规则已注入目标模块，实验管线完成。
- **允许操作**：归档实验文档，更新变更日志。
- **禁止操作**：在未重新进入 experimenting 的情况下手动修改已注入规则。
- **后续**：若规则需要修订，从 experimenting 开始新循环。

## 3. 实验标记规范

### 3.1 文件头标记格式

在实验相关文件的头部添加以下 HTML 注释标记：

```markdown
<!-- experiment: {topic} status: {status} since: {date} -->
```

**字段说明**：
- `{topic}`：实验主题标识符，使用 kebab-case（如 `tri-model-priority-config`）
- `{status}`：当前生命周期状态，取值为 `experimenting` | `verified` | `ready-for-injection` | `injected`
- `{date}`：状态变更日期，格式 `YYYY-MM-DD`

**示例**：
```markdown
<!-- experiment: multi-project-isolation status: experimenting since: 2026-08-01 -->
```

### 3.2 多文件实验

若一个实验涉及多个文件，每个文件应在头部添加相同标记。主实验文档 `docs/experiments/{topic}.md` 作为入口载明所有涉及文件清单。

### 3.3 状态变更

状态变更时，更新标记中的 `status` 和 `since` 字段，并在实验总结文档中记录变更原因。

## 4. 规则结晶流程

### 4.1 实验总结文档

实验完成后，在 `docs/experiments/{topic}.md` 写入实验总结，至少包含：

```markdown
# 实验：{topic}

- 状态：{status}
- 开始日期：{start_date}
- 最后更新：{last_updated}
- 负责人：{owner}

## 实验设计
## 实验数据
## 结论
## 规则抽象
## 注入目标
## 涉及文件
```

### 4.2 规则结晶映射

| 实验领域 | 实验文档路径 | 注入目标 |
|---------|------------|---------|
| 文档治理 | `docs/experiments/{topic}.md` | `TriCompany/docs/{domain}/{standard}.md` |
| ADE 协议 | `docs/experiments/{topic}.md` | `.github/agents/*.agent.md` |
| 员工合约 | `docs/experiments/{topic}.md` | `TriCompany/source-agents/{role}/` |
| 岗位定义 | `docs/experiments/{topic}.md` | `.github/instructions/*.instructions.md` |
| 项目模板 | `docs/experiments/{topic}.md` | `.github/prompts/*.prompt.md` |

### 4.3 注入命令

```bash
# 预检查差异
python -m runtime.cognition.rule_injection check --scope {module}

# 执行注入
python -m runtime.cognition.rule_injection sync --scope {module}
```

## 5. 安全护栏

1. **禁止跳步**：不得从 experimenting 直接到 injected，必须依次经过 verified 和 ready-for-injection。
2. **原子注入**：`rule_injection sync` 操作为原子性；失败时全部回滚，不留部分注入状态。
3. **审计追溯**：每次注入操作记录时间戳、操作人、注入前后的校验和。
4. **回滚路径**：注入前自动备份目标文件到 `.rule-injection-backups/`，可通过 `rule_injection rollback --scope {module}` 恢复。
5. **跨模块冲突检测**：若同一规则涉及多个模块，check 阶段会检测跨模块一致性，不一致时阻止注入。

## 6. 变更日志

| 日期 | 版本 | 变更说明 |
|------|------|---------|
| 2026-08-01 | V0.1 | 初版 — 实验生命周期、标记规范、规则结晶流程 |
