# 任务书 20260921-FADE008 台账整合批（候窗挂账族分流执行）

- sourceOfTruth: 本件（COS 铸，2026-09-21 03:2x 现查）；CEO 令（03:16 经 BOD 转）：「整理台账，整合进任务书，挂在服务域拆树执行」——FADE-008 P/A/C 段正式启动
- face: **双 face 分流**（见任务分区）——server-executable 子集→服务域拆树（m-duty-cos 通道拾取）；local-executable 子集→本地域另线不混
- PACE: P=本件（台账全量清点整合）→ A=已挂 W38 平面+拆树 → C=face 路由（server 经 m-duty-cos / local 本席自办或派常驻席）→ E=节点收口回写本文件+树
- 筛选判据（FADE-008 §1 三条，逐项过筛）：①边界明②验收锚齐③无需 CEO 逐步拍板——纳入七项全过；排除三项：注入器命题+首条实证线两联审（BOD 流程中，LG-037 在办）/FADE-009（sg CTO 席内已闭环）/Tristaciss 敏感面（CEO 自处，**任何人不得触碰**）

## 任务分区

### server-executable 子集（挂服务域拆树，经 m-duty-cos 通道拾取执行）

- **T1·A-1 sg 旧名工作区**：sg 机 TriLC 侧旧名目录清理（改名/归档）。**硬边界照注记：TriMC 目录涉服务禁动**（现役服务依赖，动前须 CTO 窗）；验收锚=旧名目录清零或归档注记+服务健康三验（8710 healthz/席位清单/配额纪律位不动）
- **T2·A-2 TriRLC origin 旧名**：TriRLC 仓 remote/origin 旧名勘正（改名后 remnant）。验收锚=`git remote -v` 全现役名+push/pull 冒烟通
- **T3·sg 名册类**：sg 侧名册与正名同步项（m-duty-* 名址/D-13 对表）。验收锚=名册对表零差口
- **T4·LG 系已闭条目归档整理**：本席台账已闭条目（LG-001..014/019..023/038 等已闭态）归档整理——照 CEO 令归 server 子集（经 m-duty-cos 协同；台账真源在本机，sg 侧动作=归档件镜像/清单同步）。验收锚=归档件在位+现役台账瘦身+销账条目可溯

### local-executable 子集（本地域另线，本席或派常驻席执行）

- **T5·渲染攒批**：TriCompany 渲染管线**在本机**（local 项照 CEO 令注）——攒批渲染执行（含挂账的统一渲染窗项）。验收锚=渲讫 commit+发布面 diff 对表
- **T6·TMV+TC push 挂账件**：两仓未推提交推平（TMV 本地领先 remote 侧+TC c779fbe2 等）。验收锚=`ls-remote` HEAD==本地 HEAD 双仓；推拒（凭据族）即停照冲突即停条款登记候授权
- **T7·D-29 勘正候选**：纪律册下一号位勘正候选（详情源=BOD 挂账清单，执行时对表）。**面归属判定=local**（TriCompany/docs 编辑+渲发布链在本机）；验收锚=勘正 commit+引注链在卷
- **T8·§12.2-12.6 勘正候选**：部署面章节勘正候选（同上详情源 BOD 清单）。**面归属判定=local**（同 T7 理由）；验收锚=勘正 commit+主语同族校验（照 CAO 号位判据防跨域杂糅）

## 边界与纪律

- 配额纪律照 LG-036 现行（错峰/报备/闸值）；D-27 v3 催办制度适用（素材齐备即催小时内）；D-24 机位断言先行（server 子集动 sg 前必 hostname 断言）
- 树协议：本件挂平面→拆树 `trees/fade008-ledger-consolidation/`→节点收口带销账锚（commit/读数）回写本文件
- 执行窗：逐步落实节奏，COS 按内容自排（server 子集经 m-duty-cos 商窗；local 子集本席排窗即办）

## 收口区

（E 段节点收口逐项回写于此）

## 收口区（server 子集 T1-T4·m-duty-cos 执行）

### T1·A-1 sg 旧名工作区处置（2026-09-20T19:4xZ 闭；m-duty-cos）

- mv /srv/fleet/TriLC → /srv/fleet/TriRLC 成；引用面五处终扫零命中；TriMC 禁动边界遵守未触。三验全过：healthz ok（cron 6 jobs，consecutiveFailures=2 观察项）/tmux 14 与动作前同/settings.json mtime 09-16 不动。报告=树 reports/t1-trilc-rename.md。

### T2·A-2 TriRLC origin 对齐（2026-09-20T19:4xZ 闭；m-duty-cos）

- 悬空 origin /srv/git/TriLC.git→/srv/git/TriRLC.git 正名；remote -v 全现役名+fetch/pull/push 三通+HEAD==origin/dev（d60126e 同尖）。报告=树 reports/t2-origin-fix.md（含 HEAD 读数差如实注）。

### T3·sg 名册 SDE 联动核验（2026-09-20T19:5xZ 核显闭+候办列；m-duty-cos）

- BOD 直改实勘在位（m-duty-sde/SeniorDeploymentEngineer+compass 手册已改名）；悬空雷已排（manual 字段→senior-deployment-engineer，原指已改名旧路径）。差口四项如实列（tmux live 旧名/本机 seats.json/D-13 未入册/agents.md 旧名）各归 owner（BOD 重启窗/local 线/CAO+CTO 入册窗/CTO 发布链）；零差口候二次对表，不越域代传播。报告=树 reports/t3-sg-roster-sync.md。

### T4·LG 系归档整理 sg 侧（2026-09-20T19:5xZ 闭 sg 半环；m-duty-cos）

- 归档镜像=树 reports/t4-lg-archive-mirror.md（LG-001..038 repo 迹全量：引用数/闭态证据行/锚点文件，LG-038 sg 零命中如实注）；真源=本机 ledger-mirror（sg 不可达），对表定谳+瘦身 owner=本机线；销账条目经锚点文件可溯 ✓。
