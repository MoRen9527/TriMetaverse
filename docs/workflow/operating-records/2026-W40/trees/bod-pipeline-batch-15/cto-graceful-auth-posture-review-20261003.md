# 8711 graceful 链 auth posture 变更技审卷（CTO 车道，BOD #300）

- sourceOfTruth: 本件（graceful 链技审正身；令源=COO 07:57 技审令 BOD #300 单列）
- syncMode: final
- lastSyncedAt: 2026-10-03 10:05:20 +0800（date 现查贴原值；分项现勘时点随文标注）
- 技审席: CTO 小狄（m-cto）；技审零写面 ✓（本卷落盘除外）；施工全候窗 ✓
- ⚠ 随卷声明：勘定途中一起新增值面回显（§六，如实呈报候定性）

## 零、三问裁答总表

| 问 | 裁答 |
|---|---|
| ① 修法评估 | **不 FREEZE**——消费方名单已闭合（§二七类全定性）；修法分 A/B 两层：A 层=纯配置一行+重启（零代码，§三）；B 层=CLI 裸 fetch 六点补令头（代码修归维护批扩围，§四） |
| ② 与发现②维护批四笔关系 | A 层单列施工单（配置窗）；B 层并入维护批扩围（与发现②第三/四笔同文件同批）；A/B 无互锁可分层推进 |
| ③ 生效窗建议 | 独立短窗（5 分钟级），排 R-HY 401 修复窗（8713 重启）之后同日；与 8713 窗分段施工分段验收（D-04 单锚纪律），无互锁 |

## 一、现态实锚与考古（引入时点有主）

- 8711 现役 pid 42524（10-03 03:46:05 起，夜间 FSD trilc stop 实弹后 TriRLC Daemon 计划任务拉起）；启动链=`%LOCALAPPDATA%\trirlc\daemon\trirlc-daemon.cmd`→ps1→`TRILC_ENV_FILE` 载 env file。
- **trirlc-daemon.env 键面无 TRILC_INTERNAL_TOKEN**（09-30 03:56 建，键面十键全勘）→daemon 门取不到期望令→fail-closed 全拒（现态，非事故，系 P0 安全门缺省行为）。
- **考古锚**：用户级持久 env（HKCU\Environment）存有 `TRILC_INTERNAL_TOKEN`（指纹 len=64 head4=4f94 tail4=e217）——与 8713 门令（channel.cmd L15，0641..5693）**异值=真双令域成立**。判读：4f94..e217 系 LG-002 时代（08-28 p0fix3 配套）用户级令，9-30 daemon env file 迁移窗把 daemon 门令源切到 env file（未配键→全拒）而用户级键留存——**「8711 门全拒」引入时点=9-30 env file 迁移窗**。
- 消费方侧令在位解释「三日无人报痛」：TriPilot trilc-auth（LG-002 配套）与 CLI 双 helper（cronRequest/configRequest）令源均为 `process.env.TRILC_INTERNAAL_TOKEN` 同名键——进程 env 继承用户级值（4f94..e217）→**消费方侧令一直有值，只欠 daemon 门配同值**；TriPilot 另有 trilcDirect 直连模式（src/trilcDirect/，绕 daemon 直打 LLM）兜底日常使用。

## 二、消费方盘点名单（问①FREEZE 判据面，七类全定性）

| # | 消费方 | 端点面 | 令现态 | daemon 配令后（A 层）影响 |
|---|---|---|---|---|
| 1 | TriPilot 扩展（trilc-auth 全局 fetch 注入，extension.ts L741 单点覆盖） | chat SSE+init 族等全量 | 用户级 env 继承（有值） | **即刻复活**（零改码） |
| 2 | trilc CLI cronRequest（cron 族 L866-886，F-2 修复先例带令） | /internal/v1/cron/* | process.env（继承用户级，有值） | **即刻复活** |
| 3 | trilc CLI configRequest（config 族 L767-786，401 处理含 internal_auth_disabled 提示） | /internal/v1/config/* | 同上 | **即刻复活** |
| 4 | trilc CLI 裸 fetch 六点（notifications L504/resume L519/sessions L728/mcp L1224,1261/compact L1444） | 各 /internal/v1/* | **零令头（结构性缺失）** | 仍 401——归 B 层修（resume 硬失败 exit1/notifications best-effort 静默——与现态等价零劣化） |
| 5 | trilc CLI gracefulShutdown（L379-397） | /shutdown | 零令头（发现②实锚） | 仍 401→SIGTERM fallback——归 B 层修（与发现②状态码校验同点） |
| 6 | triladder.ps1（a1/a2/a3） | probe+shutdown | 参数化令源（Get-LadderToken L106：显式键>TRILC_INTERNAL_TOKEN>TRIMODEL_API_TOKEN；-ShutdownTokenEnvFile 已备） | 运维面规则：探 8711 持用户级/env file 令源即通，**零改码** |
| 7 | dev/e2e 脚本族（dev-reset-init.mjs L38 trilc stop+L93 curl 裸调；e2e/lib/daemon-client.js 零令头+01/02 套件） | init 族+stop | 裸调（curl/request 零令） | curl/request 401——dev/e2e 测试基建面，归 B 层扩围候选（低频，候独立小笔） |
| 排除 | tree-node-patrol/plane-shift-local-align（出站打 sg 8710 notify，TRIMC_NOTIFY_SG_URL）、hub-silent-detect/joint-review-remind（纯文件面）、heartbeat（daemon 进程内机制非 HTTP）、8711 cron 其余 job（l3-toast/l2-stub 非 8711 /internal） | — | — | 零影响 |

## 三、A 层修法（配置窗施工单素材，零代码）

1. trirlc-daemon.env 增行 `TRILC_INTERNAL_TOKEN=<值>`——值源建议=**用户级现值**（4f94..e217）：消费方侧（TriPilot/CLI 进程 env）已持该值三日，daemon 配同值即全链最小动作复活；换新值则须同步用户级键+全部消费方进程 env 刷新（VS Code 重启面扩大），无增益。
2. 重启 8711：优雅停（POST /shutdown 现态无门……注意：**现态门全拒下 /shutdown 也 401**——优雅停不可用，正形=trilc stop 走 SIGTERM fallback（已验可用，FSD 夜间实弹同路径）或直接停+TriRLC Daemon 计划任务拉起；禁裸杀纪律照守（验 pid==42524）。
3. 验收锚（D-04 三层）：辅锚 1=healthz 绿；辅锚 2=文件面（env 键在+指纹对表）+三态探活（无令 401/对令 404 过门）；**主锚=带令业务探针 200**（TriPilot daemon 模式连通 或 `curl 带 X-Internal-Token 4f94..e217 打 /internal/v1/config/show 200`——值面管道内零出机）。
4. 回滚锚：删 env 行+重启→回全拒态（现态，可接受）。
5. 禁区：8713 门令（0641..5693）与 channel.cmd 零触碰；两 daemon 令域异值事实勿混配（§五）。

## 四、B 层修法（代码修，归维护批扩围）

- **维护批清单由四笔扩为五笔**（第三笔语义扩展）：
  1. a1 头注补注（原）
  2. a3 bak 缺失文案（原）
  3. **TriRLC cli.ts：状态码校验+L361 真因化（发现②）+gracefulShutdown 令头补齐（本卷 B 层新增——同函数同批，修一次闭两点）**
  4. TriMLC cli.ts 同款（状态码+令头，镜像族批量修口径不变）
  5. （新增候选小笔，低频面）dev-reset-init.mjs curl+e2e daemon-client 令透传——候独立排，不阻塞前四笔
- 令头实现口径：复用 cronRequest/configRequest 既有形态（`process.env.TRILC_INTERNAL_TOKEN ?? ''`+`if (token) headers['x-internal-token']`）——六点裸 fetch（§二#4）+gracefulShutdown 全部收编；禁另起新令源机制。

## 五、双令域事实（设计约束，长效在案）

- 8713 门令=0641..5693（channel.cmd L15）；8711 门令=4f94..e217（用户级+拟配 env file）——**异值双令域为终态设计**（P4b 实证+本卷考古双锚），非待收敛缺陷。
- 运维面推论：跨 daemon 操作（triladder/trilc --port 8713）须按目标 daemon 持对应令源；「TRILC_INTERNAL_TOKEN 单键全局通吃」不成立（8713 门不认用户级值）。
- 未来轮换=两域各自独立轮换（低频，各自施工单）。

## 六、随卷声明：新增值面回显一起（勘定途中，如实呈报）

- 事由：`reg query HKCU\Environment` 输出经 `sed 's/=.*/=.../'` 掩码——reg query 系空格分隔格式（非 `=`），sed 零匹配原样透传，TRILC_INTERNAL_TOKEN 完整值进入本会话链（10-02 channel.cmd 三 token 回显同族新变体：**掩码正则与输出格式失配**）。
- 定性候裁：同盘同权限面（本机会话链），增量暴露≈零；BOD 前例口径=操作瑕疵非安全事故不提前轮换——本席同判候认。轮换牵连面（双 daemon+TriPilot+CLI 全链）大，非必要不动。
- 入册候 CAO：掩码管道须按目标命令实际输出格式断言命中数（`sed` 后 grep 验证掩码行数=预期，零命中=掩码未生效=立即停）。

## 七、生效率与 8713 窗关系（问③）

- 8711 A 层窗=独立短窗（增行+重启+三态+主锚，全链 5-10 分钟级）；建议晨窗组单排 **R-HY 401 修复窗（8713，审定单 b6e6db9f 七步序）之后同日执行**——理由：①8713 窗系模型链止血面优先级高；②8211 窗非止血（fail-closed=安全正态）系工效恢复面；③两窗各自独立验收锚分段回滚（D-04 单锚纪律），同日两窗零互锁（不同 daemon/不同 env 文件/不同令值）。
- 8711 窗与 P3（TriModel dist 重建+3333 受控重启）零交集（8711 不涉 TriModel 链），并行安排亦可。

## 使用依据

- COO 07:57 技审令（BOD #300）；发现①裁卷（3c0a2753）+发现②裁修卷（22b41974）前置在案
- 实勘（09:3x-10:0x 只读）：trirlc-daemon.env 键面十键+ps1/cmd 启动链；8711 pid 42524（03:46:05）；HKCU\Environment 令键（指纹形）；TriRLC cli.ts L379-397/L504-535/L728/L765-786/L866-886/L945-1029/L1224/1261/1444；TriPilot trilc-auth.ts（LG-002 注入形态）+trilcDirect 目录；triladder.ps1 L50-58/L96-114；TriMetaverse scripts 面 grep（fade/e2e/dev-reset）；cron.db.json 七 job command 面；heartbeat-dualrun-contract.md L92
- 关联在案：R-HY 401 审定单（b6e6db9f，8713 窗正形）；LG-002 p0fix3 门配套（TriPilot trilc-auth 头注实锚）；值面禁进打印路径（10-02 在案，本卷 §六新变体）
