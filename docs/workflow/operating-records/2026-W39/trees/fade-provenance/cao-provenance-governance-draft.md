# CAO 制度视角段·运行脚本真源化（三席联审合流稿，2026-09-21）

- sourceOfTruth: 本件（CAO 联审段；合流三签候 CPO/CTO）
- syncMode: draft（合流前段稿）
- lastSyncedAt: 2026-09-21 20:4x+0800（date 现查）
- 上位令: task-charter-20260921-fade-asset-provenance.md（CEO 20:31）＋D-30 拟条已同步入册（engineering-disciplines.md，今晚即执行态）

## 一、载体裁定（命题①）

- **核心纪律条=D-30 入 engineering-disciplines.md**（已落，拟条态今晚即执行）：先源后部/部署位禁直写/工具脚本与运行数据分离/归档纪律/例外窗 24h 回写——五条通用规则，三端发现性最优。
- **细则篇=独立成册 `TriCompany/docs/workflow/script-asset-provenance.md`**（随合流批后成册）：承载逐件清单/归属映射/发布机制细则/整改排期——细则含逐件资产表会持续膨胀，不宜塞 D 册（一物一册：通用规则=D-30，逐件细则=细则篇，两册互指针）。

## 二、归档纪律细则（命题①细则篇骨架，CAO 拟）

1. **登记形态**：细则篇含脚本资产表（脚本名/源位/部署目标位/用途/最近核实基线时点〔D-28〕/owner）；
2. **归属判据**：可执行体=资产入真源位；运行数据（log/flag/state/jsonl）=留运行位照 ignore；双端同功能=单源+部署分发（禁双源并存）；
3. **变更流程**：改源→（如有管线）发布→部署位生效→细则篇资产表行更新（基线时点刷新）——四步缺一即 D-30 违例；
4. **来路待查件**（worktree-reverse-push.sh 等 sg 席自装件）：先定性后归档——确认有存续价值再补源，无价值退役，禁「先归档再说」。

## 三、存量全扫与整改排期（命题③，D-30 附三件套之二三）

**存量清单（据命题书实锚+D-30 判据预分拣，终判候 CTO 技术核）**：

| 批次 | 件 | 处置 |
| --- | --- | --- |
| 本机工具脚本 | hourly-sync-alert.ps1/.vbs、notify-track.ps1、notify-poller.ps1、bod-to-sg-dispatch.ps1、seat-watchdog.ps1/.vbs、launch-seat.ps1、launch-m-cos.ps1（9-10 件） | 真源化（迁 TriCompany 真源位+部署位改渲产物） |
| 本机跨机副本 | sg-seat-watchdog.ps1（副本） | **优先**（双源风险最高）——定单源后他端退役 |
| sg 工具脚本 | bare-fetch-all.sh、worktree-guarded-ff.sh、worktree-reverse-push.sh（来路待查）、sg-seat-watchdog.sh、notify-poller.sh、start-m-duty-sde.sh、duty-night-patrol.py（7 件） | 真源化（来路待查件先定性） |
| 运行数据 | notify-ledger.jsonl、*.log、m-plane-active.flag、.trimmc/duty-env、notify-poller.known | 留运行位照 ignore（不迁） |

**整改排期（CAO 拟，原则三条）**：
1. 今晚起：新脚本零容忍（D-30 即执行态）；
2. 合流批后一窗清：存量迁移候 CTO 真源位方案定谳（联审合流批后），统一窗逐件迁——不散窗拖期（D-29 教训：拖窗=闪屏又跑两天）；
3. 跨机副本件优先序列第一（双源漂移风险最高，定单源即退役他端）。

## 四、三席合流接口

- 本段=CAO 制度视角全量（命题①②③覆盖）；候 CPO（可移植性产品标准/形态与命名判据）与 CTO（真源位设计/发布机制/硬编码配置化）两段到树合流，三签后呈 CEO。
- D-30 已在册今晚即执行——合流若修条文，修法=在册条目修订（未推可 amend+签注），不撤条。