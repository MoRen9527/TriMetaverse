# ew 工序 3 · TriMMC sg 部署前置施工中段卷（SDE）

- sourceOfTruth: 本卷（工序 3 部署前置①-⑥施工读数正身·重启窗前态）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO ew 工序 3 施工单 go（2026-11-04T09:12:14Z 信 §四·八步序）

## 一 · 步骤读数（①-⑥ 全毕·每步自检锚）

| 步 | 内容 | 结果 | 自检锚 |
|---|---|---|---|
| ① | 基线断言 | **毕** | 本机 TriMMC push 双通道（GitHub+sg bare 双 To·ls-remote 顶=37cceeb1dbbd）→sg fetch+merge --ff-only e8f0219→37cceeb·双 commit 在位断言过（git log -1 两 hash 可解析） |
| ② | dist production form 重建 | **毕** | 备份锚=dist-bak-pre-fade-20261104T092507Z；build（node22+fleet 身份·tsc）毕；fade 七 js 全产（closing-gate/driver/recovery/skill-loader/state-machine/store/types）；dist/src/server/app.js homeDomain 命中 3+writeAuthority 命中 2 |
| ②-路径 | trimc-start.sh PATH 前插 | **毕** | L17 `export PATH=/opt/node22/bin:$PATH`+L18 exec node（sed 锚 exec 行）；回滚锚=trimc-start.sh.bak-20261104T09250xZ 同窗 cp |
| ③ | unit env 两键 | **毕** | TRIMC_CONFIG_DIR=/var/lib/trimc **已在位零动作**（drop-in cron-env.conf 现役值勘定）；TRIMMC_TRI_SKILL_ROOT=/srv/fleet/TriSkill 新 drop-in tri-skill-root.conf+daemon-reload——show 面双键齐显（运行进程 env 待重启窗注入·预期态）；TriSkill 目录存在性断言过（AGENTS.md/docs/skills/README） |
| ④ | fade.db 初始化 | **毕** | node:sqlite 在 node22.23.4 稳定面可用（node18 无此模块=node22 硬前置根因实锚）；createFadeStore 显式 init 毕；/var/lib/trimc/fade.db 建档（fleet 属主 40960）·表=6（fade_runs/fade_run_transitions/fade_gate_rejections/fade_watch_state/fade_watch_audit+**sqlite_sequence=sqlite AUTOINCREMENT 自动件非死表**·如实注记）·journal_mode=wal 确认 |
| ⑤ | sweep 脚本 sg 化 | **毕** | 落位=/srv/fleet/TriMetaverse/scripts/fade/fade-daily-sweep.mjs（65 行）；四处改形 diff 全显（PORT 8713→8712/OP_ROOT→/srv/fleet 形/token 正则 TRILC→TRIMC_INTERNAL_TOKEN/CMD_FILE→docker/.env）；node22 --check syntax-ok；备份锚=.bak-20261104T0925xxZ |
| ⑤-过滤面 | writeAuthority+homeDomain 对表 | **零适配** | TriMMC daemon 侧 app.ts L277-278 端点构造自动落（CTO 裁②值·禁直搬旧值已兑现）——sweep POST body 只传 {runId,treeDir}——脚本无过滤面 |
| ⑥ | 记录面 git 同步链勘定 | **毕·呈核** | 见 §二 |

## 二 · ⑥同步链勘定呈核形（候 CTO 裁·不自动实施）

- **实拓扑（活体勘定）**：sg TMV 检出（/srv/fleet/TriMetaverse·dev·fleet 属主）双 remote=github（https）+**origin=/srv/git/TriMetaverse.git（bare·fleet 属主·fleet 可操作 rev-parse 过）**；本机 TMV 已有 sg-server remote=ssh://fleet@…/srv/git/TriMetaverse.git（fetch+push 双向）——**链全通零新配置**。
- **链形**：daemon 建树（fade011-ew-runs 下·已实证今日 14:xx rehearsal 5 树落位形）→`sudo -u fleet git -C /srv/fleet/TriMetaverse add docs/workflow/operating-records/<W>/trees/fade011-ew-runs/`（**pathspec 精确**·非 add -A）→commit（fleet identity=TriMMC Orchestrator \<trimmc@tri.company\> 现成）→`git push origin dev`（bare）→本机 `git fetch sg-server`+merge --ff-only 收编。
- **执行主语+频率三候选**：a) sweep job 链尾自动 commit+push（自含闭环零新增 job）b) **独立 sync job（30-60min·与 sweep 解耦·SDE 建议**——sweep 手动重跑三树不触发三次 push）c) 每日收口人工段。
- **冲突即停语义**：pathspec 精确限 fade011-ew-runs 树；push 非 ff（bare 被他端推进）→**不 force**·停·留痕人工介入；本机收编 merge 非 ff→停。

## 三 · 现役基线读数（重启窗回归对表锚）

- 8712 job 谱=**15（13 enabled+2 disabled**：weekly-plane-shift·e14-heartbeat-observer）——重启后 jobCount 对表=15±0。
- healthz 基线：`{"ok":true,"service":"trimc","cron":{"enabled":true,"jobCount":15,"degraded":false,"consecutiveFailures":0}}`。
- fade 端点现役探针=**401**（internal/* 全局 token 门先于路由拦——auth 层先验·**端点存在性读数待重启后带 token 验**·401 非端点存在性证据·勘定注记防误读）。
- better-sqlite3 **不在 TriMMC deps**——零 native 依赖零重编译面（node:sqlite 纯内置·「双变」外第三变不须·CTO 单勘定注记）。

## 四 · 重启窗计划（裁量呈报）

- **窗时点=今晚 23:30+0800（sg 低活跃裁量）**——与明日 03:30 dsh 窗（河源）充分间隔防读数混淆；sg duty 面深夜低活跃段·systemd 重启 <5s 秒级中断。
- 窗内序列：restart trimc→四读数（①healthz 对表 ②job 全谱计数对表 15/13 ③cron force 预演一发——窗内勘现谱选低风险只读类（候选 clock-skew-check）④fade 端点带 token 探针）→进程内生效验证（node22 进程断言：trimc 进程 exe/node 版本面+TRIMMC_TRI_SKILL_ROOT env 值面探针——「healthz 绿≠配置生效」纪律）。
- **回滚三锚**：①PATH 切回=cp .bak 回 trimc-start.sh ②dist revert=mv dist-bak-pre-fade-20261104T092507Z 回 dist ③drop-in 键删=rm tri-skill-root.conf+daemon-reload——三锚清单全就位。
- 毕后：⑦联合验证窗候排（sg 端到端一发→CTO 门禁→8712 job 新建嵌套 payload `30 3 * * *`→force 真触发→切换窗=施工毕后首个 03:30·验证毕方切→8713 退役可逆）。

## 五 · 使用依据

- CTO ew 工序 3 施工单 go（09:12:14Z §四）+批 4 五族裁令（09:17:19Z·4a 即开·另线穿插施工中）
- TriMMC src/fade/store.ts（node:sqlite+六表 schema）·src/server/app.ts L211-278（token 门+fade 端点）·src/internal-token.ts（TRIMC_INTERNAL_TOKEN 读取序）
- sg 活体勘定：trimc-start.sh/unit drop-in 谱//var/lib/trimc//srv/fleet/TriSkill/bare TMV/docker/.env 键名面（全程掩码管道·D-46）
