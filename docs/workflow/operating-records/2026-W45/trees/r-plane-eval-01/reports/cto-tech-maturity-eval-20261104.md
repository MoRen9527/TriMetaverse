# r-plane-eval-01 · 成熟度评估卷（CTO 技术线）

- 评估席：CTO 小狄
- 评估时点：2026-11-04T05:36:48Z（13:36:48 +0800 date 现查）
- 评估对象：R 面本地域产品技术域——TriRLC（/srv/fleet/TriRLC，HEAD=067fbfd 2026-11-04）命令行为主 + 8711 族 API 面；TriPilot（tripilot-chat 0.0.13）命令行为辅
- 对比基准：M 面两域现役形态（基准引述，时效声明见 §0.1）
- 施工约束：全程只读实勘（grep/cat/git log/wc）；写面仅本树目录；8710 TriRMC / 443 caddy / 8791 dsh 零碰（未触碰）

## 0. 基准与边界声明

- **0.1 基准时效声明**：本席为 sg 侧会话，不可直读 M 面（dev 机）工作区。M 面形态引用以 TriRLC 仓内 `docs/registry/code-state.md` 记载 + 本席 dev 机先验（2026-10 中旬）为据，均标注「基准引述」；最终对表以 M 面席位复核为准。两域 git 双向同步在运转（HEAD 067fbfd 即今日 M→R 补链 merge 实例），基准漂移风险受同步机制约束。
- **0.2 评估深度限**：TriPilot GUI 面按令为辅未深勘；TriPilot docs 面、TriRLC vendor/ 未入本轮深勘范围，如实标注。

## 1. TriRLC 成熟度评估

### 1.1 架构成熟度 —— 评级 B+

- 模块划分 30+ 目录职责清晰：daemon/server/cron/heartbeat/session-store/event-queue/localbus/task-runtime/toolbus/planner/mcp/mirror/sync/skills/letter-store/update 等，边界可辨。
- daemon 生命周期面成型：launchd / schtasks / systemd 三平台 service + watchdog + pidfile + crash-handler（crash.log 零基线纪律曾在 M 面运营读数中验证）。
- **8711 族 API 面（code-state 记载 + 实勘源码互证）**：TriMMC 兼容协议——`/healthz`、`POST /internal/v1/heartbeat`、`/internal/v1/agent`；ConnectionManager（3 次失败降级 / 2 次成功恢复状态机）；degraded→connected 自动 `_performReplay()` 恢复回放；离网事件队列（SQLite WAL + prepared statements + batch transactions）；冲突仲裁 replay 链。**离网韧性架构是本域成熟度最大亮点**。
- 8711 引用面广泛且一致：watchdog 探活 / config 默认端口（`TRILC_PORT ?? 8711`）/ server / tools / compact 服务 / power-follower 共 8 文件引用，端口契约单一真源在 config/env.ts。
- 双 wire 协议兼容：anthropic-stream.ts（411 行）+ openai-stream.ts（328 行）。

### 1.2 变更热区与技术债

- **`src/server/app.ts` 5673 行巨石（首要拆分对象）**：8711 全部端点 + ConnectionManager + 代理 fallback + 回放触发单文件承载；git 热区亦集中于此域（obs 卡②③ 10-14 均落 server/heartbeat）。
- `src/cli.ts` 1588 行次大件；段拆已启动（t9：parseArgs 段拆出 tui-acp-cli.test.ts 拆件先例，2026-11-04）。
- TriPilot 侧 `src/TriLCClient.ts`（427 行）等旧名残留——2026-08-31 TriLC→TriRLC 改名波及面未全量收尾。

### 1.3 测试面 —— 评级 B+

- 47 测试件在册（cron 系 5 件 / heartbeat 系 3 件 / connection-manager / contract-resolver / session-resume / compact / degraded-alarm / crash-handler 等），覆盖生命周期关键路径。
- 今日 TUI 共有化迁移回归 **655/655 零红**（基线 758 对账：654 留 + 103 随迁 TriCode + 1 拆件新增，零消失——git 9dc5355 读数）。
- 白盒测试随被测物走纪律已在执行（tui 五件随迁 = 域归属一致先例）。

### 1.4 依赖面

- file: 协议本地链接三链：`@tricompany/agent-core`（TriCompany/packages/agent-core）、`@trimetaverse/tricode`（TriCode）、`trimodel`（TriModel）；agent-core/tricode 在 8 个源文件真实使用（index/cli/contract-resolver/agent-runner/node/openai-stream/file-ls/lead-tools）。
- **ink 族 21 行死重实勘确认**（20 项疑点 + yoga-layout-prebuilt 独立行）：src 内 import 全零（raw 宽匹配复核；唯一 `marked` 文本 hit 系 interactions.ts:64 注释非 import）——裁决详改进计划卷 §P0-1。
- **LG-040 护栏注记**：`@tricompany/agent-core` 引用须带历史限定语——组件名系 TriMC observability 迁移历史来源语义，现作为 TriRLC 运行时依赖活体存在；本卷不作「现役服务域主控」表述。

### 1.5 Registry 真源纪律 —— 评级 B（有漂移）

- `docs/registry/code-state.md` 在位且详实（Repository Map / Code Health / Quality Risks / CodeGraph 摘要 / Git Health 五段齐全），CTO-008-M / arch-trilc-daemon 门禁读数留痕良好。
- **漂移一处（实勘）**：code-state 记依赖 `@trimetaverse/agent-core` (file:../TriMMC/packages/agent-core)，package.json 实为 `@tricompany/agent-core` (file:../TriCompany/packages/agent-core)——2026-09 TriMC→TriMMC 改名波及后 registry 未随更。修正入改进计划 §P0-2（本席 CodeRegistry owner 权界内）。
- code-state 自述缺口在册：「尚未建立 registry 级代码健康评分和 git 健康摘要」；`docs/engineering/STATE.md` 甚薄（三行自述待补齐）——STATE 面与 code-state 面厚薄不均。

## 2. TriPilot 命令行面成熟度 —— 评级 C+

- tripilot-chat 0.0.13：VS Code ^1.96 扩展，17 activationEvents 命令族 + `bin: tripilot` CLI 入口在位；src 共 10,928 行，cli/ 与 trilcDirect/ 分目录。
- 版本语义滞后：功能面（会话族/导出/设置/调试命令族）已超 0.0.x 语义。
- 旧名残留：TriLCClient.ts 等（见 §1.2）。
- CLI 命令族独立文档面未见（评估深度限如实标注，不入硬结论）。

## 3. 对 M 面基准差（基准引述）

- M 面 TriRLC 同仓演进，10-21 Windows 装机窗收口（spawn 适配 / 四态全绿 / ConPTY 观察项候窗，git 07549a5/28f2f52 读数）——M 面首发形态偏 Windows（schtasks/sc.exe/ConPTY），R 面 sg 侧为 Linux systemd 形态。
- 两域架构同构无分叉，成熟度差主轴 = **平台适配面**，非架构债。git 双向同步机制运转正常（今日 merge 即实例）。

## 4. 成熟度总评

| 评估面 | 评级 | 一句话判据 |
|---|---|---|
| TriRLC 架构 | B+ | 离网韧性+跨平台 daemon+测试文化成熟；扣 app.ts 巨石+registry 漂移 |
| 8711 API 契约 | B | 契约有据双流兼容；扣契约无独立文档面/契约测试，散在巨石内 |
| TriPilot 命令行 | C+ | bin 在位功能可用；扣版本语义滞后+旧名残留+文档面薄 |
| 工程纪律 | B+ | 修复带回归号、门禁留痕、白盒随迁纪律在执行 |

## 5. 证据清单

- `/srv/fleet/TriRLC/package.json`（v0.9.0·bin 双入口·deps 全表）
- `git -C /srv/fleet/TriRLC log -15`（067fbfd…7aa5799）
- `src/server/app.ts` 5673 行 / `src/cli.ts` 1588 行 / `wc -l` 读数
- ink 族 20 项 import 零实勘（grep 双 pattern + raw 宽匹配复核）
- `/srv/fleet/TriCode/package.json` deps+peerDeps 全表（依赖接手证据）
- `docs/registry/code-state.md`、`docs/engineering/STATE.md` 头部
- `/srv/fleet/TriPilot/package.json`（0.0.13·17 命令·bin）+ src 10,928 行

（改进计划与裁决另卷：`cto-tech-improvement-plan-20261104.md`）
