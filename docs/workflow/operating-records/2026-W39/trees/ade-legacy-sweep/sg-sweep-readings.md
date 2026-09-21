# sg 仓面 ADE 残留清查·读数回执（夜航段①·留痕制）

- 执行：m-duty-cos，2026-09-22 0x:xx+08；简报=同目录 sg-sweep-brief.md（BOD 补投）
- 口径注：守卫脚本 ade_legacy_guard.py（80437b4+）未达 sg——按简报 §二口径等价实现（词界 `(?<![A-Za-z])ADE(?![A-Za-z])`+`ade-pattern|ade_spec_reference`；扩展名/排除项照抄），守卫脚本到位后可复跑对表
- 读数回：COO（排窗令）抄 CTO（对照表审定人）；同名词旗抄 CHO

## per 仓读数（MAP 20 仓）

| 仓 | 扫描文件 | 命中文件 | 命中数 | 冻结 | 活改 | 同名词旗 | 备注 |
|----|--------|--------|-------|------|------|--------|------|
| TriMetaverse | 1890 | 60 | 352 | 64+241+15REF | 31（见车道注） | 1 | output/ 发布产物档案=冻结类；镜像/发布面=管线车道 |
| TriCompany | 691 | 67 | 480 | 99+339+22REF | 18→**批1 已改 6 件 11 处** | 2 | 源侧真改面 |
| TriAvatar | 88 | 1 | 1 | 1 | 0 | 0 | 冻结 |
| TriSkill | 50 | 2 | 5 | 0 | 0 | 0 | 候批2 细判（5 行清单在读数附件） |
| TriTraining | 31 | 1 | 5 | 2 | 0 | 0 | 沿革句冻结；余候批2 |
| TriRMC | 134 | 2 | 2 | 0 | 0 | 0 | 候批2 细判 |
| TriCode/TriModel/TriMLC/TriMMC/TriPilot/TriStaciss/TriDeployment/TriTest/TriMEM/TriWeb4/TriChain/TriMobile/TriGateway/TriRLC | — | 0 | 0 | — | — | — | **零命中即闭** |

- 禁动边界：TriMC 服务目录未扫未触（A-1 硬边界照守）；TriModel.quarantine 退役档案不入扫（冻结类）

## 批1 活改（已落地）

- 范围=简报 §三-2 明示「ADE 模式」族，TC 源侧真源 `source-agents/senior-deployment-engineer/` 六件 11 处→「确定性执行规程（FADE DCE 段）」；commit **8b703e9**（TC dev，已推）
- 车道注：TMV 镜像/source-agents 副本、.github/agents 发布壳、compass 面、output/ 打包产物——**不手编**（D-07 禁编发布壳+渲染管线在本地），候本地渲染管线追平（同 T-a 口径）

## 批2 候细判清单（不擅断，照边界标旗）

- OTHER 类 580 行（TMV 241/TC 339）：含「ADE 自检步骤」「ADE spec」「完整 ADE 五段闭环」「ADE 第④段」「W33 ADE onboarding」等——属规则2「类」推及面但替换形未定谳，候细判（清单已存 /tmp/ade-cls.json，正式化随批2）
- REF 类 37 处（ade-pattern-spec.md 文件引用）：TMV 15/TC 22——带日期锚沿革句=冻结；活文档指针候批2 逐条改 fade-protocol-spec.md
- 同名词旗 3 处→**抄 CHO**：TMV `.github/prompts/项目级 AI 共学周记.prompt.md:23`（共学周记记录 ADE 规范）；TC 2 处（fade-papers/FADE-003-report.json:110、docs/training/fade-003-deep-dive.md:345 语境命中）
- 排雷建议回 COO：排除项建议增「output/」（发布产物档案类，本轮 24+ 行命中全冻结类）

## 补记：同名词旗 3 处 CHO 定谳（2026-09-22）

- 分类修正：三处非「另一 ADE 同名词」，系 **ADE 正典投影术语残留**（ade-journal-recording-spec.md §一自载「固化为 ADE 模式」+:15 上位规范=ade-pattern-spec §1.1）——批2 分类从「同名词旗」修正为「术语残留/正名候裁」。
- 处置（CHO 裁）：FADE-003-report.json:110+fade-003-deep-dive.md:345 **冻结不改**（历史实录，沿革口径=历史名冻结+映射承载）；prompt.md:23 链接行候 spec 正名裁后联动，未裁前不改。
- 升级候裁 1 项：spec 正身「共学周记记录 ADE 规范」正名 FADE 化（文件名/标题/内文 :33/:127 同步）——维护权自载归秘书处（COS 代管），CTO 协议域会签；CHO 意见支持迁移+FADE-003 registry 加历史名映射行。
- 边界注记（CHO 划定）：journal spec :15 上位规范链接属 REF 类 37 处族（批2 车道），不混入本词旗处置。
