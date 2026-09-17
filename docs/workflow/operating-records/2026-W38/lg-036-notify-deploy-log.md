# LG-036 跨面通知通道部署 log（BOD 部署令·DE 执行）

- sourceOfTruth: 本文件（部署执行记录）
- syncMode: append-only 事后补记
- lastSyncedAt: 2026-09-18T01:05+08:00
- 执行席: DE 小布（trideployer / m-dee）
- 令源: BOD 部署令（CTO 发布签核 APPROVE，五要件原样转；时点裁「超 2 小时转断链重启不再等」）
- 时点对表: 收令 2026-09-18 00:17+08:00，现查 00:19:40+08:00 与令文「批13 开闸 5 分钟内」吻合 ✅

## 部署读数五条（令文验收）

1. **sg TriMMC**：`/srv/fleet/TriMC` pull `8982004`→`6ca9024`（含 `2a6047f` notify 发端；merge 收编前置见下）→ `npm run build` → `systemctl restart trimc` → active。**token 门三态**：无令牌 401 / 错令牌 401 / 对令牌+缺字段 body 400（门放行+业务校验拒，零副作用探针）✅
2. **本机 TriMLC**：`/d/Code/ai/TriMLC` 工作树核实 HEAD=`448a9c5`（含 `fbb117c` 收端+`448a9c5` STE 复验，工作树干净，未动树）→ `npm run build`（`dist/notify/{letter-store,puller}.js` 落地）→ 8713 重启（旧 daemon pid 1888 经 `POST /shutdown`+`TRILC_INTERNAL_TOKEN` 门优雅退出→`trimlc-daemon-channel.cmd` 权威拉起）→ healthz ok ✅
3. **功能开关**：`TRIMC_NOTIFY_SG_URL=http://47.245.122.61:8710` + `TRIMC_NOTIFY_SG_TOKEN`（=sg override.conf `TRIMC_INTERNAL_TOKEN` 同值，前缀比对 MATCH len64）追加至 `D:\Code\ai\.env`（TriMLC env.ts r19 fallback 首候选，`TRILC_ENV_FILE` 指向；loader 不覆盖已有进程 env；cmd byte-exact 定稿件未动）。poller 实跑命中为生效实证 ✅
4. **端到端试信**：`ntf-mu5rpxg212gylk`（title 标注 WALKTHROUGH；source_seat=`m-duty-cos`——MVP 源席白名单仅此值，403 人话拒后按令正名，DE 代发已在信体标注）：POST 200 pending(16:52:50Z) → poller 60s 周期命中 → forwarded+**delivered**(16:53:12Z)=**confirm 双跳实证** → 8713 信箱落信（unread=1, delivery=mailbox）✅。toast 视觉面候 BOD 屏幕回执
5. **mc_link 重连**：8713 healthz `mc_link=connected`+`trimc=connected`；sg outbox **backlog=0**；8710 healthz ok ✅

## 部署前置（令外必要环节）

- **拓扑对表**：TriMLC/TriMMC 为独立仓（`/d/Code/ai/TriMLC`、`/d/Code/ai/TriMMC`；非 TriRLC/TriMC 目录）——BOD 令文 hash 初查三仓不命中，全工作区扫描后定位破案
- **merge 收编**：sg bare（`/srv/git/TriMMC.git`，本机 remote URL 已由旧名 `/srv/git/TriMC.git` 修正）dev 独有 `8982004`（mmc-duty 夜航01 cron 自愈分支，仅 `src/cli.ts` +7/-1）——本机 merge `6ca9024`（ort 自动无冲突）→ push sg-server（快进）→ sg pull
- **mc_link 对端勘定**：注册表 env `TRIMC_BASE_URL` 指河源（8.155.54.79）为遮蔽值；daemon 拉起 cmd 内显式 `set TRIMC_BASE_URL=http://47.245.122.61:8710` 覆盖——现役对端=**sg 权威位**实锤

## 异常与事故（如实录）

1. **8711（TriRLC R 面 daemon）两次误停**，同根因：`~/.trimetaverse` pidfile 无端口命名空间，TriMLC `trilc stop --port 8713` 读到 TriRLC 注册的 pid（15492，后 8480）并 SIGTERM。两次均经 `Start-ScheduledTask "TriRLC Daemon"`（权威拉起路径）恢复，8711 healthz ok 收口；累计中断约 5-8 分钟
2. **1888 停机通道**：非提权会话 `Stop-Process`/`schtasks /RU SYSTEM` 均拒（Access denied）；最终以应用层 `POST /shutdown`（`TRILC_INTERNAL_TOKEN` 门，401→带 token 200→process.exit）优雅退出——零权限解决
3. **教训入册**：双 daemon（8711/8713）共存主机上 `trilc stop` 的 pidfile 机制结构性错位——修复建议（pidfile 按 port 分文件）候 CTO 裁；临时替代=定点验证监听 pid+token 门 /shutdown

## 观察项（候 CTO/相关席）

- `D:\Code\ai\.env`（TriMLC 进程加载的工作区根 env）混载大量明文凭据（GitHub PAT/阿里云 AK/telegram token 等）——环境安全隐患，建议治理（配置分离+凭据入密管）
- 1888 旧 daemon 提权根未定（TriMLC-Watchdog/TriHubWatchdog 均 Limited）——候权限面排查
- 8713 stderr 既有 trimodel fetch failed 三级回退链（tmv-deepseek-chat→deepseek-v4-flash→v4-pro）——GLM 部署面既有现象，非本令引入
- sg 8710 cron `consecutiveFailures=2`（daily-progress-watcher exit 1）——**既有失败族**：restart 前 trimc-run.log（16:20/16:30Z）已有同族 failed 记录，非本令引入；degraded=false 未达阈

## 回滚方案状态

- sg：dist 回滚位=重启前 `8982004` build 产物（未单独备份 dist，回滚=reset `8982004`+rebuild+restart；脚本层先例 `trimc-start.sh.tsx-bak` 注释在案）；**当前未触发**
- 本机：`D:\Code\ai\TriMLC\dist.bak-notifyroll-20260918`（1.77MB 全量备份）+ env 两键删除即回零行为（默认关）；**当前未触发**

## 使用依据

- BOD 部署令五要件（CTO APPROVE 转达）；D-03 daemon 重启纪律（pidfile 权威路径/禁裸杀——本例pidfile 机制缺陷以定点实证+应用层 shutdown 替代并记录）；D-09/D-17 运行面纪律；D-24 机位断言（M-SG-47.245.122.61）；真源核查纪律（答不存在前全仓扫描）；执行令时点交叉核对纪律；收口 commit 卫生
- 代码事实源：TriMLC `src/config/env.ts`（notify 三键语义/r19 env fallback）、`src/notify/puller.ts`（60s interval/outbox+confirm 端点）、TriMMC `src/notify/routes.ts`（四端点/六字段）、`src/notify/outbox.ts`（名册反查 target_daemon）、本机 `trimlc-daemon-channel.cmd`（env 注入正身）
