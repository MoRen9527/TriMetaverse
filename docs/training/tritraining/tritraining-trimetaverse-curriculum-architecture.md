# TriMetaverse 专题课程体系架构

## 文档同步元信息

- sourceOfTruth: TriTraining/docs/training/tritraining-trimetaverse-curriculum-architecture.md
- publishedFrom: TriTraining/docs/training/tritraining-trimetaverse-curriculum-architecture.md
- syncMode: published-copy
- publishTier: central-training-curriculum-architecture
- lastSyncedAt: 2026-06-14

版本：V0.2
日期：2026-06-14
状态：TriTraining 中央聚合课程体系架构副本

## 1. 核心问题

`TriMetaverse` 课程体系到底应该按：

1. 模块来组织
2. 还是按 `AI + Web3 + 元宇宙` 概念域来组织

当前判断：都不应单独作为唯一顶层，而应采用“混合式架构”。

## 2. 为什么不能只按模块

如果只按模块组织，会出现三个问题：

1. 新人一开始不知道项目整体在解决什么问题。
2. 学习者会先掉进仓库和目录，而不是先建立项目心智地图。
3. `AI`、`Web3`、`元宇宙` 三条主轴被拆散，最后只剩孤立模块说明。

## 3. 为什么也不能只按三主轴概念组织

如果只按 `AI / Web3 / 元宇宙` 组织，也会出现三个问题：

1. 学习者知道概念，但不知道真实项目和真实模块怎么落地。
2. 代码、目录、工作流和工程执行链会失焦。
3. 无法把 `TriCompany / TriAvatar / TriStaciss / TriMC / TriDev` 这些真实模块挂到清晰位置上。

## 4. 当前推荐架构：四层混合式

### 4.1 第一层：项目总览层

先回答：

1. `TriMetaverse` 是什么
2. 当前阶段边界是什么
3. 为什么要有 `TriCompany / TriTraining / TriAvatar / TriStaciss / TriMC ...`

### 4.2 第二层：三主轴理解层

再拆成：

1. `AI`
2. `AI & Web3`
3. `AI & 元宇宙`

这一层负责建立概念地图，而不是直接下沉到具体仓库。

### 4.3 第三层：模块专题层

模块专题层再承接真实模块：

1. `TriCompany`
2. `TriTraining`
3. `TriAvatar`
4. `TriStaciss`
5. `TriMC`
6. `TriLC`
7. `TriPilot`
8. `TriDev`
9. `TriTest`
10. `TriDeployment`

### 4.4 第四层：工作流与 project-run 层

最后才进入真实执行：

1. `source -> publish -> live -> runtime`
2. `IPD`
3. `project-run`
4. `phase engine`
5. `lesson / lab / project course`

## 5. 推荐课程树

### 5.1 项目总览层

1. TriMetaverse 项目是什么
2. 当前阶段边界与不承诺项
3. 模块总览与角色图

### 5.2 三主轴理解层

1. AI 主轴
2. AI & Web3 主轴
3. AI & 元宇宙主轴

### 5.3 模块专题层

每个模块专题默认用同一套讲法：

1. 模块定位
2. 当前成熟度
3. 真源入口
4. 代码与工作流结构
5. 当前已实现 / 待验证 / 待初始化

### 5.4 工作流与 project-run 层

这一层是最适合放“真实小课程”的地方。

例如：

1. Employee Source Kit CLI
2. Employee Host Publish 发布链
3. IPD case 最小闭环
4. TriTraining lesson / lab contract

## 6. 当前小课程怎么挂进去

`Employee Source Kit CLI` 与 `Employee Host Publish 发布链` 当前推荐挂法：

1. `TriMetaverse 专题 -> 模块专题 -> TriCompany`
2. `TriMetaverse 专题 -> 工作流与 project-run -> source kit -> host publish -> binding profile -> live / runtime`
3. 同时交叉挂到 `AI Agentic Engineering`

其中：

1. `Employee Source Kit CLI` 负责 source scaffold / validate 的上游。
2. `Employee Host Publish 发布链` 负责 support payload、manifest 与 binding profile 的下游。

这样它们都不是孤立 CLI 课，也不会丢失 `TriMetaverse` 真实项目背景。

## 7. 渐进式建设规则

后续课程建设统一按以下顺序：

1. 先补项目总览课。
2. 再补三主轴理解课。
3. 再补模块专题课。
4. 最后大量补工作流 / project-run 实战课。

原因是：

1. 总览先建立地图。
2. 概念层先建立主轴。
3. 模块层再承接真实边界。
4. 工作流层再进入最细的实操。

## 8. 当前结论

所以，`TriMetaverse` 课程体系当前最正确的组织方式不是“只按模块”，也不是“只按 AI + Web3 + 元宇宙”，而是：

- 顶层按学习者理解路径组织
- 中层按三主轴建立概念地图
- 下层按模块专题承接真实系统
- 最底层按工作流 / project-run 承接真实实操课
