# 任务书·resume36 七席联审改进意见汇总（75 条·呈 CEO 批）

- sourceOfTruth: 本卷（resume36 七席 opinions face.improvements 全量·BOD 整理呈批件）
- 令源: CEO「跑完把这一轮 7 席联审的改进意见任务书呈我批，不用自动进下一轮 resume」
- 输入: shift-W48-resume36-20261125T045706Z/opinions-*.json 的 face.improvements（**75 条**·BOD 直核实证：cao8/cfo12/cho14/coo12/cos9/cpo12/cto8）
- 批注: r36=全形首验轮（七席 7/7 归队+subjective 链内自动 24.5+manifest+journal）·意见量 75（r34 为 72·过滤后 64）
- 时点: 写前现查（date 原值见落款）

## §一 · 主题分组（75 条 → 8 组·按共识度）

| 组 | 主题 | 条数 | 共识 |
|---|---|---|---|
| **S1** | 七席独立落卷+A/B 双列+分歧不抹平+回填守恒 | ~12 | **七席全提** |
| **S2** | 裁决件三绑+D-88/D-91 审批链同卷 | ~10 | 六席 |
| **S3** | 全量 sha256+逐文件 manifest+runId 承卷（artifact 级） | ~14 | **七席全提** |
| **S4** | close 红面即停/空证不得 pass/run_state 与 contract 同源 | ~6 | 五席 |
| **S5** | 回填/交接清单（上轮 N→本轮 N·FUSE 逐条） | ~8 | 多席 |
| **S6** | 口径统一（单一 100 制/三面 counts 同口径/禁归一化冒充） | ~6 | cpo/cos/coo/cao |
| **S7** | 成本面（三面归因/stage 补/auto fail-safe/null 累计门） | ~6 | cfo |
| **S8** | 证据去模板化/同源对表/spawn-vs-CLI 等效回归 | ~8 | cto/cao |

## §二 · 明细（按席·75 条·标题照录原件）

### CAO（8）
1. 补齐 22 条 upgrade 与 2 条意见的条款号、入册 commit、生效时点
2. 全件 artifact manifest、7 件 runId 补齐与 full sha256
3. 七席独立落卷、A/B 双列、分歧表与回填守恒
4. run_state 与 close_contract 同源，空证不得 pass
5. 锚 1 独立面板：full sha256 与逐文件 manifest
6. 锚 2 独立面板：七席与回填只读当前卷
7. 裁决件三绑与 D-88/D-91 审批链同卷
8. plan 顶层件补 observed/dest，actual_landed_at 去生成时点

### CFO（12）
1. 三面成本归因与残差升级台账落卷
2. score 段 cost-log 行补 stage 与不可用原因
3. 四段统一 auto fail-safe 并修 null 累计门与 trigger 分类
4. 轮级成本至少一通道可得并 fail-closed
5. 六条联审改进全量入 opinions 并逐条消费处置
6. 22 条升级项逐条主责与消费台账
7. 全量 sha256 与逐文件 manifest、runId 补全
8. 收口三件与审批链证据落卷
9. 七席逐席独立卷、A/B 双列与分歧回填表
10. final_scores_basis 与 divergence_review 补齐并标 trend 口径
11. 裁决件三绑同卷与 D-88/D-91 审批链
12. close 三引与 round_count 补齐

### CHO（14）
1. A：RACI 23→19 键收敛并按 families/CHO confirm 定主责
2. B：close 21 条缺陷逐条主责/责任面/处置
3. A：migrate 逐件 W48 落点、实测时点与责任席签名
4. B：resume35→resume36 交接清单与 evidence hash/签收
5. A：回填 resume34 CHO 9 条并给 21 条缺陷 FUSE 处置
6. B：score-skill 6 条改进全量入 opinions 与 63→N refill 守恒
7. A：迁移批权五要件与形式审查落卷
8. B：close.run_state 与 manifest.close_contract 同源并禁空证 pass
9. A：七席 RACI 负载拆分与 17 个 backfill id 逐条落 owner
10. B：本轮七席独立到席与单席并载拆分
11. A：tree-facts/plan-freeze 补 run_id、全量 sha256 与逐文件 manifest
12. B：close/opinions/verify evidence 带 hash 与 runId 全覆盖
13. A/B：七席独立落卷、A/B 双列、divergence 表与 refill 守恒
14. A/B：ceo-ruling 三绑、charter 落卷与 D-88/D-91 审批链

### COO（12）
1. A｜batch_timetable 全段正序+逐件实测落点+480s 偏差对表
2. A｜红面即停：close_contract false/空证/空收件不得 succeeded
3. A｜恢复承诺→复盘→闭环率硬门
4. B｜迁移拍/读数齐时点链与静默期复算
5. A｜counts/families/readings 三面同口径+17 backfill 建账+RACI 收敛
6. B｜终局判面收口并消费 collection-A/F/H
7. A｜迁移树逐件全量 sha256+W48 落点+runId 承卷
8. B｜run 产物 hash 清单与 runId 全覆盖
9. A｜本轮七席独立落卷+A/B 双列+分歧不抹平
10. B｜上轮意见回填守恒与 joint-review 归档硬门
11. A｜本轮裁决件三绑与 D-88/D-91 审批链落卷
12. B｜审批链 D-88/D-91 与对象对齐

### COS（9）
1. 补 charter/dispatch/receipt 三件并将 order→ledger 五段闭链
2. 四账同源对表、closure verification_anchor 与 DP↔receipt↔closure
3. 七席 A/B 双列独立落卷并建上轮 64 条逐条回填
4. close_contract=false 即 fail-closed 并补六项回呈/BOD→CEO 升级
5. 全量 sha256+逐文件 manifest、runId 全覆盖与 verification_anchor
6. seven_seats 只读本轮并保留逐席独立意见与分歧/回填表
7. 裁决件三绑齐与 D-88/D-91 审批链落卷
8. 统一 I 族三账与 trend 口径，禁 I 族归一化冒充总盘
9. verify 8 项补非空证据并逐条裁定 dce wrong_order

### CPO（12）
1. A｜plan 增 dispositions 全集与双域计数（结账 cpo-0）
2. B｜close 增 66 条 requirement_trace 并对未兑现 fail-closed
3. B｜族点名表覆盖 17 backfill+8 loose 并逐族核
4. A｜score 单一 100 制口径+应答矩阵/拒判台账
5. A｜迁移读数逐案 label/reason_code 与族点名可机判
6. B｜主观题 rubric 机械化并消 I 族多套账
7. A｜9 树全量 sha256+逐文件 manifest+runId 覆盖
8. B｜run-dir 全件 artifact manifest（runId+sha256+parse_ok）
9. A｜本轮七席逐席独立卷+A/B 双列+分歧表+回填矩阵
10. B｜close 只认本轮七席并联审 fail-closed
11. A｜裁决件/任务书三绑同卷+D-88/D-91 审批链
12. B｜chain 启动/收口写 D-91 marker 与裁决回执

### CTO（8）
1. 统一 disposition 单一账与门禁 fail-closed
2. 批次/依赖/测试门/回滚实锚与 notify 收件人
3. 证据去模板化、同源对表与 hash/runId 链
4. 止损实测、风险分级与可执行回滚锚
5. spawn-vs-CLI 同 fixture 等值回归与席集单一真源
6. 全量 hash、runId 全覆盖与独立可解析
7. 七席齐、A/B 双列、分歧不抹平与上轮回填守恒
8. 三绑全字段与 D-88/D-91 凭证入卷

## §三 · 与 r34 任务书（66 条）的关系

- r34→r36：共性主题延续（S1/S2/S3/S5 与 r34 的 T1/T2/T3/T6 同源），新增/细化 ~9 条（RACI 键收敛 23→19/交接清单/单席并载拆分/verify 8 项证据等）；
- **施工建议**：r34 的批一已完（7 件验收过）——**r36 的 75 条中与批一同源者多数已随批一落地**；新增面（CHO 的 RACI 键收敛/交接清单/COO 的 480s 偏差/CPO 的 dispositions 全集等）→ **批二批三覆盖**。

## §四 · 呈批

**请裁**：①本汇总（75 条·8 组）收悉否 ②批二/批三（按 r34 卷 §三 或本卷新增面调整）施工启动时点？③**另候 CEO 裁**：auto 判分口径 a/b（CTO 建议 b 保持保守 89.5）。

---
—— BOD（date 现查原值见 commit 落款·D-47 正形）
