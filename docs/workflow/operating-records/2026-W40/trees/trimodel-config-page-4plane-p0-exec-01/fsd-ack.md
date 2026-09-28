# FSD 接令回执+排程 — TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P0-EXEC-01

- sourceOfTruth: 本件=FSD 席接令收口件（LG-057 节点收口试点·接令节点）
- syncMode: static
- lastSyncedAt: 2026-09-28T02:46:51Z（date 现查）
- 施工席: FSD 小全（m-fsd）

## 接令确认

COO 拆派令收讫（2026-09-28T10:33:59+0800，msg 8a923034…）：本席=TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P0-EXEC-01 **实现主体**，LG-058 P0（CEO 10:22 终审通过）。

## 锚勘读数（接令即勘，三真源全读）

1. **执行单** d9df61bc：已读全文（wt/board 分支件，dev 工作树经 `git show d9df61bc:<path>` 读取）——§一 六项范围/§二 A1-A6 锚/§三 边界/§四 纪律。
2. **方案 v3** afb0180c：已全读（§一 现状勘定→§二 face registry+泛化端点+双视图+双层鉴权→§三 域锚三不变量+拉取序→§四 三层降级梯+MMC/RMC 归并裁决→§五 CLI 底表+能力矩阵→§六 P1 迁移预研）。照单实施勿重设计。
3. 判定件 v3 @ 9bd40491 背景已入库（角色归属面≠部署位纪律）。

## 范围与边界确认

- **六项**：①卡面引擎参数化泛化（face registry+`/v1/config/cards/{face}`+trimmc-card* 别名保留）②本机两卡接入（TriMLC/TriRLC config-cache 泛化+face pull 台账）③写前备份轮换（唯一性后缀纪律）④face-events 审计账（单一 jsonl 四族事件 len-only）⑤CLI config 族（pull/show/verify/cache show|clear；CLI 不开写面）⑥测试族。
- **边界照单**：R-HY 禁碰（P1）；泛化层纯新增+别名保留=revert 单 commit 语义；UI 不做（P2）；**开发期对活体 card/settings 禁写**（测试走沙箱/临时卡）；接入部署步候 CTO 门审签发后按 daemon 重启纪律执行（本席 P0 窗=代码+自测，不动活体 daemon）。

## 排程自估（正常工时，节点分解）

| 节点 | 内容 | 仓 | 估时 |
|---|---|---|---|
| N1 | face registry+泛化端点+双视图+别名保留 | TriModel | 0.5 天 |
| N2 | 写前备份轮换+face-events 审计账 | TriModel | 0.25 天 |
| N3 | config-cache 泛化+本机两卡接入+pull 台账 | TriCode+TriRLC+TriMLC | 1 天 |
| N4 | CLI config 族四命令 | TriRLC(先例)+TriMLC | 0.5 天 |
| N5 | 测试族+四仓全量回归+读数回报 | 全 | 0.5 天 |

- **预计完工窗：2026-09-30（周三）内**；若 N3 跨仓联调遇阻顺延至 10-01（周四）上午，随节点回执实时修正。
- 施工中按节点回执（jsonl 追补+节点收口件）；方案缺陷/疑义即停手升级 COO。

## 使用依据

- 执行单 d9df61bc / 方案 v3 afb0180c / 判定件 9bd40491 / COO 拆派令 2026-09-28T10:33:59+0800 / LG-057 节点收口试点口径
