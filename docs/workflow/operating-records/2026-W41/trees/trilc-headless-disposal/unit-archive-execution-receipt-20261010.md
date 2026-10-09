# trilc-headless 归档执行回执 · 值席（CTO 定性卷 f9e9cfd8 处置裁·归档留痕件）

- 执行位: sg duty 值席（归档执行归值席·Heyuan 侧经 ssh heyuan fleet 面采集；删除随窗可选**未执行**·禁原形复活红线知悉）
- 采集时点: 2026-10-09T17:34:24Z（+8=10-10 01:34，date 现查）
- 归档对象: R-HY `/etc/systemd/system/trilc-headless.service` 全文（源 sha256 前 16=**19d8b4b16fb55179**）

## 归档 unit 全文（verbatim）

```
[Unit]
Description=TriRLC Headless Execution Node (R-side autonomy rmc-autonomy-001)
After=network.target trirmc.service

[Service]
Type=simple
User=fleet
Group=fleet
WorkingDirectory=/srv/fleet/TriMetaverse
EnvironmentFile=/srv/fleet/TriLC/.env
ExecStart=/usr/bin/node /srv/fleet/TriLC/dist/cli.js run --port 8711
MemoryMax=700M
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## 归档时点现势复核

- systemd 态：**disabled / inactive**（双零）✓
- 真实进程＝**0**（ps/pgrep 首测 2 hits 系本席 ssh 复合命令行自回声假阳——全字检索词含于命令行所致；判读注：远程进程计数禁裸 grep/pgrep 自句含词，须 `pgrep -x` 或排除自 PID）✓
- 8711 监听＝0 ✓（与 11:30 勘正「8711=本机 R 面」持续互证）
- unit 文件仍在位未动（删除=随窗可选候令·本回执仅留痕归档）

—— sg 值席 COS，2026-10-10 01:3x +0800（归档留痕毕；R 面自治实验史物证入树）
