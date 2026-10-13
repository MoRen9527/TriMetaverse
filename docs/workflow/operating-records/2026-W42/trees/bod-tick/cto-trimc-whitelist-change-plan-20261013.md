# CTO · TriMC 白名单补 m-duty-coo·变更方案卷（BOD 2026-10-13 08:09 令）

- sourceOfTruth: 本卷（trees/bod-tick/cto-trimc-whitelist-change-plan-20261013.md）
- syncMode: work（变更窗执行时升·毕报后归 static）
- lastSyncedAt: 2026-10-13T08:20+08:00（date 现查见 commit 卷笔）
- 令链：BOD 变更令 08:09（CEO 指出口径不一致成立·LG-052 扩面遗漏非设计意图·治理链补对称）

## 对象断言实锚（08:1x 本席 sg 直勘·fleet SSH 只读三发）

- **8712=trimc 现役正确**：healthz `"service":"trimc"` jobCount=10；`ss` 实锚 node pid=1959958 监听 127.0.0.1:8712；**8710 现无监听**——本席记忆条「TriMMC 8710」系过时读数（端口已迁 8712·10-11「8712 放归服务域池」窗后迁入·旧真值未随迁移更新——修正注记在此·记忆条更新候选）。
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

## 附：夜间灰度积压直报×4 留素材

- duty-cos-silent 静默直报 35/39/39/39min（transcript 锚 10-12T19:54Z~22:50Z·夜间段）今晨一并送达=本机会话夜间挂起积压投递形态——素材与 LG-052/灰度周评估并档（双通道双显+时效衰减两素材增例）；非本席处置面（值席 COS 态知情 COO 面）。
