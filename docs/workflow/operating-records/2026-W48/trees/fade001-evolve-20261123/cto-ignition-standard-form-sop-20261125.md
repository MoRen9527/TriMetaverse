# CTO 点火标准形 SOP·单一真源（2026-11-25 21:4x·CEO 批设计批 B 件）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-ignition-standard-form-sop-20261125.md·点火 SOP 正身）
- syncMode: write-time
- 承接: CEO 批「设计批三件都批」B 件（BOD 转 21:45）+SDE 观察（r39/r40 缺 ignite.log·点火形漂移）

## §一 · 点火前六备（BOD 7 项 env 配方 + 三绑）

| # | 项 | 值/条件 |
|---|---|---|
| 1 | **用户** | `fleet`（**`sudo -H -u fleet`（-H 设 HOME=/home/fleet·必带）** + **env 显式列注入**）——**-E 保 env 但 HOME 留 /root→qualify 读 ~/.trimetaverse/notify.json PermissionError（SDE 21:52 实测抓坑·-H 与 -E 之别即此坑）** |
| 2 | **env 九项** | `TRICO_LOOP_MARKER_DIR=<dir>/loop-window.marker`｜`NOTIFY_SMTP_HOST`｜`NOTIFY_SMTP_PASS`（alert_credentials 源·值面零回显 D-46）｜`FADE_JOBS_JSON=/srv/fleet/TriRMC/data/cron/jobs.json`｜`FADE_OPERATING_ROOT=/srv/fleet/TriMetaverse/docs/workflow/operating-records`｜`FADE_WEEK=<2026-Wxx>`｜`FADE_PATROL_CADENCE=6m`｜`DCE_EXECUTE=1`｜**`HOME=/home/fleet`**（sudo -E 保留 HOME=/root 的副作用→段 2 qualify 读 `~/.trimetaverse/notify.json` PermissionError·SDE 21:52 实测抓出） |
| 3 | **ruling 三绑** | `ceo-ruling.json` 含 run_id/round_count/signed_at（+ruling_ref）·**消费戳 `.ceo-ruling-consumed.json` 清/重落** |
| 4 | **marker 重写** | loop-window.marker 重写（防陈旧） |
| 5 | **chown** | run dir 属主=fleet:fleet |
| 6 | **ignite.log** | **log 落 `<run_dir>/ignite.log`（标准形必备·r39/r40 缺=漂移实证）** |

## §二 · 点火命令形

```
sudo -H -u fleet env TRICO_LOOP_MARKER_DIR=... NOTIFY_SMTP_HOST=... ... DCE_EXECUTE=1 HOME=/home/fleet \
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
- **重跑一律新 run-id**（DP-030 自排除坑·SDE 21:54 实测抓出）：`check_ceo_ruling` 自排除 current run_dir→同 run-id 重跑时 prev 落旧完整轮（其 ruling 已消费）→awaiting rc=4——**每次重跑用新 run-id**（或新 ruling 落 prev 正身+清戳·两择一取新 run-id 为推荐）
- **残拍重签的 round_count 须全局单调**（T2a 单调门·SDE 21:55 实测抓出第二枚）：`check_ceo_ruling` L474-492 要求 round_count ≥ 更早轮已签件 max——**重签件的 round_count 必须 > 全部更早轮 max**（否则 regression→awaiting rc=4）；撤旧低号签件（留痕备份）可解
- **残拍锁窗**（R2 c 三态过滤·aae552d·SDE 21:57 实测抓出第三枚）：残拍 pf 后 ≤`FADE_STALE_RULING_MIN`（缺省 30min）未裁=锁（chosen 落残拍→ruling absent→awaiting rc=4）——解：v-round 落残拍（round_count 单调递增）/ 等窗过 / env 调小窗（门行为变更候批）
- **解门顺序（裁决门三道=同一族·SDE 归纳）**：①撤错件（非当前候选的低号签件）→②验单调（新签件 round_count>全部更早轮 max）→③解残拍锁（v-round 落残拍 或等窗）——**三道门=裁决门三态×重跑操作序**，按此序一次过
- **并入 D 系候选**（执法面条款·候 CAO/CGR）

## §五 · 使用依据

CEO 批令（BOD 转 21:45）+BOD 7 项 env 配方+SDE 观察（r39/r40 缺 ignite.log）+A1/A2/A3 的 env 消费面+DP-046（DCE_EXECUTE=1）+D-46/D-47。

---
—— CTO 小狄（m-cto）·写前现查 date（D-47 正形）
