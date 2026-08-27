# PE-1 修复报告（P0-1 stream 流中途 fallback 静默拼接）

- 节点：p0fix4-trimodel-stream / PE-1 ｜ 实例：FullStackDeveloper（fresh），一次一节点，先写后报
- 工作底本：reports/pe1/client.ts.fixed（编排层预置、git diff --no-index 零差异验证过的 /srv/fleet/TriModel/src/client.ts 副本）
- 边界遵守：全部落盘仅本树两文件；未触碰 /srv/fleet/TriModel/{src,test}/**；未运行任何命令。

## 1. 审计复现场景提取（rmc-TriModel.md P0-1）

- 位置：src/client.ts:216-229（stream 的 try/catch）——for await 把 provider 事件原样 yield 给调用方；catch :220 只要 route.fallback 存在就从 fallback 模型整轮重启生成（:221-227）并继续向同一消费者 yield，全程无"模型已切换"标记。
- 后果 a：文本流 = 截断的 A 模型输出 + 完整的 B 模型输出，内容重复交错、语义断裂。
- 后果 b：A 已 yield 的 tool_calls 增量分片，遭 B 重生调用按 StreamEvent.tool_calls 的 index 增量合并契约（types.ts:58-72，:61-62 契约注释明示 merge by index）同 index 覆盖/拼接，产出损坏调用参数并直接流入调用方工具执行层。
- 触发场景：流式调用（模块对外核心能力）+ 上游流中途失败（SSE 中途断流即可触发）——这正是 fallback 机制设计要覆盖的目标场景，在该场景下必然产出静默损坏。

## 2. 修复设计

### 2.1 契约图景：两条失败路径 × 有无 fallback 的四象限行为表

| 失败时机 | route.fallback 存在 | 行为 |
| --- | --- | --- |
| 首个事件前（emitted=false） | 是 | console.warn 原样保留 → 递归 this.stream(route.fallback, ..., _depth+1)；chat() 同款 fallback 路径，代码逐字未动 |
| 首个事件前（emitted=false） | 否 | throw error：原错误原样抛出不动（表面与 chat() 无 fallback 一致） |
| 已 yield ≥1 之后（emitted=true） | 是 | 终止流并抛 StreamAbortedError(message 含 model 与 aborted-in-stream 说明, {cause: 原错误})；fallback 一律禁止 |
| 已 yield ≥1 之后（emitted=true） | 否 | 同样抛 StreamAbortedError 包装，使上层统一辨型、无需感知路由是否配了 fallback（编排层裁定口径，如实转述） |

### 2.2 emitted 追踪与递归嵌套的 emit 归属

- emitted 为每个 stream() 调用帧私有的局部旗标（非实例/模块字段）：递归嵌套帧各持一份，互不读写、互不清零，杜绝并发或嵌套委托下的跨帧串扰。
- 自增先于 yield：首个交给下游的事件在控制权让出前已翻旗；其后任何失败（含消费者 throw 进生成器、provider 侧迭代异常）都落在 emitted=true 态，判定不漏。
- 归属链：A 帧首事件前失败且有 fallback 时在自身 catch 内委托 B 帧；B 的事件经 A 的委托 for-await 直通调用方，A.emitted 保持 false（A 帧委托循环内不自增）；若 B 中途失败且已发 ≥1 事件，StreamAbortedError 由 B 抛出、穿透 A 的 catch 委托块直达调用方——仅包装一层，message 指认真正断流的 B 模型，不会被 A 二次包装。
- 非侵入核对：调用方对生成器 .return() 提前终止走 return completion，不进 catch，不误报 abort；_depth 上限与 Unknown model / Provider not found 判定均在 try 之外，行为不变。

### 2.3 契约第 6 条的作用域落地说明（如实申报）

- "置于 try 内、for-await 循环外"落地为：紧贴 try 之前一行声明、循环外自增。原因：ES 块级作用域下，声明于 try{} 体内的变量对 catch 不可见，而四象限判定必须由 catch 读取该旗标——按字面塞进 try{} 内则契约语义无法实现。此偏差已在源码就地注释言明；硬性意图（单次尝试一面旗、不逐次重置、yield 前置自增、每帧独立）全部满足。

## 3. 变更清单（3 hunks，其余字节保真）

### Hunk A — 新增导出类 StreamAbortedError，置于 ModelClient 类定义之前

- 锚点原文（buildRegistry 收尾）：`}` 空行 `export class ModelClient {` + private providers 行；在中间插入净增 13 行（jsdoc 6、类体 6、随后空行 1）。
- 新文核心（上置 jsdoc 说明 P0-1 触发条件与 cause 传透；node >=16.9 支持 Error options，工程 tsconfig target ES2022 / engines node>=20 双面确认类型与运行时均合法）：

```ts
export class StreamAbortedError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'StreamAbortedError';
  }
}
```

### Hunk C — stream() 头部补契约注释（既有 docstring 行逐字保留）

- 锚点原文：`  /** CTO-003 P1: Streaming chat with provider fallback (same pattern as chat(), with depth limit). */` 加方法签名行；两者间插入 15 行 // 注释。
- 注释覆盖：fallback 仅限首事件前且有 route.fallback（递归 _depth+1）；已发 ≥1 事件后一律禁止 fallback（文本截断 A+全 B、tool_calls 按 index 合并被污染，指向 types.ts StreamEvent）；已发后失败无论有无 fallback 都抛 StreamAbortedError（message 含 model、cause 携原错误，供上层按类型辨析中途中止）；首事件前且无 fallback 原样抛；重试责任在上层、重试应整体替换而非续接部分输出。

### Hunk B — stream() try/catch 本体（fallback 分支文字逐字保留）

- 锚点原文：原 `try { for await … yield; } catch (error) { if (route.fallback) { …递归… return; } throw error; }` 全块（底本 :226-240）。
- 新文：try 前置 `let emitted = false;`（带 5 行注释含 scoping 说明）；循环体内 `emitted = true;` 先于 `yield event;`；catch 首分支：

```ts
if (emitted) {
  throw new StreamAbortedError(
    `Stream aborted-in-stream: model '${model}' failed after partial events were already yielded to the caller; silent fallback splice is forbidden (audit P0-1), original failure attached as cause.`,
    { cause: error },
  );
}
```

- 其后 `if (route.fallback)` 分支（console.warn 行、递归 for-await、return）与 `throw error` 均逐字保留。message 含失败模型名与 aborted-in-stream 说明，cause 传透原错误，满足契约第 4/5 条。

## 4. 自查申报

- 保真自查：glm registry 块（含 :95 顶格故意破损缩进行 `registry['claude-sonnet-4-20250514'] = {`）未动；两处 TEMP DEBUG console.error 未动；chat()/healthCheck()/refreshRegistry() 与全部既有注释未动。三个 Edit 的 old/new 差集仅覆盖上述三 hunk。
- 消费方影响面：网关流式消费方（agent-core / TriLC 侧编排；tree-op 未给具名清单，按已知架构角色申报）。行为变化 = 中途断流从"静默续吐 B 模型输出"变为收到 StreamAbortedError（name='StreamAbortedError'，instanceof 可辨，cause 取原错误）；依赖旧静默拼接行为的调用方需改为"重试整体替换部分输出"语义。新增类为增量导出，无既有签名破坏。
- depth 上限交互：MAX_FALLBACK_DEPTH 判定仍在帧入口 try 之前未动；fallback 仅发生于首事件前，最坏上游调用链仍 ≤3 次（v4-pro↔v4-flash 互备），不因本修复引入新的放大路径；嵌套帧深度计数通道（_depth+1）未变。
- tests 未跑如实声明：本实例无 Bash 工具面，tsc --noEmit、node --test 与字节保真 diff 校验均由编排层门禁窗口执行。静态依据：tsconfig target ES2022 + @types/node ^24 + engines node>=20（super(message, options) 与 Error cause 支持）。潜在门禁摩擦一处：若 lint 有 pin line-length 规则，超长 message 模板串可能报风格告警（不影响语义）。
- 编排层裁定口径转述无误差：任一失败发生于已 yield≥1 之后 → 一律抛 StreamAbortedError({cause: 原错误})，不论 route.fallback 是否存在（无 fallback 也包装，上层统一辨型）；首事件前失败 + 有 fallback → 递归；首事件前失败 + 无 fallback → 原错误原样抛出不动。

## 使用依据

- docs/workflow/operating-records/2026-W35/trees/trimodel-audit-001/reports/rmc-TriModel.md（P0-1 全文；P1-2/P2-4/P2-12 作交互旁证，不在本次修复范围）
- /srv/fleet/TriModel/src/types.ts（StreamEvent 定义与 index 增量合并契约）
- /srv/fleet/TriModel/tsconfig.json、/srv/fleet/TriModel/package.json（ES2022 / node>=20 编译运行面核查）
- tree-op p0fix4-trimodel-stream PE-1 节点修复契约六条与硬约束

落盘清单：/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/p0fix4-trimodel-stream/reports/pe1/client.ts.fixed 297 行；/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/p0fix4-trimodel-stream/reports/pe1/pe1-fix-report.md 86 行
