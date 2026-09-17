# 任务书 20260917-常驻席基础设施（12 席开机自启+看门狗）

- sourceOfTruth: 本件（BOD 铸，2026-09-17 21:2x 现查）；CEO 令：12 席挂 TriMLC daemon 做开机自启、永久在线员工；窗口形态=**最小化**（任务栏可见不占屏）；**bod 例外**（CEO 在 VS Code 手动启动，不入本套件）
- face: local-executable → **BOD 自办**（Windows 本机 ops，模式与今晨告警监控同族）
- PACE: P=本件 → A=挂 W38 平面 → C=BOD 执行 → E=收口回写

## 设计（单一看门狗原则）

- **Seat-Watchdog**（唯一保活者，5 分钟采样）：逐席探测 claude 进程（按 `--resume <名>` 命令行匹配）→ 缺席即经 `launch-seat.ps1` 参数化拉起（最小化 wt 窗）→ 尊重人工停止标志（`.fade/seat-watchdog.stop`）→ 事件写 `.fade/seat-watchdog.log`+弹窗（复用告警通道样式）
- **Seat-Boot**（开机自启）：ONSTART 计划任务，开机后拉起全部缺席席（单窗多 tab 最小化）
- **bod 例外+缺位规则**：bod 不入本套件；bod 缺位期间需审批/决策事项由 COS 缓存记录+写周工作平面，bod 上线后催办
- 环境标准沿用 `launch-seat.ps1`（清 CLAUDE* 遗传+FORCE 持久化+PascalCase 正名+compass 手册）

## 配套候令（不阻塞本件）

- TriMLC-Channel 1.5 分钟重触发退役（保活权归一 Watchdog）——动 Channel 需管理员权限+影响 daemon 监督，**候 CEO 令**另窗执行；执行前"复活者不明"类悬案可能复现，知悉即可

## 验收锚

- ①12 席全在册（进程+名册双验）②kill 任一席 → Watchdog 5 分钟内自动拉起（实测一席）③stop-flag 期间不拉起 ④开机自启任务注册在位

## 收口区

### 收口-BOD（2026-09-17 21:3x +0800，date 现查）

**四锚全过**：
- ①12 席在册：进程 12+ListAgents 13/13（含 m-cos 既有）✓
- ②**实弹测试**：杀 m-cto（原 PID 18472）→ 手动触发 Watchdog → 25 秒内复活（新 PID 12380，最小化窗）✓
- ③stop-flag 机制在位（`.fade/seat-watchdog.stop`）✓
- ④开机自启：ONSTART 需管理员被拒 → **降级 Startup 文件夹方案**（登录即拉起，免提权等效）✓

**注册清单**：Seat-Watchdog（计划任务 5 分钟）+ Seat-Boot（Startup 文件夹登录触发）；脚本正身 `ops-seat-watchdog.ps1`+`ops-launch-seat.ps1` 入卷（W38）；隐藏窗 VBS `.fade/seat-watchdog.vbs`+`seat-boot.vbs`。

**bod 缺位缓存协议**：已投递 m-cos 写入常驻指令区（缓存记录+写周平面+上线催办，与承上启下定位互锁）。

**配套候令**（不阻塞）：TriMLC-Channel 1.5 分钟重触发退役（保活权归一 Watchdog，"复活者不明"悬案根治）——需管理员权限，候 CEO 令另窗。

**遗留观察**：m-cos 窗口显示 bg 态（7h 前启动的旧进程标识，功能正常不追）。
