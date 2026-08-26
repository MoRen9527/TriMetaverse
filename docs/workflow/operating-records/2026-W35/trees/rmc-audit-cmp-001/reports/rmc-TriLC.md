# TriLC daemon HTTP 面代码审计报告（rmc-audit-cmp-001 / AC-R3）

- 审计对象：`/srv/fleet/TriLC/src/server/app.ts`（4473 行，逐段完整 Read）+ `src/config/`（env.ts 174 / key-cache.ts 398 / key-encryptor.ts 63 / trilc-profile.ts 76 / contract-resolver.ts 378）+ `src/cron/`（service.ts 168 / scheduler.ts 66 / store.ts 413 / timer.ts 360 / session-reaper.ts 81 / types.ts 76 / index.ts 38）——节点动作指定的三域 14 文件全覆盖。
- 审计角色：TestEngineer（R 面执行实例，tick round 3；round 2 已完成同目标全量 Read 后断于报告撰写，本轮复核续写）。
- 分级口径：P0=可直达的提权/鉴权绕过/密钥泄露面；P1=安全弱化或高概率功能缺陷；P2=质量/可维护性问题。
- 计数：**P0=4 / P1=8 / P2=6**（合计 18 项）。

## P0（4）

### P0-1 全部 `/internal/*` 端点零鉴权（含命令执行注入点）
`src/server/app.ts:1463-3772`。`createServer` 请求处理器内所有 `/internal/v1/*` 路由（init/assemble、projects/link、init/sync/run、cron jobs CRUD+run、mcp/servers/add、sessions、interactions/answer、shutdown 等）没有任何 token/origin 校验；唯一门禁是 `app.ts:3801` 监听 `127.0.0.1`。与 TriRMC 同族缺陷（对照报告 P0-2 `/internal` fail-open），但 TriLC 面**直接叠加 P0-2 的 shell 执行注入点**：任意本地进程（含浏览器内页面经 DNS rebinding / 跨端口 localhost 探测）可 POST `/internal/v1/cron/jobs` 直接注册带 `command` 的任务并以 daemon 权限执行任意命令。注意 `app.ts:1805` 注释自称 "internal localhost-only 面（daemon 只绑定 127.0.0.1）"——绑定不是鉴权：同机任意用户级进程与 CSRF/rebinding 均可达。

### P0-2 cron `command` 字段无白名单直接 shell 执行（与 TriRMC runAs 同源缺陷）
`src/cron/timer.ts:217-231`（`executeJobCore`：`if (job.command) return executeCommand(job.command, deps.cwd)`）+ `timer.ts:234-271`（`executeCommand` 以 `cmd.exe /d /s /c` 或 `/bin/sh -c` spawn，注释自称 REQ-20260806-019 "deterministic command execution"）。写入面 `app.ts:3391-3414`（POST /internal/v1/cron/jobs 将 body 原样 `as never` 透传 `addJob`，`command` 字段零校验）、`app.ts:3433-3465`（PATCH 可改写 `command`）、`store.ts:294-297`（patch.command 直落库）。无命令白名单、无 runAs、无 cwd 逃逸约束。与 TriRMC `command-handler.ts:85` runAs 提权面同源：HTTP 可写 → 定时/手动（`app.ts:3491-3514` `/run`）全权 shell。

### P0-3 密钥缓存加密的"机器指纹"可伪造，S2 承诺不成立
`src/config/key-encryptor.ts:20-31`：KDF 口令 = `hostname:username:platform:arch`，盐 `FIXED_SALT` 是源码内编译期常量（`:15-18`），迭代 100k PBKDF2-SHA256。模块头注释（`:5-6`）承诺 "Even if keys.json is copied to another machine, it cannot be decrypted"——不成立：四个指纹分量全部可被攻击者廉价获取（hostname/username 常见于日志与路径，platform/arch 公开），离线恢复口令后即可解密任意拷贝的 `keys.json`（内含 deepseek/anthropic/openai/trimetaverse 四家 api_key，见 key-cache.ts:272-290 的 env 注入面）。实际安全等级 ≈ 混淆，不构成 S2。降级路径进一步放大：`key-cache.ts:302-309` `TRIMODEL_KEY_STORAGE_MODE=s3` 直接回明文存储；`key-cache.ts:106-118` 迁移时把明文旧文件复制为 `keys.json.s3-backup-<ts>` **长期留盘**，备份文件无任何清理。

### P0-4 provider api_key 以明文进程环境变量广播 + `.env` 多路径明文落盘
`src/config/key-cache.ts:272-290`（`applyKeyCacheToEnvironment` 把 4 家 provider 的 api_key 写入 `process.env.DEEPSEEK_API_KEY` 等）；`key-cache.ts:330` / `:375` 打日志带 `sanitizeKeysForLog` 结果（此处已脱敏，合格）。真正的暴露面：全进程任意 import 的第三方依赖与所有子进程（P0-2 的 `executeCommand`、agent 工具链 shell_exec）都能读 `process.env` 拿到全部密钥；`env.ts:72-93` `.env` 兜底加载器把 `TRIMODEL_API_TOKEN` 等持久在多个候选路径的明文 `.env`（`env.ts:52-65` 五候选：TRILC_ENV_FILE/工作区根/TriLC 根/dataDir/cwd），安装态机器上等价于把配置面令牌落多处明文盘。与 AC-R4（TriModel config）同域，留交叉引用。

## P1（8）

### P1-1 `_defaultPermissionMode` 缺省 `bypassPermissions`
`src/server/app.ts:4079`（`let _defaultPermissionMode: string = 'bypassPermissions'`），仅当 `TRILC_PERMISSION_MODE` 显式设置时覆盖（`app.ts:1339-1342`）。除 `/v1/messages` 交互请求注入 `INTERACTIVE_ASK_RULES`（`app.ts:2085-2089`）与 `-p` print mode 强制降级（`app.ts:1361-1364`）外，tasks/submit 任务流（`app.ts:3040` 直接用 `_defaultPermissionMode`）默认即 bypass——与 AC-R2 `loop.ts:346` 缺省 bypass 同源，TriLC 把该缺省带到 daemon 任务面（cron/heartbeat 任务同走此面）。

### P1-2 `/internal/v1/agent` 回退路径接受请求体直供 `permissionMode`/`permissionRules`
`src/server/app.ts:2369-2380`：本地 agentLoop 回退时 `permissionMode: parsed.permissionMode`、`permissionRules: parsed.permissionRules` 原样取自请求体，无白名单。调用方可直接声明 `bypassPermissions` + 自带 allow 规则覆盖服务端 CLI/持久化规则（对照 `/v1/messages` 走 `resolvePermissionMode`+`buildSessionPermissionRules` 的合并面 `app.ts:2082-2089`，此端点完全绕开）。代理到 TriMC 的分支（`app.ts:2318-2366`）同样把 raw body 原样转发。

### P1-3 task 流的 print-mode 展开为恒空对象（安全承诺落空 + 死代码）
`src/server/app.ts:3044`：`...(_printMode ? {} : {})`——两个分支都是 `{}`，注释声称 "C9: -p print mode: no onPermissionAsk (non-interactive — ask→deny)"，实际该端点从未注入 `onPermissionAsk`，task 流若命中用户持久化的 ask 规则将走 agent-core 的 ask 缺省策略而非承诺的 deny；`app.ts:1356-1364` 的 print-mode 语义对 task 流不成立。

### P1-4 `runJobNow` 手动失败路径与 scheduled 路径状态机不一致
`src/cron/timer.ts:335` 成功与失败都写 `state: "idle"`，而 scheduled 路径 `timer.ts:157` 失败置 `failed`；且 `runJobNow`（`:314-353`）不做 consecutiveFailures/degraded 记账（scheduled 路径 `timer.ts:164-181` 有），手动 run 连续失败不触发 `/internal/v1/cron/status` 的 degraded 面。单 job state 与引擎级降级两套账目对不齐。

### P1-5 notifications GET `?ack=1` 后响应体与 count 自相矛盾
`src/server/app.ts:3591-3597`：ack 分支先把所有 notices 置 read，再 `filter((n) => !n.read || ack)`——ack 时 `n.read` 已全为 true 但 `|| ack` 恒真，返回全部（含已读）最多 100 条；而同响应的 `count` 字段取 `notices.filter((n) => !n.read).length` 恒 0。body 100 条 + count=0 并存。

### P1-6 notifications 启动加载竞态：首写覆盖磁盘历史
`src/server/app.ts:1189-1196`：异步 IIFE 加载 `notifications.json` 无 await（start() 不等待），daemon 启动初期 GET 返回空集（丢通知窗口）；若 POST 在加载完成前到达，push 进空数组后 `:3586` 首次写盘会把磁盘上既有通知**整体覆盖**（丢历史）。

### P1-7 `ConnectionManager` 降速/恢复间隔调整永不生效（改字段不重建定时器）
`src/server/app.ts:794-812`：degraded>5min 时把 `healthCheckIntervalMs` 改 60s，恢复时 `:782` 写回 10s——但 setInterval 句柄按旧间隔创建（`app.ts:848-852`），改实例字段不重建定时器，"slow heartbeat" 承诺（注释 2.5）永不生效。死配置面。

### P1-8 `isLocal` 判定恒 false，local 模式整条不可达
`src/server/app.ts:1235`：`!env.trimcBaseUrl || env.trimcBaseUrl === 'http://localhost:8710' && !env.trimcBaseUrl`——`A === B && !A` 对非空字符串恒 false；前半因 env.ts:160 默认值 `'http://127.0.0.1:8710'` 也恒 false。`initialState` 永远 `undefined`（→'degraded'），`app.ts:764-766` local 日志与 `:968-970` standalone warning 不可达；未配 TriMC 的独立安装态被误判 degraded 并对默认地址空转心跳。

## P2（6）

### P2-1 SSE 端点 `res.write` 无背压处理
`src/server/app.ts:2135-2143 / 2395-2397 / 2996-2998 / 1566-1577`：SSE 写路径忽略 `res.write()` 返回值（false 不 pause 上游生成器），长任务+慢客户端下内存无界缓冲。任务流（`/sessions/{id}/stream`，由 `runCompactingAgentLoop` 持续产事件）风险最实。

### P2-2 ESM 源码内混用 `require()`
`src/server/app.ts:935-938 / 951-953`（ConnectionManager 持久化）在 ESM 文件里 `require('node:fs')`；纯 ESM 运行时抛错被 `:945 /* best-effort */` 吞掉且无日志——持久化静默失效。项目其余处全用 `await import()`（如 `app.ts:1370`），不一致。

### P2-3 占位工具注册的收集变量未消费
`src/server/app.ts:2072-2080`（`toolNames.push` 后无消费）、`app.ts:2488-2494`（OpenAI 路径同）。占位回调返回 `_trilc_note: 'tool execution delegated to client'`（`:2077/:2491`）与 daemon 侧 shell-exec 注册（`:1314`）并存的"谁执行工具"歧义面无代码内说明。

### P2-4 cron store JSON 镜像只写不读
`src/cron/store.ts:177-203`：`saveCronStore` 维护 `<db>.json` 镜像；`loadCronStore`（`:192-203`）导出后仓内零调用，`loadAll`（`:158-172`）只读 SQLite——两份状态可漂移无检测。死特性。

### P2-5 mtime 检测机制写好未接线
`src/cron/store.ts:150-172` 的 reload-if-mtime-changed 仅在 `loadAll` 内部自用；`getJob`/`listJobs`（`:246-252`）永远回进程内缓存，`armTimer`（timer.ts:87）每轮拿到的都是缓存——外部进程直改 cron.db 永不生效。`reloadIfChanged` 导出（`:410`）无调用方。

### P2-6 session-reaper 每轮重开 DB 连接且 busy 即静默跳过
`src/cron/session-reaper.ts:28-49`：每次 sweep `new DatabaseSync` 后 close；`BEGIN`+三条 DELETE 遇 busy 直接 ROLLBACK 返回 0（`:41-45`），整轮清理静默跳过无重试无计数上报。

## 正面观察（审计平衡性）

- `app.ts:689-691` 权限 ask 桥 2min 超时 fail-closed（deny）方向正确；`app.ts:1356-1364` print mode 强制降级 bypass 的安全意图明确。
- `app.ts:3010-3024`（C12 任务启动前模型注册表校验）与 `app.ts:3163-3179`（伪成功防护：零文本产出不发 task_done）是 W30 教训的扎实落地。
- `cron/timer.ts:66-79` 进程内互斥锁实现正确（含等待队列）；`timer.ts:246-251` 命令执行有 SIGKILL 超时兜底。
- `key-cache.ts:200-211` 日志脱敏（前 5 位+****）合格。

## 与 R 面他报告的同源缺陷谱系（对照汇总用）

| 缺陷族 | TriLC 本报告 | TriRMC（AC-R1） | agent-core（AC-R2） |
| --- | --- | --- | --- |
| HTTP 可写→shell 执行无白名单 | P0-2（timer.ts:217-239） | P0-1（command-handler.ts:85 runAs） | — |
| /internal 面鉴权缺失/fail-open | P0-1（app.ts:1463-3772） | P0-2（app.ts:121-122） | — |
| 权限面弱化/缺省 bypass | P1-1/P1-2（app.ts:4079·2376） | P0-3（decision-pipeline 子串匹配） | P0（loop.ts:346 缺省 bypass·spawn.ts:31-39 规则丢弃） |
| 密钥存储面 | P0-3/P0-4（key-encryptor/key-cache） | — | — |

## 证据边界

1. 逐行引用均出自本实例 Read 工具实读（app.ts 4473 行分四段全读；config/ 5 文件、cron/ 7 文件全读），非对端转述。
2. 未运行 TriLC 测试套件或动态验证 P0-1/P0-2 可达性（结论基于静态路径推导：监听地址 app.ts:3801 + 路由零校验 + command 直执行链 timer.ts:221-239）。
3. `src/daemon/`、`src/tools/shell-exec.ts`、`src/session-store/`、`src/heartbeat/` 等被 app.ts 引用但不在节点动作指定范围，仅按引用面评述未展开。
4. contract-resolver.ts 378 行已全读，属 config/ 域，无 P0 级发现（singleton 未初始化 throw 面 `:372-374` 由调用侧 catch 映射 503，`app.ts:1141-1147/1176-1182` 合格），故不单列条目。
