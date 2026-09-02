# LG-026 §8.7 M 面组长 CC 会话解锁附则 — CHO 验收件

- sourceOfTruth: 本件=CHO 域验收记录（附则立法验收，非岗位到岗验收）；真源=docs/execution/trimlc-channel-daemon-spec.md §8.7 + LG-026 重审报告 + TriCompany/docs/workflow/engineering-disciplines.md D-13
- syncMode: static
- lastSyncedAt: 2026-09-02T14:48:58Z（22:48 北京）
- 验收人: CHO（独立会话）；件源=CTO 起草 ebb2f8b9（spec +14 行/routes 勘误 +3-1），BOD 五裁点③授权 2026-09-02

## 一、判定

**accepted（附保留意见三条，均不阻塞、均候 P5 实施批）**——§8.7 附则立法验收通过，spec 标题已同步签注。

## 二、四口径核验（COS 提请口径逐项）

| # | 口径 | 核验结果 | 判定 |
| --- | --- | --- | --- |
| ① | §8.6 同构对照 | 结构逐节同构：解锁对象立法写准（第二次注册制解锁，白名单单席位）→治理三件套迁移版（--allowedTools 信件 API 面/cwd 钉 DATA_DIR/凭证边界持模型凭据不持 repo·git·TriMC——如实增量）→会话形态延续（事件驱动唤醒仅换 handler 目标 runHeartbeatAgent→spawnCCLead，办完即眠，状态落 DB 不吃对话上下文）→501 闸不动口径重述（「进程监督的 CC 会话管理器」非 agent 宿主服务面，与 §8.2/LG-020 封面对边界一致） | ✓ |
| ② | 重审报告形态结论一致性 | 逐句对应：BL 拉起 ProcessSupervisor+-p 输出 JSON→台账回写（报告问 2）；双通道分工=信箱 API 任务队列+审计轨迹／CC 原生跨会话实时对话+「账走信箱」（跨会话不留审计之理据 §8.7 新增，方向一致）；R 面 in-process 形态冻结不再演进候 BOD 另裁（报告问 3 ~15%）；风险三面照录（报告风险如实）；routes 勘误 3 行实读=路线 a TriCode 撤回+中期终局二次解锁+被 c 自然替代+b 排除不变——与公理①逐字同向 | ✓ |
| ③ | §8.5.1 前置闸继承 | 继承明示（§8.6 前置闸=双 daemon ONSTART 自启验收闭环照延）+新增 CC headless 可用性预检（二进制/凭据在位）为 spawn 面前置；未声称闸开，§8.5.1「验收进行中勿销账」不被违背 | ✓ |
| ④ | 账走信箱 × D-04/命名宪法相容性 | D-04 状态条五字段合同=会话上报平面，信箱=任务队列+审计平面，两平面无交叉无冲突；**BL 席位 D-13 已注册**（2026-09-02 BOD 全包采纳：BL=Business Lead 业务组长，挂 COS 麾下；格式冻结 BL-\<项目代号\>；首任惯例正名 BL 无后缀〔CAO 裁〕）；报告 spawn 样例 `-n BL` 与 D-13 注册名一致；升级链 组长→COS→BOD 与分权制修订（e8d06718 全席归 COS 管）及职责分界条（5c7ada81）相容 | ✓ |

## 三、保留意见（三条，不阻塞，候 P5 spawn 面实施批）

1. **岗位本体≠会话解锁**：§8.7 系会话机制解锁附则；BL 岗位实际到岗仍须走 CHO 侧 handoff 流程（D-13 增设注记已明文预告「实际岗位启用（合同/五件套/binding）时走 CHO 侧 handoff 流程」）。组长合同源（BL 自有 session-body 正身+JD+源侧五件套+binding profile）须于实施批前落齐并过 CHO 验收——重审报告「LG-023 正签会话变体合同直接复用」语义含混（复用机制 vs 复用文件），实施批须定谳 BL 自有 session-body（COS 自驱动恢复合同不宜直接充当组长合同）。
2. **生效时点**：附则 accepted=立法验收过；live 解锁生效=P5 实施批+前置闸（§8.6 继承闸+CC headless 预检）开——两闸不开不上 live，本验收不构成解锁生效凭证。
3. **工具白名单参数化**：「无 shell 泛权」在附则层面立法句已足；实施批须落为具体 `--allowedTools` 参数表（显式排除清单），并纳入 P5 验收读数。

## 四、使用依据

- spec §8.4-§8.7 全文实读（docs/execution/trimlc-channel-daemon-spec.md 90-113 行）
- LG-026 重审报告（lg026-re-review-report.md，55e0e22e）+ CTO 席意见件（3e5a14e0）
- ebb2f8b9 实 diff（spec +14/routes 勘误 +3-1）
- D-13 通信名址规程 BL 席位条+增设注记（TriCompany engineering-disciplines.md，977bc71 后增补）
- 分权制修订 e8d06718/5c7ada81（升级链相容性）
- 先例对照：§8.6 组长岗位解锁附则（LG-026 P0 首件）+ §8.5.1 SYSTEM 悬案（勿销账在案）
