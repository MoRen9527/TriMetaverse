# r-plane-eval-01 · 改进计划卷（CTO 技术路线）

- 评估席：CTO 小狄
- 立卷时点：2026-11-04T05:36:48Z（13:36:48 +0800 date 现查）
- 配套评估卷：`cto-tech-maturity-eval-20261104.md`（证据与评级在彼卷，本卷只载行动）
- 排程纪律：P0 本窗可执行 / P1 下窗排程（D-23 查窗后落）/ P2 季度视野

## P0（本窗可执行）

### P0-1 ink 族死重清理（候裁项收口·本席裁决 APPROVE 附门禁）

- **背景**：2026-11-04 TUI 共有化段一（git 9dc5355）迁 src/tui→TriCode src/r-ink-tui，笔注「deps ink 族本单不清候 CTO 裁（勘定卷 d0cb28ff5/TMV）」——本卷即该候裁项裁决收口。
- **实勘证据**：20 项疑点依赖在 TriRLC src import 零（精确 pattern + raw 宽匹配双重复核；唯一 `marked` hit=interactions.ts:64 注释文本非 import）；TriCode package.json 已全量接手渲染族依赖声明（deps 19 项 + react/react-reconciler peerDependencies）。
- **裁决**：
  - 19 项无条件清理：`@alcalzone/ansi-tokenize` `bidi-js` `chalk` `cli-boxes` `code-excerpt` `emoji-regex` `figures` `get-east-asian-width` `indent-string` `string-width` `strip-ansi` `supports-hyperlinks` `wrap-ansi` `yoga-layout` `yoga-layout-prebuilt` `auto-bind` `lodash-es` `marked` `usehooks-ts`
  - `react` `react-reconciler` 两项特殊处理：TriCode peerDependencies 指向它们，npm peer 自动解析下预期可清，但**以实测为门禁**——移除后 npm install 若现 peer 告警/缺件则单项回装（peer 链以安装器实际行为为准，不拍脑袋）。
- **执行门禁（三序全绿方闭卷）**：① package.json 清单+`npm install` 重锁 lockfile；② `npm run check`（tsc noEmit）零红；③ 全量回归 655/655 零红。任一不达→单项回装该依赖并记录原因（回滚姿态=单项回装，分钟级）。
- **两域同步**：M 面同仓同裁同门禁（防两域 lockfile 漂移）；施工面派 FSD，本席验收。
- 备注：sg 侧现勘 `node_modules/` 未在位（react 不在），执行窗须先确认安装态基线。

### P0-2 Code Registry 漂移修正（本席 CodeRegistry owner 权界内）

- code-state.md 依赖行 `@trimetaverse/agent-core` (file:../TriMMC/packages/agent-core) → 实况 `@tricompany/agent-core` (file:../TriCompany/packages/agent-core)，改正并附依据（本评估卷+package.json 现勘）。
- 同步核对该文件其余 2026-09 前旧段落时效（Test-Guide 改名波及面快扫）。

## P1（下窗排程·D-23 查窗后落）

### P1-1 server/app.ts 巨石拆分（5673 行）

- **契约测试先行锚**：8711 端点契约测试（/healthz、/internal/v1/heartbeat、/internal/v1/agent、replay 链行为断言）先落，锁行为基线；再物理拆分（建议端点族+routes 注册表模式：healthz/heartbeat/agent/proxy-fallback/replay 五族）。
- 拆分属实现面工程，派 FSD 执行、STE 门禁验证、本席验收——架构裁决本席已给（注册表模式不引新框架）。

### P1-2 8711 API 契约面文档化

- 端点清单+双 wire 协议（anthropic/openai-stream）独立契约文档+契约测试；契约系 TriMMC 兼容跨模块资产，现散在 app.ts 巨石内系风险（TriMMC 侧协同变更无契约锚）。
- 文档落 TriRLC docs/engineering/，契约测试入 test/。

### P1-3 TriLC 旧名残留收尾

- TriPilot `TriLCClient.ts`（427 行）等改名波及面清理；纯改名 commit（零行为变更），两域同步。

## P2（季度视野）

- P2-1 TriPilot 版本语义校准（0.0.13→0.1.x 语义化里程碑）。
- P2-2 registry 级代码健康评分+git 健康摘要补齐（code-state 自述缺口）。
- P2-3 STATE.md 补齐（与 code-state 厚薄均衡；补实现进度/技术风险/质量状态三段）。

## 风险与缓解

| 风险 | 缓解 |
|---|---|
| ink 清理踩 peer 解析行为差异 | react/react-reconciler 以安装实测为门禁+单项回装回滚 |
| app.ts 拆分行为漂移 | 契约测试先行锚+分族小步+每步全量回归 |
| M 面基准引述时效 | 卷内已声明；收口时 M 面席位复核对表 |
| registry 修正漏波及面 | P0-2 附带旧段落时效快扫 |

## 收口对账

- 本卷 P0-1 即 9dc5355 笔注候裁项之裁决正身；FSD 施工回执时引本卷 §P0-1 为据。
- 两卷落树目录 reports/；认领行已经跨会话消息报值席（msg 8d443f12）。
