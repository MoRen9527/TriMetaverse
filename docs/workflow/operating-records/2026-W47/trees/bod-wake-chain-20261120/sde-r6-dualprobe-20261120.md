# SDE R6 双证拍毕报（R6-a ASCII 拍+中文拍·拍发侧 -d @file 正形·**bodyBytes 字节面数学闭合=A 段零乱码实锤**）

- sourceOfTruth: 本卷（W47 树 bod-wake-chain-20261120/sde-r6-dualprobe-20261120.md·R6 双证拍正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS R6 双证拍触发令（fsd R6-b 毕·TriMLC 498f058 五门全绿白盒 40/40）
- 判定: **双拍毕·判读表命中「恒正码点+字节面精确闭合」枝=daemon 收帧侧（A 段）零乱码实锤·B 段反证成立——乱码位面收敛至 C 段（harness/claude.exe 读管道解码面）·候 cto 判读定谳+BOD 读信窗对照**

## §一 · 重启窗（R6-b 探针版装载·精简序·全绿）

| 步 | 读数 | 判 |
|---|---|---|
| 预检 | TriMLC 仓顶 **498f058**（工作区净）·dist 双产物 **wiring.js 17248B**（16165→17248·codepoint 探针版）+app.js 286142B 零变 | ✓ |
| watchdog Disable→pid 三证 | Disabled·pidfile 38760==netstat==CIM@04:23:37（连续） | ✓ |
| /shutdown | RC=200·port FREE | ✓ |
| 快照四件 | 合 14059724B 对表 ✓→snapshot-r6-20261120/ | ✓ |
| 冷启+pid 三证 | pidfile **20764**==netstat==CIM@**04:59:00**·`[trilc] seat-wake wired`·healthz 200 | ✓ |
| cron 三查 | 18==18·missing=0·nextRunAt 全在·errorCount 零增 | ✓ |
| watchdog Enable | Enabled | ✓ |

## §二 · 拍发侧正形改形（cos 令②先行·-d @file 落形）

两件临时 JSON 落树 `sde-r6-probe/`：r6a-ascii.json（reason 纯 ASCII）+r6-cn.json（reason 中文）——Write tool 直写 UTF-8 零 BOM（发前字节勘=首 3 字节 `7b 22 73`=`{"s` 零 BOM 形）——curl `--data-binary @file` 原字节发送·绕 shell/管道编码层（cto 卷 925e6dcb4 预案兑现）。

**插曲如实**：首拍中文件时 `--data-binary "<path>"` 漏 @（路径当 body 发）→daemon `invalid_json_body` 400 拒 0.029s——**零真发不计拍数**·勘正 @file 形重发。

## §三 · 双拍读数（六护栏照役·单条×2）

**R6-a ASCII 拍**（20:59:47.471Z deliveredAt）：

```
POST /internal/v1/seat-wake @r6a-ascii.json
→ HTTP=200 time=2.020s
{delivered:true, target:'bod', pid:24572, status:'idle', hasToken:true, socketSuffix:'cc-msg-…ae7adf9d',
 msgId:'759e6a8f-a1e2-43d3-bbbf-efd5bbf3d3ee', replied:false,
 bodyBytes:107, cp16Hex:'005b 0073 0065 0061 0074 002d 0077 0061 006b 0065 0020 0070 0072 006f 0062 0065'}
```

**中文拍**（21:00:03.578Z deliveredAt）：

```
POST /internal/v1/seat-wake @r6-cn.json
→ HTTP=200 time=2.011s
{delivered:true, target:'bod', pid:24572, status:'busy', hasToken:true, socketSuffix:'cc-msg-…ae7adf9d',
 msgId:'8f103642-be90-4969-a2ae-6c812daf9c48', replied:false,
 bodyBytes:96, cp16Hex:'005b 0073 0065 0061 0074 002d 0077 0061 006b 0065 0020 0070 0072 006f 0062 0065'}
```

注：中文拍 status=**busy**（ASCII 拍唤醒旁证——ASCII 帧已到 bod 会话流把 BOD 拉起·独立旁证）。

## §四 · 判读（cos 令③判读表对表·字节面数学闭合）

**发侧字节面算术**（node Buffer.byteLength 实算）：

| 拍 | 发侧 reason UTF-8 字节 | bodyText 构成（wiring 形=`[seat-wake probe] `+reason+` @`+sentAt） | 发侧 bodyText 字节 | daemon bodyBytes | 差 |
|---|---|---|---|---|---|
| ASCII | 63 | 18+63+26 | **107** | **107** | **0** |
| 中文 | 52（11 中文字符×3+ASCII 段） | 18+52+26 | **96** | **96** | **0** |

（26B=` @`+sentAt 24 字符·sentAt=ISO 串恒长）

**判读**：
- bodyBytes 两拍与发侧 UTF-8 字节面**精确闭合（差=0）**——daemon 收帧侧中文 UTF-8 52B 完整到达·**零字节变形**；
- cp16Hex 前 16 码点=纯 ASCII 段（`[seat-wake probe` 前缀·探针窗设计面 16 码点·中文段 17+ 位未直接探——字节面闭合已足判读）；
- **判读表命中「恒正中文码点（字节面等效）」枝**：fffd 族/GBK 指纹（c4e3 形）零出现=**A 段（daemon 收帧侧）零乱码实锤·B 段反证成立**——乱码位面收敛至 **C 段（harness/claude.exe 读管道解码面）**；
- **候定谳面**：BOD 读信窗对照=ASCII 拍应零乱码/中文拍乱码存（若 BOD 侧读形吻合=C 段坐实）——候 cto 判读定谳+BOD 对照读数（COS 转）。

## §五 · 护栏遵守

单条限流（2 拍=令面双拍并批·连 2 败停护栏未触——两拍皆 200 保持形非败形）✓｜D-46（token 零回显·reason 非密回显照 fsd 载明）✓｜六护栏（在役双证=BOD busy 唤醒旁证+dry-run 族面·BOD 读信窗候 COS 转·信文零动作·--max-time 45）✓｜D-47（真发前现查 20:59:47Z/21:00:03Z·写前 21:00:41Z）✓｜pid 三证双向 ✓｜快照四件照役 ✓｜fade011 零代办 ✓。

## 使用依据

- COS R6 双证拍触发令（①重启窗②改形先行③双拍并批判读表④读数齐报）
- fsd R6-b 施工 498f058（codepoint 探针随件·五门全绿白盒 40/40·COS 信面转呈）+cto 卷 925e6dcb4（-d @file 预案）
- 我 W4-c/W3 系列卷（keeper/重启序先例+终形拍 status 面）·W3-g 判别形 v2 先例（replied=false+保持=候选成功形照役）

—— SDE 小布（m-sde·R6 双证拍收口·快毕节律）·写前现查 2026-11-19T21:00:41Z（+8=2026-11-20 05:00:41·date 现查原值·D-47 正形）
