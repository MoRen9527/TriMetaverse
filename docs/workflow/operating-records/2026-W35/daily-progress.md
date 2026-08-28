# W35 每日工作进度（仓库级粗粒度恢复兜底）

> sourceOfTruth: 本文件（周平面维护项，FADE-001 承接）｜维护方：董事会/董事长助理每日更新｜粒度：粗（日级战役/挂账/锚点）
> 定位：`.fade/hub-snapshots/`（机器本地）全灭时的**最后恢复防线**——本文件随 git 推送三端（本地/sg-bare/GitHub），机器丢了它还在。
> 细粒度恢复链见 `docs/execution/fade-007-context-reservoir-spec.md` §五。

---

## 2026-08-28（周五）

**已完成战役/里程碑**：
1. P0 审计修复战役 9/9 收口（p0fix1-4：agent-core 权限引擎 4 + TriRMC 服务面 2 + TriLC HTTP 三通道 + TriModel 流式 fallback；fa​bcbeb/14499e5/95d8713 系）
2. FADE-006 升格完整实例标准档（首评 80 冻结+增评 91 PASS；映射表+纸面法清单+细则 10 正式化；spec v2.0.3 @ecd922b、registry v2.1）
3. 发布域扩容：TriMetaverse CLAUDE.md/AGENTS.md 真源归位 TriCompany（published-copy 双条目，跨端一致）
4. 分权制更名立法：董事会/董事长助理（CLAUDE.md 995bd161）
5. 四面 key 分发完成（tmv-mm/ml/rm/rl-face）+ LG-001 双 key 结案（255dc140 保留接力候选/bef0e848 已吊销）
6. heyuan 验收窗：四仓归一统一 dev 线（TriLC ff2f970/TriModel 30a671e/TriRMC f09b633）
7. LG-011 巡检兜底落地：daily_progress_patrol.py v1.0（TriCompany fbadf21/bfad13f，内置自测 21/21）+ trimc cron job d0f87756-e941-4984-9919-1993028566bc 注册（*/10 分钟 Asia/Shanghai，runAs fleet，nextRun 20:10 +08）——「事件驱动主+10 分钟兜底」节奏上线（49287fc 节奏重设计承接，最坏丢失窗口 23h→10min）
8. LG-011 首次接线核验 PASS（20:3x 销账）：巡检三跳实测——20:10 首跳 2014ef40（真实门限开，误标节容错识别）→20:20 skip 实测抓出门限同秒缺陷→修复 3082d7d 拓扑门限→20:30 三跳 c9300421 精确补写 marker 8ad1ab4a（20:30:06 检出，6 秒闭环）；本销账行即事件驱动主第二次执行
9. LG-012 TriMC cron CLI 补 X-Internal-Token 头（当日闭环销账）：TriMC 1d28d13（src/internal-token.ts 新模块：env→docker/.env 兜底+CLI 接线，全套 555 测试过）；实测=HTTP 无头 401/CLI 兜底 list 200/add-remove 探针全链/restart 后 jobCount=5；restart 触发 TriModel dist 丢失潜伏损坏→重建修复（非本提交，21:08-21:11 崩循环如实入账）；D-02 四 job nextRun 逐位不变
10. FADE-007 升格联审备料交付（07e44962）：docs/execution/fade-007-upgrade-review.md——十段映射草案（诚实档位：已实测 1/部分 6/纸面 4）+试卷草案 T1-T8 双门槛建议 85+缺口 10 项+实证 6 项（邻域学费如实标注）+裁决议程 8 项；建议=分档升兼容档不跳档（Score 双段未实跑不自违细则 10）；细则 10 对组织者自身适用+利益声明（双席抽验提请）
11. FADE-007 兼容档升格落地（联审修后放行执行，双席共识+主持人合成）：spec 立法包 509ec99d（§6.4 条目在册+§五模板对齐实产八节基座+状态=FADE 兼容档+五条硬门时序锁死+利益声明在册义务+Close CLI (c)+(a)+第 11 缺口）+hub-snapshot-diff.py f902cd2b（一具两段：自测 15/15；验收=真实两代 0330Z/1510Z pass 39 条集差素材+合成篡改 rc1 守恒合账）+E-3 冻结卷备妥 67cbdecb（T1-T8 权重 100/双门槛必选全过+85/双席抽验义务/冻结程序 _fadehash 双 hash）——升完整剩余：E-3 真实压缩事件→E-4 清空过渡→评分达标入登记册

**现役挂账**（台账权威=董事长助理侧 ledger-mirror，本处为粗粒度镜像）：
- LG-002 残余：TriCade UI 首条消息终验（CEO 随手）
- LG-005 harvest-rc 首轮生产观测（下个 M 面 spawn 后查 registry rc_source）
- LG-006 TriModel 多模型额度接力立项（设计+实现待排期）
- LG-007 FADE-003 裁决词表升四态（下次周检）+ FADE-003 降档兼容档待补课（Score 双段等五项）
- LG-010 agent-core 加载层补齐（R 面能力门禁线，宿主治理面全盲修复）
- 旧 key 255dc140 保留（额度接力候选）；TriPilot 0.0.12 来源甄别通过（a23d2a0 已推）

**恢复指针**：
- 细粒度：`.fade/hub-snapshots/`（board-journal/ledger-mirror/full-1510Z——机器本地）
- 治理：fade-protocol-spec v2.0.3 + fade-registry v2.1（TriCompany @2a6af9d）+ fade-007 spec（@7290bf31 系）
- 中枢：xiaojia-hub-r2（重建代际，五源配方=fade-007 §五）
- 巡检兜底补写 @20:10 +08：自上次进度提交 17a4af84 后新增 1 条 commit：
  - 83753b74 docs(fade-007): 恢复配方补第 6 源——周平面每日进度(仓库级粗粒度兜底,FADE-001 扩维承接)
- registry：v2.1；今日 registry 提交 8 条：49287fc docs(registry): FADE-001 维护项②节奏重设计——事件驱动主(助理增量即写)+10 分钟巡检兜底(TriMC cron),单写者原则；最坏丢失窗口 23h→10min(CEO 纠正:第六源是恢复兜底不是日总结)；ea64927 docs(registry): FADE-001 维护项②每日工作进度——十段设计注册(runtime-owned durable profile,探索期手动/自动化期 cron 脚本两阶段)；ecd922b docs(fade): LG-008 联审落地——spec v2.0.3 试卷 Plan 时点冻结立法；registry v2.1 FADE-006 升格标准档+十段映射表首行填制；3d1c45a docs(registry): FADE-003 降档标注 FADE 兼容档——逐段对照 Score 双段缺失/触发手动化/终态两态(CEO 判定成立)；升完整实例路线五项(评分 CLI/Skill/RETRY/触发/词表)；87f16cd docs(fade): v2.0.2 LG-004 联审定级落地——细则 10 升正式(修正1清单齿条/修正2不溯及/第三判例)；FADE-006 补评 C 口径双轨(首评80冻结+增评91 PASS,卷封8/8两分支闭环+节点报告7/8弧线如实)；R-C6 销账/R-C4 登记/纸面法清单节开张/§九§十恢复（另 3 条略）
- 巡检兜底补写 @20:30 +08：自上次进度提交 cea46cdb 后新增 1 条 commit：
  - 8ad1ab4a docs(fade-007): 运行日志补 LG-011 巡检兜底上线行——兼作巡检门限核验 marker
- registry：v2.1；今日 registry 提交 8 条：49287fc docs(registry): FADE-001 维护项②节奏重设计——事件驱动主(助理增量即写)+10 分钟巡检兜底(TriMC cron),单写者原则；最坏丢失窗口 23h→10min(CEO 纠正:第六源是恢复兜底不是日总结)；ea64927 docs(registry): FADE-001 维护项②每日工作进度——十段设计注册(runtime-owned durable profile,探索期手动/自动化期 cron 脚本两阶段)；ecd922b docs(fade): LG-008 联审落地——spec v2.0.3 试卷 Plan 时点冻结立法；registry v2.1 FADE-006 升格标准档+十段映射表首行填制；3d1c45a docs(registry): FADE-003 降档标注 FADE 兼容档——逐段对照 Score 双段缺失/触发手动化/终态两态(CEO 判定成立)；升完整实例路线五项(评分 CLI/Skill/RETRY/触发/词表)；87f16cd docs(fade): v2.0.2 LG-004 联审定级落地——细则 10 升正式(修正1清单齿条/修正2不溯及/第三判例)；FADE-006 补评 C 口径双轨(首评80冻结+增评91 PASS,卷封8/8两分支闭环+节点报告7/8弧线如实)；R-C6 销账/R-C4 登记/纸面法清单节开张/§九§十恢复（另 3 条略）
