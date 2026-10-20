# SDE 毕报卷 · 四卡勘修窗序2 8711 重启（mc 投影生效）

- sourceOfTruth: 本卷（trees/lg069-power-gate-20261007/sde-8711-restart-obs4card-20261014.md）
- syncMode: static（毕报留档卷·令源=COO 14:00 窗令预告（CEO 批·窗 21:00-22:45）+FSD 21:18:31 落码毕信号派工）
- lastSyncedAt: 2026-10-14 21:23:00+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；对象=本机 TriRLC 8711；毕报=FSD（a1a77c69）+COO/CTO（29441c56）

## 前置验证段（零写面·四查全绿）

| 查 | 读数 | 判 |
| --- | --- | --- |
| 三卡顶笔 | ee59619（21:04:09 卡① postHeartbeat 失败分类六型）/7aa5799（21:09:59 卡② mc 失败计数投影）/d9a6254（21:15:34 卡③ degraded 告警防抖 2 拍） | ✓ 与 FSD 报值一致 |
| dist build | dist/index.js+dist/server/app.js mtime=Oct 14 21:17（晚于顶笔 21:15:34） | ✓ |
| 新代码值面 | mcProbe 7 hits（dist/server/app.js）·totalFailures 投影 L690/723 | ✓ 独立验 |
| 回滚锚 | dist.bak-obs4card-20261014（FSD 窗前现采@HEAD 2e1e594） | 在位（FSD 面） |

- 窗前预备（14:02 已做）：pid 31240 基线核（listen==pidfile）+healthz 基线=无 mc 段（待投影形态）+任务名双确认。

## 重启链七步全绿（21:19:5x-21:20:4x）

| 步 | 动作 | 读数 |
| --- | --- | --- |
| 1 | Disable TriRLC-Watchdog | State=Disabled ✓ |
| 2 | pid 对表 | listen=31240==pidfile ✓（基线） |
| 3 | POST /shutdown（token=trirlc-daemon.env TRILC_INTERNAL_TOKEN·变量化零回显·D-46） | 200 shutting down ✓ |
| 4 | port FREE | 21:20:10 poll#1 ✓ |
| 5 | schtasks `\TriRLC Daemon` 冷启 | Running ✓ |
| 6 | 三断言 | UP 21:20:28（poll#1）uptime 36876→7→94 滚动 ✓；pid 32576==pidfile·CIM start=21:20:20 ✓；daemon.log boot 后 contract-resolver 活动行旁证 ✓ |
| 7 | Enable TriRLC-Watchdog | Ready ✓ |

## 毕锚（达成）

- **healthz 嵌套 mc 段在位+值面稳定**（首读 21:20:28→65s 防抖终读 21:21:5x 同形）：
  `{"link":"connected","totalFailures":0,"lastFailureAt":null,"lastFailureClass":null,"degradedFailures":0,"alarmSent":false,"notifyFailures":0}`
- 卡② 三字段（totalFailures/lastFailureAt/lastFailureClass）投影全在位；mc_link 顶层双写照旧 connected。
- 停摆实测 ≈18s（FREE 21:20:10→UP 21:20:28）；窗内毕（止损 22:45 富余）。

## 注记

- 卡③ sg notify source_seat='trirlc-conn' 新面孔候 8713 白名单另窗补（FSD 报·403 落 notifyFailures 可观测不阻塞本窗；现读数 notifyFailures=0）。
- COS 知会 D-23 v3 排窗制度改版（21:18 CEO 批）：在途窗不溯废·本窗照旧——如实记。
- 8713 零触碰（本件纯 8711 面）。

## 使用依据

- COO 窗令预告（14:00:03·CEO 批）+FSD 落码毕信号派工（21:18:31·三卡 commit+md5 面+毕锚定义）；COS D-23 v3 知会
- 活体读数：TriRLC 仓 git log/dist grep·8711 healthz/shutdown（token 门零回显）·schtasks/CIM·trirlc daemon.log
- 记忆条：trilc-daemon-restart-discipline（正形链+三断言）/value-face-never-print-path（token 变量化）/trimlc-repair-window-20261011（实操序先例）
