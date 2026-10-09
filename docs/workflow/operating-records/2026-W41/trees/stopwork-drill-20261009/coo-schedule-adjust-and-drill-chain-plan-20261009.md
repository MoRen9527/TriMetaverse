# 10-09 排工避让调整+时段停工门演练落地链预案（COO 落地执行位）

- sourceOfTruth: 本件（trees/stopwork-drill-20261009/coo-schedule-adjust-and-drill-chain-plan-20261009.md）
- syncMode: rolling（14:00 分发/回执/18:00 复工实锚随链回写）
- lastSyncedAt: 2026-10-09T10:08:37+08:00（date 现查原值·**挂载窗六步全绿 PASS·窗毕 10:06**（FSD 毕报 10:07·毕报卷 fsd-mount-window-report-20261009.md @4f2d3fb7）：窗框 10:00-11:30 提前 84 分钟收·预检三查绿+六步读数全 PASS——窗毕锚入 §一.4·挂位链终态 8d0aa34b[58 9 9 10 \*·三影响收编形]）
- 令源: BOD 00:37:2x 令（CEO 00:36 令）两条；执行位: COO（令链落地执行位·演练验的就是本段）
- CFO 任务书: 已由 BOD 直发 CFO（时段门挂接+演练序五验收锚）——本席只承接令链落地与排工调整面

## 一、排工避让调整（①令）

1. **全线避让 14:00-17:50**（时段停工窗·全施工席停）；17:50 LG-066 开窗照旧（特窗优先·BOD 裁），18:00 复工与 LG-066 窗并行无冲突（LG-066 施工线=特窗例外段）。
2. **FSD 绩效脚本挂载窗改排：午前 10:00-11:30**（原「白窗」未锚时点·今锚定）。改排理由：
   - 18:00 后不可行——LG-066 段1/段2 执行位=SDE/FSD，18:00 后排绩效挂载与特窗抢 FSD 施工位；
   - 午前三步工序下限 ~30min（8713 优雅重启 trilc 权威路径→job 挂载 nextRunAtMs 值面对表→联审 job enable 翻真），1.5h 窗宽裕；
   - 10:00-11:30 在 GLM 轨黄金段内（18:00→次日 14:00）；8713 重启毕距 14:00 停工窗与 17:50 LG-066 开窗均留足缓冲（重启异常不撞窗）。
3. 10-10 12:00 联审（DEM-003/004）与 10-10 S3 窗（14:00-16:30·周六非停工演练日）不在避让面，照旧。
4. **挂载窗增件·窗序终稿（BOD 03:44 裁·本席 03:49 定稿·CTO 三点回点 03:48 并入·03:55 双刻勘正·08:27 判据勘定勘新）**：CTO 电源门通知链勘修件（commit **d7693c6**·build 03:47 已落位就绪）随第一步 8713 优雅重启带出，零额外重启；**预检提前不需要（build 现已就绪·09:57 照旧）**。窗序六步：
   - ①置位断言两读数（FSD 跑·贴读数 CTO 复核）：`grep -c "target_daemon: 'trimlc'" D:/Code/ai/TriMLC/dist/server/app.js` 预期 `1`；辅锚 `git -C D:/Code/ai/TriMLC log -1 --oneline` 预期 `d7693c6` 开头
   - ②8173 优雅重启（trilc 权威路径·随车部署修复 build）
   - ③healthz 探针（FSD：ok:true+uptime 重置+power 块在位）
   - ④**双刻探针**（08:27 CTO 判据勘定形·命令单=cto-notify-probe-command-card-20261009.md **@e138d8da**[P3 补勘毕·全卷双 200 单形零残留定版]·FSD 执行贴四行读数 CTO 复核）：**探针 A**（m-cos 源）预期 **200**=存量源回归对照；**探针 B**（power-gate 源）预期 **200**=新增源生效实证；**双 200=晨窗毕探 PASS**——A/B 任一得 403/400=白名单回退或配置漂移=**异常停报**（停报语义不弱化；token sed 提取形值面零出机·token_len=64 断言照旧）；窗内 B 重测价值=8713 优雅重启后链路复验（隧道 keeper+poller 活体确认）
   - ⑤job 挂载 nextRunAtMs 值面对表（2026-10-11 21:00+08·空则 PATCH 同值 schedule 触发 recompute）
   - ⑥联审 job enable 翻真
   - **如实注记一（08:3x 定版毕·原 403 中间态注记全链退役）**：source_seat 'power-gate' 白名单件已提前落位毕（CEO 08:14 令提前窗·CTO 08:26 毕报全绿：SOURCE_SEAT_WHITELIST 加 power-gate+trimc 重启+端到端实测 200+信箱落盘实证·留痕 cto-sg-powergate-whitelist-20261009.md @f5559cee）→④步探针 B 判据随缺口闭合勘 403→**200**（CTO 08:27 勘定回点）→FSD 换芯两轮定版：cd962747[08:32·按 @9ac5b647]→**d37091a1**[08:3x·按 **@e138d8da** P3 补勘零残留定版·同刻 09:57]——**挂位定版·probeB=403 旧形作废勿用·此后候窗静默**。
   - **如实注记二（R-1 过夜·CTO 快核卷 §二附注 @5c90deaa）**：若窗收过夜=8710 暗窗过夜，夜航探 8710 **预期红=暗窗非故障**，防误报刷屏。
   - **如实注记三（节拍件搭窗·BOD 09:41 报备·CEO 09:39 令·窗序零变化·09:50 勘落位毕态）**：BOD 节拍体系迁 8713 daemon cron（节拍 job=8713 cron 首个 job）——command 白名单追加系启动 env·**搭②步 8713 优雅重启随车带出·零额外重启窗**；**allowlist 追加已 09:48 落位毕**（trimlc-daemon-channel.cmd L25 字节面追加+CRLF 保形+行数断言过·赶上车点）——②重启照常带新 env；**重启后动作序列=BOD 面**：POST /internal/v1/cron/jobs[name=bod-tick-30min·cron 7,37 \* \* \* \* 上海时区]→预期 201→**next_run 值面验证**（F-3 已修值面照验）→与会话节拍双跑 1-2 拍观察→撤会话 cron 收口；重启后 8713 cron 出现 bod-tick 节拍 job 属**预期非异常**（FSD 判读勿误报）·拍报落盘 operating-records/<周>/trees/bod-tick/。节拍件施工/挂载归 BOD 面·窗序六步本体零变化·与 FSD S1-S6 零冲突（8713 cron 多 job 并存）。
   - **如实注记四（CTO 挂载窗三影响·BOD 09:52 转同步·勘记卷 cto-8713-death-cause-20261009 @b1323f31 在树）**：①**d7693c6 置位断言 CTO 已替跑全绿**（grep trimlc=1+git 顶+mtime 03:47）——FSD 窗内照跑=双确认（或引卷）·S2 重启环节随之纯化；②**probeA/B 双 200 判据不变**；③**notifyFailures「7→0 真闸清零」验证形作废**——7 基线已随 08:39 死机重启物理归零·**新锚=真闸时恒 0+channel.log 投递痕迹**（窗内 S4/S5 若含 7→0 断言按新锚判读）。附候编排注记：8713 死因定谳=今晨 08:39 整机待机转换清理（复发态非偶发·watchdog 全史 11 次 DOWN）·结构修方案稿候 10-11 周日窗族[与 8711 复活+sgB 部署+black-formatter 复探并窗族]——正式排窗届时走本席编排。
   - **✅ 窗毕锚（10:06·六步全绿 PASS·FSD 毕报 10:07:51·毕报卷 fsd-mount-window-report-20261009.md @4f2d3fb7[trees/coo-dispatch-20261008/]）**：窗框 10:00-11:30 提前 84 分钟收。预检三查绿（healthz+jobs 8 清单+allowlist 双件实证）；S1 双确认绿（grep=1+d7693c6+mtime 与 @b1323f31 一致）；S2 优雅重启毕（旧 pid 36444 EXITED→schtasks 正形冷起 pid 24164·随车新 allowlist env）；S3 healthz 绿（双 connected·notifyFailures=0 新锚记录）；S4 **双 200 PASS**（token_len=64·probeA=200+probeB=200 双刻齐）；S5 绩效 job 挂载 201+nextRunAt=2026-10-11T13:00Z=**21:00+08 正中**（F-3 未现）；S6 联审 job enable 翻真——nextRunAt 初值停摆 10-03→PATCH 同值 recompute 修正至 **2026-10-10T04:00Z=明 12:00+08 正中**（API 正途禁手写库）。窗内注记三条：端点勘正[/api→/internal/v1 正形]·S2 冷起 Start-ScheduledTask 正形[Git Bash /run MSYS 毁参坑记录]·S6 F-3 族伴生新形态[enable 翻真不滚 next_run_at·实录候 CTO 域归档]。挂位链终态=f6eb237b→cd962747→d37091a1→**8d0aa34b**[58 9 9 10 \*·三影响收编形]；bod-tick 未在预检列=非异常（BOD 面②后自挂·双跑观察候 BOD 面读数）。

## 二、演练落地链预案（②令·14:00 触发）

| 步 | 时点 | 动作 | 留痕 |
|---|---|---|---|
| 1 | 14:00 | CFO 停工令达本席 | 令文现戳引用 |
| 2 | 令达即 | 本席分发全施工席（SDE/FSD/STE/CTO 施工面四席·SendMessage 直达照 M-004） | 分发信各一 |
| 3 | 令达-14:1x | 各席停工态回执本席收齐 | 回执逐席对表 |
| 4 | 18:00 | 复工令达→同链分发/回执 | 同链留痕 |
| 5 | 链毕 | 本回写区补实锚（分发时刻/回执时刻/收齐判定）→ 毕报 BOD | 本卷回写 |

- 值席注：13 席无独立值席名址；分发面=本地在线施工面席（m-sde/m-fsd/m-ste/m-cto）；sg 面（如涉）不经本席中转（M 面路由原则）。
- 非施工面席（CFO/CHO/CAO/CMO/CPO/CSO/COS/RDT）不在「全施工席停」分发面——BOD 令原文「全施工席停」按施工面读；若 CFO 任务书定义更宽以任务书为准（候 14:00 令文对表）。
- LG-066 窗令在施工位（SDE/FSD）已有窗前清单六项五毕——17:50 开窗不受演练影响（特窗例外段·BOD 已裁）。

## 三、实锚回写区（随链补）

- （候 14:00 停工令达→分发/回执实锚；候 18:00 复工同链实锚）

## 使用依据

- BOD 00:37:2x 令原文两条（CEO 00:36 令）
- 排工卷 dispatch-20261008.md（白窗绩效挂载原排）+窗令 window-order-20261009-v2.md（LG-066 照旧）
- CFO 锚读数惯例（今日三锚照旧·CFO 面）
