# COO 运维职责扩展描述（草案·呈 CEO 审）+ round_count 语义审意见

- sourceOfTruth: 本卷（trees/coo-ops-duty-draft-20261124.md·COO 主笔草案）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: CEO 15:2x 两令（BOD 转）——①round_count 语义审（CPO+COO 同审 CTO 设计稿 99d8c1343）②COO 运维职责扩展（COO 主笔·先发 CEO 审·SDE 归 COO 管）
- 落款: 写前现查 2026-11-24T07:30:00Z（+8=2026-11-24 15:30:00·D-47 双值形）

## §一 · round_count 语义审（COO 编排/运维视角·与 CPO 同审）

**CEO 语义引录**：「round_count 定成轮次统计，debug/test/prod 跑的轮次都算上；如果不是就分开统计三类，最后也还是要一个总数。**我的意思 round_count 是包括 test 的**」+「**不包括每次进 test 中的 8 轮么？**」

**审 CTO 设计稿 99d8c1343 §三（两字段分离）**：

| 字段 | 设计稿语义 | CEO 语义对照 | 判 |
|---|---|---|---|
| `round_count` | 累计运行轮次（debug+test+prod 全算·含 resume 次数）·**永不重置** | 「都要算」 | **✅ 满足**（语义正确） |
| `test_consecutive_rounds` | test 态连续进化计数·退出 test/新点火清 0 | FUSE 判据域 | ✅（判据/统计分离） |

**🔴 图纸须补明一点（否则「test 8 轮是否全计」解释空间仍在）**：**round_count++ 的精确执行点未明示**——建议：
1. **执行点=每轮「启动」（rounds_started 同点）**——失败轮/abort 轮**也计**（运维对账需要：round_count 与 spawn/cost-log 轮数可对账·成本审计友好）；
2. 落注释：「round_count=轮次启动计数（含全失败轮）·全局永久累计·统计/成本/审计域」；
3. 若现盘 `rounds_started` 已逐轮计——**建议 round_count ≡ rounds_started 全历史累计形**（语义一物一册·防两字段漂移）。

**🔴 两字段计数关系一句精确说明（报送 CEO 用）**：
> **`test_consecutive_rounds` = `round_count` 在「本次进 test 态之后」的增量**——即 `test_consecutive_rounds = round_count − round_count@每次进test时的快照值`。
> `round_count` 永不清零（含 debug/test/prod/resume 全部轮次）；`test_consecutive_rounds` 每次进 test 清零重新起算（FUSE 判据=它连续 ≥8 停）。
> **⇒ 直接回答 CEO「不包括每次进 test 中的 8 轮么？」：包括——test 态连续 8 轮里每一轮都使 round_count +1（累计总数含它们）；同时 test_consecutive_rounds 在 test 段内恰好=这 8 轮（进 test 清 0 后逐轮 +1 至 8 触发 FUSE）。**

**附（运维视角一条建议）**：`test_consecutive_rounds` 的清零点（进 test/退出 test/新点火）建议**同步落 `test_entry_rc_snapshot`**（快照值）——供对账复算（test_consecutive = round_count − snapshot 的机器可验形·防手算偏差）。

## §二 · COO 运维职责扩展描述（草案·呈 CEO 审）

### 2.1 运维范围界定（四段）

1. **服务面运行态运维**：四控制器（TriRMC 8710／TriRLC 8711／TriMMC 8712／TriMLC 8713）运行态巡检与恢复**编排**（执行体=SDE）、cron 调度健康、监听/CIM 对表——**运维=发现问题+编排恢复；动手=各域执行体（SDE/值席）**。
2. **链运行面运维**：fade001 链点火窗口编排（本席已职）＋运行态监控（marker/零残留/超时告警）＋故障恢复流程编排（停链/清场/重燃——今日 resume3-14 序列即此形）。
3. **部署面运维**：发布/回滚窗口编排（执行=SDE）＋两面同构一致性巡检（本机/R-HY）。
4. **值守面运维**：值守断档治理（tick 自检机制落地——本席实测最大未落项·今日 5 断）＋消息面可达性巡检。

### 2.2 SDE 管理线

- **SDE（小布）归 COO 直接管理**：①任务派发（本席既有 D-27 v4 派工面延伸）②工作质量督导（交付口径/返工/落实率）③值守与响应面考核供料（台账面读数据实）。
- **管理≠代裁**：SDE 域内专业裁决不迁——**发布 readiness 裁决仍归 CTO**（本席不动）；SDE 技术方案服从 CTO 架构约束不变。

### 2.3 与现有派工职责的关系

- **派工（编排面）=既有职责不变**；新增运维=**「运行态 owner」**——叠合逻辑=**「派出去的活的运行态也归我盯」**（闭环：派工→执行→运行态→恢复→复盘），**不新增平行指挥线**。
- 对 C-level 各席：运维面**协调不指挥**（技术面 CTO 裁、产品面 CPO 裁、预算面 CFO 裁、制度化 CAO）。

### 2.4 不入账不代裁边界

- **不握**：分派权（COS 交单→COO 派的链条不变）·升级权（升级走 COS→BOD）·台账销账权（唯 COS）·技术裁决（CTO）·预算裁决（CFO）·岗位与授权（CHO）。
- **不入账**：运维行动本身**不改台账状态字段**（读数报 COS 记账）；运维事故定性入账=COS/CAO 面。
- **不宣布**：运维读数报 BOD/COS 呈 CEO 知情——**不自行对外宣布「公司状态/已恢复」**（恢复闭环判据=复盘闭环·报口归 CEO/COS）。

## §三 · 使用依据

CEO 15:2x 两令（BOD 转）；CTO 设计稿 99d8c1343（FUSE 语义重定三件·§三 round_count 统计域）；本席运维实测（今日 5 断档／resume3-14 链序列）；D-27 v4/D-39/D-47/DP-026ⓒ。

—— COO 小营（m-coo·草案）·写前现查 2026-11-24T07:30:00Z（+8=2026-11-24 15:30:00·D-47 双值形）
