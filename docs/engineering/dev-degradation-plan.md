# 实验环境降级计划：dev → 纯规则提炼场

版本：V0.1
日期：2026-08-02
状态：DRAFT — 降级计划，待 Phase 3 自开发回路验证通过后执行
作者：CTO 小狄

## 1. 概述

当 TriCade 自开发回路验证通过后，当前实验环境（`dev` 分支，物理位于 `D:\OneDrive\Code\ai\TriMetaverse\`）将降级为**纯规则提炼场**。生产环境的代码变更将全部通过自开发回路完成，不再在实验环境直接操作 TriMetaverse 代码。

**核心目标**：
- 消除双环境并行维护的认知负担
- 确保规则提炼和生产运营的物理隔离
- 保留实验环境作为新规则的概念验证场和设计讨论场

## 2. 降级前后对比

| 维度 | 降级前（当前状态） | 降级后（目标状态） |
|------|------------------|-------------------|
| **代码变更** | Claude Code 在 dev 直接操作 | dev 只写入实验设计文档，不直接改生产代码 |
| **规则产出** | 实验验证 → 人工 CR → dev push | 实验验证 → 结论文档 → rule_injection → main PR |
| **运营记录** | docs/workflow/operating-records/ W15-Wxx | dev 不再产生运营记录（main 独立序列） |
| **Agent 上岗** | CPO/CTO 在 dev 上岗试运行 | 仅规则设计验证，不操作生产仓库 |
| **Git 流向** | dev → main (PR) | dev 不直接 push main；规则通过 rule_injection 注入 |
| **物理位置** | `D:\OneDrive\Code\ai\TriMetaverse\` | 保留，但代码操作冻结 |

## 3. 降级步骤

### Phase 3a: 前置条件校验（week -1）

- [ ] 自开发回路链路 `trilc → tricode → opencode → prod/* → main PR` 全通路验证通过
- [ ] 至少 1 个完整的自开发变更周期完成（intent → 代码 → PR → review → merge）
- [ ] CPO/CTO 确认 PR review 流程满足质量要求
- [ ] CI 门禁（tsc/noEmit、npm test、python unittest）全部通过
- [ ] 生产环境 `main` 分支初始化完成（仅代码+模板，不含实验经营记录）
- [ ] TriCade 1.0 线上环境进入正式运营

### Phase 3b: 冻结实验环境代码写入（week 0）

- [ ] `dev` 分支添加 BRANCH_FROZEN.md 标记文件
```markdown
# DEV BRANCH FROZEN
- 冻结日期：{date}
- 原因：生产环境已通过自开发回路独立运营
- dev 新用途：纯规则提炼场（仅写入实验设计文档）
- 代码变更：请通过自开发回路在 main 分支完成
```
- [ ] CPO/CTO/CEO 联合签核冻结声明
- [ ] 同步通知所有在岗员工：dev 代码操作已冻结
- [ ] 最后执行 `docs/registry/` 快照，归档到 `docs/engineering/archive/dev-final-snapshot/`

### Phase 3c: 规则提炼场初始化（week 0-1）

- [ ] 创建 `docs/experiments/` 目录结构：
```
docs/experiments/
  README.md                           # 实验目录说明
  active/                             # 进行中的实验
    .gitkeep
  completed/                          # 已完成并注入的实验
    .gitkeep
  template.md                         # 实验文档模板
```
- [ ] 将历史实验资产从 `docs/workflow/operating-records/` 迁移到 `docs/experiments/completed/`（仅实验结论，不含周报内容）
- [ ] 清理 `docs/workflow/operating-records/` 中 dev 实验期的周报（W15-Wxx），保留为归档参考
- [ ] 更新 `docs/engineering/STATE.md`：标注实验环境已降级

### Phase 3d: Agent 定义迁移（week 1-2）

- [ ] `.github/agents/*.agent.md` → 通过 rule_injection sync 注入到 main
- [ ] `.github/instructions/*.instructions.md` → 通过 rule_injection sync 注入到 main
- [ ] `.github/prompts/*.prompt.md` → 通过 rule_injection sync 注入到 main
- [ ] 注入后，dev 侧 Agent 文件标记为 `frozen-reference`，不再作为 live entry
- [ ] `TriCompany/source-agents/` 岗位定义 → 注入到 main 对应路径

### Phase 3e: 验证与收尾（week 2-3）

- [ ] 确认 main 分支的 Agent/文档/模板与 dev 注入版本一致
- [ ] 运行一次完整的实验→提炼→注入流程验证新工作流
- [ ] 确认 TriCade 线上 Agent 读取 main 分支的规则和文档
- [ ] 在 `dev` 根目录添加 `README-FROZEN.md`：
```markdown
# 此分支已冻结
- 冻结日期：{date}
- 新用途：纯规则提炼场
- 代码变更：请使用 TriCade 自开发回路 → main 分支
- 实验设计：请在此分支的 docs/experiments/ 目录编写
- 规则注入：实验验证通过的规则通过 rule_injection sync 注入到 main
```
- [ ] CPO/CTO/CEO 联合签核降级完成

## 4. 降级后的日常操作

### 4.1 实验场景（dev 分支）

1. 发起人在 `docs/experiments/active/{topic}.md` 创建实验设计文档
2. 实验设计文档可包含代码片段、伪代码、架构草图——但不直接修改 TriMetaverse 代码文件
3. CPO/CTO/相关岗位讨论和 review
4. 实验结论达成共识后：
   - 将文档移至 `docs/experiments/completed/{topic}.md`
   - 通过 `rule_injection sync` 将规则/代码变更注入到 main 的 PR
5. 注入的规则/代码通过 main 的 PR review 流程 + CI 门禁后合并

### 4.2 生产场景（main 分支，通过自开发回路）

1. TriLC Agent 执行任务 → 产生变更 intent
2. TriCode → OpenCode → prod/Wxx 分支
3. PR: prod/Wxx → main
4. CPO/CTO review + CI
5. Merge

### 4.3 例外处理

若实验需要**修改真实代码文件**才能验证（如性能基准测试、运行时行为验证）：

1. 在 TriCade 中创建独立实验项目（非 TriMetaverse 仓库）
2. 复制必要的代码文件到实验项目
3. 在实验项目中完成验证
4. 验证通过后，结论文档写入 dev 的 `docs/experiments/`
5. 规则通过 `rule_injection sync` 注入到 main

## 5. 回退方案

若自开发回路出现严重问题需要回退到 dev 直接操作：

1. 移除 `dev` 的 `BRANCH_FROZEN.md`
2. 废弃当前 `prod/Wxx` PR
3. 问题代码变更在 `dev` 直接修复并 PR 到 `main`
4. 问题解决后重新执行 Phase 3e 冻结

回退触发条件：
- 自开发回路 `prod/Wxx → main` PR 连续 3 次 CI 失败
- TriCode/OpenCode 不可用超过 48 小时
- 自开发回路产生的代码质量被 CPO/CTO 连续拒绝 3 次

## 6. 检查清单模板

执行降级时使用以下 checklist 逐项跟踪：

```markdown
## 实验环境降级 Checklist

### Phase 3a: 前置条件
- [ ] 自开发回路全通路验证
- [ ] 自开发变更周期完成
- [ ] CI 门禁验证
- [ ] main 初始化完成
- [ ] TriCade 1.0 正式运营开始

### Phase 3b: 冻结
- [ ] BRANCH_FROZEN.md 写入
- [ ] 联合签核
- [ ] 全员通知
- [ ] 归档快照

### Phase 3c: 提炼场初始化
- [ ] docs/experiments/ 创建
- [ ] 历史实验归档
- [ ] operating-records 清理
- [ ] STATE.md 更新

### Phase 3d: Agent 迁移
- [ ] .github/agents/ 注入
- [ ] .github/instructions/ 注入
- [ ] .github/prompts/ 注入
- [ ] source-agents/ 注入
- [ ] dev 侧标记 frozen-reference

### Phase 3e: 验证与收尾
- [ ] main/dev 一致性确认
- [ ] 实验→提炼→注入流程验证
- [ ] TriCade Agent 读取 main 确认
- [ ] README-FROZEN.md 写入
- [ ] 联合签核

### 执行记录
- 计划执行日期：{date}
- 实际执行日期：{date}
- 执行人：CTO 小狄
- 审批人：CPO / CEO
- 异常记录：
```

## 7. 变更日志

| 日期 | 版本 | 变更说明 |
|------|------|---------|
| 2026-08-02 | V0.1 | 初版 — 降级五阶段计划、双环境对比、回退方案、检查清单 |
