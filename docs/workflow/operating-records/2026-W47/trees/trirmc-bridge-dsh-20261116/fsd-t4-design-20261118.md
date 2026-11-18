# T4 技术方案卷·桥工具面——13 席 preset 挂 SendMessage 桥工具（notice-168 放行裁定·FD 主刀·候 CTO 门禁）

- 执行: m-duty-fsd；令面=notice-168（T4 放行裁定·T2+T3 毕条件满足·任务书内工序·有活就干）+任务书 §三 T4 行+§九通道锚定（真值互发案=SendMessage 通道·禁信箱/tmux 充验）
- 施工位实锚: TriRMC dev（工具插件件·sg clone 同锚）+TriCompany dev（T3 生成器延一跳·9ef548b 后净树）
- 状态: **拟形候 CTO 门禁对表绿→编码**
- 现查: 2026-11-18T0xZ（D-47）

## §一 · 现势实锚（写前勘定四面）

1. **bridge HTTP API 面现役完备=TriRMC 侧零改**（src/server/app.ts 实锚）: GET `/internal/v1/agents`（注册表）+POST `/internal/v1/agents/{lookupKey}/message`（body={message, timeoutMs?}·寻址三键 sessionId/agentId/name 匹配+registry 兜底刷新·回执 200={ok,agent,task,reply}/502={ok:false,bridge_failed,timedOut}/404/400·per-message timeout 夹紧 30-600s·taskController 状态机 queued→running→completed/failed）——M1 Phase-2+T2 dsh 形接线谱系
2. **dsh tool 插件契约实锚**（dsh-tool-present 工件码读·最简参考形）: 模块导出 `{name, Config?, inject, apply}`·apply 内 `ctx.tools.register(defineTool({name, description, parameters, output?, execute(args, exec)}))`——parameters=JSON-schema-ish object 形
3. **patch 挂载先例实锚**: tricompass-context 尾件形=`- id: tricompass-context / name: '/abs/path/index.mjs' / config:{...}`——**name=绝对路径 file 形**（cordis loader :214-223 路径解析·t3a dump 实锚）
4. **T3 生成器现役形**: e7befe7（案 2 步①实装毕·白盒 12/12 转绿）+9ef548b append 面——延一跳挂载面=在此基础上加 flag

## §二 · T4 两件设计

### 2.1 SendMessage 桥工具插件（TriRMC scripts/dsh/r-duty-send-message/index.mjs·新件）

- **零 import 形（主形）**: 模块导出 `{name:'r-duty-send-message', inject:['tools'], apply}`——apply 内 `ctx.tools.register(plainTool)`（plain object 工具形·defineTool 省略=类型 helper 非运行时必需——白盒+活体窗双验证·备选形=require(esm) install-anchored defineTool（node22 require(esm) 实验域·白盒候证）——**CTO 对表点 A**
- 工具形: name=`send_message`·description（席间互发经 TriRMC 桥·照 118 语义）·parameters={target_seat:{string,required}（短名·工具内映射 `r-duty-${seat}` lookupKey 照 API name 匹配键）·message:{string,required}}——**execute**: 自环守卫（target=自身 env 注入 seat 名=拒·fail-visible）→fetch POST `{bridgeBase}/internal/v1/agents/r-duty-<seat>/message` body={message}→200=reply 文本返回·404/502/网络错=throw（错误面载状态码与 error 键·**零 message 值回显** D-46）
- bridgeBase: config 形（patch 条目 config 传·缺省 `http://127.0.0.1:8710`）+env `TRIRMC_BRIDGE_BASE` 优先——**河源 TriRMC daemon 端口实锚=部署窗核对项**（8710 河源现役面候值席勘·参数化承形）
- 仓归属: **TriRMC scripts/dsh/**（R 面域内聚·session-bridge 同域）——CTO 对表点 B（备选=TriMetaverse scripts/dsh/ tricompass 先例位）

### 2.2 T3 生成器延一跳·patch 挂载面（TriCompany 生成器 flag）

- flag `--with-bridge-tool <path>`（工具插件绝对路径）: 每席 preset plugins 追加 `{id:'r-duty-send-message', name:<path>, config:{}}`（数组尾·幂等=已含 id 零重复）——14 条目×各+1 件·readout `bridge_tool_injected: N`
- 挂载点=产物组装面（ordered 后 insert 数组成员 plugins.push）——T3 现役白盒 12 件守护零行为漂移（无 flag 时零变）

## §三 · 白盒族（sg 面全可跑）

1. 工具插件: fake ctx{tools.register 捕获}→tool 形断言（name/parameters/execute 在）→execute 面 mock fetch（globalThis.fetch stub 测试域）: 200 回执=reply 文本返/502=throw 载 bridge_failed/404=throw 载 agent_not_found/自环=throw/网络错=throw——**零 message 值回显断言**（错误面/读数面零信值）
2. 生成器 flag: 14 条目各 plugins 尾+1 断言+幂等（二次跑零重复）+无 flag 零变（T3 守护面）
3. plain register vs defineTool: 工具形对 dsh-tools ToolDefinition 契约面静态对表（types.d.ts 面勘——活体窗终证）

## §四 · 真值互发案（§九通道锚定·河源活体窗候排）

- **runbook**（值席/SDE 通道·候排窗）: ①headless patch（--with-bridge-tool 形）落实窗（照 T3 四步·web patch 零写）②一席对一席真值互发: `dsh --profile headless --session-id <A席uuid> "用 send_message 工具向 r-duty-<B席> 发送测试信"`→A 席调工具→bridge POST→B 席应答回执=**SendMessage 通道真值**（禁信箱/tmux 充验·§九锚定）③读数卷落树
- ⑤边界守卫: 非原生 agent-team 面零触（dsh-tool-subagent 族现役 disabled 形照守·零启面）

## §五 · 护栏

零触现役 loop 链/零 daemon 重启/web patch 零写（生成器 input read-only 照承）/单笔 revert（TriRMC+TriCompany 各一笔）/D-46 值面纪律（工具读数零信值）/零触 dsh 原生 agent-team 面（⑤边界）

## §六 · 工序（候门禁绿即启）

1. TriRMC 工具插件件+白盒→2. TriCompany 生成器 flag+白盒→3. 双仓单笔 commit+push→4. 毕报双通道（落卷+SendMessage 值席）→5. 活体互发案=河源窗候排（runbook 随卷·值席/SDE 通道）→T5 断言照任务书

## §七 · 使用依据

notice-168（T4 放行裁定）；任务书 §三 T4+§九；app.ts POST message handler 实读（206-276 行）；dsh-tool-present 工件码读（插件契约）；t3a dump（tricompass 路径挂载先例）；T2 收口定谳卷（SendMessage 语义基准）；118 纪律（通道语义）；D-46
