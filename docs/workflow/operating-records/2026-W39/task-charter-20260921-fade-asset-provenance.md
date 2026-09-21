# 任务框架·运行脚本真源化（.fade 族+服务器同族排查）——CPO×CTO×CAO 三席联审

- sourceOfTruth: 本件=董事会命题书（CEO 2026-09-21 20:31 令结构化）
- syncMode: static
- lastSyncedAt: 2026-09-21 20:3x
- 上位令: CEO 20:31（.fade 下文件要么纳入 TriCompany 做真源管理，要么从 gitignore 拿出来；这些是部署文件但同时也是项目设计落实的源文件，应先写源文件（有存档）再做部署（生效），而不是只做到部署——项目迁移时不可移植。服务器上同查。做真源+实施方案记录。CPO、CTO、CAO 都参与）
- 主责: **CPO×CTO×CAO 三席联审**（CPO=资产可移植性产品视角/CTO=脚本资产管理与部署流程/CAO=真源治理制度与归档纪律）
- 定性: 运行脚本**无真源**的结构性治理命题——今晚及此前建的全部运行脚本散落部署位（.fade/fleet 家），无源文件、无存档、无部署流程——**机器迁移/重装即全数丢失且不可重建**

## 一、问题实锚（BOD 盘点，联审复核扩展）

### 本机 .fade/（gitignore 内，部署位直写）
- hourly-sync-alert.ps1+hourly-sync-alert.vbs+notify-track.ps1+notify-ledger.jsonl+notify-poller.ps1+bod-to-sg-dispatch.ps1+seat-watchdog.ps1+seat-watchdog.vbs+launch-seat.ps1+launch-m-cos.ps1+sg-seat-watchdog.ps1（副本）+m-plane-active.flag+sync-alert.log 族+notify-poller.log 族
- 性质混杂：**工具脚本**（应真源化）+**运行数据**（log/flag/state——应 ignore 留运行位）——**两类未分离**

### sg 服务器（fleet 家，同样部署位直写）
- bare-fetch-all.sh+worktree-guarded-ff.sh+worktree-reverse-push.sh（**来路待查**——非 BOD 装，sg 席自装）+sg-seat-watchdog.sh+notify-poller.sh+start-m-duty-sde.sh+duty-night-patrol.py+.trimmc/duty-env+notify-poller.known+各 .log
- 同性质混杂：工具脚本+运行数据未分离；**跨机脚本（本机 sg-seat-watchdog.ps1 副本）双源风险**（同族 TriDeployer 复制体教训）

### 结构性风险
1. 机器迁移/重装=脚本全丢且**不可重建**（无源文件无文档）；
2. 双端同功能脚本（seat-watchdog 本机/sg 两版）**漂移无同步机制**（app.ts 5+5 红同族）；
3. 脚本内嵌硬编码（路径/席名/MAP 表）无配置化——改一处须裸编辑部署位（今晚多起）；
4. 无版本化——脚本演进无史（D-29 整改靠记忆找齐存量）。

## 三、联审命题

- **CPO·产品视角**：脚本资产的**可移植性产品标准**——真源化的形态（TriCompany 仓 scripts/ 域？ops/ 域？）、命名规范、脚本与运行位/运行数据的分类判据；
- **CTO·技术方案**：①真源位设计（TriCompany/scripts/ 或 ops/，源文件→部署位的**发布机制**：脚本也要走管线/同步脚本，禁部署位直写——§12.2 同族延伸到脚本资产）②存量迁移方案（.fade 工具脚本逐件真源化+部署位改为渲产物/同步产物）③服务器同类排查清单（fleet 家逐件定性）④硬编码配置化方案（路径/席名/MAP 表抽离）；
- **CAO·制度视角**：①真源治理制度（脚本资产的 sourceOfTruth 归属/归档纪律/变更流程——归 engineering-disciplines 或独立）②**纪律增条：部署位禁直写脚本，先源后部（先写源文件有存档，再做部署生效）**——今晚起即按此执行，制度追认随批 ③D-29 存量整改漏同类归口（立规必须伴随存量全扫——制度化为"立规三件套：条文+存量扫+整改排期"）。

## 四、产出与流程

1. 三席各出思路/方案段→合流双签（三席联审签：CPO+CTO+CAO）→呈 CEO 候批；
2. 批后：真源化实施（存量迁移+部署流程改+纪律条正身）；
3. 落树 `trees/fade-provenance/`；接单认领即时回 BOD。

## 五、排期与执行模式修正（并行）

本命题与在办（注入器合流双签候呈/首条线联审/contract schema 候窗）**并行**——各席独立线程，除同文件冲突外不互相等待（CEO 20:31 排期机制弊端正视，并行修正自本命题始）。
