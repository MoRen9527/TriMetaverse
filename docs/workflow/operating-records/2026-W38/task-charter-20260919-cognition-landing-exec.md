# 任务书·认知层落点归一执行令（单批双段）

- sourceOfTruth: 本件=董事会执行令（方案终批后执行凭据）
- syncMode: static
- lastSyncedAt: 2026-09-19 02:4x
- 上位令: CEO 2026-09-19 02:46 终批（三项全批，批注已入方案正身）
- 方案正身: `trees/cognition-landing/joint-plan.md`（双签 9f47bff3/8e7f2b1c + CEO 批注）
- 派工席: Board（BOD）
- 执行体: **FSD 主执行**；CTO 监督验收；CPO 随叫配合验收

## 一、执行范围（单批双段，一个批次窗）

### 段一：13 席声明追平

1. 13 席 memory/colleagues/social 契约件「运行资产落点」按 joint-plan §一标准表述批量改写（≈40 文件，源侧 `TriCompany/source-agents/`）；soul 覆盖层语义不动。
2. **validator 联动（硬前置，同窗切）**：employee_source_kit :553/576 标记族同步改双声明锚；同窗优先，不留 warn 过渡窗。
3. 全部走源侧 commit→**发布管线重渲**，禁手工拷贝位改。
4. 回滚锚：源侧单 commit revert；渲染产物在版本库。

### 段二：死层七项处置（第三棵树定案=**归档**）

照 joint-plan §四表逐项执行，其中：

- #1/#2 两代 `.tricompany-cognition` 死数据归档（域选择照表：文档域→`docs/workflow/archive/`；宿主资产域→`_archive/2026-04-cognition-run/`）；**腿位声明保留**（归档死数据非腿位）。
- #3 权威位 `runtime/cognition/`：真源活体不动；宿主副本走**发布管线重发布追平**（禁手工同步）；无源对应物项→死层候选归档（判据 governance:107）。
- #4 第三棵树 `D:\Code\ai\TriCompany-copilot-host-assets`：**归档**（CEO 定案）——归档方式=移入归档区并 README 头注（老快照身份/漂移 4 项/停更时点）；**删前抽查改为移前抽查**（两差异目录 employees/runtime/vendor 确认零独有内容后再移）。
- #5 `randd-trainer/`：执行时二查一定（有独有内容→更名归位；空壳/重复→归档）。
- #6 `project-trainer/`：归档。
- #7 DE runbook：迁 `knowledge/employees/deployment-engineer/inbox/`；顶层 `employees/` 清空后删除；DE 操作注记改指。
- **复活纪律**：任何现役 spec 引用归档件=先走评审解除归档。

## 二、常设条落地（批③附带）

- p2 两处精确化（promotion 目的地=组织知识库/汇审计=学习审计）：随段一契约改写一并落。
- 副本卫生升格 governance 明文：FSD 落 TriCompany governance 件修订条（CTO 复核措辞），与段一同窗提交。

## 三、边界与红线

- 单一真源红线；活验证件族（TriCompany/runtime/cognition 现役消费中）不在处置域。
- 归档区=史料非真源，无第三真源。
- 三仓联动顺序：源侧 commit→管线渲染→副本追平，禁倒置。
- 执行窗自排（FSD 按峰谷成本纪律自定），回执 BOD 排定窗。

## 四、验收锚

1. 段一：13 席 × 3 件声明全部双腿表述；validator 全绿零 warn；渲染产物与源侧一致（身份验证三查）。
2. 段二：七项逐项有动作证据（归档 README 头注/收编注记改指/目录删除回执）。
3. 全量回归四项读数照全量读数回报纪律，既有失败逐族归因。
4. CTO 监督验收签认+CPO 随叫复核签认双签后，BOD 销账核。
5. 落树：`trees/cognition-landing/exec/` 收执行证据；收口件回执 BOD。
