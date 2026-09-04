# TriCompany Code State

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/registry/code-state.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- supportPublishedCopy: TriCompany-copilot-host-assets/docs/registry/code-state.md
- supportSyncRule: source 稳定语义变更后，active published-copy 需在同轮或下一轮追平
- lastSyncedAt: 2026-06-04

## Repository Map

- TriMetaverse/.github/agents/: 当前生效的本地正式接管 registry agent 与总助研发套件
- TriMetaverse/.github/instructions/: 当前生效的总助维护规则
- TriMetaverse/.github/manifests/: 记录从 shadow-test 收口到本地正式接管的宿主资产清单
- TriMetaverse/.github/prompts/: 当前生效的会议开始 / 结束入口
- TriMetaverse/.github/: 当前生效的 Copilot 本地正式接管宿主资产层
- support root: 当前生效本地正式接管资产统一回看的支撑根目录，负责提供 docs、runtime 与 vendor 参考副本；当前固定为 TriCompany-copilot-host-assets
- historical support root name: `TriCompany-shadow-host` 仅保留为 phase-1 已验证证据链对应的历史路径名
- source-agents/: registry agent 草案与员工源侧五件套；不作为 VS Code agent discovery 入口
- .github/instructions/: 总助维护规则
- .github/manifests/: 回迁 TriMetaverse/.github 的 shadow-test 清单
- .github/prompts/: 会议开始 / 结束入口
- .github/: 当前阶段 Copilot 试运行宿主资产层
- docs/product/: 产品真源
- docs/engineering/: 技术真源
- docs/workflow/: 编排与秘书处草案
- docs/workflow/: 集成产品开发流程（IPD 流程）、秘书处草案与跨岗位 owner 边界
- docs/execution/: 当前启动阶段执行文档
- docs/training/: 岗位、模块、代码和流程培训材料
- vendor/reference/: Hermes 冻结参考副本
- runtime/cognition/: 元认知 contracts、kernel、providers，以及 chief-of-staff workflow / schedule source 回迁入口

## Current Code Health

- 当前属于 docs-first + .github 宿主资产并行状态
- 当前已完成 runtime/cognition 的 smoke、contract、integration、backend、模拟 external-adapter、HTTP external-backend、Supermemory schema、Supermemory SDK seam 与 Supermemory live smoke 九层验证基线
- 当前已把 chief-of-staff approval report、task_resolver、cron_runner / resident_runner、knowledge workbench、schedule staging CLI、workflow bridge 与对应 source validation 回写到 `TriCompany/runtime/cognition/`
- 当前已把 chief-of-staff resident runner CLI、operating review closeout CLI，以及 registry / operating review closeout source validation 回写到 `TriCompany/runtime/cognition/`
- 当前已把 chief-of-staff wiki batch refresh CLI 回写到 `TriCompany/runtime/cognition/`，当前可见 top-level `chief_of_staff_*.py` 入口已与 support bundle 对齐
- 当前已把 workflow hook 的 command 识别、stdin 解析与 `sync-memory` 调度纯逻辑提炼到 `TriCompany/runtime/cognition/chief_of_staff_workflow_sync_hook.py`；TriMetaverse live hook 脚本仅保留 thin wrapper
- 当前生效的本地正式接管 agent / prompt / manifest 位于 TriMetaverse/.github，TriCompany-copilot-host-assets 负责支撑文档、runtime 与 vendor 参考副本
- 当前已完成同一 support root 下的连续会议链路补证，可统一写成“本地 Copilot-host 已完成 shadow-test，现进入正式接管；该结论不等于正式宿主切换。”
- 当前已完成中央命名吸收；未来若进入 `TriMC` 新宿主，应另建平行宿主资产包，而不是复用当前 Copilot-host 的物理命名
- 当前 CPO / CTO 已采用既有 `TriMetaverse/.github` live entry 上岗，并已补齐 `TriCompany/source-agents/chief-product-officer/**`、`TriCompany/source-agents/chief-technology-officer/**`、host object generation、CLI 与 support `knowledge/{roles,employees}/chief-{product,technology}-officer/**` 对象载荷；这不代表 TriMC 正式宿主切换
- 当前 CodeRegistry 由 CTO 小狄管理，负责代码事实、CodeGraph 摘要、技术风险、实现边界、仓库健康与工程门禁；CEOChiefOfStaff 只负责技术事项的公司级路由、协调、催办、升级与中央收口
- 当前集成产品开发流程（IPD 流程）由 TriCompany source 侧维护；TriDev 只作为产品开发执行段 phase engine / local engine 被调用，不承接 COO / CFO 持续运营监控或公司级总编排
- 当前已把 `runtime/cognition/ipd_case_engine.py` 改写为一比一 ten-phase case line：阶段模板、work item、phase package draft、participant roles 与总助 / CEO 顺序签核已按 `DISCOVERY -> DELIVERY` 对齐
- 当前已新增 `run_case_autopilot` 与 `chief_of_staff_ipd_case autopilot`：可自动推进 intake 签核、十阶段提交/签核、岗位参与记录，并在 TriDev 可用时同步写入 phase result / gate / delivery bundle 校验证据；支持 `manual-ceo-signoff` 在 CEO 签核点切人工暂停
- 当前已具备 source 侧回归入口：`python -m unittest runtime.cognition.chief_of_staff_bridge_validation`、`python -m unittest runtime.cognition.chief_of_staff_workflow_validation`、`python -m unittest runtime.cognition.chief_of_staff_schedule_staging_validation`
- 当前已具备 closeout 相关 source 侧回归入口：`python -m unittest runtime.cognition.chief_of_staff_registry_closeout_validation`、`python -m unittest runtime.cognition.chief_of_staff_operating_review_closeout_validation`
- 当前已具备 source 侧 CLI / staging 入口：`python -m runtime.cognition.chief_of_staff_schedule_staging --help`
- 当前已具备 source 侧 resident / closeout CLI 入口：`python -m runtime.cognition.chief_of_staff_resident_runner --help`、`python -m runtime.cognition.chief_of_staff_operating_review_closeout --help`
- 当前已具备 source 侧 wiki batch refresh CLI 入口：`python -m runtime.cognition.chief_of_staff_wiki_batch_refresh --help`
- 当前“代码健康”主要体现为结构边界、文档一致性和当前阶段宿主资产口径的清晰度
- 当前已具备一个未执行的 Supermemory live smoke 入口，用于承接真实账号验证前的最后一层门禁
- 当前已明确公司级技术纪律：架构表中的模块一旦被写成正式模块面，默认由 CTO 与对应 CodeRegistry 补齐独立 git 仓、`README.md`、`docs/` 六件套、`.gitignore` 与本地 CodeGraph 初始化、忽略规则和索引摘要维护；占位模块也先补齐骨架，再保持“待初始化”标记；`TriDev` 已作为当前首个执行对象落地该基线
- 当前已明确既有正式模块流程：`Discovery` 阶段先产出 `ModuleTargetingReport`，并由 `TriDev` 执行 `ModuleReadinessInit`（标配审计与缺口 init），通过后再进入后续业务开发
- 当前已明确新正式模块流程：`Discovery` 阶段先产出 `NewModuleBaselineRelease`（含 `vendor-extraction-profile`），签核到 `approved` 后由 `TriDev init` 消费发布包执行 `init`；模块 owner 继续对提交质量与长期演进负责
- 当前已完成宿主对象生成编排层设计：`docs/engineering/host-object-generation-design.md`（COPY/SYMLINK/GENERATE 三条路径、5-Gate Pipeline、版本策略）
- 当前已完成 Phase A 代码注册：TestEngineer + FullStackDeveloper HostObjectSetDefinition 写入 `runtime/cognition/host_object_generation.py`，DECLARED_HOST_OBJECT_SETS 9→11，EMPLOYEE_GENERATORS 补齐 CMO/COO/CFO 缺口 7→13
- **TriStaciss Credit Ledger 已落地（2026-07-14，CTO 小狄）**：`credit_ledger.py`（SQLite 账本）+ `credit_api.py`（balance/usage 查询端点）已集成到 `/v1/messages` 与 `/v1/chat/completions` 非流式路径。G3 门禁"Credit 消耗可追踪 → 可查证"非流式侧已达成；流式路径标记为 deferred
- **CTO-008 大框架 4/4 全部完成（2026-07-16，CTO 小狄）**；CTO-008-M 代码实现也已落地（2026-07-17）：CTO-008-C（TriMC/TriLC 共享核心抽象，含经营工作流状态机）+ CTO-008-M（TriMC↔TriLC 通信协议，M.1-M.6 28 tests 全部通过）+ CTO-008-P（PC 端打包方案）+ CTO-008-S（TriMC K8s HA 运维方案）全部设计+代码交付。K8s manifests 已同步更新（3 replicas + podAntiAffinity + HPA + PDB minAvailable=2 + Service sessionAffinity）。关联：TriMC/docs/engineering/cto-008-*.md 四份设计文档、TriMC/k8s/trimc/ manifests、CTO-007 smoke test pipeline
- **COS-005 Openclaw 吸收链规划已完成（2026-07-17，CTO 小狄）**：守护进程与定时任务吸收规划 APPROVED。输出 TriMC/docs/engineering/cos-005-openclaw-absorption-plan.md，四阶段 12h 分步吸收（P0 调度核心 4h → P1 执行可靠性+P1 进程监督 6h → P2 单机服务 2h）。吸收目标：CronService 定时任务调度 + ProcessSupervisor 受管子进程 + Backoff 退避重试。待 小全/小柯 接手实现阶段
- **cpo-trimodel-deployment Phase 1 完成（2026-07-22，小全/小狄）**：三仓库配置平面改造交付 — TriModel（API server 4 端点 + DeepSeek-Anthropic provider + v0.2.0）、TriLC（key-cache + mirror pusher + session store v2 + contract resolver）、TriPilot（TriLCClient HTTP+SSE）。Phase 2 backlog 8 项 CONDITIONAL_PASS 已登记（TriModel/docs/execution/cpo-trimodel-deployment/phase-2-backlog.md）。树闭合裁决：APPROVE（CTO 小狄，版本 bump commit 本地已落，push 待网络恢复）
- **Q3 Phase 2 统一发布管线完成（2026-07-24，CTO 小狄）**：`source_publish_check.py` 新增 `--publish-agents` 模式（dry-run by default, `--agent-execute` 显式写入）。核心函数：`run_agent_publish()`、`_filter_agent_publish_entries()`、`_publish_single_agent()`。manifest 动态派生 `AGENT_PUBLISH_ALLOWED_TARGETS` 白名单。`employee_host_publish.py` 末尾追加 subprocess 委托。验证：`source_publish_check_validation.py` 33/33 全部通过（13 回归 + 20 agent publish 新增）。独立于 `--sync` 模式，可与 `--check` 组合使用。关联：`TriCompany/runtime/cognition/source_publish_check.py`、`TriCompany/runtime/cognition/employee_host_publish.py`、`TriCompany/source-agents/registries/trimetaverse-live-agent-publish-manifest.json`

## 连接拓扑（LG-030 勘定 2026-09-04）

- 本机 TriRLC（8711）经 TRIMC_BASE_URL 注入直上送中央面（sg 47.245.122.61:8710）；heyuan TriRMC（8.155.54.79）=R 面周平面迁移自治执行点——「上送中央面+R 面执行迁移」双职责分属两节点；连接面变更须 CEO 明令（D-17 在册）。

## Change Tracking Baseline

- 重大边界变化应先更新 docs/product 与 docs/engineering
- registry 仅在明确要求记录时同步更新
- 总助套件、Hermes 融合规则和 .github 宿主资产的耐久变化应视作仓库结构变化，必要时回写 code-state
- 模块进入正式模块面后，应由对应 CTO / CodeRegistry 在同轮或下一轮补齐 git / `README.md` / `docs/` 六件套 / `.gitignore` / CodeGraph 标配，并登记摘要与刷新节律说明
- 若涉及既有正式模块，`Discovery` 阶段必须先完成 `ModuleTargetingReport` 与 `ModuleReadinessInit`，再进入后续阶段
- 若涉及新增正式模块，`Discovery` 阶段必须先完成 `NewModuleBaselineRelease` 的 `candidate -> approved`，再允许 `TriDev init` 落下骨架并进入后续阶段

## Local CodeGraph Index

- 2026-05-24 已由 CTO 小狄技术线完成本地 CodeGraph 试点初始化，并由 TriCompanyCodeRegistry 接管索引摘要。
- 索引范围为仓根干净索引；`.gitignore` 已排除 `.codegraph/`、`.tricompany-cognition/`、`node_modules/`、`vendor/`、构建产物、缓存和环境文件。
- 当前摘要：100 files，1,494 nodes，3,042 edges，language `python`。
- 当前 pending changes 为 `0/0/0`；`.codegraph/` 只作为本地缓存，不作为仓库真源提交。

## Git Health

- `CodeRegistry` 负责维护活跃模块的 `Git Health` 事实：dirty worktree 基线、已知未提交切片、风险说明和升级提示。
- `CodeRegistry` 不直接代替 owner 做本地提交；本地提交责任仍归对应模块 owner 或当前实际开发 owner。
- 活跃模块若跨过一个会议周期仍保持 dirty，应把原因、风险、是否已有可提交切片与预计收口时间补回 `Git Health` 或 operating record。
- 对存在治理中 `vendor/` 冻结基线的模块，`vendor/` 默认进入模块 `.gitignore`，主 `CodeGraph` 默认排除 `vendor/`；专项吸收任务再临时切到 vendor 视图。

## Quality Risks

- 若把 TriCompany 误当作正式宿主，会造成后续宿主集成返工
- 若混淆 TriMetaverse/.github 生效宿主资产与 TriCompany-copilot-host-assets support root，会导致当前正式接管路径失真
- 若把“当前由 copilot 宿主承载 skill / cron 可用验证”误写成“copilot 等同于 TriMC”，会直接破坏宿主边界治理
- 若不持续区分身份层和记忆层，总助仍会退化为显式操作底层文件的设计
- 若不明确 .github 当前是本地正式接管宿主资产层而非 TriMC 正式宿主层，后续容易把阶段边界写乱
- 若把元认知层做成全员共享单一记忆池，会破坏员工人格边界和审计边界
- 若把元认知层做成每个员工一整套独立 runtime，会破坏公司级共享结论与回迁一致性
- 若 CPO / CTO 上岗后不及时输出首轮接管判断并接管 ProductRegistry / CodeRegistry，总助会继续代管过多边界
- 若后续验证不继续沿用 TriCompany-copilot-host-assets 作为唯一 support root，会导致当前生效路径与宿主资产说明失真
- 若把 Supermemory 官方 schema 验证等同于真实 Supermemory live 接入，会高估 production 接入成熟度
- 若把 Supermemory SDK seam 验证等同于真实官方 SDK 包接通或真实账号可用，也会高估 production 接入成熟度
- 若把 live smoke 脚本已存在等同于 live smoke 已执行，也会高估 production 接入成熟度
- 若把 ten-phase case line 已落地误写成 PRD 分叉并行、多分支 delivery 聚合、完整岗位 adapter 或正式宿主都已完成，会再次高估当前成熟度

## Sources

- ../engineering/DESIGN.md
- ../engineering/ROADMAP.md
- ../engineering/STATE.md
- ../engineering/metacognition-architecture.md
- ../workflow/chief-of-staff-rd-orchestration.md
- ../workflow/github-backport-manifest.md
- ../workflow/hermes-copilot-host-migration.md
- ../../TriMetaverse/docs/workflow/tricompany-copilot-host-assets-migration-matrix.md
- ../../source-agents/
- ../../README.md

## Pending Backlog

> 2026-07-25 会话归档：4 个 trilc chat 同源 bug 修复 + TriMC 18 项测试债清理收口时，
> 标注以下跨模块待办项。优先级 P1=建议下轮迭代、P2=Phase-2 规划。

### BACKLOG-001 trimetaverse / models 的退役模型名遗留
- **模块**：TriModel + Tristaciss
- **内容**：`TriModel/src/providers/trimetaverse.ts`（L25-26/L42/L202/L213）及 `src/api/models.ts`（L36-39）仍引用退役模型名 `deepseek-chat` / `deepseek-reasoner`，走 tmv-\* 链经 TriStaciss 路由。
- **现状**：Turn-3 修复已把非 tmv 路径的 fallback 终点改为 `deepseek-v4-flash`；tmv 链内部命名未动。退役名经自愈别名机制可兜底（400→fallback→200），不致故障，但每次多一跳延迟。
- **依赖**：需 Tristaciss 仓库（`D:\Code\ai\Tristaciss`）运行态 + 模型名映射审计。
- **优先级**：P1

### BACKLOG-002 DeepSeekAnthropicProvider 消息格式转换
- **模块**：TriModel
- **内容**：`DeepSeekAnthropicProvider`（`deepseek-anthropic.ts:40-46`）对消息做原始透传，不做 OpenAI→Anthropic 格式转换。Turn-2 的 tool 历史（`role:'tool'`）透传到 Anthropic 端点必 400。
- **当前缓解**：Turn-3 修复中 v4 已改走 OpenAI 端点规避，但丢失 `thinking` 内容回传。
- **修复目标**：参照 `trimetaverse.ts:55-80` 已有实现，为 DeepSeekAnthropicProvider 实现完整的消息转换（tool→tool_use 等），恢复 Anthropic 路由以取回 thinking/8192 语义。
- **优先级**：P2（Phase-2 规划项，不阻塞当前主干）

### BACKLOG-003 Tristaciss 模型名映射审计
- **模块**：Tristaciss
- **内容**：tmv-\* 链（`tmv-deepseek-chat` 等）经 TriStaciss 路由；需审计 TriStaciss 内部是否映射退役模型名、是否有硬编码依赖。待 BACKLOG-001 做完后实网验证 tmv 链完整链路。
- **依赖**：需 Tristaciss 仓库运行态 + 完整实网测试。
- **优先级**：P2

### BACKLOG-004 checkShellPolicy 带空格路径缺陷
- **模块**：agent-core（TriMC）
- **内容**：`checkShellPolicy`（`permissions.ts` L183-210）用 `baseCmd = cmd.split(/\s+/)[0]` 取首空白 token 匹配 allowlist，不处理带空格路径（如 `C:\Program Files\nodejs\node.exe` 被截断成 `c:\program`，不匹配 allowlist）。Turn-5 测试债清理中 CTO `process.execPath -e` 模板因此三重障碍不可行，改用 `where`/`which` 方案绕过。
- **修复建议**：支持带引号路径识别（`"C:\Program Files\nodejs\node.exe"`）或改用 `path.basename` 取文件名。
- **影响**：Windows 平台特定，限制 shell_exec 可用命令范围（含空格的绝对路径全被误判）。
- **优先级**：P1（平台可用性缺陷）

### BACKLOG-005 TriMC 工作区遗留改动分案提交
- **内容**：TriMC dev 分支存在先前阶段遗留的未提交改动——S7 mirror 端点（`src/server/app.ts` +82）、MirrorStore（未跟踪 `src/mirror/`）、P4.x scheduler 重构（`packages/agent-core/src/loop.ts` fallback+tool_call 累积快照）、`docker-compose.yml`、`deployment-topology.md`。与本次 4 bug + 测试债清理同处一个工作区但归属不同事项。
- **建议**：合入时按事项分案提交——测试债清理只提 `test/` 8 文件；遗留 product 改动另案提交。
- **优先级**：P2（不阻塞，但合入 main 时必须分离）

### BACKLOG-006 TriMC 18 项存量测试失败（已清零，本条仅溯源）
- **内容**：P4.x 共享化重构（permissions/process-supervisor/scheduler/sub-agent 迁入 agent-core）后测试侧未跟进，产生 18 项存量失败。Turn-5 测试债清理已全部清零（455/455 PASS）。
- **根因**：tier 工具集 / reason 文案 / import 路径 / 字段结构的契约变更后测试未对齐。
- **状态**：✅ 已清零（2026-07-25），本条供溯源。

### BACKLOG-007 trilc 对标 Claude Code v2.1.88 功能补齐

> 2026-07-27 audit：CEO 要求审核 trilc 实现了多少 Claude Code 源码功能，
> 结论是整体覆盖率约 35%，核心差距在工具系统和交互体验。

**架构链路确认**：
- ✅ `入口 → trilc → agentLoop (agent-core) → createModelClient (trimodel, 库调用) → Model API`
- ✅ TriModel HTTP 仅做配置下发（key-cache / model-list），不在请求路径

**实现度矩阵**：

| Claude Code 能力 | trilc | 覆盖率 | gap |
|---|---|---|---|
| **工具系统** | | | |
| Bash (`!` prefix) | `shell_exec` ✅ | ✅ 1/1 | 命名差异 |
| Read file | ❌ | 0/1 | **完全缺失** |
| Write file | ❌ | 0/1 | **完全缺失** |
| Edit (精确替换) | ❌ | 0/1 | **完全缺失**（CC 核心编辑能力）|
| Glob (文件搜索) | ❌ | 0/1 | **完全缺失** |
| Grep (内容搜索) | ❌ | 0/1 | **完全缺失** |
| NotebookEdit | ❌ | 0/1 | **完全缺失** |
| Task (子代理) | ✅ agent-core sub-agent | ✅ 1/1 | |
| **工具合计** | **2/8** | **25%** | **6 个 core tool 缺失** |
| **Agent 循环** | agentLoop streamChat | 100% | |
| **权限系统** | | | |
| ask/allow/deny 模式 | ❌ | 0% | **完全没有**（CC 核心 UX）|
| 交互式审批 | ❌ | 0% | CC 弹确认框，trilc 直接拒绝 |
| tier 权限 | ✅ permissions.ts | 30% | 有骨架无交互 |
| **MCP** | ❌ | 0% | **完全没有** |
| **TUI** | | | |
| 斜杠命令 (`/model`, `/exit` 等) | ⚠️ `/exit` 而非 `exit` | 20% | CC 是裸 `exit` |
| 消息流式 | ✅ Ink render | 70% | |
| Ctrl+C | ✅ 双段 SIGINT | 100% | |
| **整体** | | **~35%** | |

**根因诊断**（CEO 指出）：
> "像 exit 这类命令本来就是 claude 的，明显我们没有复制 claude 源码"

偏差不是工程失误——是产品决策上我们没走"复制 Claude Code"路线，而是在自己造。工具名（`shell_exec` vs `Bash`）、退出口令（`/exit` vs `exit`）、权限模型（tier-only vs ask/allow/deny）、缺失的 6 个 core tools——每一处都是"自己发明"的痕迹。

**补齐优先级**（建议顺序）：
1. **P0 — 6 个 core tools**（Read/Write/Edit/Glob/Grep）：没有这些 trilc 无法操作文件，和 CC 不在同一个产品类别
2. **P0 — TUI 退出口令**（裸 `exit` 而非 `/exit`）：对齐 CC 肌肉记忆
3. **P1 — ask/allow/deny 交互权限**：CC 的核心安全 UX
4. **P1 — 斜杠命令**（`/model` 等）
5. **P2 — MCP 支持**
6. **P3 — 工具名对齐**（`shell_exec` → `Bash` 等，breaking change 需谨慎）

**开工前提**：需 CPO 小乔确认产品对齐目标（"复制 CC" vs "参考 CC" vs "做自己的 AI 终端"）。若确定走"复制 CC"，后续 Dev 应优先补齐 6 core tools + 权限 UX + 退出对齐。

**依赖**：TriLC 仓库 + agent-core + trimodel（均在本地 dev 分支，无跨团队阻塞）

- **W32 集成验证闭合（2026-08-01，CTO 小狄）**：树 w32-integration-verification 全量闭合，CTO 终审 APPROVE。TestEngineer ALL_PASS (7/7 gates)。四仓库交付物逐一代码核查通过：
  - TriLC：launchd.ts + systemd.ts 补齐、/agents tricompanyEnabled、heartbeat-runner isRunning、session-reaper isRunning()、/healthz 三段状态（trimc/heartbeat/cron/sessionReaper）
  - TriPilot：welcome-setup key-cache 桥接、TRICOMPANY_SOURCE_PATH 修正（TriCompany/source-agents 优先 → bundled fallback）
  - TriCompany：deployment-engineer binding profile + live entry + publish manifest + employee roster（小布 / reportsTo CTO / onboarded 2026-08-01）
  - TriMetaverse：build-tricade.yml MSI 条件构建、installer/tricade.wxs WiX 源码、deployment-engineer.agent.md live entry、main 分支已创建并推送 origin
  - 门禁：tsc TriLC+TriPilot 双仓零错误 / 497 tests 零回归（TriMC 455/455 + TriCompany 42/42）
  - 非阻塞发现 2 项：service.ts 过时注释、deployment-engineer live entry untracked（git status 标记，不影响功能）
  - W33 路由：生产运营 — 项目创建实战 + TriMC 连接 + 自动更新 + 经营记录独立运营
