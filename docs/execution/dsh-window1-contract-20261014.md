# dsh 窗1 序1 接口合同·R 面服务域班组（五件定稿）

- sourceOfTruth: 本件（docs/execution/dsh-window1-contract-20261014.md）
- syncMode: static（窗1 序1 合同定稿·候会签）
- lastSyncedAt: 2026-10-14T11:28:11Z（date 现查·写前跑）
- 令源: CEO 2026-10-14 19:17 令「dsh 窗1 五序现在干」（BOD 19:17:42 派工转达）——本席主责件=序1 接口合同定稿
- 基线: dsh 方案稿 v3（`e89cef5ae`·docs/execution/dsh-rplane-harness-design-20261014.md）；dsh 真源=github.com/deepseek-ai/deepseek-harness master（10-09 推送·developer preview·公共 API pre-stable·官方明示 compatibility-breaking changes）
- 深勘方法: gh API 直读仓库 docs/ 谱+packages 源码（agent-lifecycle / system-prompt subsystem / config-catalog / api-gateway / schedule guide / persona·agent-preset·agent-preset-registry·acp 四包 README）——非记忆非转述；文档站未另访（仓库 docs/ 为同源正形）
- 会签面: 本席（CTO 小狄）+ R 面 COO（未设位——合同稿先行·候设位补签不阻塞·照 BOD 注记①）

## 〇、结论先行（五件核死判）

1. **适配件对接面=ACP（JSON-RPC stdio）**，非 Typert RPC 非 Web UI——`@deepseek-ai/dsh-acp` 官方 automation-only 定位精准，stdio 同机直连消解跨公网端口暴露问题。
2. **compass 承接位=PromptContext（cache-safe durable user-role snapshot）**，非 PromptSection——KV cache 友好是 dsh 官方设计目标，与 compass「开工注入灵活层」角色精确对位。
3. **身份/persona 承接=deployment-wide personaPrefix 配置（dsh-system-prompt 行）**，窗1 零 bundle patch——专机专用前提下单份身份成立。
4. **v3 稿 §五-5「minimal 起步」修订为「acp profile 起步」**——minimal 无 schedule 四工具且 acp profile 自含持久化+自动化合同面，比 minimal 更贴窗1 烟测需求。
5. **TriRMC tick 与 dsh schedule 分层职责铸死**：TriRMC 8710 cron=外层心跳+升级链（dsh Host 外）；dsh schedule 四工具=执行层内层定时（Host 活着才有意义）——dsh schedule 不替代 TriRMC tick。

## 一、件① 转译层映射表（源侧五件套 → dsh 三件资产·字段级）

> dsh 侧正形（深勘证实）：agent-preset（Cordis YAML 声明 `id/plugins/name/description/order`·eager 加载）+ persona 行（shadow `deployment:persona-prefix/suffix` 两共享槽）+ system-prompt 装配 waterfall（sections 升序拼接+PromptContext 动态上下文+render 时 `{{var}}` 严格插值）。

| 源侧五件套 | dsh 承接正形 | 载体（config 键） | 渲染时点 | 硬约束 |
| --- | --- | --- | --- | --- |
| frontmatter（工具面声明） | preset composition rows | `@deepseek-ai/dsh-agent-preset` 行 `config.plugins` 清单 | preset 声明 eager 加载 | 活体 Agent composition 稳定（KV cache）·**编辑只影响随后创建的 Agent** |
| agent-body〈身份气质段〉 | persona prefix | `@deepseek-ai/dsh-system-prompt` 行 `config.personaPrefix`（deployment-wide）或 persona 行 `config.prefix`（scoped） | render 时插值 | `{{variable}}` 严格解析（无注册变量=失败非静默） |
| agent-body〈纪律/行为约定段〉 | persona suffix / static section | `config.personaSuffix` 或 PromptSection（static text·低频变） | render 时插值 / 每 assembly | suffix 空文本也 shadow 全局 suffix（非继承） |
| compass（灵活可变层·开工注入） | **PromptContext** | context 注册（`ctx.systemPrompt.context`·name+order+provider） | 每次开工 assembly 求值 | **cache-safe**：变化才 log 进 history；`required:true` 可豁免 runtime-context 压制（候窗1 实测定） |
| session-body（会话面补充） | **不映射（明确不转译）** | — | — | session-body 系 claude code 宿主形态（M-001 段/命令族）；dsh 侧无对应宿主概念——命令族知识以 skill/文档另行承载（窗2 候定·非窗1 面） |
| contract（行为契约） | 不直接映射——其内容经 agent-body 渲染面承载 | — | — | 契约真源仍在 source-agents（转译器单向·v3 稿 §2.3 铸条不变） |

**转译器施工件规格**（v3 稿 §2.3 已立·本件细化）：
- 单向转换：source-agents 正身 → dsh 配置产物；source-agents 永远是真源，dsh 产物=构建物（`.gitignore` 候定·禁反向编辑）；
- 字段级映射禁凭直觉：每字段有本表行锚定，转译器实现逐行对照；
- 模板插值风险面：源侧正文含 `{{…}}` 形态字符时转译器须转义或报错（dsh render 严格解析——静默错渲染风险点）；
- 版本钉住：产物头注记 dsh commit/版本与转译器版本（preview 期可复现性）。

## 二、件② TriRMC mailbox ↔ dsh 适配件规格

### 2.1 对接面定谳（三选一裁决）

| 候选 | 判 | 依据 |
| --- | --- | --- |
| **ACP JSON-RPC stdio（`@deepseek-ai/dsh-acp`）** | **采用** | 官方定位「automation-only server…programmatic clients」；完整合同面（create/list/**resume**/close+prompt+update+permission+cancel）；stdio 同机直连零网络暴露；standard ACP v1（agentclientprotocol.com 开放协议） |
| Typert RPC（`/api` 桥） | 否 | build 期强类型生成耦合（typert-generator 从 Host ts.Program 生成）——preview 期类型面漂移直接打断适配件；web-client 面向 GUI |
| Web UI（127.0.0.1:3080） | 否 | 人用交互面；无程序化合同承诺 |

### 2.2 三操作协议面映射

| TriRMC mailbox 操作 | ACP 调用链 | 备注 |
| --- | --- | --- |
| **投递** | `initialize` → `authenticate`（立即成功·无鉴权）→ `session/new`（首投：absolute workspace+MCP 授权先验证后发布）或 `session/resume`（续投：canonical workspace 验证·log 恢复不重放旧更新）→ `session/prompt`（**每 session 同时最多一个 in-flight prompt**） | 信=一条 prompt（有序 text/resource links） |
| **回执** | 消费 `session/update` 串行流（committed assistant 消息与 thoughts·generic tool 生命周期·配置变化·context usage）+ prompt settlement（root+descendant 完成+有序更新投递毕·stop reason+投递失败报告） | settlement=quiescent 语义（admission/活动/更新/后代/持久化/处置达终态才毕） |
| **记账** | TriRMC 侧信箱台账：投递时戳/prompt 序号/settlement 时戳/stop reason/update 行数/session id | 台账真源照 D-27 执行层标准挂 operating-records 周平面树 |

### 2.3 权限面与信任模型

- ACP 信任模型=**trusted controllers**（`authenticate` 无鉴权——stdio 同机直连是安全前提，适配件进程与 dsh server 必须同宿主同信任域）；
- `session/request_permission`：一次性 allow/reject——**窗1 烟测=显式一次性 allow（人工判读）**；自动化应答策略（deny-by-default+白名单·映射 claude code 权限模式）**候窗2 定**，窗1 不自动放权；
- stdout 纪律（官方硬约束）：dsh server stdout=协议流量独占，适配件日志禁上 stdout（走 stderr 或文件）。

### 2.4 生命周期与进程管理

- 适配件=TriRMC 子进程管理面持有 dsh ACP server（`pnpm dsh --profile acp`·exact 版本钉死禁浮动）；dsh Host 停=其内 schedule 调度全停（官方语义）——TriRMC tick（8710 cron）为外层心跳与升级链（v3 稿 §三铸条照旧），**dsh schedule 不替代 tick**；
- 持久性边界（官方明示）：list/resume/close 跨进程重启支持；**deletion/fork/transcript replay/`session/load` 不支持**——TriRMC 侧记账须自行留投递与回执全量台账，禁依赖 dsh 侧回放；
- 重启恢复语义：session log 持 preset ID，恢复用**当前定义**重建，定义缺失=拒恢复——**dsh 升级窗必查 preset 定义存在性**（升级门清单新增项）。

### 2.5 烟测门（序2 装设验收·v3 稿 §一细化）

链形：`pnpm dsh --profile acp` 起服 → `initialize`（验 ACP v1+session/list/resume/close 广告）→ `session/new` → `session/prompt`（测试信一封）→ `session/update` 消费到 committed assistant 消息 → settlement 收毕 → `session/close` → TriRMC healthz 对表（8710 mc 段照 8713 先例）。全链绿=烟测过。

## 三、件③ §3.2 报文模板（树卷+落款+机位三钉）

每封投递信（ACP prompt 内容）模板：

```text
【D-24 机位断言头】
机位: R 面·河源（r-plane）·dsh 执行层
发令面: M 面 TriRMC 适配件（本信经 ACP stdio 投递）
接令席: r-duty-cos（R 面班组值席 COS·dsh session）
树锚: <operating-records 周平面树路径>

【信体】
<任务书/指令正文——照 D-27 任务书树协议形态·可自含打包>

【D-47 落款纪律】
落款: <date 现查原值·UTC Z 后缀 +8·禁推算禁模糊段>
```

- 树卷模板：照现行 operating-records 树形（sourceOfTruth/syncMode/lastSyncedAt 元信息头三件套——M 面 CTO 面先例照抄）；
- 回执卷：r-duty-cos 回信同模板（机位头对调·树锚指回同一树）——TriRMC 适配件记账消费 update 流后**仍要求值席落树卷**（dsh update 流非持久回放面·树卷才是可审计真源）；
- 报文禁带：token 值面（D-46 族·含密值面禁进报文打印路径）、模糊时点（FUZZY-TS 门同构面·R 侧候装窗2）。

## 四、件④ preset 能力矩阵核死

### 4.1 预置能力矩阵（官方深勘）

| 能力 | standard | cordis | ptc | minimal | acp profile |
| --- | --- | --- | --- | --- | --- |
| schedule 四工具（schedule_create/list/update/delete） | 有 | 有 | 有 | **无** | profile 层非 preset 层 |
| clock context（当前时刻+时区） | 有 | 有 | 有 | **无** | 同上 |
| durable sessions（持久化 list/resume/close） | 预置 web 组合含 | 预置 | 预置 | — | **acp profile 显式 mount 持久化** |
| subagent delegation | 有（delegation rows deny schedule 四工具至子代理） | 有 | 有 | — | — |

（「—」=官方文档未对 minimal 逐项列明·窗1 装设实测补全；本表只录深勘证实行，禁推定补格。）

### 4.2 起步裁决（v3 稿 §五-5 修订）

- **修订**：「minimal 起步」→「**acp profile 起步，preset 用 registry 默认（standard 系）**」；
- 理由三条：①窗1 烟测走 ACP——acp profile 自含持久化+自动化合同面，minimal 反而缺 schedule/clock 且无自动化定位；②TriRMC tick 已主责外层心跳，dsh 内 schedule 非窗1 必需——standard 组合中未用能力=零成本持有；③minimal 的正确用途=性能面实测后若 standard 过重再降（降级路径保留·不作起步）；
- multi-preset 演进：窗2 班组运营若需多席/多组合，走自铸 preset（`@deepseek-ai/dsh-agent-preset` 行 bundle patch·`plugin_manager` 装入 profile）+scoped persona 行（`@deepseek-ai/dsh-persona`·agent scope 内 mount·全局 mount 冲突 fail loud）——**窗1 零 bundle patch**。

### 4.3 KV cache 运营语义（铸入合同）

- 活体 Agent composition 稳定，**新 Agent 才吃新定义**——preset/persona/compass 更新对在途 session 零 retrofit；
- 运营序：改定义 → 重建 session（`session/close` + `session/new`）→ 新 session 生效——「改了没生效」排查第一跳=查 session 新旧（候 R 面运维手册条目）。

## 五、件⑤ compass 承接位深勘钉死

- **正形=PromptContext**（`ctx.systemPrompt.context` 注册）：
  - 依据（官方原文）：「The cache-safe counterpart to PromptSection」「materialized as a durable user-role snapshot」「logs … after retained model history only when it changed or compaction removed it」——compass 开工注入的灵活可变层与此设计目标精确对位；
  - `required: true` 候定：compass=开工必读纪律面——若运行中 `includeRuntimeContext` 压制（deployment 或 agent scope），compass 仍须保留——**窗1 实测压制场景后钉死**；
- **身份位=personaPrefix**（dsh-system-prompt deployment-wide config）：`includeHarnessIdentity` 默认 true（dsh 固定身份在部署 persona 之前）——R 面值席身份判定窗1 实测「identity+personaPrefix 叠加渲染序」后定（若 dsh 固定身份干扰值席人格，`includeHarnessIdentity:false` 候选）；
- **纪律位=personaSuffix**：render 时 `{{var}}` 严格插值；空文本=shadow 全局 suffix；
- **渲染事实（影响验证法）**：system prompt 以 surface node 进 derived history（首步 append·变化 in-place replace）——**R 面 session 审计读 transcript 时 system prompt 是消息节点非 request 字段**，取证面照此对表；
- compass 更新生效：随 §4.3 KV cache 语义（新 session 生效·活体不 retrofit）。

## 六、先立后装与窗1 门禁

1. **序1（本件）**：合同定稿 → 本席签发 + R 面 COO 补签（候设位）→ COS 报备 CEO；
2. **序2 装设**（候本件定稿·BOD 特批 SSH 现行权界）：Node v22.23.2 在支持面（BOD 19:18 现勘）→ exact 版本钉死安装 → 烟测门（§2.5 全链绿）→ 装设毕报；
3. **序3-5**：上线报到 → 首回流 → 通道迁移（v3 稿 §六窗序照旧）；
4. 回滚姿态（照 v3 稿 §六三面）：装设失败=卸载即回（dsh 独立目录+TriRMC 8710 机制层零变更）；烟测不过=冻结装设报本席；运行期破坏=TriRMC 侧断适配链（子进程 kill+记账标记）回纯 TriRMC 模式。

## 七、使用依据

- dsh 真源深勘（gh API·2026-10-14）：docs/agent-lifecycle.md（system-prompt/assemble waterfall·每 turn）·docs/subsystems/system-prompt.md（PromptSection/PromptContext 契约·surface node 决策）·docs/config-catalog.md `@deepseek-ai/dsh-system-prompt` 段（personaPrefix/personaSuffix/includeHarnessIdentity/includeRuntimeContext/toolOrder 字段）·docs/user/guide/schedule.md（preset 能力差异·Host 停=调度停·重启补投递语义）·docs/api-gateway.md（Typert RPC 否决依据）·packages/preset/agent-preset+agent-preset-registry+persona 三包 README（YAML 形态·字段表·revision 保留·KV cache 语义·persona 槽契约）·packages/acp/acp/README.md（ACP 合同全表·信任模型·持久性边界·stdout 纪律·`pnpm dsh --profile acp`）；
- dsh 方案稿 v3（e89cef5ae）：§一装法/§2.3 转译层/§三输入腿/§五双 harness/§六窗序/§七风险表；
- CEO 15:36/15:58 裁批链形与新链（COO→COS→CEO）；BOD 19:17 派工令文与注记三条；
- D-24 机位断言/D-27 树协议/D-47 落款纪律/D-46 含密值面现行纪律册。

—— CTO 小狄（落款 date 现查原值 2026-10-14 19:28:12 +0800）
