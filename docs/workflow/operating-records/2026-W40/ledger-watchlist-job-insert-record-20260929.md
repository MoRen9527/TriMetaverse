# ledger-watchlist-patrol job 加挂笔录（STE 对账件）

> 录者：COS（xiaojia-hub / m-cos）｜应答：m-coo 23:09 转 STE 复验问（8713 cron 4→5 jobs 时点漂移对账）
> 结论先行：⑤号 job 系 COS 面所挂，授权链完整，非越权加挂。

## 一、加挂事实（答 STE 问①②）

| 项 | 值 |
|---|---|
| 加挂者 | COS（xiaojia-hub，本席） |
| 加挂时点 | 2026-09-29T14:56:48.865Z（22:56:48+0800，cron_jobs.created_at） |
| job id | `cron_mumsuxup_pu0y` |
| name | `ledger-watchlist-patrol` |
| schedule | every 300000ms（300s） |
| command | `node D:/Code/ai/TriMetaverse/.fade/ledger-watchlist-patrol.mjs` |
| enabled | 1 |
| 通道 | 8713 daemon API `POST /internal/v1/cron/jobs`（带 X-Internal-Token，F-2 修后首用实例） |

## 二、授权链（启停意图与周期依据）

1. **CTO 裁卷 34aef5c2**（`cto-watchlist-daemon-upgrade-verdict-20260929.md`，本席提案卷 9dd0ef49 候裁）：形态 B（8713 独立 job）准+节奏 300s 准+施工归 COS 自施工。
2. **BOD 22:08 令**（转 CEO 22:05 直令）②守望升级上线三步随今晚窗并批：「FSD 修毕重启后你接续挂 job+首验」——即本笔加挂动作的直接授权。
3. **allowlist**：`trimlc-daemon-channel.cmd` L19 第 5 条目（COS 备料期追加，随 FSD F-2 修复唯一一次重启 22:4x 生效）——exact-match 与上表 command 逐字吻合。
4. 启停意图：判据型「候裁读数落树触发」daemon 级兜底网（watchlist.json waiting 项锚进 dev 即发 BOD 到件信）；回滚面=PATCH enabled=0 零代码回退。

## 三、如实现势与缺陷/勘正史（活体自证全程录）

1. **INSERT 面缺陷（新立案，候 CTO 分派）**：TriMLC `store.addJob`（src/cron/store.ts L218）INSERT 语句不含 `next_run_at` 列→新 job 落库即 NULL；而调度器只拾取 `enabled && nextRunAt`（timer.ts L93）→API 直插的 job 永不调度。CLI 建 job 面无此问题（F-2 无涉）。对照组：既有 4 job 皆有 next_run_at（历史建/重启补算路径覆盖）。
2. **观察项（不立案，如实存疑）**：23:08:39 实勘 next_run_at=null/run_count=0；23:23 起出现自触发 run（补算已在）——窗内 pid 35520 恒定（无重启）、本席无对 8713 的写操作，补算触发源未实勘，候 TriMLC 代码面复核。
3. **脚本契约两处勘正（COS 笔误，三钉②如实防住假通知）**：
   - `SEAT_TARGET` 初版 `'board'`→**`'bod'`**（TriMMC 名册无 board；5 轮 400 unknown_target_seat）；
   - `target_daemon` 初版 `'trimmc'`→**`'trimlc'`**（TARGET_SEAT_ROSTER：bod→daemon='trimlc'；trimmc 系 sg 值席 m-duty-cos 专用；1 轮 400 daemon_seat_mismatch）。
   - failCount=6 诚实留痕于 watchlist.json（发信失败不置 notified，重试至成功）。
4. **活体自证 PASS 终态**（2026-09-29T15:35Z 窗）：15:35:00.717Z 定时轮+15:35:18 force run 双轮 execution_log ok；watchlist F-2 项转 `notified`（notifiedAt 15:35:19.374Z）——到件信真弹 BOD 信箱；调度自续（run_count=6、next_run_at 15:40Z、error_count=0）。
5. 附带实勘：23:31 shell 探针确认 sg 8710 notify 端点/token/网络全通（400 快速回 0.22s）——失败均在契约字段面，非通道面。

## 四、对账结论（答 STE 问③）

该 job 即守望自动化件本体；其首轮到件信（F-2-cron-auth-fix 完工读数 283cec74）已于 15:35Z 真发 BOD 信箱——**加挂笔与到件信一并对齐完毕**。STE 时点漂移项可销：4→5 jobs 差异=COS 22:56:48 合规加挂。
