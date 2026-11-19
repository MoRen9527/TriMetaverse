# COS W2 wake 端点小件拆树派工单（BOD 实时收件三级链·W2 dev 机面施工·CEO 01:28 批准线 notice-237 款二）

- sourceOfTruth: 本卷（W2 拆树派工单正身·承 BOD 2026-11-20 01:40+08 托转令）
- syncMode: write-time
- 施工席: 拆树派工=COS 小贾（m-cos·工序径裁面·BOD 令面授权「施工席分派（cto/sde/fsd 域内选）归你」）；施工=m-cto（通道形勘定前置）+m-fsd（端点施工主刀）+m-sde（部署重启链）——本机席域内选派（BOD 现势=14 席全 idle·ListAgents 名址对表毕）
- 令源: BOD W2 施工托转（2026-11-20 01:40+08 hook·值席信 cos-w12-20261120-0135 转呈随附）；CEO 01:28 已裁靶形施工批准（notice-237 款二=生效确认）
- clock: 本面 date 现查 2026-11-20T01:42:05+0800（D-47 写前跑）
- 线背景: 实时收件三级链 W1 已毕（sg 值席组 01:35 毕报·sg 裸仓 hook 第四职能扩展）；W2=TriMLC wake 端点小件（8713 daemon 推唤信号消费口）；W2 毕→W3 会话唤醒接线→W4 联调+兜底验证（推丢回退拍实测）→毕后 BOD 侧 job2 降回 30 分钟兜底（BOD 自面自办）
- 时限注: CEO 总 Plan（2d0f6eb82·fade-001 进化冲刺·BOD 代笔）A 线=实时收件链·log 头行载 09:00 deadline 与 6 分钟催办制——W2 按快毕推进·deadline 归属与催办节律精调候 BOD 回执面确认

## §一 · 施工内容（BOD 令面四点·照录）

1. 鉴权照现役 /internal/v1/* 形族（X-Internal-Token）
2. wake 动作=经本机通道唤醒 BOD 会话（会话名 bod·cc-socks/tmux send-keys 面·细节勘定落卷）
3. 重启链照 TriMLC 勘修窗纪律全套（watchdog Disable→/shutdown→port FREE→schtasks 冷启→pid/CIM 对表→Enable）
4. 完工判据=值面探针（目标变更值面·非 healthz 绿）

## §二 · 拆树（工序面 COS 径裁·五步）

| # | 节点 | 执行席 | 内容 | 门 |
|---|---|---|---|---|
| W2-a | 通道形勘定（auth 前置） | m-cto 主勘 | ①通道形勘定：dev→sg 反向 SSH 隧道 -R 形（BOD 供参考非定形·可另勘优形）——可行性+钥匙面断言（现役 fleet 钥匙通道同族性核验）②wake 动作本机通道形：bod 会话唤醒面实勘（cc-socks 在役性/tmux send-keys target·唤令形）③鉴权映射形：hook token→X-Internal-Token 面+新端点 daemon 路由注册/鉴权白名单面勘定 ④**sg 侧配合需求清单**铸面（sshd 端口转发许可+hook token 鉴权配合面） | 勘定卷落树+需求清单节（清单经我→BOD→转值席组·**sg 面零直连操作**） |
| W2-b | wake 端点施工 | m-fsd 主刀 | 8713 daemon 加 wake 端点：鉴权照现役形族实勘照抄（TriMLC 源码现役路由/鉴权中间件形）+端点骨架+wake 动作接线口；**接线面候 W2-a 形定卷在树后才动**（骨架/鉴权面可先行）+npm run build（dist 构建产物加载面·重启前必做） | 白盒自测读数+构建绿 |
| W2-c | 白盒+门禁 | m-fsd 自测+m-cto 门禁 | 现役端点族不损对表（healthz/cron jobs/internal 族回归）+wake 端点正向/负向白盒（无 token 拒形/伪 token 拒形） | 门禁卷落树 |
| W2-d | 部署重启链 | m-sde | 勘修窗纪律全套（watchdog Disable→/shutdown token 门→port FREE→wrapper 三清→schtasks 冷启→pid/CIM 对表→Enable）+**值面探针完工判据**（目标变更值面实探·非 healthz 绿）；重启前 cron job 族快照备份（job state 全量·防重启丢 job）；channel.cmd 若涉改=daemon 全停+wrapper 三清后动（batch 偏移错位家族正形） | 重启窗记录卷+值面探针读数落树 |
| W2-e | 交付落卷 | COS（本面） | W47 树落卷毕报+commit 推 dev 主检出+sg-server 直推验真（ls-remote 顶==HEAD）+毕报回 BOD | 落卷锚+推验读数 |

## §三 · 护栏

- **sg 面零直连操作**：值席组配合面走「需求清单→BOD→转值席组」链，施工席不 SSH sg（勘定只读需求铸面）
- 8713 现役 daemon=重启窗施工：禁裸杀·stop 前验监听 pid==pidfile pid·/end 不可靠走 /shutdown token 门·冷启后 pid/CIM 对表
- cron job 族（lg099-tri-check 等现役 job）重启后三查（201+next_run 值面+enabled=1）·job 禁带 runAs 面
- D-46 值面全程：token 变量读入零回显零落卷（channel.cmd L16 token 面）
- fade011 手动运行=CEO 通道（席位勿代办·POST /run 亦属手动面）——重启链中该 job 状态面照 cron job state 卫生（禁抹 nextRunAtMs）
- commit 卫生：先勘 unstaged 再动手·共享 index 统一 add+commit·Co-Authored-By 落款
- 毕报锚=对话流拾取增量非单方自述（notice-158 正形）
- 疲劳窗注（D-23 v3.2 适用域）：本线=CEO 批准+BOD 在场参与线·在场施工豁免适用；重启=managed 可逆操作非不可逆类

## §四 · 督办线（我面对表面）

- 三席毕报随线回 COS（SendMessage 直达）→我面汇卷→毕报+落卷锚回 BOD
- 候收件线更新：W2 三席毕报（勘定卷/施工白盒/重启窗+值面探针）挂候收；W3/W4 候 W2 毕启动
- 时限：CEO 01:28 批准线已生效·顺序推进不排窗（11-03 令三）·毕即报·催办节律候 BOD 面对总 Plan 6 分钟制确认后随行

## 使用依据

BOD W2 托转令（2026-11-20 01:40+08）；notice-237 款二（CEO 01:28 靶形施工批准·生效确认）；值席信 cos-w12-20261120-0135；CEO 总 Plan 2d0f6eb82（A 线=实时收件链·时限注）；TriMLC 勘修窗纪律正形链（trimlc-repair-window 先例）；daemon 机位矩阵（8713=TriMLC=M面本地域）；L130 拆树先例形（cos-l130-src-pm-dispatch-20261118.md）。

—— COS 小贾（拆树派工卷·落款=date 现查原值粘贴：2026-11-20T01:42:05+0800）
