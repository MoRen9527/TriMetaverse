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

<!-- seg2 件① 兜底模型直配技术设计（待续） -->
