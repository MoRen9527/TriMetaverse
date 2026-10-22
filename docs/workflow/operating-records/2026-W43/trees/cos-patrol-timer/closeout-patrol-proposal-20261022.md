# 方案稿 · 树收口主动化（closeout-patrol）· COS 评估出稿 v0

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W43/trees/cos-patrol-timer/closeout-patrol-proposal-20261022.md）
- syncMode: write-time（COS 写时维护）
- 出稿人: CEOChiefOfStaff（小贾/m-cos）
- 令源: BOD 2026-10-22 20:44:43 信（CEO 20:43:37 两问触发·「你评估出稿·不即行」）
- 流向: 本稿 → COO 会签 → 随条款化批窗（候 CAO 窗）走 · 本稿不即行部署
- date 写前现查: 2026-10-22T20:45:55+0800

## 一、实证缺口（BOD 勘定采纳）

收口链现役=纯事件驱动（毕报到达→验销→销账）。两族静默缺口无触发器：

1. **「终态卷已落树未销账」**：卷落了树、commit 了，但销账动作未发生（或毕报信未达/漏达）——事件链断点静默。
2. **「该动没动」**：台账在途行挂「候令/候裁/候窗/候报」态，外部输入迟迟未达，无静默自驱发现——增档①（候令类 4h 自动催办，BOD 20:20:18 立）已覆盖「候令类」的脑内裁量面，本稿补机械兜底层+全谱四族。

## 二、方案主体：cos-patrol-timer 第三类巡检（不新开 job）

**载体**：现役 cos-patrol-timer 30min 对拍（patrol-watchlist.json 驱动·patrol-due.json 出信号）扩展第三类巡检 `closeout-patrol`——与既有 nudge 对拍同拍同轮执行，零新 job。

**A 向 · 未销账发现**：
- 输入：ledger-mirror.md 台账在途行 → 逐行取「验销锚所指树路径/项 id」
- 扫描：对应树路径下文件名含关键词白名单（首版=`毕报|收口毕|终态|closeout|请验销`）的文件
- 判据（双锚·防误报）：文件存在 **且** 该文件所在 commit hash 经 `git merge-base --is-ancestor <hash> dev` 在链——「硬门签认必落卷直达」纪律的机械执行面（已发≠在链，树在链才认）
- 命中 → patrol-due.json 出 `nudge{type:"closeout-pending", itemId, treePath, commitAnchor, nudgeCount++}` → 我按催办强度裁量（#1=实催销账责任面对应名址+自催自销；#2=实催+升级提示；#3+=升级 BOD 派工面）

**B 向 · 该动没动发现**：
- 输入：台账在途行挂「候」态行（候令/候裁/候窗/候报四族）
- 判据：挂起起点距今 > 4h（增档①阈值机械执行）或行内自带更严时限
- 命中 → `nudge{type:"awaiting-stalled", itemId, awaitingType, hangStart}` → 同上强度裁量
- 与增档①关系：①=我脑内裁量执行面（已即行），B 向=机械扫描兜底防漏判（如对拍轮之间挂起到达 4h 窗）——互补不重叠计

**排除面（勿催清单照旧）**：repeatHold 态、observe 项、人链在途单（候 CEO 实时在席确认类）、明确「候裁不升级」标记项（D-39 全域授权面自裁项不催 CEO）。

**节律与成本**：随现有拍点每拍执行 A/B 两向；预计每拍增量 <1min（glob 文件名+关键词 grep+台账对表，无跨机操作）；零命中零动作免回复照旧。

## 三、施工面（候批窗，本稿不即行）

1. patrol-watchlist.json 结构扩展：新 `closeoutWatch` 域（A 向路径映射表）——台账在途行↔树路径手工登记+每拍自动对表。
2. 对拍 prompt 模板增第三类巡检段（现役模板路径 W42→W43 切换挂办一并处理）。
3. patrol-log.jsonl 增 `recordType:"closeout-patrol"` 条目形态。
4. 关键词白名单 v1 候 COO 会签+CAO 条款化窗校订。

## 四、风险与缓解

| 风险 | 缓解 |
|------|------|
| 阶段性毕报误命中（「首半毕」≠全毕） | 主判据=内容行「请验销/候销账」明示语；文件名关键词仅粗筛 |
| 双锚断言成本（merge-base 逐件） | 仅对关键词命中件跑断言（通常 0-2 件/拍） |
| 台账行↔树路径映射滞后（新行未登记 closeoutWatch） | A 向降级=直接扫台账行内引用路径（台账即真源·行内无路径则 B 向兜底） |
| patrol-log.jsonl 同拍并发写 | 维持现役单写者形（对拍轮=COS 本席），不动 |

## 五、候裁点

- 节律=随现有 30min 拍（候 COO 会签意见：如需独立低频拍可改 2h 一拍降耗）。
- 阈值 4h=增档①同源（候 COO/CAO 是否分族差异化）。
- A 向扫描域=当前周+前一周树（跨周挂账行覆盖）——候核。

—— COS 小贾（落款 date 原值粘贴：2026-10-22T20:45:55+0800·发毕对表）
