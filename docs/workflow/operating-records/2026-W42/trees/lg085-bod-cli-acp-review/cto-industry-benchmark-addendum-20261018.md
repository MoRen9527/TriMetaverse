# CTO 增补卷 · 行业对标三处（CEO 10:09 令·勿闭门造车）· 2026-10-18

- sourceOfTruth: 本卷（trees/lg085-bod-cli-acp-review/cto-industry-benchmark-addendum-20261018.md）
- syncMode: static（BOD 10:14 增补派工·候 12:00 评审并入并表卷 §七·主锚=本席六问卷 b281b0546）
- lastSyncedAt: 2026-10-18T02:19:22Z（+8=10:19:22 北京·date 现查原值粘贴·D-47 机械闸）
- 令源: CEO 10:09:30 原话「这个还是不要闭门造车，要参考行业内是否有此做法，如果没有要分析我们的风险和优势」→BOD 10:14 派工三处增补
- 标注合同（照派工）：每项三选一显式——【行业有先例·列出处】/【无先例·析风险优势】/【证据不足·标未决】；检索未覆盖面如实标注，禁当已证写。

## 结论先行

1. **①进程模型并单（统一 worker·策略分池）——【行业有先例】**：Erlang/OTP supervisor child spec 官方原生三 restart 类型（permanent/transient/temporary）即「同一监督树内按子进程角色施不同重启策略」的教科书形态；我们「job 短命池+人格席长驻池」与之一一对应。分席双池（不同 supervisor 树按身份分池）**未检索到主流先例**（标注：定向检索「actor 框架按角色分池」未获直接命中，属检索范围限制非不存在）——但双池无必要性的论证不依赖此：Erlang 先例已示「统一池+策略差异」可行且为主流。
2. **②daemon+每会话独立子进程——【行业有先例·两面都有】**：正例=Chromium（browser process 当 supervisor·每 tab 独立 renderer·崩溃隔离）、containerd/shim（shim-per-container·daemon 重启容器不断）、OpenHands（agent loop 在沙箱外·每会话独立 Docker 容器）。反例面同样成立：同构形态（daemon 管理进程+每会话子进程）在强耦合实现下 daemon 死则全体死（PG postmaster 形——本席知识面陈述·未检索验证），行业正解的胜负手在**耦合度**（状态外置+弱耦合可重连）不在「是否有子进程」。CEO 判「单 daemon 单点故障属缺陷」成立，且行业已给出修法正形。
3. **③soul-loader 四面分布（MC 有 LC 无）——【行业有先例·装配/托管分离】**：OpenAI Assistants API 的 Assistant（持久 persona 对象）/Thread（会话）/Run（执行）三分离+OpenHands（persona 在 agent 配置·会话隔离在容器层）均示「人格装配层」与「会话托管层」是可分可合的两个正交件。LC 侧现无人格消费需求——不装=件跟消费走的正形（非缺位）；真需求出现时装配属半日级移植（骨架已在 MC 面实勘在案）。

## §① 进程模型并单行业对标（统一 worker·策略分池 vs 分席双池）

**标注：【行业有先例】（统一模型·策略分池）；【未检索到先例】（分席双池·检索范围限制）**

| 对标系 | 形态 | 出处（检索实锚） | 与我方对应 |
| --- | --- | --- | --- |
| **Erlang/OTP supervisor** | 一棵监督树统一管所有 worker，**每个 child spec 独立声明 restart 类型**：permanent（总是重启）/transient（仅异常退出重启）/temporary（永不重启——跑完即弃） | erlang.org/doc/apps/stdlib/supervisor.html + sup_princ.html（官方文档·本次检索直锚） | **正名映射**：job=temporary（跑完即退不重启）·人格席=permanent（崩了必拉起）——「统一 worker 模型·策略分池」=OTP 原生形态，策略差异住在配置层不住在架构层 |
| Chrome tab 生命周期 | 同一 browser process 下 tab 冻结/丢弃（discard）与活跃 tab 施不同生命周期策略 | chromium.org multi-process-architecture（§②同源） | 策略分池同构（对象类型差异→策略差异） |
| 我方现形 | process-supervisor 现役 `replaceExistingScope` 语义 + 六问卷②建议：job 短命池（scopeKey 顶替）+人格席长驻池（attach+idle 休眠+激活重生）；分席双池无必要 | 本席六问卷 b281b0546 §② | 与 Erlang child spec 三类型一一对应·属「行业正名」非自创 |

**分席双池判读**：定向检索（actor 框架 job/常驻会话分池·OpenHands/LangGraph 内部进程分池）**未获「按席位身份分双池」的主流先例命中**——行业通形是统一监督/池化+按 child 角色（job/service）施策略差异。我方风险与优势分析（若未来被迫分席双池）：风险=运维面翻倍+调度资源竞争失控点翻倍+策略漂移（两池各自演化重演电源面改名分叉教训）；优势=故障域物理隔离（但 Erlang/Chrome 均示隔离可在同池内以进程/重启策略达成，无需架构层分池）。重评触发判据两条照六问卷②（job 高频实测挤占资源/安全域分化）不变。

## §② daemon+每会话独立子进程（N 进程）：先例与反例

**标注：【行业有先例】（正例两系+agent 领域一系）；反例面【公共架构知识·未检索验证】（PG 形）**

| 对标系 | 形态 | 出处 | 对我方的启示 |
| --- | --- | --- | --- |
| **Chromium 多进程**（正例·经典形） | browser process=supervisor（跑 UI+管全部 tab 子进程）；每 tab 独立 renderer 进程；**进程 handle 监控**测崩溃→受影响 tab 收通知，他 tab 不受扰；崩溃 tab 显 sad tab 可独立重载 | chromium.org/developers/design-documents/multi-process-architecture（官方设计文档）；Gribble et al. 2009《Isolating Web Programs in Modern Browser Architectures》（学术正身·222+ 引） | 「daemon 当 supervisor+每会话子进程+handle 监控+单会话崩溃隔离」=浏览器 17 年实证形态；**单 tab 崩溃重载**≈我方「单会话 idle 休眠+激活重生」同构 |
| **containerd/shim**（正例·弱耦合正形） | **shim-per-container**：shim 作为容器父进程持有 stdio/fd；containerd daemon crash/restart **容器不断**（shim 保活）；daemon 重启后经 shim **重连 attach** 恢复管理面 | containerd.io docs（runtime v2 shim 设计·shim 须实现 delete 子命令）；moby issue #2432（daemon 重启容器存活诉求正源）；iximiuz Labs 教程（shim 角色拆解） | **直接回答 CEO 问②「daemon 死→子进程全死」的修法**：管理面与子进程生命周期解耦（父进程断开≠子进程被杀·detached spawn+IPC 断连存活+重连 attach）；已知边界：shim 未 reap 子进程 bug（containerd #5708）——警示：解耦形态须自建 reaper（我方 session-reaper 已在案·恰好对位） |
| **OpenHands**（正例·agent 领域同域先例） | agent loop+event stream **在沙箱外**（宿主侧），tool execution 在**每会话独立 Docker 容器**内；controller 管沙箱生命周期；多沙箱并行互不扰 | docs.openhands.dev/sdk/arch/overview + /sdk/guides/agent-server/docker-sandbox（官方）；Spheron 部署指南（「each session gets its own Docker sandbox」原句）；xwang.dev 架构边界文（「agent loop and event stream outside the execution runtime」设计决策拆解） | **与我方六问卷①建议逐点同构**：管理面（agent loop/event stream）留 daemon、执行体每会话隔离——agent 领域头部开源项目已用「每会话独立进程/容器」生产化 |
| LangGraph（对照形·非反例但同构于我方现形） | 无每会话子进程——daemon 内对象+checkpointer 每 super-step 落盘（thread_id scoping·Postgres/SQLite 后端）·恢复走持久层重放 | langchain-ai.github.io/langgraph（persistence/checkpoints 正身）；mcpservers.org agent-skills 条目 | 印证六问卷①**一处校准**：我方现形（daemon 内对象+session-store 持久层）=LangGraph 同类——非「无人这么干」而是「另一条被验证的路线」；子进程化是**升级**非从零发明 |
| **PG postmaster+backend**（反例面·耦合度警示） | daemon（postmaster）+每连接子进程（backend）形态本身是行业经典，但**强共享内存耦合**：postmaster 死则全 backend 退（fail-fast 设计使然） | 本席知识面陈述（数据库教科书级公共架构）·**本次检索未覆盖·标注未检索验证** | 同一形态两种命运：**胜负手在耦合度**（状态外置+弱耦合=containerd 可重连 vs 状态内嵌+强耦合=PG 全体退）——我方施工时「IPC 面薄+会话状态外置 session-store」是达成 containerd 形而非 PG 形的关键约束 |

**场景适配边界（诚实标注）**：多进程隔离的代价=每进程内存与调度开销（Chromium 文档与社区均承认多 tab 内存放大）。行业对高并发短连接场景的反解=nginx event-driven 单进程（本席知识面·未检索验证）——我方场景是**低并发长寿命重会话**（≤几十席×小时级寿命），隔离收益（崩溃域/休眠重生）≫开销，属形态适配区而非反例区。

## §③ soul-loader 四面分布（MC 有 LC 无）：LC 侧装人格收益/成本/边界

**标注：【行业有先例】（装配层/托管层分离）；LC 现不装的收益成本判断=本席推断面（推断处明标）**

**行业先例（检索实锚）**：

| 对标系 | 分离形态 | 出处 |
| --- | --- | --- |
| **OpenAI Assistants API** | **Assistant（持久 persona 对象：instructions/model/tools）/Thread（会话状态）/Run（执行）三分离**——persona 装配与会话托管是两个正交 API 面；社区共识「固定 persona 层+每会话动态上下文」的装配范式 | platform.openai.com/docs/assistants（官方三对象）；community.openai 助手装配讨论；EdSpencer.net+OpenObserve 解析文（三分离拆解·本次检索直锚） |
| **OpenHands** | persona/agent 配置在宿主侧 SDK 层，会话隔离在容器层——装配与托管自然分居两层 | 同 §② OpenHands 行（docs.openhands.dev+xwang.dev） |
| **LangGraph** | persona=graph 定义时的配置项（装配时静态织入），会话状态=thread_id 持久层——同样分离 | 同 §② LangGraph 行 |

**判读（对照我方四面分布）**：

1. **「MC 有 LC 无」不是缺位是正形**：装配层（soul-loader）与会话托管层（session-store）是正交件——MC 面（服务域·TriRMC pipeline 消费 soul-loader 组装人格）有装配需求故有件；LC 面（本地域·现役无人格会话消费需求·session-store 服务的是 job/短会话托管）无消费故无件。行业先例（Assistant/Thread 分离）恰好证明**两件可独立存在**——件跟消费走（本席范式「件的分布跟着宿主环境走」六问卷③已述）。
2. **LC 侧装人格的收益**：现值=零（无消费需求·推断面：本地域现役 13 席走 dsh/harness 形·人格在 harness 侧装配·LC daemon 无人格会话 consumer）；未来期权=若 R 面本地域出现「daemon 内托管人格席」需求（六问卷①段2 交互长会话子进程化后），soul-loader 装配属**半日级移植**（MC 面骨架实勘在案：soul-loader 目录+src/pipeline/assemble.ts 单点消费——六问卷③定谳）。
3. **LC 侧装人格的成本**（推断面）：非移植本身（半日级），而是**人格资产治理链前置**——soul 资产的本机分发/版本化/更新面（现人格资产治理在 TriCompany 侧·MC 面 pipeline 消费）需先有本地域治理形态；无消费需求时建此链=纯成本。
4. **边界**：soul-loader 四面「是否都需要」的正确问法=「四面各自的消费需求何时出现」非「四面是否该对称」——与六问卷③交叉缺位判读一致（session-store LC 有 MC 无·soul-loader MC 有 LC 无=两面各按需取件）；BOD 概念卷 9.5 `file:` 同源共享形态下，加件即改 file: 依赖·零灰度风险照六问卷风险条（版本化前置）。

## 检索源清单（本卷全部 web 实锚·六发·完成于 2026-10-18 10:19+08 前·末两发回归时戳=date 现查 10:19:22+08）

1. Erlang OTP supervisor：erlang.org/doc/apps/stdlib/supervisor.html·sup_princ.html
2. containerd/shim：containerd.io docs（runtime v2）·moby issue #2432·containerd issue #5708·iximiuz Labs·OneUptime blog
3. LangGraph：langchain-ai.github.io/langgraph（persistence）·mcpservers.org agent-skills
4. OpenAI Assistants：platform.openai.com/docs/assistants·community.openai·EdSpencer.net·OpenObserve
5. OpenHands：docs.openhands.dev/sdk/arch/overview·/sdk/guides/agent-server/docker-sandbox·arxiv 2511.03690·Spheron·xwang.dev·github.com/OpenHands/openhands
6. Chromium：chromium.org/developers/design-documents/multi-process-architecture·Gribble et al. 2009

**未检索验证面（如实标注）**：PG postmaster+backend 耦合行为·nginx event-driven 单进程——本席知识面陈述（教科书级公共架构）·未当已证写。

## 使用依据

- CEO 10:09:30 令（BOD 10:14 转派三处增补·三选一标注合同）·本席六问卷 b281b0546（主锚·判读基座）
- 四仓实勘：soul-loader 双 MC 在案（10-17 干净 HEAD 勘验）·session-store 双 LC 文件级四同名（六问卷③）
- 本席建议书 b0a84b26d（三引擎矩阵）+抽层复核卷 5c476799d（四仓结构读数）
- web 检索六发实锚（§「检索源清单」全列）

—— CTO 小狄（落款 date 现查原值 2026-10-18 10:19:22 +0800·发毕对表）
