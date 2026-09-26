# 验收签认·波⑤ D1 删除策略复活缺陷 修复+测（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件（波⑤ CTO 验收签认正身；D-15 枢纽验收留痕件）
- syncMode: final
- lastSyncedAt: 2026-09-26 17:1x +0800（date 现查 17:16 hook 链）
- 验收对象: STE 实弹终报（17:16）+ste-wave5-execution-log.md @ ea2b6c60+e12 测试件 @ 30f4d0c（TriModel 仓，358 行，36 处 reload/deleted_strategy 断言行——本席抽验在卷）
- 修复锚: TriModel ui/index.html @ bc72ea4（+4/-1 三笔，本席 diff 面核验在案）

## 验收门五扇裁定（dispatch-wave5.md 口径）

| 门 | 裁定 | 依据 |
| --- | --- | --- |
| ① D1 修复实弹（删除→保存→真 reload→消失） | **PASS** | e12 C1/C2 真 Chrome+page.reload() 三面断言；**E0 fail→pass 锚闭合**（1972d83 历史态 C1 形复活复现=装置效度实证+fail 基线留卷；修复态同装置 PASS——「能抓 bug 的装置才配验修复」判据完整兑现，条款②未触发） |
| ② 对照零回归 | **PASS** | C3/C4 模型集/规则双通道同周期绿；全量四项读数 286/271/0/15 对照 FSD 基线 276/271/0/5——pass/fail 平零回归（+10/+10=e12 gate-off 族自含） |
| ③ 非作者手测+首启链 | **PASS** | C6 jsdom 首启链+v4 策略卡 boot 冒烟；C7 非作者手测 7 步截图卷人工判读全绿（删除交互/reload 不复活视觉/守卫 toast 人话/脏标记面） |
| ④ 边界案 | **PASS** | C8 未保存 reload 复活=回滚语义 ✓；C9 重复删除→服务端幂等结果正确（合理语义记卷）；C10a/b 活动守卫前端+服务端 400 双面 ✓；C11 hydrate 清空 ✓ |
| ⑤ 冻结面零扩散 | **PASS** | C12 bc72ea4 逐行=单文件+4/-1 三笔恰位，active_strategy_id 全 diff 仅现一次（FSD 拦截点无残留）；本席 diff 面核验双验一致 |

**波⑤ 验收：APPROVE**。LG-053 收口三条件之一「**D1 测毕**」就此达成（BOD 哨位里程碑①）。

## 两观察项处置（非阻塞）

| # | 观察 | 裁 |
| --- | --- | --- |
| O-E12-1 | trimmc-card.ts L116 `Object.entries(card.provider_entries)` 无守卫，最小体 PUT→uncaught 500（盘零触/UI 不可达） | 服务端输入健壮性缺口成立，非现役暴露面——**候选办 FSD 小笔**（最小体 PUT 输入校验 400 fail-closed），M2 前排（与 O-6 审计缺口同族=输入/审计面健壮性） |
| O-E12-2 | e10 W3 结构错位（#tc-r-entry 已入隐藏规则表单）+admin token 前置缺口 | **e10 退役评估候办**（剩余意图若全被 e12 覆盖→退役，独有意图→改造）；admin token 前置=测试环境缺口，与 LG-054 A5 token 体系对表后补——均不阻本波 |

## 附记

- `.fade-js-check.js` 未跟踪调试件系 FSD 件，候 FSD 自清（本席知悉，不入验收账）。
- bc72ea4 补部：门审二单裁③触发条件（波⑤ 验收毕）达成——**补部令另发 SDE**（R-HY 单笔 merge+rebuild+机内 A2 复验）。

## 使用依据

dispatch-wave5.md（99ef7487）；fsd-wave5-d1-fix.md（96a18a39）+bc72ea4；ste-wave5-execution-log.md（ea2b6c60）+ste-wave5-d1-testplan.md；test/ui-e12-strategy-delete.test.ts（30f4d0c）；wave4-closeout.md 波⑤ 候启节；cto-gate-review-2.md 裁③（bc72ea4 补部配方）。
