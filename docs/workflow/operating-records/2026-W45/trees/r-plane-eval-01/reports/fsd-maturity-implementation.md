# 成熟度评估卷·实现域贡献（FSD 小全 / r-duty-fsd）

- 评估树：r-plane-eval-01 ｜ 席位：FSD（实现域认领：TriRLC 命令面 + 8711 族 API 面 + TriPilot 命令行为实现侧）
- 现查时刻：2026-11-04T05:37:57Z（本地 13:37+08）
- 方法与边界：纯只读静态摸底（源码结构/路由清单/git 对账/测试面盘点）；**零执行、零探测、零写**——8710 TriRMC（pid 224044）/443 caddy/8791 dsh（pid 525474）依令零碰未做任何请求；8711 评估对象 daemon 当前未监听（见 §5），运行时行为未经现验，全部判读基于源码与 git 实证。测试基线数字为 git log 溯源值，非本席现验，已标注。

## 0. 源级基线对账（评估前提，关键事实）

- TriRLC 本地 dev 与 origin/dev（sg bare `ssh://fleet@47.245.122.61/srv/git/TriRLC.git`）**0 领先 0 落后**，HEAD=067fbfd。
- 含义：R 面本地域与 M 面（sg）源码**同源零差**——成熟度差异不在代码层，在**运行态形态层**（daemon 是否起、进程监督、环境配置）。故本卷结论对两面同时成立，差异项单列 §5。
- 近期活跃度（git log 实证）：TUI 共有化段一（tui 全树迁 TriCode，cli.ts:615 动态 import `@trimetaverse/tricode/r-ink-tui/render.js` file:symlink 实时链，回归 655/655 零红 @fsd）、Read tool offset 越 EOF 显式化修复（25a6850）——**仓库处于活跃维护态，非冻结遗留**。

## 1. TriRLC 命令面（主对象）——判级：B+（功能完整，工程形偏手作）

事实清单（src/cli.ts，1,588 行）：

- 命令全集：`start / stop / restart / status / run / chat / list-sessions / config{pull,show,cache,verify} / cron{add,list,update,remove,run} / install-service / uninstall-service / install-reg-run / uninstall-reg-run`（cmdStart:186、cmdStop:290、cmdRestart:425、cmdStatus:434、cmdRun:458、cmdChat:480、cmdListSessions:771、cmdConfig:845、cmdCron:938）。
- Flag 面：`--port --name --displayName --agent --resume --permission-mode --allow --deny --add-dir --print/-p --list-sessions --acp`（parseArgs if-else 链，cli.ts:87-118）。
- 防呆细节实证：print 模式禁 bypassPermissions（cli.ts:141 fail-loud）；port-in-use guard 防 daemon 双起（cmdRun:459）；stop 走 fail-loud 报错+强停+终态核验双检查（cli.ts:418 注记）。

成熟度判读：

- ✅ 命令覆盖闭环（启停/状态/会话/配置/定时/服务安装全有），安全防呆点到位。
- ⚠️ 参数解析为手写 if-else 链+cmdCron 内层又一套 args 扫描（cli.ts:953-956）——无声明式命令表，无自动 help 生成，新增命令成本高且易漏 help。**实现债（非缺陷），改进见计划卷①。**

## 2. 8711 族 API 面（主对象）——判级：B（端面齐全，巨石结构是实现债主峰）

事实清单（src/server/app.ts，**5,673 行单文件**，raw http server）：

- 路由机制：`req.url === '...'` 字符串平铺匹配，62 处匹配 / 约 48 个端点，无路由注册表、无中间件分层。
- 端点族谱：`/healthz`、`/shutdown`、`/internal/v1/config×5`、`cron×4`、`init×13`（chain/selfcheck/role-catalog/assemble/events/onboarding×2/sync×2/confirm×2/first-collab/reset）、`projects×3`、`staffing×3`、`sessions×3+动态`、`interactions×2`、`letters×2`、`mcp×3`、`knowledge/metrics`、`ledger`、`notifications`、`tasks/submit`、`update/check`、`/v1/models`、`/models`、`/v1/messages`（Anthropic 兼容）、`/chat/completions`（OpenAI 兼容）、`/internal/v1/agent`。
- 鉴权：X-Internal-Token fail-closed 门（app.ts:1936-1956 注记：边界顺序=origin 伪造源挡→401 token→路由），trimc-auth.ts 52 行；对 TriMMC 侧调用带 token 转发（app.ts:1269/1331/1644）。
- SSE 双流：anthropic-stream.ts 411 行 + openai-stream.ts 328 行——双协议兼容面是产品亮点。
- 配套：daemon/service.ts 111 行 + watchdog.ts 409 行（进程监督独立模块）。

成熟度判读：

- ✅ 端点谱系完整（init/staffing/cron/interactions/sessions 全域在位），鉴权 fail-closed 形制正确，双协议流齐备。
- ⚠️ **5,673 行单文件平铺路由是本域最大实现债**：无路由→handler 映射表，变更热区全部集中在 app.ts，blast radius 失控（任何新端点都进同一文件）；路由级单测无法按族隔离。改进见计划卷②。
- ⚠️ 路由面无 smoke 套件：46 个单测集中在服务域（cron/heartbeat/init-chain 等），`req.url` 路由分支本身无逐端点测试映射（测试面盘点推断，非现验）。

## 3. TriPilot 命令行为 + GUI（辅对象）——判级：命令面 B+，GUI 面 B，工程结构 C+（巨石扩展宿主）

事实清单：

- tripilot-chat v0.0.13，engines ^1.96.0，注册命令 15 个（chat.open/toggle/openInEditor/openInNewWindow/resetViewDefaults、quickChat.toggle、newSession/selectSession、exportChatHistory、openSettings、copyModelIdsToClipboard、debug×4）——命令谱系完整含 debug 族。
- GUI 面：contributes 含 viewsContainers/views/menus/configuration——webview 视图容器在位（GUI 为辅，本轮只盘结构未跑 UI）。
- 客户端：TriLCClient.ts 427 行（8711 族调用封装）+ trilc-auth.ts 80 行（token 门配套）+ trilcDirect/{trilcClient,sseParser}（直连 SSE 解析）+ cli/tripilot-cli.ts。
- 测试脚手架：unit/integration/e2e 三层目录+`test:unit/test:integration/test:e2e:extension/test:coverage/lint` 全套 script，但**实际测试文件 unit=1/integration=1/e2e=2**——脚手架成熟、覆盖单薄（不判测试成熟度，只报文件数事实；深判归 STE 席）。
- 安全已落（git log 实证）：LG-002 daemon token 门（全调用面 X-Internal-Token 注入）+ P0-1 CLI 门禁（run_command 需显式 `--allow-shell` 默认拒绝模型驱动 shell / write_file 钳 cwd 外写入 / 每轮工具动作披露）。
- 技术债行内标记 3 处：extension.ts:648 与 :7646 同一笔 TODO(W30-S5)（tool listing 待换 TriLC `/internal/v1/agents` 端点）；:9161 `LAST_TODO_LIST` 系变量名巧合非债标记。
- **src/extension.ts 10,011 行巨石**——命令/视图/客户端粘合全在一文件，是 TriPilot 侧实现债主峰（与 TriRLC app.ts 同构病）。

## 4. 测试面与技术债标记面（实现域横切）

| 维度 | TriRLC | TriPilot |
|---|---|---|
| src LOC（TS） | 28,876（33 个 src 子模块，分域清晰） | 12,619（巨石 extension.ts 占 79%） |
| 测试文件 | 46 单测 + 3 集成流 | unit 1 / integration 1 / e2e 2 |
| 回归基线 | 655/655 零红（git log 067fbfd 溯源值，非现验） | 未见对账记录（归 STE 深判） |
| 行内债标记 | 0 处 TODO/FIXME/HACK | 2 处注释（W30-S5 同笔） |
| scripts 卫生 | dev/build/start/check/test（无 lint/coverage 专script） | 全套含 lint/coverage |

- TriRLC 零行内标记≠零债：债以 commit 注记与 registry 承载（如「deps ink 族本单不清候 CTO 裁」067fbfd 注记）——**债务台账化是优点**，但行内不可见，接手人需查 git log 才能见债，建议登记入模块 code-state.md（计划卷⑤）。

## 5. R 面 vs M 面（sg 现役）差异判读

- 源码层：零差（§0 对账）。**成熟度评估结论对两面同源成立。**
- 运行态层（本机实勘）：8711 TriRLC daemon **未监听**（ss 实证），8710/8791 现役在跑。R 面 daemon 起服/巡检 SOP 缺位——这不是代码缺陷，是**运行态成熟度缺口**（计划卷③）。
- 零碰约束下未对 8710/8791/443 做任何请求探测，M 面运行态健康度不在本席取证范围（如实声明）。

## 6. 实现域五维判级汇总

| 面 | 判级 | 一句话依据 |
|---|---|---|
| TriRLC 命令面 | B+ | 命令闭环+防呆到位，解析手作 |
| 8711 API 面 | B | 48 端点谱系全+fail-closed 鉴权，巨石 app.ts |
| TriPilot 命令/GUI | B+ / B | 15 命令全+views 在位，巨石 extension.ts |
| 测试面 | B-（TriRLC）/ C（TriPilot 覆盖数） | 46+3 对 4 文件；脚手架全套 |
| 安全面 | A- | token 门 fail-closed+P0-1 CLI 门禁已实证落地 |

> 判级为本席实现域专业判读（A→D 递降），供值席汇总参照；非门禁裁决，测试深判归 STE、发布 readiness 归 CTO。

## 使用依据

- 源码（只读）：`/srv/fleet/TriRLC/src/cli.ts`、`src/server/app.ts`、`src/config/env.ts`、`src/trimc-auth.ts`、`src/server/{anthropic,openai}-stream.ts`、`src/daemon/{service,watchdog}.ts`、`test/` 清单；`/srv/fleet/TriPilot/package.json`、`src/extension.ts`、`src/TriLCClient.ts`、`tests/` 清单。
- git 对账：两仓 `git log/rev-list/remote -v`（TriRLC HEAD=067fbfd，0/0 对 origin/dev）。
- 运行态实勘：`ss -tlnp`（8711 未监听；8710/8791 在跑，未探测）。
- CodeGraph 声明：本机无 codegraph 工具面（CLAUDE.md 宿主适用域=dev 宿主），如实降级 grep/定点阅读——纪律册例外条款 (1) 适用。
