# LG-055 先导备料段 A 读数卷（CTO，2026-10-02 夜窗）

- sourceOfTruth: 本件（LG-055 claude 会话层恢复先导·备料段 A 交付正身）
- syncMode: final
- lastSyncedAt: 2026-10-02 19:30 +0800（UserPromptSubmit hook 现戳 19:20:31 后本席作业窗内现查落卷）
- 令链: BOD 10-02 19:02 裁 LG-055 先导提前触发 → COO 派工（本席车道）→ 本席四环回执（荐 CMO）→ BOD 19:15 复认成立（先导=CMO 席，备选 CSO 不启用）→ 备料段 A 施工 → 本卷
- 设计基线: cto-resume-design.md（1947a718，同树）；本卷含对设计稿的三点对表修正（§四）

## 一、现役拉起链全景（备料核心勘）

| 件 | 落点 | 现役形态 |
|---|---|---|
| 席位启动器 | `.fade/launch-seat.ps1`（部署位）/ `TriCompany/scripts/ops/launch/launch-seat.windows.ps1`（真源位，禁直写，sync.ps1 单向维护） | `claude --resume <席名> -n <席名> --agent <正名> --verbose --dangerously-skip-permissions --append-system-prompt-file <compass session md>`；**env 三件套已固化 L15-17**（Remove CLAUDE_CODE_CHILD_SESSION → 清全部 CLAUDE* → 设 CLAUDE_CODE_FORCE_SESSION_PERSISTENCE=1） |
| 席位看门狗 | `.fade/seat-watchdog.ps1`（部署位）/ `TriCompany/scripts/ops/watchdog/seat-watchdog.windows.ps1`（真源位） | 13 席表硬编码；在岗判定=`(-n\|--resume) <席名>(\s\|$)` 双特征（TASK-WATCHDOG-JUDGE-FIX-01，CEO 09-22 批）；超员只警不杀；stop flag 尊重；调度=`\Seat-Watchdog` 计划任务 **约 5-6 分钟一轮**（日志实测 19:07/19:12/19:18/19:22/19:29） |
| 开机拉起 | `.fade/seat-boot.vbs` | -Bootstrap 模式包装（单 wt 窗多 tab 最小化） |
| 停止标志 | `.fade/seat-watchdog.stop` | 存在即本轮跳过（人工停止尊重面） |

## 二、先导席 CMO 现态锁定（sessions 注册面实锚）

- **运行态注册**：`~/.claude/sessions/32456.json` → `sessionId=f534f4e3-7e5b-41b1-92ff-40c12b894616`，name=`m-cmo`（nameSource=user），agent=ChiefMarketingOfficer，kind=interactive，status=**idle**，version 2.1.282。
- **进程活体**：claude.exe PID 32456 在役（tasklist 实锚）。
- **transcript**：`~/.claude/projects/D--Code-ai-TriMetaverse/f534f4e3-7e5b-41b1-92ff-40c12b894616.jsonl`（1.55MB，mtime 10-02 19:20:30——COO 预告知送达时段，静默未回陈=照序）。
- **侧车建档（交付件①）**：`.fade/seats/` 目录新建 + `cmo.session` 侧车落盘（sessionId+pid+source+双侧时点，capturedAt 19:29:11）。
- **B 段执行前必复验**：重读 `sessions/32456.json` 的 status 字段——若转 active（回陈在途工作）→ 触发顺延判据，不杀。

## 三、8711 pidfile 并勘结论（设计稿边界③，只读勘，结项）

- 代码面：`TriRLC/src/paths.ts` L14/L18-19 —— `PID_DIR = TRILC_PID_DIR ?? ~/.trimetaverse`；`pidFileFor(port) = trilc-<port>.pid` 分文件正形在码（+namespace 单测在位）。
- 运行态：`~/.trimetaverse/` 下 `trilc-8711.pid`（09-30 04:01）+ `trilc-8713.pid`（10-02 18:55）双在位，**旧单体 `trilc.pid` 已不存在**。
- **结论：09-18 pidfile 按 port 分文件裁修已全链落地（码+运行态），无补建需求，并勘项结项**。10-03 维护批③边界不受此勘影响（零重叠维持）。

## 四、对设计稿（1947a718）的三点对表修正（候 BOD/COO 认可后生效）

1. **侧车刷新源升级**：设计稿 §一「启动器写+看门狗刷新+失效时 mtime+指纹过滤」——现役实勘 `~/.claude/sessions/<pid>.json` 是 Claude Code 自维护的运行态注册面（含 name/sessionId/status/agent 全字段），**watchdog/侧车刷新改为对该面扫描投影**（name 字段匹配），比转录指纹过滤便宜且权威；mtime+指纹过滤降为 sessions 面损坏时的降级兜底（降级序②）。
2. **`--resume` 精确形态已被现役覆盖**：现役拉起即 `--resume <席名>` 命名会话形态（非 session-id）；设计稿侧车存 session-id 的价值收敛为三点——①名字损坏时 id 兜底 resume；②降级序②的种子；③恢复事件审计读数。先导实弹验证的就是现役命名 resume 链的恢复质量（L1/L2），非引入新 resume 通道。
3. **env 三件套不必再设计**：launch-seat.ps1 L15-17 已固化（清 CLAUDE_CODE_CHILD_SESSION+清 CLAUDE*+FORCE_SESSION_PERSISTENCE=1）——设计稿 §二从「新增」改记「已在位，B 段验证其在新拉起进程中生效即可」（验证法：新进程 sessions 注册 sessionId 与下线前 transcript 续接）。

## 五、B 实弹段操作单（候 COO 排窗 21:30-22:30 带；本席执刀，COO 令下才动）

| # | 动作 | 判据/读数 |
|---|---|---|
| 0 | 前置复验：`sessions/32456.json` status + 侧车对表 | status=idle 方可继续；active→顺延 |
| 1 | 快照：transcript size/mtime + 注册面留痕 | 基线读数入本卷附注 |
| 2 | 人工下线：`taskkill /PID 32456`（COO 令下执行） | 进程消失；transcript 不丢（会话层恢复验证前提） |
| 3 | 等待 `\Seat-Watchdog` 自然轮（≤6min）拉起 | watchdog log 出现「拉起缺席席: m-cmo」；新 claude.exe 进程 |
| 4 | **L1**：T+120s 新 transcript 增长 ≥1KB | 新 sessions 注册出现（新 pid，name=m-cmo）；transcript mtime 推进 |
| 5 | **L2**：断点续办消息回执 | SendMessage 名址直达新进程 + 回执（接续质量证据） |
| 6 | 降级序④演练（卡死检测，窗内时间允许时） | 窗紧可裁，COO 裁 |
| 7 | 回滚锚：任何环节失败→stop flag 临时放置+人工 wt 窗拉起（现役 boot 形态）+ BOD 通报 | CMO 恢复在位为第一优先 |

- 风险注：下线-拉起间隙 CMO 消息会排队在跨会话信道（idle 期无在途工作前提下零丢失面）；watchdog 5-6min 轮=最长恢复时延上界。
- 观察注：watchdog 日志自称「12 席」而席表实列 13 席（计数措辞陈旧，零功能影响，候 sync.ps1 维护窗顺手勘正，本段不动）。

## 六、保底交付状态

- A 备料段全件毕：现役链全景（§一）+ CMO 锁定与侧车（§二）+ pidfile 并勘结项（§三）+ 设计稿修正三点（§四）+ B 段操作单（§五）+ dry-run 等价物=拉起全串现役实锚（§一启动器行，即实弹将执行的原串）。
- readiness：**备料毕，B 段候窗**。readiness 报已发 COO。

## 使用依据

COO 派工令与复认传达（19:0x/19:2x 跨会话消息）；BOD 19:15 复认；cto-resume-design.md 1947a718；.fade/launch-seat.ps1+seat-watchdog.ps1+seat-watchdog.log 实读；~/.claude/sessions/32456.json+projects transcript 实勘；TriRLC src/paths.ts+~/.trimetaverse/ 运行态；schtasks 查询（\Seat-Watchdog 节奏）。
