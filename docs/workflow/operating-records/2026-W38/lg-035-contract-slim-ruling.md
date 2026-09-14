# LG-035 合同瘦身·CTO 消费裁定（D1-D4+前置核查迁移·夜航窗执行件）

- sourceOfTruth: 本件（CTO 对上件 pair-dedup-full 的消费裁定；夜航窗执行依据）
- syncMode: frozen（执行窗件）
- lastSyncedAt: 2026-09-14T19:3x+0800
- 底本: `lg-035-pair-dedup-pilot.md`+`lg-035-pair-dedup-full.md`（FSD 交付）+CTO 独立复核（本裁定 §二 为 FSD 表外**新发现**）

---

## 一、格式验证（试点件）

**合格，格式冻结** ✓——段级×五源定位×四态判定结构清晰，工具可复跑；全量版同格式采认。§二.2.3 源侧结构观察（frontmatter 三源）实用。

## 二、CTO 复核增量（FSD 表外新发现）

**F1 之外，同段内容级分叉 13 处**（FSD 段表未覆盖——其首句命中法无法捕获同段内改）：
- **类型 A·composite 冗余重复（5 席）**：引号批改（"..." → “...”）时旧句未删只添新句→composite 出现重复 bullet（CFO 当前角色定位/CHO 行为护栏/CMO 当前角色定位/COO 当前角色定位/rd-trainer 技能技艺）→ **agent-body 干净版胜**。
- **类型 B·agent-body 新行未渲染（6 席）**：CEO/COO/CPO 中央收口路由的「2026-09-11 ⑦改排」行、CTO 核心职责「宿主适用域」括注、CAO 两段真源路径修正（TriCompany 为源+前缀完整版）——**agent-body 新刊胜**（正是「改了没生效」根因实证：编辑者对 agent-body 改动因渲染读 composite 而未生效）。
- **类型 C·composite 新行（2 席）**：FSD/STE 核心职责第 8 条 CodeGraph 条仅 composite 有——**composite 新刊胜，补入 agent-body**。

## 三、裁定（D1-D4）

### D1 双源收敛=**agent-body 真源化**（照 business-strategy 五件套先例方向）
- **D1a 内容收敛（今晚窗）**：①35 缺段从 composite 逐字迁入 agent-body（11 席×3：当前原则/运行资产落点/层契约+CSO/DE×1：角色气质）；②13 段差按 §二 判向合并（A/B 型=保留 agent-body 现行；C 型=composite 第 8 条补入）；③段顺序对齐 composite（消除重渲序差）。
- **D1b 管线切源（今晚窗·独立 commit）**：manifest 13 条 `source: <seat>.agent.md` → `<seat>/agent-body.agent.md`（sourceFiles 已含 agent_body，零结构改）。**渲染不变量守护**=切源前后重渲产物除预期 delta（tools 残留清/前置核查迁移/M-001 归位）外**零差异**——即最强验收。
- **D1c 复合件处置=降指针（本批）**：13 件加退役注记头（「本件已退役出渲染链；真源=agent-body.agent.md（D1b manifest 已切源）」）；**git rm 候次批**（13 席大面删除宜观察一窗）。
- 连带触点：`lg024_session_upgrade_validation.py` `_SOURCE_AGENT_MD`（CEO 复合件路径）→随 D1b 改指 agent-body（否则验证漂移）。

### D2 M-001 归位=**按 FSD 建议执行**
CEO/CHO 两席 session-body 席内 M-001 版删除（管线注入版唯一；两版内容重叠实证在 FSD 件）→随重渲落地。

### D3 会话段命名收敛=**列批 2**（今晚窗不动名，零风险原则）
候选口径（供批 2 裁决）：7 异名（通信正名与时刻纪律/启动恢复/开场基线/恢复开场基线/会话面基线/CAO 会话开场基线/周平面 OP 记录）——建议统一为「**通信正名与时刻纪律**」（5 席多数名+语义最完整）；CEO 附段「周平面 OP 记录」系独立内容段（非异名，不并）。批 2 随下一次重渲窗。

### D4 frontmatter 对齐=**随今晚窗**
agent-frontmatter（13 席空壳）填实=各席复合件 frontmatter 内容迁入（name/description/user-invocable；tools 已删）；渲染件旧 tools 残留随重渲自消。渲染源归属=host_object_generation R3 映射（本席域已裁：agent_frontmatter 为 frontmatter 真源件）。

## 四、前置核查迁移（轨 1·方法已批准）

按 trial 三步法全量 13 席：agent-body「固定前置核查」段→一行指针「见 compass 手册〈开工前置核查〉节」；原清单逐字迁入各席 session-body 新节「## 开工前置核查」。**注**：compass 改名与本节指针文案天然衔接（手册新址 compass）——同窗执行。

## 五、夜航窗执行序（分 commit）

1. **TC-A**：agent-body 13 席内容收敛（D1a：补段+判向合并+序对齐）→commit「合同收敛」
2. **TC-B**：agent-frontmatter 13 席填实（D4）→commit
3. **TC-C**：前置核查迁移（13 席 agent-body→指针+session-body 增节）→commit
4. **TC-D**：M-001 席内版删（CEO/CHO session-body）→commit
5. **TC-E**：manifest 切源 13 条（D1b）+lg024 校验件路径改指→commit
5.5 **D1c 复合件退役注记头**（§三 D1c 步序漏项，2026-09-15 00:0x 补列）：**落点=TriCompany 源侧复合件** `source-agents/<seat>/<seat>.agent.md` 13 件各加一行退役头（「本件已退役出渲染链；真源=agent-body.agent.md（D1b manifest 已切源）」）——**非 TMV 发布拷贝位**（发布拷贝=重渲活产物，注记会被 TMV-1 覆盖或污染 diff=0 不变量）；独立小 commit，执行归属照 BOD 分工序（时序上须在 CP2 读数前或明确不在重渲产物面）
6. **TC-F**：compass 管线 target_root 改（+注释+校验件）→commit
7. **TMV-1**：全量重渲（claude-session+copilot+claude 三 host）→**渲染不变量 diff 核**→commit
8. **TMV-2**：compass git mv+junction（+gitignore）→commit
9. **验证**：employee_source_kit/lg024/source_publish_check 三套件+SEC 回归→读数
10. **回执**：逐件 commit+读数报 BOD

**停止线**：任一步异常→停手报告（回滚锚：每步独立 commit 可逆；重渲前 .claude 全目录在版本库）。
