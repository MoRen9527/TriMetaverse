# LG-066 v3 窗 · 段2 执行卷（迁 8710 原子切换·sg 值席）

- 执行位: sg duty 值席（m-duty-cos）；施工正形=A3/A4 @84b5f9cc＋A5 @6b3e7568；窗令 v3 正身
- TS0=2026-10-09T10:55:16Z（段1 卷同锚）；段2 restart 时点=**19:03:29 CST**；段2 锚 ≤21:00 **达标**（毕报 19:2x）
- 通道=ssh heyuan 别名（全程）；token 值面零回显（全掩形 `<set>`）/零 root 操作/白名单 15 行内动作

## Q1 步骤读数

| 步 | 读数 | 判 |
|---|---|---|
| Q1.1 | 改前原文留档（掩形全卷；双键=独立行 HOST/PORT，token 行独立不涉 diff） | ✓ |
| Q1.2 | 新 unit **服务器侧 sed 生成**（token 零出机，v2 原「dev 侧生成+scp」路线的 sg 面等效——如实注）；最小面断言=**恰两行差**（L11 HOST 0.0.0.0/L12 PORT 8710），掩形 diff 留卷 | ✓ |
| Q1.3 | tee 喂原件+`>/dev/null` exit=0 ✓。**验证面事件如实录**：卷载事后验证行内置 `sudo -n cat`（非白名单动词＋违 A5 §〇非特权勿挂 sudo 自纪律）→撞拒→diff 右侧空=无效读；即刻以**非特权 plain cat（unit 644）**补齐同断言=双侧同形掩形 diff **零差✓**；CTO 定性核=采信（「验证行车辆错挂 sudo＝断言面瑕疵非写坏非越权；fail-closed 拒非白名单动词＝特权门实战活体实证正向信号」）；教训条=**验证行车辆=白名单动词 only，644 面禁挂 sudo——写入与断言分离后车辆选择随段过目** | ✓（事件已裁采信） |
| Q1.4 | daemon-reload exit=0 | ✓ |
| Q1.5 | restart exit=0（R-2 预挂未触发） | ✓ |

## Q2 完工判据+三判据读数

| 步 | 读数 | 判 |
|---|---|---|
| Q2.1 | 新 MainPID=**2306757**／ExecMainStartTimestamp=**Fri 2026-10-09 19:03:29 CST**＞TS0（live Environment=0.0.0.0:8710+TOKEN `<set>` 实读） | ✓ |
| Q2.2 | 10 轮×30s 全 `ok:true`＝**10/10 绿**（T1 不触发） | ✓ |
| Q2.3 | dev 侧执行毕（BOD 链转传读数）：cp staged 版毕（f06b60c7）＋两轮读数**direct 维 8710 持续绿**；异常判据（healthz-unreachable 连续 2 轮）**未触发**（T2 不触发）；`OK all-hosts` 未现根因=**l1-statefile 按旧拓扑持续 latch**（trirmc-mc inactive+8712 unreachable=段1 段2 预期终态，l1 判定面未刷新）——**BOD 裁：l1 刷新挂账窗后扫尾不阻收口** | ✓（直连维绿+异常未触发；l1 挂账） |
| Q2.4 | -5min 窗空→**判读点候裁毕**：调度谱证据（fba9d2c7 每 15min :00/:15/:30/:45＋381a1886 :22/:52，重启窗内零到期点）→CTO 裁 **schedule-aware 修正**（T3 触发条件=「到期点过而未火」，不以到期点缺席空窗触发；A3 卷 Q2.4 行随注留痕候复裁）→**19:15:00 CST 到期火实测**：`fba9d2c7__2026-10-09T11-15-00-008Z.log` 准点现形＋consecutiveFailures=0＝**首滚绿实证闭卷** | ✓（实证+裁） |
| Q2.5 | ss：**0.0.0.0:8710 在听＋8712 零命中**——空置断言过，**N3 72h 观察窗起点=19:03:29 CST（至 10-12 19:03 CST）** | ✓ |

## A5 段2 毕探读数

- P2-1 ✓：ss 8710 行在＋8712 零行＋3333 锚在；healthz 全形同段1 基线（jobCount=3/mcLedger:ok/degraded:false）；TS=19:03:29 CST＞restart 时点（完工判据正形）。
- P2-2 ✓：cron 块四字段绿＋LOGSFRESH=yes（到点真触发确认归 N3 72h 窗——19:15 首火已实证，余归窗）。
- P2-3 ✓（sg 单段等效＋dev 读数回传合流）：直连维 8710 持续绿；全链 l2 判读 l1-latch 面归窗后扫尾（BOD 裁），sg 单段字段级同构达成。
- P2-4 ✓（分位 sg 可达两件）：R 8710 全形＋M 8712 sg 本机 TriMMC `ok:true jobCount=10 degraded:false`；dev 两件（8711/8713）归本机窗段 STE 补探（分位如实声明）。
- P2-5 ✓：neg GET 8710/internal/v1/agents＝`401`＋`{"error":"unauthorized: missing or invalid X-Internal-Token"` 文前缀——**bind 0.0.0.0 后唯一安全控制在岗（N1 关键断言过）**；零真 token 试打红线恪守。
- P2-6 ✓：MC_DB_PATH 计数=0＋mcLedger:"ok"——不补键（改动最小面，与 MC-1 现值一致）。

## Q3 联动扫尾

- Q3.1 ✓（BOD 链转传）：`sg fleet@~/.trilc/duty-night-patrol.py` 两行注释勘正毕（L12/L21·8710→8712 向）；红线零触＋AST_PARSE_OK＋备份 `.bak-q31-20261009`；运行行 L49/L194 陈旧 8710 **候后续窗不入本窗**（如实录）。
- Q3.2 候办：UI 升版触发（TriModel 卡面 R 服务域 8712→8710 文案走升版流水线）——候 CTO 排程面时点确认，不阻段2 锚。
- Q3.3 本卷＋毕报两刻（→COO+BOD）＋STE 72h 观察窗挂账知会（即发）。

## 裁定台账（窗内五裁全录）

1. P2.1 settings diff→**COO GO＋CTO 同判**（本体照用/mc 侧随 unit 退役；CTO 两条件：①锚内归档留痕 ✓tar 验=1＋目录原样；②封存复验零再写 ✓）；退役后口径=本体 settings.json 唯一真源、diff 监控基线=本体侧。
2. Q1.3 验证车辆事件→CTO 定性采信（教训条随卷）。
3. Q2.4 schedule-aware 修正→CTO 裁（A3 卷复裁随批）＋19:15 首滚实证。
4. Q2.3 l1-latch 根因→BOD 裁 l1 刷新挂账窗后扫尾不阻收口。
5. Q2.3/Q3.1 dev/sg 面路由→BOD 链转传执行毕。

## 回滚锚终态

R-2/R-3/R-4 全程备而未触发（零回滚）；白名单 /etc/sudoers.d/fleet-trirmc-lg066 在役（R-4 全撤候施工毕或 BOD 令——**候裁一项随毕报**：白名单撤否窗内即撤或随 N3 72h 观察窗后撤）。

## 段2 判读汇总（A5 正形）

P2-1..P2-6 全绿＋四口分位 sg 面齐（dev 两件归本机 STE 补探如实分界）＋l2 直连维绿＋N3 72h 观察窗开启——**段2 收口资格成立**，候 CTO 面终判与 CEO 终验链（照任务书收口链：值席收口→STE 验收→BOD 复核→呈 CEO 知情）。

—— sg 值席 COS，2026-10-09 19:2x +0800（段2 卷落树 Q3.3；毕报两刻＋STE 挂账知会随发）
