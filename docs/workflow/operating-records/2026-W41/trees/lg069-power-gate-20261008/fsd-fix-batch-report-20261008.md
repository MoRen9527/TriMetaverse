# LG-069 排查卷+修复批施工卷 · FSD

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg069-power-gate-20261008/fsd-fix-batch-report-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T03:55:00+08:00
- 树节点: FSD 排查毕报+修复批毕报（CTO 排查令 03:17+修复批令 03:29+BOD 施工令 03:30）
- 状态: 排查毕（定性=真值分支）+修复批三项施工毕·重启窗探针全闭——候 CTO 裁定与 STE 复验

## 〇、排查三向结论（先勘后修）

### 向① 双机制同时刻采样对照（10 轮背靠背，03:35:44-03:36:10+0800，AC=1 充电态）

| 轮 | P/Invoke | CIM | 差 |
| --- | --- | --- | --- |
| 1-10（恒定） | 41% | 40% | **1pt 稳定恒差**（P/Invoke 偏高） |

- **系统性分叉实测=1pt 恒差，非挂账口径 3pt**；时变=零（10 轮零漂）。
- 修复批后复探跨态加固：充电态 51/50（03:49），min 跨充放电两态恒取 CIM 侧。

### 向② 01:0x CIM 18% 读数合法性复盘 → **定性：真值分支**（决定性证据=daemon 日志）

channel.log 事件序列实锚：

```
[trilc:power] power gate event: gate-soft (percent=29 ac=false)
[trilc:power] power read failure #1..#3: power read timeout
[trilc:power] power gate event: gate-hard (percent=18 ac=false)   ← 决定性
...
[trilc:power] power gate event: gate-recover (percent=15 ac=true)
```

- **闸自触发硬闸成功**：gate-hard 时 P/Invoke 读数=18，与 BOD CIM 独立读 18% **完全一致**——CIM 18%=真值实锚。
- **「未自触发」=时窗竞态**：BOD 人工停工令（01:0x）下发在先，闸 hard 自触发在其后数分钟内（60s tick×防抖 2 采样确认窗）——非不触发，是令到时确认窗未走完。
- 29→18 的 11pt 与实测放电速率（00:42-00:44 窗 ≈1pt/2min）×20 分钟 ≈10-11pt 自洽——CTO「时间差因素为主」前判据成立。
- **闸行为判定=正确响应无 bug**；附带发现：soft→hard 间 read timeout 三连（streak≥3 机制正确工作未误翻 disabled）——单 spawn powershell 链超时敏感，双读改单进程内双采顺带收敛。

### 向③ 防抖强度评估

防抖（连续 2 采样）+滞回带工作正常（gate-recover 15%+AC=1 恢复=CEO「或」语义接电即恢复，设计正确）。跨机制一致性校验（双读差>阈值告警）**未纳入本批**——恒差 1pt 实测下该告警会常驻误报，候裁项如实标注：若未来恒差扩大，再议差值告警阈值。

## 一、修复批三项实现（TriMLC commit `d344017`，3 文件 +250/-39）

1. **①双读保守 min**：`PowerReading` 扩 `percentRaw/percentCim`；snippet 同进程 P/Invoke+CIM 背靠背双采（多电池 `Measure-Object -Minimum` 保守一致）；`parsePowerOutput` 抽纯函数（单测直驱）；`percent=min(raw,cim)`，CIM 单边失败（NA）退 P/Invoke 单读不判读失败；**闸语义三件（30/20 阈值+滞回+恢复条件）零触碰**。
2. **②healthz 双读可见化**：snapshot 扩双读面；healthz power 投影与 `/internal/v1/power` 端点全量六字段。
3. **③notify 可观测面**：`dispatchNotify` 唯一入口 await 化（装配面 `void` fire-and-forget 静默吞病灶消除——BOD 定性实锚）；fetch 5s 超时防拖死 tick；`notifyFailures` 计数入 snapshot/healthz；连续≥3 降级告警一次/失效段（告警走同通道尽力一试，`.then()` 化入链防同步 throw 漏 unhandledRejection——单测 E 族实证抓出）。

## 二、自测读数（全量四项）

- power-gate 单测 23/23 绿（14 旧例零破坏+9 新例：D 族 min 双读 6 例+E 族 notify 2 例+端到端 min 硬闸 1 例——raw 21/cim 19 → hard 实证 min 判定入状态机）。
- tsc 零错（`npm run check`）；build dist 03:46 fresh。
- 全量回归 656/651/5——5 败 **git stash 干净 HEAD 复跑逐名同**（replay-flow / P0 通道一/二端到端 / FADE-ASSESS-005×2 / tui-components 既有）；**基线名单与 LG-069 施工窗记录（auth-gate/roster-gating×2）有漂移，以当下干净 HEAD 复跑为归因基准如实记**；B 族 60ms 等待窗全量负载下 tick 不足 flake 一例实证，加宽 250ms 后消（STE flake 同族，CTO 附注印证）。

## 三、重启窗探针（03:46-03:50+0800，LG-069 施工窗同款配方）

| # | 探针 | 读数 |
| --- | --- | --- |
| 1 | graceful shutdown | POST /shutdown 200，8713 释放断言 |
| 2 | 冷启 | schtasks /run "TriMLC Daemon" → healthz 200 |
| 3 | `/internal/v1/power` | `percent=49, percentRaw=50, percentCim=49`——**min 实弹取低** ✓ |
| 4 | healthz power 投影 | 六字段全量（含 notifyFailures=0）✓ |
| 5 | 60s tick 推进 | lastReadAt 19:47:40Z→19:49:40Z 两拍推进；percent 49→50 充电演进，min 持续取低 ✓ |
| 6 | cron store 完整 | 8/8 job 全 enabled，nextRunAt 值面全非空（含 n2-watchdog-dev）✓ |

## 四、如实边界与候办

1. **配方执行偏差如实**：watchdog disable PATCH 首打 404（路径漏 `/internal/v1` 前缀，disable 从未生效），shutdown→冷启全程 job 仍 enabled——无碰撞系时窗运气非配方保障；8/8 job 复核后无实害，配方路径勘正在卷。
2. **复验锚①临界区对照未达自然态**：现势接电 50%，临界区 20-25 同时刻 N≥5 轮对照候自然放电窗补（min 判定语义已由 D 族单测+端到端 min 硬闸例机读覆盖）。
3. **复验锚②候 S3**：gate-soft 注入告警四面落信候通知通道修复后才能全绿（CTO 已知，通道未修态如实标）。
4. 跨机制差值告警候裁项不扩窗（§向③）。
5. 定性「真值分支」下修复面预缩方向（CTO 终判卷）已按 min 设计正则执行，无闸语义改动。

## 使用依据

- CTO 排查令（03:17 派工正身）+修复批令（03:29 三项）+终判卷 c663b82f；BOD 施工令（03:30）；排查实测 10 轮双采（会话链留痕）；TriMLC commit d344017；channel.log 事件序列（活体实锚）；全量 stash 基线归因记录（会话链）。
