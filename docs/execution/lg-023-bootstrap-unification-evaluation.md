# LG-023 bootstrap 统一化评估报告（候裁）

> sourceOfTruth: 本件（一次性评估产出，候董事会裁决）；syncMode: static；lastSyncedAt: 2026-09-01
> 令源：董事会 2026-09-01 12:2x 令（CEO 原案转录）；分析组：小乔(CPO)内容面+小狄(CTO)工程/治理面，组长合成=小贾
> 边界：评估件候裁，不动真源不发布——TriCompany source-agents 与 .claude/agents/ 全程只读，发布管线未运行
> 组员全文：`.fade/hub/analysis/bootstrap-unification/xiaoqiao-content.md`（110 行）/ `xiaodi-engineering.md`（含 Q2 实测补录）；金丝雀证据 evidence-q2-canary.txt / evidence-q2-control.txt（同目录）

## 一、结论摘要

CEO 提案（bootstrap 内容抽取融入 source-agents 真源 ceo-chief-of-staff → FADE 发布 → `claude -n 小贾 --append-system-prompt-file` 一条命令启动）**技术上成立，采纳 B 案（全并入自驱动）+ 发布面双变体（spawn 变体+去 frontmatter 会话变体）+ bootstrap 降级为运行时应急覆盖件**。但有一道**前置硬工序**：源侧已三代漂移（发布版含 2026-08-28 增补、源侧 .agent.md 无之、agent-body 是更早 .github 世代、contract paths 指向不存在文件），**不对账归一就融合=把漂移固化成正式身份契约**。CEO 原案命令指向 `.claude/agents/ceo-chief-of-staff.md` 经实测不成立（frontmatter 原样注入污染，实测定谳；且 spawn 面 tools 限权与 session 面需求冲突），终态命令改指会话变体新路径。

## 二、五问逐答

### Q1 内容二性（小乔）
逐段判类：身份段→**入真源**；恢复五步→**自驱动化后入真源**；纪律四条→**拆分**（通用=date 现查/编号防伪/高影响候 CEO 在席→真源；会话面=不读旧 transcript/一任务一状态条/ListAgents 对名址→会话变体）；收尾动作（状态条报董事会+候核验不接任务）→**会话变体专属**；启动命令备忘→**退役**（现文自指自身路径，载体一变第一个腐烂）。**机制化指针成立**——bootstrap 原文已是模式化（「最新 full-*.md」「当前周」），补两条确定性规则即可：① full-* 取**文件名字典序最大**（内嵌 UTC 时间戳，字典序=时间序；勿用 mtime——可被复制/同步破坏且模型不可直接观测）；② 当前周=「`operating-records/` 下含 `daily-progress.md` 的最大周名目录」（勿让模型心算 ISO 周；实测 W35/W36 并存期唯一命中 W36）。**值型指针禁入**——发布面 L39 写死 `2026-W28` 已腐 5 周是现成反面教材。恢复步骤 4 的三协议替代勘误（7ba9a652/e06d6af0 董事会已裁决的稳定事实）必入真源，且须同步修掉真源现版 L76 对 `fade-protocol-spec.md`/`fade-registry.md` 的幽灵引用，否则新旧矛盾进同一份合同。

### Q2 frontmatter 实测定谳（小狄出实验包，组长代跑定谳）
**定谳：`--append-system-prompt-file` 不解析 frontmatter，原样注入，污染成立。** 金丝雀（YAML 头四键）实测 ①是②是③是——模型原样引用整块 frontmatter（`---`/`name: canary-probe-…`/`description: …`/`tools: [Read]`/`user-invocable: true`/正文标记串）；无 frontmatter 对照 ①否②是③否（幻觉校准通过）。证据：evidence-q2-canary.txt / evidence-q2-control.txt。附证据色：追加段落点=system prompt 尾部（gitStatus 字段之前）。**结论：会话变体必须无 frontmatter；CEO 原案直接指渲染产物不可行。**

### Q3 双重身份耦合（小乔/小狄合流）
**发布面出双变体，不做单文件双用。** 五条独立理由：① tools 冲突是硬伤（spawn 限权 `[Read, Glob, Edit]` vs session 需 SendMessage/ListAgents/Bash 全套；append 件不能授工具）；② frontmatter 污染（Q2 已定谳）；③ 纪律面互斥（spawn 无启动恢复语境，session 无单任务边界）；④ 发现面污染（会话变体若放 `.claude/agents/` 会被发现为可 spawn 代理，双 spawn 入口）；⑤ 管线小改可达（源侧已有 agent-frontmatter/agent-body 分离片段先例；source_publish_check.py L105-109 注释原文：「未来支持任何宿主=注册表新增一个条目，管线零改动」）。切分：spawn 专属=frontmatter 四件；双面共用=身份契约（现代化改写后）；session 专属=恢复五步+状态条合同（M-001 五字段）+名址纪律+收尾动作。**反对手工维护去 frontmatter 副本**（两份真源，违反单一真源）。

### Q4 真源治理链（小狄，组长增 S0）
- **S0 前置对账归一（本评估新增，必须先于一切修订）**：源侧三代漂移归一+contract.yaml paths 腐点修正（L17-18 指向不存在的 `colleagues-social.agent.md`，盘面实为分立两件）——清单见 Q3 陈旧度八条。
- S1 变更定性：现有员工五件套稳定职责变更，触发 `TriCompany/docs/workflow/host-object-publish-flow.md` §1.1 场景 2/5，全流程强制。内容分流：角色稳定规则→五件套；宿主启动命令与 .fade/hub-snapshots 运行态路径→binding profile（validator 明禁宿主 binding 事实进五件套，bootstrap 原文直接融入会被咬）。
- S2 真源修订：`source-agents/ceo-chief-of-staff/ceo-chief-of-staff.agent.md`（渲染 source）+ agent-body.agent.md + contract.yaml responsibilities（contract.version 现为 "3.0"，版本在此推进）。
- S3 源侧验证：`python -m runtime.cognition.employee_source_kit validate --source-root . --employee-id ceo-chief-of-staff` + employee_source_kit_validation unittest。
- S4 前置审批/验收：owner=CHO（chief-human-resources-officer-handoff-governance.md §2.5 五件套增量更新适用，§4 十项 checklist，§5 状态机 drafted→…→accepted）；制度化面=CAO/CompanyGovernanceRegistry。本案不触 CPO/CTO 专业面。
- S5 support+binding 再生成：`python -m runtime.cognition.employee_host_publish --employee ceo-chief-of-staff`（载荷+manifest+binding profile；启动命令事实落 binding-profiles notes）。
- S6 统一管线双宿主渲染：`python -m runtime.cognition.source_publish_check --publish-agents --host copilot|claude`（dry-run 默认）+ **新增 claude-session 渲染注册表条目**（去 frontmatter 会话变体——Q2 定谳后的硬需求）。
- S7 发布后验证：source_publish_check_validation unittest（13/13 绿门）+ derived_identical 对拍 + binding 与双面落点一致 + 宿主冒烟；**增补（小乔风险⑥）**：会话变体头部加版本戳+源 hash 自校验行，偏离即在状态条报告（append 件手改不可发现）。
- S8 留痕回填：publish-flow §2.1 门禁 7 项+operating records+commit 留痕+启动命令记录落 binding-profiles notes。

### Q5 目标态最简形（小乔，组长采认）
**B 案为主体+bootstrap 降级为运行时应急覆盖件。** A 案（bootstrap 瘦身仍作首条消息）不推荐：两步未达一条命令目标，且只是把内容二性降级为文件二性。B 案技术前提恰好都在：恢复步已自驱动化（补两条确定性规则即可）、源侧有 frontmatter/body 分离片段、身份契约由源侧单一合同承载双变体渲染。B 案唯一实质风险（机制合同入源侧失去热修通道）用应急覆盖件兜住：bootstrap-小贾.md 退役为爆溃/管线不可用时的热修通道，precedence 规则写进会话变体（「若存在 runtime bootstrap，恢复以其为准绳」）——覆盖件是运行时状态不是身份真源，与 `.fade/` gitignore 定位自洽。过渡态安全：裁决前维持现状（现发布面+bootstrap），落地顺序=源侧对账→管线双变体→命令切换→bootstrap 降级，不硬切。

## 三、抽取清单（回执要件）

| bootstrap 段 | 去向 |
| --- | --- |
| 身份段（你是小贾中枢/CEO 总助/名址） | 入真源（与 CLAUDE.md 分权制节对齐现代化改写） |
| 恢复五步 | 入真源（自驱动化+两条确定性规则；步骤 4 三协议勘误随入，并修真源幽灵引用） |
| 纪律四条 | 拆分：通用三条入真源；会话面三条入会话变体 |
| 收尾动作（状态条报董事会+候核验不接任务）+防打断条款（新增） | 会话变体专属 |
| 标准启动命令备忘 | 退役→治理文档/binding-profiles notes |
| **发布模板改动** | 新增 claude-session 渲染注册表条目（无 frontmatter 会话变体→`.claude\hub\ceo-chief-of-staff.session.md` 候定）；spawn 变体渲染照旧 |
| **真源同步大修（S0）** | 三代漂移归一+contract paths 修正+陈旧八条（Copilot-host 话语/W28 写死/幽灵引用/TriMC 改名/支撑包落点/名址状态条字段缺失/漂移归一/分权制零引用） |

## 四、终态启动命令形态（回执要件；与 CEO 原案差异加粗）

```
claude -n 小贾 --append-system-prompt-file D:\Code\ai\TriMetaverse\.claude\hub\ceo-chief-of-staff.session.md
```

**仍是一条命令；文件参数由 `.claude\agents\ceo-chief-of-staff.md`（实测不可行：frontmatter 污染+spawn 限权冲突）改为管线渲染的会话变体**（无 frontmatter，落 `.claude/hub/`——agent 发现面之外+git 可版本追溯；目录/命名惯例归 Governance 裁）。`-n, --name <name>` 旗标实测存在（help 原文）；中文名经 Win32 宽字符无损，坑在 .ps1 无 BOM（项目先例在册，启动脚本须 UTF-8 BOM 或 PS7）。

## 五、风险清单（候裁参考）

1. 恢复机制合同入源侧后变更走修订+重发布，存在时差——应急覆盖件兜底；覆盖件未版本化，换机场景需先走管线或治理文档重建。
2. 自驱动指针健壮性依赖两条确定性规则被严格执行——W35/W36 并存期是现成试错场。
3. 首轮自驱动依赖模型主动性——防打断条款必进会话变体，状态条是恢复完整性的机械判据。
4. 会话变体被 append 件直接消费、手改不可发现——版本戳+源 hash 自校验（S7 增补）。
5. 双入口认知一致性（user-invocable spawn 入口与 -n 命名会话并存）——CHO 验收显式确认项（小狄 F3）。
6. 工程增量：管线 claude-session 渲染条目需 CTO 排期评估（注册表设计意图内，管线零改动预期）。

## 六、候裁点

1. **方案骨架**：B 案+双变体+bootstrap 降级应急覆盖件（本报告推荐）是否批准。
2. **S0 前置对账**：源侧三代漂移归一+contract 腐点修正+陈旧八条修订清单，作为改造第一工序批准。
3. **会话变体落点/命名**：`.claude/hub/ceo-chief-of-staff.session.md` 建议（归 CompanyGovernanceRegistry 裁惯例）。
4. **实施授权与归属路由**：真源修订（CHO 验收域）/管线双变体（CTO 域）/制度化（CAO/Governance 域）——裁决后按归属分派另令。
5. Q2 已实测定谳（污染成立），无需再裁。
