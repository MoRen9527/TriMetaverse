# T3 落实窗换席承办交棒卷（BOD 154b 径裁收回处置·FD→SDE·零写面确认+修笔移交）

- 执行: m-duty-fsd；令面=BOD 154b（换席令）→**CEO 直令收回（15:49Z·SDE 429 重置·SDE 即复跑）**——本卷=卸挂交棒如实档
- 回执现查: 2026-11-17T15:51Z（D-47）
- **零写面确认（收回令前提核对）**: dsh 面 headless patch/acp/sessions 零写 ✓（步③未达——写 face 零启动）；TriCompany 仓三笔修笔=码面（git 交付锚域·非 dsh 写面）已 push

## §一 · 已启动面盘点（如实）

| 步 | 状态 | 读数 |
| --- | --- | --- |
| ①dump 留档 | **毕**（read-only） | headless patch 现役 4 行全文（`[]` 纯骨架+注 2 行）；web patch **4700 行**（头注 11 行全套：transpiler v2/generated 2026-10-16 21:36:10+08/source=TriCompany/source-agents@ce38ece2ebe38）；**顶层结构=单条 `- insert:` 内嵌 preset 数组**（转译器发布形实锚·preset 条目=preset-r-duty-<seat> id/name/config{description,plugins 族 standard 工具套+agent-instructions maxBytes+tool-* 面}） |
| ②生成 | **受阻交棒**（三笔修+一残阻） | 见 §二 |
| ③落实 | 零启动（零写面 ✓） | — |
| ④值面勘 | 零启动 | — |

## §二 · 生成器三笔修笔（已 push·河源已 pull=SDE 复跑直接受益）

| 笔 | 面 | 锚 |
| --- | --- | --- |
| 4f17e75 | **insert 解包形**：web patch 顶层单条 insert 内嵌 preset——filter 双形兼容（顶层直挂+insert 解包）·载体=insert 单条照 registry README 官方正形 | 步① dump 勘正 |
| 20423b5 | CLI 参数名错位修（main 映射 args.webPatch→webPatchPath——白盒直传绕过未暴露·实弹 rc=1 勘正） | 步② 首跑 |
| 3dada21 | !!js tag 尝试（DEFAULT_FULL_SCHEMA）——**河源复跑无效**（见 §三） | 步② 二跑 |

白盒 9/9（insert 形面+顶层兼容面在测）——**白盒盲区如实注**: fixture 无 !!js 形·3dada21 全 schema 修白盒未覆盖（移交建议③载）。

## §三 · 残阻勘形+交棒建议（SDE 复跑直撞面·一阻待解）

- **残阻**: web patch 含裸 `!!js <表达式>` tag（tool-bash/tool-pwsh disabled 条件行·行 24 形）——js-yaml 4 tag 族=!!js/undefined、!!js/regexp、!!js/function 三形，**无裸 !!js**（dsh loader 自定义 schema 形）——3dada21 FULL_SCHEMA 修对此无效（河源 rc=1 同款复现）
- **两案建议（SDE 择形）**:
  1. **文本段截取形（荐）**: preset 段零 !!js（!!js 仅在顶层 bundle 行）——生成器改行级截取（`- id: preset-r-duty-` 条目块边界扫描·零 YAML 全 doc 解析）——绕 tag 面且零依赖 schema 域
  2. 自定义 yaml Type 形: js-yaml 加裸 !!js Type（str 保留原文串·dump 原样回写）——保全 doc 解析路径
- **验面**: 步② 重跑 readout 三断言（presets_total≥13/seats 齐/降权 scan clean）+产物 grep `id: preset-r-duty-` 计数=13（或+额外席）
- 运行形照 fsd-t3-code-readout §三（--anchor /srv/fleet/dsh·js-yaml 在 dsh 安装面 resolve ✓ 步② 已通至 parse 段）

## §四 · 候召态确认

- 卸挂毕：T3 落实窗四步=**SDE 承办**（notice-153 令面照走）；本席回 fallback 候召态——v3 复验线（runner 9d9dfde 前置件在位）/T4 线候召面维持
- 生成器修笔三笔在库（TriCompany dev·4f17e75/20423b5/3dada21·河源已 pull 对齐）——SDE 复跑零重修面（除 §三 一阻）

## §五 · 使用依据

BOD 154b+CEO 收回直令（值席转达）；fsd-t3-code-readout §三 runbook；TriCompany 4f17e75/20423b5/3dada21 diff；R-HY SSH 链实勘读数（本卷 §一）；js-yaml 4 tag 族勘形
