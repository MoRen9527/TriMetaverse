# 分档锚点表版本件 v1（CHO 责任面段·制度形段候 CAO 填·DP-040-02 T2）

- sourceOfTruth: 本件（joint-review-v13/anchor-table-v1.md·锚表 v1 责任面正身；制度形段=CAO 主笔候填）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令锚: COO DP-040-02 T2 联合派工（落款 2026-11-23T19:10:40Z/+8=11-24 03:10:40·T4 门开）
- 分权: **CAO=制度形（档位/判据/防漂移）·CHO=责任面（RACI/证据形/校准审计分设）**——两件同卷·本卷只写责任面，制度形段留位不代笔
- 写前现查: 2026-11-24 03:13:05 +0800

## §零 · 锚点实核计数（先对表再填表）

**实核：v1.1 表件（TC `runtime/cognition/fade001-dimensions-v1.json` 本机实读）= 35 项**（31 席维 + 4 治理维 gov-dim）——召集令称「34 项」**差 1 项**，如实注；本表按**实核 35 项**全量映射（不按 34 截断）。责任归属面首条动作=**对表计数**（缺 1 项即映射漏 1 席域·本表已补）。

## §一 · RACI 细表（35 项·R=该维域 owner 席｜A 制度形=CAO｜A 责任归属=CHO｜C=非 R 席互审｜I=COS 召集+BOD 观察）

| # | 维 id | 名称 | scope | R（域 owner） | A 制度形 | A 责任归属 | C | I |
|---|---|---|---|---|---|---|---|---|
| 1 | cos-flow-integrity | flow integrity | both | COS | CAO | CHO | 非R席互审 | COS+BOD |
| 2 | cos-ledger-sync | ledger sync | both | COS | CAO | CHO | 非R席互审 | COS+BOD |
| 3 | cos-review-discipline | review discipline | both | COS | CAO | CHO | 非R席互审 | COS+BOD |
| 4 | cos-gate-compliance | gate & escalation compliance | both | COS | CAO | CHO | 非R席互审 | COS+BOD |
| 5 | coo-a1 | 节奏保真度 | A | COO | CAO | CHO | 非R席互审 | COS+BOD |
| 6 | coo-a2 | 门禁卫生 | A | COO | CAO | CHO | 非R席互审 | COS+BOD |
| 7 | coo-a3 | 恢复闭环率 | A | COO | CAO | CHO | 非R席互审 | COS+BOD |
| 8 | coo-b1 | 迁移停机窗 | B | COO | CAO | CHO | 非R席互审 | COS+BOD |
| 9 | coo-b2 | 经营记录完整性 | both | COO | CAO | CHO | 非R席互审 | COS+BOD |
| 10 | cao-1 | 制度闭环度 | both | CAO | CAO※回避见§二 | CHO | 非R席互审 | COS+BOD |
| 11 | cao-2 | 留痕可审性 | both | CAO | CAO※回避见§二 | CHO | 非R席互审 | COS+BOD |
| 12 | cao-3 | 评审机制完整性 | both | CAO | CAO※回避见§二 | CHO | 非R席互审 | COS+BOD |
| 13 | cao-4 | 效力边界诚实度 | both | CAO | CAO※回避见§二 | CHO | 非R席互审 | COS+BOD |
| 14 | cpo-1 | 需求-实现对齐度 | both | CPO | CAO | CHO | 非R席互审 | COS+BOD |
| 15 | cpo-2 | 需求承载完整性 | B | CPO | CAO | CHO | 非R席互审 | COS+BOD |
| 16 | cpo-3 | 评审形有效性 | A | CPO | CAO | CHO | 非R席互审 | COS+BOD |
| 17 | cpo-4 | 产品语义可判性 | both | CPO | CAO | CHO | 非R席互审 | COS+BOD |
| 18 | cto-1 | 架构约束与实现一致性 | both | CTO | CAO | CHO | 非R席互审 | COS+BOD |
| 19 | cto-2 | 交付路径与门禁完整性 | both | CTO | CAO | CHO | 非R席互审 | COS+BOD |
| 20 | cto-3 | 质量门与可追溯性 | both | CTO | CAO | CHO | 非R席互审 | COS+BOD |
| 21 | cto-4 | 技术风险与可回滚性 | both | CTO | CAO | CHO | 非R席互审 | COS+BOD |
| 22 | cto-5 | 双形/切换行为等值 | B | CTO | CAO | CHO | 非R席互审 | COS+BOD |
| 23 | cho-1 | 岗位责任归属清晰度 | both | CHO | CAO | **CAO 代行※** | 非R席互审 | COS+BOD |
| 24 | cho-2 | 交接与留痕链完整性 | both | CHO | CAO | **CAO 代行※** | 非R席互审 | COS+BOD |
| 25 | cho-3 | 评审闭环与意见消化率 | both | CHO | CAO | **CAO 代行※** | 非R席互审 | COS+BOD |
| 26 | cho-4 | 授权与批权合规 | both | CHO | CAO | **CAO 代行※** | 非R席互审 | COS+BOD |
| 27 | cho-5 | 岗位覆盖与负载合理性 | both | CHO | CAO | **CAO 代行※** | 非R席互审 | COS+BOD |
| 28 | cfo-cost-decomposability | 成本读数可分解性 | both | CFO | CAO | CHO | 非R席互审 | COS+BOD |
| 29 | cfo-guardrail-presence | 预算护栏在位率 | both | CFO | CAO | CHO | 非R席互审 | COS+BOD |
| 30 | cfo-unit-econ-computability | 单位经济可算性 | B | CFO | CAO | CHO | 非R席互审 | COS+BOD |
| 31 | cfo-two-axis-separation | 两轴分立合规 | A | CFO | CAO | CHO | 非R席互审 | COS+BOD |
| 32 | gov-gate-semantics | 门禁语义 | both | CTO+CPO | CAO | CHO | 非R席互审 | COS+BOD |
| 33 | gov-approval-bypass | 审批绕过 | both | CTO+CPO | CAO | CHO | 非R席互审 | COS+BOD |
| 34 | gov-cost-anomaly | 成本异常 | both | CFO | CAO | CHO | 非R席互审 | COS+BOD |
| 35 | gov-duplicate-consumption | 重复消费 | both | CFO+COO | CAO | CHO | 非R席互审 | COS+BOD |

## §二 · 回避条款（自校准自审计禁止的落表形·责任面核心）

1. **cho-1..cho-5（R=CHO）**：A 责任归属由 **CAO 代行**（本席自维不领自己的责任归属核）；审计主核=COS，技术证据面=CAO——本席回避。
2. **cao-1..cao-4（R=CAO）**：A 制度形由 **CHO+COS 复核**（CAO 自维不自审制度形）；表述在表内标「※回避见本条」。
3. **cto-* 及 gov-gate/gov-approval（R 含 CTO）**：技术证据面审计由 **SDE+CAO 代核**（CTO 回避自己 R 维的证据真实性判定）。
4. **cfo-*/gov-cost-anomaly/gov-duplicate（R 含 CFO）**：成本证据审计由 **COO 代核**（CFO 回避自维读数核）。
5. **R=COS 四维**：召集面审计由 **CAO** 代（COS 回避自维召集核）。
——通则：**任何席不得对 R=自己的维行使 A（除制度形终审的 CAO 通例外）或审计权**；例外形=上表代行席。

## §三 · CHO 五维证据形表（并入锚表版本件·50/70/85/95）

（全文见 `opinions-cho.md` §二⑥；本版本件即并入，不另改口径。）

| 维 | 50 | 70 | 85 | 95 |
|---|---|---|---|---|
| cho-1 责任归属 | 仅口头·无字段·孤儿意见 | 有责任席无责任面/验证锚 | 三列齐·1-2 条锚含糊 | 三列齐+抽 3 条全可落（文件:行/卷锚）+孤儿零 |
| cho-2 交接留痕 | 断链（无落卷/无锚） | 主件在·断点 1-2 处 | 件齐·hash 未对表/签名缺 1 | 落卷+path+hash 可复算+签名全齐 |
| cho-3 评审闭环 | 无消化读数（静默丢弃） | 仅两计数·无逐条处置 | 处置表齐·digest 0.7-0.9+说明 | opinion_dispositions 全量·digest≥0.9+未消化带责任席时限 |
| cho-4 批权合规 | 越权批/无批件 | 批件在但五要件缺 2+ | 五要件齐·时点/台账缺 1 | 五要件全+明示+时点+台账+零三类·抽 1 件可复核 |
| cho-5 覆盖负载 | 大面积缺位/单席扛全链 | 缺 1-2 域/重载无缓冲 | 覆盖齐·活动读数部分·1 席重载有缓冲 | 七席齐+活动读数齐+零四职并载 |

**与 CAO 六档合形**：本表 50/70/85/95 分别落 L3/L4/L5/L6（区间适配）；L1/L2 区分保留（本席 §四A 补签条件①）；六档→要件映射表随锚表同卷（补签条件②·候 CAO 制度形段载）。

## §四 · 责任面确认（COS/COO 点名三项）

1. **校准**=域 owner 席（R）+ CAO 制度形（A）+ CHO 责任归属（A·自维回避）双签形——**自校准自审计禁止**（源验分离同构）✓
2. **审计**=COS（召集面）+ CTO（技术证据面·自维回避）+ 回避条款代行席——**审计者非校准者**✓
3. **校准者资格与留痕**=该域 C 席（专业下沉 D-90）；留痕三件=锚点版本号+校准人+时点+变更理由；变更走轮次边界（D-86 版本锁）✓

## §五 · 制度形段（候 CAO 填·本席不代笔）

轮次边界版本锁/六档判据表（L1-L6 三件式）/四条禁令/防漂移三条（共同锚维 3 个/跨轮分差≥15 告警/样例库）——按 `opinions-cao.md` §一 制度形段落位；本段留位，内容归 CAO 主笔。

## 使用依据

- v1.1 表件实读（35 项·TC runtime/cognition/fade001-dimensions-v1.json）
- COO DP-040-02 派工（03:10:40）·COS 二次召集（02:52）
- CAO opinions-cao.md §一（六档/防漂移/校准审计）·本席 opinions-cho.md §二+§四A（证据形/补签两条件）
- D-90（专业下沉）·D-92（自述同核组织形）·DP-026ⓒ（口径冻结·100 制不动）

—— CHO 小源（m-cho）·写前现查 2026-11-24 03:13:05 +0800（date 现查原值·D-47 正形）·零点火零施工
