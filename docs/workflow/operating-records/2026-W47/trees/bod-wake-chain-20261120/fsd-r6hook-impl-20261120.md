# FSD 毕报：R6 hook 修复三件（件①②③）施工收口

- 席位：FSD（m-fsd）/ 收口时刻（date 现查）：2026-11-19T22:23:46Z（北京 2026-11-20 06:23:46 +0800）
- 铸面依据：cto-w3i-notify-channel-survey-20261120.md（cdda4386a）修复面三件 + cos R6 终卷 §三 + BOD 径排确认（04:52 授权延伸·工序级域内径裁）
- 交付锚：TriMLC dev **fddb630**（5 文件 +682/−11）·push 断窗（443 Connection reset·既知断窗族）候窗补推
- 自测门禁：**17/17 全绿** + 全量回归 **858 pass / 5 fail=基线 5 fail 族逐字同谱零新增** + tsc check RC=0 + build RC=0（dist 产物 applyMailboxCap 命中实锚）

## 一、实现方案（三件铸形要点）

三重奏根因（5110 件堆积 / hook 全量无上限 / UserPromptSubmit 输出预算 ≈183KB 截断——旧件数组头部先输出耗尽预算·尾部新件被截断吞没，本会话 hook 注入面 184KB 洪水=活体实证）逐件消解：

- **件① 降序 20 主修**（notify-inject.cjs）：filter unread 后按 received_at 降序取最新 N（`TRILC_NOTIFY_INJECT_LIMIT` env 缺省 20）+行内截断 200 现形保持+其余未读聚合一行「另有 N 件历史未读（清理候令）」——新件可达性优先。
- **件② 注入即标读**（同件）：注入件逐件 POST `/internal/v1/notify/mailbox {message_id}`——**写面收敛 daemon 单进程同步段=原子**（hook 零直写文件，规避多进程读改写竞争族）。token=`TRILC_INTERNAL_TOKEN` env；缺→静默跳过降级；daemon down/错 token→静默（件①主修不受影响）。agent:false+响应完整收后自然回收 socket（无 destroy）。
- **件③ 存量清理+cap**（letter-store.ts + 新脚本 notify-mailbox-cleanup.cjs）：
  - `applyMailboxCap`：MAILBOX_CAP=500·落箱后超限裁最旧（received_at 升序）·被裁件先 append 归档 `*-archive.jsonl` 再裁——**归档失败=零裁剪零删（数据保全优先）**；storeLetter 返回值并入 trimmed/archived 读数，duplicate 短路零裁副作用。
  - cleanup 脚本：统计面=文件直读（纯读零竞争·分 target_seat 呈报）；写面=走 daemon 端点 markRead（并发 10 分批·**404 亦计 ok=幂等可重跑**）；`TRILC_NOTIFY_CLEANUP_DRYRUN=1` 零写形；token 缺 fail-closed exit 1。

**随件 daemon abort 防御**（app.ts markRead handler）：客户端中途断连（hook timeout destroy 形）→`for await (chunk of req)` 抛 ECONNRESET——旧形未捕获=daemon 崩级 rejection（triggerUncaughtException 崩栈诊断实锚）→try 包裹静默收尾零崩。

## 二、调试链定谳（五层真因逐剥·测试基建坑族）

1. spawnSync `process.execPath` ENOENT（nvm4w shim 面）→ spawnSync('node') 走 PATH。
2. tsx --test 编译面 `import.meta.url` 虚拟路径→TEST_ROOT 推导错 MODULE_NOT_FOUND→修 `process.cwd()`。
3. **spawnSync 阻塞父进程事件循环**→同进程 daemon 冻结→hook 请求全 timeout（hook 总时长 1.6s≈timeout 1.5s 面实锚）→修前 destroy 打崩 daemon（ECONNRESET）·修后静默 false——正形=**异步 spawn+await close**（RunResult 类型+调用点 await 化 20 处）。
4. hook `res.on('end')` 内 `req.destroy()` 强断 socket→daemon body 循环 ECONNRESET 崩级→双修（hook 去 destroy+app.ts abort 防御）。
5. **runner env 展开序 bug**：`...overrides` 在前被 `TRILC_PORT: String(appPort)` 覆盖→h5 死端口 override 失效·hook 实打活体 daemon 标读成功（「零标读」断言反转 true!==false）→修=overrides 后展开案级覆盖优先。
6. **注入面/标读面两文件错位**：daemon markRead handler 调 `markRead()` 无 pathOverride→`mailboxPath()` 每请求现读 test 进程 env（daemon 与 test 同进程）——before 钉死 suite 级 mailboxFile 而 hook child 读每案独立 fixture=5 案全败真因（h9 过因自落自验同文件）→修=runHook/runCleanup 案级重钉 test 进程 env 到本案 fixture（同文件闭环）+h9 防御性重钉。

## 三、代码变更（TriMLC dev fddb630）

| 文件 | 变更 |
|---|---|
| `scripts/notify-inject.cjs` | 件①降序 20+聚合行+件②标读 POST（agent:false·timeout 1500·token env） |
| `scripts/notify-mailbox-cleanup.cjs` | 新建·件③清理脚本（dry-run/幂等 404/fail-closed/并发 10） |
| `src/notify/letter-store.ts` | applyMailboxCap cap500+归档 jsonl+storeLetter 返回值并入读数 |
| `src/server/app.ts` | markRead handler abort 防御（for-await try 包裹静默收尾） |
| `test/server/notify-hook-e2e.test.ts` | 新建 17 案（h1-h9 端到端+c1-c3 cleanup+cap0-cap4 白盒） |

## 四、自测结果

- **新案 17/17 全绿**（真起服+异步 spawn child·含标读真链路闭环/降序聚合/多席隔离/降级四形/幂等重跑/归档失败安全钉）。
- **全量回归 858 pass / 5 fail**——5 fail 族名逐字同谱基线：`replay-flow.test.ts` / P0 通道端到端 / FADE-ASSESS-005×2 / `tui/components.test.ts`——零新增回归（863=846+17 全对上）。
- tsc check RC=0（src 面）·build RC=0·dist 产物 applyMailboxCap 命中 2 处实锚。

## 五、技术债标记

1. **daemon TRILC_PORT 缺省 8713**（hook/cleanup 同形）：daemon port 由启动器私有 env 面供（user/machine env 双空实勘）→hook env 链不可达→缺省写现役 8713。port 变更属部署面变更，届时同步缺省或设 env——候 CTO 勘修窗裁量。
2. **app.ts 同族 POST 端点 abort 防御缺位**：其他 POST 端点同形 for-await 零防御（本工单只修 markRead 一处·daemon 零改码面最小化遵行）——候 CTO 勘修窗统一修。
3. **hook lowercase 切段债**（原形继承）：worktree 目录名含大写则 seat 失配——worktree 惯例全小写现役零触发。
4. **cleanup 真跑候令**：存量 4186 件 unread markRead=不可逆写面（无 unmarkRead）×全司信箱——毕报载 dry-run 读数（详见下节）·**真跑候 COS 一令**（随 sde 重启窗可跑·幂等可重跑）。
5. **TriMLC push 断窗**：fddb630 本地已 commit·origin push 443 Connection reset——候窗补推（既知断窗族· TriMetaverse 主仓 sg 通道先例同族）。

## 六、cleanup dry-run 现势读数（真跑候令前置呈报）

（真跑前以活体 dry-run 复测后呈 COS，本节先立执行面口径：窗口 24h·统计面分席呈报·写面走 daemon 端点·ok/失败计数+幂等重跑兜底。）

## 七、使用依据

- cto-w3i-notify-channel-survey-20261120.md（cdda4386a·修复面三件铸面+施工归 fsd）
- cto-r6-verdict-20261120.md（e91ffbb36·A 段拍发侧实锤·daemon 零改码遵行）
- cos-r6-closeout-20261120.md（窗余项=hook 三件 fsd 施工）
- fsd-r6b-probe-impl-20261120.md（498f058·cp16Hex+bodyBytes 探针前卷）
- TriMLC：notify-inbox-endpoint.test.ts（起服配方先例）/ letter-store.ts / app.ts markRead handler 段
- 纪律：D-46 值面纪律（token 布尔呈报·零回显）/ D-47 落款铁则（date 现查原值粘贴）/ 自测即门禁 / 技术债如实

---
（本卷由 FSD 落卷·commit 直达通知；密钥面零嵌入·token 只出布尔面。）
