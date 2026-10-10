---
name: parallel-window-commit-interference
description: 并行窗提交互踩族——merge 倒退合并丢笔（正向追加复原）、index 残留暂存件被他人笔收编（empty 归属勘正）、未提交工作区态被并行 rebase 窗重置吞（盘点重放+写后即 commit 锁笔）三机理
metadata:
  node_type: memory
  type: feedback
  modified: 2026-10-10T03:27:34.453Z
  originSessionId: cdeaa3bc-3f3b-4724-a7d2-2e5da881f2c2
---

多席并行同一工作区/同一分支时，提交互踩有两向机理，处置正形不同（2026-10-09 STE 双案实证）：

**机理一·merge 倒退合并丢笔**：收编并行笔的 merge（如 b006ef71「收编并行笔」）会把分支线上的**旧版本文本覆盖新版本**——STE A5 卷 v1.1 被退回 v1.0（勘形注记被删+命令形退回旧式），事发于磁盘变更通知→git diff 验明。**处置=正向追加复原笔（不 revert merge）**——revert 会把同 merge 里他人合法内容一起退掉；复原笔正向追加丢失语义+卷头落「丢笔复原注记」（merge hash+被覆盖范围+以本笔为准声明）。预防：写联合文档前 git log 查该路径并行落盘（[[parallel-design-file-discipline]]）；merge 后对自己在途文件做一眼 diff。

**机理二·index 残留暂存件被他人笔收编**：`git add` 后 `git commit` 撞 ref 推进失败（exit 128 "cannot lock ref... but expected <旧顶>"），暂存件**滞留 index**；他人随后 commit（即便其 message 只提自己文件）会把我方暂存件顺带入库=署名错位（内容零损，但 commit message 与 stat 不符，考古溯源困惑）。实例：STE 10:41 add A5 勘注→commit 撞 COO 并行笔→COO 6ccfe545 顺带收编。**处置=empty commit 归属勘正**（`git commit --allow-empty` 写明哪笔 stat 里哪些修改实为谁所写+内容与引用锚零差异声明）——零文件改动，不再撞并行窗。预防：add 与 commit 之间窗压到最短（勿隔工具调用轮次）；commit 失败（ref 推进）后**暂存件在 index=暴露态，立即重试**；commit 前 porcelain 检视见他人已暂存项时先协调（[[git-index-commit-convention]] 主律）。

**机理三·未提交工作区态被并行 rebase 窗重置吞**（2026-10-10 COS 案二次实证，与 STE 双案同族并行互踩）：并行席 rebase/重置窗口恰好覆盖我方**未提交工作区态**时，修改直接消失——无 index 暂存、无 commit 对象，两道保护都没挂上（前两机理丢的是已暂存/已提交态，本机理丢的是裸工作区态，防护最薄一档）。实例：COS 2026-10-10 11:1x LG-071 首授工作区态被并行 rebase 窗重置吞→凭台账/大表现势**盘点重放**（重写授号内容），落笔 98548743（message 如实注明「首授被并行 rebase 窗重置吞 11:1x 重放」）。**处置=盘点重放**（从树面/台账面证据重建内容，不找补 dangling 对象——成本高不可靠）；**预防=写后即 commit 锁笔**——暴露窗（写毕→commit）压到最短，长文分段落盘中途即 commit；rebase 操作方窗前 porcelain 扫工作区非己方 M 行（与机理二预防合流）。三机理共同正形=**共享分支上任何时刻都让在途工作处于三态保护梯度中最厚一态：已 commit＞已暂存＞裸工作区**。

**识别信号**：porcelain 干净但文件内容与 HEAD 预期不符（机理一）；porcelain 无我方 M 行但修改已入库于他人笔 stat（机理二）；文件内容消失/整段回退旧版且 git 全无我方记录痕（无 stat 无 reflog 本笔=机理三，与机理一区分=机理一有 merge 倒退痕可考古）；三案共同点=「修改去哪了」先验文件现势再验 git 对象，矛盾证据先 `git show <笔>:<path>` 对表禁臆断。

相关：[[git-index-commit-convention]]（path-scoped 例外口径）、[[parallel-design-file-discipline]]、[[closeout-commit-hygiene]]。
