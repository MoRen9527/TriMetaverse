# i5 verify：周日 08-16 23:00 双验收执行本（checklist 形态，非可执行程序）

> 树：init-collab-i5-first-collab（i5-2 小全准备，i5-3 小柯独立复采判定，i5-4 小狄终审）
> 依据：i5-1-20260814.md §三 + CEO 裁决 ①A（2026-08-14）+ init-to-collab-design.md §8.1/§8.2 + runbook §3/§5
> 判定时点：**08-16 23:05 后**（cron 23:00 Asia/Singapore = 北京时间无人值守自动触发，五段链完成后判定）。
> 双验收互不替代（①A）：**旧口径验证回滚安全**（已部署旧版本行为不变 + 迁移正常），**新口径验证协同**（平移测试三面走通）。两套判定各自留痕、各自 PASS/FAIL 独立记录，任一 FAIL 不吞——分别登记 OP。

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W33/trees/init-collab-i5-first-collab/verify/verify-trigger-20260816.md
- syncMode: source-only
- lastSyncedAt: 2026-08-14

## 0. 前置记录（23:00 前当场记录，不凭记忆）

| ID | 记录项 | 命令 | 记录值 |
| --- | --- | --- | --- |
| T-00a | 触发前 runCount | [服务器] `ssh sg-ecs-server "cd /srv/fleet/TriMC && npx tsx src/cli.ts cron list"` | |
| T-00b | 触发前 fleet HEAD | [服务器] `ssh sg-ecs-server "git -C /srv/fleet/TriMetaverse rev-parse HEAD"` | |
| T-00c | 触发前裸仓 HEAD | [服务器] `ssh sg-ecs-server "git --git-dir=/srv/git/TriMetaverse.git rev-parse refs/heads/dev"` | |
| T-00d | 触发前本地 HEAD | [本地] `git -C D:\Code\ai\TriMetaverse rev-parse HEAD` | |
| T-00e | 链态（决定条款 a/b） | [HTTP] `curl -s http://127.0.0.1:8711/internal/v1/init/chain/status` | |

现役周迁移 job 全量 UUID：`b00b0070-2f82-4e7d-a98c-de73e886834b`（截断形式查不到 job，runbook 教训）。

判定标注：**[本地]** = 本机执行｜**[服务器]** = 编排层（小贾）ssh sg-ecs-server 执行｜**[HTTP]** = 端点调用。证据落 `verify/evidence/20260816/`。

## 1. 旧口径四判定（独立留痕，回滚安全面）

| # | 判定项 | 命令 | 判定标准 | 证据留档 |
| --- | --- | --- | --- | --- |
| 1.1 | 触发判定 | [服务器] `ssh sg-ecs-server "cd /srv/fleet/TriMC && npx tsx src/cli.ts cron list"`；[服务器] `ssh sg-ecs-server "ls -lt /var/lib/trimc/cron/logs/ \| head -5"` | cron 23:00 自动触发（无人值守）：runCount 比 T-00a +1；per-run 日志新增 `<jobId>__2026-08-16T23:00*.log`；.shift-ade.json 产出 | evidence/20260816/old-1-trigger.txt |
| 1.2 | 迁移链判定 | [服务器] `ssh sg-ecs-server "cat /srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W34/.shift-ade.json"`；[服务器] per-run 日志尾部 | 五段链 exit 0（create→migrate→carry_over→validate→agent_close）+ W34 OP index/unresolved 生成 + W33 retire + notify 投递（QQ 邮件人工确认） | evidence/20260816/old-2-chain.txt |
| 1.3 | 部署旧版本行为不变 | [服务器] `ssh sg-ecs-server "curl -s http://127.0.0.1:8710/healthz"`；[服务器] `ssh sg-ecs-server "cd /srv/fleet/TriMC && npx tsx src/cli.ts cron list"` | healthz 200 + cron 面正常（无 consecutiveFailures 增长，cron.enabled=true） | evidence/20260816/old-3-health.txt |
| 1.4 | 本地回流 | [本地·编排层] `git -C D:\Code\ai\TriMetaverse pull sg-server dev` → `git log --oneline -3` → `ls D:\Code\ai\TriMetaverse\docs\workflow\operating-records\2026-W34\` | W34 产物本地可见 → diff 审查（`git diff --stat HEAD~1`） | evidence/20260816/old-4-pull.txt |

## 2. 新口径三判定（独立留痕，协同面）

前置：初始化全链（SELFCHECK→READY）PASS + L1-L3 确认达成（CONFIRM 通过）——由 T-00e 定条款路径。

| # | 判定项 | 命令 | 判定标准 | 证据留档 |
| --- | --- | --- | --- | --- |
| 2.1 | 触发形态判定 | 按 T-00e 择一 | **条款 a**：CONFIRM 达于 08-16 23:00 前 → 自然触发 = 首个协同工作；**条款 b**：未达 → 自然触发照常 + 确认后显式触发 `ssh sg-ecs-server "cd /srv/fleet/TriMC && npx tsx src/cli.ts cron run b00b0070-2f82-4e7d-a98c-de73e886834b"`（幂等重跑安全，runbook §3）。择一路径在本行标注依据 | evidence/20260816/new-1-form.txt + firstCollab=triggered 快照 |
| 2.2 | 首个协同工作判定（L4） | 三面证据：①[服务器] `.shift-ade.json` + fleet HEAD 前移（比对 T-00b）②[本地] pull 后 W34 产物（§1.4 同证）③研发面 W33→W34 切换（本地 TriMetaverse dev HEAD 前移 + 2026-W34 目录可见） | 迁移五段链成功 + **三面可见**全过 → firstCollab=passed 快照；任一不过 → **不写 passed**，按 runbook §5 三路径表 a「迁移成功但验收失败**不回退迁移**」补采证据重判定 | evidence/20260816/new-2-l4.txt + check 响应 + firstCollab=passed 快照 |
| 2.3 | 协同稳态判定（推荐） | [HTTP] re-sync：`curl -s -X POST http://127.0.0.1:8711/internal/v1/init/sync/run -H "Content-Type: application/json" -d '{"entry":"i5-acceptance"}'` → 重查 confirm/check + [服务器] TriMC status | L2 三值重新收敛 + L3 applied 新 bundleId（§1.3 收敛链，执行细节见 verify-l1-l4.md §6） | evidence/20260816/new-3-steady.txt |

## 3. firstCollab 快照推进（C 端点，internal localhost-only）

端点契约（i5-1 §五冻结）：`POST /internal/v1/init/ready/first-collab`，载荷 `{ status: 'triggered' | 'passed', note?: string }`。链态门：chainState == 'ready' 否则 409 `{ chainState }`。合法转移 pending→triggered→passed（passed 需先 triggered，非法转移 409）；重放幂等（同 status 重复提交 no-op 200）。

| 时点 | 动作 | 命令 |
| --- | --- | --- |
| 条款 a/b 触发形态确认后 | triggered 快照 | [HTTP] `curl -s -X POST http://127.0.0.1:8711/internal/v1/init/ready/first-collab -H "Content-Type: application/json" -d '{"status":"triggered","note":"<条款路径+依据>"}'` |
| L4 三面可见判定全过后 | passed 快照 | [HTTP] `curl -s -X POST http://127.0.0.1:8711/internal/v1/init/ready/first-collab -H "Content-Type: application/json" -d '{"status":"passed","note":"<证据索引>"}'` |

纪律：快照推进只经 internal localhost 端点；TriPilot/trilc chat 两入口只读呈现 firstCollab 状态（门禁 6 零本地执行）。C 任务未交付时（Phase D 未收口），快照推进顺延并在 OP 登记待补——**不阻塞判定**。

## 4. 失败路径

- **迁移失败** → runbook §5 异常处理表 + 四件套回退（三端 HEAD + job 态 + 本地读面）→ 幂等重跑 → 重验收。**不跨日冒险**：重跑限当日 08-16；跨日修复需编排层裁决，不冒险硬跑。
- **条款 b 触发** → 不阻塞不冒险（设计 §8.2 承诺）：自然触发照常 + 显式触发一次 + 此后回归稳态。
- **活体链路失败**（CEO 机全链未达 CONFIRM）→ 直接落入条款 b 路径，本执行本按 b 执行。

## 5. 判定登记

- 旧口径表（§1）与新口径表（§2）**各自** PASS/FAIL 独立记录，本执行本表格行直接填写（判定人/复采人/结论/时间）。
- 任一 FAIL 不吞：分别登记 W33/W34 OP（编排层）；本执行本留判定快照。
- 回退演练（08-16 白天，任务 D）证据与本节同日归档：`verify/evidence/20260816/rollback-drill/`。

执行分工：服务器侧证据采集 = 编排层（小贾，08-16 白天固定 ssh 窗口）；本地侧命令清单 = 小全（本文件）；独立复采与判定 = 小柯（i5-3，每行复采后在表格行标注）；终审 = 小狄（i5-4）。
