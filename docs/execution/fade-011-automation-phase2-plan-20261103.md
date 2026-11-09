# FADE-011 自动化 Phase 2 正式勘量排期单

- sourceOfTruth: 本件（docs/execution/fade-011-automation-phase2-plan-20261103.md）
- syncMode: static（令源即办单·勘量排期一次成卷·gate 过段分段毕报不回写本件）
- lastSyncedAt: 2026-11-03T22:42:59+0800（date 现查原值）
- owner: CTO 小狄（勘量+排期施工归 CTO 面·BOD 20:25:59 派工「勘量与排期施工归你面」）
- 令源链: CEO 2026-11-03 20:25 批（「行，补上，彩排跑完就排自动化」）→ BOD 20:25:59 提请勘量 → BOD 20:32:10 现裁两件全采认 → COS 22:30:46 令二即办（「正式勘量排期单·显式 Phase 2 分界·不候窗即办」）
- 关联正身: spec=`TriCompany/docs/engineering/fade-protocol-spec.md`（§2.7 前置门/§6.1 L349 自报段/§8.1 十段链/§8.6 Trees 融合）；蓝图=`TriCompany/docs/engineering/ade-full-lifecycle-implementation-plan.md`（V1.0 2026-08-07 FREEZE 态）；彩排终态锚=57b71fefb（APPROVED·W45 fade-rehearsal-01）

## §一 Phase 2 显式分界（BOD 20:32 现裁采认回填）

**本窗范围=蓝图 Phase 2「单域 Durable MVP」级的「单 run 十段全自动通」，按现势勘正落位；Phase 3-6 显式不入。**

入窗（In scope）：

1. Plan/Close Skill 结构化装载（缺口①·spec L349 自报）
2. Run 生命周期持久状态机（缺口②）
3. 跨会话/中断恢复（缺口③）
4. T6 校验器（node-report-check）编排层接线（收口复跑门程序化）
5. kill 中断恢复实测（验收门·机械化判据·BOD 20:32 照立）

出窗（Out of scope·显式排除）：

- 蓝图 **Phase 3**（TriMC Parity）/ **Phase 4**（双域同步）/ **Phase 5**（Trees projection）/ **Phase 6**（生产加固）——不入本窗
- **第四项**：文件/Git 事件自动触发增强——automation-backlog 独立排窗（CTO 2026-08-21 裁·BOD 20:32 采认「不并窗」）
- 多 run 并发调度、跨域（R 面/河源）run 联动——Phase 3+ 域

**版本差警示**：蓝图 V1.0=2026-08-07 FREEZE 态，其 Phase 2 承载表述「TriLC」系 8 月单 daemon 旧势命名与拓扑；现役四 daemon 面域分化（TriRLC@8711=R 面 / TriMLC@8713=M 面 / TriMMC=sg 8712 / TriRMC=河源 8710）。本窗按现势勘正落位，**不回改蓝图文本**（历史冻结·真源可修口径：蓝图修订候独立窗，不在本窗夹带）。

## §二 承载面定谳建议（BOD 要求「候令随附」）

**建议：TriMLC@8713 承载。**

判据三条：

1. **活所在面**：FADE-011 run 的全部工作对象在 M 面——TriMetaverse docs（文档图/真源面）、试卷树（operating-records trees）、经营记录。面域路由原则（CEO 2026-10-14 精化定谳）：已分配面的活走那个面干。
2. **现役触发面**：event-watch 触发探测（spec §8.6）与首 run 彩排驱动面在 M 面宿主；8713 cron/store 机制现役可复用（TriMLC 造件=payload{command,cwd} 嵌套形·无 ALLOWLIST·10-22 实勘）。
3. **面域对偶**：TriRLC@8711=R 面本地域（TriCade/TriPilot 域），FADE-011 不涉 R 面工作对象——落 TriRLC 违面域路由。

蓝图落位表述勘正：蓝图 Phase 2「TriLC」→ 现势正身=**M 面本地域 daemon（TriMLC@8713）**。历史名 TriLC→TriRLC 改名（2026-08-31）与 M 面衍生 TriMLC 并行演化，蓝图文本未随勘——本单为现势正身锚。

形态注：本节=**定谳建议**，正式定谳候令面（BOD/CEO）确认后生效；动工前先活体现探 8713 healthz（机位断言禁推定）。

## §三 三缺口勘量（预勘量四支·BOD 20:32 全采认回填）

| # | 缺口 | 量级 | 定性依据 |
| --- | --- | --- | --- |
| ① | Plan/Close Skill 结构化装载 | 小-中 | schema 立法已备（spec 内两 Skill 契约面已定·彩排以人工装载走通十段）——缺 daemon 侧装载器与逐键校验 |
| ② | Run 生命周期持久状态机 | 中 | 关键路径：十段态（QUALIFY→PLAN→DCE→VERIFY→SCORE→CLOSING→终态）+run 元数据持久化到 daemon store；缺口③的硬依赖前置 |
| ③ | 跨会话/中断恢复 | 小-中 | 依赖②：启动时扫 store 未完 run→按段恢复（中断点续跑或回退 CLOSING 收口）|

依赖序：③ 硬依赖 ②；① 相对独立可并行，但联调需①②③齐。已落地件不再勘量：event-watch 触发探测（§8.6）、--run-id（FADE-002 核销）、Close CLI、node-report-check（015bab659·T6 已补机跑双门 exit 0）。

## §四 实现顺序（骨架=预排期基座·BOD 采纳）

```
S1 缺口② 状态机   （关键路径先行：store schema + 段态迁移）
S2 缺口③ 恢复     （依赖 S1：kill→重启→恢复链）
S3 缺口① 装载     （Plan/Close Skill 装载器 + schema 校验）
S4 T6 校验器接线   （收口复跑门程序化——校验器已落地·零新写·只接线）
S5 联调 + kill 实测（全链彩排 run 复跑·验收门见 §五）
```

各步门禁：

- S1→S2 gate：状态机 schema 冻结 + 段态迁移单测（含非法迁移拒断言）
- S2→S3 gate：kill 实测最小链通（中断点续跑 / 回退 CLOSING 收口两路径各一实锚）
- S3→S4 gate：装载器对 spec 契约 schema 逐键校验 + 负路径（坏 schema 拒载断言）
- S4→S5 gate：双门=node-report-check 编排层复跑 RC=0（全节点报告结构门）
- S5 验收门：见 §五

施工面注：S1-S3=TriMLC 仓 daemon 侧；S4=跨仓接线（TriMetaverse scripts → TriMLC 调用）；施工席=本席枢纽派工（FSD 主施工·STE 门禁验证·D-15 接令回执链）。

## §五 验收门（机械化判据·BOD 20:32 照立）

**「自动化链通为准」——判据=kill 中断恢复实测，非文档自述：**

1. daemon 触发一条新 run → 十段全自动通（零人工干预）→ 终态 APPROVED
2. 十段中途 kill daemon（随机段位）→ 重启 → run 恢复到中断点续跑或 CLOSING 收口 → 终态可达
3. 收口双门：编排层 `node_report_check.py --tree-dir` 复跑 RC=0
4. 上述 1-3 **连续两轮通过**（防单次偶然）= 验收放行

## §六 回滚姿态

- 全程不触现役栈：run 域隔离于现役 cron/job 面——run store 用**独立键空间**，不动现役 job 配置。
- 失败即停：任一 gate 不达→停线；回滚=代码 revert + daemon 重启即回旧行为，无数据迁移面（store 新键空间直接弃）。
- 彩排树与经营记录零改动：新 run 走独立 run-id 序列，不复用 fade-rehearsal-01。

## §七 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| 状态机 schema 立法与 spec §8.1 漂移 | S1 以 spec §8.1 十段链为唯一法条锚，schema 文本附 spec 行号引 |
| 恢复语义两可（续跑/重跑/收口） | 恢复策略立法先行（S1 内定谳：段幂等者续跑·非幂等者回退 CLOSING），写入 spec 候批 |
| Skill 装载双真源（skill 文件 vs daemon 内嵌副本） | 单一装载通道=daemon 读 skill 文件，禁内嵌副本 |
| 承载面误落（TriRLC vs TriMLC） | §二定谳建议候令确认后动工；机位断言先活体现探（8713 healthz） |
| 宿主睡眠冻结干扰 kill 实测 | 实测在 daemon 活体确认窗内跑（powerMonitor/lastWakeReport 读数旁证） |

## §八 排期与节律

- 排窗制度已废（CEO 11-03 22:29 令三·D-39 勘正段）：本单=**勘量排期单非排窗单**——S1-S5 顺序=工序序非时刻表，有活就干顺序推进，完成即报。
- 施工派工：S1 起本席出派工单（FSD 主施工·STE 门禁验证·D-15 回执链）。
- 分段毕报：每 gate 过即分段毕报 COS 汇总转 bod；验收门过出总毕报。

## §九 使用依据

- CEO 2026-11-03 20:25 批 + 22:29 口谕令二（COS 22:30:46 流转）
- BOD 20:25:59 提请勘量 + 20:32:10 现裁两件（④不并窗/Phase 2 显式分界/骨架采纳/kill 判据照立/承载面定谳建议候令随附）
- spec=`TriCompany/docs/engineering/fade-protocol-spec.md`（§2.7/§6.1 L349 自报/§8.1 十段链/§8.6）
- 蓝图=`TriCompany/docs/engineering/ade-full-lifecycle-implementation-plan.md`（V1.0 FREEZE·版本差警示见 §一）
- 彩排终态锚=57b71fefb（APPROVED·W45 fade-rehearsal-01·十段全流程 11-03 晚）
- T6 校验器落地锚=015bab659（scripts/node_report_check.py）+ 补机跑读数卷 aeefc6cee
- daemon 面域勘正锚=CEO 面授（8711=R 面/TriRLC·8713=M 面/TriMLC·MEMORY 双控制器端口定性条）

—— CTO 小狄（2026-11-03·令二即办成卷）
