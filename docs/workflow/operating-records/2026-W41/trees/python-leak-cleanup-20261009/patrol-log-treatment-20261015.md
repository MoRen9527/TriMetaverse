# BOD-BlackFormatterLeakPatrol log 治理汇总卷+退役判据立条 · 2026-10-15

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W41/trees/python-leak-cleanup-20261009/patrol-log-treatment-20261015.md）
- syncMode: static（治理定格卷·增量读数面见 §五）
- lastSyncedAt: 2026-10-15T09:19:28+08:00（date 现查原值·D-47 正形 A）
- 令源: CEO 2026-10-15 09:09 直跑令（BOD 白名单检查毕转直跑·两件即起不等窗）；修正案=CEO 10-14 19:17 批「保留·按修正案走」
- owner: COS（board 仓卫生域）·schtasks 任务属主=BOD（代起资产·本批未动任务 XML 与 launcher 路径）

## 一、对象盘面（2026-10-15 09:11 现查读数）

- 位置：本树目录单点（docs/workflow/operating-records/2026-W41/trees/python-leak-cleanup-20261009/）
- 总量：139 卷=2 已追踪样例+137 未追踪·总 363,181 bytes·跨 2026-10-09→10-15
- 生成机制：schtasks BOD-BlackFormatterLeakPatrol（PT30M·:08/:38·wscript→pwsh -File cleanup-blackformatter-leak.ps1）每运行写 cleanup-result-HHmmss.log 于 $PSScriptRoot（仓内硬编码）——137 未追踪卷即此堆积
- 未追踪卷无 git 历史=删除不可逆——按④类护栏自检：本卷（留样+汇总读数）先落再删+删后 manifest 断言（§三）

## 二、留样与汇总读数（留样原则兑现）

- 留样（已追踪·git 历史在）：cleanup-result-010646.log（首杀 54 PID 满窗样本）+cleanup-result-010701.log（11 PID 次卷）——格式族唯一（清理回卷四行式），两卷足为代表样
- 每日合计读数（提取法=逐卷首行内容时戳+「击杀成功」计数行；内容时戳与 mtime 跨午夜卷存在 ±2 容差，以内容时戳为准）：

| 日 | runs | 击杀合计 |
| --- | --- | --- |
| 10-09 | 23 | 188 |
| 10-10 | 18 | 126 |
| 10-11 | 19 | 154 |
| 10-12 | 13 | 104 |
| 10-13 | 25 | 236 |
| 10-14 | 40 | 267 |
| 10-15（至 09:1x） | 1 | 1 |

- 零击杀 run 记录：10-10 2 卷/10-13 3 卷——**零击杀日无**
- 机理注：再生源=VS Code 主进程秒级重启 black-formatter LSP（首笔 c9b5dd5b7 原注），杀进程治标——每日均有击杀即再生源未止息

## 三、处置（三选或并施→并施）

1. **存量**：本卷落盘 commit 后删 137 未追踪卷（manifest=git ls-files --others 面该目录 cleanup-result-*.log 全集·删后断言 untracked=0+追踪 2 卷原样）
2. **增量并施（脚本两改·任务 XML 未动·launcher 路径未变）**：
   - 挪出仓：log 输出 $PSScriptRoot → %LOCALAPPDATA%\TriCompany\patrol\black-formatter（仓树零新增）
   - 轮转上限：脚本启动面清 7 天前旧卷；卷名加固 HHmmss → yyyyMMdd-HHmmss（防跨日同时刻覆盖）
   - 修订留痕=脚本头注+本节；BOD 属主面如判不妥可整体回滚（锚=本仓 git log 本文件邻笔）

## 四、退役判据立条（件②）

- **判据：连续 N=7 个自然日（+08 时区）全卷击杀成功合计=0（零击杀日）→ 触发退役评估**
- 零击杀日定义：当日全部回卷 log（读数面 §五）击杀成功合计=0；当日无 run（如电池禁跑 DisallowStartIfOnBatteries）=读数缺失→连续窗中断重计（保守侧）
- 评估动作：退役评估由 BOD 主持（任务属主）——含再生源复扫（black-formatter 进程活性+VS Code 扩展面）确认泄漏源止息→schtasks 停用+launcher/脚本归档注记；评估不通过=判据窗重计
- 基线：判据窗未起算（截至 10-15 每日击杀均>0）——首日候选自首个零击杀日起算
- 催办：COS 大表挂观察行·催办链按周检视读数面；连续零击杀≥4 日时升挂候评估催办

## 五、增量读数面（判据日常读数锚）

- 新落点：%LOCALAPPDATA%\TriCompany\patrol\black-formatter\cleanup-result-*.log（yyyyMMdd-HHmmss 命名·7 天滚动）
- 迁移切换锚：脚本修订 commit 后首个 run（预计 10-15 09:38 run）即落新址——验证=新址首卷存在+本树目录零新增
- 本树目录自本卷起为冻结历史（存量读数以 §二 为准·不再新增）
