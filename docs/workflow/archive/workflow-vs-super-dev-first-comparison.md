# TriMetaverse Workflow 与 super-dev 首轮对比

## 0. 历史术语对齐说明（2026-04-09）

- 本文属于 archive 对比稿，最初写作时仍使用 `Workflow Main Controller` 等旧称。
- 在当前命名体系下，研发 10 阶段主流程主控统一命名为 `Development Main Controller`。
- 文中若提到服务域主控，应以 `Task Main Controller` 为准；若提到虚拟公司自治主控，应以 `Autonomy Main Controller` 为准。
- 文中涉及研发宿主迁移时，统一应理解为到 `TriMetaverse V1 正式上线切换阶段` 迁入 `Tride`。
- 若本文与现行真源冲突，以 `project.md`、`cyber-company.md`、`docs/workflow/terminology.md` 与 `docs/workflow/workflow-host-integration.md` 为准。

## 1. 范围

本文件是第一轮对比，不是最终改造方案。

目标只有三个：

1. 识别当前 TriMetaverse workflow 与 `super-dev` 的核心差异
2. 判断哪些机制值得吸收
3. 判断哪些机制不应直接照搬

对比基线：

- TriMetaverse 当前 workflow 契约
- `reference/super-dev/` 当前源码快照 `332dc84e723bbcc4ae7841f3ef90c0d2efe2e369`

## 2. 结论先行

当前判断：

- TriMetaverse 更强在“阶段契约、结构化审计、分支执行、稳定产物引用”。
- `super-dev` 更强在“宿主继续执行、知识预注入、确认门、命令化恢复与治理入口”。
- 如果直接用 `super-dev` 替换当前 workflow，会丢失 TriMetaverse 已经建立好的 `PhaseResult`、`runId`、`branchId`、`phaseResultRef` 和 `docs/runs/` 稳定引用能力。
- 更合理的方向不是替换，而是把 `super-dev` 中更强的宿主交互与恢复机制吸收进当前 `Development Main Controller` 宿主契约，并在 `TriMetaverse V1 正式上线切换阶段` 下沉到 `Tride`。

一句话判断：

当前更像是“用 `super-dev` 补 TriMetaverse 的宿主运行层”，而不是“让 `super-dev` 接管 TriMetaverse 的主流程语义层”。

## 3. 核心对比表

| 维度 | TriMetaverse 当前 workflow | `super-dev` | 首轮判断 |
| --- | --- | --- | --- |
| 主控定位 | 有明确的 `Development Main Controller` 概念，负责 10 阶段主流程与分支聚合 | 更像宿主侧 workflow governor，强调“宿主继续跑流程” | 两者不冲突，但层级不同；TriMetaverse 是流程主控语义，`super-dev` 更像宿主执行框架 |
| 阶段模型 | `DISCOVERY -> INTELLIGENCE -> DESIGNING -> CODING -> VERIFY-INTEGRATION -> REDTEAM -> QA -> DEPLOYMENT -> ASSURANCE -> DELIVERY`，且支持 PRD 分支并行 | 存在多套口径：README 命令流、`pipeline-workflow.md` 的 8 阶段、`.clinerules` 的 `research>docs>docs_confirm>spec>frontend>preview_confirm>backend>quality>delivery` | TriMetaverse 的阶段模型更稳定；`super-dev` 在“宿主可执行顺序”上更强，但流程口径尚不完全收敛 |
| 人工审核与门禁 | 人工审核、版本签发、顺序发布链是硬门禁；首次必须有版本号，非首次必须版本变更 | 有 `docs_confirm`、`preview_confirm`、quality threshold 等确认门，但更偏宿主会话治理 | TriMetaverse 治理更严格；`super-dev` 的确认门适合补强当前宿主交互 |
| 分支能力 | `INTELLIGENCE` 产出 PRD 后创建 `branchId`，分支内部串行、分支间并行 | 主要按单项目线性推进，未看到与 `branchId` 对应的稳定多 PRD 分叉主控 | TriMetaverse 显著更强，当前不应退回单线性流水线 |
| 产物结构化程度 | 强调 `PhaseResult`、`run-metadata.json`、`delivery-manifest.json`、`delivery-report.md`、`phaseResultRef` | 强调生成文档、Spec、quality gate、code review、AI prompt、CI/CD 文件，但未看到与 `docs/runs/` 等价的结构化 run ledger | TriMetaverse 更适合审计和后续跨对象引用 |
| 宿主恢复能力 | 已定义宿主落盘契约，但还未在真实宿主中落地 | `start`、`resume`、`continue`、`next` 等命令和“默认继续当前流程”的宿主规则比较成熟 | `super-dev` 更强，值得重点吸收 |
| 本地知识注入 | 当前有 Registry / 文档真源 / 经营对象桥接，但缺“每轮开工前自动读取知识命中包”的硬约束 | 明确要求先读 `knowledge/` 与 `output/knowledge-cache/*-knowledge-bundle.json`，并作为硬约束注入文档、Spec 与实现 | `super-dev` 更强，值得吸收为宿主 bootstrap 契约 |
| UI/前端先行 | 当前 workflow 强调设计后编码，但没有把“前端先跑、预览确认后再继续”写成宿主侧强约束 | 明确 `frontend -> preview_confirm -> backend`，并要求 UI 不得落入低质量 AI 风格 | `super-dev` 更适合补强当前前端/预览确认门 |
| 规范驱动开发 | 已有 PRD、Spec、实施、测试、部署、Assurance 的因果链，但更偏全流程主控规范 | `spec-driven-development` 对单变更 delta、`SHALL/MUST/SHOULD/MAY`、archive 流程更直接可执行 | `super-dev` 的 spec 变更流适合作为局部能力引入 |
| 交付证据 | 交付强调稳定路径、结构化 PhaseResult 和 delivery 汇总 | 交付更偏 proof-pack、quality gate、review 输出、CI/CD 生成 | 两者可互补，TriMetaverse 保留 ledger，吸收 `proof-pack` 风格证据打包 |

## 4. TriMetaverse 当前更强的地方

### 4.1 结构化 run 审计链更完整

TriMetaverse 不是只要求“有文档”，而是要求：

- `runId` 稳定
- `branchId` 稳定
- `PhaseResult` 机器可读
- `phaseResultRef` 可被经营对象引用
- `docs/runs/` 形成长期可审计目录

这点是 `super-dev` 当前明显不具备的强项。

如果直接迁到 `super-dev` 的输出形态，会把当前已经建立好的“结构化执行产物层”退回到更偏文档驱动、宿主驱动的状态。

### 4.2 多 PRD 分支主控能力更成熟

TriMetaverse 的主流程已经把 `INTELLIGENCE` 到 PRD 分支创建、并行执行、分支聚合和统一 `DELIVERY` 连接起来。

`super-dev` 更适合单项目或单需求流水线，对“一个 run 内同时管理多个 PRD 分支”的支持没有在当前资料里形成同等清晰的主控契约。

### 4.3 人工审核发布链更硬

TriMetaverse 把“人工审核 + 版本签发 + 版本变更”写成了流程硬门禁。

`super-dev` 有确认门，但更偏宿主交互阶段的“继续 / 确认 / 审查”，不等同于当前这套版本治理链。

## 5. `super-dev` 当前更强的地方

### 5.1 宿主会话继续能力明显更强

`super-dev` 的 `start`、`resume`、`continue`、`next` 说明它把“第二天回来怎么接着做”作为一等问题处理，而不是只假设 workflow 在单轮上下文里连续完成。

这正好对应当前 TriMetaverse 的缺口：

- 我们已经定义了 run 输出契约
- 但还没有把“宿主怎么恢复到正确阶段”写成强执行体验

### 5.2 本地知识命中契约更硬

`super-dev` 明确规定：

- 先读 `knowledge/`
- 再读 `output/knowledge-cache/*-knowledge-bundle.json`
- 命中的知识作为文档、Spec、实现的硬约束

这比当前 TriMetaverse “文档真源 + Registry 查询”的方式更接近宿主可执行规则。

### 5.3 双确认门更贴近真实开发节奏

`docs_confirm` 和 `preview_confirm` 解决的是两个现实问题：

1. 三文档未确认前不要提前写代码
2. 前端预览未确认前不要过早沉入后端和交付

TriMetaverse 目前在“审核发布链”上更强，但在“宿主里如何卡住用户确认点”上还不够细。

### 5.4 命令面更适合日常操作

`super-dev` 用命令把治理动作直接暴露出来，例如：

- `resume`
- `next`
- `spec validate`
- `release proof-pack`
- `review preview`
- `review quality`

TriMetaverse 当前已经有契约，但对宿主操作者来说，还缺少这层“低摩擦入口”。

## 6. 不应直接照搬的地方

### 6.1 不应把当前 10 阶段 + 分支模型压扁成单线性宿主流水线

`super-dev` 的流程非常适合单需求连续推进，但如果直接照搬，会削弱：

- `DISCOVERY / INTELLIGENCE` 的项目级上游语义
- PRD 分叉能力
- `ASSURANCE` 独立发布闸门
- `DELIVERY` 统一聚合语义

### 6.2 不应放弃 `docs/runs/` 的结构化产物层

`output/*`、review-state、Spec 目录这些机制很实用，但它们不能替代：

- `run-metadata.json`
- `*.phase-result.json`
- `phaseResultRef`
- `delivery-manifest.json`

TriMetaverse 这层资产要保留，否则经营对象与研发对象之间的桥接会被削弱。

### 6.3 不应把 host rule 当成唯一真源

`super-dev` 的优势之一是 host rules 很强，但当前观察到它的阶段口径分布在 README、workflow 文档、rule 文件和 skill 文件中。

TriMetaverse 不应该把主流程真源拆散到多个宿主规则文件里，而应该继续保持：

- 主流程规范集中在 `docs/workflow/`
- 宿主规则只是执行层投影

## 7. 建议吸收的机制

建议优先吸收 5 项：

1. 宿主恢复入口：为 `Development Main Controller` 宿主补 `resume / continue / next` 等等价操作语义
2. 本地知识 bootstrap：为宿主增加“先读知识命中包”的硬契约
3. 双确认门：补 `docs_confirm` 与 `preview_confirm` 两类宿主确认点
4. 证据打包命令面：引入类似 `proof-pack` 的交付证据打包动作，但输出仍落到 `docs/runs/`
5. review-state / unfinished-run 识别：让宿主在新会话开始时优先判断“继续当前 run”，而不是默认普通聊天

## 8. 建议暂不吸收的机制

建议暂不直接吸收 4 项：

1. 用单一 `output/` 文档体系替换当前 `docs/runs/` 审计体系
2. 用单项目线性阶段替换 `PRDBranch` 并行模型
3. 把阶段真源分散到多个宿主 rule 文件
4. 直接把 `super-dev` 的阶段命名映射成 TriMetaverse 标准阶段名而不做中间层

## 9. 对当前 workflow 的改造建议

如果进入下一轮，我建议改造顺序是：

1. 先在 `workflow-host-integration.md` 上补“宿主恢复协议”和“确认门协议”
2. 再定义一份宿主 run-state / review-state 的 machine-readable schema
3. 再考虑把 `proof-pack`、knowledge bundle、preview confirm 这类能力接进 Tride
4. 最后才讨论是否重构阶段划分

原因很简单：

- 当前 TriMetaverse 缺的是宿主执行层
- 不是主流程语义层

## 10. 当前最终判断

`super-dev` 对当前 TriMetaverse 最有价值的地方，不是它的“完整替代流程”，而是它把“宿主如何继续工作、如何恢复、如何卡确认门、如何把知识前置注入”做成了可执行操作面。

因此，当前建议是：

- 保留 TriMetaverse 的主流程、分支、审计和结构化产物体系
- 借鉴 `super-dev` 的宿主恢复、知识 bootstrap、双确认门和命令化治理入口
- 在 `TriMetaverse V1 正式上线切换阶段` 把这些能力落到 `Tride`，而不是回退到更松散的单宿主文档流水线
