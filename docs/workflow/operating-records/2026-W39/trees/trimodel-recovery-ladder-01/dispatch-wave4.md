# 拆派单·波④ 全链演练（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件（波④ 执行拆派单正身；D-15 分派枢纽留痕件）
- syncMode: final
- lastSyncedAt: 2026-09-26 06:2x +0800（date 现查 06:19 hook 链）
- 接令记录: CEO 22:57 批波次令第④步（候①②③毕）；波③ 签认毕（fsd-wave3-delivery-report.md §八）=①②③全闭，本单下发
- 方案正身: joint-plan.md 问4 演练矩阵+问2 分层判定表（双签终版 24ba1ccc）

## 分工

- **STE 小柯=主执行**：故障注入矩阵五臂+防线继承 STE 25/25 正式对照+toast 文案读数。
- **FSD 小全=前置小笔+环境支撑**：技术债⑹ L2 标记态 status 读数接线（l2FlagPath 注入位已留）+演练环境钉位支撑+演练中发现缺陷修正（修正即报候审，照波③ 探针修正处置形态）。

## 前置项（FSD，演练开动前落）

1. L2 标记态 status 读数接线（技术债⑹）：CoreIO.l2FlagPath 注入，status 输出 l2 段（标记在位/无标记两态）。
2. TRILC_PORT=8713 服务环境注入对位（技术债⑻）：TriMLC daemon 服务环境注入（键现成，注入动作=服务层操作）——**注入动作涉现役 daemon 环境变更，执行前照 trilc stop→改环境→start 纪律+stop 前验监听 pid==pidfile pid**（重启纪律）；此步涉现役服务，候 CEO 测试窗前对位即可，不阻沙箱五臂（身份校验兜底诚实）。
3. 沙箱钉位复核：全程 TRIMODEL_CLAUDE_SETTINGS/DEPLOY_KEY 指沙箱假钥（真 `.deploy-key` 供钥窗=真切换窗事项，不阻本波沙箱演练——波① 期已裁）。

## 演练矩阵五臂（STE，全沙箱形态）

| # | 注入 | 期待层 | 断言 |
| --- | --- | --- | --- |
| F1 | kill 3333 进程 | L1 | watchdog ≤70s 探活 fail→拉起→health 200；log `revive attempt up=true`；**L1 例外条款：3333 进程重启本身=设计行为可真做（进程≠活体配置）** |
| F2 | 端口占位使拉起必败×3 轮 | L2 | L2 标记落盘 `.fade/trimodel-l2-flag`→TriMLC cron ≤2min 拾取→`trimlc model restore-direct`（沙箱钉位）执行→restore-done 结果行→标记清 |
| F3 | 沙箱活体置空钥+副本 3334 起 | L2 直达 | 业务探针 401/空值→跳 L1 直 L2（判定表 auth-dead 分支实弹——波② 未实弹项，本波补） |
| F4 | 移走沙箱 .deploy-key | L3 | fail-closed 零半写→toast 触发（截图+30min 节律断言 D-29 合规 VBS 包装） |
| F5 | 人工 `trimlc model restore-direct` | L4 | 结构化结果行+沙箱配置恢复+`trimlc model status` 探针全绿 |

## 防线继承 STE 25/25 正式对照（波③ 门① 半闭项收口）

- 对照基线：restore-claude-config.ps1 f887b27 修复版 STE 复验 25/25 读数（BOD 预口径②）。
- 执行：25 用例逐条对 `trimlc model restore-direct`（core 路径）重跑，逐条勾验=验收门；**一条不许丢**（防线继承铁律）。此门毕=脚本退役前置条件达成（退役动作本身=BOD 验收制另批，不在本波）。

## toast 文案读数（产品面）

- F4 触发的 toast 实弹截图+文案四要素逐条（①出了什么事②现在什么状态③要你做什么④去哪看详情）抄录随报；**人话验收口径**=非工程角色读得懂（CPO 抽验位：报告转 CPO 对文案判）。

## 验收门

1. 五臂全绿+逐臂读数留痕（注入→期待层断言→结果行）；任一臂不符→停下上报不硬走。
2. STE 25/25 对照逐条勾验全过（上节）。
3. 真活体 settings.json hash 前后零变化随报（总判据持续；F1 进程重启不触配置）。
4. 演练发现缺陷：修正即报候审（不擅断），重大者停臂上报。
5. 全量四项读数随报（涉码改动时；纯演练臂无码改动则注明零改动）。

## 禁区

- LG-035 冻结面零触碰；本机其他 watchdog 任务族零触碰（F1 只动 TriModel-Watchdog 辖域）。
- 真活体 settings.json 零接触（沙箱纪律全程）；真 `.deploy-key` 不动（供钥窗另批）。
- 不越波⑤（回头测 D1 候④毕）；R-HY M1 通路三态=部署波并行线不在本单。
- 退役动作（脚本 FROZEN-NOTICE）不在本波（BOD 验收制另批）。

## 回报形态

五臂读数+25/25 对照表+toast 截图与文案抄录+hash 前后对照+全量四项（或零改动注记）；三要素齐报枢纽验收转 COO 入档、抄 CPO（文案判+验收窗对表）。

## 使用依据

joint-plan.md 问4 矩阵+问2 判定表（24ba1ccc）；CEO 22:57 批波次令；波③ 签认（fsd-wave3-delivery-report.md §八）；dispatch-wave1-wave2.md 派工纪律四条；ste-manual-test-report.md 沙箱钉位先例；D-29/D-15/M-004 纪律。
