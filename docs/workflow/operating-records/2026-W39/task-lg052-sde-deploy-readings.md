# LG-052 广播阶段一·SDE 部署面执行读数（task-lg052-sde-deploy-readings）

- date 现查: 2026-09-24 23:58 +0800（星期四，窗内 23:43-23:58）
- 任务书: wt/board 20bd58ad（BOD 派工令 CEO 23:14 批）；FSD 协同单+读数件=wt/full-stack-developer 树 notify-broadcast-p2/phase1-readings.md
- 执行席: SDE 小布（部署面五步+侧询）；窗: 今夜（避 14-18 ✓）

## 五步执行读数

| 步 | 动作 | 读数 |
|---|---|---|
| ① env 勘/补 | `TRIMC_NOTIFY_SEATS_FILE` 未设（注册表勘空）；落点裁定=**trimlc-daemon-channel.cmd 本体**（daemon env 真源，全套 TRIMC_NOTIFY_* 兄弟变量同址；registry setx 不达 cmd 设定面）；byte-surgical 插行 line14=`set TRIMC_NOTIFY_SEATS_FILE=D:\Code\ai\TriMetaverse\.claude\seats.json`；首插遇转义链自伤（`\a` 被吞成 `D:\Codei`）→chr(92) 构造法修复+seats.json 实存断言 ✓ |
| ② daemon 重启 | 优雅停首试被 token 门拦（`X-Internal-Token` 头，记忆条复核实锤）→带 `TRILC_INTERNAL_TOKEN` 重停 `{"ok":true}`→34736 消失/8713 零监听→权威 cmd 拉起→**新 PID 49752**（23:51:26 生，新 dist+新 env）→healthz ok（4s 暖机 degraded→**315s 复核 connected×2**）✓；前置 `npm run build`（dist 陈旧 09-21→重建 23:49 载 ef7f8a1） |
| ③ sg TriMMC 部署 | 分叉定量：fd2436a（值席 +4 扩面）仅存 sg 树未进 bare；root 通道直 fetch→**冲突纯子集**（fd2436a 四行逐字含于 c6fe1fb 13 席块，零语义分歧）→取 HEAD 侧解→**合流笔 7665bd9**→notify 24/24 绿（node:test 正身入口 2676ms）→双远端推平（origin+sg-server bare c306d00..7665bd9）→sg 树 pull 遇脏件（值席未提交白名单热修+test 删除意图——**stash 保全**候值席定夺，白名单已被 7665bd9 治理三席子集覆盖）→ff 拉平→sg build（node v18 tsc）→`systemctl restart trimc`→**active+healthz {"ok":true} cron 6 jobs 零降级** ✓ |
| ④ hook 行替换 | user settings.json hooks.UserPromptSubmit[0].hooks[1] 内联单行→`node D:/Code/ai/TriMLC/scripts/notify-inject.cjs`；json 语义编辑（7 顶键零扰+date hook 零扰）；**回滚锚原文**：`node -e "try{const j=JSON.parse(require('fs').readFileSync('D:/Code/ai/TriMLC/notify-mailbox.json','utf8'));j.letters.filter(l=>l.target_seat==='bod'&&!l.read).forEach(l=>console.log('[M-SG NOTIFY] '+l.title+' | '+l.body.slice(0,200)))}catch(e){}"` |
| ⑤ 知会 | 本读数件+SendMessage 回 FSD（e2e 窗候约） |

## 侧询读数（FSD sg 推送不认）

- 双根因：①`sg-server` remote URL 畸形=`ssh://fleet@sg-ecs-server/...`（config 别名嵌作主机名+fleet@ 覆盖 config root→权限不认，即「access rights」源）；②现时点拦路虎=non-fast-forward（sg bare f5097185=其 §五.4 重放残迹 vs GitHub 真值 203dd6ff）
- 处置：按其已预裁 force-with-lease 形对齐→`+ f5097185...203dd6ff forced update`→ls-remote 复验 203dd6ff ✓ sg 侧 4 笔落后清零
- 遗留建议：`sg-server` URL 改 `ssh://fleet@47.245.122.61/srv/git/TriMetaverse.git`（与 origin push 同形）或 `sg-ecs-server:/srv/git/TriMetaverse.git`（scp 形走 config root）——候 FSD 自择改（本席不代改他席 remote 配置）

## 红线与边界守约

- daemon 重启=stop/start 权威路径（token 门优雅停+权威 cmd）✓ 禁裸杀未犯（首拉起自灭于端口占用=防二主机制自证）✓
- sg 树脏件 stash 保全未擅断 ✓ 未轨运行时件（notify-outbox*.json*）零触 ✓
- 窗口合规（23:4x 夜窗）✓；TriMLC scripts/digest-inbox.mjs 他线在办件零触 ✓

## 观察项（候 FSD/e2e 面）

1. **m-dee vs m-sde 名册错位**：TriMMC 合流后 TARGET_SEAT_ROSTER 含 `m-dee`（c6fe1fb 自 seats.json 旧值派生）而 runtime 名址已正名 m-sde——定向 m-sde 将撞 unknown_target_seat、广播展开 SDE 席落空。候 FSD 裁：名册行改 m-sde 或双名并入（收端 ef7f8a1 已双名制，发端单名现态）。
2. sg 树 stash 一枚候 m-duty-cos 定夺（pop/弃）。
3. sg test 件查漏⑥块在合流树已回归在位——sg 面跑测若环境摩擦（token/限速）候值席按实裁。

## 回滚方案

①②④本机面：cmd 删插行+git revert dist（重建旧 commit）+hook 还原快照单行，三件各自独立可逆；③sg 面：bare/tree `git reset --hard fd2436a`+重建+restart 即回执笔前态；stash `git stash pop` 可逆。

## 阶段二部署读数（2026-09-25 02:5x +0800 追补）

| 项 | 读数 |
|---|---|
| 测试门 | notify 三件（outbox+gate+duty-consumer）fail=0（2d262d0 线） |
| 推送 | sg-server bare `7665bd9..2d262d0` ✓；origin GitHub 夜网 443 超时未推（候晨网补推，sg 部署不依赖） |
| ①tmux 会话名实勘 | `tmux ls`=14 会话，**`m-duty-cos`**（09-16 建·attached）——FSD 两问之①实证答 |
| ②信箱位裁定 | 默认树 cwd（/srv/fleet/TriMC/notify-mailbox.json）——与 outbox ledger 同址同留痕族；mailPath env 可后改候 duty-cos 异议 |
| env 落位 | 新 drop-in `trimc.service.d/notify-duty.conf`：`TRIMC_NOTIFY_DUTY_SEATS=m-duty-cos` + `TRIMC_NOTIFY_DUTY_TMUX=m-duty-cos`；daemon-reload 后 `systemctl show -p Environment` 双断言现值 ✓ |
| 部署 | 树 ff@2d262d0+build+restart→active+healthz {"ok":true} 零降级 ✓ |
| 边界 | urgent tmux 实弹显不预演（留 e2e anchor C 正式发令；免向在席值席视窗注测试杂音） |

回滚：drop-in 删文件+daemon-reload+restart 即卸 env；树 reset --hard 7665bd9+重建+restart 即回阶段一态。
