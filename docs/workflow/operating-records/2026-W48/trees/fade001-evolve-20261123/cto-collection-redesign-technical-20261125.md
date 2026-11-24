# CTO 技术形正身·collection-score 重设计（engine 直读三分离·2026-11-25 01:5x·CEO 令）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-collection-redesign-technical-20261125.md·技术形正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 产品形正身: CPO 399b9a6e4 + 5280173e6（采集件 schema/采集 prompt/协同/产品判据四件·被引不复制）
- 承接: CEO 令「AFH 三件分离了·这个 collection-score.json 就该废掉不用·重新设计」（BOD 转 01:48）+今日两实锚（resume21 漏合→manual·resume20 合成 run_id 不匹配→manual）

## §一 · 方案裁=a（engine 直读三分离）

`_judge_collection`（score_engine.py L307-333）改：**读 collection-A.json/collection-F.json/collection-H.json 三件→逐件 run_id 校验→合并 entries**——**消除中间件合成步骤**（人手步骤=今日两坑之根）。三席各写自己的件（无并发冲突）。

## §二 · 采集件 schema（产品形 CPO 定·技术面确认）

`{schema_version, family_id(A|F|H), run_id, producer_seat, entries:[{item_id, verdict(pass|fail|na), rationale(非空), evidence_ref(必填)}], check_time}`
**技术落法（na）**：`verdict==na → weight`（同 pass）——**语义由 rubric special_clause 承**（比「免评分母规则」表述更精确·CPO 确认按此）；rationale 非空+evidence_ref 必填（engine 校验 `(run_dir/ev).exists()`·禁裸判/假锚）。

## §三 · 双读兼容（历史冻结）

engine **先找三件→缺则回退单文件 collection-score.json**（旧 resume20 的 100 分不动·历史回读不变）；**新轮只写三件**（resume22+）。

## §四 · auto fallback（逐件兜底·不连坐）

T+10min 采集窗过、某席未写→**auto 按 run_dir 段产物生成该席件**（producer=auto 归因；**evidence_ref 指 run_dir 内真实段产物路径**·engine `exists()` 校验——堵 auto 代采假锚）。缺件=仅该族 manual（归因到席·**不连坐**）。

## §五 · 验收四判据（技术面逐条·CPO 同意）

①任一族件缺只该族 manual（不连坐）②逐件 run_id 校验 ③双消费方（engine+joint_review_trigger）读数一致 ④历史轮回读不变。

## §六 · 工时与施工面

engine `_judge_collection` 改（读三+na 分支+auto 适配·~1h）+采集 prompt 三席（~30min）+测试（~30min）= **~2h**。施工面：score_engine.py/prompt 常量/测试；**风险=engine 核心评分面**（测试须覆盖三件缺/单件缺/na/双读四态）。

## §七 · 使用依据

CEO 令（BOD 转 01:48）+CPO 产品形（399b9a6e4/5280173e6）+CTO 实读（score_engine L307-333/L350-370 今日两轮）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-25T01:50:02Z（+0800）〔commit 时戳锚·D-47 正形〕
