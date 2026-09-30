# TC source-agents 502 行基数正名悬案勘卷（件1）

- 执行: m-duty-cos 0925；只读勘证（charter 件1；LG-039 T5 前置+LG-046 外部件同源合并）

## 三答

### 1. 悬案实体是什么

「502 行基数」=LG-039 T5 渲染攒批的 TC source-agents 渲染基线批（BOD 实测口径，随批冻结注在卷：fade008 tree-op.json「渲染管线抽验抓出反向正名（本机 TC 源侧零正名），16 件已 revert」）。悬案实体=**双仓 source-agents 正名族分叉**：sg 工作区 TC 源侧已完成多批正名（SDE 族 759987c/2ce1c31、ADE 批 8b703e9/5ff567d、宿主资产 Phase 1 d9cd33f 等，全在 TC dev），而**本机 dev 侧 TC 源侧=零正名态**（渲染抽验实证）——渲染管线在本机跑、取本机源，产出携带旧名＝反向正名，16 件被拦截 revert，渲染链（LG-039 T5/LG-048/051）连带冻结。

### 2. 卡点在哪

- **卡点=本机 TC 工作树未追平 sg 已推的 dev 正名族**（分叉向：sg dev 领先、本机源侧停旧态）。TC dev 为共享分支（双端同推 /srv/git/TriCompany.git），收敛动作纯 git 层（本机 pull/ff），无内容冲突裁决需求——现势 TC dev 尖=d9cd33f（本席 LG-046 Phase 1），工作树两件他席在途（IPD 培训件+report_envelope.py，pathspec 隔离态）不阻 pull。
- **旧名残留现势盘点**（sg 源侧，正名族候选池）：source-agents 内 TriLC/TriMC 字样 143 行——抽样定性两类：①「TriMC 正式宿主/平台/系统」护栏句族（行为护栏语境，旧名系护栏目标语义，动否属正名族批次决策非残留错误）；②路径引用族（如 cos contract source: `TriMC/src/heartbeat/cli.py`——sg 目录现名即 TriMC（禁动硬边界），路径引用**当前为功能性正确**，改名须与 TriMC→TriMMC 目录改名同窗否则引用断）。
- 502 与现值差：0923 基线 502 行 vs 现sg 143 行——差额主因=0924 后 sg 侧多批活改正名消化+口径差（行 vs 处），如实注非矛盾。

### 3. 收口路径建议

1. **本机 TC 源侧追平**（唯一卡点解）：本机 `/d/Code/ai/TriCompany` `git pull --ff-only origin dev`（dev 含全部正名族；本机若另有本地提交先 rebase 对表）——追平后本机源=正名态，渲染管线产出自然携新名。
2. **渲染链解冻复验**：pull 后重跑渲染攒批抽验（T5 解冻窗），旧名零回流即 16 件 revert 案闭环；LG-048/051 连带解窗。
3. **正名族批次决策**（143 行护栏句/路径引用两族）：护栏句族动否、路径引用族与 TriMC→TriMMC 目录改名同窗项——归 CTO 正名族批次窗（与矩阵教义 CTO 口径对表），非本勘裁决。
4. **防复发**：渲染管线加「源侧正名态前置断言」（抽验旧名超阈即拦截——091x 拦截机制已证有效，建议常态化为前置门）。

边界遵守：本勘零改动（TC 树仅他席在途两件原样）；不动 TriCompany 仓任何文件 ✓。
