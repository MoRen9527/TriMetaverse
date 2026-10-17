# SDE 勘验卷 · 候选三时盒勘验毕（acp profile 只勘不承建·可行/部分可行+成本读数）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-tb3-acp-feasibility-survey-20261017.md
- syncMode: static（勘验卷·只勘不建·时盒 06:41-06:47Z 用时 6min/60min）
- lastSyncedAt: 2026-10-17 06:47:19Z（+8=14:47:19 北京·date 现查原值·D-47 正形）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 时盒令（COO 144 笔裁·≤1h·毕报 CTO+COO·COS 督办抄送）
- 施工位: 河源 R-HY 只读勘验（零施工零常驻·B 系零触碰）

## 勘验结论（先行）

**判定=部分可行**：驱动链全通（文档化·零逆向）·**per-seat persona/compass 差异化注入=结构性缺口**（三条补位路径成本各异·候 CTO 终裁 B14 门形态）。

## 四刀勘验链（读数实录）

| 刀 | 勘面 | 实锚读数 |
| --- | --- | --- |
| 1 | 包族+acp profile+CLI 面 | @deepseek-ai 包 200+：**dsh-acp/dsh-acp-app/dsh-headless/dsh-sdk-protocol/dsh-sdk-jsonrpc-server 全在**；~/.dsh/profiles/acp/ 存在（auto-init 形·patch 空）；`dsh --profile acp`=stdio 服务 |
| 2 | acp 配置+协议契约 | bundles=[**dsh-base, dsh-acp-app**]（无 dsh-agent-preset-registry——P0 实锚复核 ✓）；config 三字段=provider/model/sessionListPageSize——**无 preset/system-prompt 注入字段**；协议=标准 ACP v1（agentclientprotocol.com）·stdio JSON-RPC·单连接多会话·session/new/prompt/update/list/resume/close 全文档化·authenticate 免鉴权（stdio 信任边界）·repo 客户端=dsh-subagent-acp 在 |
| 3 | 注入位深勘 | session/new 带 absolute workspace 参数（每会话独立 workspace 实锚）；configuration-option 仅 model/reasoning_effort |
| 4 | headless+instructions 补位 | **dsh-headless=one-shot 形**（`dsh --profile headless "task"` 出答案退出·`--json` 事件流·`--session-id` resume·零常驻零端口——首句毕锚最贴形）；**dsh-agent-instructions=workspace 指令链**（AGENTS.md/CLAUDE.md 兼容·dsh-base 默认挂·65,536B 预算·user-global+project 级链式加载——**system 级注入位存在**） |

## 可行性判读（三层）

1. **驱动链=可行 ✓**：ACP/headless 均文档化完整·脚本驱动「建会话→发首句→收回复→毕锚读数」全链零逆向零自研（headless 单命令形最简·ACP 持久会话形合 13 席常驻语义）。
2. **per-seat 差异化=结构性缺口 ✗**：acp 形无 preset registry（P0 实锚+本轮 bundles 复核双实锚）·config 无注入字段——**13 席各不同 compass/persona 无法经 acp 原生位注入**。
3. **补位路径三条（成本读数）**：
   - **a. prompt 级嵌入**：首句 prompt 拼 persona 自检指令（compass 内容入 prompt 文）——**零施工·小时级**·毕锚语义弱化（非 system 挂载·读数判读面候 CTO 认）
   - **b. 席级 workspace+instructions 链**：session/new 每席指独立 cwd+席级 AGENTS.md（compass 内容）→instructions 链 system 级注入——**半日级**（13 工作区+13 指令件造物）·语义正形（与 web preset 挂载同级）
   - **c. 窗2 #3 适配件**：mailbox 桥+per-session 注入（原设计面·CTO 设计后施工）——**窗2 原计划时点**
   - 推荐序：**b（语义正形）> a（快验形）> c（窗2）**——候 CTO 按结论终裁 B14 门形态细则（COO 144 笔裁定向）。

## 时盒纪律

用时 6min/60min·只读勘验零施工（未起任何 acp/headless 实例·13 席与生产实例零触碰）——「只勘不承建」边界照守。

## 使用依据

- COO 144 笔时盒令（14:41）·CTO 三候选裁请（14:41 信）
- dsh-acp/dsh-headless/dsh-agent-instructions README（装设位直读·文档化面非逆向）
- P0 层 2 勘定链（ef494bebb·preset 链绑死 web-app 实锚）

落款=SDE 小布 2026-10-17 06:47:19Z（+8=14:47:19 北京·date 现查原值·发毕对表）
