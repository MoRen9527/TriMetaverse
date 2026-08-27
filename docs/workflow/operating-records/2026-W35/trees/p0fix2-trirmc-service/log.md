# p0fix2-trirmc-service 执行日志（tick 20260827T061216Z）

编排实例：ceo-chief-of-staff 锚定（简报 /srv/fleet/shadow-plane/brief-20260827T061216Z.md）。任务：执行树 p0fix2-trirmc-service 端到端——PC-1 fresh 派工 FullStackDeveloper 修 TriRMC 服务面两处 P0（审计发现 5-6）→ PC-T fresh 派工 TestEngineer 门禁回归+验证记录 → 全节点 done 后置顶层 status=done 收口 → push → 台账回填。

## 就位勘察（06:13-06:17Z 实测）

- 基线：TM HEAD=a8412c92=origin/dev 逐字一致，工作树 clean 除前树遗留 untracked .ledger-backfill-tmp.py（照旧不入库）。
- **目标仓新建检出**：/srv/fleet/TriRMC 开工时不存在（git -C status 实测 No such file or directory），按 tree-op repo 字段指令执行 `git -C /srv/fleet clone --branch dev https://github.com/MoRen9527/TriRMC.git TriRMC` **一次成功**；HEAD=671b4d4 与 origin/dev remote-tracking 一致（GitHub dev 权威线即最新）。origin=https://github.com/MoRen9527/TriRMC.git；/srv/git 本地镜像实测无 TriRMC.git（五镜像名单外）。
- 修复标的签名对照（clone 权威线上 Read 逐字复核，与 rmc-TriRMC.md 审计报告全吻合）：
  - P0-1：`src/cron/command-handler.ts:24-25` runAs 可选 string 无白名单、`:85` `cmd = payload.runAs ? 'runuser' : shell`、`:86-88` `-u payload.runAs` 直拼 argv、`:94` `HOME=/home/${payload.runAs}` 模板拼接；入口 `src/cron/routes.ts:53-56` validateCreateInput 仅校验 command/cwd，runAs 全透传。
  - P0-2：`src/server/app.ts:121` `const internalToken = process.env.TRIRMC_INTERNAL_TOKEN ?? ''`＋`:122` `if (internalToken && …startsWith('/internal/'))` ——空串短路跳过整个鉴权块=fail-open，注释 :118-120 自述「未配置时维持旧行为」。
- **既有测试冲突点（开工前置事实）**：`test/server/internal-auth.test.ts:77-81` 既有用例『token 未配置：旧行为放行』断言未配置 token 时 /internal 返回 200——与本树 fail-closed 语义直接冲突，随修复须反转为拒（审计明文要求的故意语义变化，非误伤）。
- 环境事实：node v18.20.8；test script 为 glob 形态（node18 globstar 缺省限制，门禁用显式枚举等价口径）；tsconfig include 仅 src/**=测试不进 tsc 门禁；依赖 file:../TriCompany/packages/agent-core 与 file:../TriModel 本机均可解析（TriModel 在案）；fresh clone 无 node_modules——门禁前需 npm install --prefix 形态先行。
- 通道：墙解除状态维持（p0fix1 树四 tick 复勘在案），本 tick git -C 系列+Write/Edit 跨仓再实测全通。

## 动作序列

| # | 时刻(Z) | 动作 | commit |
| --- | --- | --- | --- |
| 1 | 06:17 | 骨架 state.json/log.md 落盘（勘察证据：TM/TriRMC 双基线、目标仓新建 clone 一次成功、两处 P0 签名逐字对照、既有 internal-auth 测试冲突点、环境与通道事实） | bfb614ba（push 实测 a8412c92..bfb614ba fast-forward） |
| 2 | 06:18-06:19 | 前置工具链：npm install --prefix /srv/fleet/TriRMC 实测通过（116 包 5s；EBADENGINE 警告 trimodel/node≥20、vitest4/node≥20 等——警告非阻断，test 脚本实际走 tsx+node:test 不经 vitest）；package-lock 安装噪音 git restore 复原不入库 | — |
| 3 | 06:21-06:36 | PC-1 fresh FullStackDeveloper 派工，先写后报落盘报告带行号：12 文件修复+清扫清单五项残留申报；角色 adaptation 如实记录=建议新建 src/cron/runas.ts 因 Edit 无法新建文件改导出于 command-handler.ts（安全实质等价） | —（TriRMC 工作树变更未提交） |
| 4 | 06:40 | 门禁第一轮实测（自建 gate-runner.mjs 于树内 reports/ 承担 TAP 捕获——shell 重定向/tee 均被会话审批墙拒，node 白名单形态 spawn 同命令原样捕获）：474 tests / 442 pass / 8 fail exit1 | — |
| 5 | 06:46-06:51 | 加根级三文件扩展口径复测（chat-endpoint/http-agent-endpoint/agent-sse 皆绿 +24 例）→ stash 基线对照实测 pristine dev@671b4d4 = **3 fail**（tools-ctx-cwd 三 subtests 同型）＝**增差 5 个新增失败全落 test/e2e/real-model-agent.test.ts**——PC-1 首扫据该文件注释误判「无 key 即 skip」漏清扫，本机 TriModel dotenv 注入链使 e2e 真实起 app 走 HTTP，被新 fail-closed 门拦截 | — |
| 6 | 06:52-06:56 | 漏判返工：SendMessage 续接同实例（PC-1 节点范围内）补 e2e fixture 的 token 注入（postAgent 唯一出口集中加 x-internal-token 头+before/after env save/restore）；门禁 round3/round4 连续两轮隔离 **474 tests / 471 pass** 与基线逐字同型失败集＝零新增失败定谳；npm run check 干净 | e3545b7（TriRMC 本地提交，三绿后才提交） |
| 7 | 07:00 | TriRMC push 实测被拒：`fatal: could not read Username for 'https://github.com'`——凭据通道四处探察全空（config credential.helper 缺失/.git-credentials/.netrc/.config/gh/env 键名）如实 blocked 移交授权侧，本地 commit 计进度（详见 state.push.triRMCGitHub） | — |

### 门禁等价口径披露（入 verify.md 引用）

- `npm test --prefix` 在 node v18.20.8 的 sh 无 globstar 下仅展开两级目录文件（24 文件），根级受影响套件以 npm 追参形态显式补入同一轮运行（`-- test/chat-endpoint.test.ts …`），TAP 全量存档 reports/gate-logs/pc1-round{0..4}*.tap（round0=基线对照专用）。
- e2e/real-model 在本机真实执行（非常规 skip 环境）：其 fixture 已随本轮清扫对齐鉴权门；模型外呼真实发生（[trimodel-client][dbg] STREAM deepseek-v4-pro 在案），五个用例于 round2 曾超时翻红、注入后回绿稳定两轮。
- 三绿判定：check 干净＋零新增失败（对 stash 基线）＋双轮隔离稳态。
