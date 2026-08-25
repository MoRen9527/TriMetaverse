# CTO（小狄）战役常驻状态文件（audit-campaign-001）

- 生命周期契约：战役级常驻（随计划生灭）——评审/签收动作由 fresh 实例承担，本文件=跨节点记忆载体；任何节点**先读本文件再行动，行动后追加落款**。
- 初始化：[2026-08-25T06:14+08:00] [tick1] 编排实例建骨架。
- 技术风险种子（tick1 审计直出，P0 级）：①TriMC 未认证 RCE——HTTP 面零鉴权+listen 全卡+cron 任意 bash（app.ts:655、command-handler.ts:83-88）；②TriModel Authorization 头硬编码 `'******'` 必 401 且静默 fallback 改道（openai.ts:56,145、trimetaverse.ts:265）。修复走后续树，本战役只登记不修码。
- 待办（下一 fresh CTO 实例）：读 reports/TriMC.md 与 TriModel.md 及其余三份，输出 P0/P1 处置优先序建议追加到本文件。

## 签收落款

- 时间戳：[2026-08-25T09:15+08:00] [tick2] [AC-CTO-SIGN]
- 签收范围：六份报告已读毕（TriMC、TriModel 全文精读；TriLC、TriCode、TriMetaverse、TriPilot 通读）。TriPilot 为环境受限事实记录，无 P0/P1 发现，不计入下表。全量口径：P0×2、P1×21，与 tick1 收口日志一致。
- 排序逻辑：可利用性 × 影响面 × 修复成本；本战役只登记与排序，不修码，修复一律走后续树立项。

### P0/P1 处置优先序表

| 编号 | 来源报告 | 建议次序 | 理由一句 |
| --- | --- | --- | --- |
| P0-1 | TriMC | 1 | 远程无凭据未认证 RCE（零鉴权+listen 全卡+cron 任意 bash+runAs 可至 root），可利用性与影响面全场最高而修复成本低。 |
| P0-1 | TriModel | 2 | `'******'` 硬编码使 OpenAI 全通道与 TriMetaverse 流式必现 401 且静默 fallback 改道，100% 触发、修复成本全场最低（三处一行+头断言测试）。 |
| P1-2 | TriMetaverse | 3 | 公网 IP 硬编码默认值使任一次未设 env 的跑批直接对线上 TriMC 写探针状态并暴露基础设施地址，近零成本可除。 |
| P1-1 | TriMetaverse | 4 | e2e 跑批失败仍 exit 0，一切自动化门禁结果不可信，是其余各项修复验证可信度的前提，且与前条同文件族顺手修。 |
| P1-1 | TriModel | 5 | 单共享令牌一次取走全部上游明文密钥、无吊销无轮换，泄露即全线失守，需凭证模型重构故列第二梯队之首。 |
| P1-3 | TriModel | 6 | 默认凭据回退 `tmv-sk-dev-default`，缺 env 应 fail-fast，去除成本近零。 |
| P1-4 | TriModel | 7 | 任意错误均静默跨 provider 改道，与 P0-1 叠加掩盖根因并致数据出域边界漂移，需错误分类+策略开关。 |
| P1-2 | TriModel | 8 | expires_at 固定 24h 与 15 分钟轮换语义脱节，客户端批量持陈旧密钥，随凭证模型同树修正 TTL。 |
| P1-6 | TriModel | 9 | `/health` 无鉴权实发计费调用，成本放大器+慢端点 DoS，改本地探测+加鉴权成本低。 |
| P1-3 | TriMetaverse | 10 | 双宿主 tools 映射漂移致 Claude 宿主全员工具面低于设计（含本岗位），重跑 sync+清 4 个 PascalCase 重复条目即收敛。 |
| P1-1 | TriLC | 11 | cron job 崩溃后永久卡 running 静默停摆且无告警，启动恢复扫描成本低收益高（TriLC 报告同判）。 |
| P1-2 | TriMC | 12 | acceptEdits CWD 边界教科书式穿越使权限引擎形同虚设，P0 收口后属内部防线，path.resolve 归一化+缺省 cwd 拒绝放行。 |
| P1-3 | TriMC | 13 | 会话 spawn CLI 参数注入，name 加 `^[a-zA-Z0-9_-]+$` 校验一行即得，作 P0 之后纵深防御。 |
| P1-2 | TriLC | 14 | SSE 断连不中止 agent loop 致 token 持续燃烧+僵尸流，需 res close 监听→AbortSignal 传播。 |
| P1-4 | TriLC | 15 | cron 假超时不取消底层 LLM 循环+setTimeout 泄漏，与上条共享取消机制一并做。 |
| P1-3 | TriLC | 16 | reaper 漏 error/孤儿 active 态致 sessions 表无界增长，SWEEP_SQL 补状态成本低。 |
| P1-1 | TriMC | 17 | 手动 runJob 并发重入竞态可致部署/git 写类作业双跑，进程内互斥+store 原子写。 |
| P1-1 | TriCode | 18 | Windows `.cmd` shim 无法 spawn 使 Tier-1 在主分发平台大概率恒 unavailable，Wave 2 前必修但不阻塞当下 Linux 域开发。 |
| P1-2 | TriCode | 19 | `mode:'plan'` 被静默忽略违背调用方只读安全预期，adapter 接口演进时透传 flag 或显式报不支持。 |
| P1-4 | TriCode | 20 | task 文本以 `-` 开头即成 CLI flag 注入，argv 插 `--` 终止符一行可解，随 adapter 树。 |
| P1-3 | TriCode | 21 | 超时仅杀直接子进程留孙进程孤儿，需进程组/detached 终止策略，随 adapter 树。 |
| P1-4 | TriMC | 22 | bypass-immune 安全检查恒 false 属文档-实现脱节，随权限引擎 v2 一并裁决（真实现闸门或下调文档承诺）。 |
| P1-5 | TriModel | 23 | key-encryptor 低熵 KDF+固定盐现为无引用死代码、暂无实际暴露面，登记为 Phase 2 启用前强制 gate（接外部 KMS/口令重设计）。 |

### 合并树分组建议

- 树 A「TriMC 权限引擎与编排安全收口」：TriMC P1-2 / P1-3 / P1-4 同属 permissions-engine 与 session-bridge 安全语义，一并裁决。
- 树 B「cron 执行域可靠性（TriLC+TriMC 跨仓）」：TriLC P1-1 / P1-2 / P1-3 / P1-4（"异常路径无人负责"同根因，共享 AbortSignal 取消基建）+ TriMC P1-1（同为 cron job-store read-modify-write 问题域）。
- 树 C「TriModel 密钥分发与路由策略收口」：TriModel P1-1 / P1-2 / P1-3 / P1-4 / P1-6（per-client 凭证模型、TTL 语义、默认回退、fallback 分类、health 面联调）；P1-5 不入树，单挂启用前 gate。
- 树 D「TriCode adapter 加固（Wave 2 前置）」：TriCode P1-1 / P1-2 / P1-3 / P1-4 同为 adapter 实现深度不足，一树打包。
- 树 E「TriMetaverse 自动化可信度」：TriMetaverse P1-1 / P1-2 建议作为近零成本 hotfix 先行（退出码+删默认目标），P1-3 随树重跑 sync-agents-to-claude 并清理 `.github` 侧 4 个 PascalCase 重复条目。
- 备注：次序 1–4 构成"立即止血包"（两个 P0 + e2e 可信度两连）；各树动工须按战役契约另行立项排程，本战役不改码。

- 落款签收：fresh CTO 小狄。使用依据 = 本文件 tick1 风险种子 + `docs/execution/2026-08-24/audit-campaign/reports/` 下六份实审报告（TriMC.md、TriModel.md、TriLC.md、TriCode.md、TriMetaverse.md、TriPilot.md）。本次仅追加编辑本文件，未触碰其他归属域产出物，无 git 操作。
