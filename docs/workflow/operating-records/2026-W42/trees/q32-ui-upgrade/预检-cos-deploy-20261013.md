# Q3.2 部署段·COS 值席窗前预检卷（2026-10-13 22:00-22:30 窗）

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W42/trees/q32-ui-upgrade/预检-cos-deploy-20261013.md）
- syncMode: static（窗前对料·预检读数定格；窗内施工读数另见毕报）
- lastSyncedAt: 2026-10-13T20:50:25+08:00（date 现查·写后重跑对表勘正——初写估值 20:50:04 自抓·D-47 双保险）
- 窗令源: BOD 改裁窗令（20:47:23 落款·§181 漏达认账后改排）·值席=COS（m-cos 本地域）
- 部署对象: TriModel 仓 a17deaff（卡面端口文案 8712→8710·六行改动+断言同批）
- 施工面定谳: 跨机发布位追平=sg/R-HY 服务机侧 pull+build+重启服务（CTO 施工单 §二.5·README Deployment 节「部署面归 COS」LG-035 P3-sg 切片 2）

## 一、双机预检读数（2026-10-13 20:47-20:50 SSH 活体现探）

| 项 | sg（M-SG·47.245.122.61） | R-HY（8.155.54.79） |
|---|---|---|
| 工作区 | /srv/fleet/TriModel | /srv/fleet/TriModel |
| git 顶 | **a17deaff ✓（施工笔已到位·免 pull）** | e30ea20（旧·**窗内需 pull**） |
| dist/ui/index.html | Oct 6 18:16（旧产物·**需 build**） | Oct 8 09:45（旧·需 build） |
| 卡面服务 | trimodel-config.service（3333·active·WorkingDirectory=仓根·node dist/src/server.js） | trimodel.service（3333·active·同构 ExecStart） |
| 卡面路由 | /ui（200 ✓·serve dist/ui） | /ui（活体旧值实证） |
| 活体文案现值 | 根路径零命中（卡面在 /ui·窗内细验） | **M-SG 8712×2 + R-HY 8712×2（旧值四处在役实证）** |
| 旁注 | trimodel-proxy.service（3334）不涉卡面文案·不动 | unit 备份两份（0927/0929）在位 |

## 二、窗内施工序（22:00 窗起后）

1. **sg**：`npm run build`（a17deaff 已在顶）→ `systemctl restart trimodel-config` → 活体验证 `curl 127.0.0.1:3333/ui | grep 端口文案`=8710×4（M-SG/R-HY 各 nav meta+实例行）。
2. **R-HY**：`sudo -u fleet git pull`（**fleet 身份正形**·防 root 属主污染〔trimc root 属主雷族教训〕；dubious ownership 系 root 会话直跑所致，fleet 身份属主面自洽免豁免）→ `npm run build` → `systemctl restart trimodel` → 活体验证同上=8710×4。
3. 双机读数回执 BOD（路径+窗终态+验锚读数）+毕报落树（本目录）。

## 三、身份与安全注记

- sg 侧历史 dist 属主=root（现役形照旧·sg 机 root 操作惯例在案）；R-HY 侧 dist 属主=fleet——**分机照旧**，R-HY 施工必 fleet 身份（sudo -u fleet）。
- 不动项：rlc 卡 8711/mlc 卡 8713 文案正确原样；trimodel-proxy（sg 3334）零涉。
- 回滚锚：build 失败或活体验证不过→不 restart（旧 dist 保持在役）·报 BOD 改裁。

## 四、风险与边界

- R-HY pull 可能带进 e30ea20..a17deaff 间其他并行笔——pull 后 `git log --oneline -3` 断言顶=a17deaff 或其后代（若含他笔如实注记毕报）。
- 窗前现势有变（如 R1 窗提前/服务异常）→窗前知会 BOD 不硬起（令文条款）。

## 五、窗前复核段（2026-10-13 21:33 现势·复验毕）

- 双机复核全绿无变：sg 顶 a17deaff ✓+trimodel-config/proxy 双 active ✓+dist Oct 6 旧 ✓；R-HY 顶 e30ea20 ✓+trimodel active ✓——与 §一 预检读数逐项一致，**22:00 照常硬起**。
- **pull 前瞻（sg 仓预判）**：e30ea20..a17deaff 区间恰 2 笔——e5394a4（本机实例退役标记·纯 docs 无代码影响）+a17deaff（目标施工笔）——R-HY pull 后顶应**恰=a17deaff**，若有出入窗内即停报 BOD。
- 通道注记：sg SSH 正形=`ssh sg-ecs-server`（config 别名带 IdentityFile ecs-keypairs.pem）——裸 `ssh root@47.245.122.61` 不走该 key 会 publickey 拒（21:32 实测）；R-HY 裸 IP 形可用照旧。
