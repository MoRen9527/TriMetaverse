# LG-059/060 技审方案面·TC502 追平前置技术路径核（batch-13 件③ 单 2）

- date 现查: 2026-10-02 09:3x CST
- 审读对象: tc502 卷收口路径 §3.1「本机 TC 源侧追平：`git pull --ff-only origin dev`（本机若另有本地提交先 rebase 对表）」
- 结论先行: **路径合规且为首选形态**——ff-only 的 fail-safe 语义（分叉/重写/脏撞面一律「拒」收场，拒=转人工闸，不可能静默错合并）；真正要防的是拒之后的错误动作（merge/强对）。合规=带四道闸执行；附 sg 侧活例一处（本席现势勘得，需 FSD 段知悉）。

## 一、路径核（四道闸）

**闸 1·上游唯一性**：pull 仅对 `origin`（sg bare——hub 星型拓扑唯此上游正形）；GitHub 面禁 pull（「GitHub 分支=sg 线」单 remote 纪律）。✓ tc502 原文形态合规。

**闸 2·本地独有件清点（ff-only 前置）**：`git rev-list --count origin/dev..dev` 实勘；>0 → 先归枝（`branch backup/...` 保全）或按 tc502 原文 rebase 对表；=0 → 直 `pull --ff-only`。

**闸 3·重写分叉闸（TC 特有主 hazard——两次实证在案）**：TC dev 已两度 force 重写（09-24 token 案 8a5b630、09-28 D-3x 批 origin/dev forced-update d9cd33f→8d9fdc8）。ff-only 遇 non-FF「拒」=正确失败形态；此时**禁 pull-merge、禁 rebase-onto 旧基**，正形=DE checklist 先例（09-24 token 案）：独有件归枝确认 → `reset --hard origin/dev` 硬对齐 → 重挂归枝（cherry-pick/branch 合入走正常窗）。硬对齐前置双确认=①`rev-list origin/dev..dev` 清单逐笔定属（独有真件 vs 已被重写吸收的旧基影）②在途隔离件 stash 名单留痕。

**闸 4·在途隔离件**：本机 TC 工作树在途件（IPD 培训件+presets 系等 pathspec 隔离态）——modified/untracked 不阻 fetch；若与 incoming diff 撞面则 checkout 中断=pull 失败（无害拒）。pull 前 `status --short` 快照留痕；撞面=stash 命名隔离（LG-046 隔离纪律先例同形）。

**追平后动作闸**：渲染管线「源侧正名态前置断言」（batch-07 已裁防复发件）跑绿后方准渲染链复跑——追平是必要条件非充分条件；追平动作只进不出（pull 零推送语义）✓。

## 二、sg 侧活例现势（本席 09:3x 勘得，FSD 段需知悉）

sg TC 仓本席实勘：**本地 dev（tip=63b8c3a，FSD WO-A 六处正名）与 origin/dev（tip=8d9fdc8）分叉态**——`rev-list` 双向计数 4/83，WO-A 父基=d9cd33f（**已被重写弃用的旧基**），origin 系 83 笔不含 WO-A。即：**WO-A 现悬于死基，未上 origin**。

处置裁条（归 FSD 段，本席不代动）：①`branch preserve/wo-a-63b8c3a 63b8c3a` 归枝保全；②`reset --hard origin/dev`（闸 3 正形）；③WO-A 六处单 token 替换 cherry-pick 回挂（低冲突概率，撞面则人工对表——六处皆禁令句名替换，三侧文件现势已在重写系中核过 2K+0 残态则可能已含或需重放，以复扫为准）；④回挂后 FF 推平 origin。**此例同时实证闸 3 的必要性**——tc502 本机追平若遇同形分叉，同律处理。

## 三、结论

`pull --ff-only origin dev` 合规、首选、fail-safe ✓；tc502 §3.1 原文可执行，附本卷四道闸+sg 活例处置裁条为补充正形。方案面零代码动笔 ✓；本席仅旗 FSD 段（WO-A 归枝重挂），不动仓。
