# 全公司文档版本号治理规则（草案）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/doc-versioning-governance-rules-draft.md
- syncMode: source-only
- lastSyncedAt: 2026-08-25

> 文档头信息
> - 文档版本: v0.1-draft
> - 状态: draft（待 CEO 批；批准后本文自身按 §3.3 签发制转 v1.0）
> - Owner: CAO（首席行政官，行政治理收口）
> - 制定依据: CEO 2026-08-24 指令——「1.1.0 改一点就 1.2.0 这个机制明显不合理」；W35 平面在册规则制定项（编排层挂账）
> - 调研样本: OP-202608-W35-001.json（metadata.version 1.5.0 bump 史）/ 2026-08-24-week-plan.md §六 / quad-migration-spec.md v0.1→v1.0 签发实践 / TriCompany/docs/registry/company-governance-state.md

## 一、问题定性与核心原则

### 1.1 病灶实证（2026-08-24 调研）

| 样本 | 现状 | 定性 |
| --- | --- | --- |
| OP-202608-W35-001.json | metadata.version 当日 1.1.0→1.2.0→1.4.0→1.5.0，每次登记事件 bump 第二位，第三位恒为 0 | 三段式名不副实：实际是「登记批次计数器」而非语义版本；CEO 所指粒度失真即此 |
| 2026-08-24-week-plan.md §六 | 已自发形成过渡约定：草稿 v0.x-draft、签发 v1.0、批准增量才 bump | 方向正确但属临时口径，未成文、未覆盖全文档类型 |
| quad-migration-spec.md | v0.1 草案→v0.2 三审吸收→v0.3 追加条款→v1.0 CEO 终批签发，修订走新版本+留痕 | 签发制健康样本，本规则将其成文为规格类标准 |
| TriCompany company-governance-state.md | 整册无版本号，条目自带生效日期与批准来源 | 实践正确：append-only 登记册不需要整册 semver，本规则追认并推广 |

### 1.2 病根一句话

版本号被当成「变更计数器」在用。正确的分工是：

- **变了什么** —— git commit 管；
- **何时变的、谁改的** —— updatedAt / lastSyncedAt + updatedBy 管；
- **处于哪个被批准的治理形态** —— 版本号管，且只管这一件事。

凡是不表达「批准形态跃迁」的 bump 都是噪音，一律取消。

### 1.3 核心原则（三条）

- P1 版本号是治理状态机，不是流水号：只有获得相应批准的形态跃迁才允许推动版本号。
- P2 判定顺序固定：先问「本次改动是否需要任何人批准」——不需要则不动版本；需要且不推翻既有批准形态 → MINOR；推翻既有批准形态或首次签发 → MAJOR。
- P3 溯源强制：任何一次 bump 必须能在变更记录表或 git commit 中指出批准依据（OP 条目 / 会议纪要 / 书面指令）；指不出 = 违规 bump，按第八节处置。

## 二、版本语义分层

格式统一 `vX.Y.Z`（草稿期加 `-draft` 后缀）：

| 位 | 名称 | 语义 | 典型触发 |
| --- | --- | --- | --- |
| X | MAJOR | 签发门或推倒性重构：从无批准态进入批准态，或既有批准形态被整体替换 | v0.x→v1.0 首次签发；v1.x→v2.0 目标重写 |
| Y | MINOR | 经批准的内容增量：不推翻既有形态，但改变义务、范围、判据或承诺 | 新增条款、任务增删、验收口径变化 |
| Z | PATCH | 勘误位：笔误、格式排版、失效引用修正、纯注释澄清，不改变义务/范围/判据 | 错别字、链接修复、表格排版 |
| — | 不动版本 | 登记性追加与日志面回填：写入本身即合法事件或状态回填，不含新的裁量 | 台账登记、收口状态回填、checklist 勾选 |

判定口诀：**要批准才动号；批准大小定位数；纯登记不动号。**

## 三、文档分类适用细则

### 3.1 经营台账类（audit-record）

适用：`docs/workflow/operating-records/**`（OP-*.json、unresolved-items.md、tree-op.json）、会议纪要归档件、其他运行事实登记面。

1. **取消逐条 bump。** 台账每次写入本身即经营事件，版本号不再随之递增；审计线 = `metadata.updatedAt` + `metadata.updatedBy` + git commit。
2. metadata.version 重定义为**平面结构版本**，仅两种合法变动：
   - 基线 `1.0.0`：每周新生成的 OP JSON 由生成方盖章 1.0.0；
   - MAJOR：周平面 schema 结构变更（顶层字段族增删、objectType 语义变更），须 CAO+CTO 双确认后 bump，并在 operating-records README 登记结构变更条目。
3. **引用口径切换**：跨文档引用台账状态，禁用「OP 1.5.0 式」版本引用，改用「周 + 日期 + 主题」（例：W35 平面 08-24 裁决登记）；存量文本中的旧式引用按历史冻结口径不改写。
4. Markdown 台账（unresolved-items.md 等）无版本号字段，遵从同一「不动版本」纪律。
5. 台账勘误：正文直接修正 + 原地括注留痕（修正日期 + 修正者），不动任何版本字段。

### 3.2 计划类

适用：`docs/execution/**` 下 week-plan、campaign-plan 等执行主计划。

1. 草稿期：`v0.1-draft` 起；仅在**里程碑自检点**递进草稿号（主体章节齐 → v0.2-draft，评审吸收 → v0.3-draft）；普通润色与小编辑不动号，禁止碎步递进。
2. 发布门：owner 判定内容完整、关键输入均有批准依据 → 升 `v1.0`；若计划含需 CEO 确认的裁量项（拆树方案、排期承诺），v1.0 须 CEO 明示确认后才算 confirmed 态。
3. 执行期修订分两面：
   - **承诺面**（任务清单、验收口径、trees 结构、交付范围）变更 → MINOR，提案 owner + 原批准层级确认，变更记录表加行；
   - **日志面**（执行与收口记录状态回填、checklist 勾选、关联真源链接维护）→ 不动版本。
4. 变更记录表为计划类标配（week-plan §六 即此实践），只记 MAJOR / MINOR 两级。

### 3.3 设计与规格类（签发制）

适用：`*-spec.md`、`*-design.md`、公司制度文本（workflow 治理规则、本规则）、对外白皮书。

1. 草稿评审制：v0.1-draft 起，每吸收一轮实质评审递进一档（v0.2、v0.3……）；草稿号对应「评审轮次」，不对应「编辑次数」。
2. **v1.0 = CEO 终批签发**，文档头标注签发时间与批准记录；签发后修订走新版本 + 留痕。
3. 签发后：
   - MINOR：经批准的内容增量（新增条款、判据变化、范围扩张），批准链 = 提案 owner + CEO 或 CEO 明示授权的裁决链（技术条款可 CTO、产品条款可 CPO、行政条款可 CAO）；变更记录表加行。
   - PATCH：文档 owner 自行处置，commit message 以 `patch:` 前缀注明理由，不强制变更记录行。
   - MAJOR：推倒性结构重构或目标替换 → 下一 MAJOR（v2.0），本质为新说明书，重新走签发门。
4. 制度文本类的 MINOR 批准可在行政域内授权 CAO；MAJOR（制度签发与废立）必须 CEO。

### 3.4 registry 登记册（无版本号）

适用：各仓 `docs/registry/**`（company-governance-state.md、product-state.md、code-state.md、business-state.md）及同类 append-only 事实登记册。

1. **不设文档级版本号。** 登记册的价值在条目事实与生效时间；整册 semver 无治理含义且必然高频空转。
2. 条目自带治理戳：**生效日期 + 批准来源**（指令编号 / 裁决条目 / 会议纪要 ref）。
3. 被外部以 as-of 方式引用的条目（如权威 alias 表），维护条目级 as-of 日期；引用方一律写「as-of YYYY-MM-DD」，不写整册版本。
4. 变更纪律沿用既有归属规则：先改源册、再同步摘要侧；每次实质更新同轮刷新 lastSyncedAt。
5. 存量若有以版本号引用 registry 的旧文本，引用有效性保留；新文本一律 as-of 日期。

### 3.5 默认类

无法归入上述四类的文档，默认按简化签发制：草稿期 v0.x-draft，稳定后 owner 定 v1.0，其后按 MINOR/PATCH 分层；归类争议由 CAO 在秘书处路由中裁定。

## 四、bump 权限矩阵

| 版本动作 | 提案权 | 批准权 | 留痕要求 |
| --- | --- | --- | --- |
| MAJOR（签发/重构） | 文档 owner | CEO（规格/计划/制度）；CAO+CTO 双确认（台账结构变更） | 变更记录表 + 批准记录（指令/纪要 ref） |
| MINOR（批准增量） | 文档 owner | 原 v1.0 批准层级；行政域细则内可授权 CAO | 变更记录表 |
| PATCH（勘误） | 文档 owner | 文档 owner 自行 | commit message `patch:` 标注 |
| 不动版本（登记/回填） | 按各台账归属的登记权岗位 | 无需额外批准（登记本身即事件） | updatedAt + updatedBy + git commit |

通用约束：

- 版本号永远由文档 owner 落盘，他人不得代 bump；
- 批准依据必须可溯源（P3），代理签署无效；
- 同一轮提交里，版本 bump、变更记录行（如适用）、lastSyncedAt 刷新三者必须同批落盘。

## 五、存量文档迁移方案

原则：**不追溯改写历史 + 存量活文档一次性追认基线**（与 quad-migration-spec §三.4 三层换轨节奏的历史冻结口径一致）。

1. 历史档案零动作：已完成周 OP JSON、已归档文档、历史版本数字全部保留原样，作为历史事实，不批量清洗。
2. 存量活文档一次性追认（规则生效后一周内，各 owner 执行，CAO 核验）：

| 存量文档 | 追认动作 |
| --- | --- |
| W35 OP-202608-W35-001.json | metadata.version 维持 1.5.0 冻结不递增，updatedBy 加注「版本语义切换基线（本规则 §3.1）」 |
| 2026-08-24-week-plan.md | 现 v1.0-draft 依 §六 过渡约定追认为本规则下 v1.0（内容源自已批 spec v1.0，变更记录已在案），无需重批 |
| quad-migration-spec.md v1.0 | 已符合签发制口径，零动作 |
| 各 registry 登记册 | 本就无版本号，零动作；延续条目生效日期习惯 |

3. 工具消费面前置盘点（硬门槛）：落地前由 CTO 侧盘点 weekly_plane 生成/迁移链（TriCompany runtime）是否读取或校验 metadata.version；有消费 → 改动走研发环单票（参照 D-ESC-1 流程）；无消费 → 仅改新生成周 OP 的初值盖章为 1.0.0。**盘点结论出来前，W36 生成侧不强行切 1.0.0。**
4. 引用切换：规则生效后新产出的文本，引用台账一律「周 + 日期 + 主题」；存量引用不清洗。

## 六、与既有机制的衔接

1. **元信息三分法不变**：sourceOfTruth / syncMode / lastSyncedAt 是文档在真源链路中的同步身份（见 `docs/文档治理与真源文件系统.md` §3.4），版本号属文档头信息；两者永不合并。版本 bump 与 lastSyncedAt 刷新同轮提交。
2. **签发指纹规则对齐**：operating-records README 的 issuanceVersion + sha256 侧车机制不变；签发候选（submitted）内容再变 → issuanceVersion bump + 指纹重生成（原文既有）；已签发对象后续修订按本规则 MINOR/PATCH 执行。
3. **publishMeta 指纹封印关系**（CEO 2026-08-24 裁决，OP W35 登记）：publishMeta 管多宿主渲染产物完整性（发现手改），本规则管源侧治理文档版本语义；两套并行互不替代，宿主渲染产物 frontmatter 不因本规则新增版本字段。
4. **代码与产品版本不在本规则范围**：package.json、构建 v* tag、MSI calver（v0.4.x-rN 形态）归工程发布惯例，owner CTO。

## 七、判例表（直接照判执行）

| # | 场景 | 分类判定 | 版本动作 |
| --- | --- | --- | --- |
| 1 | OP JSON 登记一条 CEO 裁决 | 台账日常登记 | 不动版本；updatedAt + updatedBy + commit |
| 2 | OP JSON 顶层字段族重构 | 台账结构变更 | MAJOR，CAO+CTO 双确认 |
| 3 | unresolved-items 追加一条 carry | 台账登记 | 不动版本 |
| 4 | week-plan 回填某 tree 收口状态 | 日志面回填 | 不动版本 |
| 5 | week-plan 新增任务 T7 | 承诺面变更 | MINOR + 变更记录行 |
| 6 | spec 修错别字 / 失效链接 | PATCH | bump 第三位，commit 标注 |
| 7 | spec 增加新 Phase 条款 | MINOR | 批准后 bump + 变更记录行 |
| 8 | spec 目标推翻重写 | MAJOR | v2.0，重新签发 |
| 9 | 草稿 spec 第三轮评审吸收 | 草稿递进 | v0.3-draft |
| 10 | 草稿 spec 当日两次措辞微调 | 小编辑 | 不动号 |
| 11 | registry 追加一条治理规则 | 条目登记 | 无版本概念；生效日期 + 批准来源 |
| 12 | 引用 alias 表 | 外部引用 | 标「as-of YYYY-MM-DD」 |

## 八、生效、抽查与违规处置

1. 生效路径：CEO 批准本草案 → 本文按 §3.3 转 v1.0 签发 → 第五节追认动作启动。
2. 合规抽查：生效后两周内 CAO 在秘书处例会做首次抽查；此后按月度例会节奏抽检新 bump。
3. 违规处置：指不出批准依据的 bump（违 P3）由 CAO 记台账一条；连续两周 ≥3 次 → 升级 CEOChiefOfStaff 催办面（与命名混淆台账 C3 开关同型）。

## 九、待确认项

1. metadata.version 的机器消费方清单（迁移脚本 / 健康检查 / 同步链是否读取该字段）——挂第五.3 硬前置，CTO 侧盘点，结论回填本节。
2. 新周 OP JSON 初值 1.0.0 盖章的实现位置（生成模板改造）——归 TriCompany runtime 研发环，CTO owner。
3. 白皮书（tmv-whitepaper.md）当前实践已符合 §3.3 签发制；若未来出现非签发制的白皮书变更诉求，升级 CEO 裁定是否单列叙事类。
