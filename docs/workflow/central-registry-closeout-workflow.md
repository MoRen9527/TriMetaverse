# 中央 Registry 收口工作流（TriMetaverse）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/central-registry-closeout-workflow.md
- syncMode: source-only
- lastSyncedAt: 2026-09-11（V0.2：⑦ 中央收口改排落盘，LG-034 批准令+CHO APPROVE 04:15；收口督办与节奏管理归 COO、登记收口 CGR 执行、汇总呈报半环留 COS）

## 1. 目标

本文件把跨模块事实收口整理成一条现役可执行工作流，用来减少逐份文档手工回填的成本，并明确以下问题：

当前文件是真正属于 TriMetaverse 的中央工程侧收口协议真源：它定义的是发布侧 / 中央侧如何组织 registry closeout，而不是赛博公司岗位、制度或模块事实本身的源侧定义。owner 分工、岗位边界和模块事实仍以 TriCompany 源侧文档与各模块 registry 为准。

1. 谁负责发起一次正式的 registry 收口。
1. 什么时候需要 `BusinessStrategy` 先判范围。
1. 哪些 registry 可以并行处理，哪些必须升级。
1. 四层记忆应该如何落到 registry 收口语义上，以及当前哪些部分仍属于规划。

本文件是 [tricompany-operating-workflow.md](./tricompany-operating-workflow.md) 的专项补充，不替代中央战略真源、模块 registry 真源或秘书处机制。

registry owner 分工的源侧规则来自 TriCompany 虚拟公司源侧：`../../../TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md`、`../../../TriCompany/docs/registry/product-state.md`、`../../../TriCompany/docs/registry/code-state.md` 与 `../../../TriCompany/docs/workflow/chief-administrative-officer-role.md`；本文只记录 TriMetaverse 工程侧收口执行方式。

## 2. 当前结论

1. 所有非人格 registry 最终都应具备对应 agent 入口，包括中央 `Strategy Registry`、模块级 `Business Strategy Registry`、模块级 `Product Registry`、模块级 `Code Registry` 与 `CompanyGovernanceRegistry`。
1. 模块级 registry agent 的目标归属是对应模块自己的 `.github/agents/`；中央 `TriMetaverse/.github/agents/` 只保留中央级 strategy / governance / TriMetaverse 自身 registry，以及尚未迁移模块的临时过渡入口。
1. 这是目标架构，不等于当前所有 registry 都已经具备完整 agent runtime、统一调度器和统一记忆实现。
1. 现役可执行方案（2026-09-11 ⑦ 改排）：收口触发后由 `COO` 受理督办——判定进入正式收口并做时序排程（收口督办与节奏管理）；`BusinessStrategy` 按范围门禁被调参（只判范围与边界）；`COO` 组织并行 registry 路由（`<Module>BusinessStrategyRegistry`→`ProductRegistry`/`CodeRegistry`→`CompanyGovernanceRegistry`）；`CompanyGovernanceRegistry` 执行登记收口（最小返回结构收册、回写登记、状态读数）；涉代码事实/工程门禁的回写经 `CTO` 会签；`CEOChiefOfStaff` 保留汇总呈报半环（fan-in 呈报、冲突升级、董事会通道）。
1. 四层记忆当前应先作为 registry closeout 的语义协议使用，不能写成“所有 registry 已全面接入统一记忆 runtime”的既成事实。

## 3. 参与角色与边界

| 角色 / Agent | 当前职责 | 当前不负责 |
| --- | --- | --- |
| `COO` | 收口督办与节奏管理：受理触发、判定进入正式收口、时序排程建议、催办、督办读数与升级建议 | 不握分派权/升级权/台账销账变更权（销账唯 COS，督办结论回写限台账督办字段）；不代替各模块 registry 编造事实；不重写中央战略 |
| `CompanyGovernanceRegistry` | 执行登记收口：收口对象登记、最小返回结构收册、回写登记、状态与销账读数维护、发布治理修正 | 不行使催办人格职责；不替代模块 business / product / code registry |
| `BusinessStrategy` | 商业边界被调参席：跨模块边界、模块优先级、当前实验范围、正式宿主归属等不清时判定参与范围（前置线真源：`docs/三元宇宙架构与模块说明.md` §2 reference 说明与 §4 模块主旨基线） | 不默认代替所有模块 registry 执行逐项收口，不做中央战略裁决 |
| `<Module>BusinessStrategyRegistry` | 提供模块商业定位、当前实验中的模块角色、模块级 business 上游约束与边界事实 | 不做中央战略裁决，不代替产品 / 代码 registry 输出实现细节 |
| `<Module>ProductRegistry` | 由 CPO 小乔管理；提供模块产品定位、成熟度、依赖、规划 / 已落地边界事实 | 不做总体战略裁决，不替代技术实现判断 |
| `<Module>CodeRegistry` | 由 CTO 小狄管理；提供模块代码结构、CodeGraph 摘要、仓库健康、实现范围、代码风险事实 | 不做总体战略裁决，不替代产品范围判断 |
| `CTO` | 技术收口 owner 会签位：涉代码事实、CodeGraph、工程门禁的回写必经会签 | 不代行产品范围判断 |
| `CPO` | 产品域回写 owner：产品域回写守 PRD/product-state 真源提交纪律；收口触发/时序归 COO 督办、登记归 CGR、呈报归 COS（与 CTO 会签位对称；2026-09-11 五裁① 落格） | 不握督办/分派/升级/销账权（⑦ 权界同构） |
| `CompanyGovernanceRegistry` 补充 | 负责 agent 发布纪律、单一 discovery target、CHO/CAO 边界和 registry 运行治理 | 不替代 `BusinessStrategy` 做商业边界裁决 |
| `CEOChiefOfStaff` | 汇总呈报半环：fan-in 呈报、registry 间冲突升级、升级链与董事会通道；公司级分派权/升级权保留 | 不进入收口督办日常环（督办/催办已迁 COO） |

补充治理：`CompanyGovernanceRegistry` 负责 agent 发布纪律、单一 discovery target、CHO/CAO 边界和 registry 运行治理；它不替代 `BusinessStrategy` 做商业边界裁决，也不替代模块 Product / Code registry 输出事实。

## 4. 适用触发条件

以下情况应考虑发起一次中央 registry 收口：

- 某次会议、日常收口、架构评估或研发轮次已经形成会影响多个 registry 的正式结论。
- 模块边界、模块职责、宿主归属、运行面划分或跨模块依赖出现变化。
- 某个模块的 `Product Registry` 与 `Code Registry` 需要和中央 registry 同步回写。
- 某次事项涉及组织制度、秘书处流程或岗位边界变化，需要 `CompanyGovernanceRegistry` 参与。
- 当前事实无法只在单个模块内闭环，需要组织跨 registry 并行核对。

## 5. 标准执行流程

### 5.1 收口请求 intake

发起人默认是 CEO、秘书处、`CEOChiefOfStaff` 或 `COO`（督办受理位）。首轮至少整理以下字段：

- `closeout_subject`
- `trigger_reason`
- `candidate_modules`
- `known_changes`
- `open_questions`
- `required_writebacks`
- `deadline`

如果关键信息不足，督办位只补问最小缺口，不把整个过程重新盘问一遍。

建议把这次收口先整理为 `CENTRAL_REGISTRY_CLOSEOUT` 对象，并尽量满足：

- [central-registry-closeout.schema.json](./central-registry-closeout.schema.json)
- [handoff-templates/central-registry-closeout.example.json](./handoff-templates/central-registry-closeout.example.json)
- [../../.github/prompts/中央收口输出模板.prompt.md](../../.github/prompts/%E4%B8%AD%E5%A4%AE%E6%94%B6%E5%8F%A3%E8%BE%93%E5%87%BA%E6%A8%A1%E6%9D%BF.prompt.md)

补充约束：`handoff-templates/*.example.json` 与 `operating-cycle-example/*.sample.json` 只可作为结构样板、prompt 夹具或 workflow companion example 使用，不能单独当作项目事实证据、正式经营记录或模块已确认结论引用。凡引用这些样板时，必须同时给出非样板真源，例如 `docs/registry/*.md`、`docs/workflow/operating-records/**`、会议纪要、真实 runtime audit 或对应模块真源文档。

补充约束：当样板、收口 companion doc 或中央摘要需要引用当前宿主相关资料时，默认先引用模块真源中的稳定结论或中央治理摘要；只有在确实需要指向当前宿主特有的已发布副本、phase 证据或审计记录时，才引用对应 support bundle 路径。不要把当前 support root 的物理路径写成中央协议层的默认引用入口。

若某次收口需要落到“怎么更新 support published-copy / runbook / evidence”的动作层，默认引用 `TriCompany/docs/workflow/published-copy-refresh-sop.md` 与 `TriCompany/.github/manifests/tricompany-published-copy-manifest.json`；不要把 `TriCompany-copilot-host-assets/**` 下的具体物理路径写成中央收口对象的默认执行步骤。

### 5.2 范围门禁

满足以下任一条件时，先询问 `BusinessStrategy`（即 BS 被调参前置线）：

- 当前商业实验范围不清。
- 是否应纳入某个模块仍有争议。
- 模块边界、正式宿主、优先级或中央口径可能变化。
- 某个结论会影响中央运行面、`TriModel`、虚拟公司、PC 端软件层等中央边界。

如果只是已知模块内的事实回填，可直接进入并行 registry 路由，不必每轮都先问 `BusinessStrategy`。

### 5.3 并行 registry 路由

`COO`（督办组织）根据范围门禁结果，组织以下 registry 并行处理：

- 涉及模块商业定位、当前实验中的模块职责、模块级边界或 `product-state.md` / `code-state.md` 是否仍符合当前商业定位时，路由对应 `<Module>BusinessStrategyRegistry`。
- 涉及模块产品事实时，路由对应 `<Module>ProductRegistry`，owner 为 CPO 小乔。
- 涉及模块代码事实、CodeGraph、技术风险或工程门禁时，路由对应 `<Module>CodeRegistry`，owner 为 CTO 小狄。
- 涉及组织制度、会议治理、秘书处边界或公司治理资料时，路由 `CompanyGovernanceRegistry`，owner 为 CAO。
- 涉及项目级真源沉淀时，补充路由 `TriMetaverseProductRegistry` 与 `TriMetaverseCodeRegistry`。

默认顺序是：先模块 `BusinessStrategyRegistry`，再模块 `ProductRegistry` / `CodeRegistry`，最后由 `CEOChiefOfStaff` 合并回中央层；只有中央边界不清时才回到 `BusinessStrategy` 做范围裁决。

如果目标 registry agent 尚未完整落地，应回退到该模块的 `AGENTS.md`、`README.md`、`docs/registry/` 和源码树，并明确标记“agent 缺口 / 待补齐”，不能假装已具备自动收口能力。

如果目标 registry agent 已从中央过渡入口迁到模块侧 `.github/agents/`，督办位应调用模块侧 canonical agent，并确认 `TriMetaverse/.github/agents/` 下不存在同名中央副本。若发现同名双活，先交由 `CompanyGovernanceRegistry` 做发布治理修正，再进入正式收口。

### 5.4 单个 registry 的最小返回结构

每个参与收口的 registry 至少返回：

- `registry_id`
- `source_of_truth`
- `confirmed_facts`
- `changed_facts`
- `proposed_writebacks`
- `gaps`
- `escalations`

其中 `confirmed_facts` 和 `changed_facts` 必须明确区分“已实现 / 已确认”“规划中 / 待确认”。

在结构化对象里，这一层建议沉淀到 `payload.registryFindings`。

### 5.5 fan-in 汇总呈报（半环留 COS）

`CEOChiefOfStaff` 负责合并并行结果，完成以下判断：

1. 哪些事实已经足以正式回写。
1. 哪些事实在 registry 之间冲突，必须升级。
1. 哪些模块还缺资料，只能写成 `待确认` 或 `待初始化`。
1. 哪些结论需要上卷到中央 registry，哪些只需停留在模块 registry。

`COO` 在 fan-in 前提交督办读数（时限达成/逾期/升级建议）；`CompanyGovernanceRegistry` 在 fan-in 时出具登记收口读数（已收册/待回写/缺口清单）。

### 5.6 正式回写与关闭条件

正式回写由 `CompanyGovernanceRegistry` 执行登记，回写动作守各真源 owner 提交纪律。正式关闭前至少满足：

1. 参与范围已经确认。
1. 相关 registry 已给出最小返回结构。
1. 需回写文档和待补齐缺口已经分开。
1. 需要升级的事项已经单列，不与已确认事实混写。
1. 涉技术事实回写已获 `CTO` 会签。

### 5.7 权责同步规则

收口权责与 owner 矩阵变更，先改 `TriCompany/docs/registry/company-governance-state.md`（Current Ownership），再同步 `TriMetaverse/docs/workflow/github-repo-governance.md` §8；两处不一致以 governance-state 为准。本工作流与矩阵行互为指针，禁双真源复述。

## 6. 四层记忆映射

四层记忆在 registry 收口中的推荐映射如下：

| 四层语义 | 在 registry 收口中的含义 | 当前推荐载体 | 当前约束 |
| --- | --- | --- | --- |
| 身份层 | registry 的职责边界、模块归属、稳定 charter | agent 文档、模块 `AGENTS.md`、registry README、中央边界文档 | 先用文档承载，不宣称已存在统一 runtime 身份库 |
| 阶段记忆层 | 当前这一次 closeout batch 的主题、范围、未决项、回写计划 | 收口 payload、operating record、会话上下文、临时工作流文档 | 可以轻量实现，不要求所有 registry 先有独立长期 memory backend |
| 组织共享层 | 已确认并需要跨角色共享的事实 | `docs/registry/*.md`、项目真源文档、经营对象 | 这是当前最应该优先打通的层 |
| 审计层 | 证据、分歧、升级原因、时间线、批准痕迹 | 会议纪要、evolution log、operating review、审计记录 | 不能省略；否则无法安全做 fan-in |

说明：四层记忆是经营语义分层，不等于“memory tool 路径”或单一 runtime 存储实现。宿主侧缓存、session memory 与 cognition runtime 只能视为承载方式，不能替代项目文档真源。

## 7. 当前推荐落地顺序

1. 先为中央和关键模块保留清晰的 registry agent 入口；模块级入口逐步迁回对应模块 `.github/agents/`，缺失处先用模块文档真源兜底。
1. 新增“中央 registry 收口”专用 prompt，作为标准发起入口。
1. 把每次中央收口至少收敛到“组织共享层 + 审计层”两层闭环。
1. 待通用 dispatcher 落地后，再把 registry closeout 扩成统一 skill / schedule / runtime 能力。

## 8. 禁止事项

- 不要把“所有 registry 最终应有 agent”写成“所有 registry 已经 fully automated”。
- 不要把四层记忆语义直接写成“所有 registry 已接入同一套 memory runtime”。
- 不要跳过模块 registry，直接把猜测回写到中央 registry。
- 不要让 `BusinessStrategy` 代替模块 registry 处理逐项事实收口。
- 不要把宿主侧 memory cache 当成项目级事实真源。
- 不要让同一个模块 registry agent 同时在模块 `.github/agents/` 与 `TriMetaverse/.github/agents/` 作为 discoverable live entry 存在。
- 不要让 `COO` 以督办名义行使分派权或升级权（权随迁边界见 §3 表与 §5.7）。
- 不要绕过 `CompanyGovernanceRegistry` 登记直接改收口状态读数（登记收口执行位唯一）。
