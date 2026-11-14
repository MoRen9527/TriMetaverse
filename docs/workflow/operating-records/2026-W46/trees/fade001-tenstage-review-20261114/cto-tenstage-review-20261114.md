# CTO 技术主审·十段全量 review 记录（review 日·2026-11-14）

- sourceOfTruth: 本卷（trees/fade001-tenstage-review-20261114/cto-tenstage-review-20261114.md·CTO 分工产出正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: COO 派工令（2026-11-14T10:16:52+08·charter-review-day-20261114.md 28bf42fdd 在链）——技术主审十段全过一遍（架构/段间衔接/技术债视角）
- 席位: CTO 小狄（m-cto·技术主审分工行）
- 铁律遵行: 零生产触（本卷全程纯读源码+tmp 落卷推演·payload/现役判据/jobs.json/daemon 四面零触）

## §一 · review 方法与范围

- 底本=impl 树 G1-G4 锚卷（6992f64/173be2b/c458a17·declaring a4e1ed1cc）+段源码十件现读（TriCompany/runtime/cognition/·0f1fa1f 形）+迁移器正身（weekly_plane.py/weekly_plane_shift.py）。
- 方法=逐段源码精读（非凭 G2 卷面转述）+段间衔接推演（判据域/执行域/对表域三面对表）+数据面实锚推演（W46 OP index 现值+四候选树 authorization 现值+plan_scope 周日形态 dry-run 纯读推演两轮）。
- 发现编号=本席 review 流水号·两栏分拣规则照 charter §四。

## §二 · 十段逐段 review

### 段 1 preflight（preflight.py 291 行·test_preflight.py）

- 骨架面：五断言（tokens 重算/week_math 周门/git hygiene/healthz/diverge）结构齐——「时点挪动错周防线」check_week_math 零 escape flag=门不豁免哲学正形（时点错位裁定卷已采认）。
- **发现 29（小·读数面）**：check_git_hygiene 迁移面路径 porcelain 过滤的路径清单为硬编码——operating-records 路径若未来迁址（如周平面目录改名）需同步两处（preflight+dce commit pathspec）·无单一真源锚。读数面知情·不拦链。

### 段 2 qualify（qualify.py 239 行·test_qualify.py）

- 骨架面：五断言（identity/run_dir 可写/git identity/alert credentials/disk≥500MB）齐。
- **发现 6（知情项·不毒）**：qualify git identity 断言（要求全局 identity 在位）与段 4 commit 步 `-c user.name=TriRMC-Scheduler -c user.email=...` 覆盖语义脱节——commit 实际不依赖全局 identity，qualify 断言偏严。双保险形态不毒（严于实际=安全向）·**栏一候选**：qualify 断言注记「commit 步有 -c 覆盖·本断言为环境健全性双保险」语义注释即可，零行为变更。

### 段 3 plan_scope（plan_scope.py 405 行·test_plan_scope.py）

- 骨架面：三分类 degrade 链+双向枚举断言 M∪K∪C=S+替身禁令+结构门写前自校验——防线族齐·§二.8 实盘勘定修正形质量好。
- **发现 4（缺陷·读数失真不拦链）**：run_plan L316-323 `item = {"entry": name, "kind": "dir", ...}` kind 恒 "dir"——散文件（.md 单件）也错标 dir（scan_trees 明明区分了 is_dir）。读数面失真·不拦链（双向断言按 entry 名不受影响）·**栏二候选**（TriCompany 现役代码面）。
- **发现 30（新·判读歧义源）**：classify_dir L106-108 `exp > now → migrate` 分支的 reason 码=`authorization_active_or_unparsable`——该码语义覆盖「未过期（active）」+「解析败（unparsable）」两态·判读歧义源（本席今日 mount-gate 判读亲历误判：凭 reason 码误推「解析败」·实际=未过期·时点敏感）。**栏一候选**：reason 码拆两态（authorization_active / authorization_unparsable）·纯读数面改动·但涉 TriCompany 现役代码=**栏二**。
- **发现 31（新·时点敏感实证）**：migrate 构成随实拍时点漂移——mount-gate-build-20261111 authorization expiry=2026-11-14T10:47:00+08，过期前后推演读数翻转（migrate→keep）。周日实拍形态推演≈1（仅 phase1-build-20261114·auth 至 11-16T10:45+08）——**plan.migrate 非静态清单·预演读数对表须以实拍时点现值为准**。知情面·零改动项。

- **发现 32（COO 会商项①并入·判据面口径差）**：plan_scope.py docstring L24 承诺「双向枚举断言：M∪K∪C=S（零遗漏）∧ 两两交=∅」·实现 bidirectional_check L182-199 只断言 migrate/keep 两集（M∪K=S ∧ M∩K=∅）·carry 集未进断言。语义面裁定：S 定义=L15「全集={from_week}/trees/ 全条目」·CARRY 行域=unresolved-items 文件（不同域·不在 S 内）→docstring「∪C=S」字面永假=表述含混非实现欠账。勘正形：「M∪K=S（trees 域双向断言）∧ C 独立解析（unresolved-items 域·带状态去向·不进 S 断言）」。**【勘正 10:4x·STE 锚定面复核后改判】**初裁栏一（纯注释零行为）——STE 复核实锚两文件系部署树 payload 供形件链（dce_steps.py=0f1fa1f 槽位①关联明文·plan_scope.py=G 系供形链）·**改判栏二「顺手清族」**（周日 deploy 树同窗改+同窗升锚）——与发现 33 勘误一并成立。

### 段 4 dce_steps（dce_steps.py 241 行·test_dce_steps.py）

- 骨架面：四步表+rc_guard 拦停+每步读数落卷+zero-diff 防线+vB 识别式消息——部署树窗生产形精化（--plan-file 勘正）已并入。
- **发现 7（健壮性·中）**：migrate 步 cmd_tmpl 无 `cd`/`-C` 前缀——`python3 -m runtime.cognition.weekly_plane_shift` 依赖隐式 cwd 继承（payload 前段 cd /srv/fleet/TriCompany）。pull/commit/push 三步均带 `-C {tmv_root}` 显式锚·独 migrate 步裸依赖 cwd——风格不一致+隐式依赖。set -e 下 cd 败会拦·但若未来 payload 重排（cd 段移位）即断。**栏二候选**：cmd_tmpl 改 `cd {tmv_root} && python3 -m ...`。——【裁词定谳·FSD 活体实证候裁 11:31·本席 11:3x 裁 A】上行候选形**锚位笔误勘正**：`cd {tmv_root}` 下 `python -m runtime.*` import 必败（sys.path[0]=cwd·runtime 包驻 TriCompany 仓 sibling 非嵌套·ModuleNotFoundError 活体实证）——正形=**`cd {tc_root} && `·tc_root=TriCompany 仓根自锚**（TC_ROOT=Path(__file__).resolve().parents[2]·河源 /srv/fleet/TriCompany 与 dev 机两机同形）·裁据=锚位随操作对象走（migrate 操作对象=TC 仓迁移器·故锚 tc_root；pull/commit/push 操作 TMV 工作区故锚 tmv_root·各锚各真源显式锚对等）+生产 payload cwd 现实一致（/srv/fleet/TriCompany trap 段同形）+零新参数零副作用（operating_root 显式参已在·cd 只影响 import 面）。案 B（PYTHONPATH env 形）案 C（tmv_root 字面形=交付已知坏步）均否决。FSD 停笔候裁=自测即门禁正形采认。归直接开工批⑥施工中。
- **发现 21/22（语义面·合并粒度粗化）**：rc_guard 只判非 0——迁移器 weekly_plane_shift 实际 rc 族={0,1,3,4}（3=分叉候裁·4=notify 面失败）全被合并为「段 4 失败」——rc 3（分叉候裁·本应路由 COS 面）与真迁移失败在 dce.json 读数面不可分·stderr_tail 唯一辨析面。**栏二候选**：rc 3/4 特判分支（rc=3 → dce verdict=halt_pending_ruling+读数标注路由面）。——【裁词定谳·CEO 11:16 直接开工令随】rc=3 特判**立**（verdict=halt_pending_ruling·读数定性保真：失败→修复链/候裁→COS 裁决链·合并=处置路由丢失；**停段行为不变**零豁免零 escape·门不豁免哲学不破）·rc=4 维持布尔拦不特判（特判稀释读数）——归直接开工批③派 FSD 施工。

### 段 5 verify（verify.py 258 行·test_verify.py）

- 骨架面：check_plan_baseline（毒化拦）/check_gamma/check_new_week_index（mtime 序取最新·妆容劫持防）/check_migrate_against_index——防线族齐。
- **发现 28（架构级·主发现）**：段 3 判据域（trees/ 文件系统层）与段 4 迁移执行域（OP index 元数据层·done 树搬家·activeTrees 清空不搬家·weekly_plane.py L282-293 白盒实锚）零机械联动——W46 index 实锚 activeTrees=[]·doneTreesThisWeek=[]（与实盘 30+ 树脱节）→首拍迁移器实迁=0 vs plan.migrate≥1→check_migrate_against_index 对表全 missing→**--strict exit 2 首拍必炸**（迁移已 commit+verify 拦→run 失败态+state 污染+R2 revert 候选）。唯一稳定 migrate 项=FADE-001 自家 phase1-build 树（自指实锚）。**已按 charter §五随发现随报 COO+COS（02:26Z 快报双发）**。
- **处置倾向 d（候会商·未定谳）**：verify 判据面勘修——migrate 条目对表域改「旧周 trees/ 目录存在性」（原地封存=「活随人带走」现役实际形态）·done 条目对表域维持 to 周 index。**栏二挂周日 deploy 树候件列零今日施工**·周日窗序 6 前施工（SDE 施工+STE 验+本席验收）。b（改非 strict）违门不豁免哲学不荐；a（迁移器扩形 activeTrees 搬家）大改动候裁。
- G2 债项 3 对表复核（义务项）：verify strict 对表域字段名与迁移器实装**一致 ✓**——架构断层在域外（判据域 vs 执行域）·债项 3 可销·升级为发现 28。

### 段 6 score_cli（score_cli.py 116 行·test_score_cli.py）

- 骨架面：probe_score_engine 三态分立（executed_ok/executed_failed/engine_absent）+J7 升级面——结构齐。
- **发现 9（预期态·知情件候选）**：runtime/cognition/ 无 score_engine.py——首拍段 6 必 engine_absent→J7 升级条目→run_state=failed。**这不是缺陷**：engine 未部署的如实反映=三态设计正形。但首拍 run_state=failed 需预对齐知情面（防「首拍红=失败」误读——实际=engine_absent 预期态+J7 升级条目=管线设计内行为）。**候 COS/CEO 面知情件**。

### 段 7 score_rubric（score_rubric.py 191 行·test_score_rubric.py）

- 骨架面：八列族+权重=100+红灯上限（C79/G59）+F2 零触发满分形——结构齐·T1_CANDIDATE_NOTES 三断言候施工验收毕生效（declaring 缺口列既有项）。
- 债面（既有）：rubric JSON 改卷窗同窗升版义务（债 2·declaring 已挂）——本席复核维持挂账·候件列照旧。

### 段 8 close_skill（close_skill.py 170 行·test_close_skill.py）

- 骨架面：scan_stage_artifacts 五件固定清单+upgrade_list_state 显式二值+五字段升级条目——齐。
- **发现 12（收口面盲区）**：scan_stage_artifacts 五件=preflight/qualify/plan/verify/score——**不含 dce.json**：段 4 失败读数在收口面盲区（链断场景 trap 告警承载·手动恢复流程读不到段 4 失败态）。**栏二候选**：清单扩 dce.json（closed_skill 六件形）+close_cli _STAGE_ORDER 同步。
- routing="候 COS" 中文常量=既有候裁面（declaring 缺口列既有项）·维持挂账。

### 段 9 close_cli（close_cli.py 98 行·test_close_cli.py）

- 骨架面：_STAGE_ORDER 六件+derive_run_state 三态（ok/failed/stale）——齐。
- **发现 13（时点自洽·小）**：六件含 close.json 自身（收口件对自己收口）——逻辑自洽无悖·注记知情·零改动。

### 段 10 notify_done（notify_done.py 116 行·test_notify_done.py）

- 骨架面：_ROUTE 三态映射+unknown 降级+best-effort 永不拦——齐。
- **发现 27（precedence 不一致）**：notify_done `--notify-to` 缺省走 config default_to·迁移器 `_resolve_notify_to` 走 env 双址谱——同 run 双通知（发现 25）两域收件面 precedence 不同源。**栏二候选**：收件面 precedence 统一（候部署树窗与 _notify_shift 双址面一起勘）。

## §三 · 横切发现（段间衔接/架构面）

- **发现 33（STE 会商并入·锚定面维度·10:4x 定谳）**：RDT 栏一两项（dce_steps.py L37 `import shlex` 死 import+plan_scope.py L24 docstring 三集形）经 STE 复核+本席实勘定谳——**两文件均在部署树 payload 供形件链内**：dce_steps.py=0f1fa1f 槽位①关联（commit message 明文「部署树窗 payload 供形件槽位①关联」·88 行变更实锚）；plan_scope.py/qualify.py=G 系供形链（G2 六件 CLI 骨架锚卷）。技术实质三层精度（STE 论证精度勘正）：①**payload md5 锚（4e1c7df5）锚对象=payload 文本串**（§六.3 25 行）——py 文件改动零漂该 md5（payload 按模块名调用不含文件 hash）——运行链面零影响成立；②真漂移面=**供形卷版本锚**（0f1fa1f/G 系记录的 py 形 vs dev 顶形）=卷面对表歧义源；③**河源 L15 pull 前置生效面**（payload L15 `git pull --ff-only origin dev`）——今日改 py 周日拍自动到河源=对周日实拍运行面的前置变更（哪怕零行为）。**裁定=改判栏二「顺手清族」**：周日窗与新会签小件同 commit+同窗升锚一次完成·今日树授权语义（review 记录面·phase1 树权 scope=席位面）不含 TriCompany 仓施工面·C1/C3 初裁栏一随之改判（口径自洽修正——charter §四「现役判据面一律栏二」宽读口径归一）。零行为影响定性两席一致（STE 复核+本席精读互证）。
- **【追认定谳 10:5x·STE 供数+本席亲验】**：780730b 已在链（FSD 施工 10:36:55+08·先于 COO 暂停令 f931e471 约 10 秒=**合法竞态已开工即停笔留档**·非违令施工）——本席亲验 diff 零行为成立（案 A 纯删 `import shlex` 一行·案 B 纯 docstring 发现 32 勘正形照录·接口/行为/参数面零触）+STE 独立验采认（dce+plan_scope 40 案全 OK+validation 438/5/1 基线零漂移）——**裁=追认 780730b 为顺手清族既成部分**；回退向否决（为两个零行为注释级改动做 revert 施工=动作比问题重·且回退本身同为 TriCompany 仓施工同样破今日授权语义·零行为既成无风险·追认成本最低）。周日树候件列顺手清族更新为：**qualify.py 注记一件（未施工·挪周日）+verify.py d 施工+供形卷升锚义务**（0f1fa1f→780730b 版本锚漂移面·并入新会签小件 scope·周日窗施工毕统一升锚——P-Gate 4 hash 锚过时面由 7b13699 先例在先·非 780730b 新增·同窗一并处理 SDE 知悉）。FSD 今日剩余施工边界重申：栏一原定义「只动文档/测试/非现役代码面」——py 本体改动今日起停（既成追认·增量零容）。

- **发现 25（双 close 域·预期态）**：ADE 面（.shift-ade.json·迁移器产物·_notify_shift 双址 blocking）+FADE 段产物域（close.json+manifest.json+notify_done）——首拍双通知并存=预期态。知情面·候首拍预期态知情件一并预对齐（与发现 9 同件）。
- **发现 24（死变量·小）**：weekly_plane_shift.py L67 `from_md = operating_root / f"{from_week}" and None` 死变量残留行——零行为影响（赋值后未用）·**栏一候选**：删行·但涉 TriCompany 现役代码=**栏二**（与发现 4 同面）。
- **发现 28 主条**（§二段 5 载·快报已发）——架构级唯一 P0 面。

## §四 · test 面覆盖盘点（债视角·STE 质量主审的旁席对照）

- 十一件 test 在位：十段各一件（test_preflight/qualify/plan_scope/dce_steps/verify/score_cli/score_rubric/close_skill/close_cli/notify_done）+集成面一件（test_tenstage_pipeline.py）——**覆盖结构无缺段** ✓。
- 缺口面=**execute 真跑链零覆盖**（债 1·declaring 既有）：G4 集成案全走 dry-run 渲染面·--execute 分支（subprocess 真跑+rc_guard 实拦+超时路径）零单测覆盖——周日预演实走即首度真值对表面（维持挂账·预演读数回填后评估补测面）。——【更新注记 10:5x】TC 24365ac（review 日栏一施工在链）已闭合**单测半边**（渲染 cmd 与 argparse 真源双源对表+execute 传递同源案）；**实走半边不变**（周日预演实走=首度真值对表面）。另 7b13699 考卷实件锚定双案（结构门+权重快照）在链——债②改卷窗升版义务不变·快照案=升版提醒机械锚。
- 缺陷面随修随补原则：发现 4/12/21-22/27/28/30 若立施工案·测试案随施工窗同窗补（各施工 owner 义务）。

## §五 · 两栏分拣稿（初稿·候 20:00 COO 收口会商定谳）

### 栏一·仓内可完善面（今日可动·禁触生产触点面）

| 项 | 内容 | owner 候 |
|---|---|---|
| C2 | 发现 31/25/9/13 知情面：首拍预期态知情件起草（engine_absent+J7+双通知+run_state=failed 预对齐·交 COS/CEO 面） | CTO 本席起草 |

（勘正注：初稿 C1（qualify 断言语义注记）/C3（plan_scope docstring 勘正）经 STE 锚定面复核**改判栏二顺手清族（发现 33）**——两文件均在部署树 payload 供形件链内（qualify.py/plan_scope.py=G 系链·dce_steps.py=0f1fa1f 槽位①关联明文）·今日改即动供形卷版本锚+河源 L15 pull 前置生效面·归栏二。栏一现仅 C2 一项（纯 TriMetaverse 卷面产出·零仓代码面）。）

（注：本席审出的其余改动项全涉 TriCompany 现役 runtime/cognition 代码面——按 charter §四「payload/现役判据/daemon 面一律栏二」铁律·全数栏二·栏一仅收非现役面。）

### 栏二·涉生产触点面（挂周日 deploy 树候件列·零今日施工）

| 项 | 内容 | 施工窗 |
|---|---|---|
| P0 | 发现 28：verify 判据面勘修（d 方向·候会商定谳）+测试案 | 周日窗序 6 前·SDE+STE+CTO 验收（**γ 序定谳序位·关键路径非候排程**·候新会签小件授权面落件） |
| P1 | 发现 21/22：dce_steps migrate rc 3/4 特判——裁词已定（rc=3 立判·rc=4 维持拦·见 §二段 4 注） | **直接开工批③** |
| P1 | 发现 12：close_skill 清单扩 dce.json+close_cli _STAGE_ORDER 同步 | **直接开工批②** |
| P2 | 发现 4：plan_scope kind 恒 dir 散文件错标 | **直接开工批④** |
| P2 | 发现 27：notify_done 收件面 precedence 统一 | **直接开工批①（CEO 点名）** |
| P2 | 发现 30：classify_dir reason 码拆两态 | **直接开工批⑤** |
| P2 | 发现 7：dce_steps migrate cmd cd 前缀显式化 | **直接开工批⑥** |
| P3 | 发现 24：weekly_plane_shift L67 死变量删行 | **直接开工批⑦** |
| P3 | 发现 33「顺手清族」（STE 会商并入·C1/C3 改判归此）：dce_steps.py L37 死 import shlex 删行+plan_scope.py L24 docstring 勘正（发现 32 勘正形）+qualify.py git identity 断言语义注记（发现 6）——**周日窗与 d 施工同 commit+同窗升锚**（供形卷版本锚补录·一次施工一次升锚） | 周日窗与 d 施工同窗（**并窗工序定谳·非候排程**·依赖=d 施工同 commit 同窗升锚） |
| P2 | 发现 29：git hygiene 路径清单单一真源锚 | **直接开工批⑧** |

> 【勘正注记·CEO 11:16 令·BOD 转达·本席 11:1x 收令】「候排程」挂法废止（11-03 令三现行口径=有活就干顺序推进·完成即报）——栏二除两项保留面外全改**直接开工批**（八项·派工单已发 FSD msg f28acfeb·每项独立 commit·全量十一件 test 绿为毕报锚·本席验收后毕报经 COO/BOD 转 CEO）。保留面两项（P0 发现 28 d 施工+P3 顺手清族 qualify 注记）=γ 序关键路径序位/并窗工序定谳·依赖面已注明·非候排程形态。发现 21/22 分叉本席裁词随勘（§二段 4 注·rc=3 特判立/rc=4 维持拦）。

### 既有候件列并入盘点（charter §四「如实挂账零遮掩」）

- 段 3 实弹读数增补窗候首拍（declaring 候件既有）——维持·发现 31 时点敏感面并入该窗注记。
- 段 4 wiring/段 7 改卷/sg 推/RDT 沉淀（declaring 候件既有四项）——维持。
- routing 中文常量候裁面（declaring 缺口既有）——维持·与栏二 P2 族同窗勘。

## §六 · 首拍预期态知情件候选（候 COS 面）

首拍（周日 23:50 cron 或预演窗实走）预期态四点预对齐：
1. 段 6 engine_absent→J7 升级条目→run_state=failed（发现 9·管线设计内行为·非事故）
2. 双通知并存（发现 25·ADE 面+FADE 面）
3. 若发现 28 不施工：段 5 verify 拦停=预期读数之一（快报已载）
4. migrate 构成以实拍时点现值为准（发现 31·非静态清单）

## §七 · 直接开工批验收注记（CTO 验收毕·毕报转呈锚）

- **验收结论=PASS（八/八+连带一笔全收）**：TC 仓九笔在链核验 ✓（babe7de/bcce338/88418b6/c36760d/5a40048/5eefc00/2d71448/4b66ce6/e4fea56·时序 11:21-11:37·夹 CAO 76dcaa3 并行窗合流正常）。
- **diff 亲验（重点三笔）**：发现 21/22（88418b6）rc=3 特判**停段行为不变核验过**（rc=3 仍 break+exit 2·零豁免零 escape·verdict 路由 halt_pending_ruling 面独立）·rc=4 无特判分支 ✓；发现 27（babe7de）`_notify_to_chain` import 复用迁移器 `_resolve_notify_to` 单一真源（非复制逻辑）✓；发现 7（5eefc00）TC_ROOT=parents[2] 自锚+ctx 增键+`cd {tc_root} &&` 前缀+负案断言 ✓。
- **全量独立重跑（第二方法）**：十一件管线面 **157 案全绿**——per-file 逐件对表（close_cli 8/close_skill 13/dce 16/notify 14/plan_scope 28/preflight 22/qualify 19/score_cli 5/score_rubric 12/tenstage_pipeline 2/verify 18·合计 157）**与 FSD 毕报逐件一致零差**；全目录含 smoke_test.py 既有 3 案=160 全绿（差值 3 案归因=smoke 既有面非管线件非今日触面·口径差闭合非缺陷）。
- **validation 族 438/5/1 基线零漂**（FSD 五案名独立提取逐字对表既有基线族·采信其独立验）。
- **连带 e4fea56 采认**：发现 12 七件形后 pipeline fixture 未同步（dce 缺件=absent→stale 盖过 failed）——全量门禁捉获→fixture 补 dce.json 模拟卷——发现 12 测试同步义务连带非清单外新增·如实报形态正形。
- **护栏对表过**：零触运行面/清单外零新增/升锚未动/保留面未触（FSD 自报+本席未见超触）。

## 使用依据

- 十段源码现读：TriCompany/runtime/cognition/（preflight 291 行/qualify 239/plan_scope 405/dce_steps 241/verify 258/score_cli 116/score_rubric 191/close_skill 170/close_cli 98/notify_done 116/weekly_plane_shift 507/weekly_plane.py migrate 段 L225-339）
- 数据面实锚：OP-202611-W46-001.json 现值（activeTrees=[]·doneTreesThisWeek=[]·doneTreesFromPreviousWeek=65）+四候选树 authorization 现值+plan_scope 周日形态 dry-run 推演两轮（tmp 落卷·verdict=pass·counts migrate=2/keep=30/carry=2·现值）
- 底本卷：impl 树 G1-G4 锚卷+declaring a4e1ed1cc+G2 债项 3 义务源
- 快报：02:26:11Z 发现 28 定谳快报双发（COO+COS·msg_id 30da6e9f/38b1b66c）
- charter-review-day-20261114.md（28bf42fdd·§二分工/§四两栏/§五衔接知情）

—— CTO 小狄（m-cto·技术主审席）·写前现查 2026-11-14T02:27:18Z（+8=10:27:18·date 现查原值·D-47 正形）
