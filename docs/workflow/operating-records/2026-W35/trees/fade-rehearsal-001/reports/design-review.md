# FADE 设计文档可执行性审查报告（FR-1）

- 审查对象：`docs/execution/2026-08-26/fade-pipeline-design.md` **v1.0**（全文 79 行通读）
- 审查日期：**2026-08-26**
- 审查人：TestEngineer（树 fade-rehearsal-001 / FR-1 fresh 子实例，tick 20260826T144848Z）
- 审查方式：设计文档逐条核对 + 实现源码核对（post-receive hook / orchestrate_tick.py / fade-watch.ps1 / orchestration.json）+ 本树自身作为 FADE 管线活体证据
- 总体判定：**CONDITIONAL_PASS**——设计拓扑成立、可作 v1 蓝图；但首轮真实运行（即本树）实际暴露 1×P0 / 6×P1 / 5×P2。P0 修复前，「自动可靠地跑」（CEO 原始需求，见文档元信息）不成立；AC-1 需拆分强化、AC-4 需补证据机制后方可验收。CTO 裁决放行与否，本报告只出质量事实。

## 一、AC 可判定性复核（§六 AC-1..AC-4）

| AC | 可客观判定？ | 验收方法遗漏 | 活体证据 / 证据边界 |
| --- | --- | --- | --- |
| AC-1 | 是（push 落 bare 时刻 ↔ hook 日志时刻差），但判据弱 | 是——只测触发不测生效（P1-5） | 字面 PASS：push#2（14:45:35Z）后同秒触发（fade-hook.log:6-9）。语义 FAIL：该 tick 看不到新树（actionable=[rmc-audit-cmp-001] 旧树）且无法 spawn；实际首动作 14:48:48Z（push 后 3m13s）、经由非 hook 路径+人工解救 |
| AC-2 | 收口后可判定（树 status + 收口 commit + push + 台账） | 是——模型证据路径未指定（P1-4、P2-4）；无完成时限 | 进行中：spawn 已实证（14:48:48Z pid=1002289，session-registry.json:410-414；模型 glm-5.3 见 state.json）；本报告即执行中产物，收口判定留待树 done，不预支结论 |
| AC-3 | 设计层面不可事后判定（无持久证据产物） | 是——证据产物缺失 + -Once 退出码语义过载（P2-3） | 本地侧（fade-watch.ps1），服务端零实测——仅可判定性设计审查，不臆造实测结论 |
| AC-4 | 现状不可判定 | 是——非 hook tick 零来源留痕 + cron 时刻文档与观测不符 + 无受控实验定义（P1-6） | 14:48:48Z 非 hook spawn 仅证「非 hook 路径可推进」，不构成 AC-4 证据（hook 当时在线，无法归因 cron） |

AC 层面跨条遗漏：无 AC 覆盖数据面（工作树同步）成功、无 AC 覆盖零人工干预、无 AC 覆盖锁护栏自身正确性——今日三项恰全为实际故障点（P1-1 / P1-5 / P0-1），建议 v1.1 增补。

## 二、可靠性设计复核（§四 五条，重点：双通道并发 / 会话中途回收 / 指纹与锁不一致窗口）

| 条 | 设计声明 | 复核结论 |
| --- | --- | --- |
| 1 双通道检测 | hook 秒级 + cron 30min 互备；「双通道同时触发也只会 spawn 一次」 | 控制面成立、执行面被 P0-1 击穿（14:43/14:45 双通道共用护栏共同失守）；「只 spawn 一次」无原子机制（P1-2）；cron 对新 push 内容结构性不接续（P1-1）。指纹与锁不一致窗口专项：skip-spawn 路径不消费指纹边沿（fp 仅在无待办 :260 或成功 spawn :324 时写入）——14:43/14:45 两 tick changed=true 连续保留边沿、14:48:48Z 一次消费（88ac5cfc→b6d1899e 实证），该窗口设计正确；残余风险=锁写入(:287)与台账 pid 追加(:320)之间崩溃，即 P0-1 模式 |
| 2 push 不阻塞 | nohup 异步、push <2s、触发层故障不影响 push | 今日两发 push 均秒级完成，无反例；代价是静默面扩大：flock 丢弃无日志（P2-1）、pull 失败后 tick 照跑旧树（P1-1）——「触发层故障只记日志」的承诺对数据面不成立 |
| 3 进度不丢 | 先写后报+原子即提交，只认已 commit 进度 | 纪律层面成立（本树骨架 commit f3ba8182 先于节点派工，实证）；机制缺口：锁/brief/台账均在 git 外，会话回收即失（今日孤儿锁即实例；session-registry 历史大量「双缺/半写」补记在案）——修复面归入 P0-1 |
| 4 断点续执 | 树节点 status 即断点；新 tick 只派 pending | 未覆盖故障模式：全 in_progress 的 active 树成调度黑洞，无告警无重派（P2-2）；组织实践实际使用 in_progress 状态（rmc-audit-cmp-001 在案） |
| 5 预算硬门 | 15 亿 token/日 + 1000 元/月双门，超限自动降级 | 无记账回路：`_save_ledger`（:137-139）零调用者，会话 usage 无入账路径，两门读数恒零（08-25 全天数十会话后仍 0/1500000000｜0.00 元）——「超限自动降级」恒不可触发（P1-3） |

## 三、发现项清单（P0×1 / P1×6 / P2×5）

### P0（阻断/失守）

**P0-1 孤儿锁护栏默认拒斥：锁在而台账查无 PID 条目即判「活」——双通道共同失守，自动自愈最迟 80 分钟**
- 引用：§四.1「tick 内部活动锁护栏保证同一时刻单会话」；实现 `orchestrate_tick.py` `_lock_stale_or_absent`（:83-106）：通道②在台账反查该树 spawn PID（:94-103），**查无匹配条目即落空走到 :104 `return False`（判活）**；且锁文件本身不含 pid（现值仅 `{ts, tree}`，orchestrator.lock 实证）。
- 活体证据：14:43:03Z / 14:45:35Z 两发快通道 tick 均 `live session running, skip spawn`（fade-hook.log:5、:10），所指「live session」实为 141800Z 早夭实例（0.8s 死亡：session log `api_error_status:404`、`duration_ms:793`）；台账全文无 rmc-audit-cmp-001 条目 → 通道②必然落空。
- 算术实证：`session_timeout_s=2400`（orchestration.json:6）→ 通道①需锁龄>80 分钟；14:48:48Z 时锁龄约 31 分钟——spawn 成立以锁已被清除（或损坏）为必要条件，反证手工清锁先于 14:48:48Z（fade-hook.log:11「14:50Z」为事后取整留痕，非清除时刻）。若无人工干预，自愈最早约 15:38Z（距 push#2 约 53 分钟）；实际阻断窗 14:43:03Z→14:48:48Z 近 6 分钟，自孤儿锁形成（14:18Z）计滞留约 30 分钟。
- 建议：①写锁时即带 pid 与时刻（`{"ts","tree","pid"}`），护栏优先探测锁内 pid 存活；②台账查无条目时按锁龄>短阈值（如 5 分钟）判死，禁止默认拒斥；③PermissionError 保守判活可保留。
- 影响面：管线核心承诺「自动可靠」在首次真实运行即阻断并依赖人工解救；该护栏为快慢双通道共用，失守即全管线停摆。

### P1（显著缺陷）

**P1-1 快通道数据面单点且失败静默：工作树同步仅 hook 一处，pull/rebase 失败后 tick 照跑旧树，cron 兜底不接续新内容**
- 引用：§四.2「hook 任何失败不影响 push 本身（git 层与触发层解耦）」、§三 cron 行「hook 失效时最迟 30 分钟接续」；hook 注释（post-receive:14）「pull 失败不阻塞——慢通道 cron 会接续」。
- 事实：`orchestrate_tick.py` 全文无任何 git fetch/rebase（REPO 仅用于扫描树文件与 Popen cwd）——cron tick 结构性看不到未同步进工作树的新 push 内容，「接续」只对已在工作树内的树成立。
- 活体证据：两发 push 均 `pull/rebase skipped (dirty or conflict)`（fade-hook.log:2、:7），两 tick 的 actionable 均为 [rmc-audit-cmp-001]（工作树停留于 01c5737e 旧视图）；本树能于 14:48:48Z 被评估到，依赖 14:45:35–14:48:48Z 间外部人工同步（state.json baseline `headAtStart=d148b8a7` 实证；该窗口内无任何自动同步路径）。
- 建议：tick 入口前置 `git fetch origin dev && git rebase origin/dev`（fleet 工作树 origin 即 sg-bare，.git/config 实证）；最低限度 hook pull 失败行独立告警；v1.1 增数据面 AC（hook tick 后工作树 rev==pushed newrev）。
- 影响面：FADE 的 A→D 衔接对「工作树脏」零韧性；服务器工作树被并发会话留产物是本组织常态（当日即有外树未跟踪文件 rmc-TriLC.md 在案），触发概率不低。

**P1-2 锁 check-then-write 非原子：「双通道同时触发也只会 spawn 一次」无机制保障**
- 引用：§四.1 原句；实现护栏判定（:281）与写锁（:287）之间无原子性——hook 秒级与 cron 半点对齐可并发通过判定、各自写锁、各自 spawn。
- 影响面：窗口毫秒级但真实；单会话约束被破的爆炸半径有历史实证（session-registry.json 同窗三实例并发：121305Z/121800Z/121554Z 在案）。
- 建议：锁改原子创建独占（`open(..., "x")` / O_EXCL）作为互斥本身，创建失败即退出；或写锁后回读自持再继续。

**P1-3 预算硬门无记账回路：「超限自动降级」恒不可触发**
- 引用：§四.5「预算硬门：15 亿 token/日 + 1000 元/月双门，超限自动降级」；实现 `_save_ledger`（:137-139）零调用者，CC 会话 usage 无解析入账路径（main 流程 :298-326 仅 spawn+台账+指纹）。
- 活体证据：08-25 全天数十会话运行后，14:43Z tick 预算行仍「今日 token 0/1500000000｜月度 0.00 元」（fade-hook.log:4）——两门读数恒零，门形同虚设。
- 附注：`prices_override` 将 glm-5.3 计价全置 0（orchestration.json:7-21）——即便记账回补，金额门对现价仍恒零；token 门有效。
- 建议：下轮 tick 解析 `orchestrator-session-*.log` 尾部 result JSON 的 usage 追加台账；或文档如实降级该条为「占位、记账回路后补」。
- 影响面：成本护栏失真方向保守（不误杀执行），但「1000 元/月」承诺无监测手段，超支不可见。

**P1-4 spawn 未钉模型：模型漂移即秒死并级联孤儿锁（已发生一次）**
- 引用：§三「模型配置 GLM glm-5.3 (bigmodel.cn)｜已切换｜三端已部署并验证」；实现 spawn cmd（:293-298）无 `--model`，模型由 fleet HOME 的 claude 侧配置解析；orchestration.json 的 `default_model` 仅用于计价回退，不进 spawn 链路。
- 活体证据：141800Z 会话死于 `stealth/ox-alpha` 404——14:18Z 时点该路径模型解析与「已切换」不符；本树 14:48:48Z 会话为 glm-5.3（state.json `orchestrator.model:"glm-5.3[1m]"`），证明配置在此间被修正，修正者与时刻不可考（证据边界）。
- 建议：spawn cmd 显式 `--model glm-5.3`；AC-2 的模型判定证据指定为会话 result JSON 的 `modelUsage` 字段（会话结束后落 orchestrator-session-*.log）。
- 影响面：一次配置漂移=0.8s 死亡+一把孤儿锁+最长 80 分钟全管线停摆（P0-1 级联）；修复成本一行。

**P1-5 AC-1 只测触发不测生效——本树活体证据恰为「字面 PASS、语义 FAIL」**
- 引用：§六 AC-1「本地 push 含新树的 commit 后 ≤2 分钟，sg 侧 tick 被钩子触发（shadow-plane 有 hook tick 日志证据）」。
- 判定：可客观判定且本树字面达标（push#2 14:45:35Z → hook tick 同秒，fade-hook.log:6-9）；但该 tick 因 P1-1（看不到新树）+P0-1（无法 spawn）未产生任何执行——秒级触发未兑换成秒级执行，实际首动作 14:48:48Z（push 后 3m13s）、非 hook 路径+人工解救。
- 建议：拆 AC-1a（触发：保留现文，时钟起点明确为「push 落 sg-bare 时刻」）+ AC-1b（生效：该 tick 输出 actionable 含新树，且 pull/rebase 未 skipped——skipped 即 FAIL）。
- 影响面：现状下 AC-1 会对今天这样的失败运行判 PASS，验收失真。

**P1-6 AC-4 无可判定证据面：非 hook tick 零派工留痕、cron 时刻文档与观测不符**
- 引用：§六 AC-4「hook 停用时，30 分钟 cron 仍能推进同一棵树」；§一 D / §三「30 分钟 cron tick（13,43 分）」。
- 事实：fade-hook.log 仅记 hook 路径；cron/manual tick 除 brief 与台账外无 dispatch 来源留痕，产物不可区分；观测 08-25/08-26 全部常规 tick 落 **:18/:48**（brief 序列 …134800Z、141800Z… 实证），与文档「13,43」不符——其一必错（/etc/cron.d 无 trimc 条目，用户级 crontab 本实例不可读，证据边界）。
- 判定：AC-4 现状不可客观判定——「hook 停用」无受控实验，非 hook 推进无法归因 cron；本树 14:48:48Z spawn 仅是「非 hook 路径可推进」的弱旁证。
- 建议：tick 入口统一带 trigger 参数（hook/cron/manual）写入台账 ticks 条目；修正文档 cron 实配时刻；AC-4 补受控验收步骤（临时禁 hook → 观察 cron 台账条目推进同一树）。影响面：慢通道兜底主张停留在纸面，无法验收。

### P2（改进项）

**P2-1 hook flock 并发丢弃完全静默**——引用 §三 post-receive 行「flock 防并发」；实现 post-receive:7-8 `flock -n 9` 获取失败即无痕退出（连「dev updated」都不记），tick 运行窗内到达的第二次 push 被静默丢弃、仅剩 cron 兜底。建议失败分支补一行日志再退出。（附注：后台 tick 会继承 fd 9 在其运行期持锁，但 python `Popen` 默认 close_fds 阻断 fd 向 CC 会话传递，实际持锁时长=tick 秒级运行期，风险有限，如实记档不升级。）

**P2-2 全 in_progress 树成为调度黑洞**——引用 §四.4「新 tick 只派 pending 节点」；实现 evaluate_backlog（:173-174）仅 pending 入队：active 树全部节点停在 in_progress（会话中途死于节点执行中）时，该树从待办集消失，无告警无重派；组织实践实际使用 in_progress（rmc-audit-cmp-001 在案）。建议：pending 为空但存在 in_progress 且树龄超阈值 → 产出告警或视为可重派。

**P2-3 AC-3 缺持久证据产物、-Once 退出码语义过载**——引用 §六 AC-3「全程捕获状态变化，done 后 ≤1 个轮询周期内终报」；实现 fade-watch.ps1：`watch-<TreeId>.json` 每轮覆写仅存最后一次观测（:56），状态变化行只写 console（:58）不留档——「全程捕获」与「终报时刻」均无事后可验产物；`-Once` 模式 done 与非终态同为 exit 0（:63/:66），挂 trilc cron 时无法据退出码触发终报。建议：增 append-only 本地日志（带时间戳）；-Once 区分退出码（如 5=观测到非终态）。本地侧零实测，仅可判定性设计审查（证据边界）。

**P2-4 AC-2 收口判定依赖纪律而非机制、且无时限**——判定主体（树 status=done + 收口 commit 已 push）可客观核验，但无完成时限，且与 fade-watch 默认 240min 超时无对齐（watcher 超时≠管线失败，两口径会打架）；「（GLM）」证据路径未指定（见 P1-4 建议）。本树审阅时点 spawn 已证、收口未达判定时点，留待树收官复核。

**P2-5 杂项：时区日界与单树串行语义未载明**——`_tokens_today` 用本地 `date.today()`（:110）而全链路 UTC，日门翻转时刻偏移（记账回补后显性化）；tick 每轮仅取 `actionable[0]`（:285）单树串行，多树积压时推进速率受 cron 30 分钟节流，设计文档未载明该语义。

## 四、本树执行链路实录（push → 本节点执行，时刻均为 UTC）

| 时刻（UTC） | 事件 | 证据 |
| --- | --- | --- |
| 13:30:51Z | 前序基线 commit 01c5737e（rmc-audit-cmp-001 AC-R2 收敛验收） | git log |
| ~14:18:00Z | 旧代码 tick（:18 节律）spawn 141800Z 会话 → CC 0.8s 死亡（stealth/ox-alpha 404）→ tick 疑崩于台账追加（time 未导入，5e41c748 修复说明）→ 孤儿锁滞留【推断，见边界 4】 | orchestrator-session-20260826T141800Z.log；session-registry.json 无对应条目 |
| 14:42:53Z | 本地 commit 5e41c748：FADE v1.0 设计 + fade-watch.ps1 + hook 部署 | git log |
| 14:43:03Z | push#1 落 sg-bare：hook 首跑，dev 01c5737e→5e41c748；fetch+rebase 失败（dirty）；异步 tick 派发 | fade-hook.log:1-3 |
| 14:43:03.9Z | tick#1 评估：actionable=[rmc-audit-cmp-001]（旧树）、fp=88ac5cfc、changed=true；护栏判孤儿锁为「活」→ skip spawn | fade-hook.log:4-5 |
| 14:45:22Z | 本地 commit d148b8a7：本树 fade-rehearsal-001 注册 | git log |
| 14:45:35Z | push#2：hook 5e41c748→d148b8a7；pull/rebase 再次 skipped；tick#2 仍旧树 + skip spawn（skip 路径不写指纹，边沿保留） | fade-hook.log:6-10 |
| 14:45:35–14:48:48Z | 人工干预窗（操作者不可考）：工作树前进至 d148b8a7 + 孤儿锁清除 | state.json baseline headAtStart=d148b8a7；fade-hook.log:11（事后取整留痕）；配置算术反证清锁必先于 14:48:48Z |
| 14:48:48.109Z | tick#3（路径未留痕：非 hook，cron/手工不可证）：fp=b6d1899e≠88ac5cfc（边沿消费）→ spawn CC pid=1002289（glm-5.3）→ 写锁（ts=1787755728，现值实证）→ 落 brief → 台账追加 rc=spawned | session-registry.json:410-414；orchestrator.lock；tick-fingerprint.txt；brief-20260826T144848Z.md |
| 14:52:10Z | 编排会话就位勘察（surveyedAt）：基线与触发链留痕 | state.json |
| ~14:53Z | 骨架 commit f3ba8182（state.json + log.md + 本报告桩） | 编排交接 + 本机 git 快照 |
| FR-1 执行窗 | 本节点 TestEngineer fresh 子实例：通读设计 v1.0 全文 + 核对 hook/tick/watcher/配置/台账源证 + 落盘本报告（先写后报——本文件即交付物） | 本文件 |

## 五、证据边界声明（不臆造清单）

1. 14:45:35–14:48:48Z 人工同步工作树与手工清锁的操作者、精确时刻不可考；「清锁先于 14:48:48Z」是配置参数（session_timeout_s=2400）算术反证的必然结论，非直接日志记录。
2. 14:48:48Z tick 的触发路径（cron vs 手工）不可证：无来源留痕；:18/:48 为 brief 序列观测节律的归纳，非 cron 配置直接证据（用户级 crontab 不可读）。
3. 14:43/14:45 pull/rebase 失败的精确脏因不可事后重构：现工作树仅余外树未跟踪文件 rmc-audit-cmp-001/reports/rmc-TriLC.md（git status 快照在案），失败时点的工作树状态不可溯。
4. 141800Z tick「崩于台账追加」为高置信推断（台账无条目 + 5e41c748 修复说明「time 导入」+ 新代码护栏行为反推），旧代码版本本体未取证。
5. AC-3 本地侧零实测（服务端只审可判定性设计）；AC-4 未做受控实验；AC-2 收口部分在审阅时点未达判定时点。
6. 本报告所有时刻为 UTC；fade-hook.log 自带 UTC 戳，git log 时刻取编排交接换算值。

## 六、使用依据（源文件清单）

- 设计真源：/srv/fleet/TriMetaverse/docs/execution/2026-08-26/fade-pipeline-design.md（v1.0，79 行）
- 实现核对：/srv/git/TriMetaverse.git/hooks/post-receive；/srv/fleet/TriCompany/runtime/cognition/orchestrate_tick.py；/srv/fleet/TriMetaverse/scripts/fade/fade-watch.ps1；/home/fleet/.trimetaverse/orchestration.json；/srv/fleet/TriMetaverse/.git/config（remote 拓扑）
- 运行证据：/srv/fleet/shadow-plane/fade-hook.log（12 行全文）；tick-fingerprint.txt；orchestrator.lock（现值）；session-registry.json（ticks:410-414）；brief-20260826T144848Z.md；orchestrator-session-20260826T141800Z.log；orchestrator-session-20260826T144848Z.log（空=会话运行中）
- 树本体：/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/fade-rehearsal-001/tree-op.json、state.json
- git 事实：01c5737e（13:30:51Z）、5e41c748（14:42:53Z）、d148b8a7（14:45:22Z）、f3ba8182（~14:53Z）
- 本报告落盘即 FR-1「先写后报」之「写」；节点 status 翻转与收口由编排会话按树纪律执行，不在本子实例权限内

