---
description: "适用场景：修改 TriMetaverse 中回迁的 TriCompany shadow-test 总助、tricompany-ceo-chief-of-staff.agent.md、tricompany-ceo-chief-of-staff.soul.md、tricompany-ceo-chief-of-staff.memory.md、tricompany-ceo-chief-of-staff.colleagues.md、tricompany-ceo-chief-of-staff.social.md、tricompany-开始会议.prompt.md、tricompany-结束会议.prompt.md 时使用。约束 shadow-test 总助套件和会议入口的维护边界。"
name: TriCompany CEOChiefOfStaff Maintenance Rules
applyTo: ".github/agents/tricompany-ceo-chief-of-staff.agent.md, .github/agents/tricompany-ceo-chief-of-staff.soul.md, .github/agents/tricompany-ceo-chief-of-staff.memory.md, .github/agents/tricompany-ceo-chief-of-staff.colleagues.md, .github/agents/tricompany-ceo-chief-of-staff.social.md, .github/prompts/tricompany-开始会议.prompt.md, .github/prompts/tricompany-结束会议.prompt.md"
---
# TriCompany 总助套件维护规则

本说明只约束 TriCompany 中总助套件的维护方式，不替代 agent 本体的运行时行为。

## 文件分工

- tricompany-ceo-chief-of-staff.agent.md：总助运行时主规范。
- tricompany-ceo-chief-of-staff.soul.md：人格、气质和对话质感。
- tricompany-ceo-chief-of-staff.memory.md：阶段性记忆与当前重点。
- tricompany-ceo-chief-of-staff.colleagues.md：工作协作档案。
- tricompany-ceo-chief-of-staff.social.md：社交档案。
- 开始会议 / 结束会议 prompt：会议专用入口。

## 维护边界

- 不要把运行时行为全部拆散到多个文件里；真正生效的职责边界仍保留在 agent 本体。
- 不要在 agent 本体里重新引入“你的记忆文件位于哪里”这类显式底层文件感知。
- 如果修改的是人格和口吻，优先改 soul。
- 如果修改的是阶段任务、边界归属和优先级，优先改 memory。
- 如果修改的是工作关系，优先改 colleagues。
- 如果修改的是闲聊与非正式互动，优先改 social。
- 如果修改的是会议入口动作，优先改 prompt，而不是把命令细节塞回 agent 本体。

## 对齐要求

- TriCompany 当前属于研发仓，同时承载本地正式接管宿主资产；涉及 Hermes 正式宿主化的内容要明确标为待验证。
- 当前阶段总助套件起点来自回迁到 TriMetaverse/.github 的 shadow-test 宿主资产层，当前 live 状态已转为本地正式接管；修改时要注意同时检查产品真源和技术真源是否需要同步更新。
- 任何会影响产品真源或技术真源的耐久变化，都要评估是否同步给 TriCompanyProductRegistry 或 TriCompanyCodeRegistry。
- 总助要保持真实总助质感，不能退化成系统提示器或文件操作员。