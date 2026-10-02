# STE·R-HY 401 修复窗回归复验卷（Rider 复验+D-04 主锚独立复测+卷面核验）

- sourceOfTruth: 本件（STE 修复窗复验卷；验证对象=TC 5701212 triladder.ps1 后态+FSD 施工卷 fsd-401-fix-completion-readout-20261003.md 93L/3a6c5a9e）
- syncMode: static（复验毕；三块全绿零阻塞，候 COO 收口面）
- lastSyncedAt: 2026-10-02T19:23:50Z（date 现查）
- 复验席: STE 小柯（m-ste）；令源=COO 03:1x 复验令（Rider 复验/主锚只读复测/卷面核验三块+禁区照件①惯例）
- 沙箱: %TEMP%/ste-rhy-verify-yRjr6Vu1（Rider① 三形自沙箱副本执行；工具目录零净写，TC 工作树复测前后零新增——git status 仅 README.md/restore-claude-config.ps1 两件 FSD 在途 M 态原样）

## 一、测试判断

修复窗施工（a 项七步+Rider①②）**复验通过（PASS）**：Rider① 前置修沙箱三形全命中、Rider② 头注纯注零代码动、D-04 主锚三条 ok 逐戳独立复现+denied 链终绝零新增、施工卷可独立复核锚全部吻合。无阻塞性缺陷，一条观察项（非缺陷）备查。

## 二、三块复验读数

### 块 1：Rider 复验（triladder.ps1@5701212）

**静态面（diff 核）**：

- Rider①：Test-Path bak 存在性断言前置于 JSON 校验之前 ✓（原位置行删除，新位置在 `$isJson` 判断前、BodGate 门后——门序无回归）；专文案 `bak 文件不存在`+rejected exit 1 保留 ✓
- Rider②：a1 shutdown 头注两行补注在位 ✓——语义对表裁卷 3c0a2753 口径两点全落：①「shutdown 头默认 Authorization Bearer=daemon 门内建 fallback 实际可达」（本席上窗已独立复核 extractInternalToken Bearer fallback TriMLC L138-139 在目）②「daemon 认证门收紧时须显式传 -TokenHeader X-Internal-Token」；diff 确认纯注释行、代码行为零动 ✓
- diff 计数 6+/1-（+2 头注/+3 Rider① 注释与 Test-Path/-1 原 Test-Path 行）与 COO 令口径一致 ✓

**动态面（沙箱三形，triladder@5701212 副本）**：

| 形 | bak 面 | 读数（exit/result/why） | 判 |
| --- | --- | --- | --- |
| R1-json-bak-missing（=件① A3-5 回归形） | .json 不存在 | 1/rejected/**「bak 文件不存在」** | ✓ 专文案命中，不再误报「bak JSON 校验失败」——发现项②修毕实证 |
| R1-ctrl-badjson（=件① A3-2 回归形） | .json 坏 JSON | 1/rejected/「bak JSON 校验失败（回滚前置门）: …Unexpected character…」 | ✓ JSON 校验门无回归，前置修未误伤 |
| R1-ctrl-nonjson-missing（对照形） | 非 json 不存在 | 1/rejected/「bak 文件不存在」 | ✓ 非 json 缺失同专文案 |

（读数取自 python subprocess+GBK 解码管道——pwsh stdout 重定向走系统 OEM codepage，UTF-8 直解成乱码系管道编码形非脚本缺陷，同族件① A2-5 备查条。）

### 块 2：D-04 主锚独立复测（只读）

- **face-events face=mlc pull 现值面**（R-HY /srv/fleet/trimodel-data/face-events.jsonl，root@R-HY alias 只读）：mlc 行 ok_total=3 / denied_total=97；**三条 ok 时戳与施工卷步 7 逐戳全同**：18:57:05.874Z / 18:57:33.708Z / 19:12:33.729Z（detail=`pull served, card absent`）✓
- **denied 零新增**：最后 denied=**18:49:26.304Z**（`pull auth rejected`）——与施工卷口径全同，其后 mlc 面全 ok，denied-92 链终绝独立复现 ✓（denied_total=97 与勘验卷「92」差系勘验卷时点后 18:34/18:49 等修复前继续累积，以最后 denied 时戳为锚不受行数口径影响）
- **回滚锚面核**：`trimlc-daemon-channel.cmd.bak-20261003-0252` = **3992B 在位** ✓（与施工卷步 1 一致）；清理时点=10-04 03:00 后（+24h 观察期），本席复验未动手 ✓
- ok 持续性：3 连 ok 跨 15min 间隔（poller 网格重启重算周期形），复验时点（19:26Z）第四条未到期——观察项见 §四

### 块 3：卷面核验（七步读数逐条对照，独立可复核锚抽验）

| 施工卷读数 | 本席独立复核 | 判 |
| --- | --- | --- |
| 步 0-1/步 6 pid 链（22556→stop 02:54:19→新 pid 51600） | netstat 8713 现行 LISTENING pid=**51600**+tasklist node.exe 51600 活体在位 | ✓ |
| 步 6 watchdog 自然拉起（02:57:04 reviving） | watchdog.log 原行=`2026-10-03T02:57:04.0617551+08:00 DOWN (fail 1/3) -> reviving via trimlc-daemon-channel.cmd`（逐字吻合，自然形态非 stand-down） | ✓ |
| 步 3/4 CR 基线 38=38 | 现行 channel.cmd 行数=38/CR 计数=38 | ✓ |
| 步 4 四对表（邻行零扰动） | 四键指纹现值逐键全同：L10 TRIMC_INTERNAL_TOKEN 4842..4aa5 / **L11 TRIMODEL_API_TOKEN len=64 3608..cee7（=R-HY 权威值，同步已落）** / L15 TRILC_INTERNAL_TOKEN 0641..5693 / L17 TRIMC_NOTIFY_SG_TOKEN 4842..4aa5 | ✓ |
| 禁区九条声明 | 卷面九条在位；其中 #4 CRLF/ #8 四对表已独立复现，#2 值面零出机全卷抽验（全卷指纹形 len+head4+tail4，零 64 位全值零管道回显） | ✓ |
| Rider①② 落实注记 | 与 5701212 实际 diff 对表一致；restore 38 行在途 diff 零卷入（git status 两件 M 态原样） | ✓ |
| 步 5 剥启动行探针/步 2 管道取值 | 卷面指纹形自洽（3608..cee7 与 L11 现值全同互证）；过程性动作不可重放，以文件面现值+主锚端到端为锚 | ✓（方法学对表） |
| b 项四步（sg 对照勘） | 非本令复验面（COO 令三块未含 sg 复测）；卷面逻辑对表：分支②双机形态自洽+b3 附录空值键占位勘误注（键名扫描须补值面 len 断言）与 b1→b1' 自纠链一致 | ✓（卷面对表） |

## 三、发现项（零阻塞）

1. **观察项（非缺陷）**：ok 持续性当前读数=3 连 ok（末条 19:12:33.729Z）；poller 周期 15min28s 网格重算，第四条 ok 预计 ~19:28Z——本卷 19:23Z 签发时点未候第四条。3 连+零新增 denied 已满足复验判据；如需更强持续性锚可在 19:30Z 后补看第四条 ok（候 COO 裁是否必要）。
2. **（验证侧方法学备查，非施工缺陷）**：pwsh 子进程 stdout 经管道重定向按系统 OEM codepage 编码中文——python 直解 UTF-8 成乱码，GBK 解码修复；同族件① A2-5 备查条（pwsh 管道读 git show GBK 坑），两案合并指认同族根因=[Console]::OutputEncoding 非 UTF-8 形。

## 四、验收锚对表

| COO 复验令三块 | 读数 |
| --- | --- |
| ①Rider 复验 | Rider① 静态+沙箱三形全过（专文案/无回归/门序）；Rider② 头注在位+语义对表裁卷口径+零代码动 |
| ②D-04 主锚独立复测（只读） | 三条 ok 逐戳复现+denied 零新增（末条 18:49:26.304Z）+bak 3992B 在位未动 |
| ③卷面核验 | 七步可独立复核锚全吻合（pid 51600/watchdog 原行/CR 38=38/四对表四键/禁区九条/Rider 对表）；不可重放过程性锚以文件面现值+端到端主锚互证 |
| 纪律 | 零转抄（全部独立复测）；零写面（沙箱测试件+R-HY 只读+回滚锚未动）；零敏感值出机（全指纹形）；毕报先写后报 |

## 五、使用依据

- COO 03:1x 复验令（三块+禁区照件①惯例）
- FSD 施工卷 `fsd-401-fix-completion-readout-20261003.md`（93L/3a6c5a9e，对表用，读数未转抄）
- CTO 裁卷 `bod-pipeline-batch-15/cto-finding1-header-verdict-20261003.md`（3c0a2753，Rider② 语义对表基准）+CTO 审定单 `trees/rhy-401-key-audit/cto-401-fix-procedure-review-20261003.md`（b6e6db9f，禁区九条）
- 实锚码位：triladder.ps1@5701212（diff+沙箱三形）；TriMLC app.ts L138-139（Bearer fallback，上窗独立复核）；R-HY face-events.jsonl mlc 行原文（root@R-HY alias 只读）
- 沙箱证据：%TEMP%/ste-rhy-verify-yRjr6Vu1（三形 RESULT 原文+fixture 件）
