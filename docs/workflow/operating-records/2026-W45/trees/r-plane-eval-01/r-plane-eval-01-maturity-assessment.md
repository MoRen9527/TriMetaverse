# r-plane-eval-01 成熟度评估卷（总汇）· R 面本地域产品 · 2026-11-04

- sourceOfTruth: 本卷（trees/r-plane-eval-01/r-plane-eval-01-maturity-assessment.md）
- syncMode: static（两卷总汇·值席收口铸——分席料 23 件为附录素材态，判级以各席原卷为准·本卷做跨席归并与统一读法）
- lastSyncedAt: 2026-11-04T05:47:38Z（date 现查原值·写前跑·京时 13:47:38 +0800）
- 令源: M 面 COO 评估动员令 2026-11-04T12:52:29+08（投递手 m-sde）
- 收口席: r-duty-cos（值席·⑤收口规程承担者）
- 参与席: r-duty 13 席全席（认领表 13/13 全量·claims.md 断言① ✓；分席毕报 13/13·断言② ✓）

## 一、评估总览

- **对象**：R 面本地域产品——TriPilot+TriRLC 命令行为主·8711 族 API 面·TriPilot GUI 为辅
- **基准**：M 面两域（sg 面 TriRLC/TriPilot 现役形态）——多席以仓面同源事实+registry 记载为基准引述（跨机活体对表候 M 面席位复核·CTO 卷 §0.1 时效声明在案）
- **方法**：13 席分域只读实勘（源码/git/端口面/记录面/市场公开报道），零写仓面，现役 8710/443/8791 零碰
- **基线锚**：TriRLC HEAD=067fbfd（0/0 对 origin/dev）·TriPilot HEAD=a23d2a0（0.0.13）

## 二、总判级（值席统一读法）

**R 面本地域产品 =「源码同源成熟、运行态装机前段」的剪刀差形态。**

- **产品源码层（对两面同源成立）**：TriRLC 命令行面 P1 可用偏现役（CPO 判级·FSD B+·CTO B+）；8711 族 API 面 P1 可用（48 端点·双协议流·fail-closed 鉴权·CTO B/FSD B）；TriPilot 命令/GUI P2 雏形偏可用（CPO·FSD C+/B）。
- **R 面运行态层**：评估对象本体 **L1 装机前段**（SDE 判·四查全空：无 dist/CLI 不在 PATH/状态目录缺位/**8711 端口零监听**）——产品功能在 R 面暂无活体，M 面领先一个装机段。
- **环境基座层（R 面独有强项）**：L2-L3——五服务全 systemd 零裸进程·19 天量级零重启；dsh 班组面 L3（M 面无此形）。
- **治理面**：「治理骨架好、制度血肉缺」（CAO）——AGENTS/registry M4·模块 workflow 制度面 M1 最大缺口。
- **组织协作面**：**自愈进化**（CHO 判·本树认领直写缺陷同场内化闭环实证）——R 面最成熟的一面。
- **市场面**：Functional 但 Market-ready 度低（CMO·工程骨架厚显著领先产品叙事/安全姿态/分发三面 Skeleton）。
- **成本面**：L1（计量在·账本无·护栏无·口径无·CFO）。
- **测试面**：TriRLC CONDITIONAL_PASS（64 文件厚套件·但当日 merge 无读数+无 CI）；TriPilot **FAIL**（作 production-grade 主张时·2 文件/79 行 vs 12.6k 行 src·dev 线休眠约 10 周）。

## 三、分域判级对照表（13 席）

| 席位 | 域 | 判级 | 一句话 |
|---|---|---|---|
| CPO | 产品成熟度主域 | 面1 P1 偏现役/面2 P1/面3 P2 | 实现完整测试在位·运行读数未并卷·发布形态未定 |
| CTO | 技术成熟度线 | 架构 B+/API 契约 B/TriPilot C+/工程纪律 B+ | 离网韧性亮点·app.ts 5673 行巨石首要债·registry 漂移一处 |
| FSD | 代码实现域 | 命令面 B+/API B/TriPilot B+·B/测试 B-·C/安全 A- | 巨石双峰是实现债主峰·安全面最成熟 |
| STE | 测试与质量门禁 | RLC CONDITIONAL_PASS/Pilot FAIL/8711 静态 CONDITIONAL | 8711 无监听 live 不可评·Pilot 套件薄+10 周休眠·RLC 无 CI |
| SDE | 部署/发布/环境 | 对象本体 L1·环境基座 L2-L3·dsh 班组 L3 | 源料就绪装机未启·卫生发现五件 |
| CSO | 客户成功 | 3/5（就绪度） | CLI 完整度超 M 面·文档/反馈通道/成功信号三缺 |
| RDT | 培训/接手性 | 命令行中低·8711 低·GUI 低·路径卡缺 | 8711 零端点文档=最大洼地·TriPilot 导读在册待补 |
| CAO | 行政治理面 | 治理文档 M4·workflow M1·登记 M2·信箱 M2 | 治理骨架好制度血肉缺 |
| COO | 运营成熟度 | 综合 L3- | 窗制台账稳·投递链无 SLA 是最大单点风险 |
| CFO | 成本/护栏 | L1 | 计量在·账本无·护栏无·口径无 |
| CMO | 市场对标 | Functional（Market-ready 低） | 叙事/安全姿态/分发三面 Skeleton |
| CHO | 组织与人力 | 匹配「结构性合理·密度性超配」·协作面自愈进化 | staffing 领先产品阶段约一个量级 |
| r-duty-cos | 值席收口 | —（本卷即其产出） | 三断言核验+跨席归并 |

## 四、跨席共振发现（多席独立命中·高置信）

1. **8711 装机缺位**（SDE/FSD/STE/CSO/CPO 五席同向）：R 面 8711 族 API 面零活体——源级齐备与运行缺位的剪刀差是本次评估**第一发现**；M 面 prod 8711 健康在役领先一个装机段。
2. **巨石双峰**（CTO/FSD/CPO 三席同向）：TriRLC app.ts 5,673 行平铺路由 + TriPilot extension.ts 10,011 行（占 src 79%）——两仓实现债主峰同构（无路由表/无分层·变更热区集中·blast radius 失控）。
3. **文档-实现漂移族**（RDT/CSO/CPO/CMO/CAO/CHO 六席同向）：8711 零端点文档·getting-started 缺·product 四件占位·registry 滞后实现约两个迭代·模块 workflow 制度面 M1·README Planned modules 滞后——**文档面是全评估最大共性洼地**。
4. **质量门禁不对称**（STE/FSD/CTO）：TriRLC 64 文件厚套件但无 CI 纯人肉门禁+当日 merge 无读数；TriPilot CI 骨架完好但套件 2 文件/79 行+dev 线 10 周休眠——**一有一肉无一肉**的双向缺口。
5. **安全双面性**（FSD/CMO/SDE）：产品内建安全最成熟（token 门 fail-closed+CLI 门禁实证=A-）；但环境卫生三件密值隐患（trirmc token 明文内嵌 unit/TriModel .env 644）+市场安全姿态 Skeleton（OpenClaw 同血统危机背景）——内功强、外述弱、环境有漏。
6. **同源零差实证**（FSD git 对账+CTO/CSO 互证）：dev 与 sg bare 0/0 零差（067fbfd）——两域产品面无分叉无漂移，成熟度差异纯在运行验证环境层；git 双向同步机制运转正常。
7. **治理协作自愈**（CHO/CAO/COO）：值席汇写制当日成立即内化（D-45 款4 教训迁移）·派工链缺口 4min 闭环实证·收口三断言设计——协作治理面是 R 面最成熟资产。

## 五、M/R 面差结论（对表动员令②基准面）

| 维度 | M 面（基准引述） | R 面（实勘） | 差 |
|---|---|---|---|
| TriRLC 运行态 | prod 8711 健康在役·Windows 装机毕·dsh 0.2.0-rc.2 真模型探针 PASS | L1 装机前段（四查全空） | **领先一个装机段** |
| TriPilot 形态 | 研发主跑道现役 | 仓洁无产物（vsix 零命中·vscodium 仅 recipe） | 领先一个构建段 |
| 服务化基座 | sg 形（8710 TriRMC 中央面） | 五服务 systemd+20 天量级 uptime·**dsh 班组面 L3 为 R 面独有** | R 面局部反超 |
| 治理制度面 | 80+ 制度件 M5 | workflow M1 占位·信箱机制在转制度无正身 | 显著落后 |
| 产品源码 | 同源 | 同源（0/0 零差） | 无差 |

**一句话**：R 面不是「落后版 M 面」——是「同源产品 + 独有班组运行形态 + 待补装机与制度血肉」的部署验证线；改进主轴=把 M 面已验证的装机形态在 R 面落活体，同时把 R 面独有强项（dsh 班组/服务化纪律）反哺中央。

## 六、分席料索引（23 件·全部在树）

- 树根：cao-assessment.md / cao-improvement.md / rdt-maturity-assessment.md / rdt-improvement-plan.md
- reports/：CMO-成熟度评估卷-市场面对标.md / CMO-改进计划卷-市场面.md / cfo-maturity-cost.md / cfo-improvement-cost.md / cho-maturity-org-staffing.md / cho-improvement-org-staffing.md / coo-maturity-section.md / coo-improvement-section.md / cpo-product-maturity-assessment.md / cpo-improvement-plan.md / cso-customer-success-assessment.md / cto-tech-maturity-eval-20261104.md / cto-tech-improvement-plan-20261104.md / fsd-maturity-implementation.md / fsd-improvement-implementation.md / sde-maturity-assessment-20261104.md / sde-improvement-plan-20261104.md / r-duty-ste-maturity-test-quality-gate.md / r-duty-ste-improvement-test-quality-gate.md
- 认领与收口：claims.md（canonical 13/13）

## 七、评估局限声明

- M 面活体未跨机现勘（基准=registry 引述+仓面同源事实·候 M 面席位复核对表）；
- 8711 无监听故 live 面不可评（静态评+装机后冒烟预案已预置 STE P3-2）；
- 外部市场数据 B 级采信未独立复核（CMO 卷尾声明）；零金额结论（CFO 不编造护栏）；
- 各席判级标尺异构（P0-P3/A-D/L0-L4/M1-M5/五档）——本卷第二节给统一读法，细粒度以各席原卷为准。

—— r-duty-cos（值席收口）· 落款 date 现查原值 2026-11-04T05:47:38Z（京时 13:47:38 +0800）
