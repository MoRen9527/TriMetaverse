# STE·r5 非作者走查+R 面配置真值测试+DeepSeek 切换读数卷（三段并一卷）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/ste-r5/ste-r5-walkthrough-and-config-truth-20261007.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-06T19:16:30Z（03:16+0800 2026-10-07）
- 席位: STE 小柯（m-ste）· 非作者独立走查+配置真值测试（CEO 授权）
- 令源: BOD 派工令（2026-10-07 02:55+0800，CEO 02:54 直令·三段并一卷）+BOD 追加令（03:01，DeepSeek 段）+BOD 裁定（03:1x，守卫冲突 a 案）

## 〇、判读（先答）

**走查① PASS（全绿）**；**真值② 遇阻转对照链推进中**（阻塞缺陷已裁定 a 案修复派 FSD r5b，本席候部署毕复测）；**DeepSeek③ 实搜毕、配置链候 r5b**。

- 走查①：四域卡同构五件+交互级五项+r3b 回归——全绿。
- 真值②：真 Key 保存链被 server 守卫 400 阻塞（trimmc-card.ts L162 密钥正则拒 ANTHROPIC_AUTH_TOKEN/API_KEY 键名）→BOD 裁 a 案（两键精确名白名单豁免）候 FSD r5b 部署毕本席复测；**守卫只拒密钥键名的边界+「拉→落→效」全链主体已用无 Key 对照链闭合实证**（保存 200 v1→拉取→落盘 settings.json→applied 回执 ok→UI 四态机「已落生效」全绿）。
- DeepSeek③：官方源实证毕（base_url=https://api.deepseek.com/anthropic、模型 deepseek-chat（实测映射 deepseek-v4-flash）/deepseek-reasoner、认证形态 ANTHROPIC_AUTH_TOKEN）；**Key 活性直探 200 全绿**（真调用 end_turn+usage 正常）；配置链候 r5b；生效级受 env 钉定语义约束候 CEO 裁（§3.4）。
- **现势重大发现（候裁入卷）**：R-HY 现役路由=OpenRouter（api-token.env 的 ANTHROPIC_API_KEY/ANTHROPIC_BASE_URL env 钉定）——**settingOrEnv 语义 env 优先，表单值压不过 env 钉定**：即使表单保存成功，TriRMC→宿主投影的生效级语义受 env 面约束，真切换 DeepSeek 需动 env 面（涉 unit 重启=边界外）→候 CEO 裁。

## 一、走查①读数（非作者 playwright 走查·全绿）

- 对象面：`http://8.155.54.79:3333/ui#connect`（R-HY 3333）· r5 部署面 **5188e7f** · 本机 `127.0.0.1:3333` 对照面指纹一致
- 版本锚：TriModel **5188e7f**（r5 表单增补·cc-switch 对齐 CEO 23:41 批·裁A，2026-10-07 00:06）；dev==origin/dev

### 1.1 四域卡同构五件（活体断言 4 卡×5 件全绿）

| 件 | 断言 | 读数 | 判 |
|---|---|---|---|
| ①密钥行 | input[type=password]+眼睛钮「显示」 | 4/4 卡在位 | **PASS** |
| ②认证字段 | select 2 opts（ANTHROPIC_AUTH_TOKEN 默认/ANTHROPIC_API_KEY） | 4/4 默认 AUTH_TOKEN | **PASS** |
| ③API 格式 | select 4 opts（anthropic 默认/openai-chat/openai-responses/gemini） | 4/4 默认 anthropic | **PASS** |
| ④1M 上下文 | checkbox data-cd-1m | 4/4 在位 | **PASS** |
| ⑤双钮 | 「保存本域配置」data-cd-save+「放弃改动」data-cd-reload | 4/4 在位 | **PASS** |

- 表单行数 formRows=**13**（=main 3+高级 4+开关 6）四卡精确对表 ✓
- 裁A警示：「需本地路由，TriModel 现役仅支持 Anthropic Messages 直连」warn span 初态 hidden（selected=anthropic）✓
- 四签正名：M 面·服务域/M 面·本地域/R 面·服务域/R 面·本地域+菜单 menu-full 在位 ✓

### 1.2 交互级五项（闭环全绿）

| # | 交互 | 读数 | 判 |
|---|---|---|---|
| 1 | 眼睛显隐 | password↔text toggle+「显示/隐藏」文案随切 | **PASS** |
| 2 | 认证字段切换→预览键名跟随 | AUTH_TOKEN→API_KEY 切换后配置预览键名同步 | **PASS** |
| 3 | API 格式四选项+裁A警示 | 切 openai-chat→warn 显；预览**零格式键**（不落盘断言 UI 侧） | **PASS** |
| 4 | 1M 勾→[1m] 尾缀 | 勾选→模型值尾缀 [1m]（CONN_1M_RE=/\[1m\]$/i 加剥双向）+预览联动 | **PASS** |
| 5 | 保存/放弃双钮 | 放弃→重渲清场零脏残留；保存链见 §二 | **PASS** |

### 1.3 r3b 回归+对照面

- 四签端口对等 4/4 未破（TriMMC·M-SG 8712/TriMLC·本机 8713/TriRMC·R-HY 8712/TriRLC·本机 8711）——r3b 单点闭环保持
- 冷态几何 menuRight=420 ≤ mainLeft=434 pass（二轮基线无漂移）
- 本机 127.0.0.1:3333 对照面：四域卡结构指纹与 R-HY 完全一致（同版本 5188e7f 面）

## 二、真值②读数（R 面服务器配置真值测试·CEO 授权）

### 2.0 备份锚（先行动作）

- `/var/lib/trirmc/settings.json`：**ABSENT**（首落前空态自洽）· 记录时点 2026-10-06T18:47Z
- `/var/lib/trirmc/config-cache.json`：612B · sha256 前16=**d4b610c89be00737** · mtime 2026-10-06T18:47:23Z（加密形态不作读数对象，key-cache.ts L211 encrypted 写入印证）
- api-token.env 值面经 BOD 授权单次曝光在案（TRIMODEL 双 token+ANTHROPIC_* OpenRouter 值）——**操作瑕疵自领**：SSH grep 未滤 token 行致 TRIRMC_INTERNAL_TOKEN 全值回显一次，BOD 裁定操作瑕疵非安全事故不提前轮换（10-02 channel.cmd 案同构口径），挂候办「值面回显家族第三例」候 CAO 攒批。

### 2.1 连接态建立（前置）

- 冷态保存 401（UI 无 admin 令牌）→读 api-token.env 取双令牌填 UI 连接（值面单次曝光授权形）→已连接（4/4 数据卡在场）——**顺带闭环二轮卷挂的「连接态活体候令牌授权」观察项**：连接态几何/骨架与冷态同构（menu-full 恒挂），r2 §2.2 代码面推定获得活体补证。
- 坑注记：连接流程重渲清空已填表单（回灌存量）——Key 需重填再保存（UI 交互面已知行为，非缺陷，走查①交互级已覆盖重渲回灌路径）。

### 2.2 阻塞缺陷实锚（400·已裁定）

- 操作：rmc 卡填真 Key（sg-glm-direct.txt，len49 bare token，掩码 sk-… 尾4=…Dmsf 自取自填）→保存→**HTTP 400**
- 报文：「本地配置项…疑似密钥——密钥禁入本地配置表，各域密钥走域卡条目域内自管」
- 根因实锚：TriModel `src/api/trimmc-card.ts` **L162** 守卫正则 `/(^|_)(api[_-]?keys?|tokens?|secrets?|passwo?rds?|passwd|private[_-]?keys?|credentials?)($|_)/i` 拒 ANTHROPIC_AUTH_TOKEN/API_KEY 键名
- 泛化面实锚：四域卡 PUT 全部复用同一 handler（routes.ts L170→config-cards.ts L208 handlePutConfigCard→handlePutTrimmcCard）——**r5 密钥行（data-cd-keyref 落认证字段键）与 r4 旧语义守卫系设计级冲突，四卡同撞**
- 家族定性：jsdom ②i 单测绿+真链路 400=**ui-delivery-render-gate 09-15 家族第三次活体再现**（单测直调+jsdom mock 对 server 守卫双盲）——候 CAO 注记在账（BOD 同窗定性）

### 2.3 BOD 裁定入卷（03:1x）

- **a 案采行**：守卫加 ANTHROPIC_AUTH_TOKEN/ANTHROPIC_API_KEY 两键**精确名白名单豁免**；正则黑名单其余照旧（api_key/token/secret 泛拦面保留，不因豁免松整体防线）
- b 案否决理由：provider_entries 密文条目不落 settings.json env，宿主 Claude Code 读不到=切换不生效（断产品语义）
- c 案否决理由：推翻 CEO 23:41 裁决（密钥进表单明文落 settings.json 投影，对齐 cc-switch+CEO 本机现势同形态背书），不可采
- 密文存储候办另议不阻本轮；修复派 FSD **r5b 小轮**在发，部署毕本席复测 Key 保存链

### 2.4 无 Key 对照链（不受阻面·200 成功）

- 操作：rmc 卡清 Key 行+ANTHROPIC_MODEL=**glm-5.3-flash**→保存→**HTTP 200**
- 卡面读数：phase=**已存未拉**；配置版本 **v1**（2026-10-06T19:11:59.100Z）；上次下发 2026-10-06T19:11:47.661Z（ok）；落盘结果暂无回写
- 结论三锚：**守卫只拒密钥键名**（MODEL 键放行，缺陷边界钉窄）/ **保存链+版本单调 v1 正常** / **daemon 拉取轮活体**（19:02:23Z、19:11:47Z 两轮，间隔实测 ~9.4min≈600s 级 tier1 周期）
- 候补段 A（拉取轮落盘断言·**已闭合全绿**）：见 §2.5

### 2.5 拉取→落盘→生效链断言（候补段 A·2026-10-06T19:17-19:25Z 全链闭环）

**server 值面三锚**：

| 锚 | 读数 | 判 |
|---|---|---|
| settings.json 首落 | 104B · sha256前16=**4d30cf347b00e739** · mtime 2026-10-07T03:17:23.657+0800 | **PASS** |
| 文件值面 | updated_at=2026-10-06T19:17:23.658Z（与 mtime 毫秒级吻合）· items 键名=[ANTHROPIC_MODEL] · 值=glm-5.3-flash · **零密钥键**（has_secret_keys=False，对照链自洽） | **PASS** |
| applied 回执 | card.status.local_config={version_applied:**1**, applied_at:19:17:23.716Z, write_result:**ok**, file:/var/lib/trirmc/settings.json} | **PASS** |

**ledger 面**：ledger.faces.rmc={last_pull_at:19:17:23.655Z, last_pull_from:**remote**, last_pull_result:ok, applied_state:**applied**, applied_tier:1, local_config:同上回执}；顺带读数 mlc face=19:17:54.626Z loopback ok（四卡 tier1 各自错峰拉取活体）。

**UI 四态机活体**（cd-rmc pane）：
- phase 徽章=**已落生效**；state 行全文「配置版本 v1（2026-10-06T19:11:59.100Z）· 上次下发 2026-10-06T19:17:23.655Z（ok）· 落盘结果 v1 ok → /var/lib/trirmc/settings.json」
- 截图：本目录 ste-r5-rmc-applied-20261007.png（rmc tab 激活态）

**时序闭环**：保存 19:11:59.100Z（v1）→daemon 拉取 19:17:23.655Z（remote ok）→落盘 19:17:23.716Z（61ms 内 write ok）→UI 显形「已落生效」。**拉取周期实测修正：~5.6min 级**（19:11:47→19:17:23；此前 9.4min 系两次观测间隔推算偏大，卡间 stagger 错峰所致——周期读数以 ledger 连续观测为准）。

**「拉→落→效」主体验证结论**：无 Key 对照链完整走通 r5 设计全链（UI 保存→PUT 200→daemon tier1 拉取→version 变更判定→原子落盘→applied 回写→UI 四态机转「已落生效」）——**链路本体零缺陷**；唯一阻塞=守卫拒密钥键名（§2.2，a 案修复中）。

**排障注记（本席抓样两坑，自领入卷）**：
1. **closest 收敛抓样污染**：`[data-cd-save]` 按钮向上 closest（'div[class*=card]…'）收敛到页面级大容器——四「卡」读数实为同一容器第一 pane（mmc）初态+页头说明文字的重复抓样，误判「UI 显未配置」；实为抓样缺陷非 UI 缺陷（UI 渲染层自始正确）。正形=pane 用 id 精确抓（`cd-<f>`）。
2. **bfcache 旧页快照**：navigate 首读「v1+上次下发 19:11:47（ok）落盘结果暂无回写」系 19:17 拉取前旧页实例快照（缓存假阴性，r3b 同族再现）——部署主张与活体读数矛盾时先 `fetch('/ui',{cache:'reload'})` 分离服务器真值（r3b 教训复用有效）。
3. hidden pane 的 innerText 为空串（display:none 区）——断言抓样用 textContent 或先切 tab 激活。

## 三、DeepSeek 段读数（追加令③）

### 3.1 端点/模型官方源实证（网搜毕，禁凭记忆达成）

- **Anthropic 兼容 base_url=`https://api.deepseek.com/anthropic`**——官方文档 api-docs.deepseek.com/zh-cn/guides/anthropic_api 实证；与 UI 常量 PROVIDER_DEFAULT_BASEURL.deepseek（ui/index.html L1855）**吻合互证**（UI 旁证升官方源背书）
- **模型 ID**：`deepseek-chat`（非思考）/`deepseek-reasoner`（思考）——官方文档实证
- **认证形态**：官方 Claude Code 接入教程（api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code）示例 `ANTHROPIC_AUTH_TOKEN=${DEEPSEEK_API_KEY}`——**Bearer 形→本域认证字段保持默认 AUTH_TOKEN 不切**（如误切 API_KEY=x-api-key 形，兼容层认证行为未获官方文档背书，不冒进）
- API 格式：anthropic（默认）保持——Anthropic Messages 直连，无裁A警示触发面
- Key 源：deepseek.txt（同目录，掩码 sk-…尾4=…6863）

### 3.2 配置链（候 r5b·候补段 B）

- 切换三件套：ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic + ANTHROPIC_AUTH_TOKEN=<DeepSeek Key> + ANTHROPIC_MODEL=deepseek-chat（1M 勾不勾：deepseek 系不适用 [1m] 尾缀语义，保持不勾）
- 保存→落盘断言→生效级三锚（curl DeepSeek 真调用掩码/settings.json 值面断言/宿主无头烟测软锚）——【候补：r5b 部署毕执行】

### 3.3 Key 活性直探（不经 daemon·候补段 C·已闭合）

- 执行形：Key 文件 stdin 管道传 R-HY /tmp（chmod 600）→远端变量法 curl→输出结构面过滤（值面零回显零进命令行）→**Key 文件即删**（keyfile-cleaned）
- 读数（2026-10-06T19:17Z）：POST `https://api.deepseek.com/anthropic/v1/messages`（Authorization Bearer）→**HTTP 200** · id=26c1d3d0-42d5-… · stop_reason=**end_turn** · text=「在线」· usage={input 9/output 1}——**Key 活性+Anthropic 兼容端点可达双锚全绿**
- **模型映射实证**：请求 model=`deepseek-chat` →响应回显 **`model: "deepseek-v4-flash"`**——deepseek-chat 系非思考别名，2026-10 现势实际映射 deepseek-v4-flash（网搜文档+活体回显双证）
- 出口面：R-HY 直连 api.deepseek.com 可达（无代理依赖，与 OpenRouter 现役路由并存无冲突）

### 3.4 生效级语义边界（候裁入卷·关键）

- R-HY 现役路由=**OpenRouter**：api-token.env 的 `ANTHROPIC_API_KEY=sk-or-v1-…`+`ANTHROPIC_BASE_URL=https://openrouter.ai/api` env 钉定（trimodel.service EnvironmentFile）
- `settingOrEnv` 语义（TriRMC local-settings.ts）：**env 钉定优先，settings 表单值只补 env 未钉位**——表单保存 DeepSeek 配置后，若 env 面不撤，宿主投影面仍走 OpenRouter env 值=**切换不生效**
- 真切换需动 env 面（api-token.env 改写+trimodel.service 或 trirmc unit 重启）=**TriRMC 双 unit 零触碰边界之外**→候 CEO 裁（终态 GLM/DeepSeek 并列呈报）
- 本席边界内可达成面：表单保存+落盘断言（settings.json 值面=切换意图已持久化）；生效级真调用三锚中 curl 直探可验 Key 活性（不经 daemon）；daemon 消费投影面受 env 约束如实呈报候裁

### 3.5 managed 条目域现势发现（2026-10-06T19:2xZ 勘验·供裁决面参考）

- rmc 卡 provider_entries 含 **e-deepseek-anthropic**（provider=deepseek，model=deepseek-flash，base_url=https://api.deepseek.com/anthropic，api_key_encrypted 密文在位，enabled=true，建档 2026-09-27）——**DeepSeek 条目域配置早在卡**（M0 时代密文条目面），与 r5 local_config 表单面为**两条并存通道**
- 「三窗切换」时域规则在役（00-14 glm / 14-18 deepseek / 18-24 glm）+「默认模型」规则=e-glm-anthropic——条目域策略机现役态
- 语义注记：条目域（provider_entries 密文+策略机）与 local_config 表单（明文投影 settings.json）系两代设计并存；本令③范围=r5 表单面切换，条目域现势如实呈报不扩大动作面

## 四、流水线读数（独立复跑·禁转抄）

- 本地 TriModel 仓 5188e7f 顶实跑：`node --import tsx --test --test-concurrency=1 test/*.test.ts`（后台全量）
- TAP 读数：**tests 347 / suites 80 / pass 333 / fail 0 / cancelled 0 / skipped 14 / todo 0**（零 not ok 行）· duration 100.5s
- 与 FSD r5 commit 注（UI 四门 52/52、全量 347/333/0/14）四项全对齐——独立复跑验证毕
- skipped 14 系既有 skip 形态（与 commit 注一致），非本轮新增

## 五、落盘现势（如实报·候裁项标注）

| 面 | 现势 | 候裁 |
|---|---|---|
| R-HY `/var/lib/trirmc/settings.json` | **已落**（v1 ok：items={ANTHROPIC_MODEL: glm-5.3-flash}，19:17:23Z，sha 前16=4d30cf347b00e739） | 对照形态（无 Key 无 BASE_URL 改动）保留 or 清理候 CEO 裁 |
| rmc 卡 local_config | MODEL=glm-5.3-flash v1+applied 回执 ok | 同上 |
| rmc 卡条目域 | 未动（DeepSeek/GLM 密文条目+三窗规则原样） | — |
| R-HY 现役路由 | OpenRouter env 钉定未动 | DeepSeek 真切换需动 env 面（unit 重启边界外）候 CEO 裁 |
| TriModel 源 | 5188e7f 未动（守卫修复归 FSD r5b） | a 案修复在途 |
| TriRMC 双 unit | 零触碰（边界遵令） | — |

## 六、使用依据

- BOD 派工令（02:55 CEO 直令）+追加令（03:01 DeepSeek 段）+裁定（a 案）
- TriModel 5188e7f 源码（ui/index.html r5 表单/trimmc-card.ts L162 守卫/config-cards.ts 泛化链/routes.ts 路由）
- TriRMC local-settings.ts（settingOrEnv env 优先语义）/key-cache.ts（tier1 拉取+landLocalConfig）
- R-HY 活体（SSH：api-token.env/trirmc 目录/settings.json 空态）
- playwright 活体读数（R-HY 3333 + 本机 127.0.0.1:3333 对照）
- DeepSeek 官方文档（api-docs.deepseek.com anthropic_api 指南+claude_code 接入教程）
- 本地流水线 TAP（独立复跑）
- r2/r3 底稿（回归基线+连接态观察项闭环来源）

## 状态条（M-001）

- date 现查：2026-10-06T19:15:58Z（03:15:58+0800 Wednesday）
- 水位自估：中（走查毕+对照链在途+r5b 复测候触发；DeepSeek 生效级候 CEO 裁）
- 末次活动：2026-10-06T19:16:30Z（落卷现查时刻）
