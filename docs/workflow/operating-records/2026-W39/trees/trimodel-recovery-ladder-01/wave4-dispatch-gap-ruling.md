# 裁决记录·波④ 备臂勘验 cron 链钉位缺口（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件（波④ 前置核验缺口裁决正身；D-15 枢纽留痕件）
- syncMode: final
- lastSyncedAt: 2026-09-26 07:5x +0800（date 现查 07:52 hook 链）
- 发现席: STE 小柯（备臂勘验前置核验 2/3 绿+1 红线缺口，停手正确未落真 flag）

## 缺口实勘（STE 读数）

F2-F4 演练链的沙箱钉位在 cron 路径**全程缺失**：

1. CronJob schema 无 env 字段（cron 侧无法钉位）；
2. TriMLC daemon 启动 cmd 无 TRIMODEL_CLAUDE_SETTINGS/DEPLOY_KEY 等任何写入目标键；
3. L2 stub 本体不设钉位（桩时代 fail-closed 不写真活体故无暴露；换真后链路语义改变）；
4. **真 legacy 钥在位**（`~/.claude/settings.presets/.deploy-key`）。

风险形态：现态落真 flag → 2min 内 cron 拾取 → 无钉位 restore-direct → 读真钥+写真活体 settings.json = 红线违反。性质=波③ 桩换真时的盲区（桩时代安全假设未随链路真化重估）——STE 前置核验步拦截止损，前置核验流程价值实证。

## 枢纽裁决（CTO，2026-09-26 07:5x）

1. **方案 A 裁可**（FSD 案：daemon 启动 cmd 演练窗钉位四行+stop/start 纪律重启，TriMLC-Watchdog 复活路径同 cmd 完整性已实勘）；方案 B（stub 演练假链路）否——波④ 价值在真链路演练，桩换真=波③ 交付物，演练它正是题旨。
2. **窗管理四条款（随裁生效）**：
   - 窗计时：进/出窗时点随报，窗长上限 2 小时；
   - **出窗还原义务（比进窗重）**：臂毕必去钉位重启回正身态+出窗三读数（healthz/cron 拾取态/钉位键零残留）——钉位态留现役 daemon=日后真降级恢复永久写沙箱=恢复梯盲化；
   - 进窗知会随报；CEO 测试窗前必须已出窗；
   - 窗内真降级如实记读数（意外实弹样本）。
3. **钉位清单五项核验**（FSD 落位时对 CoreIO 实勘定键名）：TRIMODEL_PORT／ADMIN_TOKEN／CLAUDE_SETTINGS／AUDIT_LOG＋**DEPLOY_KEY 路径键**（restore-direct 独立钥源序读钥，缺此项=臂内读真钥材料）。
4. **F1 先行开臂裁可**：F1 走 TriModel-Watchdog 独立链（kill→复活），零 flag 零 restore，不依赖钉位；resurrection 链先读 launch.vbs 正身再动手。
5. 前置① src 未提交催办照办（工程纪律：先写后报+commit 留痕）。
6. 波③ 换真盲区定性：不作返工项（钉位属演练环境管理非 core 缺陷——core 缺省解析真活体路径=生产正确行为）；**候办一条入台账**：正式恢复梯启用前，daemon 生产环境的 restore 写目标语义复核（现役无钉位=生产态 restore-direct 写真活体=设计行为，但该行为须在 CEO 测试窗/启用裁决时显式知情，不得默认静默生效）。

## 使用依据

STE 备臂勘验报（2026-09-26 07:4x）；dispatch-wave4.md（7f1c62ed）；fsd-wave3-delivery-report.md §八（波③ 签认）；joint-plan.md 问4（24ba1ccc）；trilc-daemon-restart 纪律（stop 前验 pid==pidfile pid）。
