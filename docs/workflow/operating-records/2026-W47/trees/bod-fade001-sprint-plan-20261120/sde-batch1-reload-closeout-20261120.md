# SDE 批 1 装载毕报+A 段 keeper 复绿+批 2③ cleanup 验真跑收口卷（WO-RW1·CTO D-15 派令执行·一卷三段）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/sde-batch1-reload-closeout-20261120.md·批 1 装载+A 段 keeper+cleanup 三段毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=CTO D-15 批 1 重启窗派令（复验卷 5cda4e0ef APPROVE·8361196 装载）+COS 径裁分支 A 即启令（keeper 恢复）+COS 准令 weekly-plane-shift 深勘（候顺手窗·本卷不含）+WO-RW1 §六 开工激活令（cba2079bc）
- 判定: **批 1=毕（8361196 dist 装载·pid 三证 35576·值面探针三断言全绿·watchdog Ready·mc_link/trimc connected 复绿）·A 段=毕（keeper 31076+隧道 36500·双锚全绿·观察窗持续）·批 2③ cleanup 验真跑=毕（token 文件供给面一次过·29 件 ok=29 失败=0）——重启毕即报=批 2 全解锁信号随发**

## §一 · A 段 keeper 分支 A 复绿（COS 径裁令·先于批 1 执行）

| 步 | 动作 | 读数 | 判 |
|---|---|---|---|
| 1 | 预检防双跑 | 18710 零 LISTEN+keeper 零活进程（17028 已亡）=无双跑条件 | ✓ |
| 2 | keeper 拉起 | `wscript tunnel-keeper.vbs`（D-29 无窗形）→keeper pid **31076** | ✓ |
| 3 | keeper 探测链 | tunnel.log 新链四行：keeper start(02:37:30Z)→tunnel dead(02:37:33Z)→respawning ssh(02:37:33Z)→**tunnel alive (http 401)(02:38:44Z)**——自愈链整链走毕 | ✓ |
| 4 | 隧道进程 | ssh 隧道 pid **36500**（`ssh -N -L 18710:127.0.0.1:8712 fleet@47.245.122.61` 形）·18710 **LISTENING 双栈**在位 | ✓ |
| 5 | 完工判据双锚 | ①18710 监听在位 ✓ ②TriMLC healthz mc_link/trimc **degraded→connected 复绿**（值面探针非启动纸面绿·COS 令语义兑现） | ✓ |

- 观察义务承录（COS 令附加）：keeper 心跳 60s 拍持续监视中——**若再死=看护缺口实证·即报 COS 升级 CTO 域勘看护机制面**（拉起后至卷面时戳零再死）。
- 值席常驻零触碰（MMC 8712 零涉·本面仅 18710 隧道链恢复）✓。

## §二 · 批 1 TriMLC 8361196 装载重启窗（DCE 步序·CTO D-15 正形链）

| 步 | 动作 | 读数 | 判 |
|---|---|---|---|
| 0 | 预检 | TriMLC 仓 HEAD=**8361196**（fix(server) 债② 同族 POST 端点 abort 防御统一修 26 处·父=fddb630）·dist/server/app.js **293579B 10:36 新铸**（CTO 自跑 build rc=0 实锚对表）·abort 码面 grep 命中·白盒探针形勘定（test/server/app-abort-defense.test.ts halfBody+markReadProbe 形） | ✓ |
| 1 | 回滚锚留档 | 快照 6 件合 **11938243B**（notify-mailbox.json 4383480B 正身+cron.db+sessions.db+fade.db+config-cache.json+daemon-channel.cmd.bak）→`%LOCALAPPDATA%\trimlc-batch1-snapshot-8361196\`+现役基线 **fddb630**（pid 35728）承录·探针脚本 probe-abort-defense.cjs 同目录存档（审计面） | ✓ |
| 2 | watchdog Disable | State=**Disabled** | ✓ |
| 3 | pid 三证（停前） | pidfile **35728**==netstat 8713 **35728**==CIM node.exe（created 06:36:54=R6-b 冷启件·uptime 连续） | ✓ |
| 4 | /shutdown | token 从**单值源文件**（internal-token·批 2 件②供给面正身）读入（长度断言 64）→HTTP **200** `{"ok":true,"message":"shutting down"}` 一次过 | ✓ |
| 5 | port FREE | 8713 零 LISTEN ✓（pidfile 35728 死值残留=writePid 冷启覆盖语义非阻塞照先例） | ✓ |
| 6 | 冷启 | Start-ScheduledTask 'TriMLC Daemon'→pid 三证 **35576**（pidfile==netstat==CIM node.exe·created 10:45:01·uptime 重置 6s） | ✓ |
| 7 | healthz | 200（ok=true·cron jobCount=18 degraded=false consecutiveFailures=0·heartbeat/reaper enabled·mc_link/trimc 首拍建链中 degraded→**68s 时点 connected/connected 复绿**=18710 隧道链传导） | ✓ |
| 8 | **变更值面探针**（非 healthz·完工判据） | 三断言全绿：①halfBody 断连=真 content-length 写一半 body 后 destroy→客户端 ECONNRESET（真断连形发讫）**daemon 零崩** ②markReadProbe 断连后 2s 业务探针（假 message_id）→**HTTP 404 业务 JSON** `{"ok":false,"message_id":"debt2-probe-nonexistent"}`=handler 正常运转响应业务校验（daemon 存活值面·非 healthz 面） ③healthz-after **uptime=55 连续未重置**=daemon 未崩未重启——8361196 abort 防御值面在役实证（白盒案形活体化） | ✓ |
| 9 | watchdog Enable | State=**Ready** | ✓ |
| 10 | pid 终证 | pidfile **35576**==netstat **35576** | ✓ |

异常零（全链一次过·止损线未触）·TriMLC 重启窗=批 1 内唯一窗护栏遵（本窗内 cleanup 装载+批 2③ 随线兑现·零双重启）。

## §三 · 批 2③ cleanup 根治后一次性验真跑（WO-RW1 §二 批 2③·前置=批 1 装载毕兑现）

- **token 文件供给面一次过实证**：TRILC_INTERNAL_TOKEN 从 internal-token 文件读入 export 形（长度断言 64）+TRILC_PORT=8713 → notify-mailbox-cleanup.cjs 直跑**零 401**——上窗首跑 401 全败环形（shell env 旧值 MISMATCH 族）自此闭环，token 单值源供给面真跑验收 ✓。
- 四项读数（COS 令④形）：①窗口=24h 截止 2026-11-19T02:46:59Z·全箱=**500** 未读=**180** ②真跑件数=**29**（超窗未读·by_seat bod 16/m-cos 7/m-coo 3/m-cto 2/m-cao 1）→**markRead ok=29 失败=0** ③归档件数=本窗回滚锚快照 notify-mailbox.json 4383480B 全量保全在位（+上窗快照双层） ④余 unread=**151**（=180−29 数学闭合·全 24h 窗内新件）。
- 幂等语义全程（daemon 404 已读态亦计 ok·零重试风暴）✓。

## §四 · 遗留与下窗

- **债 6 完全形=B 段**（COS 裁不预支承录）：.cmd set /p 读文件形改形（三清前置）+hook 端文件 fallback 码面候选候 fsd——批 1 窗未预支照裁。
- **weekly-plane-shift rc=2 深勘**（COS 准令·批 1 毕报后顺手窗）：本卷落卷后即启只读勘（精确失败点定位·零直改·产出定性回执随卷+信面一行）。
- github 443 补推面：f197d320d sg bare 已达·github 顶落后多笔——候窗补推承录。
- keeper 观察窗持续（§一 附加义务）。

## §五 · 护栏遵守

pid 三证双向（停前 35728/启后 35576）✓｜daemon 禁裸杀（/shutdown token 门优雅停）✓｜回滚锚先于停（快照 6 件在位后……shutdown）✓｜D-46 全程（token 值面零回显·文件读入+长度断言形·探针脚本零 print token）✓｜D-47（落款=date 现查原值）✓｜值面探针非 healthz（CTO 完工判据语义·业务 JSON+uptime 连续双锚）✓｜cron 现役件零直改（healthz 三查只读）✓｜TriRLC 8711/sg 现役资产零触碰 ✓｜两面皆研发环境（禁称生产部署）承录 ✓。

## §六 · 使用依据

- CTO D-15 批 1 重启窗派令（复验卷 5cda4e0ef APPROVE·正形链五款+完工判据值面探针+回滚锚 fddb630+批 2 解锁信号语义）
- COS 径裁分支 A 即启令（止损评估收讫·护栏三条+观察义务+毕报双通道）+COS 准令 weekly-plane-shift 深勘（只读·窗口=本毕报后）
- WO-RW1 派工单（03a774365）+§六 开工激活令（cba2079bc·台账 636）——批 1/批 2③ owner 与护栏四族
- 本席卷先例：sde-trimlc-reload-cleanup-20261120.md（fddb630 装载窗全步序正形）+sde-rw1-batch23-readings-20261120.md（件②供给面+件④只读勘）
- 活体：TriMLC 仓 8361196+dist/server/app.js 293579B+8713 healthz 全程（6s→55s→68s 三拍）+探针 stdout 全程+cleanup stdout 全程+tunnel.log 新链四行
- D-24（机位活体现探）/D-29（Start-ScheduledTask 无窗形）/D-46/D-47

—— SDE 小布（m-sde·批 1 装载收口+批 2 全解锁信号随发·A 段观察窗持续·weekly-plane-shift 深勘候顺手窗即启）·写前现查 2026-11-20T02:47:11Z（+8=2026-11-20 10:47:11·date 现查原值·D-47 正形）
