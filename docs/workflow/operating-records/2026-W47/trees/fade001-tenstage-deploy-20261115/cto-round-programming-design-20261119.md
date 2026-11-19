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
