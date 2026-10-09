---
name: parallel-window-commit-interference
description: 并行窗提交互踩族——merge 倒退合并丢笔（正向追加复原）与 index 残留暂存件被他人笔收编（empty 归属勘正）双机理
metadata:
  node_type: memory
  type: feedback
  modified: 2026-10-09T02:45:35.922Z
  originSessionId: cdeaa3bc-3f3b-4724-a7d2-2e5da881f2c2
---

多席并行同一工作区/同一分支时，提交互踩有两向机理，处置正形不同（2026-10-09 STE 双案实证）：

**机理一·merge 倒退合并丢笔**：收编并行笔的 merge（如 b006ef71「收编并行笔」）会把分支线上的**旧版本文本覆盖新版本**——STE A5 卷 v1.1 被退回 v1.0（勘形注记被删+命令形退回旧式），事发于磁盘变更通知→git diff 验明。**处置=正向追加复原笔（不 revert merge）**——revert 会把同 merge 里他人合法内容一起退掉；复原笔正向追加丢失语义+卷头落「丢笔复原注记」（merge hash+被覆盖范围+以本笔为准声明）。预防：写联合文档前 git log 查该路径并行落盘（[[parallel-design-file-discipline]]）；merge 后对自己在途文件做一眼 diff。

**机理二·index 残留暂存件被他人笔收编**：`git add` 后 `git commit` 撞 ref 推进失败（exit 128 "cannot lock ref... but expected <旧顶>"），暂存件**滞留 index**；他人随后 commit（即便其 message 只提自己文件）会把我方暂存件顺带入库=署名错位（内容零损，但 commit message 与 stat 不符，考古溯源困惑）。实例：STE 10:41 add A5 勘注→commit 撞 COO 并行笔→COO 6ccfe545 顺带收编。**处置=empty commit 归属勘正**（`git commit --allow-empty` 写明哪笔 stat 里哪些修改实为谁所写+内容与引用锚零差异声明）——零文件改动，不再撞并行窗。预防：add 与 commit 之间窗压到最短（勿隔工具调用轮次）；commit 失败（ref 推进）后**暂存件在 index=暴露态，立即重试**；commit 前 porcelain 检视见他人已暂存项时先协调（[[git-index-commit-convention]] 主律）。

**识别信号**：porcelain 干净但文件内容与 HEAD 预期不符（机理一）；porcelain 无我方 M 行但修改已入库于他人笔 stat（机理二）；两案共同点=「修改去哪了」先验文件现势再验 git 对象，矛盾证据先 `git show <笔>:<path>` 对表禁臆断。

相关：[[git-index-commit-convention]]（path-scoped 例外口径）、[[parallel-design-file-discipline]]、[[closeout-commit-hygiene]]。
