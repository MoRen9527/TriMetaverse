# CTO 段2 施工卷 · 8713 restart 链窗（04:00-04:06 全读数）· 2026-10-17

- sourceOfTruth: 本卷（trees/e1-daemon-jobs-window/cto-segment2-restart-window-record-20261017.md）
- syncMode: static（窗毕施工读数卷·毕报链 COO→COS→BOD）
- lastSyncedAt: 2026-10-17T04:05:50+08:00（date 现查写前跑·D-47）
- 令源: COO 03:57:32 开窗令（双岗互证齐：CTO 03:55:58+COO 03:56:21+COS 03:57:18）·BOD 03:07:25 裁定 04:00± 窗·10-11 实操序

## §一 restart 链六步（04:00:03 窗开·04:02 全毕）

| 步 | 时点 | 读数/断言 |
| --- | --- | --- |
| 1 Watchdog Disable | 04:00:0x | TriMLC-Watchdog=Disabled ✓（Daemon=Running 待停） |
| 2 POST /shutdown | 04:00:27 | token 变量读入零回显·HTTP 200 `{"ok":true,"message":"shutting down"}` ✓ |
| 3 port FREE | 04:00:37 | shutdown 后 10s 端口释放 ✓ |
| 4 schtasks 冷启 | 04:00:47 | Start-ScheduledTask·任务态 Running ✓ |
| 5 pid/CIM 对表 | 04:00:56-04:01 | 老 pid 30624 死亡·**新 pid=30340**（端口反查正形）·CIM start=2026-10-17 04:00:47（**24h 错位自消验证闭合**——老进程 CIM start 显示 10-15 系老进程自身读取异常·新进程正常）·healthz uptime=7s 重置 ✓ |
| 6 Watchdog Enable | 04:02 | TriMLC-Watchdog=Ready ✓·Daemon=Running ✓ |

- mc_link degraded（冷启初态）→**connected 回绿（04:02:20·uptime 91s）**——TriMC 链路重连完成 ✓
- cron 引擎：boot recovery reset 1 stale+startup catchup 1 immediate+engine started with 14 jobs→addJob 后 15 jobs ✓

## §二 完工锚五件

| 锚 | 读数 | 判定 |
| --- | --- | --- |
| ① powercfg -ExpectPid 值面探针 | **FAIL——权限面**：powercfg /requests 需提升命令提示符，本会话非 admin 读不到输出（探针设计行为：不静默放行） | **候提升窗补验（挂账）**——非 keepalive 无效证据 |
| ② engaged 活体断言 | channel.log：`[trilc] power-keepalive: engaged (ES_CONTINUOUS|ES_SYSTEM_REQUIRED, prev=0x80000000)`——**OS 返回值级生效证据**（prev≠0=调用被 OS 接受·SetThreadExecutionState 语义） | PASS（生效面直接证据） |
| ③ channel.log engaged 行 | 同上·行在卷 | PASS |
| ④ uptime 重置 | 117219s→7s（04:00:56 读） | PASS |
| ⑤ pid/CIM 对表 | 30624→30340·CIM start 04:00:47 | PASS |

- **生效判定姿态**：②③⑤三证判定 E1-2 a 件生效（OS 返回值级+日志级+进程级）——①观察面因非 admin 环境不可达，如实挂账候白天提升窗补验，不构成生效否定。

## §三 E1-1 addJob+全链验证（04:02:43-04:05:40）

| 验证点 | 读数 |
| --- | --- |
| addJob | HTTP **201**·id=cron_mvbe9tp6_ba1i——**201 本身=ALLOWLIST 第 17 条生效面实证**（不等值必 403 fail-closed） |
| 三查（F-3） | 201 ✓+nextRunAt=04:05:00 值面 ✓+enabled=true ✓ |
| 手动拍 | POST run→200 `{"ran":true}`·runCount=1·lastRunAt=04:02:57 吻合 |
| **自然拍** | **04:05:06 触发（runCount=2·nextRunAt 推进 04:10）**——F-3「POST 201≠会触发」最后一块验证闭合 |
| 空转形态 | state 文件不存在（fired=0 零写）=「空转零落卷」设计符合 ✓ |
| lastStatus=null 疑点 | 对表 15 job 全员 null（含 runs=18148 老 job）=TriMLC cron 面字段行为·疑点排除 ✓ |

- E1-1 窗起提醒 job **生产值守态上线**（5min 巡检·读台账 front-matter windows·±5min 容差判拍落卷）。

## §四 窗界判定

- **完工锚全绿（①挂账候补·②③④⑤ PASS）+E1-1 全链闭合+零异常零停链**——**窗毕·04:06**。
- 回滚锚三层全程未触发（TriMLC revert 4be06b3/cmd 段删/env 键删——均零动用）。
- 生效面现势：8713 新进程 30340 带 power-keepalive+E1-3 b1 唤醒补报代码+ALLOWLIST 17 条+E1-1 job——一次重启摊销三件生效（a 件+ALLOWLIST+b1 代码面）**全兑现**。

## §五 候办交接

- powercfg 补验：候白天提升窗（挂账）
- b2 误报分诊：本机面四证+分水岭判据已转 COO 带 sg 值席（03:42 信）
- E1-5 8711 restart 独立窗：候 COO 排程（env 键已立·addJob 候窗）
- 04:05 起每 5min 自然拍值守态（下一拍 04:10）

## 使用依据

- COO 开窗令 03:57:32（窗内清单五步原文）·10-11 勘修窗实操序
- restart 前基线：healthz uptime 117219/pid 30624 端口反查/watchdog 面五对象清点（03:54:47 抓）
- 本卷全部读数=窗内活体现查（时点逐条标注）

—— CTO 小狄（落款 date 现查原值 2026-10-17 04:05:50 +0800·发毕对表）
