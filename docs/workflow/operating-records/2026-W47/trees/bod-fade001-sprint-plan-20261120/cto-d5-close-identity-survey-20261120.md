# CTO D5 写面勘面卷（close 恒等式接线·closeCLI+closeskill 接口+retry 分叉码面·WO-D5-20261120 §四款 1 勘面令兑现）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-d5-close-identity-survey-20261120.md·勘面正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令面受理: WO-D5-20261120 统排令（50d3e4b13·台账 710·§二勘面缺位判 D4 形同构·施工硬前置门）承
- 勘定基线: TC sg 顶 6e02d64（=D4 交付顶·FETCH_HEAD 祖先链验真）——现役 close/score 族活体直读非转抄

## §〇 · 现役件面承录（勘面基座·D5 施工=新铸件形零触碰正身）

| 现役件 | 面 | D5 处置 |
|---|---|---|
| close_cli.py（159 行） | CLI 段收口：summarize_stages/derive_run_state/assert_close_contract/run_manifest 四件签名+manifest 落卷 | **零改形**——接口面已存在承录正形 |
| close_skill.py（287 行·CLOSE_VERSION 1.1.0） | close.json 写面归属（L274）+run_close 结构门+run_state 单值源+evidence 五元组 | **零改形**——两态等价性现役已天然成立（§二） |
| score_cli.py/score_engine.py | score 段评分件族（并盘 100 制·采集 31 域+主观判卷 10 域） | **零触碰**——retry 只读其产物 |
| test_close_cli.py（181 行） | close_cli 白盒 | **零改**——D5 新案=新测试文件域 |

COO 令「接口签名未定谳」语境勘正如实注：D1 设计卷零 close 段本体专段=设计语缺位·非现役零接口——现役接口面已存在且运行在役（WP7 收口自洽形·2026-11-18 施工）——本勘面=现役面承录+接线定谳（零「为现役件定新签名」面）。

## §一 · 范围① closeCLI 接口定谳

1. **接口签名=现役四件照守零改**：summarize_stages(run_dir)->dict（七段产物 verdict 汇总）/derive_run_state(stages)->str（stale/failed/ok 三态）/assert_close_contract(run_dir, manifest_time)->dict（notice-208 断言族）/run_manifest(args)->(int, dict)（终态 manifest）——D5 零改形零新签名；
2. **自检总结卷=close.json 现役 WP7 schema 13 键承录**：close_version/run_id/from_week/to_week/upgrade_list_state/upgrade_list/stage_artifact_notes/evidence（五元组含 sha256_16 hash）/run_state/run_state_source/notify_target/verdict（门前置占位+门拦翻 fail）/check_time——D5 零改零扩键（retry 面=独立 retry_flag.json 小卷非 close.json 扩展·防现役 schema 漂移）；
3. **产物读取面=score 段产物卷 score.json "score" 键**（并盘 100 总分——采集域 A/F/H=31 分+主观域 I=10 分判卷面·score_engine v2.0.0 并盘 100 形）——retry 判据「内部分<90」读取面实锚；
4. **现役面如实注（非债非阻塞·零趁 D5 改）**：close.json 落卷=write_text 直写非原子（对照 D4 §一.4.2 原子写定谳=潜在半卷面——现役件零触碰域·候勘定窗候选件不阻 D5）。

## §二 · 范围② closeskill 两态等价性恒等式定谳（本勘面核心）

**CEO 意见⑤本义（notice-210 正形·COO 令转引承录）**：「有无联审收口都是对 fade-001 自检与总结·七席联审=进化面与收口两义分立」。

**技术定谳：两态等价性承载形=close_skill 本体零联审分支·等价由「close 段输入面同一性」结构性承载**：

1. **输入面同一性**：close（收口面）输入=段产物卷族（plan/verify/score/manifest 等 _STAGE_ARTIFACTS+run_state 单值源 manifest.json）——**与联审有无零关**：联审产出（七席评审卷族）走进化面判决链（joint_review_trigger→评审卷→cos-score.json→D3/D4 门族）·**不入 close 段输入**；
2. **两态等价自动成立**：有联审轮=联审毕→close 照跑；无联审轮（§八 prod 直走形·Skill 尾零 spawn）=跳联审→close 照跑——close.json schema/结构门 _structure_gate/run_state 单值源两态完全同一（close 侧零联审感知=零感知即零分叉·等价性结构性成立非约定成立）；
3. **联审产出收口面承载=零**：两义分立定谳落地——联审（进化面）产出归判决链·close（收口面）零消费联审产物·零「联审版 close」变体面；
4. **§八 prod 直走形衔接=零感知衔接**：Skill 联审尾跳过对 close 输入面零影响——close 照跑零分支零特判；
5. **施工承载形=零新铸运行时件·白盒锚案族承载**：现役 close_skill 已天然满足恒等式（无联审分支=现役实况实证）——D5 范围②施工面=新测试文件两案族（①close 输入面与联审产物零耦合断言案②prod 直走 close 照跑两态同一案）——零改形零新铸=零触碰零风险；
6. **近形消歧承录**：close_skill（收口件）≠score_skill（score 段评分件族·D2 骨架迁 TC 候窗注在案）——D5 施工零涉 score_skill 迁移面；score.json "score"（轮内自评分总分）≠cos-score.json internal_score（COS 进化判决卷引用面）——两卷两义分立各归各链。

## §三 · 范围③ retry 分叉码面接线定谳（机制四件定稿承④照守零改）

1. **内部分读取面**=score.json "score" 键（§一.3 实锚·缺卷/非数值/缺席键=skip 面不判·保守语义同门族）；
2. **分叉实现位=新铸 close_retry_gate.py**（close 毕后置调用·close_cli 本体零改·零段间新链形承 §一B① 衔接位定谳）：

```python
def check_retry_fork(run_dir, threshold: int = 90) -> dict:
    # 读 score.json "score"+close.json verdict → 内部分<threshold 判定
    # 出口二值: "retry"（落 retry_flag.json+resume 指令拟稿）| "skip"（免 retry）
    # never raises 门族同构承（异常保守返 dict·D3/D4 先例形）
```

3. **retry_flag.json schema 定谳**：{retry_flag: "pending-retry", retry_count: <int 当周计数>, internal_score: <读数>, threshold: 90, run_id, from_week, to_week, escalated: <bool>, flagged_at: <UTC ISO8601>}——原子写（tmp+os.replace·D4 定谳同形·零重蹈 write_text 直写注）；
4. **次数上限语义**：retry_count=当周 state 面读+落卷自持——<90 首遇=retry_flag 落卷+resume 拟稿；两 retry 后仍<90=retry_flag.json 落卷（escalated=true）+notify 值席（never-raises·_escalate_notify 同构承 TRICO_RULING_ESCALATE_TO 单值面）——**如实呈报非熔断**（零停工零 job 停用·escalate 呈报面承 §一B① 定谳）；
5. **边界语义**：90=免 retry（<90 判据·90/≤90 边界勘正 90e06cddd 承——白盒边界案钉）；
6. **resume 复用面=§六A 现役承**：chain_runner --resume-stage N（段 N 前置真值断言复用·同 run_dir 断点续段·重跑指令=点火指令族）——retry=从 score 段号起重跑至 close（CLI 段产物零重跑·迁移本体已交付语义承）——**零新 resume 机制·现役面照用**——新铸件只产 resume 指令拟稿（消费位=loop 体/round_runner 域·零改 chain_runner 本体）。

## §四 · 范围④ 白盒对表锚定

- **新案族**（新测试文件域·现役 test_close_cli 零改）：retry 分叉白盒——≥90 免 retry 案/<90 落 flag 案/**边界 90=免案钉（90e06cddd 承）**/两 retry 上限 escalated 落卷案/resume 指令拟稿案/score.json 缺席 skip 面案/非数值 skip 案/never raises 奇异输入族案/原子写断言案（tmp+replace+零残件）；
- **两态等价性锚**（§二.5）：close 输入面与联审产物零耦合断言案+prod 直走 close 照跑两态同一案（新测试文件域）；
- **既有锚照承**：D3 28+D4 19=47 合并跑绿+骨架镜像回归锚零漂移+全树 432 基线对表零新增红零消失红（D4 门同形）；
- **铁律域承录**：close_cli/close_skill/test_close_cli/score_cli/score_engine 五件现役零触碰——铁律域清单较 D4 扩（close/score 族两件入列）；
- **镜像面注**：close_retry_gate 全 stdlib 零 TC 依赖=可入 drafts 镜像（D4 write 先例形·施工面自勘定）。

## §五 · 窗位注记（归 COO 统排·本卷零自判）

勘面毕=施工硬前置兑现——双形判读归 COO（形 A 今晚=勘面毕∧CFO 现读数<75%·判形照 D4 先例 CFO 一行现读数复核禁估读/形 B 候明晨 CFO 切换实锚）——本卷零自判窗位（D-76 C 层承）。

## §六 · 使用依据

WO-D5-20261120 统排令（50d3e4b13·§一现势勘定+§四款 1 勘面范围）；cto-round-programming-design-20261119（§一A① 并盘 100/§一B① retry 四件+90e06cddd 边界/§六A resume-stage/§八 prod 直走）；close_cli.py/close_skill.py/score_engine.py/score_cli.py 活体直读（TC 6e02d64·close/score 族现役实况）；plan-list.md D5 行 L56+D 线卷首意见⑤；D4 验收链四卷（勘面/施工/review/终审·同构形基准）；D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T12:38:38Z（+8=2026-11-20 20:38:38·date 现查原值·D-47 正形）
