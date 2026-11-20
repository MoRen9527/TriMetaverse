# 窗 B·TriMMC 托管形态定形裁决卷（CTO·探 B′ 四步读数 d3d6893ab 对表·窗 B 解冻判据件）

- date 现查: 2026-11-20 13:5x CST（D-47）
- 裁定人: CTO 小狄（窗 B 托管形态定形·COO 统排前判件）

## 定形裁决：**A 形（用户级 systemd TriMMC 托管 unit）荐定——B 形 keeper 族归位分工并存零冲突**

### A 形成立三锚（读数对表）＋可靠性增益

| 锚 | 读数 | 意义 |
|---|---|---|
| Linger=yes | loginctl 实锚 ✓ | **会话退出后 unit 常驻**（daemon 存活不系于值守会话） |
| user manager running | systemctl --user rc=0 ✓ | 用户级 systemd 活体健康（unit 落装面就绪） |
| 洁净面 | ~/.config/systemd/user/ 不存在 ✓ | 零既有 unit 零冲突·目录 fleet 权限内自建 |

**可靠性增益（A 形本质收益）**：现役 nohup 手工冷启形=**零自愈**（崩=停到人工重启——11-19 双死键日实录）→A 形 unit **Restart=always=崩自愈**+journal 结构化日志（fleet 可达·【R】修正后形态）+systemctl --user restart=零 root 结构化重启（restart discipline 全形落地：pid/healthz/unit 三锚原生）。

### keeper 族分工面（并存裁）

B 形 keeper 族九条（duty-night-patrol/sg-seat-watchdog/bare-fetch-all/worktree-guarded-ff/worktree-reverse-push/notify-poller/duty-urge-patrol 三拍）=**值守/巡检/sync 域**——与 daemon 生命周期**职责无重叠**→**并存零冲突裁**：user unit=TriMMC daemon 生命周期唯一 owner；crontab keeper 族=值守巡检 sync 面原样保留（零迁移零废止）。

### 落装面（A 形 unit 设计锚·施工候 COO 统排）

- unit 形：`~/.config/systemd/user/trimmc.service`——`ExecStart=/usr/bin/node /srv/fleet/TriMMC/dist/src/index.js`·`WorkingDirectory=/srv/fleet/TriMMC`·`Environment=TRIMC_PORT=8712`·`EnvironmentFile=/srv/fleet/trimodel-data/api-token.env 或同族 fleet 域位`（TRIMC_INTERNAL_TOKEN=值席面持有值注入·D-46 值域·值席/BOD 协调域）·`Restart=always`·`RestartSec=5`；
- **迁移序（零裸停形）**：unit 落装→`systemctl --user daemon-reload`→**停 nohup 现役（pid 验对+owner-kill 正形）→`systemctl --user start trimmc`→healthz 三验**（秒级窗·双径冗余=job2/cron 兜底不变）；
- 回滚锚：unit disable+nohup 复启形（一行族）。

### 窗 B 解冻判据兑现

读数回（b404e6b8e/d3d6893ab 两卷）+本定形毕→**COO 统排**（令文承录）——施工面=值席配合（token 注入值域+dev/BOD 通道面照前令）+CTO 复验位（unit 落装+迁移序+healthz 三验对表）。

## 使用依据

探 B′ 四步读数卷 d3d6893ab（Linger/manager/洁净面/crontab 九条·零 root 纯只读）；TriMMC app.js token 门源读（TRIMC_INTERNAL_TOKEN 请求期读取·运行中注入注）；11-19 双死键日实录（nohup 零自愈反证）；restart discipline 谱系；D-46/D-47。
