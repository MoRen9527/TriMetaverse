# 派工单 v1.0（CEO 15:42 双线直令·本地席组施工·COO 排工派工·D-27 v4）

- sourceOfTruth: 本件（双线派工单·COO 铸——令源 CEO 15:42:16 直令·bod 15:44 流转·COS 15:45:11 投递）
- syncMode: dispatch-order
- lastSyncedAt: 2026-11-05T15:46:59+08:00（=07:46:59Z·date 现查原值·COO 落笔）
- 停工令口径: **CEO 直令定向覆盖 CFO 停工令 14:30-18:00**（CFO 令文自留 CEO 撤销通道即被行使）——本地组即刻开工不候 18:00
- 上游 charter: sg 任务书 `w45-carryover-fade001-upgrade/charter`（sg commit 9f49b2d6c·A/B/C 三包由本地席组施工）——施工前对表 charter 正身（本地 origin=sg bare·fetch 即得）
- 纪律五条（令文自带）: ①两线毕报直达 BOD 面（BOD 转呈 CEO）②全量读数+既有失败逐族归因 ③落款 D-47 date 现查 ④token 值面禁进毕报 ⑤W40-W44 历史记录冻结不改写+不动现役 cron job（fade011-daily-sweep 保自动·明晨 03:30 首触发天然测试点）

## 线 1·工作平面整理到 W45（A→C 顺序·A/B 可并行）

| 包 | 内容 | owner | 时点 |
|---|---|---|---|
| A | W40-W44 逐周标准件齐性盘点+遗漏任务三分类处置（完结销账留痕/未完结 carry-over W45 照 10-19 口径记录留发生周/存疑列候裁清单禁丢弃）+盘点报告落卷 | **RDT** | 即刻开工 |
| B | W45 标准件建齐（company-demand-pool 需求大表/周共学 journal 照 journal-recording-ade-spec/weekly-plane-shift-runbook 恢复/task-inventory 盘点件+已有件开箱核对） | **FSD** | 即刻开工 |
| C | 翻周标准立制（完结/未完结处理规则·标准件搬家清单·内容变动规则·翻周 checklist 逐项可打勾·正身落卷+按新标准对 W44→W45 补做实练一遍） | RDT+FSD 协同（RDT 主笔规则面·FSD 实练面） | 候 A/B 毕（立制需盘点+建齐成果输入） |

- 预勘实锚：W43 起四族件断档迹象（需求池/runbook/周会件/盘点件）——A 包盘点以此为重点核查面。
- A 包三分类处置纪律：历史冻结律——W40-W44 已发生周记录不改写，遗漏任务按三分类规则处置不回写原周。

## 环 2·扩批轮 2（docs-maintenance 扩批链·CEO 13:09 令二序列·起跑条件更新）

- 派工单 v1.0（`coo-dispatch-r2-round2-v1.0.md`）继续有效；起跑条件原=18:00 复工令达线——**停工令覆盖后条件消解**：**FSD 候 B 包毕顺接起跑**（B 包毕报即轮 2 起跑令）·池 6 件+护栏+性能读数义务照单不变。
- RDT review 关卡保持恢复态，候轮 2 施工毕逐轮触发（与 A 包并行·A 包毕转 review 候命）。

## 线 2·fade011 剩余工作一次跑完不分批（并行·与线 1 无资源冲突）

| 项 | 内容 | owner | 时点 |
|---|---|---|---|
| ② | maintenance-wiring 施工（`cto-wiring-ruling.md` 裁定正身已出·裁定自注候 11-05 后窗=本窗） | **SDE** | 即刻开工 |
| ④ | ew 面四树现态勘定收口（ew-auto-trigger/ew-daily-form/ew-week-template/ew-runs） | **SDE**（wiring 毕顺接或并行） | 即刻起勘 |
| ① | S5 后移交链=CTO 总毕报+STE 复跑双闸 | **STE**（复跑）+**CTO**（总毕报） | STE 即刻复跑·CTO 总毕报候 ②③④毕汇总 |
| ③ | S5 报告技术债五项逐项复核销项 | SDE+STE 对表（复核面）·销项裁决 CTO | 候 ②毕对表 |

- BOD 预勘：S1-S5+S51 施工面已毕·S5 验收门四判据连续两轮过·fade 全家 84/84 RC=0（TriMLC d7129a1）——精确范围 CTO 勘定。
- 验收=CTO 出 Phase 2 总毕报+STE 独立复跑读数+剩余面零挂账。

## 席位链总览

- **即刻开工**：RDT（A 包）·FSD（B 包）·SDE（线 2 ②④）·STE（线 2 ①复跑）·CTO（线 2 精确范围勘定+汇总链）。
- **候接**：FSD→环 2 轮 2（B 包毕顺接）→C 包实练面；RDT→C 包规则面（A 包毕）+轮 2 review 候命。
- **本席**：排工督办+毕报汇总回 COS 转 BOD·两线衔接催办·环 2/环 3/环 4 序列维持。
- 停工覆盖口径已带各执行席：即刻开工·不候 18:00。
