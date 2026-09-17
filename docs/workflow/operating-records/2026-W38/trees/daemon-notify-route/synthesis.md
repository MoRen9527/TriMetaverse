# 跨面席位通知通道·设计方案（三方联审合成稿）

- sourceOfTruth: 本件（BOD 合成，2026-09-17 23:0x；三方意见件：COO `coo-opinion-daemon-notify-route.md`/CPO `trees/daemon-notify-route/cpo-view.md`/CTO `daemon-notify-route-cto-opinion.md` e75ddd81）
- 候: CEO 批（含一处显式裁决位）→ FSD 立项实施

## 一、架构定稿（三方收敛）

```
m-duty-cos ──POST /v1/notify──▶ TriMMC daemon(sg) ──outbox──▶ TriMLC daemon(8713) ──最后一跳──▶ bod 活会话
              (X-Internal-Token)   (event-queue 复用缓存)   (mc_link 外拨顺路拉)      (★唯一裁决位)
```

- **寻址**：`{target_daemon, target_seat}` 二元（CPO=路由单元是 daemon 非 face）；席名正名制，未名人话拒绝
- **跨机**：HTTP-pull 收件箱制（CTO）——TriMMC notify outbox + TriMLC 外拨顺路拉，不引 WS；断链缓存重投**复用 event-queue 资产**（CTO-008-M 现成），幂等=message_id+去重表
- **鉴权**：X-Internal-Token 全复用（LG-012 三链），零新令牌族
- **送达三态**（CPO）：accepted≠forwarded≠delivered，状态迁移写 history；**源席查询端点必配**（屏扫痛点的本质=发送方不可见）
- **安全**：双端 ACL（源席白名单 MVP=bod 单条+目标席名册）+三硬约束（4KB 上限/限速/全量台账）
- **最后一跳**（全链唯一无现成机制段）：**SendMessage 桥主路径+落盘信箱兜底**（CPO）——桥失败→deferred+会话注册钩子补投，信箱必须可见（GET 计数端点），urgent 超时按升级链转 COS 缓存协议绝不静默过期

## 二、运营层（COO 层落地）

- 时效两值映射 COO 三档：urgent=T1 候裁决（四要素齐投）/normal=T2 进度；T3 运维异常走告警通道不入本面
- **通知通道≠裁决通道**：双回执纪律随行（通知送达≠裁决完成）
- 催办时钟归 COO：T+30 催/T+2h 重投 URGENT/T+24h 进晨报，红线件超阈直达 CEO
- bod 缺位：COS 缓存协议三动作（登记/重投/超阈升级），缓存≠代裁

## 三、分期

- **MVP**：sg→bod 单向、候裁决类（白名单双单）——解屏扫痛点最窄切片
- **P2**：全网格任意席→任意席、read 回执、群发（跨面需求现仅 bod 一条实证，勿为想象需求扩面）

## 四、★CEO 裁决（2026-09-17 22:53）

**方案 A 定稿**：urgent 件=Windows toast 即时+hook 回合边界注入（COS 下一回合即见，机制零新协议）。
**方案 B（CLI 桥秒级注入）挂未来需求候评估**——触发条件留档：若 hook 注入延迟在实际使用中不满足候裁决时效（COO T1 口径复核），或出现秒级注入的实证需求，重提评估。

## 五、实施锚

- 实施归 FSD 线；复用资产：event-queue（CTO-008-M）/letter-store（LG-026）/X-Internal-Token（LG-012）/channel 态字段（LG-036）
- COS 验收口径：候裁决时效分级需求复核（COO T1 四要素）
