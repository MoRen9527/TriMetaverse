# b 级候选形草案 · 周平面迁移 FADE 化管线接线（供下周窗·2026-10-18）

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/sde-weekly-shift-fade/docs/b-level-candidate-draft-20261018.md
- syncMode: static（候选形草案·评审供料）
- lastSyncedAt: 2026-10-18 03:38:21Z（+8=11:38:21 北京·date 现查原值）
- 出件席: SDE 小布（m-sde）·a 级施工随件（CEO 11:32:57 预裁授权范围=b 级候选形草案备妥）

## 1. P 段候选形（任务书原始态铸条——COS 备料面职责·本席不代铸）

- **形态裁决候选**：迁移=年度周期性任务→候选「**周期 charter**」形（一次铸条·字段含 recurrence=weekly@sunday-23:00·周复用）vs「周 charter」形（每周铸条·52 条/年·重）。本席倾向=周期 charter（挂即供料新形下无候排段·周期件铸一次即可）——**形态裁决归 COS 备料面**，本席候选供裁。
- charter-id 候选：`charter-weekly-plane-shift`（周期件幂等 id·不同于一次性 charter-id 命名——登记面 schema 候 COS 定）。
- 资格门三判据自检（FADE-008 §1）：边界明 ✓（改造范围=本卷 §三分级）/验收锚齐 ✓（影子断言六条+门禁三条）/无需 CEO 逐步拍板 ✓（CEO 只裁了首尾=护栏三条+开工）。

## 2. A 段候选形（登记周平面登记面）

- 周期 charter 铸条后登记 W 周平面登记面（M-001 状态条挂行）——挂即供料 SLA=当日（FADE-008 §2 新形）。
- 跨面注记：登记面在 M 面（本机周平面）·执行域=R-service（河源）——跨面件供料单五素信封（FADE-008 §2）候选实填：①charter-id+登记锚 ②执行域=R-service ③门禁=影子断言六条+切窗 CTO 门 ④止损/回滚=零操作回滚（不切窗即回）+白名单回退 ⑤毕报链回址=COS（R 面毕报经 BOD COS 流转回 M 面·org-flow 现役）。

## 3. C 段候选形（TriRMC 侧拾取接线——两形候裁）

| 候选 | 形 | 改动面 | 评估 |
| --- | --- | --- | --- |
| C-轻 | cron 触发→**触发内联拾取三校验**→直派执行（跑 wrapper sync 形） | TriRMC cron executor 加三校验前置（charter 在册+幂等+域值合法）·校验过即执行 | 小改·保留 cron 触发直跑惯性·FADE 语义=执行前校验非拾取派树——半 FADE 形 |
| C-全 | cron 触发→**挂 r 树**（tree-op 生成）→r 侧拾取器按 face 路由拾取→拆树执行→E 段收口 | TriRMC 拾取器（新件）+树协议七步链+拆树权界面 | 全 FADE 形·与 M 面管线同构·改面大 |

- 本席倾向：**先 C-轻后 C-全**（C-轻下周窗可落·C-全候 TriRMC 拾取器排窗）——候 CTO 裁（拾取分野封装在部署脚本层=CTO 三层合同域）。
- TriRMC 仓代码面协作：拾取三校验接线=FSD 协作面（本席出验收锚+部署链）。

## 4. E 段候选形（收口+销账）

- 收口 brief=a 级 wrapper 已产（brief+checkpoint+resumePoint·影子根 reports/）——生产形落位=真周平面树 reports/（to 周 reports/）。
- **artifactCommit 回填链候选**：job command 层 git commit 后捕获 SHA→追加写回 brief（一行 sed 或 wrapper 出 git 链子命令）——候 b 级施工定（现 a 级标注 N/A）。
- 销账链：迁移毕报→COS 销账（唯一销账权）附执行域树指针（回声双锚·FADE-008 §4）。周期件销账形态=周销账（每周一销）vs 周期总账——候 COS 裁。

## 5. 切窗 runbook 候形（c 级·勘修窗级）

前置门：影子跑断言六条连绿 ≥2 影子周（下周+再下周）。

1. 勘修窗开（D-23 对轨+CEO 排窗确认——D-39 增补段排窗面 CEO 确认制）
2. TriRMC cron job 9c81c7ec command 改造：`weekly_plane_shift` 硬编码参数串→`weekly_plane_shift_fade --operating-root … --sync`（动态参数）——**白名单精确等值追加+TriRMC 重启**（D-03 重启纪律照行：/shutdown→port FREE→冷启→pid 对表→watchdog Enable）
3. 切后首周（周日 23:00）双锚观察：旧链产物位+新链产物位对表（.shift-ade.json+brief+commit SHA 三对）——值班席值守
4. 第二周复验连绿→第三周撤旧（旧参数串退役·白名单条目清理+转发壳退役时点标注——TriRLC cron command 白名单纪律）
5. 异常任一步=白名单回退+重启（回滚锚）·禁硬赶

## 6. 岗位分工（候选）

| 面 | 席 |
| --- | --- |
| 周期 charter 铸条+登记+销账 | COS（备料面/销账唯一权） |
| C 段 TriRMC 接线编码 | FSD（CTO 约束内）+SDE（验收锚+部署链） |
| wrapper/brief/影子验证 | SDE（a 级已毕·候 14:00 候裁点④口径裁） |
| 拾取形态（C-轻/C-全）+切窗门 | CTO |
| 排窗 | CEO 确认（D-39 增补段）·COO 节律 |
| 周界口径（候裁点④） | 14:00 评审裁 |

## 使用依据

- FADE-008 v3（§1-§4·docs/execution/fade-008-governance-loop.md 实读）
- 建议卷 8ac615631（§三 b 级范围+§五门禁三条+§六候裁五点）
- CEO 11:32:57 预裁（BOD 传达·护栏三条+开工授权·裁前禁动切窗面）

落款=SDE 小布 2026-10-18 03:38:21Z（+8=11:38:21 北京·date 现查原值·初稿落款预填自纠勘正记：初写未绑定现查·自查抓获即改——D-47 正形重申=shell 注入或写前现查）
