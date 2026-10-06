# TriMMC 与 TriMLC cron addJob 行为分野

TriMMC 8710（sg M 面）：addJob 写 store 后 `executor.tick()` 即时入调度，nextRunAtMs 挂载即排——**即生效型**，零白名单零重启（COS 2026-09-30 实勘：src/cron+dist/src/cron 十文件零 ALLOWLIST/not_allowed 命中；routes 仅 command/cwd 必填校验；command-handler=确定性 spawn bash -e -c 无命令 gate）。job id e7a37e66（守望 sg 版 300s 轮）挂载即跑实锤。

TriMLC 8713（本机 M 面）：**F-3 缺陷**——store.ts L218 addJob INSERT 缺 next_run_at 列→API 直插新 job 永不调度（timer L93 enabled&&nextRunAt 永假）。修复批 09-30 即刻窗 FSD 执行中。
**【09-30 20:2x 勘正观察：F-3 现役不复现】**——二窗磁盘 cmd 冷起（pid 41872，20:14）后 CTO 验收独立实锚：POST 新建 hub-silent-detect（cron_muo2mj6s_cco2）nextRunAt 正常排（12:30Z）+双 patrol PATCH 后调度节律推进（60s/300s 档 lastRunStatus=ok 连跑）——在役版本 INSERT→调度链无「永不调度」行为，F-3 或已随修复批闭/或仅旧进程版本存在。FSD 修 TriMLC 缺陷时以本实锚对表现势，勿按 F-3 旧断言套现役。

TriRLC 8711（R 面）：cronCommandHttpAllowed=TRILC_CRON_COMMAND_ALLOWLIST 精确等值白名单（app.ts L246，见 trilc-cron-command-allowlist-exact-match 条）。

**推论**：三 daemon cron 行为两两不同（即生效/缺列缺陷/白名单拦截）——判 daemon cron 变更窗先分清 TriMMC/TriMLC/TriRLC 三形态，勿互套。修 TriMLC F-3 时对表 TriMMC 正形（tick 即时入调度）作旁证。

**degraded 语义分野（LG-064 2026-10-05 实勘增补，同族勿互套）**：TriMMC/TriRMC degraded=**per-job max(consecutiveErrors)≥3**（单 job 连败可见，掩蔽面零）；TriMLC=**全局单计数器，任一 job ok 即清零**（单 job 连败被健康 job 掩蔽，8 连败实验实证 degraded 恒 false，真源=TriMetaverse liveness-rules-20261005.md §二.4）——TriMLC 降级面仅可捕全 job 连败态，单 job 故障靠 store 精判补偿。修 TriMLC degraded 对表 TriMMC per-job max 正形作旁证（候办 P2 维护窗）。

**TriMMC executor「调度活执行停」家族性缺陷（2026-10-05 立）**：nextRunAtMs 持续滚动+零新日志+延迟自愈（10-01 TriRMC R-HY 停摆/10-02 TriMMC sg job ae02593a 停 68.8h，两形态同签名=家族性强信号）——nextRun 滚动不可单独作活信号，心跳判据以 lastRun 执行事实为主。根因静态勘=CTO 车道候窗，修复走独立变更窗。

**TriMLC cronEngine「完成链断裂」daemon 级缺陷（10-06 8713 考古立，cron 形态第三签名）**：完成路径丢失（spawn error 事件未处理/boot 补跑洪峰竞态嫌疑）→state=running 泄漏+引擎互斥永不重触发（execution_log 末条冻断点、他 job 写入正常=非 schema 面；实证=l2-scan 补跑轮 triggered 后永卡）。签名=**nextRun 冻结+不自愈**，与 TriMMC executor 家族（nextRun 滚动+零日志+自愈）、TriMLC F-3（缺列永不调度）三形态三签名勿互套。业务影响可以≈零但引擎级普适=任何 command 型 job 撞上即永停；boot 恢复清扫（陈旧 running→idle 开机归位）+spawn error 归位入 FSD 修复 scope（2026-10-06 方案门核增，SDE 考古卷缺陷件④）。

**watchdog 判活盲区与拉起链错位（10-06 8713 案）**：TriMLC-Watchdog 仅 healthz 200 即判活+revive 无自验→store-blind 假活（healthz 绿+pidfile 零写+store-blind 三签名）可骗 watchdog 与 L1 双面 16h；且存在**非 watchdog 竞争拉起者**（23980 无重启窗顶 port 未破案，watchdog 17:47 revive 正形产物 13756 有先例=拉起者另有其人）。治法三件套=判活 healthz+pidfile 对验+store jobCount 抽验、revive 后 90s 自验、无人登录守卫（判态不可判=fail-closed 不拉起，红线「宁可不拉不可拉错」）。channel.cmd env pin 补全（TRILC_DATA_DIR 字面路径+USERPROFILE）=store 落点漂移防线。

