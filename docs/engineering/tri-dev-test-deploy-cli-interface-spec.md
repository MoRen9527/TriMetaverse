# TriDev ↔ TriTest ↔ TriDeployment CLI Interface Spec

版本：V1.0
日期：2026-07-13
状态：CTO 签发
所有者：CTO（小狄）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/engineering/tri-dev-test-deploy-cli-interface-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-07-13
- 关联：`tri-dev-test-deploy-decoupling.md` V1.0

## 1. 设计约束

1. **TriDev 侧只做 subprocess 调用**，不做 import/require
2. **输出必须为结构化 JSON**（stdout），通过 `--format json` 控制
3. **exit code 0 = 全通过**，非 0 = 失败/错误
4. **stderr 保留给人读的日志**；stdout 是机器消费的结构化数据
5. **在现有 CLI 入口（cli.ts）基础上精化**，不重写

---

## 2. TriTest CLI Contract

### 2.1 现有 CLI 命令（保持不变）

| 命令 | 用途 | 对应 Phase |
|---|---|---|
| `tritest audit <path>` | 发现并列出测试套件 | — |
| `tritest run <path> [--phase <p>]` | 运行指定 phase 的测试 | universal |
| `tritest run-unit <path>` | 运行单元测试 | unit |
| `tritest run-integration <path>` | 运行集成测试 | integration |
| `tritest run-e2e <path>` | 运行 E2E 测试 | e2e |
| `tritest run-system <path>` | 运行系统测试 | system |
| `tritest run-security <path>` | 运行安全测试 | security |

### 2.2 新增：`--format json` 标志

**所有 run 命令新增此标志。** 启用后 stdout 仅输出单行 JSON，stderr 保留日志。

```bash
# TriDev 调用示例
tritest run ./TriMC --phase integration --format json
# stdout: {"suites":[...],"totalPassed":5,"totalFailed":0,...}
# exit code: 0 (all passed) or 1 (failures)
```

**优先级：P0（阻塞 TriDev phase engine 集成）**

### 2.3 新增：`validate` 命令（QA Phase）

```bash
tritest validate --spec-baseline <hash> --module <path> [--format json]
```

| 参数 | 必需 | 说明 |
|---|---|---|
| `--spec-baseline <hash>` | 是 | spec 基线标识（commit hash / version tag） |
| `--module <path>` | 是 | 模块代码路径 |
| `--format json` | 否 | 机器可读输出 |

行为：
1. 从 spec baseline 加载 spec 文档
2. 扫描模块 artifact（代码、配置、文档）
3. 对每个 artifact 运行对应的 validator
4. 汇总输出 `ValidatorResult`

**优先级：P1（QA phase gate 需要）**

### 2.4 输出 Schema

#### TestRunSummary（所有 run 命令的输出）

```typescript
// 已在 TriTest/src/types.ts 中定义，无需修改
interface TestRunSummary {
  suites: TestResult[];
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalDurationMs: number;
  allPassed: boolean;
  runAt: string; // ISO 8601
}

interface TestResult {
  suiteName: string;
  phase: "unit" | "integration" | "system" | "security" | "e2e";
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  durationMs: number;
  cases: TestCaseResult[];
}

interface TestCaseResult {
  name: string;
  passed: boolean;
  skipped: boolean;
  durationMs?: number;
  error?: string;
}
```

#### ValidatorResult（`validate` 命令的输出）— 新增类型

```typescript
interface ValidatorResult {
  specBaseline: string;          // spec 基线标识
  moduleName: string;            // 被验证模块
  validatedAt: string;           // ISO 8601
  totalArtifacts: number;        // 总 artifact 数
  passed: number;                // 通过的 artifact 数
  failed: number;                // 失败的 artifact 数
  skipped: number;               // 无对应 validator 的 artifact 数
  allPassed: boolean;            // 全部通过
  artifacts: ValidatorArtifactResult[];
  gaps: ValidatorGap[];          // 缺口报告
}

interface ValidatorArtifactResult {
  artifactPath: string;          // artifact 相对路径
  artifactType: string;          // "code" | "config" | "doc" | "schema"
  validatorName: string;         // 应用的验证器名称
  passed: boolean;
  checks: ValidatorCheck[];
  durationMs: number;
}

interface ValidatorCheck {
  name: string;                  // 检查项名称
  passed: boolean;
  detail?: string;               // 通过/失败详情
}

interface ValidatorGap {
  artifactPath: string;
  reason: string;                // 为什么没有验证器覆盖
  severity: "critical" | "warning" | "info";
}
```

---

## 3. TriDeployment CLI Contract

### 3.1 现有 CLI 命令

| 命令 | 用途 |
|---|---|
| `trideploy deploy <name> [--target <t>]` | 部署单个模块 |
| `trideploy deploy-all [--target <t>]` | 部署全部已注册模块 |
| `trideploy stop <name>` | 停止模块 |
| `trideploy status <name>` | 查询状态 |
| `trideploy list` | 列出已注册模块 |
| `trideploy cleanup` | 清理运行实例和僵尸进程 |

### 3.2 新增：`--format json` 标志

**所有命令新增此标志。** `deploy` 命令当前已在 L84 输出 JSON，需统一到 `--format json` 控制。

```bash
# TriDev 调用示例
trideploy deploy TriMC --target local --format json
# stdout: {"success":true,"moduleName":"TriMC","instanceId":"12345",...}
# exit code: 0 (success) or 1 (failure)
```

**优先级：P0（阻塞 TriDev phase engine 集成）**

### 3.3 输出 Schema

#### DeployResult（`deploy` 命令输出）

```typescript
// 已在 TriDeployment/src/types.ts 中定义，需小幅修改
interface DeployResult {
  success: boolean;
  moduleName: string;
  target: string;               // 新增：部署目标类型
  instanceId?: string;
  port?: number;
  health?: HealthStatus;
  error?: string;
  buildLogs: string[];
  deployedAt: string;           // ISO 8601
}

interface HealthStatus {
  healthy: boolean;
  statusCode?: number;
  responseTimeMs?: number;
  url: string;
}
```

#### DeployStatus（`status` 命令输出）

```typescript
// 已在 TriDeployment/src/types.ts 中定义，无需修改
interface DeployStatus {
  moduleName: string;
  running: boolean;
  instanceId?: string;
  port?: number;
  pid?: number;
  uptime?: number;
  health?: HealthStatus;
}
```

---

## 4. TriDev 侧调用契约

TriDev phase engine 在每个 gate 执行以下模式：

```python
import subprocess, json

def run_phase_gate(phase: str, module_path: str, **kwargs) -> dict:
    """通用 phase gate 执行器"""
    if phase in ("VERIFY-INTEGRATION", "REDTEAM", "QA", "ASSURANCE"):
        result = subprocess.run(
            build_tritest_args(phase, module_path, **kwargs),
            capture_output=True, text=True, timeout=300
        )
        return json.loads(result.stdout)
    elif phase == "DEPLOYMENT":
        result = subprocess.run(
            build_trideploy_args(phase, module_path, **kwargs),
            capture_output=True, text=True, timeout=600
        )
        return json.loads(result.stdout)

def build_tritest_args(phase, module_path, **kwargs):
    """构建 tritest 命令参数"""
    args = ["tritest"]
    if phase == "VERIFY-INTEGRATION":
        args += ["run", module_path, "--phase", "integration"]
    elif phase == "REDTEAM":
        args += ["run", module_path, "--phase", "security"]
    elif phase == "QA":
        args += ["validate", "--spec-baseline", kwargs["spec_baseline"], "--module", module_path]
    elif phase == "ASSURANCE":
        args += ["run", module_path, "--phase", "e2e"]
    args.append("--format json")
    return args

def build_trideploy_args(phase, module_path, **kwargs):
    """构建 trideploy 命令参数"""
    target = kwargs.get("target", "local")
    module_name = kwargs.get("module_name")
    return ["trideploy", "deploy", module_name, "--target", target, "--format json"]
```

---

## 5. 实现优先级与分波计划

| Wave | 优先级 | 模块 | 内容 | 依赖 | 估时 |
|---|---|---|---|---|---|
| **Wave 1** | **P0** | TriTest + TriDeployment | 新增 `--format json` 标志，统一 stdout 输出 | 无 | 小 |
| **Wave 2** | **P1** | TriTest | 新增 `validate` 命令 + `ValidatorResult` 类型 | Wave 1 | 中 |
| **Wave 3** | **P2** | TriTest | system-runner + security-runner 实现（当前 system/security fallback 到 integration runner） | Wave 1 | 中 |
| **Wave 4** | **P2** | TriDeployment | `DeployResult.target` 字段补充 | Wave 1 | 小 |
| **Wave 5** | **P3** | TriDev | phase engine 按本 spec 调用 TriTest/TriDeployment | Wave 1-2 | 中 |

### 为什么 Wave 1 是 P0

TriDev phase engine 集成之前，两个 CLI 必须能输出机器可读 JSON。当前只有 `trideploy deploy` 部分支持，其他命令全部缺失。**Wave 1 是阻塞项。**

---

## 6. TriDev ↔ CLI 映射速查表

| TriDev Phase | CLI 命令 | 输入 | 输出类型 | Exit Code 语义 |
|---|---|---|---|---|
| VERIFY-INTEGRATION | `tritest run <path> --phase integration --format json` | modulePath | `TestRunSummary` | 0=全绿, 1=有失败 |
| REDTEAM | `tritest run <path> --phase security --format json` | modulePath | `TestRunSummary` | 0=全绿, 1=有失败 |
| QA | `tritest validate --spec-baseline <hash> --module <path> --format json` | specHash + modulePath | `ValidatorResult` | 0=全通过, 1=有 gap/失败 |
| DEPLOYMENT | `trideploy deploy <name> --target <env> --format json` | moduleName + target | `DeployResult` | 0=成功, 1=失败 |
| ASSURANCE | `tritest run <path> --phase e2e --format json` | modulePath (部署后) | `TestRunSummary` | 0=全绿, 1=有失败 |
