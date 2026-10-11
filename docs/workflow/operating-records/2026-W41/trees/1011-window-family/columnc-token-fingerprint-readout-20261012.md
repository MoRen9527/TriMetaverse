# 栏 C 勘读回卷 · R-HY TriRMC token 指纹（三路掩形·零值出机）

- 执行位: sg duty 值席；指令单=cto-columnc-rhy-token-probe-order-20261011.md；通道=ssh heyuan（fleet 同 uid 读·`sudo -n true` 探被拒即 SUDO 空走非特权——零硬闯恪守）
- 采集时点: 2026-10-12T02:1xZ（10:1x+08）；红线=零写面/值面零回显/不硬闯全程恪守

## 回读格式（每路一行）

```
路1-face: listener pid=2306757 cmdline="node dist/src/index.js" (WorkingDirectory=/srv/fleet/TriRMC) —— 端口现势=8710(0.0.0.0)；8712=零监听
路2-env: key=TRIRMC_INTERNAL_TOKEN len=64 tail4=78a1 sha8=38731fd9
路2-env: key=TRIMODEL_API_TOKEN len=64 tail4=cee7 sha8=66cddc2a
路2-env: key=TRIMODEL_ADMIN_TOKEN len=64 tail4=a775 sha8=23d0b7aa
路3-unit: key=TRIRMC_INTERNAL_TOKEN len/tail4/sha8 同路2（unit Environment= 直行·掩形 <set>）
路3-config: /srv/fleet/trimodel-data/api-token.env（600·mtime 09-27 19:58）——TRIMODEL_API_TOKEN 与 TRIMODEL_ADMIN_TOKEN 双键三键同路2 进程 env（同源互证）；TRIRMC_INTERNAL_TOKEN 不在 env 文件
```

## 执行位注记（不裁事项如实报）

1. **端口现势勘正**：单面「R-HY TriRMC 8712」系 LG-066 前旧指——现势 trirmc=**8710**（trirmc-mc 已退役：R-4 族后 unit 移 .bak-lg066·stop+disable）。红线 4 逐字断言照报：目标 daemon=**trirmc**（TriRMC 本体）唯一在役，无多 daemon 并存面。
2. **vs 对表基准**：本机指纹 len=64·tail4=e075·sha8=d50a0760 vs R-HY TRIRMC_INTERNAL_TOKEN len=64·tail4=78a1·sha8=38731fd9——**三键全异**（判定矩阵③向＝各机独立 token 系/分发漂移族——**裁决归 CTO，执行位不裁**）。
3. 401 断点素材补一笔：R-HY 8710 现役门=token 已配门活（S2 现勘在卷：neg 401 fail-closed）——断点在「对端持有值≠本机值」的比对面，非门未配。
4. 值面零回显全程（掩形管道·len/tail4/sha8 三键形）；零写面（只读探针·零 PATCH 零 restart 零文件写）。

—— sg 值席 COS，2026-10-12 10:1x +0800（勘读毕回卷；读数回 m-cto 面对表·COO 刻随发）
