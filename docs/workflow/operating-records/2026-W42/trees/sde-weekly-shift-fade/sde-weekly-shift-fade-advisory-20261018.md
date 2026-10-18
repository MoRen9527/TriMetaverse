# SDE 席位建议卷 · 周工作平面迁移脚本 FADE 化改造（CEO 11:13 令·14:00 评审供卷）· 2026-10-18

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/sde-weekly-shift-fade/sde-weekly-shift-fade-advisory-20261018.md
- syncMode: static（席位建议卷·评审供料件）
- lastSyncedAt: 2026-10-18 03:22:30Z（+8=11:22:30 北京·date 现查原值·D-47 正形）
- 出卷席: SDE 小布（m-sde）·BOD 派工（CEO 11:13 令·优先急）·13:30 前交卷
- 施工域: 部署执行/发布流水线/环境管理（迁移作业=环境与流水线域·归本席；readiness 裁决归 CTO）

> **状态条（M-001）**：date 现查=2026-10-18 03:22:30Z（+8=11:22:30 北京）；水位自估=**中**（勘料毕·四问可答·施工面未开）；末次活动时刻=2026-10-18 03:22 本会话（transcript 现役）。

---

## §一 现役链全景（2026-10-18 活体勘·三段）

1. **触发段**：河源 TriRMC 8710 cron `weekly-plane-shift`（job 9c81c7ec-ed76-4489-98c0-81c6601f541b·`0 23 * * 0` Asia/Shanghai=周日 23:00 北京·enabled）——活体勘实证（/internal/v1/cron/jobs 探针·三 job 在册）。
2. **执行段**：TriCompany 仓 `runtime/cognition/weekly_plane_shift.py`（328 行·13,528B·末动 commit 6a8cd3d）——job command 帧记录（SOP·2026-09-27 勘帧）：`git pull --ff-only sg-bare dev` → `python3 -m runtime.cognition.weekly_plane_shift --from W39 --to W40 --start-date <硬编码> --sync` → `git add/commit/push sg-bare`（失败兜底=fetch+merge+push）。
   - 脚本五步：①create 新周（幂等）②migrate 旧周→新周（内含 retire）③carry-over（unresolved-items §1 平移：active/frozen 保留·周数+1·done 关闭·4w+/8w+ 警标）④validate 新周 ⑤聚合 ADE JSON 写 `<new_week>/.shift-ade.json`。
   - CLI 面全显式必传：`--from / --to / --start-date / --operating-root / [--sync]`——**job command 层硬编码参数**。
   - 脚本自带两个 FADE 化接口雏形：`shift_carry_over()` 有 `dry_run` 形参；产物已有结构化聚合（.shift-ade.json）。
3. **消费段**：本机 TriMLC 8713 cron `plane-shift-local-align`（job cron_muk382is_6tr3·周日 23:10）=fetch+merge **不推**·冲突即停 abort 通知值班席。

**勘料缺口（如实标注）**：job 现行 command 原文未实证——TriRMC API 列表层 command 字段为空+单 job 详情端点 404 not_found（2026-10-18 探针实录）。不影响主判断（改造本就要参数动态化）；候施工窗活体补勘（河源 TriRMC store/配置直读）。若现状=每周人工改 command 参数形态，则 FADE 化参数动态化恰为消除该人工段的正解，工期估不变。

**边界注记**：R-HY 迁移器不动（LG-056 边界）已被 CEO 11:13 令重开——「扩展成 FADE 协议标准实例」即迁移器改造授权，本卷按令勘估。

## §二 四问① FADE 对轨清单逐条裁（基准=FADE-008 v3 现役·2026-10-15 重估修订）

**对轨总表**（PACE 四段映射·锚=fade-008-governance-loop.md §1-§4）：

| PACE 段 | FADE-008 标准形 | 现役迁移链 | 对轨裁 |
| --- | --- | --- | --- |
| P 铸计划 | COS 备料·任务书原始态铸条（charter-id·三路来源·§1） | 无任务书形态·参数硬编码于 cron command 层 | ✗ 缺位 |
| A 挂平面 | 登记周平面登记面·挂即供料 SLA=当日（§2） | 无登记形态 | ✗ 缺位 |
| C 侦测派工 | 四面路由拾取·拾取三校验（§3） | cron 定时直触发·零拾取零校验 | ✗ 缺位 |
| E 执行回声 | 树协议七步+节点收口（brief+checkpoint+artifactCommit SHA+resumePoint）+回声双锚·销账唯 COS（§4） | 五步串行+.shift-ade.json 聚合（雏形）+commit/push·无树收口位·无销账链 | △ 半对轨 |

**逐条裁**：

1. **face 字段面路由（C 段）——✓适用·改造主面**。现役 cron 触发绕过面路由（无 charter-id 幂等查重/无执行域校验/无三校验回声）。裁：迁移作业按 §3 四面路由矩阵判=**`R-service`**（可自含打包+R 面作业·TriRMC 8710 全自动拾取分野）。改造形=cron 触发→拾取三校验→派树执行（或触发挂树→拾取器拾取，二形候施工窗勘 TriRMC 侧接线成本后定）。历史注记：`scripts/rmc_tick.py` face 门（r-face 严格制·08-26·commit 92078a0·勘料见 heyuan-branch-switch-impact.md L41）系旧称旧机制——FADE-008 v3 后标准称谓=四面矩阵路由值，对轨以 v3 为准。
2. **树协议——✓适用**。裁：迁移=单树形（charter-id:tree-id=1:1·n=1 合法§3·粒度四则过）·节点收口产物落执行域树 reports/（brief+checkpoint+artifactCommit git SHA+resumePoint）。脚本现产 `.shift-ade.json` 是现成对接锚——结构化聚合读数已在，补收口位迁移+回声双锚挂链即可，非从零造。
3. **hook 快通道+cron 慢通道——cron 慢通道正形保持**。迁移=定时批作业（周日 23:00 窗·无人值守）=慢通道适用形；hook 快通道不适用（无工具调用触发语义）；人工补触发（POST /internal/v1/cron/jobs/<id>/run·SOP §二.6 现役正形）保留=手动通道。裁：迁移场景慢通道单通道+手动补触发保留·无双通道冲突。
4. **攒批窗——不适用·已废**。FADE-008 §2（2026-10-15 重估改判原文）：攒批触发（≥5 件周二/周五+周三兜底）**废除**，无候排段无攒批窗，挂即供料 SLA=当日。裁：迁移改造不引入攒批窗语义（迁移本体=周日单点批·铸条挂平面即供料）；四问清单中「攒批窗」项按 v3 现役口径=废除面，对轨毕。

## §三 四问② 工作量级+下午窗可行性（真话·禁赶工乐观）

**分级估**：

| 级 | 内容 | 量级 | 下午窗 |
| --- | --- | --- | --- |
| a | 脚本面改造：①参数动态化 wrapper（新文件不覆写现役入口·ISO 周自动算 from/to/start-date·import 复用原函数非复制）②.shift-ade.json→节点收口 brief 形（+checkpoint+git SHA+resumePoint）落树 reports/ ③树骨架（tree-op.json 带 face=R-service+charter: 回指+briefs/） | 半日级 | **可成** |
| b | 管线面接线：①任务书原始态铸条+登记周平面（P/A 段——铸条=COS 备料面职责·本席不代铸）②TriRMC 侧拾取三校验接线（C 段·TriRMC 仓代码面）③台账销账链挂接（E 段·销账唯 COS） | 一日级以上 | **不可成** |
| c | 切换面：cron command 切换=TriRMC cron command 精确等值白名单纪律适用（改 job command=必追加白名单+重启 TriRMC·D-03 重启纪律照行） | 勘修窗级 | **禁下午顺手做** |

**真话结论**：下午窗交付=a 级施工+影子跑全链验证（§四）+b 级候选形草案备妥供下周窗；**b 级实装+c 级切换=顺延下周窗**。今晚 23:00 生产拍**照走旧脚本**（cron command 零改动=零白名单动面+零重启）。

**与 CEO 意向衔接**（「评审完可下午开工，争取赶在晚 23 点迁移前实战验证一次」）：下午实战验证的是**新形态影子跑**（非生产切窗）——23 点前的验证目标以此达成；生产拍仍旧链，物理隔离由 cron command 零改动保证。

**同步链已勘通**：本机 TriCompany 仓（D:/Code/ai/TriCompany·branch=dev·origin 双 pushurl=github+ssh://fleet@47.245.122.61/srv/git/TriCompany.git）→push→河源 TriCompany 仓 pull（branch=dev·HEAD e5f37f7·工作区净·2026-10-18 ssh 实勘）——影子跑环境就绪路径成立。

## §四 四问③ 实战验证形态建议（影子/预演跑·禁生产拍当首验）

**形态**：河源影子跑（同执行环境）——对独立影子 operating-root 跑全链，零触碰现役周平面。脚本自带干跑面（dry_run 形参+--operating-root 可指独立根·§一勘料实证）。

- 影子根：河源独立临时目录（/srv/fleet/ 顶层 shadow-plane 目录已存在·用其子目录或另立，候施工窗定）。
- 迁移对象：W42→W43（现役周参数·真实数据副本）。
- 触发形：手工 CLI 直跑（非 cron·不触白名单不动 job）。

**断言清单（全绿=验证过·一票否决项见⑤⑥）**：

1. 影子根建 2026-W43 树 ✓形
2. unresolved-items 继承件在（周数+1·active/frozen 保留·done 关闭·4w+/8w+ 警标）✓值面
3. validate 绿 ✓
4. .shift-ade.json 聚合读数全（含 a 级新收口字段）✓
5. **现役面零触碰断言**：本仓 docs/workflow/operating-records/ 现役目录 git status 净+河源对应目录 mtime 不变（一票否决）
6. **git 链行为断言**：影子跑 commit 落影子分支或本地不推——**禁推 sg-bare dev 主干**（一票否决）；merge 兜底行为实录观察（SOP 命令的 fetch+merge 自动兜底 vs 本机消费端「冲突即停」两处语义不一致——实录读数候裁·不阻塞影子跑）

**时窗**：评审毕（~14:30）开工→毕锚 18:00（真话预估：含河源 pull 同步+wrapper 施工+影子跑+断言+毕报三送）。

## §五 四问④ 风险与回滚+门禁条款候选

**门禁条款候选（BOD 候选照纳+细化三条）**：

1. 影子跑断言清单**全绿**→入下周窗切窗议程（切窗=c 级·勘修窗+CTO 门禁）；任一红=今晚走旧脚本+FADE 化顺延下周·**禁硬赶**。
2. 今晚 23:00 生产拍**无条件走旧链**（cron command 零改动·与影子验证零耦合）。
3. 切窗时序纪律（下周窗候选形）：新形态连绿≥2 影子周→切 cron command（白名单追加+重启·勘修窗）→切后首周双锚观察（旧链产物+新链产物对表）→第三周撤旧——候 CTO 门禁裁决。

**回滚锚**：

- **零操作回滚（主锚）**：a 级改造=新增 wrapper+新文件·不覆写现役 CLI 入口·cron job 白名单零动面——「不切窗即回滚」，现役链全程原样。
- 脚本级：TriCompany 仓施工前记 HEAD SHA（e5f37f7 基线·实际以施工时现查为准）·异常 git checkout 秒回。
- cron 级：job 9c81c7ec enabled 现役不动；未来切窗后异常=白名单回退+重启（勘修窗序·D-03 照行）。

**风险清单**：

1. **周界时点（高危·一票否决项）**：ISO 周在周日 23:00 触发时点的翻转边界——动态化实现须显式口径（建议=触发时刻算次周·ISO 周周一开周）+影子跑断言②读数核。漏裁=W 号错迁。候裁点④。
2. **git push 竞争**：并席推平竞争本周先例三遇——脚本 fetch+merge 自动兜底与消费端「冲突即停」语义不一致（实录候裁·不阻塞今天）。
3. **白名单纪律**：切窗=必追加+重启（高摩擦·勘修窗级）——本日下午零触碰。
4. **job command 现形未实证**（§一勘料缺口）——不影响工期估（参数动态化本在 a 级）。
5. 双轨触发竞争——切窗 runbook 写明旧 job disable 时序（下周窗件·今天不涉）。

## §六 候裁点（14:00 评审裁决面）

1. a/b/c 分级与下午窗范围认可（今天=a 级+影子跑；b/c 级顺延下周窗）。
2. 影子跑形态与断言清单认可（§四·两一票否决项确认）。
3. 门禁条款三条认可（§五·尤其今晚生产拍无条件走旧链）。
4. 周界时点口径=触发时刻算次周（ISO 周周一开周）。
5. merge 兜底语义两端口径统一（自动 merge vs 冲突即停）——候裁·不阻塞今天。

## 使用依据

- FADE-008 v3：docs/execution/fade-008-governance-loop.md §1-§4（2026-10-15 重估修订·实读 L1-60）
- SOP：docs/workflow/weekly-plane-shift-local-align-sop.md（迁移链全景+job 命令原文 2026-09-27 勘帧）
- 脚本活体勘：/srv/fleet/TriCompany/runtime/cognition/weekly_plane_shift.py（328 行·13,528B·末动 6a8cd3d·ssh 实勘 2026-10-18）；本机同构 D:/Code/ai/TriCompany/runtime/cognition/（ls 实证）
- 河源 8710 活体：TriRMC cron jobs 三件（weekly-plane-shift 9c81c7ec enabled·探针实勘 2026-10-18；单 job 详情端点 404·勘料缺口如实标注）
- 河源 TriCompany 仓拓扑：双 remote·branch=dev·HEAD e5f37f7·工作区净（ssh 实勘 2026-10-18）
- 历史注记：rmc_tick face 门（docs/execution/heyuan-branch-switch-impact.md L41·92078a0 08-26）——旧称注记·对轨以 FADE-008 v3 为准

---

落款=SDE 小布 2026-10-18 03:22:30Z（+8=11:22:30 北京·date 现查原值·发毕对表）
