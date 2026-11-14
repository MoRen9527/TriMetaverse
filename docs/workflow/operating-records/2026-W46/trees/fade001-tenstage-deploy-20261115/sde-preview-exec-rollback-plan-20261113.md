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

## §十 · B0 补录+序 4 PATCH 执行实录（毕报并笔·现查 2026-11-13T14:04:39Z）

### B0 补录（§二 PATCH 前执行项四件读数·落卷前窗采集毕）

1. jobs.json 只读备份件=`/srv/fleet/TriRMC/data/cron/preview-bak-jobs-20261113T133142Z.json`（chmod 600·5211B）。
2. repo 三面 HEAD 定格：本机 dev+sg bare dev 顶平（序 1 窗）；河源 TMV 检出 6860bf87b（11-09 旧 ops commit·谱系内严格落后非分叉·ff 可达）；河源 TC 检出 c458a17（G4 锚）。
3. runs 目录现势：妆容目录 shift-W{fromWeek}-20261113T064514Z 真最新（mtime 序·arrival present·vB 判据⑤在位）。
4. healthz=200 全绿。

### P-Gate 四查实录（PATCH 门·全过开跑）

| 查 | 读数 | 判 |
|---|---|---|
| 1 vB 基线复跑 | payload.command len=1741·md5=4f990e911c3f7147052229ebe85c16d3+healthz 200 | ✓ |
| 2 供形件毕在卷 | c7adc3725 §六三件齐（25 行全文/新基准机械值/body 嵌套终形）+CTO 跟审判词 APPROVE | ✓ |
| 3 排除项基数 | jobCount=4（weekly-plane-shift/rmc-orchestrate-tick/tricompany-pull/e1b2-window-reminder-patrol-8710） | ✓ |
| 4 TC pull（FSD 增查） | HEAD=0f1fa1f6a5a4…（=0f1fa1f 本体·Already up to date·tricompany-pull job 已先行到位）+rubric-firstshoot.json 在位+porcelain=2 既有零新增 | ✓ |

### 技术发现两笔（如实挂账）

- **token unit/proc 分叉**：systemctl show Environment 面 token=218 字符 vs daemon `/proc/<MainPID>/environ` 面=64 字符——unit 版试打 401·proc 版试打 200。**PATCH 正形固化=proc env 直读**（daemon 实际鉴权值面）——B0「token systemd 取径」表述勘正为 proc face。unit 面滞留旧值=unit 文件与运行态漂移·候值席顺手窗勘修（非本预演阻塞项·零触面）。
- TMV sg bare 顶并行前进：preflight pull 得 1279b710d（>c7adc3725·祖先链断言两发 OK=含供形件 e938db317 在谱系）——payload run 时 L16 幂等重拉对齐当时顶=设计内零阻塞。

### preflight 实录（本卷 §四+供形件 §二.7 遵行）

- TC pull --ff-only origin dev：Already up to date·HEAD=0f1fa1f6a5a4…·rubric 在位（P-Gate 4）。
- TMV pull --ff-only sg-bare dev：HEAD=1279b710d·**porcelain=0**（W47 隔离后全清·强于断言②tracked clean）。
- W47 隔离（CTO §二.7 命令形逐字）：mv rc=0→`/srv/fleet/preview-quarantine/2026-W47-20261113T140154Z`；断言① operating-records 下 W47=CLEAN ✓；断言② tracked clean（porcelain=0）✓。

### PATCH 实录（生产触点①·V1 节点全绿）

- 传输链：`git show c7adc3725` 抽 §六.3 代码块（25 行）→本机归一复算 **len=2750·md5=4e1c7df5c78e083a77a0be7f2a371672 与 §六.1 新基准同串**→scp（-o ProxyJump 路由）传河源 `/tmp/cmd-tenstage.txt`→河源 md5sum 终验**同串**（零变形通道）。
- 构造（FSD §六.1 正形·禁直贴）：python assert fail-closed（len/md5 对表不符即 abort 零 PATCH）→json.dumps body（`{"payload":{"command":…,"cwd":"/srv/fleet"}}`·2936B）。
- **PATCH 发出时刻=vB 判据族暂停窗起点：2026-11-13T14:03:59Z**（date 现查原值·curl 前现打）。
- **PATCH_http=200·resp ok=true**（applyJobPatch payload 整换语义）。
- GET 复验（V1）：**norm_len=2750·norm_md5=4e1c7df5c78e083a77a0be7f2a371672 逐字同串**（raw_len=norm_len=2750+河源 md5sum 三验零变形）+cwd=/srv/fleet+schedule dict 原样（cron `50 23 * * 0`·tz `Asia/Shanghai`）+state.next=1794757800000 原样+runCount=14·ce=0·last=ok+**顶层 enabled=True 零漂移**（键位钉死：enabled=job 顶层键非 state 内·B0 true 同源）+updatedAtMs=1794578639550 刷新属预期（applyJobPatch 语义·patrol 回写族同理）+jobCount=4。
- 止损线：V1 过·零触发。

### 暂停窗与下序

- vB 判据族暂停窗：起点=2026-11-13T14:03:59Z（PATCH curl 发出）——「不符即报」暂停中（COS vB 锚卷暂停窗注记 34acda247 对表）；终点=R2 复原毕+本卷 §七 七条全绿毕报。
- 下序：序 5（COS 判据族换形托转·输入=本实录新基准读数 len=2750/md5=4e1c7df5…/jobCount=4/enabled=true/next=1794757800000）→序 6 W46→W47 迁移实走（V2-V6 值守·本卷 §四）。

—— SDE 小布（序 4 PATCH 收口·毕报 COS 主送+COO 知会·卷面时戳=commit %cI）

—— COO 节点验收（序 4·生产触点①·V1）：**PASS·V1 全绿零止损**——①PATCH_http=200 ✓②GET 复验新基准 2750/4e1c7df5c78e083a77a0be7f2a371672 逐字同串（本机归一复算→河源 md5sum→PATCH 后 GET 三读数同串=零变形通道验证形完整）✓③schedule dict/cron/tz+state.next=1794757800000+enabled=true 零漂移（键位钉死 enabled=顶层键·B0 同源）✓④jobCount=4 排除项基数 ✓⑤P-Gate 四查全过（含 FSD 增查 TC=0f1fa1f+rubric 在位）✓⑥暂停窗起点 14:03:59Z 落卷+COS 34acda247 锚对表 ✓⑦W47 隔离两断言过+porcelain=0 ✓。技术发现两笔如实挂账采认（token unit/proc 分叉=proc face 正形固化勘正·unit 滞留值候值席顺手窗勘修非阻塞零触面；sg bare 顶并行前进 1279b710d 祖先链 OK 设计内）——**序 4 节点毕·序 5 COS 托转解锁（二段候 PATCH 毕活体复验条件已成立）·本席值守 V2-V6**·2026-11-13T22:07:28+0800（写前现查原值·本行=落卷自签·节点验收落卷直达正形）

## §十一 · 分支 A 定谳修订（CEO 13:59:49 裁令·条件清单②·COO 派工令 14:03:39+08·本段=现行执行形覆盖声明）

> 修订性质：本段为分支 A 定谳形对前文 §四-§七 的**覆盖性修订声明**——冲突处以本段为准，前文保留=历史留痕+分支 B 备用条款载体。

### 十一.1 · payload 分支 A 零改动兼容定谳（PATCH 工序免除）

- **输入面（CTO 13:46:45 裁决域定谳·COS 转达）**：全专配完整形下 score rc∈{0,2} 二值容忍=供形件设计内形态——引擎装配毕（R-HY 装配毕报 12:27:05+08 三令面全绿·TC 顶 ddda8dcd）段 6 score rc 自然 0=实弹走通·**十阶段 payload 零改动即兼容**。
- **免除断言**：PATCH 工序免除——§四 序 6 程序**跳过任何 PATCH 步**直走（GET 复验基准不变=cmd_len=2750/md5=4e1c7df5c78e083a77a0be7f2a371672/enabled=true/schedule+next=1794757800000 原样）。
- **分支 B 备用（本轮不激活）**：若窗内装配面异常致 score rc=2 回落（engine_absent 形），payload 二值容忍仍兼容十阶段全链·托转二/换形 PATCH 序保留备用——激活须 CTO 裁定+授权面复核·本席不自行触发。

### 十一.2 · 窗态更新：今晚 00:00 后候 CEO 通知锁定（原周日 10:00 窗定废止）

- 预演拍前拉=**2026-11-15 00:00 后候 CEO 通知锁定时点**（CEO 13:59:49 裁令·COS 14:01 流转·台账 604 笔 fc8074a5a）——COS 原窗定令（周日 10:00）被本升级件取代。
- 锁定通知到达即开走：前置勘定（§四.1 三查+升锚 e4fea56+**新会签授权件生效锚验证**（d 施工+引擎装配并件·mount-gate 双闸 fail-closed））毕→POST run。
- **首拍 23:50 硬锚维持**（预演毕→R2 复原毕→23:50 cron 首拍=十阶段全链首演·毕后零回退转正——COS 三项裁令合流定谳不变）。

### 十一.3 · R2 复原判定面就位（COO 修订条款②）

- 判定序列=**预演拍毕→R2 复原毕（§七 七条断言族全绿）→换锚回 vB**（值席托转一·预告 83b77b2cd 语义一致）——§七 断言族七条基准不变（vB 1741/4f990e911c3f·B0 读数族）。
- R2 复原=**验收动作非终态**（成功路径亦回 vB·回退后 W46 态保持至 23:50 首拍前）。

### 十一.4 · B 族窗红读数保真+runCount 消耗前移条款（COO 修订条款③）

- 候拍态跨夜约 24h 稳定窗（十阶段形在役期）——**B 族窗内红读数=预演预期态非异常·保真不误报**（与 vB 判据族暂停窗语义同构·值席预告重排窗口语义版 a8fd88e81 已登记）。
- runCount 消耗前移知情：预演拍毕 runCount=14→15（首拍后=16）=预期态非异常。

### 十一.5 · 值席托转序列复核注记（COO 修订条款④）

- 托转一（R2 复原毕→换锚回 vB）：**保持在役**。
- 托转二（换形 PATCH 毕→换锚回十阶段）：**段标「分支 B 备用·本轮不激活」**（分支 A 下零换形 PATCH=无托转二触发事件）。
- 首拍预期：照 CTO v2 知情件判读表（engine_absent 预期态废止→实弹态·run_state ok≠评分 pass·verdict 卷面独立判读·哑卷≠引擎坏=设计行为）——值席窗前对表毕（a1afad0ca/9e310f5f0 两版分界注记在链）。

### 十一.6 · V2-V6 止损线与授权闸（不变+增项）

- V1 已毕（序 4 卷锚）·**V2-V6 止损线不变**——任一不符即 §六 R1-R6 回退零候门。
- 授权闸更新：预演授权 authorization.json（expiry 11-16 21:04:46）+**新会签授权件（d 施工+引擎装配并件）生效锚**双验证=开跑前置（新件首签 COS+会签 COO 生效锚 commit 在链断言）。
- 升锚面：TC 顶≥e4fea56（0f1fa1f→780730b→e4fea56 共前移 12 笔·COO 11-14 更正信记录值）——窗头部新会签小件统一升锚+施工毕统一升锚。

—— SDE 小布（§十一 分支 A 定谳修订·预案现行执行形·毕报链回 COO·零生产触遵行·卷面时戳=commit %cI）
