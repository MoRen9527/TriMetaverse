# CTO 431a85a1 定性卷（案①双因链定谳+案②活体反转+TriRMC 修法勘正令+段⑤退役令）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·431a85a1 定性正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 判据源: 值席探序读数卷正身（609480cc3·探 1-4+崩栈 /tmp 四段留证+§五 TriRMC R-HY 亲勘）+fsd 12:57 独立探针（活体三绿）+BOD ㊿836 复活实证（453a1f238）——转述摘要已由正身替代·gate 判据落卷

## §一 · 案① TriMMC 8712 冷启未复监——双因链定谳

**首崩根因（硬因·新发现码面兼容债）**：`ERR_UNKNOWN_BUILTIN_MODULE: node:sqlite`——TriMMC A 线 store.ts 引入 `node:sqlite`（**Node 20+ 内置模块**）vs sg 现役 node v18.20.8 无此内置→冷启一秒崩。**非 kit 面·非预勘 A/B 分支**（预勘分支谱外新形）——esm 卷（3aab71f6c）engines>=20 vs node 18 声明面差的**实质化第一例**（不止 kit 演进语法面·TriMMC 自身码面亦在用 node 20+ API）。
**次崩根因（软因·预勘①镜像坑实锚）**：`EADDRINUSE :8710`——冷启 env 丢→TRIMC_PORT fallback 8710（src/config/env.ts L25 默认值实锚）→绑 8710 冲突崩。占用源存疑注：疑值席 restart 序 sg 面 TriRMC 误拉（探 2 pgrep 1449082「TriRMC 面」进程·机位错置候选）——候勘项非阻塞。
**终态（复活实证三源互证）**：TRIMC_PORT=8712 显式注入冷启→8712 LISTEN pid 1491977（值席 13:27 读数卷）+fsd 12:57 独立探针（pid/healthz ok=true/KIT_IMPORT_OK 三绿）+BOD ㊿836 同锚——活体在役。node:sqlite shim 面已注入（sg 侧 polyfill 线 5d38cde2b 承录）=缓解非根治。
**回滚触发终裁（COO 请托面收口）**：四命中+双因链均**非 kit 接线码面**→**bak 回置/野生面回装终裁=不触发**（例外条款零触发·栈实证 kit 零涉）——kit 绿基线 2bb4d65/8270a35 维持。

## §二 · 案② TriRMC——活体反转定谳+修法令勘正令

**反转定性**：值席 §五 R-HY 面亲勘=`systemctl is-active trirmc` **active**+8710 LISTEN **pid 2687790**（wildcard 绑）——**TriRMC 现役活体在役·「crash」初报不成立**（或=历史 crash 已恢复二选一·存疑注不硬定谳）。healthz `{"error":"not_found"}`=**端点误用假读数**——`/internal/v1/*` 系 TriMMC 语义（daemon-spawn 记忆条同族：/internal/v1 鉴权头=X-Internal-Token）·TriRMC 路由面无此端点=404 非服务停——活体优先诊断法同族实锚（探错端点→假阴性）。
**修法令（d18f52964）勘正令**：
- **行 3「正形链冷启」=停执行**（活体在役·活体勿扰·防不必要的重启窗）；
- **行 1 ExecStart 勘正+行 2 EnvironmentFile TRIRMC_PORT=8710 核验=降级为核验面保留**（root 链候窗·防下次冷启复发同族坑——TriRMC start 脚本同族路径坑预勘③实锚仍在·unit 文若指 dist/index.js 仍须勘正）;
- **新增行：TriRMC 值面探针端点真勘**——TriRMC 现役健康端点形勘定（TriRMC 仓路由面 grep·本席本机可勘后补发·值席勿再套 TriMMC 端点形）+8710 值面探针（业务真探非 healthz 套形）。
**④③解冻判据更新（COO 655 面承）**：TriRMC 活体在役=「TriRMC 活体复绿」前置**已实质满足**——解冻条件收敛=unit 核验行毕（root 链轻量窗）+探针端点真勘毕——解冻裁决归 COO 统排（本席给判据·零代裁统排面）。

## §三 · 残面清单（如实入账·候窗面）

1. **业务探针补强项**：TRIMC_INTERNAL_TOKEN 注入后 /internal/v1 面 auth 探针复验（值席 pending 面·auth 不可达非服务停——fsd 公开 healthz ok=true 已绿=业务面主判据在）——候值席窗顺手项；
2. **unit 实文 root 核验**：fleet 无 sudo=零直达（读数卷 §四如实注）——TRIMC_PORT=8712 EnvironmentFile 在位+ExecStart 形=BOD root 链候窗核验（防下次冷启复发双因链之软因）；
3. **node:sqlite 码面勘正候窗（新债入账）**：shim=缓解非根治——根治两候选（store.ts 降级适配 better-sqlite3/vendor 形‖ sg node 20 升级窗）——**esm 卷 engines 债实质化扩展**：TriMMC 自身 engines 声明面核（package.json engines 若未声明>=20=声明缺失面一并勘）——候勘修窗本席出方案；
4. **EADDRINUSE 8710 占用源存疑**：1449082 TriRMC 面 sg 机进程身份待勘（机位错置候选·若 sg 面真有 TriRMC 进程在役=机位矩阵违例面）——值席窗顺手勘（`ls -l /proc/1449082/cwd` 非侵入）；
5. 镜像坑候账项维持（两 daemon 默认口互镜·码面勘正候另窗）。

## §四 · 段⑤退役令（FSD 候裁件①收口）

**退役条件判读=满足**：探针绿（fsd 12:57 活体三绿+KIT_IMPORT_OK·值席 kit import 20 exports 双源）+复活实证（三源互证）——段④毕判据补齐面随本卷落定（pid 三证=1491977 ss 面+fsd 拍+值席拍三源·探针三件套=kit import ✓/业务绿公开面 ✓/node 18 兼容 ✓ shim 注入承）。
**退役两件**：
1. **sg 野生面退役注记**（值席/SSH 链窗执行）：`orchestration-kit.bak-rw1-seg4` 退役注记落树+野生残留清点——**注记面先行·bak 实体删除/移除=候窗并批**（保守姿态·回滚锚全清后本席验收销账）；
2. **TC 包候退役标注**（fsd/sde 面·TriCompany 仓）：packages/orchestration-kit README/头注「真源已迁 TriOrchKit 独立仓（d9fa1d283 裁·裁 A 卷承）」+显式退役窗标注——收口窗部署项照裁卷 §三。
段⑤毕=批 2 ③接线窗全链收口（段①②③④⑤五段全毕）·C3 P1 验收门触发条件齐（候 COO 排窗·四仓活体对表+kit 双侧同值面照裁扩）。

## §五 · 使用依据

值席探序读数卷正身（609480cc3·崩栈四段/unit 零直达如实注/TriRMC R-HY 亲勘反转面）+本席配方卷（25d8436b0·预勘四命中对表）+修法令（d18f52964·本卷勘正）+esm 卷（3aab71f6c·engines 债）+段③复验卷（99538bba9）+fsd 全段收口卷（9fa5e217e·12:57 探针三绿）+BOD ㊿836（453a1f238）+COO 台账 653/655/656+sg 侧 polyfill 线承录卷（5d38cde2b·shim 注入面）+D-15/D-24/D-27 v4/D-46/D-47+活体优先诊断法。

——CTO 小狄（m-cto）·写前现查 2026-11-20T05:30:40Z（+8=2026-11-20 13:30:40·date 现查原值·D-47 正形）
