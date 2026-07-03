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
