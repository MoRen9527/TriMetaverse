# exec-20260824 目录导读索引

- 编制：DocumentationEngineer（AC-DOC-ADD1，CLONE-BATCH-001，fresh 单次实例）
- 同步修订：[2026-08-25T09:28+08:00] [tick2] 编排实例——补齐 TriMC/TriCode/TriModel 报告条目、修正 TriLC/TriMetaverse 状态漂移（draft→done）、增列 state.json/README/roles 条目（自优化档·索引同步类修复）
- 覆盖范围：`docs/execution/2026-08-24/` 目录下全部 .md 文档（共 13 份，含 audit-campaign 子目录；本索引与战役 README 两份自产文件不计入）
- 说明：各文档状态取自其文档元信息头或正文自述，未读全文的仅读头部归纳。

## 一、周计划与自治战役（执行主线）

| 相对路径 | 一句话主题 | 状态 |
| --- | --- | --- |
| `2026-08-24-week-plan.md` | 2026-W35 周工作计划——四模块迁移落地启动的本周任务清单、版本与 trees 收口安排 | draft（v0.1） |
| `autonomy-audit-campaign-plan.md` | 自治能力实弹测试计划——sg-server 侧小贾持续工作循环（模型验证→六模块审计→生命周期矩阵），CEO 全程零参与 | executing（CEO 08-25 授权，战役进行中） |

## 二、四模块迁移（quad-migration 设计与裁决线）

| 相对路径 | 一句话主题 | 状态 |
| --- | --- | --- |
| `quad-migration-spec.md` | 四模块迁移变更说明书——TriMMC/TriMLC/TriRMC/TriRLC 的映射表、拓扑、Phase 分期与授权记录 | released（CEO 08-24 终批签发） |
| `mmc-host-driver-design-draft.md` | TriMMC 宿主驱动面设计草案——壳与 claude code 宿主的边界、触发/拉起/回收/落盘与三条红线 | draft（v0.1，待评审升版） |
| `trirlc-duty-gap-checklist.md` | TriRLC R 侧职责差距清单——按白皮书词条逐项盘点现状与 4 项缺口归属 | done（清单即结论，已交付） |

## 三、TriMMC 编排运行态（设计—评审—验证线）

| 相对路径 | 一句话主题 | 状态 |
| --- | --- | --- |
| `trimmc-orchestration-design.md` | TriMMC 7×24 编排运行态设计方案——CEO 四场景一机制解析、session 编排层与 tick 循环 | draft（v0.2，双审合流后修订版） |
| `trimmc-orchestration-design-review-cto.md` | 编排方案 CTO 技术面评审——B1-B4 阻断项、S 系列建议、Q-A/Q-B 裁定与 M0 清单 | reviewed（v1.0，APPROVE with conditions） |
| `trimmc-orchestration-design-review-cpo.md` | 编排方案 CPO 产品面评审——P1-P4 产品语义收口、V1-V8 自治率指标与 R 面移植判据 | reviewed（v1.0，APPROVE with conditions） |
| `trimmc-orchestration-m0-report.md` | TriMMC 编排 M0 环境验证报告——5/5 判据 PASS，影子平面就位，AGENT_TEAMS 待 M1 实证 | done（M0 PASS，08-25 执行） |

## 四、audit-campaign 战役目录（进行中产出）

| 相对路径 | 一句话主题 | 状态 |
| --- | --- | --- |
| `audit-campaign/state.json` | 战役进度真源——模块状态/findings 计数、生命周期矩阵、增减员台账、升级事件与下 tick 指令 | 进行中（tick2） |
| `audit-campaign/log.md` | 战役日志（append-only）——tick 冷启动、Step0 模型验证、六模块盘点、增员实录、push 升级事件 | 进行中（逐 tick 追加） |
| `audit-campaign/reports/TriMC.md` | TriMC 审计报告——P0x1 未认证 RCE（零鉴权全卡监听+cron 任意 bash）/P1x4/P2x8 | done |
| `audit-campaign/reports/TriLC.md` | TriLC 模块审计报告（TestEngineer 视角，daemon/agent loop/cron 面）——P0x0/P1x4/P2x8 | done |
| `audit-campaign/reports/TriPilot.md` | TriPilot 审计环境受限事实报告——源码不在 sg-server 部署域，不虚构发现 | done（受限记录结案） |
| `audit-campaign/reports/TriCode.md` | TriCode 审计报告（opencode adapter 面）——P0x0/P1x4/P2x8 | done |
| `audit-campaign/reports/TriModel.md` | TriModel 审计报告——P0x1 Authorization 硬编码必 401+静默 fallback/P1x6/P2x5 | done |
| `audit-campaign/reports/TriMetaverse.md` | TriMetaverse 模块审计报告（代码 registry 视角，scripts/.claude 发布一致性面）——P0x0/P1x3/P2x7 | done |
| `audit-campaign/README.md` | 战役 README——目录结构、角色分工、文件导读（AC-DOC-ADD1 产出） | 进行中（随战役更新） |
| `audit-campaign/roles/coo-state.md` 等 4 份 | 小乔/小狄/CHO/CFO 战役常驻状态文件——记忆载体+fresh 签收落款 | 进行中（3/4 已签收） |

## 未读说明

本批次时间盒内对上述 13 份均已完成头部阅读（元信息+主题结构）；未逐字通读全文，各条目状态以文档自身标注为准。
