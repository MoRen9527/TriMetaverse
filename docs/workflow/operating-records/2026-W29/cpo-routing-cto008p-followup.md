# CPO 路由：CTO-008-P vscodium vs 纯 Electron 产品决策

> 发起人：CEOChiefOfStaff（小贾）
> 受理人：ChiefProductOfficer（CPO）
> 日期：2026-07-17
> 上游：CTO-008-P 审阅完成（小贾 APPROVE 技术面），CEO 指令路由

---

## 背景

CTO-008-P（PC 端 Electron 打包技术方案）已由小狄完成设计，小贾完成技术审阅，**技术面 APPROVE**。

当前方案复用 **vscodium** 作为 IDE 宿主（"四合一"：vscodium + TriPilot + TriCode + TriLC）。CTO 在 Section 八.1 中主动提出是否考虑纯 Electron 自定义 UI（类似 Cursor/Windsurf 做法），等待产品决策。

## 待 CPO 裁决

**PC 端 IDE 宿主形态：vscodium vs 纯 Electron 自定义 UI？**

| 方案 | 说明 |
|---|---|
| **A: vscodium（当前设计）** | 复用开源 VS Code 内核，TriPilot 作为 VS Code 扩展运行。优势：零 IDE 开发成本、VS Code 生态兼容。劣势：UI 定制受限、用户感知是"另一个 VS Code"。 |
| **B: 纯 Electron 自定义 UI** | 自建 Electron 聊天式界面（类似 Cursor/Windsurf），TriPilot 内嵌其中。优势：品牌独立、体验可控、新用户认知负荷低。劣势：需额外 UI 开发、放弃 VS Code 扩展生态。 |

## 技术面影响

- 方案 A：P1 可直接启动（CTO-008-P 已设计完整）
- 方案 B：需 CTO 补充自定义 UI 设计，P1 范围扩大

## 时效

不阻塞 P0（P0 已交付）。需在 **P1 启动前** 裁决（P1 预计 W30 后，具体待周度平移确认）。

---

## 小贾附注

- CTO-008-P 全文见 `docs/engineering/cto-008-P-pc-electron-packaging.md`
- 上游 CPO 裁决 #9-11（PC 验收门禁、简化模式、插件市场）已在设计中全部对齐
- 此项裁决后，CEO-006（PC 端打包产品决策）即可闭环
