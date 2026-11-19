# SDE W3-d2 部署+真发探针毕报（换形 9525B 装载绿·真发首拍帧已写出+waitReply 永挂 bug 实锚·零重试纪律）

- sourceOfTruth: 本卷（W47 树 bod-wake-chain-20261120/sde-w3d2-deploy-probe-20261120.md·W3-d2 正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS W3-d2 触发令 03:01+08（TriMLC f8ea3a2·卷 6c3d965fd）
- 判定: **二次重启窗 DEPLOY 完毕（装载全绿）·真发探针首拍=帧写出实证+真值 waitReply 永挂 bug 实锚（fsd 修复窗候）·活体零损**

## §一 · 二次重启窗（照 W3-d 例精简序·全绿）

| 步 | 读数 | 判 |
|---|---|---|
| 预检 | TriMLC 仓顶 **f8ea3a2**（工作区净）·dist 双产物 **app.js 286142B@02:59（字节零变=app.ts 零触）+seat-wake-wiring.js 9525B@02:59**·新帧形码面锚 L163-166 在位 | ✓ |
| watchdog Disable | State=Disabled | ✓ |
| 停机前置 pid 三证 | pidfile 2812==netstat 2812==CIM 2812@02:46:08 | ✓ |
| /shutdown | RC=200（根路径正形·W3-d 勘误教训已吸收）·port FREE | ✓ |
| 快照四件 | cron.db 9838592/shm 32768/wal 4144752/json 10844 对表 ✓→snapshot-w3d2-20261120/ | ✓ |
| 冷启+pid 三证 | pidfile 1028==netstat 1028==CIM 1028@**03:02:26**·`[trilc] seat-wake wired` 行·18 jobs | ✓ |
| cron 三查 | 18==18·structural_diffs=0·nextRunAt_missing=0·**errorCount 18/18 逐字零增**（对 w3d2 快照基线） | ✓ |
| watchdog Enable | State=Ready | ✓ |

## §二 · 真发探针首拍（单条·六护栏照役·19:03:15Z）

**执行序**：六护栏前置全核（在役双证=401 双形 401/401+dry-run 三断言复验全绿 hits=1 pid 24572·CONNECTED 1ms 零写·keyLen 119B——新 9525B 产物零回归｜BOD 在场窗 02:51 现开值守中｜D-46 token 变量读入零回显）→真发前现查 **19:03:15Z**→POST /internal/v1/seat-wake（body=`{"source":"trilc-seat-wake","reason":"W3-D PROBE·零动作指令·仅回执"}`）→**挂起 120s 超时 exit 143**→**护栏②失败即停·零重试**。

**帧构造码面序（勘定）**：wiring L160-169——`connect` await（成功）→`envelope` 构造（peer 帧形四字段·reason 移入 body）→**`conn.write(envelope)` 同步执行成功（帧已写管道）**→`await conn.waitReply(2000)` ←挂点。

**帧体实锚**（构造形推定·daemon nowIso）：`{"kind":"peer","from":"did:trilc-seat-wake","name":"trilc-seat-wake","body":"[seat-wake probe] W3-D PROBE·零动作指令·仅回执 @≈2026-11-19T19:03:15Z"}`——**BOD 回执主证=候 COS 转 BOD 链核此信收讫**（收信时刻窗=19:03:15Z 前后 2s）。

## §三 · 真值 waitReply 永挂 bug 码面实锚（fsd 修复窗候·勘定依据）

`defaultConnectSocket`（wiring.js L91-119）**settled 标志互斥重用**：

1. connect 事件→`settle(conn)`→`settled=true`；
2. waitReply 闭包 `replyResolve=(v)=>{ if(!settled){...res(v)} }`——**settled 已是 true→四路触发全被闸死**：data 事件/close 事件/error 事件/`setTimeout(()=>replyResolve?.(null), ms)` 超时路——**全部经同一 replyResolve→`!settled` 恒 false→promise 永不 resolve**；
3. `await conn.waitReply(2000)` 永挂→wakeAction 永挂→HTTP res 永不写→客户端超时。

**成因谱系**：W3-b 真值实现即含此形（f8ea3a2 换形零触该段）；白盒 33/33 全走 mock connector（u10-u12+e13/e14）——mock waitReply 行为正确·**真值实现 bug 白盒结构不可见**——真发探针=首走真值路径=首暴（探针窗价值实证）。timer.unref 使事件循环不堵（daemon 活体零损·healthz 绿·cron 照跑）。

**daemon 影响如实**：泄漏单 handler promise+单未 destroy socket（本次单发·单次无感；**每次真发恒泄一个——fsd 修复前真发禁复拍**）。

## §四 · 三证读数

| 证 | 读数 | 判 |
|---|---|---|
| BOD 回执主证 | 候 COS 转 BOD 链核 19:03:15Z 帧收信（帧体见 §二） | 候 |
| updatedAt 旁证 | 1795114914665（03:01:54Z·真发前基线）→1795114970606（**19:02:50Z**）——**早于 POST 19:03:15Z=非本帧引起**（bod busy→idle 自身活动同窗·如实辨防假阳性）；本帧若达 harness 落箱面的 updatedAt 跳变形态候 BOD 链勘（收信处理时点未知） | 辨明 |
| waitReply ack 形 | 永挂读数（§三 bug）——ack 观测补点被 bug 掩盖·修复后复拍补 | 候修 |

## §五 · 护栏遵守

零重试（②失败即停）✓｜D-46（token 零回显·帧 body 零值面）✓｜快照四件照役 ✓｜pid 三证双向 ✓｜watchdog 全窗 ✓｜fade011 零代办 ✓｜D-47 三锚（写前 19:06:48Z）✓｜**修复前真发禁复拍**（单发泄漏不累积原则·自设护栏如实呈）。

## §六 · 候面

1. **BOD 回执核**：COS 转 BOD 链——19:03:15Z 帧 `[seat-wake probe] W3-D PROBE·零动作指令·仅回执` 收信与否=投递面真证（write 成功+waitReply bug 独立于投递成败）。
2. **fsd 修复窗**：settled 标志拆分（connect settle 标志与 waitReply resolve 标志分立）+真值 waitReply 单测补（真 socket 形案·防 mock 掩盖复发）——候 CTO 裁。
3. **三次重启窗**：fsd 修复装载后（序照本卷 §一精简形）+真发复拍（三证补全·ack 观测补点）。
4. deadline 09:00 在轨：毕报落卷现查 2026-11-19T19:07:48Z（+8=2026-11-20 03:07:48）·余量约 5h52m·快毕节律照走。

## 使用依据

- COS W3-d2 触发令 03:01+08（①二次重启窗②真发探针③双证④毕报卷）
- CTO 校形卷 95e639817（§三改动面清单+§四真发铸形——fsd 五条兑现我卷 §一对表）+FSD 换形卷 6c3d965fd（COS 信面转呈读数）
- W3-d 毕报卷 0fc407208（11 步序先例+shutdown 路由勘误教训）
- 码面：TriMLC f8ea3a2 dist/server/seat-wake-wiring.js L91-119（waitReply 真值）+L155-176（wakeAction 投递段）全读

—— SDE 小布（m-sde·W3-d2 收口·快毕节律）·写前现查 2026-11-19T19:06:48Z（+8=2026-11-20 03:06:48·date 现查原值·D-47 正形）
