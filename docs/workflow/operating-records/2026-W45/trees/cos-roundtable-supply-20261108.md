# COS 圆桌会议供料卷 · 五件现文对答（CEO 16:43 圆桌·17:30 前候·值席调取执行）

- date 现查: 2026-11-08 16:5x→17:2x+08（D-47）；读面=TriMMC 8712 cron API（token 门内·值面零出机）＋/srv/fleet/bin 脚本本体＋hub-watch 快照真源

## ① d1-d4 工具族清单（sg 值守四具·逐项原文）

| # | 名称（job name） | 盯什么 | 拍频 | 通知链 |
| --- | --- | --- | --- | --- |
| d1 | daily-progress-watcher | 周平面 daily-progress 巡检＋T1-T8 判据集（sync 形） | 6×/时（5,15,25,35,45,55 分） | daily-progress.md 落卷＋巡检告警面 |
| d2 | hub-watch-snapshot | hub-watch 快照（mailbox 未读/watchlist/healthz/git_heads 四面聚合落 jsonl） | 10min | hub-snapshot.jsonl＋hub-silent-detect 唤醒链（duty-cos 静默升级=BOD 值守通报源） |
| d3 | sg-watchlist-patrol | 台账 watchlist 巡检（ledger-watchlist-patrol.mjs） | 5min | watchlist 告警面 |
| d4 | bod-progress-report | 大表快照+值守通报（bod-progress-snapshot.sh v2.2） | 30min | bod 快照落卷＋BOD 值守通报（本通报源） |

注：d1-d4 系圆桌问面命名——sg 侧四具按 job name 原文对应如上（若 CEO 面 d1-d4 别有所指·候对表勘正）。

## ② hub-watch-snapshot 信箱覆盖面

- **覆盖=按信箱 in-flight 派生**（per_seat 字典自 target_seat 派生·非固定 14 席名册）——最新快照（08:50:36Z）per_seat 实勘=**2 席：board＋m-duty-cos**（当刻有信在箱的席）。
- 全 14 席覆盖=否（派生形不等于名册形）——若需固定 14 席覆盖清单， hub-watch 脚本需挂名册常量（候改·非本卷造数）。

## ③ 仓盘点范围现文

- **git_heads 现文（hub-watch 快照 08:50:36Z）＝2 仓**：TriMetaverse=2a0042686／TriCompany=3e0994b——CEO 判「该看 /srv/fleet/ 全部仓不止两仓」成立：现文范围=仅 2 仓（快照 git_heads 字典钥匙数=2）·扩面（/srv/fleet 全仓族=TriRMC/TriRLC/TriCompany/TriMLC/TriModel/TriMMC/TriCode/TriGateway…20+）候改（改法=hub-watch 脚本 git_heads 字典扩键·非本卷造数）。

## ④ config-sync-apply 现文

- 原文 command：`export TRIMC_INTERNAL_TOKEN=$(sed -n 's/^TRIMC_INTERNAL_TOKEN=//p' /srv/fleet/TriMMC/docker/.env | tr -d '\015') && git pull --ff-only && node /srv/fleet/TriMMC/dist/src/cli.js config-sync apply`
- 拍频：900000ms=15min
- **拉平机 vs 重启生效差**：job=git pull --ff-only（拉平 TMV 工作树文件）＋config-sync apply（配置下发 apply 面）——**TriMMC daemon 进程本体不经重启**（git pull 更新 dist/文件≠运行中进程热载·daemon 代码变更生效须另走 restart 窗纪律）＝拉平与生效两层分立如实答。

## ⑤ github-reconcile 现文

- 原文 command：`test "$(git -C /srv/git/TriMetaverse.git rev-parse refs/heads/dev)" = "$(timeout 30 git ls-remote https://github.com/MoRen9527/TriMetaverse.git refs/heads/dev | cut -f1)"`
- 拍频：每日 09:07（7 9 * * *）
- **只发现不修复·修复授权面边界**：job=纯等值 test（sg bare dev hash vs GitHub dev hash）——零修复动作（不 pull 不 push 不 force）·test 失败=exit 1 告警面（发现面）——**修复授权面=BOD/人位令**（job 内零自动修复为设计边界）。

—— sg 值席 COS（五件现文调取毕·读面全 token 门内零值出机·落卷+对话流双答）
