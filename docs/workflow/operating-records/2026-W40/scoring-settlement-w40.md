# W40 绩效周期结算读数（补办·LG-068 记账面毕稿）

- sourceOfTruth: 本件（当周经营记录结算读数件；口径正身=`TriCompany/docs/workflow/performance-scoring-workflow.md`）
- syncMode: static
- lastSyncedAt: 2026-10-11 13:39:08 +0800（CHO 补结算铸账；date 现查）
- 周期: 2026-W40（09-28~10-04·结算日 10-04 周日）
- 结算性质注记: **补办结算**——10-04 周日结算未办（COO 卷实勘），本件系 LG-068（lg068-perf-scoring-resume·账本第 19 条）补结算计划「W40 补结算→W41 10-11 首跑」的记账面毕稿，10-11 补办落账；**非周期重算、非追溯记账**，事件账仍以 scoring-ledger-w40.md 为准（本件只出周期结算读数，不改动任何已入账事件）。

## 一、W40 周期结算读数（13 席全员）

| # | 席位（roster 正名） | 基分 | 有效扣分 | 验证加分 | 周分 |
|---|---|---|---|---|---|
| 1 | ceo-chief-of-staff（CEO 总助·小贾） | 100 | 0 | 0 | **100** |
| 2 | chief-product-officer（CPO·小乔） | 100 | 0 | 0 | **100** |
| 3 | chief-technology-officer（CTO·小狄） | 100 | 0 | 0 | **100** |
| 4 | chief-human-resources-officer（CHO·小源） | 100 | 0 | 0 | **100** |
| 5 | chief-administrative-officer（CAO·小行） | 100 | 0 | 0 | **100** |
| 6 | chief-marketing-officer（CMO·小敏） | 100 | 0 | 0 | **100** |
| 7 | chief-operating-officer（COO·小营） | 100 | 0 | 0 | **100** |
| 8 | chief-financial-officer（CFO·小财） | 100 | 0 | 0 | **100** |
| 9 | full-stack-developer（全栈·小全） | 100 | 0 | 0 | **100** |
| 10 | senior-test-engineer（STE·小柯） | 100 | 0 | 0 | **100** |
| 11 | rd-trainer（RAndD·小吴） | 100 | 0 | 0 | **100** |
| 12 | customer-success-officer（CSO·小成） | 100 | 0 | 0 | **100** |
| 13 | deployment-engineer（SDE/DE·小布） | 100 | 0 | 0 | **100** |

- 席位名单=employee-roster.json v1.0.0 实读（13 员工席全员 live；董事会治理席非员工席不入评，正身范围条款对表）。
- W40-001 唯一入账事件系 deployment-engineer 席（账面原笔记「SDE」同位），计分效果 **+0（CEO 终裁轻处置豁免）**——对结算读数零影响。

## 二、结算口径注记（四条）

1. **扣分面**：W40 事件账仅 1 笔且为豁免入账（+0），全席有效扣分=0——量比折减公式（有效扣分=缺陷扣分×min(1, W/W̄)）无扣分对象，不适用。
2. **加分面**：W40 无加分事件入账记录（按期验收/跨席补位/高影响件三类均零入账），全席验证加分=0——活跃线资格核（W≥W̄/2）无申请对象，不适用。
3. **历史冻结**：W38（首周期·制度生效前已结束）/W39 按「历史冻结」条款**不追溯重算**——正身校准与修订段、COO 卷④条 3、CHO W40 首铸注记三向同判，本件不触碰该两周期。
4. **用途限定**：本读数系观察排序用——13 席 100 分并列，零排序信息（如实载）；无席位触「连续两周 <80 触 CHO staffing 复核」线；不与调薪、裁撤挂钩（正身条款原文）；W40-001 两项改进义务仍列 W41/W42 记分账面例行对表复核点（scoring-ledger-w40.md §二照旧，非扣分项不受结算影响）。

## 三、与 W41 首跑对表基线衔接

- 本件落账后，链上最新结算态=**W40 已结**——今晚（10-11）21:00 W41 首跑 cron（TriMLC 8713 机械叫醒 CHO 铸账+COS 收口）起，W41 为首个完整机械节律周期，其对表基线（上周期结算态）由本件补齐。
- LG-068 记账面义务（owner CHO 位）随本件落库即达；台账条后续随复活链走（21:00 首跑后每周对表自查随收口批，改进②通道）。

## 锚清单

- date 现查：2026-10-11 13:39:08+0800（铸账）。
- 口径正身：`TriCompany/docs/workflow/performance-scoring-workflow.md`（公式/封顶/量比/历史冻结/用途限定条款，2026-10-07 复读 57 行全文在案）。
- 事件账面：`2026-W40/scoring-ledger-w40.md`（W40-001 +0 豁免+首铸注记，本日实读）。
- 运营面判读：`2026-W41/coo-scoring-audit-20261007.md`（W38 未跑完/W40 单笔无结算/补办候 CHO 窗/历史冻结同判，本日实读）。
- 台账条：lg068-perf-scoring-resume（账本第 19 条·eb444ffe 入链；补结算计划指针三项，ledger-mirror 实读）。
- 席位名单：`TriCompany/docs/registry/employee-roster.json` v1.0.0（13 席 id/displayName/instanceName 实读提取）。
- 令源：COO 排工令经 COS 转派（m-cos→m-cho 2026-10-11 13:37）；硬时点=今晚 21:00 W41 首跑前。
