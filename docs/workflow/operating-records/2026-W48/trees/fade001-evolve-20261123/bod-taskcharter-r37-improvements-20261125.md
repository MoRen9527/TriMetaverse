# 任务书·r37 七席联审改进意见（80 条）

**令源**：CEO「跑完把这一轮 7 席联审的改进意见任务书呈我批，不用自动进下一轮」
**输入**：`shift-W48-resume37-20261125T101347Z/opinions-*.json` 的 face.improvements——**80 条**（cao9/cfo12/cho14/coo12/cos9/cpo12/cto12）
**联审读数**：review_mode=full·refill ok（承接 r36 75 条）·filtered=[]（零过滤）·low_dim 54/54 全覆盖
**卷锚**：bod-taskcharter-r37-improvements-20261125.md

## §一 概览

| 席 | 条数 |
|---|---|
| CAO | 9 |
| CFO | 12 |
| CHO | 14 |
| COO | 12 |
| COS | 9 |
| CPO | 12 |
| CTO | 12 |
| **合计** | **80** |

## §二 明细（按席·五字段）

### CAO（9）

1. **CAO-1 A+B｜25 条 upgrade 与 2 条意见补条款号、入册 commit、生效时点**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：对 close.json#/upgrade_list 25 条与 opinions.json 的 2 条逐条补 clause_id、register_commit（git cat-file 可达的 40 位 sha）、effective_at；opinion_dispositions 由 deferred 改为 adopted/rejected/open，未入册不得写 deferred 终态；upgrade_list_state 由 extracted 改为 registered。
   - verify：jq -e '(.upgrade_list|length)==25 and all(.upgrade_list[]; (.clause_id|length)>0 and (.register_commit|length)==40 and (.effective_at|length)>0)' close.json；逐 register_commit 跑 git cat-file -e；断言 upgrade_list_state!=extracted。
   - rollback：写前把 close.json、opinions.json 复制为 .pre-cao1 并记 sha256；断言失败即恢复两件，不动 dce 已提交树与 W47/W48 树体。

2. **CAO-2 A+B｜全件 artifact manifest、7 件 runId 与 full sha256**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_skill.py
   - change：close_skill 为 run-dir 每件 JSON/JSONL 记 path/sha256(64hex)/run_id/parse_ok；7 件缺 runId 补 not_applicable_reason，缺 hash 列 violations 并使 close_contract.ok=false；tree-facts 9 树增 full_sha256 与 files[relpath,size,sha256]；plan-freeze artifacts 改 64hex 并与终卷复算一致。
   - verify：pytest /srv/fleet/TriCompany/runtime/cognition/test_close_skill.py -q；jq 断言 artifact_manifest 件数=23、sha256 均 64hex 且复算一致、run_id 非空或 reason 非空；jq 9/9 树 full_sha256 长度=64 且 files 件数=file_count；sha256sum exam.json 与 plan-freeze.artifacts.exam.json 对齐。
   - rollback：写前把 close_skill.py、tree-facts.json、plan-freeze.json、close.json 复制为 .pre-cao2 并记 sha256；失败恢复四件，不重跑迁移。

3. **CAO-3 A+B｜七席独立落卷、A/B 双列、分歧表与 8→8 回填守恒**
   - target：/srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py
   - change：spawn 强制 cos/coo/cao/cpo/cto/cho/cfo 各落 opinions-<seat>.json，dimensions 每维含 object=A/B 独立 score+rationale；joint-review 增 faces=7、divergence_review（|Δ|≥2 档逐条列席，禁中位抹平）、refill_ledger（上轮 8 条 CAO→本轮 8 条处置，缺项入 missing）；faces<7 或 refill.missing 非空时 rc!=0 且不写 joint-review。
   - verify：pytest /srv/fleet/TriCompany/runtime/cognition/test_loop_joint_review_spawn.py -q；ls opinions-*.json|wc -l==7；jq 每件含 object A 与 B；jq divergence_review 覆盖 |Δ|≥2；refill 行数==8 且 missing==[]。
   - rollback：写前把 loop_joint_review_spawn.py、opinions.json、close.json 复制为 .pre-cao3 并记 sha256；失败恢复，保留既有 cos/coo 原文。

4. **CAO-4 A+B｜run_state 与 close_contract 同源，空证/fail 不得 pass**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_cli.py
   - change：derive_run_state 与 assert_close_contract 纳入 manifest.close_contract.ok、verify 每项非空 reason、close_acceptance.source、本轮 seven_seats 来源、opinions 全量处置、score.exam_objective O9 fail；任一红返回 partial/failed 且 manifest/notify 同源；close_contract.ok=false 禁发成功 notify；A/F/H manual 改消费 collection-A/F/H 或 state=pending；score-skill.final 定分前禁写 trend。
   - verify：pytest /srv/fleet/TriCompany/runtime/cognition/test_close_cli.py -q；构造 close_contract.ok=false 断言 close.run_state!=succeeded 且 notify 未发；jq verify 8 项 reasons 非空或 not_applicable_reason；jq score.families A/F/H 有 collection evidence_ref 或 pending；trend 行含 score_scope。
   - rollback：写前把 close_cli.py、close.json、manifest.json、verify.json、score.json、score-skill.json、trend.jsonl 复制为 .pre-cao4 并记 sha256；失败恢复七件，保留已发通知事实并回填更正卷。

5. **ANCHOR-1 A+B｜full sha256/逐文件 manifest 与顶层 evidence 去泛证**
   - target：/srv/fleet/TriCompany/runtime/cognition/plan_enricher.py
   - change：tree-facts/plan-freeze 每树增 full_sha256(64hex)、files[]、sampled_at、run_id；plan-freeze artifacts 用 64hex；plan.agent_readings 8 条顶层 evidence_ref 由同一 preflight#/assertions/ceo_ruling 改为逐件 path+sha256 或 tree-facts#/trees/<id>；migrate 补 W48 dest 与迁前/迁后 sha 对照。
   - verify：pytest /srv/fleet/TriCompany/runtime/cognition/test_plan_enricher.py -q；jq 9/9 树 full_sha256 长度=64、files 件数=file_count；jq 17/17 evidence_ref 互异且 run-dir 可解析；抽 3 树按 files[] 重算相符。
   - rollback：写前把 plan_enricher.py、tree-facts.json、plan-freeze.json、plan.json 复制为 .pre-anchor1 并记 sha256；失败恢复四件，不动 W47 树体。

6. **ANCHOR-2 A+B｜seven_seats 只读本轮，禁止借 prev 卷充数**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_skill_spawn.py
   - change：close.seven_seats 改只读本轮 opinions-<seat>.json，present/missing 逐席实读并写 source=当前 run_id；opinions_in 必须=7；joint-review 增 faces=7、A/B 双列、divergence_review 与 refill_ledger；借 prev 卷时 close_contract.ok=false 且不得写 seven_seats.ok=true。
   - verify：pytest /srv/fleet/TriCompany/runtime/cognition/test_close_skill_spawn.py -q；jq seven_seats.source==close.run_id 且 present 长度=7；opinions_in==7；opinions-*.json 计数=7；refill missing==[] 且行数==上轮 N；divergence 数组存在。
   - rollback：写前把 close_skill_spawn.py、close.json、opinions.json、score-skill.json 复制为 .pre-anchor2 并记 sha256；失败恢复，不写 joint-review。

7. **ANCHOR-3 A+B｜裁决件三绑与 D-88/D-91 审批链入卷**
   - target：/srv/fleet/TriCompany/runtime/cognition/round_runner.py
   - change：preflight.assertions.ceo_ruling 增 run_id=本轮、round_count、signed_at、approved_by、charter_ref；把 ceo-ruling.json 与 ceo-charter-approval.json 复制入 run-dir；close 增 approval_chain（task_book_ref/ruling_ref/run_id/round_count/signed_at/dispatch_id/receipt_at/D91_claim）；chain-journal 的 d91_marker.state 禁 unknown；缺一 fail-closed。
   - verify：pytest /srv/fleet/TriCompany/runtime/cognition/test_preflight.py /srv/fleet/TriCompany/runtime/cognition/test_chain_runner.py -q；jq ceo_ruling 四字段非空且 run_id==plan.run_id；ls 本轮 ceo-ruling.json 与 ceo-charter-approval.json；jq close.approval_chain 每条 dispatch_id/receipt_at 非空；chain-journal 首行 d91_marker.state!=unknown。
   - rollback：写前把 round_runner.py、preflight.json、close.json、chain-journal.jsonl 复制为 .pre-anchor3 并记 sha256；失败恢复，保留 CEO 已签原件。

8. **CAO-2 A｜D 族 8 件与 2 carry 补 observed/dest，actual_landed_at 去生成时点**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：为 families/D 8 件与 carry_over 2 条逐件补 observed(path/size/mtime/sha256)、dest、status_to、exit_criteria；migrate 2 树补 W48 dest 与迁前/迁后 sha 对照；actual_landed_at 只取逐件实测，未知写 null+note；counts 按 disposition 统一四面并补 dead_letter=1，使 19 件=5 迁+11 留+1 封+2 carry。
   - verify：jq 断言 19 件 disposition 唯一且 counts 合计=19；jq D 族 8 件 observed/dest 非空；jq actual_landed_at 非全同且 != tree-facts.generated_at 或 null+note；jq migrate[].dest 在盘、W48 index activeTrees 含 2 迁树。
   - rollback：写前把 plan.json 复制为 .pre-plan-evidence 并记 sha256；失败恢复该件，不移动 W47 树、不改 tree-facts。

9. **CAO-1 A｜W48 索引登记 2 迁树，消灭只改 W47 lastUpdated 的 no-op commit**
   - target：/srv/fleet/TriCompany/runtime/cognition/weekly_plane_shift.py
   - change：migrate_weekly_plane 在 W48/OP-202611-W48-001.json 的 activeTrees 写入 release-rules-20261118 与 trirmc-orchestration-fact-20261119，并在来源注记中标 W47 树体原地封存；迁移 commit 只允许在 W48 索引/树落点实际变更时生成，禁止只改 W47 lastUpdated 的 no-op commit；plan.migrate[] 写 dest 与迁后 sha256_16。
   - verify：jq -e --arg a release-rules-20261118 --arg b trirmc-orchestration-fact-20261119 '.activeTrees|index($a)!=null and index($b)!=null' /srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W48/OP-202611-W48-001.json；git show --name-only 本轮 commit 含 W48 索引；plan.migrate[].dest 均 test -d；W48 activeTrees 计数=17。
   - rollback：写前把 weekly_plane_shift.py 与 W48 索引复制为 .pre-cao1-landing 并记 sha256；失败恢复源码与索引，W47 树体不动。

### CFO（12）

1. **三面成本归因与残差升级台账落卷**
   - target：/srv/fleet/TriMetaverse/scripts/cfo-token-meter.py
   - change：run 收口按 run 起止时刻跑 cfo-token-meter --from/--to/--runid，把 input/output/cache_read/cache_creation 四分列回写 cost-log 每行；余额/token 双缺时写 residual_ledger（who=CFO+COO、how=补 DEEPSEEK_API_KEY 或重跑探针、when=下一轮点火前、ack=状态），订阅面显式标 unidentified 并入残差；close.cost_settlement 引用该台账。
   - verify：jq 断言 cost-log 4/4 行含 token 四分列或 balance 差分；residual_ledger 每条含 who/how/when/ack；cfo-token-meter --selftest rc=0 且 --runid 窗匹配非空。
   - rollback：删除 cost-log 新增 token 字段与 residual_ledger；cfo-token-meter.py 按 git revert 回退；不改迁移树与评分件。

2. **score 段 cost-log 行补 stage 与不可用原因**
   - target：/srv/fleet/TriCompany/runtime/cognition/score_skill_spawn.py
   - change：在 _write_cost_line 调用处增 stage=score_skill 与 unavailable_reason；close._build_cost_settlement 对 stage=null 行拒结算并写 residual_ledger（who/how/when）。
   - verify：jq 断言 cost-log 4/4 行 stage ∈ {plan_skill,score_skill,close_skill}；close.cost_settlement.stages 无 null stage；负例 stage=null ⇒ 结算 status=unavailable 且 exit 2。
   - rollback：回退 score_skill_spawn.py/close_skill_spawn.py 至本版，删除新增字段；不重跑评分。

3. **四段统一 auto fail-safe 并修 null 累计门与 trigger 分类**
   - target：/srv/fleet/TriCompany/runtime/cognition/plan_skill_spawn.py
   - change：把 close_skill_spawn v8 item7 的余额不可得 auto fail-safe 分支复制到 plan/score/joint；_total_spent_cny 遇任一 delta=null 返回 None，累计门按 unavailable 置 pending/escalate，不按 0 求和静默放行；trigger 以 chain 实际 trigger_mode 为准（cron→auto），禁把无人值守轮记 manual。
   - verify：四段单测各覆盖 auto/manual/3-null；全 null cost-log 下累计门返回 unavailable 而非 0；cron 触发用例断言 trigger=auto 且走 fail-safe；pytest test_plan_skill_spawn.py test_score_skill_spawn.py test_close_skill_spawn.py 全绿。
   - rollback：回退四文件到本版并保留 close 分支；不改 cost-log 数据与阈值 1/10/20 CNY。

4. **轮级成本至少一通道可得并 fail-closed**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_skill_spawn.py
   - change：_build_cost_settlement 在 delta 全 null 时回退读 cfo-token-meter 四分列计轮级成本，cost_channel 标 balance_delta|token_meter；两通道皆缺时 status=unavailable 且 exit 2，不落 settled；total_delta_cny/token_total 非空才判 settled。
   - verify：本轮四段每段 cost_channel ∈ {balance_delta,token_meter} 且 total 非空；构造双缺用例断言 exit 2；pytest test_close_skill_spawn.py -q 全绿。
   - rollback：恢复 _build_cost_settlement 原实现与 cost-log 原四行，删除 token_total/cost_channel 字段；不重跑评分。

5. **六条联审改进全量入 opinions 并逐条消费处置**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/opinions.json
   - change：opinions 改为每席每条 improvement 一条 opinion（现仅取 five[0]）；opinions_in=Σimprovements；每条 opinion 附 owner_seat/state∈{consumed,deferred,dropped}/how/when；close.opinion_dispositions 与 charter.source.opinion_ids 全量对表，缺项记 missing。
   - verify：jq 断言 opinions 条数==Σ改进数（本轮 6）；每条含 owner/state/how/when；close.digest_rate==items_consumed/opinions_total；charter.opinion_ids 覆盖 100%。
   - rollback：回退 opinions 生成段与本轮 opinions.json 至写前快照；charter 不重生成。

6. **25 条升级项逐条主责与消费台账**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：close 增 consumption_ledger 覆盖 plan/tree-facts/dce/verify/score/collection，每件记 consumer_path/read_at/verdict；upgrade_list 25 条逐条补 owner_seat/state∈{consumed,deferred,dropped}/how/when；score 消费 collection-A/F/H 后 manual 改实读。
   - verify：jq 断言 25/25 含 owner/state/how/when；consumption_ledger 覆盖 6 类产物；collection A/F/H 在 score.families 中非 manual。
   - rollback：回退 close/score 至写前快照，保留原 upgrade_list 与 collection 件。

7. **全量 sha256 与逐文件 manifest、runId 补全**
   - target：/srv/fleet/TriCompany/runtime/cognition/plan_enricher.py
   - change：tree-facts 每树增 full_sha256(64hex)+files[]（relpath/size/sha256）+sampled_at；plan-freeze 补 run_id 与 plan.json 全量 sha256，并重生成使 exam 哈希对齐终卷；preflight/qualify/tree-facts/plan-freeze/exam/close-acceptance/structure-export-debt 补 run_id；agent_readings evidence_ref 改指 tree-facts#/trees/<id> 或 W48 落点。
   - verify：抽 3 棵树按 files[] 逐文件复算 full_sha256 一致；21 件 JSON 全带 run_id；17 条 readings evidence_ref 互异且可解析；改一字节 ⇒ hash check fail。
   - rollback：删除 full_sha256/files/sampled_at 新增字段，保留 sha256_16 兼容键；tree-facts 按 plan-freeze md5 基线复原。

8. **收口三件与审批链证据落卷**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/manifest.json
   - change：manifest 增 artifact_manifest[]（path/sha256 64hex/run_id/parse_ok/bytes）与 run_state_source 真值；close-acceptance 写 source/total/by_family；ignite.log 捕获启动 stdout/stderr/rc；chain-journal 每段补 run_id 与 approval_chain。
   - verify：jq 断言 artifact_manifest 条数==run-dir JSON/JSONL 实盘数且复算一致；close-acceptance.source 非 null；ignite.log 非 0 字节；chain-journal 含 approval_chain。
   - rollback：回退 manifest/close-acceptance/ignite/chain 至写前快照，不重跑迁移。

9. **七席逐席独立卷、A/B 双列与分歧回填表**
   - target：/srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py
   - change：强制 cos/coo/cao/cpo/cto/cho/cfo 各落 opinions-<seat>.json，每席按冻结 scope 输出 object=A/B 的 dimensions+rationale；joint-review 增 seat_means 双列、divergence（同维 |Δ|≥2 档保留原值）、refill_ledger（上轮 N→本轮处置，缺=missing）；close.seven_seats 只读本轮或显式 borrowed_prev+时点。
   - verify：ls opinions-*.json | wc -l == 7；每件 object 含 A/B；divergence 条目保留原值；refill 行数==上轮 opinions 数；close.seven_seats.source==当前 run_id 或 borrowed_prev 带时点。
   - rollback：回退聚合器与 close 读取逻辑，保留已落 opinions，不删 prev 卷。

10. **final_scores_basis 与 divergence_review 补齐并标 trend 口径**
   - target：/srv/fleet/TriCompany/runtime/cognition/score_skill_spawn.py
   - change：score-skill.judge_faces.final 落 {final_scores_basis,divergence_review[],check_time}，禁占位串；trend 每行加 score_scope（i_family/total_100）；opinions 每席独立落卷；close 回填表覆盖 7 席（N→N）。
   - verify：jq 断言 final 非字符串且含 final_scores_basis/divergence_review/check_time；trend 每行有 score_scope；回填表 7/7。
   - rollback：回退 score-skill/trend 生成段，恢复占位 final，不重跑评分。

11. **裁决件三绑同卷与 D-88/D-91 审批链**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/preflight.json
   - change：点火前把 ceo-ruling.json 与 .ceo-ruling-consumed.json 落到本轮 run_dir；preflight.assertions.ceo_ruling 增 run_id=本轮/round_count/signed_at/approved_by；chain-journal d91_marker 写 continue|stop 非 unknown；补 D-88 派工号+回执与 D-91 链跑声明。
   - verify：jq 断言 ceo-ruling 三绑非空且 run_id==目录名；本轮两件在盘；chain-journal d91_marker.state!=unknown；close.charter_ref 非 null。
   - rollback：删除复制的两件，恢复 preflight/chain 写前快照，不撤销 CEO 已签裁决。

12. **close 三引与 round_count 补齐**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：close.json 强制 charter_ref/receipt_ref/dispatch_ref 非 null；从 ceo-ruling.json 读 run_id/round_count/signed_at 写 close；增 approval_chain[] 逐条写 task_book_ref/ruling_ref/dispatch_id/receipt_at/D91_claim。
   - verify：jq 断言 close 的 charter_ref/receipt_ref/dispatch_ref 非 null 且 round_count 为数字；approval_chain 每条四字段非空；D-91 声明可解析。
   - rollback：回退 close 至写前快照，删除新增引用，不重跑评分。

### CHO（14）

1. **A：RACI 23 到 19 键收敛，并按 families.owner 定主责**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：删除 4 个多余 RACI 键（cfo-quota-daily-w48.md、scoring-ledger-w48.md、task-inventory-20261123.md、todo-list-20261123.md）；19 项 accountable/responsible 按 item.owner 单席赋值，sg-root-authz-review 按 r12-raci-cho-confirm 卷取 CHO；补 consulted/informed，due 全改 >=2026-11-25；17 个 w48_backfill_ids 逐条落 owner 或显式 not_in_scope。
   - verify：python3 断言 len(staffing.raci)==19、accountable!=families.owner 计数=0、COS/COS<19、due 全>=2026-11-25、consulted/informed 非空、17/17 backfill 有 owner 或 not_in_scope；verify.json plan_structure_full 仍 pass。
   - rollback：改前 cp plan.json plan.json.pre-cho1 并记 sha256_16；断言红即还原该件，tree-facts 与 W47/W48 树零改动。

2. **B：close.upgrade_list 25 条逐条主责与责任面**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：为 close.upgrade_list 25 条逐条补 owner_seat（七席单值）、responsibility_face（迁移/评审/批权/值席）、disposition（fix/defer/not_in_scope）；无主责者显式 unassigned 并升级 BOD；opinions/dispositions 同步。
   - verify：jq 断言 25/25 owner_seat 非空且属七席、responsibility_face 非空、disposition 覆盖 25/25；无 owner 条目升级记录非空。
   - rollback：改前 cp close.json close.json.pre-cho1 并记 sha256_16；断言红即还原，不动 opinions 与通知。

3. **A：migrate 逐件 W48 落点、实测时点与责任席签名**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：migrate[0..1] 增 dest_path、entry、W47 迁前与 W48 迁后 sha256_16 对照；11 条 actual_landed_at 逐件实测或 null+note，禁止回填 tree-facts.generated_at；family D 8 条补 observed/timebox/dest 或 not_in_scope；19 项补 signed_by/signed_at；carry_over 补 observed/dest/exit_criteria，并把 evidence_ref 改指 W47 原账或 W48 落点。
   - verify：python3 断言 dest_path 在盘、W47/W48 sha256_16 可复算、actual_landed_at 非同一生成时点或 null 带 note、19 项 signed_by 属七席且 signed_at 非空、CARRY 2 条 evidence_ref 不自引。
   - rollback：改前 cp plan.json plan.json.pre-cho2 并记 sha256_16；断言红即还原，W47/W48 树零改动。

4. **B：resume36 到 resume37 交接清单与 evidence hash 签收**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：close 增 handoff_chain，逐条列 resume36 残留件到 resume37 承接/复验状态；evidence[] 每条带 path+sha256_16；补七席 signed_by/signed_at；ignite.log 落入 run_dir 或显式注缺席；notify.to 非空或 status!=sent。
   - verify：jq 断言 handoff 行数等于 resume36 实读件数、evidence 每条 path 在盘且 hash 可复算、ignite 非空或缺席注在、notify.to 非空或未发送。
   - rollback：改前 cp close.json notify_done.json 并记 sha256_16；断言红即还原，保留已发通知事实与更正卷。

5. **A：回填 resume36 CHO 14 条，并给 25 条缺陷 FUSE 处置**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：增 refill 表，逐条列 resume36 的 cho-0 到 cho-13 到本轮 state/owner_seat/说明，行数守恒（本席 14/14），再由聚合面并入 75 条总表；items_consumed/digest_rate 按实际 consumed/total 回填；25 条 upgrade_list 逐条给 FUSE disposition，禁静默丢弃。
   - verify：jq 断言 refill 行数==14、无 state 缺失、upgrade_list 25/25 有 disposition、digest_rate==items_consumed/opinions_total 且与表复算一致。
   - rollback：改前 cp close.json opinions.json 并记 sha256_16；断言红即还原，保留评分与已发通知。

6. **B：score-skill 6 条改进全量入 opinions 与 75 到 N refill 守恒**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/opinions.json
   - change：把 score-skill 的 initial+joint 6 条 improvements 全量入 opinions，带 seat/owner_seat/五字段；按 resume36 的 75 个 opinion_id 建 refill 表并列 missing；close.items_consumed/digest_rate 按表重算。
   - verify：jq 断言 opinions 覆盖 6 条改进、refill.prev_total==75 且 missing 有记录、digest_rate==consumed/total、无静默丢弃条目。
   - rollback：改前 cp opinions.json close.json 并记 sha256_16；断言红即还原，不动 score-skill。

7. **A：迁移批权五要件与形式审查落卷**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/preflight.json
   - change：ceo_ruling 增 run_id/round_count/approved_by，并把 ceo-ruling.json 与 .ceo-ruling-consumed.json 落入本轮 run_dir；增 authorization{approver,delegate,scope,valid_from,valid_to,five_elements[5],form_review{checked,evidence_ref}} 或 not_applicable_reason；补 D-39/D-86 文本与回呈项零越权声明；dce.commit_message_shape 改 checked=false+not_applicable_reason，或补 commit 原文。
   - verify：jq 断言 ceo_ruling.run_id==plan.run_id、round_count/signed_at 非空、批件两件在盘、five_elements 长度=5 或 not_applicable_reason 非空、form_review.evidence_ref 在 run_dir、D-39/D-86 命中。
   - rollback：改前 cp preflight.json dce.json 并记 sha256_16；断言红即还原，不动已发裁决与迁移树。

8. **B：close.run_state 与 manifest.close_contract 同源，禁空证 pass**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_cli.py
   - change：derive_run_state 纳入 close_contract.ok、verify 每项 reasons 非空、opinion 全量处置；close_contract.ok=false 或 run_state_source=null 时只落 partial/failed 并阻断 notify；guard_hits.d=1 落 stop_record，含 owner/时点/回滚目标。
   - verify：pytest runtime/cognition/test_close_cli.py -q；构造 close_contract.ok=false、verify reasons=[]、guard_hits.d=1 三负例，断言 run_state!=succeeded 且 notify 未发；正例仍 ok。
   - rollback：改前 cp close.json manifest.json notify_done.json close_cli.py 并记 sha256_16；失败恢复四件，不重跑评分、不投递。

9. **A：七席 RACI 负载拆分与 17 个 backfill id 逐条落 owner**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：staffing.raci 按七席拆 R/A/C/I，并统计每席键数，单席>12 键给 secondary 与 due；17 个 w48_backfill_ids 逐条落 owner/timebox/acceptance 或显式 not_in_scope，禁 20/23 COS/COS；4 个多余键删除或说明 index_steward。
   - verify：python3 断言七席各至少 1 个 accountable 键、单席键数<=12 或注 secondary、COS/COS<19、17/17 backfill 有 owner 或 not_in_scope。
   - rollback：改前 cp plan.json plan.json.pre-cho5 并记 sha256_16；仅回退 staffing/index_assertions 两节，不动 tree-facts 与 W48 树。

10. **B：本轮七席独立到席与单席并载拆分**
   - target：/srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py
   - change：faces<7 或 opinions-<seat>.json 缺失时 fail-closed 为 partial；close.seven_seats 只读本轮 run_dir，source=current；plan_skill/close_skill 至少两席轮值，并在 cost-log 记 stage+seat。
   - verify：pytest test_loop_joint_review_spawn.py -q；断言 7 个 opinions-<seat>.json 在盘、close.seven_seats.source 指本轮、cost-log 每行 stage 非空且 seat_count>=2。
   - rollback：改前 cp loop_joint_review_spawn.py 并记 sha256_16；断言红即还原，保留现有 opinions/close 读数。

11. **A：tree-facts/plan-freeze 补 run_id、全量 sha256 与逐文件 manifest**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/tree-facts.json
   - change：tree-facts/plan-freeze 增 run_id；每树增 full_sha256（64 hex）、manifest[{path,size,sha256}]、sampled_at；preflight/qualify/exam/close-acceptance/structure-export-debt 补 run_id；plan.references 去重、rubric 件落 run_dir 或剔除，exam 哈希改记实算 4af53ba59665297d。
   - verify：python3 断言 tree-facts.run_id==plan.run_id、9/9 full_sha256 可复算、逐文件 manifest 覆盖全部文件、7 件段产物 run_id 非空、references 全部可解析且哈希一致。
   - rollback：保留现有 sha256_16/md5 旧值，仅追加新字段；回退时删新增字段，树零改动。

12. **B：close/opinions/verify evidence 带 hash 与 runId 全覆盖**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：close/opinions/verify 增 evidence[]，path+sha256_16 算法形；preflight/qualify/tree-facts/plan-freeze/exam/close-acceptance/structure-export-debt 补 run_id；修正 score.json 的 artifacts_manifest 把已在盘件记 present=false 的问题；verify 8 项写非空 reasons/evidence_ref；ignite.log 落 run_dir 或显式注缺席。
   - verify：jq 断言各 evidence 以 sha256_16: 开头且可复算、7 件段产物 run_id 非空、verify 8/8 reasons 非空、score.json present 标记与实盘一致。
   - rollback：改前 cp close.json verify.json score.json preflight.json 并记 sha256_16；断言红即还原，不动通知与成本。

13. **A/B：七席独立落卷、A/B 双列、divergence 表与 refill 守恒**
   - target：/srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py
   - change：强制 7 个 opinions-<seat>.json，每席每维 object=A/B 双列；joint-review 增 seat_means 双列、divergence（同维 |Δ|>=2 档保留原值）、refill_ledger（上轮 75 到本轮处置，缺=missing）；缺席/缺列 fail-closed 为 partial；close.seven_seats 只读本轮。
   - verify：pytest test_loop_joint_review_spawn.py -q；断言 faces==7、每席含 A/B、refill.prev_total==75 且 missing 记录、divergence 条目原值保留、close.seven_seats.source 指本轮。
   - rollback：改前 cp loop_joint_review_spawn.py 并记 sha256_16；断言红即还原，保留现有 opinions/score-skill。

14. **A/B：ceo-ruling 三绑、charter 落卷与 D-88/D-91 审批链**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/preflight.json
   - change：ceo_ruling 增 run_id/round_count/signed_at/approved_by/ruling_ref，值从本轮 ceo-ruling.json 逐字复制；点火前把 ceo-ruling.json 与 .ceo-ruling-consumed.json 落入本轮 run_dir；close.charter_ref 填实路径；补 D-88 DP 号+COS 回执与 D-91 链跑期禁推声明；chain-journal 写 d91_marker!=unknown 与 approval_chain。
   - verify：jq 断言 ceo_ruling.run_id==plan.run_id、round_count/signed_at 非空、ceo-ruling.json/consumed 在盘且三值同串、close.charter_ref 可达、D-88/D-91 文本命中、manifest.close_contract.ok==true。
   - rollback：改前 cp preflight.json close.json chain-journal.jsonl 并记 sha256_16；断言红即还原，不动已发裁决与迁移树。

### COO（12）

1. **A｜batch_timetable 全段正序+逐件实测落点+480s 偏差对表**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：重写 #/batch_timetable：为 plan/migrate/verify/score/close 逐段填 planned_at≤started_at≤actual_at，另设 recorded_at 单列事后落卷时点；migrate/keep/carry_over 11 件 actual_landed_at 逐件取 W48 落点 stat/commit 时点，禁复用 tree-facts.generated_at；新增 window_drift_s 与 threshold_s=480 逐段对表，超过 480 的记入 window_conflicts（本轮 chain 实耗 558.4s）。
   - verify：jq 断言 batch_timetable 全段 planned_at≤started_at≤actual_at；11 件 actual_landed_at 互异且可 stat 复核；每段 window_drift_s≤480，超阈值段必在 window_conflicts 登记；断言红即回滚。
   - rollback：改前 cp plan.json plan.json.pre-a1 并记 sha256；断言红即恢复该件，不移动 W47/W48 树体、不改 tree-facts。

2. **A｜红面即停：close_contract false/空证/空收件不得 succeeded**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：补 rollout 段门判据与红面清单（close_contract.ok=false、verify reasons 空、dce wrong_order 无逐条裁定、close-acceptance total=0、notify to=[]、guard_hits>0、chain>480s）；任一红面命中即 close.run_state=partial 且 notify 不发；补 stop_record（stage/trigger/stop_at/rollback_path）与 guard 触发计数；rollback_order 用本轮实锚替换 pre-timingfix 旧值。
   - verify：jq 断言 manifest.close_contract.ok=true 或 manifest.run_state!=ok；close 红面清单与 stop_record 非空；notify 仅在 close_acceptance.total>0 且 to 非空时 status=sent；注入一个红面做负例验证 fail-closed。
   - rollback：改前 cp close.json manifest.json notify_done.json 为 .pre-a2 并记 sha256；断言红即恢复三件并重跑 close_skill，不重跑迁移。

3. **A｜恢复承诺→复盘→闭环率硬门**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：新增 recovery_ledger[]：逐条记上轮 run/opinion_id/承诺/owner/due/closure_state（open|done|deferred）/evidence_ref；close.upgrade_list 25 条与上轮 75 条逐条 diff 标 inherited/新增/closed；close-acceptance.source/total/by_family 由 ledger 复算；items_consumed/digest_rate 与 ledger 对表；报 succeeded 前要求闭环率≥阈值且无 open 项。
   - verify：jq 断言 recovery_ledger 非空且每条含 closure_state/owner/evidence_ref；close-acceptance total==sum(by_family)==ledger done 数；上轮 12 条 coo 意见逐条有 disposal；红即不写 succeeded。
   - rollback：改前 cp close.json close-acceptance.json 为 .pre-a3 并记 sha256；失败恢复两件，保留 opinions/charter 原卷。

4. **B｜迁移拍/读数齐时点链与静默期复算**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/dce.json
   - change：dce.json 增 migration_shot_at（migrate step 起/止）、readout_complete_at（score stage_ok）、silence_s 与 threshold_s=480、migration_window_ok；chain-journal 每段带 run_id 与 stage 时点；close 汇总静默期读数并附可复算公式（本轮可复算约 0.493s，按 plan_scope→score 约 34.073s）。
   - verify：jq 断言 migration_shot_at/readout_complete_at/silence_s 齐；chain-journal 时点复算 silence_s 与卷面一致（±1s）；silence_s≤480 才 migration_window_ok=true；红即回滚 dce/chain 段。
   - rollback：改前 cp dce.json chain-journal.jsonl 为 .pre-b1 并记 sha256；失败恢复，不重跑迁移段。

5. **A｜counts/families/readings 三面同口径+17 backfill 建账+RACI 收敛**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：counts 改 dispositions{migrate:5,keep:11,dead_letter:1,carry_over:2}=19 与 readings 逐条对齐（补 CARRY 两条 reading）；migrate/keep 数组补 3 顶层迁件与 4 顶层 keep、dead_letter 独立数组；17 个 w48_backfill_ids 逐项入 families/readings 或显式注记不属本轮；RACI 键集==families item 集、accountable 按族 owner 回填、due 改 W48 承接窗（≥2026-11-25）；8 loose files 逐项归属。
   - verify：jq 断言 migrate+keep+dead_letter+carry_over==19==readings 条数+CARRY 数、dispositions 与 families 一致；raci 键集与 families item 集差集为空、owner 差异=0、due 无 <2026-11-25；17 backfill 每项有 disposition 或 exclusion_reason。
   - rollback：改前 cp plan.json plan.json.pre-b2a 并记 sha256；断言红即恢复，不动 trees/tree-facts。

6. **B｜终局判面收口并消费 collection-A/F/H**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/score.json
   - change：score.json A/F/H 三族改消费 collection-A/F/H 的 verdict/rationale/evidence_ref（不再记 manual 6/9/9）；I 族 reasons 与 subjective-score 三判据统一（现 4/3/3 与 3/2/2 两账）；score-skill.final 落 final_scores_basis/divergence_review/entries/check_time；trend 只记总盘或显式标注为 I 族分；cost-log 第 3 行补 stage 与逐行 unavailable_reason。
   - verify：jq 断言 score A/F/H 的 evidence_ref 指向 collection-*.json 且 state!=manual；score I reasons 数值==subjective-score entries；score-skill.final 非占位串且 check_time 非空；cost-log 每行 stage 非 null。
   - rollback：改前 cp score.json score-skill.json subjective-score.json trend.jsonl cost-log.jsonl 为 .pre-b2b 并记 sha256；失败恢复五件并重跑 score_skill。

7. **A｜迁移树逐件全量 sha256+W48 落点+runId 承卷**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/tree-facts.json
   - change：tree-facts 9 树补 full_sha256（64 hex 整树）、逐文件 size+hash manifest、sampled_at，替换仅 sha256_16；plan.migrate/keep 每条补 W48 dest（或原地保留声明）、observed.sha256_full、evidence_ref 指 tree-facts#/trees/<id>；agent_readings 17 条 evidence_ref 逐条改指对应树锚或顶层 observed，补 check_time/run_id；plan-freeze 的 exam 哈希改为终卷实算 4af53ba59665297d。
   - verify：jq 断言每树有 full_sha256 与 manifest_path 且 sha256 长度=64；migrate/keep 每条 observed.sha256_full 非空、evidence_ref 非全同 week_math；plan/preflight/qualify/tree-facts 均含 run_id 且==目录 run_id；红即回滚。
   - rollback：改前 cp tree-facts.json plan.json plan-freeze.json 为 .pre-an1a 并记 sha256；失败恢复三件，不重算树体、不动 W47/W48 目录。

8. **B｜run 产物 hash 清单与 runId 全覆盖**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/manifest.json
   - change：新增 evidence_hash_manifest（逐文件 sha256_full/size/mtime/run_id），覆盖 preflight/qualify/plan/dce/verify/score/score-skill/close/notify/manifest/opinions/cost-log/chain-journal/collection；preflight/qualify/tree-facts/exam/plan-freeze/close-acceptance/structure-export-debt 补 run_id；chain-journal 每行补 run_id；references 记任务书/裁决件 hash。
   - verify：jq 断言 manifest.evidence_hash_manifest 覆盖≥16件且每件 sha256 长度=64；sha256sum -c 全过；所有 JSON 顶层 run_id==目录 run_id（允许显式 not_applicable 注记）；jq 解析每段产物 rc=0。
   - rollback：改前 cp manifest.json 为 .pre-an1b 并记 sha256；失败恢复 manifest 与新增清单，不改原产物。

9. **A｜本轮七席独立落卷+A/B 双列+分歧不抹平**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/opinions.json
   - change：本轮七席各落 opinions-<seat>.json（coo/cos/cao/cpo/cho/cfo/cto），每席对 A/B 两对象各给独立 score+rationale，禁共用；聚合按列各自均值并保留席间 spread；同维跨席分差≥2档须附 divergence 说明，禁以中位/均值抹平；close.seven_seats 改指本轮而非 resume36。
   - verify：jq 断言 opinions-*.json 7 件在盘且 run_id==本轮；每维 object=A/B 两列齐、score 独立；聚合 _seat_means 双列可复算；spread≥2档的维有 divergence_note；close.seven_seats.source==本轮 run_dir。
   - rollback：改前 cp opinions.json close.json 为 .pre-an2a 并记 sha256；失败恢复，保留各席原件不覆盖。

10. **B｜上轮 75 条意见回填守恒与 joint-review 归档硬门**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：opinions.json 补上轮 12 条 coo 意见逐条 disposition（opinion_id→本轮处置/done|deferred|dropped+reason+owner+evidence_ref），并覆盖 resume36 全部 75 条；本轮不得只留 2 条；joint-review.json 落卷（anchor_table_version/七席分数矩阵/A-B 双列/分歧表/回填对表）；close.opinion_dispositions 与本轮 opinions 条数对表守恒。
   - verify：jq 断言 close.opinion_dispositions 覆盖上轮 75 条 opinion_id 且无 refill.missing；opinions 条数=7 席×维；joint-review.json 在盘且含 anchor_table_version 与七席矩阵；aggregation.items_before/items_included 差=0。
   - rollback：改前 cp close.json opinions.json 为 .pre-an2b 并记 sha256；失败恢复两件，不覆盖本轮各席独立卷。

11. **A｜本轮裁决件三绑与 D-88/D-91 审批链落卷**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/preflight.json
   - change：把 resume36/ceo-ruling.json 与 .ceo-ruling-consumed.json 复制入本轮 run_dir；preflight.assertions.ceo_ruling 补 run_id=本轮、round_count、signed_at、ruling_ref、charter_ref、approved_by；chain_start 的 d91_marker 写 continue/round_count 而非 unknown；补 D-88 派工号+receipt（DP/run_id/receipt_at）与 D-91 声明（本轮 commit 仅 docs/workflow、无 runtime 业务码）。
   - verify：jq 断言 preflight.ceo_ruling.run_id==本节 run_id 且 round_count 为数字、signed_at 非空；run_dir 内 ceo-ruling/consumed/charter 三件在盘；D-88/D-91 各一行可解析；d91_marker.state!=unknown；红即 preflight fail-closed。
   - rollback：改前 cp preflight.json close.json chain-journal.jsonl 为 .pre-an3a 并记 sha256；失败恢复三件与新增副本，不撤销 CEO 已签原件。

12. **B｜审批链 D-88/D-91 与对象对齐**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：close.json 增 approval_chain[]（task_book_ref/ruling_ref/run_id/round_count/signed_at/dispatch_id/receipt_at/D91_claim）；charter_ref 填本轮任务书；run_state=succeeded 前要求 manifest.close_contract.ok=true；D-91 写本轮 commit 仅 docs/workflow 声明；D-88 补派工/回执。
   - verify：jq 断言 approval_chain 非空且每条含 run_id/round_count/signed_at/dispatch_id；run_id==close.run_id；charter_ref 非 null；D91_claim 非空；manifest.close_contract.ok=false 时 close.run_state!=succeeded。
   - rollback：改前 cp close.json manifest.json 为 .pre-an3b 并记 sha256；失败恢复两件，保留 charter/ruling 原件。

### COS（9）

1. **补 charter/dispatch/receipt 三件并闭合 order→ledger 五段**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：在 run_dir 落 charter-<ts>.json（charter_id/items/approver）、dispatch-<DP>.json（DP-YYYYMMDD-NNN/run_id/owner）、receipt-<DP>.json（DP/run_id/签收席/回执时点）；close.json 增 charter_ref/dispatch_ref/receipt_ref/verification_anchor 四字段；plan.migrate[] 补 3 个顶层迁件的 W48 dest/entry，keep[] 补 4 个顶层 keep，新增 dead_letter[] 收 OP-202611-W47-001.json，2 条 carry_over 补 readings，使 migrate(5)+keep(11)+dead_letter(1)+carry_over(2)=19 每件 disposition 唯一。
   - verify：jq -e '.charter_ref!=null and .dispatch_ref!=null and .receipt_ref!=null and .verification_anchor.path!=null' close.json && ls charter-*.json dispatch-*.json receipt-*.json >/dev/null && grep -Eq 'DP-[0-9]{8}-[0-9]{3}' dispatch-*.json receipt-*.json && jq -e '([.migrate[].item_id]+[.keep[].item_id]+[.dead_letter[].item_id]+[.carry_over[].item_id]|length)==19' plan.json
   - rollback：改前 cp close.json plan.json 至 .pre-cos-flow.<ts> 并记 sha256；断言红即 restore 两件，不移动 W47/W48 树、不重跑迁移。

2. **四账同源对表、closure verification_anchor 与 DP↔receipt↔closure**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：plan.counts 改为 dispositions 口径 migrate=5/keep=11/dead_letter=1/carry_over=2（合计19），families 19 项不变，agent_readings 补 CARRY-20260728-004/006 两条至19，migrate[]/keep[]/dead_letter[]/carry_over[] 四数组逐件对表；close.json 增 ledger_sync 块（四账条目数与差集）与 verification_anchor{path,sha256}；staffing.raci 收敛到19键、按族 owner 回填 accountable/responsible、due≥2026-11-25；close_acceptance.source 非空、每条 upgrade/opinion 带 dp_no/receipt_id/run_id。
   - verify：jq -e '(.counts.migrate+.counts.keep+.counts.dead_letter+.counts.carry_over)==([.families[].items[]]|length) and ([.families[].items[]]|length)==(.agent_readings|length) and (.staffing.raci|keys|length)==19' plan.json && jq -e '(.ledger_sync.diffs|length)==0 and (.verification_anchor.sha256|length)==64 and .close_acceptance.source!=null' close.json
   - rollback：改前 cp plan.json close.json 至 .pre-cos-ledger.<ts> 并记 sha256；断言红即 restore 两件，保留 tree-facts 与 W47 树体不动。

3. **七席 A/B 双列独立落卷并建上轮 75 条逐条回填**
   - target：/srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/opinions.json
   - change：在 faces<7 或非本轮时 fail-closed 拒写 joint-review；refill.missing 非空拒聚合；新增 divergence 表（同维 |Δ|>=2）与 rejected 逐条处置；close.seven_seats 只读本轮 run_dir；final_scores_basis/divergence_review 未定前禁写 trend；每席落 opinions-<seat>.json 独立卷；上轮 resume36 的 75 条逐条 refill（COS 9 条为下限）。
   - verify：cd /srv/fleet/TriCompany && pytest runtime/cognition/test_loop_joint_review_spawn.py -q && test $(ls /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/opinions-*.json | wc -l) -eq 7 && jq -e '(.faces|length)==7 and ((.refill.missing|length)==0) and has("divergence")' /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/joint-review.json
   - rollback：改前 cp loop_joint_review_spawn.py close.json opinions.json score-skill.json trend.jsonl 至 .pre-cos-review.<ts> 并记 sha256；断言红即 restore，不写 joint-review/opinions、不发 notify。

4. **close_contract=false 即 fail-closed 并补六项回呈/BOD→CEO 升级**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_cli.py, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/manifest.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：assert_close_contract 返 ok=false 或 run_state_source=null 时，manifest.run_state 只落 partial/failed，close.run_state 不得 succeeded，chain_runner 不进 notify；close.json 增 gate_compliance.six_items（六项逐项 verdict+evidence_ref）与 escalation_ref；manifest.stages.close 与 close.verdict 同源。
   - verify：cd /srv/fleet/TriCompany && pytest runtime/cognition/test_close_cli.py -q && jq -e '(.gate_compliance.six_items|length)==6 and .escalation_ref!=null' /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json && jq -e '.run_state!="ok"' /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/manifest.json
   - rollback：改前 cp close_cli.py manifest.json close.json notify_done.json 至 .pre-cos-gate.<ts> 并记 sha256；失败即 restore；保留已发通知事实并回填更正卷。

5. **全量 sha256+逐文件 manifest、runId 全覆盖与 verification_anchor**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/tree-facts.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan-freeze.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/exam.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/preflight.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/qualify.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close-acceptance.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/plan.json
   - change：为 9 棵树补 full_sha256（64 hex 整树）与逐文件 {path,size,sha256} manifest，封存前后各采样一次并写 sampled_at/manifest_path；preflight/qualify/tree-facts/plan-freeze/exam/close-acceptance 补 run_id；close 增 verification_anchor{path,sha256}；verify 8 项补非空 reasons/evidence_ref；ignite.log 落 stdout/stderr/rc 或显式注缺席；plan.references 去重并把 exam hash 改为实测 4af53ba59665297d。
   - verify：jq -e 'all(.trees[]; (.full_sha256|length)==64 and (.manifest|length)>0)' tree-facts.json && for f in preflight.json qualify.json tree-facts.json plan-freeze.json exam.json close-acceptance.json; do jq -e '.run_id|length>0' $f >/dev/null || exit 1; done && jq -e '.verification_anchor.sha256|length==64' close.json && jq -e '.references|map(.file)|unique|length==(.references|length)' plan.json
   - rollback：改前 cp tree-facts.json plan-freeze.json close.json verify.json exam.json plan.json 至 .pre-cos-anchor1.<ts> 并记 sha256；断言红即 restore，不移动树体、不改 plan 的迁移账。

6. **seven_seats 只读本轮并保留逐席独立意见与分歧/回填表**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/opinions.json, /srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py
   - change：close.seven_seats 改为只读本轮 run_dir（source=current），present/missing 逐席实读，禁以 prev 席次填 present；opinions 按席拆 opinions-<seat>.json 各 7 件；joint-review 增 faces=7、A/B 双列、anchor 独立面板、divergence>=2 列表；上轮 resume36 的 75 条 opinions 逐条 refill/disposition 守恒。
   - verify：jq -e '.seven_seats.source|endswith("shift-W48-resume37-20261125T101347Z")' close.json && test $(ls /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/opinions-*.json | wc -l) -eq 7 && jq -e '(.faces|length)==7 and ((.refill.missing|length)==0) and has("divergence")' /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/joint-review.json
   - rollback：改前 cp close.json opinions.json score-skill.json 至 .pre-cos-anchor2.<ts> 并记 sha256；失败即 restore，不写 joint-review、不发 notify。

7. **裁决件三绑齐与 D-88/D-91 审批链落卷**
   - target：/srv/fleet/TriCompany/runtime/cognition/round_runner.py, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/preflight.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/chain-journal.jsonl
   - change：落 ceo-ruling.json 三绑（run_id/round_count/signed_at）+ ruling_ref/prev_run_dir/charter_ref；preflight.json 增 run_id/round_count；DP 号改 DP-YYYYMMDD-NNN 并落 receipt-<DP>.json；charter 经 CEO approval 落 ceo-charter-approval.json（approved_by/approved_at/authority_ref）；补 D-88 派工三步回执与 D-91 链跑声明（本轮 commit 仅 docs/workflow）；chain-journal 的 d91_marker 写 continue/round_count 非 unknown。
   - verify：jq -e '.run_id!=null and .round_count!=null and .signed_at!=null' ceo-ruling.json && jq -e '.run_id!=null and .round_count!=null' preflight.json && grep -Eq 'DP-[0-9]{8}-[0-9]{3}' receipt-*.json && jq -e '.approved_by=="CEO"' ceo-charter-approval.json && test -z "$(git -C /srv/fleet/TriMetaverse show HEAD --name-only | grep -v '^docs/')"
   - rollback：改前 cp round_runner.py preflight.json ceo-ruling.json 至 .pre-cos-anchor3.<ts> 并记 sha256；断言红即 restore，不重跑迁移、不改 tree-facts。

8. **统一 I 族三账与 trend 口径，禁 I 族归一化冒充总盘**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/score.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/subjective-score.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/score-skill.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/trend.jsonl
   - change：score.json I 族 reasons 的 I1/I2/I3 改为与 subjective-score.json 同源重算（现 4/3/3 vs 4.0/2.0/2.0 并存）；score-skill initial/joint 的 12/8/7 与 13/8/7 明确标注为 5 分制原始判读并按 14/11/10 权重复算；trend.jsonl 增 score_basis 字段区分 I 族/总盘，或在 final 未定前不写 trend；score-skill.final/entries/check_time 补实值。
   - verify：jq -e '.entries|map(.score)==[4,2,2]' subjective-score.json && jq -e '.score.families[]|select(.family_id=="I")|.score==28.0' score.json && jq -e 'has("score_basis")' trend.jsonl && jq -e '.judge_faces.final.entries!=null and .check_time!=""' score-skill.json
   - rollback：改前 cp score.json subjective-score.json score-skill.json trend.jsonl 至 .pre-cos-score.<ts> 并记 sha256；断言红即 restore，不改 plan/close 的迁移账。

9. **verify 8 项补非空证据并逐条裁定 dce wrong_order**
   - target：/srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/verify.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/dce.json, /srv/fleet/TriRMC/fade001-runs/shift-W48-resume37-20261125T101347Z/close.json
   - change：verify.json 8 项 checks 各补 reason 与 evidence_ref（含 W48 路径/sha 或 preflight 字段）；dce.json 对 wrong_order 4 项逐条加 order_impact∈{non_blocking,reorder_required,blocked} 与依据，verdict 不得在 44% wrong_order 且无裁定时写 pass；close 的 gate_compliance.six_items 同步引用两条证据。
   - verify：jq -e 'all(.checks[]; (.reasons|length)>0)' verify.json && jq -e '(.execution_diff.wrong_order|length)==4 and ([.execution_diff.order_impact[]?]|length)==4' dce.json && jq -e '([.gate_compliance.six_items[]?]|length)==6' close.json
   - rollback：改前 cp verify.json dce.json close.json 至 .pre-cos-gate2.<ts> 并记 sha256；断言红即 restore，不改 plan/families。

### CPO（12）

1. **A｜plan 增 dispositions 全集与双域计数（结账 cpo-0）**
   - target：/srv/fleet/TriCompany/runtime/cognition/plan_skill_spawn.py
   - change：在 plan 生成器增 dispositions[]：覆盖 W47 顶层9实件（含 convene/、shift-WW46-20261115T185801Z）、W48 17个 backfill、8个 loose，逐项写 adopted/deferred/rejected/missing_declared+reason+evidence_ref；counts 拆 tree{2,7} 与 top_level{migrate3,keep4,dead_letter1}+carry2；补 CARRY-20260728-004/006 两条 reading；actual_landed_at 无实测写 null+note，禁复用 tree-facts.generated_at。
   - verify：jq 断言 families=19 且 readings=19（含 CARRY 2条）、counts.tree{2,7}+top_level{3,4,1}+carry2=19、17 backfill+8 loose 均有 disposition、D 族键集等于 W47 顶层9实件；pytest test_plan_skill_spawn.py -q。
   - rollback：单 commit 回退 plan_skill_spawn.py 与测试，恢复 plan-freeze 的 plan.json 快照；不移动 W47/W48 树。

2. **B｜close 增66条 requirement_trace 并对未兑现 fail-closed**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_skill_spawn.py
   - change：close.json 增 requirement_trace[]（任务书 e0dfa6481 的66条逐条 status/owner/due/evidence_ref）；close_contract.ok=false 或 trace 有 missing/deferred 时 run_state=partial，禁写 succeeded；opinions_in/digest_rate 与 trace 对表；裁决与任务书引用写入 trace。
   - verify：jq 断言 trace 长度==66 且 status 非空；close_contract.ok==false 时 close.run_state 不等于 succeeded 且 manifest.stages.close 不等于 unknown；notify 仅在 succeeded 且 to 非空时发送。
   - rollback：回退 close_skill_spawn.py 与 close.json 单 commit；保留 opinions 与产物；不重发通知。

3. **B｜族点名表覆盖17 backfill+8 loose 并逐族核**
   - target：/srv/fleet/TriCompany/runtime/cognition/weekly_plane_shift_fade.py
   - change：plan 增 family_roster[]：每族列 family_id/items/expected_from_W47/actual_on_disk/gap[]；17 backfill 与8 loose 逐项归族并给 owner/timebox/acceptance；D 族按 W47 顶层9实件重排，补 convene/、shift-WW46，.shift-ade.prev.json 标 missing_declared；补 1117→1123 任务大表版本裁定与需求池/未决项跨周去向。
   - verify：jq 断言 roster 覆盖17+8且 gap 为空或显式 missing_declared；D 族等于 W47 顶层9实件；17 backfill 在 families 或 roster 各有 disposition；pytest test_weekly_plane_shift_fade.py -q。
   - rollback：回退 weekly_plane_shift_fade.py 提交并恢复 plan.json 快照；不改 trees/。

4. **A｜score 单一100制口径+应答矩阵/拒判台账**
   - target：/srv/fleet/TriCompany/runtime/cognition/score_cli.py
   - change：score.json 只保留 total_100=domain_breakdown 三项之和，trend 每行写 total_100/i_family_100/score_scope；新增 response_matrix.json 覆盖上轮75条 opinion_id→本轮 adopted/deferred/rejected；pending>0 时 refusals[] 必填维度/原因/owner；七席分数分列，禁 I 族归一值冒充总盘。
   - verify：jq 断言 total_score 等于 machine+collection+subjective 且为93.0、trend 每行有 score_scope、response_matrix 覆盖75/75、pending>0 则 refusals 非空；trend 的 cos/coo 值带 i_family 标。
   - rollback：回退 score_cli.py 与 trend 写入，恢复 score.json/trend.jsonl 快照；不重跑 judge。

5. **A｜迁移读数逐案 label/reason_code 与族点名可机判**
   - target：/srv/fleet/TriCompany/runtime/cognition/plan_skill_spawn.py
   - change：agent_readings 每条带 label 属于 record/active/unknown、reason_code、item 级 evidence_ref（tree-facts 树锚或顶层 path+sha256），禁17条同引 preflight week_math；self_checks 增 label_rate/fallback_rate 与 family_roster；object_letter_map 写 A=周工作平面迁移质量、B=fade-001 工作质量。
   - verify：断言17/17有 label 与 reason_code、evidence_ref 互异且可解析、label_rate+fallback_rate==1、family_roster 条数等于实盘、object_letter_map 与题面一致；负例缺 label 或复用同一 ref 即 fail。
   - rollback：回退 plan_skill_spawn.py 与测试，保留 plan.json 快照；不重跑后续段。

6. **B｜主观题 rubric 机械化并消 I 族多套账**
   - target：/srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py
   - change：exam.subjective 每题增 assertion（regex/json_field）、result 属于 pass/fail/na、evidence_ref；score-skill 逐题落结果与 labeled/total；统一 score.json I 族4/3/3、subjective-score 4/2/2、score-skill 12/8/7 与13/8/7 为同一判卷源，历史值单列 historical；A/B 映射写 object_letter_map。
   - verify：jq 断言 exam.subjective 4/4有 assertion/result/evidence_ref；score-skill 有 labeled/total；score.json I 族 reasons 不含未标注的4/3/3；object_letter_map 的 A/B 正确。
   - rollback：回退出题与聚合提交，保留本轮 exam.json 与评分卷；不重跑七席。

7. **A｜9树全量 sha256+逐文件 manifest+runId 覆盖**
   - target：/srv/fleet/TriCompany/runtime/cognition/plan_enricher.py
   - change：tree-facts 与 plan-freeze 每树增 full_sha256(64hex)、files[]（path/size/sha256）、sampled_at、run_id；plan 的 migrate/keep/carry evidence_ref 改指 tree-facts 树锚或顶层 observed，禁自指；给 preflight/qualify/tree-facts/plan-freeze/exam/close-acceptance/structure-export-debt 补 run_id；新增 evidence_check 复算 hash。
   - verify：python 断言9树 full_sha256 可复算、files[] 件数等于 file_count、17条 readings evidence_ref 可解析且非同一模板、17/17 JSON 有 run_id；改一字节即 hash check fail。
   - rollback：回退 plan_enricher.py 与 tree-facts 写入，保留原树与 plan 快照；不重跑 dce。

8. **B｜run-dir 全件 artifact manifest（runId+sha256+parse_ok）**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_cli.py
   - change：manifest.json 增 artifact_manifest[]：run-dir 内每件 JSON/JSONL 记 path、sha256(64hex)、run_id、parse_ok、bytes；close 前复算并写 evidence_hash_ok；缺 run_id 或缺 hash 列 violations 并使 close_contract.ok=false；ignite.log 0B 写 empty 理由；score.json 的 artifacts_manifest 改为复算而非缺件占位。
   - verify：jq 断言 artifact_manifest 条数等于 run-dir JSON/JSONL 实盘数、每件 sha256 为64hex 且 run_id 或 N/A、复算一致；负例删 run_id 即 close fail；ignite absent_reason 非空。
   - rollback：回退 close_cli.py 提交，恢复 manifest.json 快照；不重发 notify。

9. **A｜本轮七席逐席独立卷+A/B 双列+分歧表+回填矩阵**
   - target：/srv/fleet/TriCompany/runtime/cognition/loop_joint_review_spawn.py
   - change：对 A/B 各写 opinions-<seat>.json（7席，dimension_id/object/score/rationale 分列）；joint-review 增 seat_means 双列、divergence（同维跨席差至少2档逐条列席、禁平均）、refill（上轮75条→本轮逐条 disposition）；close.seven_seats 只读本轮。
   - verify：jq 断言 faces 长度==7、每席 dimensions 含 A/B、divergence 覆盖至少2档、refill.missing==[]、seat_means.a/b 非空、close.seven_seats.source==close.run_id。
   - rollback：仅新增逐席卷与字段，回退聚合器提交；保留既有汇总卷。

10. **B｜close 只认本轮七席并联审 fail-closed**
   - target：/srv/fleet/TriCompany/runtime/cognition/close_skill_spawn.py
   - change：close 前强制跑 current round loop_joint_review_spawn；close.seven_seats 只读本轮 joint-review.json，source 等于当前 run_id，禁 prev 冒本轮；opinions_in==7 且7件逐席卷在盘；不足则 run_state=partial、close_contract.ok=false、不写 notify_done；补 current_round{run_id,present,missing}。
   - verify：jq 断言 seven_seats.source==close.run_id、opinions_in==7、opinions-<seat>.json 计数==7；模拟缺1席即 partial 且无 notify；pytest test_close_skill_spawn.py -q。
   - rollback：回退 close_skill_spawn.py 提交，恢复 close.json/manifest 快照；不重跑评分、不投递。

11. **A｜裁决件/任务书三绑同卷+D-88/D-91 审批链**
   - target：/srv/fleet/TriCompany/runtime/cognition/ceo_ruling_probe.py
   - change：run-dir 内落 ceo-ruling.json 与 ceo-charter-approval.json：run_id==本轮、round_count、signed_at、ruling_ref、charter_ref/charter_commit/approved_by 齐；preflight.assertions.approval_chain 写 D-88 派单号与回执、D-91 两阶段与跑中 marker（禁 unknown）；缺任一即 preflight fail-closed。
   - verify：jq 断言两件在 run-dir、三绑非空且 run_id 等于目录名、charter_commit 可 git cat-file、d91_marker.state 属于 continue/stop；负例缺 approval 即 preflight fail；pytest test_ceo_ruling_probe.py -q。
   - rollback：回退 probe 提交；保留 prev ruling 不动；不点火。

12. **B｜chain 启动/收口写 D-91 marker 与裁决回执**
   - target：/srv/fleet/TriCompany/runtime/cognition/chain_runner.py
   - change：chain_start 读本轮 ruling 后写 state/round_count/signed_at/ruling_ref/receipt_ref，禁 unknown；chain_end 写 consumption_receipt（consumed_by/consumed_at/ruling_run_id）与 approval_chain（task_book_ref/ruling_ref/run_id/round_count/signed_at/dispatch_id/receipt_at/D91_claim）；close 回填三绑。
   - verify：jq 断言 chain-journal 首尾 marker.state 属于 continue/stop 且非 unknown、close 三绑非空、receipt_ref 可在 run-dir 解析；缺即 chain_end ok=false。
   - rollback：回退 chain_runner.py 提交，保留本轮 chain-journal；不重跑链。

### CTO（12）

1. **A|disposition 单一账与 landed 实测（树/顶层/索引三面同源）**
   - target：plan.json
   - change：把 agent_readings 的 5 迁/11 留/1 死信并入 migrate[]/keep[]/新增 dead_letter[]（或 top_level_dispositions 单账），counts 由五态复算（19 件=5+11+1+2）；补 CARRY-20260728-004/006 两条 readings；为 17 个 w48_backfill_ids 建账或显式标注不属本轮迁移面；staffing.raci 收敛到 19 键并与 families/migrate/keep owner 逐项对齐；migrate/keep 的 actual_landed_at 改逐件实测或 null，禁以 tree-facts.generated_at 充落点。
   - verify：jq 对表：counts 五态合计=19 且=readings 数；migrate/keep/dead_letter/carry_over 数组逐件与 readings 零差；17 backfill id 处置率=100%（入账或显式 N/A）；RACI 23→19 键且 owner 一致率=100%。
   - rollback：以 plan-freeze.artifacts.plan.json=aa24d1ed21857884 为锚恢复 plan.json；不改 9 棵树与 W47 原卷。

2. **B|段门 fail-closed、审批面读路径与状态机一致**
   - target：/srv/fleet/TriRMC/src/fade001/chain_runner.ts
   - change：gateStageResult 对缺产物/无 verdict/不可解析改 ok=false（fail-closed）；close_contract.ok=false 时链停且 close.run_state 不得 succeeded、notify sent=false；approval_chain 改读 preflight.assertions.ceo_ruling 并落 ruling_state/refusal/prev_run；chain-journal 用卷面 chain_time 替代 new Date()（D-47）。
   - verify：构造缺 score-skill、空 final、close_contract=false 三案→链分别 rc≠0；chain-journal.approval_chain.ruling_state=continue 且 prev_run 非空；journal ts 与 hard_clock 同源。
   - rollback：回退 chain_runner.ts 至本版；以 FADE_CHAIN_GATE_STRICT=0 暂回旧门形，不删十段产物。

3. **A|批次/依赖/测试门/回滚面四件齐**
   - target：plan.json
   - change：batch_timetable 补 plan/dce/verify/score/close 各段并令 planned_at≤started_at≤actual_at（现 2 条 plan_skill planned_at 晚于 started/actual）；families 19 项按真实前置补 depends_on 与独立 acceptance；verify 8 项逐项写 reason+实测值+run_dir evidence；rollback_order 换成本轮 plan/tree/top_level 快照绝对路径+sha256；dce.execution_diff 的 wrong_order 4 项逐条裁『不影响/需重排』。
   - verify：jq：batch≥5 且三段时戳单调；depends_on 非空项≥1；verify 8/8 reasons 非空且 evidence 在盘；rollback 三步目标存在且 sha 复算一致；wrong_order 逐项有裁定字段。
   - rollback：回退 plan.json 至 plan-freeze 锚；保留 dce 迁移提交与树。

4. **B|manifest 全段、收件人与 close_contract 门**
   - target：/srv/fleet/TriRMC/src/fade001/chain_runner.ts
   - change：manifest.stages 覆盖十段（现缺 score_skill/close_skill/notify_done）；notify_done.to/cc 为空时 sent=false 并告警；close_contract.ok=false 时 run_state=partial 且链停在 close 段不 notify；chain_runner 在 close_skill 后消费 close_contract 与 manifest.stages 完成度。
   - verify：jq：manifest.stages 键数=10；notify to=[] 时 sent=false；注入 close_contract.ok=false 案→run_state=partial 且 chain_end ok=false。
   - rollback：回退 chain_runner.ts/close_cli 消费面；保留十段产物与 notify 记录。

5. **A|证据去模板化、hash 全量与同源对表**
   - target：tree-facts.json
   - change：9 条树 ref 保留，8 条顶层读数逐条改指 W48 落点/实测件；tree-facts 补全量 sha256+逐文件 size+hash manifest；plan-freeze.artifacts 在 exam/plan 终写后复算（现 exam 6482146b 对实算 4af53ba5）；plan.references 去重并补 rubric-firstshoot.json 或显式 N/A；2 条 CARRY 补 observed/evidence_ref。
   - verify：jq：17/17 evidence_ref 具体且首段路径在盘；tree full sha256 长度=64 且抽 3 棵复算一致；plan-freeze artifacts 与当前 plan/exam 哈希全等；references 唯一件数=2。
   - rollback：保留旧 tree-facts/plan-freeze 副本；回退新增字段；不改树内容。

6. **B|运行级测试证据与 score/collection 同源**
   - target：score.json
   - change：score.json 消费 collection-A/F/H.json（现记 manual 6/9/9）并按 verdict 计分；I 族按 subjective-score 4/2/2 重写（现 reasons 写 4/3/3）；score-skill 落 final verdict/entries/check_time；close-acceptance 补非空 source/total；verify 8 项写实测值；修 O9 布尔/字符串断言类型。
   - verify：jq：A/F/H state≠manual；I 族 reasons 与 subjective-score 逐项相等；score-skill.final∈合法 verdict 且 entries 非空；close-acceptance.source≠null；O9 断言与 plan.bidirectional_ok 同类型。
   - rollback：回退 score.json/score-skill.json/close-acceptance.json 至本轮副本；保留 collection 三件。

7. **A|止损实测、风险分级与可执行回滚锚**
   - target：plan.json
   - change：stop_loss 补 guard_hits/actual_duration_s/是否触 480s（与 close.cost_settlement 对表）；rollback_order 三步给本轮 plan/tree/top_level 快照路径+sha256；为 17 backfill + 2 CARRY 建风险分级/缓解/owner；窗口冲突扫描保留。
   - verify：jq：stop_loss.guard_hits 非 null 且与 cost-log 总时长可对；rollback 三步目标在盘且 hash 匹配；风险表覆盖 19/19 ID 零缺。
   - rollback：回退 plan.json 至 plan-freeze 锚；保留迁移提交与 W47 树。

8. **B|D-91 marker 与回滚演练**
   - target：/srv/fleet/TriRMC/src/fade001/chain_runner.ts
   - change：链启动/毕写读 bare refs/runtime/chain-running（现 d91_marker=unknown 因 bare env 缺）；dce push 前校验 marker 三态；补一次回滚演练（rc+恢复后 hash）；cost null 不归零并写 unavailable_reason。
   - verify：chain-journal d91_marker.state∈{absent,running,stale} 且非 unknown；dce 前有 marker 事件；演练记录含 rc/hash；cost-log 无 null 归零且 stage 非空。
   - rollback：保留 marker ref 清理幂等；回退 chain_runner 新增校验；不重跑迁移。

9. **B|spawn-vs-CLI 同 fixture 等值与席集单一真源**
   - target：/srv/fleet/TriRMC/test/fade001/chain_runner.test.ts
   - change：为 plan_skill/plan_scope、close_skill/close_skill_spawn 建同一 run-dir fixture，用 FADE_PLAN_SPAWN/FADE_CLOSE_SPAWN=0|1 两态跑，断言关键键集、段门 verdict、失败 rc 差异=0；score_skill 补 CLI 对等形或显式 N/A；plan/close/score/联审席集收敛到单一 SEATS 真源。
   - verify：两态同 fixture 断言差异=0；缺产物/空 final 两案两态均 fail；席集默认值与联审七席一致。
   - rollback：以 FADE_PLAN_SPAWN=0/FADE_CLOSE_SPAWN=0 回 CLI 形；回退新增测试与席集默认值；保留十段产物。

10. **A/B|全量 hash、runId 全覆盖与独立可解析**
   - target：tree-facts.json
   - change：9 树与 families 件补全量 sha256+逐文件 size/hash manifest，封存前后各采样一次；plan-freeze.artifacts 终写后复算；preflight/qualify/plan-freeze/tree-facts/exam/close-acceptance/structure-export-debt 补 run_id 或显式 N/A；verify 增 hash 复核字段（重算值 vs 台账值）。
   - verify：抽 3 棵树重算全量 sha256 与 manifest 一致；plan-freeze.artifacts.plan.json==sha256_16(plan.json) 且 exam 同；7 件 run_id 全补齐或注 N/A；每件 JSON 独立解析。
   - rollback：保留旧 tree-facts/plan-freeze 副本；回退新增字段；不改树内容。

11. **A/B|七席齐、A/B 双列、分歧不抹平与上轮 75 条回填**
   - target：opinions.json
   - change：本轮按七席跑 full joint review，每席落 opinions-<seat>.json 与 joint-review.json 的 A/B 双列+锚分独立面板；聚合卷列出席间≥2 档分歧不平均；close.opinion_dispositions 覆盖上轮 75 条逐条 status/owner/期限/evidence_ref，seven_seats.source=current，digest_rate>0.9。
   - verify：joint-review.faces 七席 present 且 absent=[]；A/B dims_count 各≥3；divergence 表列出≥2 档项；上轮 75/75 有 disposition、missing=[]；seven_seats.source=当前 run-dir。
   - rollback：回退至本轮 2 条 opinions 形；保留已落 opinions-<seat> 与 joint-review 卷不删；不重跑迁移。

12. **A/B|三绑全字段与 D-88/D-91 凭证入卷**
   - target：preflight.json
   - change：preflight.ceo_ruling 增 run_id/round_count 并与 .ceo-ruling-consumed.json 逐项相等；把 ceo-ruling.json/.ceo-ruling-consumed.json 拷入本轮卷；落任务书 e0dfa6481 的 commit 与 D-88 DP 号/回执；chain-journal approval_chain 改读 assertions.ceo_ruling 并落 d91_marker 三态；dce push 前校验 D-91 marker。
   - verify：jq：ruling 三绑与 consumed 逐项相等；e0dfa6481 在 TriMetaverse git 可 cat-file 且入卷；DP 号可一跳达；chain-journal approval_chain.ruling_state≠null 且 d91_marker.state≠unknown。
   - rollback：回退 preflight/chain-journal 新增字段；保留原 ruling/consumed 件；不改审批状态。

## §三 与 r36（75 条）的关系

- refill ok=true：r36 的 75 条**逐条承接**（prev_opinion_id 对表）；本轮 **80 条**=75 承接+**5 条新增**。
- filtered=[]：**零丢弃**（T1a 五字段校验全过）。

## §四 呈批

**请裁**：①本任务书收悉否 ②下一轮（r38）是否开跑（含本 80 条）③r37 总分 93.0 已达 test 线（>90）——是否推 prod 窗（差 subjective 7 分）。

## §五 CEO 两指示合入（2026-11-25 19:4x·等批）

### 5.1 联审总分口径归一化（CEO 令·未批过改总分制）

- **现状（缺陷）**：joint-review 的 a/b 两维度分数=各席维度分**原值求和**（a=1111·b=1082），**未归一化**——CEO 明确：**a、b 两个维度总分各为 100 分·所有评判维度归一化到这两个 100 分上**。
- **修法（候批）**：joint-review 输出增 **a_score_100 / b_score_100**（各维度分按其满分折算后加权归一），原始分保留（trace 用）；**总分制变更需 CEO 批**——本任务书 §五 即呈批件。
- **现状判读**：a=1111/b=1082 只作「原始维度分之和」读数·**不得以任何形态冒充百分制**。

### 5.2 r36 75 条修复状态如实（CEO 问「改没改」）

- **读数**：r37 joint-review 的 refill 75 条 **status=全部 deferred（75/75·零条标已修）**——**从意见账看=没改**。
- **但**：批二批三（S4/S5/S6/S7/S8·约 29 条对应的代码面）**代码修复已做**（15 件·63 测试全绿·today）——**「修了代码」≠「满足意见的验收面」**：意见的五字段验收标准（逐条处置台账/A-B 双列/回填表/证据落卷等）**多数未达**，故 refill 判 deferred 成立。
- **机制缺口（本任务书议题）**：**意见账「已修/未修」无逐条对表**——refill 只记 status·**无「验收证据引用」字段**——建议增 `acceptance_evidence`（意见→产物字段/测试/commit 的映射）·由验收席逐条回填；**候批**。
- **80 条构成**：r36 75 条**原样承接**（deferred）+ 5 条新（COO/CPO 深化）= 80·**零丢弃**。

### 5.3 等批

- 本 §五 与 §一-§四 一并候 CEO 批；**批前不施工**（含归一化实现与意见账对表实现）。

—— §五 合入（BOD 2026-11-25 19:4x）

## §六 意见结账机制（CEO 问「再跑 r38 还不是一样」·解法·候批）

### 6.1 根因

- **现状=「提意见的人自己判账」**：联审 7 席跑的时候依据「本轮产物」判每条意见 status——**看不到代码层的修复**（S4 修的 close 面不在他们读的产物里显式体现）·**又没有 acceptance_evidence 可引** → **一律 deferred** → **意见账永远不清·每轮 75+5 承接·进化环空转**。

### 6.2 三层解法（本任务书核心议题·候批）

1. **意见与结账分离**：提意见=联审席（7 席）；**结账=验收席**（CTO/CAO 联署+BOD 对表）——**提意见的人不给自己结账**；
2. **acceptance_evidence 逐条映射**：每条意见须有 `{opinion_id, status: fixed|deferred|rejected, evidence: [产物字段/测试名/commit sha], verified_by, verified_at}`——**结账表=单独卷**（close 侧产·refill 消费）；
3. **修完→结账→再跑**：施工批毕 → 验收席逐条结账 → **r38 的 refill 读结账表**（fixed 的不再挂·只在 divergence 面复核）。

### 6.3 本轮立即可做（不必等 r38·避免空转）

- **r36 75 条先分池**：**S4-S8 组（约 29 条）代码已修**（today 15 件·63 测试绿）——**直接结账**（补 evidence 映射·CTO/CAO 验）；**其余约 46 条真未修**（S1-S3 深化/台账类）——进施工批；
- **结账后**：75 条里 fixed≈29（39%）·余 46 条施工→再结账→跑 r38；**r38 的 refill 将第一次看到意见账真实下降**（fixed 29+·而非 75 全 deferred）。

### 6.4 等批

- §6.2 三层机制与 §6.3 本轮分池结账**候 CEO 批**；批前不施工。

## §七 state 自动升降级机制（CEO 2026-11-25 20:1x 令·批评 CTO 未审出·融入本任务书实现）

### 7.1 CEO 令与批评

- **令**：「**进 test 和 prod 需要程序判读自动升级，降级也是同理**」——state 迁移=**程序自动判读**（非人工看分推）；**降级同理**（跌破阈值自动降）。
- **批评**：「**为什么 CTO 这个没审出来？**」——承认：S1-S8/批一批二批三都修「当轮产物」，**state 生命周期（debug↔test↔prod 的自动判读与落卷）无人审、无机制**——CTO 面审实现正确性，**未覆盖 state 机生命周期**。

### 7.2 实现要求（候批·批后施工）

1. **判据源**：**进化轴**（联审/进化环判读）——**不是验收轴分数**（CEO 勘正：93 分=fade-001 主观+客观验收分·**不是推进化态的依据**）；
2. **升级**：进化轴判据满足（如联审 A>90 且 B>90 → `test`；A>95 且 B>95 → `prod`——**阈值以 CAO 纪律册在册版为准**）→ **程序自动 set state+落卷**（who/why/evidence）；
3. **降级**：同判据反转（跌破阈值 or 红面/失败轮连续 N 次）→ **程序自动降级+落卷**；
4. **三态机**：state ∈ {debug, test, prod}·**迁移表显式**（迁移条件/触发点/回滚）；**禁人工改 state 无卷**；
5. **落点**：round_runner 轮末 or score 段后置钩（与联审同层）·由 CTO 出技术方案。

### 7.3 与三问的关系（CEO 已答）

- **任务书收悉=批** ✓（CEO 原话「任务书收悉」）；
- **r38 时点=本任务书意见修复改进后点火** ✓（先修 46 条+§七 接线→再跑 r38）；
- **93 分不触发 test** ✓（验收分≠进化分·两轴分立 v2.1.0 §2.6 正解）。

### 7.4 state 现状勘注

- 当前 fade-001 flag/state=**debug**（preflight flag_gate=debug 实测）——**93 分不改变 state**——**state 变更仅经 §7.2 程序判读**。

### 7.5 CTO 技术方案草（af3575af5·已融入）

- **卷锚**：`cto-s7-state-autoevolution-design-20261125.md`（TMV af3575af5）——六节：①判据源=进化轴（A/B 联审分·93 不催态）②**三态机迁移表**：debug→test（A>90&&B>90）／test→prod（A>95&&B>95）／**prod→test 降级**（A<95||B<95·E2 已有扩单侧）／**test→debug**（连续 N fail·N 建议 3·以纪律册为准）／禁人工无卷改 state（flag 卷断言）③落点=round_runner 轮末（score 后置钩·state_transition 入 chain-journal）④降级同理 ⑤施工件+验收五案+工时 ~1.5h ⑥依据。
- **CTO 自领**：state 生命周期=跨轮机制·此前无人审无机制·CTO 面审实现正确性未覆盖 state 机（CEO 批评成立）。
