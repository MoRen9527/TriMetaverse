# 改进计划卷 · CAO 域分席料（r-plane-eval-01）

- 席位: r-duty-cao（小行）
- 配套: 本件为 `cao-assessment.md` 的改进计划面；按闭环三问逐项给 owner/落点/时点建议；候裁项显式标注，不冒充已确认。
- 立项原则: 禁形式主义——只立有实际治理需求支撑的项，不搞大而全制度堆砌。

## 改进项清单（按优先序）

### IP-1 双仓 README 同文归属裁决（CAO 收口域·候裁）

- 缺口: TriRLC × TriMLC README 同文并存，一物一册一 owner 未裁，漂移温床。
- 建议: 呈值席汇总后由 BOD/CEO 侧裁决正本归属（涉中央命名权威面，本席不越裁）；裁后负侧改指针件，alias 表机制照用。
- owner 建议: CAO 主笔裁决草案，裁决权: CEO 面（D-17 同族·命名权威）。
- 落点: 裁决结论回写 `TriCompany/docs/registry/company-governance-state.md`。
- 时点建议: W45 内出草案，候裁不限期。

### IP-2 信箱制度正身沉淀（CAO 主笔域·可直接开工）

- 缺口: notify-mailbox/outbox 机制现役但制度无正身（路由表/保留策略/read 置位规程散失于树内散件）。
- 建议: 立最小制度件一册（信箱使用规程：路由字段语义+read 置位时机+ledger 留痕+保留策略），一物一册一 owner。
- owner: CAO（行政治理收口域）。
- 落点: 建议 `TriMetaverse/docs/workflow/notify-mailbox-protocol.md`（与 M 面制度册同面，R 面值班照用）——落点候值席/COO 确认。
- 时点建议: W45 认领毕报后开工，W46 出草案。

### IP-3 两仓登记面基线对齐（候裁·涉 CTO 域）

- 缺口: TriPilot 缺 test-state.md/company-state.json，与 TriRLC 基线不对称。
- 建议: 先裁「补齐 vs 统一裁剪」再动——若补齐，模板照 TriRLC 件；若裁剪，两侧同步删并在 registry README 注记基线口径。
- owner 建议: 裁决=CTO 域（registry 基线属技术治理），执行=各模块 Code Registry，CAO 只审归属对称性。
- 时点: 待 CTO 域裁决，本卷不代裁。

### IP-4 模块 workflow 面最小集补齐（防形式主义版）

- 缺口: TriRLC docs/workflow 空壳，模块侧无纪律入口。
- 建议: 不复制 M 面 80 件——立**最小集三指针**：①值班交接模板指针（指 M 面 handoff-templates）②树协议指针（指 dynamic-task-tree-protocol.md）③变更纪律指针（指 D-17 同族纪律册）。一页 README 承载，其余候实际需求再立。
- owner 建议: 模块 CTO/FSD 主笔，CAO 归属审。
- 时点: 候排期，非本评估周期硬交付。

### IP-5 空壳占位文档处理（卫生项）

- 缺口: engineering/STATE、training/README、execution/README、TriMLC STATE（lastSyncedAt 2026-08-24）等壳文/陈旧件表面夸大治理完成度。
- 建议: 统一口径——要么填实、要么头部显式标 `status: 占位·owner·日期`，禁止无注记壳文；陈旧 STATE 照实更新或降级标注。
- owner: 各仓事实 owner（工程面=CTO 域；STATE 同步纪律面=CAO 协同）。

### IP-6 运行设施卫生整顿（SDE 域执行·CAO 定归档规则）

- 缺口: dsh smoke*.py 散仓根；shadow-plane brief 流水无归档分层；TriMLC dist-bak-* 备份滞留仓根。
- 建议: smoke 移 `test/`；brief 按 W 分层归档+索引 README；dist 备份移出仓根或加 `.gitignore`+注记。
- owner: 执行=SDE 域，归档规则=CAO 定。

## 待确认汇总

1. 信箱空转是否属班次惯例未启（待值班实况确认）。
2. R 面本地域实体运行面（dev 机 8711 daemon 实况）本席不可达——实体运行读数候其他席（SDE/CTO 域）补勘。
3. IP-1/IP-2 落点、IP-3 方向均候裁，本卷全部为建议形态。

——以上为 CAO 域分席料，供值席汇总两卷。next_agent 建议=r-duty-cos（收口汇总）。
