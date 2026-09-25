# STE 手测报告——连接配置页 v2 非作者手测（TASK-TRIMODEL-RECOVERY-LADDER-01 波① 段2 UI 终验收硬门）

- sourceOfTruth: 本件（段2 手测报告正身；读数全部自产）
- syncMode: snapshot
- lastSyncedAt: 2026-09-25T20:18Z（+0800=2026-09-26 04:18，date 现查）
- 执行席: STE 小柯（m-ste）；环境说明正身=同目录 `ste-manual-test-env.md` r2（8429c8e4，FSD 小全备）；派单=CTO 03:4x/勘正知会 03:5x
- 执行方式: playwright-core + 本机 chromium（chromium-1228）真浏览器非作者驱动（真渲染/真点击/真 fetch），API 层按 §3 r2 原文脚本平行验证；服务=3399 临时域钉位（§1.2 四 env），全程零触真活体
- 服务进程史: 3400（段2 主走查）→33200（重启持久性+API_TOKEN 补探）→32152（503 附加行）→18400（§1.2 精确钉位终证）——**均已停，3399 现无监听**（收尾步实测）

## 测试判断

**段2 三要素齐：建议 PASS，候 CTO 收口。** ① 五门 UI 流 12 步全过（含门控保持=本次修复 bug 位的现场验证：写后按钮保持禁用、强点无效、须重预览才解锁）；② 60s 脚本 12/12 ALL PASS（r2 原文逐字执行，墙钟 0.4s）；③ 真活体 hash 前后两读数逐字一致于基线，mtime 未动。追加对表四件全有读数；偏差/观察 6 条全非阻塞（含 2 条说明件口径偏差如实入报候判）。临时域保留候 CTO 复核统一清理。

## 要素① 五门 UI 流清单（§2 逐条实测）

| 门 | 步骤 | 预期要点 | 实测读数 | 判定 |
| --- | --- | --- | --- | --- |
| — | 开 `/ui` 看兜底配置区 | 模板下拉已加载 | 下拉两项：`bigmodel 直连（glm）[可选]`、`deepseek 直连（候批模板）[禁用]`；选 bigmodel 后提示行显示模板自带地址+模型 | ✓ |
| 门② 锁 | 只选模板不填凭据点「预览变更」 | 人话拒先填凭据 | UI 拦截：`请填写 API 密钥`，preview 请求增量=0（UI 侧先拦）；服务端平行验证空钥=HTTP 400 `API 密钥为空或纯空白，已拒绝写入`（键名锁在服务端实证） | ✓ |
| 门③ 凭据健康 | 凭据=PLACEHOLDER / 3 字符 | 人话拒，不进预览 | `检测到占位符（PLACEHOLDER 残留），请输入真实密钥`；3 字符=`API 密钥长度不足（至少 16 位），请核对后重填`；diff 不出、写钮保持禁用 | ✓（注 a） |
| 门④ 预览 | 合法钥+bigmodel 模板点预览 | 出 diff+解锁+零写 | 11 行 diff（BASE_URL/AUTH_TOKEN 掩码为 len=23→len=24/MODEL/FABLE·OPUS·SONNET·HAIKU 全档位×2）；写钮解锁 hint=`预览通过：确认上表变更后点「确认写入」`；settings mtime 未变 | ✓ |
| 门① 备份 | 点「确认写入」 | 成功提示+清空+备份 | `兜底直连已写入（…·glm-5.3-flash）。重启会话后生效。`；钥框清空；备份 0→1（`settings.json.bak-2026-09-25T20-06-38-883Z`，内容=写前原文逐字比 PASS）；文件三组新值+KEEP_ME 保留 | ✓ |
| 门⑤ 掩码+审计 | 开 config-audit.log | 结构化行+全文件零原始钥 | 5 行结构化审计（全文见 §附1）；原始钥全文件零命中；**审计行连掩码形态也不含钥材料**（`detail=keys=11`）——严于说明件口径；尾 4 位形态在复读面实证（`****ghij`） | ✓（注 b） |
| 写后复读 | 刷新 /ui 看当前值 | 地址/模型=模板值+钥只显尾 4 | fb-current=`https://open.bigmodel.cn/api/anthropic / glm-5.3-flash / ****ghij`，无原始钥 | ✓ |
| 门控保持 | 写入成功后立刻再点「写入」 | 保持门控，须重预览 | 写后 disabled=true；hint 复位`写前先预览…`；diff 收起；force click 强点无效+文件零触；重填钥重预览后解锁（须重预览语义成立）——**本次修复 bug 位现场验证过** | ✓ |
| 回滚武装 | 备份清单→选备份→两击回滚 | 恢复写前原文+审计 | 一击武装=`确认回滚`（class=danger）；二击执行=`已回滚到所选备份。重启会话后生效。`；文件恢复 old-model/old.example.com（逐字节）；回滚前自动备份当前态（`bak-…-20-06-44-337Z`）；fb-current 回显 old 值；审计行 `who=ui-rollback`（注 c） | ✓ |
| 401 人话 | 错令牌→预览/写入 | 人话拒+零变化 | `管理令牌不正确或未填写：请先在页头「连接设置」填入管理令牌`；写钮保持禁用；服务端平行=HTTP 401 `令牌不正确或未填写，请检查连接设置`；settings 逐字节不变 | ✓ |
| 503 人话（可选） | 无 TRIMODEL_ADMIN_TOKEN 重启走写链 | 人话拒「管理写面未启用」类 | **实际=HTTP 401** `令牌不正确或未填写，请检查连接设置`（UI 同文案人话拒、写钮门控、文件零触）——状态分支与说明件不符，fail-closed 实质成立（注 d） | △ 实质过·口径偏差 |

**门清单判定：11/11 行实质吻合（其中 2 行带口径偏差注），0 阻塞。**（注 a）门③实际=请求发出、服务端 400 人话拒、不进预览态——说明件「不发请求」措辞与实现分层不符（UI 侧只拦空钥，健康检查在服务端），意图（不健康凭据不进写链）成立。（注 b）说明件「密钥只以尾 4 位形态出现」在审计文件内未出现——审计零钥材料（严于口径）；尾 4 位形态在 GET/复读面实证。（注 c）说明件记「审计行 who=ui-restore」，实测回滚行=`who=ui-rollback`（实质同指 UI 操作者，名差如实入报）。（注 d）见行内。

## 要素② 60s 脚本输出原文（§3 r2 逐字，落盘 `D:\tmp\ste-fb\accept-60s.ps1`）

```
PASS  preview-200
PASS  preview-zero-write
PASS  write-200-message
PASS  write-base-url
PASS  write-9key-family
PASS  get-new-model
PASS  get-masked-key
PASS  get-no-raw-key
PASS  audit-no-raw-key
PASS  unauth-401
PASS  unauth-zero-write

=== 60s ACCEPT: ALL PASS ===
```

注：以上为原样誊录（write-backup-exists 行在原输出位于 write-9key-family 与 get-new-model 之间，亦 PASS）——**12/12 ALL PASS，墙钟 0.4s**，exit=0。

## 要素③ 真活体 hash 前后两读数（§5）

```
PRE-HASH   491F33353D50F938B6B6DFD26CC8C7804500E10BE55AC52CAEBB6E633CD778B2   （起手首步实测；mtime 09/25/2026 04:09:35）
POST-HASH  491F33353D50F938B6B6DFD26CC8C7804500E10BE55AC52CAEBB6E633CD778B2   （收尾停服后实测；mtime 09/25/2026 04:09:35）
```

两读数与基线逐字一致（大小写原样大写），mtime 与参考值合——**真活体零接触红线全程成立**。

## 追加对表四件（CPO 验收窗清单）

| 件 | 读数 |
| --- | --- |
| a) 幂等短路 | 同值重复写入（同钥同模板）：提示=`当前已是指定值（…·glm-5.3-flash），无需重写。重启会话后生效。`；**备份 1→1 无新备份**（already_same 短路实证）；审计记 2 行（`who=ui-preview`+`who=ui-restore` 各一行 `detail=idempotent-short-circuit`——preview/restore 两端点各记其行） |
| b) 一键回滚全链 | 两击武装→恢复写前原文逐字节→fb-current 回显 old 值→审计 `who=ui-rollback`+`pre_rollback_backup=created`（回滚前自动备份当前态）→备份清单日期本地化显示正常——全链通 |
| c) 60 秒切换走查 | 自动化驱动墙钟=21.6s（38 断言全流程含门②③负路径/回滚/401）；纯「选模板→填钥→预览→写入」主路径为其中子集，60s 预算宽裕。**如实注记：本席为席位驱动计时，非人手掐表体感**——「真人手感 60s 内可完成」的产品验收口径候 CEO 窗终验收时顺带体感确认 |
| d) 渲染验证门 | 本手测即载体：真 chromium 渲染、标题/五门区全可见、pageerror=0；干净首启+双令牌正确=console 非零响应**零条**（补探针实证）。主走查 38 断言中 9 条 console.error 全为 `Failed to load resource`（400/401 资源族）——归属=①我方负路径测试的预期拒响应②首启未连接态探针 401③`/v1/config/keys` 401（定性：环境钉位差——§1.2 只钉 ADMIN_TOKEN，生产 daemon 双令牌齐备；补设 TRIMODEL_API_TOKEN 后复探=零非 2xx）。非页面缺陷，五门范围外 |

## 偏差与观察（6 条，全非阻塞）

| # | 级别 | 内容 |
| --- | --- | --- |
| 偏-1 | 口径偏差·候判 | 门③「不发请求」措辞 vs 实现：UI 只拦空钥；placeholder/短钥=服务端 400 人话拒（请求发出但不进预览/写链）。意图成立，措辞与实现分层不符——说明件措辞候 FSD 修或 UI 前置同款校验（体验优化非必需） |
| 偏-2 | 口径偏差·候判 | 503 附加行：无管理令牌时实测 401 人话（非 503「管理写面未启用」）。UI `兜底写入未启用` 分支（index.html L562-563）在本路径不可达。fail-closed 实质成立；503 分支现状=疑似不可达代码或属他配置形态，候 CTO 裁（修文档或修分支） |
| 偏-3 | 口径偏差·候判 | 回滚审计行 `who=ui-rollback`（说明件记 who=ui-restore）；另 who 字段实为端点面衍生物（API 直调 restore 亦记 who=ui-restore，60s 脚本行实证）——非调用方身份。审计完整性不受影响，命名语义候定 |
| 观-1 | 严于口径 | 审计文件零钥材料（连掩码形态都无）；掩码红线（原始钥零命中）PASS，尾 4 位形态在复读/GET 面实证 `****ghij` |
| 观-2 | 观察·低 | 写入链作用域=env.* 11 键统一；顶层 `model`（old-model）与 `permissions` 保留不动——diff 11 行与文件终态一致，与页面说明「全部模型档位统一」语义自洽，录为设计现状 |
| 观-3 | 观察·低 | 幂等短路双审计行（preview+restore 各一行）：一次短路周期两行记录，非重复缺陷；审计粒度语义候统一 |

## 质量门禁评估

- **段2 门禁（CTO 三要素）**：五门清单逐条吻合+60s ALL PASS 原文+hash 双读数合基线——三要素齐，**建议 PASS 候 CTO 收口转 COO 入档**。
- 门控保持（本次修复 bug 位）现场验证成立：成功路径不自动恢复按钮、须重预览再写。
- 偏差 3 条+观察 3 条全非阻塞，随报告候裁；无阻塞缺陷、无红线接触。
- 临时域 `D:\tmp\ste-fb\` 保留（含脚本/审计/备份/截图 shots/四代服务日志），候 CTO 复核后统一清理；服务器已全停（3399 无监听实测）。

## 使用依据

- 环境说明正身: 同目录 `ste-manual-test-env.md` r2（8429c8e4）——红线/钉位/五门/60s 脚本/重启分层/hash 命令全按件执行
- 被测: `D:\Code\ai\TriModel` 现役工作树（连接配置页 v2 波① 交付；`ui/index.html` #fb-zone 区+处理器 L465-639 实勘；服务四轮起停全走 §1.2 钉位）
- 证据留痕: `D:\tmp\ste-fb\`（ui-walk.cjs 38 断言全文/accept-60s.ps1/config-audit.log 5 行/备份 3 件/settings 终态/shots 截图 3 帧/boot-probe 系列探针）——候 CTO 复核
- 派单与勘正: CTO 03:4x 派工令+03:5x r2 勘正知会（三输入请求体/四 env 钉位，本席起手即按 r2）
