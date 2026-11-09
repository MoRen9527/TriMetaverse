# STE 复验卷 · 形二序 2（sg 轮）第一轮复验（复验读数面·判定归 CTO 七门）

- sourceOfTruth: 本卷（STE 独立复验读数正身·禁转抄纪律正形承载）
- syncMode: verify-report
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: STE 小柯（m-ste）；令源=COO 触发知会（11-05 18:16+08·hook 现戳 18:17:12 顺锚·派工单 v1.0 §四 第一轮挂账达线触发）
- 对表面: SDE 毕报卷=`sde-form2-sg-round-closeout-20261105.md`（TMV d31c434ad）·施工锚=a1fbeb9（sg TriCompany 检出）
- 复验通道: sg SSH 只读勘验（M-SG-47.245.122.61·root 登入·读数面 sudo -u fleet 保形态）+TMV 本机独立勘验——全程零写零派单（dry-run 形态·daemon 零触碰）

## 一 · 判定（本席复验侧）

**七门读数全对平·零阻塞发现**——毕报七门读数逐项独立复验一致（门 2 由旁证升级 pane 直勘·门 6 键位嵌套勘正后精确对平）·审计链（ticks/ledger/outbox）三面逐字对平·树链本机独立勘验通过·fp 三重实证闭合。三项低危观察项+一项 hash 锚勘正记档（§四）。**本席只供复验读数不判验收——验收判定归 CTO 照验收锚七门。**

## 二 · 毕报锚勘正（hash 系谱·先读）

- **sg 现顶=b914d49 非毕报锚 a1fbeb9**：reflog 实证 rebase 发生过（rpush-tmp/dev=d98529b 基上 pick 五笔·b914d49 ctime=10:10:04Z）。
- **`git diff a1fbeb9 b914d49` 零输出=树完全等价**（rebase 纯 pick·零内容漂移）·192+/129- 双 hash 各自 diff stat 精确对平·毕报 §一 数字成立。
- **定性：引锚勘正非失效级**——毕报所载读数与 a1fbeb9/b914d49 两形均一致（链节实测跑于 rebase 前形态·内容等价）；现役引锚建议=b914d49（FF push 候语义不变·仍为 d98529b 后代）。
- sg 检出 porcelain 残留两笔如实录（非施工域非本席域）：`M docs/engineering/fade-papers/FADE-001-paper-plane-shift.json`+`?? packages/agent-core/dist.bak-pre-rebuild-1004-0927/`。

## 三 · 七门复验读数（逐门对表·本席独立读数）

| 门 | 毕报读数 | STE 独立复验 | 判 |
|---|---|---|---|
| 1 静态门 | python3.8 编译过·dry-run `actionable=[]·fingerprint=4f53cda18c2baa0c·changed=false·budget 今日 0/1500000000` | **py_compile OK**（python3.8 现跑）+**dry-run 逐字对平**（fleet 形态现跑 10:24:30Z：`actionable=[]·fingerprint=4f53cda18c2baa0c·changed=false·budget 今日 token 0/1500000000｜月度 0.00 元`） | **对平** |
| 2 唤醒前置闸 | sg m-duty-cos=claude 在役（旁证） | **升级直勘**：tmux 13/13 m-duty-* 在役 ✓+m-duty-cos capture-pane 实勘=❯ 提示符+`⏵⏵ bypass permissions on` 状态条=**claude 会话框实锤**（非旁证级） | **过（直勘）** |
| 3 sg 全链轮 | 七链节贯通 | 树链：d00713da1→4101cf190→4911c7048 三 commit 祖先序 merge-base 断言 ✓+树 done（4911c7048 tree-op.json 15+/15-）✓；审计链：registry ticks 44 笔末 2 笔对平（09:55:13Z dispatch-failed「no token (fail-closed…)」trigger=hook+09:57:17Z dispatched ntf-mw3dg9mbih8l6d tmux_delivered=true trigger=hook）✓；ledger dispatches 恰 3 笔逐笔对平（09:55:10 manual fail/09:55:13 hook fail/09:57:17 hook OK·毕报「dispatches[2]」0-indexed 精确）✓；outbox：ntf-mw3dg9mbih8l6d 状态史逐字对平（accepted 09:57:17.363Z→forwarded 09:57:30.865Z→delivered 09:57:30.951Z·**attempts=2**）✓ | **对平** |
| 4 河源轮 | 挂起（CEO 17:35:44 定向） | 不涉·本卷零河源面触碰 | 挂起 ✓ |
| 5 护栏门 | dry-run changed=false·冷却窗 rc=dispatched age<1800 在码·O_EXCL 锁秒级互斥 | dry-run changed=false ✓（同指纹不重派）；冷却窗**代码实证**（L485：`eligible=(last and (last.get("rc")==0 or last_age_s>1800) and …)`——见 §四-③ 形态注）；O_EXCL 锁静态读码（O_CREAT\|O_EXCL 二轮申请+FileExistsError→陈旧判定重试）+链节 6「live dispatch window, skip」文案与毕报一致 ✓；**锁现态不存在**（shadow-plane 仅 fade-hook.lock·派单锁无=派毕即释正形）✓ | **对平** |
| 6 回归门 | healthz ok:true·degraded:true·consecutiveFailures=3·16 jobs·13/13 tmux | **healthz 精确对平**（`ok:true·cron.jobCount=16·cron.degraded=true·cron.consecutiveFailures=3`——键位在 cron 嵌套下）；jobs.json 现势 **16/16**+编排 job（id 09112290·enabled=true·runCount=3487·consecutiveErrors=0·lastRunStatus=ok·lastDurationMs=170）✓；tmux 13/13 零触碰 ✓ | **精确对平** |
| 7 回滚姿态 | revert 单笔备妥 | **单 commit 单文件实证**（b914d49^..b914d49 只动 `runtime/cognition/orchestrate_tick.py` 1 文件）→ `git revert b914d49` 单笔即全量回滚·cron 子进程形态下拍即回原形·daemon 零重启语义保持 ✓ | **备妥实证** |

**fp 三重实证闭合**：本机独立 sha256 算（`sha256("[]")=4f53cda18c2baa0c0354…` 前 16 位对平）+sg fleet 形态现跑（dry-run fp=4f53cda18c2baa0c）+毕报读数——三方法同锚。

## 四 · 本席复验侧观察项（低危·如实记档·零阻塞）

1. **`_tmux_wake` 判据经模块级全局 `tree_id_token` 传值**（L231 注释自承）——单 tick 单进程单派单场景无实际竞态实害·形态反模式记档（低危）。
2. **`body[:NOTIFY_BODY_MAX_BYTES]` 字节判长+字符切片不对称**（L244-245：`len(body.encode("utf-8"))>4096` 判字节·`body[:4096]` 切字符）——中文树路径超长时截断后仍可超 4096 字节触发 413 拒收线；现役读数未触发（DISPATCH_NOTICE 模板+现役树路径远小于门限）。潜伏缺陷记档（低危·触发条件=超长树路径）。
3. **冷却窗判据类型混写**：`last.get("rc")==0`（整数 0）与形二现形 rc="dispatched"/"dispatch-failed"（字符串）比较恒 False → `rc==0 or age>1800` 实际由 **age>1800 独自承担**（age<1800 不重派=冷却窗语义成立 ✓；age>1800 重派=提醒形 ✓）——diff 注释「rc=dispatched !=0 恒走 age>1800 分支」系自承形态非笔误；**语义成立·形态脆弱**（若未来 rc 值形态改回整数形，冷却语义将翻转）。建议候 CTO 面：显式判 `rc=="dispatched" and age<1800` 替代隐式依赖（非阻塞·形态勘修候选）。
4. **§四 四项 SDE 观察项复验侧支持读数**：①notify 主通道拾取——outbox 状态史+attempts=2 真实 ✓（forwarded 中间态在=duty-consumer 拉取形旁证；归因候 CTO）；②hook 快通道拍——cron job state 佐证（lastRunAtMs=09:48:00Z·nextRunAtMs=10:18:00Z·实测窗 09:54-09:59Z 内无 cron 拍→三拍 hook/manual 实锤）✓；③fp edge 漂移窗——代码面实证（fp_src 含全 actionable 集合+冷却窗仅在 fp==prev_fp 分支 L477 内·edge 分支无冷却窗直派）支持低危评级；④healthz 8→3——现势=3 与毕报同读数（改善面非恶化）。

## 五 · R1 静态勘验（改造面四要素对表·毕报 §一）

- **spawn 段全退役** ✓：BRIEF_V2 整段删+Popen/`claude -p` 调用链全删（diff 434 行实读）。
- **_notify_duty_cos 双保险** ✓：POST 8712 notify（X-Internal-Token 头·source=bod 白名单·target=m-duty-cos·urgent=normal·4KB 硬门防触）+_tmux_wake（send-keys→独立补发 Enter→capture-pane 验拾取→二次补发·12s 超时·失败不抛留痕）。
- **防双记账** ✓：registry ticks 行（rc/message_id/tmux_delivered）+ledger dispatches 行；docstring「本循环不再解析 usage 记账（成本面走 CFO perf 线口径）」代码面一致。
- **_harvest_usage 保留** ✓（存量幂等清账 docstring 改注·函数体与 harvested 集合跳过逻辑原样）。
- **护栏零改动** ✓：evaluate_backlog/budget_check 主体逻辑零动（护栏语义保留·读数滞后性 docstring 如实注）；O_EXCL 锁逻辑保留（新增 `mode: form2-dispatch` 字段+文案改 dispatch）。
- **token 读源 fail-closed 三级** ✓：进程 env→docker/.env fleet 副本（首个 `=` 切值段·strip('"')）→空串 fail-closed 不派单；**token 值面零打印**（D-46 ✓——本席复验同守：值面零进卷·.env 只验存在性+权限位 `-rw------- fleet fleet`+键计数=1）。

## 六 · 纪律遵守注记

- 独立复验禁转抄 ✓（全部读数本席现采：本机 TMV git+sha256+sg SSH live 读数）/全量读数+逐项对平 ✓（§三）/token 值面零进卷 ✓（.env 只 ls+grep -c 计数/outbox 与 registry 投影白名单字段/cron log 滤 header）/daemon 零触碰 ✓（纯只读+dry-run·零写零派单零重启）/序 3+4 挂起勿自触 ✓（零河源面触碰）/D-47 落款 ✓（卷面时点锚=commit 时戳）。
- 复验窗 10:17:38Z 开工锚（COO 回执 msg ab0aa4f3）—10:28Z 读数闭合。

## 七 · 使用依据

- SDE 毕报卷 d31c434ad（TMV·七门+§三 时序台账+§四 观察项）；CTO 方案卷 2427a0f3f §六 验收锚；COO 派工单 v1.0 938b8036a0+v1.1 989a92d2c3（挂起注记）
- sg 活体：/srv/fleet/TriCompany（b914d49 顶+a1fbeb9 在盘·porcelain 两笔残留如实录）/var/lib/trimc/cron/jobs.json（orchestrate-tick id 09112290）/tmp/trimc-run.log（滤 header 读）/srv/fleet/TriMMC/notify-outbox.json（ntf-mw3dg9mbih8l6d）/srv/fleet/shadow-plane/{session-registry,cost-ledger}.json（投影白名单）/srv/fleet/TriMMC/docker/.env（存在性+权限位）
- 本机独立：TMV 树链三 commit 祖先序+sha256("[]") 独立算
- 纪律：D-47 信面落款/D-46 值面禁打印/D-24 机位断言（M-SG 正名·活体现探）/跨机只读勘验通道
