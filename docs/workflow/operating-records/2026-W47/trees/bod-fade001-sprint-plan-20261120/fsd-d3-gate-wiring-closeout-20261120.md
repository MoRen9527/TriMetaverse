# FSD 毕报·D3 进化判据接线（TC 9b96ea3·层 2 COS 判决门+层 3 生产探针·preflight 现役件零触碰）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T11:14:35Z（date 现查粘贴·+8=11-20 19:14·D-47 正形）
- 令面: COO 统排派工单 WO-C4D3-UNIFIED-20261120（239d915e8·18:47 达·§二 D3 接线窗四条）+BOD 一行短催（18:58·进度回执 8e552bf3 已发）
- 交付锚: **TriCompany dev 9b96ea3**（a0b5915..9b96ea3·5 files +719/-0·sg 通道 push 达仓·ls-remote 顶==local 9b96ea36716b 全等 ✓）
- **next_agent=STE**（毕报承带→STE review（D2 先例同构）→CTO 终审 APPROVE→D3 划项）

## 一·开工前置勘定（COO 令③四前置件对表·零编造 readiness）

1. **四前置件全批立在卷·零缺件**（notice-230 款二批立+notice-231 勘正维持·承载=cto-round-programming-design §一A/§一B/§一C+notice-238 D1 定稿承记）：①分制基准=并盘 100 制唯一挂（§一A）②95 线定谳件=§一B②七席联审均分形（230 款二②主观否决制**撤销**承录在卷·判读位=COS 综合评估输入面·§一C）③prod→test 判据立（§一A）④转化漏斗+FUSE 计数域（§一A·state.count[test]/[prod] 两计数独立）。
2. **§一C 程序面=层 2 真值源契约同形**：cos-score.json 扩展形（eviction_decision: evolve|hold+rationale+双分数引用）——与裁卷 §二 层 2 定谳全符 ✓。
3. **施工基线勘定**：sg 通道 fetch 达（FETCH_HEAD=a0b5915 sg 顶）——gate 现役三笔（2fd7053/8e7e4f0/a1488a9）+ns4 两拍后续勘修（ad31c11 空壳排除/708cb69 完整轮语义精化·**晚于裁卷勘定时点·层 2 仿形基准取最新形**）全在链 ✓——worktree 形施工（`tc-d3-wt-20261120` @ a0b5915 detached·本机检出 c7ca148 分叉面零触·段⑤先例同构）。
4. **近形消歧**：cos_decision_audit.py（TC 现役·LG-074 两 COS 裁决合规审计件）与层 2 check_cos_decision 零涉零冲突——勘毕入卷。

## 二·实现方案（三层结构+校准五件照裁卷 §二零复写）

- **层 2·COS 进化判决门**=`cos_decision_gate.py` 新件：`check_cos_decision(runs_root, now_ts=None) -> dict`——check_ceo_ruling 同构仿形（真值源=prev run_dir/cos-score.json·eviction_decision evolve|hold 二值域）。四态值域：skip（runs_root 缺/目录缺/无已跑轮·向后兼容同款）/awaiting-decision（卷缺席·>72h escalated 升级催办 never-raises）/evolve（ok=True 迭代放行）/hold（ok=False 判止·**非 job 停用语义**——权属分立 §一C：COS=本轮进不进·CEO=态切不切）。保守拦全同构承（坏卷/坏值→awaiting-decision）。prev 候选解析=F2 空壳排除（pf size>0）+F3 完整轮语义（close.json 在）+pf mtime 最新——**取 ns4 两拍勘修后最新形**。72h 阈值显式承 `preflight._ESCALATE_AFTER_H`（import 单值源零复制防漂移）·升级收件面承 TRICO_RULING_ESCALATE_TO 同款 env 零新键。
- **层 2 互补探针**=`cos_decision_probe.py` 新件：ceo_ruling_probe.py 同构（判决落卷知会+.done 防重幂等+判定单值源=check_cos_decision+never raises）。
- **层 3·生产探针**=`gate_probe_production.py` 新件：`production_gate_probe(...) -> str`——校准② B 签名保持 str 注入形（31 案白盒零改动）·适配件内做双门 dict→str 投影·审计面（detail/age/escalated）→stderr log 零混 stdout。AND 门投影（§一C.135 debug 支双事件门·**合成规则=施工选定形候 CTO 终审**）：判止优先（terminated/hold→terminate）>挂起（awaiting-*/任一门崩→absent）>双 skip→absent（校准①映射表承·首轮面=round_runner 开轮令域非本门域·如实注）>skip 中性门+他门有效态→他门决定>continue∧evolve→continue（余态保守 absent）。
- **Skill 本体零改动实证**：score_skill.py 零触（run_review 签名/GATE_STATES/verdict 族/31 案白盒全零动）——接线=调用方传 production_gate_probe（集成锚案证）。
- **AND 消费位勘定**（裁卷「与层 1 AND 门并读」落位）：AND 在层 3 探针投影面+round_runner while 体（§一C.135）——**preflight.py 现役件零触碰**（层 2 独立新件零集成——sg 现役周迁移链零行为变·零活体 daemon 触面=COO 令护栏 §六.1 兑现）。

## 三·代码变更清单

| 件 | 面 |
|---|---|
| runtime/cognition/cos_decision_gate.py | 新件·层 2 判决门（check_cos_decision+_escalate_notify·直跑探针入口） |
| runtime/cognition/test_cos_decision_gate.py | 新件·白盒 14 案（镜像十案族+F2/F3 排除钉+键缺保守拦+never raises 异常面族） |
| runtime/cognition/cos_decision_probe.py | 新件·落卷知会探针（.done 防重同款） |
| runtime/cognition/gate_probe_production.py | 新件·层 3 生产探针（AND 投影+审计 stderr+延迟 import 零注入分支走） |
| runtime/cognition/test_gate_probe_production.py | 新件·白盒 14 案（投影映射族 10+崩 fail-closed 3+审计 log 面 1） |

骨架树镜像面（TMV/.fade/fsd-drafts/runtime/cognition/·gitignore 非本笔交付锚·部署窗随 score_skill 迁 TC）：gate_probe_production.py+test_gate_probe_production.py 镜像两件+test_gate_probe_integration.py 集成锚案新件（production_gate_probe×run_review 三分支全链·三案）。

## 四·自测结果（门禁读数全项·全实跑非推演）

1. **层 2 白盒**：14/14 绿（skip 二案/awaiting 二案含 72h escalated/evolve/hold 二值域/坏值·坏卷保守拦/mtime 最新/本轮空壳自然排除/F2 空壳排除钉/F3 残拍排除钉/键缺保守拦/never raises 奇异输入族）。
2. **层 3 白盒**：14/14 绿（AND 投影族 10+双门崩 fail-closed 2+恒返 str 契约 1+审计 stderr 面 1）——**施工中红即停自纠一笔如实注**：首形把 awaiting-*（ok=False 挂起态）与 skip（ok=True 中性态）并入同分支致单门挂起误放行（2 failures）——修正=挂起族与中性族拆分（判止>挂起>skip 中性>放行）后 14/14 绿。
3. **preflight 现役族零触碰实证**：48/50（2 errors=检出基线预存面·详见债单①·非本笔引入）。
4. **全树基线对表**：纯检出（新件暂离）vs 含新件=**3 failures+9 errors 逐数全等**（两轮一字不差·零新增红零消失红）+新案 28 全绿——零干扰实证。既有红 12 案归因：SpawnGlmEnvTest 7+PatchRunnerEndToEnd 1（GLM env/settings 依赖·本机无 token 环境面）+loop_convene_auto 3（本机环境面）+preflight RunPreflightExitCodesTest 2（fixture 不同步面·债单①）。
5. **骨架 31 案回归锚零漂移**：骨架树 48/48 绿（31 骨架锚+14 镜像投影族+3 集成锚·0.45s）——集成锚证 gate 三态在 run_review 全链走通（continue→pass+均分 95.0 exit/absent→挂起零均分/terminate→中止零均分）。
6. **零活体触自证**：全变更=worktree 文件面+push——preflight.py/test_preflight.py/weekly_plane_shift.py 现役件零触碰（git show 9b96ea3 五 create mode 全新文件实证）·零进程触零 daemon 触。

## 五·校准五件逐项对表（裁卷 §二）

| 校准件 | 兑现面 |
|---|---|
| ①值域命名 | gate state 统一 A 四值（skip/awaiting-*/有效态）·Skill verdict B 族保留零触——映射表 awaiting-*/skip→absent 承（投影案钉） |
| ②返回形 | B str 注入形签名零触（31 案零改动）·dict→str 投影在适配件·detail/age/escalated→stderr 审计 log |
| ③72h 升级面 | 层 1/层 2 自带同构承（层 2 本笔落）——**层 3 席位等待门超时候升级语义细勘落卷**：层 3 等待窗=spawn 七席编排面·现骨架 spawn_fn 同步即时形（mock/真 spawn 零长挂等待）→等待超时候升级语义承轮级 gate（层 1/2 awaiting 72h 面·外层 round_runner 轮计时域）——层 3 自身零独立 72h 计时器；若生产并发编排引入真异步席位长跑→等待超时→escalated 呈报值席+verdict=fail（零造替身分铁律）=**生产并发编排候窗项**（D2 骨架形边界承录·非本窗码面） |
| ④幂等/防重 | 层 2 probe .done 同款落（cos_decision_probe）·层 3 verdict 落卷即幂等锚（骨架承零新增） |
| ⑤never raises | 层 2 探测面全异常保守返 dict（白盒奇异输入族钉）·层 3 恒返 str（崩→absent·白盒钉）·probe 知会面零炸 tick |

## 六·技术债务标记

1. **preflight test fixture 预存不同步面（检出基线·升 CTO）**：run_preflight L464 消费 `args.prev_runs_root`（轮间门接线面）已落而 test_preflight make_args fixture 未跟上——RunPreflightExitCodesTest 两案 AttributeError（本机实证·sg 承录 9 errors 全预存数吻合）——非本笔引入非本窗修（现役件零触碰铁律）·候 CTO 勘定窗随勘。
2. **AND 投影合成规则=施工选定形**：裁卷 §二只定「AND 门并读」未逐字定合成规则——本笔落判止>挂起>skip 中性>放行（白盒钉·§二.5+§五如实注）——候 CTO 终审定谳（若裁变=投影段单点改·白盒映射族随勘）。
3. **cos-score.json 键名=施工选定形**：§一C 只定语义（eviction_decision+rationale+双分数引用）——具体键名 joint_review_avg_score/fade001_internal_score/decided_at 为施工选定·候 CTO 终审（COS 判决卷落卷形=D4 域·两域对表锚）。
4. **层 3 生产并发编排候窗**：spawn 并发形+席位长跑等待超时候升级=生产编排窗域（§五③注）——骨架同步形零阻。
5. **worktree 收尾**：tc-d3-wt-20261120（毕报落树后 remove·段⑤先例同构）。
6. **骨架部署项维持**：score_skill.py+test_score_skill.py 迁 TC=收口窗部署项①（裁卷 §四.2）+check_seq_lock 双定义勘去重（部署窗前置·先基线绿后勘）——本笔镜像面已备齐随迁件。

## 七·使用依据

- COO 统排派工单 WO-C4D3-UNIFIED-20261120（§二 D3 四条+§六护栏）+BOD 一行短催（18:58）
- cto-gate-interface-ruling-20261120（§二三层结构+校准五件+§三 FREEZE 解除+§四骨架落位）
- cto-round-programming-design-20261119（§一A 四前置件定谳+§一B②95 线勘正+§一C 判决机制改形+notice-238 定稿承记）
- plan-list.md D3 行（批 2 ③窗双条件：勘毕 ✓+批 1 重启窗 462f42a6a ✓=解冻已兑）
- 仿形基准实读：preflight.py check_ceo_ruling（含 ad31c11/708cb69 勘修后最新形）+test_preflight.py CeoRulingGateTest/CeoRulingGateEmptyShellTest/CeoRulingGatePartialRunTest+ceo_ruling_probe.py
- 本卷读数=实跑非推演（unittest/pytest 全量五门+push ls-remote 双证·现查 11:14:35Z）

---
落卷=FSD 小全（m-fsd）·D3 接线毕（19:14+8）·**next_agent=STE**（STE review→CTO 终审 APPROVE→划项）·零活体触维持（preflight 现役件零触碰·sg 周迁移链零行为变）·GLM 止损线在役承（施工省用零子代理直跑）
