# SDE 预演执行预案+回退预案落卷（charter §三序 1·护栏闸②件）

- sourceOfTruth: 本卷（fade001-tenstage-deploy-20261115 树·预演执行预案+回退预案正身·回滚锚/止损线/复原判据三件齐+四程序细化）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=CEO 21:02 直连令七点（授权件 orderChain 全文锚）+charter @ 97c5ab36f §三序 1+COS 二轮催办（收信 hook 现戳 2026-11-13T21:25:26+0800·CEO 21:23 直问落卷态+令「落卷就开始跑预演」BOD 21:24 转催·a39df697f/68b298897 卷面锚）
- 授权闸①: 已开——authorization.json 双签生效锚 97c5ab36f（coSigner.signedAt 值面 2026-11-13T21:09:00+0800·expiry 2026-11-16T21:04:46+0800 机械值）
- 护栏闸②: 本卷落卷即开（COS 催办语「预案落卷=PATCH 不开→落卷即开」）

## §一 · 三件齐总纲

| 件 | 正形 | 细化位 |
|---|---|---|
| 回滚锚 | W46 快照锚 B0 五面定格（§二）——PATCH 前 jobs.json 只读备份件+活体结构面读数已实采 | §二 |
| 止损线 | 验证节点 V1-V6 任一读数不符=立即触发 §六 回退·零候门·不等 CEO 确认点（charter §二.3 逐字遵行） | §五 |
| 复原判据 | W46 态断言族七条（§七）——复原基准=vB 判据（1741/4f990e911c3f）；十阶段形新基准两分禁互判（STE 采集卷注②·a5ec899db 锚） | §七 |

## §二 · 回滚锚=W46 快照锚（B0 定格）

### B0 落卷前窗活体读数（本席独立探针·-J sg 路由·GET 只读·值面零回显·已实采）

| 面 | 读数 | 对表 |
|---|---|---|
| healthz | HTTP 200 | 活体 ✓ |
| jobCount | **4**（排除项①基数基线） | 在档 |
| 目标 job | id 前 8=`9c81c7ec`·name=`weekly-plane-shift`（连字符形·jobNameTruth 对表 ✓） | ✓ |
| payload.command | **len=1741·md5=4f990e911c3f**（vB 判据·8237d12af 锚卷逐字对上） | ✓ |
| schedule | dict{kind len=4·cron len=11（`50 23 * * 0` 值面）·timezone len=13（`Asia/Shanghai` 值面）} | vB 终态形 |
| state | next=1794757800000（11-15 23:50 首拍锚）·enabled=true·runCount=14·consecutiveErrors=0·lastRunStatus len=2（ok 形） | ✓ |
| token 取径 | systemctl show trirmc -p Environment 提取验通（daemon 进程 env·值面零回显零落盘·D-46） | ✓ |
| 判据族锚 | vB 五条=值守预期形-vB判据锚-20261113.md @ 8237d12af 在卷 | ✓ |

### B0 PATCH 前执行项（开跑第一步）

1. **jobs.json 只读备份**：`cp /srv/fleet/TriRMC/data/cron/jobs.json /srv/fleet/TriRMC/data/cron/preview-bak-jobs-<run标签>.json && chmod 600`——只读拷贝非直改现役件（patrol-clobber 教训①=禁改·备份合规）；回滚 R2 从备份件服务端提取，值面零出会话。
2. **repo 三面 HEAD 定格**：本机 dev 顶 hash+porcelain 计数／sg-bare dev 顶 hash（ls-remote）／河源检出 HEAD+porcelain——回退 R3 判异基线。
3. **runs 目录清单定格**：`ls -1t /var/lib/trirmc/cron/runs` 全列（既有 shift-* 件含妆容目录 shift-W{fromWeek}-20261113T064514Z——vB 判据⑤在位不删不 touch）——回退 R5 判异基线。
4. **arrival/alarm 面读数**：healthz 全文（degraded/cf 值面）+最新 shift-* 目录 arrival.json 在位态——回退 R6 断言基线。

### W47 产物回滚锚（迁移产物识别式）

- 迁移 commit 识别式=`ops: weekly plane shift {fromWeek}->{toWeek} run=$RUN_ID`（vB payload commit 行原形·**单 commit 形**=git add operating-records 单笔）——log --grep RUN_ID 精确识别·revert 单锚即净。

## §三 · PATCH 预演施工程序（序 4·生产触点①）

### P-Gate 三查（不过不开 PATCH）

1. **vB 基线复跑**：GET payload.command len=1741/md5=4f990e911c3f 对表——不符=HOLD 回询（基线漂移·禁蛮干）。
2. **十阶段形 payload 供形件在卷**（charter §一 CTO/FSD 份额「payload 十阶段形内容定稿+判据族供形」）——**缺位=HALT·催办 CTO/FSD 经 COS·本席不越域代拟内容**（技术裁决域·D-39 域界）。本卷落卷时点该件未在树（如实 declaring·唯一候件）。
3. **排除项基数**：jobCount=4 不变断言（零其他 job 触面）。

### PATCH 执行步

- token：服务端 `systemctl show trirmc -p Environment` 提取入 shell 变量（零回显零落盘）。
- `curl -X PATCH -H "X-Internal-Token: $TOK" http://localhost:8710/internal/v1/cron/jobs/9c81c7ec-ed76-4489-98c0-81c6601f541b -d <供形件载明 body>`——body 形=供形件载明（applyJobPatch payload 整换语义·phase2 先例 200 形·schedule/state 不动 updatedAtMs 刷新）；本席执行面零 payload 内容创作。
- 断言：HTTP 200。

### PATCH 复验步（GET）

- payload.command len/md5=**供形件载明十阶段形新基准**（两分禁互判——禁以 vB md5 判十阶段形·STE 采集卷注② a5ec899db）。
- schedule dict 原样（cron/tz 值面零漂移）+state.next=1794757800000 原样+enabled=true——applyJobPatch「schedule/state 不动」语义对表。
- 毕报 COS+COO（触发序 5 判据族换形·COS 托转值席）。

## §四 · W46→W47 迁移实走程序（序 6·FSD 护航·生产触点②）

1. **preflight 三查**：①河源检出态 porcelain=0 断言+HEAD 位（脏即停回询）②十阶段 CLI 活体在位（runtime.cognition 模块 import 探·TC 6992f64/173be2b/c458a17 sg 通道已推 declaring 锚·河源 pull 态断言）③sg-bare 连通探。
2. **手动实走触发**：POST run 端点（daemon API 家族同构形·活体现勘端点为准）——CEO 令③「现在手动实走」明示+授权触点②「手动触发零 cron 改形」承载；403 类拒绝=如实报不绕行。
3. **终态轮询**：state.lastRunStatus=ok+run dir 增量（shift-W46-<ts> 新目录·runsRoot=/var/lib/trirmc/cron/runs）。
4. **产物三面**：run dir 日志族（manifest/preflight/shift.log）／sg-bare dev 顶=ops commit（run id 对表）／本机 fetch+merge 对齐（SOP·冲突即停）。
5. **arrival touch**（防 alarm 误触发）：照 vB 判据③ SOP 命令形 mtime 序（`ls -1t … | grep '^shift-' | head -1`·禁字典序）落预演 run dir arrival.json。
6. **预演读数收卷**：declaring 三列（完成/候件/缺口·如实不虚标）。

## §五 · 验证节点与止损线（charter §二.3 细化）

| 节点 | 判据 | 不符动作 |
|---|---|---|
| V1 PATCH | 200+复验全过（新基准+schedule/state 零漂移） | 立即 §六 回退 |
| V2 preflight | 三查全过 | 立即 §六 回退 |
| V3 run 终态 | lastRunStatus=ok·ce=0 | 立即 §六 回退 |
| V4 产物三面 | run dir+sg-bare ops commit+本机对齐 | 立即 §六 回退 |
| V5 alarm 面 | 预演窗内零误触发（fail 告警链触发=设计内如实记录·非误触发） | 立即 §六 回退 |
| V6 排除项 | jobCount=4·零其他 job 触面·零非授权生产面变更 | 立即 §六 回退 |

**止损优先于一切确认点**——任一 V 不符即执行 §六，零候门（charter §二.3 原文遵行）。

## §六 · 回退复原程序（序 10·双触发路径）

- **R1 触发**：A=止损路径（任一 V 不符·立即）；B=成功路径（序 9 CEO 确认毕·CEO 令④→⑤序）。
- **R2 payload 回 vB**：B0 备份件服务端 python json 提取 payload.command（值面零回显）→ PATCH 整换回→GET 复验 **len=1741/md5=4f990e911c3f**（复原基准=vB·两分禁互判）。
- **R3 迁移产物回滚**：sg-bare/dev log --grep 预演 RUN_ID 识别 ops commit（单 commit 形）→ `git revert <commit>`（禁 rebase·并行窗保护·精确识别禁散 revert）→ push sg-bare HEAD:dev（sg 补推窗稳定·ls-remote 双验顶 hash）→ 河源检出 `sudo -u fleet git pull --ff-only`（porcelain 先断言·脏即停回询）→ 本机 fetch+merge（SOP）。
- **R4 W47 预演产物归档**（授权排除③双承诺机制）：revert=git 历史指针保留产物（不销毁·取回锚=revert 对面 commit hash）+deploy 树落归档注记卷（载 RUN_ID/ops commit hash/revert commit hash 三锚）——「留档不销毁」+「零现役残留」同时成立。
- **R5 runs 目录预演件**：预演 run dir 落 preview 标记件（preview.json 预演态声明）·不删除；既有件含妆容目录零触面（vB 判据⑤）。
- **R6 知会**：COS（判据族复原 vB 触发锚·序 10 COS 托转面）+COO 验收。

## §七 · 复原验证判据（序 11·W46 态断言族·STE 复核）

| # | 断言 | 基准 |
|---|---|---|
| 1 | payload.command len=1741·md5=4f990e911c3f | vB（8237d12af） |
| 2 | schedule dict 原样+state.next=1794757800000+enabled=true | B0 读数 |
| 3 | jobCount=4 基数不变 | 排除① |
| 4 | 三面（sg-bare/本机/河源）ops 预演 commit 零在顶·W46 现役周平面内容态对表 B0 快照（**内容态判·非 HEAD hash 等值**——revert commit 在顶=预期如实注） | B0 §二.2 |
| 5 | runs 既有件零扰动（妆容在位·预演件带 preview 标记） | vB 判据⑤ |
| 6 | alarm 零 active alert+healthz 200 | B0 §二.4 |
| 7 | 判据族 vB 锚在卷为复原判定面 | 8237d12af |

全绿=复原毕→SDE 毕报+STE 复核读数（双席独立·硬门非作者单方）→COS 收卷（序 12）。

## §八 · 护栏与通道纪律（charter §二.5 遵行）

- R-HY 全程 `-J sg` 路由（直连限 IP）；github 段遇 reset 即停候下窗不轰炸·sg 补推窗稳定在开。
- D-46 值面零回显全程（token/payload 值零出会话零落卷·毕报禁 dump payload 原文）。
- 零裸杀 daemon·零 jobs.json 现役件直改（PATCH API 正形）·零 stash/rebase 并行窗·commit 精确 pathspec+署名规约·推后 ls-remote 双验。
- 两面皆研发环境措辞纪律（禁称生产部署）；生产触点动前双闸态复断言（本卷落卷后授权闸①护栏闸②齐=开）。

## §九 · 使用依据

- charter dispatch-plan-coo-20261113.md @ 97c5ab36f（§三序 1/4/6/10/11+§二止损线/通道纪律+§四回退预案要点）
- authorization.json（scope 四触点+排除四·jobNameTruth·双签生效锚）
- 值守预期形-vB判据锚 @ 8237d12af（五条 vB 族）
- cto-phase2-build-closeout.md（PATCH 通道先例·job id/applyJobPatch 语义/17:0x 部署读数·锚引用）
- payload-vB-draft.sh+vA1 投影件（迁移 commit 形/运行面事实基座）
- declaring-20261113.md @ a4e1ed1cc（十阶段实现基座+候件列）+STE 采集卷注 a5ec899db（两分禁互判）
- 本席活体探针实录（§二 B0 读数·落卷前窗）

—— SDE 小布（毕报=COS 主送+COO 知会·卷面时戳=commit %cI）

—— COO 验收：**PASS**·三件齐验真毕（回滚锚 B0 五面活体实采·vB 1741/4f990e911c3f 逐字对上／止损线 V1-V6 零候门·charter §二.3 逐字遵行／复原判据七条·本席减负最小三断言全覆盖+两分禁互判采 STE 注②正确形）·P-Gate② 候件（CTO/FSD 供形件）如实 declaring 采认·不越域代拟正形确认——**护栏闸②开·双闸全开**·序 1 节点验收毕·2026-11-13T21:31:15+0800（date 现查原值·本行=落卷自签·节点验收落卷直达正形）
