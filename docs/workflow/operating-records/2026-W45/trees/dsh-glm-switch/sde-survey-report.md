# dsh 换栈 GLM · 工序 1 勘定卷（SDE·先勘后动·全只读）

- sourceOfTruth: 本卷（工序 1 勘定读数正身·候 CTO 门禁核阅）
- syncMode: write-time
- lastSyncedAt: 2026-11-04T07:55:31Z（date 现查原值）
- 令源: CTO 实施单 cto-dispatch-order.md（43cd92e54·五工序·本卷=工序 1）
- 勘定方式: ssh -J M-SG R-HY 六轮只读·全部输出过 12+8 掩码管道（D-46·值面零回显）

## 一 · 现势读数（活体实锚）

| 面 | 读数 | 锚 |
|---|---|---|
| bin 真身 | `/srv/fleet/dsh/node_modules/.bin/dsh`→`@deepseek-ai/dsh/lib/bin.js` | readlink |
| build 版本 | **0.2.0-rc.2**（dsh 与 dsh-base 双包对表全等） | package.json ×2·`dsh --version` |
| 服务形态 | **transient user unit**（/run/user/1000/systemd/transient/dsh-web-prod.service·systemd-run 创建·非盘上 unit） | systemctl --user status |
| unit ExecStart | python3 `/home/fleet/.dsh-workspaces/r-duty-cos/.rot/run-web-masked.py`（D-46 banner 掩码 wrapper·子进程继承 env·DSH_HOME 显式注入） | unit cat+wrapper 源 |
| 重启面 | `sudo -u fleet env XDG_RUNTIME_DIR=/run/user/1000 systemctl --user restart dsh-web-prod`（transient 重启保留定义·CollectMode=inactive-or-failed） | status Loaded 行 |
| prod DSH_HOME | **/home/fleet/.dsh**（proc environ+unit Environment 双实锚） | /proc/525474/environ |
| 监听 | 127.0.0.1:8791（node pid 525474·since Oct21·cwd=/srv/fleet/TriMetaverse）·8460=独立 node pid 893 | ss -tlnp |
| 配置面 | **无 config.json**——配置=profiles/{web,headless,acp,sdk}/ 四 profile·每者 cordis.yml（空入口）+cordis.patch.yml（真配置）+package.json（bundles） | DSH_HOME 树勘 |
| web patch | 4681 行·头部注记=转译器生成 13 席 preset 发布物（禁人工编辑·修订走源侧合同）·provider 键段=spawn/fork/codex/claude-code 系（工具 subagent 面·非 LLM provider） | patch 直读 |
| headless patch | **空 []**（4 行·纯骨架·零自定义）——沙箱试跑基准形态 | patch 直读 |
| 凭据现势 | `.credentials.yaml`（600·223B）：records(client-connection/browser-session)+**refs: DEEPSEEK_API_KEY**（现役 deepseek 走 stored-file 形） | 键面投影 |
| env 键现势 | unit Environment 仅 HOME/DSH_HOME——**无 DEEPSEEK_API_KEY env 键**（现役=纯 stored-file 形） | unit cat |

## 二 · schema 三键正形（0.2.0-rc.2 实勘·dsh-base patch+README 双源）

1. **agent-default-model**（`@deepseek-ai/dsh-agent-default-model` 包）：config={**provider**(required), **model**(required), reasoningEffort?(optional)}——「Saved selections update the active profile patch」·fresh agent 默认路由由此包应答。
2. **providers map**（`@deepseek-ai/dsh-llm-pi-ai` 包）：`providers` dictionary=整配置面·每 key=route name（请求以 GenerateOptions.provider 选路）·字段={**apiKeyEnv**, **baseURL**, api, models, modelOverrides, compat}·`api` 仅 catalog 供不出的端点需要。包在位 ✓（node_modules 实勘）。与 llm-deepseek 可共存（路由名不碰撞）。
3. **apiKeyEnv 语义**（credential seam）：=credential **reference**（env 键名）·per-request resolve·**值面不进配置文件**（`MISSING_CREDENTIAL` fail 即无值）。

## 三 · credential seam 解析序（dsh-credentials-local README 实勘）

launch env（wins·启动时快照·启动后 export 不可见）→ **stored file**（.credentials.yaml refs·可直编辑·自动 reload·survives restarts）→ 项目 .env（invocation cwd）→ `$DSH_HOME/.env`。
yaml refs 正形：`refs: {KEY_NAME: sk-…}`（README L89-90 原形）。

## 四 · 两形勘定（实施单要件③·SDE 裁形候核）

- **形 R（推荐）：复用 credential seam stored-file 值链**——GLM key 写入 `.credentials.yaml` refs（键名候定：`GLM_API_KEY` 与 duty-env 同名但值=settings.json 真值，或独立键名防混淆）+patch apiKeyEnv 指该键名。**足迹**：值面单点（600 yaml·与现役 DEEPSEEK_API_KEY 同机制同文件）·env 副本 +0·**reload 自动零重启**（stored file 变更即时）。
- **形 E（备选）：新增 env 键**——unit Environment 写值。**足迹**：token 副本 +1 进 unit 定义·launch env=wins 层且快照启动时取→**必须重建 transient unit 才生效**·后续轮换面双点（unit+store）。
- SDE 初判=**形 R**（D-46 足迹最小+与现役机制同构+零重启）·候 CTO 核。

## 五 · 施工落点勘定（两选候裁）

web profile patch 头部「转译器生成·禁人工编辑」标注张力：三键 patch 落点两选——
- **落点 W1：web cordis.patch.yml 尾部 append insert 块**（llm-pi-ai 行+agent-default-model 行——patch=array of loader patch entries 的正常用法·last-write-wins 按 id 覆写 bundle 默认）·**触碰**头部标注面（标注语义疑指 preset 内容段非配置段·候 CTO 勘义）。
- **落点 W2：--patch overlay 文件**（cordis.yml 注释正形：「then any --patch overlays」）——零触碰主 patch·但 unit ExecStart 须加 --patch flag=**重建 transient unit**（一次性重启窗·可与工序 4 切换步重合）。
- SDE 初判=W1（patch 机制本义·preset 段零触碰·零 unit 重建）+头部标注面加注记行声明施工边界·候 CTO 核。

## 六 · 试跑 gate 隔离形勘定（rc.2 首跑坑防护）

- 沙箱 DSH_HOME=独立目录（如 /home/fleet/.dsh-gate-sandbox）·**预置** profiles/headless/ 全骨架四件（cordis.yml+cordis.patch.yml+package.json+pnpm-workspace.yaml 从 prod 拷）+patch 预置三键+credentials refs 预置——防 rc.2 首跑初始化生成默认骨架覆写 patch。
- 首跑坑机理面：rc.2 首跑会从 bundle 生成 profile 骨架（headless 现状[]=首跑后形）——预置形绕开生成窗。
- gate 判据（实施单 §四）：HTTP 200+非空 completion+模型 id 呈 glm 系。

## 七 · 悬置与候澄清

- **863825B 标识**：dsh/dsh-base lib+web.log banner 全面 grep 零命中（banner 行=launch token 行+compass 注册行）——实锚 build=0.2.0-rc.2；863825B 出处候 CTO 澄清（勘定卷原文出处·若系 git hash 或外部标识请给对表位）。
- glm 模型 id 正形（agents 字面）候 CTO 给（实施单「glm 模型 id」占位——glm-4.6/glm-5.3 系具体 id 由 CTO 勘定卷定）。
- patch 变更生效面：pi-ai routes=per-request resolve 零重启（settings 面）；patch 行变更=HMR reload 或 profile restart（llm-deepseek README 同款语义）——**HMR 现役形态候工序 2 勘**（base patch hmr 行 disabled: !!js "!ctx.get('profileContext')"——web profile 下 profileContext 在位→HMR 启用面推断·施工时活体验证）。

## 八 · 零触碰确认

8791 现役零动（勘定全只读）·8460 只读勘（pid 893 在位）·8710 未触·caddy 未触·13 席 settings 未触·.credentials.yaml 只读键面投影（值零出）。

## 九 · 使用依据

- CTO 实施单 cto-dispatch-order.md（43cd92e54）
- dsh-base/cordis.patch.yml（529 行 schema 原稿）·dsh-llm-deepseek/README.md · dsh-llm-pi-ai/README.md · dsh-credentials-local/README.md · dsh-agent-default-model/README.md（均 rc.2 在位物）
- 活体读数：systemctl --user status/cat（fleet 身份）·ss·ps·/proc environ·DSH_HOME 树勘
- D-46 掩码管道（12+8 规则）全程
