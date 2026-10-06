# TriRLC cron command 白名单=精确等值全串比对

TriRLC app.ts L246 `cronCommandHttpAllowed`：`TRILC_CRON_COMMAND_ALLOWLIST` env 是**精确字符串等值白名单**（非目录/前缀/脚本名匹配），POST 创建+PATCH 更新两入口共拦，fail-closed（2026-09-30 COS 实弹两连 403 command_not_allowed 坐实）。

推论：**job command 任何字符变更（含路径迁移）=新命令串=必 403，须 allowlist env 追加+daemon 重启**——「job 字段走 API patch 非重启」只对 schedule/名称等非 command 字段成立，command 字段不适用。CTO 2026-09-30 凌晨曾错误指引「切路径走 patch 非重启」，被 COS 实弹验证拦下勘正——判断 cron 变更窗时先分清改的是哪个字段。

过渡技巧：路径迁移可先落「转发壳」（旧位一行 import 指针壳，command 不动零重启），command 切换+壳退役候下个 allowlist 重启窗随批。壳=临时垫须有退役时点，不留常驻。
