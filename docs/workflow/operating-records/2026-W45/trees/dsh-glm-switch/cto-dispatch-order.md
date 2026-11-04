# dsh 换栈 GLM · CTO 实施单（派工 SDE·门禁前置）

- sourceOfTruth: 本单（dsh-glm-switch 案实施单正身·SDE 执行+CTO 门禁）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源链: COS 实施启动令 2026-11-04T15:30:25+0800（CEO 15:29 裁 B 路径生效·BOD 15:29:50 转达·锚意见㊿+26）+ CTO glm key 勘定毕报（前段）
- 岗位链: SDE 实施·CTO 门禁·毕报经 COS 转呈 BOD 呈 CEO

## 一 · 目标

dsh provider 栈切换 GLM：三键 patch + 试跑 gate（PASS 后切现役）——现役 8791 在 gate PASS+切换步之前零触碰。

## 二 · 实施要件（CEO 裁+勘定合流·五项）

1. **key 源**=河源现役 GLM key：`/home/fleet/.claude/settings.json` env `ANTHROPIC_AUTH_TOKEN`（hash12=9db51d3a03e5·len49·与该文件 ANTHROPIC_API_KEY 同值）——**勿取 duty-env GLM_API_KEY**（hash12=aad3c9345·失同步旧副本·双端点 401 勘定在案）。值面全程 D-46：hash12 投影比对·禁打印禁落报告禁进管道文本。
2. **baseURL**=`http://127.0.0.1:8460/api/paas/v4`（8460 自建代理 OpenAI 兼容形·200 实锚）——非直连 open.bigmodel.cn（裸 key 直连 401 code 1000 实锚）。
3. **三键 patch**：①agent-default-model 覆写→glm 模型 id ②providers map 注册 glm 条目（baseURL 如上）③apiKeyEnv 指真值——「新增 env 键」或「复用 settings.json 值链」两形由 SDE 勘定后回执再动（两形 D-46 足迹不同：前者=token 副本+1·须落点清点）。
4. **试跑 gate 前置**：隔离 DSH_HOME（沙箱目录·不触现役席不触 prod 状态）headless 单发→PASS 判据=HTTP 200+非空 completion+模型 id 呈 glm 系；401/超时/空回=FAIL 回报不切。rc.2 首跑坑防护=沙箱 DSH_HOME 预置形（防首跑初始化覆写 patch·863825B build schema 面工序 1 勘定）。
5. **零触碰面**：现役 8791（gate PASS 切换步除外·切换=一次重启窗）·8460 代理（只读使用·零配置改）·8710 TriRMC·caddy 443·13 席 settings（本案改动=零·仅 dsh 自身 provider 面）。

## 三 · 工序（SDE 执行·每工序回执）

1. **勘定回执（先勘后动）**：dsh config 现势读数——config 文件身份（路径+hash 级）·provider 段现状·prod DSH_HOME 落点·build 版本（863825B 形）schema 面——回执 CTO 后动 patch。
2. **patch 构造**：三键 patch 稿+config 备份（`cp config config.bak-<UTC 时戳>`·回滚锚）。
3. **试跑 gate**：隔离 DSH_HOME headless 单发→读数回执（D-46 值面零回显·读数行=状态码/模型 id/时延面）。
4. **PASS→切换**：prod config 应用 patch→dsh-web-prod 重启一次（SOP：备份在位→重启→healthz+真链一发验证）→读数回执。
5. **毕报**：全链读数+patch diff（脱敏形）+证据链→CTO 门禁→COS 转呈。

## 四 · 门禁判据（CTO 验收面·预公告）

- 试跑 PASS 读数独立复核（沙箱单发可复现或读数链自洽）
- 切换后活体：healthz+真链一发（glm 模型回包非空）
- 回滚姿态：config.bak 在位+恢复路径一句可执行
- D-46 面抽验：全链读数零值面（hash12 投影除外）
- 观察窗：切换后 24h dsh-web-prod 日志零 401/5xx 异常簇（SDE 日报带读数）

## 五 · 通道与环境

- 河源通道：`ssh -J M-SG-47.245.122.61 R-HY-8.155.54.79`（部署主语 fleet·git 操作 sudo -u fleet）
- dsh 真身：`/srv/fleet/dsh/`（node_modules/.bin/dsh）·服务=dsh-web-prod（8791）
- R-HY 高频连触阿里云限 IP：连接走 -J sg 形·勿高频直连

## 六 · 使用依据

- COS 实施启动令 2026-11-04T15:30:25+0800（CEO 15:29 裁·锚意见㊿+26·BOD commit 67a48d881）
- CTO glm key 勘定毕报（key 双形态实测：anthropic 经 8460=200·v4 经 8460=200·裸 key 直连=401）
- D-46·D-47·现役栈零触碰纪律
