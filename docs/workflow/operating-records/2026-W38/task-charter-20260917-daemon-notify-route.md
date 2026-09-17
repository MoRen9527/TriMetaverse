# 任务书 20260917-跨面席位通知通道（daemon 路由设计·三方联审）

- sourceOfTruth: 本件（BOD 铸，2026-09-17 22:4x 现查）；CEO 令（22:38 原话）："根因是因为 M-SG 的 cos 不能 SendMessage 给 bod，但是可以让 cpo 和 cto 设计一个更好的方案……让 COS 跟进，COO、CPO、CTO 三方联审"；CEO 方向补充（22:5x）："m-duty-cos 只需要写消息给 TriMMC 的 daemon，说明消息是给 TriMLC 面的 bod，自然就能先发给 TriMLC 的 daemon（8713），也就能送达 bod"
- face: local-executable → **COO/CPO/CTO 三方联审**（COO=通知时效与经营节奏面/CPO=产品与 API 设计面/CTO=技术实现面）；**COS 跟进**（需求方+验收参与）
- PACE: P=本件 → A=挂 W38 平面 → C=三方独立意见→合成 → E=设计方案候 BOD 批 → 批后立项实施

## 问题陈述

- M-SG 席位（如 m-duty-cos）**无法 SendMessage 到本机 bod**——跨机无会话桥，候裁决/候令类内容态通知只能靠屏面扫描兜底（现役 MSG-Alert 候裁决扫描，5 分钟班+内容级已补，但属间接兜底）
- 既有资产：**daemon 互联链已在**——本机 8713 healthz 实证 `mc_link:connected, mc_peer:trimmc`（TriMLC↔TriMMC 已互连）；TriMMC（sg 本机）有 API 面（X-Internal-Token 鉴权先例）

## CEO 指向的设计方向（联审起点，非定稿）

m-duty-cos → 写消息给**本机 TriMMC daemon**（同机 API，说明目标=TriMLC 面 bod）→ daemon 互联链 → **TriMLC daemon（8713）** → 送达 bod（本机在册会话）

## 三方联审要点

- **COO**：通知时效分级（候裁决=紧急/进度=缓）、催办与升级链衔接、缺位兜底（bod 缺位时消息落 COS 缓存协议）
- **CPO**：API 形态（TriMMC 收消息端点设计/消息寻址格式：目标面+目标席名）、TriMLC 侧投递端点（daemon→会话的最后一跳怎么落：SendMessage 桥/落盘信箱/混合）、与既有 TriMMC 卡 API 的一致性
- **CTO**：跨机链路可靠性（mc_link 断链时消息缓存重投？）、鉴权（X-Internal-Token 体系复用）、送达确认语义、安全边界（谁有资格发"给 bod"的消息）
- **共同**：最小可行方案（先通候裁决一类）vs 全量消息面（任意席→任意席）的分期取舍

## 交付

- 三方独立意见 → 合成《跨面席位通知通道设计方案》→ 候 BOD 批 → 批后立项实施（实施归 FSD 线）
- COS 跟进：需求复核+验收口径

## 收口区

（联审过程回写）

- **COO 意见件**（22:40，`coo-opinion-daemon-notify-route.md`）：时效三档（T1 候裁决急四要素齐投/T2 进度摘要/T3 运维条件急）+**通知通道≠裁决通道**（双回执纪律）+催办时钟归 COO（T+30/T+2h/T+24h，红线超阈直达 CEO）+bod 缺位 COS 缓存三动作（缓存≠代裁，保留权缺位冻结）+分期=最小可行先行（先通 T1）。接口要求：对 CPO 寻址四元组/对 CTO 送达确认分级。
- **CPO 意见件**（22:44，`trees/daemon-notify-route/cpo-view.md` 已 commit）：①路由单元=daemon 非 face，寻址 `{target_daemon, target_seat}` 二元+席名正名制（别名网关人话拒绝）②端点 `POST /v1/notify`+GET messages，X-Internal-Token fail-closed，优先级 urgent/normal 封闭集 ③**送达三态分层** accepted≠forwarded≠delivered（forward-claims 教训通道版）④最后一跳混合：SendMessage 桥主路径+落盘信箱兜底（信箱必须可见 GET 计数端点）⑤MVP=单向单目标（sg→bod 最窄切片），schema 留位 phase2 全网格。
