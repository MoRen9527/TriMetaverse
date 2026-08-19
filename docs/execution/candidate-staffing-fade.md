# 候选岗位发布 FADE（员工上岗）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/candidate-staffing-fade.md
- syncMode: source-only
- lastSyncedAt: 2026-08-18

版本：v1.1（2026-08-18 立册；2026-08-19 补三层语义分离口径）

登记：[TriCompany fade-registry.md](../../TriCompany/docs/engineering/fade-registry.md) **FADE-004**

上位规范：[TriCompany ADE 模式规范 §1.1](../../TriCompany/docs/engineering/ade-pattern-spec.md)（FADE = Full-cycle ADE）

组织依据：[clone-dispatch-protocol.md](clone-dispatch-protocol.md)（岗位-员工分离：md 岗位说明 = JD 组织结构；上岗 = JD 进在岗名册；分身 spawn = 另一层 HC 流程，按 JD 可创建多个分身并行执行——防单 agent context 耗尽的原始设计目标）

## 一、定义

「候选岗位发布」= 把岗位 JD 发布到候选名册，并管理员工上岗全生命周期：**开业装配发布候选全集 → CEO 勾选选定 →（后补）settings 勾选 → CHO 审批 → JD 进在岗名册**。在岗名册是公司运行态事实（谁可被派工/被 spawn 分身），不是 agent 加载列表（13 岗合同全部常驻加载，名册只治理"上岗"状态）。

**三层语义分离（2026-08-19 live entry 评审裁决，CFO 及未来上岗复用）**：决策面=在岗名册（谁在岗/编制，治理真源，本 FADE）；信息面=员工 contract（身份/职责/权限，三端可读）；适配面=live entry（当前宿主 Copilot-host 的派生加载壳——发布管线渲染/复制产物，禁人工直接编辑，hash 不一致时 `--publish-agents` 覆盖并审计留痕）。"三端可读 contract"与"Copilot-host 发现"并行互不替代。

## 二、FADE 生命周期（八段映射）

| 段 | 工件 |
| --- | --- |
| 事件触发 | ① 开业装配（assemble selections）；② TriCade settings→agents 勾选候选；③（未来）CHO 主动增员提案 |
| 登记 | `POST /internal/v1/staffing/onboard` → requestId + runId，持久 `dataDir/staffing/requests.json`（status=pending-cho）；去重：已在岗/已待审 → 409 |
| Agent Qualify（门禁） | 链态门（ready/confirm/sync 才可增员，开业前 409）+ JD 存在性（role-catalog）+ 重复检查 |
| Plan Skill | JD 单一真源映射（TriCompany 合同 displayName/role/description）；无需逐次语义规划（岗位定义固定） |
| DCE | CHO 批准后 `CompanyInitState.employees` 持久写入（tmp+rename 原子）+ `init:staffing-*` 事件发布 |
| Close Skill | CHO 语义裁决（编制合理性、职责边界；面板代理 approver=panel-cho，审计留痕；未来由 CHO agent 会话执行） |
| Close CLI | `POST /internal/v1/staffing/decide`：CHO 门（非 CHO 审批人 403）→ 名册写入 + 审计 json `dataDir/staffing/CHO-staffing-<requestId>.json`（对齐 CHO-clone-staffing 审计形态）→ roster 回读校验 |
| 终态 | APPROVED（active）/ REJECTED（回 candidate 可再申请）/ BLOCKED（链态/重复/不存在） |

## 三、API 面（daemon 单执行体）

| 端点 | 语义 |
| --- | --- |
| `GET /internal/v1/staffing/roster` | 13 岗 JD 全集 + status（active/pending-cho/candidate）+ counts + chainState |
| `POST /internal/v1/staffing/onboard` | `{roleId}` → 202 pending-cho；门禁 409/404 |
| `POST /internal/v1/staffing/decide` | `{requestId, decision, approver, note}` → CHO 门 403；approved→名册+审计；rejected→终态记录 |

## 四、TriCade settings→agents 协同（CEO 要求的呈现面）

- 候选全集可见（13 岗全列）；开业选定 = 打钩 + "在岗"徽标（锁定）
- 候选可勾选 → 提交上岗申请 → "CHO 审批中"徽标 + 批准/驳回按钮（CHO 面板代理）
- 页首提示行说明名册态（链态/在岗数/待审数）+ 岗位-分身关系（每个岗位可按分身派工协议创建多个分身并行执行任务）
- 未开业（链态门未过）时勾选会被 409 拒绝（toast 提示"开业完成后才允许增员"）

## 五、与分身派工（clone-dispatch）的边界

| 层 | 治理对象 | 审批 |
| --- | --- | --- |
| 候选岗位发布（本 FADE） | JD 进在岗名册（组织结构） | CHO 审批上岗 |
| 分身派工协议 | 按在岗 JD spawn 分身实例（任务执行） | CHO 审批 CLONE_STAFFING_REQUEST（编制/回收） |

上岗是"这个岗位有人了"；分身是"这个人按 JD 复制几个并行干活"。未上岗的 JD 理论上不应 spawn 分身（名册是分身的组织前提）。

## 六、E2E 验证记录（2026-08-18，隔离 dataDir + 种子开业态）

① 总助 active（开业选定打钩）② CMO onboard→202 pending ③ pending 可见+counts ③b 重复 409 ④ 非 CHO 审批人 403 ⑤ CHO 批准 200 ⑥ CMO→active（2/13 在岗）⑦ 驳回→回 candidate 可再申请 ⑧ 审计 json 落盘。8/8 PASS。
