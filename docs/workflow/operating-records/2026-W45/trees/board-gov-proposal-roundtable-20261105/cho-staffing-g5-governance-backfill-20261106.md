# 件4 随动 G5·治理回填记录（CHO 席）

- sourceOfTruth: 本件（G5 治理回填工序记录·随排程单树归档）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 写前现查: 2026-11-06T22:14:18+0800

## §一 · 回填三处对表读数（验收锚）

1. **employee-roster.json（TC）**：v1.1.0→**v1.2.0**（rosterDate 2026-11-06）——新增 top-level `crewTopology` 段（dual-crew 模型·件2 定谳锚 ㊿+280·本地域席三段/duty 位执行班语义/scorable 归属/G3-G4 批次卷锚/试岗窗注/字段名候 D-73 注）·`_fieldSemantics.note` 增补 v1.2.0 行·employees 数组 14 席对象**零改动**（班次拓扑系组织级同构事实·top-level 承载避免 14 处冗余·duty 位系实例非编制不入数组）——load→改→dump 正形+断言（version/totalEmployees/len(employees)/crewTopology 四断言全过）。
2. **company-governance-state.md（TMV）**：新增「双班组形态席别拓扑（件2 定谳·G5 治理回填·2026-11-06）」节——定义锚/拓扑形/改版链锚（G1-G4 全锚）/roster 承载/试岗窗/登记面六行。
3. **handoff 机器对象（TMV W45 新立）**：`handoff-staffing-redesign-20261106.json`——scope（零 headcount 变更/A+B 批结构）/状态机六站（G1-G4 done 全锚·G5 in-progress·G6 pending）/验收字段四项/pending 四项/教训库三条。

## §二 · manifest 正式对表（G4 尾环补课读数）

- `trimetaverse-live-agent-publish-manifest.json`（v0.1·date 2026-10-20）：liveEntries 72 条·员工席 14 条全命中（source=agent-body 路径/target=.github/agents/<id>.agent.md·status=current-copilot-host-live）——**manifest 载 discovery 路径与身份面·无内容 hash 字段·G4 内容换代不触发 manifest 换代**（14 席路径/目录名零变更·DE 目录名映射双形态在册）——对表读数留痕·manifest 零欠账。
- manifest 换代触发面（候后批）：目录名/路径/status 变更时随批换代（本批无此类变更）。

## §三 · G5 验收口径（排程单 §三 G5 行对表）

- 交付物：回填 commit（TC roster+TMV gov-state/handoff/本卷）+台账行（本 handoff 对象状态机）✓
- 验收锚：治理面三处对表读数（§一三项）+manifest 对表读数（§二）✓
- 待办随迁：铸册窗 D-73 对 CAO 同窗对表（crewTopology 字段名式定谳+铸条）→G6 收口毕报呈 BOD（含 content-face 债项登记面）。

## §四 · 使用依据

- 排程单 v1.0 TMV@38bfaff8a §三 G5 行（owner=CHO·交付物/验收锚）
- G3 验收卷 TMV@183aebae3+G4 记录卷 TMV@77aa32a73（链锚）
- roster 结构实勘（topKeys 8/_fieldSemantics/tiers C-suite+Execution/families Role·2026-11-06T22:1x 读）
- manifest 结构实勘（liveEntries 72/governance dict:6·CSO 条目抽验）

—— CHO 小源 · G5 治理回填记录落卷（写前现查 2026-11-06T22:14:18+0800·G6 收口续推）
