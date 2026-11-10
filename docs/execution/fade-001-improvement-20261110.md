# FADE-001 改进文档（CEO×BOD 交互拆解 · 2026-11-10 起）

- sourceOfTruth: TriMetaverse/docs/execution/fade-001-improvement-20261110.md
- syncMode: source-only
- lastSyncedAt: 2026-11-10
- 立档令: CEO 2026-11-10 11:08 直连令——「对 fade 的①-⑦待批先记录进一个 fade-001 改进文档；马上详细的一步一步的，你和我交互，把 fade-001 彻底拆解，我也学习和审核下，给出更多意见，记录进改文档，一并优化 fade-001」
- 工作法（CEO 定）: 按 FADE 规范阶段序一个阶段一个阶段过；**只有 CEO 明确说 OK 才进下一阶段**；每阶段提出的优化点**需 CEO 同意才记入本文档**。
- 进化成功判据（CEO 定）: 全部优化点记录完成后开工改造；**主观题和客观题都需要更高的分数，才叫进化成功**。

## §一 候裁清单（①-⑦·CEO 待批项入档）

| # | 事项 | 内容 | 状态 |
|---|---|---|---|
| ① | 每周自动进化蓝图骨架+三边界 | B1 自动链止于草案候批面（CEO 确认制）；B2 考卷判据改版永不自动；B3 自动化只做机械面 | 候批 |
| ② | 兜底三件时点定谳 | COO 序：P1 告警+preflight ＞ P2 隔宿心跳 ＞ P3 R 面节律 | 候批 |
| ③ | 评审制度化铸册窗 | 联审评审机制铸册（主审形态/整改边界择形随批） | 候批 |
| ④ | FADE-002 第②步衔接 | 联审蓝图与 FADE-002 排期衔接 | 候批 |
| ⑤ | 联审改进项施工批 | 拆树派工（候批后转 COO 排工） | 候批 |
| ⑥ | FADE-001 出卷规范化 | 100 分制+客观题+主观题+通过阈值；证据=N-D2 自注 145 挂账未落+同实例三卷形态分裂（主卷 threshold=80/maintenance 100 分/plane-shift 145 分零主观零阈值） | 候批 |
| ⑦ | 联审五席维度标准化 | 纳入 FADE 考题大纲；应用于 FADE-001 第一轮进化改进 | 候批 |

## §二 拆解坐标系（候选·候 CEO 点选）

CEO 令「按 FADE 规范设计的 10 个阶段」逐段过审。本席取证候选三套（正身并列供选）：

- **候选 A·FADE-001 周迁移十段**（推荐·最贴 FADE-001 现役实现）: cron 触发（周日 23:50·job 9c81c7ec）＋迁移器五步（OP index→unresolved→trees→carry-over→通知·=push 段承载）＋FADE 四段 agent 承接面（verify→score→close-skill→close-cli）——合计十段。STAGE_ORDER 正身=close_framework.py 五段常量，plan 行 26「FADE 十段序」即此合称。
- **候选 B·IPD 十阶段**: DISCOVERY→INTELLIGENCE→DESIGNING→CODING→VERIFY-INTEGRATION→REDTEAM→QA→DEPLOYMENT→ASSURANCE→DELIVERY（fade-protocol-spec §6.3 同构分析对象·TriDev/IPD 线非 FADE-001 本体）。
- **候选 C·FADE lifecycle 状态机段集**: PLANNING/EXECUTING/CLOSING+终态族（APPROVED/FROZEN/ESCALATED/RETRY·spec §2.5）。

## §三 拆解记录（逐段·经 CEO 同意的优化点才入此节）

（候坐标系点选后开录·第一阶段=触发段）

### 拆解记录格式

- 每段: 现状（卷面/代码/实弹三面）→ 发现 → 优化点候选（CEO 同意后转正）→ CEO 判定

## §四 改造施工区（候 §三 全部记录完成后启动）

（空·候 §三 收口）

## 附: 关键实锚索引

- 考卷三件: TriCompany/docs/engineering/fade-papers/FADE-001-paper.json（threshold=80·10 工件 items）/ FADE-001-paper-maintenance.json（100 分·threshold 在卷）/ FADE-001-paper-plane-shift.json（1.1-frozen bf8ba0e0·T1-T9 权重 145·零主观零阈值）
- STAGE_ORDER 正身: TriCompany/runtime/fade_protocol/close_framework.py L7（五段常量）
- agent plan 正身: TriCompany/docs/engineering/fade-001-plane-shift-agent-plan.md（升版 2026-11-08）
- 协议正身: TriCompany/docs/engineering/fade-protocol-spec.md
- 首评分卷: operating-records/2026-W46/trees/首评分卷-20261109.md（13.8%=20/145 RETRY 级·判级走 N-D5 预案非卷内阈值）
- 联审总卷: operating-records/2026-W46/trees/fade001-migration-review-20261109/review-integration-20261109.md（TMV 460576e3e）
- N-D2 冻结卷: operating-records/2026-W45/trees/w45-carryover-fade001-upgrade/nd2-paper-freeze-20261105.md（行 28 自注 145 挂账）
