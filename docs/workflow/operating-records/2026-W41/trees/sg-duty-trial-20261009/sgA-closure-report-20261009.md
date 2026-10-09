# sgA 回卷 · TriModel sg 副本残留卫生（sg duty 值席试水件一）

- 承接位: M-SG duty 值席（duty-cos）；拾取时点: 2026-10-09T00:25:19Z（+8=08:25:19，date 现查）
- 任务书: task-charter-sgA-trimodel-residue-hygiene-20261009.md（BOD 立书）；红线恪守声明：全程零生产 daemon 触碰／零 push／零 remote 改／零 credential 面／零 git reset／零跨分支 checkout
- lastSyncedAt: 2026-10-09T00:30:00Z 带（+8=08:30，date 现查带）

## 处置决策三件（逐一留痕）

### 1. package-lock.json M 态 → **还原**（git checkout --，任务书处方命令）

- 现场真值：diff 单行——`../TriCode` 锁定版本 `0.2.0-wave3`→`0.1.0`。
- 来源判读：某次 npm install 运行时对 file: 邻仓版本字段的错误解析漂移（TriCode 现役 package.json 实勘=**0.2.0-wave3**）。
- 判定：M 态（0.1.0）与依赖真值**不一致**（滞后漂移）；HEAD 锁（0.2.0-wave3）与 TriCode 当前 package.json **一致**——还原即恢复锁面真值，符合任务书「依赖锁漂移且一致性无冲突→还原」判据。还原毕 M=0。

### 2. dist.bak-pre-sgswitch-20260928T200511Z → 归档压缩＋原目录删除

- 独有内容勘验：`diff -rq` 对现役 dist——**Only-in-bak 条目=0**（差异全为现役侧新增/演进：claude-fallback-sg、config-cards 等；.bak 系 09-28 sg 切换前快照零独有内容）。
- 处置：`tar czf .residue-archive-20261009/dist.bak-...tar.gz`（149K，tar tzf 可读验✓）→原目录删除。

### 3. node_modules.bak-pre-sgswitch-20260928T200602Z → 归档压缩＋原目录删除

- 独有内容勘验：顶层名集比对（`ls` 集合 diff）——**仅 bak 有条目=0**（现役侧反增 16+ 包：@asamuzakjp/bidi-js/@csstools 等）。方法注：本目录系文件级 diff 不经济，采顶层集比对+任务书「独有内容」判据的适度读法——方法局限如实录，若 BOD 需文件级全量比对候令补勘。
- 处置：`tar czf .residue-archive-20261009/node_modules.bak-...tar.gz`（13M）→原目录删除。

## 处置后 status 断言

`git status --short` = **M=0；untracked=1（.residue-archive-20261009/＝处置留痕件自身）**——符合任务书「清洁或仅余留痕件」。

## 现场差异录（任务书快照外，不处置）

- 现场另有 **五个 trimmc-card.json.bak-\*.bak 文件**（10-08T23:47Z～10-09T00:19Z 五连，时间戳近 live 操作窗）——非任务书快照三件之列，且 git status 不可见（疑 .gitignore 掩码面）；照「以现场为准、不强行对表」条**原样保留不处置**，录卷候 BOD/值席线知悉（若系活跃写面的滚动备份，处置应归其 owner 面）。

## 完成判据对照

- 三残留逐一处置决策+留痕依据 ✓（本卷 §处置决策）
- 工作副本 status 清洁（余留痕件已说明）✓
- 回卷落树 ✓（本件，路径=trees/sg-duty-trial-20261009/sgA-closure-report-20261009.md）

—— duty-cos，2026-10-09 08:30 +0800（试水件一毕；候 BOD 认账）
