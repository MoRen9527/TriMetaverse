# W33 周会议程材料 — M0-M3 收官（AGENDA-20260816-001）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W33/AGENDA-20260816-001-m0m3-closeout.md
- syncMode: audit-record
- lastSyncedAt: 2026-08-14

> 版本：v2026.W33.1
> 状态：正式版
> 适用范围：周会 2026-08-16 20:00
> 整理：小贾（CEOChiefOfStaff）

---

## 一、本周总览：10 树 done + 里程碑收官

| 树 | 主题 | 判定 | 状态 |
| --- | --- | --- | --- |
| w33-weekly-migration-ade | 周平面迁移自动化 ADE 五段闭环 | done | 周初投产 |
| r7-eng-gate | 3.1 构建 + 3.2 测试（工程门禁域） | APPROVE | done |
| r8-base-exec | 1.1-1.5 基础执行域（含回滚演练） | APPROVE | done |
| r9-eng-cross | 3.3 diff 审查 + 3.4 安装态意识 + 4.1 sibling 引用 | APPROVE | done |
| r10-cross-ops | 4.2 contracts + 4.3 六仓健康 + 6.1 OP + 6.2 周会 | APPROVE（CONDITIONAL_PASS 收口） | done |
| r11-ops-init | 6.3 树状态同步 + 6.4 会话初始化器 + O1 修复 | APPROVE | done |
| r12-production-chain | 5.1-5.4 生产链域 + 4.2 安装态（M2 收官树） | APPROVE | done |
| r13-contract-convergence | M3-R1：O2-A 合同真源统一（v3.0） | APPROVE（10 项口径零迁移丢失） | done |
| r14-production-dualrun | M3-R2：生产双跑部署（心跳契约 + 产物 + runbook） | APPROVE | done |
| r15-ops-day-ready | M3-R3：运营日就绪（③b 联通面 + ④ dist 改造） | APPROVE | done |

**里程碑一句话**：server-fleet-trilc-parity 计划 M0-M3 全部收官，2026-08-14 正式运营日（TriLC v0.4.4 本地执行面 + TriMC 服务器舰队面互为 fallback，双向心跳契约现役生效）。

## 二、M0-M3 收官摘要（浓缩版）

- **3 天 3 里程碑**：M0/M1（08-11）→ M2（08-12~13）→ M3（08-13~14 正式运营日）
- **M2 能力验证**：12 轮树 25/25 全勾 + C 层 M2 必需项全过（清单 v2026.W33.15）
- **运营日实测**：count 14（14 员工全实载 + hasSystemPrompt 全 true）、version 0.4.4、trimc connected（degraded→connected 心跳闭环）
- 完整历程见 `docs/execution/server-fleet-trilc-parity-plan.md` + OP 2.3.0，本材料不重复

## 三、关键经验（周记 2.2 五条各一句）

1. 树协议存档读档：系统中断从事故降级为"读档继续"（08-13 重启首战验证）
2. 独立验证纪律：研发自证会系统性漏缺陷，执行-验证分离是质量地板
3. 正式安装态验证：模拟全过 ≠ 生产能跑（count 0 = 旧进程未重启）
4. 收口门禁 v2：判定+登记+push+报告四件事，文档状态为准代收口
5. 双仓写方向单主体：本地→裸仓→舰队单向写，push 编排层统一补

## 四、遗留与待办（会前可清点）

| 项 | 状态 | 责任方 |
| --- | --- | --- |
| 11 仓存量 dirty（O1 修复后暴露） | 待各仓 owner 清理 | 各仓 owner（议题 1） |
| CARRY-001 TUI 链（含 ink-testing-library 债） | 8w 逼近 CEO 升级线 | CEO 裁决 |
| BUG-20260805-001 Read 工具空串 | 排 TriLC 侧修 | 小全/小狄 |
| M4 源码替换 | deferred，CEO 另行启动 | CEO（议题 4） |
| CI run 31657624910 产物验证（5.1 MSI 补证 + BUG-003 CI 侧验证） | run 状态待查 + 产物发布后补验 | 小贾跟进 |
| push 积压（本地领先 5+ commits） | 待 CEO 补 | CEO（议题 3） |
| 运营期观察：心跳误判（无开关）、双跑行为、升级回滚纪律 | 运营期跟踪 | 小狄（架构）/小贾（登记） |

## 五、议题建议（周六 20:00 会议）

1. **dirty 清理责任分配**：11 仓存量（TriMem 16 / TriStaciss 14 / TriTest 8 / TriDeployment 6 / TriDev 6 / TriTraining 4 / TriAvatar 2 / TriGateway 2 / vscodium 1 / TriCompany 15 / TriModel 1 项）——按仓分配 owner 与清理时限
2. **运营节奏**：M3 收官后推进检查停止，周平面如何承载运营任务（心跳观察、双跑运维、周更节奏）——建议运营期以周会驱动 + OP 登记为主
3. **CI 链路与 push 权限**：CI run 产物验证收口 + push 积压清理 + push 权限是否下放编排层
4. **M4 启动条件**：源码替换的启动门槛（M3 运营观察期多久、稳定性指标）——CEO 定
5. **运营期质量门禁**：双跑期的验证纪律延续方式（树协议是否沿用/轻量化）、升级回滚的审批边界

## 六、本周关键 commit 索引

| Commit | 主题 |
| --- | --- |
| 11b246de | r12-3 收口：M2 全勾 + M3 自动推进触发 |
| 3fa6bb04 | r13-4 收口：M3-R1 合同统一（10 项口径零迁移丢失） |
| c50cb25f | r14-4 收口：M3-R2 部署就绪 |
| dc32f305 | r15-3 收口：M3-R3 运营日就绪 |
| 271bd6de | 运营日确认 + M3 收官（OP 2.3.0） |
| 46933b5f | BUG-002/003 修复登记（版本注入 BOM + yoga 别名） |
| fa0976c2 | O1/O2 CTO 评估落盘（4.3 证据加注 + M3 前置登记） |
| c939d708 | 周记 2.2 经验提炼版（五条协作机制） |
