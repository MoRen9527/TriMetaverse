# COO 任务书草稿·TriRMC bridge 改造走 dsh CLI（形 A 保守版·CEO 定谳 21:45:07·COS 拆树派工请领 21:47:29·2026-11-16）

- sourceOfTruth: 本卷（trees/trirmc-bridge-dsh-20261116/coo-task-charter-draft-trirmc-bridge-20261116.md·COO 拆树派工正身草稿·经 COS 呈批链→BOD→CEO 确认）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: CEO 口谕 21:45:07「那就定形A保守版，让TriRMC桥改造走任务书」（BOD 正式流转·台账 701·BOD 五款规范表述 ㊿+346·COS 拆树派工请领 21:47:29+21:51:16 补充注记）
- **生效形态: 正身（签批生效）**——草稿（96f3b41b5·台账 619）经 COS 核读合格+CEO 22:41:00 口谕签批生效（11-04 收窄制闭环·台账 703·2b00b604c·勘正记录见 §八）
- 线属注: 执行体/桥改造线·**非 fade-001 线**（699 退出令不涉·台账 701 合规注）——呈报链=本卷经 COS 面（保留面不变·618 采认）
- 落款: 2026-11-16T21:51:41+0800（写前现查·D-47 正形）

## §一 · 任务目标（BOD 五款规范表述·令文冻结照录）

- **①定谳（形 A 保守版）**：13 席独立 dsh 会话保留（UUID 寻址+preset）·TriRMC bridge 三 API 改指 dsh CLI（spawn→`dsh --profile headless`/list→扫 `~/.dsh/sessions` 或 session-controller API/send→`dsh --profile headless --session-id <uuid> "消息"`）·**目标=claude CLI 依赖清零**（+降权链+SendMessage 状态机随改造）。
- **②施工面走任务书**：bridge 改造+13 席 preset 移植 headless profile+桥工具面——任务书归 COO 拆树·生效面候 CEO 确认。
- **③解锁面（随本任务书联动）**：迁移链 S3 实弹候裁前提解除（notice-115 依赖点·见 §三 T3 关联注记）+凭据面按 dsh 形（CEO 20:28 裁河源本地代理+GLM 凭据）+tmux paste 便道退役改造毕另裁。
- **④不受影响面（护栏正身）**：旧形链三跑接力照走+触发面熄火维持+sg web profile 8791 不动。
- **⑤边界（令文冻结）**：dsh agent-team 九工具**不采用**（experimental+形态不符）·claude subagent seam **不采用**。

## §二 · 现势锚与材料归集（6.5h 并行段六件·本席归集毕）

| 材料 | 锚 | 归集注 |
|---|---|---|
| dsh 运行时勘形卷 §六 | 671876b5d（m-duty-cto） | dsh 会话后端=@deepseek-ai/dsh-agent 原生会话族·sg 可达面零部署记录；河源包一手实勘见 ㊿+343；命名 session=UUID 寻址正形·按名别名不存在——**名字↔UUID 映射需编排层自建（TriRMC employee-registry 承接）**；凭据面跟部署面走（dsh-llm 用 DeepSeek/GLM 凭据） |
| deepseek-harness 双源勘形 | BOD 台账 ㊿+343 | 河源本地 0.2.0-rc.2 包一手实勘（README.zh/类型面/help 活体）·headless `--session-id <uuid>`=adopt persisted Session（unknown id=error）·SendMessage 原生两轨（agent-team 九工具/subagent seam）均属⑤边界不采用——形 A 保守版可行定谳·改造量小·agent-team 留观察项 |
| CTO 技术形裁定卷 | b842ca7a2（fade-001 线） | per-seat headless 会话族先例形+S1-S5 施工序+降权/隔离纪律同族——**先例形参照非本任务书施工序**（fade-001 线归值席面·两线防混装） |
| SDE 河源 claude 装机毕报 | b95538679 | claude 2.1.325 装机实锚（S3 前置件·已随裁决撤销） |
| SDE 河源 claude 卸载毕报 | 6c7dd3a3b | 回撤装前态断言成立（which/常见位/find 零命中探针全绿）——**现势=河源 claude CLI 依赖已清零·令面吻合锚**（bridge 改造前现役 spawn 目标已缺位=改造驱动实证） |
| BOD 五款规范表述 | ㊿+346+台账 701 | 本卷 §一 令文冻结正身源 |

## §三 · 拆树（T0-T5 六工作项·依赖序）

| 项 | 内容 | owner | 开工条件 | 门禁/验证 |
|---|---|---|---|---|
| **T0 真源核查（首工作项）** | 河源面实勘六读数：①session-bridge.ts 现役三 API 调用面+claude 依赖点位清单 ②13 席 preset 现状（转译器输出·acp/headless patch=空实锚复证）③dsh 河源可达性三读数（which dsh/version 复证 0.2.0-rc.2/env 凭据在否）④`~/.dsh/sessions` 目录现状 ⑤桥工具面现状（preset 挂工具形·SendMessage 状态机现役形）⑥河源本地代理+GLM 凭据面（CEO 20:28 裁·dsh 凭据接线前置面） | M-SG 席组（§四 勘正·sg→河源直连·编排面零越机代勘） | **即启**（read-only 实勘·COS 流转第一步已在途·候读数回归对表） | 读数六件回 COS/本面对表·缺口如实列 |
| **T1 dsh 可用性确认+凭据接线** | dsh CLI 活体确认（0.2.0-rc.2 可执行）+DeepSeek/GLM 凭据接线（河源本地代理形·D-46 值面纪律·凭据零进打印路径） | M-SG 席组+CTO 域门禁 | T0 毕+CEO 签批生效 | dsh 活体探针+凭据面值面勘（脱敏形） |
| **T2 bridge 三 API 改造（主施工件）** | session-bridge.ts spawn/list/send 改指 dsh CLI 形+降权链（dsh 默认 danger-full-access→受限权限 profile）+SendMessage 状态机（发送/回执/排队态）·独立 commit 单笔族 | M-SG 席组 FSD+CTO 技术方案门禁 | T1 毕 | 白盒+代码面 grep 断言（零 claude 调用点残留） |
| **T3 13 席 preset 移植 headless profile** | 转译器重跑·acp/headless patch 从空落实·UUID 寻址注册（名字↔UUID 映射·employee-registry 承接） | CTO/FSD 域 | T0 毕（与 T2 并行可） | preset 值面勘（13 席齐·UUID 面在）——**关联注记（COS 21:51:16 补充令·notice-115 依赖点）：本段=notice-115 候裁面的解锁前置——改造毕→dsh 实弹席解锁→迁移链 S3 实弹+旧形三跑接力同链解锁（防两线候裁点失联·解锁读数随本任务书督办线回 COS 转 notice-115 面）** |
| **T4 桥工具面** | 13 席 preset 挂 SendMessage 桥工具·席间互发经 bridge HTTP API（非 dsh 原生 agent-team 面——⑤边界） | CTO/FSD 域 | T2+T3 毕 | 桥工具面白盒+一席对一席真值互发案 |
| **T5 验证门** | 见 §五 验收门五断言 | STE（河源侧）+CTO 门禁框架 | T2-T4 毕 | 五断言全绿=验收 PASS·任一红=止损评估线 |

## §四 · owner 对表与护栏四族（派工单必载·件6 班组合同要件）

**施工主体=M-SG 席组（sg 值席班组）**（§八 勘正·COS 域裁 22:46·CEO 令「施工主体用M面服务域M-SG或者M面本地域更可靠一点，由cos决策即可」承）；**施工对象=河源 R-HY 不变**（D-24 机位断言：TriRMC=河源 R 面 8710·跨机通道=sg→河源直连）；技术方案与门禁=CTO 域（m-duty-cto 先例形参照）；验证=STE 分立；呈批与督办=COS 面；本席=拆树派工+督办读数随到随记。（§三 各项 owner「河源侧班组」字样随本勘正=M-SG 席组）

**护栏四族**：
1. **触面限定**：TriRMC 桥改造面（session-bridge.ts+降权链+SendMessage 状态机）+13 席 preset 面+桥工具面+dsh 可用性/凭据接线面——**零触 TriRMC 现役 loop 链与 fade-001 线**（值席面 routing·699）·零触旧形链三跑接力（§一④）·零触 sg 现役资产（MMC 8712/web 8791/树协议/值席班组）·零触 TriRLC 8711/TriMLC 8713·零 daemon 重启除非照 TriRMC 重启纪律正形链。
2. **回滚锚**：session-bridge.ts 现役基线 commit 留档（改造前 dump+单笔族 revert 一键）+13 席 preset 现役 dump+dsh 侧零写面（bridge 不删 sessions 目录持久态·改造可逆姿态全在）。
3. **止损线**：两法受阻即挂账收笔零恋战·止损评估读数回 COS 候裁；dsh 运行时不可用形态（version 活体不达/凭据接线不通）=如实报候裁不硬切。
4. **值守位**：河源侧班组自守+BOD R 面通道值守+COS 督办线随行+本席督办读数随到随记（runway 护栏照走·fresh 跑道常态）。

## §五 · 验收门（五断言·CEO ①款目标对表）

1. **claude CLI 依赖清零断言**：河源 which claude 零命中（6c7dd3a3b 探针族复跑）+session-bridge.ts 代码面 grep 零 claude 调用点残留；
2. **三 API 实弹 smoke**：spawn 一席真值案（`dsh --profile headless` 起会话）→list 见席（sessions 目录或 session API 对表）→send 收到回执（`--session-id <uuid>` adopt 形）——三案全真值；
3. **SendMessage 状态机回执链**：席间一封互发全链（发送→桥 API→对席收到→回执态闭环）真值案；
4. **13 席 preset headless 生效值面勘**：13 席齐+UUID 寻址面在+降权链生效（非 danger-full-access 值面）；
5. **零回归断言**：TriRMC 现役 loop 链零扰（8710 现役评分链照走读数）+旧形三跑接力照走（§一④）+sg 面零触断言。

## §六 · 时点语义与生效形态

- **零时点门**（11-03 令三形态）：依赖驱动非时钟驱动·T0 即启（read-only 实勘·COS 流转第一步在途）·T1-T5 候 CEO 签批生效后按依赖序开工（11-04 收窄制·真任务书生效=CEO 确认）——签批前零施工触面。
- 呈批链：本草稿→COS 呈批→BOD→CEO 确认→签批后 COS 监督催办（流转第四步）。
- 本席督办线：T0 读数回归对表（首读数点）→T1-T5 节点毕报随到随记→T5 验收门读数=任务书闭环→解锁面联动读数（notice-115/S3/凭据面）随线回转。

## §七 · 使用依据

CEO 口谕 21:45:07+BOD 五款 ㊿+346+台账 701（36be84221）；COS 拆树派工请领 21:47:29+补充注记 21:51:16（notice-115 关联）；材料六件（§二 表）；D-24 机位断言；D-27 v4（COS 交单→COO 拆树派工）；11-04 收窄制（真任务书生效=CEO 确认）；件6 班组合同要件（护栏四族）；notice-115 三跑挂起候桥改造令面。

## §八 · 正身化与勘正记录（2026-11-16）

- **正身化**：本卷经 COS 核读合格（§一五款对表+T0-T5 依赖序+护栏四族+验收五断言+notice-115 关联注记全齐·零阻塞缺口）·CEO 22:41:00 口谕签批生效（11-04 收窄制闭环·台账 703·2b00b604c）——草稿转正身·呈批链闭环（COS 流转第三步毕·第四步监督催办随线）。
- **施工主体勘正（COS 域裁 22:46·CEO 令「施工主体用M面服务域M-SG或者M面本地域更可靠一点，由cos决策即可」承）**：施工主体=河源侧班组（f-duty-*）→**M-SG 席组（sg 值席班组）**·理由链四条（CEO「M 面全职施工面」语义吻合/sg→河源通道最短免 -J 双跳与限 IP/f-duty-* 河源侧先例熟练度/本机席组夜段值守弱）——施工对象=河源 R-HY 不变·跨机通道=sg→河源直连（D-24 照）·CTO 域门禁/STE 验证/COS 呈批督办均不变——§三/§四 owner 字样随勘正落。
- **派工现势**：COS 派工令已签发经 BOD 托转值席面（sg 通道）——**T1 即启**（dsh 活体确认+凭据接线先行）·T0 读数照收；本席督办线照走（T0 回归对表+节点毕报随到随记·护栏提醒照载：本线零触 fade-001 线/sg 现役资产 MMC 8712·web 8791·daemon 零重启除非正形链）。
- 勘正落款：写前现查 2026-11-16T22:47:35+0800（D-47 正形）。

—— COO 小营（m-coo·TriRMC bridge 改造任务书·形 A 保守版·正身）·草稿写前现查 2026-11-16T21:51:41+0800·§八 勘正写前现查 2026-11-16T22:47:35+0800（D-47 正形）
