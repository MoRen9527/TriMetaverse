# 任务书格式提案（COS·收口保障+树协议视角）

- sourceOfTruth: 本卷（COS 对 CEO 任务书形态两原则的建议）
- 令源: CEO 原则（BOD 22:33 转）——①不复杂=任务书内定完整 schema ②复杂=索引+摘要+另出 PRD/技术方案
- 时点: 写前现查 2026-11-26T22:35+0800（D-47 原值）

## §一 · schema 字段清单（两套）

**简单形态**（任务不复杂·产品+技术全在书内）：
```
{task_id, title, goal(一句), owner_seat, complexity:"simple",
 plan(步骤3-5), deliverables[{path, acceptance_anchor}],
 verify(可判断言·单层), rollback(单文件 bak + 锚),
 depends_on[], deadline}
```

**复杂形态**（索引+摘要·另出 PRD/技术方案）：
```
{task_id, title, goal, owner_seat, complexity:"complex",
 summary(≤200字·做什么+为什么+验收总纲一句),
 artifacts:{prd:"<path>", tech_plan:"<path>", arch:"<path>"},
 index[{section, file, lines}],        ← 章节→artifacts 定位表（拾取面按此认）
 acceptance(验收总纲 3-5 条),          ← 总纲在此·细则在 PRD
 verify(分层断言·见 §四), rollback(树级快照+git 锚),
 depends_on[], deadline}
```

## §二 · 复杂度判定（谁判·判据·可判性）

**判据三问（任一即复杂）**：
1. **跨模块/跨仓**（产出物落 >1 repo）
2. **新机制/新架构**（非既有件扩展·须新设计）
3. **多席协作**（施工席 >2 或含联合验收）

**判定形（双轨）**：
- **机械预判**：①跨仓=产出路径 repo 数（可脚本判）／③多席=owner_seat 去重数（可脚本判）
- **人工确认**：②新机制=COS 分诊（入批件时判）·**CEO 批时终确认**（M4-v2 批权）
- **落地**：**起草时 COS 填 complexity 初判 → 机器校验 ①③ → CEO 批时确认 ②**

## §三 · 复杂形态挂载（树协议路由+拾取面）

**树位**（`docs/workflow/operating-records/<week>/trees/<tree-id>/`）：
```
taskcharter.md   ← 索引+摘要本体（含 index 表）
prd.md           ← PRD（产品方案）
tech-plan.md     ← 技术方案（架构+实施）
```

**路由**：**派工单只引 `taskcharter.md`** → 执行席读 taskcharter → 按 `index` 表定位 prd/tech-plan 章节。

**拾取面怎么认**：**树 manifest 增 `artifacts[]` 列**（`[{kind:"taskcharter"|"prd"|"tech-plan", path, sha16}]`）——拾取面读 manifest 认全件·**不解析正文**（与 FADE face 路由并立·face 管域·artifacts 管件）。

## §四 · 收口验（简单 vs 复杂分形）

| 形 | verify | rollback |
|---|---|---|
| **简单** | **单层断言**：deliverables 逐件存在+内容断言（jq/grep 可判） | **单文件 bak**（`<file>.bak-<ts>` + sha256 锚） |
| **复杂** | **分层三件**：①索引完整性（artifacts 全在+sha16 对表）②PRD 验收总纲逐条断言 ③tech-plan 实施完成度（清单对表） | **树级快照**（整树 tar/git commit 锚·回滚=commit revert） |

**共同铁律**：**验收锚必在 taskcharter 批时写定**（禁施工后补）·verify 断言须**机器可跑**（禁「目视检查」类）。

---
—— COS 小贾（m-cos·收口保障+树协议视角）·写前现查 2026-11-26T22:35+0800（D-47 原值）
