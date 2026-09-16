# B4 扫尾批4 · CFO source-agents 五席联审 · CAO 席意见

- **席位**：CAO（ChiefAdministrativeOfficer，小行）
- **date 现查**：2026-09-16T14:26:29Z（人读轨 2026-09-16 22:26:29 +08；本任务开工首动作现查，读数原样粘贴）
- **M4 零改动声明**：本席本次为审读位（审零改动），未对靶标 9 件做任何写入或修改；本席全部落盘仅本意见件一处。
- **独立性声明**：本席未读其他四席任何意见稿，席间零交换；对照基准仅 CAO 本席同构源件、在册真源文档与本席批1/2/3 已表态内容；盘面实勘仅 ls/find/grep 只读验证。
- **依据链**：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律（分歧挂起候裁清单化／保留权候 CEO／冻结件豁免标注）· D-13 通信名址规程 · D-04 报时纪律 · 跨批基线（次批③窗／E2 命名追平候 CEO／悬空落点标注案／paths 批量候裁群——同族沿判向不重复展开）
- **批号**：B4-sweep-b4
- **靶标**：`/srv/fleet/TriCompany/source-agents/chief-financial-officer/` 全 9 件（521 行）

## 表态总览

| # | 文件 | 级别 | 意见摘要 |
|---|------|------|----------|
| 1 | agent-body.agent.md | 建议 | token 阈值「在案」无锚；职责第 4 条禁止项混入并与护栏同文重复；缺默认输出结构节 |
| 2 | agent-frontmatter.agent.md | PASS | 无意见（description 投影一致） |
| 3 | chief-financial-officer.agent.md | 建议 | 冻结锚缺失（沿判向）；含编辑残渣随锚注记 |
| 4 | chief-financial-officer.contract.yaml | 挂起 | display_name 待命名（候裁群 A）；paths 缺 session_body（候裁群 B 第 4 例） |
| 5 | colleagues.agent.md | 建议 | 名址四格式混用（含「小成」裸别名无正名） |
| 6 | memory.agent.md | 建议 | budget-records 落点悬空未标「待初始化」（实勘发现）；落点重复+孤行沿判 |
| 7 | session-body.agent.md | 建议 | 生效状态条款缺失（沿判向）；含候裁群 A 随动项 |
| 8 | social.agent.md | 挂起 | 「小财」命名记载与 soul 待命名互斥（候裁群 A） |
| 9 | soul.agent.md | 挂起 | 「名字：待命名」与 social 命名记载互斥（候裁群 A 主锚） |

分布：PASS 1 · 建议 5 · 挂起 3（共 9 件；挂起归并 2 个候裁群，见文末清单）。

## 逐件意见

### 1. agent-body.agent.md — 建议

- **意见①**：第 11 行「（累计 >2 亿 / 单次 >1 亿 升级 CEO 的阈值机制在案）」——「在案」无锚。session-body BUDGET_CHECK 件族节载有的是偏差 %/USD 分级阈值，未覆盖本 token 消耗阈值，两处阈值族不同源未互链。修改建议：补锚（台账/正身文件引用）或在 session-body BUDGET_CHECK 节并载 token 阈值条款。验收锚=「在案」可溯源到具体正身。
- **意见②（沿 COO 判向）**：核心职责第 4 条为禁止项（「不编造收入、毛利……」）且与行为护栏第 1 条逐字同文重复——职责/护栏混排+同文双写。修改建议：职责列表保留正向职责，禁止项归护栏（contract responsibilities 第 4 条同款一并处理）。验收锚=职责列表无禁止项、护栏无逐字重复条。
- **意见③（沿 COO 判向）**：缺「## 默认输出结构」节（contract.io_contract.outputs 三类输出无人读版）。修改建议：补节（预算护栏/收入模型审查/财务风险预警）或出示豁免依据。验收锚=含输出结构节或豁免依据在册。
- **同构核对通过项**：回答前必须核查+固定前置核查（compass 简化）双节家族形态 ✓；归属路由阀门含治理制度域（比 COO 款多 CGR 一域，与路由面一致）✓。

### 2. agent-frontmatter.agent.md — PASS

无意见。name/description/user-invocable 齐备；description 与发布面适用场景文案逐字一致（description 投影制核对通过）。

### 3. chief-financial-officer.agent.md — 建议

- **意见①（沿判向）**：退役头注缺冻结时点锚。验收锚=头注含可核查时点/commit 锚。
- **意见②（随锚注记，COO 同款残渣）**：第 15-16 行重复条目（第 16 行「你是公司级"预算护栏……"」与第 11 行重复，弯/直引号变体）；第 107-110 行「## 角色气质」节头后连续多空行（markdownlint MD012 类）。随冻结锚批注清理，不单独动件。

### 4. chief-financial-officer.contract.yaml — 挂起

- **挂起①（候裁群 A 随动面）**：`display_name: 待命名`——与 social「工作名：小财（CEO 正式命名，2026-08-01）」互斥，详见候裁群 A。
- **挂起②（候裁群 B，批1 共识第 4 例）**：`paths` 六件缺 `session_body` 登记。候裁=CHO 门核对 D1b manifest：补登记或出示独立登记证据；CPO/COO/COS/CFO 四席同款，建议批量裁决。验收锚=paths 与 manifest 登记面一致。
- **建议（沿判向一揽子）**：`runtime_baseline` 旧三字段未换代（CAO 2026-09-14 五字段口径）；`instructions` 用 `>` folded 块；responsibilities 第 4 条禁止项混入。随 B3/B4 换代窗一揽子核对，验收锚=与 CAO contract 逐字段同构。tools 节无 runtime_equivalent 旧字段（同 COO，干净）✓。

### 5. colleagues.agent.md — 建议

- **意见（沿判向加重一档）**：名址四格式混用——「小贾（ceo-chief-of-staff）」（agent-id 括号）、「COO 小营」（正名+别名）、「小成」（**裸别名，无正名无 id**，CSO 席）、CPO/CTO/CHO/CMO 各式不一。修改建议：统一「正名（别名）」格式并与 D-13 全表逐一对表，「小成」补 CSO 正名。验收锚=D-13 名址全表核对通过。
- **同构核对通过项**：协作边界清晰（预算签批链/成本越界裁决链 COS→BOD 与 agent-body 当前原则同源）；无 COO 批2 式监督关系矛盾（contract `supervises: []` 本件无对应监督记载）。

### 6. memory.agent.md — 建议

- **意见①（悬空落点标注案应用·实勘发现）**：第 19 行「预算记录：`TriCompany/docs/execution/budget-records/`」经本席 ls 实勘**目录不存在**，且未标「（待初始化）」——而第 18 行 finance-state.md 同为不存在、已标「待初始化」。同节两落点标注口径不一，未标者构成悬空落点。修改建议：budget-records 行补「（待初始化）」。验收锚=不存在落点均带待初始化标注。
- **意见②（沿判向）**：落点节 TRICOMPANY_COGNITION_HOME 重复 2 处（第 20/22 行）+第 21 行孤行空行。合并为 1 条、删孤行。验收锚=落点节各条目唯一。
- **实勘通过项**：`finance-state.md`（待初始化）标注与实盘一致 ✓；`chief-financial-officer-role.md`（agent-body 落点）实盘存在 ✓。

### 7. session-body.agent.md — 建议

- **意见①（沿判向，批2/3 同款）**：头注仅载「LG-024 批 1 前置件（COS 施工单 2026-09-04 排程）」，无生效/签收/正身转换条款，现状态不可辨。修改建议：补状态标记。验收锚=头注含状态可辨标记。
- **随动注记**：第 7 行「别名空缺候补」为候裁群 A 随动面——若「小财」坐实应同步补别名。
- **实勘通过项（本批亮点）**：BUDGET_CHECK 门禁件族节两处引用经本席 find 实勘**全部有效**——`budget-check.schema.json` 实盘在 TriMetaverse 仓 `docs/workflow/` 下（相对路径引用符合 LG-023 跨仓路径纪律：TM 仓文件写相对路径），授权矩阵与纪律册均正确使用 `../TriCompany/` 前缀；跨域纪律指针（D-04/D-16/D-17）两要素齐备。指针纪律执行为四批最规范。
- **附记（不单列）**：「UTC Z 后缀 +8」表述沿批1/2/3 判向，后续修订对齐 D-04 双轨口径。

### 8. social.agent.md — 挂起

- **挂起①（候裁群 A 事实侧）**：「工作名：小财（CEO 正式命名，2026-08-01）」与 soul「名字：待命名」直接互斥——批2 COO 命名分裂同构第 2 例。侧证：COS colleagues 及 COO colleagues 均有「CFO 小财」记载。审读位不代裁，详见候裁群 A。
- 其余内容（对外报价口径规则/层契约）同构合规，若命名坐实本件为正确侧。

### 9. soul.agent.md — 挂起

- **挂起①（候裁群 A 身份侧主锚）**：「名字：待命名」与 social 命名记载互斥；CAO 同批命名先例（CAO soul 已载「小行」，E1 四追平）与 COS 先例（soul 已载「小贾」）均落名，CFO soul 未落。详见候裁群 A。
- 其余四节家族模式同构 ✓；与 agent-body 同文节（当前原则/运行资产落点/层契约/认知分层约束）逐字比对一致，无漂移。

## 观察注记（不计意见，不要求本批处理）

- **E2 命名追平群第 2 例**：CFO 与 COO 命名分裂完全同构（social 载 2026-08-01 正式命名 vs soul/contract/session-body 待命名/空缺）——两案可合并一次 CEO 命名台账核对批量追平（同 CAO E1 款），候裁 owner 与路径见批2/批4 清单。
- **气质双写家族观察**：同前三批，soul 与 agent-body 气质双写（CFO 版：soul「财务控制感强」3 条 vs agent-body「审慎/透明/长期视角/禁止财务工程」4 条不同文），soul 层契约可消解，留观。
- **「回答前必须核查」双节内容重叠**：同 COO 家族观察，留观。

## 挂起候裁清单（汇总）

| 群 | 挂起项 | 涉及件 | 候裁 owner | 裁决路径 |
|----|--------|--------|-----------|----------|
| A | CFO 工作名：social「小财（CEO 正式命名 2026-08-01）」vs soul/contract「待命名」、session-body「别名空缺候补」——批2 COO 同构第 2 例 | soul / social / contract / session-body | CEO 命名台账核对，CHO 承办档案修正；建议与 COO 案合并批量追平 | 坐实则 soul/contract/session-body 补「小财」（同 CAO E1 款）；未命名则 social 回改 |
| B | contract paths 缺 session_body 登记（批1 共识第 4 例，CPO/COO/COS/CFO 四席同款） | contract | CHO 门 + 宿主发布流程核对 | 补登记或出示 manifest 独立登记证据；四席一并批量裁决 |

本席保留权：以上全部意见保留权候 CEO；审读位不代裁、不改件。
