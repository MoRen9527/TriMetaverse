# LG-060 契约投影漂移清单卷（勘细化）

- 执行: m-duty-cos 0925；对平面=TriRLC（sg 副本）测试期望 vs TC source-agents 契约投影（v3）；TMV/TriMMC 面同法扩展位注明

## 契约投影面字段现势

- source-agents v3 契约含 runtime_equivalent/runtime_baseline 字段 0 处（v3 新增结构）
- TriRLC 三族测试文件对该两字段零断言（期望面未随 v3 演进）＝结构型漂移主体

## 三族漂移账（STE 首勘 589/584/4 案 3 族对表）

### Contract Resolver 族
- 测试件: /test/contract-resolver.test.ts（sg 副本实存）
  - 期望锚 :6 import { AgentContractResolver, DEFAULT_SELECTED_ROLES } from '../src/config/contract-resolver.js';
  - 期望锚 :8 interface V3ContractExtra {
  - 期望锚 :16 function v3Contract(agentId: string, extra?: V3ContractExtra): string {
  - 期望锚 :21 'contract:',
  - 期望锚 :23 '  type: agent-contract',
  - 期望锚 :32 `  agent_body: ${agentId}/agent-body.agent.md`,

### Session Initializer 族
- 测试件: /test/session-initializer.test.ts（sg 副本实存）
  - 期望锚 :7 import { getContractResolver } from '../src/config/contract-resolver.js';
  - 期望锚 :26 writeFile(join(agentDir, 'agent-body.agent.md'), 'Sample body', 'utf-8'),
  - 期望锚 :32 join(agentDir, 'sample-agent.contract.yaml'),
  - 期望锚 :34 'contract:',
  - 期望锚 :36 '  type: agent-contract',
  - 期望锚 :45 '  agent_body: sample-agent/agent-body.agent.md',

### Knowledge Injector 族
- 测试件: /test/knowledge-injector.test.ts（sg 副本实存）
  - 期望锚 :46 import { getContractResolver } from '../src/config/contract-resolver.js';
  - 期望锚 :316 // 域后缀：契约层标 (contract)，防与内容层 curated 混淆
  - 期望锚 :317 assert.ok(block.includes('## Memory (contract)'));
  - 期望锚 :318 assert.ok(block.includes('## Colleagues (contract)'));
  - 期望锚 :319 assert.ok(block.includes('## Social (contract)'));
  - 期望锚 :508 assert.equal(isEscalationBlockReason('Tool is forbidden by contract decision rights'), true);

## 漂移类型归纲

- 结构型（主）: 契约投影 v3 字段族（runtime_equivalent/runtime_baseline）已入源侧、测试期望面未跟进——既有挂族 diff 零触实证（STE 105b39b6）＝测试挂族非源侧回退所致
- 名址型: source-agents 正名族（SDE/宿主资产目录）与四仓测试期望快照代差——件1 分叉同源（本机 TC 源侧零正名窗内渲染/测试面取旧形）
- 计数型: 嵌套子案计数 vs 族口径（FSD/STE 对差已解消先例）——本卷未见新增计数型

疑似引入时点: v3 契约投影落位批（0918-0922 窗，SDE 正名族+binding-closeout 系 commit 群）与 TriRLC 测试基线（496613b 前）时间差——逐条时点候 git 考古（CTO 族分派后深掘），本卷供弹到此。
