# CTO 白盒毕报卷 · G 件隧道 sg 侧终止段勘修（8713 发送端白盒对表毕·断环收口唯一余项=sg 8712 监听身份）· 2026-10-17

- sourceOfTruth: 本卷（trees/lg089-concentrated-window-20261017/cto-g1-tunnel-whitebox-20261017.md）
- syncMode: static（毕报卷·链序 COS→BOD·与 sg 值席卷 3d2cba973+bf3f86f11 互补闭合）
- lastSyncedAt: 2026-10-17T12:24:27+08:00（date 现查写前跑·D-47）
- 令源: BOD 12:17 两件之 G（COS 12:18 转派）——隧道 sg 侧终止段勘修+mirror 链恢复·我面接件=8713 侧发送端白盒对表
- 白盒性质：本机侧静态勘验+活体读数，**零改动零 restart**——回滚面 N/A

## §一 白盒对表读数（本机 8713 侧发送端全链五环）

| 环节 | 读数 | 锚 |
| --- | --- | --- |
| 出向配置 | TriMLC 三出向链（heartbeat 10s / mirror 30s full-push / replay）**同壳同目标**：`TRIMC_BASE_URL=http://127.0.0.1:18710` | trimlc-daemon-channel.cmd L10（grep 键面·值面零回显） |
| 隧道壳 | 18710 监听=ssh **pid 3372**：`-N -L 18710:127.0.0.1:8712 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes fleet@47.245.122.61`——**sg 8712 直转·隧道拓扑写死** | PowerShell Get-NetTCPConnection+进程命令行勘（12:0x） |
| ssh 链活性 | 3372 现役活（09:17:57 起）——keeper 自愈实战：老 ssh 27892 睡眠期死亡→醒后 keeper 重起新隧道（与 sg 卷「醒后一笔 09:23:15」三重吻合自证） | pid 启动时刻+keeper 旁证 |
| 心跳节律 | connMgr 10s 一拍持续 POST 18710 全 200；channel.log conn 行 09:18:2x degraded→recovered 后 **73 分钟零翻转** | channel.log L88933（紧邻 09:18:26 power 行锚） |
| 活体反证 | sg 值席卷：store 末真值 **09:23:15**·之后零新值 | sg 卷 3d2cba973+bf3f86f11 |

## §二 结论三钉

1. **本机 8713 侧发送端无断**：配置→壳→隧道→节律四环全活——出向链白盒排除，G 件「8713 侧 POST 日志」对表项闭合。
2. **「持续 200」与「store 零新值」并存 = 200 来源非活体实例的白盒级证明**：ssh 隧道写死 `18710→sg 127.0.0.1:8712` 直转；若 sg 侧 8712 监听者=dev/测试实例，POST 200 落进其内存即丢，活体 store 自然断更——假绿机制自洽，且与 sg 卷 08:23/09:23 两拍突发（端口漂移/flapping 窗）形态吻合。
3. **断环收口唯一余项 = sg 侧 `127.0.0.1:8712` 监听进程身份**（root lsof·sg 值席 D-53 权界·本席不越机）：
   - 形态 A：lsof 钉出 dev/测试实例→全案闭合（200 假绿坐实·重启对齐活体即修）
   - 形态 B：lsof 钉出活体→矛盾下移 TriMMC handler 投递段（收单 200→store 写入之间丢·入 sg 值席二轮勘）

## §三 发送侧可观测性结论（勘验副产物·改进候选）

mirror pusher fire-and-forget（`.catch(() => {})` 零日志）=**发送侧可观测性空白**——本次断环定位只能靠「活体反证+跨机对表」交叉完成；若发送侧有失败/非 2xx 日志，同类故障定位链路可省一半。建议列可观测性改进候选，与 H 件（投递层重试/去重）同族打包 sg 面议——不扩本件范围。

## §四 H 件定性随卷（COO 12:19 ③问·两形态预案交终排）

- **主案=投递层去重（幂等键）**：投递层单侧改·不改 job 协议；**辅案=confirm 调用**：job+投递层双侧协议改，成本高。b2 无 confirm 系现役 spec 默认态，非缺陷。
- **施工位初判=sg TriMMC notify 投递面**（四拍 2-3min 间隔=retry backoff 形实证·重播方向 sg→本机）→若钉实=**sg 面独立窗·不并 F 件 8713 restart**。
- 若终判落本机面（18710 壳/hook 层）→可并 F 件窗摊销。
- 两形态预案随本卷交 COO 段B 终排（COO 12:22 已列两形态预案候卷终判）。

## §五 余项与移交

| 项 | 归属 | 态 |
| --- | --- | --- |
| sg 8712 监听者 root lsof（G 件唯一余项） | sg 值席（D-53） | 候勘→段B 终排唯一候项 |
| E1-4 料包 v2 两步（recordNodeHeartbeat 增存 recentWake+挂点透出→b2 判据 v2） | sg 值席·候勘钉批 | 挂账（F 件 §三半闭环消费侧） |
| mirror 发送侧可观测性改进（§三） | 候立项·sg 面议 | 挂账 |
| 既有 5 败深勘（replay-flow/P0 端到端/FADE-ASSESS×2/tui） | 跨 4 域 | 挂账不动（F 件毕报 §二已归因） |

## §六 使用依据

- BOD 12:17 令（COS 12:18 转派）·sg 毕报卷 3d2cba973+bf3f86f11（本地镜像已读）
- trimlc-daemon-channel.cmd L10·channel.log conn 行 L88933·PowerShell 活体探（12:0x-12:1x）
- TriMLC src/mirror/pusher.ts（fire-and-forget 勘）·src/server/app.ts ConnectionManager（10s 节律）
- COO 12:19 三问→CTO 12:21 三答信（msg 4904dff2）·COO 12:22 收记（台账 114 笔）

—— CTO 小狄（落款 date 现查原值 2026-10-17 12:24:27 +0800·发毕对表）
