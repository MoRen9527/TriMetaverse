# CEOChiefOfStaff 全链路案例

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/training/tricompany/04-ceo-chief-of-staff-全链路案例.md
- syncMode: source-only
- lastSyncedAt: 2026-06-04

## 1. 为什么用 CEOChiefOfStaff 做样板

如果只能选一个员工来讲清 TriCompany 的设计，`CEOChiefOfStaff` 是最合适的。原因不是它最复杂，而是它恰好把 TriCompany 当前最核心的几条链都压在了一起：

1. 它是当前现役 live 入口，不是纸面岗位。
2. 它已经被纳入统一的 `role / employee workspace` 模型。
3. 它同时覆盖 source truth、support payload、live binding、wiki、audit、workbench 和 runtime-state。
4. 它最能体现“复用现有 live 入口，而不是另发第二套入口”的迁移策略。

所以，把总助讲懂了，基本就把 TriCompany 当前的员工发布模型讲懂了。

## 2. 第一步：看源侧五件套是怎么被定义的

`TriCompany/runtime/cognition/employee_source_kit.py` 把员工源侧定义固定为五件套：

```python
SOURCE_KIT_SUFFIXES = ("agent", "soul", "memory", "colleagues", "social")
```

它同时规定了两类不能写回源码的内容：

1. **消费痕迹**，例如阶段记忆记录、社交事项记录、最近整理时间。
2. **宿主绑定事实**，例如当前 live 入口路径、support payload 路径、`.tricompany-cognition` 路径。

这说明总助源侧五件套的作用，不是保存“最近做了什么”，而是定义：

- 这个岗位是谁；
- 这个岗位如何说话；
- 这个岗位的记忆层边界在哪里；
- 这个岗位如何理解协作与社交关系；
- 哪些内容必须留到 runtime / employee workspace。

如果你未来要新招一个固定员工，第一步不是写 live agent，而是先把这五件套补齐并过 validator。

## 3. 第二步：看知识空间是怎么抽象的

`TriCompany/runtime/cognition/knowledge_workspace.py` 给总助分配的不是一个单目录，而是四个命名空间：

```python
WorkspaceKind = Literal["role", "employee", "org", "audit"]
```

对应到总助，就是：

- `knowledge/roles/ceo-chief-of-staff/`
- `knowledge/employees/ceo-chief-of-staff/`
- `knowledge/org/shared/`
- `knowledge/audit/`

这四类空间的意义是：

- `role`：总助岗位的可继承知识，不随某一任总助实例消失。
- `employee`：当前这位总助实例的 inbox、wiki、workbench、audit 等工作连续性。
- `org/shared`：跨岗位共享的组织知识。
- `audit`：全局审计和交叉证据。

这就是为什么当前 support payload 里不仅有 `employees/ceo-chief-of-staff`，也有 `roles/ceo-chief-of-staff`、`org/shared` 和 `audit`。

## 4. 第三步：看 host object 是怎么声明的

真正把总助纳入统一发布链的关键，不是 live agent 文案，而是 `TriCompany/runtime/cognition/host_object_generation.py` 里的 `CEO_CHIEF_OF_STAFF_HOST_OBJECT_SET`。

从这个定义可以读出几个非常关键的事实：

```python
object_set_id = "ceo-chief-of-staff-knowledge-workspace-v0.1"
live_entry_status = "live-entry-existing-not-changed"
host_stage = "current-copilot-host-live"
live_entry_ref = "TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md"
```

这四行几乎就是整条迁移策略的摘要：

1. 总助对象集已经被显式命名和版本化。
2. 当前 live 入口是“沿用已有入口，不改身份”。
3. 当前宿主阶段是 `current-copilot-host-live`（Copilot-host 本地手动版），不是 TriMC 服务器正式版。
4. 现役 live 入口就在 `TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md`。

同一个定义里还有一条很关键的说明：旧 `knowledge/chief-of-staff` 兼容路径已经退役，当前 support payload 只落在新的 role / employee workspace 结构下。这意味着总助已经从历史兼容路径转入统一员工对象体系。

## 5. 第四步：看 binding profile 在机器层面说了什么

总助的 `binding profile` 文件是 `TriCompany/.github/binding-profiles/ceo-chief-of-staff.json`。它把“源侧规则如何绑定到当前宿主”说得非常具体。

最值得 training 里点名的字段有：

```json
{
  "bindingProfileId": "ceo-chief-of-staff-host-binding-v0.1",
  "objectSetId": "ceo-chief-of-staff-knowledge-workspace-v0.1",
  "status": "generated-staging",
  "hostStage": "current-copilot-host-live",
  "liveEntry": {
    "status": "live-entry-existing-not-changed",
    "path": "TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md",
    "identityRule": "reuse-existing-live-entry"
  }
}
```

对新同学来说，这几个字段比大段解释更重要，因为它们直接回答了四个问题：

1. 当前绑定是哪一版。
2. 绑定的是哪一组 support object。
3. 当前处在什么宿主阶段。
4. live 入口是复用旧入口还是新建入口。

它后面还列出了 `supportObjects` 和 `runtimeNamespaces`。这也非常关键，因为它明确区分了：

- 哪些目录是被跟踪的 support payload；
- 哪些命名空间属于 `TRICOMPANY_COGNITION_HOME` 或 `.tricompany-cognition` 下的 runtime-state。

## 6. 第五步：看 support payload 真正长什么样

当前仓库里能直接看到的总助 support payload，主要集中在：

- `TriCompany-copilot-host-assets/host-object-manifest.json`
- `TriCompany-copilot-host-assets/knowledge/roles/ceo-chief-of-staff/**`
- `TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/**`
- `TriCompany-copilot-host-assets/knowledge/org/shared/**`
- `TriCompany-copilot-host-assets/knowledge/audit/**`

其中 `host-object-manifest.json` 再次确认了一件事：总助的 support object 现在只包括四类 workspace，没有再把 legacy `knowledge/chief-of-staff/**` 当成当前活路径。

而 `knowledge/employees/ceo-chief-of-staff/**` 下，你可以直接看到四类对象：

1. `inbox/`：原始资料入口。
2. `wiki/`：整理后的页面与 page spec。
3. `audit/`：整理、审批、schedule、提醒和 delivery 证据。
4. `workbench/`：前台工作台 HTML 与 JSON 快照。

这就是所谓“员工不只是一个 prompt”的最好证据：一个员工实例已经有自己的工作空间、知识页面、审计记录和工作台。

## 7. 第六步：总助的 LLM wiki 到底是 raw / wiki / schema 哪三层

这部分最容易被误解。当前真实落地的对象载荷，主要是两层：

1. `raw`，也就是 `inbox/` 里的原始资料；
2. `wiki`，也就是整理后的页面对象。

所谓 `schema`，当前并不是一个独立的第三层对象目录，而是以“规则 / 规格”的形式存在，代表 raw 如何被编译成 wiki。对总助来说，这层主要落在：

- `TriCompany/docs/workflow/chief-of-staff-llm-wiki-object-spec.md`
- `TriCompany-copilot-host-assets/knowledge/employees/ceo-chief-of-staff/wiki/page-specs.json`

`chief-of-staff-llm-wiki-object-spec.md` 规定了：

- inbox 允许的对象类型；
- wiki 页面需要哪些 frontmatter；
- audit 记录结构；
- page promotion 的门槛；
- 哪些东西当前不做。

而 `page-specs.json` 则把页面级编译目标写成 machine-readable 规格，例如：

```json
{
  "specId": "chief-of-staff-current-state",
  "pageId": "chief-of-staff-llm-wiki-current-state",
  "reviewerRoles": ["ChiefOperatingOfficer", "CEOChiefOfStaff"],
  "approvalSlaHours": 48
}
```

这就说明：

- 总助 LLM wiki 不是随手整理笔记；
- 它已经有 page 级别的编译规格、reviewer 角色和审批 SLA；
- 但这套 schema/spec 目前只在总助链上落得最完整，不能夸大成“所有员工都已具备同等 wiki 编译体系”。

## 8. 第七步：runtime-state 放在哪里，为什么不进 git

总助 binding profile 与治理文档都明确写了：runtime-state 属于 `TRICOMPANY_COGNITION_HOME` 或 repo-local `.tricompany-cognition`。

这意味着两件事：

1. 总助运行中产生的私有认知状态，不需要在 support bundle 预创建。
2. `.tricompany-cognition/**` 是运行态数据目录，应按 runtime-state 规则管理，而不是把它当成源码真源或长期受控 published-copy。

这条边界很重要，因为一旦把 runtime-state 和 source truth 混在一起，后续所有“哪些是岗位稳定知识、哪些是当前宿主消费记录、哪些是临时运行痕迹”的判断都会崩掉。

## 9. 第八步：现役 live 入口的角色是什么

当前仓库里的总助 live 文件是 `TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md`。它的职责不是承载全部真源，而是作为当前宿主真正生效的 discoverable 入口。

这份文件目前仍明确写着：

- 当前是 `Copilot-host` live 阶段；
- 总助继续承担当前宿主资产、会议、registry 与收口协调；
- 四层认知契约已经回到 `TriCompany/.github/source-agents/ceo-chief-of-staff/`；
- 当前 binding 事实由 binding profile 与 host-object-manifest 承载。

这正是 training 里必须讲给新人的边界：**live entry 负责入口，source 五件套负责长期定义，binding/manifest 负责当前宿主绑定，employee workspace 和 runtime-state 负责运行连续性。**

## 10. 第九步：总助案例最该学到什么

把整个案例压缩成一句话，就是：

**总助不是“又写了一个 agent 文件”，而是“用源侧五件套定义岗位，用 object generation 生成 support payload，用 binding profile 复用现役 live 入口，再用 wiki / audit / workbench / runtime-state 承接运行连续性”的完整样板。**

如果以后要让另一个岗位进入统一员工体系，最应该复用的不是总助的语气，而是总助的链路方法：

1. 先建源侧五件套。
2. 再过 validator。
3. 再抽 role / employee / org / audit workspace。
4. 再生成 host objects。
5. 再导出 binding profile。
6. 再判断是否复用或新增 live entry。
7. 最后把流程、治理和 training 一起补齐。

## 11. 当前态与目标态提醒

### 当前态

- 总助已经是现役 live 入口。
- 总助已经接到统一 employee workspace 体系里。
- 总助有 raw / wiki / audit / workbench 对象载荷。
- schema/spec 已有明确样板，但主要集中在总助链。

### 目标态

- 更多岗位拥有同等级的 schema/spec、审计和工作台链路。
- 宿主切换不再主要依赖当前 Copilot-host。
- handoff、approval、validation 和 recall 有更成熟的自动化。
- 组织级共享知识与跨岗协同更强，不再过度依赖总助单点。

## 12. 本章小结

总助样板之所以重要，不是因为它是最高层岗位，而是因为它把 TriCompany 当前最成熟的一条员工工程链完整展示了出来：source truth、binding、support payload、live 入口、wiki/spec、workbench、audit 和 runtime-state 全都能在这个样板里找到。对研发同学，这是一份可落地的实现图；对产品和治理同学，这是一份可追踪的组织运行图。理解了这条链，TriCompany 的“AI 治理公司”才不再只是口号，而变成一套可被复制、可被检查、可被升级的工程结构。
