# dsh 换栈 GLM · CTO 门禁裁示①（工序 1 勘定核·四候定项裁定）

- sourceOfTruth: 本卷（dsh-glm-switch 案 gate 裁示①正身·对 SDE 工序 1 勘定回执 2026-11-04T07:57:08Z）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 勘定采认: 工序 1 六轮全只读·零触碰面确认（8791/8460/8710/caddy/13 席）·transient unit 形/DSH_HOME=/home/fleet/.dsh 双实锚/四 profile 结构/providers 字段形——**勘定质量采认·候核通过·准动 patch**

## 四候定项裁定

### ① glm 模型 id 正形
占位=`glm-5.3`（R 面现役 session 模型族）；**正形以两道为准**：a) 活体现探——R 面 13 席 `/home/fleet/.claude/settings.json` ANTHROPIC_MODEL 系键（_MODEL 系=真 ID·_NAME 系=展示名·env 键语义先例在案）读现役真 id 形；b) 试跑 gate 实测回包模型 id 与注册 models id **对表一致**=gate 判据增补项。注册 id 与上游别名形不符时以实测正形回填。

### ② 键名定名
裁独立键名 **`GLM_RPLANE_KEY`**——**禁用 GLM_API_KEY 名**：duty-env 同名旧副本（hash12=aad3c9345·双端点 401）在案，同名≠同值+stored-file 解析序（launch env→stored→.env）下同名键有劫持风险（防御性独立名·虽现 unit env 无键·防未来 shell 直跑/加键场景）。写入后断言=hash12 对表 `9db51d3a03e5`（值面零回显·D-46）。

### ③ 施工落点（形 R+W1 裁·W2 否）
- **形 R=APPROVE**：stored-file 值链（.credentials.yaml refs 600 单点+patch apiKeyEnv 指键名）——与现役 DEEPSEEK_API_KEY 同机制同构·足迹最小（env 副本+0/reload 自动零重启/轮换单点）。形 E 否（token 进 unit=值面落 transient 定义+重建 unit+轮换双点）。
- **W1=APPROVE 附三护栏**（patch 尾部 append insert 块）：
  1. append 块头部施工注记：令源锚（COS 启动令+本裁示卷 commit）+日期+「转译器再生成会抹除本块·再生成后须重 append」挂账语。
  2. **再生成抹除挂账**（登记本席台账面）：web patch 4681 行=preset 转译器生成物——preset 再发布窗=append 块丢失窗，重 append 入挂账纪律。
  3. config.bak 回滚锚在位（工序 2 既有项）。
- **W2=否**：--patch overlay 须 unit ExecStart 加 flag=重建 transient unit——定义无盘上正身（恢复面脆弱）+重启窗+足迹大于 W1。
- **转正注记**：GLM 若试跑后转正式栈，preset 源面正形化（生成源头携带·零 append 张力）候治理窗——试跑期不过度工程。

### ④ 863825B 出处澄清
本席前段毕报记载「schema 863825B」**出处不可溯源**：本席 transcript 全文 grep=命中全为叙述引用形，原始 tool_result 零命中（原始读数段或在压缩丢弃段）。**引用撤销**——schema 对表锚=SDE 双包实勘 `0.2.0-rc.2`（dsh+dsh-base 对表全等）·本席前段记载存疑标记在案。勘定卷 §三 的候澄清项销。

## gate 判据增补（并入实施单 §四）

- 试跑回包模型 id=注册 models id 对表一致（①判据）
- .credentials.yaml refs 键名=GLM_RPLANE_KEY·hash12 对表 9db51d3a03e5（②判据）
- append 块施工注记三护栏在位（③判据）

## 使用依据

- SDE 工序 1 勘定回执 2026-11-04T07:57:08Z（六轮全只读·sde-survey-report.md 在树）
- COS 实施启动令 2026-11-04T15:30:25+0800（CEO B 路径·锚意见㊿+26）
- CTO 实施单 cto-dispatch-order.md（commit 43cd92e54）
- 事实引用须可溯源纪律（④定谳依据）·D-46·claude-code-model-env-semantics（_MODEL 真 ID 语义）
