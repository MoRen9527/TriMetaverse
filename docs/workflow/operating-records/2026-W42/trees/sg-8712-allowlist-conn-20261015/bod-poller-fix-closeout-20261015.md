# BOD 毕报卷 · P0-2 poller 读死文件一行修（步2·毕）

- sourceOfTruth: 本卷（trees/sg-8712-allowlist-conn-20261015/bod-poller-fix-closeout-20261015.md）
- syncMode: static（毕报·Q1 评估卷 c2089c4cc 步2 施工卷）
- lastSyncedAt: 2026-10-15 17:26 +0800（date 现查）

## 一、裁定与护栏

- BOD 裁准（D-39 授权面·可逆一行修·急）：修前护栏=CTO 明示「先读判定段断言换源后零积压重放」。
- 判定断言两轮：①调度源勘误=**fleet crontab** `* * * * * /home/fleet/notify-poller.sh`（非 CTO 所述 root·root crontab 零 poller 行）；②活文件时戳字段=**enqueued_at**（首查用 received_at/created_at 得 today=0 假读数·修正字段后今日信在案）。

## 二、重放面断言（护栏核心读数）

| 项 | 读数 |
| --- | --- |
| 活文件 target∈{m-duty-cos,m-duty-sde} | 274 封 |
| KNOWN 现有（死文件 16 天遗产） | 7 行 |
| 直接换源将重放 | **274 封**（按日 10-05:85/10-06:128/10-07:41/…） |

→ 直接换源=tmux 提示 274 连发轰炸值席——**不可直接换**。

## 三、施工实录（17:22 一体化·ssh root 面）

1. 备份：poller.sh→.bak-20261015·known→.bak-20261015；
2. **预填 KNOWN**：活文件 target∈SEATS 且 enqueued_at<'2026-10-15' 的 272 封 message_id 追加（保留原 7 行→279 行）；**留今日 2 封不预填**（04:15Z/09:15Z 两封 liveness 信）——既零积压重放，又留新链路活体验证样；
3. 换源：sed 改 BOX 行 TriMC→TriMMC（L8 `BOX=/srv/fleet/TriMMC/notify-outbox.json`·grep 断言过）；
4. 无重启动作（fleet crontab 每分钟自然拉起下 tick 生效）。

## 四、活体验证（17:23/17:24 两拍）

- 17:23:03 `NEW: ntf-mv8xrhunpb1u35 | m-duty-cos | [L1/M-SG] trimc liveness issues`（=今日第 1 封·tmux 提示已发值席）
- 17:24:03 `NEW: ntf-mv8xy2oolcwj9w | m-duty-cos | [L2/dev-win] remote liveness issues x1`（=今日第 2 封）
- **零风暴**（无历史重放行）·KNOWN 279→281（poller 自写新 id=写回链路活）✓
- 判定：**步2 毕·零积压重放成立·提示链复活**（16 天来 sg 值席 tmux 新信提示首次恢复）。

## 五、如实记两笔

1. 判定段初查两疑点（root crontab 零命中+today=0）均系本席初判字段/对象错——fleet 调度源+enqueued_at 字段修正后全通——「答不存在前必须全仓扫过」同族教训（调度源对象断言+字段名断言都该首查实源）。
2. poller.sh 属 root:root 644·sed -i 原地改未动属主；KNOWN 同。回滚路径=两 .bak-20261015 还原（cp 回即净）。

## 六、销账与归一注

- 步2=毕（本卷三证：断言读数+施工实录+活体验证）；
- 步3 目录归一+token 轮换同窗=**候 CEO 批**（与 service 两案一并呈报）；
- 归一后 poller BOX 路径随归一窗再勘（候考池重裁锚与 COS 巡检令同窗）。

—— 落款（date 现查）: 2026-10-15 17:26 +0800（BOD）
