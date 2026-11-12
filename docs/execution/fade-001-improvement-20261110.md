# FADE-001 改进文档（CEO×BOD 交互拆解 · 2026-11-10 起）

- sourceOfTruth: TriMetaverse/docs/execution/fade-001-improvement-20261110.md
- syncMode: source-only
- lastSyncedAt: 2026-11-10
- 立档令: CEO 2026-11-10 11:08 直连令——「对 fade 的①-⑦待批先记录进一个 fade-001 改进文档；马上详细的一步一步的，你和我交互，把 fade-001 彻底拆解，我也学习和审核下，给出更多意见，记录进改文档，一并优化 fade-001」
- 工作法（CEO 定）: 按 FADE 规范阶段序一个阶段一个阶段过；**只有 CEO 明确说 OK 才进下一阶段**；每阶段提出的优化点**需 CEO 同意才记入本文档**。
- 进化成功判据（CEO 定）: 全部优化点记录完成后开工改造；**主观题和客观题都需要更高的分数，才叫进化成功**。

## §一 候裁清单（①-⑦·CEO 待批项入档）

| # | 事项 | 内容 | 状态 |
|---|---|---|---|
| ① | 每周自动进化蓝图骨架+三边界 | B1 自动链止于草案候批面（CEO 确认制）；B2 考卷判据改版永不自动；B3 自动化只做机械面 | 候批 |
| ② | 兜底三件时点定谳 | COO 序：P1 告警+preflight ＞ P2 隔宿心跳 ＞ P3 R 面节律 | **CEO 22:34 定谳**：P1 事后追认（既成事实有效）；P2 任务书退回候确认·勘修窗形态勘止；**树权门禁立**——拆树派工只能 COS+COO 一起·他席无权建树与开始执行·每树执行前检查 COS 授权（明确授权字段+授权值）；四席联审（COS/COO/CPO/CTO）出拦截方案（程序面+值守工作流+门禁·防 agent 直发不可拦缺陷·候方案卷呈批）；方案毕重启各席+观察期验证拦截有效性 |
| ③ | 评审制度化铸册窗 | 联审评审机制铸册（主审形态/整改边界择形随批） | 候批 |
| ④ | FADE-002 第②步衔接 | 联审蓝图与 FADE-002 排期衔接 | 候批 |
| ⑤ | 联审改进项施工批 | 拆树派工（候批后转 COO 排工） | 候批 |
| ⑥ | FADE-001 出卷规范化 | 100 分制+客观题+主观题+通过阈值；证据=N-D2 自注 145 挂账未落+同实例三卷形态分裂（主卷 threshold=80/maintenance 100 分/plane-shift 145 分零主观零阈值） | 候批 |
| ⑦ | 联审五席维度标准化 | 纳入 FADE 考题大纲；应用于 FADE-001 第一轮进化改进 | 候批 |

## §二 拆解坐标系（CEO 定谳）

**CEO 定谳（2026-11-10 20:53 直连令）**：按 FADE 规范**十阶段**逐段检查 fade-001 合规程度——**触发执行 → Agent qualify → plan skill → DCE → verify cli → score cli → score skill → close skill → close cli → 结论与动作**。现位=第一段「触发执行」（过审中·材料已呈候 OK）。

- 坐标系沿革：11:27 令曾以候选 A（FADE-001 周迁移十段=cron 触发＋迁移器五步＋FADE 四段 agent 承接面）为推荐坐标系供选——20:53 令定谳以 FADE 规范段全集为准，候选 A/B/C 三套取证留档（候选 A 内容：cron 触发（周日 23:50·job 9c81c7ec）＋迁移器五步（OP index→unresolved→trees→carry-over→通知·=push 段承载）＋FADE 四段 agent 承接面（verify→score→close-skill→close-cli）·STAGE_ORDER 正身=close_framework.py 五段常量；候选 B·IPD 十阶段；候选 C·FADE lifecycle 状态机段集——细节见 git 史 03ebcbd19 前版）。
- 段映射注（BOD 集散面如实注·不代裁）：「触发执行」段现材料=本档第一段（cron 拍·触发全链七层导读）——十阶段其余九段现状取证随逐段推进补齐；段间与候选 A 迁移十段的包含/交叠关系候 CEO 逐段裁定。
- **培训草稿同步机制（CEO 2026-11-10 20:59 令）**：RDT 培训草稿（现位=`TriCompany/docs/training/fade-001/05-trigger-chain-draft.md`·21:24 RDT 迁位定形锁笔 427705b——定形=01-04 四文档更新修正的**临时依据和记录**·边研究边更新）大纲已重组为十阶段制——现七层内容落位「触发执行」段·其余九段骨架占位不预写；**BOD 每完成一段拆解（CEO OK 后）→通知 RDT 丰富对应段**（三方完善制·也是拆解进度记录面）。派工锚=RDT 信 92a8e098·COS 台账挂锚 b5017543。

## §三 拆解记录（逐段·经 CEO 同意的优化点才入此节）

### §三.0 CEO 预审分析件（2026-11-10 11:27 令·责任与规避）

**件一·145 归一化挂账未落——责任事实链与规避**：

- 事实链：出卷+冻结=CTO 域 N-D1/N-D2 令链（11-05 冻结仪式·卷面 version 自记 CTO 执冻结）；N-D2 冻结卷行 28 自注将归一化「归 Score 实施校准项」=挂给未来；score_engine（N-D3 件②）至今未实弹→校准项前置未发生→挂账悬空；首评 13.8% 直接以 145 分母输出，复核链（值席→CTO 终判→BOD 转报）无人拦分母口径——**BOD 自领**：值守转报面未察觉分母异常（11-09 20:48 首报即照转 13.8%）。
- 责任归纳（事实自明·裁归 CEO）：①出卷形态设计（145+零主观+零阈值）=出卷/冻结链（CTO 域）设计缺口；②挂账悬空=机制缺口（卷面自注式挂账无台账承载·无责任席·无触发条件=**无主挂账必丢**）；③监督面=复核链缺「考卷形态合规」闸（BOD 转报面同责自领）。
- 规避候选（候 CEO 同意转正）：
  - J1 出卷门禁四查：冻结仪式加机械闸（百分制断言/含主观题断言/含阈值断言/权重合计断言）——四查不过冻结不放行。
  - J2 挂账必须带主：凡「归 XX 实施」式挂账必须落台账带责任席+触发条件+复查时点——禁卷面自注式挂账。
  - J3 评分输出口径门：Score 输出必带卷面元信息（总分制/阈值/卷版本）——非百分制分母即疑。
  - J4 复核链加「考卷形态对表」检查项（COS 复核/BOD 转报两处）。

**件二·score_engine 未实弹——责任事实链与规避**：

- 事实链：N-D3 四骨架（3e0994b）已交付且中性冒烟 28/28——但**冒烟≠实弹**（未在真迁移轮自动评分过）；plan 灰度条款「引擎缺席灰度=fallback patrol 旧形如实注」=设计内置的合法降级通道——11-09 首评走 fallback 完全合规→**灰度条款成了长期豁免口**（无人推实弹·一直 fallback）。
- 责任归纳：骨架施工交付=CTO 域完成；**实弹接入缺失**=灰度无退出条件（无时点/无触发器/无验收门规定「何时必须实弹」）——机制缺口：合法降级通道无 sunsetting。
- 规避候选（候 CEO 同意转正）：
  - J5 灰度必须带退出条件：任何 fallback 条款必须同时写死实弹时点或触发器（如「下一轮迁移强制实弹·失败即升级」）。
  - J6 骨架验收=实弹一案：骨架类交付验收门=中性冒烟+真轮实弹各一（冒烟单过不验收）。
  - J7 强制评分轮禁静默降级：首评/终判轮引擎缺席=升级 CEO，不得静默走 fallback。

**件三·命名与代码落差疑点（CEO 已认可「挖细节」目的）**：

- plan 行 26 自称「FADE 十段序」，STAGE_ORDER 代码常量（close_framework.py L7）实为五段——「十」=FADE 五段+迁移器五步合称，名实有落差。**已入档**（CEO 2026-11-10 11:27「是的」认可）。候选优化（候同意转正）：J8 段名与代码常量单向对表（文档段名引用代码常量名·防漂移）。

### 第一段·触发段（cron 拍）——过审中

**现状三面**：
- 设计面：cron `50 23 * * 0` Asia/Shanghai·河源 TriRMC job 9c81c7ec weekly-plane-shift（10-18 CEO 令改形）·触发后 30 分钟 agent 到岗窗（23:50-00:20）；plan 前置断言四条（hostname/ff 断言/无进行中 git 操作/8710 healthz+cron enabled 探针）。
- 考卷面：T1 触发时点纪律（权重 20）——判迁移是否 cron 零点轮触发；本轮 N/A 免评（应急链承接）。
- 实弹面：11-09 23:50 轮 cron 正常触发（push 段才失败）——触发本体无事故史；W38→W39 翻周事故根源在树迁移段非触发段。

**发现候选（候 CEO 同意转正）**：

- F1 触发漏跑无监测：job 9c81c7ec 漏拍/死亡无任何闸会发现（preflight 缺席=联审共识七项之一）——触发段是全链第一张多米诺。候选：触发后 N 分钟无 per-run 日志即告警（与候批件②P1 告警+preflight 挂钩）。
- F2 到岗窗无断言：T1 只判 cron 触发不判「agent 30 分钟到岗」——到岗窗设计存在但考卷无对应检查项。候选：T1 判据扩为「触发+到岗」双断言。
- F3 免评分母规则缺：T1 N/A 时权重 20 仍计入分母（首评分卷 20/145·若剔除 T1 应为 20/125=16% vs 13.8%）——scoreable_run 只注「异常轮按 T6 免评规则记」而 T6 免评规则未定义分母处理。**分数口径第三层疑点**（145 非标+归一化未落+免评分母规则缺）。

**CEO 判定（2026-11-10 20:16 令）**：F1-F3 全部同意入档转正。随令追加任务：写出触发流程+相关代码，CEO×BOD 一起读一遍，把触发段彻底搞清楚——代码导读呈报见下节「触发流程导读」。

### 第一段补强·触发流程导读（CEO×BOD 共读·2026-11-10 20:16 令取证）

**触发全链七层**（cron 拍→迁移器六步→推裸仓；代码锚全列）：

| 层 | 做什么 | 代码正身 |
|---|---|---|
| L1 调度判定 | cron `50 23 * * 0` Asia/Shanghai 每秒粒度判定到期 | agent-core `scheduler/cron-engine.ts`（解析）+`job-store.ts` L32-39（store 路径=`$TRIMC_CONFIG_DIR/cron/jobs.json`·缺省 `./data/cron/jobs.json`） |
| L2 执行循环 | find next-due→setTimeout→execute→repeat（DEFAULT_TICK_MS=1000ms） | agent-core `scheduler/job-executor.ts` L37/L157-160 |
| L3 服务适配 | stale-run 恢复（启动时 runningAtMs≠null 复位）+degraded 聚合（consecutiveFailures=max over jobs·阈值 3） | TriRMC `src/cron/service.ts` L1-20 |
| L4 周算术 | `{fromWeek}/{toWeek}/{startDate}` 占位符展开：toWeek=明天所在 ISO 周·startDate=下个周一·fromWeek=toWeek−1 | TriRMC `src/cron/command-handler.ts` L70-75+`week-math.ts` L58-75 |
| L5 进程执行 | `/bin/bash -e -c <command>`（runAs unset=进程用户 fleet）·detached 进程组·超时 10min（DEFAULT_JOB_TIMEOUT_MS）·stdio→per-run log | TriRMC `src/cron/command-handler.ts` L77-107 |
| L6 迁移链四段 | ①前置 ff `git pull --ff-only sg-bare dev` →②迁移器 `python3 -m runtime.cognition.weekly_plane_shift --from {fromWeek} --to {toWeek} --start-date {startDate} --operating-root … --sync` →③`git add+commit`（TriRMC-Scheduler 身份）→④`git push sg-bare HEAD:dev ‖ (fetch+merge+push 重试)` | 河源 `/srv/fleet/TriRMC/data/cron/jobs.json` job 9c81c7ec payload.command |
| L7 迁移器六步 | 1 create（幂等）→2 migrate（旧周→新周内含 retire）→3 carry_over（unresolved §1 平移·周计数+1·4w/8w 升级标重算）→4 validate（新周 index active）→5 agent_close/review_shift（复核+8w 升级清单提取）→6 聚合 `.shift-ade.json`+notify（SMTP+TriLC 8711 POST） | `TriCompany/runtime/cognition/weekly_plane_shift.py` L216-285（main 全序） |

**活体读数（2026-11-10 20:1x 河源直探 jobs.json state·调度面 LastRun 真值）**：

- job 9c81c7ec：runCount=11·**lastRun=11-08 23:50+08（周日轮准点触发）→status=error**·`lastError=git pull --ff-only` code 128 diverging（sg-bare/dev `0cc423283..ac1e2380e` 分叉）·lastDurationMs=15259（**15 秒死在第①段**）·consecutiveErrors=1·nextRun=11-15 23:50+08
- **W45→W46 迁移实态**：11-08 轮五步全未跑（死在迁移器之前）；W46 `.shift-ade.json`（pass·六步全绿）check_time=**11-09 17:24+08=应急/人工补跑产物**（runbook §5 兜底路径·迁移 commit 6860bf87b）——非 cron 轮产物。11-09 首评分卷（13.8%·T1 N/A 应急链承接）评的正是这个应急态。
- **勘误入档**：本席前记「11-09 23:50 轮 cron 正常触发（push 段才失败）」与活体读数不符——11-09 为周一无 cron 触发·真值=11-08 周日轮 15 秒死于前置 ff 段。假读数自纠照档（活性必双面纪律适用案）。

**导读中新挖发现（CEO 2026-11-10 20:38 令全部入档·F 系续编）**：

- **F4 前置 ff 段无 fallback**：④push 段带 `‖(fetch+merge+push)` 自愈而①pull 段裸奔——pull diverging（co-tenancy 竞速族·8712 oprec-sync 同族机理）无自愈路径·11-08 轮 15 秒死即实证。改造候选：①段补自愈（fetch+merge/重试退避）或改幂等 pull 形（候施工批）。
- **F5 store 路径双形分裂**：agent-core job-store 读 `$TRIMC_CONFIG_DIR/cron/jobs.json`（env 键 TRIMC_CONFIG_DIR）·TriRMC 服务注入的是 `TRIRMC_CONFIG_DIR=/var/lib/trirmc`→键错位·store 实落 TriRMC 仓内 `./data/cron/jobs.json` 而 per-run logs 落 `/var/lib/trirmc/cron/logs`（TRIRMC_CONFIG_DIR）——**store 与 logs 分家两目录**·运维按 CONFIG_DIR 找 store 扑空（本席取证现场实证一次）。改造候选：env 键对齐或 store 路径显式配置化（候施工批）。
- **F6 失败轮无闸（并入 F1 判据·CEO 20:38 令）**：11-08 轮 error 后 consecutiveErrors=1<阈值 3 不 degraded·无告警外发·无自动补跑·nextRun 照排下周——迁移悬空整 18 小时（11-08 23:50→11-09 17:24）靠值席 patrol 兜底。与已入档 F1 同族互证（F1=漏拍无监测·F6=败跑无监测）——**F1 判据扩形定谳：「漏拍或败跑 N 分钟无 per-run 成功日志即告警」**（候改造批落）。

**下轮现势风险注**：nextRun=11-15 23:50——若 sg-bare/dev 与 TriRMC 工作树再现 diverging·①段将再挂（F4 未修前）·候改造批统筹。

### 拆解记录格式

- 每段: 现状（卷面/代码/实弹三面）→ 发现 → 优化点候选（CEO 同意后转正）→ CEO 判定

### CEO 定调·十阶段映射方向+三层教训转正（2026-11-12 22:47 直连令·BOD 代记 11-12 深夜）

**映射方向（CEO 定调）**：L6-L7=十阶段第 4 段 DCE 确定执行本体；触发阶段改造后承载 FADE 前三段——触发执行（**定 run id**+**前置检查**）→Agent qualify（准入资格）→plan skill（迁移范围分析：哪些迁/哪些不迁·上周脚本迁移后手动迁移的准备工作归此）。**L5 bash 应执行的不是 L6 全链，应是 FADE 真正第一阶段**（触发器非全链执行器）。周迁移爱出错的根因=触发即全量执行（无阶段闸·L1-L5 小问题直接炸在业务本体）。推进法=先过前三阶段，再看 DCE 段 L6-L7 增补。
**勘正（CEO 2026-11-12 23:06）**：**L4-L5 都在前两阶段**——L4 周算术=阶段 1 触发参数定形（算清本轮 fromWeek/toWeek/startDate+算周断言·不归 plan skill）；L5 进程执行=阶段 2 载体资格（执行环境 qualify）；plan skill=纯业务面迁移范围分析。
**联审授权（CEO 23:06）**：第一阶段五要点交 COS/COO/CPO/CTO 四席联审，结果不报 CEO、COS 批即可（联审通过=径批生效）；CEO 阅面=联审批后的第一阶段施工方案稿。
映射总表+F 系归位+BOD 研究笔记见 `operating-records/2026-W46/trees/fade001-ten-stage-mapping-20261112.md`+`fade001-phase1-trigger-study-bod-20261112.md`。

**三层教训（CEO 令「统一纳入 fade-001 新优化」=同意转正·11-12 深夜）**：

- G1 调度面活≠执行面活——job 准点触发（runCount+1）不等于业务成功（11-08 轮 15 秒死）。判活性必双面（家族纪律成文化）。
- G2 失败检测靠人不靠闸——错误发生后 18 小时无一环节主动喊人；F1（漏拍）+F6（败跑）合判=触发段是全链第一张多米诺且倒下时无声。
- G3 兜底路径救场不救制度——runbook §5 人工补跑有效的前提是「有人恰好巡检到了」；制度可靠性不能押人的自觉（F 系改造候选的全部动机）。

**①段 pull 优化判（CEO 问「需要优化么」·BOD 判候选）**：需要。按映射定调方向=分叉预检上移触发前置检查（preflight）消解执行段死亡+DCE 段重构统一自愈标准（候方案细化随第一阶段批）。

**活体补充实锚（11-12 BOD 河源深探）**：store 实位=`/srv/fleet/TriRMC/data/cron/jobs.json`（systemd WorkingDirectory=/srv/fleet/TriRMC·相对路径落仓内）+`/var/lib/trirmc/cron/` 仅 logs——F5「store 与 logs 分家两目录」活体再证；本机检出无 `data/cron/`（.gitignore 运行时数据·正常）。

## §四 改造施工区（候 §三 全部记录完成后启动）

（空·候 §三 收口）

## 附: 关键实锚索引

- 考卷三件: TriCompany/docs/engineering/fade-papers/FADE-001-paper.json（threshold=80·10 工件 items）/ FADE-001-paper-maintenance.json（100 分·threshold 在卷）/ FADE-001-paper-plane-shift.json（1.1-frozen bf8ba0e0·T1-T9 权重 145·零主观零阈值）
- STAGE_ORDER 正身: TriCompany/runtime/fade_protocol/close_framework.py L7（五段常量）
- agent plan 正身: TriCompany/docs/engineering/fade-001-plane-shift-agent-plan.md（升版 2026-11-08）
- 协议正身: TriCompany/docs/engineering/fade-protocol-spec.md
- 首评分卷: operating-records/2026-W46/trees/首评分卷-20261109.md（13.8%=20/145 RETRY 级·判级走 N-D5 预案非卷内阈值）
- 联审总卷: operating-records/2026-W46/trees/fade001-migration-review-20261109/review-integration-20261109.md（TMV 460576e3e）
- N-D2 冻结卷: operating-records/2026-W45/trees/w45-carryover-fade001-upgrade/nd2-paper-freeze-20261105.md（行 28 自注 145 挂账）
