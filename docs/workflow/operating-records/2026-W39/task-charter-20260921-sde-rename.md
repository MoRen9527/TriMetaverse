# 任务书·DE→SDE 正名（高级部署工程师）+ agent-body 旧名走查

- sourceOfTruth: 本件=董事会任务书（CEO 2026-09-21 01:34 令）
- syncMode: closed（BOD 销账 2026-09-21 01:4x）
- lastSyncedAt: 2026-09-21 01:3x
- 上位令: CEO 01:34（小布（DE）改为 SDE 高级部署工程师；所有路由到 DE 的修正为 SDE；走读小布 agent-body，TriDeployer 这类核实语义及定位，需修正删除的及时处理优化）
- 主责: CHO（五件套域+D-13 名册+渲染链）

## 一、正名方案（BOD 定案，CEO 令落格）

| 项 | 旧 | 新 | 备注 |
| --- | --- | --- | --- |
| agent 正名 | DeploymentEngineer | **SDE**（Senior Deployment Engineer，中文=高级部署工程师） | 照 STE（Senior Test Engineer）先例 |
| 角色代号 | TriDeployer（旧退役名，agent-body :7/:26 在岗） | **SDE** | LG-035 漏网位，本轮修正 |
| 工作名 | 小布 | **小布（保留）** | 工作名≠正名，寻址连续性 |
| opsName | m-dee | **m-dee（保留，候 CEO 知会）** | 寻址名改名=今晚全部 SendMessage 通道/名址/回执断链，收益低风险高；BOD 裁保留，CEO 异常可再裁 |

## 二、执行清单

1. **正名族**：frontmatter name/contract role/agent-body 正文 DeploymentEngineer→SDE（source-agents 5 文件内引用全改）；agent-body :7「部署工程师」→「高级部署工程师」、:7/:26 TriDeployer→SDE；
2. **走读核查**（CEO 令走读要求）：DE agent-body 全文逐段核语义定位——ADE 模式描述/部署职责/工作连续性表述的准确性；TriDeployer 类旧名全族扫（Trideployment 9 文件甄别：退役仓历史叙述=冻结不动，活引用=改）；
3. **路由引用修正**：文档/纪律中「路由到 DE」「DE 岗」类活引用→SDE（甄别规则同上：历史冻结不动，活引用改）；
4. **名册联动**：D-13 名册、.claude/seats.json+sg seats-sg.json 的 agent 字段 DeploymentEngineer→SDE（opsName m-dee 不动）；
5. **渲染链**：源侧→发布重渲（攒批节奏：随今日收口批）。

## 三、验收锚

1. frontmatter/contract/agent-body 正名 SDE 统一（TriDeployer 零残留）；
2. agent-body 走读完成：旧名/语义/定位核查报告随回执（含甄别清单：改了什么/为何冻结不动什么）；
3. 名册双端 agent 字段一致；validator 全绿；
4. 路由活引用修正+甄别清单在卷；
5. 渲染攒批随批。

## 四、边界

- m-dee 寻址名、工作名小布、席位会话本体不动；
- Trideployment 退役仓历史叙述冻结（活引用甄别后改）；
- DE→SDE 期间在途工单（如有）由 CHO 对表衔接。

## 五、销账注记（BOD 验收，2026-09-21 01:4x）

五锚全过：①正名统一（SDE+TriDeployer grep=0）②走读报告（ADE/职责/三分法准确无重构+顺手两笔：上岗时点失真/多余空格）③名册双端（本地 seats+D-13 ✓；sg seats-sg.json **BOD 直改毕**——CHO 交接注记销）④Trideployment 甄别定谳：BOD 预勘 9 文件字面命中经语境甄别**全部为历史兼容/历史叙述语义正当保留，零活引用**（BS 兼容入口规则/CTO 历史补查规则×4/publish-flow 历史记录/退役 registry 本体×3+manifest 历史条目+TriTest 系档案）⑤渲染攒批。roster role/displayName 随改：**BOD 裁准 CHO 案**（随首月校准窗一并，避免第三处改名面）。
