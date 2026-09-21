# p2 首条实证线·联审评估合流件（CPO 产品线×CTO 技术线）

- sourceOfTruth: 本件（双栏合流正身；候 CEO 审批——评估阶段不动现役结构）
- syncMode: draft（双签后呈批）
- lastSyncedAt: 2026-09-21T23:35+0800
- 拼稿: CPO（小乔，督办问询中自认领——断点即时消除）；counter-sign: CTO（小狄）
- 输入件: 命题书 task-charter-20260920-inbox-wiki-first-line+追加命题（宿主资产命名）+CPO 件 cpo-view.md（5b10a18b+bfb4aa2f）+CTO 两件（cto-tech-view.md/host-assets-rename-cto-view.md）
- 冲突裁记两处: ①读取时机——裁 CTO 混合案（拉取为主+boot 摘要辅），CPO §四修正（token 预算论证与本席体积预算纪律自洽，本席自修）②改名执行形态——裁 CTO 渐进 junction 制，CPO §六 单批双段修正（250 文件量级下 junction=compass 先例成熟路径）

---

## 一、管道实现（CTO 线要点录）

三段最小闭环：①inbox 写入端（frontmatter 两键 section/type 带分类意图=零 LLM 前提，模板入 source-template.md）②schema 映射端（digest-rules.yaml p2 首版：type=discipline→手册对应节/type=experience→席经验页；shallow 执行体=digest-inbox.mjs 脚本+手动/cron 起步，daemon 候稳定）③wiki 落位端（手册=org 层 discipline-handbook.md；经验=席级 experience.md；写入走首落 commit 模板）。技术前置：**sync 扩 org 层读取**（现役 injector sync 范围外——本线管道实现的一部分，注入接线前提件）。

## 二、两域注入配置（分步裁）

本地域=TriMLC 现役注入+sync 扩 org 层后注纪律手册（contentRoot/tag 过滤承载分域，零架构改动）；服务域=**首条线走拉取式**（运维内容落 wiki+前置核查指针按需读），注入式候注入器命题批后升级——**分步合规：服务域有内容可读+不阻塞在注入器命题**。

## 三、wiki 读取时机（冲突裁记：混合案）

| 方案 | 判 |
| --- | --- |
| boot 注入全文 | 否——13 席通用手册=每会话常驻 token 税（违 p2「注入不在热路径」锚），注入的是当时快照 |
| 核查时拉取 | 依赖纪律性非机制性（单用不足） |
| **混合（裁）** | **前置核查拉取式为主（compass 指针行，源侧→管线合规路径）+boot 注入摘要级辅助（digest 顺产「每文档变更一行」，体积可控+新人/复活席机制性提示）** |

CPO 自修声明：我 §四「boot 注入为主」与自立体积预算纪律冲突，CTO 论证成立采认——CEO「wiki 加入前置核查」语义=核查动作语义，拉取式正解。

## 四、CPO 产品线四件要点录

①纪律手册大纲 v1 列全（五节生命周期序 0-4，13+ 条目；员工视角一句话+指回 D-xxx 条目号=索引非复制；节固定条可增走升格门）；**落点裁=knowledge/org/ 组织知识库首件**。②经验总结裁两件：手册单页+经验库（索引页+分席页——两域分注取材天然成立）。③schema：inbox 三新键（sourceType/outlineSlot/domain）+page-specs 两条；**大纲位必填缺位 reject 记日志（p2 reject 阀门首实证）**；复现信号（同主题≥3 源或点名）→promotion 升手册；质量指标=覆盖率/归位率/reject 率。④前置核查衔接：按 §三混合案落（compass 指针行+boot 摘要——原「boot 为主」废止）。

## 五、宿主资产命名追加命题（独立决策节，两席一致）

- **正名应做**（三面：持续性教学税/四层模型本义/终止再改名周期）；**正名候选=TriCompany-host-assets**（CPO 裁：去宿主定语最彻底；字面 x 不推荐；multi-host 冗余——CTO 注：三候选迁移工程无差，纯命名取舍，**最终名归 CPO/CEO**）。
- **迁移工程实勘**：~250 文件引用面（含三 daemon 仓 5 处 env 硬编码=改后不重启静默失败风险位）+渲染产物 27 件重渲窗。
- **窗口关系（两席一致）：迁移先行于首条线上线**——首条线全部 artifacts 落该树内，先上线后迁移=模板/教程/frontmatter 全返工；先行=一次写新名零返工，且窗口天然错开（首条线候批中，迁移窗可先行）。
- **执行形态（裁 CTO 渐进 junction 制）**：compass 改名正身先例步序（管线+代码批→git mv+junction+.gitignore→渲染窗→文档随窗→触发式终点三条件齐删别名）；CPO §六 单批双段修正采认（250 文件量级下渐进断链风险=零 vs 单窗巨型断链不可见）。
- **决策序建议**：命名定案→迁移批（先行窗）→首条线实跑（落新名）；若 CEO 判迁移不急，首条线可按现名先跑（路径引用集中 digest-rules+compass 指针两处，二次改成本可控）——两案都通，差异在返工量。

## 六、联合验收锚（合并）

1. 沉淀结构化率：inbox 件 100% 经 schema 落位（digest 处理日志=证据）；
2. 注入覆盖（本地域）：sync 扩 org 层后手册进注入摘要级（inject 事件行为证）；
3. 前置核查生效：compass 指针行落位（渲染产物 grep）+至少一次真实开工拉取记录；
4. 模板合规：inbox 写入与 wiki 落位 commit 全走首落模板（who/why/区）；
5. 大纲列全+节固定（CPO 件 §一 v1 基线，条增量走升格门）；
6. 密钥零入源+reject 日志在（schema 阀门实证）。

## 七、双签区

- CPO 拼稿签认：小乔（2026-09-21 23:3x+0800 date 现查——两处冲突裁记经自修确认，产品线四件与技术线咬合无剩余分歧）
- CTO counter-sign：小狄（**counter-sign 2026-09-21 23:2x+0800 date 现查**——验读：技术线三段（管道三段/两域分步/读取混合裁）全量承继无损 ✓；两处冲突裁记与我件立场一致（混合案胜=CPO 自修采认、渐进 junction 制=我的正身先例案）；命名独立决策节两席一致确认（正名应做+TriCompany-host-assets 候选+迁移先行+渐进 junction；「最终名归 CPO/CEO」我的注记照录 ✓）；联合验收锚六条=我四+CPO 五合并去重 ✓。零剩余分歧）

三签流程位：双签齐→呈 CEO 候批（与宿主资产命名独立决策节一并）。批后实施：迁移批（先行窗）→首条线实跑。


## CEO 批（2026-09-21 23:56，附两条精化）

方案批准。精化两条：

①**管道三端，wiki 不同岗位有自己的 wiki**（知识体系，一开始是大纲，由 schema 按规则+**岗位 agent 理解消化**，按大纲写入 wiki，形成知识体系）——注：消化含岗位 agent 理解环节（非纯机械映射）。

②**两域都需要开发作业、运维部署的纪律和经验**——两域不分内容隔离，纪律和经验两类内容两域都注入。
