# 任务书 20260915-兜底按钮（TriModel web UI：本机 Claude 直连兜底写入）

- sourceOfTruth: 本件（BOD 铸，2026-09-15 11:2x +08 现查）；CEO 指令原话（09:3x）：「还原兜底，发生在TriModel不好用时，直接写setting.json，采用直连模型方式，自己填模型，key，baseurl」；=CEO 现行手工 node 单行命令的按钮化
- face: local-executable → **M 面本地席：FSD 席**（TriModel UI 线主责；M-004 直达派工+本平面留痕）
- PACE: P=本任务书 → A=已挂 W38 平面 → C=M-004 直达（m-fsd）→ E=节点收口回写本文件
- 边界: 只增不改（新增独立 UI 区块+新端点）；不动卡数据/策略链/求值引擎；不碰 sg；只写服务端所宿机 `~/.claude/settings.json`；前提=TriModel 服务在跑（服务级不可用属运维通道，不在本件）

## 需求（行为规格）

**场景**：TriModel 配置面不好用（策略/卡数据不可信）时的**直连兜底通道**——不依赖 TriModel 数据，手填三值→直接写本机 settings.json→重启会话即直连可用。

1. **UI 区块**（新，独立取数；位置建议：「当前生效」之后、TriMMC 信息卡之前；**不参与卡片禁用链**——本块语义即可用性兜底）
   - 现状展示：当前服务地址 + 当前模型（密钥不显；管理令牌下可显尾 4 位）
   - 三输入：**服务地址 / API 密钥 / 模型**（用户自填；密钥 type=password+👁 照既有模式；不预填卡数据）
   - 按钮：**「还原兜底」**
   - 词汇零黑话（用户面不出现 env 名/HTTP 码）；空值/格式/失败=行内人话错误（照 humanize 风格）
2. **写入内容**（服务端落 `os.homedir()/.claude/settings.json`）
   - `env.ANTHROPIC_BASE_URL` = 服务地址（verbatim；直连语义——不做任何代理/relay 改写）
   - `env.ANTHROPIC_AUTH_TOKEN` = 密钥（明文落盘=设计——settings.json 本就是明文 token 载体）
   - 模型档位组 = 所填模型（verbatim 同值写全族 9 键）：`ANTHROPIC_MODEL` + `ANTHROPIC_DEFAULT_{FABLE,OPUS,SONNET,HAIKU}_MODEL` 及对应 `_MODEL_NAME`（现役文件同款键族；保证各档位一致直连）
   - **文件其余内容逐字节保留**（其余 env 键/其他顶层键不动）；写前备份 `settings.json.bak-<时间戳>`（同目录）；幂等（重复点=同值重写或明示「已是该值」）
   - 失败姿态：文件缺失=新建并在成功文案注明「已新建」；文件存在但 JSON 坏=拒绝写入、不覆盖、人话报错（附路径）
   - 响应不回显密钥；成功文案含「**重启会话后生效**」
3. **端点**（照现行 routes/api 模式与安全姿态）
   - `GET /v1/config/claude-fallback`：无鉴权（loopback 只读，照 runtime-info 先例）返回 {地址, 模型}；带管理令牌附密钥尾 4 位
   - `POST /v1/config/claude-fallback/restore`：**管理令牌 fail-closed**（照卡片三件套）；入参校验（三值非空、地址 http(s)、密钥长度照 UI 既有 ≥16 位门）
4. **测试**（照既有 test 风格，含 jsdom UI 断）
   - 端点：正常写/幂等/备份存在/密钥不回显/401 拒/非法地址拒/文件缺失与坏 JSON 失败姿态（不写坏）
   - UI：jsdom 区块渲染+三输入+点击调用+成功/失败态；首启链冒烟（UI 交付渲染验证门）
5. **验收锚**
   - ①**非作者真机走查（BOD 执行）**：填兜底三值→点→落盘三组值正确+其余字段逐字节无损+备份文件在
   - ②失败态走查：错误地址/错误密钥=人话报错、不写坏文件
   - ③回归：既有三套件全绿
6. **回滚锚**：`settings.json.bak-<ts>`（数据面）；功能 commit revert（代码面；只增不改无非相关面）

## 收口区

### 收口-FSD（2026-09-15 11:31:18 +0800 星期二，date 现查）

**交付 commit**：TriModel `14efe8e`（fsd 提交，CTO 审据挂此 SHA）——src/api/claude-fallback.ts（新）+routes.ts 接线+ui/index.html（#fb-zone）+test/claude-fallback.test.ts（新）+test/ui-boot.test.ts+scripts 两件。

**读数（四项）**：tests 219 / pass 214 / fail 0 / skipped 5（skip=原有 env-gated）；tsc 清零；JS 语法门过；真浏览器只读渲染验证过（.cto-walkthrough/fb-zone-first-launch.png + fb-zone-findings.json：区块在/三输入 password 态/现状展示 deepseek 现势/禁用链独立/零页面错误）。既有失败逐族归因：**零失败**（昨夜的 ui.e2e.gate W 系段位红昨夜已清零，非本任务面）。

**端点真机活体**（3333 已重启载新代码）：GET 读现值=CEO 手工命令现势（https://api.deepseek.com/anthropic · deepseek-flash[1M]）；带管理令牌附尾4（****2782）✓。

**证据指针**：快照 .cto-walkthrough/fb-zone-first-launch.png；findings .cto-walkthrough/fb-zone-findings.json；测试件 test/claude-fallback.test.ts（11 案）+test/ui-boot.test.ts「直连兜底区」3 案。

**待办（非本席）**：①BOD 真机走查（验收锚①②——**注意真机会写实际 ~/.claude/settings.json**，走查三值建议用现势同值验证幂等「已是该值」或明示替换值）；②CTO 审。**作者侧未点击真机还原按钮**（防误写真文件，点击流由 jsdom mock 全覆盖）。

**跨窗如实注记**：TriCompany `check-sync --all` 报 13/14 漂移=夜航01 任务1（TC-A/C 改组件）→任务2 TMV-1 重渲的**预期中间态**，非本任务引入；该读数供任务2 重渲前基线对照。

### 走查-BOD（非作者真机走查，验收锚①②）·2026-09-15 11:3x-11:4x +08（date 现查）

**run1（11:3x）= 阻断发现**：真浏览器点「还原兜底」→ 行内错「请填写服务地址」+ 超时（本席 13 步脚本，run1 5 过 fata 于 C 步）。
- **根因**：`server.ts:123` 读体条件仅 PUT → POST 体被丢 → handler 空 body→400。复现实锤：curl POST 全三值 → `{"error":"请填写服务地址"}`。
- **双盲区定性**：单测直调 handler（手工传 body）+ jsdom mock fetch → 真 HTTP 链路层零覆盖（第四型盲区同族）。
- **现场**：settings.json 逐字节未动（sha `3933435b…` 原样）、零 .bak——边界守住。证据：`fb-bod-walkthrough-run1-fail.json`。

**回修**：commit `6120e08`（读体条件扩 POST + 真链路回归 `test/claude-fallback-chain.test.ts` 四案 + 防复发自证=回退条件该件恰红）。读数：223 案 218 绿/0 失败/5 skip；tsc 零。

**run2（11:40）= 13/13 全绿**（`fb-bod-walkthrough-results.json`，脚本副本 `fb-bod-walkthrough.mjs`）：
- 区块渲染✓/现状展示含密钥尾4✓；坏地址/短密钥=人话错+**零请求零写入**✓
- 真写：三值落盘+9 键全族同值✓；其余字段（env 非靶键+顶层键）逐字保留✓；备份==原文件（sha 对）✓；无 tmp 残留✓；密钥框清空+现状自动刷新✓
- 幂等复点：「当前已是指定值…无需重写」+ sha 不变 + 不新备份✓
- **终态**：原文件字节恢复（sha `3933435b…` 一致）+ 测试备份已清✓

**裁决（走查前定，A 维持）**：9 键全族 verbatim 同值，不改。依据（claude-code 事实核查，有源）：①`_NAME` 系仅 `/model` 选择器展示名（非 API 模型 ID），抹平零风险；②应急语义=消灭一切残留旧模型 ID——留档位差异=新端点上残键必炸（正是按钮要防的事）；③`[1M]` 后缀=客户端 1M 上下文开关（发请求前剥除，provider 不见），属用户自填表达，脚本不发明剥离规则；④裁决 B 会使幂等判据永不成立（每点必写+必备份=设计退化）。
**行为注记（非缺陷）**：点击后 9 键统一=所填模型（含现值 HAIKU 裸名差异被拉平）——应急语义设计如此；如需档位差异可点后手改。

**FSD 自报①独立核实**：其活体实证（现势三值 POST 触发写→系统 .bak 逐字节恢复）经本席独立核 sha=原样=真；遗留备查件 `~/.claude/settings.json.bak-2026-09-15T03-36-20-824Z`（内容=原文件，可随时删）。

**走查判定：验收锚①②③全过；阻断级缺陷闭环（发现→打回→回修→复审全绿）。**
