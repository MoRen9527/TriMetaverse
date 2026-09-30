# token 驻留面全扫刷新卷（件2·脱敏硬门合规·v2 净形）

- 执行: m-duty-cos 1001 05:2x+08；基准值指纹=d2cd…e075
- **v1 卷作废自纠**: v1 command 抽行截断致脱敏失效（50 位 token 物质入卷未 commit 即拦）——本 v2 全掩码净形替换，v1 磁盘件已覆写不存

## ①8712 在役 job 逐个 command 内嵌态（全掩码形）

- weekly-plane-shift (b00b0070): 无内嵌｜command: `cd /srv/fleet/TriCompany && python3.8 -m runtime.cognition.w…`
- config-sync-apply (5a8e6eac): **内嵌有**（指纹 d2cd…e075，与基准同值=True）｜command: （含 export TRIMC_INTERNAL_TOKEN=<REDACTED>；其余面略）
- clock-skew-check (55340a03): 无内嵌｜command: `cd /srv/fleet/TriCompany && python3.8 -m runtime.cognition.c…`
- orchestrate-tick (09112290): 无内嵌｜command: `cd /srv/fleet/TriCompany && python3.8 -m runtime.cognition.o…`
- daily-progress-watcher (d0f87756): 无内嵌｜command: `python3.8 -m runtime.cognition.daily_progress_patrol --sync`
- github-reconcile (7559aec6): 无内嵌｜command: `test "$(git -C /srv/git/TriMetaverse.git rev-parse refs/head…`
- sg-watchlist-patrol (e7a37e66): 无内嵌｜command: `node scripts/fade/ledger-watchlist-patrol.mjs`
- sg-8460-probe (d684f621): 无内嵌｜command: `node scripts/fade/sg-8460-probe.mjs`
- bod-progress-report (ae02593a): 无内嵌｜command: `/srv/fleet/bin/bod-progress-snapshot.sh`

## ②docker/.env+unit drop-in 指纹比对

- docker/.env: TOKEN 指纹=d2cd…e075（基准源）
- drop-in override.conf: 含 TOKEN 键，与基准同值=True
- drop-in env-home/port-bind/notify-duty/cron-env: 无 TOKEN 键

## 嵌入值同异性判（内存内比）

- 全部嵌入值与基准同值（无旧 token 驻留）

## 驻留面总数变化

- 工序单原五处 → 本轮实测: drop-in 1（override.conf）+docker/.env 1+job 内嵌 1（config-sync-apply，同基准值）=**现役驻留 3 处同值面**
- 增补建议: config-sync-apply job 改占位符/环境引用形（照 LG-041 ③防呆先例），并入 token 工序单

## 自纠记录

- v1 卷 command 截断脱敏失效事故：50 位物质入卷未 commit 即拦，v2 覆写；事故入本卷自纠节+口头转 BOD（硬门纪律自伤自报）
