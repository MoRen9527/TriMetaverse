# LG-024 扩围升格方案：session 面合同载全量治理结构（CTO 域拆解，候 BOD）

- sourceOfTruth: TriMetaverse/docs/execution/lg-024-session-contract-upgrade-plan.md
- syncMode: source-only
- lastSyncedAt: 2026-09-02
- 性质：CEO 意图（session 面合同须载全量治理结构）COS 拆解四问 CTO 席方案；候裁件——出件不安装不渲染现役
- 事实基准（2026-09-02 实勘）：源侧合成件 agent.md=121 行 **13 节全量治理结构**（source-agents/<role>/ 真源）；现役 session 手作件=**8 件 877 行在 `.claude/hub/`（untracked）**，单件约 113 行，身份面薄、会话面专属节（启动恢复/会话面纪律）混杂；管线=sessionBody 声明派生机制已在（host_object_generation.py:931-949，LG-023 S6）+ADE-B 渲染引擎（HOST_RENDER_REGISTRY+renderTemplate/extraSections+派生一致校验）

## 一、渲染组合方案（问 1）

**升格公式：session 产物 body = 合成件 body 全量直入 − stripSections 剥离 + sessionBody 补充段追加**

1. **合成件 body 全量直入（主体）**：session 变体与主窗 md 同源同真源——源侧 agent.md body（13 节治理结构）全量进入 session 产物，常驻席会话长期工作载全量（CEO 意图内核）。
2. **剥离规则=机制在、初版零剥离**：HOST_RENDER_REGISTRY 新增 `stripSections` 键（按节标题精确匹配，未来扩展缝）；**初版剥离清单为空**——13 节逐一勘过均会话面兼容（默认输出结构等节在 CC 会话同样适用），frontmatter 本就不进 body。不预设计无实证的剥离规则（YAGNI），golden 校验兜底节完整性。
3. **sessionBody 作补充段追加（尾部）**：以「## 会话面补充（session-body）」分隔段追加于 body 尾部——手作件中的会话专属节（启动恢复自驱动/会话面纪律/hub 快照恢复序）提炼归入此段。
4. **sessionBody 真源化（前置件）**：现役 sessionBody 来源薄且真源缺位——手作件反哺源侧：会话专属节提炼落 `source-agents/<role>/<role>.session-body.md`（或 agent.md 标记段，落点渲染管线定），manifest SESSION_BODY_KEY 指向之；**手作件去 untracked 化**：内容进真源后 `.claude/hub/` 手作件归档退役。

## 二、渲染验证方案（问 2）

| 断言 | 机制 | 依据 |
| --- | --- | --- |
| 治理结构完整性 | **golden 节集基线**：渲染时从源侧合成件提取 `^## ` 节标题清单，产物 diff 节集=逐一在位无缺节 | 节集随源侧自动演进，不硬编码节数（防节增删失配） |
| 无 frontmatter | 产物首行 ≠ `---`（工具声明/模型指定不入会话合同） | session 面 contracts 语义 |
| sessionBody 在位 | 「会话面补充」分隔段存在+sessionBody 内容逐行在位 | 组合完整性 |
| derived 对拍 | `--check` 模式对拍现役产物，复用 ADE-B derived_identical/drift 词表，drift 即 rc=1 | ADE-B 先例直用 |
| 渲染幂等 | 连续两次渲染字节一致（组合管线无时间戳注入） | 管线纯净性 |

## 三、全席替代排期草案（问 3）

- **批 0（样板，P4 前顺手件窗，不触主线）**：ceo-chief-of-staff 一席走通全链（sessionBody 真源化→渲染→五断言→golden 过）——组合管线样板验证。
- **批 1（P4 收口后）**：CTO/CPO/CAO/CHO 四席（含本席手作件退役）。
- **批 2**：CFO/CMO/COO/CSO 四席。
- **批 3**：Registry 席+执行席（FD/ST/R&D 等）收尾。
- **避峰**：批 0 纯管线+文档零冲突；批 1-3 在 P4 收口后开——与 §8.7 P5 解锁批（TriMLC 侧 spawn 实施）**解耦可并行**（LG-024=合同面，P5=运行面）。
- **退役纪律**：每席「golden 过+对拍过」双门过后，对应 `.claude/hub/` 手作件归档（`.fade/hub-snapshots/` 存档，删除候 CEO 裁）。

## 四、ceo 席 session 变体同步升格（问 4）

**作批 0 样板先行，不候泛化批**——LG-023 正签件=现成对拍基线：升格渲染件 vs 正签件 diff 应恰为「治理结构 13 节」增量（天然第二方法交叉验证）。

**CHO 保留①语义定谳（顺势闭环）**：复用机制 vs 复用文件——**复用机制（sessionBody 声明派生+渲染管线），不复用文件（LG-023 正签会话合同不直接充当组长合同）**；组长合同源=BL 自有 session-body+JD+五件套+binding（P5 批落，照 CHO 验收件三条保留执行）。

## 五、候 BOD 裁点

1. 升格公式与初版零剥离裁定；
2. sessionBody 真源化落点（独立 session-body.md vs agent.md 标记段——渲染管线实施时定，两案皆通）；
3. 三批排期与 P4/P5 避峰关系照准；
4. 手作件归档处置（.fade 存档 vs 删除）。
