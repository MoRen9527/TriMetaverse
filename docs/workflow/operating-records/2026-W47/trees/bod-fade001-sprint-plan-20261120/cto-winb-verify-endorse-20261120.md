# CTO 窗 B 复验追认卷（五探独立复验全绿·A 形落装追认·窗 B CLOSED 正身）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·窗 B 复验追认正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 复验对象: 值席迁移毕报卷（d97470dae·11 步全✓）+sg 侧定形裁决卷（d2eff45a3·A 形荐定·7093209b0 承录正身）——COO 统排令（D-81 形）承录链完整
- 复验性质: 本席复验位（定形卷承录请托·验收门禁 owner 职责面）——独立探序非转抄·只读零活体触·fleet 通道零 root（窗 A root 不开裁定一致面）

## §一 · 复验五探读数（独立复验·非毕报转抄）

| # | 探 | 本席独立读数 | 对表判定 |
|---|---|---|---|
| 1 | unit 实文（`cat ~/.config/systemd/user/trimmc.service`） | ExecStart=/bin/node dist/src/index.js·WorkingDirectory=/srv/fleet/TriMMC·Environment=TRIMC_PORT=8712·Environment=TRIMC_HOST=127.0.0.1·EnvironmentFile=/srv/fleet/TriMMC/.env·Restart=always·RestartSec=5·WantedBy=default.target·After=network.target | ✓ 对定形卷设计锚全对齐（Restart 自愈/RestartSec/Install 面逐项一致） |
| 2 | 托管态（is-active+show） | **active**·MainPID=**1816473**·SubState=running·UnitFileState=**enabled**·ActiveEnterTimestamp=**Fri 2026-11-20 15:19:49 CST** | ✓ PID 与毕报承录全等·时戳=迁移窗自洽（毕报 15:20:47 落笔前 1min）·enabled=boot 常驻自启在役实锚 |
| 3 | healthz 业务面（公开 /healthz） | 200 `{"ok":true,"service":"trimc","cron":{"enabled":true,"jobCount":0,"degraded":false,"consecutiveFailures":0}}` | ✓ 与毕报承录逐字一致·业务绿 |
| 4 | fail-closed 面（无 token /internal/v1/healthz） | HTTP **401** | ✓ fail-closed 正形·与毕报承录一致 |
| 5 | node 路径（readlink -f /bin/node） | →**/usr/bin/node**（merge-/usr 同物） | ✓ ExecStart=/bin/node 与定形卷 /usr/bin/node 等价形实锚 |

## §二 · 追认判定

**窗 B 迁移=追认成立·窗 B CLOSED**——毕报三验承录与本席独立复验五探全等（零漂移）·A 形（user systemd unit）落装正身·值席施工零偏差。定形卷三项增益落装确认：①Restart=always 崩自愈（11-19 双死键日零自愈反证面闭合）②journal 结构化日志（`journalctl --user -u trimmc` fleet 可达）③零 root 结构化重启（`systemctl --user restart trimmc`）+enabled boot 常驻（第四增益·毕报 §三4 承录本席复验实锚）。

## §三 · 如实注（勘正采认与位差面）

1. **healthz 端点勘正=采纳入纪律面**：TriMMC/TriRMC healthz 真面=公开 `/healthz`（/internal/v1/healthz=not_found）——跨 daemon 门面纪律勘正照毕报 §三① 承录入本席复验基准（后续探序配方一律按 /healthz）；
2. **EnvironmentFile 落点=repo .env**（/srv/fleet/TriMMC/.env）——定形卷候选形曾注 trimodel-data 位候选·现役实际形态=repo .env 承录（token 值域零回显照 D-46·本席探序零触 .env 值面·environ 在位面以毕报探 10 承录+探④ 401 fail-closed 行为面旁证）——**位差零害益**（值域纪律不系落点位）·token 重发行时点维持候值面/BOD 通道协调窗（毕报 §三③ 承录不变）；
3. **TRIMC_HOST=127.0.0.1 显式绑回环**=落装增量（定形卷未列·值席施工加面）——加固形零害益·追认；
4. TRIMC_PORT=8712 值面探针=healthz 200+LISTEN 面活体（毕报承录）——batch 偏移错位族完工判据=目标变更值面探针照族形已满（非仅 healthz 面）。

## §四 · mc_link 承录与残面观察

1. **mc_link degraded（TriMLC 侧）**：TriMMC token 在位现势（EnvironmentFile 注入续役·未重发行）下——TriMLC 侧候重试自愈或值匹配面落判（值匹配三查照 token 轮换三折族形）——落判窗=本席域候排（与残面清单同族·非阻塞）；
2. **TriMMC cron 0 jobs 观察面维持**（复验探③ jobCount=0 实锚旁证）——定谳卷残面件②承录不变·候勘窗如实注；
3. 30min 制续窗：窗 B CLOSED 后 RW1 统排余面（窗 C A1/残面清单）候 COO 台账随线。

## §五 · 使用依据

值席迁移毕报卷（d97470dae·§二 11 步读数+§三如实注）+sg 侧定形裁决卷（d2eff45a3·A 形三锚+落装设计锚+迁移序正身·7093209b0 承录）+本席窗 B 评估卷（8d0d6b48d·两候选+探 B′ 配方正身）+COO 统排令承录（毕报卷令源承录·D-81 形）+本席独立 ssh fleet 通道五探读数（本卷 §一·07:4x Z 窗现探）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T07:44:49Z（+8=2026-11-20 15:44:49·date 现查原值·D-47 正形）
