# TriCompany 赛博公司中央摘要

版本：V1.2 中央追平版
日期：2026-09-14
状态：当前中央摘要

## 文档同步元信息（双重身份）

- 身份 1（宪章指针）：公司宪章真源=[../TriCompany/tricompany.md](../TriCompany/tricompany.md)（V1.0，2026-08-01 生效）；宪章本体修订不在本文件进行。
- 身份 2（摘要同步面）：本文件是宪章与公司现状态的中央摘要，published-summary 纪律同步。
- sourceOfTruth: TriCompany/tricompany.md（宪章）；公司实现状态以 `../TriCompany/` 源仓为准
- syncMode: published-summary
- sourceRevision: sha256:8d8967448a49c825c2079755ff3ede0b00f9822d87f6df487d33c1516b1fa1f8（2026-09-11 重算与 2026-08-07 基准同值：源侧宪章零变更，revision 基准不变）
- lastSyncedAt: 2026-09-14（批文④：历史附录外移，本件自此纯现役摘要）

---

## 1. 文档定位

本文是 `TriCompany` 在 `TriMetaverse` 中的中央摘要，用于说明公司定位、当前开发进度、能力成熟度、组织状态和宿主边界。它不再承担早期商业方向穷举、岗位设想或完整实施细则。

当前真源分工如下：

1. 总商业模式、模块边界：[docs/tmv-whitepaper.md](docs/tmv-whitepaper.md)、[docs/三元宇宙架构与模块说明.md](docs/三元宇宙架构与模块说明.md) 与中央 `BusinessStrategy`。
2. TriCompany 公司宪章：[../TriCompany/tricompany.md](../TriCompany/tricompany.md)。
3. 产品事实：[../TriCompany/docs/product/](../TriCompany/docs/product/) 与 [../TriCompany/docs/registry/product-state.md](../TriCompany/docs/registry/product-state.md)，经营 owner 为 CPO 小乔。
4. 技术事实：[../TriCompany/docs/engineering/](../TriCompany/docs/engineering/) 与 [../TriCompany/docs/registry/code-state.md](../TriCompany/docs/registry/code-state.md)，经营 owner 为 CTO 小狄。
5. 员工、合同与治理事实：[../TriCompany/docs/registry/employee-roster.json](../TriCompany/docs/registry/employee-roster.json)、岗位 contract、binding profile 和 workflow 文档。

本文件对上游真源不重述、只指针；项目流程口径见 [docs/project.md](project.md)（不重述）。历史附录已外移至 [docs/archive/tricompany-v0.1-design-20260324.md](archive/tricompany-v0.1-design-20260324.md)（2026-09-14 批文④；引用按历史冻结件纪律，不得当现行口径）。动态经营事实真源=operating-records 周面+registry state，本件不承载周度进度。

出现冲突时，中央战略边界以上游中央真源为准；TriCompany 的实现状态以同级 `../TriCompany/` 源仓为准。本文件只做中央追平，不替代源侧持续维护。

## 2. 当前定位

TriCompany 是赛博公司的研发仓与经营编排孵化仓，也是赛博公司概念的产品化承载。它负责定义“谁来做、按什么标准做、如何参与和核签”，各项目模块负责定义“做什么、如何实现和交付”。

| 维度 | 物理承载 | 当前职责 |
| --- | --- | --- |
| 公司维度 | `../TriCompany/` | 员工源侧资产、岗位合同、经营记录、组织制度、治理文档、Hermes 融合与公司级编排 |
| 项目维度 | TriMetaverse 及各模块仓 | 产品与工程真源、代码、模块 registry、阶段产物 |
| 桥接层 | TriCompany IPD + TriDev | TriCompany 组织员工参与、资料和书面核签；TriDev 承接十阶段 phase engine、gate、版本和执行证据 |

必须保持以下边界：

- TriCompany 不是中央战略仓，不替代 `BusinessStrategy` 做总体商业裁决。
- TriCompany 不是服务域主控；现行运行面为 M/R 双面（服务域=`TriMMC`+`TriRMC`，本地域=`TriMLC`+`TriRLC`；M面=claude code runtime 实然·现役，R面=agent-core 应然·主开发中）。
- 【历史】原「Copilot-host live/本地正式接管/TriMC 正式宿主切换」叙事已退役（2026-09-11 LG-034⑤e）；宿主切换仅 M面经 fade 渲染链。
- Hermes 已形成分层设计、原型和多层验证，但不能写成生产级 Hermes 已完成接入。
- TriCompany 公司宪章已生效，不等于 TriCompany 的正式中央模块地位已经由中央战略完成裁决。

## 3. 当前阶段

- 公司宪章：V1.0，2026-08-01 生效。
- 当前经营阶段：`ceo-copilot-host-coordination`（登记名沿用；语义=CEO 直连+常驻中枢协调阶段）。
- 当前宿主：M面 claude code runtime（实然·现役）。文档真源=TriCompany 源侧（source-agents/project-sources），两宿主位（`.claude/agents` 主力运行位、`.github/agents` 入口位）均为发布拷贝；「宿主 write master」旧概念退役（LG-034 B2-R2，经 CEO 2026-09-11 晨报裁定追平）。「Copilot-host live ≠ 正式宿主切换」边界声明语义保留。
- 当前项目：源侧宪章登记为 TriMetaverse 主项目与 TriCade 桌面产品。
- 当前 MVP 运行主链：`TriMMC -> TriModel -> TriStaciss -> Provider`（最简口径（简化），全链终述候 CEO——挂起项）。
- TriCompany 在该 MVP 中属于公司治理、员工参与和交付核签层，不是模型调用业务流量的核心转发节点。

宿主资产按三层管理：

1. `../TriCompany/`：公司定义、源侧员工资产、合同、runtime 和发布真源。
2. `TriCompany-copilot-host-assets/`：当前 Copilot-host 支撑包、知识对象、runtime 副本与验证材料。
3. `.github/`：当前实际生效的 Copilot-host live 入口。

【历史】原「到 `TriMetaverse V1 正式上线切换阶段` 切换至正式运行面」段落退役（2026-09-11 LG-034⑤e）：宿主切换叙事不再成立，现行基线见 §2/§3；V1 成熟点判读候 CEO（发布 readiness 另走门禁读数后钉措辞）。

## 4. 组织与岗位现状

截至 2026-08-01，员工名册登记 13 名 live 员工，不含 CEO 磨人本人。

### 4.1 C-suite（8 人）

| 员工 | 岗位 | 当前主责 |
| --- | --- | --- |
| 小贾 | CEOChiefOfStaff | 公司级路由、协调、催办、升级；中央收口按 2026-09-11 ⑦ 改排：编排组织归 COO、CompanyGovernanceRegistry 执行登记收口（CAO② 追平） |
| 小乔 | ChiefProductOfficer | 产品定义、PRD、MVP 边界、Product Registry |
| 小狄 | ChiefTechnologyOfficer | 技术路线、交付架构、Code Registry、工程门禁 |
| 小源 | ChiefHumanResourcesOfficer | 岗位生命周期、交接治理、完成度监督 |
| 小行 | ChiefAdministrativeOfficer | 秘书处、会议制度、行政与公司治理资料归属 |
| 小敏 | ChiefMarketingOfficer | 市场信号、竞品、需求研究与 PRD 前置证据 |
| 小营 | ChiefOperatingOfficer | 经营节奏、rollout、跨部门执行和复盘 |
| 小财 | ChiefFinancialOfficer | 预算、成本护栏、单位经济与财务风险 |

### 4.2 执行层（5 人）

| 员工 | 岗位 | 汇报关系 |
| --- | --- | --- |
| 小全 | FullStackDeveloper | CTO |
| 小柯 | TestEngineer | CTO |
| 小吴 | RAndDTrainer | CTO |
| 小成 | CustomerSuccessOfficer | COO |
| 小布 | DeploymentEngineer | CTO |

13 名员工均已有源侧定义与 binding profile，并登记为当前 Copilot-host live。合同当前存在两种位置：早期合同集中在 `../TriCompany/docs/registry/`，V2 新员工合同可位于各自 `../TriCompany/source-agents/<employee-id>/` 目录。物理位置差异不应误判为员工未上岗。

上述 live 状态只说明当前阶段已完成岗位入口与绑定，不代表完整授权矩阵、真实业务数据管道或自动化经营已经生产化。

## 5. 小乔产品线摸底

### 5.1 已落地

- 已建立 product、engineering、execution、registry、workflow、training 六层文档基线。
- 已形成 V1.0 公司宪章、13 人员工名册和公司/项目双维度模型。
- Product Registry 已由 CPO 小乔接管，总助不再长期代管产品 owner。
- 已明确 TriCompany IPD 双线：市场雷达线负责发现与整理机会，主动交付线挂接 TriDev 十阶段主线。
- source-side IPD runtime 已按 `DISCOVERY -> INTELLIGENCE -> DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE -> DELIVERY` 建立一比一 stage line，并挂接业务 owner、执行 owner、gate owner、参与岗位、资料包和书面核签。
- 已建立模块归属治理：既有模块先走 `ModuleTargetingReport` 与 `ModuleReadinessInit`；新增正式模块先形成 `NewModuleBaselineRelease`，签核后才允许 `TriDev init`。
- 已形成跨宿主规格桥接思路：contract YAML 是统一规格，各宿主渲染面（M面 claude code 现役；R面 agent-core 应然·主开发中）是规格消费者（原「Copilot-host 与 TriMC 双轨」口径随宿主切换叙事退役）。

### 5.2 当前产品判断

- TriCompany 当前首先服务公司内部经营与研发交付，不应被包装成已经面向外部客户完成商业化的 SaaS 产品。
- 在当前最简可验证模型中，TriCompany 是支撑与治理层；核心用户运行链仍是 `TriMMC -> TriModel -> TriStaciss -> Provider`（最简口径（简化），全链终述候 CEO——挂起项）。
- 当前产品价值主要体现在岗位合同、公司级路由、IPD 参与核签、知识对象、会议与经营记录，以及跨宿主可迁移规格。
- 源侧 `PROJECT.md`、`REQUIREMENTS.md`、`STATE.md` 和 README 仍保留 V0.1 元数据或早期“下一步”表述，内容虽已持续增补，但版本头和部分阶段说明需要后续统一追平。

### 5.3 产品侧未完成

- TriCompany 模块地位已经中央 `BusinessStrategy` 职权内定谳（`docs/tmv-whitepaper.md` §3.3.1 已入表），无待裁分歧（T3-1 追平）。
- PRD 分叉并行、多分支 delivery 聚合和独立 phase package schema 族尚未完整落地。
- 13 个岗位的长期运行节律、真实业务输入输出和完整授权矩阵仍需持续补证。
- 对外客户价值、定价、收入证据和规模化经营模型尚不能从当前内部运行基线直接推出。

## 6. 小狄技术线摸底

### 6.1 已落地

- `source-agents/` 已形成员工源侧定义，`.github/binding-profiles/` 已覆盖 13 名员工。
- 已建立 role / employee knowledge workspace、组织共享空间与审计空间的对象生成和发布链。
- 已上线 TriCompany 模块级 orchestrator，用于源侧到 Copilot-host 发布侧的同步、manifest 维护和发布纪律；当前只覆盖 Phase 1 Copilot-host，多宿主适配仍是占位。
- `runtime/cognition/` 已形成 contracts、kernel、providers 和 chief-of-staff workflow / schedule / closeout / wiki refresh 等源侧入口。
- 元认知采用“统一公司内核 + 员工私域 + 组织共享 + 审计”的混合结构，统一协议但不混同人格与私域记忆。
- 已形成 smoke、contract、integration、backend、external adapter、HTTP backend、Supermemory schema、SDK seam 与 live smoke 等验证基线。
- 已完成 Supermemory 真实账号首轮 live smoke，但账号级限流、配额语义、持续稳定性和真实官方 SDK 包接入仍未完成生产级证明。
- IPD engine 已具备单 case 十阶段状态机、签核、事件日志、rollback/reopen 和 autopilot 入口，并可在 TriDev 可用时同步 phase result、gate 和 delivery evidence。
- 已建立 source publish pipeline；registry 记录的 2026-07-24 基线为相关验证 33/33 通过。
- 已建立本地 CodeGraph 基线并由 Code Registry 维护；主索引默认排除 vendor、缓存、构建产物和运行时状态。

### 6.2 当前技术判断

- 当前代码与文档足以支撑“M面 claude code runtime 本地手动版 + 部分自动化”的公司运行和继续研发。
- 当前 readiness 属于研发基线、host binding、live 验证与可回归原型，不属于宿主切换叙事中的任何「正式宿主」（该叙事已退役，见 §9），亦非 production-grade 自治公司。
- 当前实际生效入口、support root、源侧资产三者已经分层，后续修改必须沿 manifest 和 published-copy 规则发布，不能直接把支撑包当源仓维护。
- Code Registry 已由 CTO 小狄接管；总助只负责技术事项的公司级路由与收口。

### 6.3 技术侧未完成

- R面 agent-core 主控适配（应然·主开发中）的稳定性验证、回退演练、并发写入安全和生产部署 gates 尚未完成（原 TriMC host gates 口径随宿主切换叙事退役）。
- production 级 recall / consolidate、长期稳定性、账号级配额和外部 cognition provider 差异仍待验证。
- 完整跨岗位 adapter、PRD 多分支并行、delivery 聚合和全自动跨 case 编排尚未完成。
- 当前仍存在源侧状态文档与 8 月实际组织状态不同步的问题，需要按 owner 分批追平，不能把 registry 中的旧段落继续当最新结论。

## 7. TriCompany 内部能力模块盘点

| 能力面 | 当前状态 | 已有证据 | 主要缺口 |
| --- | --- | --- | --- |
| 公司宪章与六层文档 | 已落地 | V1.0 宪章、六层目录、registry | 多份文档版本头仍停留 V0.1 |
| 员工源侧资产 | 已落地 | 13 人 source agent、名册、岗位认知资产 | 长期业务节律与授权补证 |
| Contract / Binding / Live | 当前 M面 claude code runtime 已启用 | contract、13 份 binding、live entry | R面 agent-core 迁移（应然）和完整授权矩阵 |
| Host object 发布链 | 已落地 Phase 1 | manifest、generator、source publish pipeline | 多宿主发布适配 |
| 元认知 runtime | 可回归原型 | kernel、providers、多层 validation、live smoke | production 稳定性与正式 provider 契约 |
| IPD 公司参与层 | 部分自动化 | 十阶段 case line、sign-off、autopilot | PRD 分叉、多分支聚合、完整岗位 adapter |
| 秘书处与经营记录 | 当前可运行 | 会议 prompt、workflow、operating records | 制度成熟度和自动化追踪 |
| R面 agent-core 主控适配 | 应然·主开发中 | contract resolver 与迁移 gate 设计 | 稳定性验证、回退、并发写入安全与生产部署 gates |

## 8. 当前公司级执行链

开发型项目统一按以下职责链推进：

1. CEO / 总助明确方向、边界和是否需要中央升级。
2. CMO 提供市场、竞品、用户和机会证据。
3. CPO 收敛产品范围、PRD、MVP 与验收口径。
4. CFO 校验预算、成本、定价假设和财务风险。
5. CTO 形成技术路径、质量门禁、发布与回滚姿态。
6. COO 编排 rollout、跨部门窗口、观察指标和复盘。
7. TriCompany 组织岗位参与、资料包和书面核签。
8. TriDev 推进十阶段 phase engine、gate、版本和执行证据。
9. 小全、小柯、小布分别承接开发、测试和部署执行；小吴维护研发培训与导读；小成承接客户成功反馈闭环。

总助负责路由、协调、催办、升级和收口，不长期替代 CPO、CTO、CHO、CAO、CMO、COO、CFO 或执行岗位做专业 owner 判断。

## 9. 本次退役的旧口径

以下内容曾属于 2026-03-24 的 V0.1 设计讨论，不再作为当前执行基线：

- “V0.1 待讨论 / 草案”已被 2026-08-01 生效的 V1.0 公司宪章取代。
- “10 个高层岗位逐步启用”已被 8 C-suite + 5 执行层的 13 人 live 名册取代。
- “销售总裁”不在当前 canonical 员工名册中，不应继续与现役岗位并列描述。
- “尚未把全部高层落成可运行 agent”不再准确；当前应表述为 13 人 Copilot-host live，但长期运行与完整授权仍待补证。
- 固定 40 美元月成本、三条首发业务方向和 30 天盈利周期属于早期探索假设，不再作为 TriCompany 当前事实；经营目标应回到中央商业真源、当前经营计划和真实财务证据。
- DAO、股东会和董事会自动化仍是长期治理接口，不是当前已实现能力，也不是本轮开发进度判断依据。
- 不再使用 `Development Main Controller`、`Task Main Controller`、`Autonomy Main Controller` 作为当前标准模块名；运行面统一使用 TriMC，模型与宿主配置层使用 TriModel。
- **2026-09-11 LG-034 第二批退役**：上一行自身「运行面统一使用 TriMC」口径，连同「TriMC 统一运行面」「Copilot-host shadow/正式接管」「`TriMetaverse V1 正式上线切换阶段`」「`TriPilot → TriLC` 直连」「Tride=切换后正式宿主候选」等宿主切换叙事一并退役；现行口径见 §2/§3 与 `docs/三元宇宙架构与模块说明.md`（M/R 双面基线；宿主切换仅 M面经 fade 渲染链）。

## 10. 下一步

> **时点注记（LG-034-B2 追加，2026-09-11）**：本节系 2026-08-07 中央追平时点的待办快照。动态进度真源=`docs/workflow/operating-records/` 当前周（COS 收口域）与 registry state，本节不承载周度进度；各项现势性由对应 owner 在下一次追平时复核刷新。

### CPO 小乔

- 追平 [../TriCompany/docs/product/PROJECT.md](../TriCompany/docs/product/PROJECT.md)、[REQUIREMENTS.md](../TriCompany/docs/product/REQUIREMENTS.md)、[STATE.md](../TriCompany/docs/product/STATE.md) 与 [README.md](../TriCompany/README.md) 的版本元数据和阶段描述。
- 把 13 人组织、当前 MVP 支撑定位和对外产品化缺口纳入产品真源的下一次正式版本。
- 继续收口 PRD 分叉、phase package 和产品验收契约。

### CTO 小狄

- 追平 [../TriCompany/docs/engineering/STATE.md](../TriCompany/docs/engineering/STATE.md) 与 Code Registry 中已经过时的岗位、发布和验证表述。
- 继续补齐多宿主发布、完整岗位 adapter、长期稳定性和 R面 agent-core 主控适配 gates 证据。
- 保持 source、support、live 三层发布纪律和 CodeGraph / Git Health 基线。

### CEO 总助小贾

- 以后只把源侧已确认的稳定结论同步到本中央摘要。
- 发现产品与技术真源互相冲突时，先组织 CPO / CTO 联审，再决定 APPROVE、FREEZE 或升级 CEO。
- 正式模块地位、正式宿主切换和总体商业模式变化继续升级中央 `BusinessStrategy` 与 CEO，不在本文件自行宣布。

## 11. 版本记录

| 版本 | 日期 | 说明 |
| --- | --- | --- |
| V0.1-DRAFT | 2026-03-24 | 早期赛博公司组织与商业假设设计稿 |
| V1.0 | 2026-08-01 | TriCompany 源侧公司宪章生效，13 人员工体系发布 |
| V1.0 中央追平版 | 2026-08-07 | 按源侧宪章、CPO 产品真源、CTO 技术真源和员工名册重写中央摘要 |
| V1.1 中央追平版 | 2026-09-11 | LG-034 B2 批：宿主叙事按 M/R 双面基线换代、真源清单指针化（移除 project.md）、COS ⑦ 改排追平、BS 模块地位定谳追平、write master/MVP 主链挂起标记；附录历史归档一字未动 |
| V1.2 | 2026-09-14 | LG-034 批文④：历史附录外移至 `docs/archive/tricompany-v0.1-design-20260324.md`（frozen-archive 态，内容一字未动，SHA 对表在卷）；本件自此为纯现役摘要 |

---

## 附录：历史归档（已外移）

原 2026-03-24 V0.1 设计讨论稿全文已外移至 `docs/archive/tricompany-v0.1-design-20260324.md`（frozen-archive 态，内容一字未动，SHA256 对表在卷；LG-034 批文④ 2026-09-14 外移）。历史演进证据以该归档件为准；引用本件时不得把已外移归档当现行口径。
