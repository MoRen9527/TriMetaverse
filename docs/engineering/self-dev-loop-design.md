# TriCade 自开发回路设计

版本：V0.1
日期：2026-08-02
状态：DRAFT — 设计阶段，代码实现待生产环境
作者：CTO 小狄

## 1. 概述

本文档定义 TriCade 自开发回路（Self-Development Loop）的完整链路设计：从本地控制器（TriLC）出发，经 TriCode 编排层和 OpenCode 代码生成引擎，将生产环境中产生的代码变更通过 `prod/*` 分支评审后合并到 `main` 分支的正式运营真源。

**核心原则**：代码单向流动，PR 必审，测试门禁不通过不合并。

## 2. 链路架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    TriCade 自开发回路                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TriLC (本地控制器)                                                │
│    │  Agent 执行任务，产生代码变更                                    │
│    │  变更暂存在项目工作目录                                          │
│    ▼                                                             │
│  TriCode (编排层)                                                  │
│    │  接收 TriLC 提交的变更 intent                                   │
│    │  编排: diff 分析 → 分支创建 → 提交 → PR 创建                     │
│    ▼                                                             │
│  OpenCode (代码生成引擎)                                            │
│    │  将变更 intent 转化为实际代码                                    │
│    │  生成 git diff + commit message                              │
│    ▼                                                             │
│  prod/Wxx 分支                                                     │
│    │  所有自开发回路的代码变更在此暂存                                  │
│    │  自动 PR → main                                              │
│    ▼                                                             │
│  main 分支 = 正式运营真源                                            │
│    │  PR review 通过 + CI 门禁通过 → merge                          │
│    ▼                                                             │
│  TriCade 线上环境（TriLC pull → 重新加载最新规则）                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 各层职责

| 层级 | 模块 | 职责 |
|------|------|------|
| 执行层 | TriLC | Agent 执行用户/自动化任务，产生代码变更意图 |
| 编排层 | TriCode | Diff 分析、分支管理、PR 创建、CI 触发 |
| 生成层 | OpenCode | 将意图转化为符合项目规范的代码 + commit message |
| 审查层 | GitHub PR | Code review、CI 门禁、合并 |
| 部署层 | TriLC (pull) | 拉取 main 变更，更新运行时配置 |

## 3. 变更流程

### 3.1 标准变更周期

```
1. TriLC agent 执行任务 → 产生文件变更
2. Agent 调用 tricode push — 提交变更 intent
3. TriCode 将 intent 路由到 OpenCode
4. OpenCode 生成符合规范的代码变更
5. TriCode 创建 prod/Wxx 分支（如不存在则从 main 创建）
6. TriCode 提交变更到 prod/Wxx
7. TriCode 创建 PR: prod/Wxx → main
8. CPO/CTO 执行 code review
9. CI 自动运行测试门禁
10. 全部通过 → Squash merge 到 main
11. TriLC 定时 pull main 获取最新规则/配置
```

### 3.2 变更 Intent 模型

```json
{
  "intent": {
    "type": "code_change | config_update | rule_injection | doc_update",
    "source": "trilc-agent",
    "agentId": "ceo-chief-of-staff",
    "sessionId": "sess_xxx",
    "description": "Update weekly report template to include Q3 metrics",
    "files": [
      { "path": "docs/workflow/operating-records/templates/weekly.md", "action": "modify" }
    ],
    "reason": "Q3 metric tracking requirement per CEO directive"
  },
  "code": {
    "diff": "...",
    "commitMessage": "docs: update weekly template with Q3 metrics"
  },
  "metadata": {
    "timestamp": "2026-08-02T10:00:00Z",
    "triCadeVersion": "1.0.0",
    "projectRoot": "C:\\Users\\...\\TriCade\\projects\\TriMetaverse"
  }
}
```

### 3.3 分支命名规范

- 格式：`prod/W{week_number}/{short-description}`
- 示例：`prod/W34/update-weekly-template`
- `prod/Wxx` 主分支仅 TriCode 写入，禁止人工直接推送。

## 4. 安全门

### 4.1 PR Review 门禁

| 要求 | 内容 |
|------|------|
| 审批人 | 至少一位 CPO 或 CTO |
| 变更范围 | 仅限声明范围内的文件 |
| 禁止项 | 禁止修改 `.github/workflows/`（CI 配置锁定） |
| 禁止项 | 禁止修改 `.github/agents/`（Agent 定义锁定，仅 CPO+CTO 联合 approval） |
| 禁止项 | 禁止修改 `docs/registry/`（Registry 锁定，仅对应岗位 owner） |

### 4.2 测试门禁

| 门禁 | 触发条件 | 通过标准 |
|------|---------|---------|
| `tsc --noEmit` | 涉及 `*.ts` / `*.tsx` 文件 | 零编译错误 |
| `npm test` | 涉及 `src/` 下代码文件 | 全部通过，0 fail |
| `python -m unittest` | 涉及 `runtime/cognition/` 文件 | 全部通过，0 fail |
| Markdown 链接检查 | 涉及 `*.md` 文件 | 0 死链 |
| Agent 合约验证 | 涉及 `.github/agents/` 文件 | source_publish_check 通过 |
| 实验标记检查 | 涉及实验环境文件 | 无 `experimenting` 标记文件进入 prod |

### 4.3 CI Pipeline 流程

```yaml
name: Self-Dev Loop CI
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: TypeScript Check
        if: contains(github.event.pull_request.changed_files, '.ts')
        run: cd TriLC && npm run check
        
      - name: Python Unittest
        if: contains(github.event.pull_request.changed_files, 'runtime/cognition/')
        run: cd TriCompany && python -m unittest discover -s runtime/cognition -p '*_validation.py'
        
      - name: Agent Contract Validation
        if: contains(github.event.pull_request.changed_files, '.github/agents/')
        run: cd TriCompany && python -m runtime.cognition.source_publish_check --check
        
      - name: Experiment Marker Check
        run: |
          if grep -r "status: experimenting" docs/ --include="*.md" 2>/dev/null; then
            echo "ERROR: experimenting files found in prod PR"
            exit 1
          fi
```

## 5. 回滚路径

### 5.1 PR 级别回滚

- **PR 合并前**：直接关闭 PR，删除 `prod/Wxx` 分支。
- **PR 合并后（无冲突）**：GitHub UI Revert PR。
- **PR 合并后（有冲突）**：手动 `git revert <merge-commit-hash>`。

### 5.2 变更级别回滚

- TriCode 记录每次变更的完整 diff。
- 回滚命令：`tricode revert --change-id <id>` — 生成反向 diff 并提交到新 `prod/Wxx` 分支。
- 回滚 PR 同样经过 review + CI 门禁。

## 6. 并发控制

### 6.1 冲突检测

- TriCode 在创建 prod/Wxx 分支前检查 `main` 最新提交。
- 若 prod 分支文件与 main 有冲突，TriCode 先 rebase 再应用变更。
- 若 rebase 失败（真冲突），通知执行 Agent 并阻塞 PR 创建。

### 6.2 锁机制

- 同一文件的并发修改由 git 自身冲突检测覆盖。
- TriCode 串行化 prod/Wxx 提交（同一周窗口内排队）。
- 跨周窗口可并行，各自独立 prod 分支。

## 7. 审计与可追溯

| 审计维度 | 记录方式 |
|---------|---------|
| 谁触发了变更 | Agent ID + Session ID 嵌入 commit message |
| 变更了什么 | Git diff（永久可追溯） |
| 为什么变更 | Commit message body 包含 intent description |
| 谁审批了 | PR review 记录（GitHub audit log） |
| 何时生效 | Merge commit timestamp |

Commit message 模板：

```
<type>(<scope>): <short description>

Intent: <intent description>
Agent: <agentId>
Session: <sessionId>
Trigger: <trigger type>
Approved-by: <reviewer>

Co-Authored-By: TriCade Self-Dev Loop <trilc@trimetaverse.local>
```

## 8. 实现阶段

| 阶段 | 内容 | 依赖 | 状态 |
|------|------|------|------|
| Phase 1 | 链路原型：TriLC → TriCode → OpenCode 最小通路 | TriCode MVP, OpenCode API | 待实现 |
| Phase 2 | PR 自动化 + CI 门禁 | GitHub Actions, Branch Protection | 待实现 |
| Phase 3 | 冲突检测 + 回滚路径 | TriCode diff 引擎 | 待实现 |
| Phase 4 | 完整生产就绪 + 监控 | TriCade 1.0 上线 | 待规划 |

## 9. 与实验环境的隔离

自开发回路运行在**生产环境**（`main` 分支）:

- 实验环境（`dev` 分支）的代码变更仍然通过 Claude Code 人工完成。
- 生产环境的代码变更通过自开发回路自动完成。
- 两个环境独立，永不交叉合并。
- 详细隔离说明见 `dev-degradation-plan.md`。

## 10. Open Questions

1. OpenCode 生成的 commit message 质量是否足够通过 CPO/CTO review？
2. 是否需要 `--dry-run` 模式让 Agent 预览变更后再提交？
3. 跨模块变更（如同时修改 TriLC 和 TriCompany）如何处理分支协调？

## 11. 变更日志

| 日期 | 版本 | 变更说明 |
|------|------|---------|
| 2026-08-02 | V0.1 | 初版 — 完整链路架构、安全门、回滚路径、审计追溯 |
