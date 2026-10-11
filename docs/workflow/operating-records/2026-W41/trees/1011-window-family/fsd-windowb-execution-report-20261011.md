# FSD 栏 B 窗毕报 · 8713 并批三件一次重启（施工消费卷 v3.1 执行实录）

- sourceOfTruth: 本件（trees/1011-window-family/fsd-windowb-execution-report-20261011.md）
- syncMode: static（毕报卷·落盘即锚）
- lastSyncedAt: 2026-10-11T01:34:56Z（09:34:56+08·date 现查原值）
- 执行位: FSD 小全（m-fsd）
- 令源链: BOD 2026-10-11T07:58:56+08 即刻开窗令（CEO 07:58 令栏 B 现在开·硬锚 11:00）→施工消费卷 fsd-windowb-prep-checklist-20261010.md v3.1（@89565265 现行）+CTO 门禁卷 cto-windowb-gate-verdict-20261010.md
- 状态条: ①date 现查 2026-10-11T00:02:42Z（08:02+08·窗内开工时）②水位自估=中（窗内高负载段已过·收口期）③联审证据=本卷④末次活动=本卷 lastSyncedAt

## 一、结论

**三件全落·完工门四项全绿·硬锚 11:00 前 09:32 全毕**。窗内处置事故两起（均即停即修零滑步）：①`/end TriMLC Daemon` 报 SUCCESS 但旧进程存活（10-09 22:55:57 起的 17936·任务实例句柄丢失型）——**POST /shutdown 优雅停正形修复**（200 shutting down→8713 FREE→/run 新起 43480·uptime 123747→2 重置）；②POST 三 job 201 但 **enabled 缺省 False**（payload 缺 enabled 字段→引擎缺省 False=永不触发·F-3 家族新变体：201+next_run 非空+enabled=False）——PATCH enabled:true×3 修复（全 200·双路落库复验 True）。**附带重大发现：旧进程 executor 已停摆**（l1 01:15Z 真告警 bod-tick next-run-stale 38min=09:07 拍丢在重启前旧进程当值期·「调度活执行停」家族性缺陷暴露）——本次重启顺带修复·01:25Z recovered。

## 二、步 1 准备段读数（08:02-08:12 已毕·实录）

| # | 项 | 读数 | 判 |
|---|---|---|---|
| 1 | 端点实测（CTO 验收锚·禁转抄） | `GET https://open.bigmodel.cn/api/monitor/usage/quota/limit`·Authorization 裸值→HTTP 200 success:true level=max·data.limits[] 三型（unit6/num1=周窗 31%·unit3/num5=5h 窗 1%·TIME_LIMIT 无关套餐）·key 尾 Dmsf（len49） | PASS |
| 2 | GLM_API_KEY env 勘误 | 尾 VRyY 枚=code 1000 身份验证失败（**非 Coding Plan key·实测实锚**）→改设 User env `GLM_CODING_KEY`（sg-glm-direct.txt 活枚·值零回显） | 勘正入卷 |
| 3 | env→schtasks 链实证 | 临时探针任务 FSD-EnvProbe：Result=0x0·ENV-READ len=49（首轮 7s 超时假阴性·10s 定谳）——daemon 同链新进程可读 User env | PASS |
| 4 | job① 三件 | glm-quota-obs.mjs+config.json+thresholds.json 落 scripts/ops-local/·node --check=0·干跑全链 row=obs-20261011-0810-01 weekly=31% fiveh=1% thresholds=loaded·负验证（缺 key→FATAL exit2 零行）·**干跑行已删**（08:10 非锚行防污染明日同锚差分·09:30 起正式行） | PASS |
| 5 | job① 首行 schema 自扫 | 五要素全非空（M/local/tail:VWi3Dmsf/glm-coding-plan/provider）·ts 机写 Z·quota_used=31·thresholds_snapshot 全值·line_status observe=normal+warn/pause=no-prior-anchor（首日显式形）·weekly_reset=2026-10-14T12:44:33Z=20:44+08 与 CFO 卷秒级吻合 | PASS |
| 6 | job② | window-dispatch-remind.mjs 落位·node --check=0·干跑 log 落位 | PASS |
| 7 | channel.cmd 手术 | 备份 .bak-pre-windowb-20261011 md5=1D477FEC23FCF70F5E1E861B422DB338（双录）→L25 行尾追加三串（latin1 字节保真·行内追加零新行）→CR 39→39 零差·byteDelta=240 精确·commas 12→15 | PASS |
| 8 | 剥启动行探针 | 副本剥 cd+node 启动行+@echo off→cmd 解析 parsedStrCount=15（12 原串+[13]glm-quota-obs+[14]window-dispatch-remind+[15]tri-liveness-l1.ps1 按序）·batch 语法完好 | PASS |

## 三、步 2-9 序列读数（实录·主选窗滑至备选窗 09:16-09:26）

| 步 | 时点(+08) | 读数 | 判 |
|---|---|---|---|
| 2 重启三连 | 09:16:13-45 | /end Watchdog SUCCESS→/end Daemon SUCCESS→/run SUCCESS——**但步 3 揪出旧进程存活**（详见 §五.1） | FAIL→修复→PASS |
| 3 uptime 重置 | 09:17-09:20 | 首验揪矛盾：uptime=123704s=34.4h 与 CIM created=10-09 22:55:57 精确拟合=旧进程 17936 活着（listen 稳定·任务态 Ready 异常）→**POST /shutdown 优雅停 200**（「 shutting down」→8713 FREE）→/run 新起→**uptime 123747→2**·pid 17936→**43480**·taskstate=Running | PASS（修复后） |
| 4 零丢拍三对表 | 09:20:38 | jobCount=**10**+迁移 job nextRun=15:10Z=**23:10+08** ✓+绩效 job nextRun=13:00Z=**21:00+08** ✓——三项全绿 | PASS |
| 5 POST 三 job | 09:21:07 | **201×3**（旧进程活着则必 403=allowlist 生效旁证成立）：job① cron_mv3505vw_jev6 nextRun=01:30Z=09:30+08·job② cron_mv3506hp_nh7t nextRun=10:00Z=18:00+08·job③ cron_mv3506jr_xaz7 nextRun=01:25Z=09:25+08 | PASS |
| 6 next_run 双路 | 09:22 | sqlite 只读+JSON 投影双路**全同值非空**·jobCount 投影=13——**但揪出 enabled=0/False×3**（POST payload 缺 enabled→引擎缺省 False）→PATCH enabled:true×3 全 200·双路复验 True | FAIL→修复→PASS |
| 7 job③ 首滚 | 09:25:02Z | execution_log id=23648 **status=ok**·5896ms·error=None（两形双证之 log 行：l1.log 01:25 双行 OK 见 §五.4） | PASS |
| 8 L1 disable | 09:25:1x | schtasks /change /disable SUCCESS·state=Disabled（距下一拍 09:30 有 4min50s 安全区·禁 delete·回滚=re-enable） | PASS |
| 9 第二滚+唯一写者+09:30 机扫 | 09:30-09:32 | job③ 第二滚 id=23665 **ok**（01:30:34Z·7277ms）+l1.log 01:30Z **恰一行**（唯一写者断言 PASS·schtasks 已 disabled 零行佐证）+job① 首滚 id=23664 ok（01:30:32Z·1093ms）→jsonl 正式首行机扫见门④ | PASS |

## 四、完工门四项读数（全绿）

| 门 | 读数 | 判 |
|---|---|---|
| ① 进程内生效 | healthz ok=true·uptime **123747→2 重置**·listen pid **17936→43480**（CIM created=10-11 01:20 新进程）·jobCount=**13**（10+3）·taskstate=Running | PASS |
| ② 三新 job next_run 非空 | sqlite 只读+JSON 投影**双路同值**：01:30Z / 10:00Z / 01:25Z | PASS |
| ③ allowlist 生效+执行链 | POST **201×3**（403 反例=旧进程期已实证）+job③ 首滚 23648 ok+**第二滚 23665 ok** | PASS |
| ④ DEM-004 首验行 schema 机扫 | jsonl rowCount=1（干跑行已删·正式行唯一）：`obs-20261011-0930-01` ts=2026-10-11T01:30:33.949Z 机写·quota_used=**32**（31→32 真实推进自洽）·五要素全非空+ts Z 尾+quota_used int——**锚⑤判法 PASS** | PASS |

## 五、知情项与技术债（如实）

1. **重启链缺陷发现（CTO 面增量锚候选）**：`schtasks /end` 报 SUCCESS 但旧进程存活（任务实例句柄丢失型——任务重新注册过/实例句柄失效时 /end 空转）·新实例 EADDRINUSE 静默退出·任务态回 Ready 掩盖。**正形修复链=POST /shutdown（token 门）→验 port FREE→/run**——「重启窗完工判据=进程内生效验证（uptime 重置断言）」门在本窗实弹拦下此坑（若无 uptime 断言·新 env/新 allowlist 全部静默不生效·POST 必 403）。
2. **F-3 家族新变体（CTO 面增量锚候选）**：POST 201+next_run_at 双路非空**仍不充分**——enabled 缺省 False=永不触发。判定面升三查：201+next_run 非空+**enabled=true**（本次靠步 6 双路对表顺手抓出）。POST payload 建议显式带 enabled:true（引擎缺省 False 与现役直觉相反）。
3. **旧进程 executor 停摆暴露（家族性缺陷·候 CTO 勘）**：l1.log 01:15Z ALERT-SENT 200 真告警「bod-tick next-run-stale 38min」——09:07 拍丢在重启（09:16）**之前**旧进程当值期=「TriMMC executor 调度活执行停」同族缺陷 8713 形实证；01:25Z recovered=重启修复。旧进程 34h 僵活期间 executor 停·healthz 假绿——l1 探针是真信号源。
4. **09:25 双跑双行（备选窗固有代价·知情）**：POST 09:21→job③ 首滚 09:25 与 schtasks 末拍 09:25 同刻——l1.log 01:25 两行 OK（04.0405/04.0415μs 级差）·双跑一轮无害（l1 幂等探针）·01:30 起唯一写者。
5. job① 附加键超出 CPO schema v1 字段表（fiveh_pct/fiveh_reset/weekly_reset/plan_level/fiveh_watch）——CFO input 行样例同形·候 CPO v2 收编或裁剪（锚⑤机扫不破坏：必填字段全非空）。
6. model 字段取值 `glm-coding-plan`——观测对象=套餐池非单模型，CPO schema「模型标识」语义候确认。
7. 阈值数值=CFO input 信面值（observe70/pace15/pause30/5h70/90·asof 10-08）——候 CFO 正身，config/thresholds 文件面替换零代码改。
8. env GLM_CODING_KEY 新增——User 作用域·值=sg-glm-direct.txt 活枚（尾 Dmsf）·GLM_API_KEY（尾 VRyY）经实测非 Coding Plan key 留原位未动（TriStaciss 链自用）。
9. 干跑行删除决策在卷（§二.4）——jsonl 09:30 起正式行，首日 warn/pause=no-prior-anchor 显式形。
10. job② 首滚=今日 18:00 窗外（POST 09:21>09:00 拍）——v3.1 副产锚条件不成立·知情非门项（job② 门=POST 201+实存+node --check 双门已过）。
11. 时序滑窗如实：主选收敛窗 08:46-08:56 因等待循环分段超时滑至**备选窗 09:16-09:26**——备选窗为 v3.1 预载方案·POST 09:21<09:30 红线守住·零红线触碰。
12. pidfile 断言不适用如实注记：TriMLC 8713 无 pidfile 文件产出（目录无 *.pid）——进程身份断言以 listen pid+CIM created 对表替代（双重对表：43480==listen·created=01:20 重启窗内）。

## 六、回滚锚（现状）

- channel.cmd 回拷 `.bak-pre-windowb-20261011`（md5 1D477FEC23FCF70F5E1E861B422DB338）+POST /shutdown→/run Daemon（≤5min·**/end 已证不可靠·回滚走 /shutdown 正形**）
- 三 job DELETE（API·id 三枚在 §三.5）·TriLiveness-L1 re-enable（schtasks /change /enable）·watchdog 复位 Ready 确认
- User env GLM_CODING_KEY 可留（无副作用·脚本显式消费）

## 七、毕报链与旁证

- 毕报时点：2026-10-11T01:34:56Z（09:34:56+08·date 现查原值·落款即此值）
- 旁证链：**bod-tick 09:37:00+08 拍 status=ok 窗内已验**（恢复实证第二刀·lastRunAt=01:37:00Z·nextRun=02:07Z=10:07+08 节拍正常）+watchdog 复位 Ready 确认（09:39）+当晚 23:10 周平面迁移读数（窗后引·v3.1 保留条款）+窗内 09:30 job① 首滚读数（本卷 §三门④·窗内化已验）+21:00 绩效 job=重启后首验点（BOD 指定·候当晚读数）
- 转发链：本席→CTO+COO（SendMessage）→窗收口毕报 BOD

## 使用依据

## 使用依据

- 施工消费卷 fsd-windowb-prep-checklist-20261010.md v3.1（@89565265）·CTO 门禁卷（@894ec51d+@831f3f66）
- CPO schema v1 @5ceb13e9·CFO input 信（cfo-dem004-quota-observation-inputs.md）·BOD 端点调研卷 ccswitch-quota-endpoint-research.md（bcec4e825——端点线索源·本窗独立重测非转抄）
- 纪律册: CRLF 保存法/F-3 家族/禁裸杀/值面禁进打印路径/假阴性排除（键存在性≠值面·探针先排除执行失败）
