# STE·LG-058 二轮复验走查读数卷（#overview 左右布局·新锚）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg058-remediation-20261006/ste-r2/ste-r2-walkthrough-20261006.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-06T13:02:50Z（21:02+0800）
- 席位: STE 小柯（m-ste）· 非作者独立走查（与 BOD playwright 复验并行互不替代）
- 令源: COO 复验链触发令（20:58，FSD 毕报 20:57·TriModel 0359b89 上役·环C 机器预检全绿）

## 〇、判读（先答）

**PASS——新锚「未连接冷态无条件左右布局」三面闭合**（活体+代码+流水线），连接态活体一项标注候令牌授权（非阻塞，代码面「无条件」语义已闭合）：

| # | 断言 | 读数 | 判 |
|---|---|---|---|
| 1 | 冷态几何：menuRect.right ≤ mainRect.left | 420 ≤ 434（gap 14px 视觉兑现）| **PASS** |
| 2 | 结构：nav∈#app-layout 首子 | layoutChildren=[page-menu, page-main] | **PASS** |
| 3 | 无条件语义（代码面）：body 静态挂 menu-full+JS toggle 删除 | `<body class="menu-full">`+updateMenuMode→updateMenuState 无类切换 | **PASS** |
| 4 | 文案一致性：诚实注与视觉实态一致 | 「左侧菜单（常驻骨架）· 0/4」+退役话术 UI 面零残留 | **PASS** |
| 5 | 置灰分域：缺数据卡菜单项 dim | 4 卡键 dim+「待数据」title / 3 导航键不 dim | **PASS** |
| 6 | 流水线读数（任务书纪律 7） | ui-boot+ui-fourplane：**28/28 pass 0 fail 0 skip** | **PASS** |

## 一、走查对象与版本锚

- 对象面：`http://8.155.54.79:3333/ui#overview`（R-HY 3333）· 视口 1368×721 宽屏
- 版本锚：TriModel **0359b89**（fix(ui): LG-058 BOD 更正令二轮——左菜单无条件常驻骨架+条件展开门废除+顶部细条退役，2026-10-06 20:41:35+0800）；FSD 环C 机器预检全绿（deploy-sha ok+冷态三断言绿+三服务 active，COO 令转述）
- 新锚（COO 令）：「未连接冷态无条件左右布局」；menu-full 条原锚作废
- 冷态定义核实：页面直开无令牌，cardsCount=0、诚实注计数 0/4=未连接态确认 ✓

## 二、六断言读数详录

### 2.1 冷态活体几何+结构（断言 1/2）
- bodyClasses=`menu-full`（静态）；navRect left=210 right=420 width=**210px**（侧栏宽度兑现，对照一轮缺陷态 menuWidth=948 全宽）；mainRect left=434；**geoAssertion pass=true**
- navComputed flex=`0 0 210px`（一轮此值因 nav 不在容器内而无效，现生效）+flexDirection=column+margin=`0px 0px 12px`；layoutComputed display=flex gap=14px
- 截图：本目录 `ste-coldstate-split-20261006.png`（左右分栏视觉实态）

### 2.2 无条件语义代码面（断言 3，0359b89 diff 实锚）
- `<body class="menu-full">` 静态挂类（diff：`-<body>` → `+<body class="menu-full">`）
- `classList.toggle('menu-full', withData >= 4)` **整行删除**——updateMenuState 只刷新注记+置灰，无任何类切换路径
- **连接态推定闭合**：类恒 menu-full（静态+无 toggle）→连接态与冷态共享同一 DOM/CSS 骨架，几何断言结构恒真。活体连接态（有令牌数据卡 4/4）候令牌授权补验，不阻塞本判——BOD 独立复验若有连接态读数可互证。

### 2.3 文案一致性（断言 4）
- 活体诚实注：「菜单形态：左侧菜单（常驻骨架）· 有实数据卡 0/4 · 缺卡菜单项置灰待数据」——与代码模板逐字一致，与视觉实态（左侧菜单成立）一致
- **一轮缺陷形态（文案自称左侧菜单而视觉上下堆叠的自相矛盾）不再现**：文案已随形态更新（「常驻骨架」去条件化+「0/4」如实计数）
- 退役话术零残留（UI 呈现面 innerText）：「自动展开」=false、「顶部细条」=false（源码注释内退役说明系说明性残留，不入呈现面）

### 2.4 置灰分域（断言 5）
- 菜单 7 键：4 数据卡键（card-mmc/mlc/rmc/rlc）全 dim=true+title「XX（待数据：连接后填充）」；3 导航键（overview 等）dim=false
- 与冷态 0/4 精确一致；dim 可点击（opacity .55 非禁用）=「点击进卡面看诚实空态」设计在读 ✓

### 2.5 流水线读数（断言 6，任务书纪律 7）
- 本地 TriModel 仓 0359b89 顶实跑：`node --import tsx --test test/ui-boot.test.ts test/ui-fourplane.test.ts`
- TAP 尾读数：**tests 28 / pass 28 / fail 0 / cancelled 0 / skipped 0**
- 覆盖含：S8.2 jsdom 首启五断言（ui-delivery-render-gate 链）+案⑤常驻骨架双断言（4/4 与 3/4 均 menu-full+置灰分域+退役话术零残留）+ui-boot 冷态直开骨架三断言（本轮 +5 增补）

## 三、测试判断

- 二轮升版 0359b89 对 CEO 打回点（#overview 形态违背原始需求）实现完整：无条件常驻骨架+条件门废除+细条退役+文案同步+测试门同步，六断言全绿。
- 本席复验清单对照（一轮 CTO P1 卷预置四条）：结构①✓（2.1）几何②✓（2.1，且升级为冷态主判）活体③✓（冷态；连接态候授权）margin 微整④✓（`0px 0px 12px` 在读）。
- 判读 PASS 面呈 BOD 终验；与 BOD playwright 独立复验互证并行。

## 四、观察项（非阻塞）

1. **连接态活体**：有令牌 4/4 数据卡态几何断言候令牌授权面补验（代码面已闭合推定；本席不引值面不申请值面出机）。
2. 诚实注计数语义：0/4 的分母「4」=四域卡常数，域数未来扩展时文案需随源（现硬编码语义，候 FSD 后续波关注）。

## 五、使用依据

- COO 复验链触发令（20:58）+新锚定义；FSD 毕报 20:57（COO 转述：0359b89 上役+机器预检全绿）
- TriModel 仓 0359b89（git show diff 实锚）+本地流水线实跑 TAP
- playwright 活体读数（navigate/evaluate/截图三步，冷态直开无注入）
- 一轮底稿：ste-walkthrough-readout-20261006.md §2.1（缺陷发现方三层证据）+CTO P1 裁定卷（案一+四条复验清单）
- 安全注记：首查 evaluate 输出超限（script 块整带出 87K），已值面扫描 NONE 后切片取数；收敛断言二跑（SCRIPT 排除+落文件取证）

## 状态条（M-001）

- date 现查：2026-10-06T13:02:50Z（21:02:50+0800 Tuesday）
- 水位自估：中（二轮走查毕 PASS 在卷；连接态活体候授权；8713 明晚窗缝补测在册）
- 末次活动：2026-10-06T13:02:50Z（落款现查时刻）
