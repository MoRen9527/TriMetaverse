# LG-032 案 a 切指操作手册（TriRLC→TriRMC 值切位）——FD 小全拟稿，BOD 已定窗（执行版）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W36/lg032-cutover-runbook.md
- syncMode: static（runbook 快照；执行时以本件为操作序正身）
- lastSyncedAt: 2026-09-04（BOD 定窗批令转达后升执行版：主窗 09-09 批+错峰保护两条入版）
- **定窗**：主窗=2026-09-09（周二）10:30–11:30 北京时间；备选=09-10（周三）同时段（COS 转达 BOD 批令）
- **窗时要求（错峰保护①）**：窗时 CEO 在线候命（切指窗与 LG-026 P4 窗同为 09-09 后，两窗禁同窗叠加；本窗若与 P4 窗撞期即改期不硬切）
- **中止判据（错峰保护②）**：§二前置门三查主窗开头任一不过=**窗内中止改期**（改备选窗或另行排窗），禁硬切
- 边界：LG-032 方案正身=docs/execution/lg032-three-channels.md；连接变更合法性锚=D-17（CEO 明令第二次确认点后关旧通道）+LG-030（只换值零改 env 名/代码字段）；CHO 复审签收在途并行（签收前本件不执行）

## 一、切指窗时点建议（FD 建议，候 BOD 定）

- **建议主窗：2026-09-09（周二）10:30–11:30 北京时间**；备选 09-10（周三）同时段。
- 理由：①工作日日间三方（本地机/河源/sg）人工在线，异常响应最快；②避开 09-08 周一首窗堆积；③24h 观察期=09-09 上午起 09-10 上午满，距 09-13（周日）23:00 迁移冻结窗裕量充分；④09-13 冻结窗前若观察期有疑可延后关旧，不压哨。
- 免调注记：验证门「心跳 ≥3 周期」采样——TriRLC 默认 healthCheckIntervalMs=10s（app.ts :906），3 周期≈30s 即满读数，**无需临时调短**（方案案 a-2 的调短提示仅默认值更大时适用）。

## 二、切指前置门（窗内第一步，全绿才动值；**任一不过=窗内中止改期，禁硬切**）

```powershell
# P1 河源服务面 probe（token=d2cd071c…，2026-09-04 已抽验 6/6；窗内复跑为准）
ssh 8.155.54.79 'cd /srv/fleet/TriRMC && node scripts/mc-probe.mjs http://127.0.0.1:8710 <TOKEN> | tail -1'
# 期望：ALL PROBES PASSED

# P2 公网入站 8710（云安全组放行实证——CEO 已毕，窗内复验）
curl -s -m 5 http://8.155.54.79:8710/healthz
# 期望：{"ok":true,"service":"trirmc","mcLedger":"ok",...}

# P3 token 同值（本地出站=河源入站）
#   本地：C:\Users\jedih\AppData\Local\trirlc\daemon\trirlc-daemon.cmd TRIMC_INTERNAL_TOKEN 行
#   河源：systemctl show trirmc-mc.service -p Environment（2026-09-04 双侧实证同值 d2cd071c…）
```

## 三、现值留痕（回滚锚，切指前必落）

```powershell
[Environment]::GetEnvironmentVariable('TRIMC_BASE_URL','User')
# 留痕值：http://47.245.122.61:8710（LG-030 查① 同值）
Select-String -Path "C:\Users\jedih\AppData\Local\trirlc\daemon\trirlc-daemon.cmd" -Pattern "TRIMC_BASE_URL"
# 留痕行：set TRIMC_BASE_URL=http://47.245.122.61:8710（daemon cmd 注入位，2026-08-14 行）
curl -s http://127.0.0.1:8711/healthz   # 留痕基线：trimc=connected 对 sg
netstat -ano | findstr ":8711"          # 留痕：ESTABLISHED 47.245.122.61:8710 对端快照
```

## 四、切指动作序（双注入位同步→重启→验证）

```powershell
# S1 daemon cmd 值切位（TRIMC_INTERNAL_TOKEN 行不动——已同值）
#   编辑 C:\Users\jedih\AppData\Local\trirlc\daemon\trirlc-daemon.cmd：
#   set TRIMC_BASE_URL=http://8.155.54.79:8710
# S2 User env 值切位（LG-030 双注入位同步）
[Environment]::SetEnvironmentVariable('TRIMC_BASE_URL','http://8.155.54.79:8710','User')
# S3 TriRLC daemon 重启（权威路径，禁裸杀——pidfile 纪律）
node D:\Code\ai\TriRLC\dist\cli.js stop
schtasks /run /tn "TriRLC Daemon"
# S4 验证三连（切指后 ≤60s 内）
curl -s http://127.0.0.1:8711/healthz        # ① trimc=connected 且 serverTime 现时（非陈旧缓存）
netstat -ano | findstr "8.155.54.79:8710"    # ② ESTABLISHED 对端=河源
ssh 8.155.54.79 'cd /srv/fleet/TriRMC && node -e "const{DatabaseSync}=require(\"node:sqlite\");const db=new DatabaseSync(\"/var/lib/trirmc-mc/mc-store.sqlite\");console.log(JSON.stringify(db.prepare(\"SELECT node_id,state,received_at FROM mc_heartbeats ORDER BY received_at DESC LIMIT 3\").all()))"'
#   ③ 河源心跳台账连续 ≥3 周期接收成功（心跳门判据；回传门/replay 门按方案案 a-2 随窗实测）
```

## 五、回滚预案（一行）

**任何异常（healthz 非 connected/netstat 对端错/河源台账断流）→ S1+S2 值回切 `http://47.245.122.61:8710`（回滚锚=§三留痕）→ S3 重启 → healthz trimc=connected 对 sg 即闭环；回滚不触河源侧（trirmc-mc.service 常驻无状态依赖，双通道并存期 TriRMC 台账多收心跳无害）。**

## 六、观察期与关旧（本手册不覆盖）

- 24h 观察期（degraded 误报巡检：healthz+taskrun.log）→ 三门全过 → 「关旧通道」=第二次 CEO 级确认点（D-17 硬闸），操作序另立。
- 8713 通道/TriMLC 面=案 b 范畴零接触；sg 中央面本窗零改动。
