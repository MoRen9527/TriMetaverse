# CTO C3 P1 验收卷·本机面预读段（四仓活体对表+kit 双锚+md5 面·双侧候读数标注）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·C3 P1 验收本机面正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 排窗令源: COO §十四（2f2bb2c964·台账 659·14:00 硬门后随窗启 C3·零硬塞承录）——本卷=本机面预读段（只读零活体触·13:53+8 预跑）·sg/河源面=值席窗读数候选（配方随卷 §三）
- 验收判据: COO §十四三件承（四仓活体对表+md5 复验+family 过滤断言案活体跑）+kit 双侧同值 2bb4d65 顶（批 2 裁扩）——MMC 活体以现役 shim 态 pid 1491977 为准（根治挂残面不阻 C3）

## §一 · 四仓活体对表（本机两面实探读数）

| 仓 | 机位 | 读数（13:53+8 现查） | 判 |
|---|---|---|---|
| TriRLC | 本机 8711 | `ok=true`·uptime 748444·cron enabled jobCount=1 **degraded=false**·mc_link=connected（mc_peer=trirmc·对河源链活）·sessionReaper enabled | ✓ 活体绿 |
| TriMLC | 本机 8713 | `ok=true`·uptime 11301（≈3.1h·今晨批 1 装载链时窗吻合）·cron enabled jobCount=18 degraded=false·**mc_link=degraded（trimc=degraded）** | ✓ 服务本体绿·链接面观察项（§二） |
| TriMMC | sg 8712 | 候值席窗读数（探针配方 §三·现役 shim 态 pid 1491977 基准=读数卷 609480cc3+fsd 12:57+㊿836 三源互证） | 候读数 |
| TriRMC | 河源 8710 | 候值席窗读数（配方 §三·活体反转定性=4917ba16f §二·pid 2687790 基准） | 候读数 |

## §二 · 观察面如实注（非阻塞 C3 主判据）

**TriMLC mc_link=degraded**（TriRLC 同面 connected 反差）——候选定性=sg TriMMC internal auth token 未注入族（值席读数卷 §六 pending 面 TRIMC_INTERNAL_TOKEN 同族·auth 不可达致对端链接降级）——**服务本体 ok=true+cron degraded=false=活体绿成立**·链接面=残面清单第 1 件（token 注入后复验）关联面·C3 判读=不阻塞（主判据=四 daemon 服务本体活体+kit 装载面·mc 链接面为跨机链路观察项候 token 窗勘定）。

## §三 · sg/河源面探针配方（值席窗执行·root【R】标注）

**sg 面（TriMMC+kit 装载态）**：
1. `ss -tlnp | grep ':8712'`——pid 1491977 LISTEN 基准对表；
2. kit 装载面顶对表：sg TriOrchKit 工作区/装载位 `git log --oneline -1` 对表 **2bb4d65**+dist md5 对表本机 `f6c77aa1a89c68be3d030d4efec08b9f`（双侧同值面·机械验）；
3. kit import 值面：`node -e "import('@tricompany/orchestration-kit').then(m=>console.log('OK',Object.keys(m).length))"`——20 exports 基准；
4. 【R】unit EnvironmentFile `TRIMC_PORT=8712` 在位核（残面第 2 件顺手项·token 行脱敏 D-46）。

**河源面（TriRMC+kit 装载态·④③ 5c993fc 接线毕基）**：
1. `ss -tlnp | grep ':8710'`——pid 2687790 LISTEN 基准对表（活体反转定性锚）；
2. kit 装载面：TriRMC 检出顶对表+node_modules/@tricompany/orchestration-kit 形（symlink/真目录）+dist md5 对表本机值；
3. kit import 值面同 sg 式（20 exports 基准）；
4. TriRMC 健康端点真勘结果带回（4917ba16f 修法勘正新增行·若值席已勘随读数并报）。

**family 过滤断言案活体跑**：本机面=TriOrchKit 契约套件全量（69/69·本席批 3 复验自跑同形·C3 窗内复跑留证）——双侧值面=kit import 20 exports 探针（§三配方）为活体装载证据。

## §四 · C3 收口条件（候件清单）

本机面毕（本卷）+sg 面读数回+河源面读数回→三源合卷=C3 P1 验收毕报（APPROVE/FREEZE 裁定随卷）→即报 CEO 链（COO 台账随线）——残面五件+本卷观察面（token 复验/root unit 核验/node:sqlite 勘正/EADDRINUSE 源勘/镜像坑）不阻 C3 主判据·随毕报承录候窗。

## §五 · 使用依据

COO §十四排窗令（2f2bb2c964·C3 三件判据+MMC shim 态基准承录）+本机面实探读数（13:53+8·curl 8711/8713+git 双锚+md5+symlink 实勘）+4917ba16f 定性卷（活体反转+残面清单）+609480cc3 读数正身（pid 1491977/2687790 基准）+fsd 全段收口卷（9fa5e217e·④③ 5c993fc 承）+C2 分期裁承（验收三件形）+D-15/D-24/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T05:53:59Z（+8=2026-11-20 13:53:59·date 现查原值·D-47 正形）
