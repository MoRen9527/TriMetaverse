# 轮间编排收归程序面·施工方案卷（v2 章节重构版·notice-226 四款架构级增补并入）

- date 现查: 2026-11-19 20:3x CST（D-47）
- 设计人: CTO 小狄（notice-223 款二方案→223 增补图复核→225 flag 段→**226 架构级章节重构**·版本谱系=git 历史在卷 14e92de70/9ea24bf26/e83cf39db）
- 主形定谳（款一勘正承录）: **loop 本体=runner 内单程序内聚循环控制流（while＋状态机）**——包住「十段链→联审→判分→flag 分路→轮间推进」全链——loop 点火后循环体内**自主迭代推进**；前版「每轮一指令·队列接力」形=**单轮开工指示器非 loop（勘正承·前版归位见 §九映射表）**

## §一 loop 本体段（主形·前置·while＋状态机）

```text
state = load_state()                      # flag(debug/test/prod)·round_count·fuse·resume
ignite = await_ignition()                 # 点火钥匙面（§三）：cron 周日窗／queue 点火指令／裁决续轮指令
while True:
    run = run_chain(ignite.params, resume_stage=state.resume)   # 十段链+Skill 段程序化 spawn（§四·断点续段 §六A）
    if run.failed:                        # 款三纪律（notice-223）：段报错停 fail-closed
        report_bubble(run.err)            # 错误冒泡（failed/ 落卷+exit≠0+段错误行）
        break                             # 候修复→重跑指令再点火（零人肉接管零人工判卷）
    verdict = run.aggregate.verdict
    if verdict == "loop_exit":            # 联审均分 ≥95（≥95 含边界）
        set_flag(prod, ref=run)           # 唯一程序自动边（图三 EXIT2·sanctioned）
        break                             # 关进化·prod 交付注记
    if state.round_count >= 8:            # FUSE 熔断（轮计数程序驱动）
        fuse_break()                      # 熔断停候 CEO（fuse.marker+pending 冻结）
        break
    if state.flag == "debug":             # 体内候裁决事件（notice-202 门=事件源单值）
        ruling = await_ceo_ruling(run_dir)     # continue/terminate/absent 三态·>72h 升级催办挂起保持
        if ruling == "terminate": break
        if ruling == "absent": continue_waiting  # 挂起（不迭代·fail-closed）
        # continue → 落下迭代
    elif state.flag == "test":
        pass                              # 直进下轮迭代（不候裁决）
    # prod = 不入本循环（点火面拦截→单轮直走形 §二 prod 分支）
    state.round_count += 1
    ignite = next_round_params(state)     # 自主迭代推进（非外部队列接力——款一勘正主形）
```

- **状态机四支**（225 款二并入 loop 体内实现）：debug=体内候裁决（continue 迭代／terminate=break）；test=直进下轮迭代；均分≥95=break+flag→prod；8 轮 FUSE=break 熔断候 CEO；
- **prod 分支**：flag=prod→点火面拦截→十阶段单轮直走形（CLI 段照跑·Skill 联审尾跳过·直交付）——不进 while 体。

## §二 flag 分支变量（notice-225 三款并入 loop 本体段实现）

- 状态存取 `round-queue/state/flag.json`（read_flag/set_flag·切换权=CEO 令承图二：手动切换必载 authority_ref·无 ref=拒绝 fail-closed；**唯一程序自动边=EXIT≥95→prod**）；
- 判别分支路由=loop 体内单点（零双路判别）；debug=候裁事件形／test=直进形／prod=直走形（点火面拦截）。

## §三 点火钥匙与 IO 面（前版队列面/round_runner 归位重定义·款三不废）

- **队列面归位**：round-queue/（pending/done/failed）只管两件事——①「**何时点火**」（start_loop 点火指令·cron 周日窗=时钟点火源并存）②「**裁决投递**」（ceo-ruling.json 落卷=体内 await 事件源·IO 转递面）——**零逐轮接力指令**（勘正主形）；
- **round_runner 归位**=loop **引擎宿主**（while 体运行位·单进程长驻点火后自主迭代）——tick=点火触发器（probe 同款尾挂形）；失败冒泡/段错误行=引擎 IO 出面；
- 双源单 gate 不变（cron+queue 过同一 preflight 轮间门·notice-202 语义零重复）。

## §四 段序程序化与断言族（不废归位）

- 198 四要点同族：Skill 段脚本化 spawn＋段 N+1 前置断言=段 N 落卷真值（硬串行禁跳段）＋装配=程序面 agent 只判读＋产出回管道落卷；
- S4 断言族=flag 断言四案（F-1 存取权属门/F-2 四支路由含 FUSE 7→8 边界/F-3 程序自动边唯一性/F-4 prod 直走形 Skill 尾零 spawn）＋段级重跑前置真值断言＋款三 fail-closed 断言＋点火/裁决 IO 断言（白盒同族）。

## §六A 段级重跑承载（§五A 归位）

- chain_runner `--resume-stage N`（段 N 前置真值断言复用·同 run_dir 断点续段）——图三「修复毕·重跑指令→RN」=**重跑指令=点火指令族**（repair-restart op·断点参数携带）——非外部队列逐段接力。

## §五 施工拆面（候 COO 排·重构映射后）

| 段 | 面 | 件 |
|---|---|---|
| S1 | **loop 引擎+状态面** | round_runner=引擎宿主（while 体·flag/round_count/fuse/resume 状态机）+白盒 |
| S2 | 链参数化+断点续段 | chain_runner 参数化形+--resume-stage（同链同形最小改面） |
| S3 | 点火钥匙+IO 接线 | 队列点火/cron 点火/ruling 投递三源接线（tick 宿） |
| S4 | 断言族扩面 | §四A 全族（白盒） |
| S5 | 试运行 | 点火一发→loop 自主迭代活体（debug 候裁面+test 续轮面双态）→切换宣告 |
| 回滚 | 单笔族 | 引擎 revert+队列目录回滚 |

## §七 对图复核段（393bdfe35 照修版真身对表·承录）

五面主形对齐 ✓＋两增补（段级重跑/flag 分路熔断）——**v2 重构后对图关系增强**：图三 RN=「Runner 程序·轮间编排驱动」=loop 引擎本体 ✓；ERR→FIX→RN 环=重跑指令点火形 ✓；DEC2/FUSE/EXIT2=while 体分支 ✓——图三与本主形**逐节点对齐**（对照表七行全含于 §一~§三）。

## §八 过渡期形（不变）

- 起跑=入队点火唯一通道（agent/人零直跑）·值席=指令拟稿+入队执行者·程序=引擎消费+迭代推进；
- 生效=施工毕+S5 试运行毕→切换宣告（候 COO）。

## §九 前版章节归位映射表（勘正承录·git 谱系在卷）

| 前版章 | 内容 | v2 归位 |
|---|---|---|
| §二 队列面（每轮一指令） | 单轮开工指示器 | **勘正**→§三 点火钥匙+IO 面（零逐轮接力） |
| §三 裁决落卷驱动推进 | 门外驱动 | §一 体内 await 事件（debug 支） |
| §三A flag 分路熔断 | 支路设计 | §一/§二 loop 体内实现 |
| §五A 段级重跑 | resume 形 | §六A（重跑指令=点火族） |
| §九 flag 段（225 三款） | 存取/四支/断言 | §一/§二/§四A 并入 |

## §十 增补承录线

223 款三纪律固化（含 ns 系全轮·施工面同守）✓／225 GLM 单跑护栏双面盯守同窗同守 ✓（prod 直走形=联审尾跳过=GLM 消耗降面）／notice-222 QUOTA 再现即刻报 BOD standing ✓。

## 使用依据

notice-226 四款架构级令面（款一勘正承录/款二 flag 并入/款三队列归位不废/款四排面不变）；notice-223/225 谱系（git 历史 14e92de70/9ea24bf26/e83cf39db）；393bdfe35 图三照修版；notice-198/202/222 谱系卷；weekly-plane-shift payload 全读；D-46/D-47。

---

## §一A 升降级算术与漏斗定谳段（notice-230 款二四前置件批立并入·2026-11-19 22:0x CST）

| 前置件 | 定谳 | loop 体并入位 |
|---|---|---|
| ①分制基准 | 升降级算术**唯一挂并盘 100 制** | §一 verdict 计算域=并盘 100 制单值源（零双制混挂） |
| ②95 线算术域 | **只挂机判+采集两域加和**·7 席主观=**否决权**（不算入加和·否决即挡 EXIT） | EXIT 门=（机判+采集≥95）∧（主观否决未触发）——否决权承载=score 线席位卷判定域（实现锚=score_engine/aggregate 面·否决值域细则候 score 线白盒） |
| ③prod→test 判据 | prod 单轮直走交付面 fail（断言红/回归红）→自动降 test 重开进化 loop | prod 直走形后置门（authority_ref=notice-230·sanctioned 边登记） |
| ④转化漏斗+FUSE 计数域 | 转化漏斗制度立（debug/test/prod 三态转化链留痕面）＋**FUSE 计数域=同根缺陷连续计数＋test/prod 两计数不混** | round_count 分域形=state.count[test]/state.count[prod] 两计数独立（零混挂）·同根缺陷=连续+1（异根=重置·判读锚=根因卷引用） |

- **款三承录**：ns9 不走——优化毕下轮直接 TriRMC runner（loop 本体程序）跑；值席手动循环形态 ns8 收官——S1-S5+修 E 随 COO b 案直切形态拆树（eb3ac427·施工排面更新承）；
- **款一承录**：b 案直切（P1/P2 前提=降级候补观察面不作门槛——观察义务保留：GLM 供给盯守 standing 照卷）。

---

## §一B 双分数分立与 retry 机制段（notice-231 款一·勘正 230 款二部分并入·2026-11-19 22:5x CST）

### ①当周迁移质量分（fade-001 内部分·客观+主观=100）与 retry 机制（漏设计新立）

- **判据**：≥90（暂定线·CEO 定）=当周免 retry；<90=当周 retry；
- **retry 机制设计**（四件）：
  - 触发判据：close 段读 fade-001 内部分 <90 → retry_flag=当周 pending-retry（run_dir 落卷）；
  - 重试范围：**Skill 尾段重跑形（非全链十段）**——retry=resume-stage 面复用（§六A·从 score 段起重跑至 close·CLI 段产物零重跑——迁移本体已交付·重试=判卷/收口面复核）；
  - 次数上限：**2 次/当周**（retry_count state 面·两retry后仍<90=如实落卷+通知值席（非熔断——迁移质量面无熔断语义·escalate 呈报面））；
  - 十段链衔接位：close_cli 后置分叉点（close 毕→内部分判读→retry 分支回 score 段 resume·零段间新链形）。

### ②进化判据重定义（7 席联审均分·勘正 230 款二②撤销承录）

- **7 席联审均分（每席 100·均分过 95 线）=进化判据**——评估面=fade 协议遵循实现度+周迁移质量双面；
- **CEO 定谳承录：分数抖动=多角度挖缺陷的进化优势**——notice-230 款二②「主观只否决不计分」定谳**撤销**（230 款二其余三件+维持批立：①并盘 100 制基准/④转化漏斗/prod→test 判据/FUSE 计数域）；
- **牵连面候勘如实注**：与 COS 综合判决牵连面（款三③改形联动）——95 线判读位从 aggregate 机械面移至 COS 综合评估输入面（§一C 勘定）——score_engine/aggregate 输出面零改（均分照算·消费位变）。

### §一C 进化判决机制改形（COS 综合评估判决制·勘定呈报）

- **新判决链**：COS 收集 7 席意见综合评估＋看双分数（7 席联审均分+fade-001 内部分）→**COS 给进化/不进化判决**（不投票制）；
- **程序面承载**：判决=cos-score.json 扩展形（cos 终判行+eviction_decision: evolve|hold+rationale+双分数引用）——round_runner 读判决文件驱动（体内候裁事件源=cos 判决卷替代/并列 ceo-ruling 面——**事件源双轨并读形**：debug=CEO 候批（202 门）/evolution decision=COS 判决卷·两卷齐=迭代放行）；
- **衔接面勘定呈报（款一③候勘项回应）**：COS 判决×图二 flag 切换权=CEO 令两态衔接——**权属大面不破**：COS 判决=进化迭代放行权（evolve/hold·轮次推进域）≠flag 三态切换权（debug/test/prod 域=CEO 令专权不变）——两权分立注记：COS=「本轮判卷后进不进」·CEO=「态切不切」——test 态自动续轮支=①支不改（notice-230 ④ FUSE 计数域照立）；
- 程序化表达：§一 while 体 debug 支候裁事件=ceo-ruling ∧ cos-evolution-decision 双事件 AND 门（debug 态）/test 态=单迭代直进（零候）——白盒增补案（S4 扩）。

### 使用依据增补

notice-231 款一三条（两套分数分立/retry 漏设计新立/判决机制改形+权属大面不破）；230 款二②撤销承录·其余三件+FUSE 维持批立；§一 while 体谱系；D-47。

---

## 定稿承记（notice-238 sprint D1·CTO 定稿确认·2026-11-20 0x CST）

四项逐项「定稿承」（对表=本卷全谱+施工活体锚）：

| 项 | 定稿面 | 承 |
|---|---|---|
| ①round_runner 程序编排 | v2 主形（while＋状态机·loop 本体段前置·队列归位点火钥匙＋IO 面·57117e85d） | **定稿承** |
| ②spawn 七席 | F4 60000 链续＋修 D-2 GLM env 注入活体（spawn 可靠性根修·manual rc=0 GLM 真答·3bdae1f+overlay 三行族） | **定稿承** |
| ③等待语义③① | notice-202 三态 gate＋round_state 字段＋tick 探测＋fail-closed（2fd7053/8e7e4f0/a1488a9 全谱·复验 bd1786e2d/5ae2460d9） | **定稿承** |
| ④retry 闸漏补立 | §一B/§一C retry 机制四件（触发判据/重试范围/次数上限/衔接位）＋90/≤90 边界勘正（90e06cddd） | **定稿承** |

**本卷定稿=v3-final**（谱系：14e92de70→9ea24bf26→e83cf39db→57117e85d→90e06cddd→本记）——施工基线面=本卷定稿态（后续变更=变更令面新段·不覆定稿）。

定稿承记使用依据：notice-238 sprint D1 确认令面；修 D-2 施工链（rc=1 卷 e781d6cef→3bdae1f）；notice-202 施工链（SDE closeout 16c95c9e7→复验 027c7e913）；D-47。
