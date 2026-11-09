# dsh 换栈 GLM · 工序 2 施工卷（SDE·含判据矛盾停回询）

- sourceOfTruth: 本卷（工序 2 施工读数+断言+判据矛盾勘定矩阵正身·候 CTO 裁）
- syncMode: write-time
- lastSyncedAt: 2026-11-04T08:20:48Z（date 现查原值）
- 令源: CTO 实施单（43cd92e54）+门禁裁示①（b7b022e4e·准工序 2→3）·施工过 D-46 掩码管道全程

## 一 · 施工三件（R-HY·全部实锚读数）

| 件 | 读数 | 锚 |
|---|---|---|
| ① 回滚锚 | `cordis.patch.yml.bak-20261104T081238Z`（4681 行·600·fleet:fleet·cp -p 保留源 mtime Oct17 14:50） | stat+wc |
| ② patch append 块 | web patch 尾部 append 19 行（4681→4700）·llm-pi-ai 行（config.providers.glm={apiKeyEnv: GLM_RPLANE_KEY·baseURL: http://127.0.0.1:8460/api/paas/v4·api: openai-completions·models:[GLM-5.3-Flash]}）+agent-default-model 覆写行（config={provider: glm·model: GLM-5.3-Flash}）·块头双注记行=令源锚+转译器再生成抹除挂账语（裁示①护栏 1/2 在位） | 行号 4683-4700 |
| ③ refs 写入 | `.credentials.yaml` 尾 append `  GLM_RPLANE_KEY: <值>`（两空格缩进对齐 DEEPSEEK 行）·文件 291B·600·fleet:fleet | ls+键面投影 |

## 二 · 断言读数

- append 块 pyyaml parse OK（2 entries·config keys=[providers]/[provider, model] 正形）
- credentials pyyaml parse OK·refs keys=[DEEPSEEK_API_KEY, GLM_RPLANE_KEY] 双键在位
- web patch 4681→4700 行（+19）·文件 303760→304524B（差=append 块）
- **模型 id 活体正形**（裁示①两道之 a 道）=settings.json ANTHROPIC_MODEL=**GLM-5.3-Flash**（非占位 glm-5.3）——patch models 注册与 default model 均按此真 id 形落
- b 道（试跑回包 id 对表注册 models id）=工序 3 gate 判

## 三 · ⚠ 判据矛盾停回询（裁示①②判据 hash12 对表 FAIL·物面四候选全无 9db5 来源）

**实写值 hash12=76cc6dbd05d5 ≠ 裁示①对表值 9db51d3a03e5**。穷尽勘定矩阵（两机+代理·全只读）：

| 候选源 | hash12 | 备注 |
|---|---|---|
| 河源 /home/fleet/.claude/settings.json env.ANTHROPIC_AUTH_TOKEN | **76cc6dbd05d5** | len 49·mtime 2026-10-16 03:37（19 天未动）·**与 ANTHROPIC_API_KEY 双键同值** |
| sg /home/fleet/.claude/settings.json 同键 | **76cc6dbd05d5** | mtime 09-16·**与河源同值**（双机 settings 同 token） |
| 河源 /home/fleet/.trimmc/duty-env GLM_API_KEY | **86c083663275** | 既非令文 9db5 亦非裁示所述旧值 aad3c9345（已再轮换） |
| 河源 /opt/bigmodel-h1-proxy/upstream.key | **f56c1e3cebef** | 49 字符·10-16 03:35·proxy 真鉴权值（见下） |
| （裁示①令文值） | 9db51d3a03e5 | **两机物面四候选全无此值** |

**源码级事实**（proxy.mjs 2323B 全文实读）：8460=bigmodel H1.1 降级代理（bigmodel 边缘拒 Bun TLS 指纹 400[1210]·node 重发形）——**零客户端鉴权**：每请求现读 upstream.key 重写 Authorization/x-api-key（`hdrs['authorization'] = 'Bearer ' + nk`）→转发 open.bigmodel.cn。**客户端 token 值面被完全丢弃不参与鉴权**——GLM_RPLANE_KEY 只需非空过 dsh credential seam（无值=MISSING_CREDENTIAL fail）·真鉴权值=upstream.key 文件（f56c…·换 key 免重启设计）。

**SDE 判读**（候核）：①功能面现写入值（76cc…非空）试跑可行；②裁示① hash12=9db5… 在河源/sg 两机物面无对应物——疑勘定读数来源另在他处（13 席 seat 级 settings 或本地面）·候 CTO 给对表位或勘正判据值；③若按「真 GLM key」语义应写入 upstream.key 值（f56c…=代理真鉴权值·bigmodel 控制台现役 key）——但该值面属代理文件·是否作为 refs 值源候 CTO 裁（涉凭据面复制策略）。

## 四 · HMR 悬置定谳（勘定卷 §七）

**dsh lib 零 patch 文件监听**（fs.watch/watchFile/chokidar 全零命中·cordis.patch 仅 profile-boot 启动组装+dump-config 诊断两处）+三重旁证（8791 进程 Oct 21 起 13 天未重启·web.log 启动后零新增·8460 proxy.log append 后零 GLM 流量）→**append 块纯落盘态·现役零影响**·生效=工序 4 重启窗（设计语义原样）。零触碰面完好。

## 五 · 零触碰面复核

8791 零动（进程未重启·无热载）·8460 零动（proxy 只读勘+log 只读）·8710 未触·caddy 未触·13 席 settings 未触·duty-env 未触·upstream.key 未触。写入面=web cordis.patch.yml（append）+.credentials.yaml（append 一行）+新建 bak——三件全在工序 2 授权范围内。

## 六 · 候裁两项（回执同文）

1. **判据勘正**：裁示① gate 判据「refs hash12 对表 9db51d3a03e5」→ 实写=76cc6dbd05d5（settings 现值·双机同值）——候裁判据值勘正或指对表位。
2. **值源终裁**：现值（76cc…）功能可行（proxy 零校验重写）；若按「真 GLM key」语义应改写 upstream.key 值（f56c…）——候裁。裁定后如需改值=单行 sed 级变更+hash12 对表+断言重跑，五分钟内完成。

## 七 · 工序 3 备料态（候裁后即跑）

沙箱 DSH_HOME=`/home/fleet/.dsh-gate-sandbox` 预置清单已定形（profiles/headless 全骨架四件自 prod 拷+patch 三键同形+refs 同源）——**沙箱 patch 的 GLM_RPLANE_KEY 值源随候裁项 2 同步定**。gate 判据四条：HTTP 200+非空 completion+回包 id=GLM-5.3-Flash 与注册 models id 对表一致+refs 键名/hash12 对表（值随候裁定）。

## 八 · 使用依据

- CTO 门禁裁示①（b7b022e4e）四项裁定+gate 判据三条
- CTO 实施单（43cd92e54）要点①②③
- R-HY 活体勘定：settings.json（河源/sg 双机）·duty-env·upstream.key·proxy.mjs 全文·dsh lib grep（profile-boot/dump-config）·pyyaml parse 断言
- D-46 掩码管道全程（值面零回显·hash12 投影除外）·D-47 三锚（本卷 lastSyncedAt=date 现查原值）
