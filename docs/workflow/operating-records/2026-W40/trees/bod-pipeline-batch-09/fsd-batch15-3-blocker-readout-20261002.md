# FSD·batch-15 件③施工读数卷+第三类差异报点（10-02 21 窗）

- sourceOfTruth: 本件（FSD batch-15 件③施工卷；令源=COO 21:02 件③任务书全文转贴+21:05 落点勘正确认「动刀」；任务书正身=sg 树 task-charter-batch-15-3.md commit 2bd0d8c9）
- syncMode: static（施工中断点=resolve 14/15 卡 board；第三类差异候裁在案）
- lastSyncedAt: 2026-10-02T21:11+08:00（date 现查=2026-10-02 21:11:16 +08:00）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）

## 一、已毕面（终裁授权两条内，施工毕自测绿）

1. **agent-core schema Registry family 分支（paths 面，任务①授权内）**：
   - `TriCompany/packages/agent-core/src/contracts/agent-contract.ts` PathsSchema 四件套（soul/memory/colleagues/social）optional 化，简形=agent_body/agent_frontmatter；
   - 主 schema 尾增 `.superRefine()`：family=Role 时四件套强约束维持（防 v1 负路径回归，与 bs 先例对称设计）；
   - 包自测 `npm run build && node --test "test/*.test.mjs"` = **55/55 绿**。
2. **TriMMC 期望校准（任务②授权内）**：`test/contract-resolver.test.ts` 三处——runtime_equivalent 断言回落「string 存在性」（容缺省空串）；runtime_baseline 断言回落 spec L104 现役可选态（容 undefined，存在才验对象形）；resolve 期望 14→15（15=13 员工 Role+board/bs 两 Registry；预研 14=Registry 化前旧形历史态）。
   - **62 侧（CTO describe 全组）现全绿**。
3. **源侧零改动断言**：TriCompany/source-agents 面零 diff（施工全程未触；下节验收段正式复断）。

## 二、卡点实锚（resolve 14/15——board 单份拒，第三类差异）

- 调试实跑：`resolveContracts(source-agents)` = contracts **14**，errors=1——
  `board/board.contract.yaml :: schema validation failed: io_contract: Required; (root): Unrecognized key(s) in object: 'interfaces'`。
- **bs 已进**（14=13 员工+business-strategy），paths 分支对 bs/board 两份 Registry 的 paths 面均已放行生效。
- **全族 15 份持有面普查**（本席脚本实勘，值面三查纪律）：

  | 形 | 份数 | io_contract | interfaces |
  | --- | --- | --- | --- |
  | Role（13 员工） | 13 | 全持有 | 零持有 |
  | Registry=bs | 1 | 持有 | 零持有 |
  | Registry=board | 1 | **无** | **有**（L53 自证「本席新增节·非人格治理面特有」，四子键 cos_chain/cos_backup/exception_lanes/send_precheck） |

- **定性**：board 拒因**不在 CTO 终裁两条授权面内**——终裁①只覆盖 paths 四件套豁免+简形合法；board 的 io_contract 缺件与 interfaces 顶层新增节是**第三类差异**。且普查证明 io_contract 缺件非 Registry 族共性（bs 作为 Registry 照样持有），系 board 个体「无 IO 契约治理席」设计形（合同 L11 自证「不执行、不派日常单」）。
- **连带面**：即使 board 放行，contract-resolver 第二测「all resolved agents have non-empty system-critical fields」断言 `c.io_contract.inputs` 对 board 会 undefined 崩——该测试也候随 Registry 分支校准。
- 另捕获（不阻本单，列观察）：WO-D 定性②重现实证——resolve ids 面为 `deployment-engineer`（源侧合同目录 senior-deployment-engineer，agent_id 字段残留旧名；LG-059 源侧族候裁在案）。

## 三、候裁三案（本席不擅断，候 COO 转 CTO）

- **案一（本席推荐候裁）·schema 侧对称延伸**：与终裁 paths 分支完全同构——`io_contract` optional 化+superRefine 对 Role 形维持 Required（13 Role 现役全持有，行为零变，负路径保护面不松）；`interfaces` 顶层 `z.record(z.unknown()).optional()` 放行（可对称收紧：superRefine 限定仅 Registry 可持）。→ resolve 15/15 达成，源侧零改动守约。
- **案二·board 合同侧补形**：board 补 io_contract+interfaces 改形——违任务书「源侧合同正身零 diff」禁面，且须为治理席编造 IO 契约内容（产品语义面），不推荐。
- **案三·期望回落 14+board 单列候裁**——违任务书验收锚「resolve 全族 15/15」，不推荐。
- 治理域注：契约 schema 语义面变更属治理域（board 合同 decision_rights.freeze 列自证「契约 schema 治理域变更」候裁类）——故本席停手扩面施工，转报点候裁，不超裁擅动。

## 四、死线与状态

- 死线=10-03 12:00（任务书）；现 21:11，候裁窗口充足。
- 卡点触发任务书硬门语义：验收锚 15/15 在 board 一份上不可达，按「任一硬门触发=停手回卷」纪律本席不硬撑不装完成；候裁令一到即续施工（案一形态施工量约 30 分钟内含全量读数）。
- 已毕面（上节两项）不受卡点影响，候裁后一并验收。

## 五、使用依据

- COO 21:02 件③任务书全文转贴+21:05 落点勘正确认令（SendMessage 实收）
- CTO 终裁两条原文（任务书内载；paths 面+期望校准面，本卷第一节施工依此）
- 实勘源：TriCompany/source-agents/board/board.contract.yaml 全文+15 份持有面普查脚本输出（本卷表）
- 代码实勘：TriCompany/packages/agent-core/src/contracts/agent-contract.ts（施工后态）+TriMMC/test/contract-resolver.test.ts（校准后态）+TriMMC/src/contracts/{agent-contract,resolver}.ts（只读投影面）
