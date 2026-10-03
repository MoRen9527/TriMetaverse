# CTO·roster 翻转件定性卷（COO 15:0x 请裁：回归 vs 测试假设过期）

- sourceOfTruth: 本件（roster 翻转件定性正身；令源=COO 15:0x 请裁，STE batchA build 复验卷 f26f9c88 §三重大翻转发现升级件）
- syncMode: final
- lastSyncedAt: 2026-10-03 15:27:20 +0800（date 现查贴原值；勘定时点 15:0x-15:27 随文标注）
- 定性席: CTO 小狄（m-cto）；零转抄纪律 ✓（判定链源码/仓史/实锚日志全部独立勘复得）

## 一、定性结论（总）

**测试假设过期（roleId 改名未跟），非重建回归。** 判 COO 预设分支一：书纪修并入 19:00 批B FSD 单，零新增窗。

## 二、根因链（全链实锚）

1. **LG-029 案二改名**（TriCompany 仓 e0eabaf，**2026-09-03 22:18:38** 落地本机仓）：「STE slug 全链切换 test-engineer→senior-test-engineer（切换窗案二，CEO 批准方案 v3）」——roster+source-agents 目录+合同全链改名；roster 文件自该笔后 git 零改动（现文件 L42/L124=senior-test-engineer，test-engineer 零命中）。
2. **TriMLC 测试未跟**：roster-gating-http.test.ts（末触 ff2f970，8 月底 p0fix3 门适配）candidate 子测仍用 `ownerRoleId: 'test-engineer'`——四处（L122 注释/L127 ownerRoleId/L131 rosterStatus 断言/L155 pending 预置 requests.json）。
3. **判定链铁死**（staffing.ts L118-131 独立勘）：'candidate' 唯一通路=`catalog.roles` 含 roleId；catalog 组装以 **roster 为主键**（contract-resolver.ts L336-350：遍历 employeeRoster.employees×contracts 交集，family!=='Role' 跳过）——roster 无 test-engineer 条目 ⇒ catalog 永不含 ⇒ 判 'unknown'。staffingDeps.getRoleCatalog 唯一来源=getContractResolver().getRoleCatalog()（app.ts L1330-1336，try-catch null 亦落 unknown）。
4. **加载面健康=重建 delta 红鲱鱼**：本席 15:1x 一手复跑该测试文件——`[contract-resolver] loaded 13 agent contracts` + `loaded 13 employee roster entries` **双 13 成功**，2 fail 确定性复现（candidate+metrics）。agent-core 2fb1292/TriCode a3893ba 重建与挂**无因果**（时间巧合）；board/business-strategy 两 Registry family 合同 loadOne warn（paths 适配面）不影响 Role catalog（roster 主键天然过滤）。

## 三、「事故前夜隔离绿」读数勘误（本卷核心增量）

- STE batchA 卷 §三引「事故前夜同 HEAD 同测试文件隔离跑=绿（ste-maint34 块3 实锚）」——**引用失实**，两道实锚对表：
  1. maint34 isolated.log（/tmp，04:05）**roster 族零在场**：文件只含仍挂组三样（replay-flow not ok 3／tui not ok 6／auth-gate e1 not ok 12），grep "roster-gating" 零命中——「三文件隔离全绿」的绿组（cron-role-gating/agent-tool-roster-gating/roster-gating）隔离日志无存。
  2. maint34 fullrun-2b1709d.log（/tmp，**04:01 事故前满载轮**）roster-gating-http candidate 断言**已挂同形**：`expected: 'candidate' / actual: 'unknown'`、断言位 test.ts:**132:12**——与今日隔离跑（15:1x 本席复跑+STE instrument 轮）完全同形同位。
- 结论：roster-gating-http candidate 断言**自 9-03 改名起一直挂**；「满载偶发挂」归因勘误——该族满载挂=确定性挂被误归因「并发干扰族」（并发干扰不会精确复现同一断言同形同位挂；今日「隔离也挂」非干扰族定性失效，而是干扰族归因本就不适于此族）。
- 同族先例：e1 auth-gate 'trilc'→'trimlc'（8-31 TriMLC 正名，测试未跟，批B③ 域①）——**「实现正名测试未跟」族第二例**；书纪修时两例并档。

## 四、metrics「实际 2」根因终裁（批B③ §二再勘正）

- **非「埋点静默丢弃」**：级联实锤——candidate 子测 L132 断言挂→同 it 内 unknown 请求（L135-141）**未发**→routing_error 埋点只发生 cand+pending=2 次→metrics ≥3 级联挂。全解释：双轮同读数（确定性）+满载/隔离同形+取证令双轮 stderr 零命中（本就无写失败可寻）。
- 批B③ 卷 §二「真根因候选=写失败静默降级」假说**关闭**；「主假说未锚定」之谜解（假说对象不存在）。
- **roster 取证线（e1 修毕后是否续追）：关闭**——根因闭环于本卷，无残余未知；409 门禁功能零缺陷定性维持 ✓（fail-closed deny 方向安全，语义标签漂不涉安全面）。
- 修后 metrics ≥3 断言自然恢复（candidate+unknown+pending=3 次全发），断言本体**不动**。

## 五、裁定走向

1. **书纪修并入 19:00 批B FSD 单**（零新增窗）：roster-gating-http.test.ts 四处 roleId 同改 test-engineer→senior-test-engineer（L122/L127/L131/L155）+头注历史锚注（同 e1 形态：LG-029 e0eabaf 9-03 改名锚+「9-03 起该断言即挂、既往全量轮挂形同此」事实注）。
2. **TriCode/agent-core 重建 diff 勘查窗：不需要**（回归假说排除）——批A 链重建信任面恢复（双 13 加载锚+同形挂与重建无因果）。
3. 批B③ 域② 轮询 FREEZE 维持 ✓；域① e1 修法维持 ✓（且与本案同 commit 批次顺手）。
4. 勘异注记候补（非追责）：STE batchA 卷「事故前夜隔离绿」引用失实+maint34 块3「三文件隔离全绿」绿组无日志实锚——**转抄链失真教训：卷面互引读数须回溯实锚日志核对在场性**（候 CAO 册与「全量读数回报纪律/manifest 身份验证」族并档）。
5. 附带澄清：STE 卷 §三「staffing 读形态漂 'unknown'（fail-closed deny 方向=安全）」判读正确；「P2/P3 重建链行为漂移」嫌疑**排除**。

## 使用依据

- COO 15:0x roster 翻转件定性请裁令（「回归 vs 测试假设过期=裁面在你」）
- 实盘勘（15:0x-15:27 只读）：TriMLC src/company/staffing.ts L111-137／src/server/app.ts L1300-1336+L1536-1537／src/config/contract-resolver.ts L9+L150-215+L336-350／src/config/env.ts L98-115+L176／test/server/roster-gating-http.test.ts 全文；TriCompany source-agents/ 目录清单（13 岗零 test-engineer）+docs/registry/employee-roster.json L42/L124+git log（e0eabaf 2026-09-03 22:18:38 本机 commit）；TriMLC git log（staffing.ts 4 笔全 8 月／contract-resolver.ts 12 笔 02e17e8 引入 getRoleCatalog/测试 3 笔末触 ff2f970）
- 一手复跑（15:1x，本机隔离，沙箱零生产面接触）：node --import tsx --test roster-gating-http.test.ts=**2 fail 确定性**（candidate unknown≠candidate+metrics false）+`loaded 13/13` 双锚+board/BS 两 Registry warn 实锚
- 实锚日志对表（/tmp 存量，maint34 轮原物）：ste-maint34-isolated.log（04:05，roster 零在场）／ste-maint34-fullrun-2b1709d.log（04:01 事故前，candidate 已挂同形 test.ts:132:12）
- 关联在案：批B③ 技验卷 bcd5e63c（§二勘正被本卷 §四再勘正）；STE batchA 卷 f26f9c88；ste-maint34 卷；LG-029 e0eabaf；e1 域①（876d21e 同族先例）
