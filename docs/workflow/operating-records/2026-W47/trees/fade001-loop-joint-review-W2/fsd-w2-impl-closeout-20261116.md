# FSD W2 评分面正位施工毕报卷（触发段/回收段/召集契约面三件+payload 接线）

- sourceOfTruth: 本卷（trees/fade001-loop-joint-review-W2/·W2 毕报正身；快轨正身=毕报信）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-16T04:28:00Z（+8=2026-11-16 12:28:00·date 现查原值粘贴）
- 法源链: COO 派工触发令（msg 6cf048fa·12:03:32）→W1 架构卷 a97d76af7 §二/§三/§四/§五→排工单 v2 dc8ce2231 护栏四族→基线锚卷 1ff86cee3（护栏②先行毕）
- 施工锚: **TC 65d4ee1**（三件施工+两测+契约面·5 files +1040）+ **R-HY jobs.json PATCH 换形**（payload md5 4e1c7df5→52c54a8d·bak 回滚锚在位）

## §〇 · 实现方案（W1 契约对表）

三段解耦接线（非推翻现役评分面·score_engine/close_cli 零改动）：

| 段 | 新件 | 正形 |
|---|---|---|
| 触发段 | `runtime/cognition/joint_review_trigger.py` | close_cli 后接缝（管线内同步·r88 异步形废止）：manifest run_state=ok→joint-review-trigger.json（§二最小字段形：loop_run_id/run_dir/dim_a 三卷指针+sha16 锚/dim_b 四类指针（counts/ar/unresolved_diff/ops_commit）/三域分现/分数线=null 留参/mode 注记（preflight week_math.mode 如实读）/trigger_time）+run_dir 树面双落（归属周 ISO 自动算）+notify best-effort（send_notification 同族·永不拦）；run_state!=ok→skip 面 fail-closed（W1§四.2） |
| 召集段 | `docs/workflow/joint-review-convene-contract.md` | 契约/操作对表面：拾取→七席逐席派工（M-004 SendMessage 直达）→评分卷落树契约（`joint-review-<SEAT>-dimA/dimB-score.json`+improvement 卷·schema 要点全载）→挂起补召序——**编排动作面归 m-duty-cos 会话面**（机械面零造伪会话） |
| 回收段 | `runtime/cognition/joint_review_recycle.py` | 读七席卷→schema fail-closed（失配拒收零强判·不计 quorum·W1§四.3）→quorum 闸（≥5/7）→三域直加总分（机判实分+dimB 席均 pass weight 和+dimA 席均·v2.0.0 并盘 100 形对形）→分数线判定→**verdict 六态分叉指令面**（loop_next/converge/escalate_ruling/pending_quorum/pending_threshold/contract_mismatch）——**机械面禁自判（r101）·零 POST 零 touch·动作全归控制面按指令面拾取** |

## §一 · 代码变更（TC 65d4ee1）

1. `joint_review_trigger.py`（218 行）：契约产出纯函数面（build_trigger/write_trigger 分立）+skip fail-closed+双落 best-effort+notify 降级链（token/收件谱缺失=render_only 语义）。
2. `test_joint_review_trigger.py`（11 案）：契约最小字段形钉案/材料指针 sha16 锚/三域分现（机判求和+pending 非冒充）/mode 注记/skip 不产 trigger 卷契约钉案/树面 ISO 周双落。
3. `joint_review_recycle.py`（268 行）：dimA/dimB schema 校验分立/卷池回收三面（valid/absent/mismatch）/六态判定纯函数/落卷双面（run_dir+tree-file）。
4. `test_joint_review_recycle.py`（10 案）：六态全谱钉案/schema 正反案/三域席均计算/quorum 闸先于分数判定序/挂起态 exit 0 解耦语义。
5. `joint-review-convene-contract.md`：§一三段定位/§二触发件契约 JSON 形/§三召集操作序/§四评分卷 schema 契约/§五 verdict 动作对表/§六参数现势。

## §二 · 部署与接线（R-HY 面全链实锚）

1. **TC 检出同步**：fetch+ff-only→65d4ee1 零冲突；活体 smoke=import OK（v1.0.0/v1.0.0）+单测 21/21 OK（河源真跑）。
2. **payload 接线（PATCH 正形通道）**：`PATCH /internal/v1/cron/jobs/9c81c7ec-…`（job id 实值·X-Internal-Token=daemon environ 读入·值面零回显 D-46）——notify_done 行后插触发段行（`|| true && \` 链式·触发段败不阻 arrival）。
   - **md5 基准实锚**：old=**4e1c7df5c78e083a77a0be7f2a371672**（与 A 族考卷判据基准逐字同——实锤基准对象=command 字符串）→new=**52c54a8d16ac78828706287b6ee361fc**（25→26 行）
   - 读回验证：wired=True+trig line=1+**daemon 内存态 GET 读出面**（进程内生效证据·非仅 store 文件面）+enabled/schedule 保持（50 23 * * 0·今晚真实周日拍不受扰）+healthz ok=True/cron enabled=True
   - 回滚锚：`jobs.json.bak-w2-trigger-20261116T044xZ`（护栏②·PATCH 前先行）
3. **端到端 dry 双验（/tmp 假面·零污染现役 run_dir）**：触发段对现役 ok run（shift-WW46-20261116T002143Z 复制面）产出契约件全绿（mode=loop-window 现役读出·三域分现 machine=37/duty=3 entries/subjective=3 entries·树面双落）；recycle 两席假卷判 pending_quorum（quorum 闸先于分数判定·判定序正形）——dry 面已清讫。

## §三 · 自测结果（门禁三连+活体双验）

| 门 | 读数 |
|---|---|
| 新件白盒 | 21/21 OK（本机） |
| cognition 全量回归 | 261 OK（240 基线+21 新·数学闭合） |
| validation 族 | 438/5/1 基线零漂（五案预存家族·逐字同基线） |
| 河源活体 | import+21/21 OK；PATCH 读回值面三查全绿；dry 双验全绿 |

## §四 · 换形注记（A 族考卷判据面随动·值席知会）

collection 考卷 A 族判据 special_clause 基准换形（先例机制遵行·禁无注改防判据错配假红）：
- 旧基准 4e1c7df5c78e083a77a0be7f2a371672（十阶段形·二十五行）**失效**；新基准 **52c54a8d16ac78828706287b6ee361fc**（十阶段+联审触发段形·二十六行·触发段行 `|| true` 不阻链语义）
- 判据词面建议：值席下轮采集卷按新 md5 对表「trigger 段行在位（joint_review_trigger+|| true 不阻链）+十阶段主体零漂」双断言；换形注②先例（COS 562 笔）机制沿同形
- 【两口径区分注·CTO 验收观察项②遵行 2026-11-16T04:39:12Z】本卷载 md5=**deploy payload command 串口径**（52c54a8d16ac78828706287b6ee361fc·A 族考卷判据基准同口径）；**jobs.json 文件本体 md5sum=另一口径**（CTO 直录 e6e09b58/384943bb 两值面）——两口径禁互代对表（考卷判据=command 串口径）
- 下次真实周日迁移拍=**2026-11-22（周日）23:50**=新 payload 首跑+联审触发真实首窗——run_state=ok 则触发段将发起联审（cron-sunday mode 注记·值席按 §三操作序处置）——此为 W1 架构行为（联审与常规轮解耦另一半）非异常
- 【勘正留痕 2026-11-16T04:32:50Z·COO 时点勘正①认领】本段原文「今晚 23:50 真实周日迁移拍」系**推算嵌值**（旧知情项未 re-date 直引·date 现查 2026-11-16=Monday·schedule 50 23 * * 0 周日门——今晚 23:50 零周拍零联审·值席面预期已由 COO 同步 COS 防空候误报）——幻觉时点家族正文载体面新案自领·勘废换正如上

## §五 · 技术债务标记（识别即标记）

1. **recycle 判定消费位未接线**（verdict 六态产出后控制面=值席拾取执行——值席侧巡检/拾取自动化候窗：现役首期由值席按契约面 §五手动拾取·标注非缺陷系架构定谳「机械面禁自判」的正确形态）。
2. **分数线 null 挂起态**：毕验收窗裁前 recycle 对完整卷池判 pending_threshold（正确挂起·非故障）——裁后带值回收即闭环。
3. **mismatch 席补召面**：单席失配拒收后值席补召序候编排细化（契约面 §三.4 留口）。
4. dry 面脚本 `.fade/w2-patch-wire.py`（本地 TC 仓）=一次性施工件·候清理窗归档。
5. 【B/C 22 分缺口勘清·CTO 验收观察项①数据面 2026-11-16T04:39:12Z 轻勘】第 10 轮 score.json 两族 reasons 实锚——**C 族（run id·13 分）=真 bug**：现役 run_id=`shift-WW46-…`（payload 模板 `shift-W{fromWeek}`+{fromWeek} 值自带 W 前缀展开成双 W）vs T1-1 判据正则 `_RUN_ID_RE=^shift-W\d+-…`（单 W 形）错配→恒 fail；修向两支候 CTO 裁：A=修 payload 模板（`shift-W{fromWeek}`→`shift-{fromWeek}`·run_id 形归一·下游判据/collection_cmd grep 全兼容·代价=md5 三换形）B=修判据正则迁就双 W 形（脏形固化·不推荐）。**B 族（拍点形态·9 分）=loop 轮判据缺位（非 bug）**：B 族窗判 [23:50,23:59] 面向真实周日拍验证·loop 进化轮白天拍生来窗外（码注「预演白天拍如实出红零豁免」设计原意）——22 缺口=13（bug 可修清）+9（rubric 判据 loop 场景形增补候裁·STE/CTO 域协作）。与 CTO bracket 分析吻合（稳态 fail 上界 78/勘修复态 100·70 居中）。修件窗候排·不阻塞召集段首轮拾取（CTO 定谳）。

## §六 · 使用依据

- W1 架构卷 a97d76af7（§二契约/§三循环控制 r101/§四降级三支路/§五施工接口）+排工单 v2 dc8ce2231+台账 676 ddbff5893（三参数定谳：轮 3/quorum 5/分数线留参）
- 基线锚卷 1ff86cee3（管线 25 行/评分三卷值面/通道定谳/payload md5 联动坑位）
- 河源活体四轮勘（jobs.json/jobs PATCH handler 语义 routes.ts/CronJobPatch 类型面 agent-core/dist/TRIRMC_INTERNAL_TOKEN 键位 app.ts）
- 记忆锚族：机械面禁自判（r101）/两基准禁互判/D-46 值面零回显/cron-job-state-hygiene/嵌套转义坑族（b64 通道正形偿还）

—— FSD 小全（m-fsd）·2026-11-16T04:28:00Z（+8=2026-11-16 12:28:00·date 现查原值·D-47 正形）
