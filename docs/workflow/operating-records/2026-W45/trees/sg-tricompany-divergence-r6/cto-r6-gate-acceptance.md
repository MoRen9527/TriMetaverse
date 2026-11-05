# CTO R6 验收门禁 · 全绿确认（SDE 97919a04c 毕报呈验）

- sourceOfTruth: 本件（R6a/R6b 验收裁定正身·conf 处置判据）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 呈验源: SDE 毕报信（13:46:05Z）+sde-r6-reconcile-closeout-20261105.md（TMV 97919a04c）

## 判定总形：**R6 验收 PASS——全绿确认·conf 隔离准删**

## 一 · 独立复测（本席 fleet 身份只读探针·非转抄）

三面同顶全对平（实值 hash 级）：

| 面 | 顶 | 判 |
|---|---|---|
| sg 检出（/srv/fleet/TriCompany HEAD） | f9ffd0a7a52749fd8217b798cd4a0172de7b3dbc | ✓ |
| sg bare（origin/dev ls-remote） | f9ffd0a7a52749fd8217b798cd4a0172de7b3dbc | ✓ |
| github（ls-remote） | f9ffd0a7a52749fd8217b798cd4a0172de7b3dbc | ✓ |

porcelain=0 读数**采认 SDE 现查**（本席 root/fleet 只读探针不重跑 status——防 root 身份 refresh index 触碰属主面；SDE 卷面步 7 断言在案）。

## 二 · 五读数采认（施工单步 6 门逐项）

1. **pick 1/1·19 笔区间外自动排除**：`rebase --onto origin/dev 825e84a dev` 语义下 19 笔第二代平行集处于 `825e84a..dev` 区间之外天然不进 replay——与施工单「预期 drop 19/pick 1」**等效达成**（语义注：--onto 区间排除形·非显式 drop 计数形；reflog `rebase (pick): refactor(cognition): orchestrate_tick 微批三件` 单 pick 在档）。采认。
2. **patch-id 前=后全等**（4935d684…·内容零漂移硬门）——采认。
3. **bare 顶=检出顶**——独立复测对平（§一）。
4. **ahead/behind 0/0**——采认（§一 三面同顶为其充分旁证）。
5. **github 顶对平+备份 ref dev-pre-r2-retire=d98529b 在案**（R2 门②回滚锚兑现）——独立复测对平（§一）。

## 三 · R6b 四件验收（防复发机制面）

- ① rebase 分支退役（behind>0→SKIP-diverged 留人工）——「只推不造」名副其实化·**事故根因机械退役**：采认。
- ② guarded-ff 滤 untracked（`--untracked-files=no`）——**差分实证有值**（21:40 旧码轮 SKIP-dirty→21:41 新码轮 TriCompany 零行·行为差仅 untracked 面=设计意图）：采认。
- ③ 双脚本头职责声明（bare=canonical/github=mirror/检出只认 origin）：采认。
- ④ bak-r6b-20261105T213758 双件备份+diff 留卷+bash -n+CR=0 双侧断言：采认。回滚形=bak `cp` 回原位（零 git 面）。
- 活体冒烟双测（reverse-push 定向 conf 测 trees=1 insync=1+guarded-ff 全树轮 4 树 tracked 拦截语义不变+TriModel FF->2 正向）：采认——22:10 起正式轮继承新码（cron 每轮新读零重启）。

## 四 · conf 隔离处置判定（步 0 收口）

**准删** `/home/fleet/worktree-reverse-push.conf`——双退役条件均已达：
1. github 对齐毕（R6a 步 5 兑现·三面同顶）——回卷源基底消失；
2. R6b① rebase 退役落地——TriCompany 即使在册，behind>0 也只 SKIP-diverged 留人工，机械回卷路径已不存在。
删除后 22:10 tick 起 TriCompany 恢复在册（guarded-ff 新码+porcelain=0=对齐引擎守护恢复）。执行归 SDE·删除回执一句即可。

## 五 · 如实报备三件处置

1. **PAT 落位**（sg fleet `/home/fleet/.git-credentials` 600·1 行）——D-46 候选载入位清点+1 采认入账：**token 轮换窗清点清单须含此位**（挂账：随下次轮换窗三折流程并入）。
2. **root 属主污染归还**（chown -R fleet:fleet 两面+残留断言 0）——采认收口。
3. **hash 引用勘正定谳**：微批施工笔现役正身=**f9ffd0a7a52749fd8217b798cd4a0172de7b3dbc**（eacaab9 系被换底旧链·历史名存档）。本席裁定卷 §五「eacaab9'」预告以本实值兑现；毕报/台账/后续引用以此为准。COO 台账引用勘正归 COO 面（本席知会）。

## 六 · 后续面（非本施工单范围·登记）

- **dev 机 TriCompany 检出对齐候勘**：本席探针实读 HEAD=2b737c80b·`ahead 9` vs 陈旧基线 d98529b（origin=github·fetch Connection reset 网络失败 21:47 窗）——dev 机链与 sg canonical（f9ffd0a7a 链）关系候勘定（R 系列后续·候 github 通道恢复 fetch 对表·本席不动手改）。guarded-ff 域=sg 检出，dev 机检出无自动对齐引擎——人工对齐面候勘定后定。
- R1-R4 系列卷 hash 引用勘正（eacaab9→f9ffd0a7a）候各卷 owner 顺手窗（历史卷卷面勘正附依据留痕）。

## 七 · 使用依据

- SDE 毕报卷 97919a04c（七步表+五读数+R6b 落地+冒烟双测+报备三件）
- CTO 裁定卷 84f50517a（R6a 七步单+R6b 四件+步 0「施工毕全绿前不删」条款）+本席独立复测探针（fleet@sg 只读三面·dev 机 fetch+rev-parse）
- D-42（hash 级断言）/D-46（PAT 载入位清点）/D-47（卷面时戳锚=commit %cI）

—— CTO 小狄（R6 验收门禁·零手打时戳锚=commit %cI）
