# BOD 巡查职责立法·CTO 技术面立场件

- sourceOfTruth: TriMetaverse/docs/execution/bod-patrol-cto-position.md
- syncMode: draft｜lastSyncedAt: 2026-09-09
- 性质：CPO+CTO+COS 三席联审，候 CEO 终裁（技术架构面 CTO 主笔）

## 五必答（技术面）

### ① 检测机制三案对比

| 案 | 机制 | 优点 | 缺点 | 成本 |
| --- | --- | --- | --- | --- |
| A daemon watcher | inotify/事件驱动监听 transcript mtime/树 pending 变化 | 实时秒级发现 | 需 daemon 常驻+跨机部署（TriMLC 8713 P3 实装前置） | 中（P3 TriMLC watcher 复用） |
| B transcript mtime 轮询 | cron */30 脚本扫各席 transcript mtime 增长率 | **零 token 零 daemon 依赖**，cron 现成，20 行脚本 | 分钟级延迟（*/30 周期界） | **极低**（COS P0 方案） |
| C 树 pending 超时 | tree-op.json 增 timeout/watermark 字段+patrol 同窗扫 | 与 FADE-006 契约天然整合 | 需改 tree-op schema（FADE-006 契约变更候裁） | 低 |

**推荐=B 起步（P0）+A 演进（P3 TriMLC watcher 实装后升级）+C 联动（FADE-006 契约变更另批）**——B 零成本即时可部署，A 候 P3 基建到位后自然升级，C 候 FADE-006 契约修编另批。三案互补不冲突（B=兜底轮询/A=实时事件/C=契约化）。

### ② idle 判定阈值

**双窗确认+豁免申报**：
- 短窗 5min transcript mtime 零增长 + 长窗 30min 零增长 = **双条件同时满足**才标 idle（单条件=噪音不计）；
- **长任务思考期豁免**：①预申报工期（席位在树区/台账预注「 thinking 预计 N min」→巡查脚本读注记豁免该席至 N min 超时）②claude TUI "thinking" 态检测（pane 内容 grep「thinking/crunched」——纯文本 grep 零 token）；③**自动化续上判据**：idle 超 2× 预申报工期→升级 ALERT（false positive 降级=催办改提醒）。
- false positive 控制=debounce（连续 ≥3 周期同对象 idle 才报——DNP-1 patrol 同款 `连续≥3周期 ALARM 方转真件` 先例直用）。

### ③ 催办链自动化度

**自动化=检测+记录+可视化；催办不自动化**：
- L1 机械层（*/30 cron 脚本）：自动发现 idle→自动写 ALERT→自动记入 patrol 报告（零 token）；
- L2 BOD 抽验层：BOD 读 patrol 报告→决定催办（人工判断——防误催正确思考期）；
- L3 自报层：席位自主报状态（主动补充非被动受查）。
- **催办自动化=否**：自动催=可能打断正确思考期（false positive 代价=打断正确工作>漏检延迟发现），催办保留人工判断。

### ④ 树协议/FADE 整合

- FADE-006 tree-op.json 可增 `timeout_minutes` 字段（每节点可配超时）——patrol 同窗扫树 pending 超时（C 案联动，FADE-006 契约变更候裁另批）；
- FADE-001 patrol 已有 DNP-1 巡检管线——**B 案脚本可挂 patrol 同窗**（复用 cron 基建+日志+ALARM 分级机制）——零新管线；
- 三线关系=patrol（FADE-001 巡检兜底）+TriMLC watcher（LG-033 事件驱动）+BOD 巡查（断链检测）——**三线各司不重叠**：patrol=hub 巡检兜底/watcher=蓄水池事件/BOD 巡查=席位断链。

### ⑤ 与 M-005/3.6 关系

- **M-005 值班位双位体系**（LG-033）：值班位=主动工作面，BOD 巡查=被动监控面——互为补充（值班位自主工作+巡查兜底监控）；
- **3.6 CPO 三步边界**：巡查机制是值班位自主维护的子集（值班位=止损+记录+升级，巡查=断链检测+催办）——两套正交不冲突；
- **PTW 树（巡检第六对象）**：LG-033 P3 TriMLC watcher 实装后自动覆盖（事件驱动值班侧机械检测）——本提案 B 案 cron 轮询=P3 前过渡方案，P3 后自然升格为 A 案事件驱动。**不重复建设**：B 案脚本报废预期=P3 实装后归档（零成本报废）。

## 四约束

| 约束 | 达成 |
| --- | --- |
| 零 token 优先 | ✓ L1 机械层全零 token（B 案 20 行脚本+A 案 inotify 零 LLM） |
| 检测不烧模型 | ✓ 脚本/cron 零 LLM 调用 |
| 与三型谱系不重复 | ✓ patrol（FADE-001 巡检兜底）+TriMLC watcher（LG-033 事件驱动）+BOD 巡查（断链检测）三线各司 |
| false positive 控制 | ✓ 双窗确认+debounce ≥3 周期+长任务预申报豁免+催办人工判断 |

## 与 COS 立场文件接口

- COS 混合分层 L1/L2/L3 与本席五必答③三层完全吻合（L1 机械=本席推荐 B 案/L2 BOD 抽验=本席催办不自动化/L3 自报=本席长任务豁免申报）——零分歧；
- COS P0 方案（transcript mtime 台账脚本零 token */30）=本席推荐 B 案直接引用——**零修改可部署**；
- 「应做工作面×席位静默」交集判据与本席双窗确认+debounce 互补（交集定「应做但没做」，双窗定「确实没做」——两重过滤 false positive）；
- 接口注意=PTW 树+P3 TriMLC watcher 不重复建设（本提案 B 案=P3 前过渡，P3 后升格 A 案）。

## 建议决议

1. P0=B 案立即部署（transcript mtime 台账脚本零 token */30 cron）；
2. P1=双窗确认+debounce 参数调优（P0 跑两周后根据 false positive 率调参）；
3. P2=C 案 FADE-006 契约变更（tree-op timeout 字段）另批；
4. P3=A 案 TriMLC watcher 升格（LG-033 P3 实装后 B→A 平滑升级）；
5. 催办自动化=否（维持人工判断）。
