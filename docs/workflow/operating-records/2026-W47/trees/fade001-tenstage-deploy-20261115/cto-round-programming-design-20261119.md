# 轮间编排收归程序面·施工方案卷（notice-223 款二 CEO 批·CTO 设计·值席配合面）

- date 现查: 2026-11-19 18:3x CST（D-47）
- 设计人: CTO 小狄（方案毕排施工·施工候 COO 拆树排面）
- 方向定谳承录: agent 不再手动起跑轮——过渡期起跑动作走**控制指令入队→程序消费**

## §一 目标与不变面

- **目标**：轮推进权收归程序面（runner/脚本化承载）——起跑=入队形唯一通道·程序消费执行·轮推进判定=程序（裁决落卷驱动）；
- **不变面**：十段链本体零改（已验收现役）；notice-202 等待语义轮间门零改（三态门现役·单 gate 双源收敛）；weekly cron 周日窗保留（时钟驱动推进源）；ns 系轮次纪律全适用。

## §二 控制指令队列面（新件设计）

- **队列位**：`/var/lib/trirmc/round-queue/`（pending/ done/ failed/ 三态目录）——原子写（tmp+rename 同族）·消费单锁（running.lock fcntl 面·零并行轮）；
- **指令形**：`round-instruct.json` = `{op: "start_round", from_week, to_week, start_date, ns_label, issued_by, issued_at, ruling_ref?, sha256}`——字段校验 fail-closed（缺/坏=转 done-error 记录面零执行）；
- **入队**：pending/ 原子写即入队（值席拟稿入队·程序入队同形——**零直跑通道**：agent/人起跑动作全部收敛为入队）；
- **消费端**：`round_runner.py`（TC runtime/cognition 新件）——tick 宿尾挂（rmc-orchestrate-tick probe 同款 best-effort 位·候排面可定独立 job）：pending 队首取一→校验→构造 run_id（现役同形 run_id 族）→调 chain_runner（十段链参数化执行=weekly-plane-shift payload 的脚本化抽身·同链同形同 run_dir 族）→毕=done/（结果摘要行）·败=failed/（**错误冒泡落卷·款三纪律**）。

## §三 轮推进程序链（notice-202 门互联）

- 轮 N 毕（close/notify→trigger round_state=pending-ceo-ruling）→**推进源=裁决落卷事件**：
  - `ceo-ruling.json` continue 落卷→probe/tick 检得→**程序自动入队下轮 start_round 指令**（from/to/start_date 递推·carry_over 承接）——轮推进=程序非人；
  - absent→pending 指令保持（等待语义 fail-closed·轮间门照守）；
  - terminate→队列停用态（terminated.marker 落位·pending 转 done-terminated·程序零再起跑）；
- weekly cron 窗与 queue=**双源单 gate**（两源过同一 preflight 轮间门——notice-202 语义零重复实现）。

## §四 notice-198 同族衔接（段序程序化）

- 链内 Skill 段（plan-skill/score-skill/close-skill）=脚本化 spawn 现役形延展（score-skill=loop_autoreview 现役形承）；**段 N+1 spawn 前置断言=段 N 落卷真值**（硬串行·禁跳段禁乱序）；
- 启动装配=程序（runner 面）·agent 只做段内判读（198 四要点同族归一）；
- 段产出回管道落卷衔接（score-skill.json 现役形延展族）。

## §五 款三纪律固化（施工面同守·即时生效含 ns 系全轮）

- spawn 失败=**段报错停 fail-closed（错误冒泡）**——runner 面零人肉接管段内入口·零人工判卷路径（缺席席=absent 注如实非冒充·补面=修复后重跑指令形）；
- failed/ 落卷+exit≠0+段错误行=候修复重跑（重跑=新指令入队·非原地续跑）。

## §六 施工拆面（候 COO 排）

| 段 | 面 | 件 |
|---|---|---|
| S1 | 队列面+消费端 | TC round_runner.py 新件+队列目录形+白盒 |
| S2 | 链参数化抽身 | weekly-plane-shift payload 脚本化=chain_runner 参数化形（同链同形·最小改面） |
| S3 | tick 宿接线 | 消费端挂 tick（probe 同款尾挂形） |
| S4 | 段序断言族 | 198 硬串行断言+款三 fail-closed 断言（白盒） |
| S5 | 试运行 | 入队一发→程序消费→run 全链活体（shadow/低风险轮形）→切换宣告（候 COO） |
| 回滚 | 单笔族 | 队列目录回滚+runner revert 一键 |

## §七 对图面如实注

**60a565cee 图三版未达 origin/dev 可见域**（fetch 后副本=7573B 无图三/程序控制面面）——方案按令面文字五面锚先行（入队→消费+198 四要点+202 门互联+款三纪律）；**图到达后对图复核段补**（候值席 relay 图面·非阻塞设计面）。

## §八 过渡期形

- 现役手动起跑通道=过渡废止（agent 零直跑·人零直跑）——起跑=入队形唯一；
- 值席=控制指令拟稿+入队执行者（配合面·notice-223 原载）；程序=消费+推进判定；
- 生效=施工毕+S5 试运行毕→切换宣告（候 COO 排）。

## 使用依据

notice-223 款二 CEO 批令面；notice-198 四要点（三 Skill 段脚本化/硬串行/装配程序化/产出回管道）；notice-202 轮间门卷（8bd01a7ef/bd1786e2d/5ae2460d9 谱系）；weekly-plane-shift jobs payload 全读（9c81c7ec）；款三纪律固化令面；D-46/D-47。

---

## §七对图复核段（60a565cee＋393bdfe35 照修版真身对表·2026-11-19 19:5x CST·fetch 自取形零触检出）

**五面主形对齐 ✓**：①轮间推进=程序面 runner 驱动（§二/§三）②spawn 失败=段报错停 fail-closed 错误冒泡（§五）③人工判卷废止 ✕（§五零入口）④agent=纯监督面执行零触（§二入队唯一通道+§八）⑤CEO 裁令消费=notice→控制指令入队→程序消费（§二/§八值席拟稿面=图三 V2 监督面写指令形）。

**对表增补两处（设计修订·施工拆面映射）**：

1. **§五A·段级重跑承载增补**：图三 FIX→「修复毕·重跑指令→RN」=段级重跑粒度——S2 chain_runner 增**断点续段参数形**（--resume-stage N·段 N 前置真值断言复用=同 run_dir 断点续段·非全链重跑）——S4 断言族增段级重跑前置真值断言案；
2. **§三A·flag 分路与熔断计数承载增补**：图三 DEC2 否后两支+对照表⑥⑦——**test 态=Runner 自动续轮不候 CEO**（程序入队驱动·轮计数 runner state 面+1）＋**8 轮上限熔断**（达限自动熔断停候 CEO=FUSE 程序面表达）＋**debug 态=融合改善意见候 CEO 裁**（=现役 §三 ceo-ruling 驱动形对）；verdict 驱动源扩两态（loop_next=续轮入队／loop_exit=出队停+flag→prod 注记）——S1 runner state 面增 flag/轮计数/熔断三承载。

**对图判定=设计成立（五面主形零冲突）＋两增补并入 S1/S2/S4 拆面（零结构重排）**——候 COO 排面按增补后拆面。

**对图使用依据增补**：393bdfe35 图三照修版（mermaid 控制权图+对照表七行）；fetch 自取形零触检出实锚（he席 unstaged 面零动）。

---

## §九 flag 段设计增补段（notice-225 CEO 批增补令·S1 排面并入·2026-11-19 20:0x CST）

### 款一·flag 三态机制化（debug/test/prod）

- **状态存取**：`round-queue/state/flag.json` = `{flag: debug|test|prod, switched_at, authority_ref(CEO令/notice ref), run_verdict_ref?}`——read_flag/set_flag 双助手（round_runner 程序面）；
- **切换权=CEO 令（图二定谳承）**：set_flag 手动形（debug↔test 互转·prod 回切）**必载 authority_ref**（无 ref=拒绝 fail-closed——程序零自切换）；**唯一程序自动边=EXIT≥95→prod**（图三 EXIT2 面 sanctioned 规则边·run verdict ref 为锚）；
- **判别分支路由**：chain_runner/round_runner 读 flag 决定链形（prod=直走／debug+test=loop 形）与推进面（§三A/款二四支）。

### 款二·四分支设计

| 支 | 条件 | 程序处置 |
|---|---|---|
| ①test 态自动续轮 | verdict=loop_next 且 flag=test | 程序自动入队下轮 start_round（**不候裁决**·轮计数+1·carry_over 承接） |
| ②prod 分支 | flag=prod | **十阶段单轮直走·无进化 loop 直交付**——chain_runner prod 形=CLI 段照跑·Skill 尾段（convene/score-skill/close-skill 联审尾）跳过·周迁移交付即收 |
| ③FUSE 熔断 | 轮计数≥8（runner state 面 count 程序驱动） | **自动熔断停候 CEO**——queue 停用态（fuse.marker 落位+pending 冻结·零再起跑·候 CEO 令解） |
| ④EXIT≥95 关进化 | verdict=loop_exit（联审均分≥95） | **flag→prod 程序处置**（set_flag prod·run_verdict_ref 锚·出队停+prod 交付注记） |

- 四支与 §三 ceo-ruling 门互联面：debug 态=候裁驱动形（现役承）；test 态=①③④程序面；prod 态=②直走形——**flag 分派在 runner 消费端单点**（零双路判别）。

### 款三·S4 断言族扩面（白盒同族）

| 断言案 | 面 |
|---|---|
| F-1 flag 存取 | read/set 往返+坏值拒绝+authority_ref 缺失拒绝（手动切换面） |
| F-2 四支路由 | test+loop_next→入队不候裁／prod→直走形 Skill 尾跳过／FUSE 7→8 边界（8=熔断停）／loop_exit→flag=prod+出队停 |
| F-3 权属门 | 程序自动边仅 EXIT≥95 一条（其余切换无 ref=零执行） |
| F-4 prod 直走形 | CLI 段序列完整+Skill 尾段零 spawn 实锚 |

- 白盒同族归 S4（spawn env/queue/gate 断言族并列）——**增补毕随本卷落树 ✓（本段即落卷）·施工排面仍候 COO 拆树不变**。

### GLM 单跑护栏承录

notice-222 双面盯守同窗同守（GLM 消耗速率知情盯守+QUOTA 再现即刻报 BOD·CTO standing 在卷）——flag 段施工面同守（prod 直走形=联审尾跳过=GLM 消耗降面如实注）。

### 使用依据增补

notice-225 CEO 批增补令三款；图二 flag 生命周期（切换权=CEO 令）；图三 DEC2/FUSE/EXIT2 面；§三A/§五A 增补谱系；D-46/D-47。
