# SDE 施工卷 · charter-2026-W42-003 n1 dsh 装设+scoped persona 实测首验（机制面全绿·两候料停点如实记）

- tree-id: 1（charter-003 拆树 n1·施工单 G1-N1-R2 到场凭证 cbf2e08bd）
- charter: charter-2026-W42-003
- syncMode: static（施工在案卷）
- lastSyncedAt: 2026-10-16 20:53:03+08:00（date 现查）
- 执行席: SDE 小布（m-sde）；施工位=河源 R-HY（fleet 身份）

## 拾取校验

- ①开工凭证：G1 节点1 施工指令单 R2（cbf2e08bd·COO 20:44:08 签发·pane 直投+跨会话消息双通道同文）——内容=正身拆树 n1 行全文转录零增量·「先到先执行后到勿重复」——本席 20:30 已按正身开工（开工回执 COO 20:31:26），指令单到场=凭证补齐零冲突✓
- ②0→1 依赖闭合：n0 干净断言 0 行落卷（8803b96a4）在链✓
- ③前置门②会签双认：CTO A 部 20:22:31+R 面 B 部 781106dcb（r-duty-cos 认·零修正·「n2 批量开工门放行」）✓
- ④护栏§四七条对表收账✓（零席退役/D-24/串行/D-46 D-54/全可回滚/D-23 v3.1/token 报 CFO）

## 装设段读数（20:35-20:40 拍）

| 项 | 读数 | 判 |
| --- | --- | --- |
| Node 前置 | v22.23.2 | ✓ |
| 版本钉住 | @deepseek-ai/dsh **0.2.0-rc.2** exact（dist-tags next/latest 均此·alpha 0.2.1-alpha.5 不追·developer preview 兼容破坏预警=钉住必要） | ✓ |
| Web UI 绑定 | dsh web LISTEN **127.0.0.1:3080**（node pid 86156·进程树 85106 npm exec→86156）·本地绑定断言✓·禁改 0.0.0.0 守住 | ✓ |
| 调用正形 | `npm exec @deepseek-ai/dsh@0.2.0-rc.2`（npx 缓存 bin） | ✓ |
| healthz 前基线 | ok/mcLedger ok/jobCount 3/cf=0/degraded=false | ✓ |

## TriModel deepseek 卡接入——键值面=0 候料停点（如实记）

- `grep -c DEEPSEEK /srv/fleet/trimodel-data/api-token.env` = **0**（键族零在册）
- 判定：卡值面未供——dsh Web UI 起但模型会话跑不了。**候 CTO/CEO 供卡（D-46 管道·值面零落盘零打印）**；候料期机制面照常推进（本卷即证）。

## 机制勘定链（CLI/profile/patch/persona——零 token dump-config 验证形全程）

1. **CLI 形态**：profile 制（`--profile <n>`=boot $DSH_HOME/profiles/<n>）·`--patch <path>` repeatable overlay·`--dump-config`/`--dump-config-schema`（JSON Schema=配置合同真源 841KB）·`dsh headless "task"` 单任务形。
2. **profile 层文件真身**（~/.dsh/profiles/web/）：`cordis.yml`（=空 entry list `[]`·书明「Edit cordis.patch.yml, not this file」）+`cordis.patch.yml`（=「id-targeted config overrides, disables, **and insert lists**; `!!js` expressions allowed」）+package.json（bundles: dsh-base+dsh-web-app）。
3. **patch 三语义（实测钉死）**：
   - 裸新增 entry → `patch: entry "X" not found`（不可 append——首试实证）
   - id 寻址已有 entry → **config 整体替换非深合并**（patch2 实证：persona 落了但 plugins 整表被换 1259→1088 行·config.id/order 同丢）
   - **`insert:` 列表 → append entries**（patch3 实证 rc=0·下节）——schema includePatch 原句「An insert appends entries, optionally inside the group identified by id」
4. **B1 scoped persona 实测首验（核心判定）**：
   - persona row 正形=preset 内挂 `@deepseek-ai/dsh-persona`（config: prefix required/suffix 默认空=shadow 全局/complete/includeRuntimeContext）——包 README 原句「a preset mounts this composable row to give one agent its own system-prompt persona, shadowing the deployment-wide defaults」「Without this row, a preset could change an agent's tools but never its identity」
   - insert 形 patch3 实测（/tmp/sde-persona-patch3.yml）：`insert: [preset-r-duty-cos-test(@deepseek-ai/dsh-agent-preset·config.id r-duty-cos-test·plugins[persona row 带 prefix 自检句+suffix {{cwd}}])]` → dump-config **rc=0 组合树 1273 行**：新 preset 在树 L1261✓·persona 文本在✓·preset-standard 无损对照（id: standard L624 在）✓
   - registry README 官方背书同构：「A new preset or an override of a shipped one is a bundle patch: **an `insert` of a `@deepseek-ai/dsh-agent-preset` row**, or a patch keyed by that row's id, installed into the profile」
   - **判定：scoped persona=纯配置组合可落，零 bundle patch——不停窗（止损条款「需 patch=停窗报裁」逆判定成立）**
5. **13 席形态钉死（n2 转译器设计输入）**：**1 profile+13 preset**（registry README「One process can run several compositions…let sessions select one」——非 13 profile）；preset 字段合同=config.id（session 身份·required）/plugins（required）/name/description/order；声明行 id（Loader 寻址）≠config.id；「edits affect subsequently created Agents，existing Agents retain」=波次接位天然安全；持久发布位=profile 层 cordis.patch.yml（活体 web server 在用——n1 不落持久件避免扰动，发布属 n2 面）。
6. 附属发现：npx 缓存含 **dsh-acp/dsh-acp-app**（n3 三验① ACP session/new 面正主）·agent-team.md=experimental Session 级 roster（非 13 席 persona 正形·如实记排除依据）。

## 烟测门分段态（如实记·毕锚口径）

| 段 | 态 |
| --- | --- |
| 装设+版本钉+本地绑定 | ✓ 绿（本卷读数） |
| healthz 对表 | ✓ 绿（前基线+零扰动） |
| **信箱一来一回经适配件** | ⏸ **候桥修**——TriRMC message 桥两败形态（首投 120s 超窗 SIGKILL+补投 bridge_failed 秒败·根因候 CTO 勘：疑 unit root 身份+headless 权限面）已随 n0 卷观察注呈报；降级路 send-keys 直投已实证（会签请 cos 送达处理中·回签 781106dcb 已落卷） |
| 身份面实测（persona 渲染自检句） | ⏸ 候 DEEPSEEK 键值面（机制面已验：组合树 persona 文本在·渲染活体候键） |

## resumePoint

- n1 机制面毕；两候料停点（①DEEPSEEK 卡键值面=0 候 CTO/CEO 供卡 ②信箱段候桥修/适配件）——供卡到位即可跑身份面活体首验（persona 自检句渲染+headless 单任务）
- n2 候令开工（指令单明载「节点2 开工随节点1 毕锚另令」·会签门已放行）；转译器输入合同已备齐（patch 三语义/insert 正形/preset 字段合同/1 profile+13 preset/persona row 字段）
- 观察注顺承：进程 16048（tmux 壳残留）候席位面操作窗勘清；桥超时参数 120s 上调否候 CTO 门禁面裁

## 回滚锚

- dsh 全件=npx 缓存+~/.dsh profile 目录+web 进程——停用=杀 86156 进程树（权威路径·禁裸杀照 D-03 两步）+删 ~/.dsh/profiles/web+清 npx 缓存目录；**零 claude 席触碰零 TriRMC 本体变更**（段A 零不可逆·模板 57cf86b64 幂等重演兜底）

## 使用依据

- charter-2026-W42-003 正身+G1-N1-R2 施工单（cbf2e08bd）+CEO 20:15:46 裁令
- persona/system-prompt/agent-preset(-registry)/boot 官方文档（GitHub deepseek-ai/deepseek-harness gh api 直读）+dump-config-schema（841KB 合同真源）+dump-config 组合树三次实测（1259/1088/1273 行）
- D-24 活体现探·D-46 值面纪律（token 计数面断言零打印）·fleet 身份施工零属主残留
