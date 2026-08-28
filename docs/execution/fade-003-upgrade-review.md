# FADE-003 升档完整档联审方案包（董事长助理备料）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/fade-003-upgrade-review.md
- syncMode: source-only
- lastSyncedAt: 2026-08-28
- 性质: 升格方案包——组织者=董事长助理小贾（xiaojia-hub-r2）；双席=小乔 CPO/小狄 CTO（经编排层通道转投裁定）
- 标的: FADE-003 共学周记（现 FADE 兼容档，首评 80 卡线冻结）升完整档——降档根因五项补齐方案
- 约束核对（组织令三条）: score 为**追加段**（begin/qualify/append/close 既有逻辑零改动，close 仅扩词表）；D-06 引用不动；journal-cli.mjs **单实现**（§7.4，无第二脚本）
- 诚实声明: 本包为纸面方案件；Score 实跑未发生，禁在实施前宣称档位变化（细则 10 自我适用）

---

## 一、正典链现状锚（方案基座）

- 执行体：`TriMetaverse/scripts/journal/journal-cli.mjs`（294 行）——子命令 begin/init/qualify/append/close；审计 `journal-run-log.jsonl`（logRun action/verdict/runId 贯穿）。
- close 现行：输入词表 `approved|escalated`（0b 检查）→机械五查 C1-C5→终态 `APPROVED|ESCALATED`；机械查不过时 agent 裁 approved 仍 ESCALATED（Close CLI=校验者非发起者）。
- 规范 v1.0（ade-journal-recording-spec.md）：生命周期八段（事件→登记 begin→Qualify 四问→Plan 三查→DCE qualify/append→Close Skill→Close CLI→终态 APPENDED/BLOCKED/ESCALATED）；P3 只追加不重写。
- 存量 run：journal-run-log.jsonl 现 2 行（W34：qualify ESCALATED + close CLOSED——registry 描述修正已如实标注）。
- 降档根因（registry v2.0.2 对照）：Score 双段缺失（W34 违规制度根源）/Verify 缺失/触发手动化/终态两态分辨率不足/Qualify 自判无独立裁判。

## 二、score --run 子命令设计（Score CLI，追加段）

**位置**：DCE（append）之后、Close Skill 之前——Score 段位（spec §2.6/§2.8）；run 链追加：`score` 为第五子命令，logRun 新增 `action:'score'`（既有四 action 零改动）。

**调用**：`node journal-cli.mjs score --week 2026-W35 [--run <runId>] [--json]`

**确定性检查项 S1-S7**（对照周记 spec 逐条；输出=§2.6 评分合同：item/score/max/evidence_ref/omission/total）：

| # | 检查项 | 同源 | 判定 | 权重 |
| --- | --- | --- | --- | --- |
| S1 | 五件结构完整（现象/具体表现/解决方案/问题影响/当前经验双条） | C2 | 解析本次 2.n 条目逐件匹配 | 20 |
| S2 | 文件头元信息在且 lastSyncedAt 已更新 | C3 | 元信息正则+当日比对 | 10 |
| S3 | 落盘路径在当周目录 | C1 | 路径前缀校验 | 10 |
| S4 | 同题去重（全周 2.x 标题扫描零重复） | append 去重同源 | 标题集 diff | 10 |
| S5 | run 链完整（begin+qualify QUALIFIED+append APPENDED 同 runId 在 run-log） | 登记段 | run-log.jsonl 程序回放 | 15 |
| S6 | 脱敏复核零命中 | qualify 同扫描表 | entry json 复扫 | 5 |
| S7 | 只追加不重写（P3：本次 append 未改动既有条目） | P3 | 条目数守恒+既有条目 diff 零变化 | 10 |

- S 合计 **80**；omission 语义=任一 S 项 fail → `omission:true` → 必选不过。
- envelope（§2.2 四不变量）：`{protocol:"journal-score", version, mode:"score", check_time, status:"pass|fail|error", summary:{items_total, items_failed, omission, errors}, items:[{id,score,max,evidence_ref,omission}], total, errors[]}`——守恒=items 数与 summary 对账；rc：工具/IO 故障才 rc=1，**评分高低不动 rc**（不达线走 RETRY 状态机，非工具错误）。

## 三、Score Skill 方法成文（四维度语义评定）

| 维度 | 判问 | 分值 | evidence_ref |
| --- | --- | --- | --- |
| W1 现象捕捉 | 现象/具体表现具体可复现、非模糊感受（对齐 Q1） | 0-5 | 2.n 内原句引文 |
| W2 解决方案可操作性 | 第三方可照做（步骤完整、有 workaround 或明确结论） | 0-5 | 同上 |
| W3 影响面真实度 | 问题影响不夸大不缩小、范围如实 | 0-5 | 同上 |
| W4 经验提炼 | 当前经验双条超越个案、对用 AI 做项目的人有通用性（对齐 Q4） | 0-5 | 同上 |

- W 合计 **20**；载体=撰写 agent 自评表（JSON：w1-w4 分+引文）随 close 提交；**判定人独立性：首 3 个功能期 run 双席抽验**（组织者利益声明：FADE-003 执行体含本席，自证风险结构性存在）。

## 四、评分合同合成与双门槛

- 总分 = S 覆盖 80 + W 语义 20 = **100**。
- 双门槛：**必选**=S1-S7 全部通过（omission=0）；**总分** ≥ **80**（提案定值，双席裁）。
- 不达线 → RETRY（见五）；达线 → close APPROVED。

## 五、RETRY 状态机设计

```text
append APPENDED → score PASS → close approved → APPROVED
append APPENDED → score FAIL → close retry（--note 引用评分 JSON 路径）→ 终态 RETRY
RETRY → agent 按 items 修订 entry → append --revision（同 runId，替换原 2.n，log 记 revision 链）
      → score 重跑 → PASS → close approved → APPROVED（同 runId 完整审计链）
RETRY 且结构性不可修（如敏感内容） → close escalated → ESCALATED（CEO 裁决）
```

- 修订合法性：P3「只追加不重写（CEO 明确要求修订除外）」增补豁免条款——**评分驱动的 RETRY 修订**为合法重写（spec v1.1 增补，修订限本次 run 产出条目，禁止动他人条目/已签发内容）。
- run-log append-only 不变：RETRY→重评全程同 runId 多行留痕，终态取最新 close 行。

## 六、词表升四态兼容性评估（R-C4）

- close `--verdict` 输入扩为 `approved|escalated|retry|frozen`（**大小写归一**：输入 toLowerCase 后校验，存量脚本小写调用零破坏）；终态词表升 `{APPROVED, ESCALATED, RETRY, FROZEN}`（对齐 spec §8.3 家族）。
- FROZEN 语义=签发归档冻结（衔接 README 版本递增规则——已签发版修订禁令的自动化面）；现阶段预留少用，注册即全开避免二次扩值。
- **存量 run 2 行**：历史冻结不动（append-only 审计 + 细则 10 不溯及既往——新词表仅对新 run 生效）；存量 `CLOSED` 行作为 W34 历史终态保留原值。
- 机械五查优先级不变：C 查不过时即使 verdict=approved 仍 ESCALATED。

## 七、试卷草案（T1-T8；未冻结稿——冻结时点见排期）

| # | 检查项 | 权重 | 载体 |
| --- | --- | --- | --- |
| T1 | 五件结构（=S1） | 20 | Score CLI |
| T2 | 元信息头+lastSyncedAt（=S2） | 10 | Score CLI |
| T3 | 落盘路径（=S3） | 10 | Score CLI |
| T4 | 同题去重（=S4） | 10 | Score CLI |
| T5 | run 链完整（=S5） | 15 | Score CLI |
| T6 | 脱敏复核（=S6） | 5 | Score CLI |
| T7 | 只追加不重写（=S7） | 10 | Score CLI |
| T8 | 语义四维度（=W1-W4，每维 5 分） | 20 | Score Skill |

- 权重合计 100；双门槛=必选（T1-T7）全过+总分 ≥80。
- 冻结时点：FADE-003 为静态固化 Plan 型（周记格式正典固定）——提案冻结时点=**score 载体定版 commit 同盘**（_fadehash 双 hash，FADE-001 扩维卷先例），首个升档评分 run 收口对卷；留双席确认 v2.0.3 Plan 时点口径适用性。

## 八、触发自动化状态评估（如实，不阻塞）

- 现状=手动/prompt 触发（Agent-owned 最弱形态，降档标注之一）——按 FADE-002 先例「手动/指令触发列增强项不影响档位」处理：**不阻塞升档**，如实标注；cron/resident 触发挂 automation-backlog（四项自动化计划面不变）。

## 九、实施排期（裁定后）

1. **D0+1 实现窗**（单 commit 窗）：journal-cli.mjs score 子命令+close 词表扩值+大小写归一+RETRY revision 路径+spec v1.1 增补（Score 段/RETRY 状态机/词表四态/P3 豁免条款）。
2. **D0+2 冻结+首跑**：试卷冻结（载体定版同盘）→W34 后首个真实周记 run（W35/W36 自然发生即跑）全链 begin→qualify→append→score→close；run↔段证据索引现场建。
3. **D0+3 评定**：Score Skill 首评（T8）+双席抽验。
4. **达标后**：登记册升档完整（三方联审备案；补齐项五条逐项销）。
5. 齿条：触发自动化（resident）挂 automation-backlog 跟踪。

## 十、提请双席裁决点

1. 总分阈值 80 与必选集范围（T1-T7）确认。
2. Close Skill 缺位处置的 FADE-003 版答案确认（本包：轻量独立化=撰写 agent 语义裁决+评分达标程序化判定三态，与 FADE-001 立法同构）。
3. FROZEN 全开 vs 预留（本包建议：注册即全开）。
4. 试卷冻结时点提案确认（载体定版同盘）。
5. RETRY revision 路径与 P3 豁免条款措辞确认。
