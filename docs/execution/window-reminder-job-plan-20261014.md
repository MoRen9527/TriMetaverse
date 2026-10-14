# 四 daemon 窗起提醒 job 方案稿（8713/8712/8711/8710 同构）

- sourceOfTruth: 本稿（docs/execution/window-reminder-job-plan-20261014.md）
- syncMode: static（方案稿候批·施工候窗）
- lastSyncedAt: 2026-10-14T13:32:50Z（date 现查·写前跑）
- 令源: CEO 2026-10-14 21:26 裁「四个 daemon 都立」（BOD 21:27:16 流转·COS 派工·大表挂行 2d79faffc）
- 主笔: CTO 小狄（机制设计+四 daemon 施工序）·COO 排工会签随稿并行
- 前置勘验: window-ledger.md 现形态已读（W42·living·COO 六笔至 21:20:44·将转白名单登记面）

## 〇、结论先行

1. **主案=每 daemon 一只巡检 job**（5min 高频·动态读台账），非每窗一 job——台账窗变免 job 增删，四 daemon 同构简单；
2. **提醒投递正形=daemon 落提醒卷文件面**（BOD tick-log 同构先例·现役已验证）——daemon 无 SendMessage 能力，即时性边界=值守席巡检周期，不作「即时推送」表述；
3. **提醒状态记 job 侧本地文件**（幂等防重启重发）——**不回写台账**，守「COO 唯一定笔位」维护纪律；
4. **台账 schema 协同条款**：job 依赖机器可读窗条目——本稿 §二出 schema 提案，建议 COO 白名单登记面改版稿（批后件③·明晨并批窗）收编同窗落地，防两皮；
5. **施工窗建议=明晨并批窗与 C1 改版协同落地**（schema 共生同窗最优）；施工位递推 8713→8711→8712→8710（先本机后跨机·先熟后生）。

## 一、机制设计

### 1.1 数据流

```
window-ledger.md（白名单登记面·COO 唯一定笔位）
        │ 读（只读·job 侧零回写）
        ▼
巡检 job（每 daemon 一只·5min）
  ├─ 解析白名单窗条目（§二 schema）
  ├─ 对比当前时刻：任一窗的窗起时点 ±5min 容差内且未提醒 → 生成「窗起提醒拍」
  ├─ 对比当前时刻：任一窗的窗毕时点 ±5min 容差内且未提醒 → 生成「窗毕催收拍」（可选开关）
  ├─ 幂等查重：job 侧状态文件（已提醒拍集合·窗id+拍类型键）
  └─ 新拍 → 落提醒卷（§三形态）+ 状态文件记档
        ▼
值守席/施工席巡检拾取（照 BOD tick 巡检同构·延迟=巡检周期）
```

### 1.2 设计判语

| 判点 | 主案 | 否决案与理由 |
| --- | --- | --- |
| job 形态 | 单巡检 job 动态读台账 | 每窗一静态 job——台账窗变须增删 job·四 daemon×多窗管理成本高且 ALLOWLIST 面（8711）每次变更都要追加+重启 |
| 投递通道 | 落提醒卷文件面（tick 同构） | SendMessage——daemon 无此能力（宿主会话间通道）；OS 通知——daemon 侧能力未勘·禁推定·候后备选不进主案 |
| 提醒状态 | job 侧本地状态文件（DATA_DIR 下） | 回写台账「已提醒」列——违反「COO 唯一定笔位」维护机制（window-ledger 六笔留痕纪律） |
| 时区 | 全部 job 以 Asia/Shanghai 显式判定 | 随宿主系统时区——跨机（sg/河源 Ubuntu）时区差异面引入隐患·显式钉死 |
| 容差 | ±5min（巡检周期同量级） | 更紧容差——5min 巡检下更紧无意义；更松——提醒滞后窗起过久失催窗意义 |

### 1.3 即时性边界（如实标注）

提醒到达值守席的时延=巡检 job 拍发（≤5min）+值守席巡检拾取（先例同量级）。**本机制治「忘开窗/忘收口」，不治秒级即时唤醒**——白名单窗的窗起动作本由人/值席发起，本提醒是防忘冗余非调度依赖。此边界与 BOD tick 现役先例同限，不作更高承诺。

## 二、台账 schema 协同提案（候 COO 改版稿收编）

现台账=人读 markdown 表（窗/时段/内容/owner/态 五列）·无机器可解析结构。job 需要的最小 schema（建议白名单登记面改版直接内嵌·YAML front-matter 或旁挂 json）：

```yaml
windows:
  - id: w42-4card            # 稳定窗 id（幂等键）
    type: focus              # 白名单四类枚举: daemon-maintenance | focus | batch-token | irreversible
    start: "2026-10-14T21:00:00+08:00"   # 显式时区 ISO8601
    end:   "2026-10-14T22:45:00+08:00"
    owner: fsd/sde/ste/coo   # 值守/施工席（提醒目标）
    endReminder: true        # 窗毕催收拍开关（可选·默认 true）
    state: active            # active | done | cancelled（cancelled 不提醒）
```

- **结构化字段只增不改语义**：人读表格照旧·机器段旁挂——改版稿采否均由 COO 裁（本稿只提案不预定笔）；
- **直跑件不入 schema**：直跑件无窗无提醒（派工令原文·D-23 v3 形态）；
- **cancelled 拍撤**：窗撤后已排提醒不再拍发（幂等键含 state 判）。

## 三、提醒卷形态（BOD tick-log 同构）

落位：`docs/workflow/operating-records/<周>/trees/window-reminders/`

```markdown
# 窗提醒 · <拍类型: 窗起|窗毕> · <窗id>
- 窗: <窗名>（<白名单类型>）
- 时段: <start> ~ <end>
- owner: <席>
- 提醒拍发: <daemon 名@机位> <date 现查原值>
- 动作请示: 窗起拍=候 owner 开窗确认 / 窗毕拍=候 owner 收口确认
- sourceOfTruth: 本卷（提醒流水·台账现势以 window-ledger.md 为准）
```

- 卷=流水留痕（一次性拍发记录）·**现势真源永远在台账**——卷头显式声明防双真源；
- 拍发落款照 D-47（job 脚本内 date 现查原值·禁脚本推算）；
- D-24 机位断言头随卷（daemon 名@机位逐字——防探错面拾取）。

## 四、四 daemon 施工序（递推·每步同门禁）

### 步1 · 8713 TriMLC（本机 M 本地域·首铸）

- 首铸位理由：本机熟面·四卡窗可观测性先例在侧·勘修窗实操序已入册（trimlc-repair-window-20261011）；
- 施工：job 脚本铸形（读台账+判拍+落卷+状态记档）→ addJob（5min cron）→ 门禁；
- 门禁：**新建 job 三查=POST 201+next_run 值面+enabled=1**（F-3 家族性·POST 201≠会触发）+ 下一拍触发实测（提醒卷落位验证）+ job state 卫生（nextRunAtMs 禁抹）。

### 步2 · 8711 TriRLC（本机 R 本地域）

- **护栏前置：cron command 白名单精确等值纪律**——job command 任何形态变更=ALLOWLIST 追加+重启；ALLOWLIST 追加先于 addJob；
- 若须重启：照 TriRLC daemon 重启纪律（权威路径禁裸杀·/shutdown→port FREE→冷起→pid/CIM 对表三断言）；
- 门禁同步1 三查+ALLOWLIST 生效探针（追加后 job 注册 403 面=白名单未生效强信号）。

### 步3 · 8712 TriMMC（sg·M 面服务域）

- 跨机施工照 sg 面通道（D-27 值席拾取或 BOD SSH 现行权界）；
- 门禁同上+跨机路径断言（/srv/fleet/ 布局·DATA_DIR 先对再探）。

### 步4 · 8710 TriRMC（河源·R 面服务域）

- **BOD 特批 SSH 现行权界·job 配置非 dsh 面**（派工令原文照录）——dsh 执行层零扰动（序2 装设物隔离）；
- TriRMC 独立仓拓扑（≠TriRLC 仓）——脚本落位先分仓断言；
- 门禁同上+提醒卷跨机回传核（河源落卷→M 面树可见性·照现役跨机卷通道）。

### 通用门禁（每步必过）

1. addJob 三查（201+next_run 值面+enabled=1）；
2. 触发实测：构造候选窗条目（或等现势窗）→下一拍实拍→提醒卷落位值面验证；
3. 幂等实测：同拍两次巡检不重发（状态文件判读）；
4. 空台账实测：无白名单窗时 job 空转零噪音（零落卷）；
5. 回滚实测：job disable 后零拍发（回滚可验证性）。

## 五、护栏清单（派工令两条照录+本席补四条）

| # | 护栏 | 来源 |
| --- | --- | --- |
| 1 | TriRLC cron command 白名单精确等值：command 字段任何变更（含路径迁移）=ALLOWLIST 追加+重启·双入口 fail-closed | 派工令照录（8711 现役在册） |
| 2 | TriMMC/TriMLC/TriRLC cron addJob 行为分野：POST 201≠会触发·新建 job 三查·8711 store=$LOCALAPPDATA\trilc\cron.db 探库先对 DATA_DIR | 派工令照录 |
| 3 | job state 卫生：手动改 state 禁抹 nextRunAtMs（缺它永不调度）·只 patch 目标字段 | 本席补 |
| 4 | D-29 Windows 计划任务无窗：8711/8713 若涉计划任务形态（powershell 直启闪黑窗·合格式 VBS 包装/pythonw） | 本席补 |
| 5 | D-24 机位矩阵断言：四 daemon 四机位（本机 Windows×2+sg Linux+河源 Linux）·脚本跨 OS 形态差（路径/行尾/BOM）逐机验证·禁互套 | 本席补 |
| 6 | cron 日志 token 纪律：logs header 嵌明文 token·tail 前 grep 滤 `^command:`/`^runAs`·值面零进卷 | 本席补（D-46 族） |

## 六、四班组一致性（CEO 令文承接）

- **本批对齐面**：四 daemon 窗起提醒 job 同构落地（同一脚本族·四机位部署）；台账只读契约统一（四 job 同一解析器形态）；提醒卷形态统一（§三模板）。
- **候专项缺口清单（本稿如实列·不入本批施工）**：
  1. 四 daemon 版本与 cron 能力差异全景（TriRMC 独立仓·TriMMC/TriMLC/TriRLC 分野已两条在案·余能力面候专项勘验）；
  2. 四 daemon 配置管理形态（store 位/重启链/watchdog）统一规程——现散于各勘修窗先例；
  3. daemon 侧 OS 通知能力勘验（本稿 §1.2 后备选依据）；
  4. 四 daemon 可观测性 mc 段形态统一（四卡窗先例扩面）。

## 七、施工窗与链形

- **施工窗建议**：明晨（10-15）并批窗·与白名单登记面改版（批后件③）协同落地——schema 共生同窗最优；若改版顺延·job 施工随改版窗走（先立后装同构条款：schema 未落定不动工）；
- **链形**：本稿经 COS 呈 CEO 终审（新链形）·COO 排工会签随稿并行；批后步1 开工·步2-4 随窗递推；
- 不扰项：四卡窗（在途·今晚）·dsh 序2 段2（明晨·8710 面·与步4 若同窗须 BOD 排序）。

## 八、回滚姿态

| 层 | 动作 | 验证 |
| --- | --- | --- |
| 单 job | disable（enabled=0） | 门禁5 空转断言 |
| 全批 | 四 job 全 disable·提醒卷目录归档 | 台账面零依赖（job 只读·台账零变更） |
| 脚本层 | 落位脚本删除/归档 | ALLOWLIST 残留条目清点（8711） |

- 台账零风险锚：job 全程只读台账·任何回滚不触台账一字；
- TriRMC 零扰动锚：步4 job 配置与 dsh 面隔离·回滚不触 dsh 序2 装设物。

## 九、风险表

| 风险 | 级 | 缓解 |
| --- | --- | --- |
| 台账改版 schema 与 job 解析两皮 | 中 | §二协同条款·同窗落地·schema 提案先行 |
| 5min 巡检×4 daemon 的日志/负载面 | 低 | 空转零落卷（门禁4）·日志轮转随 daemon 现役策略 |
| 幂等状态文件损坏重发 | 低 | 状态文件=纯 json append·损坏即全量重查（宁重发勿漏发·重发无害化=提醒卷流水形态） |
| 跨机时钟漂移误拍 | 低 | 时区显式钉死（§1.2）+容差 ±5min 吸收·sg/河源 NTP 现役在案 |
| 提醒卷拾取滞后被误读「job 坏」 | 低 | §1.3 边界声明+卷内拍发时戳与拾取时戳分列 |

## 使用依据

- CEO 21:26 裁令（BOD 21:27:16 流转·COS 派工令文全文·大表 2d79faffc）；
- window-ledger.md 现形态（W42·living·六笔至 21:20:44·D-23 v3 批态）；
- D-23 v3 排窗制度（CEO 21:18 批·直跑默认+窗控白名单四类·COS 21:20 知会）；
- 现役先例：BOD tick-log 树卷通道（operating-records W41-W42 bod-tick 树）·TriMLC 勘修窗实操序·8711 ALLOWLIST 纪律·cron addJob 三查纪律；
- 纪律册现行版：D-24 机位断言/D-27 树协议/D-29 Windows 无窗/D-46 值面/D-47 落款。

—— CTO 小狄（落款 date 现查原值 2026-10-14 21:32:50 +0800）
