# 河源 cron 重注册脚本+runbook（R 面韧性项·daemon 内部状态备份补齐）

- sourceOfTruth: TriMetaverse/docs/execution/lg-heyuan-cron-reregister-runbook.md
- syncMode: runbook｜lastSyncedAt: 2026-09-08
- 适用：河源 trirmc（8712）进程重启/数据灭失后的三 job 重注册（现役三 job 纯内存态实证勘定 2026-09-08）

## 前置

- 服务 active：`systemctl is-active trirmc`（预期 active）；
- token：`TOK=$(systemctl show trirmc -p Environment | grep -o 'TRIMC_INTERNAL_TOKEN=[^ "]*' | cut -d= -f2)`；
- 现态查询：`curl -s -H "X-Internal-Token: $TOK" http://127.0.0.1:8712/internal/v1/cron/jobs`。

## 重注册三 job（参数照现役实录 2026-09-08 抓取）

### job 1·weekly-plane-shift（周平面迁移，id 原值 9c81c7ec）

```bash
curl -s -X POST -H "X-Internal-Token: $TOK" -H "content-type: application/json" \
  http://127.0.0.1:8712/internal/v1/cron/jobs \
  -d '{"name":"weekly-plane-shift","schedule":{"kind":"cron","cron":"0 23 * * 0"},"enabled":true,"command":"<runbook 迁移五段链命令，照现役 command 字段实录回填>"}'
```

### job 2·rmc-orchestrate-tick（编排 tick，id 原值 381a1886）

```bash
curl -s -X POST -H "X-Internal-Token: $TOK" -H "content-type: application/json" \
  http://127.0.0.1:8712/internal/v1/cron/jobs \
  -d '{"name":"rmc-orchestrate-tick","schedule":{"kind":"cron","cron":"17,47 * * * *"},"enabled":true,"command":"<照现役 command 字段实录回填>"}'
```

### job 3·tricompany-pull（仓拉取，id 原值 fba9d2c7）

```bash
curl -s -X POST -H "X-Internal-Token: $TOK" -H "content-type: application/json" \
  http://127.0.0.1:8712/internal/v1/cron/jobs \
  -d '{"name":"tricompany-pull","schedule":{"kind":"cron","cron":"*/15 * * * *"},"enabled":true,"command":"<照现役 command 字段实录回填>"}'
```

## 验证

1. `curl -s -H "X-Internal-Token: $TOK" http://127.0.0.1:8712/internal/v1/cron/jobs`——三 job 在册+enabled；
2. 各 job 手动 run 一发（`POST .../cron/jobs/<id>/run`）→执行日志有痕；
3. healthz `jobCount=3 degraded=false`。

## runbook 序（进程重启后 10 分钟内完成）

服务起（systemd 自启）→token 取→三 job 重注册（本件三段）→验证三步→healthz 终态。全程 ≤10 分钟。
