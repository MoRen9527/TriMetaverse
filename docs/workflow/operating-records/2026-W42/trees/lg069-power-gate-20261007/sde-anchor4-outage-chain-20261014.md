# SDE 毕报卷 · 序6 锚④停摆链活体真验（8713 停摆→8711 从闸转态→冷启回归）

- sourceOfTruth: 本卷（trees/lg069-power-gate-20261007/sde-anchor4-outage-chain-20261014.md）
- syncMode: static（毕报留档卷·令源=COO 08:43:26 锚④正式令+FSD 件A/件B 毕条件满足）
- lastSyncedAt: 2026-10-14 08:50:00+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；毕报=COO（8d0d392f）+CTO（随信）

## 全链四段读数（2026-10-14 08:44-08:50）

| 段 | 时点 | 读数 |
| --- | --- | --- |
| ①停摆 | 08:44-08:44:36 | watchdog Disabled→/shutdown 200→8713 port FREE（poll#1）·按令保持停摆不冷启 |
| ②观测 | 08:45-08:48 | 8711 daemon.log 转态三连（见下）·与 COO 侧 healthz poll 读数对平（08:45:12 holding/failures=1→08:46:57 unknown/×3·lastGateSeen 清 null） |
| ③冷启 | 08:47:41 信号→08:49:04 | Start-ScheduledTask Running→8713 UP poll#1·uptime=8 重置·pid 3016==pidfile ✓·power.lastReadAt=00:48:58.004Z 首读·cron 13 degraded=false |
| ④收尾 | 08:49:1x | watchdog Enabled Ready·8711 follower 快照 unknown/failures=5（停摆尾拍·回归候下一拍 COO 终验） |

## 观测段核心实证（8711 本地日志 `%LOCALAPPDATA%\trirlc\daemon\daemon.log`）

```
[trilc:follow] state following/none → holding/none        （08:45:1x 首拍失败·持闸不盲动）
[trilc:follow] URGENT follower-primary-unreachable (3 consecutive poll failures)   （告警段一次 ✓）
[trilc:follow] state holding/none → unknown               （×3 转态）
```

- healthz follower 段同步可见化：state=unknown·lastGateSeen=null（清空）·pollFailures 滚动 1→4——方案稿 §2.4「告警=本地日志+healthz 可见化」双面实证、§2.3 全路径（following→holding→URGENT→unknown）活体真验毕。

## 边界与预期形

- 停摆全程 08:44:36→08:49:04≈4.5min（令预算 ~3.5-4min+冷启 32s 实测 22s poll#1 即 UP）；cron 13 job 停摆窗内到期延迟触发属预期如实记。
- 8711 全程零触碰（纯观测面·read-only log tail+healthz poll）；8713 全链四次 HTTP 皆 token 门内（零回显）。

## 使用依据

- COO 锚④正式令（08:43:26·锚⑤三件全毕条件）+冷启信号（08:47:41）；方案稿 §2.3/§2.4（coo-window-plan-20261014.md）
- 活体读数：8713 healthz/shutdown（token 门）·8711 healthz follower 段·8711 daemon.log tail
- 记忆条：trimlc-repair-window-20261011（实操序）/liveness-first-diagnostics（活体现探禁推定）
