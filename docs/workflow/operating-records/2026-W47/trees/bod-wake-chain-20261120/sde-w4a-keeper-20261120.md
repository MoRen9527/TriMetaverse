# SDE W4-a keeper 立项毕报（trilc-wake-tunnel-keeper 在役·alive 拍落地·D-29 合规形）

- sourceOfTruth: 本卷（W47 树 bod-wake-chain-20261120/sde-w4a-keeper-20261120.md·W4-a 立项正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS W3+W4 拆树派工（cos-w3w4-dispatch-20261120.md·W4-a 并行先行独立小件）+COS 派工知会（02:20+08）
- 判定: **keeper 立项毕·在役**——alive 拍落地（ssh=up daemon=200）·sg 侧 18713 绑定成功强旁证·W3-d 部署候态同步就绪

## §一 · keeper 三件铸形（C:\Users\jedih\AppData\Local\trilc-wake-tunnel\）

| 件 | 形 | 说明 |
|---|---|---|
| keeper.ps1（60 行·纯 ASCII·CRLF 46/46） | while($true) 60s 拍 loop | 探针双条件：ssh 进程存活（CIM CommandLine 精准匹配 `18713:127.0.0.1:8713`——只匹配自家转发串·零误杀 bod-dsh-tunnel 18790 族）+daemon 活体（无 token GET /healthz·**实测 200**）；ssh 缺→CIM 精准杀+respawn（`ssh -N -R 18713:127.0.0.1:8713 sg-ecs-server -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=accept-new`·W2-a 形）；ssh 在 daemon 死→watch only（daemon 生命周期归 TriMLC Daemon schtasks+Watchdog·keeper 不越域） |
| keeper-launcher.vbs（3 行·纯 ASCII·CRLF 3/3） | D-29 无窗包装正形 | `WScript.Shell().Run "powershell -NoProfile ... keeper.ps1", 0, False`——窗口 0=隐藏·不等待·wscript 启动毕即退 |
| schtasks 任务 trilc-wake-tunnel-keeper | wscript 包装·AtLogOn 触发·**ExecutionTimeLimit=无限**·MultipleInstances=IgnoreNew·AllowStartIfOnBatteries | Execute=`wscript.exe "C:\Users\jedih\AppData\Local\trilc-wake-tunnel\keeper-launcher.vbs"` |

**先例形两坑修正**（bod-dsh-tunnel 对勘）：①先例 powershell 直启（D-29 违形·窗闪）→本件 VBS 包装合规；②先例 ExecutionTimeLimit=PT72H（keeper loop 72h 被杀·State=Ready 实锚=keeper 真没跑·ssh 靠脱离存活）→本件无限时限+IgnoreNew 防双实例。

## §二 · 实跑读数（02:23:32-02:24:48+08）

| 拍 | keeper.log（UTC Z） | 判 |
|---|---|---|
| start | `2026-11-19T18:23:32Z keeper start (pid 28208)` | ✓ keeper loop 起 |
| 首拍 | `18:23:33Z tunnel down (ssh=missing daemon=200) - respawning ssh` | ✓ 首拍判正确（ssh 未起）→respawn→ssh pid 23516（02:23:33 CIM 实锚） |
| 次拍 | `18:24:48Z alive (ssh=up daemon=200)` | ✓ **alive 判据双条件绿·60s 节律工作** |

- keeper loop 进程=28208（CIM 实锚·keeper.ps1 在跑）——tasks State=Ready 显示面与 CIM 实例态分歧=schtasks 显示怪癖如实注（真值锚=CIM 进程在+log 节律增量·非 tasks State 面读）。
- wscript 零进程=VBS 启动毕退出正形 ✓。

## §三 · 判据面两处勘定如实记

1. **daemon 探针读数 200 非 401**：预判「无 token 探 healthz 期望 401=fail-closed 门在」——实测 **healthz 公开端点零鉴权 200**（W2-a 卷「/internal/v1/* 全族同门」语义精确=仅 /internal/ 路径族·healthz 不在其内）。keeper 判据 `-eq 401 -or -eq 200` 双值兼容已覆盖·零返工；token 零接触 D-46 更优达成（keeper 全程零 token 面）。
2. **sg 侧 18713 绑定成功强旁证**：ssh pid 23516 自 02:23:33 活体>75s 未退——`ExitOnForwardFailure=yes` 语义=若 sg sshd 拒绑 18713（AllowTcpForwarding no/端口未许可）ssh 必即退——**未退=绑定未被拒**。sg 侧真值面探针（18713 可达性+hook 推唤段）归 W4-b 联调（值席组配合面·sg 零直连遵行）。

## §四 · W3-d 部署候态（同令第二件）

- 重启序照 W2-d 全套就绪：§四 11 步序+18 job 基线表现役复用（W2-d 毕报在卷·fd7178c63）+快照方案在卷+channel.cmd 零改动路径认收。
- 值面探针 wired 形：**候 m-cto W3-c 门禁定形（dry-run 或真发）——勿硬编码预告字面·照复验卷值面对表**（W2-d 探针 reason 字面教训同族已留痕）。
- 触发条件=m-fsd W3-b 施工毕+W3-c 门禁过——候信即开走。

## §五 · 护栏遵守

sg 面零直连 ✓（sg 侧状态全旁证形·零 SSH）｜D-29（VBS 包装·纯 ASCII 全件·窗口 0 隐藏）✓｜D-09 风险面（ps1/vbs 全 ASCII·零中文零编码坑）✓｜CRLF 断言写后复核（46/46·3/3）✓｜D-46（keeper+探针全程零 token 值面）✓｜D-47（写前 02:25:20+08 现查）✓｜精准杀（自家转发串匹配·零误杀旁邻隧道）✓｜keeper 域界（daemon 生命周期不越域·watch only）✓。

## 使用依据

COS W3+W4 拆树派工卷（W4-a 门面+增量护栏）+W2-a 通道形勘定卷（§二① -R 形/钥匙同族/keeper 名铸面）；bod-dsh-tunnel 在役先例全谱（tunnel-keeper.ps1 全读+schtasks action/Triggers/Principal/Settings 勘验·两坑如实记）；D-29 无窗纪律（VBS 包装正形）；bg-process-persistence-schtasks-keeper 正形族；TriMLC 8713 healthz 活体探针实锚。

—— SDE 小布（m-sde·W4-a keeper 立项+W3-d 候态·快毕节律）·写前现查 2026-11-20T02:25:20+0800（date 现查原值·D-47 正形）
