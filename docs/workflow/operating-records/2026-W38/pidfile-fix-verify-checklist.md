# pidfile 修复验收集（TriRLC 09980b8 / TriMLC 450a286）

- sourceOfTruth: 本文件（DE 验收执行清单，候令执行）
- syncMode: static checklist（执行读数回填本文件或部署 log）
- lastSyncedAt: 2026-09-18T02:55+08:00
- 编制: DE 小布（trideployer）；修复来源: CTO 裁修+FSD 落地（TriRLC `09980b8` pidFileFor(port) 分文件+verifyPortPidConsistency 一致性门+legacy 兼容+cli stop 门；TriMLC 同构 merge `450a286` 已推；CTO 终核 3/3 独立跑+全量 644/639/5 红同族历史债零触）
- 窗口评估结论（CTO ③ 授权 DE 评估）: **并入下次部署窗，不专门起停**——现役两 daemon 健康且未载新码，专门重启才有验证意义但不值单独窗口（非紧急修复件+秒级中断风险）；下次任一 daemon 部署新码生效时一并执行本清单

## 前置断言（执行窗开头跑）

- P1 两 daemon 均已载新码：各自仓 HEAD ≥ `09980b8`(TriRLC)/`450a286`(TriMLC) 对应 build，daemon 进程启动时间晚于部署 build 时刻（healthz uptime 小值+部署 log 交叉）
- P2 `~/.trimetaverse/` 出现 `trilc-8711.pid` 与 `trilc-8713.pid` 双文件（新代码重启后自动写）

## 回归案（15492/8480 同型场景）

- **案 A 双 pidfile 并存+各记各的**：读两 pid 文件内容，逐一与 `Get-NetTCPConnection -LocalPort 8711/8713` OwningProcess 对表——必须各自相等（旧缺陷=单文件互踩，本案直接验证修法核心）
- **案 B stop 定点命中**：`trilc stop --port 8713` 输出 pid 必须等于 8713 监听 pid（读 trilc-8713.pid 而非 8711 的）；执行后 8713 down；随后权威路径拉起（TriMLC=token 门 `POST /shutdown` 已不可用（进程已停），用 `trimlc-daemon-channel.cmd`）+ healthz 验活
- **案 C 8711 无感断言**：案 B 全程 8711 healthz 持续 ok 且 uptime 不中断（旧事故中 8711 被 SIGTERM 即中断）——8711 侧连续探活 3 次（间隔 2s）全绿=无感实证
- **案 D legacy 兼容（时间富余才做）**：人为放置旧格式 `trilc.pid`（内容=8711 pid）→ `trilc stop --port 8713` 应因 port 不匹配拒绝误用（或按兼容逻辑验 port 后弃用）→ 8711 仍活；验毕清理测试文件

## 收口

- 执行读数回填本文件「执行记录」节或当次部署 log；异常即停手报告 CTO（CTO ① 裁临时规避规范在修复验证通过前持续有效）
- 注意（CTO ② 副作用注记）: **新代码生效前窗口**两 daemon 无任何 pidfile，此窗口期 stop 正身=TriRLC 走 `Start-ScheduledTask` 生态权威路径 / TriMLC 走 token 门 `POST /shutdown`（09-18 实证），**禁用 CLI stop**（pidfile 缺失 fallback=port lookup+SIGTERM 兜底，错位风险残留）

## 执行记录

（候部署窗回填）
