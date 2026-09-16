# B4 扫尾批9 · FSD source-agents 五席联审 · CAO 席意见

- **席位**：CAO（ChiefAdministrativeOfficer，小行）
- **date 现查**：2026-09-16T15:37:07Z（人读轨 2026-09-16 23:37:07 +08；本任务开工首动作现查，读数原样粘贴）
- **M4 零改动声明**：本席本次为审读位（审零改动），未对靶标 9 件做任何写入或修改；本席全部落盘仅本意见件一处。
- **独立性声明**：本席未读其他四席任何意见稿，席间零交换；对照基准仅 CAO 本席同构源件与在册真源文档；压缩二级令已遵（跨批仅族名+一句话，未读先例原文与自家既往稿）；盘面实勘仅 ls/grep 只读验证。
- **依据链**：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律（分歧挂起候裁清单化／保留权候 CEO／冻结件豁免标注）· D-13 通信名址规程（含条 4 勘误实勘）· D-04 报时纪律 · D-24 机位断言纪律 · LG-023 跨仓路径纪律
- **批号**：B4-sweep-b9
- **靶标**：`/srv/fleet/TriCompany/source-agents/full-stack-developer/` 全 9 件（586 行；09 系独立 colleagues+social 全编制）

## 表态总览

| # | 文件 | 级别 | 意见摘要 |
|---|------|------|----------|
| 1 | agent-body.agent.md | 建议 | 「实现决策三分法」节名映射未声明（族沿判·轻） |
| 2 | agent-frontmatter.agent.md | PASS | 无意见（name=FSD 勘误落地 ✓） |
| 3 | full-stack-developer.agent.md | 建议 | 冻结锚缺失（族沿判）；无残渣干净款 |
| 4 | full-stack-developer.contract.yaml | 挂起 | paths 缺 session_body（候裁群 B 第 7 例）；business-strategy-state source 悬空（实勘坐实） |
| 5 | colleagues.agent.md | 建议 | 名址混用：旧 spawn 名与 STE 正名同件并存 |
| 6 | memory.agent.md | 建议 | COGNITION_HOME 重复 2 处（族沿判）；五节完整非薄版 |
| 7 | session-body.agent.md | 建议 | 「正名=FD」未随 D-13 勘误更新（本批最重发现）；命令族无机位标注 |
| 8 | social.agent.md | PASS | 无意见（完整标准款含日期锚） |
| 9 | soul.agent.md | PASS | 无意见（完整标准款、同文节逐字一致） |

分布：PASS 3 · 建议 5 · 挂起 1（共 9 件）。**FSD 命名一致性通过**：「小全」在 agent-body/social/contract/soul 四处一致（含 2026-08-01 日期锚），不在 E2 追平群。

## ⚠️ 勘误注记（本席对批7/批8 意见的自我纠错，优先于该两处原文）

- **勘误对象**：批7（CSO）意见 6①、批8（DE）意见 6① 中「`TriCompany-copilot-host-assets/` 整包不存在→memory 落点悬空」的判断**解析错位**。
- **勘误事实**：本批实勘发现 assets 包存在两个候选位——TriCompany sibling 位（`/srv/fleet/TriCompany-copilot-host-assets/`，缺席）与 **TriMetaverse 仓内位（`/srv/fleet/TriMetaverse/TriCompany-copilot-host-assets/`，在位）**；按 LG-023 纪律，CSO/DE memory 落点的无前缀写法应解析为 TriMetaverse 仓相对路径，该位之下 `knowledge/employees/customer-success-officer/` 与 `deployment-engineer/` **经本席 ls 实盘复核均在位**。
- **修正后结论**：批7/批8 该两条由「落点悬空（实勘坐实）」降级为「路径写法二义（无仓前缀，LG-023 解析存在 sibling 位歧义，审读位即被误导）+与家族 COGNITION_HOME 口径并存未声明优先级」——级别建议不变、方向修正为补仓前缀或改指 cognition 私域；两批挂起清单不受影响（均属建议项）。本席审读误判原因=实勘只验了一个候选位即下「整包不存在」结论，违反自席「任一真源路径失联即门退回报」同类纪律的完整勘验要求，记为审读教训。
- **连锁修正**：批8 观察注记「assets 包悬空族累计第 2 例」废止；execution/ 悬空落点系（5 例）不受影响（那些是 `TriCompany/docs/execution/` 带前缀路径，实勘位唯一）。

## 逐件意见

### 1. agent-body.agent.md — 建议

- **意见（族沿判·轻）**：「## 实现决策三分法」（READY_FOR_REVIEW/NEEDS_CLARIFICATION/BLOCKED）为实现域交付状态机，语义自洽无档位缺位（同 DE 判向质量款）；节名占用家族「决策三分法」名未声明与通用三分法映射。修改建议：节名区分或补映射行。验收锚=节名可区分或映射声明在件。
- **通过项**：核心职责第 8 条 CodeGraph 默认条款与工作区 CLAUDE.md 同源且带三例外 ✓；code-state 落点带职责注记（「由 CTO 维护，你负责提供实现事实」）✓；默认输出结构齐 ✓；frontmatter name=FSD 勘误落地（D-13 条 4 破例款）✓。

### 2. agent-frontmatter.agent.md — PASS

无意见。name=FSD（勘误后正名）／description 与发布面逐字一致／user-invocable 齐备（description 投影制核对通过）。

### 3. full-stack-developer.agent.md — 建议

- **意见（族沿判）**：退役头注缺冻结时点锚。验收锚=头注含可核查时点/commit 锚。
- **通过项**：与 agent-body 逐节同文、无编辑残渣（族内干净款第四席）。

### 4. full-stack-developer.contract.yaml — 挂起

- **挂起①（候裁群 B 第 7 例·族沿判一句话）**：`paths` 六件缺 `session_body` 登记（session-body 源件现役存在）。候裁 owner 与路径同群 B（CHO 门+宿主发布流程，补登记或出示 manifest 证据），七席同款批量裁决。验收锚=paths 与 manifest 登记面一致。
- **建议①（悬空落点标注案·实勘坐实）**：io_contract `business_strategy.source: docs/registry/business-strategy-state.md`——该文件经本席实勘**不存在**（实盘为 `business-state.md`，批7 已勘）。修改建议：source 改实盘名或核对该 registry 现役正名后统一全族。验收锚=source 路径实盘可达。
- **建议②（族沿判换代窗一揽子）**：`runtime_equivalent` 用 `trimc:*` 旧运行时前缀（比 openclaw 款新一级、同属旧名系）；`edit` 对 `docs/registry/` 为 `requires_approval: false` 与家族 registry 谨慎纪律存在张力（开发席高频特化 vs 登记面保护，候换代批裁定）；`runtime_baseline` 旧三字段。验收锚=与 CAO 换代口径同构核对单通过。
- **通过项（本批合同面最佳）**：`role: FSD` 新正名落合同 + `agent_id` 保留旧名＝D-13 条 3④ role-id 分轨的合法形态 ✓；`peers: [STE]` 用正名 ✓；`execute` 命令白名单（npm test/build/lint 等 5 条）为开发席合理特化 ✓；`instructions` 用 `|` literal 块 ✓。

### 5. colleagues.agent.md — 建议

- **意见（名址族）**：同件内正名/旧名混用——第 12 行「小柯（test-engineer）」用退役 spawn 名（D-13 勘误后正名 STE），而同件第 22 行当前原则已用「STE」正名；第 18 行「小吴（rd-trainer）」括号名与 D-13 条 4 映射名 RAndDTrainer 不符。修改建议：全件对表 D-13 统一「STE（别名 小柯）」「RAndDTrainer（别名 小吴）」款。验收锚=D-13 名址全表核对通过。
- **通过项**：结构完整五节 ✓；CTO 架构约束/STE 质量交接边界与 contract 自洽 ✓。

### 6. memory.agent.md — 建议

- **意见（族沿判）**：落点节 TRICOMPANY_COGNITION_HOME 重复 2 处（第 22/24 行）。合并为 1 条。验收锚=落点节各条目唯一。
- **通过项**：五节完整（非薄版，与 CSO/DE 薄版形成编制差——09 系全编制名实相符）✓；「已落地代码=git 提交本身即真源，不回写本件」条款清晰 ✓；无 assets 包/execution 系落点命中 ✓。

### 7. session-body.agent.md — 建议

- **意见①（本批最重发现·实勘坐实）**：第 5 行「通信面正名=**FD**」——D-13 条 4 勘误（2026-09-03，LG-029 锚，CEO 方案 v3）已将 FD 行正名改为 **FSD**（spawn name 随批改破例款），本件为 2026-09-04 后批次仍未同步；同目录 agent-body/frontmatter（name=FSD）与 contract（role: FSD）三件均已落新名，唯 session-body 寻址锚停旧名——正名是寻址锚，FD/FSD 一字之差构成寻址断裂风险。修改建议：正名改「FSD（别名 小全/全栈开发）」。验收锚=与 D-13 全表 FD 行正名一致（本席 grep 实勘：条 4 勘误文句在册）。
- **意见②（D-24 机位断言）**：灌注/发布管线命令族 5 条硬编码 dev 机绝对路径（`D:\Code\ai\TriCompany` 等），无机位适用域标注——sg 机语境（`/srv/fleet/` 同构布局）下不可直执行，违反 D-24 跨机引用先做机位断言。修改建议：命令族节首补机位断言行（「本族=dev 机口径；sg 机按 /srv/fleet/ 同构映射」）或参数化 SOURCE_ROOT/SUPPORT_ROOT。验收锚=机位适用域标注在件。
- **意见③（族沿判·轻）**：头注有 LG-024 前置源件化标注 ✓，无 CHO 签收/正身完成条款；定稿后补状态标记。
- **实勘通过项**：管线三脚本（employee_source_kit/employee_host_publish/source_publish_check）经本席实盘验证**全在位** ✓；support-root 指向 TriMetaverse 仓内 assets 位经本席实勘**在位** ✓；已知坑位三条带实证锚（幽灵目录实证/静默陷阱）且「修候 CTO 域」路由清晰 ✓。

### 8. social.agent.md — PASS

无意见。完整标准款五节齐：「小全（CEO 正式命名，2026-08-01 上岗）」命名锚含日期 ✓、社交定位/当前原则（门禁与提交为锚）/运行资产落点/层契约齐备。

### 9. soul.agent.md — PASS

无意见。完整标准款：「名字：小全」锚行在位、人格设定（气质/对话风格/禁止退化）完整、四节家族齐；与 agent-body 同文节（认知分层约束/当前原则/运行资产落点/层契约）逐字比对一致，无漂移——09 系全编制形态的正面样本。

## 观察注记（不计意见，不要求本批处理）

- **群 B 机制线索**：session-body 第 36 行载「agent-core contract accept 面=CONTRACT_V3_SUPPORTED_VERSIONS=['3.0','3.1']（v3.1=ceo/CTO 席 session_body 扩展形态）」——为 paths 缺 session_body 候裁群 B 提供机制性解释方向（v3.0/v3.1 合同面对 session_body 键的支持矩阵），候 CHO 门/宿主发布流程在群 B 裁决时一并核对。
- **跨批命中族（一句话级）**：E2 命名群——FSD 不在群内（小全四处一致）；execution/ 悬空系——本批仅 contract business-strategy-state source 一处（registry 面，非 execution/）；冻结锚族、名址格式族、COGNITION_HOME 重复族、runtime_baseline 换代窗族——命中沿判；薄版认知层族——**未命中**（FSD 认知层三件全编制完整，反为正面样本）。
- **support assets 双位并存观察**：TriCompany sibling 位（缺席）与 TriMetaverse 仓内位（在位，含 15 员工实例目录）并存，LG-023 无前缀路径解析存在歧义空间——本席批7 误判即源于此；建议宿主发布流程/CTO 域对 assets 包唯一正位作一次定谳（非本靶标）。

## 挂起候裁清单（汇总）

| 群 | 挂起项 | 涉及件 | 候裁 owner | 裁决路径 |
|----|--------|--------|-----------|----------|
| B | contract paths 缺 session_body 登记（第 7 例，CPO/COO/COS/CFO/CMO/CHO/FSD 七席同款；机制线索=CONTRACT_V3_SUPPORTED_VERSIONS 版本矩阵） | contract | CHO 门 + 宿主发布流程核对 | 补登记或出示 manifest 独立登记证据；七席一并批量裁决，连带核对 v3.0/v3.1 对 session_body 键的支持矩阵 |

本席保留权：以上全部意见保留权候 CEO；审读位不代裁、不改件。
