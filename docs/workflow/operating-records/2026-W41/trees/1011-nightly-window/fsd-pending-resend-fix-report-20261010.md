# FSD 毕报 · l1/l2 pending 重发修复（BOD 11:47 准修即做令·CTO 11:46 APPROVE 两微调）

- sourceOfTruth: 本件（trees/1011-nightly-window/fsd-pending-resend-fix-report-20261010.md）
- syncMode: static（毕报卷·落盘即锚）
- lastSyncedAt: 2026-10-10T11:52:34+08（date 现查原值）
- 执行位: FSD 小全（m-fsd）
- 令源链: BOD 11:47 裁①（准修·即做·一行强转+耦合清双陈旧 pending·红线=R-HY l1 判定面本体 43a41b63 面零触碰·改前备份·毕报两刻）+ CTO 11:46 APPROVE 两微调（(a) catch 落 HTTP status 升必做+pending-fail 计数 (b) 清队留日志行）+验证门两条（构造 pending 一发实测 200 / 清队+新鲜路径回归零影响）

## 一、结论

**pending 重发修复毕·验证门两条全过：①构造 pending 实发 `PENDING-RESENT ok` 200（03:51:47Z·文件清+零计数残留）②清队归档+新鲜告警路径回归零影响（负验证双绿+生产轮 03:50:03Z 新代码双绿零 PENDING）。三件变更面（l1/l2 部署拷贝+l2 staged 正身）语法门 errors=0。红线对表：R-HY `tri-liveness-l1-rhy.sh` 零触碰。**

## 二、变更清单（三面同步·防重部署回滚雷）

| 面 | 变更 | 锚 |
|---|---|---|
| `%LOCALAPPDATA%\tri-liveness-l1.ps1`（部署拷贝） | 重发块 3 处：`$pt=[string]$pl[0]` 强转剥 ETS 注记 / ok 行清 `l1-pendingfail.count` / catch 行落 `status=$sc`+fail 计数 `#N` | 备份 `.bak-pre-pendingfix-20261010` md5 `7da6f90e` |
| `%LOCALAPPDATA%\tri-liveness-l2.ps1`（部署拷贝） | 同构 3 处（l2-pendingfail.count） | 备份 `.bak-pre-pendingfix-20261010` md5 `c2c54945` |
| `TriMetaverse/scripts/ops-local/tri-liveness-l2.post-lg066-seg2.ps1`（staged 正身） | 同构 3 处同步——staged 位=将来重部署源，只改部署拷贝会把 bug 带回（本批主动对齐） | 仓内 commit（本批） |

- 回滚锚：部署拷贝=`cp -p .bak-pre-pendingfix-20261010` 回（md5 双录）；staged 正身=git revert 本批 commit。
- l1 无 staged 正身（部署拷贝即唯一面·Glob 实勘）。

## 三、清队执行（CTO 微调 b·耦合必做）

- **时序防误发**：先清 pending（move 归档）→ 后改脚本——任何时刻跑到都不会带陈旧内容。
- `stale-pending-archive-20261010/`：l1-pending.txt（173B·10-07 heartbeat stale·已恢复）/l2-pending.txt（830B·01:40 旧拓扑 relay·已恢复）——move 非直删零信息丢失。
- 清队日志行双落（l1.log/l2.log `MANUAL-CLEAR ... archived ... both recovered` 03:49:19Z）。

## 四、验证读数

| 门 | 读数 | 判 |
|---|---|---|
| 语法门 | PSParser 三件 errors=0×3（5.1 净化 PSModulePath 环境） | PASS |
| 负验证（清队+新鲜路径回归） | 手动轮 l1 `OK all-dims`（03:51:19Z）/l2 `OK all-hosts`（03:51:23Z）·零 PENDING 行·归档位外无散件 | PASS |
| 正验证（CTO 门①） | 构造 DIAG 标注测试 pending→5.1 同任务环境跑 l1→`PENDING-RESENT ok`（03:51:47Z）+pending 文件清+零 failcount 残留；m-duty-cos 信箱落一条显式 DIAG 验证信=预期产物（H3 探针先例） | PASS |
| 生产轮复证 | 03:50:03Z cron 生产轮=新代码首轮，l1/l2 双绿零 PENDING | PASS |

## 五、技术债务标记（如实）

1. **catch-status 落值路径无负向实测**：fail 分支新增 `status=$sc` 逻辑仅语法门+代码面同构验证，未构造必败场景实测（避免再造信箱噪音）——下次真 fail 时 log 自然出 `status=400/401/空`（连接失败类 Response=$null→status 空=区分 HTTP 拒与链路断，正是观测目的）。
2. **族并档注记（候 CAO 随卷）**：PS 5.1 `ConvertTo-Json` 序列化 `Get-Content` ETS 注记属性（PSPath/PSDrive/ReadCount 系）毁 payload=截断/引号/BOM/CRLF 后**第五变体（中间层隐式变形+静默失败族·CTO 11:46 认并档·其并记忆条）**；共同根式与识别信号见既有族条。
3. pending 通道三天静默失效（10-07→10-10）的观测缺口已由 catch-status+fail 计数补（CTO 微调 a 动机），failcount 文件可作快速读数位。

## 六、使用依据

- BOD 11:47 裁令+CTO 11:46 APPROVE 回执（两微调+验证门两条）·毕报根因诊断链=fsd-l1-judgment-refresh-report-20261010.md §五（抓包 1044B/288B 实锚）
- 抓包/复刻取证件：`%TEMP%\fsd-resend-diag.ps1`·`fsd-cap-listen.ps1`·`fsd-cap-client.ps1`·`fsd-capture.txt`（token 捕获面已脱敏）
