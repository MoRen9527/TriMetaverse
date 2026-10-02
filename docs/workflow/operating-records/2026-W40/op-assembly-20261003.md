# COO 组单 · 2026-10-03（周六）运营窗

- sourceOfTruth: 本件（COO 运营组单正身；累账源=workbench 10-02 各条+BOD 裁复转录；周排程本席裁，跨席 owner 标注）
- syncMode: live（窗内随时更新；销项在「状态」列留痕）
- lastSyncedAt: 2026-10-03T01:4x+08:00

## 一、固定节律（非组单事项）

| 时点 | 事项 | 形 |
| --- | --- | --- |
| 12:00 | 公司需求池周六联审（CPO/COO/CTO） | cron joint-review-demand-pool 已挂 8713（nextRunAt 实锚）+COO 在席转告主道 |
| 12:00 前 | CFO 补版供数（三行形） | CFO 依裁复频次 |
| 全天 | 10-04（周日）23:00 周平面迁移前置 | 迁移链含公司需求池+运营计划表（两表迁移注记已铸） |

## 二、组单（owner/窗/状态）

| # | 事项 | owner | 窗 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | batch-15 件①②复工（①LG-053 执行面 FSD 主+STE 验；②T7 卡点四项裁决 CTO） | FSD/CTO（排窗 COO） | 10-03 黄金窗 | **件②毕报收（01:53，接令 6 分钟）**：裁决卷 t7-four-blockers-verdict-20261003.md 74 行/0e6e2067（本席盘验吻合），裁态=结项2（推送纠缠已消解 5cf5501+勘外扩裁收束）/转承1（连锁段→BOD 另令+COS 派裁位，前置门 sg→dev SSH）/改判1（TriModel 残留**不归 LG-025**，行不动；bak 族立独立卫生候办归 CTO 域）/附勘结项（junction 化=销项后无施工对象非漏项）；T8 候 BOD 留手——**候 BOD 复核**。件① **毕报收（02:20）**：triladder.ps1 312L 四子命令+direct-probe.ps1 125L 落 TC scripts/ops/local/（收口批已代 commit 安全网）+卷 fsd-batch15-1-completion-readout-20261003.md 74L；验收锚全达（A1-A3/探活四态六形超集/直连面通，-Live 真推理候值席窗如实标）；技术债四条如实在卷（restore 38 行前窗在途 diff 零触/notify 链候接等）；**STE 验已派（02:2x）**，验毕→BOD 复核→R-HY 修复窗串行接排 |
| 2 | 维护批③④（8711 配令+优雅停实弹复测+updateJobRun 一行修） | FSD | 10-03 窗候排 | 在单（车道候 FSD：R-HY 勘验+件① 毕后顺延） |
| 3 | FADE-010 三项 | 候 | 10-03 | 在单 |
| 4 | R-HY 401 键值窗：TRIMODEL_API_TOKEN（门面）与 GLM_API_KEY（上游）两键分勘 | FSD/CEO/BOD 面 | 10-03 | 在单（**勘验面已毕（01:4x FSD）**：三勘面全实锚，读数单 trees/rhy-401-key-audit/rhy-401-key-audit-readout-20261003.md 在卷——候 CEO/BOD 面读数消费；token 轮换 CEO 定性「不急」挂起） |
| 5 | R-HY 401 pull_denied 归因（信任面已通，token 门未放行） | SDE 面 | 10-03 晚窗候选 | 在单 |
| 6 | F-4 缺陷单批立（node:sqlite orphan 清理） | CTO 批立 | 10-03 | 在单（候办+1） |
| 7 | **TriRLC 并线序裁**（key-cache.ts 本地泛化三笔 vs origin 叙事笔+本机八笔未推；并线序+推送时点） | **COO 裁权**（与 CTO 对表；FSD batch-07 卷素材） | 10-03 | 在单（BOD 裁复①） |
| 8 | 合同族 62/63 施工（TriMMC schema 增 Registry 分支+断言回落可选态） | FSD（CTO 终裁四细则） | ~~10-03 窗候排~~ | **已闭环（10-02 夜提前 14.5h）**：FSD 完工→COO 验收 PASS→BOD 定谳→push 双仓 2fb1292/cf177f1→收口 2bef2b1a；连带闭环两处 BOD 追认 |
| 9 | **测试 env 隔离债**（43 条连坐；FSD 报价=测试头 env 清理段） | **COO 窗排裁** | 10-03 维护窗候选 | 立债（BOD 裁复③），与 #10/#11 并列比窗 |
| 10 | watchdog「12 席」措辞勘 | CTO 面 | 10-03 维护窗候选 | 在单 |
| 11 | 8710 残三条 | CTO 面 | 10-03 维护窗候选 | 在单 |
| 12 | bare gc 晨勘首项（轻勘+因明即 gc；ownship 面 Fleet/git）+TMV 根 `sg` 空文件核（0 字节/10-02 00:49 产物/无席认领，核毕即清或归主） | BOD/晨勘 | 10-03 晨 | 在单（晨勘首项+ⓘ①） |
| 13 | 三席（cpo/coo/cto）TriMMC 信箱目标名勘验（seats 全员 bod-addressable:false，直寻址未实证） | COO | 10-03 | 在单（batch-16 件②嗣项） |
| 14 | plane-shift-local-align.mjs LOG 硬编码 W40→周目录动态化（翻周落错位小项）+10-04 23:10 首次真实周考验观察 | COO 随修+观察 | 10-04 前修/10-04 夜观察 | 在单（六错归因毕=启动期 PATH+瞬断，非结构性病） |
| 15 | **R-HY 401 修复窗**（a 项 8713 token 同步七步序+b 项 GLM key 只读对照勘四步；禁区九条带施工，方向性禁区=门面权威值零改修复恒本机对齐） | FSD 施工+CTO 技审（BOD 裁准修，窗点 COO 裁） | 件①毕+STE 验后串行接排 | **技审审定单毕（02:0x）**：cto-401-fix-procedure-review-20261003.md 136 行/b6e6db9f（盘验吻合）——a 项七步序过+D-04 三层完工锚（**主锚=face-events mlc pull 转 ok；「临时 job POST」探针裁不可用作 token 生效判据=F-3 缺陷恒假阴性**）；b 项工序过，**值源分叉预裁已落（BOD 02:0x）**：明窗 sg 门面对照勘先行（只读）→①sg 有现役值=同值补齐（脱敏施工归准修面同窗 FSD 串行）/②sg 无值=新 key 生成涉 bigmodel 配额面**升 CFO/CEO 裁（CFO 闸纪律）**，两分叉现在落明窗勘毕即走不候议；补勘=channel.cmd 20:48 窗系行尾还原窗非值面变更窗 |

## 三、比窗裁定（#9/#10/#11 维护窗候选三件）

窗容量候 10-03 现势裁：三件同属低风险小改面，若窗窄按 #9（隔离债 43 条收益最大）>#10（watchdog 措辞，B 段后正确性）>#11（8710 残三）序裁。

## 四、候挂新条

- **运营计划表共创五问挂起**（CEO 令 21:14 经 BOD：「五问先暂时搁置，COO 记着点，等岗位审完再回答」）——挂起触发器=**CEO 宣布 COS/COO 岗位审完**（预计 10-03 上午），届时五问 verbatim 底稿（已呈 BOD）重启候 CEO 答；首版规划对话不丢仅顺延。**CEO 五问答复挂 10-03 白天窗**（CEO 01:38 三令③，答后共创续轮）——本席五问重启呈报与 CEO 答复并轨候排。
- **维护窗候选两件**（BOD 01:36 随复工令候挂组单）：8460 probe 增补（D-15 线）+教程 L39 勘正（→RDT）——随窗容量与比窗三件（#9/#10/#11）同裁。
- **TriModel bak 族静态残留卫生候办**（T7 裁决④衍生，CTO 域自领 owner）：4 目录+6 文件全未跟踪 git 工作区保护快照，处置方案素材在裁决卷 §4——候维护窗另裁；动态残留已自然消化（lock 零+stash 空）不入。
- **岗位件最高优先级插入**（BOD 21:11 令）：COS/COO 两岗 source-agents 岗位职责优化，CEO 亲审经 BOD 转达即拆任务书派工；死线=10-03 上午；COO 岗件不自改不自裁条款。**主审面勘正（BOD 21:26）**：两主 .agent.md 文件已退役出渲染链（L6 退役声明），正确主审面=零件（agent-body COS 159L/COO 122L+agent-frontmatter+soul 60L/50L），任务书铸材以零件为对象。**第一波已拆派（10-02 22:51，batch-17 件①四环闭）**：COS 岗 agent-body 23 条意见→STE 主刀（车道裁+BOD 采信），任务书+处置单（BOD worktree staging/sg commit 1524f279 双通道）本机直读开工；三防+C15 先勘 spec 铸令；COO 岗批候 CEO 意见第二波。
- **CLI 2.1.287 升级窗恢复韧性实证收档**（LG-055 B 段副产品，10-02 夜）：282 期 resume 挂死×2 轮→287 期 watchdog 自动拉起即成活（CMO resume 续载满分）——版本升级窗席位恢复韧性已实证一轮，无候办；窗尾卷四条判据修正提案候 CTO 落盘后入册面（判据归 CTO 汇裁链）。
- **TMV sg bare remote hook rebase error**（STE 件④ push 留痕，10-03 00:0x）：push ref 本身成功更新，系 sg 树自动追平 hook 面报 rebase error——值席域候值席窗处置，不阻验收链；与 8712 根治窗同域可并勘。
- **退役主文件归档清理**（BOD 21:26 勘正附带）：chief-operating-officer/ceo-chief-of-staff 两主 .agent.md 已退役出渲染链，归档清理候后续窗（不入 10-03 必办）。
- **维护窗增补两件**（BOD 22:35 补窗单，STE 走查衍生）：①CTO 维护窗双源收敛批增补=本机 channel.cmd 权限 644→收紧核（sg 侧 override.conf 600 已毕）——窗内只核本机侧；②FSD 交卷附注要求=precheck 卷 errs 26→27 跨卷 +1 无归因，下次交卷附一句归因注（不立单）。BOD 面 18 项四族窗单整理稿明晨组窗合流本席。
- **8712 config-sync 根治（BOD 明窗单，#248 续）**：第一层 root 污染已修毕；第二层=git pull --ff-only 撞 sg 工作仓脏面（m-duty-cos 22:00 前后直接工作仓 commit+值席未同步现场 4M/3D）。BOD 裁今晚停手，三设计候选明窗裁：fetch+reset 硬对齐（须先迁出值席现场）/值席现场迁出工作仓（结构性最净）/pull 前自动 stash。**值席知悉面：工作仓现场与 config-sync 冲突中，动 sg 工作仓前先看此条**。cf 预计明早 ~24 degraded（服务本体绿无积压危害）。

## 使用依据

- workbench 10-02 18:35–21:0x 各条；BOD 裁复三件（T5 卡点①③分转/件②验收采信/卡点②终裁转知）
- batch-16 件②执行读数（cron 落位全链，workbench 21:0x 条）
- FSD batch-07 T5 接力卷（375881d9）+SDE 窗读数（ead0026e/41db3ea1）
- BOD 复工令 batch-18（树 2ec7dfe4+快道贴文）+CEO 01:38 三令（亲裁追认/R-HY 直派/五问明日窗）；COS 台账条 32/33+sg 树 relay（batch-15 任务书原文与本机卷逐字一致）
- 原 batch-15 任务书（trees/bod-pipeline-batch-15/task-charter-batch-15.md 本机在卷）+材料指针（batch-12 阶梯终稿/batch-13 CTO 意见书/batch-07 执行卷卡点四条）
