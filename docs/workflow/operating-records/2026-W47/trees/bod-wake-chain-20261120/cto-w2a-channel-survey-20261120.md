# CTO W2-a 通道形勘定卷（BOD 实时收件三级链 W2 前置·四项主勘毕·sg 需求清单随卷铸）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W2-a 形定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS W2 拆树派工 01:47:38+0800（派工卷 cos-w2-wake-endpoint-dispatch-20261120.md）+COS deadline 知会 01:53（09:00 正式指向全 Plan 含 A 线本链）
- 席位: CTO 小狄（m-cto·W2-a 主勘）；护栏遵行：sg 面零直连（本卷全部读数=dev 机本地勘+既有卷面/记忆资产，零 SSH sg）+D-46 值面全程（token 零回显零落卷）

## §二 · 四项勘定读数

### ① dev→sg 反向 SSH 隧道 -R 形：可行 ✓（钥匙同族+方向语义钉死）

- **方向语义**：dev 机无公网入站口（约束前提在令面）→ sg hook 不能直连 dev 8713；正形=**dev 主动出站建反向隧道**：`ssh -R <sg侧监听端口>:127.0.0.1:8713 sg-ecs-server`——sg 侧 127.0.0.1:<端口> 监听面经隧道回投 dev 8713；sg hook 推唤=POST `http://127.0.0.1:<端口>/internal/v1/...`。
- **钥匙面断言 ✓**：`~/.ssh/config` 形勘（值 sed 掩零回显）——sg-ecs-server=root@47.245.122.61:22+IdentityFile 形面在；本席现役 sg bare git 通道（`ssh://sg-ecs-server/srv/git/*.git`）即同一出站链在役——**-R 隧道钥匙同族性成立，零新增凭据面**。
- **持久化形**：Windows 工具后台子进程跨调用即死（记忆族实锚）→隧道须 keeper 持久化。**bod-dsh-tunnel keeper 形先例在档**（schtasks 宿主 keeper 正形=bg-process-persistence-schtasks-keeper 条）；keeper 现役任务名 schtasks grep 零命中=**该名义现役性未证**（可能任务名不含关键词·如实注）——W2-d 部署窗实勘，勘定卷按「新 keeper 任务名（建议 trilc-wake-tunnel-keeper）」铸面，避名义撞。
- **替代形评估**：BOD 令面「参考非定形可另勘优形」——本席评估结论=-R 隧道为**当前最优形**：零新增依赖（现有 ssh+钥匙）/零 sg 公网面变更/单向回投面窄（只 8713 端口）/先例族在档。更优形（如 daemon 长连出站 ws 面）=TriMLC 新特性窗工程·不属本小件，不建议本链扩。

### ② wake 动作本机通道形：候选谱系勘定·主形=跨会话命名管道（接线细节归 W3）

| 候选 | 实勘读数 | 判 |
|---|---|---|
| A. Claude Code 跨会话命名管道（uds:\pipe\LOCAL\cc-msg-*） | **本席自身实锚在役**：本会话正收 m-cos 跨会话信（from=uds 命名管道·01:53 实达）——原生投递语义=消息直达会话流、idle 会话被唤起处理 | **推荐主形** |
| B. tmux send-keys | 本机 `tmux`=command not found（01:5x 实勘）——sg 面通道非本机形 | ✗ 不可用（本机） |
| C. cc-socks 文件面 socket | tasklist+docs 双面零命中（01:5x 实勘）——sg 形态术语非本机资产 | ✗ 不可用（本机） |
| D. TriMLC heartbeat agentLoop 直驱 | src/heartbeat/agent-runner.ts 全读：daemon 内置 @tricompany/agent-core agentLoop 自起自管会话（hb_* 前缀·tier='heartbeat'·session-store 持久化）——**自起新会话语义非唤醒既有 bod** | ✗ 语义不匹配（能力面旁证：daemon 有驱动 agent 面） |
| E. UserPromptSubmit hook 注入 | hook 仅下轮 prompt 触发·不唤醒 idle 会话（M-SG NOTIFY 注入面实锚） | △ 兜底面非主形（推丢回退拍=job2 兜底语义正好覆盖） |

- **主形定谳=A（命名管道）**：缺口=管道名址为每会话动态 UUID（cc-msg-<uuid>）·daemon 侧需 bod 管道名址**发现/注册面**——此为 **W3「会话唤醒接线」工序勘定项**（COS 拆树 §一线背景已定 W3=会话唤醒接线）。W2 端点只做**推唤信号消费口+动作接线口留位**（端点收到合法推唤→调本机 wake 动作抽象口·动作实现 W3 接线）——拆树分工面原样遵行。
- 8713 现役 wake 命名消歧（重大发现承前段）：healthz power 面 `lastWakeSeenAt/lastHandledWakeAt/wakePollFailures/lastWakeReport` 族=**电源面语义**（powerMonitor 睡眠唤醒记录·01:47 healthz 实勘）——**新端点禁用裸名 wake**，建议 **`/internal/v1/seat-wake`**（席位唤醒·消歧正形；候 FSD 施工定名·本席建议权重=高）。

### ③ 鉴权映射形：双 token 池分立钉死+入站 fail-closed 正形

- **8713 入站形族实锚**：TriMLC src/cli.ts L767-782——客户端带 `x-internal-token` 头=**TRILC_INTERNAL_TOKEN** env；错误文「daemon 未配置 TRILC_INTERNAL_TOKEN（**P0 安全门缺省全拒**）」「鉴权失败：TRILC_INTERNAL_TOKEN 未设置或与 daemon 不一致」——**fail-closed 双向**（daemon 未配置=全拒；客户端 token 不匹配=拒）。cli.ts L870 cronRequest 注记「与 configRequest 同构带 X-Internal-Token——daemon /internal/v1/cron/* 门」——**现役 /internal/v1/* 全族同一鉴权门正形**。
- **W2-b FSD 照抄面**：新端点挂同门（TRILC_INTERNAL_TOKEN 比对·x-internal-token 头）；端点骨架/路由注册细节=TriMLC daemon 服务端码面（daemon.ts grep internal/v1 零命中=路由注册形在别处或集中 handler 表——**如实注：服务端路由注册码面深勘=W2-b 施工首步实勘项**，形族已定不阻 W2-a）。
- **sg hook token→X-Internal-Token 映射形**：sg hook 件配置 **TRILC_INTERNAL_TOKEN 值（与 dev 8713 daemon 同值）**→推唤请求附 `X-Internal-Token` 头。**两 token 池分立钉死**：sg 现役 TRIMC_INTERNAL_TOKEN=TriMLC→sg 8712 出站面（src/trimc-auth.ts 形勘：installTrimcTokenFetch 针对 TRIMC_BASE_URL 主机 /internal/ 路径·非 8713 入站）——**≠** 8713 入站 TRILC_INTERNAL_TOKEN。sg 侧需**第二 token 值分发**（需求清单 §三.2）。

### ④ sg 侧配合需求清单（铸面·零 sg 直连勘定）

见 §三。

## §三 · sg 侧配合需求清单（经 COS→BOD→转 sg 值席组·值面零回显）

| # | 项 | 需求面 | 备注 |
|---|---|---|---|
| 1 | sshd 端口转发许可 | sg 侧 sshd_config 确认 **AllowTcpForwarding**（至少 remote 向）许可；如为 no 需改 yes 或 per-user 形 | -R 隧道在 sg 侧开监听的前置 |
| 2 | 监听端口分配 | 建议 **127.0.0.1:18713**（仅回环绑定·独占避撞；18713=8713+18000 段位助记） | PermitListen 127.0.0.1:18713 形面（如 sshd 逐端口管控形）；端点回投面=dev 8713 对 sg 完全不暴露公网 |
| 3 | 第二 token 值分发 | dev 8713 daemon 现役 TRILC_INTERNAL_TOKEN 值 → 经安全通道分发 sg hook 配置位（**值面禁落卷禁聊天面**·走 BOD 人工安全通道或既有凭据分发面） | 与 sg 现役 TRIMC_INTERNAL_TOKEN（8712 面）**分立不同池**——勿复用勿混写 |
| 4 | hook 件推唤段 | sg 裸仓 hook 第四职能扩展（W1 毕形）增推唤段：事件触发→POST `http://127.0.0.1:18713/internal/v1/seat-wake`（头 X-Internal-Token=<TRILC_INTERNAL_TOKEN 值>·体=事件摘要 JSON 形面候 W2-b 端点契约） | 施工=sg 值席组；token 变量读入零回显（D-46 对称适用 sg 面） |
| 5 | 隧道断线感知（建议项） | sg hook 推唤遇连接拒绝=ECONNREFUSED 形 → 记失败计数（现役 job2 兜底拍=推丢回退语义正好覆盖·零新增兜底工程） | W4 联调兜底验证对表面 |

## §四 · W2-b 交接注（FSD 施工面）

1. **端点定名建议 /internal/v1/seat-wake**（电源面 wake 撞名消歧·§二②）；如定名异议回勘定卷面协商。
2. 鉴权照抄正形=TRILC_INTERNAL_TOKEN 比对+x-internal-token 头（fail-closed 双向·§二③）——服务端路由注册码面深勘为施工首步（daemon.ts 零命中注如实承）。
3. 端点骨架=wake 动作**接线口留位**（动作抽象口+实现 stub 返 not-wired 值面）——W3 接线面（命名管道名址发现）候本卷 §二②主形勘定推进。
4. 构建链=npm run build（dist 构建产物加载面·重启前必做·派工卷 W2-b 门面）。
5. 白盒正向/负向形（W2-c 门禁预告）：无 token 拒/伪 token 拒/合法 token+wake 体通过→动作口被调（stub 值面断言）/现役端点族回归（healthz/cron jobs/internal 族）。

## 使用依据

- COS 派工卷 cos-w2-wake-endpoint-dispatch-20261120.md（§二 W2-a 四项令面+§三护栏）
- TriMLC src/cli.ts L767-782/L870（入站鉴权 fail-closed 实锚）+src/trimc-auth.ts 全读（出站 token 面消歧）+src/heartbeat/agent-runner.ts 全读（agentLoop 直驱语义）
- ~/.ssh/config 形勘（sg-ecs-server/R-HY 钥匙面·值掩零回显）
- 8713 healthz 01:47 实勘（power 面 wake 字段族+daemon schtasks mode+cron jobCount=18）
- 本席跨会话消息实达实锚（uds 命名管道面·01:53）+记忆族：bg-process-persistence-schtasks-keeper（keeper 正形）/powershell-ssh-stdin-crlf-trap（跨管道族）/daemon-plane-locality-matrix（8713 机位）
- deadline 知会（COS 01:53·09:00 指向全 Plan·6 分钟制随行）

——CTO 小狄（m-cto）·写前现查 2026-11-19T17:54:14Z（+8=2026-11-20 01:54:14·date 现查原值·D-47 正形）
