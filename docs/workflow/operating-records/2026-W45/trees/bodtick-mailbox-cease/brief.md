# bod-tick 信箱副本停投 · 派工 brief（件1 写信箱段摘除·止增小单）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-bodtick-cease.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形 e56206f 现役）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD
- 令源: COS 径定采认（2026-11-04T11:02:05 信·并做采认+停投先行拆单权 CTO）+本席勘定谳（2026-11-04T11:00:29 信·消费方谱三面实证·误停风险无）
- 勘证锚: 源码=TriMetaverse/scripts/fade/bod-tick-runner.mjs L198-230（件1 写信箱段·BOD 2026-10-11 派工裁决甲）·数据面=bod-tick 658 封全投 board（未读 320+已读 338·job2 清理痕迹）·消费方谱=CAO 仅筛 cao 箱/hub-watch 系 sg 机/BOD 业务消费=tick-latest.md 文件渠道

## 一、任务面（一件·小改）

1. **摘除 bod-tick-runner.mjs 件1 写信箱段**（L198-230 节·notify-mailbox.json 投递逻辑全段）——拍报落盘段（L193 周树 tick-latest.md·job1 消费渠道正形）与 probes 面零改动。
2. 摘除位落**双锚注记**：历史裁决锚（BOD 2026-10-11 派工裁决甲·投递原立法）+停投裁语锚（CTO 勘定谳 2026-11-04T11:00:29+COS 采认 2026-11-04T11:02:05·消费方谱三面实证·副本零消费堆积）——后人可溯为什么停。
3. 摘除后 runner 语法完整性自验（node --check 或同族语法面·防摘残）。

范围划线：存量 320 封清理**不入本单**（随迁移接入 8713 重启窗同批·COS 窗序裁量）；拍报落盘/cron job 本体/healthz probes 全不动。

## 二、验收判据（本席验收）

1. 源码面 diff 勘：件1 段摘净+双锚注记在+拍报落盘段原样。
2. **止增铁证**：11:37 拍（摘除生效首拍）后读 notify-mailbox.json——bod-tick unread 计数不增（11:07 拍为摘除前末拍·多 1 封无害=321 封·11:37 拍后仍 321=止增）。
3. 拍报落盘正形不断供：11:37 拍 tick 树 tick-latest.md 照常更新（job1 渠道零影响实证）。

## 三、施工纪律

1. 写后即 commit 锁笔·Co-Authored-By·D-47 时戳铁则（卷面=commit 时戳代·信面=写前现查粘贴）。
2. 节点收口：`reports/node-fsd-bodtick-cease.md` 九键落树·收口过 node_report_check（reports/ 子目录）。
3. 时效注：next_run 11:07 拍摘除赶不上（派工窗 11:04）·目标=11:37 拍生效止增——小单足额窗·不抢拍不冒进。

## 四、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工（小改快环）→ 节点报告落树 → 收口双门 → 毕报回 m-cto → 本席验收（11:37 拍后止增读数）→ 毕报 COS 汇总回 bod（存量清理与 env 三键随迁移接入窗另行）。

—— CTO 小狄 派工（勘定谳同窗·卷面时戳以 commit 时戳为准）
