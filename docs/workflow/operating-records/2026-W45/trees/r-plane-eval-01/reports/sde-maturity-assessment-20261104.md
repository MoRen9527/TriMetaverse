# r-plane-eval-01 成熟度评估卷·SDE 域（部署/发布/环境管理）· 2026-11-04

- sourceOfTruth: 本卷（trees/r-plane-eval-01/reports/sde-maturity-assessment-20261104.md）
- syncMode: static（评估卷 SDE 域章节·只读勘验产出）
- lastSyncedAt: 2026-11-04T05:38:05Z（date 现查原值·写前跑）
- 勘验方法: 全程只读活体现探（D-24）——ss/ps/systemctl cat/仓面 git+文件面·零写源码零写配置·8710 TriRMC/443 caddy/8791 dsh 零触碰
- 分级标尺: L3=生产成熟（服务化+护栏+runbook+回滚面齐）／L2=可靠运行（服务化+护栏·文档散）／L1=装机前段（源料在位未部署）／L0=缺位

## 一、R 面服务化纪律面总览（环境管理基座）

| 服务 | unit | 端口 | uptime@勘验 | 护栏 | 判 |
| --- | --- | --- | --- | --- | --- |
| TriRMC | trirmc.service（quadmig-2） | 0.0.0.0:8710 | 18d00h | MemoryMax 800M·CPUQuota 100%·Restart always/5s | L2 |
| TriModel | trimodel.service | 0.0.0.0:3333 | 19d03h | systemd 托管·R-HY company truth | L2 |
| bigmodel-h1-proxy | bigmodel-h1-proxy.service | 0.0.0.0:8460 | 19d03h | systemd 托管 | L2 |
| dsh web（班组） | dsh-web-prod.service（user manager） | 127.0.0.1:8791 | 13d18h | Python 面罩 runner（launch token→0600·D-46 正形） | L3 |
| relay3 | relay3.service | 127.0.0.1:18790 | 13d17h | — | L0（上游死口·见 §四-1） |
| caddy | caddy.service | :443+127.0.0.1:2019 | — | systemd 托管 | L2 |

- **强项（照录）**：五 node 服务全 systemd 单位化·零裸进程·零 tmux 孤儿·勘验窗 19 天量级零重启——R 面服务化纪律面为成熟基座（对照 10-16 前历史形态显著进化）。
- caddy 443 面（评估对象外·零触碰仅记在册）。

## 二、评估对象逐项（R 面本地域产品）

### 2.1 TriRLC（命令行主体·8711 族 API 面）——**L1 装机前段**

- 仓面：/srv/fleet/TriRLC branch dev HEAD 067fbfd（「段二河源装机候料补链·R 面仅达 sg bare」锚）·pkg 0.9.0·工作区仅 2 件 untracked 调试残留（test/.tmp-frame-dump.test.ts+test/.tmp-stream-dump.test.ts）。
- 部署痕迹四查全空：①dist 未构建（无 dist/index.js）②trilc CLI 不在 PATH ③状态目录缺位（~/.trirlc、/var/lib/trirlc 均无）④**8711 端口零监听**（8711 族 API 面在 R 面无活体）。
- node_modules 零（未 npm ci·code-state.md「fleet TriRLC 无 node_modules 实锚」一致）。
- CI 面：TriRLC 仓**无 .github/workflows**（无质量门禁管线·对照 TriPilot 有 quality-gate.yml）。
- 判：评估对象主体（TriRLC 命令行+8711 API 面）在 R 面=源料就绪、装机未启（段二候料态）。

### 2.2 TriPilot（命令行为主·GUI 为辅）——**L1 装机前段**

- 仓面：branch dev HEAD a23d2a0（LG-002 token 门配套·全调用面 X-Internal-Token）·pkg 0.0.13·工作区清洁。
- 构建管线面：scripts 全套在（compile/build:cli/prepack/test 族·CI=quality-gate.yml 在册）——**开发侧管线成熟，R 面无构建产物**（全仓+用户面 .vsix 零命中）。
- 编辑器承载面：/srv/fleet/vscodium=构建源树（build/{alpine,linux,osx,windows}·linux/appimage 仅 recipe.yml+build.sh——**recipe 在·产物无**）；TriPilot 扩展安装痕迹全机零命中（无 extensions 装设）。
- 判：命令行与 GUI 两形态在 R 面均装机未启。

### 2.3 对照基线·M 面两域（docs 侧取证·M 面活体不在本机勘域）

- TriRLC prod 8711 daemon：M 面健康在役（TriRLC docs/registry/code-state.md 多处「prod 8711 全程健康/零扰动」锚）——M 面 L2-L3 形。
- Windows 装机面：dsh@0.2.0-rc.2 Windows 全局装+凭据装载+真模型探针 PASS（code-state.md 2026-10-21 收口锚·SDE 施工·CTO 追认）——M 面 CLI 装机已毕。
- sg 面：TriMLC 8713+trimc 8710（TriRMC runbook 锚·周平面迁移主责已切河源）。
- 面差结论：**M 面两域成熟度显著领先 R 面**（R 面 TriRLC/TriPilot 整体落后一个装机段）；R 面独有强项=dsh 班组服务化（8791·M 面无此形）+TriRMC 迁移自治。

## 三、8710 TriRMC API 面（R 面现役 API 承载·对照评估对象）

- 路由族：/healthz+/hello+/internal/v1/{agent(s),chat,config 四件,cron,events 两件,heartbeat,tasks 三件}（dist/src/server/app.js 只读提取）——R 面 API 现状=TriRMC 8710 单族承载，8711 族空缺。
- healthz 勘验读数：ok=true·mcLedger ok·cron 3 job degraded=false consecutiveFailures=0（2026-11-04T05:34Z 采）。
- 配置面：/var/lib/trirmc config-cache+S3 backup 件族在（备份机制在役）。

## 四、部署卫生发现五件（环境管理缺陷账）

| # | 发现 | 证据锚 | 级 |
| --- | --- | --- | --- |
| 1 | relay3.service=僵尸中继：redirect → 127.0.0.1:18791 上游零监听（HTTP 000） | ss+curl 2026-11-04T05:35Z | 中 |
| 2 | trirmc.service 内部 token 明文内嵌 unit 文件（Environment=TRIRMC_INTERNAL_TOKEN=<64hex>·unit 世界可读） | systemctl cat | 中 |
| 3 | TriModel .env 权限 644（密值文件组可读·应 600） | stat -c %a 2026-11-04 | 低 |
| 4 | deployment-runbooks/ 目录空（部署 runbook 库未初始化·知识散在树卷/unit 注释/runbook.md 单点） | ls 空 | 中 |
| 5 | TriRLC 工作区 2 件调试残留 untracked（.tmp-*-dump.test.ts） | git status | 低 |

## 五、SDE 域成熟度总判

- **环境基座（服务化/护栏/零裸进程）：L2-L3**——R 面最强面。
- **评估对象本体（TriRLC 命令行+8711 API+TriPilot 双形态）：L1 装机前段**——段二候料态，产品成熟度评估的其余域（命令行行为/API 质量）在 R 面暂无活体可评，只能评「部署到位度」。
- **dsh 班组面：L3**（R 面独有成熟项·token 遮蔽/D-46 正形/unit 化俱佳）。
- **卫生面：L2 减分项五件在账**（§四）。
- 改进计划见姊妹卷 `sde-improvement-plan-20261104.md`（同树 reports/）。

—— 落款（date 现查原值）: 2026-11-04 13:38:05 +0800（SDE 小布·r-duty-sde）
