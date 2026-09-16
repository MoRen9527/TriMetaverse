# B4 扫尾批1 · CPO source-agents 五席联审 · CAO 席意见

- **席位**：CAO（ChiefAdministrativeOfficer，小行）
- **date 现查**：2026-09-16T13:21:49Z（人读轨 2026-09-16 21:21:49 +08；本任务开工首动作现查，读数原样粘贴）
- **M4 零改动声明**：本席本次为审读位（审零改动），未对靶标 9 件做任何写入或修改；本席全部落盘仅本意见件一处。
- **独立性声明**：本席未读其他四席任何意见稿，席间零交换；对照基准仅 CAO 本席同构源件（soul/contract）与在册真源文档。
- **依据链**：任务书 20260916-msg-resume 任务2 · D-27 树协议 · 联审工作流 V0.2 · 三红线纪律（分歧挂起候裁清单化／保留权候 CEO／冻结件豁免标注）· D-13 通信名址规程（`TriCompany/docs/workflow/engineering-disciplines.md`）· D-04 报时纪律 · CAO 同构源件对照（`TriCompany/source-agents/chief-administrative-officer/`）
- **批号**：B4-sweep-b1
- **靶标**：`/srv/fleet/TriCompany/source-agents/chief-product-officer/` 全 9 件

## 表态总览

| # | 文件 | 级别 | 意见摘要 |
|---|------|------|----------|
| 1 | agent-body.agent.md | PASS | 无意见（同构核对通过） |
| 2 | agent-frontmatter.agent.md | PASS | 无意见 |
| 3 | chief-product-officer.agent.md | 建议 | 退役头注缺冻结时点锚 |
| 4 | chief-product-officer.contract.yaml | 挂起 | paths 缺 session_body 登记（候裁）；runtime_baseline 未换代（建议） |
| 5 | colleagues.agent.md | 建议 | 席位名址与 D-13 正名对齐 |
| 6 | memory.agent.md | 建议 | 运行资产落点 3 条重复 + ⑦ 悬空引用 |
| 7 | session-body.agent.md | 建议 | CHO 签收状态标记缺失 |
| 8 | social.agent.md | PASS | 无意见 |
| 9 | soul.agent.md | PASS | 无意见（双写同文已验） |

分布：PASS 4 · 建议 4 · 挂起 1（共 9 件）。

## 逐件意见

### 1. agent-body.agent.md — PASS

无意见。同构核对通过：固定前置核查为 compass 简化形态（与 CAO 件一致，完整清单下沉 session 面）；中央收口路由含 2026-09-11 CEO 晨报五裁①产品域收口落格，系职责矩阵明文升格，有据；无宿主 binding 事实混入；无越域内容。

### 2. agent-frontmatter.agent.md — PASS

无意见。name/description/user-invocable 三字段齐备；description 与发布面适用场景文案一致。

### 3. chief-product-officer.agent.md — 建议

- **意见**：退役头注（「本件已退役出渲染链；真源=同目录 agent-body.agent.md（D1b manifest 已切源）」）符合冻结件豁免标注原则，但缺冻结时点锚。未来审计版本差时（接手规则要求核对当时适用制度版本），无法定位退役时点的内容现势性——如本件仍含 0.5 归属路由阀门、不含五裁①落格，与 agent-body 的差异是「退役前旧态」还是「应同步漏同步」，现无法机械判定。
- **修改建议**：头注补一句「冻结于 &lt;日期&gt;（commit 锚）」，此后本件停更。
- **验收锚**：头注含可核查的时点/commit 锚。

### 4. chief-product-officer.contract.yaml — 挂起（附建议）

- **挂起①（候裁）**：`paths` 仅登记 6 件，缺 `session_body`；而目录内 session-body.agent.md 源件现役存在（自称「经 CHO 门签收+管线 execute 后为 session 面正身」），CAO 同构合同 paths 已含 `session_body`（chief-administrative-officer.contract.yaml 第 20 行）。若渲染链按 contract paths 取件，CPO session 面缺件；若 D1b manifest 另有独立登记，则本疑点消解——**证据不足，按三红线候裁清单化**：候裁动作=CHO 门（五件套增量验收）核对 D1b manifest，二选一：补 paths 登记，或出示 manifest 独立登记证据。验收锚=contract.paths 与 manifest 登记面一致，且覆盖目录内全部现役源件。
- **建议②**：`runtime_baseline` 仍旧三字段旧形态（`host: copilot-host` / `tri_mc_status: planned` / `tri_mc_migration_ready: false`）。CAO 同构合同已按 2026-09-14 B3/B4 执行波换代口径改为五字段（`m_plane_runtime` 等，注记明言「原三废字段删除」），CPO 未同步；且旧字段本身即宿主阶段事实，与五件套「宿主事实由 binding profile 承载、不入源件」的分层原则相抵。修改建议：按 CAO 2026-09-14 换代口径同构替换，`tools` 节 `runtime_equivalent: openclaw:*` 旧运行时命名字段一并纳入换代核对（CAO 换代件已无此字段）。验收锚=与 CAO contract.yaml `runtime_baseline` 节逐字段同构。走 CHO 五件套增量验收通道，不在审读批直接改。

### 5. colleagues.agent.md — 建议

- **意见①**：「小全（full-stack-developer）」括号内为退役 spawn 名。D-13 名址全表 FD 行正名=FSD（FullStackDeveloper→FSD 勘误，2026-09-03 LG-029），别名在册为「小全/全栈开发」，寻址一律正名。修改建议：改为「FSD（别名 小全）」。
- **意见②**：席位列举格式三种混用——「CTO 小狄（chief-technology-officer）」（正名+agent-id）、「小贾（ceo-chief-of-staff）」（仅 agent-id）、「COO 小营」（正名+别名无 id）。修改建议：统一「正名 别名（正名 id）」或「正名（别名）」单一格式，全表与 D-13 正名对齐。验收锚=D-13 名址全表逐一对表通过。

### 6. memory.agent.md — 建议

- **意见①**：「运行资产落点」节 `TRICOMPANY_COGNITION_HOME` 重复 3 条（第 20/25/27 行，其中一条带「或当前 runtime cognition backend」变体），且第 21 行存在孤行空行。同文在 colleagues 件仅出现一次。修改建议：合并为 1 条（保留私域语义），删孤行。验收锚=落点节各条目唯一、无重复。
- **意见②**：产品域收口记忆条目「（⑦ 权界同构）」为悬空引用——⑦ 在文内及可见依据链中无锚。修改建议：补全引用目标全称（如「CEO 晨报五裁⑦」及出处）。验收锚=引用可溯源到具体裁决条款。

### 7. session-body.agent.md — 建议

- **意见**：头注载生效条件「经 CHO 门签收+管线 execute 后为 session 面正身（supersedes 手作件 MARKER：interim hand-roll by 董事会 2026-09-01）」，但未载签收完成标记——现状态不可辨（候签中 or 已生效）。若已签收，头注停留在条件式表述会造成正身效力争议。修改建议：CHO 签收完成后头注补签收锚（日期+commit）；若尚未签收，头注明示「候签」。验收锚=头注含签收状态可核查标记。
- **附记（不计独立意见）**：「时刻引用先 date 现查（UTC Z 后缀 +8）」表述可辨但含混，CAO 家族口径为「人读轨北京时间（+08）、机器轨 ISO8601 UTC Z」双轨表述，后续修订时可顺手对齐 D-04 口径，不单列要求。

### 8. social.agent.md — PASS

无意见。工作名/上岗日期记录格式与 CAO 家族一致；soul/social 分工清晰（气质归 soul、社交连续性归 employee workspace、源侧仅结构契约）。

### 9. soul.agent.md — PASS

无意见。结构与 CAO soul 同构（人格设定+认知分层约束+当前原则+运行资产落点+层契约，家族统一模式）；与 agent-body 的同文节（当前原则/运行资产落点/层契约/认知分层约束）经逐字比对现势一致，无漂移。

## 观察注记（不计意见，不要求本批处理）

- **家族级观察**：soul 与 agent-body 存在同文节双写，现势逐字一致但无机制锁——未来单改一件将产生渲染取材歧义。此属渲染管线合同面（D1b manifest 取舍）事项，非 CPO 件个例缺陷（CAO soul 同构），留观。

## 挂起候裁清单（汇总）

| 序 | 挂起项 | 候裁 owner | 裁决路径 |
|----|--------|-----------|----------|
| 1 | contract paths 缺 session_body 登记或 manifest 独立登记证据 | CHO 门（五件套增量验收）+ 宿主发布流程核对 | 补登记或出示登记证据，二选一 |

本席保留权：以上全部意见保留权候 CEO；审读位不代裁、不改件。
