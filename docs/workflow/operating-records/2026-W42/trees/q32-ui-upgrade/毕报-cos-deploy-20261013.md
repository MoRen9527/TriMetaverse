# Q3.2 部署段毕报（COS 值席·2026-10-13 22:00-22:30 窗）

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W42/trees/q32-ui-upgrade/毕报-cos-deploy-20261013.md）
- syncMode: static（窗毕定格）
- lastSyncedAt: 2026-10-13T22:02:00+08:00（date 现查·写前跑）
- 窗令源: BOD 改裁窗令（20:47:23）·值席=COS（m-cos 本地域）·部署对象=TriModel a17deaff
- **窗终态: 毕（22:01:06 双机验锚全绿·早于窗界 29 分钟）**

## 一、双机验锚读数

| 项 | sg（M-SG·trimodel-config.service） | R-HY（trimodel.service） |
|---|---|---|
| 施工顶 | a17deaff ✓（免 pull） | a17deaff ✓（fetch+checkout） |
| dist/ui/index.html | Oct 13 21:59 新产物 | Oct 13 22:00 新产物 |
| 产物值面 | 8710×4 / 8712×0 | 8710×4 / 8712×0 |
| restart 后 unit | active ✓ | active ✓ |
| **活体 /ui 值面** | **8710×4 / 8712×0** | **8710×4 / 8712×0** |

## 二、过程注记

1. **R-HY 仓形态勘正**：预检卷 §二 写的施工序为 `git pull`——实况 R-HY TriModel 仓=**detached HEAD（no branch）部署形态**，裸 pull 报用法错误；改 **fetch+checkout a17deaff** 正形（按 hash 部署惯例·与 sg 形态一致），预检断言「顶=a17deaff 或后代」以「恰=a17deaff」兑现。
2. **前瞻兑现**：e30ea20..a17deaff 区间恰 2 笔（e5394a4 本机退役 docs+a17deaff 施工笔）——预检卷 §五 前瞻注与实况一致。
3. **回滚锚未触发**：双机 build 一次过，无 build 失败/活体验证不过情形。
4. sg build 输出尾被 npm notice 占据——按「校验失败≠流程停止」教训改直验产物值面（mtime+grep 计数）后确认成功。
5. 身份面：R-HY 全程 fleet 身份（sudo -u fleet）·dist 属主保持 fleet；sg root 形照旧。

## 三、验收与后续

- 双机卡面（3333/ui）现役文案=8710（TriMMC M-SG/TriRMC R-HY 双卡 nav meta+实例行四处）——a17deaff 施工意图全量兑现。
- 不动项确认：trimodel-proxy（sg 3334）未动·rlc/mlc 卡 8711/8713 文案原样。
- 本毕报+预检卷（a37622a71+56b71fc63 增补）同树归档，候 BOD 收账。
