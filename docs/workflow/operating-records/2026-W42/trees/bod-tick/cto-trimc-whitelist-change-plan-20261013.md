# CTO · TriMC 白名单补 m-duty-coo·变更方案卷（BOD 2026-10-13 08:09 令）

- sourceOfTruth: 本卷（trees/bod-tick/cto-trimc-whitelist-change-plan-20261013.md）
- syncMode: static（变更令全程闭环·08:32 验收毕三锚全绿·归档）
- lastSyncedAt: 2026-10-13T08:33+08:00（验收毕报 00:32:14Z 发 BOD·发后对表 00:32:36Z 零漂移）
- 令链：BOD 变更令 08:09（CEO 指出口径不一致成立·LG-052 扩面遗漏非设计意图·治理链补对称）+BOD 分工裁 08:15（我变更段/BOD root 重启段）

## 对象断言实锚（08:1x 本席 sg 直勘·fleet SSH 只读三发）

- **8712=trimc 现役正确**：healthz `"service":"trimc"` jobCount=10；`ss` 实锚 node pid=1959958 监听 127.0.0.1:8712；**8710 现无监听**——**【08:35 勘正】记忆条勘正头注 10-06 已在（trimmc-mlc-addjob-divergence L3「TriMMC 现役监听=sg 8712 非 8710」）——本行原注「记忆条未随迁移更新」系假修正：条未过时，是本席引用时未读全条只记 L5 旧开头——教训入记忆条「引用记忆条先读全条再断言过时」。**
- **outbox.ts L65 白名单现值与令面逐字一致**：`['m-duty-cos', 'bod', 'm-cos', 'm-coo']`；注释确认 LG-036 MVP=m-duty-cos/LG-052 扩治理链三席——m-duty-coo 缺位实锚。
- **形态断言**：sg TriMC=**systemd 形态非 watchdog 形态**（trimc.service 直管·PPID=1·「dist production form, r15-1-4」）——BOD 令面重启链（watchdog Disable→优雅停→FREE→冷启→pid 对表→Enable）系 Windows schtasks/watchdog 模板，sg 面**同构映射**：systemd stop（SIGTERM 优雅停）→port FREE 断言→systemd start→MainPID 对表+healthz 值面探针；Enable 面 systemd 自管无需步骤。
- **git 现势**：顶=970b5cc（LG-052 urgent tmux 修）；源码面干净（仅 notify 运行时 json 三件未跟踪=运行数据非源码）。
- **权限断言：fleet SUDO_NO**（sudo -n true 拒）——**重启段需 root 通道**；变更笔/build/测试/commit/push fleet 身份全可做。

## 变更方案（单点最小改）

1. **改动**：`/srv/fleet/TriMC/src/notify/outbox.ts` L65 → `['m-duty-cos', 'bod', 'm-cos', 'm-coo', 'm-duty-coo']`；注释补一行「2026-10-13 BOD 变更令：m-duty-coo 补对称（LG-052 扩面遗漏勘补）」。
2. **门禁**：`npm run check`（tsc --noEmit）→ `npm run build`（tsc 产 dist）→ `npm test`（notify 套 30 件基线全绿·2d262d0 注记基线对照）。
3. **落笔**：fleet 身份 commit（署名照旧 Co-Authored-By 尾注）→push（照旧 remote）。
4. **重启段（root 通道）**：`systemctl stop trimc` → port FREE 断言（ss 8712 空）→ `systemctl start trimc` → MainPID 换新对表 + healthz 值面 + `grep -c m-duty-coo dist/src/notify/outbox.js`（编译产物白名单生效值面探针）。
5. **终验探针（候排）**：m-duty-coo 直发一封测试信入 outbox 成功=白名单生效活体终验（候值席 COO 配合·或毕报后 COO 侧首次实际直发自证）。

## 边界守 precisely（BOD 令面三注意对表）

- 仅补 SOURCE_SEAT_WHITELIST 一席一处；FSD 等执行链席扩册维持不批（治理链/执行链分界不动）。
- **边界发现（标注非扩权）**：m-duty-coo 在**收端 roster**（LG-052 值席消费面 `m-duty-cos: trimmc` 形态）无位——本令面只裁发信白名单；若值席 COO 需收端消费值席信箱，另走扩册令（不在本变更内私扩）。

## 排窗（D-23 对轨）

- 工作所属模型=GLM 轨（本席）；D-23 指导表：GLM 轨黄金段=18:00→次日 14:00——现时 08:2x **在黄金窗内**；禁排区=工作日 14:00-18:00（不涉）。
- **自排：今日 09:00-09:20 微窗**（变更笔+门禁+落笔我 fleet 身份段约 10 分钟；重启段候 root 通道到位即续·两段可跨微窗拼接）。
- 候 BOD 一句：root 重启段执行位=您直执（SSH 两令）或授权 sg 值席位执行——候令指定，不指定则毕报变更笔毕+重启段挂候。

## 变更段执行记录（08:15-08:29 全毕·毕报已发 BOD）

- **步骤 1-3 全毕**：sed 单行补+注释 → 门禁三步（tsc check+build 过+测试 466/457/9 fail 经 stash 对照实锚既有）→ commit caadfbc。
- **并行笔收编**：push 遇 sg bare 已推进至 82a3d52（正名 TriMC→TriMMC 大线+key-cache+recovery-ladder 批）——decba1f（10-9 历史笔·LG-069 电源门配套）同文件同数组加 'power-gate'。merge 冲突解=两笔并集六席终态 `['m-duty-cos', 'bod', 'm-cos', 'm-coo', 'power-gate', 'm-duty-coo']`；merge 顶 9561273 push 验真（sg bare dev 顶=9561273306f）。
- **merge 树复门禁**：check 报 TS2307×1（src/cli.ts L13 引 `@trimetaverse/tricode/trimodel-cli`·sg node_modules 旧未装——**合并线自带非本笔引入**；实锚 dist/src/index.js 启动链零 cli 引用=主服务不触及，仅独立 bin 破面）；build 过；测试 476/467/6 fail（resolveInternalToken cwd 链 5+Employee Registry 1·既有环境依赖族与白名单零关；上基线 ctx.cwd 族 4 件随新线已修）。
- **重启上线面候裁（毕报核心申报）**：现位 dist=merge 全量产物，照令直重启=白名单+sg 未上线全量代码一次性进生产（超令面单点最小改）。已备**最小集 dist 备用位 `/tmp/trimc-min-dist/`**（caadfbc 基线+六席白名单并集·零新线耦合·负向探针 key-cache 缺席+六席 2/2 实锚）——推荐 BOD 换装后重启。npm install 补 tricode 依赖未做（生产 node_modules 操作超令面·归 sg 推进线候办）。
- **分工链现势**：毕报 08:29 发 BOD（候裁+候操盘）→ BOD root 四步链（备份换装→stop→FREE→start→MainPID）→ 回信后我值面探针验收三锚（dist 白名单六席 grep+healthz 值面+uptime 重置）。

## 验收毕（08:32·三锚全绿·全程闭环）

- **BOD 裁采最小集换装**：备份锚 /tmp/dist-backup-1791851440 →换装 /tmp/trimc-min-dist→stop→PORT-FREE ✓→start→MainPID 1959958→**3126596** ✓。
- **三锚读数**：①dist 白名单六席 `'m-duty-cos', 'bod', 'm-cos', 'm-coo', 'power-gate', 'm-duty-coo'` ✓ ②healthz ok:true·jobCount:10·degraded:false·cf:0 ✓ ③pid 3126596 etimes=74s uptime 重置 ✓。
- **监听面勘正**：换装前后均 127.0.0.1:8712（旧进程 08:1x 断言实锚在卷）——「0.0.0.0→loopback 变化」不成立（BOD 操盘读数误记已勘）；ESTAB 消费连接全源 loopback 零跨机直连=绑定面零受伤。**真观察项**：merge 全量线疑改 0.0.0.0→列 sg 推进线部署窗绑定面复核候办。
- **m-duty-coo 活体终验**：候值席 COO 首次实际直发入 outbox 自证（不伪造源席）。
- 闭环台账：令 08:09→分工 08:15→变更段毕 08:29→操盘毕 08:30→验收毕 08:32。

## 附：夜间灰度积压直报×4 留素材

- duty-cos-silent 静默直报 35/39/39/39min（transcript 锚 10-12T19:54Z~22:50Z·夜间段）今晨一并送达=本机会话夜间挂起积压投递形态——素材与 LG-052/灰度周评估并档（双通道双显+时效衰减两素材增例）；非本席处置面（值席 COS 态知情 COO 面）。

## 勘误注记（2026-10-15 append·D-47 现查 10:52:24 +0800·首笔 10:53:41 系预估误写即勘正）

随 BOD 10-15 勘误卷（35a3045cd）对表：本稿 L39「TS2307 仅独立 bin 破面·主服务不触及」半径评估**被实证修正**——独立 bin（cli.js）实有运行时消费者=config-sync-apply job（15min 执行 `node dist/src/cli.js`）·10-15 09:54 BOD 新 emit 后该 job 三连败 degraded=true（10:00/10:15/10:30·10:47 补挂 tricode 链接修复）。「非本笔引入」事实表述不撤；撤的是「破面半径=仅独立 bin」的低估——教训收编：**破面评估须查全部运行时消费面（含 cron job 面）非只主服务启动链**·与「构建绿≠运行时通·冒烟须到消费面」同族（活体验证族变体·候纪律化）。

—— CTO 小狄 勘误笔
