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

### E 段·server 子集收口汇总（2026-09-21 21:2x+0800 本机线对表定谳）

- **T1-T4 四节点全收口**（销账锚=树 reports/ 四份收口报告+commit 9e37ee2c，sg 值席执行）：
  - T1✓ mv /srv/fleet/TriLC→TriRLC 整体改名零改动，动前引用面终扫零命中，TriMC 禁动未触，三验过（8710 ok/tmux 14 同/配额位不动；8710 consecutiveFailures=2 列观察项不阻塞）
  - T2✓ origin 悬空勘正三通（remote -v 现役/fetch/pull/push；中间读数差如实录，end-state 同尖为验收据）
  - T3✓核显：sg 真源面自洽+manual 悬空排雷；**差口四项归 owner 在途**（tmux live 旧名候 BOD 重启窗/本机 seats.json 悬空候 local 线〔并 T5-T8〕/D-13+source-agents 零命中候 CAO/CTO 入册窗/.claude/agents 旧名候发布链——入册前不代传播防名址分裂族复发）
  - T4✓镜像在位；**本机对表定谳**：repo 迹镜像与本机台账真源已闭清单（LG-001..004/008/009/011..014/019..023/038）族属一致，LG-009 repo 迹零命中与本机已销账态相容；**瘦身 owner=本机线**（现役台账不动已闭条目正文，归档=清单索引层，候 T5-T8 同窗办）；**附发现：W39 目录 sg 侧已在**（T4 报告 LG-011 锚点引 2026-W39/daily-progress.md）——周平面迁移 sg 侧已落，本机未回流（归 T6 push/回流线首查）
- **local 子集 T5-T8**：本席排窗执行中（T6 push 首查 W39 回流+TMV/TC 未推侧）。
