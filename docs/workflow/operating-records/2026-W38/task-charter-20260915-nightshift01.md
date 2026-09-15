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

### 收口-任务0（TriModel 型显隐修复）·BOD 补录（证据核录）·2026-09-15 21:57 +0800

- 修复 commit=TriModel `437674a`（09-14 23:57「规则表单型显隐根治」）；BOD 23:2x-23:3x 复走查截图两件在卷（bod-walkthrough-*.png，待归位 W38）。原执行席未留书面收口，本条为证据核录。

### 收口-任务1（TC-A..E 五步 + CP1）·BOD 补录（证据核录）·2026-09-15 21:57 +0800

- 五 commit 链（TriCompany）：TC-A `02cbdae` → TC-B `dd4016a` → TC-C `1bb70df` → TC-D `dd68d98` → TC-E `c51f3d4`（09-14 23:59-00:01）+ 补件 D1c `5973ae1`（00:10）。
- **CP1（CTO 抽盘）=过**（2026-09-15 21:33 正式结论：manifest 14 条 agent-body 切源 ✓/13 席段对齐 35 段逐数吻合 ✓/D1c 注记零渲染 delta ✓；顺序锁开）。

### 收口-任务2（BOD 席）·执行中·2026-09-15 21:57 +0800

- **TC-F**=`e5c1660`（TriCompany 21:33；target_root 单点+protected_prefix+注释+校验件路径；6 行/2 文件，全审无意外 hunk）。
- **TMV-1**=`19f607d5`（TMV 21:42；三 host 全量重渲：41 件=28 更+13 新建〔compass 会话面〕；对账 CP1 全量口径——A1 tools×14〔含 bs 先例〕/A3 指针×12/B1 增节×12/B2 删段×2 全中；A/C 型零 delta=预期〔CTO 口径修订在卷〕；B 型×5 席抽查吻合）。
- **TMV-2**=`219f4e75`（TMV 21:43；hub 13 件退役+**junction 建立**〔hub→compass，穿透读 13 件实证〕+gitignore 防双计）。
- **CHO 缺陷闭环**：重渲暴露 CHO `agent-body.agent.md` 无 fm 段→双面渲染失 name/description（宿主 agent 列表实读消失，缺陷级）；FSD `478f3ce` 补源（5 行、无 tools）→ BOD 定向重渲双面（Updated 1/1）+全 agent 面 name 缺失扫零（BOM 假阳性除外）→ 闭环。
- **三套件回归读数**：employee_source_kit **36/36 绿**；lg024 **6 案 1 红**（`test_6_signed_piece_diff`：公式仍读复合件源）；source_publish_check **180 案 7 红**（全在 claude-session 测试族，hub 期望值未随迁）——定性=**校验件随迁未完成**（非渲染缺陷；修法已裁交 FSD）。
- **CP2=条件过**（CTO 21:44：条件=追补批落地+三套件全绿+全量读数）。

### 追补批（rename 残活 + 校验件随迁）·挂本平面补录·2026-09-15 21:4x-21:5x

- 派工面：M-004 直达（m-fsd）+BOD 自办（④）；裁定链=CTO 两裁（21:44/21:46，会话面在卷）。
- ① prompts 双边修（两仓 ×2 件各 1 行；CTO 实证无发布链覆盖）·FSD 执行中
- ② AGENTS.md=真源改+发布（`TriCompany/docs/project-sources/trimetaverse-agents-md.md` → FADE-002 发布 TMV 拷贝；禁直改拷贝）·FSD 执行中
- ③ 两文档双边同改（`chief-of-staff-rd-orchestration.md`+`github-backport-manifest.md`；BOD 实测两仓逐字节同值、无同步清单覆盖）·FSD 执行中
- ④ 契约机械同步（CAO/CTO 两件 6 处旧名替换）——**已办** `7c24e6b`（CAO 确认无需会签）·BOD
- ⑤ 测试 fixture——**豁免**（CTO 实勘：探针数据+配对断言强度依赖旧名同值）·不动
- 8 红修法：publish 7 处期望随迁（**断言不弱化**硬要求：target-derivation 须保推导逻辑被验）+lg024 公式切 agent-body 源 ·FSD
- fm≡agent-frontmatter 断言入 `employee_source_kit_validation`（前置对齐：CEO/rd-trainer af 件→agent-body 同值；CHO 已齐）·FSD
- **待办**：FSD 批回执（三套件全绿全量读数）→ BOD 独立复跑 → CP2/CP3 正式过 → 推仓（TMV/TriCompany → sg bare）→ CTO「TMV-2+push 已落」信号 → sg S1-S4（命令单 23:53 CTO 令原样执行）。
