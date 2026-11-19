# CTO W3-h mojibake 第六轮候面勘定卷（乱码层位谱系+判别案两案·候令态非施工）

- sourceOfTruth: 本卷（trees/bod-wake-chain-20261120/·W3-h mojibake 勘定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS W3 线收口定谳转知 04:25+08（台账 747·mojibake 第六轮小修候选候本席勘定面·非阻塞·候 BOD 裁量随窗或并批）
- 判定: **全链 unicode 安全段=daemon 帧构造+harness 解码注入（JSON.stringify/write utf8/parse 全程）——乱码嫌疑集中拍发链（sde→daemon HTTP 段·Windows terminal 中文错位高频家族）**；判别两案铸定候令。

## §一 · 乱码层位谱系（三候选段·unicode 安全性逐段评估）

| 段 | 链路 | 乱码概率 | 依据 |
|---|---|---|---|
| A 拍发段 | sde 会话→curl POST body→8713 daemon HTTP 层 | **最高** | reason=中文（「W3-D PROBE·零动作指令·仅回执」形）经命令行参数/管道——Windows terminal/shell 中文错位家族多案在档（PowerShell→ssh stdin CRLF 族/heredoc stdin 乱码例/嵌套 pwsh 转义族）；curl -d '中文' 在 Git Bash 一般直传 UTF-8，但经 PS 或 tmux 中转即翻车族 |
| B daemon 段 | HTTP body 解析→reasonText→JSON.stringify→conn.write | **低** | bun/node HTTP body→字符串默认 utf8 解码；`JSON.stringify` 全 unicode 安全；`sock.write(string)` 默认 utf8 编码——帧字节流=UTF-8 正形 |
| C harness 段 | data chunk→NDJSON 分帧→toString('utf8')→JSON.parse→Tha/Mse→`<PEER-MESSAGE>` 信封渲染→会话注入 | **低** | 分帧在 Buffer 层找 `\n` 字节（unicode 安全）；parse 后全 JS 字符串操作（Qv/y$t/_rn 构造器）——unicode 透传，无编码转换点 |

**判读**：B/C 两段全链无编码转换点（UTF-8 全程）——若 daemon 收到的 reason 字符串本身已乱（A 段错位），帧内即乱码原文，B/C 忠实透传到 BOD 读信——与观测（正文中文段乱码·结构段完好）吻合。**A 段嫌疑最大**。

## §二 · 判别案两案（候令·一次拍可定谳）

- **R6-a ASCII 对照拍**（零改码·最小成本）：下一拍 reason 纯 ASCII（`[seat-wake probe] round6 ascii-only @<ts>`）→BOD 读信对照。乱码消=**A 段实锤**（源在中文经拍发链）；乱码存=B/C 段（概率低·届时深勘 daemon HTTP 层解码）。可与任意下一拍并批（零额外窗）。
- **R6-b daemon 侧 codepoint 探针**（改码随件·并批可选）：wakeAction 帧构造前对 bodyText 记 `Buffer.byteLength(bodyText,'utf8')`+前 16 codepoint hex 形日志（reason 非密值面·可回显；D-46 照役仅对 token 面）——拍一次即分清「daemon 收到时已乱（A 段）」vs「daemon 发出才乱（B 段）」。建议与 R6-a 同拍双证。

## §三 · 修复面预案（候令不施工）

- R6-a 定谳 A 段→拍发侧正形：reason 写临时 JSON 文件 `curl -d @file`（绕命令行参数/管道编码层——文件写面 UTF-8 无 BOM 直传）——拍发 SOP 一行注记入 sde 真发护栏族；daemon 零改码。
- R6-b 若反证 B 段（低概率）→daemon HTTP body 显式 `Buffer.toString('utf8')` 断言+帧构造侧 `TextEncoder` 探针——届时候勘定卷另铸。
- 非阻塞定位照录：不影响 W3 线收口定谳（投递链全通已坐实）——纯读信质量小修面。

## §四 · 使用依据

- COS 台账 747 转知（BOD 到件回执 04:24:07·直投 accept·六层根因链收官）
- seat-wake-wiring.ts 现役 d62976e 码面（bodyText 构造形+conn.write 形）+claude.exe 破译 De/CJ 信封构造链（W3-g/W3-e 两卷承）
- 本机 shell/terminal 中文错位家族记忆（PowerShell→ssh stdin CRLF/嵌套 pwsh 转义/heredoc stdin 乱码例）

——CTO 小狄（m-cto）·写前现查 2026-11-19T20:26:31Z（+8=2026-11-20 04:26:31·date 现查原值·D-47 正形）
