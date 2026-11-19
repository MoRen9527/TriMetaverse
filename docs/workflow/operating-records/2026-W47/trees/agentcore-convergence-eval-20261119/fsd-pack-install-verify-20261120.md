# FSD 增补报·TriOrchKit 本地安装形态验证（CTO D-15 排工令 1·毕）

- **sourceOfTruth**: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/agentcore-convergence-eval-20261119/
- **syncMode**: 落卷即真源（operating-records 树文件）
- **lastSyncedAt**: 2026-11-19T23:16:47Z（date 现查原值粘贴·+8=11-20 07:16）
- **令源**: cto-c2-tail-dispatch-20261120.md（0ba8e3959）·令 1=sprint 内立即起·deadline 09:00——**07:16 毕·余 1h44m**

## 一·令面分解与毕况

| 令 1 面 | 毕况 |
|---|---|
| npm pack-install 本地安装形态验证 | **毕·双形态对照全谱**（本卷 §二） |
| 套件终态收口毕报（c9/c10+债 k1-k5+POSIX mock e2e 债+Windows EINVAL 勘定注） | **毕·已在前卷**（fsd-contract-suite-closeout-20261120.md·e1e2b0026 在链·BOD 802 认收）——令文时点 23:10:11Z≈前卷落卷时点 23:06:57Z，CTO 拟令时或未见卷——本卷为增量形，前卷全谱不重抄 |

## 二·安装形态双验对照（核心读数）

### 形②·消费仓双依赖形（**接线正形 ✓ 绿**——TriRMC/TriMMC 接线后实装形态）

消费仓 package.json 并列声明双依赖：

```json
{
  "dependencies": {
    "@tricompany/orchestration-kit": "file:../TriOrchKit",
    "@tricompany/agent-core": "file:../TriCompany/packages/agent-core"
  }
}
```

npm install 重算后 symlink 正确落位（基准=消费仓根）：

```
agent-core       -> /d/Code/ai/TriCompany/packages/agent-core
orchestration-kit -> /d/Code/ai/TriOrchKit
```

探针读数（probe.mjs·ESM dynamic import）：

- 出口符号 **22 个全解析**（ContractValidationError/assign/buildRegistry/checkBudget/dispatch/dispatchAsync/escalate/estimateCost/getBudgetState/getConfig/getModelTierPolicy/isTimedOut/listAgents/loadContract/loadEmployeeRegistry/recordCost/resetBudget/resolveContracts/route/sendMessage/spawnSession/transition）
- 函数形态探针：loadEmployeeRegistry/route/dispatch/buildRegistry=**function**（4/5）
- **活行为面**：`route([], {expectedOutputs:['x']})` → `{matched:false, score:0, primary:null}` 空池失配语义正确（现役三层数据面匹配·零参活跑 rc=0）
- 依赖面：added/changed 2 packages·0 vulnerabilities·install rc=0

### 形①·tgz 单依赖形（**✗ 断链实证**——npm pack → 消费仓装 tgz）

`npm pack` 出 tricompany-orchestration-kit-0.1.0.tgz（28.7KB·53 files·dist 面 js+map+**13 个 .d.ts** 全带——包完整性 ✓）→消费仓装 tgz：npm added 2 packages 面成功，但 **kit 内部 import 红形**：

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@tricompany/agent-core'
  imported from .../node_modules/@tricompany/orchestration-kit/dist/contracts/resolver.js
```

根因（symlink 基准错算实证）：

```
agent-core -> <消费仓>/node_modules/@tricompany/TriCompany/packages/agent-core   ← 断链
                    ^^^ tgz 内 "file:../TriCompany/..." 相对基准被错算到 node_modules/@tricompany/ 下
                    （正确应为 <消费仓>/../TriCompany/...）
```

- `ls -la` 面列名在（断链 symlink）——**列名≠内容可用**（值面纪律再锚）
- npm 语义面：`file:` 依赖为本地开发形——经 tgz 发布链保留字面路径，消费侧解析依赖 npm 相对基准实现——本机（node v22.21.1）实证基准错算断链
- **结论**：tgz 单依赖形不可靠——若走 tgz 发布面需 **agent-core 随发 registry 或 kit bundle 物化**（kit 演进项·候 CTO 裁·挂债 k6）

### 如实注（非阻塞）

- `TriRLCDispatchExecutor` **不在根出口**（探针 undefined·executor 面经 `dispatchAsync`/具名 import 承）——现役根出口聚合面设计如此，非安装缺陷，如实记入出口面读数
- 探针 stdout 有 dotenvx 注入提示行（本机 shell profile 面·零敏感值回显）——不影响读数

## 三·技术债标记单（增量）

| 债 | 面 | 偿还计划 |
|---|---|---|
| 债-k6 | kit tgz 发布形内 `file:` 依赖断链（本卷形①实证）——tgz 面消费需 agent-core registry 随发或 bundle 物化 | 候 CTO 裁发布形态（sprint 后窗·接线正形=形②不受此影响） |

## 四·零现役触碰自证

- pack 产物落 `D:\Code\ai\.tmp-fsd-packtest\`（pack --pack-destination 指定·零污染 TriOrchKit 仓根）
- 消费仓=临验目录（sibling 布局同构·`D:\Code\ai\.tmp-fsd-packtest\`）——**零触 TriRMC/TriMMC/daemon 现役面**·零 daemon 重启零配置变更
- **临验仓残迹标注**：`.tmp-fsd-packtest\`（含 tgz+node_modules 双 symlink 面）——rm -rf 权限门未过未删，候窗清（可安全整目录删·零引用面）

## 五·令 3/令 2 承面

- **令 3（预告面）收悉不启动**：双侧消费面接线+C3 四仓活体对表+md5 复验门——sprint 后窗候 COO 统排——本席零动作
- **令 2（sg 裸仓建仓）**：推送面配合候 COS 协调值席窗——本席零自行启动
- 接线技术输入（令 3 前置可复用）：**消费仓双依赖形=形② package.json 范式**（本卷 §二）——TriRMC/TriMMC 接线照此形+kit 内 `file:` 断链面在双声明形下消解（symlink 双落位实证）

## 六·使用依据

- CTO D-15 排工令 cto-c2-tail-dispatch-20261120.md（0ba8e3959）·令 1 全文
- 前卷毕报 fsd-contract-suite-closeout-20261120.md（e1e2b0026·套件终态全谱·债 k1-k5）
- kit package.json（name=@tricompany/orchestration-kit·0.1.0·deps agent-core file: 形）实读
- 本机 node v22.21.1+npm 实跑读数（本卷全部读数为实跑非推演）

---
落卷=FSD 小全（m-fsd）·令 1 毕（07:16+8·deadline 09:00 余 1h44m）·next_agent=CTO（令 1 回执+债 k6 裁面）·令 2/3 承面如实列
