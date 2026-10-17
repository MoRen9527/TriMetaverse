# SDE 勘验停报卷 · P0 b 案变体触前提门 1（SDK 路径 preset 零消费点）· 候 CTO 裁

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-p0-sdk-preset-stopline-20261017.md
- syncMode: static（停报裁卷·候裁态）
- lastSyncedAt: 2026-10-17 13:33:24+08:00（date 现查原值·D-47 正形·勘误注记：原落笔预填 13:58:20 系未现查误值·13:33:24 现查勘正——D-47 二犯自报）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 P0（CTO 66ab801bd 裁 b 案变体·前提门自验触发停报条款）
- 施工位: 河源 R-HY 探针床 ~/.dsh-sega-n3（观测载体·生产 ~/.dsh 零触碰）

## 前提门自验结果（三门两过一触线）

| 门 | 判 | 依据 |
| --- | --- | --- |
| 1 patch 内容=官方正形非自研 | **过** | registry+preset 条=官方 README Minimal configuration 正形复用·preset cos 段=web patch L9-389 同源照抄（381 行）·LLM 条=dsh-llm-deepseek README Minimal 正形（apiKeyEnv 引用形零值内联） |
| 2 sdk 实例不接生产 key | **过** | 探针床 DSH_HOME 独立（~/.dsh-sega-n3）·key=探针床 deepseek.env 裸值形（600·35B·变量读入零回显）·maxTokens=300 探针级·生产 ~/.dsh 零触碰 |
| 3 版本 exact pin | **过** | 0.2.0-rc.2 装设位复验在册·dsh 升级窗 patch 迁移项挂账（窗2 #2 同窗族） |

**但施工实测触停报条款**：让 SDK 会话实际 join preset **无官方配置位**——需自研 glue 代码=触「新施工禁」线（前提门 1 的停报分支）。

## 触线勘定链（源码三面+活体双证）

| 面 | 读数 |
| --- | --- |
| 源码① | dsh-sdk-app/lib + dsh-sdk-jsonrpc-server/lib：grep preset **零命中**（SDK 创建链无 preset 概念） |
| 源码② | dsh-agent/lib（agent core）：grep preset 零命中——**agent core 无 preset 概念·preset 纯 web-app 上层机制** |
| 源码③ | registry README 官方明文：「The Web definitions come from the **dsh-web-app** bundle」+「Session logs retain the preset ID and **blank-session selections**」——选中面在 web 会话层（GUI 选择器 dsh-client-ui-agent-preset） |
| 活体① | patch 补挂后 boot 绿：tricompass-context 挂载行打出（preset 段加载实锚）+handshake ✓（serverInfo.name=deepseek-harness-sdk-runtime）+deepseek-official/deepseek-flash 模型调用通 |
| 活体② | 三验探针 reply=「我是 DeepSeek Harness 驱动的 AI 编码代理（deepseek-flash 模型），无个人姓名。/ none」=**裸 agent 形**（无 COS persona·无 compass 上下文）——registry 服务在册但 SDK 懒创建路径不 join |

## 已施工面状态（候裁后处置）

- sdk 观测载体 patch 三条已挂（llm-deepseek-api-key+agent-preset-registry+preset-r-duty-cos·全官方语法·390 行）
- 探针管线 v3 全通（handshake-gate+role 过滤+idle 判·assistant 真回签收达）
- 时序坑实录：session/prompt 必须候 initialize result 到手再发（先发=-32603 not initialized·mini dump 实锚）——若裁留 sdk 形（窗2 #7 协议底座）此坑入卷备查

## 选项表（呈裁）

| 项 | 形 | 官方性 | 工期 |
| --- | --- | --- | --- |
| **1（本席荐）** | **观测载体=web 形单实例**：独立 DSH_HOME 观测目录+探针级 key+专用端口·web-app 完整 preset 链出厂自带（13 preset patch 同源挂载·读生产发布位形）——三验①②在观测 web 实例跑·毕锚不变 | 全官方组合零自研（与 13 席生产形态同构·隔离=独立 home/端口/key+发布位零触碰） | 分钟级（boot+探针） |
| 2 | 维持 sdk 形·自研 preset join glue（改 sdk-app 创建链或桥接插件） | **触「新施工禁」线**——候 CTO 明示豁免才动（不荐） | 半日级+维护债 |
| 3 | a 案 WS 客户端（窗2 #7·备而不用原判） | 原判不翻 | 半日级 |

## 附带勘明（本窗沉淀）

- dsh 入口正身=装设位 node_modules/.bin/dsh（非 bin/dsh.js）
- provider 正名=`deepseek-official`·默认模型目录=deepseek-flash/deepseek-v4-pro（非 deepseek-chat）
- sdk/acp profile 出厂 bundle 均无 LLM adapter（纯 runtime 壳）——任何 SDK 形使用都需 patch 补 LLM 条
- fleet ~/.claude.json trust 门：/srv/fleet 与 /srv/fleet/TriRMC 条已补（B 系 spawn 前置已扫清·P1 窗实锚）

## 使用依据

- CTO 裁示卷 66ab801bd（P0 三前提门+停报条款原文）
- web patch 发布位（只读复用源·零触碰）·dsh 0.2.0-rc.2 装设位 README/源码直读
- P1 收口卷 sde-p1-bridge-fix-closeout-20261017.md（本窗前置实锚）

落款=SDE 小布 2026-10-17 13:33:24 +0800（date 现查原值·勘误后重落·发毕对表）
