# FADE-001 第一阶段·代码预研段毕报（三件代码全绿·零生产触面·部署候 11-14 开工门）

- sourceOfTruth: 本件（fade001-phase1-review/cto-codeprep-closeout-20261113.md·预研段毕报）
- syncMode: static（代码读数锚·部署实锚候 11-14 施工窗）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 10:29 批令（LG-098·一步一步）→COS 10:48 窗序提醒（11-15 前零改形窗·落树即拾取）→本席裁量**今天=代码预研段**（纯仓内零生产触面·不违反窗序——该窗约束生产变更，代码开发+单测属预研，部署候 11-14 开工门）→三件全毕

## §一 三件读数（技术方案 cto-phase1-tech-plan.md 五件终裁之②③⑤代码面）

### 件③告警闸（主窗第一优先·提前一天完成）

- **TriRMC commit=50988e040**（2026-11-13T11:29:59+08）
- 落面：`src/cron/alarm.ts`（核心：evaluateMissedRun/evaluateFailedRun 双判据纯函数+stepCircuit 熔断电路+createCronAlarm 独立 timer+createHttpNotifier+deliverWithRetry 3 次退避 1/5/25s）+`alarm-smtp.ts`（nodemailer 主形·依赖隔离）+`alarm-wiring.ts`（env→实例纯映射·零通道 disabled）+env.ts TRIRMC_ALARM_* 键族+app.ts 接线（随 cron 服务启停·cronEnabled 同门）
- N 值表终定值代码化：grace/败跑窗/dedup=30min·稳定窗 3 拍重臂·**复位不清窗锚**（stepCircuit 重臂只置 armed·绝不清 lastAlarmAtMs——TriMLC 11-12 窗病灶回归锚专测案 1/案 2 同款）·tick 60s
- 优先序：missed-run 优先于 failed-run（单 job 单 tick 至多一条·败跑信息随 event.detail 携带防双告警噪声）
- 单测 **25/25 绿**（test/cron/alarm.test.ts：判定矩阵 11 案+熔断双案+tick 环 4 案+HTTP notifier 真端点 2 案+退避 2 案+N 值表对表+D-46 零回显断言）·cron 全测试面 **61/61 绿**·tsc check 绿
- 事件投影零 payload/command 回显（D-46 断言在测）；凭据全走 env 注入零日志值面
- 挂账知情：daemon 全死盲区（本闸同死）——外部探针留后续阶段（方案稿 §三.4 照载）

### 件②preflight 薄壳+算周双闸

- **TriCompany commit=64e71d9fda**（2026-11-13T11:30:08+08）
- 落面：`runtime/cognition/preflight.py`（四断言+退出码表 0/2/3·4 保留）+`test_preflight.py`（21 单测）+`weekly_plane_shift.py` γ 二道闸（validate 步后旁挂 toWeek 对表断言·synthesis §二3 改判并入）
- 四断言：①分叉预检=import 复用 `_preflight_bare_sync`（单点真源不复制）②hostname 硬校验（DEFAULT=iZf8ziw57ydktu77fsld9yZ 河源 α 窗实锚·env 覆盖位 TRICO_PREFLIGHT_EXPECTED_HOST）③git 卫生（MERGE_HEAD/rebase 探针+porcelain **--untracked-files=all** 逐文件·迁移面路径过滤非空即拦·其余脏不拦）④8710 healthz（timeout 5s·ok!=true 即拦）
- 算周双闸 γ 主闸：触发日周日边界断言+三值重算比对（week-math 同族 python 侧 isocalendar——**实勘定谳：TriRMC command-handler.ts L71 每拍 computeWeekShiftTokens 实时展开占位符**，非注册时烘焙——同机同时钟重算比对基线成立）
- 退出码语义：0 全过/2 断言族（hostname/脏/healthz/算周）/3 分叉拦（现役语义原样·diverge 优先于断言族）/4 保留（现役 notify_failures 语义·本模块零外发——告警由 bash 链尾 shift_notify_fail 现役链承担，防双重告警）
- 单测 **21/21 绿**：金值案（周日/跨年 wrap W53→W01/中间周幂等窗）+真 bare 仓分叉案（exit 3 实测·DEM-009 注入式拦截同款精神）+healthz 真端点三态+git 卫生四态
- 二道闸验绿：AST+import 双验（逻辑嵌 main·专测候 11-15 轮实锚+验收锚④ COO F4 拦截演练收口）

### 件⑤F5 观测投影形（c2）

- 落面：agent-core `job-store.ts` 新增 `resolveStorePath()` 导出（纯读零行为变化）+index.ts re-export+**dist 重 build**（符号链接拓扑·tsc/tsx 类型走 dist——初跑 TS2305 即此因）+TriRMC healthz 新增 `storePath`/`logPath` 字段+启动日志一行（与 healthz 同源）
- 回归：agent-core scheduler **69/69 绿**·TriRMC cron **61/61 绿**·TriRMC check 绿

## §二 施工日两实勘新知（如实入卷）

1. **token 展开机制定谳**：payload `{fromWeek}` 系占位符在每拍 fires 时由 command-handler 实时展开（week-math 同函数）——预研初疑「注册时烘焙静态值会致算周主闸恒拦」，实勘排除。
2. **porcelain 目录折叠坑**：`git status --porcelain` 对全未跟踪目录折叠成 `?? docs/` 单行——迁移面路径过滤初版漏检（测试抓住）；修= `--untracked-files=all` 逐文件展开。
3. **测试环境两坑随卷**：undici fetch keep-alive 连接拖事件循环（test 子进程不退出）→ `server.closeAllConnections()` 正形；`git -C <不存在路径> init --bare` 128→路径参数形正形。

## §三 窗序与部署姿态

- **零生产触面声明**：三件代码全在仓内（TriRMC/TriCompany 本机检出）——河源生产 jobs.json/迁移器现役形零改动（11-15 前唯一允许改形=α 已于昨日落·单窗统筹原则遵守）。
- **部署序候 11-14 午后开工门**：§九前置验真三查（①检出含本笔+P1 A 版 ②trirmc.service 活体对表 ③8712 NOTIFY 端点实位）→告警闸第一优先上线→run id+payload 终形→F5 顺手窗（代码已就绪·部署即生效）。
- **回滚姿态**：三件均为增量面（新模块+一行级接线+healthz 字段）——回滚=revert 两笔 commit+重启，零数据迁移面。
- **SMTP 凭据注入位**：trirmc.service EnvironmentFile（§九.2 活体对表后落）——值面零回显纪律 D-46 全程。

## §四 在途面知情（非本席笔·共享 index 纪律）

- agent-core `packages/agent-core/package-lock.json` 存在非本席脏面（tricode/jsdom/playwright 系依赖同步·本席 npm 调用触发重规范化）——未入本席 commit，留原状候其 owner 收口。

## 使用依据

cto-phase1-tech-plan.md 13c67aa3c（五件终裁）/synthesis.md 36bf14a1d（径批正身）/CEO 10:29 批令（81664ab9d 真源留痕）/COS 10:48 窗序提醒/代码读数=本卷 §一（两仓 commit SHA+测试读数全绿）/TriMLC power-monitor 11-12 窗先例（8fa3b97·dedup 同构+复位不清窗锚）/TriRMC command-handler.ts L71+week-math.ts（token 展开实勘）。

—— CTO 小狄（m-cto·预研段毕报），2026-11-13 11:30 CST（写前现查 2026-11-13T03:30:15Z=11:30:15+08 原值）
