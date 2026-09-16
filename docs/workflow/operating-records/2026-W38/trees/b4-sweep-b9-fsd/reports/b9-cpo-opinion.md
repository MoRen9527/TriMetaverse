# B4 扫尾批9 五席联审 · CPO 表态报告（靶标=FSD 席）

- **席位**：ChiefProductOfficer（CPO 小乔）
- **时刻**：2026-09-16T15:37Z（开工 date 现查）
- **批号**：B4-sweep-b9
- **程序位**：审零改动（M4）——本席联审全程零改动，未创建/修改任何靶标文件
- **独立性声明**：未读他席联审稿，席间零交换；本报告为本席对 FSD 席源件九件的独立逐件表态
- **依据链**：任务书 20260916-msg-resume 任务2；D-27 树协议；联审工作流 V0.2；三红线纪律（分歧挂起候裁清单化 / 保留权候 CEO / 冻结件豁免标注）
- **压缩二级令遵行**：跨批仅族名+一句话；未读先例原文；未读自家既往稿
- **靶标**：`/srv/fleet/TriCompany/source-agents/full-stack-developer/` 全 9 件（586 行），逐件全量读毕

## 〇、本批头条（先行）

1. **实操级地雷（本批最重）**：session-body「灌注/发布管线命令族」硬编码 dev 机绝对路径（`PYTHONPATH=D:\Code\ai\TriCompany`、`--source-root D:\Code\ai\...`、support-root 同）——**无 D-24 机位断言、无路径参数化**。dev 机工作区根=`D:/Code/ai/`，sg 机=`/srv/fleet/`（CLAUDE.md 机位注明文）；命令族被 sg 侧照抄执行必错。域知识价值高（五件套 validate/publish 全流程+已知坑位三条）恰因此打折。修法=路径变量化（如 `$TRI_COMPANY_ROOT`）或节首加 D-24 机位断言行（「dev 机原样；sg 机按 `/srv/fleet/` 同构换算」）。
2. **FD/FSD 缩写分裂实录**：session-body 正名=**FD**（对齐 D-13），源侧 frontmatter `name: FSD`、contract `role: FSD`、目录名 full-stack-developer——同席两缩写（FD/FSD）跨面并存，寻址面分裂。
3. **09 系半完成态**：认知层四件已 09 系修订代（colleagues/social 09 系标配全、soul 为完整版 54 行、尾句齐），而 body/contract 仍带族缺陷（dict 残留、清单缺条、域定制键与标准键同席分裂）——半新半旧同席共存。

## 一、表态总表

| # | 文件 | 级别 | 意见摘要 |
|---|---|---|---|
| 1 | full-stack-developer.agent.md | 建议 | 退役快照基准族命中（一句话代注） |
| 2 | agent-frontmatter.agent.md | PASS | 无意见（name=FSD 缩写分裂归 #4 统一表） |
| 3 | agent-body.agent.md | 建议 | 实现三分法域定制键与 contract 标准键同席分裂（沿域定制保留+映射注记判向）；双清单族；正面：CodeGraph 默认条款+三例外、TriRLC 现役名、自测门禁/技术债条款具体 |
| 4 | full-stack-developer.contract.yaml | 建议 | FD/FSD 缩写分裂源侧侧；dict 残留（族）；instructions 核查 3 条 vs body 5 条（缺条族）；runtime_equivalent=trimc:* vs 连席 openclaw:*（运行时命名空间两套并存，裁定权 CTO/管线侧，保留权）；edit requires_approval=false 连席唯一（注记待确认）。正面：instructions 块完整（08 系最全）+execute 命令白名单具体 |
| 5 | colleagues.agent.md | PASS | 无意见（09 系标配全；CPO 镜像条目照实认可；协作链清晰） |
| 6 | memory.agent.md | 建议 | 私域两现（族）；正面：五类记忆域贴合+「git 提交即真源」观+尾句齐 |
| 7 | session-body.agent.md | 建议（重） | 管线命令族硬编码 dev 机路径无 D-24 断言（本批头条实操级）；正名=FD 与源侧 FSD 分裂实录（归 #4）；正面：已知坑位三条实勘留痕（静默陷阱/写根 bug 候 CTO/contract accept v3.1=有意扩展——批3 v3.1 之谜就此解） |
| 8 | social.agent.md | PASS | 无意见（小全命名正身，09 系标配全） |
| 9 | soul.agent.md | 建议 | 四节与 body 逐字重复（族）；正面：09 系完整版 soul（四标配节全，与极简代差族成对照样板） |

**分布：PASS 3 / 建议 6 / 挂起 0。**

## 二、逐件意见明细

### 1. full-stack-developer.agent.md（退役件）—— 建议

- 退役快照基准族命中：补快照基准日+「口径以 agent-body 为准」，验收锚=不被误当现役口径。

### 2. agent-frontmatter.agent.md —— PASS

- 无意见。与 body frontmatter 一致；`name: FSD` 的缩写分裂问题系全席面议题，归 #4 统一表态，本件不单独计意见。

### 3. agent-body.agent.md —— 建议

- **理由**：①「实现决策三分法」用域定制键 `READY_FOR_REVIEW`/`NEEDS_CLARIFICATION`/`BLOCKED`，contract decision_rights 用标准键 approve/freeze/escalate——同席两套术语（族第三例）。判向沿前例域定制保留解：三键为实现域状态机语义自洽（READY_FOR_REVIEW=APPROVE 域内形态/NEEDS_CLARIFICATION=FREEZE 候澄清形态/BLOCKED=ESCALATE 域内形态），宜补标准键映射注记而非对齐改键；②「回答前必须核查」5 条+「固定前置核查」指针双清单并存（族）；③**正面**：核心职责 8 CodeGraph 默认条款（默认先 CodeGraph+三例外边界）与宿主 CLAUDE.md 规则同构；代码真源面已用 TriRLC 现役名（改名后随更）；自测即门禁/技术债如实条款具体可验收。
- **修改建议**：①三分法节补映射注记一行；②双清单归一（沿族处方）。
- **验收锚**：三分法带映射且与 contract 互查；清单唯一定义点；CodeGraph 条款保留。

### 4. full-stack-developer.contract.yaml —— 建议

- **理由**：①`role: FSD`（连 frontmatter `name: FSD`）与 D-13 正名 **FD**、session-body 正名 FD 分裂——FD/FSD 双缩写并存，寻址、名址对表、spawn 名三面不一；②responsibilities 第 5 条 dict 残留（族）；③instructions 固定前置核查仅 3 条，body/session 为 5 条（缺 Code Registry 详查与 CGR 补查两条，缺条族）；④tools `runtime_equivalent` 全用 **trimc:\*** 前缀，连席均 openclaw:\*——运行时命名空间两套并存（trimc 贴近现役 TriMMC，openclaw 疑旧代号，孰正裁权在 CTO/管线侧——保留权）；⑤edit `requires_approval: false` 为连席唯一（他席 edit 均 true）——工程线编码自主有理，但治理面宜有案（注记待 CTO/治理确认）；⑥**正面**：instructions 块完整在位（角色定位/认知分层/核查/实现决策/护栏五节齐——08 系最全 contract）；execute 白名单枚举具体命令（npm test/build、npx tsx 等）可直接执行验收。
- **修改建议**：①FD/FSD 统一（D-13 正名 FD 为准则源侧随更，或 D-13 补注 FSD 别名——裁定权 CHO/D-13，保留权）；②dict 同构化；③instructions 核查补至 5 条；④trimc/openclaw 命名空间随席间 schema 统一批次裁定；⑤edit 审批位随治理确认对齐。
- **验收锚**：name/role/正名三面一致或有映射明文；responsibilities 同构；核查 5 条同构；runtime_equivalent 前席间一致；edit 审批位有案。

### 5. colleagues.agent.md —— PASS

- 无意见。09 系标配全（当前原则/落点/层契约尾句）；**CPO 自域对照面照实表态**：「CPO 小乔：产品需求→实现理解——CPO 提供需求上下文，小全确认实现边界」与本席 colleagues 小全条目镜像基本一致（结尾措辞微差无冲突），认可；协作链五向清晰（CTO 架构约束/STE 质量交接/小布构建部署/CPO 需求上下文/小吴培训素材），「自测→门禁判据」交接规则在位。

### 6. memory.agent.md —— 建议

- **理由**：运行资产落点节 TRICOMPANY_COGNITION_HOME 两现（族命中一句话：合并为一条）。**正面**：五类记忆（代码库/实现模式/构建流水线/技术债/接口契约）域贴合；「已落地代码=git 提交本身即真源，不回写本件」真源观干净；层契约尾句在位。
- **修改建议**：私域条目合并（沿族处方）。
- **验收锚**：TRICOMPANY_COGNITION_HOME 落点唯一处。

### 7. session-body.agent.md —— 建议（重）

- **理由**：①「灌注/发布管线命令族」五条命令全部硬编码 dev 机绝对路径（`D:\Code\ai\TriCompany`、`D:\Code\ai\TriMetaverse\TriCompany-copilot-host-assets`），无 D-24 机位断言、无变量化——sg 机（`/srv/fleet/` 同构布局）照抄执行必错，**实操级风险**（本批头条）；域知识本身高价值（validate/check-sync/389 门回归/publish 双面全流程），风险恰在可复制性上；②line 5 正名=**FD**（别名 小全/全栈开发）——与源侧 name=FSD 分裂的 session 侧实录（归 #4 统一）；③**正面**：已知坑位三条实勘留痕（publish-agents 无 --host 默认 copilot 面静默陷阱；写根勘定 bug 在案候 CTO 域+过渡期组合公式；contract accept 面 `['3.0','3.1']` 且注 v3.1=ceo/CTO 席 session_body 扩展形态——**前批 v3.1 版本号之谜就此得解**，系有意扩展非漂移，跨批注记）。
- **修改建议**：①命令族节首加 D-24 机位断言行+路径变量化（或注「dev 机原样，sg 机按 /srv/fleet/ 同构换算」）；②FD/FSD 随 #4 裁定同步。
- **验收锚**：命令族带机位断言或变量化，双机可执行；坑位三条与源锚保留；正名面与裁定后口径一致。

### 8. social.agent.md —— PASS

- 无意见。工作名小全（CEO 正式命名，2026-08-01 上岗）与 body/contract/D-13 四面一致——命名分裂族免疫席；「未合并不说已交付」对外规则与自测门禁同构；层契约尾句齐备。

### 9. soul.agent.md —— 建议

- **理由**：①「认知分层约束」「当前原则」「运行资产落点」「层契约」四节与 body 逐字重复（族）；②**正面**：09 系完整版 soul（名字小全+角色气质+对话风格+禁止退化四标配节全，54 行）——与 08 系极简代差族（13 行缺三节）成对照样板，极简族修齐时可直接以此为模板。
- **修改建议**：重复节沿族处方（唯一真源点或模板明文豁免）。
- **验收锚**：同构段唯一真源点或模板明文豁免；四标配节保留。

## 三、红线适用说明

- **分歧挂起候裁清单化**：无挂起项，无候裁清单。
- **保留权候 CEO**：①FD/FSD 正名裁定归 CHO/D-13 名址规程；②trimc:/openclaw: 运行时命名空间取舍归 CTO/发布管线侧；③edit 免审批位的治理确认归 CTO 工程门禁框架——三项均非本席可裁，仅列事实与风险，保留权在此明示。
- **冻结件豁免标注**：#1 退役件按原子退役律保留不删，仅建议补快照基准。

## 四、汇总读数

靶标 FSD 席 9 件（586 行，09 系全编制）全量读毕；表态分布 PASS 3 / 建议 6 / 挂起 0；意见明细 14 条（分布 6 件）；本批头条=管线命令族 dev 机硬路径无 D-24 断言（实操级）+FD/FSD 缩写分裂+09 系半完成态（认知层新/body-contract 旧缺陷并存）；跨批族命中按二级令仅列族名：退役快照基准族 #1、双清单族 #3、dict 残留族 #4、缺条族 #4、域定制键分裂族 #3/#4（第三例，判向=保留+映射）、私域冗余族 #6、soul/body 重复族 #9、清单多版本免疫与命名分裂族免疫（小全四面一致+D-13 原生行）；跨批解谜 1 项：contract accept v3.1=ceo/CTO 席有意扩展（前批 v3.1 疑问闭环）；全程零改动，独立性无破。
