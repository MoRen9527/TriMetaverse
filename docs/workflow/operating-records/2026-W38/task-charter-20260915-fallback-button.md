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
（执行席追加：## 收口 + 时间（现查）+ 读数 + 证据指针）
