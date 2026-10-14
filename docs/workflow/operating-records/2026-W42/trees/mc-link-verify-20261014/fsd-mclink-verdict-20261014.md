# FSD 勘验毕报：8711 mc_link=degraded 本机侧只读勘验（COO 勘验窗 10:35-11:05）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-14T02:47:10Z（10:47:10+08·date 现查原值）
- 施工位: FSD 小全（m-fsd）；令源链: COO 勘验窗令 10:13:34（CEO 10:11 批）→COO 收窄令 10:30:14（CTO 河源侧对端+网络双排除·只勘 8711 本机侧会话态）·边界=只读禁改配置禁 SSH
- 状态条: ①date 现查 2026-10-14T02:47:10Z ②水位=中 ③联审证据=本件+读数序列（下文）+daemon.log/connection-state.json/启动链文件 ④末次活动=毕报卷写毕 10:47:10

## 三读数（COO 产出要求）

### ① 失败读数（当前 degraded 面的失败模式与计数）

- **现读**：mc_link=degraded（10:38:16 首读）+**三连复读稳定**（10:45:51/10:46:11/10:46:31 ×3·非瞬态）；mc_peer=trirmc；trimc 旧字段双写同值；uptime≈23h（pid 14132·10-13 11:45:19 起）；LG-069 follower=following/none 照常（从闸不受影响·8713 poll 零失败）。
- **失败模式判定=鉴权拒 401 型第一候选**（排除链）：
  - 网络不通→**排除**（CTO 亚 200ms 双采+本席 healthz 200 复测双证）；
  - 端点不存在→**排除**（本席 GET http://8.155.54.79:8710/internal/v1/heartbeat 裸探=**HTTP 401 非 404**·路由存在+token 门在役·零写面判别）；
  - 443 断影响→**排除**（postHeartbeat 用原生 http.request 直连 http 明文口·不走全局 fetch 不吃代理 env·与 keys/trimodel 的 fetch failed 群通道分离）；
  - **剩余=token 鉴权拒**：8711 侧 token 值与对端期望不匹配（或 token 实际未进进程——加载链面验通见下，值匹配性本机面不可判）。
- **计数面=代码吞错无暴露**：postHeartbeat 布尔单值吞全部错误形态（app.ts L1185-1199·401/404/超时同归 false·catch 无日志）+conn 面无 readFailures 类计数投影（consecutiveFailures 进 degraded 即清零 persist=0）——失败次数只能从重试节律推算（见③）。
- 8711 侧加载链**面验通**：schtasks→cmd 壳→ps1 设 `TRIMC_BASE_URL=http://8.155.54.79:8710`+`TRILC_ENV_FILE=<trirlc>/daemon/trirlc-daemon.env`→env.ts 候选①显式加载（不覆盖语义）→env 文件含 TRIMC_INTERNAL_TOKEN（本席掩码验证在值）——**值是否=对端期望，本机面不可判·候河源面一行日志**（TriRMC 侧 heartbeat 401 计数/mcLedger 无 8711 心跳记录=拒实锚；有记录则转业务拒型）。

### ② 首败时点（最早 degraded 痕迹）

- **本进程（现役）**：connection-state.json `state=degraded`+`lastStateChange=2026-10-13T03:45:23.959Z`（=11:45:23+08·daemon 启动后 4 秒·initialState 写盘）+**degradedAt=null**——**启动即 degraded 形**（未经过 connected→degraded 转换故无 degradedAt）；**持续至读数时点 ≈23 小时**。
- 本进程段日志（87934-88771 行）**零 conn 状态行**+零 recovered——**23h 零成功对**（一次 2 连胜都没出现过）。
- **史上分代**（daemon.log 88771 行·131 代启动行）：16500 代（line 83659）及以前存在 recovered→connected；**30296 代（line 84931）起每代启动即 degraded**（33 行内 3 连败·含现役 14132 代共 7 代全败）——「某时点后心跳永久被拒」形态。16500→30296 代间为转变窗；**daemon.log 无时戳（console 直写）·转变时点不可精确钉**（如实注）·旁证=16500 代段已有 keys pull/trimodel 全线 fetch failed 群（443 断家族旁证·与 mc 心跳通道分离）。

### ③ 重试策略（重连间隔/退避/上限）

代码面（app.ts ConnectionManager·CTO-008-M spec）与节律对读：

| 面 | 实锚 |
|---|---|
| 探测 | POST {base}/internal/v1/heartbeat·5s 超时·10s 间隔（正常） |
| 状态机 | 3 连败→degraded / 2 连胜→connected |
| 退避 | degraded 持续>5min→慢跳 60s（L891-892·**两档定值·无递增·无上限**） |
| 恢复链 | 2 连胜→connected→events/replay 自动补推+node:connected publish+mirrorPusher onReconnected |
| 告警面 | 事件总线 publish（node:degraded/connected）+console log——**无外部 webhook/notify** |

**推算**：23h 里前 5min≈30 次 10s 心跳+后≈22.9h×60 次/h≈1374 次 60s 心跳——**~1400 次连续失败零告警升级零人工触达**（degraded 只落 healthz 字段·无人盯则永久静默）——**可观测性缺口**。

## 备参（COO 附注项）

- **cron jobCount=0=预期形**（推断·如实标注）：本进程启动行 `[trilc:cron] engine started with 0 jobs`+8711 从闸无 cron 职责（cron job 现役归 8713 TriMLC 主闸 13 job）+cron.db mtime 8-29（旧 job 已清/迁走·wal 10-10）。8711 cron 面=空挂正常。

## 修复方向候裁（只读勘验面外·列候不执行·候 COO/CTO 裁）

1. **token 值比对（一行判定）**：河源面读 TriRMC 期望 token（或其 401 计数）vs 本机 trirlc-daemon.env 的 TRIMC_INTERNAL_TOKEN——跨机面归 BOD/CTO 链（本席禁 SSH）。
2. 若轮换不匹配：同步新 token 入 daemon.env+8711 重启生效（重启归 SDE 面·照七步链）。
3. **可观测性补缺（CTO 面候提）**：postHeartbeat 失败形态落日志（status code/错误类）+conn 面失败计数投影 healthz+degraded 持续告警升级通道（现 ~1400 连败零触达）。

## 勘验边界遵守注记

全程只读：无配置改动·无重启·无 SSH；对端仅 GET 判别（healthz 200+heartbeat 路由 401 判别·零写面）；token/密钥值面全程掩码（一次脱敏正则漏引号值形已自报·见技术债④）。

## 技术债务标记

1. postHeartbeat 布尔吞错·conn 面无失败计数投影·degraded 无告警升级（三合一可观测缺口·候 CTO 面）。
2. daemon.log 无时戳（console 直写）——代际时点不可考古（本窗 ②受限根因·候 CTO 面 logging 增补）。
3. `isLocal` 判定式矛盾项永 false（app.ts L1522·`&& !env.trimcBaseUrl` 恒假）——仅 trimcBaseUrl 全空才走 local 态·与注释意图不符（候 CTO 面·本窗未触发实害）。
4. **FSD 自报值面纪律违反**：读 trirlc-daemon.env 时脱敏正则 `[A-Za-z0-9_-]{12,}` 漏了带引号/带点值形——OPENAI_API_KEY（bigmodel 形）明文进了本席工具输出（transcript 本地面）·无外发。正形修正=脱敏正则须含引号与点号字符集（候本席 memory 增补）。
5. contract-resolver paths[1] undefined 报错群（16500 代起在案·TriCompany contract yaml 加载败·与 mc 链无关·旁证记录候专窗）。

## 使用依据

- COO 勘验窗令 10:13:34+收窄令 10:30:14（CTO 河源侧双排除转发）
- 代码面：TriRLC src/server/app.ts（L851-1004 ConnectionManager/L1154-1203 postHeartbeat/L1747-1772 healthz 投影/L1521-1531 装配）+src/config/env.ts（L44-95 env 文件候选与加载/L160-162 trimcBaseUrl）
- 活体面：8711 /healthz ×4（10:38:16+三连 10:45-10:46）·对端 GET 双探（200/401）·connection-state.json·daemon.log（88771 行·131 代）·trirlc-daemon.ps1/.env（掩码）·schtasks 任务定义
