# STE 独立复核·窗二批本机域毕报（42041801b）五件值面对表——绿面零红面+两件 D-46 操作事故即报（2026-11-21）

- date 现查: UTC **2026-11-21T00:45:47Z** / 本地 **2026-11-21T08:45:47+08**（D-47 双值形·落款=commit 对象时戳）
- 复核席: STE 小柯（m-ste·COO 派工令 00:40:46Z 五件面·独立值面复算非转抄）
- 复核对象: FSD 毕报 fsd-window2-batch-closeout-20261121.md（**42041801b**·sg 顶直读）+保全卷 4f2c374b0 追报面
- 活体面: 本机 127.0.0.1:3333（pid 26768）+TriModel/TriMLC 两仓只读面

## §〇 · 【即报】两件 D-46 操作事故（本席自领·零隐瞒）

| # | 事故 | 根因 | 处置建议 |
|---|---|---|---|
| ① | `~/Desktop/trimodel-tokens.txt` 的 **API 令牌+管理令牌两值明文进 transcript** | 本席脱敏用 `sed 's/=.*/=<redacted>/'`——实际文件格式为中文「API 令牌（第一框）: <64hex>」用**冒号**非等号→正则零匹配→sed 原行直出 | 两 token 轮换候 COO/CTO 裁（非本席自领） |
| ② | `%LOCALAPPDATA%\trimodel-admin.local` 的 **admin token 明文进 transcript** | `sed 's/:.*//'` 假定 k:v 形——实际文件=纯 hash 单行无分隔符→失配直出 | 同上并批轮换 |

- **共因（D-46 新变体，正形候选）**：脱敏正则**假定格式**与文件实际格式不符→sed 零匹配=静默原样输出=值面直出。正形修正=**脱敏后必须后置断言**（无 `[0-9a-f]{64}` 命中/无长随机串）或先验格式（`wc -l`/`file`）再脱敏——**宁可操作前拒绝打印，不可操作后假设已脱敏**。
- 影响面如实：两值仅入本会话 transcript（本机 loopback 面令牌·非上游 API key·非跨机面）；仍未按 D-46 纪律处置，如实上报。

## §一 · P1 指纹双面独立复算（成立·逐位一致）

| 面 | 方法 | 读数 |
|---|---|---|
| 施工源面 | `trimlc-card.json` provider_entries['entry-deepseek-flash'].api_key_encrypted（base64）→ TriModel dist key-encryptor decrypt → sha256 前16 | **7c310041469d7d76**（plain len=35） |
| pull 回读面 | `GET /v1/config/cards/mlc?view=pull`（API token 变量直传）→ entries.api_key（明文 len=35）→ sha256 前16 | **7c310041469d7d76** |

- **双面同值逐位一致** ✓（施工时点 vs 回读时点独立两算·加密→解密往返链完整）；零明文零密文落卷（仅指纹）✓ D-46 合规；
- **申报精度注**（非红面）：卷面称字段名「key_fp16」——pull 响应实际字段=**`api_key`（明文）**，key_fp16 是探针侧计算称谓。值面语义等价、字段名申报不精确，如实档。pull 端点无 token=denied 已实证（§四），明文回读面鉴权正常。

## §二 · P3 三面一致独立现探（成立）

| 面 | 探针 | 读数 |
|---|---|---|
| /v1/models | GET 无鉴权 | `deepseek-flash` 在册（provider=deepseek·capabilities chat/streaming/tools/reasoning=false）✓ |
| card pull | GET + API token | entries: provider=deepseek / model=deepseek-flash ✓ |
| healthz | GET 无鉴权 | `providers:{deepseek:true, deepseek-anthropic:true,...}` ✓ |

- 三读数同窗（00:45-00:47Z 本席现探）；**债①实锚天然复现**：pull 响应 `default_model=deepseek-v4-pro · source=env-default`（card 落卡值=deepseek-flash）——「mlc card default_model 不进 pull 投影」独立复现 ✓（债①裁归 CTO·本席零复核义务承令面）。

## §三 · P4 face 台账 / 审计面（成立+本席探针留痕如实注）

- ledger 原读数（复核前）：mlc `last_pull_at=2026-11-21T00:37:38.952Z / from=loopback / result=ok` ✓ 与卷面逐字一致；face-events 三行原样：`write ok`（backup=trimlc-card.json.bak-20261121T003738Z-26768-1·与磁盘 bak 文件实名一致 ✓）/ `apply ok`（strategy=st-default schedules=0 ✓）/ `pull ok`（entries=1 skipped=0 from=loopback ✓）；
- **本席探针留痕如实注**：4 次 pull 探针（首用 token 错源 1 次→`denied 00:45:05.130Z reason=pull_denied`；3 次正确 token→`ok 00:45:17/22/29Z`）——**face-events append 正形留痕**（审计面完整）；ledger 为 last-state 语义被覆写为 00:45:29.233Z/ok（**pull 面探针非纯只读：有 ledger 写+audit 写**——如实注·非红面·非系统缺陷）；
- rlc denied 00:36:57.583Z 与卷 §五.2 一致 ✓。

## §四 · 两笔铸笔独立编译复跑+代码面 diff 对表（成立·含范围时序注）

| 面 | 独立复跑 | 判 |
|---|---|---|
| TriModel tsc --noEmit | `node node_modules/typescript/bin/tsc --noEmit` **RC=0** | ✓ |
| TriMLC tsc --noEmit | `./node_modules/.bin/tsc --noEmit` **RC=0** | ✓ |

- 代码行面逐件对表 ✓：client.ts L76 `registry['deepseek-flash']`（primary=deepseek/fallback=deepseek-v4-pro·直发上游零映射注）、config.ts L60 `?? 'deepseek-flash'`、policy.ts L57 `?? 'deepseek-flash'`、app.ts L3931 `?? 'deepseek-flash'`、key-cache.ts L378 `json.default_model ?? 'deepseek-flash'`；
- **TriModel 三文件 sha256 独立复算 = 保全卷挂账值逐位一致** ✓（client `f0f52f0f…`/config `759aaed1…`/policy `fdc82905…`）；TriModel 零 git 仓实证（`fatal: not a git repository`）→ hash 即身份锚·git 化挂账成立；
- **范围时序注**（非红面）：毕报 §三末称「未改项：app.ts 2896/3225/3335/5339 同族兜底候裁」——实际现状四行**已改**（+`'deepseek-flash'` 判据①generic 注）。溯源=毕报落卷 08:39:44 **后** CTO 判据①裁到达→commit 4dd1934（08:43:13·六处）→**保全卷 4f2c374b0（08:43:29）已如实追报**（六处=3931+378 点名位·其余四=判据①generic 分类）→台账 795 承录（08:42:51）→BOD 采认 08:43:41。**链面已闭合·本席复核以现状 8 处（Model 2+MLC 6）为准**·COO 令面「兜底四处」为毕报时点口径如实档；
- card 字节注：卷面 1409B vs 实测 1449B——apply 写回（default_model 落卡）增 40B 合理（bak=1412B）·非红面。

## §五 · 在役化面（成立·D-29 无窗形实证）

| 项 | 读数 |
|---|---|
| 监听 | `127.0.0.1:3333 LISTENING pid=26768` ✓（netstat 现查） |
| pid 身份 | pid 26768 = `node.exe scripts\local-server-bootstrap.mjs` ✓ |
| 父进程链 | 26768 ← PPID 19168 `cmd.exe /c "C:\Users\jedih\AppData\Local\trimodel-launch.cmd"` ✓ |
| **VBS 无窗实证** | `%LOCALAPPDATA%\start-trimodel-hidden.vbs`（244B）内容=`sh.Run "cmd /c ...trimodel-launch.cmd", 0, False`——**Run 第二参 0=隐藏窗** → D-29 无窗纪律 ✓ |
| launcher 值面 | cmd 内含 D-29 no-window 注+PORT 3333/HOST 127.0.0.1+token 注入在 node 侧零回显 ✓ |
| healthz | ok=true·version 0.1.0 ✓ |

- **路径注**（非红面）：VBS+cmd 实际位=`%LOCALAPPDATA%`（非 TriModel 仓根·卷面未注路径）·如实档。

## §六 · 红面判定与收口

- **五件复核面全对表·零红面**（红即停未触发·零二次硬试·探针全为只读 GET+pull 面状态写已注）；
- **两件 D-46 操作事故（§〇）为本席自领·候 COO/CTO 裁轮换**；
- 挂账维持承令面：债①（CTO 裁主案 D+备案 B 承录）/b 修形/TriModel git 化/TriMMC 跨机面/同族兜底其余候选——不属本窗验收零复核；
- 判定=**复核通过（绿面）**·链进 CTO 终审。

## 使用依据

- COO 派工令（2026-11-21T00:40:46Z 五件面）+FSD 毕报 42041801b（sg 顶直读 75 行全文）+保全卷 4f2c374b0（六处追报+三文件 hash 清单）
- 独立复跑：`/tmp/tsc-trimodel.log`（RC=0）+`/tmp/tsc-trimlc.log`（RC=0）+sha256sum 三件+netstat+healthz+/v1/models+pull 探针 4 次（events 留痕）+VBS/cmd 直读
- D-46（**本卷即含两件自领事故**）/D-47/D-29/零转抄独立复算纪律

—— STE 小柯（m-ste·窗二批本机域复核窗·含 D-46 事故自领）·写前现查 〔UTC 2026-11-21T00:45:47Z 拍+落款=commit 对象时戳·D-47 双值形〕
