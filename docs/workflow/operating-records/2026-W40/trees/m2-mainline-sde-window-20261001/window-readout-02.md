# M2 主链 SDE 车道·窗读数②（续篇：三态复验+裁复回填+item4 续测）

- 执行: m-duty-sde；时点: 2026-10-01 21:4x-21:5x+08 现采
- 触发: BOD 裁复两项请核（chromium 批准+CORE_VERSION 分工定谳）+主链 item1/2/4 续跑令

## 一、BOD 裁复回填（两卷已标注）

1. chromium 工序单：**批准**——机位=R-HY/通道=BOD 代执带令面/执行窗=明晚窗优先排/今晚=备执行态（零 R-HY 面动作达成）→ chromium-rhy-install-runbook.md 头部回填毕
2. CORE_VERSION 分工：动笔+bump=FSD 同批同席/SDE=checklist 四项/双签=FSD+SDE/动笔窗=明晚窗/sg #1 零动作维持 → core-version-gate-sde-checklist.md 头部回填毕

## 二、item1 前置·sg→R-HY 通路三态复验留痕 ✅（执行单 §一.1 改指前置件）

| 态 | 读数 | 判定 |
|---|---|---|
| 8710 API 面 | HTTP 200（探3，三探累计稳定：11:25/11:26/21:4x） | ✅ 通 |
| 443 TLS 面 | TLS 握手成功 0.58s，HTTP 404（根路径无页面，Caddy 在听正形；M1 卷路由面=具体路径） | ✅ 通 |
| 3333 面 | Connection timed out（5s） | ✅ 不可达=保持正形（A4 安全面设计维持） |

**item1 改指前置条件全绿**（R-HY 依赖解冻+通路三态留痕毕）。改指动作本体仍候：键值窗链 item5 修毕→回滚锚门→联动序（token 轮换并批 restart 协调点已显式提出候编排层）。

## 三、item1 前置·sg TriMMC 域落点重勘（权限边界如实定级）

- `systemctl show trimmc`：Environment/UnitFileState 空回（fleet 权限受限）
- `/srv/fleet/TriMMC/.env`：不存在于仓根（ls 零命中）
- 8712 进程 pid：fleet 不可见（ss -tlnp 无 pid 权限）
- `systemctl cat trimmc`：**No files found**（fleet 查询不到该 unit——system 级+权限外）
- **定级：sg TriMMC 域深层形态（unit/drop-in/.env 真源/进程 env）=fleet 权限外，归 BOD root 代执链勘验**（与 token 轮换工序 2/3 同通道，可同链并勘——建议 BOD 勘时顺录 TriModel 拉取路由现势键，供落点二择一裁素材）
- 落点裁定（settings 面或 env 面二择一，batch-05 裁决 #3）候 CTO/COO；本席供判素材：batch-05 卷"sg env 无 TRIMODEL_API_URL，实走 3334→3333 proxy 链"+8460 易位注记在案

## 四、item4 钟漂观察续测

| 采样 | 时点 | R-HY Date 头 | sg 本机 | 漂移 |
|---|---|---|---|---|
| 1 | 11:26:14Z | 11:26:14 | 11:26:15 | ≈1s |
| 2 | 13:42:23Z | 13:42:23 | 13:42:23 | **≈0s** |

旧疑（快 6m22s）两采样均不复现——**观察周时钟敏感读数前校=PASS 维持**。

## 五、item2 现势

前置两项：R-HY 面可达 ✅（读数①）；键值候供（GLM_API_KEY 键值窗=FSD/CEO/BOD 面）候信号。R-HY 治愈案先例在卷（deploy-readings L258：PUT 本体=服务端现域重加密）。**候键值即动，机内 PUT 零重启**（batch-05 卷判形）。

## 六、车道终态（本读数时点）

- item4 观察周续测：进行中（两采样留痕）
- item1：前置全绿，改指本体候键值窗链门+联动序
- item2：前置半齐，候键值候供信号
- 伴窗两项：备执行态（明晚窗），今晚零动作
- 零阻塞零超载，超载顺延序知悉（M2 主链次之候裁）

## 使用依据

BOD 裁复 21:4x（两项请核回执）；task-charter-trimodel-m2-cutover-01.md §一.1/§三；batch-05 m2-execution-order-alignment.md（裁决 #2/#3/#6+候修 1）；deploy-readings.md L258（治愈案先例）+§六（443/3333 三态基线）；本目录读数①。
