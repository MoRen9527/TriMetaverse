# fade011-ew 合流案勘定卷 · CTO 收口（异常根因+凌晨窗形态+存量处置+阀线）

- sourceOfTruth: 本卷（fade011-ew 形态合流案·CTO 勘定正身——实施单引用面）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 勘席: CTO 小狄（m-cto）·令源: COS 复裁路由令 13:47:51+0800（BOD 异常即提 D-66 首案）+COS 合流补钉令 13:57:44+0800（CEO 根治裁决·凌晨窗一次+手动入口·落实非另议）

## 一 · 异常根因定谳（D-66 首案·证据链三锚）

**根因=watch.ts `gitFingerprint(dir)` 仓级 HEAD/refs 耦合设计缺陷 × 今日高频落卷**。非 BOD 推断的「WATCH_DIRS 含 operating-records 自激」——operating-records 不在监听域（值面活体重勘实锚），但每笔**仓级 commit**（哪怕落 docs/workflow、不在四目录）都动仓 HEAD/refs → 指纹变 → 触发一发全链。

证据链三锚：
1. **源码实锚**：TriMLC src/fade/watch.ts L115-126——`gitFingerprint(dir)` 以 cwd=dir 跑 `git rev-parse HEAD`+`for-each-ref refs/heads`，git 向上解析 .git → 返回**整仓** HEAD+全分支 refs（非监听目录子树锚）；L129-147 `computeFingerprint(dirs)` 文件 hash（仅四目录递归·排除 .git/node_modules）∪ 每目录 gitFingerprint。
2. **DB 节拍实锚**：fade.db fade_runs 45 行现势（05:59 读数）·fade_watch_audit 90 行——05:02-05:48Z 窗 20 发真 run（全 APPROVED gated=true·每发防抖 30s+轮询 30s 节拍）·RATE_MAX=2/60s 护栏在限（护栏挡风暴不挡持续白跑）；哑发 debounce-pending（同窗多指纹竞争）=窗内多笔 commit 连发吻合。
3. **commit 对表实锚**：13:25-13:48 窗 TriMetaverse 13 笔+TriCompany 1 笔 commit 与 run 触发逐发对表全吻合（13:28:39 commit→05:30:23Z triggered；13:47:24→05:47:52 pending→05:48:22 triggered；中段 60s/2 发护栏合并形态一致）。

机理注记：§8.6 条款「文件 hash ∪ git HEAD/refs」字面直译在多席高频落卷仓环境=缺仓级耦合防护——git 锚本意=勘定对象内容锚，实装把全仓活动锚定进指纹。今日 39 run 主体=每 commit 一发白跑（真勘定价值≈零：勘定对象四目录内容多数未变）。

## 二 · 形态勘定（CEO 方向落实·凌晨窗一次+手动入口）

**形态裁定：30s 实时 watch 退役（配置面关停已止血在途）→ 凌晨窗 cron job 单发 + 现成 POST 端点复用——零 TriMLC 代码改动案**。

- **触发通道**：`POST /internal/v1/fade/runs`（TriMLC app.ts L1975 现役端点·payload={runId, treeDir, idempotencyKey?}·鉴权 X-Internal-Token 同族）——cron job command=固定脚本路径，脚本内部动态 runId+POST。
- **凌晨时点勘定：每日 03:30（本机 +0800）**——D-23 v3 对轨：GLM 轨黄金段 18:00→次日 14:00 ✓·DS 轨 18:00→次日 9:00 ✓ 双轨交集内；错开整点与 bod-tick/patrol/cos-patrol 频率带；错开周日 23:50 weekly-plane-shift。勘定语义=勘定截至昨夜的全部四目录变更（「一天一次」CEO 原义）。
- **手动触发入口：`trilc cron run <job>` 现成机制**（零新代码）——按需补跑语义=同日幂等/重跑行为由脚本 runId 粒度定（实施单勘定：默认同日重跑=新 runId 带时分秒各成一树，保手动补跑真勘定语义）。
- **白名单语义实锚**（app.ts L260-272）：TRILC_CRON_COMMAND_ALLOWLIST 精确等值查 HTTP 提交 job——**〔勘误 2026-11-04T06:14:10Z〕本卷初稿判「cli 本地创建白名单不涉=零重启链」系实锚偏差，SDE 工序 2 实跑 403 抓获+源码实勘勘正（app.ts L4384/L4439=POST/PATCH /internal/v1/cron/jobs 两入口共拦 cronCommandHttpAllowed·cli.ts L946 cronRequest 走该端点→cli add=HTTP 形态必过门）——注释「本地原生创建、不经 HTTP」语义=daemon 进程内部自建，非 cli。裁定修正：白名单 18→19 条扩窄式追加（`node D:/Code/ai/TriMetaverse/scripts/fade/fade-daily-sweep.mjs` 精确等值·零通配·fail-closed 不破）+第六次重启链生效；旁路方案（直写 cron.db/schtasks 旁路面/蹭既有条目路径）安全卫生面全更差·不裁。护栏「18 条不动」随实锚勘正一并修正**。
- 脚本落点：`TriMetaverse/scripts/fade/fade-daily-sweep.mjs`（与 scripts/fade 族同构）——内部：runId=`fade011-daily-<YYYYMMDD-HHMMSS>`·treeDir=现行 ISO 周 operating-records 树（{week} 同构展开·js 侧 isoWeek 三行）·token 启动器 sed 提取先例形（值面零回显·D-46）。
- watch.ts gitFingerprint 缺陷随 30s watch 退役自然闲置——**不另开修复单**（配置面退役=缺陷面失活）； TriMLC 仓侧注记候 TriMLC 版本窗（防未来复用 watch 形态者重蹈——候治理批窗登记）。
- 回滚姿态：watch 三键原值在卷（启动器 cmd·SDE 止换单留值）——形态回退=恢复三键+重启链（10 分钟可逆）；凌晨窗 job 回退=cli cron remove。

## 三 · 39 run 存量与产物处置

- **树产物 39 目录（untracked）**：收编在链（记录面一致性优先·与段三三连真 run 同形）——git add 收编+异常窗标注（勘定卷本卷+毕报即标注面）；不搬移不清理（先例={week} 字面残留裁同构·DB checkpoint treeDir 与盘面对表一致）。
- **DB 行 fade_runs 45 行+audit 90 行**：现势记录面保留（审计链完整·异常窗证据物）。
- **白跑成本注记**：39 发全链真跑（APPROVED score 100·非空壳）——异常窗资源实烧如实呈报（token 读数候 CFO 面按 token-metering-protocol 若需核算·本卷不折现金）。

## 四 · 阀线裁定（随形态退役）

- **12 阀随 30s watch 形态一并退役**——原阀语义=实时 watch 风暴兜底；新形态结构面一天至多 1 发自动触发（cron 单发）+手动按需留痕——日触发量阀无消费对象。
- 护栏留存面：RATE_MAX=2/60s 机制保留（POST 端点直驱不途经 watch tick·该护栏对 watch 形态有效——退役后自然闲置）；手动触发滥用防护=审计链（fade_runs 行+脚本日志）+席位纪律，不另设机械阀。
- 观察窗改形：形态切换后首日凌晨窗（11-05 03:30）验证一发真触发+次日（11-06）SDE 日报核对读数——两日观察窗替代原「11-05 复裁判据日」。

## 五 · 使用依据

- COS 复裁路由令 2026-11-04T13:47:51+0800 + COS 合流补钉令 2026-11-04T13:57:44+0800（CEO 裁决原话「避开忙碌期，防与员工施工抢着同步、容易混乱」）
- TriMLC src/fade/watch.ts 全卷（L28-37 常量/L105-147 指纹引擎/L204-320 tick）·src/server/app.ts L1975-2018（POST runs 端点）·L260-272（cron 白名单）
- fade.db 活体读数（05:59Z·fade_runs 45/audit 90/watch_state 现势）
- 启动器 cmd 值面活体（WATCH_DIRS 四目录/TREE_ROOT {week}/白名单 18 条）
- D-23 v3 黄金段双轨（纪律册 L291-292/L1106）·git log 对表读数（13:25-13:48 两仓 14 笔）
- 处置先例：{week} 字面残留裁（记录面一致性）·D-47 增补款（卷面时戳正形）
