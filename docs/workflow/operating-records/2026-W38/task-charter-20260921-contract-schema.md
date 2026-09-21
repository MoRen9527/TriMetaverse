# 任务框架·contract schema 现代化（真源统一工具声明+宿主覆盖开关+runtime_baseline 迁出）

- sourceOfTruth: 本件=董事会命题书（CEO 2026-09-21 10:53 定调结构化）
- syncMode: static
- lastSyncedAt: 2026-09-21 10:5x
- 上位令: CEO 10:53（contract 是真源材料非 openclaw 专属；工具即使要限制也应一个位置限制所有宿主，然后针对具体宿主又可以关闭）
- 主责: CHO（contract schema 结构域）× CTO（渲染管线消费侧）联审
- 排期: **注入器命题合流呈批后启动**（同双席避免三案并压）；与首条实证线 schema 设计同域可并窗

## 一、CEO 定调（原意）

1. contract.yaml 是**真源材料**（宿主无关正身），不是 openclaw runtime 专属物；
2. 工具限制的正确架构=**一个位置（contract）声明限制，覆盖所有宿主**；
3. **各宿主又可以关闭**（宿主层覆盖/消费开关——claude code 现状即"关闭"态=全工具）。

## 二、BOD 实勘发现（CPO 席样本，13 席同构）

1. **tools 段（:51-81）整段 openclaw 模型**：四工具×scope/risk_level/requires_approval/runtime_equivalent: openclaw:*——schema 绑定旧 runtime 语义；
2. **渲管线不消费**：Claude Code 发布位无 tools 行=实际全工具（限制在现宿主无效但无清理）；
3. **runtime_baseline 段（:127+）宿主绑定残留**：`host: copilot-host`+`tri_mc_status: planned`——违反 contract 自家「宿主 binding 事实不入源侧固化」原则；tri_mc 迁移早已完成、双宿主现实下字段失真（与 binding stage 陈旧=同族，CPO gap 件 F2 的 contract 版）；
4. **同构面**：6 席 contract 含 openclaw 字样、8 文件含 runtime_equivalent；runtime_baseline 段 13 席同构推定（联审实勘确认）。

## 三、联审命题

- **命题 A·tools 段 schema 现代化（CHO 结构主笔）**：openclaw 专属字段（runtime_equivalent 等）重构为**宿主无关工具限制声明**+**宿主覆盖开关**（host_overrides：claude=disabled（现状如实）/copilot/openclaw=enabled——开关语义=该宿主是否消费限制）；删除 runtime_equivalent 或迁 openclaw 历史档；
- **命题 B·runtime_baseline 迁出（CTO 主笔）**：宿主绑定字段（host/tri_mc_status）迁 binding profile/manifest（正名后位），contract 删段——渲染管线消费侧同步；
- **命题 C·渲管线配合（CTO）**：渲管线按 host_overrides 决定发布位是否输出 tools 限制（claude=不输出/copilot=输出）——现行为（不输出）与新 schema 对齐确认；
- **命题 D·13 席批量+validator**：13 席 contract 批量重构+validator 用例同步（schema 变更测试）。

## 四、边界与衔接

- 治理语义不变：contract=真源限制声明位（CEO 定调）；宿主覆盖=消费开关非真源分叉；
- 与 P2 批「次批③ contract schema 校准窗」并窗（同域）；与首条实证线 schema 设计同域协调；
- 排期：注入器命题合流呈批后启动（双席负载调度）。

## 五、流程

接单认领回 BOD → 实勘件（13 席 schema 全貌）→ 方案件（A-D 双栏）→ 合流双签呈 CEO 候批。落树 `trees/contract-schema-modernization/`。
