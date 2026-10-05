# LG-064 活体告警规则文档（判据/阈值/覆盖/残差/实证）

- sourceOfTruth: 本件（LG-064 施工交付三件之一：规则文档；令源=task-charter.md 99f4aad1+CTO 方案确认 cto-tech-plan-confirm-20261005.md 0cdc55ae）
- syncMode: final
- lastSyncedAt: 2026-10-05 11:40:34 +0800（date 现查贴原值）
- 编写席: FSD 小全（m-fsd）；演练证据正身=同目录 drill-receipts-20261005.md

## 一、判据与阈值总表

### 1.1 本机（dev win，TriMLC 8713）

| 维度 | 数据源 | 判据 | 节奏 |
| --- | --- | --- | --- |
| process | 端口监听（Get-NetTCPConnection）+ per-port pidfile（`~/.trimetaverse/trilc-<port>.pid`）对表 | 无监听 / pidfile≠listen pid 即告 | L1 每 5 分钟（计划任务 TriLiveness-L1，D-29 wscript 无窗形） |
| process（healthz 面） | `GET :8713/healthz` | healthz 不可达且端口有监听 → healthz-unreachable 即告 | 同上 |
| heartbeat（调度面） | healthz `.cron` 子键 | `cron.enabled=false` → cron-disabled；`degraded=true` → degraded 即告 | 同上 |
| heartbeat（store 面，正判据） | `cron.db.json` 各 enabled job | every-job：`now-lastRunAt > max(3×everyMs, 30min)` 即告；cron-expr job：`now > nextRunAt+30min` 即告；nextRunAt 缺失 → missing-nextrun 即告 | 同上 |
| disabled | TriMLC-Watchdog 计划任务态（`Get-ScheduledTask`） | State≠Ready 即告；`extra-tasks.list` 注入面同名逐项同判（演练专用，常态不存在） | 同上 |
| 告警通道 | 经 18710 隧道 → sg 8712 notify | 连续 2 轮异常才发报（debounce=2，恢复清零；瞬态在达到阈值前消失则不入报）；POST 失败落 `l1-pending.txt` 下轮重发 | 同上 |

### 1.2 M-SG（trimc 8712/8710，TriMMC）

| 维度 | 数据源 | 判据 | 节奏 |
| --- | --- | --- | --- |
| process | `systemctl is-active trimc` | 非 active 即告 | L1 每 5 分钟（/etc/cron.d/tri-liveness） |
| heartbeat（healthz 面） | `GET 127.0.0.1:8712/healthz` | `cron.enabled=false` / `degraded=true` 即告（TriMMC degraded=**max(各 job consecutiveErrors)≥3**，per-job 语义） | 同上 |
| heartbeat（store 面，正判据） | `/usr/local/sbin/tri-heartbeat-check.py` 读 `/var/lib/trimc/cron/jobs.json` | every-job：`now-lastRunAtMs > max(3×everyMs, 30min)`；cron-expr job：`now > nextRunAtMs+30min`；STALE 行即告 | 同上 |
| heartbeat（粗判，辅助） | `/var/lib/trimc/cron/logs` 90 分钟新鲜度 | 无任何 90 分钟内新日志 → no-fresh-log-90min 即告（粗判只作补充：M-SG ae02593a 单 job 停摆 68.8h 期间粗判不可见——实证见 §三.1） | 同上 |
| disabled | `systemctl is-enabled trimc` | 非 enabled 即告；`extra-units.list` 注入面同判（演练专用） | 同上 |
| 告警通道 | 本地 POST 127.0.0.1:8712 notify；回执=notify-resp.json message_id + l1.log ALERT-POST 行 | debounce=2 同上；状态文件 `/var/lib/tri-liveness/state-<ISO周>.log` append-only 每轮写 verdict | 同上 |

### 1.3 R-HY（trirmc 8712+trirmc-mc 8710，A 形退化）

| 维度 | 数据源 | 判据 | 节奏 |
| --- | --- | --- | --- |
| process/disabled | L1 自检脚本 ssh-free 本地跑（`systemctl is-active/is-enabled` trirmc+trirmc-mc） | 非 active/非 enabled 即告 | L1 每 5 分钟（/etc/cron.d/tri-liveness） |
| heartbeat（healthz 面） | 8712 healthz cron 子键 | enabled=false/degraded=true 即告（TriRMC degraded=per-job max 语义，与 TriMMC 同族）；hz8710 **ok-only**（cron.enabled=false 系 service face 设计态，永不告） | 同上 |
| heartbeat（粗判，辅助） | cron/logs 90 分钟新鲜度 | 同 M-SG | 同上 |
| 判据落卷 | `/var/lib/tri-liveness/state-<ISO周>.log` | `verdict=ok` / `verdict=ALERT-NEEDED+issues` append-only；**R-HY 无本地发报能力**（notify 404 实勘在案） | 同上 |
| 告警通道 | **L2 代发（A 形正解）**：本机 L2 拉 state 文件尾 3 行，ALERT-NEEDED 行转 dim=relay issue；独立三态读数同轮判 | L2 debounce=2；R-HY 验收锚=L2 中继告警抵达值席 | L2 每 10 分钟（计划任务 TriLiveness-L2） |

### 1.4 L2 本机远程巡检（跨机兜底）

| 项 | 判据 |
| --- | --- |
| SSH 失联 | 第四告警维度：ssh 无输出 → `dim=ssh state=unreachable note=cause-undetermined-local-offline-possible`——**禁写远端死定性**（A 形裁决：误判禁令，含本机离线可能） |
| state 文件陈旧 | STATEAGE>15min → `dim=statefile state=stale note=cause-undetermined`；absent 即告（陈旧≠主机死，盘面可能，禁误判） |
| 独立三态 | R-HY/M-SG 各 unit is-active/is-enabled + 两口 healthz + M-SG store 精判（tri-heartbeat-check.py 同脚本）逐轮独立判 |
| 告警通道 | 18710 隧道 → sg 8712 notify，debounce=2，pending 落盘重发 |

## 二、判据设计注记

1. **store 精判=正判据，logs 粗判=只作辅助**（CTO 2026-10-05 裁）：M-SG ae02593a 实证单 job 停摆 68.8h 而其他 job 日照写→粗判全程不可见；精判按 job 窗口可捕。
2. **nextRun 滚动不可单独作为活信号**（CTO 裁，规则化）：nextRunAtMs 由调度面写，调度面活≠执行面活；活信号必须落在 lastRunAt 执行事实上（cron-expr job 的 nextRun 到期未执行判据为例外正形——它判的是「到期未跑」这一执行事实）。
3. **低频 job 检测迟滞=周期×3**（设计固有）：cron-expr/低频 every job 的窗口下限 30 分钟，超窗才可判停；分钟级 every job 为快哨兵。
4. **降级面语义三形态分野**（2026-10-05 实勘，重要）：TriMMC/TriRMC degraded=**per-job max(consecutiveErrors)≥3**（单 job 连败可见，掩蔽面=零）；**TriMLC=全局单计数器，任一 job ok 即清零**（单 job 连败被健康 job 掩蔽，本日 8 连败实验实证 degraded 恒 false）——TriMLC 降级面仅可捕「全部 job 连败」态；单 job 故障依赖 store 精判面。三形态勿互套（同 trimc-mlc-addjob 分野教训）。
5. **R-HY A 形差异**：L1 无发报能力→纯判据写入（无 debounce），debounce 由 L2 中继侧承担；L1 盲区=daemon 死×本机离线双故障窗（如实声明级残差）。

## 三、判据有效性实证（案例节）

### 3.1 ae02593a（M-SG bod-progress-report 单 job 停摆 68.8h，部署前既有）
- 停摆跨 10-04 05:1xZ→10-05 02:15:21Z 自愈；enabled、nextRun 滚动正常、日志零新增——**粗判全程不可见，精判（若已部署）可捕**（窗口 max(3×everyMs,30min)，停摆 8 分钟即越窗）。
- 自愈早于部署完成=时间巧合，防误读：非监控修复，也非部署动作所致。CTO 裁：残差记录入 LG-064；TriMMC executor 停摆家族缺陷立独立候办（10-01 TriRMC 同签名+本例，家族性强信号）；本窗禁修（边界 1）。

### 3.2 解析幻影事件（2026-10-05 02:41Z，施工期自伤，已修复闭环）
- 现象：会话内 pwsh7 手跑 L1 一轮，6 个健康 job 全报 last-run-stale ageMin≈480。
- 根因：TriMLC store 时间戳=ISO-8601 带 Z 串；**pwsh7 ConvertFrom-Json 转 DateTime 对象**（Kind=Utc，对象本身正确），但 `[DateTimeOffset]::Parse($obj)` 经 culture ToString 丢 Kind→裸数字按本地时区读→+8h 幻影；**PS5.1 ConvertFrom-Json 保持 String**→带 Z 解析恒正确（任务轮全程无误报的机理）。
- 修复：DateTime→`ToString('o')` 回环保 Z→`[DateTimeOffset]::Parse(s, InvariantCulture, AssumeUniversal|AdjustToUniversal)`——两宿主统一正确，双宿主实跑复验绿（l1.log 03:13:28/03:13:36 两轮零幻影）。
- 污染账：恰 1 条污染告警出过闸（02:41:26 ALERT-SENT 200，7 issues=6 幻影+1 真实 drill 项）；任务轮零污染。假读数家族新增第五向候选：**JSON 反序列化类型变形**（pwsh7 DateTime 转换），与 GBK 编码/转义毁语法/截断伪影/PS5.1 引号吞噬并档。

### 3.3 真实捕获（部署当日即中，监控有效性正证）
- M-SG config-sync-apply（5a8e6eac）03:0xZ 起连败：sg 工作树 `task-inventory-20261005.md` 本地未提交改动阻塞 git pull（merge abort exit 1）。03:10:06Z L2 首报 degraded cf=5、03:25:39Z 复报 cf=6、后续随真实状态持续——**全部真实告警抵达值席**，triage 定谳故障 job+根因（修复线=COS 运营记录面域，非 FSD 域，已升级）。
- 同窗全维度演练（见 drill-receipts）：三机×三维矩阵收款齐（本机 degraded 维除外，见 §二.4 设计缺口）。

### 3.4 假读数家族第四向（CTO 已定性）：PS5.1 引号吞噬
- powershell.exe 5.1（非 pwsh7）原生参数传递吃内层双引号→远程 `find -newermt "-90 minutes"` 静默失败→L2 任务上下文假报 LOGSFRESH=no。修法：PS 字符串内远程命令一律单引号形（`''-90 minutes''`）。与前三向（GBK 编码/转义毁语法/截断伪影）并档。

### 3.5 ssh stdin 悬挂族首例：ops-msg-alert-watch.ps1
- 无控制台上下文 ssh 不带 `-n` → stdin 悬挂 4 分钟+（ConnectTimeout 只限 TCP 连接段）。COS 已修源头；BOD 10:34 派各席自查令（本席自动化面已全量补 `-n -T`）。三件套标准配方见 §四。

## 四、ssh 调用规范（本监控体系内强制）

1. **三件套标准配方**：`ssh -n -o ServerAliveInterval=15 -o ServerAliveCountMax=3 ...`（CTO 2026-10-05 定）。
2. **现役例外**：验收窗内 L2 不追改（-n 已修已绿不动）；ServerAlive 两参=验收毕维护窗统一补齐（CTO 挂验收判读单）。
3. **stdin 脚本投喂形禁 `-n`**：`ssh -T host 'bash -s' < script.sh` 形（-n 把客户端 stdin 钉 /dev/null，脚本投喂零输出——2026-10-05 实勘）；该形限有控制台的交互会话用，无人窗任务面仍走 `-File`/命令行形。
4. **PS5.1 宿主远程命令引号**：内层引号一律单引号（`''`），禁双引号（§3.4）。
5. **零敏感值**：token/密钥/路径值面禁入 ssh 命令回显与告警文本；token 只经 `/proc/<pid>/environ` 管道取用（M-SG `/etc/trimc-internal-token` 系陈旧文件，head4 d2cd≠daemon env 4842，**权威位=daemon 进程 env**），指纹化（len+head4+tail4）为唯一允许出机面。

## 五、告警文本与通道契约

- 文本零敏感值：只带 unit/job 名+维度码+state+时戳；`src=` 字段标注发报位（l1-host-dev/l1-host-msg/l2-host-dev）。
- source_seat 现行='m-duty-cos'（notify MVP 白名单 {m-duty-cos,bod,m-cos,m-coo}，tri-liveness 不在内→403）；真实来源在 title 前缀（[L1/dev-win] 等）+body src= 字段。**白名单缺口候 CTO 裁**：监控面独立 source_seat 形（候值如 'tri-liveness'）或 MVP 白名单扩容。
- 重复告警节律：持续异常每 ~2 轮（L1 10 分钟/L2 20 分钟）重发一次，恢复即止（设计行为，值席可预期）。

## 六、残差与技术债登记

| # | 项 | 级别 | 处置 |
| --- | --- | --- | --- |
| 1 | TriMLC degraded 全局计数掩蔽（§二.4） | 判据设计缺口（TriMLC 侧源码形态，非监控面） | 候独立候办报 CTO；监控面补偿=store 精判已覆盖单 job 故障 |
| 2 | R-HY store 精判缺失（store 位置 4 探未定，timebox 已到） | 残差如实声明 | R-HY 心跳判据现役=healthz 面+粗判+L2 独立精判（M-SG store 由 L2 跨机覆盖）；R-HY 本地面候后续窗补 |
| 3 | R-HY daemon 死×本机离线双故障窗漏告 | A 形固有（无发报能力） | 如实声明级；全盲区=三机同挂=声明盲 |
| 4 | sg-daemon-total-down 时 duty-notify 通道同死 | 声明盲 | 本机 8713 fallback 候 CTO（方案确认卷已列） |
| 5 | notify source_seat 白名单缺口 | 待裁 | §五，候 CTO 毕报裁 |
| 6 | TRILC_CRON_COMMAND_ALLOWLIST 含 2 条死路径（.fade/tree-node-patrol.mjs、.fade/ledger-watchlist-patrol.mjs，迁移残留） | 卫生项 | 不急（exact-match 门下无风险敞口），候白名单下次修订窗清理 |
| 7 | 本地演练测试 job alert-drill-hb 系无 command LLM 形（每分钟一次模型调用，施工期 02:35-03:40 约 65 次） | 成本泄漏（已删） | 毕报记账；后续演练测试 job 一律带 command 形 |
| 8 | L2 ServerAlive 两参未补（验收窗内不追改，§四.2） | 排程项 | 验收毕维护窗统一补 |

## 七、演练注入面清单（施工终态=全部撤离）

- 本机：`%LOCALAPPDATA%\tri-liveness\extra-tasks.list`（已删）；TriLiveness-Drill-Normal 任务（已删）；端口注入=-ProbePort 参数（无痕）。
- M-SG：`/var/lib/tri-liveness/extra-units.list`（已删）；tri-liveness-drill.service（已删）；演练 job e432e54c（已删）。
- R-HY：`/var/lib/tri-liveness/extra-units.list`（已删）；tri-liveness-drill.service（已删）；演练 job b2ee8d77（已删）。
- 注入面为演练专用常态不存在；存在即演练窗。
