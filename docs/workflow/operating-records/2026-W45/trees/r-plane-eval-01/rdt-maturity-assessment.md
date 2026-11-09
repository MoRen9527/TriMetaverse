# 成熟度评估卷 · RDT 域（培训/接手性维度）

> 树 id=r-plane-eval-01 · 评估席=RDT（小吴，技术研发培训师）· 开工 2026-11-04T13:31:19+08:00
> 评估方式=仓面只读实勘（README/AGENTS.md/docs/training/主索引/src 结构/bin 入口）；施工约束遵守：源码/配置/仓面零写，本卷落树目录。

## 一、评估对象与维度

- 对象：R 面本地域产品——TriPilot+TriRLC 命令行为主、8711 族 API 面、TriPilot GUI 为辅。
- 本席维度：新人可接手性——培训真源覆盖度、模块导读四要素（定位/成熟度/真源路径/常见误区）、onboarding 学习路径、CLI/API/GUI 三线文档配套。
- 对比基准说明：M 面两域（sg 面 TriRLC/TriPilot 现役形态）的培训资产与本机同仓承载（sg 机=/srv/fleet 工作区，仓库同构）。实勘未发现任何「分域培训件」——R 面本地域产品无专属培训资产，现有覆盖以仓内共享文档为共同基线。分域运行态差异不在本席只读文档维度可辨，如实标注待补。

## 二、评级总表（培训/接手性维度）

| 评估线 | 培训配套现状 | 接手性成熟度 | 依据 |
|---|---|---|---|
| TriRLC 命令行面（cli.ts 入口） | 有静态架构导读（四 daemon 矩阵），无 CLI 用法文档、无模块内代码导读 | **中低** | src/cli.ts 在盘；scripts/ 仅 e2e 脚本；两 README 均无命令清单/示例 |
| 8711 族 API 面 | **零端点文档** | **低** | src/server/{app,anthropic-stream,openai-stream,interactions}.ts 承载 HTTP+SSE；docs/ 无 api 契约件；8711 关键词散布 10+ 源文件（daemon/service/tools/config/tray） |
| TriPilot CLI（bin/tripilot→src/cli/tripilot-cli.ts） | 无导读、无命令文档 | **低** | bin/tripilot 三段解析（env→bundle→tsc out）仅源码注释可见；docs/training 仅占位 |
| TriPilot GUI（extension.ts+webview+TriLCClient） | 有 2 篇对齐设计文档，无代码导读 | **低** | docs/copilot-chat-ui-parity.md、copilot-working-thinking-official-alignment.md 在盘；无导读件 |
| 两模块 onboarding 学习路径 | 无路径卡（先读什么/后读什么/每步验证） | **低** | 主仓 project-onboarding-for-beginners.md 仅覆盖 TriCompany 链路，不涉两模块 |

## 三、关键发现（证据锚）

1. **模块导读覆盖不对称**：主索引（TriMetaverse/docs/training/README.md:21-22、TriCompany 侧:21,62）已收录 TriRLC——「四 daemon 角色矩阵导读」（2026-09-25 补，含四格/命名语源/端口/保活/常见误区，四要素形态在）+三角优化循环现势版；但同索引明文标注「TriPilot、TriStaciss、TriAvatar 等模块导读仍待补」——**TriPilot 是主索引在册的待补缺口**。
2. **模块内培训真源双待初始化**：TriRLC/docs/training/README.md 与 TriPilot/docs/training/README.md 均为 3 行占位索引（「本目录用于后续补齐岗位、模块、代码和流程导读」）——模块内深度培训件两侧皆零。
3. **AGENTS.md 四要素缺两**：两模块 AGENTS.md 均有「Module Role（定位）+Local Fact Sources（真源路径）+Update Discipline（防虚构纪律）」，但缺「成熟度显式标注」与「常见误区」独立段——四要素只齐二。
4. **命令行为主线的接手成本**：新人要知道 TriRLC/TriPilot 命令面，唯一路径=读 src/cli.ts / bin/tripilot+src/cli/tripilot-cli.ts 源码自掘；README 停留在职责描述（TriRLC）与 dev 运行说明（TriPilot：npm install/F5）。
5. **8711 API 面是最大文档洼地**：HTTP+SSE 四文件承载 API，README 仅一处连接面叙述（TRIMC_BASE_URL 上送中央面·LG-030 勘定）；无端点清单、无请求/响应示例、无鉴权说明文档（trimc-auth.ts 存在但无配套文档）。
6. **正面项**：两模块 AGENTS.md 真源路径指引准确（当次实勘均可达）；四 daemon 矩阵导读质量达标（静态架构第一站可复用）；TriPilot 设计文档 2 篇对 GUI 对齐语义有留痕。

## 四、边界与如实声明

- 本卷只读仓面文档+源码结构，未运行任何命令行/daemon/API（8710 TriRMC/443 caddy/8791 dsh 零碰遵守）。
- 「对比 sg 面现役形态」在培训维度无分域差异信息可采——两域共享仓内文档，未发现 sg 面专属培训资产；此结论以本机只读勘视范围为限。
- 评级口径=培训配套对「新人接手」的支持度，非代码功能成熟度（代码功能面归 Code Registry/CTO 域评估，本卷不代裁）。
- 本卷为评估记录，不是培训交付；改进项见改进计划卷（rdt-improvement-plan.md），均为待排程计划非已实现。
