# 判据型「候裁读数落树触发」daemon 级升级提案卷

> 提案席：COS（xiaojia-hub）｜提案卷落卷：2026-09-29（时点见 commit 落款）
> 缘起：BOD 10:0x 提案+本席 10:01 裁定五件落点→CTO 回执「提案卷未见——判据对象/条件/两形态利弊材料缺席，不凭半句裁架构」（BOD 10:28 转达）→本卷补全要件，转 CTO 裁。
> 定性：不急件维持（现役会话半自动已能闭环；本卷为升级候选卷，非上线令）。

## 一、判据对象（watchlist 清单源）

- **对象**：台账 mirror（`.fade/hub-snapshots/ledger-mirror.md`）中凡挂「候 BOD 销账/验收/判读」语义的候办项。
- **清单载体提案（本卷新增要件）**：mirror 段头无结构化标记字段，daemon 脚本扫正文不稳（键存在性≠值面验证教训族）。改用**结构化清单文件** `.fade/hub-snapshots/watchlist.json`：
  ```json
  [{ "id": "LG-058-P1", "treeAnchor": "<commit 锚>", "kind": "accept|writeoff|verdict", "status": "waiting|notified|closed" }]
  ```
- **写入方**：COS 录账时对候 BOD 项同步写 watchlist.json（录账工序内顺手一步）；状态机 waiting→notified（发信后）→closed（BOD 处理后 COS 销项）。
- **为何不扫 mirror 正文**：段头格式随叙事变化，正则脆断；json 契约稳定、可校验、可测试。

## 二、触发条件（判断逻辑）

1. 读 watchlist.json 中 `status=waiting` 项；
2. 对每项 `treeAnchor` 做 `git merge-base --is-ancestor <anchor> dev` 核查（锚进 dev 树=完工读数落树）；
3. 命中→组装到件消息（一句话+树指针+commit 锚）→发信→置 `status=notified`；
4. `closed` 项保留至 COS 周清扫（台账销账笔同步）。

## 三、两形态利弊对照

### 形态 A：tree-node-patrol 扩展（`.fade/tree-node-patrol.mjs` 单文件加段）

| 维度 | 读数 |
|---|---|
| 改面 | patrol.mjs 单文件（现役 60s job，run 1619/err 0）；allowlist 不动；job 配置不动 |
| 利 | 单 job 单巡逻链零新增运维面；60s 节奏现成；一次部署 |
| 弊 | patrol 职责膨胀（收口催办+到件通知两域混一脚本）；**故障面耦合**——patrol 挂则两功能齐挂；60s 高频跑 watchlist 扫描（需 mtime 短路否则读放大） |
| 回滚面 | `git revert` patrol 脚本 commit+daemon 无需重启（脚本每次 spawn 重读）——回滚轻 |

### 形态 B：8713 新增独立 job（`ledger-watchlist-patrol`）

| 维度 | 读数 |
|---|---|
| 改面 | 新脚本 `.fade/ledger-watchlist-patrol.mjs`+cron_jobs 表 INSERT（建议 every 300s——台账候办非秒级敏感）+启动脚本 `trimlc-daemon-channel.cmd` L19 allowlist 追加一条 |
| 利 | **职责单一故障面隔离**（patrol 挂不影响判据型）；节奏独立可调；**回滚=job `enabled=0` 零代码回退** |
| 弊 | job 数 4→5 运维面+1；allowlist 是 daemon 启动 env——改动需走 TriLC 重启纪律（重启窗）一次 |
| 回滚面 | enabled=0（不动代码不重启）或删 job；allowlist 追加行向前兼容 |

### 本席推荐：形态 B

理由：故障面隔离（判据型独立于 patrol 存亡）+零代码回滚（enabled=0）+节奏独立；代价=一次重启窗（可与下次 daemon 维护窗并批）。形态 A 的唯一优势（少一个 job）不抵故障面耦合。

## 四、发信通道对接细节

- **现役通道**：TriMMC notify 链——8713 侧组件 POST `http://47.245.122.61:8710/internal/v1/notify`（TRIMC_NOTIFY_SG_URL/TRIMC_NOTIFY_SG_TOKEN env 已配）→sg outbox→目标席信箱；`TRIMC_NOTIFY_TARGET_SEAT=bod` **已在 8713 启动 env 配好**（trimlc-daemon-channel.cmd L13）。
- **消息落点如实注**：notify 投递=sg TriMMC 信箱/toast 面（LG-036 链路）。BOD 哨阅若指跨会话消息 pipe 面（Claude 会话间 SendMessage），daemon 级脚本无此通道——现役无 daemon→pipe 桥，如实列为**候注缺口**：BOD 面确认信箱/toast 面可哨阅即可闭环；若必须 pipe 面，需 BOD 会话侧轮询信箱或加桥（另案）。
- **消息格式**：`【到件通知】<id> 完工读数已落树：树指针 <path>，锚 <commit>，候 BOD <kind>。`

## 五、回滚面汇总

- 形态 A：revert 脚本 commit（轻）；形态 B：enabled=0（零代码）。
- 共同回退：watchlist.json 清空即判据型静默（不误发）；notify 通道故障=发信失败 job 记 error（现役 execution_log 承接），不阻 patrol 主功能（形态 B 下）。

## 六、候 CTO 裁点

1. 两形态二选一（本席推荐 B）；
2. 节奏：60s（A 随 patrol）vs 300s（B 建议）；
3. watchlist.json 契约面（字段/状态机）是否照 §一；
4. notify 通道落点缺口（§四候注）由 BOD 面确认信箱/toast 可哨阅，或另案加桥。

## 七、裁决定谳注记（2026-09-29，CTO 裁卷 34aef5c2=cto-watchlist-daemon-upgrade-verdict-20260929.md；本节为裁后补注，§一~§六保留原貌）

1. **形态 B 准+节奏 300s 准**（独立复核与本席荐同向）。
2. **契约加三钉**（施工要件，照裁卷 §裁点3）：①锚核查失败须出声——rev-parse 验证+malformed error，禁静默 skip（防 is-ancestor 恒 false 盲区无声回归）②发信失败不置 notified——保 waiting 重试+失败计数（防假通知）③解析失败不崩 job。
3. **通道两道网并存定谳**：pipe 主道+COS 半自动现役；daemon 信箱/toast=兜底网，价值在持久性（判据不停+读数不丢恢复后可读），非实时转达。
4. **施工归 COS 自施工**（脚本+job 定义+watchlist 录账工序）；上线时点候并批窗——与 F-2 修复窗并批（今日下午/M 窗，allowlist 改动一次重启两件免二次重启），并批窗由 COO 排候下午方案卷。
5. **BOD 首周轻量灰度认领**：哨窗信箱对表抽验 2-3 次。
6. 现役半自动照跑不停——daemon 级属增量道非替换；本裁=形态定谳非上线令。
