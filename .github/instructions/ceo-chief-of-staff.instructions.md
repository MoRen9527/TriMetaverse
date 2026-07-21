---
description: "适用场景：修改 CEOChiefOfStaff、小贾、ceo-chief-of-staff.agent.md、开始会议.prompt.md、结束会议.prompt.md、日常收口.prompt.md、待办复查.prompt.md、review-backlog.prompt.md、周度平移.prompt.md、中央收口.prompt.md、中央收口输出模板.prompt.md、PRD归属路由.prompt.md、开发任务.prompt.md、dev-task.prompt.md 时使用。约束当前 live 总助入口、会议/收口 prompt 命令和 registry 同步规则的维护边界；总助 soul/memory/colleagues/social 四层契约回到 TriCompany 源侧五件套维护。"
name: "CEOChiefOfStaff Maintenance Rules"
applyTo: ".github/agents/ceo-chief-of-staff.agent.md, .github/prompts/开始会议.prompt.md, .github/prompts/结束会议.prompt.md, .github/prompts/日常收口.prompt.md, .github/prompts/待办复查.prompt.md, .github/prompts/review-backlog.prompt.md, .github/prompts/周度平移.prompt.md, .github/prompts/中央收口.prompt.md, .github/prompts/中央收口输出模板.prompt.md, .github/prompts/PRD归属路由.prompt.md, .github/prompts/开发任务.prompt.md, .github/prompts/dev-task.prompt.md"
---
# CEO 总助配套文件维护规则

本说明只用于约束 `CEOChiefOfStaff` 配套文件的维护方式，不替代总助 agent 本体的运行时行为定义。

## 文件分工

- `.github/agents/ceo-chief-of-staff.agent.md` 是当前 Copilot-host live 总助的运行时主规范。
  这里保留岗位职责、决策方式、行为护栏、默认输出结构和调用时真正生效的行为说明。
- `TriCompany/.github/source-agents/ceo-chief-of-staff/ceo-chief-of-staff.soul.md`、`.memory.md`、`.colleagues.md`、`.social.md` 是总助源侧四层认知契约。
  这些文件不再在 `TriMetaverse/.github/agents` 下保留 live 兼容副本；如需修改人格、记忆层、协作层或社交层契约，应回到 TriCompany 源侧五件套，再通过 support object / binding profile 发布。
- `.github/prompts/开始会议.prompt.md`、`.github/prompts/结束会议.prompt.md`、`.github/prompts/日常收口.prompt.md`、`.github/prompts/待办复查.prompt.md`、`.github/prompts/review-backlog.prompt.md`、`.github/prompts/周度平移.prompt.md`、`.github/prompts/中央收口.prompt.md`、`.github/prompts/中央收口输出模板.prompt.md`、`.github/prompts/PRD归属路由.prompt.md`、`.github/prompts/开发任务.prompt.md` 和 `.github/prompts/dev-task.prompt.md` 用于承载专用式会议 / 收口 / 归属路由 / 任务下发命令或标准输出模板。
  这里负责把“开始会议 / 结束会议 / 日常收口”收口成明确动作，不替代总助 agent 本体的长期行为规范。

## 维护边界

- 不要把总助真正的行为说明整体搬出 `.agent.md`。
  custom agent 的主体仍应保留在 `.agent.md`，否则运行时职责会分裂。
- 不要在 `TriMetaverse/.github/agents` 下重新创建 `ceo-chief-of-staff.soul.md`、`.memory.md`、`.colleagues.md` 或 `.social.md`；这些属于历史兼容文件，已回收到 TriCompany source + support workspace 链路。
- 如果只是补充“如何维护总助三件套”的规则，优先写在当前 instruction 文件，不要继续膨胀 `.agent.md`。
- 如果修改的是人格和说话方式，优先更新 `TriCompany/.github/source-agents/ceo-chief-of-staff/ceo-chief-of-staff.soul.md`。
- 如果修改的是 memory / colleagues / social 的层契约、写入边界或运行资产落点，优先更新 TriCompany 源侧对应 `.memory.md`、`.colleagues.md` 或 `.social.md`。
- 如果修改的是具体阶段任务、四象限、人物档案、称呼偏好、社交事件、协作事项或 workflow 写回摘录，优先写入 support employee workspace 或 runtime cognition state，不写入源码 / live 入口文件。
- 如果是项目级持续偏好、会议回填口径、宿主记忆边界或其他需要跨会话保留的总助资产，必须优先落在 TriCompany 源侧五件套、`.github/prompts/`、`docs/workflow/operating-records/`、`CompanyGovernanceRegistry` 或 support root 文档中，不把 VS Code 用户级 `globalStorage/github.copilot-chat/memory-tool` 当成项目真源。
- 如果运行消费数据经复核后升级为稳定组织事实，再同步到 CompanyGovernanceRegistry、workflow、operating records 或其他正式真源，而不是直接回灌到 `.colleagues.md` / `.social.md`。
- 如果修改影响到岗位职责、授权边界、决策三分法、会议主持职责、输出结构或行为护栏，必须更新 `.agent.md`。
- 如果修改的是会议开始 / 结束 / 日常收口 / 待办复查 / 周度平移 / 中央收口这类专用入口命令，或中央收口标准输出模板，优先更新 `.github/prompts/` 下对应 prompt 文件，而不是把命令细节塞回 `.agent.md`。
- 这三类 prompt 如需触发 cognition writeback，应优先通过 `runtime/cognition/chief_of_staff_workflow_bridge.py` 的统一入口执行，不要把桥接细节分别散落到多个 prompt 或 agent 正文里。

## 对齐要求

- 总助三件套及相关会议 prompt 命令默认以中文为主，便于直接阅读、审核和修改。
- VS Code 用户级 `globalStorage/github.copilot-chat/memory-tool` 只视为实现缓存，不视为项目资产；若发现项目事实只存在于该处，必须先回迁到仓库，再继续使用。
- 总助在对话里要保持“真实总助”质感，不能退化成客服、表单机器人、脚手架说明器或系统提示器。
- 记忆管理继续保持当前最简单一版：时间戳、四象限、情绪标签、有限遗忘。
- CPO 与 CTO 已在当前 Copilot-host live 阶段上岗，并已补齐源侧 agent / soul / memory / colleagues / social 与 support object 生成链；编辑总助文件时不要把这条写成 TriMC 正式宿主切换或完整授权矩阵完成。
- 所有针对 `CEOChiefOfStaff` 的耐久优化，都要评估是否同步给 `TriMetaverseProductRegistry`、`TriMetaverseCodeRegistry` 以及相关 registry 状态文档。

## 修改时的检查清单

- 这次改动属于运行时行为、人格表达，还是记忆管理？
- 是否把内容放到了正确文件，而不是三个文件重复堆叠？
- 是否仍然保持总助口吻、人味和经营执行感？
- 是否破坏了当前已定下的 JD、记忆管理基线、秘书处归属或 registry 同步规则？
- 如果是耐久规则变化，是否需要同步更新相关 registry 或制度文档？

## Trees 工作流自动流转规则

> **权威声明**：本文件是 `task_trees` / `tree_nodes` 状态枚举的权威定义源。AGENTS.md 及其他文件引用此处，不自行复制。

总助（小贾）持有并驱动所有任务树（`task_trees` + `tree_nodes`）。以下规则定义了树的启动、流转和收口自动化行为。

### 树的启动

当 CEO 或执行节点发起一个新工作流时：

1. 在 SQL 中创建 `task_trees` 记录（`status='active'`，`root_agent='CEOChiefOfStaff'`）
2. 创建根节点 `tree_nodes`（`status='in_progress'` 或 `done`，`agent='CEOChiefOfStaff'`）
3. 创建物理目录 `docs/workflow/operating-records/20*-W*/trees/<tree-id>/`
4. 写入 `tree-op.json`（含 `nodes[]`、`relatedDocuments`、`metadata`）
5. 更新周 OP JSON：`activeTrees[]` 中添加该树
6. 如果简报/裁决/设计文档已存在，放入同目录，登记到 `relatedDocuments`

### 自动流转规则

由总助监控 `tree_nodes` 状态，根据 `next_agent` 字段自动生成下一个节点：

```
当前节点 status='done'（或执行节点报告完成）
  │
  ├── next_agent 已指定（如 'ChiefProductOfficer'）
  │     → 创建新节点：status='in_progress'，agent=<next_agent>
  │     → 报告： "<tree-id>: <当前节点> done → <next_agent> <新节点>"
  │
  ├── next_agent = NULL
  │     → 兜底路由到 CEOChiefOfStaff
  │     → 创建新节点：status='in_progress'，agent='CEOChiefOfStaff'
  │     → 报告： "<tree-id>: <当前节点> done → 小贾（路由评估）"
  │     → 小贾收到后评估状态，决定下一岗位，更新 next_agent 并流转
  │
  └── 当前节点已完成且 next_agent = NULL 且小贾评估后无需后续
        → 不创建新节点，树标记为 done
        → 报告： "<tree-id> 闭合，全部节点 done"
```

### 子节点插入

当现有工作流需要补充裁决或修正时（如 `cpo-trimodel-1b` 插入在 1 和 2 之间）：

- 插入节点使用 `parent_node_id` 指向被扩展的父节点
- 插入节点 `seq` 取父节点 + 0.5（如父节点 seq=1，插队节点 seq=1.5）
- 插入节点完成后，原 `next_agent` 链路从插队节点继续

### 收口检查

每次关闭一棵树或完成节点交付时，执行协议 §收口检查清单 中的 5 项检查。最关键的两步：

1. `scripts/validate-tree-status-enums.ps1` — 确认 0 issues
2. 物理目录 vs SQL 交叉比对 — 每棵树都有 `trees/<tree-id>/tree-op.json`

### 跨周迁移

周度平移（COS-004）时：

1. 复制活跃树的 `trees/<tree-id>/` 目录到新周
2. 更新 `tree-op.json` 中 `parentWeekPlan` 指向新周 OP
3. 新周 OP JSON：活跃树加入 `activeTrees[]`，done 树加入 `doneTrees[]`
4. 旧周 OP JSON：`status='closed'`，`metadata.migratedTo` 指向新周
5. 归档树目录保留在旧周（不删除），作为历史记录

### 状态枚举

| 层级 | 有效值 |
|------|--------|
| 树级 (`task_trees.status`) | `active / done / escalated` |
| 节点级 (`tree_nodes.status`) | `pending / in_progress / done / escalated` |

废弃枚举：`closed`、`active`（节点级）。
