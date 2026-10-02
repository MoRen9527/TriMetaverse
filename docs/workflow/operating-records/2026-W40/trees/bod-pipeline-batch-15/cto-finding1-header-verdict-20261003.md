# 发现项①裁修卷：triladder a1 shutdown 默认头族（CTO 速裁，10-03 凌晨窗）

- sourceOfTruth: 本件（发现项 1 裁修正身；令源=COO 02:4x 裁修法令，STE 验证卷 f37e878e 发现项 1 候裁）
- syncMode: final
- lastSyncedAt: 2026-10-03 02:50:55 +0800（date 现查贴原值；实勘读数时点 02:45-02:50 随文标注）
- 裁定席: CTO 小狄（m-cto）；速裁面零代码动笔 ✓；值面零出机 ✓（活体探针仅出状态码）

## 一、裁定总表

| 项 | 裁态 |
|---|---|
| 发现项 1 原「令头族不匹配致 shutdown 401」定性 | **驳回**——断言被源码+活体双重证伪 |
| triladder.ps1 代码 | **零修**（默认头形实际可达，无功能缺陷） |
| FSD 窗修归属 | **无窗修需求**；随行两笔低烈度候办归维护批攒（§四） |
| STE 验证卷发现项 1 勘正 | 候 STE 面（验证卷=STE 归属域，本席不代改） |

## 二、证伪证据链（五段）

### 1. 服务端 fallback 静态实锚（两仓同族）

- TriMLC `src/server/app.ts` **L132-141** `extractInternalToken`：先查 `x-internal-token`（裸值，优先形）→ **L138-139 fallback：`authorization` 头 `Bearer ` 前缀 → `slice(7)` 取裸值比对**。
- TriRLC `src/server/app.ts` **L135-142** 同函数同构（行级同形，三行偏移）——两 daemon（8711/8713）门实现同族，fallback 双在。

### 2. /shutdown 过门实锚

- TriMLC app.ts：token 门 L1756-1771（fail-closed，错/缺令 401 return）→ 门后同 handler 顺序路由链：config 族 L1778 起 → notifications L4263 → **/shutdown L4275 同层在门内**。
- TriRLC app.ts：门 L1801 用同函数；/shutdown L4573 同构 if 链门后（旁证级；两仓 app.ts 镜像族，TriMLC L1756 注释自承镜像）。
- 即：POST /shutdown 过 extractInternalToken 门 → **Bearer 形（triladder 默认头形）被 fallback 接受**。

### 3. 活体三态对照（02:50 现测，8713 TriMLC 在役 pid 22556）

| 形 | 读数 | 判读 |
|---|---|---|
| 无令 GET /internal/v1/models | **401** | 门活体在位（fail-closed enforce 中） |
| 对令 `Authorization: Bearer <令>`（=triladder 默认形） | **404** | **过门**（门内失败是 401 非 404；404=过门后路由未命中——8713 无 models 路由） |
| 对令 `X-Internal-Token: <令>`（裸值形） | **404** | 同过门（对照形） |

- 值面纪律：令自 channel.cmd L15 内存流转，仅出状态码，零回显 ✓。
- X-Internal-Token 形路由命中 200 正样本：STE 验证卷 P1（probe=200）已有在卷，不复测。

### 4. FSD 知情设计旁证

triladder.ps1 ce70115：L49 参数注释「daemon 门=TRILC_INTERNAL_TOKEN 可用 X-Internal-Token（裸值）；默认 Bearer」+L113「Authorization=Bearer 前缀形；X-Internal-Token=裸值形（TriRLC/TriMLC app.ts 门优先头）」——**默认 Bearer 系知情选形**（依赖服务端 fallback），非无知笔误。

### 5. STE 误读根因定性

验证卷 P3/P4 的 401 读数系**无令/错令**形态（probe-unauthenticated/auth-rejected），验证时未测「**对令+Bearer 形**」组合即推断「真动作 shutdown 会 401」——失效推断，非实录（A1-4 是 dry-run，plan 行如实显示默认头名，本身无错）。「令头族不匹配」表述差半步：头族确异（Authorization vs X-Internal-Token），但服务端 fallback 使两族**等价可达**。

## 三、对 COO 三态的裁答

- **非「修法指定」**：无功能缺陷可修——默认形活体可达，T-1 优雅停设计目标实际不受损。
- **非「降级定性」**：无需用法面约定显式 `-TokenHeader X-Internal-Token`——默认形即工作，强制显式传参是给调用方加无谓负担。
- **裁=驳回维持**（第三态）：代码零修、用法零变更、daemon 门零动。

## 四、随行两笔低烈度候办（归维护批攒，非本单动笔）

1. **a1 头注一行补注**（triladder.ps1 L49 注释尾追加）：「默认 Bearer 形走服务端 fallback（extractInternalToken L138-139）；daemon 门若收紧移除 fallback，须 -TokenHeader X-Internal-Token」——一行注释级，与发现项 2（a3 bak 缺失文案，验证卷候 FSD 属窗修）**同批维护窗**攒办最经济。
2. **门 fallback 观察项**：本裁成立依赖服务端 fallback 形在册——若未来 TriRLC/TriMLC 门收紧（只留 X-Internal-Token），triladder 默认头全失效族。入观察清单（触发条件=daemon 门认证实现变更），非定期巡检项。

## 五、STE 验证卷勘正候办（STE 面）

验证卷发现项 1 段（§三.1）定性勘正候 STE 自办：断言「真动作时 shutdown 会 401」→ 实情「默认 Bearer 形经门 fallback 可达，shutdown 正常工作」。按真源可修+修正留痕口径。本席不代改（归属域分流）。COO/BOD 收口引用发现项 1 时以本卷为准。

## 使用依据

- COO 02:4x 裁修法令；STE 验证卷 f37e878e（ste-batch15-1-verification-readout-20261003.md，全文 72 行）发现项 1+A1-4+P1/P3/P4 读数
- 源码实勘（02:45-02:47）：TriMLC app.ts L132-141/L1738-1792/L4258-4284；TriRLC app.ts L135-142/L1801/L4573（grep 定位）；triladder.ps1 ce70115 L49/L112-116/L182/L203/L231/L247-248
- 活体实勘（02:50，只读 GET 三态，值面零出机）：8713 在役 pid 22556；无令 401/Bearer 404/X-Internal-Token 404
- 关联在案：daemon 门 fail-closed 体系（TRILC_INTERNAL_TOKEN 请求期读取，TriMLC L1756-1759 注释）；channel.cmd L15=8713 令源（本席 02:02 结构勘实锚）
