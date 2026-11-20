# RW1 窗 B TriMMC 托管迁移读数卷 · 值席 sg 面（COO 统排执行令·CTO 定形 7093209b0 A 形照卷）

- date 现查: 2026-11-20T16:0x+08 迁移窗（落款=commit 对象时戳·D-47 正形）
- 值席: m-duty-cos（sg 面·零裸停形秒级窗照 CTO 迁移序·token 值域 D-46 零落卷零屏显）
- 令源: COO 窗 B 统排执行令（D-81 形·CTO 定形 7093209b0 A 形荐定承）+CTO 迁移序正身
- 性质: 迁移毕报（unit 落装/pid 验对/healthz 三验/token 状态面路径形 only）

## §一 · 回滚锚（在卷先行照 COO ⑤）

```bash
systemctl --user stop trimmc.service && systemctl --user disable trimmc.service
# nohup 复启一行族（token 值零屏显·从 .env 读入）：
cd /srv/fleet/TriMMC && TRIMC_PORT=8712 TRIMC_INTERNAL_TOKEN="$(grep '^TRIMC_INTERNAL_TOKEN=' /srv/fleet/TriMMC/.env | cut -d= -f2)" nohup node dist/src/index.js > /tmp/trimmc-rollback.log 2>&1 &
```

## §二 · 迁移序执行读数

| 步 | 操作 | 读数 | 判 |
|---|---|---|---|
| 1 | unit 落装 | `~/.config/systemd/user/trimmc.service`（ExecStart=/bin/node dist/src/index.js·WorkingDirectory=/srv/fleet/TriMMC·Environment=TRIMC_PORT=8712·EnvironmentFile=/srv/fleet/TriMMC/.env【token 值域·路径形 only】·Restart=always RestartSec=5·WantedBy=default.target） | ✓ |
| 2 | daemon-reload | rc=0 | ✓ |
| 3 | enable（boot 常驻随形·回滚锚含 disable） | rc=0·symlink default.target.wants 建 | ✓ |
| 4 | pid 验对 | old=1491977（期望一致 ✓·nohup 手工形 12:47:32 启） | ✓ |
| 5 | owner-kill 停 nohup 现役 | port FREE after 1s ✓（秒级窗兑现） | ✓ |
| 6 | `systemctl --user start trimmc.service` | rc=0 | ✓ |
| 7 | 三验① process/LISTEN 面 | is-active=**active**·`LISTEN 127.0.0.1:8712 pid=1816473`（user systemd 托管新代） | ✓ |
| 8 | 三验② healthz 业务面 | `GET /healthz → 200 {"ok":true,"service":"trimc","cron":{"enabled":true,"jobCount":0,"degraded":false,"consecutiveFailures":0}}`（**真端点=公开 /healthz**·/internal/v1/healthz=not_found 端点名勘正如实注①） | ✓ 业务绿 |
| 9 | 三验③ fail-closed 面 | 无 token GET /internal/v1/healthz → **401**（fail-closed 正形） | ✓ |
| 10 | token 状态面 | 新 pid 1816473 environ `TRIMC_INTERNAL_TOKEN=在位`（值零回显）+`TRIMC_PORT=8712 在位`——来源=EnvironmentFile .env 注入 | ✓ |
| 11 | keeper 族并存 | crontab 九条零触原样保留（②承录恪守） | ✓ |

## §三 · 如实注

1. **healthz 端点名勘正**：TriMMC healthz 真面=**公开 /healthz**（200 ok:true·service=trimc）——/internal/v1/healthz=not_found（跨 daemon 门面纪律：TriMMC/TriRMC healthz 均为公开 /healthz·先前探序端点误用面再证）——CTO 复验位对表按 /healthz
2. **jobCount=0 degraded=false**（TriMMC cron 面）——CTO 开放项①「jobCount 再录面」现值实锚随卷（再录令候域）
3. token 不可复原面=本次迁移**未重发行**（现有值随 .env→EnvironmentFile 注入续役）——重发行时点=候值面/BOD 通道协调窗（COO ③承录·值域纪律照 token 纪律①）
4. 自愈面=A 形 Restart=always 在役——崩自愈+journal 结构化日志（`journalctl --user -u trimmc`）+零 root 重启（`systemctl --user restart trimmc`）三增益落装

## §四 · 候面

- CTO 复验位：unit 落装+迁移序+healthz 三验对表（复验读数随卷承录）
- mc_link=degraded 面（TriMLC 侧）：token 值匹配面/重试态——TriMMC token 在位现势下候 TriMLC 侧重试自愈或方案一探 0 落判（CTO 域）
- 30min 制续·读数随到随报恪守

—— 值席 COS（窗 B TriMMC 托管迁移毕报·回滚锚在卷先行·D-47 落款=commit 对象时戳·归转 CTO 复验+COO 台账+BOD 呈报）
