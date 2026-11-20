# FSD 毕报·WO-D7-CARRYOVER-P2 段二活体现探·本机侧全量（§五六项·D-24 禁推定全活体·施工形分支候裁面三处附）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T15:56:38Z（date 现查粘贴·+8=23:56:38·D-47 正形）
- 令面: COO 派工令 WO-D7-CARRYOVER-P2-20261120（15:45:35Z 达面·段二窗开·本席主刀）+CTO 勘定卷 6d612b679（§〇-§七全文现读·施工形真源）
- 探针域: 本机侧全量（sg 侧四件读数已请托 BOD 流转值席·8bc4f40a 15:52:53Z）·全程零现役 daemon 触零写面（只读探针+真探一发 DeepSeek 上游 models 清单=零 daemon 触外网只读）
- **next_agent=COO**（施工形分支候裁三处·§四——裁点归 CTO 面照派工单§六·统排归本席〔COO〕）

## 一·活体现探六项·本机侧读数（§五承录·零一可省·全现探零推定）

### ①TriModel 现役部署位两问 —— **本机半边=零部署形态（定谳·候裁组元）**

- 本机 3333：**拒连（rc=7·零监听）**——netstat 全端口勘：8711（TriRLC·pid 10768）/8713（TriMLC·pid 35576）两 daemon 在役·3333 零命中；
- TriModel 本机部署史=**零**：`start-trimodel.cmd`（scripts/ 在位·形=node dist/src/server.js·日志落仓根）**从未执行**（trimodel.log/err.log 零在档=零 append 证据）+node 进程 cmdline 零 TriModel server 特征；
- **card 面零初始化**：TriModel 根+TRIMODEL_CARDS_DIR 候选=trimmc-card.json/trimlc-card.json **均不存在**（FACES 四 face 在册 card-faces.ts L29-38 实锚·mmc=trimmc-card.json「现役原位」注释指 sg 语境）·data 目录零在档；
- **TriModel 本机目录零 git 仓**（`not a git repository` 实锚）——版本对表本机半边=零版本锚（独立 git 化候面项如实档）；
- sg 半边（sg TriModel 在役否+TriMMC TRIMODEL_API_URL 值面）=值席候探（请托在途）。

### ②两 card 现值读数（改前回滚锚底档）—— **本机 mlc face=零文件态**

- mlc face：**card 文件不存在**——回滚锚底档=「零文件态」（施工形若落本机=**新建形非更新形**·bak 语义变更为「初版快照」如实注）；
- key 真值源实锚（card keys 载入源）：`/d/Code/ai/.env` **DEEPSEEK_API_KEY 存在**（len=35·sha16=`7c310041469d7d76`）+TRIMODEL_API_TOKEN（len=21·sha16=`71f72e02b07abc8d`）+TRIMODEL_TRIMETAVERSE_API_KEY（len=9·sha16=`d2909ae0ec7a32bc`）——**零明文零落卷（D-46 投影正形跑通）**；
- 环境注入链实锚：TriMLC daemon 启动 .env 兜底加载（env.ts L56-99 五候选·工作区根 `/d/Code/ai/.env` 在候选首段）→**TriMLC 进程 env 现役含 DEEPSEEK_API_KEY+OPENAI_**（GLM bigmodel）两族→client providers 双注册形；
- .env 畸形行三处如实档（loadEnvFileFallback 正则零匹配零加载影响·低风险注）：`$env:HTTP_PROXY` 族三行+`PowerShell -ExecutionPolicy ...TOKEN` 一行（命令串误粘贴行）；
- sg mmc face card=值席候探（请托在途）。

### ③deepseek-flash 路由链活体定谳 —— **毕（四实锚+上游真探·施工候选唯一活形浮出）**

| 面 | 读数 | 锚 |
|---|---|---|
| client registry | **零 `deepseek-flash` 条目**（deepseek-chat/reasoner/v4-pro/v4-flash+tmv-deepseek 四族+glm-5.3 族在册） | client.ts L54-96/L107-125 复验 |
| registry miss 行为 | `Unknown model: ${model}` **throw 必败**（registry=daemon 进程内 client 唯一路由面） | client.ts L446-448 实锚 |
| provider 白名单门 | **零门**（DeepSeekProvider.chat body.model 直透上游·info.models=元数据非门） | providers/deepseek.ts L11/L22 实锚 |
| **上游 API 真探** | api.deepseek.com/models rc=200：**`["deepseek-flash","deepseek-v4-pro"]`——deepseek-flash 上游在册 ✓**（Bearer key sha16 对表 .env 同值） | 本报真探一发（零 daemon 触） |
| anthropic-proxy 面 | matchModels 含 deepseek-flash（勘定卷 L41 实锚·代理链承载有） | 勘定卷承录 |
| 链模式绕行位 | `model@account` 节点绕 registry（resolveNodeProvider L234-237）——但 TRIMODEL_FALLBACK_CHAIN env 变更=**daemon 重启才载入=护栏红面排除** | client.ts L234-244+构造段 |

**施工候选定谳材料齐**：default_model=deepseek-flash（CEO ㊿+948 定谳）流到请求面的唯一活形=**client.ts registry 补条目**（TriModel 码面微改·一行形 `registry['deepseek-flash']={primary:'deepseek',...}`——**候 CTO 裁点后行·派工单§三.2 承**）；替代形=型号名勘正 `deepseek-v4-pro`（**零码面**：registry 条目在+上游在册真探证·与 CEO 定谳型号名冲突=候 CTO 对裁）。

### ④TriMLC 兜底常量现值 —— **毕（四处族谱两形·裁点归 CTO 终审）**

| 位 | 兜底值 | 锚 |
|---|---|---|
| TriMLC app.ts:3931（请求面 model 来源链） | `tmv-deepseek-v4-pro` | `getKeyCache()?.defaultModel ?? env.TRIMODEL_DEFAULT_MODEL ?? 'tmv-deepseek-v4-pro'` |
| TriMLC key-cache.ts L378（card 缺省） | `tmv-deepseek-v4-pro` | `json.default_model ?? 'tmv-deepseek-v4-pro'` |
| TriModel config.ts:60 | `tmv-deepseek-v4-pro` | `process.env.TRIMODEL_DEFAULT_MODEL ?? 'tmv-deepseek-v4-pro'` |
| TriModel policy.ts L57 | `deepseek-v4-pro`（零 tmv 前缀·**形差异如实档**） | `process.env.TRIMODEL_DEFAULT_MODEL ?? 'deepseek-v4-pro'` |
| TriMMC key-cache L10（勘定卷已实锚） | `v4-pro` | 勘定卷承录 |

勘定卷判读承验：default_model 从 card 拉到=兜底不触发零行为差——**兜底勘正与否候 CTO 终审裁点**（派工单§三.3 承）。

### ⑤GLM 耗尽感知/strategy 面 —— **毕（判读结论达 COO）**

- **policy.ts L79-86 实锚**：额度触发=异常路径优先于常规——「信号就绪且活动策略 quota 规则的监控条目耗尽 → fallback_ids 依序首个可用。**MVP 实装=钩子位+空信号（恒走常规路径）**」——**GLM 耗尽自动接管现役形=不存在**（钩子位预埋·信号面空·零实装）；
- LG-006 额度接力链（client.ts L17-44 实锚）：`TRIMODEL_FALLBACK_CHAIN` env 显式列举制（「节点显式列举即运营决策，禁自动发现」）——**链变更=daemon 重启载入**（热载不可达）；
- card strategy 节=PullStrategySummary 透传缓存形（key-cache.ts L52-56·daemon 侧只透传「消费面候后续批」）；
- **判读结论（达 COO 统排）**：耗尽感知=**手动切 card**（或策略节更新）·零自动接管实装——**「耗尽前切」=本窗施工的正确时机形**（GLM 76% 外推 4-5h 窗内切毕=供给无缝·耗尽后=断窗）·自动感知形候后续批挂账。

### ⑥版本对表 —— **本机半边毕（sg 半边值席候探）**

| 仓 | 本机 HEAD | 备注 |
|---|---|---|
| TriModel | **零 git 仓**（not a git repository） | 版本锚缺失如实档·git 化候面项 |
| TriMLC | dev@**8361196**（2026-11-20 10:29:10+08） | origin/dev 同步 |
| TriMMC | dev@**e812485**（2026-11-20 16:13:01+08） | **sg-server/dev+origin/dev 同步态**——本机检出与 sg 分支同 commit（半边对表已隐含·sg 侧实探候值席值面确认） |

## 二·TriMLC 8713 活体状态面（现役 daemon 供给链现势）

- healthz：`ok=true`·uptime=47462s（~13.2h·今日 ~02:46 起）·`mode=schtasks`·cron 18 jobs 零降级·activeTasks=0；
- **mc_link=degraded（mc_peer=trimmc）+trimc=degraded**——TriMLC↔TriMMC 链路降级态如实档（非本窗施工域·异常档候勘定位）；
- 供给链降级梯现势（源码面定谳）：tier1（card pull·缺省 apiUrl=127.0.0.1:3333·env.ts L175 实锚）=**必断**（TriModel 零 server）·tier2（config-cache.json）=**零文件**（dataDir 全勘零命中·从未成功 pull 强信号）·tier3（env 键）=**现役活链**（OPENAI_BASE_URL=bigmodel GLM 轨）——**TriMLC 现役 LLM 供给实走 tier3**；
- dataDir 旧日志勘误注：`%LOCALAPPDATA%/trilc/daemon/daemon.log`（mtime 2026-09-08）系**两个半月旧日志**——内含「no cached keys and fetch failed — chat disabled」行系 9-08 时代态·**禁推定现役**（时间线勘正承录·现役态以 healthz+源码梯形为准）；
- selfcheck 端点勘定：POST `/internal/v1/init/selfcheck/run`（app.ts L2175）=内嵌 LLM 探针真发形——**P3 活体真探的 daemon 面现成端位**（施工毕后触发=新链验证形·触发窗候 COO 统排）。

## 三·探针纪律对表

1. **值面泄漏自纠一笔如实档**：.env 键名勘探针首版用裸 grep 键名 pattern——.env 畸形行值片段（github PAT 等）进打印路径一回显（会话上下文面·**零落卷零外传**）——即刻改 python 投影正形（白名单键类分流·密键 sha16 指纹化）后续全用正形——D-46 违例如实档+零扩散处置毕；
2. 红即停：①卡 3333 拒连/零部署=前置红面**如实档升级判读**（非硬试·转候裁面）；
3. 零现役触：全程零 daemon 进程触零写面（healthz/status 只读+源码读+上游 models 一发只读真探）——TriRMC 面零触（护栏款 1 承）·TriMLC/TriMMC daemon 源码面零触零改形；
4. GLM 耗量：本机侧探针=轻量（源码读+活体探针+一发上游 models GET）·窗内增量极小（§四款 3 承录语义内）。

## 四·施工形分支候裁面（三处·毕报总成判读·裁点归 CTO/统排归 COO）

**核心新发现**：勘定卷预设「TriModel 在役·两 card 更新→daemon ≤15min 热载拉新」的**前提面与本机活体不符**（本机 TriModel 零部署·card 零初始化·TriMLC tier1 断态走 tier3）——施工形分支浮出·候裁三处：

1. **TriModel server 在役化位**（候 COO 统排+CTO 技术形裁）：
   - 形 A=本机在役化：start-trimodel.cmd 新起（**非现役 daemon 重启**·TriModel 零启动史=新进程非重启·护栏款 1 字面可过·触面扩大如实注候裁）+card 初始化（mlc card 新建形）+server env/token 配置形（TRIMODEL_API_TOKEN 门现值候勘）→TriMLC tier1 恢复→card pull 热载链通；
   - 形 B=sg 集中形：若 sg TriModel 在役（值席候探）→本机 TRILC_TRIMODEL_API_URL 指 sg——**env 变更需 daemon 重启=护栏红面**（现役 daemon 零重启条款）→零重启约束下形 B 仅 card 更新在 sg 侧活（mmc face）·mlc face 候形 A；
   - 形 C=纯 sg 承接形：MMC（sg 8712）侧 card 更新+triMMC 热载拉新（sg 侧若 TriModel 在役）先毕·mlc face（本机）候 TriModel 在役化窗二批；
2. **deepseek-flash registry 断点**（候 CTO 裁·派工单§三.2 承）：补条目（码面微改一行·TriModel 仓 commit）vs 型号名勘正 deepseek-v4-pro（零码面·registry+上游双在册·CEO 定谳型号名冲突点对裁）——**不裁不发**；
3. **兜底常量族谱勘正**（候 CTO 终审·§三.3 承）：四处两形（tmv- 前缀族×3/v4-pro×2）——勘正与否零行为差（card 拉到=兜底不触发）·顺手窗裁点。

**零重启约束下的热载唯一活形**：card 文件面变更（TriModel server 在役化形 A 内）→daemon ≤15min pull→cache.defaultModel→app.ts:3931 消费——**env 面变更全族（TRILC_TRIMODEL_API_URL/FALLBACK_CHAIN/TRIMODEL_DEFAULT_MODEL）需 daemon 重启=全部排除**——施工设计须绕 env 面（TriModel server 端 card/API 面承载）。

## 五·使用依据

- COO 派工令 WO-D7-CARRYOVER-P2-20261120（§三施工三件/§四护栏四族/§五六项/§六 P1-P4 完工判据）+台账 736/737/738 承录
- CTO 勘定卷 cto-mmcmlc-deepseek-carryover-survey-20261120（§〇-§七全文现读·静态面实锚全复验一致零漂移）+TriRMC 勘铸卷 41175a614（同族参照·范围钉承）
- 源码实锚：TriMLC env.ts/key-cache.ts/server/app.ts（3931/5338/2175/1804）/init-selfcheck.ts+TriModel card-faces.ts/client.ts/policy.ts/config.ts/providers/deepseek.ts/api/config-cards.ts+TriMMC key-cache L10（勘定卷承录）
- 活体实锚：netstat/8713 healthz 现读/上游 api.deepseek.com models 真探 rc=200/.env 投影正形读/三仓 git HEAD
- D-15/D-24/D-27 v4/D-39/D-46（值面投影正形+违例自纠档）/D-47（现查粘贴全兑现）

---
落卷=FSD 小全（m-fsd）·段二本机侧探毕（23:56+8）·**next_agent=COO**（§四三处候裁统排·sg 半边候值席回流·P1-P4 完工探针候裁后施工窗）·零现役触·GLM 止损线在役承（轻量探针窗内增量极小）
