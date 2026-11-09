# r-plane-eval-01 · 成熟度评估卷（CPO 小乔）

> 树 id=r-plane-eval-01 · M 面 COO 派工 2026-11-04T12:52:29+08 · 投递手 m-sde
> 评估席=CPO（小乔/r-duty-cpo）·认领域=产品成熟度评估主域（命令行为主·8711 API 面·GUI 为辅）
> 评估时点=2026-11-04T05:31:23Z+8 现查起卷 · 施工=纯只读（源码/配置/仓面零写，写面限本树目录）

## 一、评估口径与范围

- **评估对象**：R 面本地域产品——TriPilot+TriRLC 命令行为主、8711 族 API 面、TriPilot GUI 为辅。
- **对比基准**：M 面两域（sg 面 TriRLC/TriPilot 现役形态口径，以仓面 registry/README 记载现役连接面为准）。
- **成熟度四级判标**（本卷口径，证据四元组随判级附）：
  - **P0 现役**：实现完整+测试在位+真实运行验证读数存在。
  - **P1 可用**：实现完整+测试在位，运行读数未并卷。
  - **P2 雏形**：功能厚但质量门禁薄，或发布形态未定。
  - **P3 规划**：文档有、代码无。
- **边界声明**：本卷只读仓面实现态与测试面证据；运行态读数（uptime/任务闭环率/崩溃率）归值席与 COO 经营面并卷，本卷不混入、不估读。

## 二、分面成熟度判级

### 面 1 · TriRLC 命令行面 —— **P1 可用（偏现役）**

| 证据项 | 读数 |
|---|---|
| CLI 正身 | `src/cli.ts` 1588 行，bin 双名 `trirlc`/`trilc`（兼容面） |
| 命令族 | start/stop/status/run/help + daemon(install/uninstall/stage/status) + cron(add/list/update/remove/run/log/status) + config(pull/show/verify/cache show/cache clear) + mcp 子命令 + TUI Chat + Windows Service/Registry Run + launchd/systemd/schtasks 三平台守候 |
| 测试面 | `test/` 40+ 文件：cron-boot-recovery、cron-role-gating、cron-timeout-race、heartbeat-fail-class、session-resume、contract-resolver、crash-handler、degraded-alarm 等 |
| 判级理由 | 命令族齐全、守护三平台覆盖、测试面厚；CLI 经 HTTP（8711）调 daemon 的 cron/config 链路端到端在位。未判 P0 因运行态读数未并卷 |

### 面 2 · 8711 族 API 面 —— **P1 可用（协议面为核心现役件）**

| 证据项 | 读数 |
|---|---|
| 服务端正身 | `src/server/app.ts` 5673 行 + anthropic-stream.ts 411 行 + openai-stream.ts 328 行 |
| 端点族 | `/healthz` + `/internal/v1/config/*`(5) + `/internal/v1/init/*`(13：chain/selfcheck/role-catalog/assemble/events/onboarding/sync/confirm/first-collab/reset) + `/internal/v1/projects/*`(link/claim/inspect) + `/internal/v1/staffing/*`(roster/onboard/decide) + `/v1/models` + `/internal/v1/knowledge/metrics` + `/internal/v1/interactions/*`(pending/answer) + `/v1/messages`(channelMode) + cron HTTP 面 |
| 协议双栈 | Anthropic 流 + OpenAI 流双协议；事件族 request_start/assistant_message/tool_call/tool_result/loop_end/compaction 族/recovery/error；任务状态机 pending/running/success/failed/cancelled |
| 判级理由 | 端点族 30+、双协议流式、公司初始化链（staffing/init）API 化完整。风险注：全部主端点挂 `/internal/v1/*` 无对外契约承诺——对外产品化前需契约稳定化（见改进卷 X2） |

### 面 3 · TriPilot GUI 面（辅） —— **P2 雏形偏可用**

| 证据项 | 读数 |
|---|---|
| 正身 | `src/extension.ts` **10011 行单文件**：webview chat + settings panel + CHO 审批面板代理（approver=panel-cho 审计留痕）+ 会话管理 + chatHistory + mcpClient + trilcDirect SSE 直连客户端（402 行） |
| CLI 侧 | `src/cli/tripilot-cli.ts` 775 行：read_file/write_file/list_directory/search_files/run_command/code_task 工具环 + anthropic 流解析 |
| 版本形态 | v0.0.13 · publisher=`local` —— 未正式发布形态 |
| 测试面 | unit 仅 `sseParser.test.ts` 一个文件；E2E 框架已规划（TESTING_FRAMEWORK.md）候接 `@vscode/test-electron`，现仅 `run-extension-e2e.mjs` 骨架 |
| 判级理由 | 功能厚度够（chat+设置+审批+直连），但质量门禁薄（单测覆盖个位数文件）、发布形态未定——不判 P1 |

## 三、对比基准：M 面两域 vs R 面本地域

| 维度 | M 面（dev 机现役形态，registry 口径） | R 面（sg 本地域，本次评估对象） |
|---|---|---|
| 代码基 | 同源（TriRLC/TriPilot 单仓双机部署） | 同左 |
| 连接面 | TriRLC daemon 8711 经 `TRIMC_BASE_URL` 上送 sg 中央 8710 TriRMC（LG-030 勘定）；TriPilot 默认直连 TriRLC，崩溃切 TriMMC（TWF-001） | heyuan TriRMC 为 R 面周平面迁移自治执行点；现役 sg 侧 8710 TriRMC/443 caddy/8791 dsh 为零碰件 |
| 验证态 | 研发主跑道，长期现役运行验证 | 部署态新起（W42 部署），运行读数待积累 |
| 产品成熟度含义 | 两域产品面同源——成熟度差异不在产品本身，在**运行验证环境**：M 面读数是基准线，R 面读数是部署验证线 |

**结论**：R 面本地域产品成熟度=继承同源实现态判级（面 1/2 P1、面 3 P2），部署验证态为增量项候读数并卷。产品侧与 M 面无分叉、无漂移。

## 四、产品 registry 现势缺口（评估副产物）

1. `TriRLC/docs/registry/product-state.md` 的 Current Progress 仍是首版口径（"产品资料偏向架构和职责层"），未反映现实现态：P1/P2 工具层全家、公司初始化链 API 化、cron/heartbeat 面三平台守护——**registry 滞后于实现约两个迭代**。
2. `TriPilot/docs/registry/product-state.md` 已自认"尚未沉淀为稳定的 registry 快照"；MVP 验收标准（CPO 裁决 #9-#11）在卷但 Electron 形态未落，现形态为 VS Code 扩展——**MVP 载体口径需勘正**。
3. 两模块均缺 API 面/CLI 面产品文档页（见改进卷 N2）。

## 五、使用依据

- 仓面只读取证：`/srv/fleet/TriRLC/`（README、package.json、src/cli.ts、src/index.ts、src/server/app.ts、test/）、`/srv/fleet/TriPilot/`（README、package.json、src/extension.ts、src/trilcDirect/trilcClient.ts、src/cli/tripilot-cli.ts、tests/TESTING_FRAMEWORK.md）
- registry 面：`TriRLC/docs/registry/product-state.md`、`TriPilot/docs/registry/product-state.md`、`TriMetaverse/docs/registry/product-state.md`、`business-strategy-state.md`
- 经营面：W45 周经营单 OP-202611-W45-001.json、本树 claims.md（值席汇写版）
