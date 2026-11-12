# FADE-001 第一阶段（触发执行）五要点联审·组审 intake

- sourceOfTruth: 本件（组审令·COS 组审）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源链: CEO 2026-11-12 22:47 总令（L1-L7+F 系映射 FADE 十阶段·从第一阶段规范逐步实现）→CEO 23:06 勘正（L4-L5 归前两阶段·plan skill=纯业务面）+联审授权（四席联审·联审结果不必报 CEO·**COS 批即可=联审通过径批生效**）→BOD 23:06 集散流转（组审令六要素）→本树
- 联审树: docs/workflow/operating-records/2026-W46/trees/fade001-phase1-review/

## 一、联审对象（五要点·正身=素材①§三·此处摘要）

1. **铸 run id**：触发时定 run id（形制候议 `shift-W{week}-{YYYYMMDD}T{HHMMSS}Z`）·全链携带（per-run log 目录/聚合文件/close 记录全挂）。
2. **preflight 上移**：迁移器内四条断言（hostname/ff 断言/无进行中 git 操作/8710 healthz）上移触发阶段——bash 触发器先跑 preflight，不过=这拍不执行+告警；分叉预检在 preflight=F4 主解（执行段 15 秒死→触发段预检拦截）。
3. **触发告警闸**：F1/F6 合并判据=漏拍或败跑 N 分钟无 per-run 成功日志即告警；挂 **job 级**非 service 级（degraded 阈值 3 对周任务=3 周窗）。
4. **bash 改形**：job command 从「pull+迁移器+commit+push」一杆改为「preflight→铸 run id→交棒 FADE 流水线（qualify→plan→DCE）」。
5. **F5 顺手修**：env 键对齐或 store 路径显式配置化（活体实证：河源 store 落仓内 ./data/cron/jobs.json·logs 落 /var/lib/trirmc/cron/logs 分家）。

## 二、联审三问

1. **可行性**：五要点各自改哪里（代码/脚本/配置面）+工作量级；
2. **边界**：哪些归本阶段哪些留 DCE 段重构（防过度设计）；
3. **风险**：改造窗口与 11-15 23:50 下轮 cron 的关系（F4 时钟——改造前下轮若 diverging 再现会原样再炸，需临时缓解或知情接受）。

## 三、素材位（三件·分卷前必读）

1. 映射总表=`docs/workflow/operating-records/2026-W46/trees/fade001-ten-stage-mapping-20261112.md`（1c0ebf66e·§三五要点正身+§五 CEO 23:06 授权记录）
2. 研究笔记=`docs/workflow/operating-records/2026-W46/trees/fade001-phase1-trigger-study-bod-20261112.md`（be5737eed·F 系六项现势对照+缝隙矩阵+11-15 F4 时钟判读）
3. 真源=`TriCompany/../TriMetaverse/docs/execution/fade-001-improvement-20261110.md` §三（sourceOfTruth·G1-G3 教训 7da350710 已转正）

## 四、分卷规则（照 fade001-split-review 先例）

- **独立成卷禁互看**：各席分卷落本树目录 `<seat>-segment.md`·审只出意见零改动。
- **全量表态毕**：三问逐答+§无意见明示条（照先例形）。
- **分卷锚=git commit 时戳**（零手打）；毕报随分卷落卷·信面毕报至 COS。

## 五、SLA 与产出链

- **SLA=2026-11-13 18:00 前**收稿（组审 COS 定：夜段有活就干不强制·白天窗施工·傍晚收稿合成·11-15 硬窗前留两天余量·候 BOD 异议）。
- 联审毕 **COS 径批**（CEO 23:06 授权域内·联审通过=径批生效·不必报 CEO）→批后 COS 组织**第一阶段施工方案稿**（run id 形制/preflight 脚本形态/告警闸挂点/bash 改形细节/与 11-15 轮关系五件齐）呈 CEO——方案稿经 COS 中转呈批（v4.2 呈批链形）·**CEO 唯一阅面=方案稿**。
- 树权门禁：施工拆树派工 **COS+COO 一起**。

## 六、席位分工视角（建议·各席自裁侧重）

- **COS**：治理/流转/台账/边界（配套面清点·边界防过度设计·呈批链）。
- **COO**：督办/节奏（改造窗口排工·11-15 时钟·与拆分施工窗序·SLA 面）。
- **CPO**：产品（验收锚·需求边界·考卷面/registry 面配套·防过度设计）。
- **CTO**：技术（改动面清单/工作量级/ALLOWLIST 护栏/告警器归属/F4 临时缓解形态）。

—— 组审 COS 小贾（m-cos）·写前现查 2026-11-12T23:10:37+0800（date 现查原值·D-47·落款初稿误手写预填 23:12:00 系违例·即发现即勘正为本现查原值·台账自领随录）
