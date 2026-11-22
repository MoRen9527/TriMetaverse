# C 项机制件·COS 流程面（tree-op 落卷立死规范 + 催办定时器最小形）

- sourceOfTruth: 本卷（C 项两件 COS 流程面正身·工具实现归 CTO/COO 面）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47）
- 令源: CEO 执行序列 C 项（BOD 转达）——「①tree-op 落卷立死 ②采集域 31 分 ⑤催办定时器」；COO 排工 22:19:38（我面两件=tree-op 立死+催办定时器最小形）
- 时点: 写前现查 2026-11-22T22:25+0800（D-47 原值）
- 分工注: ①立死工序+验收标准=COS 流程面（本卷）+CTO 工具（校验脚本候落）；⑤催办定时器=COS 出形（本卷 §二）+CTO/COO 落地；②采集域 31 分=CTO/CPO 面（不在本卷）

## §一 · tree-op 落卷立死规范（工序+验收标准）

### 1.1 立死定义

「立死」=每棵树的 tree-op 落卷形**规范化固定**：字段集固定、路径固定、验收机械可判——**禁每树自创格式**。

### 1.2 落卷三件套（必全）

| 件 | 落点 | 必填面 |
|---|---|---|
| `tree-op.json` | `<周目录>/trees/<tree-id>/tree-op.json` | treeId / title / goal / nodes[]（nodeId/title/owner/inputs/outputs/dependsOn/acceptance）/ createdBy / createdAt / status |
| `briefs/<node-id>.md` | 同树 briefs/ 子目录 | 节点简报（routedInput 引用/产出清单/验收锚） |
| `progress.json` | 同树 | 节点台账（nodeId/state∈{pending,active,done,blocked}/checkpointRef/artifactCommit/updatedAt） |

### 1.3 工序五步（立死序）

1. **建树**：`trees/<tree-id>/` 目录创建（周目录内·禁仓库根——树文件路径规范）；
2. **tree-op 落卷**：tree-op.json 一次写全（节点依赖图完整·禁后补节点无声）；
3. **节点领取**：progress.json 置 active+updatedAt；
4. **节点毕**：brief 落卷+checkpoint（progress 摘要/artifactCommit=产物 git SHA/resumePoint）→progress 置 done；
5. **树收口**：全节点 done→tree-op.status=closed+收口卷。

### 1.4 验收标准（机械可判·CTO 工具落点）

| # | 判据 | 判法 |
|---|---|---|
| A1 | tree-op.json 合法 | `json.load` 过 + 必填字段齐（§1.2 全列） |
| A2 | 路径合规 | tree 目录在 `<operating-records>/<当前周>/trees/` 下（禁仓库根/禁跨周游离） |
| A3 | 依赖闭合 | nodes[].dependsOn 引用节点全存在（无悬挂） |
| A4 | progress 状态一致 | done 节点必有 brief+artifactCommit；active 节点必有 updatedAt |
| A5 | 收口完整 | status=closed 时全节点 done+收口卷在位 |

**工具实现=CTO 面**（校验脚本候落·本卷只定判据集）。

## §二 · 催办定时器最小形（COS 出形·CTO/COO 落地）

### 2.1 最小形定义

定时扫描「台账未决项」→超阈值未动即产催办报文→投递责任席+入台账——**零智能·纯机械**（够用即止·不建大系统）。

### 2.2 形三件

| 件 | 形 |
|---|---|
| 输入面 | COS 台账最新 N 笔 + 各树 progress.json 的 active/blocked 节点（跨树扫） |
| 阈值 | 单节点 active 超 **2h** 无 updatedAt 变更→催办；blocked 超 **4h**→升级（报 COO+BOD） |
| 输出面 | 催办报文（节点/树/责任席/停滞时长/建议动作）+台账一笔（催办记录） |

### 2.3 落形

- 调度面=现役 cron（8710/8713 择一·CTO 定）；
- 复用既有 `cos-patrol-timer` 树基建（patrol-due.json 形·W42/W43 在役样本）；
- 落地=C COO 统排窗（CTO 工具+COO 窗位）。

## §三 · 与既有规范衔接

- 树路径规范：tree-op/briefs 必写 operating-records 周目录（禁仓库根）——本卷 §1.4 A2 机械化为判据；
- 任务书树协议：任务书挂周平面→face 路由→拾取→拆树→节点收口（本卷立死=拆树后 tree-op 面的规范化形）；
- 销账纪律：节点毕必附 artifactCommit（=台账「销账必附验证锚」在树面的投影）。

---
—— COS 小贾（m-cos·C 项流程面）·写前现查 2026-11-22T22:25+0800（D-47 原值）
