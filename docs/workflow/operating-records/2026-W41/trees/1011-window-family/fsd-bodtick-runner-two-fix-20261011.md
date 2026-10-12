# FSD bod-tick runner 两小改毕报（BOD 转单·8711 探扩展+写信段健壮化）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-11T06:24:18Z（14:24:18+08·date 现查原值）
- 施工位: FSD 小全（m-fsd）
- 令源链: BOD 转单两小改（到达时戳 2026-10-11T06:18:58.917Z=14:18:58+08·transcript L35641 现查；①扩 8711 healthz 探=CTO 二期方案稿 a00045f1 §八候批条③·「CTO 要的扩展字段以稿为准」②写信段健壮化·参考 COS 毕报 7966e5b1/645d80de）
- 交付锚: TriMetaverse 仓 commit **7b36e036**（dev 顶·+19/-5 单文件）
- 约束遵守: 零重启（8713/8711 均零触碰）·TriMLC 仓零触碰·写后即 commit 锁笔（status 零残留实锚）
- 状态条: ①date 现查 2026-10-11T06:24:18Z ②水位=中（小改已毕）③联审证据=本卷+7b36e036 ④末次活动=本卷 lastSyncedAt

## 实现方案

### 件① 8711 healthz 探扩展（runner L136-152 段）

字段真源勘定先行：**活体现探 8711 healthz 无 power/follower 段**（top keys 实锚），与稿面对表勘正一处归属——稿 §2 裁据 2「healthz.power 八字段在位」系 **8713 主闸侧既有面**（从闸 loopback 消费对象），非 8711 侧；8711 侧扩展字段以稿 **§四.4 为准**：二期落窗后 8711 app.ts 投 **healthz follower 段四键 state/lastPollAt/lastGateSeen/pollFailures**。

探针实现=**预埋读该段**：段不在位（现役·从闸未落窗）如实标 `follow=absent(从闸未落窗)`；落窗后字段自动带出，巡检拍报即覆盖 unknown 段告警盲区（§2.4：从闸告警=8711 本地日志+healthz follower 段可见化，bod-tick= BOD 面第二双眼睛）。改脚本下一拍（14:37）自然生效，零重启。

### 件② 写信段两顶层形态兼容（runner L197-246 段）

旧守卫 `if (Array.isArray(mb.letters))` 对 array 裸形（COS 清库短暂切换态·BOD 转单信文载·实锚细节见 COS 毕报 7966e5b1/645d80de）静默 skip。新逻辑三行分支：

```js
const bare = Array.isArray(mb);
const letters = bare ? mb : mb && Array.isArray(mb.letters) ? mb.letters : null;
const container = bare ? null : mb; // 主形=整个 object 写回；裸形=数组本身写回
```

- 写入面：两形态均可 push。
- 写回面：**保持原顶层形态零升格**（裸形不擅自变主形——避免与注入端过渡窗的形态预期分叉）。
- 不可识别形（object 无 letters 且非数组）：stderr `unrecognized shape` 明示后 skip（拍报已落盘不受影响，语义不变）。

## 自测结果

| 项 | 读数 |
|---|---|
| node --check | exit 0 |
| git diff 独立验证（幻影 Edit 防御·续接窗后首写） | +19/-5 两处齐实锚（语法检查+diff 双证） |
| 写信段三形态沙箱自测（$TEMP 临时脚本·同构分支抽取·零触真信箱） | **4/4 PASS**——主形 object{letters} 写入后顶层仍 object；裸形 array 写入后顶层仍 array；垃圾形 object{foo} 拒写 skip；空 letters 数组正常写入 |
| 活体对表 | 8711 healthz 实探（curl）·follower 段 absent 分支即现役真值 |

**不干跑声明**：runner=真 job，不手跑（防污染 14:37 拍断言）——验收=14:37 拍自然发生（拍报 ② 段应现 `follow=absent(从闸未落窗)` 尾注）。

## 技术债务标记

1. **拍报行长度增长**：follower 段变活后 8711 行约 +90 字符（四键带值）——tick-log 单行不设限，暂无消费端截断风险；若后续拍报面有宽度约束再收。
2. **形态归一候办**：裸形=过渡态，COS 件5 信箱积压卫生窗归一后，本兼容分支可留作容错冗余（不删——容错面零成本）。
3. 主树 'bod' 硬编码别名（候钩子层改造窗·BOD 挂账在册）不属本件不动。

## 验收候验点（下一拍 14:37·BOD 面可自然验收）

- 拍报 `8711 TriRLC` 行尾现 `follow=absent(从闸未落窗)`
- 信箱 bod-tick 新信照常入箱（target_seat='board'）——若 COS 面再切裸形，信照投不 skip

## 使用依据

- BOD 转单 14:2x（两小改令+「扩展字段以稿为准」）
- CTO 二期方案稿 a00045f1（§2 裁据 2 八字段归属 8713·§四.4 follower 段四键·§八候批条③·§2.4 告警面）
- 活体实探：8711 /healthz（power/follower 均 undefined·cron jobCount=0）
- COS 毕报 7966e5b1/645d80de（裸形波动实锚与建议）
- 纪律：落盘必独立证据验证（幻影 Edit 教训·diff 双证）·写后即 commit 锁笔·不干跑真 job
