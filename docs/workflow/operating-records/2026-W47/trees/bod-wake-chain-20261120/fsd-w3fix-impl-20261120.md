# FSD W3-WAKE 修复+二轮换形施工毕报卷（A 三件+B 六条+C 参数化·五门全绿）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-WAKE 修复施工毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·bug 本席自产自修）
- 落款: date 现查见卷尾（D-47 写前跑）
- 法源链: COS 施工触发令（台账 739·A 修复三件+B 六条+C 自证形施工面·门禁裁=独立门禁轮省略四门全绿即过）+CTO W3-e 主勘卷 8d71f1363（§一 裁决铸形+§三.1-6 改动面清单）+本席预勘卷 4499301f2（三件草案全被裁采）
- 施工锚: **TriMLC 3b357d8**（2 files +269/-49·seat-wake-wiring.ts+seat-wake-wiring.test.ts·endpoint 测试件零触·app.ts 零触延续）

## §〇 · 改动面兑现表（触发令 A/B/C 三段照单）

**A 修复三件**（CTO W3-e §一 裁决铸形照铸）：

| # | 件 | 兑现读数 |
|---|---|---|
| A1 | settled 拆分 | `connectSettled`（connect settle 竞争唯一职责）与 `replySettled`（waitReply 局部守卫）两标志分立——waitReply 闭包自带局部 `replySettled`+`done(v)` 守卫，data/close/error/超时四路统一走 done；timer 在 done 内 clearTimeout（防 resolve 后空放）；超时返回 `pendingText() \|\| null` 信息面保全——真发首拍永挂 bug 修复（W3-b 手笔自领·mock 掩盖家族新变体实锚闭环） |
| A2 | 真值单测 s1-s5 | 真 named pipe server 内存对拍案组增补（`net.createServer`+`\\.\pipe\trilc-test-<uuid>`·收帧录制+行分帧 onLine·teardown 全收口）——s1 回执形（**修复前必红=回归钉**）/s2 超时形（timer 面 ~400ms 非即返断言）/s3 close 形/s4 连接拒形（errno 码族）/s5 wakeAction 全链真 socket 端到端（auth→msg 帧序+NDJSON 行分帧 server 侧对拍+msg_id 关联+回执信息面）·案级 timeout 3000ms 防永挂回归 |
| A3 | destroy 入 finally | `conn?.destroy()`+`replyServer.close()` 入 finally——write 后任何路径（含 listen 败/connect 拒/未来 waitReply 改抛形）socket 必收口·单发零泄漏；timer `unref` 保留 |

**B 二轮换形六条**（W3-e §三.1-6 照铸·三闸实锚）：

| # | 改动面 | 兑现读数 |
|---|---|---|
| B1 | NDJSON 行分帧 | auth/消息两帧尾 `+'\n'` 必写（①闸 firstLineDeadlineMs=30000 首拍 30s 静默 destroy 指纹消解） |
| B2 | auth 首行握手 | 连接后先发 `{type:'auth', token:<peerToken>}+'\n'`（peerToken=key 件 119B 值真身定谳·W3-d 卷「协议无 payload token」结论勘正承接）——token 装配面有则发·无则跳过（hasToken 如实）；两候形主铸带 type（fnl 判定若查 type 过·若只取 S.token 亦过）；D-46 值面零回显零落卷照役（结果面只报 hasToken 布尔） |
| B3 | from=自建临时 socket | `\\.\pipe\LOCAL\trilc-wake-reply-<randomUUID>` daemon 自建真监听（net.createServer+listen）——过对端塑形检查（did: 非 socket namespace 形 drop 风险消解）+peer_message_status 回执可达面；listen 后 err handler 静默（不挂 daemon） |
| B4 | fromMode:'bypass' | 消息帧 fromMode 写入（③闸 held→直投主修）——honor 实效候复拍判（若仍 held=协议限制·held+idle 投递=降级可用形·兜底 job2 不撤·CTO §三.4 裁语照录） |
| B5 | type:'user'+msg_id 帧形 | `{type:'user', msg_id:<randomUUID>, from, fromMode, name:'trilc-seat-wake', body:<正文>, message:<正文>}`——body/message 双字段同值（字段名三候覆盖·复拍指纹收敛后裁单）；msg_id 随结果面 `msgId` 字段出面（peer_message_status 回执关联锚）；结果面注释随件更新（回执语义=W3-e §二 读数：held/delivered 按 msg_id/orig_msg_id 关联·waitReply 等真回执信息面·replied=false≠投递败） |
| B6 | 白盒同步 | u10 帧断言换新形（两帧序+两帧 \n 尾+auth 帧 type/token mock 形+user 帧 fromMode/msg_id 关联/from 临时 socket 形/body=message 双置/token 不进消息帧）+u12 增单帧断言（token 缺席=跳过握手）+e13/e14 零触即绿（e13 断言面新形下全成立·e14 只断 reason） |

**C 自证形参数化**（COS 裁采纳·739④）：

- `resolveWakeTargets(deps, targetName='bod', targetAgent='Board')` 双断言参数化+兼容别名 `resolveBodTargets` 零断；
- payload 扩展形 `SeatWakePayload = WakeActionPayload & { target?; targetAgent? }`——handler 内缺省兜底（target 空/非串→'bod'·targetAgent→'Board'），**bod 主链语义零变·自证形与 bod 真发共用同一帧构造路径（wakeAction 函数体零分叉）**；
- app.ts 零触（形检只断 source/reason 串形·target 族透传；`WakeActionResult` 带索引签名·msgId/target 扩展字段零阻——grep 实锚 L256-258）；
- not_found/ambiguous/成功/投递败四分支结果面均带 `target: targetName` 出面（自证形读数可辨目标）。

## §一 · 自测结果（五门）

| 门 | 读数 |
|---|---|
| 白盒（wiring+endpoint 两件） | **38/38 pass**（u1-u16 16 案+e1-e14 14 案+s1-s5 5 案+s 组 432ms——s1 回执 3ms 内 resolve·s5 真值端到端 3.2ms） |
| tsc check / build | **RC=0 / RC=0**（dist/server/seat-wake-wiring.js **13646 bytes**·f8ea3a2 时 9525——修复+换形扩容；app.js 零触延续） |
| 全量回归 | **839 pass / 5 fail**（834 基线+5 新案组数学闭合·5 fail 族名逐字同基线谱：replay-flow/auth-gate e1-healthz/FADE-ASSESS-005×2/tui components——零漂） |
| 活体 dry-run 探针 | **四断言绿**：A1 名址唯一命中（pid=24572·idle·socket 掩形…ae7adf9d=W3-a 卷实锚吻合·**keyPresent:true→auth 握手可用**）/A2 alive:true/A3 CONNECTED 零写/A4 200ms destroy **零真发（零帧写·W3-a §三案 1 授权形照役）** |

## §二 · 帧形终态（复拍观测面对表面）

- **auth 帧**：`{"type":"auth","token":"<peerToken>"}`+`\n`（首行·token= bod key 件值·值面零出卷）；
- **消息帧**：`{"type":"user","msg_id":"<uuid>","from":"\\\\.\\pipe\\LOCAL\\trilc-wake-reply-<uuid>","fromMode":"bypass","name":"trilc-seat-wake","body":"[seat-wake probe] <reason> @<sentAt>","message":"<同 body>"}`+`\n`；
- **未定谳 4 点照候复拍判**（CTO §三指纹判别表）：auth 帧形 2 候（带 type 主铸）/消息体字段名 3 候（body+message 双置）/fromMode honor 实效/user 帧 did:→已消解（from=临时 socket）——复拍每闸独立指纹：30s 静默 destroy=①·即断+authDrop=②·保持零回执=③held·回执 delivered=全通。
- **护栏照役**：自证形探针目标参数化就绪（payload.target 换 m-cto 本席名·sde 校形窗执行）；bod 真发三证照役+新增 daemon 侧 waitReply 回执读数+断连时机指纹。

## §三 · 技术债随动

1. waitReply 永挂 bug=**销**（A1 修复+s1 回归钉双锚——mock 掩盖家族教训钉补闭环：真值连接器自此至少一案真 socket 覆盖）。
2. 首拍帧零消费=**修形毕候活体验**（B 六条三闸全照铸·实效候自证形校形窗+bod 真发终验）。
3. waitReply 单槽语义（一次 waitReply 消费·多调用后覆盖前者）=调用契约注保持（wakeAction 现役一次调用形合规·多播面候远期零需求不预造）。
4. 未定谳 4 点=非债（复拍判别面·CTO 卷 §三清单照候）。
5. TriMLC 既有 5 fail 基线族照候 CTO 勘修窗裁量（本窗零增）。

## 使用依据

- CTO W3-e 主勘卷 cto-w3e-consumption-semantics-survey-20261120.md（§一 裁决铸形三件+§三.1-6 六条+§四 复拍观测面）
- COS 施工触发令（台账 739·A+B+C 三段+门禁裁四门全绿即过+C 自证形采纳）
- 本席预勘卷 fsd-w3fix-predesign-20261120.md（三件草案形定源·全被裁采照铸）
- W3-a 形定卷（五步形+活体探针授权案 1 形）+W3-b2 毕报卷（帧形勘正承接链）

—— FSD 小全（m-fsd）·2026-11-19T19:35:19Z（+8=2026-11-20 03:35:19·date 现查原值·D-47 正形）
