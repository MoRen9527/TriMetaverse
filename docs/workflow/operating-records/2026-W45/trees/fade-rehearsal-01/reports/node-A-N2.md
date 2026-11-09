# 节点收口报告 A-N2（执行节点·首 run a 彩排·机器线树）

```json
{
  "nodeId": "A-N2",
  "agent": "SeniorDeploymentEngineer",
  "startedAt": "2026-11-03T12:44:56Z",
  "finishedAt": "2026-11-03T12:54:27Z",
  "baselineCommit": "697ca7d6a",
  "trigger": "manual（COO 拾取派工令 2026-11-03T20:44:56+08·A-N1 树根路由·DCE 输入只认方案卷 hash e8e6eec1）",
  "actions": [
    {"t": "in-window#1", "act": "接令四锚对表：方案卷 semantic-work-plan-v1.0.json 工作区 sha256 前 8=e8e6eec1 对表 CAO 防呆闸④ ✓（勘定注：e8e6eec1 系 sha256 内容 hash 非 git 对象·cat-file 失败后以 sha256sum 直算对表）·任务书 043cd1e0a+全树清单 87e0deda1+N1 毕报 e42e8d612 引用核对 ✓", "commit": "—"},
    {"t": "in-window#2", "act": "OP-1（G1 中文路径反向索引）：构造件-中文路径探针.md 引用面节+1 行「- 反向索引：nested/fixture-note.md（G3 同名对·各自独立登记）」——expect 逐字对表 ✓", "commit": "—"},
    {"t": "in-window#3", "act": "OP-2（G2 越界引用归一化）：fixture-outbound-probe.md 越界行改 `../file-family-maintenance/...` → `docs/workflow/operating-records/2026-W44/trees/file-family-maintenance/draft-ceo-bod-session-20261102.md`+括注扩「（越界探针引用·归一化登记·不挂图谱真身）」——expect 逐字对表 ✓", "commit": "—"},
    {"t": "in-window#4", "act": "OP-3（G3 同名消歧反向索引）：fixture-note.md 引用面节+1 行「- 反向索引：nested/fixture-note.md（同名件·G3 消歧·各自独立登记）」——expect 逐字对表 ✓·S1 语义靶「维护流程现状」段零触碰", "commit": "—"},
    {"t": "in-window#5", "act": "OP-4（同名对回指）：nested/fixture-note.md 引用面节+1 行「- 反向索引：构造件-中文路径探针.md」——expect 逐字对表 ✓", "commit": "—"},
    {"t": "in-window#6", "act": "OP-5（verify-only）：fixture-note.md 元信息头三要素读数——sourceOfTruth/syncMode=rehearsal-fixture/lastSyncedAt 三要素全在位·零改动即过 ✓", "commit": "—"},
    {"t": "in-window#7", "act": "OP-6（verify-only）：nested/fixture-note.md 元信息头三要素读数——三要素全在位·零改动即过 ✓", "commit": "—"},
    {"t": "in-window#8", "act": "自检三断言：git diff 计数=4 files·4 insertions·1 deletion（3 行增+1 行改·OP-1~4 精确合计）✓·S1-PROTECT-OK（fixture-note.md L7-9 语义靶段 diff 零触碰）✓·方案卷 sha256 复断 e8e6eec1 不变 ✓", "commit": "—"},
    {"t": "in-window#9", "act": "真实 re-scan：python scripts/doc-graph-scan.py → RC=0·files=334·internal_edges=684·external_files=78·head=697ca7d6a → docs/doc-graph.json", "commit": "—"},
    {"t": "in-window#10", "act": "G2 对冲①：--who-cites W44 真身（draft-ceo-bod-session-20261102.md）→ exact=0 零挂接 ✓（越界引用归一化后未挂图谱真身·隔离面不越界·彩排设计意图验证成立）", "commit": "—"},
    {"t": "in-window#11", "act": "残留断言②：粗查 fade-rehearsal 命中 1=fade-rehearsal-001/reports/design-review.md → 勘定系历史 FADE-001 实例异件（001 vs 01 不同树）非本彩排残留 → precise 复断 grep \"2026-W45/trees/fade-rehearsal-01\" doc-graph.json=0 命中 ✓ 隔离面零残留", "commit": "—"},
    {"t": "in-window#12", "act": "⑧段首验：Skill(tri-fade011-score) → 实录报错 Unknown skill: tri-fade011-score（首验窗偏离实录·见异常与处置）", "commit": "—"},
    {"t": "in-window#13", "act": "⑨段首验：Skill(tri-fade011-close) → 实录报错 Unknown skill: tri-fade011-close（同上双缺位实录）", "commit": "—"},
    {"t": "2026-11-03T12:54:27Z", "act": "本报告落卷+commit 锁笔+推 sg-server+毕报三送（树根 COS+CAO+BOD）", "commit": "本报告落卷 commit"}
  ],
  "actionsTimeNote": "动作#1-13 序贯执行于 startedAt–finishedAt 时窗内（约 10min·纯机械三域+扫描验证）·无逐动作独立现查锚·按宁缺勿造不填估读值·序号表序（对表 N1 正形样板）",
  "artifacts": [
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/构造件-中文路径探针.md", "note": "OP-1·+1 行反向索引"},
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-outbound-probe.md", "note": "OP-2·越界引用归一化+括注"},
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-note.md", "note": "OP-3·+1 行同名消歧·S1 靶段零触碰"},
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/nested/fixture-note.md", "note": "OP-4·+1 行回指"},
    {"path": "docs/doc-graph.json", "note": "re-scan 产物（files=334·edges=684）"},
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/reports/node-A-N2.md", "note": "本报告"}
  ],
  "gateResults": [
    {"gate": "OP-1 expect 逐字对表", "result": "PASS（反向索引行逐字一致）"},
    {"gate": "OP-2 expect 逐字对表", "result": "PASS（归一化路径+括注逐字一致）"},
    {"gate": "OP-3 expect 逐字对表", "result": "PASS（G3 消歧行逐字一致·S1 靶段未入 diff）"},
    {"gate": "OP-4 expect 逐字对表", "result": "PASS（回指行逐字一致）"},
    {"gate": "OP-5 verify-only 三要素", "result": "PASS（在位·零改动即过）"},
    {"gate": "OP-6 verify-only 三要素", "result": "PASS（在位·零改动即过）"},
    {"gate": "DCE 自检三断言", "result": "PASS（diff 计数 4 files/+4/-1 精确·S1-PROTECT-OK·方案卷 hash 不变）"},
    {"gate": "真实 re-scan", "result": "PASS（RC=0·files=334·internal_edges=684·external_files=78）"},
    {"gate": "G1 中文路径全链不失真", "result": "PASS（构造件-中文路径探针.md 登记面含中文路径无失真·re-scan RC=0 旁证）"},
    {"gate": "G2 越界引用归一化", "result": "PASS（对冲① who-cites 真身 exact=0 零挂接·归一化登记生效）"},
    {"gate": "G3 同名兜底消歧", "result": "PASS（同名对各自独立登记·回指行互指无串件·SKIP_PARTS 豁免域内不作扫描主体照设计）"},
    {"gate": "隔离面残留对冲②", "result": "PASS（precise 路径 grep=0·粗查命中系历史 FADE-001 异件已排除）"},
    {"gate": "⑧段 tri-fade011-score skill", "result": "FAIL-EXPECTED（Unknown skill 实录·首验窗偏离数据非阻断）"},
    {"gate": "⑨段 tri-fade011-close skill", "result": "FAIL-EXPECTED（Unknown skill 实录·同上）"},
    {"gate": "T5 触界自检（out_of_scope 三项+基准五件不可变）", "result": "PASS（S1 靶段/维护流程现状零触碰·方案卷/任务书/全树清单 hash 复断不变·语义面零改动）"}
  ]
}
```

## 异常与处置

**规程偏离实录一：⑧⑨段 skill 双缺位（彩排首验窗正形数据）**——按 COO 派工令「⑧⑨段按新名调 skill（tri-fade011-score/tri-fade011-close·彩排即首验窗）」执行双调用，实录双双报错 `Unknown skill`（本 session 可用 skill 在册列表无此二项）。定性与处置：本席不擅自以自写评分/收尾逻辑替代 skill 语义面（越权+污染彩排对照基准）；照 N1 node-report-check 同形先例（铁律③精神）如实记档候勘——skill 实装候 TriSkill 面（tri-fade011 定号系任务书 ⑨段防 404 随勘同名锚 a75822c72，但 skill 包未随彩排环境布装）。此偏离不阻断节点收口：本节点 §范围=DCE 机械三域执行+对冲验证，⑧⑨段语义面归 A-N3 树根收尾窗（T5 门）消费本报告。

**异常实录二：方案卷 hash 形态勘定**——e8e6eec1 非 git 对象（cat-file -t 失败），勘定=sha256 内容 hash 前 8 位（非 git commit/blob）——工作区 sha256sum 直算对表 e8e6eec1c03b6af6 前 8 位 ✓。对后续节点提示：验方案卷冻结态用 `sha256sum` 非 git 工具。

**异常实录三：残留断言粗查假阳性**——`grep "fade-rehearsal" doc-graph.json` 命中 1，初勘疑残留，precise 化勘定=`fade-rehearsal-001`（历史 FADE-001 实例路径·001 带 -001 后缀）非本彩排树（01 无后缀）——精确路径复断零命中。教训注：断言式 grep 需树名全等禁前缀模糊。

**异常实录四（工具面）**：git diff 管道 grep 行过滤零输出（疑 CR 干扰），改 git diff tail 直读断言——读数等价·不影响判定。

## 断点交接

**A-N3（收尾节点·COS 树根）**：本席 DCE 六 OP 全执行毕+对冲验证全绿（上表 gateResults），隔离面施工留痕待 T5 门审计。双线串行化注记（对 FSD 小全协调注记 2026-11-03T12:50:07Z 回执）：**本席 DCE 全程纯 Edit+扫描·零 checkout/reset 类操作**；fixture-note.md 本席改动面仅引用面节+1 行（L17·机械三域），「维护流程现状」段（L7-9·B-N2 语义靶）原样完整保留——B-N2 语义改动可在本卷 commit 后安全衔接，T5/T6 审计面双线 diff 各自干净（机械三域 vs 语义 L9 替换分界清晰）。⑧⑨段 skill 缺位实录已入本报告异常段，候 A-N3 树根窗并入卷级收尾裁定。

## 使用依据

- 方案卷 semantic-work-plan-v1.0.json（冻结 hash e8e6eec1·DCE 唯一输入·六 OP 逐条 expect）
- 任务书 v1.0（043cd1e0a 定稿+a75822c72 随勘·冻结 hash 4493f23d·两线分工与铁律）
- 全树清单 v1.0（87e0deda1·冻结 hash a39746ee·节点链 A-N1→A-N2→A-N3）
- N1 毕报 node-A-N1.md（e42e8d612·授权链四环核对 PASS·报告十字段正形样板）
- FADE spec v2.0.6 §2.7（十字段+门禁）
- scripts/doc-graph-scan.py v2（SKIP_PARTS 豁免域含 operating-records·G1 中文路径/G2 归一化/G3 同名兜底三判据·--who-cites 反查）
- COO 派工令 2026-11-03T20:44:56+08（执行节点路由+铁律全单）
- FSD 小全协调注记 2026-11-03T12:50:07Z（双线同文件串行化回执锚）

---

落款：2026-11-03T12:54:27Z（date 现查原值·写前锚）
