# FSD R6-b daemon codepoint 探针随件毕报卷（分界双证铸毕·五门全绿·零改码面遵行）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·R6-b 施工毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd）
- 落款: date 现查见卷尾（D-47 写前跑）
- 法源链: COS R6 第六轮并批窗开工令（BOD 04:52 授权·W4 已毕随令开·台账 747 后续）+CTO W3-h mojibake 勘定卷（§一 层位谱系·§二 判别两案·§三 修复面预案）
- 施工锚: **TriMLC 498f058**（2 files +31/-0·wiring+白盒·帧构造零动·daemon HTTP 链零触）

## §〇 · 兑现面（开工令三款照单）

| 款 | 兑现 |
|---|---|
| ①全读 cto 卷照铸 | W3-h 卷全读毕（§一 A 段嫌疑最高/B/C 全链 unicode 安全·§二 R6-b 探针形·§三 修复面预案）；探针照 §二.② 铸：`bodyBytes=Buffer.byteLength(bodyText,'utf8')`+`cp16Hex`=前 16 codepoint hex——**console.log 日志面+结果面 `bodyBytes`/`cp16Hex` 字段双读数**（sde 拍发 curl 响应直读·零日志文件依赖） |
| ②白盒随件+check/build | u10 探针断言扩展（ASCII 形字节计+cp16）+**u17 中文形新案**（reason='中文分界拍'→多字节 bodyBytes+U+4E2D 族码点在探=乱码分界读数能力钉）；check/build RC=0 |
| ③毕报落树候 sde | 本卷即毕报——候 COS 转 sde 重启窗（装载 498f058 dist）+R6-a ASCII 对照拍（零改码·可与同拍并批双证） |

## §一 · 取段偏离载明（工程判断·候 CTO 勘面对表）

CTO 卷 §二.② 字面=「前 16 codepoint hex」于 **bodyText**——但 bodyText 前 16 codepoint=ASCII 前缀 `'[seat-wake prob'`（护栏自描述前缀恒定 ASCII）——对 A 段（拍发链）**中文乱码零分辨力**（前缀永不变·乱码与否读数恒同）。故 cp16Hex 取段=**reasonText**（中文直接载体·乱码即此显形）——「daemon 收到时已乱（A 段·cp16 即现乱码码点）vs daemon 发出才乱（B 段·cp16 恒正码点）」一次拍分清的判别语义方达。bodyBytes 照卷字面（bodyText 全量）。零改码面遵行（帧构造/daemon HTTP/管道链零触·探针只加日志与结果面读数）；reason 非密值面可回显（D-46 照役仅 token 面）。

## §二 · 探针读数形（R6-a 同拍对照表面）

- **日志面**：`[seat-wake] bodyBytes=<n> cp16=[<hex hex …>] reason16="<reason 前 16 字符>"`
- **结果面**：成功响应附 `bodyBytes:<int>`+`cp16Hex:"77 61 6b 65"` 形（ASCII 时）/中文时如 `"4e2d 6587 5206 754c 62cd"`——**乱码判读**：cp16Hex 若现 `fffd`（U+REPLACEMENT CHARACTER）族或高位 Latin-1 码点（`c4 e3` 形=GBK 误解码指纹）→daemon 收到时已乱（A 段实锤）；恒正中文码点→B 段（低概率·届时 §三 R6-b 反证预案启用）。
- sde 拍发面（R6-a ASCII 拍+中文拍可并批双证）：reason 换 ASCII 形一拍+中文形一拍——两拍 cp16Hex 对照即定谳层位。

## §三 · 自测结果（五门）

| 门 | 读数 |
|---|---|
| 白盒（wiring+endpoint） | **40/40 pass**（16u+14e+6s+**u17**·u17 中文码点 U+4E2D 在探断言钉） |
| tsc check / build | **RC=0 / RC=0**（dist/server/seat-wake-wiring.js **17248 bytes**·d62976e 时 16165） |
| 全量回归 | **846 pass / 5 fail**（845 基线+u17 数学闭合·5 fail 族名逐字同基线谱：replay-flow/P0 通道端到端/FADE-ASSESS-005×2/tui components——零漂） |
| 活体 dry-run 探针 | **四断言绿**：A1 名址唯一命中（pid=24572·**busy 现势**（BOD 在轮中）·…ae7adf9d·keyPresent:true）/A2 alive:true/A3 CONNECTED 零写/A4 200ms destroy **零真发（零帧写·W3-a 案 1 授权形照役）** |

## §四 · 技术债务随动

1. mojibake 根因=**候拍定谳**（R6-a/R6-b 双证设计就绪·本席码面零阻塞）。
2. 探针随件债=零（纯日志+读数面·帧构造零动·可随任意后续窗退役）。
3. TriMLC 既有 5 fail 基线族照候 CTO 勘修窗裁量（本窗零增）。

## 使用依据

- CTO W3-h mojibake 勘定卷（§一 谱系+§二 R6-b 形+§三 预案）
- COS R6 开工令（三款照单+护栏 D-46/D-47/毕报锚双实锚）
- 本席 W3-g 毕报卷（d62976e 帧构造承·本卷探针零触）

—— FSD 小全（m-fsd）·2026-11-19T20:56:03Z（+8=2026-11-20 04:56:03·date 现查原值·D-47 正形）
