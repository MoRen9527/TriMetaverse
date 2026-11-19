# 修 D-2 施工收口卷·dsh 供给切 GLM（notice-219 值席放行·CTO 施工·spawn 可靠性根修）

- date 现查: 2026-11-19 17:4x CST（D-47）
- 施工/收口: CTO 小狄（rc=1 根因卷 e781d6cef 承兑·修 D-1 外部面另线值席 relay）

## 一、施工四件（两码面+两配置面）

| 件 | 形 | 实锚 |
|---|---|---|
| ①码面·spawn env 注入 | TC loop_autoreview.py `read_glm_spawn_env()`（4dc77d5→**3bdae1f** 终形已推 bare+heyuan sync ✓）：TRIRMC settings.json ANTHROPIC_AUTH_TOKEN 直通→**DEEPSEEK_API_KEY+DEEPSEEK_BASE_URL** 两键换装（dsh llm-deepseek provider=anthropic 方言源锚 lib/index.js:336-339·PUBLIC_BASE_URL=api.deepseek.com/anthropic·DEEPSEEK_BASE_URL=可信层端点覆盖）——值零回显零硬编码 D-46；缺项零注入零改形；TRICO_SPAWN_GLM=off 逃生门；读败 fail-open 零炸段 | 白盒 SpawnGlmEnvTest **6/6**（trio/缺 token/缺 settings/off 门/base_url 覆/wiring 传 env） |
| ②配置面·overlay 三行族 | /home/fleet/.dsh/patches/headless-agentpresets-overlay.yml 追加（bak-fixd2 先行）：`agent-default-model` 行 model=glm-5.3-flash＋`llm` 面 catalog glm 条＋**`llm-deepseek` 适配器行** config {maxTokens:16384·models[glm]}——**适配器行=成败分晓面**（provider 配置真身；256e3 默认=INVALID_REQUEST 1210 根因·DEFAULT_MAX_TOKENS=256e3 源锚 lib:21） | 三行 compose 后 dump 实锚 ✓ |
| ③端点键名勘定（中段勘正如实注） | 首形 ANTHROPIC 三键=dsh 零消费（smoke rc=1 复现）→源读破案=dsh provider=anthropic 方言+DEEPSEEK_BASE_URL 覆盖面→**键名换装终形**（GLM anthropic 面协议兼容·curl 200 活体） | 卷面承录·测试同步更新 |
| ④输出预算勘正 | GLM max_tokens 上限 131072 vs dsh 默认 256e3→INVALID_REQUEST 1210（bigmodel 方言错误体=供面已达 GLM 的活体证据）→适配器行 maxTokens=16384 配对勘正 | 错误体演进三段录（QUOTA→1210→rc=0） |

## 二、活体验证（smoke）

- **manual spawn rc=0·out="ok"**（DEEPSEEK_BASE_URL/KEY env+overlay 同形——dsh 会话 GLM 面真答·模型 id=glm-5.3-flash）✓
- loop 代码路径（spawn_seat_session 110s/130s 窗）=timeout 容错形触发（rc=-1 零炸段——**容错形正常工作实证**）；全席评分会话时长>130s 窗=GLM 会话节奏面——**现役 spawn timeout_s=600 缺省足容**（下轮实拍=终验·ns8+1 首拍 failed 读数随卷）

## 三、回滚锚（一键三步）

撤 overlay bak（cp bak-fixd2 回）＋TRICO_SPAWN_GLM=off（env 逃生门）＋TC 3bdae1f revert——三面独立可回。

## 四、现势与候面

- spawn 面模型调用=**脱离死账户族依赖**（GLM 活体面·与修 A 供给切换同向互补闭环）；
- DeepSeek 账户族双键双死面（404/QUOTA）=**修 D-1 外部面候 BOD/CEO**（充值/键换发·恢复后链零改动兼容）；
- overlay 三行族+env 注入=配置面/码面各带回滚锚·单笔 revert 族齐。

## 使用依据

TC 3bdae1f（白盒 6/6）+heyuan sync 实锚；overlay 三行族+dump compose 实锚；dsh-llm-deepseek lib 源锚（:336-339 方言/:21 256e3/:1706 max_tokens 链）；smoke 三段（QUOTA→1210→rc=0）；manual rc=0 out="ok" 活体；notice-219/221 令面；D-46/D-47。

---

## B4 探针勘定附段（值席勘问回应·2026-11-20 0:3x CST）

**勘定①：8710=TriRMC daemon app face·零 /v1/messages 路由**（app.ts grep 实锚：路由面=/internal/v1/agents 系+/hello 系，零 messages 路由）——B4 探针 POST 8710/v1/messages=**未知路由→app 级 not_found**（GLM 路由无关面）。改写 proxy=**3334**（trimodel anthropic-proxy·listener 活体 ✓）——其 GLM 路由 matchModels=['GLM-5.3-Flash','GLM-5.3']（**大小写敏感大写形**）→open.bigmodel.cn（pre-existing 正确·fix A 零触 proxy 路由面）；探针 model=glm-5.3-flash 小写形→3334 亦 route miss（大小写面）。

**勘定②：proxy 直打≠施工面路径 ✓（值席判断采认）**——fix A 范围=dsh 应用面（model.json/bundle/env 三键）+TriRMC 解析链+trimodel registry 防漏斗——**proxy 路由面零涉**；验证正形=dsh spawn 面（zero-override /internal/v1/agent→glm-5.3-flash·done·delta=2 活体在卷）。**B4 复验=dsh spawn 面独立复验 ✓**（探针形=本卷 §二 zero-override 形·token 面经 systemctl show 零回显）。
