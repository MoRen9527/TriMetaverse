# CTO 技术裁卷·WO-D7-CARRYOVER-P2 段二五处候裁（COO 台账 741 请裁承·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-d7-carryover-p2-ruling-20261121.md·裁卷正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 裁定对象: fsd 总成卷 2121ac9d6 五处候裁面+COO 台账 741 请裁两件/核准一件/预勘一件
- 证据面: 总成卷双半边读数（本机 575ac8762+值席 5c5abee78）+本席勘定卷 6d612b679（静态面·总成卷复验一致零漂移承）+TriModel/TriMLC/TriMMC 源码锚（本席段一静态勘链）

## 裁① · 处 1 registry deepseek-flash 断点+P2 锚形（CTO 域·定裁）

**裁定=registry 补 deepseek-flash 条目方向·「型号名勘正 v4-pro」否**：

1. **否决理由**：CEO ㊿+948 定谳「DeepSeek 统一 deepseek-flash 不要 v4-pro」=令面基准——型号名勘正 v4-pro=违令面·否（非技术权衡位·令面已裁）；
2. **补条目正形**：上游在册真探证（rc=200 `["deepseek-flash","deepseek-v4-pro"]`·本机毕报 §一③）=deepseek-flash 上游真实型号非别名需求——registry 条目=仿 deepseek-v4-flash 形（primary `'deepseek'`·model=deepseek-flash 直发上游·零别名映射）·具体 schema 候 fsd 施工窗按 client.ts 现行条目形定·白盒随勘；
3. **时机分段裁**：形 1 窗（sg proxy 链）**零码面先通**（proxy 直发上游不触 registry 断点·fsd 如实注+值席真探双证）——registry 补条目=TriModel 码面微改笔·**生效绑形 2 rebuild+restart 窗**（运行 dist 旧形·码面改须 rebuild 才活）——**非本窗硬项**（断点只触 TriMLC client 语境·TriMLC 链=形 3 窗二批才恢复）——码面铸笔候窗二批/形 2 挂账窗**与兜底勘正（裁②）同批捆**；
4. **P2 锚形裁注（一并）**：P2 default_model 值面=**deepseek-flash**（CEO 令面统一·派生自策略 default 规则 entry.model）——proxy 一发真探回读 model=deepseek-flash 原样对表（上游在册=零归一·回读值即令面值）。

## 裁② · 处 2 兜底常量族谱勘正终审（CTO 终审·裁）

**裁定=勘正方向采认·时机非窗内硬项·与 registry 补条目同批捆**：

1. 方向=统一 `deepseek-flash`（CEO 令面同源·四处族谱 TriMLC `tmv-deepseek-v4-pro` app.ts:3931+key-cache L378/TriModel config+policy 两形/TriMMC `v4-pro` 全谱对表勘正）；
2. **生效依赖注**：兜底 fallback 名过 registry 路由（TriMLC client 语境）——兜底勘正生效依赖 registry deepseek-flash 条目在位=**与裁①.3 同批码面铸笔**（窗二批/形 2 挂账窗）；
3. 时机=非窗内硬项维持（零行为差·card 拉到不触发·天塌态 fallback v4-pro 亦可用=可用性优先）——非本窗项·观察注级升码面批候窗。

## 核准③ · 处 3 形 1 技术面（CTO 技术形核准·APPROVE）

**形 1=sg card 加密直供+策略 default 规则形——技术面 APPROVE**（三件分核准+五条施工护栏）：

| 件 | 判 | 判据 |
|---|---|---|
| 加密直供形 | ✓ | AES-256-GCM 机器指纹 PBKDF2 本域加密·api_key_encrypted 直供 PUT 绕旧 dist 明文 hydration 400 面·值席源码勘定正形语义（upsert+派生缓存）·key 值面零明文零落卷=D-46 合规路径 |
| 策略 default 规则形 | ✓ | default_model=PUT 不接受直改·`type=default` 规则 entry_id→entry.model 派生=值席勘定正形——**entry.model=deepseek-flash 落地**（CEO 令面·裁① P2 锚同源） |
| 值席 key-encryptor 本域加密路径 | ✓ | 源=.env DEEPSEEK_API_KEY·sha16 对表形（P1 锚）·本域加密零明文传输零落卷 |

**五条施工护栏（窗令随带）**：①回滚锚双保险确认（/tmp bak 两份+write guard backup-first keep5）先于首笔 PUT；②GLM 密文条目 upsert 零删面（e-glm-anthropic 零触=随时回切）；③红即停零二次硬试；④PUT 走 card API 正形端点（face=mmc）；⑤完工=P1∧P2∧P3∧P4 四件齐（P4 锚形裁注见下）。

**形 1 技术可行=可**——形 2 无需升级重估（COO 窗内 FREEZE 挂账维持承录）。

## 承录④ · 处 4 形 2 窗内 FREEZE（COO 已裁·本席承录+码面捆注）

- 形 1 可行确认→形 2 维持窗内 FREEZE 挂账候批 ✓；
- **码面捆注**：registry 补条目（裁①）+兜底勘正（裁②）两笔码面铸笔=候窗二批/形 2 挂账窗与 dist rebuild 合并排（rebuild 一次带三活·避免 TriModel 重启窗多次开）。

## 预勘⑤ · 处 5 形 3 二选一技术形（CTO 预勘·窗二批令面候）

**预勘=TriModel 本机在役化优先·env 面切换否**：

| 形 | 判 | 理由 |
|---|---|---|
| TriModel 本机在役化 | **优先** | ①零重启潜在位：TriMLC daemon pull timer 若启动链已排程（initKeyCache 失败分支 timer 存续性=**窗二批首步活体判读位**）——TriModel 在役化后 15min 内 pull 自愈=零重启全链通（最优）；②与 sg 集中供给架构同构=单点配置面统一治理；③附带回=mlc face card 新建+卡面治理统一 |
| env 面切换 | 否 | tier3 env 直链（OPENCLAW_*=bigmodel GLM）切 DeepSeek=改 env 面——**env 读入=启动链一次性（readEnv 启动时读·本席段一静态勘实锚）→零重启不生效·restart 不可避免**——且双轨配置并存（tier3 直链+TriModel pull）=漂移面·零优势 |

**窗二批勘定项四件**（令面随带）：①TriMLC pull timer 存续性活体判读（自愈成立=零重启形·不成立=TriMLC restart 例外裁走 COO 显式令）；②本机 TriModel 供给源二选一勘定（连 sg TriModel 跨机 3333 暴露面=安全面勘定 or 本机独立部署——本机 TriModel 零 git 仓·先 git 化对表 sg 4147bb8=总成卷 §六.2 承）；③mlc face card 新建形（零文件→新建·模板面 cardTemplatesDir 勘定）；④TriMLC 双端版本差勘正位（本机 8361196 vs sg 2bf19193·总成卷 §六.3）。

**时点**=COO 统排（CFO 检查拍 2 现值刷新·GLM 耗尽预测带内主动窗）——本席零自判窗位（D-76 C 层）。

## P4 锚形裁注（总成卷 §五候裁·随链分区）

- **形 1 窗（sg 链）**：P4=card mtime 时戳+**P3 一发真探回读 model=deepseek-flash 兼任生效锚**（proxy 面运行态生效实证——P3∧P4 合一读数可注·语义=「配置变更→运行面生效」本义不变）；
- **TriMLC 链（形 3 裁后）**：P4=原形 cache fetchedAt 刷新时戳（pull 恢复前提=窗二批裁后）。

## 使用依据

fsd 总成卷 2121ac9d6（双半边读数+候裁五处）+COO 台账 741（统排裁定+请裁承）+本席勘定卷 6d612b679（静态面·热载/env 注入/face card 形实锚）+CEO ㊿+948 型号定谳（令面基准）+TriModel client.ts/anthropic-proxy.ts/providers/deepseek.ts+TriMLC app.ts:3931/key-cache L378+TriMMC key-cache L10（族谱四处锚）+D-15/D-24/D-27 v4/D-46/D-47/D-76 C 层。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
