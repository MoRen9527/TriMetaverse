# p0fix3-trilc-http 执行日志（tick 20260827T074800Z）

编排实例：ceo-chief-of-staff 锚定（简报 /srv/fleet/shadow-plane/brief-20260827T074800Z.md）。任务：执行树 p0fix3-trilc-http 端到端——PD-1 fresh 派工 FullStackDeveloper 收敛 TriLC HTTP 面认证与 RCE 通道（审计发现 8=rmc-TriLC.md P0-1）→ PD-T fresh 派工 TestEngineer 门禁回归+验证记录 → 全节点 done 后置顶层 status=done 收口 → push → 台账回填。

## 就位勘察（07:49-07:53Z 实测）

- 基线：TM HEAD=a63cb3be 工作树 clean（除前树遗留 untracked .ledger-backfill-tmp.py 照旧不入库）；TriLC HEAD=ba32bc7=origin/dev=dev 三者逐字一致、工作树 clean，sg 线已含 runHarnessAgentLoop 架构勿回退。
- **修复标的签名对照（ba32bc7 权威线上 Grep/Read 逐字复核，与 rmc-TriLC.md P0-1 零漂移）**：
  - createServer 回调 app.ts:1419 起，/healthz :1421 为唯一无认证放行点；listen 仅绑回环 :3801；req.headers.host 直信 6 处（:1911/:2314/:3265/:3519/:3562/:3592），全程无 Host/Origin 校验。
  - 三通道：cron POST /internal/v1/cron/jobs :3391 无白名单 spread → timer.ts:221-222 job.command 分流 + :234-245 spawn('/bin/sh'|'cmd.exe') 原样执行；MCP add :3691 body 直传 connectServer；POST /shutdown :3600 无条件 process.exit(0)；_defaultPermissionMode 缺省 'bypassPermissions' :4079。
- 参照模式：trimc-auth=/srv/fleet/TriMC/src/server/app.ts:118-134（x-internal-token+Bearer 兜底+401 JSON）；参照为 fail-open 变体，本树反转 fail-closed 并扩为全局门（语义差异非逐字照抄）。
- 范围映射：§一批D=X-Internal-Token 全局门+Origin/Host 校验+cron command 白名单化；审计建议的 bypassPermissions 缺省改 default 不入本树范围（分两步走避让 heyuan 生产链路）。
- 环境事实：node v18.20.8；test script glob 形态（门禁沿用显式枚举等价口径）；tsconfig include 仅 src/**＝tsc 门禁不含 test；node_modules 在位实测免 npm install 先行。
- 爆炸半径预登记：全局门波及 HTTP 触达测试（Grep 预扫 10 文件命中）；TC-s1 harness 行为兼容红线在 tree-op notes；预置失败基线=tui debt 8 用例（HS-3 登记）。
- 通道：执行墙 DOWN 维持（git -C/Read/Grep/Glob 跨仓全通实测）；TriLC push 权限墙 memory 有前科待实测；GitHub 双端形态仓内仅单 remote 待探明。

## 动作序列

| # | 时刻(Z) | 动作 | commit |
| --- | --- | --- | --- |
| 1 | 07:53 | 骨架 state.json/log.md 落盘（勘察证据全量入 state.baseline：双基线、签名零漂移对照、参照实现定位、范围映射、环境/通道事实、爆炸半径与失败基线预登记） | 83bcf366（push a63cb3be..83bcf366 fast-forward 实测一次过） |
| 2 | 08:00-08:02 | 门禁工具链落树（reports/gate-runner.mjs=node spawn 包装捕获 TAP 应对审批墙拒重定向/tee 先例+enum-tests.txt=40 文件显式全枚举等价口径）；首跑默认系统 node18：295 tests/243 pass/**52 fail**——大面积 `ERR_UNKNOWN_BUILTIN_MODULE: node:sqlite` 环境性失败（node:sqlite 需 ≥22.5），该轮存档留作解释器选择依据非比对基线 | — |
| 3 | 08:03-08:06 | 启用记忆线索用户级 v22.14.0：gate-runner 增解释器选择器（优先 ~/.local/opt/node-v22.14.0-linux-x64，GATE_NODE_BIN 可覆盖+PATH 前插继承）重定基线 **451 tests/443 pass/8 fail**＝与 tc001-harness-scaffold HS-3 登记 tui debt 口径吻合；失败集五项=init-confirm×2（runConfirmCheck/runConfirm）+project-link validateLinkPayload×1+tools-ctx-cwd×2+tui/components 文件级（8 子债归并计数）——**权威比对基线=round0-node22 存档在案** | （本提交，双环境 TAP/JSON 全档入库） |
