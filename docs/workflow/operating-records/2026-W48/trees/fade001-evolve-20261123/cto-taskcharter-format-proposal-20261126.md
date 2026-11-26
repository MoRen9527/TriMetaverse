# CTO 提案·任务书格式（技术方案+验证强度视角·2026-11-26）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-taskcharter-format-proposal-20261126.md·CTO 面提案）
- syncMode: write-time
- 承接: CEO 两原则（2026-11-26 22:33 经 BOD·7 席联审）

## §一 · verify 形态（双轨）

| 形态 | verify 写法 | 铁律 |
|---|---|---|
| **简单任务**（任务书内 schema） | **机械判据直接内嵌**：可执行命令 + 期望读数 + EXIT 断言（三项齐） | **判据须机器可执行**；「人工确认/看情况」=不合格 |
| **复杂任务**（索引+另出方案） | **技术方案内带测试计划**（单测/集成/回归/门禁矩阵·分件列）；任务书只留**验收门清单 + 指向方案测试节的引用** | 任务书不复制测试细节（防双源漂移）·只指路 |

## §二 · 「复杂到要另出技术方案」的判据（任一命中=复杂）

1. **跨模块**：≥2 模块接口/契约变更（含公共 schema）。
2. **架构级**：数据模型 / 持久化格式 / **判据或 rubric 定义** / 协议变更。
3. **风险面**：不可逆操作 / 生产路径写入 / 权限或凭证面 / 迁移动作（搬运/变换数据）。

**今晚实测锚**：rubric v2.3.0→v2.3.1 命中第 2 条（判据定义变更）——**当时按简单形态在任务书内直接改 rubric，结果语义矛盾由 BOD 读码才抓出**（本应走复杂形态：技术方案先过语义推演）。

## §三 · rollback 落法

| 形态 | 要求 |
|---|---|
| 简单 | 任务书必填 **`rollback` 一行**：commit 级 revert + 影响面一句（哪些产物会回退） |
| 复杂 | **技术方案必含「回滚方案」节**：数据/状态/外部依赖三面 + **回滚验证方法**（怎么证明回滚成功）；任务书 `rollback_ref` 指向该节 |

## §四 · 三面同源断言（今日教训·schema 必加字段）

**`tri_source_assertion`（必填）**：`{doc: 文档何处断言, impl: 实现何处断言（文件:行/测试名）, semantics: 业务语义何处断言（案例/实证）}`——**三面缺任一面 = 任务书不合格**。

**实证**：v2.3.0 时 rubric 文本（周目录树快照）↔ 实现（`_collect_a` 同目录对照）↔ 语义（carry 搬运必增件）**三面分叉**——若 schema 有本字段，申报 tri_source_assertion 时即会暴露（实现面无法指着一条能过 carry 的测试）。**v2.3.1 收口后已加「明细名互见」测试=该断言的机械形态**（future 任务可直接引用此测试名）。

## §五 · schema 骨架（两形态）

```
简单: { id, title, scope(≤1 句), steps[], verify{cmd, expect, exit},
        rollback(1 行), tri_source_assertion{doc, impl, semantics} }
复杂: { id, title, summary(索引), prd_ref, tech_plan_ref,
        verify_gate{ gates[], test_plan_ref },
        rollback_ref, tri_source_assertion{doc, impl, semantics} }
```

**共用校验**：`verify` 三项齐（简单）/`verify_gate` 门清单非空（复杂）；`rollback` 或 `rollback_ref` 必有一；`tri_source_assertion` 三面齐。

## §六 · 使用依据

CEO 两原则（BOD 转 22:33）+今日 rubric v2.3.0→v2.3.1 全链实录（BOD 读码抓 BUG·a8cc5f1/fe24f3c）+SOP §三（三断言）+D-15/D-24/D-46/D-47。

---
—— CTO 小狄（m-cto）·写前现查 2026-11-26T14:33Z（+0800=22:33）
