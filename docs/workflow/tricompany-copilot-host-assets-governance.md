# TriCompany Copilot Host 资产治理方案

版本：V0.1
日期：2026-04-28
状态：当前阶段治理基线（执行中；首轮 runtime / ignore 收敛已完成）

## 1. 文档定位

本文用于收敛当前阶段 `TriCompany` 源仓、`TriCompany-copilot-host-assets` 支撑包、`TriMetaverse/.github` live 宿主入口与 `TriMetaverse/docs` 中央文档层之间的资产关系、owner 边界与同步纪律。

本文解决四类问题：

1. 哪个位置是模块真源。
2. 哪个位置是当前宿主发布包。
3. 哪个位置是当前 live 宿主入口。
4. 哪个位置只保留中央边界、workflow 协议与 operating record，而不再承担模块实现细节。

本文是治理和执行约束，不替代 `TriCompany` 模块内部的产品 / 技术真源，也不替代中央 `BusinessStrategy` 对模块边界的裁决。

## 2. 当前已核实的结构事实

### 2.1 `TriCompany` 是模块真源仓

- `TriCompany/` 是虚拟公司研发仓与 Hermes 融合研发仓。
- `TriCompany/` 仓内与模块研发直接相关的真源顶层面，当前以 `.github`、`docs`、`runtime`、`vendor` 组织；其中 `docs/` 内部再按 `product`、`engineering`、`registry`、`workflow`、`execution` 等同级子域分层。
- `TriCompany` 当前是真源，不是中央战略仓，也不等于正式宿主。

### 2.2 `TriCompany-copilot-host-assets` 是当前 Copilot 宿主支撑包

- `TriMetaverse/TriCompany-copilot-host-assets/` 当前直接放在根仓下，是为了给当前 `copilot chat` 正式接管路径提供统一 support root。
- 它当前不是 `TriCompany` 的完整镜像，也不是单纯 archive 目录，而是“当前宿主支撑包 + 发布后验证证据 + 部分发布副本”的混合体。
- 该目录当前可被 git 跟踪，但不应继续被当成与 `TriCompany/` 平级的第二真源。

### 2.3 `TriMetaverse/.github` 是当前 live 宿主入口

- 当前生效的总助与共享会议入口位于 `TriMetaverse/.github/`。
- `TriMetaverse/.github/` 承担的是当前宿主的 live 入口职责，而不是 `TriCompany` 模块内部研发资产的长期真源。

### 2.4 `TriMetaverse/docs` 是中央层摘要与协议层

- `TriMetaverse/docs/` 应保留项目级架构说明、模块边界、workflow 协议、handoff 对象、registry 索引与 operating record。
- `TriMetaverse/docs/` 不应长期维护 `TriCompany` 的模块实现细节、宿主内部实现细节或可在模块真源里完整表达的技术设计正文。

## 3. 当前混乱的根因

### 3.1 真源和发布包没有被制度性区分

- `TriCompany/` 与 `TriCompany-copilot-host-assets/` 当前都承载了 `docs/`、`runtime/`、`vendor/` 的同职责内容。
- 一部分内容已经在支撑包内继续演化，但没有明确回写到模块真源，导致支撑包开始承担“影子真源”职责。

### 3.2 当前 live 宿主与模块研发仓之间缺少单向发布纪律

- `TriMetaverse/.github/` 已经是 live 入口。
- 但模块源仓、支撑包、live 入口之间缺少统一的“谁发布、谁吸收、谁只读”的纪律，导致回迁、吸收、回滚和继续迭代混在一起。

### 3.3 中央层文档和模块层文档的职责被打穿

- 中央层文档中已经出现对 support root 物理路径和支撑包内部文件的直接依赖。
- 这会把中央 workflow 与某个当前阶段宿主布局绑定得过死，增加未来换宿主、换 support root 或裁剪资产包时的耦合成本。

### 3.4 git 跟踪策略仍需持续收敛

- 当前根仓 `.gitignore` 已覆盖 `TriCompany-copilot-host-assets/.env` 与 `TriCompany-copilot-host-assets/.tricompany-cognition/`。
- 支撑包根目录已补 `.gitignore`，当前至少覆盖 `.env`、`.tricompany-cognition/` 与 Python cache 产物。
- 当前支撑包内已存在 `.tricompany-cognition/` 这类明显偏运行态 / 落盘态的目录；虽然最小忽略规则已经落下，但“哪些应被追踪、哪些属于运行态数据”的边界仍需继续按资产类型细化。

## 4. 治理目标

治理目标不是立即搬目录，而是先钉住以下关系：

1. `TriCompany/` 只做模块真源。
2. `TriCompany-copilot-host-assets/` 只做当前 Copilot 宿主发布包和支撑包。
3. `TriMetaverse/.github/` 只做当前 live 宿主入口。
4. `TriMetaverse/docs/` 只保留中央层边界、协议、索引、审计与经营记录。
5. 同一份事实、设计或代码，不再允许在真源和支撑包中长期双写。

## 5. 四层资产模型

| 层 | 位置 | 角色 | 主 owner | 允许写入方式 | 同步方向 |
| --- | --- | --- | --- | --- | --- |
| 模块真源层 | `TriCompany/` | `TriCompany/` 仓内的模块研发真源；顶层以 `.github`、`docs`、`runtime`、`vendor` 等资产面组织，`docs/` 内部再按 `product`、`engineering`、`registry`、`workflow`、`execution` 等同级子域分层 | `TriCompany` 模块 owner；当前阶段由 `CEOChiefOfStaff` 协调，后续交给 `ChiefProductOfficer` / `ChiefTechnologyOfficer` | 允许正常研发、改文档、改代码、改模块内 `.github` | 向支撑包和 live 宿主单向发布 |
| 宿主支撑包层 | `TriMetaverse/TriCompany-copilot-host-assets/` | 当前 `copilot chat` 正式接管所需 support root、发布副本、验证入口、执行证据、baseline 与回滚材料 | 当前阶段由 `CEOChiefOfStaff` 协调，技术内容由 `TriCompanyCodeRegistry` 护栏 | 原则上只接受从 `TriCompany/` 发布或从 live 宿主沉淀回来的审计 / baseline 证据；不允许日常研发双写 | 从模块真源接收发布；向 live 宿主和审计层提供支撑 |
| live 宿主入口层 | `TriMetaverse/.github/` | 当前生效的 agent、prompt、instruction、manifest 等宿主入口资产 | 当前阶段由 `CEOChiefOfStaff` 协调 | 只允许围绕当前宿主入口的吸收、替换、回滚和验证；不承担模块实现细节研发 | 从 `TriCompany/` 发布并在需要时引用支撑包 |
| 中央摘要与协议层 | `TriMetaverse/docs/` | 项目级架构、模块边界、workflow、handoff 协议、registry 索引、operating record | `BusinessStrategy` 与中央 workflow owner；当前阶段由 `CEOChiefOfStaff` 协调 | 允许维护中央层边界、协议、索引和审计，不维护模块实现正文 | 向模块与宿主提供规则，不反向承接模块实现真源 |

## 6. 按资产类别的 owner 规则

### 6.1 模块级 docs

- `TriCompany/docs/product/`、`docs/engineering/`、`docs/workflow/`、`docs/execution/`、`docs/registry/` 是模块真源。
- `TriCompany-copilot-host-assets/docs/` 只保留三类内容：
  1. 当前宿主运行必需的支撑说明。
  2. 宿主验证、phase 证据、baseline、回滚材料。
  3. 已发布到当前宿主且确需与 support root 共存的副本说明。
- 如果某份文档主要回答“TriCompany 自己怎么设计、怎么实现、怎么演进”，它应回归 `TriCompany/docs/`。

### 6.2 runtime 与 vendor

- `TriCompany/runtime/` 与 `TriCompany/vendor/` 是源码真源。
- `TriCompany-copilot-host-assets/runtime/` 与 `vendor/` 只允许承接已发布到当前宿主的运行副本和当前宿主验证辅助代码。
- `TriCompany-copilot-host-assets/vendor/` 当前保留的是从 `TriCompany/vendor/reference/` 发布出来的冻结 `reference` 副本，不是 support 侧独立研发留下的第二真源；若后续某份 vendor 内容不再服务当前宿主验证，应优先在源侧裁剪，再在下一轮发布时一并移除 support 副本。
- 需要拆开判断 LLM wiki 的“机制实现”和“对象载荷”：
  - 机制实现、对象规范、编译 / 升格 / 审批 / report / workbench / recall checkpoint 与 cognition backend 等长期能力，真源在 `TriCompany/docs/workflow/`、`TriCompany/docs/engineering/`、`TriCompany/runtime/cognition/` 与 `TriCompany/vendor/reference/`。其中 `vendor/reference/hermes-agent-memory/` 只是 Hermes 参考冻结副本，实际改造与实现应落回 `runtime/cognition/`。
  - `TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/**` 与 `docs/execution/**/schedules/*.json` 指当前宿主直接消费或生成的对象载荷 / 对象集；旧 `knowledge/chief-of-staff/**` 已降为 deprecated legacy 兼容对象，只保留历史兼容和回滚参考。当前按迁移矩阵中的宿主对象分层治理，不纳入 docs published-copy manifest，也不代表 LLM wiki 机制本身以支撑包为真源。
- 后续创建其他固定员工，或像本轮 CPO / CTO 这样把既有 live entry 纳入统一员工体系时，必须先在 `TriCompany/` 源侧确认岗位 / 员工定义、agent 资产、四层记忆资产、岗位职责、协作关系、流程 owner 与 role knowledge workspace 机制；新增员工的源侧五件套应先通过 `TriCompany/runtime/cognition/employee_source_kit.py` scaffold / validator 门禁，确保 `.memory.md`、`.colleagues.md`、`.social.md` 只保留认知层契约，运行消费记录进入 support employee workspace 或 `TRICOMPANY_COGNITION_HOME` 驱动的 runtime state。发布到 `TriCompany-copilot-host-assets/` 后，才生成当前宿主实际消费的 inbox、wiki、audit、workbench、schedule JSON 等对象载荷。换宿主时应迁移完整虚拟公司源侧定义和流程，不应在新宿主重新招聘员工或重建流程。
- 当前 ProjectTrainer / 项目培训师已按源侧岗位定义处理，相关真源位于 `TriCompany/docs/workflow/project-trainer-role.md`、`TriCompany/.github/agents/project-trainer.*` 与 `TriCompany/docs/training/`；role / employee knowledge workspace 规则真源位于 `TriCompany/docs/engineering/role-employee-knowledge-workspace.md`，最小路径抽象位于 `TriCompany/runtime/cognition/knowledge_workspace.py`。ProjectTrainer 的 role / employee / org shared / audit support object payload 由 `TriCompany/runtime/cognition/employee_host_object_generation.py` 生成，源侧规则登记在 `TriCompany/.github/manifests/tricompany-host-object-generation-manifest.json`，support 侧对象登记在 `TriCompany-copilot-host-assets/host-object-manifest.json`；这不等于 ProjectTrainer 已在当前 live 宿主发布。
- CEOChiefOfStaff / 总助属于老员工兼容迁移：当前 live 入口仍在 `TriMetaverse/.github/agents/ceo-chief-of-staff.*`，且它就是当前阶段的活 live agent；本轮不另发第二个 live agent 文件，而是让同一个 live 入口绑定到新的 `knowledge/employees/ceo-chief-of-staff/**` support object 活路径。`knowledge/roles/ceo-chief-of-staff/**` 与 `knowledge/employees/ceo-chief-of-staff/**` 已用于把总助纳入统一员工对象体系。`TriCompany-copilot-host-assets/knowledge/chief-of-staff/**` 仍保留，但状态已降为 `deprecated-legacy-path`，不再作为当前活路径，也不代表 TriMC 正式宿主切换。
- ChiefProductOfficer / ChiefTechnologyOfficer 已按当前 Copilot-host live 上岗处理：现有 live 入口仍分别位于 `TriMetaverse/.github/agents/chief-product-officer.agent.md` 与 `TriMetaverse/.github/agents/chief-technology-officer.agent.md`；本轮不另发第二个 live agent 文件，而是补齐 `TriCompany/.github/agents/chief-product-officer.*`、`TriCompany/.github/agents/chief-technology-officer.*` 源侧五件套，并生成 `knowledge/roles/chief-product-officer/**`、`knowledge/employees/chief-product-officer/**`、`knowledge/roles/chief-technology-officer/**` 与 `knowledge/employees/chief-technology-officer/**` support object payload。该上岗只成立于当前 Copilot-host live 阶段，不代表 TriMC 正式宿主切换或完整授权矩阵已经完成。
- `.tricompany-cognition/**` 是 runtime-state，由 `TRICOMPANY_COGNITION_HOME` 或默认 repo-local backend 在真实写入时创建。ProjectTrainer 没有 `.tricompany-cognition/employee/project-trainer.md` 是预期状态；`org/shared` 与 `org/audit` 是全公司共享运行态命名空间，不按员工拆分。
- 禁止只在支撑包里新增长期运行代码而不回写模块真源。

#### 6.2.1 support-object-set 独立 manifest 准入门槛

`support-object-set` 默认先按对象目录 / 对象集直接治理，不自动拆成新的 host object manifest。

只有同时满足以下三条，才允许讨论单独建立 object manifest：

1. 已出现真实的跨宿主分发需求：同一对象集需要被两个及以上宿主运行面消费，或已明确进入当前宿主之外的发布包，而不是仍停留在单宿主试运行。
2. 已出现真实的统一枚举需求：至少有一个目录扫描以外的稳定消费者需要 machine-readable 索引来枚举整组对象，例如批准流、发布流、审计汇总或跨宿主同步流程。
3. 已出现真实的独立版本发布需求：这组对象需要独立的版本号、发布时间、兼容宿主范围或回滚映射，不能继续跟随整个 support root 一起粗粒度发布。

如果仍然满足以下任一条件，则默认不拆 object manifest：

- 仍只有当前 `copilot chat` 单宿主消费。
- 仍带有 `staging` / `notProduction` 标记，或仍属于 phase 试运行对象。
- 仍是 host-local working set，混合原始资料、过程痕迹和临时快照，尚未抽成可分发对象包。

#### 6.2.2 support-object-set 迁移标准流程

涉及当前宿主直接消费的对象路径、员工对象空间、workbench、audit、schedule 或治理锚点迁移时，必须沿用统一宿主演进阶段：

1. 真源阶段：先在 `TriCompany/` 源侧确认代码、manifest、文档和生成规则，不直接把 support bundle 改成第二真源。
2. shadow test 阶段：新对象路径与旧对象路径并行存在；旧路径保留可回退，新路径补齐等价对象，并运行对应 shadow gate 或 readiness gate。
3. 正式接管阶段：只有 shadow gate 通过后，runtime fallback、workbench 当前路径、中央治理锚点和 manifest 状态才可切到新路径；如果现有 live entry 已经是当前生效入口，则不新建第二个 live agent，而是由现有 live entry 承接新 support object 活路径；旧路径最多降为 deprecated compatibility，不直接删除。

本轮 CEOChiefOfStaff legacy path 迁移最初只以 readiness + 并行保留旧路径表达 shadow 阶段，缺少显式 shadow gate；现已补 `TriCompany/runtime/cognition/chief_of_staff_legacy_path_shadow_gate.py` 作为该类迁移的最小门禁样例。

### 6.3 模块内 `.github` 与 live `.github`

- `TriCompany/.github/` 是模块研发和发布侧真源。
- `TriMetaverse/.github/` 是当前 live 宿主入口。
- 模块侧 `.github` 变更进入 live 前，应先在模块侧收口，再通过 manifest / 吸收动作进入 `TriMetaverse/.github/`。

### 6.4 中央文档

- 中央文档允许记录：
  1. `TriCompany` 的模块定位与边界。
  2. 当前阶段宿主承载关系。
  3. workflow 协议、handoff 对象、registry 索引。
  4. 经营会议和 operating record。
- 中央文档不应长期记录：
  1. `TriCompany` 模块内部的实现设计正文。
  2. 仅对当前 support root 有意义的详细技术正文。
  3. 应该回到模块真源的宿主实现细节。

## 7. 单向发布与回写规则

### 7.1 标准方向

标准方向固定为：

1. `TriCompany/` 研发与收口。
2. 需要宿主支撑时，发布到 `TriCompany-copilot-host-assets/`。
3. 需要 live 入口时，吸收或发布到 `TriMetaverse/.github/`。
4. 需要中央级边界或经营留痕时，只把结论回写到 `TriMetaverse/docs/`。

### 7.2 禁止方向

以下方向默认禁止：

- 从 `TriCompany-copilot-host-assets/` 反向长期维护 `TriCompany/` 的实现真源。
- 在 `TriMetaverse/docs/` 中直接生成本应属于 `TriCompany/docs/` 的模块实现正文。
- 在 `TriMetaverse/.github/` 中直接发展模块级 docs / runtime 细节。

### 7.3 允许的例外

仅以下情况允许先写支撑包或 live 宿主，再补回真源：

1. 当前 live 宿主出现必须即时修复的入口级故障。
2. 宿主验证中产生了只在当前 host 才成立的短期补丁。
3. 会中产出的 baseline、归档、审计证据需要即时固化。

出现例外时，必须在同轮或下一轮把差异回写到 `TriCompany/`，不能把例外补丁长期留成事实真源。

## 8. git 与忽略规则

### 8.1 当前原则

- 不把 `TriCompany-copilot-host-assets/` 整体加入根仓忽略。
- 该目录当前属于应被追踪的宿主发布包和支撑资产，不是纯临时目录。

### 8.2 必须补齐的忽略范围

- `.env`、`.env.*` 这类环境变量文件；`.env.example` 这类模板除外。
- 宿主运行态落盘目录，例如 `.tricompany-cognition/` 这类由 `TRICOMPANY_COGNITION_HOME` 驱动的 repo-local backend 状态目录。
- 这里的 `.tricompany-cognition/` 只指宿主执行时产生和消费的本地状态数据；对应的 backend / storage 实现仍归 `TriCompany/runtime/cognition/` 维护，支撑包下同名 runtime 只能作为发布运行副本。
- Python 本地缓存与覆盖率产物，例如 `__pycache__/`、`.pytest_cache/`、`.mypy_cache/`、`.ruff_cache/`、`.coverage`、`coverage/`。
- 通过自定义输出路径临时落到 support bundle 中、但尚未提升为固定 evidence / support-object-set 的 JSON、日志、调试输出、下载产物和其他非审计型运行数据。

### 8.3 忽略规则判断标准

- 能从真源或发布流程重建的，优先忽略。
- 属于运行期状态、个人环境、敏感配置的，必须忽略。
- 属于 baseline、审计证据、发布清单、固定验证产物或当前宿主直接消费的 support-object-set 的，保留跟踪。

### 8.4 当前已制度化的落盘类产物

- `knowledge/employees/ceo-chief-of-staff/audit/**` 与 `knowledge/employees/ceo-chief-of-staff/workbench/{index.html,snapshot.json}` 虽由 runtime 生成，但当前属于受治理的 `support-object-set`，继续跟踪，不按 runtime-state 忽略。旧 `knowledge/chief-of-staff/**` 仅作为 deprecated legacy 兼容对象保留。
- `docs/execution/hermes-copilot-host/phase-1/SUPERMEMORY-LIVE-VALIDATION.latest.json` 这类固定 execution JSON 证据属于 `audit-record`，继续跟踪，不按 runtime-state 忽略。
- 只有当 `TRICOMPANY_SUPERMEMORY_LIVE_REPORT_PATH` 或其他自定义输出把文件落到上述治理锚点之外时，这些新增 JSON / 日志 / 快照才先按 `runtime-state` 本地化；后续若要纳入证据链，必须先补治理归类，再决定是否跟踪。

当前 phase-1 固定 report / report-like 锚点最少包括：

- `docs/execution/hermes-copilot-host/phase-1/SUPERMEMORY-LIVE-VALIDATION.latest.json`
- `knowledge/employees/ceo-chief-of-staff/workbench/index.html`
- `knowledge/employees/ceo-chief-of-staff/workbench/snapshot.json`
- `knowledge/employees/ceo-chief-of-staff/workbench/approval-report/snapshot.json`
- `knowledge/employees/ceo-chief-of-staff/workbench/approval-report/summary.md`

这组锚点当前要么属于 `audit-record`，要么属于受治理的 `support-object-set`；后续若 runtime 再新增固定 report 落点，应先补进治理页或迁移矩阵，再允许当作可跟踪资产长期保留。
当前 machine-readable 治理附表草案见 `docs/workflow/tricompany-copilot-host-assets-anchor-index.json`。
截至 2026-04-29 对 support execution runbook / evidence 页与 CEOChiefOfStaff employee workspace 的复扫结果是：除 `SUPERMEMORY-LIVE-VALIDATION.latest.json` 这条固定 execution JSON 证据锚点外，当前需要单列治理的 report-like 子树已切到 `knowledge/employees/ceo-chief-of-staff/workbench/approval-report/`。

## 9. 文档写作与回写纪律

所有后续新增或重写的相关文档，建议显式补齐以下元信息：

- `sourceOfTruth`：当前真源位置。
- `publishedFrom`：若是发布副本，标明来源位置。
- `syncMode`：`source-only`、`published-copy`、`central-summary`、`audit-record` 四选一。
- `lastSyncedAt`：最近同步时间。

最低要求是：任何一份文档都必须让后来者一眼看出“应改哪里，不应改哪里”。

当前首批 support published-copy 已完成头部语义归一化：

- `sourceOfTruth` 固定指向 `TriCompany/` 内的真源路径。
- support 副本的 `publishedFrom` 固定回填对应 source 路径，不再沿用“当前文件（source）”这类 source-like 口径。
- support 副本的 `syncMode` 固定使用 `published-copy`；只有 source 真源才继续使用 `source-only`。

### 9.1 当前 active published-copy

当前 support bundle 下并非所有同名文档都需要同轮追平；只有“当前 live 宿主固定前置核查、当前宿主 operator runbook 或当前发布验证链会直接读取”的 published-copy，才属于 active published-copy。

当前 engineering / workflow 范围内的 active published-copy 最少包括：

- `TriCompany-copilot-host-assets/docs/engineering/DESIGN.md`
- `TriCompany-copilot-host-assets/docs/engineering/metacognition-architecture.md`
- `TriCompany-copilot-host-assets/docs/registry/product-state.md`
- `TriCompany-copilot-host-assets/docs/registry/code-state.md`
- `TriCompany-copilot-host-assets/docs/workflow/chief-of-staff-rd-orchestration.md`
- `TriCompany-copilot-host-assets/docs/workflow/github-backport-manifest.md`
- `TriCompany-copilot-host-assets/docs/workflow/hermes-copilot-host-migration.md`
- `TriCompany-copilot-host-assets/docs/workflow/cyber-company-secretariat.md`

这些文档一旦 source 发生稳定语义变化，应在同轮或下一轮立即把 support 副本追平，避免当前宿主仍读取旧口径。

### 9.2 当前 on-demand published-copy

其余同名 product / engineering / workflow 文档默认降为 on-demand published-copy：它们仍可在 support bundle 保留参考副本，但不再要求 source 每次变化都在同轮追平 support。

当前首批 on-demand published-copy 包括：

- `TriCompany-copilot-host-assets/docs/product/PROJECT.md`
- `TriCompany-copilot-host-assets/docs/product/REQUIREMENTS.md`
- `TriCompany-copilot-host-assets/docs/product/ROADMAP.md`
- `TriCompany-copilot-host-assets/docs/product/STATE.md`
- `TriCompany-copilot-host-assets/docs/engineering/ROADMAP.md`
- `TriCompany-copilot-host-assets/docs/engineering/STATE.md`
- `TriCompany-copilot-host-assets/docs/engineering/chief-of-staff-llm-wiki-priority-plan.md`
- `TriCompany-copilot-host-assets/docs/engineering/cognition-runtime-module-plan.md`
- `TriCompany-copilot-host-assets/docs/engineering/hermes-memory-subsystem-comparison.md`
- `TriCompany-copilot-host-assets/docs/engineering/cyber-company-four-layer-memory-collaboration-system.md`
- `TriCompany-copilot-host-assets/docs/workflow/chief-of-staff-llm-wiki-object-spec.md`

这类文档的默认动作应是：

1. 先在 `TriCompany/` 维护真源。
2. 只有当当前宿主重新显式依赖、需要发版快照，或要做成批 published-copy 刷新时，才回写 support 副本。
3. support 副本在此之前允许暂时落后，但不得继续在 support bundle 独立演化。

### 9.3 phase 证据不是 published-copy

`TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/**` 这类 phase baseline、执行证据和回滚材料，不纳入 published-copy 同步纪律。

其中 `TriCompany/docs/execution/hermes-copilot-host/phase-1/{PLAN,SUMMARY,VERIFICATION,SUPERMEMORY-LIVE-VALIDATION}.md` 应视为 source 侧稳定执行结论；support bundle 下同名文件则继续保留为 phase 证据与 operator 审计材料。

它们属于 `audit-record`：

- 只保留当前 host / phase 证据
- 只把稳定结论回写到 `TriCompany/` 或中央摘要层
- 不要求与 source 做逐文件同名同步
- source 侧稳定结论文档可补 `linkedSupportEvidence`；support 侧证据页可补 `stableConclusionDoc`，但两者不构成 active published-copy

### 9.4 support execution 内部分层

在 support bundle 的 execution / phase 目录内部，还应继续区分 `operator-runbook` 与 `phase-evidence`，两者都属于 `audit-record`，但用途不同：

- `operator-runbook`：当前 host operator 会直接翻阅、用于执行或判断下一步的 support-only 操作页。
- `phase-evidence`：用于保存读审、演练、验证、补证和回滚证据的审计页。

当前首批 `operator-runbook` 至少包括：

- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-PHASE-1-TAKEOVER-CHECKLIST.md`
- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/CENTRAL-CEO-CHIEF-OF-STAFF-ABSORPTION-PLAN.md`
- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/SUPPORT-ROOT-RENAME-PLAN.md`
- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-FORMAL-APPOINTMENT-PREREQUISITES.md`

当前首批 `phase-evidence` 至少包括：

- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-PHASE-1-TAKEOVER-VALIDATION.md`
- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/MEETING-LIFECYCLE-REHEARSAL.md`
- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-SCHEDULE-STAGING-VALIDATION.md`
- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-LLM-WIKI-MVP-VALIDATION.md`

这组 support-only 文档可以继续在支撑包内维护，但若其中规则长期稳定并上升为模块制度、中央协议或组织规则，应回写相应真源，而不是继续把 support execution 当成唯一主档。

### 9.5 baseline / archive 索引页

support bundle 下的 baseline / archive 目录索引页也属于 `audit-record`，但它们既不是 `operator-runbook`，也不是普通 `phase-evidence`，而是 `archive-index`：

- 用于说明某个 baseline / archive 目录保存了什么快照。
- 用于提供 rollback、审计和历史路径核对入口。
- 不参与 published-copy 同步纪律，也不要求在 `TriCompany/docs/` 维护同名主档。
- baseline / archive 目录内的快照载荷文件（如归档的 agent、prompt、memory、social 等正文）默认视为冻结 archive payload，只用于历史核对，不单独补元信息，也不纳入同名同步或 published-copy 刷新范围。

当前首批 `archive-index` 至少包括：

- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/baselines/central-ceo-chief-of-staff-2026-04-18/README.md`
- `TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/baselines/tricompany-ceo-chief-of-staff-archive-2026-04-26/README.md`

### 9.6 support workflow quick checklist

如果当前 host operator 只需要快速判断“先改哪里、要不要追平 support、最后怎么验”，可直接使用 support root 下的 quick checklist：

- `TriCompany-copilot-host-assets/docs/workflow/published-copy-refresh-checklist.md`

该文件是 source-side SOP 的压缩版：

- source 真源仍是 `TriCompany/docs/workflow/published-copy-refresh-sop.md`
- support quick checklist 只服务当前 host operator 快速执行
- 若 SOP 稳定语义变化，quick checklist 需在同轮或下一轮追平

## 10. 当前阶段执行顺序

### Wave 1：治理基线先行

- 先补本文档。
- 先在中央层钉住四层模型与 owner 规则。
- 在正式收敛前，冻结新的跨层双写。
- 当前状态：已完成。

### Wave 2：文件级迁移矩阵

- 逐项列出 `TriCompany/`、`TriCompany-copilot-host-assets/`、`TriMetaverse/.github/`、`TriMetaverse/docs/` 的资产归属。
- 判断每份资产属于：保留、回归模块真源、转为中央摘要、转为 archive / baseline、删除。
- 当前矩阵基线见 `docs/workflow/tricompany-copilot-host-assets-migration-matrix.md`。
- 当前状态：已完成基线。

### Wave 3：第一轮收敛

- 先处理明显已经漂移的 `docs/`、`runtime/`、`vendor/` 副本。
- 把支撑包里不该继续做真源的内容回写到 `TriCompany/`。
- 把中央 docs 里过深的 support root 绑定压缩为摘要或索引。
- 当前状态：执行中；`runtime/cognition` 首轮回源、non-top-level glue 判定、support fallback published-copy 追平、active published-copy 文档批次追平、phase-1 execution 关键文档元信息补齐、首批 on-demand published-copy source/support batch refresh、support published-copy 头部语义归一化、中央摘要首批 source-first 尾扫与支撑包级忽略规则已完成。后续重点转到新增中央摘要页沿同一纪律校验，以及其他按需执行文档的元信息延续维护。

### Wave 4：再考虑目录搬迁

- 只有当 owner、发布方向和忽略规则稳定后，才讨论是否把 `TriCompany-copilot-host-assets/` 从根目录迁到更清晰的统一宿主资产位置。
- 目录搬迁不是当前第一优先级，避免先搬目录、后补治理导致混乱平移。

## 11. 当前不应写成已完成的事项

- 不应写成 `TriCompany-copilot-host-assets/` 已经被彻底收敛为只读发布物。
- 不应写成 `TriCompany/` 与支撑包已经完成自动同步。
- 不应写成中央 docs 已不再允许引用当前 support root；当前只是已完成“默认入口不再指向 support root”的首批尾扫，确需 runbook、phase 证据或 support-object-set 时仍可按治理规则引用支撑包。
- 不应写成当前治理方案已经等同于未来 `TriMC` 正式宿主的长期治理方案。

## 12. 后续关联文档

- `TriCompany/README.md`
- `TriCompany/.github/manifests/tricompany-published-copy-manifest.json`
- `TriCompany/docs/workflow/published-copy-refresh-sop.md`
- `TriCompany/docs/workflow/hermes-copilot-host-migration.md`
- `TriCompany-copilot-host-assets/README.md`
- `TriCompany-copilot-host-assets/docs/workflow/github-backport-manifest.md`
- `docs/workflow/tricompany-copilot-host-assets-migration-matrix.md`
- `docs/三元宇宙架构与模块说明.md`
- `docs/workflow/cyber-company-operating-workflow.md`
