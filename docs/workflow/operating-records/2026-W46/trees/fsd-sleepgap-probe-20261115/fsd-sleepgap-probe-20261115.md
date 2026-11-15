# FSD 宿主睡眠跃迁实勘卷（09:29 拍事件响应·首拍在位确认+冻结窗时间线+sg cf 归属）

- sourceOfTruth: 本卷（trees/fsd-sleepgap-probe-20261115/·FSD 睡眠跃迁实勘正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-15T01:40:29Z（+8=09:40:29·date 现查原值粘贴）
- 触发源: wakeup 自检循环 09:29:39+08 拍→发现宿主睡眠跃迁（LG-069 lastWakeReport）→事件响应态活体现探（非派工令·自检义务）

## §〇 · 一句话终态

**首拍 job 活体在位·enabled·next_run=今晚（周日 11-15）23:50 本地（河源 TriRMC 8710）·宿主睡眠对其零影响**——本席昨夜「首拍 23:50 硬锚（11-14）缺席」担忧=时点误读（首拍本就是周日 23:50·CTO 判读表 §一 正形「周日 11-15 23:50 cron·河源 TriRMC 8710 vB payload」·本卷勘正定谳）。

## §一 · 睡眠跃迁时间线（power 闸+execution_log 双源实勘）

| 时点（UTC） | 本地+8 | 事件 | 证据源 |
|---|---|---|---|
| 11-14T13:49:00Z | 21:49 | 本地 8713 最后正常执行批 | trilc-channel cron.db execution_log |
| 11-14T13:57:36Z | 21:57 | 宿主入睡（Adaptive Standby） | 8713 healthz lastWakeReport.sleepAt |
| ——睡眠段—— | | 本地执行零行（13:49→22:59 全空窗） | execution_log 区间扫 |
| 11-14T18:49:16Z | 02:49 | 首次唤醒（durationMs=17499984≈4.86h） | lastWakeReport.wakeAt |
| 11-14T22:59:47Z | 06:59 | tree-node-patrol 补跑启动→冻结 | execution_log 单条·duration_ms=8978586≈2.49h·「timed out after 600000ms」 |
| ——第二段睡眠—— | 07:00~09:28 大致 | 宿主再睡（粒度待 power 闸级·不深挖） | 推断面如实标注 |
| 11-15T01:28:33Z | 09:28 | 再唤醒 | lastWakeSeenAt |
| 11-15T01:29:27Z | 09:29 | 调度恢复爆发：33 条执行行/短窗·全家族跳动 | execution_log MIN(started_at)+COUNT |
| 11-15T01:30:17Z | 09:30 | bod-tick-30min 正常拍（tick 复活确认） | cron_jobs.last_run_at |

## §二 · 三 daemon 实勘读数（活体现探·禁推定遵行）

### 河源 TriRMC 8710（首拍位·通道=ssh -J M-SG R-HY·直连别名未配勘正在案）

- healthz: ok·jobCount=4·**degraded=false·consecutiveFailures=0**（7×24 零故障）
- jobs.json（/srv/fleet/TriRMC/data/cron/jobs.json·值面滤除读数）：
  - **`9c81c7ec weekly-plane-shift`：enabled=true·cron `50 23 * * 0` Asia/Shanghai·runCount=14·lastRunStatus=ok·lastRun=11-10T13:21Z·next_run=11-15T15:50Z=今晚 23:50 本地** ✓
  - rmc-orchestrate-tick / tricompany-pull / e1b2-window-reminder-patrol-8710：全 enabled·全 ok·lastRun 01:22~01:37Z 活体跳动
- 判据锚对表（锚名勘正 2026-11-15 09:4x·CTO 回执②）：jobCount=4 与**十阶段形锚卷**（值守预期形-十阶段形判据锚-20261113.md·cmd_len=2750/md5=4e1c7df5/jobCount=4·e672f3f50 换锚毕在役）对表 ✓——原卷「vB 锚」词面系 vB 旧形残留（cmd_len=1741/md5=4f990e91·托转一 R2 复原毕才换回）·jobCount=4 两形同值本卷读数零误·锚名勘正防今晚 dive 假警报（拿旧形判据对表现役形=必出「payload 被改」假警报·CTO 回执②原文）

### 本地 TriMLC 8713

- healthz: ok·uptime≈2.9d 连续·jobCount=17·cron consecutiveFailures=0·degraded=false
- **LG-069 power 闸盲态已修复**：percent=95·acOnline=true·readFailures=0（前档「连续 3 次读取失败」告警面已消）·notifyFailures=2（小观察项）
- 现役库勘定：`%LOCALAPPDATA%\trilc-channel`（launch cmd TRILC_DATA_DIR 注入·TriMLC Daemon schtask→trimlc-daemon-channel.cmd 启动器链实勘）——**非** `~LOCALAPPDATA%\trilc`（该库 jobCount=0·旧位/RLC 侧）
- cron_jobs 17 job 恢复跳动确认（bod-tick/tree-node-patrol/trimodel-l2 等全 lastRun 01:30~01:35Z）
- plane-shift-local-align job：state=failed·last_run=11-09T02:21Z error（旧观察项非今夜新债·next_run=今晚 23:10）
- **无 23:50 FADE-001 job=硬事实**（17 job 逐一过目·首拍位在河源不在本地·判读表正形对表）

### sg TriMMC 8712（通道=127.0.0.1:18710 隧道·TRIMC_INTERNAL_TOKEN 变量读入）

- healthz: ok·jobCount=16·**degraded=true·consecutiveFailures=153**
- cf=153 归属勘定：**oprec-sync-fade011 consecutiveErrors=153·lastRun=11-15T00:55Z 持续 error 中**·lastError=「git pathspec 'docs/workflow/operating-records/2026-W46/trees/fade011-ew-runs' did not m[atch]」（code 128）
- 其余 15 job 全 ok 零连败；weekly-plane-shift（sg 旧 job）enabled=false·lastRun 停 11-10 前陈旧（旧形退役态·与河源现役同名 job 区分勿混读）
- 该树**本地主检出生在**（W45+W46 trees/fade011-ew-runs 均在）——sg 侧 pathspec 错=sg 仓同步态/生成态问题（MC/值席域·非本席编码债）·BOD tick 已记「MMC cf 夜间累计+12」→本卷增补累计读数 153 持续中

## §三 · 预演拍缺席读数（对表 BOD tick 定性）

- BOD tick 今晨已定性「预演未执行(正形)」（XCIX 卷·断联恢复晨起盘点）——本席实勘对表一致：预演拍原计划「00:00 后候 CEO 通知锁定」，睡眠段通知面与值守面动作未发生（本 session NOTIFY 流最末=r65 11-14T18:14Z·睡眠段零新投递——落箱段缺口家族可能·sg 值席昨晚值守窗活动未见回执信）
- 预演缺席对首拍 readiness 的影响=CTO/COS 裁决域·本席零推定只供读数：河源链 14 次历史 run 全 ok（runCount=14·lastRunStatus=ok）+d 施工 γ 三笔已推讫 sg 通道（ls-remote 验真 51cff18d）+R-HY tricompany-pull 每 15min 自动同步 TC 仓（在役跳动中）——链供给侧读数齐

## §四 · D-46 值面疏漏如实载（识别即标记）

- **疏**：实勘链中 `cat trimlc-daemon-channel.cmd` 全文输出使 TRIMC/TRILC INTERNAL_TOKEN 值面进本 session transcript（打印路径违规·「回显即自曝」族实锚候定性）
- 缓解与后续：值面零复现于本卷/commit 面/信面（本卷即零复现自证）；后续全部探针 token 一律 sed 变量读入+`len=${#TOKEN}` 侧证（已执行）；**TRILC_INTERNAL_TOKEN 后置 set 覆盖前置值=launcher 内双 token 并存形态**（TRIMC_*=sg 8712 面息·TRILC_*=8713 自身面息）勘正在案
- 偿还计划：launcher 读法勘正为逐键 sed 抽取（本卷 §二已用）·值面轮换属 CTO/MC 域候裁不擅动

## §五 · 实现决策三分法

- **READY_FOR_REVIEW**：实勘毕·三 daemon 读数齐·首拍在位确认·零阻塞零代码触（纯读数卷）
- 候窗面：今晚 23:50 首拍在位候窗（毕报 §五 承诺续守）·预演拍候 CEO 通知锁定（通知未至·零先手）
- 升级面：无（sg oprec-sync cf=153 属 MC 域持续观察项·BOD tick 在账·本卷供读数不代裁）

## 使用依据

- CTO 首拍预期态知情件 v2（cto-firstshot-expected-state-brief-20261114.md §一 首拍位正形·§三判读表·vB jobCount=4 锚）
- 三 daemon healthz/jobs.json/cron.db 活体现探读数（本卷 §二·时点逐条 sourceOfTruth 在行）
- 本席 d 施工毕报卷+升锚卷（同树·γ 三笔 51cff18d sg 通道验真）
- BOD tick W46 今晨卷（XCIX 断联恢复盘点·预演未执行定性）
- 记忆锚族：daemon 机位矩阵/活体优先诊断法/拓扑断言禁推定/D-46 值面零回显/fade011 手动运行=CEO 通道（本卷零手动触发遵行）

—— FSD 小全（m-fsd）·2026-11-15T01:40:29Z（+8=09:40:29·date 现查原值·D-47 正形）
—— 勘正落款（锚名②·CTO 回执对表）：FSD 小全·写前现查 2026-11-15T01:44:56Z（+8=09:44:56·date 现查原值·D-47 正形）
