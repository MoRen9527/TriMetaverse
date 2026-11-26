# CAO 提案·任务书两形态格式规范（CEO 两原则·制度/命名/门禁视角·≤1 页）

- sourceOfTruth: 本件（trees/fade001-evolve-20261123/cao-taskcharter-format-proposal-20261126.md·CAO 联审意见）
- syncMode: write-time
- lastSyncedAt: 2026-11-26T22:32:10+08:00（date 现查原值·写前跑·D-47 正形）
- 令锚: CEO 两原则（BOD 2026-11-26T22:34 转）·7 席联审·今晚回

## 一 · 命名与落点（两形态用同一命名族·以字段区分不靠文件名猜）

| 项 | 规范 |
|---|---|
| **命名** | 两形态**同一命名**：`charter-<ISOts>.json`（复刻现役形·如 `charter-20261123T024923Z.json`）——**不靠文件名区分形态**（文件名区分=看名猜形，D-92 一族的老坑） |
| **形态字段** | 新增 **`form: "inline" \| "index"`**（必填·枚举二值）——**形态由字段声明·机械可判** |
| **落点** | 树目录 `trees/<tree>/`（现役照旧）；`form=index` 时同目录并列 `prd-<ts>.md` + `techplan-<ts>.md` |

## 二 · schema 机械校验（建议入 D 系·与 D-95 审批状态机咬合）

**共有必填**：`charter_id`／`form`／`status`／`items[]`／`approval{}`（现役已有 schema_version/charter_id/title/source/status/items/charter_revision·**增量只加 form+校验，不推翻现役**）。
**`form=inline`**：每 item 必含 `product_design`+`tech_design` 两段（非空串）。
**`form=index`**：每 item 必含 `prd_ref`+`techplan_ref`——**指针须一步可达**（`git show <sha>:<path>` 或文件存在·D-95 指针精度款同形）。
**枚举**：`status ∈ {draft, pending_approval, approved, in_progress, closed}`；`approval.approved_by=="CEO"` + `signature_slot` 非空（D-95 已定形·此处只引用）。

## 三 · 「简 vs 复杂」判定纪律化（谁判/判错/可否机械检）

1. **谁判**：**主笔席起草时定 `form`**（起草者最知复杂度）→ **CEO 批时确认**（批即认形·形错随批退回）。
2. **判错处置（不对称）**：**简单误判为复杂**=轻（多写一份 PRD·浪费非危害）；**复杂误判为简单**=**重**——schema 塞不下复杂内容→**必然产生悬空**（今晚教训①的温床）。处置：批时发现即退回改形；**施工后发现则强制补出 PRD/techplan 并回填索引**（不许「已开工就硬塞」）。
3. **可否机械检**：**辅助可·终判不可**——启发式提示（`items` 数 >8 或含跨 item `depends_on` 或单 item 字段 >12 → 提示「疑复杂形·请复核」）；**最终判定属判断**（D-98 原则：能机械判的机械判，不能的归人·**不假装能判**）。

## 四 · 今晚两教训入 schema（CEO 提醒·我的落法）

1. **判据悬空**（rubric 声称不存在的实现）→ **引用可验证校验**：schema 内**任何指向实现/文件/函数的引用**必带可验锚（`path+sha16` 或 `git cat-file -e` 可验）；**引用不存在=校验失败**（不是警告·是 fail-closed）。
2. **三面同源**（文本/实现/语义缺一即悬空）→ **`three_face` 校验三件**：①**文本面**=任务书 item 有声明 ②**实现面**=声明的 path/函数**真实存在**（机械可检）③**语义面**=行为符合声明（**归人判·机械只核前两面**）——**三件缺任一即悬空·校验只报前两件·第三件显式标「待人工确认」**（不冒充能判语义）。

## 五 · 与既有条款关系

- **D-95**（CEO 批令机械可证形）=审批状态机正身·本条只引用不重写；
- **D-98**（可机械判者一律程序化）=本条 §三 3 的判据来源；
- **D-92**（转引三查·指针精度）=本条 §二 `prd_ref`/`techplan_ref` 指针形同源；
- **建议入册形**：本次为**条文草案**（候 CEO 批）→ 批后由本席铸为 D 系条款（推荐名：**任务书两形态与 schema 校验**·与 D-95 同族并档）。

---
—— CAO 小行（m-cao）·2026-11-26 22:32:10 +0800（date 现查原值·写前跑）
