# SDE B7 N1/N2 装配读数卷（WO-B7-NS8 承·N1 五项对表+N2 六裁点读数·候 CTO 门禁裁）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/sde-n1n2-assembly-readings-20261120.md·N1/N2 装配读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COO WO-B7-NS8-20261120（4837052995·notice-221 起跑授权）+CTO N1/N2 门禁判据面（779c99aa0·五项对表缺一退回+六裁点）
- 判定: **N1 五项=全绿（§一逐项实锚）·N2 六裁点=三绿三如实注（§二·注面=round_runner 码面候铸域——D1 定稿承录在·施工拆面 S1-S5 候 COO 排承录）·环境读数与事故如实（§三/§四）**

## §零 · 勘定路径与方法面（读数可复现锚）

- 对象面在 heyuan（R-HY）——本机 TriCompany 检出实勘零 3bdae1f/0703bed（推 bare+heyuan sync 形·与 B6 卷「本机不可直连 heyuan」承录一致）——走既定 ssh 跳板通道（M-SG-47.245.122.61 → R-HY-8.155.54.79·TriMMC/TriRMC 造件先例通道）·sg 面零触现役资产仅转发过路。
- 活体读数四道：①dsh headless 组合 dump（`/srv/fleet/dsh/node_modules/.bin/dsh --profile headless --dump-config`·RC=0·323240B 落 /tmp/dump-headless-n1.yaml）②TC 码面实读（/srv/fleet/TriCompany/runtime/cognition/·HEAD=2786b0e）③TriRMC 在役活体（unit/journal/端口/HTTP）④TriRMC cron jobs HTTP API 清单（X-Internal-Token 远端变量读入零回显）。

## §一 · N1 基线装配断言五项（CTO 判据卷 §一 逐项对表）

1. **零重立零改基声明 ✓**：基线真源引用=`notice196入账卷-两条机制根修-WP9v3增量登记-20261118.md`（fade001-tenstage-deploy-20261115 树·原名在卷）——本卷=纯装配值面断言·零基线变更零重立（基线两裁+策一精确化原文照承·施工四要点①-④对表见 §一.3/§一.4）。
2. **preset 组合闭合态 ✓（活体三实锚）**：
   - dump 活体 RC=0 323240B——**14/14 声明行在 dump 值面**（preset-r-duty-{cos,coo,cto,cao,cpo,cfo,cmo,cho,cso,fsd,rdt,ste,sde,pm} 全清单 grep 实锚）；
   - **`waiting for service` 全 dump 零命中**（vs CTO 深勘卷 11-18 实锚「14 entries pending」——同 grep 基准下 pending 14→0=激活终态对照实锤）；
   - preset-r-duty-cos 全段抽验=config 值面完整 resolve（id/name/description/plugins/tool 族全展）=**激活态值面非仅 entries 计数**（判据原文对表 ✓）；
   - **七席映射闭合 ✓**：loop_convene.py `SEATS = ("COS","COO","CAO","CPO","CTO","CHO","CFO")` 七席各自命中 14 清单（7∈14·零缺位）；
   - overlay 本体在位：/home/fleet/.dsh/patches/headless-agentpresets-overlay.yml（36 行·agent-preset-registry 提供行 insert+修 D-2 三行族·**SDE 前手主刀落位件**）+bak-fixd2-20261119 回置锚在位。
3. **程序化增量·三 Skill 段 ✓+一注**：score 段=score_skill_spawn.py 在位（6ceffa6 件① Score CLI→Skill 硬序 spawn 段·spawn COS/COO 两席评主观分+score-skill.json 2.0.0-ns6 组装）·close 段=close_skill.py 在位（4ad67af 件④ assert_close_contract 断言族）·convene spawn 现役形=loop_convene.py 在位（convene_mode manual/auto fail-safe+七席召集件模板化+dimB 初判器）——**plan-skill spawn 段码面缺席如实注**（全域 spawn 分布四件=loop_autoreview/loop_convene/loop_convene_auto/delivery_plugins·tasks/dispatch 域零 spawn·plan 段候施工——判据③「三段在位」=score/close 两段实锚+plan 段缺席注·门禁裁归 CTO）。
4. **硬串行断言面 ✓**：score 段硬序断言（score.json verdict 面前置校验·缺/坏=exit 2 硬序拒·替身禁令同族——6ceffa6 白盒 3 案）+close 段 assert_close_contract 三面机械验（时点序/hash sha256_16/run_state 单值源——4ad67af 白盒 3 案）+段间产出回管道落卷衔接（F4 raw_out 60000 上限链 84614a7）——「段 N+1 启动前置断言=段 N 落卷真值·禁跳段禁乱序」码面在位实锚。
5. **dimA 两亚面装载 ✓**：DIM_A_SUBFACES 常量（A1 实现完整度+A2 loop 机制完备性·半权 50/50）+DIM_A2_ANCHORS 三锚（A2-1 判卷路由面/A2-2 服务供给面/A2-3 触发调度面·ns2 实证三案逐案映射）+DIM_A2_SCORING（自揪加分/漏环节扣幅·WP9 v3 闭环承）全段码面实读（loop_autoreview.py L68-79）+**prompt 渲染抽验 ✓**（spawn_seat_session prompt 主体两亚面指引注入段 L128 实读·spawn 面即教形）+0703bed 在链实锚（cat-file commit·「常量活体 A2 锚 3/亚面 2」面读数与码面一致）。

## §二 · N2 等待语义 gate 装配读数（CTO 判据卷 §二 六裁点·三绿三注）

| # | 裁点 | 读数 | 判 |
|---|---|---|---|
| 1 | 三态 gate 形 | preflight.check_ceo_ruling 三态码面在位（continue/terminate/awaiting-ruling·exit 映射 {4:awaiting, 5:terminated} L499）+ceo_ruling_probe.py 知会面（state∈continue/terminate→_notify_blocking 知会值席·round-state 推进面）——判定单值源分层（探针只管知会·轮间门=preflight 承） | ✓ 在位 |
| 2 | round_state 字段 | **round_runner 码面缺席**（runtime/ 全域零 round_runner·round-queue/state/flag.json 不存在）——设计定稿承录在（D1 v3-final 定稿承记①·57117e85d 卷锚·flag/round_count/fuse/resume 四字段+round_count 分域形设计面） | 注：候铸域 |
| 3 | tick 探测宿 | **rmc-orchestrate-tick job 在役活体**（jobs API 实锚：enabled=True·lastRun=ok·runCount=3982·consecutiveErrors=0·10min 拍现役 nextRunAt=05:12:00+08）+ceo_ruling_probe 尾挂形码面承录（docstring「tick 宿调本探针·payload 调用尾 \|\| true」·never-raises） | ✓ 在役 |
| 4 | fail-closed 面 | absent→awaiting-ruling skip exit 4（cron 下窗自然再探=**挂起保持不自行推进**）+段报错停冒泡面（lastError 逐 job 承载·never raises 探测面零阻 tick）+prev 完整轮语义（pf size>0 空壳排除+close.json 在=链毕完整轮·残拍排除 2 案白盒在码） | ✓ 在位 |
| 5 | 双事件 AND 门 | **round_runner 码面缺席**（同裁点 2）——设计承录在（D1 §一C：debug=ceo-ruling ∧ cos-evolution-decision 双卷齐=迭代放行·test 态单迭代直进零候） | 注：候铸域 |
| 6 | 催办语义唯一源 | preflight `_ESCALATE_AFTER_H = 72`（L244·3 天无裁决→升级催办 notify·挂起保持）+「缺席催办=preflight gate 72h 面承·本探针零重复」分层单值源实证（ceo_ruling_probe docstring 承录）+bd1786e2d 复验承录（F1 补丁·TriMetaverse 卷锚非 heyuan 仓对象·如实注） | ✓ 在位 |

**N2 读数小结**：gate 消费面（三态判读/tick 宿/fail-closed/催办唯一源）四裁点现役码面在位活体实锚；**round_state+双事件 AND 门两裁点=round_runner 铸面域**（D1 §五 S1 施工件·「候 COO 排」承录）——gate 首用前装配清单输入面=本两注（候 CTO 门禁裁·异常即停回勘不硬推护栏遵行）。

## §三 · 环境读数（护栏面·N3 前置活体）

1. **TriRMC 8710 在役三证**：unit active (running) since 11-19 15:57:44 CST（Main PID 2687790）+8710 LISTEN（node pid 2687790）+/hello HTTP=200 time=1.83s **GLM 真答**（model=z-ai/glm-5.3-flash）——GLM 供给活体直证。
2. **fallback chain 3 nodes journal 旁证**：`[trimodel] fallback chain active: 3 nodes (deepseek-chat@deepseek,deepseek-reasoner@deepseek,glm-5.3-flash@anthropic)`（05:28 journal·B6 卷 §一 件 3 同款）+GLM 流活体进行时（05:32:22 `[anthropic-provider][dbg] outbound: glm-5.3-flash`）。
3. **TriRMC cron jobs 活体清单 6 job**：rmc-orchestrate-tick（ok·3982）/tricompany-pull（ok·7470）/e1b2-window-reminder-patrol-8710（ok·8147）/lg099-pre-gate+lg099-post-gate（新立·runCount=0·nextRun≈11-22 周日门）/**weekly-plane-shift（lastRunStatus=error·consecutiveErrors=5·lastError=git fetch code 2 FETCH_HEAD·runCount=63）——异常如实报**（62/63 先例本体 job·候值席/CTO 域勘·本域零动作不阻 spawn 链评估）。
4. **回滚锚三面独立承录活体在位**：①overlay bak（bak-fixd2-20261119 在 patches/）②TRICO_SPAWN_GLM=off 逃生门（read_glm_spawn_env 码面 3bdae1f 在链）③TC 3bdae1f revert（heyuan 仓 git log 在链实锚）——ns8 首拍异常即触发面齐备。
5. heyuan 仓 HEAD=2786b0e（C1 包铸毕·FSD 主刀件在树上）——触面限定遵行：runtime/cognition/fade_protocol 读数面零写入·C2 P1 施工面（orchestration-kit 包）零触碰。

## §四 · D-46 事故如实（本席读数事故·轮换触发器）

**systemctl cat trirmc 直出致 TRIRMC_INTERNAL_TOKEN 全值（64 hex）进入本席会话回显**——D-46 值面零回显违例（读数侧·非写入侧）——处置：①毕报/卷面/转报零含该值②后续读数改道（python 内变量解析零回显——jobs 清单活体即改道后读数）③**token 轮换触发器报 COS 候裁**（照「8712 token 轮换裁=不立即·触发器+顺手窗两护栏」先例——triRMC internal token 消费面=TriRMC daemon API 调用方·轮换窗口候 CTO 裁）。

## §五 · N3 候面（spawn 执行面·候 N1+N2 毕）

- N1 五项=全绿（本卷 §一）·N2=三绿三注（§二）——**N3 开工条件（N1+N2 毕）的判定权=CTO 门禁裁**（派工单 §二·N2=CTO 技术裁）——候裁态·零抢跑。
- N3 面已勘清（spawn 执行面读数随 N3 令面出）：convene spawn 现役形=loop_convene.py（七席 SEATS+召集件模板化 dispatch payload·控制面拾取发送）+spawn_seat_session（loop_autoreview.py·claude -p print 形·timeout_s=600 缺省·read_glm_spawn_env 注入）——62/63 先例=weekly-plane-shift runCount 63（现状 error 态如实注 §三.3）。

## 使用依据

- COO WO-B7-NS8-20261120（4837052995·§二拆树 N1/N2/N3+§三护栏四族）+CTO N1/N2 门禁判据面（779c99aa0·五项+六裁点+首用观察语义）+COS B7 排期单（cos-b7-ns8-dispatch-20261120）
- notice196入账卷-两条机制根修-WP9v3增量登记-20261118（基线真源·策一细化 L5 原文+dimA 施工面 L38）+CTO preset composition 深勘裁定卷（cto-preset-composition-deepsurvey-20261118·dump 正形+pending 判据面）+cto-fixD2-closeout-20261119（overlay 三行族+回滚锚三面）+cto-b6-closeout-20261120（判据①②并轨+ns8 交棒）+cto-round-programming-design-20261119（D1 v3-final·round_runner 定稿承录）
- heyuan 活体读数：dsh dump 323240B+TC 码面（HEAD 2786b0e）+TriRMC unit/journal/HTTP/cron jobs API——通道=既定 ssh 跳板形（TriMMC/TriRMC 造件先例）
- D-24（机位断言活体现探）/D-46（值面零回显——§四事故如实）/D-47（落款=date 现查原值）

—— SDE 小布（m-sde·B7 N1/N2 装配读数收口·候 CTO 门禁裁）·写前现查 2026-11-19T21:35:34Z（+8=2026-11-20 05:35:34·date 现查原值·D-47 正形）
