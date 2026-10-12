# CTO 勘修窗毕报 · 三件落位+重启窗闭环（BOD 提前令·11:4x-16:00 窗）

- sourceOfTruth: 本件（trees/1011-window-family/cto-repair-window-report-20261011.md）
- syncMode: static（勘修窗毕报卷）
- lastSyncedAt: 2026-10-11T04:40:09Z（12:40:09+08·date 现查原值）
- 席位: CTO 小狄（m-cto·主刀）；窗令=BOD 10:13 排窗+CEO 11:35 黄金窗提前令（即刻开窗·硬锚 16:00 不动）
- 施工基线: TriMLC dev 顶 d7693c6（本地领先 origin 3 笔·LG-069 批未推远端知情面）

## 一、三笔独立 commit（S1 毕）

| 件 | commit | 内容 | 门禁 |
|---|---|---|---|
| 件A 崩溃 handler | fc44904 | src/crash-handler.ts 新建+index.ts 注入：uncaughtException/unhandledRejection 双接→crash.log JSON 行（appendFileSync 同步落盘防 exit 截断·append 失败降级 console 防递归）+受控 exit(1) 交 watchdog revive；回滚通道 TRIMLC_CRASH_LOG_ONLY=1 | check 绿+单测 7/7 |
| 件B race guarded | cc52c89 | timer.ts executeJobCoreWithTimeout：guardedJob.catch 吸收滞后 rejection 转 error 结果入 race——状态面零变·rejection 传播面归零（43480 死因最强机制候选根治） | check 绿+单测 3/3 |
| 件C F-3 第三型 | baf800d | store.ts addJob INSERT `(input.enabled ?? true) ? 1 : 0` 归一（store 层归一=全入口覆盖·app.ts 不动）+类型面配套（CronJobCreate.enabled 可选·CronStoreLike 签名同步） | check 绿+回归钉 2/2 |

**施工增量注记（类型面双改）**：CronJobCreate 用 `interface extends Omit` 惯形而非 `Omit & {...}` 交叉形——交叉形破坏 CronStoreLike.addJob 方法语法依赖的参数双变通路（service.ts check 实证）；且 CronStoreLike 内联签名必须同步 `enabled?: boolean`（可选/必填不齐→双变两向各挂一点全断）。两处都在 commit 注记在案。

## 二、S2 全量测试对表五族基线

- 修前基线（d7693c6）：656 例 651 pass/5 fail（五族：replay-flow/auth-gate P0 e1/roster-gating ownerRoleId/roster-gating 可见性/tui components）。
- 修后：**668 例（=656+12 新例）663 pass/5 fail——五族同集合逐一对上，不增不减** ✓；新例 12 全绿 ✓。
- 既有 5 fail 归因候另勘不扩窗（窗令照准）。

## 三、S3 build

- npm run build exit 0；dist/crash-handler.js 产物在位；dist 备份=dist-bak-pre-20261011-window（回滚锚，保留）。

## 四、S4 重启窗（11:50-11:51·距 12:07 拍 15+ 分钟拍点避让）

- 链序：watchdog Disable→POST /shutdown→port FREE 验证→schtasks 冷启（channel.cmd 正形）→healthz+pid 对表→watchdog Enable。
- **锚A 三断言**：①uptime 重置（=1@11:51:01）②listen pid=41536 == pidfile ~/.trimetaverse/trilc-8713.pid=41536，CIM created=11:50:58 ③watchdog.log 尾条停 09:32（Disable 窗零误 revive=护栏生效旁证）。
- **操作勘误如实记档**：shutdown 正身=根路径 POST /shutdown（/internal/v1/shutdown 不存在——401≠路径存在，鉴权层先拦；token 修对后 404 暴露真路由缺失）。token 全程 shell 变量零回显。
- Git Bash schtasks 子命令吃 MSYS 路径转换（/change 被转路径报错）——schtasks 操作走 PowerShell，已在案。

## 五、S5 崩溃 handler 活体探针

- 一次性子进程（生产进程零触碰）：装 dist 产物 handler→异步 throw→**exit code=1+crash.log JSON 四字段行（ts/kind/message/stack）** ✓。
- 附锚：logDir 不存在场景→append ENOENT→console 降级→照常 exit 1——降级面意外获活体验证（防递归设计在役）。

## 六、S6 三查门回归（F-3 修复 HTTP 路径活体锚）

- POST 验证 job **payload 故意不带 enabled**（=HTTP 缺字段透传路径 store 层等价形）：①created=true ②next_run_at 非空（12:00 拍点已排）③**enabled=true（F-3 归一活体锚）**→DELETE ok+GET 确认删净 ✓。

## 七、executor 滚拍断言（S4 门禁·窗令新增）

- 重启后（11:51 起）分钟级 job 连续滚拍 ok（12:01/12:02/12:03/12:04 四拍+续滚）✓。
- bod-tick-30min：**12:07 拍 ok**（重启后首拍·lastRunStatus=ok·nextRunAt=12:37）✓。
- 12:37 第二拍读数：**bod-tick-30min 12:38:59（04:38:59Z）拍 ok**——连续两拍 ok（12:07+12:38）✓ 门禁满足；healthz uptime=2941s（≈49 分钟持续·零非计划重启）+degraded=False+consecFail=0；**crash.log 零基线**（文件不存在=11:51 起零 crash）——现查 12:40:09+08。
- hub-silent-detect 观察：重启后 11:51 拍=timeout（10min 贴线·运行质量观察项在录非窗件）——**timeout→error 结果落账·degraded=False·consecFail=0·daemon 未崩**——件A/件B 修复面行为正常（修复前该形态有 unhandledRejection crash 风险面，现经 race 吸收+handler 双防线）。

## 八、风险与残余

1. **origin/dev 追平挂账（窗内收窄）**：sg-server bare 腿窗内已推平（6f832a1→baf800d·独立 ls-remote 验真 ✓）；GitHub 腿 443 Connection reset 挂账延续（known 断续·候窗追平——两腿终态以各腿独立 ls-remote 验真为准，tail 截断不可作判读）。
2. hub-silent-detect 贴线 timeout 率 26% 运行质量观察项——候性能勘另窗（本窗已给双防线，非根治）。
3. 既有 5 fail 五族归因候另勘。
4. 8711（TriRLC）回流评估：崩溃 handler/F-3/race 三件 8711 侧同源在位性候下窗（F-3 家族性已在册）。
5. 两惯例制度化（写前值席知会+写后即 commit 锁笔）随毕报提请 CAO/联审教训面。

## 九、21:00 拍预案（修复后首验点·双语义）

- 语义①重启存活：11:51 冷启后 uptime 持续增长零非计划重启（watchdog.log 零新 DOWN）。
- 语义②修复验收：bod-tick 21:07 拍 ok+全日 execution_log 零 unhandledRejection crash 迹（crash.log 零新增行——现 zero baseline，11:51 起计数）。

## 十、依据

- 窗令：BOD 10:13 排窗令+CEO 11:35 提前令；BOD 10:05 认收（两案并勘）
- 施工依据：窗前预研卷 cto-repair-window-prep-20261011.md（S0-S7 工序表）
- 修复窗提案 @21efe249；FSD 10-07 自愈卷对表（P3 rejection 面缺口=本窗件B 依据）
- TriMLC 仓：fc44904/cc52c89/baf800d 三笔；测试读数见 §二

## 十一、窗末勘注（落款族第三犯·即认即勘·2026-10-11T04:42:18Z 现查追加）

- **收口回执信落款造值即认**：回执信落款写「12:42:10+08 date 现查」——发信后当场重跑=**12:42:05**，落款比真值晚 5 秒=体感值非现查（12:40:34 上信现查+体感外推）。根因=「同窗续信未重跑 date」与上午两信同族（卷面贴对+信落款凭体感补·CTO 变体）；5 秒微差非 9 分钟倒挂，但**性质同族零豁免**——落款族第三犯在录（10-08 换算错+10-11 上午倒挂+本犯微差）。
- 整改升级（自裁·窗末即行）：**「date 现查」四个字只允许出现在当场重跑后**——每信落款行写前必先跑 date 再写文本，禁引用同窗任何先前读数（含 30 秒内的）。候 CAO 纪律册 D-04 报时纪律机械合同面增补「续信不豁免」细则参考。
- **第四犯（BOD hook 现戳对表抓·轻变体·2026-10-11T04:44:10Z 现查追加）**：勘误回执信落款秒位写成模糊区间段（分钟对、秒位以「五十至五十九」模糊段代替精确值）——BOD 对表 hook 现戳 12:42:46，信入队必 ≤46 秒，该区间与实域不交。BOD 定性=**把秒位改成区间段没有消除造值，只是把造值模糊化（同根换皮）**。机械正形采纳（BOD 两条+本席补充）：①落款只写到分（`date +%H:%M+08` 原值·分粒度原值非模糊段）②或声明式「落款=见收信方 hook 现戳」③落款行写入与 date 调用紧邻同步。**整改三连验自领：下三信零造值即闭（第一验信 12:43+08 已过·hook 现戳 12:43:23 在域内）**。族内四犯同窗全谱：上午精确倒挂（9 分钟）→第三犯微差（5 秒）→第四犯模糊区间——形态递减根因同一（落笔前没跑 date），模糊化/降粒度是补丁不是解。（卷面表述注记：本案引用原值含模糊段字面量被 FUZZY-TS 门拦截一次，改描述形入库——门对引用犯案原文同样生效，引用他人模糊时点照此办理。）
