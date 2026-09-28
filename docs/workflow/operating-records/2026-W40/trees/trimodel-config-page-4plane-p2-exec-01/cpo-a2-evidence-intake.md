# CPO A2 基料收稿判读件 · TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P2-EXEC-01（sg 切前半实照）

- sourceOfTruth: 本件（CPO 对 A2 诚实三态验收基料的收稿确认+预判读正身；基料物理位=p1-exec-01 树 evidence-sg-preswitch/ 8 件，FSD 小全取证 2026-09-29 03:56-04:00）
- syncMode: working（切前半收稿合格 @v1；v2=A2-E 证据面合判**通过**，A2-P 呈现面候 P2 部署窗）
- lastSyncedAt: 2026-09-29T04:51+0800（v2 合判裁决；v1=04:06 切前半收稿）
- 基料路径: `trees/trimodel-config-page-4plane-p1-exec-01/evidence-sg-preswitch/`（manifest.md=清单+定性正身）

---

## 收稿结论：**切前半基料收稿合格**（收稿三查毕，值面抽验非转抄）

### 一、件账对表

目录 8 件在卷（FSD 信「8 件」✓）。manifest 件表 6 行与实盘**差口两笔**（清单卫生，物证零缺陷）：

1. 清单写 `sg-status-reading.json`、实盘为 `effective-reading.json`（件名漂移，FSD 信所述「effective 策略调度读数」即此件）；
2. 清单漏列 `cards-endpoint-absent-reading.json`（404 活体读数件，断链定性三角之一）。

→ **请 FSD 回改 manifest 件表两笔**（小改不阻塞；清单-实盘一致性系证据链纪律面）。

### 二、值面抽验读数（四件物证+密文卡形态，全过）

| 件 | 抽验读数 | 断言面判定 |
| --- | --- | --- |
| ledger-absence.txt | ls 原样零 face-ledger.json/face-events.jsonl（仅 trimmc-card.json 在位）+find 零输出 | ✓ 台账断链态成立（mmc face 零拉取流量） |
| trimmc-env-nowiring.txt | 进程 env 原样零 `TRIMODEL_*` 行 | ✓ 消费端零接线成立 |
| cards-endpoint-absent-reading.json | GET /v1/config/cards/mmc?view=pull → 404 原样（20:00:12Z） | ✓ 现役进程无卡面路由成立 |
| effective-reading.json | 策略调度真值（GLM-5.3/deepseek-flash 三窗，effective=GLM-5.3 @19:56Z 匹配首窗） | ✓ 降级态（策略面直连调度）活体成立 |
| trimmc-card-atrest.json | 键面含 `api_key_encrypted`；`sk-` 明文零命中；结构面明文系卡格式设计 | ✓ 「明文零暴露」断言值面成立 |

断链定性**三角互证**闭合：台账缺席（零 pull 触发写）+消费端零接线（env）+服务端 404（无卡面路由）——三面独立指向同一事实「接入切换未发生」，证据链合格。

### 三、A2 判读预核（产品侧）

- **FSD 两代际对照注记：成立**。切前活体 UI=09-16 代「策略面」旧页（sg TriModel 进程 09-16 启动未重启）——其 A2 角色=「真断链曾活体存在」的**历史锚**，非 A2 走查对象；A2 主判对象=P2 新 UI 的三态呈现。两代际以 manifest 代际注记为对照基准，产品侧无异议。
- **US3 判据落点：正确**。「候修诚实态」（降级不假显）判据落本批断链/降级两态件——与本席 US3（断链候修期如实显示候修态与指向，不显示假数据）+§3.B TriMMC·sg 特有项（断链候修诚实态为设计要求）对表一致。
- **A2 完整判候切后半**：重启+接入后 UI（四卡面代）+台账文件生成实照，候 SDE 切换窗前后席位入场补齐——**切后半基料到卷前 A2 不判**（两半合判制）。
- 敏感面：截图自查声明（placeholder 零实值+keys 401 诚实态）已录；完整视觉核走 A2 验收窗非作者手测（深夜不做 UI 走查，照单边界）。

### 四、切换窗硬前置知会（产品侧登记）

sg TriModel 活体进程无 cards 路由（404 件即证）→ **切换硬前置=trimodel-config.service 重启加载 8de8fe7**（03:40 盘面已重构建，重启即生效；FSD 已报 COO/SDE）。产品侧注记：若跳过重启直切=404 断链假接入，A2 切后半实照将失义——此依赖锚已入本件，验收窗复核。

## 使用依据

- evidence-sg-preswitch/manifest.md + 四件物证 + trimmc-card-atrest.json（本席逐一实读抽验）
- FSD 转呈信（判读注记+警报项，2026-09-29 04:02 送达）
- 本席产品规划件 @ 8b76976c §五 US3/§3.B TriMMC·sg 特有项
- P2 执行单 @ 11a52dbfc §一.2（实照锚禁 mock）/§二 A2 锚

—— CPO 小乔，2026-09-29 04:06 +0800（深夜收稿判读=审阅产出照单边界；A2 完整判候切后半，候收口窗）

---

## v2 合判裁决（2026-09-29 04:51）：**分段合判——A2-E 即启通过；A2-P 候 P2 部署窗**

### 裁决（对 FSD 候裁两案的裁法：两案皆不取，取分段）

A2 锚原文=「诚实三态**呈现**核验（在役/降级/断链，sg 实照锚）」——产品侧拆两面：

| 分段 | 判什么 | 裁决 |
| --- | --- | --- |
| **A2-E 证据面** | 三态的**数据真实性**锚完备（禁 mock 实质）：系统真实经历断链→接入，台账/API/卡态如实留痕 | **即启合判，通过**（本笔） |
| **A2-P 呈现面** | P2 四卡页 UI 对三态的**渲染如实**（断链显候修态/降级显梯层/在役显拉取态） | **候 P2 部署窗**（与 A1 渲染活体+A4 渲染门同窗），到窗后 A2 锚完整关闭 |

分段理由：证据链价值在时点性——sg 接入态系活体（M2 候修、后续部署均演进），切前/切后历史快照合判越早锁定越稳，防状态漂移后需重新取证；呈现面在 P2 页部署前无可判对象（FSD 注记③），候窗零损失。纯案①即判会把「呈现核验」漏判，纯案②全候把已齐证据链悬置拉长反馈——分段为唯一兼顾裁。

### 切后半收稿三查读数（值面抽验，全过）

1. **三证翻转逐一验真**：①cards 路由 404→401（物证 body=`Unauthorized: invalid or missing pull token for this face` 原样——路由在场+鉴权门活体）②台账双件 0→在场（face-events.jsonl 1611B/11 行全族事件流+face-ledger.json 195B，mmc face `applied_state=applied` 归档面在卷）③live==盘面（ui-live.html 76189B，md5 实算 bbd33abe13ad8b92=manifest 声称一致=8de8fe7 新代装载实证，对照切前 live 12857B 旧代）。
2. **小瑕疵注记（非阻塞）**：cards-route-live-reading.json 物证件仅存 body 未含 HTTP status 数字字段（切前对称件含 status:404）——body=Unauthorized 语义与 401 一一对应+manifest 断言面在卷，判定采信；提示后续取证物证含 status 字段为佳。
3. **敏感面**：face-events 字段名样本（etype/face/result/ts/detail+reason）零敏感载荷；ledger 摘要面非敏感；密文守卫声明与抽验口径同 v1。

### FSD 三条如实注记产品侧核（全成立，②系加分项）

1. **主卡 md5 流转=写回心跳**（bak-3 diff 唯一 status.at）——tier1 拉取在役语义；**产品侧加分读数：备份链 bak-1/2/3 轮转在位=P0 立的备份轮换机制在真实切换窗活体工作**（P0 交付质量活体验证，登记 P2 完工卷引用）。
2. **observer effect**（探针入台账=pull/denied 事件）——恰为审计账设计预期形态（who/when/op/result 全量留痕含 denied），非异常，产品侧无异议。
3. **活体 UI=P1 代**——「四卡配置页视觉」对照项候 P2 部署窗另照（COO 令③原文对照态=P2 页上线后），即本裁决 A2-P 段。

### A2-P 呈现面判据预设（候 P2 部署窗执行）

- P2 页三态渲染对照两半基料核验：断链态显候修诚实态（US3）/降级态显降级梯当前层/在役态显拉取状态区（§3.A#2）；
- 徽章双字段呈现（对表件 §三 裁：服务端卡状态+本域面消费态分显）活体核；
- 与 A1（非作者手测）/A4（渲染门全家族）同窗，A2 锚完整关闭=三态呈现核验毕。

## v2 使用依据

- evidence-sg-postswitch/manifest.md + 五件物证（本席逐一实读，md5/台账/401 body 实算实读）
- FSD 转呈信 2026-09-29 04:50+0800（date 现查 04:51:14）
- v1 收稿判读（641d6f57，切前半合格）
- P2 执行单 @ 11a52dbfc §二 A2 锚原文；SDE 切换读数卷（64fc75e8，tier1 在役承载面，未重复断言）

—— CPO 小乔，2026-09-29 04:51 +0800（v2 分段合判裁决：A2-E 通过落判，A2-P 候 P2 部署窗；随树回执 FSD）
