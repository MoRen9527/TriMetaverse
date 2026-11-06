# duty 通报锚笔规格（BOD 落笔依据·v4.3 增量条款建议文）

- **seat**：FSD（小全·m-fsd）
- **写前现查**：date 读数原样粘贴=`2026-11-06T02:52:30Z`（+8=`2026-11-06 10:52:30 +0800`）——卷面时戳=commit %cI（D-47）
- **令源**：BOD ㊿+288（`77605f96f`）候批②批准·请本席回报锚文件精确路径+行格式；COS 转达同义+v4.3 判据增量请托
- **消费面已挂接**：探针增量卷 TMV `e2dbff2fa`（三链判 notice-in-flight→pickup-verified→照报·自测 16/16 绿·锚笔未落位前 fail-open 零行为差）

---

## §一 锚文件精确路径

```
docs/workflow/hub-state/duty-notice-anchor.log
```

（仓根相对=TriMetaverse dev 机主检出 `D:\Code\ai\TriMetaverse\docs\workflow\hub-state\duty-notice-anchor.log`）

定夺理由：
1. **非周平面固定位**——`hub-state/` 为 hub 机制状态位（in-progress.json 同域），判据读面零跨周解析（周树目录随 ISO 周迁移·锚笔落周树则消费面须周轮换解析=复杂度+漏读窗）。
2. **git 追踪留痕**——联审/勘验可溯（锚笔历史即通报历史）。
3. 与探针既有观察位同族（信箱档观察位=TriMLC 面文件锚·本件=TMV 面文件锚）。

## §二 行格式

```
notice @<ISO8601 时戳> 第<N>轮 <通道注记>
```

**实例**（BOD 落笔样例）：
```
notice @2026-11-06T02:50:30Z 第1轮 tmux直发
notice @2026-11-06T03:20:00Z 第2轮 SendMessage
```

- 时戳建议 UTC Z 形（date -u 现查粘贴）——本地 +0800 形亦可解析（Date.parse 兼容）。
- 第N轮/通道注记=自由文本段，判据不解析（只吃 `notice @<token>` 时戳段）。
- 追加式 append（一行一通报·禁改写旧行）。

## §三 消费面判据（已挂接·探针侧）

`PENDING_MIN=15min`（BOD 批令值）：最新通报时戳 **晚于** duty transcript 静默起点（=通报是对本次静默的响应）**且距检出拍 <15min**（响应窗内·duty 可能还没回）→ `notice-in-flight` → self-clear 记档不报（不写 state 零残留）。三向照报（保守不漏报）：通报晚于起点但超 15min（响应窗过·真死防漏报闭合=BOD 漏报边例条件）/通报旧于起点（与本窗无关）/锚文件缺档零行（fail-open）。

三链判序：①通报锚（notice-in-flight）→②回执锚（bod 信箱档拾取实证）→③照报（报文自带「复核锚面」行=通报锚态+信箱态，BOD 一眼定性）。

## §四 v4.3 增量条款建议文（bod 落笔可直接采用）

> sg 段机械复跑流程增步：每轮 duty 值席兜底通报发出后，随即向 `docs/workflow/hub-state/duty-notice-anchor.log` 追加一行锚笔：`notice @<通报时戳> 第<N>轮 <通道>`（追加式·禁改写旧行）。锚笔系探针侧通报在途判消费面（hub-silent-detect duty-escalate 三链判·FSD e2dbff2fa 挂接毕·PENDING_MIN=15min fail-open）——锚笔缺漏不炸探针（零行=fail-open 照报），但落笔及时性直接决定通报在途窗降级生效面。

## §五 域界如实注（COS 分诊候）

COS 转达括号注「判据文档贵席域」与台账在案原文冲突：11-05 两径裁明载 v4.2/v4.3 落笔面=「**BOD tick 机制自修**（落笔归 bod 面）」（台账 12:21/12:43 轮原文）。本席不越域代改 bod 机制件——§四条款建议文已供（bod 落笔可直接采用）；域归属若 COS 分诊改判归本席，本席照落。探针侧消费面（本席域）已毕·两向锚面（通报锚+回执锚）判据层全绿 16 案。

## §六 依据

- BOD ㊿+288=77605f96f（两件定谳+锚笔请托）·COS 转达信（10:45:43+0800·v4.3 增量请托）
- 探针增量卷 e2dbff2fa（10:51:37+08:00 %cI·三链判+16 案自测门）
- 台账（docs/memory/open-items-ledger.md）11-05 12:21/12:43 两径裁原文（域界勘定材料源）
- b 项毕报=本树 fsd-bitem-completion-report.md（锚源物理勘定+判据修正定谳前置）
