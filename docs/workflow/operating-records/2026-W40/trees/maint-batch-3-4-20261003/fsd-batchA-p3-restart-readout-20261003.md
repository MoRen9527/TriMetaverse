# FSD·批A P3 受控重启+回归门读数卷（BOD 亲验窗 14:00，#312 转令）

- sourceOfTruth: 本件（批A P3 施工卷；令源=COO 11:4x P3 门令，BOD #312 亲验 14:00 北京时间）
- syncMode: live（骨架预位于候令期 12:3x；窗内四步读数随做随填）
- lastSyncedAt: 2026-10-03T12:35+08:00（date 现查）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道；执行通道=Bash 代，本会话 PS 工具面卡死异常在案）

## 零、候令期预勘（12:2x，只读零触）

| 项 | 读数 |
| --- | --- |
| pid 42616 | 活（node.exe，Bash tasklist 实锚） |
| 3333 监听 | LISTENING pid 42616（netstat 实锚） |
| .env | 303B 在位（P2 产物） |
| dist/src/server.js | 7015B 在位（build 窗产物） |
| /healthz | **404——TriModel 无此端点**，回归门探针形=/v1/config/keys Bearer 200 替代 |
| 优雅停面 | **零 /shutdown 端点+零 SIGTERM handler（git grep 双空）**——矛盾点 a 呈报 |
| watchdog 位 | ~~3333 无 watchdog 位~~ **勘正（BOD+实勘推翻）**：`\TriModel-Watchdog` 计划任务在位（现 Disabled）+v3 常驻循环型常驻实例——本行预勘误判根因=schtasks CSV GBK 编码 grep 假阴性（教训入异常 #2） |
| PS 工具面 | 卡死（裸命令 143×3），Bash 通道交叉全通 |

## 一、开工断言（14:00 后，BOD 到场）

- [ ] pid==42616 复断言（变则=照冷起形态报备候裁不擅动）
- 读数：（窗内填）

## 二、受控重启（执行口径终版=BOD 13:1x 定调：停起分双手）

- **停形=BOD 自敲**：pid 断言 42616 先行 → BOD 到场亲自 `taskkill /PID 42616` 单 pid → FSD 独立复验死 ✓。时点：14:0x（BOD #313 令文 14:04:48）。
- **拉起形=FSD 执行**照 09-29 同形：`(cd /d/Code/ai/TriModel && node dist/src/server.js > /d/tmp/bod-p3-restart/trimodel-3333-p3.log 2>&1 &)`（bash 后台+log 重定向）——BOD 逐项过目四点读数已呈（§二之二表）。**实际执行时点=14:15:55**（异常 #1/#2 双竞态清毕后）。
- 死区验证：3333 监听消失（42616 死后 1s 内被 38148 抢占=异常 #1；38148 死后 60s 内被 23296 抢占=异常 #2）→清竞态后清零验证 ✓→恢复 pid 15068 ✓。

## 三、回归门四项（BOD 亲验禁转抄，FSD 执行逐项过目）——**门过判：P3 PASS（BOD 14:2x 亲验）**

| # | 项 | 探针形 | 读数（BOD 亲验） | 判 |
| --- | --- | --- | --- | --- |
| 1 | keys 探针 | GET /v1/config/keys Bearer（.env 值）→200 | HTTP 200（BOD 亲敲，token 管道内） | ✓ |
| 2 | GLM 链 smoke | config 面模型+keys 真卡对表 | GLM-5.3-Flash+GLM-5.3 双模型在位；keys 真卡四 provider（deepseek/anthropic/openai/trimetaverse）+default_model+expires_at 全签发，非 card absent | ✓ |
| 3 | 8711 侧恢复 | config-cache 拉取面 | config-cache.json mtime **14:16**（重启毕 1 分钟内重拉真卡） | ✓ |
| 4 | 8713 侧停刷 | channel.log card absent 行 | card absent 刷止于 **L48277**（其后零 keys 行=停刷）；8713 缓存 14:12 态候下轮 refresh 自然翻面（非阻塞，正面读数已足） | ✓ |

- **链位勘正（BOD 门验带出，本卷如实记）**：3334 proxy 面历史无起位（非本窗回归面）；活证=BOD 自身 GLM 会话死窗（14:04-14:15）零中断=**M 席 GLM 链不走 3333/3334**。proxy-server 双端口隔离设计 vs 本机从未起位=拓扑疑点，已记 M2 闭合后拓扑勘域（与 watchdog 恢复形同勘）。
- FSD 只读基线补充（14:17 勘，供门后勘域参考）：8711 daemon.log（%LOCALAPPDATA%\trirlc\daemon\）现役 mtime 14:17:18，card absent 尾迹 default=deepseek-v4-pro+chat 链 fetch failed fallback 线索（deepseek-v4-pro→tmv-deepseek-chat→deepseek-v4-flash 三级降级链在卷）；**s3-backup 堆积 18 件活证**（keys.json ×13+config-cache.json ×5）=CFO 值源闸③标靶。

## 四、门后序（四项全过，BOD 14:2x 裁示执行）

1. **解围栏**（FSD 本席设的围栏本席解，清单见 §四之一，毕报 BOD→BOD 宣布 M2 闭合）。
2. **watchdog 维持 Disabled**（裁示不变）：候 M2 闭合后拓扑勘定恢复形再定——恢复形候选=re-enable 计划任务（Mutex 单例自然接管）或去常驻化改造，候勘。
3. **拓扑勘域记 M2 后**：①3334 proxy 双端口隔离设计 vs 本机从未起位 ②watchdog 恢复形 ③8711 card absent 停止后的 default 语义（deepseek-v4-pro vs GLM-5.3 差异，候值源闸①同勘）。

## 四之一、FSD 本席批A 围栏解除清单（毕报件）

| # | 围栏 | 依据 | 状态 |
| --- | --- | --- | --- |
| 1 | 3333 进程零触（候 P3 门后） | P2/build 卷 §五 | **解除**（P3 毕，pid 15068 现役=BOD 亲验门过） |
| 2 | 清理类零触（s3-backup 堆积面等） | ③④卷 §四 | **解除**（候 CFO 值源闸③派令即清；活证 18 件已录卷） |
| 3 | 三远机零触（R-HY/sg/河源） | ③④卷 §四 | **解除**（候值源闸② GLM_API_KEY 双机等后链派令） |
| 4 | 8713 生效重启禁区 | COO 边界申明（非本席设，**不解除**，维持候令） | 维持 |
| 5 | 邻域零触（TriMLC digest-inbox.mjs untracked+restore-claude-config.ps1 在途 diff） | ③④卷 §四 | 维持（非本席域） |
| 6 | 值面零出机/禁裸杀/指纹形 | 常驻纪律非围栏 | **不适用解除**（常驻） |

## 五、异常与偏离记录

**异常 #1（14:05-14:1x，停回询中候 BOD 裁）**：BOD 停毕（taskkill 42616，FSD 独立复验死 ✓）后 **3333 被未知源拉起**——实锚链：pid 38148 `node.exe dist\src\server.js`（14:04:48 起，与 BOD 令同刻）← 45176 `cmd /c "D:\Code\ai\TriMetaverse\.fade\trimodel-launch.cmd"`（14:04:47）← 43292（已退临时进程，身份不可考）。launch.cmd=09-22 旧预位脚本（cd TriModel+node 前台，**零 log 重定向=日志面盲**，非 09-29 bash 同形）。活体形验：no-auth keys=401 gate 形（TriModel server 无疑）。FSD 未执行任何拉起，38148 零触，三选候裁（A accept 续验/B kill 照同形重起/C 到场亲裁）已直达 BOD，COO 同步知情。

## 一、开工断言（14:00 后，BOD 到场）

- [x] pid==42616 复断言——**变则已发生**：42616 死（BOD 14:0x taskkill 令文确认+FSD 独立复验），3333 被 38148 占（异常 #1）

**异常 #2（14:12-14:15，已破案处置毕）**：BOD Disable 计划任务+杀 38148 后，watchdog **再抢**——pid 23296（launch.cmd 形）14:12:13 占 3333，FSD 令内拉起实例 EADDRINUSE 崩（崩栈 log 901B 存 /d/tmp/bod-p3-restart/， dotenvx 三行实证：injected(5) from .env=P2 五键运行时终验；injected(6) from ..\.env=D:\Code\ai 父目录 .env 六键=**新污染面技术债**，t5 同族）。**真源破案**：trimodel-watchdog.ps1 v3=常驻循环型（60s 轮询+Global\TrimodelWatchdogSingleton 互斥），常驻实例 pid 52200 powershell.exe（09-26 00:27 起）——schtasks Disable 只挡调度面，杀不死常驻循环；watchdog log 实锤 revive 13:43:03/14:04:59/14:12:24+09:36-09:40 auth-dead 每分钟刷（.env 缺失期，CTO P1 卷预言实锚）。**教训**：schtasks CSV 输出 GBK 编码，ASCII grep 零命中=假阴性（本席预勘「无 watchdog 位」误判根因，iconv 转码后 `\TriModel-Watchdog` 在位——BOD 已勘正）。**处置**（BOD Disable 意图补完+裁定 B kill 步延伸，已毕报）：杀 52200 ✓（父 cmd 27976 已不在）→杀 23296 ✓→3333 清零 ✓→照 09-29 同形拉起 ✓。

## 二之二、拉起结果（14:15:55 北京，自验三步）

| 项 | 读数 |
| --- | --- |
| 命令行 | `(cd /d/Code/ai/TriModel && node dist/src/server.js > /d/tmp/bod-p3-restart/trimodel-3333-p3.log 2>&1 &)`（09-29 同形） |
| 3333 监听 | 127.0.0.1:3333 LISTENING pid **15068** |
| keys 探针 | GET /v1/config/keys Bearer（.env 管道取值）→ **HTTP 200**（响应体零打印） |
| 日志头 | dotenvx injected(0) dist\.env / injected(5) .env / injected(6) ..\.env + `[trimodel] configuration-plane API listening on http://127.0.0.1:3333` |
| 端点族 | /health /v1/models /v1/config/keys /v1/config/keys/refresh /v1/config/policy (GET\|PUT) /ui |

- BOD 过目四点读数已呈（命令行/日志头/端口绑定/探针），候 BOD 到场确认进门。
- watchdog 窗后恢复候裁：re-enable 计划任务即可（Mutex 单例自然接管），时点候 BOD 示下。

## 六、使用依据

- COO 11:4x P3 门令（BOD #312 亲验 14:00）+COO 07:57 批A 开工令（#300）
- CTO P1 卷 L104 P3 序（断言→重启→四项）；P3 口径知会（#302 C 件：四项本机照旧+亲验门不变）
- 候令期预勘读数（§零）
