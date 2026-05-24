# TriCompany Runtime Cognition

版本：V0.1
日期：2026-04-16
状态：原型骨架

## 1. 定位

本目录是 TriCompany 的元认知运行时原型层。

它不等于正式宿主，也不等于把 Hermes 原样搬过来；它的作用是把 Hermes 的核心 memory / metacognition 编排思路转成 TriCompany 自己可持续演进的结构。

## 2. 当前结构

- contracts/: provider 生命周期、命名空间和 recall 数据结构
- kernel/: 统一元认知内核骨架
- providers/: 内建 markdown、组织共享和外部适配 provider；其中 builtin_markdown 与 org_shared 已具备本地文件落盘能力，external_adapter 已支持注入式外部后端适配，external_http_backend 已补齐最小 HTTP 传输层，supermemory_backend 已按官方 schema 落地 vendor 适配，supermemory_sdk_backend 已补齐官方 SDK 形状的注入式 seam
- chief_of_staff_cognition.py: 小贾 runtime bootstrap；负责把 actor、builtin/org_shared provider 与 repo-backed durable asset bridge 一起装进同一个 kernel，repo-backed asset 解析优先回到 TriCompany source 五件套
- chief_of_staff_bridge_validation.py: 验证仓库内 `ceo-chief-of-staff.memory/soul/colleagues/social` 源侧契约已可通过 cognition bridge 进入 `prefetch_context`
- chief_of_staff_workflow_bridge.py: 开始会议 / 结束会议 / 日常收口三类 workflow 写回桥，同时提供 TriCompany source `ceo-chief-of-staff.memory.md` 与 `TRICOMPANY_COGNITION_HOME` 的 import/export/sync 命令入口
- chief_of_staff_workflow_validation.py: 验证 workflow 写回可同时落进 private/shared/audit 命名空间，并验证 repo 主档与 cognition 摘录的双向同步策略
- smoke_test.py: 最小可执行 smoke test，用于验证命名空间边界和 provider 生命周期
- contract_validation.py: Hermes 核心 recall/consolidate 契约验证，用于验证 fencing、单外部 provider 与 consolidate 命名空间约束
- integration_validation.py: provider-backed 集成验证，用于验证私域/共享/审计落盘与跨实例 recall
- backend_validation.py: production 风格后端验证，用于验证环境变量驱动的后端根目录、跨会话追加写入和审计元数据
- external_validation.py: 模拟外部后端兼容性验证，用于验证 ExternalCognitionAdapter 的命名空间过滤、与 builtins 并存和 recall 生命周期联动
- http_backend_validation.py: HTTP 外部后端验证，用于验证 Bearer 认证、JSON 协议、超时失败，以及与 builtins 并存时的远端 recall 生命周期联动
- supermemory_validation.py: Supermemory 官方 schema 验证，用于验证 `/v3/documents`、`/v4/search`、vendor-specific payload 映射、429 retry 与错误体解析
- supermemory_sdk_validation.py: Supermemory 官方 SDK seam 验证，用于验证 documents.add / search.documents 调用映射、命名空间到 containerTag 的 SDK 参数映射，以及不依赖真实包安装的注入式集成边界
- supermemory_live_validation.py: 显式 opt-in 的 Supermemory live smoke 入口；仅在设置环境变量后执行真实远端写入与召回，默认跳过

## 2.1 下一批最小新增模块

- contracts/skill_spec_contract.py: 把已批准 SkillSpec 读成运行时可消费对象
- contracts/schedule_spec_contract.py: 把通用 ScheduleSpec 读成运行时可消费对象；目标既可以是 skill，也可以是 reminder、email、checkpoint 等定时任务
- contracts/task_target_contract.py: 统一 skill/reminder/email/checkpoint/custom 五类任务目标的执行输入输出契约
- kernel/skill_registry.py: 维护已批准技能的最小索引与按 id/version 查找能力
- kernel/skill_matcher.py: 在任务进入前做轻量关键词/规则命中，并决定是否注入 SkillSpec
- kernel/schedule_registry.py: 维护已批准 ScheduleSpec 的加载、启停和下一次触发计算
- dispatch/task_resolver.py: 按 targetType 把 ScheduleSpec 解析到具体任务目标实现
- dispatch/host_dispatcher.py: 负责把执行请求发到当前 copilot 宿主，未来再平移到 TriMC
- dispatch/failure_policy.py: 统一 freeze、retry-then-freeze、escalate 三类失败策略
- runners/cron_runner.py: 负责 due-check、锁、并发策略、重试和失败冻结；它是通用定时任务执行器，不是 skill 专属 runner
- runners/audit_sink.py: 统一记录 run、delivery、freeze、escalate 的审计结果
- tasks/skill_task.py: 装载已批准技能并构建注入上下文
- tasks/reminder_task.py: 生成提醒类任务的执行负载
- tasks/email_task.py: 生成邮件类任务的执行负载与投递元数据
- tasks/checkpoint_task.py: 执行固定检查点、周期验证和回放类任务
- 详细落点见：`../../docs/engineering/cognition-runtime-module-plan.md`

## 3. 当前核心判断

- 全员共用一个统一元认知内核
- 每个员工保留自己的私域人格与记忆空间
- 公司层保留一个受审计的组织共享记忆空间

## 4. 与其他层的关系

- vendor/reference/：冻结 Hermes 参考副本
- runtime/cognition/：TriCompany 自有元认知原型
- .github/：当前阶段可回迁的宿主资产层

## 5. 当前可执行验证

- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.smoke_test
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.contract_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.integration_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.backend_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.chief_of_staff_bridge_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.chief_of_staff_workflow_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.external_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.http_backend_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.supermemory_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.supermemory_sdk_validation
- 运行命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.supermemory_live_validation
- workflow 写回命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.chief_of_staff_workflow_bridge meeting-start --json <payload.json>
- workflow 写回命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.chief_of_staff_workflow_bridge meeting-end --json <payload.json>
- workflow 写回命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.chief_of_staff_workflow_bridge daily-close --json <payload.json>
- workflow 写回命令：也可直接通过 stdin JSON 执行，例如 `@'{...}'@ | python -m runtime.cognition.chief_of_staff_workflow_bridge meeting-start --json-stdin`
- memory 同步命令：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.chief_of_staff_workflow_bridge sync-memory
- live 运行前提：可直接在 TriCompany-copilot-host-assets 根目录创建 .env 并填写 TRICOMPANY_ENABLE_SUPERMEMORY_LIVE_VALIDATION=1 与 SUPERMEMORY_API_KEY；脚本会在运行时自动加载该文件，且不会覆盖已存在的 shell 环境变量
- live 模板文件：可复制 TriCompany-copilot-host-assets/.env.example 为 TriCompany-copilot-host-assets/.env，再按需填写 SUPERMEMORY_BASE_URL、SUPERMEMORY_USE_BEARER_AUTH、SUPERMEMORY_TIMEOUT_SECONDS、SUPERMEMORY_LIVE_SEARCH_ATTEMPTS、SUPERMEMORY_LIVE_SEARCH_DELAY_SECONDS
- live timeout 建议：默认按 45 秒执行；若真实远端仍有明显长尾，可继续上调 SUPERMEMORY_TIMEOUT_SECONDS
- live 默认落档：docs/execution/hermes-copilot-host/phase-1/SUPERMEMORY-LIVE-VALIDATION.latest.json；如需自定义可设置 TRICOMPANY_SUPERMEMORY_LIVE_REPORT_PATH
- live 收口预览：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.supermemory_live_finalize
- live 收口回写：在 TriCompany-copilot-host-assets 根目录执行 python -m runtime.cognition.supermemory_live_finalize --apply
- 当前已通过的覆盖面：共享内核下的私域/共享命名空间边界、prefetch 查询命名空间、sync_turn 与 session_end 的 provider 生命周期闭环
- 当前已通过的 Hermes 核心契约：recalled context 的清洗与 fencing、单外部 provider 限制、session-end consolidate 的命名空间越界校验
- 当前已补上的 repo-backed durable memory bridge：TriCompany source 侧 `ceo-chief-of-staff.memory.md`、`soul.md`、`colleagues.md`、`social.md` 已可作为只读 provider 进入同一个 kernel，并与 builtin_markdown / org_shared 同时参与 recall；TriMetaverse live `.github/agents` 不再保留这些 companion 文件
- 当前已补上的 workflow 写回桥：开始会议 / 结束会议 / 日常收口可直接通过 `build_ceo_chief_of_staff_kernel()` 写入 private/shared/audit 三类命名空间，不再只是 prompt 口径
- 当前已补上的 prompt 自动入口：`.github/prompts/开始会议.prompt.md`、`结束会议.prompt.md`、`日常收口.prompt.md` 已要求在正式收口前通过 `#execute/runInTerminal` 调用 workflow bridge
- 当前已补上的宿主 hook：`.github/hooks/ceo-chief-of-staff-workflow-sync.json` 会在 workflow bridge 的 meeting-start / meeting-end / daily-close 命令完成后自动补一次 `sync-memory`
- 当前已补上的 memory 双向同步策略：TriCompany source `ceo-chief-of-staff.memory.md` 只保留层契约，运行连续性优先由 `TRICOMPANY_COGNITION_HOME` 与 support employee workspace 承载；如需同步摘录，不能回写到 TriMetaverse live `.github/agents` companion 文件
- 当前已通过的 provider-backed 集成：builtin_markdown 与 org_shared 可把私域/共享/审计信息写入本地 markdown 文件，并被新的内核实例跨实例 recall
- 当前已通过的 production 风格后端验证：TRICOMPANY_COGNITION_HOME 驱动的后端根目录、跨会话追加写入，以及 audit 文件的 provider/timestamp/namespace 元数据
- 当前已通过的模拟外部后端兼容性验证：ExternalCognitionAdapter 可过滤 query 命名空间外的 recall 结果，并与 builtin_markdown / org_shared 并存完成 recall 与 session 生命周期联动
- 当前已通过的 HTTP 外部后端验证：HttpExternalCognitionBackend 可完成 Bearer 认证、401 拒绝、timeout 失败，以及与 builtin_markdown / org_shared 并存时的远端 recall 联动
- 当前已通过的 Supermemory schema 验证：SupermemoryExternalBackend 已按官方 `/v3/documents` 与 `/v4/search` schema 完成 containerTag 映射、429 retry、401 非重试错误和 vendor 错误体解析验证
- 当前已通过的 Supermemory SDK seam 验证：SupermemorySdkExternalBackend 已完成 documents.add / search.documents 的参数映射、containerTag 命名空间映射与 provider 生命周期联动验证
- 当前已提供但未默认执行的 live smoke：supermemory_live_validation.py 可在显式启用时验证 private/shared/audit 三类命名空间的真实远端写入与召回
- 当前未覆盖：真实 Supermemory API key 下的 live 调用结果、账号级限流/配额语义、真实官方 SDK 包安装与 production 级远端后端差异
