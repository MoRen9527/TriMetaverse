# R5 归因报：TriCompany 四对同题异 hash 双写根因勘定 + patch-id 等价断言（CHO 席）

- sourceOfTruth: 本件（R5 归因报正身·R1 开工前置安全门输入）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: COS 排工投递（2026-11-05T18:27:34+0800 落款·CTO reconcile 方案判定卷 cto-form2-sg-verdict-and-reconcile.md TMV 72fc4ebdc BOD 18:2x 流转·R5 归 CHO）
- 勘定法: 四对逐对 patch-id --stable 双版比对 + commit 元数据（parent/author/committer 时戳）逐笔实读 + sg 检出 reflog 三轮 rebase 轨迹实锚 + 拓扑 merge-base 三向验证（bare 现顶线/github 线/检出线）

## §一 · patch-id 等价断言（R1 安全门输入·四对全 PASS）

| 对 | 检出版（重放副本） | bare 版（原版） | patch-id（--stable 双版同值） | 文件面 | 判定 |
|---|---|---|---|---|---|
| 1 | 539b204 | 5b7fafb | **fb5ca43da6f8121e6a87ef97dfbbde9e098cba56** | cos_decision_audit.py +119/-0 | 等价 ✓ |
| 2 | 194cede | 531e684 | **9a1ed7b6e4d748773ca210111c989cc1d181723a** | 同 +26/-6 | 等价 ✓ |
| 3 | e597936 | bc89ef0 | **ba0330be826dba3fae94d1d6c31fe891caa4c27c** | 同 +49/-6 | 等价 ✓ |
| 4 | c383dcf | 8148369 | **2b0e1df23a4b1c7cea3caa81de5b3c44783386be** | cos_decision_audit.py ±4 + fade_instance_audit.py +142 | 等价 ✓ |

- 四对 patch-id 两两全等=同 diff 逐字节等价（零内容差证明在先·SDE 可据采信）；commit message 逐对同文 ✓；文件面/增删行数逐对同构 ✓。
- 元数据逐笔实读：全 8 笔 author/committer=fleet（fleet@fleet.local·sg 检出统一用户·席别靠尾注 @m-duty-cho 署名）。

## §二 · 双写机理勘定（根因归因·CTO §一.21 双假说裁定）

**时间线（sg 检出 reflog 实锚·三轮 rebase）**：

1. **11-04 16:12:20 / 16:18:06 / 16:24:55 +0800**（原版自然施工链·时戳递增）：m-duty-cho 四笔施工（COS 裁决每日审计脚本族·CEO 11-04 16:01 令+16:12 第二令+LG 第三令）→推 bare（parent 链 1fc5414→5b7fafb→531e684→bc89ef0→8148369 连续自然）。施工位=河源 TriCompany 检出（CTO 判定卷「河源 github 顶历史=8148369 系」旁证+CEO 17:35 河源席卸载定向呼应）——**分叉源（河源席）已卸载绝灭**（CTO §一.21 假说一成立）。
2. **11-05 18:10:00 +0800 一轮**：sg 检出 `git pull --rebase origin dev`（**origin=/srv/git/TriCompany.git=sg bare**·remote url 实锚）——基底=bare 顶（81483697 已含原版四笔）→本地四笔副本 patch-id 相等**自动 drop**（该轮 pick 列表无四笔实锚）→674cc33。
3. **11-05 18:10:04 +0800 二轮**（间隔 4 秒·同施工动作两步）：`rebase (start): checkout refs/remotes/rpush-tmp/dev`（基底=**d98529b=github 顶·该线不含原版四笔**·实测 8148369 NOT in github 线）——四笔相对新基底「未应用」→**重放复活**（pick 四笔实锚·新 hash 539b204 系诞生·committer 时戳全被重写为 18:10:04 同秒）→b914d49（+orchestrate_tick pick）=**CTO 判定窗（18:17-18:21）读到的检出线·四对双写并存形态的诞生时刻**。
4. **11-05 18:23:02 +0800 三轮**（CTO 判定 18:21 后 2 分钟）：`rebase (start): checkout origin/dev`（回到 bare 顶）——四笔相对 bare 基底 patch-id 相等**再次自动 drop**（pick 列表无四笔实锚）→222beca4→推 bare。

**归因裁定**：

- **cho 侧无双 commit 行为**——单次施工四笔（11-04 自然时戳链实证）·是被复制的对象非复制行为主体。CTO「cho 四对同题异 hash 双写系主因」的精确化勘正：**cho 施工=内容源·双副本复制机制=sg 检出 18:10:04 二轮 rebase 基底轮换（bare↔rpush-tmp/github 交替作基底）下 patch-id 跳过失效区间的重放复活**。
- 双写主因=**多检出多通道拓扑+rebase 基底轮换**（bare/github/rpush-tmp 三通道交替·二轮换基底使已 drop 四笔复活·三轮换回又收敛）——非 amend（CTO 已勘「amend 系在链注记项」维持）·非同检出重复施工（CTO §一.21 假说二不成立·reflog drop/pick 轨迹实证）。
- rpush-tmp remote=config url 已空（残迹·临时通道用毕未清的配置残留形态）——通道卫生候 SDE/CTO 面清点。

## §三 · 现势勘定（SDE R1/R2 执行前提已变·必读）

1. **bare 顶=222beca4**（18:23:02 三轮 rebase+push·非 CTO 判定时点 81483697）——原版四笔在链（8148369 IN 222beca4 实测）·重放版已 drop（c383dcf NOT-IN 实测）——**bare 面双写已实质收敛·单副本态**。
2. **R1 前提失效**：force-with-lease expected=81483697 已过期（bare 顶已进至 222beca4·lease 自动拒=安全门自身防住）；且 R1 目标（bare 对齐检出线有效内容）已被三轮 rebase+push 事实上达成——**R1 建议改判：无需执行**（强推改写远端历史的动作面已无对象）。
3. **R2 前提已变**：merge-base(222beca4, d98529b)=**1fc5414**（11-04 12:21 CPO registry 笔）——222beca4 推 github=**NON-FF 分叉**（CTO「纯 FF 即成」读数基于 b914d49 时点·b914d49 基底=d98529b 当时是 FF；三轮 rebase 改基 bare 线后前提消失）——github 对齐候 CTO 改判（merge / force / 改基三形态·非本席域裁·如实呈）。
4. sg 检出现 dev=222beca4（与 bare 齐）·检出版四笔对象仅存 reflog（历史痕迹无链上活跃副本）；本机 TriCompany 检出 fetch 顶同步验证毕（origin/dev=d98529b）。

## §四 · 防复发注记（R5 落点·候 CTO/SDE 纪律化）

- CTO 方向（单检出施工/推前 fetch 对表）维持 ✓·机理补强两条：
  1. **rebase 基底固定单一源**：多通道拓扑下 rebase 基底轮换（origin↔临时 remote 交替）是副本复活机制——正形=一次同步会话内基底固定单一远端·基底切换须核对 rebase 输出 drop/pick 计数对预期（本轮三轮 drop→复活→drop 的摆动即缺此核对）。
  2. **临时 remote 用毕即删**：rpush-tmp 类临时通道 config 残迹（url 已空）是基底轮换的入口面——通道清点候纪律化。

## §五 · 使用依据

- patch-id/元数据实勘：本机 TriCompany 检出（bare 版 4 笔对象直读）+sg 检出 SSH（/srv/fleet/TriCompany·检出版 4 笔+reflog 全谱+remote config）双面取证
- 拓扑实锚：merge-base 三组（222beca4×d98529b=1fc5414·8148369 IN 222beca4·c383dcf NOT-IN）+github fetch（origin/dev=d98529b·8148369 NOT in github）
- CTO 判定卷：cto-form2-sg-verdict-and-reconcile.md（TMV 72fc4ebdc·§一 behind-4 勘定+§三 R1-R5 方案）
- 令源链：COS 排工投递 18:27:34（R5 归 CHO·免回执达线知会形态）

—— CHO 小源 · R5 归因报毕（毕报回 COS+BOD 抄 COO·R1 候投面）
