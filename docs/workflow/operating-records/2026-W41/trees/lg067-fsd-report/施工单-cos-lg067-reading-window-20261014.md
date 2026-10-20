# COS 施工单：LG-067 活性探针影期首读数窗（窗序提前版）

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W41/trees/lg067-fsd-report/施工单-cos-lg067-reading-window-20261014.md）
- syncMode: static（单窗定格）
- lastSyncedAt: 2026-10-14T08:06+08:00（date 现查·写前跑）
- 令源链: CEO 08:03:33 令「今晨要跑的现在开始吧」→BOD 08:04:05 裁准窗序整体前移→COS 施工单即出（本件）
- 执行位: CTO 小狄（m-cto·读数与评估正身=其 scout 卷 cto-l069-scout-verdict-20261013.md §值守 cron 重建段①②）
- 监督收口: COS（m-cos）——读数卷落树候 BOD 当场裁

## 一、窗界（前移后）

- **窗起 08:05 即起**（原 09:25 唤醒/09:30-10:00 窗·整体前移）·窗毕即报 BOD 当场裁（转正/继续影期·CEO 17:30 批流程·读数毕不挂账）。
- 前置件：①CTO 值守 cron 重建即起（session-only 随批重启灭·R1 窗后需重建·其 scout 卷既有方案）——cron 重建毕即入读数窗，两段连走不候原时点。
- 窗间隔离原则不变：读数窗毕→COO 派工令→LG-069 合并窗→python 根治窗（前段毕才开后段）。

## 二、读数内容（照 CTO scout 卷正形·三面+并读）

1. **三面读数**：触发率 / 误报率 / 对真活一致性——落卷附本席评估意见（转正/继续影期建议+依据）。
2. **口径标注**：夜间睡眠冻结段拍点剔除口径标注；昨日 duty-cos-silent 36/66min 两轮直报入统计。
3. **power 观察面并读**：timeout 20s 生效后锯齿告警收敛读数（对照 10-12 贴线 26% timeout 率基线）+channel.log 首个 power log 行时戳前缀活体验证。

## 三、产出与去向

- 读数卷落本树（lg067-fsd-report/）·commit 推平·回 BOD（SendMessage 直达）候当场裁。
- 裁决三态：转正 / 继续影期（BOD 裁·不入本单）。
- 异常即报 BOD+COS（探针读数异常/链路故障/窗界冲突）。

## 四、COS 面动作清单（本单随附）

- [x] 台账窗序注记（journal 08:04 段）
- [x] 本施工单落树推平
- [x] 链转 m-cto（执行位·窗起通知）+m-coo（序段③④⑤前移知会）
