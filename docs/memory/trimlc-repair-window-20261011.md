# TriMLC 勘修窗 2026-10-11（件A/件B/件C 落位+shutdown 路径勘误）

> 跨域纪律归 TriCompany/docs/workflow/engineering-disciplines.md；本条=TriMLC 仓勘修窗工程事实与操作勘误。三笔独立 commit：件A fc44904（崩溃 handler）/件B cc52c89（race guarded）/件C baf800d（F-3 enabled 归一）。

## 件A：全局崩溃 handler（收口零 handler 静默 crash）

- `src/crash-handler.ts`：uncaughtException/unhandledRejection 双接→crash.log JSON 行（dataDir 下·appendFileSync **同步落盘**防 exit 截断·append 失败降级 console 防递归）+受控 exit(1) 交 watchdog revive。回滚通道 `TRIMLC_CRASH_LOG_ONLY=1` 仅日志不退。
- 单测设计：`installCrashHandlers` 返回 `{handle}` 供测试**直调**（不 emit 进程事件——防污染 test runner 全局状态）；onExit 注入 spy 防真退。
- 活体探针（S5）：一次性子进程 throw→exit 1+JSON 四字段行 ✓；**附锚**：logDir 不存在→append ENOENT→console 降级→照常 exit 1——降级面意外活体验证。

## 件B：race 缺口根治（43480 死因最强机制候选）

- `executeJobCoreWithTimeout` 裸 jobPromise 入 race：timeout 先 settle 后 job 滞后 reject→rejection 无人接=unhandledRejection。FSD 10-07 自愈卷 P3「race 已堵死」**仅状态面成立，rejection 传播面系方案未覆盖缺口**——对表他人方案卷时按语义面拆，勿整卷采信。
- 修复=guardedJob `.catch` 吸收转 error 结果再入 race——状态面零变（timeout 照旧先到先回），rejection 传播面归零。
- 单测技巧：process 层挂 `unhandledRejection` 计数器断言吸收（有监听→不 crash 但可计数：修复生效=计数 0，失效=计数 1）。**独立测试文件**——cron-skipped-degraded.test.ts 有全局 mock.timers 接管 setTimeout，混入互相干扰。

## 件C：F-3 第三型 enabled 缺省归一（修复落位）

- store.addJob INSERT `input.enabled ? 1 : 0`（undefined→0）绕过 schema DEFAULT 1；HTTP 面 app.ts `as never` 强转透传缺字段。修复=store 层 `(input.enabled ?? true) ? 1 : 0` **store 层归一即全入口覆盖**（app.ts 路由面不动）。
- **类型面配套双改**：CronJobCreate.enabled 改可选（`interface extends Omit` 惯形——**`Omit & {...}` 交叉形会破坏 CronStoreLike.addJob 方法语法依赖的参数双变通路**，service.ts check 实证）+CronStoreLike.addJob 内联签名同步 `enabled?: boolean`（可选/必填不齐→双变两向各挂一点：schedule 宽窄+enabled，全断）。
- 活体锚（S6）：POST 验证 job **payload 故意不带 enabled**→回读 enabled=true+next_run_at 非空+删净——三查门回归与 F-3 修复验证一并完成。

## shutdown 路径勘误（重启窗操作）

- 正身=`POST /shutdown`（**根路径**）；`/internal/v1/shutdown` 不存在。判读教训：**401≠路径存在**（鉴权层先拦所有请求，401 只证明 token 错，404 才是过了鉴权后的路由缺失——先 401 后 404 的变化=token 修对后暴露真路由缺失）。
- S4 重启链实操序：watchdog Disable→POST /shutdown（token 走 shell 变量**零回显**）→Get-NetTCPConnection 验 port FREE→`schtasks /run "TriMLC Daemon"` 冷启→healthz uptime 重置+pid/CIM created 对表（listen pid==pidfile `~/.trimetaverse/trilc-8713.pid`）→watchdog Enable。watchdog.log 尾条停在 Disable 前=护栏生效旁证。
- Git Bash 跑 schtasks 子命令吃 MSYS 路径转换（/change 被转路径）——schtasks 操作走 PowerShell。

## 幽灵面（如实记档）

- Win32_Process.CommandLine 对刚冷启进程返回空（两次）——pid 对表主断言（listen pid==pidfile pid+created 时刻）不受影响；cmdline 断言别硬等 WMI。
