# FSD P1 施工毕报 · 迁移失败告警面+preflight 断言（改点 A/B/C 全毕·候 CTO 终验）

- seat: FSD（小全·m-fsd）
- 写前现查: 2026-11-10T13:27:01Z（21:27:01+08 原值）——卷面时戳=commit %cI（D-47）
- 令源: CTO P1 任务书（TMV fa69fcd9d·窗 20:00-24:00）+CTO 中途报裁定回执（21:0x）+COS 双址通道裁断（21:15）
- 施工对象: R-HY FADE-001 周迁移链（weekly_plane_shift.py+TriRMC 9c81c7ec+新模块 shift_notify_fail.py）
- 止损线对表: 迁移五段函数体零改动 ✓·jobs.json 其他 job 零触 ✓·8713/8711 零触 ✓

## §一 实现方案（改点 A/B/C 三件·CTO 分工表述原文在卷）

**CTO 裁定②分工表述指令原文（毕报与收口卷须明确）**：

> **改点 C（|| 兜底告警）=链跑路径主防线**（覆盖 exit 128 静默本体）·**改点 A（preflight）=手动入口拦截+链改形后纵深+分叉预检落卷可读**（status=preflight-fail 轮次辨析）——两改点缺一不可非冗余。

- **改点 A（preflight 分叉闸·python 层）**：`_preflight_bare_sync()` fetch-only 对表（fetch→rev-parse 双顶→rev-list --left-right --count）→`_diverge_verdict()` 纯函数四态（synced/ahead/behind/diverged）→**left>0 拦**（notify blocking+最小 ADE 落卷 status=preflight-fail+exit 3）·fetch/count 失败同拦（不硬跑未知态·exit 3）·纯 behind/已齐放行（pull --ff-only 二道闸保留不动）；仅 `--sync` 真跑 gate（dry 零摩擦）；`_find_repo_root` 走 .git 祖先零 subprocess。
- **改点 B（告警双址+blocking）**：`_resolve_notify_to()`=env `WEEKLY_SHIFT_NOTIFY_TO` 逗号分隔优先→`WEEKLY_SHIFT_SMTP_TO` 兼容回退→[] 时落 notify config default_to（现役单址·COS 裁断维持不动）；`_notify_blocking()`=重试 1 次·重试成功返 []（终态语义）·仍败返 failure records·import 失败返 attempt=0 import_failed·never raises；main() 重排 notify 先于 ADE 写盘→notify_failures 并入 ADE 顶层→exit 4=重试后仍败（优先于迁移 fail 的 1）。
- **a2 防覆盖**：`_write_shift_ade_rotating()` 写前单级轮转 `.shift-ade.prev.json`。
- **改点 C（|| 兜底·shell 层）**：新模块 `shift_notify_fail.py`（66 行）+PATCH 链形落位：
  `(原 && 全链) || { E=$?; cd /srv/fleet/TriCompany && python3 -m runtime.cognition.shift_notify_fail --chain-exit "$E"; }`
  ——E=$? 先抓防 cd 覆盖；bash -e 与 || 兼容（命令失败形兜底接手）；阶段探=两检出 HEAD/脏面只读快照（零 token·值面禁密）；兜底自身告警发不出→stderr json+return 5（可观测）。

## §二 代码变更清单（三 commit 锚）

| commit | 内容 | 位置 |
|---|---|---|
| `464764253` | 探勘读数卷（三探+基线+病灶活体 45h+施工序修订对照） | TMV 树 fade001-failsafe-window-p1/ |
| `b67a19a939` | 改点 A+B（六处 Edit·imports+新函数块+main 前置 preflight+尾块重排）+单测新件 18 案 | TriCompany runtime/cognition/ |
| `1f3b997` | 改点 C（shift_notify_fail.py 新模块 66 行） | TriCompany runtime/cognition/ |

- 勘正注①：任务书 §二① L211-213 系 `push_trilc_notification` 死代码（main 零调用点）——真告警面=`_notify_shift`；死代码不删（diff 最小化）·实锚已获 CTO 采认。
- 勘正注②：TriRMC cron **无 ALLOWLIST 闸**（部署版 src/cron 零命中+活体 POST/PATCH/DELETE 全链 201/200/ok）——改点 C 走 PATCH payload.command **即生效零重启**·勘修窗重启链整段豁免·回滚=PATCH 回原串（同样零重启）·实锚已获 CTO 采认批准。
- PATCH 后链形 cmd_len=**809**（jobs.json 现役对表原串 809 前缀+兜底尾）·三查绿（id=9c81c7ec/enabled=1/next_run 值面=周日 23:50 拍）。

## §三 自测结果

1. **单测 18 案全绿**（`runtime/cognition/weekly_plane_shift_validation.py` 新件·任务书四类判据门全覆）：
   - 分叉判定纯函数 5 案（0/0 synced·0/N behind 放行·N/M diverged 拦·N/0 ahead 拦·解析容错）；
   - `_preflight_bare_sync` 编排 4 案（放行双态/diverged 拦截+readback 双顶/fetch 失败拦/repo root 上溯）；
   - 改点 B blocking 7 案（双址 env 优先/兼容回退/空落 config/首试成/重试成=空/双败两 records/import_failed 可观测/`_notify_shift` 返 failures）；
   - a2 轮转 2 案（单级三轮覆盖序）。
2. **389 门全量回归**：438 案·**5 既有 failures 与基线不增不减**——禁转抄纪律·`git stash` 后复跑同 5 案照样 FAILED=既有定性（staffing B 批源侧在途态）·stash pop 恢复。
3. **注入三测+补测①-b（河源活体·日志铁证在 R-HY /var/lib/trirmc/cron/logs/）**：
   - **测①分叉形（链跑路径·病灶本体形）**：河源 TMV 造 eval 笔（left=1/84）→POST /run→pull `fatal: Not possible to fast-forward` exit 128→**|| 兜底接手→告警 sent→链整体 exit 0→state ok**。日志=`9c81c7ec-…__2026-11-10T13-19-01-277Z.log`（token 替换 W45→W46+pull fatal+兜底 sent+RESULT 0 全链在卷）·告警信 exit=128 收件=default_to 单址。
   - **测②链断形**：首探 `exit 7 && 前插`（shell-exit 形）=shell 直接终结·|| 不执行→兜底不接手（state=error 面红·**非真实病灶形·语义发现并档**）；修正形 `sh -c 'exit 7' && `（命令失败形）=兜底接手+告警 sent+RESULT 0。日志=`9c81c7ec-…__2026-11-10T13-21-35-009Z.log`。
   - **补测①-b preflight 手动入口形（改点 A 活体·终验第 2 查载体）**：分叉态（left=1/0 ahead）`python -m weekly_plane_shift --sync` 手动跑→**exit 3+五段零触**+ADE preflight-fail 全字段落卷（objectType=ADE_SHIFT/status=preflight-fail/reason/preflight={left,right,verdict,local_top,bare_top}/notify_failures=[]/dry_run=False/check_time·steps 键不存在=最小 ADE 零迁移字段污染）+**prev 轮转保真（prev=pass 轮 W45→W46）**+告警 sent。测毕 eval 笔 reset+现役 pass ADE 恢复+prev 清理·树净。
   - **测③正常轮回归（分段降险形）**：pull 真跑快进拉平（0/97→0/0）+`python --dry-run` 五段全绿（create/migrate/validate/agent_close=pass·carry_over=skip=dry 形幂等跳·dry_exit=0）。**catchup 真跑（周二 POST /run=W45→W46 同窗 token·carry_over 幂等性未证·树面副作用风险）裁量交 CTO**——周日自然轮=天然全链回归锚。

## §四 CTO 终验读数四查呈报（任务书施工序第 5 步）

| 查 | 读数 | 证据锚 |
|---|---|---|
| ① 三测证据 | 测①测②日志两件+告警信两封（exit=128/exit=7）+补测①-b exit 3/ADE 形/告警 sent+测③ dry 全绿 | R-HY `/var/lib/trirmc/cron/logs/9c81c7ec-…__2026-11-10T13-19-01-277Z.log`·`…__13-21-35-009Z.log`·本卷 §三 |
| ② shift-ade notify_failures 字段形 | 顶层字段落地（[] 或 failure records）·preflight-fail 轮最小 ADE 形含 notify_failures=[] | 补测①-b 活体读数+单测 7 案 |
| ③ 旧串保持可用 | **勘正②形**：TriRMC 无 ALLOWLIST=无旧串白名单面·旧串全文在 `jobs.json.bak-p1window-20261110`·回滚=PATCH 回原串零重启 | 探勘卷 §一探①+R-HY TriRMC data 备份 |
| ④ 基线对表 | TMV 检出=6860bf87b（测③拉平毕·porcelain 净）·TC 检出=1f3b997·jobs.json=9c81c7ec 链形 cmd_len=809 enabled=1·shift-ade=现役 pass 轮已恢复·备份两件在 /srv/fleet/p1-window-backups/（移树外防周日链卷入） | 本卷 §二/§三+R-HY 活体 |

**本席判定：READY_FOR_REVIEW**——代码完整·自测全绿·止损线零触·基线对表齐。

## §五 技术债务标记（识别即标记·四注）

1. **兜底接手→state ok 语义权衡**：命令失败形下链体死但兜底发信成功→job state=ok（journal 记「已告警」非「链健康」）——真值在三测日志文件+告警信+ADE notify_failures 字段面；consecutiveErrors 不再累积=健康面板对链死失明·观测面移位已如实注记，候 CTO 定后续观测口径。
2. **双席到箱候 P2**：COS 裁断双址=m-duty-cos/bod 信箱通道席名（非 SMTP 地址）——迁移链在河源·河源→本机/sg 写箱=跨机面=正是 P2 勘验域（同根因族=河源无直连）；现役 SMTP 单址（真人 BOD 可见）先行·双席到箱探针+双 message_id 锚候 P2 通道落地补发；`WEEKLY_SHIFT_NOTIFY_TO` env 位已就绪（值填两席名即通）。
3. **catchup 真跑裁量交 CTO**：周二 POST /run 真跑=W45→W46 catchup 形（carry_over 幂等性未证）——本窗裁量分段降险形（pull 真跑+python dry_run）·周日自然轮=天然全链回归锚（23:50+08）。
4. **preflight 链跑恒放行机理注**：链跑路径 preflight 不触发（pull 段先死）——分叉拦截活体仅在手动 `--sync` 入口可见（补测①-b）；链跑纵深=改点 C 兜底（CTO 分工表述原文即此机理的两面陈述）。

## §六 P3 裁定条款随卷（知会 COS 台账入账）

**「R 面工作树提交毕随手推 sg-bare·禁 eval 笔滞留工作树过夜」**——D-27 派工单护栏条款模板承载（B3 根因制度面·测① eval 笔即临时滞留例证·测毕即清）。候 COS 台账收录。

## §七 P2 勘验读数出（候 COO 排 P2）

- 隧道形态实勘：bod-dsh-tunnel=**纯 -L 单向**（本地 18710→sg loopback 8712·无 -R 反向监听）·keeper=schtasks \bod-dsh-tunnel（Interactive only）。
- 三候选：a) keeper 单点加 `-R <sg侧端口>:127.0.0.1:8713`+R-HY 经 ssh -J 拍 `127.0.0.1:<sg侧端口>` 二跳达本机 8713（**改动面最小·本席倾向读数**）；b) 河源→sg→本机显式二跳（同拓扑·sg 侧转发壳独立）；c) 本机 8713 反探河源（改动落 TriMLC=禁触区·仅列不计）。
- P2 简案定稿候 COO 排窗后另出。

## §八 使用依据

- CTO P1 任务书（TMV fa69fcd9d）§三改点清单/§四施工序/§六回滚锚+CTO 中途报裁定回执（勘正②采认·PATCH 形批准·分工表述指令·活体采认·0/84 对口确认）
- COS 双址通道裁断（21:15·m-duty-cos/bod=信箱通道席名·SMTP 单址维持·双席到箱候 P2）
- TriCompany `runtime/cognition/weekly_plane_shift.py`（b67a19a939）·`shift_notify_fail.py`（1f3b997）·`weekly_plane_shift_validation.py`（18 案）
- 探勘读数卷（464764253·三探+基线+病灶活体 45h+0/84 预演）
- R-HY 活体日志铁证两件（/var/lib/trirmc/cron/logs/9c81c7ec-…13-19-01Z·13-21-35Z）
- D-24 机位断言（三绿）·D-27 派工护栏·D-47 落款合同（写前现查 13:27:01Z 原值+commit %cI 对表）

—— FSD 小全（m-fsd·P1 施工毕报），2026-11-10 21:27+08（写前现查 2026-11-10T13:27:01Z 原值）
