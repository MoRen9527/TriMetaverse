# AC-MMC 审计报告：TriMC（现役服务器仓）

- 角色：CTO 架构/安全视角
- 日期：2026-08-25
- 被审仓库：`/srv/fleet/TriMC`（全程只读）
- 战役：audit-campaign-001
- 时间盒：≤11 分钟（到点成稿）

## 一、概述

TriMC 是 TS 单服务（node:http 手写路由）+ 少量 Python 心跳工具的组合：server 层裸暴露 `/internal/v1/*` 全套能力（cron 管理、claude 会话桥、agent-loop、任务镜像），cron 域复用 `@tricompany/agent-core` 的 JobExecutor 并叠加 bash 命令执行器，编排域经 session-bridge 以 `runuser` 降权驱动官方 claude CLI，agent-loop 是 agent-core 的薄壳 DI 层并带一套 Tier 1 权限引擎。

核心结论：**工程质量习惯良好（注释纪律、stale-run 恢复、进程组超时回收、execFile 防 shell 注入），但整个 HTTP 面建立在"内网即可信"假设上——零鉴权 + 默认监听全部网卡 + cron 任意命令执行，构成单点未认证 RCE**；权限引擎处于半成品态，不能作为编排安全边界依赖。

## 二、范围与方法

- 通读全文：`src/cron/`（service/command-handler/routes）、`src/server/app.ts`、`src/config/env.ts`、`src/orchestration/session-bridge.ts`、`src/orchestration/trilc-executor.ts`、`src/agent-loop/sub-agent/spawn.ts`。
- 抽读：`src/agent-loop/loop.ts`（薄壳 DI）、`src/agent-loop/permissions-engine/safety-check.ts` 与 `decision-pipeline.ts`（权限引擎）、`src/heartbeat/session_resume.py`。
- 方法：先 Glob 摸布局，按审计焦点优先级（cron → 编排/会话桥 → 权限引擎）通读，逐条以 file:line 取证。
- 未及覆盖面见第五节。

## 三、发现清单

### P0

1. **HTTP 服务全路由零鉴权 + 监听全部网卡 + cron 任意命令执行 = 未认证 RCE**
   - 证据：`src/server/app.ts:655`（`server!.listen(env.port)` 未绑定 host，Node 默认绑 0.0.0.0）；`app.ts:560-566`（cron 路由直接挂载，无任何 token/鉴权中间件）；`src/cron/routes.ts:91-105`（POST `/internal/v1/cron/jobs` 仅校验字段类型即入库）；`src/cron/command-handler.ts:83-88`（payload.command 经 `/bin/bash -e -c` 执行，cwd/runAs 均由请求方指定）；`src/cron/command-handler.ts:85-87`（`runAs` 不限账号名，root 进程下可 `runuser -u root` 提权执行）；`src/config/env.ts`（无任何鉴权配置项）。
   - 影响：任何能触达该端口的主体可创建 cron 任务在服务器上以任意身份执行任意命令，并可经 `/internal/v1/agents/{id}/message`（app.ts:179）向 claude 会话注入指令形成二次渗透通道。

### P1

1. **cron 手动 runJob 并发重入竞态**
   - 证据：`src/cron/service.ts:178`（读 `runningAtMs` 判重）与 `service.ts:181-182`（置位并 `await saveJobs`）之间无锁，两个并发 `POST .../run` 都可在对方落盘前通过守卫而双重执行；手动 runJob 与 executor 定时调度共享磁盘 job-store，均为 load→改→save 的 read-modify-write。
   - 影响：有副作用的作业（部署、git 写操作）可能并发双跑，产生重复副作用或 store 互相覆盖丢状态。

2. **acceptEdits 的 CWD 边界检查可路径穿越绕过**
   - 证据：`src/agent-loop/permissions-engine/decision-pipeline.ts:238-242`（`resolveRelativePath` 仅字符串拼接，不解析 `..`）；`decision-pipeline.ts:189`（`startsWith(normalizedCwd)` 前缀匹配无分隔符边界，`/srv/fleet/../../etc/x` 与 `/srv/fleet-evil/` 均判"界内"）；`decision-pipeline.ts:200-206`（cwd 缺省时无条件自动放行一切编辑，注释自认 "no CWD boundary check"）；叠加 `src/agent-loop/sub-agent/spawn.ts:72`（子代理缺省 permissionMode 即 `acceptEdits`）。
   - 影响：子代理/低权限会话默认即可在工作区外任意写文件，权限引擎形同虚设。

3. **claude 会话 spawn 存在 CLI 参数注入**
   - 证据：`src/orchestration/session-bridge.ts:94-97`（`['--bg','-n',employeeId,task]` 直接拼接）；`src/server/app.ts:227`（body.name 未做任何格式校验即作 employeeId 传入）。execFile 避免 shell 注入，但以 `-` 开头的 name 会被 claude CLI 当作 flag 解析（如注入模型/权限类参数）。
   - 影响：与 P0 叠加时攻击者可控 spawn 行为；即使有鉴权，name 黑名单缺失也是脆弱设计。

4. **task 工具的 bypass-immune 安全检查是空壳**
   - 证据：`src/agent-loop/permissions-engine/safety-check.ts:74-78`——注释宣称 "even with bypassPermissions, spawning agents always asks"，实现恒 `return { triggered: false }` 且标注 Tier 2 TODO。
   - 影响：编排树递归 spawn（含 bypassPermissions 模式下的子代理扩散）没有任何强制闸门，文档化保证与实现不符。

### P2

1. **敏感路径/危险命令检测为可绕过的子串启发式**：`safety-check.ts:92-99` 要求含 `.git/` 子串，路径恰以 `/.git` 结尾即漏检；不解析符号链接与 `..`；`safety-check.ts:125` 的 `rm -rf` 正则不覆盖 `rm -fr`、`rm --recursive --force` 等变体。
2. **deny 规则可被更高 source 优先级的 allow 覆盖，与注释矛盾**：`decision-pipeline.ts:30` 头注称 "deny overrides everything"，但 `decision-pipeline.ts:117-128` 显式允许高优 allow 压过 deny。
3. **规则内容匹配基于 JSON.stringify 子串且 wildcard 分支与精确分支代码完全相同**：`decision-pipeline.ts:101-107`，键名参与匹配易误配，转义值易漏配，isWildcard 无差异化语义。
4. **listAgents 错误吞噬且污染注册表快照**：`session-bridge.ts:146-148` catch 后静默返回 `[]`，桥接故障与"零代理"不可区分；`app.ts:163-168` 未命中即用新采集结果整体覆盖 `registrySnapshot`，采集失败时快照被清空导致后续消息寻址 404。
5. **buildRegistry 员工映射接线断裂**：`app.ts:122、164、233` 三处调用均不传 `employeeNames`，`session-bridge.ts:186-192` 中 employeeId 恒为 undefined，该映射功能实际空转。
6. **sub-agent 结果元数据失真**：`spawn.ts:108` 把 `tool_call_id` 当 `toolName` 上报；`spawn.ts:267` 注释"Track turns from tool calls"后无自增，`turnsExecuted` 恒 0；`spawn.ts:129-157` `collectResult` 定义后从未使用（死代码）。
7. **环境变量全量透传给降权子进程**：`command-handler.ts:93`、`session-bridge.ts:104/130/171` 均 `...process.env` 仅覆 HOME——root 会话中的密钥类变量随之下发给 fleet 账号进程。
8. **cron 日志无清理且查询全目录扫描**：`cron/service.ts:226-247` 每次 getLogs readdir 并逐文件 open/read，limit 截断发生在全量解析之后；无任何日志保留期/上限机制，长期运行后 I/O 放大。

## 四、质量总评

架构方向正确：agent-loop 薄壳化到 agent-core（DI 边界清晰）、cron 有 stale-run 恢复（service.ts:102-114）与进程组 SIGKILL 超时回收（command-handler.ts:147-160）、session-bridge 用 execFile argv 数组规避 shell 注入、日志文件 0600 权限，均体现不错的工程素养。但安全 posture 与"现役服务器仓"的定位严重不匹配：服务面零鉴权 + 全卡监听是必须立即收口的 P0；权限引擎（safety-check/decision-pipeline）多处文档与实现脱节、CWD 边界检查存在教科书式穿越绕过，当前只能视为演示级实现，不能作为编排层安全边界引用。建议优先序：① 给 `/internal/v1/*` 加共享 token + 绑定 127.0.0.1；② 修 acceptEdits 路径归一化（path.resolve 后比较）；③ runJob 加进程内互斥；④ 校验 agent name 格式（`^[a-zA-Z0-9_-]+$`）。

## 五、未覆盖（时间盒所限，如实列出）

- `src/node-bridge/bridge.ts`（与三面交界的重点项之一，未读）
- `src/heartbeat/checker.py`、`cli.py`、`models.py`（仅读了 session_resume.py 前 80 行，确认为纯报告辅助、无执行面）
- `src/orchestration/employee-scheduler.ts`、`dispatch-proxy.ts`、`cost-controller.ts`、`capability-router.ts`、`employee-registry.ts`（编排树状态机一致性/孤儿节点问题未能核实）
- `src/agent-loop/tools.ts`、`permissions.ts`、`permissions-engine/index.ts`、`rule-parser.ts`
- `src/mirror/store.ts`、`src/comm/arbitration.ts`、`src/task-controller/controller.ts`
- `src/policy-gate/`、`config-sync/`、`pipeline/`、`observability/`、`context-builder/`、`memory-injector/`、`soul-loader/`、`tool-gater/`、`prompt-cache/`、`contracts/`
- 外部包 `@tricompany/agent-core` 内部（JobExecutor 自身重入语义、job-store 原子写实现未核实——本报告 P1-1 的竞态结论基于 TriMC 侧调用模式推断）
- 运行态核查（实际监听地址、systemd 配置、防火墙）未做，P0 的网络可达性以代码默认行为为准。

## 附：实际读过的关键文件

- `/srv/fleet/TriMC/src/server/app.ts`（692 行，全文）
- `/srv/fleet/TriMC/src/config/env.ts`（全文）
- `/srv/fleet/TriMC/src/cron/service.ts`（全文）
- `/srv/fleet/TriMC/src/cron/command-handler.ts`（全文）
- `/srv/fleet/TriMC/src/cron/routes.ts`（全文）
- `/srv/fleet/TriMC/src/orchestration/session-bridge.ts`（全文）
- `/srv/fleet/TriMC/src/orchestration/trilc-executor.ts`（全文）
- `/srv/fleet/TriMC/src/agent-loop/loop.ts`（前 120 行，全文共 120 行）
- `/srv/fleet/TriMC/src/agent-loop/sub-agent/spawn.ts`（全文）
- `/srv/fleet/TriMC/src/agent-loop/permissions-engine/safety-check.ts`(全文)
- `/srv/fleet/TriMC/src/agent-loop/permissions-engine/decision-pipeline.ts`（全文）
- `/srv/fleet/TriMC/src/heartbeat/session_resume.py`（前 80 行）
