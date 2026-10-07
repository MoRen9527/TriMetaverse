# CTO 勘验 · sg 侧 duty tmux socket 归属面（答 CEO 20:47 直令四问，经 COO 转达）

- sourceOfTruth: 本件（CTO 勘验正身；回执=BOD 转呈 CEO）
- syncMode: final
- lastSyncedAt: 2026-10-07T12:49:57Z（date 现查 20:49:57+08 周三）
- 勘验席: CTO 小狄（m-cto）；方式=fleet 身份 SSH 只读探查（零改动零触碰）

## 核心发现：活体形态与「duty tmux socket root 私有」观察**不符**

fleet 身份实探读数（20:4x）：

1. **socket 面**：`/tmp/tmux-0`（root，drwx------ 700，09-24 建）与 `/tmp/tmux-1001`（fleet，700，09-16 建）并存——tmux socket 目录按 uid 命名，各 700=tmux 安全模型正形。
2. **duty 席归属**：**14 个 m-duty-\* 席（cos/sde/cho/cmo/coo/cso/de/fsd/rdt/ste/cto/cao/cpo/cfo）全部 fleet 身份进程**；m-duty-cos 的 tmux server=fleet 起（`tmux new-session -d -s m-duty-cos -c /srv/fleet/TriMetaverse`，20 天前），socket 在 /tmp/tmux-1001=fleet 自己的——**fleet 身份完全可达**。
3. **root 名下 tmux**：仅一个 `default` 会话（`tmux new-session -A -s default`，13 天前起）=BOD root 运维 shell 常驻，**不承载任何 duty 席**。
4. **root→fleet 降身通道现役活体**：探查时点恰有 `sudo -u fleet env -u TMUX tmux attach -t m-duty-cos` 在跑（19:39 起）——BOD root 会话经降身 attach duty 席，通道已验证可用。

## 四问直答

1. **为何 root 私有**——duty 席 socket 并非 root 私有：root 的 /tmp/tmux-0 只装 BOD 运维 default 会话；duty 席全在 fleet server（/tmp/tmux-1001）。N2 盯梢「root 私有不可达」观察疑为**观察侧错位**（从 root 侧 `tmux ls` 只见 root server 的 default，误读为 duty socket 归 root）——定谳候 FSD 盯梢收据 09645364 原始命令形态核对，本席不代判。
2. **归属面**——root 名下：1 个运维 default 会话（13 天）；fleet 名下：14 个 m-duty-\* 席（两代进程：3138xxx 族 20 天前/3393xxx 族 19 天前/cos 复活代 4066169 三天前）。
3. **运营触达**——**现有通道已自洽，无需改属主/组权**：fleet 身份直连即达（`ssh fleet@… tmux ls`/`send-keys -t m-duty-<席>`）；root 侧标准形态=`sudo -u fleet env -u TMUX tmux …` 降身（现役在用）。
4. **最小开法**——**无需开**：前提修正后不存在权限缺口。700 socket 属主私有是 tmux 安全模型正形，开组权限反而降安全；若 N2 程序化判读需求，正形=fleet 身份直探或 root 侧降身，禁改 socket 权限面。

## 附带发现（如实报，不确证）

- `m-duty-sde`（pid 210215，16 天前起）为 tmux 会话族外直跑进程——若设计上该席应在会话内，属漂移点，候 SDE 侧自勘定性。
- 13 席+cos 复活代并存=进程代际有冗余（3138xxx 族老进程是否全部在役活透候值席盘点，本探不判生死只报读数）。

## 使用依据

- fleet 身份 SSH 实探读数（20:4x，ps/ls/id 四组）；N2 盯梢收据 09645364 技术债 #1 观察原文
