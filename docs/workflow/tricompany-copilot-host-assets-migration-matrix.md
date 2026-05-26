# TriCompany Copilot Host 资产迁移矩阵

版本：V0.1
日期：2026-04-28
状态：Wave 2 基线（已补同名 published-copy 分级）

## 1. 文档定位

本文是 `docs/workflow/tricompany-copilot-host-assets-governance.md` 的配套执行清单。

治理文档负责钉住 owner、边界与同步方向；本文负责把当前可见的关键资产逐项归类，明确：

1. 该资产现在在哪。
2. 它未来应该归谁管。
3. 它属于真源、发布副本、live 入口、中央摘要、审计证据还是运行态数据。
4. 下一轮收敛时应执行什么动作。

本文只覆盖当前最关键、最容易引发双写和漂移的资产，不追求一次性枚举所有零碎文件。

当前 machine-readable published-copy 清单位于 `TriCompany/.github/manifests/tricompany-published-copy-manifest.json`。
当前固定 evidence / support-object-set 锚点附表草案位于 `docs/workflow/tricompany-copilot-host-assets-anchor-index.json`。
当前最小更新流程见 `TriCompany/docs/workflow/published-copy-refresh-sop.md`。
当前 host operator 快速执行版位于 `TriCompany-copilot-host-assets/docs/workflow/published-copy-refresh-checklist.md`。

## 2. 状态标签

| 标签 | 含义 |
| --- | --- |
| `source-only` | 模块真源，只允许在真源位置持续维护 |
| `published-copy` | 从真源发布出来的副本，可跟踪，但不应长期双写 |
| `live-entry` | 当前 live 宿主入口资产 |
| `central-summary` | 中央层摘要、协议、索引或经营记录 |
| `audit-record` | 审计证据、执行证据、baseline、回滚材料 |
| `support-object-set` | 当前宿主直接消费的 machine-readable 对象目录或对象集，不属于 docs published-copy manifest，也不是 live `.github` 入口 |
| `runtime-state` | 运行态 / 落盘态数据，应忽略或本地化 |

## 3. 迁移矩阵

| 资产组 | 当前位置 | 当前判断 | 目标归属 | 目标标签 | 下一步动作 |
| --- | --- | --- | --- | --- | --- |
| TriCompany 模块产品真源 | `TriCompany/docs/product/**` | 当前已是模块真源 | 保持在 `TriCompany/` | `source-only` | 不迁移；后续只允许中央层保留摘要引用 |
| TriCompany product 同名 published-copy | `TriCompany/docs/product/{PROJECT,REQUIREMENTS,ROADMAP,STATE}.md` 与支撑包同名副本 | product 真源在 `TriCompany/docs/product/`；支撑包中的同名 product 文档当前只作为 on-demand published-copy 保留，不再当作当前 host 的默认事实入口 | 真源保持在 `TriCompany/docs/product/`；支撑包仅保留按需发布副本 | `source-only` + `published-copy` | 默认只在 source 维护；仅在成批发布或当前宿主重新显式依赖时追平 support 副本，且不得继续在支撑包独立演化 |
| TriCompany 模块 registry 真源 | `TriCompany/docs/registry/**` | 当前已是模块真源 | 保持在 `TriCompany/` | `source-only` | 不迁移；中央层只同步稳定结论 |
| TriCompany registry 同名 published-copy | `TriCompany/docs/registry/{product-state,code-state}.md` 与支撑包同名副本 | registry 真源在 `TriCompany/docs/registry/`；其中 `product-state.md` 与 `code-state.md` 当前属于 active published-copy，因为当前 live host 固定前置核查仍会读取 support 副本 | 真源保持在 `TriCompany/docs/registry/`；支撑包仅保留当前 host 所需副本 | `source-only` + `published-copy` | source 稳定语义变更后，support registry 副本需在同轮或下一轮追平；不得继续只在支撑包独立演化 |
| TriCompany engineering 同名 published-copy | `TriCompany/docs/engineering/{DESIGN,metacognition-architecture,ROADMAP,STATE,chief-of-staff-llm-wiki-priority-plan,cognition-runtime-module-plan,hermes-memory-subsystem-comparison,cyber-company-four-layer-memory-collaboration-system}.md` 与支撑包同名副本 | engineering 同名副本已全量存在；其中 `DESIGN.md`、`metacognition-architecture.md` 属于 active published-copy，其余六份先降为 on-demand published-copy | 真源在 `TriCompany/docs/engineering/`；支撑包仅保留按需发布副本 | `source-only` + `published-copy` | active published-copy 同轮追平；其余副本允许在下一次成批发布前暂时落后，但不得继续在支撑包独立演化 |
| 已回源的 engineering 深文档 | `TriCompany/docs/engineering/chief-of-staff-llm-wiki-priority-plan.md`、`cognition-runtime-module-plan.md`、`hermes-memory-subsystem-comparison.md`、`cyber-company-four-layer-memory-collaboration-system.md` | 已完成回源，不再属于“仅存在于支撑包”的孤岛文档；当前 support 副本只作为参考发布物 | 真源保持在 `TriCompany/docs/engineering/` | `source-only` + `published-copy` | 后续只在明确批量发布或当前宿主重新显式依赖时再追平 support 副本 |
| TriCompany workflow 同名 published-copy | `TriCompany/docs/workflow/{chief-of-staff-rd-orchestration,github-backport-manifest,hermes-copilot-host-migration,cyber-company-secretariat,chief-of-staff-llm-wiki-object-spec}.md` 与支撑包同名副本 | workflow 同名副本已全量存在；其中 `chief-of-staff-rd-orchestration.md`、`github-backport-manifest.md`、`hermes-copilot-host-migration.md`、`cyber-company-secretariat.md` 属于 active published-copy，`chief-of-staff-llm-wiki-object-spec.md` 先降为 on-demand published-copy | 真源在 `TriCompany/docs/workflow/`；支撑包仅保留当前 host 所需副本与参考副本 | `source-only` + `published-copy` | active published-copy 同轮追平；object spec 仅在 live host 或支撑流程重新显式依赖时再批量发布 |
| 已回源的 workflow object spec | `TriCompany/docs/workflow/chief-of-staff-llm-wiki-object-spec.md` 与支撑包同名副本 | 已确认 source 为 workflow 真源；support 副本只做知识目录 / operator 参考，不再当成独立真源 | 真源保持在 `TriCompany/docs/workflow/` | `source-only` + `published-copy` | 后续避免 source/support 双向改写；若需补新规则，先改源仓，再决定是否发布副本 |
| TriCompany 模块 execution 真源 | `TriCompany/docs/execution/**` | 模块执行层真源位置成立；其中 `hermes-copilot-host/phase-1/{PLAN,SUMMARY,VERIFICATION,SUPERMEMORY-LIVE-VALIDATION}.md` 当前承载稳定执行结论 | 保持在 `TriCompany/` | `source-only` | 后续新增模块执行结论优先回这里；四份主文档继续只在 source 维护稳定结论 |
| 当前 host operator runbooks | `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/{CHIEF-OF-STAFF-PHASE-1-TAKEOVER-CHECKLIST,CENTRAL-CEO-CHIEF-OF-STAFF-ABSORPTION-PLAN,SUPPORT-ROOT-RENAME-PLAN,CHIEF-OF-STAFF-FORMAL-APPOINTMENT-PREREQUISITES}.md` | 当前 support root 专用操作页；host operator 仍会直接翻阅，但不构成模块同名真源 | 继续保留在支撑包；如规则长期稳定，再回写 workflow / governance 真源 | `audit-record` | 允许在 support 侧维护当前 host 专用步骤与判断；若上升为长期规则，必须同步回对应真源 |
| 当前 host phase 证据与 baseline | `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/**` | 明显绑定当前 support root 与当前宿主 phase 证据；同名 `PLAN/SUMMARY/VERIFICATION/SUPERMEMORY-LIVE-VALIDATION` 在 support 侧也属于历史 evidence，而不是 active published-copy；其中 `SUPERMEMORY-LIVE-VALIDATION.latest.json` 这类固定 JSON 证据同样属于受治理 phase evidence；`TAKEOVER-VALIDATION`、`MEETING-LIFECYCLE-REHEARSAL`、`SCHEDULE-STAGING-VALIDATION`、`LLM-WIKI-MVP-VALIDATION` 属于 support-only phase evidence | 详细证据继续保留在支撑包；稳定阶段判断回归 `TriCompany/` | `audit-record`（支撑包）+ `source-only`（提炼结论） | 不整体回迁为模块真源；继续保持“证据留支撑包、稳定结论回源仓”的执行纪律，固定 execution JSON 证据继续跟踪；后续只在出现新的稳定阶段结论时再增量回填 |
| execution baseline / archive 索引页 | `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/baselines/**/README.md` | 目录索引页只服务 baseline 快照说明、回滚入口与历史路径核对，不构成 source 真源；目录内其余快照载荷文件默认视为冻结 archive payload | 继续保留在支撑包 | `audit-record` | 允许在 support 侧维护 baseline / archive 索引；只在 baseline 构成或回滚说明变化时更新，不要求同名回源；baseline 目录内的 agent/prompt/memory 等快照文件不单独补元信息，也不参与 published-copy 同步 |
| 当前 host schedule object set | `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/schedules/*.json` | 当前 resident / cron staging 直接消费的 support-only schedule 对象；当前无同名 source JSON 真源，也不属于 docs published-copy manifest；现有对象仍全部声明 `executionHost = copilot-chat`，且 `metadata.staging/notProduction = true` | 继续保留在支撑包；结构真源回 `TriMetaverse/docs/workflow/schedule-spec.schema.json` 与 `TriCompany/docs/workflow/chief-of-staff-llm-wiki-object-spec.md` | `support-object-set` | 当前按 support-only object set 维护；在仍然是单宿主 staging 对象、且尚无跨宿主枚举入口前，不拆独立 schedule manifest。只有未来真的出现跨宿主发布、批量枚举或统一批准流需求时，才单独建立 schedule manifest，而不是塞进 docs published-copy manifest |
| 当前 CEOChiefOfStaff employee knowledge object 目录 | `TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/{inbox,wiki,audit,workbench}/**` | 当前宿主 runtime 直接消费的总助员工知识目录、审计 JSON 与工作台快照；这里的 support-object-set 只指对象载荷、运行输出和 host-local working set，不指 LLM wiki 机制实现本身。对象规范、工程设计和编译 / 升格 / 审批 / report / workbench / recall checkpoint 等实现真源分别留在 `TriCompany/docs/workflow/`、`TriCompany/docs/engineering/` 与 `TriCompany/runtime/cognition/`；当前无独立 machine-readable manifest，也不属于 docs published-copy manifest；其中 `audit/*.json`、`workbench/{index.html,snapshot.json}` 与 `workbench/approval-report/{snapshot.json,summary.md}` 虽由 runtime 生成，但当前仍属于受治理 support-object-set，不按 runtime-state 忽略 | 继续保留在支撑包；对象规范留在 `TriCompany/docs/workflow/chief-of-staff-llm-wiki-object-spec.md` 与相关 engineering 真源，机制实现留在 `TriCompany/runtime/cognition/` | `support-object-set` | 当前按对象目录直接治理；在仍然是当前宿主 working set、且尚未抽成跨宿主可分发对象包前，不拆独立 host knowledge manifest。只有未来需要跨宿主分发、批量枚举或独立发布版本时，才考虑单独建立 host knowledge manifest，不把它们混入 docs published-copy manifest |
| ProjectTrainer role / employee host object set | `TriCompany-copilot-host-assets/knowledge/roles/project-trainer/**`、`TriCompany-copilot-host-assets/knowledge/employees/project-trainer/**`、`TriCompany-copilot-host-assets/knowledge/org/shared/**`、`TriCompany-copilot-host-assets/knowledge/audit/**`、`TriCompany-copilot-host-assets/host-object-manifest.json` | ProjectTrainer 源侧岗位和员工知识空间发布到当前 support root 的最小对象载荷；源侧规则由 `TriCompany/.github/manifests/tricompany-host-object-generation-manifest.json` 与 `TriCompany/docs/workflow/host-object-publish-flow.md` 声明，生成逻辑位于 `TriCompany/runtime/cognition/employee_host_object_generation.py`；该对象集只代表 support asset 已生成，不代表 ProjectTrainer 已进入 live `.github` 宿主入口；`.tricompany-cognition/employee/project-trainer.md` 只有在 ProjectTrainer 实际 runtime 写入 cognition 后才会出现 | 保留在支撑包；源侧真源仍回 `TriCompany/docs/workflow/project-trainer-role.md`、`TriCompany/.github/agents/project-trainer.*`、`TriCompany/docs/engineering/role-employee-knowledge-workspace.md` 与 `TriCompany/runtime/cognition/` | `support-object-set` | 当前按独立 host-object manifest 登记；不得混入 docs published-copy manifest。后续若 ProjectTrainer live 启用，应另走 `TriMetaverse/.github` live/backport 清单与启用判断 |
| CEOChiefOfStaff role / employee compatibility host object set | `TriCompany-copilot-host-assets/knowledge/roles/ceo-chief-of-staff/**`、`TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/**`、`TriCompany-copilot-host-assets/knowledge/chief-of-staff/**`、`TriCompany-copilot-host-assets/host-object-manifest.json` | 总助是早于 role / employee workspace 的 live 老员工；本轮新增 role / employee payload 只是兼容迁移，把总助纳入统一员工对象体系。`knowledge/chief-of-staff/**` 继续作为 legacy support object set 保留，`.tricompany-cognition/employee/ceo-chief-of-staff.md` 继续是运行态状态文件，不是 support payload 真源。2026-04-29 第二阶段验证迁移已完成，readiness `--require-ready` 已通过，runtime fallback、workbench 与治理锚点已切到员工路径；旧路径已标记为 deprecated legacy compatibility path | 保留新旧对象集并行；live 入口仍回 `TriMetaverse/.github/agents/ceo-chief-of-staff.*`，源侧真源仍回 `TriCompany/.github/agents/ceo-chief-of-staff.*`、`TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md`、`TriCompany/docs/workflow/chief-of-staff-llm-wiki-object-spec.md`、`TriCompany/docs/engineering/role-employee-knowledge-workspace.md` 与 `TriCompany/docs/workflow/chief-of-staff-legacy-path-deprecation-readiness.md` | `support-object-set` + `live-entry` compatibility | 继续运行 `python -m runtime.cognition.chief_of_staff_legacy_path_deprecation_readiness --require-ready` 作为 post-deprecation 验证；当前已通过并完成 deprecated label；下一步只做 post-deprecation 验证，不删除、不归档旧目录 |
| CPO / CTO role / employee live binding host object set | `TriCompany-copilot-host-assets/knowledge/roles/chief-product-officer/**`、`TriCompany-copilot-host-assets/knowledge/employees/chief-product-officer/**`、`TriCompany-copilot-host-assets/knowledge/roles/chief-technology-officer/**`、`TriCompany-copilot-host-assets/knowledge/employees/chief-technology-officer/**`、`TriCompany-copilot-host-assets/host-object-manifest.json` | CPO / CTO 已存在当前 live `.github` agent，本轮按“现有 live entry 上岗绑定”处理：不新建第二个 live agent 文件，而是补齐 TriCompany 源侧五件套、source/support manifest 与 role / employee support object payload；`.tricompany-cognition/employee/chief-product-officer.md` 与 `.tricompany-cognition/employee/chief-technology-officer.md` 只有在真实 runtime 写入 cognition 后才会出现 | 保留在支撑包；live 入口仍回 `TriMetaverse/.github/agents/chief-product-officer.agent.md` 与 `TriMetaverse/.github/agents/chief-technology-officer.agent.md`，源侧真源回 `TriCompany/.github/agents/chief-product-officer.*`、`TriCompany/.github/agents/chief-technology-officer.*`、`TriCompany/docs/product/**`、`TriCompany/docs/engineering/**` 与对应 registry | `support-object-set` + `live-entry` binding | CPO / CTO 已完成当前 Copilot-host live 上岗绑定；下一步由两者输出首轮产品 / 技术接管判断。不得把该状态写成 TriMC 正式宿主切换或完整授权矩阵完成 |
| TriCompany runtime 核心与支撑包同名核心 | `TriCompany/runtime/cognition/**` 与支撑包下同名核心文件 | 真源与发布副本并存，但当前同名 support slices 已纳入 source/published-copy 同步纪律，不再按平行研发面使用 | 真源在 `TriCompany/runtime/cognition/`；支撑包保留运行副本 | `source-only` + `published-copy` | 后续只允许从源仓发布到支撑包；support 侧仅保留当前宿主运行副本与明确 host-only glue |
| 曾仅存在于支撑包的 runtime 增量 | `TriCompany-copilot-host-assets/runtime/cognition/chief_of_staff_*.py`、`dispatch/`、`runners/`、`tasks/` | 首轮高风险 runtime 增量已基本回源；其中 chief-of-staff LLM wiki refresh 最小链路、repo-asset/kernel/provider 基础层、batch refresh runner、approval timing、governance summary、wiki promotion / recall checkpoint、wiki approval、approval queue checkpoint / digest、host dispatcher + reminder/email 发送层、run record / audit sink / failure policy、registry closeout / operating review closeout 桥接层、registry closeout summary + schedule spec / registry 元数据层，以及 approval report / task resolver / cron-resident runner / knowledge workbench 层、schedule staging CLI + resident staging validation、workflow writeback / bidirectional memory sync / host hook simulation 入口层、resident runner CLI + operating review closeout CLI + registry / operating review closeout validation 层、wiki batch refresh CLI 层已回写到 `TriCompany/runtime/cognition/` 并通过 source 侧命令验证；本轮复核后，`dispatch/`、`runners/`、`tasks/` 中剩余差异已确认收敛为格式、typing、docstring 与注释漂移，未再发现 support-only 功能逻辑 | 除明确 host-only wrapper 外，继续按源仓真源 + support published-copy 收敛 | 源仓应为 `source-only`；若仅 host 适配则保留 `published-copy` | 第一轮代码收敛已完成十六批相邻 source slices，剩余 non-top-level runtime glue 判定已完成；后续改为按 published-copy 节律追平 support fallback 副本，并只在出现明确 host-only glue 时保留宿主特化，同时继续做必要的 workflow / engineering 文档回填 |
| TriCompany vendor/reference | `TriCompany/vendor/reference/**` | 当前应是模块冻结参考真源 | 保持在 `TriCompany/` | `source-only` | 支撑包若需参考副本，应只保留冻结发布副本 |
| 支撑包 vendor/reference | `TriCompany-copilot-host-assets/vendor/reference/**` | 当前是宿主支撑副本 | 保留为支撑副本 | `published-copy` | 后续核对是否与源仓一致，不在支撑包独立演化 |
| 模块侧 .github 套件 | `TriCompany/.github/agents/**`、`prompts/**`、`instructions/**`、`manifests/tri-metaverse-backport.json` | 当前应视为发布侧真源 | 保持在 `TriCompany/.github/` | `source-only` | 后续所有模块侧 host 资产先在这里收口，再发布到 live 宿主 |
| 当前 live 宿主入口 | `TriMetaverse/.github/agents/ceo-chief-of-staff.*`、共享 prompts、instructions、`manifests/tricompany-copilot-host-backport.json` | 当前生效入口，不等于模块真源 | 保持在 `TriMetaverse/.github/` | `live-entry` | 只做 live 吸收、替换、回滚；模块级语义改动应同步回 `TriCompany/.github/` |
| 当前 live 宿主 machine-readable backport manifest | `TriMetaverse/.github/manifests/tricompany-copilot-host-backport.json` | 当前宿主吸收、archive 映射与 supportRoot 状态的 machine-readable 清单；不属于 docs published-copy manifest | 保持在 `TriMetaverse/.github/manifests/` | `live-entry` | 只在 live 吸收、回滚、supportRoot 命名变化或 archive/baseline 映射变化时更新；不要误登记到 docs published-copy manifest |
| 当前 live 宿主 hooks | `TriMetaverse/.github/hooks/ceo-chief-of-staff-workflow-sync.json`、`ceo-chief-of-staff-workflow-sync.py` | 当前 live wrapper 仍只存在于宿主侧；其中 workflow command 识别与 `sync-memory` 调度纯逻辑已提炼回 `TriCompany/runtime/cognition/chief_of_staff_workflow_sync_hook.py` | 保持 live wrapper 在 `TriMetaverse/.github/hooks/`；可复用逻辑归 `TriCompany/runtime/cognition/` | `live-entry` + `source-only` | 保持宿主 wrapper 轻量化；后续如再出现通用 hook 语义，优先继续抽回源仓，而不是把完整实现长期留在 live hook 脚本 |
| 中央架构与 registry 摘要 | `TriMetaverse/docs/三元宇宙架构与模块说明.md`、`docs/registry/business-strategy-module-map.md`、`docs/registry/business-strategy-boundaries.md`、`docs/registry/product-state.md`、`docs/registry/company-governance-state.md` | 应保留中央层摘要与边界裁决；当前 `docs/三元宇宙架构与模块说明.md` 已收敛为治理路由，不再把 support root 写成默认入口 | 保持在 `TriMetaverse/docs/` | `central-summary` | 继续保留；后续仅对仍残留 support-root 默认入口的摘要页做 case-by-case 压缩 |
| 中央 workflow 协议 | `TriMetaverse/docs/workflow/cyber-company-operating-workflow.md`、`cyber-company-handoff-objects.md`、相关 schema / template | 应保留中央协议层 | 保持在 `TriMetaverse/docs/workflow/` | `central-summary` | 保留协议与对象定义，不在这里扩展模块实现正文 |
| 中央 operating record | `TriMetaverse/docs/workflow/operating-records/**` | 经营记录与审计层资产 | 保持在 `TriMetaverse/docs/workflow/operating-records/` | `audit-record` | 保留；只记录经营与治理事实，不替代模块技术真源 |
| 支撑包运行态落盘 | `TriCompany-copilot-host-assets/.tricompany-cognition/**` | 运行态数据，不适合作为源码或文档真源；这里不否定 cognition backend 属于 TriCompany 真源实现，只是把当前宿主执行产生的本地状态与实现代码分开治理 | 应本地化并忽略 | `runtime-state` | 已补支撑包级 `.gitignore` 覆盖 `.tricompany-cognition/`；backend / storage 实现继续归 `TriCompany/runtime/cognition/`，支撑包运行时只消费或生成本地状态，后续继续避免把运行态状态混入根仓 |
| 支撑包环境文件 | `TriCompany-copilot-host-assets/.env` | 环境配置，不应跟踪 | 保持忽略 | `runtime-state` | 继续忽略；`.env.example` 这类模板可跟踪 |
| 支撑包 Python 缓存与覆盖率产物 | `TriCompany-copilot-host-assets/**/{__pycache__,.pytest_cache,.mypy_cache,.ruff_cache,.coverage,coverage}` | 属于本地验证后可重建的缓存与覆盖率落盘，不构成宿主资产真源或审计证据 | 应本地化并忽略 | `runtime-state` | 支撑包级 `.gitignore` 应覆盖这些路径；若后续出现新的本地缓存类型，继续沿同一规则补充 |
| 支撑包自定义 report / 调试产物 | `TriCompany-copilot-host-assets/**` 下通过 `TRICOMPANY_SUPERMEMORY_LIVE_REPORT_PATH` 或其他 ad-hoc 输出落下的 JSON / 日志 / 临时快照 | 只有落在已治理锚点内的固定 evidence / support-object-set 才应跟踪；其余自定义输出在被正式归类前都只算 host-local working data | 默认保持本地，不直接入仓 | `runtime-state` | 自定义 report / debug 输出若落在治理锚点之外，先忽略；只有在确认要升级为固定 evidence 或 support-object-set 后，才补归类并转入跟踪 |

## 4. 第一轮收敛优先级

### P0：先处理会继续扩大漂移面的资产

1. `TriCompany-copilot-host-assets/docs/engineering/` 中 active published-copy 的同名主文档已完成追平；后续只在 source 稳定语义变化后按同轮或下一轮节律刷新。
2. `TriCompany-copilot-host-assets/docs/workflow/` 中 active published-copy 的同名主文档已完成追平；后续只在 source 稳定语义变化后按同轮或下一轮节律刷新。
3. `TriCompany-copilot-host-assets/docs/registry/` 中 active published-copy 的同名状态文档已完成追平；后续只在 source 稳定语义变化后按同轮或下一轮节律刷新。
4. `TriCompany-copilot-host-assets/runtime/cognition/` 中曾只存在于支撑包的 chief-of-staff 相关代码；当前首轮 source 回写、non-top-level glue 判定与 reviewed fallback published-copy 追平已完成，后续只在新增明确 host-only glue 时再单列处理。

### P1：再处理规则缺口

1. 继续维护支撑包运行态忽略规则；当前已补齐 `.env` / `.env.*`、`.tricompany-cognition/`、Python cache / coverage 产物，以及治理锚点之外的自定义 report / 调试产物边界；后续按实际运行产物继续细化。
2. active published-copy、phase-1 execution 关键文档与首批 on-demand published-copy 的 `sourceOfTruth`、`publishedFrom`、`syncMode`、`lastSyncedAt` 元信息已完成首轮补齐；其中 support published-copy 的 `publishedFrom` / `syncMode` 也已完成语义归一化，不再沿用 source-like 口径。当前 on-demand 清单已完成首轮 source/support batch refresh；后续重点转到其他按需更新的执行/审计文档。

### P2：最后处理中央层耦合

1. `docs/workflow/handoff-templates/skill-spec.example.json` 已完成 source-first / support-fallback 模板口径；后续继续沿同一规则检查其余 handoff template 与 companion example。
2. `docs/workflow/central-registry-closeout-workflow.md` 已补入“模块真源 / 中央摘要优先，只有在需要 phase 证据时才引用 support bundle”的 companion 引用规则；后续继续沿这条规则检查其它中央 workflow 协议页。
3. `docs/三元宇宙架构与模块说明.md` 已补足 source-first 路由，`docs/registry/README.md` 与 `docs/workflow/cyber-company-operating-workflow.md` 也未再把 support root 写成默认入口；本轮对当前首批中央摘要页的复核未再发现把 support root 写成默认入口的残留，后续只需对新增或改写摘要页继续沿同一规则校验。
4. 将这类内容压缩为“指向模块真源或已发布支撑包”的摘要口径，而不是继续扩正文。

## 5. 当前不应误判的事项

- 不应把支撑包里存在的文件都视为“必须保留在支撑包”。
- 不应把 `TriMetaverse/.github/` 的 live 入口直接视为 `TriCompany` 模块真源。
- 不应把中央 workflow 协议文档误删或整体迁回 `TriCompany/`。
- 不应在未完成 P0 回写前，就宣称支撑包已经被收敛为只读发布物。

## 6. 与后续动作的关系

- 下一轮补丁应优先同步推进 P2 中剩余中央摘要清扫，并在 source 稳定语义变化时按 published-copy 纪律继续刷新 active support 副本。
- 目录搬迁不是当前动作；只有完成 owner 收敛与第一轮回写后，才有资格讨论路径调整。
