# r-plane-eval-01 成熟度评估卷·市场面对标（CMO 小敏）

> 树 id=r-plane-eval-01 · M 面 COO 派工 2026-11-04T12:52:29+08 · 认领领域=市场对标成熟度基准面
> 采集时点：2026-11-04T13:31–13:5x+08 · 评估只读合规（源码/配置零写，写面限本树）
> 证据分级：A=实勘仓面（本次只读取证）/ B=外部可追溯报道（附链接）/ C=待验证（标缺口）
> 本卷边界：市场/竞品/用户需求透镜——不做代码质量审计（归 CTO/FSD/STE 域），不做运行时态核验（归 SDE/COO 域）

## 一、评估对象能力面实勘（证据 A）

| 面 | 实勘事实 | 来源 |
|---|---|---|
| TriRLC | bin `trirlc`/`trilc`（version 0.9.0）；模块面广：daemon/heartbeat/cron/planner/toolbus/task-runtime/session-store/mcp/skills/sync/update/tray/wallet-upgrade/local-node 等 30+ 目录 | `/srv/fleet/TriRLC/`（package.json+src/ 实勘） |
| TriRLC 底座 | vendor/openclaw 稳定快照 2026.3.28 为演化起点 | `/srv/fleet/TriRLC/README.md` |
| TriRLC 连接面 | 8711 daemon 经 `TRIMC_BASE_URL` 上送中央面 8710 TriRMC（LG-030 勘定） | `/srv/fleet/TriRLC/README.md` |
| TriPilot | `tripilot-chat` 0.0.13，publisher=local；命令面 15 条（chat/quickChat/会话管理/导出/debug 族）；视图=sidebar webview | `/srv/fleet/TriPilot/package.json` 实勘 |
| TriPilot 工具环 | 内置 5 工具（workspace 读/写/列、vscode 命令、terminal_run）；`maxToolIterations` 默认 6；`vscode.lm` 主通道+copilot-direct 实验通道；mcpClient.ts + TriLCClient.ts（8711 对接）在位 | `/srv/fleet/TriPilot/README.md`+src/ 实勘 |
| 产品声明面 | 两仓 docs/product/ 四件（PROJECT/REQUIREMENTS/ROADMAP/STATE）**均为占位骨架**，无定位/需求/路线图/状态实质内容 | 实勘 2026-11-04 |

## 二、市场对标参照系（证据 B，采集 2026-11-04）

市场现势（2026 年）：赛道已从「补全/聊天」整体转向「自治 agent」。类别领先者口径：Claude Code（agent 自治）、Cursor（AI-first IDE）、Copilot（企业/IDE 集成+补全基本盘）、Windsurf（agentic UX）；开源本地派以 Cline 为标杆（8M+ 开发者、67K+ GitHub stars、BYOK/模型无关、跨 VS Code/JetBrains/Cursor/Windsurf/桌面运行时）。OpenClaw（TriRLC 的 vendored 血统来源）2026 年爆发式普及但同时成为 agentic 安全失败的标志案例（24.5 万暴露实例、900+ 恶意 skills、1-click RCE 类披露）。来源见卷尾链接。

## 三、成熟度判级（市场透镜，五档：Skeleton/Functional/Differentiated/Market-ready/Category-leader）

| 能力轴 | 判级 | 市场参照 | 依据 |
|---|---|---|---|
| Agent 自治深度 | **Functional** | Cline/Claude Code 的多步自治+计划-执行分档已成标配 | TriPilot 工具环=极简 loop（maxToolIterations=6）；TriRLC planner 模块在位但未在扩展面显性化 |
| IDE 集成成熟度 | **Functional** | Copilot/Cursor 深度集成；Cline 覆盖 5+ 宿主 | 会话管理/quickChat/导出在位；terminal_run 输出捕获自认受限（README 原文） |
| 本地域常驻控制（daemon） | **Differentiated（潜力）** | 市场上少有「IDE 扩展+常驻本地控制器」双件套形态；Cline 2026 补桌面运行时印证该方向需求真实 | TriRLC 30+ 模块面（heartbeat/cron/task-runtime/tray）为本赛道稀缺面 |
| 模型无关/BYOK | **Functional** | Cline 靠 BYOK+本地模型（Ollama）吃到开源红利 | vscode.lm+copilot-direct 两通道在位；OpenRouter/Ollama 级广度未见声明（待验证：需 CPO/CTO 确认通道矩阵） |
| MCP 生态对齐 | **Functional** | MCP 已是市场连接事实标准 | 两仓 mcp 模块/mcpClient 在位；对齐深度未实勘（待验证） |
| GUI/UX | **Skeleton→Functional 之间** | Windsurf agentic UX、Cline plan/act+diff 审查为市场 bar | 0.0.13 版本号自证早期；diff 审查/检查点类 UX 未见 |
| 安全姿态 | **Skeleton（市场面最敏感缺口）** | OpenClaw 危机=市场对本地深权限 agent 的信任折价已成共识 | 沙箱默认/权限门/暴露面收敛未见声明——同形态产品已被市场点名 |
| 分发与生态 | **Skeleton** | Cline=市场公开渠道+8M 用户；Copilot=企业分发 | publisher=local、0.0.13——无公开渠道在位（TriCade 打包线为备选路径） |
| 产品叙事面 | **Skeleton** | 全部竞品均有明确定位/定价/差异化叙事 | 两仓 product 四件全占位——定位、目标用户、定价货币化面缺失 |

**综合判级：Functional（功能在位）但 Market-ready 度低**——工程骨架厚度（TriRLC 模块广度）显著领先产品面成熟度（叙事/安全姿态/分发三面皆 Skeleton）。对比基准说明：M 面（sg 面 TriRLC/TriPilot 现役形态）运行时态本席无法从本机实勘，卷内对比以仓面同源事实为界；M/R 运行形态差归 CTO/SDE 域核验。

## 附：外部来源链接节（证据 B，采集 2026-11-04）

- 赛道格局：[AppScale Blog：Cursor vs Windsurf vs Cline vs Copilot (2026)](https://appscale.blog/en/blog/cursor-vs-windsurf-vs-cline-vs-copilot-ai-coding-agents-2026)、[skills-hub.ai：Best AI Coding Tools 2026](https://skills-hub.ai/compare/ai-coding-tools-2026)、[Prism Labs：AI Coding Agents 2026](https://www.prismlabs.uk/blog/ai-coding-agents-comparison-2026)、[Coursiv：Best AI Coding Agents by Use Case](https://coursiv.io/blog/best-ai-agents-for-coding-2026)
- Cline 量级口径：[cline.bot](https://cline.bot)、[Cline — VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)、[DeployHQ：Cline Setup Guide 2026](https://www.deployhq.com/guides/cline)
- OpenClaw 安全面：[Fortune 2026-02-12](https://fortune.com/2026/02/12/openclaw-ai-agents-security-risks-beware)、[Immersive Labs](https://www.immersivelabs.com/resources/c7-blog/openclaw-what-you-need-to-know-before-it-claws-its-way-into-your-organization)、[Reuters 2026-03-09](https://www.reuters.com/world/asia-pacific/chinas-shenzhen-backs-openclaw-ai-with-subsidies-despite-beijings-security-2026-03-09)、[McAfee](https://www.mcafee.com/learn/is-openclaw-safe-to-install)、[Wikipedia：OpenClaw](https://en.wikipedia.org/wiki/OpenClaw)、[arXiv 2606.11007](https://arxiv.org/html/2606.11007v1)

## 四、用户需求信号（证据 B/C）

1. 本地/开源 agent 需求真实且量大：Cline 8M 开发者+67K stars（B）——TriPilot+TriRLC「本地域常驻+IDE 入口」形态踩在真实需求带上。
2. 安全信任折价已成市场共识：OpenClaw 暴露实例/恶意 skills 案例（B）——同形态产品用户第一问将是「我的 8711 daemon 暴露了什么」。
3. BYOK/模型选择权是开源阵营留客核心（B，Cline 口径）——TriPilot 通道矩阵广度是留存变量（C，待 CPO 确认）。
4. 企业视角要审计与权限门（B，Fortune/Immersive Labs 口径）——与 TriCompany 治理形态天然契合，是差异化叙事素材。

## 五、样本局限声明

- 外部数据（8M/67K/24.5 万实例等）为公开报道口径，未经本席独立复核，采信度 B 级。
- 本席未实测 8711 API 与 GUI 运行态（属他席认领域）；功能在位性以仓面静态实勘为限。
- 对比基准「M 面现役形态」未做跨机实勘，市场卷不对其下判级。

——CMO 小敏 · 2026-11-04T13:5x+08 落卷
