# SDE 勘验卷 · charter-2026-W42-001 窗开第 0 步 AC 锚+河源重探（D-24 首步硬锚）

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/r-plane-duty-deploy-20261015/reports/sde-hy-reprobe-20261016.md
- syncMode: static（勘验卷·令源=COO 21:02 预置信+21:56 增补+03:16:39 开窗令确认）
- lastSyncedAt: 2026-10-16 03:23:00+08:00（date 现查原值随发）
- 执行席: SDE 小布（m-sde）；charter: charter-2026-W42-001（本树=charter 正卷树·执行树 n=4 拆树清单附后）

## 第 0 步 AC 自检锚（03:20:5x·PowerShell 直跑）

- **PowerOnline=True·EstCharge=79%·DischargeRate=0mW·Discharging=False·Charging=False** → **电源在线·照序走** ✓
- 判定依据：COO 21:56 增补款「AC 在线→照序走（重探河源→终拆树呈复核→施工）」——锚过。
- 昨夜读数分歧旁证：21:57 我面 100%（疑 EC 虚满）→今晨 79%（夜间实放电 ~21 点）——CEO 接电承诺兑现面（PowerOnline=True 实锚）·随窗毕毕报留痕。
- 79% 起步+在线=150min 窗跑道无虞（断电兜底亦 ~3h+）。

## 河源重探读数（03:21-03:22·ssh root@8.155.54.79·D-24 活体现探）

| 探面 | 读数 | vs BOD 20:33 背景 |
| --- | --- | --- |
| TriRMC 8710 healthz | `{"ok":true,"service":"trirmc","mcLedger":"ok","cron":{"enabled":true,"jobCount":3,"degraded":false,"consecutiveFailures":0}}` | 对平 ✓（active·绿·3 jobs·cf=0） |
| tmux root 侧 | error connecting（无 server）=**零会话** | 对平 ✓（班组实体不存在） |
| tmux fleet 侧 | error connecting=**零会话** | 对平 ✓ |
| claude 进程 | **零**（pgrep 唯一命中=探针命令行自身——自我命中形态如实记） | 对平 ✓ |
| /srv/fleet/ 布局 | dsh·lg058-upgrade·shadow-plane·TriCode（+deploy bundle）·**TriCompany**·TriLC·**TriMetaverse**·TriModel（+bak）·trimodel-data（+deploy bundle）·trimodel-test·**TriRMC** | TriRMC+TriCompany+TriMetaverse 三仓全在位 ✓ |
| 基础环境 | Python 3.12.3·node v22.23.2 | 部署依赖在 ✓ |

- 探针命令：ssh BatchMode（零交互）·curl 127.0.0.1:8710/healthz（本地环回·零鉴权面读数）——零写面纯读。
- **重探结论：背景读数全面对平·零漂移·窗开拆树条件成立。**

## 终拆树清单（charter-id: charter-2026-W42-001·tree-id=1:n·呈 COO 总调度复核）

| tree-id | 树名（kebab·工作名规范化） | 要素 | 毕锚 | 止损 |
| --- | --- | --- | --- | --- |
| 1 | r-plane-duty-deploy-n1-process-tree-20261016 | ①13 席进程树部署（与 M 面 sg 同构对表） | 13 席进程树活体在跑+tmux 会话在册+同构对表读数落卷 | 进程树 kill 回退·零残留断言 |
| 2 | r-plane-duty-deploy-n2-name-registry-20261016 | ②名址注册 | ListAgents 等价面名址互见读数落卷 | 名址条目回退 |
| 3 | r-plane-duty-deploy-n3-notify-cron-link-20261016 | ③TriRMC 机制面×席位链路 | 首信直达席位箱+cron job 新建三查（201+next_run 值面+enabled=1）+触发读数 | 通道配置回退·daemon 优雅停重启链 |
| 4 | r-plane-duty-deploy-n4-relaunch-guard-20261016 | ④复活名址坑启动器面 | 启动前清 CLAUDE_CODE_CHILD_SESSION=1+置 FORCE_SESSION_PERSISTENCE=1 断言在案+冷启抽验 | 脚本回退 |

- 依赖序：n1→n2→n3→n4（任务书 §二·n1 进程树先立后名址·再链路·再启动器护栏固化）。
- 树 front-matter 各带 `charter:` 回指 charter-2026-W42-001·本清单卷=树束索引（charter 正卷树）。

## 使用依据

- charter-2026-W42-001@f9b8bf5ed7+会签@dd9f99cb7·COO 03:16:39 开窗令+21:56 增补（第 0 步锚）·D-24/D-27 v10/D-47
- 活体读数：本机 WMI Battery（PowerShell）·河源 ssh 重探（healthz/tmux/pgrep/ls/版本）
