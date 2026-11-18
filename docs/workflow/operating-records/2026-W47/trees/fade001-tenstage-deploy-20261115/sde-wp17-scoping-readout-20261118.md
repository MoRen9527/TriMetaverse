# SDE WP1-7 码位图+施工设计面（notice-185 统改前置读数卷·WP4 毕报姊妹卷）

- sourceOfTruth: 本卷（WP1-7 统改前置码位图正身·施工设计面）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD notice-185（WP 施工序·统改单笔族）
- 窗: 2026-11-18T07:2xZ（date 现查·D-47）
- 判定: **四文件码位图全勘毕+逐 WP 施工设计面落卷——统改笔=精细语义施工（chain verdict 依赖面）·本席容量墙检查点定谳（r12 劣化窗教训承）＝统改笔候满容窗施工（码位图/设计面=本窗实产·零半成品落码）**

## §一 · 码位图（四文件·WP 对表）

| WP | 文件·位 | 施工面设计 |
|---|---|---|
| WP1 判读留痕 | plan_scope.py `_agent_verdict_for_tree`（L499-553） | readings 增 rationale/evidence_ref 字段（fast_path 案=规则判读 rationale·agent 案=解析 rationale 透传·failed_fallback 案=失败语义 rationale）；**annotation 空=fail-closed 不放行**（plan_family 投影前 gate——零 null 面） |
| WP2 活件对账 | plan_scope.py counts 组装段+`_project_agent_family` | 八顶层活件去向四选一逐案判（migrate/keep/carry/显式挂账——挂账=新 category 面候 COS 规划核）+counts↔readings 自动对账函数（reconcile_counts_readings()·差额=显式 fail-closed 拒产） |
| WP3 兜底治理 | plan_scope.py failed_fallback 三分支（L532/536/541/550）+notify 面 | 兜底转候裁/重试分支（retry=一次重试面·候裁=escalation 面落卷）+批次拆分（15 件/批案）+慢道优先级/硬时钟排序+fast_path 失败率阈值告警（>20%→_notify_blocking 转人工·WP4 通知链承） |
| WP5 对账红闸 | verify.py run_verify（L178+） | checks 增 `reconciliation` 红闸项（counts↔readings 差额>0 即红·注入即红锚）——check_plan_baseline 族同构形 |
| WP7 收口自洽 | close_cli.py `derive_run_state`（L47）+summarize_stages（L30）+close_skill.py | run_state 单时点源（manifest 唯一源·close 不自判 stale）+stage_artifact_notes 自指消除（在盘面零 absent 误注=存在性实查形）+evidence 四元组补 hash（sha16 面） |

## §二 · 施工纪律面（统改笔执行形）

- 单笔族=一 commit 载五 WP（revert 一键·第八单姿态）+白盒（test_plan_scope/test_verify/test_close_cli 族随卷扩）+py_compile/ast 双检+河源 sync
- bak 先行（四文件 bak-<ts>）·r1/ns1 存档零触 ✓·D-24/D-46 照承
- 验收锚=任务书 §46 面（annotation 率 100% 零 null/零差额/分支在卷+告警实证/注入即红/单值源+自指消除+hash 全载——五锚逐项对表毕报形）

## §三 · 容量墙检查点定谳（诚实面）

- 本席会话上下文=临近容量墙（r12 劣化窗误录教训在卷——劣化窗施工=判读语义面腐蚀风险）
- 统改笔=判读 fail-closed/对账红闸/close 单值源——**chain verdict 依赖面语义施工**·半容窗强推=腐蚀风险实质
- 定谳：本卷=码位图+设计面实产（读数 pass 毕）·统改落码=候满容窗即施（下窗头位·零候令面——notice-185 施工序延续语义·毕报双通道随笔）

## 使用依据

notice-185①派工令；拆解任务书 §三 WP 面；plan_scope.py/verify.py/close_cli.py/close_skill.py 码面实读（L 面实录）；WP4 毕报姊妹卷（342741af2）。

—— SDE 小布（毕报=落卷+SendMessage 直达值席·卷面时戳=commit %cI）
