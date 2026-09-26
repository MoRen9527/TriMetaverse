# 收口件·波④ 全链演练全闭（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件（波④ 全闭收口正身；D-15 枢纽收口留痕件）
- syncMode: final
- lastSyncedAt: 2026-09-26 16:0x +0800（date 现查 15:55 hook 链）
- 全闭判定: 演练内容验收（wave4-acceptance.md @ 1f7c17ba 五门全 PASS）＋出窗还原独立核验（STE 三项全绿 15:54）=**波④ 全闭**

## 全闭账

| 项 | 终态 | 正身 |
| --- | --- | --- |
| 五臂演练 | F1-F5 全绿（含补验门 10/10 钉位触达实证） | ste-wave4-execution-log.md |
| 防线继承 25/25 | 零丢零 FAIL（21 实弹+4 MAPPED+T2d 映射）——脚本退役前置达成 | wave4-acceptance.md |
| 真活体总判据 | hash 491F…78B2 五臂+事故轮回滚全程守完，出窗终验逐字 | 同上+核验节 |
| 红线事故 | 止损（13:45 回滚归位）+根因两轮勘正定谳（ShellExecute 幽灵参形态）+隔离层修复实证+定责三分 | redline-incident-01.md @ c8163179 |
| 出窗还原 | FSD 五步（含 watchdog ps1:29 修形+复活链形态验证）+STE 独立核验（132−4=128 算术互证） | 核验节 |
| BOD 哨位读数 | ③恢复梯四级实弹+④25/25+toast 触发实弹=全清（R-HY M1 归部署波已勘正；toast 视觉帧候补拍不阻） | COO 台账更正确认 |
| toast 产品判 | CPO 人话判回转（有条件可用；④P0+分文案=候办归位） | cpo-toast-copy-verdict.md @ 85f114f1 |

## 候办台账增量（本波新增，全量随收口转 COS 挂账）

**FSD 批（波⑤ 后排窗一次施工可并的归并提示）**：
1. O-6：DEPLOY_KEY_MISSING 拒绝路径落 audit（presets 阶段早于 audit 写点的审计可见性缺口）；
2. toast ④P0：④行指真 `trimlc model status` 或过渡期删行（CPO 必改裁）；
3. toast 分文案：L2STUB reason 驱变体（CPO 裁，判据同源 503 定义案，与偏-2 实现可并批）；
4. 振荡循环节流：flag 重写节流或占口清除联动（回滚轮+发现-D 生产半格实证）；
5. O-7：status 探针默认端口 8711 双控制器部署斟酌（与技术债⑻ 同族）；
6. guard 可达性自检（`where node` 断言进 channel cmd，候办非强制门——若已顺手落则销）。

**备案/挂账（非施工）**：
7. ps1（restore-claude-direct.ps1）退役批随 BOD 验收制——护栏位差（-UseKnownGood 覆盖写零备份）已备案，退役对象不投施工；P2 通道切正门 trimlc 前置=用户 shell PATH 验绿；
8. 治理条两条入册（cmd/ps1 非 ASCII 维持+Start-Process 幽灵参禁令新增）——COS→CAO 线在途；
9. toast 视觉帧补拍（cron force-run+显示就绪）；
10. l3-remind errorCount=8 窗前历史归因（未现查留观察）。

**正式启用门禁五条**（候启用窗裁，非本任务交付）：探活超时对齐（主条）/keys 二次确认/auth-dead restore 振荡语义/watchdog 持有者校验/restore 写目标知情裁决——全账见 wave4-acceptance.md。

## 现役态快照

daemon=TriMLC 7496（watchdog 拉起体，干净形态）；TriModel 3333 健康；channel cmd/watchdog ps1 全 ASCII 正身态零钉位；cron 双 job 存活；LG-035 冻结面零触碰；评估线（EVAL-LG053-WAVE3）候 CEO 批不动。

## 波⑤ 候启（回头测删除策略 D1）

- D1 定性（LG-035 走查实锤）：前端删除策略仅 `delete tcStrategies[id]`（index.html L1125），声明通道 `tcDeletedStrategyIds`（L441）零 push、PUT 不带 `deleted_strategy_ids`——保存后服务端 upsert 合并使被删策略复活；对照模型集/规则双通道齐，唯策略断线。
- 波⑤ 范围=「CEO-走查临时」窗留存卡随线清理+D1 回头测；**前置实勘一笔（FSD）**：现势修复状态勘定（通道是否已接/PUT 是否带字段），据以定「修复+测」或「纯回头测」范围——实勘报后本席出拆派单。
- 纪律预置：第四型盲区教训=测试必含「删除→保存→reload→断言消失」完整持久周期（跨刷新），jsdom 首启链+非作者手测门（ui-delivery-render-gate）适用。

## 使用依据

wave4-acceptance.md（1f7c17ba）；redline-incident-01.md（c8163179）；STE 出窗核验毕报（15:5x）；FSD 出窗五步报（15:5x）；CPO 人话判回转（85f114f1）；joint-plan.md 波次表；lg035-walkthrough-restart-01/cto-walk-2-four-families.md D1 条。
