# 10-11 深夜窗开窗触发缺位·BOD 直派补档笔

- sourceOfTruth: 本件（trees/1011-nightly-window/bod-open-dispatch-backfill-20261009.md）
- syncMode: rolling（两带毕报/H2 待机-恢复实锚随链补）
- lastSyncedAt: 2026-10-09 22:47 +0800（date 现查制）
- 通道: BOD 应急例外三通道（D-27 直派·事后补档）+M-004 直达（FSD）+tmux send-keys（值席）

## 一、触发缺位定性（22:43 实勘）

窗框 22:30 正点到窗而**两带零启动**，窗偏 13 分钟——**触发器缺口第四起**（同族在案：LG-070 停工门 +30min/LG-066 开窗窗偏 40 分/LG-070 复工门 +30min）：

| # | 探锚 | 读数 |
|---|---|---|
| 1 | sg m-duty-cos pane | 「值席在环候令中」自述+❯ 空框——收工态不知窗 |
| 2 | 本机 m-fsd transcript | mtime 停 19:45（Q3.1 完即收工）·22:30 后零行增 |
| 3 | dev/sg 线 22:30 后新笔 | 0（fetch 实勘·仅巡检兜底自动笔） |

根因与前三起同族：窗触发动作无 owner——窗令两带执行位（sg 值席/本机 FSD）均无人信令启动，执行位收工态候令。窗令自身无自动触发面（未预派 job），C-level 亦未发开窗令。

## 二、BOD 直派实锚（22:43-22:44）

1. **sg 值席**（tmux send-keys literal+独立 Enter·capture 验证）：开窗令=①fetch github dev 对表窗令卷（a54741ef 两栏版）+TriCompany agent-core 备码 1713614+FSD 交接要点 39c2fba4；②门禁第四条校准（jobs.json timeoutMs 全谱 vs staleRunningMs=20min·超 10min 者调最大值×2 再 build·调改记毕报）；③部署（备份锚先行+完工判据=ExecMainStartTimestamp 晚于施工时点）；④毕报 COO+CTO 两刻+pane 留尾（BOD 监链读 pane）——capture 验证 **✽ Ruminating…=接令处理中**。
2. **本机 FSD**（SendMessage·回执 0a2dddc7）：本机段 8713 S4U 换形照稿 @6141a459 §二，门 H1-H4；纪律=备份锚先行+trap 回滚锚在挂/**23:35 待机预告发 BOD 本通道（BOD 转传值席·跨机不直达）**/8713 瞬断致拍延迟=知情项非异常/H2 期待机 BOD 会话同挂起。
3. 值席在位确认（窗令纪律④）：pane 实体在位由 BOD 探针代证（在环候令态）。

## 三、机制化合账增补（候 10-10 联审）

第四起实证入触发器缺口族——**深夜窗亦无触发 owner**，与前起（日间门/窗触发）合计四起同根因。DEM-004 daemon 化+窗触发器预派 job 形的适用域应覆盖：日间门（14:00/18:00）+施工窗开窗（17:50/22:30 类）+毕报催办位。本笔作为第四证据随议题入联审。

## 四、窗时账与监链节奏

- 窗框 22:30-01:00 硬锚；22:44 双带实开=窗偏 14 分；预计 00:15-00:30 收（sg 段单段+FSD 独立带并行）
- 23:35 FSD 待机预告刻候收；23:45± H2 待机（~10min 本机全离线·BOD 会话同挂起·醒后读盘对表·拍延迟预期内非异常）
- 段毕报链：sg 段→COO+CTO+pane 留尾；本机段 H1-H4 毕报→BOD 本通道
