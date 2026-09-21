# per-seat git worktree 立项·设计件（CTO 主笔直呈 CEO）

- sourceOfTruth: 本件（立项设计正身；CEO 03:12 令直呈批——BOD 不做中间质检）
- syncMode: draft（候批）
- lastSyncedAt: 2026-09-22T03:1x+0800
- 上位: parallel-cost-eval 合流件（CEO 02:52 批——混合制四层+per-seat worktree 技术优选执行启动）

---

## 一、目标与形态

**目标**：TMV 仓 13 席各自独立 git worktree（独立 index+独立工作树）——结构性消灭共享 index 竞态（staged 互吞/index.lock 撞锁两类，48h 实证 4 例）。

**位置与命名**：`D:/Code/ai/TriMetaverse-worktrees/<seat>/`（**仓外独立目录**——防发布面/渲染面/扫描工具误吞；`.claude/` 内会与渲染产物混淆，弃）。13 席+board=14 worktree。

## 二、分支策略（关键技术决策）

**git 硬限制**：同一分支不可双 worktree 检出——13 席不能都挂 `dev`。

**裁=per-seat 分支制**：每席 worktree 挂独立分支 `wt/<seat>`（基于 dev 创建）；合流流=席位 commit 在 `wt/<seat>`→push bare `wt/<seat>`→**dev 归账照旧**（编排/值席 ff 或 merge——与现役 sg 回流同构，机制无新增）。

- 推线不变：席位 push 自己的 wt 分支至 M-SG bare（现有远端能力覆盖）；
- dev 快进责任：归账席（现役 COS/值席流程）定期 ff dev——**归账节奏纪律候批后入册**（建议：每日收口批顺带）；
- 风险与解：wt 分支落后 dev 过久=合流冲突大——归账纪律+席位 rebase 习惯（与现役 sg 回流先例同管理）。

## 三、会话衔接与切换窗（重量级工程，须明示）

**真收益的前提**：席位会话 cwd 切到各自 worktree——**13 席 CC 会话 cwd 切换=逐席重启**（tmux 会话内 cd 后需会话重启才全量生效——CC 会话级操作）。

**切换窗设计**：
- **渐进试点制（不一次全切）**：第一批=高竞争 3 席（FSD/BOD/COS——48h 竞态主要参与方）切 worktree+跑一周；验证（竞态三计数/工作流摩擦反馈）后全量铺开；
- 窗口合规：D-29 低活窗+逐席操作留痕（m-duty-cos 制）；
- 现役在途件：切换时点选各席「无未 commit 在途」时（切换前 status 三查）。

## 四、三计数周报（生效判据）

互吞/index.lock 竞态/stale 动作三计数入 COS 周报——**混合制生效判据=计数归零趋势可测**（试点周=首批 3 席计数应归零；未切席位照旧计数=对照组）。

## 五、执行分期

1. **一期·零风险部署（FSD）**：worktree add×14+分支创建+位布局验证（不切会话，零风险——worktree 仅存在不使用亦无害）；
2. **二期·试点切换（候你批）**：FSD/BOD/COS 三席 cwd 切换+一周试跑+三计数观察；
3. **三期·全量铺开**（候试点验证）：余 11 席逐批切换（低活窗分批）；
4. **归账纪律入册**（随二期）：wt 分支归账节奏进收口批流程。

## 六、回滚

worktree remove×N+分支删除+会话 cwd 切回主树——全量可逆（主树全程未动，零风险保底）。

## 七、使用依据

parallel-cost-eval 合流件（CEO 02:52 批）；CTO 技术面 bfb429b7（混合制第 2 层设计）；48h 竞态四例实证；git worktree 原生能力（单分支单检出限制→per-seat 分支制）。
