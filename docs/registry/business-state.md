# TriMetaverse Business State

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/registry/business-state.md
- syncMode: source-only
- lastSyncedAt: 2026-07-10T17:41:00+08:00

## Registry Role

- 当前文件是 `TriMetaverse` 模块自身 `BusinessStrategyRegistry` 工作层的本地真源，只维护 TriMetaverse 模块级商业定位与业务上游约束；它不是 TriCompany 公司级 workflow 书面真源。

- 本文件是 `TriMetaverse` 模块自身的 business registry 工作层。
- `TriMetaverse` 的 `product-state.md` 与 `code-state.md` 默认应以本文件作为模块级业务上游约束。

## Module Business Role

- `TriMetaverse` 负责整个三元宇宙的总商业模式、阶段映射、虚拟公司经营框架与中央边界裁决。
- 它不是某个单一功能模块，而是项目级商业真源与中央路由入口。

## Current Default Business Position

- 当前默认定位是中央 `Strategy Registry` 与跨模块边界裁决层。
- 当模块级产品或代码资料与商业定位可能冲突时，应先回到 `BusinessStrategy` 与本文件确认边界，再继续更新模块资料。

## Current Business Scope

- 维护总商业模式、当前经营实验与阶段口径。
- 维护模块优先级、模块参与条件与跨模块边界。
- 维护中央 registry 收口时的范围判断和路由规则。

## Boundary Notes

- `TriMetaverse` 不代替各模块自己的产品与代码资料层。
- 在模块 business registry 已落地后，模块内部事实应先由模块自身登记，只有跨模块冲突、边界变化或中央裁决事项才回到 `BusinessStrategy`。
- CEO 2026-07-10 裁定（CARRY-005 D3）：**基础设施模块（TriDeployment / TriTest / TriModel）当前先于产品面模块推进**，此执行顺序不影响模块长期优先级表但影响当前阶段资源分配与执行节奏。
- CEO 2026-07-10 裁定（CARRY-005 D4）：**TriModel 多 provider 策略为 Option B**——预留架构接口，不排时间表。当前单 provider（DeepSeek）占位为已知基线。
- CEO 2026-07-10 中央收口裁决：**版本策略与经营记录分层已确立**。TriMetaverse 为独立仓版本，子模块各自独立版本号（`<模块名> v<YYYYMMDD>`），不耦合。经营记录三层切分（规则层→提交 GitHub+入 release、运营记录层→提交 GitHub 但 `.releaseignore` 过滤、经营数据层→不入仓）。详见 `docs/版本策略与经营记录分层.md`。
- CEO 2026-07-10 中央收口裁决：**TriMC 架构方向已确立**——Claude Code 2.1.88 为主力 agent runtime（infra 层），TriMC 自建员工编排层（Soul Loader + Memory Injector + Tool Gater + Context Builder），OpenClaw 裁为薄参考层。TriStaciss Anthropic-compatible 端点（`POST /v1/messages`）为 TriMC 上线前置依赖，已纳入 IPD-20260610-PLATFORM-001 scope 增补项。
- CEO 2026-07-10 中央收口裁决：**产品基调分界**——产品面（员工是角色，公司味）→ 编排面（Soul/Memory/Context 驱动，公司味为主）→ infra 面（daemon/cron/tools 能力池，可接受平台味）。核心原则："员工是会写代码的 CPO，不是碰巧叫小乔的 coding agent"。
- CEO 2026-07-10 中央收口裁决：**三项定期周度检查规格已定义**（待办扫描/产研卡点/文档同步），Phase 1 总助手工执行，Phase 2 TriMC ScheduleCronTool 自动化。详见 `docs/workflow/定期检查任务规格.md`。
- CEO 2026-07-10 中央收口裁决：**Dev-Prod Parity 最终矩阵**——工具集一致（Copilot CLI ↔ Claude Code tools），模型一致（DeepSeek 经 TriStaciss Anthropic 端点），runtime 同范式（Agent Contract + Conformance Test 兜底），员工编排层隔离产品面与 infra 面。
- CEO 2026-07-10 中央收口裁决：**Claude Code 吸收路径与技术栈决策**——Claude Code 2.1.88 restored-src 复制至 `TriMetaverse/reference/claude-code/` 作为吸收基线；TriMC 编排层 Phase 2-3 保持 TypeScript 嵌入 Claude Code 原生 agent loop（`query.ts`），不做 Go 重写。本地演练场直接使用 Claude Code CLI（Windows + Node.js 运行），与 TriMC 服务器共享同一份 restored-src 源码，实现绝对 dev-prod parity。**商用阶段必须择机转为 Go 或其他自主研发语言实现以规避版权风险**，此约束需写入 TriMC 工程 ROADMAP 商用里程碑。
- CEO 2026-07-10 中央收口裁决：**演练场统一**——从 Copilot CLI + DeepSeek 迁移至 Claude Code CLI + TriStaciss Anthropic 端点。Copilot-host 负责 Phase 1 环境搭建与编码迁移，迁移完成后回归写代码角色。本地 Claude Code CLI 即为 Windows 演练场，TriMC 可本地验证后发布至服务器。

## Sources

- `../../AGENTS.md`
- `../../tmv-whitepaper.md`
- `../../project.md`
- `../../tricompany.md`
- `./business-strategy-state.md`
- `./business-strategy-module-map.md`
- `./business-strategy-boundaries.md`
