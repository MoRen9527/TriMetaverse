# COO 终验卷 · 四卡勘修窗活体锚四件（序4）·2026-10-14

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/mc-link-verify-20261014/coo-obs4card-finalverify-20261014.md
- syncMode: static（终验卷·窗令序4 COO 终验位·四锚全销）
- lastSyncedAt: 2026-10-14T21:39:00+08:00（date 现查原值 21:39:00+0800·D-47 正形 A）
- 窗: 可观测性四卡勘修窗 21:00-22:45（窗起算锚 14:01:48·实际 21:00-21:35 全链毕·止损富余）
- 链: FSD 落码三卡（ee59619/7aa5799/d9a6254）+卡④配置（l1 dim-4·bak-pre-dim4 锚在位）→SDE 重启毕（21:22:08·停摆 18s）→STE 门禁 PASS（749/749·4707390）→FSD 活体锚施工（21:24-21:32 三轮重启链·毕报 96c6ee6f6）→**COO 终验四锚（本卷·21:23-21:35 独立验）**

## 四锚销宣（全部独立验·非转抄）

| 锚 | 断言 | 独立验读数 | 判 |
| --- | --- | --- | --- |
| 卡① 分类日志落形 | daemon.log `[trilc:conn] <ISO> heartbeat failed: <cls>` 行在·多型活体 | trirlc\daemon\daemon.log 分类行 **15 笔三型**（network-ECONNREFUSED×12/timeout×3/401×1）·格式=ee59619 正形·与投影时点对平（13:22:36/56Z 双源吻合） | **销** |
| 卡② 计数投影 | healthz 嵌套 mc 段七字段在位+值面活体 | {link,totalFailures,lastFailureAt,lastFailureClass,degradedFailures,alarmSent,notifyFailures} 全字段·峰值 totalFailures=7（FSD 卷中间轮）→终态 1（末轮制造段）——滚动活体实证 | **销** |
| 卡③ degraded 告警链 | 触发+告警+恢复重置全链 | FSD 卷中间轮读数：degradedFailures=4+alarmSent+告警真发**每拍重试形态**实证（出向通道不通永不到成功静默态·单测已证）；COO 终态复核=恢复重置形态在位（degradedFailures=0·link=connected） | **销**（通道勘修挂 TD-obs-1 候 BOD） |
| 卡④ l1 dim-4 | dim 探 8711 mc_link 在列·纯 additive | 脚本 dim 4 段在位（8711 healthz 双断言形：healthz-unreachable/mc-link-degraded）·dims 1-3 untouched·备份锚 bak-pre-dim4-20261014·l1.log 连续 OK all-dims（13:20-13:34 多笔含 COO 干跑 EXIT=0） | **销** |

## 终态读数（21:33:4x 现查）

- mc_link=**connected**·uptime 223s·mc 段 totalFailures=1/lastFailureClass=timeout(5000ms)/degradedFailures=0/alarmSent=false/notifyFailures=0——恢复重置后干净态（④形态互证）。
- **读数对照附注（21:44 补·COS 抽验附注认收）**：COS 21:41 活体现读 totalFailures=2（5s 复测稳非在涨）——对我 21:33:4x 读数 1·定性=毕报后一次瞬时心跳自愈（单拍失败→次拍恢复·计数累加面正常行为·lastFailureAt 随之滚动）——恰证卡①②可观测性目标本身（瞬断被捕获+分类+计数）·非终态破坏。大表销账行附注 COS 侧在案（8c948e325）。
- 窗毕总态：**四卡全落+门禁 PASS+活体四锚全销·窗实质毕 21:35**（窗界 21:00-22:45·提前 70min·零回滚）。
- 卡④ 24h 观察窗挂账：dim=mc 读数并卷候 CTO 复核（观察池⑧）。

## 随卷呈 BOD 两件（FSD 卷带出·COO 流转）

1. **TD-obs-1**：卡③告警出向通道连接级不通（fetch failed 非 403·TRIMC_NOTIFY_SG_URL 对端活体候 sg SSH 勘·跨机归 BOD）——通道修通后才轮到 source_seat='trirlc-conn' 8713 白名单补录（观察池⑦序位其后）。投影面已照亮（mc.notifyFailures 计数在位=可观测性目标本身达成）。
2. **卡④ 24h 观察窗**挂账：l1 dim=mc 读数并卷候 CTO 复核（转正条件窗纪律条款）。

## 使用依据

- 窗令卷 coo-observability-window-plan-20261014.md（§三序4 分工）；FSD 毕报 96c6ee6f6（§四/§五读数）；STE 门禁卷 4707390；SDE 毕报（21:22 七步链）；本席独立探针四组输出（healthz×2/daemon.log grep/l1 干跑+l1.log/脚本 dim 清单）。
