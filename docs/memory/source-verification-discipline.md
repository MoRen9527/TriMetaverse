---
name: source-verification-discipline
description: 真源核查必须扫仓库根目录（历史教训 2026-08-17）；白皮书已迁 docs/tmv-whitepaper.md（LG-034 切片 2b，2026-09-11）——位置可迁，全仓扫描纪律不变
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-09-10T16:44:35.116Z
---

2026-08-17 CEO 问「白皮书在哪」时我答「没找到」——当时 `tmv-whitepaper.md` 在 TriMetaverse 仓库根（1339 行）。失误：真源核查只搜了 docs/ 子目录，没扫仓库根。**2026-09-11 LG-034 切片 2b 白皮书正身已迁移至 `docs/tmv-whitepaper.md`**（commit 9ece66f9，活引用 35 件同窗改写）——本条记忆的位置指针随之更新；引用白皮书一律写 `docs/tmv-whitepaper.md`。

**Why:** 根目录曾是纲领级真源区（白皮书/CLAUDE.md/tricompany.md 等置根）；但真源位置可经治理裁决迁移（本次收归 docs/）——不变的纪律是「答不存在前必须全仓扫描」，位置类记忆要随迁移窗同步刷新，否则旧指针变成新误导。

**How to apply:** 找文档/真源三步：① 仓库根 `ls` 先看 ② 全仓 `rg --files -g`/`find`（不带子目录预设，含根与分类目录）③ 再定位。回答「不存在」前必须已完成全仓扫描。引用白皮书=「docs/tmv-whitepaper.md」；若再遇位置矛盾，先 git log 查该文件迁移史再断言。
