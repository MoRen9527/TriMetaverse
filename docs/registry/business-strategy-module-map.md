# Business Strategy Module Map

| 模块 | 当前商业职责 | 何时必须纳入商业判断 | 当前成熟度 | Business Strategy Registry | Product Registry | Code Registry | 当前主要真源 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TriMetaverse` | 总商业模式、阶段、workflow、虚拟公司规则与中央边界真源 | 任何战略、阶段、运行边界和模块取舍问题 | 高 | 中央先经 `BusinessStrategy` 判范围；模块内由 `TriMetaverseBusinessStrategyRegistry` | `TriMetaverseProductRegistry` | `TriMetaverseCodeRegistry` | `../../tmv-whitepaper.md`, `../../project.md`, `../../virtual-company.md` |
| `TriCompany` | 虚拟公司研发仓与经营编排孵化仓，沉淀产品/工程/registry 文档、Hermes 融合草案与当前阶段 Copilot 宿主资产 | 涉及虚拟公司研发编排、Hermes 融合草案、Copilot 宿主资产或试运行宿主承载时 | 中 | `TriCompanyBusinessStrategyRegistry` | `TriCompanyProductRegistry` | `TriCompanyCodeRegistry` | `../../../TriCompany/README.md`, `../../../TriCompany/AGENTS.md` |
| `Tride` | PC 端软件中的开发工具与 orchestration 底座，负责 CLI/runtime/SDK 与开发能力接入，并配合 `TriLC` 承接本地化任务 | 设计开发工具链、本机 runtime/CLI 接入、用户自用自动化或提升研发效率时 | 高 | `TrideBusinessStrategyRegistry` | `TrideProductRegistry` | `TrideCodeRegistry` | `../../../Tride/README.md`, `../../../Tride/AGENTS.md` |
| `Tripilot` | 用户入口界面与 PC 端软件中的交互入口，也是用户直接使用本地自动化与 `vibe coding` 的前台入口之一 | 设计用户入口、桌面工具链、本地交互体验或用户自用自动化入口时 | 中 | `TripilotBusinessStrategyRegistry` | `TripilotProductRegistry` | `TripilotCodeRegistry` | `../../../Tripilot/README.md`, `../../../Tripilot/AGENTS.md` |
| `vscodium` | 与 Tripilot 配套的 IDE 宿主基础设施，也是用户承载 PC 自动化与本地化开发工作的桌面宿主之一；直接采用开源上游项目并定期跟随升级以获得新功能 | 设计 IDE 入口、宿主侧基础设施、桌面工具承载、用户自用本地开发工作台或上游升级策略时 | 高 | `VscodiumBusinessStrategyRegistry` | `VscodiumProductRegistry` | `VscodiumCodeRegistry` | `../../../vscodium/README.md`, `../../../vscodium/product.json` |
| `TriMC` | 统一 agent runtime 与 interaction core，承接服务域执行、研发工作流切片、planner/context/tools/模型调用协同 | 涉及运行面、服务域执行、研发工作流、工具编排或模型调用时 | 中 | `TriMCBusinessStrategyRegistry` | `TriMCProductRegistry` | `TriMCCodeRegistry` | `../../../TriMC/README.md`, `../../../TriMC/AGENTS.md` |
| `TriHost` | 宿主适配、多 host 配置与正式切换承载 | 涉及宿主切换、多 host 配置或正式宿主承载时 | 低 | 待建立 | 待建立 | 待建立 | 占位，待初始化 |
| `TriSkill` | 统一 skill 提供模块 | 涉及统一 skill 封装、分发或跨宿主 skill 供给时 | 低 | 待建立 | 待建立 | 待建立 | 占位，待初始化 |
| `TriLC` | 本地域控制器、本地 runtime、planner、tool bus 与本地执行生命周期，负责承接 PC 端软件层配合完成的本地化任务 | 涉及本地域执行、本地节点升级、本地工具能力或 PC 端软件与本地域协同时 | 中 | `TriLCBusinessStrategyRegistry` | `TriLCProductRegistry` | `TriLCCodeRegistry` | `../../../TriLC/README.md`, `../../../TriLC/AGENTS.md` |
| `TriDev` | 自动化开发流程模块，负责“源码开发 -> shadow test -> 本地正式接管 -> 持续迭代”的流程沉淀、版本号签发、产物归档与阶段 gate | 涉及版本号签发、产物归档、阶段 gate、开发流程自动化或 shadow test / 本地正式接管流程设计时 | 低 | `TriDevBusinessStrategyRegistry` | `TriDevProductRegistry` | `TriDevCodeRegistry` | `../../../TriDev/README.md`, `../../../TriDev/AGENTS.md` |
| `TriMobile` | 本地域移动端入口 | 涉及移动端触达和本地域移动体验时 | 低 | `TriMobileBusinessStrategyRegistry` | `TriMobileProductRegistry` | `TriMobileCodeRegistry` | 占位，待初始化 |
| `TriMem` | 用户体系、身份绑定、数据库设计 | 涉及用户系统、身份和数据结构时 | 低 | `TriMemBusinessStrategyRegistry` | `TriMemProductRegistry` | `TriMemCodeRegistry` | 占位，待初始化 |
| `TriWeb4` | web3/web4、钱包、合约交互 | 涉及钱包、合约、Web3/Web4 功能时 | 低 | `TriWeb4BusinessStrategyRegistry` | `TriWeb4ProductRegistry` | `TriWeb4CodeRegistry` | 占位，待初始化 |
| `TriChain` | 公链模块 | 涉及公链能力时 | 低 | `TriChainBusinessStrategyRegistry` | `TriChainProductRegistry` | `TriChainCodeRegistry` | 占位，待初始化 |
| `TriGateway` | 规范化模块名已保留；当前先记录网关模块命名与兼容别名，具体职责待中央真源补定 | 涉及网关层命名统一、别名兼容、未来接入层规划或自动扫描去重时 | 低 | 待建立 | 待建立 | 待建立 | 规范目录为 `TriGateway/`；历史路径 `TriGatway/` 作为平滑迁移兼容别名暂保留 |
| `Tristaciss` | 模型 SDK 接口转换、API 平台、云端/本地模型路由 | 涉及 API 调用、模型调用、接口转换时 | 高 | `TristacissBusinessStrategyRegistry` | `TristacissProductRegistry` | `TristacissCodeRegistry` | `../../../Tristaciss/CLAUDE.md`, `../../../Tristaciss/AGENTS.md` |
| `Triavatar` | Web 入口、未来虚拟形象和游戏入口 | 涉及 Web 入口、虚拟形象、游戏入口时 | 中 | `TriavatarBusinessStrategyRegistry` | `TriavatarProductRegistry` | `TriavatarCodeRegistry` | `../../../Triavatar/README.md`, `../../../Triavatar/AGENTS.md` |
| `Trideployment` | 自动部署、镜像族、K8s 发布面、GitOps | 涉及上线、部署、环境发布时 | 中 | `TrideploymentBusinessStrategyRegistry` | `TrideploymentProductRegistry` | `TrideploymentCodeRegistry` | `../../../Trideployment/README.md`, `../../../Trideployment/AGENTS.md` |
| `TriTest` | 自动测试、测试完备性、回归和 CI 门禁 | 涉及测试、回归、质量门禁时 | 中 | `TriTestBusinessStrategyRegistry` | `TriTestProductRegistry` | `TriTestCodeRegistry` | `../../../TriTest/README.md`, `../../../TriTest/AGENTS.md` |
| `core-agent` | TriMC observability 的历史迁移源 | 只在追溯 observability 迁移历史时 | 历史源 | 不单独建立 | 不单独建立 | 不单独建立 | `../../../core-agent/README.md` |

## 命名与别名基线

- 中央 registry、计划文档、教程文档统一使用 `TriGateway` 作为模块规范名。
- 当前规范目录为 `TriGateway/`；历史 typo 路径 `TriGatway/` 暂作为兼容别名保留，凡是引用实际路径都应在迁移期显式标注别名关系。
- 后续自动扫描、报告汇总、批处理 prompt 和教程产出都必须保留 alias 映射，避免把 `TriGateway` 与 `TriGatway` 误判为两个模块。

## 使用规则

1. 先按 `../三元宇宙架构与模块说明.md` 确认模块规范名、功能主旨和当前边界。
2. 再判断该问题是否属于中央边界裁决；如果中央边界、模块优先级或当前实验范围不清，先询问 `BusinessStrategy`。
3. 然后根据本表找出必须纳入的模块。
4. 模块级收口默认按三层顺序路由：先查对应 `BusinessStrategyRegistry` 或 `business-state.md`，再查 `Product Registry` 或 `product-state.md`，最后查 `Code Registry` 或 `code-state.md`。
5. 如果问题属于组织、人力、秘书处或制度归属，再优先查询 `CompanyGovernanceRegistry`。
6. 若相关 registry 尚未落地，则使用本表中的真源，并显式标记“registry 缺口 / 待补齐”。
7. 涉及宿主切换时，优先同时纳入 `TriHost` 与相关运行模块；涉及 PC 端软件整体时，优先同时纳入 `Tripilot`、`Tride`、`vscodium`，若事项落到本地化任务执行或本地节点能力，再同步纳入 `TriLC`。
