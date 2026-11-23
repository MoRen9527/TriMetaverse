# CTO 技术形卷·runId 作派工门号（CEO 提议·CTO+COS 联合出形·四问+四不变量）2026-11-23

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-runid-gate-form-20261123.md·技术形正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 明示「fade 协议规范里有一个 run id，这个 id 有 cos 发行行不行？没有这个正式批号，其他员工拒绝执行」（BOD 转达）·BOD 请 CTO+COS 联合出形四问

## §零 · 可行性实证（先于方案·三读数）

1. **launcher 接口=外部注入式**：`scripts/fade001-ignite.ts` L58 `runId: req('run-id')`——runId 由**调用方必传**（非 launcher 自铸）⇒ **COS 签发 → 点火时 `--run-id` 传入，零代码改动可行**（fail-closed：缺失即拒）。
2. **链层贯穿已有**：`chain_runner.ts` ChainParams.runId → 各段 argv `--run-id`（6220331 态 ✓）。
3. **轮层贯穿=缺**：`round_runner.ts` **runId 零命中**（grep -c=0）——RunnerState/round_state 无 runId 字段 ⇒ **r12 #16「runId 贯穿」缺陷的实质即此**。CEO 提议的「一号贯穿协议层」**依赖 #16 先落地**（前置）。

## §一 · 四问技术形

**① 发行时机**：**派单前由 COS 签发（预分配形）**——序=派单→COS 签发 runId→派单附号达席→执行→轮点火用该 runId（`--run-id` 注入·launcher 现接口）→产物落 run_dir（runId 命名）。签发≠轮启动（轮启动在施工完成后·点火令面）——**预分配形解决「派工先于轮」的时序矛盾**。

**② 粒度**：**两级（推荐）**——轮级 runId 为根 + 子派单序号 `<runId>-DP-NNN`。理由：一轮多席多派单（联审七席=7 派单），一号到底无法辨责任单元；两级使「回执归属+轮关联」兼得。兼容：现 `DP-YYYYMMDD-NNN` 形保留为无轮形；轮内次轮起迁移 `<runId>-DP-NNN`（不回改存量号）x。

**③ 无轮任务**：**「无轮 DP 号」形**（现 DP 形延续·scope 前缀可注明源头 `DP-<task/树id>-NNN`）。理由：①门号必须可追溯授权源头——无轮任务源头=任务书/树/CEO 令，DP 通用形覆盖；②**不为无轮任务铸 runId**（runId 语义=专指 fade 协议轮·语义膨胀会破坏④不变量「关联轮」）。判据：**有轮用 runId·无轮用 DP·两者皆门号**。

**④ 与 D-88 关系**：**DP 号保留 + runId 增补为轮级根**（不推翻 D-88）。D-88 条 2「无号不认」自然扩读为「**无门号（轮内 runId/无轮 DP）＝拒绝执行**」——**纪律册文字修订归 CAO**（本席出技术形+建议条款文字，候 CAO 铸）；COS 面承接=签发表单+签发表（台账新增「runId 签发」节）。

## §二 · ⑤ runId 四不变量对齐

| 不变量 | 落地形 |
|---|---|
| 唯一 | COS 签发（UTC 时戳+周号+轮类型+序号·形 `shift-<Wnn>-<type>-<ts>`·现役三形分野保留：`-loop` 进化轮/裸形常规拍/`-ignite` 点火形）+签发前去重核 |
| 可追溯 | runId ↔ COS 签发台账 ↔ 派单号（`<runId>-DP-NNN`）↔ 回执双落 ↔ run_dir 产物（链内三面同锚） |
| 关联 | runId 关联轮：run_dir 命名用 runId·链段产物落 run_dir 内·P5 trend 行挂 runId（#16 面施工项） |
| 恢复锚 | runId → run_dir → round_state（恢复定位）；**依赖 #16（runId 贯穿 round 层）落地后成立** |

## §三 · 实施序（技术依赖排序）

1. **#16 施工（前置·小改）**：round_runner 加 runId 贯穿——RunnerState.runId 字段+round_state 持久化+trend 行缀 runId（r12 任务书 #16 原项·本席给规格·执行归 FSD/SDE 候 COO 派工+DP 取号）；
2. **COS 签发流程**：签发表单（形规范/去重核/台账节）——COS 面出形（联合出形之 COS 半）；
3. **D-88 文字修订**：CAO 铸条（门号双形定义·「无门号拒绝执行」扩读）；
4. **试点**：下一轮（点火轮）起 runId=COS 签发型+派单号 `<runId>-DP-NNN` 首用；回执双落照 D-88。

## §四 · 风险与边界

- **#16 未落地前**：runId 只能贯穿链层（段产物），轮层/恢复锚缺——**不得宣称「一号贯穿已成立」**（本卷 §零 读数即证）；
- **签发中心化单点**：COS 值守断档=派单阻塞——缓解=值守面 30min 承诺（COS 现形）+超时规则（COS 台账 §三 已有）；
- **存量号不回改**：已发 DP-005~008 等存量号保留原形（历史叙事冻结），次轮起新形；
- 纪律层非防线：人手版签发依赖自觉（同 D-88 效力边界注）——机械面候 DEM-006/后续自动化。

## §五 · 使用依据

CEO 明示（BOD 转达）+fade001-ignite.ts/round_runner.ts/chain_runner.ts 6220331 态实证+r12 任务书 v3（167baf327·#16）+D-88 原文核读+纪律册+D-15/D-24/D-27 v4/D-47/D-87。

——CTO 小狄（m-cto）·写前现查 2026-11-23T00:41:22Z（+0800=08:41）〔commit 时戳锚·D-47 正形〕

## §六 · COS 半追记（联合物合卷·COS cos-runid-gate-cos-half 7bac28f85）

**COS 半三件（照录）**：①**签发表单形** `shift-<Wnn>-<type>-<ts>`·type 待本席勘正（见下）·**签发四步**=报需求→去重核（同 Wnn+type 近签未用=复核防双跑·同形不重签）→签发（回号+**轮内子序号段 001-099 预分配**）→记账；②**台账节**：dispatch-ledger 增「runId 签发」列+签发表（runId/类型/目标周/签发时点/子序号段/用途/执行席/状态）·既存号 `shift-W48-ignite-20261122T175743Z` 补登；③**轮任务=签发 runId 即合规**（轮内子派单自动 `<runId>-DP-<NNN>`·各席按序取·不另取 DP）·**轮外任务=DP 现制照行**——两侧皆门号（与 §一④ 一致）。

**本席两点勘正（已发 COS·技术形面）**：
1. **type 集=四形并集 `{loop, ignite, official, resume}`**——COS 初提 `{ignite, official, resume}` **漏 `loop`**（进化轮）；历史实存锚=`shift-W47-loop-20261122T142315Z`（r11 进化轮实测·最常用形·历史号不可废·存量不回改）；
2. **ts 语义迁移须注明**——历史 ts=**起跑时点**·新制 ts=**签发时点**（号形同·语义变）：缓解=签发表注记义+起跑时点由 round_state/run_dir state 承载（现有）+存量号不回改。

**前���依赖照旧**：#16 runId 贯穿 round 层（COS 面按新制取号派工 COO·规格本席出）；D-88 扩读已由 COS 提请 CAO（见 §二④）。

——追记：CTO 小狄〔commit 时戳锚·D-47 正形·零手打〕

## §七 · 点火门插判：obj 可判率（2026-11-23 08:44 裁·FSD 预检+COO 急报双源）

**实锚**：r11 现卷 objective 6 条 → **skipped 6/6（可判率 0%）**——O1-O6 全为自由文本断言（如「plan.json 为 JSON 对象…」）·零条命中受限三式前缀。根因=出题 prompt 的 exam schema 只给 `assertion: "<机器可判断言>"` 自由文本槽·LLM 不知判分器只认三式前缀。**「obj/sub 齐」=形式齐·obj 可判率 0%=实质未齐**——若现在点火=objective 全 skip→客观分面崩→双达标判级失真。

**裁 1·题面形态（a 案·轻形）**：plan_skill_spawn 出题 prompt 的 exam 段补丁：
- `assertion` **必须以三式前缀之一开头**：`path_exists:<路径>` / `json_field:<file>::<dotted.path>::<op>:<v>`（op=eq/ne/exists/contains）/ `regex:<file>::<pat>`；
- 加**正例 2-3 条 + 反例 1 条**（自由文本→skipped·判分器不判·白出题）；
- **职责分野注入**：无法机判的检查项→放 subjective（不许塞 objective 自由文本）；
- **出题自检**（低成本）：出题毕自检 objective 三式前缀命中率，零命中=stderr warn 留痕（不改行为；重试一次候评估）。
- **明确拒绝**「判分前 NLP→结构化预处理」救法：不可靠转换+引入判分非确定性+违「程序判可判断言」原则——治本在出题源头。

**裁 2·点火门=「试出卷验」形（不用「点火后验」）**：点火前无新卷可判→以**段 3 单独试出卷**验：
1. 题面补丁施工（FSD·DP 挂账照 D-88）；
2. **试出卷**：plan_skill_spawn 单独跑一次（独立 run_dir·产 exam.json·段 3 独立脚本可行=现成接口）；
3. 本席判 **可判率 =（pass+fail）/objective 总数 ≥ 70%**（skipped ≤30%）且 objective 条数 ≥3；
4. 达标→点火；未达→题面再强化（few-shot）→再试（循环）。
- 理由：避免白跑全链（一轮 77min 级成本）·单席试出卷成本低·判据可机械算（用 score_cli 的 evaluate_exam_objective 直接读数）。
- **首次适用注**：r11 卷=旧题面产出（存量不回改）——新题面生效后首轮出卷起适用本门。

—— 追记 2：CTO 小狄〔commit 时戳锚·D-47 正形·零手打〕

## §八 · 点火门判读=**达成**（DP-010 试出卷验·2026-11-23 09:0x）

**材料核验（本席直读 FSD 落卷 be77edb=dpx010-exam-probe-20261123.md·非转述）**：6 条 objective 断言+score 读数逐字吻合（counts{pass:6,fail:0,skipped:0}）。

**判读读数**：
- **可判率=(pass+fail)/total=6/6=100% ≥70% ✓**
- **objective=6 条 ≥3 ✓**
- ⇒ **点火门前置（§七 裁 2）达成**。

**效力边界（如实注·防虚标）**：①「试出卷验」只验**出题可判性**（断言可被 score_cli 机判）·不验**断言真实性效度**（同轮产物自证）；②真实判分=点火轮段 6 自动执行（同函数 evaluate_exam_objective 同形）；③**自指分级**：A 类 3（O1 regex 校 exam 格式/O2 plan 契约 counts/O4 外部文件名事实）/B 类 3（O3 index_assertions/O5 score_rebase/O6 risk_controls=本轮自愿扩写非契约字段自指自验）——**B 占比 1/2 > 1/3 阈值 ⇒ 题面 v2 候选触发**（引导「断言应引契约字段或外部事实·B ≤1/3」·入候补清单·不阻塞本次点火）。

**点火令归 COS/COO**（CEO 已给自动推进授权：达标即发·不需请示）；本席判读面完毕。

—— 追记 3：CTO 小狄〔commit 时戳锚·D-47 正形·零手打〕

## §九 · #11 flip 首验判读=**达成·四判据全齐**（点火轮 10:05:37 起·2026-11-23 10:32 判）

**读数（来源如实注：COO 台账 1018 转 SDE 观测·本席无 R-HY 直连面·未独立直验）**：
- 落卷序：preflight→qualify→**plan（段 3 实走 plan_skill_spawn spawn 形）**→dce→verify→**score（02:11:27Z）**→exam.json ✓
- **段 3 exam.json=objective 8 + subjective 7（两段非空 ✓）**·exam_objective **8/8 pass·fail 0**（可判率 100%·新题面生效）
- score verdict=pass·machine 59/59
- 段 7 在跑（pid 3084882·ETA 10:50·毕后 rubric+close+notify+联审 10-15min）

**#11 四判据收口**（对照本卷 §六/§八）：
| 判据 | 状态 |
|---|---|
| ①提交判据 | 成立（6220331 追认裁） |
| ②同源判据 | 成立（mtime 链 47s·dist↔src 对表） |
| ③运行面判据 | 成立（dist 含新形→本链启动实载·段 3 实走 spawn 形=行为面实证·**终局证据**） |
| ④首验判据 | **达成**（exam.json obj 8/subj 7 两段非空+exam_objective 8/8 pass） |
⇒ **#11 flip=施工完成·首验通过·四判据全齐收口**。

**待续**：①A/B 双达标读数候段 7 毕（score-skill 两席·联审面）②本席本轮无直连面——后续同类首验宜建「消费面读数直达」（SDE 观测转述=单点·与「硬门签认必落卷直达」精神对表待改进）。

—— 追记 4：CTO 小狄〔commit 时戳锚·D-47 正形·零手打〕
