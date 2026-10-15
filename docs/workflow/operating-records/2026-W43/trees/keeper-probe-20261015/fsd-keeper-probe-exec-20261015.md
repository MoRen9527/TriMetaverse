# FSD 施工毕报 · keeper 隧道活性探活段挂靠件 · 2026-10-15

- sourceOfTruth: 本卷（docs/workflow/operating-records/2026-W43/trees/keeper-probe-20261015/fsd-keeper-probe-exec-20261015.md）
- syncMode: static（单窗毕报）
- lastSyncedAt: 2026-10-15T01:23:28Z（date 现查原值·UtcNow 形）
- 令源: CTO 派工单 4e0becc27（本树 dispatch-cto-fsd.md·CEO 09:09 直跑令链）
- 施工位: FSD 小全（m-fsd）

## 一、挂靠面择定（施工第一步勘验后择一）

**择定 hub-silent-detect.mjs**（patrol 面 ledger-watchlist-patrol.mjs 勘验后弃用）。对照判据（派工单 §二）：

| 判据 | hub-silent-detect | patrol |
| --- | --- | --- |
| 告警链复用度 | sendNotify+notifyOrThrow+state 冷却+三钉契约全现成 | 裸 notify 形·无冷却 state 复用（须新加） |
| 改动面 | 纯追加段 123 行·既有逻辑零改（diff 0 deletions） | 须嵌 state 机+判据耦合 watchlist 语义 |
| 节奏 | 900s·N=2 拍≈发现窗 ~30min（半死窗教训 30min 同量级） | 300s·N=4 才等效·拍数语义变 |
| 语义聚合 | 静默探测/活性巡检同属盲区补探族 | watchlist 候裁到件通知（判据型专用） |

## 二、交付清单

- **commit**: `6c30db21a`（TriMetaverse dev）——`scripts/fade/hub-silent-detect.mjs` 单文件 123 insertions / 0 deletions（纯 additive·既有逻辑零改动）。
- **探活段形态**（main 内 duty-hop 段后·alerts dispatch 前）：
  - 探针 A（HTTP 活体真值·禁只探 TCP）：`GET {KEEPER_URL}`→HTTP 200 且 body.ok!==false，5s AbortController 超时；缺省端点=`http://127.0.0.1:18710/healthz`（勘验钉定：根路径 404，healthz 200 `{"ok":true,"service":"trimc",...}`）。
  - 探针 B（keeper 进程在位）：PowerShell CIM 查 ssh.exe cmdline 含识别串 `18710:127.0.0.1:8712`（实勘 pid 33780 cmdline 钉定·勘验禁猜）；识别串单引号 sanitize 防 PS 注入形。
  - 判定：双探针合取（任一败=连败+1）；连败 N=2 拍防抖才直报；恢复清零（fail/alarm 键 delete）。
  - 告警：复用 duty-escalate 形直报 BOD（targets=[bod]·urgent）零新级别；冷却 30min 照 duty-escalate 形重报节奏；notify 失败不写 alarm state 下拍重试（三钉②）；段内异常只落日志不崩 job（三钉③·EXIT 恒 0）。
- **测试钩子**（FAIL 态模拟构造·护栏 §四① 禁真停 keeper 的正解）：`KEEPER_PROBE_URL`（探针 A 地址覆盖）/`KEEPER_PROBE_FINGERPRINT`（探针 B 识别串覆盖）/`KEEPER_PROBE_DRYRUN=1`（告警只落日志不真发·零扰频）。

## 三、裁量注记（毕报披露）

1. **不走 quiet-hours/tick 豁免**（偏离 duty-cos 静默直报的全形）：keeper 隧道死=基建故障，夜间正是 sg 通知链依赖时段——豁免会造夜间盲区（半死窗教训本身=白天 30min 无人察觉）。级别与直报形态照旧复用，仅豁免面收窄。如 CTO 认夜间也须静默，一行改回（进 alerts 数组走既有豁免分支）。
2. **dry-run 不写 alarm state**：连跑 N 拍每拍出 DRYRUN 证据行（生产形态=写 state 进冷却）。测试面裁量·生产路径不受影响。
3. **探针 B 同步调用**：execFileSync+PS CIM ~1.5s/拍·900s 节奏下可忽略。

## 四、门禁读数（全绿）

| 门禁 | 读数 |
| --- | --- |
| 语法检 | `node --check` SYNTAX-OK（两轮：初版+指纹钩子版） |
| 活态 PASS | EXIT=0；`keeper-tunnel ok (http+proc both up)` 在列；healthy 6→7（改动前 01:15 轮 vs 改动后 01:21 轮对比·恰增 keeper 行=纯 additive 活体证）；零扰频 alerts=0 |
| FAIL 态·A 探针 | 坏口 `127.0.0.1:9`×2 轮 DRYRUN：`fail x1/2 (http=fetch failed) — below debounce`→`DRYRUN keeper-escalate ...连败 2 拍（http=fetch failed）`；state `keeper-tunnel\|fail: 2` |
| FAIL 态·B 探针 | 假识别串 `ZZZ-no-match`×2 轮 DRYRUN：`fail x1/2 (proc=keeper-process-missing)`→`DRYRUN ...（proc=keeper-process-missing）`——零停 keeper 实证 proc-missing 路径 |
| 恢复清零 | 无 override 轮：`keeper recovered (fail state cleared)`+回 ok 行+state keeper 键清空 |
| 回归零弱化 | 整轮既有 6 healthy 行读数逐条照旧（5 条目+duty-cos）；round summary 格式不变；既有 alerts 循环零改动 |
| EXIT 纪律 | 全部构造轮+活态轮 EXIT=0（三钉③） |

- A 探针 FAIL 构造形态恰好复现今晨半死窗机理（keeper 进程在+隧道对端死→A 败 B 过→http=fetch failed）——防抖与告警链对教训形态闭环。

## 五、冷却 71 秒双直报勘验定性（派工单附勘验项·不扩面）

**结论：job 面冷却 30min 生效，「双直报」系 hook 注入面现象，非冷却失效。**
证据链：①detect 日志今晨 01:01:04Z 仅 1 次 `NOTIFIED duty-escalate duty-cos-silent -> [bod]`（其后轮次 healthy）；②notify-mailbox.json duty-cos-silent 信存量=10-13 每 30min 一封序列+今晨仅 1 封（01:01:45Z）——冷却节律铁证；③BOD 会话 09:10:21/09:11:32 两次 prompt 间隔 71s，notify-inject.cjs（UserPromptSubmit hook）对**未读信每轮 prompt 重注入**——同信显示两次=注入面行为。定性毕·零代码改动。

## 六、技术债/限制标记（识别即标记）

1. keeper 告警出向依赖既有 sendNotify 链（TriMLC mailbox 面）——TriMLC 8713 本身死则 keeper 告警同死（探活者自陷盲区·既有架构形态非本段新增；l1 探针 dim1-2 盯 8713 自身活性·双层互补已覆盖）。候 CTO 知会定性。
2. 探针 B 依赖 `ssh.exe` 进程名+识别串形态——keeper 启动方式变更（如改服务化）须同步识别串（env 钩子可覆盖·免改码）。

## 七、候验收

- 双态证据齐（活态 PASS+A/B 双 FAIL 态构造实证）✓
- 既有 silent-detect 回归零弱化 ✓
- 挂靠落定 #140 骑缝①对表：探活段=对 keeper 半死窗盲区的挂靠补盲（BOD 令文基准·18710/8712 双口勘验钉定）✓
- 门禁全过→毕报回 CTO 席验收·转记 COS。

## 使用依据

- CTO 派工单 4e0becc27（dispatch-cto-fsd.md·护栏五条+验收门）
- BOD 令文基准（双探针判据·直跑令链）
- hub-silent-detect.mjs 现役全貌（三钉契约/冷却/quiet-hours+tick 豁免/notifyOrThrow 形）
- keeper 勘验四钉（healthz 端点/识别串/半死窗机理/信箱链路·2026-10-15 实勘）
- notify-inject.cjs+mailbox 读数（冷却勘验证据）
- D-46 值面纪律（本段零 token/header 面·探针全无凭据）·D-47 落款（本卷 lastSyncedAt 现查原值）
