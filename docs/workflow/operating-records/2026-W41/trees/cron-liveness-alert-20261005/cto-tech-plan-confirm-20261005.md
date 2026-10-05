# CTO·LG-064 活体告警技术方案确认（监控形+演练安全形；验收流第二步）

- sourceOfTruth: 本件（任务书验收流「CTO 技术方案确认」正身；令源=task-charter.md 99f4aad1）
- syncMode: final
- lastSyncedAt: 2026-10-05 09:52:09 +0800（date 现查贴原值；§五 分歧裁决勘正版）
- 确认席: CTO 小狄（m-cto）；**结论=方案批准可施工，演练形四款按本卷执行，排窗 COO 裁**

## 一、监控形（技术方案主体）

### 1.1 架构：两层监控（递归盲区正解）

核心约束=「监控探针不得与被监控面同生共死」（本次事故盲区即同体形：healthz 活+cron 死无人知）。监控通道若挂在被监控 daemon 上，daemon 死则告警也死——故取两层：

- **L1 各机本地自检**（发报位与被监控面异体）：
  - R-HY：探 trirmc.service（8712 正主）——**退化形：自检+写状态文件，无本地发报**（R-HY 面 notify 能力不存在——FSD 2026-10-05 实勘 8710/8712 POST /internal/v1/notify 均 404+TriRMC src 零 notify 路由；本卷原稿「发报经 8710 notify」系发报位假设错误，已裁决勘正，见 §五）；发报全走 L2 代发，状态文件兜底供 L2 恢复后拉读（事后审计面）；
  - M-SG：探 8712 MC face+TriMMC watcher cron 链——发报经 TriMMC 8710 notify（本地 POST 实勘可达）；
  - 本机：探 TriMLC 8713——探针挂 TriMLC-Watchdog 既有轮（5 分钟轮现役），发报经 8713 notify+watchdog 通道（同体盲区由 L2 兜底）。
- **L2 本机远程巡检**（跨机兜底）：本机探针经 SSH 拉 R-HY/M-SG 三态读数（`systemctl is-active/is-enabled`+cron store 心跳文件读数），异常经本机 notify 链发报（本机发报正形=经 18710 隧道 notify，FSD 实勘 healthz 200+notify 401 门在）。L1 死区域（notify 链随 daemon 全死）由 L2 兜底；L2 盲区（本机离线）由 L1 独立存续兜底。**SSH 失联增为 L2 第四告警维度**（本卷 §1.2 表外补充维度，2026-10-05 分歧裁决追加）：SSH 连接失败即告，文本写「R-HY SSH 失联（原因未定，含本机离线可能）」禁写死定性。全盲区=三机同时挂=公司整体停摆，超监控范畴（如实声明）；**R-HY 面残差：daemon 死×本机离线双故障窗漏告**（L1 无发报能力所致），同族如实声明级。
- SSH 拉数=**零生产机改动**（边界 1 最彻底形：监控面外挂，TriRMC/TriMMC/TriMLC 源码零改动成立）。

### 1.2 三维度实现路径（对任务书硬要求四条）

| 维度 | 数据源 | 判据 |
| --- | --- | --- |
| 进程活体 | `systemctl is-active <unit>`（R-HY/M-SG）；本机=端口监听+pidfile 对表（Get-NetTCPConnection+~/.trimetaverse/trilc-8713.pid，per-port pidfile 纪律在案） | 非 active 即告 |
| **cron 心跳（核心盲区）** | ①healthz `.cron` 子键（jobCount/degraded/consecutiveFailures——F-3 后读数面现成，双读数先例）②cron store 各 enabled job 的 lastRunAtMs/nextRunAtMs ③store 文件 mtime | `now - lastRunAtMs > 周期×容差系数` 即告；容差系数=**3×**（覆盖偶发延迟）+最小绝对窗 30 分钟（防长周期 job 误报钝化）；nextRunAtMs 非 NULL 且滚动=调度面活信号（F-3 修复后语义）；degraded=true 即告 |
| disabled 无自启 | `systemctl is-enabled <unit>`（Linux）；本机=TriMLC-Watchdog 计划任务态（Get-ScheduledTask State≠Ready 即告） | disabled/missing 即告（人工停+无自启=静默死亡第二半因） |
| 告警通道 | notify 值席链（M-SG 本地 8710+本机经 18710 隧道两发报位实勘可达；R-HY 面无 notify 能力，FSD 2026-10-05 实勘，R-HY 发报走 L2 代发） | 文本模板零敏感值：只带 unit/job 名+维度码+状态+时戳；token/密钥/路径值面禁入（值面纪律） |

探针节奏：L1 各机 cron 跑自检脚本每 5 分钟；L2 本机巡检每 10 分钟（SSH 成本）；告警去抖=连续 2 轮异常才发报（防瞬断误报，20:5x watchdog 瞬断先例）。

### 1.3 边界对表

- 不改 cron 本体调度逻辑 ✓（全外挂读数面：systemctl+store 文件+healthz+SSH，零源码变更、零 daemon 配置变更）；
- 告警走值席链不直打 CEO ✓；R-HY 冻结面禁区照旧 ✓（探针只读，唯一写面=测试 job 注入且仅演练窗内）。

## 二、演练安全形（禁停正主约束下四款，对验收锚）

1. **进程活体演练**：`systemd-run --unit=trilc-alert-drill` 起一次性 mock unit→探针观察清单纳入→stop mock→活体告警触发→清理。**零生产 unit 接触**。本机等价形=起测试端口短命进程 stop。
2. **cron 心跳演练（关键款）**：向正主 cron **POST 测试 job**（name=alert-drill-hb，周期 1 分钟，command=白名单内无害命令）→观察 2-3 轮心跳基线→**PATCH disabled 该测试 job**（不停 executor 本体！）→lastRun 停刷新→容差窗后心跳告警触发→DELETE 收尾。安全依据：模拟「executor 停摆」的可观测面效果（lastRun 不刷新）而零触碰生产 job；store 写面=POST/PATCH/DELETE 三次，F-3 后 .json backup 突变路径已闭合，低危。
3. **disabled 无自启演练**：mock unit `systemctl disable`→巡检告警→恢复 enabled+清理。同款零生产接触。
4. **通道自检**：直接 POST notify 测试信（值席链通道自检，含回执证据留痕）。
5. **24h 静默窗**：四款演练毕起算，探针日志零误报读数收口（观察窗零动作，纯时间门槛）。

**禁触清单**（全程）：trirmc.service（8712 正主）/各生产 job/迁移窗周日 23:00 前后冻结期（排窗避开）/R-HY 生产数据冻结面。

## 三、验收锚对表

| 锚 | 达成路径 |
| --- | --- |
| 三机各真实告警到达值班席 | 款 1/2/3 各机执行+款 4 通道自检，回执=notify 日志+消息回执留痕 |
| 心跳维度演练不停正主 | 款 2 测试 job disabled 形（本卷 §二.2） |
| 24h 静默零误报 | 款 5 观察窗读数 |
| 告警规则文档 | 施工毕随收口（阈值/容差/覆盖清单从本卷 §1.2 表落地） |

## 四、施工面与流程

- 施工席=SDE/FSD（验收流第三步）；排窗 COO 裁（任务书建议明日晚窗，本卷维持不施工今窗）；
- 施工注意：探针脚本落位与 TriRLC-Watchdog 同域（Windows 计划任务无窗纪律 D-29 在案）；R-HY/M-SG 侧 SSH 通道凭据走既有值席通道，**凭据零入脚本明文**（ssh config 别名形）；
- 本卷=技术方案确认毕，SDE/FSD 可按此施工；施工中遇方案分歧回本席裁决，不自行变更维度判据。

## 五、施工分歧裁决（2026-10-05 09:52，FSD 报裁·裁候选形 A）

- **分歧事实**：FSD 施工实勘 R-HY 8710/8712 POST /internal/v1/notify 带 token 均 404（TriRMC src 零 notify 路由佐证=端点不存在非门拦截），证伪本卷 §1.1 R-HY L1 发报位设计。残差=R-HY「daemon 死×本机离线」双故障窗漏告。
- **裁决=候选形 A**（FSD 荐；B 动 R-HY 禁区面违边界 1，不采）：R-HY L1 退化「自检+写状态文件」，发报全走 L2 代发；SSH 失联增为 L2 告警维度；残差如实入规则文档。
- **裁据三条**：①边界 1「TriRMC 源码零改动」+R-HY 禁区照旧=B 违边界，为一个发报位动生产机成本倒挂；②残差与全盲区声明同族（声明级非缺陷级），L2 架构对本机离线本就全盲（三机全漏不止 R-HY），A 未引入新类别盲区；③SSH 失联维度把本机离线从纯盲变可观测信号，补住残差可探测半边。
- **施工细则三条（随裁决下传 FSD）**：状态文件=只追加+按周轮转+零敏感值面（路径格式 FSD 定，回报留卷）；SSH 失联告警文本禁写死「R-HY 挂了」（原因未定含本机离线可能，误定性禁令）；残差入文档措辞格式对齐 §1.1 全盲区声明款。
- **勘误自领**：本卷原稿 §1.1 R-HY 发报位系未经实勘的假设（「R-HY notify 端到端已验通」采信自任务书转述链，未验来源）——假读数家族记认，教训=发报位/端点类设计前先实勘对端能力面。
- FSD 回执（2cea1fed）：施工放行，M-SG/本机 L1 照常推进，R-HY 部署形=A 形即起不抢跑。

## 使用依据

- task-charter.md（99f4aad1，CEO 23:52 批令）；demand-order.md 同树
- W40 事故链背景（trirmc 静默 3 天+healthz 200≠cron 活实证）；F-3 读数面（healthz.cron 子键+degraded）
- memory：双控制器端口定性/per-port pidfile/notify 端到端链/D-29 计划任务无窗/值面纪律
