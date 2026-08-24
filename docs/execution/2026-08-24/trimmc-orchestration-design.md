# TriMMC 7×24 编排运行态设计方案（orchestration layer）

## 文档元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/trimmc-orchestration-design.md
- syncMode: source-only
- lastSyncedAt: 2026-08-25
- 版本: v0.2-draft（v0.1 + 小狄技术面/小乔产品面双审合流；两份评审文件为本案规范性附录）
- 附录: trimmc-orchestration-design-review-cto.md（B1-B4 阻断处置+Q-A/Q-B 裁定+M0 清单）/ trimmc-orchestration-design-review-cpo.md（P1-P4+V1-V8 指标+R 面移植判据）
- 关联: `mmc-host-driver-design-draft.md`（壳基础设计，本文是其运行态扩展）；quad-migration-spec v1.0 §八（分身生命周期）

## 一、CEO 指令解析（2026-08-25，四场景一机制）

1. **任务执行流**：本地 TriMLC 侧把 CEO 批准的计划写入 `TriMetaverse/docs/execution/` → push srv/git → fleet 同步 → daemon 新拉起 CC 会话（默认 agent=编排）→ 编排以 session 形式启动 AI 员工 → 会话间自由通话完成任务。
2. **cron 工作循环**：定时给编排发"检查当前工作面是否有待办"→ 有则按优先级找 docs/execution 下文档 → 拆树自动执行 → 无待办发邮件通知 CEO。
3. **观测流**：trirlc chat / tripilot 连 trimmc daemon，选读任意会话了解 sg-server 干活情况。
4. **升级流**：仅三类（重大不可逆 / CEO 保留权 / 系统硬约束）通知 CEO——会话连接中走 trirlc/tripilot 推送，未连接走邮件。
5. **周迁移 FADE 收口**：周工作平面平移的裁决/carry-over 应整体在 TriMMC 侧完成（agents 都在），不出现"不在线拖到周一"；每个环节严格走 FADE。
6. 成熟后总结方案向 R 面（TriRMC/TriRLC）移植。

## 二、现状实盘（2026-08-24 ssh 侦察实证）

| 组件 | 状态 |
| --- | --- |
| claude code | ✅ 2.1.227 @ `/opt/claude-code/claude`（sg-server） |
| 员工渲染位 | ✅ 18 agents @ `/srv/fleet/TriMetaverse/.claude/agents/`（FADE 产物随 git 同步就位） |
| fleet 侧 CC 配置 | ✅ `/home/fleet/.claude` + `.claude.json` 在 |
| 壳复用面 | ✅ trimc command-handler：payload 四字段/runAs 降级/HOME 覆盖/detached SIGKILL/per-run 日志 |
| 通知通道 | ✅ notify canonical（QQ SMTP 已实证 sent）+ TriLC notifications push 端点 |
| 缺口 | ❌ session 编排层（本方案新增）；❌ 连接感知通知路由；❌ 会话读取 API；❌ fleet 侧 CC 账号额度/模型接入确认 |

## 三、架构：TriMMC session-orchestrator 新模块

```
trimc.service 进程内新模块 src/orchestrator/
├─ WorkPlaneWatcher   # cron tick（每 N 分钟）：读 W35 平面+week-plan 判定待办集
├─ OrchestratorManager# 每 tick fresh spawn 一个编排会话（headless CC，默认 agent=小贾）
│                     #   brief=待办清单指针+读盘三件+红线；禁 resume（spec §八 T1 直译）
├─ SessionRegistry    # 台账：sessionId/agent/treeId/spawnedAt/state/lastSeen（JSON 落 TRIMC_CONFIG_DIR）
├─ EmployeeSpawner    # 编排经约定通道请求 spawn 员工会话（taskRef 绑 treeId，§八一树一批）
└─ NotifyRouter       # 升级事件路由：trilc notifications push（探测连接态）→失败回落 SMTP 邮件
```

**编排会话协议**（每次 fresh，无累积）：
1. 读盘三件：W35 平面 JSON + week-plan.md + SessionRegistry 快照
2. 判定待办集（**准入三重门**，P1 阻断收口）：状态门（仅 active，frozen/pending-approval 一律不入队——防误执行 CARRY-004/006 类冻结裁决）＋可执行门（前置节点全部满足，时间门未到=不可执行非待重试——防 Q1-4 类反复空转）＋域路由门（仅服务器域授权清单内的任务接单——CARRY-001 本地研发环工作不得被服务器接单）；输出四态：可执行/等待中/域外/阻塞
3. 对每棵可执行树：拆节点 → 经 EmployeeSpawner 起员工会话（同 workspace，SendMessage 自由通话协作）→ 监听完成信号
4. 节点完成 → 校验落盘（先写后报三查）→ 更新 tree-op/week-plan → git commit+push（fleet 身份，operating-records+execution 域）
5. 通知一律**边沿触发**（P2 阻断收口）：待办集指纹 hash 变化才发；清零只在非零→零边沿发一次。六类词汇表：N1 开工/N2 清零/N3 受阻/E1 重大不可逆/E2 CEO 保留权/E3 系统硬约束（E 族走三类过滤路由）

**员工会话协议**：一次派工=一个 fresh headless 会话（spawn-only，禁 resume/续命）；跨节点接续=读盘三件；树 close 全员释放+SessionRegistry 销编（§八不变量）。

## 四、生命周期：双轨制（v0.2 定案，解 B4 自指缺陷）

CEO 提议 C-level 随树；小狄指出若编排会话也随树则"关树不变量检查者自己也是被释放实例"自指。定案**双轨**：

| 轨 | 对象 | 生命周期 | 连续性载体 |
| --- | --- | --- | --- |
| 树轨 | 员工会话（含被派的 C-level 执行实例） | 绑树生灭（§八不变量照用） | 读盘三件+tree-op clones 投影 |
| tick 轨 | 编排会话 | 每 tick fresh（无累积本就是原意） | SessionRegistry 台账跨 tick + 每 tick ≤30 行确定性交接摘要注入 brief + 周报聚合 |

小乔确认双轨+"不记得上次"三层载体足够；CHO 常设编制 standing batch 备案+邮件署名区隔防错位期待（详见 CPO 评审 §3）。Q-D 建议：本地域不同步此修订，维持不对称（报 CEO 确认）。

## 五、观测与通知 API 面（trimc 新端点）

- `GET /internal/v1/sessions` —— SessionRegistry 列表（谁在跑/哪棵树/多久了）
- `GET /internal/v1/sessions/:id/tail?n=` —— 会话输出尾读（trirlc chat/tripilot 选读任意会话的实现底座）
- `POST /internal/v1/sessions/:id/stop` —— 编排层权限才可调
- ⚠️ **鉴权前置（B2 阻断）**：8710 公网可达且现役 /internal/v1/* 零鉴权——stop/tail 端点上线前必须 loopback 双监听或 token 鉴权，否则等于向公网暴露"杀任意会话"
- 数据契约（P3 收口）：watcher 只读聚合三源（OP JSON+unresolved-items+tree-op）生成确定性快照，不新增周平面写方。勘误留痕：CPO 评审称 week-plan 全仓不存在系检索模式未匹配带日期前缀文件名，实际在 `2026-08-24-week-plan.md`；其三源冻结设计仍采纳

## 六、安全与升级边界

- 升级仅三类（重大不可逆/CEO 保留权/系统硬约束），其余编排层自裁（CEO 常驻授权）
- 员工会话 execute 权限按治理 registry 默认策略；生产写方向单主体纪律不变（服务器只写 operating-records/+execution 域，兼容面冻结清单继续有效）
- 编排死循环防护：单 tick 最大会话数上限、单树最大重试 3 次、全局并发会话 ≤K（K 待小狄按服务器规格定）

## 七、⚠️ 模型成本预算门（CEO 决策项，硬约束级）

7×24 LLM 会话 = 持续 API 成本。**启动 M2（cron 化）前必须定月度预算上限**：建议形式=月度 token/金额上限 + 超限自动降级为"仅影子试跑+人工触发"。价格事实须查权威参考后填数（禁凭记忆）。此项属 CEO 保留权，评审后单独呈批。

## 八、分阶段落地

| 阶段 | 内容 | 判据 |
| --- | --- | --- |
| M0 环境验证 | ✅ **PASS 2026-08-25**（5/5 判据；报告=trimmc-orchestration-m0-report.md；RSS 首样本 333MB；git 身份缺口当场修复；AGENT_TEAMS 实验旗标在册待 M1 实证） | 达成 |
| M1 单循环手动触发 | ✅ **PASS 2026-08-25**：m1-drill-001 三节点端到端（N1 首条 EXPER_ASSET 草稿落 staging 77 行/N2 alias 核对实质差异 0/N3 收口 commit c90922a3 已 push）；并行双实例派工+红线全守+SessionRegistry 台账落盘；发现 F1 树级 status 未翻转（brief 模板待补）/F2 本地未推 commit 致服务器引用暂缺（回流纪律实证）/F3 双向通话未测（M2 项） | 达成（判据=零人工干预 ✅）|
| M2 cron 化+通知路由 | 🔶 **已部署 2026-08-25**：orchestrate_tick.py（三重门/边沿触发/成本护栏 1000 元价格表权威取数/brief v2 含 F1 修正）装 trimc cron `13,43 * * * *`（job 09112290-34e3-48a4-8010-5bac0d385f62），首 tick ok 指纹落盘；邮件通道活，trilc push 因 Q-F NAT 缺陷挂 M3 pull-as-push。**判据「完整周末无人值守」待本周日自然验证** | 时间门 |
| M3 观测端点 | sessions list/tail 端点；tripilot/trirlc chat 接入 | CEO 可随时看服务器干活 |
| M4 周迁移 FADE 收口 | agent_close 裁决面由服务器小贾会话承接（与 quadmig-1 Q1-4 影子合流）；carry-over 不再等周一 | 一次真实迁移全程服务器侧闭环 |

## 九、开放问题

Q-A ✅ 已裁（小狄）：维持现役直连 env 模式（fleet settings.json ANTHROPIC_BASE_URL+AUTH_TOKEN 已实证跑通）；TriModel 3333 是配置面非推理面且未部署服务器；8008 残影不复活
Q-G ✅ 新增可选档（2026-08-25，CEO 指令）：OpenRouter 通道就绪——key 文件 /home/fleet/.trimetaverse/openrouter.key（0600 归一化 3 行：key/base/model），真实调用验证 HTTP 200（stealth/ox-alpha；注意 OpenRouter 全端点仅认 Authorization: Bearer 不认 x-api-key）。切换助手 use-openrouter.sh / use-deepseek.sh（自动备份可逆）。默认档仍 deepseek-flash（成本护栏价格表按 flash 结算——切默认前须同步 PRICES 表）；TriModel 侧 provider 登记随其服务器部署批次落（当前载体=fleet env+key 文件）。密钥卫生：本地中转已删、/tmp 粉碎、零回显、git 面 sk-or- 扫描仅历史审计文本命中
Q-B ✅ 已裁（小狄）：K_default=4（1 编排+≤3 员工），绝对上限 6（M1 实测 p95 RSS<400MB 方可上调）；systemd-run slice MemoryMax=5G+准入排队+会话级超时
Q-C ⏳ **CEO 决策项**：月度成本预算上限数值（超限自动降级"仅影子+人工触发"）——M2 上线前必须定
Q-D 建议稿（小乔）：本地域不同步随树修订，维持不对称——报 CEO 确认
Q-E 建议稿（小乔）：编排锚定渲染位 ceo-chief-of-staff，附署名区隔/CHO 备案/fallback 身份审计三条件——报 CEO 确认
Q-F 新发现（小狄）：NAT 方向缺陷——服务器无法主动 push 本地；推荐复用 heartbeat 响应 commands[] 字段做 pull-as-push
另：B1 处置=复用 TriMC 现役 src/orchestration/session-bridge.ts 三原语（spawnSession/listAgents/sendMessage）+/internal/v1/agents 端点，不另起第二编排词汇表；B3 处置=M1-M2 限定单向派工语义（M1 实证通道为 --fork-session 副本语义，CC 2.1.227 原生 teams 消息未实证前不做双向自由通话承诺）

## 十、评审记录

| 轮次 | 评审人 | 结论 |
| --- | --- | --- |
| 技术面 | 小狄 | APPROVE with conditions——4 阻断（B1 复用 session-bridge/B2 公网鉴权/B3 fork 语义限单向/B4 自指→双轨）全部 v0.2 落字；Q-A/Q-B 已裁；315 行评审文件为规范性附录 | 2026-08-25 |
| 产品面 | 小乔 | APPROVE with conditions——P1 准入三重门/P2 边沿触发/P3 数据契约三源（附勘误）/P4 MVP 不做介入能力；V1-V8 指标（北极星=无人值守自治率 M2≥80%）；R 面移植五正向三反向信号；235 行评审文件为规范性附录 | 2026-08-25 |
| 升版动作 | 编排层 | v0.1→v0.2 | 双审阻断与条件全部落字 | 2026-08-25 |
