# CTO 裁定卷·G10 部署步观察项三件+陈旧 pidfile（本席独立实勘）

- sourceOfTruth: 本件（G10 观察项 CTO 裁面正身；读数卷=g10-deploy-readout-20260929.md bc388290）
- syncMode: final
- lastSyncedAt: 2026-09-29 00:37:45 +0800（date 现查原样粘贴）
- 实勘面: 两仓源码直读（TriMLC/TriRLC src）+双 launcher+双 watchdog ps1+schtasks 任务 XML+channel.log/daemon.log 活体+TriModel face-events.jsonl server 台账+3333 端点双态探针（无 token/带 token）

## 一、裁定总表

| # | 观察项 | 裁定 | 派工 | 紧迫度 |
|---|---|---|---|---|
| ① | TriMLC registerPid 缺 port 参 | **裁修**（一行级×2 处） | FD | 常规窗，与②并批 |
| ② | trirlc-watchdog 复活令无 env 保真 | **裁修**（复活段对齐 TriMLC 正形） | SDE | 常规窗（真掉线前修毕即可） |
| ③ | boot 期 card pull 401→周期转绿 | **定谳=读数错配，销项**（401 归并②同根） | 无动作 | — |
| ④ | trimlc-channel\trilc.pid 陈旧件 | **清档可办**（不在读链，低风险） | SDE 顺手项 | 随①部署窗 |

## 二、① registerPid 缺 port 参——裁修（FD）

**实锚**：
- TriMLC `src/index.ts` L145 `await registerPid()` + L161 `await unregisterPid()`——两处均无 port 参。
- TriRLC `src/index.ts` L141 `await registerPid(app.port)` + shutdown 段 `unregisterPid(app.port)`——对齐正形。
- `src/pidfile.ts` L51-53：`writePid(pid, port?)` 带 port=写 `trilc-<port>.pid`；不带=写 legacy `trilc.pid`（PID_DIR=`~/.trimetaverse` 全局共享位）。
- 危害已实战：G10 窗 8713 写 legacy（pid 10348）→8711 stop 首发一致性门拒停（pidfile pid 10348 ≠ port 8711 属主 35812）——09-18 互踩门防线正确兑现，但**互踩源=TriMLC 写路径未 port-split**。

**裁定**：FD 派工两处补参（L145/L161 各加 `app.port`），与 TriRLC 完全对齐。
**测试门**：tsc 零错+下次 8713 重启后 `trilc-8713.pid` 对表断言（现 pidfile=absent 态随重启自愈）；8711 stop 一致性门不再因 8713 侧 legacy 件拒停。
**风险**：改动一行级；读链已有兼容（`readPid(port)` 缺文件回退 legacy，pidfile.ts L29-32），无破坏面。

## 三、② trirlc-watchdog 复活令无 env 保真——裁修（SDE）

**实锚**：
- `trirlc-watchdog.ps1` revive 段=`Start-Process node.exe D:\Code\ai\TriRLC\dist\index.js`——**裸拉无 env**（TRIMC_BASE_URL/TRIMC_INTERNAL_TOKEN/TRIMODEL_API_TOKEN/TRILC_ENV_FILE 全缺→connMgr 落 localhost:8710 死地址+拉取无 token）。
- 对照正形：`trimlc-watchdog.ps1`=`Start-Process cmd.exe '/c' "$env:LOCALAPPDATA\trimlc-daemon-channel.cmd"`——**权威 launcher 保真**（同族已修先例）。
- G10 窗已实证同形态后果：8711 裸拉 280s 不收敛（§五.2）+server 台账 401 denied 一笔（见③）。

**裁定**：SDE 派工——trirlc-watchdog.ps1 revive 段改：
```powershell
Start-Process -FilePath "$env:SystemRoot\System32\cmd.exe" -ArgumentList '/c', "`"$env:LOCALAPPDATA\trirlc\daemon\trirlc-daemon.cmd`"" -WindowStyle Hidden
```
**注意路径=`trirlc\daemon\` 子目录**（权威 launcher 实位，§五.3），非 LOCALAPPDATA 根；顶部注释「revive via node dist/index.js」同步改。
**边界**：TriRLC 仓内 `src/daemon/watchdog.ts` 的 fork 形态=进程内 supervisor 机制，与本 schtasks→vbs→ps1 链无关，**不动**。
**验收**：下次真掉线复活后 healthz mc_link=connected+无新增 pull_denied 台账笔；人工演练（停 daemon→候 probe→验复活态）候窗可做非必做。
**风险**：复活路径单行改动；`.cmd` start 形（cli start spawn detached）与原裸拉形对 schtasks 均无窗口残留，语义等价升级。

## 四、③ boot 期 401——定谳=读数错配，销项

**server 台账铁证**（`TriModel/face-events.jsonl`，UTC）：
| 时刻(Z) | face | 事件 | 判读 |
|---|---|---|---|
| 16:01:21 | **mlc** | pull **ok** card absent | **8713 boot 首拉=ok，无 401** |
| 16:02:23 | **rlc** | pull **denied** pull_denied | 8711 裸拉保真缺口窗（§五.2 同窗，无 token→401） |
| 16:09:36 | rlc | pull ok | 8711 权威 launcher 重拉起（00:09:33）后首拉 |
| 16:10:17 | rlc | pull ok | SDE 验收读数 fetched 同拍 |
| 16:33:52/53 | rlc | denied→ok | 本席探针双态实测（无 token 401/带 token 200 复现） |

**定谳**：卷面观察项①「8713 boot 首拉 attribution=pull_denied 401，+9min 周期拉取成功」=**两处读数错配拼接**——rlc 的 401（00:02:23）+rlc 转绿（00:09:36）被错安到 8713 头上；「+9min 转绿」实为 **8711 保真纠偏重启**（非周期 timer）。8713 面自 G10 起 16:01:21/16:16:21/16:31:21Z 全 ok（900s 周期正常在跑）。

**裁定**：观察项①**销项**，无独立缺陷；401 根因归并②（裸拉无 token），②修复验收面含「复活链不再产生 pull_denied 台账笔」。
**readout 卷勘误**：g10-deploy-readout-20260929.md §六.2 命名差注记+§八.1 同源错配，已由本卷定谳覆盖，读数卷按史不改（修正记录以本卷为准）。

**附带发现（新挂账，不阻门）**：**status write-back 404 recurring**——16:00:47Z 起 mlc/rlc 每次 applied/failed 回写均被 server 404 拒（台账 4+ 笔「status write-back rejected http=404」）。非阻塞（daemon non-blocking warn；pull 结果 server 台账已记，status 回写仅卡状态面同显）。候查面=TriModel `handlePutConfigCardStatus` 404 触发条件（疑=卡文件缺席时 status 回写被 faceCardPath 存在性守卫拒——卡缺席语义下回写被拒是否合理）。归候办清单，TriModel 面下窗排。

## 五、④ 陈旧 pidfile——清档可办

`AppData\Local\trimlc-channel\trilc.pid`（Sep 2）：实锚不在 CLI 读链（PID_DIR=`~/.trimetaverse`，paths.ts；G10 §二.2 同读数）。**裁定：清档**（rm 单件，零服务影响），归 SDE 顺手项随①部署窗一并，无紧迫性。

## 六、COO 附注核复

COO 合账附注③（陈旧态注记）+卷面 §七 自纠实录（launcher 一行式翻车/8711 保真缺口/pidfile 互踩）已全读；附注与本卷裁定无冲突。9-18 pidfile 事故族防线（互踩门拒停）实战兑现=防线设计目标达成，本轮①裁修后互踩源断根。

## 七、sequencing

①（FD 一行级）②（SDE ps1 单行）④（SDE rm 单件）互不依赖，**可并批下窗**（正常工时窗，非即夜急件，P0 验收主线不阻——与 COS 时点约束一致）；③无动作。①的部署验证依赖下次 8713 重启窗（可候常规维护窗，不专令重启）。

## 使用依据

- 读数卷：g10-deploy-readout-20260929.md（bc388290，本席亲验在位）
- 源码实锚：TriMLC src/index.ts L145/L161、src/pidfile.ts L29-53/L73、src/paths.ts PID_DIR；TriRLC src/index.ts L141、src/config/key-cache.ts L53-62/L329/L342-344/L392-415/L472-475、src/config/env.ts L165；TriModel src/api/config-cards.ts L14/L53-62/L93/L121-128/L199、src/card-faces.ts L29-39（FACES 在册表）
- 活体实锚：face-events.jsonl（16:01:21Z mlc ok/16:02:23Z rlc denied/16:09:36Z rlc ok）、channel.log 新 boot 段（L31600-31618：decrypt_failed→model relay ok→timer 34s）、daemon.log（8711 同构）、3333 端点双态探针（无 token 401/带 token 200 card_present:false）、双 launcher env 对表、双 watchdog ps1 对表、schtasks 任务 XML 双份
- 纪律：D-04 报时（00:37:45 现查）/实勘先行不转抄/manifest 身份验证（face-events.jsonl 实落件名核对）/活体优先诊断法
