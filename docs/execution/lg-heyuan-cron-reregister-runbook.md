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

> **正身重建注记（2026-09-14 夜航01 任务1③）**：现役 command 实录随 heyuan TriRMC 内存态灭失（2026-09-14 远读 healthz cron jobCount=0）已不可回填，本条由三源同构重建——①身份/提交信息/触发时刻锚 f284c19b、03774c50 两笔迁移提交实证（TriRMC-Scheduler \<trirmc@tri.company\>／静态信息 `ops: weekly plane shift`／周日 23:00:0x +0800）；②路径锚 heyuan-branch-switch-impact §1.2/§1.3（检出=/srv/fleet/TriMetaverse，origin=sg-bare over SSH）；③命令骨架锚 TriMC 仓 PLANE_SHIFT_PRESET 同源模板（{fromWeek}/{toWeek}/{startDate} token 由 command-handler 替换）。**push 段含「被拒→再拉取→merge 归账→重推」分支**（夜航01 任务1③新增；台账锚 lg033-pool-sync-runbook §2.4 双向冲突 merge-only、禁跨 hub rebase 已推提交；merge 冲突则整链非零失败暴露→人工裁决线，不 force）。

```bash
curl -s -X POST -H "X-Internal-Token: $TOK" -H "content-type: application/json" \
  http://127.0.0.1:8712/internal/v1/cron/jobs \
  -d '{"name":"weekly-plane-shift","schedule":{"kind":"cron","cron":"0 23 * * 0","timezone":"Asia/Shanghai"},"enabled":true,"command":"cd /srv/fleet/TriCompany && python3.8 -m runtime.cognition.weekly_plane_shift --from {fromWeek} --to {toWeek} --start-date {startDate} --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records --sync && cd /srv/fleet/TriMetaverse && git add docs/workflow/operating-records && (git diff --cached --quiet || git -c user.name=\"TriRMC-Scheduler\" -c user.email=\"trirmc@tri.company\" commit -m \"ops: weekly plane shift\") && (git push origin HEAD:dev || (git fetch origin dev && git merge --no-edit FETCH_HEAD && git push origin HEAD:dev))"}'
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
