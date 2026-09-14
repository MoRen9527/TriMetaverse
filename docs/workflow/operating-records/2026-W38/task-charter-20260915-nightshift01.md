# 任务书 20260915-夜航01（LG-035 收敛窗：去重+瘦身+compass 改名）

- sourceOfTruth: 本件（BOD 铸）；执行序正身=`lg-035-contract-slim-ruling.md` §五；compass 侧=`docs/execution/compass-rename-plan.md`
- face: local-executable → **M 面本地席**：任务1=FSD 席、任务2=BOD 席（M-004 直达派工+本平面留痕）
- PACE: P=本任务书 → A=已挂 W38 平面 → C=M-004 直达（FSD）+BOD 自执行 → E=节点收口回写本文件
- 边界: ①不动 TriModel 仓运行面（UI 线型显隐修复并行在跑，与本窗零交集）；②TriCompany 源侧步骤（TC-A..E）先行、TMV 重渲/迁移（TC-F..TMV-2）后行——**顺序锁：CP1 过才开任务2**；③任一步异常停手报告（停止线+回滚锚照两正身件）；④sg 侧操作待 CTO「TMV-2+push 已落」信号，全程 m-duty-cos 留痕（send-keys Enter 独立补发+capture 验空框）

## 任务0（FSD·先行收口）: TriModel 型显隐修复
- 内容: BOD 23:5x 修复令（规则表单分型显隐+jsdom 每型断言他型字段必藏）
- 验收锚: 修复 commit+一行回执（现查时点）；BOD 复走插空进行，不阻塞任务1

## 任务1（FSD）: 十步序 1-5（TC-A..TC-E）
- 内容: ruling §五 步 1-5——agent-body 收敛/frontmatter 填实/前置核查迁移/M-001 删/manifest 切源+lg024 校验件改指；引擎=`lg-035-contract-transform.py` 分步 `--execute`（每步前 dry-run 复跑确认），每步独立 commit
- 验收锚: CP1=CTO 抽盘面（manifest 13 条+段对齐）；五 commit 链；纯 TriCompany 源侧零渲染

## 任务2（BOD）: 十步序 6-10+sg 四步
- 内容: TC-F（target_root 单行+注释+校验件）→TMV-1（三 host 全量重渲+**diff=0 渲染不变量断言**）→TMV-2（git mv+junction+.gitignore）→三套件回归+SEC 读数→回执；CTO 信号后 sg S1-S4（命令单 23:53 CTO 令原样执行）
- 验收锚: CP2=diff=0 读数（delta 三类外零差异）；CP3=回归三套件读数；sg 四步 capture 证据；回执含全量 commit 链

## 收口区
（执行席逐任务追加：## 收口-任务N + 时间（现查）+ 读数 + 证据指针）
