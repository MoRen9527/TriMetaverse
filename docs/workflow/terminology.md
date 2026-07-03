# TMV Workflow 术语表（Terminology）

版本：v1  
日期：2026-03-04  
适用范围：TriMetaverse workflow 文档与执行记录

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/terminology.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-03

---

## 1. 术语管理原则

- 当前文件是 TriMetaverse workflow 术语系统的本地真源，只负责 workflow 协议、门禁、交付与宿主切换相关标准命名；它不是 TriCompany 公司级 workflow 书面真源。

- 本文件为 workflow 术语“单一事实源（Single Source of Truth）”。
- 涉及阶段产物、门禁产物、交付产物的命名，统一以本文件为准。
- 规范与手册中的术语段落仅作入口与摘要，详细定义以本文件为准。

### 1.1 严格模式（Strict Mode）

- 在正式章节（目标、输入、输出、门禁、验收、里程碑、交付清单）中，禁止使用非标准别名。
- 非标准别名仅允许出现在：术语表“非标准别名”小节、变更记录（changelog）、自检命令示例。
- 违反严格模式时，提交前必须完成术语修正后方可合入。

### 1.2 统一运行与宿主标准命名

- 宿主演进标准阶段统一写为：源码 -> shadow test -> 正式接管。当前本地宿主完成正式接管，不等于目标正式宿主已经切换完成；正式宿主切换只在目标宿主完成其自身正式接管后成立。
- `TriMC`：统一的 agent runtime 和 interaction core。当前 shadow 与当前阶段正式接管先由 `copilot chat` 承载，必要时可扩到 `copilot cli`；到 `TriMetaverse V1 正式上线切换阶段`，仍以 `TriMC` 为核心运行面。
- 赛博公司：所有人格 Agent 与非人格 Agent 的经营和交互核心载体。当前先由 `copilot chat` 承载验证与当前阶段正式接管；正式切换后运行在以 `TriMC` 为核心的服务域运行面。
- 研发工作流：`TriMC` 统一运行面中的研发执行切片，不再使用 `Development Main Controller` 作为当前标准名。当前第一宿主是 `copilot chat`，必要时可扩到 `copilot cli`；正式切换通过 `TriModel` 的 Provider/Model 配置完成。
- `TriModel`：Provider/Model 统一配置层，为 `TriMC` 与 `Tride` 两个 orchestration 提供多 provider 适配、模型路由与 fallback 链。当前仍处于契约定义阶段，不应写成已完成实现。
- `Tride`：PC 端软件中的开发工具与集成层，不再作为切换后的正式宿主。
- `TriSkill`：未来统一 skill 提供模块。当前仅为占位模块，不应写成现役能力。
- `TriMetaverse V1 正式上线切换阶段`：指从当前 `copilot chat` 试运行，迁移到 TriMetaverse 正式承载赛博公司与自动研发工作流的阶段。首版上线后的平滑过渡期，允许 `copilot chat` 版赛博公司与 `TriMC` 运行面的正式形态并行运行一段时间。

### 1.3 标准文档系统命名

- 项目名称统一写为 `TriMetaverse`；仅在文件名、machine-readable id、slug、CLI-safe key 等必须使用小写无空格标识时，统一写为 `trimetaverse`。
- 禁止继续使用 `tri-metaverse`、`Tri-Metaverse` 等带连字符项目名写法；发现后应按上下文改写为 `TriMetaverse` 或 `trimetaverse`，并同步修正引用链。
- `赛博公司` / `cyber company` 是经营载体的通用概念名；当它落到本项目的具体产品、文件名、schema id、slug、published-copy 路径或其他 machine-readable 标识时，统一写为 `TriCompany` / `tricompany`。
- 因此，正文描述可以继续写“赛博公司”或 `cyber company`，但具体产品名统一写 `TriCompany`，文件名与路径统一写 `tricompany`。

- `模块六层文档协同系统`：指 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/`、`docs/training/` 组成的模块默认文档与执行承载体系。
- 它是 `INTELLIGENCE` 产出并审核通过的每个 PRD 分支的标准落地面，用于承接 `DESIGNING`、`CODING`、`VERIFY-INTEGRATION`、`REDTEAM`、`QA`、`DEPLOYMENT`、`ASSURANCE` 的真源文档、执行证据、状态回写、流程机制与培训导读。
- 它不替代十阶段主线；十阶段定义的是流程状态机和门禁，`模块六层文档协同系统` 定义的是 PRD 分支落地后文档、执行、培训和收口应放在哪里。

### 1.4 文档元信息标准命名

- **`文档元信息`**：默认专指文档在“真源 -> published-copy -> support/live -> archive”链路中的同步与发布层级元信息，不再泛指普通头部说明。
- **`文档同步元信息`**：是 `文档元信息` 的规范写法，字段默认指 `sourceOfTruth`、`publishedFrom`、`syncMode`、`publishTier`、`supportPublishedCopy`、`supportSyncRule`、`lastSyncedAt` 这一组真源 / 发布链字段。
- **`文档头信息`**：用于指 `版本`、`日期`、`状态`、适用范围、适用边界等普通文档头部说明；默认不与 `文档元信息` 混用。
- 若需求只涉及更新时间、状态、适用边界、owner 提示，不应表述为“补文档元信息”，应明确写为“补文档头信息”或“补状态说明”。
- 若需求写“补文档元信息”且未额外限定，默认执行为补齐或核对 `文档同步元信息`，而不是普通头部说明。
- 在审稿、会议收口、Registry 回填、总助 / CPO / CTO 评审与 published-copy 对账中，均沿用上述默认解释，不再重复临时约定。

---

## 2. 主因果链标准产物名

标准链：

白皮书（项目级） -> PRD（产品级） -> 设计规格（Spec，设计级） -> 产品实施总结（实施级） -> 单元测试报告（单元测试级） -> 集成测试报告（测试级） -> 红队扫描报告（安全测试级） -> QA报告（质量评估级） -> 部署手册（发布级） -> Assurance报告（保障级） -> 交付验收报告（交付级）

---

## 3. 阶段产物标准映射（瀑布对齐版）

- DESIGNING：系统架构设计文档、技术方案选型报告、详细设计文档（Spec）
- CODING：产品实施总结（并包含单元测试代码与结果）
- VERIFY-INTEGRATION：集成测试报告
- REDTEAM：红队扫描报告
- QA：QA报告
- DEPLOYMENT：部署手册
- ASSURANCE：Assurance报告
- DELIVERY：交付验收报告

---

## 4. 非标准别名与历史阶段名（禁止在正式产物中继续使用）

以下词汇视为历史别名或非标准称呼：

- 产品实施文档
- 实施产物
- 产品实现文档
- Workflow Main Controller
- Development Main Controller
- Main Controller（当其指向服务域任务主控时）
- Task Main Controller
- TaskController
- Autonomy Main Controller
- orchestrator（当其指向赛博公司自治主控时）
- 红队报告（当其用于主链标准名时）
- IMPLEMENT（历史阶段名）
- VERIFY-UNIT（历史阶段名）

说明：允许在解释性文本中出现“红队报告（攻击面/滥用路径/对抗分析）”作为内容说明，但主产物名必须使用“红队扫描报告”。

---

## 5. 变更记录（changelog）

- 2026-06-06：冻结“文档元信息”默认含义为真源 / published-copy / support/live / archive 链路元信息，并将 `版本 / 日期 / 状态` 等普通顶部说明拆分命名为“文档头信息”。
- 2026-05-28：经营载体中文标准名统一为 赛博公司，并从当前活跃文档中清退旧中文称呼。
- 2026-05-28：模块文档基线从“模块五层文档协同系统”升级为“模块六层文档协同系统”，补入 `docs/training/` 作为正式同级子域。
- 2026-04-26：将 `docs/product/`、`docs/engineering/`、`docs/execution/`、`docs/registry/`、`docs/workflow/` 的默认结构正式命名为“模块五层文档协同系统”，并明确其为 `INTELLIGENCE` 后 PRD 分支的标准落地面。
- 2026-03-04：CODING 阶段主产物标准名统一为“产品实施总结”（兼容历史阶段名 IMPLEMENT）。
- 2026-03-04：主链产物命名在 `project.md`、`tmv-whitepaper.md`、`phase-io-matrix.md`、`review-release-chain.md`、`workflow-engine-spec.md`、`workflow-runbook.md` 完成对齐。
- 2026-04-09：研发主流程主控标准名统一为 `Development Main Controller`，替代 `Workflow Main Controller`。
- 2026-04-09：服务域任务主控标准名统一为 `Task Main Controller`，替代在该语境下的 `Main Controller` / `TaskController`。
- 2026-04-09：赛博公司自治主控标准名统一为 `Autonomy Main Controller`，替代该语境下的 `orchestrator`。
- 2026-04-09：宿主演进时间点统一改写为 `TriMetaverse V1 正式上线切换阶段`。
- 2026-04-22：当前标准词汇改为 `TriMC` 统一运行面、`TriModel` 宿主适配层、赛博公司与研发工作流切片；`Development Main Controller`、`Task Main Controller`、`Autonomy Main Controller` 降级为历史术语。
