# CTO 技术形卷·runId 作派工门号（CEO 提议·CTO+COS 联合出形·四问+四不变量）2026-11-23

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-runid-gate-form-20261123.md·技术形正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 明示「fade 协议规范里有一个 run id，这个 id 有 cos 发行行不行？没有这个正式批号，其他员工拒绝执行」（BOD 转达）·BOD 请 CTO+COS 联合出形四问

## §零 · 可行性实证（先于方案·三读数）

1. **launcher 接口=外部注入式**：`scripts/fade001-ignite.ts` L58 `runId: req('run-id')`——runId 由**调用方必传**（非 launcher 自铸）⇒ **COS 签发 → 点火时 `--run-id` 传入，零代码改动可行**（fail-closed：缺失即拒）。
2. **链层贯穿已有**：`chain_runner.ts` ChainParams.runId → 各段 argv `--run-id`（6220331 态 ✓）。
3. **轮层贯穿=缺**：`round_runner.ts` **runId 零命中**（grep -c=0）——RunnerState/round_state 无 runId 字段 ⇒ **r12 #16「runId 贯穿」缺陷的实质即此**。CEO 提议的「一号贯穿协议层」**依赖 #16 先落地**（前置）。

## §一 · 四问技术形

**① 发行时机**：**派单前由 COS 签发（预分配形）**——序=派单→COS 签发 runId→派单附号达席→执行→轮点火用该 runId（`--run-id` 注入·launcher 现接口）→产物落 run_dir（runId 命名）。签发≠轮启动（轮启动在施工完成后·点火令面）——**预分配形解决「派工先于轮」的时序矛盾**。

**② 粒度**：**两级（推荐）**——轮级 runId 为根 + 子派单序号 `<runId>-DP-NNN`。理由：一轮多席多派单（联审七席=7 派单），一号到底无法辨责任单元；两级使「回执归属+轮关联」兼得。兼容：现 `DP-YYYYMMDD-NNN` 形保留为无轮形；轮内次轮起迁移 `<runId>-DP-NNN`（不回改存量号）x。

**③ 无轮任务**：**「无轮 DP 号」形**（现 DP 形延续·scope 前缀可注明源头 `DP-<task/树id>-NNN`）。理由：①门号必须可追溯授权源头——无轮任务源头=任务书/树/CEO 令，DP 通用形覆盖；②**不为无轮任务铸 runId**（runId 语义=专指 fade 协议轮·语义膨胀会破坏④不变量「关联轮」）。判据：**有轮用 runId·无轮用 DP·两者皆门号**。

**④ 与 D-88 关系**：**DP 号保留 + runId 增补为轮级根**（不推翻 D-88）。D-88 条 2「无号不认」自然扩读为「**无门号（轮内 runId/无轮 DP）＝拒绝执行**」——**纪律册文字修订归 CAO**（本席出技术形+建议条款文字，候 CAO 铸）；COS 面承接=签发表单+签发表（台账新增「runId 签发」节）。

## §二 · ⑤ runId 四不变量对齐

| 不变量 | 落地形 |
|---|---|
| 唯一 | COS 签发（UTC 时戳+周号+轮类型+序号·形 `shift-<Wnn>-<type>-<ts>`·现役三形分野保留：`-loop` 进化轮/裸形常规拍/`-ignite` 点火形）+签发前去重核 |
| 可追溯 | runId ↔ COS 签发台账 ↔ 派单号（`<runId>-DP-NNN`）↔ 回执双落 ↔ run_dir 产物（链内三面同锚） |
| 关联 | runId 关联轮：run_dir 命名用 runId·链段产物落 run_dir 内·P5 trend 行挂 runId（#16 面施工项） |
| 恢复锚 | runId → run_dir → round_state（恢复定位）；**依赖 #16（runId 贯穿 round 层）落地后成立** |

## §三 · 实施序（技术依赖排序）

1. **#16 施工（前置·小改）**：round_runner 加 runId 贯穿——RunnerState.runId 字段+round_state 持久化+trend 行缀 runId（r12 任务书 #16 原项·本席给规格·执行归 FSD/SDE 候 COO 派工+DP 取号）；
2. **COS 签发流程**：签发表单（形规范/去重核/台账节）——COS 面出形（联合出形之 COS 半）；
3. **D-88 文字修订**：CAO 铸条（门号双形定义·「无门号拒绝执行」扩读）；
4. **试点**：下一轮（点火轮）起 runId=COS 签发型+派单号 `<runId>-DP-NNN` 首用；回执双落照 D-88。

## §四 · 风险与边界

- **#16 未落地前**：runId 只能贯穿链层（段产物），轮层/恢复锚缺——**不得宣称「一号贯穿已成立」**（本卷 §零 读数即证）；
- **签发中心化单点**：COS 值守断档=派单阻塞——缓解=值守面 30min 承诺（COS 现形）+超时规则（COS 台账 §三 已有）；
- **存量号不回改**：已发 DP-005~008 等存量号保留原形（历史叙事冻结），次轮起新形；
- 纪律层非防线：人手版签发依赖自觉（同 D-88 效力边界注）——机械面候 DEM-006/后续自动化。

## §五 · 使用依据

CEO 明示（BOD 转达）+fade001-ignite.ts/round_runner.ts/chain_runner.ts 6220331 态实证+r12 任务书 v3（167baf327·#16）+D-88 原文核读+纪律册+D-15/D-24/D-27 v4/D-47/D-87。

——CTO 小狄（m-cto）·写前现查 2026-11-23T00:41:22Z（+0800=08:41）〔commit 时戳锚·D-47 正形〕
