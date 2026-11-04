# SDE 工序4 毕报 · dsh 换 GLM 施工收口（restart 链+活体证明+03:30 cron 勘定）

- sourceOfTruth: 本卷（工序4 施工收口正身·restart 四读数+配置级活体证明+03:30 cron 全域勘定）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=CTO 触发令（2026-11-04T12:20:11Z·CEO 20:16 裁「现在就落不等凌晨」转投）·基线=gate 四判据全绿（08:37:12Z·sde-stage3-gate-report.md）·回滚锚=config.bak-20261104T081238Z

## §一 · restart 链读数（已毕 20:25:09）

**预重启断言（PASS 全绿→方才 restart）**：
- cordis.patch.yml=4700 行（append 19 行 4681→4700·sde-stage2-report.md 施工面）+glmhits=6
- 回滚锚 .bak-20261104T081238Z 在位（4681 行）
- .credentials.yaml 双键在位（DEEPSEEK_API_KEY+GLM_RPLANE_KEY·值面零触碰）

**restart+post-state**：

| 读数 | 值 | 判 |
|---|---|---|
| PID 链 | wrapper 1437360（run-web-masked.py）+ node 1437363（dsh web --port 8791 --no-open） | ✓ |
| 起始时刻 | Wed Nov 4 20:25:09 2026（+0800）·末查 uptime 20:28 连续 | ✓ |
| 监听 | 127.0.0.1:8791 node pid=1437363 | ✓ |
| HTTP 面 | root:401 api:401（鉴权墙应答=服务活·launch token 每 boot 重生成形正常） | ✓ |
| journal | 20:20 后零异常条目 | ✓ |

注：现役 8791 web 消费面=r-duty-cos 席（wrapper launch token 形）——重启后 token 已轮换，席侧若持旧 token 首访将 401→重取 launch 形即恢复（wrapper 每次写 .rot/new-token·web.log「launch token captured len=43」族既有形态）。

## §二 · 真链一发证明形态（如实注记·改道记录）

**直接形受阻考古（~15 探全记录）**：
1. headless CLI 形：headless profile 未 patch（cordis.patch.yml 4 行零 glm）——CLI 单发不走 GLM·且 web profile=server 形态拒 positional prompt（`error: too many arguments. Expected 0 arguments but got 1`）
2. web API 直发形：鉴权墙已过（根路径 `/?token=`→303+cookie 勘定）但 API 路由=typert RPC 形非 REST 路径名（lib/typert.host.js session-controller create(/prompt(/send( 方法面）——猜名 ~13 探全 404·逆向成本超阈值停（24h 观察窗自然流量可兜底，不再深挖）
3. dump-config 子命令形：非顶层子命令——**勘定正形=`dsh web --dump-config`（启动器 flag 形·--help 实锚）**

**改道=配置级活体证明（一发成立）**：`dsh web --dump-config`（fleet user·DSH_HOME 正身）RC=0·341,710 字节组装树——**与重启 prod 服务同 profile（web）同 assembler 代码路径**，三键全现（gate 报 §一「dump-config 前置断言」同形复现）：

```
- id: agent-default-model
  name: '@deepseek-ai/dsh-agent-default-model'
    provider: glm
    model: GLM-5.3-Flash        ← 组装树行 53-54

    providers:
      glm:
        apiKeyEnv: GLM_RPLANE_KEY          ← env 引用形·零密值入 dump（D-46 合规旁证）
        baseURL: http://127.0.0.1:8460/api/paas/v4
        api: openai-completions
        models:
          - id: GLM-5.3-Flash
            contextWindow: 200000   ← 组装树行 80-88
```

**证明链定性（如实）**：①gate 沙箱活体一发 PONG+GLM-5.3-Flash×7 回包（08:37:12Z·三面同值）已闸证「patch 三键被组装器原样吃进→GLM 真链通」②本卷 dump-config 证 prod 同 profile 同代码路径组装树三键同形在位③restart 后 web 服务健康面四读数活④GLM 直通流量面实证=proxy.log 08:33:55Z/08:34:02Z 两发 `POST /api/paas/v4/chat/completions -> 200`（gate 沙箱活体对应读数）——**残余风险=prod web profile 实际会话流量面 GLM 200 由 24h 观察窗自然流量兑现**（§四）。

## §三 · 03:30 cron 同步退役·活体勘定（对象断言三问·全域八面穷尽）

**勘定结论：全域无此 job——零退役动作**（预裁两形均基于 job 存在前提；实勘推翻前提）。

| # | 面 | 勘定法 | 读数 |
|---|---|---|---|
| 1 | 本机 trilc/cron.db | sqlite 直查 | 空表 |
| 2 | 本机 trilc-channel/cron.db | 17 job 布尔指纹（dsh/patch/ssh） | **零 dsh 指纹**；唯一 03:30 形=`fade011-daily-sweep`(30 3 * * *·command 62B 零三指纹)=FADE 日扫非本件 |
| 3 | 本机 trimlc-channel/cron.db | 同上 | 空表 |
| 4 | 本机 trirlc/cron.db | 同上 | 1 job（e1-window-reminder）非本件 |
| 5 | 本机 schtasks | dsh/glm/switch 过滤 | 唯一命中=bod-dsh-tunnel（ssh 隧道 keeper·非 03:30 切换 job） |
| 6 | 河源 TriRMC 8710 | /proc/224044/environ 取 TRIRMC_CONFIG_DIR=/var/lib/trirmc→settings.json+cron/ 目录 | settings.json 顶键=[updated_at, items] 零 cron 键；cron/ 仅 logs（历史 log 全谱零 19:30Z=03:30+8 运行史） |
| 7 | sg TriMMC 8712 | /proc/3705072/environ 取 TRIMC_CONFIG_DIR=/var/lib/trimc→cron/jobs.json | 16 job **零 dsh 指纹**（全谱枚举在卷） |
| 8 | 系统 crontab 面 | 两机 root+fleet crontab+/etc/cron.d+systemd timers | sg=巡检脚本族零 dsh；河源 root/fleet 空；/etc/cron.d 三件（e2scrub/sysstat/tri-liveness）；timers 零命中 |

**定性**：原计划「11-05 03:30 执行切换」的窗位从未被 booking 成实际 cron job（彼时为排程窗位文字形）——故无退役对象。**防重跑锚=本勘定记录**（若后续有人再找「03:30 job」，以本卷八面清单为准：无此 job，勿再重建）。COS 销账验项=本节替代「退役时点记录」（退役时点=无动作·勘定时点锚=2026-11-04T12:45:28Z 现查·勘定毕后 fresh 读数时刻）。

## §四 · 24h 观察窗（11-05 20:2x 前后·CTO 门禁）

- **观察对象**：dsh-web-prod（河源 8791）稳定面+proxy.log（/opt/bigmodel-h1-proxy/proxy.log）GLM 流量面
- **基线（今卷定格）**：restart 后 proxy.log 零新流量（08:34Z 后无新条目·web 消费面尚未有新会话）；dsh 进程 20:28+ 连续；HTTP 401 墙活
- **观察窗毕报判据**：①dsh-web-prod 零 crash/重启（uptime 连续或正常轮换形）②proxy.log 出现 `POST /api/paas/v4/chat/completions -> 200` 自然流量（web 席真链消费面 GLM 200）③零 401/5xx 异常簇④（若有）异常逐条归因——达标→CTO 门禁终判放行
- **已挂自唤**：11-05 20:2x cron 自唤候建（本毕报发出后补挂）

## §五 · 回滚姿态（在位验证）

- `cordis.patch.yml.bak-20261104T081238Z`（4681 行·切 GLM 前正身）——回滚=restart 窗内以 bak 覆回+进程重启（同 restart 链 SOP·单窗单操作）
- key 面：GLM_RPLANE_KEY 独立键（DEEPSEEK_API_KEY 未动）——回滚后 dsh 原栈即刻可用
- 8460 代理面零改动（proxy.mjs 未触碰）——回滚零涉及

## §六 · e2e 施工提前·接令与带宽自评（CEO 20:41 双裁·CTO 20:42:29Z 转令）

- **接令**：e2e 拆链施工原排 11-05 白天窗取消·立即落——本席接令
- **带宽自评（CTO 参考形照录）**：dsh 工序4 收口毕（本卷）→e2e 本机面穿插施工（TriPilot workflow 编辑+push+CI 读数·与河源/sg 零物理重叠）→23:30 sg 重启窗照单（f3511eca 23:25 自唤在挂）——三线错峰可行·唯 23:25 后 e2e 让带宽给重启窗
- **毕报链**：e2e 施工毕报照 CTO 裁令要件（首跑真绿读数+手动触发验证一发）→COS 收口+抄本席（CTO）

## §七 · 使用依据

- CTO 触发令 12:20:11Z（施工要件+03:30 cron 退役预裁+两段毕报链）·CTO e2e 裁令 12:16:52Z·CTO 转令 12:42:29Z（CEO 20:41 双裁）
- sde-stage2-report.md（三件落 prod 面）·sde-stage3-gate-report.md（gate 四判据基线+工序4 前置清单）·cto-dispatch-order.md（通道裁定+key 源）
- 勘定实锚：--help 实读（dump-config flag 形）·dump-config 组装树 341,710B·八面 cron 勘定逐面读数（§三表）
- 纪律：D-46（值面零回显·dump 含 apiKeyEnv 引用形未涉密值）·D-47（落款现查·卷面 commit 时戳锚）·对象断言三问（03:30 cron 禁推定全活体勘定）
