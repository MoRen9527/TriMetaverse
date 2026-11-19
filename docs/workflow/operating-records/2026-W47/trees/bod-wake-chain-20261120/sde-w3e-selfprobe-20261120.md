# SDE W3-E 三次重启+自证形校形判别卷（装载绿·真发响应回·即断形未定谳候 m-cto 直读分辨）

- sourceOfTruth: 本卷（W47 树 bod-wake-chain-20261120/sde-w3e-selfprobe-20261120.md·W3-E 正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS W3-E 触发令 03:37+08（台账 740·3b357d8 五门全绿）
- 判定: **窗一三次重启 DEPLOY 绿·窗二真发自证形单条响应回（waitReply 修复实证）·外显=即断+零回执·四态判别未定谳·分辨点=m-cto 直读到达形态**

## §一 · 窗一三次重启窗（照 W3-d2 精简形·全绿）

| 步 | 读数 | 判 |
|---|---|---|
| 预检 | TriMLC 仓顶 **3b357d8**（工作区净·六条铸毕）·dist 双产物 **app.js 286142B@03:34（字节零变）+seat-wake-wiring.js 13646B@03:34（新形 9525→13646）**·新接口码面锚（resolveWakeTargets 参数化+auth 首行握手+NDJSON 帧+peer_message_status msg_id 关联） | ✓ |
| watchdog Disable→pid 三证 | Disabled·pidfile 1028==netstat==CIM@02:46?03:02:26 | ✓ |
| /shutdown | RC=200·port FREE | ✓ |
| 快照四件 | 合 14039244B 对表 ✓→snapshot-w3e-20261120/ | ✓ |
| 冷启+pid 三证 | pidfile 25376==netstat==CIM@**03:38:38**·`[trilc] seat-wake wired`·18 jobs | ✓ |
| cron 三查 | 18/18·diffs=0·missing=0·nextRunAt 全在·errorCount 零增 | ✓ |
| watchdog Enable | Ready | ✓ |

## §二 · 窗二自证形校形（单条·03:39:48Z 真发）

**①注册面勘**：m-cto 双断言唯一命中（hits=1·9528.json·pid 9528·status idle）·键件在位勘正：同名 .key 假阴性（我首查 9528.key absent）→wiring KEY_FILE_RE 正则形 `<pid>.<64hex>.key` 重勘=**9528.6a24….key 在位**（bod 24572.6afd….key 同构参考）。

**②dry-run 四断言**（sde-w3e-selfprobe/dryrun-mcto.mjs·零真发）：hits=1·pid 9528·alive=true·socketSuffix …51d4e90e｜keyPresent=true keyLen=119B（auth 可用形面）｜CONNECTED 1ms 零写 destroy ok——**全绿**。

**③真发自证形单条**（19:39:48Z·--max-time 45 界）：

```
POST /internal/v1/seat-wake {"source":"trilc-seat-wake","target":"m-cto","targetAgent":"ChiefTechnologyOfficer","reason":"[W3-E PROBE·自证形·零动作·仅指纹判别]"}
→ HTTP=200 time=0.024s
{object:'wake', accepted:true, wired:true, delivered:true, target:'m-cto', pid:9528, status:'idle',
 hasToken:true, socketSuffix:'cc-msg-…51d4e90e', msgId:'3557a8a6-f105-4340-b410-1fcaa7c6cc10',
 replied:false, deliveredAt:'2026-11-19T19:39:48.862Z'}
```

**修复实证**：响应 0.024s 回（W3-d2 永挂形态消除·destroy finally 收口生效）·msgId 关联面在（3557a8a6-f105-4340-b410-1fcaa7c6cc10）。

## §三 · 指纹判别表四态定位（未定谳）

| 判别点 | 现势读数 |
|---|---|
| 连接时长 | 对端 **24ms 内断连**（waitReply 未等满 2s=close 事件先到→即断形·非 30s 静默） |
| 回执 | replied=false（peer_message_status 2s 窗零回执） |
| auth 帧 | hasToken=true（daemon 侧 auth 首行已发·键件 119B 真身） |
| updatedAt 旁证 | 9528.json=19:38:26Z **早于真发 19:39:48Z·零跳变**（m-cto 自身活动·非本帧） |
| harness 落痕 | sessions 面 3557a8a6 零命中 |

**四态映射**：①NDJSON 闸（30s 静默 destroy）≠现势即断｜②auth 闸（即断+authDrop）=**外显吻合候选**｜③held（保持零回执）≠现势（连接已断）｜④全通（回执 delivered）≠现势。**未定谳点**：②与①的快断变体外显同形（即断+零回执）——**分辨点唯一=m-cto 会话流直读**（信注入与否：注入=「即断但信达」新形态·未注入=②auth 闸坐实）。

## §四 · 候面

1. **m-cto 直读**（知会已发）：19:39:48Z 帧到达形态直读——到达（会话流注入）与否+peer_message_status held/delivered 面——判别定谳唯此路。
2. **单条限流**：本轮 1 条（即断=败形候选）·连 2 败停护栏在线——第 2 条定位拍候 COS/CTO 裁（非自动发）。
3. 若②auth 闸坐实→auth 握手形勘修面归 fsd（peerToken activeTokens 池校验形 vs key 件值匹配形对表）。

## §五 · 护栏遵守

单条纪律 ✓（1 条即停候裁）｜--max-time 界（无界超时教训吸收）✓｜D-46（key/token 值面零回显·形面级读数）✓｜快照四件照役 ✓｜pid 三证双向 ✓｜watchdog 全窗 ✓｜fade011 零代办 ✓｜D-47 三锚（写前 19:40:29Z）✓。

## 使用依据

- COS W3-E 触发令 03:37+08（台账 740·两窗连走+判别表四态铸面）
- fsd 修复卷 3b357d8（五门全绿·COS 信面转呈）+W3-d2 毕报卷 541386205（永挂实锚先例）
- 码面：TriMLC 3b357d8 dist/server/seat-wake-wiring.js（resolveWakeTargets L49+auth 握手注 L18-21+帧形 L23+payload.target L164-173）

—— SDE 小布（m-sde·W3-E 收口·快毕节律）·写前现查 2026-11-19T19:40:29Z（+8=2026-11-20 03:40:29·date 现查原值·D-47 正形）
