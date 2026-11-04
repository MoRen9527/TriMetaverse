# 改进计划卷 · RDT 域（培训/接手性维度）

> 树 id=r-plane-eval-01 · 评估席=RDT（小吴）· 2026-11-04
> **状态声明：本卷全部条目为待排程计划，非已实现**——本评估施工约束为只读（仓面零写），任何施工须另行走正常派工/受托流程后实施。

## P0（接手性主缺口，建议优先）

| # | 改进项 | 落点 | 解决什么问题 | 验收方式 |
|---|---|---|---|---|
| 1 | TriPilot 模块导读（四要素：定位/成熟度/真源路径/常见误区） | `TriPilot/docs/training/` 新导读件 + 两侧主索引收编 | 主索引在册明文待补缺口；新人无 TriPilot 第一站 | 主索引条目可达；四要素齐；新人按导读可复述模块定位 |
| 2 | 8711 族 API 面端点清单文档 | `TriRLC/docs/`（api 契约件，建议 docs/api/ 或 docs/engineering/ 增补） | API 面零文档：HTTP+SSE 四文件（app.ts/anthropic-stream.ts/openai-stream.ts/interactions.ts）无端点清单、无示例、无鉴权说明 | 端点全覆盖+每端点一请求/响应示例；与 trimc-auth.ts 鉴权语义一致 |

## P1（命令行为主线的直接配套）

| # | 改进项 | 落点 | 解决什么问题 | 验收方式 |
|---|---|---|---|---|
| 3 | TriRLC 命令行入口代码导读（cli.ts→daemon→server 调用链第一课） | `TriRLC/docs/training/`（现仅 3 行占位） | 新人只能读源码自掘命令面；模块内培训真源待初始化 | 按「项目大图→模块图谱→全局流程→模块内部流程」讲法成件；含运行命令+验证方式 |
| 4 | TriPilot CLI 命令清单与用法示例（bin/tripilot→src/cli/tripilot-cli.ts） | `TriPilot/docs/training/` | bin 三段解析逻辑仅源码注释可见；CLI 用法零文档 | 命令清单+逐命令示例+每命令可运行验证 |

## P2（GUI 辅线与路径卡）

| # | 改进项 | 落点 | 解决什么问题 | 验收方式 |
|---|---|---|---|---|
| 5 | TriPilot GUI 代码导读（extension.ts→webview→TriLCClient/trilcDirect） | `TriPilot/docs/training/` | GUI 只有 2 篇对齐设计文档，无接手形态导读 | 与 copilot-chat-ui-parity.md 语义一致；入口→消息循环→工具调用链讲清 |
| 6 | 两模块 onboarding 学习路径卡（先读什么/后读什么/每步验证） | 两侧 docs/training/ | 现有 project-onboarding-for-beginners.md 不覆盖两模块 | 路径卡每步带验证方式；从矩阵导读起、到代码接手任务止 |
| 7 | AGENTS.md 四要素补齐（成熟度显式标注+常见误区段） | 两模块 AGENTS.md | 四要素现只齐二；新人缺「当前成熟度/常见误区」速览 | 两段补入且与 Update Discipline 防虚构纪律不冲突 |

## 施工前置约束（对后续派工的建议）

1. 施工时点与排窗照 D-23 v3 判据对轨（P0-2 涉 API 面盘点属专注窗类工作）。
2. 培训件施工前先勘 CTO 面技术真源与 Code Registry 现势（尤其 8711 API 面是否有 CTO 侧契约件在途，防重复施工）。
3. 模块导读补齐后走主索引收编（两侧 README.md 索引行），保持「培训真源顺序：docs/training → AGENTS/README → 源码」链路一致。
4. 全部条目实施后回归本树评估卷复核评级（中低/低→预期升至中）。

——RDT 小吴（技术研发培训师）· r-plane-eval-01 · 2026-11-04
