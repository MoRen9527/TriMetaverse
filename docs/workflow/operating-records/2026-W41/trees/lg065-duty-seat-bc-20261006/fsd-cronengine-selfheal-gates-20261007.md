# FSD 根治包施工+门读数落卷 · TriMLC cronEngine 运行期 stale-running 自愈

- sourceOfTruth: 本件（FSD 施工交付卷；架构裁决=CTO APPROVE d38a3eae）
- syncMode: final
- lastSyncedAt: 2026-10-07T02:50Z（date 现查 10:50+08）
- 施工席: FSD 小全（m-fsd）；设计稿=同目录 fsd-cronengine-selfheal-design-20261007.md（commit 19601f86）
- 交付锚: TriMLC **6f832a1**（叠 03c6197；sg bare 已推 03c6197..6f832a1 ✓）

## 一、施工面（4 文件 +341 行，零 schema/零 API/零 types 变更）

| 文件 | 变更 |
| --- | --- |
| `src/cron/store.ts` | +`reclaimStaleRunningJobs(cutoffIso): string[]`——条件 SQL 归位（idle+last_run_status=error+error_count+1）+执行账补记（startedAt=updatedAt 代理，durationMs=0+errorMessage 注明未知）+逐行内存刷新（WAL mtime 盲区避让同 boot sweep 形）+saveCronStore（maint-④） |
| `src/cron/timer.ts` | +`sweepStaleRunning`（onTimerTick 锁内最前挂载、dueJobs 过滤前；armTimer ≤60s 节拍驱动零新 timer）+逐 id 重排 nextRunAt=下一未来槽位 max(槽位, now+MIN_REFIRE_GAP) 不补跑断热循环+`TRIMLC_CRON_STALE_RECLAIM=0` kill-switch+`TRIMLC_CRON_RECLAIM_GRACE_MS`（缺省 120000）+updatedAt 代理语义边界钉注（CTO 附条件①） |
| `src/localbus/bus.ts` | **写入面增补（设计稿外 +3 行，如实标注）**：LocalBusEvent 联合类型增 `cron:stale_reclaimed`——publish 为类型化总线，事件成员必须在册；degraded 不耦合（CTO 裁③），告警走本事件独立订阅 |
| `test/cron-stale-reclaim.test.ts` | 新卷六锚（+216 行） |

三裁点落码形态：①updatedAt 代理（语义边界钉 store+timer 双处注释，案⑥测试锚双向钉死「顺延非免疫」）②归位不补跑（零补跑标记，重排严格未来槽位）③degraded 不耦合（sweep 零触 consecutiveFailures/degraded，仅事件面）。

## 二、测试锚六条（设计稿五条+CTO 附条件①第六条）——6/6 绿

1. **案1 归位三件套**：stale 行（回拨 15min）→ idle+执行账 error 行（startedAt=归位前 updatedAt）+error_count+1+nextRunAt 未来+db 行面直证
2. **案2 新鲜 running 不误收**：updatedAt 新鲜行零触碰零补账
3. **案3 timeout-settle 零触碰**：同 store 双 job（failed 已 settle+stale running）→ sweep 选择性只收 running，failed 行状态/error_count/账三零动
4. **案4 kill-switch**：`TRIMLC_CRON_STALE_RECLAIM=0` → 零归位零补账
5. **案5 非循环全链**：真 onTimerTick（armTimer+mock timers 2.1s）→ sweep 挂载实证+nextRunAt 严格未来+onJobTrigger 零触发（同 tick 不补跑）
6. **案6 PATCH 顺延非免疫**（CTO 附条件①）：PATCH 刷 updatedAt → 同窗顺延不误杀；时间再过 → 照常归位

## 三、全量门读数（四门全绿，10:4x 现测）

| 门 | 读数 | 判定 |
| --- | --- | --- |
| ① tsc | `npm run check` 0 错（exit 0） | ✅ |
| ② 新案 | 案1-6 全绿 6/6 | ✅ |
| ③ 全量零新败 | **633 tests / 628 pass / 5 fail**——五 fail 与基线逐名相同（replay-flow / P0 端到端 / FADE 派工门禁 / FADE 可见性 / tui-components） | ✅ 零新败 |
| ④ 独立基线 | 改前 03c6197 干净树实测 **627/622/5** 同五名（施工前先跑后改，非转抄非推定） | ✅ |

（全量序号位移 23→24 等 = 新增 6 案+1 套的自然排移。基线五 fail 均既有在案面，归因不动：replay-flow/P0 端到端属 HTTP app 全局门族、FADE 两案属 roster-gating 契约族、tui-components 属 TUI 组件族——零一例涉 cron 域。）

## 四、交接面

- **今晚 18:20 冷起窗三笔同带**（SDE 段③执行）：TriMLC 侧输入=**03c6197+6f832a1**（sg bare 已备，stage 构建源即 sg bare）；TriRLC 侧 2b1709d 归 SDE/CTO 面本席不代验。本包零 schema=冷起即生效，无 SQL 迁移步。
- **github 补推欠账一件**：TriMLC github 443 持续断连（HTTP/1.1 切换两轮均 Connection reset，10:3x-10:5x 四试）；sg bare（部署构建真源位）已带 6f832a1。按窗令「github 补推 anytime」性质挂后续轮，本会话稍后重试，不成则转 COS 排程面收口。
- N2 关系：CTO 加固条件 2「N3 实测前若已修则本机面压力降级」——本包落码即兑现。

## 使用依据

CTO APPROVE d38a3eae（三裁点全采主案+部署升级带门冷起窗）；设计稿 19601f86；TriMLC timer.ts/store.ts/types.ts/scheduler.ts 现役实读；测试 harness 两族先例（cron-boot-recovery 真 store 形+cron-skipped-degraded mock timers 形）；基线=本会话施工前全量实测。
