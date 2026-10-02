# STE·维护批④验证卷（TriMLC 2b1709d 复验）+复验中操作事故专节

- sourceOfTruth: 本件（STE 维护批④验证卷；验证对象=TriMLC 仓 2b1709d【store.ts +4 行 updateJobRun 尾补 saveCronStore+新测试 cron-store-backup-sync.test.ts 90 行】）
- syncMode: static（复验三块毕+类型门受阻+复验中操作事故如实记录；候 COO/CTO 处置裁）
- lastSyncedAt: 2026-10-02T20:14:37Z（date 现查）
- 复验席: STE 小柯（m-ste）；令源=COO 03:5x 维护批④验证令（五块+禁转抄+worktree 即清纪律）
- FSD 卷=同目录 fsd-maint34-completion-readout-20261003.md（75L）+fsd-maint34-presurvey-20261003.md（47L）——读数未转抄，全部独立复测

## 一、复验读数（五块）

### 块 1：缺陷主张独立核（九调用点+唯一性）——核过，一条完整性补注

- **九调用点自数吻合**：timer.ts updateJobRun 实际调用=L148/166/198/208/351/368/382/389/397 恰九处（L32 系 deps 接口类型声明非调用），与 FSD 主张行号逐一吻合 ✓
- **四突变函数全刷**：store.ts 内 saveCronStore 调用点=L258（addJob）/L269（removeJob）/L343（updateJob）/**L388（updateJobRun·本修新增）**——diff 核过（+4 行：3 注释+1 调用，位置=jobs[idx] 赋值后）✓
- **唯一性主张成立**（jobs 快照域）：saveCronStore 内容面=JSON.stringify(jobs) 纯 jobs 快照；addExecutionLog=纯 execution_log INSERT 不动 jobs 行，不构成备份漂移路径 ✓
- **完整性补注（非缺陷）**：service.ts:114 存在第十调用点 `store.updateJobRun(j.id, { nextRunAt })`——FSD 主张限定「timer.ts 九处」属实，但调用面全景=timer.ts 九处+service.ts 一处；本修系函数尾统一收尾，全部调用点同受益，主张语义不受损，记完整性补注。

### 块 2：新测试+cron 族独立复跑——全绿

| 项 | 读数 |
| --- | --- |
| 新测试 cron-store-backup-sync.test.ts | **2/2 pass**（node --import tsx --test 正形；裸 node --test 因缺 --import tsx 报 ERR_MODULE_NOT_FOUND=命令形态非测试缺陷） |
| cron 族四文件（role-gating/skipped-degraded/backup-sync/store-nextrun） | **18/18 pass**（4 suites） |

### 块 3：全量门 8 fail 归因独立复验——独立归因毕（全数既有），与 FSD 读数差异如实录

**自跑读数**（2b1709d 侧，npm test）：**623 tests / 618 pass / 5 fail**——与 FSD 卷（615/8）不同，独立归因如下：

| 我轮 5 fail（not ok 名） | 干净 HEAD a66b3b2 对照（自建 worktree+junction node_modules） | 隔离跑（六挂文件单独跑） | 归因 |
| --- | --- | --- | --- |
| replay-flow.test.ts | **同挂**（not ok 21） | **仍挂** | 确定性既有失败（非本修） |
| tui/components.test.ts | **同挂**（not ok 51） | **仍挂** | 确定性既有失败（非本修） |
| P0 通道一/二端到端（auth-gate-rejection.test.ts，suite 内 1 subtest「e1 /healthz 精确豁免」挂；单元层 5 向量全过） | **同挂同形**（not ok 144） | **仍挂同向量** | 确定性既有失败（非本修） |
| FADE-ASSESS-005 派工门禁 | **同挂**（not ok 157） | **绿**（cron-role-gating/agent-tool-roster-gating/roster-gating 三文件隔离全绿） | 全量并发干扰型既有失败（非代码） |
| FADE-ASSESS-005 可见性回归 | **同挂**（not ok 158） | **绿**（同上） | 全量并发干扰型既有失败（非代码） |

- **结论：5 fail 全数既有，与本修零关**——干净 HEAD 同清单同形（仅序号偏移 1=新测试文件插入位），本修只动 store.ts updateJobRun 尾+cron 测试文件，与上述五域零接触面。
- **与 FSD 读数差异如实录**（8→5 的差）：①并发干扰族轮间随机——FSD 轮 roster-gating/ctx-cwd（not ok 181/182）+FADE-ASSESS-003 挂、我轮未挂；我轮 FADE-ASSESS-005 挂、FSD 轮亦挂——同族不同例，均隔离绿定性并发干扰。②P0 suite 挂的向量数轮间不稳——FSD 卷「not ok 6（挂 40/41）」，我轮 suite 内 1 subtest（e1 /healthz 精确豁免）；该 suite=真实 HTTP 端到端形，环境敏感，两轮均挂=既有定性不变，向量数差异如实注记。
- 对照方法学：`git worktree add`（正斜杠路径）+PowerShell New-Item Junction node_modules；worktree 已即清（git worktree list 验零残留）。

### 块 4：类型门 baseline 核——**受阻未完成**（事故后 TS2307 面现前）

- 事故前未跑类型门（块 3 全量门先跑）；事故恢复后重跑 `npm run check`=exit 非 0，报错面=**TS2307 Cannot find module '@tricompany/agent-core'（10+ 处）+trimodel（1 处）**——根因=agent-core 入口指向 dist/index.d.ts 而 **dist 是 gitignored build 产物**，事故中被删且 git checkout 不恢复 dist；node_modules 重装后链接形就位但 dist 缺。
- **FSD 4×TS2322（contract-resolver.ts 173-178）既有主张：未独立验**——TS2307 面盖过 TS2322 面，须先重建 agent-core dist（+TriModel dist 链）方能回到 FSD 跑时的解析态。**候授权窗 rebuild 后补验**，本席不擅自 build（事故后扩权冻结）。

### 块 5：卷面对表

- 禁区声明九条在位，其中可复核项：值面零出机（FSD 卷全指纹形 ✓ 抽验）；④不含 8713 生效重启 ✓（2b1709d 已入仓候冷起窗，本席复验零重启动作）；邻域零触（digest-inbox.mjs untracked 原样 ✓）。
- COALESCE 零动语义：diff 实锚——本修仅 updateJobRun 尾追加，COALESCE 逻辑（store.ts L228-247 域）零行触碰 ✓；新测试例②（COALESCE 保 nextRunAt 卫生语义）2/2 中的语义锚 ✓。

## 二、复验中操作事故专节（如实全录）

### 事故定性

**复验侧操作事故（我方全责）**：worktree 清理链穿透 junction/symlink 臺 TriCompany/packages/agent-core 源内容删（55 文件，git 全可恢复）+**D:\Code\ai\TriModel 仓文件面全失（含 .git）**。

### 时间线与根因链

1. 20:0xZ 块 3 对照：`git worktree add`（首次反斜杠路径被 msys 吃成 `Tempste-maint34-...` 错位，无伤害）→清理重建（正斜杠）→junction node_modules→a66b3b2 全量跑（读数有效）。
2. 用毕清理：`git worktree remove --force`+**`powershell Remove-Item -Recurse -Force`（PS 5.1）——主嫌：PS 5.1 递归删除跟随 junction/symlink 穿透目标**，经 worktree 下 node_modules junction→TriMLC/node_modules 内容全删；其内 `@tricompany/agent-core`（junction→TriCompany/packages/agent-core）穿透致源删；`trimodel`（symlink→TriModel）穿透致 **TriModel 整仓删**（.git 随之）。
3. 发现链：类型门 TS2688→node_modules 空（0 项）→npm ci 重装（137 件）→TS2307 现前→agent-core 源空（mtime 与事故窗吻合）→git status 全 ` D`→**TriModel 目录全空**定性。

### 损失面与恢复面

| 项 | 损失 | 恢复 | 状态 |
| --- | --- | --- | --- |
| TriCompany/packages/agent-core（55 文件源码） | 全删 | git checkout（2fb1292 已 tracked） | **已恢复·零真损** ✓ |
| TriMLC node_modules（正常包体） | 全删 | npm ci+npm install | **已恢复** ✓（file: 依赖链接重建） |
| TriModel 代码面（src/test/docs/ui/scripts） | 全删含 .git | **sg bare TriModel.git 克隆**（dev 顶 161d0ca） | **已恢复** ✓ |
| TriModel/.env（2 键形，dotenvx log 实锚 injected(2)） | 删 | 不入 git；TRIMODEL_API_TOKEN 值可从 8711 trirlc-daemon.env（a5cb..13a7 配对）取 | **待恢复窗**（敏感值面+活体门，候授权） |
| TriModel/dist+node_modules（build 产物） | 删 | 可重建，但**活体版本基未知**（3333 活体 9-29 起，161d0ca 与活体启动基可能不同代） | **待裁**（贸然 build 有版本漂移风险） |
| TriModel 本地未推提交（若有） | 不可知 | 本机 .git 丢失，reflog 随之；本机疑非 TriModel 主开发位（CLAUDE.md 模块布局无此仓+sg 有 p3sg-deploy 部署线），低险但不可证伪 | **候勘** |

### 活体风险（高亮）

**3333 TriModel 活体（pid 42616）内存存活中**（进程加载态完好，8711→3333 keys 链不断），但 **dist 文件面空——重启即失败**。已双报 COO（db8b94a2）+CTO（54cc4fd1）知会全席**禁重启 3333** 候 dist 重建窗。

### 教训（候 CAO 册）

1. **Windows 下 junction/symlink 清理禁用 PS 5.1 `Remove-Item -Recurse`**（跟随链接穿透删除目标——本案 TriModel 整仓级实害）；正形=先 `(Get-Item).Delete()`/`fsutil reparsepoint delete`/`cmd rmdir`（均不穿透）摘除链接，再清目录。与既有条「hook 内 GIT_DIR 陷阱」同族=工具对链接语义的隐式行为坑。
2. **worktree 清理前先断言链接面**：node_modules 是 junction 的仓，worktree remove 前先摘 junction（本案 git worktree remove 是否贡献未单点定性，联合窗口记档）。
3. **事故响应序验证**：停手→git 可恢复性先查（agent-core 秒回）→远端 bare 恢复源排查（sg bare 克隆）→活体风险评估先行上报——本次恢复链零真码损失，流程可复用。

### 边界盘点补记（COO ②b 只读盘点令，20:19Z）

- **第三条链接现形**：TriMLC/node_modules 内 junction 实为**三条**（原树灭后以现树枚举+npm 声明面双证）——`trimodel`→TriModel／`@tricompany/agent-core`→TriCompany/packages/agent-core／**`@trimetaverse/tricode`→TriCode**（后者此前 grep 漏 @trimetaverse 域，边界盘点枚举现形）。**TriCode 仓同遭穿透灭失**（目录空+.git 灭），已从 sg bare TriCode.git 克隆恢复（**a3893ba** 顶，7 项 tracked 面回位）。
- **闭界抽查**：TriRLC/node_modules 链接面（未触仓）=`trimodel`→TriModel TargetExists=True 完好、@scope 层零额外链接——损伤面收敛于 TriMLC/node_modules 单树内三条链接目标，无第四条。
- 现树三条 junction 目标在位性：TriModel ✓（克隆恢复）/agent-core ✓（checkout+npm 重建）/TriCode ✓（克隆恢复）。

### T7 bak 族核（CTO 回执③问询，答案=灭失·真损）

- T7 裁决清单（t7-four-blockers-verdict L47）：目录四（bak-20260927-2325-pre-fullflash/bak-20260927-pre-flash/dist.bak-pre-a6-20260929T0027/dist.rollback-trial-a6）+文件六（trimmc-card.json.bak-20260928T 系×4+pre-v4×1+48660-4 系），全 ?? untracked，位于 TriModel 仓工作区。
- **现迹核：全灭失**——克隆后仓内 17 项=纯 tracked 面，bak 系零命中（git status 零）。灭失时点=**穿透删除**（非克隆清除：克隆发生在仓已空之后只写入）；untracked=sg bare 无副本=**不可 git 恢复，真损**。9-27~9-29 操作保护性快照（T7 定性「保护价值随现役稳定时长衰减」）随仓灭失，CTO 卫生候办对象面自然消解但属事故损失非卫生处置。
- TriModel/TriCode 两仓的 untracked 工作区残留+本地未推提交同族**不可知不可恢复**（本机 .git 丢失；sg bare 顶=161d0ca/a3893ba 是否已含本机全部工作无法本地验证）——真损边界以此为止，候 CTO 裁卷标注。

## 三、发现项汇总



1. **（阻塞·我方事故）**：见 §二专节+边界盘点补记——TriModel/.env+dist 待恢复窗、3333 禁重启候裁、类型门 baseline 待补验；TriCode 已克隆恢复（untracked/未推提交同族不可知）；T7 bak 族灭失真损。
2. **（非阻塞·完整性补注）**：updateJobRun 调用面实为十点（timer.ts 九+service.ts 一），FSD 主张限定域属实，修复覆盖全域，无需改码。
3. **（非阻塞·既有失败族实证增量）**：本轮全量 5 fail（vs FSD 8）——并发干扰族轮间随机性实证（同族不同例+隔离全绿），支持 FSD「测试隔离性改善候 STE/CTO 面」候办；P0 端到端 suite 向量数轮间不稳（6→1）注记入档。
4. **（非阻塞·观察）**：裸 `node --test` 跑 .ts 缺 `--import tsx` 报 ERR_MODULE_NOT_FOUND——命令形态坑，npm test 正形无此问题，备注档。

## 四、使用依据

- COO 03:5x 维护批④验证令（五块+禁转抄+零写面+worktree 即清）
- FSD 施工卷 75L+预勘卷 47L（对表用，读数未转抄）
- 实锚：TriMLC 2b1709d diff/store.ts 全段/timer.ts 调用点/service.ts:114；全量门双 HEAD 日志（/tmp/ste-maint34-fullrun-{2b1709d,a66b3b2}.log）+隔离跑日志；类型门三轮读数；sg bare TriModel.git 克隆件（D:/Code/ai/TriModel@161d0ca）
- 事故双报回执：COO db8b94a2 / CTO 54cc4fd1
