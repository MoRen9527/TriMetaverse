# 审计发现分流与处置台账（audit-campaign-001 后续）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/audit-findings-triage.md
- syncMode: source-only
- lastSyncedAt: 2026-08-25
- 输入: 六模块+TriPilot 补审报告（`audit-campaign/reports/`），合计 **P0×3 / P1×23 / P2×48**

## 一、P0 处置台账（全部闭环）

| # | 对象 | 发现 | 处置 | 状态 |
| --- | --- | --- | --- | --- |
| P0-① | TriMMC（trimc 服务） | 未认证 RCE：8710 公网可达 + /internal/* 零鉴权 + cron 任意 bash | `TRIMC_INTERNAL_TOKEN` 强制校验门（未配置兼容旧行为）；四调用方全量接线（fleet jobs 前缀/local daemon 三路补头/drop-in+docker env） | ✅ 已修复已部署（401/200 实测+5/5 单测；TriMC 9fc919e、TriLC 56f05ba） |
| P0-② | TriModel | Authorization 头硬编码 `'******'` 三处——openai chat/stream + trimetaverse 流式，上线即必然 401 且静默 fallback 改道 | 全部改 `Bearer ${apiKey}`；tsc clean+22/22 测试 | ✅ 已修复（TriModel commit 待推；dev 内环已知项，对外分发前置条件消除） |
| P0-③ | TriPilot CLI | 模型驱动任意 shell 零门禁 + cwd 外任意写 + 10 轮静默循环 | `run_command` 默认拒绝需显式 `--allow-shell`；write_file 钳制 cwd 外写入；每轮工具动作披露 | ✅ 已修复（TriPilot commit 待推；tsc clean+单测绿） |

## 二、P1 分域路由（23 枚，修复树下周组织）

| 域 | 数量 | 代表面 | 路由 |
| --- | --- | --- | --- |
| TriMC | 4 | cron/orchestration 面 | 随 quadmig-2 移植批一并消化（该代码正被复制改造） |
| TriLC | 4 | daemon/loop 面 | CARRY-001 TUI 对齐链条顺带 |
| TriCode | 4 | 共享 runtime | agent-core 缺口通道 |
| TriModel | 6 | 配置/key 分发设计（含短时效 per-client 凭证模型建议） | TriModel Phase 3 树 |
| TriMetaverse | 3 | scripts/e2e | scripts 维护批 |
| TriPilot | 2 | 四套手写 SSE 解析器不一致 + mcpServers 工作区注入 | SSE 解析器统一树 + MCP 准入白名单 |

## 三、P2 backlog

48 枚不逐条建票，登记于各仓 code-state/backlog 惯例位；下次同域工程触达时顺手消化。

## 四、经验注记

- 三枚 P0 全部是"执行面安全"主题（RCE/鉴权头/命令门禁），同日全部修复——审计战役的发现到修复闭环 <24h
- TriPilot 补审证明 blocked_env 只是环境限制不是覆盖缺口：本地补审立即补上第 4 枚 P0
