# FSD W3-b2 信封换形随件毕报卷（校形卷 §三 五条全兑现·白盒 33/33+全量零漂）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-b2 换形毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·W3-b 续卷换形随件）
- 落款: 2026-11-19T18:59:59Z（+8=2026-11-20 02:59:59·date 现查原值·D-47 正形）
- 法源链: COS 换形施工令（校形①②定谳·cto 卷 95e639817=cto-w3d-wire-protocol-survey-20261120.md）→§三 改动面五条→本件
- 施工锚: **TriMLC f8ea3a2**（3 files +32/-17·seat-wake-wiring.ts+两测试件·零卷入）

## §〇 · 改动面五条兑现表（校形卷 §三 照单）

| # | 改动面 | 兑现读数 |
|---|---|---|
| 1 | envelope 换形 | **peer 帧形在**：`{kind:'peer', from:'did:trilc-seat-wake', name:'trilc-seat-wake', body:'[seat-wake probe] <reason> @<sentAt>'}`——auth 字段移除不进帧·fromMode 零写（码面注释双锚：§二 协议零 token 消费点+honor 边界 absent 正形） |
| 2 | key 保留读形 | 装配段零触（读形照旧·hasToken 信息面不变）——帧构造零触 token 值面（少一个落点更净） |
| 3 | replied 判据修正 | 结果面注释随件：投递成判据=write 成功+连接保持到 destroy·replied=false≠投递败（waitReply 仅信息面·harness fire-and-forget 概率形·W3-c 门禁卷 §四.4 预判兑现） |
| 4 | err.message 掩形 | catch 分支改 errno 码形：`(err as NodeJS.ErrnoException).code ?? 'delivery_error'`——socketPath 全名泄漏面销（u9 断言 error='ECONNREFUSED' 维持=code 在则出码） |
| 5 | 白盒同步 | u10 帧断言换新形（kind/from/name deepEqual+body 自描述前缀+**auth 零在场断言**+fromMode 零写断言）+e13 掩形断言修净——33/33 基面维持 |

## §一 · 自测结果

| 门 | 读数 |
|---|---|
| 白盒（wiring+endpoint） | **33/33 pass**（初跑 32/33→u9 mock 形修后全绿：mock 抛裸 Error 无 .code→掩形落兜底——改抛真 ErrnoException 形带 code·对齐 net.connect 真错误面） |
| tsc check / build | **RC=0 / RC=0**（dist/server/seat-wake-wiring.js **9525 bytes** 换形产物·app.js 286142 零变=app.ts 零触延续） |
| 全量回归 | **834 pass / 5 fail**（与 W3-b 毕读数逐字同——换形零漂·5 fail 族名基线同谱） |

## §二 · 值面锚（W3-d 真发探针+W3-c 门禁对表面）

- 帧形终态（换形后·白盒 u10 断言在卷）：`{"kind":"peer","from":"did:trilc-seat-wake","name":"trilc-seat-wake","body":"[seat-wake probe] wake @<sentAt>"}`——payload.reason 缺省时 body 用 `wake`；探针窗真发帧 body 照校形卷 §四 `[W3-D PROBE] seat-wake 管道投递探针·零动作指令·仅回执 @<sentAt>`（m-sde 探针件照此形）。
- 结果面终态：成功 `{delivered:true, wired:true, target:'bod', pid, status, hasToken, socketSuffix(掩形), replied(信息面), deliveredAt}`·投递败 `{delivered:false, reason:'wake_delivery_failed', pid, socketSuffix, error(errno 码掩形)}`。

## §三 · 技术债随动

1. wire 协议占位信封债=**销**（换形毕·协议形在码+白盒双锚）。
2. key 值面 119B 用途债=承 W3-d 校形卷 §二定谳（非管道帧域·候远期勘·不阻链）——帧面零触后本模块内零暴露点。
3. u9 mock 形教训（ErrnoException .code 面）——本卷 §一 自勘自修记录。

## 使用依据

- CTO W3-d 校形卷 cto-w3d-wire-protocol-survey-20261120.md（§三 改动面五条+§四 探针帧形）
- W3-c 门禁卷（§三.4 err 掩形+§四.4 replied 预判）
- COS 换形施工令（五条施工面+毕报续卷命名授权）

—— FSD 小全（m-fsd）·2026-11-19T18:59:59Z（+8=2026-11-20 02:59:59·date 现查原值·D-47 正形）
