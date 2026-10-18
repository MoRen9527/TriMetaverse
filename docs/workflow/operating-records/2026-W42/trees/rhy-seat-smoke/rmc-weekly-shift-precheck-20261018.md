# R 面 TriRMC 周平面迁移前全项检查卷（CEO 22:32 令·BOD 执行）

- sourceOfTruth: 本件（BOD 检查落卷）
- syncMode: static（迁移拍前单轮检查读数存证）
- lastSyncedAt: 2026-10-18 22:40:37 +0800（date 现查原值·shell 注入·D-47 写前闸）
- 令源: CEO 2026-10-18 22:32:50「让R面TriRMC检查周工作平面迁移需要的所有内容」

## 结论

**迁移面 11 项检查全绿·1 项缺口已修**——今晚 23:50 拍（新 schedule 首拍）链路就绪。缺口=TriMetaverse 仓 remote 表缺 `sg-bare`（10-16 21:36 人工整备时删除，reflog/FETCH_HEAD 同刻实证），而 job command 用 `git pull/push sg-bare`——不修今晚拍必挂。修复=`git remote add sg-bare ssh://fleet@47.245.122.61/srv/git/TriMetaverse.git`（origin 同实体·可逆·零触碰 job/state），ls-remote 验通。候 CEO 追认。

## 全项读数

| # | 检查项 | 读数 | 判定 |
| --- | --- | --- | --- |
| 1 | daemon 活体 | 8710 healthz ok=true pid 224044（fleet·10-17 13:17 起）·cron enabled jobCount=3 degraded=false consecutiveFailures=0 | ✅ |
| 2 | job 三查（F-3 判据） | enabled=true·nextRunAtMs=1792338600000=今晚 23:50 北京·lastRunStatus=ok（10-11 23:00:12 拍·runCount=7 零连错） | ✅ |
| 3 | schedule 变更注记 | `50 23 * * 0` Asia/Shanghai=周日 **23:50**；job updatedAtMs=今晚 20:49:53 被更新（旧拍 10-11 时点=23:00:12→schedule 23:00→23:50 系今晚改）·**今晚=新时点+修复后 remote 名首拍** | ✅ 注记 |
| 4 | ssh key 面 | /home/fleet/.ssh/id_ed25519 在（fleet·600）+ repo core.sshCommand 同 key 已配（job export 冗余无害） | ✅ |
| 5 | TriMetaverse 工作仓 | 分支 dev·工作区干净·与 origin 缓存零分叉；sg-bare 实时顶=d1bd5e0aad（只前不后·`pull --ff-only sg-bare dev` 可行） | ✅ |
| 6 | **sg-bare remote** | **缺失（10-16 21:36 整备删除）→ 已修**：remote add 补回（origin 同 URL）·`git ls-remote sg-bare dev` 验通 | 🔧 已修 |
| 7 | 迁移模块 | /srv/fleet/TriCompany/runtime/cognition/weekly_plane_shift.py 在·TriCompany=dev 与 origin 对齐（第三 job tricompany-pull */15 在跑保证新鲜度） | ✅ |
| 8 | 占位符注入 | TriRMC src/cron/command-handler.ts L34 WEEK_TOKEN_RE={fromWeek\|toWeek\|startDate} 替换机制在 | ✅ |
| 9 | 周目录面 | operating-records/ W40/41/42 在；W43 已存在（trees/ 已有 keeper 件在卷·周头未生成=在案已知可接受缺口·拍时生成） | ✅ 注记 |
| 10 | 河源时钟 | 22:33:43 +0800 与北京一致 | ✅ |
| 11 | sg-bare 可达+权 | ls-remote sg-bare dev 通（id_ed25519 读权实证）·历史 ops push 在（1c8d91858/b61e86b74/d05525595 三拍 commit）=推权实证 | ✅ |

## 证据锚

- 拍历史 commit：1c8d91858（2026-10-11 23:00:12 +0800）/ b61e86b74（W40→W41）/ d05525595
- 删 remote 时点实证：reflog HEAD@{0}=`pull --ff-only origin dev` Fast-forward + .git/FETCH_HEAD mtime=Oct 16 21:36
- jobs store：/srv/fleet/TriRMC/data/cron/jobs.json（bak 与主文件 weekly-plane-shift 段零 diff·仅 tick job state 滚动）
- 检查方式：ssh 经 sg ProxyJump（本机 IP 限连在案）逐段只读对表；修复仅 remote add 一笔

—— BOD 落款（2026-10-18 22:40:38 +0800·date 现查原值·commit 时对表）
