# CTO 技术调研与技术设计 · TriModel 产品语义立正（CEO 11:35 令三件）

- sourceOfTruth: 本件（BOD 派工树 cto-tech-design.md；树=trimodel-strategy-revamp-01）
- syncMode: working
- lastSyncedAt: 2026-10-07T03:51Z（date 现查 11:51:07+08）
- 裁定席: CTO 小狄（m-cto）；产品语义归属: CPO（本件②候 CPO 提案合流）
- 任务锚: CEO 11:35 令——「TriModel 策略卡」→「模型策略」；「连接配置」→「兜底模型」（四域各一兜底模型直配 settings.json 的兜底护栏）；trimodel 不可用时第二保底=各面域 CLI 命令行直配

## 第一部分 · cc-switch 技术对照面（它怎么做的 vs 我们）

调研对象: farion1231/cc-switch（GitHub，v3.7.x，Tauri 2 + Rust + React 18 + TypeScript + SQLite；ccswitch.io 为唯一官网）。定位=跨平台桌面 All-in-One 管理器，管理 10 个 AI coding 工具（Claude Code/Claude Desktop/Codex/Gemini CLI/Grok Build/OpenCode/OpenClaw/Hermes/Pi/MiniMax Code）的供应商配置+MCP/Skills/Prompts。

### 1.1 它的六个核心机制（README 机制行实锚）

| # | 机制 | cc-switch 做法 |
| --- | --- | --- |
| M1 | **键字段级替换** | 切换供应商只替换配置文件的 key fields：endpoint、key、model name、API protocol（Codex 另含 reasoning effort、Gemini CLI 另含 auth method）+随供应商走的少数兼容项（如 Claude Code 的 Disable Artifact Tool、context window）。**插件/hooks/权限/MCP/用户自添 env/注释/格式全部原样保留**，跨供应商通用 |
| M2 | **写面安全** | 原子写（atomic writes）+自动备份；**首次改写前把工具原配置留档到 `~/.cc-switch/backups/live-first-write/`**；日常备份 24h 一轮保 10 份 |
| M3 | **数据存储** | SQLite 单库 `cc-switch.db`（providers/MCP/prompts/Skills/projects/用量记录）+设备级 `settings.json`（各工具配置目录/备份策略，**不入云同步**）+`live-state.json`（每工具 direct/经路由状态+最后写入内容） |
| M4 | **本地路由（local routing）** | 自带本地代理：开启后配置里写 `127.0.0.1`，切换供应商=改路由上游、**即时生效不重启工具**；上游格式转换三档（OpenAI Chat Completions / OpenAI Responses / Gemini native generateContent → 各工具协议）；关闭或退出时**回写 direct 供应商配置** |
| M5 | **预设与订阅** | 90+ provider 预设（Bedrock/NVIDIA NIM/社区中转等），选预设填 key 即用；OAuth 认证中心把 GitHub Copilot/ChatGPT/xAI 订阅账号变 provider（自标注条款风险）；Coding Plan 套餐（Kimi/GLM/MiniMax/火山方舟）5h/周/月 quota 展示+自定义 usage script |
| M6 | **生效语义分级** | Claude Code 切换即时生效；Codex/Gemini CLI 提示重启终端；OpenCode/OpenClaw/Hermes/Pi/MiniMax=**共存模式**（provider 写进工具自身配置并列共存，工具内自选模型） |

### 1.2 对照表：对齐 / 超出 / 异构不采

**直接对齐（设计同构，相互印证）**：

| 维度 | cc-switch | 我们（现役/在案） |
| --- | --- | --- |
| 字段级替换 | M1 key fields 替换、其余保留 | **r5 五件**（API Key/认证字段/API 格式/1M/映射表）投影——同构且切分更细；「兜底模型直配 settings.json」语义与 M1 完全一致 |
| 写面安全 | M2 原子写+备份+首次改写留档 | io-kernel 五门内核（备份轮换/键名锁/**写后断言自动回滚**/掩码审计/钥走独立钥文件）——门槛更严 |
| 预设模板 | M5 90+ 预设 | claude-fallback templates 族（模板切换+预览门控）现役 |
| 用量展示 | M5 quota 展示+usage script | quota 端点机制已落 cho 树（ccswitch-quota-endpoint-research.md，不重做） |
| 状态可观测 | M3 live-state.json（direct/路由态+last written） | 诚实三态（已存未拉/已拉未落/已落生效）——同构且多一环（拉取链拆两态） |

**我们超出 cc-switch 的（它没有的）**：

1. **拉取下发链**：cc-switch=单机桌面应用，人点鼠标才切换；我们=TriModel 卡面引擎→各域 daemon pull（15min stagger）→落地→生效五步数据流，**无人值守自动下发**。这是架构代差：桌面工具 vs 配置分发服务。
2. **域锚密文**：AES-256-GCM 域锚（密文域=创建机器+用户，禁跨机复制卡文件，消费机域内重加密）。cc-switch=明文 SQLite+云同步，密钥面弱于我们（它连 OAuth 凭据都是明文 json 落盘）。
3. **CLI 对等**：cc-switch=纯 GUI+托盘，无 headless 直配通道；我们=CLI config 族（pull/show/verify/cache）与页面对等（一致面八项第⑧项「CLI 对照」卡面锁死）。
4. **多机拓扑**：M 面（本机+M-SG）/R 面（本机寄居+R-HY）跨机四域；cc-switch 单机边界（WSL 需手动路径 override）。
5. **降级梯**：三层降级（tier1 缓存拉取+24h 过期→tier2 last-known-good 域内重加密→tier3 env 直连）。cc-switch 本地路由挂了即断，无降级语义。
6. **层级裁**：env 显式覆盖>TriModel 卡面>fleet bundle>常量兜底（§4.3 裁）。cc-switch 的「direct 回写」是单层切换语义，无覆盖序。

**它有、我们异构或不采的**：

| 项 | 判断 |
| --- | --- |
| 本地路由协议转换（M4） | **等价物已存在**——TriModel 本体就是 Anthropic 协议代理（anthropic-proxy.ts + relay.ts），兜底语义下直连官方兼容端点，不引入第二代理层 |
| 共存模式（M6） | 异构：cc-switch 面向单用户桌面多工具并存；我们四域=四 daemon 各一消费端，无「一工具多供应商并存」需求 |
| OAuth 订阅入 provider | **不采**：cc-switch 自己标注「订阅外用可能违反厂商条款、风险自评」——合规面不引入，我司走 API key 正途 |
| 单机托盘快切 | 不采：我们无 GUI 托盘形态，daemon 化自动下发取代人工快切 |
| Prompt 库/MCP/Skills 管理 | 超出本任务边界（TriModel 现役范围=模型配置层；MCP/Skills 管理候产品面另议） |

### 1.3 对照结论（一段话）

cc-switch 验证了「模型配置直配 settings.json + 键字段级替换 + 写面安全」这条路是行业收敛形态——**我们 r5 五件与 io-kernel 设计与其同构且更严**；我们的代差优势在**拉取下发链+域锚密文+CLI 对等+多机拓扑+降级梯**五项（服务化 vs 桌面工具的代差）；它可借鉴的两处细节=「首次改写留档原始件」（live-first-write，补进 io-kernel 备份语义）与「生效语义分级提示」（对应我们诚实三态，已有）。**不需要为对表引入任何 cc-switch 组件；「兜底模型」设计完全落在自家 r5/claude-fallback 基座上。**

## 第二部分 · 件① 兜底模型直配 settings.json 技术设计

### 2.0 定位语义（先立正，防与既有概念撞车）

「兜底模型」（BOD 裁名，原「连接配置」）=**四域各一份直连供应商的最小直配，直接落到该域落地配置（settings.json 语义），不经 TriModel 代理中转**。CEO 定性原话（CPO 9items 卷转录）：「这个卡就是给四个域留一份直接修改本地配置的配置，拉取下发下去直接影响 setting.json」。

术语区隔（硬约束）：兜底模型 ≠ 策略卡 quota 规则里的 `fallback_ids`（那是**策略内**切换转入序列，走 TriModel 代理域内降级）。两者一外一内：兜底模型=代理链**外**的直连护栏；fallback_ids=代理链**内**的降级序。改名后 CPO 面 IA 须消解这组同名异义（本件候裁点③）。

### 2.1 四域兜底映射结构（每域一卡的落地矩阵）

| 域 | 面·位 | 消费端 | 落地配置 | 现役通道 | 缺口/状态 |
| --- | --- | --- | --- | --- | --- |
| TriMLC | M 面·本地域·本机 8713 | 本机 Claude Code harness | `~/.claude/settings.json` | **claude-fallback 端点族现役 7 端点**（templates/preview/backups/rollback/inject-key/restore+info；UI fb-zone 已挂） | 无——本件基座即此 |
| TriRLC | R 面·本地域·本机 8711（寄居过渡） | 同机 Claude Code harness | `~/.claude/settings.json`（**与 MLC 域同位共享**） | 同上（寄居期同一落地件） | 候裁点①：隔离语义候 R 面独立部署 PC 落地后自然分离 |
| TriMMC | M 面·服务域·M-SG 8712 | sg 机 harness | sg `~/.claude/settings.json` | 现役走 8460 代理+卡面=策略卡过渡位（trimmc-card.json）；**兜底下发通道候建** | 候裁点②：sg 侧自动落地链缺——SSH/值席手工 or sg TriModel 实例，走排程不并本设计 |
| TriRMC | R 面·服务域·R-HY 8712 | R-HY daemon 侧 | `$TRIRMC_CONFIG_DIR/settings.json`（**四 daemon 中唯一 daemon 侧落地件**，local-settings.ts:46-57） | 卡面 pull 链现役（LG-058 N5）；R-HY 3333 r5 部署形态（本机+R-HY 双面 200）=底座实证 | 无结构性缺口 |

**结构裁决**：兜底卡=**每域一张独立小卡**（非策略卡分节）。理由：①字段集精简（见 2.2，⊆r5 五件）与策略卡三实体（条目/模型集/规则）结构异构，塞同一卡违「卡名=角色」正名原则（CPO 9items 方案一）；②兜底卡生命周期独立（正常态不拉不动、只作护栏），与策略卡高频编辑域解耦；③域锚继承不变（同一卡面引擎，CARD_VERSION 同族递增）。

### 2.2 兜底卡字段集 × r5 五件合并形态

r5 五件=API Key/认证字段/API 格式/1M/映射表（W40 实施方案正身 §五件定义）。兜底卡取五件的**直连必需投影**：

| r5 件 | 兜底卡字段 | 落地键位（settings.json 语义） | 实锚 |
| --- | --- | --- | --- |
| API Key | **钥引用**（钥 slot 名）——**不存钥值** | 钥走独立钥文件（`settings.presets/.deploy-key.<provider>` 族，零过 argv）或 env 键注入 | io-kernel 键族（TriCode io-kernel.ts 五门）+key-cache.ts:446-464 注入键族 |
| 认证字段 | auth 键位二选一 | `ANTHROPIC_AUTH_TOKEN`（token 门）vs `ANTHROPIC_API_KEY`（key 门） | presets 真源 `TriCode/presets/` 字段正形 |
| API 格式 | 端点协议族 | `ANTHROPIC_BASE_URL`（anthropic 兼容=缺省直连官方/供应商兼容端点；OpenAI 兼容态走 relay——兜底语义下**默认 anthropic 直连**，不引入第二代理层） | 同上 |
| 1M | 上下文窗开关 | 客户端 1M 语义（[1M] 后缀发请求前剥除） | claude-code-model-env 语义档（MEMORY 实锚） |
| 映射表 | **兜底语义下简化**：单模型直映射（tier→同模型），不做多 tier 表 | 模型键位按 presets 真源字段 | `TriCode/presets/`（现役 deployed=bigmodel/glm-5.3-flash；deepseek 未部署） |

**密钥边界（硬规则，CPO 方案三既定沿用）**：密钥禁入兜底卡与兜底 UI 表单——兜底卡只存钥引用；钥值各域域内自管（UI fb-zone L314 既有话术「密钥禁入本表——各域密钥走域卡条目域内自管」原样承袭）。

**合并形态一句话**：兜底卡不新增字段体系，就是 r5 五件在「直连场景」下的最小闭包——五件在策略卡条目（走代理）与兜底卡（直连）是同一字段语义的两种投影，落库同引擎、下发同链路、落地同 io-kernel，**零新轮子**。

### 2.3 保存链五步投影验证点（改→存→拉→落→效）

CPO 方案三五步数据流逐环投影+验证锚（对表「键存在性抽验≠值面验证」纪律，每环值面断言）：

| 步 | 动作 | 环节主体 | 投影验证点 |
| --- | --- | --- | --- |
| 1 改 | UI 四域签表单提交/（未来）CLI 写 | TriModel API | **写后读回断言**：GET 返回与提交体值面一致（非仅 201 状态码） |
| 2 存 | 卡面引擎落库+域锚加密 | TriModel 卡面 | 域锚属主断言（创建机+用户）+卡版本递增+写前自动备份在册（备份轮换读数） |
| 3 拉 | daemon 定时 pull（15min stagger） | 各域 daemon | pull 响应读数落日志+键族应用记录（key-cache 键族）；拉取失败走降级梯（tier1 缓存 24h 过期→tier2 last-known-good→tier3 env）不入死态 |
| 4 落 | 写落地配置文件 | 各域落地链 | **io-kernel 五门**：备份轮换+键名锁+写后断言（落地文件键名/值面 hash）+不符自动回滚+掩码审计；**首次接管前留档原始件**（cc-switch live-first-write 同款，本件采纳补强） |
| 5 效 | 运行态消费 | 消费端（harness/daemon） | 诚实三态读数暴露（见 2.4）+探针：兜底端点请求实际命中（v 值面验证，非配置文件在即认为生效） |

### 2.4 诚实三态的技术支撑面

UI 话术已挂（fb-zone sub 行「已存未拉 / 已拉未落 / 已落生效」），读数源须各域落地链暴露三态字段：

- **已存未拉**：卡面卡版本 > daemon 上次拉取记录版本——数据源 daemon pull 记录；
- **已拉未落**：已拉版本 > 落地文件指纹（文件 hash/版本注记）——数据源落地链写后读数；
- **已落生效**：消费端实读（harness 进程 env 快照 / daemon config verify 探针）。

**候裁点④（三态读数通道）**：A 案=各域 daemon `config verify` 端点扩三态字段（CLI show 同源，一份数据两消费端——推荐，与一致面八项第⑧项 CLI 对等咬合）；B 案=UI 端跨端点聚合（零 daemon 改动但 UI 承担聚合逻辑，verify 语义分散）。候 CPO 合流时一并定，技术面推荐 A。

### 2.5 层级裁对表（兜底卡插入位置）

现役层级裁（W40 §4.3）：**env 显式覆盖 > TriModel 卡面 > fleet bundle > 常量兜底**。兜底卡=卡面层的直连投影，**不新增层级、不动层序**——它与策略卡同处卡面层，区别只在消费语义（直连 vs 经代理）。env 钉定项优先级高于兜底卡落地值（fb-zone L314 既有话术「域内 env 钉定项以 env 为准，表单值补缺省位」原样有效）。

### 2.6 件① 候裁点汇总

| # | 候裁点 | 本席倾向 |
| --- | --- | --- |
| ① | TriRLC 寄居期与 MLC 域共享落地件（同 `~/.claude/settings.json`） | 如实标注共享态，R 面独立部署后自然分离；不为此提前引入拆分复杂度 |
| ② | MMC 域兜底下发通道候建（sg 侧无自动落地链） | 不并本设计排程；候值席/sg TriModel 实例窗另立 |
| ③ | 「兜底模型」卡 vs quota 规则 `fallback_ids` 同名异义 | CPO 面 IA 消解（改名文案表顺带处理） |
| ④ | 三态读数通道 A 案（daemon verify 扩字段）vs B 案（UI 聚合） | 推荐 A 案 |
| ⑤ | 兜底卡写面权限 | 沿用现役管理令牌 fail-closed（写面拒绝时 UI 如实提示，fb-zone 既有行为） |

## 第三部分 · 件② 「模型策略」前端结构改造方案（工程侧，候 CPO 提案合流）

**合流声明**：CPO 提案正身已在本树（cpo-product-design.md §三：三概念分区+改名文案全表 16 行+禁改清单；§四：兜底模型文案+r5 五件并入锚）。本件②不重复产品 IA 裁定（归 CPO），作工程侧三件补全：**现页面结构工程盘点+改名表技术核对（含实勘增补）+结构级改动面分级**。

### 3.1 现页面结构工程盘点（ui/index.html 单页 2448 行实勘）

**区块地图（HTML 区）**：

| 区 | 行区 | 内容 |
| --- | --- | --- |
| 导航 | L102 `<nav id="page-menu">` | JS 动态渲染（VIEWS 数组 L401-409：当前生效/四角色卡/模型策略/兜底模型） |
| 总览 | L107-121 三 section | 当前生效视图 |
| TriMLC 卡 | L120 起 | 静态正形卡（fb 本机栏并入，FACE_META.mlc `static: true`） |
| 策略卡区 | L189-297 | v4 卡五层：条目（tc-entries）/模型集（tc-ms-*）/规则（tc-r-*，含 quota 转入序列 L249）/策略（tc-str-*）/活动策略；badge L193；常态只读 |
| 兜底模型区 | L299-316 `#panel-connect`>`#fb-zone` | 四域签（conn-domain-tabs L312+panes L313）+应急恢复命令 warn L306-310+密钥禁入话术 L314 |

**一致面八项卡模板**（L326-331 注释在卷）：①卡头身份行②拉取状态区③现役配置查看④模板切换⑤备份与回滚⑥审计行⑦降级话术⑧CLI 对照行——rlc/mmc/rmc 经 `faceCardHtml()` 模板渲染（L371-398），静态 mlc 卡同构同序。**卡特有面=追加区块禁进模板位**。

**JS 函数群分区**：四域卡渲染/联席菜单机制（L868 起：菜单快照/点菜校验/手填标注）/规则勾选（L1050 起）/策略卡只读交互（L1269 起）/兜底族（L1281-1460：claude-fallback 七端点 info/templates/preview/inject-key/backups/rollback/restore+应急命令复制）。

**端点依赖面**：卡面族（/v1/config/cards/*）+claude-fallback 族（/v1/config/claude-fallback/*）——三区重排**零新端点**（v4 卡端点族已齐，三区=同一卡数据的呈现切分）。

### 3.2 CPO 改名表技术核对（行号实勘对表）

CPO 16 行表锚行逐一实勘核对：**16/16 行号全部命中、文案逐字对上**（L189/193/299/305/354×2/356/407/408+JS L539/868-871/890/948/957/986/1034/1050）。禁改清单 5 处（L592/679/764/814/1040「无法连接配置服务」）实勘确认在位——动宾短语异义，同意禁改。

**实勘增补 4 处（CPO 表未列，候采认）**：

| 位置 | 文案 | 级别 | 建议 |
| --- | --- | --- | --- |
| L1067 | `idle.textContent = '策略卡暂无规则清单'` | **用户可见** | 增补进改名表（『模型策略暂无规则清单』） |
| L1084 | `rid + '（策略卡已删，本域仍有副本）'` | **用户可见** | 增补进改名表（『（模型策略已删，本域仍有副本）』） |
| L1269 | JS 分节注释 `═══ TriModel 策略卡（LG-035 v4…` | 代码注释 | 施工卷顺带，不入用户可见表 |
| L1281 | JS 注释 `── 连接配置页 v2（波①…` | 代码注释 | 同上 |

增补后用户可见面合计 **18 处**（CPO 16+本席 2）。

### 3.3 结构级改动面分级（两批解耦）

**批 A·改名施工批（文案级，轻）**：18 处文案替换+禁改清单保护——纯字符串替换零逻辑变更；验收锚=CPO §5.2 双向 grep（新名落位零残留+禁改五处原样在）。**前提**：走查冻结期纪律对表——策略卡页内**布局**零改动（CPO §5.1），改名动文案不动布局，冻结兼容；施工窗候 BOD 集成排窗（不占今晚窗）。

**批 B·IA 三区重排批（结构级，重，候 LG-058 CEO 终验毕+P2 批窗）**：

| 改动面 | 内容 | 工程量级 |
| --- | --- | --- |
| 页顶状态行 | 「当前生效」升页顶（数据源=现活动策略区读数，tc-str/活动策略端点不变） | 小 |
| 区 1 模型 | tc-entries 条目表现状保持，独立成区 | 小（区块切分） |
| 区 2 模型组合 | tc-ms-* 区保持，独立成区；「模型集」→「模型组合」再正名候 P2 另批（CPO §5.3 划出，本席同判） | 小 |
| 区 3 切换规则 | tc-r-* 区+方案附属块（tc-str-* 并入）+内层「策略」→「方案」正名（同批，防两层语义混改——CPO 范围钉同判） | 中（方案块迁移+内层正名全表） |
| 机器信息区 | 缩为页顶连接状态行（保留先连接后可用门禁） | 小 |
| JS 面 | tc-* 渲染/事件函数群随区块重排；联席菜单机制（L868 起）**原样保留**——「模型策略=菜单、域卡=点菜」正名后机制不变 | 中 |
| 端点面 | **零新端点、零 schema 变更**（三区=v4 卡既有数据的呈现切分） | 零 |

**批 B 前置约束**：①LG-058 CEO 终验毕（现役只读态「编辑窗候 CEO 终验」注记 L189/L407 在卷，IA 重排不得在终验前动卡内布局）；②P2 批窗排程候 BOD；③施工序=先批 A 后批 B，两批分开走查（CPO 范围钉「防一波施工改两层语义」同判）。

### 3.4 与件① 的接口

批 B 施工时「模型策略」页顶状态行与「兜底模型」页三态读数共用取数通道设计（件① 候裁点④ A 案：daemon `config verify` 扩三态字段）——两页读数同源，施工一并接线省一轮。

<!-- seg4 件③ CLI 直配能力盘点（待续） -->
