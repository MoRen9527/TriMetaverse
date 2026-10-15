# CTO 派工单 · Q2 反向通道一期施工（FSD）· 2026-10-15

- sourceOfTruth: 本单（trees/fade008-reestimate-20261015/dispatch-q2-phase1-fsd-20261015.md）
- syncMode: static（派工单·候接令回执·D-15 留痕）
- lastSyncedAt: 2026-10-15T18:18:16+08:00（date 现查·写前跑）
- 令源: CEO 18:16 批令四件之④（Q2 一期立项批）→合一卷 §四一期范围钉死（q2-unified-vol-20261015.md@0d5605f05）
- 技术基座: 技术面卷 cto-q2-reverse-channel-tech.md@928288dac（拓扑/白名单/安全定形）+CPO 场景面卷@44e7e7272（红线四条）

## 〇·施工范围（三件·FSD 半天级）

1. **TriMMC 出向队列扩展**（本机 TriMMC 仓→push→sg 换装链·现役先例形）：
   - 现役 outbox/mailbox/ledger 三件基座上加「回声出向队列」语义：写入 API（端点白名单校验入队·载荷 schema 校验·缺三元组入队即拒）+未取队列读 API（鉴权+按消费方取+消账确认）
   - 白名单 env 结构化（`TRIMC_ECHO_TARGETS` 候名·一期单值）；载荷 schema={source_id, ts_machine, ref, text}≤8KB 无 file 字段；ledger 扩 reject/标疑事件型
2. **TriMetaverse `scripts/fade/echo-pull.mjs` 拉取器**（真源位·裁决 A 同源形）：
   - cron 形（每 5min）·ssh BatchMode+ConnectTimeout+X-Internal-Token 鉴权→GET 未取队列→写 TriMLC 信箱（`advisory: true` 字段+落箱第二时戳）→消账确认→失败下节律重试（幂等）·连续 N 节律失败告警（notifyFailures 同族）
3. **TriMLC 收箱侧两处补**（本机 TriMLC 仓）：收箱白名单补拉取器席（SOURCE_SEAT_WHITELIST 同族）+信箱 schema 加 advisory 字段

## 一·技术约束（硬）

- 四红线技术形照技术面卷 §三：≤8KB/无 file 字段/白名单外 403+ledger 留痕/advisory 标+信箱写入与 job 调度零共享面（登记设计注记）/三元组双闸校验。
- **P0-1 教训随行：改 sg 面白名单/换装须断言「改的目录=现役运行位」**（readlink /proc/<pid>/cwd）。
- 值面纪律 D-46：token/白名单值面零进卷零进打印路径（探针只打状态码/指纹）。

## 二·门禁与交付

- 门禁：tsc --noEmit+测试基线+**消费面端到端冒烟**（活体验证族硬门：首信实达 m-cos 信箱+消账断言——构建绿≠运行时通）+负向双探针（白名单外 403 留痕可查/缺三元组双闸标疑可见）。
- 交付：毕报卷落本树+门禁全量读数+git SHA（各仓）+自测就绪态回执——本席验收→STE 门禁复核→COO 排上线窗。
- 回滚姿态：三件各独立 commit（回滚=revert 单件）·TriMMC 换装照现役 dist 备份链形。

## 三·排窗（D-23 对轨声明）

- 工作所属模型=GLM 轨（FSD 同轨）：黄金窗=18:00→次日 14:00——**本单今晚黄金窗内可拾取**；禁排区=工作日 14:00-18:00。
- 自排权=FSD（接令回执面报时点）；本单非 daemon 勘修非不可逆（纯代码三件+测试）——D-23 v3 默认直跑形，TriMMC 换装/sg 段如沾窗控四类（勘修重启/不可逆）则该段单独对窗。
- **注意**：sg 归一窗+token 轮换今晚 19:00-20:00 微窗先行（另单）——若时序撞车，TriMMC 仓相关段候归一窗毕后动（目录归一优先·防双目录施工错位复发）；scripts/fade+TriMLC 两件无撞可先行。

## 使用依据

- CEO 18:16 批令④·合一卷 0d5605f05（§三两裁终裁/§四范围钉死/§五三锚终形）·技术面卷 928288dac·场景面卷 44e7e7272·D-15/D-23/D-46/P0-1 教训。

—— CTO 小狄（落款 date 现查原值 2026-10-15 18:18:16 +0800）·候 FSD 接令回执
