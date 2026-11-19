# FSD W3-b 接线施工毕报卷（wake 动作五步形填装·白盒 33/33+dry-run 探针活体绿）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-b 毕报正身；快轨正身=毕报信）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·W3-b 主刀）
- 落款: date 现查见卷尾（D-47 写前跑）
- 法源链: BOD 02:15+08 示下照推进→COS W3/W4 拆树卷（§一 W3-b）→COS 触发令（W3-a 形定卷在树即施工）→**CTO W3-a 形定卷 cto-w3a-wiring-survey-20261120.md（c608f8af1）§二五步形+§四交接注四点**
- 施工锚: **TriMLC 2157de1**（4 files +498/-2·src/server/seat-wake-wiring.ts 新+src/index.ts 装配行+两测试件·零卷入）

## §〇 · 实现方案（W3-a 形定卷遵行·五步形）

新模块 `seat-wake-wiring.ts` 承 W3-a §二产出 a 五步形，deps 全注入面（白盒 mock 用·缺省真值实现）：

1. **名址解析**：扫 `~/.claude/sessions/*.json` → `name==="bod" && agent==="Board"` 双断言（W3-a §一 双名分野定谳：seats.json opsName 与 sessions 注册件 name 两层分立·匹配用后者）→ `messagingSocketPath`；零命中/多命中 fail-visible（reason 值面区分）；坏注册件跳过不投递。
2. **活态守门**：`process.kill(pid, 0)` 探活（ESRCH=死·EPERM/成功=活跨平台形）；busy/idle 两态均投递（W3-a §二.2 语义）·status 随结果面透传。
3. **鉴权装配**：读 `<pid>.<64hex>.key` 键件值→信封 `auth` 字段（**D-46 值面零回显零日志零落卷——结果面只报 hasToken 布尔·socketPath 只出掩形尾 8 位**）。
4. **管道投递**：`net.connect(socketPath)` →写占位信封 `{source:'trilc-seat-wake', reason, sentAt, auth}` →waitReply（2s 限时）→destroy——**最小形（连接→写→读回执/关闭）·wire 协议非公开契约·真发校形归 W3-d 探针窗**。
5. **结果面**：成功 `{delivered:true, wired:true, target:'bod', pid, status, hasToken, socketSuffix, replied, deliveredAt}`；败 `{delivered:false, reason, ...上下文}`。

**装配面**：`src/index.ts` app.start() 后 `wireSeatWakeAction()` 一行（lazy 零 IO——装配不扫盘·真 IO 在 handler 调用时）+ready 前日志行；回滚锚=clearWakeActionHandler 即回骨架态（W2-b 三导出面零删·app.ts 零触=dist/app.js 286142 bytes 不变实证）。

**reason 分层**（W2-c 终态字面兼容·骨架字面零变）：
| 态 | reason 字面 |
|---|---|
| 未接线（骨架） | `wake_action_not_wired`（app.ts 承载·零变） |
| 名址零命中 | `wake_target_not_found` |
| 名址多命中 | `wake_target_ambiguous` |
| pid 不存活 | `wake_target_not_alive` |
| 连接拒/写败/超时 | `wake_delivery_failed`（**候定名·本席铸定案——候 W3-c 门禁对表**；wired 但投递败≠not_wired 分层语义照 W3-a §二.5） |

## §一 · 代码变更（TriMLC 2157de1）

1. **src/server/seat-wake-wiring.ts 新模块**（~230 行）：`BodTarget/SocketConn/WakeDeps` 类型+`resolveBodTargets`（名址双断言）+`isPidAlive`（探活）+`defaultConnectSocket`（named pipe 双工真值连接器）+`createWakeAction`（五步真身）+`wireSeatWakeAction`（装配入口）。
2. **src/index.ts 装配行**：import+app.start() 后 `wireSeatWakeAction()`+`[trilc] seat-wake wired` 日志。
3. **test/server/seat-wake-wiring.test.ts 新件 16 案**（W3-a §四.4 案形：名址解析 mock+守门分支+reason 分层·**真管道写案不入白盒**）：u1-u5 名址（双断言正反/keyPath 容错/目录不可达）·u6-u9 reason 分层（not_found/ambiguous/not_alive/delivery_failed+D-46 零回显断言）·u10-u12 投递形（全绿形+busy 照发+key 缺席容错）·u13-u14 装配面（wire 入口+clear 回滚锚）·u15-u16 探活契约。
4. **test/server/seat-wake-endpoint.test.ts 增 e13/e14**：真接线模块端到端（mock connector 零真管道写）——e13 全绿 wired:true delivered:true+hasToken+D-46 面·e14 连接拒→wake_delivery_failed 分层端到端。

## §二 · 自测结果（四门+dry-run 探针）

| 门 | 读数 |
|---|---|
| 白盒（wiring+endpoint 两套件） | **33/33 pass**（16 新案+15 现役案+2 新端到端·初跑 32/33→u16 修后全绿·见 §三） |
| tsc check / build | **RC=0 / RC=0**（dist/server/seat-wake-wiring.js 8575 bytes 产物在·**dist/server/app.js 286142 bytes 不变**=app.ts 零触实证） |
| 全量回归 | **834 pass / 5 fail**（816 基线+18 新案=834 数学闭合·5 fail 族名逐字同谱基线：replay-flow/auth-gate e1-healthz/FADE-ASSESS-005×2/tui components——零新增零漂·族名实读非转抄） |
| **dry-run 探针（案 1·零真发·活体三断言）** | **全绿 RC=0**：①名址唯一命中（hits=1·pid=24572·status=idle·socket 掩形 cc-msg-…ae7adf9d——**与 W3-a 卷 bod 实锚逐字吻合**）②管道连接 CONNECTED（零写·200ms destroy）③key 装配（keyPresent=true·**keyLen=119·hex64=false**——见 §三.3 技术债） |

## §三 · 自勘自修与技术债如实

1. **案名「seat-seat」双前缀笔误两处**（W2-b 改名 sed 重算前缀残留）：endpoint 测试件 L1 头注+套件名——grep 全仓清点两处自勘即修（毕报 W2-b §五 裸名零残留断言只扫了 `/internal/v1/wake` 路径面·中文案名面漏了此变形——本件复勘补扫）。
2. **u16 白盒案初跑 fail**（true!==false）：本席对 `isPidAlive(0)` 的 win32 假设错——pid 0=System Idle Process 面 OpenProcess 可达·`process.kill(0,0)` 不 ESRCH。测试案平台假设错非实现错——案改形（探活契约=布尔形·ESRCH 判死分支由 u8 mock 承载）·教训=平台敏感断言先实勘再钉。
3. **key 值面真形=119 字节非 64hex**（dry-run probe3 现势读数）：W3-a 卷文件**名**形 `<pid>.<64hex>.key` 定谳·键件**值**面形未定义——现势 119B 非 hex64（骨架照读照传装配通路不断·wire 鉴权协议形候 W3-d 真发窗校形）。技术债如实标记：**信封 auth 字段=占位形**（W3-d 协议勘定后校形·真发前必勘）。
4. **wire 协议占位信封技术债**：投递信封 `{source,reason,sentAt,auth}` 为自描述最小形——harness peerProtocol:1 真协议未勘·W3-d 真发探针窗（案 2·六护栏+BOD 在场）协议校形后方可真推唤。
5. 既有 5 fail 基线族非本件域——如实转报不修（候 CTO 域勘修窗裁量）。

## §四 · 边界与候面

- 真发件备料不即发（COS 触发令②遵行）——W3-d 探针窗（案 1 全绿=案 2 前置已备·案 2 六护栏+BOD 在场窗归 CTO 裁决链）。
- daemon 重启装载归 W3-d（m-sde·重启链纪律全套·本件只交付 dist 产物）。
- 名址定谳/探针安全面裁决=CTO 域遵行（勿越面）。

## 使用依据

- CTO W3-a 形定卷 c608f8af1（§一 名址正形+双名分野/§二 产出 a 五步形/§三 探针案 1 自测授权/§四 交接注四点）
- COS W3/W4 拆树卷+触发令（§一 W3-b 门=白盒读数+构建绿）
- W2-c 门禁卷（reason 字面兼容锚·骨架字面零变）
- 现役形实勘：app.ts 接线口三导出（W2-b 铸·L251-276）+index.ts 装配位（L145-146）+auth-gate 测试配方

—— FSD 小全（m-fsd）·2026-11-19T18:33:23Z（+8=2026-11-20 02:33:23·date 现查原值·D-47 正形）
