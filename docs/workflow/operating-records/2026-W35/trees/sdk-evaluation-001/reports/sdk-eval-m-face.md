# M 面 SDK 评估报告：orchestrate_tick.py 的 Popen vs 官方 Agent SDK

- 节点：E1
- agent：ChiefTechnologyOfficer（CTO 小狄）
- 树：sdk-evaluation-001（2026-W35，face=m-face，domainRouting=server-executable）
- 起始时刻：2026-08-30T07:47:58Z
- 评估对象：`/srv/fleet/TriCompany/runtime/cognition/orchestrate_tick.py`（全文 489 行，亲读）vs 官方 Agent SDK（依据编排层 2026-08-30T07:43Z 文档快照，转引）
- 基线 commit：未采集（本节点无 Bash 工具面，未读工作仓 HEAD，见证据边界）

---

## 维度①：SDK 结构化 API vs Popen 的 stdout 重定向 + JSON envelope 解析

### 1.1 现实现（Popen 形态，亲读行号）

- spawn 构建：`cmd = ["claude", "-p", …]`（orchestrate_tick.py L425-426），显式钉模型 `--model`（L428，防 HOME 配置漂移事故），工具白名单 `--allowedTools` 约 40 项（L431-441：Read/Glob/Grep/Write/Edit + git 全族 + npm/tsc/node/python + Task），输出合同 `--output-format json`（L442）。
- 发射形态：`subprocess.Popen(cmd, cwd=…, stdout=log_fh, stderr=STDOUT)` 异步发射不阻塞（L459-460），stdout 重定向到 `orchestrator-session-<ts>.log`（L457）。detach 是有意设计——修复「同步等待被 trimc 600s timeout 杀死长任务、连续 52 次」事故（L455-456 注释自述）。
- 结果消费：非实时。下一轮 tick 由 `_harvest_usage`（L290-342）收割——以 `'"type":"result"'` 存在性判会话结束（L308），`rfind("\n{")` 取尾部 JSON envelope（L310-311），读 `usage` 四项 token 求和入成本台账（L313-314），并程序化派生 rc 回填 registry（L326-339，CTO-F7 立法的 Close CLI 载体）。
- 工具/权限管理：纯 CLI 参数白名单（L431-441），无运行时动态管理。
- 会话模型：每 tick fresh 会话，无恢复语义（BRIEF_V2 L218「fresh 子实例、一次一个节点禁复用」）。

### 1.2 SDK 提供（转引自快照，非亲读官方原文）

- 进程内可编程库：官方定义「把 Claude Code 的同一套工具、agent loop 与上下文管理做成可编程库」，运行在宿主自己的进程内，仅 Python/TypeScript（快照 §一 L9）。
- `query()` 返回 AsyncGenerator 消息流，prompt 支持双向流式输入（快照 §二 L26-31）；接收侧含 `StreamEvent` partial streaming 细粒度流式事件（快照 L42）。
- 工具管理：Options `allowedTools`/`disallowedTools` 结构化数组（快照 L34），与现 `--allowedTools` 白名单等价映射。
- 会话恢复：`resume`/`forkSession`/`resumeSessionAt`/`persistSession`（快照 L38）。
- 结构化输出：`outputFormat: { type: 'json_schema', schema }`（快照 L43）；hooks 回调（快照 L36）；预算项 `maxBudgetUsd`/`taskBudget`（快照 L41）。

### 1.3 对比判定

SDK 能力面是现 M 面契约的**严格超集，但增量部分无现役消费者**：

| SDK 能力 | 现役消费者 | 判定 |
| --- | --- | --- |
| 流式消息 StreamEvent | 无——detach 后无人读流，仅收尾收割 | 冗余 |
| 会话 resume/fork | 无——fresh-session 模型，恢复靠树状态+节点报告（§2.7 断点交接） | 冗余 |
| hooks 回调 | 无——通知走邮件 notify（L261-268）与边沿触发（L373-375） | 冗余 |
| allowedTools 结构化 | 有——但 CLI 参数已等价覆盖（L431-441） | 零增量 |
| 结构化 outputFormat | 部分——`--output-format json` envelope 已够（L442 + L308-315） | 低增量 |

## 维度②：迁移成本（代码改动量 / 测试回归 / 部署影响）

### 2.1 代码改动量（估：改动面远大于 spawn 段本身）

- 表层：spawn 构建段（L425-462）重写为 SDK `query()` 调用，约 40 行。
- 深层一（pid 锚全链失效）：SDK 进程内执行意味着没有独立子进程 OS pid——`_pid_alive`（L83-91）、运行锁四通道中的 pid 存活通道②（L109-113）与台账反查通道③（L114-120）、锁内补记 spawn pid（L473-478，P0-1① 修正）、registry ticks 的 pid 字段（L482）全部要重设计为「进程内任务句柄」语义。这是登记段四不变量中「恢复锚」的实现层重建。
- 深层二（harvest/Close CLI 载体重建）：`_harvest_usage`（L290-342）整体失效——SDK 形态不再产生 `orchestrator-session-*.log` 文件与 `'"type":"result"'` envelope（解析门 L308）；token 台账采集要改为进程内消息订阅，rc 派生匹配器（L326-339，含「前 14 位」修正判例）随 envelope 形态改变重写。该收割器是 FADE-006 映射表声明的 Close CLI 载体（L296-297 docstring 自述 CTO-F7；fade-protocol-spec.md L174）。
- 深层三（异步形态倒退风险）：Popen detach 解决的正是长会话阻塞问题（L455-456）。SDK 进程内 `query()` 要求宿主进程存活整个会话期（30 分钟级）；要么重新引入长阻塞（倒退回 52 次被杀事故的形态），要么自建线程/子进程托管——后者等于把库本来收编的子进程编排又自己写一遍，净复杂度上升。

### 2.2 测试回归面

现实现的确定性资产全部围绕「pid + 日志文件」形态建成，迁移均需回归：O_EXCL 原子锁竞态（L401-417）、陈旧锁四通道判定（L94-124）、战役续跑指纹边沿（L377-387）、预算双门（L160-169，读数依赖 harvest 入账）、harvest 去重（L299/L320）、spawn cwd 树路由（L444-453）。

### 2.3 部署影响

- 宿主是 python3.8（L20 用法自述）——需引入 pip 依赖；Python SDK 包版本与对 3.8 的兼容矩阵**未实证**（见证据边界）。
- 认证：现部署以 `HOME=/home/fleet`（L443）复用现有 CC 凭据；SDK 认证官方注明走 API key 方法（转引快照 L17），现有凭据形态能否被 Python SDK 复用未实证。
- 关键事实：**SDK 不消除 Claude Code 运行时依赖**——TS SDK 以 optional dependency 形态捆绑 native CLI 二进制，找不到时报 `Native CLI binary … not found`（转引快照 L44）。即迁移后跑的仍是同一个 native CLI，只是把约 30 行 Popen 编排换成库调用 + 上述三处深层重建，另引入 Anthropic Commercial Terms 约束的闭源依赖与 Python/TS 宿主绑定（转引快照 L17-L18）。

**成本判定：改动量（三处深层重建）与回归面显著大于收益（维度①已判增量能力零消费者），在低成本护栏（月度 1000 元上限，L3-4 CEO 成本裁决 + L160-169 双门）下成本-收益倒挂。**

## 维度③：对段-实现映射表的影响（是否触发 fade-protocol-spec.md §2.8 降级合同重审）

### 3.1 降级合同本体——不触发重审

载体降级合同立法于 §2.8 细则 4（CTO-F2，fade-protocol-spec.md L260）：「**agent 会话承载 DCE 时**，DCE 不变量降级为『先写后报 + 原子即提交 + §2.7 节点收口报告即产物合同』，envelope 义务仅及于会话内调用的确定性 CLI」。该合同的触发键是「DCE 载体 = agent 会话」这一**载体类别**，不是 spawn 机制（Popen vs SDK 进程内）。换成 SDK 后 DCE 仍是 agent 会话，降级不变量逐条不受影响。十段合同速写表 DCE 行同样按载体类别指向细则 4（L244）。**结论：不触发 §2.8 降级合同重审。**

### 3.2 触发的是段-实现映射表变更登记义务（细则 2/3/7b）

§2.8 立法原则「协议管不变量，实例管载体」（L227、L257）；实例入册时声明段-实现映射表，最小 schema 三字段（细则 2，L258）；载体层开放枚举不入 validation，合规性 = 映射表声明 + 周检「声明载体 vs 实际载体」漂移核对（细则 3，L259；齿条 b，L263）。spawn 载体形态变化将击中三处已声明载体：

1. **登记段载体**：执行面声明为「registry (treeId,tick,pid) 三元组 + hook.log」（合法载体示例，L253）——pid 锚在 SDK 进程内形态下失义（维度②深层一），映射表须改声明，否则周检漂移核对持续报警。
2. **Close CLI 载体**：FADE-006 声明的 tick 台账回收器（§2.5 L174「被裁决会话不得自证终值」+ orchestrate_tick.py L296-297）绑定 result envelope 与日志文件名——SDK 形态下需重写并更新声明。
3. **立法完成度约束**：细则 10（L266）「接线 + 实测才算立法完成」——若未来真做迁移，新载体声明必须带实测证伪记录，不得纸面换声明。

### 3.3 附带核对

FADE-006 复审触发条款（细则 8，L264）键在「006 补评暴露结构性缺陷」，与本迁移无直接耦合，不因本评估触发。协议对载体变更本身是宽容的（细则 1「不约束载体命名与形态」，L257），受控成本在映射表登记与周检漂移窗，非协议级重审。

## 维度④：结论

### 结论：不替换（维持 Popen + CLI 子进程形态），附条件复评触发器

**理由：**

1. **官方选型逻辑不支持「必须换」**：官方对非 Python/TS 宿主的推荐路径恰恰是「run the CLI as a subprocess with the `-p` flag and `--output-format json`」（转引快照 §一 L15）——即现形态是官方承认的一等公民路径；选型表第一行（Agent SDK 适用场景=自建 tool loop 构建 agent）针对的是构建型场景，与本仓「cron fire-and-forget 派工编排会话」形态不吻合（转引快照 L11-L12）。
2. **增量能力零消费者**（维度①）：流式/会话恢复/hooks/schema 输出在现 fire-and-forget + 尾部收割契约下没有读取方；等价能力（工具白名单、JSON 输出）CLI 参数已覆盖。
3. **真实迁移成本在下游基建而非 spawn 段**（维度②）：pid 锚全链 + harvest/Close CLI 载体 + 异步 detach 语义三处深层重建，测试回归面覆盖锁/指纹/预算/harvest 全部确定性资产，净复杂度上升；且 SDK 不消除 native CLI 运行时依赖（转引快照 L44），换来的只是编排代码的库化。
4. **依赖代价**：引入 Anthropic Commercial Terms 约束的闭源运行时绑定（转引快照 L17-L18），与 M 面低成本、少依赖的护栏姿态不符；R 面自研原则的张力另见 E2（快照 §三 L50 已点出），M 面引入 SDK 也会在叙事上削弱「编排引擎自主可控」的一致性。

**条件复评触发器（未来出现任一即重启条件替换评估）：**

- C1：M 面需要消费中间流式消息（如 trilc push-as-push 落地后的实时进度通道，orchestrate_tick.py L16-17 现挂 M3）；
- C2：编排模型需要跨 tick 会话恢复/续跑（resume/forkSession），放弃 fresh-session 模型；
- C3：需要 schema 化结构化输出（outputFormat json_schema）替代尾部 envelope 解析，且已接受连带重建 pid 锚与 Close CLI 载体的成本；
- C4：Python SDK 实证支持现宿主 python3.8（或宿主升级），且现有 fleet 凭据形态实证可用；
- C5：官方宣布 CLI `-p` headless 路径进入弃用周期（转引快照 L19 的 changelog 入口可作监控点）。

## 证据清单（亲读 file:line 锚点）

1. `/srv/fleet/TriCompany/runtime/cognition/orchestrate_tick.py`（全文 489 行亲读）：
   - L20 用法（python3.8 宿主）；L37-43 路径常量；L45-52 价格表
   - L83-91 `_pid_alive`；L94-124 `_lock_stale_or_absent` 四通道（② pid L109-113、③ 台账反查 L114-120）
   - L160-169 `budget_check` 预算双门；L175-210 `evaluate_backlog` 三重门
   - L290-342 `_harvest_usage`（L296-297 Close CLI 载体 CTO-F7 自述；L308 result 门；L310-311 rfind 解析；L313-314 usage 求和；L326-339 rc 派生回填）
   - L213-246 BRIEF_V2（L218 fresh 子实例纪律）
   - L401-417 O_EXCL 原子锁；L425-442 cmd 构建（L428 --model、L431-441 --allowedTools、L442 --output-format json）；L443 HOME 覆写；L444-453 spawn cwd 树路由
   - L455-461 异步发射注释与 Popen（L456 trimc 600s timeout 连续 52 次事故注释；L459-460 Popen 调用）
   - L473-478 锁内补记 spawn pid；L479-483 registry ticks append（L482 pid/trigger）；L484 指纹写入
2. `/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/sdk-evaluation-001/reports/agent-sdk-docs-snapshot.md`（全文 51 行亲读，**内容为转引**）：§一 L9-L19（L11-L14 选型表、L15 CLI 子进程官方边界、L17 认证、L18 许可）；§二 L23-L44（L26-31 query/流式、L34 allowedTools、L38 resume 族、L42 StreamEvent、L43 outputFormat、L44 native CLI 捆绑）；§三 L48-L50
3. `/srv/fleet/TriCompany/docs/engineering/fade-protocol-spec.md`（v2.0.3，相关节亲读）：§一 L59 运行标识聚合键；§1.1 L98 在册五实例；§2.5 L174 Close CLI 载体裁定（CTO-F7）；§2.8 L225-266（立法原则 L227/L257、十段表 DCE 行 L244、合法载体示例 L253、细则 2 L258、细则 3 L259、细则 4 降级合同 L260、细则 7 齿条 L263、细则 8 L264、细则 10 立法完成度 L266）
4. `/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/sdk-evaluation-001/tree-op.json`（全文亲读）：L15 E1 action 本体；L27 E3；L32-34 notes（CEO 08-28 指令、M/R 形态区分、R 面自主可控原则）

## 证据边界（未实证项如实标注）

1. **未实跑 SDK**：本报告基于文档快照静态评估，无安装/import/试跑验证；API 行为以快照转录为准。
2. **Python SDK 信息缺口**：快照仅转录 overview + TypeScript API 页；Python SDK（PyPI 包）的包名、版本号、对 python3.8 的兼容矩阵、API 与 TS 的同构程度均**未实证**——本报告对 Python SDK 的判断基于快照 §三 L48「同族 API」一句（转引），此为本报告最薄弱证据点。
3. **快照为转录非原文**：快照头 L5 自述为 WebFetch 要点级转录（非字节级镜像）；本报告所有 SDK 引文均标「转引」，逐字原文需授权侧/后续节点复核 code.claude.com 原 URL。
4. **认证可用性未实证**：现有 `HOME=/home/fleet` 凭据形态能否被 SDK 复用、API key 方法与现部署的兼容性，均未验证（快照 L17 仅给出官方认证边界声明）。
5. **「52 次被杀事故」为源码注释自述**（orchestrate_tick.py L456），未回溯 cron/trimc 日志独立复核；「pid 锚失效」结论为静态推演（SDK 进程内执行→无独立子进程 pid），Python SDK 是否自带子进程托管模式未实证。
6. **基线 commit 未采集**：本节点无 Bash 工具面，未读工作仓 HEAD；行数证据以 Read 工具行号为准（本报告估约 150 行，编排层机械核验）。
7. 本报告只覆盖 M 面（orchestrate_tick.py）；R 面（TriRMC rmc_tick.py urllib 形态）由 E2 独立评估，本报告不越界下 R 面结论，仅在理由 4 提及叙事一致性时引用快照 §三 L50（转引）。
