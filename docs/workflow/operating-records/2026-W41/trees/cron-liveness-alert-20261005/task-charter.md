# 任务书：daemon cron/服务面活体告警（三机覆盖）

- sourceOfTruth: 本件（BOD 派发施工任务书；令源=CEO 2026-10-04 23:52 批令「批了，加活体告警」，承 2026-10-04 晚 W40→W41 迁移异常全链）
- syncMode: static（派发即生效；完工验收后本件收口）
- lastSyncedAt: 2026-10-04 23:5x+08:00（落盘时现查）
- 背景卷：W40 版 runbook §四/§五（executor 停摆全链+机制候选）+发送账 #374/#375（wt/board c11096ed/77568b9f）

## 一、令源与背景（为什么现在做）

CEO 批令加活体告警。直接动因：R-HY `trirmc.service`（8712，cron 正主）2026-10-01 10:46:23 被人工 stop 后无自启、静默 3 天，致 W40→W41 周平面迁移错过 10-04 23:00 窗（BOD 23:26 手动补跑 d0552559 闭合）。**核心盲区实证：服务面 healthz 200 ≠ cron 活**——trirmc-mc（8710）HTTP 活着但 TRIRMC_CRON_ENABLED=false；正主停摆期间无任何告警。

## 二、告警范围（三机，范围细节施工席现勘定稿）

| 机 | 面 | 至少含 |
|---|---|---|
| R-HY（8.155.54.79） | trirmc.service（8712 cron 正主）+trirmc-mc.service（8710 服务面） | 进程活体+unit enabled 态+cron 心跳（jobs.json mtime/各 job lastRun 新鲜度按排程容差） |
| M-SG（47.245.122.61） | 8712 MC face+TriMMC watcher cron 链 | 同上三维度 |
| 本机 | TriMLC 8713（含 F-3 缺陷单在修的 addJob 链） | 同上 |

## 三、告警维度（硬要求，缺一验收打回）

1. **进程活体**：systemd active 态非 active 即告。
2. **cron 面心跳**（本次事故的核心盲区）：按各 job 排程周期×容差系数判「最近执行时戳/-store 写面」新鲜度，超容差即告——**只探端口不算活体告警**（healthz 绿+executor 死=今晚实证形）。
3. **disabled 无自启检测**：unit enabled 态巡检，disabled 即告（人工停+无自启=静默死亡的第二半因）。
4. 告警通道走现有 notify 值席链（R-HY notify 端到端今晚已验通）；**告警文本零敏感值**（token/密钥/路径值面禁入）。

## 四、验收锚

- 三机各演练触发一次**真实告警**到达值班席（含回执证据：notify 日志/消息回执）；
- 心跳维度演练：人为停 executor 类场景（可用测试 job 或低危模拟）触发心跳告警——**禁止**为演练再停生产 cron 正主（今晚刚修活，演练形施工席与 CTO 商定安全形）；
- 连续 24h 静默窗零误报读数；
- 告警规则文档一份（阈值/容差/覆盖清单）随收口。

## 五、边界

1. 不改 cron 本体调度逻辑（只加监控面，TriRMC/TriMMC/TriMLC 源码零改动——除非 CTO 方案裁明必要且另立变更）；
2. 告警不发 CEO 终端直打（走值席链，值席判级后升级）；
3. R-HY 生产数据与冻结面禁区照旧；
4. 排窗/死线 COO 裁（建议明日晚窗，今晚不施工）。

## 六、验收流

COO 需求单+排窗 → CTO 技术方案确认（监控形+演练安全形）→ SDE/FSD 施工 → STE 验证 → BOD 非作者走查+验收 → 呈 CEO 知情。
