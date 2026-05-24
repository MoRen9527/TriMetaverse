# Business Strategy Boundaries

## 模块边界基线

- `TriMetaverse` 负责总战略、阶段门禁、workflow 和虚拟公司治理，不直接承担模块代码实现。
- `TriCompany` 负责虚拟公司研发仓、经营编排孵化、Hermes 融合草案和当前阶段 Copilot 宿主资产，不替代中央战略仓，也不自动等于正式宿主。
- `TriMC` 负责统一 agent runtime 与 interaction core；服务域任务执行与研发工作流都属于它的运行切片。
- `TriHost` 负责宿主适配、多 host 配置与正式切换承载；在真实实现落地前应明确标注为待初始化。
- `TriSkill` 负责未来统一 skill 提供；在真实实现落地前应明确标注为待初始化。
- `Tride` 负责 PC 端软件中的开发工具链、agentic orchestration、runtime/CLI 与工具调用能力，不单独定义总体商业模式，也不再作为切换后的正式宿主。
- `Tripilot` 与 `vscodium` 负责 PC 端软件中的用户交互入口与 IDE 宿主基础设施，但不单独决定总体商业路线。
- `TriLC` 与 `TriMobile` 负责本地域能力。
- `TriDev` 负责自动化开发流程、本地正式接管前后的阶段 gate、版本签发、归档与 shadow test 流程沉淀；当前仍处待开发状态。
- `TriMem` 负责用户体系、身份关联和数据库设计。
- `TriWeb4` 与 `TriChain` 负责钱包、合约、公链相关能力。
- `TriGateway` 是网关模块的规范化中央名称；规范目录已修正为 `TriGateway/`，历史路径 `TriGatway/` 暂作为平滑迁移兼容别名；在 README / AGENTS / 真实实现落地前不得写成已具备网关能力。
- `Tristaciss` 负责模型 SDK 接口转换、API 平台和多提供商路由。
- `Triavatar` 负责 Web 入口、虚拟形象和未来游戏入口。
- `Trideployment` 与 `TriTest` 负责上线、部署、测试和质量门禁。
- `core-agent` 只作为 `TriMC` observability 的历史迁移源。

## 边界变动记录规则

当出现以下情况时，应更新本文件或 `business-strategy-evolution-log.md`：

- 某模块新增或移除商业职责
- 某条商业路径不再需要某模块
- 某低成熟模块从占位升级为现役能力
- 某历史模块被正式降级为只读参考源

## 当前重点边界

- 首轮经营试点默认不把 `TriMobile`、`TriMem`、`TriWeb4`、`TriChain` 当成阻塞前提。
- 当前 shadow 与正式接管都直接运行在 `copilot` 宿主上；正式切换通过 `TriHost` 配置实现，不能把 `Tride` 写成当前正式宿主。
- `Tripilot`、`Tride` 与 `vscodium` 共同组成 PC 端软件层，但仍然分开维护本地事实。
- PC 端软件层既配合 `TriLC` 完成本地化任务、本地工具链执行和部分服务域下发任务，也面向用户提供可直接使用的 PC 自动化与 `vibe coding` 工具入口。
- `TriSkill` 当前属于未来统一 skill 模块预留，不作为首轮试点阻塞前提。
- `Tristaciss` 先用 `CLAUDE.md` 作为委派真源，README 由后续 `TristacissProductRegistry` 负责。
- `TriGateway` 当前统一按规范名书写，但在迁移期仍必须单列历史别名 `TriGatway/`，直到 workspace、脚本与外部引用全部完成统一。
