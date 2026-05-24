# Hermes Copilot Host Phase 1 Plan

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/execution/hermes-copilot-host/phase-1/PLAN.md
- publishedFrom: 当前文件（support evidence）
- syncMode: audit-record
- executionTier: phase-evidence
- stableConclusionDoc: TriCompany/docs/execution/hermes-copilot-host/phase-1/PLAN.md
- sourceSyncRule: 当前文档只在新增 phase 证据、迁移说明或 operator 审计需要时更新，不执行 same-name published-copy 追平
- lastSyncedAt: 2026-04-28

日期：2026-04-16
状态：已启动，进入总助接管验证

## 迁移说明

- 本记录形成时 support root 路径名为 `TriCompany-shadow-host`。
- 自 2026-04-18 起，当前生效目录已迁移为 `TriCompany-copilot-host-assets`。
- 为保留 phase-1 证据链，正文中的旧路径表述不做整体替换。

## 目标

在 TriCompany 内完成当前阶段的 Hermes 融合与 Copilot 宿主迁移口径收拢。

## 本阶段范围

- 重置 TriCompany 路线文案
- 补齐 Hermes 融合设计
- 建立 vendor/reference 的 Hermes 冻结参考副本
- 建立 runtime/cognition 的元认知原型骨架
- 把当前阶段 Copilot 宿主资产统一收拢到 .github
- 设计回迁 TriMetaverse/.github 的 shadow-test manifest
- 同步 registry 状态到新口径

## 输入

- 用户最新确认的新路线
- TriCompany 当前文档与总助套件
- Hermes 研究结论

## 输出

- 更新后的 README、产品路线和技术路线
- 更新后的总助套件与 registry 状态
- 当前阶段 Hermes 融合与宿主迁移规则文档
- vendor/reference/hermes-agent-memory/ 冻结参考副本
- runtime/cognition/ 元认知 contracts、kernel、providers 骨架
- .github/manifests/tricompany-copilot-host-backport.json

## 验收方式

- 核对当前路线是否统一改为“先 TriCompany 融 Hermes，再 .github 宿主迁移”
- 核对 .github 宿主资产是否在文档里被写清
- 核对元认知层是否已明确为“统一内核 + 员工私域 + 组织共享”
- 核对回迁清单是否采用 shadow-test 而非直接覆盖
- 核对没有把试运行口径误写成正式宿主切换

## 当前已完成

- shadow-test manifest 已回迁到 TriMetaverse/.github
- TriCompanyProductRegistry、TriCompanyCodeRegistry、TriCompanyCEOChiefOfStaff 三条 smoke test 已通过
- tricompany-开始会议 与 tricompany-结束会议 这两条历史 prompt 的闭环 smoke test 已通过
- 已完成一轮完整会议生命周期演练，并形成会议纪要与执行回填
- 已在 TriCompany-shadow-host 根目录完成 runtime/cognition 最小 smoke test
- 已在 TriCompany-shadow-host 根目录完成 Hermes 核心 recall / consolidate 契约验证
- 已在 TriCompany-shadow-host 根目录完成 provider-backed 集成验证
- 已在 TriCompany-shadow-host 根目录完成 production 风格后端落盘与审计验证
- 已在 TriCompany-shadow-host 根目录完成模拟外部后端兼容性验证
- 已在 TriCompany-shadow-host 根目录完成 HTTP 外部后端认证与网络验证
- 已在 TriCompany-shadow-host 根目录完成 Supermemory 官方 schema 验证
- 已在 TriCompany-shadow-host 根目录完成 Supermemory 官方 SDK seam 验证
- 已在 TriCompany-shadow-host 根目录完成基于真实 Supermemory 账号的首轮 live smoke，并生成 JSON 证据与固定记录页

## 下一轮验证队列

- 总助 prompt 入口更细粒度的交互体验验证
- 多轮会议场景下 support root、会议边界与 APPROVE / FREEZE / ESCALATE 路由稳定性验证
- shadow 接管清单核对与本地 Copilot-host 接管放行口径收口
- Supermemory 账号级 rate limit / 配额语义与真实官方 SDK 包接入转入后续技术深化项
- CPO / CTO 已完成当前 live entry 绑定；协作验证下一步单列

## 下一轮入口

- 当前如需继续正式验证，使用 TriMetaverse/.github/prompts/开始会议.prompt.md 发起；若要回看旧入口，查看 `docs/execution/hermes-copilot-host/phase-1/baselines/tricompany-ceo-chief-of-staff-archive-2026-04-26/`
- 继续以 TriMetaverse 根下的 TriCompany-copilot-host-assets 作为唯一 support root
- 结合 CHIEF-OF-STAFF-PHASE-1-TAKEOVER-CHECKLIST.md 收口本轮阻塞项
- 继续保持当前只是 shadow-test，不写成正式宿主切换
