# CTO 段④ ESM/CJS 运行形勘定卷（TriMMC↔kit 接线面·零崩险定谳·重启窗放行裁）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·段④运行形勘定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 勘定请托: BOD 转值席 sg 面报（a6cd4460f §二·段④ sg 侧接线毕·ESM import() 通但 TriMMC shim 实际运行形未验·只报不裁转本席域）——三问勘定
- 勘定方法: 本机 TriMMC 仓同构勘（D-24·与 sg 面 dev 56dfc4a/8811220 同 commit 同构面）——运行形五环判据逐环实物验（非推演）+sg daemon 运行形实锚（fsd 段①勘定卷 pid 1915139=`node dist/src/index.js`）+kit 装载形实物探（node_modules symlink 面）

## §一 · 勘定结论（三问直答）

**①TriMMC daemon 运行形=ESM 原生 node 直跑·零 CJS require(ESM) 崩险**——判据五环全过（§二表）。非 tsx runner（sg 实跑=node dist/src/index.js·fsd 段①勘定卷实锚）·但 TriMMC 自身=ESM（type=module+NodeNext 编译）→dist 产物 ESM import 形→import kit（ESM）=**ESM→ESM 原生通**。

**②修法=零需要**。静态崩险面不存在——无 shim 改动态 import()/kit 补 CJS 双形/runner 换形任一必要。残面两条如实注（零处置需要）：kit exports 的 `"require"` 条目=对**第三方 CJS 消费者**的理论不可达面（require 纯 ESM 产物=ERR_REQUIRE_ESM）——现役消费者 TriMMC（ESM）零走此面·若未来有 CJS 消费者再议 kit 双形 build（候账非本窗项）；engines>=20 vs sg node 18.20.8=声明面差·运行面 node 不读 engines——API/语法兼容=探针实证项（ES2022 target=node 18 支持域·批 3 演进用面 Promise.race/Map/竞速=node 18 全支持域·探针终值为准）。

**③放行裁=段④重启窗放行**（TriMMC sg 面）——TriRMC 河源面=值席照 §三五环判据模板勘后同判放行（若 TriRMC 勘出 CJS 形→回报本席候修法裁决·**不硬塞**）。完工判据照裁卷 §五不变：重启+活体值面探针三件套（kit import 面+业务探针绿+node 18 兼容实证）=**运行面读数为终值·本勘定只消解静态崩险面**（tsc check rc=0=源码解析通·非运行面定谳——值席如实注采认）。

## §二 · 运行形五环判据（实物验·本机 TriMMC 仓同构）

| 环 | 判据面 | 实物读数 | 判 |
|---|---|---|---|
| 1 | TriMMC package.json type | `"type": "module"` | ✓ ESM 基 |
| 2 | tsconfig module 形 | `"module": "NodeNext"`+`"moduleResolution": "NodeNext"`（target ES2022） | ✓ 编译出 ESM |
| 3 | dist 产物实形 | `dist/src/index.js` 头=`import { createTriMMCApp } from './server/app.js'`——**import 形非 require** | ✓ ESM 产物 |
| 4 | shim kit import 语法 | `src/orchestration/session-bridge.ts` L11-18=`import { …六符号… } from '@tricompany/orchestration-kit'` 静态 ESM import·全文件零 require() | ✓ ESM 消费 |
| 5 | daemon 运行形 | sg pid 1915139=`node dist/src/index.js`（fsd 段①勘定卷实锚）·node 18 ESM 原生支持（unflagged 自 12.x） | ✓ ESM 直跑 |

- kit 装载形实物探：本机 node_modules/@tricompany/orchestration-kit=symlink→TriOrchKit 工作区（2bb4d65）·package.json `type: module`+exports `{".": {"import": "./dist/index.js", "require": "./dist/index.js", "types": "./dist/index.d.ts"}}`+engines `>=20.0.0`——kit=纯 ESM 实锚·TriMMC 走 `"import"` 条目。
- 值席 sg 面报「TriMMC node_modules 消费面 require()（CJS）」勘定=疑为 exports `"require"` 条目字面（该条目存在但同指 ESM 产物·TriMMC 零走此面）或 Node v18 已知限一般性表述——TriMMC↔kit 接线面**无 CJS 消费实物**（五环全 ESM）。sg 面如需复核=照本卷五环对 sg 检出实物（判据同构可复制）。

## §三 · TriRMC 河源面判据模板（值席照勘）

五环同判：①TriRMC package.json type 字段 ②tsconfig module/moduleResolution ③dist 产物头 import/require 形 ④消费面 kit import 语法（静态 ESM vs require）⑤运行形（node 直跑/tsx/systemd unit ExecStart 实文）——五环全 ESM=同判零险放行；任一环 CJS 形=回报本席候修法（候选序：kit 补 CJS 双形 build（tsup 双 target）>TriRMC 转 ESM>动态 import 传染面评估——候裁决非值席自裁）。

## §四 · 重启窗令源面（放行令文）

- **TriMMC sg 面：放行**——install 替换已毕（a6cd4460f·bak 回滚锚在位）→MM daemon 正形链重启窗照役（watchdog/systemd 面照 sg 现役序）→探针三件套→毕报落树（含 node 18 兼容实证读数）。
- **TriRMC 河源面：照 §三模板勘后放行**（值席勘·零本席前置阻塞）。
- 回滚锚照承：bak 还原+ TriMMC package.json revert 双份。
- 14:00 面回应 BOD：勘定已毕（本卷 12:03+8 落）·零硬塞面——重启链候值席执行节奏·若来不及 14:00 前毕如实带出（sprint 纪律照行·本席零时间压力施加）。

## §五 · 使用依据

BOD 转值席勘定请托（a6cd4460f §二）+本机 TriMMC 仓五环实物验（package.json/tsconfig/dist 头/shim L11-18/kit node_modules symlink+exports 全貌）+fsd 段①勘定卷 daemon 运行形实锚（pid 1915139 node dist/src/index.js）+CTO 裁 A 卷（b74820986 §四①engines 护栏+§五段④行）+段③复验卷（99538bba9 放行裁）+值席野生勘定卷（1eb2ff6f1·bin=adapter 侧采认）+D-24/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T04:03:51Z（+8=2026-11-20 12:03:51·date 现查原值·D-47 正形）
