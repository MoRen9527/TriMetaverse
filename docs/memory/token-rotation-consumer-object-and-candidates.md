# token 轮换三折·消费对象勘正+候选位清点+schtasks 通用修法

- 2026-10-15 归一窗 8711/8713 token 轮换三折实录（毕报卷=TriMetaverse 0b3d0bebd·CAO 铸条候选两枚已送）


## 折2·token 轮换前必勘键的消费对象（同名键≠同对端）

`TRIMC_INTERNAL_TOKEN` 在 8711 的消费对象=**河源 TriRMC 8710**（`TRIMC_BASE_URL=http://8.155.54.79:8710` heartbeat 链）；在 8713 的消费对象=**sg TriMMC 8712**（经 18710 隧道）——**同名键两 daemon 对端不同**。今晚 sg 窗只轮换单向，顺手同换即打断 8711→河源 heartbeat 链（totalFailures 1→18 401 流）。**正形**：轮换施工前逐键勘「键→URL→对端 daemon」三段链；探针定性三态=404（auth 放行·路由不存在——express auth 先行语义·**404 可作「值正确」旁证**）/401（值拒）/400（放行·载荷缺）。河源 8710 认 08e07c8b（10-15 时点·未轮换）。

## 折3·token 候选载入位清点（env 候选链多副本）

TriRLC env.ts 候选链=TRILC_ENV_FILE 显式→`D:/Code/ai/.env`（工作区根·r19 残留）→TriRLC 根 .env→dataDir 相邻 .env→cwd/.env；`if (!(key in process.env))` 守卫=先载入者赢（src+dist 同形已验）。**工作区根 .env 藏第二份 TRIMC_NOTIFY_SG_TOKEN**——双文件同值时绿、单改一处即分裂（进程取值路径不可从外部断言）。**正形**：轮换清点 grep 全候选链文件+值一致化（任何载入路径均正确）+候窗收敛删除旧副本（单点真源）。daemon 进程 env 无法外部直读——值一致化是唯一不依赖假说的修法。

## 附·D-46 第 8 例（注释行裸 key）

掩码管道 `s/=(..)(..)(..)(..)[0-9a-f]+/…/` 只盖 `KEY=值` 行形态——`D:/Code/ai/.env` 头部**注释行** `#sk-proj-…` 明文直穿 transcript。正形=读未知文件先键名 grep 摸底+全文件 cat 前过密钥形态通配掩码（`s/[sS][kK]-[A-Za-z0-9_-]{16,}/sk-MASKED/g`）——掩码正则须覆盖注释/字符串内嵌形态（第 6 例「追不全值形空间」同族延伸）。

## 折4·8713 cmd 第二键遗漏+FSD 兜底+CR 计数方法学

8713 `trimlc-daemon-channel.cmd` 我只换 L11（勘验锁定行）——**L18 TRIMC_NOTIFY_SG_TOKEN 第二键漏换**，FSD 激活段照 8711 先例兜住。同根因=同一施工跨目标执行深度不一致（8711 段自己发现第二键、8713 段没做同等清点）。**正形=轮换施工 grep 全 set/env 行逐键勘消费对象，禁只改勘验时锁定行**。附：8713 cmd 键位=L10 BASE_URL(18710 隧道)/L11 INTERNAL(sg)/L12 TRIMODEL_API_TOKEN(非 sg 系不动)/L16 TRILC_INTERNAL(自身门)/L18 NOTIFY_SG(sg)/L19 NOTIFY_TARGET_SEAT=bod。

**CR 断言方法学（FSD 抓我假读数）**：我施工报「od -c 断言 134 处 \r 保持」系**文本匹配假阳性**（od -c 转义输出混入含 r 行）；FSD 实测 sed 前 39→改后 0（剥 CR）→其归一修复后真值 39/39。**cmd CRLF 断言唯一正形=`tr -cd '\r' | wc -c` 字节计数**——od -c 文本匹配法废弃（截断伪影族：验证方法本身不可靠→假阴性自我确认）。指纹报数自此注明口径（前缀 8 字符 vs md5_8 vs sha256_8——派生式差异非值差异）。

## 附·8711 token 键位图（现势 10-15）

`%LOCALAPPDATA%\trirlc\daemon\trirlc-daemon.env`（TRILC_ENV_FILE 载入·cmd 薄壳→ps1 L12 注入）：TRIMC_INTERNAL_TOKEN=08e0…（河源）/TRIMC_NOTIFY_SG_TOKEN=6ed0…（sg·18710 隧道）/TRILC_INTERNAL_TOKEN=自身门键（/shutdown 用）。备份 `.bak-pre-tokrot-20261015` 三处（daemon env+8713 cmd+工作区根 .env）。

## 折5·探针类活 token 落点正形=工作区 600 文件（BOD 2026-10-20 裁）

LG-087 #7 现役席活体探针 token 落点：CTO 原指定 `/home/fleet/.dsh/web-token` 作罢（**沙箱外路径·r-duty 执行面预期约束不可达**）；BOD 裁定正形=**工作区 600 文件**（600/属主/零回显/毕删·安全属性与 .dsh 内落点一致）。四正形不变（600 文件+禁 argv 禁 env+提取管道零回显+用毕删+find 零残留）。**与隔离联调正形适用域分野勿互串**：现役席探针类=工作区 600 文件；隔离联调类（如 D' 段 2）=隔离 DSH_HOME 家 cp 不 cat——两形按「是否触碰现役席」选，不混用。

## 附·tmux 80 列 wrap 续接提取坑（token 提取面·BOD 2026-10-20 实锚）

8791 web 启动行在 tmux 面恰 80 字符·token 末字符落 wrap 续接行——**capture 单行提取只拿到 42 字符→对表 401；wrap 续接拼接 43 字符→303 绿**。正形=从 tmux capture 提取长 token 必查 wrap 续接行（capture-pane 带换行上下文·断言长度达标再对表·401 先疑截断非值错）。与折3「候选链多副本」/D-46 掩码族同族=token 提取面中间层截断假读数。

## 纪律落点（CAO 铸条 2026-10-15·TC 74403e7）

本条三折教训已条款化入纪律册：**D-54 凭证轮换施工纪律**（款1 消费对象三段链禁同名键顺手同换/款2 候选载入位全清点/款3 消费面四层含 cron payload/款4 施工正形互引/款5 PATCH 键面语义先读+附注 schtasks 跨 daemon 修法）；姊妹条 **D-46 含密值面打印路径防线**（探针四正形+族 8 例含第 7/8 例+BOD sg 段 payload 案·嵌套 payload 递归滤）。**两条 BOD 复核通过 2026-10-15 19:30:58 即生效**（落册 74403e7·状态笔 416aeb0）。整理注：CAO 曾平行另建 credential-rotation-consumption-chain.md 一件，防双写自查发现即撤并入本条（镜像侧残留候人工清理）。
