# Business Strategy Boundaries

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/business-strategy-boundaries.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

## 模块边界基线

当前文件是 TriMetaverse 中央边界 registry 的本地真源，只维护跨模块边界、模块职责和边界变动规则；它不是 TriCompany 公司级 workflow 书面真源。

- `TriMetaverse` 负责中央战略、阶段门禁、项目级真源约束、workflow 和赛博公司实施落地侧的中央发布口径，不直接承担模块代码实现。
- `TriCompany` 负责赛博公司研发仓、经营编排孵化、岗位对象、Hermes 记忆系统吸收和当前阶段 Copilot 宿主资产；赛博公司规则、岗位规则、registry 规则等实施侧真源先在 TriCompany source 侧决定，再按发布规则同步到 TriMetaverse 中央摘要层。
- `TriMC` 负责统一 agent runtime 与 interaction core；服务域任务执行与研发工作流都属于它的运行切片。当前继续吸收 OpenClaw 的心跳、cron / 定时任务与 agent harness 设计，模型接入通过 `TriModel` 统一配置。
- `TriModel` 负责 Provider/Model 统一配置，为 `TriMC` 与 `Tride` 两个 orchestration 提供多 provider 适配、模型路由与 fallback 链；在真实实现落地前应明确标注为待初始化。
- `TriSkill` 负责未来统一 skill 提供；在真实实现落地前应明确标注为待初始化。
- `Tride` 负责 PC 端软件中的 vibe coding 工具适配、agentic orchestration、runtime/CLI 与工具调用能力，不单独定义总体商业模式，也不再作为切换后的正式宿主。
- `TriPilot` 与 `vscodium` 负责 PC 端软件中的用户交互入口与 IDE 宿主基础设施，但不单独决定总体商业路线；当前物理仓库路径仍为 `TriPilot/`，后续 repo rename 需另行确认。
- `TriLC` 与 `TriMobile` 负责本地域能力；其中 `TriLC` 是配合 `TriMC` 调度龙虾 / Hermes / 其他 agents 的本地适配与执行层。
- `TriDev` 负责自动化开发流程、本地正式接管前后的阶段 gate、版本签发、归档与 shadow test 流程沉淀；当前仍处待开发状态。
- `TriMem` 负责用户体系、身份关联和数据库设计。
- `TriWeb4` 与 `TriChain` 负责钱包、合约、公链相关能力。
- `TriGateway` 是网关模块的规范化中央名称；规范目录已修正为 `TriGateway/`，历史路径 `TriGatway/` 暂作为平滑迁移兼容别名；在 README / AGENTS / 真实实现落地前不得写成已具备网关能力。
- `TriStaciss` 负责模型路由中转站、API 调用平台、多提供商路由和官方 SDK 能力边界适配；当前物理仓库路径仍为 `TriStaciss/`。
- `TriAvatar` 负责 Web 入口、未来数字宠物、赛博分身、赛博任务、浏览器插件形态和未来游戏入口；当前物理仓库路径仍为 `TriAvatar/`。
- `TriDeployment` 与 `TriTest` 分别负责开发后的自动部署、部署后的系统级端到端测试与安全测试；当前 `TriDeployment` 物理仓库路径仍为 `TriDeployment/`。
- `core-agent` 只作为 `TriMC` observability 的历史迁移源。

## 边界变动记录规则

当出现以下情况时，应更新本文件或 `business-strategy-evolution-log.md`：

- 某模块新增或移除商业职责
- 某条商业路径不再需要某模块
- 某低成熟模块从占位升级为现役能力
- 某历史模块被正式降级为只读参考源

## 当前重点边界

- 首轮经营试点默认不把 `TriMobile`、`TriMem`、`TriWeb4`、`TriChain` 当成阻塞前提。
- 当前 shadow 与正式接管都直接运行在 `copilot` 宿主上；正式切换通过 `TriModel` 配置实现，不能把 `Tride` 写成当前正式宿主。
- `TriPilot`、`Tride` 与 `vscodium` 共同组成 PC 端软件层，但仍然分开维护本地事实。
- PC 端软件层既配合 `TriLC` 完成本地化任务、本地工具链执行和部分服务域下发任务，也面向用户提供可直接使用的 PC 自动化与 `vibe coding` 工具入口。
- `TriSkill` 当前属于未来统一 skill 模块预留，不作为首轮试点阻塞前提。
- `TriStaciss` 先用 `CLAUDE.md` 作为委派真源，README 由后续 `TriStacissProductRegistry` 负责。
- `TriGateway` 当前统一按规范名书写，但在迁移期仍必须单列历史别名 `TriGatway/`，直到 workspace、脚本与外部引用全部完成统一。
- 命名规范化优先采用产品 canonical name：`TriPilot`、`TriStaciss`、`TriAvatar`、`TriDeployment`；当前仅更新产品与 registry 口径，不直接重命名既有仓库目录、npm package、历史路径或 Git remote。
