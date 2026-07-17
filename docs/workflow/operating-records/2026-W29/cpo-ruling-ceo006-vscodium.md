# CPO 裁决：CEO-006 PC 端宿主形态（vscodium vs 纯 Electron）

> 裁决人：ChiefProductOfficer（小乔）
> 日期：2026-07-17
> 上游：CTO-008-P 技术方案 + 小贾技术审阅（APPROVE）+ CEO 路由指令
> 关联路由：`cpo-routing-cto008p-followup.md`

---

## 裁决：APPROVE 方案 A（vscodium）

**Phase 1 使用 vscodium 作为 PC 端 IDE 宿主。不做纯 Electron 自定义聊天 UI。**

## 理由

| 考量 | 结论 |
|---|---|
| MVP 速度 | vscodium 零 UI 开发成本，P1 可直启。纯 Electron 需额外聊天 UI + agent 交互界面，至少 2-3 迭代 |
| 已有资产 | TriPilot 已是 VS Code 扩展，vscodium 是天然宿主。切纯 Electron 意味着重写或双轨维护 |
| Phase 适配 | Phase 1 目标"跑通闭环"，不是品牌差异化。Cursor/Windsurf 级体验是 Phase 3 事项 |
| 生态保留 | vscodium 继承 VS Code 扩展生态，未来插件市场、主题、快捷键零成本 |

## 不排斥的未来路径

本裁决不禁止 Phase 3+ 重新评估纯 Electron 自定义 UI。届时若有独立前端团队 + 品牌差异化需求，可重新提案到 CPO。

## 闭环确认

- CTO-008-P 设计无需修改
- P1 按现有方案启动（待周度平移确认 W30 排期）
- CEO-006 产品决策侧闭环

## 使用依据

- CTO-008-P 技术方案（小贾 APPROVE 技术面）
- CPO 前序裁决 #9-#11（PC 验收门禁、简化模式、插件市场）
- TriCompany product-state.md §Simplest Verifiable Model
