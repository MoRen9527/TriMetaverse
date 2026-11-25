# CTO 点火标准形 SOP·单一真源（2026-11-25 21:4x·CEO 批设计批 B 件）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-ignition-standard-form-sop-20261125.md·点火 SOP 正身）
- syncMode: write-time
- 承接: CEO 批「设计批三件都批」B 件（BOD 转 21:45）+SDE 观察（r39/r40 缺 ignite.log·点火形漂移）

## §一 · 点火前六备（BOD 7 项 env 配方 + 三绑）

| # | 项 | 值/条件 |
|---|---|---|
| 1 | **用户** | `fleet`（`sudo -E -u fleet` 或 su fleet·**sudo 须 -E 保 env**） |
| 2 | **env 八项** | `TRICO_LOOP_MARKER_DIR=<dir>/loop-window.marker`｜`NOTIFY_SMTP_HOST`｜`NOTIFY_SMTP_PASS`（alert_credentials 源·值面零回显 D-46）｜`FADE_JOBS_JSON=/srv/fleet/TriRMC/data/cron/jobs.json`｜`FADE_OPERATING_ROOT=/srv/fleet/TriMetaverse/docs/workflow/operating-records`｜`FADE_WEEK=<2026-Wxx>`｜`FADE_PATROL_CADENCE=6m`｜`DCE_EXECUTE=1` |
| 3 | **ruling 三绑** | `ceo-ruling.json` 含 run_id/round_count/signed_at（+ruling_ref）·**消费戳 `.ceo-ruling-consumed.json` 清/重落** |
| 4 | **marker 重写** | loop-window.marker 重写（防陈旧） |
| 5 | **chown** | run dir 属主=fleet:fleet |
| 6 | **ignite.log** | **log 落 `<run_dir>/ignite.log`（标准形必备·r39/r40 缺=漂移实证）** |

## §二 · 点火命令形

```
sudo -E -u fleet env TRICO_LOOP_MARKER_DIR=... NOTIFY_SMTP_HOST=... ... DCE_EXECUTE=1 \
  <ignite 命令> --run-dir <run_id> --from-week W47 --to-week W48 --start-date <date> \
  --tmv-root /srv/fleet/TriMetaverse --tc-root /srv/fleet/TriCompany --queue-root round-queue-r12 \
  --checks four_true 2>&1 | tee <run_dir>/ignite.log
```

## §三 · 点火后三断言

1. **`<run_dir>/ignite.log` 存在且非空**（标准形锚）
2. **wrapper 退出即收**（`pgrep -af fade001` 链终点后零残留·瞬态 wrapper 自然退）
3. **preflight=pass** + prev/continue 语义（残拍继承照 R2 c）

## §四 · 执法面

- **统一入口**：非本 SOP 形的点火=违例（留痕：ignite.log 缺=非标准形铁证）
- **并入 D 系候选**（执法面条款·候 CAO/CGR）

## §五 · 使用依据

CEO 批令（BOD 转 21:45）+BOD 7 项 env 配方+SDE 观察（r39/r40 缺 ignite.log）+A1/A2/A3 的 env 消费面+DP-046（DCE_EXECUTE=1）+D-46/D-47。

---
—— CTO 小狄（m-cto）·写前现查 date（D-47 正形）
