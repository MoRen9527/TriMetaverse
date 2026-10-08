# S3 通道维护波候选清单 · 汇总正身（督办面并表）

- sourceOfTruth: 本件（trees/s3-channel-maintenance-wave/s3-candidates-20261008.md）
- syncMode: static
- lastSyncedAt: 2026-10-08 11:5x +0800（date 现查 11:49:18 CFO 信 hook 现戳；成文 11:5x 段）
- 编排席: COO 小营（收口督办面职责·排工卷单 7 后半应办）
- 性质: 两单 BOD 裁定「入 S3」在账在先（各裁定卷为登记正身），本卷=督办面汇总并表供 S3 维护波排窗勘验——值面勘验锚全走指针不转抄
- 排窗面: 候 CTO S3 判据卷（CTO 11:45 信预告今晚/明上午·判据需 8711 代码现勘落准）→本席出 S3 窗令（三栏+落树正身制+链声明指针行首例适用）；候选窗 10-10+ 白窗

## 一、在账候选单（两单并表）

| # | 单名 | 入账裁定 | 勘验锚指针 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | PENDING-RESEND 投递通道 fail kept | BOD 终裁入 S3 维护波候选清单（10-07 17:39·LG-064 B 族闭案终局） | ste-8713-fix-window-regression-20261006.md §七.5 时序注+§八 终局注记（cron-liveness-alert-20261005 树） | 在账候勘 |
| 2 | sg TriMMC POST 403 共享通道缺陷（LG-069 通知腿主因） | CTO 终验收裁「归 S3 勘验升格·本交付不修」照 BOD 裁升 S3（卷落款 10-08 03:27+08） | cto-final-acceptance-20261008.md §三.2 三要素勘验锚（403 定性/GET-POST 同 token 分叉/token len=64 tail=4aa5 一致）+ste-acceptance-20261008.md §二（lg069-power-gate-20261007 树） | 在账候勘 |

## 二、同签名关系注

两单同签名在账在先（LG-069 STE 验收 §二：sg TriMMC POST 403 与 PENDING-RESEND 通道 10-07 09:10 起 ALERT-SENT 200→fail kept 同签名）——S3 维护波勘验预期并线：根因同源则一修双销，异源则分修。判定归 CTO 判据卷+勘验窗实锚，本卷不预判。

## 三、过渡态补偿（在挂·CTO 终验收 §三.3）

通道修复前告警三态路由不可用，补偿三件在挂：①healthz power 字段活查（在）②COO 派工前查询纪律=GET :8713/internal/v1/power 拉模式（在·00:51 确认）③BOD 值守人工兜底（实弹验证有效）。可接受过渡态如实入卷。

## 四、同窗打包预注（排窗候并项）

- 8711 F-3+（POST 201≠会触发同源缺陷·修复候维护波）
- 8711 /shutdown 门形+鉴权门形统一（CTO S3 判据卷范围）
- 8711 ps1 链 DATA_DIR 对齐（SDE 断点移交②·候维护窗）
- 上述三项与两候选单是否并窗，候 CTO 判据卷定性后本席窗令并表裁定。

## 使用依据

- LG-064 B 族闭案卷 §八（946746cc·PENDING-RESEND 入 S3 裁定正身）+LG-069 STE 验收卷/CTO 终验收卷（403 升 S3 裁定正身）
- CTO 11:45 信（S3 判据卷预告+S3 维护波判据范围）/排工卷 dispatch-20261008.md 单 7
