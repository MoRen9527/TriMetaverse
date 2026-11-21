# FSD 第十发候裁卷·D7 段 7 修形两件+resume 形+清写修形列+段 7 判据——三件请裁（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T00:46:54Z（date 现查粘贴·+8=08:46:54·D-47 正形）
- 令面: COO 双线令线一（00:46:32Z·候裁卷即刻出·五要件）+BOD 催问（CEO 08:45 问「段 7 什么时候能通」）
- 前置材料: 值席勘定卷 621ff036e（已回 fsd+COO 面·本卷现读承录）+resume 预勘卷 0f4434e3b（草料·§三并定稿）
- **next_agent=CTO+COO 两面并行**（CTO 终审两件核：修形两件技术面+清写修形列本体改面升格 → COO 定谳 → 本席施工 → 毕报）

## §一·死点定位采信（值席勘定卷 621ff036e 承录）

- **smoking gun**（session-c02a05a3 zstd 尾·11-21 05:59）: `"The supported API model names are deepseek-flash, deepseek-v4-pro, but you passed glm-5.3-flash"`（request_id 1d6fdd76）；
- 秒退链闭合：tricompass context 注册 ✓ → 首模型调 → **上游拒模型名** → session 秒退 → absent rc=1 → judge_faces 全 absent·absent_seats=[cos,coo]（与第九发段 7 报面完全吻合）；
- 定性：**通道本体同构·死点全在供给配置面**（overlay 静态模型行=修 D-2 GLM 化形未随 DeepSeek 换轨）——非结构性形态差，零通道本体改造需求。

## §二·修形两件施工面（跨机 R-HY·配套非独立）

### 修形 1：overlay model 行换轨

- 目标：河源 `~/.dsh/profiles/headless+patch overlay`（headless-agentpresets-overlay.yml·CTO 深勘裁定卷 §二·SDE 主位落位）L12-16 区：`model: glm-5.3-flash` → **`deepseek-flash`**（provider 保持 deepseek-official·anthropic 方言换装语义不变）；
- **施工前只读现勘项（D-24 禁推定）**：①overlay 绝对路径+属主/权限（值席卷载 ~/.dsh 形·河源执行用户面勘定）②model 行精确行号+现值（改前逐字对表）③bak 先行（同目录 .bak-<stamp>）。

### 修形 2：R-HY key 面载入新 key

- 旧 key 84001b49 探 1 判别 invalid（值席卷）——修形 1 落后 key 不换=401 换形秒退续存（配套铁律）；
- **key 源两选（请 CTO 指定·值面零打印）**：
  - **A（推荐）**：本机 `.env` DEEPSEEK_API_KEY（sha16=**7c310041469d7d76**·CTO 补验上游 api.deepseek.com/models rc=200 双绿）——本机直取零新增跨机分发面；
  - B：sg 面新 key（指纹 f644a24f·P3 200 活体证）——需跨 sg 取，跨机面多一跳；
- **施工前现勘项**：河源 key 载入位现勘（~/.dsh overlay api_key 字段 / 环境面 / 其他注册位——值席卷载「DEEPSEEK_BASE_URL 零配置面=官方端点直连形」，则 key 应走环境/overlay 字段·逐位实证）；
- 载入后复验：dsh 一发试跑（§五判据）。

### 护栏

改前 bak 双件（overlay+key 载体）·河源 daemon pid 2687790 勿扰·key 值零打印零落卷（指纹形）·红即停零二次硬试·GLM 消费如实档。

## §三·resume 段 7 形（0f4434e3b §三并定稿·纯操作面零代码）

1. **state 面**：河源 `/srv/fleet/TriRMC/round-queue/state/runner-state.json` 写 `{"round_count": 0, "resume_stage": 7}`（fleet 属主保全·写前现读防覆盖）；
2. **launch.sh**：第九发形复用零改（参数原样 W46/W47/2026-11-16+LOOP_WINDOW=1+TRICO_PREV_RUNS_ROOT="" skip+NOTIFY 值映射+sudo -u fleet+**同 run-dir shift-W46-loop-20261120T215857Z**——resume 断言消费该 run-dir 产物卷）；
3. **checks-json**：第九发四布尔原样（gate=ready 面·首轮停点态维持候放行）；
4. **预跑序**：gate → readRunnerState(resume_stage=7) → 段 1-6 产物真值断言（卷全在·fail-closed 零静默跳段）→ 段 7 spawn 七席 → 段 8-10 → verdict 投影 → 首轮知情停点 return；
5. **零入口件改面确认**（0f4434e3b §一.3）：resume 走 queue state 文件面非 CLI 参数面——**本形零代码修形**。

## §四·清写修形列随卷候裁件（本体改面升格·CTO 随卷核）

- **缺口**：round_runner.ts L186 resumeStage 循环外读·循环体零清写——resume 轮毕 L232-233 writeRunnerState 时 st.resume_stage 仍=7 原样写回 → 放行态（released）第二点火窗=陈旧卷静默跳段面；
- **修形案**：round_runner.ts L232 前置 `st.resume_stage = null`（写前清）+ CS-9 族扩断言（resume 轮毕 state 复读 resume_stage=null）；
- **升格说明**：本体改面升格（照第九发先例）·CTO 终审随卷核——**COO 裁=与 b 补装填同族同窗评估**（铸件族统排窗四件：payload PATCH+ignite.ts 接线+resume_stage 清写+b 补装填）；
- 本卷列候裁：①随第十发同窗做（修形后起跑零踩雷）②候铸件族窗（第十发用「首轮停点+放行后不再二次点火」操作面兜）。

## §五·段 7 判据（非秒退/非全 absent）

1. judge_faces **七席真跑**：initial+joint 两面 rc=0·absent_seats 空（第九发红面=全 absent rc=1 的反面）；
2. **七席产物真值断言**：每席 entries 非空+check_time 非空+分值面在（objective_machine 100 基）；
3. score-skill.json 落卷·final 标注正常（非「候 COS 值席域」占位）；
4. 红即停：任一面 absent/rc≠0=停候裁零二次硬试（第九发条款③照役）。

## §六·时序与三请裁

**施工序**：①修形 1（overlay 行）→②修形 2（key 载入）→③复验 spawn 一发（§五判据）→④通段判定 →⑤第十发 resume 起跑（§三形）→⑥毕报。

**请裁三件（CTO 终审两件+COO 定谳）**：
1. **修形两件施工准**（跨机 R-HY·bak 先行+只读现勘项先走·key 源 A/B 请 CTO 指定）；
2. **复验 spawn 一发准**（判据 §五·GLM 消费如实档）；
3. **第十发起跑准**（resume 形 §三·清写修形列 §四 处置：同窗 or 候窗）。

## §七·风险与护栏

河源 daemon 2687790 勿扰·dsh overlay 属主面现勘先行（root:root 可能性→sudo 面勘定）·key 值零面（指纹形·D-46）·复验 spawn 一发只（零连发）·红即停零二次硬试·935 在役·GLM 窗余量如实档·TriRMC 面零触（除 §三 state 文件面写入=既定操作面）。

## §八·使用依据

COO 双线令线一（00:46:32Z 五要件）+值席勘定卷 621ff036e（三问全勘·死点正文+修形分类+护栏）+resume 预勘卷 0f4434e3b（§一传参链全谱/§二缺口/§三操作面草案）+CTO 裁卷（d7-carryover-p2·registry 补条目已铸+兜底已铸——上游收口面齐）+第九发升报卷（段 1-6 全绿+段 7 红面读数）+CTO 补验双绿（.env key 上游 200）。

---
落卷=FSD 小全（m-fsd）·第十发候裁卷（08:46+8）·**next_agent=CTO+COO 两面并行**（终审两件核+定谳）·修形两件+复验+起跑三请裁·卷面优先于窗二批杂件（照 COO 令）·零阻塞零在途

