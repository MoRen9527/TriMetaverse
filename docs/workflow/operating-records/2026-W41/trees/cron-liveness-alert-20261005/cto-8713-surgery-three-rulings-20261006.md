# CTO 裁定笔 · 8713 手术毕 ACCEPT+序①破案采认+三观察项裁（SDE 18:50 回执）

- sourceOfTruth: 本件（CTO 裁定正身；呈报=SDE 施工卷 d04c088e，§四序 18:27-18:48 全毕）
- syncMode: final
- lastSyncedAt: 2026-10-06T10:5xZ（date 现查 hook 18:50:13+08）
- 裁定席: CTO 小狄（m-cto）

## 手术面 ACCEPT

§四序全毕读数核：①术后三件套绿+**首切锚兑现**（pid 1604 起 18:34:42＞dist 部署时点=0.2.1-wave3 进程面——b14 消费面裁定的在役验证点闭合）；②watchdog v2（三探 AND+登录守卫 fail-closed+90s 自验）冒烟三形全绿+自然轮在岗+改前备份在位——**fail-closed 系本席 §八 技术门【须改】款兑现**。手术 ACCEPT。

## 序①破案采认（8711 拉起者=TriRLC Daemon LogonTrigger）

四证据链吻合（WU 19:49:26 重启→19:49:52 开机→登录→19:50:31 触发+nvm4w CmdLine+父已死+pidfile +4s）——**核③成立且语义精确化采认**：LogonTrigger 模板覆盖「重启+登录」窗，非无人登录窗；无人窗由 watchdog 补位。8713 缺位一夜根因面完整：TriMLC 无 Daemon 任务（从未有）+watchdog 任务 19:50-10:05 停摆（零 DOWN 行实证，非 stand-down 锁死）——双保险双缺位，缺位一夜的完整解释链闭合。§八「破案钥匙」判定兑现：该模板=已实证正确形态，对抄候选转正。

## 三项裁

**A. TriMLC Daemon LogonTrigger 任务补齐——APPROVE 即窗，附三约束**：
1. 对抄 TriRLC 模板；D-17 敏感面定性=**非提权拉起**（jedih 登录上下文，非 SYSTEM），不触 §八 红线③（禁提权拉起面）。
2. **禁手动 run 触发**（防扰术后观察窗；daemon 在役 pid 1604，双拉竞态虽系无害失败——port 占用+EADDRINUSE 后起者退出，TriRLC 同构已实证——仍不主动触发）；验证=注册面 query 在册+**下次自然登录窗实测**（观察窗毕后首个登录时点）。
3. 语义精确化注记随施工入卷：LogonTrigger 管「重启+登录」窗、watchdog v2 管其余窗，双保险拼图=全窗覆盖，互不替代。

**B. watchdog 停摆根因勘验——APPROVE 候 admin 窗并办**：与 systemprofile 提权验证**并批一次 admin 提窗**（建议明日窗，省窗）；第一步=**启用 TaskScheduler Operational log**（先开日志再勘验——本次 19:50-10:05 停摆零证据即因日志未启用，先堵根堵点防复现又盲）。停摆窗与 WU 重启 19:49 时点强相关为工作假设（非结论），候日志面证据。

**C. l2-scan 归位——采认+条件修正**：卡态根因链闭环采认（10-05 17:44 轮进 running→17:47 前窗 daemon 死→store 持久至今，与 TriMLC 完成链断裂第三签名定性一致）。但**「本态即件③验收样例」有条件**——本席实勘：TriMLC 仓零 `resetStaleRunningJobs` 命中+独立 git 提交线（2bf1919 顶）=**FSD 段1 件③ boot 清扫只落 TriRLC，TriMLC 真病灶侧未修**。修正令见下条；korw 本态**冻结保留禁手工强改 store 绕过**，8713 下次冷起窗真刀验收（前提=TriMLC 侧移植到位，否则验收样例落空）。

## 连带令（转 FSD）：件③ TriMLC 侧移植

件③ boot 清扫 §八 增补本意=「防下次重启 **l2-scan 型**永停复发」——病灶在 8713=TriMLC，FSD 段1 实现落 TriRLC 系落点错置（或误认镜像关系；实勘 TriMLC=独立代码线独立仓）。**段2 部署窗前补 TriMLC 侧移植**：store.resetStaleRunningJobs 同构实现+挂载点对齐 TriMLC daemon 起动链+三案测试（幂等/多 job/WAL 逐行刷新坑同款防御）+独立 commit 落 TriMLC 仓+全量门读数——归件③ scope 内本意落点非新 scope，段2 触发链前置项加此一件。

## 使用依据

- SDE 手术毕回执 18:50（施工卷 d04c088e）；本席独立实勘 TriMLC 仓（grep resetStaleRunningJobs 零命中+git log 顶 2bf1919/2b1709d 独立线）
- §八 技术门三核意见（fail-closed 兑现+判活三件套+8711 咬合段「破案钥匙」）
- b14 消费面裁定笔（首切锚兑现=0739873a/f3568194 链）
- 纪律：零转抄独立验（裁 C 前实勘 TriMLC 仓）/回滚锚隔离/D-17 敏感面定性先于施工
