# TriMetaverse Code State

## Repository Map

- `.github/agents/`：角色 agent、registry agent 及其配套 memory / soul / colleagues / social 资产
- `.github/prompts/`：可在聊天中直接调用的专用 prompt 命令，例如会议开始 / 结束入口
- `docs/`：workflow、架构、治理和运行文档
- `mermaid/`：图示资产和导出文件
- `scripts/`：辅助脚本
- 根目录 `.md`：白皮书、价值流动、阶段计划和方案文档

## Current Code Health

- 本仓库的“代码健康”主要体现为文档结构、脚本资产和图示资产的一致性，而不是业务服务代码覆盖率。
- 当前未建立系统化的仓库健康评分基线。

## Change Tracking Baseline

- 关键变化应优先体现在白皮书、workflow 和 registry 文档中。
- 所有代码设计、实现、修改和维护，都应同步回写代码文档，不能把代码变更只留在源码与聊天记录里。
- 重大边界变化应同步记录到 `business-strategy-boundaries.md` 或 `business-strategy-evolution-log.md`。
- 涉及 `TriMC`、`TriHost`、`TriSkill` 或 PC 端软件层（`TriPilot` / `Tride` / `vscodium`）的中央边界变化，应优先同步回写中央 registry，再扩散到模块级登记层。
- 对 `CEOChiefOfStaff` 及其他 role-agent 的本体 / soul / memory / 配套制度的耐久优化，若构成可复用结构变化，应同步评估是否回写 `product-state.md` 与 `code-state.md`。
- 对总助会议流程新增的专用 prompt 命令，也应视作可复用的仓库结构与协作入口变化。
- 对总助新增的工作协作档案和社交档案，也应视作可复用的配套资产结构变化，用于分别承接工作关系连续性与闲聊社交连续性。
- 各项目代码仓库后续应按 `模块六层文档协同系统` 建立文档基线；即默认建立 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/`，其中技术侧负责 `DESIGN.md`、技术版 `ROADMAP.md`、技术版 `STATE.md`，执行层负责各阶段 `PLAN.md`、`SUMMARY.md`、`VERIFICATION.md`，`registry` 负责模块事实登记，`workflow` 负责模块流程入口与机制文档，`training` 负责岗位、模块、代码和流程导读。
- 技术目录统一使用 `engineering`，因为这里承接的是设计、实现顺序、质量与交付工程，而不只是零散“技术说明”或源码笔记。
- 各模块的 `Code Registry` 不应只做目录摘要；它应按具体业务走线拆分维护代码文档，用教学式、逐段到逐行可读的方式解释入口、调用链、关键对象、配置流、状态流和边界，让小白读完后能迅速理解整个模块设计与各业务代码调用流程。
- 各模块的业务线教学代码文档还必须补清端到端关系：这一条业务的输入生产者是谁、输出消费者是谁；如果不是数据业务流，也要写清对应的请求发起方、处理环节、结果承接方和后续消费方。
- CodeGraph 定位为各模块 `Code Registry` 的本地辅助索引资产，只用于帮助识别入口、依赖、调用链和变更热区；它不替代 `code-state.md`、教学级代码文档、源码阅读结论或人工收口判断。
- CodeGraph 初始化按现役代码模块波次试点推进，优先覆盖 `TriStaciss`、`TriMC`、`Tride`、`TriPilot` 等已有真实源码和模块真源的仓库；低成熟 / 占位模块在 README、AGENTS、源码骨架或模块 registry 未落地前暂缓初始化。
- `.codegraph/` 应保持为本地生成物和缓存，不提交为仓库真源；可提交的只有由对应模块 `CodeRegistry` 审阅后的摘要、排除规则、扫描时间、commit / 版本锚点、主要发现和待确认缺口。
- `docs/workflow/handoff-templates/*.example.json` 与 `docs/workflow/operating-cycle-example/*.sample.json` 属于样板 / fixture 层资产；它们可用于 schema 对齐、workflow 演示和 runtime validation，但不能单独作为中央 registry 回写、项目事实摘要或模块已确认状态的直接证据。

## Git Health

- 尚未建立 registry 级 git 健康摘要。
- 需要后续 `TriMetaverseCodeRegistry` 在明确要求下补充分支、变更热区和健康规则。

## Cross-Module CodeGraph Pilot

- 2026-05-24 已完成现役代码模块本地 CodeGraph 试点初始化与收口：`TriStaciss`、`TriMC`、`Tride`、`TriPilot`、`TriAvatar`、`TriLC`、`TriDeployment`、`TriCompany` 均形成可用本地摘要；`TriTest` 与 `vscodium/patches` 完成 CodeGraph 探测但未产出可用语义图，由对应 CodeRegistry 接管“不适用 / parser 不覆盖”限制说明。
- 中央层只记录试点状态和跨模块续跑规则；各模块 CodeGraph 摘要由对应模块 `CodeRegistry` 接管，`.codegraph/` 缓存不进入仓库真源。
- 首批索引摘要：
  - `TriStaciss`：149 files，1,686 nodes，2,827 edges。
  - `TriMC`：17 files，82 nodes，144 edges；已排除 `node_modules/` 与 `vendor/openclaw/`，只覆盖 `src/` 与 `test/` 自研现役代码面。
  - `Tride`：869 files，11,120 nodes，23,596 edges。
  - `TriPilot`：23 files，545 nodes，2,000 edges；仓库瘦身后已重建仓根干净索引。
  - `TriAvatar`：102 files，888 nodes，1,342 edges；仓库瘦身后已重建仓根干净索引。
  - `TriLC`：10 files，39 nodes，48 edges；已排除 `vendor/openclaw/`，只覆盖本地域控制器自研 TypeScript 面。
  - `TriDeployment`：9 files，2 nodes，0 edges；当前以模板、profile 和 PowerShell 工具为主，CodeGraph 只提供弱语义摘要。
  - `TriCompany`：100 files，1,494 nodes，3,042 edges；已排除 `.tricompany-cognition/`、`vendor/`、依赖目录和构建产物。
  - `TriTest`：0 files，0 nodes，0 edges；当前主要为 PowerShell / Markdown 模板，现有 CodeGraph parser 未产出可用图。
  - `vscodium/patches`：0 files，0 nodes，0 edges；当前主要为 `.patch` 文件，现有 CodeGraph parser 未产出可用图；不对仓根、`upstream/` 或上游源码镜像建索引。
- CodeGraph Wave 2 现役代码模块试点可收口；后续只在模块真实源码骨架、parser 覆盖能力或 CTO 技术线明确要求出现时，再评估低成熟 / 占位模块。

## Quality Risks

- 文档先于实现的风险较高。
- 多仓演进可能导致模块边界文档过时。
- 若不持续区分 `TriMC` 运行面、`TriHost` 宿主适配层与 PC 端软件层，中央登记会再次回退到旧三主控语义。
- 若把 `TriSkill` 的预留状态误写成现役能力，会高估统一 skill 供给能力并误导实现顺序。
- 若不持续回写 registry，中央策略容易与模块现实脱节。
- 总助记忆管理目前仍以文档驱动的手工简化版为主，后续若不继续工程化，容易再次漂移。
- 若把 `handoff-templates` 或 `operating-cycle-example` 下的 example/sample 文件直接当作事实引用，会把样板层误写成真源层，并高估中央收口、经营记录或模块现实进度。

## Sources

- `../../docs/`
- `../../scripts/`
- `../../mermaid/`
- `business-strategy-boundaries.md`
- `business-strategy-evolution-log.md`
- `../workflow/project-repo-document-baseline.md`
