# Business Strategy Evolution Log

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/business-strategy-evolution-log.md
- syncMode: source-only
- lastSyncedAt: 2026-10-07

当前文件是 TriMetaverse 中央商业策略演化日志的本地真源，用于记录显式策略变动和其影响模块，归入 registry 层审计留痕；它不是 TriCompany 公司级 workflow 书面真源。

## 2026-04-01

### 初始登记

- 确认 agent 体系分为两大类：`Registry Agents` 与 `Role Agents`
- 确认 `BusinessStrategy` 为中央 `Strategy Registry`
- 确认所有模块最终都应具备 `Product Registry` 与 `Code Registry`

### 当前默认经营实验

- 默认采用 `../tricompany.md` 中离收入最近的方向 A 作为首轮试点
- 首轮重点模块为 `TriMetaverse`、`Tristaciss`、`Tride`、`Tripilot`、`Triavatar`、`Trideployment`、`TriTest`

### 当前特殊约束

- `Tristaciss` 先从 `CLAUDE.md` 派生 `AGENTS.md`
- `core-agent` 仅作为 `TriMC` 的历史 observability 迁移源

## 2026-04-22

### 变动

- 旧的 `Development Main Controller`、`Task Main Controller`、`Autonomy Main Controller` 降级为历史术语，不再作为当前标准边界。
- `TriMC` 明确为统一 agent runtime 与 interaction core，服务域执行与研发工作流统一写为其运行切片。
- `TriModel`（原 `TriModel`）明确为 Provider/Model 统一配置层，负责多 provider 适配、模型路由与 fallback 链；当前 shadow 与正式接管都继续直接运行在 `copilot` 宿主上。
- `Tride` 明确降为 PC 端软件中的开发工具与 orchestration 底座，不再表述为切换后的正式宿主。
- `TriSkill` 进入中央边界预留，作为未来统一 skill 提供模块，但当前仍待初始化。

### 影响模块

- `TriMetaverse`：中央战略与 workflow 真源需要统一映射新边界。
- `TriMC`、`TriModel`、`TriSkill`：运行面、宿主适配层与 skill 供给层的边界被正式拆开。
- `Tripilot`、`Tride`、`vscodium`：统一归到 PC 端软件层，但继续分别维护模块事实。

### 来源

- `../../project.md`
- `../../tricompany.md`
- `../workflow/terminology.md`
- `../workflow/workflow-host-integration.md`
- `../三元宇宙架构与模块说明.md`

## 2026-07-17

### 变动

- **TriLC/TriMC 架构分层**：TriLC 升级为"本地人机协作主入口"（分布式员工工位）；TriMC 明确为"公司云端实体"（承载公司运行面：知识体系、业务运营、奖励发放、审计），不再作为本地人机协作默认入口，但仍保留整个公司运行面的核心地位。
- TriPilot 默认直连 TriLC（本地域），仅在 TriLC 崩溃时通过 TWF-001 任务树恢复机制切换至 TriMC（服务域）。
- TriLC 升至第一轮核心模块（原为第二轮补强）；TriMC 云端多热备不变，但不再作为本地人机协作默认入口。
- 本地人机协作场景（编码/办公/视频制作等）由 TriLC + TriPilot + TriCode + vscodium 承担，类比当前 Copilot CLI + VS Code 的本地工作模式。

### 影响模块

- `TriLC`：从本地适配层升级为本地域主控；需配套 TWF-001 任务树工作流与故障恢复机制。
- `TriMC`：从统一运行面降为云端托管 + 本地 fallback；保持服务域热备能力。
- `TriPilot`：默认连接路径从 TriMC 改为 TriLC。
- `TriCode`：PC 端本地编码工具，配合 TriLC 完成本地开发闭环。
- `TriMetaverse`：项目级架构文档、BusinessStrategy 注册、模块说明全部回写新边界。

### 来源

- CEO 直接决策（2026-07-17 会话）；TWF-002 任务树承载执行。
- `docs/三元宇宙架构与模块说明.md`（已更新）
- `../project.md` §1.2（已更新）
- `docs/registry/business-strategy-boundaries.md`（本日更新）
- `docs/registry/business-strategy-state.md`（本日更新）

## 2026-10-07

### 变动

- **R 面战略定性入档（CEO 2026-10-07 22:49 面授，BOD 转达；只定性不排期，研发落地时间待定）**：R 面定位=R 面自研产品的孵化面——在 M 面取得第三方软件和系统实验成果后，提炼其优势与局限，复刻 M 面的架构、产品与实验经验积累，向 R 面有步骤地移植和复制，快速开发自主可控产品。四目标：继承优势、消除专利影响、突破局限、实现 R 面自研产品的全面超越。
- **组织形态预告（非现役承诺）**：R 面的本地域和服务域未来也可串联流水线工作，制度源=M 面正在立的串联流水线制度（交叉引用指针=需求池 DEM-003 v2 演进注，由转达件给出），跨面复制；时点待定，不构成现役架构变更。
- **与现行口径的关系（本日勘验）**：本定性为 R 面的商业战略层新增表述。白皮书既有「元现实承接元虚拟试出的成熟做法、针对宿主局限从内核层重新设计、使同一方法论在自研面上超越成熟宿主」螺旋叙事与之同向（`docs/tmv-whitepaper.md` §3.1 元现实条），但「孵化面定位／四目标／第三方成果移植复制方法论」未入册；「串联流水线」一词全 `docs/` 零命中，为全新术语；架构文档 RMC/RLC 行（`docs/三元宇宙架构与模块说明.md` §4，L115 能力定位）为技术能力层口径，不含本商业定性。
- **入档边界**：本条为 registry 面战略留痕——零施工、零排期、零流程改动；白皮书与架构文档、模块 registry 均未动手（候办见下，候人工明示门）。

### 候办建议（候审，本席未动手）

- `docs/tmv-whitepaper.md`：R 面商业定位段（孵化面+四目标+移植复制方法论）候补入册；若入册宜按 LG-031 实然/应然纪律以「战略定性/演进方向」语气书写，不充实然；白皮书=商业模式唯一真源，改写走人工明示门（归口：CPO/产品线发起，BOD/CEO 批）。
- `docs/三元宇宙架构与模块说明.md` §2/§4（BusinessStrategy 前置线）：RMC/RLC 能力定位行与孵化面定性的衔接候注；TriRMC/TriRLC 模块表行候补商业定位引注（归口：CTO 域架构文档改窗）。
- R 面模块仓 `TriRMC/`、`TriRLC/` 各自 `docs/registry/business-state.md` 候同步本定性（归口：模块管理 agent 走对应 registry 链；本席只列候办不代写）。
- 需求池 DEM-003 v2（串联流水线演进注）：产品需求面归 CPO，本席仅登记交叉引用，不代写需求内容。
- registry 族陈旧背景观察（与本定性相关的既有欠账）：`business-strategy-state.md`（lastSyncedAt 2026-06-04）与 `business-strategy-boundaries.md`（2026-07-13）仍沿用 TriMC/TriLC/Tride 旧名，未反映 2026-08-21 四名更名与双系统对；R 面相关段落候随本定性一并刷新（独立候审件，不在本条施工）。

### 影响模块

- `TriRMC`、`TriRLC`（R 面系统对）：获得商业战略层定位（R 面自研产品孵化面载体）；当前职责与技术边界不变，时点待定。
- `TriMetaverse`（中央）：白皮书/架构文档存在 R 面商业口径候补缺口（已列候办，未动手）。
- `TriCompany`（经营载体）：R 面串联流水线组织形态预告为未来组织制度输入，归治理/组织面候办，本席不裁。

### 来源

- CEO 面授原话（verbatim，2026-10-07 22:49；BOD 2026-10-07 22:5x 转达，本席收档现查时点 22:51 +0800）：

  > 「R 面是在 M 面有第三方软件和系统实验成果后，我们抽出第三方软件和系统实验成果的优势与局限，复刻 M 面的架构和产品以及实验经验积累，向 R 面有步骤的移植和复制，快速开发自主可控产品，继承其优势，消除专利影响，突破其局限，实现 R 面自研产品的全面超越。所以 R 面的本地域和服务域未来也是可以串联流水线工作的，这是咱们从 M 面学来的，研发落地时间待定。」

- 转达件：BOD→BusinessStrategy 战略定性入档转达（含四点要点拆解）。
- 现行口径对照（本日勘验）：`docs/tmv-whitepaper.md` §3.1/§5/路线图；`docs/三元宇宙架构与模块说明.md` §4/§5（LG-031 实然/应然双层区分）。

## Log Template

后续追加请使用以下结构：

```markdown
## YYYY-MM-DD

### 变动

- 变动内容

### 影响模块

- 模块名与原因

### 来源

- 相关真源文件或人工确认记录
```
