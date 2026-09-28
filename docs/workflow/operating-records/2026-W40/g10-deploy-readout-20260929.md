# G10 部署步读数卷（TriModel P0 泛化层 daemon 侧·SDE 小布）

- sourceOfTruth: 本件（G10 双仓 rebuild+双 daemon 重启执行读数与验收证据）
- syncMode: source-only
- lastSyncedAt: 2026-09-29T00:12+0800（date 现查 UTC=2026-09-28T16:12:10Z）
- 令链: CEO 23:39 深夜提速直令（LG-058 G10 今晚做）→ BOD 23:41 加急派工直达本席（eb8ebb21 接令回执）
- 边界: 本席执行部署；发布 readiness 裁决归 CTO；本卷只呈读数

## 一、部署计划（执行前定案）

- 目标: ①TriMLC（D:/Code/ai/TriMLC）npm run build→8713 重启 ②TriRLC（D:/Code/ai/TriRLC）同→8711 重启
- 变更内容: 两仓 HEAD（TriMLC=6e4feb3 / TriRLC=1af0908，均含 N4 config 五路由真链路案）→ dist 产物换代
- 回滚方案: `dist.bak-pre-g10-20260928T235620+0800` 双仓备份（TriMLC 2.1M / TriRLC 5.2M）+ 各自权威 launcher 原序重启。**未动用**。
- 自检清单: stop 前监听 pid==pidfile 验 / 父 cmd 链消亡验 / pidfile 对表 / healthz jobCount+degraded / config 命令族活体 / 拉取链活体

## 二、步 1 勘验读数（23:4x-23:5x）

1. 基线: 8713 trimlc ok（uptime 73980s）/ 8711 trirlc ok（uptime 946365s）；监听 8713=34396、8711=35812（netstat+cmdline 双正名）
2. pidfile 对表: 8713 权威位 `~/.trimetaverse/trilc.pid`=34396（mtime 09-28 03:09 boot 登记）**PASS**；`AppData\Local\trimlc-channel\trilc.pid`=31460（Sep 2）系陈旧旁落件不在 CLI 读链（PID_DIR=~/.trimetaverse，paths.ts 实锚），仅记档未动
3. 8711 无 pidfile（legacy 位被 8713 今晨 boot 覆盖=跨 daemon 互踩实锚）→ 停泊走 CLI Case B 端口寻址+healthCheck 门（REQ-018 设计内回退）；父链已亡无复活面
4. 8713 父链=cmd 50836（launcher 末行 node 前台无 respawn 段）
5. **watchdog 双在役实勘**（schtasks 正形复查——首查空读数系 Git Bash `/query` 路径转换假阴性，MSYS_NO_PATHCONV=1 修正）: `\TriMLC-Watchdog` 下次 23:57:00 + `\TriRLC-Watchdog` 下次 23:56:00 → 重启窗压秒级
6. /shutdown 路由=回环无 token 门（app.ts L4275），CLI gracefulShutdown 直通 ✓

## 三、步 2-3 备份与双 build

- 步 2 ✓: 双仓 `dist.bak-pre-g10-20260928T235620+0800`
- 步 3 ✓: TriMLC `npm run build` exit=0（dist mtime 23:57）；TriRLC 同 exit=0（dist mtime 23:58）；tsc 零错
- build 期 daemon 存活预检 ✓（8713 healthz ok uptime 74992——tsc emit 期 lazy-import 风险未兑现）

## 四、步 4——8713 重启（23:59:2x-00:01）

1. 权威 stop ✓: `node TriMLC/dist/cli.js stop --port 8713` → 一致性门过（34396==34396）→ graceful accepted → SIGTERM 升级收尾（旧 dist /shutdown 后 5s 未退，CLI 设计内升级路径）→ 「daemon stopped via signal (pid=34396)」
2. 消亡断言 ✓: 8713 端口清空；34396 消亡；**父 cmd 50836 消亡**（0ce02d8f 教训验项）；legacy pidfile 随停自清
3. 拉起: 首试 bash→powershell 一行式翻车（嵌套引号转义坑在册正形违例，launcher 未发即察）→ **改 PowerShell 工具原生正形** 00:00:40 发令
4. 收敛 ✓: UP after ~2s，新 pid **10348**；boot 6s 时 mc_link=degraded（boot 瞬态）→ 15s 复验 **mc_link=connected / trimc=connected**；cron enabled **jobCount=4 degraded=false** consecutiveFailures=0；pidfile 对表 legacy=10348 ✓

## 五、步 5——8711 重启（00:02-00:10，含一次保真纠偏）

1. 权威 stop ✓（预期两段）: 首发一致性门**拒停**（「PID file records pid=10348 but port 8711 is currently owned by pid=35812 — stale or cross-daemon pidfile」=CTO 09-18 裁门防二次误杀实战兑现）→ 按 CLI 自带处置清 legacy 陈旧件（10348 系 8713 注册，删档不动进程）→ 重发 → Case B 端口寻址+healthCheck 门 → graceful→SIGTERM 收尾 → 35812 消亡、8711 清空 ✓
2. **首拉起=保真缺口（自纠）**: 按 watchdog 同形裸拉（`Start-Process node dist/index.js` 无 env）→ UP 但 **mc_link=degraded 持续 280s 不收敛** → 溯源:connMgr 目标=`env.trimcBaseUrl || 'http://localhost:8710'`（app.ts L1505），裸拉态无 TRIMC_BASE_URL → 落 localhost 死地址；旧 daemon connection-state.json 实证 13:40+0800 为 connected（对河源活链）
3. **权威 launcher 实锚**: `AppData\Local\trirlc\daemon\trirlc-daemon.cmd`（TRIMC_BASE_URL=http://8.155.54.79:8710 河源+TRIMC_INTERNAL_TOKEN+TRILC_ENV_FILE=D:\Code\ai\.env+TRILC_DATA_DIR 全量注入，start 形=`cli.js start --port 8711`）→ 停泊位 daemon 重走权威 stop（pidfile trilc-8711.pid=51700 过门）→ 00:09:33 权威 launcher 拉起
4. 收敛 ✓: UP after ~3s，新 pid **15708**；**mc_link=connected / mc_peer=trirmc / trimc=connected**；cron enabled jobCount=0 degraded=false（R 面基线 0 jobs）；port-split pidfile trilc-8711.pid=15708 对表 ✓（TriRLC 新 dist 走 port-split 登记，index.ts L141 registerPid(app.port)）

## 六、步 6 验收读数（CTO 终判卷 de76b2d3 四项）

1. **config 命令族活体** ✓: `node dist/cli.js config show` 双仓均出结构化读数（unknown command 消失）——TriMLC face=rlc / TriRLC face=rlc
2. **config-cache 泛化+拉取链活体** ✓: 双面 `fetched 2026-09-28T16:10:17Z` 同拍真实拉取（cache: fresh，expires +24h，refresh=900s），**effective model=GLM-5.3 source=tier2-cache-fresh**；盘面证据=8713 `trilc-channel/config-cache.json`（mtime 00:01:21 boot 首拉+加密体）+8711 `trirlc/config-cache.json`（mtime 00:10）
   - 命名差注记: 令文所称「face-events.jsonl daemon 侧真实 pull 行」——实勘两仓 src 无该文件名（grep 零命中），实际拉取证据面=config-cache.json+config show attribution 字段（boot 首拉 attribution=pull_denied 401 已留痕，见观察项①）。按 manifest 身份验证纪律以实落件名回呈
3. **healthz 全量** ✓: 8713={ok:true, service:trimlc, mc_link:connected, trimc:connected, uptime 33s 时点, cron:{enabled,jobCount:4,degraded:false,consecutiveFailures:0}, heartbeat:{enabled,agentCount:1}, sessionReaper:{enabled}}；8711={ok:true, service:trirlc, mc_link:connected, mc_peer:trirmc, trimc:connected, cron:{enabled,jobCount:0,degraded:false,consecutiveFailures:0}, heartbeat:{enabled,agentCount:1}, sessionReaper:{enabled}}
4. **watchdog 零干扰** ✓: trirlc-watchdog.log 末行=22:09:36 recovered（先于本部署）；trilc-channel watchdog.log 末行=09-26——两窗重启均秒级，probe 全落 build 期

## 七、异常与自纠实录

1. **launcher 一行式翻车**: bash 内嵌 powershell Start-Process 引号嵌套解析错（在册坑正形违例）→ 8713 短窗无主 ~2min → PowerShell 工具原生正形即过。教训重申:启动类操作一律 PowerShell 工具直发或 .ps1 文件
2. **8711 保真缺口**: watchdog 同形裸拉≠launcher 保真（env 缺 TRIMC_BASE_URL/TOKEN→mc_link degraded 不收敛）→ 勘出权威 trirlc-daemon.cmd 重走即绿。**watchdog 复活令形态本身存在同族保真缺口**（其 Start-Process 无 env 注入——若 8711 真掉线由 watchdog 拉起将复现 degraded），候 CTO 裁修 watchdog.ps1（改调权威 .cmd）
3. **跨 daemon legacy pidfile 互踩**: 8713 新 dist boot 仍写 legacy 位（index.ts L145 `registerPid()` 缺 port 参；TriRLC 已带 `registerPid(app.port)`）→ 8711 stop 首发被一致性门拒。门工作正常，处置按 CLI 指引清件。候 CTO 裁 TriMLC 一行补参（port-split 写路径对齐）

## 八、观察项（不阻塞，候裁/候办）

1. **boot 期 card pull 401→周期拉取转绿**: 8713 boot 首拉 attribution=pull_denied 401（TriModel card 面 admin 鉴权域），+9min 周期拉取成功（cache fresh 无 error）。首拉鉴权与周期拉取路径差异候 CTO config plane 判读
2. TriMLC registerPid 缺 port 参（§七.3）
3. trirlc-watchdog 21:53 误报 DOWN（8711 实活，revive 撞 EADDRINUSE 自灭，22:09 recovered）——probe 瞬时失败面，量级轻
4. `AppData\Local\trimlc-channel\trilc.pid`（Sep 2 陈旧件）未清——不在读链，留待 CTO 裁是否清档
5. 8713 现 pidfile=absent（§五.1 清件后未再生，其 stop 走 Case B 已验可行）；TriMLC 补 port 参后自愈

## 九、部署收口

- 最终状态: **双 daemon 全绿**（8713=10348 / 8711=15708，mc_link 双 connected，cron 双 degraded=false）
- 部署耗时: 23:41 接令 → 00:10 验收全绿（≈30min；其中 8711 保真纠偏返工一段 ≈7min）
- smoke: config show 双面活体 + GLM-5.3 tier2-cache-fresh + 拉取链同拍实证
- 回滚方案: 备锚在位未动用（dist.bak-pre-g10-20260928T235620+0800 双仓+权威 launcher 原序重启）

## 使用依据

- 令文: BOD 23:41 加急派工（CEO 23:39 直令）；CTO 终判卷 de76b2d3 验收四项；09-18 CTO pidfile 裁修（verifyPortPidConsistency 实战兑现）；0ce02d8f 父 cmd 复活教训；D-03 重启纪律/D-09/D-04
- 源码实锚: TriMLC/TriRLC `src/pidfile.ts`（readPid port-split 回退 legacy+一致性门+Case B）、`src/cli.ts` cmdStop/gracefulShutdown、`src/paths.ts` PID_DIR、TriRLC `src/index.ts` L141 vs TriMLC L145 registerPid 接线差、TriRLC `src/server/app.ts` L1505 connMgr 目标解析、`src/config/env.ts` L162 TRIMC_BASE_URL 缺省、`src/config/key-cache.ts` PULL_ATTRIBUTION_CODES
- 盘面实锚: 双 launcher（trimlc-daemon-channel.cmd / trirlc/daemon/trirlc-daemon.cmd）、connection-state.json、双 config-cache.json、双 watchdog.log、schtasks 正形复查（MSYS_NO_PATHCONV=1）
