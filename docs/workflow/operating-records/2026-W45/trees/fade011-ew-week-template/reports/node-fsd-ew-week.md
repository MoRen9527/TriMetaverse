# node-fsd-ew-week · event-watch treeRoot {week} 跨周模板化+audit 跳变补行节点收口报告

```json
{
  "nodeId": "node-fsd-ew-week",
  "agent": "FSD",
  "startedAt": "2026-11-04T12:14:05+08:00",
  "finishedAt": "2026-11-04T12:23:26+08:00",
  "baselineCommit": "TriMLC@dev c52f5bc（watch 立窗件·worktree clean）·全量基线读数=794 tests/789 pass/5 fail（stash 基线对照实测）",
  "trigger": "CTO D-15 派工（信面落款 2026-11-04T12:13:41+0800·brief=012e9e109）+同窗扩面加件（CTO 2026-11-04T12:18:37 裁·SDE 勘定读数卷 f483039ab OBS1 根因）——两件同文件同窗毕报一封",
  "actions": [
    "件1·{week} 模板：isoWeekString ISO 8601 周串（2026-W45 形·本地日期分量·operating-records 周目录同构锚实测对表）+expandTreeRootTemplate（唯一合法占位符={week}·无占位符静态值恒等向后兼容·未知占位符 throw）导出",
    "件1·触发段接线：rateLimitCheck 后/createAndDriveRun 前展开（run 创建时点·非 boot 时——换周不重启亦落对周）·失败走现役 failed 通道（run 不创建+audit failed 显面+failed 记忆化零重试·A 件③裁语同族）·app.ts/env 三键零触碰",
    "件1·时钟域分离勘定（实锚⑪红案自获）：集成展开初版误用 opts.now（防抖相对时钟·测试注入 3000ms→1970-W01 假周）——勘定=日历展开走真实墙钟域（缺省 new Date()·R4.3 进程内正形）与防抖相对时钟两域不可互替；换周模拟由 expandTreeRootTemplate 的 Date 参数注入覆盖（gate1 措辞「注入时钟或周参数」后者正形）",
    "件2·audit 跳变补行：debounce-pending 落行判据改「首见或跳变均落行」（set 后一律落·跳变后直触发审计链有前置行）——skip-same 防膨胀语义不动（同指纹重扫零行）",
    "测试四新件：week-template 单元（isoWeek 四锚+展开注入+静态恒等）/fail-closed 集成（{weekx}→failed+零 run 行+记忆化 skip）/e2e 模板树落对周（动态同值断言不随时间漂移+旧形路径零落盘）/审计三行链（baseline→pending 首见→pending 跳变→triggered）",
    "gate4 全量回归+stash 基线对照：改动后 798 tests/793 pass/5 fail vs stash 基线 794/789/5 fail——5 红同名同序复现=既有铁证·798=794+4 新增全绿零新增红"
  ],
  "artifacts": [
    "TriMLC 2833c82: src/fade/watch.ts（isoWeekString+expandTreeRootTemplate+触发段展开+audit 补行·+63）+test/fade-watch.test.ts（四新件+实锚③行数 1→2 连锁修正·+115）",
    "reports/node-fsd-ew-week.md（本报告）"
  ],
  "gateResults": [
    {"gate": "gate1 模板展开单测", "result": "PASS", "detail": "{week}→当前 ISO 周（2026-11-04→2026-W45 与现役周目录同构实测）+换周模拟（Date 参数注入：11-08 周日→W45/11-09 周一→W46·展开值随周变）+ISO 边界（2026-12-28→W53/2027-01-01→2026-W53 元旦归上年/2027-01-04→2027-W01/2026-01-01→2026-W01）"},
    {"gate": "gate2 向后兼容单测", "result": "PASS", "detail": "静态值（无占位符·含现役部署形 …/2026-W45/trees/…）恒等断言（注入不同日期值零变化）+现役 e2e（静态树根全链 APPROVED）在卷"},
    {"gate": "gate3 fail-closed 单测", "result": "PASS", "detail": "{weekx}→event=failed+detail=treeRoot template expand failed+fade_runs 零新行（run 不创建·派生 runId 无 run 行）+audit failed 显面+state failed 记忆化+同指纹下 tick skip-failed-remembered 零重试"},
    {"gate": "gate4 全量回归+stash 基线对照", "result": "PASS", "detail": "fade-watch 12/12（原 8+新 4）·TriMLC 全量 798 tests/793 pass/5 fail·stash 基线 794/789/5 fail——5 红同名同序复现（replay-flow/P0 HTTP 全局门/FADE-ASSESS-005×2/tui components）=既有铁证零新增红·798=794+4 对账闭合·tsc check RC=0"},
    {"gate": "扩面加件 gate·跳变落行单测", "result": "PASS", "detail": "首见→跳变→触发三行链断言（auditEvents=baseline,pending,pending,triggered）+实锚③风暴用例连锁修正（1→2 行=v1 首见+v2 跳变）+skip-same 零行防膨胀不动"},
    {"gate": "纪律面", "result": "PASS", "detail": "独立键空间（freshCtx 每用例独立 DATA_DIR/tmpdir·零触现役 8713 与 fade.db）·速率护栏/指纹记忆化零触碰·D-46 值面零回显（audit detail 只含占位符名与错误消息面）·D-47 卷面时戳=写前现查粘贴零手打·写后即 commit 锁笔（2833c82）"}
  ]
}
```

## 实现方案

模板形=watch.ts 内两纯函数（isoWeekString+expandTreeRootTemplate 导出）+触发段单点接线——展开时点=run 创建时（rateLimitCheck 后/createAndDriveRun 前·boot 时 env 原样不动=换周不重启亦落对周的关键）。fail-closed=未知占位符 throw 由触发段 catch 走现役 failed 通道（零新语义通道·审计显面+记忆化复用 A 件③裁语形态）。时钟域=防抖相对时钟（opts.now）与日历时钟（真实墙钟）分离——两域不可互替。

## 异常与处置

1. **实锚⑪端到端 1 红（self-caught·测试抓获）**：集成展开初版 `expandTreeRootTemplate(config.treeRoot, new Date(now))` 用 opts.now——测试注入 3000ms=1970-01-01→展开 1970-W01 假周，树落错层。勘定根因=opts.now 系防抖窗相对时钟（相对语义）而 ISO 周系绝对日历语义，两域不可互替。修正=展开走真实墙钟缺省参数（R4.3 in-process 正形），换周模拟由展开函数 Date 参数注入覆盖（gate1 后半措辞正形）。复跑 12/12 全绿。
2. **全量 5 红既有定性**：初跑 5 fail——stash 基线对照同名同序复现=既有铁证（零转抄·独立验成立）。5 红域（replay-flow/P0 HTTP 门/assess×2/tui components）与本单改动面（src/fade/watch.ts+test/fade-watch.test.ts）零交集。

## 断点交接

- 两件毕（TriMLC 2833c82·12:23:20+08 机真值）·毕报回 m-cto 验收。
- **部署面切换候 CTO 窗**：现役 8713 env TRILC_FADE_WATCH_TREE_ROOT 静态值本单未动（范围划线遵守）——切换=env 值面换 `{week}` 形+daemon 重启窗随批（CTO 排布·W46 换周 11-08 23:50 前落位即达「W46 起 run 落对周」时效目标）。
- ISO 周取本地日期分量（daemon 本机时区域）——周平面迁移 cron（周日 23:50）与 ISO 换周点（周一 00:00）间存在 ~10 分钟窗：迁移前创建的 run 已落新周号目录（目录由驱动链 mkdir 递归建·不依赖迁移窗先建）——命名同构语义已满足，跨窗对齐属部署面语义候 CTO 知悉。
- TriMLC 既有 5 红域归属留档：replay-flow.test.ts（integration 域）/P0 HTTP 全局门（P0 向量复现域）/FADE-ASSESS-005×2（assess 派工门禁域）/tui components（TriMLC test/tui 域）——既有铁证=本次 stash 同名复现，修复归属候各域 owner 窗。

## 自测结果

- fade-watch 单件 12/12 RC=0（原 8+新 4·stash 往返后复验 RC=0）。
- TriMLC 全量 798/793 pass/5 fail（全既有·零新增）·tsc check RC=0。
- isoWeekString 四锚手工快验（W45/W46/W53/W01+今天→2026-W45 同构对表）全对。

## 技术债务标记

1. ISO 换周点与周平面迁移 cron 窗间 ~10 分钟语义缝隙（命名同构已满足·跨窗对齐候 CTO 部署面裁量）——非缺陷·边界知悉项。
2. TriMLC 既有 5 红域（见断点交接）非本单域·留档候各域 owner。
3. deploy 面 env 切换+重启=验收毕 CTO 窗（不入本单）。

## 使用依据

- 派工 brief：`fade011-ew-week-template/brief.md`（TMV 012e9e109·任务三要素/gate 四条/纪律五条）
- 扩面加件令：CTO 2026-11-04T12:18:37（SDE 勘定读数卷 f483039ab·OBS1 根因）
- 立窗件基线：TriMLC c52f5bc（watch.ts 立窗 commit·R4.3/A 件③裁语锚）
- 测试读数：fade-watch 12/12+全量 798（基线 794 对照）+tsc check RC=0（本报告 gateResults·stash 往返实测）
