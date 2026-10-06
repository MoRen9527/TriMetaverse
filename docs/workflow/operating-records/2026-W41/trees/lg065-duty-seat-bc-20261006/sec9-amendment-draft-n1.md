# §9 修订稿 · 值席位载体改「sg 独立会话」（LG-065 N1）

- sourceOfTruth: 本稿（修订草案·候 CAO 会签后落正身 `TriCompany/docs/workflow/cyber-company-secretariat.md` §9.1）
- syncMode: static
- lastSyncedAt: 2026-10-06T17:3x+0800（hook 现查 17:30）
- 受理依据: task-charter-duty-seat-bc-20261006.md（07683648·CEO 17:21 批令）N1 节「§9 修订呈 CAO 会签随走」
- 修订原则: 最小 diff——只改载体条款，黄金段全责条款（§9.2 班段表）不动

## 修订 diff（§9.1 值守角色 第 1 条）

**现行**（2026-09-30 版）：

> 1. **值席位**：常设行政班次岗位，由 COS 面承担（通信正名 m-duty-cos，单席值不设多席同值）；

**修订为**：

> 1. **值席位**：常设行政班次岗位，由 **sg 独立值席会话**承担（通信正名 m-duty-cos，sg tmux 常驻 7×24 独立会话；与本地域 COS 会话进程/上下文/生命周期全隔离；闲置零消耗、唤醒才计费；单席值不设多席同值）〔2026-10-06 修订：值席位载体由「COS 面兼任」改「sg 独立会话」——LG-065 值席 b+c 组合案 N1·CEO 17:21 批令；黄金段全责条款（§9.2）不变〕；

## 不动条款清点（防夹带）

- §9.2 班段表（黄金段 18:00→次日 14:00 全责段/禁窗段减配不空窗）：**不动**（任务书明令保留）。
- §9.1 第 2 条兜席位=BOD：不动。
- §9.1 第 3 条值席三责/第 4 条值席三不：不动。
- §9.3 告警消费衔接/§9.4 排班载体：不动。
- 本文件行 33「COS 职责定谳」节 sg m-duty-cos 与本机 m-cos 互备交叉验证表述：不动（与本修订兼容——互备关系在，载体独立化）。

## 事实锚（活体现探 17:2x）

- sg fleet tmux `m-duty-cos` 会话在册（created 2026-10-03 22:45:36·pane 活·「值席候令中」）；启动形态=`tmux new-session -d -s m-duty-cos -c /srv/fleet/TriMetaverse source /home/fleet/.trimmc/duty-env && set -a && claude -n m-duty-cos --agent CEOChiefOfStaff --append-system-prompt-file .../ceo-chief-of-staff.session.md`（进程 3136462）。
- 即：独立会话实体 10-03 已先行在役，本修订=制度面追认现势+黄金段全责衔接成文。

## 会签与落卷流程

1. CAO 会签本稿（内容面+归属面双认）→
2. 会签毕落正身 secretariat.md §9.1（TriCompany 仓·CAO 域文档由 COS 代笔落卷留 CAO 会签锚）→
3. N1 收口回执带本稿 commit+会签锚。
