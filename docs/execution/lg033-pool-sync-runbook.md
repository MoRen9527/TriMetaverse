# LG-033 蓄水池同步 runbook（正身）

- sourceOfTruth: TriMetaverse/docs/execution/lg033-pool-sync-runbook.md
- syncMode: source-only｜lastSyncedAt: 2026-09-09
- 性质：**正身已转录**（值班位产草案落分区 E-0004/E-0005〔sg 侧 escalation-log.md，gitignored〕，COS 面审通过转录入仓——E-0003 值表→提案 §十二 同款模式；LG-033 终裁增补第 5 条候办件清账）
- 产出链：BOD 填池令 2026-09-09 → 树 pool-sync-runbook（FADE-006 契约）→ 值班 COS 拾取执行（PSR-1 勘验 69b77b04／PSR-2 草案 38d84797→E-0004／PSR-3 实跑 bfad5ae1→E-0005）
- **COS 面审结论（2026-09-09）：通过，零修订采纳**——四段全部锚定实测值（hook reflog/gitignore:18/SHA 三步实跑），冲突规程与 FADE-006 护栏相合（禁 force/merge-only/禁跨 hub rebase 已推提交），P3 未定项如实标注未拍脑；E-0005 实跑反哺的「ahead/分叉二分判据」已按其去向条款并入 §3（细化取代原粗粒度表述）。

## §1 三端 push/pull 频率建议表（现状/P3 目标两栏）

| 方向 | 现状（2026-09-09 实测） | P3 目标态 |
|---|---|---|
| 交互位→sg 裸仓 | 触发式：CEO 侧 commit 后 push origin | 同现状（触发式为主）+watcher 事件唤醒补充 |
| 裸仓→sg 工作仓 | 触发式：post-receive hook fetch+rebase（秒级随 dev 更新；失败只记 skipped 线不阻塞） | 同现状+skipped 线入值表监测（对象 4 心跳面） |
| 裸仓→GitHub 镜像 | 触发式：hook 异步 push（60s 超时；FAILED=non-blocking 记日志） | 同现状+连续 ≥3 周期失败转真件（E-0001 线；巡检脚本第四对象化=POE-1 在办） |
| GitHub→任意端（读） | 匿名 ls-remote 可达 | API 对账入晨检①周期档 |
| 蓄水池分区（.fade/） | **不同步**（gitignore 机器本地；正源=CEO 本地终端，sg 侧仅本分区） | 主备标记+re-baseline+三端同步（§4 接口预留） |
| 值位巡检产物 | 机器本地 `/home/fleet/.trilc/`（cron */30 实跑在位） | 入池/入仓形态候交互位裁 |

## §2 冲突处置规程（四条）

1. **ff-only 优先**：工作仓同步链（hook fetch+rebase）遇脏树/冲突即 abort 记 `pull/rebase skipped` 线（现状 hook 内建，实测零出现）——禁手工强推同步。
2. **abort 上报**：skipped 线出现=工作树脏/冲突信号→值位记录+交互位处置；连续出现按值表升级线走。
3. **禁 force 推送**：三端任何向（裸仓/GitHub/工作仓）不 force；SHA 需重写=交互位裁决+全端通告后方可。
4. **双向修改冲突**：merge-only 归账（FADE-006 护栏：禁跨 hub rebase 已推提交；工作仓 rebase 仅限本地未推提交=现状 hook 语义）；已推双向冲突=人工裁决升级线：值位记本分区→裁点③路径（TriMLC 写池+push）唤醒交互位。

## §3 幂等校验法（SHA 对账三步法，晨检①同款口径；含 E-0005 实跑细化）

- 步1 工作仓：`git -C /srv/fleet/TriMetaverse rev-parse dev`
- 步2 裸仓：`git -C /srv/git/TriMetaverse.git rev-parse dev`（等价 `git ls-remote origin refs/heads/dev`）
- 步3 GitHub：`git ls-remote github refs/heads/dev`（匿名读实测可达；API 同值）
- 判据（E-0005 细化版）：
  - 三值同 SHA=齐平幂等成立。
  - 工作仓≠裸仓须**二分**：①**ahead**（裸仓 SHA 为工作仓祖先，`merge-base --is-ancestor` 判）=在途未推常态，处置=push 归一后复跑；②**分叉**（非祖先互斥）=同步链真降级，处置=查 hook `pull/rebase skipped` 线+§2 规程。
  - 裸仓≠GitHub=mirror 滞后（单次自愈线内观察，≥3 周期升级）。
  - 任一命令失败=可达性缺口记注（网络策略面如实标）。
- 频率建议：值位巡检周期挂跑（*/30 cron 已在位）；P3 入 watcher 事件档。

## §4 P3 主备标记轮换接口预留（语义预留，语法候 P3 规格定稿）

- **轮换谁推谁拉**：主标记方持台账写权（push 源），备方只读（pull）；轮换序=旧主推终笔（含主备标记翻转行）→新主 §3 三步法确认齐平→方开写。
- **交接冻结窗**：终笔推送到新主确认齐平之间双端均不写台账面；升级日志分区=各机本地独立写区，不受冻结约束（sg 侧唯一写区独立性保持）。
- **接口形态预留**：主备标记建议落台账头行（ledger-mirror.md 元信息行）；re-baseline=全分区快照哈希入终笔（Merkle 思路，同 FADE-006 卷封制）。
- **未定项如实标注**：标记语法/轮换触发判据（人工令 vs 自动故障转移）候 P3 定稿，本正身不定。

## 附：实证锚与来源

- PSR-1 勘验读数（2026-09-09 17:21-17:24 +08 全实测）：接线 origin=/srv/git/TriMetaverse.git+github 镜像；hook reflog 17:10:51 实证零 skipped；mirror push 60s 超时（历史 FAILED 8 笔全次周期自愈）；`.gitignore:18 .fade/`。
- PSR-3 实跑（E-0005）：push 前三端 38d84797≠52ec500f（ahead 判定）→push 后三端齐平 bfad5ae1 幂等成立；hook 线 tick dispatched 09:26:54Z+github mirror pushed 09:26:57Z。
- 分区源：E-0004/E-0005（sg 侧 escalation-log.md）；署名=值班位试点 provisional（转正随双 COS 定名重建批）。
