# 排期单 v1.0（docs-maintenance 三模块生产级测试扩展·COO 拆解·衔接候 P3 毕）

- sourceOfTruth: 本件（排期单·执行面·COS 域径裁承袭·CEO 11:46 直令=授权源·无需另铸候裁任务书——裁决面=COS 径裁注记 11:48:24）
- syncMode: dispatch-plan
- lastSyncedAt: 2026-11-04T11:49:20+08:00（date 现查原值·COO 拆解落笔）
- 令源: CEO 2026-11-04 11:46 双直令之令二·bod 11:46:54 转达·COS 11:48:24 路由（裁决面注记=本链非 CEO 三类裁决 COS 径裁）
- 衔接条件: 迁移链 P3 毕报（锚 4 首验真 run 证据=8713 接入面成熟实证）——**毕后衔接·不阻塞现链·排窗候 P3 毕随势定**
- 目标语义: docs-maintenance 单模块实例（TriMetaverse）→**三模块实例（+TriCompany+TriTraining）=生产级测试窗**

## 一、实勘对表（11:49 ls 活体现勘·与 BOD 预勘吻合）

- **TriTraining**：根目录=AGENTS.md＋README.md＋cc-tutorial/＋docs/（六目录 engineering/execution/product/registry/training/workflow 在册）——根已干净无散落卷；教程面=cc-tutorial/（根）与 docs/training/（**过时面候勘定·CEO 令原话「TriTraining内很多教程是过时的，正好试试自动更新」=自动维护真实验证素材·首跑候选**）。
- **TriCompany**：根目录 md 恰 3 件=AGENTS.md＋README.md＋**tricompany.md（宪章真源）**——真源仓结构成熟·整理面极轻；tricompany.md 归位裁候定（留根 vs 归 docs/——真源面裁量 COS）。

## 二、工序拆解（三段·顺序推进·段内可并行·启动候 P3 毕报）

### 段一 TriCompany 整理段（owner=FSD）

1. 分析勘定：tricompany.md 归位裁候裁（宪章真源面·本席建议=留根同 CLAUDE.md 惯例·真源面裁量呈 COS）＋TriCompany/docs/ 结构面实勘（散落面候清点）。
2. 整理施工（若勘定有归位面）：git mv 保历史＋引用面同步（仓内互链+跨仓引用面 grep 全谱）＋doc-graph 面（TriMetaverse scan.py 扫描根=TriMetaverse/docs 唯一——**两仓 doc-graph 是 scan 根扩展还是各仓独立·候 CTO 技术裁**）。
3. 完工锚：根目录残留对表（候勘定值）＋断链断言（归位件旧路径零命中）。

### 段二 TriTraining 整理+首跑段（owner=FSD 施工＋RDT 教程 content owner）

1. 过时面勘定：cc-tutorial/＋docs/training/ 全量清点——过时教程逐件勘定卷（过时判据=版本面/命令面/链路面与现役对表）——**勘定 owner=RDT（教程=培训域 content 正配）·施工=FSD**。
2. 自动更新试跑（首跑候选·真实验证素材）：过时勘定件自动更新试跑——**护栏锚先置（CTO 门禁）：git 回滚锚+试跑范围圈定（首批限勘定卷 N 件·N 候 CTO 定）+人工 review 关卡（自动改写≠自动提交）**。
3. 挂接：TriTraining/docs 入巡检目录（段三并窗）。
4. 完工锚：勘定卷+首跑证据（更新前后 diff+review 留痕）。

### 段三 WATCH_DIRS 追加挂接段（owner=SDE 施工+CTO 门禁·前置=段一/段二毕+P3 锚 4 毕）

1. env 扩展（8713 部署面）：`TRILC_FADE_WATCH_DIRS` 追加 `D:/Code/ai/TriCompany/docs`＋`D:/Code/ai/TriTraining/docs`（终值目录面候段一/段二勘定后定·fail-closed 三键不变）。
2. 8713 受控重启链（**第四次同口径候计**·P3 第三次先例）：watchdog Disable→POST /shutdown→port FREE 验→schtasks 冷启→pid/CIM 对表→watchdog Enable→healthz+目标 env 值面探针（进程内生效验证）。
3. 首验：两仓各触发真 run 证据卷（受控试触→run id+APPROVED+触发路径）呈 bod。

## 三、验收锚（四锚）

1. TriCompany：根目录残留对表（勘定值）＋归位件断链零命中。
2. TriTraining：过时面勘定卷全量＋首跑证据（自动更新 diff+人工 review 留痕·护栏锚全程在）。
3. 挂接生效：env 值面探针（WATCH_DIRS 含五目录面）＋进程内生效验证读数。
4. 首验真 run：两仓各一真触发 run 证据卷呈 bod。

## 四、分工与回链

- 段一/段二=FSD 施工（RDT 教程勘定协同·CTO 护栏门禁）·段三=SDE+CTO（同 P3 先例）。
- 本席（COO）：排工督办+毕报汇总回 COS 呈 BOD·进度异常升级 COS→bod。
- 派工时点：P3 毕报（锚 4）到达+衔接窗随势定后即派（排窗已废·顺序推进）。
- 候裁点（COS 径裁面·不候 CEO）：①tricompany.md 归位裁②两仓 doc-graph 技术裁（CTO）③自动更新首批范围 N 值（CTO 护栏）④TriTraining 拓扑机位活体现探（段一启动时实测禁推定）。
