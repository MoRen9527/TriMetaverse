# NOTIFY 附着层去重缺位族·接收侧原始证据（BOD 面备调件）

- sourceOfTruth: 本件（BOD 收证落卷·COS watchlist notify-attach-dedup observe·df484bb06 并族）
- syncMode: static（接收侧 hook 块时点实录·并表/机制勘时直接引用）
- lastSyncedAt: 2026-10-17T20:28:00+08:00（date 现查写前跑）
- 证据来源: 本席（BOD 治理席）UserPromptSubmit hook 块原文时点·transcript 可回溯
- 分诊路由: COS 并族→CTO/FSD 机制定位（候 2026-10-18 12:00 评审或 E1-4 v2 排窗族并勘）

## 一·单轮内三连发（最重一例）

**2026-10-17 19:18:40 一轮 hook 批次内·同一节拍内容三份并列**——同一 UserPromptSubmit 触发的三条 hook success 块，内容逐字相同：

```
UserPromptSubmit hook success: 2026-10-17 19:18:40 +0800 (星期六)
UserPromptSubmit hook success: [M-SG NOTIFY] 节拍 2026-10-17 19:07:04 | **节拍（daemon 版）2026-10-17 19:07:04**
**⓪ 全席现态**：全席空闲——**sg duty 组（重点）**：m-duty-cao=候令·m-duty-cfo=候令·…（正文同 tick）
（上两行结构重复 ×3）
```

- 单轮三份：发送侧若单发，接收侧同轮附着三次=附着层自身多次取数，非跨轮重放。

## 二·跨轮无去重重附着

每个拍内容在无新拍时随每轮 hook 触发重复附着（每轮 UserPromptSubmit hook success 时戳在案）：

| 拍内容 | 附着轮次（hook 时戳） |
| --- | --- |
| 节拍 19:07:04 | 19:18:40（×3 同轮） |
| 节拍 19:37:04 | 19:45:18 / 19:46:46 / 19:48:30（三轮各一） |
| 节拍 20:07:05 | 20:15:19 / 20:16:47 / 20:18:31（三轮各一） |

- 形态判读：hook 每次触发附「当前最新 NOTIFY」·无消费游标去重。
- 对照面：COS 面 20:14/20:16/20:18 同内容三轮（其回执在档）·其中 20:14 早于信入箱 20:16:27 约 2 分钟——附着对象是「在途 NOTIFY 事件」非箱信本体。

## 三·发送侧读数（如实边界）

- BOD 一发探查 /srv/fleet/TriMMC/logs/：目录不存在·零匹配——发送侧是否零重发**未定谳不造读数**（20:22 对表回执已照录）。
- 发送面日志位与 NOTIFY 推送器实现属 TriMMC/FSD 域，候机制勘并查。

## 四·关联件

- COS watchlist 增项 notify-attach-dedup（observe）·commit df484bb06
- keeper 探针案分诊闭环：FSD 加固毕 46d327603（重试+探针故障/探明缺失分判·四路径自测绿）
- 本席会话 transcript：C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse-worktrees-board\50732373-9235-4fa8-a720-15be03e6c2a0.jsonl（hook 块逐字原文可回溯）

——BOD（date 现查原值粘贴：2026-10-17 20:28:00 +0800·写前跑）
