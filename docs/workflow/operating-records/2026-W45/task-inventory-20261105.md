# 任务进度总表（W45·现役真身·原地滚动刷新）

> **〔查看位约束（照 CEO 2026-10-03 令适用）〕本件=W45 任务进度总表现役真身，随日收口批原地滚动刷新；文件名周内不动（CEO 查看位稳定）；历史版溯 git 历史。**
> **〔立表注（W45 标准件补齐批 2026-11-05）〕盘点件族 W42 后断档（W43/W44 实勘零此件·翻周迁移器缺口同族）——本件=B 包补课新立（任务书 `trees/w45-carryover-local-execution/coo-dispatch-dual-line-v1.0.md` 包 B·charter `trees/w45-carryover-fade001-upgrade/charter-w45-carryover-fade001-upgrade.md`）。立表口径：本表只立 W45 现役在办/新毕行；W40-W44 历史在途行的盘点与三分类处置（完结销账/未完结 carry-over/存疑候裁）=**A 包盘点报告面（RDT 主笔·在办）**——报告落卷后其未完结 carry-over 行按 2026-10-19 口径补刷入本表（吸收节候补·见 §三）。

- sourceOfTruth: 本件（FSD 铸立·原地滚动刷新；令源=CEO 2026-11-05 15:42:16 双线直令·COO 双线派工单 v1.0；形制=七列大表常驻纪律——首列不省·归堆/摘要视图只准附后）
- syncMode: rolling（现役真身位——随日收口批原地滚动刷新·文件名周内不动）
- 七列全表头一列不省（09-24 走样修正令恪守）；逐单亲勘禁转抄；三态纪律（销=锚/毕候验=候谁/在途=清尾窗+死线，禁裸否）
- lastSyncedAt: 2026-11-05T07:54:51Z（date 现查原值·B 包建齐批首刷）

## 一、七列大表（W45 现役行）

| 任务书（LG号+名） | 树 id | 大白话简述 | 树任务链 | 当前进度节点 | 派发时间 | 是否完成 |
|---|---|---|---|---|---|---|
| source_publish_check 升 gate 形（CEO 裁③·六要件） | source-publish-gate-ruling（W45） | 发布闸门施工：默认拦截发布面漂移防丢稿 | CEO 裁③→CTO 施工令→FSD 施工→CTO 审查→STE 复跑 | 三道验证闭环：TC 7f55fe4+TMV 65e675fde 锁笔（11-05 14:05）→CTO APPROVE（f29e7d855 裁定卷）→STE PASS（TC a4b7894 验证卷） | 11-05 03:39（CTO 施工令） | 毕（已验：CTO 审查+STE 独立复跑双闸过·死线提前 ~19h） |
| W45 双线派工（线 1 A/B/C 包+线 2 fade011 剩余） | w45-carryover-local-execution（W45）+sg 侧 w45-carryover-fade001-upgrade | 周平面整理到 W45+fade011 收尾，本地与 sg 两线并行 | CEO 15:42 直令→COO 双线派工单 v1.0→A=RDT/B=FSD/C=RDT+FSD·线 2=SDE/STE/CTO | B 包（本席）在建齐批；A 包 RDT 在办；线 2 SDE wiring/ew 勘定在办·STE 复跑在办 | 11-05 15:42（CEO 直令） | 在途（清尾窗=B 包毕报即环 2 起跑令·死线面=charter 施工窗 18:00 起一次跑完——停工令被 CEO 15:42 覆盖行使即刻开工） |
| 环 2 扩批轮 2（docs-maintenance 扩批链·轮 2 池 6 件） | docs-maintenance-expansion（W45） | 文档维护扩批第二批：W11/W12/W13/W14+README:27 等 6 件 | CEO 13:09 令二序列→COO 派工单 r2-round2-v1.0→FSD 施工→RDT review 关卡 | 候起跑（起跑条件=B 包毕顺接·派工单+护栏四条+性能读数义务已备妥） | 11-04 13:09（CEO 令） | 在途（候起跑·非卡死——B 包毕报即起跑令） |
| LG-092 铂 8713 fade011 自动 job 勘修 | （候裁挂号面·无施工树） | 8713 fade011 保自动·手动运行=CEO/人工通道 | CEO 候裁挂号→COS 台账 L 系挂账 | 候裁在挂（席位勿代办·POST /run 亦属手动面——FSD 施工中未触碰该 job 照守） | 11-05 前候裁挂号 | 在途（候裁面·候 CEO 裁） |

## 二、行锚与纪律注

- gate 行锚：毕报卷 `trees/source-publish-gate-ruling/fsd-gate-closure.md`+裁定卷 `trees/source-publish-gate-ruling/cto-review-verdict.md`（TMV f29e7d855）+STE 验证卷（TC a4b7894）。
- 双线行锚：派工单正身 `trees/w45-carryover-local-execution/coo-dispatch-dual-line-v1.0.md`；上游 charter=sg 任务书 9f49b2d6c（face=M-SG·A/B/C 本地席组施工系 CEO 15:42 直令改派·sg 勘注 cb9528e3b）。
- 包 D（FADE-001 十段升档）face=M-SG 照常（本地派工单未派 D）——不入本表现役行，sg 侧任务书面收口。
- 历史冻结律：W40-W44 行不回写不搬行——在途行处置候 A 包盘点报告三分类账。

## 三、吸收节（候包 A 盘点报告落卷补）

（空——A 包报告落卷后：其未完结行按 carry-over 口径补刷入 §一·存疑行列 §四 候裁清单·完结行销账留痕不搬行只在 §二 注锚。）

## 四、存疑候裁清单（禁丢弃）

（空——A 包三分类处置产出后随批录入。）
