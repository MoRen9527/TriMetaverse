# 共享 JSON 账本写法纪律（load→dump+写后断言）

> 2026-10-06 事故实证：LG-058 收口窗我（SDE）用 Edit 文本行插入法给 in-progress.json 挂候办条——old_string 锚三行（`},`+`{`+l2 条 `"id"` 行），new_string 只写到新条 `},` 结束、忘补回 l2 条开头两行=**吞行 JSON 断链**，坏形入库三小时（13:53 9f6b1bd4/199fcea4 → 14:09 COS dd7bca7f 自 470cccf1 合法基底重建修复）。rebase 重放同 patch=同坏双线（199fcea4 与 9f6b1bd4 内容同坏），merge 自动同解不救。

## 正形（COS 勘正通知口径+本席采纳）

1. **禁文本行插入法改 JSON 账本**——用 Edit 手锚行边界时，old_string 锚住的下一条目开头行必须在 new_string 里补回；锚含邻条内容=最高危姿势。
2. **正形=load→改→dump 全程解析**：`node -e` 或 python 读入→数组操作→写回，结构由解析器保证，永不出断链。
3. **写后 commit 前 json.load 断言必跑**：`node -e "JSON.parse(fs.readFileSync(...))"` 一行——本次若断言在先即拦在门内。
4. **同窗竞争风险**：共享账本多席并行双写（COS 与我同窗双写先例×2）——写前 fetch 看远端新笔，写后速推，坏形滞留时长=污染面时长。

## 关联

- [多 agent 共享仓库 git index 卫生](multi-agent-git-index-hygiene.md)（commit 面卫生）
- [amend 前必验 HEAD 归属](amend-head-ownership-check.md)（共享仓并行纪律）
- COS 账本治理真源：TriCompany/docs/workflow/hub-ledger-governance.md
