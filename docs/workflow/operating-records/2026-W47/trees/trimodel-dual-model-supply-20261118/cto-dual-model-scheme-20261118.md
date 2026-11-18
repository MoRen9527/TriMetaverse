# TriModel 双模型供给线·技术方案卷（CEO 令·CTO 承办·三件①②③）

- date 现查: 2026-11-18 10:4x CST（D-47）
- 令链: CEO 口谕定谳（BOD notice-174 转达·入账卷=本树）；边界=方案面产出候 COS 核读→COO 拆树→任务书呈 CEO 确认生效（11-04 收窄制）——**本卷=方案启动零改码·TriModel 真源对表为主** ✓
- 真源对表面: TriModel sg clone @9d9dfde（src/model-catalog.ts/anthropic-proxy.ts/policy.ts/config.ts/proxy-server.ts/secure-keys 族六面实读）

## 一、TriModel 现役真源对表（方案地基六读数）

1. **MODEL_CATALOG 五模型**（src/model-catalog.ts:10-16）: deepseek-flash / deepseek-v4-pro / GLM-5.3-Flash / GLM-5.3 / TMV
2. **UPSTREAM_ROUTES 三路由**（anthropic-proxy.ts:38-70）: deepseek-anthropic（api.deepseek.com/anthropic·DEEPSEEK_API_KEY）/ **glm-anthropic（open.bigmodel.cn/api/anthropic·GLM_API_KEY·现役在表）** / tristaciss-anthropic（TMV·TriStaciss relay）
3. **3334=Rewriting Proxy**（proxy-server.ts:26 TRIMODEL_PROXY_PORT=3334·anthropic-proxy.ts:4 「rewrites the body's model field」）——**模型字段改写面现役在位**（切换/降级语义的现役落点）
4. **a1 GLM key env-spawn 线现役**（server.ts:143 spawnProxyWithKeys·3333 listen 后 spawn 3334 带 GLM env·key 零出进程——11-17 a1 施工毕 R-HY 部署窗候令）
5. **健康面**（proxy-server.ts:69）: 3334 自检=policy 有效值+路由表+最近改写摘要，无密钥材料
6. **3333 管理面**（server.ts:142 endpoints）: /health /v1/models /v1/config/keys /v1/config/keys/refresh /v1/config/policy (GET|PUT) /ui

## 二、件① 四域定义面域清单（四域=TriModel 供给的四个模型消费域）

| 域 | 消费 daemon（端口/机位） | 供给面（现役触 TriModel 形） | 双模型族（deepseek+glm） |
|---|---|---|---|
| **域-M2** | TriMMC 8712（sg 服务域 M 面） | 3334 rewriting proxy（本机 loopback） | ✓ 双族在 catalog |
| **域-M1** | TriMLC 8713（本机 M 面） | 3334 经隧道/或 3333 直连（M 面对端） | ✓ 同上 |
| **域-R2** | TriRMC 8710（河源服务域 R 面） | 河源本地 TriModel 部署形候勘（R 面对端 8710=现役通道锚） | ✓（部署形随域勘） |
| **域-R1** | TriRLC 8711（本机 R 面） | 3333 直连/3334 经隧道（R 面对端对称形） | ✓ 同上 |

- **真源对表**：MODEL_CATALOG 五模型（deepseek-flash/v4-pro+GLM-5.3-Flash/5.3+TMV）=四域共享统一目录（Provider/Model 统一配置层语义 ✓ CEO 定谳原话对表）
- **如实注**：域-R2/R1 的 TriModel 部署形（河源/dev 本地是否各驻 TriModel 实例）=**候域勘实锚**（本卷按「四域共享 sg TriModel 单实例」主形起草·若四域各驻实例=方案分形候勘后修订）

## 三、件② 切换触发判定面（周额度窗尽判定形·切换/降级语义落点）

### 3.1 触发判定形（三选一供核读面裁·本席荐 c）

| 形 | 判定 | 评估 |
|---|---|---|
| a 手动哨 | 值席周检 bigmodel 控制台用量→人工触发切换 | 零自动化成本·时滞=人工周期 |
| b 用量 API 轮询 | bigmodel 用量端点轮询（if 可达）→阈值触发 | 自动化·候端点勘（P3-sg 切片 2 部署窗核对同族） |
| **c 3334 改写日志计数哨（本席荐）** | 3334 healthz/改写摘要已含「最近改写摘要」面（proxy-server.ts:69 现役）——**GLM 路由调用量=已有计数面**；周额度窗判据=GLM 路由调用量阈值线（窗口阈值线由 bigmodel 契约面校准——配额绝对值候 CEO/值席供数） | **零新增面**（3334 现役改写摘要=现成计数源·扩展阈值判定行即可） |

### 3.2 切换/降级语义落点=**3334 改写面模型字段重写行**（现役面扩展零新面）

- 触发判定 c 真（GLM 周额度窗尽）→3334 改写规则增一条：**GLM 族模型字段改写→deepseek 对档模型**（GLM-5.3→deepseek-v4-pro/GLM-5.3-Flash→deepseek-flash 对档映射表·三域消费方**零感切换**——模型名字段在 3334 单点改写，消费方 payload 不动）
- 降级语义=单向（GLM 尽→deepseek）；**回切语义**=新周额度窗重置→改写行撤销（回 GLM 原生路由）——回切触发=窗口重置日历锚（bigmodel 周窗重置时点候值席供数·配额契约面）
- **零节流语义**：双模型互备保供零节流（CEO 原话对表）——deepseek 侧不设限流（互备保供非限流降级）

## 四、件③ 配置细节面（Provider/Model 双模型配置形·与 a1 线关系对表）

### 4.1 双模型配置形（Provider/Model 统一配置层语义落地）

| 面 | deepseek 侧 | glm 侧 | 统一形 |
|---|---|---|---|
| catalog | MODEL_CATALOG 四模型族（deepseek×2+GLM×2）已在册 ✓ 现役 | — | 统一目录零改 |
| 路由 | UPSTREAM_ROUTES deepseek-anthropic ✓现役 | glm-anthropic ✓现役（base_url 候实勘补全注在码·P3-sg 切片 2 同族） | 双路由已在表 ✓ |
| 凭据 | DEEPSEEK_API_KEY env | GLM_API_KEY env（**a1 线承载=3333 进程内解卡→spawn 3334 带 env·key 零出进程**） | 双 env 形对称 ✓ |
| 改写 | 3334 改写行（触发时挂） | — | 统一改写面单点 ✓ |

### 4.2 与现役 a1 GLM key env-spawn 线关系对表（关系=**包含承载非并行竞争**）

- a1 线=3333 进程内解卡→**spawn 3334 带 GLM_API_KEY env**（key 零出进程·11-17 a1 毕 R-HY 部署窗候令）——双模型方案的 GLM 凭据承载**原样复用 a1 线**（零重构：凭据面已由 a1 闭环）
- 双模型方案增量=**3334 改写行（触发时挂）+catalog 双族显式化**——a1 线为凭据承载层，本方案为路由切换层，**两层正交可叠** ✓
- 部署序依赖=a1 线先落（GLM env 在 3334 进程）→双模型改写行后挂（3334 单点改写面）

## 五、施工序建议（方案面候批后·零改码边界内不算施工）

1. 值席供数：GLM 周额度窗配额契约面（阈值线绝对值+重置日历锚）
2. SDE 面：3334 healthz/改写摘要 GLM 路由计数行扩展（阈值判定行）
3. 触发验收：GLM 路由调用量阈值线→改写行挂→三域消费方 payload 零感核
4. 回切演练：窗口重置→回 GLM 原生路由→三域零感核

## 六、如实注

- 域-R2/R1 的 TriModel 部署形=候域勘实锚（本卷主形=四域共享 sg TriModel 单实例）
- GLM anthropic-compat 端点（open.bigmodel.cn/api/anthropic）=码面候实勘注（anthropic-proxy.ts:50 P3-sg 切片 2 同族在码）——P3-sg 切片 2 部署窗核对承录
- 配额绝对值=候 CEO/值席供数（bigmodel 契约面）

## 使用依据

TriModel sg clone @9d9dfde 六面实读（model-catalog/anthropic-proxy/policy/config/proxy-server/secure-keys）；a1 线卷（R-HY 部署窗四步全闭环 65e5524b0）；notice-174 令面；GLM 容量过滤教义（09-30 重置+09-24 勘正承 memory 面）。
