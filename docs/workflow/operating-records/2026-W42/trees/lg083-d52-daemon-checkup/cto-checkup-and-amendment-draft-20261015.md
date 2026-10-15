# CTO 检查卷+补全方案稿 · LG-083 · D-52 上线报到制两漏项（daemon 层对接检查）· 2026-10-15

- sourceOfTruth: 本卷（trees/lg083-d52-daemon-checkup/cto-checkup-and-amendment-draft-20261015.md）
- syncMode: static（检查卷+条款增补草案·候批态）
- lastSyncedAt: 2026-10-15T23:18:28+08:00（date 现查·写前跑）
- 令源: CEO 23:03 批件——「上线报到流程漏了 daemon 层面的定时与 job 和 BOD 上线后是否能对接上的检查，一并交 CTO 检查，CPO 复核产品功能设计合理性」（BOD 23:04:10 转呈）·COS 派工（LG-083·销账判据=方案稿呈毕+铸条链处置毕）
- 铸条链: 本卷草案经 COS 链候呈→CAO 主笔铸条（D-48 唯一通道）→BOD 复核批——**本席不直接改纪律册**

## 一·检查结论：两漏项属实（空白实锚）

### 漏项 a：daemon 层「定时与 job」检查缺

D-52 现役条款面（835-857 行逐款对照）全部在**会话面**：报到信（信箱）→CAO 承接→清单回执→「已领+已验」双签→自检句（「自检运行态在位」「session-only 运行态失效的唯一行为面探测」）。**daemon 的 cron job 现势无任何检查项**：

| 检查维度 | 现役 D-52 有无 | 后果 |
| --- | --- | --- |
| daemon healthz（cron.enabled/jobCount/degraded/consecutiveFailures） | ✗ | daemon degraded 报到流程不发现 |
| job 真触发证据（runCount 增长/产物面 mtime 推进） | ✗ | **静默失败全盲**（见下方实证） |
| next_run 值面在位 | ✗ | job 悬空（enabled 但永不触发）不发现 |
| cron 子进程执行身份/权限面 | ✗ | EACCES 类静默不发现 |

**今晚实证佐证（本席 LG-082 件①施工三折·全数是会话面自检盲区）**：①F-3 家族性——add 201/`ran:true` 均系**受理回执非执行回执**（jsonl 不涨才抓出）；②cron 子进程 EACCES——hub-watch/ 目录 root 属主，daemon=fleet 用户静默无写权（修 chown 后才落拍）；③next_run 值面悬空风险（enabled=True 但调度不推进=零报错零信号）。**结论：报到流程若只在会话面自检，daemon 层这三类失败全部漏检——CEO 指认属实。**

### 漏项 b：BOD 上线后与 daemon 对接检查缺

D-52 对 BOD（唯一非人格常驻席·立规三件套②载）只覆盖「报到信→CAO 承接」会话链。BOD 例行工作形态=「daemon 拍+BOD 读+BOD 转」（CEO 22:46 原话）——**BOD 复活后「读」这半边链路（读 daemon 快照/信箱/巡检 API 是否真通）无检查项**。今晚 LG-082 件①试点落地了「存+补读」的物（`/srv/fleet/var/hub-watch/latest.json`·BOD/COS 补读单文件追平），但「复活后必须验证读链」未成条款。

## 二·补全方案稿（D-52 条款增补草案·CAO 主笔素材形）

### 增补款 A·daemon 层上线对接检查（会话报到+守护读数两层）

> 非人格类 agent 报到承接时，及席位自检句周期自检时，**追加 daemon 层对接检查**：
> 1. 本域 daemon healthz 四字段读数（cron.enabled / jobCount / degraded / consecutiveFailures）；
> 2. 关联 job **真触发证据**：产物面 mtime 在 N 个节律周期内推进，或 runCount 增长——**禁以 201/ran:true 受理回执为凭**（F-3 家族性·2026-10-15 实锚）；
> 3. next_run 值面在位（非空非悬空）。
> 判据：degraded=false ∧ consecutiveFailures=0 ∧ 产物面新鲜=对接绿；任一红=报到闭环挂「daemon 异常」标注转 CTO 面（技术域单点处置）。检查**程序化**（D-55 ①层：读数+比较全程序跑，脚本输出单行 JSON 读数单·禁手推）——脚本正形由 CTO 面交付（`onboard-daemon-check.sh` 族·候批后施工）。

### 增补款 B·BOD 复活 daemon 读链检查+补读义务

> BOD 报到闭环后追加一步**daemon 读链验证**：读 daemon 快照面（LG-082 试点形：sg `/srv/fleet/var/hub-watch/latest.json`+8712/8713 healthz）——读数非空 ∧ 快照时戳距末拍 ≤2 个节律周期=读链绿；快照不存在或时戳陈旧=**daemon 层失守信号**（D-52「失守信号候补」条款的触发实例·转 CTO 面）。
> BOD 复活首回合**补读义务**：读 latest.json 追平断档期（断档期零信息丢失的读端兑现）—— LG-082 试点「存」端的自然配对。

### 配套说明

- **阈值归属**：检查判据具体数值（节律周期 N·新鲜窗）归 CTO 面条目（D-52 失守信号条款已留对轨接口·本方案即接口兑现）——条款只载检查义务与判据形态，数值不入纪律册（防数值变更须动册）。
- **与既有条款正交**：行为面（报到链）不动，本增补只加 daemon 层读数检查面——「机械面治复活失败·行为面治配置丢失·本款治**daemon 对接失守**」三层正交。
- **CPO 复核面（件④并行）**：本方案涉「上线报到产品功能设计」的 daemon 层扩面——四 daemon 与 BOD 及报到链的产品合理性复核归 CPO（CEO 批件原话），本卷只供技术检查面素材。

## 三·候批态与后续

- 本卷=检查毕+草案毕·候 COS 链呈→BOD→CAO 铸条——批前零施工（检查脚本不动手）。
- 批后施工序（本席）：①onboard-daemon-check.sh 正形（四 daemon 参数化·输出单行 JSON）②接入 CAO 承接面与自检句流程（CAO 面配合）③BOD 读链检查挂报到闭环尾步。
- 时点：不抢冻结带·候批窗自然流转。

## 使用依据

- D-52 正身（engineering-disciplines.md 835-857 行·2026-10-14 CEO 14:24 签批版）逐款对照；
- 今晚实证：LG-082 件①施工三折（F-3 受理≠执行/EACCES 静默/next_run 悬空风险——评估卷 d54b65f43+施工毕报 23:17 信面）；
- LG-082 试点物：hub-watch-snapshot job+latest.json 补读形（全链真通 4 拍实锚）；
- D-55（检查程序化判据）·D-54 款3（消费面四层——job 真触发证据面同源）。

—— CTO 小狄（落款 date 现查原值 2026-10-15 23:18:28 +0800）
