# 运行脚本真源化·CTO 技术方案件（四命题）

- sourceOfTruth: 本件（CTO 技术方案；与 CPO 可移植性标准/CAO 治理制度合流，三席联签呈 CEO）
- syncMode: draft
- lastSyncedAt: 2026-09-21T20:3x+0800（date 现查 20:36:53，本回合执行）
- 实勘基线: 本机 .fade 全量逐件清点（~30 项）+sg /home/fleet 七件实锚（SSH 现勘）

---

## 〇、分类判据（先行——真源化的第一道分界）

| 类 | 判据 | 处置 |
| --- | --- | --- |
| **工具脚本** | 人类编写、含逻辑、机器迁移后须重建才能恢复功能 | **真源化**（入 TriCompany ops 域） |
| **运行数据** | 机器/流程产出、log/flag/state/ledger、丢了只损失历史不损失功能 | 留运行位，.gitignore 续，不真源化 |
| **配置快照** | 半自动产出但含人工意图（seats-sg.json 类） | 逐件裁（倾向真源化或其生成脚本真源化） |

本机 .fade 定性实测：工具脚本 **~17 件**（hourly-sync-alert.ps1+vbs/notify-track/notify-poller.ps1+vbs/bod-to-sg-dispatch/seat-watchdog.ps1+vbs/launch-seat/launch-m-cos/msg-alert-watch.ps1+vbs/msg-work-watch.cmd+vbs/seat-boot.vbs/admin-fix.ps1/cleanup-narrative.py/sg-seat-launcher.sh 副本/sg-seat-watchdog-local.sh）；运行数据 ~10 项（*​.log×6/notify-ledger.jsonl/alert-state.json/notify-poller.last/m-plane-active.flag/watch-\*.json·log）；hub/hub-snapshots/tmp=目录位。

## 一、真源位设计（命题①）

**位**：`TriCompany/scripts/ops/<machine>/`——`local/`（本机）与 `sg/`（服务域）分目录（跨机变体不混放，双端复制体问题的结构解）；机中立共享件放 `ops/common/`。

**发布机制=轻量同步脚本（不走重管线）**：
- `ops/sync.ps1`（local）/`ops/sync.sh`（sg）：**单向拷贝 真源→部署位**+每件部署位头部注入生成标记（`# generated from TriCompany/scripts/ops/... — 禁直写`）+同步 log 留痕——§12.2 精神的脚本资产轻量实现（重管线对单文件脚本是过度工程）；
- **禁部署位直写**（D-30 候立，CAO 域）：改脚本必改真源→跑 sync→部署位更新；sync 时检测部署位与真源 diff 且部署位更新=警告「部署位被直写过」（防静默覆盖人工改动——先发现再定性）；
- 理由：脚本资产量级（~25 件）+变更频率（周级）不值得 manifest 级管线；sync 脚本本身入真源位（自举）。

## 二、存量迁移方案（命题②）

**逐件真源化序**（一次性迁移批，候批后执行）：
1. 工具脚本 ~17 件 copy 入 `ops/local/`（sg 七件入 `ops/sg/`）——**原文照搬不改一字**（先保真后优化）；
2. 部署位每件加生成标记头（sync 跑一遍自动注入）；
3. 部署位与真源 diff 校验=零差（迁移完整性锚）；
4. 副本件特殊处置：`sg-seat-launcher.sh` 本机副本 vs sg 正本 diff——一致则 sg 正本为真源、本机副本退役标记录；不一致则两版并存甄别（谁新谁对）后归一；
5. 运行数据零动作（判据外）。

**验证锚**：迁移后所有计划任务/cron 逐件触发一轮（或 waitWindow）全数正常=功能零损；sync 重跑 diff=0（幂等）。

## 三、服务器同类排查清单（命题③，逐件定性）

| 件 | 定性初判 | 处置方向 |
| --- | --- | --- |
| bare-fetch-all.sh | git 运维（bare 仓批量 fetch） | 真源化 ops/sg/（**来路待查**——sg 席自装，真源化时 sg 值席/CHO 认领源文件补写） |
| worktree-guarded-ff.sh | git 运维（worktree ff 守卫） | 同上 |
| worktree-reverse-push.sh | git 运维（反向推） | 同上——三件连审（同族语法风格=同一作者批） |
| sg-seat-watchdog.sh | 席位看门狗（**与本地 seat-watchdog.ps1 同族双端**） | 真源化+**漂移审查**（功能对表——D-29 v3 双侧复验判据预演） |
| notify-poller.sh | LG-036 通道伴生 | 真源化 ops/sg/（与本地 notify-poller.ps1 同族对表） |
| start-m-duty-sde.sh | SDE 拉起 | 真源化 ops/sg/ |
| duty-night-patrol.py | 值班夜巡 | **细勘位**（不在 /home/fleet 根，实勘位置候查——sg 值席域） |
| .trimmc/duty-env+notify-poller.known | 配置/数据 | 配置化抽离目标（§四）；known 类留运行位 |

**跨机同族清单**（双端漂移审查组）：seat-watchdog 本地.ps1↔sg .sh／notify-poller 本地.ps1↔sg .sh／sg-seat-launcher 双端——三组逐对功能对表，真源化时决定「分机变体」还是「参数化合一」（默认分机变体——面隔离语义，参数化合一候稳定后再议）。

## 四、硬编码配置化（命题④）

- `ops/config.<machine>.json`：`{ "paths": {fade, tmvRoot, triCompanyRoot}, "seats": [...], "map": {...}, "notify": {...} }`——脚本启动时读（PowerShell `ConvertFrom-Json`/sh jq）；
- 抽离顺序=随真源化逐件带出（改真源时顺手抽离，不二次窗）；首条线不强制全量配置化（渐进——硬编码脚本先原样入真源位，配置化随首次修改触发）。

## 五、与 CAO 制度/CPO 标准的接口

- **D-30 候立（CAO 主笔）**：「部署位禁直写脚本，先源后部」+「立规三件套：条文+存量扫+整改排期」（D-29 整改靠记忆找齐的教训制度化）——本件 §一§二为 D-30 的技术附录；
- **CPO 可移植性标准**：本件 §〇 分类判据+§一 位设计为其输入；「机器迁移可重建」验收=真源化后新机器 sync 一遍即恢复全部运行脚本（终态判据）；
- 命名规范（CPO 域）：建议 `<功能>.<ext>` 平铺（现名保持——迁移不改名降风险），命名升级候后续。

## 六、分期

- 迁移批（候批）：本机 17 件+sg 7 件真源化+sync 脚本自举+部署位标记——一个批次窗；
- 随窗：硬编码抽离随件；duty-night-patrol 细勘；
- 后续：参数化合一研究（候三组同族对表完成）/config 全量化（随改随抽）。

## 七、使用依据

命题书四风险+BOD 盘点；本回合实勘（.fade ~30 项逐件/sg /home/fleet 七件 SSH 现勘/sg-seat-launcher 双端实锚）；D-29 系（v1 无窗/v2 正位/v3 双侧复验——本方案为同族第四块：真源缺位）；§12.2 管线纪律（轻量化延伸）；compass junction 先例（迁移安全模式）。
