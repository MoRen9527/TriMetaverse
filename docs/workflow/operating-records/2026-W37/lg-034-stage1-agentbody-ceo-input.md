# LG-034 阶段 1 首件组审·CEO 意见原文（派工输入件）

- sourceOfTruth: BOD 转令（2026-09-10 23:33+0800）中的 CEO 意见原文逐字转录
- syncMode: frozen（一次性派工输入，评审期间不改）
- lastSyncedAt: 2026-09-10T23:37+0800（COO 落盘）
- 靶标: `TriCompany/source-agents/business-strategy/agent-body.agent.md`（74 行，实勘 2026-09-10 23:37+0800）
- 铁律条 0 触发记录: CEO IDE 打开+提意见（本件）→ COO 组审下发；一次一个文件

## CEO 意见原文（BOD 转令逐字转录）

【总判断】文件真源在 TriCompany 向项目维度发布，与同级文件组成非人格 agent——不应有 colleagues/soul/social 人格件；主要职责=统筹把控项目维度商业模式（本项目依据 TriMetaverse/tmv-whitepaper.md）+项目各模块功能与边界（依据 TriMetaverse/docs/三元宇宙架构与模块说明.md 及各模块 docs/registry）+与 CompanyGovernanceRegistry 配合完成公司/项目治理规则、文件真源管理（文档治理与真源文件系统.md）等。

① tmv-whitepaper.md 是否应统一收归 TriMetaverse/docs/ 下。

② CompanyGovernanceRegistry 在 source-agents/ 下应否独立文件夹并拆 body/frontmatter/contract.yaml；各模块下设标准 registry 四件套（business-state/code-state/product-state/readme）。

③ CompanyGovernanceRegistry 规范各模块 docs 标准件套：contract（联审裁）/engineering/execution/product/registry/training/workflow/prd（联审裁）/testing（联审裁）/runs（联审裁），明确各件功能与边界。

④ description 过时清理：「TriMC 统一运行面」已不存在；「赛博公司经营载体」何以归商业模式（联审裁）；「TriModel Provider/Model 配置层」何以归商业模式（联审裁）；「入口策略」是啥（联审裁）；「正式上线切换阶段」=历史口径（源自当初 copilot→TriMC 切换），架构大改后此叙事面已不存在。

⑤ 运行宿主基线（联审核实）：
- a. TriMC 已不存在，服务域=TriMMC+TriRMC，本地域=TriMLC+TriRLC；runtime 应为 M面 claude code runtime+R面 agent-core（待确认）。
- b. M面 TriMMC、R面 TriRMC 仍有主控含义。
- c. TriModel 实际定位=类 CC Switch 自由切换模型 key/Provider（此句仅理解用，不入文档）；Tride 已废弃更名 TriCode（联审验证裁）——原为本地域 LC 的 glue 层（M面/R面直接驱动 opencode/claude code/codex），现有 M→R 演进系统后仅给 RLC 面用户多一选择。
- d. TriPilot+TriCode（glue 上 opencode/claude code/codex）+trilc chat（CLI）+VSCodium 共同构成 TriCade（PC 端）=TriRLC 层；主开发=agent-core，TriPilot/trilc chat 仅为 IDE/CLI 入口，TriCode 不承担主要开发工具；orchestration 仅在 MC 层（M面+R面）；宿主切换仅在 M面（经 fade 标准真源发布渲染宿主模型至项目根 .github/ 或 .claude/）；TriCade=TriRLC 层本地自动化+编码工具。
- e. shadow 与「正式接管」均过时叙事——已不存在 copilot 宿主→TriMC 切换；此判断须 C-level 层记住并记入 CompanyGovernanceRegistry（公司多文档仍带此叙事未更新）；copilot chat 入口不存在，现 IDE 入口=Tripilot，CLI 入口=trilc chat。
- f. TriMetaverse V1=M面+R面最小 MVP 成熟点，发布前需与 CEO 确认。

⑥ 信息源优先级：project.md 大量过时叙事，整体改写留痕（或单独拿审）；是否移入 docs/（该文件应描述整个项目）；TriCompany.md 同样问题；信息源清单缺 CLAUDE.md——随宿主添加的文件须在 CompanyGovernanceRegistry 记录并提醒员工检查更新。

⑦ 中央收口是否交由 COO 管理、CompanyGovernanceRegistry 执行（联审裁）。

⑧ 更新策略：不再依赖用户明示——由负责模块管理的 agent（如 TriCompany 模块的 tricompany.agent.md 小赛）走对应 fade 自动更新。

## 标注约定

「联审裁」=该条须联审席位出裁决性意见；「待确认」=CEO 本人标注未定项；其余=CEO 判断，席位可证伪补充。
