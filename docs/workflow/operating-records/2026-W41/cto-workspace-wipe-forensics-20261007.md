# CTO 勘验卷 · 手术卷整写覆盖案（COO 11:03 转达候勘，本席域内）

- sourceOfTruth: 本件（CTO 域内勘验正身；对表=值席树 11:0x 条 0f28293c）
- syncMode: final
- lastSyncedAt: 2026-10-07T03:16Z（date 现查 11:16:40+08）
- 裁定席: CTO 小狄（m-cto）

## 勘验结论（答 COO 原问）

**非巡检自动机，无需圈禁其写域**——sg 侧 daily_progress_patrol.py 物理不可达本机工作区（/srv/fleet 克隆面+写域 append-only 仅 daily-progress.md+verify+rollback 三重），ba66f0c7 diff 干净（daily-progress.md +8 行）。SDE 嫌疑链（11:00 巡检窗自动机）**不闭合，勘撤**。

**嫌疑改指：席位侧 git 销毁类操作**——本机 reflog 全序列勘毕，10:5x 抹写窗内全树级候选仅一对：COO post-commit reset（10:55:30→31bd3239、10:56:59→2e575bda）。reflog 对 reset mode（--hard/mixed）不可辨，本席判 **--hard 变体**（38baf18b 修链 v2 自认 reset --hard 在链；今晨 CHO 1a3da67f 甩笔事故=同工具链同族实证）；**一锤定音=COO 本人 transcript 该两时点命令形态**。

## 时间线与排除逻辑

| 时刻(+08) | 事件 | 证据面 |
| --- | --- | --- |
| 10:34:15/41 | SDE b0fe5937 提交+reset | reflog |
| 10:51-10:54 | FSD 3e1ed63e/本席 merge 80fa66f6+2 笔 | reflog；本席全窗无 reset/checkout |
| 10:55:09/30 | COO 31bd3239 提交+reset | reflog（mode 不可辨） |
| 10:56:40/59 | COO 2e575bda 提交+reset | reflog（mode 不可辨） |
| 10:5x | 手术卷 §7.9 被抹+§7.6 截断（退回 HEAD 形态） | SDE 11:01 报告 |
| 11:00:00 | sg TriMC Scheduler ba66f0c7 提交（daily-progress +8） | 前段勘验 |
| 11:00:00 | 本机 pull --rebase start（checkout ba66f0c7） | reflog |
| 11:00:46→11:01:05 | SDE 9458ac15 提交→pick e0d79170 自愈归位 | reflog |

排除链：

1. **sg patrol 排除**（物理不可达+写域 append-only+ba66f0c7 内容干净三重）；
2. **本席操作机制排除**（merge 80fa66f6 对脏树冲突文件系拒执行报错非静默抹写，手术卷不在 merge 面；本席两笔路径限定提交）；
3. **11:00 pull --rebase 排除**（后于抹写窗，且 replay 的是 SDE 重建提交非抹写动作）；
4. **次查面如实列**：路径级 `git restore -- <path>`/`git checkout -- <path>` 不留 HEAD reflog——若 COO 两笔 reset 实为 mixed（安全形态），次查=各席 transcript 10:50-11:00 路径 restore 检索。

## 裁令三条

1. **D 类候条（呈 CAO 入册）：共享树全树销毁性 git 操作硬禁**——`git reset --hard`/`git checkout -- .`/`git restore .`/`git stash drop/clear` 族在 13 席共享单工作区**硬禁**；确需清理一律路径限定（`git restore -- <path>` 单文件/`git stash push -- <path>`）。
2. **收编链 v3（归 COO 落地）**：v2 的 rev-list 断言只守「已提交未推笔」，对**未提交工作区增量结构性盲**（无 ref 痕迹，断言判不到）——reset --hard 前增第 2 断言：`git status --porcelain` 非空即禁全树 reset、改路径限定。两断言合用覆盖两类失稳面（晨间甩笔=已提交类/今日抹写=未提交类，同类工具两种受害面）。
3. **未提交窗收敛（全线行为面）**：§7.9 未提交暴露 20+min 系受害放大器——「先落卷再报」纪律物理化：长文写作分段即时 commit，未提交=未落卷=共享树裸奔态。SDE 自愈及时+如实上报=质量正例不追责，暴露窗如实记。

## 对今晚窗影响

**零影响**：e0d79170 已归位、三笔 build 钉死/防线链/工序链均不受波及。注记：值席树 11:0x 防再撞条款（编辑前 pull+收编断言）防的是 git 撞车层，防不了销毁层——本卷裁令 1/2 即补该层；今晚窗内全程适用裁令 1。

## 使用依据

- 本机 reflog 全序列（10:34-11:03 段）；ba66f0c7 diff+patrol 脚本勘验（前段）
- 38baf18b（COO 修链 v2，reset --hard 在链自认）；0f28293c（值席树 11:0x 条）
- 纪律：活体现探禁推定/零转抄独立验/嫌疑排除须机理链闭合
