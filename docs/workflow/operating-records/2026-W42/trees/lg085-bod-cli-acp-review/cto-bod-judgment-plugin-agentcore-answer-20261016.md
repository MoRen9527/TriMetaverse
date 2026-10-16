# CTO 作答卷 · LG-085② 关联追问三问（判断力插件本体/agent-core 承载/成本对比）· 2026-10-16

- sourceOfTruth: 本卷（trees/lg085-bod-cli-acp-review/cto-bod-judgment-plugin-agentcore-answer-20261016.md）
- syncMode: static（权威作答卷·经 COS 呈 CEO·CEO 在场窗候卷即转）
- lastSyncedAt: 2026-10-16T21:27:35+08:00（date 现查·写前跑）
- 令源: CEO 21:19:38「BOD 会话只是判断力插件---这个插件使我们自己研发的，还是claude code？如果是自己研发的，我觉得没有必要做唤醒，我们过去在R域的agent-core就是很好的可用材料吧」

## 〇·三问一句话总答

- **a 本体定性**：插件本体=**claude code，非自研**——CEO 读数正确。现方案（细化案 16c4f9700）=BOD CLI 经官方 claude-code-acp adapter 驱动现役 Claude Code，自研的只是宿主壳（CLI）与 ACP 接线，会话引擎本体是 Claude Code。
- **b agent-core 承载可行性**：**成立，且 CEO 记忆属实**——实锚 `@tricompany/agent-core` 0.1.0（4664 行 TS）=TriMC agent-loop 血统的自研框架，loop/权限引擎/调度器/子代理/模型层全在，**TriRLC 现役消费中**。缺口集中在工具生态与技能体系（§二对表）。
- **c 成本/风险对比**：**成本面 agent-core 常驻形态长期占优；风险面 claude code 路成熟度占优**。「免唤醒」的正确工程形态=进程常驻+按需推理（idle 零 API 成本），非会话 24h 挂——此形态下 CEO 的免唤醒直觉成立（§三）。

## 一·问 a：判断力插件本体定性——claude code 非自研

| 件 | 本体 | 证据 |
| --- | --- | --- |
| BOD CLI（宿主壳） | **自研**（LG-085 P0-P3 交付物） | 评审卷 f79525bb3 |
| ACP 接线 | 自研 client 端+官方 adapter | 细化案 16c4f9700（claude-code-acp·Zed 官方） |
| **会话引擎（判断力本体）** | **Claude Code 现役本体** | 细化案原话「会话引擎还是 Claude Code 本体（成熟度现役已证），解出的只是宿主壳」 |

CEO 前半句读数正确；后半句「如果是自己研发的，就没有必要做唤醒」的前提**现方案不成立**——本体既非自研，触发式唤醒（P3 勘验窗形）正是现方案的既定形态。**但 CEO 的追问点出了一个真问题：若自研引擎可用，唤醒冷启成本可消——见问 b/c。**

## 二·问 b：agent-core 承载可行性四面对照

**先自我勘正**：方案稿 v3 §五-1「agent-core（claude 2.1.88 移植版）」表述**与源码实锚不符，本卷勘正**——实锚（10-16 现探 TriCompany/packages/agent-core）：

- loop.ts 头注原文：「**Mirror of TriMC's agent-loop/loop.ts, extracted to agent-core for reuse by TriLC**」——**TriMC agent-loop 镜像抽取件**（供 TriLC 复用），非 claude code 移植；
- 依赖面：croner+**trimodel（file: 直连 TriModel 统一配置层）**+yaml+zod——**无 claude code/agent-sdk 依赖**，模型后端 `createModelClient` from trimodel（本司化）；
- 现役消费：TriRLC package.json `"@tricompany/agent-core": "file:../TriCompany/packages/agent-core"`——**R 面本地域 daemon 现役底座**（「R 域的 agent-core」血统对上）。

四面对照：

| 能力面 | claude code（现役 2.1.296） | agent-core（实锚） | 缺口 |
| --- | --- | --- | --- |
| 工具链 | 内建数十工具+MCP+插件生态 | tools.ts 自研面（118 行 getToolDefinitions/executeTool）+sub-agent spawn（188 行） | **大**（通用场景）/**可控**（判断力场景——见下） |
| 权限框架 | permission modes+hooks+ACP request_permission | PermissionEngine（Mode/Rule）+AgentTier 工具配额+safety-check（197 行） | **小**——骨架在，规则面补齐即可 |
| 技能体系 | skills 生态成熟 | 无（sub-agent built-in 仅 47 行骨架） | **大**——BOD 侧技能（联审/台账/周报）需自建 |
| 上下文管理 | auto-compact+prompt cache+session resume | context-builder/prompt-cache 走 deps 注入（未提供则优雅降级）+trimodel UsageAccumulator | **中**——压缩策略需自建，cache/计量底座在 |

**缺口几何的关键限定**：两「大」缺口是**通用编码场景**的口径；BOD 判断力环节的工具需求可枚举——读 registry/落卷/发信（daemon API）/git/树协议，约 **6-8 件工具**即可覆盖例行判断工作——判断力场景下工具缺口实际可控。技能体系同理：BOD 例行动作是结构化的（审批/转报/拟稿），非开放式编码。

**结论：可承载=成立**（4664 行骨架+R 面现役跑着），工程量集中在①判断力工具集 6-8 件实现②BOD compass 载入③长跑验证——**周-双周级**，非月级。

## 三·问 c：成本/风险对比

**关键澄清（免唤醒的正确打开）**：「免唤醒」≠会话 24h 挂（那会持续烧 API+长跑质量衰减）。正确形态=**daemon 进程常驻（零 API 成本）+按需推理（有事才调模型）**——agent-core 包内 scheduler（cron-engine/job-executor/backoff/heartbeat-policy/stagger）+process-supervisor 全套 daemon 底座现成，正为此形设计。

| 维度 | claude code 触发式（现方案） | agent-core 进程常驻+按需推理 |
| --- | --- | --- |
| 冷启成本 | 每次唤醒 ~0.1M（compass 重建+上下文重注入·cache write 大头） | 近零——进程活·上下文热持·cache read 为主 |
| idle 成本 | 零 | 零 API·仅进程内存（daemon 百 MB 级） |
| 响应时延 | 冷启秒-十秒级 | 即时（进程内） |
| 长期成本线 | 唤醒频次×0.1M 线性增长 | 一次性改造后边际趋零 |
| 模型后端 | anthropic（claude code 绑定） | **trimodel（TriModel 统一层·模型可换）——与 LG-087 模型层本司化同向，战略契合** |

| 风险 | claude code 路 | agent-core 路 |
| --- | --- | --- |
| 成熟度 | 现役已证（13 席在跑） | **长跑未证**（评审卷风险 6 原话·P3 门禁正是为此设） |
| 维护主体 | 官方跟版（adapter 跟进） | 自研自维——但本例上游=TriMC 自家代码，演进自主可控 |
| 能力上限 | 随 claude code 版本演进红利 | 受自研工具/技能生态天花板约束 |
| 判断力质量基线 | 现役 BOD 会话同引擎（质量连续） | 新引擎新基线（需对平验证） |

## 四·架构裁决建议（证据如实·不作倾向迁就）

CEO 倾向（自研材料优先·免唤醒）**工程上成立且有实锚支撑**——agent-core 确是好材料（TriMC agent-loop 血统+trimodel 直连+daemon 底座全套+R 面现役）。建议**分阶段双案，不二选一**：

1. **P0-P2 不变**（claude code 触发式先跑）：零改造验证 BOD 判断力插件的真实需求面（唤醒频次/工具用量/上下文形态）——这些读数恰是 agent-core 路的设计输入，先跑不白跑。
2. **P3 双案勘验裁**：A 案=agent-core 承载（判断力工具集 6-8 件+trimodel 卡 BOD 模型+最小链验证）；B 案=claude-code-acp adapter（现方案）——勘验窗双链各跑，**读数对比裁**（成熟度/成本/时延实测）。agent-core 路提前做的不该是切换，是把上面三件工程量排进勘验窗。
3. **战略面加分**：agent-core 路把 BOD 会话模型后端纳入 TriModel 统一层——与 dsh 化（LG-087）同一方向（模型层本司化），长期供应商风险更优、成本曲线自控。
4. **风险不掩盖**：agent-core 长跑成熟度未证——评审卷风险 6 门禁原样有效（「不达标停在 P2——P2 已满足 90% 诉求」），B 案作保底不撤。

**一句话**：CEO 方向判断对——agent-core 是现成好材料、免唤醒形态工程成立；但先让 claude code 快跑拿需求读数（P0-P2），P3 双案实测对比后裁——不因倾向提前押注，也不因保守错失长期成本优化。

## 使用依据

- agent-core 源码实锚（10-16 现探 TriCompany/packages/agent-core）：loop.ts 头注（TriMC agent-loop 镜像抽取）·4664 行规模·trimodel 直连·PermissionEngine/Tier 配额/safety-check·scheduler 全套·process-supervisor·sub-agent；
- TriRLC package.json 消费实锚（`@tricompany/agent-core` file: 依赖·R 面现役底座）；
- 细化案 16c4f9700（claude-code-acp adapter·会话引擎=claude code 本体）·评审卷 f79525bb3（P0-P3 路径+风险 6 门禁）·方案稿 v4 886c5a809 §五-1（「claude 2.1.88 移植版」表述本卷勘正）。

—— CTO 小狄（落款 date 现查原值 2026-10-16 21:27:35 +0800·发毕对表）
