# R3 现状盘点：白皮书/理念/命名冲突/改名影响面（2026-08-21）

分身：tmv-r3-concept-naming（CPO 小乔分身）｜状态：done｜性质：现状事实，非方案判断
方法说明：文件名级 Glob 定向扫描+核心文档通读；内容级全仓 grep 由编排层补做（见文末附录）。

## 一、白皮书现状（tmv-whitepaper.md，1340 行，仓库根，"草案待人工审核签发"）

【实证】章节：0 目录/1 摘要(1.1-1.5)/2 引言/3 技术架构(3.1 三层模型、3.2 能力域、3.3 核心模块+3.3.1 二十模块表、3.4-3.5 端到端框架、3.6-3.9)/4 融合特性/5 通证经济(含 5.3 三阶段)/6 治理/7 场景/8 路线图(8.1 四层推进 W29 版)/9 团队/10 风险/11 总结/附录A-E。

【实证】现三层定义(§3.1)：元认知=知识生产/任务编排/评测反馈；元虚拟=游戏化虚拟世界/仿真沙盒/平行试验（数字生命体、星球城市）；元现实=真实部署/业务变现/回流校准。螺旋链：元现实→元认知→元虚拟→回灌元现实。

【实证】差距点：3.3.1 二十模块表与 8.1 四层推进表把 TriMC/TriLC 写死（服务域行、L1 行、入口层 PC 端打包）；8.1 关键路径"CTO-008 TriMC+TriLC 双模协同"表述。§1.3 创新点 2"三元联动增长螺旋"与新定义螺旋同构。附录 B 术语表无 TriMC/TriLC 词条（改名不触术语表，但应增 TriMMC 等新词条）。不动面：1/2/4/5/6/7/9/10/11 与 3.2/3.6-3.9 基本不涉及模块名。

## 二、架构文档现状（docs/三元宇宙架构与模块说明.md，V0.4，2026-07-22）

【实证】§4 模块表 21 模块+vscodium。当前语义：TriMC=公司云端实体（Main Controller，bin: trimc，"TriMetaverse Main Controller"）；TriLC=本地人机协作主入口（bin: trilc，"TriMetaverse Local Controller"，v0.9.0）。

【实证】§5 已有改名治理先例：TriDeployment→TriAuto、Tride→TriCode，均"历史名保留为兼容路径名"；TriGateway↔TriGatway alias 映射制度。TriMMC/TriMLC/TriRMC/TriRLC 四名在两份核心文档中零出现。

## 三、命名冲突检查

【实证】四新名在 TriMetaverse/docs、TriCompany/docs 文件名级零占用；npm 包名域（trilc/trimc/trimodel/tripilot-chat/@trimetaverse/tricode/@trimocompany/agent-core）无撞名。

【实证】TriModel 为现役独立仓（npm: trimodel v0.2.0，Provider/Model 配置层），被 TriLC、TriMC 同依赖。

【推断】混淆风险排序：(1) **TriMLC vs TriModel——四名中最高**（前缀同 TriM、口语同 "Tri-M…"、两者同时活跃）；(2) TriMMC vs TriMC 一字母差（改名固有，过渡期并存）；(3) TriRMC vs TriMC 视觉插入 R（中）；(4) TriRLC 无直接撞（但 TRILC_WEEKLY_PLANE_ROOT 等大写变体需迁移决策）。

## 四、改名影响面（产品可见面 6 类）

- 【实证】A 安装器（install-tricade.ps1 661 行）：NSSM 服务名 "TriLC"、安装目录 trilc、trilc.cmd、schtasks "TriLC Daemon"、HKCU Run 键、TRILC_WEEKLY_PLANE_ROOT、ARP 条目。存量 trilc 相关脚本约 25 个（历史版 17+verify/hot-swap/fix-nssm）。
- 【实证】B CI（build-tricade.yml）：6 仓 checkout、staging\trilc、Release 文案；产物名双线并存（CI 线 TriCade-<calver> / 本地线 TriMetaverse-Desktop-v0.4.x）。
- 【实证】C TriPilot：displayName 不含 TriLC（不触展示名）；但 package.json 内嵌 8+ 含 trilc 设置键（chatProvider="trilc-direct"、triLC.autoStart/port、trilcDirect.*）——用户 settings.json 已持久化，改名破坏配置兼容。
- 【实证】D CLI/文档面：CLAUDE.md 常用命令全为 trilc 子命令+8711/healthz。
- 【实证】E binding-profiles：13 json 路径引用不涉 TriLC/TriMC；仅 notes 文字级 "not a TriMC formal host switch"（13 处）。
- 【推断】F 量级：代码/文档改名一次成本 + 已装机机器状态迁移二次成本；install-tricade.ps1 已有 -MigrateLegacy 机制与历史名兼容先例可复用。

## 五、既有理念资产映射

【实证】白皮书三元+螺旋方向+元认知沉淀理念完整存在（§1.1/§3.1/§1.3/附录B/FAQ E.1）。

【推断】**新定义=同名换轨升级，非全新**：三层名称与螺旋叙事全保留；内涵从"能力域抽象"换为"系统实例对"（每层一对 controller）。元虚拟从游戏化世界收窄为成熟虚拟研发环境（可整体换 codex）；元认知从能力域变为项目代码仓载体；元现实承接自研工程面。白皮书 §1.3"虚拟试验→现实生产力→认知迭代增长螺旋"即 CEO 方法论原型表述。**关键产品事实：工程不换、叙事分层换**——现役 TriMC 归位"元虚拟主控"、TriLC 归位"元现实本地控制器"。

【实证·旁证】"共用 agent-core"已部分是现状：TriLC 与 TriMC 均依赖 @tricompany/agent-core（file: 链接），canonical 归属 R1 已证（TriCompany/packages/agent-core 为真源，TriMC/packages/agent-core 仅 dist 残留）。

## 附录：编排层补做的全仓内容级 grep（2026-08-21）

范围：TriMetaverse/docs + TriCompany/docs + TriCompany/source-agents + TriLC/src + TriMC/src + TriPilot/src（排除 node_modules 与 operating-records），八种大小写变体逐个查。

**结果：TriMMC/TriMLC/TriRMC/TriRLC（含小写变体）全部 0 处**——四新名全仓零占用实锤，命名冲突检查闭环。
