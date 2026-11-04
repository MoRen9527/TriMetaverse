# recon-fsd-seg2-tritraining · docs-maintenance 扩展链段二勘定卷骨架（TriTraining 过时勘定·FSD 施工侧）

- sourceOfTruth: 本卷（段二勘定·FSD 机械对表层正身——内容面细勘 owner=RDT 细勘卷随到随并）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 勘席: FSD（COO 派工令 2026-11-04T12:27:38 即动·五工序照排）·协同: RDT（content owner·协同信 0dda1901 已发 12:29:45）
- 裁语锚: COS 11:55:13 四裁点（③N≤5 上限施工勘定报备·④拓扑活体现探禁推定）

## 勘〇 · TriTraining 拓扑活体现探（工序①·裁④照行·禁推定）

- 仓在位：D:/Code/ai/TriTraining（独立仓·dev 分支·worktree clean 活体现勘 2026-11-04 12:28）
- 根面：AGENTS.md+README.md+.gitignore+cc-tutorial/+docs/——与排期单 §一 实勘对表吻合零漂移
- 现顶：8b3e4ec（2026-10-02T20:27:25+08·cc-tutorial 勘误批 TriLC→TriRLC 正名 40 处/5 件）——**10-02 后零提交·一月静默面**

## 勘一 · 教程面全量清点（工序②前半）

- **cc-tutorial/agent-core-v0.1.0/**：5 md（01-小白版/02-产品版/03-代码引导版/04-代码复刻版/README）——lastSyncedAt 全 2026-10-02·syncMode=source-derived（派生自 agent-core v0.1.0 源码快照·代码论断真源=TriCompany/packages/agent-core/src/）
- **docs/training/**：14 md+4 example json（employee-host-publish 系 5 md/employee-source-kit 系 4 md/tritraining 架构系 3 件/training-pack-migration-plan/README——族计数 5/4 系 RDT 勘正采认 2026-11-04·原卷 6/5 系 json 计入误·12 件带 lastSyncedAt·course 两件内容时锚=2026-06-14）
- 候勘定总量：**19 md**

## 勘二 · 机械对表三读数（版本面/命令面·链路面骨架）

1. **版本面**：agent-core 包版本现役仍 0.1.0（TriCompany/packages/agent-core/package.json version="0.1.0"）——cc-tutorial 版本号面未过时；**行为面两笔后动晚于教程快照**：
   - 2fb1292（2026-10-02T21:25+08·batch-15 合同 v3 Registry family 分支）：contracts/agent-contract.ts +44/−6（PathsSchema 四件套 Registry 豁免+superRefine Role 分支强约束）——晚于教程快照 commit（20:27）58 分钟·**不在快照内=漂移实锚**·受影响面集中 03-代码引导版/04-代码复刻版（合同校验行为论断面）
   - 1d52c20（**2026-10-14T10:49:01+08:00·TriCompany 仓 %cI 机真值双证**·cron stale 守卫+settle 兜底·commit msg 注「备码不部署」）——cron 面教程论断概率低（agent-core 教程聚焦 loop/contract/permissions）·RDT 细勘定性：实质结论成立（最后一笔触 agent-core·重锚目标 dbd8d620 与 HEAD 树同值独立验同）；RDT 细勘卷勘正「10-09 10:35:15」系误读（TriTraining 仓无此 revision fatal 实锚·语境错位）·其卷该行候 RDT 自勘
2. **时序面**：cc-tutorial 快照 8b3e4ec=10-02 20:27 vs agent-core 后动 10-02 21:25/10-14 10:49——时序差实锚（58 分钟+12 天）
3. **链路面**：docs/training course 系内容时锚 2026-06-14——TriCompany 发布管线 2026-09-04 后多轮演进（batch-03 件2 V3 裁条/D-47 信面落款/D-26 简介形/session 面扩形等）·6-14 时锚早于全部演进=**漂移嫌疑最重族**·受影响面=employee-host-publish 系 6 件+employee-source-kit 系 5 件候 RDT 逐件勘

## 勘三 · 护栏锚先置读数（工序④·先于首跑落位）

1. **git 回滚锚**：TriTraining 现顶 **8b3e4ec**（worktree clean·首跑任何改写前工作区零漂移——回滚正形=git checkout 8b3e4ec -- <file> 或 git restore·仓级锚=8b3e4ec）
2. **试跑范围圈定**：写面仅限 TriTraining 仓 docs/training/ 与 cc-tutorial/ 两目录（教程面）——根 AGENTS/README/.gitignore+docs 其他子目录 README 零触碰
3. **人工 review 关卡**：自动改写≠自动提交——改写产物落工作区（不 add 不 commit）·diff 呈 RDT review·review PASS 后人工提交锁笔（首跑机制验证为主·裁③）

## 段二首跑执行与 review 收口（终态）

- **RDT 细勘卷并卷毕**（b07aaa8d8·勘二漂移 2→9 笔实锚+勘三 14 件分级+勘四 N=5 提案+review 判据四条）→ **N=5 确认**回信（裁③报备入账·上限不破）→ 首跑改写毕（工作区五件·残留断言 grep 两目录全量 PASS：首跑件正文零漏勘·命中全定性=勘误头 meta/refram 历史指涉带档案指向/批二候勘件在册）
- **RDT review PASS**（12:49-12:53 独立实勘·判据四条逐条 PASS·留痕=其卷勘六节 TriMetaverse 5f326a8eb）——首跑机制验证读数（裁③主判据）=**首过零 rework/零范围越界/零引文损**
- **勘正②终谳消化**：1d52c20 双日期字段分野定谳（author %ad=10-09 10:35:15／committer %cI=10-14 10:49:01·authored 10-09 landed 10-14 隔 5 天落分支·两皆 git 机真值）——指纹表取 %cI 入库口径完整形+分野注记入 README 勘误执行记录条；FSD「语境错位/TriTraining 无此 hash」诊断作废认领（RDT 命令系 TriCompany 同仓直读 %ad·差异本因=字段非仓向）——假读数家族第十二向两席同领
- **人工 commit 锁笔**：TriTraining **72a643e**（5 files +29/−24·dev 分支·回滚锚 8b3e4ec 在册）
- **候后续批登记三条**（RDT 勘六·非阻塞·owner=RDT 排程候窗）：①批二=03/04 named-drift 表消化（maxTurns ?? 25 引文/contract v3.1/Registry family/defaultMode fail-closed/cron stale 守卫）+docs/training README 轻勘+ai-course-graph §8 图节点可选；②批三=beginners-guide §10 三规划项现势确权（item1「当前仍是拷贝式」疑部分过时——旁证=session-body footer 系统一发布管线 --host 渲染活体+ade-consolidation-proposal :68 已载 --host 规格·proposal :5 状态行账面滞后=proposal 域修面非培训域·候发布管线现勘后 rewrite）+course 系重勘+双仓镜像对齐；③挂接面 WATCH_DIRS 追加=段三 SDE
- **毕报双发**：m-cos 收口+抄 m-coo（锚=72a643e+5f326a8eb 勘六节+本卷）——段二节点闭项

## 使用依据

COO 派工令 2026-11-04T12:27:38（五工序）·排期单 62241d6044 §段二·COS 四裁点 11:55:13·TriTraining 活体现探读数（勘〇 12:28）·TriCompany agent-core 版本与 git 读数（勘二 12:29-12:30）·RDT 协同信 0dda1901（12:29:45）
