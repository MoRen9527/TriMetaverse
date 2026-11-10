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

## §二 拆解坐标系（CEO 已点选）

**CEO 点选：候选 A（2026-11-10 11:27 直连令）**——FADE-001 周迁移十段逐段过审。

CEO 令「按 FADE 规范设计的 10 个阶段」逐段过审。本席取证候选三套（正身并列供选）：

- **候选 A·FADE-001 周迁移十段**（推荐·最贴 FADE-001 现役实现）: cron 触发（周日 23:50·job 9c81c7ec）＋迁移器五步（OP index→unresolved→trees→carry-over→通知·=push 段承载）＋FADE 四段 agent 承接面（verify→score→close-skill→close-cli）——合计十段。STAGE_ORDER 正身=close_framework.py 五段常量，plan 行 26「FADE 十段序」即此合称。
- **候选 B·IPD 十阶段**: DISCOVERY→INTELLIGENCE→DESIGNING→CODING→VERIFY-INTEGRATION→REDTEAM→QA→DEPLOYMENT→ASSURANCE→DELIVERY（fade-protocol-spec §6.3 同构分析对象·TriDev/IPD 线非 FADE-001 本体）。
- **候选 C·FADE lifecycle 状态机段集**: PLANNING/EXECUTING/CLOSING+终态族（APPROVED/FROZEN/ESCALATED/RETRY·spec §2.5）。

## §三 拆解记录（逐段·经 CEO 同意的优化点才入此节）

### §三.0 CEO 预审分析件（2026-11-10 11:27 令·责任与规避）

**件一·145 归一化挂账未落——责任事实链与规避**：

- 事实链：出卷+冻结=CTO 域 N-D1/N-D2 令链（11-05 冻结仪式·卷面 version 自记 CTO 执冻结）；N-D2 冻结卷行 28 自注将归一化「归 Score 实施校准项」=挂给未来；score_engine（N-D3 件②）至今未实弹→校准项前置未发生→挂账悬空；首评 13.8% 直接以 145 分母输出，复核链（值席→CTO 终判→BOD 转报）无人拦分母口径——**BOD 自领**：值守转报面未察觉分母异常（11-09 20:48 首报即照转 13.8%）。
- 责任归纳（事实自明·裁归 CEO）：①出卷形态设计（145+零主观+零阈值）=出卷/冻结链（CTO 域）设计缺口；②挂账悬空=机制缺口（卷面自注式挂账无台账承载·无责任席·无触发条件=**无主挂账必丢**）；③监督面=复核链缺「考卷形态合规」闸（BOD 转报面同责自领）。
- 规避候选（候 CEO 同意转正）：
  - J1 出卷门禁四查：冻结仪式加机械闸（百分制断言/含主观题断言/含阈值断言/权重合计断言）——四查不过冻结不放行。
  - J2 挂账必须带主：凡「归 XX 实施」式挂账必须落台账带责任席+触发条件+复查时点——禁卷面自注式挂账。
  - J3 评分输出口径门：Score 输出必带卷面元信息（总分制/阈值/卷版本）——非百分制分母即疑。
  - J4 复核链加「考卷形态对表」检查项（COS 复核/BOD 转报两处）。

**件二·score_engine 未实弹——责任事实链与规避**：

- 事实链：N-D3 四骨架（3e0994b）已交付且中性冒烟 28/28——但**冒烟≠实弹**（未在真迁移轮自动评分过）；plan 灰度条款「引擎缺席灰度=fallback patrol 旧形如实注」=设计内置的合法降级通道——11-09 首评走 fallback 完全合规→**灰度条款成了长期豁免口**（无人推实弹·一直 fallback）。
- 责任归纳：骨架施工交付=CTO 域完成；**实弹接入缺失**=灰度无退出条件（无时点/无触发器/无验收门规定「何时必须实弹」）——机制缺口：合法降级通道无 sunsetting。
- 规避候选（候 CEO 同意转正）：
  - J5 灰度必须带退出条件：任何 fallback 条款必须同时写死实弹时点或触发器（如「下一轮迁移强制实弹·失败即升级」）。
  - J6 骨架验收=实弹一案：骨架类交付验收门=中性冒烟+真轮实弹各一（冒烟单过不验收）。
  - J7 强制评分轮禁静默降级：首评/终判轮引擎缺席=升级 CEO，不得静默走 fallback。

**件三·命名与代码落差疑点（CEO 已认可「挖细节」目的）**：

- plan 行 26 自称「FADE 十段序」，STAGE_ORDER 代码常量（close_framework.py L7）实为五段——「十」=FADE 五段+迁移器五步合称，名实有落差。**已入档**（CEO 2026-11-10 11:27「是的」认可）。候选优化（候同意转正）：J8 段名与代码常量单向对表（文档段名引用代码常量名·防漂移）。

### 第一段·触发段（cron 拍）——过审中

**现状三面**：
- 设计面：cron `50 23 * * 0` Asia/Shanghai·河源 TriRMC job 9c81c7ec weekly-plane-shift（10-18 CEO 令改形）·触发后 30 分钟 agent 到岗窗（23:50-00:20）；plan 前置断言四条（hostname/ff 断言/无进行中 git 操作/8710 healthz+cron enabled 探针）。
- 考卷面：T1 触发时点纪律（权重 20）——判迁移是否 cron 零点轮触发；本轮 N/A 免评（应急链承接）。
- 实弹面：11-09 23:50 轮 cron 正常触发（push 段才失败）——触发本体无事故史；W38→W39 翻周事故根源在树迁移段非触发段。

**发现候选（候 CEO 同意转正）**：

- F1 触发漏跑无监测：job 9c81c7ec 漏拍/死亡无任何闸会发现（preflight 缺席=联审共识七项之一）——触发段是全链第一张多米诺。候选：触发后 N 分钟无 per-run 日志即告警（与候批件②P1 告警+preflight 挂钩）。
- F2 到岗窗无断言：T1 只判 cron 触发不判「agent 30 分钟到岗」——到岗窗设计存在但考卷无对应检查项。候选：T1 判据扩为「触发+到岗」双断言。
- F3 免评分母规则缺：T1 N/A 时权重 20 仍计入分母（首评分卷 20/145·若剔除 T1 应为 20/125=16% vs 13.8%）——scoreable_run 只注「异常轮按 T6 免评规则记」而 T6 免评规则未定义分母处理。**分数口径第三层疑点**（145 非标+归一化未落+免评分母规则缺）。

**CEO 判定**：（候 OK/意见）

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
