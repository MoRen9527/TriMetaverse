# CTO 技术门裁定 · LG-058 走查 P1（menu-full 左右布局不兑现）

- sourceOfTruth: 本件（CTO 裁定正身；走查卷=df1ab55d，BOD 快核令 11:2x）
- syncMode: final
- lastSyncedAt: 2026-10-06T03:26+0800（date 现查 2026-10-06T03:2xZ；独立验=TriModel 12caab0 工作树源码直读）
- 裁定席: CTO 小狄（m-cto）

## 裁定

**P1 定谳成立，裁必修；修复口径=案一——`<nav id="page-menu">` 移入 `<div id="app-layout">` 容器内（首个子节点，置于 `<main id="page-main">` 前），CSS/JS 零改。案二（body 级 flex）否决。**

## 代码面依据（四点实锚）

1. **DOM 错位坐实**：ui/index.html L98 nav 与 L100 app-layout 系 body 兄弟节点；flex 宿主=L71 `body.menu-full #app-layout{display:flex}`，L72 `#page-menu{flex:0 0 210px}` 系 flex **item** 属性、宿主外无效——210px 侧栏结构性不可达，CEO #1「分左右」视觉不可兑现（STE §2.1 三层证据与源码一致）。
2. **案一零涟漪**：`#app-layout` 无任何基础规则（仅 menu-full 三条 L71/74/76）——nav 移入后默认形态零变化；JS 仅 id 查找（L409/L427）+body 类切换（L1130），零位置依赖。CSS 本按「nav 是 app-layout flex item」意图书写，案一即兑现原意。
3. **案二否决**：body 直子节点含 `<details id="conn-settings">`（L85 连接面板）——body 级 flex 将其拖入 flex 流，需额外排除/包裹规则，侵入面反大于案一，违最小变更。
4. **归口**：N5 承接面实现走样（CPO IA 方稿 §4.2 情形 1 验收锚未兑现），实现修复不动 CPO 件（同 BOD 卷面注）；CEO #1 原判归口 CPO 讲解件勘误已落（ab1aecc5）。

## 门禁附款（施工一并带）

ui-fourplane 断言增补须**双断言**：①结构=`nav.parentElement===app-layout`；②**几何=menu-full 宽视口下 `menuRect.right<=mainRect.left`**（禁上下堆叠复现）——几何才是「分左右」的真回归门，只断父节点防不住形态走样。可选微整（非阻塞）：L72 menu-full 态 nav `margin:0`（L66 基础 12px 下边距入 flex 行无害，FSD 视觉自酌）。

## 流程与仓面

FSD 案一施工（N5 单点回炉）→STE 单点复验（非作者、同沙箱形）→BOD 终裁→升版触发。TriModel 仓独立于今晚 TriRLC 窗（b14/SDE 根治窗/FSD stop 修），无同仓串行约束；施工时点 D-23 对表归 FSD/COO。

## 并裁两件（BOD 同批）

- **件② TriRMC Employee Registry `expected 14 got 15`**：知情认收，跨仓硬编码漂移定谳。owner=FSD 车道（TriRMC 测试维护波候办另立）；技术方向裁**期待值活读 contract 源**（测试时自 v3 contract 源派生条目数，弃硬编码字面量）——「随源同步」系弱补丁，席位每增删必复发，活读为结构性根治。不阻本波收口。
- **件③观察项 B/C/D/E**：知情，产品语义候 CPO。C 条（清空语义缺口）技术注记候 CPO 定义后消费：「卡面已清、机器未清」分叉的正解二择一——daemon 落空配置（清 settings.json）或 UI 显式呈报分叉态，勿留静默分叉。

## 使用依据

- STE 走查卷 df1ab55d §2.1/§五/§六.2/§七；BOD 快核令 11:2x（回执 b6dea60a）；STE 回执 a3690247
- TriModel 12caab0 工作树：ui/index.html L66/71/72/74/76/85/98/100/409/427/1130 直读
- 纪律：LG-035「纸面合格≠实现合格」/MVP 划线（核心原始需求不划出首版）/UI 交付渲染验证门
