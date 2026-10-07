# STE·r5 非作者走查+R 面配置真值测试+DeepSeek 切换读数卷（三段并一卷）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/ste-r5/ste-r5-walkthrough-and-config-truth-20261007.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-06T19:16:30Z（03:16+0800 2026-10-07）
- 席位: STE 小柯（m-ste）· 非作者独立走查+配置真值测试（CEO 授权）
- 令源: BOD 派工令（2026-10-07 02:55+0800，CEO 02:54 直令·三段并一卷）+BOD 追加令（03:01，DeepSeek 段）+BOD 裁定（03:1x，守卫冲突 a 案）

## 〇、判读（先答）

**三段全闭合：走查① PASS（全绿）·真值② PASS（r5b 复测毕+全链闭环）·DeepSeek③ PASS（投影面切换达成）**：

- 走查①：四域卡同构五件+交互级五项+r3b 回归——全绿；流水线独立复跑 347/333/0/14 与 commit 注全对齐。
- 真值②：守卫 400 阻塞→BOD 裁 a 案→FSD r5b（73ca1cc）部署毕本席复测 **PASS**（三形态保存全 200：假 Key/智谱形真 Key/DeepSeek sk 形——修复面关闭实证）；无 Key 对照链+密钥链双路「拉→落→效」全链闭环（双 unit settings.json 落盘+applied 回执+UI 四态机「已落生效」全绿）。
- DeepSeek③：官方源实证+Key 活性直探 200 全绿+**切换已持久化到投影真源**（双 unit settings.json v4=BASE_URL api.deepseek.com/anthropic+MODEL deepseek-chat+AUTH_TOKEN 掩码，零多余键）；UI 终态「已落生效」；宿主级验证候宿主席（R-HY 现无，烟测不可判如实作废）。
- **语义勘验修正（自领）**：原「env 钉定压制表单值=切换不生效」判断系消费面误置——env.ts 实锚 settings.json ANTHROPIC_* 消费者=宿主接入面（LG-058 N5「效」步），与 daemon env 并行两轨；**零 env 动作、零 unit 重启已达成投影面切换**（§3.4 订正）。
- **现势发现（候关注）**：双 unit（trirmc 8712/trirmc-mc 8710）均拉卡各落各盘+回执竞争回写（§2.7）——数据无损害，语义面候 CTO/FSD 关注；拉取周期 15min 级实证（修正此前 5.6min 误推断）。

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

### 2.5 拉取→落盘→生效链断言（候补段 A·2026-10-06T19:17-19:25Z 全链闭环·首验对照链）

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

### 2.6 r5b 守卫豁免复测（FSD 73ca1cc 部署毕·19:31-19:33Z 三步保存序列）

FSD 毕报触发（19:28:16Z active，两键精确名白名单+变体泛拦照旧+真链卷两态断言 3/3 绿）。本席按衔接令复测，**纪律遵 FSD 令：假 Key（sk-test 形）先行，真值随后**：

| 步 | 内容 | 保存读数 | 判 |
|---|---|---|---|
| 步1 | 密钥行（AUTH_TOKEN 键）填**假 Key** sk-test-r5b-guard-check →保存 | **200**，v2（19:31:29.368Z），预览含键联动正常 | **PASS**（400 消失·豁免活体） |
| 步2 | 密钥行填**真 Key**（sg-glm-direct，智谱形 …Dmsf）→保存 | **200**，v3（19:32:34.863Z） | **PASS**（真值面过守卫） |
| 步3 | DeepSeek 态三件套（BASE_URL=api.deepseek.com/anthropic+Key=sk-…6863+MODEL=deepseek-chat）→保存 | **200**，v4（19:33:00.245Z），预览三键齐（BASE_URL/AUTH_TOKEN/MODEL） | **PASS**（切绑保存毕） |

- **r5b 修复复测结论：PASS**——三形态（sk-test 假 Key/智谱中点形真 Key/DeepSeek sk 形）全部 200，03:11 报的密钥行必 400 缺陷**修复面关闭实证**；黑名单泛拦面未松（FOO_API_KEY/小写变体由 FSD 真链卷覆盖，本席不重复）。
- 步1 回执链活体：v2 保存→19:32:23 拉取→落盘回执「v2 ok → /var/lib/trirmc/settings.json」——**拉→落→效链对密钥键内容同样成立**（非仅 MODEL 键）。

### 2.7 双 unit 落盘拓扑现势（勘验发现·如实入卷候 CTO/FSD 关注）

- **双 unit 实锚**（systemctl show/cat 只读探针）：trirmc=8712·127.0.0.1·CONFIG_DIR=/var/lib/trirmc；trirmc-mc=**8710**·0.0.0.0·CONFIG_DIR=/var/lib/trirmc-mc——两 daemon 均引用同一 api-token.env+同一 TriModel API，**都在拉 rmc 卡 local_config 各落各盘**
- v1→v4 全程双落实证：trirmc 落 19:17:23(v1)/19:32:23(v2)/19:47:23(v4)；trirmc-mc 落 19:26:47(v1)/19:41:47(v4)
- **回执竞争回写**：卡面 status.local_config 回执字段被两 daemon 交替覆盖（19:31 UI 回执=trirmc-mc 路径→19:32=trirmc 路径→终态=trirmc 路径）——回执 file 字段**单值语义在双写者下不确定**，如实记录；数据面无损害（两处文件内容一致 v4）
- **拉取周期修正**：15min 级实证（trirmc 19:17:23→19:32:23→19:47:23；trirmc-mc 19:26:47→19:41:47——各 15min 整）；§2.4 的 ~5.6min/9.4min 推断系两 daemon 交错回写误读，**以 15min 为准**（tier1 refreshIntervalS=900s+stagger 吻合）
- 零触碰遵令：本席对双 unit 仅只读探针，未动任何 unit/服务进程

### 2.8 终态回滚执行（CEO 2026-10-07 07:08 裁·BOD 派工令·回滚 GLM 态）

- **执行**（2026-10-06T23:10Z）：rmc 卡照 §2.6 步2 已验 v3 形态原样重存——密钥行=智谱真 Key（…Dmsf 同值）+MODEL=glm-5.3-flash+**BASE_URL 清空**（v3 无端点键，照快照原样勿手填新变体）→**保存 200，v5=23:10:01.165Z**（预览两键 AUTH_TOKEN+MODEL、零 deepseek 残留、phase 已存未拉）
- **双 unit 落盘终态断言**（轮询至 23:18:02Z 全落）：

| 面 | updated_at | sha 前16 | 键名清单 | TOKEN | 判 |
|---|---|---|---|---|---|
| /var/lib/trirmc/settings.json | 23:17:23.715Z | **caa204d2be504761** | [ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL] | …Dmsf len49 | **PASS** |
| /var/lib/trirmc-mc/settings.json | 23:11:47.670Z | **44f773de32d832b1** | [ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL] | …Dmsf len49 | **PASS** |

- BASE_URL 键双面 ABSENT（已清）✓ · MODEL=glm-5.3-flash ✓ · 零多余键 ✓
- **UI 复位**：整页强刷后 phase=**已落生效**；state 行「配置版本 v5（23:10:01.165Z）· 上次下发 23:17:23.712Z（ok）· 落盘结果 v5 ok → /var/lib/trirmc/settings.json」；表单回灌 glm-5.3-flash+BASE 空+pwLen=49（同值）
- **拉取周期第四证**：trirmc 23:02:23→23:17:23、trirmc-mc 22:56:47→23:11:47（15min 整链系）；源码级实锚 KEY_REFRESH_INTERVAL_S_DEFAULT=15*60（key-cache.ts L222）
- 触发径选径注记：TriRMC server 面无手动触发拉取 POST API（app.ts 无 post 路由；调度=_refreshTimer+stagger）——走自然拉取轮，双落 8min 内全齐
- **回滚毕判定：PASS——R-HY 配置终态=GLM 态（v5），CEO 07:08 裁执行毕**

### 2.9 DeepSeek 态作废注记（BOD 令③·留卷备查）

- v4 DeepSeek 态（§2.6 步3/§3.2/§3.4）**作废**——作废时点=CEO 07:08 裁；测试数据全读数留卷备查不删除（append-only evidence）：v4 保存 23:33Z 序列（19:33:00.245Z）、双 unit v4 sha（trirmc 3e497758fb1d2529/trirmc-mc 374846d20ccfa9c7）、UI 已落生效读数、Key 活性直探 200——DeepSeek 切换技术可行性证据链完整在卷，候未来重启用

## 三、DeepSeek 段读数（追加令③）

### 3.1 端点/模型官方源实证（网搜毕，禁凭记忆达成）

- **Anthropic 兼容 base_url=`https://api.deepseek.com/anthropic`**——官方文档 api-docs.deepseek.com/zh-cn/guides/anthropic_api 实证；与 UI 常量 PROVIDER_DEFAULT_BASEURL.deepseek（ui/index.html L1855）**吻合互证**（UI 旁证升官方源背书）
- **模型 ID**：`deepseek-chat`（非思考）/`deepseek-reasoner`（思考）——官方文档实证
- **认证形态**：官方 Claude Code 接入教程（api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code）示例 `ANTHROPIC_AUTH_TOKEN=${DEEPSEEK_API_KEY}`——**Bearer 形→本域认证字段保持默认 AUTH_TOKEN 不切**（如误切 API_KEY=x-api-key 形，兼容层认证行为未获官方文档背书，不冒进）
- API 格式：anthropic（默认）保持——Anthropic Messages 直连，无裁A警示触发面
- Key 源：deepseek.txt（同目录，掩码 sk-…尾4=…6863）

### 3.2 配置链（候补段 B·**已闭合全绿**）

- 切换三件套保存（§2.6 步3）：v4=19:33:00.245Z 200——BASE_URL=https://api.deepseek.com/anthropic+AUTH_TOKEN=sk-…6863（掩码）+MODEL=deepseek-chat；1M 不勾（deepseek 系不适用 [1m] 语义）
- **双 unit 落盘终态断言**（掩码）：

| 面 | updated_at | sha 前16 | items 值面 | 判 |
|---|---|---|---|---|
| /var/lib/trirmc/settings.json | 19:47:23.670Z | 3e497758fb1d2529 | BASE_URL=api.deepseek.com/anthropic · MODEL=deepseek-chat · AUTH_TOKEN=sk-9a…6863 len35 · 零多余键 | **PASS** |
| /var/lib/trirmc-mc/settings.json | 19:41:47.662Z | 374846d20ccfa9c7 | 同三键同值 | **PASS** |

- **UI 终态活体**（整页强刷后）：phase=**已落生效**；state 行「配置版本 v4（19:33:00.245Z）· 上次下发 19:47:23.667Z（ok）· 落盘结果 v4 ok → /var/lib/trirmc/settings.json」；表单回灌 deepseek-chat ✓
- 观察项（如实记录非缺陷）：**存量密钥 DOM value 回显**——v4 有密钥后密钥行 password input value 回灌 35 字符（视觉掩码但同源脚本可读）——cc-switch 对齐的编辑面语义（所见即所存），r5 设计面内；同源可读面特性供 CAO/FSD 知晓

### 3.3 Key 活性直探（不经 daemon·候补段 C·已闭合）

- 执行形：Key 文件 stdin 管道传 R-HY /tmp（chmod 600）→远端变量法 curl→输出结构面过滤（值面零回显零进命令行）→**Key 文件即删**（keyfile-cleaned）
- 读数（2026-10-06T19:17Z）：POST `https://api.deepseek.com/anthropic/v1/messages`（Authorization Bearer）→**HTTP 200** · id=26c1d3d0-42d5-… · stop_reason=**end_turn** · text=「在线」· usage={input 9/output 1}——**Key 活性+Anthropic 兼容端点可达双锚全绿**
- **模型映射实证**：请求 model=`deepseek-chat` →响应回显 **`model: "deepseek-v4-flash"`**——deepseek-chat 系非思考别名，2026-10 现势实际映射 deepseek-v4-flash（网搜文档+活体回显双证）
- 出口面：R-HY 直连 api.deepseek.com 可达（无代理依赖，与 OpenRouter 现役路由并存无冲突）

### 3.3b 宿主无头烟测（软锚·**不可判如实作废**）

- 本机降级等效尝试（settings.json 终态三键同值起 claude -p 一句）：**会话能起**（回复「在线」）但 `[claude-code:unrecognized_model] {"model":"glm-5.3-flash"}`——**本机 settings env 覆盖 shell env**（已知家族：settings env > shell env），请求被钉回本机 GLM 形态——三键投影形态未获剥离验证，**烟测不可判，作废不作锚**（BOD 令③「仅供参考不作硬锚」预期风险兑现）
- R-HY 面宿主烟测对象缺失（无 claude CLI+无 ~/.claude+tmux 空）——**宿主级烟测候宿主席部署 R-HY 后补**（挂候办）
- DeepSeek 链活性硬锚以 §3.3 curl 直探为准（同端点同 Key 同模型真调用 200 end_turn）

### 3.4 生效级语义（**勘验修正**·原「env 钉定压制」判断订正）

- **修正依据**（TriRMC src/config/env.ts L32 实锚）：「LG-058 N5 方案三：『效』步兑现点——boot 型键经 settingOrEnv 读取」——TriRMC 自身只消费 **boot 型键**（TRIRMC_PORT 等）；**settings.json 的 ANTHROPIC_* 三键消费者=宿主 Claude Code 接入面**（宿主席读本地配置直连模型），非 daemon 转发路由（TriRMC 无模型代理转发面）
- **api-token.env 的 ANTHROPIC_*（OpenRouter）=daemon 进程 env**（trimodel.service+两 trirmc unit 共享 EnvironmentFile），消费面=daemon 自身，与宿主接入面（settings.json）**并行两轨互不压制**
- **修正后结论**：DeepSeek 切换**已持久化到投影真源**（双 unit settings.json v4 三键 DeepSeek 态）=**投影面生效达成**；R-HY 现势无宿主席（tmux 空+无 ~/.claude）→无现役消费方受扰、无 env 压制问题；**宿主级真切换验证候宿主席部署 R-HY 后补**（现势无验证对象，如实报）
- 原 §3.4「表单值压不过 env 钉定=切换不生效」判断系消费面误置（把 daemon env 当宿主接入 env），**订正如上**；「真切换需动 env 面/涉 unit 重启」的候裁前提随之消解——**零 env 动作、零 unit 重启即已完成投影面切换**

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
| R-HY `/var/lib/trirmc/settings.json` | **v4 DeepSeek 态**（19:47:23Z，三键掩码 §3.2，sha 前16=3e497758fb1d2529） | **DeepSeek 态保留 or 回滚 GLM 态候 CEO 裁**（回滚操作面=UI 改绑重存即可，零 unit 动作） |
| R-HY `/var/lib/trirmc-mc/settings.json` | **v4 DeepSeek 态**（19:41:47Z，sha 前16=374846d20ccfa9c7，与上同值） | 同上 |
| rmc 卡 local_config | v4=DeepSeek 三键+applied 回执 ok+UI「已落生效」 | 同上 |
| rmc 卡条目域 | 未动（DeepSeek/GLM 密文条目+三窗规则原样） | — |
| R-HY daemon env | api-token.env（OpenRouter ANTHROPIC_*）未动——与宿主接入面并行两轨（§3.4），无压制关系 | 无需动作 |
| 宿主接入面 | R-HY 现无宿主席（tmux 空+无 ~/.claude）——投影真源已切 DeepSeek，宿主席部署后即消费 | 宿主级烟测候主席部署（候办） |
| TriModel 源 | 5188e7f+r5b 73ca1cc（守卫豁免）在役 | — |
| TriRMC 双 unit | 零触碰（只读探针外零动作，边界遵令） | — |

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

- date 现查：2026-10-06T19:15:58Z（03:15:58+0800 Wednesday）→终态增补落款 **2026-10-06T19:54:02Z**（03:54:02+0800 Wednesday，当场重跑）
- 水位自估：中（三段全闭合在卷；候 CEO 裁终态去留+宿主级烟测候主席+双 unit 回执竞争候关注）
- 末次活动：2026-10-06T19:54:02Z（终态增补落款现查时刻）
