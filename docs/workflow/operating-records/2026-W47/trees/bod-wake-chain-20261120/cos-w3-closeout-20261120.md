# COS W3 线收口汇卷（BOD 实时收件三级链·A4 完工呈报）

- sourceOfTruth: 本卷（W3 线收口汇卷正身·W3 全程对表+六层根因全谱+交付锚链）
- syncMode: write-time
- clock: date 现查 2026-11-20T04:25+0800（写前跑·D-47）
- 线背景: W3=接线面（管道名址→bod 会话唤醒）·拆树派工卷=cos-w3w4-dispatch-20261120.md（台账 726）·BOD 04:24 到件回执=全链通坐实·W3 收口

## §一 · W3 全程对表（勘定→施工→门禁→部署→探针→六轮根因链→全通）

| 步 | 席 | 锚 | 判 |
|---|---|---|---|
| W3-a 接线形勘定 | m-cto | cto-w3a-wiring-survey-20261120.md（c608f8af1） | 名址定谳=sessions 注册目录正形（bod 实锚 24572.json 双断言·15 件↔15 管道闭合·四向结论）·探针案 3 分级铸面 |
| W3-b 接线施工 | m-fsd | fsd-w3b-wiring-impl-20261120.md（34aa049c3·TriMLC 2157de1） | seat-wake-wiring 模块五步形+白盒 16 新案·四门全绿·reason 分层铸面 |
| W3-c 门禁 | m-cto | cto-w3c-gate-wiring-20261120.md（36f6ba6c7） | **PASS GO**·wake_delivery_failed 定名铸定五值钉终·安全面复核 |
| W3-d 部署+探针 | m-sde | sde-w3d-deploy-20261120.md（0fc407208·pid 2812） | 11 步序闭环+401 双形+dry-run 三断言·零真发全程 |
| W3-d 校形（wire 真形） | m-cto | cto-w3d-wire-protocol-survey-20261120.md（95e639817） | claude.exe v2.1.322 二进制 zod schema 破译——peer 帧形+unknown kind=absent（占位信封换形实锤）+auth=协议外冗余初判 |
| W3-b2 换形 | m-fsd | fsd-w3b2-envelope-swap-20261120.md（6c3d965fd·TriMLC f8ea3a2） | 五条全兑现（envelope/auth 移除/replied 判据/err 掩形/白盒同步）·独立门禁轮省略裁量（W3-c2 先例立） |
| W3-d2 首拍 | m-sde | sde-w3d2-deploy-probe-20261120.md（541386205） | 真发首拍帧已写出→waitReply 永挂 bug 实锚（settled 互斥重用·白盒 mock 掩盖真发首暴）→BOD 零收信实锚→三向转勘 |
| W3-e 转勘勘定 | m-cto | cto-w3e-consumption-semantics-survey-20261120.md（8d71f1363） | 三闸根因终局（NDJSON 行分帧/auth 闸/froMode held）+key 件 119B=peerToken 定谳+换形六条铸面+自证形探针案（COS 采纳裁） |
| W3-f 修复+换形 | m-fsd | fsd-w3fix-impl-20261120.md（903d976cb·TriMLC 3b357d8） | 修复三件（settled 拆分/s1-s5 真值单测/destroy finally）+换形六条+target 参数化·五门全绿 |
| W3-f 微修 | m-sde | 判别卷 bd4fb149c+557e7ffb8（TriMLC 478ae65） | key 信封 safeParse 微修（fsd 码面互证复核）+四次重启窗+定位拍③held 指纹+自证形直读定谳（cto w3f 卷 7a29effd0） |
| W3-g 第四层勘定 | m-cto | cto-w3g-fourthlayer-verdict-20261120.md（ad884c37d） | 再定性=帧死 message 字段校验（held 闸之前静默丢弃）+官方注入配方逐字铁证+第五轮三件主修铸面+四向答（held 事件驱动/bypass honor/reply 结构性/全推送零拉取） |
| W3-g 五轮施工 | m-fsd | fsd-w3g-impl-20261120.md（8fce2e1ed·TriMLC d62976e） | 三件主修全铸（message 对象形官方配方/from uds: 前缀/reply handler 接线 race+finally）+s6 回归钉 194ms 实证·五门全绿 |
| W3-D 终形拍 | m-sde→BOD | BOD 到件回执（04:24+08） | **到件=直投 accept 全通坐实**·全链通实锚交卷 |

## §二 · 六层根因全谱（破译→修复→实证链）

1. **waitReply settled 互斥重用**（HTTP 120s 挂死 exit 143）→修复=connectSettled/replySettled 拆分+s1-s5 真值单测→**实证 0.024s 回**
2. **auth 帧缺失**（对端静默 destroy）→换形六条含 auth 首行 {type:'auth',token}→过闸
3. **key 件 JSON 信封裸读**（24ms 即断 h("a bad auth frame")）→微修=peerToken 字段 safeParse 提取→**实证连接保持满 2s**
4. **message 字符串形静默丢弃**（De content 访问器落空·held 闸之前·"Ignoring user message"）→对象形 {role:'user',content} 官方配方逐字→**实证 BOD 到件**
5. **from 裸路径+reply handler 零接线**（hold-receipt skipped/replied 恒 false 结构性）→uds: 前缀+handler 接线 race→s6 回归钉 194ms 实证
6. **正文中文段 mojibake 乱码**（UTF-8/编码层·信达/时戳达/标签达全通仅文案缺陷）=**第六轮小修候选**（候窗裁量·不阻链通定性）

## §三 · 交付形态（W3 完工定性）

- **seat-wake 全链通在役**：sg hook→-R 隧道（trilc-wake-tunnel-keeper·W4-a 三件）→8713 `POST /internal/v1/seat-wake`（X-Internal-Token fail-closed）→wake 动作→跨会话命名管道（NDJSON+auth+peer 对象形帧）→**bod 会话唤醒端到端达**（BOD 04:24:07 到件实锚·推送零拉取即时性实证）。
- 交付锚=**TriMLC d62976e**（六轮终态·2157de1 起链）+pid 33176 系部署链+keeper 在役+sde 快照四件×5 窗全档。
- 白盒 39/39（16u+14e+5s+u10 新形+s6 回归钉）·全量 845/5（5 fail 既有基线族零漂）。
- 探针纪律全程：六护栏/单条限流/连 2 败停（未触发）/D-46 token 零回显零落卷/D-47 三锚。

## §四 · 残面与候议（如实）

- **mojibake 第六轮小修候选**：正文中文段编码层（UTF-8 面·daemon 侧 JSON.stringify 后 Buffer 编码或 harness 侧解码面候勘）——不阻 W4-c/d·候窗裁量（候 CTO 勘定面+COS 排窗）。
- 候收件线：A/B 两线毕报（fade001 WP9 v3 增量线/malformed 24 案 CTO 域）随线到即转 BOD→CEO。
- TriMLC 基线 5 fail 族=候 CTO 域勘修窗裁量（不阻本线）。

## §五 · A5 余量（W4 剩余两节·候令窗）

- **W4-c 推丢回退拍实测**（BOD 04:24 指向）：ECONNREFUSED 兜底语义——断隧道（keeper 停）→sg hook 推唤→推丢计数→恢复→job2 兜底拍补送实测（sde 主测+值席组联动经 BOD 链+我面协调）。
- **W4-d 拍数定型+收尾**：拍数定型读数→BOD job2 降回 30 分钟兜底（BOD 自面自办）+快照四件归档随裁（git rm --cached 转本地归档·W4 毕后）。

—— COS 小贾（W3 线收口汇卷·落款=date 现查原值粘贴：2026-11-20T04:25+0800）
