# token 轮换三折·消费对象勘正+候选位清点+schtasks 通用修法

- 2026-10-15 归一窗 8711/8713 token 轮换三折实录（毕报卷=TriMetaverse 0b3d0bebd·CAO 铸条候选两枚已送）

## 折1·Git Bash schtasks /run 路径转换（跨 daemon 通用修法定形）

`schtasks /run /tn "X"` 被 MSYS 转换成 `C:/Program Files/Git/run` 报无效参数——**TriMLC（10-11）与 TriRLC（10-15）两 daemon 同坑实证=坑族通用非孤例**。修法唯一正形=PowerShell `Start-ScheduledTask -TaskName 'X'`（或 `MSYS_NO_PATHCONV=1`/`cmd //c`）。Git Bash 面禁用 schtasks 动词系命令，勘修窗重启链写操作一律 Start-ScheduledTask。

## 折2·token 轮换前必勘键的消费对象（同名键≠同对端）

`TRIMC_INTERNAL_TOKEN` 在 8711 的消费对象=**河源 TriRMC 8710**（`TRIMC_BASE_URL=http://8.155.54.79:8710` heartbeat 链）；在 8713 的消费对象=**sg TriMMC 8712**（经 18710 隧道）——**同名键两 daemon 对端不同**。今晚 sg 窗只轮换单向，顺手同换即打断 8711→河源 heartbeat 链（totalFailures 1→18 401 流）。**正形**：轮换施工前逐键勘「键→URL→对端 daemon」三段链；探针定性三态=404（auth 放行·路由不存在——express auth 先行语义·**404 可作「值正确」旁证**）/401（值拒）/400（放行·载荷缺）。河源 8710 认 08e07c8b（10-15 时点·未轮换）。

## 折3·token 候选载入位清点（env 候选链多副本）

TriRLC env.ts 候选链=TRILC_ENV_FILE 显式→`D:/Code/ai/.env`（工作区根·r19 残留）→TriRLC 根 .env→dataDir 相邻 .env→cwd/.env；`if (!(key in process.env))` 守卫=先载入者赢（src+dist 同形已验）。**工作区根 .env 藏第二份 TRIMC_NOTIFY_SG_TOKEN**——双文件同值时绿、单改一处即分裂（进程取值路径不可从外部断言）。**正形**：轮换清点 grep 全候选链文件+值一致化（任何载入路径均正确）+候窗收敛删除旧副本（单点真源）。daemon 进程 env 无法外部直读——值一致化是唯一不依赖假说的修法。

## 附·D-46 第 8 例（注释行裸 key）

掩码管道 `s/=(..)(..)(..)(..)[0-9a-f]+/…/` 只盖 `KEY=值` 行形态——`D:/Code/ai/.env` 头部**注释行** `#sk-proj-…` 明文直穿 transcript。正形=读未知文件先键名 grep 摸底+全文件 cat 前过密钥形态通配掩码（`s/[sS][kK]-[A-Za-z0-9_-]{16,}/sk-MASKED/g`）——掩码正则须覆盖注释/字符串内嵌形态（第 6 例「追不全值形空间」同族延伸）。

## 附·8711 token 键位图（现势 10-15）

`%LOCALAPPDATA%\trirlc\daemon\trirlc-daemon.env`（TRILC_ENV_FILE 载入·cmd 薄壳→ps1 L12 注入）：TRIMC_INTERNAL_TOKEN=08e0…（河源）/TRIMC_NOTIFY_SG_TOKEN=6ed0…（sg·18710 隧道）/TRILC_INTERNAL_TOKEN=自身门键（/shutdown 用）。备份 `.bak-pre-tokrot-20261015` 三处（daemon env+8713 cmd+工作区根 .env）。
