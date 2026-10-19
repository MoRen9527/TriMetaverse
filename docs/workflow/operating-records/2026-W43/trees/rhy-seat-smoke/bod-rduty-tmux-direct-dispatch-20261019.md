# r-duty 终端直挂形派工卷（CEO 选 2 裁·tmux 直挂形+旧形残留清退）· 2026-10-19 晚

- sourceOfTruth: 本卷（BOD 裁决收执+派工令正身+web 面勘定读数）
- syncMode: static（派工时点快照·执行态以班组毕报为准）
- lastSyncedAt: 2026-10-19 22:09:03 +0800（date 现查·shell 注入·D-47 双保险）
- 令源: CEO 2026-10-19 21:57「选2. 终端直挂形（需小施工）」（BOD 21:5x 呈二选一接入路后）·同信附问 18790/18791 web 面按值席名开会话之法

## 一·web 面勘定结论（活体现勘·答 CEO 同信之问）

- 通路活体验证：本机 18790→河源 relay3 注 token 302→18791 dsh web（DeepSeek Harness）→cookie 兑换 200 正常进 GUI（沿 bod-dsh-tunnel 隧道·零新增 ssh）。
- **会话级 URL 深链：无**——点开单席（实测 r-duty-cto）地址栏保持 `18791/` 不变；会话操作菜单（置顶/重命名/分叉/归档）与会话头部菜单（下载 Session 日志/反馈）均无「复制链接/新窗口打开」项。dsh web 不支持按 URL 直达特定会话。
- web 面现形答法：**左侧栏「会话」树 → fleet 分组 → 点席位名即开**（13 席常驻会话标题即席位名）；常用席可「置顶会话」浮顶作快捷位。
- 「claude --agent 式按名直达」的等位形=终端面 tmux attach（即本卷方案）：`tmux attach -t r-duty-<席名>` 名字直达——两面互补，web 看/终端挂。

## 二·目标态

河源系统 tmux 默认 socket（/tmp/tmux-1000/default）建 **13 个 tmux 会话，名=r-duty-<席名>**（与班组名册同构·CEO 现行 VS Code profile 命令零改动即用）；每会话跑 claude CLI，cwd=`/home/fleet/.dsh-workspaces/<席名>/`（人格真源=该工作区 AGENTS.md）。与现役 13 席 dsh web 会话**并行互补**：web 形=GUI 面，tmux 形=CEO 终端直挂面。

## 三·派工令（→ r-duty-cos·经 sg TriMC 箱+m-duty-cos 转达双通道）

1. **对象与形**：如 §二；模型/env 与该席 dsh preset 对齐（DeepSeek 轨现役默认），注入法班组自定、落卷留痕（claude CLI 在河源 tmux 形有旧先例=r-duty-sde 旧形，非新地勘）。
2. **硬护栏**：
   - 现役 13 席 dsh web 会话**零触碰**（不重启不重建不发消息）——两会话面对话历史互不共享（人格同源=工作区 AGENTS.md）如实注；
   - **r-duty-sde 旧形残留清退**：清退前先勘无在途产出（git status/未落盘面），确认后 kill 该 tmux 会话+进程，留痕（何起/何进程/何时清）；
   - token/凭据值面零回显（D-46）；只加不改：daemon/cron/现役会话面零触碰。
3. **验收门（BOD 活体验收）**：`tmux ls` 13 席名全在；CEO 正形路径实测（attach r-duty-cos 落入会话·claude CLI 就绪）；r-duty-sde 旧形清零断言。
4. **施工位**：cos 组织——有 shell/终端面即自施工；无则经 m-duty-cos 回报 BOD 改派。
5. **毕报三送**：落卷+回信本箱（target_seat='bod'）+m-duty-cos 抄送；含 tmux ls 全量/逐席进程形/清退记录。
6. **候办（不挡本窗）**：tmux 形开机自愈（keeper）候毕报带方案另批。

## 四·执行链

| 步 | 动作 | 状态 |
|---|---|---|
| 1 | CEO 裁选 2 收执（本卷） | 毕 |
| 2 | web 面活体勘定（§一） | 毕 |
| 3 | 派工令 sg TriMC 箱双信（r-duty-cos 派工+m-duty-cos 转达请托·原子写+回读断言） | 本窗 |
| 4 | 班组施工+毕报 | 候 |
| 5 | BOD 活体验收（§三.3 三门） | 候 |

—— BOD 落款 2026-10-19 22:09:03 +0800（date 现查·shell 注入·发毕对表）
