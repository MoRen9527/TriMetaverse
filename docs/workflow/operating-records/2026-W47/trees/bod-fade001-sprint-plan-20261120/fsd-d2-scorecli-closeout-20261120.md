# FSD 毕报·D2 令 1 ScoreCLI 机械面施工毕（retry 闸四面铸+门禁五项读数齐）

- **sourceOfTruth**: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- **syncMode**: 落卷即真源（operating-records 树文件）
- **lastSyncedAt**: 2026-11-20T00:01:08Z（date 现查原值粘贴·+8=11-20 08:01）

## 一·交付面（施工位=.fade/fsd-drafts/runtime/cognition/·现役运行树）

| 件 | 面 |
|---|---|
| score_cli.py v2.0.0 | **零改面自证**：engine 回执投影零改（score["score"]=payload 原样）+三态路径分立零改+退出码族零新增（0/2 维持）——**新铸四面**：①extract_internal_score（内部分提取·契约形①直给优先/形②机判+采集两域加和·bool 陷阱拒·非法零崩→None）②load/save_retry_state（run_dir/retry_state.json·当周域键·跨周重置·坏卷零计数起步）③eval_retry_gate（纯函数判读·skip/pass/pending_retry/escalate 四态）④run_score 集成（executed_ok 且内部分可提取才判读·pending_retry 递增落卷·escalate exit 0 零熔断） |
| test_score_cli.py | 26 案全谱（现役 5 案零改+新铸 21 案五族） |

## 二·门禁五项读数（令 §三 全项对表）

1. **白盒全绿+回归零新增+tsc/build 双绿**：score_cli 26/26 ✓·drafts 全树 pytest **115 passed 零新增红** ✓·TriOrchKit 回归 **58/58+tsc rc=0** ✓·py_compile build 面 **RC=0** ✓
2. **顺序锁（CLI 半面）**：落卷即交棒（main 写 score.json 成功才 exit 0 交棒 close·写败 exit 2 零交棒——现役案保留+pending_retry 面 exit 0 交棒分叉判读=close 毕后置位锚）——**全链断言（CLI 未毕→Skill 不启动）=令 2 编排面施工件·如实注非本令 scope**
3. **双分数分立**：键集白名单案铸（CLI 卷零联审域键混挂·cos_score/evolution_score/seven_seat_average/average 四禁键断言零面）——7 席联审均分域=score_skill/aggregate 面（令 2·aggregate 输出零改承）
4. **retry 状态机**：pending_retry 落卷（retry_state.json 递增断言·同 run_dir 重跑 count 1→2 实案）+2 次/当周封顶（RETRY_MAX_PER_WEEK=2 常量钉·跨周重置案）+escalate 呈报面非熔断（escalated:true+**exit 0 零阻断交棒**实案+封顶后零递增）
5. **算术边界**：=90 免 retry（90e06cddd 勘正语义实锚案 test_eq_threshold_passes）+<90 retry（89.999 案）+两域加和形 45+50=90 恰过案——**均分过 95 线含边界（≥95）=联审域断言位=令 2 均分聚合案+D4 COS 综合输入面（score_engine/aggregate 输出零改承·如实注非 CLI scope）**

## 三·边界与如实注

- **施工基线承录**：D1 设计卷 v3-final（定稿承四项对表·本施工零越基线·零设计变更——threshold=90/max=2 常量化钉死·变更走变更令面新段）
- **scope 分立如实注**：①全链顺序锁断言=令 2 编排面 ②95 线均分断言=令 2/D4 面 ③真实 retry 重跑（Skill 尾段 resume）活体=令 3 联调窗——本令交付=CLI 机械面全谱（判读+落卷+state 面+退出码语义）
- **engine_absent 首拍默认态零变**：engine 未部署时 retry 闸零判读零键面（skip 分立·test_engine_absent_zero_retry_face 实锚）
- **令 2 顺序锁承**：CLI 毕（本卷）→Skill 起条件达成·硬串行执行面照令

## 四·使用依据

- CTO D2 排工令 cto-d2-dispatch-20261120.md（16db059a3·§一①§三门禁五项）
- D1 设计卷 v3-final cto-round-programming-design-20261119.md（§一A①§一B①定稿承④·90e06cddd 语义）
- 现役 score_cli.py 骨架（SCORE_VERSION 1.0.0→2.0.0 升版·路径分立三态承）
- 本卷全部读数=实跑非推演（pytest/tsc/py_compile 现查 00:01Z）

---
落卷=FSD 小全（m-fsd）·令 1 毕（08:01+8·deadline 09:00 余 59min）·**next_agent=STE**（白盒案 review 候收稿·令 §五）·令 2 ScoreSkill 承接面候窗按令（时窗足即接·施工期全 mock 零真实 7 席跑）
