# 改进计划卷·实现向贡献（FSD 小全 / r-duty-fsd）

- 评估树：r-plane-eval-01 ｜ 伴卷：`fsd-maturity-implementation.md`（证据与判级在该卷，不重复）
- 现查时刻：2026-11-04T05:37:57Z（本地 13:37+08）
- 边界声明：本卷全部为**实现向建议**——模块边界与技术栈不动（架构裁决权归 CTO）；工作量粗估为 FSD 席单人日量级估算（±50%），供排程参照非承诺。

## ① CLI 子命令声明式化（TriRLC）｜P2｜~2d

- 现状：cli.ts 1,588 行，命令分发=if-else 链（:87-118）+cmdConfig/cmdCron 内层各一套 subcommand 扫描（:845/:938）；无自动 help。
- 建议：引入声明式命令表（command→{flags,handler,help} 单数据结构），三段解析（全局 flag/顶层命令/子命令）统一走表；help 文本由表自动生成。
- 验收锚：新增一条 CLI 命令只改一处表项；`trilc help` 全命令覆盖；现有 655 测试基线零红。

## ② app.ts 路由注册表化拆分（TriRLC·本域债主峰）｜P1｜~5d（分段施工）

- 现状：5,673 行单文件、62 处 `req.url===` 平铺、无中间件分层；任何端点变更都在同一热区。
- 建议（不换框架、不加依赖，纯结构重构）：路由表 `[{method,pattern,handler,auth}]` + 按族拆 handler 模块（config/cron/init/projects/staffing/sessions/agent-stream 七族，单文件≤500 行）；鉴权门收敛为表内 auth 标注，`/healthz` 等免鉴权端点显式声明。
- 施工约束建议：纯搬移零逻辑改动、分族分笔提交、每笔全量回归；SSE 双流（anthropic-stream/openai-stream）已是独立模块不动。
- 验收锚：app.ts 缩为引导器（≤300 行）；路由清单可由路由表机械导出（供文档与 smoke 测试双用）；655 基线零红。

## ③ R 面 daemon 运行态 SOP 化｜P1｜~0.5d（非代码活）

- 现状实勘：8711 未监听（评估时点），起服/巡检无成文 SOP；对照 8710/8791 现役有 watchdog（TriRLC 自带 watchdog.ts 409 行已具备能力）。
- 建议：R 面 daemon 起服→healthz 巡检→异常自愈三段 SOP 成文（落 TriRLC docs/），纳入值席巡检节奏；`trilc status`+`GET /healthz` 为巡检锚。
- 验收锚：任意席照 SOP 可在 3 分钟内起服并验证 healthz 200。

## ④ extension.ts 拆分（TriPilot·TriPilot 侧债主峰）｜P2｜~8d（分段，依赖 CTO 排期）

- 现状：10,011 行（占 src 79%），命令注册/视图/客户端粘合/聊天历史全在一文件。
- 建议：按 activation 装配层+commands/views/providers/welcome 四域拆模块；与 ② 同构手法（搬移零逻辑、分笔回归）。
- 优先级理由：P2 因 TriPilot GUI 为辅且近期刚落安全加固（LG-002/P0-1），大拆宜在安全回归稳定后动。

## ⑤ 技术债台账化（两仓横切）｜P3｜~0.5d

- 现状：TriRLC 行内零标记、债在 commit 注记（例：067fbfd「deps ink 族本单不清候 CTO 裁」）；TriPilot 2 处 W30-S5 TODO（extension.ts:648/:7646，tool listing 换 `/internal/v1/agents`）。
- 建议：逐条登记两仓模块 `docs/registry/code-state.md`（债务项/原因/偿还计划/锚 commit），行内标记保留作本地提示；W30-S5 两处给偿还排期。
- 验收锚：每笔债有 code-state.md 条目+锚 commit 可溯。

## ⑥ 路由 smoke 测试套件（TriRLC）｜P2｜~2d

- 现状：46 单测集中服务域，`req.url` 路由分支无逐端点映射测试；62 匹配/48 端点靠人工对账。
- 建议：依赖 ② 的路由表——由表机械生成 smoke 套件（每端点一鉴权+一 happy-path 断言），端点清单漂移即测试红。
- 验收锚：48 端点全覆盖、新增端点漏 smoke 即红；深度行为测试归 STE 席域，本席只铺 smoke 层。

## ⑦ 测试 script 卫生（TriRLC）｜P3｜~0.5d

- 现状：scripts 仅 dev/build/start/check/test，无 lint/coverage 专 script（TriPilot 侧已全套）。
- 建议：补 `test:coverage`/`lint` script 对齐 TriPilot 形制；覆盖率门禁值候 CTO 裁（本席只铺管道不设门槛）。

## 排期建议汇总（供 COO/CTO 参照，非本席自裁）

| 序 | 项 | 优先级 | 粗估 | 依赖 |
|---|---|---|---|---|
| ③ | daemon SOP | P1 | 0.5d | 无，可即刻 |
| ② | app.ts 拆分 | P1 | 5d | CTO 认可分段方案 |
| ① | CLI 声明式 | P2 | 2d | 无 |
| ⑥ | smoke 套件 | P2 | 2d | ② 路由表 |
| ④ | extension.ts 拆分 | P2 | 8d | 安全回归稳定+CTO 排期 |
| ⑤+⑦ | 台账/script 卫生 | P3 | 1d | 无 |

（总粗估 ~18.5 FSD 人日；①②⑥ 为一簇——② 是 ⑥ 的前置，建议按 ③→②→①→⑥ 串行入排。）

## 使用依据

- 证据底卷：`reports/fsd-maturity-implementation.md`（同树）。
- 架构边界参照：TriCompany 技术真源链（DESIGN.md→code-state.md）；本卷不越实现域，模块边界/框架选型变更一律候 CTO。
