# G10 后续批读数卷（watchdog 复活段正形改+陈旧 pidfile 裁清·SDE 小布）

- sourceOfTruth: 本件（BOD 05:08 下窗常规批两件执行读数；G10 读数卷 §七.2/§八.4 的 CTO 裁修兑现）
- syncMode: source-only
- lastSyncedAt: 2026-09-29T09:40+0800（date 现查；批执行窗 09:32-09:39）
- 令链: BOD 05:08 排产令（COO 转派，CTO G10 裁 e24b17cc 执行要件）→COO 05:42 三裁（①诚实留白口径②legacy 再生不越界③锁锚不相触）→本席预勘 05:26→常规窗 09:32 执行
- 边界: 本席执行；批性质=常规窗非即夜（夜窗不超跑）；不 restart 任何 daemon

## 一、批次计划

| 件 | 内容 | 判据 |
| --- | --- | --- |
| ② | trirlc-watchdog.ps1 复活段改调权威启动器（保真 env） | 备份在位+ASCII 纯净+PSParser 零错+8711 零扰动 |
| ④ | 删陈旧 pidfile `%LOCALAPPDATA%\trimlc-channel\trilc.pid` | 删前复核仍陈旧+删后缺席断言 |

## 二、预勘基线（05:26，只读）

1. watchdog 链勘明：`\TriRLC-Watchdog`(schtasks)→wscript→`trirlc-watchdog-launch.vbs`→`powershell -File %LOCALAPPDATA%\trirlc-watchdog.ps1`
2. 缺口实锚：ps1 L29 复活段裸 `Start-Process node.exe dist\index.js`（无 env 注入——G10 实证 8711 裸拉后 mc_link degraded 280s 不收敛）
3. 权威启动器在位：`%LOCALAPPDATA%\trirlc\daemon\trirlc-daemon.cmd`（831B；env 键族 TRILC_DEBUG/TRILC_ENV_FILE/TRIMC_INTERNAL_TOKEN/TRIMC_BASE_URL/TRIMODEL_API_TOKEN/TRILC_DATA_DIR，值零读零出机；尾形 `node cli.js start --port 8711`=detached spawn 返回，cmd /c 无阻塞面）
4. pidfile 旧态：content=31460/mtime=09-02 15:02/进程已亡/不在 CLI 读链（PID_DIR=~/.trimetaverse，paths.ts 实锚）

## 三、件②执行读数（09:32-09:36）

1. 备份 ✓：`trirlc-watchdog.ps1.bak-20260929T0932+0800`（1315B；基线 md5 1CB4D336…）
2. 改形 ✓ 两处：
   - L2 注释：`revive via authoritative launcher trirlc-daemon.cmd (env-faithful)`
   - L29 复活段：`Start-Process -FilePath "$env:ComSpec" -ArgumentList "/c `"$env:LOCALAPPDATA\trirlc\daemon\trirlc-daemon.cmd`"" -WindowStyle Hidden`
3. 门三绿 ✓：NON-ASCII-BYTES=0（ASCII 纯净，D-09 免 BOM 争议）/PSParser SYNTAX-ERRORS=0/L29 生效形输出核（启动器路径 runtime 展开即预勘在位件）
4. 零扰动断言 ✓：8711 healthz HTTP 200 ok=True（改文件不触 daemon，下轮探测自然生效）；watchdog.log 零新增行（健康路径静默=设计内）

## 四、件④执行读数（09:38-09:39）

1. 删前复核 ✓：content=31460/mtime=09-02 15:02（窗后无变化——8713 夜间未重启，无再生干扰）/PID 31460 DEAD
2. 裁清 ✓：Remove-Item→**DELETED+ABSENT-ASSERT-OK**；trimlc-channel 余档扫描=无其他 .pid
3. 再生注记（COO 裁②口径）：8713（TriMLC）boot 仍走 legacy 位 registerPid（缺 port 参）——8713 未来某次重启会在同位再生（届时 content=8713 活 pid，跨 daemon 互踩面复活）；消解=FSD 批① registerPid port 参落位，本批不越界设防

## 五、诚实留白（COO 裁①口径）

**复活路径验证=改形后候自然触发，本批未实弹。** 实弹验证需主动停 8711（超令面范围不做）。已验面=改形正确性三绿门+启动器在位与 env 键族结构性断言；未验面=真复活全链（cmd /c→launcher→daemon 拉起→mc_link connected）。候看门径：watchdog.log 出现新 `DOWN (fail n/3) -> reviving` 行后，其后 5min 内应见 `recovered; fail counter reset`——若见 DOWN 三连 stand down 即报本席+CTO。

## 六、回滚锚（在位未动用）

- 件②：`trirlc-watchdog.ps1.bak-20260929T0932+0800` 还原即回裸拉形（零 daemon 状态牵连）
- 件④：陈旧档无再生价值，回滚=不适用（如需占位可手工重建 content=31460，无意义）

## 七、批次收口

- 最终状态：两件全绿收；8711/8713 零 restart 零扰动；watchdog 下次探测 09:46:00 走新脚本健康路径
- 批耗时：预勘 05:26→执行 09:32-09:39（纯执行 ≈7min）
- 锁锚不相触 ✓：本批只动本机 watchdog 启动链与陈旧档，不涉 TriCode 锚面（COO 裁③复核通过）

## 使用依据

- 令文：BOD 05:08 排产令+COO 05:42 三裁（诚实留白/不越界/不相触）
- 源文件实锚：`C:\Users\jedih\AppData\Local\trirlc-watchdog.ps1`（L2/L29）+`trirlc-daemon.cmd`（env 键族+尾形）+`trirlc-watchdog-launch.vbs`+schtasks `\TriRLC-Watchdog` XML
- 前案：G10 读数卷 §二.2（陈旧 pidfile 记档）§五.3（权威 launcher 实锚）§七.2（裸拉缺口实证）§八.4/§八.5
- 纪律：D-04（时刻现查）/D-09（ASCII 规避）/确定性执行四步/诚实留白（CTO 深夜核全量留白日同口径）
