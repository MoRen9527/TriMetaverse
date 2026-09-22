# O4 代码批窗·侦察底稿（FSD；2026-09-22 04:1x +0800）

## 侦察读数（三口径分流）

| 口径 | 计数 | 说明 |
|---|---|---|
| CTO 令范围（runtime/cognition/*.py 注释/docstring） | ~133 处 | 本工单主对象 |
| 守卫 ade_legacy_guard 现报 | 405 处未审定 | 含 .md 证据/培训文件（超本工单域——守卫扫全仓） |
| 非守卫非契约 .py 命中 | 258 行 grep | 含 FADE-001/FAYE-LEFTOVER 等合法 FADE 引用（非 ADE 术语） |

## 分类判据草案（红线内化）

- **可清**：.py docstring/注释中「ADE 模式/ADE 整合阶段/ADE-B」等术语残留 → 照批2 正名（FADE DCE 段/确定性执行规程）
- **禁动**：ade-report 契约值/ADE_PROTOCOL/断言语义期望串/validation 件文本
- **豁免件**：ade_legacy_guard.py 自身（守卫本体=术语执法者非术语残留）
- **交互注意**：清注释后守卫红数应下降（守卫与清扫同向不冲突）

## 待 CTO 确认一条

runtime/cognition/ade_legacy_guard.py 自身含 ADE 字样（守卫本体执法器）——按「禁动契约值」原则守卫件自身豁免清扫？我判=豁免（执法器语义需要），候确认。

## 执行窗建议

O4 主执行建议独立批次窗（133 处逐处分类+守卫红数回归+全量四项——工作量约半窗），非本会话顺手件。排窗候 BOD/CTO。
