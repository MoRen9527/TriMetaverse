# FSD 施工毕报：mc_link token 跟更+8711 重启（BOD 令②·四步全毕·修复实证）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-14T03:07:07Z（11:07:07+08·[DateTime]::UtcNow 权威口径·见假读数注记）
- 施工位: FSD 小全（m-fsd）；令源链: COO 勘验卷+COO 定性合流（token 值不匹配唯一候选）→BOD 钉①（hash 对表不等）+裁②准→令② 10:55:20（窗内执行）
- 状态条: ①date 现查 2026-10-14T03:07:07Z ②水位=中 ③联审证据=本件+healthz 读数序列+connection-state.json+daemon.log 新进程段 ④末次活动=毕报卷写毕 11:07 段

## 完工判据（令④）：mc_link=connected ✅

- healthz 终读（11:05:45·uptime=30）：**mc_link=connected·mc_peer=trirmc**·follower=following/none·cron.jobCount=0（预期形）
- connection-state.json：`state=connected`·lastStateChange=2026-10-14T03:05:25.879Z（**启动后 ~11 秒恢复**·2 连胜达成）
- daemon.log 新进程段：`[trilc:conn] recovered → connected`+`[trilc:conn] replay: no pending events`——恢复链照 ConnectionManager spec（2 连胜→connected→events/replay）
- **401 根因定性被修复实证闭环：token 跟更=根治** ✅

## 执行时刻表（四步链）

| 步 | 时刻(本地+08) | 动作 | 读数 |
|---|---|---|---|
| ①备份 | 10:56 段 | daemon.env→`.bak-20261014`（677B） | ✓ |
| ②取值 | 10:56-10:58 | ssh 河源 pid 2306757 environ 直读 TRIRMC_INTERNAL_TOKEN（全程变量化零回显·D-46） | len=64·非空 |
| ②守卫 | 10:58 | 二次取值 hash 守卫（防取值漂移）→写入 env（仅 TRIMC_INTERNAL_TOKEN 行替换）→写后文件 hash==取值 hash | fd9dd4af617c==fd9dd4af617c ✓·10 键完整（含 TRILC_INTERNAL_TOKEN） |
| ③重启 | 11:04-11:05 | TriRLC-Watchdog disable（防 11:06 触发竞争）→pid 对表（监听 14132=勘验窗记录✓·pidfile 文件未寻获如实注）→POST /shutdown（X-Internal-Token 门·TRILC_INTERNAL_TOKEN 变量化·261ms accepted）→port FREE 0s→schtasks `\TriRLC Daemon` 冷启 | 新 pid=31240·uptime 重置 |
| ④验证 | 11:05-11:06 | healthz 三断言+mc_link 轮询→watchdog re-enable | connected（30s 内）·watchdog Ready 复位 |

## hash 复验（令④：只报 hash 不报值）

- **两侧一致 ✅**：本机写入后 daemon.env 值 hash=`fd9dd4af617c` == 河源 pid 2306757 environ 值 hash=`fd9dd4af617c`（md5 前 12·同法同源闭环）。
- **与令面读数数字不匹配·如实呈报**：令①钉的 `943e21259de2`（河源）/`ac528f48daf9`（本机）在本席 md5/sha1/sha256/sha512 × 值/整行共 14 组合下**均未复现**（河源端同机直算+本机备份文件双面测·零 PS 管道变形干扰）。核心定性「两侧值不同」不受影响（本席两值在全部算法下 hash 均不同·已由修复实证背书）；**BOD 侧取值形态/算法指纹候 BOD 复核**（如取的是 env 文件而非 environ·或其它截断形）。执行判据未依赖令面 hash 数字——活体 environ 直读=TriRMC 进程真实比对值，写入即写对。

## 假读数注记（D-47 自检抓获）

毕报落款前 date 现查首跑（`date -uFormat`）返回 `11:06:36Z`——**Z 尾贴本地值的假读数**（与 UtcNow 权威口径差 8h·截断/变形伪影族新变体·该调用形禁用）；复测 [DateTime]::UtcNow 钉死 03:07:07Z。前值作废不入卷，命令形教训候本席 memory（禁 `date -uFormat` 单跑作 UTC 落款源）。

## 旁证换形注记

令面「watchdog.log 旁证」：trirlc 数据目录下**无 watchdog.log 文件**（本机 TriRLC 侧未产此日志·与 10-11 TriMLC 勘修窗链的旁证位不同名）——改用等效旁证三件：daemon.log 尾（mtime 11:05:11+`ready — pid=31240` 行）+schtasks 双任务状态（Daemon Ready/Watchdog Ready 复位）+connection-state.json 落盘。如实注·非缺证。

## 残留观察项

1. `[trilc:keys] refresh failed: fetch failed`——443 断家族旧洞仍在（与 mc 链分离·在案候恢复）。
2. postHeartbeat 布尔吞错+无告警升级可观测缺口三条——候 CTO 裁（勘验卷已呈）。
3. BOD 令① hash 数字指纹对不上（本卷 hash 段）——候 BOD 复核其取值形态，不影响修复结论。

## 使用依据

- BOD 令② 10:55:20（四步链+完工判据+D-46 值面纪律令文）
- COO 定性合流收账 10:49:13+勘验卷 fsd-mclink-verdict-20261014.md（9a7efa305）
- TriRLC daemon 重启纪律正形链+10-11 TriMLC 勘修窗实操序（watchdog disable→shutdown→FREE→冷启→三断言→enable）
- TriRLC src/server/app.ts L1820-1833（X-Internal-Token 全局门 fail-closed）+ConnectionManager 恢复链 spec
