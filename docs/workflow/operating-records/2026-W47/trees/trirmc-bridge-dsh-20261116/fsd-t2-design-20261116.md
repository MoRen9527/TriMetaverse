# T2 技术方案卷·session-bridge.ts 三 API 改指 dsh CLI 形（BOD 裁119②·FSD 主刀·候 CTO 门禁一审）

- 执行: m-duty-fsd；任务书 96f3b41b5 §三 T2；CTO 门禁五判据对表（r112③ 转达令面）+两基线沿用
- 状态: **方案稿候 CTO 门禁一审**（一审绿→编码施工·TriRMC 仓 dev 分支独立 commit 单笔族）
- 施工位实锚: /srv/fleet/TriRMC dev @ **e408da5**（净树零漂·origin=/srv/git/TriRMC.git·河源同锚 pull 对齐照 V2 线先例）

## 一、施工对象实锚（session-bridge.ts 现役 claude 形）

- 192 行·三 API：spawnSession（claude --bg -n <id> "<task>"→agentId·背景正则解析）／listAgents（claude agents --json→注册表）／sendMessage（claude -p --resume <sessionId> --fork-session "<msg>"→回复文本）
- 降权纪律现役：root systemd 跑 triMC 时 claude 子进程 runuser 到 fleet（HOME 注入形·env 面既有）
- 依赖面：node:child_process execFile promisify·DEFAULT_OPTIONS（claudeBin/cwd/agentsJsonTimeoutMs 30s/messageTimeoutMs 120s/spawnTimeoutMs 90s）

## 二、dsh CLI 契约面（T1a 活体探针五读数承录·COS T1 分性毕报卷）

- 版本: **0.2.0-rc.2 活体**（--version+--help 双探针绿·河源 face）
- CLI 形: `dsh [--profile] <name> [options] [app-args...]`（boot a DeepSeek Harness profile·plugin 子命令）
- 入口位: `/srv/fleet/dsh/node_modules/.bin/dsh`（bin 链接形·**河源 face**；sg 面无 /srv/fleet/dsh 安装=PATH 缺项处置三段承面）
- ~/.dsh 面: profiles（acp/headless/sdk/web 四 profile）+sessions（r-duty-{cao,cfo,cho,cmo,...} 工作区会话族）+storages；~/.dsh-workspaces r-duty-{...} 13 席
- PATH 面: **dsh 不在 PATH**（bash -lc 直呼 command not found 实勘）——T2 改造输入项

## 三、三 API 改指形（逐 API 设计）

### 3.1 spawn → dsh --profile headless boot 形

- 形: `dsh --profile headless -n <employeeId> "<task>"`（boot headless profile 会话·受限工具集=降权链默认）
- 返回解析: 会话标识提取（dsh boot 输出 session 标识面——首编码面以 --help 实测输出形定·解析器容错两形：标识行正则+JSON 行双试）
- 保持面: SpawnResult 接口形零改（ok/agentId/name/error）——调用方零波及
- 降权链: headless profile=受限权限形（danger-full-access 禁用照五判据②）；runuser 降权链保留（root systemd 面同理）

### 3.2 list → ~/.dsh/sessions 扫描形

- 形: `~/.dsh/sessions` 目录扫描（r-duty-{seat} 工作区会话族·session 文件 frontmatter/元数据读）→ AgentSession[]（agentId↔sessionId↔employeeId 注册表形保持）
- 备选面: session-controller API（如 dsh 提供·候 T1b 毕后探针补勘——本方案以文件扫描形为主案·API 形备选注记）
- 注册表映射: employeeId 注入链照现役（buildRegistry 合同加载注入形零改）

### 3.3 send → dsh --profile headless --session-id <uuid> "消息"

- 形: `dsh --profile headless --session-id <uuid> "<msg>"`（定向会话投递→回复文本）
- 返回解析: 回复文本提取（输出尾段文本形·容错两试同 3.1 解析器纪律）
- 保持面: SendMessageResult 接口形零改（ok/reply/error/timedOut）

## 四、五判据对表（门禁一审对表面）

### ④-1 seat→dsh 会话寻址映射表（语义基准①承载）

| 席（SendMessage target_seat） | dsh 会话寻址 | 映射规则 |
|---|---|---|
| m-duty-cos | r-duty-cos 工作区族 headless profile 会话 | seat 小写→r-duty-<seat>·profile=headless |
| m-duty-coo / m-duty-cao / m-duty-cpo / m-duty-cto / m-duty-cho / m-duty-cfo | r-duty-<seat 小写> 同形 | 同上 |
| m-duty-fsd / m-duty-sde / m-duty-bod 特例 | r-duty-fsd / r-duty-sde / bod=信箱面（非 dsh 域）| bod 面=信箱直达照 118 例外·不入 dsh 映射 |
| 兜底 | r-duty-<未知席> boot 新会话（spawn 形） | 未知席首信=spawn 新会话+映射表登记 |

- 语义保持三面: ①席位寻址=映射表确定性（禁隐式猜测）②自由文本信=send 消息体原样透传 ③回执链=SendMessageResult 回复文本照返——**席间消息语义零回退**（118 纪律 T4 基准承守）

### ④-2 降权链分级表（语义基准②承载）

| 会话类 | 权限 profile | 禁用面 |
|---|---|---|
| 评分会话（dimA/dimB 判读·I 族评分） | **受限工具集**（headless profile 缺省降权形） | danger-full-access 禁用（除非逐席正当化+卷面正当化注·五判据②原文） |
| 值守/采集会话（值席 patrol 采集） | 受限工具集 | 同上 |
| 正当化例外面 | 逐席正当化+卷面 commit 凭据（r111 governs 承形） | 候 CEO 显式令面 |

- dsh 原型 Sessions.ensure 权限形=CTO 源勘在档（引用面·本席零转抄改动）

### ④-3 状态机全形（五判据③·禁隐式状态三件）

状态集（SendMessage 会话态枚举）:
- `idle`（会话在册无在途消息）
- `sending`（消息投递中——dsh 子进程在跑）
- `awaiting-reply`（投递毕候回复——messageTimeoutMs 窗内）
- `delivered`（回复文本回执毕）
- `failed`（投递败/超时/解析败——error 载明）

迁移表（状态×事件→动作）:

| 现态 | 事件 | 动作 | 次态 |
|---|---|---|---|
| idle | send 请求 | spawn dsh send 子进程 | sending |
| sending | dsh exit 0+输出非空 | 提取回复文本 | delivered |
| sending | dsh exit 0+输出空 | 重试一次（单重试）→仍空=error 载明 | failed |
| sending | timeout（messageTimeoutMs） | kill 子进程+timedOut=true | failed |
| failed | 重试请求（调用方） | 重入 sending | sending |

失败路径三件: ①dsh 二进制缺席（PATH 三段全落空）=fail-visible 报错（error 载三段探测详情）②解析败=error 载原始输出尾段 200 字 ③超时=timedOut=true+killSignal SIGKILL——三件全显式枚举零隐式态。

### ④-4 PATH 解析序三段（五判据④·禁静默回退）

1. **显式段**: dshBin override（SessionBridgeOptions.dshBin=绝对路径·调用方显式注入）
2. **fallback 探测段**: 探测序=env TRIRMC_DSH_BIN → `/srv/fleet/dsh/node_modules/.bin/dsh`（T1a 实勘位）→ `which dsh` 形——逐段 existsSync 首中即用（探测命中=读数面记录）
3. **fail-visible 报错段**: 三段全落空 → `error: 'dsh binary not found（三段探测详情: 显式=X/实勘位=Y/PATH=Z）'`——**禁静默回退 claude**（fail-visible 照五判据④原文）

### ④-5 零依赖凭据声明（五判据⑤）

- 构造段（bridge 三 API 改指形）**零 key 需求**——dsh profile 凭据面（GLM/DEEPSEEK 族）=dsh 进程自身消费（T1b CI 配置管线域·r119②裁）——bridge 面零引凭据前置 ✓
- 现役 claude 形的 ANTHROPIC 族依赖随改指形一并消失（零依赖面净收益如实注）

## 五、两基线沿用对表

- T4 语义基准=SendMessage（席位寻址/自由文本信/回执链三面）——§四-1 映射表+§三.3 send 形承载 ✓
- T5 断言 3 按 SendMessage 通道验证——白盒测试族=SendMessage 通道形验证（spawn/list/send 三 API 白盒+PATH 三段+状态机迁移全谱）照落 ✓

## 六、编码工序（候 CTO 门禁一审绿即启）

1. session-bridge.ts 改形（三 API+dshBin 三段解析+状态机枚举·单笔 commit）
2. 白盒测试族（test_session-bridge-dsh.test.ts：三 API 形+PATH 三段+状态机迁移全谱+mock dsh 形）
3. 毕报双通道（W47 桥改造树卷+SendMessage 值席）
- 回滚: 单 commit revert 一键形前置声明（施工单笔族纪律）

## 七、使用依据

BOD 裁119② 派工令（值席分诊·工序面 COS 径裁）；COS T1 分性毕报卷（dsh 0.2.0-rc.2 五读数+T1b 三裁）；CTO 门禁五判据+两基线令面；session-bridge.ts e408da5 现役形实读；STE 设计卷 abcdf26ac（判据面参照）
