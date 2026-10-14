# COO 裁决 · TD-obs-1 出向通道三案处置 ·2026-10-14

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/mc-link-verify-20261014/coo-td-obs1-disposition-20261014.md
- syncMode: static（COO 运营裁决卷·TD-obs-1 勘毕承接）
- lastSyncedAt: 2026-10-14T21:53:16+08:00（date 现查原值·D-47 正形 A）
- 勘报源: BOD 21:52 勘毕报+勘报卷 `mc-link-verify-20261014/reports/bod-notify-sg-endpoint-probe-20261014.md`@e4a62de27（在链）
- 根因（BOD 钉死·三证）: sg 8712 TriMC daemon 监听面只绑 127.0.0.1 回环独占——本机出向 TCP 层即拒（curl HTTP=000·2ms 瞬拒+sg ss `LISTEN 127.0.0.1:8712`+env.ts 代码语义双仓对表）·与 token/URL 无关；**8713 notifyFailures=3 同因**（非 8711 单点）。

## 裁决（两点半批·BOD 倾向形态认）

| 案 | 裁 | 理由与执行位 |
| --- | --- | --- |
| **案 B 隧道过渡** | **采·今晚即起**（BOD 本机面活·不占窗额） | 恢复优先——告警链盲区今晚即闭；前提如实记：**过渡形态·常驻脆弱面**（隧道断=告警再盲）·守护面=观察池盯 8711 mc.notifyFailures 回升即知隧道断；段② 8713 出向同步受益（同根因） |
| **案 A 改绑根治** | **采·挂明晨白名单勘修窗**（白名单①daemon 勘修/重启类·我登记面排窗·BOD sg 侧执行） | 标准正形（0.0.0.0+安全组限源+token 门保持）——今晚不排理由：BOD 在 dsh 序2 主刀在途，「一次一件事窗」纪律不叠 sg daemon 重启；根治窗=明晨并批窗对表后定笔 |
| 案 C 告警改文件面 | **不采** | 改码最大·与现役出向 HTTP 形态不匹配·案 A 后必要性归零 |

## 配套落笔

- 卡④ 24h 观察窗：挂台账观察池·时点锚=2026-10-15 21:35（毕报后 24h）·dim=mc 读数并卷候 CTO 复核（COS 催办链跟）。
- 案 B 起后验证锚：8711 healthz mc.notifyFailures 停涨+新失败拍 alarmSent 出向 200 面（或 sg 侧 TriMC notify 收件面证据）——BOD 隧道毕回报读数·本席终验形态同四卡窗先例。
- 案 A 窗令要素（明晨）：sg 8712 改绑+安全组限源勘验+token 门保持断言+8712 重启链（BOD sg 侧）→案 B 隧道退役时点宣告（过渡件退役纪律）→8711/8713 notifyFailures 归零复测。

## 使用依据

BOD 勘报卷 e4a62de27 三证；TriRLC/TriMLC env.ts 代码语义对表（BOD 勘报引）；白名单①类判据（D-23 v3）；「一次一件事窗」纪律；M 面跨机路由（sg 操作归 BOD·排窗归本席）。
