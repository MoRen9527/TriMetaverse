# hub-silent-detect 停摆诊断+复活读数卷（10-06 上午）

- 执行: m-sde（SDE 小布）；令源=BOD 10-06 09:3x 令（CEO 09:27 活性质询后查证）
- 时点: 读数现采 2026-10-06 10:06+08（date 现查锚）
- 终态: **复活核心链全绿**——store 数据零丢失、错位 daemon 已正途退、正形 31800 在役 jobs=7、补跑轮 1 已落（轮 2 候 10:20 断言续报）

## 一、诊断结论（三段）

1. **停摆范围勘正**：非 hub-silent-detect 单 job——**全部 7 job 自 10-05 ~17:44 集体停摆**。store 实锚（表名勘正=cron_jobs，非 jobs）：7 行全在、enabled 全 1、last_run 全冻在 10-05 17:30-17:43、next_run 冻在 17:44-17:45（hub-silent-detect next_run=10-05T09:45Z=17:45+08，与 BOD 实锚①尾轮 17:30 精确吻合）。
2. **错位 daemon 20140 五证据**：①GET /internal/v1/cron/jobs=[]（store-blind）②POST job 报「parameter 4 绑定错」③Session 0（19:51:43 born，19:50 机器重启后）④jedih 会话 signal0 探活=EPERM（**提权身份实锚**）⑤从未写 pidfile（正形 REQ-018 必写，13756/31800 均写）。
3. **19:50 后 watchdog 无责任**：TriMLC-Watchdog Principal=jedih/Interactive/Limited（仅登录时跑）——重启后无人登录窗 watchdog 根本没跑（非判 UP），watchdog.log 零新行由此解释。SYSTEM 假设推翻。

## 二、停 20140 过程与双缺陷勘验

| 步骤 | 结果 |
| --- | --- |
| pidfile 对验（D-03 硬门） | `~/.trimetaverse/trilc-8713.pid`=13756（10-04 陈旧死 pid）≠监听 20140 → 拒停保护生效 |
| 删陈旧 pidfile → `trilc stop`（Case B 端口兜底） | 打印「stopped via port lookup」×2 但 **20140 仍活**——假成功 |
| 缺陷勘验 | **缺陷①** `isProcessAlive`：`process.kill(pid,0)` catch-all 吞 EPERM→提权进程被误判为死；**缺陷②** `gracefulShutdown`（cli.ts L380）：不校验 HTTP 状态码（401 也算成功）；双缺陷叠加=stop 假成功链 |
| **正途停**：带 X-Internal-Token POST /shutdown | **HTTP 200 → 20140 EXITED → 8713 空**（产品自身 shutdown 门，handler=process.exit(0)；stop 脚本 401 被门挡在 handler 外） |

## 三、复活执行链

1. 护栏：watchdog 临时 Disable（防停机窗抢拉）→ 完工已恢复 Ready；store 四件套备份 `trilc-channel-backup-20261006/`（cron.db 1482752B+wal+shm+json）
2. 停 20140（§二正途）→ channel.cmd 冷启（10-04 03:07 同款 Start-Process 形）
3. **正形断言全绿**：新 pid **31800**（10:05:19，jedih 身份）；healthz **jobs=7**（错位形时=0）；pidfile 自注册=31800；channel.log/cron.db-wal/config-cache/cron.db.json（3940→3943B）全部 10:05 恢复写入
4. **补跑轮 1 落定**：probe log `2026-10-06T02:05:21Z` round start（pid 14084）→ `02:06:25Z` 全量 ledger 读数（LG-058 N2-N5 各 ok、duty-cos silent ok）。轮耗时 64s=账本 4 条 open 走逐条扫描分支（10-05 的 3ms=空账本秒退，形态差解释闭合）
5. 轮 2 候 10:20±（15min 节奏）落定后续报——BOD 令「连续两轮」断言的另一半

## 四、挂账移交项（候 CTO/FSD）

1. **缺陷三锚**：①`isProcessAlive` 吞 EPERM（pidfile.ts）②`gracefulShutdown` 不校状态码（cli.ts L380）③stop 假成功链（双缺陷叠加，对提权 daemon 完全失效）
2. **20140 拉起者考古未结**：提权身份（EPERM+Session 0）+父链 svchost→cmd(已退)→node+19:51:43 born；watchdog 已排除（Interactive 无人登录没跑）；候选=某 SYSTEM 计划任务/服务（Get-Service tri 族零命中，任务全名单仅 5 watchdog 族已查 Principal 唯此三者未深查）。**复发条件=下次机器重启无人登录窗**——根治候移交
3. 20140 store 落点未定（systemprofile 三处不存在；GET=[]+POST 绑定错的库在哪未锚）——随考古并案

## 五、使用依据

- BOD 10-06 09:3x 令（停摆诊断+复活+两轮断言+首读数回执）
- D-03 daemon 重启纪律（pidfile 权威路径/禁裸杀——本次经产品 /shutdown 门+channel.cmd 冷启，零裸杀）
- 实勘源：TriMLC src（pidfile.ts/cli.ts/app.ts 只读）、cron.db（node:sqlite readOnly）、watchdog.log 全文、计划任务 Principal（Get-ScheduledTask）
- 纪律：键值掩码（token len64 head3608 tailcee7 全值零回显）；时刻现查；先写后报
