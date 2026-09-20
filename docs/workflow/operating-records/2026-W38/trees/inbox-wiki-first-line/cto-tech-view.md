# p2 首条实证线·CTO 技术线评估件

- sourceOfTruth: 本件（技术线三题评估；与 CPO 产品线双栏合流，评估阶段不动现役结构）
- syncMode: draft
- lastSyncedAt: 2026-09-20T23:3x+0800（date 现查 23:34:33，本回合执行）
- 命题书: task-charter-20260920-inbox-wiki-first-line.md

---

## 一、管道实现（inbox→schema→wiki，shallow 零 LLM 起步）

**首条线形态=三段最小闭环**：

1. **inbox 写入端**：员工零散渐进写 `knowledge/employees/<席>/inbox/`（.md 碎片+frontmatter 两键：`section: <大纲位id>`+`type: discipline|experience`）——frontmatter 指定位=schema 映射的机器可读锚（零 LLM 的前提：**写入时带上分类意图**，写模板入 inbox source-template.md 增补两键示例）；
2. **schema 映射端（digest 管道首段）**：`digest-rules.yaml`（p2 设计件落地首版）——规则形如「type=discipline → org 级纪律手册对应节；type=experience → <席> wiki 经验页对应节；section 键=大纲位直配」；**shallow 执行体**=批处理脚本起步（`digest-inbox.mjs`：读 inbox 待处理件→按规则映射→写 wiki 对应节位→原 inbox 件标记 processed 归档）——**脚本+手动/cron 触发起步，digest daemon 候稳定后升**（D-29 无窗格式合规）；
3. **wiki 落位端**：纪律手册=**org 层**（13 席通用：`knowledge/org/wiki/discipline-handbook.md`——大纲骨架 CPO 列全先行）；经验总结=席级（`knowledge/employees/<席>/wiki/experience.md`，一文档两文档 CPO 裁）；**写入走首落 commit 模板**（who+why+区——首条线即模板第一个真实用户）。

**技术注记**：org 层 wiki 在现役 injector sync 范围外（sync.ts 读 source-agents 契约+employees 内容）——**sync 扩 org 层读取=本线管道实现的一部分**（注入接线的前提件）。

## 二、两域注入配置（注入器命题联动，分步方案）

CEO 产品语义：本地域=开发作业线内容/服务域=运维部署线内容，分别注入。实勘基线：**服务域注入能力=零**（注入器命题 A 新发现——TriMMC 无面+sg 无 TriMLC 等价物）。

**裁=两域分步，服务域首条线走拉取式（不等注入器批）**：
- **本地域（TriMLC 现役注入）**：injector 现役管道+sync 扩 org 层后即可注纪律手册——**配置分域落法=按 contentRoot/tag 过滤**（本地域注入配置声明开发线 tag 集），injector 现有 layer/tag 机制可承载，无架构改动；
- **服务域（TriMMC）**：注入式候注入器架构命题批后（共用包加端红利）；**首条线服务域=拉取式**——运维线内容落 wiki，服务域会话经前置核查指针按需读（见 §三），注入式候批后升级。**分步合规**：服务域有内容可读（拉取）+不阻塞在注入器命题上。

## 三、wiki 读取时机：**混合裁=前置核查拉取式为主+boot 注入摘要级辅助**

| 方案 | 利 | 弊 |
| --- | --- | --- |
| boot 注入全文 | 机制强制（不靠自觉） | 纪律手册全量=每会话 token 预算税；注入的是当时快照 |
| 核查时拉取 | 按需+最新版+零常驻预算 | 依赖席位自觉执行前置核查（纪律性非机制性） |
| **混合（裁）** | **机制保底+按需全文+预算可控** | 两处维护（低——摘要由 digest 管道顺产） |

- **前置核查拉取式（主）**：compass 手册各席「固定前置核查」节加一行 wiki 指针（「开工前读：纪律手册 <org wiki 路径>——重点节随席位域」）——compass 手册=渲染源头件（session-body 前置核查节→渲染），走源侧→管线合规路径，评估批后随渲染窗落；
- **boot 注入摘要级（辅）**：injector 注入「wiki 最近更新摘要」（digest 管道顺产生成——每文档变更一行），非全文；体积可控+新人/复活席有机制性提示；
- **判定依据**：CEO 语义「wiki 加入员工前置核查」=核查动作语义（拉取式正解）；boot 全文注入会把 13 席通用手册变常驻税——与 p2「注入不在热路径」验收锚一致。

## 四、首条线验收锚（联合，供合流）

1. **沉淀结构化率**：inbox 件 100% 经 schema 映射落位（零堆文件——digest 脚本处理日志=证据）；
2. **注入覆盖（本地域）**：sync 扩 org 层后纪律手册进本地域注入摘要级（inject 事件/knowledge_consumption 行为证）；
3. **前置核查生效判据**：compass 前置核查节 wiki 行落位（渲染产物 grep）+至少一次真实开工拉取记录（席自查注记）；
4. **模板合规**：inbox 写入与 wiki 落位 commit 全走首落模板（who/why/区三段）。

## 五、使用依据

命题书五要素+三线交汇（首落批/注入器命题/compass 渲染链）+injector 现役实勘（sync 范围/layer 机制/knowledge_consumption）+p2 四段管道设计（digest-rules.yaml/shallow 零 LLM）+D-29 无窗格式（digest cron 化前置合规）。
