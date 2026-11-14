# FSD score_engine 实弹装配毕报卷（CEO 11:45:54 直令·四笔施工件）

- sourceOfTruth: 本卷（trees/fade001-tenstage-review-20261114/·FSD 实弹装配毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-14T04:08:53Z（+8=12:08:53·date 现查原值粘贴）
- 授权链: CEO 11:45:54 直令（BOD 托转·台账 591 笔）→ CTO 派工令四笔（跨席信 11:52）→ D-15 接令回执（msg dba45f5a）后开工

## §〇 · 总读数（毕报锚）

- **四笔全毕**：独立 commit 四笔·笔序勘定=依赖序 2→3→1→4（详见 §一）·每笔中间态全绿=回滚粒度干净。
- **全目录 176 案全 OK**（discover test_*.py 面=原 157+engine 新件 18+cli 集成案 1·数学闭合零差）。
- **validation 族 438/5/1 零漂移**：五案名逐字对表=frontmatter_parity/lg024_signed_piece/lg025_manifest_prefix/entry_level_session_body/manifest_claude_code_targets=既有基线族全中（本轮独立验非转抄）。
- **推送**：origin 双通道（github+sg bare）推讫·ls-remote 双验顶 hash 一致=004695bb（github 通道 ls-remote+sg-server 通道 ls-remote 各自验真）。
- **零触实证**：score_cli.py 零 diff（探测面 import_module 既有·engine 落仓即被 probe present 实弹）·payload/daemon/jobs.json 零触·R-HY 装配零预动。

## §一 · 笔序勘定（依赖序如实载）

令文四笔序=engine/别名/cli 案/engine 测试。施工序勘定=**2→3→1→4**——依赖事实：engine 落仓即被探测实弹（设计行为）·笔 3 旧案 L64-77 靠「沙箱无 engine」环境巧合·若笔 1 先落则旧案必翻红（commit 中间态红=回滚粒度破）。故笔 2（别名=笔 1 import 依赖）→笔 3（absent 案 mock 化显式构造 ImportError+集成案 skipUnless 守卫=engine 未落仓时 skip 挂起·落仓自动激活）→笔 1（engine 落仓·全绿实弹无翻红窗）→笔 4（engine 白盒全谱）。四笔每笔 HEAD 态全绿。

## §二 · 笔 2：REDLINE_CAPS 公开别名（6171d3d）

- score_rubric.py 增 `REDLINE_CAPS = _REDLINE_CAPS`（C=79/G=59 同值同源·零删私有名）。
- engine 消费面身份断言案（test_score_engine NoRedlineHardcodeTest）：`assertIs(score_engine.REDLINE_CAPS, score_rubric.REDLINE_CAPS)`=同源同对象·零硬编码铁面。

## §三 · 笔 3：score_cli 案 mock 化+真 engine 集成案（18dca2e）

- absent 案（原 L64-77）改 `mock.patch.object(score_cli, "import_module", side_effect=ImportError)`——显式构造 absent 态（环境巧合面退役·分支覆盖保留）。
- 真 engine 集成案增：main 零 mock 真跑·空 run_dir→`engine_state=executed_ok`（engine 返回 dict=引擎跑成）+内嵌 `score.verdict=fail`（判卷读数）+families 结构化载缺件明细·rc=0。
- **两层 verdict 分明裁决（现役契约贴形·CLI 零触）**：score.json 顶层 verdict=CLI 执行面成败（reasons 空=pass·rc=0）·engine 判卷读数=s["score"]["verdict"]——集成案断言按此两层钉（初版断言错位自捉自修）。

## §四 · 笔 1：score_engine.py 本体（2905840·361 行）

- **契约**：`run_score(run_id, run_dir, from_week="", to_week="") -> dict`（CLI keyword 四参·run_dir 原值 str 容容错 Path 化）·返回 dict 零落卷（落卷归 CLI main）。
- **机判域 B/C/D/E/G（65 分）判据**：
  - B 拍点形态：run_id 时戳段 HHMM∈[23:50,23:59] 分粒度窗（23:59:59 属窗内）——预演白天拍如实出红（零豁免·读数保真·reasons 注明非缺陷）。
  - C run id（T1-1）：正则 `^shift-W\d+-\d{8}T\d{6}Z$`+run_dir 段产物 run_id 同串对表（计数入 reasons·生产面三处 grep=值守读数位如实注不冒充）。
  - D preflight（T1-2 后半）：verdict=="pass"+exit_code==0 值面（拦截态实值入 reasons）。
  - E qualify（T1-2 前半）：assertions 五键（identity/run_dir/git_identity/alert_credentials/disk_free=qualify.py L184-196 实锚）ok 逐一非 null 且全 True。
  - G 迁移链：score 时点已应落五段产物（preflight/qualify/plan/dce/verify）齐性+值面 verdict+verify items[] 对表零 missing。**链序裁决锚**：score/close/manifest=score 段后段产物不判缺（判后段缺=错位误判·docstring 载）。
- **manual 域 A/F/H（35 分）**：state=manual·score=null 不冒充机判·reasons 挂考卷 collection_cmd 原文引用（运行时读非复制）+special_clause 引用随行。
- **总分**：机判域归一化百分制 Σpass/Σ机判权重×100（manual 出分母·裁决理由=不归一则天花板恒 65 读数误导·docstring 载）·红灯族 fail→total=min(total, REDLINE_CAPS[族])（多灯取最严·应用前后值入 redline_caps_applied·红灯不洗白）。
- **verdict={pass,fail}**：任一 fail→fail；全机判 pass+manual 存在→pass；rubric 缺席→全族 fail。
- **考卷零文案复制**：族元数据运行时读 rubric-firstshoot.json（顶层=纯列表实锚·dict 包壳兼容）·考卷改权重 engine 读数自动随。
- **降级面**：run_dir 缺/坏 json/单族判据异常全捕获→fail+reasons·engine 不外抛破链（外抛只剩未知异常=CLI executed_failed 兜底）。

## §五 · 笔 4：test_score_engine.py 白盒全谱（004695b·18 案）

- 判据逐族案（B 窗内/窗外/正则破·C 正则+同串+计数 0·D 值面非存在性+缺件·E 五断言 ok=False/null/缺键/缺件·G 齐+items missing+缺件+verdict 拦截）。
- 红灯 cap 两案+边界案：**C cap 触发面=mock 权重放大构造（机判域 95·C 红 80/95=84.2→压回 79）·真权重数学边界=76.9<79 cap 形备未触发（上限保险丝语义·不超不动）另案如实钉**；G cap 真权重直触发（45/65=69.2→59）。
- F2 免评案（F=manual score=null+采集锚随行）·T1 三断言案·空 run_dir 降级案（B 族独立可判=15.4 如实）·坏 json 降级案·rubric 缺席全族 fail 案·payload GBK 可编码防回归案。

## §六 · 施工中捉获三实测坑（如实载·白盒自捉/集成案实捉）

1. **B 族切片错位**：`run_id[-8:-1]` 吞 T 前字符→strptime 炸→B 族全 fail 连坐（白盒红灯自捉）→正形 `[-7:-1]`（"235000Z"→"235000"）。
2. **B 窗判秒粒度边界**：`time(23,59)` 卡 23:59:00·时戳 235901 误出红→考卷窗=分粒度正形（HHMM∈[2350,2359]·23:59:59 属窗内）。
3. **∈/∉ 非 GBK 字符经 CLI print 炸 GBK 宿主**（UnicodeEncodeError 'gbk' ∉——集成案激活实捉）：CLI 零触令下正解=engine reasons 字符面收敛（∉→「不在」表述）+payload GBK 可编码防回归案钉案（score_cli 无 reconfigure 先例属 CLI 面·不越令改）。

## §七 · 数学边界裁决注记（候 CTO 验收裁点）

REDLINE_CAPS={"C":79,"G":59} 在「总分=机判域归一化」语义下：C 红数学天花板=50/65=76.9<79（cap 形备未触发=上限保险丝·考卷权重改动后若总分超 79 则压回=语义仍在）·G 红=45/65=69.2>59（触发面实活）。令文「C 红→79」按上限保险丝语义落地+mock 触发面案钉机制——**若 CTO 语义=C 族单族得分上限（非总分上限）则候裁勘形**。

## §八 · 护栏对表

- 清单外零新增：只动 score_rubric.py（3 行）/score_engine.py（新）/test_score_cli.py（+41-2）/test_score_engine.py（新）四文件。
- CLI/payload/daemon/jobs.json 零触：score_cli.py 零 diff（git 对表可验）。
- R-HY 装配动作（TriRMC 检出同步）零等待零预动（候授权件）。
- D-46 值面零回显·D-47 落款铁则遵行。

## 使用依据

- CEO 11:45:54 直令（BOD 托转·台账 591 笔）+CTO 派工令四笔（裁词六点+护栏节律）
- T1 三断言原样=a2c246908（T1_CANDIDATE_NOTES 嵌注）
- 段产物实形锚=qualify.py L184-209/preflight.py L251-252/verify.py L130-216/dce_steps.py（本窗实勘）
- commit 链（TriCompany dev）：6171d3d（笔2）→18dca2e（笔3）→2905840（笔1）→004695b（笔4）·双通道推讫顶=004695bb

## §九 · CTO 验收注记（PASS·验收毕时点锚=两版分界锚对齐用）

- **验收结论：PASS 四/四+三裁决点全裁+连带全收**。验收毕时点=**2026-11-14T04:14:53Z（+8=12:14:53）**（date 现查原值·值席两版分界锚注记用——本时点前 v1 governs·本时点后经验收+装配毕 v2 governs 生效）。
- **diff 亲验**：e4fea56..004695b 五 files=registry 笔 aae540e（本席）+FSD 四笔触面逐一对表·**score_cli.py 零 diff 亲证**（探测面零触=落仓即实弹设计达成）·笔序 2→3→1→4 与 git log 一致（每笔 HEAD 态全绿=回滚粒度干净）。
- **独立重跑（第二方法）**：cognition 全目录 **179 passed**（=管线面 160 含 smoke 3+engine 新 18+cli 集成 1·数学闭合——毕报 176=「157+18+1」管线面口径·smoke 3 案口径差与上批同族·双读数均真非缺陷）；validation 族全跑 **470 案 5 failures+1 skipped**——五案名（frontmatter_parity/seats 双案 entry_level_session_body+manifest_claude_code_targets/lg024_signed_piece/lg025_manifest_prefix）逐一实测全中=既有基线零新增失败零漂（毕报 438/5/1 vs 本席 470/5/1=套件清单口径差·failures/skipped 两核心读数一致·gate 判据成立）。
- **三裁决点裁词（§七候勘逐条）**：
  1. **REDLINE_CAPS 保险丝语义=采认**。令文原意「红灯不洗白」=总分上限·`min(total, cap)` 正形；数学分析如实采信——现权重下 C 红天花板 50/65=76.9<79（cap 形备未触发=护栏位非死码·考卷权重改版后护栏实活）·G 红 69.2>59 实活；mock 权重放大案钉 C 触发面机制（84.2→79）=机制覆盖完备。**非单族得分上限形**（单族上限会稀释总分读数语义·不采）。
  2. **两层 verdict 分明=采认**。CLI 顶层 verdict=执行面成败（贴 score_cli 现役契约·test 案 77 engine_absent→fail 先例同源）·engine 判卷读数=s["score"]["verdict"] 内嵌——CLI 零触令下唯一正解。
  3. **G 族链序=采认**。score=段 6·close（段 8）/manifest 后段产物在 score 时点尚未落卷——判后段缺=错位误判；五段齐性（preflight/qualify/plan/dce/verify）+close/manifest 不入判据=时点齐性正形（docstring+代码注释双载）。
- **三实测坑采认**（§六）：B 切片 [-7:-1] 正形/分粒度窗判（23:59:59 属窗内）/GBK 字符面收敛（∉→「不在」+payload 可编码防回归案钉）——白盒红灯自捉+集成案激活实捉=自测即门禁活体实证·毕报如实载卷。
- **engine 本体亲读**：docstring 裁决锚五点全载（机判/manual 分母构成+链序+cap 语义+降级面+考卷零复制）·判据实现值面必读（qualify 五断言 ok 非 null 且全 True·preflight verdict+exit_code 双读）·降级面全捕获不外抛——「哑卷≠引擎坏=设计行为」达成。
- **SCORE_ENGINE_VERSION=1.0.0+REDLINE_CAPS 身份断言（assertIs 同源同对象）**=零硬编码铁面成立。
- **STE 主审读数**：在途（骨架卷 97b3878f1 已落·主审随到随录）——本席验收独立成立·STE 读数为第二独立线对表。
- **装配 readiness**：本席验收毕=R-HY 装配动作解锁条件达成的技术面（授权面已生效 f14465808）——装配清单随毕报转 BOD/COO 链出（装配探针判据见毕报信）。
- CodeRegistry 回写随验收毕执行（TC docs/registry/code-state.md·附本注记为依据）。

—— CTO 小狄（m-cto·验收席）·验收毕时点 2026-11-14T04:14:53Z（+8=12:14:53·date 现查原值·D-47 正形）
