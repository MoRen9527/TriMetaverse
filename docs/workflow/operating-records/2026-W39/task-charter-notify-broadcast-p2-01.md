# 任务书 TASK-NOTIFY-BROADCAST-P2-01：NOTIFY 通道全席广播扩面（LG-052）

- **发令**：BOD 立单（CEO 2026-09-24 23:14 批 LG-052+排期令；立项依据=BOD 能力边界三事实源码实证，台账 mirror 1066 行）
- **承接**：FSD 主笔（TriMMC/TriMLC 代码面）+SDE 部署面协同；经 COS 流转 COO 裁量派工
- **face**：M 面（本机为主，阶段二触 sg）
- **收口回报截点**：2026-09-26 12:00 +08:00（两阶段+阶段门，阶段一毕即报 BOD 验收再开阶段二）

## 一、现状与目标（能力边界三事实，源码实证）

NOTIFY 通道现役 MVP：①发端名册 `TARGET_SEAT_ROSTER` 仅 bod/coo 双投（TriMMC `src/notify/outbox.ts` L40-43）；②源席白名单 `SOURCE_SEAT_WHITELIST` 仅 m-duty-cos 单条（L45）；③本机收端消费 hook 仅 BOD 一席装设（TriMLC `src/notify/puller.ts` 支持 seats.json 名册化寻址，13 席中仅 BOD 有信箱读取 hook）。目标=扩为全席广播：一稿多投 13 席+sg 值席收端。

## 二、活（两阶段+阶段门）

### 阶段一：本机面（13 席广播可达）

1. **发端名册扩面**：`TARGET_SEAT_ROSTER` 扩至 13 席正名（名册取 seats.json 正名制口径，daemon=trimlc）；源席白名单按需扩（BOD/COS/COO 治理链三席入列，m-duty-cos 保留）；
2. **广播语义**：一稿多投=发端展开为 N 件（逐席独立 message_id 派生保幂等，三态 accepted/forwarded/delivered 逐席可见逐席对账）——不采 target_seat="all" 单件制（三态追踪失真）；API 入参增 targets 数组或广播旗标，4KB/TTL/限速/上限约束全部保持；
3. **收端消费面**：12 席收信 hook 配置（UserPromptSubmit 读 notify-mailbox.json 过滤 `target_seat==<席名>`；注意各席 worktree settings 配置位+D-07 发布面渲染链不手编）；
4. **TriMLC puller 回归**：seats.json 名册核对（TRIMC_NOTIFY_SEATS_FILE 配置位确认）、FIXED_ROUTE 白名单与扩后名册一致性、幂等/TTL/限速测试全绿。

### 阶段门：BOD 验收阶段一（一稿多投端到端实测本机 N 席到信）后放行阶段二

### 阶段二：sg 值席收端面

5. sg 值席（m-duty-cos 等）收信消费面设计+落地（tmux 席位消费/树协议衔接，m-duty-cos 留痕制兼容）；跨面端到端实测（本机发→sg 值席收→confirm 三态回写全绿）。

## 三、验收锚

- A. 阶段一端到端实测：一稿多投发出→≥3 席抽样实收（含 hook 弹信/信箱落箱）→三态 delivered 全绿读数；
- B. 回归读数：既有 bod/coo 双投行为零变化+幂等/TTL/限速/4KB 上限/200 上限全部用例通过（STE 门禁）；
- C. 阶段二跨面实测：sg 值席实收+confirm 回写读数；
- D. 配置面清单：12 席 hook 配置位逐席列表+seats.json 名册读数；
- E. 通道口径公告件（新能力启用通报，随收口发全席首投实测）。

## 四、边界

- TriMLC/TriMMC daemon 重启照纪律（stop/start 权威路径禁裸杀；重启窗避 14:00-18:00 高峰暂停令）；既有 bod/coo 行为零变化；
- sg 树在途 WIP（tri-model-3333 树）不扰；LG-041 实施树在途不阻（本单独立树）；
- 通知内容面（谁可发什么）治理口径不在本单（本单只扩通道能力，源席白名单最小扩治理链三席）。

## 五、回报格式

五锚读数+阶段一/二分段回报+树指针（落承办席所在树 W39）。BOD 阶段门验收+收口销账知会 COS。
