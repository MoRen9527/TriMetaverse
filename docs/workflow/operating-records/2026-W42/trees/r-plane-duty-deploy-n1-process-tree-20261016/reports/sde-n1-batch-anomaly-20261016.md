# SDE 异常卷 · n1 批量起树 12 席全灭·硬件硬约束呈裁

- tree-id: 1
- charter: charter-2026-W42-001
- syncMode: static（异常留档卷·呈裁令=COO 候复中）
- lastSyncedAt: 2026-10-16 03:44:00+08:00（date 现查原值随发）
- 执行席: SDE 小布（m-sde）

## 时序

| 时点 | 事件 |
| --- | --- |
| 03:40:17 | 启动命令清单在案卷锁笔（57cf86b64·护栏先于首启达成） |
| 03:40:38 | 抽验席 r-duty-sde 起（login shell 形）→活体绿 |
| 03:40:4x | 护栏断言双绿（CHILD_SESSION 计数 0/FORCE_PERSISTENCE 计数 1·/proc/2741001/environ）+CLI 首屏活 |
| 03:41:3x | 批量 12 席（su fleet -s 非登录 shell 跑脚本）→12×launched rc=0 |
| 03:41:5x | 活体断言：**tmux 仅剩 sde 1 席·claude 进程计数 1——12 席全灭** |
| 03:42-03:43 | 诊断双根因+规格对表→异常呈报 COO 三径候裁+COS 知情 |

## 根因双实锤

1. **直接死因（可修）**：非 login shell（`su fleet -s`）PATH=`/usr/local/sbin:...:/snap/bin` 无 `~/.local/bin`——claude command not found→pane 即退→tmux 会话随灭。抽验席系 `su - fleet`（login shell）起故活。
2. **硬件硬约束（不可窗内修·呈裁主因）**：

| 面 | 河源 R-HY | sg M 面（13 席现役参照） |
| --- | --- | --- |
| 内存 | **1677MB** | 7748MB |
| swap | **0** | （未勘·sg 不靠 swap） |
| CPU | 2 核 Xeon Platinum | 4 核 |
| claude RSS | 1 席启动期 193MB | 13 席稳态总计 **4904MB**（377MB/席均） |
| 可用余量 | 起 sde 后 available 1003MB | used 4578MB 贴上限跑 |

- 缺口算术：13 席需 ~4.9GB vs 物理 1.6GB+0 swap=缺口 ~3.2GB——**PATH 修复后 13 席也必连环 OOM**。
- 内存安全边缘估：~2 席（2×377=754MB ≤ available 1003MB 边缘内·3 席 1131MB 超余量）。

## 现态（候令冻结）

- r-duty-sde 1 席活体健康（tmux 在册·pid 2741001·护栏双绿·CLI 首屏活）。
- 12 席零残留（即灭·tmux/进程/文件全清·脚本已删 /tmp/launch-fleet-seats.sh）。
- n1 前置链五件不受影响（proxy active/CLI 2.1.296/duty-env 295B/settings 1018B/compass 聚合 md5 对平）。

## 候裁三径（COO）

- a. 缩范围：~2 席验证 TriRMC 机制面×席位链路（n2/n3 随缩）·升配后扩满 13。
- b. 升配：河源机内存升配 ≥8GB 对表 sg 形（成本/机位面·非窗内）。
- c. 终止延窗：kill sde 回零会话原态·工件五件留装·候升配另窗。

## 使用依据

- 任务书 §二 序1 止损条+§四 D-24（活体现探）/COO 03:33:20 监控条款（「缩范围或延窗建议——不必自裁」）
- 活体读数：R 面 free/dmesg/ps/nproc/PATH 双 shell 对表·sg free/nproc/RSS 汇总（03:42-03:43）
