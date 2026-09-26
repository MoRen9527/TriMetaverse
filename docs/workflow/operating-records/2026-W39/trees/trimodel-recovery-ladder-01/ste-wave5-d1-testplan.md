# STE 波⑤ D1 回头测案表+环境预备（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件=STE 席波⑤ 测试案表正身（拆派单 dispatch-wave5.md @ 99ef7487 派）
- syncMode: working
- lastSyncedAt: 2026-09-26T08:1xZ（date 现查 16:10 hook 链）
- 席位: STE 小柯（m-ste）
- 状态: **方案预备期——FSD 修复未落，不动实弹**

## 一、环境预备清单（已勘定）

| # | 项 | 勘定读数 | 状态 |
| --- | --- | --- | --- |
| E-1 | UI 服务形态 | TriModel server `/ui` 静态面（src/server.ts L26-48）；卡通道=**`/v1/config/trimmc-card`**（ui/index.html L339 GET 探测+tcSave PUT 同端点） | ✓ 勘定 |
| E-2 | 沙箱隔离法 | E10 装置形态：mkdtemp+handlePutTrimmcCard `{cardPath}` opt——**零触生产卡**（生产 3333 全程不碰） | ✓ 勘定 |
| E-3 | 真 reload 驱动 | playwright-core 1.63.0（devDeps）+page.reload()（E10 母版 test/ui-e10-reload.test.ts）；浏览器：本机 Chrome ✓+ms-playwright chromium-1228 ✓；门=`TRICOMPANY_ENABLE_TRIMODEL_UI_E2E=1` | ✓ 勘定 |
| E-4 | jsdom 首启装置 | test/ui-boot.test.ts（首启五断言+bootUi fetch stub 形态）+ui-e11（退役回归）既有在套 | ✓ 勘定 |
| E-5 | v4 种子卡 fixture | 骨架形=ui-boot L30（version 4/machine/connection/provider_entries/model_sets/rules/strategies/active_strategy_id/default_model/status/reserved）；策略对象字段候 P1（trimmc-card.ts types+现役卡只读参照后定稿） | P1 |
| E-6 | 沙箱根 | `D:\tmp\ste-wave5\`（截图卷+装置工作区，新建） | P2 |
| E-7 | 修复前基线读数 | FSD 动笔前跑既有全量套（默认门）+E0 装置自证——修复后对照锚 | P2 |

## 二、案表（12 案，映射验收门五扇）

### 门① D1 修复实弹（硬核判据·第四型盲区纪律）

| 案 | 输入/操作 | 预期 | 断言面 |
| --- | --- | --- | --- |
| C1 | 删除非活动策略 A→保存→**page.reload()** | A 消失不复活 | 三面：DOM 无 A 行+沙箱卡 strategies 无 A id+`deleted_strategy_ids` 含 A（声明字段保留语义） |
| C2 | reload 后第二轮编辑再保存 | A 持续不复活 | 卡文件 A id 仍缺（L130 浅合并复活机制回归面——声明通道持续生效） |

### 门② 对照通道零回归

| 案 | 输入/操作 | 预期 |
| --- | --- | --- |
| C3 | 模型集删除→保存→reload→断言消失 | deleted_model_set_ids 通道同周期绿 |
| C4 | 规则删除→保存→reload→断言消失 | deleted_rule_ids 通道同周期绿 |
| C5 | 既有套全绿读数 | e10/e11/ui-boot+全量既有套（npm test）修复后零新增失败 |

### 门③ 非作者手测+首启链

| 案 | 输入/操作 | 预期 |
| --- | --- | --- |
| C6 | jsdom 首启五断言（既有）+v4 含策略卡 boot 冒烟 | boot 对策略表渲染不崩（ui-boot 装置复用） |
| C7 | STE 手测（非作者门）：playwright 真 Chrome 逐步操作+**逐步截图** | 连接态→策略表渲染→删除交互→保存反馈→reload 后状态全链人工判读；截图卷=D:\tmp\ste-wave5\ |

### 门④ 边界案三则+清空对齐

| 案 | 输入/操作 | 预期 |
| --- | --- | --- |
| C8 | 未保存即 reload（删除→不保存→reload） | 策略仍在=未保存回滚语义（合理语义裁定面） |
| C9 | 重复删除同 id（删 A→脏态再删 A→保存） | PUT body `deleted_strategy_ids` 无重复 id（防重复 push 对齐——FSD 修复笔 1 对象） |
| C10a | 前端活动守卫：删活动策略 | 删除拒绝/提示，卡零变化 |
| C10b | 服务端 400 守卫（API 直打）：PUT deleted_strategy_ids=[active_id] | 400「活动策略使用中，请先切换」（handlePutTrimmcCard 直调） |
| C11 | 保存后通道清空对齐：删 A→保存→删 B→保存 | 第二次 PUT body 只含 B 不含 A（tcDeletedStrategyIds 清空与 tcDeleted 系形态对齐——FSD 修复笔 3 对象） |

### 门⑤ 冻结面零扩散

| 案 | 输入/操作 | 预期 |
| --- | --- | --- |
| C12 | git diff ui/index.html（FSD 修复笔 vs HEAD）逐行对表 | 只动：删除 handler push 笔+PUT body 一行+清空/hydrate 对齐；活动守卫/服务端面/无关行零触碰 |

### E0 装置自证（预备期可选，候 CTO 采认）

沙箱装置对**现势未修 UI** 预跑 C1 形——预期**复活复现**（删除→保存→reload→策略回来）=装置效度自证（能抓到 bug 的装置才配验修复）。全沙箱零生产触，属环境自检非实弹。

## 三、时序对齐（照拆派单）

1. 现在：案表回执（本件）+P1 种子 fixture 定稿+P2 沙箱根/基线预备；
2. FSD 电池门翻位窗毕→波⑤ 修复两笔→修复毕报；
3. 修复毕→本席实弹：C12 diff 核验→C1/C2 硬核→C3/C4 对照→C6-C11→C5 全量读数→全量四项读数回报；
4. 本席判定→CTO 验收门五扇签认→LG-053「D1 测毕」条件达成。

## 使用依据

dispatch-wave5.md @ 99ef7487；fsd-wave5-d1-survey.md @ b91e8340；test/ui-e10-reload.test.ts（E2E 母版）；test/ui-boot.test.ts（jsdom 首启装置）；src/api/trimmc-card.ts（服务端通道+cardPath opt）；src/server.ts（/ui 面）；package.json（playwright-core/jsdom devDeps）。
