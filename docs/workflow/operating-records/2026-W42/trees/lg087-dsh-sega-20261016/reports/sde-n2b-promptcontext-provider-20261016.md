# SDE 施工卷 · charter-2026-W42-003 n2 停点期插件·PromptContext provider b 案毕（合同 §五正形落仓+发布 v2 链绿）

- tree-id: 2b（n2 毕停点期插入件·CTO 21:02:21 裁 b 案+COO 21:02:35 补令「停点 a 未解即插」）
- charter: charter-2026-W42-003
- syncMode: static（施工在案卷）
- lastSyncedAt: 2026-10-16 21:37:30+08:00（date 现查 21:37:11+0800）
- 执行席: SDE 小布（m-sde）；施工位=本机主仓（真源件）+河源 R-HY（探针+发布）

## 机制探针段（河源一次性 home·零扰现役）

| 探针 | 读数 | 判 |
| --- | --- | --- |
| patch→组合树 | probe preset 经一次性 DSH_HOME `profiles/acp/cordis.patch.yml` 入 acp 组合树（dump 7 命中·391 行） | ✓（B1 同形挂法复证） |
| ACP 链（无钥匙） | spawn→initialize(pv=1)→authenticate→session/new→close 全绿 4s | ✓ |
| 插件 import 时点 | stderr 零行+dump 组合含 preset——判=**render 级懒加载**（首 prompt 才 mount 插件模块） | ⏳ 候 n3 三验①（key 到位 render 对表一并验·与 CTO 补令③同口径） |

## 契约实勘（dsh 0.2.0-rc.2 types 直读·非记忆）

- `PromptContext={name,order,text}`（text: string \| ((AssembleContext)=>string)·name 重复注册 throw·contexts 升序 join·materialized as sourced user-role snapshot）
- 注册 API=`ctx.systemPrompt.context(ctx): ()=>void`；service 依赖声明=`inject:['systemPrompt']`（time-context 先例=['agents','sessionProjections']）
- **合同 §五差发现**：`required:true` 候定项在现版 types **不存在**（无豁免 runtime-context 压制的字段）——CTO 补令③「留实测钉死」的实测前提变化=无从实现·n3 三验①若遇 suppressRuntimeContext 压制场景如实报裁（候 CTO 面）
- `ScopeKey=object`（opaque）——provider 按 scope 反查席名不可行——**改走 preset plugins agent-scoped mount**（13 preset 各挂一行·config.file 直传该席路径·零 scope 反查·与「Agent-scoped contributions override same-named global defaults」契约面精确对位）
- 装载解析（cordis-plugin-loader）：插件 name 支持绝对路径 import（生产 internal loader 路 `internal.import(name, baseUrl)` 同语义）——**绝对路径形实测入树**（探针+发布 v2 双证）

## 正形三件（推仓 885ab4c97）

1. **scripts/dsh/tricompass-context/index.mjs v1**（provider 真源件·零依赖 ESM·node:fs 内建）：每 assembly 活读 `<workspaceRoot>/<file>` compass 文件（真源单源零复制·compass 更新零 Host 重启即反映）；缺文件降级空文本（assembly contributes nothing）+stderr warn 留痕；order=9900（外部贡献任意有限 order 合规段）
2. **转译器 v2**：`--compass-plugin-path`+`--workspace-root` 双参同给同缺门→每 preset plugins 尾挂载行（file=.claude/compass/<dir>.session.md）
3. **核验器 v2**：挂载行 13/13+每席 file 路径+workspaceRoot（Linux 绝对路径正形判据）断言

## 发布 v2 链读数（21:33-21:36）

| 步 | 读数 | 判 |
| --- | --- | --- |
| 河源 pull | 885ab4c97 ff 平 | ✓ |
| v2 转译+verify | 全断言绿（结构+挂载 13/13+逐席 sha256+映射表） | ✓ |
| web dump 预验 | rc=0·14390 行·tricompass 26 命中·出厂段 1259 行零差异 | ✓ |
| acp dump 预验 | rc=0·6977 行·13 preset L381 起·26 命中 | ✓ |
| 发布 | cordis.patch.yml=294907B（v2）·备份链 `[]` 217B+v1 291557B 双锚在位 | ✓ |
| 发布位 boot 验证 | 纯 profile rc=0·26 命中·出厂段零差异 | ✓ |
| 零扰动 | TriRMC 8710 绿逐项平·tmux 13·真席 16 | ✓ |

**v2 产物 hash 锚**：cordis.patch.13seat.yml stable（剔 generated 行）=**bb484754decffa84**·compass-path-map.yml stable=**c2ba158557390754**（full=4cd290becd193605/b7f630809dfa54f9）

## 观察注（如实记·非阻塞）

- 本机产物 Git Bash MSYS 路径形变（`/srv/fleet`→`C:/Program Files/Git/srv/fleet`）——本机产物仅形验弃用·正形产物=河源 Linux 侧跑（跨机跑参数含绝对路径时的坑族新形态）
- **acp vs web dump 缩进形差**：同 config 两 profile dump 顶层缩进不同（acp 顶格/web 两空格）——探读禁带缩进锚假设（假读数家族新形态注记）
- 插件 render 级验证（context 注册+compass 文本组装+13 席身份分流）候 n3 三验①（key 到位）——探针件与测试床留 /home/fleet/dsh-compass-probe-20261016/ 可复用

## CTO required 裁示归档（2026-10-16 21:47:47 裁·COO 转达·本席照办三件）

- **裁**：required=true 半项=**接受现状+suppress 场景运行期监控+上游 dsh types 增补挂候窗项**（理由三段：不挂外部依赖命脉/监控面可覆盖/三验①硬门不降标准）
- ① 候窗项「dsh 上游 types required 能力增补」入 LG-087 窗2/版本升级窗清单（排程承载=COO 面同记）
- ② suppress 场景计数进 n3 后运行观察读数（本席 n3 波1 三验①及运行观察段执行）
- ③ ScopeKey 正形形态 CTO 已认（preset plugins agent-scoped mount）·n2b 全绿收讫——本文「契约实勘」节 required 悬置项自此落定闭环

## resumePoint

- n2 主线+停点期插件双毕；n3 候两停点（①deepseek key CEO 直供候接取 ②桥修候窗2）
- key 到位后 n3 三验①含：compass 注入渲染对表（本插件 render 面首验）+persona 自检句+required/suppress 场景实测报裁

## 使用依据

- 合同件⑤（dsh-window1-contract-20261014.md）+CTO 21:02:21 b 案裁+COO 21:02:35 补令
- dsh-system-prompt types/cordis-plugin-loader/dsh-time-context README 源码直读（npx 缓存+钉死装设·2026-10-16 实勘）
- 河源 B1 分账卷（8c5f4a094·ACP 链实操形+一次性 home 先例）
