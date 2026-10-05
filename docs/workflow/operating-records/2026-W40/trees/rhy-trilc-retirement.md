# R-HY TriLC（trilc-headless.service）退役卷

- sourceOfTruth: 本件（CEO 2026-10-01 10:41 令：河源 TriLC 退役，TriRLC 只留本机；BOD 执行）
- syncMode: final
- lastSyncedAt: 2026-10-01 10:4x +0800（date 现查）
- 执行依据: CEO 现意图「TriRLC 只留本机」裁（2026-10-01 10:41）>08-26 部署记忆（「两套永续系统 R 面生产拓扑」段随本裁失效，本卷即修正留痕）

## 退役对象活体档案（停役前）

- unit: `trilc-headless.service`（描述「TriRLC Headless Execution Node (R-side autonomy rmc-autonomy-001)」）
- 进程: `/usr/bin/node /srv/fleet/TriLC/dist/cli.js run --port 8711`（pid 907707，fleet，09-13 06:40 启动，uptime 18 天）
- 服务名: `trilc`（healthz `"service":"trilc","version":"1.0.0"`——**旧名未随 08-31 TriLC→TriRLC 改名更新**，路径同旧名）
- 端口: 127.0.0.1:8711 loopback
- 状态: 空转（heartbeat agentCount:1=rmc-autonomy-001 挂 node 进程内无独立进程；activeTasks:0；cron jobCount:0）
- 治理记忆出处: 2026-08-26 周平面迁移主责切河源段同步部署（「两套永续系统的 R 面生产拓扑成形」）；09-13 正名裁定日重启过

## 退役工序实录（2026-10-01 10:4x）

1. **退役前存档**: `systemctl is-enabled` 原值=**enabled**；unit 文件脱敏存档 18 行→河源 `/root/trilc-headless-retire-archive-20261001.unit`
2. **停服务**: `systemctl stop trilc-headless` 完成
3. **禁自启**: `systemctl disable` 完成（摘除 multi-user.target.wants 链接）
4. **四重验证**: is-active=inactive✓ / is-enabled=disabled✓ / 8711 零监听✓ / TriLC 进程零残留✓（healthz HTTP_000=停役预期态）
5. **agent 归属清**: rmc-autonomy-001 挂 TriLC node 进程内（无独立进程/tmux），停服即随宿主清——无独立处置项
6. **零误伤复探**: 8710 trirmc healthz HTTP 200+unit active——河源主 daemon 无损✓

## 回滚锚（全程可逆）

- unit 文件本体未删（`/etc/systemd/system/...trilc-headless.service` 在位）；复役=`systemctl enable trilc-headless && systemctl start trilc-headless`
- 存档卷: 河源 `/root/trilc-headless-retire-archive-20261001.unit`（脱敏面）
- 若复役：服务名旧名 trilc 照旧（复役不涉改名；改名属独立更新项候令）

## 连带修正

- 记忆条 `weekly-plane-shift-executor.md` 08-26 段「河源另驻 TriRLC headless 实例（rmc-autonomy-001）」→ 随本裁补退役注记（BOD 已勘正）
- 端口全景表：河源 8711 释放（R-HY 现役对外面=8710 trirmc 唯一）；本机 TriRLC 8711 不动（CEO 令明示）

## 边界留痕

- 本件只动河源 TriLC 面；trirmc（8710）/TriRLC 本机（8711 dev）/sg 全域零触碰
- cron 面：河源 TriLC jobCount 本为 0，无 job 迁移面
