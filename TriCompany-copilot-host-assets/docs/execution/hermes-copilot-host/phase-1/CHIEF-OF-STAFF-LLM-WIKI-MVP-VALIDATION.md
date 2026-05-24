# Chief Of Staff LLM Wiki MVP Validation

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only phase evidence）
- publishedFrom: 当前文件（support evidence）
- syncMode: audit-record
- executionTier: phase-evidence
- updateRule: 仅在新增验证证据、补充半自动链路结论或迁移说明时更新
- stableConclusionBackfill: 稳定结论只回填到 TriCompany/docs/execution 主文档、workflow 真源与 prerequisite runbook
- lastSyncedAt: 2026-04-28

日期：2026-04-20
状态：首条闭环验证已执行，结果为 PASS

## 文档定位

本文用于定义总助专属 LLM wiki 的首条 MVP 验证方案。

验证目标是：不用等完整代码实现，也能先用目录、对象规范和人工或半自动整理过程，完成一条 `inbox -> wiki -> audit` 的真实闭环。

## 验证目标

- 至少向 `inbox/` 投入 3 份零散资料。
- 生成或更新至少 1 页 `wiki/` 页面。
- 生成至少 1 份 `audit/` 记录。
- 可以回答“这页 wiki 来自哪些资料、何时整理、由谁触发”。

## 本轮执行结果

- 输入资料已投放 3 份到 `knowledge/chief-of-staff/inbox/`。
- 已生成 1 页 wiki 页面：`knowledge/chief-of-staff/wiki/chief-of-staff-llm-wiki-current-state.md`。
- 已生成 1 份 audit 记录：`knowledge/chief-of-staff/audit/wiki-refresh-2026-04-20-001.json`。
- 本轮判定结果：`PASS`。

## 本轮新增半自动验证结果

- 已补上首版半自动刷新入口：`python -m runtime.cognition.chief_of_staff_llm_wiki_refresh --page-id PAGE_ID --title TITLE`
- 已补上独立验证命令：`python -m runtime.cognition.chief_of_staff_llm_wiki_validation`
- 本轮实际运行结果：测试 `Ran 1 test`，结果 `OK`
- 已在真实总助资料目录完成一次半自动刷新：
  - `knowledge/chief-of-staff/wiki/chief-of-staff-llm-wiki-semi-auto-current-state.md`
  - `knowledge/chief-of-staff/audit/wiki-refresh-2026-04-20-151649.json`
- 当前判断：总助专属 LLM wiki 已从“纯手工闭环”进入“手工投放 + 代码半自动编译”阶段

## 前置条件

- `knowledge/chief-of-staff/inbox/` 已存在。
- `knowledge/chief-of-staff/wiki/` 已存在。
- `knowledge/chief-of-staff/audit/` 已存在。
- `docs/workflow/chief-of-staff-llm-wiki-object-spec.md` 已存在。

## 测试输入建议

当前首轮建议准备 3 份资料：

1. 一份会议笔记
2. 一份零散判断或备忘录
3. 一份 JSON 结构化记录

建议命名示例：

- `2026-04-20-chief-of-staff-meeting-note.md`
- `2026-04-20-chief-of-staff-scratch-note.md`
- `2026-04-20-chief-of-staff-facts.json`

## 验证步骤

### Step 1：投放资料

- 把 3 份资料放进 `knowledge/chief-of-staff/inbox/`。
- 其中至少 1 份使用 `source-template.md` 的 frontmatter 结构。

本轮实际输入：

- `knowledge/chief-of-staff/inbox/2026-04-20-chief-of-staff-meeting-note.md`
- `knowledge/chief-of-staff/inbox/2026-04-20-chief-of-staff-scratch-note.md`
- `knowledge/chief-of-staff/inbox/2026-04-20-chief-of-staff-facts.json`

### Step 2：做最小主题整理

- 根据资料内容确定一个主题页，例如“总助记忆系统”或“总助任职前置条件”。
- 不要求一次整理所有主题，只要求先形成 1 页。

### Step 3：生成 wiki 页面

- 在 `knowledge/chief-of-staff/wiki/` 下新建或更新 1 页 wiki 页面。
- 页面至少包含摘要、当前整理事实、当前判断、待确认问题、来源五个区块。

本轮实际输出：

- `knowledge/chief-of-staff/wiki/chief-of-staff-llm-wiki-current-state.md`

### Step 4：生成 audit 记录

- 在 `knowledge/chief-of-staff/audit/` 下写入 1 份 JSON 记录。
- 记录中必须包含输入资料 id、输出页面 id、触发方式、时间和状态。

本轮实际输出：

- `knowledge/chief-of-staff/audit/wiki-refresh-2026-04-20-001.json`

### Step 5：人工复核

- 复核 wiki 页面是否带来源清单。
- 复核 audit 是否能回指 input source 和 output page。
- 复核是否没有把 wiki 页面直接写成正式制度或 `.github` 主档。

## 验收标准

- `inbox/` 中真实存在 3 份资料。
- `wiki/` 中真实存在至少 1 页整理结果。
- `audit/` 中真实存在至少 1 份记录。
- wiki 页面能回答“整理出了什么”。
- audit 记录能回答“从哪里来、何时整理、由谁触发”。

## 判定规则

- 满足全部验收标准：`PASS`
- 有 wiki 页面但缺来源回链或缺 audit：`PARTIAL`
- 只有 inbox 投放，没有 wiki 页面：`FAIL`

## 当前输出建议

首轮验证完成后，至少回填：

- 生成的 wiki 页面路径
- 生成的 audit 记录路径
- 本轮使用的 input source 列表
- 当前发现的问题与下一步修正建议

本轮已回填：

- 输入资料路径、wiki 页面路径和 audit 记录路径
- 本轮判定结果 `PASS`
- 半自动验证命令与运行结果
- 半自动真实运行产生的新 wiki 页面与 audit 记录
- 下一步建议：优先把这条半自动编译链接到真实工作资料刷新，再考虑接入 recall 与 schedule / cron

## 直接相关文件

- `CHIEF-OF-STAFF-FORMAL-APPOINTMENT-PREREQUISITES.md`
- `../../workflow/chief-of-staff-llm-wiki-object-spec.md`
- `../../engineering/chief-of-staff-llm-wiki-priority-plan.md`
