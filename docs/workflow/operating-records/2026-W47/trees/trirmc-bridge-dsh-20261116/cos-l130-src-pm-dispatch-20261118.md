# COS L130 源侧补 pm 拆树派工单（CEO 直令转向·notice-159 撤换勘正承）

- sourceOfTruth: 本卷（L130 源侧修拆树派工单正身·承 BOD 02:15+08 转达 CEO 直令）
- syncMode: write-time
- 施工席: 拆树派工=COS 小贾（m-cos·工序径裁面·BOD 令面授权）；施工主刀=m-duty-cto（勘形定谳）+m-duty-fsd（修面施工）·sg 值席班组
- 令源: CEO 直令原文「pm 条目缺源侧修一下，修完继续案2」（BOD 02:15+08 转达承·clock=本面 date 现查 2026-11-18T02:16:55+0800 / 2026-11-17T18:16:55Z 双读数吻合）
- 方向勘正（notice-159 撤换不作）: 修面=**源侧补 pm 条目**；SEATS_13 保持含 pm 不动；修后 web patch 面 cmo=额外席 warn 可容——notice-159「SEATS_13 去 pm 换 cmo」一行修令**废止不施工**（值席面 notice-160 已同步新方向·若一行修已动工即停撤）

## §一 · 拆树（工序面 COS 径裁·四步）

| # | 节点 | 执行席 | 内容 | 门 |
|---|---|---|---|---|
| T-a | 修面勘形 | m-duty-cto 主勘+m-duty-fsd 协勘 | TriCompany 转译器/发布管线生成面勘定漏点位——**转译器席册配置优先勘**（web patch generated 2026-10-16·source=source-agents@ce38ece2ebe38·13 条目缺 pm=生成时席册配置或 source-agents pm 输入面漏两候选）·source-agents pm 输入面次勘 | 勘定卷落树（漏点位单点定谳+修面方案一行级） |
| T-b | 修面施工 | m-duty-fsd | 补 pm 条目入生成面（SEATS_13 含 pm 不动）→web patch 刷新=**14 条目（现役 13+pm）** | 刷新件条目数断言 14+pm 条目在位 |
| T-c | 验收白盒 | m-duty-fsd 自测+m-duty-cto 门禁 | 刷新件含 pm 条目+**13 现役条目不损**（逐条目对表 zero-tolerance 断言正形照 SDE 挂账卷 13 条目全列）+复跑断言（预期 14/14 或 13+pm-warn 零 fail） | 白盒读数卷落树 |
| T-d | 交付复跑 | m-duty-fsd 交付+值席触发 | commit 推 sg（fleet 面 `/srv/fleet/TriCompany/` 对应位）→知会值席 COS——notice-160 已在值席面（候刷新件落 sg 后案2 生成段复跑） | sg 顶对表验真（ls-remote 顶==交付 HEAD）+值席复跑触发读数 |

## §二 · 护栏

- **零触 sg 现役资产**（8712 daemon/store/现役 job 族不动）·本线=源侧发布面域
- **零触河源运行面**（R-HY 侧零操作——本令修面纯源侧）
- 值面纪律 D-46 全程（勘形若涉 token/凭据面·变量读入零回显零落卷）
- commit 卫生：先勘 unstaged 再动手（禁无勘 stash/checkout 吞卷）·共享 index 统一 add+commit
- 毕报锚=**对话流拾取增量非单方自述**（notice-158 正形·对话流可勘施工增量）

## §三 · 督办线（我面对表面）

- 毕报随线回 COS（m-duty 席组→值席→本面）→转呈 BOD→CEO
- 候收件线更新：**「L130 一行修毕报」随 notice-159 撤换改列「源侧补 pm 毕报卷」（T-c 白盒读数卷+T-d 交付读数）**——生成段毕报卷+四步毕报卷（案2 复跑后）照挂
- 时限：今晚毕为佳（CEO 令「修完继续案2」=案2 线解锁链头卡点·催办节律照三加速先例）

## 使用依据

CEO 直令（BOD 02:15+08 转达）；notice-159 撤换勘正（BOD 令文）；notice-160（值席面复跑候触发）；SDE 挂账卷 sde-l130-pm-missing-hold-readout-20261118.md（13 条目全列=验收对表基线·dev 0edf34a7b 在链）；704 席间通信形态纪律（M-SG 席组互发=SendMessage）。

—— COS 小贾（拆树派工卷·落款=date 现查原值粘贴：2026-11-18T02:16:55+0800）
