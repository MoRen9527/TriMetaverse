# FADE-001 触发链十阶段映射拆解（CEO 2026-11-12 22:47 总令承接）

- sourceOfTruth: TriMetaverse/docs/execution/fade-001-improvement-20261110.md
- syncMode: source-only
- lastSyncedAt: 2026-11-12
- 性质: BOD 拆解方案稿——映射方向=CEO 22:47 直连令定调；细化方案候 CEO 确认后才入真源转正；施工拆树归 COS+COO（树权门禁）
- 落卷: BOD 2026-11-12（date 见底稿段现查原值）

---

## §一 CEO 定调解码（22:47 令·映射方向）

1. **L6-L7 = 十阶段第 4 段 DCE（确定执行）的本体**——git 同步四段+迁移器六步是「执行」的活，不是「触发」的活。
2. **周迁移爱出错的根因** = 触发即全量执行：L5 bash 一条命令串把触发→执行→收尾一杆打死，无阶段闸、无准入资格、无范围分析——所以 L1-L5 的任何小问题都直接炸在业务本体上。
3. **触发阶段该按 FADE 规范走前三段**：先定 run id（不是上来就执行）→检查所有必须的前置工作→agent qualify 检查准入资格→plan skill 分析哪些需要迁移哪些不需要（上周脚本迁移后一堆 agent 手动迁移的准备工作，归 plan 分析面）。
4. **L5 bash 应该执行的不是 L6，应该是 FADE 的真正第一阶段**——bash 是触发器，不是全链执行器。
5. 推进法：先过前三阶段，再看 DCE 段 L6-L7 还需要增补哪些代码。

## §二 映射总表（L1-L7×F 系→FADE 十阶段）

| FADE 十阶段 | 现状承载 | 改造后承载 | F 系/缝隙归位 |
|---|---|---|---|
| **1 触发执行** | L1-L5 全部（cron 调度→bash 一杆全链打死） | **L1-L3+L4**：定时触发+**周算术**（触发时算清本轮 fromWeek/toWeek/startDate=参数定形+**算周断言**）+**铸 run id**+**preflight 前置检查**（含分叉预检） | F1/F6→触发告警闸；F5→L3 顺手修；**F4 主解**（预检上移）；γ 主闸（算周断言） |
| **2 Agent qualify** | 无 | **L5 载体资格**：进程执行环境 qualify（bash 载体形态/8710 healthz 探针上移）+agent 到岗窗断言 | **F2** 到岗窗无断言 |
| **3 plan skill** | 无 | **纯业务面**=迁移范围分析：哪些周 plane 内容迁/哪些不迁/carry_over 清单预审（上周手动迁移的准备工作归此）·产出迁移清单候审 | γ 二道闸（verify 对表） |
| **4 DCE** | L5 bash+L6 四段+L7 六步一杆 | **L6-L7**=确定执行本体：bash 只交棒；①pull 预检已在 preflight，段内补统一自愈标准 | **F4 副解**（段内自愈）；δ 缝隙 |
| **5 verify cli** | L7 步4 validate（部分） | 迁移后验证独立成段：新周 index active+**对表 plan 清单** | γ 二道闸 |
| **6 score cli** | fallback patrol 旧形 | score_engine 实弹（J5-J7 灰度退出条件） | **F3**（走件⑥改卷制） |
| **7 score skill** | 评分卷面 | 不变（考卷侧） | — |
| **8 close skill** | L7 步5 agent_close（部分） | 复核+升级清单提取 | — |
| **9 close cli** | 无显式 | run 收口：run id 终态落卷（每次巡检 commit 即该 run 终态·FADE-012 适配语义） | — |
| **10 结论与动作** | L7 步6 聚合+notify | 结论聚合+通知+F 系登记销项 | **ζ** 成功通知不可达（候验证定性） |

读法：现状=第 1 格吞掉了 1/4/5/8/10 五个格的活；改造=十格各归其位，bash 只干第 1 格。

## §三 第一阶段（触发执行）规范化实现要点

1. **铸 run id**：触发时定 run id（形制候议：`shift-W{week}-{YYYYMMDD}T{HHMMSS}Z`）——全链携带（per-run log 目录名/聚合文件/close 记录全挂此 id）。现时间戳目录=雏形，升格为 FADE run 层身份。
2. **preflight 上移**：现 plan 前置断言四条（hostname/ff 断言/无进行中 git 操作/8710 healthz）住在迁移器 python 里（L7 内部——跑不到就永远检不了）→上移触发阶段：bash 触发器先跑 preflight 脚本，不过=这拍不执行+告警。**分叉预检在 preflight=F4 的「执行段 15 秒死」改形为「触发段预检拦截」——同样死，死得早、死得响、死在正确阶段**。
3. **触发告警闸**：F1/F6 合并判据=漏拍或败跑 N 分钟无 per-run 成功日志即告警；挂 job 级非 service 级（degraded 阈值 3 对周任务=3 周窗·BOD 研究 §二判读）。
4. **bash 改形**：job command 从「pull+迁移器+commit+push」改为「preflight→铸 run id→交棒 FADE 流水线」——后续 qualify/plan/DCE 由流水线接（agent 承接面）。
5. **F5 顺手修**：env 键对齐或 store 路径显式配置化（活体实证：河源 store 落仓内 `./data/cron/jobs.json`·logs 落 `/var/lib/trirmc/cron/logs`·分家两目录·11-12 深探再证）。

## §四 F 系全档背景（CEO 问·简答入档）

F 系=FADE-001 改进文档的「发现候选」编号族（Finding 1-6）。背景：CEO 11-10 11:08 令立改进文档，工作法=逐段拆解、每段从卷面/代码/实弹三面取证、发现编 F 号、候 CEO 同意转正、改造候批排期。F1-F3=第一段初拆发现（20:16 判转正）；F4-F6=触发流程导读共读新挖（20:38 入档）。性质=缺陷登记簿+改造候选池，本映射=拆 F 系归位到十阶段。

## §五 确认与授权记录（CEO 23:06 令）

1. **映射方向勘正**（CEO 23:06）：原表 L4 归 plan skill **不对**——**L4-L5 都在前两阶段**：L4 周算术=阶段 1 触发参数定形（算清本轮迁哪周+算周断言），L5 进程执行=阶段 2 载体资格；plan skill=纯业务面迁移范围分析。§二表已按此勘正。
2. **联审授权**（CEO 23:06）：第一阶段五要点（§三）交 COS/COO/CPO/CTO 四席联审，**联审结果不必报 CEO，COS 批即可**（联审通过=COS 径批生效·裁决权下放域内）。
3. **CEO 阅面=第一阶段施工方案稿**：联审批后出施工方案稿呈 CEO（run id 形制/preflight 脚本形态/告警闸挂点/bash 改形细节）。
4. **三层教训转正**：CEO「统一纳入」同意令已得，真源 §三 G1-G3 已记（7da350710）。
