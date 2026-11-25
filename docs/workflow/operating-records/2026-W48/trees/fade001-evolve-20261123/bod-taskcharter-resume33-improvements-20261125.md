# 任务书·resume33 七席联审改进意见（66 条·呈 CEO 批）

- sourceOfTruth: 本卷（resume33 七席 opinions face.improvements 全量·BOD 整理呈批件）
- 令源: CEO「跑完把这一轮 7 席联审的改进意见任务书呈我批，不要自动进下一轮 resume」
- 输入: shift-W48-resume33-20261125T005648Z/opinions-{cao,cfo,cho,coo,cos,cpo,cto}.json 的 face.improvements（**66 条**·BOD 直核实证）
- 批注: improvements 曾被误读为 0（BOD 读 doc.opinions 空字段·CTO 查产出侧）——真实在 face.improvements·**生成器 charter_generator 读路径不匹配**（doc.opinions 不存在）——CTO 两形兼容修在派
- 时点: 写前现查（date 原值见落款）

## §一 · 主题分组（66 条 → 10 组·按共识度排序）

| 组 | 主题 | 条数 | 共识 |
|---|---|---|---|
| **T1** | 七席独立落卷+A/B 双列+回填守恒 | ~14 | **七席全提** |
| **T2** | 裁决件三绑+D-88/D-91 审批链落卷 | ~10 | 六席 |
| **T3** | 全量 hash+runId+manifest 全覆盖 | ~12 | **七席全提** |
| **T4** | close fail-closed/红面即停/空证不 pass | 3 | coo/cos/cao |
| **T5** | upgrade_list 逐条处置（clause_id/commit/effective_at/owner） | 3 | cao/cho/cfo |
| **T6** | 回填守恒（上轮 N→本轮 N 机械化） | ~6 | 多席 |
| **T7** | 口径统一（100 制/双账消/单一计数/拒判台账） | ~4 | cpo/cos |
| **T8** | 成本面（三面归因/null 不归零/轮级可得） | 3 | cfo |
| **T9** | requirement_trace/族点名机械核/标签率 | ~4 | cpo |
| **T10** | 证据去模板化/同源对表/时点留痕 | ~7 | cto/cao |

## §二 · 明细（按席·66 条）

### CAO（10 条）
1. 22条upgrade_list与2条意见补条款号/入册commit/生效时点（close.json）
2. D-95/D-96/D-97候选稿补入册commit与生效时点（fade001-evolve 树）
3. 7件缺runId段件补run_id并落件级hash清单（close.json）
4. 七席独立卷+A/B双列+上轮N⇒N回填表（opinions.json）
5. scores-ns1 14卷补divergence_review与N⇒N回填（fade001-loop 树）
6. 收口pass/ok与partial矛盾·manual满分改pending·空证pass改not_applicable（score.json）
7. 26树补全量sha256+逐文件manifest（tree-facts.json）
8. B树14卷/run-mirror补hash与runId清单
9. final_scores_basis/divergence_review/check_time与回填守恒断言（score-skill.json）
10. 本轮裁决件三绑入卷并补D-88派工回执与D-91声明（preflight.json）

### CFO（7 条）
1. 三面成本归因与残差升级落卷（cfo-token-meter.py）
2. 轮级成本至少一通道可得（delta∨token·close_skill_spawn.py）
3. 联审改进全量进 opinions/charter·upgrade_list 逐条处置（score_skill_spawn.py）
4. 全量 hash+逐文件 manifest+runId 全覆盖（plan_enricher.py）
5. 本轮七席产物自含 A/B 双列、分歧表与上轮回填（loop_joint_review_spawn.py）
6. 裁决件三绑、任务书批件与 D-88 回执落本轮卷（round_runner.ts）
7. 四段统一 auto fail-safe 并修累计门 null 归零（plan_skill_spawn.py）

### CHO（11 条）
1. A：36 项 families 与 RACI 单主责收敛（plan.json）
2. B：close.upgrade_list 22 条逐条落主责席与责任面
3. A/B：补 W48 落点、逐件实测时点与责任席签名
4. A/B：上轮→本轮回填守恒、6 条改进全量入账与 FUSE 逐条处置
5. A/B：补 D-39/D-86 授权形、代批五要件与形式审查
6. A：七席负载拆分与单席集中上限
7. B：恢复七席联审、独立落卷与缺席升级
8. A：证据卷补 runId、全量 sha256 与 evidence index
9. B：B 链证据补 hash 四元组与启动留痕
10. A/B：七席 A/B 双列、独立落卷、divergence 与 refill 机械化
11. A/B：任务书/裁决件三绑入本卷并补 D-88/D-91

### COO（11 条）
1. A｜batch_timetable 全段正序并禁同一时点回填
2. A｜红面即停：close_contract/空证/空收件不得 succeeded
3. A｜恢复承诺→复盘闭环台账与闭环率硬门
4. B｜迁移拍/读数齐时点链与静默期复算
5. A｜周记录/大表/台账同拍刷新与17 backfill建账
6. B｜score-skill终局判面收口并消费collection
7. B｜段产物runId/hash/来源全覆盖
8. A｜本轮七席独立落卷+A/B双列+分歧/回填
9. B｜上轮意见回填守恒与joint-review归档硬门
10. A｜本轮裁决件三绑同卷与任务书/审批链落位
11. B｜审批链D-88/D-91与对象对齐

### COS（7 条）
1. 补齐 charter/dispatch/receipt 并闭合 order→ledger 链
2. 四账同源对表、closure 补 verification_anchor 并消评分双账
3. 七席 A/B 双列落卷、回填守恒与分歧显式
4. close_contract false 时 fail-closed 并补六项回呈/BOD→CEO 升级
5. 段件全量 sha256 清单、runId 全覆盖与空证补实
6. seven_seats 只读本轮并保留逐席意见与上轮映射
7. 裁决件三绑与 D-88/D-91 审批链落卷

### CPO（12 条）
1. 迁移计划补未兑现项显式标注与单一计数口径
2. 十段与任务书 items 逐条 requirement_trace 并消双账
3. 周迁移刷新 OP 索引与未决项去向并补编号沿革
4. 统一100制总盘口径并建应答矩阵/拒判台账
5. 族点名与逐案标签率写成可机械核断言
6. 主观题 rubric 机械化并钉死 A/B 字母映射
7. 证据锚 item 级化+全量 sha256+runId 补齐
8. run-dir 全件 artifact manifest（runId+sha256）
9. 迁移评审七席独立落卷+A/B双列+上轮回填
10. 七席 fail-closed 前移并由 close 消费本轮联审
11. 裁决件+charter 审批三绑同卷并前置断言
12. 尾段联审生成签署任务书并记评审面板

### CTO（8 条）
1. 补记/活边界与顶层域逐项裁定
2. 补齐批次/依赖/测试门/回滚实锚
3. 证据去模板化与同源对表
4. 止损实测与可执行回滚锚
5. spawn-vs-CLI 等价回归与席集统一
6. 全量 hash 与 runId 卷内承载
7. 七席齐+A/B 双列+分歧与回填守恒
8. 三绑全字段入卷与 D-88/D-91 凭证

## §三 · 施工批次建议（呈批后）

- **批一（机制面·7 件）**：T1 七席独立落卷+回填、T2 三绑全字段、T3 hash/runId/manifest 全覆盖——**多席共识核心**（~FSD 2-3h）
- **批二（门面·4 件）**：T4 close fail-closed 补、T5 upgrade_list 逐条、T6 回填守恒机械化、T7 口径统一
- **批三（专业面·3 组）**：T8 成本面（CFO）/T9 requirement_trace（CPO）/T10 证据去模板化（CTO）
- **批次间**：批一毕→resume34 验（charter 应全纳 66 条）→批二三续

## §四 · 呈批

**请 CEO 裁**：①10 组框架准否 ②批次顺序准否 ③批后 resume34+施工启动——**本轮不自动点火**（CEO 令承）。

---
—— BOD（date 现查原值见 commit 落款·D-47 正形）
