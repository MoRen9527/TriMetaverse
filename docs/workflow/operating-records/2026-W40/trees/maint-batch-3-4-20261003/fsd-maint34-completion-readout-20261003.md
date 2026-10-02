# FSD·维护批③④施工毕读数卷（10-03 连夜窗）

- sourceOfTruth: 本件（维护批③④施工卷；令源=COO 03:3x 连夜窗开工令+边界申明准裁；预勘卷=`fsd-maint34-presurvey-20261003.md` 同目录）
- syncMode: static（③复测闭环全绿+④代码修入测试门全过；均未提交=候 COO 收口批）
- lastSyncedAt: 2026-10-03T03:58+08:00（date 现查）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）

## 一、③车道：8711 优雅停实弹复测（全链闭环）

### 前置三断言（03:44:38 stop 前）

| # | 断言 | 读数 |
| --- | --- | --- |
| 1 | 监听 pid==45040 | ✓ match=True |
| 2 | 进程活态+cmdline 对表 | ✓ `node D:\Code\ai\TriRLC\dist\index.js` |
| 3 | pidfile `~/.trimetaverse/trilc-8711.pid`==监听 pid | ✓ 45040==45040（09-18 CTO 裁按 port 分文件正形在位） |

### 实弹停机（`dist/cli.js stop --port 8711` 权威路径）

- 03:44:38 发停→CLI 链：verifyPortPidConsistency 门过→POST /shutdown→**`graceful shutdown accepted but pid 45040 still alive, sending SIGTERM`**→03:44:43 `daemon stopped via signal`，exit=0。
- 验证死：8711 监听消失+pid 45040 死（03:44:45 复查 DEAD）✓。禁裸杀遵守 ✓（CLI 设计内 fallback 链，非手杀）。

### 复测两笔真发现（本窗核心产出）

1. **8711 graceful 链现役不可达（gate fail-closed 拦截实锚）**：TriRLC app.ts L1775 全局安全门「置于一切业务路由之前」（/healthz 豁免→Host/Origin 白名单→X-Internal-Token 401→其余路由）；L1800-1805 `TRILC_INTERNAL_TOKEN` 未设=**全拒 401 internal_auth_disabled**。8711 进程 env 零 TRILC_INTERNAL_TOKEN 注入（trirlc-daemon.env 九键+ps1 三 pin 均无）→POST /shutdown 实得 401→process.exit(0) 永不触发→SIGTERM（Windows=TerminateProcess hard kill，app.ts L4572 自注）fallback 完成停机。**实测停机形=设计内 hard kill，非 graceful**。
2. **CLI 误报缺陷（候选升）**：cli.ts `gracefulShutdown()`（L379-397）POST 拿到任意响应即 resolve→「accepted」——**不校验状态码，401 亦判 accepted**，log「graceful shutdown accepted」掩盖 gate 拦截真相。一行修候选（res.statusCode 检查）在 TriRLC 仓，非本窗 scope，列候升。

### watchdog 自然拉起+生验锚（全绿）

- 03:46:05 watchdog 拉起（schtasks 03:46:00 轮+5s，vbs→launch 链，与 TriMLC-Watchdog 同 5min 节奏）；停机窗 82 秒。
- 新 pid=42524，cmdline 同形；pidfile trilc-8711.pid=42524==新监听 pid ✓；healthz=200 ✓。
- **端到端生验**：daemon.log 新进程 `[trilc:keys] model relay refresh (card absent): default=GLM-5.3`——8711→本机 TriModel 3333 keys 链立即恢复（预勘卷 TRIMODEL_API_TOKEN 零修定性获端到端活体验证）✓。

## 二、④车道：updateJobRun 一行修（代码修毕，候冷起窗带出）

### 变更（TriMLC 仓，未提交候收口批）

- `src/cron/store.ts` updateJobRun 尾部（L388）补 `saveCronStore();`+三行注释（+4 行，git diff --stat 实锚 `1 file changed`）。缺陷=九调用点（timer.ts 每次 job 运行前后）唯一不刷 .json backup 的突变路径。
- `test/cron-store-backup-sync.test.ts` 新增（行为锚两例）：①post-run write 后 .json backup 携 lastRunAt/nextRunAt/lastRunStatus/runCount ✓ ②COALESCE 保旧语义（state-only 写不抹 nextRunAt=cron state 卫生同语义域）✓。
- cron state 卫生照会遵守：COALESCE 逻辑零动，零触碰 nextRunAtMs 语义。

### 全量测试门读数（623 tests：615 pass / **8 fail 全数既有·独立验毕**）

| 失败族 | 隔离跑 | 干净 HEAD baseline 对照（worktree a66b3b2） | 归因 |
| --- | --- | --- | --- |
| replay-flow.test.ts | — | **同挂** | 既有 |
| tui/components.test.ts | — | **同挂** | 既有 |
| P0 auth-gate（not ok 6，server/auth-gate-rejection.test.ts） | 挂 40/41 | **同挂同读数 40/41** | 既有（gate 向量复现测试与现行实现差） |
| roster-gating/ctx-cwd（not ok 181/182） | **19/19 绿** | 19/19 绿 | 全量并发干扰（非代码） |
| FADE-ASSESS-003/005（not ok 158/159，cron-role-gating+agent-tool-roster-gating） | **19/19 绿** | 19/19 绿 | 全量并发干扰（非代码） |

- **④域自证**：cron 族全绿（F-3 ok/cron dispatch gate ok）+新测试 2/2 过。
- **类型门 `npm run check`**：exit 2，4 error 全在 `src/config/contract-resolver.ts`(173-178)——baseline worktree 同错=**既有类型错误**（本修零类型面接触，独立验毕）。
- 对照方法学：`git worktree add`+junction node_modules 干净 HEAD 对照，用毕即清（worktree pruned+目录清零）。

## 三、技术债务标记

1. **8711 graceful 链修复候裁**（非本窗 scope）：trirlc-daemon.env 注入 TRILC_INTERNAL_TOKEN+8711 一次重启=gate 启用+graceful 可达；**影响面=/internal 全域从全拒变带令可达**，消费方（回环侧）须同步持值，涉配置变更窗裁。
2. **cli.ts gracefulShutdown 状态码误判**（TriRLC 仓一行修候选）：401/4xx/5xx 均误判 accepted——候 CTO 域或下一维护批。
3. **既有失败族候办**（非本窗）：P0 auth-gate 向量测试与现行实现差（40/41）；contract-resolver.ts 4 个 TS2322；全量跑并发干扰族（roster/FADE-ASSESS 隔离绿）——测试隔离性改善候 STE/CTO 面。
4. deepseek-v4-flash 上游 401 族+keys.json s3-backup 堆积：见预勘卷 §三候升。

## 四、禁区遵守声明

- 值面零出机 ✓（本卷全指纹形；key 名面输出过滤器已改白名单形——03:34 自报案改正落地）
- 禁裸杀 ✓（CLI 权威路径+stop 前三断言+pidfile==监听 pid 核验）
- 权威面零改 ✓（③零写面——8711 配置面实勘零漂移未动；R-HY/sg/河源三远机本窗零触）
- ④不含 8713 生效重启 ✓（COO 边界申明遵守；F-3 Part B 先例形态=代码候冷起窗）
- 邻域零触 ✓（TriMLC `?? scripts/digest-inbox.mjs` untracked 未触；restore-claude-config.ps1 在途 diff 未触）

## 五、使用依据

- COO 03:3x 开工令+03:3x 边界申明准裁+BOD #295 定性回执（值面回显案）
- 预勘卷同目录 `fsd-maint34-presurvey-20261003.md`（③证伪翻转+④定性全链）
- 实勘：TriRLC app.ts L1775-1810/L4570-4582、cli.ts L287-397、paths.ts L12-20、pidfile.ts；TriMLC store.ts L347-389、timer.ts 九调用点、package.json scripts；schtasks TriRLC-Watchdog 全字段；daemon.log 拉起段；worktree 对照三组读数
