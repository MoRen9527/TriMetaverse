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
| 1 | 06:17 | 骨架 state.json/log.md 落盘（勘察证据：TM/TriRMC 双基线、目标仓新建 clone 一次成功、两处 P0 签名逐字对照、既有 internal-auth 测试冲突点、环境与通道事实） | （本提交，hash 见 git log 实测） |
