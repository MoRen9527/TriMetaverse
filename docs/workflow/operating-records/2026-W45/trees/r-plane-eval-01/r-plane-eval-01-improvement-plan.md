# r-plane-eval-01 改进计划卷（总汇）· R 面本地域产品 · 2026-11-04

- sourceOfTruth: 本卷（trees/r-plane-eval-01/r-plane-eval-01-improvement-plan.md）
- syncMode: static（两卷总汇·值席收口铸——分席改进料 13 件为素材态·本卷做跨席归并/去重/裁决路由·**全部条目为候裁建议非已排程令**）
- lastSyncedAt: 2026-11-04T05:47:38Z（date 现查原值·写前跑·京时 13:47:38 +0800）
- 收口席: r-duty-cos（值席）
- 权界声明: 技术裁决归 CTO·产品裁决归 CPO·排程归 COO（D-23 对轨）·制度化归 CAO·编制/战略升 BOD/BS——本卷只做归并呈现与路由建议，不代任何域裁决

## 一、改进主轴（值席归并结论）

依评估总判级「源码同源成熟·运行态装机前段」剪刀差+七条共振发现，改进主轴四条：

1. **装机落活体**（销第一发现）：TriRLC 河源装机窗为最高优先——8711 活体是多数域评估从「静态 CONDITIONAL」升「可验证」的前提；
2. **文档洼地总攻**（销最大共性缺口·六席共振）：8711 端点契约文档为单点高杠杆——同时服务培训（RDT）/客户成功（CSO）/市场叙事（CMO）/契约稳定化（CTO/CPO）四域；
3. **巨石双峰拆解**（销实现债主峰·契约测试先行）：app.ts 与 extension.ts 同构手法（路由表/职责域拆分·零逻辑变更·分笔回归）；
4. **门禁机器化+卫生清账**：TriRLC 补 CI、TriPilot 补测试肉、卫生五件+登记陈旧追平。

## 二、改进项总表（跨席归并·按优先序）

### P0（立即·高杠杆）

| # | 项 | 归并来源 | owner 路由 | 验收锚（源卷） |
|---|---|---|---|---|
| P0-A | **TriRLC 河源装机窗**（npm ci→tsc→dist→CLI 装设→隔离实例先行→prod 8711 systemd unit 化（EnvironmentFile 外置 token）→烟测） | SDE P0（主）← FSD ③ daemon SOP 配套 ← STE P3-2 冒烟预案 | SDE 施工·CTO 门禁面核·COO 排窗（D-23 对轨） | 任意席照 SOP 3 分钟起服+healthz 200（FSD③）；隔离实例两段式回滚（SDE） |
| P0-B | **ink 族死重清理 19+2 项**（CTO 已裁 APPROVE 附三序门禁） | CTO P0-1（9dc5355 候裁项收口） | FSD 施工·CTO 验收·两域同步 | 三序全绿（npm install/check/回归 655 零红）·peer 链实测为门禁 |
| P0-C | **Code Registry 漂移修正**（agent-core 依赖行 TriMMC→TriCompany） | CTO P0-2 ← CAO IP-3 关联 | CTO（CodeRegistry owner 权界内） | code-state 与 package.json 一致·旧段落时效快扫 |
| P0-D | **getting-started 最小闭环+反馈通道最小件** | CSO P0×2 | 文档主笔候派（RDT/CSO 供料）·CPO 裁产品口径 | 安装→启动→首问一件文档；issue template 双模板+错误尾缀指路 |

### P1（下窗排程·D-23 查窗后落）

| # | 项 | 归并来源 | owner 路由 | 验收锚 |
|---|---|---|---|---|
| P1-A | **app.ts 巨石拆分**（契约测试先行→路由注册表五/七族拆·5673 行→引导器 ≤300-500 行） | CTO P1-1 = FSD ②（同项两席·方案互补：CTO 给门禁序·FSD 给路由表法+5d 粗估） | CTO 裁决+验收·FSD 施工·STE 门禁 | 契约测试锁行为·分族小步·每步 655 基线零红 |
| P1-B | **8711 契约面文档化**（端点清单+双 wire 协议+契约测试） | CTO P1-2 = RDT P0-2 = CPO N2/X2（三席同项·文档+测试一体） | CTO 主·RDT/CPO 供料会签 | 端点全覆盖+示例+鉴权语义一致；契约测试红绿在位 |
| P1-C | **TriPilot 基线定性+门禁补肉**（10 周休眠处置裁决→token 门案组≥3 边界→e2e 冒烟链） | STE P1-2/P2-1 = CPO N1（同项归并） | CTO 裁定性·FSD 写·STE 评审 | dated 读数卷入档；三高风险件测试绿+e2e 冒烟 PASS |
| P1-D | **TriRLC 最小 CI 护栏**（GitHub Actions 单 job） | STE P2-2 ← CFO/CAO 卫生面关联 | FSD 实施·CTO 审·STE 验证 | dev push/PR 触发·首跑全绿在档 |
| P1-E | **部署卫生清理窗**（五件：relay3 僵尸处置/token 外置（涉 TriRMC 重启小窗）/.env 收 600/runbooks 库初始化五件起步/调试残留收敛） | SDE P1（主）← CAO IP-6（归档规则）← STE N6 | SDE 执行·CAO 定归档规则·TriRMC 重启候独占小窗 | 五件逐件消账·token 外置照 D-03 两步纪律+healthz 对表 |
| P1-F | **投递链 SLA 化**（桥勘修升格专项+送达回执化+双通道预案文档化） | COO P1（主）·W42 三受害实证 | 勘修=巡检线/CTO 面·SLA=COO | 连续 3 窗零 bridge_failed·令单 100% 回执化 |
| P1-G | **窗内进程记账纪律**（开工盘基线·先记账后起服） | COO P1·3080 孤儿事件实证 | SDE 执行+值席复核 | 连续 3 窗零孤儿·窗卷含基线对账段 |
| P1-H | **成本计量落盘→护栏机械化**（usage jsonl 账本→累计 token 阈值两段式先报后停→burn 只读端点） | CFO P0/P1 | 改动点 CTO 勘裁·FSD 实施·阈值 CTO+CFO 联裁 | 会话 token 可回读·账本只追加·模拟触线停工+升级播报 |

### P2（季度视野/次优先）

| # | 项 | 归并来源 | owner 路由 |
|---|---|---|---|
| P2-A | extension.ts 拆分（10011 行→<3000·四域拆·安全回归稳定后动） | FSD ④（8d 粗估）= CPO X3 | CTO 排期·FSD 施工 |
| P2-B | TriPilot 发布形态定型（VSIX 链+semver v0.1.0+changelog·门禁在前） | CPO X1 ← CMO P5 分发两段式关联 | CPO 裁·FSD 实施·上架合规 CAO 会签 |
| P2-C | CLI 声明式命令表+路由 smoke 套件（一簇·② 为 ⑥ 前置） | FSD ①⑥ | FSD·CTO 认可分段方案 |
| P2-D | TriRLC 产品文档两页（8711 端点族一页+CLI 命令族一页）+registry 勘正 | CPO N2 ← RDT P1 命令导读关联 | CPO 裁·RDT/文档席主笔 |
| P2-E | test-state 登记追平+lint 配置决策+bin 双名收口 | STE P2-3/P3-1 + CPO N3 + CSO P2 命名收敛（三席关联） | STE 供料·CTO 收口·治理对表后定退役时点 |
| P2-F | 市场面七项（安全姿态产品化/叙事包/plan-act UX/BYOK 矩阵/分发两段式/终端集成/diff 审查） | CMO P1-P7（信号三段式） | **CPO 采撷裁决**·CMO 供弹药·涉技术归 CTO |
| P2-G | 信箱制度正身（路由表/保留策略/read 置位规程一册）+陈旧积压处置 | CAO IP-2 = COO P2（跨面项） | CAO 主笔（R 面）·M 面 m-duty-cos 主管线处置权 |
| P2-H | 组织程序四件（认领单点写手制入树协议模板/席位→域默认映射表/约束三条款模板/毕报 30min 时限） | CHO N1-N4（本树当日实证转化） | CHO 起草·值席会签采纳 |
| P2-I | 版本策略对表（TriRLC 0.9.0 vs TriPilot 0.0.13 非对称） | COO P3 呈读 = CTO P2-1 = CPO X1 关联 | CPO/CTO 联裁 |

### P3/Later（候裁/升级面）

| # | 项 | 归并来源 | 路由 |
|---|---|---|---|
| P3-A | 双仓 README 同文归属裁决（TriRLC×TriMLC 一物一册一 owner） | CAO IP-1 | CAO 出草案·**CEO 裁**（命名权威面·D-17 同族）·结论回写 governance-state |
| P3-B | 模块 workflow 最小集三指针（交接模板/树协议/纪律册指针一页） | CAO IP-4 | 模块 CTO/FSD 主笔·CAO 审 |
| P3-C | 空壳占位文档统一口径（填实或 status: 占位标注） | CAO IP-5 | 各仓事实 owner |
| P3-D | 席位动态启用制（在编待召）+稳定期重估 13 席密度 | CHO X1/L1 | **升 COS 分诊→BOD 裁**·涉 BS 协同 |
| P3-E | ProductManager 启用/DeploymentEngineer 注销走正式链 | CHO X2 | CHO 收口（牵涉 CPO 域） |
| P3-F | 成本口径出报+经营闭环（burn 周报→BUDGET_CHECK 打通→货币化层） | CFO P2/P3 | P2 可排·P3 候商业化节奏 |
| P3-G | wallet-upgrade/多项目 GUI 化/崩溃恢复演示 | CPO L1-L3 | 候产品验证+中央战略输入 |

## 三、工作量粗估与排程建议（供 COO 参照·非强制）

- 实现域（FSD 粗估）：P0-B ink 清理+P1-A app.ts 拆分+P2-A extension 拆分+P2-C 一簇 ≈ **18.5 FSD 人日**（③→②→①→⑥ 串行建议在案）
- 部署域（SDE）：P0-A 装机窗+P1-E 卫生窗+P2 TriPilot 装机窗（三窗位·候 COO 排程·D-23 对轨：daemon 勘修重启类+专注窗判据）
- 全部改进项 **零新增 recurring 成本**（CFO 核·P0-P2 本地写盘+读数·不触授权矩阵）
- 排程窗口建议序：P0-A 装机窗 → P1-E 卫生窗（可并）→ P1-A app.ts → P0-B ink → 其余按域节奏

## 四、升级面清单（候 BOD/CEO/BS 裁）

1. 双仓归属裁决（P3-A·CEO·命名权威）；
2. 席位动态启用制+密度重估（P3-D·BOD·涉编制）；
3. TriPilot 上架 VS Code Marketplace（P2-B 中期·涉市场进入战略·BS 边界 ESCALATE 判据在 CMO 卷）；
4. /v1/messages 对外兼容承诺（CPO X2 注·平台化属 BS 边界另案）。

## 五、分席料索引

改进分席料 13 件全清单见成熟度评估卷总汇 §六（同树·reports/+树根）；本卷各归并项括注来源即各分席卷内原始编号。

—— r-duty-cos（值席收口）· 落款 date 现查原值 2026-11-04T05:47:38Z（京时 13:47:38 +0800）
