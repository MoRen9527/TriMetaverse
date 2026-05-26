# TriMetaverse Agent Rules

## Agent Families

- `Registry Agents` 是无人格资料中枢，只负责事实、状态、边界、索引和记忆。
- `Role Agents` 是有人格岗位执行体，只负责经营判断、推进和协同。

## Central Strategy Registry

- `BusinessStrategy` 是整个三元宇宙的中央 `Strategy Registry`。
- 遇到以下问题时，必须先咨询 `BusinessStrategy`：
  - 总商业模式、当前商业模式实验、阶段与商业目标映射
  - 模块边界变化、模块优先级、模块是否参与某条商业路径
  - 服务域 / 本地域 / 用户入口 / 钱包合约 / 公链 / 测试部署在当前方案中的作用
  - 接下来应该查询哪个模块的 `Business Strategy Registry`、`Product Registry`、`Code Registry`，或公司级 `CompanyGovernanceRegistry`

## Registry Convention

- 模块商业模式资料 agent 统一命名为 `<Module>BusinessStrategyRegistry`。
- 模块产品资料 agent 统一命名为 `<Module>ProductRegistry`。
- 模块代码资料 agent 统一命名为 `<Module>CodeRegistry`。
- 公司级公司治理资料 agent 固定命名为 `CompanyGovernanceRegistry`。
- 当模块已建立 `docs/registry/business-state.md` 时，该文件是同模块 `product-state.md` 与 `code-state.md` 的业务上游约束；若中央 `BusinessStrategy` 与模块 business registry 冲突，先以中央边界裁决为准。
- 在模块级 registry agent 尚未落地前，先使用该模块根目录的 `AGENTS.md`、`README.md`、设计文档和源代码树，并显式报告资料缺口。

## Architecture Routing

- 涉及 `TriMetaverse/reference/`、开源吸收链、模块 `vendor/` 布局与“最小版先跑通”的项目级说明，统一查看 `docs/三元宇宙架构与模块说明.md` 中的“TriMetaverse reference说明”。
- 如开源吸收动作会引入新的长期主模块或改变既有模块边界，必须先咨询 `BusinessStrategy`；在中央真源口径更新前，不得把边界变化写成既成事实。

## Source Of Truth Order

1. `tmv-whitepaper.md`
2. `project.md`
3. `cyber-company.md`
4. `docs/三元宇宙架构与模块说明.md`
5. `docs/workflow/cyber-company-agent-roles.md`
6. `docs/registry/*.md`

说明：`docs/三元宇宙架构与模块说明.md` 用于承接项目级架构说明、模块说明与 `reference` 层口径，不替代白皮书、`project.md` 或 `cyber-company.md`；`docs/registry/*.md` 是工作型登记层，也不替代上面的真源文档。出现冲突时以上游真源为准。

- 项目级持久偏好、会议回填口径、宿主资产边界和运营事实必须落在仓库文件中；Copilot `memory-tool` 的 user/session/repo scope 只视为宿主侧缓存或临时辅助，不视为项目真源。

## Update Discipline

- 只有在用户明确要求“记录”或“更新”时，registry 文档才允许被修改。
- 默认先解释事实、指出来源，再给出下一步应查询的 registry 或文档。
- 对低成熟模块必须如实标记为“占位 / 待初始化 / 当前无代码”，禁止虚构进度。
