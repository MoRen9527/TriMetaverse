# dsh 换栈 GLM · 工序 3 gate 收口卷（SDE·gate PASS 全判据）

- sourceOfTruth: 本卷（工序 3 隔离试跑 gate 读数正身·候 CTO 核）
- syncMode: write-time
- lastSyncedAt: 2026-11-04T08:35:18Z（date 现查原值）
- 令源: CTO 门禁裁示②（992730fda·gate 即跑令）·实施单 §四判据+裁示①增补三条

## 一 · gate 判据对表（四条全绿）

| 判据 | 读数 | 判 |
|---|---|---|
| HTTP 200 | proxy.log 08:33:55Z+08:34:02Z `POST /api/paas/v4/chat/completions -> 200`×2·gate exit=0 | ✓ |
| 非空 completion | 回包=reasoning 段+正文 `PONG`（prompt=Reply with exactly: PONG） | ✓ |
| 回包模型 id=注册 models id 对表 | session 记录（zstd 解）`"model":"GLM-5.3-Flash"` ×7 全一致·与 patch 注册 models id+default model 三面同值 | ✓ |
| refs 键名/hash12 锚 | 键=GLM_RPLANE_KEY·值=settings 现值（76cc…明文前 12 形）·复算矩阵 sha256_nonl=9db51d3a03e5（裁示②勘正锚）双算法口径均自洽 | ✓ |

- 试跑形：沙箱 `DSH_HOME=/home/fleet/.dsh-gate-sandbox`·headless 单发 `dsh --profile headless "Reply with exactly: PONG"`（fleet 身份·cwd=沙箱）·timeout 90s 内毕。
- dump-config 前置断言（零请求）：组装树 agent-default-model={provider: glm·model: GLM-5.3-Flash}（52-56 行）+providers.glm 注册（83-88 行）——三键被组装器原样吃进。

## 二 · 首跑三坑实录（rc.2 首跑坑族·勘定卷 §六预警部分应验）

1. **credentials 缺 `version: 1` 头**：初写沙箱 credentials 为纯 `refs:` 形→dsh-credentials-local 拒（「pre-release flat layout·Add version: 1」）→authorization/deepseek-account 级联 pending。**prod 正形实锚：prod .credentials.yaml 第 1 行即 version: 1**（prod 自始合规）——沙箱照抄补头后过。
2. **invocation cwd=/root EACCES**：sudo -u fleet 跑但 cwd 残 root→credential seam 项目 .env 层读 /root/.env EACCES+/root/.git realpath 拒。修=cd 沙箱目录再跑。
3. **session 落盘=zstd 压缩形**（session.v4.jsonl.zstd）——模型 id 勘定须 zstdcat 解（zstd bin 在位 /usr/bin/zstd）。

## 三 · hash 复算矩阵读数（CTO 委托单·定性修正）

| 形 | 前 12 |
|---|---|
| len | 49 |
| **sha256 无尾换行** | **9db51d3a03e5** |
| sha256 带尾换行 | 47fe0c1b0a3a |
| md5 无尾换行 | e7e405d78735 |
| sha1 无尾换行 | 44de046632f0 |

**定性修正**（对裁示② §①「echo 尾换行嫌疑」）：物面同一把值（len 49）·CTO 读数 9db5=**sha256 摘要前 12（无尾换行正形）**·SDE 投影 76cc=**值明文前 12 字符（D-46 hash12 投影惯形）**——**两算法各自正形·非尾换行管道差·非读数错**。根因=「hash12」术语双算法歧义（明文前缀投影 vs 摘要前缀）——**对表纪律候选：hash 声明须带算法形**（如 sha256_12:/prefix12:）——截断伪影家族新变体（投影算法歧义）·挂档候选候 CAO 窗。

## 四 · 8460 链路旁证

- gate 期 proxy.log 双 200（/api/paas/v4/chat/completions）=dsh→8460→bigmodel 全链活体通。
- 路径拼接形实锚：baseURL(/api/paas/v4)+openai-completions(/chat/completions)=proxy.log 所记路径·与 13:54（05:54Z）既有 200 流量同形。

## 五 · 零触碰复核+沙箱态

- prod 面（8791/8460/caddy/13 席/duty-env/upstream.key/.credentials.yaml prod 件）零触碰——全程写面=沙箱目录一域。
- 沙箱态：保留至工序 4 后（对比面+事故解剖面）·试跑 session 两枚（首跑 EACCES 形+重跑形）在沙箱内零外溢。
- 跨机零触碰：sg 侧零写入（hash 复算单只跑河源·sg settings 只读投影在工序 2 卷）。

## 六 · 工序 4 候窗确认

裁示② §③：PASS 后工序 4=切换窗（施工毕后首个 03:30 窗·验证毕方切）——即 **2026-11-05 03:30+0800 窗候切**（与 fade011-daily-sweep 首触发同窗层——切换步与 sweep job 触发时序互斥面候工序 4 施工单细化·若同窗碰撞以 CTO 排序为准）。工序 4 前置清单候备：patch diff 脱敏形+restart 链（sudo -u fleet XDG_RUNTIME_DIR=/run/user/1000 systemctl --user restart dsh-web-prod）+healthz+真链一发+24h 观察窗（零 401/5xx 异常簇）。

## 七 · 使用依据

- CTO 门禁裁示②（992730fda·gate 即跑令+判据勘正+值源终裁四理由）·裁示①（b7b022e4e·gate 判据增补三条）·实施单（43cd92e54 §四）
- 活体读数：dump-config 组装树·headless 单发回包·proxy.log·session zstd 解·prod credentials 头·zstd bin
- D-46 掩码管道全程·D-47 三锚（本卷时点=date 现查原值）
