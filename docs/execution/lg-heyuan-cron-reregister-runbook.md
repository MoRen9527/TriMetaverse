# 河源 cron 重注册脚本+runbook（R 面韧性项·daemon 内部状态备份补齐）

- sourceOfTruth: TriMetaverse/docs/execution/lg-heyuan-cron-reregister-runbook.md
- syncMode: runbook｜lastSyncedAt: 2026-09-14（实录回填+PATCH 形态修订）
- 适用：河源 trirmc（8712）进程重启/数据灭失后的三 job 重注册（现役三 job 纯内存态实证勘定 2026-09-08）

## 勘正注记（2026-09-14 批令①执行实录）

1. **双面真相**：河源 trirmc 有两面——8712=systemd 服务本体（cron 引擎，三 job 健在）；8710=对外 API 面实例（cron disabled/jobCount=0 属该面形态，非引擎空载）。外网 8710 healthz 的 cron 指标**不代表**引擎真态；昨夜（2026-09-14 凌晨）以 8710 读数判「三 job 灭失」系误判，实际三 job 一直在册（id 与本 runbook 原值一致）。巡检第五对象以 8710 为代理面的 cron 指标读数=R-HY 侧盲区（如实标注，候巡检面修订）。
2. **token 键名**：本 runbook 原写 `TRIMC_INTERNAL_TOKEN`，实际 systemd Environment 键名=`TRIRMC_INTERNAL_TOKEN`（R 前缀）——前置取 token 命令已勘正。
3. **job 修复形态**：job 在册时用 `PATCH /internal/v1/cron/jobs/{id}`（payload 整体替换）；仅进程重启/灭失后用本件 POST 重注册。

## 前置

- 服务 active：`systemctl is-active trirmc`（预期 active）；
- token：`TOK=$(systemctl show trirmc -p Environment | grep -o 'TRIRMC_INTERNAL_TOKEN=[^ "]*' | cut -d= -f2)`；
- 现态查询：`curl -s -H "X-Internal-Token: $TOK" http://127.0.0.1:8712/internal/v1/cron/jobs`。

## 重注册三 job（参数照现役实录；2026-09-14 实录全量回填）

### job 1·weekly-plane-shift（周平面迁移，id 原值 9c81c7ec）

> **实录注记（2026-09-14）**：现役 command 已于本日经 internal API 实读回填（替代 09-14 凌晨三源同构重建版——重建版与实录有三处差异已勘正：实录含 GIT_SSH_COMMAND export 段+前置 `git pull --ff-only sg-bare dev` 段〔LG-016 payload 前置 ff 拉取〕；python3〔河源 3.12〕非 python3.8〔sg 侧形态〕；push 目标=sg-bare remote 名）。**push 段已加「被拒→fetch→merge 归账→重推」分支**（批令① 2026-09-14 PATCH 落地；台账锚 lg033-pool-sync-runbook §2.4 双向冲突 merge-only；merge 冲突则整链非零失败暴露→人工裁决线，不 force）。前置 pull --ff-only 失败（untracked 挡/分叉）即整链失败暴露——09-13 23:00 W38 缺失事故实证形态（.tricompany-cognition/knowledge.db untracked 挡 pull；已由 3b5e1562 untrack+gitignore 根治）。

```bash
curl -s -X POST -H "X-Internal-Token: $TOK" -H "content-type: application/json" \
  http://127.0.0.1:8712/internal/v1/cron/jobs \
  -d '{"name":"weekly-plane-shift","schedule":{"kind":"cron","cron":"0 23 * * 0","timezone":"Asia/Shanghai"},"enabled":true,"payload":{"command":"export GIT_SSH_COMMAND=\"ssh -i /home/fleet/.ssh/id_ed25519 -o StrictHostKeyChecking=no\" && cd /srv/fleet/TriMetaverse && git pull --ff-only sg-bare dev && cd /srv/fleet/TriCompany && python3 -m runtime.cognition.weekly_plane_shift --from {fromWeek} --to {toWeek} --start-date {startDate} --operating-root /srv/fleet/TriMetaverse/docs/workflow/operating-records --sync && cd /srv/fleet/TriMetaverse && git add docs/workflow/operating-records && (git diff --cached --quiet || git -c user.name=\"TriRMC-Scheduler\" -c user.email=\"trirmc@tri.company\" commit -m \"ops: weekly plane shift\") && (git push sg-bare HEAD:dev || (git fetch sg-bare dev && git merge --no-edit FETCH_HEAD && git push sg-bare HEAD:dev))","cwd":"/srv/fleet"}}'
```

### job 2·rmc-orchestrate-tick（编排 tick，id 原值 381a1886；2026-09-14 实录回填）

```bash
curl -s -X POST -H "X-Internal-Token: $TOK" -H "content-type: application/json" \
  http://127.0.0.1:8712/internal/v1/cron/jobs \
  -d '{"name":"rmc-orchestrate-tick","schedule":{"kind":"cron","cron":"17,47 * * * *","timezone":"Asia/Shanghai"},"enabled":true,"payload":{"command":"cd /srv/fleet/TriRMC && python3 scripts/rmc_tick.py","cwd":"/srv/fleet","timeoutMs":600000},"staggerMs":300000}'
```

### job 3·tricompany-pull（仓拉取，id 原值 fba9d2c7；2026-09-14 实录回填）

```bash
curl -s -X POST -H "X-Internal-Token: $TOK" -H "content-type: application/json" \
  http://127.0.0.1:8712/internal/v1/cron/jobs \
  -d '{"name":"tricompany-pull","schedule":{"kind":"cron","cron":"*/15 * * * *","timezone":"Asia/Shanghai"},"enabled":true,"payload":{"command":"cd /srv/fleet/TriCompany && git pull --ff-only origin dev","cwd":"/srv/fleet","timeoutMs":120000}}'
```

## 验证

1. `curl -s -H "X-Internal-Token: $TOK" http://127.0.0.1:8712/internal/v1/cron/jobs`——三 job 在册+enabled；
2. 各 job 手动 run 一发（`POST .../cron/jobs/<id>/run`）→执行日志有痕；
3. healthz `jobCount=3 degraded=false`。

## runbook 序（进程重启后 10 分钟内完成）

服务起（systemd 自启）→token 取→三 job 重注册（本件三段）→验证三步→healthz 终态。全程 ≤10 分钟。
