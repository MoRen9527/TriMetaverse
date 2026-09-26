# 3333 事故根因定性件（LG-041 ①）

- date 现查: 2026-09-24 10:5x CST
- sourceOfTruth: 本件（LG-041 事故三件套之一；②watchdog=LG-045 已销 ③兜底架构=bottleneck-architecture-plan.md draft 候 BOD 裁）
- 定性口径: 结构根因为主锚；进程级诱因证据受限如实标注、不编造

## 一、事故链（证据锚）

1. 09-21 深夜–09-22 凌晨：3333（TriModel 配置面服务）不可用——依赖其的会话面消费配置失联（会话起不来）；
2. 09-22 凌晨：CEO 手改 `~/.claude/settings.json` 直连官方端点急救（实证=写入兜底配置的动作本身也过不了 3333，见 §二悖论）；
3. 09-22 00:1x：兜底架构方案件落树（bottleneck-architecture-plan.md，三层 L0/L1/L2）+ TriModel-Watchdog 部署实测；
4. LG-045 销账（09-22）：watchdog 判定面根修+双实例归一，3333 挂≤5 分钟自动复活。

## 二、根因两层定性

### 结构根因（定性成立——本件主锚）

**单点自举悖论**：配置的「写入通道」与「消费通道」同源，都过 3333。后果=3333 挂时：

- 消费面断：会话/席位起不来；
- 写入面也断：恢复所需的兜底配置改不了（CEO 被迫手改实证——而手工路径正是事故中唯一可用通道，事前并无模板化与脚本化）。

即：**恢复动作依赖故障组件自身可用=自举悖论；缺带外（out-of-band）恢复通道是架构缺陷本体**，与当夜进程为何挂相互独立——哪怕进程诱因各异，悖论都在。

### 进程级诱因（证据受限，如实标注）

3333 进程当夜 hang 的底层诱因（内存/依赖/上游 API 等）证据在 BOD 侧事故 transcript 与本机运行态，sg 仓面无进程级日志入档——**不编造，定性为「进程级诱因候 TriModel 侧日志窗核」，不阻塞本收口**：watchdog 已把任意进程级故障的暴露窗压至 ≤5 分钟，结构防线不依赖诱因结论。

## 三、防护现状与待裁防线

- **已落**：TriModel-Watchdog（≤5min 复活；判定面根修+双实例归一=LG-045 七锚销账）。
- **候 BOD 裁**（bottleneck-architecture-plan.md）：L0 `settings.json.known-good` 静态保底模板（零成本立即可落）／L1 `restore-claude-direct.ps1` 独立恢复脚本（低成本，脚本真源化首落件）／L2 last-known 配置自动快照（TriModel 小改候窗，可 YAGNI 裁不做）。三层全不依赖 3333，与 watchdog 构成纵深防御非重复建设。
- **残余风险**：watchdog 与 3333 共因失效（同机断电/磁盘满）——L0 静态模板为最后防线，建议 L0+L1 立即落、L2 候裁。

## 四、结论与销账口径

结构根因定性成立（单点自举悖论+缺带外恢复通道）；进程级诱因候 TriModel 日志窗、不阻塞。LG-041 CTO 侧三件齐：①本件 ②watchdog（LG-045 已销）③兜底架构 draft 呈裁——**CTO 侧收口，候 BOD 裁 L0/L1/L2 落地窗**。

## 使用依据

bottleneck-architecture-plan.md（悖论陈述与三层方案）；LG-045 销账读数（ledger-snapshot）；W39 ledger/task-inventory LG-041 条；事故链事实以方案件 §四与 daily-progress d78e0070 为锚。
