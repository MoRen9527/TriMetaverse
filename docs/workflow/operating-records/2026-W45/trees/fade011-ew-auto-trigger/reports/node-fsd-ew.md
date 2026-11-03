# node-fsd-ew · FADE-011 event-watch 自动触发立窗节点收口报告

```json
{
  "nodeId": "node-fsd-ew",
  "agent": "FSD",
  "startedAt": "2026-11-04T04:27:18+08:00",
  "finishedAt": "2026-11-03T20:48:31Z",
  "baselineCommit": "TriMLC@dev 79c011f (S5.1 交付态基线·stash 对照基准) + TMV@dev 1eec3a414 (立窗 brief 正身)",
  "trigger": "CTO 小狄 D-15 派工令（信面落款 2026-11-04T04:27:22+0800·COS 径定 04:16:43·automation-backlog 立窗正式转现役）·FSD 接令回执 msg f8659ff2·本行 startedAt=brief 正身 commit 时戳锚（令源落地起算）",
  "actions": [
    "①现勘定谳：spec §8.6 全文（触发探测落地形态 v1.2.0——指纹=文件hash∪git HEAD/refs·首扫建基线 state_known·定时巡检链/即时触发链两模式·触发与执行解耦）+event-queue.db 现役件勘（daemon 通用 SSE 事件队列·0 行·零 fade 面——定谳不复用不触碰·fade 触发审计落 fade.db 独立表=§2.8 实例管载体）",
    "②store.ts 扩两表四方法：fade_watch_state（name PK·持久指纹=已处理事件记忆化·status CHECK IN baseline/ok/failed——含 failed 态记忆化）+fade_watch_audit（事件面追加·skip-same 不落防膨胀）——additive-only·S1 frozen schemas 零触碰·CREATE TABLE IF NOT EXISTS 幂等",
    "③watch.ts 新建（触发面核心）：computeFingerprint（递归 walk 跳 .git/node_modules+relpath+content sha256 聚合∪git rev-parse HEAD+for-each-ref read-only probe·非仓忽略）/resolveFadeWatchConfigFromEnv（TRILC_FADE_WATCH_DIRS+TREE_ROOT 缺一=null fail-closed·INTERVAL_MS 缺省 30000·NAME 缺省 default）/防抖两段确认（FADE_WATCH_DEBOUNCE_MS=2000 显式常量·变化首见 pending 记档→下扫同值且距首见≥窗方触发→又变重置合并到最后指纹）/速率护栏（FADE_WATCH_RATE_WINDOW_MS=60000+FADE_WATCH_RATE_MAX=2·滚动窗计数超限显面跳过）/失败语义（A 件③裁语直译：触发失败=setWatchState failed 记忆化+audit failed 行+日志显面·同指纹下 tick skip-failed-remembered 零自动重试零风暴·门拒 gated:false=合法业务态记忆化 ok 不重驱）/runId=fade-w-<name>-<fp12>+idempotencyKey=fade-watch:<name>:<fp>（幂等键族底座·createAndDriveRun 零旁路）",
    "④app.ts 五处接线：import 段+声明段（fadeWatch timer 状态+tick 串行防重入 flag——驱动链门上界 30s 可能超 intervalMs 跳拍不堆叠）+boot 段（config null→disabled fail-closed 日志显面·有→setInterval+unref timer·fail-soft 不阻启动）+GET /internal/v1/fade/watch 探针端点（X-Internal-Token 门内只读面：enabled/config/storeAvailable/watchState/audit/note 零真 run 显式标注）+stop() 清理（先停拍再闭 store 防 use-after-close）",
    "⑤test/fade-watch.test.ts 八用例 8/8：baseline 零 run（fade_runs 0 行+state 行 baseline+audit 恰 1）/端到端 APPROVED（受控文件事件→防抖→触发→十段真全链含收口门→APPROVED·树产物 treeRoot/<runId>/reports/ 贯通+幂等键对表）/防抖风暴合并恰一 run（v1→v2 重置→稳定触发·audit debounce-pending 恰 1 行）/skip-same 幂等（零新 run 零审计行）/失败语义（treeRoot 注入 ENOTDIR→failed 审计+记忆化→下 tick skip-failed-remembered 零重试→上游修复新指纹自然走·run 已建停非终态如实断言）/速率护栏（MAX=2 后 skip-rate-limit 审计行零 run·窗滑出 60s 恢复触发）/fail-closed 配置面（空 env/半键/空白 dirs=null·全键缺省值显式）/指纹 §8.6 直译（文件内容翻+git commit 翻（文件内容同）+内容还原指纹还原+确定性）",
    "⑥门禁收尾链：fade 全家 95/95（87+新增 8）+stash 基线对照+UAT 三树门 RC=0×3+TriMLC c52f5bc commit 锁笔+受控重启 SOP 全链（一并加载 S5.1+立窗件）",
    "⑦本报告落树+收口双门"
  ],
  "artifacts": [
    "TriMLC c52f5bc: src/fade/store.ts（fade_watch_state+fade_watch_audit 两表+四方法·additive-only）",
    "TriMLC c52f5bc: src/fade/watch.ts（指纹引擎+fail-closed 配置+防抖+护栏+失败语义+审计·新建）",
    "TriMLC c52f5bc: src/server/app.ts（五处接线+GET /internal/v1/fade/watch 探针）",
    "TriMLC c52f5bc: test/fade-watch.test.ts（八用例 8/8·新建）",
    "reports/node-fsd-ew.md（本报告）"
  ],
  "gateResults": [
    {"gate": "门禁①端到端自动触发实测", "result": "PASS", "detail": "fade-watch 端到端用例：受控文件事件→防抖→触发 runId=fade-w-test-watch-<fp12>→十段全自动（真全链含收口门·默认真身 skillsRoot）→APPROVED·进程级独立实例（mkdtemp 独立 DATA_DIR 零触现役）"},
    {"gate": "门禁②防抖去重断言", "result": "PASS", "detail": "风暴用例：v1→v2 连续变更合并到最后指纹·恰一 run 零重复·debounce-pending 审计恰 1 行（首见落重置不落）；幂等键族=同指纹 createRun 幂等返回 created=false"},
    {"gate": "门禁③失败可见性断言", "result": "PASS", "detail": "ENOTDIR 注入：audit failed 行+日志显面（tick FAILED）+指纹记忆化 status=failed→下 tick skip-failed-remembered 零自动重试零新 run——A 件③裁语最严解兑现；门拒 gated:false=ok 记忆化同指纹永不重驱"},
    {"gate": "门禁④速率护栏断言", "result": "PASS", "detail": "真触发×2 填满 MAX→第 3 变化 skip-rate-limit（审计行+显面日志·零 run 创建·fade_runs 恰 2 行）→窗滑出（>60s）恢复触发——滚动窗语义两向实锚"},
    {"gate": "门禁⑤全量回归", "result": "PASS", "detail": "fade 全家 95/95 RC=0（原 87+新增 8·含 kill-drive 两轮实锚）；stash 基线对照=基线 79c011f 5 败名单 vs 含改动 6 败——5 条逐行全同（replay-flow/notify 修复批③/P0 通道/ASSESS-005×2/TUI）+新增 1 条时敏归因（修复批③ notify=5ms interval+80ms 窗轮询计数断言·全量负载下 tick 挤压计数差 1·三证：单文件三连 24/24 全绿+失败形态计数差 1+改动面零交集——文件集变化改变 worker 负载分布暴露的负载敏感既有败·非代码面新增）；UAT 三树门 RC=0×3（--tree-dir runs/fade011-uat-0N/reports 正形）"},
    {"gate": "门禁⑥真环境加载面", "result": "PASS", "detail": "受控重启 SOP 全链（2026-11-03T20:47:10Z 窗·cron idle 勘 20:47 tick 毕后动手）：watchdog Disable→token 门 POST /shutdown {ok:true}→port 8713 FREE（attempt 1）+旧 pid 32876 退→npm run build 显式工序（dist/fade/watch.js 11020B+skill-loader 含 loadFade011Skills/resolveTriSkillAgentsMd=S5.1+立窗件一次进 dist）→Start-ScheduledTask 冷启→healthz GREEN ~2s+uptime=10s 重置+cron 16 jobs degraded=false→新触发面探针 GET /internal/v1/fade/watch={enabled:false,config:null,storeAvailable:true,watchState:[],audit:[]}——fail-closed 显面兑现（现役无 TRILC_FADE_WATCH_* env·零扫描零触发·零真 run 显式标注）→watchdog Enable State=Ready 收尾；新 pid=32928≠32876 对表"},
    {"gate": "编译面", "result": "PASS", "detail": "tsc 零错（store 扩展/watch 新建/app 接线三轮 build 全绿）"},
    {"gate": "纪律·零触现役（重启除外）", "result": "PASS", "detail": "测试全在独立 tmp（mkdtemp 独立 DATA_DIR/watch 目录/tree 根）；现役 8713 仅 §二受控重启 SOP 全链触碰（逐步断言·cron 16 jobs 前后一致 jobCount degraded=false）；D-46 值面零回显（token 变量计数形 len=64）；D-47 卷面时戳=commit 时戳代零手打"}
  ]
}
```

## 实现方案

触发面=spec §8.6 定时巡检链的 daemon 侧落地：interval 为调度器，tick 内「指纹扫描→变化判定→防抖两段确认→速率护栏→createAndDriveRun 幂等触发」状态机推进；run 驱动全链复用 S5 件零旁路（runId/idempotencyKey 从指纹派生=幂等键族底座双保险）。持久记忆化归 fade.db fade_watch_state（含 failed 态——同指纹零自动重试），事件审计归 fade_watch_audit（skip-same 不落防膨胀）。

**触发规则显式化兑现**：env 三键（TRILC_FADE_WATCH_DIRS/TREE_ROOT 缺一不可+INTERVAL_MS/NAME 可选）缺省全关=fail-closed——触发面存在但无显式配置即零扫描零触发；§8.6 未覆盖的业务映射（哪些路径触发哪些 run 形态）零发明，部署面显式接入才显式启用。

## 异常与处置

1. **失败语义用例首跑断言败（测试抓获·语义如实修正）**：ENOTDIR 注入后 fade_runs=1 非预期 0——createRun 先于驱动落行，treeDir 坏=「run 已建停非终态后驱动失败」非「run 未建」。处置=断言改如实（run 已建非终态+watch 层零重驤断言）；卡死 run 归 §8.1 resume 显面（boot sweep 一次性显面非 watch 重试语义）——watch 层承诺=同指纹零重驱零风暴（failed 记忆化兜住），两语义分层如实注记。
2. **UAT 三树门命令形态两错（self-caught）**：首跑误用 fade 版 node-report-check.py（缺 --tree-dir 报 usage）→改 --tree-dir 传 run 目录（tree-op.json 不存在 FileNotFoundError）→勘 transcript 正形=`--tree-dir <run>/reports`（段报告目录 glob 单层）→RC=0×3。教训：门复跑先对上窗命令形态（transcript 现勘）非凭记忆重构。
3. **全量回归 1 条差异行归因（纪律链全走）**：修复批③ notify 失败计数（基线过/含改动两连败）——非 flake 定谳靠全量复现触发深查：单文件三连 24/24 全绿+失败形态（计数现=2 差 1·5ms interval+80ms 窗轮询断言）+改动面零交集三证→定谳文件集变化改变 worker 负载分布暴露的负载敏感既有败，非代码面新增。
4. **CIM pid 查询两形落空**：CommandLine match 两版均空回——换 Get-NetTCPConnection 端口属主法直取 pid=32928。旧基准 32876 gone 独立断言兜住对表。

## 断点交接

- TriMLC c52f5bc（dev·4 files +745）·fade 全家 95 用例全绿·UAT 三树门 RC=0×3。
- **现役栈=两件已加载态**（2026-11-03T20:47:10Z 受控重启·pid 32928）：S5.1 plan 真身接线+event-watch 立窗件一次进 dist——探针读数 enabled=false fail-closed（零真 run）。
- **候裁面（CTO/业务侧）**：watch 接入哪些目录的业务映射未定——env 三键显式配置即启用（例：TRILC_FADE_WATCH_DIRS=D:\\Code\\ai\\TriCompany\\source-agents+TRILC_FADE_WATCH_TREE_ROOT=<树根>）；本单零自行发明（brief §一.3）。
- 技术债台账：event-watch（本窗兑现**销项**）——余四：门拒重试通道（候 automation-backlog 终裁）/python env knob sg 移植/TriMLC pushurl 候批/failed 记忆化卡死 run 的 boot resume 显面为一次性非持续告警（低优·可观测面已有 audit 行）。

## 自测结果

- 门禁六条全过（读数见 gateResults 八条）。
- fade-watch.test.ts 8/8；fade 全家 95/95 RC=0（含 kill-drive 两轮）。
- stash 对照：基线 5 败逐行复现+1 时敏三证归因零代码面新增。
- UAT 三树门复跑 RC=0×3；重启 SOP 十步全断言绿（探针读数 fail-closed 全对表）。

## 技术债务标记

1. **watch 业务映射候裁**（非债·划线如实）：触发面 fail-closed 在役、接入配置候 CTO/业务侧显式定——本单禁自行发明。
2. **防抖 pending 内存态**（设计取舍留痕）：daemon 重启丢 pending 无害（下 tick 重 pending 重走窗·持久指纹状态归 store 表）——若未来要求跨重启防抖窗连续性，属架构扩展候裁。
3. **时敏测试族**（既有·如实注记）：power-gate 修复批③ 5ms 轮询断言在全量负载下偶发——修复属 power-gate 面（放宽窗/提高 interval）候该面 owner 窗，不入本单。

## 使用依据

- 立窗 brief 正身：`docs/workflow/operating-records/2026-W45/trees/fade011-ew-auto-trigger/brief.md`（TMV 1eec3a414·任务五件/gate 六条/范围划线/施工纪律）
- 法条：spec §8.6（event-watch 触发探测落地形态 v1.2.0）+§8.1 十段链批认正身 be0fe20+§2.7 收口门/报告合同
- A 件③裁语（2026-11-04 定谳）：门拒不自动重试·失败显面禁静默禁重试风暴
- S5 幂等入口：createAndDriveRun（TriMLC d7129a1 交付面·S5.1 79c011f 递补）
- 重启 SOP：勘修窗 2026-10-11 正形+UAT 两遍实战法（npm run build 显式工序/pid-CIM 对表/探针收尾）
- 纪律：D-65 写码自查+D-46 值面零回显（token 计数形）+D-47 时戳铁则（卷面=commit 时戳代·信面=写前现查粘贴）
