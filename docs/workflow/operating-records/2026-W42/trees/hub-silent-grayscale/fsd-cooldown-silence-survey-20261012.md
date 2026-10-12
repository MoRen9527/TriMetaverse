# FSD 勘验附注：hub-silent 灰度素材④两面+新锚（冷却/静默值）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-12T05:55:31Z（13:55:31+08·date 现查原值）
- 勘验位: FSD 小全（m-fsd）；令源链: COO 素材包转呈 13:51（候灰度周评估·非即时令）→FSD 只读实勘（零施工）→COO 四点收编 13:54
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

## 使用依据

- .fade/probe-logs/hub-silent-detect.log（05:21-05:45Z 段原文）+.fade/tmp/hub-silent-detect-state.json 现值
- hub-silent-detect.mjs（L46 writeState/L159-163 主循环冷却/L199-215 duty hop/L240-246 aliasToOps/L257-259 三钉②写入链）
- COO 素材包转呈 13:51（四件素材+两勘面委托）
