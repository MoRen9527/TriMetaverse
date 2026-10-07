# FSD 施工回执 · N2 盯梢 daemon 两机落位（LG-065 段⑤，GO 17:39）

- sourceOfTruth: 本件（N2 施工回执；定形正身=同目录 cto-n2-scheme-review-20261006.md CTO APPROVE 附条件版+tree-plan N2 节点+window-order 段⑤；GO 令=m-coo 17:39 三门判读）
- syncMode: static
- lastSyncedAt: 2026-10-07T10:25:05Z（18:25:05+08，落卷当场 date 现查）
- 两刻制: **开工刻 2026-10-07T09:48:23Z（17:48:23+08，GO 后 9min）／毕报刻见毕报信（当场现查）**
- 施工标的: dev 侧 `%LOCALAPPDATA%\tri-watchdog-n2.ps1`（8713 cron job 执行体）+ sg 侧 `/usr/local/sbin/tri-watchdog-n2-sg.sh`（8712 cron job 执行体）；两机 cron job + 四判据扫描 + 叫醒链 + cron 存活自检 + 对侧互备

## 一、落位清单（值面锚）

| 面 | 锚 | 读数 |
| --- | --- | --- |
| dev 执行体 | `%LOCALAPPDATA%\tri-watchdog-n2.ps1` | parse-errors=0；零敏感值（token 全运行时变量面：sg token 走 ssh /proc environ 取、8713 token 从启动器行解析） |
| dev job | TriMLC 8713 `cron_muxxy5w7_wbb7` n2-watchdog-dev | every 600s；enabled=True；nextRunAt=10:10:00Z 值面在；建单即过 P0-3 白名单 create 门 |
| dev 白名单 | `trimlc-daemon-channel.cmd` allowlist 追加 1 项 | 子串级追加（零行尾手术）`…joint-review-remind.mjs,powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/jedih/AppData/Local/tri-watchdog-n2.ps1`；备份 `bak-pre-n2-20261007T100135Z` 在位；CRLF 形态 file 断言守住 |
| dev 冷起轮 | 照段2 配方：watchdog disable→shutdown 200→port free→schtasks 冷启→healthz→enable | pid 31796→**3628**；jobCount=7 store 完整带出；degraded=False；watchdog 复位 Ready（finally 保底防僵） |
| sg 执行体 | `/usr/local/sbin/tri-watchdog-n2-sg.sh` | CR 剥离传输；bash -n 过；root:root 755 只读防改 |
| sg job | TriMMC 8712 `2608a629-7b47-44c6-9000-36b6419e8b7b` n2-watchdog-sg | every 600s；enabled=True 默认；nextRunAtMs=1791368405182（10:10:05Z）值面在；payload 嵌套正形（command+cwd） |
| sg 属主 | `/var/lib/tri-watchdog/` chown fleet:fleet | trimc 服务身份=fleet（systemctl show User=fleet 实证）；fleet 身份实跑 OK |
| 互备双章 | `heartbeat-dev`（dev 每轮 ssh push 落 sg）+ `heartbeat-sg`（sg 本地章） | 10:15:53Z 双章 0-5min 新鲜，双向判读通 |

## 二、四判据落位对照（CTO 定形逐条）

| 判据 | CTO 定形 | dev 侧 | sg 侧 |
| --- | --- | --- | --- |
| ①席位静默 | transcript mtime+在办单双条件；阈值分段黄金段 30min | 新 jsonl mtime 静默阈值 30min（黄金段 08-23）/90min（深夜）；双条件=挂账台账现役项 CN 数解析 >0（十四项→14 实证）；解析失败=注记跳过不假报 | **诚实降级缺席**（见 §六.1） |
| ②告警认领 | 认领=账本 ack 落笔或操作树 commit；禁 send-keys 应答/暗签 | wake-open 记录（id=UTC 时戳）；认领=dev `n2-ack.txt` 或 sg `/var/lib/tri-watchdog/ack` 含该 id 行；10min 无认领→hop2（+m-cos+bod）单次升级防重 | 同构（sg 本地面） |
| ③daemon 存活 | 三件套 healthz+pidfile 对验+store jobCount；清单实勘枚举禁硬编码 | 8713：pidfile↔listener+healthz **带 token**（S2b 勘差照办）+jobCount≥7 值面；8711：listener+healthz；任务清单 `Get-ScheduledTask -match TriMLC|TriRLC` 枚举（Ready/Running 放行） | `systemctl list-unit-files 'tri*'` 枚举+8712 healthz+cron 日志 90min 新鲜度+tri-heartbeat-check STALE 接入 |
| ④模型通道 | 二选一防抖；最小成本 | **错误日志面判读**（零新增调用，节流窗最合）：rank2-5 新 transcript 尾 8KB 扫 API Error/rate_limit/overloaded；连 2 轮才告 | 同构（rank2-3） |

## 三、叫醒链与互备（红线对表）

- **hop1**（真实告警轮，debounce 2 后）：18710→sg 8712 notify m-duty-cos + wake-open 记录 + tmux send-keys 纪律款（`-l` 文本+独立 Enter+capture-pane 回读；文本去单引号防远程引用破形）。
- **hop2**：10min 无 ack → +m-cos+bod 各一跳，`ESCALATED` 落 wake-open 防逐轮重发。
- **互备非循环红线**：写入=文件面（心跳章各自落、dev 章经 ssh push 单向）；判读=对侧独立 cron job 读章 mtime；过期窗=3×扫描周期=30min；无任何互调对方引擎/接口路径。
- **cron 存活自检**：前章 mtime 超 30min=missed-rounds issue；判读一律 lastRun/心跳事实，nextRun 滚动零采信（家族教训照办）。
- **hop4**（sg 物理独立位 BOD 人工窗）=runbook 性质：hop2 报文内含指引句，非自动化段（§六.4）。
- **链路唯一**：全链告警经 notify 面/值席/m-cos/bod，无 CEO 直发路径。

## 四、自测读数链（时间序）

1. 10:00:49Z dev DryRun 首轮：OK all-dims（seats-silence=0min/open=14/peer 宽限注记如实）。
2. 10:04:45Z 8713 addJob：**403 未触发=allowlist 精确匹配实证**；enabled=false 默认→PATCH true→nextRunAt 值面在。
3. 10:07:24Z sg 首轮真跑：揪出**探针形缺陷**（8710 旧公网面已退役却探）→删探针+`;` 前缀瑕疵修。
4. 10:08:55Z fleet 身份实跑：揪出 root 属主写不进+tmux root socket 不可达→chown fleet+sg d1 诚实降级（§六.1）。
5. 10:10:01Z **dev 首火（cron 上下文真执行=白名单+冷起链修通实证）**：同轮揪出两笔现役缺陷（§五）。
6. 10:14:26Z 补丁后 DryRun：recovered+fail counter 自复位+OK all-dims（peer=4min 正读数）；push 落盘值面（heartbeat-dev mtime 10:14:31Z 刷新）。
7. 10:15:53Z sg v4 fleet 实跑：OK all-dims（peer=0min）。
8. 痕迹卫生：sg 误报 failcount 残留两度即清（l2 构造轮同款纪律）；dev failcount 经 recovered 自复位。
9. **10:20:00Z dev 自然轮（cron 上下文，绝对路径 ssh 决定性验证轮）**：`OK all-dims (seats-silence=1min open=-1 peer=0min)`——runCount=2/lastRunStatus=ok；push 落盘值面=sg `heartbeat-dev` mtime 18:20:05 fleet 属主。**PATH-guard 修复在真 cron 生成面实证成立**。
10. 10:20:05Z sg 自然轮：`OK all-dims (peer=4min)`——peer=0/4 皆正读数（日志时戳=脚本起点，dev stat 在脚本尾部恰接 sg 新章，接力竞速自洽）；互备双向闭环（dev 章 push 落 sg + sg 章本地落、双侧对章判读全通）。

## 五、首火现形勘差两笔（已修，随卷披露）

1. **launcher PATH guard 无 `System32\OpenSSH` 目录**（本笔 finding）：cron 生成面裸 `ssh` 解析不到（Git\cmd 亦无 ssh.exe），2>$null 吞成静默无操作——10:10 首轮 push/stat 双哑实锚；我会话 PATH 含该目录故 DryRun 侥幸绿（**双宿主分叉型坑：同脚本两会话行为分叉**）。修法=b 案脚本内绝对路径 `C:\Windows\System32\OpenSSH\ssh.exe`（零 launcher 改动零旁系扩散）；launcher PATH 补目录候 CTO 域另裁（不影响本件现役）。
2. **d3c 任务态过滤缺 `Running`**：TriMLC Daemon 任务活实例态=Running，原过滤仅放行 Ready→首火假 issue（debounce 1/2 未外溢）。修=Ready|Running 双放行。

## 六、技术债务与诚实降级标注（如实全列）

1. **sg d1 席位静默判读缺席**：duty tmux socket=root 私有，job 身份（fleet）不可达——非不作为，身份墙实证后诚实降级；席位静默盯梢由 dev 侧承载（13 席 transcript 皆 dev 面）。候窗方案（值席位迁移/socket 共享/CLI 面探测）候 CTO 裁。
2. **d1 在办单解析脆弱性**：挂账台账现役项=中文数词行解析（十四→14）；台账描述行格式漂移即失效——失效形态=注记跳过（不假报不漏报双保守），候机器可读在办单源升格（CTO「钉死机器可读」正向形态候窗）。**10:20 轮实测一回失灵**（10:14/15 轮=14、10:20 轮=-1，疑 docs/memory 镜像并发写瞬时锁；该轮静默=1min 未触双条件，无告警影响），脆弱性实证在卷。
3. **notify payload JSON 注引**：issue 串拼入 JSON body 未做转义（现役 issue 源=枚举词+代码态，无引号源）；send-keys 文本已去单引号。候窗加转义。
4. **hop4=runbook 性质**：sg 物理独立位人工窗未自动化（超最小 sufficient 边界，如实披露）；hop1/hop2 真发路径**未实测**（构造真发=扰值席，守节流纪律）——N3 兜底链实测 10-08 STE 窗覆盖。
5. launcher `bak-pre-n2-20261007T100135Z` 候 CTO 验收毕清（l2 备份先例同款）。
6. 本机 8713「完成链断裂」缺陷（件③候窗）知情在案：N2 dev job 为潜在受害者，兜底=对侧互备 30min 过期判读——按 CTO 加固条件②设计自洽。

## 七、M3#9 节流对表

- 工序最小 sufficient：全链三段 commit（receipt 本卷独立一笔）；异常单列禁重跑（sg 8710 假探针/fleet 属主/tmux 降级/PATH finding 四笔均单列一次性修毕）；零重试循环；零新增模型调用（判据④取日志面）。

## 使用依据

- cto-n2-scheme-review-20261006.md（CTO APPROVE 附条件定形正身）
- window-order-20261007.md 段⑤+tree-plan lg065-duty-seat-bc-20261006（N2 节点+前置断言）
- coo-window-log-20261007.md（GO 17:39 三门+S2b token 勘差注记+M3#9 节流注记）
- tri-liveness-l1/l2.ps1（判活/送信链现役先例形）；TriMLC src/cron/types.ts+src/server/app.ts L4048+（POST 体形+P0-3 双入口）；TriMMC src/cron/routes.ts（payload 嵌套正形+run-now 端点）
- trimlc-daemon-channel.cmd（allowlist+PATH guard+token 源）；systemctl show trimc（fleet 身份实证）；seats.json（席位权威枚举面）
