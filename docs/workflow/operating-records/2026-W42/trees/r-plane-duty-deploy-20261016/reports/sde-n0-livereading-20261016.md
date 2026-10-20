# SDE 实勘卷 · charter-2026-W42-002 第 0 步三件套（12:00 窗开正式锚）

- tree-id: 0（内存实勘+proxy 复验+AC 锚·charter §二 序0）
- charter: charter-2026-W42-002
- syncMode: static（窗开实勘·D-24 活体现探禁推定·10:47/12:00 前读数均未作施工依据）
- lastSyncedAt: 2026-10-16 12:06:40+08:00（读数拍时刻·Bash date 现查）
- 执行席: SDE 小布（m-sde）；施工位=河源 R-HY

## 三件套读数（12:06:40 拍·并行现勘）

| # | 件 | 读数 | 判 |
| --- | --- | --- | --- |
| 1 | AC 锚（本机宿主电源面） | **PowerOnline=True**·BatteryStatus=2（AC 在线·承 001 第 0 步形态·CEO 接电兑现延续） | ✓ |
| 2 | free -m（河源活体） | total **7270MB**·used 642·available **6628MB**·swap 0——13 席需求 ~4904MB（sg 席均 377MB×13）→ **余量 +1724MB** | ✓ 达标 |
| 3 | proxy 服务态 | systemctl is-active bigmodel-h1-proxy = **active**（001 部署面重启后自启保持·systemd Restart=always 兑现） | ✓ |

## 现态基线（施工前）

- tmux fleet server **不存在**（`/tmp/tmux-0/default` 无 socket）·claude 进程计数 **0**——扩容重启灭态延续（收窗注记 1fe5c095b ③）——**13 席全量首启·零残留零冲突**。
- 前置链五件在盘（机器重启持久面）：proxy active ✓·claude CLI 2.1.296 ✓·duty-env/settings/compass 文件面 001 已对平在案（57cf86b64）。

## 开工判定

**达标→n1 串行开工**（COO 11:04 授权：实勘达标即施工不候二次放行）：

1. 抽验席 r-duty-sde 首启（首启形 `-n`·R 面零历史 session）→pane 活体+env 护栏断言（两变量在/不在·零打印值面）。
2. 抽验过→其余 12 席逐席串行（红线：任意两席启动间隔 30s+·禁并发 2·单席失败即停 capture 不盲重试）。
3. n5 复制并行发起（起树间隙·rsync 断点续传·COO 2h 窗体编排）。

## 使用依据

- COS 12:05 盯哨读数请+COO 改窗令 11:48:33（第 0 步三件套+编排）+charter-002 §二 序0
- 启动命令在案卷 57cf86b64（名册 13 席+首启形模板+护栏段活体正形）
