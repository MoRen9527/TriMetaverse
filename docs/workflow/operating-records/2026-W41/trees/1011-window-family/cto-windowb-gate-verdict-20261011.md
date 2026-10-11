# CTO 栏 B 门禁终裁卷 · 三件独立复核+裁决（2026-10-11 晨窗）

- sourceOfTruth: 本卷（trees/1011-window-family/cto-windowb-gate-verdict-20261011.md）
- syncMode: static（门禁终裁终卷）
- lastSyncedAt: 2026-10-11T09:46:58+08:00（date 现查原值·UTC 01:46:58Z）
- 收口席: CTO 小狄（m-cto）；对表对象=fsd-windowb-execution-report-20261011.md @d0cb0db8；判据真源=BOD 07:58 开窗令门禁三件+cto-windowb-gate-verdict-20261010.md
- 收口判：**APPROVE（四门独立验全绿·两裁决采纳·一自录）**

## 一、四门独立验终读（本席独立路·非转抄）

| 门 | 本席独立验路 | 读数 | 判 |
|---|---|---|---|
| ① 进程内生效 | healthz 活体+listen pid+CIM created+executor 滚拍活证 | 现役 pid **42820**（created 09:32:12.561·cmdline=TriMLC dist/index.js 正身）·healthz ok=true·executor 活证=01:35Z/01:40Z 拍 ok 无缝 | PASS |
| ② 三新 job 门 | node:sqlite 只读独立验（正身库见 §五.2 对象勘误） | jobCount=**13**·**enabled=1 ×13 全员**·三新 job next_run 全非空：job①→10-12T01:30Z（明日 09:30+08·首滚后正常滚）·job②→10-11T10:00Z（18:00+08）·job③→01:45Z（5min 节拍中） | PASS |
| ③ allowlist+执行链 | execution_log 全史独立查 | job③ 四滚 **01:25/30/35/40Z 全 ok·5min 节拍均匀**（id 23648/23665 与 FSD 卷逐字对上+毕报后 23674/23685 两滚延续）·job① 首滚 23664 ok·**今日 01:25Z 后零新 fail** | PASS |
| ④ DEM-004 首行 schema | jsonl 独立读+@5ceb13e9 对表 | rowCount=**1**（干跑行已删）·row_id=obs-20261011-0930-01·ts=2026-10-11T01:30:33.949Z 机写 Z 尾·**五要素全非空**（plane=M/service_domain=local/account=tail:VWi3Dmsf 掩形合规/model=glm-coding-plan/quota_used=**32** int·与 08:10 干跑 31 真实推进自洽）·metric_basis 在·thresholds_snapshot 全值含 asof·line_status 首日显式形 no-prior-anchor | PASS |

## 二、pid 更替疑点归因（watchdog 自愈·非卷外动作·铁证三行）

- **疑点**：FSD 卷门①读数 pid=43480（09:19:48 /run 起），本席活体探针 listen pid=**42820**+uptime 起 09:32:12——卷内无录的进程更替。
- **归因铁证**（trilc-channel/watchdog.log 今日全笔三行）：
  - `09:32:11.742 DOWN (fail 1/3) -> reviving via trimlc-daemon-channel.cmd`
  - `09:32:17.360 revive self-check OK (healthz green within 90s)`
  - `09:37:20 recovered; fail counter reset`
- **序列还原**：43480 于 09:30:34（最后执行 job③/① 双滚 ok·execution_log 实锚）→09:32:11（watchdog DOWN）之间死亡，**窗口≈98 秒**；watchdog 下一拍探测失败即 revive→42820 起→90s 内 healthz 绿→01:35Z 拍无缝接上**零拍丢**。FSD 毕报 09:34:56 发出时现役已是 42820——FSD 卷 43480 读数系其采集时点（09:20-09:30）有效值，更替发生其后，**非 FSD 卷面过错**。
- **43480 死因未锚如实**：死亡窗口 98s 内、死因无日志锚（watchdog 只记 DOWN 不记死因；node 崩/被杀不可辨）——**业务损害≈零**（零拍丢+98s 停摆+watchdog 兜住），不再追勘；如实挂知情。
- **防线价值双实证**：①watchdog 保活按设计动作（DOWN→revive→self-check→recovered 全链 6min）；②本席门禁位 uptime/pid 断言抓到卷外更替疑点并完成归因——「重启窗完工判据=进程内生效验证」纪律面再显效。

## 三、FSD 三建议+COO 三件移交裁决（全部 APPROVE）

| # | 件 | 裁 | 落点 |
|---|---|---|---|
| ① | 重启链缺陷：`/end` 报 SUCCESS 旧进程存活（任务实例句柄丢失型·EADDRINUSE 静默退出·任务态 Ready 掩盖）；正形=POST /shutdown（token 门）→验 port FREE→/run | **APPROVE 入册**·并族新增本卷 §五.3 变体 | 记忆条 trilc-daemon-restart-discipline 增补「/end 不可靠·/shutdown 正形」；纪律册面候 CAO（本席不直接改册） |
| ② | F-3 新变体：POST 201+next_run 非空仍不充分（enabled 缺省 False 永不触发）；判定升三查 201+next_run 非空+**enabled=true**·payload 显式带 enabled | **APPROVE**·8711 现役 F-3 修复窗并族采纳（值席段挂账） | 记忆条 trimc-mlc-addjob-divergence 增补三查正形 |
| ③ | executor 停摆家族第三形态（8713 形·l1 01:15Z 真告警 38min·healthz 假绿） | **APPROVE 并族**：TriMMC 8710（10-01/10-02）+TriMLC 8713（本次）同签名两形态在册·8711 l1 探针域同族候勘——根因勘候窗并族线排期，l1 探针=真信号源论据+1 | 根因勘窗排程由本席组合排（候窗；不阻塞本窗收口） |

## 四、门禁增量锚定稿（窗令两候选采纳）

- **锚A（重启链）**：daemon 重启窗完工判据=**进程内生效验证三断言**——uptime 重置+pid/CIM created 对表+watchdog.log 旁证扫描（复活事件会改 pid·门禁位必须重对表现势而非引用施工时点读数——本卷 §二即实证）。
- **锚B（F-3 三查）**：cron job POST 后验证门=**201+next_run_at 值面非空+enabled=true 三查齐**（双路：API 投影+sqlite 只读）；payload 正形显式 `enabled:true`。影子期资格门判读机不含此锚（域不同），运行面 cron 验收一律按三查。

## 五、知情与自录（如实）

1. **旧进程病征补充证据**：execution_log 今日 01:00Z 后非 ok 两行=job cron_muo2mj6s_cco2 timeout×2（01:00:45Z 787s 超时·01:20:18Z 600s 超时）——均发生在 09:16 重启**前**旧进程当值期，系「调度活执行停」病征族补充证据；重启后（01:25Z 起）零新 fail。该 job 下拍 01:45Z 候验恢复（不动门）。
2. **本席对象错位自录**：门②首发探 `%LOCALAPPDATA%\trilc\cron.db`（8711 TriRLC 库）得 jobCount=0 矛盾信号——实为探错 daemon 对象；正身=8713 TriMLC 启动链 `TRILC_DATA_DIR=trilc-channel`→`%LOCALAPPDATA%\trilc-channel\cron.db`。被矛盾信号拦下即纠——daemon 机位/store 位断言「先活体现探禁推定」纪律再犯风险实测拦截，机位矩阵条增补「**store 位同理**：双 daemon 双 store（trilc\=8711 默认·trilc-channel\=8713 启动链显式）探库先对 DATA_DIR」。
3. **watchdog 形管理面脱钩**：watchdog revive 走直接跑 channel.cmd（非 schtasks /run——任务 LastRunTime 停 09:19:48 铁证）→进程活着而任务态 Ready，**/end 管理面对 watchdog 形进程打空**——§三①「/end 不可靠」变体+1，并族知情。
4. job① 附加键超 CPO schema v1 字段表（fiveh_pct/fiveh_reset/weekly_reset/plan_level/fiveh_watch）——候 CPO v2 收编或裁剪（锚⑤机扫不破坏·FSD §五.5 同判）；model=glm-coding-plan 语义候 CPO 确认（§五.6 同判）——两件候 CPO 面非门项。
5. 今晚验证拍照 BOD/COO 知情：21:00 绩效 job=重启后首验点（三查门覆盖）+23:10 周平面迁移旁证。

## 六、使用依据

- FSD 毕报卷 @d0cb0db8（本卷唯一对表对象·四门读数逐项独立重测）
- BOD 07:58 开窗令（门禁三件+F-3 警示+毕报链）；COO 09:43 收口回点（@ebc4d10a 收口卷·三件移交）
- CPO schema v1 @5ceb13e9（门④判据）
- 正身库 `%LOCALAPPDATA%\trilc-channel\cron.db`（node:sqlite 只读）+watchdog.log+schtasks 任务信息+CIM 进程实探
- 记忆条：daemon-plane-locality-matrix（§五.2 增补）/trilc-daemon-restart-discipline（§三①）/trimc-mlc-addjob-divergence（§三②③）/restart-window-completion-criteria（锚A 同源）

——CTO 小狄，栏 B 门禁终裁毕。毕报链：COO（督办回点）→窗收口 BOD。
