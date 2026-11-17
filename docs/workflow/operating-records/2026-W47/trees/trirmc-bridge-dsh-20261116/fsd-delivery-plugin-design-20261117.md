# 投递语义面插件形式化方案卷（BOD 托转 136·CEO 令「同样考虑插件形式」·FD 主刀拟·候 CEO 回看）

- 执行: m-duty-fsd（CTO/FSD 域协作拟卷·分工人=值席裁·本卷=FSD 拟稿直达）；令面=CEO 09:51:16「那同样，考虑插件形式吧，有方案回我看」
- 状态: ~~方案稿先呈 CEO 回看（不候门禁）~~ → **回看链闭·CEO 认**（CEO 令 11:24:09「方案回看，认」·三项全裁齐闭：①整体认+②P0 开工准（已闭环·registry 化 TriCompany 862ec1f·CTO 二审绿 r309）+③P2 信箱纳）——施工线分期推进：**P1 t4-bridge/P2 mailbox=候令面**（BOD 140③ 勘正·排窗废止后旧语残留勘定：真门=P0 毕+候令·BOD 不发排窗令——P0 已毕 862ec1f=门面达成）·收讫记 2026-11-17T03:2xZ
- 参照先例: fsd-adopt-runner cordis 契约四件套 {name, apply, inject, Config}（v3 已交付·TriModel 93617e5/346158a/b3934e6 谱系）
- 现查: 2026-11-17T02:18Z（写前现查·D-47）

## §一 · CEO 六机制地图（照令入卷·边界如实）

| # | 机制 | 世界归属 | 插件族归属 | 现役形锚 |
|---|---|---|---|---|
| ① | 信箱（notify-mailbox） | dsh 投递面 | **设计点（§三.4·候 CEO 裁纳否）** | 信箱 dispatch payload 五键契约形（target_daemon/target_seat/urgent/title/body·loop_convene.py 契约面） |
| ② | 互发·本地组 | **交互席世界**（cc 宿主专属·dsh 无头会话不可达） | **不入族（边界外·零触）** | cc 跨会话消息面（118 纪律域） |
| ③ | 互发·sg 值席组 | **交互席世界**（tmux 控制输入框形·服务交互席） | **不入族（边界外·零触）** | tmux send-keys 派工形（现役值班链） |
| ④ | staging 拾取 | dsh 投递面 | **入族 P0**（registry 名=legacy-staging） | v2-2 现役缺省形（run_dir/convene 双件落位·控制面拾取） |
| ⑤ | T4 桥工具 | dsh 投递面 | **入族 P1**（registry 名=t4-bridge） | TriRMC session-bridge 三 API dsh 形（T2 收口 b 形·8252d9f 谱系） |
| ⑥ | patch-runner | dsh 投递面 | **入族 P0**（registry 名=patch-runner+cli-adopt 兜底形） | fsd-adopt-runner overlay 形（v3 三修毕·b3934e6）+rc.2 原生 CLI adopt 直用 |

- 边界铁律: **②③=交互席世界零触**（插件族边界外·cc/tmux 两链现役零改）；①④⑤⑥=dsh 投递面=插件族域
- ①设计点如实载明: 信箱形态 dsh 可用（dsh 会话可写信箱）——**纳否投递面=候 CEO 裁**（本卷给建议给依据不代裁）
- **形态边界定谳增补（CEO 令 10:43:33·§八 承载）**: TUI 对无头席不采用+③tmux 注入对无头席不采用——无头席收发只走①信箱/④staging/⑤桥/⑥patch-runner 族（§八.2 定谳全形）

## §二 · 插件契约正形（fsd-adopt-runner 先例同构推广）

```yaml
DeliveryPlugin 契约 v1（cordis 契约四件套同构·dsh 投递面统一形）:
  name: str          # = deliver_via 旗标值域（registry 键·现役旗标面零改延拓）
  apply(ctx, letters)# 批投递主步（per-letter 顺序·fail-visible 单席记录不中断照 v3 骨架）
  inject: [服务声明] # 所需 ctx 服务声明面（缺省声明=零依赖·自declare fail-visible）
  Config: 校验形     # deliver_config 手工 validate 形（fsd-adopt-runner 先例）

DeliveryContext 服务面（宿主统一注入·宿主=TriCompany loop_convene_auto/TriRMC 调用方）:
  letters/run_dir/dry/readout            # 通用面（读数面=六机制统一回执收口）
  dsh: {anchor, bin, home}               # dsh 安装面（⑥⑤声明·版本 pin 矩阵随插件 declare）
  mailbox_root / staging_root            # ①④声明面

统一回执形（v3 状态六键形推广）:
  {event:'delivery', via, seat, session_id?, outcome, flushed?, error?}  # 零信值面（D-46）
```

- **registry 面**: 插件名→实现的注册表（TriCompany 面 Python dict 形起步·零框架依赖）——deliver_via 旗标=registry 查找键（现役旗标语义零变·值域延拓）
- **宿主双形**: loop_convene_auto（召集件批量投递）/TriRMC orchestration（T4 桥单件投递）——同契约两宿主（TriRMC=调用方照令面载明）

## §三 · 逐件插件化设计（P0/P1/P2 分期）

### 3.1 P0（现役形零行为变·纯结构面·随施工线门禁）

| 插件 | name | 现役形→插件形 | 行为面 |
|---|---|---|---|
| staging | legacy-staging | loop_convene_auto 内联 staging 段→抽 apply() | **零行为变**（白盒 2 件零漂移断言守护在册） |
| patch-runner | patch-runner | loop_convene_auto _deliver_letters patch 分支→抽 apply() | **零行为变**（白盒 5 件端到端守护在册） |
| cli-adopt | cli-adopt | 同上 cli 分支→抽 apply() | 零行为变（兜底形位保持） |

- P0=结构重构面：现役三形代码原样收拢进各自插件模块+registry 查找——**改形不改语义**（回归=现有白盒 31 件全跑+缺省 legacy 零漂移双断言）

### 3.2 P1（T4 桥入族·候 P0 毕+CTO 门禁）

- t4-bridge: TriRMC session-bridge 三 API（spawn/list/sendMessage dsh 形）包 plugin 形——**send 语义=T2 收口 b 形零改**（headless 单轮应答回执语义·T2 定谳卷承）
- 宿主=TriRMC orchestration（调用方照令面）——TriRMC 仓施工（跨仓协调面=CTO 对表窗）

### 3.3 P2（信箱设计点·候 CEO 裁后另立施工线）

- **建议（不代裁·呈 CEO 回看）**: 纳入=值得——①五键契约形天然 plugin 化（apply=写信箱零新契约）②=两世界桥（dsh 投递面→交互席世界唯一正式通道·dsh 会话产件可投交互席信箱）③零 dsh 版本依赖（信箱=文件面·零 pin 面）
- 纳入形: registry 名=mailbox·inject 声明=mailbox_root·apply=五键 payload 落信箱（现役信箱写形照守）
- 纳否裁点: ①=纳（两世界桥+零依赖）vs ②=不纳（信箱=控制面专属·dsh 写信箱面维持现役窄口）——**CEO 裁**

### 3.4 v2/v3 共用切换形（令面③并勘）

- deliver_via 旗标=registry 查找键（§二）——**现役三形（legacy-staging/patch-runner/cli-adopt）与 P1/P2 新形同一旗标域**：配置面一行切形·零改码
- v2 形（staging）与 v3 形（patch-runner）共用=切换形现成（缺省 legacy·显式声明即切）——registry 化后语义不变仅结构收拢

## §四 · notice-134 可维护性五判据对表

| 判据 | 插件族方案面 |
|---|---|
| ①耦合面清单化 | per-plugin 清单（施工卷必载·v3 §四 谱系承形）——dsh 触点插件（patch-runner/cli-adopt/t4-bridge）清单=ctx 触点段；零 dsh 插件（staging/mailbox）零耦合面如实档 |
| ②适配层正形 | **每插件=独立适配层**——dsh 版本升级只改对应插件零改他件（契约=业务面/apply 内 dsh 触点段=适配面·v3 §9.2 分层承形推广） |
| ③版本 pin+升级流程 | dsh 触点插件各自 declare SUPPORTED_VERSIONS 矩阵（fsd-adopt-runner 双行承形）；升级窗=§9.3 五步复用（回归门=白盒族+四句门+端到端三例） |
| ④三形态对照 | 本卷 §一 六机制地图=形态对照正形入卷（registry 面=形态切换的运行时承载） |
| ⑤预案段 | 插件族版=§三 分期+本表——预案=契约先例四件套已实证（fsd-adopt-runner 跨版本 diff=EMPTY 硬数据谱系）+零 dsh 插件=零版本风险面 |

## §五 · 现役投递链零回归护栏（如实列）

1. **deliver_via 缺省=legacy-staging 零行为漂移**（白盒双断言守护在册·三笔实锚：V2-2 基线/双缺陷修面 346158a/三修 b3934e6）
2. **信箱现役消费链零改**（mailbox=P2 设计点·未裁零实施——信箱写形现役窄口不动）
3. **T4 桥 b 形收口语义零改**（T2 定谳卷承——t4-bridge 入族=包 plugin 形零语义变）
4. **②③交互席世界零触**（cc 互发/tmux 值席组=插件族边界外·两链现役零改）
5. **第 11 轮在途链/首拍链/树协议现役零触**（§六 v2 隔离纪律照走）
6. **v3 复验线照走不阻塞**（本卷=方案面零码触·SDE 单席复验独立线）
7. **每期施工=单笔 commit revert 一键形+白盒族随卷**（a1/v3 先例同构）

## §六 · 分工与门禁面（令面载明）

- 分工人=值席裁（CTO/FSD 域协作）：本卷=FSD 拟稿；CTO 对表=施工线首闸（P0 开工候 CTO 门禁绿·本卷不候门禁先呈 CEO 回看）
- 施工分期: P0（三件 registry 化·TriCompany 仓）→P1（t4-bridge·TriRMC 仓·跨仓对表窗）→P2（mailbox·候 CEO 裁）
- 每期毕报双通道照走（落卷+SendMessage 值席）

## §七 · 使用依据

CEO 令 09:51:16（BOD 托转 136 转达）；fsd-adopt-runner 契约先例（TriModel 93617e5/346158a/b3934e6 谱系+白盒 18 件）；v3 方案卷 §二/§九（契约/五判据谱系）；T2 收口定谳卷（b 形语义/④-1 映射表）；V2-2 现役形（loop_convene_auto 31 白盒）；118 纪律（交互席世界边界）；D-46 值面纪律

## §八 · 定谳增补段（BOD 托转 137·CEO 令 10:43:33 两项补送·2026-11-17T02:3xZ 落卷）

### §8.1 准实时验收硬指标（令①·席间互发送达实时性）

- **指标面**: 席间互发（⑤桥族·及⑥patch-runner 同形注入面）送达实时性=**信到即触发**——send 事件即 spawn/注入·延迟秒级；B 忙时 followup 队列本轮毕即接（不悬不丢·排队即接语义）
- **双指标分列（实测口径建议·随施工卷定谳）**:
  - `T_inject`（**验收硬指标**）: 投递请求时戳（caller readout）→dsh 注入动作完成时戳（runner 状态行 stdout）——P95 ≤ N 秒（N 沙箱标定建议 5s·活体标定=部署窗复验定谳）
  - `T_reply`（观测指标非验收门）: 注入→回执=turn 时长·**不由投递面控**（模型执行时长域）——两指标分列防口径混装
  - B 忙形态: followup 排队=注入完成即计达（T_inject 口径内·回执随 turn）
- **通道双档形（验收门适用域）**:
  - 准实时档（计入指标）: ⑤桥/⑥patch-runner（+cli-adopt 兜底形同注入语义）
  - 慢通道档（**不计入准实时指标**·兜底位）: ④staging（自节奏拾取·照 CEO 令对照基线）；①信箱=两段如实（写达=落箱瞬时/读达=消费面节奏——准实时档判定候 P2 裁后定）
- **验收门落位**: P1 t4-bridge 施工卷必载实测口径+测量锚（两端时戳差读数面）+白盒标定面（fake 计时注入）——P0 零变

### §8.2 形态边界定谳（令②·无头席通道白名单）

- **TUI 对无头席=不采用**（dsh 无头席零 TUI 挂载——不倒回交互席形态 babysit）
- **③tmux 注入对无头席=不采用**（③留守 tmux 交互席面=值守/BOD notice 通道现役域·无头席零 tmux 注入）
- **无头席收发通道白名单（定谳）=只走①信箱/④staging/⑤桥/⑥patch-runner 族**（cli-adopt=⑥族内兜底形）——插件族四件=无头席唯一收发面（形态边界=CEO 定谳·施工线遵行）
- 边界护栏联动: §五 零回归护栏照走+本定谳=施工线形态门（零 TUI/零 tmux 注入面=验收门附加断言随卷）
