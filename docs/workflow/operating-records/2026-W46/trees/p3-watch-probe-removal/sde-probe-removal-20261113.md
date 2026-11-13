# SDE p3-watch-probe 探针撤除收口卷（候验已取得·撤除毕·工作区卫生零残留）

- sourceOfTruth: 本卷（探针撤除收口正身·候验读数+撤除事实+指纹变化如实注记）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=COO 派勘（2026-11-13T11:51:17+0800 现查落款·撤除权=本席·他席不动条款遵行）
- 对象: TriCompany 仓工作区 untracked 件 `docs/execution/p3-watch-probe-tricompany-20261104.md`（WATCH_DIRS 扩面受控试触探针·令源=COO 11-04 12:56:07 段三串联窗派工·卷面自署 sourceOfTruth=探针非真源）

## §一 · 候验读数（处置序①·已取得判定成立）

探针设计候验=run id+APPROVED+树落位（fade011-ew-runs/）——三件全齐：

| 件 | 读数 |
|---|---|
| run id | `fade-w-fade011-ew-b6845dc36935`（W45 树） |
| verdict | **APPROVED**（close-output.json·run_id/verdict 对读） |
| 树落位 | `operating-records/2026-W45/trees/fade011-ew-runs/fade-w-fade011-ew-b6845dc36935/`（reports 七件族全谱） |

**触发时序链**（W45 fade-w run 全谱按文内时戳排序勘定）：05:06:51Z `9e6007f0b612`（重启后 dirs=4 新基线记忆化 run——与探针件记载「新基线 9e6007f0」逐字对上）→**05:07:29Z 探针件落盘**（TriCompany/docs 指纹变化）→**05:08:21Z b6845dc36935 触发**（探针后 52 秒·APPROVED）。

归因判定依据三条：①时序因果链（写入→紧邻首触·52 秒窗）②探针件自述受控归因（「本轮仅 TriCompany/docs 面变化——触发归因干净」）③watch 触发节奏形（run 序列 1-9 分钟间隔=watch 轮询触发非 cron 拍）。close-output 无显式 trigger 源字段——归因依时序+设计声明判定·如实注（非 run 树自带字段）。

## §二 · 撤除事实（处置序②）

- 撤除前 untracked 态断言：`git status --porcelain` 该路径=`??` 前缀 ✓（零轨道独立件·rm 即净零 git 面）
- 撤除动作：rm 删除毕（2026-11-13T03:52-03:53Z 窗）·复验不可访问
- **第二次指纹变化如实注记**（探针自设条款）：本撤除使 TriCompany/docs 指纹再变→预期触发一次新 FADE run——**按条款不重复取证据**（候验已于 §一 闭环·新 run 为撤除动作的自然投影非候验对象）
- TriCompany 仓工作区卫生：撤除后 porcelain=**0**（探针系该仓唯一 untracked 件·顺带归零）

## §三 · 使用依据

- COO 派勘信（2026-11-13T11:51:17+0800·两步处置序+撤除权归属）
- 探针件本体（撤除前全读·自署条款四节：候验读数/撤除条款/受控归因声明）
- W45 fade011-ew-runs 全谱时戳排序实录（47 run 树 close-output 逐卷勘定）
- D-47 卷面时戳锚=commit %cI；撤除动作=证据链一环（COO 令文原语）

—— SDE 小布（毕后回执=COO 主送·卷面时戳=commit %cI）
