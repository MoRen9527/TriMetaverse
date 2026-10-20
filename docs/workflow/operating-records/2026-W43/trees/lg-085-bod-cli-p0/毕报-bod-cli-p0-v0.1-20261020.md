# LG-085 P0 步 2 毕报 · bod-cli v0.1 骨架+四域聚合（FSD·charter LG-085）

- 拾取：CTO 施工单 2026-10-20 21:38:42+08（三裁决 A/B/观察项）+步 1 勘验回报 21:37 回执链；date 现查 2026-10-20T14:07:57Z / 22:07:57+0800 落款（D-47）
- 运行位：sg `/srv/fleet/bod-cli/bod-cli.mjs`（node v18.20.8·零框架零依赖·md5 `3ecdfe8175af`·v0.1）
- 本地暂存锚：TriMetaverse `.fade/tmp/bod-cli/bod-cli.mjs`（scp 传输零行尾变换）

## 一、交付面（施工单四项对表）

| # | 施工单项 | 态 | 读数 |
|---|---|---|---|
| 1 | 骨架 node 零框架 | ✅毕 | 单文件 ESM ~150 行·纯内建（fetch/fs）·`aggregate`+`json` 双子命令 |
| 2 | 聚合视图 v0 四域一屏 | ✅毕 | 2 直读+2 观察者面·每域源形标注（direct/observer-file/observer-chain）·降级带归因·禁四绿假象照办 |
| 3 | hub-watch 快照扩展 | ✅对平验证毕 | CLI vs `/srv/fleet/var/hub-watch/latest.json`（13:58 拍）healthz 段逐字段同值（jobs=14/degraded=false/fails=0）·稳态双跑一致 |
| 4 | watchlist 读数扩展 | 🔶候裁 | watchlist.json=COS patrol 收口域文件·零写面硬约束冲突——v0 不动文件，扩展建议形=patrol 脚本消费 `bod-cli json` 输出（对接点已备），候 CTO/COS 定 |

- **零写面硬约束**：CLI 纯 GET healthz+state 文件读·零 POST 零文件写（代码面可审）。
- **零 token 经手**（裁决 A）：四域读出面皆无门（sg 8712/河源 8710 healthz 直读 200 无凭据）·token 落盘推迟 P1 照裁决。

## 二、四域读数（终验 2026-10-20 22:05:45+08 原样）

```
[OK] trimc-sg8712      direct   service=trimc jobs=14 enabled=true degraded=false fails=0
[OK] trirmc-heyuan8710 direct   service=trirmc jobs=3 enabled=true degraded=false fails=0
[OK] trmlc-dev8713     observer-file  alerting=true gap=357min（变化沿面）⚠假超时语义注（见三.1）
[OK] trirlc-dev8711    observer-chain mcLedger=ok（8711→8710 链旁证·TriRMC sqlite 合账活）
```

- 河源 8710 目标=`8.155.54.79:8710`（sg 侧 18791 隧道对端 ss 实锚·healthz 200 0.397s）。

## 三、勘验发现三件（步 2 对平门禁副产物·候 CTO 域）

### 3.1 e1-b2 观察者假警实锤（E1-4 域·高）

- **现象**：观察者 state（`/home/fleet/.trilc/e1-b2-heartbeat-watch-state.json`）`alerting=true gap=357min`，而 dev 8713 活体三探全绿（healthz 200 0.006s+pid 19444 活+监听在）。
- **根因链**（源码级）：
  1. TriMMC 8712 mirror 端日志行=`[trimc:mirror]` **纯变化沿**（`mirror/store.ts` L58 recovered 沿+超时沿才打行）——心跳稳定健康期零行；
  2. e1-b2 观察者（`scripts/ops-local/e1-b2-heartbeat-watch.mjs`·cron job `e1-b2-8713-heartbeat-watch`·15min 拍·runCount 362）以该行流当「心跳到达」面（offset 游标增量读·有行即刷 lastActivityEpoch）；
  3. → **稳定健康=变化沿静默=lastActivityEpoch 冻结=gap 虚增**→超 60min 阈即 fire 假警（现挂态即 16:09 recovered 沿后稳定健康期被误挂 alerting=true）。
- **8713 心跳健康证据链**：channel 侧日志 `heartbeat failed`=**0 条**（TriRLC 码 postHeartbeat 成功静默+失败必落 `[trilc:conn] <ISO> heartbeat failed: <分类>`·TRIMC_BASE_URL=`127.0.0.1:18710` 隧道形配置对）。
- **建议**（候 CTO E1-4 主勘）：观察量改真值面——候选 a) TriMMC mirror 端加周期心跳日志行（改 daemon 面）b) 8712 内存 nodeHeartbeats 加 GET 读出端点（毕报-sg-e14-e15 曾候知·内建面）c) 观察者改读 8713 侧发送端失败计数面。CLI 侧已加假超时语义注对冲（读数照显不定罪）。

### 3.2 D-46 值面回显事故报备（本席过失·同族第 7 例教训复犯）

- **事实**：勘 8713 keeper 链时 `cat` `%LOCALAPPDATA%\trimlc-daemon-channel.cmd` 未做 TOKEN 滤前置——**TRIMC_INTERNAL_TOKEN 与 TRIMODEL_API_TOKEN 两值面进入会话 transcript**（FSD 席会话记录内）。
- **违反**：D-46「含密值面禁进打印路径·读含密文件第一动作查在案记录」——keeper cmd/启动壳类文件应 sed 掩码前置，未执行。
- **暴露面评估**：transcript=FSD 席本地会话记录（非仓非树零落盘）·sg 侧值未动未改。
- **处置提请**：TRIMC_INTERNAL_TOKEN 恰是 **A3 归一窗（明晚）token 轮换项**（8712+8713 双侧同换）——**轮换紧迫度提级候裁**：a) 照原窗明晚轮换（暴露面限本席 transcript·风险低）b) 提前独立窗轮换。TRIMODEL_API_TOKEN 轮换=另件候裁（TriModel 面）。教训已刻录：启动壳/keeper/unit 类文件一律掩码前置。

### 3.3 18710 keeper 归属收口（CTO 观察项·v0.1 remote-forward 前置）

- **定谳**：dev:18710→sg:8712 隧道 keeper=`%LOCALAPPDATA%\sg-trimc-tunnel\`（tunnel-keeper.vbs→tunnel-keeper.ps1+tunnel.log）+**HKCU Run 注册表自启**（键名 `sg-trimc-tunnel`）——**非 schtasks 形**（故 schtasks grep 全零）。双证实锚（目录文件+注册表键名）。
- v0.1 remote-forward 通路增量如需 keeper 化，同形（HKCU Run/vbs-ps1）可复用，前置已清。

## 四、A3 归一窗材料预勘（今晚顺手项·照 CTO 附议）

- 8712 启动机制勘定：**TriMMC 8712 非 docker 本体**（docker 只 trimc-postgres 配套 DB）——daemon 面启动源=？与 8713 侧独立；sg 侧 TriMMC 进程启动机制候明晚窗内 0.1 断言时一并实勘（进程树/pgrep cwd 已是施工单 0.1 门原样）。
- 8713 侧 token 载入位=`%LOCALAPPDATA%\trimlc-daemon-channel.cmd`（set 行形·键位 TRIMC_INTERNAL_TOKEN/TRIMODEL_API_TOKEN/TRIMODEL_API_KEY 等**多键同文件**——明晚步 4c「全 set/env 行逐键清点禁只改锁定行」勘对时此文件为第一落点）。

## 五、并行段 ACP 勘验窗进度

- pin 落定（CTO 裁）：`@zed-industries/claude-code-acp@0.16.2`+spec 面 `@agentclientprotocol/sdk@0.14.1` 双 pin·已装隔离目录（`/tmp/acp-probe-1020/`·npm 裸名 `claude-code-acp@0.1.1`=carlrannaberg 个人老线包对表证据在卷）。
- 三链勘验（session/new→prompt→request_permission）今晚续·读数出卷落本树。

## 六、使用依据

- CTO 施工单 2026-10-20 21:38:42（三裁决）+21:41:01 并复（pin 裁+附议）·CEO LG-085 21:22 裁准
- 步 1 勘验五项读数（回报 21:37·方向反转勘正在案）
- E1-4 b2 毕报卷（2026-W42/trees/e1-daemon-jobs-window/毕报-sg-e14-e15-20261017.md·观察者部署形+mirror 404 实勘先例）
- 源码锚：TriMMC `src/server/app.ts`（路由全列+mirror/store.ts L58 变化沿日志）/TriRLC `src/server/app.ts` L1049-1086（postHeartbeat+失败分类日志）/scripts ops-local e1-b2-heartbeat-watch.mjs（判据段）
- D-46（值面纪律·事故报备 3.2）/D-47（落款现查）/D-24（机位断言）

—— FSD 小全，2026-10-20T14:07:57Z / 22:07:57+0800（发毕对表）
