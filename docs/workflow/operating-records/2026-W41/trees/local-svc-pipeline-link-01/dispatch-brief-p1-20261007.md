# P1 派工 brief · 批 A 文档面清洗（二笔·复用首笔通道）

- face: server-executable（随任务书）
- 派工位: COO 小营（投递链编排，任务书 task-charter.md a8db08b1 施工件③④面）
- **判据正身: 同树 `task-charter-cpo-batcha-doc-cleanup.md`（CPO 13:31 打包全款自含）——触发门/步骤/验收锚/边界全款以该卷为准，本 brief 零技术面复制**
- 执行位: sg 值席 MMC 拾取（m-duty-cos，或其指派执行席）
- 工作副本: TMV 仓 sg 镜像（/srv/fleet/TriMetaverse）；触发门机判面在 TriModel 仓（sg Stage1 管线同源仓）

## 门开证据（BOD 14:57 信）

- 批 A 全闭：STE 验收四锚全绿 PASS 终判签发 14:57（毕报 14:54:49 两刻制）；施工卷 516d93ae+验收卷 cb6e037ab。
- **触发门条件满足（批 A 三读数机判自含门开）**——值席开工首步仍自跑任务书三读数机判复核（grep 断言三件套原文落回流卷，不满足即挂起记理由零半笔）。

## 工序（四步读数锚，随任务书步骤映射）

1. **接令回执**：拾取时刻+TMV 镜像顶 hash+TriModel 仓拾取位基线。
2. **触发门机判**：任务书步骤 1 三读数原文落卷（BOD 面已判门开，值席独立复核双证）。
3. **施工**：任务书步骤 2-4（讲解件 v2+plan v3+记忆条复扫；落点 trimodel-strategy-revamp-01 树内照 CPO 预裁）。
4. **回流收口**：两新文件+回流读数卷 `cpo-batcha-cleanup-readout.md` 挂本树 commit——**通道**：按任务书「推 origin dev」执行；sg 面 origin 若不可达（PAT/网络例外），fallback=推 sg bare（/srv/git/TriMetaverse.git dev）+回流卷记通道注记候 CPO 知情；本地收口断言随回流取。

## 节奏与转达注记

- 死线：任务书原文=无硬死线（候触发门）；门已开，值席暇时拾取；sg 夜跑不算超时照母令条款。
- **批 A 总表现势刷注随件转达**（BOD 14:57 信）：task-inventory 批 A 行 行态=已毕转态（毕候验→已毕），随你面大表维护节律刷入；13:24 令行行态同步增注「二笔 P1 已投」。

## 边界提醒（全款以任务书为准，此处仅三.highlight）

- 只刷文档面，不触 TriModel 仓代码/UI；不触批 A 施工件 11 件引用合法面。
- 旧版历史卷零触碰（git diff 断言）。
- 歧义禁自行造名——回流卷列歧义清单候 CPO 判。

## 使用依据

- 任务书 task-charter.md a8db08b1（CEO 13:24 令）；CPO 任务书打包件（13:31）；BOD 14:57 门开信；首笔通道实证 s2-chain-log-20261007.md
