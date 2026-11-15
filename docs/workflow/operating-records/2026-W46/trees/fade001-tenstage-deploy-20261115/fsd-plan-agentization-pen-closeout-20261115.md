# FSD plan agent 化施工四笔毕报卷（CEO 三点裁决定谳链·G2 毕线前全落）

- sourceOfTruth: 本卷（trees/fade001-tenstage-deploy-20261115/·plan agent 化施工毕报树面正身；快轨正身=毕报信三件 msg 4506fed5/4be2378f/511c48c0 两面同文）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-15T07:35:00Z（+8=15:35:00·date 现查原值粘贴·候 commit 前现查）
- 授权链: CTO 派工令（compaction 前已达）+CTO 增补令 14:50:01（笔 1 扩面+笔 5 新增+门禁面更新+G2 17:00 候校准）→ D-15 接令回执（compaction 前）→ 四笔施工+验收链（笔 1-3+5 APPROVE·msg m-cto 07:11:47Z/07:16:00Z 回执）
- 设计正身三卷: 设计定稿卷 c691cf007 + 联审增补附款 c398d7b0b + 栏 A 裁决卷 4a6c9c0c2（本树+W47 树）

## §〇 · 总读数（毕报锚）

- **四笔全毕·G2 17:00 毕线前落定**（毕线前 ~90min·增补令 G2 校准问题收口：已毕非候）。
- 四笔 commit 链（TC dev→origin 双通道推讫·ls-remote 验真 sg 顶=7d090dbb384e）：
  - 笔 1 `a893718` plan_scope.py 慢道分诊+agent 调用面+顶层文件判断域+五分类投影（416→850 行级）
  - 笔 2 `692fce4` 契约 1.1.0+agent_readings 字段+docstring 契约面（+46/-4）
  - 笔 3 `4b7a30f` test_plan_scope 增案族 16 件（+394·mock 注入零真网络）
  - 笔 5 `7d090db` shift_carry_over 头部刷新 2→6 字段+首测试件 7 案（+234/-3）
  - 笔 4 =读数笔零代码触（双读数全中·§三）
- **门禁终态**：test_plan_scope 44/44（28 既有案零改全绿=快道零改直证）+test_weekly_plane_shift 7/7（该面此前零测试件·本件为首测试件）+全量 **204 OK**（197+7 数学闭合）+validation **438/5/1 基线零漂**（五案名逐字对表全中：frontmatter_parity/lg024_signed_piece/lg025_manifest_prefix/entry_level_session_body/manifest_claude_code_targets）。

## §一 · 四笔实现面摘要

### 笔 1（a893718）慢道分诊+agent 判断面

- `_collect_evidence` 双判向证据收集（与 classify_dir 同证据源·classify_dir **一字未动**=快道零改铁保证）；`_is_slow_path`：证据冲突（status≠expiry 双非 None 判向）∨degrade 默认 keep（status None+expiry in (None,"keep")）——散文件不入慢道（裁量·CTO 采认）。
- `_call_agent`：urllib POST `/internal/v1/agent`（8710 现役路由实勘正形·裁量采认）·X-Internal-Token 门（TRIRMC_INTERNAL_TOKEN env 读入·D-46 零回显）·60s 超时零重试（时序刚性下重试=不确定性放大·设计硬约束）。
- 守门三护栏：结构校验（family 五枚举/conf float[0,1]/reasons 非空→fail-closed keep+agent_output_malformed）/置信度门槛（<0.6→keep+agent_low_confidence·投影前拦）/双向断言照走（M∪K=S 含 agent 判定树·断言权在脚本）。
- 五分类投影 `_project_agent_family` 纯函数：carry_periodic→migrate·其余四族→keep+语义标注（expected_absent@<to_week>/selfbuild_expected/ongoing_ledger_handover/one_shot_frozen）——栏 A §二表逐族映射。
- 顶层文件判断域：iterdir 全 is_file 实扫+合并单次 agent 调用·**纯读数面零触三清单**（M∪K=S 断言域=trees/ 守恒+verify strict 对表域不破）——CTO 裁决回执（07:11:47Z）三点定谳：实现形 APPROVE 零改/投影语义=迁移器白名单动作语义指引（读数面标注）非 migrate[] 数组成员/迁移器白名单今晚零扩（OP json+unresolved 2 件维持·demand-pool/daily-progress 搬运候首拍后窗）。
- 附款①上界 15（sorted 名序超出→skipped_over_limit fail-closed keep·段时长保险丝）；附款②closeout 冲突门（投影 migrate∧树含 closeout 形文件→keep+migrate_closeout_conflict 候人工复核）；栏 A ⑥未完树计数（active_tree_ongoing>2→各该 readings reasons 尾注 week_unfinished_trees=N·判据面非闸面）。

### 笔 2（692fce4）契约 1.1.0

- PLAN_VERSION 1.0.0→1.1.0（minor 升·既有字段零动）+plan dict 增 `agent_readings` 键（终形=快道树 fast_path 元+slow_readings sorted+top_readings·元素键族 {tree,domain,family,confidence,reasons,source,plan_family,annotation}）+docstring 契约面（三分类段 agent 判断面注记+输出键族 1.1.0 形）——close.py 消费形只读 verdict 单键实勘零波及（随接令回执读数）。

### 笔 3（4b7a30f）测试案族 16 件

- 慢道 mock 五形（正常判定 carry_periodic→migrate+weekly_selfbuild→keep 标注/结构门拒收 family 越值域/低置信 0.4/URLError/TimeoutError·零重试 call_count 直证）+快道回归钉（同场快慢分流互不染·fast_path readings 直证）+双向断言协作案+上界 15 案（第 16 skipped_over_limit）+closeout 门案+五分类投影全表案+顶层件域 2 案（三清单零触直证+domain=top_level·失败 fail-closed 零动作）+未完树计数=3 尾注案+carry 三标注案+契约 1.1.0 键族案（结构门对 1.1.0 形零破）。
- mock 注入形=`mock.patch("runtime.cognition.plan_scope._call_agent")` 零真网络。

### 笔 5（7d090db）shift_carry_over 头部刷新 2→6 字段

- 增刷 LG-072 新形四字段（W42 起 5 连 dst 头部残留实锚家族顺修·实盘 W45 件头部现形反推正形）：①标题周号（`# W45 未决事项`→`# W46 未决事项`·保留尾部英文段）②sourceOfTruth 行刷新周目录+新 OP 号件名（TMV 仓内相对形照现役）③lastSyncedAt 刷平移时刻（**now 机械时钟生成·D-47 合规**——函数加 keyword-only 可选参 now=None·五步编排调用面零触 L411 照旧）④继承链追加新跳（**链史累积语义·历史跳零动**·非替换）。
- 旧形 2 字段（继承自/平移日期）照刷零触——四新字段对旧形件零命中零害（re.sub 无匹配原样）。
- **as_posix() 勘正（头部刷新域内·CTO 采认「域内合理」）**：现役 relative_to 在 Windows 产反斜杠·实盘河源 Linux=`/` 正形——本机 8713 weekly-plane-shift job（state failed 旧观察项）候窗复活后若跑此段即产错形头部·as_posix 对 Linux 零 diff·跨机一致化。W45 实盘件 `/` 形对表验真。
- 新建 test_weekly_plane_shift.py 7 案：新形四字段值面对表（含「W45 未决事项」零残留断言+计数器 bump 4w+⚠️ 回归）/sourceOfTruth 行残留专项（行值面不含旧周路径·继承链链史字样豁免——链史含 W45 合法）/旧形 2 字段回归钉/继承链两跳累积案/dry-run 零写盘/dst 已存在 skip 幂等/now 缺省机械时钟形面案。

## §二 · 施工裁量与如实载

1. **commit message 笔误勘正注记**：a893718 message 写「CGO 设计定稿卷」应为「CTO」——共享仓并行在途不 amend·本卷即勘正注记位。
2. **测试卫生债（识别即标记）**：既有 PlanAllPass 案 fixture 顶层含 OP unresolved 文件→踩真 _call_agent（本机 8710 无服务→fail-closed 兜底绿 ~4s·全量 22.7s 偏慢主因）——「既有案零改」约束下不动·偿还计划=候窗把该案 fixture 顶层件 mock 化（案内一个 patch 行·行为面零变）。
3. **顶层域边界（CTO 裁决定谳在链）**：顶层判断只落 agent_readings（domain=top_level 读数面）·三清单零触——迁移器白名单今晚零扩（OP json+unresolved 2 件维持）·demand-pool/daily-progress 搬运候首拍后窗（白名单扩容施工笔候窗·COS 清单卷 §四.1 补课批先例承续）。
4. **G5 预演对表注记（CTO 采认随行）**：顶层 demand-pool 缺席=首版预期态非链缺陷——预演判读面照此读。

## §三 · 笔 4 双读数（payload 零触验证·零代码触）

1. **payload.command 串零变直证**：R-HY `/srv/fleet/TriRMC/data/cron/jobs.json` weekly-plane-shift job payload.command **len=2750 md5=4e1c7df5c78e083a77a0be7f2a371672**——十阶段形锚卷判据锚逐字对表全中（**23:45 dive 锚零换锚前提成立**）。jobCount=4 对表✓。jobs.json 文件整体 md5 随拍动属预期（state 动态字段·锚对象=payload.command 串勘正在案）。
2. **CLI smoke 快道同值对表**：R-HY 检出顶=7d090db（推送链：origin 双通道推讫 ls-remote 验真→R-HY 15:15 拍时序落在 push 传播边缘前 FETCH_HEAD=a650092→**15:30 拍 Fast-forward 拉到 7d090db**·reflog 对表·自动节律窗内毕零手动触发）→tmp fixture 全快道形跑 CLI：exit=0·verdict=pass·**migrate=[live-a] keep=[done-b] counts 对表 bidirectional_ok=True（快道机械判定与 1.0.0 同值逐字全中）**·plan_version=1.1.0（--agent-endpoint 参数面 R-HY CLI 实测确认在役）·agent_readings 2 元 source=fast_path（无 failed_fallback 元=零 agent 调用旁证直证）。

## §四 · dive 前置探读素材行（值席换锚流程候用）

- **检出顶值候换锚：TC dev=7d090dbb384ed3be64090294cab114af60c6182f**（现役 ddda8dcd 锚值作废换新·设计卷 §四 dive 增补三行第 1 行素材）。
- plan_version 断言=1.1.0（预演拍 plan.json 读取）；agent_readings 字段存在性+source 分布读数（预演拍产物对照基线）——预演拍后素材随值席面。

## §五 · 候窗面与 G 系后续

1. G3 18:30 门禁毕线：STE 复验（范围=四笔+44/44+7/7+204 全量+validation 零漂）+CTO 验收确认链候。
2. G5 21:00 新链预演：SDE 主刀·本席候窗在位（G5 对表注记已收）；23:45 dive/23:50 首拍在位承诺续守。
3. T1 兜底形不变：任一 gate 失守如实报 COS「首拍照旧现链」候 CEO·不硬赶——施工面现势=零阻塞零兜底触发。

## 使用依据

- CTO 派工令+增补令 14:50:01（笔序五笔+三裁量+门禁面）·CEO 14:26:37 三点裁决（首拍前改后链上拍）
- 设计正身三卷：设计定稿卷 c691cf007/联审增补附款 c398d7b0b/栏 A 裁决卷 4a6c9c0c2+COS 清单卷 §一五分类枚举
- plan_scope.py 416 行现勘+weekly_plane_shift.py L64-129 现勘+W45/W46 实盘 unresolved 头部现形（四字段正形反推）
- TriRMC src/server/app.ts L506/L174-184（8710 端点+token 门实勘）·close.py/close_cli.py/close_skill.py 消费形实勘（verdict 单键只读）
- CTO 验收回执两件（07:11:47Z 三笔 APPROVE+顶层域裁决/07:16:00Z 笔 5 APPROVE+笔 4 放行）
- 记忆锚族：daemon 机位矩阵（R-HY=8710 首拍位）/D-46 值面零回显（jobs.json 读数全滤除形）/D-47 落款铁则/活体优先诊断法/跨机操作路由（R-HY 直达不经中转）/ssh -J 全名别名形

—— FSD 小全（m-fsd）·2026-11-15T07:35:00Z（+8=15:35:00·date 现查原值·D-47 正形）
