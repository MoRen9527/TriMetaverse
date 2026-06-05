# TriCompany 培训讲义包

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/training/tricompany/README.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

## 1. 培训包定位

这套讲义由 `RAndDTrainer` 视角整理，目标不是再写一份抽象宣传稿，而是把 `TriCompany` 讲成一个能被新人、岗位 owner、研发执行者和治理协作者直接接手的项目级训练包。

它回答五个问题：

1. 为什么三元宇宙需要把“赛博公司”落成 `TriCompany`。
2. 员工不是一个 prompt 文件，而是一条 `source -> publish -> live -> runtime -> governance` 的完整链路。
3. 员工的入职、岗位变动、离职和交接，为什么要被设计成工程流程，而不是聊天习惯。
4. 为什么 `CEOChiefOfStaff` 是当前最值得拆解的样板。
5. 当前已经做到哪里，未来还差哪些 CTO / CPO 已经点名的升级项。

## 2. 阅读边界

本培训包是导读层，不是项目真源替代品。阅读时请始终记住下面四条：

1. `赛博公司 / cyber company` 是通用概念名；`TriCompany` 是它在本项目中的具体产品名。
2. 当前 live 仍是 `Copilot-host` 阶段，不等于 `TriMC` 正式宿主切换完成。
3. `TriCompany-copilot-host-assets` 是当前宿主支撑包与发布副本集合，不是第二真源。
4. 运行态记忆、wiki、audit 与 workbench 不等于源码真源；training 里看到的运行对象，必须回链到其 source 规则。

## 3. 当前态 / 目标态标记规则

为了避免把目标蓝图写成已完成事实，本包统一采用以下写法：

- **当前态**：今天已经存在、已经可定位、已经能解释其边界的能力。
- **过渡态**：链路已设计、局部已落地，但仍需更多验证、签字或宿主升级。
- **目标态**：CTO / CPO 联审后确认值得推进的方向，但目前还不能写成已完成。

如果正文里出现 `TriMC 正式宿主`、`完整授权矩阵`、`全自动治理`、`链上透明结算` 等词，请优先检查它落在“目标态”还是“当前态”栏目。

## 4. 推荐阅读顺序

1. [01-为什么需要-tricompany](./01-%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81-tricompany.md)
2. [02-员工设计与生命周期](./02-%E5%91%98%E5%B7%A5%E8%AE%BE%E8%AE%A1%E4%B8%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.md)
3. [03-source-publish-live-链路](./03-source-publish-live-%E9%93%BE%E8%B7%AF.md)
4. [04-ceo-chief-of-staff-全链路案例](./04-ceo-chief-of-staff-%E5%85%A8%E9%93%BE%E8%B7%AF%E6%A1%88%E4%BE%8B.md)
5. [05-cto-cpo-review-后的优化方向](./05-cto-cpo-review-%E5%90%8E%E7%9A%84%E4%BC%98%E5%8C%96%E6%96%B9%E5%90%91.md)
6. [appendix-a-工件清单与引用规则](./appendix-a-%E5%B7%A5%E4%BB%B6%E6%B8%85%E5%8D%95%E4%B8%8E%E5%BC%95%E7%94%A8%E8%A7%84%E5%88%99.md)

## 5. 真源优先级

本文引用和解释时遵循当前项目的真源顺序：

1. `tmv-whitepaper.md`
2. `project.md`
3. `tricompany.md`
4. `docs/三元宇宙架构与模块说明.md`
5. `docs/workflow/tricompany-agent-roles.md` 与相关 workflow 真源
6. `docs/registry/*.md`

在员工链路细讲部分，还会直接回链到 `TriCompany` 源仓里的 Python、JSON 与 workflow 文件，因为 training 要讲清“规则从哪里来”，不能只盯着 support payload 或 live 入口。

## 6. 本包的核心结论

一句话概括：**TriCompany 不是“未来 AI 公司概念图”，而是 TriMetaverse 为当前商业实验搭建的最小经营载体；它用源码规则、发布链、support payload、live 入口和运行态证据，去逼近一个可持续演进的 AI 治理公司。**
