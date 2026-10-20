# SDE 直证卷 · n1 批量死因诊断（COO 授权①·并发 spawn 竞态定谳）

- tree-id: 1
- charter: charter-2026-W42-001
- syncMode: static（诊断直证卷·COO 授权 03:47:12「并发度 2-3 个诊断 pane·留尸→capture→即删」）
- lastSyncedAt: 2026-10-16 03:52:00+08:00（date 现查原值随发）
- 执行席: SDE 小布（m-sde）

## 诊断三拍（03:47:59-03:49）

| 拍 | 实验 | 读数 |
| --- | --- | --- |
| 1 | 3×同款 sde 并发（毫秒级连发·remain-on-exit 留尸） | 3 pane 全灭·capture 直证：`bash: line 1: claude: command not found`（status 127×3·03:47:59） |
| 2 | env 面三勘探（零 pane） | session env **无 PATH 键**（r-diag-1/sde 双验 unknown variable）·global env PATH=**含 .local/bin 首位** |
| 3 | 同款完整命令链**单发**（source duty-env && set -a && 护栏 && claude·插桩 PATH 探针） | PATH ✓ 含 .local/bin·command -v claude ✓·`claude --version`=**2.1.296 ✓**（链全活） |

## 定谳

**死因=tmux server 并发 new-session 下 pane spawn 的 env 竞态**（PATH 异常→command not found）：

- 非 PATH 配置错：global env PATH 全程正确（拍 2）·同链单发 pane PATH 正确（拍 3）。
- 非 overcommit/malloc：死在 bash 找不到 claude 阶段（status 127）·claude 进程根本没起·malloc 阶段未到——我 03:46 overcommit 定性再更正（如实记：两次误判均由实勘推翻）。
- 分野变量=**并发度**：单发（任意形态）全活·3 连发毫秒级即死·12 连发全灭——竞态窗口在 tmux server 毫秒级连发 new-session 的 pane spawn/env 组装路径（tmux 内部行为·深挖超窗界不展开）。

## 升配裁决实质输入（COO 转呈 CEO 面）

- COO 划两向落定=**「非 abort」向**：批量死因系**软件层并发竞态，升配未必解**——8GB 机上 12 连发同样可竞态死。
- **对症解=串行错峰**（单发全活直证·a 径预案 30s+ 间隔即对症）。
- 内存硬约束**独立存在**（13 席 ~4.9GB vs 物理 1.6GB·0 swap·前卷读数）——与竞态死因正交。
- **CEO 裁面组合**：13 席目标=升配（内存）+串行错峰（竞态）双解缺一不可；2-3 席验证目标=现机串行错峰即可（无需升配）。

## 清场与终态（冻结边界三条全断言）

- 3 诊断 pane kill-session 删净·remain-on-exit 还原 off·/tmp/diag-panes.sh 删。
- 终态：tmux 回 **1**（仅 r-duty-sde）✓·claude 进程计数回 **1** ✓——零残留 ✓。
- claude 侧零残留：诊断 pane 死于 command not found 未达建 session title 阶段；拍 3 `claude --version` 瞬时进程退出·`-n` title 未建（--version 不建 session）✓。
- sde 席全程未扰（created 03:40:38 时戳连续）✓。

## 使用依据

- COO 授权①（03:47:12·并发度 2-3+留尸 capture 即删+冻结边界三条）·前卷 cc3896740（异常卷）
- 活体读数：tmux capture-pane/show-environment（-g/-t 双面）·pane 插桩探针（PATH/command -v/claude --version）
