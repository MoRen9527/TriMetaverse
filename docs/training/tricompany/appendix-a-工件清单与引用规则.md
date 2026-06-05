# Appendix A：工件清单与引用规则

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/training/tricompany/appendix-a-工件清单与引用规则.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

## 1. 为什么要有这个附录

TriCompany 培训最怕的不是内容不够多，而是“讲得很顺，但不知道事实来自哪里”。  
因此本附录只做一件事：把 training 里反复引用的关键工件按层分类，帮助后来者快速定位 source、manifest、support、live、runtime 和 governance 的边界。

## 2. 分层工件清单

| 层 | 代表文件 | 作用 |
| --- | --- | --- |
| source rule | `TriCompany/runtime/cognition/employee_source_kit.py` | 规定源侧五件套、validator 和边界检查 |
| source rule | `TriCompany/runtime/cognition/knowledge_workspace.py` | 规定 role / employee / org / audit 四类 workspace 抽象 |
| source rule | `TriCompany/runtime/cognition/host_object_generation.py` | 定义各员工 object set、live entry status 与生成逻辑 |
| source workflow | `TriCompany/docs/workflow/host-object-publish-flow.md` | 规定入职、职责变动、binding、manifest 与 governance 回填顺序 |
| source workflow | `TriCompany/docs/workflow/chief-of-staff-llm-wiki-object-spec.md` | 规定总助 LLM wiki 的对象规范与 page promotion 规则 |
| binding / manifest | `TriCompany/.github/binding-profiles/ceo-chief-of-staff.json` | 说明总助 object set、live entry、supportObjects 与 runtimeNamespaces |
| support payload | `TriCompany-copilot-host-assets/host-object-manifest.json` | 说明 support bundle 当前发布了哪些 host object |
| support payload | `TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/wiki/page-specs.json` | 总助当前 page spec 样板 |
| live entry | `TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md` | 当前宿主真正生效的总助入口 |
| governance | `docs/workflow/tricompany-copilot-host-assets-governance.md` | 说明 source / support / live / central 四层治理边界 |
| central product truth | `tricompany.md` | 说明为什么需要 TriCompany、当前阶段目标与宿主边界 |

## 3. 阅读这些工件时的四条规则

### 3.1 先问“这是规则，还是结果”

- Python、workflow、source-agents、manifest 生成逻辑，通常属于规则。
- inbox、wiki、audit、workbench、运行快照，通常属于结果或当前宿主消费对象。

不要把结果误当规则，也不要把规则写成一次运行留下的痕迹。

### 3.2 先问“这是 source truth，还是 published-copy”

- `TriCompany/` 下多数是 source truth。
- `TriCompany-copilot-host-assets/` 下多数是 support payload、published-copy 或 evidence。
- `TriMetaverse/.github/` 是 live 入口，不是五件套真源。
- `TriMetaverse/docs/` 是中央摘要与协议层，不是模块全部实现真源。

### 3.3 先问“这是当前态，还是目标态”

只要你看到以下词，就要提高警惕：

- `TriMC` 正式宿主
- 正式授权矩阵
- 链上透明结算
- 全自动治理
- 完整岗位体系

这些大多应落在目标态或过渡态，不应轻易写成当前态。

### 3.4 先问“这个事实应该回写到哪里”

一个简单判断法：

- 长期岗位规则、生成逻辑、机制实现 -> 回 source truth。
- 当前宿主消费对象、工作台、wiki、audit -> 留在 support payload。
- 当前宿主 discoverable 入口 -> 留在 live `.github`。
- 中央边界、经营协议、operating record -> 回中央 `docs/`。
- 私有运行记忆、运行时状态 -> 进入 `TRICOMPANY_COGNITION_HOME` 或 `.tricompany-cognition`。

## 4. 总助 walkthrough 必引工件

如果你要单独讲总助 source -> publish -> live 链，至少应覆盖下面这些文件：

1. `TriCompany/runtime/cognition/employee_source_kit.py`
2. `TriCompany/runtime/cognition/knowledge_workspace.py`
3. `TriCompany/runtime/cognition/host_object_generation.py`
4. `TriCompany/.github/binding-profiles/ceo-chief-of-staff.json`
5. `TriCompany/docs/workflow/host-object-publish-flow.md`
6. `TriCompany/docs/workflow/chief-of-staff-llm-wiki-object-spec.md`
7. `TriCompany-copilot-host-assets/host-object-manifest.json`
8. `TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/wiki/page-specs.json`
9. `TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md`
10. `docs/workflow/tricompany-copilot-host-assets-governance.md`

如果这十个工件里有任何一个缺席，你讲出来的“总助全链路”大概率都会缺边。

## 5. 本附录小结

真正成熟的 training，不是靠写更多形容词，而是靠让每一个关键判断都能被回链到具体工件。  
TriCompany 作为一个接近 AI 治理公司的工程化经营载体，最重要的能力之一，就是让“组织设计”也能像代码一样被定位、被发布、被验证、被交接。
