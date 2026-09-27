# LG-056+LG-057 落位部署读数卷（承接席 SDE 小布）

- sourceOfTruth: 本件（落位四步执行读数+403 幻影根因破案+停工恢复点锚）
- syncMode: append-only
- lastSyncedAt: 2026-09-28T01:41:28+0800（date 现查）

## 一、落位四步执行读数（CTO 门批配方，16327ad7）

1. **白名单追加** ✓：launcher `trimlc-daemon-channel.cmd` L18-19 追加 LG-056/LG-057 两 node 条目（01:08，备份 bak-pre-lg056-20260928T0108+0800）；P0-3 全串四条目（2 旧+2 新）node 字节级验证 `entries.includes(jobA command.trim())===true`。
2. **D-03 重启** ✓：stop（graceful+SIGTERM 兜底）→.cmd 拉起；重启前后 healthz 留痕：前=uptime 118392s/jobCount 2（§六底稿），后=uptime 2/jobCount 2、重启后 l2-scan runCount 996→1015 连续自愈（CTO 注记②实证：在役 job 断窗自愈无需补跑）。
3. **POST 建 job** ✓（01:23-01:24，date 现查 2026-09-28T01:41:28+0800 补录）：
   - jobA `cron_muk382is_6tr3`＝plane-shift-local-align｜`{kind:"cron",expr:"0 10 23 * * 0",tz:"Asia/Shanghai"}`｜enabled｜**201**
   - jobB `cron_muk3951d_b8ah`＝tree-node-patrol｜`{kind:"every",everyMs:60000}`｜enabled｜**201**
4. **GET 对账+run 彩排**：对账 4 jobs 齐（2 在役+2 新建全 enabled）✓；jobB 彩排 ok（trees=0＝在途树枚举来源 node-status.jsonl 文件存在性=空集，**自举盲区落位实证**，COS 立账前巡检视野为零，CTO 留痕要求命中）；jobA 彩排卡 `spawn git ENOENT`（见 §三根因）。

## 二、两处执行体修复实录（部署中勘定）

- **notify 契约**（A4 依赖）：初版载荷 `{title,body,source}` → sg TriMMC routes.ts 实勘契约=全必填 `source_seat/target_daemon/target_seat|targets/urgent(urgent|normal)/title/body`；另有**源席白名单**（m-duty-cos/bod/m-cos/m-coo 四值）。修正后实测 **notify http=200**（source_seat=m-cos；align 冲突即停→m-duty-cos urgent 弹显面；patrol→targets=[责任席+COS] normal 信箱面，席名取 seats.json 正名）。
- **PATH guard v2.1**（Finding-A 同族第二例）：launcher PATH 钉值追加 `;C:\Program Files\Git\cmd`（align job spawn 面需 git）——**已落盘（01:28:50，备份 bak-pre-pathguard-v21-20260928T012814+0800）待生效**，现役 daemon（32136）env 仍旧值，恢复点①重启后生效。

## 三、403 幻影+旧 PATH 复活根因破案（技术发现，候纪律册/MEMORY 候条）

- **现象**：受控重启后 POST 建 job 先 403 command_not_allowed（连旧白名单条目也拒）；PATH 编辑重启后 spawn 面仍旧值。
- **破案证据链**：文件字节（全 CRLF/set 行正形）✓｜cmd 解析 trace（set PATH 产物含 Git\cmd）✓｜dotenv merge（不覆盖语义）排除 ✓｜watchdog（log 无当晚动作）排除 ✓｜**PEB 直读 32136 env**（PATH=旧 v2 值铁证）→ 时间线对齐（备份文件名 01:28:14/mtime 01:28:50/boot 01:29:40）→ **根因**：
  - `cmd /c xxx.cmd` 的 cmd 父进程（C1，pid 30992，01:23:30 起）在 node 子进程存活期**驻留等待**；
  - stop（SIGTERM node 子进程）瞬间 C1 醒来，从其 parser 记忆的**旧字节偏移（≈2918，v2 文件 EOF 位）继续解析**——而文件已被我改长至 3110B，旧偏移恰好落在 v2.1 boot 行区域 → **C1 把 boot 行再执行一遍**；
  - 复活节点继承 **C1 的 01:23 时刻 env（v2）**，抢先绑定 8713（=32136）；我的 Start-Process 新 daemon（v2.1 env）EADDRINUSE 崩出。
- **教训（D-03 增补候选）**：daemon 系 `.cmd /c` 直启形态下，**stop 后必须确认父 cmd 链消亡**（或对进程树整体 kill），否则「停子进程=旧 cmd 复活子进程」——复活体 env=cmd 启动时刻快照，且与文件编辑窗口叠加时有「偏移错位重执行 boot 行」特异形态。验证法=PEB 直读（本卷 D:/tmp/lg057/read-env.ps1 留档）。

## 四、停工段（CEO 01:40 令·BOD 01:40:27 转；date 现查 2026-09-28T01:41:28+0800 星期一）

- **停在哪一步**：落位四步之第 4 步收尾——jobA 待干净重启（恢复 v2.1 PATH）后重彩排；SOP「拉空」分支补录（CTO 注记③）未动笔。
- **在手件 commit 状态**：本卷+.fade 两执行体（notify 契约修正+diag 自证段）随本笔 commit；此前 aaece6f8/4a87013a/28e8b16b/merge a9026528 已 commit 未推。
- **现役态安全评估（可停依据）**：daemon 32136 健康（healthz ok，4 job 在役，patrol 60s 自跑正常，allowlist 正确 4 条目）；jobA git ENOENT 仅周日 23:10 触发面受影响，无生产风险；watchdog 5min 探活兜底在位。
- **恢复点（读树续办锚，按序）**：
  1. `node dist/cli.js stop --port 8713`（带 TRILC_DATA_DIR=%LOCALAPPDATA%\trilc-channel+launcher token）→ 验 C1（30992）随之 EOF 退出+端口清空（若 C1 残留则树杀）；
  2. Start-Process 现 .cmd（v2.1，Git\cmd 在列）→ poll healthz（预期 2-3s boot）；
  3. **PEB 直读新 pid env** 验 PATH 含 Git\cmd（read-env.ps1 留档 D:/tmp/lg057/）再进下一步；
  4. 彩排 jobA（POST /cron_muk382is_6tr3/run）→ 预期 align-log 出现 fetch/behind 读数（behind=0 快速通过或 merge）；diag 自证段（PATH/TRILC 键/ALLOWLIST）候读数正常后删除；
  5. SOP「拉空」分支补录（CTO 注记③）：翻周迟超时本机拉空→下轮或 POST /{id}/run 手动补触发自愈，并入 weekly-plane-shift-local-align-sop.md diverged 策略段；
  6. 本卷收口（§一.4 jobA 彩排读数回填）+A4 通知通道读数+回执。

## 使用依据

CTO 联合技术门门审笔 cto-gate-review.md@16327ad7（配方+三注记）；TriMLC dist/app.js/timer.js/env.js+TriMMC src/notify/routes.ts 实勘；PEB 直读 D:/tmp/lg057/read-env.ps1；align-log.md 全程留痕；launcher 备份双份（0108/012814）。
