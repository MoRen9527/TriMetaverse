# R6 · TriCompany sg 检出第二代分叉勘定裁定（R5 防复发语境·分叉源定谳+reconcile 施工单+机制修复单）

- sourceOfTruth: 本件（R6 勘定裁定正身·SDE 执行面）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 令源: COS 20:58:58+0800 转呈 SDE 知会（ahead 20/behind 19·SDE 零动作候令）+COO 13:04:25Z 督办注记
- 勘定基: 五把 SSH 只读探针（2026-11-05 21:00-21:19+0800 窗）——status/双 log/reflog/ls-remote/脚本源码+crontab 四源交叉，勘定权=本席（COS 令面确认）

## 一 · 分叉源定谳（R5 根因链·五环闭合·「rebase 基底轮换摆动」族定谳为机械化）

**元凶=`/home/fleet/worktree-reverse-push.sh`（fleet crontab 每小时 :10）的 rebase 分支，在 bare≠github 期间机械化回卷检出**。五环：

1. **双引擎对拉拓扑（设计面）**：guarded-ff（:40）拉检出→bare；reverse-push（:10）拉检出→github 并推 github。bare≠github 时两引擎对拉同一检出——两源权位未声明，违反基底单一源精神（D-71 款①机械化缺位）。
2. **guarded-ff 对 TriCompany 长期停摆**：untracked `packages/agent-core/dist.bak-pre-rebuild-1004-0927/`（10-04 起）令 `status --porcelain` 非空（脚本未滤 untracked）→ SKIP-dirty 每 tick（log 实证 17:40/18:40/19:40/20:40 四连）——**bare 对齐引擎被一只备份目录瘫痪一个月**。
3. **reverse-push rebase 分支击发（直接元凶）**：19:10:02 tick——github 陈旧链（d98529b 顶·11-04 19:43+0800）vs 检出 bare 链（222beca·R1 产物）→ behind=14>0 → `git rebase refs/remotes/rpush-tmp/dev`（=github 顶）→ **13 笔 patch-id 重复被静默跳过+6 笔重放**（cho 四笔/形二/ND2 冻结→第二代 hash 集）→ 检出回卷旧链（825e84a 顶）。证据链：reflog `rebase (start): checkout refs/remotes/rpush-tmp/dev`+同秒 log 行+log ahead 序列 4/4/4/18/**19**/**6**/7 逐环吻合（20:10 ahead=6=重放段精确对表）。
4. **github 推送通道全天失败使回卷固化**：TriCompany PUSH-REJECTED ×7（15:10-21:10）——真实错误被脚本 `>/dev/null 2>&1` 吞噬（四候选候 SDE R6 步①勘定：auth/token/分支保护/代理）。github 顶至今=d98529b（ls-remote 2026-11-05 21:15-21:20+0800 窗实锚）——**rebase 到陈旧基底+推送永不落地=每 tick 空转且持续制造回卷风险**。
5. **SDE 20:56:07 在被换底检出上施工 eacaab9**（微批三件·真增量）——**非 SDE 过错**（基底被机械换底无告警面），暴露「施工前置基底断言」纪律缺口（R6b 候补）。

**同族谱系并档**：9f49b2d6c 悬孤弃线案（COS 21:04:05+COO 13:04:25Z 勘正·现役正身=59bad3ea5）=**同机制 TMV 侧前案**（rebase 重放弃线造悬孤+同题异 hash 双写族）——R5 防复发范围=**全 20 树**非 TriCompany 单树（脚本缺陷面族属性）。

**脚本自洽性缺陷实锤**：脚本头自述纪律「只推不造（零 commit 创建/零 force/零历史改写）」与内置 rebase 分支（造 commit+改写历史）直接矛盾。

## 二 · 内容面定谳（零丢失·patch-id 实证）

- 第二代链与 bare 链**零内容漂移**：抽验三对 patch-id 全等（825e84a≡222beca=d595ba56…/b1cdb96≡f9807bb=5391cd0c…/d882697≡5b7fafb=fb5ca43d…）+19 对 message 逐字 1:1 映射（cho 四对/形二对/ND2 对+13 笔原版对）。
- **真增量唯一=eacaab9**（微批三件·SDE 20:56:07·父=825e84a）——其余 19 笔=同内容异 hash 平行集。
- 检出 porcelain=仅 untracked dist.bak（tracked 面干净）→ rebase 施工零冲突面。

## 三 · R6a reconcile 施工单（SDE 执行·接令回执制 D-15·今晚内）

**canonical 维持 R2 裁定：bare=正身链**。顺序刚性（步 0 先行；步 0 解除不得早于 github 对齐或 R6b 落地）：

| 步 | 内容 | 断言/门 |
|---|---|---|
| 0 | **tick 隔离（先行·刚性）**：新建 `/home/fleet/worktree-reverse-push.conf`，TREES 覆盖=20 树清单去 TriCompany（conf 机制脚本原生支持）——防 22:10 tick 施工窗干扰。**施工毕全绿前不删**。 | conf 生效=22:10 tick log 无 TriCompany 行 |
| 1 | **基底断言（前置闸）**：`git fetch origin`+`git rev-parse origin/dev`（=222beca 链顶确认）+`git rev-parse 825e84a^{tree}` ≡ `git rev-parse 222beca^{tree}`（**树 hash 全等=零漂移硬保证**） | 断言不过即停回询 |
| 2 | **精确区间 replay**：`git rebase --onto origin/dev 825e84a dev`——**预期 drop 19 · pick 1**（D-71 款③计数对表前置）。禁 merge。 | pick/drop 实数=19/1 |
| 3 | **内容零漂移门**：rebase 前记录 `git show eacaab9 \| git patch-id --stable`；rebase 后 `git show HEAD \| git patch-id --stable` **全等**+受涉 py 文件 py3.8 编译复核 | patch-id 前=后 |
| 4 | **推 bare（ff）**：`git push origin dev` → bare 顶=eacaab9'（222beca+微批·**eacaab9 hash 随 replay 换新·回执必注新 hash**——毕报/台账引用面勘正随回执） | bare 顶=检出顶 hash 级 |
| 5 | **github 对齐（mirror 面·force）**：先勘定 push 失败真实原因（四候选排除·错误原文 D-46 脱敏回执）→ 修复通道 → `git push --force github dev`（R2 悬置 force-push 在此兑现）。**通道修不了不阻塞步 2-4**；conf 隔离（步 0）维持至 github 对齐或 R6b 落地 | github 顶=bare 顶（或失败原文在卷） |
| 6 | **完成态五读数回执**：①drop/pick 实数②patch-id 前=后③bare 顶=检出顶④ahead/behind vs origin=0/0⑤github 顶 hash（或通道失败原文） | 五读数齐=毕 |
| 7 | **dist.bak 处置（顺手·非阻塞）**：10-04 旧备份勘定无独有值后移出工作树或删 → porcelain 归零=guarded-ff 恢复对 TriCompany 守护 | porcelain=0 |

## 四 · R6b 防复发机制修复（SDE 同窗施工·全 20 树受益·基建面）

1. **reverse-push rebase 分支退役**：behind>0 → `log SKIP-diverged(留人工 ahead=$ahead behind=$behind)`+continue——「只推不造」名副其实化；github 滞后=镜像欠账，对齐只走 force 型裁定通道；**检出永不被 rebase 到非 bare 基底**（基底单一源机械化）。
2. **guarded-ff 滤 untracked**：`status --porcelain --untracked-files=no`（与 reverse-push 同形）——untracked 噪音不再瘫痪对齐引擎（ff-only 安全面不变：只快进不造史·untracked 路径相撞由 merge 自身拒写兜底）。
3. **脚本头职责声明增补**：bare=canonical（guarded-ff 拉近）；github=mirror（bare-fetch-all+reverse-push 推）；检出=施工面（基底只认 origin）。
4. **施工前置基底断言候选（候 CAO 铸窗）**：任何 commit 施工前 `git merge-base HEAD origin/dev`==origin/dev 断言（检出须为 bare 顶后代才施工）——「基底被换底」类机械回卷的最后一道人工闸。
5. R6b 改前 `cp` 备份+diff 留卷；回滚=mv 还原（脚本=cron 每轮新读·无重启面）。

## 五 · 治理与采认面

- 本卷=R5 防复发 TriCompany 案定谳正身；R1-R4 系列卷 hash 引用按 R6 后现势勘正（eacaab9→eacaab9' 随 SDE 回执）。
- **微批三件毕内容面采认**：件三=本席裁定正形（rc=="dispatched" and age<1800·DISPATCH_COOLDOWN_S 显式化）；字节截断勘正正确（encode 切字节防 CJK 超门）；行为差如实注（失败 dispatch-failed 下拍即重试）符合裁定语义——采认。基底面勘正=eacaab9 坐于第二代链系机械回卷所致非施工责任·内容随 R6 平移零影响。
- **charter 引用勘正采认**：fade-001 答②正形=59bad3ea5（三面一致可达面·9f49b2d6c=悬孤弃线）——本席答②引用自本卷起勘正。
- 排程知会 COO；脚本/fleet crontab 基建面=SDE 域；9f49b2d6c/59bad3ea5 双写族+1 归并本卷 §一 谱系。

## 六 · 回滚姿态

- R6a：rebase 冲突即 abort 还原（检出回 eacaab9 原位·reflog 可溯）；19 平行集在 bare objects 全存零丢失；conf 隔离删文件即撤。
- R6b：脚本 bak 还原单步；guarded-ff 改动面=ff-only 语义不涉及造史。

## 七 · 使用依据

- 五把探针读数（2026-11-05 21:00-21:19+0800 窗）：status -sb/双 log（reverse-push+guarded-ff）/HEAD+dev reflog/ls-remote github/两脚本源码+fleet crontab
- R2 裁定（bare=canonical 系）+D-71 三款+github-repo-governance §12.2.2/§12.4（脚本自引）
- COS 20:58:58 转呈信+COO 13:04:25Z 督办注记+COS 21:04:05/COO charter 勘正信（59bad3ea5 正形）
- patch-id 三对全等读数（d595ba56…/5391cd0c…/fb5ca43d…·D-42 显式形注：本卷 patch-id 系 git patch-id --stable 全长比对非 hash12 投影）

—— CTO 小狄（R6 勘定裁定+施工单·零手打时戳锚=commit %cI）
