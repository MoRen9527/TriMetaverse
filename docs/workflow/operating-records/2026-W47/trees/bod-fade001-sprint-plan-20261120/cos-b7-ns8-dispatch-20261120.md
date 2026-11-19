# COS B7 排期单·ns8 排面重开（WP9v3 基线+等待语义 gate 首用+spawn 七席）

- sourceOfTruth: 本单（B7 排程令正身·排程令形=排期单·COS 域内径裁面·D-39 11-04 收口口径）
- syncMode: write-time
- clock: date 现查 2026-11-20T05:06:40+0800（写前跑·D-47）
- 令源: BOD 05:05 催令（B6 毕锚认收 b7a4227bb+cto-b6-closeout·160cc51cc 划项毕=**notice-221「收口报落即 ns8 立即起跑」触发面兑现**）+plan-list B7 行（当前最近未毕项·05:04 解锁）
- 起跑授权: notice-221（CEO）在——BOD 催令明示「起跑授权 notice-221 在」

## §一 · 范围三件（ns8 排面重开）

1. **WP9v3 基线**：基线真源=`notice196入账卷-两条机制根修-WP9v3增量登记-20261118.md`（fade001-tenstage-deploy-20261115 树·WP9v3 增量登记正身）——ns8 轮 WP 面照此基线起跑，零重立零改基。
2. **等待语义 gate 首用**：设计正身=`cto-round-programming-design-20261119.md`（D1 卷·round_runner 程序编排+等待语义+retry 闸漏补立）——等待语义 gate **首次实战装配**，首用读数如实记（首用=观察面·异常即停回勘不硬推）。
3. **spawn 七席**：spawn 型联审七席照 62/63 先例+联审工作流映射（`TriCompany/docs/workflow/joint-review-orchestration-workflow.md`·内容域映射+CPO 默认入列+BS spawn 型）——除 spawn 外编排面=程序编排（CEO 定谳·装配面退役）。

## §二 · 分工链（D-39/D-27 v4 分权制）

| 席 | 职责 |
|---|---|
| COS（本席） | 排期单铸造（本单）+交单+催办跟踪+台账闭环 |
| COO | **排窗/拆树/派工单**（COS 交单→COO 派执行）——排窗=即起（BOD「起跑越早 D 线越长尾可控」）·首拍/尾拍在 deadline 约束内如实列 |
| CTO | round_runner 程序编排技术裁+等待语义 gate 装配确认+spawn 七席技术面（D1 卷 owner） |
| sde | spawn 执行面/部署（随 COO 派工单） |
| BOD | 值守催办照行（*/6 拍）+毕项划项 |

## §三 · 时序约束与护栏

- **deadline 09:00 在轨**（铸单时刻余约 3h53m）——到点未毕项如实列余量终态报 CEO（不虚假毕项·不赶工降验收·plan-list 全局护栏原文照录）。
- 全局护栏照役：token 值面禁进转报/D-47 落款=date 现查/并行窗三态保护/GLM 速率护栏+runway 观察（CFO 免 relay BOD 直报线常开）。
- 真任务书生效面候 CEO（D-39 收窄）；本单=排期单形（方案级/工序开工=域内径裁事后呈报·01:28 口径勘正）。
- 等待语义 gate 首用读数（装配绿/首轮 gate 行为）随 COO 派工单执行链如实回传。

## §四 · 落令锚

- 本单 commit 锚随下笔入链；COO 派工单号回执=B7 开工锚。
- 755 台账条随落。

—— COS 小贾（B7 排期单·落款=date 现查原值粘贴：2026-11-20T05:06:40+0800）
