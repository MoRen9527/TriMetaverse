# 四 COS 互备方案（CEO 令·核实现状+互备形+记账）

- sourceOfTruth: 本卷（四 COS 互备现状与方案·COS 主）
- 令源: CEO 16:4x「四 cos 的互备，现在 TriRMC 的 cos 可用了，把他和 M 面的 cos 互备搞起来，TriRLC 给我个结论，他的 cos 应该还没就位，可以先记账」
- 时点: 写前现查 2026-11-24T16:52+0800（D-47 原值）

## §一 · 四席位现状（现查实证·2026-11-24T16:48~16:52）

| # | 席位 | 面/域 | 机位 | 状态 | 实证 |
|---|---|---|---|---|---|
| 1 | **m-cos**（本席） | M 面·本地域 | 本机 D:/Code/ai | **✓ 在跑** | 本会话 |
| 2 | **m-duty-cos** | M 面·服务域 | sg 47.245.122.61 | **✓ 在跑** | `claude --resume m-duty-cos --agent CEOChiefOfStaff`（Nov 20 起·tmux m-duty-cos） |
| 3 | **r-duty-cos** | R 面 | 河源 8.155.54.79 | **✓ 在跑** | `/home/fleet/.dsh-workspaces/r-duty-cos/...run-web-masked.py`（Nov 04 起） |
| 4 | **TriRLC cos** | R 面·本地域 | 本机 ../TriRLC | **✗ 未就位** | `../TriRLC/.claude/agents/ceo-chief-of-staff.md` **定义在**·**无运行实例**（~/.dsh-workspaces 空） |

**CEO 判验证**：TriRMC cos=可用 ✓（r-duty-cos 在跑）；TriRLC cos=未就位 ✓（定义在但无实例）。

## §二 · 互备三件（核心义务）

1. **任务台账双写**：每席各自台账 + 关键任务跨席镜像（防单点丢失；与既有「服务域 COS 与本地域 COS 互备+交叉验证」条一致）。
2. **交叉验证**：重大判定（点火/批据/台账销账）由 ≥2 席独立核后落定（D-89 对照窗精神）。
3. **故障接管**：任一席不可用→其域任务由互备席接管（台账转移+状态接续），恢复后回切。

## §三 · 通道现状（跨机=不同于同机 SendMessage）

| 通道 | 形 | 可用性 |
|---|---|---|
| 本机 ↔ sg | ssh fleet@47.245.122.61 | ✓ |
| 本机 ↔ 河源 | ssh 8.155.54.79（直连） | ✓ |
| sg ↔ 河源 | ssh -J（memory 载） | ✓（候验） |
| 消息层 | 同机=SendMessage；**跨机=notify/信箱/tmux send-keys** | **待建**（互备消息通道） |

**缺口**：**跨机互备消息通道未建**（同机会话消息不可跨机）——**建议**：①以 notify 信箱（sg/R-HY 面）互发要点摘要②tmux send-keys 直投对方会话③台账落卷互读（git 同步面）。

## §四 · TriRLC cos 记账（未就位）

- **定义**：`../TriRLC/.claude/agents/ceo-chief-of-staff.md` 在
- **实例**：无（~/.dsh-workspaces 空）
- **记账**：**候其启动形落位后并入互备**（不预建空实例·防假绿）

## §五 · 待办

1. 跨机互备消息通道（notify 信箱/tmux 直投）——候 CTO/SDE 技术面评估
2. 首轮互备演练（一次跨机交叉验证实跑）
3. TriRLC cos 启动后并入

---
—— COS 小贾（m-cos·四 COS 互备主办）·写前现查 2026-11-24T16:52+0800（D-47 原值）
