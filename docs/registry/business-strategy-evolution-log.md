# Business Strategy Evolution Log

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/business-strategy-evolution-log.md
- syncMode: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse 中央商业策略演化日志的本地真源，用于记录显式策略变动和其影响模块，归入 registry 层审计留痕；它不是 TriCompany 公司级 workflow 书面真源。

## 2026-04-01

### 初始登记

- 确认 agent 体系分为两大类：`Registry Agents` 与 `Role Agents`
- 确认 `BusinessStrategy` 为中央 `Strategy Registry`
- 确认所有模块最终都应具备 `Product Registry` 与 `Code Registry`

### 当前默认经营实验

- 默认采用 `tricompany.md` 中离收入最近的方向 A 作为首轮试点
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
- `project.md` §1.2（已更新）
- `docs/registry/business-strategy-boundaries.md`（本日更新）
- `docs/registry/business-strategy-state.md`（本日更新）

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
