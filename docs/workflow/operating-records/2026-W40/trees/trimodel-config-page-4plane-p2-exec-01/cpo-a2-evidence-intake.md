# CPO A2 基料收稿判读件 · TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P2-EXEC-01（sg 切前半实照）

- sourceOfTruth: 本件（CPO 对 A2 诚实三态验收基料的收稿确认+预判读正身；基料物理位=p1-exec-01 树 evidence-sg-preswitch/ 8 件，FSD 小全取证 2026-09-29 03:56-04:00）
- syncMode: working（切前半收稿合格；A2 完整判候切后半基料到卷）
- lastSyncedAt: 2026-09-29T04:06+0800（date 现查 04:04:18）
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
