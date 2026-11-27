# CTO 收口卷·席位启动器三件（令牌重建／关旧标签页／读表入口）+ D-102 机械闸可测版（2026-11-28）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-seat-launcher-closeout-20261128.md·收口正身）
- syncMode: write-time
- lastSyncedAt: 2026-11-27T17:35:54Z
- 令源: CEO 2026-11-27 23:30（env 同步+滚动重启·BOD 授权）／CEO 2026-11-28 00:07（重启须关旧窗令·BOD 转）／CEO 2026-11-28 00:35（纪律逃逸→机械拦截联动·D-102）
- 分工: SDE 施工·CTO 审核+验收·BOD 代执滚动重启

## §一 · 结果（验收读数·2026-11-28 01:21 现查）

| # | 读数 | 值 |
|---|---|---|
| 1 | 14 席启动器日志行（`.fade/seat-env-sync.log`） | 14 席各有·共 17 行·**全部** `envSha8=b6f72424 srcSha8=b6f72424 match=true staleBefore=true` |
| 2 | 信箱文件写入时刻 | `23:32:48 → 00:57:44 → 01:20:49 → 01:35:43` 持续前移（此前停摆约 85 分钟） |
| 3 | bod 未读 | `95 → 75 → 55 → 35`（各席 hook 批量标读） |
| 4 | 档位 argv | opus×5（cao/coo/cos/cpo/cto）+ sonnet×9·expectSource=table |
| 5 | 旧标签页 | 每席 OpenConsole 14→13·终态 14=14 席·零残留旧窗 |
| 6 | 独立见证 | m-sde／m-cto 新进程内令牌指纹=`b6f72424`（sha256 前 8 位·零值回显） |

承载：TriCompany e5c9434（启动器三件终版）·`.fade` 部署位六件与真源正文一致（去同步横幅去 BOM 独立 diff）。

## §二 · 根因与修法

- **根因**：新进程的 env 继承自父链（终端主进程／调用方工具进程），不重读注册表——「env 同步后重启即生效」不成立；14 席重启后令牌仍旧值，hook 标读 401 静默跳过。
- **修法**：启动器在调用 claude 前显式从权威源（注册表 User）重建 `TRILC_INTERNAL_TOKEN`（fail-open 带告警·不挡起席）并落指纹日志行；restart 件以「拉起时刻」为锚消费该行（match=true=写入后值等于源）。
- **关旧标签页**：对启动器壳 pwsh `TerminateProcess(h, 0)`（指定退出码 0）→ 终端默认设置下自动关 tab；判据=终端主进程下 OpenConsole 子进程数 N→N−1。
- **读表入口**：restart 件须 pwsh7（PSEdition 自检拒跑）；期望档来源≠查表=fail-closed。

## §三 · 审核拦下的问题（四轮返修·均发生在真席位之前）

1. 日志行 match 语义反了（取写入前值=父链旧值席必 false→再滚逐席假红）。
2. 向旧 tab 注入 exit 的机制不成立（一次性目标 6 场景全不退·含 cmd 目标）→改指定退出码终止。
3. 杀旧与拉起之间非 fail-open（关窗步异常=席已杀未拉起且停机旗在位）→状态变量+末尾统一判。
4. 「tab 未关」红退写在 try 内被自家 catch 吞（EAP=Stop 下 Write-Error 即异常）→实际 rc=0 不停滚。
5. 退出码旁证假读（单 TERMINATE 句柄调 GetExitCodeProcess=ACCESS_DENIED·读 4294967295·真实 0）→双句柄+等待后读。
6. 调了未声明的方法（WaitForSingleObject）→每席 rc=3 假红。
7. 日志行时间锚取 claude 进程时刻（启动器扫历史会话实测 47.9s）→每席必假红→改锚拉起时刻。
8. 部署位两轮未同步（`.fade` 副本停在旧版）。

## §四 · D-102 机械闸可测版（未挂载）

- TriCompany 911b729：`scripts/ops/gate/d100-tool-entry-gate.mjs`（自测 23 案）、`d101-denied-retry-gate.mjs`（自测 17 案·对本席 455MB 真实会话记录冷启动首调 753ms 命中今晚实锚形）。
- TMV 4f0390c4f：`.claude/hooks/d100-gate-hook.mjs`、`d101-gate-hook.mjs`（wrapper·自测+端到端全过）。**settings.json 未改**。
- 规则：D-100=Bash 内嵌 Windows PowerShell 5.1 拦截·唯一豁免=命令自带干净模块路径（正确性条件非口令）；D-101=被拒目标同路径（祖先后代）的换形拦+有被拒记录的破坏性调用告警·语义等价=纪律层终态；只读本会话自己的记录。
- 模式：首轮 observe（闸内常量·切换走受审提交）。代价：Bash 调用 +0.31s（两 wrapper 实测 161+150ms）。
- **挂载（项目 settings hooks）须 CEO 直接确认**——已报 BOD（msg 4f8d19e6）与 CAO。
- **v1.1（CAO 独立重测 01:51 抓出缺口后全补·TriCompany 9fb5171·挂载用此版）**：命令内 cd 跟踪；Bash 内嵌 pwsh|powershell -Command/-EncodedCommand、cmd /c、bash -c、eval、解释器 -c 内串递归判定；`[System.IO.*]::Delete`；`find -delete`/`-exec rm`；管道上游 `gci|Remove-Item`；状态件不落命令原文与续行缓存；Write/Edit 只走 L1（消噪音）；D-100 补 Python 列表形与 `find -exec powershell`。自测 D-100 30 案·D-101 34 案全过。**v1 不设本席放行形**（transcript 内用户亲手输入与席间注入消息难以可靠区分）——放行=走审批流后由设闸人一侧执行。
- **v1.2（TriCompany ccd3502·CAO 复测二抓出 shell 组语法零留痕族）**：`( ) { } $( )` 反引号、then/do/else/!/time/function 关键字、`env -i`、`cmd //c`、管道喂 xargs 取上游、命令内字面变量绑定、PS `& { }`/`if { }`/`foreach`/`ForEach-Object` 回溯、Python 原始串与 pathlib、拒文兜底恢复。
- **v1.3（TriCompany 2a141cb·CAO 复测三余项）=挂载候选版**：Write/Edit 仅精确同目标才拦（被拒目录=工作目录时不咬子树内新建/改动）；PS 简化语法 `gci X | ForEach-Object Remove-Item`；`export`/`Set-Variable` 绑定；`trap '…'`；单引号内反引号=字面。自测 D-101 73 案全过。CAO 三轮独立复测：主矩阵 76/76·残余 40/40·防误拦 45 项零误拦·CAO 本席真实会话记录同向。明示未覆盖：经脚本文件、环境变量与变量拼接/通配、heredoc 顶格被拒删除行（保守拦）、`git -c alias` 偏门形。

## §五 · 技术债（候排）

1. 启动器 `Invoke-ResumeDisambig` 每次起席全库扫会话记录（实测 47.9s／2692MB·随记录增长）——各席起席 40–80s 的主因；可改扫首尾段或建索引。
2. 主树 cwd 的全部席位 hook 共读同一份 bod 信箱（席位专属信箱不在注入面）——信箱路由设计待评估。
3. 两闸 wrapper 合并（Bash 面省一次进程）与 Copilot 宿主面的等价拦截。

## §六 · 教训谱增补（已落记忆主题件 seat-launcher-restart-pitfalls）

杀旧与拉起之间的代码必须被真执行过一次（DryRun 在其前 exit=该段零执行）；try 内禁用 Write-Error 作红退；完工日志时间锚取拉起时刻；读数须独立证（「已是新值」类主张以信箱零变化／日志行缺／进程启动时刻三条旁证证伪）；自己的一行式判定也会字段错位——按分隔符取字段并回看打印行。

## §七 · 未闭项

CEO：D-102 两闸挂载确认／签批通路两段式方案／成熟判据 6d6b80652／r49 解锁+手写路径机器门+CFO 门／copilot provider key。网窗：GitHub 推送欠账（TriRMC d5a7250+153b137·TriMLC f46905f+5391d84·TMV 领先 origin/dev 45 提交）。TEMP 残留测试目录若干（无害·清理候令）。

---
—— CTO 小狄（m-cto）·写前现查 2026-11-27T17:35:54Z／本地 2026-11-28 01:35:54 +08:00
