# FSD P1 探勘步三探读数卷（中途报承载）

- seat: FSD（小全·m-fsd）
- 写前现查: 2026-11-10T12:54:26Z（20:54:26+08 原值）——卷面时戳=commit %cI（D-47）
- 令源: CTO P1 施工窗令（任务书 TMV fa69fcd9d·窗 20:00-24:00）+20:43 催办令
- 探勘时窗: 20:49-20:53+08（D-24 断言起至补探毕）·三探全绿零停窗异常

## §一 三探读数

### 探① TriRMC cron API 对 command 变更的行为——**无 ALLOWLIST 闸·PATCH 即改·零重启**

- 源码面（部署版 R-HY `/srv/fleet/TriRMC` rev=2c5395ece02570190c3269258c7426732e20268f）：
  - `src/cron/` 全目录 grep "allowlist"（-rin·大小写不敏感）=**零命中**；
  - `routes.ts validateCreateInput`=纯形状校验（name/schedule{kind,cron|everyMs|atMs}/payload{command,cwd} 字符串存在性）——零 command 内容面检查；
  - `command-handler.ts`：token 替换（{fromWeek}/{toWeek}/{startDate}）→spawn bash→timeout→log，无白名单比对。
- 活体链（127.0.0.1:8710·X-Internal-Token 鉴权·token 值面零回显）：
  - POST 测试 job（schedule 对象形·enabled=false）→ **201** {ok:true, job.id=26799906…}；
  - PATCH 同 job payload.command `echo probe-allowlist-a` → `echo probe-allowlist-b` → **200**，回读 `patched cmd= echo probe-allowlist-b`（**即改生效·零重启**）；
  - DELETE 测试 job → {ok:true,removed:true}；GET jobs count=4（四现役 job 原样·清理干净）。
- **勘正发现②（候 CTO 认）**：任务书坑位 1「TriRMC cron ALLOWLIST 精确等值（TriRLC 同族教训·新串追加+daemon 重启）」**实勘不适用**——该坑系 TriRLC 形（TriRLC cron ALLOWLIST 精确全串比对双入口 fail-closed 在案）；TriRMC cron face 无此闸。施工序第 3 步相应简化：**改点 C 走 PATCH payload.command 即生效·免 TriRMC daemon 重启**（勘修窗重启链整段豁免·风险面降一档）。旧串回滚=PATCH 回原串（同样零重启），回滚锚 2 语义不变。
- 鉴权现势：daemon（node dist/src/index.js·pid 224044）**有** TRIRMC_INTERNAL_TOKEN（len=64）·无 token GET=401——与本地源码 app.ts opt-in 语义一致。

### 探② SMTP 通道活体可达——**绿（status=sent）**

- notify 现役通道：`/home/fleet/.trimetaverse/notify.json`（daemon 身份=fleet·HOME 对齐命中）——键面：smtp.host=smtp.qq.com·port=465·user=48632390@qq.com·pass=***（零回显）·default_to=['1615136989@qq.com']（现役单址）。
- 活体试发（canonical CLI `python3 -m runtime.cognition.notify send`·as fleet·cwd=/srv/fleet/TriCompany）：**status=sent**·check_time=2026-11-10T12:52:35Z·主题「[FSD P1 探勘] SMTP 通道活体试发 2026-11-10」→ 现役 default_to 单址。
- 值面三查进路：send_notification 返回 sent + SMTP 服务器接受；**收件箱可视证据候收件人确认**（试发信已注明可忽略）。
- **双址对表候 COS**（任务书改点 B：值席 COS+BOD 两址施工窗内对表实名）——现役 config default_to 仅单址；改点 B 落 `WEEKLY_SHIFT_NOTIFY_TO` env 双址，COS 实名地址未到前施工以占位注释+可配置 env 形推进，收信验证用现役单址先证通道、双址候补。

### 探③ 18710/bod-dsh-tunnel 隧道形态——**-L 单向（本地→sg·无 -R）**

- 活体（本地 Windows）：LISTEN 18710 pid=20280 ssh.exe，cmdline 原文：
  `ssh.exe -N -L 18710:127.0.0.1:8712 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=accept-new fleet@47.245.122.61`
- keeper 在册：schtasks \bod-dsh-tunnel（Status=Ready·Logon=Interactive only）。
- 形态判读：**纯 -L 单向**（本地 18710 → sg 机 loopback 8712=TriMMC daemon）·**无 -R 反向监听**。
- P2 通道三候选读数基础（本窗只出读数·不改设计）：
  - 候选 a（隧道加 -R 反向监听）：现役 keeper cmdline 单点加 `-R <sg侧端口>:127.0.0.1:8713` 即成 sg 侧 loopback 反向位；R-HY→sg 通道现役可达（ssh -J 路径·-J 正是经 sg）→ R-HY 拍 `127.0.0.1:<sg侧端口>` 即二跳达本机 8713。改动面=keeper schtasks 定义单点（本机侧）。
  - 候选 b（河源→sg→本机显式二跳）：与 a 同通道拓扑，区别在实现形（sg 侧独立转发壳 vs ssh -R 内嵌）。
  - 候选 c（本机侧拉形·8713 反探河源）：零隧道改动，但需 8713 侧 job 增河源静默判定面——改动落在 8713（TriMLC）=任务书止损线禁触区，仅列不计。
  - P2 简案倾向读数：候选 a 改动面最小（keeper 单点+R-HY 侧拍探脚本）·候 COO 排 P2 后另出简案定稿。

## §二 基线快照（回滚锚 3·全落卷）

- TMV 检出（/srv/fleet/TriMetaverse）HEAD=`6860bf87bf989bab086b52a31c32b134c8782e4b`（11-09T17:24+08 ops: weekly plane shift）·porcelain 干净；
- TC 检出（/srv/fleet/TriCompany）HEAD=`eebaa976a010d453a9c034e4b22ee21599c45cd2`·porcelain 仅 1 项预存在 untracked `packages/agent-core/dist.bak-pre-rebuild-1004-0927/`（非施工面·零触）；
- jobs.json 备份：`/srv/fleet/TriRMC/data/cron/jobs.json.bak-p1window-20261110`（含 4 job 全文·9c81c7ec command 链 SOP L19 原文在卷）；
- shift-ade 备份：`/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W46/.shift-ade.json.bak-p1window-20261110`（W46 现役 status=pass·11-09T09:24Z 成功轮全量 ADE）。

## §三 病灶活体与分叉现势（改点 A 预演读数）

- **病灶在档**：job 9c81c7ec state.lastError=`command exited with code 128: … fatal: Not possible to fast-forward, aborting.`·lastRunStatus=error·consecutiveErrors=1·lastRunAtMs=1794153000007（=2026-11-08 23:50:00+08 周日拍）——上周日迁移链 pull 段分叉死·**静默无告警至今 ≈45h**（比任务书 19.5h 更长的在档实证）·runCount=11。
- **分叉现势预演**（preflight 语义同款读数）：`git fetch sg-bare dev` 后 `rev-list --left-right --count HEAD...sg-bare/dev` = **`0	84`**——left=0（零分叉·病灶态已被后续对齐消除）·right=84（纯 behind·bare 顶=fa69fcd9d P1 任务书）。→ preflight 判定语义对现势=放行（right>0·pull --ff-only 下轮快进成立）·**改点 A 拦截语义与真病灶形态（left>0）精确对口**。
- daemon 身份=fleet（ps 实证）——runAs=None 的 job 以 fleet 跑·HOME=/home/fleet·notify config 命中链自洽（探②已证）。

## §四 施工序修订点（随勘正②·候 CTO 中途报裁定）

| 步 | 任务书原形 | 实勘修订形 |
|---|---|---|
| 3 改点 C 门 | 新串 ALLOWLIST 追加+daemon 重启正形链+POST 201 三查 | **PATCH payload.command 200+三查（id/enabled/next_run 值面）·零重启** |
| 回滚锚 2 | 旧串 ALLOWLIST 保留·回滚=POST 改回+重启验 201 | 旧串在 jobs.json 备份·回滚=**PATCH 回原串（零重启）**·jobs.json.bak 双保险 |
| 其余步 | — | 不变（改点 A+B 单测→注入三测→终验四查→收口） |

## §五 异常注（如实）

1. 探①首发 POST 用字符串 schedule 形被 400 bad_request（探针写法疏·API 要求 schedule 对象形）——纠对象形后 201·非服务端异常·已如实注；
2. healthz `consecutiveFailures:1` 即病灶 job 9c81c7ec 的在档读数（非新异常·§三）；
3. TC 检出 untracked dist.bak 目录系预存在（10-04 rebuild 备份遗留·非本窗产物·零触）。

## §六 依据

- CTO P1 任务书（TMV fa69fcd9d）§四施工序①§五坑位②1§六回滚锚 3§七 P2 勘验步
- D-24 机位断言三绿（ssh -J 可达·两检出状态勘定·8710 healthz ok）
- 部署版源码实勘（/srv/fleet/TriRMC rev=2c5395ece·src/cron 零 allowlist）+活体 POST/PATCH/DELETE 全链
- notify.py 现役通道（TriCompany 仓 runtime/cognition/notify.py·config=~/.trimetaverse/notify.json）
- 本地 bod-dsh-tunnel 活体（Get-NetTCPConnection 18710+Win32_Process cmdline+schtasks 在册）
