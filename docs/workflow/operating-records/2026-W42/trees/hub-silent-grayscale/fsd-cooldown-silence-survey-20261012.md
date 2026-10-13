# FSD 勘验附注：hub-silent 灰度素材④两面+新锚（冷却/静默值）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-13T20:21:36Z（04:21:36+08·date 现查原值·值守候令噪声族续勘版）
- 勘验位: FSD 小全（m-fsd）；令源链: COO 素材包转呈 13:51（候灰度周评估·非即时令）→FSD 只读实勘（零施工）→COO 四点收编 13:54→BOD 第五例增量 20:42（零施工续勘·当场钉死 title 二选一候选）
- 状态条: ①date 现查 2026-10-12T05:55:31Z ②水位=低 ③联审证据=本件+log/state 原文引值 ④末次活动=本件落盘

## 勘验定谳三面

### ①静默值冻结=销案（非缺陷）

transcript 信号源=m-cos transcript mtime。素材①COS 回执证候令空闲属实+直报值与 transcript 末活动 12:49:27 双源一致——恒值=被观测对象真空闲，非读数面缓存。「40min 不滚」嫌疑撤。

### ②冷却条款=本机 8713 实例在位·sg 实例嫌疑主干

本机 log 实勘（.fade/probe-logs/hub-silent-detect.log）：
- 05:44:29.950Z 唯一一条 `NOTIFIED duty-escalate duty-cos-silent -> [bod]`
- state 文件（.fade/tmp/hub-silent-detect-state.json）`duty-cos-silent: 1791783002296` 落位
- COO 三报 13:46:39/13:50:46/13:51:15+08（=05:46/05:50/05:51Z）窗口内**本机 log 零 NOTIFIED 行**
- 本会话 hook 通知前缀=`[M-SG NOTIFY]`=sg 侧转发形态

双实例拓扑=本机 TriMLC 8713+sg 侧各跑一份，state 文件各机独立（冷却=实例级非全局）。3-4min 三报归因候选=**sg 实例冷却旁路或 sg 侧 job 重复注册**（TriMMC 8710 F-3 第三型 enabled 归一未修系在册——8711 已回流毕、8710 未动）。钉死需 sg 侧 log 反查（候 M 面路由，本席不越面）。

### ③新缺陷锚（素材外）：m-sde 名册错位→级联重发

05:28:43Z `ERROR notify failed (reminder deployment-runbook-multunit-restart-anchor): HTTP 400 unknown_target_seat m-sde`——sg 通知名册 16 席（bod,coo,m-cos,m-cao,m-cfo,m-cho,m-cmo,m-coo,m-cpo,m-cto,m-cso,m-fsd,m-rdt,m-dee,m-ste,m-duty-cos）**无 m-sde**；脚本 aliasToOps 表 `SDE: "m-sde"` 与名册错位→三钉② state 不写→同条目 05:44:29Z 升格 idle-escalate 重发 m-cos。**映射错位→400→重轮升格**级联链实锚。修法候选：alias 表对名册对表+SDE 席路由补位（候灰度周评估并案）。

### ④旁证

本机轮执行段 14.5min（05:30:02.293 round start→05:44:29.959 round summary·贴线 900s 节律）——灰度③ collectNodeSignals 串行慢再添一例。

## state 值语义小注（非缺陷·影响冷却窗平移≤15min）

`state[key]=now` 的 now=round start 时刻非发送时刻——冷却窗自轮起点起算。影响=窗平移最多一轮时长，无重复发送风险向；候灰度周评估一并知悉即可。

## 灰度第五例增量（BOD 2026-10-12 20:42 收账转交·FSD 只读实勘续勘）

### 素材三条（BOD 信面）

1. **变体⑤·标题/条目对象错位**：20:42:44 BOD 信箱收 duty-escalate 直报，条目对象=duty-cos（sg 值席 COS）·transcript 锚=2026-10-12T11:49:27.744Z（本地 19:49:27），报文标题硬写「中枢 m-cos 已静默」——张冠李戴。
2. **素材③锚值序列延续+破匀速**：毫秒段 .744（前四例 .301→.360→.428→.499 匀速 ≈+0.066s/例）——递增方向一致但步长 +0.245s 打破匀速模型，「固定算法生成假值」嫌疑加重（序列在·模型待修）。
3. **模板值⑤犯**：「静默 40min」实距 ~53min——与前四例同根（silentMin 计算面）只添样本。

旁证：20:37:04 daemon 拍文 m-duty-cos=候令在案，全席空闲低活动期 idle 静默系常态——已知缺陷①（停工/低活动豁免缺失）复现，零新增风险。

### 变体⑤实勘定谳（FSD 只读源码勘·当场钉死 BOD 二选一候选）

**=title 纯硬编码字样，非映射表错。** 脚本真身=`scripts/fade/hub-silent-detect.mjs`（8713 cron job `cron_muo2mj6s_cco2` command 指向·sqlite 只读勘得），L223-226 duty-escalate 分支：

```js
title = `[silent-detect] 值席静默直报：中枢 m-cos 已静默 ${a.silentMin}min`;
```

title 为字面量模板，`${}` 仅插 silentMin 数值、**不插条目对象 a.id**——标题对任何 duty-escalate 节点都错（恒写「中枢 m-cos」）。根因候选=title 模板写于「duty-escalate=中枢 m-cos 静默」早期假设（L39 `DUTY_SEAT = "COS"` 注释「duty second-hop target maps to m-cos transcript」同源），条目对象后演化出 duty-cos（sg 值席）而 title 未随改——模板假设与条目对象漂移。修法候选（候调参窗）：title 按 a.id 插值，或从条目名映射显示名（对照 L236 aliasToOps 表先例）。

### silentMin 计算面候选（未勘·候调参窗）

「40min vs 实距 53min」差 13min 量级——候选=silentMin 计算基点（信号源 mtime 采样时点）与报文发送时刻的窗差，属计算口径面；候灰度周评估调参一并勘，本节只录素材不展开。

## 值守候令静默态噪声族（BOD 带话 10-14 04:19·FSD 设计面裁量·零指令性收编）

### BOD 观察反馈+本机 log 对表

BOD 带话（第 6 例族）：duty-cos-silent 今夜连报 3 例（43min/73min/103min·30min 冷却节奏精确吻合）——背景=LG-069 电量案 02:27 闭·CEO 明裁「值守全静默·晨见」，值守候令静默系**预期态**非异常，机制在值守候令态会整夜每 30min duty-escalate 直报。

本机 log 对表（勘于 20:20Z）：BOD 三例=**本机实例实锚**——19:15:02.931Z / 19:45:03.237Z / 20:15:03.901Z 三轮 `NOTIFIED duty-escalate duty-cos-silent -> [bod]`，与 43/73/103min 读数逐轮精确对应（m-cos transcript 末活动≈18:32Z=02:32+08，CEO 02:27 闭案后停活动）。

**件②实距读数正面首验**：43/73/103 步进精确 30min——件②（发送时实距重算）生效后首组实测读数，round 基点滞后修正与冷却窗联动正确，无回退。

### 机制全貌（log 勘验新增输入·BOD 面只见 half）

噪声不止 BOD 面：20:15Z 轮 alerts=6——**同轮 5 条 idle-escalate 转报 m-cos**（deployment-runbook-multunit-restart-anchor / ledger-concurrent-write-p2 / lg067-serial-pipeline-dem003 / lg069-battery-gate / lg075-board-contract-revision，owner 均含 COS）+1 条 duty-escalate 转 BOD。值守候令态下**每 30min 6 通知**（m-cos 5 连发+BOD 1 直报）——豁免设计若只做 duty 面，m-cos 面噪声不消，值守回复噪声又会自己打破静默。

### 缺口定性（设计面根因）

值守候令静默（预期态）vs 值守失联（异常态）在现判据（transcript mtime 单源）下**机制上不可分**——缺「候令在案」信号源。与在办件①（低活动/停工豁免·判据源未定位）同根。

### 设计三案+本席裁量

- **A 时段豁免**（duty+idle 两 band 22:00-08:00 降 log-only）：零依赖硬判据，立止今夜型噪声；粗粒度——白天停工/候令漏豁免，夜间真失联也豁（由晨窗首拍补偿，「晨见」裁态下可接受）。
- **B daemon 拍文判据**（件①正身）：候令在案拍文→豁免——判据源未定位（本机 .fade/seats/ 仅手工拍文件 cmo.session），候窗勘。
- **C 冷却拉长**（夜间 30→120min）：减噪不除根，不取。
- **裁量：B 主 A 辅并窗施工**——拍文在→B 豁免；拍文缺→夜间 A 兜底；两案不互斥。施工候窗令（与件①并窗），零指令性收悉不预动。

### 部署面候办（新增）

sg 侧实例副本拾取链先勘清：改脚本后 sg 侧生效路径未验（10-12 夜三件生效锚只验本机 23:00:08 首拍；sg 副本是否 pull 未勘）——豁免施工窗内一并勘定，防「本机修完 sg 照旧噪声」。

## 使用依据

- .fade/probe-logs/hub-silent-detect.log（05:21-05:45Z 段原文）+.fade/tmp/hub-silent-detect-state.json 现值
- .fade/probe-logs/hub-silent-detect.log（10-13 19:15-20:15Z 段·值守候令噪声族对表）
- hub-silent-detect.mjs=`scripts/fade/hub-silent-detect.mjs`（L46 writeState/L159-163 主循环冷却/L199-215 duty hop/L223-226 duty-escalate title 硬编码/L236 aliasToOps/L253 三钉②写入链）
- 8713 cron store 只读勘（job `cron_muo2mj6s_cco2` command 指向脚本真身路径）
- COO 素材包转呈 13:51（四件素材+两勘面委托）+BOD 第五例增量信 20:42（素材三条+title 二选一候选）
- BOD 带话信 2026-10-14 04:19+08（值守候令静默态观察反馈·零指令性·设计面归本席裁）
