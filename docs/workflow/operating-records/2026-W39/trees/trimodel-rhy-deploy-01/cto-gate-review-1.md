# CTO 技术门审·第一单（LG-054 前置勘验读数 af13ed82）

- sourceOfTruth: 本件（LG-054 技术门门审正身第一单；D-15 枢纽门审留痕）
- syncMode: final
- lastSyncedAt: 2026-09-26 16:2x +0800（date 现查 16:20 hook 链）
- 门审对象: predeploy-survey-readings.md @ af13ed82（SDE 前置勘验，执行序①②）

## 门审三面裁定

### ① R-HY 整位重建路径：**裁可**

旧散拷贝（8-27，无 .git 元数据、dist 两代前、无 tricode file: 依赖）勘实不可用作基座，整位重建正确。**附加条款一条**：重建前旧位整体留 bak 锚（mv 旧位→bak 时间戳目录，不动删除），回滚路径与新建位并存——部署段回滚姿态纪律（与电池门窗 XML 锚同族）。

### ② bundle 源裁定：**采认**

git bundle scp 直投（本机 dev HEAD 1972d83+d20cb6b 逐字节真源，TriModel ahead83/TriCode ahead13 全含，零 GitHub 公共仓动作）——裁量正当：推 83 笔系对外可见动作非本单必要范围，bundle 直投边界最小。**执行注记两点**：a) R-HY clone 自 bundle 后 origin 悬空指向 bundle 路径——落地时显式重指 GitHub remote（`remote set-url`），并在 README/unit 无 fetch 悬空依赖；b) M2 增量更新前先推平 GitHub 再拉（SDE 已注，维持）。

### ③ 技术债⑩缺位处置：**裁定=本波部署闭环销债**

TriCode 全盘零在位勘实=技术债⑩真实缺口。处置=随部署序 TriCode 先位先 build（bundle 含 13 笔）→TriModel npm install 解析 file:——**部署毕 A2 验收读数须含「TriCode 同机在位断言」复验一项**（技术债⑩销债读数，销债即闭账）。

## 候决三项批复

| 项 | 批复 |
| --- | --- |
| sg→R-HY 勘验时点 | **采两段**：现在段=TCP 基线（sg→R-HY 网络层可达性，证通道）；部署毕段=正式三态（TCP/TLS/带 token 200，A2 验收锚）。sg 侧走 BOD 通道（D-24），时点随部署窗报 BOD 定 |
| 安全组 443 开位 | 非本席裁域——如实转呈 BOD/CEO 面指通道（代开或授权凭据）；3333 直口不开公网=现状满足，部署后保持断言（A4 终态） |
| Caddy 安装 | 随部署序呈备，准 |

## 门审总判

前置勘验读数**合格**（边界守约：生产冻结面零触碰/sg 侧未涉全程只读三批次），三项候决批复如上——SDE 可持本门审入部署落地段（安全组 443 通道项除外，该项候 BOD/CEO）。部署落地段开工前本席无再门审项；A2/A4 验收读数随到随审。

## 使用依据

predeploy-survey-readings.md（af13ed82）；task-charter-trimodel-rhy-deploy-01.md（f1f89ee3）；joint-plan.md 问5/6/7；redline 窗条款回滚锚惯例；技术债⑩（CORE-SPLIT 结论单在册）。
